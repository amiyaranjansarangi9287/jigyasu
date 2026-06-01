import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function trackEvent(eventType: string, payload: Record<string, unknown> = {}) {
  // COPPA Parental Consent Gate: Drop tracking if no verifiable consent
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (window.localStorage.getItem('parental_consent_granted') !== 'true') {
        return; // Silently drop per COPPA
      }
    }
  } catch (e) {
    return;
  }

  try {
    await db.telemetry_queue.add({
      id: uuidv4(),
      eventType,
      payload, // Remember: NO PII (Personally Identifiable Information)
      queuedAt: Date.now(),
      attempts: 0
    });
    
    // Attempt to sync in the background
    syncTelemetry().catch(console.error);
  } catch (err) {
    console.error('Failed to track telemetry event:', err);
  }
}

// Simple background sync stub
let isSyncing = false;
export async function syncTelemetry() {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    const queue = await db.telemetry_queue.orderBy('queuedAt').limit(50).toArray();
    if (queue.length === 0) return;

    // Simulate an API call to flush the telemetry
    // In a real app, you would post this to an endpoint and then bulkDelete
    console.log(`[Telemetry] Syncing ${queue.length} events...`, queue);
    
    // Assuming success:
    const ids = queue.map(q => q.id);
    await db.telemetry_queue.bulkDelete(ids);
  } catch (err) {
    console.error('Telemetry sync failed:', err);
  } finally {
    isSyncing = false;
  }
}

// Optionally set up an interval to periodically flush
setInterval(() => {
  if (navigator.onLine) {
    syncTelemetry().catch(console.error);
  }
}, 5 * 60 * 1000); // Every 5 minutes
