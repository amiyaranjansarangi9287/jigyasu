import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';

interface PuzzleImage {
  id: string;
  name: string;
  category: string;
  url: string;
}

const PUZZLE_IMAGES: PuzzleImage[] = [
  // Animals
  { id: 'lion', name: 'Majestic Lion', category: 'Animals', url: 'https://images.pexels.com/photos/6170292/pexels-photo-6170292.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'tiger', name: 'Bengal Tiger', category: 'Animals', url: 'https://images.pexels.com/photos/19196895/pexels-photo-19196895.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'panda', name: 'Red Panda', category: 'Animals', url: 'https://images.pexels.com/photos/17648464/pexels-photo-17648464.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'dolphin', name: 'Playful Dolphin', category: 'Animals', url: 'https://images.pexels.com/photos/17901947/pexels-photo-17901947.jpeg?auto=compress&cs=tinysrgb&w=600' },
  // Birds
  { id: 'eagle', name: 'Soaring Eagle', category: 'Birds', url: 'https://images.pexels.com/photos/17815746/pexels-photo-17815746.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'peacock', name: 'Colorful Peacock', category: 'Birds', url: 'https://images.pexels.com/photos/32017579/pexels-photo-32017579.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'owl', name: 'Wise Owl', category: 'Birds', url: 'https://images.pexels.com/photos/37623658/pexels-photo-37623658.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'parrot', name: 'Tropical Parrot', category: 'Birds', url: 'https://images.pexels.com/photos/36947831/pexels-photo-36947831.jpeg?auto=compress&cs=tinysrgb&w=600' },
  // Nature
  { id: 'butterfly', name: 'Swallowtail Butterfly', category: 'Nature', url: 'https://images.pexels.com/photos/31003026/pexels-photo-31003026.png?auto=compress&cs=tinysrgb&w=600' },
  { id: 'flower', name: 'Pink Chrysanthemum', category: 'Nature', url: 'https://images.pexels.com/photos/33106607/pexels-photo-33106607.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'mountain', name: 'Mountain Sunrise', category: 'Nature', url: 'https://images.pexels.com/photos/12385872/pexels-photo-12385872.jpeg?auto=compress&cs=tinysrgb&w=600' },
  // Space
  { id: 'nebula', name: 'Red Nebula', category: 'Space', url: 'https://images.pexels.com/photos/35528399/pexels-photo-35528399.png?auto=compress&cs=tinysrgb&w=600' },
];

type Difficulty = '20' | '42' | '56' | '80' | '100';

const DIFFICULTY_CONFIG: Record<Difficulty, { cols: number; rows: number; label: string }> = {
  '20': { cols: 5, rows: 4, label: '20 pcs (Easy)' },
  '42': { cols: 7, rows: 6, label: '42 pcs (Medium)' },
  '56': { cols: 8, rows: 7, label: '56 pcs (Hard)' },
  '80': { cols: 10, rows: 8, label: '80 pcs (Expert)' },
  '100': { cols: 10, rows: 10, label: '100 pcs (Master)' },
};

interface Piece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  isEdge: boolean;
  isCorner: boolean;
}

interface Props {
  darkMode: boolean;
}

export default function JigsawPuzzle({ darkMode }: Props) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(PUZZLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('20');
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showEdgesOnly, setShowEdgesOnly] = useState(false);
  const [sortBy] = useState<'shuffle' | 'edges' | 'colors'>('shuffle');
  const [moves, setMoves] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const config = DIFFICULTY_CONFIG[difficulty];
  const pieceWidth = 100 / config.cols;
  const pieceHeight = 100 / config.rows;

  const categories = ['All', ...Array.from(new Set(PUZZLE_IMAGES.map(img => img.category)))];
  const filteredImages = selectedCategory === 'All' 
    ? PUZZLE_IMAGES 
    : PUZZLE_IMAGES.filter(img => img.category === selectedCategory);

  const initPuzzle = useCallback(() => {
    const newPieces: Piece[] = [];
    const totalPieces = config.cols * config.rows;
    
    for (let i = 0; i < totalPieces; i++) {
      const correctX = i % config.cols;
      const correctY = Math.floor(i / config.cols);
      const isEdge = correctX === 0 || correctX === config.cols - 1 || correctY === 0 || correctY === config.rows - 1;
      const isCorner = (correctX === 0 || correctX === config.cols - 1) && (correctY === 0 || correctY === config.rows - 1);
      
      newPieces.push({
        id: i,
        correctX,
        correctY,
        currentX: -1,
        currentY: -1,
        isPlaced: false,
        isEdge,
        isCorner,
      });
    }
    
    // Shuffle pieces for the tray
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setTimer(0);
    setIsPlaying(false);
    setSolved(false);
    setMoves(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [config.cols, config.rows]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle, selectedImage]);

  useEffect(() => {
    if (isPlaying && !solved) {
      timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, solved]);

  // Preload image
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = selectedImage.url;
  }, [selectedImage]);

  const handleDragStart = (pieceId: number) => {
    if (!isPlaying) setIsPlaying(true);
    setDraggedPiece(pieceId);
  };

  const handleDrop = (targetX: number, targetY: number) => {
    if (draggedPiece === null) return;

    setMoves(m => m + 1);
    
    setPieces(prev => {
      const newPieces = prev.map(p => {
        if (p.id === draggedPiece) {
          const isCorrect = p.correctX === targetX && p.correctY === targetY;
          return {
            ...p,
            currentX: targetX,
            currentY: targetY,
            isPlaced: isCorrect,
          };
        }
        // If another piece is at this position, swap it back to tray
        if (p.currentX === targetX && p.currentY === targetY) {
          return { ...p, currentX: -1, currentY: -1, isPlaced: false };
        }
        return p;
      });

      // Check if all pieces are correctly placed
      const allPlaced = newPieces.every(p => p.isPlaced);
      if (allPlaced) {
        setSolved(true);
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }

      return newPieces;
    });
    setDraggedPiece(null);
  };

  const handleTrayDrop = () => {
    if (draggedPiece === null) return;
    setMoves(m => m + 1);
    setPieces(prev => prev.map(p => 
      p.id === draggedPiece ? { ...p, currentX: -1, currentY: -1, isPlaced: false } : p
    ));
    setDraggedPiece(null);
  };

  const sortTrayPieces = (pieces: Piece[]): Piece[] => {
    const trayPieces = pieces.filter(p =>p.currentX< 0);
    if (sortBy === 'edges') {
      return [...trayPieces.filter(p => p.isCorner), ...trayPieces.filter(p => p.isEdge && !p.isCorner), ...trayPieces.filter(p => !p.isEdge)];
    }
    return trayPieces;
  };

  const autoPlaceEdges = () => {
    setPieces(prev => {
      let moved = 0;
      const newPieces = prev.map(p => {
        if (p.isEdge && !p.isPlaced && p.currentX < 0) {
          // Check if spot is free
          const spotTaken = prev.some(op => op.currentX === p.correctX && op.currentY === p.correctY);
          if (!spotTaken) {
            moved++;
            return { ...p, currentX: p.correctX, currentY: p.correctY, isPlaced: true };
          }
        }
        return p;
      });
      if (moved > 0) setMoves(m => m + moved);
      return newPieces;
    });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const placedPieces = pieces.filter(p => p.currentX >= 0);
  const trayPieces = sortTrayPieces(pieces);
  const displayTrayPieces = showEdgesOnly ? trayPieces.filter(p => p.isEdge) : trayPieces;
  const progress = Math.round((pieces.filter(p => p.isPlaced).length / pieces.length) * 100);
  const boardSize = Math.min(400, typeof window !== 'undefined' ? window.innerWidth - 40 : 400);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-2">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image selection */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center max-w-full overflow-x-auto pb-2">
        {filteredImages.map(img => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
              selectedImage.id === img.id
                ? 'border-purple-500 ring-2 ring-purple-300 scale-110'
                : darkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof config][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setDifficulty(key)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              difficulty === key
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`flex gap-3 mb-4 text-sm font-semibold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>⏱️ {formatTime(timer)}</span>
        <span>🧩 {pieces.filter(p => p.isPlaced).length}/{pieces.length}</span>
        <span>📊 {progress}%</span>
        <span>🔄 {moves}</span>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-2 py-0.5 rounded text-xs ${
            showPreview
              ? 'bg-purple-500 text-white'
              : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {showPreview ? '🙈 Hide' : '👁️ Preview'}
        </button>
      </div>

      {/* Win message */}
      {solved && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg animate-bounce shadow-lg">
          🎉 Puzzle Complete! Time: {formatTime(timer)} | Moves: {moves}
        </div>
      )}

      {!imageLoaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>) : (<div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Preview (collapsible) */}
          {showPreview && (
            <div className={`flex-shrink-0 p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <img
                src={selectedImage.url}
                alt="Preview"
                className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-lg mx-auto"
              />
              <p className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedImage.name}
              </p>
            </div>
          )}

          {/* Main puzzle board */}
          <div
            ref={boardRef}
            className={`relative rounded-xl overflow-hidden border-2 mx-auto ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}
            style={{ width: boardSize, height: boardSize }}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Grid cells */}
            {Array(config.rows).fill(null).map((_, row) =>
              Array(config.cols).fill(null).map((_, col) => {
                const isEdge = col === 0 || col === config.cols - 1 || row === 0 || row === config.rows - 1;
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`absolute border transition-colors ${
                      isEdge 
                        ? darkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-400 bg-gray-50'
                        : darkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    style={{
                      left: `${col * pieceWidth}%`,
                      top: `${row * pieceHeight}%`,
                      width: `${pieceWidth}%`,
                      height: `${pieceHeight}%`,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(col, row)}
                  />
                );
              })
            )}

            {/* Placed pieces */}
            {placedPieces.map(piece => (
              <div
                key={piece.id}
                draggable
                onDragStart={() => handleDragStart(piece.id)}
                className={`absolute cursor-move transition-all ${
                  piece.isPlaced ? 'ring-2 ring-emerald-400 ring-inset' : 'ring-1 ring-blue-400 ring-inset'
                }`}
                style={{
                  left: `${piece.currentX * pieceWidth}%`,
                  top: `${piece.currentY * pieceHeight}%`,
                  width: `${pieceWidth}%`,
                  height: `${pieceHeight}%`,
                  backgroundImage: `url(${selectedImage.url})`,
                  backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                  backgroundPosition: `${(piece.correctX / (config.cols - 1)) * 100}% ${(piece.correctY / (config.rows - 1)) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Piece tray */}
          <div
            className={`flex-1 min-h-[150px] lg:min-h-0 lg:w-64 rounded-xl p-3 overflow-auto ${
              darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleTrayDrop}
          >
            <div className="flex justify-between items-center mb-2">
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Pieces ({displayTrayPieces.length})
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowEdgesOnly(!showEdgesOnly)}
                  className={`px-2 py-0.5 rounded text-xs ${
                    showEdgesOnly
                      ? 'bg-amber-500 text-white'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >📐 Edges</button>
                <button
                  onClick={autoPlaceEdges}
                  className={`px-2 py-0.5 rounded text-xs ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                  title="Auto-place edge pieces"
                >✨ Auto</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {displayTrayPieces.map(piece => (
                <div
                  key={piece.id}
                  draggable
                  onDragStart={() => handleDragStart(piece.id)}
                  className={`cursor-move hover:scale-110 transition-transform rounded shadow-sm ${
                    piece.isCorner ? 'ring-2 ring-amber-400' : piece.isEdge ? 'ring-1 ring-blue-300' : ''
                  }`}
                  style={{
                    width: Math.max(25, Math.min(45, 180 / config.cols)),
                    height: Math.max(25, Math.min(45, 180 / config.rows)),
                    backgroundImage: `url(${selectedImage.url})`,
                    backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                    backgroundPosition: `${(piece.correctX / (config.cols - 1)) * 100}% ${(piece.correctY / (config.rows - 1)) * 100}%`,
                  }}
                  title={piece.isCorner ? 'Corner piece' : piece.isEdge ? 'Edge piece' : 'Center piece'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={initPuzzle}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md"
      >{t('auto.learning.s523_shuffle_puzzle', 'Shuffle Puzzle')}</button>

      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Drag pieces to the board • 📐 = edge pieces • ✨ = auto-place edges • Green border = correct
      </p>
    </div>
  );
}
