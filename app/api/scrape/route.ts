import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rate-limit';
import { auth } from '@/auth';
import { ensureTrial, getCredits } from '@/lib/credits';
import { validateUrl } from '@/lib/validateUrl';
import { scrape, getScraperProvider } from '@/lib/scraper';

// Edge-compatible for Jina Reader, Node.js fallback for Firecrawl SDK
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ScrapeRequestBody {
  url?: string;
  urls?: string[];
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const rateLimit = await isRateLimited(request, 'scrape');

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    );
  }

  // Enforce auth + credits gating
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
    return NextResponse.json(
      { success: false, error: 'You are out of credits. Buy credits to continue.' },
      { status: 402, headers: { 'X-Credits-Remaining': '0' } }
    );
  }

  try {
    const body = (await request.json()) as ScrapeRequestBody;
    const { url, urls } = body;

    // Single URL scrape
    if (url && typeof url === 'string') {
      // Validate URL to prevent SSRF attacks
      const validation = validateUrl(url);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error || 'Invalid URL.' },
          { status: 400 }
        );
      }

      const provider = getScraperProvider();
      const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

      const result = await scrape(url, provider, firecrawlApiKey);

      if (!result.success) {
        // Map error to appropriate HTTP status
        const status = result.error?.includes('rate limit') ? 429 :
                       result.error?.includes('credits') ? 402 : 502;
        return NextResponse.json(
          { success: false, error: result.error, provider: result.provider },
          { status }
        );
      }

      return NextResponse.json(result);
    }

    // Batch URL scrape
    if (urls && Array.isArray(urls)) {
      // Validate all URLs to prevent SSRF attacks
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

      const provider = getScraperProvider();
      const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

      // Scrape all URLs in parallel
      const results = await Promise.all(
        urls.map((u) => scrape(u, provider, firecrawlApiKey))
      );

      // Aggregate results
      const successResults = results.filter((r) => r.success);
      const failedResults = results.filter((r) => !r.success);

      return NextResponse.json({
        success: failedResults.length === 0,
        data: successResults.map((r) => r.data),
        errors: failedResults.length > 0 ? failedResults.map((r) => r.error) : undefined,
        provider: results[0]?.provider,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request format. Provide url or urls.' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Error in /api/scrape endpoint:', error);
    const err = error as Error;
    const message =
      process.env.NODE_ENV !== 'production'
        ? `Scrape error: ${err.message || 'Unknown error'}`
        : 'An error occurred while processing your request. Please try again later.';

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
