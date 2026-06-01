import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Atom } from 'lucide-react'
const AtomsCanvas = lazy(() => import('../../components/canvases/AtomsCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function Atoms() {
  const concept = getConceptById('atoms')!
  const [protons, setProtons] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-purple-200">🟣 Chemistry</span>
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">⚛️ Atomic Model</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-sm font-medium text-slate-700 hover:bg-purple-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
        <AtomsCanvas protons={protons} electrons={protons} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Protons: {protons}</label>
        <input type="range" min="1" max="18" value={protons} onChange={e => setProtons(Number(e.target.value))} className="w-full h-2 bg-purple-200 rounded-full appearance-none cursor-pointer accent-purple-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>H (1)</span><span>C (6)</span><span>O (8)</span><span>Ar (18)</span></div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
        <h3 className="font-bold text-purple-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '⚛️', title: 'Nucleus', desc: 'Protons + neutrons packed at the center' }, { icon: '🔄', title: 'Electrons', desc: 'Orbit the nucleus in specific energy levels' }, { icon: '🔢', title: 'Atomic Number', desc: 'Number of protons = element identity' }, { icon: '💡', title: 'Mostly Empty', desc: 'Atoms are 99.9% empty space!' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
