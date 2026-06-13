// src/worlds/physics/components/InclinedPlane.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function InclinedPlane() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [friction, setFriction] = useState(0.2);
  const [boxPos, setBoxPos] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [acceleration, setAcceleration] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const rad = (angle * Math.PI) / 180;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Incline
    const baseY = h - 60;
    const inclineLen = 600;
    const topX = 80;
    const topY = baseY - inclineLen * Math.sin(rad);
    const bottomX = topX + inclineLen * Math.cos(rad);

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX, baseY);
    ctx.lineTo(topX, baseY);
    ctx.closePath();
    ctx.fillStyle = '#1a2a3a';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle arc
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.5)';
    ctx.lineWidth = 1;
    ctx.arc(topX, baseY, 50, -rad, 0);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${angle}°`, topX + 55, baseY - 10);

    // Box on incline
    const boxSize = 25 + mass * 3;
    const progress = boxPos / 100;
    const bx = topX + progress * (bottomX - topX);
    const by = topY + progress * (baseY - topY);

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(rad);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-boxSize / 2, -boxSize, boxSize, boxSize);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(-boxSize / 2, -boxSize, boxSize, boxSize);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass}kg`, 0, -boxSize / 2 + 4);
    ctx.restore();

    // Force vectors
    const g = 9.8;
    const mgSinTheta = mass * g * Math.sin(rad);
    const mgCosTheta = mass * g * Math.cos(rad);
    const fFriction = friction * mgCosTheta;

    // Gravity component (down the slope)
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(rad);
    ctx.moveTo(0, -boxSize / 2);
    ctx.lineTo(mgSinTheta * 2, -boxSize / 2);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.font = '9px sans-serif';
    ctx.fillText(`mgsinθ=${mgSinTheta.toFixed(1)}N`, mgSinTheta * 2 + 5, -boxSize / 2 + 3);

    // Friction (up the slope)
    if (velocity > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.moveTo(0, -boxSize / 2);
      ctx.lineTo(-fFriction * 2, -boxSize / 2);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`f=${fFriction.toFixed(1)}N`, -fFriction * 2 - 5, -boxSize / 2 + 3);
    }
    ctx.restore();

    // Stats
    const netForce = mgSinTheta - fFriction;
    const a = netForce / mass;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText(`a = ${a.toFixed(2)} m/s²`, 20, 30);
    ctx.fillText(`v = ${velocity.toFixed(2)} m/s`, 20, 45);
    ctx.fillText(`F_net = ${netForce.toFixed(1)} N`, 20, 60);
    ctx.fillText(`Position: ${boxPos.toFixed(0)}%`, 20, 75);
  }, [angle, mass, friction, boxPos, velocity, acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    const rad = (angle * Math.PI) / 180;
    const g = 9.8;
    let pos = boxPos;
    let vel = velocity;
    const dt = 0.016;

    const animate = () => {
      const mgSinTheta = mass * g * Math.sin(rad);
      const mgCosTheta = mass * g * Math.cos(rad);
      const fFriction = friction * mgCosTheta;
      const netForce = mgSinTheta - fFriction;
      const a = Math.max(0, netForce / mass);

      vel += a * dt * 5;
      pos += vel * dt * 5;

      if (pos >= 100) { pos = 100; vel = 0; setIsRunning(false); }

      setBoxPos(pos);
      setVelocity(vel);
      setAcceleration(a);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, angle, mass, friction]);

  const handleStart = () => {
    setBoxPos(0);
    setVelocity(0);
    setIsRunning(true);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'inclined-plane', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="inclined-plane" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">📐 Inclined Plane Explorer</h2>
          <p className="text-sm text-gray-400">See how angle, mass, and friction affect acceleration down a slope.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Angle: {angle}°</label>
              <input type="range" min="5" max="75" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Mass: {mass} kg</label>
              <input type="range" min="1" max="20" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Friction: {friction}</label>
              <input type="range" min="0" max="1" step="0.05" value={friction} onChange={e => setFriction(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <button onClick={handleStart} disabled={isRunning} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm">▶ Release</button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 a = g(sin θ - μcos θ)</p>
              <p>🔥 Mass doesn't affect acceleration!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
