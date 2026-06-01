import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:3000/');
  await page.goto('http://127.0.0.1:3000/');
  
  await page.waitForTimeout(3000);
  
  console.log('Page content length:', (await page.content()).length);
  
  const heading = await page.locator('h2').allInnerTexts();
  console.log('H2 Headings found:', heading);
  
  const h1 = await page.locator('h1').allInnerTexts();
  console.log('H1 Headings found:', h1);
  
  const bodyText = await page.locator('body').innerText();
  console.log('Body Text Snippet:', bodyText.substring(0, 200).replace(/\n/g, ' '));
  
  await browser.close();
})();
