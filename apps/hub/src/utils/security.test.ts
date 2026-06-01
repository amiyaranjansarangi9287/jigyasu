/**
 * Security Utilities Tests
 * Tests for XSS protection, input sanitization, and security helpers
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeHTML,
  escapeHTML,
  sanitizeInput,
  isValidURL,
  generateSecureToken,
  RateLimiter,
} from './security';

describe('sanitizeHTML', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("XSS")</script>Hello';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello');
  });

  it('should remove iframe tags', () => {
    const input = '<iframe src="evil.com"></iframe>Content';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<iframe>');
    expect(result).toContain('Content');
  });

  it('should remove object tags', () => {
    const input = '<object data="evil.swf"></object>Content';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<object>');
    expect(result).toContain('Content');
  });

  it('should remove embed tags', () => {
    const input = '<embed src="evil.swf">Content';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<embed>');
    expect(result).toContain('Content');
  });

  it('should remove javascript: protocol', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('javascript:');
  });

  it('should remove inline event handlers', () => {
    const input = '<div onclick="alert(1)">Click</div>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('onclick=');
  });

  it('should handle empty string', () => {
    expect(sanitizeHTML('')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(sanitizeHTML(null as any)).toBe('');
    expect(sanitizeHTML(undefined as any)).toBe('');
    expect(sanitizeHTML(123 as any)).toBe('');
  });

  it('should preserve safe HTML', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
  });
});

describe('escapeHTML', () => {
  it('should escape ampersand', () => {
    expect(escapeHTML('A & B')).toBe('A &amp; B');
  });

  it('should escape less than', () => {
    expect(escapeHTML('A < B')).toBe('A &lt; B');
  });

  it('should escape greater than', () => {
    expect(escapeHTML('A > B')).toBe('A &gt; B');
  });

  it('should escape double quotes', () => {
    expect(escapeHTML('A "B"')).toBe('A &quot;B&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHTML("A 'B'")).toBe('A &#x27;B&#x27;');
  });

  it('should escape forward slash', () => {
    expect(escapeHTML('A / B')).toBe('A &#x2F; B');
  });

  it('should handle multiple special characters', () => {
    expect(escapeHTML('<script>alert("XSS")</script>')).toBe(
      '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    );
  });

  it('should handle empty string', () => {
    expect(escapeHTML('')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(escapeHTML(null as any)).toBe('');
    expect(escapeHTML(undefined as any)).toBe('');
  });
});

describe('sanitizeInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should limit length to default 1000', () => {
    const longInput = 'a'.repeat(2000);
    const result = sanitizeInput(longInput);
    expect(result.length).toBe(1000);
  });

  it('should limit length to custom max', () => {
    const longInput = 'a'.repeat(100);
    const result = sanitizeInput(longInput, 50);
    expect(result.length).toBe(50);
  });

  it('should remove null bytes', () => {
    expect(sanitizeInput('hello\x00world')).toBe('helloworld');
  });

  it('should remove control characters', () => {
    expect(sanitizeInput('hello\x1Fworld')).toBe('helloworld');
  });

  it('should handle empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(sanitizeInput(null as any)).toBe('');
    expect(sanitizeInput(undefined as any)).toBe('');
  });

  it('should preserve normal text', () => {
    expect(sanitizeInput('Hello, World!')).toBe('Hello, World!');
  });
});

describe('isValidURL', () => {
  it('should accept valid HTTP URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true);
    expect(isValidURL('http://example.com/path')).toBe(true);
  });

  it('should accept valid HTTPS URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('https://example.com/path?query=value')).toBe(true);
  });

  it('should reject javascript: URLs', () => {
    expect(isValidURL('javascript:alert(1)')).toBe(false);
  });

  it('should reject data: URLs', () => {
    expect(isValidURL('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('should reject file: URLs', () => {
    expect(isValidURL('file:///etc/passwd')).toBe(false);
  });

  it('should reject invalid URLs', () => {
    expect(isValidURL('not-a-url')).toBe(false);
    expect(isValidURL('')).toBe(false);
  });

  it('should reject ftp: URLs', () => {
    expect(isValidURL('ftp://example.com')).toBe(false);
  });
});

describe('generateSecureToken', () => {
  it('should generate token of default length 32', () => {
    const token = generateSecureToken();
    expect(token.length).toBe(32);
  });

  it('should generate token of custom length', () => {
    const token = generateSecureToken(16);
    expect(token.length).toBe(16);
  });

  it('should generate alphanumeric tokens', () => {
    const token = generateSecureToken();
    expect(token).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('should generate different tokens on each call', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).not.toBe(token2);
  });
});

describe('RateLimiter', () => {
  it('should allow requests within limit', () => {
    const limiter = new RateLimiter(5, 60000); // 5 requests per minute
    expect(limiter.canMakeRequest('user1')).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    const limiter = new RateLimiter(3, 60000); // 3 requests per minute
    limiter.canMakeRequest('user1');
    limiter.canMakeRequest('user1');
    limiter.canMakeRequest('user1');
    expect(limiter.canMakeRequest('user1')).toBe(false);
  });

  it('should handle different users independently', () => {
    const limiter = new RateLimiter(2, 60000);
    limiter.canMakeRequest('user1');
    limiter.canMakeRequest('user1');
    expect(limiter.canMakeRequest('user1')).toBe(false);
    expect(limiter.canMakeRequest('user2')).toBe(true);
  });

  it('should reset after time window', () => {
    const limiter = new RateLimiter(2, 100); // 2 requests per 100ms
    limiter.canMakeRequest('user1');
    limiter.canMakeRequest('user1');
    expect(limiter.canMakeRequest('user1')).toBe(false);
    // Wait for time window to pass
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(limiter.canMakeRequest('user1')).toBe(true);
        resolve(null);
      }, 150);
    });
  });

  it('should allow manual reset', () => {
    const limiter = new RateLimiter(2, 60000);
    limiter.canMakeRequest('user1');
    limiter.canMakeRequest('user1');
    expect(limiter.canMakeRequest('user1')).toBe(false);
    limiter.reset('user1');
    expect(limiter.canMakeRequest('user1')).toBe(true);
  });
});
