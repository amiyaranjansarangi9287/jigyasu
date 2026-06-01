import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useGlobalXP() {
  const profile = useLiveQuery(() => db.userProfile.get('default'));
  const progressRecords = useLiveQuery(() => db.progress.toArray());
  
  if (profile?.xp !== undefined) {
    return profile.xp;
  }

  // Fallback for legacy
  const calculated = progressRecords 
    ? progressRecords.filter(r => r.completedAt).length * 50 
    : 0;

  return calculated;
}
