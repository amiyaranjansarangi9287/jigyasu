// src/crosscutting/TimeCapsule.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '../store';
import { LearningService } from '../services';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button } from '@jigyasu/ui';

interface CapsuleEntry {
  id: string;
  conceptId: string;
  conceptTitle: string;
  content: string;
  sealedAt: number;
  opensAt: number;
  opened: boolean;
}

const CAPSULE_DURATIONS_DEFAULT = [
  { days: 7, label: '1 week' },
  { days: 30, label: '1 month' },
  { days: 90, label: '3 months' },
  { days: 180, label: '6 months' },
  { days: 365, label: '1 year' },
];

const CONCEPTS_DEFAULT = [
  'Gravity', 'Photosynthesis', 'Fractions', 'Magnetism', 'Water Cycle',
  'States of Matter', 'Electricity', 'Evolution', 'Probability', 'DNA',
];

const STORAGE_KEY = 'learnos-time-capsules';

const privateInfoRegex = /\b(?:\d{10}|\S+@\S+\.\S+|address|phone|school name)\b/i;

const getPrivacyWarning = (value: string) => {
  if (privateInfoRegex.test(value)) {
    return 'Please remove private information before sealing your capsule.';
  }
  return '';
};

function loadCapsules(): CapsuleEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCapsules(capsules: CapsuleEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
}

type CapsuleState = 'list' | 'create' | 'sealed' | 'open';

export default function TimeCapsule() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [state, setState] = useState<CapsuleState>('list');
  const [capsules, setCapsules] = useState<CapsuleEntry[]>(loadCapsules);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [content, setContent] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [newCapsule, setNewCapsule] = useState<CapsuleEntry | null>(null);
  const [openingCapsule, setOpeningCapsule] = useState<CapsuleEntry | null>(null);
  const [privacyWarning, setPrivacyWarning] = useState('');
  const [now, setNow] = useState(Date.now);

  const CONCEPTS = t('crosscutting.data.time_capsule_data.concepts', { returnObjects: true, defaultValue: CONCEPTS_DEFAULT }) as string[];
  const CAPSULE_DURATIONS = t('crosscutting.data.time_capsule_data.durations', { returnObjects: true, defaultValue: CAPSULE_DURATIONS_DEFAULT }) as {days: number, label: string}[];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const readyCapsules = capsules.filter(
    (c) => now >= c.opensAt && !c.opened
  );

  const futureCapsules = capsules.filter(
    (c) => now < c.opensAt
  );

  const handleCreate = async () => {
    if (!selectedConcept || !content.trim()) return;
    const warning = getPrivacyWarning(content);
    setPrivacyWarning(warning);
    if (warning) return;

    const sealedAt = Date.now();
    const capsule: CapsuleEntry = {
      id: `capsule-${sealedAt}`,
      conceptId: selectedConcept.toLowerCase().replace(' ', '-'),
      conceptTitle: selectedConcept,
      content: content.trim(),
      sealedAt,
      opensAt: sealedAt + selectedDuration * 86400000,
      opened: false,
    };

    const updated = [...capsules, capsule];
    setCapsules(updated);
    saveCapsules(updated);
    setNewCapsule(capsule);
    setState('sealed');

    await LearningService.trackEvent(
      'time-capsule-session',
      'crosscutting',
      language,
      'time_capsule_created',
      capsule.id,
      { conceptId: capsule.conceptId, duration: selectedDuration }
    );
  };

  const handleOpen = (capsule: CapsuleEntry) => {
    const updated = capsules.map((c) =>
      c.id === capsule.id ? { ...c, opened: true } : c
    );
    setCapsules(updated);
    saveCapsules(updated);
    setOpeningCapsule({ ...capsule, opened: true });
    setState('open');
  };

  const formatOpensAt = (opensAt: number) => {
    const diff = opensAt - now;
    if (diff <= 0) return 'Ready now!';
    const days = Math.ceil(diff / 86400000);
    if (days === 1) return 'Tomorrow';
    if (days < 30) return `${days} days`;
    return `${Math.ceil(days / 30)} month${Math.ceil(days / 30) > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 relative">
      <ParentCorner />

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(ROUTES.FAMILY_HOME)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            {capsules.length} capsule{capsules.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {state === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⏳</div>
                <h1 className="text-3xl font-bold text-amber-700 mb-2">
                  {t('crosscutting.time_capsule.title')}
                </h1>
                <p className="text-gray-500">
                  {t('crosscutting.time_capsule.subtitle')}
                </p>
              </div>

              {/* Ready to open */}
              {readyCapsules.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-amber-600 mb-3">
                    {t('crosscutting.time_capsule.ready_open')} 🔓
                  </h2>
                  <div className="space-y-3">
                    {readyCapsules.map((capsule) => (
                      <button
                        key={capsule.id}
                        onClick={() => handleOpen(capsule)}
                        className="w-full p-4 bg-green-50 rounded-2xl border-2 border-green-200
                                   hover:border-green-400 transition-all text-left min-h-[72px]"
                      >
                        <p className="font-bold text-gray-800">{capsule.conceptTitle}</p>
                        <p className="text-sm text-gray-400">
                          Sealed {new Date(capsule.sealedAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Future capsules */}
              {futureCapsules.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-600 mb-3">
                    {t('crosscutting.time_capsule.opens_in')} 🔒
                  </h2>
                  <div className="space-y-3">
                    {futureCapsules.map((capsule) => (
                      <div
                        key={capsule.id}
                        className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200 min-h-[72px]"
                      >
                        <p className="font-bold text-gray-800">{capsule.conceptTitle}</p>
                        <p className="text-sm text-amber-500">
                          Opens in {formatOpensAt(capsule.opensAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setState('create')} size="lg" fullWidth>
                {t('crosscutting.time_capsule.create')} ✨
              </Button>
            </motion.div>
          )}

          {state === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setState('list')}
                className="text-gray-400 hover:text-gray-600 mb-4"
              >
                ← Back
              </button>

              <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
                <label htmlFor="concept-select" className="sr-only">
                  {t('crosscutting.time_capsule.what_reflecting')}
                </label>
                <select
                  id="concept-select"
                  value={selectedConcept}
                  onChange={(e) => setSelectedConcept(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 mb-4"
                >
                  <option value="">Select a concept...</option>
                  {CONCEPTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <label htmlFor="capsule-message" className="sr-only">
                  {t('crosscutting.time_capsule.write_now')}
                </label>
                <textarea
                  id="capsule-message"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (privacyWarning) {
                      setPrivacyWarning('');
                    }
                  }}
                  placeholder="What do you know about this concept right now?"
                  maxLength={280}
                  aria-describedby={`capsule-message-hint${privacyWarning ? ' capsule-message-warning' : ''}`}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200
                             focus:border-amber-400 focus:outline-none min-h-[100px]
                             text-gray-800 resize-none mb-1"
                />
                {privacyWarning && (
                  <p id="capsule-message-warning" role="alert" className="mb-2 text-sm font-bold text-red-600">
                    {privacyWarning}
                  </p>
                )}
                <span id="capsule-message-hint" className="block text-sm text-gray-400 mb-4">
                  {content.length}/280 characters
                </span>

                <p className="text-sm text-gray-500 mb-2">
                  {t('crosscutting.time_capsule.seal_for')}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {CAPSULE_DURATIONS.map((d) => (
                    <button
                      key={d.days}
                      onClick={() => setSelectedDuration(d.days)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all min-h-[48px]
                        ${selectedDuration === d.days
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={!selectedConcept || !content.trim()}
                size="lg"
                fullWidth
              >
                {t('crosscutting.time_capsule.seal')} 🔒
              </Button>
            </motion.div>
          )}

          {state === 'sealed' && newCapsule && (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-8xl mb-6"
              >
                🔒
              </motion.div>
              <h2 className="text-2xl font-bold text-amber-700 mb-2">Sealed!</h2>
              <p className="text-gray-500 mb-4">
                Your thoughts on <strong>{newCapsule.conceptTitle}</strong> are safe.
              </p>
              <div className="bg-white rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-400">Opens in</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatOpensAt(newCapsule.opensAt)}
                </p>
              </div>
              <Button onClick={() => setState('list')} size="lg" fullWidth>
                {t('common.back')}
              </Button>
            </motion.div>
          )}

          {state === 'open' && openingCapsule && (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-8xl mb-6"
              >
                📜
              </motion.div>
              <h2 className="text-2xl font-bold text-amber-700 mb-2">
                {t('crosscutting.time_capsule.past_you_wrote')}
              </h2>
              <div className="bg-white rounded-3xl p-6 shadow-sm mb-4 text-left">
                <p className="text-sm text-gray-400 mb-2">
                  About: {openingCapsule.conceptTitle}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Sealed: {new Date(openingCapsule.sealedAt).toLocaleDateString()}
                </p>
                <div className="bg-amber-50 rounded-2xl p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{openingCapsule.content}</p>
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                {t('crosscutting.time_capsule.how_changed')}
              </p>
              <Button onClick={() => setState('list')} size="lg" fullWidth>
                {t('common.back')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
