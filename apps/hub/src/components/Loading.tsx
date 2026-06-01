import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {variant === 'spinner' && (
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin`} />
      )}
      
      {variant === 'dots' && (
        <div className="flex gap-2">
          <div className={`${sizeClasses[size]} bg-sky-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
          <div className={`${sizeClasses[size]} bg-sky-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
          <div className={`${sizeClasses[size]} bg-sky-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className={`${sizeClasses[size]} bg-sky-500 rounded-full animate-pulse`} />
      )}
      
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
