import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { isRateLimited } from '@/lib/rate-limit';
import { auth } from '@/auth';
import { ensureTrial, getCredits } from '@/lib/credits';
import { validateUrl } from '@/lib/validateUrl';

// Ensure we run on Node.js runtime (Firecrawl SDK requires Node APIs) and avoid caching
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ScrapeRequestBody {
  url?: string;
  urls?: string[];
  [key: string]: unknown;
}

interface ScrapeResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

interface ApiError extends Error {
  status?: number;
}

async function scrapeDirect(url: string, params: Record<string, unknown>, apiKey: string): Promise<ScrapeResult> {
  const resp = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url, ...params }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Direct Firecrawl request failed with status ${resp.status}: ${text.slice(0, 300)}`);
  }

  const data = await resp.json().catch(() => ({} as unknown));
  // Normalize the typical shape { success, data }
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid response from Firecrawl (direct).' };
  }
  return data as ScrapeResult;
}

export async function POST(request: NextRequest) {
  const rateLimit = await isRateLimited(request, 'scrape');
  
  if (!rateLimit.success) {
    return NextResponse.json({ 
      success: false,
      error: 'Rate limit exceeded. Please try again later.' 
    }, { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });
  }

  // Enforce auth + credits gating before using Firecrawl
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const user = session.user as { id?: string; email?: string };
  const userId = user.id || user.email || '';
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  await ensureTrial(userId, 1);
  const balance = await getCredits(userId);
  if (balance <= 0) {
    return NextResponse.json({ success: false, error: 'You are out of credits. Buy credits to continue.' }, { status: 402, headers: { 'X-Credits-Remaining': '0' } });
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'API configuration error. Please try again later or contact support.'
    }, { status: 500 });
  }

  try {
    const app = new FirecrawlApp({ apiKey });
    const body = await request.json() as ScrapeRequestBody;
    const { url, urls, ...params } = body;

    let result: ScrapeResult | null | undefined;

    if (url && typeof url === 'string') {
      // Validate URL to prevent SSRF attacks
      const validation = validateUrl(url);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error || 'Invalid URL.' },
          { status: 400 }
        );
      }
      // Support both newer SDK (v4: .scrape) and older SDK (v1: .scrapeUrl)
      const anyApp = app as unknown as Record<string, unknown>;
      try {
        const scrapeV4 = anyApp.scrape as ((u: string, p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined;
        const scrapeV1 = anyApp.scrapeUrl as ((u: string, p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined;
        const v1 = anyApp.v1 as Record<string, unknown> | undefined;
        const scrapeV1Ns = v1 ? (v1.scrapeUrl as ((u: string, p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined) : undefined;

        if (typeof scrapeV4 === 'function') {
          result = await scrapeV4(url, params);
        } else if (typeof scrapeV1 === 'function') {
          result = await scrapeV1(url, params);
        } else if (typeof scrapeV1Ns === 'function') {
          result = await scrapeV1Ns(url, params);
        } else {
          throw new Error('Firecrawl SDK method not found (expected scrape or scrapeUrl)');
        }
      } catch (sdkErr) {
        // If the SDK fails (e.g., bundling/runtime issues), fall back to direct HTTP call
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[scrape] SDK failed; using direct REST fallback:', sdkErr);
        }
        result = await scrapeDirect(url, params, apiKey);
      }
    } else if (urls && Array.isArray(urls)) {
      // Validate all URLs in batch to prevent SSRF attacks
      for (const batchUrl of urls) {
        if (typeof batchUrl === 'string') {
          const validation = validateUrl(batchUrl);
          if (!validation.valid) {
            return NextResponse.json(
              { success: false, error: `Invalid URL in batch: ${validation.error || 'Invalid URL.'}` },
              { status: 400 }
            );
          }
        }
      }
      const anyApp = app as unknown as Record<string, unknown>;
      const batchScrapeV4 = anyApp.batchScrape as ((uu: string[], p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined;
      const batchScrapeV1 = anyApp.batchScrapeUrls as ((uu: string[], p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined;
      const v1 = anyApp.v1 as Record<string, unknown> | undefined;
      const batchScrapeV1Ns = v1 ? (v1.batchScrapeUrls as ((uu: string[], p?: Record<string, unknown>) => Promise<ScrapeResult>) | undefined) : undefined;

      if (typeof batchScrapeV4 === 'function') {
        result = await batchScrapeV4(urls, params);
      } else if (typeof batchScrapeV1 === 'function') {
        result = await batchScrapeV1(urls, params);
      } else if (typeof batchScrapeV1Ns === 'function') {
        result = await batchScrapeV1Ns(urls, params);
      } else {
        throw new Error('Firecrawl SDK method not found (expected batchScrape or batchScrapeUrls)');
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid request format. Please check your input and try again.' }, { status: 400 });
    }

    // Ensure we never return an empty body. Some SDK failures can yield undefined/null without throwing.
    if (!result || typeof result !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Empty response from Firecrawl. Please try again later.' },
        { status: 502 }
      );
    }

    // If the SDK indicates failure, propagate a structured error
    if ('success' in result && (result as ScrapeResult).success === false) {
      const message = (result as ScrapeResult).error || 'Firecrawl request failed.';
      return NextResponse.json(
        { success: false, error: message },
        { status: 502 }
      );
    }

    return NextResponse.json(result as ScrapeResult);

  } catch (error: unknown) {
    // Try to surface as much detail as safely possible without leaking secrets
    console.error('Error in /api/scrape endpoint (SDK):', error);
    const err = error as ApiError;
    const rawMessage = (err && typeof err.message === 'string') ? err.message : '';
    // Some SDK errors include nested response/status info
    const statusFromErr = (() => {
      try {
        const anyErr = err as unknown as Record<string, unknown>;
        const resp = anyErr && typeof anyErr === 'object' ? (anyErr.response as Record<string, unknown> | undefined) : undefined;
        const status = resp && typeof resp.status === 'number' ? resp.status : (typeof (anyErr.status) === 'number' ? (anyErr.status as number) : undefined);
        return status;
      } catch { return undefined; }
    })();

    // Heuristic mapping for common Firecrawl quota/credits/rate errors
    const isQuota = /quota|credit|payment required|402/i.test(rawMessage);
    const isRateLimit = /rate.?limit|too many requests|429/i.test(rawMessage);

    const errorStatus = isQuota
      ? 402
      : isRateLimit
        ? 429
        : (typeof statusFromErr === 'number' && statusFromErr >= 400 ? statusFromErr : (typeof err.status === 'number' && err.status >= 400 ? err.status : 502));

    const errorMessage = isQuota
      ? 'Firecrawl credits exhausted. Add credits or provide a key with available quota.'
      : isRateLimit
        ? 'Firecrawl rate limit reached. Please try again shortly.'
        : (process.env.NODE_ENV !== 'production'
            ? `An error occurred while processing your request. ${rawMessage || 'Please try again later.'}`
            : 'An error occurred while processing your request. Please try again later.');

    return NextResponse.json({ success: false, error: errorMessage }, { status: errorStatus });
  }
} 
