import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DigestiveOrgan {
  id: string;
  name: string;
  emoji: string;
  color: string;
  time: string;
  pH: string;
  description: string;
  enzymes: string[];
  whatHappens: string[];
  funFact: string;
}

const organs: DigestiveOrgan[] = [
  { id: 'mouth', name: 'Mouth', emoji: '👄', color: '#ef4444', time: '30 sec - 2 min', pH: '6.5–7.5 (neutral)',
    description: 'Digestion begins here! Teeth mechanically break food while salivary amylase begins chemical digestion of starches.',
    enzymes: ['Salivary amylase (breaks starch → maltose)', 'Lingual lipase (begins fat digestion)', 'Lysozyme (kills bacteria)'],
    whatHappens: ['Teeth grind food (mechanical digestion)', 'Tongue mixes food with saliva', 'Salivary glands produce 1-1.5L saliva/day', 'Starch digestion begins', 'Food formed into bolus for swallowing'],
    funFact: 'You produce enough saliva in a lifetime to fill two swimming pools! Saliva contains pain-killing chemicals 6x more powerful than morphine.' },
  { id: 'esophagus', name: 'Esophagus', emoji: '⬇️', color: '#f97316', time: '5-8 seconds', pH: '7 (neutral)',
    description: 'A muscular tube connecting mouth to stomach. Peristalsis (wave-like contractions) pushes food downward — it even works upside down!',
    enzymes: ['None (just transport)'],
    whatHappens: ['Epiglottis closes to prevent food entering lungs', 'Peristalsis pushes bolus downward', 'Mucus lubricates passage', 'Lower esophageal sphincter opens to stomach', 'Works against gravity if needed!'],
    funFact: 'Peristalsis is so powerful that astronauts can eat upside down! Food doesn\'t need gravity to reach the stomach.' },
  { id: 'stomach', name: 'Stomach', emoji: '🫃', color: '#eab308', time: '2-6 hours', pH: '1.5–3.5 (very acidic!)',
    description: 'A muscular bag that churns food with hydrochloric acid and enzymes. Turns food into a thick liquid called chyme.',
    enzymes: ['Pepsin (protein → peptides)', 'Gastric lipase (fats)', 'Hydrochloric acid (HCl)', 'Intrinsic factor (B12 absorption)'],
    whatHappens: ['HCl kills bacteria & denatures proteins', 'Pepsin breaks down proteins', 'Stomach churns food (3 muscle layers)', 'Food becomes chyme (liquid)', 'Mucus protects stomach lining from acid'],
    funFact: 'Your stomach acid is strong enough to dissolve metal! The stomach replaces its entire lining every 3-4 days to avoid digesting itself.' },
  { id: 'liver', name: 'Liver & Gallbladder', emoji: '🟤', color: '#92400e', time: 'Continuous', pH: 'Bile pH: 7-8 (alkaline)',
    description: 'The liver produces bile (stored in gallbladder) which emulsifies fats. It also detoxifies blood, stores nutrients, and produces proteins.',
    enzymes: ['Bile salts (emulsify fats — not an enzyme)', 'Cytochrome P450 (detoxification)'],
    whatHappens: ['Liver produces 500-1000mL bile daily', 'Bile stored & concentrated in gallbladder', 'Bile released into duodenum when fat arrives', 'Emulsifies fat (breaks into tiny droplets)', 'Liver also processes absorbed nutrients'],
    funFact: 'The liver performs over 500 functions! It\'s the only organ that can regenerate — you can donate 75% and it grows back.' },
  { id: 'pancreas', name: 'Pancreas', emoji: '💛', color: '#a3e635', time: 'Continuous', pH: '8.0 (alkaline — neutralizes stomach acid)',
    description: 'Produces powerful digestive enzymes and bicarbonate to neutralize stomach acid. Also produces insulin for blood sugar control.',
    enzymes: ['Pancreatic amylase (starch)', 'Trypsin & chymotrypsin (protein)', 'Pancreatic lipase (fats)', 'Nucleases (DNA/RNA)', 'Bicarbonate (neutralizes acid)'],
    whatHappens: ['Bicarbonate neutralizes acidic chyme', 'Pancreatic juice contains all major enzyme types', 'Enzymes activated only in small intestine', 'Also produces insulin & glucagon (endocrine)', 'Releases 1.5L of pancreatic juice/day'],
    funFact: 'Pancreatic enzymes are released inactive (zymogens) to prevent the pancreas from digesting itself! They activate only in the small intestine.' },
  { id: 'small', name: 'Small Intestine', emoji: '🌀', color: '#10b981', time: '3-5 hours', pH: '6-7.5',
    description: 'Where 90% of nutrient absorption happens! Three parts: duodenum, jejunum, ileum. Lined with millions of villi to maximize surface area.',
    enzymes: ['Maltase, sucrase, lactase (sugars)', 'Peptidases (peptides → amino acids)', 'Brush border enzymes (final breakdown)'],
    whatHappens: ['Duodenum receives bile & pancreatic juice', 'Chemical digestion completed here', 'Villi & microvilli absorb nutrients', 'Nutrients enter bloodstream', 'Fats enter lymphatic system via lacteals'],
    funFact: 'The small intestine is ~20 feet long! Its inner surface area (due to villi) is about the size of a tennis court — 2,700 sq ft!' },
  { id: 'large', name: 'Large Intestine (Colon)', emoji: '🔄', color: '#3b82f6', time: '12-36 hours', pH: '5.5-7 (slightly acidic)',
    description: 'Absorbs water, electrolytes, and some vitamins. Home to trillions of gut bacteria that produce vitamins and aid digestion.',
    enzymes: ['Bacterial enzymes (fermentation)', 'No significant human enzymes'],
    whatHappens: ['Absorbs water & electrolytes', 'Gut bacteria ferment remaining fiber', 'Bacteria produce vitamins K & B12', 'Feces formed & compacted', 'Mucus lubricates passage'],
    funFact: 'Your gut contains ~39 trillion bacteria — more cells than your own body! This "microbiome" weighs about 2 kg and is unique like a fingerprint.' },
  { id: 'rectum', name: 'Rectum & Exit', emoji: '🚪', color: '#8b5cf6', time: 'Variable', pH: '7 (neutral)',
    description: 'The final stop. Feces are stored in the rectum until voluntary elimination. The internal and external sphincters control release.',
    enzymes: ['None'],
    whatHappens: ['Rectum stores feces temporarily', 'Stretch receptors trigger urge to defecate', 'Internal sphincter (involuntary) relaxes', 'External sphincter (voluntary) relaxes', 'Elimination completes the journey!'],
    funFact: 'The entire journey from mouth to exit takes 24-72 hours! The average person produces about 128g of feces per day.' },
];

export default function DigestiveJourney() {
  const [currentOrgan, setCurrentOrgan] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [foodEmoji, setFoodEmoji] = useState('🍔');

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentOrgan(c => {
        if (c >= organs.length - 1) { setAutoPlay(false); return c; }
        return c + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const organ = organs[currentOrgan];
  const foods = ['🍔', '🍕', '🌮', '🍎', '🥗', '🍩', '🍣'];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🦷 Digestive Journey</h2>
          <p className="text-gray-400 text-lg">Follow your {foodEmoji} from mouth to exit!</p>
        </motion.div>

        {/* Food selector */}
        <div className="flex justify-center gap-2 mb-5">
          <span className="text-xs text-gray-500 self-center mr-1">Track:</span>
          {foods.map(f => (
            <button key={f} onClick={() => setFoodEmoji(f)}
              className={`text-2xl p-1 rounded-lg transition-all ${foodEmoji === f ? 'bg-gray-700 scale-110' : 'hover:bg-gray-800'}`}>{f}</button>
          ))}
        </div>

        {/* Journey timeline */}
        <div className="flex items-center justify-center gap-1 mb-6 overflow-x-auto pb-2 px-4">
          {organs.map((o, i) => (
            <div key={o.id} className="flex items-center">
              <button onClick={() => setCurrentOrgan(i)}
                className={`flex flex-col items-center px-2 py-1.5 rounded-xl transition-all shrink-0 ${currentOrgan === i ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'}`}>
                <div className="relative">
                  <span className={`text-xl ${currentOrgan === i ? '' : 'opacity-50'}`}>{o.emoji}</span>
                  {currentOrgan === i && (
                    <motion.span className="absolute -top-1 -right-1 text-sm"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}>
                      {foodEmoji}
                    </motion.span>
                  )}
                </div>
                <span className={`text-[9px] mt-0.5 font-medium whitespace-nowrap ${currentOrgan === i ? 'text-white' : 'text-gray-600'}`}>
                  {o.name.split(' ')[0]}
                </span>
              </button>
              {i < organs.length - 1 && (
                <motion.span
                  className={`mx-0.5 text-xs ${i < currentOrgan ? 'text-emerald-500' : 'text-gray-700'}`}
                  animate={i === currentOrgan - 1 ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}>→</motion.span>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Organ visualization */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={organ.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border-2 p-8 flex flex-col items-center justify-center min-h-[320px]"
                style={{ borderColor: organ.color + '44', background: `linear-gradient(135deg, ${organ.color}08, ${organ.color}04, transparent)` }}>
                <motion.div className="text-7xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}>
                  {organ.emoji}
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-1">{organ.name}</h3>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {organ.time}</span>
                  <span>pH: {organ.pH}</span>
                </div>

                {/* Food traveling animation */}
                <motion.div className="mt-6 flex items-center gap-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-2xl">{foodEmoji}</span>
                  <span className="text-gray-500 text-sm">is being processed here</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setCurrentOrgan(c => Math.max(0, c - 1))} disabled={currentOrgan === 0}
                className="p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => { setAutoPlay(!autoPlay); if (!autoPlay) setCurrentOrgan(0); }}
                className={`px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 ${autoPlay ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {autoPlay ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Follow Food</>}
              </button>
              <button onClick={() => setCurrentOrgan(c => Math.min(organs.length - 1, c + 1))} disabled={currentOrgan === organs.length - 1}
                className="p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info panel */}
          <motion.div key={organ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{organ.description}</p>

            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">🧪 Enzymes & Chemicals</h4>
            <ul className="space-y-1 mb-4">
              {organ.enzymes.map((e, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: organ.color }} />{e}
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">⚙️ What Happens</h4>
            <ul className="space-y-1.5 mb-4">
              {organ.whatHappens.map((w, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: organ.color }}>{i + 1}</span>
                  {w}
                </motion.li>
              ))}
            </ul>

            <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 rounded-xl p-3 border border-orange-500/20">
              <div className="text-xs text-orange-400 font-bold mb-1">💡 Fun Fact</div>
              <p className="text-xs text-gray-300 italic">{organ.funFact}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
