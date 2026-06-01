import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WORLDS } from '../learnos/landing/WorldsGrid';
import { AGE_GROUPS } from '../learnos/constants/ageGroups';
import { useLearnerStore } from '../learnos/store';

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enterWorld } = useLearnerStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = WORLDS.filter(w => 
    t(w.nameKey).toLowerCase().includes(query.toLowerCase()) || 
    t(w.descKey).toLowerCase().includes(query.toLowerCase()) ||
    w.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] p-4 sm:p-10 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-10">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <span className="text-2xl text-slate-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search worlds, topics, skills..."
            className="flex-1 text-xl outline-none bg-transparent font-bold text-slate-800"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
            ✕
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.length > 0 && results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium">No results found for "{query}"</div>
          ) : (
            <div className="grid gap-3">
              {(query ? results : WORLDS.slice(0, 4)).map(w => (
                <div 
                  key={w.key}
                  onClick={() => {
                    enterWorld(w.key);
                    navigate(AGE_GROUPS[w.key].route);
                    onClose();
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors bg-gradient-to-r hover:${w.gradient} hover:text-white group border border-slate-100 hover:border-transparent`}
                >
                  <div className="text-4xl bg-white/20 rounded-xl w-14 h-14 flex items-center justify-center shadow-sm">
                    {w.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg group-hover:text-white text-slate-800">{t(w.nameKey)}</div>
                    <div className="text-sm opacity-80 flex gap-2 mt-1">
                      {w.skills.map(s => <span key={s} className="bg-black/10 px-2 py-0.5 rounded-md text-sm">{s}</span>)}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Enter →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
