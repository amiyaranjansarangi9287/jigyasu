// src/components/ImpactDashboard.tsx
// Impact Dashboard - Shows learning progress and impact metrics
// Purpose: Track and display platform impact for sustainability and partnerships

import { useState, useEffect } from 'react';
import { db } from '../learnos/db';
import type { ConceptProgress } from '../learnos/types/shared';
import { useTranslation } from 'react-i18next';

export default function ImpactDashboard() {
  const { t } = useTranslation();
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
          <h1 className="text-3xl font-bold text-white">Impact Dashboard</h1>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            aria-label="Close dashboard"
          >
            ✕ Close
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2">Total Learners</h3>
            <p className="text-4xl font-bold text-white">{totalLearners}</p>
            <p className="text-green-300 text-xs mt-1">Unique sessions</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2">Modules Completed</h3>
            <p className="text-4xl font-bold text-white">{modulesCompleted}</p>
            <p className="text-green-300 text-xs mt-1">Successfully finished</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2">Total Learning Time</h3>
            <p className="text-4xl font-bold text-white">{formatTime(totalTimeSpent)}</p>
            <p className="text-green-300 text-xs mt-1">Time invested</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="text-green-200 text-sm font-bold mb-2">Languages Used</h3>
            <p className="text-4xl font-bold text-white">{Object.keys(languagesUsed).length}</p>
            <p className="text-green-300 text-xs mt-1">Supported languages</p>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Language Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(languagesUsed).map(([lang, count]) => (
              <div key={lang} className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-green-200 text-xs font-bold uppercase">{lang}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Age Group Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(ageGroups).map(([age, count]) => (
              <div key={age} className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-green-200 text-xs font-bold uppercase">{age}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Alignment */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Mission Alignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2">Equity Value</h3>
              <p className="text-white text-sm">
                Serving learners across {Object.keys(languagesUsed).length} languages and {Object.keys(ageGroups).length} age groups
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2">Wonder Value</h3>
              <p className="text-white text-sm">
                {modulesCompleted} modules completed through curiosity-driven learning
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2">Patience Value</h3>
              <p className="text-white text-sm">
                {formatTime(totalTimeSpent)} of patient, self-paced learning
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-200 font-bold mb-2">Identity Value</h3>
              <p className="text-white text-sm">
                Indian-first platform serving Indian learners
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
