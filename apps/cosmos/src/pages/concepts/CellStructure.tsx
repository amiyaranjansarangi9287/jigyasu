import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Microscope } from 'lucide-react'
const CellStructureCanvas = lazy(() => import('../../components/canvases/CellStructureCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function CellStructure() {
  const concept = getConceptById('cell-structure')!
  const [selectedPart, setSelectedPart] = useState('')
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🔬 Animal Cell</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-slate-700 hover:bg-green-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CellStructureCanvas selectedPart={selectedPart} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {[{ id: 'nucleus', emoji: '🟣', label: 'Nucleus' }, { id: 'mitochondria', emoji: '🔴', label: 'Mitochondria' }, { id: 'er', emoji: '🔵', label: 'ER' }, { id: 'vacuole', emoji: '🩵', label: 'Vacuole' }, { id: 'membrane', emoji: '🟢', label: 'Membrane' }].map((p, i) => (
          <button key={i} onClick={() => setSelectedPart(p.id)} className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${selectedPart === p.id ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'}`}><span>{p.emoji}</span><span>{p.label}</span></button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <h3 className="font-bold text-green-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🟣', title: 'Nucleus', desc: 'Control center — contains DNA instructions' }, { icon: '🔴', title: 'Mitochondria', desc: 'Powerhouse — converts food to energy' }, { icon: '🔵', title: 'ER', desc: 'Factory — builds and transports proteins' }, { icon: '🟢', title: 'Membrane', desc: 'Security guard — controls what enters/leaves' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
