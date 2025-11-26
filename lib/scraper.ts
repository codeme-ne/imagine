/**
 * Scraper abstraction layer supporting multiple providers.
 * Default: Jina Reader (FREE, no API key required)
 * Fallback: Firecrawl (paid, requires FIRECRAWL_API_KEY)
 */

export type ScraperProvider = 'jina' | 'firecrawl' | 'auto';

export interface ScrapeResult {
  success: boolean;
  data?: {
    markdown: string;
    metadata?: {
      title?: string;
      description?: string;
      url?: string;
    };
  };
  error?: string;
  provider?: ScraperProvider;
}

/**
 * Extract title from markdown content (first # heading or first line)
 */
function extractTitle(markdown: string): string | undefined {
  const headingMatch = markdown.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  const firstLine = markdown.split('\n')[0]?.trim();
  if (firstLine && firstLine.length < 200) return firstLine;

  return undefined;
}

/**
 * Scrape URL using Jina Reader (FREE)
 * API: GET https://r.jina.ai/{url}
 * Returns clean markdown content
 */
export async function scrapeWithJina(url: string): Promise<ScrapeResult> {
  const jinaUrl = `https://r.jina.ai/${url}`;

  const resp = await fetch(jinaUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/plain',
    },
  });

  if (!resp.ok) {
    const errorText = await resp.text().catch(() => '');

    if (resp.status === 429) {
      return {
        success: false,
        error: 'Jina Reader rate limit reached. Please try again shortly.',
        provider: 'jina',
      };
    }

    return {
      success: false,
      error: `Jina Reader failed (${resp.status}): ${errorText.slice(0, 200)}`,
      provider: 'jina',
    };
  }

  const markdown = await resp.text();

  if (!markdown || markdown.trim().length === 0) {
    return {
      success: false,
      error: 'Jina Reader returned empty content.',
      provider: 'jina',
    };
  }

  return {
    success: true,
    data: {
      markdown,
      metadata: {
        title: extractTitle(markdown),
        url,
      },
    },
    provider: 'jina',
  };
}

/**
 * Scrape URL using Firecrawl (paid, requires API key)
 */
export async function scrapeWithFirecrawl(
  url: string,
  apiKey: string
): Promise<ScrapeResult> {
  const resp = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!resp.ok) {
    const errorText = await resp.text().catch(() => '');

    if (resp.status === 402) {
      return {
        success: false,
        error: 'Firecrawl credits exhausted. Add credits or switch to Jina Reader.',
        provider: 'firecrawl',
      };
    }

    if (resp.status === 429) {
      return {
        success: false,
        error: 'Firecrawl rate limit reached. Please try again shortly.',
        provider: 'firecrawl',
      };
    }

    return {
      success: false,
      error: `Firecrawl request failed (${resp.status}): ${errorText.slice(0, 200)}`,
      provider: 'firecrawl',
    };
  }

  const data = await resp.json().catch(() => null);

  if (!data || typeof data !== 'object') {
    return {
      success: false,
      error: 'Invalid response from Firecrawl.',
      provider: 'firecrawl',
    };
  }

  // Firecrawl returns { success, data: { markdown, metadata } }
  if (data.success === false) {
    return {
      success: false,
      error: data.error || 'Firecrawl request failed.',
      provider: 'firecrawl',
    };
  }

  const markdown = data.data?.markdown || data.markdown || '';
  const metadata = data.data?.metadata || data.metadata || {};

  return {
    success: true,
    data: {
      markdown,
      metadata: {
        title: metadata.title,
        description: metadata.description,
        url,
      },
    },
    provider: 'firecrawl',
  };
}

/**
 * Main scraper entry point with provider selection.
 *
 * @param url - URL to scrape
 * @param provider - Provider to use ('jina' | 'firecrawl' | 'auto')
 * @param firecrawlApiKey - Optional Firecrawl API key (required for 'firecrawl' and 'auto' fallback)
 */
export async function scrape(
  url: string,
  provider: ScraperProvider = 'jina',
  firecrawlApiKey?: string
): Promise<ScrapeResult> {
  // Direct provider selection
  if (provider === 'jina') {
    return scrapeWithJina(url);
  }

  if (provider === 'firecrawl') {
    if (!firecrawlApiKey) {
      return {
        success: false,
        error: 'Firecrawl API key not configured.',
        provider: 'firecrawl',
      };
    }
    return scrapeWithFirecrawl(url, firecrawlApiKey);
  }

  // Auto mode: try Jina first, fallback to Firecrawl
  if (provider === 'auto') {
    const jinaResult = await scrapeWithJina(url);

    if (jinaResult.success) {
      return jinaResult;
    }

    // Jina failed, try Firecrawl if API key available
    if (firecrawlApiKey) {
      const firecrawlResult = await scrapeWithFirecrawl(url, firecrawlApiKey);
      return firecrawlResult;
    }

    // No fallback available, return Jina error
    return jinaResult;
  }

  return {
    success: false,
    error: `Unknown scraper provider: ${provider}`,
  };
}

/**
 * Get configured scraper provider from environment
 */
export function getScraperProvider(): ScraperProvider {
  const provider = process.env.SCRAPER_PROVIDER?.toLowerCase();

  if (provider === 'firecrawl') return 'firecrawl';
  if (provider === 'auto') return 'auto';

  // Default to Jina (free)
  return 'jina';
}
