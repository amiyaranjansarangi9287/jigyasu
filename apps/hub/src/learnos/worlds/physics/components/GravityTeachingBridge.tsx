import { useState } from 'react';
import {
  getTeachingBridgeStatus,
  requestConceptMap,
  requestHint,
  requestNextActivity,
  type TeachingBridgeConceptMap,
  type TeachingBridgeFeatureStatus,
  type TeachingBridgeHint,
  type TeachingBridgeNextActivity,
} from '../../../services/TeachingBridge';

const GRAVITY_REQUEST = {
  query: 'Help me understand gravity wells and curved spacetime.',
  subject: 'Physics',
  moduleId: 'gravity-wells',
  learnerLevel: 'intermediate' as const,
  language: 'en',
};

function statusLabel(status: TeachingBridgeFeatureStatus): string {
  if (status === 'enabled') {
    return 'Sakha bridge ready';
  }
  if (status === 'unconfigured') {
    return 'Sakha bridge needs endpoint';
  }
  return 'Sakha bridge disabled';
}

export default function GravityTeachingBridge() {
  const bridgeStatus = getTeachingBridgeStatus();
  const [hint, setHint] = useState<TeachingBridgeHint | null>(null);
  const [conceptMap, setConceptMap] = useState<TeachingBridgeConceptMap | null>(null);
  const [nextActivity, setNextActivity] = useState<TeachingBridgeNextActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (bridgeStatus === 'disabled') {
    return null;
  }

  const loadBridgeHelp = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hintResult, conceptMapResult, nextActivityResult] = await Promise.all([
        requestHint(GRAVITY_REQUEST),
        requestConceptMap(GRAVITY_REQUEST),
        requestNextActivity(GRAVITY_REQUEST),
      ]);
      setHint(hintResult);
      setConceptMap(conceptMapResult);
      setNextActivity(nextActivityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TeachingBridge request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">
            Optional TeachingBridge demo
          </p>
          <p className="mt-1 text-sm text-gray-300">{statusLabel(bridgeStatus)}</p>
        </div>
        <button
          type="button"
          onClick={loadBridgeHelp}
          disabled={loading}
          className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Ask Sakha'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {hint && (
        <div className="mt-4 rounded-xl bg-gray-950/70 p-3">
          <p className="text-xs font-bold uppercase text-gray-500">Hint</p>
          <p className="mt-1 text-sm text-gray-200">{hint.prompt}</p>
          {hint.traceId && <p className="mt-2 text-xs text-gray-500">Trace: {hint.traceId}</p>}
          {hint.fallback && <p className="mt-2 text-xs text-amber-300">{hint.reason}</p>}
        </div>
      )}

      {conceptMap && (conceptMap.conceptIds.length > 0 || conceptMap.prerequisites.length > 0) && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-950/70 p-3">
            <p className="text-xs font-bold uppercase text-gray-500">Concepts</p>
            <p className="mt-1 text-sm text-gray-200">
              {conceptMap.conceptIds.join(', ') || 'No concepts returned'}
            </p>
          </div>
          <div className="rounded-xl bg-gray-950/70 p-3">
            <p className="text-xs font-bold uppercase text-gray-500">Prerequisites</p>
            <p className="mt-1 text-sm text-gray-200">
              {conceptMap.prerequisites.join(', ') || 'No prerequisites returned'}
            </p>
          </div>
        </div>
      )}

      {nextActivity?.activity && (
        <div className="mt-3 rounded-xl bg-gray-950/70 p-3">
          <p className="text-xs font-bold uppercase text-gray-500">Next activity</p>
          <p className="mt-1 text-sm text-gray-200">{nextActivity.activity.prompt}</p>
        </div>
      )}
    </section>
  );
}
