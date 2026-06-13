import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from "react-i18next";

export default function StatisticsLab() {
    const { t } = useTranslation();
  const [data, setData] = useState<number[]>([4, 7, 2, 9, 5, 7, 3, 8, 7, 6]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challengeType, setChallengeType] = useState<'mean' | 'median' | 'mode' | 'range'>('mean');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

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
      setMastery(m => m + 1);
      setTimeout(() => generateChallenge(), 1500);
    } else {
      setFeedback('hint');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const maxVal = Math.max(...data, 1);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.statisticslab.statistics_lab">📊 Statistics Lab</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.statisticslab.analyze_data_like_a_data_scien">Analyze data like a data scientist!</Trans></p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setMode('explore')}><Trans i18nKey="auto.statisticslab.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => { setMode('challenge'); generateChallenge(); }}><Trans i18nKey="auto.statisticslab.challenge">🎯 Challenge</Trans></button>
      </div>

      {mode === 'challenge' && (
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 mb-4 text-center">
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm font-bold"><Trans i18nKey="auto.statisticslab.mastery">⭐ Mastery:</Trans> {mastery}</span>
          <p className="text-white font-bold text-xl mt-2">
            <Trans i18nKey="auto.statisticslab.find_the">Find the</Trans> <span className="text-purple-400 uppercase">{challengeType}</span> <Trans i18nKey="auto.statisticslab.of_this_data_set">of this data set:</Trans>
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
            <button onClick={checkAnswer} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold"><Trans i18nKey="auto.statisticslab.check">Check</Trans></button>
          </div>
          {feedback === 'correct' && <p className="text-green-400 font-bold mt-2"><Trans i18nKey="auto.statisticslab.correct">✅ Correct!</Trans></p>}
          {feedback === 'hint' && <p className="text-sky-400 font-bold mt-2"><Trans i18nKey="auto.statisticslab.try_again_answer">🤔 Let us explore! (Answer:</Trans> {
            challengeType === 'mean' ? stats.mean :
            challengeType === 'median' ? stats.median :
            challengeType === 'mode' ? (stats.mode.length > 0 ? stats.mode.join(', ') : t('auto.statisticslab.no_mode', 'No mode')) :
            stats.range
          })</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data input & visualization */}
        <div className="space-y-4">
          {mode === 'explore' && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.statisticslab.your_data_set">📝 Your Data Set</Trans></h4>
              <div className="flex gap-2 mb-3">
                <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder={t('auto.statisticslab.enter_a_number_0_100', 'Enter a number (0-100)')}
                  onKeyDown={e => e.key === 'Enter' && addNumber()} />
                <button onClick={addNumber} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold"><Trans i18nKey="auto.statisticslab.add">Add</Trans></button>
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
                <button onClick={() => setData([4, 7, 2, 9, 5, 7, 3, 8, 7, 6])} className="text-sm text-gray-400 hover:text-white"><Trans i18nKey="auto.statisticslab.reset">Reset</Trans></button>
                <button onClick={() => setData(Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1))} className="text-sm text-gray-400 hover:text-white"><Trans i18nKey="auto.statisticslab.random">Random</Trans></button>
                <button onClick={() => setData([])} className="text-sm text-gray-400 hover:text-sky-400"><Trans i18nKey="auto.statisticslab.clear">Clear</Trans></button>
              </div>
            </div>
          )}

          {/* Bar chart */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.statisticslab.bar_chart">📊 Bar Chart</Trans></h4>
            <div className="flex items-end gap-1 h-40 px-2">
              {data.map((n, i) => (
                <motion.div key={i} className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }} animate={{ height: 'auto' }}>
                  <span className="text-sm text-gray-400 mb-1">{n}</span>
                  <motion.div
                    className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${(n / maxVal) * 120}px` }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2 px-2">
              <span><Trans i18nKey="auto.statisticslab.1">1</Trans></span>
              <span>{data.length}</span>
            </div>
          </div>

          {/* Dot plot */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.statisticslab.dot_plot">🔵 Dot Plot</Trans></h4>
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
              <span className="absolute bottom-0 left-0 text-sm text-gray-400">{stats.min}</span>
              <span className="absolute bottom-0 right-0 text-sm text-gray-400">{stats.max}</span>
            </div>
          </div>
        </div>

        {/* Statistics display */}
        <div className="space-y-3">
          {[
            { label: t('auto.statisticslab.mean_average', 'Mean (Average)'), value: stats.mean, emoji: '➗', color: 'blue', formula: t('auto.statisticslab.sum_div_count', 'Sum ÷ Count = {{sum}} ÷ {{count}}', { sum: stats.sum, count: data.length }), desc: t('auto.statisticslab.add_all_numbers', 'Add all numbers, divide by count') },
            { label: t('auto.statisticslab.median_middle', 'Median (Middle)'), value: stats.median, emoji: '🎯', color: 'green', formula: t('auto.statisticslab.middle_value_when_sorted', 'Middle value when sorted'), desc: t('auto.statisticslab.middle_number_when_data_is', 'The middle number when data is ordered') },
            { label: t('auto.statisticslab.mode_most_common', 'Mode (Most Common)'), value: stats.mode.length > 0 ? stats.mode.join(', ') : t('auto.statisticslab.none', 'None'), emoji: '🏆', color: 'yellow', formula: t('auto.statisticslab.most_frequent_values', 'Most frequent value(s)'), desc: t('auto.statisticslab.number_that_appears_most', 'The number that appears most often') },
            { label: t('auto.statisticslab.range_spread', 'Range (Spread)'), value: stats.range, emoji: '↔️', color: 'purple', formula: t('auto.statisticslab.max_min', 'Max - Min = {{max}} - {{min}}', { max: stats.max, min: stats.min }), desc: t('auto.statisticslab.difference_between_highest', 'Difference between highest and lowest') },
            { label: t('auto.statisticslab.sum_total', 'Sum (Total)'), value: stats.sum, emoji: '➕', color: 'cyan', formula: data.slice(0, 5).join(' + ') + (data.length > 5 ? ' + ...' : ''), desc: t('auto.statisticslab.all_numbers_added_together', 'All numbers added together') },
            { label: t('auto.statisticslab.count', 'Count'), value: data.length, emoji: '🔢', color: 'pink', formula: t('auto.statisticslab.number_of_data_points', 'Number of data points'), desc: t('auto.statisticslab.how_many_numbers_in_the', 'How many numbers in the set') },
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
                    <p className="text-gray-400 text-sm">{stat.desc}</p>
                  </div>
                </div>
                <motion.span key={String(stat.value)} className="text-2xl font-bold text-white"
                  initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-gray-500 text-sm mt-2 font-mono">{stat.formula}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
