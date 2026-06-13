import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

interface Player { name: string; emoji: string; gamesPlayed: number; hits: number; atBats: number; goals: number; assists: number; points: number; }

const PLAYERS: Player[] = [
  { name: 'Virat', emoji: '🏏', gamesPlayed: 20, hits: 52, atBats: 160, goals: 12, assists: 8, points: 340 },
  { name: 'Sindhu', emoji: '�', gamesPlayed: 18, hits: 38, atBats: 130, goals: 15, assists: 14, points: 420 },
  { name: 'Chhetri', emoji: '⚽', gamesPlayed: 22, hits: 60, atBats: 180, goals: 18, assists: 6, points: 290 },
  { name: 'Manpreet', emoji: '�', gamesPlayed: 16, hits: 44, atBats: 140, goals: 8, assists: 20, points: 380 },
  { name: 'Pardeep', emoji: '🤼', gamesPlayed: 24, hits: 70, atBats: 200, goals: 22, assists: 10, points: 510 },
  { name: 'Sania', emoji: '�', gamesPlayed: 14, hits: 30, atBats: 100, goals: 6, assists: 4, points: 210 },
];

export default function SportsStats() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'dashboard' | 'challenge'>('dashboard');
  const [sortBy, setSortBy] = useState<'avg' | 'ppg' | 'goals'>('avg');
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const makeChallenge = useCallback(() => {
    const p = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
    const type = Math.floor(Math.random() * 4);
    if (type === 0) { const answer = Math.round((p.hits / p.atBats) * 1000) / 1000; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(Math.round((answer + (Math.random() - 0.5) * 0.2) * 1000) / 1000); return { question: t('auto.sportsstats.q_avg', '{{name}} has {{hits}} points in {{atBats}} matches. Average?', { name: p.name, hits: p.hits, atBats: p.atBats }), answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: t('auto.sportsstats.type_avg', 'Average') }; }
    if (type === 1) { const answer = Math.round(p.points / p.gamesPlayed * 10) / 10; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(Math.round((answer + (Math.random() - 0.5) * 8) * 10) / 10); return { question: t('auto.sportsstats.q_ppg', '{{name}} scored {{points}} points in {{gamesPlayed}} matches. Points per match?', { name: p.name, points: p.points, gamesPlayed: p.gamesPlayed }), answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: t('auto.sportsstats.type_ppg', 'Points/Match') }; }
    if (type === 2) { const answer = p.goals + p.assists; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(answer + Math.floor(Math.random() * 11) - 5); return { question: t('auto.sportsstats.q_total', '{{name}}: {{goals}} goals, {{assists}} assists. Total contributions?', { name: p.name, goals: p.goals, assists: p.assists }), answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: t('auto.sportsstats.type_total', 'Total') }; }
    const win = Math.floor(Math.random() * 10) + 5; const loss = Math.floor(Math.random() * 10) + 2; const answer = Math.round((win / (win + loss)) * 100); const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(answer + Math.floor(Math.random() * 21) - 10);
    return { question: t('auto.sportsstats.q_win', 'Team record: {{win}} wins, {{loss}} losses. Win percentage?', { win, loss }), answer: String(answer) + '%', options: [...wrongs].map(w => w + '%').sort(() => Math.random() - 0.5), type: t('auto.sportsstats.type_win', 'Win %') };
  }, [t]);

  const [challenge, setChallenge] = useState(() => makeChallenge());

  const sorted = useMemo(() => {
    return [...PLAYERS].sort((a, b) => {
      if (sortBy === 'avg') return (b.hits / b.atBats) - (a.hits / a.atBats);
      if (sortBy === 'ppg') return (b.points / b.gamesPlayed) - (a.points / a.gamesPlayed);
      return b.goals - a.goals;
    });
  }, [sortBy]);

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setMastery(m => m + 1); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.sportsstats.sports_statistics">⚽ Sports Statistics</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.sportsstats.averages_rankings_and_win_prob">Averages, rankings, and win probability — real sports math!</Trans></p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'dashboard' ? 'bg-green-500/30 text-green-300 border border-green-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('dashboard')}><Trans i18nKey="auto.sportsstats.dashboard">📊 Dashboard</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}><Trans i18nKey="auto.sportsstats.challenge">🎯 Challenge</Trans></button>
      </div>
      <AnimatePresence mode="wait">
        {mode === 'dashboard' ? (
          <motion.div key="d" className="max-w-3xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex justify-center gap-2 mb-2">
              {[{ id: 'avg' as const, label: t('auto.sportsstats.batting_avg', 'Batting Avg') }, { id: 'ppg' as const, label: t('auto.sportsstats.pts_game', 'Pts/Game') }, { id: 'goals' as const, label: t('auto.sportsstats.goals', 'Goals') }].map(s => (
                <button key={s.id} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${sortBy === s.id ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-gray-400'}`} onClick={() => setSortBy(s.id)}><Trans i18nKey="auto.sportsstats.sort">Sort:</Trans> {s.label}</button>
              ))}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="text-gray-400 border-b border-white/10 text-left"><th className="p-3">#</th><th className="p-3"><Trans i18nKey="auto.sportsstats.player">Player</Trans></th><th className="p-3"><Trans i18nKey="auto.sportsstats.gp">GP</Trans></th><th className="p-3"><Trans i18nKey="auto.sportsstats.avg">AVG</Trans></th><th className="p-3"><Trans i18nKey="auto.sportsstats.ppg">PPG</Trans></th><th className="p-3"><Trans i18nKey="auto.sportsstats.g">G</Trans></th><th className="p-3"><Trans i18nKey="auto.sportsstats.a">A</Trans></th></tr></thead>
                <tbody>
                  {sorted.map((p, i) => (
                    <motion.tr key={p.name} className={`border-b border-white/5 ${i === 0 ? 'bg-yellow-500/10' : ''}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <td className="p-3 text-gray-500">{i + 1}</td>
                      <td className="p-3 text-white font-bold">{p.emoji} {p.name}</td>
                      <td className="p-3 text-gray-300">{p.gamesPlayed}</td>
                      <td className="p-3 text-blue-400 font-mono">{(p.hits / p.atBats).toFixed(3)}</td>
                      <td className="p-3 text-green-400 font-mono">{(p.points / p.gamesPlayed).toFixed(1)}</td>
                      <td className="p-3 text-sky-400">{p.goals}</td>
                      <td className="p-3 text-purple-400">{p.assists}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Visual bar chart for selected stat */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3">{sortBy === 'avg' ? t('auto.sportsstats.chart_avg', 'Average') : sortBy === 'ppg' ? t('auto.sportsstats.chart_ppg', 'Points per Match') : t('auto.sportsstats.chart_goals', 'Goals')}</h4>
              <div className="space-y-2">
                {sorted.map((p, i) => { const val = sortBy === 'avg' ? p.hits / p.atBats : sortBy === 'ppg' ? p.points / p.gamesPlayed : p.goals; const max = sortBy === 'avg' ? 0.5 : sortBy === 'ppg' ? 30 : 25; return (
                  <div key={p.name} className="flex items-center gap-2"><span className="w-16 text-sm text-gray-400">{p.emoji} {p.name}</span><div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden"><motion.div className={`h-full rounded-full ${i === 0 ? 'bg-yellow-500' : 'bg-blue-500'}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (val / max) * 100)}%` }} transition={{ delay: i * 0.1 }} /></div><span className="text-white font-bold text-sm w-12 text-right">{val.toFixed(sortBy === 'avg' ? 3 : 1)}</span></div>
                ); })}
              </div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 text-sm text-green-300">
              💡 <strong><Trans i18nKey="auto.sportsstats.batting_average">Average</Trans></strong> <Trans i18nKey="auto.sportsstats.hits_at_bats">= Points ÷ Matches.</Trans> <strong><Trans i18nKey="auto.sportsstats.ppg">Points/Match</Trans></strong> <Trans i18nKey="auto.sportsstats.total_points_games_played_clic">= Total Points ÷ Matches Played. Click "Sort" to rank players by different stats!</Trans>
                                      </div>
          </motion.div>
        ) : (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span><span className="text-sm text-gray-400">{challenge.type}</span></div>
              <p className="text-lg font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">{challenge.options.map(opt => <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>)}</div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.sportsstats.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.sportsstats.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
