import { useState, useEffect } from 'react';
import { db, ProgressRecord } from '../db';
import { liveQuery } from 'dexie';

/**
 * SuperMemo-2 simplified SRS algorithm
 * @param quality 0-5 rating of response quality (0 = total failure, 5 = perfect recall)
 * @param prevInterval Previous interval in days
 * @param prevFactor Previous easiness factor
 */
export function calculateSRS(
  quality: number,
  prevInterval = 0,
  prevFactor = 2.5
) {
  let factor = prevFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  factor = Math.max(1.3, factor); // Minimum factor is 1.3

  let interval = 0;
  if (quality < 3) {
    // If poor quality, reset interval
    interval = 1;
  } else if (prevInterval === 0) {
    interval = 1;
  } else if (prevInterval === 1) {
    interval = 3;
  } else {
    interval = Math.round(prevInterval * factor);
  }

  return {
    srsInterval: interval,
    srsFactor: factor,
    nextReviewDate: Date.now() + interval * 24 * 60 * 60 * 1000
  };
}

export function useSRS() {
  const [dueForReview, setDueForReview] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    const subscription = liveQuery(() => 
      db.progress
        .where('nextReviewDate')
        .belowOrEqual(Date.now())
        .toArray()
    ).subscribe(records => {
      setDueForReview(records);
    });

    return () => subscription.unsubscribe();
  }, []);

  const markReviewed = async (appId: string, activityId: string, quality: number) => {
    const id = `${appId}:${activityId}`;
    const record = await db.progress.get(id);
    if (record) {
      const nextParams = calculateSRS(quality, record.srsInterval, record.srsFactor);
      await db.progress.update(id, {
        ...nextParams,
        completedAt: Date.now()
      });
    }
  };

  return { dueForReview, markReviewed };
}
