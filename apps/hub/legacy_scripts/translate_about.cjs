const fs = require('fs');

const aboutPath = 'd:/vision_agentic/jigyasu/apps/hub/src/components/AboutPage.tsx';
let code = fs.readFileSync(aboutPath, 'utf8');

// Import hook
code = code.replace(/import { useNavigate } from 'react-router-dom';/, "import { useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");

// Make arrays dynamic inside component by moving them or mapping
code = code.replace(/const VALUES = \[/, "const VALUES_DATA = [");
code = code.replace(/const DIFFERENCE_POINTS = \[/, "const DIFFERENCE_POINTS_DATA = [");
code = code.replace(/const SUPPORT_QUESTIONS = \[/, "const SUPPORT_QUESTIONS_DATA = [");

code = code.replace(/export default function AboutPage\(\) \{/, `export default function AboutPage() {
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
      title: t('about.differences.2.title', '6 Indian Languages'),
      desc: t('about.differences.2.desc', 'English, Hindi, Tamil...'),
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
`);

// Replace text nodes
code = code.replace(/>\s*Mission\s*<\/a>/, "> {t('about.mission', 'Mission')} </a>");
code = code.replace(/>\s*What We Built\s*<\/a>/, "> {t('about.what_we_built', 'What We Built')} </a>");
code = code.replace(/>\s*Support\s*<\/a>/, "> {t('about.support', 'Support')} </a>");

code = code.replace(/>\s*Install Wonder\.\s*<\/p>/, "> {t('about.tagline', 'Install Wonder.')} </p>");
code = code.replace(/"Every child is born a scientist\.\\n\s*We just beat it out of them\."/s, "{t('about.quote', '\\\"Every child is born a scientist. We just beat it out of them.\\\"')}");
code = code.replace(/— Carl Sagan/, "{t('about.quote_author', '— Carl Sagan')}");

code = code.replace(/Jigyasu is not just another EdTech platform\. It is an attempt to\s*redefine how learning happens in India\./, "{t('about.intro_p1', 'Jigyasu is not just another EdTech platform. It is an attempt to redefine how learning happens in India.')}");
code = code.replace(/We built it because we believe curiosity is not a privilege, it is a\s*fundamental right\./, "{t('about.intro_p2', 'We built it because we believe curiosity is not a privilege, it is a fundamental right.')}");

code = code.replace(/>\s*Core Principles\s*<\/h2>/, "> {t('about.values_title', 'Core Principles')} </h2>");
code = code.replace(/>\s*How We Are Different\s*<\/h2>/, "> {t('about.diff_title', 'How We Are Different')} </h2>");
code = code.replace(/>\s*Support Jigyasu\s*<\/h2>/, "> {t('about.support_title', 'Support Jigyasu')} </h2>");

code = code.replace(/Jigyasu is being built by a small passionate team who believe that\s*every child in India has the right to access world-class, joyful,\s*discovery-based learning for free\./, "{t('about.support_p1', 'Jigyasu is being built by a small passionate team...')}");
code = code.replace(/Our vision is to put the magic of science and mathematics into the\s*hands of every Indian child, for free\. If this moves you, we\s*would love to hear from you\./, "{t('about.support_p2', 'Our vision is to put the magic...')}");
code = code.replace(/>\s*Email us at:\s*<\/p>/, "> {t('about.email_us', 'Email us at:')} </p>");

code = code.replace(/>\s*Join the Mission\s*<\/h2>/, "> {t('about.join_mission', 'Join the Mission')} </h2>");
code = code.replace(/>\s*We believe in relationships before transactions\.\s*<\/p>/, "> {t('about.relationships', 'We believe in relationships before transactions.')} </p>");


fs.writeFileSync(aboutPath, code);
console.log('Updated AboutPage.tsx');
