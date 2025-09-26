import { NextResponse } from 'next/server';

export async function GET() {
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
  };

  return NextResponse.json({ environmentStatus });
}
