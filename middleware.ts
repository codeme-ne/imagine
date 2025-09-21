import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth';

const isAppRoute = (pathname: string) => pathname === '/';
const isLandingRoute = (pathname: string) => pathname === '/landing';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const userIsOnApp = isAppRoute(pathname);
  const userIsOnLanding = isLandingRoute(pathname);
  
  if (userIsOnApp && !session) {
    // Benutzer ist auf der App-Seite, aber nicht angemeldet -> zur Landing-Page umleiten
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  if (userIsOnLanding && session) {
    // Benutzer ist auf der Landing-Page, aber bereits angemeldet -> zur App umleiten
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // In allen anderen Fällen (z.B. Auth-Routen oder wenn die Bedingungen nicht zutreffen),
  // fahre normal fort.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Next.js-Interna und alle statischen Dateien überspringen
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Immer für API-Routen ausführen
    '/(api|trpc)(.*)',
  ],
}
