import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical } from 'lucide-react'
import PeriodicTableCanvas from '../../components/canvases/PeriodicTableCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function PeriodicTable() {
  const concept = getConceptById('periodic-table')!
  const [selectedElement, setSelectedElement] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  const commonElements = [
    { n: 1, sym: 'H', label: 'H' },
    { n: 6, sym: 'C', label: 'C' },
    { n: 8, sym: 'O', label: 'O' },
    { n: 26, sym: 'Fe', label: 'Fe' },
    { n: 29, sym: 'Cu', label: 'Cu' },
    { n: 79, sym: 'Au', label: 'Au' },
  ]

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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🔬 Periodic Table</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-sm font-medium text-slate-700 hover:bg-purple-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
        <PeriodicTableCanvas selectedElement={selectedElement} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {commonElements.map((el, i) => (
          <button key={i} onClick={() => setSelectedElement(el.n)} className={`px-4 py-3 rounded-xl font-semibold transition-all ${selectedElement === el.n ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'}`}>{el.sym}</button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
        <h3 className="font-bold text-purple-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '📊', title: '118 Elements', desc: 'All known elements organized by properties' }, { icon: '↔️', title: 'Columns = Groups', desc: 'Same column = similar chemical behavior' }, { icon: '↕️', title: 'Rows = Periods', desc: 'Same row = same number of electron shells' }, { icon: '🔬', title: 'Metals Left', desc: 'Non-metals right, metalloids in between' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
