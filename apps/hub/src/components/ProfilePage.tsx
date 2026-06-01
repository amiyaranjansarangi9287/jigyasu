import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@jigyasu/storage';
import EmptyState from './EmptyState';
import AvatarStore from './AvatarStore';
import Leaderboard from './Leaderboard';
import DataDeletionButton from './DataDeletionButton';
import ParentalControls from './ParentalControls';

export default function ProfilePage() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  if (!profile) return null;

  const hasProgress = (profile.streakDays || 0) > 0;

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 pb-24">
      <div className="flex items-center gap-6 mb-12 p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
        <span className="text-6xl">{profile.avatar}</span>
        <div>
          <h1 className="text-3xl font-black text-slate-800">{profile.name}'s Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Ready for the next adventure?</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Recent Activity</h2>
      
      {!hasProgress ? (
        <EmptyState 
          title="No activity yet!"
          description="You haven't started any learning paths or maker space activities. Time to dive in!"
          actionText="Explore Learning Paths"
          onAction={() => navigate('/home')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
              <span className="text-4xl block">🔥</span>
              <div>
                <div className="text-2xl font-bold text-slate-800">{profile.streakDays} Day Streak</div>
                <div className="text-sm text-slate-500">Keep it up!</div>
              </div>
           </div>
        </div>
      )}

      {hasProgress && (
        <>
          <AvatarStore />
          <Leaderboard />
        </>
      )}

      <div className="mt-8 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Data & Privacy</h2>
        <DataDeletionButton />
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Parental Controls</h2>
        <ParentalControls />
      </div>
    </div>
  );
}
