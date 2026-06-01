// src/worlds/discovery/modules/LiteraryAnalysis.tsx
import { useState, useCallback } from 'react';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

const TEXTS = [
  { id: 'tagore', title: 'Gitanjali', author: 'Rabindranath Tagore', excerpt: 'Where the mind is without fear and the head is held high; Where knowledge is free...', emoji: '🇮🇳', devices: ['imagery', 'symbolism'], q: 'What does "narrow domestic walls" symbolise?', opts: ['Actual walls', 'Prejudice and division', 'Education barriers', 'Borders'], correct: 1 },
  { id: 'premchand', title: 'Idgah', author: 'Munshi Premchand', excerpt: 'Hamid had only three paise. He would buy a tong for his grandmother instead of sweets.', emoji: '🇮🇳', devices: ['metaphor'], q: 'What does Hamid\'s choice reveal?', opts: ['He is foolish', 'He is generous', 'He doesn\'t like sweets', 'He is obedient'], correct: 1 },
  { id: 'frost', title: 'The Road Not Taken', author: 'Robert Frost', excerpt: 'Two roads diverged in a yellow wood, And sorry I could not travel both...', emoji: '🌲', devices: ['symbolism', 'imagery'], q: 'The "two roads" symbolise:', opts: ['Forest paths', 'Life choices', 'Political systems', 'Travel options'], correct: 1 },
];

const DEVICES = [
  { id: 'metaphor', name: 'Metaphor', def: 'Saying one thing IS another', emoji: '🔄', color: '#6366F1' },
  { id: 'simile', name: 'Simile', def: 'Comparing using "like" or "as"', emoji: '↔️', color: '#8B5CF6' },
  { id: 'imagery', name: 'Imagery', def: 'Language that creates a picture', emoji: '🎨', color: '#EC4899' },
  { id: 'symbolism', name: 'Symbolism', def: 'Object representing an idea', emoji: '🔣', color: '#F59E0B' },
];

export default function LiteraryAnalysis() {
  const lumo = useLumoSage();
  const { recordLiteraryAnalysis, updateMastery } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [textIdx, setTextIdx] = useState(0);
  const [tagged, setTagged] = useState<string[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);
  const text = TEXTS[textIdx];

  const handleTag = useCallback(async (deviceId: string) => {
    if (tagged.includes(deviceId)) return;
    setTagged(p => [...p, deviceId]);
    await recordLiteraryAnalysis(text.id, deviceId);
    await trackEvent('literary-analysis', 'canvas_interaction', { device: deviceId });
    if (text.devices.includes(deviceId)) lumo.afterDiscovery();
  }, [tagged, text, recordLiteraryAnalysis, trackEvent, lumo]);

  const handleAnswer = useCallback(async (idx: number) => {
    setAnswer(idx);
    if (idx === text.correct) { lumo.afterDiscovery(); await updateMastery('literary-analysis', 'understand'); await trackEvent('literary-analysis', 'correct_answer'); }
    else await trackEvent('literary-analysis', 'wrong_answer');
  }, [text, lumo, updateMastery, trackEvent]);

  return (
    <DiscoveryShell module="literary-analysis">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        {/* Text selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">{TEXTS.map((t, i) => (
          <button key={t.id} onClick={() => { setTextIdx(i); setTagged([]); setAnswer(null); }} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] ${textIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{t.emoji} {t.author.split(' ').pop()}</button>
        ))}</div>

        {/* Text display */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-4">
          <p className="text-amber-400 text-sm font-bold uppercase mb-1">{text.title} — {text.author}</p>
          <p className="text-slate-200 text-sm leading-relaxed italic">"{text.excerpt}"</p>
        </div>

        {/* Device palette */}
        <p className="text-slate-500 text-sm font-bold mb-2">TAG LITERARY DEVICES</p>
        <div className="grid grid-cols-2 gap-2 mb-4">{DEVICES.map(d => (
          <button key={d.id} onClick={() => handleTag(d.id)} className={`bg-slate-800 rounded-xl p-3 border text-left min-h-[52px] transition-all ${tagged.includes(d.id) ? 'border-green-600' : 'border-slate-700'}`}>
            <div className="flex items-center gap-2"><span>{d.emoji}</span><span className="text-white text-sm font-bold">{d.name}</span>{tagged.includes(d.id) && <span className="text-green-500 text-sm ml-auto">✓</span>}</div>
            <p className="text-slate-500 text-sm mt-1">{d.def}</p>
          </button>
        ))}</div>

        {/* Question */}
        {tagged.length >= 1 && (
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className="text-white font-bold text-sm mb-3">🦉 {text.q}</p>
            <div className="space-y-2">{text.opts.map((opt, i) => (
              <button key={i} onClick={() => answer === null && handleAnswer(i)} className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium min-h-[44px] transition-all ${answer === null ? 'bg-slate-700 text-slate-300' : i === text.correct ? 'bg-green-900/50 text-green-400' : answer === i ? 'bg-red-900/50 text-red-400' : 'bg-slate-700/50 text-slate-500'}`}>{opt} {answer !== null && i === text.correct && '✓'}</button>
            ))}</div>
          </div>
        )}
      </div>
    </DiscoveryShell>
  );
}
