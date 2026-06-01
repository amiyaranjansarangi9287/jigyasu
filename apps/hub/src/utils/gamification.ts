/**
 * Gamification System
 * Badges, achievements, XP, and leaderboards for learner engagement
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  criteria: {
    type: 'module_completion' | 'streak' | 'wonder_moments' | 'time_spent' | 'exploration';
    target: number;
    current: number;
  };
  unlocked: boolean;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  xp: number;
  badges: number;
  avatar?: string;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  streak: number;
  lastActive: number;
}

class GamificationSystem {
  private userProgress: Map<string, UserProgress> = new Map();
  private leaderboard: LeaderboardEntry[] = [];

  /**
   * Calculate level from XP
   */
  private calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Calculate XP needed for next level
   */
  private xpForNextLevel(level: number): number {
    return Math.pow(level, 2) * 100;
  }

  /**
   * Add XP to user
   */
  addXP(userId: string, amount: number): void {
    const progress = this.getUserProgress(userId);
    progress.xp += amount;
    progress.level = this.calculateLevel(progress.xp);
    progress.lastActive = Date.now();
    this.userProgress.set(userId, progress);
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): UserProgress {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {
        userId,
        xp: 0,
        level: 1,
        badges: [],
        achievements: [],
        streak: 0,
        lastActive: Date.now(),
      });
    }
    return this.userProgress.get(userId)!;
  }

  /**
   * Award badge to user
   */
  awardBadge(userId: string, badge: Omit<Badge, 'unlockedAt'>): void {
    const progress = this.getUserProgress(userId);
    
    if (!progress.badges.find((b) => b.id === badge.id)) {
      progress.badges.push({
        ...badge,
        unlockedAt: Date.now(),
      });
      this.userProgress.set(userId, progress);
    }
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(userId: string, achievementId: string): void {
    const progress = this.getUserProgress(userId);
    const achievement = progress.achievements.find((a) => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.addXP(userId, achievement.xpReward);
      this.userProgress.set(userId, progress);
    }
  }

  /**
   * Update achievement progress
   */
  updateAchievementProgress(
    userId: string,
    achievementId: string,
    increment: number
  ): void {
    const progress = this.getUserProgress(userId);
    const achievement = progress.achievements.find((a) => a.id === achievementId);
    
    if (achievement) {
      achievement.criteria.current += increment;
      
      if (achievement.criteria.current >= achievement.criteria.target) {
        this.unlockAchievement(userId, achievementId);
      }
      
      this.userProgress.set(userId, progress);
    }
  }

  /**
   * Update streak
   */
  updateStreak(userId: string): void {
    const progress = this.getUserProgress(userId);
    const now = Date.now();
    const lastActive = progress.lastActive;
    const daysSinceLastActive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActive <= 1) {
      progress.streak += 1;
    } else if (daysSinceLastActive > 1) {
      progress.streak = 1;
    }
    
    progress.lastActive = now;
    this.userProgress.set(userId, progress);
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];
    
    for (const [userId, progress] of this.userProgress.entries()) {
      entries.push({
        rank: 0, // Will be calculated after sorting
        userId,
        userName: userId, // In real app, fetch from user profile
        xp: progress.xp,
        badges: progress.badges.length,
      });
    }
    
    // Sort by XP descending
    entries.sort((a, b) => b.xp - a.xp);
    
    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return entries.slice(0, limit);
  }

  /**
   * Get user rank
   */
  getUserRank(userId: string): number {
    const leaderboard = this.getLeaderboard(1000);
    const entry = leaderboard.find((e) => e.userId === userId);
    return entry?.rank || 0;
  }

  /**
   * Check for new achievements
   */
  checkAchievements(userId: string): Achievement[] {
    const progress = this.getUserProgress(userId);
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of progress.achievements) {
      if (achievement.unlocked && !newlyUnlocked.includes(achievement)) {
        newlyUnlocked.push(achievement);
      }
    }
    
    return newlyUnlocked;
  }

  /**
   * Get achievement definitions
   */
  getAchievementDefinitions(): Omit<Achievement, 'unlocked' | 'unlockedAt'>[] {
    return [
      {
        id: 'first_module',
        title: 'First Steps',
        description: 'Complete your first learning module',
        icon: '🎯',
        xpReward: 100,
        criteria: {
          type: 'module_completion',
          target: 1,
          current: 0,
        },
        
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        xpReward: 500,
        criteria: {
          type: 'streak',
          target: 7,
          current: 0,
        },
        
      },
      {
        id: 'wonder_10',
        title: 'Wonder Seeker',
        description: 'Experience 10 wonder moments',
        icon: '✨',
        xpReward: 300,
        criteria: {
          type: 'wonder_moments',
          target: 10,
          current: 0,
        },
        
      },
      {
        id: 'explorer',
        title: 'Explorer',
        description: 'Visit all learning worlds',
        icon: '🗺️',
        xpReward: 400,
        criteria: {
          type: 'exploration',
          target: 6,
          current: 0,
        },
        
      },
      {
        id: 'time_master',
        title: 'Time Master',
        description: 'Spend 10 hours learning',
        icon: '⏰',
        xpReward: 600,
        criteria: {
          type: 'time_spent',
          target: 36000, // 10 hours in seconds
          current: 0,
        },
        
      },
    ];
  }

  /**
   * Get badge definitions
   */
  getBadgeDefinitions(): Omit<Badge, 'unlockedAt'>[] {
    return [
      {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined Jigyasu in the first month',
        icon: '🌟',
        rarity: 'legendary',
      },
      {
        id: 'quick_learner',
        name: 'Quick Learner',
        description: 'Complete 5 modules in one day',
        icon: '⚡',
        rarity: 'epic',
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Learn for 30 consecutive days',
        icon: '💎',
        rarity: 'rare',
      },
      {
        id: 'curious',
        name: 'Curious',
        description: 'Explore all topics in a world',
        icon: '🔍',
        rarity: 'common',
      },
    ];
  }
}

// Singleton instance
export const gamification = new GamificationSystem();

/**
 * Hook for using gamification in components
 */
export function useGamification(userId: string) {
  const progress = gamification.getUserProgress(userId);
  const leaderboard = gamification.getLeaderboard();
  const rank = gamification.getUserRank(userId);

  return {
    progress,
    leaderboard,
    rank,
    addXP: (amount: number) => gamification.addXP(userId, amount),
    awardBadge: (badge: Omit<Badge, 'unlockedAt'>) => gamification.awardBadge(userId, badge),
    updateAchievementProgress: (achievementId: string, increment: number) =>
      gamification.updateAchievementProgress(userId, achievementId, increment),
    updateStreak: () => gamification.updateStreak(userId),
    checkAchievements: () => gamification.checkAchievements(userId),
  };
}
