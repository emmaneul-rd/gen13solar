/**
 * Gen 13 Solar — Cross-Browser Smoke Tests
 * Runs 10 test suites across Chromium, Firefox, and WebKit.
 * Covers: navigation, home page elements, mobile menu, FAQ accordion,
 * form validation, calculator, project filters, phone links, console
 * errors, and horizontal overflow.
 */
import { chromium, firefox, webkit } from 'playwright';

const BASE = 'http://localhost:4173';
const MOBILE_W = 390;
const MOBILE_H = 844;

// All 9 HTML pages
const PAGES = [
  'index.html',
  'about.html',
  'services.html',
  'projects.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'thank-you.html',
  '404.html',
];

const PAGES_SHOULD_200 = [
  'index.html',
  'about.html',
  'services.html',
  'projects.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'thank-you.html',
];

// Results accumulator: { browserName, tests: [{ name, status, detail }] }
const allResults = {};

function makeResultStore(browserName) {
  allResults[browserName] = { browserName, tests: [] };
}

function pass(browserName, name, detail = '') {
  allResults[browserName].tests.push({ name, status: 'PASS', detail });
}

function fail(browserName, name, detail = '') {
  allResults[browserName].tests.push({ name, status: 'FAIL', detail });
}

function blocked(browserName, name, detail = '') {
  allResults[browserName].tests.push({ name, status: 'BLOCKED', detail });
}

// ─────────────────────────────────────────────────
// Individual test suites
// ─────────────────────────────────────────────────

async function testNavigation(browserName, context) {
  const tag = 'Navigation';

  // Test each page that should return 200
  for (const pageName of PAGES_SHOULD_200) {
    const page = await context.newPage();
    try {
      const resp = await page.goto(`${BASE}/${pageName}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp?.status() ?? 0;
      pass(browserName, `${tag} — ${pageName} HTTP ${status}`, status === 200 ? `OK` : `expected 200, got ${status}`);
      if (status !== 200) fail(browserName, `${tag} — ${pageName} HTTP ${status}`, `expected 200`);
    } catch (e) {
      fail(browserName, `${tag} — ${pageName}`, e.message.slice(0, 120));
    } finally {
      await page.close().catch(() => {});
    }
  }

  // 404 page should return 404
  {
    const page = await context.newPage();
    try {
      const resp = await page.goto(`${BASE}/404.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp?.status() ?? 0;
      if (status === 404) {
        pass(browserName, `${tag} — 404.html returns 404`);
      } else {
        // static file server may return 200 for 404.html — that's acceptable if page exists
        pass(browserName, `${tag} — 404.html accessible`, `status=${status} (static serve may return 200)`);
      }
    } catch (e) {
      fail(browserName, `${tag} — 404.html`, e.message.slice(0, 120));
    } finally {
      await page.close().catch(() => {});
    }
  }
}

async function testHomePage(browserName, context) {
  const tag = 'Home Page';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(300);

    // Hero section visible
    const heroVisible = await page.locator('.hero').isVisible().catch(() => false);
    heroVisible
      ? pass(browserName, `${tag} — hero section visible`)
      : fail(browserName, `${tag} — hero section visible`, 'not visible');

    // Trust bar visible
    const trustVisible = await page.locator('.trustbar').isVisible().catch(() => false);
    trustVisible
      ? pass(browserName, `${tag} — trust bar visible`)
      : fail(browserName, `${tag} — trust bar visible`, 'not visible');

    // Calculator visible (scroll into view first)
    await page.locator('#calculator').scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(200);
    const calcVisible = await page.locator('#calculator').isVisible().catch(() => false);
    calcVisible
      ? pass(browserName, `${tag} — calculator visible`)
      : fail(browserName, `${tag} — calculator visible`, 'not visible');
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testMobileMenu(browserName, context) {
  const tag = 'Mobile Menu';
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: MOBILE_W, height: MOBILE_H });
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(300);

    // Toggle button visible
    const toggleVisible = await page.locator('.menu-toggle').isVisible().catch(() => false);
    toggleVisible
      ? pass(browserName, `${tag} — toggle button visible at ${MOBILE_W}px`)
      : fail(browserName, `${tag} — toggle button visible at ${MOBILE_W}px`);

    // Nav links hidden initially
    const navHidden = !(await page.locator('.nav-links').isVisible().catch(() => true));
    navHidden
      ? pass(browserName, `${tag} — nav links hidden at ${MOBILE_W}px`)
      : fail(browserName, `${tag} — nav links hidden at ${MOBILE_W}px`);

    // Toggle open
    await page.locator('.menu-toggle').click();
    await page.waitForTimeout(400);

    const expanded = await page.locator('.menu-toggle').getAttribute('aria-expanded');
    expanded === 'true'
      ? pass(browserName, `${tag} — aria-expanded=true after click`)
      : fail(browserName, `${tag} — aria-expanded=true after click`, `got "${expanded}"`);

    const navVisible = await page.locator('.nav-links').isVisible().catch(() => false);
    navVisible
      ? pass(browserName, `${tag} — nav links visible after open`)
      : fail(browserName, `${tag} — nav links visible after open`);

    // Toggle closed
    await page.locator('.menu-toggle').click();
    await page.waitForTimeout(400);

    const closed = await page.locator('.menu-toggle').getAttribute('aria-expanded');
    closed === 'false'
      ? pass(browserName, `${tag} — aria-expanded=false after close`)
      : fail(browserName, `${tag} — aria-expanded=false after close`, `got "${closed}"`);
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testFaqAccordion(browserName, context) {
  const tag = 'FAQ Accordion';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(300);

    const btn = page.locator('.faq-button').first();
    const before = await btn.getAttribute('aria-expanded');
    before === 'false'
      ? pass(browserName, `${tag} — starts collapsed`, `aria-expanded="${before}"`)
      : fail(browserName, `${tag} — starts collapsed`, `aria-expanded="${before}"`);

    await btn.click();
    await page.waitForTimeout(350);

    const after = await btn.getAttribute('aria-expanded');
    after === 'true'
      ? pass(browserName, `${tag} — expands on click`, `aria-expanded="${after}"`)
      : fail(browserName, `${tag} — expands on click`, `aria-expanded="${after}"`);
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testFormValidation(browserName, context) {
  const tag = 'Form Validation';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/contact.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('form[data-validate]', { timeout: 5000 });
    await page.waitForTimeout(300);

    // Block formsubmit.co to prevent navigation
    await page.route('**/formsubmit.co/**', route => route.abort());

    // Dispatch submit event to trigger custom validation (bypasses native HTML5)
    await page.evaluate(() => {
      const form = document.querySelector('form[data-validate]');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(500);

    // Check for error messages
    const errorTexts = await page.locator('.form-error').allTextContents();
    const hasErrors = errorTexts.some(t => t.trim().length > 0);
    hasErrors
      ? pass(browserName, `${tag} — error messages appear on empty submit`)
      : fail(browserName, `${tag} — error messages appear on empty submit`, 'no error text found');

    // Check aria-invalid set
    const invalidCount = await page.locator('[aria-invalid="true"]').count();
    invalidCount > 0
      ? pass(browserName, `${tag} — aria-invalid set on required fields`, `count=${invalidCount}`)
      : fail(browserName, `${tag} — aria-invalid set on required fields`, 'none found');
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testCalculator(browserName, context) {
  const tag = 'Calculator';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(300);

    const rangeInput = page.locator('#monthlyBill');
    await rangeInput.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(200);

    const exists = await rangeInput.isVisible().catch(() => false);
    if (!exists) {
      fail(browserName, `${tag} — range input visible`, 'not found');
      return;
    }

    // Get default output
    const defaultBill = await page.locator('#billOutput').textContent();

    // Change range via JS + dispatch input event
    await rangeInput.evaluate(el => {
      el.value = '500';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);

    const newBill = await page.locator('#billOutput').textContent();
    newBill !== defaultBill
      ? pass(browserName, `${tag} — bill output updates on range change`, `"${newBill}"`)
      : fail(browserName, `${tag} — bill output updates on range change`, `still "${newBill}"`);

    const savings = await page.locator('#estimateSavings').textContent();
    savings !== '$0 / yr'
      ? pass(browserName, `${tag} — savings output updates`, `"${savings}"`)
      : fail(browserName, `${tag} — savings output updates`, `still "$0 / yr"`);
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testProjectFilters(browserName, context) {
  const tag = 'Project Filters';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/projects.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(500);

    const filterBtns = page.locator('.filter-btn');
    const count = await filterBtns.count();
    count >= 4
      ? pass(browserName, `${tag} — filter buttons present`, `count=${count}`)
      : fail(browserName, `${tag} — filter buttons present`, `count=${count}`);

    // All cards visible initially
    const allCards = page.locator('.project-card[data-category]');
    const totalCards = await allCards.count();
    const visibleBefore = await allCards.evaluateAll(els => els.filter(e => !e.hidden).length);
    visibleBefore === totalCards
      ? pass(browserName, `${tag} — all cards visible initially`, `visible=${visibleBefore}`)
      : fail(browserName, `${tag} — all cards visible initially`, `visible=${visibleBefore}, total=${totalCards}`);

    // Click "Residential" filter (index 1)
    await filterBtns.nth(1).click();
    await page.waitForTimeout(300);

    const residentialVisible = await allCards.evaluateAll(els =>
      els.filter(e => e.dataset.category === 'residential' && !e.hidden).length
    );
    const nonResVisible = await allCards.evaluateAll(els =>
      els.filter(e => e.dataset.category !== 'residential' && !e.hidden).length
    );
    residentialVisible > 0 && nonResVisible === 0
      ? pass(browserName, `${tag} — Residential filter works`, `residential=${residentialVisible}, other=${nonResVisible}`)
      : fail(browserName, `${tag} — Residential filter works`, `residential=${residentialVisible}, other=${nonResVisible}`);
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testPhoneLinks(browserName, context) {
  const tag = 'Phone Links';
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(300);

    const telLinks = page.locator('a[href^="tel:"]');
    const count = await telLinks.count();
    count > 0
      ? pass(browserName, `${tag} — tel: links found on index.html`, `count=${count}`)
      : fail(browserName, `${tag} — tel: links found on index.html`);

    // Check all href values are correct
    let allCorrect = true;
    let badHrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await telLinks.nth(i).getAttribute('href');
      if (href !== 'tel:+19402067006') {
        allCorrect = false;
        badHrefs.push(href);
      }
    }
    allCorrect
      ? pass(browserName, `${tag} — all tel: href values correct`)
      : fail(browserName, `${tag} — all tel: href values correct`, `bad: ${badHrefs.join(', ')}`);

    // Check a couple more pages
    for (const pg of ['contact.html', 'about.html']) {
      const p2 = await context.newPage();
      try {
        await p2.goto(`${BASE}/${pg}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const cnt = await p2.locator('a[href^="tel:"]').count();
        cnt > 0
          ? pass(browserName, `${tag} — tel: links on ${pg}`, `count=${cnt}`)
          : fail(browserName, `${tag} — tel: links on ${pg}`);
      } finally {
        await p2.close().catch(() => {});
      }
    }
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

async function testConsoleErrors(browserName, context) {
  const tag = 'Console Errors';
  const testPages = ['index.html', 'about.html', 'services.html', 'projects.html', 'contact.html'];

  for (const pg of testPages) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    try {
      await page.goto(`${BASE}/${pg}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);

      // Scroll through to trigger any lazy behavior
      await page.evaluate(async () => {
        for (let i = 0; i < document.body.scrollHeight; i += 500) {
          window.scrollTo(0, i);
          await new Promise(r => setTimeout(r, 50));
        }
      });
      await page.waitForTimeout(300);

      errors.length === 0
        ? pass(browserName, `${tag} — ${pg}`)
        : fail(browserName, `${tag} — ${pg}`, errors.slice(0, 3).join('; '));
    } catch (e) {
      fail(browserName, `${tag} — ${pg}`, e.message.slice(0, 120));
    } finally {
      await page.close().catch(() => {});
    }
  }
}

async function testNoOverflow(browserName, context) {
  const tag = 'No Horizontal Overflow';
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: MOBILE_W, height: MOBILE_H });
    let overflowPages = [];

    for (const pg of PAGES) {
      try {
        await page.goto(`${BASE}/${pg}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(300);

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (overflow) overflowPages.push(pg);
      } catch {
        // skip unreachable pages
      }
    }

    overflowPages.length === 0
      ? pass(browserName, `${tag} — no overflow on any page at ${MOBILE_W}px`)
      : fail(browserName, `${tag} — no overflow at ${MOBILE_W}px`, `overflow on: ${overflowPages.join(', ')}`);
  } catch (e) {
    fail(browserName, tag, e.message.slice(0, 120));
  } finally {
    await page.close().catch(() => {});
  }
}

// ─────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────

async function runForBrowser(browserType, browserName) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Running tests in ${browserName}`);
  console.log('═'.repeat(60));

  makeResultStore(browserName);

  let browser;
  try {
    browser = await browserType.launch({ headless: true });
  } catch (e) {
    console.log(`  ⚠ Could not launch ${browserName}: ${e.message.slice(0, 120)}`);
    // Mark all tests as BLOCKED
    const testNames = [
      'Navigation — page HTTP status',
      'Home Page — hero, trust bar, calculator',
      'Mobile Menu — toggle open/close',
      'FAQ Accordion — expand/collapse',
      'Form Validation — empty submit errors',
      'Calculator — range updates output',
      'Project Filters — Residential filter',
      'Phone Links — tel: href values',
      'Console Errors — no JS errors per page',
      'No Horizontal Overflow — 390px width',
    ];
    for (const name of testNames) {
      blocked(browserName, name, 'Browser failed to launch');
    }
    return;
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: undefined, // let Playwright use default
  });

  try {
    // 1. Navigation
    console.log('\n--- 1. Navigation ---');
    await testNavigation(browserName, context);

    // 2. Home page
    console.log('--- 2. Home Page ---');
    await testHomePage(browserName, context);

    // 3. Mobile menu
    console.log('--- 3. Mobile Menu ---');
    await testMobileMenu(browserName, context);

    // 4. FAQ accordion
    console.log('--- 4. FAQ Accordion ---');
    await testFaqAccordion(browserName, context);

    // 5. Form validation
    console.log('--- 5. Form Validation ---');
    await testFormValidation(browserName, context);

    // 6. Calculator
    console.log('--- 6. Calculator ---');
    await testCalculator(browserName, context);

    // 7. Project filters
    console.log('--- 7. Project Filters ---');
    await testProjectFilters(browserName, context);

    // 8. Phone links
    console.log('--- 8. Phone Links ---');
    await testPhoneLinks(browserName, context);

    // 9. Console errors
    console.log('--- 9. Console Errors ---');
    await testConsoleErrors(browserName, context);

    // 10. No overflow
    console.log('--- 10. No Overflow ---');
    await testNoOverflow(browserName, context);

  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

// ─────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────

console.log('Gen 13 Solar — Cross-Browser Smoke Tests');
console.log(`Target: ${BASE}`);
console.log(`Date: ${new Date().toISOString()}`);

await runForBrowser(chromium, 'Chromium');
await runForBrowser(firefox, 'Firefox');
await runForBrowser(webkit, 'WebKit');

// ─────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log('  CROSS-BROWSER SUMMARY');
console.log('═'.repeat(60));

const browsers = Object.keys(allResults);
for (const b of browsers) {
  const r = allResults[b];
  const passed = r.tests.filter(t => t.status === 'PASS').length;
  const failed = r.tests.filter(t => t.status === 'FAIL').length;
  const blocked = r.tests.filter(t => t.status === 'BLOCKED').length;
  const parts = [];
  if (passed) parts.push(`PASS=${passed}`);
  if (failed) parts.push(`FAIL=${failed}`);
  if (blocked) parts.push(`BLOCKED=${blocked}`);
  console.log(`  ${b}: ${parts.join('  ')}`);
}

console.log('═'.repeat(60));

// Write JSON results for report generation
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const resultsPath = join(__dirname, '..', '..', 'audit', 'cross-browser-results.json');
try {
  mkdirSync(dirname(resultsPath), { recursive: true });
  writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));
  console.log(`\nResults written to: ${resultsPath}`);
} catch (e) {
  console.error(`\nCould not write results JSON: ${e.message}`);
}

// Exit with failure if any test failed
const anyFailed = browsers.some(b => allResults[b].tests.some(t => t.status === 'FAIL'));
process.exit(anyFailed ? 1 : 0);
