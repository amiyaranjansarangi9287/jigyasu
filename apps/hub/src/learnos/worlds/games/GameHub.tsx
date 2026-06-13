import { useTranslation } from 'react-i18next';
import { useState, lazy, Suspense } from 'react';
import Dashboard from './components/Dashboard';
import { GameId, GAMES } from './types';

// Lazy load all games
const Chess = lazy(() => import('./games/Chess'));
const MemoryMatch = lazy(() => import('./games/MemoryMatch'));
const SlidingPuzzle = lazy(() => import('./games/SlidingPuzzle'));
const Sudoku = lazy(() => import('./games/Sudoku'));
const TicTacToe = lazy(() => import('./games/TicTacToe'));
const SnakeGame = lazy(() => import('./games/Snake'));
const JigsawPuzzle = lazy(() => import('./games/JigsawPuzzle'));
const Game2048 = lazy(() => import('./games/Game2048'));
const WordSearch = lazy(() => import('./games/WordSearch'));
const Minesweeper = lazy(() => import('./games/Minesweeper'));
const ConnectFour = lazy(() => import('./games/ConnectFour'));
const SimonSays = lazy(() => import('./games/SimonSays'));
const Hangman = lazy(() => import('./games/Hangman'));
const WhackAMole = lazy(() => import('./games/WhackAMole'));
const DinoRun = lazy(() => import('./games/DinoRun'));
const Tetris = lazy(() => import('./games/Tetris'));
const ReactionTest = lazy(() => import('./games/ReactionTest'));
const BalloonPop = lazy(() => import('./games/BalloonPop'));
const Breakout = lazy(() => import('./games/Breakout'));
const Pong = lazy(() => import('./games/Pong'));

function GameLoader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 font-medium">{t('auto.learning.s052_loading_game', 'Loading game...')}</span>
      </div>
    </div>
  );
}

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameId | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const game = currentGame ? GAMES.find(g => g.id === currentGame) : null;

  const renderGame = () => {
    const props = { darkMode };
    switch (currentGame) {
      case 'chess': return <Chess {...props} />;
      case 'memory-match': return <MemoryMatch {...props} />;
      case 'sliding-puzzle': return <SlidingPuzzle {...props} />;
      case 'sudoku': return <Sudoku {...props} />;
      case 'tic-tac-toe': return <TicTacToe {...props} />;
      case 'snake': return <SnakeGame {...props} />;
      case 'jigsaw-puzzle': return <JigsawPuzzle {...props} />;
      case '2048': return <Game2048 {...props} />;
      case 'word-search': return <WordSearch {...props} />;
      case 'minesweeper': return <Minesweeper {...props} />;
      case 'connect-four': return <ConnectFour {...props} />;
      case 'simon-says': return <SimonSays {...props} />;
      case 'hangman': return <Hangman {...props} />;
      case 'whack-a-mole': return <WhackAMole {...props} />;
      case 'dino-run': return <DinoRun {...props} />;
      case 'tetris': return <Tetris {...props} />;
      case 'reaction-test': return <ReactionTest {...props} />;
      case 'balloon-pop': return <BalloonPop {...props} />;
      case 'breakout': return <Breakout {...props} />;
      case 'pong': return <Pong {...props} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
        darkMode
          ? 'bg-gray-900/80 border-gray-800'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentGame(null)}
            className={`flex items-center gap-2 font-extrabold text-xl transition-colors ${
              darkMode ? 'text-white hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'
            }`}
          >🎮 GameHub</button>

          <div className="flex items-center gap-3">
            {currentGame && (
              <button
                onClick={() => setCurrentGame(null)}
                className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >← All Games</button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg text-xl transition-all ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {!currentGame ? (
        <Dashboard onSelectGame={setCurrentGame} darkMode={darkMode} />) : (<div className="max-w-6xl mx-auto px-4 py-8">
          {/* Game Header */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-2 inline-block">{game?.emoji}</span>
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {game?.name}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {game?.description}
            </p>
          </div>

          {/* Game Content */}
          <Suspense fallback={<GameLoader />}>
            {renderGame()}
          </Suspense>
        </div>
      )}

      {/* Footer */}
      <footer className={`text-center py-6 mt-12 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>🎮 GameHub — {GAMES.length} games to play!</p>
      </footer>
    </div>
  );
}
