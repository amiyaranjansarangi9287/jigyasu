import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Waves } from 'lucide-react'
const SoundWavesCanvas = lazy(() => import('../../components/canvases/SoundWavesCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function SoundWaves() {
  const concept = getConceptById('sound-waves')!
  const [frequency, setFrequency] = useState(0.5)
  const [amplitude, setAmplitude] = useState(0.5)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">🔵 Physics</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🔊 Sound Wave</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-blue-200 text-sm font-medium text-slate-700 hover:bg-blue-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <SoundWavesCanvas frequency={frequency} amplitude={amplitude} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pitch (Frequency): {Math.round(frequency * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.05" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🥁 Low</span><span>🎵 High</span></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Volume (Amplitude): {Math.round(amplitude * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.05" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} className="w-full h-2 bg-indigo-200 rounded-full appearance-none cursor-pointer accent-indigo-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🤫 Soft</span><span>📢 Loud</span></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-bold text-blue-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🌊', title: 'Sound is a Wave', desc: 'Vibrations traveling through air' }, { icon: '🎵', title: 'Pitch', desc: 'High frequency = high pitch' }, { icon: '📢', title: 'Volume', desc: 'Big amplitude = loud sound' }, { icon: '👂', title: 'Hearing', desc: 'Ears catch vibrations and send to brain' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
