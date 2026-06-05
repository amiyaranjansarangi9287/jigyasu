const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  await page.goto('https://jigyasu.ddnsgeek.com');
  await page.evaluate(() => {
    localStorage.setItem('learner-storage', JSON.stringify({
      state: {
        name: 'Amiya Prod',
        avatar: '🚀',
        language: 'hi',
        ageGroup: 'early'
      },
      version: 0
    }));
  });
  
  // Go to KidsCamp directly
  await page.goto('https://jigyasu.ddnsgeek.com/execute');
  await page.waitForSelector('h1');
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 3000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000).replace(/\n/g, ' '));
  
  await browser.close();
})();
