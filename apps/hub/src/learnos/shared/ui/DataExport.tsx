// src/shared/ui/DataExport.tsx
// Export local progress as JSON

import { useState } from 'react';
import { db } from '../../db';

export function DataExport() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const [sessions, events, progress, achievements, lumoTriggers, wonderGarden] = await Promise.all([
        db.sessions.toArray(),
        db.events.toArray(),
        db.conceptProgress.toArray(),
        db.achievements.toArray(),
        db.lumoTriggers.toArray(),
        db.wonderGarden.toArray(),
      ]);

      const data = {
        exportedAt: new Date().toISOString(),
        app: 'LearnOS',
        version: '1.0.0',
        data: {
          sessions,
          events,
          progress,
          achievements,
          lumoTriggers,
          wonderGarden,
        },
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learnos-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-white rounded-xl border border-gray-200
                 text-sm font-medium text-gray-600 hover:bg-gray-50
                 transition-colors disabled:opacity-50 min-h-[44px]"
      aria-label="Export your data"
    >
      {exporting ? 'Exporting...' : '📥 Export Data'}
    </button>
  );
}
