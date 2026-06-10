// src/worlds/early/modules/PatternPatrol.tsx
// Detective-themed pattern completion. Difficulty escalates.

import { useState, useCallback, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { PATTERNS } from '../data/earlyContent';

export default function PatternPatrol() {
  const { t } = useTranslation();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordPatternCompleted } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [difficulty, setDifficulty] = useState(1);
  const [patternIdx, setPatternIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const patternsForDiff = useMemo(() => PATTERNS.filter(p => p.difficulty === difficulty), [difficulty]);
  const pattern = patternsForDiff[patternIdx % patternsForDiff.length];

  // Determine the correct answer emoji
  const getCorrectAnswer = useCallback(() => {
    const seq = pattern.sequence;
    const t = pattern.type;
    if (t === 'AB') return seq[0].emoji;
    if (t === 'ABB') return seq[1].emoji;
    if (t === 'ABC') return seq[2].emoji;
    if (t === 'size') return seq[2].emoji;
    if (t === 'color+shape') return seq[0].emoji;
    return seq[0].emoji;
  }, [pattern]);

  // Generate 3 options: correct + 2 distractors
  const options = useMemo(() => {
    const correct = getCorrectAnswer();
    const allEmojis = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '🌙', '🍎', '🍌', '🐱', '🐶', '🌸', '🌿', '🐘'];
    const distractors = allEmojis.filter(e => e !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  }, [getCorrectAnswer]);

  const handleSelect = useCallback(async (emoji: string) => {
    if (showResult) return;
    setSelectedOption(emoji);
    const isCorrect = emoji === getCorrectAnswer();

    if (isCorrect) {
      setShowResult(true);
      pip.celebrate();
      if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
      await trackCorrect('pattern-patrol', { difficulty, pattern: pattern.id });
      await recordPatternCompleted(difficulty);
      const newConsec = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsec);
      setWrongCount(0);

      // Auto-advance after delay
      setTimeout(() => {
        if (newConsec >= 3 && difficulty < 3) {
          setDifficulty(d => d + 1);
          setConsecutiveCorrect(0);
          pip.sayCustom("Ooh! You're a REAL detective now!", 'celebrating');
        }
        setPatternIdx(p => p + 1);
        setSelectedOption(null);
        setShowResult(false);
      }, 1500);
    } else {
      pip.reactToMistake();
      await trackWrong('pattern-patrol', {});
      setWrongCount(w => w + 1);
      setConsecutiveCorrect(0);
      // Shake wrong option briefly, allow retry
      setTimeout(() => setSelectedOption(null), 600);
      if (wrongCount >= 1) pip.sayCustom('Look at the colours... what repeats?', 'thinking');
    }
  }, [showResult, getCorrectAnswer, pip, soundEnabled, trackCorrect, trackWrong, recordPatternCompleted, difficulty, pattern.id, consecutiveCorrect, wrongCount]);

  // Size modifier for 'size' patterns
  const sizeMap = { small: 'text-3xl', medium: 'text-5xl', large: 'text-7xl' };

  return (
    <EarlyShell module="pattern-patrol">
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-fuchsia-50 flex flex-col p-6">
        {/* Detective header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-200 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{t('early.modules.PatternPatrol.spn_', '🐤🔍')}</span>
            <div>
              <p className="text-lg font-bold text-gray-700">{t('early.modules.PatternPatrol.txt_Whatcomesn', 'What comes next?')}</p>
              <p className="text-sm text-gray-500"><Trans i18nKey="auto.patternpatrol.level">Level</Trans> {difficulty} · {consecutiveCorrect}<Trans i18nKey="auto.patternpatrol.3_to_level_up">/3 to level up</Trans></p>
            </div>
          </div>
        </div>

        {/* Pattern sequence */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {pattern.sequence.map((item, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                className={`w-16 h-16 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm ${
                  showResult ? 'border-green-300' : ''
                }`}>
                <span className={item.size ? sizeMap[item.size] : 'text-4xl'}>{item.emoji}</span>
              </motion.div>
            ))}
            {/* Missing element */}
            <motion.div animate={showResult ? { scale: [1, 1.2, 1] } : { scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: showResult ? 0 : Infinity, duration: 1.5 }}
              className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-sm ${
                showResult ? 'bg-green-100 border-green-400' : 'bg-pink-50 border-dashed border-pink-400'
              }`}>
              {showResult ? <span className="text-4xl">{getCorrectAnswer()}</span> : <span className="text-3xl text-pink-400">{t('early.modules.PatternPatrol.spn_', '❓')}</span>}
            </motion.div>
          </div>

          {/* Options */}
          <div className="flex justify-center gap-4">
            {options.map((emoji) => {
              const isSelected = selectedOption === emoji;
              const isCorrect = showResult && emoji === getCorrectAnswer();
              const isWrong = isSelected && !isCorrect && !showResult;

              return (
                <motion.button key={emoji} whileTap={{ scale: 0.9 }}
                  animate={isWrong ? { x: [0, -8, 8, -8, 0] } : {}}
                  onClick={() => handleSelect(emoji)}
                  disabled={showResult}
                  className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all min-h-[80px] ${
                    isCorrect ? 'bg-green-100 border-green-400 scale-110' : isSelected ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                  {emoji}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Level progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map(l => (
            <div key={l} className={`w-3 h-3 rounded-full transition-all ${l <= difficulty ? 'bg-pink-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>
    </EarlyShell>
  );
}
