import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Create a new ratelimiter that allows 50 requests per day per IP per endpoint
export const getRateLimiter = (endpoint: string) => {
  // Fail-open if Upstash env vars aren't present to avoid crashing API routes
  const hasUpstashEnv = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!hasUpstashEnv) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[rate-limit] Upstash env not found; skipping rate limiting for ${endpoint}.`);
    }
    return null;
  }

  try {
    // Requires the following environment variables:
    // UPSTASH_REDIS_REST_URL
    // UPSTASH_REDIS_REST_TOKEN
    const redis = Redis.fromEnv();

    return new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, "1 d"),
      analytics: true,
      prefix: `ratelimit:${endpoint}`,
    });
  } catch (e) {
    // If Redis initialization fails for any reason, fail-open
    console.warn(`[rate-limit] Failed to initialize Upstash Redis for ${endpoint}. Allowing requests.`, e);
    return null;
  }
};

/**
 * Securely extracts the client IP address from a NextRequest.
 *
 * Security considerations:
 * - Only trusts proxy headers when TRUSTED_PROXY=true (production deployment)
 * - Prioritizes Vercel's x-vercel-ip header which cannot be spoofed by clients
 * - Falls back to NextRequest.ip or a consistent identifier to prevent bypass
 *
 * @param request - The incoming NextRequest
 * @returns The client IP address or a consistent fallback identifier
 */
export const getIP = (request: NextRequest): string => {
  const isTrustedProxy = process.env.TRUSTED_PROXY === "true";

  // 1. Vercel's infrastructure sets x-vercel-ip securely (cannot be spoofed by clients)
  const vercelIp = request.headers.get("x-vercel-ip");
  if (vercelIp) {
    return vercelIp;
  }

  // 2. Only trust proxy headers when explicitly configured (e.g., production behind Vercel/CloudFlare)
  if (isTrustedProxy) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      // Take the first IP in the chain (the original client)
      return forwarded.split(/\s*,\s*/)[0];
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
      return realIp;
    }
  }

  // 3. Use NextRequest's ip property if available (direct connection)
  if (request.ip) {
    return request.ip;
  }

  // 4. Fallback to a consistent identifier to prevent complete bypass
  // This ensures rate limiting still works even if IP detection fails
  return "unknown-client";
};

// Helper function to check if a request is rate limited
export const isRateLimited = async (request: NextRequest, endpoint: string) => {
  try {
    const limiter = getRateLimiter(endpoint);

    // If no limiter is available (e.g., in development or init failure), allow the request
    if (!limiter) {
      return { success: true, limit: 50, remaining: 50 };
    }

    // Get the IP from the request
    const ip = getIP(request);

    // Check if the IP has exceeded the rate limit
    const result = await limiter.limit(ip);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
    };
  } catch (e) {
    // Any unexpected error in rate limiting should not break the API; fail-open
    console.warn(`[rate-limit] Error during rate limit check for ${endpoint}. Allowing request.`, e);
    return { success: true, limit: 50, remaining: 50 };
  }
};