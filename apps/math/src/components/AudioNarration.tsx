import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, Square, Volume2, Music, VolumeX } from 'lucide-react'
import { voiceEngine, backgroundMusic, type NarrationStep } from '@jigyasu/audio'

interface AudioNarrationProps {
  steps: NarrationStep[]
  title: string
  hasMusic?: boolean
  musicMood?: 'wonder' | 'calm' | 'nature' | 'space'
  autoPlay?: boolean
  onCurrentTextChange?: (text: string) => void
  isPlaying?: boolean
}

export default function AudioNarration({ steps, title, hasMusic = false, musicMood = 'calm', autoPlay = false, onCurrentTextChange, isPlaying: canvasPlaying = true }: AudioNarrationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [waveform, setWaveform] = useState<number[]>(new Array(24).fill(0))
  const [musicOn, setMusicOn] = useState(false)
  const [voiceReady, setVoiceReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAutoPlayedRef = useRef(false)
  const stepsRef = useRef(steps)
  const onCurrentTextChangeRef = useRef(onCurrentTextChange)
  const canvasPlayingRef = useRef(canvasPlaying)
  const musicOnRef = useRef(musicOn)
  const hasMusicRef = useRef(hasMusic)

  // Keep refs in sync
  useEffect(() => { stepsRef.current = steps }, [steps])
  useEffect(() => { onCurrentTextChangeRef.current = onCurrentTextChange }, [onCurrentTextChange])
  useEffect(() => { canvasPlayingRef.current = canvasPlaying }, [canvasPlaying])
  useEffect(() => { musicOnRef.current = musicOn }, [musicOn])
  useEffect(() => { hasMusicRef.current = hasMusic }, [hasMusic])

  useEffect(() => {
    const checkVoices = () => {
      if (speechSynthesis.getVoices().length > 0) {
        setVoiceReady(true)
      }
    }
    checkVoices()
    speechSynthesis.onvoiceschanged = checkVoices
    return () => { speechSynthesis.onvoiceschanged = null }
  }, [])

  // Set up voice engine callbacks ONCE
  useEffect(() => {
    voiceEngine.setOnStateChange((state) => {
      setIsPlaying(state.isPlaying)
      setIsPaused(state.isPaused)
      setWaveform(state.waveform)
    })

    voiceEngine.setOnSentenceChange((index) => {
      setCurrentIndex(index)
      if (index >= 0 && index < stepsRef.current.length) {
        onCurrentTextChangeRef.current?.(stepsRef.current[index].text)
      }
      const el = document.getElementById(`sentence-${index}`)
      if (el && containerRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })

    voiceEngine.setOnComplete(() => {
      setCurrentIndex(-1)
      onCurrentTextChangeRef.current?.('')
      if (musicOnRef.current && hasMusicRef.current) {
        backgroundMusic.resume()
      }
    })

    // Cleanup ONLY on unmount
    return () => {
      voiceEngine.stop()
      onCurrentTextChangeRef.current?.('')
      if (musicOnRef.current && hasMusicRef.current) {
        backgroundMusic.stop()
      }
    }
  }, []) // Empty deps - runs once on mount, cleanup on unmount

  // Sync narration with canvas play/pause
  useEffect(() => {
    if (!canvasPlayingRef.current && isPlaying) {
      voiceEngine.pause()
    } else if (canvasPlayingRef.current && isPaused) {
      voiceEngine.resume()
    }
  }, [isPlaying, isPaused])

  // Auto-play narration
  useEffect(() => {
    if (autoPlay && voiceReady && !hasAutoPlayedRef.current && steps.length > 0) {
      hasAutoPlayedRef.current = true
      voiceEngine.stop()
      onCurrentTextChangeRef.current?.('')
      const timer = setTimeout(() => {
        if (musicOnRef.current && hasMusicRef.current && backgroundMusic.getIsPlaying()) {
          backgroundMusic.pause()
        }
        voiceEngine.speak(steps)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, voiceReady, steps])

  const handlePlay = () => {
    if (isPaused) {
      voiceEngine.resume()
      if (musicOnRef.current && hasMusicRef.current) backgroundMusic.resume()
    } else {
      if (musicOnRef.current && hasMusicRef.current && backgroundMusic.getIsPlaying()) {
        backgroundMusic.pause()
      }
      voiceEngine.speak(steps)
    }
  }

  const handlePause = () => {
    voiceEngine.pause()
    if (musicOnRef.current && hasMusicRef.current) backgroundMusic.pause()
  }

  const handleStop = () => {
    voiceEngine.stop()
    setCurrentIndex(-1)
    if (musicOnRef.current && hasMusicRef.current) backgroundMusic.resume()
  }

  const toggleMusic = () => {
    if (musicOn) {
      backgroundMusic.stop()
      setMusicOn(false)
    } else {
      if (hasMusic) {
        backgroundMusic.start(musicMood)
        setMusicOn(true)
        if (isPlaying) backgroundMusic.pause()
      }
    }
  }

  const progress = steps.length > 0 && currentIndex >= 0
    ? ((currentIndex + 1) / steps.length) * 100
    : 0

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
              <Volume2 size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
              <p className="text-xs text-slate-500">
                {voiceReady ? 'Voice ready' : 'Loading voice...'}
                {hasMusic && ' • Ambient music available'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMusic && (
              <button
                onClick={toggleMusic}
                className={`p-2 rounded-lg transition-colors ${
                  musicOn
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
                title={musicOn ? 'Turn off music' : 'Turn on ambient music'}
              >
                {musicOn ? <Music size={16} /> : <VolumeX size={16} />}
              </button>
            )}

            {!isPlaying || isPaused ? (
              <button
                onClick={handlePlay}
                disabled={!voiceReady}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium text-sm hover:from-sky-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Play size={14} fill="white" />
                {isPaused ? 'Resume' : 'Play'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-all shadow-sm"
              >
                <Pause size={14} fill="white" />
                Pause
              </button>
            )}

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="Stop"
              >
                <Square size={14} fill="currentColor" />
              </button>
            )}
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">
                {currentIndex >= 0 ? `Step ${currentIndex + 1} of ${steps.length}` : `${steps.length} steps`}
              </span>
              <span className="text-[10px] text-slate-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center justify-center gap-[2px] h-8">
          {waveform.map((value, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-75"
              style={{
                height: `${Math.max(4, value * 28)}px`,
                background: isPlaying
                  ? `linear-gradient(to top, rgb(14 165 233), rgb(99 102 241))`
                  : 'rgb(203 213 225)',
                opacity: isPlaying ? 0.8 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <div ref={containerRef} className="p-5 space-y-3 max-h-64 overflow-y-auto">
        {steps.map((step, i) => (
          <div
            key={i}
            id={`sentence-${i}`}
            className={`p-3 rounded-xl transition-all duration-300 ${
              i === currentIndex
                ? 'bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 shadow-sm'
                : i < currentIndex
                ? 'bg-slate-50 border border-slate-100 opacity-60'
                : 'border border-transparent'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                i === currentIndex
                  ? 'bg-gradient-to-br from-sky-400 to-indigo-500 text-white'
                  : i < currentIndex
                  ? 'bg-green-100 text-green-600'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {i < currentIndex ? '✓' : i + 1}
              </div>
              <p className={`text-sm leading-relaxed ${
                i === currentIndex
                  ? 'text-slate-800 font-medium'
                  : 'text-slate-600'
              }`}>
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
