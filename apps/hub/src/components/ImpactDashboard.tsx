// src/components/ImpactDashboard.tsx
// Impact Dashboard - Shows learning progress and impact metrics
// Purpose: Track and display platform impact for sustainability and partnerships

import { useState, useEffect } from 'react';
import { db } from '../learnos/db';
import type { ConceptProgress } from '../learnos/types/shared';
import { useTranslation, Trans } from 'react-i18next';
import { useFormatNumber } from '../hooks/useFormatNumber';

export default function ImpactDashboard() {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [totalLearners, setTotalLearners] = useState(0);
  const [modulesCompleted, setModulesCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [languagesUsed, setLanguagesUsed] = useState<Record<string, number>>({});
  const [ageGroups, setAgeGroups] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const loadImpactData = async () => {
      try {
        // Get all progress data
        const allProgress = await db.conceptProgress.toArray();
        
        // Calculate metrics
        const completed = allProgress.filter(p => p.status === 'completed').length;
        setModulesCompleted(completed);
        
        const totalTime = allProgress.reduce((sum, p) => sum + (p.timeSpentSeconds || 0), 0);
        setTotalTimeSpent(totalTime);
        
        // Get sessions for language and age group data
        const sessions = await db.sessions.toArray();
        setTotalLearners(sessions.length);
        
        const langs: Record<string, number> = {};
        const ages: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sessions.forEach((session: any) => {
          if (session.language) {
            langs[session.language] = (langs[session.language] || 0) + 1;
          }
          if (session.ageGroup) {
            ages[session.ageGroup] = (ages[session.ageGroup] || 0) + 1;
          }
        });
        
        setLanguagesUsed(langs);
        setAgeGroups(ages);
      } catch (error) {
        console.error('Failed to load impact data:', error);
      }
    };

    loadImpactData();
    const interval = setInterval(loadImpactData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 left-6 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold z-[100] hover:bg-green-700 transition-colors"
        aria-label="Open Impact Dashboard"
      >
        📈 {t('floating_buttons.impact', 'Impact')}
      </button>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-green-900/95 z-[100] p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white"><Trans i18nKey="auto.impactdashboard.impact_dashboard">Impact Dashboard</Trans></h1>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            aria-label="Close dashboard"
          >
            <Trans i18nKey="auto.impactdashboard.close">✕ Close</Trans>
                                </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2"><Trans i18nKey="auto.impactdashboard.total_learners">Total Learners</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(totalLearners)}</p>
            <p className="text-green-300 text-xs mt-1"><Trans i18nKey="auto.impactdashboard.unique_sessions">Unique sessions</Trans></p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2"><Trans i18nKey="auto.impactdashboard.modules_completed">Modules Completed</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(modulesCompleted)}</p>
            <p className="text-green-300 text-xs mt-1"><Trans i18nKey="auto.impactdashboard.successfully_finished">Successfully finished</Trans></p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2"><Trans i18nKey="auto.impactdashboard.total_learning_time">Total Learning Time</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatTime(totalTimeSpent)}</p>
            <p className="text-green-300 text-xs mt-1"><Trans i18nKey="auto.impactdashboard.time_invested">Time invested</Trans></p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2"><Trans i18nKey="auto.impactdashboard.languages_used">Languages Used</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(Object.keys(languagesUsed).length)}</p>
            <p className="text-green-300 text-xs mt-1"><Trans i18nKey="auto.impactdashboard.supported_languages">Supported languages</Trans></p>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4"><Trans i18nKey="auto.impactdashboard.language_distribution">Language Distribution</Trans></h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(languagesUsed).map(([lang, count]) => (
              <div key={lang} className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{formatNumber(count)}</p>
                <p className="text-green-200 text-xs font-bold uppercase">{lang}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4"><Trans i18nKey="auto.impactdashboard.age_group_distribution">Age Group Distribution</Trans></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(ageGroups).map(([age, count]) => (
              <div key={age} className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{formatNumber(count)}</p>
                <p className="text-green-200 text-xs font-bold uppercase">{age}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Alignment */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4"><Trans i18nKey="auto.impactdashboard.mission_alignment">Mission Alignment</Trans></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2"><Trans i18nKey="auto.impactdashboard.equity_value">Equity Value</Trans></h3>
              <p className="text-white text-sm">
                <Trans i18nKey="auto.impactdashboard.serving_learners_across">Serving learners across</Trans> {formatNumber(Object.keys(languagesUsed).length)} <Trans i18nKey="auto.impactdashboard.languages_and">languages and</Trans> {formatNumber(Object.keys(ageGroups).length)} <Trans i18nKey="auto.impactdashboard.age_groups">age groups</Trans>
                                            </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2"><Trans i18nKey="auto.impactdashboard.wonder_value">Wonder Value</Trans></h3>
              <p className="text-white text-sm">
                {formatNumber(modulesCompleted)} <Trans i18nKey="auto.impactdashboard.modules_completed_through_curi">modules completed through curiosity-driven learning</Trans>
                                            </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2"><Trans i18nKey="auto.impactdashboard.patience_value">Patience Value</Trans></h3>
              <p className="text-white text-sm">
                {formatTime(totalTimeSpent)} <Trans i18nKey="auto.impactdashboard.of_patient_self_paced_learning">of patient, self-paced learning</Trans>
                                            </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2"><Trans i18nKey="auto.impactdashboard.identity_value">Identity Value</Trans></h3>
              <p className="text-white text-sm">
                <Trans i18nKey="auto.impactdashboard.indian_first_platform_serving_">Indian-first platform serving Indian learners</Trans>
                                            </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <Trans i18nKey="auto.impactdashboard.close_dashboard">Close Dashboard</Trans>
                                </button>
        </div>
      </div>
    </div>
  );
}
