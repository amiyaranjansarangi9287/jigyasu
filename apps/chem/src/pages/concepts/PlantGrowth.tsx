import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sprout } from 'lucide-react'
const PlantGrowthCanvas = lazy(() => import('../../components/canvases/PlantGrowthCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function PlantGrowth() {
  const concept = getConceptById('plant-growth')!
  const [growth, setGrowth] = useState(0)
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

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🌱 Plant Growth</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-slate-700 hover:bg-green-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <PlantGrowthCanvas growth={growth} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Growth Stage: {growth}</label>
        <input type="range" min="0" max="5" value={growth} onChange={e => setGrowth(Number(e.target.value))} className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🌰 Seed</span><span>🌱 Sprout</span><span>🌿 Plant</span><span>🌸 Flower</span></div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <h3 className="font-bold text-green-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🌰', title: 'Seed', desc: 'Contains everything to start a new plant' }, { icon: '💧', title: 'Water', desc: 'Wakes up the seed and helps roots grow' }, { icon: '☀️', title: 'Sunlight', desc: 'Energy for the plant to make food' }, { icon: '🌸', title: 'Flowers', desc: 'Make seeds for the next generation' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
