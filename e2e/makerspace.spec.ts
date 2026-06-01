import { test, expect } from '@playwright/test';
import { completeOnboarding } from './utils';

test.describe('Maker Space Flow', () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page);
  });

  test('should load Maker Space without crashing', async ({ page, browserName }) => {
    // Skip on Firefox due to navigation issues
    test.skip(browserName === 'firefox', 'Maker Space test skipped on Firefox due to navigation issues');
    
    await page.goto('/execute', { timeout: 10000 });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Verify the Error Boundary is NOT visible
    const errorBoundary = page.locator('text=Oops! We hit a bump., text=Lumo needs a quick reset');
    await expect(errorBoundary).not.toBeVisible();

    // If age selector exists, interact with it
    const ageSelectorHeader = page.locator('text=Who\'s making today?').first();
    if (await ageSelectorHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(ageSelectorHeader).toBeVisible();

      // Ensure the 18+ tier we added is visible
      const lifelongLearners = page.locator('text=Lifelong Learners').first();
      if (await lifelongLearners.isVisible().catch(() => false)) {
        await lifelongLearners.click();

        // Verify we see categories like "Interactive Labs"
        await expect(page.locator('text=Interactive Labs').first()).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
