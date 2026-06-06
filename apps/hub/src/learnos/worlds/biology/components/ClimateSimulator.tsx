import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Thermometer, TreeDeciduous, Factory, Waves } from 'lucide-react';

interface SimulationState {
  year: number;
  co2: number; // ppm
  temperature: number; // °C anomaly from pre-industrial
  seaLevel: number; // cm rise
  forestCover: number; // percentage
  iceSheets: number; // percentage remaining
  extremeEvents: number; // per decade
}

const baselineYear = 2024;
const baselineCO2 = 420;
const baselineTemp = 1.1;
const baselineSeaLevel = 20;
const baselineForest = 31;
const baselineIce = 85;

const co2Molecules = Array.from({ length: 20 }, (_, i) => ({
  x: `${(i * 37) % 100}%`,
  y: `${(i * 19) % 60}%`,
  duration: 2 + ((i * 11) % 20) / 10,
  delay: ((i * 7) % 20) / 10,
}));

export default function ClimateSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [state, setState] = useState<SimulationState>({
    year: baselineYear,
    co2: baselineCO2,
    temperature: baselineTemp,
    seaLevel: baselineSeaLevel,
    forestCover: baselineForest,
    iceSheets: baselineIce,
    extremeEvents: 15,
  });

  // Policy sliders (actions we can take)
  const [emissions, setEmissions] = useState(50); // 0 = net zero, 100 = current path
  const [deforestation, setDeforestation] = useState(50); // 0 = full reforestation, 100 = max deforestation
  const [renewables, setRenewables] = useState(30); // % of energy from renewables

  const reset = () => {
    setIsRunning(false);
    setState({
      year: baselineYear,
      co2: baselineCO2,
      temperature: baselineTemp,
      seaLevel: baselineSeaLevel,
      forestCover: baselineForest,
      iceSheets: baselineIce,
      extremeEvents: 15,
    });
    setEmissions(50);
    setDeforestation(50);
    setRenewables(30);
  };

  // Simulation logic
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.year >= 2150) {
          setIsRunning(false);
          return prev;
        }

        // Calculate changes based on policies
        const emissionFactor = (emissions - 50) / 50; // -1 to 1
        const forestFactor = (deforestation - 50) / 50; // -1 to 1
        const renewableFactor = renewables / 100;

        // CO2 change per year
        const co2Change = 2.5 * emissionFactor * (1 - renewableFactor * 0.5) + 0.5 * forestFactor;
        const newCO2 = Math.max(280, prev.co2 + co2Change);

        // Temperature follows CO2 with some lag
        const co2Effect = (newCO2 - 280) * 0.008; // ~3°C per doubling
        const newTemp = 0.8 * prev.temperature + 0.2 * co2Effect;

        // Sea level rises with temperature
        const seaLevelChange = 0.3 + newTemp * 0.2;
        const newSeaLevel = prev.seaLevel + seaLevelChange / 10;

        // Forest cover
        const forestChange = -0.2 * forestFactor + (renewableFactor > 0.5 ? 0.1 : 0);
        const newForest = Math.max(5, Math.min(50, prev.forestCover + forestChange));

        // Ice sheets
        const iceChange = -0.3 * Math.max(0, newTemp - 1);
        const newIce = Math.max(0, prev.iceSheets + iceChange);

        // Extreme events increase with temperature
        const newEvents = Math.floor(10 + newTemp * 15);

        return {
          year: prev.year + 1,
          co2: newCO2,
          temperature: newTemp,
          seaLevel: newSeaLevel,
          forestCover: newForest,
          iceSheets: newIce,
          extremeEvents: newEvents,
        };
      });
    }, 500 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, emissions, deforestation, renewables]);

  const getTemperatureColor = (temp: number) => {
    if (temp < 1.5) return 'text-green-400';
    if (temp < 2) return 'text-yellow-400';
    if (temp < 3) return 'text-orange-400';
    return 'text-red-500';
  };

  const getScenarioLabel = () => {
    const avgPolicy = (emissions + deforestation + (100 - renewables)) / 3;
    if (avgPolicy < 20) return { label: 'Aggressive Climate Action', color: 'text-green-400', emoji: '🌱' };
    if (avgPolicy < 40) return { label: 'Sustainable Path', color: 'text-emerald-400', emoji: '🌍' };
    if (avgPolicy < 60) return { label: 'Current Policies', color: 'text-yellow-400', emoji: '⚠️' };
    if (avgPolicy < 80) return { label: 'High Emissions', color: 'text-orange-400', emoji: '🏭' };
    return { label: 'Worst Case', color: 'text-red-500', emoji: '🔥' };
  };

  const scenario = getScenarioLabel();

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🌡️ Climate Simulator</h2>
          <p className="text-gray-400 text-lg">Explore how our choices today shape the planet's future</p>
        </motion.div>

        {/* Year & Scenario */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 px-6 py-3 text-center">
            <div className="text-sm text-gray-500 uppercase font-bold">Year</div>
            <div className="text-3xl font-black text-white">{state.year}</div>
          </div>
          <div className={`bg-gray-900 rounded-xl border border-gray-800 px-6 py-3 text-center`}>
            <div className="text-sm text-gray-500 uppercase font-bold">Scenario</div>
            <div className={`text-lg font-bold ${scenario.color}`}>{scenario.emoji} {scenario.label}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Factory className="w-4 h-4 text-gray-400" /> Policy Controls
              </h3>

              {/* Emissions */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Fossil Fuel Emissions</span>
                  <span className="text-sm font-mono text-gray-300">{emissions < 30 ? 'Net Zero Path' : emissions < 70 ? 'Moderate' : 'High'}</span>
                </div>
                <input type="range" min="0" max="100" value={emissions} onChange={e => setEmissions(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #22c55e ${emissions}%, #374151 ${emissions}%)` }} />
                <div className="flex justify-between text-sm text-gray-600 mt-0.5">
                  <span>🌱 Net Zero</span>
                  <span>🏭 High Emissions</span>
                </div>
              </div>

              {/* Deforestation */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Deforestation Rate</span>
                  <span className="text-sm font-mono text-gray-300">{deforestation < 30 ? 'Reforestation' : deforestation < 70 ? 'Current' : 'Accelerated'}</span>
                </div>
                <input type="range" min="0" max="100" value={deforestation} onChange={e => setDeforestation(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #22c55e ${deforestation}%, #374151 ${deforestation}%)` }} />
                <div className="flex justify-between text-sm text-gray-600 mt-0.5">
                  <span>🌳 Reforestation</span>
                  <span>🪓 Deforestation</span>
                </div>
              </div>

              {/* Renewables */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Renewable Energy</span>
                  <span className="text-sm font-mono text-emerald-400">{renewables}%</span>
                </div>
                <input type="range" min="0" max="100" value={renewables} onChange={e => setRenewables(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #22c55e ${renewables}%, #374151 ${renewables}%)` }} />
                <div className="flex justify-between text-sm text-gray-600 mt-0.5">
                  <span>⛽ Fossil</span>
                  <span>☀️ 100% Renewable</span>
                </div>
              </div>
            </div>

            {/* Simulation controls */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex gap-2 mb-3">
                <button onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${isRunning ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Pause' : 'Simulate'}
                </button>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Speed:</span>
                {[1, 2, 5, 10].map(s => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-sm font-bold ${speed === s ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Paris Agreement targets */}
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="text-sm text-blue-400 font-bold mb-2">🌍 Paris Agreement Targets</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center gap-2">
                  <span className={state.temperature < 1.5 ? 'text-green-400' : 'text-orange-400'}>
                    {state.temperature < 1.5 ? '✓' : '✗'}
                  </span>
                  Keep warming below 1.5°C
                </li>
                <li className="flex items-center gap-2">
                  <span className={state.temperature < 2 ? 'text-green-400' : 'text-orange-400'}>
                    {state.temperature < 2 ? '✓' : '✗'}
                  </span>
                  Keep warming below 2°C
                </li>
              </ul>
            </div>
          </div>

          {/* Main display */}
          <div className="lg:col-span-2 space-y-4">
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Thermometer className="w-3 h-3" /> Temperature Rise
                </div>
                <div className={`text-2xl font-black ${getTemperatureColor(state.temperature)}`}>
                  +{state.temperature.toFixed(1)}°C
                </div>
                <div className="text-sm text-gray-600">vs pre-industrial</div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Factory className="w-3 h-3" /> CO₂ Level
                </div>
                <div className={`text-2xl font-black ${state.co2 > 450 ? 'text-orange-400' : state.co2 > 400 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {Math.round(state.co2)} ppm
                </div>
                <div className="text-sm text-gray-600">Pre-industrial: 280 ppm</div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Waves className="w-3 h-3" /> Sea Level Rise
                </div>
                <div className={`text-2xl font-black ${state.seaLevel > 50 ? 'text-orange-400' : state.seaLevel > 30 ? 'text-yellow-400' : 'text-blue-400'}`}>
                  +{state.seaLevel.toFixed(0)} cm
                </div>
                <div className="text-sm text-gray-600">vs 1900 baseline</div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <TreeDeciduous className="w-3 h-3" /> Forest Cover
                </div>
                <div className={`text-2xl font-black ${state.forestCover > 30 ? 'text-green-400' : state.forestCover > 20 ? 'text-yellow-400' : 'text-orange-400'}`}>
                  {state.forestCover.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">of land surface</div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-sm text-gray-500 mb-1">🧊 Ice Sheets</div>
                <div className={`text-2xl font-black ${state.iceSheets > 70 ? 'text-cyan-400' : state.iceSheets > 40 ? 'text-yellow-400' : 'text-orange-400'}`}>
                  {state.iceSheets.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">remaining</div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-sm text-gray-500 mb-1">⛈️ Extreme Events</div>
                <div className={`text-2xl font-black ${state.extremeEvents > 30 ? 'text-orange-400' : state.extremeEvents > 20 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  ~{state.extremeEvents}/decade
                </div>
                <div className="text-sm text-gray-600">floods, fires, storms</div>
              </div>
            </div>

            {/* Visual representation */}
            <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-green-950 rounded-2xl border border-gray-700 p-6 relative overflow-hidden min-h-[200px]">
              {/* Sun */}
              <motion.div className="absolute top-4 right-8"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 3 }}>
                <div className="w-16 h-16 rounded-full bg-yellow-400"
                  style={{ boxShadow: `0 0 ${20 + state.temperature * 10}px #facc15` }} />
              </motion.div>

              {/* CO2 molecules */}
              {co2Molecules.slice(0, Math.min(20, Math.floor((state.co2 - 280) / 10))).map((molecule, i) => (
                <motion.div key={i}
                  className="absolute text-sm opacity-30"
                  initial={{ x: molecule.x, y: molecule.y }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: molecule.duration, delay: molecule.delay }}>
                  CO₂
                </motion.div>
              ))}

              {/* Water level */}
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all duration-500"
                style={{ height: `${20 + state.seaLevel / 2}%` }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-blue-400/50 to-transparent" />
              </div>

              {/* Land */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-2">
                {Array.from({ length: Math.floor(state.forestCover / 5) }).map((_, i) => (
                  <span key={i} className="text-2xl">🌳</span>
                ))}
              </div>

              {/* Ice */}
              <div className="absolute top-1/4 left-8 text-4xl opacity-70"
                style={{ opacity: state.iceSheets / 100 }}>
                🧊
              </div>

              {/* Temperature indicator */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur rounded-lg px-3 py-2">
                <span className={`text-lg font-bold ${getTemperatureColor(state.temperature)}`}>
                  +{state.temperature.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Impacts */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-3">📊 Projected Impacts at Current Trajectory</h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { temp: 1.5, impact: 'Coral reefs decline 70-90%', emoji: '🪸' },
                  { temp: 2.0, impact: 'Sea level rise threatens coastal cities', emoji: '🌊' },
                  { temp: 2.5, impact: 'Amazon rainforest begins dieback', emoji: '🌳' },
                  { temp: 3.0, impact: 'Mass extinction event likely', emoji: '🦕' },
                  { temp: 4.0, impact: 'Large areas become uninhabitable', emoji: '🏜️' },
                  { temp: 5.0, impact: 'Civilization-threatening changes', emoji: '⚠️' },
                ].map(item => (
                  <div key={item.temp}
                    className={`flex items-center gap-2 p-2 rounded-lg ${state.temperature >= item.temp ? 'bg-red-500/20 text-red-300' : 'bg-gray-800/50 text-gray-500'}`}>
                    <span>{item.emoji}</span>
                    <span>+{item.temp}°C: {item.impact}</span>
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
