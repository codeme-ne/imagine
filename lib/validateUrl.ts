/**
 * Validates a URL to prevent SSRF attacks by blocking:
 * - Private IP ranges (127.x.x.x, 10.x.x.x, 192.168.x.x, 172.16-31.x.x)
 * - localhost and loopback addresses
 * - Cloud metadata endpoints (169.254.169.254)
 * - Non-HTTP(S) protocols
 *
 * @param urlString - The URL to validate
 * @returns An object with `valid` boolean and optional `error` message
 */
export function validateUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(urlString);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        valid: false,
        error: 'Only HTTP and HTTPS protocols are allowed.'
      };
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost and loopback addresses
    const localhostPatterns = [
      'localhost',
      '0.0.0.0',
      '127.0.0.1',
      '::1',
      '0:0:0:0:0:0:0:1',
    ];

    if (localhostPatterns.includes(hostname) || hostname.startsWith('127.')) {
      return {
        valid: false,
        error: 'Access to localhost is not allowed.'
      };
    }

    // Block cloud metadata endpoint
    if (hostname === '169.254.169.254') {
      return {
        valid: false,
        error: 'Access to cloud metadata endpoints is not allowed.'
      };
    }

    // Extract IP address if hostname is an IP
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);

    if (ipMatch) {
      const octets = ipMatch.slice(1, 5).map(Number);

      // Validate IP octets are in range
      if (octets.some(octet => octet < 0 || octet > 255)) {
        return {
          valid: false,
          error: 'Invalid IP address.'
        };
      }

      const [first, second] = octets;

      // Block private IP ranges
      // 10.0.0.0/8
      if (first === 10) {
        return {
          valid: false,
          error: 'Access to private IP ranges is not allowed.'
        };
      }

      // 172.16.0.0/12
      if (first === 172 && second >= 16 && second <= 31) {
        return {
          valid: false,
          error: 'Access to private IP ranges is not allowed.'
        };
      }

      // 192.168.0.0/16
      if (first === 192 && second === 168) {
        return {
          valid: false,
          error: 'Access to private IP ranges is not allowed.'
        };
      }

      // 169.254.0.0/16 (link-local addresses including metadata endpoint)
      if (first === 169 && second === 254) {
        return {
          valid: false,
          error: 'Access to link-local addresses is not allowed.'
        };
      }
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: 'Invalid URL format.'
    };
  }
}
