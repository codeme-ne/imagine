import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { isRateLimited } from '@/lib/rate-limit';

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

  try {
    const app = new FirecrawlApp({ apiKey });
    const body = await request.json() as ScrapeRequestBody;
    const { url, urls, ...params } = body;

    let result: ScrapeResult | null | undefined;

    if (url && typeof url === 'string') {
      result = await app.scrapeUrl(url, params) as ScrapeResult;
    } else if (urls && Array.isArray(urls)) {
      result = await app.batchScrapeUrls(urls, params) as ScrapeResult;
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
    console.error('Error in /api/scrape endpoint (SDK):', error);
    const err = error as ApiError;
    const rawMessage = (err && typeof err.message === 'string') ? err.message : '';

    // Heuristic mapping for common Firecrawl quota/credits/rate errors
    const isQuota = /quota|credit|payment required|402/i.test(rawMessage);
    const isRateLimit = /rate.?limit|too many requests|429/i.test(rawMessage);

    const errorStatus = isQuota
      ? 402
      : isRateLimit
        ? 429
        : (typeof err.status === 'number' && err.status >= 400 ? err.status : 502);

    const errorMessage = isQuota
      ? 'Firecrawl credits exhausted. Add credits or provide a key with available quota.'
      : isRateLimit
        ? 'Firecrawl rate limit reached. Please try again shortly.'
        : 'An error occurred while processing your request. Please try again later.';

    return NextResponse.json({ success: false, error: errorMessage }, { status: errorStatus });
  }
} 