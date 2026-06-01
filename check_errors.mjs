import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[Page Error] ${error.message}`);
  });

  try {
    await page.goto('https://jigyasu.vercel.app', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.log(`[Navigation Error] ${e.message}`);
  }
  
  await browser.close();
})();
