import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw, TrendingUp, AlertTriangle, Cloud } from 'lucide-react';

interface Organism {
  id: string;
  name: string;
  emoji: string;
  type: 'producer' | 'primary' | 'secondary' | 'apex' | 'decomposer';
  population: number;
  maxPop: number;
  eats: string[];
  color: string;
  description: string;
}

const availableOrganisms: Omit<Organism, 'id' | 'population'>[] = [
  { name: 'Grass', emoji: '🌱', type: 'producer', maxPop: 120, eats: [], color: '#22c55e', description: 'Fast-growing ground cover, foundation of food webs' },
  { name: 'Flowers', emoji: '🌻', type: 'producer', maxPop: 100, eats: [], color: '#eab308', description: 'Attract pollinators, produce nectar' },
  { name: 'Algae', emoji: '🟢', type: 'producer', maxPop: 150, eats: [], color: '#10b981', description: 'Aquatic producer, base of water food chains' },
  { name: 'Oak Tree', emoji: '🌳', type: 'producer', maxPop: 40, eats: [], color: '#15803d', description: 'Slow-growing but high biomass, produces acorns' },
  { name: 'Rabbit', emoji: '🐰', type: 'primary', maxPop: 80, eats: ['Grass', 'Flowers'], color: '#a78bfa', description: 'Fast breeder, preyed upon by many species' },
  { name: 'Deer', emoji: '🦌', type: 'primary', maxPop: 50, eats: ['Grass', 'Flowers', 'Oak Tree'], color: '#f59e0b', description: 'Large herbivore, browses on plants' },
  { name: 'Butterfly', emoji: '🦋', type: 'primary', maxPop: 70, eats: ['Flowers'], color: '#ec4899', description: 'Pollinator, depends heavily on flowers' },
  { name: 'Fish', emoji: '🐟', type: 'primary', maxPop: 90, eats: ['Algae'], color: '#3b82f6', description: 'Aquatic consumer, eats algae' },
  { name: 'Squirrel', emoji: '🐿️', type: 'primary', maxPop: 60, eats: ['Oak Tree', 'Flowers'], color: '#d97706', description: 'Collects and stores acorns, plant seed disperser' },
  { name: 'Fox', emoji: '🦊', type: 'secondary', maxPop: 30, eats: ['Rabbit', 'Butterfly', 'Squirrel'], color: '#f97316', description: 'Cunning predator, controls rodent populations' },
  { name: 'Eagle', emoji: '🦅', type: 'secondary', maxPop: 20, eats: ['Rabbit', 'Fish', 'Squirrel'], color: '#6366f1', description: 'Apex aerial predator with keen eyesight' },
  { name: 'Snake', emoji: '🐍', type: 'secondary', maxPop: 25, eats: ['Rabbit', 'Fish', 'Butterfly'], color: '#84cc16', description: 'Stealthy predator, controls small animal populations' },
  { name: 'Wolf', emoji: '🐺', type: 'apex', maxPop: 15, eats: ['Deer', 'Rabbit', 'Fox'], color: '#64748b', description: 'Pack hunter, top predator controlling herbivores' },
  { name: 'Bear', emoji: '🐻', type: 'apex', maxPop: 10, eats: ['Deer', 'Fish', 'Rabbit'], color: '#92400e', description: 'Omnivore apex predator, keystone species' },
  { name: 'Mushroom', emoji: '🍄', type: 'decomposer', maxPop: 80, eats: [], color: '#be185d', description: 'Breaks down dead organic matter, recycles nutrients' },
  { name: 'Bacteria', emoji: '🦠', type: 'decomposer', maxPop: 100, eats: [], color: '#14b8a6', description: 'Microscopic decomposers, essential for nutrient cycling' },
  { name: 'Earthworm', emoji: '🪱', type: 'decomposer', maxPop: 90, eats: [], color: '#b45309', description: 'Aerates soil, processes dead plant material' },
];

const typeLabels: Record<string, string> = { producer: '🌿 Producers', primary: '🐰 Primary Consumers', secondary: '🦊 Secondary Consumers', apex: '🐺 Apex Predators', decomposer: '♻️ Decomposers' };
const typeColors: Record<string, string> = { producer: 'bg-green-500/15 border-green-500/30', primary: 'bg-blue-500/15 border-blue-500/30', secondary: 'bg-orange-500/15 border-orange-500/30', apex: 'bg-red-500/15 border-red-500/30', decomposer: 'bg-purple-500/15 border-purple-500/30' };

type WeatherEvent = { name: string; emoji: string; effect: string; duration: number };
const weatherEvents: WeatherEvent[] = [
  { name: 'Sunny Day', emoji: '☀️', effect: 'Producers thrive! +20% growth', duration: 2 },
  { name: 'Heavy Rain', emoji: '🌧️', effect: 'Algae blooms, some animals struggle', duration: 2 },
  { name: 'Drought', emoji: '🏜️', effect: 'All populations decline', duration: 3 },
  { name: 'Wildfire', emoji: '🔥', effect: 'Producers heavily damaged', duration: 1 },
  { name: 'Mild Weather', emoji: '⛅', effect: 'Balanced growth for all', duration: 2 },
];

export default function EcosystemGame() {
  const [ecosystem, setEcosystem] = useState<Organism[]>([]);
  const [turn, setTurn] = useState(0);
  const [messages, setMessages] = useState<string[]>(['🌍 Welcome! Start adding organisms to build your ecosystem.']);
  const [score, setScore] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherEvent>(weatherEvents[4]);
  const [weatherTurnsLeft, setWeatherTurnsLeft] = useState(0);
  const [popHistory, setPopHistory] = useState<{ turn: number; producers: number; consumers: number; predators: number }[]>([]);

  const addOrganism = (org: Omit<Organism, 'id' | 'population'>) => {
    const newOrg: Organism = { ...org, id: `${org.name}-${Date.now()}`, population: Math.floor(org.maxPop * 0.3) };
    setEcosystem(prev => [...prev, newOrg]);
    setMessages(prev => [`➕ Added ${org.emoji} ${org.name} (pop: ${newOrg.population})`, ...prev.slice(0, 6)]);
  };

  const removeOrganism = (id: string) => {
    const org = ecosystem.find(o => o.id === id);
    setEcosystem(prev => prev.filter(o => o.id !== id));
    if (org) setMessages(prev => [`🗑️ Removed ${org.emoji} ${org.name}`, ...prev.slice(0, 6)]);
  };

  const simulateTurn = useCallback(() => {
    if (ecosystem.length === 0) return;
    const newTurn = turn + 1;
    setTurn(newTurn);
    const newMessages: string[] = [];

    // Weather
    let weather = currentWeather;
    if (weatherTurnsLeft <= 0) {
      weather = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
      setCurrentWeather(weather);
      setWeatherTurnsLeft(weather.duration);
      newMessages.push(`🌤️ Weather: ${weather.emoji} ${weather.name} — ${weather.effect}`);
    } else {
      setWeatherTurnsLeft(w => w - 1);
    }

    setEcosystem(prev => {
      const updated = prev.map(org => {
        let pop = org.population;
        const variation = () => Math.floor(Math.random() * 3) - 1;

        if (org.type === 'producer') {
          let growth = Math.floor(Math.random() * 6) + 3;
          if (weather.name === 'Sunny Day') growth = Math.floor(growth * 1.5);
          if (weather.name === 'Drought') growth = -Math.floor(Math.random() * 8) - 3;
          if (weather.name === 'Wildfire') growth = -Math.floor(pop * 0.4);
          if (weather.name === 'Heavy Rain' && org.name === 'Algae') growth *= 2;
          const herbivores = prev.filter(p => p.type === 'primary' && p.eats.includes(org.name));
          const herbPressure = herbivores.reduce((sum, h) => sum + Math.floor(h.population * 0.08), 0);
          pop = Math.max(2, Math.min(org.maxPop, pop + growth - herbPressure + variation()));
        } else if (org.type === 'primary') {
          const foodAvailable = prev.filter(p => org.eats.includes(p.name));
          const totalFood = foodAvailable.reduce((sum, f) => sum + f.population, 0);
          if (totalFood > 10) {
            pop = Math.min(org.maxPop, pop + Math.floor(Math.random() * 4) + 1 + variation());
          } else {
            pop = Math.max(0, pop - Math.floor(Math.random() * 5) - 2);
            if (pop < 8) newMessages.push(`⚠️ ${org.emoji} ${org.name} is starving!`);
          }
          if (weather.name === 'Drought') pop = Math.max(0, pop - 3);
          const predators = prev.filter(p => (p.type === 'secondary' || p.type === 'apex') && p.eats.includes(org.name));
          const predPressure = predators.reduce((sum, p) => sum + Math.floor(p.population * 0.15), 0);
          pop = Math.max(0, pop - predPressure);
        } else if (org.type === 'secondary' || org.type === 'apex') {
          const preyAvailable = prev.filter(p => org.eats.includes(p.name));
          const totalPrey = preyAvailable.reduce((sum, p) => sum + p.population, 0);
          if (totalPrey > 5) {
            pop = Math.min(org.maxPop, pop + Math.floor(Math.random() * 2) + 1);
          } else {
            pop = Math.max(0, pop - Math.floor(Math.random() * 4) - 2);
            if (pop < 5) newMessages.push(`⚠️ ${org.emoji} ${org.name} can't find prey!`);
          }
          if (weather.name === 'Drought') pop = Math.max(0, pop - 2);
        } else { // decomposer
          const totalBiomass = prev.reduce((sum, p) => sum + p.population, 0);
          pop = Math.min(org.maxPop, pop + (totalBiomass > 50 ? 3 : 1) + variation());
        }

        return { ...org, population: Math.max(0, pop) };
      }).filter(org => org.population > 0);

      const removed = prev.filter(o => !updated.find(u => u.id === o.id));
      removed.forEach(r => newMessages.push(`💀 ${r.emoji} ${r.name} went EXTINCT!`));

      // Population history
      const producers = updated.filter(o => o.type === 'producer').reduce((s, o) => s + o.population, 0);
      const consumers = updated.filter(o => o.type === 'primary').reduce((s, o) => s + o.population, 0);
      const predators = updated.filter(o => o.type === 'secondary' || o.type === 'apex').reduce((s, o) => s + o.population, 0);
      setPopHistory(h => [...h, { turn: newTurn, producers, consumers, predators }].slice(-20));

      return updated;
    });

    const types = new Set(ecosystem.map(o => o.type));
    setScore(s => s + types.size * 5 + ecosystem.length * 2);
    setMessages(prev => [...newMessages, `🔄 Turn ${newTurn} complete`, ...prev.slice(0, 5)]);
  }, [ecosystem, turn, currentWeather, weatherTurnsLeft]);

  const reset = () => {
    setEcosystem([]); setTurn(0); setScore(0); setPopHistory([]);
    setMessages(['🌍 Ecosystem reset! Start fresh.']);
    setWeatherTurnsLeft(0);
  };

  const balance = (() => {
    const types = new Set(ecosystem.map(o => o.type));
    if (ecosystem.length === 0) return { label: 'Empty', color: 'text-gray-400', pct: 0 };
    if (types.size >= 4 && ecosystem.length >= 8) return { label: 'Thriving! 🌟', color: 'text-emerald-400', pct: 100 };
    if (types.size >= 3 && ecosystem.length >= 5) return { label: 'Balanced', color: 'text-green-400', pct: 70 };
    if (types.size >= 2) return { label: 'Growing', color: 'text-yellow-400', pct: 40 };
    return { label: 'Unstable', color: 'text-red-400', pct: 15 };
  })();

  // Mini population chart
  const maxHistVal = Math.max(1, ...popHistory.map(h => Math.max(h.producers, h.consumers, h.predators)));

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🌿 Ecosystem Builder</h2>
          <p className="text-gray-400 text-lg">Build, balance, and survive weather events!</p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
          {[
            { label: 'Turn', value: turn, color: 'text-white' },
            { label: 'Species', value: ecosystem.length, color: 'text-emerald-400' },
            { label: 'Score', value: score, color: 'text-purple-400' },
            { label: 'Weather', value: `${currentWeather.emoji} ${currentWeather.name}`, color: 'text-yellow-400', small: true },
            { label: 'Balance', value: balance.label, color: balance.color },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-2.5 text-center">
              <div className="text-gray-500 text-sm uppercase font-bold">{s.label}</div>
              <div className={`font-black ${s.color} ${s.small ? 'text-sm' : 'text-lg'}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-5">
          {/* Ecosystem View */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-b from-sky-950/20 via-green-950/15 to-amber-950/20 rounded-2xl border border-emerald-500/15 p-5 min-h-[350px]">
              {ecosystem.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="text-6xl mb-4">🏞️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Empty Ecosystem</h3>
                  <p className="text-gray-400 text-sm mb-4 max-w-md">Start by adding producers (plants), then herbivores, predators, and decomposers!</p>
                  <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600">
                    <Plus className="w-4 h-4 inline mr-1" /> Add First Organism
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(['producer', 'primary', 'secondary', 'apex', 'decomposer'] as const).map(type => {
                    const orgs = ecosystem.filter(o => o.type === type);
                    if (orgs.length === 0) return null;
                    return (
                      <div key={type}>
                        <div className="text-sm font-bold text-gray-500 uppercase mb-2">{typeLabels[type]}</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {orgs.map(org => (
                            <motion.div key={org.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className={`relative rounded-xl border p-3 ${typeColors[type]}`}>
                              <button onClick={() => removeOrganism(org.id)} className="absolute top-1.5 right-1.5 text-gray-600 hover:text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <div className="text-2xl mb-1">{org.emoji}</div>
                              <div className="text-white text-sm font-bold">{org.name}</div>
                              <div className="text-sm text-gray-500 mb-1">{org.description}</div>
                              <div className="flex items-center gap-1">
                                <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                  <motion.div className="h-full rounded-full"
                                    style={{ backgroundColor: org.color }}
                                    animate={{ width: `${(org.population / org.maxPop) * 100}%` }} />
                                </div>
                                <span className="text-sm text-gray-400 w-6 text-right">{org.population}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Food Web Visualization */}
            {ecosystem.length >= 3 && (
              <div className="mt-4 bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-sm font-bold text-white mb-3">🕸️ Food Web Connections</h3>
                <div className="flex flex-wrap gap-2">
                  {ecosystem.filter(o => o.eats.length > 0).map(predator => (
                    <div key={predator.id} className="bg-gray-800/50 rounded-lg p-2 text-sm">
                      <span className="text-white font-bold">{predator.emoji} {predator.name}</span>
                      <span className="text-gray-500 mx-1">eats</span>
                      {predator.eats.filter(prey => ecosystem.some(e => e.name === prey)).map((prey, i) => (
                        <span key={prey}>
                          {i > 0 && <span className="text-gray-600">, </span>}
                          <span className="text-emerald-400">{ecosystem.find(e => e.name === prey)?.emoji} {prey}</span>
                        </span>
                      ))}
                      {predator.eats.filter(prey => !ecosystem.some(e => e.name === prey)).length > 0 && (
                        <span className="text-red-400/60 ml-1">(missing: {predator.eats.filter(p => !ecosystem.some(e => e.name === p)).join(', ')})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Population Chart */}
            {popHistory.length > 1 && (
              <div className="mt-4 bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-sm font-bold text-white mb-3">📈 Population Trends</h3>
                <div className="flex items-end gap-0.5 h-24">
                  {popHistory.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-px" title={`Turn ${h.turn}`}>
                      <div className="rounded-t-sm bg-green-500/70" style={{ height: `${(h.producers / maxHistVal) * 100}%` }} />
                      <div className="bg-blue-500/70" style={{ height: `${(h.consumers / maxHistVal) * 100}%` }} />
                      <div className="rounded-b-sm bg-orange-500/70" style={{ height: `${(h.predators / maxHistVal) * 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" />Producers</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" />Consumers</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500" />Predators</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600">
                <Plus className="w-4 h-4" /> Add Organism
              </button>
              <button onClick={simulateTurn} disabled={ecosystem.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-40">
                <TrendingUp className="w-4 h-4" /> Simulate Turn
              </button>
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Weather Panel */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-blue-400" /> Current Weather
              </h3>
              <div className="text-3xl text-center mb-1">{currentWeather.emoji}</div>
              <div className="text-white text-center text-sm font-bold">{currentWeather.name}</div>
              <div className="text-gray-400 text-center text-sm">{currentWeather.effect}</div>
              {weatherTurnsLeft > 0 && (
                <div className="text-center text-sm text-gray-500 mt-1">{weatherTurnsLeft} turns remaining</div>
              )}
            </div>

            {/* Event Log */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Event Log
              </h3>
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                {messages.map((msg, i) => (
                  <motion.div key={`${i}-${msg}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-gray-300 bg-gray-800/50 rounded-lg px-2.5 py-1.5">
                    {msg}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-2">🎯 Strategy Tips</h4>
              <ul className="text-[11px] text-gray-400 space-y-1">
                <li>• Start with 2-3 producers for a food base</li>
                <li>• Add herbivores that eat your producers</li>
                <li>• Predators need prey to survive</li>
                <li>• Decomposers stabilize the ecosystem</li>
                <li>• Watch weather — droughts kill!</li>
                <li>• Too many predators = prey extinction</li>
                <li>• Diversity = higher score</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAdd(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-gray-900 rounded-2xl border border-gray-700 p-5 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Add Organism</h3>
                {(['producer', 'primary', 'secondary', 'apex', 'decomposer'] as const).map(type => (
                  <div key={type} className="mb-4">
                    <div className="text-sm font-bold text-gray-500 uppercase mb-2">{typeLabels[type]}</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {availableOrganisms.filter(o => o.type === type).map(org => {
                        const alreadyAdded = ecosystem.some(e => e.name === org.name);
                        return (
                          <button key={org.name} disabled={alreadyAdded}
                            onClick={() => { addOrganism(org); setShowAdd(false); }}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left text-sm transition-all ${alreadyAdded ? 'opacity-30 cursor-not-allowed border-gray-800' : `${typeColors[type]} hover:brightness-125`}`}>
                            <span className="text-xl">{org.emoji}</span>
                            <div className="min-w-0">
                              <div className="text-white font-bold truncate">{org.name}</div>
                              {org.eats.length > 0 && <div className="text-gray-500 text-sm truncate">Eats: {org.eats.join(', ')}</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowAdd(false)} className="mt-2 w-full py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium">Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
