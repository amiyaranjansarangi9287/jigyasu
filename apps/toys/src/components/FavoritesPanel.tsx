import { useEffect } from 'react';
import { toys } from '../data/toys';
import type { Toy } from '../data/toys';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: number[];
  onRemoveFavorite: (id: number) => void;
  onSelectToy: (toy: Toy) => void;
}

export default function FavoritesPanel({ isOpen, onClose, favorites, onRemoveFavorite, onSelectToy }: FavoritesPanelProps) {
  const favToys = toys.filter((t) => favorites.includes(t.id));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Favorites</h2>
              <p className="text-xs text-gray-500">{favToys.length} saved project{favToys.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
           aria-label="Action button">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {favToys.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Browse our toy collection and tap the heart icon to save your favorites!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-violet-100 text-violet-700 font-semibold rounded-full hover:bg-violet-200 transition-colors text-sm"
              >
                Browse Toys
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favToys.map((toy) => (
                <div
                  key={toy.id}
                  className="group bg-gray-50 rounded-2xl p-4 hover:bg-violet-50 transition-colors"
                >
                  <div className="flex gap-4">
                    <button
                      onClick={() => { onSelectToy(toy); onClose(); }}
                      className="flex-shrink-0"
                    >
                      <img
                        src={toy.image}
                        alt={toy.name}
                        className="w-20 min-h-20 rounded-xl object-cover group-hover:shadow-md transition-shadow"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => { onSelectToy(toy); onClose(); }}
                        className="text-left w-full"
                      >
                        <h4 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors text-sm truncate">
                          {toy.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {toy.category} · {toy.difficulty} · ⭐ {toy.rating}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{toy.timeToMake}</p>
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveFavorite(toy.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center transition-colors self-center shadow-sm"
                      title="Remove from favorites"
                    >
                      <svg className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favToys.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
