# Deployment Security Checklist

Use this checklist before deploying to production to ensure all security measures are in place.

## 🔐 Environment Variables

### Required Variables
- [ ] `AUTH_SECRET` - Strong random string (min 32 characters)
- [ ] `NEXTAUTH_URL` - Production URL (https://yourdomain.com)
- [ ] `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- [ ] `AUTH_RESEND_KEY` - Resend API key for email
- [ ] `EMAIL_FROM` - Verified sender email
- [ ] `FIRECRAWL_API_KEY` - Firecrawl API key
- [ ] `GEMINI_API_KEY` or `GOOGLE_API_KEY` - Google Gemini API key
- [ ] `FAL_KEY` - Fal.ai API key

### Optional Security Variables
- [ ] `DISABLE_CHECK_ENV=true` - Disable /api/check-env in production
- [ ] `NODE_ENV=production` - Enable production security features

### Verification
```bash
# Check all environment variables are set
curl https://yourdomain.com/api/check-env

# Should return all true or disable this endpoint
```

## 🛡️ Security Headers

- [ ] X-Frame-Options header present
- [ ] X-Content-Type-Options header present
- [ ] Referrer-Policy header present
- [ ] Permissions-Policy header present
- [ ] Content-Security-Policy header present
- [ ] X-XSS-Protection header present

### Verification
```bash
curl -I https://yourdomain.com | grep -i "x-frame-options\|x-content-type\|referrer-policy\|permissions-policy\|content-security-policy"
```

## 🔒 HTTPS & SSL

- [ ] SSL certificate installed and valid
- [ ] HTTPS redirect configured
- [ ] HTTP Strict Transport Security (HSTS) enabled
- [ ] SSL certificate auto-renewal configured

### Verification
```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check HSTS header
curl -I https://yourdomain.com | grep -i "strict-transport"
```

## 🚦 Rate Limiting

- [ ] Upstash Redis configured and accessible
- [ ] IP-based rate limiting active (50 req/day)
- [ ] User-based rate limiting active (50 img/hour)
- [ ] Rate limit headers returned in responses

### Verification
```bash
# Test rate limiting (make 51 requests quickly)
for i in {1..51}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://yourdomain.com/api/scrape
done
# Should see 429 after 50 requests
```

## 🔐 Authentication

- [ ] NextAuth configured with secure secret
- [ ] Email verification working (Resend)
- [ ] Session timeout configured (30 days)
- [ ] JWT signing working correctly
- [ ] Protected routes require authentication

### Verification
```bash
# Try accessing protected route without auth
curl -I https://yourdomain.com/api/credits
# Should return 401 or redirect to /landing

# Try accessing protected page without auth
curl -I https://yourdomain.com/
# Should redirect to /landing
```

## 🔍 Input Validation

- [ ] All API routes use Zod validation
- [ ] URL validation blocks private IPs in production
- [ ] Prompt length limits enforced
- [ ] Request body size limits configured

### Verification
```bash
# Test URL validation with private IP
curl -X POST https://yourdomain.com/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"http://127.0.0.1"}'
# Should return 400 validation error

# Test oversized prompt
curl -X POST https://yourdomain.com/api/imagen4 \
  -H "Content-Type: application/json" \
  -d '{"prompt":"'$(python3 -c "print('a'*10000)")'"}'
# Should return 400 validation error
```

## 📝 Error Handling

- [ ] No stack traces exposed to clients
- [ ] Errors include correlation IDs
- [ ] Sensitive data sanitized from error messages
- [ ] Error logging configured

### Verification
```bash
# Trigger an error and check response
curl https://yourdomain.com/api/invalid-endpoint
# Should return generic error without stack trace
```

## 🔄 API Security

- [ ] All external API calls have timeouts
- [ ] API keys not exposed in client code
- [ ] API responses sanitized before logging
- [ ] CORS configured correctly

### Verification
```bash
# Check no API keys in client bundle (adapt this command for your specific deployment)
# Example: Download specific chunk files and search for sensitive patterns
curl https://yourdomain.com/_next/static/chunks/main-[hash].js | grep -i "api_key\|apikey\|secret"
# Should return nothing
```

## 🗄️ Database Security

- [ ] Upstash Redis connection encrypted (TLS)
- [ ] Redis credentials in environment variables only
- [ ] Connection pooling configured
- [ ] Data encryption at rest (Upstash default)

## 🔐 Session Security

- [ ] Secure session cookies (httpOnly, secure, sameSite)
- [ ] CSRF protection enabled (NextAuth default)
- [ ] Session fixation protection (NextAuth default)
- [ ] Session timeout working

### Verification
```bash
# Check cookie security flags
curl -I https://yourdomain.com | grep -i "set-cookie"
# Should show Secure, HttpOnly, SameSite flags
```

## 🚨 Security Monitoring

- [ ] Error logging configured (e.g., Sentry, LogRocket)
- [ ] Security event logging enabled
- [ ] Rate limit violations logged
- [ ] Failed auth attempts logged

## 📊 Dependency Security

- [ ] All dependencies up to date
- [ ] No critical vulnerabilities
- [ ] Automated dependency scanning configured

### Verification
```bash
npm audit
# Should show 0 vulnerabilities

npm outdated
# Check for outdated packages
```

## 🔍 Content Security Policy

- [ ] CSP header configured
- [ ] External domains allowlisted
- [ ] frame-ancestors set to 'none'
- [ ] No unsafe-inline for scripts (or minimized)

### Verification
```bash
curl -I https://yourdomain.com | grep -i "content-security-policy"
```

## 🔐 Additional Security

- [ ] robots.txt configured
- [ ] sitemap.xml available
- [ ] No sensitive data in Git history
- [ ] .env files in .gitignore
- [ ] Security.txt file created (optional)

## 🧪 Security Testing

### Manual Tests
- [ ] Try SQL injection in URL params
- [ ] Try XSS in form inputs
- [ ] Try CSRF attacks
- [ ] Try session hijacking
- [ ] Try rate limit bypass

### Automated Tests
- [ ] Run OWASP ZAP scan
- [ ] Run SSL Labs test (https://www.ssllabs.com/ssltest/)
- [ ] Run Security Headers test (https://securityheaders.com/)
- [ ] Run Mozilla Observatory test (https://observatory.mozilla.org/)

## 📱 API Endpoint Security

### /api/scrape
- [ ] Rate limiting active
- [ ] Authentication required
- [ ] Input validation working
- [ ] Timeout configured (60s)

### /api/gemini
- [ ] Rate limiting active
- [ ] Authentication required
- [ ] Input validation working
- [ ] Timeout configured (30s)

### /api/imagen4
- [ ] Rate limiting active (IP + User)
- [ ] Authentication required
- [ ] Input validation working
- [ ] Timeout configured (30s)
- [ ] Credit system working
- [ ] Regeneration limits enforced

### /api/credits
- [ ] Authentication required
- [ ] Error handling working

### /api/check-env
- [ ] Disabled in production (set DISABLE_CHECK_ENV=true)

## 🔄 Post-Deployment

### Immediate
- [ ] Monitor error logs for 1 hour
- [ ] Test all critical user flows
- [ ] Verify authentication working
- [ ] Check rate limiting active

### First 24 Hours
- [ ] Monitor error rates
- [ ] Check for security events
- [ ] Review suspicious activity logs
- [ ] Verify backup/recovery process

### First Week
- [ ] Review all logs
- [ ] Check for abuse patterns
- [ ] Monitor API usage
- [ ] Test incident response plan

## 📝 Security Contacts

**⚠️ Update these with your actual contact information:**

- Security team email: **[security@yourdomain.com]**
- Incident response: **[incidents@yourdomain.com]**
- Upstash support: https://upstash.com/support
- Vercel support: https://vercel.com/support

## 🔄 Regular Maintenance

### Weekly
- [ ] Review security logs
- [ ] Check error rates
- [ ] Monitor rate limit violations

### Monthly
- [ ] Update dependencies
- [ ] Review access logs
- [ ] Test security headers
- [ ] Run security scans

### Quarterly
- [ ] Rotate API keys
- [ ] Review rate limits
- [ ] Audit user permissions
- [ ] Security training for team

## ✅ Sign-off

Date: __________

Deployed by: __________

Reviewed by: __________

Production URL: __________

Notes:
_______________________________________
_______________________________________
_______________________________________
