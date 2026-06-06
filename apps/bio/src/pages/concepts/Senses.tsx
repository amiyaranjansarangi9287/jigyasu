import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye } from 'lucide-react'
import SensesCanvas from '../../components/canvases/SensesCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function Senses() {
  const concept = getConceptById('senses')!
  const [selectedSense, setSelectedSense] = useState(0)
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
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">👁️ Five Senses</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-slate-700 hover:bg-green-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <SensesCanvas selectedSense={selectedSense} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {['👁️ Sight', '👂 Hearing', '✋ Touch', '👃 Smell', '👅 Taste'].map((s, i) => (
          <button key={i} onClick={() => setSelectedSense(i)} className={`px-4 py-3 rounded-xl font-semibold transition-all ${selectedSense === i ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <h3 className="font-bold text-green-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '👁️', title: 'Sight', desc: 'Eyes catch light → brain makes pictures' }, { icon: '👂', title: 'Hearing', desc: 'Ears catch vibrations → brain makes sounds' }, { icon: '✋', title: 'Touch', desc: 'Skin feels pressure, heat, texture' }, { icon: '👃', title: 'Smell', desc: 'Nose detects particles in the air' }, { icon: '👅', title: 'Taste', desc: 'Tongue tastes sweet, sour, salty, bitter' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
