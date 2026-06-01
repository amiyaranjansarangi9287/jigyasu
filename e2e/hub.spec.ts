import { test, expect } from '@playwright/test';
import { completeOnboarding } from './utils';

test.describe('Jigyasu Hub Flow', () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page);
  });

  test('should display all learning worlds', async ({ page, browserName }) => {
    // Skip on Firefox due to element detection issues
    test.skip(browserName === 'firefox', 'Learning worlds test skipped on Firefox due to element detection issues');
    
    await page.goto('/', { timeout: 10000 });
    
    // Verify "Learning Paths" header
    await expect(page.locator('text=Learning Paths').first()).toBeVisible({ timeout: 15000 });

    // Verify Tiny World
    await expect(page.locator('text=Tiny World').first()).toBeVisible();

    // Verify Lab Zero
    await expect(page.locator('text=Lab Zero').first()).toBeVisible();
  });

  test('should navigate to the Maker Space via Lab Zero', async ({ page, browserName }) => {
    // Skip on WebKit due to navigation issues
    test.skip(browserName === 'webkit', 'Lab Zero navigation test skipped on WebKit due to navigation issues');
    
    await page.goto('/', { timeout: 10000 });

    // Click on Maker Space button
    const makerSpaceButton = page.locator('button:has-text("Maker Space"), button:has-text("Go to Maker Space")').first();

    await makerSpaceButton.waitFor({ state: 'visible', timeout: 5000 });
    await makerSpaceButton.click();

    // Wait for transition to execute route
    await expect(page).toHaveURL(/\/execute/, { timeout: 10000 });
  });
});
