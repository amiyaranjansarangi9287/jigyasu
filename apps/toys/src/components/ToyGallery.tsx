import { useState } from 'react';
import { toys, categories } from '../data/toys';
import type { Toy } from '../data/toys';
import { useReveal } from '../hooks/useReveal';
import { useBuildStatus } from '../hooks/useBuildStatus';

interface ToyGalleryProps {
  onSelectToy: (toy: Toy) => void;
  onStartBuild: (toy: Toy) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export default function ToyGallery({ onSelectToy, onStartBuild, isFavorite, onToggleFavorite }: ToyGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'difficulty'>('name');
  const sectionRef = useReveal();
  const { getStatus } = useBuildStatus();

  const filtered = toys
    .filter((toy) => {
      const matchesCategory = activeCategory === 'All' || toy.category === activeCategory;
      const matchesSearch =
        toy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toy.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return a.name.localeCompare(b.name);
    });

  const difficultyColor = (d: string) => {
    if (d === 'Easy') return 'bg-emerald-100 text-emerald-700';
    if (d === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }, (_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        <span className="text-xs text-gray-500 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <section id="gallery" className="py-24 bg-white">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Full Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Explore All Toy Projects
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Filter by category, search, or sort to find the perfect project for your next build.
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="reveal flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search toys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-50 outline-none transition-all text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 text-sm text-gray-600 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="reveal flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-10 justify-start sm:justify-center px-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.name
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-200/60'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-gray-400 text-center">
          Showing {filtered.length} of {toys.length} projects
        </div>

        {/* Toy Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No toys found</h3>
            <p className="text-gray-500 mb-6">Try a different search term or category.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="px-6 py-2.5 bg-violet-100 text-violet-700 font-semibold rounded-full hover:bg-violet-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {filtered.map((toy) => (
              <div key={toy.id} className="reveal-scale">
                <button
                  onClick={() => onSelectToy(toy)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all duration-300 hover:-translate-y-1.5 text-left w-full shimmer-hover"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={toy.image}
                      alt={toy.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ${difficultyColor(toy.difficulty)}`}>
                      {toy.difficulty}
                    </div>

                    {/* Favorite button */}
                    <div
                      className="absolute top-3 left-3"
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(toy.id); }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFavorite(toy.id)
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-rose-400 hover:bg-white'
                      }`}>
                        <svg className={`w-4 h-4 ${isFavorite(toy.id) ? 'animate-heart-beat' : ''}`} fill={isFavorite(toy.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                     </div>

                    {/* Build status badge */}
                    {getStatus(toy.id) === 'completed' && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Built
                      </div>
                    )}
                    {getStatus(toy.id) === 'in-progress' && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white flex items-center gap-1 shadow">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                        In Progress
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-50 text-violet-600">
                        {toy.category}
                      </span>
                      {renderStars(toy.rating)}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      {toy.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{toy.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {toy.timeToMake}
                      </span>
                      <span
                        className="text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 rounded-full hover:shadow-md transition-shadow cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onStartBuild(toy); }}
                      >
                        {getStatus(toy.id) === 'in-progress' ? '▶ Continue' : getStatus(toy.id) === 'completed' ? '🔄 Rebuild' : '🔨 Build'}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
