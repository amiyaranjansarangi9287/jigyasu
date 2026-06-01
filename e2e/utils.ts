import { Page, expect } from '@playwright/test';

export async function completeOnboarding(page: Page) {
  await page.goto('/');
  
  // Wait for the modal or the main UI
  const modal = page.locator('text=Welcome to Jigyasu!');
  
  try {
    // Check if we even need to onboard (might be cached in context)
    await modal.waitFor({ state: 'visible', timeout: 5000 });
  } catch (e) {
    // If not visible, we're likely already onboarded
    return;
  }

  // Handle parental gate first if present
  const parentalGate = page.locator('text=What is 56 + 0?');
  try {
    await parentalGate.waitFor({ state: 'visible', timeout: 2000 });
    await page.getByRole('textbox').fill('56');
    await page.getByRole('button', { name: 'Verify' }).click();
    await page.waitForTimeout(500);
  } catch (e) {
    // No parental gate, proceed with onboarding
  }

  // Fill in profile details
  await page.fill('input[placeholder="e.g. Explorer"]', 'TestUser');
  
  // Select language and age group
  // Assuming there are two selects, the first is language, second is age group
  const selects = page.locator('select');
  await selects.nth(0).selectOption({ label: 'English' });
  await selects.nth(1).selectOption({ index: 1 }); // Select the first actual age tier
  
  // Click an avatar (the first button in the avatar group)
  // We can look for buttons inside a specific div or just click the first button that looks like an avatar.
  // A safer approach: click the first button containing an emoji or within the avatar selection area.
  // The avatar container usually has text "Choose your avatar" before it.
  const avatarButton = page.locator('text=Choose your avatar').locator('..').locator('button').first();
  await avatarButton.click({ force: true });
  
  // Check the parent permission checkbox natively so React state updates
  await page.locator('input[type="checkbox"]').check({ force: true });
  
  // Wait for React to re-render and enable the button
  await page.waitForTimeout(200);
  
  // Click Let's Go using DOM click to bypass viewport constraints
  await page.locator('button:has-text("Let\'s Go!")').evaluate(b => (b as HTMLButtonElement).click());
  
  // Wait for completion
  await expect(modal).toBeHidden();
  // Wait for Hub to appear by checking for the main header
  await expect(page.locator('text=Learning Paths').first()).toBeVisible({ timeout: 10000 });
}
