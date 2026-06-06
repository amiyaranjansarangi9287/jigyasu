// CampCraft - Pillar Showcase Section

import { pillars } from '../data/categories';
import { useLocalizedActivities } from '../../hooks/useLocalizedData';
import { useReveal } from '../hooks/useReveal';
import { useTranslation } from 'react-i18next';

interface PillarShowcaseProps {
  onSelectPillar: (pillarId: string) => void;
  selectedAge: string | null;
}

export default function PillarShowcase({ onSelectPillar, selectedAge }: PillarShowcaseProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const { activities } = useLocalizedActivities();
  const { t } = useTranslation();

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
      tagline: t('pillar_showcase.toybox.tagline', 'Build amazing handcrafted toys'),
      preview: [t('pillar_showcase.toybox.preview.0', 'Wooden Cars'), t('pillar_showcase.toybox.preview.1', 'Puppets'), t('pillar_showcase.toybox.preview.2', 'Puzzles')],
      image: '/images/blocks.webp',
      colSpan: 'md:col-span-1'
    },
    sciencelab: {
      tagline: t('pillar_showcase.sciencelab.tagline', 'Run interactive simulations & experiments'),
      preview: [t('pillar_showcase.sciencelab.preview.0', 'Physics Lab'), t('pillar_showcase.sciencelab.preview.1', 'Chemistry Lab'), t('pillar_showcase.sciencelab.preview.2', 'Biology Lab'), t('pillar_showcase.sciencelab.preview.3', 'Cosmos Lab')],
      image: '/images/volcano.webp',
      colSpan: 'md:col-span-2'
    },
    artstudio: {
      tagline: t('pillar_showcase.artstudio.tagline', 'Express your creativity'),
      preview: [t('pillar_showcase.artstudio.preview.0', 'Painting'), t('pillar_showcase.artstudio.preview.1', 'Origami'), t('pillar_showcase.artstudio.preview.2', 'Sculpture')],
      image: '/images/finger-paint.webp',
      colSpan: 'md:col-span-1'
    },
    outdoorquest: {
      tagline: t('pillar_showcase.outdoorquest.tagline', 'Explore nature and adventure'),
      preview: [t('pillar_showcase.outdoorquest.preview.0', 'Scavenger Hunts'), t('pillar_showcase.outdoorquest.preview.1', 'Gardening'), t('pillar_showcase.outdoorquest.preview.2', 'Stargazing')],
      image: '/images/nature-hunt.webp',
      colSpan: 'md:col-span-2'
    }
  };

  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 rounded-full px-4 py-2 mb-4">
            <span className="text-xl">🛠️</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">{t('pillar_showcase.interactive_learning', 'Interactive Learning')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">{t('pillar_showcase.explore', 'Explore Interactive Environments')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium">{t('pillar_showcase.dive_into', 'Dive into our hands-on simulation labs, digital art studios, and physical maker spaces. Learn by doing, building, and experimenting.')}</p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {pillars.map((pillar, index) => {
            const extras = pillarExtras[pillar.id as keyof typeof pillarExtras];
            const count = getActivityCount(pillar.id);

            return (
              <button
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.id)}
                className={`group relative overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 text-left hover:-translate-y-2 ${extras.colSpan} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Full Cover Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={extras.image}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    alt={t(`pillar_${pillar.id}` as any, pillar.name)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback-placeholder.png';
                    }}
                  />
                  {/* Premium Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  
                  {/* Hover Color Tint */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} mix-blend-overlay`} />
                </div>

                {/* Top Overlay: Icon & Count */}
                <div className="absolute top-6 left-6 w-14 min-h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="text-3xl">{pillar.icon}</span>
                </div>
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                  <span className="text-sm font-bold text-white tracking-wide">{count} {t('pillar_showcase.labs', 'Labs')}</span>
                </div>

                {/* Bottom Overlay: Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform duration-300">{t(`pillar_${pillar.id}` as any, pillar.name)}</h3>
                  <p className="text-white/80 text-base md:text-lg mb-6 group-hover:-translate-y-1 transition-transform duration-300 delay-75 max-w-md">
                    {extras.tagline}
                  </p>

                  {/* Previews (Hidden on small screens, reveals on hover) */}
                  <div className="flex flex-wrap gap-2 group-hover:-translate-y-1 transition-transform duration-300 delay-100">
                    {extras.preview.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90"
                      >
                        {item}
                      </span>
                    ))}
                    <div className="ml-auto flex items-center text-sm font-bold text-white bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                      {t('pillar_showcase.enter_lab', 'Enter Lab')}
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
