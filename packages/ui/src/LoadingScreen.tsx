// LoadingScreen
import { cn } from '@jigyasu/utils';

export interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({ message = "Loading...", fullScreen = true, className }: LoadingScreenProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      fullScreen ? "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm" : "w-full py-12",
      className
    )}>
      <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
      {message && <p className="text-slate-300 font-medium animate-pulse">{message}</p>}
    </div>
  );
}
