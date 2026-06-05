const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  // Set localStorage directly to bypass onboarding and set it to English
  await page.goto('https://jigyasu.ddnsgeek.com');
  await page.evaluate(() => {
    localStorage.setItem('learner-storage', JSON.stringify({
      state: {
        name: 'Amiya Test',
        avatar: '🚀',
        language: 'en',
        ageGroup: 'early'
      },
      version: 0
    }));
  });
  
  // Reload to see the Dashboard in English
  await page.reload();
  await page.waitForSelector('h1');
  
  // Click Global Language Selector to open dropdown
  // The button has aria-label="Select Language"
  await page.click('button[aria-label="Select Language"]');
  await new Promise(r => setTimeout(r, 500));
  
  // Click Hindi (it has code 'hi')
  // We can search for the button containing "Hindi" or "हिन्दी"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hiButton = buttons.find(b => b.textContent.includes('हिन्दी'));
    if (hiButton) hiButton.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("After clicking GlobalLanguageSelector Hindi:");
  console.log(text.substring(0, 500)); // Print just the top part
  
  await browser.close();
})();
