const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', e => logs.push('PAGEERROR:' + e.message));
  try {
    await page.goto('http://localhost:3001', {waitUntil:'load', timeout:15000});
    await page.waitForTimeout(2000);
    console.log('Logs:', logs);
  } catch (err) {
    console.error('Navigation error', err);
  }
  await browser.close();
})();