import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { CanvasProps } from '../../types';

type MachineType = 'lever' | 'pulley' | 'wheel' | 'inclinedPlane' | 'wedge' | 'screw';

interface Machine {
  id: MachineType;
  name: string;
  emoji: string;
  description: string;
  indianExample: string;
  mechanicalAdvantage: string;
}

const machines: Machine[] = [
  {
    id: 'lever',
    name: 'Lever',
    emoji: '⚖️',
    description: 'A rigid bar that rotates around a fixed point (fulcrum). Makes lifting heavy objects easier!',
    indianExample: 'Traditional "tulaa" balance scales used in Indian markets for centuries',
    mechanicalAdvantage: 'MA = Distance from fulcrum to effort ÷ Distance from fulcrum to load',
  },
  {
    id: 'pulley',
    name: 'Pulley',
    emoji: '🔄',
    description: 'A wheel with a rope that changes the direction of force. More pulleys = less effort needed!',
    indianExample: 'Ancient Indian wells (baoli) used pulley systems to draw water',
    mechanicalAdvantage: 'MA = Number of supporting ropes',
  },
  {
    id: 'wheel',
    name: 'Wheel & Axle',
    emoji: '☸️',
    description: 'A wheel attached to a smaller cylinder (axle). Turns a small force into a larger one!',
    indianExample: 'Bullock cart wheels - used in India for over 4,000 years!',
    mechanicalAdvantage: 'MA = Radius of wheel ÷ Radius of axle',
  },
  {
    id: 'inclinedPlane',
    name: 'Inclined Plane',
    emoji: '📐',
    description: 'A flat surface set at an angle (ramp). Makes it easier to move things up!',
    indianExample: 'Ramps used to build ancient temples like Brihadeeswara (1000 CE)',
    mechanicalAdvantage: 'MA = Length of ramp ÷ Height of ramp',
  },
  {
    id: 'wedge',
    name: 'Wedge',
    emoji: '🔺',
    description: 'Two inclined planes joined together. Splits things apart or holds them in place!',
    indianExample: 'Traditional Indian axe (kulhaadi) for splitting wood',
    mechanicalAdvantage: 'MA = Length of wedge ÷ Width at thick end',
  },
  {
    id: 'screw',
    name: 'Screw',
    emoji: '🔩',
    description: 'An inclined plane wrapped around a cylinder. Converts rotation to linear motion!',
    indianExample: 'Archimedes screw principle used in Indian oil presses (ghani)',
    mechanicalAdvantage: 'MA = Circumference ÷ Pitch (distance between threads)',
  },
];

export function SimpleMachinesCanvas({ isPlaying }: CanvasProps) {
  const [selectedMachine, setSelectedMachine] = useState<MachineType>('lever');
  const [showInfo, setShowInfo] = useState(false);
  
  // Lever state
  const [leverEffort, setLeverEffort] = useState(50);
  const [fulcrumPosition, setFulcrumPosition] = useState(50);
  
  // Pulley state
  const [pulleyCount, setPulleyCount] = useState(1);
  const [pulleyLoad, setPulleyLoad] = useState(100);
  
  // Inclined plane state
  const [rampAngle, setRampAngle] = useState(30);
  
  const currentMachine = machines.find((m) => m.id === selectedMachine)!;

  // Calculate mechanical advantage for lever
  const leverMA = (100 - fulcrumPosition) / fulcrumPosition;
  const effectiveLoad = leverEffort * leverMA;

  // Calculate force needed for pulley
  const pulleyForce = pulleyLoad / pulleyCount;

  // Calculate force for inclined plane
  const inclinedForce = Math.round(100 * Math.sin((rampAngle * Math.PI) / 180));

  const renderMachine = () => {
    switch (selectedMachine) {
      case 'lever':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Fulcrum (Triangle) */}
            <div
              className="absolute bottom-32"
              style={{ left: `${fulcrumPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-amber-500" />
            </div>

            {/* Lever Bar */}
            <motion.div
              className="absolute h-3 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded-full shadow-lg"
              style={{
                width: '80%',
                bottom: 155,
                left: '10%',
              }}
              animate={{
                rotate: isPlaying ? [(leverMA - 1) * -3, (leverMA - 1) * 3, (leverMA - 1) * -3] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Load (Left side) */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ left: '15%', bottom: 160 }}
              animate={isPlaying ? { y: [0, 10, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 min-h-16 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                {Math.round(effectiveLoad)}kg
              </div>
              <span className="text-xs text-slate-400 mt-1">Load</span>
            </motion.div>

            {/* Effort (Right side) */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ right: '15%', bottom: 160 }}
              animate={isPlaying ? { y: [10, 0, 10] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 min-h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                {leverEffort}kg
              </div>
              <span className="text-xs text-slate-400 mt-1">Effort</span>
              <span className="text-lg mt-1">👇</span>
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 space-y-3 rounded-xl bg-slate-800/80 p-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Effort Force</p>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={leverEffort}
                  onChange={(e) => setLeverEffort(parseInt(e.target.value))}
                  className="w-32 accent-emerald-500"
                />
                <span className="text-xs text-white ml-2">{leverEffort}kg</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Fulcrum Position</p>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={fulcrumPosition}
                  onChange={(e) => setFulcrumPosition(parseInt(e.target.value))}
                  className="w-32 accent-amber-500"
                />
              </div>
            </div>

            {/* MA Display */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-sky-500/20 border border-sky-500/30 p-3">
              <p className="text-xs text-sky-300">Mechanical Advantage</p>
              <p className="text-2xl font-bold text-white">{leverMA.toFixed(2)}x</p>
              <p className="text-xs text-slate-400">Can lift {Math.round(effectiveLoad)}kg with {leverEffort}kg effort</p>
            </div>
          </div>
        );

      case 'pulley':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Ceiling */}
            <div className="absolute top-8 left-1/4 right-1/4 h-3 bg-slate-600 rounded" />

            {/* Pulleys */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              {Array.from({ length: pulleyCount }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  style={{ marginTop: idx > 0 ? 40 : 0 }}
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-12 min-h-12 rounded-full border-4 border-slate-400 bg-slate-700 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rope */}
            <div
              className="absolute w-1 bg-amber-600"
              style={{
                left: 'calc(50% + 24px)',
                top: 80,
                height: 100 + pulleyCount * 40,
              }}
            />

            {/* Load */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ left: '50%', top: 200 + pulleyCount * 40, transform: 'translateX(-50%)' }}
              animate={isPlaying ? { y: [0, -20, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-20 min-h-20 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                {pulleyLoad}kg
              </div>
              <span className="text-xs text-slate-400 mt-1">Load</span>
            </motion.div>

            {/* Person pulling */}
            <motion.div
              className="absolute right-1/4 bottom-20 flex flex-col items-center"
              animate={isPlaying ? { y: [0, 10, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-4xl">🧑</span>
              <div className="rounded-lg bg-emerald-500 px-2 py-1 text-xs text-white font-bold">
                {pulleyForce.toFixed(0)}kg effort
              </div>
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 space-y-3 rounded-xl bg-slate-800/80 p-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Number of Pulleys</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPulleyCount(n)}
                      className={`w-8 h-8 rounded-lg font-bold ${
                        pulleyCount === n
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Load Weight</p>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={pulleyLoad}
                  onChange={(e) => setPulleyLoad(parseInt(e.target.value))}
                  className="w-32 accent-red-500"
                />
                <span className="text-xs text-white ml-2">{pulleyLoad}kg</span>
              </div>
            </div>

            {/* MA Display */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-sky-500/20 border border-sky-500/30 p-3">
              <p className="text-xs text-sky-300">Mechanical Advantage</p>
              <p className="text-2xl font-bold text-white">{pulleyCount}x</p>
              <p className="text-xs text-slate-400">Force needed: {pulleyForce.toFixed(0)}kg</p>
            </div>
          </div>
        );

      case 'inclinedPlane':
        return (
          <div className="absolute inset-0 flex items-end justify-center pb-20">
            {/* Ramp */}
            <div
              className="relative"
              style={{
                width: 300,
                height: Math.tan((rampAngle * Math.PI) / 180) * 300,
                maxHeight: 200,
              }}
            >
              <div
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-700 to-amber-500 rounded-tr-xl"
                style={{
                  height: '100%',
                  clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
                }}
              />

              {/* Box on ramp */}
              <motion.div
                className="absolute w-12 min-h-12 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold"
                style={{
                  bottom: '30%',
                  left: '20%',
                  transform: `rotate(${rampAngle}deg)`,
                }}
                animate={isPlaying ? {
                  x: [0, 100, 0],
                  y: [0, -60, 0],
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                100kg
              </motion.div>

              {/* Angle indicator */}
              <div className="absolute bottom-2 left-2 text-amber-300 text-sm">
                {rampAngle}°
              </div>
            </div>

            {/* Platform */}
            <div className="absolute bottom-16 left-[20%] w-[60%] h-2 bg-slate-600 rounded" />

            {/* Force arrows */}
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
              <p className="text-white text-sm text-center">
                Without ramp: 100kg of force needed
              </p>
              <p className="text-emerald-400 text-lg text-center font-bold">
                With ramp: {inclinedForce}kg of force needed!
              </p>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 rounded-xl bg-slate-800/80 p-4">
              <p className="text-xs text-slate-400 mb-1">Ramp Angle</p>
              <input
                type="range"
                min="10"
                max="60"
                value={rampAngle}
                onChange={(e) => setRampAngle(parseInt(e.target.value))}
                className="w-32 accent-amber-500"
              />
              <span className="text-xs text-white ml-2">{rampAngle}°</span>
            </div>

            {/* MA Display */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-sky-500/20 border border-sky-500/30 p-3">
              <p className="text-xs text-sky-300">Mechanical Advantage</p>
              <p className="text-2xl font-bold text-white">{(100 / inclinedForce).toFixed(1)}x</p>
              <p className="text-xs text-slate-400">Shallower = easier push</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-8xl">{currentMachine.emoji}</span>
              <h3 className="mt-4 text-2xl font-bold text-white">{currentMachine.name}</h3>
              <p className="mt-2 text-slate-300 max-w-md">{currentMachine.description}</p>
              <div className="mt-4 rounded-xl bg-amber-500/20 border border-amber-500/30 p-3">
                <p className="text-sm text-amber-300">🇮🇳 {currentMachine.indianExample}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      {/* Machine Selector */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
        {machines.map((machine) => (
          <button
            key={machine.id}
            onClick={() => setSelectedMachine(machine.id)}
            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedMachine === machine.id
                ? 'bg-sky-500 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{machine.emoji}</span>
            <span className="hidden sm:inline">{machine.name}</span>
          </button>
        ))}
      </div>

      {/* Machine Visualization */}
      {renderMachine()}

      {/* Info Button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className={`absolute top-20 right-4 flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
          showInfo ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
        }`}
      >
        <Info className="h-4 w-4" />
        <span className="text-sm">Info</span>
      </button>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-32 right-4 w-72 rounded-xl bg-slate-800/95 p-4 border border-slate-700"
          >
            <h3 className="font-bold text-white flex items-center gap-2">
              <span>{currentMachine.emoji}</span>
              {currentMachine.name}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{currentMachine.description}</p>
            <div className="mt-3 rounded-lg bg-slate-700/50 p-2">
              <p className="text-xs text-slate-400">Formula:</p>
              <p className="text-xs text-sky-300 font-mono">{currentMachine.mechanicalAdvantage}</p>
            </div>
            <div className="mt-3 rounded-lg bg-amber-500/10 p-2">
              <p className="text-xs text-amber-300">🇮🇳 {currentMachine.indianExample}</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-3 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ancient Engineering Note */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 max-w-md text-center">
        <p className="text-xs text-amber-300">
          🇮🇳 Ancient Indians used these simple machines to build magnificent structures like 
          Sun Temple (Konark), Brihadeeswara Temple, and step wells (baolis) over 1000 years ago!
        </p>
      </div>
    </div>
  );
}
