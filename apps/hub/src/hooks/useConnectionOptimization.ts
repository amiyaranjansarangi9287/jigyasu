// src/hooks/useConnectionOptimization.ts
// 2G Optimization Hook
// Mission Alignment: Equity Value - "The child in a village in Odisha and the child in an apartment in Bengaluru should see the same beautiful concept"

import { useState, useEffect } from 'react';

export interface ConnectionOptimization {
  connectionSpeed: '2g' | '3g' | '4g' | 'unknown';
  isSlowConnection: boolean;
  shouldLoadImages: boolean;
  shouldLoadAnimations: boolean;
  loadTimeBudget: number;
  enableDataSaver: boolean;
  toggleDataSaver: () => void;
}

export function useConnectionOptimization(): ConnectionOptimization {
  const [connectionSpeed, setConnectionSpeed] = useState<'2g' | '3g' | '4g' | 'unknown'>('unknown');
  const [enableDataSaver, setEnableDataSaver] = useState(false);

  useEffect(() => {
    // Detect connection type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '2g') {
        setConnectionSpeed('2g');
      } else if (effectiveType === '3g') {
        setConnectionSpeed('3g');
      } else if (effectiveType === '4g') {
        setConnectionSpeed('4g');
      }
    }

    // Check for saved data saver preference
    const savedDataSaver = localStorage.getItem('jigyasu-data-saver');
    if (savedDataSaver === 'true') {
      setEnableDataSaver(true);
    }

    // Listen for connection changes
    const handleConnectionChange = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conn = (navigator as any).connection;
      if (conn) {
        const effectiveType = conn.effectiveType;
        if (effectiveType === '2g') {
          setConnectionSpeed('2g');
        } else if (effectiveType === '3g') {
          setConnectionSpeed('3g');
        } else if (effectiveType === '4g') {
          setConnectionSpeed('4g');
        }
      }
    };

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      return () => connection.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  const toggleDataSaver = () => {
    const newValue = !enableDataSaver;
    setEnableDataSaver(newValue);
    localStorage.setItem('jigyasu-data-saver', String(newValue));
  };

  const isSlowConnection = connectionSpeed === '2g' || connectionSpeed === '3g' || enableDataSaver;
  const shouldLoadImages = !enableDataSaver && connectionSpeed !== '2g';
  const shouldLoadAnimations = !enableDataSaver && connectionSpeed !== '2g' && connectionSpeed !== '3g';
  const loadTimeBudget = connectionSpeed === '2g' ? 10000 : connectionSpeed === '3g' ? 5000 : 3000;

  return {
    connectionSpeed,
    isSlowConnection,
    shouldLoadImages,
    shouldLoadAnimations,
    loadTimeBudget,
    enableDataSaver,
    toggleDataSaver,
  };
}

// Utility function to check if asset should be loaded based on optimization
export function shouldLoadAsset(
  optimization: ConnectionOptimization,
  assetType: 'image' | 'video' | 'animation' | 'audio'
): boolean {
  if (optimization.enableDataSaver) {
    return assetType === 'audio'; // Only load audio in data saver mode
  }

  switch (assetType) {
    case 'image':
      return optimization.shouldLoadImages;
    case 'video':
      return optimization.connectionSpeed === '4g';
    case 'animation':
      return optimization.shouldLoadAnimations;
    case 'audio':
      return true; // Always load audio as it's essential for learning
    default:
      return true;
  }
}

// Utility function to get optimized asset URL
export function getOptimizedAssetUrl(
  originalUrl: string,
  optimization: ConnectionOptimization,
  assetType: 'image' | 'video'
): string {
  if (!shouldLoadAsset(optimization, assetType)) {
    return ''; // Return empty string to prevent loading
  }

  // For 2G/3G, use compressed versions
  if (optimization.isSlowConnection && assetType === 'image') {
    // This would typically use a CDN that serves compressed images
    // For now, we'll add a query parameter to request compressed version
    const url = new URL(originalUrl, window.location.origin);
    url.searchParams.set('format', 'webp');
    url.searchParams.set('quality', 'low');
    return url.toString();
  }

  return originalUrl;
}
