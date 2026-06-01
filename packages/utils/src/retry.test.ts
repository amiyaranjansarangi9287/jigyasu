import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff } from './retry';

describe('retryWithBackoff utility', () => {
  it('returns immediately on success', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds eventually', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValueOnce('success');
    
    // Use very small delays for fast tests
    const result = await retryWithBackoff(fn, { baseDelay: 10, maxDelay: 50 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws error after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'));
    
    await expect(retryWithBackoff(fn, { maxAttempts: 3, baseDelay: 5 })).rejects.toThrow('always fail');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
