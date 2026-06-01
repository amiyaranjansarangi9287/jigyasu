import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NavigationCards() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full h-full relative">
      <button
        type="button"
        className="flex-1 relative group cursor-pointer border-0 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden text-center"
        onClick={() => navigate('/home')}
        aria-label="Open Learning Paths"
      >
        <span className="absolute inset-0 bg-sky-50 transition-colors duration-500 group-hover:bg-sky-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 h-24 bg-sky-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-sky-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F4DA}'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('learning_paths', 'Learning Paths')}
          </h2>
          <span className="text-lg text-slate-600 mb-8 max-w-sm font-medium">
            {t('learning_paths_desc', 'Dive into structured worlds of knowledge. Master concepts step-by-step through interactive stories and lessons.')}
          </span>

          <span className="bg-sky-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg shadow-sky-500/30 group-hover:bg-sky-600 transition-colors mb-12">
            {t('go_to_learning_paths', 'Go to Learning Paths \u2192')}
          </span>

          <span className="w-full max-w-md text-left opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="block text-sm font-bold text-sky-600 uppercase tracking-widest mb-4 border-b border-sky-200 pb-2">
              {t('what_youll_discover', "What you'll discover:")}
            </span>
            <span className="space-y-4 block">
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F331}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('tiny_world', 'Tiny World (Ages 3-5)')}</strong>
                  <span className="text-sm text-slate-600">{t('tiny_world_desc', 'Alphabet, colors, shapes, and early emotional skills.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u2694\uFE0F'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('adventure_academy', 'Adventure Academy (Ages 6-8)')}</strong>
                  <span className="text-sm text-slate-600">{t('adventure_academy_desc', 'Math quests, basic science, and reading comprehension.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F52C}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('lab_zero', 'Lab Zero (Ages 9-12)')}</strong>
                  <span className="text-sm text-slate-600">{t('lab_zero_desc', 'Physics, advanced math, and coding fundamentals.')}</span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        className="flex-1 relative group cursor-pointer overflow-hidden border-0 text-center"
        onClick={() => navigate('/execute')}
        aria-label="Open Maker Space"
      >
        <span className="absolute inset-0 bg-orange-50 transition-colors duration-500 group-hover:bg-orange-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 h-24 bg-orange-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F6E0}\uFE0F'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('maker_space', 'Maker Space')}
          </h2>
          <span className="text-lg text-slate-600 mb-8 max-w-sm font-medium">
            {t('maker_space_desc', 'Roll up your sleeves! Build, create, and experiment in our hands-on interactive 3D labs and outdoor quests.')}
          </span>

          <span className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 group-hover:bg-orange-600 transition-colors mb-8">
            {t('go_to_maker_space', 'Go to Maker Space \u2192')}
          </span>

          <span className="w-full max-w-sm text-left opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="block text-sm font-bold text-orange-600 uppercase tracking-widest mb-3 border-b border-orange-200 pb-2">
              {t('what_youll_create', "What you'll create:")}
            </span>
            <span className="space-y-4 block">
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F52C}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('interactive_lab', 'Interactive Lab')}</strong>
                  <span className="text-sm text-slate-600">{t('interactive_lab_desc', 'Physics simulations and chemistry experiments.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F3A8}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('art_studio', 'Art Studio')}</strong>
                  <span className="text-sm text-slate-600">{t('art_studio_desc', 'Digital painting and creative projects.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F3DD}\uFE0F'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('outdoor_quest', 'Outdoor Quest')}</strong>
                  <span className="text-sm text-slate-600">{t('outdoor_quest_desc', 'Nature exploration and environmental science.')}</span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
