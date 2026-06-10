// src/components/MasteryIndicator.tsx
// Shame-Free Mastery Indicators
// Mission Alignment: Respect Value - "No grades, no judgment, no shame"

import React, { useMemo } from 'react';
import { Trans } from "react-i18next";

export interface MasteryIndicatorProps {
  mastered: number;
  total: number;
  showDetails?: boolean;
}

export default function MasteryIndicator({ mastered, total, showDetails = false }: MasteryIndicatorProps) {
  const masteryLevel = useMemo(() => {
    if (total === 0) return 'beginning';
    const ratio = mastered / total;
    if (ratio < 0.3) return 'beginning';
    if (ratio < 0.6) return 'growing';
    if (ratio < 0.9) return 'blooming';
    return 'flourishing';
  }, [mastered, total]);

  const masteryConfig = useMemo(() => {
    const configs = {
      beginning: {
        emoji: '🌱',
        message: 'Beginning your journey',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      },
      growing: {
        emoji: '🌿',
        message: 'Making progress',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
      },
      blooming: {
        emoji: '🌳',
        message: 'Almost there',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      },
      flourishing: {
        emoji: '🌳',
        message: 'Understanding deeply',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
      },
    };
    return configs[masteryLevel];
  }, [masteryLevel]);

  const percentage = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((mastered / total) * 100);
  }, [mastered, total]);

  return (
    <div className={`rounded-2xl p-4 border ${masteryConfig.bgColor} ${masteryConfig.borderColor}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{masteryConfig.emoji}</span>
        <div className="flex-1">
          <div className="font-bold text-slate-800">{masteryConfig.message}</div>
          <div className="text-sm text-slate-600">
            {mastered} <Trans i18nKey="auto.masteryindicator.of">of</Trans> {total} <Trans i18nKey="auto.masteryindicator.concepts_discovered">concepts discovered</Trans>
                                </div>
        </div>
        {showDetails && (
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{percentage}%</div>
            <div className="text-xs text-slate-500"><Trans i18nKey="auto.masteryindicator.explored">explored</Trans></div>
          </div>
        )}
      </div>

      {/* Progress bar (visual, not judgmental) */}
      <div className="mt-3 bg-white rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Garden Metaphor Progress Component
export function GardenProgress({ mastered, total }: { mastered: number; total: number }) {
  const plants = useMemo(() => {
    if (total === 0) return [];
    const ratio = mastered / total;
    const plantCount = Math.ceil(ratio * 5); // Max 5 plants
    return Array.from({ length: 5 }, (_, i) => {
      if (i < plantCount) {
        if (ratio < 0.3) return '🌱'; // Seed
        if (ratio < 0.6) return '🌿'; // Sprout
        if (ratio < 0.9) return '🌳'; // Growing
        return '🌳'; // Flourishing
      }
      return '🌱'; // Unplanted seed
    });
  }, [mastered, total]);

  return (
    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
      <div className="text-sm font-bold text-amber-900 mb-3"><Trans i18nKey="auto.masteryindicator.your_knowledge_garden">Your Knowledge Garden</Trans></div>
      <div className="flex gap-2 justify-center text-3xl">
        {plants.map((plant, index) => (
          <div key={index} className="transform transition-all hover:scale-110">
            {plant}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-amber-700 mt-2">
        {mastered} <Trans i18nKey="auto.masteryindicator.of">of</Trans> {total} <Trans i18nKey="auto.masteryindicator.concepts_planted">concepts planted</Trans>
                    </div>
    </div>
  );
}

// Constellation Metaphor Progress Component
export function ConstellationProgress({ mastered, total }: { mastered: number; total: number }) {
  const stars = useMemo(() => {
    if (total === 0) return [];
    const ratio = mastered / total;
    const starCount = Math.ceil(ratio * 8); // Max 8 stars
    return Array.from({ length: 8 }, (_, i) => i < starCount);
  }, [mastered, total]);

  return (
    <div className="bg-indigo-900 rounded-2xl p-4 border border-indigo-700">
      <div className="text-sm font-bold text-indigo-200 mb-3"><Trans i18nKey="auto.masteryindicator.your_knowledge_constellation">Your Knowledge Constellation</Trans></div>
      <div className="flex gap-2 justify-center text-2xl">
        {stars.map((_, index) => (
          <div key={index} className="animate-pulse">
            ⭐
          </div>
        ))}
        {Array.from({ length: 8 - stars.length }).map((_, index) => (
          <div key={`empty-${index}`} className="opacity-30">
            ⭐
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-indigo-300 mt-2">
        {mastered} <Trans i18nKey="auto.masteryindicator.of">of</Trans> {total} <Trans i18nKey="auto.masteryindicator.stars_discovered">stars discovered</Trans>
                    </div>
    </div>
  );
}

// Journey Map Progress Component
export function JourneyMapProgress({ mastered, total }: { mastered: number; total: number }) {
  const milestones = useMemo(() => {
    if (total === 0) return [];
    const ratio = mastered / total;
    const milestoneCount = Math.ceil(ratio * 6); // Max 6 milestones
    return Array.from({ length: 6 }, (_, i) => i < milestoneCount);
  }, [mastered, total]);

  return (
    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-300">
      <div className="text-sm font-bold text-slate-800 mb-3"><Trans i18nKey="auto.masteryindicator.your_learning_journey">Your Learning Journey</Trans></div>
      <div className="flex items-center justify-between">
        {milestones.map((_, index) => (
          <React.Fragment key={index}>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            {index < 5 && (
              <div className={`flex-1 h-1 ${index < milestones.length - 1 ? 'bg-green-500' : 'bg-slate-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center text-sm text-slate-600 mt-3">
        {mastered} <Trans i18nKey="auto.masteryindicator.of">of</Trans> {total} <Trans i18nKey="auto.masteryindicator.milestones_reached">milestones reached</Trans>
                    </div>
    </div>
  );
}

// Shame-Free Feedback Component
export function ShameFreeFeedback({
  attempts,
  hintsUsed,
  timeSpent,
}: {
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
}) {
  const feedback = useMemo(() => {
    const messages = [];

    if (attempts > 0) {
      if (attempts <= 3) {
        messages.push("You're exploring thoughtfully!");
      } else if (attempts <= 6) {
        messages.push("You're persistent - that's how learning happens!");
      } else {
        messages.push("You're really committed to understanding this!");
      }
    }

    if (hintsUsed > 0) {
      messages.push("Using hints is smart - it helps you learn faster!");
    }

    if (timeSpent > 120) {
      messages.push("Taking your time is exactly right - understanding takes the time it takes!");
    } else if (timeSpent > 60) {
      messages.push("You're giving this the attention it deserves!");
    }

    return messages;
  }, [attempts, hintsUsed, timeSpent]);

  return (
    <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
      <div className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
        <span className="text-xl">💜</span>
        <Trans i18nKey="auto.masteryindicator.your_learning_style">Your Learning Style</Trans>
                    </div>
      <ul className="text-sm text-purple-800 space-y-1">
        {feedback.map((message, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>{message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
