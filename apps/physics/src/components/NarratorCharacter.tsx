import { useState, useEffect } from 'react'

interface NarratorCharacterProps {
  currentText: string
  isSpeaking: boolean
  className?: string
}

export default function NarratorCharacter({ currentText, isSpeaking, className = '' }: NarratorCharacterProps) {
  const [isWaving, setIsWaving] = useState(false)
  const [bounce, setBounce] = useState(0)

  useEffect(() => {
    if (isSpeaking) {
      setIsWaving(true)
      const waveTimer = setTimeout(() => setIsWaving(false), 2000)
      return () => clearTimeout(waveTimer)
    }
  }, [isSpeaking])

  useEffect(() => {
    if (!isSpeaking) return
    const interval = setInterval(() => {
      setBounce(prev => (prev + 1) % 4)
    }, 300)
    return () => clearInterval(interval)
  }, [isSpeaking])

  if (!currentText || !isSpeaking) return null

  const bounceY = bounce % 2 === 0 ? -2 : 0

  return (
    <div className={`absolute bottom-3 left-3 z-10 flex items-end gap-2 ${className}`} style={{ transform: `translateY(${bounceY}px)`, transition: 'transform 0.15s ease' }}>
      {/* Speech Bubble */}
      <div className="max-w-[280px] sm:max-w-[350px] bg-white/95 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-sky-100">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{currentText}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="text-[10px] text-slate-400 ml-1">Professor Hoot explains...</span>
        </div>
      </div>

      {/* Owl Character */}
      <div className="relative flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          {/* Body */}
          <ellipse cx="32" cy="38" rx="20" ry="22" fill="#92400e" />
          <ellipse cx="32" cy="38" rx="16" ry="18" fill="#b45309" />
          
          {/* Belly */}
          <ellipse cx="32" cy="42" rx="12" ry="14" fill="#fef3c7" />
          <ellipse cx="32" cy="42" rx="10" ry="12" fill="#fde68a" />
          
          {/* Belly pattern */}
          <path d="M28 36 Q32 38 36 36" stroke="#d97706" strokeWidth="1" fill="none" />
          <path d="M27 40 Q32 42 37 40" stroke="#d97706" strokeWidth="1" fill="none" />
          <path d="M28 44 Q32 46 36 44" stroke="#d97706" strokeWidth="1" fill="none" />
          
          {/* Head */}
          <circle cx="32" cy="20" r="16" fill="#92400e" />
          <circle cx="32" cy="20" r="14" fill="#b45309" />
          
          {/* Face mask */}
          <ellipse cx="24" cy="20" rx="8" ry="9" fill="#fef3c7" />
          <ellipse cx="40" cy="20" rx="8" ry="9" fill="#fef3c7" />
          
          {/* Eyes */}
          <circle cx="24" cy="19" r="6" fill="#fff" />
          <circle cx="40" cy="19" r="6" fill="#fff" />
          <circle cx="25" cy="19" r="3.5" fill="#1e293b" />
          <circle cx="41" cy="19" r="3.5" fill="#1e293b" />
          <circle cx="26" cy="17.5" r="1.5" fill="#fff" />
          <circle cx="42" cy="17.5" r="1.5" fill="#fff" />
          
          {/* Beak */}
          <path d="M30 24 L32 28 L34 24 Z" fill="#f59e0b" />
          <path d="M30 24 L32 27 L34 24 Z" fill="#d97706" />
          
          {/* Ears/tufts */}
          <path d="M18 12 L14 4 L22 10 Z" fill="#92400e" />
          <path d="M46 12 L50 4 L42 10 Z" fill="#92400e" />
          
          {/* Wings */}
          <ellipse cx="14" cy="36" rx="6" ry="14" fill="#78350f" transform="rotate(-10 14 36)" />
          <ellipse cx="50" cy="36" rx="6" ry="14" fill="#78350f" transform="rotate(10 50 36)" />
          
          {/* Wing animation when speaking */}
          {isSpeaking && (
            <>
              <ellipse cx="14" cy="36" rx="6" ry="14" fill="#78350f" transform="rotate(-20 14 36)" opacity="0.5" />
              <ellipse cx="50" cy="36" rx="6" ry="14" fill="#78350f" transform="rotate(20 50 36)" opacity="0.5" />
            </>
          )}
          
          {/* Feet */}
          <ellipse cx="26" cy="58" rx="5" ry="3" fill="#f59e0b" />
          <ellipse cx="38" cy="58" rx="5" ry="3" fill="#f59e0b" />
          
          {/* Graduation cap */}
          <rect x="18" y="6" width="28" height="3" rx="1" fill="#1e293b" />
          <path d="M32 2 L46 6 L32 10 L18 6 Z" fill="#1e293b" />
          <line x1="46" y1="6" x2="46" y2="14" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="46" cy="15" r="2" fill="#fbbf24" />
        </svg>
        
        {/* Waving wing when first appearing */}
        {isWaving && (
          <div className="absolute -right-2 top-4 animate-bounce">
            <span className="text-lg">👋</span>
          </div>
        )}
      </div>
    </div>
  )
}
