// src/components/AboutPage.tsx
// Route: /about
// Jigyasu About Page - Mission and Vision

import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

export default function AboutPage() {
  const { t } = useTranslation();
  
  const VALUES = [
    {
      title: t('about.values.0.title', 'Wonder'),
      emoji: '✨',
      desc: t('about.values.0.desc', 'We begin with questions...'),
    },
    {
      title: t('about.values.1.title', 'Equity'),
      emoji: '⚖️',
      desc: t('about.values.1.desc', 'One platform...'),
    },
    {
      title: t('about.values.2.title', 'Respect'),
      emoji: '🤝',
      desc: t('about.values.2.desc', 'No grades...'),
    },
    {
      title: t('about.values.3.title', 'Patience'),
      emoji: '🌱',
      desc: t('about.values.3.desc', 'Learning takes time...'),
    },
    {
      title: t('about.values.4.title', 'Joy'),
      emoji: '🎉',
      desc: t('about.values.4.desc', 'If learning is not joyful...'),
    },
    {
      title: t('about.values.5.title', 'Identity'),
      emoji: '🇮🇳',
      desc: t('about.values.5.desc', 'Indian scientists...'),
    }
  ];

  const DIFFERENCE_POINTS = [
    {
      emoji: '🌐',
      title: t('about.differences.0.title', 'Free by Design'),
      desc: t('about.differences.0.desc', 'There is no poor version...'),
    },
    {
      emoji: '📱',
      title: t('about.differences.1.title', 'Website First'),
      desc: t('about.differences.1.desc', 'A link shared...'),
    },
    {
      emoji: '🗣️',
      title: t('about.differences.2.title', '22 Indian Languages'),
      desc: t('about.differences.2.desc', 'Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Understanding begins in the language closest to the learner.'),
    },
    {
      emoji: '📴',
      title: t('about.differences.3.title', 'Offline First'),
      desc: t('about.differences.3.desc', 'Designed to work on 2G...'),
    },
    {
      emoji: '👨‍👩‍👧',
      title: t('about.differences.4.title', 'For Every Age'),
      desc: t('about.differences.4.desc', 'Ages 2 to 80+...'),
    },
    {
      emoji: '🫀',
      title: t('about.differences.5.title', 'Visual and Interactive'),
      desc: t('about.differences.5.desc', 'You do not just watch...'),
    }
  ];

  const SUPPORT_QUESTIONS = [
    {
      label: t('about.support_labels.who', 'The Who'),
      emoji: '👤',
      desc: t('about.support_labels.who_desc', 'A brief intro...'),
    },
    {
      label: t('about.support_labels.why', 'The Why'),
      emoji: '💡',
      desc: t('about.support_labels.why_desc', 'Why Jigyasu?'),
    },
    {
      label: t('about.support_labels.how', 'The How'),
      emoji: '🛤️',
      desc: t('about.support_labels.how_desc', 'How do you envision...'),
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ═══════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm
                      border-b border-slate-100 px-5 py-3
                      flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-700 font-extrabold
                     text-base hover:text-indigo-900 transition-colors"
        >
          <span className="text-xl">🦚</span>
          <span><Trans i18nKey="auto.aboutpage.jigyasu">Jigyasu</Trans></span>
        </button>
        <div className="flex gap-4 text-sm text-slate-500">
          <a href="#mission" className="hover:text-indigo-700 transition-colors hidden sm:block"> {t('about.mission', 'Mission')} </a>
          <a href="#difference" className="hover:text-indigo-700 transition-colors hidden sm:block"> {t('about.what_we_built', 'What We Built')} </a>
          <a href="#support" className="hover:text-indigo-700 transition-colors"> {t('about.support', 'Support')} </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 pb-20">

        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <motion.header
          {...FADE_UP}
          className="text-center pt-16 pb-14 space-y-5"
        >
          <div className="text-7xl">🦚</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight
                         text-indigo-900 leading-tight">
            <Trans i18nKey="auto.aboutpage.jigyasu">Jigyasu</Trans>
                                </h1>
          <p className="text-2xl font-bold text-indigo-500"> {t('about.tagline', 'Install Wonder.')} </p>
          <p className="text-lg text-slate-500 italic max-w-xl mx-auto leading-relaxed whitespace-pre-line">
            {t('about.hero_quote', '"Every child is born a scientist.\nThey ask why. They test everything.\nThen school happens — and the why gets quieter.\nWe are here to keep the why loud. Forever."')}
          </p>
        </motion.header>

        {/* ═══════════════════════════════════════════
            THE PROBLEM
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="space-y-5 mb-16">
          <h2 className="text-2xl font-bold text-indigo-900">
            {t('about.why_we_build', 'Why We Are Building This')}
          </h2>

          <p className="text-lg leading-relaxed text-slate-700">
            <Trans i18nKey="auto.aboutpage.in_many_parts_of_india_educati">In many parts of India, education is still not equally accessible.
                                  Some children study in overcrowded classrooms.
                                  Some share one phone with the entire family.
                                  Some learn in a language that is not the language they think in.
                                  Some cannot afford coaching, tutors, or premium apps.</Trans>
                                </p>
          <p className="text-lg leading-relaxed text-slate-700">
            <Trans i18nKey="auto.aboutpage.and_outside_of_childhood_many_">And outside of childhood — many adults carry questions from school
                                  that were never answered clearly. Questions they felt embarrassed
                                  to ask. Concepts that never quite made sense in the way they were taught.</Trans>
                                </p>
          <p className="text-lg leading-relaxed text-slate-700 font-semibold">
            <Trans i18nKey="auto.aboutpage.people_do_not_hate_learning_th">People do not hate learning.
                                  They hate feeling confused, judged, or left behind.</Trans>
                                </p>
          <p className="text-lg leading-relaxed text-slate-700">
            <Trans i18nKey="auto.aboutpage.when_an_idea_is_shown_clearly_">When an idea is shown clearly — when it moves, when it responds
                                  to your touch, when it connects to something you already know
                                  from daily life — learning becomes natural again.
                                  That is what Jigyasu is built for.</Trans>
                                </p>
        </motion.section>

        {/* ═══════════════════════════════════════════
            MISSION
        ═══════════════════════════════════════════ */}
        <motion.section
          {...FADE_UP}
          id="mission"
          className="bg-indigo-50 rounded-3xl p-8 sm:p-10
                     border border-indigo-100 mb-16 space-y-4"
        >
          <h2 className="text-2xl font-bold text-indigo-900">
            <Trans i18nKey="auto.aboutpage.our_mission">Our Mission</Trans>
                                </h2>
          <p className="text-lg font-semibold text-indigo-800 leading-relaxed">
            <Trans i18nKey="auto.aboutpage.every_child_in_india_and_every">Every child in India — and every adult who missed their chance —
                                  deserves to experience the joy of truly understanding something.
                                  Not memorizing. Understanding.</Trans>
                                </p>
          <div className="pt-2 space-y-3 text-indigo-700 text-base">
            {[
              'Not just reading about gravity — seeing it bend space.',
              'Not just memorizing photosynthesis — watching sunlight become food.',
              'Not just solving fractions — feeling them as fair sharing.',
              'Not just studying science — experiencing wonder.',
            ].map((line) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-1 flex-shrink-0">→</span>
                <p>{line}</p>
              </div>
            ))}
          </div>
          <p className="text-indigo-600 text-sm pt-2 italic">
            <Trans i18nKey="auto.aboutpage.this_is_not_a_feature_it_is_th">This is not a feature. It is the entire reason Jigyasu exists.</Trans>
                                </p>
        </motion.section>

        {/* ═══════════════════════════════════════════
            WHO IT IS FOR
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="mb-16 space-y-5">
          <h2 className="text-2xl font-bold text-indigo-900">
            <Trans i18nKey="auto.aboutpage.who_jigyasu_is_for">Who Jigyasu Is For</Trans>
                                </h2>
          <div className="space-y-4">
            {[
              {
                emoji: '👧',
                heading: 'The child who cannot afford tuition',
                body: 'A 9-year-old in a government school in Bihar or Odisha. One shared Android phone. No coaching. Jigyasu gives them a patient, visual teacher available 24 hours a day. Free. In their language.',
              },
              {
                emoji: '👨',
                heading: 'The curious adult who missed their chance',
                body: 'A 38-year-old who always wanted to understand why the sky is blue. No age labels. No exam pressure. No shame. Just a beautiful explanation of something they always wondered about.',
              },
              {
                emoji: '👩',
                heading: 'The parent learning alongside their child',
                body: 'A mother in Hyderabad, Class 8 educated. Her daughter is in Class 6. She learns the same concept in Telugu, at her pace. Now they can discuss photosynthesis at dinner.',
              },
              {
                emoji: '👦',
                heading: 'The first-generation learner',
                body: 'A 16-year-old in a village in Rajasthan. First in the family to reach Class 10. No coaching institute. Jigyasu works offline. Downloaded at the school computer. Studied at home.',
              },
              {
                emoji: '👴',
                heading: 'The grandparent who wants to connect',
                body: 'Learning the same concept as their grandchild. Sending them an encouraging message through the app. Building a bond through shared discovery.',
              },
            ].map((item) => (
              <div
                key={item.heading}
                className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5
                           border border-slate-100"
              >
                <span className="text-4xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-bold text-slate-800 mb-1">{item.heading}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            VALUES
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="mb-16 space-y-5">
          <h2 className="text-2xl font-bold text-indigo-900">
            {t('about.headings.what_we_believe', 'What We Believe')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-5 border border-slate-200
                           shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{v.emoji}</span>
                  <h3 className="font-bold text-indigo-900 text-base">
                    {v.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            WHAT MAKES US DIFFERENT
        ═══════════════════════════════════════════ */}
        <motion.section
          {...FADE_UP}
          id="difference"
          className="mb-16 space-y-5"
        >
          <h2 className="text-2xl font-bold text-indigo-900">
            {t('about.headings.what_we_built', 'What We Built — and Why')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {DIFFERENCE_POINTS.map((point) => (
              <div
                key={point.title}
                className="flex items-start gap-4 p-5 rounded-2xl
                           bg-slate-50 border border-slate-100"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">
                  {point.emoji}
                </span>
                <div>
                  <p className="font-bold text-slate-800 mb-1">{point.title}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            INDIAN CONTEXT
        ═══════════════════════════════════════════ */}
        <motion.section
          {...FADE_UP}
          className="bg-orange-50 rounded-3xl p-8 border border-orange-100
                     mb-16 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇮🇳</span>
            <h2 className="text-2xl font-bold text-orange-900">
              {t('about.headings.built_for_india', 'Built for India')}
            </h2>
          </div>
          <p className="text-orange-800 text-base leading-relaxed">
            <Trans i18nKey="auto.aboutpage.this_is_not_a_global_platform_">This is not a global platform lightly translated for India.
                                  It is built from India, for Indian learners — and open to everyone.</Trans>
                                </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {[
              t('about.indian_context.0', 'Rupees, not dollars'),
              t('about.indian_context.1', 'Rotis and chai, not only pizzas'),
              t('about.indian_context.2', 'Monsoons, ISRO, cricket, Indian markets'),
              t('about.indian_context.3', 'Aryabhata, Ramanujan, C.V. Raman, J.C. Bose'),
              t('about.indian_context.4', 'APJ Abdul Kalam, Sushruta, Brahmagupta'),
              t('about.indian_context.5', '22 Indian languages from day one'),
              t('about.indian_context.6', 'Designed for 2G and shared phones'),
              t('about.indian_context.7', 'Offline-first for rural learners'),
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-orange-700"
              >
                <span className="text-orange-400">✓</span>
                {item}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            HOW WE SUSTAIN THIS
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="mb-16 space-y-5">
          <h2 className="text-2xl font-bold text-indigo-900">
            <Trans i18nKey="auto.aboutpage.how_we_plan_to_sustain_this">How We Plan to Sustain This</Trans>
                                </h2>
          <p className="text-slate-700 text-base leading-relaxed">
            <Trans i18nKey="auto.aboutpage.jigyasu_is_mission_first_the_g">Jigyasu is mission-first. The goal is never to make education expensive.
                                  The goal is to keep learning free and make the platform sustainable
                                  through a simple principle:</Trans>
                                </p>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <p className="text-indigo-800 font-semibold text-base leading-relaxed">
              <Trans i18nKey="auto.aboutpage.those_who_can_support_the_miss">Those who can support the mission help keep it free
                                        for those who cannot.</Trans>
                                      </p>
            <p className="text-indigo-600 text-sm mt-2 leading-relaxed">
              <Trans i18nKey="auto.aboutpage.the_child_who_cannot_pay_and_t">The child who cannot pay and the child who can pay will always
                                        see the same platform, the same concepts, the same quality.
                                        There is no premium version. There is no locked content.
                                        There is only Jigyasu — for everyone.</Trans>
                                      </p>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            <Trans i18nKey="auto.aboutpage.support_may_come_through_indiv">Support may come through individuals who care about equity in
                                  education, organisations with a shared mission, CSR partnerships,
                                  government grants, or institutional collaborations. All of these
                                  fund one thing only: access for learners who need it most.</Trans>
                                </p>
        </motion.section>

        {/* ═══════════════════════════════════════════
            SUPPORT / PARTNER SECTION
        ═══════════════════════════════════════════ */}
        <motion.section
          {...FADE_UP}
          id="support"
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10
                     mb-16 space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold"> {t('about.join_mission', 'Join the Mission')} </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              <Trans i18nKey="auto.aboutpage.if_you_feel_connected_to_what_">If you feel connected to what Jigyasu is trying to do —
                                        if the idea of a free, visual, multilingual learning platform
                                        for every Indian child and adult resonates with you —
                                        we would love to hear from you.</Trans>
                                      </p>
          </div>

          {/* Key statement */}
          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <p className="text-indigo-300 font-bold text-base mb-2"> {t('about.relationships', 'We believe in relationships before transactions.')} </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              <Trans i18nKey="auto.aboutpage.we_are_not_collecting_payments">We are not collecting payments online yet. Before accepting
                                        any support, we want to understand who you are, why this
                                        mission matters to you, and how your contribution can
                                        create the most learning impact.</Trans>
                                      </p>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              <Trans i18nKey="auto.aboutpage.this_ensures_that_every_partne">This ensures that every partner who joins us is genuinely
                                        aligned with our values — especially our commitment to
                                        keeping Jigyasu completely free and equal for all learners.</Trans>
                                      </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-slate-200 text-base font-semibold">
              <Trans i18nKey="auto.aboutpage.reach_out_to_us_at">Reach out to us at:</Trans>
                                      </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600
                           hover:bg-indigo-500 transition-colors text-white
                           font-bold px-6 py-4 rounded-2xl text-base
                           min-h-[56px]"
              >
                <span>📝</span>
                <span>{t('about.contact_form', 'Contact Us via Form')}</span>
              </button>
              
              <a
                href="mailto:contact@jigyasu.app"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-700
                           hover:bg-slate-600 transition-colors text-white
                           font-bold px-6 py-4 rounded-2xl text-base
                           min-h-[56px]"
              >
                <span>✉️</span>
                <span>{t('about.email_us', 'Email Us Directly')}</span>
              </a>
            </div>
          </div>

          {/* What to include */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {t('about.text.contact_desc', 'When you write to us, we would love to know:')}
            </p>
            <div className="space-y-3">
              {SUPPORT_QUESTIONS.map((q) => (
                <div
                  key={q.label}
                  className="flex items-start gap-3 bg-slate-800/60
                             rounded-xl p-4 border border-slate-700"
                >
                  <span className="text-xl flex-shrink-0">{q.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-sm mb-0.5">
                      {q.label}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {q.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ways to support */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {t('about.ways_to_support', 'Ways you can support us:')}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              {[
                t('about.support_ways.0', '💰 Individual monthly contribution'),
                t('about.support_ways.1', '🏢 Corporate CSR partnership'),
                t('about.support_ways.2', '🗣️ Funding a language translation'),
                t('about.support_ways.3', '📱 Sponsoring offline device access'),
                t('about.support_ways.4', '🏫 School or NGO partnership'),
                t('about.support_ways.5', '🌐 Infrastructure sponsorship'),
                t('about.support_ways.6', '🎓 Content or curriculum review'),
                t('about.support_ways.7', '📢 Spreading the word'),
              ].map((item) => (
                <div
                  key={item}
                  className="bg-slate-800 rounded-xl px-3 py-2
                             border border-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              <Trans i18nKey="auto.aboutpage.there_is_no_minimum_there_is_n">There is no minimum. There is no fixed format. The most
                                        valuable thing a partner can bring is genuine alignment
                                        with the mission. Everything else can be figured out together.</Trans>
                                      </p>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            CLOSING
        ═══════════════════════════════════════════ */}
        <motion.section
          {...FADE_UP}
          className="text-center space-y-5 py-8
                     border-t border-slate-100"
        >
          <div className="text-5xl">🦚</div>
          <div className="space-y-2">
            <p className="text-slate-700 text-base leading-relaxed max-w-lg mx-auto">
              <Trans i18nKey="auto.aboutpage.jigyasu_exists_for_the_child_w">Jigyasu exists for the child who could not afford tuition.
                                        For the parent who wants to help but feels unsure.
                                        For the adult who still wants to understand.
                                        For the learner who was never the problem —
                                        only the explanation was.</Trans>
                                      </p>
          </div>
          <p className="font-extrabold text-indigo-900 text-2xl tracking-tight">
            <Trans i18nKey="auto.aboutpage.install_wonder">Install Wonder.</Trans>
                                </p>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} <Trans i18nKey="auto.aboutpage.jigyasu">Jigyasu ·</Trans>{' '}
            <button
              onClick={() => navigate('/contact')}
              className="hover:text-indigo-500 transition-colors"
            >
              <span>{t('about.contact_form', 'Contact Us via Form')}</span>
            </button>
          </p>
        </motion.section>

      </div>
    </div>
  );
}
