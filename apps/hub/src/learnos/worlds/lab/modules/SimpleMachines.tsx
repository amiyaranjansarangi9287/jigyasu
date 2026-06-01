// src/worlds/lab/modules/SimpleMachines.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import SimpleMachinesCanvas from './SimpleMachinesCanvas';

const MACHINES = [
  { id: 'lever' as const, emoji: '🔧', name: 'Lever' },
  { id: 'ramp' as const, emoji: '📐', name: 'Ramp' },
  { id: 'wheel' as const, emoji: '☸️', name: 'Wheel' },
  { id: 'pulley' as const, emoji: '🪢', name: 'Pulley' },
];

export default function SimpleMachines() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [machine, setMachine] = useState<'lever' | 'wheel' | 'ramp' | 'pulley'>('lever');
  const [effortLevel, setEffortLevel] = useState(50);

  const handleMachineChange = useCallback((m: typeof machine) => {
    setMachine(m);
    LearningService.trackEvent('simple-machines-session', 'lab', language, 'machine_change', 'simple-machines', { machine: m });
  }, [language]);

  const handleEffortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setEffortLevel(val);
    LearningService.trackEvent('simple-machines-session', 'lab', language, 'effort_change', 'simple-machines', { effort: val });
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚙️</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.simplemachines.title', { defaultValue: 'Simple Machines' })}</h1>
          <p className="text-sm text-slate-500 mt-2">See how machines make work easier!</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {MACHINES.map(m => (
            <button key={m.id} onClick={() => handleMachineChange(m.id)} className={`px-4 py-3 rounded-xl font-bold transition ${machine === m.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              <div className="text-xl">{m.emoji}</div>
              <div className="text-sm">{m.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <SimpleMachinesCanvas machine={machine} effortLevel={effortLevel} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">💪 Effort</span><span className="text-sm font-medium text-blue-600">{effortLevel}%</span></div>
          <input type="range" min="0" max="100" value={effortLevel} onChange={handleEffortChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #3B82F6, #1D4ED8)' }} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Ancient Indian Engineering</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Indians used levers, ramps, and pulleys to build temples 4,000 years ago! The Brihadeeswarar Temple (1010 CE) has a 80-ton capstone lifted using ramps and levers — an engineering marvel still studied today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
