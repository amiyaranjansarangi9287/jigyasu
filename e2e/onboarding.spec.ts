import { test, expect } from '@playwright/test';
import { completeOnboarding } from './utils';

test.describe('Onboarding Flow', () => {
  test('should display welcome modal and allow profile creation', async ({ page }) => {
    await completeOnboarding(page);
    
    // Check that profile name appears somewhere (e.g. settings or greeting)
    // The profile is usually in the nav or dashboard
    await page.goto('/parents');
    await expect(page.locator('text=TestUser').first()).toBeVisible();
  });
});
