import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Sparkles } from 'lucide-react';
import type { CanvasProps } from '../../types';
import { KnowledgeCheck, TakeawayBox } from '../ui';

interface PurificationStep {
  id: string;
  name: string;
  icon: string;
  description: string;
  removes: string[];
}

const PURIFICATION_STEPS: PurificationStep[] = [
  { 
    id: 'screening', 
    name: 'Screening', 
    icon: '🪤',
    description: 'Large debris like leaves and sticks are removed',
    removes: ['debris', 'leaves']
  },
  { 
    id: 'sedimentation', 
    name: 'Sedimentation', 
    icon: '⏳',
    description: 'Water sits still so heavy particles sink to the bottom',
    removes: ['sand', 'mud']
  },
  { 
    id: 'filtration', 
    name: 'Filtration', 
    icon: '🧫',
    description: 'Water passes through layers of sand and gravel',
    removes: ['fine particles', 'some bacteria']
  },
  { 
    id: 'chlorination', 
    name: 'Chlorination', 
    icon: '🧪',
    description: 'Chlorine kills harmful bacteria and viruses',
    removes: ['bacteria', 'viruses']
  },
  { 
    id: 'ro', 
    name: 'Reverse Osmosis', 
    icon: '💎',
    description: 'Water is pushed through a membrane that removes dissolved salts',
    removes: ['dissolved salts', 'heavy metals']
  },
];

interface WaterParticle {
  id: number;
  type: 'debris' | 'sand' | 'bacteria' | 'salt' | 'clean';
  x: number;
  y: number;
}

export default function WaterPurificationCanvas({ isPlaying }: CanvasProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [particles, setParticles] = useState<WaterParticle[]>([]);
  const [showHardWater, setShowHardWater] = useState(false);

  // Initialize particles
  useEffect(() => {
    const initialParticles: WaterParticle[] = [];
    for (let i = 0; i < 20; i++) {
      initialParticles.push({
        id: i,
        type: ['debris', 'sand', 'bacteria', 'salt'][Math.floor(Math.random() * 4)] as WaterParticle['type'],
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    setParticles(initialParticles);
  }, []);

  const processStep = () => {
    if (!isPlaying || isProcessing) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const step = PURIFICATION_STEPS[currentStep];
      
      // Remove particles based on step
      setParticles(prev => prev.filter(p => {
        if (step.id === 'screening' && p.type === 'debris') return false;
        if (step.id === 'sedimentation' && p.type === 'sand') return false;
        if (step.id === 'filtration' && (p.type === 'sand' || Math.random() > 0.5)) return false;
        if (step.id === 'chlorination' && p.type === 'bacteria') return false;
        if (step.id === 'ro' && p.type === 'salt') return false;
        return true;
      }));

      setIsProcessing(false);
      
      if (currentStep < PURIFICATION_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 2000);
  };

  const resetProcess = () => {
    setCurrentStep(0);
    const initialParticles: WaterParticle[] = [];
    for (let i = 0; i < 20; i++) {
      initialParticles.push({
        id: i,
        type: ['debris', 'sand', 'bacteria', 'salt'][Math.floor(Math.random() * 4)] as WaterParticle['type'],
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    setParticles(initialParticles);
  };

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'debris': return 'bg-amber-800';
      case 'sand': return 'bg-yellow-600';
      case 'bacteria': return 'bg-green-600';
      case 'salt': return 'bg-white';
      default: return 'bg-cyan-400';
    }
  };

  const waterClarity = 100 - (particles.length * 5);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-bold text-cyan-400">💧 Water Purification</h3>

      {/* Progress Steps */}
      <div className="flex gap-1 w-full max-w-md overflow-x-auto pb-2">
        {PURIFICATION_STEPS.map((step, i) => (
          <div
            key={step.id}
            className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg transition-all ${
              i === currentStep 
                ? 'bg-cyan-600 text-white' 
                : i < currentStep 
                ? 'bg-green-600/30 text-green-400'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            <span className="text-lg">{step.icon}</span>
            <span className="text-[10px] whitespace-nowrap">{step.name}</span>
          </div>
        ))}
      </div>

      {/* Water Tank Visualization */}
      <div className="relative w-64 h-56 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Water level */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ 
            height: '80%',
            background: `linear-gradient(to top, 
              rgba(6, 182, 212, ${0.3 + waterClarity / 200}) 0%, 
              rgba(34, 211, 238, ${0.2 + waterClarity / 300}) 100%)`
          }}
          animate={{ opacity: isProcessing ? [0.5, 1, 0.5] : 1 }}
          transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
        />

        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className={`absolute w-2 h-2 rounded-full ${getParticleColor(particle.type)}`}
            style={{ left: `${particle.x}%`, top: `${20 + particle.y * 0.6}%` }}
            animate={isProcessing ? {
              y: particle.type === 'sand' ? 50 : [0, -5, 0],
              opacity: 1,
            } : { y: [0, 5, 0] }}
            transition={{ 
              duration: isProcessing ? 1 : 2, 
              repeat: isProcessing ? 0 : Infinity 
            }}
          />
        ))}

        {/* Processing effect */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-12 h-12 text-cyan-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels */}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-slate-900/70 px-2 py-1 rounded">
          Clarity: {Math.max(0, waterClarity)}%
        </div>
        <div className="absolute top-2 right-2 text-xs text-slate-400">
          Contaminants: {particles.length}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{PURIFICATION_STEPS[currentStep].icon}</span>
          <div>
            <h4 className="font-bold text-white">{PURIFICATION_STEPS[currentStep].name}</h4>
            <p className="text-xs text-slate-400">Step {currentStep + 1} of {PURIFICATION_STEPS.length}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-2">
          {PURIFICATION_STEPS[currentStep].description}
        </p>
        <div className="flex flex-wrap gap-1">
          {PURIFICATION_STEPS[currentStep].removes.map(item => (
            <span key={item} className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded-full">
              ❌ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={processStep}
          disabled={isProcessing || currentStep >= PURIFICATION_STEPS.length - 1 && particles.length === 0}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 rounded-xl text-white font-bold flex items-center gap-2"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : currentStep >= PURIFICATION_STEPS.length - 1 ? (
            <>✅ Complete</>
          ) : (
            <><Filter className="w-4 h-4" /> Process Step</>
          )}
        </button>
        <button
          onClick={resetProcess}
          className="px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl text-white"
        >
          🔄 Reset
        </button>
      </div>

      {/* Hard Water Section */}
      <button
        onClick={() => setShowHardWater(!showHardWater)}
        className="text-sm text-amber-400 hover:text-amber-300"
      >
        💡 {showHardWater ? 'Hide' : 'Learn about'} Hard vs Soft Water
      </button>

      <AnimatePresence>
        {showHardWater && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-4 max-w-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-amber-400 mb-2">🪨 Hard Water</h5>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Contains Ca²⁺, Mg²⁺</li>
                  <li>• Less soap lather</li>
                  <li>• White deposits in pipes</li>
                  <li>• Scale in kettles</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-cyan-400 mb-2">💧 Soft Water</h5>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Low mineral content</li>
                  <li>• More soap lather</li>
                  <li>• No deposits</li>
                  <li>• Rainwater is soft</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Namami Gange:</span> This ₹20,000 crore project aims to clean 
          the Ganga using modern water treatment technology to make it pollution-free by 2030!
        </p>
      </motion.div>

      {/* Knowledge Check */}
      <KnowledgeCheck
        prompt="Which step in water treatment ACTUALLY kills bacteria and viruses?"
        options={["Filtration — sand traps microbes", "Chlorination — chlorine destroys their cell membranes", "Sedimentation — bacteria sink to the bottom", "Screening — wire mesh catches them"]}
        correctIndex={1}
        explanation="Chlorination uses chlorine gas or compounds that penetrate and destroy bacterial cell walls. This is why drinking water in cities is chlorinated before supply."
        retryHint="Think about which step is specifically designed to kill living things..."
      />

      <TakeawayBox
        title="💧 Water Treatment - Key Takeaways"
        cards={[
          { type: 'key', text: 'Water treatment follows 5 stages: Screening → Sedimentation → Filtration → Chlorination → RO' },
          { type: 'key', text: 'Chlorination stops diseases — over 70% of Indian households have access to chlorinated water.' },
          { type: 'tip', text: 'RO filters remove dissolved salts but also remove beneficial minerals. Balance is key!' },
          { type: 'fun', text: 'The Ganga has natural bacteriophages (viruses that kill bacteria) — the river\'s self-cleaning power!' },
        ]}
        indianContext="Since 2019, the Jal Jeevan Mission has provided tap water connections to over 12 crore rural households across India!"
      />
    </div>
  );
}
