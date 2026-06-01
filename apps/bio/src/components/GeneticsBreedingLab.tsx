import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw, Shuffle, Info } from 'lucide-react';
import { playCorrect, playCollect } from '../lib/sounds';

// Trait definitions with dominant/recessive alleles
interface TraitDef {
  name: string;
  dominant: { allele: string; label: string; visual: string };
  recessive: { allele: string; label: string; visual: string };
}

const traitDefs: TraitDef[] = [
  { name: 'Color', dominant: { allele: 'C', label: 'Purple', visual: '#a855f7' }, recessive: { allele: 'c', label: 'Green', visual: '#22c55e' } },
  { name: 'Size', dominant: { allele: 'S', label: 'Big', visual: 'big' }, recessive: { allele: 's', label: 'Small', visual: 'small' } },
  { name: 'Ears', dominant: { allele: 'E', label: 'Pointy', visual: 'pointy' }, recessive: { allele: 'e', label: 'Round', visual: 'round' } },
  { name: 'Tail', dominant: { allele: 'T', label: 'Long', visual: 'long' }, recessive: { allele: 't', label: 'Short', visual: 'short' } },
  { name: 'Pattern', dominant: { allele: 'P', label: 'Spots', visual: 'spots' }, recessive: { allele: 'p', label: 'Plain', visual: 'plain' } },
];

interface Pet {
  id: string;
  name: string;
  genotype: string[][]; // Array of [allele1, allele2] for each trait
  generation: number;
  parentIds: [string, string] | null;
}

function getRandomAllele(trait: TraitDef): string {
  return Math.random() < 0.5 ? trait.dominant.allele : trait.recessive.allele;
}

function createRandomPet(gen: number): Pet {
  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Pet-${Math.floor(Math.random() * 900) + 100}`,
    genotype: traitDefs.map(t => [getRandomAllele(t), getRandomAllele(t)]),
    generation: gen,
    parentIds: null,
  };
}

function breedPets(parent1: Pet, parent2: Pet, gen: number): Pet {
  const genotype = traitDefs.map((_, i) => {
    const a1 = parent1.genotype[i][Math.random() < 0.5 ? 0 : 1];
    const a2 = parent2.genotype[i][Math.random() < 0.5 ? 0 : 1];
    return [a1, a2];
  });
  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Baby-${Math.floor(Math.random() * 900) + 100}`,
    genotype,
    generation: gen,
    parentIds: [parent1.id, parent2.id],
  };
}

function getPhenotype(pet: Pet, traitIndex: number): 'dominant' | 'recessive' {
  const [a1, a2] = pet.genotype[traitIndex];
  return (a1 === a1.toUpperCase() || a2 === a2.toUpperCase()) ? 'dominant' : 'recessive';
}

function getGenotypeString(pet: Pet, traitIndex: number): string {
  const sorted = [...pet.genotype[traitIndex]].sort((a, b) => {
    if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
    if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
    return 0;
  });
  return sorted.join('');
}

// SVG pet renderer
function PetAvatar({ pet, size = 80 }: { pet: Pet; size?: number }) {
  const color = getPhenotype(pet, 0) === 'dominant' ? traitDefs[0].dominant.visual : traitDefs[0].recessive.visual;
  const isBig = getPhenotype(pet, 1) === 'dominant';
  const isPointy = getPhenotype(pet, 2) === 'dominant';
  const isLongTail = getPhenotype(pet, 3) === 'dominant';
  const hasSpots = getPhenotype(pet, 4) === 'dominant';
  const s = isBig ? 1 : 0.75;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Tail */}
      <path d={isLongTail
        ? `M${55 + s * 15},${60} Q${70 + s * 15},${40} ${65 + s * 20},${25}`
        : `M${55 + s * 10},${55} Q${60 + s * 10},${48} ${58 + s * 12},${42}`}
        fill="none" stroke={color} strokeWidth={3 * s} strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="45" cy="58" rx={22 * s} ry={16 * s} fill={color} />
      {/* Spots */}
      {hasSpots && (
        <>
          <circle cx={38} cy={55} r={3 * s} fill="white" opacity="0.3" />
          <circle cx={50} cy={60} r={2.5 * s} fill="white" opacity="0.3" />
          <circle cx={42} cy={63} r={2 * s} fill="white" opacity="0.3" />
        </>
      )}
      {/* Head */}
      <circle cx="28" cy="45" r={12 * s} fill={color} />
      {/* Ears */}
      {isPointy ? (
        <>
          <polygon points={`${20},${38} ${16},${26} ${26},${34}`} fill={color} />
          <polygon points={`${36},${38} ${40},${26} ${30},${34}`} fill={color} />
        </>
      ) : (
        <>
          <ellipse cx={20} cy={35} rx={5 * s} ry={6 * s} fill={color} />
          <ellipse cx={36} cy={35} rx={5 * s} ry={6 * s} fill={color} />
        </>
      )}
      {/* Eyes */}
      <circle cx={24} cy={43} r={2.5} fill="white" />
      <circle cx={32} cy={43} r={2.5} fill="white" />
      <circle cx={25} cy={43} r={1.3} fill="#1e293b" />
      <circle cx={33} cy={43} r={1.3} fill="#1e293b" />
      {/* Nose */}
      <ellipse cx={28} cy={48} rx={2} ry={1.5} fill="#f472b6" />
      {/* Mouth */}
      <path d="M26,50 Q28,52 30,50" fill="none" stroke="#f472b6" strokeWidth="0.8" />
      {/* Legs */}
      {[30, 38, 50, 58].map((x, i) => (
        <rect key={i} x={x - 2} y={58 + 12 * s} width={4} height={8 * s} rx={2} fill={color} />
      ))}
    </svg>
  );
}

export default function GeneticsBreedingLab() {
  const [pets, setPets] = useState<Pet[]>(() => [createRandomPet(1), createRandomPet(1), createRandomPet(1), createRandomPet(1)]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [offspring, setOffspring] = useState<Pet[]>([]);
  const [generation, setGeneration] = useState(1);
  const [selectedPetDetail, setSelectedPetDetail] = useState<Pet | null>(null);
  const [breedCount, setBreedCount] = useState(0);

  const toggleSelect = (id: string) => {
    setSelectedPets(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const breed = useCallback(() => {
    if (selectedPets.length !== 2) return;
    const p1 = pets.find(p => p.id === selectedPets[0]);
    const p2 = pets.find(p => p.id === selectedPets[1]);
    if (!p1 || !p2) return;

    const babies = Array.from({ length: 4 }, () => breedPets(p1, p2, generation + 1));
    setOffspring(babies);
    setBreedCount(c => c + 1);
    playCollect();
  }, [selectedPets, pets, generation]);

  const adoptOffspring = (baby: Pet) => {
    setPets(prev => [...prev, baby]);
    setOffspring(prev => prev.filter(p => p.id !== baby.id));
    setGeneration(g => Math.max(g, baby.generation));
    playCorrect();
  };

  const reset = () => {
    setPets([createRandomPet(1), createRandomPet(1), createRandomPet(1), createRandomPet(1)]);
    setSelectedPets([]); setOffspring([]); setGeneration(1);
    setSelectedPetDetail(null); setBreedCount(0);
  };

  const randomize = () => {
    setPets([createRandomPet(1), createRandomPet(1), createRandomPet(1), createRandomPet(1)]);
    setSelectedPets([]); setOffspring([]); setSelectedPetDetail(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-16 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">🐾 Genetics Breeding Lab</h2>
          <p className="text-gray-400 text-sm">Select 2 pets to breed and observe inherited traits!</p>
        </motion.div>

        {/* Stats */}
        <div className="flex justify-center gap-3 mb-5">
          <div className="bg-gray-900 rounded-lg border border-gray-800 px-4 py-2 text-center">
            <div className="text-[10px] text-gray-500">Generation</div>
            <div className="text-xl font-black text-emerald-400">{generation}</div>
          </div>
          <div className="bg-gray-900 rounded-lg border border-gray-800 px-4 py-2 text-center">
            <div className="text-[10px] text-gray-500">Total Pets</div>
            <div className="text-xl font-black text-purple-400">{pets.length}</div>
          </div>
          <div className="bg-gray-900 rounded-lg border border-gray-800 px-4 py-2 text-center">
            <div className="text-[10px] text-gray-500">Breeds</div>
            <div className="text-xl font-black text-pink-400">{breedCount}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Pet Pool */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">🏠 Your Pets <span className="text-gray-500 font-normal">(select 2 to breed)</span></h3>
                <div className="flex gap-1.5">
                  <button onClick={randomize} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white active:scale-95 flex items-center gap-1">
                    <Shuffle className="w-3 h-3" /> New Pets
                  </button>
                  <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white active:scale-95">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {pets.map(pet => {
                  const isSelected = selectedPets.includes(pet.id);
                  return (
                    <motion.button key={pet.id} layout
                      onClick={() => { toggleSelect(pet.id); setSelectedPetDetail(pet); }}
                      className={`relative p-3 rounded-xl border-2 transition-all text-center active:scale-95 ${
                        isSelected ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
                      }`}>
                      {isSelected && <div className="absolute top-1 right-1 text-xs">💕</div>}
                      <PetAvatar pet={pet} size={60} />
                      <div className="text-[10px] font-bold text-white mt-1">{pet.name}</div>
                      <div className="text-[8px] text-gray-500">Gen {pet.generation}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Breed button */}
            <button onClick={breed} disabled={selectedPets.length !== 2}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${
                selectedPets.length === 2 ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}>
              <Heart className="w-5 h-5" /> {selectedPets.length === 2 ? 'Breed Selected Pets!' : `Select ${2 - selectedPets.length} more pet${selectedPets.length === 1 ? '' : 's'}`}
            </button>

            {/* Offspring */}
            <AnimatePresence>
              {offspring.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-pink-950/30 to-purple-950/30 rounded-2xl border border-pink-500/20 p-5">
                  <h3 className="text-sm font-bold text-pink-400 mb-3">🍼 Offspring! (click to adopt)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {offspring.map((baby, i) => (
                      <motion.button key={baby.id}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                        onClick={() => adoptOffspring(baby)}
                        className="p-3 rounded-xl border-2 border-pink-500/30 bg-gray-900/50 text-center hover:border-pink-400 hover:bg-pink-500/10 active:scale-95 transition-all">
                        <PetAvatar pet={baby} size={55} />
                        <div className="text-[10px] font-bold text-white mt-1">{baby.name}</div>
                        <div className="text-[8px] text-pink-400">Gen {baby.generation} • Click to adopt</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            {/* Pet details */}
            <AnimatePresence mode="wait">
              {selectedPetDetail ? (
                <motion.div key={selectedPetDetail.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <PetAvatar pet={selectedPetDetail} size={50} />
                    <div>
                      <div className="text-lg font-bold text-white">{selectedPetDetail.name}</div>
                      <div className="text-[10px] text-gray-500">Generation {selectedPetDetail.generation}</div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Genotype & Phenotype</h4>
                  <div className="space-y-1.5">
                    {traitDefs.map((t, i) => {
                      const pheno = getPhenotype(selectedPetDetail, i);
                      const geno = getGenotypeString(selectedPetDetail, i);
                      const isDom = pheno === 'dominant';
                      return (
                        <div key={t.name} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                          <span className="text-xs text-gray-400 w-14">{t.name}</span>
                          <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${isDom ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                            {geno}
                          </span>
                          <span className="text-[10px] text-gray-400">→</span>
                          <span className={`text-xs font-medium ${isDom ? 'text-purple-300' : 'text-green-300'}`}>
                            {isDom ? t.dominant.label : t.recessive.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
                  <div className="text-4xl mb-2">🧬</div>
                  <h3 className="text-sm font-bold text-white mb-1">Select a Pet</h3>
                  <p className="text-xs text-gray-400">Click a pet to see its genotype and phenotype details.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trait Legend */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h4 className="text-xs font-bold text-white mb-2">📋 Trait Legend</h4>
              <div className="space-y-1.5 text-[10px]">
                {traitDefs.map(t => (
                  <div key={t.name} className="flex items-center gap-2">
                    <span className="text-gray-400 w-12">{t.name}:</span>
                    <span className="text-purple-400 font-bold">{t.dominant.allele}</span>
                    <span className="text-gray-600">=</span>
                    <span className="text-purple-300">{t.dominant.label}</span>
                    <span className="text-gray-700 mx-0.5">|</span>
                    <span className="text-green-400 font-bold">{t.recessive.allele}</span>
                    <span className="text-gray-600">=</span>
                    <span className="text-green-300">{t.recessive.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genetics concepts */}
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="text-xs text-blue-400 font-bold flex items-center gap-1 mb-2"><Info className="w-3 h-3" /> How It Works</div>
              <ul className="text-[10px] text-gray-300 space-y-1">
                <li>• Each parent passes <strong>one random allele</strong> per trait</li>
                <li>• <strong>Dominant</strong> (uppercase) masks recessive (lowercase)</li>
                <li>• <strong>CC</strong> or <strong>Cc</strong> → dominant phenotype</li>
                <li>• <strong>cc</strong> → recessive phenotype</li>
                <li>• Breed across generations to see patterns!</li>
                <li>• Try getting all-recessive offspring!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
