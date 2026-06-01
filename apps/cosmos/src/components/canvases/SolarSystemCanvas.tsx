import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Planet {
  name: string;
  indianName: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitPeriod: number;
  moons: number;
  distanceFromSun: string;
  description: string;
}

const planets: Planet[] = [
  { name: 'Mercury', indianName: 'Budh (बुध)', color: '#A0522D', size: 8, orbitRadius: 50, orbitPeriod: 88, moons: 0, distanceFromSun: '58 million km', description: 'The smallest planet and closest to the Sun. A year here is just 88 Earth days!' },
  { name: 'Venus', indianName: 'Shukra (शुक्र)', color: '#DEB887', size: 12, orbitRadius: 75, orbitPeriod: 225, moons: 0, distanceFromSun: '108 million km', description: 'The hottest planet with thick clouds. It spins backwards compared to other planets!' },
  { name: 'Earth', indianName: 'Prithvi (पृथ्वी)', color: '#4169E1', size: 12, orbitRadius: 100, orbitPeriod: 365, moons: 1, distanceFromSun: '150 million km', description: 'Our home! The only planet known to have life and liquid water on its surface.' },
  { name: 'Mars', indianName: 'Mangal (मंगल)', color: '#CD5C5C', size: 10, orbitRadius: 130, orbitPeriod: 687, moons: 2, distanceFromSun: '228 million km', description: 'The Red Planet! India\'s Mangalyaan orbited Mars in 2014 on its first attempt!' },
  { name: 'Jupiter', indianName: 'Brihaspati (बृहस्पति)', color: '#DAA520', size: 28, orbitRadius: 175, orbitPeriod: 4333, moons: 95, distanceFromSun: '778 million km', description: 'The largest planet! Its Great Red Spot is a storm bigger than Earth!' },
  { name: 'Saturn', indianName: 'Shani (शनि)', color: '#F4A460', size: 24, orbitRadius: 215, orbitPeriod: 10759, moons: 146, distanceFromSun: '1.4 billion km', description: 'Famous for its beautiful rings made of ice and rock particles!' },
  { name: 'Uranus', indianName: 'Arun (अरुण)', color: '#87CEEB', size: 18, orbitRadius: 250, orbitPeriod: 30687, moons: 28, distanceFromSun: '2.9 billion km', description: 'An ice giant that rotates on its side - it rolls around the Sun like a ball!' },
  { name: 'Neptune', indianName: 'Varun (वरुण)', color: '#4682B4', size: 18, orbitRadius: 280, orbitPeriod: 60190, moons: 16, distanceFromSun: '4.5 billion km', description: 'The windiest planet with storms faster than the speed of sound!' },
];

export function SolarSystemCanvas({ isPlaying }: CanvasProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * 360));
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

      setAngles((prev) =>
        prev.map((angle, idx) => {
          const planet = planets[idx];
          const angularSpeed = (360 / planet.orbitPeriod) * speed * 50;
          return (angle + angularSpeed * delta) % 360;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying, speed]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black">
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
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Solar System */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Sun */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setSelectedPlanet({
            name: 'Sun',
            indianName: 'Surya (सूर्य)',
            color: '#FFD700',
            size: 40,
            orbitRadius: 0,
            orbitPeriod: 0,
            moons: 0,
            distanceFromSun: '0 km',
            description: 'The heart of our solar system! A giant ball of hot gas that gives us light and warmth. In Indian tradition, Surya is the chief of the Navagraha.'
          })}
        >
          <div
            className="rounded-full"
            style={{
              width: 40,
              height: 40,
              background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
              boxShadow: '0 0 60px 20px rgba(255, 200, 0, 0.4), 0 0 100px 40px rgba(255, 150, 0, 0.2)',
            }}
          />
        </motion.div>

        {/* Orbits and Planets */}
        {planets.map((planet, idx) => (
          <div key={planet.name}>
            {/* Orbit Path */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/30"
              style={{
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2,
              }}
            />

            {/* Planet */}
            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                transform: `rotate(${angles[idx]}deg) translateX(${planet.orbitRadius}px) rotate(-${angles[idx]}deg) translate(-50%, -50%)`,
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelectedPlanet(planet)}
            >
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: planet.size,
                  height: planet.size,
                  backgroundColor: planet.color,
                  boxShadow: `0 0 ${planet.size / 2}px ${planet.color}50`,
                }}
              />
              {/* Saturn's Ring */}
              {planet.name === 'Saturn' && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300/50"
                  style={{
                    width: planet.size * 1.8,
                    height: planet.size * 0.5,
                    transform: 'translate(-50%, -50%) rotateX(70deg)',
                  }}
                />
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Speed Control */}
      <div className="absolute bottom-4 left-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Gauge className="h-4 w-4 text-sky-400" />
          <span className="text-xs text-slate-400">Speed</span>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24 accent-sky-500"
          />
          <span className="text-xs text-white">{speed.toFixed(1)}x</span>
        </div>
      </div>

      {/* Navagraha Info */}
      <div className="absolute bottom-4 right-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
        <p className="text-xs text-amber-300">🇮🇳 Click planets to see Navagraha names</p>
      </div>

      {/* Planet Info Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-4 w-72 rounded-2xl bg-slate-800/95 p-4 backdrop-blur shadow-xl border border-slate-700"
          >
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: selectedPlanet.color,
                  boxShadow: `0 0 20px ${selectedPlanet.color}50`,
                }}
              />
              <div>
                <h3 className="text-lg font-bold text-white">{selectedPlanet.name}</h3>
                <p className="text-sm text-amber-400">{selectedPlanet.indianName}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-700/50 p-2">
                <p className="text-xs text-slate-400">Distance from Sun</p>
                <p className="text-sm font-medium text-white">{selectedPlanet.distanceFromSun}</p>
              </div>
              <div className="rounded-lg bg-slate-700/50 p-2">
                <p className="text-xs text-slate-400">Moons</p>
                <p className="text-sm font-medium text-white">{selectedPlanet.moons}</p>
              </div>
              {selectedPlanet.orbitPeriod > 0 && (
                <div className="col-span-2 rounded-lg bg-slate-700/50 p-2">
                  <p className="text-xs text-slate-400">Year Length</p>
                  <p className="text-sm font-medium text-white">{selectedPlanet.orbitPeriod} Earth days</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
