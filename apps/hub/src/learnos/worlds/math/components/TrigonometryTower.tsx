import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TrigonometryTower() {
  const [angle, setAngle] = useState(45);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challengeFunc, setChallengeFunc] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [challengeAngle, setChallengeAngle] = useState(30);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mastery, setMastery] = useState(0);

  const rad = (angle * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);

  const svgSize = 280;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = 100;

  // Point on unit circle
  const px = cx + Math.cos(-rad + Math.PI / 2) * radius;
  const py = cy - Math.sin(-rad + Math.PI / 2) * radius;



  const trigValues: Record<number, { sin: string; cos: string; tan: string }> = {
    0: { sin: '0', cos: '1', tan: '0' },
    30: { sin: '1/2', cos: '√3/2', tan: '1/√3' },
    45: { sin: '√2/2', cos: '√2/2', tan: '1' },
    60: { sin: '√3/2', cos: '1/2', tan: '√3' },
    90: { sin: '1', cos: '0', tan: '∞' },
    120: { sin: '√3/2', cos: '-1/2', tan: '-√3' },
    135: { sin: '√2/2', cos: '-√2/2', tan: '-1' },
    150: { sin: '1/2', cos: '-√3/2', tan: '-1/√3' },
    180: { sin: '0', cos: '-1', tan: '0' },
  };

  const generateChallenge = () => {
    const funcs: ('sin' | 'cos' | 'tan')[] = ['sin', 'cos', 'tan'];
    const angles = [0, 30, 45, 60, 90];
    setChallengeFunc(funcs[Math.floor(Math.random() * funcs.length)]);
    const newAngle = angles[Math.floor(Math.random() * angles.length)];
    // Avoid tan(90)
    if (funcs[Math.floor(Math.random() * funcs.length)] === 'tan' && newAngle === 90) {
      setChallengeAngle(45);
    } else {
      setChallengeAngle(newAngle);
    }
    setAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correct = trigValues[challengeAngle]?.[challengeFunc] || '';
    const userAns = answer.trim().toLowerCase().replace(/\s/g, '');
    const correctAns = correct.toLowerCase().replace(/\s/g, '');

    // Multiple valid formats
    const alternatives: Record<string, string[]> = {
      '0': ['0'],
      '1': ['1'],
      '1/2': ['1/2', '0.5', '.5'],
      '√2/2': ['√2/2', 'sqrt2/2', '0.707', '0.71'],
      '√3/2': ['√3/2', 'sqrt3/2', '0.866', '0.87'],
      '√3': ['√3', 'sqrt3', '1.732', '1.73'],
      '1/√3': ['1/√3', '1/sqrt3', '√3/3', 'sqrt3/3', '0.577', '0.58'],
      '-1': ['-1'],
      '-1/2': ['-1/2', '-0.5'],
      '-√2/2': ['-√2/2', '-sqrt2/2', '-0.707', '-0.71'],
      '-√3/2': ['-√3/2', '-sqrt3/2', '-0.866', '-0.87'],
      '-√3': ['-√3', '-sqrt3', '-1.732', '-1.73'],
      '-1/√3': ['-1/√3', '-1/sqrt3', '-√3/3', '-sqrt3/3', '-0.577', '-0.58'],
      '∞': ['∞', 'infinity', 'undefined', 'undef'],
    };

    const isCorrect = alternatives[correct]?.some(alt => userAns === alt.toLowerCase().replace(/\s/g, '')) ||
      userAns === correctAns;

    if (isCorrect) {
      setFeedback('correct');
      setMastery(m => m + 1);
      setTimeout(generateChallenge, 1500);
    } else {
      setFeedback(`Wrong! ${challengeFunc}(${challengeAngle}°) = ${correct}`);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📐 Trigonometry Tower</h2>
        <p className="text-purple-300 text-lg">Master sine, cosine, and tangent!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-gray-400'}`}
          onClick={() => { setMode('challenge'); generateChallenge(); }}>🎯 Challenge</button>
      </div>

      {mode === 'challenge' && (
        <motion.div className="max-w-md mx-auto bg-purple-500/10 rounded-2xl p-6 border border-purple-500/30 mb-6"
          initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm font-bold">⭐ Mastery: {mastery}</span>
          <p className="text-2xl font-bold text-white text-center mt-4">
            {challengeFunc}(<span className="text-purple-400">{challengeAngle}°</span>) = ?
          </p>
          <div className="flex gap-2 mt-4">
            <input value={answer} onChange={e => setAnswer(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-center"
              placeholder="e.g., 1/2 or √3/2"
              onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
            <button onClick={checkAnswer} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold">Check</button>
          </div>
          {feedback === 'correct' && <p className="text-green-400 font-bold mt-3 text-center">✅ Correct!</p>}
          {feedback && feedback !== 'correct' && <p className="text-red-400 text-sm mt-3 text-center">{feedback}</p>}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit circle visualization */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-3 text-center">📊 Unit Circle</h4>
          <div className="flex justify-center">
            <svg width={svgSize} height={svgSize} className="bg-gray-900/50 rounded-xl">
              {/* Grid */}
              <line x1={cx} y1={0} x2={cx} y2={svgSize} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1={0} y1={cy} x2={svgSize} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Unit circle */}
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" />

              {/* Angle arc */}
              <path
                d={`M ${cx} ${cy - 30} A 30 30 0 ${angle > 180 ? 1 : 0} 1 ${cx + Math.cos(-rad + Math.PI / 2) * 30} ${cy - Math.sin(-rad + Math.PI / 2) * 30}`}
                fill="none" stroke="#a855f7" strokeWidth="2"
              />

              {/* Radius line */}
              <motion.line x1={cx} y1={cy} x2={px} y2={py}
                stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"
                animate={{ x2: px, y2: py }}
                transition={{ type: 'spring', stiffness: 200 }}
              />

              {/* Sin line (vertical) */}
              <motion.line x1={px} y1={cy} x2={px} y2={py}
                stroke="#22c55e" strokeWidth="3" strokeLinecap="round"
                animate={{ x1: px, x2: px, y2: py }}
              />

              {/* Cos line (horizontal) */}
              <motion.line x1={cx} y1={cy} x2={px} y2={cy}
                stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
                animate={{ x2: px }}
              />

              {/* Point on circle */}
              <motion.circle cx={px} cy={py} r="6" fill="#8b5cf6"
                animate={{ cx: px, cy: py }}
                transition={{ type: 'spring', stiffness: 200 }}
              />

              {/* Labels */}
              <text x={cx + 5} y={cy - 5} fill="rgba(255,255,255,0.4)" fontSize="12">0°</text>
              <text x={cx + 5} y={20} fill="rgba(255,255,255,0.4)" fontSize="12">90°</text>
              <text x={15} y={cy - 5} fill="rgba(255,255,255,0.4)" fontSize="12">180°</text>
              <text x={cx + 5} y={svgSize - 10} fill="rgba(255,255,255,0.4)" fontSize="12">270°</text>

              {/* Angle text */}
              <text x={cx + 40} y={cy - 35} fill="white" fontSize="14" fontWeight="bold">{angle}°</text>

              {/* Legend */}
              <text x={10} y={svgSize - 30} fill="#22c55e" fontSize="11">— sin</text>
              <text x={10} y={svgSize - 15} fill="#3b82f6" fontSize="11">— cos</text>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4">
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))}
              className="w-48 accent-purple-500" />
            <span className="text-white font-bold w-12">{angle}°</span>
          </div>

          {/* Quick angle buttons */}
          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {[0, 30, 45, 60, 90, 180, 270, 360].map(a => (
              <button key={a} onClick={() => setAngle(a)}
                className={`px-2 py-1 rounded text-sm font-bold ${angle === a ? 'bg-purple-500/40 text-purple-300' : 'bg-white/10 text-gray-400'}`}>
                {a}°
              </button>
            ))}
          </div>
        </div>

        {/* Values display */}
        <div className="space-y-4">
          {/* Live values */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'sin', value: sinVal, color: 'green' },
              { name: 'cos', value: cosVal, color: 'blue' },
              { name: 'tan', value: Math.abs(tanVal) > 1000 ? '∞' : tanVal, color: 'orange' },
            ].map(f => (
              <motion.div key={f.name}
                className={`bg-${f.color}-500/10 rounded-xl p-4 border border-${f.color}-500/20 text-center`}>
                <p className={`text-${f.color}-400 font-bold text-sm`}>{f.name}({angle}°)</p>
                <motion.p key={`${f.name}-${angle}`}
                  className="text-white font-bold text-xl font-mono"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                >
                  {typeof f.value === 'number' ? f.value.toFixed(3) : f.value}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Exact values for special angles */}
          {trigValues[angle] && (
            <motion.div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-yellow-400 font-bold mb-2">⭐ Exact Values for {angle}°</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-green-400 text-sm">sin</p>
                  <p className="text-white font-bold">{trigValues[angle].sin}</p>
                </div>
                <div>
                  <p className="text-blue-400 text-sm">cos</p>
                  <p className="text-white font-bold">{trigValues[angle].cos}</p>
                </div>
                <div>
                  <p className="text-orange-400 text-sm">tan</p>
                  <p className="text-white font-bold">{trigValues[angle].tan}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Formulas */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-2">📝 Key Formulas</h4>
            <div className="text-sm font-mono space-y-1 text-gray-300">
              <p>sin²(θ) + cos²(θ) = 1</p>
              <p>tan(θ) = sin(θ) / cos(θ)</p>
              <p>sin(90° - θ) = cos(θ)</p>
              <p>cos(90° - θ) = sin(θ)</p>
            </div>
          </div>

          {/* Verify identity */}
          <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-center">
            <p className="text-gray-300 text-sm">
              Verify: sin²({angle}°) + cos²({angle}°) =
            </p>
            <p className="text-purple-400 font-bold">
              {sinVal.toFixed(4)}² + {cosVal.toFixed(4)}² = {(sinVal * sinVal + cosVal * cosVal).toFixed(4)} ≈ 1 ✓
            </p>
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-6">
        <h4 className="text-white font-bold mb-3">📋 Special Angles Reference</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="py-2">θ</th>
                <th className="py-2 text-green-400">sin</th>
                <th className="py-2 text-blue-400">cos</th>
                <th className="py-2 text-orange-400">tan</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {[0, 30, 45, 60, 90].map(a => (
                <tr key={a} className={`border-b border-white/5 ${angle === a ? 'bg-purple-500/20' : ''}`}>
                  <td className="py-2 font-bold">{a}°</td>
                  <td className="py-2 font-mono">{trigValues[a]?.sin}</td>
                  <td className="py-2 font-mono">{trigValues[a]?.cos}</td>
                  <td className="py-2 font-mono">{trigValues[a]?.tan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
