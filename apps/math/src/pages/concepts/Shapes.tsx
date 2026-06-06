import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Circle } from 'lucide-react'
import ShapesCanvas from '../../components/canvases/ShapesCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function Shapes() {
  const concept = getConceptById('shapes')!
  const [sides, setSides] = useState(3)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">🟢 Math</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">📐 Shapes & Geometry</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-sm font-medium text-slate-700 hover:bg-emerald-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <ShapesCanvas sides={sides} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Sides: {sides}</label>
        <input type="range" min="0" max="12" value={sides} onChange={e => setSides(Number(e.target.value))} className="w-full h-2 bg-emerald-200 rounded-full appearance-none cursor-pointer accent-emerald-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>○ Circle (0)</span><span>△ Triangle (3)</span><span>⬡ Dodecagon (12)</span></div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-bold text-emerald-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '△', title: 'Triangle', desc: '3 sides, 3 corners — always adds to 180°' }, { icon: '□', title: 'Square', desc: '4 equal sides, 4 right angles' }, { icon: '⬡', title: 'Hexagon', desc: '6 sides — honeycomb pattern!' }, { icon: '○', title: 'Circle', desc: 'No corners — every point same distance from center' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
