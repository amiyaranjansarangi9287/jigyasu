const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://jigyasu-main.vercel.app/');
  await page.waitForSelector('select#profile-language');
  const text = await page.$eval('h2', el => el.innerText);
  console.log('Heading text before select:', text);
  await page.select('select#profile-language', 'od');
  await new Promise(r => setTimeout(r, 1000));
  const text2 = await page.$eval('h2', el => el.innerText);
  console.log('Heading text after select:', text2);
  
  // also dump the DOM of the h2
  const html = await page.$eval('h2', el => el.outerHTML);
  console.log('HTML of h2:', html);
  
  await browser.close();
})();
