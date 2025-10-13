import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { type NextRequest } from 'next/server';

// Get the base auth middleware
const baseAuthMiddleware = NextAuth(authConfig).auth;

// Wrap the auth middleware to add security logging
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log suspicious patterns in production
  if (process.env.NODE_ENV === 'production') {
    // Log potential SQL injection attempts
    if (/[';]|--|\bOR\b|\bAND\b/i.test(pathname)) {
      console.warn('[Security] Suspicious SQL-like pattern in path:', {
        pathname,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      });
    }
    
    // Log potential XSS attempts
    if (/<script|javascript:/i.test(pathname)) {
      console.warn('[Security] Suspicious XSS pattern in path:', {
        pathname,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      });
    }
  }
  
  // Cast to the proper type for NextAuth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return baseAuthMiddleware(request as any);
}

export const config = {
  matcher: [
    // Next.js-Interna und alle statischen Dateien überspringen
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Immer für API-Routen ausführen
    '/(api|trpc)(.*)',
  ],
}