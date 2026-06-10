// src/worlds/lab/modules/WeatherStation.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { WEATHER_SCENARIOS } from '../data/labContent';

export default function WeatherStation() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('weather-station');
  const { recordWeatherPrediction, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [idx, setIdx] = useState(0);
  const [pred, setPred] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const sc = WEATHER_SCENARIOS[idx];

  const handlePredict = useCallback(async (p: string) => {
    setPred(p); setDone(true);
    const correct = p === sc.correctPrediction;
    if (correct) { lumo.showAfterDiscovery(); recordWeatherPrediction(true); updateCertification('weather-station', 'explorer'); trackEvent('weather-station', 'correct_answer'); }
    else { recordWeatherPrediction(false); trackEvent('weather-station', 'wrong_answer'); }
  }, [sc, lumo, recordWeatherPrediction, updateCertification, trackEvent]);

  return (
    <LabShell module="weather-station" subject="earth-science">
      <div className="flex flex-col h-screen bg-sky-50 overflow-auto pb-24 p-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-sky-100">
          <div className="flex items-center gap-4 mb-4"><span className="text-4xl">{t('lab.modules.WeatherStation.spn_', '🌤️')}</span><h2 className="text-xl font-bold"><Trans i18nKey="auto.weatherstation.weather_station">Weather Station</Trans></h2></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-xl"><p className="text-sm text-blue-400 font-bold uppercase">{t('lab.modules.WeatherStation.txt_Temp', 'Temp')}</p><p className="text-lg font-mono font-bold text-blue-700">{sc.readings.temperature}<Trans i18nKey="auto.weatherstation.c">°C</Trans></p></div>
            <div className="p-3 bg-sky-50 rounded-xl"><p className="text-sm text-sky-400 font-bold uppercase">{t('lab.modules.WeatherStation.txt_Humidity', 'Humidity')}</p><p className="text-lg font-mono font-bold text-sky-700">{sc.readings.humidity}%</p></div>
            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-sm text-slate-400 font-bold uppercase">{t('lab.modules.WeatherStation.txt_Pressure', 'Pressure')}</p><p className="text-lg font-mono font-bold text-slate-700">{sc.readings.pressure}<Trans i18nKey="auto.weatherstation.hpa">hPa</Trans></p></div>
            <div className="p-3 bg-indigo-50 rounded-xl"><p className="text-sm text-indigo-400 font-bold uppercase">{t('lab.modules.WeatherStation.txt_Wind', 'Wind')}</p><p className="text-lg font-mono font-bold text-indigo-700">{sc.readings.windSpeed}<Trans i18nKey="auto.weatherstation.km_h">km/h</Trans></p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {['sunny', 'cloudy', 'rainy', 'stormy'].map(p => (
            <button key={p} disabled={done} onClick={() => handlePredict(p)} className={`p-4 rounded-2xl border-2 font-bold transition-all ${pred === p ? (p === sc.correctPrediction ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'bg-white border-slate-100'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-white rounded-2xl border border-sky-200">
            <p className="text-sm font-bold text-slate-700 mb-2">{t('lab.modules.WeatherStation.txt_Explanatio', 'Explanation:')}</p><p className="text-sm text-slate-500">{sc.explanation}</p>
            <button onClick={() => { setIdx(p => (p + 1) % WEATHER_SCENARIOS.length); setPred(null); setDone(false); }} className="w-full mt-4 bg-sky-600 text-white p-3 rounded-xl font-bold"><Trans i18nKey="auto.weatherstation.next_reading">Next Reading</Trans></button>
          </motion.div>
        )}
      </div>
    </LabShell>
  );
}
