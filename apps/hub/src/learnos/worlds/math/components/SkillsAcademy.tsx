import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimesTableTrainer from './TimesTableTrainer';
import NumberBondsGarden from './NumberBondsGarden';
import FractionPizza from './FractionPizza';

type Skill = 'times' | 'bonds' | 'fractions';

export default function SkillsAcademy() {
  const [skill, setSkill] = useState<Skill>('times');

  const skills: { id: Skill; emoji: string; label: string; color: string; desc: string }[] = [
    { id: 'times', emoji: '🎯', label: 'Times Tables', color: 'from-purple-500 to-pink-500', desc: 'Master multiplication' },
    { id: 'bonds', emoji: '🌻', label: 'Number Bonds', color: 'from-green-500 to-emerald-500', desc: 'Addition pairs' },
    { id: 'fractions', emoji: '🍕', label: 'Fractions', color: 'from-orange-500 to-red-500', desc: 'Pizza fractions' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎓 Skills Academy</h2>
        <p className="text-purple-300 text-lg">Build your math foundations step by step!</p>
      </div>

      {/* Skill selector cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {skills.map((s) => (
          <motion.button
            key={s.id}
            className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${
              skill === s.id
                ? 'border-white/40 bg-white/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSkill(s.id)}
          >
            {skill === s.id && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-20`}
                layoutId="skill-highlight"
              />
            )}
            <div className="relative z-10 text-center">
              <motion.span
                className="text-3xl sm:text-4xl block mb-2"
                animate={skill === s.id ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {s.emoji}
              </motion.span>
              <p className="text-white font-bold text-sm sm:text-base">{s.label}</p>
              <p className="text-gray-400 text-sm hidden sm:block mt-1">{s.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={skill}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {skill === 'times' && <TimesTableTrainer />}
          {skill === 'bonds' && <NumberBondsGarden />}
          {skill === 'fractions' && <FractionPizza />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
