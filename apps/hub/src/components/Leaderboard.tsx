import React from 'react';
import { useUserProfile } from '@jigyasu/storage';

const MOCK_FRIENDS = [
  { id: 1, name: 'Aria', avatar: '🦄', xp: 450, isUser: false },
  { id: 2, name: 'Leo', avatar: '🦁', xp: 320, isUser: false },
  { id: 3, name: 'Mia', avatar: '🐱', xp: 280, isUser: false },
  { id: 4, name: 'Sam', avatar: '🦖', xp: 150, isUser: false },
];

export default function Leaderboard() {
  const { profile } = useUserProfile();
  if (!profile) return null;

  const currentXP = profile.xp || 0;

  const allUsers = [
    ...MOCK_FRIENDS,
    { id: 'me', name: profile.name, avatar: profile.avatar, xp: currentXP, isUser: true }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Weekly Leaderboard</h2>
          <p className="text-slate-500 font-medium">See how you stack up against friends!</p>
        </div>
        <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-orange-100">
          🏆
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {allUsers.map((u, index) => (
          <div 
            key={u.id}
            className={`flex items-center p-4 rounded-2xl transition-all ${
              u.isUser 
                ? 'bg-sky-50 border-2 border-sky-200 shadow-sm shadow-sky-100 scale-[1.02]' 
                : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 font-bold text-lg ${index === 0 ? 'text-yellow-500 text-xl' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-400'}`}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-200 mr-4">
              {u.avatar}
            </div>
            <div className={`flex-1 font-bold ${u.isUser ? 'text-sky-700' : 'text-slate-700'}`}>
              {u.name} {u.isUser && <span className="text-sm bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full ml-2">You</span>}
            </div>
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <span className="text-sky-500">✨</span>
              {u.xp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
