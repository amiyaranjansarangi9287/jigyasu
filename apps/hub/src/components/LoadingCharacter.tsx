import { motion } from 'framer-motion';

interface LoadingCharacterProps {
  message?: string;
}

export default function LoadingCharacter({ message = 'Loading...' }: LoadingCharacterProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-full min-h-[300px]">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-6xl sm:text-7xl drop-shadow-xl relative"
      >
        �
        <motion.div 
          className="absolute -bottom-4 -right-4 text-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </motion.div>
      <motion.div 
        className="mt-6 w-16 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden relative"
      >
        <motion.div 
          className="absolute inset-y-0 left-0 bg-brand w-1/2 rounded-full"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <p className="mt-4 text-slate-500 font-bold tracking-wide">{message}</p>
    </div>
  );
}
