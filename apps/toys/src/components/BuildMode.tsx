import { useState, useEffect, useRef, useCallback } from 'react';
import type { Toy } from '../data/toys';
import { useBuildProgress } from '../hooks/useBuildProgress';

interface BuildModeProps {
  toy: Toy;
  onClose: () => void;
}

type Phase = 'materials' | 'building' | 'complete';

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function BuildMode({ toy, onClose }: BuildModeProps) {
  const {
    progress,
    toggleStep,
    toggleMaterial,
    startBuild,
    updateElapsed,
    markComplete,
    resetProgress,
  } = useBuildProgress(toy.id);

  const [phase, setPhase] = useState<Phase>(() => {
    if (progress.completedAt) return 'complete';
    if (progress.startedAt) return 'building';
    return 'materials';
  });

  const [activeStep, setActiveStep] = useState(() => {
    // Start on the first uncompleted step
    for (let i = 0; i < toy.steps.length; i++) {
      if (!progress.completedSteps.includes(i)) return i;
    }
    return 0;
  });

  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(progress.elapsedSeconds);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          updateElapsed(next);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, updateElapsed]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const allMaterialsChecked = toy.materials.every((_, i) => progress.materialsChecked.includes(i));
  // allStepsCompleted is checked via length comparison in handleToggleStep
  const completedCount = progress.completedSteps.length;
  const progressPercent = (completedCount / toy.steps.length) * 100;

  const handleStartBuilding = () => {
    startBuild();
    setPhase('building');
    setTimerRunning(true);
  };

  const handleToggleStep = useCallback((idx: number) => {
    toggleStep(idx);

    // Check if all steps will be completed after this toggle
    const willBeCompleted = !progress.completedSteps.includes(idx);
    if (willBeCompleted) {
      const newCompleted = [...progress.completedSteps, idx];
      if (newCompleted.length === toy.steps.length) {
        // All done!
        setTimeout(() => {
          setTimerRunning(false);
          markComplete();
          setPhase('complete');
          setShowConfetti(true);
        }, 500);
      } else {
        // Auto-advance to next uncompleted step
        for (let i = 0; i < toy.steps.length; i++) {
          if (!newCompleted.includes(i)) {
            setActiveStep(i);
            break;
          }
        }
      }
    }
  }, [progress.completedSteps, toy.steps.length, toggleStep, markComplete]);

  const handleReset = () => {
    resetProgress();
    setPhase('materials');
    setTimerRunning(false);
    setElapsed(0);
    setActiveStep(0);
    setShowConfetti(false);
    setShowResetConfirm(false);
  };

  const handleBuildAgain = () => {
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
           aria-label="Action button">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">{toy.name}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {phase === 'materials' ? 'Gather Materials' : phase === 'building' ? 'Building...' : 'Complete!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          {phase === 'building' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  timerRunning
                    ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
                title={timerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {timerRunning ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-mono font-bold text-gray-700">{formatTime(elapsed)}</span>
              </div>
            </div>
          )}

          {/* Progress badge */}
          {phase === 'building' && (
            <div className="hidden sm:flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold text-violet-700">
                {completedCount}/{toy.steps.length} steps
              </span>
            </div>
          )}

          {/* Reset */}
          {(phase === 'building' || phase === 'complete') && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-gray-400"
              title="Reset progress"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      {phase === 'building' && (
        <div className="h-1.5 bg-gray-200 flex-shrink-0">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* ===== MATERIALS PHASE ===== */}
        {phase === 'materials' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-8">
              <div className="w-16 min-h-16 bg-violet-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🛒
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Gather Your Materials</h2>
              <p className="text-gray-500">Check off each item as you collect it. Once you have everything, you can start building!</p>
            </div>

            {/* Toy image */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={toy.image} alt={toy.name} className="w-full min-h-48 sm:h-56 object-cover" />
            </div>

            {/* Materials checklist */}
            <div className="space-y-3 mb-8">
              {toy.materials.map((material, idx) => {
                const checked = progress.materialsChecked.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleMaterial(idx)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        checked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {checked && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${checked ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>
                      {material}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Safety notes */}
            {toy.safetyNotes && toy.safetyNotes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚠️</span>
                  <h3 className="font-bold text-amber-800 text-sm">Safety Notes</h3>
                </div>
                <ul className="space-y-2">
                  {toy.safetyNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                      <span className="mt-0.5 flex-shrink-0">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials counter */}
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">
                {progress.materialsChecked.length} of {toy.materials.length} materials collected
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(progress.materialsChecked.length / toy.materials.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Start building button */}
            <button
              onClick={handleStartBuilding}
              disabled={!allMaterialsChecked}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                allMaterialsChecked
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {allMaterialsChecked ? '🚀 Start Building!' : `Collect all ${toy.materials.length} materials to begin`}
            </button>

            {/* Skip materials */}
            <button
              onClick={handleStartBuilding}
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-violet-500 transition-colors"
            >
              Skip — I already have everything →
            </button>
          </div>
        )}

        {/* ===== BUILDING PHASE ===== */}
        {phase === 'building' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Step sidebar / top nav */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">Build Steps</h3>
                  {toy.steps.map((step, idx) => {
                    const completed = progress.completedSteps.includes(idx);
                    const isActive = idx === activeStep;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                          isActive
                            ? 'bg-violet-100 border-2 border-violet-300 shadow-sm'
                            : completed
                            ? 'bg-emerald-50 border-2 border-emerald-100'
                            : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                            completed
                              ? 'bg-emerald-500 text-white'
                              : isActive
                              ? 'bg-violet-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {completed ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${completed ? 'text-emerald-700' : isActive ? 'text-violet-900' : 'text-gray-700'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-400">{step.duration}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active step detail */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Step header with image */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img src={toy.image} alt={toy.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/20 backdrop-blur text-white">
                          Step {activeStep + 1} of {toy.steps.length}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/20 backdrop-blur text-white">
                          ⏱ {toy.steps[activeStep].duration}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        {toy.steps[activeStep].title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6 text-base">
                      {toy.steps[activeStep].description}
                    </p>

                    {/* Tip box */}
                    {toy.steps[activeStep].tip && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                        <div className="flex items-start gap-3">
                          <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
                          <div>
                            <h4 className="font-bold text-blue-800 text-sm mb-1">Pro Tip</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">{toy.steps[activeStep].tip}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {progress.completedSteps.includes(activeStep) ? (
                        <button
                          onClick={() => handleToggleStep(activeStep)}
                          className="flex-1 py-3.5 bg-emerald-100 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Step Completed — Undo?
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStep(activeStep)}
                          className="flex-1 py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Done
                        </button>
                      )}

                      {/* Navigation */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                          disabled={activeStep === 0}
                          className={`px-4 py-3.5 rounded-2xl font-semibold transition-colors ${
                            activeStep === 0
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setActiveStep(Math.min(toy.steps.length - 1, activeStep + 1))}
                          disabled={activeStep === toy.steps.length - 1}
                          className={`px-4 py-3.5 rounded-2xl font-semibold transition-colors ${
                            activeStep === toy.steps.length - 1
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick overview below */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-extrabold text-violet-600">{completedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Steps Done</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-extrabold text-indigo-600">{toy.steps.length - completedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Remaining</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 font-mono">{formatTime(elapsed)}</p>
                    <p className="text-xs text-gray-500 mt-1">Time Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== COMPLETE PHASE ===== */}
        {phase === 'complete' && (
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 text-center relative">
            {/* Confetti */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                      animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 1.5}s both`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'][i % 6],
                        transform: `rotate(${Math.random() * 360}deg)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Trophy */}
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-lg shadow-amber-100 animate-bounce-slow">
              🏆
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Amazing Job! 🎉
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
              You've successfully built the <strong className="text-gray-900">{toy.name}</strong>! Your handcrafted toy is ready to enjoy.
            </p>

            {/* Completion stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-2xl font-extrabold text-violet-600">{toy.steps.length}</p>
                <p className="text-xs text-gray-500 mt-1">Steps Done</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-2xl font-extrabold text-indigo-600 font-mono">{formatTime(elapsed)}</p>
                <p className="text-xs text-gray-500 mt-1">Total Time</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-2xl font-extrabold text-amber-500">⭐ {toy.rating}</p>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
            </div>

            {/* Completion image */}
            <div className="rounded-2xl overflow-hidden shadow-xl mb-8 ring-4 ring-amber-200">
              <img src={toy.image} alt={toy.name} className="w-full h-52 object-cover" />
            </div>

            {/* Share-like prompt */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-violet-100">
              <p className="text-sm font-medium text-violet-800 mb-3">Show off your creation! 📸</p>
              <p className="text-xs text-violet-600">Take a photo of your finished {toy.name} and share it with friends and family!</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleBuildAgain}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 text-lg"
              >
                🔄 Build Again
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                ← Back to Projects
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 min-h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🔄
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Progress?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will clear all your checked materials, completed steps, and timer. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
