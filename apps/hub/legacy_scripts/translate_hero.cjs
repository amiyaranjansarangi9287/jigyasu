const fs = require('fs');

const heroPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/Hero.tsx';
let code = fs.readFileSync(heroPath, 'utf8');

// Import useTranslation
code = code.replace(/import \{ useEffect, useState, useRef \} from 'react';/, "import { useEffect, useState, useRef } from 'react';\nimport { useTranslation } from 'react-i18next';");

// add hook inside Hero
code = code.replace(/const \{ count: activitiesCount, start: startActivities \} = useCountUp\(/, "const { t } = useTranslation();\n  const { count: activitiesCount, start: startActivities } = useCountUp(");

// Replace strings
code = code.replace(/>Kids Camp at Home<\/span>/, ">{t('maker_space.badge', 'Kids Camp at Home')}</span>");
code = code.replace(/Spark Creativity\.\{\s*'\s*'\s*\}/, "{t('maker_space.spark_creativity', 'Spark Creativity.')} {' '}");
code = code.replace(/>\s*Build Memories\.\s*<\/span>/, ">{t('maker_space.build_memories', 'Build Memories.')}</span>");
code = code.replace(/Discover \{totalActivities\}\+ hands-on activities across science, art, building, and outdoor adventures\.\s*Perfect for ages 3-12 — no screens, just pure creative fun!/, "{t('maker_space.description', { activitiesCount: totalActivities, defaultValue: 'Discover ' + totalActivities + '+ hands-on activities across science, art, building, and outdoor adventures. Perfect for ages 3-12 — no screens, just pure creative fun!' })}");
code = code.replace(/>Get Started<\/span>/, ">{t('maker_space.get_started', 'Get Started')}</span>");
code = code.replace(/>Explore Project Weeks<\/span>/, ">{t('maker_space.explore_weeks', 'Explore Project Weeks')}</span>");
code = code.replace(/>Activities<\/div>/, ">{t('maker_space.activities', 'Activities')}</div>");
code = code.replace(/>Creative Pillars<\/div>/, ">{t('maker_space.creative_pillars', 'Creative Pillars')}</div>");
code = code.replace(/>Screen-Free Fun<\/div>/, ">{t('maker_space.screen_free', 'Screen-Free Fun')}</div>");
code = code.replace(/>Scroll to explore<\/span>/, ">{t('maker_space.scroll_explore', 'Scroll to explore')}</span>");

fs.writeFileSync(heroPath, code);
console.log('Updated Hero.tsx');
