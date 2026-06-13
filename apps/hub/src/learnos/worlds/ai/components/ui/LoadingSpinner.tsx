import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export default function LoadingSpinner({ 
  size = 'md', 
  message,
  className 
}: LoadingSpinnerProps) {
  const { t } = useTranslation();
  return (
    <div 
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
    >
      <div className={cn(
        "border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin",
        sizeClasses[size]
      )} />
      {message && (
        <p className="text-gray-600 text-sm animate-pulse">{message}</p>
      )}
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );
}

// Full page loading state
export function PageLoader({ message = "Loading your adventure..." }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
