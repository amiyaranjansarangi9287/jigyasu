import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { CanvasProps } from '../../types';

interface MoonPhase {
  name: string;
  indianName: string;
  emoji: string;
  dayStart: number;
  dayEnd: number;
  illumination: number;
  description: string;
  significance: string;
}

const phases: MoonPhase[] = [
  { name: 'New Moon', indianName: 'Amavasya (अमावस्या)', emoji: '🌑', dayStart: 0, dayEnd: 1, illumination: 0, description: 'The Moon is between Earth and Sun - we can\'t see its lit side!', significance: 'Day of ancestors, fasting, and new beginnings' },
  { name: 'Waxing Crescent', indianName: 'Shukla Dwitiya', emoji: '🌒', dayStart: 2, dayEnd: 6, illumination: 25, description: 'A thin sliver of light appears - the Moon is "growing"!', significance: 'Good time to start new projects' },
  { name: 'First Quarter', indianName: 'Shukla Ashtami', emoji: '🌓', dayStart: 7, dayEnd: 9, illumination: 50, description: 'Half the Moon is lit - we\'re quarter way through the cycle!', significance: 'Ashtami - eighth day of lunar fortnight' },
  { name: 'Waxing Gibbous', indianName: 'Shukla Ekadashi', emoji: '🌔', dayStart: 10, dayEnd: 13, illumination: 75, description: 'More than half lit - almost full! "Gibbous" means hump-shaped.', significance: 'Ekadashi - fasting day for spiritual growth' },
  { name: 'Full Moon', indianName: 'Purnima (पूर्णिमा)', emoji: '🌕', dayStart: 14, dayEnd: 15, illumination: 100, description: 'The complete face of the Moon shines bright! Earth is between Sun and Moon.', significance: 'Festival day - Holi, Buddha Purnima, Guru Purnima' },
  { name: 'Waning Gibbous', indianName: 'Krishna Dwitiya', emoji: '🌖', dayStart: 16, dayEnd: 20, illumination: 75, description: 'The Moon starts shrinking - light decreases from the right.', significance: 'Krishna Paksha (dark fortnight) begins' },
  { name: 'Last Quarter', indianName: 'Krishna Ashtami', emoji: '🌗', dayStart: 21, dayEnd: 23, illumination: 50, description: 'Half lit again, but from the other side!', significance: 'Time for reflection and completion' },
  { name: 'Waning Crescent', indianName: 'Krishna Chaturdashi', emoji: '🌘', dayStart: 24, dayEnd: 29, illumination: 25, description: 'Just a sliver remains - soon it will be New Moon again!', significance: 'Preparation for Amavasya' },
];

export function MoonPhasesCanvas({ isPlaying }: CanvasProps) {
  const [currentDay, setCurrentDay] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const lunarCycle = 29.5;

  const getCurrentPhase = (day: number): MoonPhase => {
    const normalizedDay = day % lunarCycle;
    return phases.find(p => normalizedDay >= p.dayStart && normalizedDay <= p.dayEnd) || phases[0];
  };

  const currentPhase = getCurrentPhase(currentDay);

  useEffect(() => {
    if (!isPlaying || quizMode) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setCurrentDay((prev) => (prev + delta * 2) % lunarCycle);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying, quizMode]);

  const startQuiz = () => {
    setQuizMode(true);
    setQuizAnswer(null);
    setShowResult(false);
    // Set a random day for the quiz
    setCurrentDay(Math.floor(Math.random() * lunarCycle));
  };

  const submitQuizAnswer = (phaseIndex: number) => {
    setQuizAnswer(phaseIndex);
    setShowResult(true);
  };

  const correctPhaseIndex = phases.findIndex(p => p.name === currentPhase.name);
  const isCorrect = quizAnswer === correctPhaseIndex;

  // Calculate moon appearance
  const getMoonStyle = () => {
    const illumination = currentPhase.illumination / 100;
    const day = currentDay % lunarCycle;
    const isWaxing = day < 15;
    
    // Create a gradient for moon phases
    if (illumination === 0) {
      return { background: '#1a1a2e' };
    }
    if (illumination === 1) {
      return { background: 'linear-gradient(135deg, #f5f5f5 0%, #d4d4d4 50%, #a3a3a3 100%)' };
    }
    
    const litPercent = illumination * 100;
    if (isWaxing) {
      return {
        background: `linear-gradient(90deg, #1a1a2e 0%, #1a1a2e ${100 - litPercent}%, #e5e5e5 ${100 - litPercent}%, #f5f5f5 100%)`,
      };
    } else {
      return {
        background: `linear-gradient(90deg, #f5f5f5 0%, #e5e5e5 ${litPercent}%, #1a1a2e ${litPercent}%, #1a1a2e 100%)`,
      };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-950 to-black">
      {/* Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Moon Display */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative"
        >
          <div
            className="h-40 w-40 rounded-full shadow-2xl"
            style={{
              ...getMoonStyle(),
              boxShadow: `0 0 60px 10px rgba(255, 255, 255, ${currentPhase.illumination / 400})`,
            }}
          />
          {/* Craters */}
          <div className="absolute left-1/4 top-1/3 h-6 w-6 rounded-full bg-gray-300/20" />
          <div className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full bg-gray-300/15" />
          <div className="absolute right-1/4 top-1/4 h-4 w-4 rounded-full bg-gray-300/20" />
        </motion.div>
      </div>

      {/* Phase Info Panel */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span className="text-4xl">{currentPhase.emoji}</span>
            <h3 className="mt-2 text-xl font-bold text-white">{currentPhase.name}</h3>
            <p className="text-amber-400">{currentPhase.indianName}</p>
            <p className="mt-2 max-w-xs text-sm text-slate-300">{currentPhase.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Day Counter */}
      <div className="absolute left-4 top-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-400" />
          <span className="text-sm text-slate-400">Lunar Day</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-white">{Math.floor(currentDay) + 1}</p>
        <p className="text-xs text-slate-500">of 29.5 days</p>
        
        {/* Day Slider */}
        <input
          type="range"
          min="0"
          max={lunarCycle - 0.1}
          step="0.5"
          value={currentDay}
          onChange={(e) => setCurrentDay(parseFloat(e.target.value))}
          className="mt-2 w-full accent-sky-500"
        />
      </div>

      {/* Phase Timeline */}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur">
        <div className="flex justify-between">
          {phases.map((phase) => (
            <button
              key={phase.name}
              onClick={() => setCurrentDay(phase.dayStart)}
              className={`flex flex-col items-center transition-all ${
                phase.name === currentPhase.name
                  ? 'scale-110 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{phase.emoji}</span>
              <span className="mt-1 hidden text-xs sm:block">{phase.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Button */}
      <button
        onClick={startQuiz}
        className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-purple-300 hover:bg-purple-500/30 transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-sm">Quiz Me!</span>
      </button>

      {/* Indian Context */}
      <div className="absolute right-4 top-16 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 max-w-xs">
        <p className="text-xs text-amber-300">🇮🇳 {currentPhase.significance}</p>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="mx-4 max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white">🌙 Moon Phase Quiz</h3>
              <p className="mt-2 text-slate-300">What phase is the Moon in right now?</p>

              {!showResult ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {phases.map((phase, pIdx) => (
                    <button
                      key={phase.name}
                      onClick={() => submitQuizAnswer(pIdx)}
                      className="flex items-center gap-2 rounded-lg bg-slate-700 p-3 text-left hover:bg-slate-600 transition-colors"
                    >
                      <span>{phase.emoji}</span>
                      <span className="text-sm text-white">{phase.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4">
                  <div className={`flex items-center gap-2 rounded-lg p-4 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                    <div>
                      <p className={`font-medium ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                        {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
                      </p>
                      <p className="text-sm text-slate-300">
                        The answer is: {currentPhase.emoji} {currentPhase.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setQuizMode(false)}
                className="mt-4 w-full rounded-lg bg-sky-500 py-2 text-white font-medium hover:bg-sky-600 transition-colors"
              >
                {showResult ? 'Continue Exploring' : 'Cancel'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
