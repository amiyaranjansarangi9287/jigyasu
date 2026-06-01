/**
 * useOnlineStatus Hook Tests
 * Tests for online/offline status detection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from './useOnlineStatus';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with current online status', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it('should initialize as offline when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('should update to offline when offline event fires', () => {
    const { result } = renderHook(() => useOnlineStatus());
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should update to online when online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    const { result } = renderHook(() => useOnlineStatus());
    
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should set wasOffline to true after going offline', () => {
    const { result } = renderHook(() => useOnlineStatus());
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(result.current.wasOffline).toBe(true);
  });

  it('should maintain wasOffline as true after coming back online', () => {
    const { result } = renderHook(() => useOnlineStatus());
    
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useOnlineStatus());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
