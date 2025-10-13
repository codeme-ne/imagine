import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { isRateLimited } from '@/lib/rate-limit';
import { auth } from '@/auth';
import { ensureTrial, getCredits } from '@/lib/credits';
import { getUserId } from '@/lib/auth-utils';
import { scrapeRequestSchema } from '@/lib/validations/api-schemas';
import { handleNextError, ErrorType } from '@/lib/error-handler';

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
  try {
    const rateLimit = await isRateLimited(request, 'scrape');
    
    if (!rateLimit.success) {
      return handleNextError(
        new Error('Rate limit exceeded'),
        ErrorType.RATE_LIMIT,
        'scrape-api',
        { limit: rateLimit.limit, remaining: rateLimit.remaining }
      );
    }

    // Enforce auth + credits gating before using Firecrawl
    const session = await auth();
    const userId = getUserId(session);
    
    if (!userId) {
      return handleNextError(
        new Error('User not authenticated'),
        ErrorType.AUTHENTICATION,
        'scrape-api'
      );
    }
  await ensureTrial(userId, 1);
  const balance = await getCredits(userId);
  if (balance <= 0) {
    return NextResponse.json({ success: false, error: 'You are out of credits. Buy credits to continue.' }, { status: 402, headers: { 'X-Credits-Remaining': '0' } });
  }

  let apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    const headerApiKey = request.headers.get('X-Firecrawl-API-Key');
    
    if (!headerApiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'API configuration error. Please try again later or contact support.' 
      }, { status: 500 });
    }
    
    apiKey = headerApiKey;
  }

    // Validate request body
    let body: ScrapeRequestBody;
    try {
      const rawBody = await request.json();
      const validated = scrapeRequestSchema.safeParse(rawBody);
      
      if (!validated.success) {
        return handleNextError(
          new Error(validated.error.errors[0]?.message || 'Invalid request'),
          ErrorType.VALIDATION,
          'scrape-api',
          { errors: validated.error.errors }
        );
      }
      
      body = validated.data as ScrapeRequestBody;
    } catch (parseError) {
      return handleNextError(
        parseError,
        ErrorType.VALIDATION,
        'scrape-api',
        { message: 'Failed to parse request body' }
      );
    }

    const app = new FirecrawlApp({ apiKey });
    const { url, urls, ...params } = body;

    let result: ScrapeResult | null | undefined;

    if (url && typeof url === 'string') {
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
    const err = error as ApiError;
    const rawMessage = (err && typeof err.message === 'string') ? err.message : '';
    
    // Heuristic mapping for common Firecrawl quota/credits/rate errors
    const isQuota = /quota|credit|payment required|402/i.test(rawMessage);
    const isRateLimit = /rate.?limit|too many requests|429/i.test(rawMessage);

    if (isQuota) {
      return handleNextError(
        error,
        ErrorType.API_ERROR,
        'scrape-api',
        { message: 'Firecrawl credits exhausted' }
      );
    }
    
    if (isRateLimit) {
      return handleNextError(
        error,
        ErrorType.RATE_LIMIT,
        'scrape-api',
        { message: 'Firecrawl rate limit reached' }
      );
    }

    return handleNextError(error, ErrorType.API_ERROR, 'scrape-api');
  }
} 
