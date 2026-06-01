# Jigyasu Playwright Testing Guide

## Overview

This guide covers the comprehensive Playwright test suite for the Jigyasu educational platform. The test suite covers end-to-end testing across multiple dimensions including user flows, offline functionality, performance, accessibility, and more.

## Test Files

### Core Test Files

- **onboarding-comprehensive.spec.ts** - Comprehensive onboarding flow tests with edge cases
- **offline-comprehensive.spec.ts** - PWA and offline behavior tests
- **portals.spec.ts** - Subject-specific portal tests (biology, math, physics, chemistry)
- **performance.spec.ts** - Performance and memory tests
- **accessibility.spec.ts** - Accessibility compliance tests
- **cross-browser-mobile.spec.ts** - Cross-browser and mobile interaction tests
- **data-persistence.spec.ts** - Data persistence and synchronization tests
- **internationalization.spec.ts** - Internationalization and localization tests

### Existing Test Files (Original)

- **onboarding.spec.ts** - Basic onboarding flow test
- **offline.spec.ts** - Basic offline functionality test
- **dashboard.spec.ts** - Parent dashboard test
- **hub.spec.ts** - Hub flow test
- **makerspace.spec.ts** - Maker Space flow test
- **crawler.spec.ts** - Deep crawl test for all portals
- **utils.ts** - Shared test utilities

## Running Tests

### Local Development

```bash
# Run all tests
pnpm exec playwright test

# Run tests in headed mode (watch browser)
pnpm exec playwright test --headed

# Run specific test file
pnpm exec playwright test onboarding-comprehensive.spec.ts

# Run tests with specific browser
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit

# Run tests in debug mode
pnpm exec playwright test --debug

# Run tests with UI mode
pnpm exec playwright test --ui
```

### Running Specific Test Suites

```bash
# Onboarding tests
pnpm exec playwright test onboarding-comprehensive.spec.ts

# Offline/PWA tests
pnpm exec playwright test offline-comprehensive.spec.ts

# Portal tests
pnpm exec playwright test portals.spec.ts

# Performance tests
pnpm exec playwright test performance.spec.ts

# Accessibility tests
pnpm exec playwright test accessibility.spec.ts

# Cross-browser/mobile tests
pnpm exec playwright test cross-browser-mobile.spec.ts

# Data persistence tests
pnpm exec playwright test data-persistence.spec.ts

# Internationalization tests
pnpm exec playwright test internationalization.spec.ts
```

### Test Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3100` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Test Directory**: `./e2e`
- **Browsers**: Chromium, Firefox, WebKit (Desktop Safari)
- **Parallel Execution**: Enabled locally, single worker in CI
- **Retries**: 2 retries in CI, 0 locally
- **Reporter**: HTML reporter
- **Trace**: On-first-retry
- **Web Server**: Automatically starts dev server before tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps
        
      - name: Run Playwright tests
        run: pnpm exec playwright test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables

- `PLAYWRIGHT_PORT` - Port for the dev server (default: 3100)
- `PLAYWRIGHT_BASE_URL` - Base URL for tests (default: `http://localhost:3100`)
- `CI` - Set to true in CI environments (enables retries and single worker)

## Test Coverage

### User Flow Tests

- ✅ Onboarding flow with multiple scenarios
- ✅ Profile creation and validation
- ✅ Age group selection
- ✅ Avatar selection
- ✅ Parental gate functionality
- ✅ Language selection

### Offline/PWA Tests

- ✅ Service worker installation
- ✅ Offline functionality
- ✅ Cache strategies
- ✅ Network resilience
- ✅ Data synchronization
- ✅ Offline data storage

### Portal Tests

- ✅ Biology portal functionality
- ✅ Math portal functionality
- ✅ Physics portal functionality
- ✅ Chemistry portal functionality
- ✅ Cross-portal navigation
- ✅ Content loading
- ✅ Error handling

### Performance Tests

- ✅ Page load times
- ✅ Navigation performance
- ✅ Memory usage
- ✅ Memory leak detection
- ✅ Asset loading performance
- ✅ Core Web Vitals (FCP, LCP, CLS, TTI)
- ✅ Concurrent request handling

### Accessibility Tests

- ✅ Heading hierarchy
- ✅ Image alt text
- ✅ Color contrast
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Form labels
- ✅ Landmark regions
- ✅ Screen reader compatibility

### Cross-Browser/Mobile Tests

- ✅ Mobile device testing (iPhone, iPad)
- ✅ Desktop testing
- ✅ Touch interactions
- ✅ Responsive design
- ✅ Screen orientations
- ✅ Browser compatibility (Chromium, Firefox, WebKit)
- ✅ Mobile-specific features

### Data Persistence Tests

- ✅ User profile persistence
- ✅ Learning progress tracking
- ✅ XP and badges persistence
- ✅ IndexedDB operations
- ✅ Data synchronization
- ✅ Conflict resolution
- ✅ Large dataset handling
- ✅ Data backup and restore
- ✅ Data migration
- ✅ Privacy and deletion

### Internationalization Tests

- ✅ Language switching
- ✅ Date/time formatting
- ✅ Number formatting
- ✅ Currency formatting
- ✅ RTL language support
- ✅ Character encoding
- ✅ Pluralization rules
- ✅ Localized error messages

## Best Practices

### Writing New Tests

1. **Use descriptive test names** - Test names should clearly describe what is being tested
2. **Follow the Arrange-Act-Assert pattern** - Set up conditions, perform actions, verify results
3. **Use page objects** - Reuse page objects and utilities from `utils.ts`
4. **Keep tests independent** - Each test should be able to run independently
5. **Use appropriate selectors** - Prefer accessible selectors over CSS selectors when possible
6. **Add proper waits** - Use `waitForLoadState`, `waitForTimeout`, or `waitForSelector` as needed
7. **Clean up after tests** - Remove test data, close pages, reset state

### Test Organization

```
e2e/
├── onboarding-comprehensive.spec.ts
├── offline-comprehensive.spec.ts
├── portals.spec.ts
├── performance.spec.ts
├── accessibility.spec.ts
├── cross-browser-mobile.spec.ts
├── data-persistence.spec.ts
├── internationalization.spec.ts
├── onboarding.spec.ts (original)
├── offline.spec.ts (original)
├── dashboard.spec.ts (original)
├── hub.spec.ts (original)
├── makerspace.spec.ts (original)
├── crawler.spec.ts (original)
└── utils.ts (shared utilities)
```

### Debugging Tests

```bash
# Run in debug mode with inspector
pnpm exec playwright test --debug

# Run in UI mode for interactive debugging
pnpm exec playwright test --ui

# Run with trace on first retry
pnpm exec playwright test --trace on

# View trace after test run
pnpm exec playwright show-trace trace.zip
```

### Viewing Test Results

```bash
# Open HTML report
pnpm exec playwright show-report

# View specific test report
pnpm exec playwright show-report playwright-report/index.html
```

## Troubleshooting

### Common Issues

**Tests timeout**
- Increase timeout in test: `test.setTimeout(30000)`
- Check if dev server is running on correct port
- Verify network connectivity

**Element not found**
- Use `waitForSelector` instead of immediate assertions
- Check if selector is correct
- Verify element is not hidden or behind other elements

**Flaky tests**
- Add retries in config or per test
- Use proper waits and expectations
- Check for race conditions

**Memory issues**
- Close pages after tests: `await page.close()`
- Use `page.context().close()` to clean up contexts
- Limit parallel workers in config

### Performance Optimization

- Use `test.describe.configure({ mode: 'parallel' })` for independent tests
- Group related tests in describe blocks
- Reuse page objects and utilities
- Avoid unnecessary waits and timeouts
- Use `test.skip()` for tests that shouldn't run in certain conditions

## Maintenance

### Regular Tasks

- **Update dependencies** - Keep Playwright and browsers updated
- **Review test failures** - Investigate and fix flaky tests
- **Update selectors** - Keep selectors in sync with UI changes
- **Add new tests** - Cover new features and user flows
- **Remove obsolete tests** - Clean up tests for deprecated features

### Test Metrics

Track these metrics to ensure test quality:
- Test execution time
- Flaky test rate
- Test coverage percentage
- Failure rate per test suite
- Browser-specific failures

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing Guide](https://playwright.dev/docs/accessibility-testing)
- [Performance Testing Guide](https://playwright.dev/docs/performance)

## Support

For issues or questions about the test suite:
1. Check the Playwright documentation
2. Review test logs and traces
3. Check GitHub Actions CI logs
4. Consult with the development team
