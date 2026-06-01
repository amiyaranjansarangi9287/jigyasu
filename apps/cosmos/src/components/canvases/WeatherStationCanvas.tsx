import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Wind, Gauge, Cloud, Sun, CloudRain } from 'lucide-react';
import { CanvasProps } from '../../types';

type WeatherOutcome = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'hot' | 'cold';

interface WeatherPrediction {
  outcome: WeatherOutcome;
  emoji: string;
  title: string;
  description: string;
}

export function WeatherStationCanvas({ isPlaying }: CanvasProps) {
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(50);
  const [pressure, setPressure] = useState(1013);
  const [windSpeed, setWindSpeed] = useState(15);
  const [showMonsoon, setShowMonsoon] = useState(false);

  const getPrediction = (): WeatherPrediction => {
    // Simplified weather prediction logic
    if (pressure < 1000 && humidity > 70) {
      return {
        outcome: 'stormy',
        emoji: '⛈️',
        title: 'Storm Coming!',
        description: 'Low pressure and high humidity mean thunderstorms are likely!',
      };
    }
    if (humidity > 80 && temperature > 25) {
      return {
        outcome: 'rainy',
        emoji: '🌧️',
        title: 'Rain Expected',
        description: 'High humidity will condense into rain clouds.',
      };
    }
    if (pressure > 1020 && humidity < 40) {
      return {
        outcome: 'sunny',
        emoji: '☀️',
        title: 'Clear Skies',
        description: 'High pressure keeps clouds away. Perfect weather!',
      };
    }
    if (temperature > 40) {
      return {
        outcome: 'hot',
        emoji: '🥵',
        title: 'Heat Wave',
        description: 'Extreme heat! Stay hydrated and avoid direct sun.',
      };
    }
    if (temperature < 10) {
      return {
        outcome: 'cold',
        emoji: '🥶',
        title: 'Cold Spell',
        description: 'Bundle up! Temperatures are dropping.',
      };
    }
    return {
      outcome: 'cloudy',
      emoji: '⛅',
      title: 'Partly Cloudy',
      description: 'Moderate conditions with some cloud cover.',
    };
  };

  const prediction = getPrediction();

  // Animate values when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTemperature((prev) => prev + (Math.random() - 0.5) * 2);
      setHumidity((prev) => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)));
      setPressure((prev) => prev + (Math.random() - 0.5) * 2);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const setMonsoonConditions = () => {
    setTemperature(28);
    setHumidity(92);
    setPressure(998);
    setWindSpeed(25);
    setShowMonsoon(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950">
      {/* Animated Weather Background */}
      <div className="absolute inset-0 overflow-hidden">
        {prediction.outcome === 'rainy' || prediction.outcome === 'stormy' ? (
          // Rain drops
          Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-4 w-0.5 bg-sky-400/50 rounded-full"
              initial={{ y: -20, x: Math.random() * 100 + '%' }}
              animate={{ y: '120%' }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))
        ) : prediction.outcome === 'sunny' || prediction.outcome === 'hot' ? (
          // Sun rays
          <motion.div
            className="absolute -right-20 -top-20 h-60 w-60 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,200,0,0.3) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        ) : null}
      </div>

      {/* Weather Prediction Display */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={prediction.outcome}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="rounded-2xl bg-slate-800/80 px-8 py-6 backdrop-blur border border-slate-700"
          >
            <span className="text-6xl">{prediction.emoji}</span>
            <h2 className="mt-2 text-2xl font-bold text-white">{prediction.title}</h2>
            <p className="mt-1 max-w-xs text-sm text-slate-300">{prediction.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Instrument Panel */}
      <div className="absolute bottom-24 left-4 right-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Thermometer */}
        <div className="rounded-xl bg-slate-800/80 p-4 backdrop-blur border border-slate-700">
          <div className="flex items-center gap-2 text-red-400">
            <Thermometer className="h-5 w-5" />
            <span className="text-sm">Temperature</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{temperature.toFixed(1)}°C</p>
          <input
            type="range"
            min="-10"
            max="50"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="mt-2 w-full accent-red-500"
          />
        </div>

        {/* Hygrometer */}
        <div className="rounded-xl bg-slate-800/80 p-4 backdrop-blur border border-slate-700">
          <div className="flex items-center gap-2 text-sky-400">
            <Droplets className="h-5 w-5" />
            <span className="text-sm">Humidity</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{humidity.toFixed(0)}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value))}
            className="mt-2 w-full accent-sky-500"
          />
        </div>

        {/* Barometer */}
        <div className="rounded-xl bg-slate-800/80 p-4 backdrop-blur border border-slate-700">
          <div className="flex items-center gap-2 text-purple-400">
            <Gauge className="h-5 w-5" />
            <span className="text-sm">Pressure</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{pressure.toFixed(0)} hPa</p>
          <input
            type="range"
            min="980"
            max="1040"
            value={pressure}
            onChange={(e) => setPressure(parseFloat(e.target.value))}
            className="mt-2 w-full accent-purple-500"
          />
        </div>

        {/* Anemometer */}
        <div className="rounded-xl bg-slate-800/80 p-4 backdrop-blur border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400">
            <Wind className="h-5 w-5" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{windSpeed.toFixed(0)} km/h</p>
          <input
            type="range"
            min="0"
            max="100"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>
      </div>

      {/* Quick Weather Icons */}
      <div className="absolute left-4 top-4 flex gap-2">
        <button
          onClick={() => {
            setTemperature(35);
            setHumidity(30);
            setPressure(1025);
            setShowMonsoon(false);
          }}
          className="rounded-lg bg-amber-500/20 p-2 text-amber-400 hover:bg-amber-500/30 transition-colors"
          title="Sunny Day"
        >
          <Sun className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setTemperature(22);
            setHumidity(65);
            setPressure(1010);
            setShowMonsoon(false);
          }}
          className="rounded-lg bg-slate-500/20 p-2 text-slate-400 hover:bg-slate-500/30 transition-colors"
          title="Cloudy"
        >
          <Cloud className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setTemperature(20);
            setHumidity(85);
            setPressure(995);
            setShowMonsoon(false);
          }}
          className="rounded-lg bg-sky-500/20 p-2 text-sky-400 hover:bg-sky-500/30 transition-colors"
          title="Rainy"
        >
          <CloudRain className="h-5 w-5" />
        </button>
      </div>

      {/* Monsoon Button */}
      <button
        onClick={setMonsoonConditions}
        className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-amber-300 hover:bg-amber-500/30 transition-colors"
      >
        <span>🇮🇳</span>
        <span className="text-sm">Monsoon Mode</span>
      </button>

      {/* Monsoon Info Panel */}
      <AnimatePresence>
        {showMonsoon && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-16 max-w-xs rounded-xl bg-amber-500/10 border border-amber-500/20 p-4"
          >
            <h3 className="font-medium text-amber-300">🌧️ Indian Monsoon</h3>
            <p className="mt-2 text-sm text-amber-200/70">
              The monsoon forms when warm air rises over the Indian Ocean, creating low pressure. 
              Moisture-laden winds from the Bay of Bengal bring rain across India from June to September.
            </p>
            <p className="mt-2 text-xs text-amber-400">
              IMD (India Meteorological Department) has been predicting monsoons since 1875!
            </p>
            <button
              onClick={() => setShowMonsoon(false)}
              className="mt-3 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Guide */}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-800/60 p-3 backdrop-blur">
        <p className="text-center text-xs text-slate-400">
          💡 Adjust the instruments and watch the weather prediction change! 
          Low pressure + high humidity = rain coming!
        </p>
      </div>
    </div>
  );
}
