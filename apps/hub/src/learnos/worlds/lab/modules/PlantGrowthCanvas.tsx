import { useRef, useEffect } from 'react';

interface PlantGrowthCanvasProps {
  stage: number; // 0-5: seed, sprout, seedling, growing, flowering, fruit
  waterLevel: number;
  sunLevel: number;
}

export default function PlantGrowthCanvas({ stage, waterLevel, sunLevel }: PlantGrowthCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const stageRef = useRef(stage);
  const waterRef = useRef(waterLevel);
  const sunRef = useRef(sunLevel);
  const animTimeRef = useRef(0);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    waterRef.current = waterLevel;
  }, [waterLevel]);

  useEffect(() => {
    sunRef.current = sunLevel;
  }, [sunLevel]);

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

    const groundY = h * 0.7;
    const plantX = w / 2;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      animTimeRef.current += 0.02;

      const currentStage = stageRef.current;
      const water = waterRef.current;
      const sun = sunRef.current;

      // Sky gradient based on sun level
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      const skyBlue = Math.round(150 + sun * 80);
      skyGrad.addColorStop(0, `rgb(56, ${skyBlue}, 248)`);
      skyGrad.addColorStop(1, `rgb(186, 230, 253)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Sun
      const sunX = w - 60;
      const sunY = 60;
      const sunRadius = 30 + sun * 10;

      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.5);
      sunGlow.addColorStop(0, `rgba(253, 224, 71, ${sun * 0.5})`);
      sunGlow.addColorStop(0.5, `rgba(251, 191, 36, ${sun * 0.2})`);
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun body
      const sunBodyGrad = ctx.createRadialGradient(sunX - 5, sunY - 5, 0, sunX, sunY, sunRadius);
      sunBodyGrad.addColorStop(0, '#fef9c3');
      sunBodyGrad.addColorStop(0.5, '#fde047');
      sunBodyGrad.addColorStop(1, '#f59e0b');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunBodyGrad;
      ctx.fill();

      // Sun rays
      if (sun > 0.3) {
        ctx.save();
        ctx.globalAlpha = sun * 0.3;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + animTimeRef.current * 0.5;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(angle) * (sunRadius + 5), sunY + Math.sin(angle) * (sunRadius + 5));
          ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + 25), sunY + Math.sin(angle) * (sunRadius + 25));
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Clouds if not sunny
      if (sun < 0.5) {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
        ctx.beginPath();
        ctx.arc(w * 0.3, 50, 30, 0, Math.PI * 2);
        ctx.arc(w * 0.3 + 25, 45, 25, 0, Math.PI * 2);
        ctx.arc(w * 0.3 + 50, 50, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(w * 0.6, 70, 25, 0, Math.PI * 2);
        ctx.arc(w * 0.6 + 20, 65, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#65a30d');
      groundGrad.addColorStop(0.1, '#4d7c0f');
      groundGrad.addColorStop(0.3, '#713f12');
      groundGrad.addColorStop(1, '#57534e');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Water moisture in soil
      if (water > 0.3) {
        ctx.fillStyle = `rgba(59, 130, 246, ${water * 0.3})`;
        ctx.fillRect(plantX - 60, groundY, 120, (h - groundY) * 0.5);
      }

      // Pot/planting area
      ctx.beginPath();
      ctx.moveTo(plantX - 50, groundY - 5);
      ctx.lineTo(plantX - 40, h * 0.85);
      ctx.lineTo(plantX + 40, h * 0.85);
      ctx.lineTo(plantX + 50, groundY - 5);
      ctx.closePath();
      ctx.fillStyle = '#a16207';
      ctx.fill();
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Soil in pot
      ctx.beginPath();
      ctx.ellipse(plantX, groundY, 45, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#57534e';
      ctx.fill();

      // Draw plant based on stage
      const swayAmount = Math.sin(animTimeRef.current * 2) * 3;

      if (currentStage >= 0) {
        // Seed underground
        if (currentStage === 0) {
          ctx.beginPath();
          ctx.ellipse(plantX, groundY + 20, 8, 12, 0.2, 0, Math.PI * 2);
          const seedGrad = ctx.createRadialGradient(plantX - 2, groundY + 18, 0, plantX, groundY + 20, 10);
          seedGrad.addColorStop(0, '#fef3c7');
          seedGrad.addColorStop(0.5, '#fbbf24');
          seedGrad.addColorStop(1, '#b45309');
          ctx.fillStyle = seedGrad;
          ctx.fill();

          // Seed label
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🌰 Seed', plantX, groundY + 55);
        }
      }

      if (currentStage >= 1) {
        // Sprout - tiny stem breaking through
        const sproutHeight = currentStage === 1 ? 30 : 0;
        if (currentStage === 1) {
          ctx.beginPath();
          ctx.moveTo(plantX - 3, groundY);
          ctx.quadraticCurveTo(plantX + swayAmount * 0.3, groundY - sproutHeight / 2, plantX + swayAmount * 0.5, groundY - sproutHeight);
          ctx.lineTo(plantX + 3 + swayAmount * 0.5, groundY - sproutHeight);
          ctx.quadraticCurveTo(plantX + swayAmount * 0.3, groundY - sproutHeight / 2, plantX + 3, groundY);
          ctx.fillStyle = '#84cc16';
          ctx.fill();

          // Tiny leaves
          ctx.beginPath();
          ctx.ellipse(plantX - 8 + swayAmount * 0.5, groundY - sproutHeight + 5, 8, 4, -0.5, 0, Math.PI * 2);
          ctx.ellipse(plantX + 8 + swayAmount * 0.5, groundY - sproutHeight + 5, 8, 4, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#65a30d';
          ctx.fill();

          ctx.fillStyle = '#84cc16';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('🌱 Sprout', plantX, groundY + 55);
        }
      }

      if (currentStage >= 2) {
        // Seedling
        const seedlingHeight = currentStage === 2 ? 60 : 0;
        if (currentStage === 2) {
          // Stem
          ctx.beginPath();
          ctx.moveTo(plantX - 4, groundY);
          ctx.quadraticCurveTo(plantX + swayAmount * 0.5, groundY - seedlingHeight / 2, plantX + swayAmount, groundY - seedlingHeight);
          ctx.lineTo(plantX + 4 + swayAmount, groundY - seedlingHeight);
          ctx.quadraticCurveTo(plantX + swayAmount * 0.5, groundY - seedlingHeight / 2, plantX + 4, groundY);
          ctx.fillStyle = '#65a30d';
          ctx.fill();

          // Leaves
          for (let i = 0; i < 3; i++) {
            const leafY = groundY - 20 - i * 15;
            const leafDir = i % 2 === 0 ? 1 : -1;
            ctx.beginPath();
            ctx.ellipse(plantX + leafDir * 20 + swayAmount * 0.7, leafY, 15, 6, leafDir * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = i === 2 ? '#84cc16' : '#65a30d';
            ctx.fill();
          }

          ctx.fillStyle = '#65a30d';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('🌿 Seedling', plantX, groundY + 55);
        }
      }

      if (currentStage >= 3) {
        // Growing plant
        const plantHeight = currentStage === 3 ? 100 : 0;
        if (currentStage === 3) {
          // Main stem
          ctx.beginPath();
          ctx.moveTo(plantX - 5, groundY);
          ctx.quadraticCurveTo(plantX + swayAmount, groundY - plantHeight / 2, plantX + swayAmount * 1.5, groundY - plantHeight);
          ctx.lineTo(plantX + 5 + swayAmount * 1.5, groundY - plantHeight);
          ctx.quadraticCurveTo(plantX + swayAmount, groundY - plantHeight / 2, plantX + 5, groundY);
          ctx.fillStyle = '#4d7c0f';
          ctx.fill();

          // Multiple leaves
          for (let i = 0; i < 5; i++) {
            const leafY = groundY - 15 - i * 18;
            const leafDir = i % 2 === 0 ? 1 : -1;
            const leafSize = 12 + (5 - i) * 3;
            ctx.beginPath();
            ctx.ellipse(plantX + leafDir * (20 + i * 3) + swayAmount, leafY, leafSize, 7, leafDir * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#65a30d';
            ctx.fill();
            
            // Leaf vein
            ctx.beginPath();
            ctx.moveTo(plantX + swayAmount * 0.8, leafY);
            ctx.lineTo(plantX + leafDir * (15 + i * 3) + swayAmount, leafY);
            ctx.strokeStyle = '#4d7c0f';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          ctx.fillStyle = '#4d7c0f';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('🪴 Growing', plantX, groundY + 55);
        }
      }

      if (currentStage >= 4) {
        // Flowering
        const flowerHeight = currentStage >= 4 ? 130 : 0;
        if (currentStage === 4 || currentStage === 5) {
          // Main stem
          ctx.beginPath();
          ctx.moveTo(plantX - 6, groundY);
          ctx.quadraticCurveTo(plantX + swayAmount, groundY - flowerHeight / 2, plantX + swayAmount * 1.5, groundY - flowerHeight);
          ctx.lineTo(plantX + 6 + swayAmount * 1.5, groundY - flowerHeight);
          ctx.quadraticCurveTo(plantX + swayAmount, groundY - flowerHeight / 2, plantX + 6, groundY);
          ctx.fillStyle = '#4d7c0f';
          ctx.fill();

          // Leaves
          for (let i = 0; i < 6; i++) {
            const leafY = groundY - 15 - i * 18;
            const leafDir = i % 2 === 0 ? 1 : -1;
            const leafSize = 15 + (6 - i) * 2;
            ctx.beginPath();
            ctx.ellipse(plantX + leafDir * (22 + i * 2) + swayAmount, leafY, leafSize, 8, leafDir * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#65a30d';
            ctx.fill();
          }

          // Flower or fruit
          const flowerX = plantX + swayAmount * 1.5;
          const flowerY = groundY - flowerHeight;

          if (currentStage === 4) {
            // Flower petals
            for (let i = 0; i < 6; i++) {
              const petalAngle = (i / 6) * Math.PI * 2 + animTimeRef.current * 0.3;
              const px = flowerX + Math.cos(petalAngle) * 20;
              const py = flowerY + Math.sin(petalAngle) * 20;
              ctx.beginPath();
              ctx.ellipse(px, py, 12, 8, petalAngle, 0, Math.PI * 2);
              const petalGrad = ctx.createRadialGradient(px, py, 0, px, py, 12);
              petalGrad.addColorStop(0, '#fce7f3');
              petalGrad.addColorStop(0.5, '#f9a8d4');
              petalGrad.addColorStop(1, '#ec4899');
              ctx.fillStyle = petalGrad;
              ctx.fill();
            }
            // Center
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.fill();

            ctx.fillStyle = '#ec4899';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('🌸 Flowering', plantX, groundY + 55);
          } else {
            // Fruit!
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, 18, 0, Math.PI * 2);
            const fruitGrad = ctx.createRadialGradient(flowerX - 5, flowerY - 5, 0, flowerX, flowerY, 18);
            fruitGrad.addColorStop(0, '#fca5a5');
            fruitGrad.addColorStop(0.5, '#ef4444');
            fruitGrad.addColorStop(1, '#b91c1c');
            ctx.fillStyle = fruitGrad;
            ctx.fill();
            
            // Stem
            ctx.fillStyle = '#65a30d';
            ctx.fillRect(flowerX - 2, flowerY - 25, 4, 10);
            
            // Leaf on fruit
            ctx.beginPath();
            ctx.ellipse(flowerX + 8, flowerY - 20, 8, 4, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#65a30d';
            ctx.fill();

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('🍎 Fruit!', plantX, groundY + 55);
          }
        }
      }

      // Water droplets animation
      if (water > 0.5) {
        for (let i = 0; i < 3; i++) {
          const dropX = plantX - 30 + Math.random() * 60;
          const dropY = 50 + Math.random() * (groundY - 100);
          ctx.beginPath();
          ctx.ellipse(dropX, dropY, 3, 5, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
