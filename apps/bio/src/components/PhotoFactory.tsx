import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Droplets, Wind, RotateCcw, Trophy, Leaf } from 'lucide-react';
import { playCollect, playVictory } from '../lib/sounds';

interface PlantState {
  height: number;     // 0-100
  leaves: number;     // 0-20
  flowers: number;    // 0-5
  health: number;     // 0-100
  glucose: number;    // stored energy
  o2Produced: number;
}

interface Challenge {
  name: string;
  emoji: string;
  target: string;
  check: (plant: PlantState) => boolean;
  reward: number;
}

const challenges: Challenge[] = [
  { name: 'Sprout!', emoji: '🌱', target: 'Grow to 10cm', check: p => p.height >= 10, reward: 50 },
  { name: 'Leafy', emoji: '🍃', target: 'Grow 5 leaves', check: p => p.leaves >= 5, reward: 75 },
  { name: 'Teenager', emoji: '🌿', target: 'Reach 40cm tall', check: p => p.height >= 40, reward: 100 },
  { name: 'Oxygen Maker', emoji: '🫧', target: 'Produce 50ml O₂', check: p => p.o2Produced >= 50, reward: 100 },
  { name: 'Full Grown', emoji: '🌳', target: 'Reach 80cm', check: p => p.height >= 80, reward: 150 },
  { name: 'Blooming!', emoji: '🌸', target: 'Grow a flower', check: p => p.flowers >= 1, reward: 200 },
  { name: 'Garden Star', emoji: '⭐', target: '3 flowers + 100cm', check: p => p.flowers >= 3 && p.height >= 100, reward: 500 },
];

export default function PhotoFactory() {
  const [plant, setPlant] = useState<PlantState>({ height: 0, leaves: 0, flowers: 0, health: 80, glucose: 0, o2Produced: 0 });
  const [light, setLight] = useState(50);
  const [water, setWater] = useState(50);
  const [co2, setCo2] = useState(50);
  const [isGrowing, setIsGrowing] = useState(false);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [day, setDay] = useState(1);
  const [dayNight, setDayNight] = useState<'day' | 'night'>('day');
  const [message, setMessage] = useState('');

  // Growth simulation
  useEffect(() => {
    if (!isGrowing) return;
    const interval = setInterval(() => {
      setPlant(prev => {
        const isDay = dayNight === 'day';
        const lightEff = isDay ? light / 100 : 0;
        const waterEff = water / 100;
        const co2Eff = co2 / 100;
        const photoRate = Math.min(lightEff, waterEff, co2Eff);

        // Respiration always happens
        const respirationCost = 0.3;

        // Photosynthesis only during day
        const glucoseGain = isDay ? photoRate * 2 : 0;
        const netGlucose = prev.glucose + glucoseGain - respirationCost;

        // Growth based on glucose reserves
        const canGrow = netGlucose > 5;
        const growthRate = canGrow ? photoRate * 0.5 : 0;

        // Water consumption
        const newWater = Math.max(0, water - (isDay ? photoRate * 1.2 : 0.3));
        setWater(newWater);

        // CO₂ consumption
        const newCo2 = Math.max(0, co2 - (isDay ? photoRate * 0.8 : -0.2)); // plants release CO₂ at night!
        setCo2(Math.min(100, newCo2));

        // Health
        let health = prev.health;
        if (water < 10) { health -= 2; setMessage('💀 Plant is drying out! Add water!'); }
        else if (light > 90 && water < 30) { health -= 1; setMessage('🔥 Too much sun without water!'); }
        else if (prev.glucose < 2) { health -= 1; setMessage('😰 Not enough energy!'); }
        else { health = Math.min(100, health + 0.3); setMessage(''); }

        const newHeight = Math.min(120, prev.height + growthRate * 0.8);
        const newLeaves = newHeight > 5 ? Math.min(20, prev.leaves + (canGrow && newHeight > prev.height + 0.3 ? 0.08 : 0)) : 0;
        const newFlowers = newHeight > 70 && health > 60 && netGlucose > 20 ? Math.min(5, prev.flowers + 0.01) : prev.flowers;
        const newO2 = prev.o2Produced + (isDay ? photoRate * 1.5 : 0);

        return {
          height: newHeight,
          leaves: newLeaves,
          flowers: newFlowers,
          health: Math.max(0, Math.min(100, health)),
          glucose: Math.max(0, Math.min(100, netGlucose)),
          o2Produced: newO2,
        };
      });

      // Day/night cycle
      setDay(d => {
        const newDay = d + 0.02;
        setDayNight(Math.floor(newDay) % 2 === 0 ? 'day' : 'night');
        return newDay;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isGrowing, light, water, co2, dayNight]);

  // Challenge checking
  useEffect(() => {
    challenges.forEach(ch => {
      if (!completedChallenges.has(ch.name) && ch.check(plant)) {
        setCompletedChallenges(prev => new Set(prev).add(ch.name));
        setScore(s => s + ch.reward);
        setMessage(`🎉 Challenge complete: ${ch.emoji} ${ch.name}! +${ch.reward} pts`);
        if (ch.reward >= 200) playVictory(); else playCollect();
      }
    });
  }, [plant, completedChallenges]);

  const reset = useCallback(() => {
    setPlant({ height: 0, leaves: 0, flowers: 0, health: 80, glucose: 0, o2Produced: 0 });
    setLight(50); setWater(50); setCo2(50);
    setIsGrowing(false); setScore(0);
    setCompletedChallenges(new Set());
    setDay(1); setDayNight('day'); setMessage('');
  }, []);

  // Visual plant rendering
  const stemHeight = Math.min(180, plant.height * 1.8);
  const leafCount = Math.floor(plant.leaves);
  const flowerCount = Math.floor(plant.flowers);

  return (
    <div className="min-h-screen bg-gray-950 pt-16 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">🌱 Photosynthesis Factory</h2>
          <p className="text-gray-400 text-sm">Balance sunlight, water, and CO₂ to grow your plant!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Plant Visualization */}
          <div className="lg:col-span-2">
            <div className={`relative rounded-2xl border-2 overflow-hidden min-h-[380px] transition-colors duration-1000 ${dayNight === 'day' ? 'border-yellow-500/20 bg-gradient-to-b from-sky-950/40 via-sky-950/20 to-green-950/30' : 'border-indigo-500/20 bg-gradient-to-b from-indigo-950/60 via-gray-950 to-green-950/20'}`}>

                {/* Sun/Moon */}
                <motion.div className="absolute top-4 right-6"
                  animate={{ y: dayNight === 'day' ? 0 : -40, opacity: dayNight === 'day' ? 1 : 0.3 }}>
                  {dayNight === 'day' ? (
                    <Sun className="w-12 h-12 text-yellow-400" style={{ filter: `drop-shadow(0 0 ${light / 5}px #facc15)` }} />
                  ) : (
                    <span className="text-4xl">🌙</span>
                  )}
                </motion.div>

                {/* Day counter */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur rounded-lg px-3 py-1 text-xs">
                  <span className="text-gray-400">Day</span> <span className="text-white font-bold">{Math.floor(day / 2) + 1}</span>
                  <span className={`ml-2 ${dayNight === 'day' ? 'text-yellow-400' : 'text-indigo-400'}`}>{dayNight === 'day' ? '☀️ Day' : '🌙 Night'}</span>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/40 to-transparent" />

                {/* Plant SVG */}
                <svg viewBox="0 0 300 300" className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-64">
                  {/* Stem */}
                  {stemHeight > 0 && (
                    <line x1="150" y1="280" x2="150" y2={280 - stemHeight} stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                  )}
                  {/* Leaves */}
                  {Array.from({ length: leafCount }).map((_, i) => {
                    const y = 280 - (stemHeight * (i + 1) / (leafCount + 1));
                    const side = i % 2 === 0 ? -1 : 1;
                    const size = 8 + Math.min(12, plant.height / 10);
                    return (
                      <ellipse key={`leaf-${i}`}
                        cx={150 + side * (size + 5)} cy={y}
                        rx={size} ry={size / 2.5}
                        fill="#22c55e" opacity={plant.health / 120 + 0.2}
                        transform={`rotate(${side * 30}, ${150 + side * (size + 5)}, ${y})`} />
                    );
                  })}
                  {/* Flowers */}
                  {Array.from({ length: flowerCount }).map((_, i) => {
                    const topY = 280 - stemHeight;
                    const cx = 150 + (i - Math.floor(flowerCount / 2)) * 20;
                    return (
                      <g key={`flower-${i}`}>
                        {[0, 72, 144, 216, 288].map(angle => {
                          const rad = (angle * Math.PI) / 180;
                          return (
                            <ellipse key={angle}
                              cx={cx + Math.cos(rad) * 7} cy={topY - 5 + Math.sin(rad) * 7}
                              rx="5" ry="8" fill="#ec4899" opacity="0.8"
                              transform={`rotate(${angle}, ${cx + Math.cos(rad) * 7}, ${topY - 5 + Math.sin(rad) * 7})`} />
                          );
                        })}
                        <circle cx={cx} cy={topY - 5} r="4" fill="#f59e0b" />
                      </g>
                    );
                  })}
                  {/* Seed (if no growth yet) */}
                  {plant.height < 2 && (
                    <ellipse cx="150" cy="275" rx="5" ry="3" fill="#92400e" />
                  )}
                </svg>

                {/* O₂ bubbles */}
                {isGrowing && dayNight === 'day' && light > 20 && Array.from({ length: Math.floor(light / 25) }).map((_, i) => (
                  <motion.div key={`o2-${i}`}
                    className="absolute text-[8px] text-blue-300/40 font-mono"
                    style={{ left: `${35 + Math.random() * 30}%`, bottom: '20%' }}
                    animate={{ y: [0, -60], opacity: [0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random(), delay: i * 0.5 }}>
                    O₂
                  </motion.div>
                ))}

                {/* Message */}
                {message && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap">
                    {message}
                  </motion.div>
                )}
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[
                  { label: 'Height', value: `${plant.height.toFixed(0)}cm`, color: 'text-green-400', pct: plant.height },
                  { label: 'Health', value: `${plant.health.toFixed(0)}%`, color: plant.health > 50 ? 'text-emerald-400' : 'text-red-400', pct: plant.health },
                  { label: 'Glucose', value: `${plant.glucose.toFixed(0)}`, color: 'text-yellow-400', pct: plant.glucose },
                  { label: 'O₂ Made', value: `${plant.o2Produced.toFixed(0)}ml`, color: 'text-blue-400', pct: Math.min(100, plant.o2Produced) },
                ].map(s => (
                  <div key={s.label} className="bg-gray-900 rounded-lg p-2 text-center border border-gray-800">
                    <div className="text-[9px] text-gray-500 uppercase">{s.label}</div>
                    <div className={`text-sm font-black ${s.color}`}>{s.value}</div>
                    <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-current rounded-full transition-all" style={{ width: `${Math.min(100, s.pct)}%`, color: s.color.includes('red') ? '#ef4444' : '#10b981' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { label: 'Sunlight', icon: Sun, value: light, set: setLight, color: '#facc15', emoji: '☀️' },
                  { label: 'Water', icon: Droplets, value: water, set: setWater, color: '#38bdf8', emoji: '💧' },
                  { label: 'CO₂', icon: Wind, value: co2, set: setCo2, color: '#a3a3a3', emoji: '💨' },
                ].map(c => (
                  <div key={c.label} className="bg-gray-900 rounded-xl border border-gray-800 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">{c.emoji} {c.label}</span>
                      <span className="text-xs font-mono" style={{ color: c.color }}>{c.value.toFixed(0)}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={c.value}
                      onChange={e => c.set(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, ${c.color}66 ${c.value}%, #374151 ${c.value}%)` }} />
                    {c.label === 'Water' && (
                      <button onClick={() => setWater(w => Math.min(100, w + 25))}
                        className="w-full mt-1.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-bold hover:bg-blue-500/30 active:scale-95">
                        💧 Add Water (+25)
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => setIsGrowing(!isGrowing)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 ${isGrowing ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isGrowing ? '⏸ Pause' : '▶️ Start Growing'}
                </button>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 active:scale-95">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
          </div>

          {/* Challenges sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Challenges</h3>
                <span className="text-xs text-yellow-400 font-bold">{score} pts</span>
              </div>
              <div className="space-y-2">
                {challenges.map(ch => {
                  const done = completedChallenges.has(ch.name);
                  return (
                    <div key={ch.name} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${done ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-gray-800/50'}`}>
                      <span className="text-lg">{done ? '✅' : ch.emoji}</span>
                      <div className="flex-1">
                        <div className={`font-bold ${done ? 'text-emerald-400' : 'text-white'}`}>{ch.name}</div>
                        <div className="text-[10px] text-gray-500">{ch.target}</div>
                      </div>
                      <span className={`text-[10px] font-bold ${done ? 'text-emerald-400' : 'text-gray-600'}`}>+{ch.reward}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-green-400" /> Growth Tips
              </h4>
              <ul className="text-[10px] text-gray-400 space-y-1">
                <li>• Photosynthesis only works during ☀️ daytime</li>
                <li>• Plants respire at night (use glucose, release CO₂)</li>
                <li>• Balance all 3 resources for optimal growth</li>
                <li>• Water depletes faster with more sun</li>
                <li>• Flowers appear after 70cm height & good health</li>
                <li>• Too much sun + low water = sunburn!</li>
              </ul>
            </div>

            {/* Science box */}
            <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-4">
              <div className="text-[10px] text-green-400 font-bold mb-1">🧬 The Science</div>
              <div className="text-[10px] text-gray-300 font-mono bg-black/20 rounded p-2 mb-2">
                6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
              </div>
              <p className="text-[10px] text-gray-400">
                Your plant converts carbon dioxide and water into glucose (energy) and oxygen using sunlight. The glucose fuels growth!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
