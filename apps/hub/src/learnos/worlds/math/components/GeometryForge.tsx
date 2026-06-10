import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GeoMode = 'angles' | 'pythagoras' | 'areas';

export default function GeometryForge() {
  const [mode, setMode] = useState<GeoMode>('angles');

  const modes = [
    { id: 'angles' as GeoMode, emoji: '📐', label: 'Angles', desc: 'Explore & calculate' },
    { id: 'pythagoras' as GeoMode, emoji: '📏', label: 'Pythagoras', desc: 'a² + b² = c²' },
    { id: 'areas' as GeoMode, emoji: '🔷', label: 'Areas', desc: 'Shapes & formulas' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📐 Geometry Forge</h2>
        <p className="text-purple-300 text-lg">Shape your understanding of geometry!</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {modes.map(m => (
          <motion.button key={m.id}
            className={`p-3 rounded-xl border-2 text-center ${mode === m.id ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5'}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode(m.id)}
          >
            <span className="text-2xl">{m.emoji}</span>
            <p className="text-white font-bold text-sm mt-1">{m.label}</p>
            <p className="text-gray-500 text-sm">{m.desc}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          {mode === 'angles' && <AngleExplorer />}
          {mode === 'pythagoras' && <PythagorasVisualizer />}
          {mode === 'areas' && <AreaCalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AngleExplorer() {
  const [angle, setAngle] = useState(45);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAngle, setQuizAngle] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<'identify' | 'complementary' | 'supplementary'>('identify');

  const getAngleType = (a: number) => {
    if (a === 0) return { name: 'Zero', emoji: '⬜', color: 'text-gray-400' };
    if (a < 90) return { name: 'Acute', emoji: '📐', color: 'text-green-400' };
    if (a === 90) return { name: 'Right', emoji: '📏', color: 'text-blue-400' };
    if (a < 180) return { name: 'Obtuse', emoji: '📐', color: 'text-orange-400' };
    if (a === 180) return { name: 'Straight', emoji: '➖', color: 'text-yellow-400' };
    return { name: 'Reflex', emoji: '🔄', color: 'text-red-400' };
  };

  const info = getAngleType(angle);
  const rad = (angle * Math.PI) / 180;
  const armLength = 80;
  const cx = 100, cy = 100;
  const endX = cx + Math.cos(-rad) * armLength;
  const endY = cy + Math.sin(-rad) * armLength;

  const generateQuiz = () => {
    setQuizMode(true);
    const types: ('identify' | 'complementary' | 'supplementary')[] = ['identify', 'complementary', 'supplementary'];
    const t = types[Math.floor(Math.random() * types.length)];
    setQuizType(t);
    setQuizAngle(Math.floor(Math.random() * 170) + 5);
    setQuizAnswer('');
    setQuizFeedback(null);
  };

  const checkQuizAnswer = () => {
    const parsed = parseInt(quizAnswer);
    let correct: number | string;
    if (quizType === 'identify') {
      correct = getAngleType(quizAngle).name.toLowerCase();
      if (quizAnswer.toLowerCase().trim() === correct) {
        setQuizFeedback('correct');
      } else {
        setQuizFeedback(`Wrong! ${quizAngle}° is ${getAngleType(quizAngle).name}`);
      }
      return;
    }
    if (quizType === 'complementary') correct = 90 - quizAngle;
    else correct = 180 - quizAngle;

    if (parsed === correct) setQuizFeedback('correct');
    else setQuizFeedback(`Wrong! Answer is ${correct}°`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Arc */}
          <path
            d={`M ${cx + 30} ${cy} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${cx + Math.cos(-rad) * 30} ${cy + Math.sin(-rad) * 30}`}
            fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.6"
          />
          {/* Base arm */}
          <line x1={cx} y1={cy} x2={cx + armLength} y2={cy} stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          {/* Rotating arm */}
          <motion.line
            x1={cx} y1={cy} x2={endX} y2={endY}
            stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"
            initial={false}
            animate={{ x2: endX, y2: endY }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="4" fill="#8b5cf6" />
          {/* Angle text */}
          <text x={cx + 40} y={cy - 10} fill="white" fontSize="14" fontWeight="bold">{angle}°</text>
          {angle === 90 && <rect x={cx + 3} y={cy - 13} width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2" />}
        </svg>

        <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))}
          className="w-48 mt-2 accent-purple-500" />
        <p className="text-gray-400 text-sm mt-1">Drag to change angle</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <p className={`font-bold text-xl ${info.color}`}>{info.name} Angle</p>
              <p className="text-gray-400 text-sm">{angle}°</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between bg-white/5 px-3 py-2 rounded-lg">
              <span className="text-gray-400">Complement (90° - θ):</span>
              <span className="text-blue-400 font-bold">{angle <= 90 ? `${90 - angle}°` : 'N/A'}</span>
            </div>
            <div className="flex justify-between bg-white/5 px-3 py-2 rounded-lg">
              <span className="text-gray-400">Supplement (180° - θ):</span>
              <span className="text-orange-400 font-bold">{angle <= 180 ? `${180 - angle}°` : 'N/A'}</span>
            </div>
            <div className="flex justify-between bg-white/5 px-3 py-2 rounded-lg">
              <span className="text-gray-400">Radians:</span>
              <span className="text-purple-400 font-bold">{(angle * Math.PI / 180).toFixed(3)} rad</span>
            </div>
          </div>
        </div>

        {/* Angle types reference */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm space-y-1">
          <p className="text-green-400">📐 Acute: 0° &lt; θ &lt; 90°</p>
          <p className="text-blue-400">📏 Right: θ = 90°</p>
          <p className="text-orange-400">📐 Obtuse: 90° &lt; θ &lt; 180°</p>
          <p className="text-yellow-400">➖ Straight: θ = 180°</p>
          <p className="text-red-400">🔄 Reflex: 180° &lt; θ &lt; 360°</p>
        </div>

        

        {quizMode && (
          <motion.div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {quizType === 'identify' ? (
              <p className="text-white mb-2">What type of angle is <span className="text-purple-400 font-bold">{quizAngle}°</span>?</p>
            ) : quizType === 'complementary' ? (
              <p className="text-white mb-2">What is the complement of <span className="text-purple-400 font-bold">{quizAngle}°</span>?</p>
            ) : (
              <p className="text-white mb-2">What is the supplement of <span className="text-purple-400 font-bold">{quizAngle}°</span>?</p>
            )}
            <div className="flex gap-2">
              <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                placeholder={quizType === 'identify' ? 'acute/right/obtuse...' : 'degrees'}
                onKeyDown={e => e.key === 'Enter' && checkQuizAnswer()} />
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm" onClick={checkQuizAnswer}>Check</button>
            </div>
            {quizFeedback === 'correct' && <p className="text-green-400 font-bold mt-2">✅ Correct!</p>}
            {quizFeedback && quizFeedback !== 'correct' && <p className="text-red-400 text-sm mt-2">{quizFeedback}</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PythagorasVisualizer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = useMemo(() => Math.sqrt(a * a + b * b), [a, b]);
  const isWhole = Math.abs(c - Math.round(c)) < 0.001;

  const triples = [[3,4,5],[5,12,13],[6,8,10],[7,24,25],[8,15,17],[9,12,15],[9,40,41],[12,16,20]];

  const scale = 18;
  const svgW = 350;
  const svgH = 280;
  const ox = 50, oy = svgH - 50;

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-400 text-sm">Side a</label>
            <input type="range" min="1" max="12" value={a} onChange={e => setA(parseInt(e.target.value))} className="w-24 accent-blue-500" />
            <span className="text-blue-400 font-bold">{a}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-400 text-sm">Side b</label>
            <input type="range" min="1" max="12" value={b} onChange={e => setB(parseInt(e.target.value))} className="w-24 accent-orange-500" />
            <span className="text-orange-400 font-bold">{b}</span>
          </div>
        </div>

        {/* Formula display */}
        <div className="text-center text-xl sm:text-2xl font-bold mb-4">
          <span className="text-blue-400">{a}²</span>
          <span className="text-gray-400 mx-1">+</span>
          <span className="text-orange-400">{b}²</span>
          <span className="text-gray-400 mx-1">=</span>
          <span className="text-blue-400">{a * a}</span>
          <span className="text-gray-400 mx-1">+</span>
          <span className="text-orange-400">{b * b}</span>
          <span className="text-gray-400 mx-1">=</span>
          <span className="text-green-400">{a * a + b * b}</span>
          <span className="text-gray-400 mx-1">→</span>
          <span className="text-green-400">c = {c.toFixed(2)}</span>
          {isWhole && <span className="text-yellow-400 ml-2">⭐</span>}
        </div>

        {/* Triangle SVG */}
        <div className="flex justify-center">
          <svg width={svgW} height={svgH} className="bg-white/5 rounded-xl">
            {/* Triangle */}
            <polygon
              points={`${ox},${oy} ${ox + a * scale},${oy} ${ox},${oy - b * scale}`}
              fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf6" strokeWidth="2"
            />
            {/* Right angle marker */}
            <rect x={ox} y={oy - 12} width="12" height="12" fill="none" stroke="#64748b" strokeWidth="1.5" />
            {/* Side labels */}
            <text x={ox + (a * scale) / 2} y={oy + 20} fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">a = {a}</text>
            <text x={ox - 20} y={oy - (b * scale) / 2} fill="#fb923c" fontSize="14" fontWeight="bold" textAnchor="middle">b = {b}</text>
            <text x={ox + (a * scale) / 2 + 15} y={oy - (b * scale) / 2 - 5} fill="#4ade80" fontSize="14" fontWeight="bold" textAnchor="middle" transform={`rotate(${-Math.atan2(b,a)*180/Math.PI}, ${ox + (a * scale) / 2 + 15}, ${oy - (b * scale) / 2 - 5})`}>c = {c.toFixed(1)}</text>
            {/* Squares on sides */}
            <rect x={ox} y={oy} width={a * scale} height={a * scale * 0.15} fill="rgba(96, 165, 250, 0.15)" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3" />
            <text x={ox + (a * scale) / 2} y={oy + a * scale * 0.15 + 14} fill="#60a5fa" fontSize="10" textAnchor="middle">a² = {a * a}</text>
            <rect x={ox - b * scale * 0.15} y={oy - b * scale} width={b * scale * 0.15} height={b * scale} fill="rgba(251, 146, 60, 0.15)" stroke="#fb923c" strokeWidth="1" strokeDasharray="3" />
            <text x={ox - b * scale * 0.15 - 10} y={oy - (b * scale) / 2} fill="#fb923c" fontSize="10" textAnchor="middle" transform={`rotate(-90, ${ox - b * scale * 0.15 - 10}, ${oy - (b * scale) / 2})`}>b² = {b * b}</text>
          </svg>
        </div>
      </div>

      {/* Pythagorean triples */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-2">⭐ Pythagorean Triples</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {triples.map(([ta, tb, tc]) => (
            <motion.button key={`${ta}-${tb}`}
              className={`text-sm px-2 py-2 rounded-lg border text-center transition-all ${a === ta && b === tb ? 'bg-purple-500/30 border-purple-400 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              onClick={() => { setA(ta); setB(tb); }}
              whileTap={{ scale: 0.95 }}
            >
              ({ta}, {tb}, {tc})
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AreaCalculator() {
  const [shape, setShape] = useState<'rectangle' | 'triangle' | 'circle' | 'trapezoid'>('rectangle');
  const [dim1, setDim1] = useState(8);
  const [dim2, setDim2] = useState(5);
  const [dim3, setDim3] = useState(3);

  const calculations = useMemo(() => {
    switch (shape) {
      case 'rectangle':
        return { area: dim1 * dim2, perimeter: 2 * (dim1 + dim2), formula: `A = l × w = ${dim1} × ${dim2}`, perimFormula: `P = 2(l + w) = 2(${dim1} + ${dim2})` };
      case 'triangle':
        return { area: (dim1 * dim2) / 2, perimeter: 0, formula: `A = ½ × b × h = ½ × ${dim1} × ${dim2}`, perimFormula: 'P = a + b + c' };
      case 'circle':
        return { area: Math.PI * dim1 * dim1, perimeter: 2 * Math.PI * dim1, formula: `A = π × r² = π × ${dim1}²`, perimFormula: `C = 2πr = 2π × ${dim1}` };
      case 'trapezoid':
        return { area: ((dim1 + dim3) * dim2) / 2, perimeter: 0, formula: `A = ½(a+b) × h = ½(${dim1}+${dim3}) × ${dim2}`, perimFormula: 'P = a + b + c + d' };
    }
  }, [shape, dim1, dim2, dim3]);

  const shapes = [
    { id: 'rectangle' as const, emoji: '🟦', label: 'Rectangle' },
    { id: 'triangle' as const, emoji: '🔺', label: 'Triangle' },
    { id: 'circle' as const, emoji: '🔴', label: 'Circle' },
    { id: 'trapezoid' as const, emoji: '⬡', label: 'Trapezoid' },
  ];

  const svgW = 300, svgH = 200;
  const scale = 12;

  const renderShape = () => {
    const cx = svgW / 2, cy = svgH / 2;
    switch (shape) {
      case 'rectangle':
        return (
          <g>
            <rect x={cx - dim1 * scale / 2} y={cy - dim2 * scale / 2} width={dim1 * scale} height={dim2 * scale}
              fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
            <text x={cx} y={cy + dim2 * scale / 2 + 18} fill="#60a5fa" fontSize="12" textAnchor="middle">l = {dim1}</text>
            <text x={cx - dim1 * scale / 2 - 15} y={cy} fill="#60a5fa" fontSize="12" textAnchor="middle" transform={`rotate(-90, ${cx - dim1 * scale / 2 - 15}, ${cy})`}>w = {dim2}</text>
          </g>
        );
      case 'triangle':
        return (
          <g>
            <polygon points={`${cx},${cy - dim2 * scale / 2} ${cx - dim1 * scale / 2},${cy + dim2 * scale / 2} ${cx + dim1 * scale / 2},${cy + dim2 * scale / 2}`}
              fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2" />
            <text x={cx} y={cy + dim2 * scale / 2 + 18} fill="#f87171" fontSize="12" textAnchor="middle">b = {dim1}</text>
            <line x1={cx} y1={cy - dim2 * scale / 2} x2={cx} y2={cy + dim2 * scale / 2} stroke="#f87171" strokeWidth="1" strokeDasharray="4" />
            <text x={cx + 12} y={cy} fill="#f87171" fontSize="11" textAnchor="start">h = {dim2}</text>
          </g>
        );
      case 'circle':
        return (
          <g>
            <circle cx={cx} cy={cy} r={dim1 * scale} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={cx + dim1 * scale} y2={cy} stroke="#a855f7" strokeWidth="2" strokeDasharray="4" />
            <text x={cx + dim1 * scale / 2} y={cy - 8} fill="#c084fc" fontSize="12" textAnchor="middle">r = {dim1}</text>
          </g>
        );
      case 'trapezoid': {
        const top = dim3 * scale;
        const bot = dim1 * scale;
        const h = dim2 * scale;
        return (
          <g>
            <polygon points={`${cx - top / 2},${cy - h / 2} ${cx + top / 2},${cy - h / 2} ${cx + bot / 2},${cy + h / 2} ${cx - bot / 2},${cy + h / 2}`}
              fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="2" />
            <text x={cx} y={cy - h / 2 - 8} fill="#fbbf24" fontSize="12" textAnchor="middle">a = {dim3}</text>
            <text x={cx} y={cy + h / 2 + 18} fill="#fbbf24" fontSize="12" textAnchor="middle">b = {dim1}</text>
            <line x1={cx + top / 2 + 10} y1={cy - h / 2} x2={cx + top / 2 + 10} y2={cy + h / 2} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4" />
            <text x={cx + top / 2 + 22} y={cy} fill="#fbbf24" fontSize="11">h = {dim2}</text>
          </g>
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 flex-wrap">
        {shapes.map(s => (
          <motion.button key={s.id}
            className={`px-3 py-2 rounded-lg text-sm font-bold ${shape === s.id ? 'bg-purple-500/40 text-white border border-purple-400' : 'bg-white/10 text-gray-400'}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShape(s.id)}
          >
            {s.emoji} {s.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center">
          <svg width={svgW} height={svgH} className="bg-white/5 rounded-xl mb-4">
            <defs>
              <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={svgW} height={svgH} fill="url(#grid)" />
            {renderShape()}
          </svg>

          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm w-24">{shape === 'circle' ? 'Radius' : shape === 'trapezoid' ? 'Base b' : 'Length'}</label>
              <input type="range" min="1" max="12" value={dim1} onChange={e => setDim1(parseInt(e.target.value))} className="flex-1 accent-blue-500" />
              <span className="text-white font-bold w-6">{dim1}</span>
            </div>
            {shape !== 'circle' && (
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm w-24">{shape === 'rectangle' ? 'Width' : 'Height'}</label>
                <input type="range" min="1" max="12" value={dim2} onChange={e => setDim2(parseInt(e.target.value))} className="flex-1 accent-orange-500" />
                <span className="text-white font-bold w-6">{dim2}</span>
              </div>
            )}
            {shape === 'trapezoid' && (
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm w-24">Top a</label>
                <input type="range" min="1" max="12" value={dim3} onChange={e => setDim3(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
                <span className="text-white font-bold w-6">{dim3}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20">
            <p className="text-gray-400 text-sm mb-1">Formula</p>
            <p className="text-white font-mono font-bold text-lg">{calculations.formula}</p>
            <motion.p key={calculations.area} className="text-3xl font-bold text-blue-400 mt-2" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              Area = {calculations.area.toFixed(2)} sq units
            </motion.p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-5 border border-green-500/20">
            <p className="text-gray-400 text-sm mb-1">Perimeter / Circumference</p>
            <p className="text-white font-mono text-sm">{calculations.perimFormula}</p>
            <motion.p key={calculations.perimeter} className="text-2xl font-bold text-green-400 mt-2" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              {shape === 'circle' ? 'C' : 'P'} = {calculations.perimeter > 0 ? calculations.perimeter.toFixed(2) : '—'} units
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
