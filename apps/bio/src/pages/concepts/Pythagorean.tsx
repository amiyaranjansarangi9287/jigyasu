import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Triangle } from 'lucide-react'
const PythagoreanCanvas = lazy(() => import('../../components/canvases/PythagoreanCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function Pythagorean() {
  const concept = getConceptById('pythagorean')!
  const [sideA, setSideA] = useState(3)
  const [sideB, setSideB] = useState(4)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  const sideC = Math.sqrt(sideA * sideA + sideB * sideB)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">🟢 Math</span>
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">📐 a² + b² = c²</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-sm font-medium text-slate-700 hover:bg-emerald-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <PythagoreanCanvas sideA={sideA} sideB={sideB} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Side a: {sideA}</label>
          <input type="range" min="1" max="10" value={sideA} onChange={e => setSideA(Number(e.target.value))} className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Side b: {sideB}</label>
          <input type="range" min="1" max="10" value={sideB} onChange={e => setSideB(Number(e.target.value))} className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-500" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-bold text-emerald-800 mb-4 text-center text-2xl">{sideA}² + {sideB}² = {sideC.toFixed(2)}²</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '📐', title: 'Right Triangle', desc: 'Only works for triangles with a 90° angle' }, { icon: '🔢', title: 'a² + b² = c²', desc: 'Sum of squares of legs = square of hypotenuse' }, { icon: '📏', title: 'Hypotenuse', desc: 'Longest side — opposite the right angle' }, { icon: '🏗️', title: 'Real World', desc: 'Used in construction, navigation, GPS' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
