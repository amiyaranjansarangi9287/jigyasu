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
  
  await page.reload();
  await page.waitForSelector('h1');
  
  // Click "Go to KidsCamp" or "Go to Maker Space"
  // Link has href="/execute"
  await page.click('a[href="/execute"]');
  
  // Wait for KidsCamp to load
  await page.waitForSelector('h3', { timeout: 10000 });
  
  // Find activity titles
  const activityTitles = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3')).map(h3 => h3.innerText);
    return titles;
  });
  
  console.log("Activity Titles:", activityTitles.slice(0, 5));
  
  await browser.close();
})();
