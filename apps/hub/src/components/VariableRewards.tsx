import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '@jigyasu/storage';
import { sfx } from '../learnos/worlds/math/lib/soundEngine';

export function useVariableRewards() {
  const { profile, unlockAvatar, saveProfile } = useUserProfile();
  const [bonusXP, setBonusXP] = useState(0);
  const [chestUnlocked, setChestUnlocked] = useState<string | null>(null);

  const triggerReward = useCallback((baseXP: number = 0) => {
    if (!profile) return false;

    const rand = Math.random();
    // 5% chance for Mystery Chest
    if (rand < 0.05) {
      const possibleAvatars = ['🦄', '🐉', '🦸‍♂️', '👩‍🚀', '🦖', '👽', '👻', '🤖'];
      const lockedAvatars = possibleAvatars.filter(av => !(profile.unlockedAvatars || []).includes(av) && av !== profile.avatar);
      
      if (lockedAvatars.length > 0) {
        const reward = lockedAvatars[Math.floor(Math.random() * lockedAvatars.length)];
        setChestUnlocked(reward);
        unlockAvatar(reward, 0); // free unlock
        sfx.celebrate();
        setTimeout(() => setChestUnlocked(null), 3000);
        return true;
      }
    } 
    // 20% chance for Random Bonus XP (10-50)
    else if (rand < 0.25) {
      const bonus = Math.floor(Math.random() * 41) + 10;
      setBonusXP(bonus);
      saveProfile({ xp: (profile.xp || 0) + baseXP + bonus });
      setTimeout(() => setBonusXP(0), 2000);
      return true;
    }
    
    // Normal case
    if (baseXP > 0) {
      saveProfile({ xp: (profile.xp || 0) + baseXP });
    }
    return false;
  }, [profile, unlockAvatar, saveProfile]);

  return { bonusXP, chestUnlocked, triggerReward };
}

export function VariableRewardOverlay({ chestUnlocked, bonusXP }: { chestUnlocked: string | null, bonusXP: number }) {
  return (
    <>
      <AnimatePresence>
        {chestUnlocked && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 border-4 border-amber-400 text-center shadow-2xl relative overflow-hidden max-w-sm w-full mx-4"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
              <motion.div 
                className="text-7xl mb-4 relative z-10"
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                🎁
              </motion.div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">Mystery Chest!</h3>
              <p className="text-slate-600 mb-6 font-medium relative z-10">You unlocked a rare avatar for your profile.</p>
              <motion.div 
                className="w-24 h-24 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-5xl border-4 border-amber-200 relative z-10 shadow-inner"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
              >
                {chestUnlocked}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
