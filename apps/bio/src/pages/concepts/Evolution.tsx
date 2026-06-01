import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Dna } from 'lucide-react'
const EvolutionCanvas = lazy(() => import('../../components/canvases/EvolutionCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function Evolution() {
  const concept = getConceptById('evolution')!
  const [generation, setGeneration] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-200">🟢 Biology</span>
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🦎 Natural Selection</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-slate-700 hover:bg-green-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <EvolutionCanvas generation={generation} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-3"><Dna size={20} className="text-green-500" /><label className="font-semibold text-slate-700">Generations</label><span className="ml-auto text-sm font-mono text-slate-500">{generation}</span></div>
        <input type="range" min="1" max="50" value={generation} onChange={e => setGeneration(Number(e.target.value))} className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Start</span><span>10</span><span>25</span><span>50</span></div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <h3 className="font-bold text-green-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🧬', title: 'Variation', desc: 'Individuals in a population differ from each other' }, { icon: '✅', title: 'Selection', desc: 'Advantageous traits help survival' }, { icon: '👶', title: 'Inheritance', desc: 'Traits pass to offspring' }, { icon: '⏳', title: 'Time', desc: 'Millions of years create new species' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
