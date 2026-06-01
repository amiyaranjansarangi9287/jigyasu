// src/worlds/early/modules/MagnetExplorer.tsx
// Sort objects into magnetic/not-magnetic bins. Pip explains materials.

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { MAGNET_OBJECTS } from '../data/earlyContent';

export default function MagnetExplorer() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordMagnetSorting } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [unsorted, setUnsorted] = useState(() => [...MAGNET_OBJECTS].sort(() => Math.random() - 0.5));
  const [magneticBin, setMagneticBin] = useState<typeof MAGNET_OBJECTS>([]);
  const [notMagneticBin, setNotMagneticBin] = useState<typeof MAGNET_OBJECTS>([]);
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [selectedObj, setSelectedObj] = useState<string | null>(null);

  const handleSort = useCallback(async (objId: string, bin: 'magnetic' | 'not-magnetic') => {
    const obj = unsorted.find(o => o.id === objId);
    if (!obj) return;

    const correct = (bin === 'magnetic' && obj.isMagnetic) || (bin === 'not-magnetic' && !obj.isMagnetic);

    if (correct) {
      setUnsorted(prev => prev.filter(o => o.id !== objId));
      if (bin === 'magnetic') setMagneticBin(prev => [...prev, obj]);
      else setNotMagneticBin(prev => [...prev, obj]);
      setLastWrong(null);
      setSelectedObj(null);

      if (soundEnabled) try { AudioEngine.playTone({ frequency: 600, type: 'sine', duration: 0.2, volume: 0.25, attack: 0.02, decay: 0.1 }); } catch (_) {}

      const materialMsg = obj.isMagnetic ? `${obj.name} is made of ${obj.material} — magnetic!` : `${obj.name} is ${obj.material} — not magnetic!`;
      pip.sayCustom(materialMsg, 'excited');
      await trackCorrect('magnet-explorer', { object: obj.id, bin });

      // Check complete
      if (unsorted.length === 1) {
        setComplete(true);
        pip.sayCustom("You're a real magnet scientist!", 'celebrating');
        if (soundEnabled) try { AudioEngine.playCelebration(); } catch (_) {}
        await recordMagnetSorting();
      }
    } else {
      setLastWrong(objId);
      pip.reactToMistake();
      await trackWrong('magnet-explorer', { object: obj.id, bin });
      setTimeout(() => setLastWrong(null), 800);
    }
  }, [unsorted, soundEnabled, pip, trackCorrect, trackWrong, recordMagnetSorting]);

  const handleReset = () => {
    setUnsorted([...MAGNET_OBJECTS].sort(() => Math.random() - 0.5));
    setMagneticBin([]); setNotMagneticBin([]);
    setComplete(false); setSelectedObj(null);
    pip.sayCustom("Let's sort again! Is it magnetic?", 'excited');
  };

  return (
    <EarlyShell module="magnet-explorer">
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-200">
            <div className="flex items-center gap-3"><span className="text-3xl">🐤🧲</span>
              <div><p className="text-lg font-bold text-gray-700">Is it magnetic?</p>
                <p className="text-sm text-gray-500">{unsorted.length} objects left to sort</p></div>
            </div>
          </div>
        </div>

        {/* Two bins */}
        <div className="px-5 grid grid-cols-2 gap-3 mb-4">
          <div className={`bg-green-50 rounded-2xl p-3 border-2 min-h-[100px] transition-all ${selectedObj ? 'border-green-400 border-dashed' : 'border-green-200'}`}
            onClick={() => selectedObj && handleSort(selectedObj, 'magnetic')}>
            <div className="text-center mb-2"><span className="text-3xl">🧲</span><p className="text-sm font-bold text-green-700">Magnetic</p></div>
            <div className="flex flex-wrap gap-1 justify-center">
              {magneticBin.map(o => <span key={o.id} className="text-xl">{o.emoji}</span>)}
            </div>
          </div>
          <div className={`bg-gray-50 rounded-2xl p-3 border-2 min-h-[100px] transition-all ${selectedObj ? 'border-gray-400 border-dashed' : 'border-gray-200'}`}
            onClick={() => selectedObj && handleSort(selectedObj, 'not-magnetic')}>
            <div className="text-center mb-2"><span className="text-3xl">🚫</span><p className="text-sm font-bold text-gray-600">Not Magnetic</p></div>
            <div className="flex flex-wrap gap-1 justify-center">
              {notMagneticBin.map(o => <span key={o.id} className="text-xl">{o.emoji}</span>)}
            </div>
          </div>
        </div>

        {/* Unsorted objects */}
        <div className="px-5 flex-1">
          <p className="text-sm text-gray-500 text-center mb-3">Tap an object, then tap a bin</p>
          <div className="grid grid-cols-3 gap-3">
            {unsorted.map(obj => (
              <motion.button key={obj.id} whileTap={{ scale: 0.9 }}
                animate={lastWrong === obj.id ? { x: [0, -6, 6, -6, 0] } : {}}
                onClick={() => setSelectedObj(obj.id === selectedObj ? null : obj.id)}
                className={`bg-white rounded-2xl p-3 border-2 flex flex-col items-center gap-1 min-h-[80px] transition-all ${
                  selectedObj === obj.id ? 'border-rose-400 bg-rose-50 scale-105' : 'border-gray-200'
                }`}>
                <span className="text-3xl">{obj.emoji}</span>
                <span className="text-sm font-bold text-gray-500">{obj.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Complete */}
        <AnimatePresence>
          {complete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mx-5 mb-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-5 text-white text-center">
              <div className="text-4xl mb-2">🧲✨</div>
              <p className="font-extrabold text-xl mb-3">Magnet Scientist!</p>
              <button onClick={handleReset} className="px-6 py-3 bg-white text-rose-600 font-bold rounded-2xl min-h-[48px]">Sort Again! 🧲</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EarlyShell>
  );
}
