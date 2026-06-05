const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://jigyasu-main.vercel.app/');
  await page.waitForSelector('select#profile-language');
  await page.select('select#profile-language', 'od');
  await new Promise(r => setTimeout(r, 1000));
  const text = await page.$eval('h2', el => el.innerText);
  console.log('Heading text:', text);
  await browser.close();
})();
