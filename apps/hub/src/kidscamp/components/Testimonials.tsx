import { useState, useEffect } from 'react';
import { testimonials } from '../data/testimonials';
import { useReveal } from '../hooks/useReveal';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const { ref: sectionRef } = useReveal<HTMLDivElement>();

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-sm font-bold uppercase tracking-wider rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            {t('kidscamp.testimonials.happy_campers', 'Happy Campers')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{t('kidscamp.testimonials.title', 'What Our Community Says')}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('kidscamp.testimonials.desc', 'Join thousands of happy families who have discovered the joy of building and learning together.')}</p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="reveal relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 mb-8">
            {/* Quote mark */}
            <div className="absolute top-6 left-8 text-orange-100 dark:text-gray-700 text-8xl font-serif leading-none select-none">"</div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 min-h-14 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 flex items-center justify-center text-3xl">
                  {testimonials[active].avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonials[active].name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[active].role}</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {Array.from({ length: testimonials[active].rating }, (_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                "{testimonials[active].text}"
              </p>

              <p className="text-sm text-orange-500 dark:text-orange-400 font-semibold">{t('kidscamp.testimonials.built', 'Built:')} {testimonials[active].toyName}</p>
            </div>
          </div>

          {/* Thumbnail nav */}
          <div className="flex justify-center items-center gap-3">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActive(idx)}
                className={`transition-all duration-300 ${
                  idx === active
                    ? 'w-12 min-h-12 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 ring-2 ring-orange-400 ring-offset-2 text-2xl scale-110'
                    : 'w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-xl hover:bg-gray-200 dark:hover:bg-gray-600 opacity-60 hover:opacity-100'
                } flex items-center justify-center`}
              >
                {t.avatar}
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === active ? 'w-8 bg-orange-500' : 'w-2 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="reveal mt-16 flex flex-wrap justify-center gap-8 sm:gap-12">
          {[
            { number: '1,500+', label: t('kidscamp.testimonials.activities_done', 'Activities Done') },
            { number: '4.8', label: t('kidscamp.testimonials.avg_rating', 'Avg Rating') },
            { number: '50+', label: t('kidscamp.testimonials.countries', 'Countries') },
            { number: '99%', label: t('kidscamp.testimonials.recommend', 'Recommend') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
