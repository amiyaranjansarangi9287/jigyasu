import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Wheat } from 'lucide-react'
import FoodChainCanvas from '../../components/canvases/FoodChainCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function FoodChain() {
  const concept = getConceptById('food-chain')!
  const [level, setLevel] = useState(0)
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🌾 Food Chain</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-slate-700 hover:bg-green-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <FoodChainCanvas stage={level} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {['☀️ Sun', '🌱 Producer', '🐇 Consumer', '🦊 Predator', '🍄 Decomposer'].map((l, i) => (
          <button key={i} onClick={() => setLevel(i)} className={`px-3 py-2 rounded-xl font-semibold transition-all text-sm ${level === i ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'}`}>{l}</button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <h3 className="font-bold text-green-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '☀️', title: 'Sun', desc: 'Ultimate energy source for all life' }, { icon: '🌱', title: 'Producers', desc: 'Plants make food from sunlight' }, { icon: '🐇', title: 'Consumers', desc: 'Animals eat plants or other animals' }, { icon: '🍄', title: 'Decomposers', desc: 'Break down dead matter — recycle nutrients' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
