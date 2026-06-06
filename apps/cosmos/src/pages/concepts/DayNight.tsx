import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sunrise } from 'lucide-react'
import DayNightCanvas from '../../components/canvases/DayNightCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function DayNight() {
  const concept = getConceptById('day-night')!
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">🟡 Science</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-200">🌍 Day and Night</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-slate-700 border border-slate-500 text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-slate-800 to-indigo-900 border-b border-slate-600">
        <DayNightCanvas rotation={rotation} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-3"><Sunrise size={20} className="text-amber-500" /><label className="font-semibold text-slate-700">Earth Rotation</label><span className="ml-auto text-sm font-mono text-slate-500">{Math.round(rotation)}°</span></div>
        <input type="range" min="0" max="360" value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full h-2 bg-gradient-to-r from-amber-200 via-sky-200 to-indigo-200 rounded-full appearance-none cursor-pointer accent-amber-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🌅 Sunrise</span><span>☀️ Noon</span><span>🌇 Sunset</span><span>🌙 Midnight</span></div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
        <h3 className="font-bold text-amber-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🔄', title: 'Rotation', desc: 'Earth spins once every 24 hours' }, { icon: '🌍', title: 'Tilt', desc: '23.5° tilt gives us seasons too' }, { icon: '⏰', title: 'Time Zones', desc: 'Different parts face Sun at different times' }, { icon: '🌅', title: 'Sunrise/Sunset', desc: 'When your location crosses the day-night line' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
