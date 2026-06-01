// src/worlds/physics/components/Navbar.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  currentModule?: string;
  onNavigate?: (id: string) => void;
  progress?: { xp: number; level: number; modulesVisited: Record<string, { visited: boolean }> };
}

export default function Navbar({ currentModule: _currentModule, onNavigate: _onNavigate, progress }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-gray-950/80"
    >
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <button
          onClick={() => navigate('/physics')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity min-h-[44px] px-2 rounded-lg"
        >
          <span className="text-xl">⚛️</span>
          <span className="font-bold text-white text-sm">PhysicsVerse</span>
        </button>

        <div className="flex items-center gap-2">
          {progress && (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
              <span className="text-sm text-yellow-400 font-bold">⭐ Lv.{progress.level}</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-cyan-400 font-bold">{progress.xp} XP</span>
            </div>
          )}
          <button
            onClick={() => navigate('/physics')}
            className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] px-3 py-2 rounded-lg flex items-center"
          >
            ← Home
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
