// src/worlds/lab/modules/CellExplorer.tsx
// Interactive cell exploration with organelle focus

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import CellCanvas from './CellCanvas';

const ORGANELLES = [
  { id: 'nucleus', name: 'Nucleus', emoji: '🧬', desc: 'Control center with DNA' },
  { id: 'mitochondria', name: 'Mitochondria', emoji: '⚡', desc: 'Powerhouse of the cell' },
  { id: 'ribosome', name: 'Ribosome', emoji: '🔵', desc: 'Protein factories' },
  { id: 'er', name: 'Endoplasmic Reticulum', emoji: '🌀', desc: 'Transport network' },
  { id: 'golgi', name: 'Golgi Apparatus', emoji: '📦', desc: 'Packaging center' },
  { id: 'lysosome', name: 'Lysosome', emoji: '♻️', desc: 'Recycling center' },
];

export default function CellExplorer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [focusedOrganelle, setFocusedOrganelle] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleOrganelleClick = useCallback((id: string) => {
    setFocusedOrganelle(id);
    LearningService.trackEvent(
      'cell-session',
      'lab',
      language,
      'canvas_interaction',
      'cell',
      { organelle: id }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔬</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.cell.title', { defaultValue: 'Cell Explorer' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.CellExplorer.txt_Explorethe', 'Explore the tiny world inside every living thing!')}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <CellCanvas focusedOrganelle={focusedOrganelle} isPlaying={isPlaying} />
        </div>

        {/* Organelle selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-3 gap-3">
            {ORGANELLES.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrganelleClick(org.id)}
                className={`py-3 rounded-xl text-sm font-medium transition ${
                  focusedOrganelle === org.id
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="text-lg mb-1">{org.emoji}</div>
                <div>{org.name}</div>
              </button>
            ))}
          </div>
          {focusedOrganelle && (
            <div className="mt-3 text-center text-sm text-slate-500">
              {ORGANELLES.find(o => o.id === focusedOrganelle)?.desc}
            </div>
          )}
        </div>

        {/* Fun facts */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-teal-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🔢</div>
            <div className="font-bold text-teal-600 text-sm"><Trans i18nKey="auto.cellexplorer.37_2t">37.2T</Trans></div>
            <p className="text-sm text-teal-400 mt-1">{t('lab.modules.CellExplorer.txt_Cellsinyou', 'Cells in your body')}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">📏</div>
            <div className="font-bold text-blue-600 text-sm"><Trans i18nKey="auto.cellexplorer.10_100_m">10-100μm</Trans></div>
            <p className="text-sm text-blue-400 mt-1">{t('lab.modules.CellExplorer.txt_Typicalcel', 'Typical cell size')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.CellExplorer.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.cellexplorer.ancient_indian_insight">Ancient Indian Insight</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <Trans i18nKey="auto.cellexplorer.maharishi_kanad_600_bce_propos">Maharishi Kanad (~600 BCE) proposed</Trans> <strong><Trans i18nKey="auto.cellexplorer.paramanu">Paramanu</Trans></strong> <Trans i18nKey="auto.cellexplorer.the_smallest_indivisible_parti">— the smallest
                                              indivisible particle — 2,000 years before Dalton's atomic theory! The Vaisheshika
                                              school described matter as composed of tiny units, remarkably close to modern
                                              cell and atomic theory.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
