// src/worlds/lab/modules/Panchabhutas.tsx
// Panchabhutas — The Five Great Elements
// Ancient Indian philosophy bridges to modern states of matter

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';

interface Bhuta {
  id: string;
  sanskrit: string;
  devanagari: string;
  english: string;
  symbol: string;
  color: string;
  glow: string;
  modern: string;
  property: string;
  description: string;
  anuWisdom: string;
}

const BHUTAS: Bhuta[] = [
  {
    id: 'prithvi',
    sanskrit: 'Pṛthvī',
    devanagari: 'पृथ्वी',
    english: 'Earth',
    symbol: '🌍',
    color: '#8b6f47',
    glow: '#d4a574',
    modern: 'SOLID',
    property: 'Smell • Stability',
    description: 'The solid state of matter — atoms packed tight, vibrating in place. Earth represents the tangible, stable foundation of all material existence.',
    anuWisdom: 'Maharishi Kanad taught: "The earth atom (Pṛthvī-anu) carries the quality of smell and provides form to all visible things." Modern chemistry calls this — a crystalline lattice!',
  },
  {
    id: 'jala',
    sanskrit: 'Jala',
    devanagari: 'जल',
    english: 'Water',
    symbol: '💧',
    color: '#4a90e2',
    glow: '#7ab8ff',
    modern: 'LIQUID',
    property: 'Taste • Flow',
    description: 'The liquid state — particles close together but free to slide past one another. Water embodies adaptability and the power to dissolve.',
    anuWisdom: 'Kanad said: "The water atom (Jala-anu) has taste and fluidity. It cools and binds." Today we see this as hydrogen bonding between H₂O molecules!',
  },
  {
    id: 'agni',
    sanskrit: 'Agni',
    devanagari: 'अग्नि',
    english: 'Fire',
    symbol: '🔥',
    color: '#ff6b35',
    glow: '#ffaa55',
    modern: 'ENERGY • PLASMA',
    property: 'Form • Heat • Light',
    description: 'Fire represents energy itself — the kinetic energy of particles. When matter is heated enough, it becomes plasma — the 4th state!',
    anuWisdom: 'Kanad wrote: "The fire atom (Agni-anu) gives form and heat. It transforms other atoms." We now know this as thermodynamics and activation energy!',
  },
  {
    id: 'vayu',
    sanskrit: 'Vāyu',
    devanagari: 'वायु',
    english: 'Air',
    symbol: '💨',
    color: '#7dd3c0',
    glow: '#a8f0df',
    modern: 'GAS',
    property: 'Touch • Motion',
    description: 'The gaseous state — particles zoom freely at high speeds, filling any container. Air is invisible yet powerful, like motion itself.',
    anuWisdom: '"The air atom (Vāyu-anu) moves in all directions and carries touch." Kanad anticipated Brownian motion — 2,400 years before Einstein proved it!',
  },
  {
    id: 'akasha',
    sanskrit: 'kāśa',
    devanagari: 'आकाश',
    english: 'Ether / Space',
    symbol: '✨',
    color: '#a78bfa',
    glow: '#d4bfff',
    modern: 'VACUUM • FIELD',
    property: 'Sound • Space',
    description: 'Akasha is the space in which atoms exist — like the quantum vacuum or electromagnetic fields. Without space, atoms cannot move or combine.',
    anuWisdom: '"Ākāśa is the eternal substratum — atoms dance within it." Modern physics echoes this: quantum fields permeate empty space, giving rise to all particles!',
  },
];

export default function Panchabhutas() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [activeBhuta, setActiveBhuta] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bhuta = BHUTAS[activeBhuta];

  // Reveal elements on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      BHUTAS.forEach((_, i) => {
        setTimeout(() => setRevealed(prev => [...prev, i]), i * 200);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Animated element symbol canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const S = 200;
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.scale(dpr, dpr);
    const cx = S / 2;
    const cy = S / 2;

    let animTime = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      animTime += 0.015;

      // Background radial glow
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5);
      bg.addColorStop(0, bhuta.glow + '55');
      bg.addColorStop(0.7, bhuta.glow + '15');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, S, S);

      // Rotating mandala rings
      for (let ring = 0; ring < 3; ring++) {
        const r = 45 + ring * 18;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(animTime * (0.3 - ring * 0.15));
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${bhuta.color}${Math.round(80 - ring * 20).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6 + ring * 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Element symbol
      const symbol = bhuta.symbol;
      ctx.font = '72px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = bhuta.glow;
      ctx.shadowBlur = 20;
      ctx.fillText(symbol, cx, cy);
      ctx.shadowBlur = 0;

      // Orbiting particles (anus)
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + animTime;
        const orbitR = 70 + Math.sin(animTime * 2 + i) * 8;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = bhuta.glow;
        ctx.shadowColor = bhuta.glow;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [bhuta]);

  const handleBhutaSelect = useCallback((index: number) => {
    setActiveBhuta(index);
    LearningService.trackEvent(
      'panchabhutas-session',
      'lab',
      language,
      'module_opened',
      `bhuta-${BHUTAS[index].id}`,
      { bhuta: BHUTAS[index].id }
    );
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕉️</div>
          <h1 className="text-3xl font-extrabold text-orange-700">
            {t('lab.panchabhutas.title', { defaultValue: 'The Panchabhutas' })}
          </h1>
          <p className="text-sm text-orange-400 mt-1">पञ्चभूत — The Five Great Elements</p>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Ancient Indian philosophy meets modern chemistry. Maharishi Kanad (~600 BCE) described atoms
            2,400 years before modern science!
          </p>
        </div>

        {/* Vaisheshika Philosophy Card */}
        <div className="rounded-2xl p-6 border border-orange-500/20 mb-8" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl">
                📜
              </div>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold text-lg mb-2">
                The Vaisheshika School — वैशेषिक दर्शन
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Around <strong className="text-orange-600">600 BCE</strong>, Maharishi Kanad founded
                the Vaisheshika school. He taught that all matter is made of tiny, indivisible particles
                called <strong className="text-orange-600">Anu</strong> (अणु) — atoms! His ideas predate
                Greek atomism (Democritus, ~400 BCE) by over two centuries.
              </p>
              <div className="mt-2 text-sm text-gray-400 font-mono italic">
                "The atom is eternal, invisible, and the ultimate cause of all material effects." — Vaisheshika Sutra 4.2.4
              </div>
            </div>
          </div>
        </div>

        {/* Bhuta selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {BHUTAS.map((b, i) => {
            const isActive = activeBhuta === i;
            const isRevealed = revealed.includes(i);
            return (
              <button
                key={b.id}
                onClick={() => handleBhutaSelect(i)}
                className={`px-4 py-3 rounded-2xl transition-all duration-500 border ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? (isActive ? 'scale(1.1)' : 'scale(1)') : 'translateY(20px)',
                  background: isActive ? `linear-gradient(135deg, ${b.color}44, ${b.color}22)` : `${b.color}11`,
                  borderColor: isActive ? `${b.color}aa` : `${b.color}33`,
                  boxShadow: isActive ? `0 0 25px ${b.glow}44` : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{b.symbol}</span>
                  <div className="text-left">
                    <div className="text-gray-800 text-sm font-bold">{b.english}</div>
                    <div className="text-sm" style={{ color: b.color }}>{b.devanagari}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Bhuta Display */}
        <div className="rounded-3xl p-8 border overflow-hidden relative mb-8" style={{
          background: `linear-gradient(145deg, ${bhuta.color}15, ${bhuta.color}08, rgba(255,255,255,0.8))`,
          borderColor: `${bhuta.color}44`,
          boxShadow: `0 0 40px ${bhuta.glow}11`,
        }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Visual */}
            <div className="flex flex-col items-center justify-center">
              <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
              <div className="text-center mt-4">
                <div className="text-5xl font-bold" style={{ color: bhuta.glow, textShadow: `0 0 20px ${bhuta.glow}66` }}>
                  {bhuta.devanagari}
                </div>
                <div className="text-gray-400 text-sm font-mono mt-1">{bhuta.sanskrit}</div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Ancient Name</div>
                <div className="text-gray-800 text-2xl font-bold">{bhuta.english} <span style={{ color: bhuta.color }}>• {bhuta.property}</span></div>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: `${bhuta.color}33`, backgroundColor: `${bhuta.color}08` }}>
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">🔬 Modern Chemistry</div>
                <div className="text-xl font-bold" style={{ color: bhuta.color }}>{bhuta.modern}</div>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{bhuta.description}</p>
              </div>

              <div className="p-4 rounded-xl border border-orange-500/20" style={{ backgroundColor: '#ff8c4208' }}>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1 text-2xl">🦚</div>
                  <div>
                    <div className="text-orange-400 text-sm font-bold mb-1">Lumo speaks 🕉️</div>
                    <p className="text-orange-600 text-sm leading-relaxed italic">{bhuta.anuWisdom}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to related modules */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/lab/states-of-matter')}
            className="p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:scale-[1.02] text-left bg-white"
          >
            <div className="text-2xl mb-2">🧊</div>
            <div className="text-cyan-600 font-bold">Explore States of Matter</div>
            <div className="text-gray-400 text-sm mt-1">Watch particles dance like Kanad described!</div>
          </button>
          <button
            onClick={() => navigate('/lab/atoms-intro')}
            className="p-5 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02] text-left bg-white"
          >
            <div className="text-2xl mb-2">⚛️</div>
            <div className="text-purple-600 font-bold">Meet the Modern Atom</div>
            <div className="text-gray-400 text-sm mt-1">See Bohr and orbital models — Kanad would smile!</div>
          </button>
        </div>
      </div>
    </div>
  );
}
