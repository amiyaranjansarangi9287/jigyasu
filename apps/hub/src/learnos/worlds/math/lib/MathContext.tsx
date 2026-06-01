import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from './soundEngine';
import { recordAnswer, getTopicStats, getDifficultyLabel, getDifficultyEmoji, getAllStats, type DiffLevel } from './difficultyEngine';

// ─── Types ───
interface FeedbackEvent {
  id: number;
  type: 'correct' | 'wrong' | 'levelup' | 'celebrate';
  message?: string;
  topic?: string;
  level?: DiffLevel;
}

interface MathContextValue {
  correct: (topic: string, points?: number) => void;
  wrong: (topic: string) => void;
  celebrate: (message?: string) => void;
  getLevel: (topic: string) => DiffLevel;
  getStats: (topic: string) => { level: DiffLevel; correct: number; total: number; streak: number };
  getAllTopicStats: () => Record<string, { level: DiffLevel; correct: number; total: number; streak: number }>;
  totalXP: number;
}

const MathContext = createContext<MathContextValue | null>(null);

// ─── Hook that any module can call ───
export function useMathFeedback() {
  const ctx = useContext(MathContext);
  if (!ctx) throw new Error('useMathFeedback must be used inside MathProvider');
  return ctx;
}

// ─── Provider + overlay UI ───
let nextId = 0;

export function MathProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<FeedbackEvent[]>([]);
  const [totalXP, setTotalXP] = useState(() => {
    try { return parseInt(localStorage.getItem('mathkingdom_xp') || '0'); } catch { return 0; }
  });
  // Track timer IDs to clear on unmount (prevents setState-after-unmount warnings)
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timerIds.current.forEach(clearTimeout); }, []);

  const pushEvent = useCallback((event: Omit<FeedbackEvent, 'id'>) => {
    const id = nextId++;
    setEvents(prev => [...prev, { ...event, id }]);
    const tid = setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), 2200);
    timerIds.current.push(tid);
  }, []);


  const addXP = useCallback((amount: number) => {
    setTotalXP(prev => {
      const next = prev + amount;
      try { localStorage.setItem('mathkingdom_xp', String(next)); } catch {}
      return next;
    });
  }, []);

  const correct = useCallback((topic: string, points = 10) => {
    sfx.correct();
    addXP(points);
    const result = recordAnswer(topic, true);
    if (result.levelChanged && result.direction === 'up') {
      sfx.levelUp();
      pushEvent({ type: 'levelup', topic, level: result.level, message: `Level up! ${getDifficultyEmoji(result.level)} ${getDifficultyLabel(result.level)}` });
    } else {
      pushEvent({ type: 'correct', message: `+${points} XP` });
    }
  }, [addXP, pushEvent]);

  const wrong = useCallback((topic: string) => {
    sfx.wrong();
    recordAnswer(topic, false);
    pushEvent({ type: 'wrong' });
  }, [pushEvent]);

  const celebrate = useCallback((message?: string) => {
    sfx.celebrate();
    pushEvent({ type: 'celebrate', message: message || '🎉 Amazing!' });
  }, [pushEvent]);

  const getLevel = useCallback((topic: string): DiffLevel => {
    return getTopicStats(topic).level;
  }, []);

  const getStats = useCallback((topic: string) => {
    const s = getTopicStats(topic);
    return { level: s.level, correct: s.correct, total: s.total, streak: s.streak };
  }, []);

  const getAllTopicStats = useCallback(() => {
    return getAllStats();
  }, []);

  const value: MathContextValue = { correct, wrong, celebrate, getLevel, getStats, getAllTopicStats, totalXP };

  return (
    <MathContext.Provider value={value}>
      {children}

      {/* ─── Floating Toast Overlay ─── */}
      <div role="status" aria-live="polite" aria-atomic="true" className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {events.map(event => (
            <motion.div
              key={event.id}
              className={`px-4 py-2.5 rounded-xl backdrop-blur-lg border shadow-xl text-sm font-bold flex items-center gap-2 ${
                event.type === 'correct' ? 'bg-green-500/20 border-green-400/40 text-green-300'
                : event.type === 'wrong' ? 'bg-red-500/20 border-red-400/40 text-red-300'
                : event.type === 'levelup' ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300'
                : 'bg-purple-500/20 border-purple-400/40 text-purple-300'
              }`}
              initial={{ opacity: 0, x: 60, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {event.type === 'correct' && <span>✅</span>}
              {event.type === 'wrong' && <span>❌</span>}
              {event.type === 'levelup' && <span>🎉</span>}
              {event.type === 'celebrate' && <span>🏆</span>}
              <span>{event.message || (event.type === 'wrong' ? 'Try again!' : '')}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </MathContext.Provider>
  );
}
