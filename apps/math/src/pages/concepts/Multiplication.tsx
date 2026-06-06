import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Grid3X3 } from 'lucide-react'
import MultiplicationCanvas from '../../components/canvases/MultiplicationCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function Multiplication() {
  const concept = getConceptById('multiplication')!
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">✖️ Array Visualizer</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-sm font-medium text-slate-700 hover:bg-emerald-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <MultiplicationCanvas rows={rows} cols={cols} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Rows: {rows}</label>
          <input type="range" min="1" max="10" value={rows} onChange={e => setRows(Number(e.target.value))} className="w-full h-2 bg-emerald-200 rounded-full appearance-none cursor-pointer accent-emerald-500" />
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Columns: {cols}</label>
          <input type="range" min="1" max="10" value={cols} onChange={e => setCols(Number(e.target.value))} className="w-full h-2 bg-teal-200 rounded-full appearance-none cursor-pointer accent-teal-500" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-bold text-emerald-800 mb-4 text-center text-2xl">{rows} × {cols} = {rows * cols}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '📊', title: 'Rows', desc: 'Number of horizontal groups' }, { icon: '📏', title: 'Columns', desc: 'Number of items in each row' }, { icon: '🔄', title: 'Commutative', desc: '3×4 = 4×3 — order doesn\'t matter' }, { icon: '🧮', title: 'Total', desc: 'Multiply rows × columns for the answer' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
