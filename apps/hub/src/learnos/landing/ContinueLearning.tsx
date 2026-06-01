import { useNavigate } from 'react-router-dom';
import { useLearnerStore } from '../store';
import { useTranslation } from 'react-i18next';
import { AGE_GROUPS } from '../constants/ageGroups';

const MODULE_META: Record<string, { title: string; emoji: string }> = {
  'states-of-matter': { title: 'States of Matter', emoji: '🧊' },
  'gravity': { title: 'Gravity & Orbits', emoji: '🌍' },
  'water-cycle': { title: 'Water Cycle', emoji: '💧' },
  'photosynthesis': { title: 'Photosynthesis', emoji: '🌿' },
  'digestive-system': { title: 'Digestive System', emoji: '🫁' },
  'solar-system': { title: 'Solar System', emoji: '🌌' },
  'blood-circulation': { title: 'Blood Circulation', emoji: '🫀' },
  'cell-explorer': { title: 'Cell Explorer', emoji: '🔬' },
  'newtons-laws': { title: "Newton's Laws", emoji: '🍎' },
  'magnets': { title: 'Magnets', emoji: '🧲' },
  'electricity': { title: 'Electricity', emoji: '⚡' },
  'light-shadows': { title: 'Light & Shadows', emoji: '🔦' },
  'sound-waves': { title: 'Sound Waves', emoji: '🔊' },
  'float-sink': { title: 'Float or Sink', emoji: '🚢' },
  'plant-growth': { title: 'Plant Growth', emoji: '🌱' },
  'day-night': { title: 'Day & Night', emoji: '🌅' },
  'moon-phases': { title: 'Moon Phases', emoji: '🌙' },
  'atoms': { title: 'Atoms', emoji: '⚛️' },
  'simple-machines': { title: 'Simple Machines', emoji: '⚙️' },
  'shapes': { title: 'Shapes', emoji: '🔷' },
  'number-line': { title: 'Number Line', emoji: '📏' },
  'fractions': { title: 'Fractions', emoji: '🍕' },
  'multiplication': { title: 'Multiplication', emoji: '✖️' },
  'pi': { title: 'Visualizing Pi', emoji: '🥧' },
  'pythagorean': { title: 'Pythagorean Theorem', emoji: '📐' },
  'senses': { title: 'Five Senses', emoji: '👁️' },
  'habitats': { title: 'Habitats', emoji: '🦁' },
  'food-chain': { title: 'Food Chain', emoji: '🔗' },
  'panchabhutas': { title: 'Panchabhutas', emoji: '🕉️' },
};

export default function ContinueLearning() {
  const navigate = useNavigate();
  const { getLastModule } = useLearnerStore();
  const { t } = useTranslation();

  const lastModule = getLastModule();
  if (!lastModule) return null;

  const meta = MODULE_META[lastModule.moduleId] ?? { title: lastModule.moduleId, emoji: '📚' };
  const world = AGE_GROUPS[lastModule.world];

  const handleContinue = () => {
    navigate(`/${lastModule.world}/${lastModule.path}`);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-6" aria-label={t('landing.continue.title')}>
      <button
        onClick={handleContinue}
        aria-label={`${t('landing.continue.resume')} ${meta.title}`}
        className="group w-full flex items-center gap-5 rounded-3xl bg-gradient-to-r from-brand to-orange-500 p-5 text-white shadow-lg shadow-orange-300/40 transition hover:shadow-xl hover:shadow-orange-400/50 active:scale-[0.99]"
      >
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur transition group-hover:scale-110">
          {meta.emoji}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-100">{t('landing.continue.title')}</p>
          <h3 className="text-xl font-bold">{meta.title}</h3>
          <p className="text-sm text-orange-100">{world.label} • {world.ageRange}</p>
        </div>
        <span className="text-2xl transition group-hover:translate-x-1">→</span>
      </button>
    </section>
  );
}
