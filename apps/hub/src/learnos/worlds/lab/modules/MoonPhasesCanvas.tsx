import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MoonPhasesCanvasProps {
  phase: number; // 0-7 representing 8 phases
  showOrbit: boolean;
}

export default function MoonPhasesCanvas({ phase, showOrbit }: MoonPhasesCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const phaseRef = useRef(phase);
  const showOrbitRef = useRef(showOrbit);
  const starsRef = useRef<{ x: number; y: number; r: number; twinkle: number }[]>([]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    showOrbitRef.current = showOrbit;
  }, [showOrbit]);

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

    // Generate stars
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    const phaseNames = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Space background
      const spaceGrad = ctx.createLinearGradient(0, 0, w, h);
      spaceGrad.addColorStop(0, '#0f172a');
      spaceGrad.addColorStop(0.5, '#1e1b4b');
      spaceGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      starsRef.current.forEach(star => {
        const twinkle = 0.4 + Math.sin(Date.now() * 0.003 + star.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      });

      const currentPhase = phaseRef.current;

      if (showOrbitRef.current) {
        // Orbital view - show Earth, Moon, and Sun positions
        const centerX = w / 2;
        const centerY = h / 2;
        const orbitRadius = Math.min(w, h) * 0.32;

        // Sun (on the right side)
        const sunX = w - 50;
        const sunY = h / 2;
        
        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 100);
        sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.1)');
        sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.beginPath();
        ctx.arc(sunX, sunY, 100, 0, Math.PI * 2);
        ctx.fillStyle = sunGlow;
        ctx.fill();

        // Sun rays
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(sunX - 30, sunY - 80);
        ctx.lineTo(0, sunY);
        ctx.lineTo(sunX - 30, sunY + 80);
        ctx.closePath();
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.restore();

        // Sun
        const sunGrad = ctx.createRadialGradient(sunX - 5, sunY - 5, 0, sunX, sunY, 30);
        sunGrad.addColorStop(0, '#fef9c3');
        sunGrad.addColorStop(0.5, '#fde047');
        sunGrad.addColorStop(1, '#f59e0b');
        ctx.beginPath();
        ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('☀️ SUN', sunX, sunY + 50);

        // Earth
        const earthGrad = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, 25);
        earthGrad.addColorStop(0, '#60a5fa');
        earthGrad.addColorStop(0.7, '#3b82f6');
        earthGrad.addColorStop(1, '#1d4ed8');
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fillStyle = earthGrad;
        ctx.fill();
        
        // Earth continents
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(centerX - 8, centerY - 5, 8, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 5, centerY + 8, 6, 4, -0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🌍 EARTH', centerX, centerY + 45);

        // Moon orbit path
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Moon position based on phase
        const moonAngle = (currentPhase / 8) * Math.PI * 2 - Math.PI / 2;
        const moonX = centerX + Math.cos(moonAngle) * orbitRadius;
        const moonY = centerY + Math.sin(moonAngle) * orbitRadius;

        // Moon
        ctx.beginPath();
        ctx.arc(moonX, moonY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();

        // Moon shadow (based on sun direction)
        const sunAngle = Math.atan2(sunY - moonY, sunX - moonX);
        ctx.beginPath();
        ctx.arc(moonX, moonY, 15, sunAngle + Math.PI / 2, sunAngle - Math.PI / 2);
        ctx.fillStyle = '#334155';
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🌙 MOON', moonX, moonY + 30);

        // Person on Earth
        const personAngle = Math.PI / 4;
        const personX = centerX + Math.cos(personAngle) * 20;
        const personY = centerY + Math.sin(personAngle) * 20;
        ctx.font = '12px sans-serif';
        ctx.fillText('🧑', personX, personY);

      } else {
        // Moon close-up view
        const moonCenterX = w / 2;
        const moonCenterY = h / 2;
        const moonRadius = Math.min(w, h) * 0.35;

        // Moon glow
        const moonGlow = ctx.createRadialGradient(moonCenterX, moonCenterY, moonRadius, moonCenterX, moonCenterY, moonRadius + 30);
        moonGlow.addColorStop(0, 'rgba(226, 232, 240, 0.3)');
        moonGlow.addColorStop(1, 'rgba(226, 232, 240, 0)');
        ctx.beginPath();
        ctx.arc(moonCenterX, moonCenterY, moonRadius + 30, 0, Math.PI * 2);
        ctx.fillStyle = moonGlow;
        ctx.fill();

        // Moon base (lit part)
        ctx.beginPath();
        ctx.arc(moonCenterX, moonCenterY, moonRadius, 0, Math.PI * 2);
        const moonGrad = ctx.createRadialGradient(moonCenterX - 20, moonCenterY - 20, 0, moonCenterX, moonCenterY, moonRadius);
        moonGrad.addColorStop(0, '#f8fafc');
        moonGrad.addColorStop(0.5, '#e2e8f0');
        moonGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = moonGrad;
        ctx.fill();

        // Moon craters
        const craters = [
          { x: -0.2, y: -0.3, r: 0.12 },
          { x: 0.3, y: -0.1, r: 0.08 },
          { x: -0.1, y: 0.25, r: 0.1 },
          { x: 0.2, y: 0.35, r: 0.06 },
          { x: -0.35, y: 0.1, r: 0.07 },
        ];
        
        craters.forEach(crater => {
          const cx = moonCenterX + crater.x * moonRadius;
          const cy = moonCenterY + crater.y * moonRadius;
          const cr = crater.r * moonRadius;
          
          ctx.beginPath();
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.fill();
        });

        // Shadow based on phase
        // Phase 0 = New Moon (all shadow)
        // Phase 4 = Full Moon (no shadow)
        ctx.save();
        ctx.beginPath();
        ctx.arc(moonCenterX, moonCenterY, moonRadius, 0, Math.PI * 2);
        ctx.clip();

        if (currentPhase === 0) {
          // New Moon - all shadow
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(moonCenterX - moonRadius, moonCenterY - moonRadius, moonRadius * 2, moonRadius * 2);
        } else if (currentPhase === 4) {
          // Full Moon - no shadow (already drawn)
        } else if (currentPhase < 4) {
          // Waxing - shadow on left, shrinking
          const shadowWidth = moonRadius * 2 * (1 - currentPhase / 4);
          ctx.beginPath();
          ctx.ellipse(moonCenterX - moonRadius + shadowWidth / 2, moonCenterY, shadowWidth / 2, moonRadius, 0, 0, Math.PI * 2);
          ctx.rect(moonCenterX - moonRadius, moonCenterY - moonRadius, shadowWidth, moonRadius * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        } else {
          // Waning - shadow on right, growing
          const shadowWidth = moonRadius * 2 * ((currentPhase - 4) / 4);
          ctx.beginPath();
          ctx.ellipse(moonCenterX + moonRadius - shadowWidth / 2, moonCenterY, shadowWidth / 2, moonRadius, 0, 0, Math.PI * 2);
          ctx.rect(moonCenterX + moonRadius - shadowWidth, moonCenterY - moonRadius, shadowWidth, moonRadius * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }

        ctx.restore();

        // Phase name
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(phaseNames[currentPhase], moonCenterX, h - 30);
      }

      // Phase indicator at bottom
      const indicatorY = h - 15;
      const indicatorStartX = w / 2 - 80;
      
      for (let i = 0; i < 8; i++) {
        const ix = indicatorStartX + i * 22;
        ctx.beginPath();
        ctx.arc(ix, indicatorY, 8, 0, Math.PI * 2);
        ctx.fillStyle = i === currentPhase ? '#fbbf24' : 'rgba(148, 163, 184, 0.3)';
        ctx.fill();
        
        // Mini moon phase preview
        if (i > 0 && i < 4) {
          ctx.beginPath();
          ctx.arc(ix, indicatorY, 8, Math.PI / 2, -Math.PI / 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        } else if (i > 4) {
          ctx.beginPath();
          ctx.arc(ix, indicatorY, 8, -Math.PI / 2, Math.PI / 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        } else if (i === 0) {
          ctx.beginPath();
          ctx.arc(ix, indicatorY, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
