import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type MatterState = 'solid' | 'liquid' | 'gas';

const STATE_CONFIG = {
  solid: { temp: 20, speed: 0.3, spacing: 40, label: 'Solid (Ice)', emoji: '🧊' },
  liquid: { temp: 60, speed: 2, spacing: 30, label: 'Liquid (Water)', emoji: '💧' },
  gas: { temp: 100, speed: 5, spacing: 20, label: 'Gas (Steam)', emoji: '♨️' },
};

const PARTICLE_COUNT = 36;

export default function StatesOfMatterCanvas({ isPlaying }: CanvasProps) {
  const [temperature, setTemperature] = useState(20);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visitedStates, setVisitedStates] = useState<Set<MatterState>>(new Set(['solid']));
  const [showCelebration, setShowCelebration] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [targetState, setTargetState] = useState<MatterState | null>(null);
  const [challengeScore, setChallengeScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const getMatterState = (temp: number): MatterState => {
    if (temp < 40) return 'solid';
    if (temp < 80) return 'liquid';
    return 'gas';
  };

  const currentState = getMatterState(temperature);
  const config = STATE_CONFIG[currentState];

  // Track visited states
  useEffect(() => {
    setVisitedStates(prev => {
      const newSet = new Set(prev);
      newSet.add(currentState);
      
      // Check if all states visited
      if (newSet.size === 3 && !showCelebration && prev.size < 3) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      return newSet;
    });
  }, [currentState, showCelebration]);

  // Challenge mode - match the target state
  useEffect(() => {
    if (challengeMode && targetState && currentState === targetState) {
      setChallengeScore(prev => prev + 1);
      // New target
      const states: MatterState[] = ['solid', 'liquid', 'gas'];
      const remaining = states.filter(s => s !== currentState);
      setTargetState(remaining[Math.floor(Math.random() * remaining.length)]);
    }
  }, [challengeMode, currentState, targetState]);

  const startChallenge = () => {
    setChallengeMode(true);
    setChallengeScore(0);
    const states: MatterState[] = ['solid', 'liquid', 'gas'];
    const remaining = states.filter(s => s !== currentState);
    setTargetState(remaining[Math.floor(Math.random() * remaining.length)]);
  };

  // Initialize particles
  useEffect(() => {
    const initParticles: Particle[] = [];
    const cols = 6;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      initParticles.push({
        id: i,
        x: 100 + col * 40,
        y: 80 + row * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    setParticles(initParticles);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!isPlaying) return;

    const state = getMatterState(temperature);
    const speed = STATE_CONFIG[state].speed;
    const containerWidth = 340;
    const containerHeight = 300;

    setParticles(prev => prev.map(p => {
      let newX = p.x + p.vx * speed;
      let newY = p.y + p.vy * speed;
      let newVx = p.vx;
      let newVy = p.vy;

      // Boundary collision
      if (newX < 20 || newX > containerWidth - 20) {
        newVx = -newVx;
        newX = Math.max(20, Math.min(containerWidth - 20, newX));
      }
      if (newY < 20 || newY > containerHeight - 20) {
        newVy = -newVy;
        newY = Math.max(20, Math.min(containerHeight - 20, newY));
      }

      // For solid state, particles vibrate around fixed positions
      if (state === 'solid') {
        const col = p.id % 6;
        const row = Math.floor(p.id / 6);
        const homeX = 80 + col * 40;
        const homeY = 60 + row * 40;
        newX = homeX + (Math.random() - 0.5) * 6;
        newY = homeY + (Math.random() - 0.5) * 6;
      }

      // Random direction changes for gas
      if (state === 'gas' && Math.random() < 0.02) {
        newVx = (Math.random() - 0.5) * 4;
        newVy = (Math.random() - 0.5) * 4;
      }

      return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, temperature]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const getParticleColor = () => {
    if (temperature < 40) return 'bg-blue-400';
    if (temperature < 80) return 'bg-cyan-400';
    return 'bg-orange-400';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* State Progress */}
      <div className="flex gap-2">
        {(['solid', 'liquid', 'gas'] as MatterState[]).map(state => (
          <div
            key={state}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              visitedStates.has(state)
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-400'
            } ${currentState === state ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''}`}
          >
            {STATE_CONFIG[state].emoji} {state}
          </div>
        ))}
      </div>

      {/* Challenge Mode Banner */}
      <AnimatePresence>
        {challengeMode && targetState && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-600/20 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200">
              Change to <strong>{targetState}</strong>! Score: {challengeScore}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 rounded-2xl text-white font-bold"
          >
            🎉 Amazing! You explored all three states!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temperature Display */}
      <div className="text-center">
        <div className="text-5xl mb-2">{config.emoji}</div>
        <h3 className="text-xl font-bold text-emerald-400">{config.label}</h3>
        <p className="text-slate-400 text-sm">Temperature: {temperature}°C</p>
      </div>

      {/* Particle Container */}
      <div
        ref={containerRef}
        className="relative w-[340px] h-[300px] rounded-2xl border-2 border-slate-600 bg-slate-800/50 overflow-hidden"
      >
        {/* Background gradient based on state */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            currentState === 'solid'
              ? 'bg-gradient-to-b from-blue-900/30 to-blue-800/30'
              : currentState === 'liquid'
              ? 'bg-gradient-to-b from-cyan-900/30 to-cyan-800/30'
              : 'bg-gradient-to-b from-orange-900/30 to-red-900/30'
          }`}
        />

        {/* Particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className={`absolute w-4 h-4 rounded-full ${getParticleColor()} shadow-lg`}
            style={{
              left: p.x,
              top: p.y,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: currentState === 'gas' ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              repeat: currentState === 'gas' ? Infinity : 0,
            }}
          />
        ))}
      </div>

      {/* Temperature Slider */}
      <div className="w-full max-w-xs">
        <label className="block text-sm text-slate-300 mb-2 text-center">
          🌡️ Adjust Temperature
        </label>
        <input
          type="range"
          min="0"
          max="120"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-orange-500 rounded-lg appearance-none cursor-pointer"
          style={{
            WebkitAppearance: 'none',
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0°C</span>
          <span>60°C</span>
          <span>120°C</span>
        </div>
      </div>

      {/* Challenge Mode Button */}
      {!challengeMode ? (
        <button
          onClick={startChallenge}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Start Speed Challenge
        </button>
      ) : (
        <button
          onClick={() => setChallengeMode(false)}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-xl text-white"
        >
          End Challenge (Score: {challengeScore})
        </button>
      )}

      {/* Indian Context Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 max-w-sm"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Indian Connection:</span>{' '}
          {currentState === 'solid'
            ? 'Think of frozen kulfi straight from the matka!'
            : currentState === 'liquid'
            ? 'Like ghee melting on a hot paratha!'
            : 'Just like steam rising from your chai!'}
        </p>
      </motion.div>
    </div>
  );
}
