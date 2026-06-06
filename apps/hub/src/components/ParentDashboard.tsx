import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@jigyasu/storage';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">{t('no_profile_found', 'No profile found. Please set up a profile first.')}</p>
          <button onClick={() => navigate('/')} className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold">
            {t('go_home', 'Go Home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-slate-800">{t('parent_dashboard', 'Parent Dashboard')}</h1>
        <button onClick={() => navigate('/')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300">
          {t('back', 'Back')}
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-8">
          <span className="text-6xl" aria-hidden="true">{profile.avatar}</span>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-slate-500 capitalize">{profile.ageTier?.replace('-', ' ') || 'Unknown'} {t('tier', 'Tier')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
            <h3 className="text-lg font-bold text-sky-800 mb-2">{t('time_spent', 'Time Spent Learning')}</h3>
            <p className="text-3xl font-black text-sky-600">{localStorage.getItem('jigyasu_time_spent') || '0'} <span className="text-sm font-medium text-sky-700">{t('minutes', 'minutes')}</span></p>
            <p className="text-sm text-sky-600 mt-2">{t('tracked_locally', 'Tracked securely on your device')}</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-green-800 mb-2">{t('modules_completed', 'Modules Completed')}</h3>
            <p className="text-3xl font-black text-green-600">{localStorage.getItem('jigyasu_completed_modules') || '0'}</p>
            <p className="text-sm text-green-600 mt-2">{t('tracked_locally', 'Tracked securely on your device')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('account_management', 'Account Management')}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('/profile')} className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors">
            {t('edit_profile', 'Edit Profile')}
          </button>
          <button 
            onClick={() => setShowClearDataConfirm(true)}
            className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-200"
          >
            {t('clear_data', 'Clear All Data')}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showClearDataConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClearDataConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-modal-in">
            <div className="text-center mb-6">
              <div className="w-16 min-h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('clear_data_confirm_title', 'Clear All Data?')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('clear_data_confirm_desc', 'This will permanently delete all your progress, achievements, and profile data. This action cannot be undone.')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDataConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    setShowClearDataConfirm(false);
                    navigate('/');
                  } catch (error) {
                    console.error('Failed to clear data:', error);
                  }
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                {t('confirm_clear', 'Clear Data')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
