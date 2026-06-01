import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { localStore } from './local';

describe('localStore wrapper', () => {
  beforeEach(() => {
    // Mock global window.localStorage
    const store: Record<string, string> = {};
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; })
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets and gets valid JSON data', () => {
    localStore.set('test_key', { hello: 'world' });
    const result = localStore.get<{ hello: string }>('test_key', { hello: 'default' } as any);
    expect(result.hello).toBe('world');
  });

  it('returns default value if key does not exist', () => {
    const result = localStore.get('missing_key', 'fallback');
    expect(result).toBe('fallback');
  });

  it('safely handles corrupted JSON without throwing', () => {
    // Manually insert corrupted string
    window.localStorage.setItem('corrupted_key', '{ bad json');
    
    // Should return fallback instead of crashing
    const result = localStore.get('corrupted_key', 'fallback');
    expect(result).toBe('fallback');
  });

  it('removes keys successfully', () => {
    localStore.set('temp', 'data');
    localStore.remove('temp');
    expect(localStore.get('temp', null)).toBe(null);
  });
});
