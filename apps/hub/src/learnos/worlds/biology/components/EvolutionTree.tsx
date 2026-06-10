import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface TreeNode {
  id: string;
  name: string;
  emoji: string;
  era: string;
  years: string;
  description: string;
  color: string;
  children?: TreeNode[];
}

const treeOfLife: TreeNode = {
  id: 'luca', name: 'LUCA', emoji: '🌊', era: 'Origin', years: '~4 billion years ago',
  description: 'The Last Universal Common Ancestor - a single-celled organism from which all life descended.',
  color: '#3b82f6',
  children: [
    {
      id: 'bacteria', name: 'Bacteria', emoji: '🦠', era: 'Archean', years: '~3.5 billion years ago',
      description: 'Single-celled prokaryotes. The most diverse and abundant organisms on Earth.',
      color: '#10b981',
      children: [
        { id: 'cyano', name: 'Cyanobacteria', emoji: '💚', era: 'Archean', years: '~2.7 bya', description: 'Photosynthetic bacteria that produced Earth\'s first oxygen!', color: '#22c55e' },
        { id: 'ecoli', name: 'E. coli', emoji: '🔬', era: 'Modern', years: 'Common today', description: 'A well-studied bacterium found in our intestines. Most strains are harmless!', color: '#14b8a6' },
      ],
    },
    {
      id: 'archaea', name: 'Archaea', emoji: '🌋', era: 'Archean', years: '~3.5 billion years ago',
      description: 'Single-celled organisms that thrive in extreme environments like hot springs and salt lakes.',
      color: '#f59e0b',
    },
    {
      id: 'eukaryotes', name: 'Eukaryotes', emoji: '🧬', era: 'Proterozoic', years: '~2 billion years ago',
      description: 'Organisms with complex cells containing a nucleus. Includes all plants, animals, and fungi.',
      color: '#8b5cf6',
      children: [
        {
          id: 'plants', name: 'Plants', emoji: '🌿', era: 'Ordovician', years: '~470 million years ago',
          description: 'Multicellular photosynthetic organisms that colonized land and transformed the atmosphere.',
          color: '#22c55e',
          children: [
            { id: 'moss', name: 'Mosses', emoji: '🌱', era: 'Devonian', years: '~400 mya', description: 'Among the first plants to colonize land. They still need moisture to reproduce.', color: '#4ade80' },
            { id: 'ferns', name: 'Ferns', emoji: '🌿', era: 'Carboniferous', years: '~360 mya', description: 'Dominated ancient forests. Some grew as tall as trees!', color: '#16a34a' },
            { id: 'flowers', name: 'Flowering Plants', emoji: '🌸', era: 'Cretaceous', years: '~130 mya', description: 'The most diverse plant group today. Co-evolved with pollinators like bees!', color: '#f472b6' },
          ],
        },
        {
          id: 'fungi', name: 'Fungi', emoji: '🍄', era: 'Proterozoic', years: '~1 billion years ago',
          description: 'Neither plant nor animal! Fungi decompose organic matter and form symbiotic networks.',
          color: '#a855f7',
        },
        {
          id: 'animals', name: 'Animals', emoji: '🐾', era: 'Ediacaran', years: '~600 million years ago',
          description: 'Multicellular organisms that can move, eat other organisms, and have nervous systems.',
          color: '#ef4444',
          children: [
            { id: 'invertebrates', name: 'Invertebrates', emoji: '🐙', era: 'Cambrian', years: '~540 mya', description: 'Animals without backbones. Include insects, mollusks, and more. They make up 97% of all animals!', color: '#f97316' },
            {
              id: 'vertebrates', name: 'Vertebrates', emoji: '🐟', era: 'Ordovician', years: '~480 mya',
              description: 'Animals with backbones. From fish to mammals, all share a common body plan.',
              color: '#3b82f6',
              children: [
                { id: 'fish', name: 'Fish', emoji: '🐠', era: 'Silurian', years: '~440 mya', description: 'The first vertebrates! Still the most diverse group of vertebrates today.', color: '#06b6d4' },
                { id: 'amphibians', name: 'Amphibians', emoji: '🐸', era: 'Devonian', years: '~370 mya', description: 'First vertebrates to walk on land! Live part of their lives in water and part on land.', color: '#84cc16' },
                { id: 'reptiles', name: 'Reptiles', emoji: '🦎', era: 'Carboniferous', years: '~320 mya', description: 'First fully land-dwelling vertebrates. Include modern lizards, snakes, and turtles.', color: '#65a30d' },
                { id: 'dinosaurs', name: 'Dinosaurs/Birds', emoji: '🦕', era: 'Triassic', years: '~230 mya', description: 'Dinosaurs dominated for 165 million years. Birds are their living descendants!', color: '#eab308' },
                { id: 'mammals', name: 'Mammals', emoji: '🐘', era: 'Triassic', years: '~225 mya', description: 'Warm-blooded, milk-producing animals. Diversified after dinosaur extinction 66 mya.', color: '#f59e0b' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function TreeBranch({ node, depth = 0, onSelect }: { node: TreeNode; depth?: number; onSelect: (node: TreeNode) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(node);
        }}
        className="group flex items-center gap-2 w-full text-left py-2 px-3 rounded-xl hover:bg-gray-800/50 transition-colors"
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <div className="w-4 h-4 shrink-0" />
        )}

        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: node.color + '22', border: `1px solid ${node.color}55` }}>
          {node.emoji}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">{node.name}</div>
          <div className="text-sm text-gray-500">{node.years}</div>
        </div>
      </motion.button>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 pl-4 border-l-2 border-gray-800 overflow-hidden"
          >
            {node.children!.map(child => (
              <TreeBranch key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EvolutionTree() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.evolution_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.evolution_prompt', "We share DNA with bananas and dinosaurs! How did life branch out into so many forms? Let's explore the tree of life."),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'evolution-tree', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selected, setSelected] = useState<TreeNode | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.evolutiontree.evolution_tree">🌳 Evolution Tree</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.evolutiontree.explore_the_whimsical_tree_of_">Explore the whimsical Tree of Life!</Trans></p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Tree */}
          <div className="lg:col-span-3 bg-gray-900 rounded-2xl border border-gray-800 p-5 max-h-[70vh] overflow-y-auto">
            <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
              <Info className="w-3 h-3" /> <Trans i18nKey="auto.evolutiontree.click_to_expand_branches_and_l">Click to expand branches and learn more</Trans>
                                      </div>
            <TreeBranch node={treeOfLife} onSelect={setSelected} />
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: selected.color + '22', border: `2px solid ${selected.color}` }}>
                      {selected.emoji}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
                      <div className="text-sm" style={{ color: selected.color }}>{selected.era} <Trans i18nKey="auto.evolutiontree.era">Era</Trans></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 bg-gray-800/50 rounded-lg px-3 py-2">
                    <span>📅</span> {selected.years}
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-4">{selected.description}</p>

                  {selected.children && selected.children.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider"><Trans i18nKey="auto.evolutiontree.descendants">Descendants</Trans></h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.children.map(c => (
                          <span key={c.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
                            {c.emoji} {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-white mb-2"><Trans i18nKey="auto.evolutiontree.explore_life_s_history">Explore Life's History</Trans></h3>
                  <p className="text-gray-400 text-sm"><Trans i18nKey="auto.evolutiontree.click_on_any_branch_in_the_tre">Click on any branch in the tree to learn about that group of organisms and their evolutionary journey.</Trans></p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline */}
            <div className="mt-6 bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.evolutiontree.geological_timeline">📅 Geological Timeline</Trans></h4>
              <div className="space-y-2">
                {[
                  { era: 'Hadean', years: '4.6-4.0 bya', color: '#6b7280', emoji: '🌑' },
                  { era: 'Archean', years: '4.0-2.5 bya', color: '#3b82f6', emoji: '🌊' },
                  { era: 'Proterozoic', years: '2.5-0.54 bya', color: '#8b5cf6', emoji: '🧬' },
                  { era: 'Paleozoic', years: '541-252 mya', color: '#22c55e', emoji: '🐟' },
                  { era: 'Mesozoic', years: '252-66 mya', color: '#eab308', emoji: '🦕' },
                  { era: 'Cenozoic', years: '66 mya-now', color: '#ef4444', emoji: '🐘' },
                ].map(t => (
                  <div key={t.era} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-sm text-gray-300 font-medium w-20">{t.era}</span>
                    <span className="text-sm text-gray-500">{t.years}</span>
                    <span className="text-sm ml-auto">{t.emoji}</span>
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
