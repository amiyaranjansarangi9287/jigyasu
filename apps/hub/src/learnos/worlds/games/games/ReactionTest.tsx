import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'early';

interface Props { darkMode: boolean; }

export default function ReactionTest({ darkMode }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const average = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  const startTest = useCallback(() => {
    setState('waiting');
    setReactionTime(null);
    setCountdown(null);
    
    // Random delay between 1-5 seconds
    const delay = 1000 + Math.random() * 4000;
    
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'idle') {
      startTest();
      return;
    }
    
    if (state === 'waiting') {
      // Clicked too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
      setReactionTime(null);
      return;
    }
    
    if (state === 'ready') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setTimes(prev =>[...prev.slice(-9), time]);
      if (bestTime === null || time< bestTime) {
        setBestTime(time);
      }
      setState('clicked');
      return;
    }
    
    if (state === 'clicked' || state === 'early') {
      startTest();
      return;
    }
  }, [state, startTest, bestTime]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Countdown for waiting state
  useEffect(() => {
    if (state !== 'waiting') return;
    
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        setCountdown(null);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state]);

  const getBackgroundColor = () => {
    switch (state) {
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'early': return 'bg-orange-500';
      default: return darkMode ? 'bg-gray-800' : 'bg-blue-500';
    }
  };

  const getMessage = () => {
    switch (state) {
      case 'idle': return { title: '⚡ Reaction Test', subtitle: 'Click anywhere to start' };
      case 'waiting': return { title: '🔴 Wait for green...', subtitle: countdown ? `${countdown}...` : 'Get ready!' };
      case 'ready': return { title: '🟢 CLICK NOW!', subtitle: '' };
      case 'clicked': return { 
        title: `⚡ ${reactionTime} ms`, 
        subtitle: reactionTime! < 200 ? '🔥 Incredible!' : reactionTime! < 300 ? '👍 Great!' : reactionTime! < 400 ? '😊 Good' : '🐢 Keep practicing!' 
      };
      case 'early': return { title: '😬 Too early!', subtitle: 'Wait for green next time' };
    }
  };

  const getRank = (time: number): string => {
    if (time < 150) return '🏆 Superhuman';
    if (time < 200) return '⚡ Lightning';
    if (time < 250) return '🚀 Fast';
    if (time < 300) return '🏃 Quick';
    if (time < 350) return '👍 Average';
    if (time < 400) return '🐢 Slow';
    return '🦥 Sleepy';
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Stats */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {bestTime && <span>🏆 Best: {bestTime}ms</span>}
        {average && <span>📊 Avg: {average}ms</span>}
        <span>🎯 Tries: {times.length}</span>
      </div>

      {/* Main game area */}
      <button
        onClick={handleClick}
        className={`w-full h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${getBackgroundColor()}`}
      >
        <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-xl text-white/80">{subtitle}</p>}
        
        {state === 'clicked' && reactionTime && (
          <p className="mt-4 text-lg text-white/90">{getRank(reactionTime)}</p>
        )}
      </button>

      {/* History */}
      {times.length >0 && (<div className={`mt-6 w-full p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('auto.learning.s527_recent_times', 'Recent Times')}</h3>
          <div className="flex flex-wrap gap-2">
            {times.map((time, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  time === bestTime
                    ? 'bg-green-500 text-white'
                    : time < 250
                      ? 'bg-blue-100 text-blue-700'
                      : time < 350
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                }`}
              >
                {time}ms
              </span>
            ))}
          </div>
          
          {/* Visual chart */}
          <div className="mt-4 flex items-end gap-1 h-20">
            {times.map((time, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${
                  time === bestTime ? 'bg-green-500' : 'bg-blue-400'
                }`}
                style={{ height: `${Math.max(10, 100 - (time - 150) / 3)}%` }}
                title={`${time}ms`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {times.length >0 && (<button
          onClick={() => {
            setTimes([]);
            setBestTime(null);
            setState('idle');
            setReactionTime(null);
          }}
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >🔄 Reset Stats</button>
      )}

      <p className={`mt-4 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Average human reaction time is ~250ms. Can you beat it?
      </p>
    </div>
  );
}
