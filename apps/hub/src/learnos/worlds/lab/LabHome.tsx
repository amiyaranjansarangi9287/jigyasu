// src/worlds/lab/LabHome.tsx
import { useState, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import { LAB_MODULES } from './data/labContent';
import type { LabSubject, DifficultyLevel, LabModuleMetadata } from './types/lab.types';

interface DownloadState {
  [key: string]: boolean;
}

const SUBJECTS: { id: LabSubject | 'all'; emoji: string; label: string }[] = [
  { id: 'all', emoji: '🔬', label: 'All' },
  { id: 'physics', emoji: '⚡', label: 'Physics' },
  { id: 'math', emoji: '📐', label: 'Math' },
  { id: 'biology', emoji: '🌿', label: 'Biology' },
  { id: 'earth-science', emoji: '🌍', label: 'Earth' },
  { id: 'chemistry', emoji: '🧪', label: 'Chemistry' },
  { id: 'computer-science', emoji: '💻', label: 'Code' },
];

const DIFFICULTIES: { id: DifficultyLevel | 'all'; emoji: string; label: string; color: string }[] = [
  { id: 'all', emoji: '📚', label: 'All Levels', color: 'bg-slate-600' },
  { id: 'beginner', emoji: '🌱', label: 'Beginner', color: 'bg-green-500' },
  { id: 'intermediate', emoji: '🌿', label: 'Intermediate', color: 'bg-amber-500' },
  { id: 'advanced', emoji: '🌳', label: 'Advanced', color: 'bg-red-500' },
];

// Suggested learning path order (no tracking, just visual guidance)
const LEARNING_PATH_ORDER: LabModuleMetadata['id'][] = [
  // Phase 1: Foundations
  'number-line', 'shapes', 'fractions', 'multiplication',
  'states-of-matter', 'light-shadows', 'sound-waves', 'float-sink',
  'day-night', 'solar-system', 'moon-phases', 'water-cycle',
  'senses', 'habitats', 'food-chain', 'plant-growth', 'digestive-system',
  'simple-machines', 'lever-explorer', 'force-lab', 'magnets',
  'timeline-explorer', 'code-story', 'panchabhutas',
  // Phase 2: Building Up
  'multiplication-lab', 'fraction-kitchen', 'pi', 'newtons-laws',
  'electricity', 'circuit-builder', 'buoyancy-lab', 'atoms',
  'blood-circulation', 'cell-explorer', 'photosynthesis', 'human-body',
  'weather-station', 'ecosystem-sandbox',
  // Phase 3: Advanced
  'gravity', 'pythagorean', 'statistics-playground',
];

const PATH_PHASES = [
  { name: '🌱 Foundations', start: 0, end: 24, color: 'from-green-500 to-emerald-500' },
  { name: '🌿 Building Up', start: 24, end: 39, color: 'from-amber-500 to-orange-500' },
  { name: '🌳 Advanced', start: 39, end: 43, color: 'from-red-500 to-rose-500' },
];

function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const config = {
    beginner: { bg: 'bg-green-100', text: 'text-green-700', label: 'Beginner' },
    intermediate: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Intermediate' },
    advanced: { bg: 'bg-red-100', text: 'text-red-700', label: 'Advanced' },
  };
  const c = config[level];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
}

export default function LabHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<LabSubject | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'path'>('grid');
  const [downloads, setDownloads] = useState<DownloadState>({});

  const filtered = useMemo(() => {
    let result = LAB_MODULES;
    if (activeSubject !== 'all') result = result.filter(m => m.subject === activeSubject);
    if (activeDifficulty !== 'all') result = result.filter(m => m.difficulty === activeDifficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.realWorldConnection.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        m.subject.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeSubject, activeDifficulty, search]);

  const pathModules = useMemo(() => {
    return LEARNING_PATH_ORDER
      .map(id => LAB_MODULES.find(m => m.id === id))
      .filter(Boolean) as LabModuleMetadata[];
  }, []);

  const handleDownload = (moduleId: string) => {
    setDownloads(prev => ({ ...prev, [moduleId]: true }));
    // Simulate download - in production this would trigger actual offline download
    setTimeout(() => {
      setDownloads(prev => ({ ...prev, [moduleId]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">{t('lab.title', 'Lab Zero')}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{t('lab.stats', '{{count}} experiments to explore', { count: LAB_MODULES.length })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'path' : 'grid')} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] ${viewMode === 'path' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <span>{viewMode === 'path' ? '🗺️' : '📋'}</span>
              <span className="hidden sm:inline">{viewMode === 'path' ? t('lab.grid', 'Grid') : t('lab.path', 'Path')}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('lab.search_placeholder', 'Search experiments, topics, tags...')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600" aria-label="Clear search">✕</button>
            )}
          </div>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => setActiveSubject(s.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all min-h-[44px] ${activeSubject === s.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              <span>{s.emoji}</span><span>{t(`lab.subjects.${s.id}`, s.label)}</span>
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
          {DIFFICULTIES.map(d => (
            <button key={d.id} onClick={() => setActiveDifficulty(d.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all min-h-[44px] ${activeDifficulty === d.id ? `${d.color} text-white` : 'bg-white text-slate-500 border border-slate-200'}`}>
              <span>{d.emoji}</span><span>{t(`lab.difficulties.${d.id}`, d.label)}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mt-2 text-sm text-slate-400">
          {t('lab.results_count', '{{filtered}} of {{total}} experiments', { filtered: filtered.length, total: LAB_MODULES.length })}
          {search && <span> {t('lab.matching', 'matching "{{search}}"', { search })}</span>}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="px-5 pb-24 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((m, i) => (
            <div key={m.id} className="relative">
              <motion.button initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => navigate(`/lab/${m.path}`)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-left relative min-h-[140px] hover:shadow-md hover:border-slate-200 transition-all w-full">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: m.color }} />
                <div className="absolute top-3 right-3 flex gap-1">
                  <DifficultyBadge level={m.difficulty} />
                </div>
                <div className="text-3xl mb-2 mt-1">{m.emoji}</div>
                <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{t(`lab.modules.${m.id}.title`, m.title)}</p>
                <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">{t(`lab.modules.${m.id}.desc`, m.realWorldConnection)}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t(`lab.tags.${tag}`, tag)}</span>
                  ))}
                </div>
              </motion.button>
              {/* Prominent Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(m.id);
                }}
                disabled={downloads[m.id]}
                className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-xl shadow-lg transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Download for offline use"
              >
                {downloads[m.id] ? (
                  <span className="text-sm">⏳</span>
                ) : (
                  <span className="text-sm">⬇️</span>
                )}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-500 font-medium"><Trans i18nKey="auto.labhome.no_experiments_found">No experiments found</Trans></p>
              <p className="text-sm text-slate-400 mt-1"><Trans i18nKey="auto.labhome.try_a_different_search_or_filt">Try a different search or filter</Trans></p>
            </div>
          )}
        </div>
      ) : (
        /* Learning Path View */
        <div className="px-5 pb-24 pt-4">
          {PATH_PHASES.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${phase.color} text-white font-bold text-sm mb-4`}>
                {phase.name}
                <span className="text-sm opacity-80">({phase.end - phase.start} <Trans i18nKey="auto.labhome.modules">modules)</Trans></span>
              </div>
              <div className="space-y-2">
                {pathModules.slice(phase.start, phase.end).map((m, i) => {
                  const orderNum = phase.start + i + 1;
                  return (
                    <div key={m.id} className="relative">
                      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                        onClick={() => navigate(`/lab/${m.path}`)}
                        className="w-full bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all text-left">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-sm`}>
                          {orderNum}
                        </div>
                        <div className="text-2xl">{m.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{t(`lab.modules.${m.id}.title`, m.title)}</p>
                          <p className="text-[11px] text-slate-400 truncate">{t(`lab.modules.${m.id}.desc`, m.realWorldConnection)}</p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                          <DifficultyBadge level={m.difficulty} />
                          <span className="text-sm text-slate-400 capitalize">{m.subject.replace('-', ' ')}</span>
                        </div>
                      </motion.button>
                      {/* Download button for path view */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(m.id);
                        }}
                        disabled={downloads[m.id]}
                        className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-xl shadow-lg transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Download for offline use"
                      >
                        {downloads[m.id] ? (
                          <span className="text-sm">⏳</span>
                        ) : (
                          <span className="text-sm">⬇️</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="text-center py-8">
            <p className="text-sm text-slate-400"><Trans i18nKey="auto.labhome.this_is_a_suggested_order_feel">💡 This is a suggested order — feel free to explore freely!</Trans></p>
          </div>
        </div>
      )}

      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
