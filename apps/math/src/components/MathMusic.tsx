import { useState, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const NOTES = [
  { name: 'C', freq: 261.63, color: '#ef4444' },
  { name: 'D', freq: 293.66, color: '#f97316' },
  { name: 'E', freq: 329.63, color: '#eab308' },
  { name: 'F', freq: 349.23, color: '#22c55e' },
  { name: 'G', freq: 392.00, color: '#3b82f6' },
  { name: 'A', freq: 440.00, color: '#8b5cf6' },
  { name: 'B', freq: 493.88, color: '#ec4899' },
  { name: 'C\'', freq: 523.25, color: '#ef4444' },
];

const INTERVALS = [
  { name: 'Unison', ratio: '1:1', value: 1 },
  { name: 'Octave', ratio: '2:1', value: 2 },
  { name: 'Perfect Fifth', ratio: '3:2', value: 3 / 2 },
  { name: 'Perfect Fourth', ratio: '4:3', value: 4 / 3 },
  { name: 'Major Third', ratio: '5:4', value: 5 / 4 },
  { name: 'Minor Third', ratio: '6:5', value: 6 / 5 },
];

export default function MathMusic() {
  const [mode, setMode] = useState<'piano' | 'waveform' | 'intervals'>('piano');
  const [freq, setFreq] = useState(440);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const audioCtx = useRef<AudioContext | null>(null);

  const playTone = useCallback((frequency: number, duration = 0.5) => {
    try {
      if (!audioCtx.current) audioCtx.current = new AudioContext();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [waveType]);

  const wavePoints = useMemo(() => {
    const pts: string[] = [];
    const periods = 4;
    const w = 500, h = 100;
    for (let x = 0; x <= w; x++) {
      const t = (x / w) * periods * 2 * Math.PI;
      let y: number;
      if (waveType === 'sine') y = Math.sin(t);
      else if (waveType === 'square') y = Math.sign(Math.sin(t));
      else if (waveType === 'sawtooth') y = 2 * ((t / (2 * Math.PI)) % 1) - 1;
      else y = 2 * Math.abs(2 * ((t / (2 * Math.PI)) % 1) - 1) - 1;
      pts.push(`${x},${h / 2 - y * h * 0.4}`);
    }
    return 'M ' + pts.join(' L ');
  }, [waveType]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎵 Math & Music</h2>
        <p className="text-purple-300 text-lg">Discover the mathematics hiding inside every sound!</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'piano' as const, e: '🎹', l: 'Piano' }, { id: 'waveform' as const, e: '〰️', l: 'Waveforms' }, { id: 'intervals' as const, e: '🎼', l: 'Intervals' }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode(m.id)}>{m.e} {m.l}</button>
        ))}
      </div>

      {mode === 'piano' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <h4 className="text-white font-bold mb-4 text-center">🎹 Click to play — each note is a frequency!</h4>
            <div className="flex gap-1 justify-center">
              {NOTES.map(note => (
                <motion.button key={note.name}
                  className="w-12 sm:w-14 h-32 rounded-b-xl bg-white hover:bg-gray-100 border border-gray-300 flex flex-col items-center justify-end pb-2 relative"
                  whileTap={{ scale: 0.95, backgroundColor: note.color }}
                  onClick={() => playTone(note.freq)}>
                  <span className="text-gray-800 font-bold text-sm">{note.name}</span>
                  <span className="text-gray-400 text-[9px]">{note.freq.toFixed(0)} Hz</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm text-gray-300 space-y-1">
            <p>📝 <strong>A4 = 440 Hz</strong> means air vibrates 440 times per second.</p>
            <p>📝 Going up one octave <strong>doubles</strong> the frequency.</p>
            <p>📝 Note ratios create harmony: 3:2 (fifth), 5:4 (major third).</p>
          </div>
        </div>
      )}

      {mode === 'waveform' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-400 text-sm">Frequency</label>
              <input type="range" min="100" max="1000" value={freq} onChange={e => setFreq(Number(e.target.value))} className="flex-1 accent-purple-500" />
              <span className="text-purple-400 font-bold w-20">{freq} Hz</span>
            </div>
            <div className="flex gap-2 mb-4">
              {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map(w => (
                <button key={w} className={`flex-1 py-2 rounded-lg font-bold text-sm capitalize ${waveType === w ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-gray-400'}`} onClick={() => setWaveType(w)}>{w}</button>
              ))}
            </div>
            <svg width="100%" height="100" viewBox="0 0 500 100" className="bg-black/20 rounded-xl">
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.15)" />
              <motion.path d={wavePoints} fill="none" stroke="#8b5cf6" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
            </svg>
            <motion.button className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => playTone(freq, 1)}>
              🔊 Play {freq} Hz {waveType} wave
            </motion.button>
          </div>
          <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-sm text-purple-300">
            💡 <strong>Sine</strong> = pure tone. <strong>Square</strong> = hollow/buzzy. <strong>Sawtooth</strong> = bright/harsh. <strong>Triangle</strong> = soft/mellow.
          </div>
        </div>
      )}

      {mode === 'intervals' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h4 className="text-white font-bold mb-4">🎼 Musical Intervals as Ratios</h4>
            <div className="space-y-3">
              {INTERVALS.map(interval => (
                <motion.div key={interval.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:bg-white/10 cursor-pointer"
                  whileHover={{ scale: 1.02 }} onClick={() => { playTone(440, 0.4); setTimeout(() => playTone(440 * interval.value, 0.6), 400); }}>
                  <span className="text-2xl">🎵</span>
                  <div className="flex-1">
                    <p className="text-white font-bold">{interval.name}</p>
                    <p className="text-gray-400 text-xs">Ratio: {interval.ratio} → {440} Hz + {(440 * interval.value).toFixed(1)} Hz</p>
                  </div>
                  <span className="text-purple-400 font-bold font-mono text-lg">{interval.ratio}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm text-gray-300">
            <p>📝 Click any interval to hear both notes played. Simple ratios like 2:1 and 3:2 sound pleasing (consonant) to our ears.</p>
          </div>
        </div>
      )}
    </div>
  );
}
