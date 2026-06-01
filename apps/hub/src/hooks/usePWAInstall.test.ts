/**
 * usePWAInstall Hook Tests
 * Tests for PWA installation detection and prompting
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWAInstall } from './usePWAInstall';

describe('usePWAInstall', () => {
  beforeEach(() => {
    // Reset window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize as not installable', () => {
    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it('should detect standalone mode as installed', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isInstalled).toBe(true);
  });

  it('should set installable when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue({ outcome: 'dismissed' }),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: mockEvent }));
    });

    expect(result.current.isInstallable).toBe(true);
  });

  it('should call promptInstall and handle accepted outcome', async () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue({ outcome: 'accepted' }),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: mockEvent }));
    });

    const accepted = await act(async () => {
      return await result.current.promptInstall();
    });

    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(accepted).toBe(true);
  });

  it('should call promptInstall and handle dismissed outcome', async () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue({ outcome: 'dismissed' }),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: mockEvent }));
    });

    const accepted = await act(async () => {
      return await result.current.promptInstall();
    });

    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(accepted).toBe(false);
  });

  it('should return false when no deferred prompt exists', async () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const accepted = await act(async () => {
      return await result.current.promptInstall();
    });

    expect(accepted).toBe(false);
  });

  it('should set installed when appinstalled event fires', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue({ outcome: 'accepted' }),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: mockEvent }));
    });

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePWAInstall());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function));
  });
});
