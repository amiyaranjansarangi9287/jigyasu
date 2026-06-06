// src/worlds/early/modules/AlphabetForest.tsx

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { ALPHABET_CONTENT } from '../data/earlyContent';

export default function AlphabetForest() {
  const { t } = useTranslation();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordLetterExplored, progress } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [targetItemIdx, setTargetItemIdx] = useState<number>(0);
  const [showItems, setShowItems] = useState(false);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null);
  const [exploredLetters, setExploredLetters] = useState<string[]>(progress?.lettersExplored ?? []);

  const selectLetter = useCallback((idx: number) => {
    const lc = ALPHABET_CONTENT[idx];
    setSelectedIdx(idx);
    setShowItems(true);
    setAnsweredCorrect(null);
    const target = Math.floor(Math.random() * lc.items.length);
    setTargetItemIdx(target);
    pip.sayCustom(`${lc.phonemeSound}! Find the ${lc.items[target].word}!`, 'excited');
    if (soundEnabled) try { AudioEngine.playTone({ frequency: 300 + idx * 15, type: 'triangle', duration: 0.3, volume: 0.2, attack: 0.02, decay: 0.1 }); } catch (_) {}
    recordLetterExplored(lc.letter);
    setExploredLetters(p => p.includes(lc.letter) ? p : [...p, lc.letter]);
  }, [pip, soundEnabled, recordLetterExplored]);

  const handleItemTap = useCallback(async (itemIdx: number) => {
    if (answeredCorrect !== null || selectedIdx === null) return;
    const isCorrect = itemIdx === targetItemIdx;
    setAnsweredCorrect(isCorrect);
    if (isCorrect) { pip.celebrate(); if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {} await trackCorrect('alphabet-forest', { letter: ALPHABET_CONTENT[selectedIdx].letter }); }
    else { pip.reactToMistake(); await trackWrong('alphabet-forest', {}); }
  }, [answeredCorrect, selectedIdx, targetItemIdx, pip, soundEnabled, trackCorrect, trackWrong]);

  const handleClose = useCallback(() => { setShowItems(false); setSelectedIdx(null); setAnsweredCorrect(null); }, []);

  return (
    <EarlyShell module="alphabet-forest">
      <div className="min-h-screen bg-green-50 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t('early.modules.AlphabetForest.spn_', '🐤')}</span>
              <p className="text-lg font-bold text-gray-700">
                {selectedIdx !== null ? `Find: ${ALPHABET_CONTENT[selectedIdx].items[targetItemIdx].word}!` : 'Tap a letter to explore!'}
              </p>
            </div>
          </div>
        </div>

        {/* Letter tab row */}
        <div className="px-3 py-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {ALPHABET_CONTENT.map((lc, i) => (
              <button key={lc.letter} onClick={() => selectLetter(i)}
                className={`flex-shrink-0 w-10 h-10 rounded-xl font-bold text-base transition-all min-w-[40px] ${
                  exploredLetters.includes(lc.letter) ? 'bg-green-500 text-white' : selectedIdx === i ? 'bg-yellow-400 text-white' : 'bg-white border border-gray-200 text-gray-700'
                }`}>{lc.letter}</button>
            ))}
          </div>
        </div>

        {/* Forest scene placeholder */}
        {!showItems && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="flex justify-center gap-4 text-6xl mb-4">🌲🌳🌲</div>
              <p className="text-gray-500 text-base font-medium">{t('early.modules.AlphabetForest.txt_Tapaletter', 'Tap a letter above to explore!')}</p>
            </div>
          </div>
        )}

        {/* Items overlay */}
        <AnimatePresence>
          {showItems && selectedIdx !== null && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="flex-1 px-5 pb-24">
              <div className="text-center mb-4">
                <span className="text-7xl font-extrabold text-green-600">{ALPHABET_CONTENT[selectedIdx].letter}</span>
                <p className="text-base text-gray-500 font-medium mt-1">sounds like: {ALPHABET_CONTENT[selectedIdx].phonemeSound}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ALPHABET_CONTENT[selectedIdx].items.map((item, i) => {
                  const isTarget = i === targetItemIdx;
                  const done = answeredCorrect !== null;
                  return (
                    <motion.button key={item.word} whileTap={{ scale: 0.95 }} onClick={() => handleItemTap(i)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all min-h-[120px] ${
                        !done ? 'bg-white border-gray-200' : isTarget && answeredCorrect ? 'bg-green-100 border-green-400' : isTarget ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-100 opacity-50'
                      }`}>
                      <span className="text-5xl">{item.emoji}</span>
                      <span className="text-sm font-bold text-gray-700">{item.word}</span>
                      {done && isTarget && <span className="text-base">{answeredCorrect ? '✓' : '→'}</span>}
                    </motion.button>
                  );
                })}
              </div>
              {answeredCorrect !== null && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={handleClose}
                  className="w-full py-4 bg-green-600 text-white font-bold text-xl rounded-2xl mt-5 min-h-[56px]">Next Letter 🌳</motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EarlyShell>
  );
}
