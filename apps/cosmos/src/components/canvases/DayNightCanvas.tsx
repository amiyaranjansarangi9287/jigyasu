import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Clock, RotateCcw } from 'lucide-react';
import { CanvasProps } from '../../types';

interface City {
  name: string;
  country: string;
  lng: number;
  offset: number;
  emoji: string;
}

const cities: City[] = [
  { name: 'Mumbai', country: 'India', lng: 72.8777, offset: 5.5, emoji: '🇮🇳' },
  { name: 'Delhi', country: 'India', lng: 77.209, offset: 5.5, emoji: '🇮🇳' },
  { name: 'London', country: 'UK', lng: -0.1276, offset: 0, emoji: '🇬🇧' },
  { name: 'New York', country: 'USA', lng: -74.006, offset: -5, emoji: '🇺🇸' },
  { name: 'Tokyo', country: 'Japan', lng: 139.6917, offset: 9, emoji: '🇯🇵' },
  { name: 'Sydney', country: 'Australia', lng: 151.2093, offset: 11, emoji: '🇦🇺' },
];

export function DayNightCanvas({ isPlaying }: CanvasProps) {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(23.5);
  const [showSeasons, setShowSeasons] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setRotation((prev) => (prev + delta * 15) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying]);

  const getTimeForCity = (city: City): { time: string; isDay: boolean } => {
    // Simplified calculation based on rotation
    const cityAngle = (city.lng + 180) / 360 * 360;
    const sunAngle = (360 - rotation) % 360;
    const diff = Math.abs(cityAngle - sunAngle);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    const isDay = normalizedDiff < 90;

    // Calculate approximate time
    const baseHour = 12 - (normalizedDiff / 15);
    const adjustedHour = ((baseHour + 24) % 24);
    const hours = Math.floor(adjustedHour);
    const minutes = Math.floor((adjustedHour - hours) * 60);
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return { time, isDay };
  };

  const getCityPosition = (city: City) => {
    const earthRadius = 100;
    // Latitude approximation (most cities near equator for simplicity)
    const lat = city.name === 'Mumbai' || city.name === 'Delhi' ? 20 : 
                city.name === 'Tokyo' ? 35 :
                city.name === 'Sydney' ? -34 :
                city.name === 'London' ? 51 : 40;
    
    const adjustedLng = (city.lng + rotation) % 360;
    const radLng = (adjustedLng * Math.PI) / 180;
    const radLat = (lat * Math.PI) / 180;

    const x = earthRadius * Math.cos(radLat) * Math.sin(radLng);
    const z = earthRadius * Math.cos(radLat) * Math.cos(radLng);
    const y = earthRadius * Math.sin(radLat);

    // Only show if on visible side of Earth
    const visible = z > -20;

    return { x, y, visible, z };
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-black">
      {/* Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Sun - fixed on the left */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div
            className="h-20 w-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
              boxShadow: '0 0 80px 30px rgba(255, 200, 0, 0.3), 0 0 120px 60px rgba(255, 150, 0, 0.15)',
            }}
          />
        </motion.div>
        <div className="mt-2 flex items-center justify-center gap-1 text-amber-400">
          <Sun className="h-4 w-4" />
          <span className="text-xs">Sun</span>
        </div>
      </div>

      {/* Earth - in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          style={{
            transform: `rotateZ(${tilt}deg)`,
          }}
          className="relative"
        >
          {/* Earth Globe */}
          <div
            className="relative h-52 w-52 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 30%, #22c55e 50%, #1e3a5f 70%, #0f172a 100%)',
              boxShadow: 'inset -30px 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
            }}
          >
            {/* Day/Night Terminator */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.95) 100%)',
              }}
            />

            {/* Continents hint (moving with rotation) */}
            <div
              className="absolute inset-0"
              style={{
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute left-1/4 top-1/3 h-8 w-12 rounded-full bg-green-600/30" />
              <div className="absolute left-1/2 top-1/2 h-10 w-6 rounded-full bg-green-600/30" />
            </div>

            {/* City Markers */}
            {cities.map((city) => {
              const pos = getCityPosition(city);
              const timeInfo = getTimeForCity(city);
              if (!pos.visible) return null;

              return (
                <div
                  key={city.name}
                  className="absolute flex items-center gap-1"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% - ${pos.y}px)`,
                    transform: 'translate(-50%, -50%)',
                    opacity: Math.min(1, (pos.z + 100) / 120),
                    zIndex: Math.floor(pos.z + 100),
                  }}
                >
                  <div
                    className={`h-3 w-3 rounded-full border-2 ${
                      timeInfo.isDay
                        ? 'border-amber-400 bg-amber-500'
                        : 'border-indigo-400 bg-indigo-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Axis Line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-slate-500/30" style={{ height: '130%', top: '-15%' }} />
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 text-xs text-slate-500">N</div>
          <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-xs text-slate-500">S</div>
        </div>

        {/* Rotation indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
          <RotateCcw className="h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs">Earth rotates once every 24 hours</span>
        </div>
      </div>

      {/* City Time Cards */}
      <div className="absolute right-4 top-4 space-y-2">
        {cities.slice(0, 4).map((city) => {
          const timeInfo = getTimeForCity(city);
          return (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                timeInfo.isDay
                  ? 'bg-amber-500/20 border border-amber-500/30'
                  : 'bg-indigo-500/20 border border-indigo-500/30'
              }`}
            >
              <span>{city.emoji}</span>
              <div>
                <p className="text-sm font-medium text-white">{city.name}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className={timeInfo.isDay ? 'text-amber-300' : 'text-indigo-300'}>
                    {timeInfo.time}
                  </span>
                  <span className="text-slate-500">
                    {timeInfo.isDay ? '☀️' : '🌙'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 space-y-3">
        {/* Rotation Control */}
        <div className="rounded-xl bg-slate-800/80 p-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Rotation</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              className="w-24 accent-sky-500"
            />
            <span className="text-xs text-white">{Math.floor(rotation)}°</span>
          </div>
        </div>

        {/* Tilt Control */}
        <div className="rounded-xl bg-slate-800/80 p-3 backdrop-blur">
          <button
            onClick={() => setShowSeasons(!showSeasons)}
            className={`flex items-center gap-2 text-sm ${showSeasons ? 'text-sky-400' : 'text-slate-400'}`}
          >
            <span>🌍</span>
            <span>Earth's Tilt: {tilt.toFixed(1)}°</span>
          </button>
          {showSeasons && (
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="45"
                step="0.5"
                value={tilt}
                onChange={(e) => setTilt(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Earth's 23.5° tilt causes seasons!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* IST Info Panel */}
      <div className="absolute bottom-4 right-4 max-w-xs rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
        <div className="flex items-start gap-2">
          <span>🇮🇳</span>
          <div>
            <p className="text-sm font-medium text-amber-300">Indian Standard Time (IST)</p>
            <p className="mt-1 text-xs text-amber-200/70">
              UTC+5:30 • Based on 82.5°E longitude at Mirzapur, Uttar Pradesh. One of few countries with a 30-minute offset!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
