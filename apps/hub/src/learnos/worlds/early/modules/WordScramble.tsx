// src/worlds/early/modules/WordScramble.tsx
// Arrange scrambled words into correct sentence order. Canvas animation on success.

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { WORD_SENTENCES } from '../data/earlyContent';

export default function WordScramble() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordSentenceCompleted } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [placedWords, setPlacedWords] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const sentence = WORD_SENTENCES[sentenceIdx % WORD_SENTENCES.length];

  // Shuffle word indices for display
  const shuffledIndices = useMemo(() => {
    const indices = sentence.words.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [sentence]);

  const availableWords = shuffledIndices.filter(i => !placedWords.includes(i));

  const handleWordTap = useCallback(async (wordIdx: number) => {
    if (isCorrect) return;

    const nextSlot = placedWords.length;
    const expectedWordIdx = sentence.correctOrder[nextSlot];

    if (wordIdx === expectedWordIdx) {
      const newPlaced = [...placedWords, wordIdx];
      setPlacedWords(newPlaced);

      if (soundEnabled) try { AudioEngine.playTone({ frequency: 400 + nextSlot * 80, type: 'sine', duration: 0.15, volume: 0.2, attack: 0.01, decay: 0.05 }); } catch (_) {}

      // Check if complete
      if (newPlaced.length === sentence.words.length) {
        setIsCorrect(true);
        setShowAnimation(true);
        pip.celebrate();
        if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
        await trackCorrect('word-scramble', { sentence: sentence.id });
        await recordSentenceCompleted();
      }
    } else {
      pip.reactToMistake();
      await trackWrong('word-scramble', {});
      // Gentle hint
      if (placedWords.length === 0) {
        pip.sayCustom(`Try starting with "${sentence.words[sentence.correctOrder[0]]}" first!`, 'thinking');
      }
    }
  }, [isCorrect, placedWords, sentence, soundEnabled, pip, trackCorrect, trackWrong, recordSentenceCompleted]);

  const handleNext = useCallback(() => {
    setSentenceIdx(p => p + 1);
    setPlacedWords([]);
    setIsCorrect(false);
    setShowAnimation(false);
  }, []);

  // Canvas animation when correct
  useEffect(() => {
    if (!showAnimation) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const startTime = performance.now();
    const emoji = sentence.animationEmoji;

    const animate = (timestamp: number) => {
      const t = (timestamp - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(0, 0, w, h);

      // Simple animation: emoji moves across screen
      const emojiX = (t * 80) % (w + 60) - 30;
      const emojiY = h / 2 + Math.sin(t * 3) * 20;
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, emojiX, emojiY);

      // Sparkle trail
      for (let i = 0; i < 3; i++) {
        const sparkleX = emojiX - 20 - i * 15;
        const sparkleY = emojiY + Math.sin(t * 5 + i) * 10;
        ctx.globalAlpha = 0.5 - i * 0.15;
        ctx.font = '16px sans-serif';
        ctx.fillText('✨', sparkleX, sparkleY);
      }
      ctx.globalAlpha = 1;

      if (t < 4) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [showAnimation, sentence.animationEmoji]);

  // Word colors for visual distinction
  const wordColors = ['#7C3AED', '#0EA5E9', '#16A34A', '#EA580C', '#DB2777'];

  return (
    <EarlyShell module="word-scramble">
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex flex-col p-6">
        {/* Pip instruction */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{t('early.modules.WordScramble.spn_', '🐤✏️')}</span>
            <p className="text-lg font-bold text-gray-700">{t('early.modules.WordScramble.txt_Puttheword', 'Put the words in the right order!')}</p>
          </div>
        </div>

        {/* Placed words (slots) */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[60px]">
          {sentence.words.map((_, slotIdx) => {
            const placedWordIdx = placedWords[slotIdx];
            const isFilled = placedWordIdx !== undefined;
            return (
              <div key={slotIdx}
                className={`px-4 py-3 rounded-xl border-2 min-w-[60px] min-h-[48px] flex items-center justify-center font-bold text-xl transition-all ${
                  isFilled ? 'bg-white border-green-300 text-gray-800' : 'bg-gray-100 border-dashed border-gray-300 text-gray-300'
                }`}>
                {isFilled ? sentence.words[placedWordIdx] : slotIdx + 1}
              </div>
            );
          })}
        </div>

        {/* Available words (scrambled) */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {availableWords.map((wordIdx) => (
            <motion.button key={wordIdx} whileTap={{ scale: 0.92 }}
              onClick={() => handleWordTap(wordIdx)}
              className="px-5 py-3 rounded-xl shadow-md font-bold text-xl text-white min-h-[52px]"
              style={{ backgroundColor: wordColors[wordIdx % wordColors.length] }}>
              {sentence.words[wordIdx]}
            </motion.button>
          ))}
        </div>

        {/* Animation canvas (visible when correct) */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden border border-amber-200 shadow-sm mb-4">
              <canvas ref={canvasRef} className="w-full block" style={{ height: '120px' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed sentence display */}
        {isCorrect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4 text-center">
            <p className="text-2xl font-bold text-green-700">{sentence.words.join(' ')} {sentence.animationEmoji}</p>
          </motion.div>
        )}

        {/* Next button */}
        {isCorrect && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
            onClick={handleNext}
            className="w-full py-4 bg-amber-500 text-white font-bold text-xl rounded-2xl min-h-[56px]">
            <Trans i18nKey="auto.wordscramble.next_sentence">Next Sentence ✏️</Trans>
                                </motion.button>
        )}
      </div>
    </EarlyShell>
  );
}
