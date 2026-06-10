// src/worlds/early/modules/ShadowDetective.tsx
// Drag a torch to change shadow direction/length. Solve challenges.

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { SHADOW_CHALLENGES } from '../data/earlyContent';

export default function ShadowDetective() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const torchRef = useRef({ x: 0.7, y: 0.3 });
  const isDraggingRef = useRef(false);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordShadowChallenge } = useEarlyProgress();
  const { trackCorrect } = useEarlySession();
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const challenge = SHADOW_CHALLENGES[challengeIdx % SHADOW_CHALLENGES.length];

  const checkSolved = useCallback(() => {
    const tx = torchRef.current.x;
    const ty = torchRef.current.y;
    const target = challenge.targetPosition;
    let met = false;
    if (target === 'long-left' && tx > 0.75 && ty > 0.6) met = true;
    if (target === 'short' && Math.abs(tx - 0.5) < 0.15 && ty < 0.25) met = true;
    if (target === 'long-right' && tx < 0.25 && ty > 0.6) met = true;
    if (target === 'gone' && Math.abs(tx - 0.5) < 0.1 && ty < 0.15) met = true;
    return met;
  }, [challenge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const objX = w * 0.5; const objY = h * 0.6;

    const animate = (timestamp: number) => {
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // Night sky
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#1e1b4b'); bg.addColorStop(1, '#312e81');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#374151'; ctx.fillRect(0, h * 0.7, w, h * 0.3);

      // Stars
      for (let i = 0; i < 8; i++) {
        const sx = (Math.sin(i * 2.3 + 0.5) * 0.4 + 0.5) * w;
        const sy = (Math.cos(i * 1.7 + 0.3) * 0.2 + 0.15) * h;
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(time * 2 + i) * 0.2})`;
        ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
      }

      // Torch position
      const tx = torchRef.current.x * w;
      const ty = torchRef.current.y * h;

      // Shadow calculation
      const dx = objX - tx; const dy = objY - ty;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const shadowLen = Math.max(0, (dist / (h * 0.3)) * 80);
      const shadowAngle = Math.atan2(dy, dx) + Math.PI;
      const shadowEndX = objX + Math.cos(shadowAngle) * shadowLen;
      const shadowEndY = objY + Math.sin(shadowAngle) * shadowLen;

      // Draw shadow
      if (shadowLen > 5) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.6, shadowLen / 100);
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(
          (objX + shadowEndX) / 2, Math.min(h * 0.72, (objY + shadowEndY) / 2 + 15),
          shadowLen * 0.5, 12, shadowAngle, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // Object
      ctx.font = '56px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(challenge.objectEmoji, objX, objY);

      // Torch with light cone
      const lightGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, 80);
      lightGrad.addColorStop(0, 'rgba(253,224,71,0.4)'); lightGrad.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(tx, ty, 80, 0, Math.PI * 2); ctx.fillStyle = lightGrad; ctx.fill();

      ctx.font = '36px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🔦', tx, ty);

      // Solved indicator
      if (solved) {
        ctx.fillStyle = 'rgba(74,222,128,0.3)'; ctx.fillRect(0, 0, w, h);
        ctx.font = 'bold 32px sans-serif'; ctx.fillStyle = '#22C55E'; ctx.textAlign = 'center';
        ctx.fillText('✓', w / 2, h * 0.15);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    // Drag
    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if ('touches' in e && e.touches.length > 0) return { x: (e.touches[0].clientX - r.left) / r.width, y: (e.touches[0].clientY - r.top) / r.height };
      return { x: ((e as MouseEvent).clientX - r.left) / r.width, y: ((e as MouseEvent).clientY - r.top) / r.height };
    };
    const handleStart = (e: MouseEvent | TouchEvent) => { e.preventDefault(); const p = getPos(e); if (Math.abs(p.x - torchRef.current.x) < 0.12 && Math.abs(p.y - torchRef.current.y) < 0.12) isDraggingRef.current = true; };
    const handleMove = (e: MouseEvent | TouchEvent) => { if (!isDraggingRef.current) return; e.preventDefault(); const p = getPos(e); torchRef.current = { x: Math.max(0.05, Math.min(0.95, p.x)), y: Math.max(0.05, Math.min(0.95, p.y)) }; };
    const handleEnd = () => { isDraggingRef.current = false; };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [challenge, solved]);

  // Check solution periodically
  useEffect(() => {
    if (solved) return;
    const interval = setInterval(() => {
      if (checkSolved()) {
        setSolved(true);
        pip.celebrate();
        recordShadowChallenge();
        trackCorrect('shadow-detective', { challenge: challenge.id });
        setSolvedCount(c => c + 1);
        if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
      }
    }, 500);
    return () => clearInterval(interval);
  }, [solved, checkSolved, pip, recordShadowChallenge, trackCorrect, challenge, soundEnabled]);

  const handleNext = () => { setChallengeIdx(p => p + 1); setSolved(false); torchRef.current = { x: 0.7, y: 0.3 }; pip.sayCustom("Next shadow challenge!", 'excited'); };

  const targetLabels = { 'long-left': '📏 Make shadow long (left)', 'short': '📐 Make shadow short', 'long-right': '➡️ Make shadow point right', 'gone': '✨ Make shadow disappear' };

  return (
    <EarlyShell module="shadow-detective">
      <div className="min-h-screen bg-indigo-950 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-700">
            <div className="flex items-center gap-3"><span className="text-3xl">{t('early.modules.ShadowDetective.spn_', '🐤🔦')}</span>
              <div><p className="text-base font-bold text-indigo-200">{targetLabels[challenge.targetPosition]}</p>
                <p className="text-sm text-indigo-400"><Trans i18nKey="auto.shadowdetective.drag_the_torch">Drag the torch! ·</Trans> {solvedCount}/{SHADOW_CHALLENGES.length} <Trans i18nKey="auto.shadowdetective.solved">solved</Trans></p></div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="w-full flex-1 block" style={{ touchAction: 'none' }} />

        {solved && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 pb-24 pt-4">
            <button onClick={handleNext} className="w-full py-4 bg-indigo-600 text-white font-bold text-xl rounded-2xl min-h-[56px]">{t('early.modules.ShadowDetective.btn_NextChalle', 'Next Challenge 🔦')}</button>
          </motion.div>
        )}
      </div>
    </EarlyShell>
  );
}
