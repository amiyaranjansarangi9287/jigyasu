# Wonder-First Modules Developer Guide

## Overview

Wonder-First modules are mission-aligned learning experiences that embody the **Wonder** value: *"We begin with questions, not answers. Every concept starts with a mystery, not a definition."*

This design pattern transforms traditional educational content into curiosity-driven exploration that protects the natural wonder every learner is born with.

## Philosophy

### Traditional vs Wonder-First

**Traditional Approach:**
- Definition → Explanation → Examples → Practice
- Focus: Information transfer
- Learner role: Passive recipient

**Wonder-First Approach:**
- Mystery → Exploration → Insight → Application
- Focus: Curiosity and discovery
- Learner role: Active investigator

### Mission Alignment

- **Wonder Value**: Begin with questions, not answers
- **Equity Value**: Works on 2G connections, accessible to all
- **Respect Value**: No judgment, no wrong answers during exploration
- **Patience Value**: No timers, learners take the time they need
- **Joy Value**: Discovery is inherently joyful
- **Identity Value**: Indian context, scientists, and examples

## Module Structure

A Wonder-First module follows a four-phase journey:

### Phase 1: Mystery Hook
- **Purpose**: Spark curiosity with an intriguing question
- **Elements**:
  - `question`: The central mystery
  - `visual`: Emoji or icon representing the mystery
  - `hook`: A compelling statement that makes the learner wonder

### Phase 2: Exploration
- **Purpose**: Hands-on investigation without answers
- **Elements**:
  - `component`: Interactive exploration component (can be JSX or function component)
  - `instructions`: Guidance for exploration
  - `hints`: Progressive hints (3-4 levels) to guide without giving answers

### Phase 3: Insight Moment
- **Purpose**: The "aha!" moment when understanding clicks
- **Elements**:
  - `revelation`: Clear explanation of the concept
  - `connection`: How this solves the mystery
  - `ahaMoment`: Memorable one-liner that captures the insight

### Phase 4: Application
- **Purpose**: Connect learning to real life
- **Elements**:
  - `realWorld`: How this applies in everyday life
  - `indianContext`: Indian festivals, scientists, or cultural connections
  - `tryIt`: A simple action the learner can take

## Creating a New Wonder-First Module

### Step 1: Module Registration

Add your module to `src/learnos/core/modules/lab.ts`:

```typescript
{
  id: 'your-module-wonder',
  worldId: 'lab',
  title: 'Your Module (Wonder-First)',
  description: 'Brief description',
  emoji: '🎯',
  color: 'from-indigo-500 to-violet-500',
  bgColor: 'bg-indigo-50',
  path: '/lab/your-module-wonder',
  estimatedMinutes: 20,
  featureFlag: 'wonder-first'
}
```

### Step 2: Create Module File

Create `src/learnos/worlds/lab/modules/YourModuleWonderFirst.tsx`:

```typescript
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

// Exploration Component
function ExplorationComponent() {
  const [state, setState] = useState(initialState);
  const { language } = useLearnerStore();

  const handleInteraction = useCallback((data) => {
    setState(data);
    LearningService.trackEvent('your-module-wonder-session', 'lab', language, 'canvas_interaction', 'your-module', data);
  }, [language]);

  return (
    <div className="space-y-6">
      {/* Your interactive exploration UI */}
    </div>
  );
}

export default function YourModuleWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  const yourWonderModule: WonderFirstModule = {
    id: 'your-module-wonder',
    mystery: {
      question: "Your intriguing question?",
      visual: "🎯",
      hook: "Something that makes the learner wonder...",
    },
    exploration: {
      instructions: "What should learners explore?",
      hints: [
        "Hint 1: Gentle guidance",
        "Hint 2: More specific direction",
        "Hint 3: Almost giving it away",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Clear explanation of the concept",
      connection: "How this answers the mystery",
      ahaMoment: "Memorable one-liner",
    },
    application: {
      realWorld: "Everyday application",
      indianContext: "Indian scientist/festival/connection\n\n🎨 **Festival Connection**: ...\n\n👨‍🔬 **Scientist Name** - Contribution...",
      tryIt: "Simple action learners can take",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={yourWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
```

### Step 3: Add Route

Add the route to your routing configuration (typically in App.tsx or routes file):

```typescript
{
  path: '/lab/your-module-wonder',
  element: <YourModuleWonderFirst />
}
```

## Best Practices

### Mystery Phase
- **Ask genuine questions** that don't have obvious answers
- **Use relatable scenarios** from daily life
- **Avoid technical jargon** in the mystery
- **Make it visual** with emojis or icons

### Exploration Phase
- **Provide open-ended interaction** - no "right" way to explore
- **Use progressive hints** that guide without solving
- **Include observation prompts** to encourage thinking
- **Track interactions** with LearningService for analytics
- **Respect the 2G optimization hook** for slow connections

### Insight Phase
- **Celebrate the discovery** with positive language
- **Connect back to the mystery** explicitly
- **Use clear, simple language** - avoid jargon
- **Make it memorable** with the ahaMoment

### Application Phase
- **Connect to real life** - make it practical
- **Include Indian context** - scientists, festivals, culture
- **Provide actionable next steps** - what can they do now?
- **Honor multiple Indian scientists** when relevant

### Accessibility
- **Add ARIA labels** to all interactive elements
- **Use aria-hidden="true"** for decorative emojis
- **Ensure keyboard navigation** works
- **Provide sufficient color contrast**

### Performance
- **Use the connection optimization hook** to disable animations on slow connections
- **Lazy load heavy assets** when possible
- **Optimize images** for 2G connections
- **Track performance** with the provided hooks

## Content Guidelines

### Indian Context Requirements

Every Wonder-First module MUST include:

1. **At least one Indian scientist** with their contribution
2. **At least one festival connection** (when relevant)
3. **Indian examples** from daily life (rotis, chai, monsoons, etc.)
4. **Cultural respect** - accurate, thoughtful representation

### Festival Connection Format

```typescript
indianContext: `
🌾 **Festival Name**: Brief description of how it connects to the concept.
The traditional dish/practice relates to [concept] because...
The festival honors [aspect] which parallels [scientific concept].

🎨 **Another Festival**: Different connection example...

👨‍🔬 **Scientist Name (Years)** - Contribution to the field...

👨‍🔬 **Another Scientist** - Their contribution...
`
```

### Scientist Spotlight Format

Include:
- Name and years
- Specific contribution to the concept
- Why it matters to Indian science

## Testing Checklist

Before submitting a Wonder-First module:

- [ ] TypeScript compiles without errors
- [ ] Module appears in the lab (with wonder-first flag enabled)
- [ ] All four phases work correctly
- [ ] Exploration component is interactive
- [ ] Hints are progressive and helpful
- [ ] ARIA labels are present on all interactive elements
- [ ] Animations disable on slow connections (test with DevTools throttling)
- [ ] Indian context includes at least one scientist
- [ ] Festival connections are accurate and respectful
- [ ] LearningService tracking is implemented
- [ ] Module works offline (after initial load)
- [ ] Error boundary catches component errors gracefully
- [ ] Navigation works (enter and exit)

## Examples

See existing Wonder-First modules for reference:
- `DigestiveSystemWonderFirst.tsx` - Biology example with festival connections
- `GravityWonderFirst.tsx` - Physics example with canvas interaction
- `FractionsWonderFirst.tsx` - Math example with visual exploration

## Support

For questions or issues:
1. Check this guide first
2. Review existing modules for patterns
3. Test with the wonder-first feature flag enabled
4. Verify 2G optimization with network throttling

## Mission Reminder

Every Wonder-First module exists to:
> "Keep the why loud. Forever."

When learners complete your module, they should feel:
- **Curious** - not confused
- **Capable** - not judged
- **Connected** - not isolated
- **Joyful** - not bored

This is not a feature. It is the entire reason Jigyasu exists.
