import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect, useRef } from 'react';

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type Color = 'w' | 'b';
type Piece = { type: PieceType; color: Color } | null;
type Board = Piece[][];
type Mode = 'pvp' | 'ai';
type Difficulty = 'easy' | 'medium' | 'hard';

const PIECE_SYMBOLS: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const PIECE_VALUES: Record<PieceType, number> = {
  P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000,
};

// Position bonus tables for better AI play
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const CENTER_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRank: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRank[c], color: 'b' };
    board[1][c] = { type: 'P', color: 'b' };
    board[6][c] = { type: 'P', color: 'w' };
    board[7][c] = { type: backRank[c], color: 'w' };
  }
  return board;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c< 8;
}

function getBasicMoves(board: Board, r: number, c: number, includeCastling = false, castleRights?: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean }): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const { type, color } = piece;
  const dir = color === 'w' ? -1 : 1;

  const addIfValid = (nr: number, nc: number) => {
    if (!inBounds(nr, nc)) return false;
    const target = board[nr][nc];
    if (target && target.color === color) return false;
    moves.push([nr, nc]);
    return !target;
  };

  const addSliding = (dr: number, dc: number) => {
    for (let i = 1; i < 8; i++) {
      if (!addIfValid(r + dr * i, c + dc * i)) break;
    }
  };

  switch (type) {
    case 'P': {
      const nr = r + dir;
      if (inBounds(nr, c) && !board[nr][c]) {
        moves.push([nr, c]);
        const startRow = color === 'w' ? 6 : 1;
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      for (const dc of [-1, 1]) {
        if (inBounds(nr, c + dc) && board[nr][c + dc] && board[nr][c + dc]!.color !== color) {
          moves.push([nr, c + dc]);
        }
      }
      break;
    }
    case 'N':
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        addIfValid(r + dr, c + dc);
      }
      break;
    case 'B':
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) addSliding(dr, dc);
      break;
    case 'R':
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) addSliding(dr, dc);
      break;
    case 'Q':
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) addSliding(dr, dc);
      break;
    case 'K':
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        addIfValid(r + dr, c + dc);
      }
      // Castling
      if (includeCastling && castleRights) {
        const row = color === 'w' ? 7 : 0;
        if (r === row && c === 4) {
          // Kingside
          if ((color === 'w' ? castleRights.wK : castleRights.bK) &&
              !board[row][5] && !board[row][6] &&
              board[row][7]?.type === 'R' && board[row][7]?.color === color) {
            if (!isSquareAttacked(board, row, 4, color === 'w' ? 'b' : 'w') &&
                !isSquareAttacked(board, row, 5, color === 'w' ? 'b' : 'w') &&
                !isSquareAttacked(board, row, 6, color === 'w' ? 'b' : 'w')) {
              moves.push([row, 6]);
            }
          }
          // Queenside
          if ((color === 'w' ? castleRights.wQ : castleRights.bQ) &&
              !board[row][1] && !board[row][2] && !board[row][3] &&
              board[row][0]?.type === 'R' && board[row][0]?.color === color) {
            if (!isSquareAttacked(board, row, 4, color === 'w' ? 'b' : 'w') &&
                !isSquareAttacked(board, row, 3, color === 'w' ? 'b' : 'w') &&
                !isSquareAttacked(board, row, 2, color === 'w' ? 'b' : 'w')) {
              moves.push([row, 2]);
            }
          }
        }
      }
      break;
  }
  return moves;
}

function cloneBoard(board: Board): Board {
  return board.map(row => row.map(p => p ? { ...p } : null));
}

function findKing(board: Board, color: Color): [number, number] {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.type === 'K' && board[r][c]?.color === color) return [r, c];
  return [-1, -1];
}

function isSquareAttacked(board: Board, r: number, c: number, byColor: Color): boolean {
  for (let sr = 0; sr < 8; sr++)
    for (let sc = 0; sc < 8; sc++)
      if (board[sr][sc]?.color === byColor) {
        const moves = getBasicMoves(board, sr, sc);
        if (moves.some(([mr, mc]) => mr === r && mc === c)) return true;
      }
  return false;
}

function isInCheck(board: Board, color: Color): boolean {
  const [kr, kc] = findKing(board, color);
  return isSquareAttacked(board, kr, kc, color === 'w' ? 'b' : 'w');
}

function getLegalMoves(board: Board, r: number, c: number, castleRights?: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean }): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const basic = getBasicMoves(board, r, c, true, castleRights);
  return basic.filter(([nr, nc]) => {
    const newBoard = cloneBoard(board);
    newBoard[nr][nc] = newBoard[r][c];
    newBoard[r][c] = null;
    return !isInCheck(newBoard, piece.color);
  });
}

function hasAnyLegalMove(board: Board, color: Color, castleRights?: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean }): boolean {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === color && getLegalMoves(board, r, c, castleRights).length > 0)
        return true;
  return false;
}

// AI Evaluation
function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type];
      let posBonus = 0;
      const row = piece.color === 'w' ? r : 7 - r;
      
      switch (piece.type) {
        case 'P': posBonus = PAWN_TABLE[row][c]; break;
        case 'N': posBonus = KNIGHT_TABLE[row][c]; break;
        case 'B': posBonus = BISHOP_TABLE[row][c]; break;
        case 'R': case 'Q': posBonus = CENTER_TABLE[row][c]; break;
      }
      
      const total = value + posBonus;
      score += piece.color === 'w' ? -total : total; // AI is black
    }
  }
  return score;
}

function getAllMoves(board: Board, color: Color): { from: [number, number]; to: [number, number] }[] {
  const moves: { from: [number, number]; to: [number, number] }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) {
        const legalMoves = getLegalMoves(board, r, c);
        for (const [tr, tc] of legalMoves) {
          moves.push({ from: [r, c], to: [tr, tc] });
        }
      }
    }
  }
  return moves;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0) return evaluateBoard(board);

  const color = isMaximizing ? 'b' : 'w';
  const moves = getAllMoves(board, color);
  
  if (moves.length === 0) {
    if (isInCheck(board, color)) {
      return isMaximizing ? -100000 + depth : 100000 - depth;
    }
    return 0; // Stalemate
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = cloneBoard(board);
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
      newBoard[move.from[0]][move.from[1]] = null;
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = cloneBoard(board);
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
      newBoard[move.from[0]][move.from[1]] = null;
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(board: Board, difficulty: Difficulty): { from: [number, number]; to: [number, number] } | null {
  const moves = getAllMoves(board, 'b');
  if (moves.length === 0) return null;

  const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  
  // Add randomness for easier difficulties
  if (difficulty === 'easy' && Math.random() < 0.3) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove = moves[0];
  let bestValue = -Infinity;

  for (const move of moves) {
    const newBoard = cloneBoard(board);
    newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
    newBoard[move.from[0]][move.from[1]] = null;
    const value = minimax(newBoard, depth, -Infinity, Infinity, false);
    
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}

interface GameState {
  board: Board;
  turn: Color;
  castleRights: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  capturedWhite: Piece[];
  capturedBlack: Piece[];
}

interface Props { darkMode: boolean; }

export default function Chess({ darkMode }: Props) {
  const { t } = useTranslation();
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("White's turn");
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [mode, setMode] = useState<Mode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isThinking, setIsThinking] = useState(false);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [castleRights, setCastleRights] = useState({ wK: true, wQ: true, bK: true, bQ: true });
  const [history, setHistory] = useState<GameState[]>([]);
  
  const thinkingRef = useRef(false);
  const colLetters = 'abcdefgh';

  const makeMove = useCallback((sr: number, sc: number, r: number, c: number, currentBoard: Board) => {
    const newBoard = cloneBoard(currentBoard);
    const movingPiece = newBoard[sr][sc]!;
    const captured = newBoard[r][c];
    
    // Save state for undo
    setHistory(prev => [...prev, {
      board: cloneBoard(currentBoard),
      turn,
      castleRights: { ...castleRights },
      capturedWhite: [...capturedWhite],
      capturedBlack: [...capturedBlack],
    }]);
    
    // Handle castling
    const newCastleRights = { ...castleRights };
    if (movingPiece.type === 'K') {
      if (movingPiece.color === 'w') {
        newCastleRights.wK = false;
        newCastleRights.wQ = false;
      } else {
        newCastleRights.bK = false;
        newCastleRights.bQ = false;
      }
      // Perform castling rook move
      if (Math.abs(c - sc) === 2) {
        if (c === 6) { // Kingside
          newBoard[r][5] = newBoard[r][7];
          newBoard[r][7] = null;
        } else if (c === 2) { // Queenside
          newBoard[r][3] = newBoard[r][0];
          newBoard[r][0] = null;
        }
      }
    }
    if (movingPiece.type === 'R') {
      if (sr === 7 && sc === 0) newCastleRights.wQ = false;
      if (sr === 7 && sc === 7) newCastleRights.wK = false;
      if (sr === 0 && sc === 0) newCastleRights.bQ = false;
      if (sr === 0 && sc === 7) newCastleRights.bK = false;
    }
    setCastleRights(newCastleRights);
    
    // Capture
    if (captured) {
      if (captured.color === 'w') {
        setCapturedWhite(prev => [...prev, captured]);
      } else {
        setCapturedBlack(prev => [...prev, captured]);
      }
    }
    
    newBoard[r][c] = movingPiece;
    newBoard[sr][sc] = null;

    // Pawn promotion
    if (movingPiece.type === 'P' && (r === 0 || r === 7)) {
      newBoard[r][c] = { type: 'Q', color: movingPiece.color };
    }

    const castleNote = movingPiece.type === 'K' && Math.abs(c - sc) === 2 
      ? (c === 6 ? ' O-O' : ' O-O-O') 
      : '';
    const moveNotation = `${PIECE_SYMBOLS[movingPiece.color + movingPiece.type]} ${colLetters[sc]}${8 - sr} → ${colLetters[c]}${8 - r}${captured ? ' ✕' : ''}${castleNote}`;

    const nextTurn = turn === 'w' ? 'b' : 'w';
    const inCheck = isInCheck(newBoard, nextTurn);
    const hasMove = hasAnyLegalMove(newBoard, nextTurn, newCastleRights);

    setBoard(newBoard);
    setSelected(null);
    setLegalMoves([]);
    setTurn(nextTurn);
    setLastMove({ from: [sr, sc], to: [r, c] });
    setMoveHistory(prev => [...prev, moveNotation]);

    if (!hasMove) {
      if (inCheck) {
        setStatus(`Checkmate! ${turn === 'w' ? 'White' : 'Black'} wins! 🎉`);
      } else {
        setStatus('Stalemate! It\'s a draw! 🤝');
      }
      setGameOver(true);
      return { newBoard, gameOver: true };
    } else if (inCheck) {
      setStatus(`${nextTurn === 'w' ? 'White' : 'Black'}'s turn (Check! ⚠️)`);
    } else {
      setStatus(`${nextTurn === 'w' ? 'White' : 'Black'}'s turn`);
    }
    
    return { newBoard, gameOver: false };
  }, [turn, castleRights, capturedWhite, capturedBlack, colLetters]);

  // AI Move
  useEffect(() => {
    if (mode === 'ai' && turn === 'b' && !gameOver && !thinkingRef.current) {
      thinkingRef.current = true;
      setIsThinking(true);
      
      setTimeout(() => {
        const bestMove = getBestMove(board, difficulty);
        if (bestMove) {
          makeMove(bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1], board);
        }
        setIsThinking(false);
        thinkingRef.current = false;
      }, 500);
    }
  }, [turn, mode, gameOver, board, difficulty, makeMove]);

  const handleClick = useCallback((r: number, c: number) => {
    if (gameOver || isThinking) return;
    if (mode === 'ai' && turn === 'b') return;
    
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isLegal) {
        makeMove(sr, sc, r, c, board);
        return;
      }
      if (piece && piece.color === turn) {
        setSelected([r, c]);
        setLegalMoves(getLegalMoves(board, r, c, castleRights));
        return;
      }
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    if (piece && piece.color === turn) {
      setSelected([r, c]);
      setLegalMoves(getLegalMoves(board, r, c, castleRights));
    }
  }, [board, selected, turn, legalMoves, gameOver, mode, isThinking, castleRights, makeMove]);

  const undoMove = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setBoard(lastState.board);
    setTurn(lastState.turn);
    setCastleRights(lastState.castleRights);
    setCapturedWhite(lastState.capturedWhite);
    setCapturedBlack(lastState.capturedBlack);
    setHistory(prev => prev.slice(0, -1));
    setMoveHistory(prev => prev.slice(0, -1));
    setSelected(null);
    setLegalMoves([]);
    setLastMove(null);
    setGameOver(false);
    setStatus(`${lastState.turn === 'w' ? 'White' : 'Black'}'s turn`);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn('w');
    setLegalMoves([]);
    setMoveHistory([]);
    setStatus('White\'s turn');
    setGameOver(false);
    setLastMove(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setCastleRights({ wK: true, wQ: true, bK: true, bQ: true });
    setHistory([]);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    resetGame();
  };

  const isHighlighted = (r: number, c: number) => legalMoves.some(([mr, mc]) => mr === r && mc === c);
  const isSelected = (r: number, c: number) => selected?.[0] === r && selected?.[1] === c;
  const isLastMove = (r: number, c: number) =>
    lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));

  const renderCaptured = (pieces: Piece[]) => (
    <div className="flex flex-wrap gap-0.5">
      {pieces.map((p, i) =>p && (<span key={i} className="text-lg">{PIECE_SYMBOLS[p.color + p.type]}</span>
      ))}
    </div>);

  return (<div className="flex flex-col items-center w-full max-w-5xl mx-auto">
      {/* Mode & Difficulty */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => changeMode('ai')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >🤖 vs AI</button>
        <button
          onClick={() => changeMode('pvp')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'pvp'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >👥 2 Players</button>
        {mode === 'ai' && (
          <>
            <span className={`px-2 flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); resetGame(); }}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                  difficulty === d
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full">
        <div className="flex flex-col items-center">
          {/* Status */}
          <div className={`text-lg font-bold mb-3 px-4 py-2 rounded-lg flex items-center gap-2 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-sm'
          }`}>
            {isThinking && <span className="animate-spin">⚙️</span>}
            {status}
          </div>

          {/* Captured Black pieces */}
          <div className={`w-full mb-2 px-2 min-h-[28px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {renderCaptured(capturedBlack)}
          </div>

          {/* Board */}
          <div className={`rounded-xl overflow-hidden shadow-2xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            {board.map((row, r) => (
              <div key={r} className="flex">
                {row.map((piece, c) => {
                  const isLight = (r + c) % 2 === 0;
                  let bg = isLight ? 'bg-amber-100' : 'bg-amber-700';
                  if (isSelected(r, c)) bg = 'bg-blue-400';
                  else if (isLastMove(r, c)) bg = isLight ? 'bg-yellow-200' : 'bg-yellow-600';

                  return (
                    <div
                      key={c}
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer relative ${bg} transition-colors`}
                      onClick={() => handleClick(r, c)}
                    >
                      {piece && (
                        <span className={`text-2xl sm:text-3xl md:text-4xl select-none ${
                          piece.color === 'w' ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : ''
                        }`}>
                          {PIECE_SYMBOLS[piece.color + piece.type]}
                        </span>
                      )}
                      {isHighlighted(r, c) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {piece ? (
                            <div className="w-full h-full border-4 border-blue-500/50 rounded-sm" />) : (<div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500/40" />
                          )}
                        </div>
                      )}
                      {c === 0 && (
                        <span className="absolute top-0.5 left-0.5 text-[10px] font-bold opacity-50">{8 - r}</span>
                      )}
                      {r === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[10px] font-bold opacity-50">{colLetters[c]}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Captured White pieces */}
          <div className={`w-full mt-2 px-2 min-h-[28px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {renderCaptured(capturedWhite)}
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={undoMove}
              disabled={history.length === 0 || isThinking}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >↩️ Undo</button>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
            >{t('auto.learning.s515_new_game', 'New Game')}</button>
          </div>
        </div>

        {/* Move History */}
        <div className={`w-full lg:w-56 rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('auto.learning.s516_move_history', 'Move History')}</h3>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {moveHistory.length === 0 ? (
              <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('auto.learning.s517_no_moves_yet', 'No moves yet')}</p>
            ) : (
              moveHistory.map((move, i) => (
                <div key={i} className={`text-sm py-1 px-2 rounded flex gap-2 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                  <span className="text-gray-400 w-6">{i + 1}.</span>
                  <span>{move}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
