// src/worlds/lab/components/CertificationBadge.tsx
import type { CertificationLevel } from '../types/lab.types';

interface CertificationBadgeProps { level: CertificationLevel; size?: 'sm' | 'md' | 'lg'; }

import React from 'react';
import { useTranslation } from 'react-i18next';

export const CertificationBadge = React.memo(function CertificationBadge({ level, size = 'md' }: CertificationBadgeProps) {
  const { t } = useTranslation();
  const configs = {
    explorer: { emoji: '🔍', color: 'bg-sky-100 text-sky-700', border: 'border-sky-200' },
    scientist: { emoji: '🔬', color: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
    expert: { emoji: '⭐', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  }[level];

  const sz = { sm: 'p-1 text-sm', md: 'p-2 text-sm', lg: 'p-3 text-base' }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl border-2 font-bold ${configs.color} ${configs.border} ${sz}`}>
      <span>{configs.emoji}</span>
      <span className="capitalize">{t(`auto.certificationbadge.${level}`, level)}</span>
    </div>
  );
});
