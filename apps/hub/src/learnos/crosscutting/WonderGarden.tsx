// src/crosscutting/WonderGarden.tsx
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button } from '../shared/ui';
import { CanvasHelpers } from '../shared/canvas/helpers/CanvasHelpers';

interface GardenPlant {
  id: string;
  world: string;
  concept: string;
  emoji: string;
  size: number;
  x: number;
  y: number;
  color: string;
  unlocked: boolean;
}

const WORLD_COLORS: Record<string, string> = {
  tiny: '#FF6B6B',
  early: '#6C63FF',
  lab: '#3B82F6',
  discovery: '#6366F1',
  academy: '#4F46E5',
  explorer: '#8B5CF6',
};

const STORAGE_KEY = 'learnos-wonder-garden';

function generateGarden(): GardenPlant[] {
  const plants: GardenPlant[] = [];
  const worlds = Object.keys(WORLD_COLORS);
  let id = 0;

  worlds.forEach((world, wi) => {
    const conceptsPerWorld = 8;
    for (let i = 0; i < conceptsPerWorld; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      plants.push({
        id: `plant-${id++}`,
        world,
        concept: `${world}-concept-${i}`,
        emoji: getWorldEmoji(world, i),
        size: 20 + Math.random() * 15,
        x: 60 + col * 80 + Math.random() * 20,
        y: 80 + wi * 70 + row * 40 + Math.random() * 15,
        color: WORLD_COLORS[world],
        unlocked: Math.random() > 0.6,
      });
    }
  });

  return plants;
}

function getWorldEmoji(world: string, index: number): string {
  const emojis: Record<string, string[]> = {
    tiny: ['🌱', '🌸', '🌻', '🌷', '🌺', '🌼', '🌿', '🍀'],
    early: ['🌲', '🌳', '🌴', '🌵', '🎄', '🌾', '🍁', '🍂'],
    lab: ['🔬', '🧪', '⚗️', '🔭', '🧫', '🧲', '⚡', '🌡️'],
    discovery: ['🌍', '🌊', '🌋', '🌌', '🔮', '💎', '🧬', '🦠'],
    academy: ['📐', '📊', '📚', '🎯', '🏆', '💡', '🔑', '🌟'],
    explorer: ['🧭', '🗺️', '🔭', '📖', '🎓', '💭', '🌅', '🏔️'],
  };
  return emojis[world]?.[index] ?? '🌱';
}

function loadGarden(): GardenPlant[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return generateGarden();
}

export default function WonderGarden() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plants] = useState<GardenPlant[]>(loadGarden);
  const [hoveredPlant, setHoveredPlant] = useState<GardenPlant | null>(null);

  const unlockedCount = plants.filter((p) => p.unlocked).length;
  const totalCount = plants.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.offsetWidth, canvas.offsetHeight);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const draw = () => {
      CanvasHelpers.clearCanvas(ctx, width, height);

      // Draw ground
      const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      gradient.addColorStop(0, '#90EE90');
      gradient.addColorStop(1, '#228B22');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      // Draw plants
      plants.forEach((plant) => {
        ctx.save();
        ctx.globalAlpha = plant.unlocked ? 1 : 0.3;

        // Stem
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plant.x, plant.y + plant.size);
        ctx.lineTo(plant.x, plant.y);
        ctx.stroke();

        // Emoji
        ctx.font = `${plant.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(plant.emoji, plant.x, plant.y - plant.size / 2);

        // Glow for unlocked
        if (plant.unlocked) {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = plant.color;
          ctx.beginPath();
          ctx.arc(plant.x, plant.y - plant.size / 2, plant.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    };

    draw();

    return () => {
      // cleanup
    };
  }, [plants]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-lime-50 relative">
      <ParentCorner />

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(ROUTES.FAMILY_HOME)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            {unlockedCount} / {totalCount} plants
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌻</div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            {t('crosscutting.wonder_garden.title') ?? 'Wonder Garden'}
          </h1>
          <p className="text-gray-500 mb-4">
            {unlockedCount < totalCount
              ? 'Keep exploring to grow your garden'
              : 'Your garden is fully grown!'}
          </p>
          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% grown</p>
          </div>
        </div>

        {/* Canvas Garden */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6 relative">
          <canvas
            ref={canvasRef}
            className="w-full block"
            style={{ height: '400px' }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const found = plants.find(
                (p) =>
                  Math.abs(p.x - x) < 20 &&
                  Math.abs(p.y - p.size / 2 - y) < 20
              );
              setHoveredPlant(found ?? null);
            }}
            onMouseLeave={() => setHoveredPlant(null)}
          />
          {hoveredPlant && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
              <p className="font-bold text-gray-800 text-sm">
                {hoveredPlant.emoji} {hoveredPlant.concept.replace('-', ' ')}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {hoveredPlant.world} World
              </p>
              <p className="text-sm text-green-600 font-medium">
                {hoveredPlant.unlocked ? '✨ Discovered' : '🔒 Not yet explored'}
              </p>
            </div>
          )}
        </div>

        {/* World breakdown */}
        <div className="space-y-3 mb-6">
          {Object.entries(WORLD_COLORS).map(([world, color]) => {
            const worldPlants = plants.filter((p) => p.world === world);
            const worldUnlocked = worldPlants.filter((p) => p.unlocked).length;
            return (
              <div key={world} className="bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-800 capitalize">{world} World</p>
                  <p className="text-sm text-gray-400">
                    {worldUnlocked}/{worldPlants.length}
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(worldUnlocked / worldPlants.length) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={() => navigate(ROUTES.FAMILY_HOME)} size="lg" fullWidth>
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
}
