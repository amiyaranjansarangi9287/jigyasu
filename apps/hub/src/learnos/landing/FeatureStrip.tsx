import { useTranslation, Trans } from 'react-i18next';

const FEATURES = [
  { icon: "🔒", titleKey: "landing.features.zero_friction", descKey: "landing.features.zero_friction_desc" },
  { icon: "📶", titleKey: "landing.features.works_offline", descKey: "landing.features.works_offline_desc" },
  { icon: "🆓", titleKey: "landing.features.privacy_first", descKey: "landing.features.privacy_first_desc" },
  { icon: "🌈", titleKey: "landing.features.six_languages", descKey: "landing.features.six_languages_desc" },
];

export default function FeatureStrip() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-4 text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-brand">{t('landing.principles.title', 'Core Design Principles')}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.titleKey}
            className="rounded-2xl border border-orange-100 bg-white/80 p-5 backdrop-blur transition hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              {f.icon}
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{t(f.titleKey)}</h3>
            <p className="mt-1 text-sm text-slate-600">{t(f.descKey)}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        <Trans i18nKey="auto.featurestrip.features_in_development_for_fu">* Features in development for full launch</Trans>
                    </p>
    </section>
  );
}
