/**
 * Gen 13 Solar — Final Screenshots (post-remediation)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:4173';
const OUT = 'audit/evidence/screenshots/final';
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about.html' },
  { name: 'services', path: '/services.html' },
  { name: 'projects', path: '/projects.html' },
  { name: 'contact', path: '/contact.html' },
  { name: '404-test', path: '/nonexistent-page.html' },
];

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'mobile-390x844', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
let count = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const pg of PAGES) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
    const filename = `${pg.name}_${vp.name}.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
    count++;
    const status = errors.length ? ` (${errors.length} errors)` : '';
    console.log(`  [OK] ${pg.name} @ ${vp.name}${status}`);
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(`\nDone. ${count} final screenshots captured.`);
