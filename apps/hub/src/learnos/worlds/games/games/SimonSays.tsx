import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const COLORS = [
  { id: 0, name: 'green', bg: 'bg-green-500', active: 'bg-green-300', hover: 'hover:bg-green-400', freq: 392 },
  { id: 1, name: 'red', bg: 'bg-red-500', active: 'bg-red-300', hover: 'hover:bg-red-400', freq: 330 },
  { id: 2, name: 'yellow', bg: 'bg-yellow-500', active: 'bg-yellow-300', hover: 'hover:bg-yellow-400', freq: 262 },
  { id: 3, name: 'blue', bg: 'bg-blue-500', active: 'bg-blue-300', hover: 'hover:bg-blue-400', freq: 220 },
];

type GameState = 'idle' | 'showing' | 'input' | 'gameover';
type Speed = 'slow' | 'normal' | 'fast';
type GameMode = 'classic' | 'strict' | 'reverse';

const SPEEDS: Record<Speed, number> = { slow: 800, normal: 500, fast: 300 };

// Web Audio for sound
let audioContext: AudioContext | null = null;

function playTone(frequency: number, duration: number) {
  const { t } = useTranslation();
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch {
    // Audio not supported
  }
}

function playErrorTone() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 100;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Audio not supported
  }
}

interface Props { darkMode: boolean; }

export default function SimonSays({ darkMode }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [mode, setMode] = useState<GameMode>('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lives, setLives] = useState(3);
  
  const timeoutRef = useRef<number | null>(null);
  const sequenceRef = useRef<number[]>([]);

  const playSound = useCallback((index: number) => {
    setActiveColor(index);
    if (soundEnabled) {
      playTone(COLORS[index].freq, SPEEDS[speed] / 2);
    }
    setTimeout(() => setActiveColor(null), SPEEDS[speed] / 2);
  }, [soundEnabled, speed]);

  const showSequence = useCallback(async (seq: number[]) => {
    setGameState('showing');
    sequenceRef.current = seq;
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => {
        timeoutRef.current = window.setTimeout(() => {
          playSound(seq[i]);
          resolve(null);
        }, i === 0 ? 500 : SPEEDS[speed]);
      });
    }
    
    await new Promise(resolve => {
      timeoutRef.current = window.setTimeout(resolve, SPEEDS[speed]);
    });
    
    setGameState('input');
    setPlayerInput([]);
  }, [speed, playSound]);

  const startGame = useCallback(() => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setScore(0);
    setLives(mode === 'strict' ? 1 : 3);
    setPlayerInput([]);
    showSequence([firstColor]);
  }, [showSequence, mode]);

  const handleColorClick = useCallback((colorId: number) => {
    if (gameState !== 'input') return;

    playSound(colorId);
    
    const expectedSequence = mode === 'reverse' 
      ? [...sequenceRef.current].reverse() 
      : sequenceRef.current;
    
    const newInput = [...playerInput, colorId];
    setPlayerInput(newInput);

    // Check if correct
    if (expectedSequence[newInput.length - 1] !== colorId) {
      if (soundEnabled) playErrorTone();
      
      if (mode === 'strict' || lives <= 1) {
        setGameState('gameover');
        if (score > highScore) setHighScore(score);
      } else {
        setLives(l => l - 1);
        // Replay sequence
        setTimeout(() => showSequence(sequenceRef.current), 1000);
      }
      return;
    }

    // Check if sequence complete
    if (newInput.length === expectedSequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      const nextColor = Math.floor(Math.random() * 4);
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      setTimeout(() => showSequence(newSequence), 1000);
    }
  }, [gameState, playerInput, mode, sequence, score, highScore, lives, playSound, showSequence, soundEnabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getMessage = () => {
    switch (gameState) {
      case 'idle': return 'Press Start to begin!';
      case 'showing': return mode === 'reverse' ? 'Watch... then reverse!' : 'Watch the sequence...';
      case 'input': return `Your turn! (${playerInput.length}/${mode === 'reverse' ? sequence.length : sequence.length})`;
      case 'gameover': return `Game Over! Score: ${score}`;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Mode */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        {(['classic', 'strict', 'reverse'] as GameMode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setGameState('idle'); setSequence([]); }}
            disabled={gameState !== 'idle' && gameState !== 'gameover'}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 ${
              mode === m
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {m === 'classic' ? '🎮 Classic' : m === 'strict' ? '💀 Strict' : '🔄 Reverse'}
          </button>
        ))}
      </div>

      {/* Speed & Sound */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {(['slow', 'normal', 'fast'] as Speed[]).map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            disabled={gameState !== 'idle' && gameState !== 'gameover'}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 ${
              speed === s
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Scores */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>🎯 Score: {score}</span>
        <span>🏆 Best: {highScore}</span>
        {mode !== 'strict' && <span>❤️ {lives}</span>}
      </div>

      {/* Status */}
      <div className={`text-lg font-bold mb-6 px-4 py-2 rounded-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-sm'
      }`}>
        {getMessage()}
      </div>

      {/* Game board */}
      <div className={`relative p-4 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <div className="grid grid-cols-2 gap-3">
          {COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              disabled={gameState !== 'input'}
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full transition-all duration-150 shadow-lg ${
                activeColor === color.id
                  ? `${color.active} scale-105 ring-4 ring-white`
                  : `${color.bg} ${gameState === 'input' ? color.hover + ' cursor-pointer' : 'cursor-not-allowed'}`
              } ${
                color.id === 0 ? 'rounded-br-none' :
                color.id === 1 ? 'rounded-bl-none' :
                color.id === 2 ? 'rounded-tr-none' :
                'rounded-tl-none'
              }`}
            />
          ))}
        </div>
        
        {/* Center circle */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-gray-900' : 'bg-gray-200'
        }`}>
          <div className="text-center">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {score}
            </span>
            {mode === 'reverse' && gameState === 'input' && (
              <div className="text-xs text-purple-500 font-bold">🔄</div>
            )}
          </div>
        </div>
      </div>

      {/* Sequence display */}
      <div className="mt-4 flex gap-1 flex-wrap justify-center max-w-xs">
        {sequence.map((colorId, i) => {
          const expectedIndex = mode === 'reverse' ? sequence.length - 1 - i : i;
          const isCorrect = playerInput[i] !== undefined && playerInput[i] === (mode === 'reverse' ? sequence[sequence.length - 1 - i] : sequence[i]);
          const isWrong = playerInput[i] !== undefined && !isCorrect;
          
          return (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${COLORS[colorId].bg} ${
                playerInput[expectedIndex] !== undefined
                  ? isCorrect
                    ? 'ring-2 ring-green-400'
                    : isWrong
                      ? 'ring-2 ring-red-400'
                      : 'opacity-30'
                  : 'opacity-30'
              }`}
            />
          );
        })}
      </div>

      {/* Mode description */}
      <p className={`mt-3 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {mode === 'classic' ? '3 lives - watch and repeat' : 
         mode === 'strict' ? 'One mistake = game over!' : 
         'Watch, then repeat in REVERSE order!'}
      </p>

      <button
        onClick={startGame}
        disabled={gameState === 'showing' || gameState === 'input'}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md disabled:opacity-50"
      >
        {gameState === 'idle' ? 'Start' : gameState === 'gameover' ? 'Play Again' : 'Playing...'}
      </button>
    </div>
  );
}
