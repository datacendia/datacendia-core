/**
 * Security utilities for Datacendia Web Components
 * Provides CSP, input sanitization, and security headers
 */

/**
 * Generate Content Security Policy for widgets
 */
export function generateCSP(options: {
  allowDataUrl?: boolean;
  allowInlineStyles?: boolean;
  allowWebSocket?: boolean;
  apiDomains?: string[];
} = {}): string {
  const {
    allowDataUrl = false,
    allowInlineStyles = false,
    allowWebSocket = false,
    apiDomains = ['https://app.datacendia.com', 'https://api.datacendia.com']
  } = options;

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' " + apiDomains.join(' '),
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  if (allowDataUrl) {
    directives.push("img-src 'self' data: blob:");
  }

  if (allowInlineStyles) {
    directives[2] = "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com";
  }

  if (allowWebSocket) {
    const wsDomains = apiDomains.map(domain => domain.replace('https://', 'wss://'));
    directives.push(`connect-src 'self' ${apiDomains.join(' ')} ${wsDomains.join(' ')}`);
  }

  return directives.join('; ');
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Sanitize and validate API URLs
 */
export function sanitizeApiUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow https and ws protocols
    if (!['https:', 'wss:'].includes(parsed.protocol)) {
      return null;
    }

    // Block localhost in production
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Generate nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Security headers for API requests
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: number[] = [];
  
  constructor(private maxRequests: number, private windowMs: number) {}
  
  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}
