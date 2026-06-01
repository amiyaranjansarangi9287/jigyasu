import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Calendar, ChevronRight, Play, Award } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Mission {
  id: string;
  year: number;
  name: string;
  emoji: string;
  type: 'satellite' | 'rocket' | 'moon' | 'mars' | 'sun';
  description: string;
  achievement: string;
  scientists?: string[];
}

const missions: Mission[] = [
  {
    id: 'aryabhata',
    year: 1975,
    name: 'Aryabhata',
    emoji: '🛰️',
    type: 'satellite',
    description: 'India\'s first satellite, launched from USSR. Named after the ancient Indian mathematician.',
    achievement: 'India became the 11th country to have a satellite in space!',
    scientists: ['Vikram Sarabhai', 'Satish Dhawan'],
  },
  {
    id: 'slv',
    year: 1980,
    name: 'SLV-3',
    emoji: '🚀',
    type: 'rocket',
    description: 'First Indian-made launch vehicle, carrying Rohini satellite.',
    achievement: 'India joined the space launch club - only 6th country to do so!',
    scientists: ['APJ Abdul Kalam'],
  },
  {
    id: 'pslv',
    year: 1994,
    name: 'PSLV',
    emoji: '🚀',
    type: 'rocket',
    description: 'Polar Satellite Launch Vehicle - India\'s workhorse rocket with 50+ successful launches.',
    achievement: 'Most reliable rocket, launched 104 satellites in one mission in 2017!',
  },
  {
    id: 'chandrayan1',
    year: 2008,
    name: 'Chandrayaan-1',
    emoji: '🌙',
    type: 'moon',
    description: 'India\'s first lunar mission that discovered water molecules on the Moon!',
    achievement: 'Made India the 4th country to reach the Moon!',
  },
  {
    id: 'mangalyaan',
    year: 2014,
    name: 'Mangalyaan (MOM)',
    emoji: '🔴',
    type: 'mars',
    description: 'Mars Orbiter Mission - reached Mars in first attempt at lowest cost ever ($74 million)!',
    achievement: 'First nation to reach Mars on debut attempt!',
  },
  {
    id: 'gslv',
    year: 2017,
    name: 'GSLV Mk III',
    emoji: '🚀',
    type: 'rocket',
    description: 'India\'s most powerful rocket, can lift 4-ton satellites to orbit.',
    achievement: 'Enabled independent heavy payload launches!',
  },
  {
    id: 'chandrayaan3',
    year: 2023,
    name: 'Chandrayaan-3',
    emoji: '🌕',
    type: 'moon',
    description: 'Soft-landed on Moon\'s south pole with Vikram lander and Pragyan rover.',
    achievement: 'First country to land on Moon\'s south pole!',
  },
  {
    id: 'aditya',
    year: 2023,
    name: 'Aditya-L1',
    emoji: '☀️',
    type: 'sun',
    description: 'India\'s first solar mission, studying the Sun from Lagrange point L1.',
    achievement: 'First Asian country with a solar observatory in space!',
  },
];

interface RocketPart {
  id: string;
  name: string;
  description: string;
  placed: boolean;
}

export function ISROCanvas(_props: CanvasProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [activeView, setActiveView] = useState<'timeline' | 'build'>('timeline');
  const [launchSequence, setLaunchSequence] = useState(false);
  const [rocketParts, setRocketParts] = useState<RocketPart[]>([
    { id: 'payload', name: 'Payload (Satellite)', description: 'The satellite or spacecraft being launched', placed: false },
    { id: 'stage3', name: 'Stage 3 (Upper)', description: 'Final boost to reach orbit', placed: false },
    { id: 'stage2', name: 'Stage 2 (Middle)', description: 'Continues acceleration after Stage 1 separates', placed: false },
    { id: 'stage1', name: 'Stage 1 (Booster)', description: 'Provides initial thrust to lift off', placed: false },
  ]);

  const [rocketY, setRocketY] = useState(0);

  const placePart = (partId: string) => {
    setRocketParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, placed: true } : p))
    );
  };

  const allPartsPlaced = rocketParts.every((p) => p.placed);

  const startLaunch = () => {
    if (!allPartsPlaced) return;
    setLaunchSequence(true);
    let y = 0;
    const interval = setInterval(() => {
      y -= 5;
      setRocketY(y);
      if (y < -400) {
        clearInterval(interval);
        setTimeout(() => {
          setLaunchSequence(false);
          setRocketY(0);
          setRocketParts((prev) => prev.map((p) => ({ ...p, placed: false })));
        }, 1000);
      }
    }, 50);
  };

  const getMissionColor = (type: Mission['type']) => {
    const colors = {
      satellite: '#3B82F6',
      rocket: '#10B981',
      moon: '#F59E0B',
      mars: '#EF4444',
      sun: '#FBBF24',
    };
    return colors[type];
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-black">
      {/* Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* ISRO Logo */}
      <div className="absolute left-4 top-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 border-2 border-orange-500">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h2 className="font-bold text-white">ISRO Mission Control</h2>
          <p className="text-xs text-orange-400">Indian Space Research Organisation</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="absolute right-4 top-4 flex rounded-lg bg-slate-800/80 p-1">
        <button
          onClick={() => setActiveView('timeline')}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            activeView === 'timeline'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Timeline
        </button>
        <button
          onClick={() => setActiveView('build')}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            activeView === 'build'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="h-4 w-4" />
          Build Rocket
        </button>
      </div>

      {/* Timeline View */}
      {activeView === 'timeline' && (
        <div className="absolute inset-x-4 top-20 bottom-4 overflow-y-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-orange-500 to-amber-500" />

          {/* Mission Cards */}
          <div className="space-y-4 pl-10">
            {missions.map((mission, idx) => (
              <motion.button
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedMission(mission)}
                className={`relative w-full rounded-xl p-4 text-left transition-all ${
                  selectedMission?.id === mission.id
                    ? 'bg-slate-700/80 border border-sky-500'
                    : 'bg-slate-800/60 hover:bg-slate-700/60'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className="absolute -left-8 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2"
                  style={{
                    borderColor: getMissionColor(mission.type),
                    backgroundColor: selectedMission?.id === mission.id ? getMissionColor(mission.type) : 'transparent',
                  }}
                />

                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mission.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{mission.year}</span>
                      <h3 className="font-semibold text-white">{mission.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">{mission.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                      <Award className="h-3 w-3" />
                      <span className="line-clamp-1">{mission.achievement}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Build Rocket View */}
      {activeView === 'build' && (
        <div className="absolute inset-x-4 top-20 bottom-4 flex gap-4">
          {/* Parts Panel */}
          <div className="w-48 space-y-2">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Rocket Parts</h3>
            {rocketParts.map((part) => (
              <button
                key={part.id}
                onClick={() => placePart(part.id)}
                disabled={part.placed}
                className={`w-full rounded-lg p-3 text-left transition-all ${
                  part.placed
                    ? 'bg-emerald-500/20 border border-emerald-500/50 opacity-50'
                    : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <p className="text-sm font-medium text-white">{part.name}</p>
                <p className="text-xs text-slate-400 mt-1">{part.description}</p>
              </button>
            ))}

            {/* Launch Button */}
            <button
              onClick={startLaunch}
              disabled={!allPartsPlaced || launchSequence}
              className={`mt-4 w-full flex items-center justify-center gap-2 rounded-lg py-3 font-medium transition-all ${
                allPartsPlaced && !launchSequence
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="h-5 w-5" />
              {launchSequence ? 'Launching...' : 'Launch! 🚀'}
            </button>
          </div>

          {/* Launch Pad */}
          <div className="flex-1 flex items-end justify-center relative">
            {/* Launch Pad Base */}
            <div className="absolute bottom-0 w-40 h-8 bg-gradient-to-t from-slate-600 to-slate-700 rounded-t-lg" />
            <div className="absolute bottom-8 w-32 h-4 bg-slate-500 rounded-sm" />

            {/* Rocket */}
            <motion.div
              className="absolute bottom-12"
              style={{ y: rocketY }}
            >
              <div className="flex flex-col items-center">
                {/* Payload */}
                {rocketParts[0].placed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-10 bg-gradient-to-b from-sky-400 to-sky-600 rounded-t-full"
                  />
                )}
                {/* Stage 3 */}
                {rocketParts[1].placed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-16 bg-gradient-to-b from-white to-slate-200 border-t border-slate-300"
                  />
                )}
                {/* Stage 2 */}
                {rocketParts[2].placed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-20 bg-gradient-to-b from-orange-400 to-orange-600"
                  />
                )}
                {/* Stage 1 */}
                {rocketParts[3].placed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-24 bg-gradient-to-b from-white to-slate-200 rounded-b-lg relative"
                  >
                    {/* Fins */}
                    <div className="absolute -left-3 bottom-0 w-4 h-8 bg-orange-500 -skew-x-12" />
                    <div className="absolute -right-3 bottom-0 w-4 h-8 bg-orange-500 skew-x-12" />
                    {/* Flames during launch */}
                    {launchSequence && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        className="absolute left-1/2 -bottom-8 -translate-x-1/2"
                      >
                        <div className="w-8 h-12 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full" />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Smoke during launch */}
            {launchSequence && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0], scale: [1, 2, 3] }}
                transition={{ duration: 2 }}
                className="absolute bottom-0 w-40 h-40 rounded-full bg-gradient-radial from-white/50 to-transparent"
              />
            )}
          </div>
        </div>
      )}

      {/* Mission Details Modal */}
      <AnimatePresence>
        {selectedMission && activeView === 'timeline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedMission(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-lg w-full rounded-2xl bg-slate-800 p-6 border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedMission.emoji}</span>
                <div>
                  <p className="text-3xl font-bold text-white">{selectedMission.year}</p>
                  <h3 className="text-xl font-semibold text-white">{selectedMission.name}</h3>
                </div>
              </div>

              <p className="mt-4 text-slate-300">{selectedMission.description}</p>

              <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Achievement</span>
                </div>
                <p className="mt-1 text-emerald-300">{selectedMission.achievement}</p>
              </div>

              {selectedMission.scientists && (
                <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                  <p className="text-sm text-amber-300">🇮🇳 Key Scientists:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMission.scientists.map((s) => (
                      <span key={s} className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedMission(null)}
                className="mt-6 w-full rounded-lg bg-sky-500 py-2 text-white font-medium hover:bg-sky-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Founding Scientists Tribute */}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
        <p className="text-center text-sm text-amber-300">
          🇮🇳 "We are convinced that if we are to play a meaningful role nationally, and in the community of nations, we must be second to none in the application of advanced technologies." 
          <span className="text-amber-400"> — Dr. Vikram Sarabhai, Father of Indian Space Program</span>
        </p>
      </div>
    </div>
  );
}
