// src/components/AboutPage.tsx
// Route: /about
// Jigyasu About Page — fully i18n-driven, accessible, dynamic

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

function useAboutData() {
  const { t } = useTranslation();

  const getArray = <T,>(key: string, fallback: T[] = []): T[] => {
    const obj = t(key, { returnObjects: true, defaultValue: {} }) as any;
    if (Array.isArray(obj)) return obj as T[];
    return Object.values(obj).length ? (Object.values(obj) as T[]) : fallback;
  };

  const withEmojiFallback = (items: any[], emojis: string[]) =>
    items.map((item, i) => ({
      ...item,
      emoji: item?.emoji || emojis[i] || '•',
    }));

  const VALUE_EMOJIS = ['✨', '⚖️', '🤝', '🌱', '🎉', '🇮🇳'];
  const DIFF_EMOJIS = ['🌐', '📱', '🗣️', '📴', '👨‍👩‍👧', '🫀'];
  const AUDIENCE_EMOJIS = ['👧', '👨', '👩', '👦', '👴'];
  const SUPPORT_EMOJIS = ['👤', '💡', '🛤️'];

  return {
    title: t('about.title', 'Jigyasu'),
    tagline: t('about.tagline', 'Install Wonder.'),
    heroQuote: t('about.hero_quote', ''),

    whyWeBuildTitle: t('about.why_we_build_title', 'Why We Are Building This'),
    whyWeBuildParagraphs: getArray<any>('about.why_we_build_paragraphs'),

    missionTitle: t('about.mission_title', 'Our Mission'),
    missionStatement: t('about.mission_statement', ''),
    missionBullets: getArray<string>('about.mission_bullets'),
    missionClosing: t('about.mission_closing', ''),

    whoItIsForTitle: t('about.who_it_is_for_title', 'Who Jigyasu Is For'),
    audience: withEmojiFallback(getArray<any>('about.audience'), AUDIENCE_EMOJIS),

    valuesTitle: t('about.values_title', 'What We Believe'),
    values: withEmojiFallback(getArray<any>('about.values'), VALUE_EMOJIS),

    differencesTitle: t('about.differences_title', 'What We Built — and Why'),
    differences: withEmojiFallback(getArray<any>('about.differences'), DIFF_EMOJIS),

    builtForIndiaTitle: t('about.built_for_india_title', 'Built for India'),
    builtForIndiaStatement: t('about.built_for_india_statement', ''),
    languages: t('about.languages', { returnObjects: true, defaultValue: [] }) as string[],
    indianContext: getArray<any>('about.indian_context'),

    sustainabilityTitle: t('about.sustainability_title', 'How We Plan to Sustain This'),
    sustainabilityParagraphs: getArray<any>('about.sustainability_paragraphs'),

    supportTitle: t('about.support_title', 'Join the Mission'),
    supportStatement: t('about.support_statement', ''),
    relationshipsTitle: t('about.relationships_title', ''),
    relationshipsBody: t('about.relationships_body', ''),
    relationshipsClosing: t('about.relationships_closing', ''),
    contactLabel: t('about.contact_label', 'Reach out to us at:'),
    contactForm: t('about.contact_form', 'Contact Us via Form'),
    emailUs: t('about.email_us', 'Email Us Directly'),
    contactEmail: t('about.contact_email', 'contact@jigyasu.app'),
    contactDesc: t('about.contact_desc', 'When you write to us, we would love to know:'),
    supportQuestions: withEmojiFallback(getArray<any>('about.support_questions'), SUPPORT_EMOJIS),
    supportWaysTitle: t('about.support_ways_title', 'Ways you can support us:'),
    supportWays: getArray<string>('about.support_ways'),
    supportClosing: t('about.support_closing', ''),

    closingBody: t('about.closing_body', ''),
    closingTagline: t('about.closing_tagline', 'Install Wonder.'),
    copyrightName: t('about.copyright_name', 'Jigyasu'),
  };
}

export default function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useAboutData();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = t('about.page_title', 'About Jigyasu — Install Wonder');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t('about.meta_description', 'Jigyasu is a free, visual, multilingual learning platform built for every Indian child and adult.'));
    }
  }, [t]);

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.55, ease: 'easeOut' as const },
      };

  const langCount = data.languages.length;
  const langList = data.languages.join(', ');

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-5 pb-20">
        {/* ── HERO ─────────────────────────────────────── */}
        <motion.header
          {...fadeUp}
          className="text-center pt-16 pb-14 space-y-5"
        >
          <div className="text-7xl" aria-hidden="true">🦚</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-900 leading-tight">
            {data.title}
          </h1>
          <p className="text-2xl font-bold text-indigo-500">{data.tagline}</p>
          <p className="text-lg text-slate-500 italic max-w-xl mx-auto leading-relaxed whitespace-pre-line">
            {data.heroQuote}
          </p>
        </motion.header>

        {/* ── WHY WE BUILD ─────────────────────────────── */}
        <motion.section {...fadeUp} className="space-y-5 mb-16" aria-labelledby="why-we-build">
          <h2 id="why-we-build" className="text-2xl font-bold text-indigo-900">
            {data.whyWeBuildTitle}
          </h2>
          {data.whyWeBuildParagraphs.map((para: any, i: number) => (
            <p
              key={`p-${i}`}
              className={`text-lg leading-relaxed text-slate-700 ${para.emphasis ? 'font-semibold' : ''}`}
            >
              {para.text}
            </p>
          ))}
        </motion.section>

        {/* ── MISSION ──────────────────────────────────── */}
        <motion.section
          {...fadeUp}
          id="mission"
          className="bg-indigo-50 rounded-3xl p-8 sm:p-10 border border-indigo-100 mb-16 space-y-4"
          aria-labelledby="mission-title"
        >
          <h2 id="mission-title" className="text-2xl font-bold text-indigo-900">
            {data.missionTitle}
          </h2>
          <p className="text-lg font-semibold text-indigo-800 leading-relaxed">
            {data.missionStatement}
          </p>
          <div className="pt-2 space-y-3 text-indigo-700 text-base">
            {data.missionBullets.map((line: string) => (
              <div key={line} className="flex items-start gap-2 break-words">
                <span className="mt-1 flex-shrink-0" aria-hidden="true">→</span>
                <p className="flex-1 min-w-0">{line}</p>
              </div>
            ))}
          </div>
          <p className="text-indigo-600 text-sm pt-2 italic">{data.missionClosing}</p>
        </motion.section>

        {/* ── WHO IT IS FOR ────────────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-5" aria-labelledby="who-for">
          <h2 id="who-for" className="text-2xl font-bold text-indigo-900">
            {data.whoItIsForTitle}
          </h2>
          <div className="space-y-4">
            {data.audience.map((item: any) => (
              <div
                key={item.heading}
                className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 break-words"
              >
                <span className="text-4xl flex-shrink-0" aria-hidden="true">
                  {item.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 mb-1">{item.heading}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── VALUES ───────────────────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-5" aria-labelledby="values-title">
          <h2 id="values-title" className="text-2xl font-bold text-indigo-900">
            {data.valuesTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.values.map((v: any) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm break-words"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">
                    {v.emoji}
                  </span>
                  <h3 className="font-bold text-indigo-900 text-base">{v.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── WHAT MAKES US DIFFERENT ──────────────────── */}
        <motion.section
          {...fadeUp}
          id="difference"
          className="mb-16 space-y-5"
          aria-labelledby="diff-title"
        >
          <h2 id="diff-title" className="text-2xl font-bold text-indigo-900">
            {data.differencesTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.differences.map((point: any) => (
              <div
                key={point.title}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 break-words"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5" aria-hidden="true">
                  {point.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 mb-1">{point.title}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── BUILT FOR INDIA ──────────────────────────── */}
        <motion.section
          {...fadeUp}
          className="bg-orange-50 rounded-3xl p-8 border border-orange-100 mb-16 space-y-4"
          aria-labelledby="india-title"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">🇮🇳</span>
            <h2 id="india-title" className="text-2xl font-bold text-orange-900">
              {data.builtForIndiaTitle}
            </h2>
          </div>
          <p className="text-orange-800 text-base leading-relaxed">
            {data.builtForIndiaStatement}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {data.indianContext.map((item: any, i: number) => (
              <div
                key={`ctx-${i}`}
                className="flex items-start gap-2 text-sm text-orange-700 break-words"
              >
                <span className="text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                <span className="flex-1 min-w-0">
                  {item.interpolate?.count ? item.text.replace('{{count}}', String(langCount)) : item.text}
                </span>
              </div>
            ))}
          </div>
          {langCount > 0 && (
            <p className="text-orange-700 text-sm leading-relaxed pt-1">
              {t('about.languages_list', '{{count}} languages: {{list}}', { count: langCount, list: langList })}
            </p>
          )}
        </motion.section>

        {/* ── HOW WE SUSTAIN ───────────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-5" aria-labelledby="sustain-title">
          <h2 id="sustain-title" className="text-2xl font-bold text-indigo-900">
            {data.sustainabilityTitle}
          </h2>
          {data.sustainabilityParagraphs.map((para: any, i: number) => {
            if (para.style === 'highlight') {
              return (
                <div
                  key={`sus-${i}`}
                  className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100"
                >
                  <p className="text-indigo-800 font-semibold text-base leading-relaxed">
                    {para.text}
                  </p>
                </div>
              );
            }
            if (para.style === 'followup') {
              return (
                <div
                  key={`sus-${i}`}
                  className="bg-indigo-50 rounded-2xl px-6 pb-6 border border-indigo-100 -mt-4"
                >
                  <p className="text-indigo-600 text-sm leading-relaxed">{para.text}</p>
                </div>
              );
            }
            return (
              <p key={`sus-${i}`} className="text-slate-700 text-base leading-relaxed">
                {para.text}
              </p>
            );
          })}
        </motion.section>

        {/* ── SUPPORT / PARTNER ──────────────────────────── */}
        <motion.section
          {...fadeUp}
          id="support"
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 mb-16 space-y-6"
          aria-labelledby="support-title"
        >
          <div className="space-y-2">
            <h2 id="support-title" className="text-2xl font-bold">{data.supportTitle}</h2>
            <p className="text-slate-300 text-base leading-relaxed">{data.supportStatement}</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <p className="text-indigo-300 font-bold text-base mb-2">
              {data.relationshipsTitle}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{data.relationshipsBody}</p>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              {data.relationshipsClosing}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-slate-200 text-base font-semibold">{data.contactLabel}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600
                           hover:bg-indigo-500 transition-colors text-white
                           font-bold px-6 py-4 rounded-2xl text-base min-h-[56px]"
              >
                <span aria-hidden="true">📝</span>
                <span>{data.contactForm}</span>
              </button>
              <a
                href={`mailto:${data.contactEmail}`}
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-700
                           hover:bg-slate-600 transition-colors text-white
                           font-bold px-6 py-4 rounded-2xl text-base min-h-[56px]"
              >
                <span aria-hidden="true">✉️</span>
                <span>{data.emailUs}</span>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {data.contactDesc}
            </p>
            <div className="space-y-3">
              {data.supportQuestions.map((q: any) => (
                <div
                  key={q.label}
                  className="flex items-start gap-3 bg-slate-800/60 rounded-xl p-4 border border-slate-700"
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                    {q.emoji}
                  </span>
                  <div>
                    <p className="text-white font-bold text-sm mb-0.5">{q.label}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {data.supportWaysTitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-400">
              {data.supportWays.map((item: string, i: number) => (
                <div
                  key={`sw-${i}`}
                  className="bg-slate-800 rounded-xl px-3 py-2 border border-slate-700 flex items-start gap-2 break-words"
                >
                  <span className="flex-1 min-w-0">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{data.supportClosing}</p>
          </div>
        </motion.section>

        {/* ── CLOSING ──────────────────────────────────── */}
        <motion.section
          {...fadeUp}
          className="text-center space-y-5 py-8 border-t border-slate-100"
        >
          <div className="text-5xl" aria-hidden="true">🦚</div>
          <div className="space-y-2">
            <p className="text-slate-700 text-base leading-relaxed max-w-lg mx-auto">
              {data.closingBody}
            </p>
          </div>
          <p className="font-extrabold text-indigo-900 text-2xl tracking-tight">
            {data.closingTagline}
          </p>
          <p className="text-slate-400 text-sm">
            © 2026 {data.copyrightName} ·{' '}
            <button
              onClick={() => navigate('/contact')}
              className="hover:text-indigo-500 transition-colors"
            >
              <span>{data.contactForm}</span>
            </button>
          </p>
        </motion.section>
      </div>
    </main>
  );
}
