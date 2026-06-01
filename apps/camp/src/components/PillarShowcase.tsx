// CampCraft - Pillar Showcase Section

import { pillars } from '../data/categories';
import { activities } from '../data/activities';
import { useReveal } from '../hooks/useReveal';

interface PillarShowcaseProps {
  onSelectPillar: (pillarId: string) => void;
  selectedAge: string | null;
}

export default function PillarShowcase({ onSelectPillar, selectedAge }: PillarShowcaseProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  const getActivityCount = (pillarId: string) => {
    let filtered = activities.filter(a => a.pillar === pillarId);
    if (selectedAge) {
      filtered = filtered.filter(a => {
        if (a.ageRange === selectedAge) return true;
        if (a.ageRange === '3-12') return true;
        if (a.ageRange === '6-12' && (selectedAge === '6-8' || selectedAge === '9-12')) return true;
        if (a.ageRange === '3-8' && (selectedAge === '3-5' || selectedAge === '6-8')) return true;
        return false;
      });
    }
    return filtered.length;
  };

  const pillarExtras = {
    toybox: {
      tagline: 'Build amazing handcrafted toys',
      preview: ['Wooden Cars', 'Puppets', 'Puzzles', 'Musical Instruments'],
      image: '/images/blocks.jpg'
    },
    sciencelab: {
      tagline: 'Discover the magic of experiments',
      preview: ['Volcano', 'Slime', 'Crystals', 'Rockets'],
      image: '/images/volcano.jpg'
    },
    artstudio: {
      tagline: 'Express your creativity',
      preview: ['Painting', 'Tie-Dye', 'Origami', 'Sculpture'],
      image: '/images/finger-paint.jpg'
    },
    outdoorquest: {
      tagline: 'Explore nature and adventure',
      preview: ['Scavenger Hunts', 'Gardening', 'Stargazing', 'Bug Hotels'],
      image: '/images/nature-hunt.jpg'
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-orange-50/50 dark:to-orange-900/10">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Four Worlds of Wonder
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Each pillar offers unique activities designed to spark creativity, build skills, and create lasting memories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const extras = pillarExtras[pillar.id as keyof typeof pillarExtras];
            const count = getActivityCount(pillar.id);

            return (
              <button
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.id)}
                className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 text-left hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={extras.image}
                    alt={pillar.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${pillar.gradientFrom} ${pillar.gradientTo} opacity-60`} />
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">{pillar.icon}</span>
                  </div>

                  {/* Count badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm font-medium text-gray-800 dark:text-white">
                    {count} activities
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all">
                    {pillar.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {extras.tagline}
                  </p>

                  {/* Preview tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {extras.preview.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300"
                      >
                        {item}
                      </span>
                    ))}
                    {extras.preview.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
                        +{extras.preview.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-sm font-medium text-orange-500 group-hover:text-orange-600">
                    Explore activities
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} pointer-events-none`}
                />
              </button>
            );
          })}
        </div>

        {/* Cross-pillar callout */}
        <div
          className={`mt-12 p-6 rounded-3xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 border border-orange-200 dark:border-orange-800/50 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex -space-x-2">
              {pillars.map((p) => (
                <span
                  key={p.id}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xl border-2 border-white dark:border-gray-900"
                >
                  {p.icon}
                </span>
              ))}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white">
                🔗 Cross-Pillar Connections
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Many activities connect across pillars! Build a puppet in ToyBox, then put on a show in ArtStudio.
              </p>
            </div>
            <button
              onClick={() => onSelectPillar('all')}
              className="btn btn-primary text-sm"
            >
              See All Activities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
