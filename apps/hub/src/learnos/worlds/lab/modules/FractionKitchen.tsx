// src/worlds/lab/modules/FractionKitchen.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { SCALABLE_RECIPES } from '../data/labContent';

export default function FractionKitchen() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('fraction-kitchen');
  const { recordRecipeSolved, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [chk, setChk] = useState(false);
  const [win, setWin] = useState(false);
  const r = SCALABLE_RECIPES[idx], f = r.targetServings / r.baseServings;

  const handleCheck = useCallback(async () => {
    setChk(true);
    const correct = r.ingredients.every(i => Math.abs(parseFloat(ans[i.name] || '0') - i.baseAmount * f) < 0.01);
    if (correct) { setWin(true); lumo.showAfterDiscovery(); recordRecipeSolved(f); updateCertification('fraction-kitchen', 'explorer'); trackEvent('fraction-kitchen', 'correct_answer'); }
    else trackEvent('fraction-kitchen', 'wrong_answer');
  }, [ans, r, f, lumo, recordRecipeSolved, updateCertification, trackEvent]);

  return (
    <LabShell module="fraction-kitchen" subject="math">
      <div className="flex flex-col h-screen bg-red-50 overflow-auto pb-24 p-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-red-100">
          <div className="flex items-center gap-4 mb-4"><span className="text-4xl">{r.emoji}</span><div><h2 className="text-xl font-bold">{r.name}</h2><p className="text-sm text-slate-500"><Trans i18nKey="auto.fractionkitchen.original_servings">Original servings:</Trans> {r.baseServings}</p></div></div>
          <div className="bg-red-50 p-4 rounded-xl font-bold text-red-800"><Trans i18nKey="auto.fractionkitchen.target_feed">Target: Feed</Trans> {r.targetServings} <Trans i18nKey="auto.fractionkitchen.people">people (×</Trans>{f})</div>
        </div>
        <div className="space-y-4">
          {r.ingredients.map(i => (
            <div key={i.name} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div><p className="font-bold">{i.name}</p><p className="text-sm text-slate-400"><Trans i18nKey="auto.fractionkitchen.base">Base:</Trans> {i.baseAmount} {i.unit}</p></div>
              <input type="number" step="0.25" value={ans[i.name] || ''} onChange={e => setAns(p => ({ ...p, [i.name]: e.target.value }))} className={`w-24 p-2 text-center rounded-xl border-2 ${chk ? (Math.abs(parseFloat(ans[i.name] || '0') - i.baseAmount * f) < 0.01 ? 'border-green-500' : 'border-red-500') : 'border-slate-200'}`} />
            </div>
          ))}
        </div>
        {!win ? <button onClick={handleCheck} className="mt-8 bg-red-600 text-white p-4 rounded-2xl font-bold">{t('lab.modules.FractionKitchen.btn_CheckIngre', 'Check Ingredients')}</button>
        : <button onClick={() => { setIdx(p => (p + 1) % SCALABLE_RECIPES.length); setAns({}); setChk(false); setWin(false); }} className="mt-8 bg-green-600 text-white p-4 rounded-2xl font-bold"><Trans i18nKey="auto.fractionkitchen.next_recipe">Next Recipe</Trans></button>}
      </div>
    </LabShell>
  );
}
