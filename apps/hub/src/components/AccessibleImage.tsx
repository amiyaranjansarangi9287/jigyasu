import React from 'react';

interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  decorative?: boolean;
}

/**
 * AccessibleImage component that ensures proper alt text for accessibility.
 * 
 * Rules:
 * - If decorative=true, alt="" (hidden from screen readers)
 * - If alt is provided, use it as-is
 * - If alt is not provided and decorative=false, use a descriptive alt based on src
 * - Always provide meaningful alt text for informative images
 * - Use decorative=true for purely decorative images (icons, backgrounds, etc.)
 */
export default function AccessibleImage({ 
  alt, 
  decorative = false, 
  fallback = '/images/fallback-placeholder.png',
  ...props 
}: AccessibleImageProps) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Generate alt text if not provided and not decorative
  const generateAltText = (src: string): string => {
    if (!src) return 'Image';
    // Extract filename from src and make it readable
    const filename = src.split('/').pop()?.split('.')[0] || 'Image';
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const finalAlt = decorative 
    ? '' 
    : alt || generateAltText(props.src || '');

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <>
      {!loaded && (
        <div 
          className="bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width: props.width || '100%', height: props.height || 'auto' }}
          aria-hidden="true"
        />
      )}
      <img
        alt={finalAlt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...(error && { src: fallback })}
        {...props}
        style={{
          ...props.style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </>
  );
}
