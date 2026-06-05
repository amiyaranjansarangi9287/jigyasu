const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
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
  
  await page.goto('https://jigyasu.ddnsgeek.com/execute');
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
