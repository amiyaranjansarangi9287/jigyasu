import { toys } from '../data/toys';
import type { Toy } from '../data/toys';
import { useReveal } from '../hooks/useReveal';

interface FeaturedToysProps {
  onSelectToy: (toy: Toy) => void;
  onStartBuild: (toy: Toy) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export default function FeaturedToys({ onSelectToy, onStartBuild, isFavorite, onToggleFavorite }: FeaturedToysProps) {
  const featured = toys.filter((t) => t.featured);
  const sectionRef = useReveal();

  return (
    <section id="featured" className="py-24 mesh-gradient">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            Featured Projects
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Our Most Popular Builds
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            These crowd-favorite projects are loved by builders of all ages. Start with one of these for a guaranteed great experience!
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Large featured card */}
          {featured[0] && (
            <div className="reveal md:row-span-2">
              <button
                onClick={() => onSelectToy(featured[0])}
                className="group relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 text-left shimmer-hover"
              >
                <img
                  src={featured[0].image}
                  alt={featured[0].name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Favorite */}
                <div
                  className="absolute top-4 right-4 z-10"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(featured[0].id); }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFavorite(featured[0].id)
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}>
                    <svg className="w-5 h-5" fill={isFavorite(featured[0].id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-400/90 text-emerald-900">
                      {featured[0].difficulty}
                    </span>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-sm text-white">
                      Ages {featured[0].ageRange}
                    </span>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-400/90 text-yellow-900 flex items-center gap-1">
                      ⭐ {featured[0].rating}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{featured[0].name}</h3>
                  <p className="text-sm text-white/70 line-clamp-3 max-w-lg">{featured[0].description}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className="px-5 py-2 bg-white text-violet-700 font-bold text-sm rounded-full hover:shadow-lg transition-all cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onStartBuild(featured[0]); }}
                    >
                      🔨 Build This
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Two smaller cards */}
          {featured.slice(1).map((toy) => (
            <div key={toy.id} className="reveal">
              <button
                onClick={() => onSelectToy(toy)}
                className="group relative w-full h-full min-h-[240px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 text-left shimmer-hover"
              >
                <img
                  src={toy.image}
                  alt={toy.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Favorite */}
                <div
                  className="absolute top-4 right-4 z-10"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(toy.id); }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFavorite(toy.id)
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}>
                    <svg className="w-4 h-4" fill={isFavorite(toy.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
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
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-400/90 text-yellow-900 flex items-center gap-1">
                      ⭐ {toy.rating}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{toy.name}</h3>
                  <p className="text-sm text-white/70 line-clamp-2">{toy.description}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
