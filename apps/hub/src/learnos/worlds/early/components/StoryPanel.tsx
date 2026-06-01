// src/worlds/early/components/StoryPanel.tsx

import { motion } from 'framer-motion';

interface StoryPanelProps {
  emoji: string;
  text: string;
  panelIndex: number;
}

export function StoryPanel({ emoji, text, panelIndex }: StoryPanelProps) {
  return (
    <motion.div
      key={panelIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100"
    >
      <div className="text-7xl text-center mb-4">{emoji}</div>
      <p className="text-2xl font-bold text-gray-800 text-center leading-relaxed">{text}</p>
    </motion.div>
  );
}
