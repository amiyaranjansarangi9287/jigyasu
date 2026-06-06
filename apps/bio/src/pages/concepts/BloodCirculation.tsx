import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import BloodCirculationCanvas from '../../components/canvases/BloodCirculationCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function BloodCirculation() {
  const concept = getConceptById('blood-circulation')!
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-200">❤️ Biology</span>
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">❤️ Blood Circulation</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-red-200 text-sm font-medium text-slate-700 hover:bg-red-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
        <BloodCirculationCanvas heartRate={1 + stage * 0.5} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {['❤️ Heart', '🫁 Lungs', '🔴 Body', '🔵 Return'].map((s, i) => (
          <button key={i} onClick={() => setStage(i)} className={`px-4 py-3 rounded-xl font-semibold transition-all ${stage === i ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 p-6">
        <h3 className="font-bold text-red-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '❤️', title: 'Heart', desc: 'Pumps blood 100,000 times per day' }, { icon: '🫁', title: 'Lungs', desc: 'Blood picks up oxygen, drops off CO₂' }, { icon: '🔴', title: 'Arteries', desc: 'Carry oxygen-rich blood away from heart' }, { icon: '🔵', title: 'Veins', desc: 'Return oxygen-poor blood back to heart' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
