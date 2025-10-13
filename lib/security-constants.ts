/**
 * Security constants and configuration
 * Centralizes all security-related constants for easy management
 */

// Rate limiting configuration
export const RATE_LIMITS = {
  // IP-based rate limits (per day)
  IP_SCRAPE: { limit: 50, window: '1 d' },
  IP_GEMINI: { limit: 50, window: '1 d' },
  IP_IMAGEN4: { limit: 50, window: '1 d' },
  
  // User-based rate limits (per hour)
  USER_IMAGEN4: { limit: 50, window: '1 h' },
  USER_SCRAPE: { limit: 100, window: '1 h' },
  USER_GEMINI: { limit: 100, window: '1 h' },
} as const;

// Session configuration
export const SESSION_CONFIG = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  UPDATE_AGE: 24 * 60 * 60, // 24 hours in seconds
} as const;

// Request timeout configuration (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  IMAGE_FETCH: 30000, // 30 seconds
  SCRAPE_REQUEST: 60000, // 60 seconds
} as const;

// Input validation limits
export const INPUT_LIMITS = {
  URL_MAX_LENGTH: 2048,
  PROMPT_MAX_LENGTH: 5000,
  GEMINI_PROMPT_MAX_LENGTH: 50000,
  API_KEY_MIN_LENGTH: 10,
  API_KEY_MAX_LENGTH: 500,
  MAX_URLS_PER_REQUEST: 10,
} as const;

// Credit and usage limits
export const USAGE_LIMITS = {
  DAILY_IMAGE_CAP: 100,
  MAX_REGENERATIONS_PER_PROMPT: 4, // 1 initial + 3 regenerations
  TRIAL_CREDITS: 1,
} as const;

// Allowed origins for CORS (if needed)
export const ALLOWED_ORIGINS = [
  process.env.NEXTAUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
} as const;

// CSP directives
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://api.firecrawl.dev',
    'https://generativelanguage.googleapis.com',
    'https://fal.ai',
    'https://queue.fal.run',
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;
