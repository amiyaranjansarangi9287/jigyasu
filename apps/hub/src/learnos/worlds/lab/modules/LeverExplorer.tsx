// src/worlds/lab/modules/LeverExplorer.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { ScientificSlider } from '../components/ScientificSlider';

export default function LeverExplorer() {
  const lumo = useLumoOwl('lever-explorer');
  const { recordLeverChallenge, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [leftW, setLeftW] = useState(10);
  const [rightW, setRightW] = useState(5);
  const [fulcrum, setFulcrum] = useState(50); // 0-100, 50 = center
  const [balanced, setBalanced] = useState(false);

  const leftDist = fulcrum;
  const rightDist = 100 - fulcrum;
  const leftTorque = leftW * leftDist;
  const rightTorque = rightW * rightDist;
  const isBalanced = Math.abs(leftTorque - rightTorque) < 5;

  const handleCheck = useCallback(async () => {
    setBalanced(isBalanced);
    if (isBalanced) {
      lumo.showAfterDiscovery();
      const mechAdv = leftW > rightW * 2;
      await recordLeverChallenge(mechAdv);
      await updateCertification('lever-explorer', 'explorer');
      await trackEvent('lever-explorer', 'correct_answer');
      if (mechAdv) lumo.show("You got mechanical advantage! The lever multiplied your force!", 'celebrating');
    } else await trackEvent('lever-explorer', 'wrong_answer');
  }, [isBalanced, leftW, rightW, lumo, recordLeverChallenge, updateCertification, trackEvent]);

  return (
    <LabShell module="lever-explorer" subject="physics">
      <div className="min-h-screen bg-stone-50 flex flex-col p-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 mb-6">
          <h2 className="font-bold text-lg">Lever Explorer ⚙️</h2>
          <p className="text-sm text-slate-500">Move the fulcrum to balance the lever!</p>
        </div>

        {/* Lever visualization */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6" style={{ height: '140px' }}>
          <div className="relative w-full h-full flex items-end">
            {/* Beam */}
            <motion.div animate={{ rotate: isBalanced ? 0 : leftTorque > rightTorque ? -5 : 5 }} className="absolute bottom-12 left-0 right-0 h-2 bg-stone-600 rounded-full origin-center" style={{ transformOrigin: `${fulcrum}% center` }} />
            {/* Fulcrum */}
            <div className="absolute bottom-0" style={{ left: `${fulcrum}%`, transform: 'translateX(-50%)' }}>
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-600" />
            </div>
            {/* Weights */}
            <div className="absolute bottom-14 left-2 text-center"><span className="text-3xl">🏋️</span><p className="text-sm font-bold">{leftW}kg</p></div>
            <div className="absolute bottom-14 right-2 text-center"><span className="text-3xl">📦</span><p className="text-sm font-bold">{rightW}kg</p></div>
            {/* Torque display */}
            <div className="absolute top-0 left-2 text-sm text-slate-400">T = {leftTorque}</div>
            <div className="absolute top-0 right-2 text-sm text-slate-400">T = {rightTorque}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 mb-6">
          <ScientificSlider label="Fulcrum Position" emoji="🔺" value={fulcrum} min={10} max={90} unit="%" color="#78716C" onChange={setFulcrum} />
          <ScientificSlider label="Left Weight" emoji="🏋️" value={leftW} min={1} max={30} unit="kg" color="#EF4444" onChange={setLeftW} />
          <ScientificSlider label="Right Weight" emoji="📦" value={rightW} min={1} max={30} unit="kg" color="#3B82F6" onChange={setRightW} />
        </div>

        {balanced && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4 text-center"><p className="font-bold text-green-700 text-lg">⚖️ Balanced!</p><p className="text-sm text-green-600">Left torque = Right torque</p></motion.div>}

        <button onClick={handleCheck} className="w-full py-4 bg-stone-700 text-white font-bold text-lg rounded-2xl min-h-[56px]">Check Balance ⚖️</button>
      </div>
    </LabShell>
  );
}
