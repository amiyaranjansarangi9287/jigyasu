export type GameId = 
  | 'chess' 
  | 'sliding-puzzle' 
  | 'memory-match' 
  | 'sudoku' 
  | 'tic-tac-toe' 
  | 'snake'
  | 'jigsaw-puzzle'
  | '2048'
  | 'word-search'
  | 'minesweeper'
  | 'connect-four'
  | 'simon-says'
  | 'hangman'
  | 'whack-a-mole'
  | 'dino-run'
  | 'tetris'
  | 'reaction-test'
  | 'balloon-pop'
  | 'breakout'
  | 'pong';

export interface GameInfo {
  id: GameId;
  name: string;
  emoji: string;
  description: string;
  category: 'strategy' | 'puzzle' | 'classic' | 'word' | 'arcade' | 'action';
  difficulty: string;
  players: string;
}

export const GAMES: GameInfo[] = [
  // Action/Arcade Games (NEW!)
  {
    id: 'whack-a-mole',
    name: 'Whack-a-Mole',
    emoji: '🔨',
    description: 'Whack the moles as they pop up! Watch out for bombs and catch golden stars!',
    category: 'arcade',
    difficulty: 'Easy - Insane',
    players: '1 Player',
  },
  {
    id: 'dino-run',
    name: 'Dino Run',
    emoji: '🦖',
    description: 'The classic Chrome dinosaur game! Jump over cacti and duck under birds!',
    category: 'action',
    difficulty: 'Medium - Hard',
    players: '1 Player',
  },
  {
    id: 'tetris',
    name: 'Tetris',
    emoji: '🧱',
    description: 'The legendary falling blocks puzzle! Clear lines and rack up points!',
    category: 'arcade',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },
  {
    id: 'breakout',
    name: 'Breakout',
    emoji: '💥',
    description: 'Classic brick-breaking action! Bounce the ball and destroy all bricks!',
    category: 'arcade',
    difficulty: 'Medium',
    players: '1 Player',
  },
  {
    id: 'pong',
    name: 'Pong',
    emoji: '🏓',
    description: 'The original video game! Play against AI or challenge a friend!',
    category: 'arcade',
    difficulty: 'Easy - Hard',
    players: '1-2 Players',
  },
  {
    id: 'balloon-pop',
    name: 'Balloon Pop',
    emoji: '🎈',
    description: 'Pop colorful balloons before they float away! Great for all ages!',
    category: 'action',
    difficulty: 'Easy - Medium',
    players: '1 Player',
  },
  {
    id: 'reaction-test',
    name: 'Reaction Test',
    emoji: '⚡',
    description: 'Test your reflexes! How fast can you click when the screen turns green?',
    category: 'action',
    difficulty: 'Easy',
    players: '1 Player',
  },

  // Strategy Games
  {
    id: 'chess',
    name: 'Chess',
    emoji: '♟️',
    description: 'The classic strategy game with AI opponent! Multiple difficulty levels.',
    category: 'strategy',
    difficulty: 'Easy - Hard',
    players: '1-2 Players',
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    emoji: '🔴',
    description: 'Drop discs to connect 4 in a row! Play against AI or a friend.',
    category: 'strategy',
    difficulty: 'Easy - Medium',
    players: '1-2 Players',
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    emoji: '❌',
    description: 'The timeless game of Xs and Os. Play against a friend or challenge the AI!',
    category: 'strategy',
    difficulty: 'Easy',
    players: '1-2 Players',
  },

  // Puzzle Games
  {
    id: 'jigsaw-puzzle',
    name: 'Jigsaw Puzzle',
    emoji: '🖼️',
    description: 'Beautiful photo puzzles with animals, birds, nature & more! 20-100 pieces.',
    category: 'puzzle',
    difficulty: 'Easy - Master',
    players: '1 Player',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    emoji: '🧠',
    description: 'Flip cards and find matching pairs. Multiple themes and game modes!',
    category: 'puzzle',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },
  {
    id: 'sliding-puzzle',
    name: 'Sliding Puzzle',
    emoji: '🧩',
    description: 'Slide numbered tiles to arrange them in order. A classic brain teaser!',
    category: 'puzzle',
    difficulty: 'Medium - Hard',
    players: '1 Player',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    emoji: '🔢',
    description: 'Fill the 9×9 grid with pencil marks, undo/redo, and hints!',
    category: 'puzzle',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },
  {
    id: '2048',
    name: '2048',
    emoji: '🎯',
    description: 'Slide tiles to combine numbers! Multiple board sizes and undo feature!',
    category: 'puzzle',
    difficulty: 'Medium - Hard',
    players: '1 Player',
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    emoji: '💣',
    description: 'Clear the minefield without detonating any bombs. A classic logic puzzle!',
    category: 'puzzle',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },

  // Word Games
  {
    id: 'word-search',
    name: 'Word Search',
    emoji: '🔤',
    description: 'Find hidden words in a grid of letters. Multiple categories and difficulties!',
    category: 'word',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },
  {
    id: 'hangman',
    name: 'Hangman',
    emoji: '🎭',
    description: 'Guess the word letter by letter before the hangman is complete!',
    category: 'word',
    difficulty: 'Easy - Medium',
    players: '1 Player',
  },

  // Classic Games
  {
    id: 'snake',
    name: 'Snake',
    emoji: '🐍',
    description: 'Multiple skins, game modes, and speeds! Classic snake reimagined!',
    category: 'classic',
    difficulty: 'Easy - Insane',
    players: '1 Player',
  },
  {
    id: 'simon-says',
    name: 'Simon Says',
    emoji: '🎹',
    description: 'Watch the pattern and repeat! Now with sound and multiple game modes!',
    category: 'classic',
    difficulty: 'Easy - Hard',
    players: '1 Player',
  },
];
