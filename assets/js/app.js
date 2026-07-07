(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const navLinks = $('.nav-collapse');

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', !isOpen ? 'Close menu' : 'Open menu');
      navLinks.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });
    $$('a', navLinks).forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('is-open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-label', 'Open menu');
      menuToggle.focus();
    }
  });

  $$('.faq-button').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  const monthlyBill = $('#monthlyBill');
  const sunExposure = $('#sunExposure');
  const billOutput = $('#billOutput');
  const estimateSavings = $('#estimateSavings');
  const estimateSystem = $('#estimateSystem');
  const estimateOffset = $('#estimateOffset');

  const formatUSD = value => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(value);

  const updateCalculator = () => {
    if (!monthlyBill || !sunExposure) return;
    const bill = Number(monthlyBill.value || 0);
    const sun = Number(sunExposure.value || 1);
    const annualSpend = bill * 12;
    const offset = Math.min(95, Math.round(64 + (sun * 7)));
    const annualSavings = annualSpend * (offset / 100) * 0.84;
    const systemSize = Math.max(3.5, (bill / 21.5) * (1 + (4 - sun) * 0.07));

    billOutput.textContent = `${formatUSD(bill)} / month`;
    estimateSavings.textContent = `${formatUSD(annualSavings)} / yr`;
    estimateSystem.textContent = `${systemSize.toFixed(1)} kW`;
    estimateOffset.textContent = `${offset}%`;
  };

  monthlyBill?.addEventListener('input', updateCalculator);
  sunExposure?.addEventListener('input', updateCalculator);
  updateCalculator();

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const filters = $$('.filter-btn');
  const projectCards = $$('.project-card[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => item.classList.toggle('is-active', item === button));
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    projectCards.forEach(card => {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
    });
  }));

  const toast = message => {
    let element = $('.toast');
    if (!element) {
      element = document.createElement('div');
      element.className = 'toast';
      element.setAttribute('role', 'status');
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add('is-visible');
    window.clearTimeout(window.__gen13ToastTimer);
    window.__gen13ToastTimer = window.setTimeout(() => element.classList.remove('is-visible'), 3500);
  };

  $$('form[data-validate]').forEach(form => {
    form.addEventListener('submit', event => {
      let valid = true;
      $$('[required]', form).forEach(field => {
        const group = field.closest('.form-group');
        const error = $('.form-error', group || form);
        const empty = !String(field.value || '').trim();
        const invalidEmail = field.type === 'email' && field.value && !/^\S+@\S+\.\S+$/.test(field.value);
        const invalidPhone = field.type === 'tel' && field.value && field.value.replace(/\D/g, '').length < 10;
        const invalid = empty || invalidEmail || invalidPhone;
        field.setAttribute('aria-invalid', String(invalid));
        if (error) {
          error.textContent = empty ? 'This field is required.' : invalidEmail ? 'Enter a valid email address.' : invalidPhone ? 'Enter a valid phone number.' : '';
        }
        if (invalid) valid = false;
      });
      if (!valid) {
        event.preventDefault();
        const firstInvalid = $('[aria-invalid="true"]', form);
        firstInvalid?.focus();
        toast('Please review the highlighted fields.');
      } else {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
      }
    });
  });

  const year = new Date().getFullYear();
  $$('[data-year]').forEach(node => { node.textContent = String(year); });
})();
