// src/worlds/early/modules/CoinCounter.tsx
// Indian currency shop. Drag coins to buy items.

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { INDIAN_COINS, SHOP_ITEMS } from '../data/earlyContent';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

export default function CoinCounter() {
  const { t } = useTranslation();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordPurchase } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [itemIdx, setItemIdx] = useState(0);
  const [paidPaise, setPaidPaise] = useState(0);
  const [coinsUsed, setCoinsUsed] = useState<number[]>([]);
  const [purchased, setPurchased] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const item = SHOP_ITEMS[itemIdx % SHOP_ITEMS.length];
  const isExact = paidPaise === item.priceInPaise;
  const isOver = paidPaise > item.priceInPaise;

  const handleAddCoin = useCallback((coinValue: number) => {
    if (purchased) return;
    const newPaid = paidPaise + coinValue;
    setPaidPaise(newPaid);
    setCoinsUsed(prev => [...prev, coinValue]);
    if (soundEnabled) try { AudioEngine.playTone({ frequency: 500 + coinValue * 0.3, type: 'sine', duration: 0.15, volume: 0.2, attack: 0.01, decay: 0.05 }); } catch (_) {}

    if (newPaid > item.priceInPaise + 500) {
      pip.sayCustom(t('auto.coincounter.too_many', 'Ooh! That might be too many coins! Try the right amount.'), 'curious');
    }
  }, [purchased, paidPaise, item, soundEnabled, pip]);

  const handlePay = useCallback(async () => {
    if (purchased) return;
    if (isExact) {
      setPurchased(true);
      pip.celebrate();
      if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
      await trackCorrect('coin-counter', { item: item.id, paid: paidPaise });
      await recordPurchase(true);
      setPurchaseCount(c => c + 1);
    } else if (isOver) {
      const change = paidPaise - item.priceInPaise;
      setPurchased(true);
      pip.sayCustom(`${t('auto.coincounter.here_is', 'Here is')} ₹${(change / 100).toFixed(change % 100 === 0 ? 0 : 2)} ${t('auto.coincounter.change_excl', 'change!')}`, 'excited');
      if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
      await trackCorrect('coin-counter', { item: item.id, paid: paidPaise, change });
      await recordPurchase(true);
      setPurchaseCount(c => c + 1);
    } else {
      pip.sayCustom(t('auto.coincounter.not_enough', 'Not enough coins yet! Add more.'), 'thinking');
      await trackWrong('coin-counter', { item: item.id, paid: paidPaise, needed: item.priceInPaise });
    }
  }, [purchased, isExact, isOver, paidPaise, item, soundEnabled, pip, trackCorrect, trackWrong, recordPurchase]);

  const handleNext = () => {
    setItemIdx(p => p + 1);
    setPaidPaise(0);
    setCoinsUsed([]);
    setPurchased(false);
    pip.sayCustom(t('auto.coincounter.what_next', 'What would you like next?'), 'excited');
  };

  const handleReset = () => {
    setPaidPaise(0);
    setCoinsUsed([]);
  };

  // Progress bar fill percentage
  const fillPct = Math.min(100, (paidPaise / item.priceInPaise) * 100);

  return (
    <EarlyShell module="coin-counter">
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex flex-col">
        {/* Pip shopkeeper header */}
        <div className="px-5 pt-6 pb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐤🏪</span>
              <div>
                <p className="text-lg font-bold text-gray-700"><Trans i18nKey="auto.coincounter.pip_s_shop">Pip's Shop</Trans></p>
                <p className="text-sm text-gray-500">{purchaseCount} <Trans i18nKey="auto.coincounter.items_purchased">items purchased</Trans></p>
              </div>
            </div>
          </div>
        </div>

        {/* Item to buy */}
        <div className="mx-5 bg-white rounded-3xl p-6 shadow-sm border border-amber-200 mb-4 text-center">
          <motion.div key={itemIdx} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-7xl mb-3">{item.emoji}</motion.div>
          <p className="font-bold text-gray-800 text-xl">{item.name}</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{item.priceDisplay}</p>
        </div>

        {/* Payment progress */}
        <div className="mx-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold text-gray-600"><Trans i18nKey="auto.coincounter.paid">Paid: ₹</Trans>{(paidPaise / 100).toFixed(paidPaise % 100 === 0 ? 0 : 2)}</span>
            <span className="text-base text-gray-500"><Trans i18nKey="auto.coincounter.need">Need:</Trans> {item.priceDisplay}</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" animate={{ width: `${fillPct}%` }}
              style={{ backgroundColor: isExact ? '#22C55E' : isOver ? '#F59E0B' : '#6C63FF' }} />
          </div>
          {coinsUsed.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {coinsUsed.map((c, i) => {
                const coin = INDIAN_COINS.find(ic => ic.value === c);
                return <span key={i} className="text-sm bg-amber-100 px-2 py-0.5 rounded-full text-amber-700">{coin?.label ?? `₹${c / 100}`}</span>;
              })}
            </div>
          )}
        </div>

        {/* Coins tray */}
        <div className="px-5 mb-4">
          <p className="text-sm text-gray-500 text-center mb-2"><Trans i18nKey="auto.coincounter.tap_coins_to_add">Tap coins to add</Trans></p>
          <div className="flex gap-3 justify-center flex-wrap">
            {INDIAN_COINS.map(coin => (
              <motion.button key={coin.value} whileTap={{ scale: 0.85 }} onClick={() => handleAddCoin(coin.value)}
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-amber-300 min-h-[64px]"
                style={{ backgroundColor: coin.color }}>
                <span className="text-xl">{coin.emoji}</span>
                <span className="text-sm font-extrabold text-gray-800">{coin.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 space-y-3 pb-24">
          {!purchased && (
            <>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handlePay}
                className={`w-full py-4 rounded-2xl font-bold text-xl min-h-[56px] transition-all ${
                  paidPaise >= item.priceInPaise ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                }`}>
                {paidPaise >= item.priceInPaise ? t('auto.coincounter.pay_now', '💰 Pay Now!') : t('auto.coincounter.add_more_coins', 'Add more coins...')}
              </motion.button>
              {coinsUsed.length > 0 && (
                <button onClick={handleReset} className="w-full py-3 text-gray-500 font-medium text-base min-h-[44px]"><Trans i18nKey="auto.coincounter.reset_coins">Reset coins</Trans></button>
              )}
            </>
          )}

          <AnimatePresence>
            {purchased && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-2xl p-5 border border-green-200 text-center">
                <div className="text-5xl mb-2">{item.emoji}</div>
                <p className="font-extrabold text-green-700 text-xl mb-1"><Trans i18nKey="auto.coincounter.purchased">Purchased!</Trans></p>
                {isOver && paidPaise > item.priceInPaise && (
                  <p className="text-base text-amber-600 mb-2"><Trans i18nKey="auto.coincounter.change">Change: ₹</Trans>{((paidPaise - item.priceInPaise) / 100).toFixed(0)}</p>
                )}
                <button onClick={handleNext} className="mt-3 px-6 py-3 bg-amber-500 text-white font-bold rounded-2xl min-h-[48px]"><Trans i18nKey="auto.coincounter.next_item">Next Item! 🏪</Trans></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </EarlyShell>
  );
}
