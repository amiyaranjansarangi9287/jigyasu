import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerStore } from '../store';
import { useTranslation } from 'react-i18next';
import { AGE_GROUPS } from '../constants/ageGroups';
import { Button } from '@jigyasu/ui';

export const WORLDS = [
  {
    key: "tiny" as const,
    nameKey: "landing.worlds.tiny_name",
    descKey: "landing.worlds.tiny_desc",
    emoji: "🧸",
    skills: ["Colours", "Shapes", "Sounds"],
    gradient: "from-rose-300 via-pink-300 to-orange-300",
    soft: "bg-rose-50",
    accent: "text-rose-600",
  },
  {
    key: "early" as const,
    nameKey: "landing.worlds.early_name",
    descKey: "landing.worlds.early_desc",
    emoji: "🦊",
    skills: ["Reading", "Counting", "Stories"],
    gradient: "from-amber-300 via-orange-300 to-rose-300",
    soft: "bg-amber-50",
    accent: "text-amber-700",
  },
  {
    key: "lab" as const,
    nameKey: "landing.worlds.lab_name",
    descKey: "landing.worlds.lab_desc",
    emoji: "🧪",
    skills: ["Science", "Logic", "Puzzles"],
    gradient: "from-emerald-300 via-teal-300 to-sky-300",
    soft: "bg-emerald-50",
    accent: "text-emerald-700",
  },
  {
    key: "discovery" as const,
    nameKey: "landing.worlds.discovery_name",
    descKey: "landing.worlds.discovery_desc",
    emoji: "🌍",
    skills: ["Geography", "History", "Culture"],
    gradient: "from-sky-300 via-indigo-300 to-violet-300",
    soft: "bg-sky-50",
    accent: "text-sky-700",
  },
  {
    key: "academy" as const,
    nameKey: "landing.worlds.academy_name",
    descKey: "landing.worlds.academy_desc",
    emoji: "🎓",
    skills: ["Math", "Writing", "Exams"],
    gradient: "from-violet-300 via-purple-300 to-fuchsia-300",
    soft: "bg-violet-50",
    accent: "text-violet-700",
  },
  {
    key: "explorer" as const,
    nameKey: "landing.worlds.explorer_name",
    descKey: "landing.worlds.explorer_desc",
    emoji: "🚀",
    skills: ["Coding", "Languages", "Finance"],
    gradient: "from-slate-400 via-zinc-400 to-stone-400",
    soft: "bg-slate-50",
    accent: "text-slate-700",
  },
  {
    key: "biology" as const,
    nameKey: "landing.worlds.biology_name",
    descKey: "landing.worlds.biology_desc",
    emoji: "🧬",
    skills: ["Biology", "Genetics", "Ecology"],
    gradient: "from-green-300 via-emerald-300 to-teal-300",
    soft: "bg-green-50",
    accent: "text-green-700",
  },
  {
    key: "math" as const,
    nameKey: "landing.worlds.math_name",
    descKey: "landing.worlds.math_desc",
    emoji: "🧙‍♂️",
    skills: ["Arithmetic", "Algebra", "Geometry"],
    gradient: "from-purple-300 via-fuchsia-300 to-pink-300",
    soft: "bg-purple-50",
    accent: "text-purple-700",
  },
  {
    key: "physics" as const,
    nameKey: "landing.worlds.physics_name",
    descKey: "landing.worlds.physics_desc",
    emoji: "⚛️",
    skills: ["Mechanics", "Waves", "Quantum"],
    gradient: "from-cyan-300 via-blue-300 to-indigo-300",
    soft: "bg-cyan-50",
    accent: "text-cyan-700",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldCard = React.memo(function WorldCard({ w, t, handleEnter }: any) {
  return (
    <article
      aria-label={`${t(w.nameKey)}`}
      className="group relative overflow-hidden rounded-3xl bg-white p-1 shadow-lg shadow-orange-100/50 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/60"
    >
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${w.gradient} opacity-0 transition group-hover:opacity-100`} />

      <div className="relative rounded-[1.4rem] bg-white p-6">
        <div className={`relative -mx-6 -mt-6 mb-5 h-28 overflow-hidden rounded-t-[1.4rem] bg-gradient-to-br ${w.gradient}`}>
          <div className="absolute inset-0 bg-dots opacity-40" />
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-slate-900 shadow-md border border-slate-200">
            {w.key === 'tiny' ? t('landing.worlds.ages.2_5') : w.key === 'early' ? t('landing.worlds.ages.5_8') : w.key === 'lab' ? t('landing.worlds.ages.8_10') : w.key === 'discovery' ? t('landing.worlds.ages.10_13') : w.key === 'academy' ? t('landing.worlds.ages.13_15') : w.key === 'explorer' ? t('landing.worlds.ages.15_plus') : w.key === 'biology' ? t('landing.worlds.ages.10_18') : w.key === 'math' ? t('landing.worlds.ages.5_18') : t('landing.worlds.ages.10_18')}
          </span>
          <span className="absolute -bottom-2 left-5 text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            {w.emoji}
          </span>
        </div>

        <h3 className="font-display text-xl font-bold text-slate-900">{t(w.nameKey)}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{t(w.descKey)}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {w.skills.map((s: string) => (
            <span
              key={s}
              className={`rounded-full ${w.soft} px-2.5 py-1 text-sm font-semibold ${w.accent}`}
            >
              {t(`landing.worlds.skills.${s.toLowerCase()}`)}
            </span>
          ))}
        </div>

        <Button
          onClick={() => handleEnter(w.key)}
          aria-label={`Enter ${t(w.nameKey)}`}
          variant="dark"
          fullWidth
          className="mt-5 hover:bg-brand"
        >
          {t('landing.worlds.enter_world')}
        </Button>
      </div>
    </article>
  );
});

export default function WorldsGrid() {
  const navigate = useNavigate();
  const { enterWorld } = useLearnerStore();
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const displayedWorlds = showAll ? WORLDS : WORLDS.slice(0, 3);

  const handleEnter = (key: typeof WORLDS[number]['key']) => {
    enterWorld(key);
    navigate(AGE_GROUPS[key].route);
  };

  return (
    <section id="worlds" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-brand">{t('landing.worlds.step', 'Step 2')}</span>
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 md:text-4xl">
          {t('landing.worlds.title')}
        </h2>
        <p className="mt-3 text-slate-600">
          {t('landing.worlds.description')}
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {displayedWorlds.map((w) => (
          <WorldCard key={w.key} w={w} t={t} handleEnter={handleEnter} />
        ))}
      </div>

      {!showAll && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full bg-brand-sky/10 px-8 py-3 font-bold text-brand-sky hover:bg-brand-sky/20 transition-colors"
          >
            {t('landing.worlds.show_all', 'Explore All Worlds \u2193')}
          </button>
        </div>
      )}
    </section>
  );
}
