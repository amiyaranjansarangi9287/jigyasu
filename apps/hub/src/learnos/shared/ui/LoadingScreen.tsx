// src/shared/ui/LoadingScreen.tsx
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading wonder...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4"
        >
          �
        </motion.div>
        <p className="text-orange-600 font-bold text-lg">{message}</p>
      </div>
    </div>
  );
}
