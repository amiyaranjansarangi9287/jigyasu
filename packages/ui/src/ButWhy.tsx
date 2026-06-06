import React, { useState } from 'react';

interface ButWhyProps {
  title?: string;
  badge?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export function ButWhy({ 
  title = "But WHY does this happen?", 
  badge = "But WHY?",
  ariaLabel = "But Why?",
  children 
}: ButWhyProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl hover:scale-110 hover:shadow-pink-500/50 transition-all duration-300 ring-4 ring-pink-400 group"
        aria-label={ariaLabel}
      >
        <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🦉</span>
        <div className="absolute -top-10 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
          {badge}
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-4 border-pink-400 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-pink-100 hover:text-pink-600 rounded-full text-slate-500 transition-colors font-bold"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-100">
              <div className="text-5xl">🦉</div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                {title}
              </h2>
            </div>
            
            <div className="prose prose-pink prose-lg text-slate-600 font-medium leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
