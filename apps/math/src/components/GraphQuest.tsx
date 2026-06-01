import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function GraphQuest() {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const [showTable, setShowTable] = useState(true);
  const [mode, setMode] = useState<'linear' | 'quadratic'>('linear');
  const [quadA, setQuadA] = useState(1);
  const [quadC, setQuadC] = useState(0);

  const gridSize = 300;
  const gridRange = 10;
  const unit = gridSize / (gridRange * 2);
  const cx = gridSize / 2;
  const cy = gridSize / 2;

  const toSvgX = (x: number) => cx + x * unit;
  const toSvgY = (y: number) => cy - y * unit;

  const linearPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -gridRange; x <= gridRange; x += 0.5) {
      const y = slope * x + intercept;
      if (y >= -gridRange && y <= gridRange) pts.push({ x, y });
    }
    return pts;
  }, [slope, intercept]);

  const quadPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -gridRange; x <= gridRange; x += 0.2) {
      const y = quadA * x * x + quadC;
      if (y >= -gridRange && y <= gridRange) pts.push({ x, y });
    }
    return pts;
  }, [quadA, quadC]);

  const points = mode === 'linear' ? linearPoints : quadPoints;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`).join(' ');

  const tableValues = mode === 'linear'
    ? [-3, -2, -1, 0, 1, 2, 3].map(x => ({ x, y: slope * x + intercept }))
    : [-3, -2, -1, 0, 1, 2, 3].map(x => ({ x, y: quadA * x * x + quadC }));

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📈 Graph Quest</h2>
        <p className="text-purple-300 text-lg">See equations become lines and curves!</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <motion.button
          className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'linear' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setMode('linear')} whileTap={{ scale: 0.95 }}
        >📏 Linear (y = mx + b)</motion.button>
        <motion.button
          className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'quadratic' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setMode('quadratic')} whileTap={{ scale: 0.95 }}
        >🔄 Quadratic (y = ax² + c)</motion.button>
      </div>

      {/* Equation display */}
      <div className="text-center mb-4">
        <motion.div
          className="inline-block bg-white/5 rounded-2xl px-6 py-3 border border-white/10"
          key={mode === 'linear' ? `${slope}-${intercept}` : `${quadA}-${quadC}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {mode === 'linear' ? (
            <span className="text-2xl sm:text-3xl font-bold font-mono">
              <span className="text-gray-400">y = </span>
              <span className="text-blue-400">{slope === 1 ? '' : slope === -1 ? '-' : slope}</span>
              <span className="text-blue-400">x</span>
              {intercept !== 0 && (
                <span className="text-orange-400"> {intercept > 0 ? '+' : ''} {intercept}</span>
              )}
            </span>
          ) : (
            <span className="text-2xl sm:text-3xl font-bold font-mono">
              <span className="text-gray-400">y = </span>
              <span className="text-purple-400">{quadA === 1 ? '' : quadA === -1 ? '-' : quadA}</span>
              <span className="text-purple-400">x²</span>
              {quadC !== 0 && (
                <span className="text-orange-400"> {quadC > 0 ? '+' : ''} {quadC}</span>
              )}
            </span>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph */}
        <div className="flex flex-col items-center">
          <svg width={gridSize} height={gridSize} className="bg-white/5 rounded-xl border border-white/10">
            {/* Grid lines */}
            {Array.from({ length: gridRange * 2 + 1 }).map((_, i) => {
              const pos = i * unit;
              return (
                <g key={i}>
                  <line x1={pos} y1={0} x2={pos} y2={gridSize} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1={0} y1={pos} x2={gridSize} y2={pos} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </g>
              );
            })}
            {/* Axes */}
            <line x1={0} y1={cy} x2={gridSize} y2={cy} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <line x1={cx} y1={0} x2={cx} y2={gridSize} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            {/* Axis labels */}
            {[-8,-6,-4,-2,2,4,6,8].map(n => (
              <g key={n}>
                <text x={toSvgX(n)} y={cy + 12} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">{n}</text>
                <text x={cx - 10} y={toSvgY(n) + 3} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">{n}</text>
              </g>
            ))}
            <text x={gridSize - 10} y={cy - 5} fill="rgba(255,255,255,0.4)" fontSize="10">x</text>
            <text x={cx + 5} y={12} fill="rgba(255,255,255,0.4)" fontSize="10">y</text>
            {/* Graph line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={mode === 'linear' ? '#3b82f6' : '#a855f7'}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* Key points */}
            {mode === 'linear' && (
              <>
                {/* y-intercept */}
                <circle cx={toSvgX(0)} cy={toSvgY(intercept)} r="5" fill="#fb923c" />
                <text x={toSvgX(0) + 8} y={toSvgY(intercept) - 8} fill="#fb923c" fontSize="10">(0, {intercept})</text>
                {/* x-intercept if exists */}
                {slope !== 0 && Math.abs(-intercept / slope) <= gridRange && (
                  <>
                    <circle cx={toSvgX(-intercept / slope)} cy={toSvgY(0)} r="5" fill="#22c55e" />
                    <text x={toSvgX(-intercept / slope) + 8} y={toSvgY(0) - 8} fill="#22c55e" fontSize="10">({(-intercept / slope).toFixed(1)}, 0)</text>
                  </>
                )}
              </>
            )}
            {mode === 'quadratic' && (
              <>
                <circle cx={toSvgX(0)} cy={toSvgY(quadC)} r="5" fill="#fb923c" />
                <text x={toSvgX(0) + 8} y={toSvgY(quadC) - 8} fill="#fb923c" fontSize="10">vertex (0, {quadC})</text>
              </>
            )}
          </svg>
        </div>

        {/* Controls + Table */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
            {mode === 'linear' ? (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-blue-400 text-sm font-bold w-24">Slope (m)</label>
                  <input type="range" min="-5" max="5" step="0.5" value={slope} onChange={e => setSlope(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
                  <span className="text-white font-bold w-10 text-right">{slope}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-orange-400 text-sm font-bold w-24">Intercept (b)</label>
                  <input type="range" min="-8" max="8" value={intercept} onChange={e => setIntercept(parseInt(e.target.value))} className="flex-1 accent-orange-500" />
                  <span className="text-white font-bold w-10 text-right">{intercept}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-sm space-y-1">
                  <p className="text-gray-400">📊 <strong className="text-white">Slope = {slope}</strong> → {slope > 0 ? 'line goes ↗ uphill' : slope < 0 ? 'line goes ↘ downhill' : 'horizontal line ↔'}</p>
                  <p className="text-gray-400">📍 <strong className="text-white">Y-intercept = {intercept}</strong> → crosses y-axis at (0, {intercept})</p>
                  {slope !== 0 && <p className="text-gray-400">📍 <strong className="text-white">X-intercept = {(-intercept / slope).toFixed(1)}</strong> → crosses x-axis at ({(-intercept / slope).toFixed(1)}, 0)</p>}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-purple-400 text-sm font-bold w-24">a</label>
                  <input type="range" min="-3" max="3" step="0.5" value={quadA} onChange={e => setQuadA(parseFloat(e.target.value))} className="flex-1 accent-purple-500" />
                  <span className="text-white font-bold w-10 text-right">{quadA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-orange-400 text-sm font-bold w-24">c (shift)</label>
                  <input type="range" min="-8" max="8" value={quadC} onChange={e => setQuadC(parseInt(e.target.value))} className="flex-1 accent-orange-500" />
                  <span className="text-white font-bold w-10 text-right">{quadC}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-sm space-y-1">
                  <p className="text-gray-400">📊 <strong className="text-white">a = {quadA}</strong> → {quadA > 0 ? 'parabola opens ∪ upward' : quadA < 0 ? 'parabola opens ∩ downward' : 'flat line'}</p>
                  <p className="text-gray-400">📍 <strong className="text-white">Vertex at (0, {quadC})</strong></p>
                  <p className="text-gray-400">📏 <strong className="text-white">|a| = {Math.abs(quadA)}</strong> → {Math.abs(quadA) > 1 ? 'narrow (steep)' : Math.abs(quadA) < 1 ? 'wide (flat)' : 'standard width'}</p>
                </div>
              </>
            )}
          </div>

          {/* Values table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <button className="w-full px-4 py-2 text-left text-white font-bold text-sm flex justify-between items-center hover:bg-white/5" onClick={() => setShowTable(!showTable)}>
              <span>📋 Values Table</span>
              <span>{showTable ? '▼' : '▶'}</span>
            </button>
            {showTable && (
              <div className="p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-blue-400 text-left pb-2">x</th>
                      <th className="text-green-400 text-left pb-2">y</th>
                      <th className="text-gray-400 text-left pb-2">(x, y)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableValues.map(({ x, y }) => (
                      <tr key={x} className="border-t border-white/5">
                        <td className="py-1 text-blue-300">{x}</td>
                        <td className="py-1 text-green-300">{y.toFixed(1)}</td>
                        <td className="py-1 text-gray-400">({x}, {y.toFixed(1)})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
