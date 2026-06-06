import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '../learnos/store/learnerStore';
import { Button } from '@jigyasu/ui';

const AVATARS = ['rocket', 'robot', 'unicorn', 'dino', 'lion', 'star', 'alien', 'fox'] as const;
const AVATAR_EMOJI: Record<(typeof AVATARS)[number], string> = {
  rocket: '\u{1F680}',
  robot: '\u{1F916}',
  unicorn: '\u{1F984}',
  dino: '\u{1F996}',
  lion: '\u{1F981}',
  star: '\u{1F31F}',
  alien: '\u{1F47E}',
  fox: '\u{1F98A}',
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'kn', label: 'Kannada' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'od', label: 'Odia' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
];

interface OnboardingWizardProps {
  onComplete: (name: string, avatar: string, lang: string, ageTier: string) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { t, i18n: i18nHook } = useTranslation();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<(typeof AVATARS)[number]>('robot');
  const [lang, setLang] = useState(i18nHook.resolvedLanguage || i18nHook.language || 'en');
  const setLearnerStoreLanguage = useLearnerStore(state => state.setLanguage);
  const [ageTier, setAgeTier] = useState('6-8');
  const isChild = ['3-5', '6-8', '9-12', '13-17'].includes(ageTier);
  const [parentConsent, setParentConsent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const finalConsent = isChild ? parentConsent : true;
    
    if (trimmedName && finalConsent) {
      const finalAvatar = isChild ? AVATAR_EMOJI[avatar] : trimmedName.charAt(0).toUpperCase();
      // Map age tier strings to age group IDs
      const ageGroupMap: Record<string, string> = {
        '3-5': 'tiny',
        '6-8': 'early',
        '9-12': 'lab',
        '13-17': 'academy',
        '18+': 'adult',
      };
      const mappedAgeTier = ageGroupMap[ageTier] || ageTier;
      onComplete(trimmedName, finalAvatar, lang, mappedAgeTier);
    }
  };

  const wizardContent = (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <div className={`bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-4 relative ${isChild ? 'border-sky-400' : 'border-slate-800'}`}>
        <div className={`absolute -top-4 -right-4 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 ${isChild ? 'bg-green-500' : 'bg-slate-700'}`}>
          <span aria-hidden="true">{'\u{1F6E1}\uFE0F'}</span> {t('private_badge', '100% Private (Saved Locally)')}
        </div>

        <div className="flex justify-center mb-6">
          <div className={`w-24 min-h-24 rounded-full flex items-center justify-center text-5xl shadow-inner ${isChild ? 'bg-sky-100' : 'bg-slate-100'}`} aria-hidden="true">
            {isChild ? '\u{1F99A}' : '\u{1F393}'}
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-slate-800 mb-2">{t('welcome_title', 'Welcome to Jigyasu!')}</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">{t('setup_profile', "Let's set up your local profile (no cloud tracking!)")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="profile-language" className="block text-sm font-bold !text-slate-700 mb-2">
                {t('language', 'Language')}
              </label>
              <select
                id="profile-language"
                value={lang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  
                  setLang(newLang);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setLearnerStoreLanguage(newLang as any);
                  i18nHook.changeLanguage(newLang).then(() => {
                  }).catch(e => {
                  });
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all outline-none text-lg font-medium mb-6"
              >
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="profile-nickname" className="block text-sm font-bold !text-slate-700 mb-2">
                {t('enter_name', "What's your nickname?")}
              </label>
              <input
                id="profile-nickname"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all outline-none text-lg font-medium"
                placeholder={t('enter_name_placeholder', 'e.g. Kiran')}
                autoComplete="off"
                maxLength={24}
                required
              />
            </div>



            <div>
              <label htmlFor="profile-age" className="block text-sm font-bold !text-slate-700 mb-2">
                {t('age_group', 'Age Group')}
              </label>
              <select
                id="profile-age"
                value={ageTier}
                onChange={(event) => setAgeTier(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all outline-none text-lg font-medium"
              >
                <option value="3-5">{t('age_3_5', '3-5 years')}</option>
                <option value="6-8">{t('age_6_8', '6-8 years')}</option>
                <option value="9-12">{t('age_9_12', '9-12 years')}</option>
                <option value="13-17">{t('age_13_17', '13-17 years')}</option>
                <option value="18+">{t('age_18_plus', 'Adult (18+)')}</option>
              </select>
            </div>

            {isChild && (
              <div>
                <p className="block text-sm font-bold text-slate-700 mb-2">{t('choose_avatar', 'Choose your avatar')}</p>
                <div className="flex flex-wrap gap-3 justify-center" role="radiogroup" aria-label="Avatar selection">
                  {AVATARS.map((avatarKey) => (
                    <button
                      key={avatarKey}
                      type="button"
                      role="radio"
                      aria-label={`Choose ${avatarKey} avatar${avatar === avatarKey ? ', currently selected' : ''}`}
                      aria-checked={avatar === avatarKey}
                      name="avatar-selection"
                      onClick={() => setAvatar(avatarKey)}
                      className={`w-14 min-h-14 text-3xl rounded-full flex items-center justify-center transition-all ${
                        avatar === avatarKey ? 'bg-sky-100 ring-4 ring-sky-400 scale-110' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span aria-hidden="true">{AVATAR_EMOJI[avatarKey]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isChild && (
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  id="parent-consent-checkbox"
                  type="checkbox"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                  className="w-6 h-6 rounded text-sky-500 focus:ring-sky-400 focus:ring-offset-2 border-slate-300"
                  required={isChild}
                />
                <label htmlFor="parent-consent-checkbox" className="text-sm font-medium !text-slate-700 cursor-pointer select-none">
                  {t('parent_permission', "I have my parent/guardian's permission to create a local profile.")}
                </label>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                variant={isChild ? 'info' : 'dark'}
                size="lg"
                disabled={!name.trim() || (isChild && !parentConsent)}
                className="px-10 rounded-full"
              >
                {t('lets_go', "Let's Go!")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(wizardContent, document.body);
  }
  return wizardContent;
}
