import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type ChartType = 'bar' | 'line' | 'pie';

interface DataPoint { label: string; value: number; color: string }

const COLORS = ['#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

const presets: { name: string; data: DataPoint[] }[] = [
  { name: '🍎 Favorite Fruits', data: [
    { label: 'Apple', value: 12, color: COLORS[0] }, { label: 'Banana', value: 8, color: COLORS[1] },
    { label: 'Orange', value: 15, color: COLORS[2] }, { label: 'Grape', value: 6, color: COLORS[3] },
    { label: 'Mango', value: 10, color: COLORS[4] },
  ] },
  { name: '📚 Books Read', data: [
    { label: 'Jan', value: 3, color: COLORS[0] }, { label: 'Feb', value: 5, color: COLORS[1] },
    { label: 'Mar', value: 4, color: COLORS[2] }, { label: 'Apr', value: 7, color: COLORS[3] },
    { label: 'May', value: 6, color: COLORS[4] }, { label: 'Jun', value: 8, color: COLORS[5] },
  ] },
  { name: '🌡️ Temperature', data: [
    { label: 'Mon', value: 22, color: COLORS[0] }, { label: 'Tue', value: 25, color: COLORS[1] },
    { label: 'Wed', value: 19, color: COLORS[2] }, { label: 'Thu', value: 28, color: COLORS[3] },
    { label: 'Fri', value: 24, color: COLORS[4] },
  ] },
];

export default function GraphCreator() {
  const [data, setData] = useState<DataPoint[]>(presets[0].data);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const mean = total / (data.length || 1);

  const addPoint = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    setData([...data, { label: newLabel.trim(), value: Number(newValue) || 0, color: COLORS[data.length % COLORS.length] }]);
    setNewLabel('');
    setNewValue('');
  };

  const removePoint = (i: number) => setData(data.filter((_, idx) => idx !== i));

  const updateValue = (i: number, val: number) => {
    const next = [...data];
    next[i] = { ...next[i], value: Math.max(0, val) };
    setData(next);
  };

  const svgW = 360, svgH = 240;

  // Pie chart arcs
  const pieArcs = useMemo(() => {
    let startAngle = 0;
    return data.map(d => {
      const angle = (d.value / (total || 1)) * 360;
      const arc = { ...d, startAngle, angle };
      startAngle += angle;
      return arc;
    });
  }, [data, total]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📊 Graph Creator</h2>
        <p className="text-purple-300 text-lg">Build bar, line, and pie charts from your own data!</p>
      </div>

      {/* Chart type selector */}
      <div className="flex justify-center gap-2 mb-4">
        {([
          { id: 'bar' as ChartType, emoji: '📊', label: 'Bar' },
          { id: 'line' as ChartType, emoji: '📈', label: 'Line' },
          { id: 'pie' as ChartType, emoji: '🥧', label: 'Pie' },
        ]).map(c => (
          <button key={c.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${chartType === c.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => setChartType(c.id)}>{c.emoji} {c.label}</button>
        ))}
      </div>

      {/* Presets */}
      <div className="flex justify-center gap-2 mb-6">
        {presets.map(p => (
          <button key={p.name} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10" onClick={() => setData(p.data)}>{p.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10 flex items-center justify-center min-h-[280px]">
          {chartType === 'bar' && (
            <svg width={svgW} height={svgH} className="overflow-visible">
              <line x1="40" y1={svgH - 30} x2={svgW} y2={svgH - 30} stroke="rgba(255,255,255,0.2)" />
              <line x1="40" y1="10" x2="40" y2={svgH - 30} stroke="rgba(255,255,255,0.2)" />
              {data.map((d, i) => {
                const barW = Math.max(10, (svgW - 60) / data.length - 8);
                const barH = (d.value / maxVal) * (svgH - 50);
                const x = 50 + i * ((svgW - 60) / data.length);
                const y = svgH - 30 - barH;
                return (
                  <g key={i}>
                    <motion.rect x={x} y={y} width={barW} height={barH} fill={d.color} rx="4"
                      initial={{ height: 0, y: svgH - 30 }} animate={{ height: barH, y }} transition={{ delay: i * 0.1, type: 'spring' }} />
                    <text x={x + barW / 2} y={svgH - 14} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">{d.label}</text>
                    <text x={x + barW / 2} y={y - 5} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{d.value}</text>
                  </g>
                );
              })}
            </svg>
          )}
          {chartType === 'line' && (
            <svg width={svgW} height={svgH} className="overflow-visible">
              <line x1="40" y1={svgH - 30} x2={svgW} y2={svgH - 30} stroke="rgba(255,255,255,0.2)" />
              <line x1="40" y1="10" x2="40" y2={svgH - 30} stroke="rgba(255,255,255,0.2)" />
              {data.length > 1 && (
                <motion.polyline fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  points={data.map((d, i) => {
                    const x = 50 + i * ((svgW - 70) / (data.length - 1));
                    const y = svgH - 30 - (d.value / maxVal) * (svgH - 50);
                    return `${x},${y}`;
                  }).join(' ')}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                />
              )}
              {data.map((d, i) => {
                const x = 50 + i * ((svgW - 70) / Math.max(data.length - 1, 1));
                const y = svgH - 30 - (d.value / maxVal) * (svgH - 50);
                return (
                  <g key={i}>
                    <motion.circle cx={x} cy={y} r="5" fill={d.color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
                    <text x={x} y={svgH - 14} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">{d.label}</text>
                    <text x={x} y={y - 10} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{d.value}</text>
                  </g>
                );
              })}
            </svg>
          )}
          {chartType === 'pie' && (
            <svg width="260" height="260" viewBox="-130 -130 260 260">
              {pieArcs.map((arc, i) => {
                const r = 100;
                const startRad = (arc.startAngle - 90) * Math.PI / 180;
                const endRad = (arc.startAngle + arc.angle - 90) * Math.PI / 180;
                const largeArc = arc.angle > 180 ? 1 : 0;
                const x1 = Math.cos(startRad) * r;
                const y1 = Math.sin(startRad) * r;
                const x2 = Math.cos(endRad) * r;
                const y2 = Math.sin(endRad) * r;
                const midRad = ((arc.startAngle + arc.angle / 2 - 90) * Math.PI) / 180;
                const lx = Math.cos(midRad) * 65;
                const ly = Math.sin(midRad) * 65;
                return (
                  <g key={i}>
                    <motion.path d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={arc.color} stroke="rgba(0,0,0,0.3)" strokeWidth="2"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
                    {arc.angle > 15 && <text x={lx} y={ly + 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{Math.round((arc.value / total) * 100)}%</text>}
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Data editor */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">📝 Data</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {data.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-white text-sm flex-1">{d.label}</span>
                  <input type="number" value={d.value} onChange={e => updateValue(i, Number(e.target.value))}
                    className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm text-center" />
                  <button className="text-red-400 hover:text-red-300 text-sm" onClick={() => removePoint(i)}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value" type="number"
                className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm text-center"
                onKeyDown={e => e.key === 'Enter' && addPoint()} />
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm" onClick={addPoint}>+</button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
            <h4 className="text-white font-bold mb-2">📈 Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-gray-400 text-xs">Total</p><p className="text-white font-bold">{total}</p></div>
              <div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-gray-400 text-xs">Mean</p><p className="text-white font-bold">{mean.toFixed(1)}</p></div>
              <div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-gray-400 text-xs">Max</p><p className="text-white font-bold">{maxVal}</p></div>
              <div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-gray-400 text-xs">Items</p><p className="text-white font-bold">{data.length}</p></div>
            </div>
          </div>

          {chartType === 'pie' && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h4 className="text-white font-bold text-sm mb-2">🥧 Legend</h4>
              <div className="space-y-1">
                {data.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-300 flex-1">{d.label}</span>
                    <span className="text-white font-bold">{d.value}</span>
                    <span className="text-gray-500">({Math.round((d.value / total) * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
