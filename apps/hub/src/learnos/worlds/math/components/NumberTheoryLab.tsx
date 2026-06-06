import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type LabMode = 'factors' | 'gcdlcm' | 'primecheck';

export default function NumberTheoryLab() {
  const [mode, setMode] = useState<LabMode>('factors');

  const modes = [
    { id: 'factors' as LabMode, emoji: '🌳', label: 'Factor Tree', desc: 'Prime factorization' },
    { id: 'gcdlcm' as LabMode, emoji: '🔗', label: 'GCD & LCM', desc: 'Greatest & least common' },
    { id: 'primecheck' as LabMode, emoji: '🔬', label: 'Prime Checker', desc: 'Is it prime?' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🔬 Number Theory Lab</h2>
        <p className="text-purple-300 text-lg">Explore the deep secrets of numbers!</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {modes.map(m => (
          <motion.button key={m.id}
            className={`p-3 rounded-xl border-2 text-center ${mode === m.id ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5'}`}
            whileTap={{ scale: 0.97 }} onClick={() => setMode(m.id)}
          >
            <span className="text-2xl">{m.emoji}</span>
            <p className="text-white font-bold text-sm mt-1">{m.label}</p>
            <p className="text-gray-500 text-sm">{m.desc}</p>
          </motion.button>
        ))}
      </div>

      {mode === 'factors' && <FactorTree />}
      {mode === 'gcdlcm' && <GcdLcmExplorer />}
      {mode === 'primecheck' && <PrimeChecker />}
    </div>
  );
}

function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let num = n;
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) { factors.push(d); num /= d; }
  }
  if (num > 1) factors.push(num);
  return factors;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function gcd(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function FactorTree() {
  const [num, setNum] = useState(60);
  const factors = useMemo(() => getFactors(num), [num]);
  const primeFactors = useMemo(() => getPrimeFactors(num), [num]);

  // Build tree levels
  const treeNodes = useMemo(() => {
    const levels: { value: number; isPrime: boolean }[][] = [];
    let remaining = [num];
    let level = 0;

    while (remaining.some(n => !isPrime(n) && n > 1) && level < 8) {
      const currentLevel: { value: number; isPrime: boolean }[] = [];
      const nextRemaining: number[] = [];

      for (const n of remaining) {
        currentLevel.push({ value: n, isPrime: isPrime(n) || n === 1 });
        if (isPrime(n) || n <= 1) {
          nextRemaining.push(n);
        } else {
          // Find smallest prime factor
          let factor = 2;
          while (n % factor !== 0) factor++;
          nextRemaining.push(factor);
          nextRemaining.push(n / factor);
        }
      }
      levels.push(currentLevel);
      remaining = nextRemaining;
      level++;
    }
    // Final level
    levels.push(remaining.map(n => ({ value: n, isPrime: true })));
    return levels;
  }, [num]);

  const primeCount = useMemo(() => {
    const map: Record<number, number> = {};
    primeFactors.forEach(f => { map[f] = (map[f] || 0) + 1; });
    return map;
  }, [primeFactors]);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <label className="text-gray-400 text-sm">Number:</label>
          <input type="number" value={num} min={2} max={500}
            onChange={e => setNum(Math.max(2, Math.min(500, parseInt(e.target.value) || 2)))}
            className="w-20 text-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-400"
          />
          <div className="flex gap-1">
            {[12, 24, 36, 60, 100, 180, 360].map(n => (
              <button key={n} onClick={() => setNum(n)}
                className={`px-2 py-1 rounded text-sm ${num === n ? 'bg-purple-500/40 text-purple-300' : 'bg-white/10 text-gray-400'}`}
              >{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Factor tree visualization */}
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-4 border border-green-500/30">
        <h4 className="text-white font-bold text-center mb-4">🌳 Factor Tree for {num}</h4>
        <div className="space-y-3 overflow-x-auto">
          {treeNodes.map((level, li) => (
            <motion.div
              key={li}
              className="flex justify-center gap-2 flex-wrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: li * 0.15 }}
            >
              {level.map((node, ni) => (
                <motion.div
                  key={ni}
                  className={`px-3 py-2 rounded-xl font-bold text-sm border-2 min-w-[40px] text-center ${
                    node.isPrime
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: li * 0.15 + ni * 0.05 }}
                >
                  {node.value}
                  {node.isPrime && node.value > 1 && <span className="ml-1 text-sm">★</span>}
                </motion.div>
              ))}
              {li < treeNodes.length - 1 && (
                <div className="w-full text-center text-gray-500 text-sm">↓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-2">🔢 All Factors ({factors.length})</h4>
          <div className="flex flex-wrap gap-1">
            {factors.map(f => (
              <span key={f} className={`px-2 py-1 rounded text-sm font-bold ${isPrime(f) ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-gray-300'}`}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-2">⭐ Prime Factorization</h4>
          <p className="text-purple-400 font-bold text-lg font-mono">
            {num} = {Object.entries(primeCount).map(([base, exp]) =>
              exp > 1 ? `${base}${toSup(exp)}` : base
            ).join(' × ')}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            = {primeFactors.join(' × ')}
          </p>
        </div>
      </div>
    </div>
  );
}

function toSup(n: number): string {
  const m: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => m[c] || c).join('');
}

function GcdLcmExplorer() {
  const [a, setA] = useState(24);
  const [b, setB] = useState(36);

  const gcdVal = useMemo(() => gcd(a, b), [a, b]);
  const lcmVal = useMemo(() => lcm(a, b), [a, b]);
  const factorsA = useMemo(() => getFactors(a), [a]);
  const factorsB = useMemo(() => getFactors(b), [b]);
  const commonFactors = useMemo(() => factorsA.filter(f => factorsB.includes(f)), [factorsA, factorsB]);

  const multiplesA = useMemo(() => Array.from({ length: 12 }, (_, i) => a * (i + 1)), [a]);
  const multiplesB = useMemo(() => Array.from({ length: 12 }, (_, i) => b * (i + 1)), [b]);
  const commonMultiples = useMemo(() => multiplesA.filter(m => multiplesB.includes(m)), [multiplesA, multiplesB]);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <label className="text-blue-400 text-sm font-bold">Number A</label>
            <input type="number" value={a} min={1} max={200}
              onChange={e => setA(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              className="w-20 text-center bg-white/10 border border-blue-400/30 rounded-lg px-3 py-2 text-white font-bold focus:outline-none"
            />
          </div>
          <span className="text-gray-400 text-2xl mt-4">🔗</span>
          <div className="flex flex-col items-center gap-1">
            <label className="text-orange-400 text-sm font-bold">Number B</label>
            <input type="number" value={b} min={1} max={200}
              onChange={e => setB(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              className="w-20 text-center bg-white/10 border border-orange-400/30 rounded-lg px-3 py-2 text-white font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/20">
          <h4 className="text-green-400 font-bold mb-2">GCD (Greatest Common Divisor)</h4>
          <motion.p key={gcdVal} className="text-4xl font-bold text-white" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            {gcdVal}
          </motion.p>
          <p className="text-gray-400 text-sm mt-2">The largest number that divides both {a} and {b}</p>
          <p className="text-green-300 text-sm mt-2 font-mono">GCD({a}, {b}) = {gcdVal}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-5 border border-blue-500/20">
          <h4 className="text-blue-400 font-bold mb-2">LCM (Least Common Multiple)</h4>
          <motion.p key={lcmVal} className="text-4xl font-bold text-white" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            {lcmVal}
          </motion.p>
          <p className="text-gray-400 text-sm mt-2">The smallest number divisible by both {a} and {b}</p>
          <p className="text-blue-300 text-sm mt-2 font-mono">LCM({a}, {b}) = {lcmVal}</p>
        </div>
      </div>

      {/* Venn diagram style */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-3 text-center">🔍 Common Factors</h4>
        <div className="flex flex-wrap gap-1 justify-center">
          {factorsA.map(f => {
            const isCommon = commonFactors.includes(f);
            return (
              <motion.span key={`a-${f}`}
                className={`px-2 py-1 rounded text-sm font-bold ${isCommon ? 'bg-green-500/30 text-green-300 ring-1 ring-green-400' : 'bg-blue-500/20 text-blue-300'}`}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
              >{f}</motion.span>
            );
          })}
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          <span className="text-blue-300">Blue</span> = factors of {a} | <span className="text-green-300">Green</span> = common
        </p>
      </div>

      {/* Multiples */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-2 text-center">📊 First Common Multiples</h4>
        <div className="flex flex-wrap gap-1 justify-center">
          {multiplesA.slice(0, 8).map(m => {
            const isCommon = commonMultiples.includes(m);
            return (
              <span key={m} className={`px-2 py-1 rounded text-sm font-bold ${isCommon ? 'bg-yellow-500/30 text-yellow-300 ring-1 ring-yellow-400' : 'bg-white/10 text-gray-400'}`}>
                {m}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-center text-sm">
        <p className="text-purple-300">💡 <strong>Tip:</strong> GCD × LCM = a × b → {gcdVal} × {lcmVal} = {gcdVal * lcmVal} = {a} × {b} = {a * b}</p>
      </div>
    </div>
  );
}

function PrimeChecker() {
  const [num, setNum] = useState(17);
  const prime = useMemo(() => isPrime(num), [num]);
  const primeFactors = useMemo(() => getPrimeFactors(num), [num]);

  // Sieve visualization (1-100)
  const sieve = useMemo(() => {
    const arr = Array(101).fill(true);
    arr[0] = arr[1] = false;
    for (let i = 2; i * i <= 100; i++) {
      if (arr[i]) {
        for (let j = i * i; j <= 100; j += i) arr[j] = false;
      }
    }
    return arr;
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-center gap-3">
          <label className="text-gray-400 text-sm">Test number:</label>
          <input type="number" value={num} min={2} max={10000}
            onChange={e => setNum(Math.max(2, Math.min(10000, parseInt(e.target.value) || 2)))}
            className="w-24 text-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xl font-bold focus:outline-none"
          />
        </div>
      </div>

      {/* Result card */}
      <motion.div
        key={num}
        className={`rounded-2xl p-6 text-center border-2 ${prime ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-white/5 border-white/10'}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <motion.span className="text-6xl block mb-3"
          animate={{ rotate: prime ? [0, 360] : [0, 10, -10, 0] }}
          transition={{ duration: prime ? 2 : 0.5 }}
        >
          {prime ? '👑' : '🔨'}
        </motion.span>
        <h3 className={`text-3xl font-bold ${prime ? 'text-yellow-400' : 'text-orange-400'}`}>
          {num} is {prime ? 'PRIME!' : 'NOT prime'}
        </h3>
        {!prime && (
          <div className="mt-3">
            <p className="text-gray-400 text-sm">Factors: {primeFactors.join(' × ')} = {num}</p>
            <p className="text-gray-400 text-sm mt-1">Smallest factor: {primeFactors[0]}</p>
          </div>
        )}
        {prime && (
          <p className="text-gray-400 text-sm mt-2">Only divisible by 1 and {num}</p>
        )}
      </motion.div>

      {/* Sieve of Eratosthenes (1-100) */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-3 text-center">🔬 Sieve of Eratosthenes (1-100)</h4>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
            <motion.div
              key={n}
              className={`aspect-square rounded flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                n === num ? 'ring-2 ring-white' : ''
              } ${
                sieve[n] ? 'bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/50' : 'bg-white/5 text-gray-600 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setNum(n)}
            >
              {n}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 text-sm">
          <span className="text-yellow-300">🟡 Prime</span>
          <span className="text-gray-500">⬜ Composite</span>
        </div>
        <p className="text-gray-500 text-sm text-center mt-1">
          There are {sieve.filter(Boolean).length} primes between 1 and 100 • Click any number to test
        </p>
      </div>
    </div>
  );
}
