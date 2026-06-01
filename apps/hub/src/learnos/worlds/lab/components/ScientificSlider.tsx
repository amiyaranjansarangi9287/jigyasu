// src/worlds/lab/components/ScientificSlider.tsx
interface ScientificSliderProps { label: string; emoji: string; value: number; min: number; max: number; unit: string; color?: string; onChange: (v: number) => void; step?: number; }
export function ScientificSlider({ label, emoji, value, min, max, unit, color = '#3B82F6', onChange, step = 1 }: ScientificSliderProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span className="text-xl">{emoji}</span><span className="text-sm font-bold text-slate-700">{label}</span></div>
        <div className="bg-slate-100 px-3 py-1 rounded-full"><span className="text-sm font-mono font-bold text-slate-600">{value.toFixed(step < 1 ? 1 : 0)}<span className="text-sm text-slate-400 ml-1">{unit}</span></span></div>
      </div>
      <div className="relative"><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: color }} />
        <div className="flex justify-between mt-1"><span className="text-sm text-slate-400">{min}{unit}</span><span className="text-sm text-slate-400">{max}{unit}</span></div>
      </div>
    </div>
  );
}
