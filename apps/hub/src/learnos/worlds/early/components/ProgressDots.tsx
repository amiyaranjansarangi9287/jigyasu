// src/worlds/early/components/ProgressDots.tsx

interface ProgressDotsProps {
  total: number;
  current: number;
  color?: string;
}

export function ProgressDots({ total, current, color = '#6C63FF' }: ProgressDotsProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: i === current ? color : i < current ? `${color}88` : '#D1D5DB',
            transform: i === current ? 'scale(1.3)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}
