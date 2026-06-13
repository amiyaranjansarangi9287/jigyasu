import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

function formatTime(totalMinutes: number) {
  const normalized = ((totalMinutes % 720) + 720) % 720;
  const h = Math.floor(normalized / 60) || 12;
  const m = normalized % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function makeClockChallenge() {
  const start = (Math.floor(Math.random() * 12) * 60) + Math.floor(Math.random() * 12) * 5;
  const elapsed = [15, 20, 25, 30, 35, 40, 45, 60, 75, 90, 120][Math.floor(Math.random() * 11)];
  const answer = formatTime(start + elapsed);
  const options = new Set<string>([answer]);
  while (options.size < 4) {
    options.add(formatTime(start + elapsed + (Math.floor(Math.random() * 7) - 3) * 5));
  }
  return { start, elapsed, answer, options: [...options].sort(() => Math.random() - 0.5) };
}

function AnalogClock({ minutes }: { minutes: number }) {
  const cx = 120;
  const cy = 120;
  const r = 95;
  const hour = Math.floor(((minutes % 720) + 720) % 720 / 60);
  const min = ((minutes % 60) + 60) % 60;
  const hourAngle = ((hour % 12) + min / 60) * 30 - 90;
  const minAngle = min * 6 - 90;
  const hourRad = (hourAngle * Math.PI) / 180;
  const minRad = (minAngle * Math.PI) / 180;

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-xl">
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.06)" stroke="rgba(168,85,247,0.6)" strokeWidth="4" />
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i * 6 - 90) * Math.PI / 180;
        const isHour = i % 5 === 0;
        const x1 = cx + Math.cos(angle) * (isHour ? r - 16 : r - 8);
        const y1 = cy + Math.sin(angle) * (isHour ? r - 16 : r - 8);
        const x2 = cx + Math.cos(angle) * (r - 4);
        const y2 = cy + Math.sin(angle) * (r - 4);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isHour ? '#c4b5fd' : 'rgba(255,255,255,0.25)'} strokeWidth={isHour ? 3 : 1} strokeLinecap="round" />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1;
        const angle = (n * 30 - 90) * Math.PI / 180;
        return <text key={n} x={cx + Math.cos(angle) * 68} y={cy + Math.sin(angle) * 68 + 5} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">{n}</text>;
      })}
      <motion.line x1={cx} y1={cy} x2={cx + Math.cos(hourRad) * 45} y2={cy + Math.sin(hourRad) * 45} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" animate={{ x2: cx + Math.cos(hourRad) * 45, y2: cy + Math.sin(hourRad) * 45 }} />
      <motion.line x1={cx} y1={cy} x2={cx + Math.cos(minRad) * 72} y2={cy + Math.sin(minRad) * 72} stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" animate={{ x2: cx + Math.cos(minRad) * 72, y2: cy + Math.sin(minRad) * 72 }} />
      <circle cx={cx} cy={cy} r="6" fill="#a855f7" />
    </svg>
  );
}

export default function ClockMaster() {
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState(10 * 60 + 15);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeClockChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const hour = Math.floor(minutes / 60) % 12 || 12;
  const min = minutes % 60;

  const timePhrases = useMemo(() => {
    if (min === 0) return [t('auto.clockmaster.hour_oclock', '{{hour}} o\'clock', { hour }), t('auto.clockmaster.exact_hour', 'exact hour')];
    if (min === 15) return [t('auto.clockmaster.quarter_past', 'quarter past {{hour}}', { hour }), t('auto.clockmaster.15_minutes_past', '15 minutes past')];
    if (min === 30) return [t('auto.clockmaster.half_past', 'half past {{hour}}', { hour }), t('auto.clockmaster.30_minutes_past', '30 minutes past')];
    if (min === 45) return [t('auto.clockmaster.quarter_to', 'quarter to {{nextHour}}', { nextHour: hour === 12 ? 1 : hour + 1 }), t('auto.clockmaster.15_minutes_until', '15 minutes until next hour')];
    if (min < 30) return [t('auto.clockmaster.minutes_past', '{{min}} minutes past {{hour}}', { min, hour }), t('auto.clockmaster.past_the_hour', 'past the hour')];
    return [t('auto.clockmaster.minutes_to', '{{min}} minutes to {{nextHour}}', { min: 60 - min, nextHour: hour === 12 ? 1 : hour + 1 }), t('auto.clockmaster.to_the_next_hour', 'to the next hour')];
  }, [hour, min, t]);

  const changeTime = (delta: number) => setMinutes((m) => ((m + delta) % 720 + 720) % 720);

  const answerChallenge = (option: string) => {
    if (feedback) return;
    if (option === challenge.answer) {
      setFeedback('correct');
      setMastery((s) => s + 10);
      setTimeout(() => {
        setChallenge(makeClockChallenge());
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback('hint');
      setTimeout(() => setFeedback(null), 900);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.clockmaster.clock_master">⏰ Clock Master</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.clockmaster.tell_time_add_minutes_and_solv">Tell time, add minutes, and solve elapsed-time puzzles.</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.clockmaster.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeClockChallenge()); }}><Trans i18nKey="auto.clockmaster.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="challenge" className="max-w-xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4">
                <span className="text-yellow-400 font-bold">⭐ {mastery}</span>
                <span className="text-gray-400 text-sm"><Trans i18nKey="auto.clockmaster.elapsed_time">Elapsed time</Trans></span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <AnalogClock minutes={challenge.start} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-gray-400 text-sm"><Trans i18nKey="auto.clockmaster.start_time">Start time</Trans></p>
                  <p className="text-4xl font-bold text-white font-mono">{formatTime(challenge.start)}</p>
                  <p className="text-xl text-purple-300 mt-3"><Trans i18nKey="auto.clockmaster.add">Add</Trans> <span className="font-bold text-yellow-300">{challenge.elapsed} <Trans i18nKey="auto.clockmaster.minutes">minutes</Trans></span></p>
                  <p className="text-white font-bold mt-1"><Trans i18nKey="auto.clockmaster.what_time_will_it_be">What time will it be?</Trans></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {challenge.options.map((option) => (
                  <motion.button key={option} className={`py-3 rounded-xl text-xl font-bold font-mono ${feedback === 'correct' && option === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(option)} disabled={!!feedback}>{option}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.clockmaster.correct">✅ Correct!</Trans> {challenge.answer}</p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.clockmaster.try_again">Try again.</Trans></p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="explore" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col items-center">
              <AnalogClock minutes={minutes} />
              <p className="text-5xl font-bold text-white font-mono mt-4">{formatTime(minutes)}</p>
              <p className="text-purple-300 font-bold mt-1">{timePhrases[0]}</p>
              <p className="text-gray-500 text-sm">{timePhrases[1]}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.clockmaster.time_controls">Time Controls</Trans></h4>
                <input type="range" min="0" max="719" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full accent-purple-500" />
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[-60, -15, -5, 5, 15, 30, 45, 60].map((d) => (
                    <button key={d} className="py-2 rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20" onClick={() => changeTime(d)}>
                      {d > 0 ? '+' : ''}{d}<Trans i18nKey="auto.clockmaster.m">m</Trans>
                                              </button>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20">
                <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.clockmaster.how_to_read_it">How to read it</Trans></h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><span className="text-sky-400 font-bold"><Trans i18nKey="auto.clockmaster.short_orange_hand">Short orange hand</Trans></span> <Trans i18nKey="auto.clockmaster.points_to_the_hour">points to the hour.</Trans></p>
                  <p className="text-gray-300"><span className="text-blue-400 font-bold"><Trans i18nKey="auto.clockmaster.long_blue_hand">Long blue hand</Trans></span> <Trans i18nKey="auto.clockmaster.points_to_minutes">points to minutes.</Trans></p>
                  <p className="text-gray-300"><Trans i18nKey="auto.clockmaster.each_small_tick_is_1_minute_ea">Each small tick is 1 minute. Each number jump is 5 minutes.</Trans></p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 15, 30, 45, 60, 90].map((d) => (
                  <div key={d} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-gray-500 text-sm">+{d} <Trans i18nKey="auto.clockmaster.min">min</Trans></p>
                    <p className="text-white font-bold font-mono">{formatTime(minutes + d)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
