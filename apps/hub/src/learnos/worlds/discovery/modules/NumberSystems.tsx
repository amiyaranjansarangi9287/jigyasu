// src/worlds/discovery/modules/NumberSystems.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

export default function NumberSystems() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordNumberConversion } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [bits, setBits] = useState([false, false, false, false, false, false, false, false]);
  const [hexR, setHexR] = useState(255);
  const [hexG, setHexG] = useState(107);
  const [hexB, setHexB] = useState(107);

  const decimal = bits.reduce((sum, b, i) => sum + (b ? Math.pow(2, 7 - i) : 0), 0);
  const binary = bits.map(b => b ? '1' : '0').join('');
  const hex = decimal.toString(16).toUpperCase().padStart(2, '0');
  const hexColor = `#${hexR.toString(16).padStart(2, '0')}${hexG.toString(16).padStart(2, '0')}${hexB.toString(16).padStart(2, '0')}`.toUpperCase();

  const toggleBit = useCallback(async (idx: number) => {
    setBits(p => { const n = [...p]; n[idx] = !n[idx]; return n; });
    await recordNumberConversion('binary', true);
    await trackEvent('number-systems', 'canvas_interaction');
    if (bits.filter(Boolean).length === 0) lumo.show("Each bulb doubles in value: 128, 64, 32, 16, 8, 4, 2, 1. Why base 2?", 'questioning');
  }, [bits, recordNumberConversion, trackEvent, lumo]);

  return (
    <DiscoveryShell module="number-systems">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-white font-bold">{t('discovery.modules.NumberSystems.txt_NumberSyst', '💻 Number Systems')}</p>
          <p className="text-slate-400 text-sm mt-1">{t('discovery.modules.NumberSystems.txt_Everything', 'Everything digital is made of 0s and 1s')}</p>
        </div>

        {/* Binary light bulbs */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-slate-400 text-sm font-bold mb-3">{t('discovery.modules.NumberSystems.txt_TAPBULBSTO', 'TAP BULBS TO WRITE BINARY')}</p>
          <div className="flex gap-1 justify-center mb-2">
            {[128, 64, 32, 16, 8, 4, 2, 1].map((val, i) => (
              <div key={i} className="text-center">
                <p className="text-slate-600 text-[8px] mb-1">{val}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleBit(i)}
                  className={`w-10 h-10 rounded-full text-lg flex items-center justify-center transition-all ${bits[i] ? 'bg-yellow-400 shadow-lg shadow-yellow-400/30' : 'bg-slate-700'}`}
                >
                  {bits[i] ? '💡' : '⚫'}
                </motion.button>
                <p className={`text-sm font-mono mt-1 ${bits[i] ? 'text-yellow-400' : 'text-slate-600'}`}>{bits[i] ? '1' : '0'}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-3 space-y-1">
            <p className="text-slate-500 text-sm"><Trans i18nKey="auto.numbersystems.binary">Binary:</Trans> <span className="text-cyan-400 font-mono font-bold">{binary}</span></p>
            <p className="text-slate-500 text-sm"><Trans i18nKey="auto.numbersystems.decimal">Decimal:</Trans> <span className="text-white font-bold text-lg">{decimal}</span></p>
            <p className="text-slate-500 text-sm"><Trans i18nKey="auto.numbersystems.hex">Hex:</Trans> <span className="text-purple-400 font-mono font-bold"><Trans i18nKey="auto.numbersystems.0x">0x</Trans>{hex}</span></p>
          </div>
        </div>

        {/* Hex colour explorer */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-slate-400 text-sm font-bold mb-3">{t('discovery.modules.NumberSystems.txt_HEXCOLOURS', '🎨 HEX COLOURS')}</p>
          <div className="w-full h-16 rounded-xl mb-3 border border-slate-600" style={{ backgroundColor: hexColor }} />
          <p className="text-center text-white font-mono font-bold text-lg mb-3">{hexColor}</p>
          <div className="space-y-2">
            {[{ label: 'R', val: hexR, set: setHexR, color: '#EF4444' }, { label: 'G', val: hexG, set: setHexG, color: '#22C55E' }, { label: 'B', val: hexB, set: setHexB, color: '#3B82F6' }].map(c => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="text-sm font-bold w-4" style={{ color: c.color }}>{c.label}</span>
                <input type="range" min={0} max={255} value={c.val} onChange={e => c.set(Number(e.target.value))} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: c.color }} />
                <span className="text-slate-400 text-sm font-mono w-8 text-right">{c.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* India connection */}
        <div className="bg-amber-950/30 rounded-2xl p-4 border border-amber-900/30">
          <p className="text-amber-400 text-sm font-medium">{t('discovery.modules.NumberSystems.txt_Zerowasinv', '🇮🇳 Zero was invented in India by Brahmagupta (628 AD). Without zero, binary is impossible. Without binary, no computer exists. India made the digital age possible.')}</p>
        </div>
      </div>
    </DiscoveryShell>
  );
}
