# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

## Project Overview

This is a Next.js 15 application that transforms websites into beautiful AI-generated images. The app extracts content from URLs using Firecrawl, generates image prompts with Google Gemini 2.5 Flash, and creates images using Google Imagen 4 via Fal.ai. Built with TypeScript, React 19, Tailwind CSS, and NextAuth (email via Resend).

## Development Commands

- `pnpm dev` or `npm run dev` - Start development server with Turbopack
- `pnpm build` or `npm run build` - Build production version
- `pnpm start` or `npm run start` - Run production server
- `pnpm lint` or `npm run lint` - Run ESLint with Next.js rules

**Always run `npm run lint` before committing changes.**

## Security Guidelines

### Input Validation
- **ALL** API routes must validate inputs using Zod schemas from `lib/validations/`
- URLs must be validated for protocol, length, and private network access
- Prompt lengths are enforced (5KB for Imagen4, 50KB for Gemini)
- Use `scrapeRequestSchema`, `geminiRequestSchema`, or `imagen4RequestSchema`

### Authentication & Authorization
- Use `getUserId()` from `lib/auth-utils.ts` to safely extract user IDs
- Never trust raw session data without validation
- Session timeout: 30 days with 24-hour update intervals
- All protected routes require valid session

### Error Handling
- Use `handleNextError()` or `handleEdgeError()` from `lib/error-handler.ts`
- Never expose stack traces or sensitive data in error responses
- All errors include correlation IDs for tracing
- Error messages are automatically sanitized to remove API keys/tokens

### Rate Limiting
- IP-based rate limiting: 50 requests/day per endpoint (Upstash Redis)
- User-based rate limiting: 50 images/hour for Imagen4 (resource-intensive)
- Rate limits fail-open if Redis is unavailable (development/errors)
- Custom limits can be configured in `lib/security-constants.ts`

### API Security
- Timeout all external API calls (30s for images, 60s for scraping)
- Use `fetchWithTimeout()` from `lib/timeout-handler.ts`
- Sanitize all API responses with `sanitizeObject()` before logging
- Never log API keys, tokens, or credentials

### Security Headers
- All routes have security headers (X-Frame-Options, CSP, etc.)
- Content Security Policy restricts external resources
- Configured in `next.config.ts` headers function

## Architecture Overview

### Core Workflow
1. **URL Input** → Firecrawl extracts website content as markdown
2. **Style Selection** → User chooses from 6 built-in image styles (GHIBLI, LEGO, CLAYMATION, LOGO, WHIMSICAL, SUMI-E)
3. **Content Processing** → Gemini generates optimized image prompt from website content
4. **Image Generation** → Imagen 4 creates final image using combined content + style prompts
5. **Download/Regenerate** → User can download or regenerate with same prompts

### Key Application Structure

- **`app/`** - Next.js App Router with main pages and API routes
  - `app/page.tsx` - Main URL-to-image workflow interface with 6-step progress bar
  - `app/landing/page.tsx` - Marketing landing page for unauthenticated users
  - `app/layout.tsx` - Root layout with header and global styles (NextAuth)
  - `app/api/` - Backend API routes for external service integration

- **`components/ui/`** - Shadcn/Radix UI components (kebab-case files, PascalCase exports)

- **`lib/`** - Core utilities and infrastructure
  - `lib/utils.ts` - Tailwind class merging utility (cn function)
  - `lib/rate-limit.ts` - Upstash Redis rate limiting (50 req/IP/day per endpoint)
  - `lib/error-handler.ts` - Centralized error handling

### API Routes Architecture

All API routes implement rate limiting and follow consistent error handling patterns:

- **`/api/scrape`** - Firecrawl integration for website content extraction
- **`/api/gemini`** - Google Gemini streaming prompt generation with thinking steps
- **`/api/imagen4`** - Fal.ai Imagen 4 image generation
- **`/api/check-env`** - Environment variable validation for required keys (no client key entry)

### State Management

The main application (`app/page.tsx`) uses React state for:
- **Multi-step workflow** - 6-step progress tracking with current step state
- **Session storage** - Temporary prompt caching for navigation between steps
- **Loading states** - Per-step loading indicators and error boundaries
- **API key handling** - Server-side environment variables (no in-app key entry)

### Authentication & Security

- **NextAuth + Resend** - Passwordless email auth with protected routes
- **Middleware** - Route protection redirecting unauthenticated users to `/landing`
- **Rate Limiting** - Per-endpoint, per-IP limits via Upstash Redis in production
- **Fail-open Pattern** - Rate limiting gracefully degrades in development/errors

## Environment Variables

**Required for full functionality:**
```env
# Core services
FIRECRAWL_API_KEY=fc-xxx
GEMINI_API_KEY=xxx (or GOOGLE_API_KEY)
FAL_KEY=xxx

# Authentication (NextAuth + Resend)
AUTH_RESEND_KEY=re_...
EMAIL_FROM=hello@example.com
# NEXTAUTH_URL=https://your-domain.com (production)

# Production rate limiting (optional)
UPSTASH_REDIS_REST_URL=xxx
UPSTASH_REDIS_REST_TOKEN=xxx
```

Use `/api/check-env` to verify configuration. Keys are provided by the server environment; no client key input.

## Code Style & Patterns

- **TypeScript** - Strict mode enabled, proper interface definitions for API responses
- **Components** - PascalCase exports, kebab-case filenames
- **Hooks** - `use-*.ts` pattern with camelCase exports
- **Styling** - Tailwind CSS with shadcn/ui components, CSS custom properties for themes
- **Error Handling** - Structured try/catch with user-friendly error messages and fallbacks

## Testing

No test framework is currently configured. When adding tests:
- Unit tests: Vitest + Testing Library
- E2E tests: Playwright
- Focus on API routes (`app/api/`) and utility functions (`lib/`)

## Built-in Image Styles

The application includes 6 preset image styles with corresponding prompts:
- **GHIBLI** - Studio Ghibli illustration style with soft, pastel colors
- **LEGO** - LEGO brick construction with bright, primary colors
- **CLAYMATION** - Clay-like texture with stop-motion aesthetic
- **LOGO** - Clean vector art logo with flat colors and geometric shapes
- **WHIMSICAL** - Whimsical storybook illustration with soft pastel palette
- **SUMI-E** - Traditional sumi-e ink wash style with stark black/white contrasts

## Key Integration Points

- **Firecrawl** - Website content extraction with markdown output
- **Google Gemini** - Streaming prompt generation with JSON response chunks
- **Fal.ai** - Imagen 4 access with base64 image responses
- **Upstash Redis** - Production rate limiting with graceful degradation

## Important Implementation Notes

- All API routes use consistent error handling and rate limiting patterns
- The main workflow uses server-provided environment keys
- Prompt generation uses streaming responses with "thinking steps" displayed to users
- Image generation combines content prompts with style-specific prompts
- Session storage prevents prompt regeneration during navigation
- The app handles authentication redirects between `/` (protected) and `/landing` (public)
