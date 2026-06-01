# Deep Scan Production Audit Prompt

## Objective
Perform a comprehensive deep scan of a React-based educational platform to identify performance issues, memory leaks, state management problems, and deployment readiness concerns. Create a detailed audit report with severity ratings and actionable recommendations.

## Context
This audit follows an initial audit where critical timer dependency bugs were identified and fixed. The deep scan focuses on advanced engineering concerns that were not covered in the initial audit, including bundle optimization, memory management, component re-render patterns, animation performance, and testing coverage.

## What to Audit

### 1. Bundle Size & Performance Analysis
- **What:** Examine build configuration, code splitting, lazy loading, and bundle optimization
- **Why:** Large bundles cause slow initial loads and poor user experience, especially on mobile devices
- **How:**
  - Read `vite.config.ts` to check manual chunks configuration
  - Search for `lazy(() => import(` to find lazy-loaded components
  - Search for `Suspense` to verify loading fallbacks
  - Check if heavy dependencies (framer-motion, dexie) are in separate chunks
  - Verify all world routes use lazy loading

### 2. Memory Leak Detection Patterns
- **What:** Identify potential memory leaks from event listeners, timers, and animations
- **Why:** Memory leaks cause performance degradation over time and can crash the browser
- **How:**
  - Search for `addEventListener` and verify corresponding `removeEventListener` in cleanup functions
  - Search for `setInterval` and verify `clearInterval` in useEffect cleanup
  - Search for `setTimeout` and verify `clearTimeout` in cleanup
  - Search for `requestAnimationFrame` and verify `cancelAnimationFrame` in cleanup
  - Check if refs are used to store timer IDs for proper cleanup
  - Look for patterns where event listeners are added but never removed

### 3. State Management (Zustand) Patterns
- **What:** Analyze Zustand store architecture, persistence, and migration strategies
- **Why:** Poor state management causes bugs, data loss, and migration issues
- **How:**
  - Read all store files in `src/learnos/store/`
  - Check if persist middleware is used with version numbers
  - Verify migration functions exist for state versioning
  - Check if localStorage operations are wrapped in try-catch
  - Verify state updates use functional setState patterns
  - Check if stores are properly separated by concern (learner, session, settings)

### 4. Component Re-render Optimization
- **What:** Identify unnecessary re-renders and missing memoization
- **Why:** Unnecessary re-renders cause performance issues, especially in complex UIs
- **How:**
  - Search for `useMemo` usage to verify expensive calculations are memoized
  - Search for `React.memo` usage (or lack thereof)
  - Search for `useCallback` usage for event handlers
  - Identify components that receive stable props but may re-render due to parent updates
  - Look for list items, cards, or repeated components that could benefit from React.memo

### 5. Animation & Canvas Performance
- **What:** Analyze canvas rendering, animation loops, and HiDPI support
- **Why:** Poor animation performance causes janky UX and battery drain
- **How:**
  - Search for canvas components and check HiDPI scaling (devicePixelRatio)
  - Check if animation loops use requestAnimationFrame with delta time
  - Verify touch events use `{ passive: false }` when preventDefault is needed
  - Check if canvas contexts are properly cleaned up
  - Look for animation frame cleanup in useEffect

### 6. Audio Engine Implementation
- **What:** Review audio engine architecture, error handling, and speech synthesis
- **Why:** Audio errors can crash the app or cause poor UX
- **How:**
  - Read `AudioEngine.ts` to understand the architecture
  - Search for AudioEngine usage and verify try-catch blocks
  - Check speech synthesis usage and verify cleanup (cancel)
  - Verify audio is gated by soundEnabled flag
  - Check if audio errors are handled gracefully

### 7. Form Validation & Error Handling
- **What:** Review error boundaries, error messages, and form validation
- **Why:** Poor error handling causes bad UX and crashes
- **How:**
  - Search for ErrorBoundary components and verify they wrap critical sections
  - Check error messages in i18n files - are they child-friendly?
  - Search for try-catch blocks and verify error handling
  - Check if forms have validation with clear error messages
  - Verify error states are announced to screen readers (aria-live)

### 8. Loading States & Race Conditions
- **What:** Analyze loading states, async operations, and race condition prevention
- **Why:** Missing loading states cause confusion; race conditions cause data corruption
- **How:**
  - Search for `loading` or `isLoading` state in progress hooks
  - Verify Suspense fallbacks exist for all lazy-loaded routes
  - Check if async operations use proper await/try-catch
  - Look for debouncing/throttling on API calls
  - Check if state updates use functional setState patterns
  - Verify no parallel state updates that could conflict

### 9. Third-Party Integrations & Analytics
- **What:** Review Sentry, telemetry, and API client implementations
- **Why:** Poor integration can cause data loss, privacy violations, or crashes
- **How:**
  - Read `sentry.ts` and verify PII stripping in beforeSend
  - Check if Sentry uses dynamic import to avoid blocking
  - Read telemetry service and verify offline queue and retry logic
  - Check API client for proper error handling and auth
  - Verify analytics don't collect PII (COPPA compliance)

### 10. Testing Coverage Analysis
- **What:** Evaluate test coverage and test quality
- **Why:** Insufficient testing leads to regressions and bugs in production
- **How:**
  - Find all test files (*.test.ts, *.test.tsx)
  - Read test files to understand what's tested
  - Identify gaps in coverage (canvas components, error boundaries, etc.)
  - Check if tests are well-written and comprehensive
  - Recommend E2E tests for difficult-to-unit-test components

### 11. Build & Deployment Readiness
- **What:** Review build configuration, PWA setup, and environment variables
- **Why:** Poor build config causes production issues
- **How:**
  - Read `vite.config.ts` and verify production-ready settings
  - Check PWA configuration and caching strategies
  - Verify environment variables use VITE_ prefix
  - Check if path aliases are configured
  - Verify service worker is configured for offline support

## Verification of Previous Fixes
Before starting the deep scan, verify that fixes from the previous audit were applied:
1. Read the previous audit report to understand what was fixed
2. Check the specific files mentioned in the previous report
3. Verify the dependency arrays in useEffect hooks were corrected
4. Confirm timer state variables (quizTime, timeLeft) were removed from dependencies

## Report Structure

Create a markdown report with the following sections:

1. **Executive Summary** - Overall score, critical issues, total issues, previous fixes status
2. **Status of Previous Audit Fixes** - Verification of previous fixes
3. **Phase 1-11** - Each audit phase with findings, code examples, and assessments
4. **New Issues Found** - List of new issues with severity, location, impact, and recommendations
5. **Comparison with Previous Audit** - Table comparing metrics
6. **Production Readiness Assessment** - Overall readiness decision
7. **Implementation Timeline** - Estimated effort for remaining issues
8. **Recommendations** - Immediate, post-launch, and long-term recommendations
9. **Conclusion** - Final summary and launch decision

## Severity Levels
- 🔴 CRITICAL - Blocks launch, must fix immediately
- 🟠 HIGH - Should fix before launch if possible
- 🟡 MEDIUM - Fix post-launch, optimization or UX improvement
- 🟢 LOW - Nice to have, can defer

## Assessment Labels
- ✅ EXCELLENT - No issues found, best practices followed
- ✅ GOOD - Minor issues, acceptable for production
- ⚠️ NEEDS IMPROVEMENT - Issues found but not blocking
- ❌ BLOCKING - Critical issue that must be fixed

## Tools to Use
- `grep_search` - Search for patterns across the codebase
- `read_file` - Read specific files to understand implementation
- `find_by_name` - Find files by pattern
- `list_dir` - List directory contents
- `todo_list` - Track audit progress

## Search Patterns to Use
- `addEventListener` - Find event listeners
- `removeEventListener` - Verify cleanup
- `setInterval` - Find timers
- `setTimeout` - Find timeouts
- `requestAnimationFrame` - Find animation frames
- `useMemo` - Find memoization
- `React.memo` - Find component memoization
- `useCallback` - Find callback memoization
- `loading` - Find loading states
- `isLoading` - Find loading states
- `fetch` - Find API calls
- `AudioEngine` - Find audio usage
- `speechSynthesis` - Find speech synthesis
- `validate` - Find form validation
- `error` - Find error handling
- `lazy(() => import` - Find lazy loading
- `Suspense` - Find suspense boundaries

## Expected Output
A comprehensive markdown report named `JIGYASU_PRODUCTION_AUDIT_REPORT_v[X].md` with:
- Production readiness score
- List of all issues found with severity
- Code examples for each finding
- Actionable recommendations
- Implementation timeline
- Final launch decision

## Success Criteria
- All critical issues from previous audit verified as fixed
- No new critical issues found
- Report is comprehensive and actionable
- Recommendations are prioritized and realistic
- Production readiness decision is clear and justified
