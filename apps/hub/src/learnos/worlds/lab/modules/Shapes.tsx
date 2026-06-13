// src/worlds/lab/modules/Shapes.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import ShapesCanvas from './ShapesCanvas';

const SHAPES = [
  { id: 'triangle' as const, emoji: '🔺', name: 'Triangle' },
  { id: 'square' as const, emoji: '🟦', name: 'Square' },
  { id: 'pentagon' as const, emoji: '⬠', name: 'Pentagon' },
  { id: 'hexagon' as const, emoji: '⬡', name: 'Hexagon' },
  { id: 'circle' as const, emoji: '🟡', name: 'Circle' },
];

export default function Shapes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [shape, setShape] = useState<'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle'>('triangle');
  const [showAngles, setShowAngles] = useState(true);

  const handleShapeChange = useCallback((s: typeof shape) => {
    setShape(s);
    LearningService.trackEvent('shapes-session', 'lab', language, 'shape_change', 'shapes', { shape: s });
  }, [language]);

  const toggleAngles = useCallback(() => setShowAngles(p => !p), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{SHAPES.find(s => s.id === shape)?.emoji}</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.shapes.title', { defaultValue: 'Geometry Shapes' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.Shapes.txt_Exploresid', 'Explore sides, angles, and properties!')}</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {SHAPES.map(s => (
            <button key={s.id} onClick={() => handleShapeChange(s.id)} className={`px-4 py-3 rounded-xl font-bold transition ${shape === s.id ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
              <div className="text-xl">{s.emoji}</div>
              <div className="text-sm">{s.name}</div>
            </button>
          ))}
          <button onClick={toggleAngles} className="px-4 py-3 rounded-xl bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition">
            {showAngles ? '📐 Angles' : '📐 Off'}
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <ShapesCanvas shape={shape} showAngles={showAngles} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Shapes.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.shapes.indian_geometry_heritage">Indian Geometry Heritage</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed"><Trans i18nKey="auto.shapes.the">The</Trans> <strong><Trans i18nKey="auto.shapes.sulba_sutras">Sulba Sutras</Trans></strong> <Trans i18nKey="auto.shapes.800_500_bce_contain_geometry_r">(800-500 BCE) contain geometry rules for building fire altars, including the relationship between the sides of right triangles — an early form of what we now call the Pythagorean theorem. Similar knowledge existed across ancient cultures. Baudhayana described constructing squares, circles, and triangles with precision.</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
