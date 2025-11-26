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

<!-- Resolved: Gemini model updated to gemini-2.5-flash (commit pending) -->
<!-- Resolved: Test infrastructure set up with Vitest, 72 tests passing (commit 0fae52a) -->
