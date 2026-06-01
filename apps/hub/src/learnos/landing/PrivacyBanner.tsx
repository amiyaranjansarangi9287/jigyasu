import { useTranslation } from 'react-i18next';
import OwlLogo from './OwlLogo';

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export default function PrivacyBanner({ onAccept, onDecline }: Props) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 md:p-6">
      <div
        className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-white p-5 shadow-2xl shadow-orange-300/30 md:p-6"
        style={{ animation: "pop 0.4s ease-out" }}
        role="dialog"
        aria-labelledby="privacy-title"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex-none">
            <OwlLogo size={44} />
          </div>
          <div className="flex-1">
            <h3 id="privacy-title" className="font-display text-base font-bold text-slate-900">
              {t('landing.privacy.title')}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {t('landing.privacy.description')}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={onAccept}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-brand-dark active:scale-95"
              >
                {t('landing.privacy.accept')}
              </button>
              <button
                onClick={onDecline}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 active:scale-95"
              >
                {t('landing.privacy.decline')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
