/**
 * Gen 13 Solar — Baseline Screenshot & Console Capture
 * Runs Playwright against localhost:4173, captures screenshots at multiple
 * viewports, logs console errors and network failures.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:4173';
const OUT = 'audit/evidence/screenshots/baseline';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about.html' },
  { name: 'services', path: '/services.html' },
  { name: 'projects', path: '/projects.html' },
  { name: 'contact', path: '/contact.html' },
  { name: 'thank-you', path: '/thank-you.html' },
  { name: 'privacy', path: '/privacy.html' },
  { name: 'terms', path: '/terms.html' },
  { name: '404-test', path: '/nonexistent-page.html' },
];

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-360x800', width: 360, height: 800 },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    userAgent: `Gen13Audit/${vp.name}`,
  });

  for (const pg of PAGES) {
    const page = await context.newPage();
    const consoleMessages = [];
    const networkErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push({ type: 'error', text: msg.text() });
      }
    });

    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });

    const url = `${BASE}${pg.path}`;
    let status = 'OK';
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      status = response?.status() || 'NO_RESPONSE';
      if (status >= 400) status = `${status}`;
    } catch (err) {
      status = `ERROR: ${err.message.slice(0, 80)}`;
    }

    await page.waitForTimeout(500); // let animations settle

    const filename = `${pg.name}_${vp.name}.png`;
    await page.screenshot({
      path: path.join(OUT, filename),
      fullPage: true,
    });

    results.push({
      page: pg.name,
      viewport: `${vp.width}x${vp.height}`,
      status,
      consoleErrors: consoleMessages,
      failedRequests,
    });

    console.log(`  [${status}] ${pg.name} @ ${vp.name}`);
    await page.close();
  }
  await context.close();
}

await browser.close();

// Write summary
const summaryPath = 'audit/evidence/screenshots/baseline/_summary.json';
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
console.log(`\nDone. ${results.length} screenshots captured.`);
console.log(`Summary: ${summaryPath}`);

// Report console errors
const errorsOnly = results.filter(r => r.consoleErrors.length > 0 || r.failedRequests.length > 0);
if (errorsOnly.length > 0) {
  console.log('\n--- Console/Network Issues ---');
  for (const r of errorsOnly) {
    console.log(`\n${r.page} @ ${r.viewport} (HTTP ${r.status}):`);
    for (const c of r.consoleErrors) console.log(`  CONSOLE ERROR: ${c.text}`);
    for (const f of r.failedRequests) console.log(`  FAILED REQUEST: ${f.url} (${f.failure})`);
  }
} else {
  console.log('\nNo console errors or failed requests detected.');
}
