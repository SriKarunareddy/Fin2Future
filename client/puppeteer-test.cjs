const puppeteer = require('puppeteer');
(async () => {
  let browser;
  try {
    const browser = await puppeteer.launch({args:['--no-sandbox', '--disable-gpu']});
    const page = await browser.newPage();
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      console.log('[PAGE LOG]', text);
    });
    page.on('pageerror', e => {
      const msg = 'PAGEERROR:' + (e.message || e);
      logs.push(msg);
      console.error('[PAGE ERROR]', msg);
    });
    page.on('requestfailed', req => console.error('[REQ FAILED]', req.url()));
    try {
      await page.goto('http://localhost:3001', {waitUntil:'networkidle2', timeout:30000});
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (navErr) {
      console.error('[NAV ERROR]', navErr.message);
    }
    console.log('\n=== FINAL LOGS ===');
    console.log(logs);
    await browser.close();
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
})();