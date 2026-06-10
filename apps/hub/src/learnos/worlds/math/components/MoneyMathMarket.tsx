import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

type MoneyMode = 'discounts' | 'profit' | 'interest' | 'challenge';

interface ChallengeQ {
  question: string;
  answer: number;
  options: number[];
  type: string;
}

export default function MoneyMathMarket() {
  const [mode, setMode] = useState<MoneyMode>('discounts');

  const modes = [
    { id: 'discounts' as MoneyMode, emoji: '🏷️', label: 'Discounts', desc: '% off prices' },
    { id: 'profit' as MoneyMode, emoji: '📈', label: 'Profit/Loss', desc: 'Business math' },
    { id: 'interest' as MoneyMode, emoji: '🏦', label: 'Interest', desc: 'Simple & compound' },
    { id: 'challenge' as MoneyMode, emoji: '🎯', label: 'Challenge', desc: 'Mixed quiz' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.moneymathmarket.money_math_market">💰 Money Math Market</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.moneymathmarket.master_real_world_money_calcul">Master real-world money calculations!</Trans></p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {modes.map(m => (
          <motion.button key={m.id}
            className={`p-3 rounded-xl border-2 text-center ${mode === m.id ? 'border-green-400/50 bg-green-500/20' : 'border-white/10 bg-white/5'}`}
            whileTap={{ scale: 0.97 }} onClick={() => setMode(m.id)}>
            <span className="text-xl">{m.emoji}</span>
            <p className="text-white font-bold text-sm mt-1">{m.label}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          {mode === 'discounts' && <DiscountCalculator />}
          {mode === 'profit' && <ProfitLossCalculator />}
          {mode === 'interest' && <InterestCalculator />}
          {mode === 'challenge' && <MoneyChallenge />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(80);
  const [discount, setDiscount] = useState(25);

  const savings = useMemo(() => (originalPrice * discount) / 100, [originalPrice, discount]);
  const finalPrice = useMemo(() => originalPrice - savings, [originalPrice, savings]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h4 className="text-white font-bold mb-4"><Trans i18nKey="auto.moneymathmarket.set_the_price_discount">🏷️ Set the Price & Discount</Trans></h4>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.original_price">Original Price ($)</Trans></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="10" max="500" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} className="flex-1 accent-blue-500" />
                <span className="text-white font-bold text-xl w-16">${originalPrice}</span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.discount">Discount (%)</Trans></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="5" max="90" step="5" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="flex-1 accent-red-500" />
                <span className="text-sky-400 font-bold text-xl w-16">{discount}%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {[10, 25, 50, 75].map(d => (
              <button key={d} onClick={() => setDiscount(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${discount === d ? 'bg-red-500/40 text-red-300' : 'bg-white/10 text-gray-400'}`}>
                {d}<Trans i18nKey="auto.moneymathmarket.off">% off</Trans>
                                  </button>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-5 border border-blue-500/20">
          <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.moneymathmarket.visual_breakdown">📊 Visual Breakdown</Trans></h4>
          <div className="h-8 bg-gray-700 rounded-full overflow-hidden flex">
            <motion.div className="h-full bg-green-500 flex items-center justify-center text-sm font-bold text-white"
              animate={{ width: `${(finalPrice / originalPrice) * 100}%` }} transition={{ duration: 0.5 }}>
              ${finalPrice.toFixed(0)}
            </motion.div>
            <motion.div className="h-full bg-red-500/60 flex items-center justify-center text-sm font-bold text-white"
              animate={{ width: `${(savings / originalPrice) * 100}%` }} transition={{ duration: 0.5 }}>
              -${savings.toFixed(0)}
            </motion.div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-green-400"><Trans i18nKey="auto.moneymathmarket.you_pay">You pay</Trans></span>
            <span className="text-sky-400"><Trans i18nKey="auto.moneymathmarket.you_save">You save</Trans></span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/30 text-center">
          <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.final_price">Final Price</Trans></p>
          <motion.p key={finalPrice} className="text-5xl font-bold text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            ${finalPrice.toFixed(2)}
          </motion.p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-2xl p-6 border border-red-500/30 text-center">
          <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.you_save">You Save</Trans></p>
          <motion.p key={savings} className="text-4xl font-bold text-sky-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            ${savings.toFixed(2)}
          </motion.p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.moneymathmarket.formula">📝 Formula</Trans></h4>
          <p className="text-gray-300 text-sm font-mono">
            <Trans i18nKey="auto.moneymathmarket.savings_price_discount_100">Savings = Price × (Discount% ÷ 100)</Trans><br />
            = ${originalPrice} × ({discount}<Trans i18nKey="auto.moneymathmarket.100">% ÷ 100)</Trans><br />
            = ${originalPrice} × {(discount / 100).toFixed(2)} = <span className="text-sky-400">${savings.toFixed(2)}</span>
          </p>
          <p className="text-gray-300 text-sm font-mono mt-2">
            <Trans i18nKey="auto.moneymathmarket.final">Final = $</Trans>{originalPrice} - ${savings.toFixed(2)} = <span className="text-green-400">${finalPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfitLossCalculator() {
  const [costPrice, setCostPrice] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(65);

  const profitLoss = useMemo(() => sellingPrice - costPrice, [costPrice, sellingPrice]);
  const percentage = useMemo(() => (profitLoss / costPrice) * 100, [profitLoss, costPrice]);
  const isProfit = profitLoss >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h4 className="text-white font-bold mb-4"><Trans i18nKey="auto.moneymathmarket.set_prices">💼 Set Prices</Trans></h4>
        <div className="space-y-4">
          <div>
            <label className="text-blue-400 text-sm font-bold"><Trans i18nKey="auto.moneymathmarket.cost_price_cp_what_you_paid">Cost Price (CP) - What you paid</Trans></label>
            <div className="flex items-center gap-3 mt-1">
              <input type="range" min="10" max="200" value={costPrice} onChange={e => setCostPrice(Number(e.target.value))} className="flex-1 accent-blue-500" />
              <span className="text-blue-400 font-bold text-xl w-16">${costPrice}</span>
            </div>
          </div>
          <div>
            <label className="text-sky-400 text-sm font-bold"><Trans i18nKey="auto.moneymathmarket.selling_price_sp_what_you_sold">Selling Price (SP) - What you sold for</Trans></label>
            <div className="flex items-center gap-3 mt-1">
              <input type="range" min="10" max="200" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} className="flex-1 accent-orange-500" />
              <span className="text-sky-400 font-bold text-xl w-16">${sellingPrice}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-white/5 text-sm">
          <p className="text-gray-400">💡 <strong className="text-white"><Trans i18nKey="auto.moneymathmarket.tip">Tip:</Trans></strong> <Trans i18nKey="auto.moneymathmarket.sp_gt_cp_profit_sp_lt_cp_loss">SP &gt; CP = Profit, SP &lt; CP = Loss</Trans></p>
        </div>
      </div>

      <div className="space-y-4">
        <motion.div
          className={`rounded-2xl p-6 border-2 text-center ${isProfit ? 'bg-green-500/10 border-green-500/40' : 'bg-white/5 border-white/10'}`}
          key={profitLoss}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <span className="text-5xl">{isProfit ? '📈' : '📉'}</span>
          <p className={`text-3xl font-bold mt-2 ${isProfit ? 'text-green-400' : 'text-sky-400'}`}>
            {isProfit ? 'PROFIT' : 'LOSS'}: ${Math.abs(profitLoss).toFixed(2)}
          </p>
          <p className={`text-xl font-bold ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
            {isProfit ? '+' : '-'}{Math.abs(percentage).toFixed(1)}%
          </p>
        </motion.div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.moneymathmarket.formulas">📝 Formulas</Trans></h4>
          <div className="text-sm font-mono space-y-1">
            <p className="text-gray-300"><Trans i18nKey="auto.moneymathmarket.profit_loss_sp_cp">Profit/Loss = SP - CP = $</Trans>{sellingPrice} - ${costPrice} = <span className={isProfit ? 'text-green-400' : 'text-sky-400'}>${profitLoss}</span></p>
            <p className="text-gray-300"><Trans i18nKey="auto.moneymathmarket.percentage_p_l_cp_100">Percentage = (P/L ÷ CP) × 100</Trans></p>
            <p className="text-gray-300">= ({Math.abs(profitLoss)} ÷ {costPrice}<Trans i18nKey="auto.moneymathmarket.100">) × 100 =</Trans> <span className={isProfit ? 'text-green-400' : 'text-sky-400'}>{percentage.toFixed(1)}%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterestCalculator() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(3);
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple');

  const simpleInterest = useMemo(() => (principal * rate * time) / 100, [principal, rate, time]);
  const compoundInterest = useMemo(() => principal * Math.pow(1 + rate / 100, time) - principal, [principal, rate, time]);
  const finalAmount = useMemo(() => 
    interestType === 'simple' ? principal + simpleInterest : principal + compoundInterest,
    [interestType, principal, simpleInterest, compoundInterest]
  );
  const interest = interestType === 'simple' ? simpleInterest : compoundInterest;

  // Yearly breakdown for compound
  const yearlyBreakdown = useMemo(() => {
    const years: { year: number; amount: number; interest: number }[] = [];
    let amount = principal;
    for (let y = 1; y <= time; y++) {
      const newAmount = amount * (1 + rate / 100);
      years.push({ year: y, amount: newAmount, interest: newAmount - amount });
      amount = newAmount;
    }
    return years;
  }, [principal, rate, time]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 mb-4">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${interestType === 'simple' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setInterestType('simple')}><Trans i18nKey="auto.moneymathmarket.simple_interest">Simple Interest</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${interestType === 'compound' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-gray-400'}`}
          onClick={() => setInterestType('compound')}><Trans i18nKey="auto.moneymathmarket.compound_interest">Compound Interest</Trans></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h4 className="text-white font-bold mb-4"><Trans i18nKey="auto.moneymathmarket.set_values">💰 Set Values</Trans></h4>
          <div className="space-y-4">
            <div>
              <label className="text-green-400 text-sm font-bold"><Trans i18nKey="auto.moneymathmarket.principal_p_starting_amount">Principal (P) - Starting amount</Trans></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="100" max="10000" step="100" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="flex-1 accent-green-500" />
                <span className="text-green-400 font-bold w-20">${principal}</span>
              </div>
            </div>
            <div>
              <label className="text-blue-400 text-sm font-bold"><Trans i18nKey="auto.moneymathmarket.rate_r_annual_interest">Rate (R) - Annual % interest</Trans></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="1" max="20" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="flex-1 accent-blue-500" />
                <span className="text-blue-400 font-bold w-20">{rate}%</span>
              </div>
            </div>
            <div>
              <label className="text-sky-400 text-sm font-bold"><Trans i18nKey="auto.moneymathmarket.time_t_years">Time (T) - Years</Trans></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="1" max="10" value={time} onChange={e => setTime(Number(e.target.value))} className="flex-1 accent-orange-500" />
                <span className="text-sky-400 font-bold w-20">{time} <Trans i18nKey="auto.moneymathmarket.yr">yr</Trans></span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/30 text-center">
            <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.final_amount">Final Amount</Trans></p>
            <motion.p key={finalAmount} className="text-4xl font-bold text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              ${finalAmount.toFixed(2)}
            </motion.p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-5 border border-yellow-500/30 text-center">
            <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.interest_earned">Interest Earned</Trans></p>
            <motion.p key={interest} className="text-3xl font-bold text-yellow-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              +${interest.toFixed(2)}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.moneymathmarket.formula">📝 Formula</Trans></h4>
        {interestType === 'simple' ? (
          <p className="text-gray-300 text-sm font-mono">
            <Trans i18nKey="auto.moneymathmarket.simple_interest_p_r_t_100">Simple Interest = (P × R × T) ÷ 100 = (</Trans>{principal} × {rate} × {time}<Trans i18nKey="auto.moneymathmarket.100">) ÷ 100 =</Trans> <span className="text-yellow-400">${simpleInterest.toFixed(2)}</span>
          </p>
        ) : (
          <div className="text-sm font-mono">
            <p className="text-gray-300"><Trans i18nKey="auto.moneymathmarket.compound_interest_p_1_r_100_t_">Compound Interest = P × (1 + R/100)^T - P</Trans></p>
            <p className="text-gray-300">= {principal} <Trans i18nKey="auto.moneymathmarket.1">× (1 +</Trans> {rate}<Trans i18nKey="auto.moneymathmarket.100">/100)^</Trans>{time} - {principal}</p>
            <p className="text-gray-300">= {principal} × {(Math.pow(1 + rate / 100, time)).toFixed(4)} - {principal} = <span className="text-yellow-400">${compoundInterest.toFixed(2)}</span></p>
          </div>
        )}
      </div>

      {interestType === 'compound' && (
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.moneymathmarket.year_by_year_growth">📅 Year-by-Year Growth</Trans></h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.year_0">Year 0</Trans></p>
              <p className="text-white font-bold">${principal}</p>
            </div>
            {yearlyBreakdown.map(y => (
              <div key={y.year} className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-gray-400 text-sm"><Trans i18nKey="auto.moneymathmarket.year">Year</Trans> {y.year}</p>
                <p className="text-white font-bold">${y.amount.toFixed(0)}</p>
                <p className="text-green-400 text-sm">+${y.interest.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MoneyChallenge() {
  const [question, setQuestion] = useState<ChallengeQ | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);

  const generateQuestion = useCallback((): ChallengeQ => {
    const types = ['discount', 'profit', 'interest', 'percentage'];
    const type = types[Math.floor(Math.random() * types.length)];
    const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

    switch (type) {
      case 'discount': {
        const price = r(5, 20) * 10;
        const disc = [10, 20, 25, 50][r(0, 3)];
        const answer = price - (price * disc / 100);
        return {
          question: `A shirt costs $${price}. What is the price after ${disc}% off?`,
          answer,
          options: [answer, answer + 10, answer - 5, answer + 15].sort(() => Math.random() - 0.5),
          type: '🏷️ Discount'
        };
      }
      case 'profit': {
        const cp = r(3, 15) * 10;
        const sp = cp + r(1, 5) * 10;
        const answer = sp - cp;
        return {
          question: `Bought for $${cp}, sold for $${sp}. What is the profit?`,
          answer,
          options: [answer, answer + 10, answer - 10, cp].sort(() => Math.random() - 0.5),
          type: '📈 Profit'
        };
      }
      case 'interest': {
        const p = r(1, 10) * 100;
        const rate = r(2, 10);
        const t = r(1, 3);
        const answer = (p * rate * t) / 100;
        return {
          question: `Simple interest on $${p} at ${rate}% for ${t} year${t > 1 ? 's' : ''}?`,
          answer,
          options: [answer, answer + 10, answer * 2, p * rate / 100].sort(() => Math.random() - 0.5),
          type: '🏦 Interest'
        };
      }
      default: {
        const whole = r(2, 10) * 10;
        const pct = [10, 20, 25, 50][r(0, 3)];
        const answer = (whole * pct) / 100;
        return {
          question: `What is ${pct}% of $${whole}?`,
          answer,
          options: [answer, answer + 5, whole / pct, answer * 2].sort(() => Math.random() - 0.5),
          type: '% Percentage'
        };
      }
    }
  }, []);

  useState(() => { setQuestion(generateQuestion()); });

  const handleAnswer = (opt: number) => {
    if (!question || feedback) return;
    if (opt === question.answer) {
      setFeedback('correct');
      setMastery(m => m + 1);
      setStreak(s => s + 1);
      setTimeout(() => { setQuestion(generateQuestion()); setFeedback(null); }, 1000);
    } else {
      setFeedback('hint');
      setStreak(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!question) {
    setQuestion(generateQuestion());
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-center gap-4 mb-4">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {mastery}</span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-sky-400 font-bold text-sm">🔥 {streak}</span>
      </div>

      <motion.div
        key={question.question}
        className={`rounded-2xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{question.type}</span>
        <p className="text-xl font-bold text-white mt-3 mb-6">{question.question}</p>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => (
            <motion.button key={i}
              className={`py-3 rounded-xl text-lg font-bold ${
                feedback === 'correct' && opt === question.answer ? 'bg-green-500 text-white'
                : feedback === 'hint' && opt === question.answer ? 'bg-green-500/50 text-green-200'
                : feedback ? 'bg-white/5 text-gray-500'
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
            >
              ${opt}
            </motion.button>
          ))}
        </div>

        {feedback === 'correct' && <p className="text-green-400 font-bold mt-4 text-center"><Trans i18nKey="auto.moneymathmarket.correct">✅ Correct! 💰</Trans></p>}
        {feedback === 'hint' && <p className="text-sky-400 font-bold mt-4 text-center"><Trans i18nKey="auto.moneymathmarket.answer">🤔 Answer: $</Trans>{question.answer}</p>}
      </motion.div>

      <button className="w-full mt-4 text-gray-500 hover:text-gray-400 text-sm" onClick={() => setQuestion(generateQuestion())}>
        <Trans i18nKey="auto.moneymathmarket.skip">Skip →</Trans>
                    </button>
    </div>
  );
}
