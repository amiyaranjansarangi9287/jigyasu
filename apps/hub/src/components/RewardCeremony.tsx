import React, { useEffect, useState } from 'react';
import { Mascot } from './Mascot';

interface RewardCeremonyProps {
  xpEarned?: number;
  message?: string;
  onClose: () => void;
}

export function RewardCeremony({ xpEarned = 50, message = 'Awesome Job!', onClose }: RewardCeremonyProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay to allow enter animation
    const t = setTimeout(() => setShow(true), 50);
    
    // Auto-close after some time or wait for user click
    const autoClose = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(t);
      clearTimeout(autoClose);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`relative flex flex-col items-center p-10 bg-white rounded-[2rem] shadow-2xl border-4 border-orange-400 transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-75 translate-y-12 opacity-0'}`}
      >
        <div className="absolute -top-12">
          <Mascot state="celebrating" size="xl" />
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">{message}</h2>
          
          <div className="inline-flex items-center justify-center gap-3 text-3xl font-bold text-sky-500 bg-sky-50 px-8 py-3 rounded-full border-2 border-sky-200">
            <span className="animate-pulse">✨</span>
            <span>+{xpEarned} XP</span>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleClose}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/30 transition-transform active:scale-95 text-lg"
            >
              Continue Adventure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
