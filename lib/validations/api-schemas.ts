import { z } from 'zod';
import { urlSchema, safeStringSchema } from './common';

/**
 * Schema for scrape API endpoint
 */
export const scrapeRequestSchema = z.object({
  url: urlSchema.optional(),
  urls: z.array(urlSchema).max(10, 'Maximum 10 URLs allowed').optional(),
  formats: z.array(z.string()).optional(),
  includeTags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  headers: z.record(z.string()).optional(),
  waitFor: z.number().min(0).max(30000).optional(),
  timeout: z.number().min(1000).max(60000).optional(),
}).refine(
  (data) => data.url || (data.urls && data.urls.length > 0),
  { message: 'Either url or urls must be provided' }
);

export type ScrapeRequest = z.infer<typeof scrapeRequestSchema>;

/**
 * Schema for Gemini prompt generation endpoint
 */
export const geminiRequestSchema = z.object({
  prompt: safeStringSchema(50000),
});

export type GeminiRequest = z.infer<typeof geminiRequestSchema>;

/**
 * Schema for Imagen4 image generation endpoint
 */
export const imagen4RequestSchema = z.object({
  prompt: safeStringSchema(5000),
});

export type Imagen4Request = z.infer<typeof imagen4RequestSchema>;

/**
 * Generic error response schema
 */
export const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    correlationId: z.string().optional(),
    type: z.string().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
