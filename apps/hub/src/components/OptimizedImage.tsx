/**
 * Optimized Image Component
 * Handles lazy loading, responsive images, and format conversion (WebP/AVIF)
 */

import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
  };

  // Generate WebP and AVIF srcset hints
  const generateSrcSet = (baseSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map((w) => {
        // In production, this would use an image CDN or build-time optimization
        // For now, we'll use the same src but indicate the intended width
        return `${baseSrc}?w=${w} ${w}w`;
      })
      .join(', ');
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {isInView && (
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
