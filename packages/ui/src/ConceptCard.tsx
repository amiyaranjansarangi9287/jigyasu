
import { cn } from '@jigyasu/utils';

export interface ConceptCardProps {
  title: string;
  emoji: string;
  description: string;
  category?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ConceptCard({ title, emoji, description, category, className, onClick, disabled }: ConceptCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col text-left p-6 rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:bg-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl" role="img" aria-label={title}>{emoji}</span>
        {category && (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 rounded-full">
            {category}
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm line-clamp-3">{description}</p>
    </button>
  );
}
