import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Battery, Droplets } from 'lucide-react';
import type { CanvasProps } from '../../types';

type Mode = 'battery' | 'electrolysis' | 'lemon';

interface BatteryConfig {
  anode: string;
  cathode: string;
  electrolyte: string;
  voltage: number;
}

const BATTERY_CONFIGS: BatteryConfig[] = [
  { anode: 'Zinc', cathode: 'Copper', electrolyte: 'Sulfuric Acid', voltage: 1.1 },
  { anode: 'Zinc', cathode: 'Carbon', electrolyte: 'Ammonium Chloride', voltage: 1.5 },
  { anode: 'Lead', cathode: 'Lead Dioxide', electrolyte: 'Sulfuric Acid', voltage: 2.0 },
];

export default function ElectrochemistryCanvas({ isPlaying }: CanvasProps) {
  const [mode, setMode] = useState<Mode>('lemon');
  const [isCircuitComplete, setIsCircuitComplete] = useState(false);
  const [electronFlow, setElectronFlow] = useState(0);
  const [lemonCount, setLemonCount] = useState(1);
  const [selectedBattery, setSelectedBattery] = useState(0);
  const [electrolysisProgress, setElectrolysisProgress] = useState(0);
  const [h2Bubbles, setH2Bubbles] = useState<number[]>([]);
  const [o2Bubbles, setO2Bubbles] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);

  // Electron flow animation
  useEffect(() => {
    if (!isPlaying || !isCircuitComplete) return;

    const animate = () => {
      setElectronFlow(prev => (prev + 2) % 100);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isCircuitComplete]);

  // Electrolysis bubbles
  useEffect(() => {
    if (mode !== 'electrolysis' || !isCircuitComplete || !isPlaying) return;

    const interval = setInterval(() => {
      setElectrolysisProgress(prev => Math.min(prev + 1, 100));
      
      if (Math.random() > 0.5) {
        setH2Bubbles(prev => [...prev.slice(-5), Date.now()]);
      }
      if (Math.random() > 0.7) {
        setO2Bubbles(prev => [...prev.slice(-3), Date.now()]);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [mode, isCircuitComplete, isPlaying]);

  const totalVoltage = mode === 'lemon' ? lemonCount * 0.9 : BATTERY_CONFIGS[selectedBattery].voltage;
  const canPowerLED = totalVoltage >= 1.8;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Selector */}
      <div className="flex gap-2">
        {[
          { mode: 'lemon' as Mode, label: '🍋 Lemon Battery', icon: Zap },
          { mode: 'battery' as Mode, label: '🔋 Batteries', icon: Battery },
          { mode: 'electrolysis' as Mode, label: '💧 Electrolysis', icon: Droplets },
        ].map(({ mode: m, label }) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setIsCircuitComplete(false);
              setElectrolysisProgress(0);
            }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              mode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LEMON BATTERY MODE */}
      {mode === 'lemon' && (
        <>
          <h3 className="text-xl font-bold text-yellow-400">🍋 Lemon Battery</h3>
          <p className="text-slate-400 text-sm">Make electricity from lemons!</p>

          {/* Lemon Battery Visualization */}
          <div className="relative w-full max-w-md min-h-48 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className="flex items-center gap-2">
              {Array.from({ length: lemonCount }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  {/* Lemon */}
                  <div className="w-16 min-h-14 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍋</span>
                  </div>
                  {/* Electrodes */}
                  <div className="absolute -left-2 top-1/2 w-4 h-8 bg-gray-400 rounded transform -translate-y-1/2" title="Zinc">
                    <span className="text-[8px] text-gray-800 font-bold">Zn</span>
                  </div>
                  <div className="absolute -right-2 top-1/2 w-4 h-8 bg-amber-600 rounded transform -translate-y-1/2" title="Copper">
                    <span className="text-[8px] text-white font-bold">Cu</span>
                  </div>
                  {/* Wire connections */}
                  {i < lemonCount - 1 && (
                    <div className="absolute right-0 top-1/2 w-8 h-1 bg-red-500 transform translate-x-4" />
                  )}
                </motion.div>
              ))}

              {/* LED */}
              <div className="ml-4 flex flex-col items-center">
                <motion.div
                  className={`w-6 h-8 rounded-full ${
                    isCircuitComplete && canPowerLED 
                      ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                      : 'bg-gray-600'
                  }`}
                  animate={isCircuitComplete && canPowerLED ? { 
                    boxShadow: ['0 0 10px #ef4444', '0 0 20px #ef4444', '0 0 10px #ef4444']
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-slate-400 mt-1">LED</span>
              </div>
            </div>

            {/* Electron flow animation */}
            {isCircuitComplete && (
              <motion.div
                className="absolute top-4 h-1 bg-blue-400 rounded-full"
                style={{ left: `${electronFlow}%`, width: '20px' }}
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLemonCount(Math.max(1, lemonCount - 1))}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full text-white text-xl"
            >-</button>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{lemonCount}</p>
              <p className="text-xs text-slate-400">Lemons</p>
            </div>
            <button
              onClick={() => setLemonCount(Math.min(4, lemonCount + 1))}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full text-white text-xl"
            >+</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-400">{totalVoltage.toFixed(1)}V</p>
              <p className="text-xs text-slate-400">Total Voltage</p>
            </div>
            <button
              onClick={() => setIsCircuitComplete(!isCircuitComplete)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                isCircuitComplete 
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isCircuitComplete ? '🔌 Disconnect' : '⚡ Connect Circuit'}
            </button>
          </div>

          {isCircuitComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm ${canPowerLED ? 'text-green-400' : 'text-amber-400'}`}
            >
              {canPowerLED 
                ? '💡 LED is glowing! You made electricity from lemons!' 
                : `⚠️ Need ${(1.8 - totalVoltage).toFixed(1)}V more to light the LED. Add more lemons!`}
            </motion.p>
          )}
        </>
      )}

      {/* BATTERY MODE */}
      {mode === 'battery' && (
        <>
          <h3 className="text-xl font-bold text-blue-400">🔋 How Batteries Work</h3>

          {/* Battery Selector */}
          <div className="flex gap-2">
            {BATTERY_CONFIGS.map((config, i) => (
              <button
                key={i}
                onClick={() => setSelectedBattery(i)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  selectedBattery === i ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {config.voltage}V Cell
              </button>
            ))}
          </div>

          {/* Battery Visualization */}
          <div className="relative w-72 min-h-48 bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            {/* Battery container */}
            <div className="absolute left-8 top-8 bottom-8 w-24 border-2 border-slate-500 rounded-lg overflow-hidden">
              {/* Electrolyte */}
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-blue-600/30">
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Anode */}
              <div className="absolute left-2 top-2 bottom-2 w-6 bg-gray-400 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-800 writing-mode-vertical">
                  {BATTERY_CONFIGS[selectedBattery].anode}
                </span>
              </div>
              
              {/* Cathode */}
              <div className="absolute right-2 top-2 bottom-2 w-6 bg-amber-600 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-white writing-mode-vertical">
                  {BATTERY_CONFIGS[selectedBattery].cathode}
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right">
              <p className="text-sm text-gray-400">⊖ Anode: {BATTERY_CONFIGS[selectedBattery].anode}</p>
              <p className="text-sm text-amber-400">⊕ Cathode: {BATTERY_CONFIGS[selectedBattery].cathode}</p>
              <p className="text-sm text-blue-400">💧 {BATTERY_CONFIGS[selectedBattery].electrolyte}</p>
              <p className="text-lg font-bold text-emerald-400 mt-2">⚡ {BATTERY_CONFIGS[selectedBattery].voltage}V</p>
            </div>

            {/* Electron flow arrows */}
            <motion.div
              className="absolute top-4 left-8 right-32 h-4 flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-blue-400 text-xs">e⁻ →→→→→</span>
            </motion.div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm">
            <h4 className="font-bold text-white mb-2">How it works:</h4>
            <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
              <li>Anode loses electrons (oxidation)</li>
              <li>Electrons flow through wire</li>
              <li>Cathode gains electrons (reduction)</li>
              <li>Ions move through electrolyte</li>
            </ol>
          </div>
        </>
      )}

      {/* ELECTROLYSIS MODE */}
      {mode === 'electrolysis' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">💧 Electrolysis of Water</h3>
          <p className="text-slate-400 text-sm">Split water into Hydrogen and Oxygen!</p>

          {/* Electrolysis Visualization */}
          <div className="relative w-80 h-56 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Water */}
            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-cyan-600/30" />

            {/* Electrodes */}
            <div className="absolute left-12 top-4 bottom-4 w-4 bg-gray-500 rounded">
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">⊖</span>
              {/* H2 Bubbles */}
              <AnimatePresence>
                {h2Bubbles.map(id => (
                  <motion.div
                    key={id}
                    initial={{ y: 100, opacity: 1, scale: 0.5 }}
                    animate={{ y: -150, opacity: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-white/60"
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="absolute right-12 top-4 bottom-4 w-4 bg-amber-600 rounded">
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-400">⊕</span>
              {/* O2 Bubbles */}
              <AnimatePresence>
                {o2Bubbles.map(id => (
                  <motion.div
                    key={id}
                    initial={{ y: 100, opacity: 1, scale: 0.5 }}
                    animate={{ y: -150, opacity: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5 }}
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400/60"
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Labels */}
            <div className="absolute left-12 bottom-2 transform -translate-x-1/2">
              <p className="text-xs text-white font-bold">H₂</p>
            </div>
            <div className="absolute right-12 bottom-2 transform translate-x-1/2">
              <p className="text-xs text-cyan-400 font-bold">O₂</p>
            </div>

            {/* Battery */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <div className="w-8 h-4 bg-gray-600 rounded-l" />
              <Zap className="w-4 h-4 text-yellow-400" />
              <div className="w-8 h-4 bg-amber-600 rounded-r" />
            </div>

            {/* Equation */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900/80 px-3 py-1 rounded-full">
              <p className="text-xs text-cyan-400 font-mono">2H₂O → 2H₂ + O₂</p>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span>{electrolysisProgress}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${electrolysisProgress}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsCircuitComplete(!isCircuitComplete)}
            className={`px-6 py-3 rounded-xl font-bold ${
              isCircuitComplete
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isCircuitComplete ? '⏹️ Stop' : '▶️ Start Electrolysis'}
          </button>

          {electrolysisProgress > 50 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-cyan-400"
            >
              💡 Notice: H₂ bubbles are twice as many as O₂ (2:1 ratio)!
            </motion.p>
          )}
        </>
      )}

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Green Hydrogen:</span> India aims to become a global hub 
          for green hydrogen production using electrolysis powered by renewable energy!
        </p>
      </motion.div>
    </div>
  );
}
