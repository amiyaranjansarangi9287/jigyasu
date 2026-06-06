// src/worlds/lab/modules/StatisticsPlayground.tsx
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { STATISTICS_DATASETS } from '../data/labContent';
import { DataGraph } from '../components/DataGraph';

function calcMean(d: number[]) { return d.reduce((s, v) => s + v, 0) / d.length; }
function calcMedian(d: number[]) { const s = [...d].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function calcMode(d: number[]) { const f: Record<number, number> = {}; d.forEach(v => f[v] = (f[v] || 0) + 1); const max = Math.max(...Object.values(f)); return Object.entries(f).filter(([, c]) => c === max).map(([v]) => Number(v)); }

export default function StatisticsPlayground() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('statistics-playground');
  const { recordStatsDataset, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [dsIdx, setDsIdx] = useState(0);
  const [outlierAdded, setOutlierAdded] = useState(false);

  const ds = STATISTICS_DATASETS[dsIdx];
  const data = useMemo(() => outlierAdded ? [...ds.data, 999] : ds.data, [ds.data, outlierAdded]);

  const mean = calcMean(data);
  const median = calcMedian(data);
  const mode = calcMode(data);
  const graphData = data.map((v, i) => ({ x: i + 1, y: v }));

  const handleSelect = useCallback(async (idx: number) => {
    setDsIdx(idx); setOutlierAdded(false);
    await recordStatsDataset(STATISTICS_DATASETS[idx].id, false);
    await updateCertification('statistics-playground', 'explorer');
    await trackEvent('statistics-playground', 'canvas_interaction');
  }, [recordStatsDataset, updateCertification, trackEvent]);

  const handleOutlier = useCallback(() => {
    setOutlierAdded(!outlierAdded);
    if (!outlierAdded) lumo.show("Watch the mean jump! But the median barely moves. Which is fairer?", 'curious');
  }, [outlierAdded, lumo]);

  return (
    <LabShell module="statistics-playground" subject="math">
      <div className="min-h-screen bg-pink-50 flex flex-col p-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 mb-4">
          <h2 className="font-bold text-lg">📊 Statistics Playground</h2>
          <p className="text-sm text-slate-500">{t('lab.modules.StatisticsPlayground.txt_Selectadat', 'Select a dataset and explore the numbers!')}</p>
        </div>

        {/* Dataset selector */}
        <div className="flex gap-2 overflow-x-auto mb-4 no-scrollbar">{STATISTICS_DATASETS.map((d, i) => (
          <button key={d.id} onClick={() => handleSelect(i)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] ${dsIdx === i ? 'bg-pink-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{d.emoji} {d.name}</button>
        ))}</div>

        {/* Graph */}
        <div className="mb-4"><DataGraph data={graphData} xLabel="Index" yLabel={ds.unit} color="#EC4899" height={160} title={ds.context} /></div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-100"><p className="text-sm text-slate-400 font-bold">{t('lab.modules.StatisticsPlayground.txt_Mean', 'Mean')}</p><p className="text-xl font-bold text-pink-600">{mean.toFixed(1)}</p></div>
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-100"><p className="text-sm text-slate-400 font-bold">{t('lab.modules.StatisticsPlayground.txt_Median', 'Median')}</p><p className="text-xl font-bold text-purple-600">{median.toFixed(1)}</p></div>
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-100"><p className="text-sm text-slate-400 font-bold">{t('lab.modules.StatisticsPlayground.txt_Mode', 'Mode')}</p><p className="text-xl font-bold text-amber-600">{mode.join(', ')}</p></div>
        </div>

        {/* Outlier experiment */}
        <button onClick={handleOutlier} className={`w-full py-4 rounded-2xl font-bold text-base mb-4 min-h-[56px] ${outlierAdded ? 'bg-red-500 text-white' : 'bg-pink-600 text-white'}`}>
          {outlierAdded ? '🧹 Remove Outlier (999)' : '💥 Add Extreme Outlier (999)'}
        </button>

        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100"><p className="text-sm text-amber-700 font-medium">{t('lab.modules.StatisticsPlayground.txt_Thisisexac', '🏏 This is exactly what IPL cricket analysts do after every match!')}</p></div>
      </div>
    </LabShell>
  );
}
