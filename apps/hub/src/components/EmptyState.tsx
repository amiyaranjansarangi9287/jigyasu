import { ReactNode } from 'react';
import { Mascot } from './Mascot';
import { useAgeTheme } from '../hooks/useAgeTheme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, actionText, onAction, icon }: EmptyStateProps) {
  const { mascotEnabled } = useAgeTheme();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 max-w-md mx-auto my-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="mb-6 relative z-10 flex justify-center text-4xl text-slate-300">
        {icon || (mascotEnabled ? <Mascot state="idle" size="lg" /> : <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>)}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">{title}</h3>
      <p className="text-slate-600 mb-6 font-medium relative z-10">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-brand text-white font-bold py-3 px-6 rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-orange-500/30 active:scale-95 relative z-10"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
