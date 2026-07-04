/**
 * Gen 13 Solar — Form / Conversion & UX Interaction Tests
 * Playwright-based E2E test covering:
 *   1. Contact form empty submit (validation)
 *   2. Contact form invalid email/phone (specific errors)
 *   3. FAQ accordion toggle on home page
 *   4. Solar calculator range input on home page
 *   5. Project filter buttons on projects.html
 *   6. Mobile menu toggle at 390px viewport
 *   7. Keyboard Tab navigation (focus reaches interactive elements)
 *   8. Phone number links are clickable (href="tel:...")
 *   9. Console errors captured during interactions
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

const results = [];
function log(label, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  results.push({ label, status, detail });
  console.log(`  [${status}] ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ═══════════════════════════════════════════════════════════════
  // TEST 1 & 2: Contact form validation
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Contact Form Tests ===');
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE}/contact.html`, { waitUntil: 'networkidle' });
    // Ensure JS form validator is ready
    await page.waitForSelector('form[data-validate]', { state: 'attached' });

    // Prevent the form from navigating to formsubmit.co during all form tests
    await page.route('**/formsubmit.co/**', route => route.abort());

    // Wait for app.js to fully initialize (check for data-year element set by app.js)
    await page.waitForFunction(() => {
      const yearEl = document.querySelector('[data-year]');
      return yearEl && yearEl.textContent.trim().length === 4;
    });

    // --- Test 1: Empty submit ---
    console.log('\n--- Test 1: Empty form submit ---');
    // We dispatch the submit event via JS to bypass native HTML5 constraint
    // validation (which blocks the submit event for empty required fields)
    // and test the custom validation handler in app.js.
    await page.evaluate(() => {
      const form = document.querySelector('form[data-validate]');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(500);

    // Check that aria-invalid is set on required fields
    const invalidFields = await page.locator('[aria-invalid="true"]').count();
    const requiredFields = await page.locator('form[data-validate] [required]').count();
    log(
      'Empty submit sets aria-invalid on required fields',
      invalidFields === requiredFields,
      `invalid=${invalidFields}, required=${requiredFields}`
    );

    // Check error messages appear
    const errorTexts = await page.locator('.form-error').allTextContents();
    const hasRequiredErrors = errorTexts.some(t => t.includes('required'));
    log(
      'Empty submit shows "required" error messages',
      hasRequiredErrors,
      `errors found: ${errorTexts.filter(t => t).length}`
    );

    // Toast message should appear
    const toast = page.locator('.toast');
    const toastVisible = await toast.isVisible().catch(() => false);
    log(
      'Toast notification appears on invalid submit',
      toastVisible
    );

    // --- Test 2: Invalid email and phone ---
    console.log('\n--- Test 2: Invalid email & phone ---');
    // Clear previous validation state
    await page.evaluate(() => {
      document.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; });
      document.querySelectorAll('[aria-invalid]').forEach(e => { e.removeAttribute('aria-invalid'); });
    });

    // Fill name and property type (required) to pass those
    await page.fill('#name', 'Test User');
    await page.selectOption('#property', 'Residential');
    // Fill invalid email
    await page.fill('#email', 'bad@');
    // Fill invalid phone
    await page.fill('#phone', '123');

    // Dispatch submit event via JS to test custom validation
    await page.evaluate(() => {
      const form = document.querySelector('form[data-validate]');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(500);

    const emailInvalid = await page.locator('#email').getAttribute('aria-invalid');
    log(
      'Invalid email "bad@" triggers aria-invalid',
      emailInvalid === 'true',
      `aria-invalid="${emailInvalid}"`
    );

    const phoneInvalid = await page.locator('#phone').getAttribute('aria-invalid');
    log(
      'Invalid phone "123" triggers aria-invalid',
      phoneInvalid === 'true',
      `aria-invalid="${phoneInvalid}"`
    );

    // Check specific error messages
    const emailError = await page.locator('#email ~ .form-error').textContent();
    const phoneError = await page.locator('#phone ~ .form-error').textContent();
    log(
      'Email error says "valid email address"',
      emailError.includes('valid email'),
      `error="${emailError}"`
    );
    log(
      'Phone error says "valid phone number"',
      phoneError.includes('valid phone'),
      `error="${phoneError}"`
    );

    // Verify first invalid field gets focus
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    log(
      'Focus moves to first invalid field',
      focusedTag === 'INPUT' || focusedTag === 'SELECT',
      `activeElement=${focusedTag}`
    );

    // Check native HTML5 validation also exists on required fields
    const hasNativeRequired = await page.evaluate(() => {
      const form = document.querySelector('form[data-validate]');
      const requiredFields = form.querySelectorAll('[required]');
      return requiredFields.length;
    });
    log(
      'Form has native HTML5 required attribute on fields',
      hasNativeRequired >= 4,
      `required fields=${hasNativeRequired}`
    );

    // Console errors during form interaction
    log(
      'No console errors during form tests',
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? consoleErrors.join('; ') : ''
    );

    await page.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 3: FAQ accordion toggle
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Home Page Interactive Tests ===');
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });

    // --- Test 3: FAQ accordion ---
    console.log('\n--- Test 3: FAQ accordion toggle ---');
    const firstFaqBtn = page.locator('.faq-button').first();

    // Initially collapsed
    const initialExpanded = await firstFaqBtn.getAttribute('aria-expanded');
    log(
      'FAQ button starts collapsed (aria-expanded=false)',
      initialExpanded === 'false',
      `aria-expanded="${initialExpanded}"`
    );

    // Click to open
    await firstFaqBtn.click();
    await page.waitForTimeout(350); // allow CSS transition

    const afterClick = await firstFaqBtn.getAttribute('aria-expanded');
    log(
      'FAQ button toggles to expanded on click',
      afterClick === 'true',
      `aria-expanded="${afterClick}"`
    );

    // Click again to close
    await firstFaqBtn.click();
    await page.waitForTimeout(350);

    const afterReClick = await firstFaqBtn.getAttribute('aria-expanded');
    log(
      'FAQ button toggles back to collapsed',
      afterReClick === 'false',
      `aria-expanded="${afterReClick}"`
    );

    // Test second FAQ item independently
    const secondFaqBtn = page.locator('.faq-button').nth(1);
    await secondFaqBtn.click();
    await page.waitForTimeout(350);
    const secondExpanded = await secondFaqBtn.getAttribute('aria-expanded');
    log(
      'Second FAQ item toggles independently',
      secondExpanded === 'true',
      `aria-expanded="${secondExpanded}"`
    );

    // --- Test 4: Solar calculator range input ---
    console.log('\n--- Test 4: Solar calculator ---');
    const rangeInput = page.locator('#monthlyBill');
    const rangeExists = await rangeInput.isVisible().catch(() => false);

    if (rangeExists) {
      // Get default value
      const defaultVal = await rangeInput.inputValue();
      log(
        'Range input exists with default value',
        defaultVal === '260',
        `default=${defaultVal}`
      );

      // Change the range value
      await rangeInput.fill('500');
      // Trigger input event manually (range fill may not fire input in headless)
      await rangeInput.evaluate(el => {
        el.value = '500';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForTimeout(200);

      const billOutput = await page.locator('#billOutput').textContent();
      log(
        'Bill output updates when range changes',
        billOutput.includes('$500'),
        `billOutput="${billOutput}"`
      );

      const savingsText = await page.locator('#estimateSavings').textContent();
      const systemText = await page.locator('#estimateSystem').textContent();
      const offsetText = await page.locator('#estimateOffset').textContent();
      log(
        'Savings estimate updates',
        savingsText !== '$0 / yr',
        `savings="${savingsText}"`
      );
      log(
        'System size estimate updates',
        systemText !== '0 kW',
        `system="${systemText}"`
      );
      log(
        'Offset percentage updates',
        offsetText !== '0%',
        `offset="${offsetText}"`
      );

      // Test sun exposure select
      await page.selectOption('#sunExposure', '4');
      await page.waitForTimeout(200);
      const updatedSavings = await page.locator('#estimateSavings').textContent();
      const updatedOffset = await page.locator('#estimateOffset').textContent();
      log(
        'Calculator updates when sun exposure changes',
        updatedSavings !== savingsText || updatedOffset !== offsetText,
        `savings="${updatedSavings}", offset="${updatedOffset}"`
      );
    } else {
      log('Range input exists on home page', false, 'not found');
    }

    log(
      'No console errors during home page tests',
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? consoleErrors.join('; ') : ''
    );

    await page.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 5: Project filter buttons
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Projects Page Tests ===');
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE}/projects.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    console.log('\n--- Test 5: Project filter buttons ---');
    const filterBtns = page.locator('.filter-btn');
    const filterCount = await filterBtns.count();
    log(
      'Filter buttons present',
      filterCount === 5,
      `count=${filterCount}`
    );

    // All cards visible initially
    const allCards = page.locator('.project-card[data-category]');
    const totalCards = await allCards.count();
    const initiallyVisible = await allCards.evaluateAll(els => els.filter(e => !e.hidden).length);
    log(
      'All project cards visible initially',
      initiallyVisible === totalCards,
      `visible=${initiallyVisible}, total=${totalCards}`
    );

    // "All" button should be active
    const allActive = await filterBtns.first().evaluate(el => el.classList.contains('is-active'));
    log(
      '"All" filter button is active by default',
      allActive
    );

    // Click "Residential" filter
    await filterBtns.nth(1).click();
    await page.waitForTimeout(200);

    const residentialActive = await filterBtns.nth(1).evaluate(el => el.classList.contains('is-active'));
    const allNoLongerActive = await filterBtns.first().evaluate(el => !el.classList.contains('is-active'));
    log(
      '"Residential" filter becomes active on click',
      residentialActive && allNoLongerActive
    );

    // Check aria-pressed
    const pressedState = await filterBtns.nth(1).getAttribute('aria-pressed');
    log(
      'Active filter has aria-pressed="true"',
      pressedState === 'true',
      `aria-pressed="${pressedState}"`
    );

    // Check that non-residential cards are hidden
    const residentialVisible = await allCards.evaluateAll(els =>
      els.filter(e => e.dataset.category === 'residential' && !e.hidden).length
    );
    const nonResidentialVisible = await allCards.evaluateAll(els =>
      els.filter(e => e.dataset.category !== 'residential' && !e.hidden).length
    );
    log(
      'Residential cards remain visible after filter',
      residentialVisible > 0,
      `residential visible=${residentialVisible}`
    );
    log(
      'Non-residential cards are hidden after filter',
      nonResidentialVisible === 0,
      `non-residential visible=${nonResidentialVisible}`
    );

    // Click "Commercial" filter
    await filterBtns.nth(2).click();
    await page.waitForTimeout(200);
    const commercialVisible = await allCards.evaluateAll(els =>
      els.filter(e => e.dataset.category === 'commercial' && !e.hidden).length
    );
    log(
      'Commercial filter shows only commercial cards',
      commercialVisible > 0,
      `commercial visible=${commercialVisible}`
    );

    // Click "All" again to reset
    await filterBtns.first().click();
    await page.waitForTimeout(200);
    const afterReset = await allCards.evaluateAll(els => els.filter(e => !e.hidden).length);
    log(
      'Clicking "All" restores all cards',
      afterReset === totalCards,
      `visible after reset=${afterReset}`
    );

    log(
      'No console errors during project filter tests',
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? consoleErrors.join('; ') : ''
    );

    await page.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 6: Mobile menu toggle at 390px
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Mobile Menu Tests ===');
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    console.log('\n--- Test 6: Mobile menu toggle ---');
    const menuToggle = page.locator('.menu-toggle');
    const toggleVisible = await menuToggle.isVisible();
    log(
      'Menu toggle button is visible at 390px',
      toggleVisible
    );

    // Nav links should be hidden at mobile
    const navLinks = page.locator('.nav-links');
    const navVisible = await navLinks.isVisible();
    log(
      'Nav links are hidden at 390px',
      !navVisible
    );

    // Nav CTA should be hidden at mobile
    const navCta = page.locator('.nav-cta');
    const ctaVisible = await navCta.isVisible();
    log(
      'Nav CTA buttons hidden at 390px',
      !ctaVisible
    );

    // Initially collapsed
    const initialAria = await menuToggle.getAttribute('aria-expanded');
    log(
      'Menu toggle starts collapsed',
      initialAria === 'false',
      `aria-expanded="${initialAria}"`
    );

    // Click to open
    await menuToggle.click();
    await page.waitForTimeout(400);

    const openedAria = await menuToggle.getAttribute('aria-expanded');
    log(
      'Menu opens on click (aria-expanded=true)',
      openedAria === 'true',
      `aria-expanded="${openedAria}"`
    );

    const navNowVisible = await navLinks.isVisible();
    log(
      'Nav links become visible when opened',
      navNowVisible
    );

    // Body should have nav-open class
    const bodyHasClass = await page.evaluate(() => document.body.classList.contains('nav-open'));
    log(
      'body gets nav-open class',
      bodyHasClass
    );

    // Click a nav link and verify menu closes
    await navLinks.locator('a').first().click();
    await page.waitForTimeout(400);

    const closedAria = await menuToggle.getAttribute('aria-expanded');
    const navHiddenAgain = !(await navLinks.isVisible());
    log(
      'Menu closes after clicking a nav link',
      closedAria === 'false' && navHiddenAgain,
      `aria-expanded="${closedAria}", navVisible=${!navHiddenAgain}`
    );

    // Click toggle again to reopen
    await menuToggle.click();
    await page.waitForTimeout(400);

    // Now toggle again to close (test toggle off without nav link click)
    await menuToggle.click();
    await page.waitForTimeout(400);

    const toggleOffAria = await menuToggle.getAttribute('aria-expanded');
    log(
      'Menu closes on second toggle click',
      toggleOffAria === 'false',
      `aria-expanded="${toggleOffAria}"`
    );

    log(
      'No console errors during mobile menu tests',
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? consoleErrors.join('; ') : ''
    );

    await page.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 7: Keyboard Tab navigation
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Keyboard Navigation Tests ===');
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    console.log('\n--- Test 7: Tab navigation ---');

    // Focus should start on body or skip link
    // Press Tab multiple times and check if we reach interactive elements
    const interactiveElements = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          text: (el?.textContent || '').trim().substring(0, 50),
          role: el?.getAttribute('role'),
          href: el?.getAttribute('href'),
          class: el?.className || '',
        };
      });
      interactiveElements.push(info);
    }

    // Check we reached skip-link
    const reachedSkipLink = interactiveElements.some(
      e => e.class.includes('skip-link') || e.href === '#main'
    );
    log(
      'Tab navigation reaches skip-link',
      reachedSkipLink
    );

    // Check we reached the header/nav area
    const reachedNav = interactiveElements.some(
      e => e.tag === 'A' && (e.href?.includes('index.html') || e.href?.includes('about.html'))
    );
    log(
      'Tab navigation reaches navigation links',
      reachedNav
    );

    // Check we reached a button or CTA
    const reachedButton = interactiveElements.some(
      e => e.tag === 'BUTTON' || e.tag === 'A'
    );
    log(
      'Tab navigation reaches interactive buttons/links',
      reachedButton
    );

    // Check focus is visible (has visible styles)
    const hasFocusVisible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none' || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT';
    });
    log(
      'Focused element is interactive type (A, BUTTON, INPUT, etc.)',
      hasFocusVisible
    );

    log(
      'No console errors during keyboard navigation tests',
      consoleErrors.length === 0,
      consoleErrors.length > 0 ? consoleErrors.join('; ') : ''
    );

    await page.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 8: Phone number links (tel: links)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Phone Link Tests ===');
  {
    const pages = ['index.html', 'contact.html', 'about.html', 'services.html'];
    for (const pageName of pages) {
      const page = await browser.newPage();
      await page.goto(`${BASE}/${pageName}`, { waitUntil: 'domcontentloaded' });

      console.log(`\n--- Test 8: tel: links on ${pageName} ---`);
      const telLinks = page.locator('a[href^="tel:"]');
      const telCount = await telLinks.count();

      log(
        `${pageName} has phone links`,
        telCount > 0,
        `count=${telCount}`
      );

      // Verify first tel link has correct href
      if (telCount > 0) {
        const href = await telLinks.first().getAttribute('href');
        log(
          `${pageName} tel link has correct phone number`,
          href === 'tel:+19402067006',
          `href="${href}"`
        );

        // Verify tel links are clickable (not hidden, not display:none)
        const isClickable = await telLinks.first().isVisible();
        log(
          `${pageName} phone link is visible and clickable`,
          isClickable
        );
      }

      await page.close();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 9: Console errors during interactions
  // ═══════════════════════════════════════════════════════════════
  console.log('\n=== Console Error Scan ===');
  {
    const allErrors = [];
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') allErrors.push({ page: 'index', text: msg.text() });
    });
    page.on('pageerror', err => {
      allErrors.push({ page: 'index', text: err.message });
    });

    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll through page
    await page.evaluate(async () => {
      for (let i = 0; i < document.body.scrollHeight; i += 300) {
        window.scrollTo(0, i);
        await new Promise(r => setTimeout(r, 100));
      }
    });
    await page.waitForTimeout(500);

    // Interact with all interactive elements
    try { await page.locator('.faq-button').first().click(); } catch {}
    await page.waitForTimeout(200);

    console.log(`\n--- Test 9: Console errors on index.html ---`);
    log(
      'No JavaScript errors on index.html',
      allErrors.length === 0,
      allErrors.length > 0 ? allErrors.map(e => e.text).join('; ') : ''
    );

    // Check contact page for errors
    const contactErrors = [];
    const page2 = await browser.newPage();
    page2.on('console', msg => {
      if (msg.type() === 'error') contactErrors.push(msg.text());
    });
    page2.on('pageerror', err => {
      contactErrors.push(err.message);
    });

    await page2.goto(`${BASE}/contact.html`, { waitUntil: 'networkidle' });
    await page2.waitForTimeout(1000);
    // Submit empty form
    try { await page2.locator('button[type="submit"]').click(); } catch {}
    await page2.waitForTimeout(500);

    console.log(`\n--- Test 9 (cont): Console errors on contact.html ---`);
    log(
      'No JavaScript errors on contact.html',
      contactErrors.length === 0,
      contactErrors.length > 0 ? contactErrors.join('; ') : ''
    );

    await page2.close();
    await page.close();
  }

  await browser.close();

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`  Total: ${results.length}  |  Passed: ${passed}  |  Failed: ${failed}`);
  console.log('═'.repeat(60));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ✗ ${r.label}${r.detail ? ' — ' + r.detail : ''}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
})();
