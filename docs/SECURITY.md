# Security Documentation

This document outlines the security measures implemented in the Imagine application.

## 🛡️ Security Features

### 1. Security Headers

All routes are protected with comprehensive security headers configured in `next.config.ts`:

- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Disables unnecessary browser features (camera, microphone, geolocation)
- **X-XSS-Protection: 1; mode=block** - Legacy XSS protection
- **Content-Security-Policy** - Comprehensive CSP with allowlist for external APIs

### 2. Input Validation

All user inputs are validated using Zod schemas located in `lib/validations/`:

#### URL Validation (`lib/validations/common.ts`)
- Protocol validation (http/https only)
- Length limits (max 2048 characters)
- Private network blocking in production (localhost, 127.0.0.1, private IPs)
- Automatic sanitization

#### API Request Validation (`lib/validations/api-schemas.ts`)
- **Scrape API**: URL validation, max 10 URLs per request
- **Gemini API**: Prompt length limit (50KB)
- **Imagen4 API**: Prompt length limit (5KB)

#### Usage
```typescript
import { scrapeRequestSchema } from '@/lib/validations/api-schemas';

const validated = scrapeRequestSchema.safeParse(requestBody);
if (!validated.success) {
  // Handle validation error
}
```

### 3. Authentication & Authorization

#### Session Management
- **Strategy**: JWT-based sessions for edge compatibility
- **Session Timeout**: 30 days
- **Session Update**: 24 hours
- **User ID Validation**: Centralized via `lib/auth-utils.ts`

#### User ID Extraction
```typescript
import { getUserId } from '@/lib/auth-utils';

const userId = getUserId(session);
if (!userId) {
  return handleError(...);
}
```

### 4. Rate Limiting

Two-tier rate limiting system:

#### IP-Based Rate Limiting (`lib/rate-limit.ts`)
- **Limit**: 50 requests per day per endpoint
- **Scope**: Per IP address
- **Endpoints**: scrape, gemini, imagen4
- **Fail-open**: Gracefully degrades if Redis unavailable

#### User-Based Rate Limiting (`lib/user-rate-limit.ts`)
- **Limit**: 50 images per hour (Imagen4)
- **Scope**: Per authenticated user
- **Algorithm**: Sliding window
- **Fail-open**: Gracefully degrades if Redis unavailable

#### Configuration
Rate limits can be adjusted in `lib/security-constants.ts`:
```typescript
export const RATE_LIMITS = {
  IP_SCRAPE: { limit: 50, window: '1 d' },
  USER_IMAGEN4: { limit: 50, window: '1 h' },
  // ...
};
```

### 5. Error Handling

Centralized error handling prevents information leakage:

#### Features
- **Correlation IDs**: Every error has a unique tracking ID
- **Message Sanitization**: Removes API keys, tokens, and sensitive data
- **Stack Trace Protection**: Stack traces only logged server-side
- **Consistent Types**: `ErrorType` enum for all error categories

#### Usage
```typescript
import { handleNextError, ErrorType } from '@/lib/error-handler';

try {
  // Your code
} catch (error) {
  return handleNextError(error, ErrorType.API_ERROR, 'my-api');
}
```

#### Error Types
- `VALIDATION`: Invalid input (400)
- `AUTHENTICATION`: Auth required (401)
- `AUTHORIZATION`: Permission denied (403)
- `RATE_LIMIT`: Rate limit exceeded (429)
- `NOT_FOUND`: Resource not found (404)
- `API_ERROR`: External API error (502)
- `SERVER_ERROR`: Internal error (500)

### 6. Response Sanitization

Automatic sanitization of all logged data via `lib/response-sanitizer.ts`:

#### Features
- Removes API keys, tokens, passwords from logs
- Sanitizes error messages
- Redacts sensitive headers
- Recursive object sanitization

#### Sensitive Keys (Auto-redacted)
- apiKey, api_key, token, accessToken, refreshToken
- secret, password, credentials, privateKey
- Authorization headers
- Any key containing these terms

### 7. Timeout Handling

All external API calls have timeout protection via `lib/timeout-handler.ts`:

#### Timeouts
- **API Requests**: 30 seconds
- **Image Fetching**: 30 seconds
- **Scraping**: 60 seconds

#### Usage
```typescript
import { fetchWithTimeout } from '@/lib/timeout-handler';

const response = await fetchWithTimeout(url, options, 30000);
```

### 8. Middleware Security

Security monitoring in `middleware.ts`:

#### Features
- Logs suspicious SQL injection patterns
- Logs potential XSS attempts
- IP address tracking for security events
- Production-only logging (no noise in development)

### 9. Environment Variable Security

#### Required Variables
All sensitive environment variables are validated on startup (`auth.ts`):
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- AUTH_RESEND_KEY
- EMAIL_FROM
- AUTH_SECRET
- FIRECRAWL_API_KEY
- GEMINI_API_KEY
- FAL_KEY

#### Best Practices
- Never commit `.env` files
- Use different keys for development/production
- Rotate API keys regularly
- Use environment-specific secrets

### 10. Content Security Policy (CSP)

Restrictive CSP implemented in `next.config.ts`:

```typescript
"default-src 'self'",
"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
"style-src 'self' 'unsafe-inline'",
"img-src 'self' data: https: blob:",
"connect-src 'self' https://api.firecrawl.dev ...",
"frame-ancestors 'none'",
```

#### Allowed External Domains
- api.firecrawl.dev (scraping)
- generativelanguage.googleapis.com (Gemini)
- fal.ai, queue.fal.run (Imagen4)

## 🔒 Security Best Practices

### For Developers

1. **Always validate inputs** using Zod schemas
2. **Never log sensitive data** (API keys, tokens, passwords)
3. **Use centralized error handlers** for consistent security
4. **Add timeouts** to all external API calls
5. **Check authentication** using `getUserId()` utility
6. **Sanitize user inputs** before processing
7. **Use constants** from `lib/security-constants.ts`

### For API Routes

```typescript
import { auth } from '@/auth';
import { getUserId } from '@/lib/auth-utils';
import { handleNextError, ErrorType } from '@/lib/error-handler';
import { isRateLimited } from '@/lib/rate-limit';
import { myRequestSchema } from '@/lib/validations/api-schemas';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimit = await isRateLimited(request, 'my-endpoint');
    if (!rateLimit.success) {
      return handleNextError(new Error('Rate limit'), ErrorType.RATE_LIMIT, 'my-api');
    }

    // 2. Authentication
    const session = await auth();
    const userId = getUserId(session);
    if (!userId) {
      return handleNextError(new Error('Unauthorized'), ErrorType.AUTHENTICATION, 'my-api');
    }

    // 3. Input validation
    const body = await request.json();
    const validated = myRequestSchema.safeParse(body);
    if (!validated.success) {
      return handleNextError(
        new Error(validated.error.errors[0]?.message),
        ErrorType.VALIDATION,
        'my-api'
      );
    }

    // 4. Your business logic
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleNextError(error, ErrorType.SERVER_ERROR, 'my-api');
  }
}
```

## 🚨 Security Incidents

### Reporting
If you discover a security vulnerability, please email security@example.com instead of opening a public issue.

### Response Process
1. Acknowledge receipt within 24 hours
2. Investigate and validate the issue
3. Develop and test a fix
4. Deploy the fix
5. Notify affected users if necessary

## 📊 Security Monitoring

### Metrics to Monitor
- Failed authentication attempts
- Rate limit violations
- Suspicious path patterns (SQL injection, XSS)
- API error rates
- Response times

### Logging
All security events are logged with:
- Timestamp
- Event type
- User/IP information
- Correlation ID

## 🔄 Security Updates

### Regular Tasks
- [ ] Review and rotate API keys (quarterly)
- [ ] Update dependencies (monthly)
- [ ] Audit logs for suspicious activity (weekly)
- [ ] Test security headers (monthly)
- [ ] Review rate limits (quarterly)
- [ ] Update CSP as needed

### Dependency Security
```bash
npm audit
npm audit fix
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [Zod Documentation](https://zod.dev/)

## ✅ Security Checklist

- [x] Security headers implemented
- [x] Input validation on all endpoints
- [x] Output sanitization
- [x] Rate limiting (IP + User)
- [x] Session timeout configured
- [x] Error handling without leaks
- [x] API timeouts configured
- [x] CSP implemented
- [x] Middleware security monitoring
- [x] Environment validation
- [x] Centralized security utilities
- [x] Documentation complete
