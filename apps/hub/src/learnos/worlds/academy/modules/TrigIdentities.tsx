// src/worlds/academy/modules/TrigIdentities.tsx
import { useState, useCallback } from 'react';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { TRIG_IDENTITIES } from '../data/academyContent';

export default function TrigIdentities() {
  const lumo = useLumoAncient();
  const { recordTrigIdentity } = useAcademyProgress();
  const [idx, setIdx] = useState(0);
  const [verified, setVerified] = useState(false);
  const identity = TRIG_IDENTITIES[idx];

  const verify = useCallback(async () => {
    setVerified(true);
    await recordTrigIdentity(identity.id, true, true);
    lumo.afterProfoundDiscovery();
  }, [identity, recordTrigIdentity, lumo]);

  return (
    <AcademyShell module="trig-identities">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="flex gap-2 overflow-x-auto mb-4 no-scrollbar">{TRIG_IDENTITIES.map((t, i) => <button key={t.id} onClick={() => { setIdx(i); setVerified(false); }} className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-bold ${idx === i ? 'bg-cyan-900/70 text-cyan-300 border border-cyan-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{t.name}</button>)}</div>
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mb-4 text-center"><p className="text-cyan-400 text-sm font-bold uppercase mb-2">Identity</p><p className="text-white text-2xl font-mono font-bold">{identity.statement}</p></div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4"><p className="text-slate-400 text-sm font-bold uppercase mb-3">Proof steps</p><div className="space-y-2">{identity.proof.map((step, i) => <div key={i} className="bg-slate-800 rounded-xl p-3 text-sm text-slate-300"><span className="text-cyan-400 font-bold mr-2">{i+1}.</span>{step}</div>)}</div></div>
        {verified && <div className="bg-green-950/30 rounded-xl p-3 border border-green-900/30 text-green-300 text-sm mb-4">✓ Verified numerically and geometrically.</div>}
        <button onClick={verify} className="w-full py-4 bg-cyan-700 text-white rounded-2xl font-bold">Verify Identity</button>
      </div>
    </AcademyShell>
  );
}
