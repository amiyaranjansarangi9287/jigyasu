import { chromium } from '@playwright/test';

(async () => {
  console.log("Launching browser to catch error...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: "${msg.text()}"`);
    }
  });
  
  page.on('pageerror', exception => {
    console.log(`UNCAUGHT EXCEPTION: "${exception}"`);
  });

  await page.goto('http://localhost:8090/execute');
  await page.waitForTimeout(3000);

  // If the error boundary is on screen, there might be a "Technical details" button.
  try {
    const details = await page.$('text=Technical details');
    if (details) {
      await details.click();
      await page.waitForTimeout(500);
      const pre = await page.$('pre');
      if (pre) {
         const text = await pre.innerText();
         console.log("ERROR BOUNDARY DETAILS:\n", text);
      }
    }
  } catch(e) {}

  await browser.close();
  console.log("Done catching errors.");
})();
