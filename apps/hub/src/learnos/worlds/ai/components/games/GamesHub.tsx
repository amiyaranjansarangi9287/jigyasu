import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import MatchingGame from './MatchingGame';
import WordScramble from './WordScramble';
import SpeedRound from './SpeedRound';

interface GamesHubProps {
  onBack: () => void;
}

type ActiveGame = null | 'matching' | 'scramble' | 'speed';

const games = [
  {
    id: 'matching' as const,
    title: 'Match the Pairs',
    titleKey: 'auto.gameshub.match_the_pairs',
    emoji: '🧩',
    description: 'Match AI terms with their definitions!',
    descKey: 'auto.gameshub.match_description',
    color: 'from-purple-400 to-pink-500',
    difficulty: 'Easy',
    diffKey: 'auto.gameshub.easy',
    time: '2-3 min',
    timeKey: 'auto.gameshub.time_2_3',
  },
  {
    id: 'scramble' as const,
    title: 'Word Scramble',
    titleKey: 'auto.gameshub.word_scramble',
    emoji: '🔤',
    description: 'Unscramble AI vocabulary words!',
    descKey: 'auto.gameshub.scramble_description',
    color: 'from-orange-400 to-yellow-500',
    difficulty: 'Medium',
    diffKey: 'auto.gameshub.medium',
    time: '3-5 min',
    timeKey: 'auto.gameshub.time_3_5',
  },
  {
    id: 'speed' as const,
    title: 'Speed Round',
    titleKey: 'auto.gameshub.speed_round',
    emoji: '⚡',
    description: 'True or False — race the clock!',
    descKey: 'auto.gameshub.speed_description',
    color: 'from-red-400 to-orange-500',
    difficulty: 'Fast!',
    diffKey: 'auto.gameshub.fast',
    time: '60 sec',
    timeKey: 'auto.gameshub.time_60',
  },
];

export default function GamesHub({ onBack }: GamesHubProps) {
  const { t } = useTranslation();
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  if (activeGame === 'matching') return <MatchingGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'scramble') return <WordScramble onBack={() => setActiveGame(null)} />;
  if (activeGame === 'speed') return <SpeedRound onBack={() => setActiveGame(null)} />;

  return (<div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('auto.gameshub.mini_games', '🎮 Mini-Games')}</h1>
            <p className="text-gray-600">{t('auto.gameshub.test_your_ai_knowledge', 'Test your AI knowledge in fun ways!')}</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all">{t('auto.gameshub.back', '← Back')}</button>
        </div>

        {/* Game Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 text-left transition-all hover:-translate-y-1 border-2 border-transparent hover:border-purple-200 overflow-hidden relative"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity", game.color)} />
              
              <div className="relative z-10">
                <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">{game.emoji}</span>
                <h2 className="text-lg font-bold text-gray-800 mb-1">{t(game.titleKey, game.title)}</h2>
                <p className="text-gray-600 text-sm mb-3">{t(game.descKey, game.description)}</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{t(game.diffKey, game.difficulty)}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">⏱ {t(game.timeKey, game.time)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3">{t('auto.gameshub.tips', '💡 Tips')}</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex gap-2">
              <span>🧩</span>
              <p>{t('auto.learning.s801_match_games_shuffle_each_time_play_again', 'Match games shuffle each time — play again for new pairs!')}</p>
            </div>
            <div className="flex gap-2">
              <span>🔤</span>
              <p>{t('auto.worlds_ai_components_games_GamesHub.scramble_gives_you_hints___use', "Scramble gives you hints — use them if you're stuck!")}</p>
            </div>
            <div className="flex gap-2">
              <span>⚡</span>
              <p>{t('auto.learning.s802_speed_round_has_streak_bonuses_keep_answ', 'Speed Round has streak bonuses — keep answering correctly!')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
