// src/worlds/academy/modules/WaveInterference.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { Trans } from "react-i18next";

export default function WaveInterference() {
  const lumo = useLumoAncient();
  const { recordWaves } = useAcademyProgress();
  const [freq1, setFreq1] = useState(440);
  const [freq2, setFreq2] = useState(440);
  const [constructiveFound, setConstructiveFound] = useState(false);
  const [destructiveFound, setDestructiveFound] = useState(false);

  const handleCheck = useCallback(async () => {
    const same = Math.abs(freq1 - freq2) < 10;
    const opposite = Math.abs(freq1 - freq2) > 200;
    if (same && !constructiveFound) { setConstructiveFound(true); await recordWaves(true, false, false, false); }
    if (opposite && !destructiveFound) { setDestructiveFound(true); await recordWaves(false, true, false, false); lumo.afterProfoundDiscovery(); }
  }, [freq1, freq2, constructiveFound, destructiveFound, recordWaves, lumo]);

  return (
    <AcademyShell module="wave-interference">
      <div className="flex-1 flex flex-col p-5 bg-slate-950 pb-24">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4">
          <p className="text-white font-bold text-sm"><Trans i18nKey="auto.waveinterference.wave_interference">🌊 Wave Interference</Trans></p>
          <p className="text-slate-400 text-sm mt-1"><Trans i18nKey="auto.waveinterference.two_sources_watch_them_combine">Two sources — watch them combine or cancel</Trans></p>
        </div>

        {/* Visual interference pattern */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 mb-4 overflow-hidden" style={{ height: '160px' }}>
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Simplified visual — concentric circles from two sources */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2">
              {[1,2,3,4].map(i => <motion.div key={`s1-${i}`} animate={{ scale: [1, 2+i], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i*0.3 }} className="absolute w-8 h-8 rounded-full border border-purple-500/40 -ml-4 -mt-4" />)}
              <div className="w-4 h-4 rounded-full bg-purple-500 -ml-2 -mt-2 relative z-10" />
            </div>
            <div className="absolute left-3/4 top-1/2 -translate-y-1/2">
              {[1,2,3,4].map(i => <motion.div key={`s2-${i}`} animate={{ scale: [1, 2+i], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i*0.3 }} className="absolute w-8 h-8 rounded-full border border-cyan-500/40 -ml-4 -mt-4" />)}
              <div className="w-4 h-4 rounded-full bg-cyan-500 -ml-2 -mt-2 relative z-10" />
            </div>
            {/* Interference indicators */}
            {constructiveFound && <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-900/50 px-3 py-1 rounded-full text-green-400 text-sm font-bold"><Trans i18nKey="auto.waveinterference.constructive">Constructive ✓</Trans></div>}
            {destructiveFound && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-900/50 px-3 py-1 rounded-full text-red-400 text-sm font-bold"><Trans i18nKey="auto.waveinterference.destructive">Destructive ✓</Trans></div>}
          </div>
        </div>

        {/* Frequency controls */}
        <div className="space-y-3 mb-4">
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between text-sm mb-1"><span className="text-purple-400 font-bold"><Trans i18nKey="auto.waveinterference.source_1_frequency">Source 1 Frequency</Trans></span><span className="text-white font-bold">{freq1} <Trans i18nKey="auto.waveinterference.hz">Hz</Trans></span></div>
            <input type="range" min={200} max={800} value={freq1} onChange={e => { setFreq1(Number(e.target.value)); handleCheck(); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#8B5CF6' }} />
          </div>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between text-sm mb-1"><span className="text-cyan-400 font-bold"><Trans i18nKey="auto.waveinterference.source_2_frequency">Source 2 Frequency</Trans></span><span className="text-white font-bold">{freq2} <Trans i18nKey="auto.waveinterference.hz">Hz</Trans></span></div>
            <input type="range" min={200} max={800} value={freq2} onChange={e => { setFreq2(Number(e.target.value)); handleCheck(); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#06B6D4' }} />
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4">
          <p className="text-slate-400 text-sm font-bold uppercase mb-2"><Trans i18nKey="auto.waveinterference.interference_conditions">Interference Conditions</Trans></p>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${constructiveFound ? 'text-green-400' : 'text-slate-500'}`}><span>{constructiveFound ? '✓' : '○'}</span><span className="text-sm"><Trans i18nKey="auto.waveinterference.constructive_path_difference_n">Constructive: path difference = nλ (same frequency)</Trans></span></div>
            <div className={`flex items-center gap-2 ${destructiveFound ? 'text-red-400' : 'text-slate-500'}`}><span>{destructiveFound ? '✓' : '○'}</span><span className="text-sm"><Trans i18nKey="auto.waveinterference.destructive_path_difference_2n">Destructive: path difference = (2n+1)λ/2</Trans></span></div>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <p className="text-slate-400 text-sm font-bold uppercase mb-2"><Trans i18nKey="auto.waveinterference.real_applications">Real Applications</Trans></p>
          <div className="space-y-1 text-slate-500 text-sm">
            <p><Trans i18nKey="auto.waveinterference.noise_cancelling_headphones_de">🎧 Noise-cancelling headphones: destructive interference</Trans></p>
            <p><Trans i18nKey="auto.waveinterference.wifi_constructive_interference">📡 WiFi: constructive interference for signal strength</Trans></p>
            <p><Trans i18nKey="auto.waveinterference.young_s_double_slit_proved_lig">💡 Young's double slit: proved light is a wave (1801)</Trans></p>
          </div>
        </div>
      </div>
    </AcademyShell>
  );
}
