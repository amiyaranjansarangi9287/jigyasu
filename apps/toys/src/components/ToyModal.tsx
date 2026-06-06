import { useEffect } from 'react';
import type { Toy } from '../data/toys';
import { toys } from '../data/toys';

interface ToyModalProps {
  toy: Toy;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectToy: (toy: Toy) => void;
  onStartBuild: (toy: Toy) => void;
}

export default function ToyModal({ toy, onClose, isFavorite, onToggleFavorite, onSelectToy, onStartBuild }: ToyModalProps) {
  const difficultyStars = toy.difficulty === 'Easy' ? 1 : toy.difficulty === 'Medium' ? 2 : 3;

  // Related toys: same category or difficulty, excluding current
  const related = toys
    .filter((t) => t.id !== toy.id && (t.category === toy.category || t.difficulty === toy.difficulty))
    .slice(0, 3);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }, (_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-semibold text-gray-700 ml-1.5">{rating}</span>
        <span className="text-xs text-gray-400 ml-1">({toy.reviewCount} reviews)</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
         aria-label="Action button">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/8] overflow-hidden rounded-t-3xl">
          <img src={toy.image} alt={toy.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Floating info on image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-violet-500/90 text-white">
                  {toy.category}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    toy.difficulty === 'Easy'
                      ? 'bg-emerald-400/90 text-emerald-900'
                      : toy.difficulty === 'Medium'
                      ? 'bg-amber-400/90 text-amber-900'
                      : 'bg-red-400/90 text-red-900'
                  }`}
                >
                  {toy.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className={`w-12 min-h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isFavorite
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
              }`}
            >
              <svg className={`w-6 h-6 ${isFavorite ? 'animate-heart-beat' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{toy.name}</h2>
          <div className="mb-4">{renderStars(toy.rating)}</div>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">{toy.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 text-center border border-violet-100/50">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-xs text-gray-500 mb-1">Build Time</p>
              <p className="text-sm font-bold text-gray-900">{toy.timeToMake}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 text-center border border-amber-100/50">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-xs text-gray-500 mb-1">Difficulty</p>
              <p className="text-sm font-bold text-gray-900">
                {'⭐'.repeat(difficultyStars)}{'☆'.repeat(3 - difficultyStars)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center border border-blue-100/50">
              <div className="text-2xl mb-1">👶</div>
              <p className="text-xs text-gray-500 mb-1">Age Range</p>
              <p className="text-sm font-bold text-gray-900">{toy.ageRange}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center border border-emerald-100/50">
              <div className="text-2xl mb-1">📋</div>
              <p className="text-xs text-gray-500 mb-1">Steps</p>
              <p className="text-sm font-bold text-gray-900">{toy.steps.length} steps</p>
            </div>
          </div>

          {/* Build Steps Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">📝</span>
              Build Steps Preview
            </h3>
            <div className="space-y-3">
              {toy.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-violet-50 transition-colors border border-transparent group-hover:border-violet-100">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{step.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{step.description}</p>
                    <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">⏱ {step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">🛠️</span>
              Materials Needed ({toy.materials.length} items)
            </h3>
            <div className="flex flex-wrap gap-2">
              {toy.materials.map((material, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-violet-200 hover:from-violet-50 hover:to-indigo-50 transition-colors cursor-default"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>

          {/* Safety notes */}
          {toy.safetyNotes && toy.safetyNotes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚠️</span>
                <h3 className="font-bold text-amber-800 text-sm">Safety Notes</h3>
              </div>
              <ul className="space-y-1.5">
                {toy.safetyNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => onStartBuild(toy)}
              className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-lg flex items-center justify-center gap-2"
            >
              <span>🚀</span> Start Building
            </button>
            <button
              onClick={onToggleFavorite}
              className={`px-8 py-4 font-bold rounded-2xl transition-all duration-300 ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-2 border-rose-200 hover:bg-rose-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          {/* Related Toys */}
          {related.length > 0 && (
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-5">You Might Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectToy(r)}
                    className="group flex gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-violet-50 transition-colors text-left"
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-16 min-h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-500">{r.category} · {r.difficulty}</p>
                      <p className="text-xs text-amber-500 mt-0.5">⭐ {r.rating}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
