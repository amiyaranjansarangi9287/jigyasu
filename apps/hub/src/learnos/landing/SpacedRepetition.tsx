import { useNavigate } from 'react-router-dom';
import { useSRS } from '@jigyasu/storage';
import { useTranslation } from 'react-i18next';
import { Card } from '@jigyasu/ui';

const MODULE_META: Record<string, { title: string; emoji: string; route: string }> = {
  'states-of-matter': { title: 'States of Matter', emoji: '🧊', route: '/3-5/states-of-matter' },
  'gravity': { title: 'Gravity & Orbits', emoji: '🌍', route: '/6-8/gravity' },
  'water-cycle': { title: 'Water Cycle', emoji: '💧', route: '/3-5/water-cycle' },
  'photosynthesis': { title: 'Photosynthesis', emoji: '🌿', route: '/6-8/photosynthesis' },
  'digestive-system': { title: 'Digestive System', emoji: '🫁', route: '/9-12/digestive-system' },
  'solar-system': { title: 'Solar System', emoji: '🌌', route: '/3-5/solar-system' },
  'blood-circulation': { title: 'Blood Circulation', emoji: '🫀', route: '/9-12/blood-circulation' },
  'cell-explorer': { title: 'Cell Explorer', emoji: '🔬', route: '/9-12/cell-explorer' },
  'newtons-laws': { title: "Newton's Laws", emoji: '🍎', route: '/13-17/newtons-laws' },
  'magnets': { title: 'Magnets', emoji: '🧲', route: '/3-5/magnets' },
  'electricity': { title: 'Electricity', emoji: '⚡', route: '/9-12/electricity' },
  'light-shadows': { title: 'Light & Shadows', emoji: '🔦', route: '/6-8/light-shadows' },
  'sound-waves': { title: 'Sound Waves', emoji: '🔊', route: '/6-8/sound-waves' },
  'float-sink': { title: 'Float or Sink', emoji: '🚢', route: '/3-5/float-sink' },
  'plant-growth': { title: 'Plant Growth', emoji: '🌱', route: '/3-5/plant-growth' },
  'day-night': { title: 'Day & Night', emoji: '🌅', route: '/3-5/day-night' },
  'moon-phases': { title: 'Moon Phases', emoji: '🌙', route: '/6-8/moon-phases' },
  'atoms': { title: 'Atoms', emoji: '⚛️', route: '/13-17/atoms' },
  'simple-machines': { title: 'Simple Machines', emoji: '⚙️', route: '/6-8/simple-machines' },
  'shapes': { title: 'Shapes', emoji: '🔷', route: '/3-5/math' },
  'number-line': { title: 'Number Line', emoji: '📏', route: '/3-5/math' },
  'fractions': { title: 'Fractions', emoji: '🍕', route: '/6-8/math' },
  'multiplication': { title: 'Multiplication', emoji: '✖️', route: '/6-8/math' },
  'pi': { title: 'Visualizing Pi', emoji: '🥧', route: '/9-12/math' },
  'pythagorean': { title: 'Pythagorean Theorem', emoji: '📐', route: '/9-12/math' },
  'senses': { title: 'Five Senses', emoji: '👁️', route: '/3-5/senses' },
  'habitats': { title: 'Habitats', emoji: '🦁', route: '/6-8/habitats' },
  'food-chain': { title: 'Food Chain', emoji: '🔗', route: '/6-8/food-chain' },
  'panchabhutas': { title: 'Panchabhutas', emoji: '🕉️', route: '/9-12/panchabhutas' },
};

export default function SpacedRepetition() {
  const { dueForReview } = useSRS();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-5 py-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🧠</span> 
        {t('landing.review.title', 'Time to Review!')}
      </h2>
      
      {!dueForReview || dueForReview.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
          <span className="text-5xl mb-3">🎉</span>
          <h3 className="text-lg font-bold text-slate-700">{t('landing.review.empty_title', "You're all caught up!")}</h3>
          <p className="text-slate-500 mt-1 max-w-sm">{t('landing.review.empty_desc', "No activities need your review right now. Keep exploring new worlds to build your knowledge!")}</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {dueForReview.map((record) => {
            const meta = MODULE_META[record.activityId] || { title: record.activityId, emoji: '📚', route: `/${record.appId}` };
            
            return (
              <Card
                key={record.id}
                hoverable
                onClick={() => navigate(meta.route)}
                className="flex-none snap-start group w-64 p-5 text-left flex flex-col gap-3 hover:border-sky-300"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 min-h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {meta.emoji}
                  </div>
                  <div className="bg-orange-100 text-orange-600 text-sm font-bold px-2 py-1 rounded-lg">
                    {t('landing.review.due', 'Due Now')}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-sky-600 transition-colors">
                    {meta.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <span>{record.masteryLevel === 3 ? '🌟 ' + t('landing.review.mastered', 'Mastered') : '⭐ ' + t('landing.review.familiar', 'Familiar')}</span>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
