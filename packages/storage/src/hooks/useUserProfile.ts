import { db, UserProfile } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useUserProfile() {
  const profile = useLiveQuery(() => db.userProfile.get('default'));

  const saveProfile = async (data: Partial<UserProfile>) => {
    const existing = await db.userProfile.get('default');
    if (existing) {
      await db.userProfile.update('default', data);
    } else {
      await db.userProfile.put({
        id: 'default',
        name: data.name || 'Explorer',
        avatar: data.avatar || '🤖',
        language: data.language || 'en',
        createdAt: Date.now(),
        ...data
      });
    }
  };

  const updateStreak = async () => {
    const existing = await db.userProfile.get('default');
    if (!existing) return;

    const today = new Date().toISOString().split('T')[0];
    let streakDays = existing.streakDays || 0;
    let lastLoginDate = existing.lastLoginDate;

    if (lastLoginDate === today) return;

    if (lastLoginDate) {
      const last = new Date(lastLoginDate);
      const current = new Date(today);
      const diffTime = Math.abs(current.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streakDays += 1;
      } else {
        streakDays = 1;
      }
    } else {
      streakDays = 1;
    }

    await db.userProfile.update('default', {
      streakDays,
      lastLoginDate: today
    });
  };

  const addXP = async (amount: number) => {
    const existing = await db.userProfile.get('default');
    if (!existing) return;

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = existing.lastXPDate !== today;
    
    const newDailyXP = (isNewDay ? 0 : (existing.dailyXP || 0)) + amount;
    const newTotalXP = (existing.xp || 0) + amount;

    await db.userProfile.update('default', {
      xp: newTotalXP,
      dailyXP: newDailyXP,
      lastXPDate: today
    });
  };

  const unlockAvatar = async (newAvatar: string, cost: number) => {
    const existing = await db.userProfile.get('default');
    if (!existing || (existing.xp || 0) < cost) return false;

    const unlocked = existing.unlockedAvatars || [];
    if (!unlocked.includes(newAvatar)) {
      unlocked.push(newAvatar);
    }

    await db.userProfile.update('default', {
      xp: (existing.xp || 0) - cost,
      avatar: newAvatar,
      unlockedAvatars: unlocked
    });
    return true;
  };

  return { profile, saveProfile, updateStreak, addXP, unlockAvatar };
}
