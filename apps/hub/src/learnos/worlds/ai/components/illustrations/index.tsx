// SVG Illustration Library for AI Explorers
// Inline SVGs ensure they work in single-file builds

import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

interface IllustrationProps {
  className?: string;
}

// ==========================================
// NEURAL NETWORKS ILLUSTRATIONS
// ==========================================

export function BrainIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 200" className={cn("w-full h-full", className)}>
      {/* Brain shape */}
      <ellipse cx="100" cy="100" rx="70" ry="60" fill="url(#brainGradient)" />
      
      {/* Neural connections */}
      <g stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.6">
        <path d="M60,80 Q80,60 100,80 T140,80" className="animate-pulse" />
        <path d="M50,100 Q80,80 100,100 T150,100" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
        <path d="M60,120 Q80,140 100,120 T140,120" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
      </g>
      
      {/* Neurons */}
      {[[70,70], [100,60], [130,70], [60,100], [100,100], [140,100], [70,130], [100,140], [130,130]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8" fill="#c084fc" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          <circle cx={cx} cy={cy} r="4" fill="#f0abfc" />
        </g>
      ))}
      
      {/* Sparkles */}
      <text x="45" y="55" fontSize="16" className="animate-bounce">✨</text>
      <text x="145" y="65" fontSize="14" className="animate-bounce" style={{ animationDelay: '0.3s' }}>✨</text>
      
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NeuronsPassingNotesIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Neurons as cute circles */}
      {[30, 80, 130, 180].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="75" r="20" fill={['#fca5a5', '#fcd34d', '#86efac', '#93c5fd'][i]} />
          <circle cx={x-5} cy="70" r="4" fill="#1f2937" /> {/* Eye */}
          <circle cx={x+5} cy="70" r="4" fill="#1f2937" />
          <path d={`M${x-6},${82} Q${x},${88} ${x+6},${82}`} stroke="#1f2937" strokeWidth="2" fill="none" /> {/* Smile */}
        </g>
      ))}
      
      {/* Passing notes */}
      <g className="animate-pulse">
        <rect x="45" y="68" width="20" height="14" fill="#fef3c7" rx="2" />
        <text x="55" y="78" fontSize="8" textAnchor="middle">Hi!</text>
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.3s' }}>
        <rect x="95" y="68" width="20" height="14" fill="#fef3c7" rx="2" />
        <text x="105" y="78" fontSize="8" textAnchor="middle">→</text>
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.6s' }}>
        <rect x="145" y="68" width="20" height="14" fill="#fef3c7" rx="2" />
        <text x="155" y="78" fontSize="8" textAnchor="middle">✓</text>
      </g>
      
      {/* Arrows */}
      <path d="M52,75 L58,75" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M102,75 L108,75" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M152,75 L158,75" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow)" />
      
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9ca3af" />
        </marker>
      </defs>
    </svg>
  );
}

export function NeuralNetworkIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Input layer */}
      {[40, 75, 110].map((y, i) => (
        <circle key={`in-${i}`} cx="30" cy={y} r="12" fill="#60a5fa" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
      
      {/* Hidden layer */}
      {[30, 55, 80, 105, 130].map((y, i) => (
        <circle key={`h-${i}`} cx="100" cy={y} r="10" fill="#a78bfa" className="animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.3}s` }} />
      ))}
      
      {/* Output layer */}
      {[55, 95].map((y, i) => (
        <circle key={`out-${i}`} cx="170" cy={y} r="12" fill="#34d399" className="animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.6}s` }} />
      ))}
      
      {/* Connections (simplified) */}
      <g stroke="#e5e7eb" strokeWidth="1" opacity="0.5">
        {[40, 75, 110].map(y1 =>[30, 55, 80, 105, 130].map(y2 => (<line key={`${y1}-${y2}`} x1="42" y1={y1} x2="90" y2={y2} />
          ))
        )}
        {[30, 55, 80, 105, 130].map(y1 =>[55, 95].map(y2 => (<line key={`${y1}-${y2}-out`} x1="110" y1={y1} x2="158" y2={y2} />
          ))
        )}
      </g>
      
      {/* Labels */}
      <text x="30" y="140" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s835_input', 'Input')}</text>
      <text x="100" y="145" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s836_hidden', 'Hidden')}</text>
      <text x="170" y="140" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s837_output', 'Output')}</text>
    </svg>
  );
}

export function LearningFromExamplesIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Cat images */}
      {[20, 50, 80].map((x, i) => (
        <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
          <rect x={x} y="30" width="30" height="30" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />
          <text x={x + 15} y="52" fontSize="18" textAnchor="middle">🐱</text>
        </g>
      ))}
      
      {/* Arrow */}
      <path d="M120,55 L140,55" stroke="#9ca3af" strokeWidth="3" markerEnd="url(#arrow2)" />
      <text x="130" y="45" fontSize="12" textAnchor="middle" fill="#6b7280">{t('auto.learning.s838_learn', 'Learn')}</text>
      
      {/* Robot/AI */}
      <g>
        <rect x="150" y="35" width="40" height="40" rx="8" fill="#c084fc" />
        <circle cx="162" cy="50" r="5" fill="white" />
        <circle cx="178" cy="50" r="5" fill="white" />
        <circle cx="162" cy="50" r="2" fill="#1f2937" />
        <circle cx="178" cy="50" r="2" fill="#1f2937" />
        <rect x="160" y="62" width="20" height="3" rx="1" fill="white" />
      </g>
      
      {/* Output */}
      <text x="170" y="95" fontSize="14" textAnchor="middle" fill="#059669">✓ Cat!</text>
      
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#9ca3af" />
        </marker>
      </defs>
    </svg>
  );
}

// ==========================================
// LLM ILLUSTRATIONS
// ==========================================

export function BookwormIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Stack of books */}
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={40 + i * 5}
          y={100 - i * 20}
          width="50"
          height="18"
          rx="2"
          fill={['#fca5a5', '#fcd34d', '#86efac', '#93c5fd'][i]}
          className="animate-float"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
      
      {/* Owl/Reader */}
      <g transform="translate(120, 50)">
        <ellipse cx="25" cy="35" rx="30" ry="35" fill="#d4a574" /> {/* Body */}
        <circle cx="15" cy="25" r="12" fill="white" /> {/* Left eye */}
        <circle cx="35" cy="25" r="12" fill="white" />
        <circle cx="15" cy="25" r="6" fill="#1f2937" />
        <circle cx="35" cy="25" r="6" fill="#1f2937" />
        <path d="M22,38 L25,45 L28,38" fill="#f59e0b" /> {/* Beak */}
        <text x="25" y="75" fontSize="20" textAnchor="middle">📚</text>
      </g>
      
      <text x="100" y="140" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s839_reading_millions_of_books', 'Reading millions of books!')}</text>
    </svg>
  );
}

export function TokensIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 120" className={cn("w-full h-full", className)}>
      {/* Word being split */}
      <text x="20" y="35" fontSize="14" fill="#374151">"Hello"</text>
      <path d="M60,30 L80,30" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow3)" />
      
      {/* Token box */}
      <rect x="90" y="18" width="50" height="26" rx="6" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
      <text x="115" y="36" fontSize="12" textAnchor="middle" fill="#6d28d9">{t('auto.learning.s840_hello', 'Hello')}</text>
      
      {/* Split example */}
      <text x="20" y="85" fontSize="12" fill="#374151">"Unhappy"</text>
      <path d="M75,80 L90,80" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow3)" />
      
      {/* Two tokens */}
      <rect x="95" y="68" width="35" height="24" rx="6" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
      <text x="112" y="84" fontSize="10" textAnchor="middle" fill="#be185d">Un</text>
      
      <rect x="135" y="68" width="50" height="24" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <text x="160" y="84" fontSize="10" textAnchor="middle" fill="#1d4ed8">happy</text>
      
      <defs>
        <marker id="arrow3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9ca3af" />
        </marker>
      </defs>
    </svg>
  );
}

export function PredictionIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 120" className={cn("w-full h-full", className)}>
      {/* Prompt */}
      <rect x="10" y="20" width="100" height="30" rx="6" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
      <text x="60" y="40" fontSize="11" textAnchor="middle" fill="#374151">{t('auto.learning.s841_i_love_to_eat', 'I love to eat...')}</text>
      
      {/* Thinking robot */}
      <g transform="translate(120, 25)">
        <rect x="0" y="0" width="30" height="30" rx="6" fill="#c084fc" />
        <circle cx="10" cy="12" r="4" fill="white" />
        <circle cx="20" cy="12" r="4" fill="white" />
        <text x="15" y="45" fontSize="14" textAnchor="middle">🤔</text>
      </g>
      
      {/* Predictions */}
      <g transform="translate(20, 70)">
        {['🥟 samosa', '🍰 cake', '🍎 apples'].map((text, i) => (
          <g key={i}>
            <rect x={i * 60} y="0" width="55" height="25" rx="4" fill={i === 0 ? '#bbf7d0' : '#f3f4f6'} stroke={i === 0 ? '#22c55e' : '#d1d5db'} strokeWidth="2" />
            <text x={i * 60 + 27} y="17" fontSize="10" textAnchor="middle" fill="#374151">{text}</text>
          </g>
        ))}
      </g>
      
      <text x="50" y="112" fontSize="9" fill="#22c55e">{t('auto.learning.s842_most_likely', 'Most likely!')}</text>
    </svg>
  );
}

// ==========================================
// COMPUTER VISION ILLUSTRATIONS
// ==========================================

export function RobotEyesIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Robot head */}
      <rect x="60" y="30" width="80" height="80" rx="16" fill="#6366f1" />
      
      {/* Eyes (cameras) */}
      <circle cx="85" cy="65" r="18" fill="white" stroke="#1f2937" strokeWidth="3" />
      <circle cx="115" cy="65" r="18" fill="white" stroke="#1f2937" strokeWidth="3" />
      
      {/* Pupils */}
      <circle cx="85" cy="65" r="8" fill="#06b6d4" className="animate-pulse" />
      <circle cx="115" cy="65" r="8" fill="#06b6d4" className="animate-pulse" />
      
      {/* Camera details */}
      <circle cx="85" cy="65" r="3" fill="#1f2937" />
      <circle cx="115" cy="65" r="3" fill="#1f2937" />
      
      {/* Antenna */}
      <line x1="100" y1="30" x2="100" y2="15" stroke="#1f2937" strokeWidth="3" />
      <circle cx="100" cy="12" r="5" fill="#ef4444" className="animate-pulse" />
      
      {/* Smile */}
      <path d="M80,90 Q100,105 120,90" stroke="#1f2937" strokeWidth="3" fill="none" />
      
      {/* Scan lines */}
      <g stroke="#06b6d4" strokeWidth="1" opacity="0.5">
        <line x1="45" y1="70" x2="55" y2="65" className="animate-pulse" />
        <line x1="145" y1="65" x2="155" y2="70" className="animate-pulse" />
      </g>
      
      {/* Objects being "seen" */}
      <text x="30" y="60" fontSize="20">🐱</text>
      <text x="160" y="60" fontSize="20">🌸</text>
      <text x="40" y="130" fontSize="20">🚗</text>
      <text x="140" y="130" fontSize="20">🍎</text>
    </svg>
  );
}

export function PixelGridIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Smiley face made of pixels */}
      <g transform="translate(50, 25)">
        {[
          [2,0,'#fcd34d'],[3,0,'#fcd34d'],[4,0,'#fcd34d'],
          [1,1,'#fcd34d'],[2,1,'#fcd34d'],[3,1,'#fcd34d'],[4,1,'#fcd34d'],[5,1,'#fcd34d'],
          [0,2,'#fcd34d'],[1,2,'#1f2937'],[2,2,'#fcd34d'],[3,2,'#fcd34d'],[4,2,'#1f2937'],[5,2,'#fcd34d'],[6,2,'#fcd34d'],
          [0,3,'#fcd34d'],[1,3,'#fcd34d'],[2,3,'#fcd34d'],[3,3,'#fcd34d'],[4,3,'#fcd34d'],[5,3,'#fcd34d'],[6,3,'#fcd34d'],
          [0,4,'#fcd34d'],[1,4,'#1f2937'],[2,4,'#fcd34d'],[3,4,'#fcd34d'],[4,4,'#fcd34d'],[5,4,'#1f2937'],[6,4,'#fcd34d'],
          [1,5,'#fcd34d'],[2,5,'#1f2937'],[3,5,'#1f2937'],[4,5,'#1f2937'],[5,5,'#fcd34d'],
          [2,6,'#fcd34d'],[3,6,'#fcd34d'],[4,6,'#fcd34d'],
        ].map(([x, y, color], i) => (
          <rect
            key={i}
            x={(x as number) * 14}
            y={(y as number) * 14}
            width="13"
            height="13"
            fill={color as string}
            rx="2"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.02}s` }}
          />
        ))}
      </g>
      
      <text x="100" y="135" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s843_each_square_is_a_pixel', 'Each square is a pixel!')}</text>
    </svg>
  );
}

// ==========================================
// TRANSFORMERS ILLUSTRATIONS
// ==========================================

export function DetectiveIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Detective with magnifying glass */}
      <g transform="translate(80, 30)">
        {/* Hat */}
        <ellipse cx="20" cy="10" rx="25" ry="8" fill="#78350f" />
        <rect x="5" y="10" width="30" height="20" fill="#78350f" />
        
        {/* Face */}
        <circle cx="20" cy="45" r="25" fill="#fcd9b6" />
        <circle cx="12" cy="40" r="4" fill="#1f2937" /> {/* Eyes */}
        <circle cx="28" cy="40" r="4" fill="#1f2937" />
        <ellipse cx="20" cy="52" rx="3" ry="2" fill="#f59e0b" /> {/* Nose */}
        <path d="M12,60 Q20,68 28,60" stroke="#1f2937" strokeWidth="2" fill="none" /> {/* Smile */}
      </g>
      
      {/* Magnifying glass */}
      <g transform="translate(130, 50)">
        <circle cx="15" cy="15" r="20" fill="none" stroke="#78350f" strokeWidth="6" />
        <circle cx="15" cy="15" r="15" fill="#bfdbfe" opacity="0.5" />
        <line x1="30" y1="30" x2="50" y2="50" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
      </g>
      
      {/* Clues being examined */}
      <g className="animate-pulse">
        <text x="20" y="50" fontSize="16">📝</text>
        <text x="35" y="80" fontSize="16">🔍</text>
        <text x="25" y="110" fontSize="16">💡</text>
      </g>
      
      <text x="100" y="140" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s844_looking_at_all_clues_at_once', 'Looking at ALL clues at once!')}</text>
    </svg>
  );
}

export function AttentionIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 100" className={cn("w-full h-full", className)}>
      {/* Words */}
      {['The', 'cat', 'sat', 'on', 'it'].map((word, i) => (
        <g key={i} transform={`translate(${20 + i * 35}, 30)`}>
          <rect x="0" y="0" width="32" height="24" rx="4" fill={i === 1 || i === 4 ? '#c084fc' : '#e5e7eb'} />
          <text x="16" y="16" fontSize="10" textAnchor="middle" fill={i === 1 || i === 4 ? 'white' : '#374151'}>{word}</text>
        </g>
      ))}
      
      {/* Attention arc from "it" to "cat" */}
      <path 
        d="M170,30 Q130,0 55,30" 
        fill="none" 
        stroke="#a855f7" 
        strokeWidth="3"
        strokeDasharray="5,3"
        className="animate-pulse"
      />
      
      {/* Arrow */}
      <polygon points="55,27 55,33 48,30" fill="#a855f7" />
      
      <text x="115" y="8" fontSize="9" fill="#7c3aed">{t('auto.learning.s845_attention', 'Attention!')}</text>
      <text x="100" y="85" fontSize="10" textAnchor="middle" fill="#6b7280">"it" pays attention to "cat"</text>
    </svg>
  );
}

// ==========================================
// RAG ILLUSTRATIONS
// ==========================================

export function LibrarianRobotIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Bookshelf */}
      <rect x="10" y="30" width="80" height="100" fill="#92400e" rx="4" />
      {[0, 1, 2, 3].map(row => (
        <g key={row}>
          <line x1="15" y1={55 + row * 25} x2="85" y2={55 + row * 25} stroke="#78350f" strokeWidth="3" />
          {[0, 1, 2, 3].map(book => (
            <rect
              key={book}
              x={18 + book * 17}
              y={35 + row * 25}
              width="14"
              height="18"
              fill={['#fca5a5', '#fcd34d', '#86efac', '#93c5fd'][book]}
              rx="1"
            />
          ))}
        </g>
      ))}
      
      {/* Robot librarian */}
      <g transform="translate(110, 40)">
        <rect x="10" y="0" width="50" height="50" rx="10" fill="#10b981" />
        <circle cx="25" cy="20" r="6" fill="white" />
        <circle cx="45" cy="20" r="6" fill="white" />
        <circle cx="25" cy="20" r="3" fill="#1f2937" />
        <circle cx="45" cy="20" r="3" fill="#1f2937" />
        <rect x="25" y="35" width="20" height="4" rx="2" fill="white" />
        
        {/* Glasses */}
        <rect x="18" y="15" width="16" height="12" rx="2" fill="none" stroke="#1f2937" strokeWidth="2" />
        <rect x="36" y="15" width="16" height="12" rx="2" fill="none" stroke="#1f2937" strokeWidth="2" />
        <line x1="34" y1="20" x2="36" y2="20" stroke="#1f2937" strokeWidth="2" />
      </g>
      
      {/* Book being handed */}
      <g className="animate-bounce">
        <rect x="120" y="95" width="25" height="30" fill="#f472b6" rx="2" />
        <text x="132" y="115" fontSize="14" textAnchor="middle">📖</text>
      </g>
      
      <text x="100" y="145" fontSize="10" textAnchor="middle" fill="#6b7280">{t('auto.learning.s846_finding_the_right_book_for_you', 'Finding the right book for you!')}</text>
    </svg>
  );
}

export function RAGProcessIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 120" className={cn("w-full h-full", className)}>
      {/* Question */}
      <g transform="translate(10, 20)">
        <rect x="0" y="0" width="40" height="30" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <text x="20" y="20" fontSize="16" textAnchor="middle">❓</text>
      </g>
      <text x="30" y="65" fontSize="8" textAnchor="middle" fill="#3b82f6">{t('auto.learning.s847_question', 'Question')}</text>
      
      {/* Arrow 1 */}
      <path d="M55,35 L70,35" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#ragArrow)" />
      
      {/* Retrieve - Books */}
      <g transform="translate(75, 15)">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
        <text x="20" y="28" fontSize="18" textAnchor="middle">📚</text>
      </g>
      <text x="95" y="70" fontSize="8" textAnchor="middle" fill="#f59e0b">{t('auto.learning.s848_retrieve', 'Retrieve')}</text>
      
      {/* Arrow 2 */}
      <path d="M120,35 L135,35" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#ragArrow)" />
      
      {/* Generate - Robot */}
      <g transform="translate(140, 15)">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <text x="20" y="28" fontSize="18" textAnchor="middle">🤖</text>
      </g>
      <text x="160" y="70" fontSize="8" textAnchor="middle" fill="#10b981">{t('auto.learning.s849_generate', 'Generate')}</text>
      
      {/* Answer */}
      <g transform="translate(75, 85)">
        <rect x="0" y="0" width="70" height="25" rx="6" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <text x="35" y="17" fontSize="10" textAnchor="middle" fill="#10b981">✓ Answer!</text>
      </g>
      
      {/* Arrow down */}
      <path d="M160,60 L160,80 L145,95" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#ragArrow)" />
      
      <defs>
        <marker id="ragArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9ca3af" />
        </marker>
      </defs>
    </svg>
  );
}

// ==========================================
// EMBEDDINGS ILLUSTRATIONS
// ==========================================

export function WordMapIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Grid background */}
      <g stroke="#e5e7eb" strokeWidth="1">
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <line x1={i * 50} y1="0" x2={i * 50} y2="150" />
            <line x1="0" y1={i * 37.5} x2="200" y2={i * 37.5} />
          </g>
        ))}
      </g>
      
      {/* Animal cluster */}
      <g>
        <circle cx="40" cy="40" r="30" fill="#fce7f3" opacity="0.5" />
        <text x="30" y="35" fontSize="12">🐕</text>
        <text x="45" y="50" fontSize="12">🐈</text>
        <text x="30" y="55" fontSize="8" fill="#be185d">pets</text>
      </g>
      
      {/* Vehicle cluster */}
      <g>
        <circle cx="150" cy="110" r="30" fill="#dbeafe" opacity="0.5" />
        <text x="140" y="105" fontSize="12">🚗</text>
        <text x="155" y="120" fontSize="12">🚌</text>
        <text x="140" y="130" fontSize="8" fill="#1d4ed8">vehicles</text>
      </g>
      
      {/* Food cluster */}
      <g>
        <circle cx="160" cy="40" r="25" fill="#d1fae5" opacity="0.5" />
        <text x="150" y="35" fontSize="12">🍕</text>
        <text x="162" y="50" fontSize="12">🍔</text>
        <text x="152" y="60" fontSize="8" fill="#059669">food</text>
      </g>
      
      <text x="100" y="145" fontSize="9" textAnchor="middle" fill="#6b7280">{t('auto.learning.s850_similar_words_cluster_together', 'Similar words cluster together!')}</text>
    </svg>
  );
}

// ==========================================
// AI ETHICS ILLUSTRATIONS
// ==========================================

export function BalanceScaleIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Scale post */}
      <rect x="95" y="40" width="10" height="80" fill="#78350f" />
      <rect x="80" y="120" width="40" height="10" rx="2" fill="#78350f" />
      
      {/* Balance beam */}
      <rect x="30" y="35" width="140" height="8" rx="2" fill="#f59e0b" />
      
      {/* Left pan - AI Power */}
      <g>
        <line x1="50" y1="43" x2="50" y2="70" stroke="#92400e" strokeWidth="2" />
        <ellipse cx="50" cy="80" rx="35" ry="10" fill="#fcd34d" />
        <text x="50" y="75" fontSize="20" textAnchor="middle">🤖</text>
        <text x="50" y="100" fontSize="8" textAnchor="middle" fill="#92400e">AI Power</text>
      </g>
      
      {/* Right pan - Responsibility */}
      <g>
        <line x1="150" y1="43" x2="150" y2="70" stroke="#92400e" strokeWidth="2" />
        <ellipse cx="150" cy="80" rx="35" ry="10" fill="#fcd34d" />
        <text x="150" y="75" fontSize="20" textAnchor="middle">⚖️</text>
        <text x="150" y="100" fontSize="8" textAnchor="middle" fill="#92400e">{t('auto.learning.s851_responsibility', 'Responsibility')}</text>
      </g>
      
      <text x="100" y="140" fontSize="9" textAnchor="middle" fill="#6b7280">{t('auto.learning.s852_balance_power_with_responsibility', 'Balance power with responsibility!')}</text>
    </svg>
  );
}

export function PrivacyShieldIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Shield */}
      <path
        d="M100,20 L150,40 L150,80 Q150,120 100,135 Q50,120 50,80 L50,40 Z"
        fill="url(#shieldGradient)"
        stroke="#3b82f6"
        strokeWidth="3"
      />
      
      {/* Lock icon */}
      <g transform="translate(80, 55)">
        <rect x="5" y="20" width="30" height="25" rx="3" fill="#1e40af" />
        <path d="M12,20 L12,12 Q12,5 20,5 Q28,5 28,12 L28,20" fill="none" stroke="#1e40af" strokeWidth="4" />
        <circle cx="20" cy="32" r="4" fill="#60a5fa" />
      </g>
      
      {/* Crossed out personal info */}
      <g opacity="0.6">
        <text x="20" y="50" fontSize="10" fill="#ef4444">📍 Address</text>
        <line x1="15" y1="47" x2="75" y2="47" stroke="#ef4444" strokeWidth="2" />
        
        <text x="135" y="50" fontSize="10" fill="#ef4444">📞 Phone</text>
        <line x1="130" y1="47" x2="185" y2="47" stroke="#ef4444" strokeWidth="2" />
      </g>
      
      <text x="100" y="145" fontSize="9" textAnchor="middle" fill="#6b7280">{t('auto.learning.s853_keep_personal_info_private', 'Keep personal info private!')}</text>
      
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ==========================================
// PROMPT ENGINEERING ILLUSTRATIONS
// ==========================================

export function MagicWandIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Wand */}
      <g transform="translate(60, 30) rotate(30)">
        <rect x="0" y="0" width="12" height="80" fill="url(#wandGradient)" rx="2" />
        <rect x="-2" y="0" width="16" height="15" fill="#fcd34d" rx="2" />
      </g>
      
      {/* Sparkles */}
      {[[100,30], [130,50], [90,60], [140,35], [85,40]].map(([x,y], i) => (
        <text
          key={i}
          x={x}
          y={y}
          fontSize={12 + i * 2}
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          ✨
        </text>
      ))}
      
      {/* Text appearing */}
      <g transform="translate(70, 90)">
        <rect x="0" y="0" width="100" height="35" rx="6" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
        <text x="50" y="15" fontSize="10" textAnchor="middle" fill="#374151">Clear prompt =</text>
        <text x="50" y="28" fontSize="10" textAnchor="middle" fill="#10b981">✨ Magic results!</text>
      </g>
      
      <defs>
        <linearGradient id="wandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoodVsBadPromptIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 130" className={cn("w-full h-full", className)}>
      {/* Bad prompt side */}
      <g>
        <rect x="10" y="10" width="80" height="50" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2" />
        <text x="50" y="28" fontSize="9" textAnchor="middle" fill="#7f1d1d">"Tell me stuff"</text>
        <text x="50" y="42" fontSize="14" textAnchor="middle">😕</text>
        <text x="50" y="75" fontSize="8" textAnchor="middle" fill="#dc2626">❌ Vague</text>
      </g>
      
      {/* Good prompt side */}
      <g>
        <rect x="110" y="10" width="80" height="50" rx="6" fill="#d1fae5" stroke="#86efac" strokeWidth="2" />
        <text x="150" y="25" fontSize="7" textAnchor="middle" fill="#14532d">"Write 3 fun facts</text>
        <text x="150" y="35" fontSize="7" textAnchor="middle" fill="#14532d">about dogs for a</text>
        <text x="150" y="45" fontSize="7" textAnchor="middle" fill="#14532d">10-year-old"</text>
        <text x="150" y="75" fontSize="8" textAnchor="middle" fill="#16a34a">✅ Clear & specific!</text>
      </g>
      
      {/* VS */}
      <circle cx="100" cy="35" r="15" fill="#8b5cf6" />
      <text x="100" y="40" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">VS</text>
      
      {/* Results */}
      <g transform="translate(10, 90)">
        <rect x="0" y="0" width="80" height="25" rx="4" fill="#fef2f2" />
        <text x="40" y="16" fontSize="8" textAnchor="middle" fill="#991b1b">{t('auto.learning.s854_boring_answer', 'Boring answer...')}</text>
      </g>
      
      <g transform="translate(110, 90)">
        <rect x="0" y="0" width="80" height="25" rx="4" fill="#ecfdf5" />
        <text x="40" y="16" fontSize="8" textAnchor="middle" fill="#166534">🎉 Great answer!</text>
      </g>
    </svg>
  );
}

// ==========================================
// REINFORCEMENT LEARNING ILLUSTRATIONS
// ==========================================

export function PuppyTrainingIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Puppy */}
      <g transform="translate(50, 40)">
        <ellipse cx="30" cy="45" rx="28" ry="22" fill="#d4a574" />
        <circle cx="30" cy="20" r="20" fill="#c4956a" />
        {/* Ears */}
        <ellipse cx="14" cy="10" rx="10" ry="14" fill="#b07d54" transform="rotate(-15 14 10)" />
        <ellipse cx="46" cy="10" rx="10" ry="14" fill="#b07d54" transform="rotate(15 46 10)" />
        {/* Eyes */}
        <circle cx="22" cy="18" r="4" fill="#1f2937" />
        <circle cx="38" cy="18" r="4" fill="#1f2937" />
        <circle cx="23" cy="17" r="1.5" fill="white" />
        <circle cx="39" cy="17" r="1.5" fill="white" />
        {/* Nose */}
        <ellipse cx="30" cy="26" rx="4" ry="3" fill="#1f2937" />
        {/* Mouth */}
        <path d="M26,30 Q30,36 34,30" stroke="#1f2937" strokeWidth="1.5" fill="none" />
        {/* Tail */}
        <path d="M58,42 Q72,25 65,35" stroke="#c4956a" strokeWidth="5" fill="none" strokeLinecap="round" className="animate-pulse" />
      </g>
      
      {/* Treat */}
      <g className="animate-bounce" transform="translate(130, 35)">
        <circle cx="15" cy="15" r="14" fill="#f59e0b" />
        <text x="15" y="20" fontSize="14" textAnchor="middle">⭐</text>
      </g>
      
      {/* Arrow */}
      <path d="M115,55 L125,50" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
      
      {/* Caption */}
      <text x="100" y="105" fontSize="9" textAnchor="middle" fill="#10b981" fontWeight="bold">Good boy! +Reward!</text>
      <text x="100" y="140" fontSize="9" textAnchor="middle" fill="#6b7280">{t('auto.learning.s855_actions_rewards_learning', 'Actions → Rewards → Learning!')}</text>
    </svg>
  );
}

export function RLLoopIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 160" className={cn("w-full h-full", className)}>
      {/* Agent */}
      <g>
        <circle cx="100" cy="30" r="24" fill="#10b981" />
        <text x="100" y="28" fontSize="18" textAnchor="middle">🤖</text>
        <text x="100" y="44" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">{t('auto.learning.s856_agent', 'Agent')}</text>
      </g>
      
      {/* Environment */}
      <g>
        <circle cx="100" cy="130" r="24" fill="#3b82f6" />
        <text x="100" y="128" fontSize="18" textAnchor="middle">🌍</text>
        <text x="100" y="144" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">Env</text>
      </g>
      
      {/* Action arrow (left side, down) */}
      <path d="M76,30 Q30,80 76,130" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#rlLoopArrow)" />
      <text x="30" y="82" fontSize="9" fill="#f59e0b" fontWeight="bold">{t('auto.learning.s857_action', 'Action')}</text>
      
      {/* Reward arrow (right side, up) */}
      <path d="M124,130 Q170,80 124,30" fill="none" stroke="#10b981" strokeWidth="3" markerEnd="url(#rlLoopArrow2)" />
      <text x="148" y="72" fontSize="9" fill="#10b981" fontWeight="bold">{t('auto.learning.s858_reward', 'Reward')}</text>
      <text x="148" y="92" fontSize="9" fill="#60a5fa" fontWeight="bold">{t('auto.learning.s859_state', 'State')}</text>
      
      <defs>
        <marker id="rlLoopArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" /></marker>
        <marker id="rlLoopArrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
      </defs>
    </svg>
  );
}

export function GridWorldIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Grid */}
      {[0,1,2,3].map(r =>[0,1,2,3].map(c => (<rect key={`${r}-${c}`} x={35 + c * 35} y={15 + r * 32} width="32" height="29" rx="4"
            fill={r===0 && c===3 ? '#fef3c7' : r===2 && c===1 ? '#fee2e2' : '#f8fafc'}
            stroke="#d1d5db" strokeWidth="1.5" />
        ))
      )}
      
      {/* Robot at start */}
      <text x="51" y="125" fontSize="18" textAnchor="middle">🤖</text>
      {/* Star at goal */}
      <text x="156" y="37" fontSize="18" textAnchor="middle">⭐</text>
      {/* Trap */}
      <text x="86" y="93" fontSize="16" textAnchor="middle">💥</text>
      
      {/* Path arrows */}
      <g stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="4" opacity="0.6">
        <path d="M51,108 L51,75 L86,75 L86,40 L120,40 L155,40" />
      </g>
      
      <text x="100" y="145" fontSize="9" textAnchor="middle" fill="#6b7280">{t('auto.learning.s860_find_the_shortest_path', 'Find the shortest path!')}</text>
    </svg>
  );
}

// ==========================================
// GENERATIVE AI ILLUSTRATIONS
// ==========================================

export function AIArtistIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Robot artist */}
      <g transform="translate(60, 20)">
        <rect x="15" y="10" width="50" height="50" rx="10" fill="#a855f7" />
        <circle cx="30" cy="30" r="7" fill="white" />
        <circle cx="50" cy="30" r="7" fill="white" />
        <circle cx="30" cy="30" r="3" fill="#1f2937" />
        <circle cx="50" cy="30" r="3" fill="#1f2937" />
        <rect x="28" y="47" width="24" height="4" rx="2" fill="white" />
        {/* Beret */}
        <ellipse cx="40" cy="10" rx="22" ry="8" fill="#ec4899" />
        <circle cx="40" cy="5" r="4" fill="#ec4899" />
      </g>
      
      {/* Canvas/Easel */}
      <g transform="translate(20, 80)">
        <rect x="0" y="0" width="55" height="45" fill="white" stroke="#d1d5db" strokeWidth="2" rx="2" />
        {/* Art on canvas */}
        <circle cx="20" cy="15" r="8" fill="#fca5a5" opacity="0.6" />
        <circle cx="35" cy="25" r="10" fill="#86efac" opacity="0.6" />
        <circle cx="15" cy="30" r="6" fill="#93c5fd" opacity="0.6" />
      </g>
      
      {/* Paintbrush */}
      <g className="animate-pulse" transform="translate(115, 60)">
        <rect x="0" y="30" width="6" height="35" fill="#92400e" rx="1" />
        <rect x="-3" y="25" width="12" height="10" fill="#6b7280" rx="1" />
        <rect x="-2" y="20" width="10" height="8" fill="#ec4899" rx="2" />
      </g>
      
      {/* Sparkles */}
      <text x="140" y="45" fontSize="14" className="animate-bounce">✨</text>
      <text x="155" y="80" fontSize="12" className="animate-bounce" style={{ animationDelay: '0.3s' }}>✨</text>
      <text x="130" y="105" fontSize="14" className="animate-bounce" style={{ animationDelay: '0.6s' }}>✨</text>
      
      <text x="100" y="140" fontSize="9" textAnchor="middle" fill="#6b7280">AI creates new art from patterns!</text>
    </svg>
  );
}

export function DiffusionIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 120" className={cn("w-full h-full", className)}>
      {/* Stage 1: Noise */}
      <g transform="translate(5, 20)">
        <rect x="0" y="0" width="45" height="45" rx="6" fill="#1e293b" />
        {Array.from({length: 15}).map((_, i) => (
          <circle key={i} cx={5 + Math.random() * 35} cy={5 + Math.random() * 35} r={1 + Math.random() * 3}
            fill={['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7'][i % 5]} opacity="0.7" />
        ))}
        <text x="22" y="60" fontSize="7" textAnchor="middle" fill="#9ca3af">{t('auto.learning.s861_noise', 'Noise')}</text>
      </g>
      
      {/* Arrow */}
      <text x="60" y="45" fontSize="16" fill="#9ca3af">→</text>
      
      {/* Stage 2: Blurry */}
      <g transform="translate(75, 20)">
        <rect x="0" y="0" width="45" height="45" rx="6" fill="#1e293b" />
        <circle cx="22" cy="18" r="12" fill="#f9a8d4" opacity="0.5" />
        <circle cx="22" cy="35" r="8" fill="#86efac" opacity="0.4" />
        {Array.from({length: 6}).map((_, i) => (
          <circle key={i} cx={5 + Math.random() * 35} cy={5 + Math.random() * 35} r={1 + Math.random() * 2}
            fill="#94a3b8" opacity="0.4" />
        ))}
        <text x="22" y="60" fontSize="7" textAnchor="middle" fill="#9ca3af">{t('auto.learning.s862_forming', 'Forming')}</text>
      </g>
      
      {/* Arrow */}
      <text x="130" y="45" fontSize="16" fill="#9ca3af">→</text>
      
      {/* Stage 3: Clear */}
      <g transform="translate(145, 20)">
        <rect x="0" y="0" width="45" height="45" rx="6" fill="#fdf4ff" stroke="#d946ef" strokeWidth="2" />
        <text x="22" y="32" fontSize="28" textAnchor="middle">🌸</text>
        <text x="22" y="60" fontSize="7" textAnchor="middle" fill="#9ca3af">{t('auto.learning.s863_image', 'Image!')}</text>
      </g>
      
      {/* Process label */}
      <text x="100" y="100" fontSize="10" textAnchor="middle" fill="#a855f7" fontWeight="bold">{t('auto.learning.s864_noise_shapes_image', 'Noise → Shapes → Image!')}</text>
      <text x="100" y="115" fontSize="8" textAnchor="middle" fill="#6b7280">{t('auto.learning.s865_diffusion_removes_noise_step_by_step', 'Diffusion removes noise step by step')}</text>
    </svg>
  );
}

export function CreativeTypesIllustration({ className }: IllustrationProps) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full", className)}>
      {/* Center: AI Brain */}
      <circle cx="100" cy="75" r="25" fill="url(#genAIGradient)" />
      <text x="100" y="73" fontSize="20" textAnchor="middle">🤖</text>
      <text x="100" y="88" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">Gen AI</text>
      
      {/* Surrounding creative outputs */}
      {[
        { x: 40, y: 25, emoji: '📝', label: 'Text' },
        { x: 160, y: 25, emoji: '🖼️', label: 'Images' },
        { x: 30, y: 120, emoji: '🎵', label: 'Music' },
        { x: 170, y: 120, emoji: '🎬', label: 'Video' },
      ].map((item, i) => (
        <g key={i}>
          <line x1="100" y1="75" x2={item.x} y2={item.y} stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4" opacity="0.5" />
          <circle cx={item.x} cy={item.y} r="18" fill="white" stroke="#d8b4fe" strokeWidth="2" />
          <text x={item.x} y={item.y - 2} fontSize="16" textAnchor="middle">{item.emoji}</text>
          <text x={item.x} y={item.y + 14} fontSize="7" textAnchor="middle" fill="#7c3aed">{item.label}</text>
        </g>
      ))}
      
      <defs>
        <radialGradient id="genAIGradient">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Default export with all illustrations
const Illustrations = {
  // Neural Networks
  BrainIllustration,
  NeuronsPassingNotesIllustration,
  NeuralNetworkIllustration,
  LearningFromExamplesIllustration,
  // LLM
  BookwormIllustration,
  TokensIllustration,
  PredictionIllustration,
  // Computer Vision
  RobotEyesIllustration,
  PixelGridIllustration,
  // Transformers
  DetectiveIllustration,
  AttentionIllustration,
  // RAG
  LibrarianRobotIllustration,
  RAGProcessIllustration,
  // Embeddings
  WordMapIllustration,
  // AI Ethics
  BalanceScaleIllustration,
  PrivacyShieldIllustration,
  // Prompt Engineering
  MagicWandIllustration,
  GoodVsBadPromptIllustration,
  // Reinforcement Learning
  PuppyTrainingIllustration,
  RLLoopIllustration,
  GridWorldIllustration,
  // Generative AI
  AIArtistIllustration,
  DiffusionIllustration,
  CreativeTypesIllustration,
};

export default Illustrations;
