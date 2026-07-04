/**
 * Gen 13 Solar — Accessibility Audit via axe-core + Playwright
 * Scans all 9 HTML pages and reports violations by severity.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

const BASE = 'http://localhost:4173';
const OUT_AXI = 'audit/evidence/axe';
fs.mkdirSync(OUT_AXI, { recursive: true });

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about.html' },
  { name: 'services', path: '/services.html' },
  { name: 'projects', path: '/projects.html' },
  { name: 'contact', path: '/contact.html' },
  { name: 'thank-you', path: '/thank-you.html' },
  { name: 'privacy', path: '/privacy.html' },
  { name: 'terms', path: '/terms.html' },
  { name: '404', path: '/nonexistent-page.html' },
];

const browser = await chromium.launch({ headless: true });
const allResults = [];
const summary = [];

for (const pg of PAGES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let status = 200;
  try {
    const resp = await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    status = resp?.status() || 0;
  } catch (e) {
    status = 0;
  }

  let axeResults = null;
  if (status < 400) {
    try {
      axeResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
    } catch (e) {
      axeResults = { error: e.message };
    }
  }

  const violations = axeResults?.violations || [];
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of violations) {
    if (v.impact in counts) counts[v.impact]++;
  }

  summary.push({ page: pg.name, status, ...counts, total: violations.length });

  // Save detailed results
  const detail = {
    page: pg.name,
    url: `${BASE}${pg.path}`,
    httpStatus: status,
    violationCount: violations.length,
    counts,
    violations: violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 3).map(n => n.target[0]),
    })),
    passes: axeResults?.passes?.length || 0,
    incomplete: axeResults?.incomplete?.length || 0,
  };
  fs.writeFileSync(`${OUT_AXI}/${pg.name}.json`, JSON.stringify(detail, null, 2));

  allResults.push(detail);
  console.log(`  ${pg.name}: ${violations.length} violations (${counts.critical} critical, ${counts.serious} serious, ${counts.moderate} moderate, ${counts.minor} minor)`);

  await page.close();
  await context.close();
}

await browser.close();

// Summary
console.log('\n=== Accessibility Summary ===');
console.table(summary);

// Save combined results
fs.writeFileSync(`${OUT_AXI}/_combined.json`, JSON.stringify({ summary, details: allResults }, null, 2));
console.log(`\nResults saved to ${OUT_AXI}/`);
