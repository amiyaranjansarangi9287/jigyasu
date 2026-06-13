// src/worlds/lab/modules/PlantGrowth.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import PlantGrowthCanvas from './PlantGrowthCanvas';

const STAGES = ['Seed', 'Sprout', 'Seedling', 'Growing', 'Flowering', 'Fruit'];
const EMOJIS = ['🌰', '🌱', '🌿', '🪴', '🌸', '🍎'];

export default function PlantGrowth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [stage, setStage] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.5);
  const [sunLevel, setSunLevel] = useState(0.8);

  const handleStageChange = useCallback((s: number) => {
    setStage(s);
    LearningService.trackEvent('plant-growth-session', 'lab', language, 'stage_change', 'plant-growth', { stage: s });
  }, [language]);

  const handleWaterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWaterLevel(val);
    LearningService.trackEvent('plant-growth-session', 'lab', language, 'water_change', 'plant-growth', { water: val });
  }, [language]);

  const handleSunChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunLevel(val);
    LearningService.trackEvent('plant-growth-session', 'lab', language, 'sun_change', 'plant-growth', { sun: val });
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{EMOJIS[stage]}</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.plantgrowth.title', { defaultValue: 'Plant Growth' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.PlantGrowth.txt_Watchaseed', 'Watch a seed grow into a fruit-bearing plant!')}</p>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {STAGES.map((s, i) => (
            <button key={i} onClick={() => handleStageChange(i)} className={`px-3 py-2 rounded-xl text-sm font-medium transition ${stage === i ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              <div className="text-lg">{EMOJIS[i]}</div>
              <div>{s}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <PlantGrowthCanvas stage={stage} waterLevel={waterLevel} sunLevel={sunLevel} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.PlantGrowth.spn_Water', '💧 Water')}</span><span className="text-sm font-medium text-blue-600">{Math.round(waterLevel * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.1" value={waterLevel} onChange={handleWaterChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #94A3B8, #3B82F6)' }} />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.PlantGrowth.spn_Sunlight', '☀️ Sunlight')}</span><span className="text-sm font-medium text-yellow-600">{Math.round(sunLevel * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.1" value={sunLevel} onChange={handleSunChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #94A3B8, #F59E0B)' }} />
          </div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.PlantGrowth.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.plantgrowth.indian_agriculture">Indian Agriculture</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed"><Trans i18nKey="auto.plantgrowth.india_s_green_revolution_1960s">India's Green Revolution (1960s) transformed food production. Ancient</Trans> <strong><Trans i18nKey="auto.plantgrowth.vrikshayurveda">Vrikshayurveda</Trans></strong> <Trans i18nKey="auto.plantgrowth.1000_bce_documented_plant_scie">(around the 10th century CE) documented plant science — grafting, soil types, and seasonal cycles — showing sophisticated early botanical knowledge in India.</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
