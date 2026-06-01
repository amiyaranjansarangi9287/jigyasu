import { useState } from 'react';
import { motion } from 'framer-motion';
import { isSoundEnabled, toggleSound, sfx } from '../../lib/soundEngine';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleToggle = () => {
    const next = toggleSound();
    setEnabled(next);
    if (next) sfx.click();
  };

  return (
    <motion.button
      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
        enabled
          ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
          : 'bg-white/5 border-white/10 text-gray-600'
      }`}
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? '🔊' : '🔇'}
    </motion.button>
  );
}
