// Demo visual smoke — real browser verification for Gen 13 Solar client demo.
// Renders Home/Services/Projects/About/Contact at 390/768/1440px, captures
// console errors, horizontal overflow, broken images, placeholder text,
// mobile-menu state and screenshots. Screenshots go to gitignored audit/evidence/demo-smoke/.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const shotDir = join(root, 'audit', 'evidence', 'demo-smoke');
await mkdir(shotDir, { recursive: true });

const BASE = 'http://localhost:4173';
const pages = [
  { key: 'home', url: '/' },
  { key: 'services', url: '/services.html' },
  { key: 'projects', url: '/projects.html' },
  { key: 'about', url: '/about.html' },
  { key: 'contact', url: '/contact.html' },
];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const PLACEHOLDER_RE = /lorem\s*ipsum|coming soon|untitled|sample text|^button$|click here|test content|demo content|placeholder\b/i;

const browser = await chromium.launch();
const results = [];
let criticalIssues = 0;

for (const page of pages) {
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const tab = await context.newPage();
    const consoleErrors = [];
    tab.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    tab.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

    const entry = { page: page.key, viewport: vp.name, url: page.url, consoleErrors, overflow: 0, brokenImages: [], placeholders: [], footer: false, contactForm: false, mobileMenu: null };

    try {
      await tab.goto(BASE + page.url, { waitUntil: 'networkidle', timeout: 20000 });
      await tab.waitForTimeout(400);

      const metrics = await tab.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - window.innerWidth;
        const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
        const text = document.body.innerText || '';
        const footer = !!document.querySelector('.site-footer');
        const form = !!document.querySelector('form[data-validate]');
        return { overflow, imgs, text, footer, form };
      });
      entry.overflow = metrics.overflow;
      entry.brokenImages = metrics.imgs;
      entry.footer = metrics.footer;
      entry.contactForm = metrics.form;

      const ph = (metrics.text.match(PLACEHOLDER_RE) || []);
      entry.placeholders = [...new Set(ph.map((s) => s.trim()))];

      if (metrics.overflow > 1) criticalIssues++;
      if (metrics.imgs.length) criticalIssues++;
      if (entry.placeholders.length) criticalIssues++;
      if (!metrics.footer) criticalIssues++;

      // Mobile menu interaction at mobile viewport
      if (vp.name === 'mobile') {
        const toggle = await tab.$('.menu-toggle');
        if (toggle) {
          await toggle.click();
          await tab.waitForTimeout(300);
          const state = await tab.evaluate(() => {
            const t = document.querySelector('.menu-toggle');
            const nav = document.querySelector('.nav-links');
            return { ariaExpanded: t?.getAttribute('aria-expanded'), navOpen: nav?.classList.contains('is-open') };
          });
          entry.mobileMenu = state;
        }
      }

      const shotName = `${page.key}-${vp.name}.png`;
      await tab.screenshot({ path: join(shotDir, shotName), fullPage: false });
      entry.screenshot = `audit/evidence/demo-smoke/${shotName}`;
    } catch (err) {
      entry.error = String(err.message || err);
      criticalIssues++;
    }
    await context.close();
    results.push(entry);
    console.log(`[${page.key} @ ${vp.name}] overflow=${entry.overflow} brokenImgs=${entry.brokenImages.length} placeholders=${entry.placeholders.length} consoleErr=${consoleErrors.length} footer=${entry.footer} contactForm=${entry.contactForm}`);
  }
}

await browser.close();
const summary = { generatedAt: new Date().toISOString(), base: BASE, criticalIssues, results };
await writeFile(join(shotDir, 'demo-smoke.json'), JSON.stringify(summary, null, 2));
console.log(`\nCRITICAL_ISSUES=${criticalIssues}`);
process.exit(criticalIssues > 0 ? 2 : 0);
