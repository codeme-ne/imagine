# Repository Guidelines

## Project Structure & Module Organization
- `app/` Next.js App Router pages and API routes (`app/api/{scrape,gemini,imagen4,check-env}/route.ts`).
- `components/ui/` Reusable Shadcn/Radix UI components (files kebab-case, exports PascalCase).
- `hooks/` React hooks (e.g., `use-mobile.ts`).
- `lib/` Utilities, error handling, and rate limiting (`utils.ts`, `error-handler.ts`, `rate-limit.ts`).
- `public/` Static assets and example images.
- Root configs: `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `eslint.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` Start local dev server with Turbopack.
- `npm run build` Production build of the Next.js app.
- `npm start` Run the production server (after build).
- `npm run lint` Lint with ESLint/Next rules.
Examples (pnpm also works): `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.

## Coding Style & Naming Conventions
- Language: TypeScript + React 19 + Next.js 15.
- Indentation: 2 spaces; prefer early returns and small functions.
- Components: PascalCase exports in `.tsx`; file names kebab-case (`button.tsx` → `Button`).
- Hooks: `use-*.ts` files with camelCase exports (`useMobile`).
- Utilities in `lib/`: descriptive names (`formatX`, `toY`).
- Run `npm run lint` and fix warnings before pushing.

## Testing Guidelines
- No test runner is configured yet. If adding tests:
  - Unit: Vitest + Testing Library; E2E: Playwright.
  - File names: `*.test.ts`/`*.test.tsx`; co-locate near source or in `__tests__/`.
  - Aim for critical-path coverage of API routes and `lib/` utilities.

## Commit & Pull Request Guidelines
- Use concise, action-oriented commits; Conventional Commits encouraged:
  - `feat: add imagen4 style presets`
  - `fix(api): handle empty url error`
- PRs should include:
  - Clear description, rationale, and screenshots/JSON examples for API/UI changes.
  - Linked issue (if applicable) and testing notes (manual steps or test commands).

## Security & Configuration Tips
- Create `.env.local` with required keys: `FIRECRAWL_API_KEY`, `GEMINI_API_KEY`, `FAL_KEY` (prod-only: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`). Never commit env files.
- Verify configuration via `GET /api/check-env` while running locally.
- Rate limiting is enforced per endpoint via Upstash in production—avoid logging secrets; prefer `lib/error-handler.ts` for errors.
