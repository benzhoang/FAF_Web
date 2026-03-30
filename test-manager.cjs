const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || text.includes('403') || text.toLowerCase().includes('forbidden')) {
      console.log('BROWSER CONSOLE [ERROR]:', text);
      errors.push(text);
    }
  });
  page.on('response', resp => {
    if (resp.status() >= 400 && resp.status() !== 404) {
      const msg = `HTTP ${resp.status()} - ${resp.request().method()} ${resp.url()}`;
      console.log(msg);
      errors.push(msg);
    }
  });

  try {
    console.log('=== Navigating to signin...');
    await page.goto('http://localhost:5173/signin', { timeout: 15000 });
    await page.fill('input[placeholder="node@protocol.xyz"]', 'manager@yopmail.com');
    await page.fill('input[placeholder="••••••••••••"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('Current URL after login:', page.url());

    const tests = [
      { name: 'Public Profile', url: 'http://localhost:5173/profile/35' },
      { name: 'Settings', url: 'http://localhost:5173/settings' },
      { name: 'Wallet', url: 'http://localhost:5173/wallet' },
      { name: 'Notifications', url: 'http://localhost:5173/notifications' },
    ];

    for (const t of tests) {
      console.log(`\n=== Testing ${t.name} (${t.url})...`);
      await page.goto(t.url, { timeout: 15000 });
      await page.waitForTimeout(1500);
      const currentUrl = page.url();
      const isForbidden = currentUrl.includes('/forbidden');
      console.log(`Result: ${currentUrl} ${isForbidden ? '❌ FORBIDDEN!' : '✅ OK'}`);
      if (isForbidden) {
        errors.push(`${t.name} redirected to /forbidden`);
      }
    }

    console.log('\n=== SUMMARY ===');
    if (errors.length === 0) {
      console.log('✅ All tests passed - No 403 or forbidden errors!');
    } else {
      console.log('❌ Errors found:');
      errors.forEach(e => console.log(' -', e));
    }
  } finally {
    await browser.close();
  }
})();
