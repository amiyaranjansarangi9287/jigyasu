// src/worlds/lab/modules/Multiplication.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import MultiplicationCanvas from './MultiplicationCanvas';

export default function Multiplication() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);

  const handleRowsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setRows(val);
    LearningService.trackEvent('multiplication-session', 'lab', language, 'rows_change', 'multiplication', { rows: val, cols });
  }, [language, cols]);

  const handleColsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCols(val);
    LearningService.trackEvent('multiplication-session', 'lab', language, 'cols_change', 'multiplication', { rows, cols: val });
  }, [language, rows]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✖️</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.multiplication.title', { defaultValue: 'Multiplication Visualized' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.Multiplication.txt_Seemultipl', 'See multiplication as arrays of objects!')}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <MultiplicationCanvas rows={rows} cols={cols} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Multiplication.spn_Rows', '↕️ Rows')}</span><span className="text-sm font-bold text-emerald-600">{rows}</span></div>
            <input type="range" min="1" max="12" value={rows} onChange={handleRowsChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #10B981, #059669)' }} />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Multiplication.spn_Columns', '↔️ Columns')}</span><span className="text-sm font-bold text-teal-600">{cols}</span></div>
            <input type="range" min="1" max="12" value={cols} onChange={handleColsChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #14B8A6, #0D9488)' }} />
          </div>
        </div>
        <div className="mt-6 bg-emerald-50 rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-emerald-600">{rows} × {cols} = {rows * cols}</div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Multiplication.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Indian Multiplication Magic</h3>
              <p className="text-gray-600 text-sm leading-relaxed">The <strong>Urdhva Tiryagbhyam</strong> method from Vedic mathematics multiplies any numbers vertically and crosswise — faster than traditional methods! Indian mathematicians also invented the multiplication table.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
