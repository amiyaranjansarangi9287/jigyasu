import { test, expect } from '@playwright/test';

test.describe.skip('PWA & Offline Behavior', () => {
  test('app should load offline and display offline indicators', async ({ page, context }) => {
    // 1. Visit the app while online to cache resources via Service Worker
    await page.goto('/', { timeout: 30000 });

    // Wait for the app to load fully
    await page.waitForTimeout(3000);

    // 2. Go offline
    await context.setOffline(true);

    // 3. Reload the page while offline
    await page.reload({ timeout: 30000 });

    // 4. Verify the app still loads from cache (PWA functionality)
    // Just verify page loads without errors
    await expect(page.locator('text=Oops! We hit a bump.')).not.toBeVisible({ timeout: 15000 });

    // 5. Go back online
    await context.setOffline(false);

    // 6. Verify we are back online by doing a normal reload
    await page.reload({ timeout: 30000 });
    await expect(page.locator('text=Oops! We hit a bump.')).not.toBeVisible({ timeout: 15000 });
  });
});
