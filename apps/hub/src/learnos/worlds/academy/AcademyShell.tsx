// src/worlds/academy/AcademyShell.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { useTranslation, Trans } from 'react-i18next';
import ModuleTutorialOverlay from '../../shared/ModuleTutorialOverlay';
import { useTutorialStore } from '../../store/tutorialStore';
import { LumoAncientGlow } from './components/LumoAncientGlow';
import { ExamBridge } from './components/ExamBridge';
import { useAcademySession } from './hooks/useAcademySession';
import { useLumoAncient } from './hooks/useLumoAncient';
import { useAcademyProgress } from './hooks/useAcademyProgress';
import { ACADEMY_MODULES, BEAUTY_MOMENTS } from './data/academyContent';
import type { AcademyModule } from './types/academy.types';

interface Props { module: AcademyModule; children: ReactNode; }

export default function AcademyShell({ module, children }: Props) {
  const navigate = useNavigate();
  const { trackEvent } = useAcademySession();
  const lumo = useLumoAncient();
  const { recordExamAttempt } = useAcademyProgress();
  const [examMode, setExamMode] = useState(false);
  const [showBeauty, setShowBeauty] = useState(false);
  const trackedRef = useRef(false);
  const mod = ACADEMY_MODULES.find(m => m.id === module);
  const { t } = useTranslation();
  const { hasCompletedTutorial, markTutorialCompleted } = useTutorialStore();
  const [showTutorial, setShowTutorial] = useState(() => !hasCompletedTutorial(module));

  useEffect(() => { if (trackedRef.current) return; trackedRef.current = true; trackEvent(module, 'module_opened'); return () => { trackEvent(module, 'module_closed'); }; }, [module, trackEvent]);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <button onClick={() => navigate('/academy')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors min-h-[44px]"><Trans i18nKey="auto.academyshell.academy">← Academy</Trans></button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTutorial(true)} className="text-slate-600 hover:text-slate-400 text-sm font-bold min-h-[36px] px-2 transition-colors"><Trans i18nKey="auto.academyshell.help">💡 Help</Trans></button>
          <button onClick={() => setShowBeauty(!showBeauty)} className="text-slate-600 hover:text-yellow-500 text-sm transition-colors" title={t('auto.attr.academyshell.the_beauty')}>✦</button>
          <button onClick={() => setExamMode(!examMode)} className={`px-3 py-1.5 rounded-lg text-sm font-bold min-h-[36px] transition-all ${examMode ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-700' : 'text-slate-600 hover:text-slate-400'}`}>{examMode ? '📝 Exam' : '🔬 Explore'}</button>
        </div>
      </div>

      <AnimatePresence>{showBeauty && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/95 flex items-center justify-center p-8" onClick={() => setShowBeauty(false)}>
          <div className="max-w-sm text-center"><div className="text-4xl mb-4">✦</div><p className="text-white text-lg leading-relaxed font-medium italic">"{BEAUTY_MOMENTS[module]}"</p><p className="text-slate-600 text-sm mt-4"><Trans i18nKey="auto.academyshell.tap_to_return">Tap to return</Trans></p></div>
        </motion.div>
      )}</AnimatePresence>

      {examMode && mod ? (
        <div className="flex-1 p-5"><div className="mb-4"><p className="text-slate-300 font-bold text-sm">{mod.title}</p><p className="text-slate-500 text-sm mt-0.5">{mod.examRelevance}</p></div>
          <ExamBridge questions={mod.examQuestions} onComplete={async (c, t) => { await recordExamAttempt(c, t, mod.examQuestions[0]?.board ?? 'CBSE'); }} />
        </div>
      ) : <main className="flex-1 overflow-hidden">{children}</main>}

      <LumoAncientGlow visible={lumo.peacockVisible} message={lumo.peacockMessage} name={lumo.peacockName} emotion={lumo.peacockEmotion} onDismiss={lumo.dismiss} />
      <ParentCorner onExit={() => navigate('/academy')} />
      
      {showTutorial && (
        <ModuleTutorialOverlay
          moduleId={module}
          moduleTitle={mod?.title || ''}
          onComplete={() => {
            markTutorialCompleted(module);
            setShowTutorial(false);
          }}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}

