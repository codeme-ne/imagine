import type { NextAuthConfig } from 'next-auth';

// Define all public pages that don't require authentication
const publicPages = [
  '/landing',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/gallery',
  '/pricing',
  '/prompt-guide',
  '/use-cases',
  '/enterprise'
];

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Auth-Routen explizit erlauben
      if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth')) {
        return true;
      }

      // Check if the current path is a public page
      const isPublicPage = publicPages.some(page => pathname.startsWith(page));

      // Public pages are always accessible
      if (isPublicPage) {
        // Special case: redirect logged-in users from /landing to app
        if (pathname === '/landing' && isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // Protected route (including root '/') - require authentication
      if (!isLoggedIn) {
        // Not logged in -> redirect to landing
        return Response.redirect(new URL('/landing', nextUrl));
      }

      // User is logged in and accessing protected route
      return true;
    },
  },
  providers: [], // Provider werden in auth.ts definiert
} satisfies NextAuthConfig;