const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsjo\\.gemini\\antigravity\\brain\\cc81612c-9753-4d94-8f22-657944497663';

async function runTest() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to a standard desktop size
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log('Navigating to http://localhost:3100 (Hub)...');
    await page.goto('http://localhost:3100', { waitUntil: 'networkidle0' });
    
    // Screenshot 1: Initial Landing / Onboarding
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screenshot-1-landing.png') });
    console.log('Saved screenshot-1-landing.png');

    // Simulate completing onboarding by setting localStorage
    console.log('Setting localStorage to bypass onboarding...');
    await page.evaluate(() => {
      // Assuming Jigyasu uses some state or localStorage for profiles
      // Let's set some standard values that might be used
      localStorage.setItem('jigyasu_profiles', JSON.stringify([{ id: '1', name: 'TestUser', age: 10, isAdult: false }]));
      localStorage.setItem('jigyasu_active_profile', '"1"');
      localStorage.setItem('jigyasu_onboarding_completed', 'true');
    });

    console.log('Reloading to see the main dashboard...');
    await page.goto('http://localhost:3100', { waitUntil: 'networkidle0' });
    
    // Screenshot 2: Main Dashboard
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screenshot-2-dashboard.png') });
    console.log('Saved screenshot-2-dashboard.png');

    // Let's try navigating to a specific module to see the new Tutorial Overlay!
    // We know the Physics module was set up with routing.
    console.log('Navigating to a learning module (e.g., /academy)...');
    await page.goto('http://localhost:3100/academy', { waitUntil: 'networkidle0' });
    
    // Screenshot 3: Academy / Module Tutorial
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screenshot-3-academy.png') });
    console.log('Saved screenshot-3-academy.png');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
    console.log('Done.');
  }
}

runTest();
