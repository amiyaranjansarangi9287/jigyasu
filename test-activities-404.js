const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404 URL:', response.url());
    }
  });
  
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
