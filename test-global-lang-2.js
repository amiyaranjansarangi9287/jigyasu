const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  await page.goto('https://jigyasu.ddnsgeek.com');
  await page.waitForSelector('h2'); // onboarding
  
  // Do onboarding in English
  await page.select('select#profile-language', 'en');
  await page.type('#profile-nickname', 'Amiya');
  await page.click('#parent-consent-checkbox');
  await page.click('button[type="submit"]');
  
  // Wait for KidsCamp page
  await new Promise(r => setTimeout(r, 2000));
  
  // Verify it's English
  let text = await page.evaluate(() => document.body.innerText);
  console.log("INITIAL:", text.substring(0, 100).replace(/\n/g, ' '));
  
  // Click Global Language Selector to open dropdown
  await page.click('button[aria-label="Select Language"]');
  await new Promise(r => setTimeout(r, 500));
  
  // Click Hindi (it has code 'hi')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hiButton = buttons.find(b => b.textContent.includes('हिन्दी'));
    if (hiButton) hiButton.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  text = await page.evaluate(() => document.body.innerText);
  console.log("AFTER SWITCH:", text.substring(0, 100).replace(/\n/g, ' '));
  
  await browser.close();
})();
