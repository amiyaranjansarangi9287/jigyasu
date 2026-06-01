import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLearnerStore } from '../learnos/store';
import MasteryIndicator from './MasteryIndicator';

interface RecentActivityProps {
  moduleProgress: Record<string, any>;
}

export default function RecentActivity({ moduleProgress }: RecentActivityProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getLastModule = useLearnerStore((state) => state.getLastModule);

  if (Object.keys(moduleProgress).length === 0) return null;

  const lastModule = getLastModule();

  return (
    <div className="w-full bg-white border-b border-slate-200 p-4 md:p-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">⏱️</span>
          {t('recent_activity', 'Recent Activity')}
        </h2>
        
        <div className="mb-4">
          <MasteryIndicator 
            mastered={Object.values(moduleProgress).filter(p => p.status === 'completed').length}
            total={Object.keys(moduleProgress).length}
            showDetails={true}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {Object.entries(moduleProgress)
            .sort((a, b) => b[1].lastAccessedAt - a[1].lastAccessedAt)
            .slice(0, 5)
            .map(([moduleId, progress]) => {
              const world = lastModule?.moduleId === moduleId ? lastModule.world : 'early';
              return (
                <button
                  key={moduleId}
                  onClick={() => navigate(`/${world}/${moduleId}`)}
                  aria-label={`Continue ${moduleId.replace(/-/g, ' ')}, last accessed ${new Date(progress.lastAccessedAt).toLocaleDateString()}, status: ${progress.status}`}
                  className="flex-shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 min-w-[160px] transition-all focus-visible:outline-2 focus-visible:outline-slate-400 focus-visible:outline-offset-2"
                >
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    {new Date(progress.lastAccessedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-bold text-slate-800 truncate mb-2">
                    {moduleId.replace(/-/g, ' ')}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2" aria-hidden="true">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress.status === 'completed' ? 100 : 50}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600" aria-hidden="true">
                      {progress.status === 'completed' ? '✓' : '→'}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
