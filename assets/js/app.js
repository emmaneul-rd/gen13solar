(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---- Brand intro animation ---- */
  const brandIntro = $('#brandIntro');
  if (brandIntro && !sessionStorage.getItem('gen13BrandIntroSeen')) {
    const duration = 1300;
    setTimeout(() => {
      brandIntro.classList.add('is-hidden');
      brandIntro.addEventListener('transitionend', () => {
        brandIntro.remove();
        sessionStorage.setItem('gen13BrandIntroSeen', 'true');
      }, { once: true });
    }, duration);
  }

  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const navLinks = $('.nav-collapse');

  const scrollProgress = $('.scroll-progress');
  if (!scrollProgress && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const el = document.createElement('div');
    el.className = 'scroll-progress';
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-hidden', 'true');
    document.body.prepend(el);
    let ticking = false;
    const updateProgress = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%';
      ticking = false;
    };
    updateProgress();
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
  }

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* ---- Hero staggered entrance ---- */
  const heroContent = $('.hero__content');
  const heroVisual = $('.hero__visual');
  if (heroContent && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => {
      heroContent.classList.add('is-animated');
      if (heroVisual) heroVisual.classList.add('is-animated');
    });
  } else if (heroContent) {
    heroContent.classList.add('is-animated');
    if (heroVisual) heroVisual.classList.add('is-animated');
  }

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

  /* ---- Reveal system: fail-open (content visible by default) ---- */
  const revealItems = $$('.reveal, .reveal-group, .reveal-left, .reveal-right, .reveal-scale, .founder-text-reveal, .capabilities-grid, [data-reveal]');

  const revealEverything = () => {
    revealItems.forEach(item => item.classList.add('is-visible'));
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window) || revealItems.length === 0) {
    revealEverything();
  } else {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px 80px 0px'
      });

      revealItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const alreadyNearViewport =
          rect.top <= window.innerHeight + 80 &&
          rect.bottom >= -80;

        if (alreadyNearViewport) {
          item.classList.add('is-visible');
        } else {
          observer.observe(item);
        }
      });

      document.documentElement.classList.add('motion-ready');

      /* Safety net: reveal everything after 1.8s no matter what */
      window.setTimeout(() => {
        revealEverything();
      }, 1800);
    } catch (error) {
      console.error('Reveal system failed:', error);
      document.documentElement.classList.remove('motion-ready');
      revealEverything();
    }
  }

  /* ---- Founder photo subtle parallax (desktop only) ---- */
  const founderPhoto = $('.founder-photo');
  if (founderPhoto && !reducedMotion && window.innerWidth > 768) {
    let ticking = false;
    const updateParallax = () => {
      const rect = founderPhoto.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 14;
        founderPhoto.style.transform = `translateY(${offset}px) scale(1.03)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
  }

  const filters = $$('.filter-btn');
  const projectCards = $$('.project-card[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => item.classList.toggle('is-active', item === button));
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    projectCards.forEach(card => {
      const visible = category === 'all' || card.dataset.category === category;
      if (!visible) {
        card.style.opacity = '0';
        card.style.transform = 'scale(.96)';
        setTimeout(() => { card.hidden = true; }, 200);
      } else {
        card.hidden = false;
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      }
    });
  }));
  /* Ensure visible cards have transition set */
  projectCards.forEach(card => {
    card.style.transition = 'opacity .25s ease, transform .25s ease';
  });

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

  /* ---- WhatsApp ---- */
  const WHATSAPP_NUMBER = "19402067006";
  const WHATSAPP_MSG_EN = "Hello Gen 13 Solar, I would like a free solar energy analysis.";
  const WHATSAPP_MSG_ES = "Hola Gen 13 Solar, me gustaría solicitar un análisis gratuito de energía solar.";

  function getWhatsAppLink() {
    const lang = document.documentElement.lang || 'en';
    const msg = lang === 'es' ? WHATSAPP_MSG_ES : WHATSAPP_MSG_EN;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  $$('[data-whatsapp]').forEach(btn => {
    btn.href = getWhatsAppLink();
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.style.cursor = 'pointer';
  });

  document.addEventListener('gen13:langChanged', () => {
    $$('[data-whatsapp]').forEach(btn => {
      btn.href = getWhatsAppLink();
    });
  });
})();
