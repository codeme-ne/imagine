import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Create a per-user rate limiter
 * This is in addition to IP-based rate limiting for authenticated endpoints
 */
export const getUserRateLimiter = (endpoint: string, limit: number, window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`) => {
  const hasUpstashEnv = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!hasUpstashEnv) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[user-rate-limit] Upstash env not found; skipping user rate limiting for ${endpoint}.`);
    }
    return null;
  }

  try {
    const redis = Redis.fromEnv();

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: true,
      prefix: `user-ratelimit:${endpoint}`,
    });
  } catch (e) {
    console.warn(`[user-rate-limit] Failed to initialize Upstash Redis for ${endpoint}. Allowing requests.`, e);
    return null;
  }
};

/**
 * Check if a user has exceeded their rate limit
 */
export const isUserRateLimited = async (userId: string, endpoint: string, limit = 100, window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}` = "1 h") => {
  try {
    const limiter = getUserRateLimiter(endpoint, limit, window);

    if (!limiter) {
      return { success: true, limit, remaining: limit };
    }

    const result = await limiter.limit(userId);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (e) {
    console.warn(`[user-rate-limit] Error during rate limit check for ${endpoint}. Allowing request.`, e);
    return { success: true, limit, remaining: limit };
  }
};
