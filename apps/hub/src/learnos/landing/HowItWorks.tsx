import { useTranslation } from 'react-i18next';

const STEPS = [
  { n: 1, titleKey: "landing.how_it_works.step1_title", descKey: "landing.how_it_works.step1_desc", emoji: "🗺️", color: "bg-rose-100 text-rose-700" },
  { n: 2, titleKey: "landing.how_it_works.step2_title", descKey: "landing.how_it_works.step2_desc", emoji: "🎮", color: "bg-amber-100 text-amber-700" },
  { n: 3, titleKey: "landing.how_it_works.step3_title", descKey: "landing.how_it_works.step3_desc", emoji: "🌱", color: "bg-emerald-100 text-emerald-700" },
  { n: 4, titleKey: "landing.how_it_works.step4_title", descKey: "landing.how_it_works.step4_desc", emoji: "📈", color: "bg-sky-100 text-sky-700" },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-brand">{t('landing.how_it_works.title')}</span>
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 md:text-4xl">
          {t('landing.how_it_works.title')}
        </h2>
      </div>

      <ol className="relative mt-12 grid gap-6 md:grid-cols-4">
        <div className="absolute top-10 left-[12%] right-[12%] hidden h-0.5 border-t-2 border-dashed border-orange-200 md:block" />

        {STEPS.map((s) => (
          <li key={s.n} className="relative">
            <div className="relative rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
              <div className={`mx-auto -mt-12 flex min-h-16 w-16 items-center justify-center rounded-2xl ${s.color} text-3xl shadow-md ring-4 ring-cream`}>
                {s.emoji}
              </div>
              <p className="mt-3 text-sm font-bold uppercase tracking-wider text-brand">Step {s.n}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-slate-900">{t(s.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{t(s.descKey)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
