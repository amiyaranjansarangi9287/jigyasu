import { useRef, useEffect } from 'react';

interface PhotosynthesisCanvasProps {
  sunIntensity: number;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'photon' | 'co2' | 'o2' | 'glucose' | 'water';
  alpha: number;
  scale: number;
  absorbed?: boolean;
}

export default function PhotosynthesisCanvas({ sunIntensity, isPlaying }: PhotosynthesisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const sunIntensityRef = useRef(sunIntensity);
  const isPlayingRef = useRef(isPlaying);
  const lastSpawnRef = useRef(0);
  const glucoseCountRef = useRef(0);
  const o2CountRef = useRef(0);

  useEffect(() => {
    sunIntensityRef.current = sunIntensity;
  }, [sunIntensity]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Leaf structure
    const leafCenterX = w * 0.5;
    const leafCenterY = h * 0.55;
    const leafWidth = w * 0.5;
    const leafHeight = h * 0.35;

    // Chloroplast positions (inside leaf)
    const chloroplasts = [
      { x: leafCenterX - leafWidth * 0.25, y: leafCenterY - leafHeight * 0.1 },
      { x: leafCenterX + leafWidth * 0.1, y: leafCenterY - leafHeight * 0.15 },
      { x: leafCenterX - leafWidth * 0.1, y: leafCenterY + leafHeight * 0.15 },
      { x: leafCenterX + leafWidth * 0.25, y: leafCenterY + leafHeight * 0.1 },
      { x: leafCenterX, y: leafCenterY },
    ];

    const spawnPhoton = () => {
      const startX = Math.random() * w * 0.6 + w * 0.2;
      particlesRef.current.push({
        x: startX,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 2 + Math.random() * 2,
        type: 'photon',
        alpha: 1,
        scale: 0.8 + Math.random() * 0.4,
      });
    };

    const spawnCO2 = () => {
      particlesRef.current.push({
        x: -20,
        y: leafCenterY + (Math.random() - 0.5) * leafHeight * 0.5,
        vx: 1 + Math.random() * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        type: 'co2',
        alpha: 1,
        scale: 1,
      });
    };

    const spawnWater = () => {
      particlesRef.current.push({
        x: leafCenterX + (Math.random() - 0.5) * leafWidth * 0.3,
        y: h + 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -1.5 - Math.random() * 0.5,
        type: 'water',
        alpha: 1,
        scale: 0.8,
      });
    };

    const spawnO2 = (x: number, y: number) => {
      particlesRef.current.push({
        x,
        y,
        vx: 1.5 + Math.random() * 1,
        vy: -0.5 - Math.random() * 1,
        type: 'o2',
        alpha: 1,
        scale: 1,
      });
      o2CountRef.current++;
    };

    const spawnGlucose = (x: number, y: number) => {
      particlesRef.current.push({
        x,
        y,
        vx: 0,
        vy: 1,
        type: 'glucose',
        alpha: 1,
        scale: 1.2,
      });
      glucoseCountRef.current++;
    };

    const drawLeaf = () => {
      // Leaf shadow
      ctx.save();
      ctx.translate(5, 5);
      ctx.beginPath();
      ctx.ellipse(leafCenterX, leafCenterY, leafWidth / 2, leafHeight / 2, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();
      ctx.restore();

      // Main leaf shape
      const leafGrad = ctx.createRadialGradient(
        leafCenterX - leafWidth * 0.2,
        leafCenterY - leafHeight * 0.2,
        0,
        leafCenterX,
        leafCenterY,
        leafWidth * 0.6
      );
      leafGrad.addColorStop(0, '#4ade80');
      leafGrad.addColorStop(0.5, '#22c55e');
      leafGrad.addColorStop(1, '#15803d');

      ctx.beginPath();
      ctx.ellipse(leafCenterX, leafCenterY, leafWidth / 2, leafHeight / 2, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = leafGrad;
      ctx.fill();

      // Leaf vein
      ctx.beginPath();
      ctx.moveTo(leafCenterX - leafWidth * 0.4, leafCenterY);
      ctx.quadraticCurveTo(leafCenterX, leafCenterY - 5, leafCenterX + leafWidth * 0.4, leafCenterY);
      ctx.strokeStyle = 'rgba(21, 128, 61, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Side veins
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        ctx.beginPath();
        ctx.moveTo(leafCenterX + i * leafWidth * 0.12, leafCenterY);
        ctx.quadraticCurveTo(
          leafCenterX + i * leafWidth * 0.2,
          leafCenterY - leafHeight * 0.15 * Math.sign(i),
          leafCenterX + i * leafWidth * 0.15,
          leafCenterY - leafHeight * 0.3 * Math.sign(i)
        );
        ctx.strokeStyle = 'rgba(21, 128, 61, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw chloroplasts
      chloroplasts.forEach((cp) => {
        const cpGrad = ctx.createRadialGradient(cp.x - 3, cp.y - 3, 0, cp.x, cp.y, 15);
        cpGrad.addColorStop(0, '#86efac');
        cpGrad.addColorStop(0.5, '#4ade80');
        cpGrad.addColorStop(1, '#22c55e');
        
        ctx.beginPath();
        ctx.ellipse(cp.x, cp.y, 15, 10, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = cpGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.scale(p.scale, p.scale);

      switch (p.type) {
        case 'photon': {
          // Yellow light ray
          const photonGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
          photonGrad.addColorStop(0, 'rgba(253, 224, 71, 1)');
          photonGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.6)');
          photonGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fillStyle = photonGrad;
          ctx.fill();
          // Core
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.fill();
          break;
        }

        case 'co2':
          // CO2 molecule (gray)
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(-6, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(6, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 6px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('C', 0, 0);
          break;

        case 'o2': {
          // O2 molecule (light blue bubble)
          const o2Grad = ctx.createRadialGradient(-2, -2, 0, 0, 0, 10);
          o2Grad.addColorStop(0, 'rgba(147, 197, 253, 0.9)');
          o2Grad.addColorStop(0.7, 'rgba(96, 165, 250, 0.7)');
          o2Grad.addColorStop(1, 'rgba(59, 130, 246, 0.5)');
          ctx.beginPath();
          ctx.arc(-5, 0, 7, 0, Math.PI * 2);
          ctx.fillStyle = o2Grad;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(5, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = 'bold 5px sans-serif';
          ctx.fillText('O₂', 0, 0);
          break;
        }

        case 'water':
          // H2O (blue drop)
          ctx.fillStyle = '#60a5fa';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#93c5fd';
          ctx.beginPath();
          ctx.arc(-1, -1, 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'glucose':
          // Glucose (hexagon, amber)
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 10;
            const y = Math.sin(angle) * 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 6px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('G', 0, 1);
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Sky gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
      skyGrad.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Sun glow (top right)
      const sunX = w - 60;
      const sunY = 50;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
      sunGlow.addColorStop(0, `rgba(253, 224, 71, ${sunIntensityRef.current * 0.4})`);
      sunGlow.addColorStop(0.5, `rgba(250, 204, 21, ${sunIntensityRef.current * 0.2})`);
      sunGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun core
      const sunCore = ctx.createRadialGradient(sunX - 5, sunY - 5, 0, sunX, sunY, 25);
      sunCore.addColorStop(0, '#fef9c3');
      sunCore.addColorStop(0.5, '#fde047');
      sunCore.addColorStop(1, '#facc15');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
      ctx.fillStyle = sunCore;
      ctx.fill();

      // Draw leaf
      drawLeaf();

      // Labels
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('CO₂ enters →', 10, leafCenterY - 30);
      ctx.textAlign = 'right';
      ctx.fillText('→ O₂ released', w - 10, leafCenterY - leafHeight * 0.3);
      ctx.textAlign = 'center';
      ctx.fillText('☀️ Sunlight (photons)', w / 2, 25);
      ctx.fillText('💧 H₂O from roots', leafCenterX, h - 15);

      // Spawn particles
      const now = Date.now();
      if (isPlayingRef.current && now - lastSpawnRef.current > 300 / sunIntensityRef.current) {
        lastSpawnRef.current = now;
        
        // Spawn based on intensity
        if (Math.random() < sunIntensityRef.current) spawnPhoton();
        if (Math.random() < 0.3) spawnCO2();
        if (Math.random() < 0.3) spawnWater();
      }

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        if (isPlayingRef.current) {
          p.x += p.vx;
          p.y += p.vy;
        }

        // Check for absorption in chloroplast (for photons, CO2, water)
        if ((p.type === 'photon' || p.type === 'co2' || p.type === 'water') && !p.absorbed) {
          for (const cp of chloroplasts) {
            const dx = p.x - cp.x;
            const dy = p.y - cp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) {
              p.absorbed = true;
              p.alpha = 0;
              
              // Chance to produce O2 and glucose
              if (p.type === 'photon' && Math.random() < 0.4) {
                spawnO2(cp.x + 10, cp.y);
              }
              if (p.type === 'co2' && Math.random() < 0.3) {
                spawnGlucose(cp.x, cp.y + 20);
              }
            }
          }
        }

        // Fade out when leaving screen or absorbed
        if (p.type === 'o2' && p.x > w) p.alpha -= 0.05;
        if (p.type === 'glucose' && p.y > h - 30) p.alpha -= 0.02;
        if (p.type === 'photon' && p.y > h) p.alpha = 0;
        if (p.type === 'co2' && p.x > leafCenterX + leafWidth * 0.5) p.alpha -= 0.05;
        if (p.type === 'water' && p.y < leafCenterY - leafHeight * 0.3) p.alpha -= 0.05;

        // Remove dead particles
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(p);
      }

      // Stats display
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(10, h - 50, 100, 35, 8);
      ctx.fill();
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`O₂: ${o2CountRef.current}`, 20, h - 32);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`Glucose: ${glucoseCountRef.current}`, 20, h - 18);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
