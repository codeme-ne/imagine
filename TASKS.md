# Auth-Migration: Clerk zu NextAuth.js (Magic Link)

## Phase 1: Bestehende Authentifizierung (Clerk.js) entfernen

- [x] **Abhängigkeiten deinstallieren:** Entferne `@clerk/nextjs` aus `package.json` und führe `npm install` aus.
- [x] **Layout-Datei (`app/layout.tsx`) bereinigen:**
    - [x] Entferne den `ClerkProvider`, der das gesamte Layout umschliesst.
    - [x] Lösche alle Clerk-spezifischen Imports (z.B. `SignedIn`, `SignedOut`, `UserButton`).
    - [x] Entferne die Header-Logik, die den Anmeldestatus anzeigt.
- [x] **Middleware (`middleware.ts`) aktualisieren:**
    - [x] Lösche die `clerkMiddleware` und den `createRouteMatcher`.
    - [x] Der Inhalt der Datei wird vorübergehend leer sein, bis wir die neue Middleware für NextAuth.js implementieren.
- [x] **Landing Page (`app/landing/page.tsx`) anpassen:**
    - [x] Entferne den Import und die Verwendung der `<SignUpButton>` Komponente.
- [x] **Umgebungsvariablen (`.env.local`) aufräumen:**
    - [x] Lösche alle Umgebungsvariablen, die mit `CLERK_` beginnen.

## Phase 2: Magic Link mit NextAuth.js implementieren

- [x] **Abhängigkeiten installieren:** Füge `next-auth` zum Projekt hinzu (`npm install next-auth`).
- [x] **Umgebungsvariablen einrichten:**
    - [x] Füge `AUTH_SECRET` für die Sitzungsverschlüsselung hinzu.
    - [x] Füge die Variablen für den E-Mail-Provider hinzu (z.B. `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_FROM`).
- [x] **NextAuth API-Route erstellen:**
    - [x] Erstelle die Datei `app/api/auth/[...nextauth]/route.ts`.
    - [x] Konfiguriere den `EmailProvider` für Magic Links.
- [x] **SessionProvider einrichten:**
    - [x] Erstelle eine neue Provider-Komponente (z.B. `components/AuthProvider.tsx`).
    - [x] Umschliesse das Layout in `app/layout.tsx` mit dem `SessionProvider`.
- [x] **Benutzeroberfläche für die Anmeldung erstellen:**
    - [x] Erstelle eine neue Seite (z.B. `app/auth/signin/page.tsx`), die ein Formular zur Eingabe der E-Mail-Adresse enthält.
- [x] **Anmelde-Status in der UI anzeigen:**
    - [x] Füge dem Header in `app/layout.tsx` Logik hinzu, um den Anmeldestatus zu überprüfen.
    - [x] Zeige einen "Anmelden"-Button für nicht authentifizierte Benutzer an.
    - [x] Zeige die E-Mail des Benutzers und einen "Abmelden"-Button für authentifizierte Benutzer an.
- [x] **Routen schützen:**
    - [x] Aktualisiere `middleware.ts`, um die Routen zu schützen und Benutzer bei Bedarf zur Anmeldeseite umzuleiten.
