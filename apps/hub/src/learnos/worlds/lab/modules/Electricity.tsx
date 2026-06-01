// src/worlds/lab/modules/Electricity.tsx
// Interactive circuit simulation with voltage and resistance control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import ElectricityCanvas from './ElectricityCanvas';

export default function Electricity() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [switchOn, setSwitchOn] = useState(true);
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(6);

  const handleVoltageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVoltage(val);
    LearningService.trackEvent(
      'electricity-session',
      'lab',
      language,
      'canvas_interaction',
      'electricity',
      { voltage: val, resistance, switchOn }
    );
  }, [language, resistance, switchOn]);

  const handleResistanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setResistance(val);
    LearningService.trackEvent(
      'electricity-session',
      'lab',
      language,
      'canvas_interaction',
      'electricity',
      { voltage, resistance: val, switchOn }
    );
  }, [language, voltage, switchOn]);

  const toggleSwitch = useCallback(() => {
    setSwitchOn(prev => !prev);
  }, []);

  const current = switchOn ? (voltage / resistance) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-yellow-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('lab.electricity.title', { defaultValue: 'Electric Circuits' })}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Build a circuit and see Ohm's Law in action!
          </p>
        </div>

        {/* Switch toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleSwitch}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition ${
              switchOn
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {switchOn ? '🔌 ON' : '🔌 OFF'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <ElectricityCanvas switchOn={switchOn} voltage={voltage} resistance={resistance} />
        </div>

        {/* Sliders */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">🔋 Voltage</span>
              <span className="text-sm font-medium text-yellow-400">{voltage}V</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={voltage}
              onChange={handleVoltageChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #F59E0B, #EF4444)' }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">🔧 Resistance</span>
              <span className="text-sm font-medium text-orange-400">{resistance}Ω</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={resistance}
              onChange={handleResistanceChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #22C55E, #F97316)' }}
            />
          </div>
        </div>

        {/* Ohm's Law display */}
        <div className="mt-6 bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700/50">
          <div className="text-sm text-yellow-400 font-mono font-bold">
            I = V/R = {voltage}/{resistance} = {current.toFixed(2)}A
          </div>
          <div className="text-sm text-slate-400 mt-2">
            More voltage = more current • More resistance = less current
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1">India's Electrical Legacy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                India was one of the first countries to adopt electricity on a massive scale.
                <strong> Jagadish Chandra Bose</strong> (1895) pioneered radio waves before Marconi!
                Today, India's power grid is the world's largest synchronized grid, serving 1.4 billion people.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
