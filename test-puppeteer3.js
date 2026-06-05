const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://jigyasu-main.vercel.app/');
  await page.waitForSelector('select#profile-language');
  await page.select('select#profile-language', 'od');
  await new Promise(r => setTimeout(r, 1000));
  const h2s = await page.$$eval('h2', els => els.map(el => el.innerText));
  console.log('H2s:', h2s);
  
  const labels = await page.$$eval('label', els => els.map(el => el.innerText));
  console.log('Labels:', labels);
  
  await browser.close();
})();
