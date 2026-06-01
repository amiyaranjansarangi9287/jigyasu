# Jigyasu Contributor Guide

## Overview

Jigyasu is a free, offline-first educational platform built for India. This guide helps external developers contribute modules, features, and improvements.

## Mission & Values

Before contributing, understand our mission:

- **Wonder**: We begin with questions, not answers
- **Equity**: One platform. For everyone.
- **Respect**: No grades, no judgment, no shame
- **Patience**: Learning takes the time it takes
- **Joy**: If learning is not joyful, something is wrong with the design
- **Identity**: Built for India, from India

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/jigyasu.git
cd jigyasu

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Project Structure

```
jigyasu/
├── apps/
│   ├── hub/              # Main application
│   │   ├── src/
│   │   │   ├── learnos/   # Learning platform
│   │   │   │   ├── core/  # Core modules and services
│   │   │   │   ├── worlds/ # World-specific modules (lab, math, etc.)
│   │   │   │   └── services/ # LearningService, etc.
│   │   │   └── components/ # Shared components
│   ├── bio/              # Biology app
│   ├── chem/             # Chemistry app
│   └── physics/          # Physics app
├── packages/
│   ├── ui/               # Shared UI components
│   ├── storage/          # IndexedDB wrapper
│   └── utils/            # Shared utilities
└── e2e/                 # Playwright tests
```

## Creating a New Module

### Step 1: Choose Module Type

Jigyasu supports multiple module types:

1. **Wonder-First Module**: Curiosity-driven learning (recommended)
2. **Traditional Module**: Direct instruction
3. **Interactive Module**: Canvas-based exploration

### Step 2: Wonder-First Module (Recommended)

See `WONDER_FIRST_MODULES.md` for detailed guidance.

**Quick Start:**

```typescript
// src/learnos/worlds/lab/modules/YourModuleWonderFirst.tsx
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';

const yourModule: WonderFirstModule = {
  id: 'your-module-wonder',
  mystery: {
    question: "Your intriguing question?",
    visual: "🎯",
    hook: "Something that makes the learner wonder...",
  },
  exploration: {
    instructions: "What should learners explore?",
    hints: ["Hint 1", "Hint 2", "Hint 3"],
    component: ExplorationComponent,
  },
  insight: {
    revelation: "Clear explanation",
    connection: "How this answers the mystery",
    ahaMoment: "Memorable one-liner",
  },
  application: {
    realWorld: "Everyday application",
    indianContext: "Indian scientist/festival connection",
    tryIt: "Simple action learners can take",
  },
};
```

### Step 3: Register Module

Add to `src/learnos/core/modules/lab.ts`:

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

### Step 4: Add Route

Add to `src/learnos/App.tsx`:

```typescript
<Route path="/lab/your-module-wonder" element={<YourModuleWonderFirst />} />
```

## Content Guidelines

### Indian Context Requirements

Every module MUST include:

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

### Language Support

All text MUST use the `t()` function for internationalization:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<p>{t('your_key', 'Default text')}</p>
```

Add translations to `src/i18n.ts` for all 6 languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Odia (or)

## Accessibility Requirements

### ARIA Labels

All interactive elements must have ARIA labels:

```typescript
<button aria-label="Start exploring the mystery">
  Let's Explore Together
</button>
```

### Keyboard Navigation

- All features must be keyboard accessible
- Add keyboard shortcuts where appropriate
- Ensure focus indicators are visible

### Screen Readers

- Use `aria-live` for dynamic content
- Use `aria-hidden="true"` for decorative elements
- Provide screen reader announcements for phase changes

### Color Contrast

- Ensure 4.5:1 contrast ratio for normal text
- Ensure 3:1 contrast ratio for large text
- Test with high-contrast mode

## Performance Requirements

### 2G Optimization

Use the `useConnectionOptimization` hook:

```typescript
import { useConnectionOptimization } from '@/hooks/useConnectionOptimization';

const { shouldLoadAnimations, shouldLoadImages } = useConnectionOptimization();

// Conditionally disable animations on slow connections
const animationConfig = shouldLoadAnimations
  ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
  : { initial: { opacity: 1 }, animate: { opacity: 1 } };
```

### Asset Optimization

- Use WebP format for images
- Compress images before adding
- Lazy load heavy assets
- Use CDN for static assets

### Bundle Size

- Keep module bundles under 100KB
- Use code splitting for large components
- Avoid unnecessary dependencies

## Testing Requirements

### Unit Tests

Write tests for complex logic:

```typescript
// YourModule.test.tsx
import { render, screen } from '@testing-library/react';
import YourModule from './YourModule';

test('renders mystery phase', () => {
  render(<YourModule />);
  expect(screen.getByText('Your question')).toBeInTheDocument();
});
```

### E2E Tests

Add Playwright tests for module flows:

```typescript
// e2e/your-module.spec.ts
import { test, expect } from '@playwright/test';

test('should complete module flow', async ({ page }) => {
  await page.goto('/lab/your-module');
  await page.click('button:has-text("Start")');
  // ... rest of flow
});
```

### Manual Testing Checklist

- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1920px)
- [ ] Works offline after initial load
- [ ] Works on 2G connection (test with DevTools throttling)
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] All 6 languages display correctly
- [ ] Error boundary catches component errors
- [ ] Analytics events fire correctly

## Code Style

### TypeScript

- Use strict mode
- Avoid `any` types
- Use proper interfaces
- Add JSDoc comments for complex functions

### React

- Use functional components
- Use hooks for state and effects
- Avoid class components
- Follow React best practices

### Tailwind CSS

- Use utility classes
- Avoid custom CSS when possible
- Use responsive prefixes (md:, lg:)
- Use dark mode variants if needed

### Naming Conventions

- Components: PascalCase (e.g., `YourModule`)
- Functions: camelCase (e.g., `handleStartExploration`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_HINTS`)
- Files: PascalCase for components, kebab-case for utilities

## Git Workflow

### Branch Naming

- Feature: `feature/your-feature-name`
- Bug fix: `fix/your-bug-description`
- Documentation: `docs/your-doc-update`

### Commit Messages

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(lab): add gravity wonder-first module

- Implement mystery phase with question about gravity
- Add exploration component with interactive canvas
- Include Indian scientist C.V. Raman
- Add festival connection to Diwali

Closes #123
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Update documentation
6. Submit a PR with:
   - Clear description of changes
   - Screenshots if UI changes
   - Link to related issues
   - Checklist of requirements met

## Review Process

### What We Look For

1. **Mission Alignment**: Does this serve our values?
2. **Indian Context**: Is it authentically Indian?
3. **Accessibility**: Is it accessible to all learners?
4. **Performance**: Does it work on 2G?
5. **Quality**: Is the code clean and tested?
6. **Documentation**: Is it well documented?

### Common Feedback

- "Add more Indian context"
- "Improve accessibility"
- "Optimize for 2G"
- "Add unit tests"
- "Simplify complexity"

## Support

### Getting Help

- GitHub Issues: Report bugs or request features
- Discord: Join our community (link TBD)
- Email: contributors@jigyasu.app

### Resources

- Wonder-First Modules Guide: `WONDER_FIRST_MODULES.md`
- Ambassador Program Guide: `AMBASSADOR_PROGRAM_GUIDE.md`
- Testing Guide: `e2e/TESTING_GUIDE.md`

## Recognition

Contributors are recognized in:
- Contributors section in About page
- Release notes
- Annual impact report
- Special contributor badge (TBD)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

## Quick Reference

### Common Imports

```typescript
// React hooks
import { useState, useEffect, useCallback } from 'react';

// Routing
import { useNavigate } from 'react-router-dom';

// Translation
import { useTranslation } from 'react-i18next';

// Store
import { useLearnerStore } from '@/store/learnerStore';
import { useSettingsStore } from '@/store/settingsStore';

// Services
import { LearningService } from '@/services/LearningService';

// Components
import { ErrorBoundary } from '@jigyasu/ui';
import WonderFirstTemplate from '@/core/modules/WonderFirstTemplate';

// Hooks
import { useConnectionOptimization } from '@/hooks/useConnectionOptimization';
import { useAgeTheme } from '@/hooks/useAgeTheme';
```

### Common Patterns

**Creating a new Wonder-First module:**
1. Copy existing module as template
2. Update content with your concept
3. Add Indian context (scientists, festivals)
4. Test all phases
5. Add to module registry
6. Write tests
7. Submit PR

**Adding a new language:**
1. Add to `src/i18n.ts`
2. Translate all keys
3. Test language switching
4. Submit PR

**Adding a new feature:**
1. Discuss in issue first
2. Create design document
3. Implement with tests
4. Update documentation
5. Submit PR

---

*Thank you for contributing to Jigyasu! Every contribution helps bring free, quality education to learners across India.*
