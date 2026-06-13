// Skip to main content link for keyboard users
import { useTranslation } from 'react-i18next';
export default function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
    >{t('auto.learning.s872_skip_to_main_content', 'Skip to main content')}</a>
  );
}
