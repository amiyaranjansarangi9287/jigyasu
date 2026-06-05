import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright tests for Jigyasu...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = 'https://jigyasu-sishu.vercel.app';
  const logs = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    logs.push(`[Page Error] ${error.message}`);
  });

  try {
    console.log(`Navigating to ${url}...`);
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    console.log(`Page loaded with status: ${response.status()}`);

    // Wait for the main elements to load
    await page.waitForTimeout(2000);
    
    // Check if the Onboarding Wizard is visible (Welcome to Jigyasu!)
    const isWelcomeVisible = await page.isVisible('text=Welcome to Jigyasu!');
    console.log(`Welcome Modal Visible: ${isWelcomeVisible}`);

    if (isWelcomeVisible) {
      console.log('Testing Onboarding Flow...');
      await page.fill('input[type="text"]', 'Playwright Tester');
      // Select 13-17 age group
      await page.selectOption('select#profile-age', '13-17');
      // Check the consent checkbox (if it exists for this age group)
      const consentExists = await page.isVisible('input[type="checkbox"]');
      if (consentExists) {
        await page.check('input[type="checkbox"]');
      }
      
      // Click Let's Go
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('Onboarding Complete!');
    }

    // Now check for the Landing Page elements
    console.log('Checking Landing Page features...');
    const makerSpaceVisible = await page.isVisible('text=Maker Space');
    const kidsCampVisible = await page.isVisible('text=KidsCamp');
    
    console.log(`Maker Space card visible: ${makerSpaceVisible}`);
    console.log(`KidsCamp card visible: ${kidsCampVisible}`);

    if (kidsCampVisible) {
      console.log('Navigating to KidsCamp...');
      // Find the Explore KidsCamp button
      await page.click('text=Explore KidsCamp');
      await page.waitForTimeout(3000);
      
      // Check if we are in kidscamp
      const urlMatches = page.url().includes('kidscamp');
      console.log(`Successfully routed to KidsCamp: ${urlMatches}`);
      
      // Go back
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    if (makerSpaceVisible) {
      console.log('Navigating to Maker Space...');
      await page.click('text=Enter Maker Space');
      await page.waitForTimeout(3000);
      
      const inMakerSpace = page.url().includes('execute') || page.url().includes('learn');
      console.log(`Successfully routed to Maker Space / Learn: ${inMakerSpace}`);
    }

    console.log('\n--- Test Summary ---');
    console.log('No blocking UI errors encountered during navigation.');
    if (logs.length > 0) {
      console.log('Console Errors found:');
      logs.forEach(l => console.log(l));
    } else {
      console.log('Zero console errors detected!');
    }

  } catch (err) {
    console.error('Test script failed:', err);
  } finally {
    await browser.close();
  }
})();
