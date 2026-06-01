import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Weight } from 'lucide-react'
const GravityCanvas = lazy(() => import('../../components/canvases/GravityCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function GravitySpacetime() {
  const concept = getConceptById('gravity-spacetime')!
  const [mass, setMass] = useState(0.5)
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-200">🌌 Spacetime Fabric</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-slate-700 border border-slate-500 text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-slate-800 to-indigo-900 border-b border-slate-600">
        <GravityCanvas mass={mass} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="space-y-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><Weight size={20} className="text-indigo-500" /><label className="font-semibold text-slate-700">Mass of Central Object</label><span className="ml-auto text-sm font-mono text-slate-500">{Math.round(mass * 100)}%</span></div>
          <input type="range" min="10" max="100" value={mass * 100} onChange={e => setMass(Number(e.target.value) / 100)} className="w-full h-2 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-full appearance-none cursor-pointer accent-indigo-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Light (Earth)</span><span>Heavy (Black Hole)</span></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
        <h3 className="font-bold text-indigo-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🕳️', title: "Einstein's Insight", desc: 'Gravity is not a force — it\'s the curvature of spacetime itself' }, { icon: '🌍', title: "Earth's Effect", desc: 'Earth bends spacetime enough to keep the Moon in orbit' }, { icon: '⚫', title: 'Black Holes', desc: 'So massive they create a spacetime pit nothing can escape' }, { icon: '⏱️', title: 'Time Dilation', desc: 'Time runs slower near massive objects — proven by GPS satellites' }].map((fact, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{fact.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{fact.title}</p><p className="text-xs text-slate-500">{fact.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
