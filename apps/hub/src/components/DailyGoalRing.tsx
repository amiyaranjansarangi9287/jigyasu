import React from 'react';

interface DailyGoalRingProps {
  currentXP: number;
  goalXP: number;
  size?: number;
}

export default function DailyGoalRing({ currentXP, goalXP, size = 32 }: DailyGoalRingProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(currentXP / goalXP, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${progress >= 1 ? 'text-green-500' : 'text-sky-500'}`}
        />
      </svg>
      {progress >= 1 && (
        <span className="absolute inset-0 flex items-center justify-center text-sm animate-bounce">
          ⭐
        </span>
      )}
    </div>
  );
}
