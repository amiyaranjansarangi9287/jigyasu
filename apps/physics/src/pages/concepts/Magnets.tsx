import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Magnet } from 'lucide-react'
const MagnetsCanvas = lazy(() => import('../../components/canvases/MagnetsCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function Magnets() {
  const concept = getConceptById('magnets')!
  const [poleConfig, setPoleConfig] = useState<'attract' | 'repel'>('attract')
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🧲 Magnetic Field</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-blue-200 text-sm font-medium text-slate-700 hover:bg-blue-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <MagnetsCanvas poleConfig={poleConfig} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button onClick={() => setPoleConfig('attract')} className={`px-4 py-3 rounded-xl font-semibold transition-all ${poleConfig === 'attract' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}>🧲 N-S (Attract)</button>
        <button onClick={() => setPoleConfig('repel')} className={`px-4 py-3 rounded-xl font-semibold transition-all ${poleConfig === 'repel' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'}`}>🧲 N-N (Repel)</button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-bold text-blue-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🧲', title: 'Two Poles', desc: 'Every magnet has North and South' }, { icon: '🤝', title: 'Opposites Attract', desc: 'N + S = pull together' }, { icon: '🚫', title: 'Likes Repel', desc: 'N + N or S + S = push apart' }, { icon: '🌐', title: 'Earth is a Magnet', desc: "Our planet's core creates a magnetic field" }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
