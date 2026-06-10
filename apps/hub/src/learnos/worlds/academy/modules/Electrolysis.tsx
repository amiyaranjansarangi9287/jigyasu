// src/worlds/academy/modules/Electrolysis.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { ELECTROLYSIS_SETUPS } from '../data/academyContent';

export default function Electrolysis() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordElectrolysis } = useAcademyProgress();
  const [setupIdx, setSetupIdx] = useState(0);
  const [current, setCurrent] = useState(2);
  const [minutes, setMinutes] = useState(30);
  const [running, setRunning] = useState(false);
  const setup = ELECTROLYSIS_SETUPS[setupIdx];
  const charge = Math.round(current * minutes * 60);

  const run = useCallback(async () => {
    setRunning(true);
    await recordElectrolysis(setup.id, false, setup.id === 'water');
    if (setup.id === 'water') lumo.afterProfoundDiscovery();
    setTimeout(() => setRunning(false), 1600);
  }, [setup, recordElectrolysis, lumo]);

  return (
    <AcademyShell module="electrolysis">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="flex gap-2 overflow-x-auto mb-4 no-scrollbar">{ELECTROLYSIS_SETUPS.map((s, i) => <button key={s.id} onClick={() => setSetupIdx(i)} className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-bold min-h-[40px] ${setupIdx === i ? 'bg-amber-900/60 text-amber-300 border border-amber-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{s.emoji} {s.name}</button>)}</div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-4">
          <div className="h-52 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-end justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-cyan-500/10 border-t border-cyan-500/20" />
            <div className="absolute left-1/3 bottom-10 w-4 h-32 bg-slate-500 rounded" />
            <div className="absolute right-1/3 bottom-10 w-4 h-32 bg-slate-400 rounded" />
            {running && <><div className="absolute left-1/3 bottom-24 text-cyan-400 animate-bounce">○ ○</div><div className="absolute right-1/3 bottom-24 text-red-400 animate-bounce">○ ○</div></>}
            <div className="absolute top-4 text-slate-500 text-sm font-mono">{setup.electrolyte}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-slate-900 p-3 rounded-xl border border-blue-900/40"><p className="text-blue-400 text-sm font-bold">{t('academy.modules.Electrolysis.txt_Cathode', 'Cathode')}</p><p className="text-white text-sm mt-1">{setup.cathodeProduct}</p></div><div className="bg-slate-900 p-3 rounded-xl border border-red-900/40"><p className="text-red-400 text-sm font-bold">{t('academy.modules.Electrolysis.txt_Anode', 'Anode')}</p><p className="text-white text-sm mt-1">{setup.anodeProduct}</p></div></div>
        <div className="space-y-3 mb-4"><label className="block text-slate-400 text-sm"><Trans i18nKey="auto.electrolysis.current">Current:</Trans> {current}<Trans i18nKey="auto.electrolysis.a">A</Trans><input type="range" min="1" max="10" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="w-full" /></label><label className="block text-slate-400 text-sm"><Trans i18nKey="auto.electrolysis.time">Time:</Trans> {minutes} <Trans i18nKey="auto.electrolysis.min">min</Trans><input type="range" min="5" max="120" step="5" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full" /></label></div>
        <button onClick={run} disabled={running} className="w-full py-4 bg-indigo-700 text-white rounded-2xl font-bold min-h-[52px]">{running ? 'Running...' : 'Run Electrolysis'}</button>
        <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm text-slate-400"><p><Trans i18nKey="auto.electrolysis.charge_q_i_t">Charge Q = I × t =</Trans> {charge} <Trans i18nKey="auto.electrolysis.c">C</Trans></p><p className="text-amber-400 mt-2">🇮🇳 {setup.indianContext}</p></div>
      </div>
    </AcademyShell>
  );
}
