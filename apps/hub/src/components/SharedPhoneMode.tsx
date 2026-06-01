// src/components/SharedPhoneMode.tsx
// Shared Phone Mode for Multi-User Scenarios
// Mission Alignment: Equity Value - "Some share one phone with the entire family"

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@jigyasu/storage';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  language: string;
  ageTier: string;
  lastActive: number;
}

export default function SharedPhoneMode() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useUserProfile();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Load profiles from localStorage
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('jigyasu-profiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  }, []);

  // Save profiles to localStorage
  const saveProfilesToStorage = (updatedProfiles: UserProfile[]) => {
    try {
      localStorage.setItem('jigyasu-profiles', JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Failed to save profiles:', error);
    }
  };

  const handleSwitchProfile = (profileId: string) => {
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile) {
      saveProfile(selectedProfile);
      // Update last active time
      const updatedProfiles = profiles.map(p =>
        p.id === profileId ? { ...p, lastActive: Date.now() } : p
      );
      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);
      navigate('/');
    }
  };

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      const newProfile: UserProfile = {
        id: `profile-${Date.now()}`,
        name: newProfileName.trim(),
        avatar: '👤', // Default avatar
        language: 'en',
        ageTier: '6-8',
        lastActive: Date.now(),
      };

      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);
      setNewProfileName('');
      setShowAddProfile(false);
      
      // Switch to new profile
      handleSwitchProfile(newProfile.id);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      alert('You need at least one profile.');
      return;
    }

    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    saveProfilesToStorage(updatedProfiles);
  };

  // Sort profiles by last active
  const sortedProfiles = [...profiles].sort((a, b) => b.lastActive - a.lastActive);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Who is learning today?
          </h1>
          <p className="text-slate-600">
            Each person has their own learning journey
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {sortedProfiles.map((prof) => (
            <button
              key={prof.id}
              onClick={() => handleSwitchProfile(prof.id)}
              className="bg-white rounded-2xl p-6 border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-lg transition-all text-center relative group"
            >
              <div className="text-5xl mb-3">{prof.avatar}</div>
              <div className="font-bold text-slate-800 mb-1">{prof.name}</div>
              <div className="text-xs text-slate-500 capitalize">{prof.ageTier} years</div>
              
              {/* Delete button (shown on hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProfile(prof.id);
                }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete profile"
              >
                ✕
              </button>

              {/* Active indicator */}
              {profile?.name === prof.name && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </div>
              )}
            </button>
          ))}

          {/* Add Profile Button */}
          <button
            onClick={() => setShowAddProfile(true)}
            className="bg-indigo-50 rounded-2xl p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-100 transition-all text-center"
          >
            <div className="text-5xl mb-3">➕</div>
            <div className="font-bold text-indigo-700">Add Profile</div>
          </button>
        </div>

        {/* Add Profile Form */}
        {showAddProfile && (
          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-lg mb-6">
            <h3 className="font-bold text-indigo-900 mb-4">Add New Profile</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-bold text-slate-700 mb-2">
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  maxLength={24}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddProfile}
                  disabled={!newProfileName.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Add Profile
                </button>
                <button
                  onClick={() => {
                    setShowAddProfile(false);
                    setNewProfileName('');
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Why Multiple Profiles?
          </h3>
          <ul className="text-slate-700 text-sm space-y-2">
            <li>• Each person has their own learning progress</li>
            <li>• Continue learning right where you left off</li>
            <li>• Personalized recommendations for each learner</li>
            <li>• No confusion between family members' activities</li>
          </ul>
        </div>

        {/* Skip for now */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
