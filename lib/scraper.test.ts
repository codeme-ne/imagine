import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  scrapeWithJina,
  scrapeWithFirecrawl,
  scrape,
  getScraperProvider,
} from './scraper';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('scraper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe('scrapeWithJina', () => {
    it('returns markdown content on success', async () => {
      const markdown = '# Test Page\n\nThis is test content.';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(markdown),
      });

      const result = await scrapeWithJina('https://example.com');

      expect(result.success).toBe(true);
      expect(result.data?.markdown).toBe(markdown);
      expect(result.data?.metadata?.title).toBe('Test Page');
      expect(result.provider).toBe('jina');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://r.jina.ai/https://example.com',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('extracts title from first line if no heading', async () => {
      const markdown = 'Simple title without hash\n\nContent here.';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(markdown),
      });

      const result = await scrapeWithJina('https://example.com');

      expect(result.success).toBe(true);
      expect(result.data?.metadata?.title).toBe('Simple title without hash');
    });

    it('returns error on rate limit (429)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limited'),
      });

      const result = await scrapeWithJina('https://example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('rate limit');
      expect(result.provider).toBe('jina');
    });

    it('returns error on server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server error'),
      });

      const result = await scrapeWithJina('https://example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('500');
    });

    it('returns error on empty content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const result = await scrapeWithJina('https://example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('empty content');
    });
  });

  describe('scrapeWithFirecrawl', () => {
    const apiKey = 'test-firecrawl-key';

    it('returns markdown content on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              markdown: '# Firecrawl Result',
              metadata: { title: 'Test Title' },
            },
          }),
      });

      const result = await scrapeWithFirecrawl('https://example.com', apiKey);

      expect(result.success).toBe(true);
      expect(result.data?.markdown).toBe('# Firecrawl Result');
      expect(result.data?.metadata?.title).toBe('Test Title');
      expect(result.provider).toBe('firecrawl');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.firecrawl.dev/v2/scrape',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );
    });

    it('returns error on credits exhausted (402)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        text: () => Promise.resolve('Credits exhausted'),
      });

      const result = await scrapeWithFirecrawl('https://example.com', apiKey);

      expect(result.success).toBe(false);
      expect(result.error).toContain('credits');
    });

    it('returns error on rate limit (429)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limited'),
      });

      const result = await scrapeWithFirecrawl('https://example.com', apiKey);

      expect(result.success).toBe(false);
      expect(result.error).toContain('rate limit');
    });

    it('handles Firecrawl API failure response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'URL not accessible',
          }),
      });

      const result = await scrapeWithFirecrawl('https://example.com', apiKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('URL not accessible');
    });
  });

  describe('scrape', () => {
    it('uses Jina provider by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('# Content'),
      });

      const result = await scrape('https://example.com', 'jina');

      expect(result.provider).toBe('jina');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('r.jina.ai'),
        expect.anything()
      );
    });

    it('uses Firecrawl when specified', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { markdown: '# Content' },
          }),
      });

      const result = await scrape('https://example.com', 'firecrawl', 'api-key');

      expect(result.provider).toBe('firecrawl');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('firecrawl.dev'),
        expect.anything()
      );
    });

    it('returns error when Firecrawl requested without API key', async () => {
      const result = await scrape('https://example.com', 'firecrawl');

      expect(result.success).toBe(false);
      expect(result.error).toContain('API key not configured');
    });

    it('auto mode: uses Jina first, falls back to Firecrawl on failure', async () => {
      // Jina fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Jina error'),
      });

      // Firecrawl succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { markdown: '# Firecrawl fallback' },
          }),
      });

      const result = await scrape('https://example.com', 'auto', 'api-key');

      expect(result.success).toBe(true);
      expect(result.provider).toBe('firecrawl');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('auto mode: returns Jina result if successful', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('# Jina content'),
      });

      const result = await scrape('https://example.com', 'auto', 'api-key');

      expect(result.success).toBe(true);
      expect(result.provider).toBe('jina');
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only Jina called
    });

    it('auto mode: returns Jina error if no Firecrawl API key for fallback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Jina error'),
      });

      const result = await scrape('https://example.com', 'auto');

      expect(result.success).toBe(false);
      expect(result.provider).toBe('jina');
    });

    it('handles unknown provider', async () => {
      const result = await scrape(
        'https://example.com',
        'unknown' as 'jina'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown scraper provider');
    });
  });

  describe('getScraperProvider', () => {
    it('returns jina by default', () => {
      expect(getScraperProvider()).toBe('jina');
    });

    it('returns firecrawl when env set', () => {
      vi.stubEnv('SCRAPER_PROVIDER', 'firecrawl');
      expect(getScraperProvider()).toBe('firecrawl');
    });

    it('returns auto when env set', () => {
      vi.stubEnv('SCRAPER_PROVIDER', 'auto');
      expect(getScraperProvider()).toBe('auto');
    });

    it('is case insensitive', () => {
      vi.stubEnv('SCRAPER_PROVIDER', 'FIRECRAWL');
      expect(getScraperProvider()).toBe('firecrawl');
    });

    it('defaults to jina for invalid values', () => {
      vi.stubEnv('SCRAPER_PROVIDER', 'invalid');
      expect(getScraperProvider()).toBe('jina');
    });
  });
});
