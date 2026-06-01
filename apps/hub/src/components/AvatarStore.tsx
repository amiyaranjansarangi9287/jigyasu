import React, { useState } from 'react';
import { useUserProfile } from '@jigyasu/storage';

const AVATARS = [
  { id: '🤖', name: 'Robo', cost: 0 },
  { id: '🦊', name: 'Fox', cost: 0 },
  { id: '🦄', name: 'Unicorn', cost: 200 },
  { id: '🐉', name: 'Dragon', cost: 300 },
  { id: '🦸‍♂️', name: 'Hero', cost: 400 },
  { id: '👩‍🚀', name: 'Astronaut', cost: 500 }
];

export default function AvatarStore() {
  const { profile, unlockAvatar, saveProfile } = useUserProfile();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  if (!profile) return null;

  const unlocked = profile.unlockedAvatars || [];
  const currentXP = profile.xp || 0;

  const handleEquip = (avatar: string) => {
    saveProfile({ avatar });
  };

  const handleBuy = async (avatar: string, cost: number) => {
    if (currentXP < cost) {
      setPurchaseError(`You need ${cost - currentXP} more XP!`);
      setTimeout(() => setPurchaseError(null), 3000);
      return;
    }
    await unlockAvatar(avatar, cost);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Avatar Store</h2>
          <p className="text-slate-500 font-medium">Spend your XP to unlock new looks!</p>
        </div>
        <div className="bg-sky-50 text-sky-600 px-4 py-2 rounded-xl font-bold border border-sky-100 flex items-center gap-2 shadow-inner">
          <span>✨</span> {currentXP} XP
        </div>
      </div>

      {purchaseError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl font-bold text-sm mb-6 animate-shake border border-red-100 relative z-10">
          {purchaseError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
        {AVATARS.map((av) => {
          const isUnlocked = av.cost === 0 || unlocked.includes(av.id);
          const isEquipped = profile.avatar === av.id;

          return (
            <div key={av.id} className={`border-2 rounded-2xl p-4 text-center transition-all duration-300 ${
              isEquipped ? 'border-orange-500 bg-orange-50 scale-105 shadow-md shadow-orange-500/20' : 'border-slate-100 hover:border-slate-300 hover:-translate-y-1 bg-white'
            }`}>
              <div className="text-6xl mb-3 drop-shadow-sm">{av.id}</div>
              <div className="font-bold text-slate-700 mb-2">{av.name}</div>
              
              {isEquipped ? (
                <button disabled className="w-full bg-orange-500 text-white font-bold py-2 rounded-xl opacity-80 cursor-not-allowed">
                  Equipped
                </button>
              ) : isUnlocked ? (
                <button 
                  onClick={() => handleEquip(av.id)}
                  className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-bold py-2 rounded-xl transition-colors active:scale-95"
                >
                  Equip
                </button>
              ) : (
                <button 
                  onClick={() => handleBuy(av.id, av.cost)}
                  className={`w-full font-bold py-2 rounded-xl transition-all active:scale-95 ${
                    currentXP >= av.cost 
                      ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'
                  }`}
                >
                  Unlock ({av.cost} ✨)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
