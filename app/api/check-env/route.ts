import { NextResponse } from 'next/server';

/**
 * Check environment variable status
 * Note: This endpoint should be protected or removed in production
 * as it reveals configuration status which could be used for reconnaissance
 */
export async function GET() {
  // In production, consider requiring authentication or removing this endpoint
  if (process.env.NODE_ENV === 'production' && process.env.DISABLE_CHECK_ENV === 'true') {
    return NextResponse.json(
      { error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }

  const environmentStatus = {
    FIRECRAWL_API_KEY: !!process.env.FIRECRAWL_API_KEY,
    // Prefer GOOGLE_API_KEY for Gemini; also report common alternatives
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    FAL_KEY: !!process.env.FAL_KEY,
    // Auth (NextAuth + Resend)
    AUTH_RESEND_KEY: !!process.env.AUTH_RESEND_KEY,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    // Rate limiting
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  return NextResponse.json({ environmentStatus });
}
