import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';

describe('JigyasuDB (IndexedDB)', () => {
  beforeEach(async () => {
    // Clear the db before each test
    await db.progress.clear();
    await db.telemetry_queue.clear();
  });

  it('can insert and retrieve progress records', async () => {
    await db.progress.add({
      conceptId: 'photosynthesis',
      completedAt: 123456789,
      score: 100
    });

    const record = await db.progress.get('photosynthesis');
    expect(record).toBeDefined();
    expect(record?.score).toBe(100);
  });

  it('can queue and query telemetry events', async () => {
    await db.telemetry_queue.add({
      id: 'evt-1',
      eventType: 'page_view',
      payload: { path: '/' },
      queuedAt: Date.now(),
      attempts: 0
    });

    const events = await db.telemetry_queue.toArray();
    expect(events.length).toBe(1);
    expect(events[0].eventType).toBe('page_view');
  });
});
