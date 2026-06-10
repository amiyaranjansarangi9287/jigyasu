import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Info, BookOpen } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Trait {
  id: string;
  name: string;
  dominant: string;
  dominantSymbol: string;
  recessive: string;
  recessiveSymbol: string;
  emoji: string;
}

const traits: Trait[] = [
  { id: 'tongue', name: 'Tongue Rolling', dominant: 'Can roll', dominantSymbol: 'R', recessive: 'Cannot roll', recessiveSymbol: 'r', emoji: '👅' },
  { id: 'earlobe', name: 'Earlobes', dominant: 'Free (detached)', dominantSymbol: 'E', recessive: 'Attached', recessiveSymbol: 'e', emoji: '👂' },
  { id: 'hairline', name: 'Hairline', dominant: "Widow's peak", dominantSymbol: 'W', recessive: 'Straight', recessiveSymbol: 'w', emoji: '💇' },
  { id: 'thumb', name: 'Thumb Type', dominant: 'Straight', dominantSymbol: 'T', recessive: 'Hitchhiker', recessiveSymbol: 't', emoji: '👍' },
  { id: 'dimples', name: 'Dimples', dominant: 'Has dimples', dominantSymbol: 'D', recessive: 'No dimples', recessiveSymbol: 'd', emoji: '😊' },
  { id: 'freckles', name: 'Freckles', dominant: 'Has freckles', dominantSymbol: 'F', recessive: 'No freckles', recessiveSymbol: 'f', emoji: '🧑‍🦰' },
  { id: 'pea', name: 'Pea Plant Height', dominant: 'Tall', dominantSymbol: 'T', recessive: 'Short', recessiveSymbol: 't', emoji: '🌱' },
  { id: 'flower', name: 'Flower Color', dominant: 'Purple', dominantSymbol: 'P', recessive: 'White', recessiveSymbol: 'p', emoji: '🌸' },
];

type Genotype = 'homozygous-dominant' | 'heterozygous' | 'homozygous-recessive';

const genotypeLabels: Record<Genotype, string> = {
  'homozygous-dominant': 'Homozygous Dominant',
  'heterozygous': 'Heterozygous',
  'homozygous-recessive': 'Homozygous Recessive',
};

export default function PunnettSquare() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.punnett_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.punnett_prompt', "Why do some kids have blue eyes when both parents have brown? Traits follow rules of probability! Let's play with genetics."),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'punnett-square', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selectedTrait, setSelectedTrait] = useState(traits[0]);
  const [parent1Genotype, setParent1Genotype] = useState<Genotype>('heterozygous');
  const [parent2Genotype, setParent2Genotype] = useState<Genotype>('heterozygous');

  const getGenotype = (g: Genotype, trait: Trait): [string, string] => {
    switch (g) {
      case 'homozygous-dominant': return [trait.dominantSymbol, trait.dominantSymbol];
      case 'heterozygous': return [trait.dominantSymbol, trait.recessiveSymbol];
      case 'homozygous-recessive': return [trait.recessiveSymbol, trait.recessiveSymbol];
    }
  };

  const parent1Alleles = getGenotype(parent1Genotype, selectedTrait);
  const parent2Alleles = getGenotype(parent2Genotype, selectedTrait);

  const punnettResults = useMemo(() => {
    const results: string[][] = [];
    for (const a1 of parent1Alleles) {
      const row: string[] = [];
      for (const a2 of parent2Alleles) {
        // Sort so dominant comes first
        const sorted = [a1, a2].sort((a, b) => {
          if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
          if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
          return 0;
        });
        row.push(sorted.join(''));
      }
      results.push(row);
    }
    return results;
  }, [parent1Alleles, parent2Alleles]);

  const stats = useMemo(() => {
    const flat = punnettResults.flat();
    const D = selectedTrait.dominantSymbol;
    const d = selectedTrait.recessiveSymbol;

    let homDom = 0, het = 0, homRec = 0;
    for (const g of flat) {
      if (g === D + D) homDom++;
      else if (g === D + d || g === d + D) het++;
      else homRec++;
    }

    const phenoDominant = homDom + het;
    const phenoRecessive = homRec;

    return {
      genotypeRatio: `${homDom}:${het}:${homRec}`,
      phenotypeRatio: `${phenoDominant}:${phenoRecessive}`,
      percentDominant: (phenoDominant / 4) * 100,
      percentRecessive: (phenoRecessive / 4) * 100,
      homDom, het, homRec,
    };
  }, [punnettResults, selectedTrait]);

  const getPhenotypeColor = (genotype: string) => {
    const hasUpperCase = genotype.split('').some(c => c === c.toUpperCase() && c !== c.toLowerCase());
    return hasUpperCase ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-purple-500/20 border-purple-500/40 text-purple-400';
  };

  const randomize = () => {
    const genotypes: Genotype[] = ['homozygous-dominant', 'heterozygous', 'homozygous-recessive'];
    setParent1Genotype(genotypes[Math.floor(Math.random() * 3)]);
    setParent2Genotype(genotypes[Math.floor(Math.random() * 3)]);
    setSelectedTrait(traits[Math.floor(Math.random() * traits.length)]);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🎲 Punnett Square Lab</h2>
          <p className="text-gray-400 text-lg">Predict offspring genetics with Mendelian inheritance!</p>
        </motion.div>

        {/* Trait selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {traits.map(t => (
            <button key={t.id} onClick={() => setSelectedTrait(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTrait.id === t.id ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t.emoji} {t.name}
            </button>
          ))}
          <button onClick={randomize} className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 flex items-center gap-1">
            <Shuffle className="w-3 h-3" /> Random
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Punnett Square */}
          <div className="space-y-4">
            {/* Parent selectors */}
            <div className="grid grid-cols-2 gap-4">
              {/* Parent 1 */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-sm text-blue-400 font-bold mb-2">👨 Parent 1</div>
                <div className="space-y-1.5">
                  {(['homozygous-dominant', 'heterozygous', 'homozygous-recessive'] as Genotype[]).map(g => (
                    <button key={g} onClick={() => setParent1Genotype(g)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${parent1Genotype === g ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'}`}>
                      <span className="font-bold text-white font-mono">{getGenotype(g, selectedTrait).join('')}</span>
                      <span className="text-gray-500 text-sm ml-2">{genotypeLabels[g]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent 2 */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-sm text-pink-400 font-bold mb-2">👩 Parent 2</div>
                <div className="space-y-1.5">
                  {(['homozygous-dominant', 'heterozygous', 'homozygous-recessive'] as Genotype[]).map(g => (
                    <button key={g} onClick={() => setParent2Genotype(g)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${parent2Genotype === g ? 'bg-pink-500/20 border border-pink-500/40' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'}`}>
                      <span className="font-bold text-white font-mono">{getGenotype(g, selectedTrait).join('')}</span>
                      <span className="text-gray-500 text-sm ml-2">{genotypeLabels[g]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Punnett Square */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Punnett Square
              </h3>
              <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto">
                {/* Empty corner */}
                <div className="aspect-square" />
                {/* Parent 2 alleles (top) */}
                {parent2Alleles.map((a, i) => (
                  <div key={`p2-${i}`} className="aspect-square bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 font-bold font-mono text-xl border border-pink-500/30">
                    {a}
                  </div>
                ))}

                {/* Rows */}
                {parent1Alleles.map((a1, i) => (
                  <>
                    {/* Parent 1 allele (left) */}
                    <div key={`p1-${i}`} className="aspect-square bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold font-mono text-xl border border-blue-500/30">
                      {a1}
                    </div>
                    {/* Result cells */}
                    {punnettResults[i].map((result, j) => (
                      <motion.div key={`${i}-${j}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (i * 2 + j) * 0.1 }}
                        className={`aspect-square rounded-lg flex items-center justify-center font-bold font-mono text-lg border ${getPhenotypeColor(result)}`}>
                        {result}
                      </motion.div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results & Info */}
          <div className="space-y-4">
            {/* Trait Info */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{selectedTrait.emoji}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTrait.name}</h3>
                  <div className="text-sm text-gray-500">Single gene trait</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                  <div className="text-sm text-emerald-400 font-bold mb-1">Dominant ({selectedTrait.dominantSymbol})</div>
                  <div className="text-sm text-white">{selectedTrait.dominant}</div>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-sm text-purple-400 font-bold mb-1">Recessive ({selectedTrait.recessiveSymbol})</div>
                  <div className="text-sm text-white">{selectedTrait.recessive}</div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">📊 Offspring Predictions</h3>

              {/* Genotype ratio */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Genotype Ratio</div>
                <div className="flex gap-2">
                  {stats.homDom > 0 && (
                    <div className="flex-1 bg-emerald-500/20 rounded-lg p-2 text-center border border-emerald-500/30">
                      <div className="text-lg font-bold font-mono text-emerald-400">{selectedTrait.dominantSymbol}{selectedTrait.dominantSymbol}</div>
                      <div className="text-sm text-gray-400">{stats.homDom}/4 ({(stats.homDom / 4 * 100).toFixed(0)}%)</div>
                    </div>
                  )}
                  {stats.het > 0 && (
                    <div className="flex-1 bg-yellow-500/20 rounded-lg p-2 text-center border border-yellow-500/30">
                      <div className="text-lg font-bold font-mono text-yellow-400">{selectedTrait.dominantSymbol}{selectedTrait.recessiveSymbol}</div>
                      <div className="text-sm text-gray-400">{stats.het}/4 ({(stats.het / 4 * 100).toFixed(0)}%)</div>
                    </div>
                  )}
                  {stats.homRec > 0 && (
                    <div className="flex-1 bg-purple-500/20 rounded-lg p-2 text-center border border-purple-500/30">
                      <div className="text-lg font-bold font-mono text-purple-400">{selectedTrait.recessiveSymbol}{selectedTrait.recessiveSymbol}</div>
                      <div className="text-sm text-gray-400">{stats.homRec}/4 ({(stats.homRec / 4 * 100).toFixed(0)}%)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Phenotype ratio */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Phenotype Ratio</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-emerald-400">{selectedTrait.dominant}</span>
                      <span className="text-sm text-gray-400">{stats.percentDominant.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentDominant}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-purple-400">{selectedTrait.recessive}</span>
                      <span className="text-sm text-gray-400">{stats.percentRecessive.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentRecessive}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Classic ratios */}
              <div className="bg-gray-800/50 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Genotype ratio:</span>
                  <span className="text-white font-mono font-bold">{stats.genotypeRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phenotype ratio:</span>
                  <span className="text-white font-mono font-bold">{stats.phenotypeRatio}</span>
                </div>
              </div>
            </div>

            {/* Key concepts */}
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                <Info className="w-4 h-4" /> Key Concepts
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Dominant alleles</strong> (capital letters) mask recessive ones</li>
                <li>• <strong>Homozygous</strong> = two identical alleles (AA or aa)</li>
                <li>• <strong>Heterozygous</strong> = two different alleles (Aa)</li>
                <li>• <strong>Genotype</strong> = genetic makeup | <strong>Phenotype</strong> = physical trait</li>
                <li>• Classic Mendelian cross (Aa × Aa) gives 3:1 phenotype ratio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
