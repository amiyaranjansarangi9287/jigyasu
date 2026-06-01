/**
 * A/B Testing Framework
 * Feature flagging and A/B testing for experimentation
 */

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: {
    control: string;
    treatment: string;
  };
  trafficSplit: number; // 0-1, percentage for treatment
  startDate?: number;
  endDate?: number;
  targetAudience?: {
    ageGroup?: string[];
    language?: string[];
  };
}

export interface ExperimentConfig {
  userId: string;
  experiments: Experiment[];
}

class ABTestingFramework {
  private config: ExperimentConfig;
  private userVariants: Map<string, string> = new Map();

  constructor(config: ExperimentConfig) {
    this.config = config;
    this.loadUserVariants();
  }

  /**
   * Load user's assigned variants from localStorage
   */
  private loadUserVariants(): void {
    const stored = localStorage.getItem('jigyasu_ab_variants');
    if (stored) {
      try {
        this.userVariants = new Map(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load A/B test variants:', error);
      }
    }
  }

  /**
   * Save user's assigned variants to localStorage
   */
  private saveUserVariants(): void {
    localStorage.setItem('jigyasu_ab_variants', JSON.stringify([...this.userVariants]));
  }

  /**
   * Generate consistent hash for user and experiment
   */
  private hashUserForExperiment(userId: string, experimentId: string): number {
    const combined = `${userId}-${experimentId}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Check if user is eligible for experiment
   */
  private isEligible(experiment: Experiment): boolean {
    // Check date range
    const now = Date.now();
    if (experiment.startDate && now < experiment.startDate) {
      return false;
    }
    if (experiment.endDate && now > experiment.endDate) {
      return false;
    }

    // Check target audience (if specified, would need user profile data)
    // For now, we'll assume all users are eligible
    return true;
  }

  /**
   * Get variant for a specific experiment
   */
  getVariant(experimentId: string): string {
    // Check if user already has an assigned variant
    if (this.userVariants.has(experimentId)) {
      return this.userVariants.get(experimentId)!;
    }

    // Find experiment
    const experiment = this.config.experiments.find((e) => e.id === experimentId);
    if (!experiment || !this.isEligible(experiment)) {
      return 'control';
    }

    // Assign variant based on consistent hash
    const hash = this.hashUserForExperiment(this.config.userId, experimentId);
    const normalizedHash = hash / 0xFFFFFFFF; // Normalize to 0-1
    const variant = normalizedHash < experiment.trafficSplit ? 'treatment' : 'control';

    // Save assignment
    this.userVariants.set(experimentId, variant);
    this.saveUserVariants();

    return variant;
  }

  /**
   * Check if user is in treatment group
   */
  isTreatment(experimentId: string): boolean {
    return this.getVariant(experimentId) === 'treatment';
  }

  /**
   * Check if user is in control group
   */
  isControl(experimentId: string): boolean {
    return this.getVariant(experimentId) === 'control';
  }

  /**
   * Track experiment exposure
   */
  trackExposure(experimentId: string, variant: string): void {
    // Send to analytics
    // This would integrate with the analytics utility
    console.log(`A/B Test Exposure: ${experimentId} - ${variant}`);
  }

  /**
   * Track experiment conversion
   */
  trackConversion(experimentId: string, value?: number): void {
    const variant = this.getVariant(experimentId);
    console.log(`A/B Test Conversion: ${experimentId} - ${variant} - Value: ${value}`);
  }

  /**
   * Reset user's variant assignments (for testing)
   */
  resetVariants(): void {
    this.userVariants.clear();
    this.saveUserVariants();
  }

  /**
   * Get all active experiments for user
   */
  getActiveExperiments(): Experiment[] {
    return this.config.experiments.filter((exp) => this.isEligible(exp));
  }

  /**
   * Get user's variant assignments
   */
  getUserAssignments(): Record<string, string> {
    return Object.fromEntries(this.userVariants);
  }
}

// Default experiments
const defaultExperiments: Experiment[] = [
  {
    id: 'onboarding_flow_v2',
    name: 'Onboarding Flow V2',
    description: 'Test new onboarding flow with interactive tutorial',
    variants: {
      control: 'current_onboarding',
      treatment: 'new_onboarding',
    },
    trafficSplit: 0.5,
  },
  {
    id: 'gamification_rewards',
    name: 'Gamification Rewards',
    description: 'Test different reward structures for achievements',
    variants: {
      control: 'current_rewards',
      treatment: 'enhanced_rewards',
    },
    trafficSplit: 0.3,
  },
  {
    id: 'module_recommendations',
    name: 'Module Recommendations',
    description: 'Test AI-powered module recommendations',
    variants: {
      control: 'static_recommendations',
      treatment: 'ai_recommendations',
    },
    trafficSplit: 0.4,
  },
];

// Create default instance
export const abTesting = new ABTestingFramework({
  userId: 'anonymous', // Will be set when user logs in
  experiments: defaultExperiments,
});

/**
 * Hook for using A/B testing in components
 */
export function useABTesting(userId?: string) {
  if (userId) {
    abTesting['config'].userId = userId;
  }

  return {
    getVariant: (experimentId: string) => abTesting.getVariant(experimentId),
    isTreatment: (experimentId: string) => abTesting.isTreatment(experimentId),
    isControl: (experimentId: string) => abTesting.isControl(experimentId),
    trackExposure: (experimentId: string, variant: string) =>
      abTesting.trackExposure(experimentId, variant),
    trackConversion: (experimentId: string, value?: number) =>
      abTesting.trackConversion(experimentId, value),
    getActiveExperiments: () => abTesting.getActiveExperiments(),
    getUserAssignments: () => abTesting.getUserAssignments(),
  };
}

/**
 * Feature flag utility
 */
export function isFeatureEnabled(featureId: string): boolean {
  // Simple feature flag implementation
  // In production, this would check a remote config
  const flags: Record<string, boolean> = {
    'dark_mode': true,
    'voice_search': true,
    'offline_mode': true,
    'social_sharing': true,
    'gamification': true,
    'realtime_collaboration': false, // Disabled by default
  };

  return flags[featureId] || false;
}
