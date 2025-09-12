import { NextResponse } from 'next/server';

export async function GET() {
  const environmentStatus = {
    FIRECRAWL_API_KEY: !!process.env.FIRECRAWL_API_KEY,
    // Prefer GOOGLE_API_KEY for Gemini; also report common alternatives
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    FAL_KEY: !!process.env.FAL_KEY,
    // Clerk auth (frontend + backend)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
  };

  return NextResponse.json({ environmentStatus });
}
