import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, Zap, Filter } from 'lucide-react';
import { playCorrect, playWrong, playVictory } from '../lib/sounds';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  system: string;
  emoji: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const allQuestions: Question[] = [
  // Easy
  { id: 1, question: 'What is the largest organ in the human body?', options: ['Heart', 'Liver', 'Skin', 'Brain'], correct: 2, system: 'Integumentary', emoji: '🧴', explanation: 'The skin is the largest organ, weighing about 8 pounds and covering about 22 square feet!', difficulty: 'easy' },
  { id: 2, question: 'How many bones does an adult human body have?', options: ['106', '206', '306', '186'], correct: 1, system: 'Skeletal', emoji: '🦴', explanation: 'Adults have 206 bones. Babies are born with about 270 bones, but some fuse together as they grow!', difficulty: 'easy' },
  { id: 3, question: 'Which blood cells fight infections?', options: ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma'], correct: 2, system: 'Immune', emoji: '🛡️', explanation: 'White blood cells (leukocytes) are your body\'s defense army!', difficulty: 'easy' },
  { id: 4, question: 'What gas do we breathe in that our cells need?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correct: 2, system: 'Respiratory', emoji: '🫁', explanation: 'We breathe in oxygen which is used in cellular respiration to produce energy (ATP)!', difficulty: 'easy' },
  { id: 5, question: 'What organ pumps blood throughout the body?', options: ['Lungs', 'Brain', 'Liver', 'Heart'], correct: 3, system: 'Circulatory', emoji: '❤️', explanation: 'The heart beats about 100,000 times per day!', difficulty: 'easy' },
  { id: 6, question: 'Where does most nutrient absorption occur?', options: ['Stomach', 'Small intestine', 'Large intestine', 'Esophagus'], correct: 1, system: 'Digestive', emoji: '🫃', explanation: 'The small intestine has a surface area roughly the size of a tennis court!', difficulty: 'easy' },
  { id: 7, question: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correct: 2, system: 'Circulatory', emoji: '❤️', explanation: 'The heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower).', difficulty: 'easy' },
  { id: 8, question: 'What carries oxygen in the blood?', options: ['White blood cells', 'Platelets', 'Hemoglobin', 'Plasma'], correct: 2, system: 'Circulatory', emoji: '🩸', explanation: 'Hemoglobin is an iron-containing protein in red blood cells that binds to oxygen.', difficulty: 'easy' },
  { id: 9, question: 'Which organ produces bile?', options: ['Stomach', 'Pancreas', 'Liver', 'Gallbladder'], correct: 2, system: 'Digestive', emoji: '🟤', explanation: 'The liver produces bile, which is stored in the gallbladder and helps digest fats.', difficulty: 'easy' },
  { id: 10, question: 'What is the body\'s control center?', options: ['Heart', 'Brain', 'Liver', 'Spinal cord'], correct: 1, system: 'Nervous', emoji: '🧠', explanation: 'The brain controls all body functions, thoughts, and emotions. It contains ~86 billion neurons!', difficulty: 'easy' },

  // Medium
  { id: 11, question: 'What structure in the brain controls balance?', options: ['Cerebrum', 'Cerebellum', 'Brain stem', 'Hypothalamus'], correct: 1, system: 'Nervous', emoji: '🧠', explanation: 'The cerebellum coordinates voluntary movements, balance, and posture!', difficulty: 'medium' },
  { id: 12, question: 'Which gland is known as the "master gland"?', options: ['Thyroid', 'Adrenal', 'Pituitary', 'Pancreas'], correct: 2, system: 'Endocrine', emoji: '⚡', explanation: 'The pituitary gland controls other glands and is only the size of a pea!', difficulty: 'medium' },
  { id: 13, question: 'What type of muscle makes up the heart?', options: ['Skeletal muscle', 'Smooth muscle', 'Cardiac muscle', 'Connective tissue'], correct: 2, system: 'Muscular', emoji: '💪', explanation: 'Cardiac muscle is unique — it contracts automatically and never gets tired!', difficulty: 'medium' },
  { id: 14, question: 'What organ filters waste from the blood?', options: ['Liver', 'Kidney', 'Spleen', 'Gallbladder'], correct: 1, system: 'Urinary', emoji: '🫘', explanation: 'Kidneys filter about 200 liters of blood daily!', difficulty: 'medium' },
  { id: 15, question: 'What connects muscles to bones?', options: ['Ligaments', 'Cartilage', 'Tendons', 'Fascia'], correct: 2, system: 'Muscular', emoji: '💪', explanation: 'Tendons connect muscle to bone; ligaments connect bone to bone. The Achilles tendon is the largest.', difficulty: 'medium' },
  { id: 16, question: 'Which part of the blood carries nutrients?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], correct: 3, system: 'Circulatory', emoji: '🩸', explanation: 'Plasma is 55% of blood volume and transports nutrients, hormones, and waste products.', difficulty: 'medium' },
  { id: 17, question: 'What is the largest artery in the body?', options: ['Carotid', 'Pulmonary', 'Aorta', 'Femoral'], correct: 2, system: 'Circulatory', emoji: '🫀', explanation: 'The aorta carries oxygenated blood from the left ventricle to the entire body!', difficulty: 'medium' },
  { id: 18, question: 'Which hormone regulates blood sugar?', options: ['Adrenaline', 'Insulin', 'Cortisol', 'Thyroid hormone'], correct: 1, system: 'Endocrine', emoji: '⚡', explanation: 'Insulin is produced by the pancreas and allows cells to absorb glucose from the blood.', difficulty: 'medium' },
  { id: 19, question: 'How many lobes does the brain have?', options: ['2', '3', '4', '6'], correct: 2, system: 'Nervous', emoji: '🧠', explanation: 'Each hemisphere has 4 lobes: frontal, parietal, temporal, and occipital.', difficulty: 'medium' },
  { id: 20, question: 'What is the function of platelets?', options: ['Fight infection', 'Carry oxygen', 'Blood clotting', 'Transport nutrients'], correct: 2, system: 'Circulatory', emoji: '🩹', explanation: 'Platelets form clots to stop bleeding. You have 150,000-400,000 per microliter of blood!', difficulty: 'medium' },

  // Hard
  { id: 21, question: 'What is the name of the heart\'s natural pacemaker?', options: ['AV node', 'Bundle of His', 'SA node', 'Purkinje fibers'], correct: 2, system: 'Circulatory', emoji: '🫀', explanation: 'The sinoatrial (SA) node in the right atrium initiates the heartbeat at 60-100 bpm!', difficulty: 'hard' },
  { id: 22, question: 'Which cranial nerve is the longest?', options: ['Optic nerve', 'Vagus nerve', 'Trigeminal nerve', 'Facial nerve'], correct: 1, system: 'Nervous', emoji: '🧠', explanation: 'The vagus nerve (CN X) runs from the brainstem to the abdomen, controlling many organs!', difficulty: 'hard' },
  { id: 23, question: 'What pH is stomach acid?', options: ['1-3', '5-6', '7', '8-10'], correct: 0, system: 'Digestive', emoji: '🧪', explanation: 'Gastric acid has a pH of 1-3, strong enough to dissolve metal! Mucus protects the stomach lining.', difficulty: 'hard' },
  { id: 24, question: 'How much blood does the body contain?', options: ['2-3 liters', '4-5 liters', '7-8 liters', '10-12 liters'], correct: 1, system: 'Circulatory', emoji: '🩸', explanation: 'Adults have about 4.7-5.5 liters (1.2-1.5 gallons) of blood circulating at all times.', difficulty: 'hard' },
  { id: 25, question: 'What enzyme begins protein digestion in the stomach?', options: ['Amylase', 'Lipase', 'Pepsin', 'Trypsin'], correct: 2, system: 'Digestive', emoji: '⚗️', explanation: 'Pepsin is activated from pepsinogen by HCl. It breaks proteins into smaller peptides.', difficulty: 'hard' },
  { id: 26, question: 'What type of immunity do vaccines provide?', options: ['Natural passive', 'Natural active', 'Artificial active', 'Artificial passive'], correct: 2, system: 'Immune', emoji: '💉', explanation: 'Vaccines stimulate your immune system to produce antibodies without causing disease!', difficulty: 'hard' },
  { id: 27, question: 'Which part of the nephron reabsorbs the most water?', options: ['Glomerulus', 'Proximal tubule', 'Loop of Henle', 'Collecting duct'], correct: 1, system: 'Urinary', emoji: '🫘', explanation: 'The proximal tubule reabsorbs ~65% of filtered water and most nutrients.', difficulty: 'hard' },
  { id: 28, question: 'What neurotransmitter is involved in "fight or flight"?', options: ['Serotonin', 'Dopamine', 'GABA', 'Norepinephrine'], correct: 3, system: 'Nervous', emoji: '⚡', explanation: 'Norepinephrine (and epinephrine/adrenaline) trigger the sympathetic nervous system response.', difficulty: 'hard' },
  { id: 29, question: 'The alveoli are found in which organ?', options: ['Heart', 'Brain', 'Lungs', 'Kidneys'], correct: 2, system: 'Respiratory', emoji: '🫁', explanation: 'Alveoli are tiny air sacs where gas exchange occurs. You have about 480 million of them!', difficulty: 'hard' },
  { id: 30, question: 'What is the hardest substance in the human body?', options: ['Bone', 'Tooth enamel', 'Cartilage', 'Keratin'], correct: 1, system: 'Skeletal', emoji: '🦷', explanation: 'Tooth enamel is 96% mineral (hydroxyapatite), making it harder than bone or any other tissue!', difficulty: 'hard' },
];

const systems = Array.from(new Set(allQuestions.map(q => q.system))).sort();
const difficulties = ['easy', 'medium', 'hard'] as const;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BodyQuiz() {
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  const startQuiz = () => {
    let pool = allQuestions;
    if (selectedSystem !== 'all') pool = pool.filter(q => q.system === selectedSystem);
    if (selectedDifficulty !== 'all') pool = pool.filter(q => q.difficulty === selectedDifficulty);
    const shuffled = shuffleArray(pool).slice(0, questionCount);
    if (shuffled.length === 0) return;
    setActiveQuestions(shuffled);
    setStarted(true);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setStreak(0);
    setMaxStreak(0);
  };

  const question = activeQuestions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered || !question) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const isCorrect = idx === question.correct;
    if (isCorrect) {
      playCorrect();
      setScore(s => s + (streak >= 3 ? 2 : 1));
      setStreak(s => { const ns = s + 1; setMaxStreak(m => Math.max(m, ns)); return ns; });
    } else {
      playWrong();
      setStreak(0);
    }
    setAnswers(prev => [...prev, isCorrect]);
  };

  const nextQuestion = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      playVictory();
      setShowResults(true);
    }
  };

  const restart = () => {
    setStarted(false);
    setShowResults(false);
    setAnswers([]);
  };

  const getGrade = () => {
    const pct = (score / activeQuestions.length) * 100;
    if (pct >= 90) return { label: 'A+', emoji: '🏆', message: 'Biology Master!' };
    if (pct >= 80) return { label: 'A', emoji: '🌟', message: 'Excellent!' };
    if (pct >= 70) return { label: 'B', emoji: '👍', message: 'Great job!' };
    if (pct >= 60) return { label: 'C', emoji: '📚', message: 'Keep studying!' };
    return { label: 'D', emoji: '💪', message: 'Practice more!' };
  };

  // Config screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">❤️ Body Systems Quiz</h2>
            <p className="text-gray-400 text-lg">30 questions across all body systems!</p>
          </motion.div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
            {/* System filter */}
            <div>
              <label className="text-sm font-bold text-white mb-2 flex items-center gap-1"><Filter className="w-3 h-3" /> Body System</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button onClick={() => setSelectedSystem('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedSystem === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>All Systems</button>
                {systems.map(s => (
                  <button key={s} onClick={() => setSelectedSystem(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedSystem === s ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-bold text-white mb-2 block">🎯 Difficulty</label>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setSelectedDifficulty('all')}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium ${selectedDifficulty === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>All</button>
                {difficulties.map(d => (
                  <button key={d} onClick={() => setSelectedDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize ${selectedDifficulty === d ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="text-sm font-bold text-white mb-2 block">📝 Questions</label>
              <div className="flex gap-2 mt-2">
                {[5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${questionCount === n ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Streak bonus info */}
            <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
              <div className="text-sm text-yellow-400 font-bold flex items-center gap-1"><Zap className="w-3 h-3" /> Streak Bonus!</div>
              <p className="text-sm text-gray-400 mt-1">Answer 3+ in a row correctly to earn <strong className="text-yellow-300">double points</strong>!</p>
            </div>

            <button onClick={startQuiz}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-colors">
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const grade = getGrade();
    return (
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <div className="text-6xl mb-4">{grade.emoji}</div>
            <h2 className="text-3xl font-black text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-400 mb-4">{grade.message}</p>

            <div className="w-24 h-24 mx-auto rounded-full border-4 border-emerald-500 flex items-center justify-center mb-4">
              <div>
                <div className="text-3xl font-black text-white">{score}</div>
                <div className="text-sm text-gray-400">/ {activeQuestions.length}</div>
              </div>
            </div>

            <div className="text-5xl font-black text-emerald-400 mb-2">{grade.label}</div>

            {maxStreak >= 3 && (
              <div className="text-sm text-yellow-400 mb-3 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" /> Best streak: {maxStreak} in a row! 🔥
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {answers.map((correct, i) => (
                <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {correct ? '✓' : '✗'}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={restart} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4" /> New Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">❤️ Body Systems Quiz</h2>
        </motion.div>

        {/* Progress + streak */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Q{currentQ + 1}/{activeQuestions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                animate={{ width: `${((currentQ + (answered ? 1 : 0)) / activeQuestions.length) * 100}%` }} />
            </div>
          </div>
          {streak >= 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold">
              <Zap className="w-3 h-3" /> {streak}x {streak >= 3 ? '🔥 2x!' : ''}
            </motion.div>
          )}
        </div>

        {/* Question */}
        {question && (
          <AnimatePresence mode="wait">
            <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{question.emoji}</span>
                <span className="text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{question.system}</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {question.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-5">{question.question}</h3>

              <div className="space-y-2.5">
                {question.options.map((option, idx) => {
                  let style = 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-600 text-gray-300';
                  if (answered) {
                    if (idx === question.correct) style = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                    else if (idx === selectedAnswer) style = 'border-red-500 bg-red-500/10 text-red-400';
                    else style = 'border-gray-800 bg-gray-800/30 text-gray-600';
                  }
                  return (
                    <motion.button key={idx} onClick={() => handleAnswer(idx)}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center gap-3 text-sm ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {answered && idx === question.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                      {answered && idx === selectedAnswer && idx !== question.correct && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden">
                    <div className={`p-3 rounded-xl border text-sm ${selectedAnswer === question.correct ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-blue-900/20 border-blue-500/30'}`}>
                      <div className="font-bold text-white mb-0.5 text-sm flex items-center gap-1">
                        {selectedAnswer === question.correct ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Correct!</> : <><Award className="w-3 h-3 text-blue-400" /> Learn:</>}
                      </div>
                      <p className="text-sm text-gray-300">{question.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}

        {answered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button onClick={nextQuestion}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600">
              {currentQ < activeQuestions.length - 1 ? <><span>Next</span><ArrowRight className="w-4 h-4" /></> : <><span>Results</span><Award className="w-4 h-4" /></>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
