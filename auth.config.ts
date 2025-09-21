import type { NextAuthConfig } from 'next-auth';

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

      const isAppRoute = pathname === '/';
      const isLandingRoute = pathname === '/landing';

      if (isAppRoute && !isLoggedIn) {
        // Nicht angemeldet -> zur Landing umleiten
        return Response.redirect(new URL('/landing', nextUrl));
      }

      if (isLandingRoute && isLoggedIn) {
        // Angemeldet -> zur App umleiten
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Provider werden in auth.ts definiert
} satisfies NextAuthConfig;