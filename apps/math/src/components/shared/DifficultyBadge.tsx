import { motion } from 'framer-motion';
import { getDifficultyLabel, getDifficultyColor, getDifficultyEmoji, type DiffLevel } from '../../lib/difficultyEngine';

export default function DifficultyBadge({ level, showLabel = true }: { level: DiffLevel; showLabel?: boolean }) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getDifficultyColor(level)} bg-white/5 border border-white/10`}
      key={level}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      {getDifficultyEmoji(level)} {showLabel && getDifficultyLabel(level)}
    </motion.span>
  );
}
