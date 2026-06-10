import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

export function AudioNarration({ text }: { text: string }) {
    const { t } = useTranslation();
  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={handleReadAloud}
      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-lg shadow-sm active:scale-95 transition-all flex items-center justify-center"
      title={t('auto.attr.multimodallearning.read_aloud')}
    >
      🔊
    </button>
  );
}

export function VideoPlayer({ url, title }: { url: string, title?: string }) {
    const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-white/20 bg-black/50 relative group">
      {!isPlaying ? (
        <div className="min-h-48 w-full flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <span className="text-white font-bold">{title || 'Video Explanation'}</span>
          </div>
          <button className="w-16 min-h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform" aria-label="Action button">
            <span className="text-3xl ml-1">▶️</span>
          </button>
        </div>
      ) : (
        <video 
          src={url} 
          controls 
          autoPlay 
          className="w-full min-h-48 object-cover"
        />
      )}
    </div>
  );
}
