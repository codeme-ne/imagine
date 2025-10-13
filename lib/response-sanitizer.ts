/**
 * Sanitize API response to remove sensitive information
 * This ensures we never accidentally leak API keys, tokens, or internal data
 */

// List of sensitive keys that should be removed from responses
const SENSITIVE_KEYS = [
  'apiKey',
  'api_key',
  'apikey',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'secret',
  'password',
  'Authorization',
  'authorization',
  'Bearer',
  'credentials',
  'privateKey',
  'private_key',
];

/**
 * Recursively sanitize an object by removing sensitive keys
 */
export function sanitizeObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized: Record<string, unknown> = {};
  const objRecord = obj as Record<string, unknown>;

  for (const [key, value] of Object.entries(objRecord)) {
    // Check if this key is sensitive
    const isSensitive = SENSITIVE_KEYS.some(
      (sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      // Replace sensitive value with redacted string
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize error messages to remove potential sensitive information
 */
export function sanitizeErrorMessage(message: string): string {
  // Remove any potential API keys (common patterns)
  let sanitized = message.replace(
    /[a-zA-Z0-9]{20,}/g,
    (match) => {
      // If it looks like an API key (long alphanumeric string), redact it
      if (match.length > 30) {
        return '[REDACTED]';
      }
      return match;
    }
  );

  // Remove URLs that might contain sensitive query parameters
  sanitized = sanitized.replace(
    /https?:\/\/[^\s]+\?[^\s]+/g,
    (url) => {
      try {
        const parsed = new URL(url);
        // Keep the base URL but remove query parameters
        return `${parsed.origin}${parsed.pathname}`;
      } catch {
        return '[URL]';
      }
    }
  );

  return sanitized;
}

/**
 * Sanitize headers object by removing sensitive headers
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const isSensitive = SENSITIVE_KEYS.some(
      (sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
