// CampCraft - Footer

import { pillars } from '../data/categories';
import { useTranslation, Trans } from 'react-i18next';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">�</span>
              <span className="text-2xl font-bold text-white"><Trans i18nKey="auto.footer.jigyasu">Jigyasu</Trans></span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {t('footer.desc', 'Free visual STEM learning for every child in India. Works offline. 6 Indian languages.')}
            </p>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-white font-bold mb-4">{t('kidscamp.footer.activities', 'Activities')}</h4>
            <ul className="space-y-2">
              {pillars.map((pillar) => (
                <li key={pillar.id}>
                  <button
                    onClick={() => onNavigate(`pillar-${pillar.id}`)}
                    className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                  >
                    <span>{pillar.icon}</span>
                    {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                              <span>{t(`pillar_${pillar.id}` as any, pillar.name)}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('activities')}
                  className="hover:text-orange-400 transition-colors"
                >{t('kidscamp.footer.all_activities', 'All Activities →')}</button>
              </li>
            </ul>
          </div>


          {/* Information */}
          <div>
            <h4 className="text-white font-bold mb-4">{t('footer.information', 'Information')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="hover:text-orange-400 transition-colors">{t('footer.privacy', 'Privacy')}</a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-400 transition-colors">{t('footer.about', 'About Us')}</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-400 transition-colors">{t('footer.contact', 'Contact Us')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 items-center sm:items-start text-sm">
            <p className="text-gray-500">
              © {currentYear} <Trans i18nKey="auto.footer.jigyasu">Jigyasu.</Trans> {t('footer.made_with', 'Made with ❤️ for India.')}
            </p>
            <p className="text-xs text-gray-600"><Trans i18nKey="auto.footer.developed_by">Developed by</Trans> <span className="font-semibold text-gray-400"><Trans i18nKey="auto.footer.annapurna_agentic_solutions">Annapurna Agentic Solutions</Trans></span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

