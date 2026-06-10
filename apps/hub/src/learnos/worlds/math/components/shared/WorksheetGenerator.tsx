import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

type Topic = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'fractions' | 'algebra' | 'exponents';

interface WorksheetProblem { question: string; answer: string; }

function generate(topic: Topic, count: number, maxNum: number): WorksheetProblem[] {
  const r = (max: number) => Math.floor(Math.random() * max) + 1;
  const problems: WorksheetProblem[] = [];

  for (let i = 0; i < count; i++) {
    const effectiveTopic = topic === 'mixed' ? (['addition', 'subtraction', 'multiplication', 'division'] as Topic[])[Math.floor(Math.random() * 4)] : topic;
    switch (effectiveTopic) {
      case 'addition': { const a = r(maxNum), b = r(maxNum); problems.push({ question: `${a} + ${b} =`, answer: String(a + b) }); break; }
      case 'subtraction': { const a = r(maxNum) + r(maxNum), b = r(Math.min(a, maxNum)); problems.push({ question: `${a} - ${b} =`, answer: String(a - b) }); break; }
      case 'multiplication': { const a = r(Math.min(maxNum, 12)), b = r(Math.min(maxNum, 12)); problems.push({ question: `${a} × ${b} =`, answer: String(a * b) }); break; }
      case 'division': { const b = r(Math.min(maxNum, 12)), ans = r(Math.min(maxNum, 12)); problems.push({ question: `${b * ans} ÷ ${b} =`, answer: String(ans) }); break; }
      case 'fractions': { const d = [2, 3, 4, 5, 6, 8][r(6) - 1]; const n1 = r(d - 1), n2 = r(d - 1); problems.push({ question: `${n1}/${d} + ${n2}/${d} =`, answer: `${n1 + n2}/${d}` }); break; }
      case 'algebra': { const a = r(8) + 1, ans = r(maxNum); problems.push({ question: `${a}x = ${a * ans},  x =`, answer: String(ans) }); break; }
      case 'exponents': { const b = r(5) + 1, e = r(3) + 1; problems.push({ question: `${b}^${e} =`, answer: String(Math.pow(b, e)) }); break; }
    }
  }
  return problems;
}

export default function WorksheetGenerator() {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<Topic>('mixed');
  const [count, setCount] = useState(12);
  const [maxNum, setMaxNum] = useState(20);
  const [showAnswers, setShowAnswers] = useState(false);
  const [generated, setGenerated] = useState(false);

  const problems = useMemo(() => generated ? generate(topic, count, maxNum) : [], [generated, topic, count, maxNum]);

  const topics: { id: Topic; label: string; emoji: string }[] = [
    { id: 'addition', label: t('math_modules.WorksheetGenerator.topics.addition', 'Addition'), emoji: '➕' },
    { id: 'subtraction', label: t('math_modules.WorksheetGenerator.topics.subtraction', 'Subtraction'), emoji: '➖' },
    { id: 'multiplication', label: t('math_modules.WorksheetGenerator.topics.multiplication', 'Multiplication'), emoji: '✖️' },
    { id: 'division', label: t('math_modules.WorksheetGenerator.topics.division', 'Division'), emoji: '➗' },
    { id: 'mixed', label: t('math_modules.WorksheetGenerator.topics.mixed', 'Mixed'), emoji: '🎲' },
    { id: 'fractions', label: t('math_modules.WorksheetGenerator.topics.fractions', 'Fractions'), emoji: '🍕' },
    { id: 'algebra', label: t('math_modules.WorksheetGenerator.topics.algebra', 'Algebra'), emoji: '🧮' },
    { id: 'exponents', label: t('math_modules.WorksheetGenerator.topics.exponents', 'Exponents'), emoji: '⚡' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6 print:hidden">
        <h2 className="text-3xl font-bold text-white mb-2">{t('math_modules.WorksheetGenerator.title', '📝 Worksheet Generator')}</h2>
        <p className="text-purple-300 text-lg">{t('math_modules.WorksheetGenerator.subtitle', 'Generate printable practice sheets for any topic!')}</p>
      </div>

      {/* Controls — hidden when printing */}
      <div className="no-print space-y-4 max-w-2xl mx-auto mb-6">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h4 className="text-white font-bold mb-3">{t('math_modules.WorksheetGenerator.chooseTopic', 'Choose Topic')}</h4>
          <div className="flex flex-wrap gap-2">
            {topics.map(t => (
              <button key={t.id}
                className={`px-3 py-2 rounded-xl text-sm font-bold ${topic === t.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/10 text-gray-400'}`}
                onClick={() => { setTopic(t.id); setGenerated(false); }}>{t.emoji} {t.label}</button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm">{t('math_modules.WorksheetGenerator.numProblems', 'Number of problems')}</label>
            <input type="range" min="6" max="30" step="2" value={count} onChange={e => { setCount(Number(e.target.value)); setGenerated(false); }} className="w-full accent-purple-500 mt-1" />
            <p className="text-white font-bold text-center">{count}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">{t('math_modules.WorksheetGenerator.maxNum', 'Max number')}</label>
            <input type="range" min="10" max="100" step="5" value={maxNum} onChange={e => { setMaxNum(Number(e.target.value)); setGenerated(false); }} className="w-full accent-blue-500 mt-1" />
            <p className="text-white font-bold text-center">{maxNum}</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGenerated(true)}
          >
            {t('math_modules.WorksheetGenerator.generate', '📄 Generate Worksheet')}
          </motion.button>
          {generated && (
            <>
              <motion.button
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
              >
                {t('math_modules.WorksheetGenerator.print', '🖨️ Print')}
              </motion.button>
              <motion.button
                className={`px-4 py-3 rounded-xl text-sm font-bold ${showAnswers ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-gray-400'}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? t('math_modules.WorksheetGenerator.hideAnswers', '🙈 Hide') : t('math_modules.WorksheetGenerator.showAnswers', '👁️ Answers')}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Worksheet — styled for both screen and print */}
      {generated && (
        <div className="print-sheet max-w-3xl mx-auto bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">
              {t('math_modules.WorksheetGenerator.worksheetTitle', '📝 Math Worksheet — {{topic}}', { topic: topics.find(t_ => t_.id === topic)?.label })}
            </h3>
            <p className="print-subtext text-gray-400 text-sm mt-1">
              {t('math_modules.WorksheetGenerator.name', 'Name')}<Trans i18nKey="auto.worksheetgenerator.nbsp_nbsp">: _________________ &nbsp;&nbsp;</Trans> {t('math_modules.WorksheetGenerator.date', 'Date')}<Trans i18nKey="auto.worksheetgenerator.nbsp_nbsp">: _________________ &nbsp;&nbsp;</Trans> {t('math_modules.WorksheetGenerator.score', 'Score')}: ___/{count}
            </p>
          </div>

          {/* Problems grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {problems.map((p, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm font-bold w-6">{i + 1}.</span>
                  <span className="text-white font-mono text-lg font-bold">{p.question}</span>
                  <span className="flex-1 border-b border-dashed border-white/20 ml-1" />
                </div>
                {showAnswers && (
                  <motion.span className="print-answer text-green-400 text-sm font-bold ml-8 mt-1"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    = {p.answer}
                  </motion.span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <p className="print-subtext text-gray-500 text-sm">
              {t('math_modules.WorksheetGenerator.generatedBy', 'Generated by Whimsical Math Kingdom 🧙‍♂️')} • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
