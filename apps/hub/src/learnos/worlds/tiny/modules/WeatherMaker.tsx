// src/worlds/tiny/modules/WeatherMaker.tsx
// Module 6: Tap weather buttons to change the scene. Bear companion reacts.
// Zero text in child UI. Visual-only weather buttons.

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { WEATHER_CONTENT, type WeatherType } from '../data/tinyContent';

interface Raindrop { x: number; y: number; len: number; speed: number }
interface Snowflake { x: number; y: number; r: number; speed: number; drift: number; phase: number }
interface WindLine { x: number; y: number; len: number; speed: number; curve: number }

export default function WeatherMaker() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const weatherRef = useRef<WeatherType>('sun');
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('sun');
  const rainRef = useRef<Raindrop[]>([]);
  const snowRef = useRef<Snowflake[]>([]);
  const windRef = useRef<WindLine[]>([]);
  const puddleRef = useRef(0.3);
  const snowDepthRef = useRef(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordWeather } = useTinyProgress();

  const companion = useCompanion({ type: 'bear', x: 0.88, y: 0.80, size: 56 });

  const changeWeather = useCallback((w: WeatherType) => {
    weatherRef.current = w;
    setCurrentWeather(w);
    rainRef.current = []; snowRef.current = []; windRef.current = [];
    if (soundEnabled) {
      try {
        WEATHER_CONTENT[w].ambientSoundFreqs.forEach((freq, i) => {
          setTimeout(() => AudioEngine.playTone({ frequency: freq, type: 'sine', duration: 0.4, volume: 0.15, attack: 0.1, decay: 0.2 }), i * 150);
        });
      } catch (_) { /* silent */ }
    }
    const emotions = { snow: 'surprised', rain: 'curious', sun: 'happy', wind: 'excited' } as const;
    companion.setEmotion(emotions[w], 2000);
    recordWeather(w);
  }, [soundEnabled, companion, recordWeather]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const groundY = h * 0.72;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;
      const weather = weatherRef.current;
      ctx.clearRect(0, 0, w, h);

      // Sky
      const sc = WEATHER_CONTENT[weather].skyColors;
      const skyG = ctx.createLinearGradient(0, 0, 0, groundY);
      skyG.addColorStop(0, sc[0]); skyG.addColorStop(1, sc[1]);
      ctx.fillStyle = skyG; ctx.fillRect(0, 0, w, groundY);

      // Sun
      if (weather === 'sun') {
        ctx.beginPath(); ctx.arc(w * 0.18, h * 0.18, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#FDE047'; ctx.fill();
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + time * 0.5;
          ctx.beginPath(); ctx.moveTo(w * 0.18 + Math.cos(a) * 36, h * 0.18 + Math.sin(a) * 36);
          ctx.lineTo(w * 0.18 + Math.cos(a) * 50, h * 0.18 + Math.sin(a) * 50);
          ctx.strokeStyle = 'rgba(253,224,71,0.6)'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🦋', w * 0.5 + Math.sin(time * 1.5) * 60, groundY - 60 + Math.cos(time * 2) * 20);
      }

      // Clouds (non-sunny)
      if (weather !== 'sun') {
        ctx.fillStyle = weather === 'snow' ? 'rgba(220,220,230,0.9)' : 'rgba(150,160,170,0.85)';
        [[w * 0.55, h * 0.12, 35], [w * 0.62, h * 0.10, 28], [w * 0.7, h * 0.13, 32]].forEach(([cx, cy, r]) => {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        });
      }

      // Rain
      if (weather === 'rain') {
        if (rainRef.current.length < 80) for (let i = 0; i < 3; i++) {
          rainRef.current.push({ x: Math.random() * w, y: -10, len: 10 + Math.random() * 15, speed: 300 + Math.random() * 150 });
        }
        rainRef.current = rainRef.current.filter(d => d.y < h + d.len);
        rainRef.current.forEach(d => {
          d.y += d.speed * dt; d.x -= d.speed * 0.1 * dt;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.len * 0.1, d.y + d.len);
          ctx.strokeStyle = 'rgba(96,165,250,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
        });
        puddleRef.current = Math.min(0.9, puddleRef.current + dt * 0.05);
      }

      // Snow
      if (weather === 'snow') {
        if (snowRef.current.length < 60) snowRef.current.push({
          x: Math.random() * w, y: -10, r: 2 + Math.random() * 5,
          speed: 40 + Math.random() * 40, drift: (Math.random() - 0.5) * 20, phase: Math.random() * Math.PI * 2,
        });
        snowRef.current = snowRef.current.filter(s => s.y < h);
        snowRef.current.forEach(f => {
          f.y += f.speed * dt; f.phase += dt; f.x += Math.sin(f.phase) * f.drift * dt;
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(241,245,249,0.8)'; ctx.fill();
        });
        snowDepthRef.current = Math.min(1, snowDepthRef.current + dt * 0.02);
        ctx.fillStyle = `rgba(241,245,249,${snowDepthRef.current * 0.8})`;
        ctx.fillRect(0, groundY, w, 20);
      } else { snowDepthRef.current = Math.max(0, snowDepthRef.current - dt * 0.05); }

      // Wind
      if (weather === 'wind') {
        if (windRef.current.length < 25) windRef.current.push({
          x: -20, y: Math.random() * (groundY - 20), len: 40 + Math.random() * 60,
          speed: 200 + Math.random() * 150, curve: (Math.random() - 0.5) * 20,
        });
        windRef.current = windRef.current.filter(l => l.x < w + l.len);
        windRef.current.forEach(l => {
          l.x += l.speed * dt;
          ctx.beginPath(); ctx.moveTo(l.x, l.y);
          ctx.quadraticCurveTo(l.x + l.len / 2, l.y + l.curve, l.x + l.len, l.y);
          ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
        });
        ctx.font = '32px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🪁', w * 0.5 + Math.sin(time * 2) * 30, h * 0.2 + Math.cos(time * 1.5) * 20);
      }

      if (weather === 'sun') puddleRef.current = Math.max(0.1, puddleRef.current - dt * 0.03);

      // Ground
      const gG = ctx.createLinearGradient(0, groundY, 0, h);
      gG.addColorStop(0, '#65A30D'); gG.addColorStop(1, '#374151');
      ctx.fillStyle = gG; ctx.fillRect(0, groundY, w, h - groundY);

      // Tree
      const treeX = w * 0.25;
      const sway = weather === 'wind' ? Math.sin(time * 3) * 8 : 0;
      ctx.fillStyle = '#78350F'; ctx.fillRect(treeX - 6, groundY - 90, 12, 90);
      ctx.fillStyle = '#15803D';
      [[0, -110, 32], [-15, -85, 22], [15, -85, 22]].forEach(([dx, dy, r]) => {
        ctx.beginPath(); ctx.arc(treeX + dx + sway, groundY + dy, r, 0, Math.PI * 2); ctx.fill();
      });
      if (snowDepthRef.current > 0) {
        ctx.fillStyle = `rgba(241,245,249,${Math.min(snowDepthRef.current, 0.8)})`;
        ctx.beginPath(); ctx.arc(treeX + sway, groundY - 118, 24, Math.PI, Math.PI * 2); ctx.fill();
      }

      // House
      const hX = w * 0.72;
      ctx.fillStyle = '#FEF3C7'; ctx.fillRect(hX - 35, groundY - 70, 70, 70);
      ctx.fillStyle = '#DC2626'; ctx.beginPath();
      ctx.moveTo(hX - 45, groundY - 70); ctx.lineTo(hX, groundY - 120); ctx.lineTo(hX + 45, groundY - 70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#92400E'; ctx.fillRect(hX - 10, groundY - 35, 20, 35);
      const gloomy = weather === 'rain' || weather === 'snow';
      ctx.fillStyle = gloomy ? 'rgba(254,243,199,0.9)' : 'rgba(147,197,253,0.6)';
      ctx.fillRect(hX + 12, groundY - 58, 16, 14); ctx.fillRect(hX - 28, groundY - 58, 16, 14);

      // Puddle
      const pW = w * 0.12 * puddleRef.current;
      const pH = h * 0.02 * puddleRef.current;
      ctx.beginPath(); ctx.ellipse(w * 0.48, groundY + 10, pW, pH, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6'; ctx.fill();

      // Snow scene extras
      if (weather === 'snow' && snowDepthRef.current > 0.5) {
        ctx.save(); ctx.globalAlpha = Math.min(1, snowDepthRef.current * 2);
        ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('⛄', w * 0.42, groundY - 15);
        ctx.restore();
      }
      if (weather === 'rain') { ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🪱', w * 0.42, groundY + 12); }

      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🐻');
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [companion]);

  return (
    <TinyShell module="weather-maker">
      <div className="relative w-full h-screen">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {(['sun', 'rain', 'snow', 'wind'] as WeatherType[]).map((wt) => (
            <motion.button
              key={wt}
              onClick={() => changeWeather(wt)}
              whileTap={{ scale: 0.9 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all duration-300 ${
                currentWeather === wt ? 'bg-white scale-110 shadow-2xl ring-4 ring-white/50' : 'bg-white/50 backdrop-blur-sm'
              }`}
              aria-label={wt}
            >
              {WEATHER_CONTENT[wt].emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </TinyShell>
  );
}
