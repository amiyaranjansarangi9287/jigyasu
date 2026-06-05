const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  // Go to the production domain
  await page.goto('https://jigyasu.ddnsgeek.com');
  
  // Wait for the modal or header
  await page.waitForSelector('h2');
  
  // Change language to Hindi
  await page.select('select#profile-language', 'hi');
  
  // Fill form
  await page.type('#profile-nickname', 'Amiya Prod');
  await page.click('#parent-consent-checkbox');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Wait for KidsCamp page to load
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text);
  
  await browser.close();
})();
