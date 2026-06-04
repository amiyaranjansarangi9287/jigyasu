import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@jigyasu/storage';
import { useLearnerStore } from '../learnos/store';
import { useState } from 'react';
import SharedPhoneMode from './SharedPhoneMode';

interface WelcomeSectionProps {
  profile: { name: string; avatar: string };
}

export default function WelcomeSection({ profile }: WelcomeSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getLastModule = useLearnerStore((state) => state.getLastModule);
  const [showSharedPhoneMode, setShowSharedPhoneMode] = useState(false);
  
  const lastModule = getLastModule();

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 shadow-lg z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{profile.avatar}</span>
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{t('welcome_back', 'Welcome back')}, {profile.name}!</h1>
            <p className="text-indigo-100 font-medium">{t('ready_to_continue', 'Ready to continue your adventure?')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSharedPhoneMode(true)}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label="Switch profile"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowSharedPhoneMode(true);
              }
            }}
          >
            <span className="text-xl">👥</span>
            <span className="hidden sm:inline">{t('switch_profile', 'Switch Profile')}</span>
          </button>
          
          {lastModule && (
            <button 
              onClick={() => navigate(`/${lastModule.world}/${lastModule.path}`)}
              className="bg-white hover:bg-indigo-50 text-indigo-700 font-bold py-4 px-8 rounded-full shadow-xl transition-all flex items-center gap-3 text-lg transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
            >
              <span aria-hidden="true" className="text-2xl">🚀</span> 
              <span>{t('continue_learning', 'Continue Learning')}</span>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-semibold">
                {t('resume', 'Resume')}
              </span>
            </button>
          )}
          
          {!lastModule && (
            <button 
              onClick={() => navigate('/home')}
              className="bg-white hover:bg-indigo-50 text-indigo-700 font-bold py-4 px-8 rounded-full shadow-xl transition-all flex items-center gap-3 text-lg transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
            >
              <span aria-hidden="true" className="text-2xl">🎯</span> 
              <span>{t('start_learning', 'Start Learning')}</span>
            </button>
          )}
        </div>
      </div>

      {showSharedPhoneMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{t('switch_profile', 'Switch Profile')}</h2>
              <button
                onClick={() => setShowSharedPhoneMode(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <SharedPhoneMode />
          </div>
        </div>
      )}
    </div>
  );
}
