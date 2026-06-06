import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface WaterCycleCanvasProps {
  sunIntensity: number;
  isPlaying: boolean;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: 'water' | 'vapor' | 'cloud' | 'rain';
  alpha: number;
  size: number;
}

export default function WaterCycleCanvas({ sunIntensity, isPlaying }: WaterCycleCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const dropletsRef = useRef<Droplet[]>([]);
  const sunIntensityRef = useRef(sunIntensity);
  const isPlayingRef = useRef(isPlaying);
  const cloudSizeRef = useRef(0);

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

    // Scene elements
    const groundY = h * 0.75;
    const waterY = h * 0.85;
    const cloudY = h * 0.2;
    const mountainPeakX = w * 0.75;

    const spawnWaterDroplet = () => {
      dropletsRef.current.push({
        x: w * 0.2 + Math.random() * w * 0.3,
        y: waterY - 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -2 - Math.random() * 2,
        state: 'vapor',
        alpha: 0.8,
        size: 3 + Math.random() * 2,
      });
    };

    const spawnRainDroplet = (x: number) => {
      dropletsRef.current.push({
        x: x + (Math.random() - 0.5) * 60,
        y: cloudY + 40,
        vx: -0.5,
        vy: 3 + Math.random() * 2,
        state: 'rain',
        alpha: 0.9,
        size: 2 + Math.random() * 2,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Sky gradient (changes with sun intensity)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      const skyBlue = Math.round(180 + sunIntensityRef.current * 50);
      skyGrad.addColorStop(0, `rgb(56, ${skyBlue}, 248)`);
      skyGrad.addColorStop(1, `rgb(147, 197, 253)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Sun
      const sunX = w * 0.15;
      const sunY = h * 0.18;
      const sunSize = 35 + sunIntensityRef.current * 15;

      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunSize * 2.5);
      sunGlow.addColorStop(0, `rgba(253, 224, 71, ${sunIntensityRef.current * 0.5})`);
      sunGlow.addColorStop(0.5, `rgba(251, 191, 36, ${sunIntensityRef.current * 0.2})`);
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunSize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun body
      const sunGrad = ctx.createRadialGradient(sunX - 5, sunY - 5, 0, sunX, sunY, sunSize);
      sunGrad.addColorStop(0, '#fef9c3');
      sunGrad.addColorStop(0.5, '#fde047');
      sunGrad.addColorStop(1, '#f59e0b');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Heat waves from sun (when intense)
      if (sunIntensityRef.current > 0.5 && isPlayingRef.current) {
        ctx.save();
        ctx.globalAlpha = (sunIntensityRef.current - 0.5) * 0.3;
        for (let i = 0; i < 5; i++) {
          const waveY = sunY + sunSize + 20 + i * 15 + (Date.now() * 0.05 % 20);
          ctx.beginPath();
          ctx.moveTo(sunX - 30, waveY);
          ctx.quadraticCurveTo(sunX, waveY - 8, sunX + 30, waveY);
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Mountains
      ctx.beginPath();
      ctx.moveTo(w * 0.5, groundY);
      ctx.lineTo(mountainPeakX, groundY - h * 0.25);
      ctx.lineTo(w, groundY - h * 0.1);
      ctx.lineTo(w, groundY);
      ctx.closePath();
      const mtGrad = ctx.createLinearGradient(0, groundY - h * 0.25, 0, groundY);
      mtGrad.addColorStop(0, '#6b7280');
      mtGrad.addColorStop(0.3, '#4b5563');
      mtGrad.addColorStop(1, '#374151');
      ctx.fillStyle = mtGrad;
      ctx.fill();

      // Snow cap
      ctx.beginPath();
      ctx.moveTo(mountainPeakX - 20, groundY - h * 0.2);
      ctx.lineTo(mountainPeakX, groundY - h * 0.25);
      ctx.lineTo(mountainPeakX + 20, groundY - h * 0.2);
      ctx.closePath();
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();

      // Ground
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, groundY, w, h * 0.1);

      // Water body (lake/ocean)
      ctx.beginPath();
      ctx.ellipse(w * 0.35, waterY, w * 0.3, h * 0.08, 0, 0, Math.PI * 2);
      const waterGrad = ctx.createRadialGradient(w * 0.3, waterY - 10, 0, w * 0.35, waterY, w * 0.3);
      waterGrad.addColorStop(0, '#60a5fa');
      waterGrad.addColorStop(0.7, '#3b82f6');
      waterGrad.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Water shine
      ctx.beginPath();
      ctx.ellipse(w * 0.28, waterY - 8, w * 0.08, h * 0.015, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Cloud (grows with evaporation)
      if (isPlayingRef.current) {
        cloudSizeRef.current += sunIntensityRef.current * 0.02;
        if (cloudSizeRef.current > 100) {
          // Rain!
          if (Math.random() < 0.1) {
            spawnRainDroplet(w * 0.65);
          }
          cloudSizeRef.current = Math.max(60, cloudSizeRef.current - 0.5);
        }
      }

      const cloudX = w * 0.65;
      const cloudScale = 0.5 + cloudSizeRef.current / 150;

      // Cloud shadow
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.ellipse(cloudX + 5, cloudY + 10, 50 * cloudScale, 25 * cloudScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();

      // Cloud body
      const cloudGrad = ctx.createRadialGradient(cloudX - 20, cloudY - 10, 0, cloudX, cloudY, 60 * cloudScale);
      cloudGrad.addColorStop(0, '#f8fafc');
      cloudGrad.addColorStop(0.7, '#e2e8f0');
      cloudGrad.addColorStop(1, '#cbd5e1');

      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cloudX - 30 * cloudScale, cloudY, 25 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cloudX, cloudY - 10 * cloudScale, 35 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cloudX + 35 * cloudScale, cloudY, 28 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cloudX + 10 * cloudScale, cloudY + 10 * cloudScale, 22 * cloudScale, 0, Math.PI * 2);
      ctx.fill();

      // Spawn evaporation
      if (isPlayingRef.current && Math.random() < sunIntensityRef.current * 0.15) {
        spawnWaterDroplet();
      }

      // Update and draw droplets
      const droplets = dropletsRef.current;
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];

        if (isPlayingRef.current) {
          d.x += d.vx;
          d.y += d.vy;

          if (d.state === 'vapor') {
            // Rise and move toward cloud
            d.vy *= 0.99;
            d.vx += (cloudX - d.x) * 0.0005;
            d.alpha -= 0.003;

            // Become part of cloud
            if (d.y < cloudY + 50) {
              d.alpha -= 0.02;
            }
          } else if (d.state === 'rain') {
            d.vy += 0.1; // Gravity
            
            // Hit ground or water
            if (d.y > groundY - 5) {
              d.alpha -= 0.1;
            }
          }
        }

        // Remove dead droplets
        if (d.alpha <= 0) {
          droplets.splice(i, 1);
          continue;
        }

        // Draw droplet
        ctx.save();
        ctx.globalAlpha = d.alpha;

        if (d.state === 'vapor') {
          // Vapor - wavy rising dots
          ctx.beginPath();
          ctx.arc(d.x + Math.sin(Date.now() * 0.01 + d.y * 0.1) * 3, d.y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(147, 197, 253, 0.8)';
          ctx.fill();
        } else if (d.state === 'rain') {
          // Rain - elongated drops
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, d.size * 0.5, d.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
        }

        ctx.restore();
      }

      // Labels with arrows
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';

      // Evaporation label
      ctx.save();
      ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.fillText('1️⃣ EVAPORATION', w * 0.35, groundY - h * 0.35);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Sun heats water', w * 0.35, groundY - h * 0.35 + 14);
      ctx.fillText('→ water rises as vapor', w * 0.35, groundY - h * 0.35 + 26);
      ctx.restore();

      // Condensation label
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('2️⃣ CONDENSATION', cloudX, cloudY - 50);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Vapor cools down', cloudX, cloudY - 36);
      ctx.fillText('→ forms clouds', cloudX, cloudY - 24);
      ctx.restore();

      // Precipitation label
      ctx.save();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('3️⃣ PRECIPITATION', w * 0.82, cloudY + 60);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Clouds get heavy', w * 0.82, cloudY + 74);
      ctx.fillText('→ rain falls down', w * 0.82, cloudY + 86);
      ctx.restore();

      // Collection label
      ctx.save();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('4️⃣ COLLECTION', w * 0.8, groundY + 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Water flows back', w * 0.8, groundY + 39);
      ctx.fillText('→ cycle repeats!', w * 0.8, groundY + 51);
      ctx.restore();

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
