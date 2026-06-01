// CampCraft - Achievement Definitions

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pillar?: 'toybox' | 'sciencelab' | 'artstudio' | 'outdoorquest' | 'global';
  category: 'milestone' | 'pillar' | 'special' | 'streak' | 'campweek';
  condition: string; // Human-readable condition for documentation
  threshold?: number; // Number needed to unlock (if applicable)
}

export const achievements: Achievement[] = [
  // ============================================
  // MILESTONE ACHIEVEMENTS
  // ============================================
  {
    id: 'first-activity',
    name: 'First Steps',
    description: 'Complete your very first activity',
    icon: '🎉',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete any 1 activity',
    threshold: 1
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 5 activities',
    icon: '🌱',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete any 5 activities',
    threshold: 5
  },
  {
    id: 'double-digits',
    name: 'Double Digits',
    description: 'Complete 10 activities',
    icon: '🔟',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete any 10 activities',
    threshold: 10
  },
  {
    id: 'quarter-century',
    name: 'Quarter Century',
    description: 'Complete 25 activities',
    icon: '🏅',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete any 25 activities',
    threshold: 25
  },
  {
    id: 'super-camper',
    name: 'Super Camper',
    description: 'Complete 50 activities',
    icon: '⭐',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete any 50 activities',
    threshold: 50
  },
  {
    id: 'camp-legend',
    name: 'Camp Legend',
    description: 'Complete all 60 activities',
    icon: '👑',
    pillar: 'global',
    category: 'milestone',
    condition: 'Complete all 60 activities',
    threshold: 60
  },

  // ============================================
  // PILLAR ACHIEVEMENTS
  // ============================================
  {
    id: 'toybox-starter',
    name: 'Toy Maker',
    description: 'Complete your first ToyBox activity',
    icon: '🧸',
    pillar: 'toybox',
    category: 'pillar',
    condition: 'Complete 1 ToyBox activity',
    threshold: 1
  },
  {
    id: 'toybox-master',
    name: 'Master Builder',
    description: 'Complete 10 ToyBox activities',
    icon: '🏗️',
    pillar: 'toybox',
    category: 'pillar',
    condition: 'Complete 10 ToyBox activities',
    threshold: 10
  },
  {
    id: 'sciencelab-starter',
    name: 'Junior Scientist',
    description: 'Complete your first ScienceLab experiment',
    icon: '🔬',
    pillar: 'sciencelab',
    category: 'pillar',
    condition: 'Complete 1 ScienceLab activity',
    threshold: 1
  },
  {
    id: 'sciencelab-master',
    name: 'Mad Scientist',
    description: 'Complete 10 ScienceLab experiments',
    icon: '🧪',
    pillar: 'sciencelab',
    category: 'pillar',
    condition: 'Complete 10 ScienceLab activities',
    threshold: 10
  },
  {
    id: 'artstudio-starter',
    name: 'Young Artist',
    description: 'Complete your first ArtStudio project',
    icon: '🎨',
    pillar: 'artstudio',
    category: 'pillar',
    condition: 'Complete 1 ArtStudio activity',
    threshold: 1
  },
  {
    id: 'artstudio-master',
    name: 'Picasso Jr',
    description: 'Complete 10 ArtStudio projects',
    icon: '🖼️',
    pillar: 'artstudio',
    category: 'pillar',
    condition: 'Complete 10 ArtStudio activities',
    threshold: 10
  },
  {
    id: 'outdoorquest-starter',
    name: 'Nature Explorer',
    description: 'Complete your first OutdoorQuest adventure',
    icon: '🌿',
    pillar: 'outdoorquest',
    category: 'pillar',
    condition: 'Complete 1 OutdoorQuest activity',
    threshold: 1
  },
  {
    id: 'outdoorquest-master',
    name: 'Wilderness Expert',
    description: 'Complete 10 OutdoorQuest adventures',
    icon: '🏕️',
    pillar: 'outdoorquest',
    category: 'pillar',
    condition: 'Complete 10 OutdoorQuest activities',
    threshold: 10
  },
  {
    id: 'renaissance-camper',
    name: 'Renaissance Camper',
    description: 'Complete at least one activity from each pillar',
    icon: '🌈',
    pillar: 'global',
    category: 'pillar',
    condition: 'Complete 1+ activity from ToyBox, ScienceLab, ArtStudio, and OutdoorQuest'
  },

  // ============================================
  // CAMP WEEK ACHIEVEMENTS
  // ============================================
  {
    id: 'first-camp-week',
    name: 'Week Warrior',
    description: 'Complete your first Camp Week',
    icon: '📅',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all 5 days of any Camp Week',
    threshold: 1
  },
  {
    id: 'ocean-explorer',
    name: 'Ocean Explorer',
    description: 'Complete the Ocean Explorers Camp Week',
    icon: '🌊',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all 5 days of Ocean Explorers week'
  },
  {
    id: 'space-cadet',
    name: 'Space Cadet',
    description: 'Complete the Space Mission Camp Week',
    icon: '🚀',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all 5 days of Space Mission week'
  },
  {
    id: 'safari-ranger',
    name: 'Safari Ranger',
    description: 'Complete the Backyard Safari Camp Week',
    icon: '🦋',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all 5 days of Backyard Safari week'
  },
  {
    id: 'master-maker',
    name: 'Master Maker',
    description: 'Complete the Maker Week Camp Week',
    icon: '🔧',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all 5 days of Maker Week'
  },
  {
    id: 'summer-champion',
    name: 'Summer Champion',
    description: 'Complete all 4 Camp Weeks',
    icon: '🏆',
    pillar: 'global',
    category: 'campweek',
    condition: 'Complete all Camp Weeks',
    threshold: 4
  },

  // ============================================
  // SPECIAL ACHIEVEMENTS
  // ============================================
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Complete an activity in under 15 minutes',
    icon: '⚡',
    pillar: 'global',
    category: 'special',
    condition: 'Complete any activity in less than 15 minutes'
  },
  {
    id: 'marathon-maker',
    name: 'Marathon Maker',
    description: 'Spend over 5 hours total making',
    icon: '🏃',
    pillar: 'global',
    category: 'special',
    condition: 'Total activity time exceeds 5 hours (300 minutes)'
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Add 10 activities to your favorites',
    icon: '💝',
    pillar: 'global',
    category: 'special',
    condition: 'Favorite 10 or more activities',
    threshold: 10
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Start an activity before 7 AM',
    icon: '🐦',
    pillar: 'global',
    category: 'special',
    condition: 'Begin an activity before 7:00 AM'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete an activity after 9 PM',
    icon: '🦉',
    pillar: 'global',
    category: 'special',
    condition: 'Complete an activity after 9:00 PM'
  },
  {
    id: 'cross-pillar',
    name: 'Connector',
    description: 'Complete two activities that connect across pillars',
    icon: '🔗',
    pillar: 'global',
    category: 'special',
    condition: 'Complete both activities in a cross-pillar pair'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete all steps of an activity without skipping any',
    icon: '✨',
    pillar: 'global',
    category: 'special',
    condition: 'Complete every step in order without skipping'
  },

  // ============================================
  // STREAK ACHIEVEMENTS
  // ============================================
  {
    id: 'three-day-streak',
    name: 'Getting Consistent',
    description: 'Complete activities on 3 consecutive days',
    icon: '🔥',
    pillar: 'global',
    category: 'streak',
    condition: 'Complete at least one activity per day for 3 days',
    threshold: 3
  },
  {
    id: 'week-streak',
    name: 'Week Streak',
    description: 'Complete activities on 7 consecutive days',
    icon: '💪',
    pillar: 'global',
    category: 'streak',
    condition: 'Complete at least one activity per day for 7 days',
    threshold: 7
  },
  {
    id: 'two-week-streak',
    name: 'Unstoppable',
    description: 'Complete activities on 14 consecutive days',
    icon: '🌟',
    pillar: 'global',
    category: 'streak',
    condition: 'Complete at least one activity per day for 14 days',
    threshold: 14
  }
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter(a => a.category === category);
};

export const getAchievementsByPillar = (pillar: string): Achievement[] => {
  return achievements.filter(a => a.pillar === pillar);
};
