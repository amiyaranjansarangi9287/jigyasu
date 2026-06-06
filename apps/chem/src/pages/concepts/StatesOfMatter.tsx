import { lazy, Suspense,  useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Thermometer } from 'lucide-react'
import StatesOfMatterCanvas from '../../components/canvases/StatesOfMatterCanvas';
import AudioNarration from '../../components/AudioNarration';
import CanvasWithNarrator from '../../components/CanvasWithNarrator';
import { getConceptById } from '../../data/concepts'

export default function StatesOfMatter() {
  const concept = getConceptById('states-of-matter')!
  const [temperature, setTemperature] = useState(20)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentNarration, setCurrentNarration] = useState('')
  const [isNarrating, setIsNarrating] = useState(false)

  if (!concept) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to all concepts
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">🔵 Physics</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">📚 Class 2-6</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{concept.emoji} {concept.title}</h1>
        <p className="text-slate-500 text-base sm:text-lg">{concept.longDesc}</p>
      </div>

      <div className="mb-6">
        <AudioNarration
          steps={concept.narration}
          title="Teacher Explains"
          hasMusic={concept.hasMusic}
          musicMood={concept.musicMood}
          autoPlay
          onCurrentTextChange={(text) => {
            setCurrentNarration(text)
            setIsNarrating(!!text)
          }}
          isPlaying={isPlaying}
        />
      </div>

      <CanvasWithNarrator
        headerContent={
          <>
            <span className="font-bold text-slate-700">🔬 Particle View</span>
            <button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 rounded-full bg-white border border-sky-200 text-sm font-medium text-slate-700 hover:bg-sky-50 transition-colors">{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
          </>
        }
        currentNarration={currentNarration}
        isNarrating={isNarrating}
        headerClassName="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100"
      >
        <StatesOfMatterCanvas temperature={temperature} isPlaying={isPlaying} />
      </CanvasWithNarrator>

      <div className="space-y-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Thermometer size={20} className={temperature < 33 ? 'text-blue-500' : temperature < 66 ? 'text-sky-500' : 'text-red-500'} />
            <label className="font-semibold text-slate-700">Temperature</label>
            <span className="ml-auto text-sm font-mono text-slate-500">{Math.round(temperature)}°C</span>
          </div>
          <input type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full h-2 bg-gradient-to-r from-blue-200 via-sky-200 to-red-200 rounded-full appearance-none cursor-pointer" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>🧊 0°C (Ice)</span>
            <span>💧 50°C (Water)</span>
            <span>💨 100°C (Steam)</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-bold text-blue-800 mb-4">🧠 Key Facts</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🧊', title: 'Solid', desc: 'Particles packed tight, vibrating in place. Fixed shape and volume.', color: 'blue' },
            { icon: '💧', title: 'Liquid', desc: 'Particles slide past each other. Fixed volume, takes container shape.', color: 'sky' },
            { icon: '💨', title: 'Gas', desc: 'Particles fly freely. No fixed shape or volume — fills any space.', color: 'amber' },
          ].map((state, i) => (
            <div key={i} className="bg-white/70 rounded-xl p-4 text-center">
              <span className="text-3xl">{state.icon}</span>
              <p className="font-bold text-slate-700 mt-2">{state.title}</p>
              <p className="text-xs text-slate-500 mt-1">{state.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

