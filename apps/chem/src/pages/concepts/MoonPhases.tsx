import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Moon } from 'lucide-react'
const MoonPhasesCanvas = lazy(() => import('../../components/canvases/MoonPhasesCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function MoonPhases() {
  const concept = getConceptById('moon-phases')!
  const [orbitPos, setOrbitPos] = useState(0)
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
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">📚 Class 6-10</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-200">🌙 Moon Phases</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-slate-700 border border-slate-500 text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-slate-800 to-indigo-900 border-b border-slate-600">
        <MoonPhasesCanvas orbitPos={orbitPos} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Moon Position: {orbitPos}°</label>
        <input type="range" min="0" max="360" value={orbitPos} onChange={e => setOrbitPos(Number(e.target.value))} className="w-full h-2 bg-indigo-200 rounded-full appearance-none cursor-pointer accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🌑 New Moon</span><span>🌓 First Quarter</span><span>🌕 Full Moon</span><span>🌗 Last Quarter</span></div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
        <h3 className="font-bold text-indigo-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🌑', title: 'New Moon', desc: 'Moon between Earth and Sun — dark side faces us' }, { icon: '🌓', title: 'First Quarter', desc: 'Half lit — Moon has moved 90°' }, { icon: '🌕', title: 'Full Moon', desc: 'Earth between Moon and Sun — fully lit' }, { icon: '🔄', title: '29.5 Day Cycle', desc: 'Complete cycle from new moon to new moon' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
