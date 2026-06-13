import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NavigationCards() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full h-full relative">
      <button
        type="button"
        className="card-wonder flex-1 relative group cursor-pointer border-0 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden text-center"
        onClick={() => navigate('/home')}
        aria-label="Open Learning Paths"
      >
        <span className="absolute inset-0 bg-sky-50 transition-colors duration-500 group-hover:bg-sky-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 min-h-24 bg-sky-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-sky-500/30 transform group-hover:scale-110 transition-transform duration-500"
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
        className="card-wonder flex-1 relative group cursor-pointer border-0 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden text-center"
        onClick={() => navigate('/heritage')}
        aria-label="Open HeritageWorld"
      >
        <span className="absolute inset-0 bg-amber-50 transition-colors duration-500 group-hover:bg-amber-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 min-h-24 bg-amber-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-amber-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F4FF}'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('heritage_world', 'HeritageWorld')}
          </h2>
          <span className="text-lg text-slate-600 mb-8 max-w-sm font-medium">
            {t('heritage_world_desc', 'Stories of wisdom, courage, and love from Indian traditions — the Gita, Ramayana, Saints, and Odisha folklore.')}
          </span>

          <span className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg shadow-amber-500/30 group-hover:bg-amber-600 transition-colors mb-12">
            {t('go_to_heritage_world', 'Explore HeritageWorld \u2192')}
          </span>

          <span className="w-full max-w-md text-left opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="block text-sm font-bold text-amber-600 uppercase tracking-widest mb-4 border-b border-amber-200 pb-2">
              {t('what_youll_read', "What you'll read:")}
            </span>
            <span className="space-y-4 block">
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F4D6}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('gita_stories', 'Tales of the Gita')}</strong>
                  <span className="text-sm text-slate-600">{t('gita_stories_desc', 'Illustrated stories teaching the wisdom of the Bhagavad Gita.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F3F9}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('ramayana_stories', 'Ramayana Stories')}</strong>
                  <span className="text-sm text-slate-600">{t('ramayana_stories_desc', 'Moral values through the epic journey of Lord Rama.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F64F}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('indian_saints', 'Indian Saints')}</strong>
                  <span className="text-sm text-slate-600">{t('indian_saints_desc', 'Stories of wisdom and courage from India\'s greatest saints.')}</span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        className="card-wonder flex-1 relative group cursor-pointer border-0 overflow-hidden text-center"
        onClick={() => navigate('/execute')}
        aria-label="Open Kids Camp"
      >
        <span className="absolute inset-0 bg-orange-50 transition-colors duration-500 group-hover:bg-orange-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 min-h-24 bg-orange-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F6E0}\uFE0F'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('nav_maker_space', 'Maker Space')}
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

      <button
        type="button"
        className="card-wonder flex-1 relative group cursor-pointer border-0 overflow-hidden text-center"
        onClick={() => navigate('/ai')}
        aria-label="Open AI World"
      >
        <span className="absolute inset-0 bg-violet-50 transition-colors duration-500 group-hover:bg-violet-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 min-h-24 bg-violet-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-violet-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F916}'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('ai_world', 'AI Explorers')}
          </h2>
          <span className="text-lg text-slate-600 mb-8 max-w-sm font-medium">
            {t('ai_world_desc', 'Discover how AI works through interactive stories, games, and challenges. Learn about neural networks, LLMs, computer vision, and more!')}
          </span>

          <span className="bg-violet-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg shadow-violet-500/30 group-hover:bg-violet-600 transition-colors mb-8">
            {t('go_to_ai_world', 'Explore AI World \u2192')}
          </span>

          <span className="w-full max-w-sm text-left opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="block text-sm font-bold text-violet-600 uppercase tracking-widest mb-3 border-b border-violet-200 pb-2">
              {t('what_youll_learn', "What you'll learn:")}
            </span>
            <span className="space-y-4 block">
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F9E0}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('neural_networks', 'Neural Networks')}</strong>
                  <span className="text-sm text-slate-600">{t('neural_networks_desc', 'How AI brains learn like yours.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F4AC}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('llm_world', 'Language Models')}</strong>
                  <span className="text-sm text-slate-600">{t('llm_world_desc', 'How ChatGPT and friends understand text.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F3AE}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('ai_games', 'AI Games')}</strong>
                  <span className="text-sm text-slate-600">{t('ai_games_desc', 'Play matching games, word scrambles, and speed rounds.')}</span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        className="card-wonder flex-1 relative group cursor-pointer border-0 overflow-hidden text-center"
        onClick={() => navigate('/games')}
        aria-label="Open Game Hub"
      >
        <span className="absolute inset-0 bg-pink-50 transition-colors duration-500 group-hover:bg-pink-100 z-0" />
        <span className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 mix-blend-overlay" />

        <span className="relative z-10 flex flex-col items-center justify-center h-full p-12 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span
            className="w-24 min-h-24 bg-pink-500 text-white rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl shadow-pink-500/30 transform group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {'\u{1F3AE}'}
          </span>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            {t('game_hub', 'Game Hub')}
          </h2>
          <span className="text-lg text-slate-600 mb-8 max-w-sm font-medium">
            {t('game_hub_desc', '20+ fun and brain-training games! Chess, Snake, Tetris, Sudoku, Memory Match, and more — for kids and families.')}
          </span>

          <span className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg shadow-pink-500/30 group-hover:bg-pink-600 transition-colors mb-8">
            {t('go_to_game_hub', 'Play Games \u2192')}
          </span>

          <span className="w-full max-w-sm text-left opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="block text-sm font-bold text-pink-600 uppercase tracking-widest mb-3 border-b border-pink-200 pb-2">
              {t('what_youll_play', "What you'll play:")}
            </span>
            <span className="space-y-4 block">
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u265F\uFE0F'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('strategy_games', 'Strategy')}</strong>
                  <span className="text-sm text-slate-600">{t('strategy_games_desc', 'Chess, Connect Four, and Tic-Tac-Toe.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F9E9}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('puzzle_games', 'Puzzles')}</strong>
                  <span className="text-sm text-slate-600">{t('puzzle_games_desc', 'Sudoku, 2048, Jigsaw, Memory Match.')}</span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {'\u{1F3B2}'}
                </span>
                <span>
                  <strong className="block text-slate-800">{t('arcade_games', 'Arcade')}</strong>
                  <span className="text-sm text-slate-600">{t('arcade_games_desc', 'Snake, Tetris, Pong, Breakout, Dino Run.')}</span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
