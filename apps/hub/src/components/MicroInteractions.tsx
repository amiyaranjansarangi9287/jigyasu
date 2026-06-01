import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// HeartBurst for favorites
export function HeartBurst({ isFavorite, onToggle, className = "" }: { isFavorite: boolean, onToggle: (e: React.MouseEvent) => void, className?: string }) {
  const [showBurst, setShowBurst] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    onToggle(e);
    if (!isFavorite) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }
  };

  return (
    <button onClick={handleClick} className={`relative flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {showBurst && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              x: Math.cos(i * (Math.PI / 3)) * 20, 
              y: Math.sin(i * (Math.PI / 3)) * 20 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      <motion.svg
        className="w-5 h-5 relative z-10"
        fill={isFavorite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        animate={isFavorite ? { scale: [1, 1.5, 0.9, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </motion.svg>
    </button>
  );
}

// ShakeError for wrong answers
export function ShakeError({ children, isError }: { children: React.ReactNode, isError: boolean }) {
  return (
    <motion.div
      animate={isError ? { x: [-15, 15, -15, 15, -10, 10, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// PulseSuccess for correct answers
export function PulseSuccess({ children, isSuccess }: { children: React.ReactNode, isSuccess: boolean }) {
  return (
    <motion.div
      animate={isSuccess ? { scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(34,197,94,0)", "0px 0px 40px rgba(34,197,94,0.6)", "0px 0px 0px rgba(34,197,94,0)"] } : {}}
      transition={{ duration: 0.5 }}
      className="rounded-3xl w-full"
    >
      {children}
    </motion.div>
  );
}
