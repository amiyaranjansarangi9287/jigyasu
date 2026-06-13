import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { GAMES, GameId, GameInfo } from '../types';

const categoryColors: Record<string, string> = {
  strategy: 'from-blue-500 to-indigo-600',
  puzzle: 'from-emerald-500 to-teal-600',
  classic: 'from-amber-500 to-orange-600',
  word: 'from-purple-500 to-pink-600',
  arcade: 'from-red-500 to-rose-600',
  action: 'from-cyan-500 to-blue-600',
};

const categoryBg: Record<string, string> = {
  strategy: 'bg-blue-100 text-blue-700',
  puzzle: 'bg-emerald-100 text-emerald-700',
  classic: 'bg-amber-100 text-amber-700',
  word: 'bg-purple-100 text-purple-700',
  arcade: 'bg-red-100 text-red-700',
  action: 'bg-cyan-100 text-cyan-700',
};

const categoryEmoji: Record<string, string> = {
  all: '🎮',
  arcade: '👾',
  action: '⚡',
  strategy: '🧠',
  puzzle: '🧩',
  classic: '🕹️',
  word: '📝',
};

interface DashboardProps {
  onSelectGame: (id: GameId) => void;
  darkMode: boolean;
}

function GameCard({ game, onSelect, darkMode }: { game: GameInfo; onSelect: () => void; darkMode: boolean }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-left w-full ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-gray-500'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-gray-200/50'
      }`}
    >
      <div className={`h-2 bg-gradient-to-r ${categoryColors[game.category]}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-5xl drop-shadow-sm">{game.emoji}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryBg[game.category]}`}>
            {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
          </span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {game.name}
        </h3>
        <p className={`text-sm mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {game.description}
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            📊 {game.difficulty}
          </span>
          <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            👥 {game.players}
          </span>
        </div>
        <div className={`mt-4 flex items-center gap-2 text-sm font-semibold transition-colors ${
          darkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
        }`}>{t('auto.learning.s513_play_now', 'Play Now')}<svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function Dashboard({ onSelectGame, darkMode }: DashboardProps) {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(GAMES.map(g => g.category)))];
  const filteredGames = filter === 'all' ? GAMES : GAMES.filter(g =>g.category === filter);

  return (<div className="min-h-screen">
      {/* Hero */}
      <div className="text-center py-12 px-4">
        <h1 className={`text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
          darkMode ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'
        }`}>🎮 GameHub</h1>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Fun & educational games for children and adults. Train your brain, challenge your friends, and have a blast!
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === cat
                  ? cat === 'all'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg'
                    : `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg`
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat !== 'all' && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({GAMES.filter(g => g.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Showing {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={() => onSelectGame(game.id)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
