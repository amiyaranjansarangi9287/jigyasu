// src/worlds/early/modules/StoryBuilder.tsx

import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { ProgressDots } from '../components/ProgressDots';
import { STORY_CHARACTERS, STORY_PLACES, STORY_PROBLEMS, STORY_PANEL_TEMPLATES } from '../data/earlyContent';

type BuildStep = 'character' | 'place' | 'problem' | 'story' | 'quiz';

export default function StoryBuilder() {
  const { t } = useTranslation();
  const pip = usePip();
  const { recordStoryBuilt } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [step, setStep] = useState<BuildStep>('character');
  const [selectedChar, setSelectedChar] = useState<typeof STORY_CHARACTERS[0] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<typeof STORY_PLACES[0] | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<typeof STORY_PROBLEMS[0] | null>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const generatePanelText = useCallback((idx: number): string => {
    if (!selectedChar || !selectedPlace || !selectedProblem) return '';
    return STORY_PANEL_TEMPLATES[idx].template
      .replace(/{character}/g, selectedChar.name)
      .replace(/{place}/g, selectedPlace.name)
      .replace(/{problem}/g, selectedProblem.name.toLowerCase());
  }, [selectedChar, selectedPlace, selectedProblem]);

  const comprehensionOptions = selectedChar
    ? [selectedChar.name, 'Dragon', 'Robot', 'Princess'].sort(() => Math.random() - 0.5)
    : [];

  const handleCharSelect = (c: typeof STORY_CHARACTERS[0]) => { setSelectedChar(c); pip.sayCustom(`${t('auto.storybuilder.ooh', 'Ooh!')} ${c.name}! ${t('auto.storybuilder.great_choice', 'Great choice!')}`, 'excited'); setTimeout(() => setStep('place'), 800); };
  const handlePlaceSelect = (p: typeof STORY_PLACES[0]) => { setSelectedPlace(p); pip.sayCustom(`${t('auto.storybuilder.the', 'The')} ${p.name}! ${t('auto.storybuilder.how_exciting', 'How exciting!')}`, 'excited'); setTimeout(() => setStep('problem'), 800); };
  const handleProblemSelect = (p: typeof STORY_PROBLEMS[0]) => { setSelectedProblem(p); pip.sayCustom(t('auto.storybuilder.ready_read', "Ready? Let's read our story!"), 'celebrating'); setTimeout(() => setStep('story'), 800); };

  const handleNextPanel = () => {
    if (currentPanel < STORY_PANEL_TEMPLATES.length - 1) setCurrentPanel(p => p + 1);
    else { setStep('quiz'); pip.sayCustom(t('auto.storybuilder.did_follow', 'Did you follow the story? Let me ask you something!'), 'curious'); }
  };

  const handleQuizAnswer = async (index: number) => {
    setQuizAnswer(index);
    const correct = comprehensionOptions[index] === selectedChar?.name;
    if (correct) { pip.celebrate(); await trackCorrect('story-builder', {}); await recordStoryBuilt(selectedChar?.id ?? '', selectedPlace?.id ?? '', selectedProblem?.id ?? '', true); }
    else { pip.reactToMistake(); await trackWrong('story-builder', {}); }
  };

  const handleBuildNew = () => { setStep('character'); setSelectedChar(null); setSelectedPlace(null); setSelectedProblem(null); setCurrentPanel(0); setQuizAnswer(null); pip.sayCustom(t('auto.storybuilder.build_new_story', "Let's build a new story!"), 'excited'); };

  const SelectionGrid = ({ items, onSelect, title }: { items: { id: string; name: string; emoji: string }[]; onSelect: (item: typeof items[0]) => void; title: string }) => (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 flex flex-col p-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 mb-6">
        <div className="flex items-center gap-3"><span className="text-3xl">{t('early.modules.StoryBuilder.spn_', '🐤')}</span><p className="text-lg font-bold text-gray-700">{title}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {items.map((item) => (
          <motion.button key={item.id} whileTap={{ scale: 0.95 }} onClick={() => onSelect(item)}
            className="bg-white rounded-3xl p-6 shadow-sm border-2 border-purple-100 flex flex-col items-center gap-3 min-h-[140px] hover:border-purple-400 transition-all">
            <span className="text-6xl">{item.emoji}</span>
            <span className="text-lg font-bold text-gray-700">{item.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <EarlyShell module="story-builder">
      <AnimatePresence mode="wait">
        {step === 'character' && <motion.div key="char" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}><SelectionGrid items={STORY_CHARACTERS} onSelect={handleCharSelect} title={t('auto.storybuilder.who_is_the_hero_of_our_story', 'Who is the hero of our story?')} /></motion.div>}
        {step === 'place' && <motion.div key="place" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}><SelectionGrid items={STORY_PLACES} onSelect={handlePlaceSelect} title={`${t('auto.storybuilder.where_live', 'Where does')} ${selectedChar?.name} ${t('auto.storybuilder.live_q', 'live?')}`} /></motion.div>}
        {step === 'problem' && <motion.div key="prob" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}><SelectionGrid items={STORY_PROBLEMS} onSelect={handleProblemSelect} title={`${t('auto.storybuilder.what_happened', 'What happened to')} ${selectedChar?.name}?`} /></motion.div>}

        {step === 'story' && (
          <motion.div key={`panel-${currentPanel}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 flex flex-col p-6">
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6"><ProgressDots total={STORY_PANEL_TEMPLATES.length} current={currentPanel} color="#7C3AED" /></div>
              <motion.div key={currentPanel} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 mb-8">
                <div className="text-7xl text-center mb-4">{STORY_PANEL_TEMPLATES[currentPanel].emoji}</div>
                <p className="text-2xl font-bold text-gray-800 text-center leading-relaxed">{generatePanelText(currentPanel)}</p>
              </motion.div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleNextPanel}
                className="w-full py-5 bg-purple-600 text-white font-extrabold text-2xl rounded-2xl shadow-lg min-h-[64px]">
                {currentPanel < STORY_PANEL_TEMPLATES.length - 1 ? t('auto.storybuilder.next', 'Next →') : t('auto.storybuilder.finish_story', 'Finish Story! 🎉')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 flex flex-col p-6 justify-center">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 mb-6">
              <div className="text-4xl text-center mb-3">🐤</div>
              <p className="text-xl font-bold text-gray-800 text-center">{t('early.modules.StoryBuilder.txt_Whowasthem', 'Who was the main character in the story?')}</p>
            </div>
            <div className="space-y-3">
              {comprehensionOptions.map((opt, i) => {
                const isCorrect = opt === selectedChar?.name;
                const isSelected = quizAnswer === i;
                const done = quizAnswer !== null;
                return (
                  <motion.button key={opt} whileTap={{ scale: 0.98 }} onClick={() => quizAnswer === null && handleQuizAnswer(i)}
                    className={`w-full py-5 px-6 rounded-2xl font-bold text-xl text-left min-h-[64px] transition-all ${
                      !done ? 'bg-white border-2 border-gray-200 text-gray-700' : isCorrect ? 'bg-green-100 border-2 border-green-400 text-green-700' : isSelected ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-white border-2 border-gray-100 text-gray-500'
                    }`}>{opt} {done && isCorrect && '✓'}</motion.button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} onClick={handleBuildNew}
                className="w-full py-4 bg-purple-600 text-white font-bold text-xl rounded-2xl mt-6 min-h-[56px]"><Trans i18nKey="auto.storybuilder.build_a_new_story">🐤 Build a New Story!</Trans></motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </EarlyShell>
  );
}
