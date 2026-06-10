import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

interface Coin { name: string; value: number; emoji: string; color: string }

const COINS: Coin[] = [
  { name: 'Penny', value: 1, emoji: '🟤', color: 'from-amber-700 to-amber-900' },
  { name: 'Nickel', value: 5, emoji: '⚪', color: 'from-gray-400 to-gray-600' },
  { name: 'Dime', value: 10, emoji: '🪙', color: 'from-gray-300 to-gray-500' },
  { name: 'Quarter', value: 25, emoji: '🥇', color: 'from-yellow-300 to-yellow-600' },
  { name: 'Half Dollar', value: 50, emoji: '🏅', color: 'from-yellow-400 to-amber-600' },
  { name: 'Dollar', value: 100, emoji: '💵', color: 'from-green-400 to-green-600' },
];

function makeChange(amountCents: number): Record<number, number> {
  let rem = amountCents;
  const result: Record<number, number> = {};
  for (const c of [...COINS].reverse()) {
    const count = Math.floor(rem / c.value);
    if (count > 0) { result[c.value] = count; rem -= count * c.value; }
  }
  return result;
}

function makeChallenge() {
  const target = Math.floor(Math.random() * 450 + 25);
  return target;
}

export default function CoinCounter() {
  const [mode, setMode] = useState<'explore' | 'makechange' | 'challenge'>('explore');
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [target, setTarget] = useState(() => makeChallenge());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mastery, setMastery] = useState(0);

  const total = useMemo(() =>
    COINS.reduce((sum, c) => sum + (counts[c.value] || 0) * c.value, 0),
    [counts],
  );

  const addCoin = (value: number) => setCounts(p => ({ ...p, [value]: (p[value] || 0) + 1 }));
  const removeCoin = (value: number) => setCounts(p => ({ ...p, [value]: Math.max(0, (p[value] || 0) - 1) }));
  const clear = () => setCounts({});
  const totalCoins = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const optimalChange = useMemo(() => makeChange(target), [target]);

  const checkChange = useCallback(() => {
    if (total === target) {
      setFeedback('correct');
      setMastery(m => m + 1);
      setTimeout(() => { setTarget(makeChallenge()); clear(); setFeedback(null); }, 1500);
    } else if (total > target) {
      setFeedback('too-much');
      setTimeout(() => setFeedback(null), 1000);
    } else {
      setFeedback('not-enough');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [total, target]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.coincounter.coin_counter">🪙 Coin Counter</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.coincounter.count_coins_make_change_and_ma">Count coins, make change, and master money!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'explore' as const, emoji: '🔍', label: 'Count' },
          { id: 'makechange' as const, emoji: '💰', label: 'Make Change' },
          { id: 'challenge' as const, emoji: '🎯', label: 'Challenge' },
        ].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-green-500/30 text-green-300 border border-green-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); clear(); if (m.id === 'challenge') setTarget(makeChallenge()); }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      {/* Coin tray */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4">
        <p className="text-gray-400 text-sm mb-3"><Trans i18nKey="auto.coincounter.click_coins_to_add_them">Click coins to add them:</Trans></p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {COINS.map(c => (
            <motion.button key={c.value}
              className={`rounded-2xl p-3 border border-white/10 text-center bg-gradient-to-br ${c.color} relative`}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => addCoin(c.value)}>
              <span className="text-3xl">{c.emoji}</span>
              <p className="text-white font-bold text-sm mt-1">{c.name}</p>
              <p className="text-white/70 text-sm">{c.value}¢</p>
              {(counts[c.value] || 0) > 0 && (
                <motion.span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full text-sm font-bold flex items-center justify-center"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} key={counts[c.value]}>
                  {counts[c.value]}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
        {totalCoins > 0 && (
          <div className="flex items-center justify-between mt-4 bg-black/20 rounded-xl px-4 py-3">
            <div className="flex flex-wrap gap-1">
              {COINS.map(c => Array.from({ length: counts[c.value] || 0 }).map((_, i) => (
                <motion.button key={`${c.value}-${i}`} className="text-lg" onClick={() => removeCoin(c.value)}
                  initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} whileHover={{ scale: 1.3 }}
                  title={`Remove ${c.name}`}>{c.emoji}</motion.button>
              )))}
            </div>
            <button className="text-sm text-sky-400 hover:text-red-300 ml-4" onClick={clear}><Trans i18nKey="auto.coincounter.clear">Clear</Trans></button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/30 text-center mb-4">
        <p className="text-gray-400 text-sm"><Trans i18nKey="auto.coincounter.your_total">Your total</Trans></p>
        <motion.p key={total} className="text-5xl font-bold text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
          {formatMoney(total)}
        </motion.p>
        <p className="text-gray-500 text-sm mt-1">{totalCoins} <Trans i18nKey="auto.coincounter.coin">coin</Trans>{totalCoins !== 1 ? 's' : ''}</p>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'makechange' && (
          <motion.div key="mc" className="bg-white/5 rounded-2xl p-5 border border-white/10 max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.coincounter.fewest_coins_for_any_amount">💡 Fewest Coins for Any Amount</Trans></h4>
            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-400 text-sm"><Trans i18nKey="auto.coincounter.amount">Amount:</Trans></label>
              <input type="number" value={target} min={1} max={999}
                onChange={e => setTarget(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold text-center" />
              <span className="text-gray-400"><Trans i18nKey="auto.coincounter.cents">cents =</Trans> {formatMoney(target)}</span>
            </div>
            <div className="space-y-2">
              {COINS.filter(c => optimalChange[c.value]).map(c => (
                <div key={c.value} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-white font-bold">{optimalChange[c.value]} × {c.name}</span>
                  <span className="text-gray-400 text-sm ml-auto">= {formatMoney(optimalChange[c.value] * c.value)}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-3">
              <Trans i18nKey="auto.coincounter.total_coins_needed">Total coins needed:</Trans> {Object.values(optimalChange).reduce((a, b) => a + b, 0)}
            </p>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-2xl p-5 border-2 text-center ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback ? 'bg-white/5 border-white/10' : 'bg-purple-500/10 border-purple-500/30'}`}>
              <div className="flex justify-between mb-3">
                <span className="text-yellow-400 font-bold">⭐ {mastery}</span>
                <span className="text-gray-400 text-sm"><Trans i18nKey="auto.coincounter.make_exact_change">Make exact change</Trans></span>
              </div>
              <p className="text-gray-400"><Trans i18nKey="auto.coincounter.use_coins_above_to_make_exactl">Use coins above to make exactly</Trans></p>
              <p className="text-4xl font-bold text-purple-300 my-2">{formatMoney(target)}</p>
              <p className="text-gray-500 text-sm mb-4"><Trans i18nKey="auto.coincounter.your_total_so_far">Your total so far:</Trans> <span className={`font-bold ${total === target ? 'text-green-400' : total > target ? 'text-sky-400' : 'text-yellow-400'}`}>{formatMoney(total)}</span></p>
              <motion.button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={checkChange}>
                <Trans i18nKey="auto.coincounter.check">✓ Check</Trans>
                                            </motion.button>
              {feedback === 'correct' && <p className="text-green-400 font-bold mt-4"><Trans i18nKey="auto.coincounter.perfect_change">✅ Perfect change!</Trans></p>}
              {feedback === 'too-much' && <p className="text-sky-400 font-bold mt-4"><Trans i18nKey="auto.coincounter.too_much_remove_some_coins">Too much! Remove some coins.</Trans></p>}
              {feedback === 'not-enough' && <p className="text-yellow-400 font-bold mt-4"><Trans i18nKey="auto.coincounter.not_enough_yet_keep_adding_coi">Not enough yet — keep adding coins.</Trans></p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
