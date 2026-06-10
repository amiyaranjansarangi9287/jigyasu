// src/worlds/lab/modules/FloatSink.tsx
// Interactive buoyancy simulation - drop objects to see if they float or sink

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import FloatSinkCanvas from './FloatSinkCanvas';

const TEST_OBJECTS = [
  { id: 'wood', name: 'Wood', emoji: '🪵', density: 0.6 },
  { id: 'stone', name: 'Stone', emoji: '🪨', density: 2.5 },
  { id: 'leaf', name: 'Leaf', emoji: '🍃', density: 0.3 },
  { id: 'coin', name: 'Coin', emoji: '🪙', density: 7.8 },
  { id: 'apple', name: 'Apple', emoji: '🍎', density: 0.8 },
  { id: 'key', name: 'Key', emoji: '🔑', density: 7.5 },
  { id: 'cork', name: 'Cork', emoji: '🍾', density: 0.2 },
  { id: 'ball', name: 'Rubber Ball', emoji: '⚽', density: 0.9 },
];

export default function FloatSink() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [objects, setObjects] = useState(
    TEST_OBJECTS.map(o => ({ ...o, dropped: false }))
  );

  const handleDrop = useCallback((id: string) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, dropped: true } : o));
    const obj = TEST_OBJECTS.find(o => o.id === id);
    LearningService.trackEvent(
      'float-sink-session',
      'lab',
      language,
      'canvas_interaction',
      'float-sink',
      { objectId: id, density: obj?.density }
    );
  }, [language]);

  const handleReset = useCallback(() => {
    setObjects(TEST_OBJECTS.map(o => ({ ...o, dropped: false })));
  }, []);

  const floats = objects.filter(o => o.dropped && o.density < 1).length;
  const sinks = objects.filter(o => o.dropped && o.density >= 1).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌊</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.floatsink.title', { defaultValue: 'Float or Sink?' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.FloatSink.txt_Clickobjec', 'Click objects to drop them in water — density decides!')}</p>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm">
            <Trans i18nKey="auto.floatsink.floats">✓ Floats:</Trans> {floats}
          </div>
          <div className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-sm">
            <Trans i18nKey="auto.floatsink.sinks">✗ Sinks:</Trans> {sinks}
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 transition"
          >{t('lab.modules.FloatSink.btn_Reset', '🔄 Reset')}</button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <FloatSinkCanvas objects={objects} />
        </div>

        {/* Object buttons */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-4 gap-3">
            {objects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => !obj.dropped && handleDrop(obj.id)}
                disabled={obj.dropped}
                className={`py-3 rounded-xl text-sm font-medium transition ${
                  obj.dropped
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                }`}
              >
                <div className="text-2xl mb-1">{obj.emoji}</div>
                <div>{obj.name}</div>
                <div className="text-sm text-slate-400 mt-1">ρ={obj.density}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-5 text-center">
          <div className="text-sm text-blue-600 font-bold">
            <Trans i18nKey="auto.floatsink.density_lt_1_0_floats_density_">Density &lt; 1.0 = Floats • Density &gt; 1.0 = Sinks</Trans>
                                </div>
          <div className="text-sm text-blue-400 mt-2">
            <Trans i18nKey="auto.floatsink.water_has_density_1_0_objects_">Water has density = 1.0. Objects lighter than water float!</Trans>
                                </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.FloatSink.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.floatsink.ancient_indian_shipbuilding">Ancient Indian Shipbuilding</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <Trans i18nKey="auto.floatsink.indians_built_ships_using_buoy">Indians built ships using buoyancy principles 4,000 years ago! The Lothal dockyard
                                              (2400 BCE) in Gujarat is the world's oldest known tidal dock. Ancient shipbuilders
                                              knew which woods floated — teak (ρ=0.6) and bamboo (ρ=0.4) were preferred.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
