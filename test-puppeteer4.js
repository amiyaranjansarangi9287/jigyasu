const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:4173/');
  await page.waitForSelector('select#profile-language');
  
  const result = await page.evaluate(async () => {
    // i18next might be exposed on window? No.
    // Let's trigger the change event and see what happens.
    const select = document.querySelector('select#profile-language');
    select.value = 'od';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    
    await new Promise(r => setTimeout(r, 1000));
    return {
      h2: document.querySelectorAll('h2')[2].innerText,
      htmlLang: document.documentElement.lang,
      localLang: localStorage.getItem('i18nextLng')
    };
  });
  
  console.log('Result:', result);
  await browser.close();
})();
