import { ReactNode } from 'react';
import { cn } from '@jigyasu/utils';

export interface LayoutProps {
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}

export function Layout({ children, className, headerContent, footerContent }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {headerContent && (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 p-4">
          {headerContent}
        </header>
      )}
      <main className={cn("flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full", className)}>
        {children}
      </main>
      {footerContent && (
        <footer className="border-t border-slate-800 p-4 bg-slate-950 text-center text-sm text-slate-500">
          {footerContent}
        </footer>
      )}
    </div>
  );
}
