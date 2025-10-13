import { z } from 'zod';

/**
 * URL validation schema with security constraints
 * - Must be a valid URL
 * - Must use http or https protocol
 * - Max length of 2048 characters
 * - Rejects localhost/private IPs in production
 */
export const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .max(2048, 'URL is too long (max 2048 characters)')
  .url('Invalid URL format')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          return false;
        }
        
        // In production, reject localhost and private IPs
        if (process.env.NODE_ENV === 'production') {
          const hostname = parsed.hostname.toLowerCase();
          
          // Reject localhost variants
          if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            hostname.endsWith('.local')
          ) {
            return false;
          }
          
          // Reject private IP ranges (simplified check)
          if (
            hostname.startsWith('10.') ||
            hostname.startsWith('192.168.') ||
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
          ) {
            return false;
          }
        }
        
        return true;
      } catch {
        return false;
      }
    },
    { message: 'URL must use http/https protocol and cannot reference private networks in production' }
  );

/**
 * Sanitize a URL string by encoding special characters
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Validate and sanitize a URL
 */
export function validateUrl(url: string): { isValid: boolean; sanitized: string; error?: string } {
  const result = urlSchema.safeParse(url);
  
  if (!result.success) {
    return {
      isValid: false,
      sanitized: '',
      error: result.error.errors[0]?.message || 'Invalid URL',
    };
  }
  
  return {
    isValid: true,
    sanitized: sanitizeUrl(url),
  };
}

/**
 * String validation with length limits and sanitization
 */
export const safeStringSchema = (maxLength = 10000) =>
  z
    .string()
    .min(1, 'Value is required')
    .max(maxLength, `Value is too long (max ${maxLength} characters)`)
    .trim();

/**
 * API key validation schema
 * - Alphanumeric with common key characters
 * - Reasonable length limits
 */
export const apiKeySchema = z
  .string()
  .min(10, 'API key is too short')
  .max(500, 'API key is too long')
  .regex(/^[a-zA-Z0-9_\-:.]+$/, 'API key contains invalid characters');
