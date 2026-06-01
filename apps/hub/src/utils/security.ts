/**
 * Security Utilities for Jigyasu
 * Provides XSS protection, input sanitization, and security helpers
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * This is a basic implementation - for production, consider using DOMPurify
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous HTML tags and attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Validate URL to prevent malicious redirects
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % chars.length;
    token += chars[randomIndex];
  }
  
  return token;
}

/**
 * Rate limiter for API calls and sensitive operations
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove requests outside the time window
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Content Security Policy nonce generator
 */
export function generateNonce(): string {
  return generateSecureToken(16);
}
