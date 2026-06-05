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
  
  // Give it a moment to load activities
  await new Promise(r => setTimeout(r, 2000));
  
  // Find activity titles
  const activityTitles = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3')).map(h3 => h3.innerText);
    return titles;
  });
  
  console.log("Activity Titles:", activityTitles);
  
  await browser.close();
})();
