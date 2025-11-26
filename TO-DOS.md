# TO-DOS

<!-- All security findings from 2025-11-26 code review resolved in commit 57b463d -->

## Code TODOs Added 2025-11-26

The following inline TODOs were added to the codebase:

| Category | File | Description |
|----------|------|-------------|
| Testing | `app/api/imagen4/route.ts:16` | Unit tests for credit debit/refund flow |
| Testing | `app/api/scrape/route.ts:7` | Integration tests for SSRF protection |
| Observability | `lib/credits.ts:3` | Structured logging for billing audit trail |
| Reliability | `app/api/webhooks/stripe/route.ts:6` | Dead-letter handling for failed webhooks |
| Performance | `app/api/gemini/route.ts:9` | Response caching for identical prompts |
| i18n | `app/(legal)/datenschutz/page.tsx:5` | Future internationalization (existing) |

Use `grep -rn "TODO:" --include="*.ts" --include="*.tsx" .` to find all TODOs.

## Set Up Test Infrastructure - 2025-11-26 06:48

- **Configure Vitest and Testing Library** - Initialize test framework for API routes and utilities. **Problem:** Project has zero tests despite handling billing (credits, Stripe webhooks) and security-sensitive code (SSRF validation). The 5 inline TODOs above all require a test runner first. **Files:** `package.json` (add devDeps), `vitest.config.ts` (new), `lib/credits.ts:57-109` (Lua script needs tests), `app/api/scrape/route.ts:37-133` (validateUrl function needs tests). **Solution:** Use Vitest + msw for API mocking; prioritize credits.ts and validateUrl tests first since they handle money and security.
