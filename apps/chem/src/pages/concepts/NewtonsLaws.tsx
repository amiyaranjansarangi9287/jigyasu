import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Apple } from 'lucide-react'
const NewtonsLawsCanvas = lazy(() => import('../../components/canvases/NewtonsLawsCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function NewtonsLaws() {
  const concept = getConceptById('newtons-laws')!
  const [law, setLaw] = useState(0)
  const [force, setForce] = useState(0.5)
  const [mass, setMass] = useState(1)
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
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🍎 Newton's Laws</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-amber-200 text-sm font-medium text-slate-700 hover:bg-amber-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <NewtonsLawsCanvas law={law} force={force} mass={mass} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {['1️⃣ Inertia', '2️⃣ F=ma', '3️⃣ Action=Reaction'].map((l, i) => (
          <button key={i} onClick={() => setLaw(i)} className={`px-4 py-3 rounded-xl font-semibold transition-all ${law === i ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'}`}>{l}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Force: {force.toFixed(1)} N</label>
          <input type="range" min="0.1" max="2" step="0.1" value={force} onChange={e => setForce(Number(e.target.value))} className="w-full h-2 bg-red-200 rounded-full appearance-none cursor-pointer accent-red-500" />
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mass: {mass.toFixed(1)} kg</label>
          <input type="range" min="0.5" max="5" step="0.5" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
        <h3 className="font-bold text-amber-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '1️⃣', title: 'Inertia', desc: 'Object stays still or keeps moving unless forced' }, { icon: '2️⃣', title: 'F = ma', desc: 'More mass needs more force to move' }, { icon: '3️⃣', title: 'Action = Reaction', desc: 'Push something, it pushes back equally' }, { icon: '🍎', title: 'Newton', desc: 'Discovered these laws in the 1600s' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
