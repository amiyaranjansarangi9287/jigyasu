// src/worlds/early/modules/HabitatHeroes.tsx

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';

type Habitat = 'forest' | 'ocean' | 'desert' | 'arctic';

const HABITATS: Record<Habitat, {
  name: string; emoji: string; color: string; description: string;
  animals: { emoji: string; name: string; funFact: string }[];
  pipIntro: string; question: string; options: string[]; correct: number;
}> = {
  forest: { name: 'Forest', emoji: '🌲', color: '#15803D', description: 'Trees, leaves, and woodland creatures!',
    animals: [{ emoji: '🦊', name: 'Fox', funFact: 'Foxes can hear mice under snow!' }, { emoji: '🦌', name: 'Deer', funFact: 'Baby deer have spots to hide!' }, { emoji: '🐻', name: 'Bear', funFact: 'Bears sleep all winter!' }, { emoji: '🦉', name: 'Owl', funFact: 'Owls can turn their heads 270°!' }],
    pipIntro: "Welcome to the forest! Can you find all the forest friends?", question: "Which animal sleeps all winter?", options: ['Bear', 'Fox', 'Deer', 'Owl'], correct: 0 },
  ocean: { name: 'Ocean', emoji: '🌊', color: '#0284C7', description: 'Deep blue waters full of sea life!',
    animals: [{ emoji: '🐠', name: 'Clownfish', funFact: 'Clownfish live in anemones!' }, { emoji: '🐙', name: 'Octopus', funFact: 'Octopuses have 3 hearts!' }, { emoji: '🦈', name: 'Shark', funFact: 'Sharks have rows of teeth!' }, { emoji: '🐬', name: 'Dolphin', funFact: 'Dolphins sleep with one eye open!' }],
    pipIntro: "The ocean! So many amazing creatures!", question: "How many hearts does an octopus have?", options: ['3 hearts', '1 heart', '2 hearts', '4 hearts'], correct: 0 },
  desert: { name: 'Desert', emoji: '🏜️', color: '#D97706', description: 'Hot and dry — but animals survive here!',
    animals: [{ emoji: '🦎', name: 'Lizard', funFact: 'Lizards warm up in the sun!' }, { emoji: '🐪', name: 'Camel', funFact: 'Camels store fat in their humps!' }, { emoji: '🦂', name: 'Scorpion', funFact: 'Scorpions glow under UV light!' }, { emoji: '🦅', name: 'Eagle', funFact: 'Eagles see 4x better than humans!' }],
    pipIntro: "The desert! Animals found clever ways to live here!", question: "What do camels store in their humps?", options: ['Fat for energy', 'Water', 'Food', 'Sand'], correct: 0 },
  arctic: { name: 'Arctic', emoji: '❄️', color: '#7DD3FC', description: 'Icy cold world at the top of Earth!',
    animals: [{ emoji: '🐧', name: 'Penguin', funFact: 'Penguins huddle for warmth!' }, { emoji: '🐻‍❄️', name: 'Polar Bear', funFact: 'Polar bears have black skin!' }, { emoji: '🦭', name: 'Seal', funFact: 'Seals hold breath 90 minutes!' }, { emoji: '🐳', name: 'Whale', funFact: 'Blue whales are the largest animals ever!' }],
    pipIntro: "Brrr! The Arctic! These animals love the cold!", question: "What colour is a polar bear's skin?", options: ['Black', 'White', 'Pink', 'Yellow'], correct: 0 },
};

export default function HabitatHeroes() {
  const pip = usePip();
  const { recordHabitatExplored } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();
  const [selected, setSelected] = useState<Habitat | null>(null);
  const [animalIdx, setAnimalIdx] = useState<number | null>(null);
  const [explored, setExplored] = useState<Habitat[]>([]);
  const [showQ, setShowQ] = useState(false);
  const [qAnswer, setQAnswer] = useState<number | null>(null);

  const habitat = selected ? HABITATS[selected] : null;

  const handleSelect = useCallback((h: Habitat) => {
    setSelected(h); setAnimalIdx(null); setShowQ(false); setQAnswer(null);
    pip.sayCustom(HABITATS[h].pipIntro, 'excited');
    if (!explored.includes(h)) { setExplored(p => [...p, h]); recordHabitatExplored(); }
  }, [explored, pip, recordHabitatExplored]);

  const handleAnimal = useCallback((idx: number) => {
    setAnimalIdx(idx);
    if (habitat) pip.sayCustom(`${habitat.animals[idx].name}! ${habitat.animals[idx].funFact}`, 'surprised');
  }, [habitat, pip]);

  const handleAnswer = useCallback(async (idx: number) => {
    if (!habitat || qAnswer !== null) return;
    setQAnswer(idx);
    if (idx === habitat.correct) { pip.celebrate(); await trackCorrect('habitat-heroes', { habitat: selected }); }
    else { pip.reactToMistake(); await trackWrong('habitat-heroes', {}); }
  }, [habitat, qAnswer, pip, trackCorrect, trackWrong, selected]);

  return (
    <EarlyShell module="habitat-heroes">
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-2 mb-3"><span className="text-3xl">🐤</span><p className="text-base font-bold text-gray-700">{habitat ? `Exploring the ${habitat.name}!` : 'Choose a habitat!'}</p></div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(HABITATS) as Habitat[]).map(h => {
              const info = HABITATS[h];
              return (<motion.button key={h} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(h)}
                className={`py-4 px-3 rounded-2xl font-bold text-base min-h-[64px] transition-all ${selected === h ? 'text-white shadow-lg scale-105' : 'bg-white border-2 border-gray-200 text-gray-700'}`}
                style={{ backgroundColor: selected === h ? info.color : undefined }}>
                <div className="text-3xl mb-1">{info.emoji}</div><div>{info.name}</div>
                {explored.includes(h) && selected !== h && <div className="text-sm text-green-500 mt-1">✓</div>}
              </motion.button>);
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {habitat && (
            <motion.div key={selected} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 flex-1 pb-24">
              <p className="text-base text-gray-500 mb-4 text-center">{habitat.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {habitat.animals.map((a, i) => (
                  <motion.button key={a.name} whileTap={{ scale: 0.95 }} onClick={() => handleAnimal(i)}
                    className={`bg-white rounded-2xl p-4 border-2 flex flex-col items-center gap-2 min-h-[100px] transition-all ${animalIdx === i ? 'border-teal-400 bg-teal-50' : 'border-gray-200'}`}>
                    <span className="text-4xl">{a.emoji}</span><span className="text-base font-bold text-gray-700">{a.name}</span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>{animalIdx !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-teal-50 rounded-2xl p-4 border border-teal-200 mb-4">
                  <div className="flex items-start gap-2"><span className="text-2xl">{habitat.animals[animalIdx].emoji}</span><div><p className="text-base font-bold text-teal-800">{habitat.animals[animalIdx].name}</p><p className="text-base text-teal-700">{habitat.animals[animalIdx].funFact}</p></div></div>
                </motion.div>
              )}</AnimatePresence>

              {!showQ && <button onClick={() => setShowQ(true)} className="w-full py-4 font-bold text-lg rounded-2xl min-h-[56px] text-white" style={{ backgroundColor: habitat.color }}>Test My Knowledge! 🧠</button>}

              <AnimatePresence>{showQ && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 border border-teal-200">
                  <p className="font-bold text-gray-800 mb-3">🐤 {habitat.question}</p>
                  <div className="space-y-2">{habitat.options.map((opt, i) => {
                    const done = qAnswer !== null;
                    return (<button key={opt} onClick={() => handleAnswer(i)} className={`w-full py-3 px-4 rounded-xl text-left text-base font-medium min-h-[44px] transition-all ${!done ? 'bg-gray-50 border-2 border-gray-200' : i === habitat.correct ? 'bg-green-100 border-2 border-green-400 text-green-700' : qAnswer === i ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-white border-2 border-gray-100 text-gray-500'}`}>{opt} {done && i === habitat.correct && '✓'}</button>);
                  })}</div>
                </motion.div>
              )}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {explored.length === 4 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mx-5 mb-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl p-4 text-white text-center"><div className="text-3xl mb-1">🌍🌊🏜️❄️</div><p className="font-bold">All Habitats Explored!</p></motion.div>}
      </div>
    </EarlyShell>
  );
}
