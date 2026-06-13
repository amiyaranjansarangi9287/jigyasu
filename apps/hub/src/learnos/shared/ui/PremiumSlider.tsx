import React from 'react';
import { useTranslation } from 'react-i18next';

interface PremiumSliderProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  color?: 'blue' | 'red' | 'purple' | 'green';
  unit?: string;
  step?: number;
}

export default function PremiumSlider({
  label,
  value,
  min,
  max,
  onChange,
  color = 'blue',
  unit = '',
  step = 1
}: PremiumSliderProps) {
  const { t } = useTranslation();
  const percentage = ((value - min) / (max - min)) * 100;
  
  const colorMap = {
    blue: 'from-blue-500 to-cyan-400 bg-blue-500 shadow-blue-500/50',
    red: 'from-red-500 to-orange-400 bg-red-500 shadow-red-500/50',
    purple: 'from-purple-500 to-pink-500 bg-purple-500 shadow-purple-500/50',
    green: 'from-green-500 to-emerald-400 bg-green-500 shadow-green-500/50'
  };

  const bgGradient = colorMap[color];

  return (
    <div className="flex flex-col gap-2 w-full p-3 bg-gray-900/40 rounded-2xl border border-gray-700/50">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">{label}</label>
        <span className="text-lg font-black text-white px-3 py-1 bg-gray-950 rounded-lg shadow-inner border border-gray-800">
          {value} <span className="text-gray-500 text-sm font-medium">{unit}</span>
        </span>
      </div>
      
      <div className="relative w-full h-8 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner border border-gray-900">
          <div 
            className={`h-full bg-gradient-to-r ${bgGradient} transition-all duration-150 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input slider (invisible overlay) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Thumb */}
        <div 
          className={`absolute h-6 w-6 rounded-full bg-white shadow-lg pointer-events-none transition-transform duration-150 ease-out flex items-center justify-center border-2 border-gray-200 group-hover:scale-110`}
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          <div className={`w-2 h-2 rounded-full ${bgGradient.split(' ')[2]}`} />
        </div>
      </div>
    </div>
  );
}
