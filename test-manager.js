const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`HTTP ${resp.status()} - ${resp.request().method()} ${resp.url()}`);
    }
  });

  console.log('Navigating to signin...');
  await page.goto('http://localhost:5173/signin');
  
  await page.fill('input[placeholder="Enter your email"]', 'manager@yopmail.com');
  await page.fill('input[placeholder="Enter your password"]', '123456');
  await page.click('button[type="submit"]');

  console.log('Waiting for URL to change from signin...');
  await page.waitForTimeout(2000); // Wait for auth state to populate
  
  console.log('Current URL after login:', page.url());

  console.log('Navigating to /profile/2...');
  
  await page.goto('http://localhost:5173/profile/2');
  
  await page.waitForTimeout(2000);
  
  console.log('Final URL:', page.url());

  await browser.close();
})();
