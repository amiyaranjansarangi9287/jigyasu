// src/worlds/tiny/TinyHome.tsx
// Canvas-based illustrated world — each module is a location child taps to enter.
// No text labels visible to child.

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import WonderGarden from './WonderGarden';

const ZONES = [
  { module: 'tap-world', x: 0.20, y: 0.42, emoji: '🐾', color: '#FF6B6B' },
  { module: 'color-mixer', x: 0.50, y: 0.30, emoji: '🎨', color: '#A855F7' },
  { module: 'shape-sorter', x: 0.80, y: 0.42, emoji: '🔷', color: '#4ECDC4' },
  { module: 'animal-orchestra', x: 0.15, y: 0.62, emoji: '🎵', color: '#22C55E' },
  { module: 'bubble-world', x: 0.85, y: 0.62, emoji: '🫧', color: '#6366F1' },
  { module: 'weather-maker', x: 0.30, y: 0.78, emoji: '⛅', color: '#0EA5E9' },
  { module: 'farm-friends', x: 0.70, y: 0.78, emoji: '🐄', color: '#84CC16' },
  { module: 'day-and-night', x: 0.50, y: 0.56, emoji: '🌅', color: '#F59E0B' },
];

export default function TinyHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const [showGarden, setShowGarden] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const focusedIndexRef = useRef<number | null>(null);
  const showLabelsRef = useRef(true);
  const translationsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    ZONES.forEach(z => {
      translationsRef.current[z.module] = t(`tiny.zones.${z.module}`, z.module.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    });
  }, [t]);

  // Sync state to ref for the animation loop
  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    dimensionsRef.current = { w, h };
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();

    const animate = (timestamp: number) => {
      const time = (timestamp - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      sky.addColorStop(0, '#87CEEB');
      sky.addColorStop(1, '#B0E0E6');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Sun
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(w * 0.9, h * 0.1, 30, 0, Math.PI * 2);
      ctx.fill();

      // Rays
      for (let i = 0; i < 8; i++) {
        const angle = time * 0.3 + (i * Math.PI) / 4;
        const rx = w * 0.9 + Math.cos(angle) * 45;
        const ry = h * 0.1 + Math.sin(angle) * 45;
        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FDE04799';
        ctx.fill();
      }

      // Clouds
      const drawCloud = (cx: number, cy: number, scale: number) => {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(cx, cy, 20 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 18 * scale, cy - 6 * scale, 16 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 35 * scale, cy, 18 * scale, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(w * 0.2 + Math.sin(time * 0.2) * 8, h * 0.12, 1);
      drawCloud(w * 0.6 + Math.sin(time * 0.15 + 1) * 6, h * 0.08, 0.8);

      // Rolling hills (ground)
      ctx.fillStyle = '#86EFAC';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.quadraticCurveTo(w * 0.25, h * 0.48, w * 0.5, h * 0.54);
      ctx.quadraticCurveTo(w * 0.75, h * 0.60, w, h * 0.52);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Darker grass layer
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.quadraticCurveTo(w * 0.3, h * 0.60, w * 0.5, h * 0.66);
      ctx.quadraticCurveTo(w * 0.8, h * 0.72, w, h * 0.64);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Small flowers on grass
      for (let i = 0; i < 6; i++) {
        const fx = w * (0.1 + i * 0.16);
        const fy = h * 0.68 + Math.sin(i * 2.3) * 15;
        const sway = Math.sin(time * 1.5 + i) * 3;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(i % 2 === 0 ? '🌼' : '🌻', fx + sway, fy);
      }

      // Module zones
      ZONES.forEach((zone, index) => {
        const x = zone.x * w;
        const y = zone.y * h;
        const isFocused = focusedIndexRef.current === index;
        const pulse = isFocused ? 5 + Math.sin(time * 5) * 5 : Math.sin(time * 2.5 + zone.x * 7) * 3;
        const radius = 32 + pulse;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius + 18);
        glow.addColorStop(0, `${zone.color}55`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, radius + 18, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Circle body
        const grad = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
        grad.addColorStop(0, '#ffffff88');
        grad.addColorStop(0.3, zone.color);
        grad.addColorStop(1, zone.color);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // White border / Focus ring
        ctx.strokeStyle = isFocused ? '#8B5CF6' : '#ffffff99';
        ctx.lineWidth = isFocused ? 4.5 : 2.5;
        ctx.stroke();

        // Emoji
        ctx.font = `${26 + pulse * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(zone.emoji, x, y);

        // Text Label
        if (showLabelsRef.current) {
          const labelText = translationsRef.current[zone.module] || zone.module.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          ctx.font = 'bold 18px Nunito, system-ui, sans-serif';
          ctx.textBaseline = 'top';
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 5;
          ctx.lineJoin = 'round';
          ctx.strokeText(labelText, x, y + radius + 12);
          ctx.fillStyle = '#334155';
          ctx.fillText(labelText, x, y + radius + 12);
        }
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Tap handler
    const handleTap = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      let tapX: number, tapY: number;
      if ('touches' in e && e.touches.length > 0) {
        tapX = e.touches[0].clientX - r.left;
        tapY = e.touches[0].clientY - r.top;
      } else {
        tapX = (e as MouseEvent).clientX - r.left;
        tapY = (e as MouseEvent).clientY - r.top;
      }

      for (const zone of ZONES) {
        const zx = zone.x * w;
        const zy = zone.y * h;
        const dist = Math.sqrt((tapX - zx) ** 2 + (tapY - zy) ** 2);
        if (dist < 55) {
          navigate(`/tiny/${zone.module}`);
          return;
        }
      }
    };

    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: false });

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', handleTap);
      canvas.removeEventListener('touchstart', handleTap);
    };
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev === null || prev === ZONES.length - 1) ? 0 : prev + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev === null || prev === 0) ? ZONES.length - 1 : prev - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex !== null) {
        navigate(`/tiny/${ZONES[focusedIndex].module}`);
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-sky-200">
      <div className="sr-only" aria-live="polite">
        {focusedIndex !== null ? t('tiny.focused_screen_reader', `Focused on {{module}}. Press Enter to play.`, { module: ZONES[focusedIndex].module.replace('-', ' ') }) : t('tiny.default_screen_reader', 'Tiny World. Use arrow keys to explore modules.')}
      </div>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocusedIndex(0)}
        onBlur={() => setFocusedIndex(null)}
        aria-label="Interactive map of Tiny World. Use arrow keys to navigate."
        role="application"
        className="w-full h-screen block focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-inset"
        style={{ touchAction: 'none' }}
      />
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <button
        onClick={() => setShowLabels(!showLabels)}
        className="absolute top-6 right-20 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full font-bold text-slate-700 shadow-sm border border-slate-200"
      >
        {showLabels ? t('tiny.hide_labels', 'Hide Labels') : t('tiny.show_labels', 'Show Labels')}
      </button>

      {/* Wonder Garden button */}
      <button
        onClick={() => setShowGarden(true)}
        className="absolute bottom-6 right-6 z-10
                   w-16 h-16 rounded-full
                   bg-green-500 shadow-xl
                   flex items-center justify-center
                   text-3xl select-none
                   active:scale-95 transition-transform"
        aria-label="Wonder Garden"
      >
        🌱
      </button>

      <WonderGarden visible={showGarden} onClose={() => setShowGarden(false)} />
    </div>
  );
}
