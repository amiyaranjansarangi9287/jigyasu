import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function StatisticsLab() {
  const [data, setData] = useState<number[]>([4, 7, 2, 9, 5, 7, 3, 8, 7, 6]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challengeType, setChallengeType] = useState<'mean' | 'median' | 'mode' | 'range'>('mean');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const stats = useMemo(() => {
    if (data.length === 0) return { mean: 0, median: 0, mode: [], range: 0, min: 0, max: 0, sum: 0 };
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    
    // Mode
    const freq: Record<number, number> = {};
    data.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq && v > 1).map(([k]) => Number(k));
    
    return {
      mean: Math.round(mean * 100) / 100,
      median,
      mode: modes,
      range: sorted[sorted.length - 1] - sorted[0],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sum
    };
  }, [data]);

  const addNumber = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setData([...data, num]);
      setInputValue('');
    }
  };

  const removeNumber = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const generateChallenge = () => {
    const types: ('mean' | 'median' | 'mode' | 'range')[] = ['mean', 'median', 'mode', 'range'];
    setChallengeType(types[Math.floor(Math.random() * types.length)]);
    const newData = Array.from({ length: Math.floor(Math.random() * 5) + 5 }, () => Math.floor(Math.random() * 20) + 1);
    // Ensure mode exists for mode challenges
    if (types[Math.floor(Math.random() * types.length)] === 'mode') {
      const modeVal = newData[0];
      newData.push(modeVal, modeVal);
    }
    setData(newData);
    setAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const parsed = parseFloat(answer);
    let correct = false;
    switch (challengeType) {
      case 'mean': correct = Math.abs(parsed - stats.mean) < 0.1; break;
      case 'median': correct = parsed === stats.median; break;
      case 'mode': correct = stats.mode.includes(parsed); break;
      case 'range': correct = parsed === stats.range; break;
    }
    if (correct) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => generateChallenge(), 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const maxVal = Math.max(...data, 1);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📊 Statistics Lab</h2>
        <p className="text-purple-300 text-lg">Analyze data like a data scientist!</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => { setMode('challenge'); generateChallenge(); }}>🎯 Challenge</button>
      </div>

      {mode === 'challenge' && (
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 mb-4 text-center">
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-bold">⭐ Score: {score}</span>
          <p className="text-white font-bold text-xl mt-2">
            Find the <span className="text-purple-400 uppercase">{challengeType}</span> of this data set:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {data.map((n, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-white font-bold">{n}</span>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
              className="w-24 text-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold"
              placeholder="?" onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
            <button onClick={checkAnswer} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold">Check</button>
          </div>
          {feedback === 'correct' && <p className="text-green-400 font-bold mt-2">✅ Correct!</p>}
          {feedback === 'wrong' && <p className="text-red-400 font-bold mt-2">❌ Try again! (Answer: {
            challengeType === 'mean' ? stats.mean :
            challengeType === 'median' ? stats.median :
            challengeType === 'mode' ? (stats.mode.length > 0 ? stats.mode.join(', ') : 'No mode') :
            stats.range
          })</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data input & visualization */}
        <div className="space-y-4">
          {mode === 'explore' && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3">📝 Your Data Set</h4>
              <div className="flex gap-2 mb-3">
                <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter a number (0-100)"
                  onKeyDown={e => e.key === 'Enter' && addNumber()} />
                <button onClick={addNumber} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.map((n, i) => (
                  <motion.button key={i}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg font-bold text-sm hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    onClick={() => removeNumber(i)}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >{n} ×</motion.button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setData([4, 7, 2, 9, 5, 7, 3, 8, 7, 6])} className="text-xs text-gray-400 hover:text-white">Reset</button>
                <button onClick={() => setData(Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1))} className="text-xs text-gray-400 hover:text-white">Random</button>
                <button onClick={() => setData([])} className="text-xs text-gray-400 hover:text-red-400">Clear</button>
              </div>
            </div>
          )}

          {/* Bar chart */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">📊 Bar Chart</h4>
            <div className="flex items-end gap-1 h-40 px-2">
              {data.map((n, i) => (
                <motion.div key={i} className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }} animate={{ height: 'auto' }}>
                  <span className="text-xs text-gray-400 mb-1">{n}</span>
                  <motion.div
                    className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${(n / maxVal) * 120}px` }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>1</span>
              <span>{data.length}</span>
            </div>
          </div>

          {/* Dot plot */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">🔵 Dot Plot</h4>
            <div className="relative h-20">
              {/* Number line */}
              <div className="absolute bottom-4 left-0 right-0 h-px bg-gray-600" />
              {/* Dots */}
              {Object.entries(data.reduce((acc, n) => { acc[n] = (acc[n] || 0) + 1; return acc; }, {} as Record<number, number>))
                .map(([val, count]) => {
                  const x = ((Number(val) - stats.min) / (stats.range || 1)) * 100;
                  return Array.from({ length: count }).map((_, i) => (
                    <motion.div key={`${val}-${i}`}
                      className="absolute w-3 h-3 rounded-full bg-cyan-500"
                      style={{ left: `calc(${x}% - 6px)`, bottom: `${20 + i * 14}px` }}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ));
                })}
              {/* Labels */}
              <span className="absolute bottom-0 left-0 text-xs text-gray-400">{stats.min}</span>
              <span className="absolute bottom-0 right-0 text-xs text-gray-400">{stats.max}</span>
            </div>
          </div>
        </div>

        {/* Statistics display */}
        <div className="space-y-3">
          {[
            { label: 'Mean (Average)', value: stats.mean, emoji: '➗', color: 'blue', formula: `Sum ÷ Count = ${stats.sum} ÷ ${data.length}`, desc: 'Add all numbers, divide by count' },
            { label: 'Median (Middle)', value: stats.median, emoji: '🎯', color: 'green', formula: `Middle value when sorted`, desc: 'The middle number when data is ordered' },
            { label: 'Mode (Most Common)', value: stats.mode.length > 0 ? stats.mode.join(', ') : 'None', emoji: '🏆', color: 'yellow', formula: 'Most frequent value(s)', desc: 'The number that appears most often' },
            { label: 'Range (Spread)', value: stats.range, emoji: '↔️', color: 'purple', formula: `Max - Min = ${stats.max} - ${stats.min}`, desc: 'Difference between highest and lowest' },
            { label: 'Sum (Total)', value: stats.sum, emoji: '➕', color: 'cyan', formula: data.slice(0, 5).join(' + ') + (data.length > 5 ? ' + ...' : ''), desc: 'All numbers added together' },
            { label: 'Count', value: data.length, emoji: '🔢', color: 'pink', formula: 'Number of data points', desc: 'How many numbers in the set' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              className={`bg-${stat.color}-500/10 rounded-xl p-4 border border-${stat.color}-500/20`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stat.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{stat.label}</p>
                    <p className="text-gray-400 text-xs">{stat.desc}</p>
                  </div>
                </div>
                <motion.span key={String(stat.value)} className="text-2xl font-bold text-white"
                  initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-gray-500 text-xs mt-2 font-mono">{stat.formula}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
