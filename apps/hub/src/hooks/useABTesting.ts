// src/hooks/useABTesting.ts
// A/B Testing Framework for Wonder-First Modules
// Purpose: Test different module variations to optimize learning outcomes
// Mission Alignment: Wonder Value - Continuous improvement through curiosity about what works best

import { useState, useEffect } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage weight (e.g., 50 for 50%)
}

interface ABTestConfig {
  testId: string;
  variants: ABTestVariant[];
  startDate?: Date;
  endDate?: Date;
  targetAudience?: {
    ageGroups?: string[];
    languages?: string[];
  };
}

export function useABTesting(config: ABTestConfig) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    // Check if test is active
    const now = new Date();
    if (config.startDate && now < config.startDate) {
      setIsEligible(false);
      return;
    }
    if (config.endDate && now > config.endDate) {
      setIsEligible(false);
      return;
    }

    // Check target audience eligibility
    const userProfile = localStorage.getItem('jigyasu-profile');
    if (userProfile && config.targetAudience) {
      const profile = JSON.parse(userProfile);
      
      if (config.targetAudience.ageGroups && 
          !config.targetAudience.ageGroups.includes(profile.ageGroup)) {
        setIsEligible(false);
        return;
      }
      
      if (config.targetAudience.languages && 
          !config.targetAudience.languages.includes(profile.language)) {
        setIsEligible(false);
        return;
      }
    }

    setIsEligible(true);

    // Assign variant based on user ID (consistent assignment)
    const userId = localStorage.getItem('jigyasu-user-id') || generateUserId();
    if (!localStorage.getItem('jigyasu-user-id')) {
      localStorage.setItem('jigyasu-user-id', userId);
    }

    // Simple hash-based assignment
    const hash = hashString(userId + config.testId);
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0);
    const randomValue = (hash % totalWeight);
    
    let cumulativeWeight = 0;
    let selectedVariantId = '';
    for (const v of config.variants) {
      cumulativeWeight += v.weight;
      if (randomValue < cumulativeWeight) {
        setVariant(v.id);
        selectedVariantId = v.id;
        break;
      }
    }

    // Track assignment
    trackABTestAssignment(config.testId, selectedVariantId);
  }, [config]);

  return {
    variant,
    isEligible,
    trackConversion: (conversionType: string) => {
      if (variant && isEligible) {
        trackABTestConversion(config.testId, variant, conversionType);
      }
    },
  };
}

// Helper functions

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function trackABTestAssignment(testId: string, variantId: string) {
  // Store assignment locally (privacy-first)
  const assignments = JSON.parse(localStorage.getItem('ab_test_assignments') || '{}');
  assignments[`${testId}_${variantId}`] = {
    assignedAt: Date.now(),
    variantId,
  };
  localStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
}

function trackABTestConversion(testId: string, variantId: string, conversionType: string) {
  // Store conversion locally (privacy-first)
  const conversions = JSON.parse(localStorage.getItem('ab_test_conversions') || '{}');
  const key = `${testId}_${variantId}_${conversionType}`;
  conversions[key] = {
    convertedAt: Date.now(),
    variantId,
    conversionType,
  };
  localStorage.setItem('ab_test_conversions', JSON.stringify(conversions));
}

// Pre-configured A/B tests for Wonder-First modules

export const WONDER_FIRST_AB_TESTS = {
  // Test: Mystery hook wording
  mysteryHookWording: {
    testId: 'mystery_hook_wording',
    variants: [
      {
        id: 'question_first',
        name: 'Question First',
        description: 'Start with a direct question',
        weight: 50,
      },
      {
        id: 'statement_first',
        name: 'Statement First',
        description: 'Start with an intriguing statement',
        weight: 50,
      },
    ],
  },

  // Test: Exploration hint timing
  hintTiming: {
    testId: 'hint_timing',
    variants: [
      {
        id: 'immediate_hints',
        name: 'Immediate Hints',
        description: 'Show hints immediately in exploration phase',
        weight: 33,
      },
      {
        id: 'delayed_hints',
        name: 'Delayed Hints',
        description: 'Show hints after 30 seconds',
        weight: 33,
      },
      {
        id: 'on_demand_hints',
        name: 'On-Demand Hints',
        description: 'Show hints only when requested',
        weight: 34,
      },
    ],
  },

  // Test: Insight revelation style
  insightStyle: {
    testId: 'insight_style',
    variants: [
      {
        id: 'dramatic_reveal',
        name: 'Dramatic Reveal',
        description: 'Reveal insight with animation and celebration',
        weight: 50,
      },
      {
        id: 'gradual_reveal',
        name: 'Gradual Reveal',
        description: 'Reveal insight step by step',
        weight: 50,
      },
    ],
  },

  // Test: Application examples
  applicationExamples: {
    testId: 'application_examples',
    variants: [
      {
        id: 'single_example',
        name: 'Single Example',
        description: 'One detailed real-world example',
        weight: 50,
      },
      {
        id: 'multiple_examples',
        name: 'Multiple Examples',
        description: 'Three brief real-world examples',
        weight: 50,
      },
    ],
  },
};

// Example usage in a Wonder-First module:

/*
import { useABTesting, WONDER_FIRST_AB_TESTS } from '@/hooks/useABTesting';

function YourWonderFirstModule() {
  const { variant, isEligible, trackConversion } = useABTesting(
    WONDER_FIRST_AB_TESTS.mysteryHookWording
  );

  // Use variant to render different content
  const mysteryHook = variant === 'question_first'
    ? "Why does this happen?"
    : "This happens because...";

  // Track conversions
  const handleComplete = () => {
    trackConversion('module_completed');
    // ... rest of completion logic
  };

  return (
    // ... module content
  );
}
*/
