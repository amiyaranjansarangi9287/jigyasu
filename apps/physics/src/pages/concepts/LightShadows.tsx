import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lightbulb } from 'lucide-react'
const LightShadowsCanvas = lazy(() => import('../../components/canvases/LightShadowsCanvas'));
const AudioNarration = lazy(() => import('../../components/AudioNarration'));
const CanvasWithNarrator = lazy(() => import('../../components/CanvasWithNarrator'));
import { getConceptById } from '../../data/concepts'

export default function LightShadows() {
  const concept = getConceptById('light-shadows')!
  const [lightPos, setLightPos] = useState(0.3)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors"><ArrowLeft size={16} /> Back to all concepts</Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">🔵 Physics</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>
      <div className="mb-6"><AudioNarration steps={concept.narration} title="Teacher Explains" hasMusic={concept.hasMusic} musicMood={concept.musicMood} autoPlay onCurrentTextChange={(text) => { setCurrentNarration(text); setIsNarrating(!!text) }} isPlaying={isPlaying} /></div>

      <CanvasWithNarrator headerContent={<><span className="font-bold text-slate-700">🔦 Light & Shadow</span><button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-amber-200 text-sm font-medium text-slate-700 hover:bg-amber-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button></>} currentNarration={currentNarration} isNarrating={isNarrating} headerClassName="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
        <LightShadowsCanvas lightX={lightPos * 1000} objectX={500} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Light Position</label>
        <input type="range" min="0.05" max="0.95" step="0.01" value={lightPos} onChange={e => setLightPos(Number(e.target.value))} className="w-full h-2 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full appearance-none cursor-pointer accent-amber-500" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>🌅 Low (long shadow)</span><span>☀️ High (short shadow)</span></div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-6">
        <h3 className="font-bold text-amber-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ icon: '🔦', title: 'Light Travels Straight', desc: 'Light moves in straight lines' }, { icon: '🌑', title: 'Shadows Form', desc: 'When an object blocks light' }, { icon: '📏', title: 'Angle Matters', desc: 'Low light = long shadows' }, { icon: '🌅', title: 'Daily Cycle', desc: 'Shadows longest at sunrise/sunset' }].map((f, i) => (<div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-3"><span className="text-xl">{f.icon}</span><div><p className="font-semibold text-slate-700 text-sm">{f.title}</p><p className="text-xs text-slate-500">{f.desc}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
