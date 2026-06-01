// src/worlds/physics/components/ParticleAccelerator.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  charge: number;
  mass: number;
  trail: { x: number; y: number }[];
  collided: boolean;
}

interface CollisionEvent {
  id: number;
  x: number;
  y: number;
  energy: number;
  particles: string[];
  timestamp: number;
}

const PARTICLE_TYPES = [
  { name: 'Proton', emoji: '🔴', charge: 1, mass: 1, color: '#ef4444' },
  { name: 'Electron', emoji: '🔵', charge: -1, mass: 0.001, color: '#3b82f6' },
  { name: 'Alpha', emoji: '🟡', charge: 2, mass: 4, color: '#eab308' },
  { name: 'Positron', emoji: '🟢', charge: 1, mass: 0.001, color: '#22c55e' },
];

const DISCOVERY_TABLE: Record<string, { name: string; emoji: string; description: string; minEnergy: number }> = {
  higgs: { name: 'Higgs Boson', emoji: '✨', description: 'The God Particle! Gives mass to all particles.', minEnergy: 80 },
  top_quark: { name: 'Top Quark', emoji: '🔷', description: 'Heaviest elementary particle discovered.', minEnergy: 60 },
  w_boson: { name: 'W Boson', emoji: '⚡', description: 'Carrier of weak nuclear force.', minEnergy: 40 },
  z_boson: { name: 'Z Boson', emoji: '🌀', description: 'Neutral carrier of weak force.', minEnergy: 45 },
  gluon: { name: 'Gluon', emoji: '🔗', description: 'Binds quarks together inside protons.', minEnergy: 30 },
  muon: { name: 'Muon', emoji: '💫', description: 'Heavy cousin of the electron.', minEnergy: 20 },
  pion: { name: 'Pion', emoji: '🎯', description: 'Lightest meson, mediates nuclear force.', minEnergy: 15 },
  photon: { name: 'High-E Photon', emoji: '💡', description: 'Gamma ray from collision energy.', minEnergy: 10 },
};

export default function ParticleAccelerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [collisions, setCollisions] = useState<CollisionEvent[]>([]);
  const [energy, setEnergy] = useState(50);
  const [magneticField, setMagneticField] = useState(3);
  const [particleType, setParticleType] = useState(0);
  const [beamIntensity, setBeamIntensity] = useState(5);
  const [time, setTime] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('physics_discoveries') || '[]'); } catch { return []; }
  });
  const [showDiscovery, setShowDiscovery] = useState<{name: string; emoji: string; description: string} | null>(null);

  const addParticle = useCallback(() => {
    const type = PARTICLE_TYPES[particleType];
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: 350,
      y: 200,
      vx: (Math.random() - 0.5) * energy * 0.1,
      vy: -energy * 0.15,
      energy,
      charge: type.charge,
      mass: type.mass,
      trail: [],
      collided: false,
    };
    setParticles(prev => [...prev.slice(-50), newParticle]);
  }, [energy, particleType]);

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < beamIntensity; i++) addParticle();
    }, 200);
    return () => clearInterval(interval);
  }, [addParticle, beamIntensity]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Accelerator ring
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.arc(cx, cy, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Magnetic field lines
    if (magneticField > 0) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${magneticField * 0.05})`;
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, 150 + i * 10, angle, angle + 0.3);
        ctx.stroke();
      }
    }

    // Particles
    particles.forEach(p => {
      // Trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 200, 255, 0.3)`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.stroke();
      }

      // Particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + p.energy * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = p.charge > 0 ? '#ef4444' : '#3b82f6';
      ctx.fill();
      ctx.shadowColor = p.charge > 0 ? '#ef4444' : '#3b82f6';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Collision effects
    collisions.forEach(c => {
      const age = Date.now() - c.timestamp;
      if (age < 2000) {
        const alpha = 1 - age / 2000;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 20 + age * 0.05, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 100, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Discovery flash
    if (showDiscovery) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(cx - 150, cy - 60, 300, 120);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 150, cy - 60, 300, 120);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${showDiscovery.emoji} ${showDiscovery.name}!`, cx, cy - 20);
      ctx.fillStyle = '#888';
      ctx.font = '12px sans-serif';
      ctx.fillText(showDiscovery.description, cx, cy + 10);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('+50 XP Discovery Bonus!', cx, cy + 35);
    }

    // Stats panel
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 100);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚛️ Particle Accelerator', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Energy: ${energy} GeV`, 20, 50);
    ctx.fillText(`Particles: ${particles.length}`, 20, 65);
    ctx.fillText(`Collisions: ${collisions.length}`, 20, 80);
    ctx.fillText(`Discoveries: ${discovered.length}/8`, 20, 95);
  }, [particles, collisions, energy, magneticField, showDiscovery, discovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    let t = time;
    const animate = () => {
      t += 0.016;
      setTime(t);

      setParticles(prev => {
        const updated = prev.map(p => {
          if (p.collided) return p;

          // Magnetic field deflection
          const bx = -p.vy * magneticField * 0.02 * p.charge;
          const by = p.vx * magneticField * 0.02 * p.charge;

          let nx = p.x + p.vx + bx;
          let ny = p.y + p.vy + by;

          // Keep in bounds
          if (nx < 50 || nx > 650) { nx = Math.max(50, Math.min(650, nx)); }
          if (ny < 50 || ny > 350) { ny = Math.max(50, Math.min(350, ny)); }

          return { ...p, x: nx, y: ny, trail: [...p.trail.slice(-20), { x: nx, y: ny }] };
        });

        // Check collisions
        const newCollisions: CollisionEvent[] = [];
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];
            if (a.collided || b.collided) continue;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 15) {
              a.collided = true;
              b.collided = true;
              const totalEnergy = a.energy + b.energy;
              const cx = (a.x + b.x) / 2;
              const cy = (a.y + b.y) / 2;
              newCollisions.push({ id: Date.now(), x: cx, y: cy, energy: totalEnergy, particles: ['p', 'p'], timestamp: Date.now() });

              // Check for discoveries
              for (const [key, disc] of Object.entries(DISCOVERY_TABLE)) {
                if (totalEnergy >= disc.minEnergy && !discovered.includes(key)) {
                  setShowDiscovery({ name: disc.name, emoji: disc.emoji, description: disc.description });
                  setDiscovered(prev => {
                    const next = [...prev, key];
                    localStorage.setItem('physics_discoveries', JSON.stringify(next));
                    return next;
                  });
                  setTimeout(() => setShowDiscovery(null), 3000);
                  const updated2 = completeModule(progress, 'particle-accelerator', 100);
                  setProgress(updated2);
                  saveProgress(updated2);
                  break;
                }
              }
            }
          }
        }

        if (newCollisions.length > 0) {
          setCollisions(prev => [...prev.slice(-10), ...newCollisions]);
        }

        return updated.filter(p => !p.collided || p.trail.length < 30);
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [magneticField, energy, discovered, progress]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'particle-accelerator', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="particle-accelerator" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">⚛️ Particle Accelerator</h2>
          <p className="text-sm text-gray-400">Smash particles together to discover new fundamental particles!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Energy: {energy} GeV</label><input type="range" min="10" max="100" value={energy} onChange={e => setEnergy(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><label className="text-sm text-gray-400">Magnetic Field: {magneticField}T</label><input type="range" min="0" max="10" value={magneticField} onChange={e => setMagneticField(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><label className="text-sm text-gray-400">Beam Intensity: {beamIntensity}</label><input type="range" min="1" max="10" value={beamIntensity} onChange={e => setBeamIntensity(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Particle Type:</label>
              <div className="grid grid-cols-2 gap-2">
                {PARTICLE_TYPES.map((p, idx) => (
                  <button key={idx} onClick={() => setParticleType(idx)} className={`py-2 rounded-lg text-sm font-bold ${particleType === idx ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{p.emoji} {p.name}</button>
                ))}
              </div>
            </div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Higher energy = rarer particles</p>
              <p>🔥 Magnetic field bends particle paths</p>
              <p>🎯 Try to discover all 8 particles!</p>
            </div>
          </div>
        </div>

        {/* Discovery Log */}
        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-cyan-500/20">
          <h3 className="text-lg font-bold text-cyan-400 mb-3">🔬 Discovery Log ({discovered.length}/8)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(DISCOVERY_TABLE).map(([key, disc]) => (
              <div key={key} className={`p-3 rounded-xl border ${discovered.includes(key) ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-800 border-gray-700 opacity-50'}`}>
                <span className="text-2xl">{discovered.includes(key) ? disc.emoji : '❓'}</span>
                <p className="text-sm font-bold text-white mt-1">{discovered.includes(key) ? disc.name : '???'}</p>
                <p className="text-sm text-gray-500">{disc.minEnergy}+ GeV</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
