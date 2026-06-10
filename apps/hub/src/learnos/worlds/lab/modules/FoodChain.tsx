// src/worlds/lab/modules/FoodChain.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import FoodChainCanvas from './FoodChainCanvas';

const CHAINS = [
  { id: 'grassland' as const, emoji: '🌾', name: 'Grassland' },
  { id: 'ocean' as const, emoji: '🌊', name: 'Ocean' },
  { id: 'forest' as const, emoji: '🌲', name: 'Forest' },
  { id: 'pond' as const, emoji: '🏞️', name: 'Pond' },
];

export default function FoodChain() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [chain, setChain] = useState<'grassland' | 'ocean' | 'forest' | 'pond'>('grassland');

  const handleChainChange = useCallback((c: typeof chain) => {
    setChain(c);
    LearningService.trackEvent('food-chain-session', 'lab', language, 'chain_change', 'food-chain', { chain: c });
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-green-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔗</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.foodchain.title', { defaultValue: 'Food Chains' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.FoodChain.txt_Seewhoeats', 'See who eats whom in nature!')}</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {CHAINS.map(c => (
            <button key={c.id} onClick={() => handleChainChange(c.id)} className={`px-4 py-3 rounded-xl font-bold transition ${chain === c.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              <div className="text-xl">{c.emoji}</div>
              <div className="text-sm">{c.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <FoodChainCanvas chain={chain} />
        </div>
        <div className="mt-6 bg-green-50 rounded-2xl p-5 text-center">
          <div className="text-sm text-green-600 font-bold"><Trans i18nKey="auto.foodchain.sun_producer_consumer_decompos">Sun → Producer → Consumer → Decomposer</Trans></div>
          <div className="text-sm text-green-400 mt-2"><Trans i18nKey="auto.foodchain.energy_flows_from_the_sun_thro">Energy flows from the sun through every living thing!</Trans></div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.FoodChain.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.foodchain.indian_ecological_wisdom">Indian Ecological Wisdom</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed"><Trans i18nKey="auto.foodchain.the">The</Trans> <strong><Trans i18nKey="auto.foodchain.bishnoi_community">Bishnoi community</Trans></strong> <Trans i18nKey="auto.foodchain.1485_ce_in_rajasthan_sacrifice">(1485 CE) in Rajasthan sacrificed 363 lives to protect trees — inspiring the Chipko movement. Ancient Indian texts describe</Trans> <strong><Trans i18nKey="auto.foodchain.ahimsa">Ahimsa</Trans></strong> <Trans i18nKey="auto.foodchain.non_violence_and_interconnecte">(non-violence) and interconnectedness of all life — core ecological principles.</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
