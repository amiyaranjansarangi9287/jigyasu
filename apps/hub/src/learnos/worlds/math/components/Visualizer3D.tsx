import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GestureWrapper from '../../../../components/GestureWrapper';

type Operation = '+' | '-' | '×' | '÷';

export default function Visualizer3D() {
  const [numA, setNumA] = useState(5);
  const [numB, setNumB] = useState(3);
  const [operation, setOperation] = useState<Operation>('+');
  const [showResult, setShowResult] = useState(false);
  const [viewMode, setViewMode] = useState<'blocks' | 'bars' | 'circles'>('blocks');
  const [zoom, setZoom] = useState(1);

  const handlePinchZoom = (scale: number) => {
    setZoom(z => Math.max(0.5, Math.min(3, z * scale)));
  };

  const getResult = () => {
    switch (operation) {
      case '+': return numA + numB;
      case '-': return Math.max(0, numA - numB);
      case '×': return numA * numB;
      case '÷': return numB !== 0 ? Math.round((numA / numB) * 100) / 100 : 0;
    }
  };

  useEffect(() => {
    setShowResult(false);
    const timer = setTimeout(() => setShowResult(true), 300);
    return () => clearTimeout(timer);
  }, [numA, numB, operation]);

  const result = getResult();

  const renderBlocks = (count: number, color: string, label: string) => {
    const displayCount = Math.min(count, 50);
    const cols = Math.ceil(Math.sqrt(displayCount));
    return (
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400 mb-2">{label} = {count}</span>
        <div
          className="grid gap-1 p-3 rounded-xl bg-white/5 border border-white/10 min-h-[60px]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          <AnimatePresence>
            {Array.from({ length: displayCount }).map((_, i) => (
              <motion.div
                key={`${label}-${i}`}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}88)`,
                  boxShadow: `0 3px 0 ${color}66, 0 5px 10px ${color}33`,
                  transform: 'perspective(500px) rotateX(10deg)',
                }}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0, rotateY: -180 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 300 }}
              >
                {i + 1}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {count > 50 && <span className="text-sm text-gray-500 mt-1">(showing 50 of {count})</span>}
      </div>
    );
  };

  const renderBars = () => {
    const maxVal = Math.max(numA, numB, result, 1);
    const items = [
      { label: 'A', value: numA, color: '#3b82f6' },
      { label: 'B', value: numB, color: '#f97316' },
      { label: 'Result', value: result, color: '#22c55e' },
    ];
    return (
      <div className="flex items-end justify-center gap-6 sm:gap-10 h-56 px-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <motion.span
              className="text-lg font-bold text-white mb-1"
              key={item.value}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {item.value}
            </motion.span>
            <motion.div
              className="w-14 sm:w-20 rounded-t-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(to top, ${item.color}, ${item.color}aa)`,
                boxShadow: `5px 0 0 ${item.color}44, -5px 0 0 ${item.color}22, 0 0 20px ${item.color}33`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((item.value / maxVal) * 180, 10)}px` }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* 3D side face */}
              <div
                className="absolute right-0 top-0 bottom-0 w-3"
                style={{
                  background: `linear-gradient(to right, transparent, ${item.color}44)`,
                }}
              />
            </motion.div>
            <span className="text-sm text-gray-400 mt-2 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCircles = () => {
    const maxVal = Math.max(numA, numB, result, 1);
    const items = [
      { label: 'A', value: numA, color: '#8b5cf6', emoji: '🔮' },
      { label: 'B', value: numB, color: '#ec4899', emoji: '💎' },
      { label: 'Result', value: result, color: '#06b6d4', emoji: '⚡' },
    ];
    return (
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        {items.map((item, idx) => {
          const size = Math.max(40, (item.value / maxVal) * 120);
          return (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <motion.div
                className="rounded-full flex items-center justify-center relative"
                style={{
                  width: size + 20,
                  height: size + 20,
                  background: `radial-gradient(circle at 30% 30%, ${item.color}aa, ${item.color}33)`,
                  boxShadow: `0 0 ${size / 2}px ${item.color}44, inset 0 -${size / 4}px ${size / 3}px ${item.color}22`,
                }}
                animate={{
                  width: size + 20,
                  height: size + 20,
                  y: [0, -5, 0],
                }}
                transition={{
                  y: { duration: 2 + idx * 0.5, repeat: Infinity },
                  default: { duration: 0.5, type: 'spring' },
                }}
              >
                <span className="text-2xl">{item.emoji}</span>
                {/* Reflection highlight */}
                <div
                  className="absolute top-2 left-1/4 w-1/3 h-1/4 rounded-full"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }}
                />
              </motion.div>
              <span className="text-white font-bold text-lg">{item.value}</span>
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const operations: { op: Operation; label: string; color: string }[] = [
    { op: '+', label: 'Add', color: 'from-green-500 to-emerald-600' },
    { op: '-', label: 'Sub', color: 'from-red-500 to-rose-600' },
    { op: '×', label: 'Mul', color: 'from-blue-500 to-indigo-600' },
    { op: '÷', label: 'Div', color: 'from-yellow-500 to-amber-600' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📊 3D Math Visualizer</h2>
        <p className="text-purple-300 text-lg">See math come alive in 3D!</p>
      </div>

      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Number A */}
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-400 text-sm">Number A</label>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center hover:bg-blue-500/50"
                onClick={() => setNumA(Math.max(0, numA - 1))}
              >−</motion.button>
              <input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                className="w-16 text-center bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center hover:bg-blue-500/50"
                onClick={() => setNumA(Math.min(99, numA + 1))}
              >+</motion.button>
            </div>
          </div>

          {/* Operation */}
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-400 text-sm">Operation</label>
            <div className="flex gap-1">
              {operations.map(({ op, label, color }) => (
                <motion.button
                  key={op}
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                    operation === op
                      ? `bg-gradient-to-r ${color} text-white shadow-lg`
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  onClick={() => setOperation(op)}
                >
                  {op} {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Number B */}
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-400 text-sm">Number B</label>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-orange-500/30 text-orange-400 font-bold text-lg flex items-center justify-center hover:bg-orange-500/50"
                onClick={() => setNumB(Math.max(operation === '÷' ? 1 : 0, numB - 1))}
              >−</motion.button>
              <input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Math.max(operation === '÷' ? 1 : 0, Math.min(99, parseInt(e.target.value) || 0)))}
                className="w-16 text-center bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-xl font-bold focus:outline-none focus:border-orange-500"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-orange-500/30 text-orange-400 font-bold text-lg flex items-center justify-center hover:bg-orange-500/50"
                onClick={() => setNumB(Math.min(99, numB + 1))}
              >+</motion.button>
            </div>
          </div>
        </div>

        {/* Equation Display */}
        <motion.div
          className="mt-4 text-center"
          key={`${numA}${operation}${numB}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-3xl sm:text-4xl font-bold">
            <span className="text-blue-400">{numA}</span>
            <span className="text-purple-400 mx-2">{operation}</span>
            <span className="text-orange-400">{numB}</span>
            <span className="text-gray-400 mx-2">=</span>
            <motion.span
              className="text-green-400"
              key={result}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {result}
            </motion.span>
          </span>
        </motion.div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex justify-center gap-2 mb-6">
        {([
          { mode: 'blocks' as const, emoji: '🧱', label: 'Blocks' },
          { mode: 'bars' as const, emoji: '📊', label: '3D Bars' },
          { mode: 'circles' as const, emoji: '🔮', label: 'Spheres' },
        ]).map(({ mode, emoji, label }) => (
          <motion.button
            key={mode}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === mode
                ? 'bg-purple-500/40 text-white border border-purple-400/50'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setViewMode(mode)}
          >
            {emoji} {label}
          </motion.button>
        ))}
      </div>

      {/* Visualization Area */}
      <GestureWrapper 
        onPinchZoom={handlePinchZoom}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 min-h-[250px] flex items-center justify-center perspective-1000 overflow-hidden touch-none relative"
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          onWheel={(e) => {
            setZoom(z => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)));
          }}
        >
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>-</button>
          <button className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95" onClick={() => setZoom(1)}>R</button>
          <button className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>+</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${numA}-${numB}-${operation}`}
            initial={{ opacity: 0, rotateY: -30 }}
            animate={{ opacity: 1, rotateY: 0, scale: zoom }}
            exit={{ opacity: 0, rotateY: 30 }}
            transition={{ duration: 0.3 }}
            className="w-full origin-center"
          >
            {viewMode === 'blocks' && (
              <div className="flex flex-wrap items-start justify-center gap-6">
                {renderBlocks(numA, '#3b82f6', 'A')}
                <div className="flex flex-col items-center justify-center self-center">
                  <span className="text-3xl text-purple-400 font-bold">{operation}</span>
                </div>
                {renderBlocks(numB, '#f97316', 'B')}
                <div className="flex flex-col items-center justify-center self-center">
                  <span className="text-3xl text-gray-400 font-bold">=</span>
                </div>
                {showResult && renderBlocks(Math.min(Math.round(result), 99), '#22c55e', 'Result')}
              </div>
            )}
            {viewMode === 'bars' && renderBars()}
            {viewMode === 'circles' && renderCircles()}
          </motion.div>
        </AnimatePresence>
        </div>
      </GestureWrapper>

      {/* Fun fact */}
      <motion.div
        className="mt-4 text-center p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        key={`${numA}${operation}${numB}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm text-purple-300">
          {operation === '+' && `💡 Adding ${numA} and ${numB} is like combining ${numA} apples 🍎 with ${numB} oranges 🍊 = ${result} fruits!`}
          {operation === '-' && `💡 If you had ${numA} cookies 🍪 and ate ${numB}, you'd have ${result} left!`}
          {operation === '×' && `💡 ${numA} × ${numB} means ${numA} groups of ${numB} — that's ${result} altogether! 🎯`}
          {operation === '÷' && `💡 Sharing ${numA} pizzas 🍕 among ${numB} friends = ${result} each!`}
        </span>
      </motion.div>
    </div>
  );
}
