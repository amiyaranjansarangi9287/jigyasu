const fs = require('fs');

const path = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/CampWeeksPreview.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add import
if (!code.includes("import { useTranslation }")) {
  code = code.replace(/import { useReveal } from '..\/hooks\/useReveal';/, "import { useReveal } from '../hooks/useReveal';\nimport { useTranslation } from 'react-i18next';");
}

// Add hook
if (!code.includes("const { t } = useTranslation();")) {
  code = code.replace(/const { ref, isVisible } = useReveal<HTMLDivElement>\(\);/, "const { ref, isVisible } = useReveal<HTMLDivElement>();\n  const { t } = useTranslation();");
}

code = code.replace(/>\s*Completed\s*<\/span>/, ">{t('camp_weeks.completed', 'Completed')}</span>");
code = code.replace(/>\s*In Progress\s*<\/span>/, ">{t('camp_weeks.in_progress', 'In Progress')}</span>");

code = code.replace(/if \(status === 'completed'\) return 'Do Again';/, "if (status === 'completed') return t('camp_weeks.do_again', 'Do Again');");
code = code.replace(/if \(status === 'in-progress'\) return 'Continue';/, "if (status === 'in-progress') return t('camp_weeks.continue', 'Continue');");
code = code.replace(/return 'Start Week';/, "return t('camp_weeks.start_week', 'Start Week');");

code = code.replace(/>\s*Project Weeks\s*<\/span>/, ">{t('camp_weeks.project_weeks', 'Project Weeks')}</span>");
code = code.replace(/>\s*Structured Project Journeys\s*<\/h2>/, ">{t('camp_weeks.structured_journeys', 'Structured Project Journeys')}</h2>");
code = code.replace(/>\s*Follow our curated 5-day project plans\. Perfect for school breaks, weekends, or whenever you need structured hands-on fun!\s*<\/p>/, ">{t('camp_weeks.follow_curated', 'Follow our curated 5-day project plans. Perfect for school breaks, weekends, or whenever you need structured hands-on fun!')}</p>");

code = code.replace(/>5 days of activities<\/p>/, ">{t('camp_weeks.days_of_activities', '5 days of activities')}</p>");

code = code.replace(/Day \{day\.day\}/g, "{t('camp_weeks.day', 'Day')} {day.day}");

code = code.replace(/\{week\.ageRange === 'all' \? 'All ages' : `Ages \$\{week\.ageRange\}`\}/g, "{week.ageRange === 'all' ? t('camp_weeks.all_ages', 'All ages') : `${t('camp_weeks.ages', 'Ages')} ${week.ageRange}`}");

fs.writeFileSync(path, code);
console.log('Updated CampWeeksPreview.tsx');
