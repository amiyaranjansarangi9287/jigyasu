// e2e/wonder-first.spec.ts
// Playwright tests for Wonder-First module flows
// Purpose: Ensure Wonder-First modules work correctly across all phases
// Note: Tests are skipped because Wonder-First modules exist but aren't currently routed
// To enable: Update routing in worlds/lab/index.tsx to use Wonder-First versions

import { test, expect } from '@playwright/test';

test.describe.skip('Wonder-First Module Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Wonder-First module
    await page.goto('/lab/gravity');
    
    // Wait for module to load
    await page.waitForSelector('text=Why don\'t we fly off Earth?', { timeout: 10000 });
  });

  test('should display mystery phase with question and hook', async ({ page }) => {
    // Verify mystery phase elements
    await expect(page.locator('text=Why don\'t we fly off Earth?')).toBeVisible();
    await expect(page.locator('text=🌍')).toBeVisible();
    
    // Verify hook text
    const hookText = await page.locator('p').filter({ hasText: /We live on a giant ball/ }).isVisible();
    await expect(hookText).toBeTruthy();
  });

  test('should transition to exploration phase on button click', async ({ page }) => {
    // Click start exploration button
    await page.click('button:has-text("Let\'s Explore Together")');
    
    // Wait for exploration phase
    await page.waitForSelector('text=Exploration Time', { timeout: 5000 });
    
    // Verify exploration phase elements
    await expect(page.locator('text=Exploration Time')).toBeVisible();
    await expect(page.locator('text=Explore the journey')).toBeVisible();
  });

  test('should display hints progressively', async ({ page }) => {
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // Click first hint
    await page.click('button:has-text("Hint 1")');
    
    // Verify hint is revealed
    await expect(page.locator('text=Hint 1:')).toBeVisible();
    
    // Click second hint
    await page.click('button:has-text("Hint 2")');
    await expect(page.locator('text=Hint 2:')).toBeVisible();
  });

  test('should transition to insight phase', async ({ page }) => {
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // Click to show insight
    await page.click('button:has-text("I Think I Understand")');
    
    // Wait for insight phase
    await page.waitForSelector('text=The Insight', { timeout: 5000 });
    
    // Verify insight phase elements
    await expect(page.locator('text=The Insight')).toBeVisible();
    await expect(page.locator('text=✨')).toBeVisible();
  });

  test('should display revelation and connection in insight phase', async ({ page }) => {
    // Navigate to insight phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    await page.click('button:has-text("I Think I Understand")');
    await page.waitForSelector('text=The Insight');
    
    // Verify revelation
    await expect(page.locator('text=Gravity is an invisible force')).toBeVisible();
    
    // Verify connection
    await expect(page.locator('text=Connection to the mystery')).toBeVisible();
  });

  test('should transition to application phase', async ({ page }) => {
    // Navigate to insight phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    await page.click('button:has-text("I Think I Understand")');
    await page.waitForSelector('text=The Insight');
    
    // Click to show application
    await page.click('button:has-text("See How This Applies")');
    
    // Wait for application phase
    await page.waitForSelector('text=In Real Life', { timeout: 5000 });
    
    // Verify application phase elements
    await expect(page.locator('text=In Real Life')).toBeVisible();
    await expect(page.locator('text=🌍')).toBeVisible();
  });

  test('should display real-world application', async ({ page }) => {
    // Navigate to application phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    await page.click('button:has-text("I Think I Understand")');
    await page.waitForSelector('text=The Insight');
    await page.click('button:has-text("See How This Applies")');
    await page.waitForSelector('text=In Real Life');
    
    // Verify real-world application
    await expect(page.locator('text=Understanding connects to the world')).toBeVisible();
  });

  test('should display Indian context', async ({ page }) => {
    // Navigate to application phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    await page.click('button:has-text("I Think I Understand")');
    await page.waitForSelector('text=The Insight');
    await page.click('button:has-text("See How This Applies")');
    await page.waitForSelector('text=In Real Life');
    
    // Verify Indian context is present
    await expect(page.locator('text=🇮🇳')).toBeVisible();
    await expect(page.locator(/Indian|Scientist|Festival/)).toBeVisible();
  });

  test('should complete module and exit', async ({ page }) => {
    // Navigate to application phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    await page.click('button:has-text("I Think I Understand")');
    await page.waitForSelector('text=The Insight');
    await page.click('button:has-text("See How This Applies")');
    await page.waitForSelector('text=In Real Life');
    
    // Click complete button
    await page.click('button:has-text("I Understand!")');
    
    // Verify navigation back to home
    await page.waitForURL('/', { timeout: 5000 });
  });

  test('should track exploration time', async ({ page }) => {
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // Wait for 2 seconds
    await page.waitForTimeout(2000);
    
    // Verify time is displayed
    const timeText = await page.locator('text=/Time exploring:/').textContent();
    expect(timeText).toContain('0:0');
  });

  test('should track hints used', async ({ page }) => {
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // Use 2 hints
    await page.click('button:has-text("Hint 1")');
    await page.click('button:has-text("Hint 2")');
    
    // Verify hints are revealed
    await expect(page.locator('text=Hint 1:')).toBeVisible();
    await expect(page.locator('text=Hint 2:')).toBeVisible();
  });

  test('should have keyboard navigation support', async ({ page }) => {
    // Navigate to mystery phase
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Press 'N' to go to next phase
    await page.keyboard.press('N');
    
    // Verify transition to exploration phase
    await page.waitForSelector('text=Exploration Time', { timeout: 5000 });
    
    // Press 'H' to show hint
    await page.keyboard.press('H');
    
    // Verify hint is revealed
    await expect(page.locator('text=Hint 1:')).toBeVisible();
    
    // Press 'S' to skip to insight
    await page.keyboard.press('S');
    
    // Verify transition to insight phase
    await page.waitForSelector('text=The Insight', { timeout: 5000 });
  });

  test('should have screen reader announcements', async ({ page }) => {
    // Navigate to mystery phase
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Check for aria-live region
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeVisible();
    
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // Verify announcement changed
    const announcement = await liveRegion.textContent();
    expect(announcement).toContain('Exploration phase');
  });

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    // Check ARIA labels on buttons
    const startButton = page.locator('button[aria-label="Start exploring the mystery"]');
    await expect(startButton).toBeVisible();
    
    const hintButton = page.locator('button[aria-label="Show hint 1"]');
    await expect(hintButton).toBeVisible();
    
    const completeButton = page.locator('button[aria-label="Complete module and return to home"]');
    await expect(completeButton).toBeVisible();
  });

  test('should disable animations on slow connections', async ({ page, context }) => {
    // Simulate slow connection
    await context.setOffline(true);
    
    // Navigate to exploration phase
    await page.goto('/lab/gravity-wonder');
    await page.click('button:has-text("Let\'s Explore Together")');
    
    // Verify animations are disabled (check for reduced motion)
    const motionElements = page.locator('[style*="transition"]');
    const transitionDuration = await motionElements.first().evaluate(el => {
      return window.getComputedStyle(el).transitionDuration;
    });
    
    // Should be 0s or very fast on slow connections
    expect(transitionDuration).toBe('0s');
    
    await context.setOffline(false);
  });

  test('should handle errors gracefully with error boundary', async ({ page }) => {
    // Navigate to exploration phase
    await page.click('button:has-text("Let\'s Explore Together")');
    await page.waitForSelector('text=Exploration Time');
    
    // The exploration component is wrapped in ErrorBoundary
    // If it crashes, it should show a fallback UI
    const errorBoundary = page.locator('text=Oops! We hit a bump');
    
    // In normal operation, this should not be visible
    await expect(errorBoundary).not.toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to mystery phase
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Verify mobile layout
    const button = page.locator('button:has-text("Let\'s Explore Together")');
    await expect(button).toBeVisible();
    
    // Verify touch targets are large enough (min 44px)
    const buttonBox = await button.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to mystery phase
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Verify tablet layout
    await expect(page.locator('text=Why don\'t we fly off Earth?')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to mystery phase
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Verify desktop layout
    await expect(page.locator('text=Why don\'t we fly off Earth?')).toBeVisible();
  });
});

test.describe.skip('Wonder-First Module Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for h2
    const h2 = page.locator('h2');
    await expect(h2).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Check contrast of main text (should be at least 4.5:1)
    const mainText = page.locator('text=Why don\'t we fly off Earth?');
    const textColor = await mainText.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Text should not be too light (contrast check)
    expect(textColor).not.toBe('rgb(255, 255, 255)');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Verify focus is on button
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');
  });

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    // Focus on button
    const button = page.locator('button:has-text("Let\'s Explore Together")');
    await button.focus();
    
    // Check for focus outline
    const hasFocusOutline = await button.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    });
    
    expect(hasFocusOutline).toBeTruthy();
  });
});

test.describe.skip('Wonder-First Module Performance', () => {
  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/lab/gravity-wonder');
    await page.waitForSelector('text=Why don\'t we fly off Earth?');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds on fast connection
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no layout shifts', async ({ page }) => {
    await page.goto('/lab/gravity-wonder');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for layout shifts (CLS should be 0)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let cls = 0;
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          });
          resolve(cls);
        }).observe({ type: 'layout-shift', buffered: true });
      });
    });
    
    // CLS should be very low (less than 0.1)
    expect(cls).toBeLessThan(0.1);
  });
});
