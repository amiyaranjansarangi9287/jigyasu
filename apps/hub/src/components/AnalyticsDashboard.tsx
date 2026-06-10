// src/components/AnalyticsDashboard.tsx
// Analytics Validation Dashboard
// Purpose: Validate that LearningService events are firing correctly

import { useState, useEffect } from 'react';
import { db } from '../learnos/db';
import type { LearningEvent } from '../learnos/types/events';
import { useTranslation, Trans } from 'react-i18next';
import { useFormatNumber } from '../hooks/useFormatNumber';

export default function AnalyticsDashboard() {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [sessionCount, setSessionCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const loadAnalytics = async () => {
      try {
        const allEvents = await db.events.toArray();
        setEvents(allEvents.slice(-50)); // Show last 50 events

        // Count events by type
        const counts: Record<string, number> = {};
        allEvents.forEach((event) => {
          counts[event.eventType] = (counts[event.eventType] || 0) + 1;
        });
        setEventCounts(counts);

        // Count sessions
        const sessions = await db.sessions.toArray();
        setSessionCount(sessions.length);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-6 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold z-[100] hover:bg-slate-700 transition-colors"
        aria-label="Open Analytics Dashboard"
      >
        📊 {t('floating_buttons.analytics', 'Analytics')}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-[100] p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white"><Trans i18nKey="auto.analyticsdashboard.analytics_validation_dashboard">Analytics Validation Dashboard</Trans></h1>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            aria-label="Close dashboard"
          >
            <Trans i18nKey="auto.analyticsdashboard.close">✕ Close</Trans>
                                </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold mb-2"><Trans i18nKey="auto.analyticsdashboard.total_events">Total Events</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(events.length)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold mb-2"><Trans i18nKey="auto.analyticsdashboard.active_sessions">Active Sessions</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(sessionCount)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold mb-2"><Trans i18nKey="auto.analyticsdashboard.event_types">Event Types</Trans></h3>
            <p className="text-4xl font-bold text-white">{formatNumber(Object.keys(eventCounts).length)}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4"><Trans i18nKey="auto.analyticsdashboard.event_counts_by_type">Event Counts by Type</Trans></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(eventCounts).map(([type, count]) => (
              <div key={type} className="bg-slate-700 rounded-lg p-3">
                <p className="text-slate-400 text-xs font-bold mb-1">{type}</p>
                <p className="text-2xl font-bold text-white">{formatNumber(count)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4"><Trans i18nKey="auto.analyticsdashboard.recent_events_last_50">Recent Events (Last 50)</Trans></h2>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {events.length === 0 ? (
              <p className="text-slate-400"><Trans i18nKey="auto.analyticsdashboard.no_events_recorded_yet">No events recorded yet</Trans></p>
            ) : (
              events.slice().reverse().map((event) => (
                <div key={event.id} className="bg-slate-700 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-bold">{event.eventType}</span>
                    <span className="text-slate-400 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500"><Trans i18nKey="auto.analyticsdashboard.module">Module:</Trans></span> {event.moduleId}
                    </div>
                    <div>
                      <span className="text-slate-500"><Trans i18nKey="auto.analyticsdashboard.language">Language:</Trans></span> {event.language}
                    </div>
                    <div>
                      <span className="text-slate-500"><Trans i18nKey="auto.analyticsdashboard.device">Device:</Trans></span> {event.deviceType}
                    </div>
                    <div>
                      <span className="text-slate-500"><Trans i18nKey="auto.analyticsdashboard.connection">Connection:</Trans></span> {event.connectionType}
                    </div>
                  </div>
                  {Object.keys(event.payload).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <span className="text-slate-500 text-xs"><Trans i18nKey="auto.analyticsdashboard.payload">Payload:</Trans></span>
                      <pre className="text-xs text-slate-300 mt-1 overflow-auto">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              await db.events.clear();
              await db.sessions.clear();
              setEvents([]);
              setEventCounts({});
              setSessionCount(0);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <Trans i18nKey="auto.analyticsdashboard.clear_all_data">Clear All Data</Trans>
                                </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <Trans i18nKey="auto.analyticsdashboard.refresh_page">Refresh Page</Trans>
                                </button>
        </div>
      </div>
    </div>
  );
}
