import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Thermometer, Beaker } from 'lucide-react';

export default function EnzymeLab() {
  const [temperature, setTemperature] = useState(37);
  const [pH, setPH] = useState(7);
  const [substrate, setSubstrate] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [productAmount, setProductAmount] = useState(0);
  const [selectedEnzyme, setSelectedEnzyme] = useState('amylase');
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<{ t: number; v: number }[]>([]);

  const enzymes = {
    amylase: { name: 'Amylase', emoji: '🍞', optTemp: 37, optPH: 7, substrate: 'Starch → Maltose', location: 'Mouth & Pancreas', fact: 'Begins digesting starch the moment you chew!' },
    pepsin: { name: 'Pepsin', emoji: '🥩', optTemp: 37, optPH: 2, substrate: 'Protein → Peptides', location: 'Stomach', fact: 'Only works in extremely acidic conditions (pH 2)!' },
    catalase: { name: 'Catalase', emoji: '💧', optTemp: 37, optPH: 7, substrate: 'H₂O₂ → H₂O + O₂', location: 'Most cells (especially liver)', fact: 'One of the fastest enzymes — breaks 40 million H₂O₂ molecules per second!' },
    lipase: { name: 'Lipase', emoji: '🧈', optTemp: 37, optPH: 8, substrate: 'Fats → Fatty Acids + Glycerol', location: 'Pancreas & Small Intestine', fact: 'Works best with bile salts that emulsify fat into tiny droplets.' },
    trypsin: { name: 'Trypsin', emoji: '🔪', optTemp: 37, optPH: 8, substrate: 'Proteins → Amino Acids', location: 'Small Intestine', fact: 'Activated from trypsinogen by enterokinase to prevent self-digestion!' },
  };

  type EnzymeKey = keyof typeof enzymes;
  const enzyme = enzymes[selectedEnzyme as EnzymeKey];

  const activityRate = useMemo(() => {
    const tempDiff = Math.abs(temperature - enzyme.optTemp);
    const tempFactor = temperature > 60 ? 0 : temperature < 5 ? 0.05 : Math.exp(-tempDiff * tempDiff / 200);
    const pHDiff = Math.abs(pH - enzyme.optPH);
    const pHFactor = Math.exp(-pHDiff * pHDiff / 2);
    const substrateFactor = substrate / (substrate + 20);
    return tempFactor * pHFactor * substrateFactor;
  }, [temperature, pH, substrate, enzyme]);

  const isDenatured = temperature > 60 || pH < 1 || pH > 13;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setProductAmount(p => {
        const newP = p + activityRate * 2;
        setHistory(h => [...h.slice(-40), { t: time, v: activityRate * 100 }]);
        return newP;
      });
      setSubstrate(s => Math.max(0, s - activityRate * 0.5));
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning, activityRate, time]);

  const reset = () => {
    setIsRunning(false);
    setProductAmount(0);
    setSubstrate(50);
    setTime(0);
    setHistory([]);
  };

  const maxHist = Math.max(1, ...history.map(h => h.v));

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">⚗️ Enzyme Lab</h2>
          <p className="text-gray-400 text-lg">Adjust temperature, pH & substrate to study enzyme activity!</p>
        </motion.div>

        {/* Enzyme selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {(Object.entries(enzymes) as [EnzymeKey, typeof enzymes[EnzymeKey]][]).map(([key, e]) => (
            <button key={key} onClick={() => { setSelectedEnzyme(key); reset(); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedEnzyme === key ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {e.emoji} {e.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-400" /> Experiment Controls
              </h3>

              {/* Temperature */}
              <div className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temperature</span>
                  <span className={`text-sm font-mono font-bold ${temperature > 60 ? 'text-red-400' : temperature < 10 ? 'text-blue-400' : 'text-white'}`}>{temperature}°C</span>
                </div>
                <input type="range" min="0" max="80" value={temperature} onChange={e => setTemperature(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #3b82f6 0%, #22c55e 46%, #f59e0b 62%, #ef4444 100%)` }} />
                <div className="flex justify-between text-[9px] text-gray-600 mt-0.5">
                  <span>0°C ❄️</span>
                  <span>37°C ✅</span>
                  <span>80°C 🔥</span>
                </div>
              </div>

              {/* pH */}
              <div className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">⚗️ pH Level</span>
                  <span className={`text-sm font-mono font-bold ${Math.abs(pH - enzyme.optPH) < 1 ? 'text-emerald-400' : 'text-yellow-400'}`}>{pH.toFixed(1)}</span>
                </div>
                <input type="range" min="0" max="14" step="0.5" value={pH} onChange={e => setPH(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #22c55e 50%, #3b82f6 75%, #8b5cf6 100%)` }} />
                <div className="flex justify-between text-[9px] text-gray-600 mt-0.5">
                  <span>0 Acidic</span>
                  <span>7 Neutral</span>
                  <span>14 Basic</span>
                </div>
              </div>

              {/* Substrate */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">📦 Substrate Concentration</span>
                  <span className="text-sm font-mono text-white">{substrate.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-orange-500 rounded-full"
                    animate={{ width: `${substrate}%` }} />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isRunning ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Run</>}
                </button>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Enzyme Info */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="text-3xl mb-2">{enzyme.emoji}</div>
              <h4 className="text-lg font-bold text-white">{enzyme.name}</h4>
              <div className="text-sm text-gray-500 mb-2">📍 {enzyme.location}</div>
              <div className="text-sm text-gray-400 mb-3">Reaction: <span className="text-white font-mono">{enzyme.substrate}</span></div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-sm text-gray-500">Optimal Temp</div>
                  <div className="text-sm font-bold text-emerald-400">{enzyme.optTemp}°C</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-sm text-gray-500">Optimal pH</div>
                  <div className="text-sm font-bold text-emerald-400">{enzyme.optPH}</div>
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                <div className="text-sm text-blue-400 font-bold">💡 Fun Fact</div>
                <div className="text-sm text-gray-300">{enzyme.fact}</div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Activity Meter */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">📊 Enzyme Activity</h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Activity Rate</div>
                  <div className={`text-3xl font-black ${activityRate > 0.7 ? 'text-emerald-400' : activityRate > 0.3 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {isDenatured ? '☠️' : `${(activityRate * 100).toFixed(0)}%`}
                  </div>
                  {isDenatured && <div className="text-sm text-red-400 font-bold">DENATURED!</div>}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Product Made</div>
                  <div className="text-3xl font-black text-blue-400">{productAmount.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">units</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Substrate Left</div>
                  <div className="text-3xl font-black text-orange-400">{substrate.toFixed(0)}%</div>
                </div>
              </div>

              {/* Activity graph */}
              {history.length > 1 && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Activity Over Time</div>
                  <div className="flex items-end gap-0.5 h-20 bg-gray-800/30 rounded-lg p-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all"
                        style={{
                          height: `${(h.v / maxHist) * 100}%`,
                          backgroundColor: h.v > 70 ? '#22c55e' : h.v > 30 ? '#eab308' : '#ef4444',
                          opacity: 0.7,
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              <div className="mt-4 space-y-1.5">
                {isDenatured && (
                  <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
                    ⚠️ Enzyme is DENATURED! Its 3D shape is destroyed. {temperature > 60 ? 'Temperature too high!' : 'Extreme pH has broken hydrogen bonds.'}
                  </div>
                )}
                {substrate <= 0 && (
                  <div className="text-sm text-orange-400 bg-orange-500/10 rounded-lg px-3 py-2 border border-orange-500/20">
                    📦 No substrate remaining! All substrate has been converted to product.
                  </div>
                )}
              </div>
            </div>

            {/* Key Concepts */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-3">🎓 Key Enzyme Concepts</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: 'Lock & Key Model', desc: 'Enzymes have a specific active site that fits only certain substrates, like a key in a lock.', emoji: '🔑' },
                  { title: 'Denaturation', desc: 'High temperature or extreme pH breaks hydrogen bonds, changing the enzyme\'s 3D shape permanently.', emoji: '💥' },
                  { title: 'Activation Energy', desc: 'Enzymes lower the activation energy needed for reactions, making them occur faster.', emoji: '⚡' },
                  { title: 'Enzyme Specificity', desc: 'Each enzyme catalyzes only one type of reaction — amylase won\'t break down proteins!', emoji: '🎯' },
                ].map(c => (
                  <div key={c.title} className="bg-gray-800/50 rounded-xl p-3">
                    <div className="text-sm mb-1">{c.emoji}</div>
                    <div className="text-sm font-bold text-white mb-1">{c.title}</div>
                    <div className="text-sm text-gray-400">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
