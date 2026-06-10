// src/worlds/academy/modules/EconomicIndicators.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { INDICATORS, POLICY_DECISIONS } from '../data/academyContent';

export default function EconomicIndicators() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordEconomics } = useAcademyProgress();
  const [values, setValues] = useState<Record<string, number>>(Object.fromEntries(INDICATORS.map((i) => [i.id, i.value])));
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const applyPolicy = useCallback(async (policy: typeof POLICY_DECISIONS[number]) => {
    setActivePolicy(policy.id);
    setValues((prev) => ({ ...prev, gdp: (prev.gdp ?? 0) + policy.gdp, inflation: (prev.inflation ?? 0) + policy.inflation }));
    await recordEconomics('gdp', policy.id, true);
    lumo.crossConceptConnection('You improved one indicator at the cost of another. That is the nature of policy trade-offs.');
  }, [recordEconomics, lumo]);

  return (
    <AcademyShell module="economic-indicators">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="grid grid-cols-2 gap-3 mb-4">{INDICATORS.map((ind) => <div key={ind.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center"><div className="text-2xl mb-1">{ind.emoji}</div><p className="text-slate-400 text-sm">{ind.name}</p><p className="text-white text-xl font-bold">{(values[ind.id] ?? ind.value).toFixed(1)}{ind.unit}</p></div>)}</div>
        <p className="text-slate-500 text-sm font-bold mb-2 uppercase">{t('academy.modules.EconomicIndicators.txt_Policydeci', 'Policy decisions')}</p>
        <div className="space-y-3">{POLICY_DECISIONS.map((p) => <button key={p.id} onClick={() => applyPolicy(p)} className={`w-full bg-slate-900 rounded-2xl p-4 border text-left ${activePolicy === p.id ? 'border-lime-500' : 'border-slate-800'}`}><div className="flex items-center gap-2"><span className="text-2xl">{p.emoji}</span><div><p className="text-white font-bold text-sm">{p.name}</p><p className="text-slate-500 text-sm">{p.note}</p></div></div></button>)}</div>
        <div className="mt-4 bg-amber-950/30 border border-amber-900/30 rounded-xl p-3 text-sm text-amber-300"><Trans i18nKey="auto.economicindicators.rbi_and_finance_ministry_make_">🇮🇳 RBI and Finance Ministry make these trade-offs quarterly.</Trans></div>
      </div>
    </AcademyShell>
  );
}
