import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Exportiert die auth middleware mit Edge-kompatibler Konfiguration
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Next.js-Interna und alle statischen Dateien überspringen
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Immer für API-Routen ausführen
    '/(api|trpc)(.*)',
  ],
}