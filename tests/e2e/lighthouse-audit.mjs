/**
 * Gen 13 Solar — Lighthouse Audit
 * Uses ChromeLauncher from lighthouse to run audits against localhost:4173
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const BASE = 'http://localhost:4173';
const OUT = 'audit/evidence/lighthouse';
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services.html' },
  { name: 'projects', path: '/projects.html' },
  { name: 'contact', path: '/contact.html' },
  { name: 'about', path: '/about.html' },
];

const allResults = [];

// Desktop audits
for (const pg of PAGES) {
  console.log(`\n[Lighthouse Desktop] ${pg.name}...`);

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    });

    const url = `${BASE}${pg.path}`;
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: { disabled: true },
    });

    const cats = result.lhr.categories;
    const audits = result.lhr.audits;

    const scores = {
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
    };

    const metrics = {
      FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
      LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
      TBT: audits['total-blocking-time']?.displayValue || 'N/A',
      CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      SI: audits['speed-index']?.displayValue || 'N/A',
    };

    allResults.push({ page: pg.name, formFactor: 'desktop', scores, metrics });

    fs.writeFileSync(`${OUT}/${pg.name}-desktop.json`, JSON.stringify(result.lhr, null, 2));

    console.log(`  Performance: ${scores.performance} | Accessibility: ${scores.accessibility} | Best Practices: ${scores.bestPractices} | SEO: ${scores.seo}`);
    console.log(`  FCP: ${metrics.FCP} | LCP: ${metrics.LCP} | TBT: ${metrics.TBT} | CLS: ${metrics.CLS}`);
  } catch (e) {
    console.error(`  ERROR: ${e.message.slice(0, 120)}`);
    allResults.push({ page: pg.name, formFactor: 'desktop', error: e.message.slice(0, 200) });
  } finally {
    if (chrome) await chrome.kill();
  }
}

// Mobile audits (Home + Contact)
for (const pg of [PAGES[0], PAGES[3]]) {
  console.log(`\n[Lighthouse Mobile] ${pg.name}...`);

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    });

    const url = `${BASE}${pg.path}`;
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2, disabled: false },
    });

    const cats = result.lhr.categories;
    const audits = result.lhr.audits;

    const scores = {
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
    };

    const metrics = {
      FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
      LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
      TBT: audits['total-blocking-time']?.displayValue || 'N/A',
      CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      SI: audits['speed-index']?.displayValue || 'N/A',
    };

    allResults.push({ page: pg.name, formFactor: 'mobile', scores, metrics });

    fs.writeFileSync(`${OUT}/${pg.name}-mobile.json`, JSON.stringify(result.lhr, null, 2));

    console.log(`  Performance: ${scores.performance} | Accessibility: ${scores.accessibility} | Best Practices: ${scores.bestPractices} | SEO: ${scores.seo}`);
    console.log(`  FCP: ${metrics.FCP} | LCP: ${metrics.LCP} | TBT: ${metrics.TBT} | CLS: ${metrics.CLS}`);
  } catch (e) {
    console.error(`  ERROR: ${e.message.slice(0, 120)}`);
    allResults.push({ page: pg.name, formFactor: 'mobile', error: e.message.slice(0, 200) });
  } finally {
    if (chrome) await chrome.kill();
  }
}

// Save summary
fs.writeFileSync(`${OUT}/_summary.json`, JSON.stringify(allResults, null, 2));

console.log('\n=== Lighthouse Summary ===');
for (const r of allResults) {
  if (r.error) {
    console.log(`  ${r.page} (${r.formFactor}): ERROR - ${r.error.slice(0, 80)}`);
  } else {
    console.log(`  ${r.page} (${r.formFactor}): P=${r.scores.performance} A=${r.scores.accessibility} BP=${r.scores.bestPractices} SEO=${r.scores.seo} | LCP=${r.metrics.LCP} CLS=${r.metrics.CLS}`);
  }
}
