// src/crosscutting/AboutPage.tsx
// Route: /about
// Static component — text in i18n for future translation

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VALUES = [
  {
    title: 'Wonder',
    emoji: '✨',
    desc: 'We begin with questions, not answers. Every concept starts with a mystery, not a definition. We protect the natural curiosity every child is born with.',
  },
  {
    title: 'Equity',
    emoji: '⚖️',
    desc: 'One platform. For everyone. The child in a village in Odisha and the child in an apartment in Bengaluru should see the same beautiful concept, the same simulation, the same joy.',
  },
  {
    title: 'Respect',
    emoji: '🤝',
    desc: 'No grades, no judgment, no shame. Every learner is equal. The 6-year-old discovering colours. The 40-year-old who always wanted to understand gravity. Both are welcome here.',
  },
  {
    title: 'Patience',
    emoji: '🌱',
    desc: 'Learning takes the time it takes. No countdown timers on understanding. No pressure to move faster. The concept waits. Always.',
  },
  {
    title: 'Joy',
    emoji: '🎉',
    desc: 'If learning is not joyful, something is wrong with the design — not with the learner. Science is joyful. Mathematics is joyful. Discovery is joyful.',
  },
  {
    title: 'Identity',
    emoji: '🇮🇳',
    desc: 'Indian scientists, Indian examples, Indian languages, Indian realities. This is not a global platform translated for India. It is built for India, from India.',
  },
];

const DIFFERENCE_POINTS = [
  {
    emoji: '🌐',
    title: 'Free by Design',
    desc: 'There is no "poor version" and "rich version" of learning on Jigyasu. Everything is free. Forever. For everyone. This is not a feature. It is a principle.',
  },
  {
    emoji: '📱',
    title: 'Website First',
    desc: 'A link shared through WhatsApp can reach a child in a village. No installation, no storage pressure, no app store barrier. Just open and learn.',
  },
  {
    emoji: '🗣️',
    title: '22 Indian Languages',
    desc: 'English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Odia, and all 22 scheduled languages of India. Understanding begins in the language closest to the learner. Every language added means more learners included.',
  },
  {
    emoji: '📴',
    title: 'Offline First',
    desc: 'Designed to work on 2G connections and after the internet goes away. Because in rural India, learning cannot wait for reliable internet.',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'For Every Age',
    desc: 'Ages 2 to 80+. Children, parents, grandparents, adults who left school early but never stopped wondering. There is no age limit on understanding.',
  },
  {
    emoji: '🫀',
    title: 'Visual and Interactive',
    desc: 'You do not just watch. You wonder, test, discover, and explain. Every concept moves, responds, and connects to real life.',
  },
];

const SUPPORT_QUESTIONS = [
  {
    label: 'The Who',
    emoji: '👤',
    desc: 'A brief introduction — individual, organisation, educator, or philanthropist.',
  },
  {
    label: 'The Why',
    emoji: '💡',
    desc: 'Why Jigyasu? Why does equitable education in India matter to you personally?',
  },
  {
    label: 'The How',
    emoji: '🛤️',
    desc: 'How do you envision contributing? Individual support, CSR partnership, language translation sponsorship, device access for schools, or something else entirely?',
  },
];

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

export default function AboutPage() {
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
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-indigo-700 font-extrabold
                     text-base hover:text-indigo-900 transition-colors"
        >
          <span className="text-xl">�</span>
          <span>Jigyasu</span>
        </button>
        <div className="flex gap-4 text-sm text-slate-500">
          <a href="#mission" className="hover:text-indigo-700 transition-colors hidden sm:block">
            Mission
          </a>
          <a href="#difference" className="hover:text-indigo-700 transition-colors hidden sm:block">
            What We Built
          </a>
          <a href="#support" className="hover:text-indigo-700 transition-colors">
            Support
          </a>
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
          <div className="text-7xl">�</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight
                         text-indigo-900 leading-tight">
            Jigyasu
          </h1>
          <p className="text-2xl font-bold text-indigo-500">
            Install Wonder.
          </p>
          <p className="text-lg text-slate-500 italic max-w-xl mx-auto leading-relaxed">
            "Every child is born a scientist.
            They ask why. They test everything.
            Then school happens — and the why gets quieter.
            We are here to keep the why loud. Forever."
          </p>
        </motion.header>

        {/* ═══════════════════════════════════════════
            THE PROBLEM
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="space-y-5 mb-16">
          <h2 className="text-2xl font-bold text-indigo-900">
            Why We Are Building This
          </h2>

          <p className="text-lg leading-relaxed text-slate-700">
            In many parts of India, education is still not equally accessible.
            Some children study in overcrowded classrooms.
            Some share one phone with the entire family.
            Some learn in a language that is not the language they think in.
            Some cannot afford coaching, tutors, or premium apps.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            And outside of childhood — many adults carry questions from school
            that were never answered clearly. Questions they felt embarrassed
            to ask. Concepts that never quite made sense in the way they were taught.
          </p>
          <p className="text-lg leading-relaxed text-slate-700 font-semibold">
            People do not hate learning.
            They hate feeling confused, judged, or left behind.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            When an idea is shown clearly — when it moves, when it responds
            to your touch, when it connects to something you already know
            from daily life — learning becomes natural again.
            That is what Jigyasu is built for.
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
            Our Mission
          </h2>
          <p className="text-lg font-semibold text-indigo-800 leading-relaxed">
            Every child in India — and every adult who missed their chance —
            deserves to experience the joy of truly understanding something.
            Not memorizing. Understanding.
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
            This is not a feature. It is the entire reason Jigyasu exists.
          </p>
        </motion.section>

        {/* ═══════════════════════════════════════════
            WHO IT IS FOR
        ═══════════════════════════════════════════ */}
        <motion.section {...FADE_UP} className="mb-16 space-y-5">
          <h2 className="text-2xl font-bold text-indigo-900">
            Who Jigyasu Is For
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
            What We Believe
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
            What We Built — and Why
          </h2>
          <div className="space-y-4">
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
              Built for India
            </h2>
          </div>
          <p className="text-orange-800 text-base leading-relaxed">
            This is not a global platform lightly translated for India.
            It is built from India, for Indian learners — and open to everyone.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {[
              'Rupees, not dollars',
              'Rotis and chai, not only pizzas',
              'Monsoons, ISRO, cricket, Indian markets',
              'Aryabhata, Ramanujan, C.V. Raman, J.C. Bose',
              'APJ Abdul Kalam, Sushruta, Brahmagupta',
              'All 22 scheduled Indian languages supported',
              'Designed for 2G and shared phones',
              'Offline-first for rural learners',
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
            How We Plan to Sustain This
          </h2>
          <p className="text-slate-700 text-base leading-relaxed">
            Jigyasu is mission-first. The goal is never to make education expensive.
            The goal is to keep learning free and make the platform sustainable
            through a simple principle:
          </p>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <p className="text-indigo-800 font-semibold text-base leading-relaxed">
              Those who can support the mission help keep it free
              for those who cannot.
            </p>
            <p className="text-indigo-600 text-sm mt-2 leading-relaxed">
              The child who cannot pay and the child who can pay will always
              see the same platform, the same concepts, the same quality.
              There is no premium version. There is no locked content.
              There is only Jigyasu — for everyone.
            </p>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Support may come through individuals who care about equity in
            education, organisations with a shared mission, CSR partnerships,
            government grants, or institutional collaborations. All of these
            fund one thing only: access for learners who need it most.
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
            <h2 className="text-2xl font-bold">
              Join the Mission
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              If you feel connected to what Jigyasu is trying to do —
              if the idea of a free, visual, multilingual learning platform
              for every Indian child and adult resonates with you —
              we would love to hear from you.
            </p>
          </div>

          {/* Key statement */}
          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <p className="text-indigo-300 font-bold text-base mb-2">
              We believe in relationships before transactions.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              We are not collecting payments online yet. Before accepting
              any support, we want to understand who you are, why this
              mission matters to you, and how your contribution can
              create the most learning impact.
            </p>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              This ensures that every partner who joins us is genuinely
              aligned with our values — especially our commitment to
              keeping Jigyasu completely free and equal for all learners.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-slate-200 text-base font-semibold">
              Reach out to us at:
            </p>
            <a
              href="mailto:ars.jobs2019@gmail.com"
              className="inline-flex items-center gap-2 bg-indigo-600
                         hover:bg-indigo-500 transition-colors text-white
                         font-bold px-6 py-4 rounded-2xl text-base
                         min-h-[56px]"
            >
              <span>✉️</span>
              <span>ars.jobs2019@gmail.com</span>
            </a>
          </div>

          {/* What to include */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              When you write to us, we would love to know:
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
              Ways you can support us:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              {[
                '💰 Individual monthly contribution',
                '🏢 Corporate CSR partnership',
                '🗣️ Funding a language translation',
                '📱 Sponsoring offline device access',
                '🏫 School or NGO partnership',
                '🌐 Infrastructure sponsorship',
                '🎓 Content or curriculum review',
                '📢 Spreading the word',
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
              There is no minimum. There is no fixed format. The most
              valuable thing a partner can bring is genuine alignment
              with the mission. Everything else can be figured out together.
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
          <div className="text-5xl">�</div>
          <div className="space-y-2">
            <p className="text-slate-700 text-base leading-relaxed max-w-lg mx-auto">
              Jigyasu exists for the child who could not afford tuition.
              For the parent who wants to help but feels unsure.
              For the adult who still wants to understand.
              For the learner who was never the problem —
              only the explanation was.
            </p>
          </div>
          <p className="font-extrabold text-indigo-900 text-2xl tracking-tight">
            Install Wonder.
          </p>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Jigyasu ·{' '}
            <a
              href="mailto:ars.jobs2019@gmail.com"
              className="hover:text-indigo-500 transition-colors"
            >
              ars.jobs2019@gmail.com
            </a>
          </p>
        </motion.section>

      </div>
    </div>
  );
}
