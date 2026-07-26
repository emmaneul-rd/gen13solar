(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const tx = (key, fallback = '') => {
    const value = window.Gen13i18n?.t?.(key);
    return value === undefined || value === null ? fallback : value;
  };

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
      menuToggle.setAttribute('aria-label', !isOpen ? Gen13i18n.t('app.menuClose') : Gen13i18n.t('app.menuOpen'));
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
      menuToggle.setAttribute('aria-label', Gen13i18n.t('app.menuOpen'));
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
  const utilitySelect = $('#utilitySelect');
  const billOutput = $('#billOutput');
  const estimateSavings = $('#estimateSavings');
  const estimateSystem = $('#estimateSystem');
  const estimateOffset = $('#estimateOffset');
  const dentonOutput = $('#dentonOutput');
  const dentonOnSite = $('#dentonOnSite');
  const dentonExportCredit = $('#dentonExportCredit');
  const dentonTotal = $('#dentonTotal');
  const dentonAdvanced = $('#dentonAdvanced');
  const dentonSelfConsumption = $('#dentonSelfConsumption');
  const dentonSelfConsumptionValue = $('#dentonSelfConsumptionValue');
  const fiveYearToggle = $('#fiveYearToggle');
  const fiveYearPanel = $('#fiveYearPanel');
  const rateChangeSelect = $('#rateChange');
  const batteryCheck = $('#batteryCheck');
  const fiveYearWithout = $('#fiveYearWithout');
  const fiveYearWith = $('#fiveYearWith');
  const fiveYearDiff = $('#fiveYearDiff');

  const DENTON_EXPORT_RATE = 0.05;
  const DENTON_AVOIDED_RATE = 0.0694;
  const DEFAULT_SELF_CONSUMPTION = 55;

  const formatUSD = value => new Intl.NumberFormat(document.documentElement.lang === 'es' ? 'es-US' : 'en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(value);

  const updateCalculator = () => {
    if (!monthlyBill || !sunExposure) return;
    const bill = Number(monthlyBill.value || 0);
    const sun = Number(sunExposure.value || 1);
    const utility = utilitySelect ? utilitySelect.value : 'oncor';
    const annualSpend = bill * 12;
    const offset = Math.min(95, Math.round(64 + (sun * 7)));
    const annualSavings = annualSpend * (offset / 100) * 0.84;
    const systemSize = Math.max(3.5, (bill / 21.5) * (1 + (4 - sun) * 0.07));

    billOutput.textContent = `${formatUSD(bill)} ${tx('app.perMonth', '/ month')}`;
    estimateSavings.textContent = `${formatUSD(annualSavings)} ${tx('app.perYear', '/ yr')}`;
    estimateSystem.textContent = `${systemSize.toFixed(1)} ${tx('app.kW', 'kW')}`;
    estimateOffset.textContent = `${offset}${tx('app.percent', '%')}`;

    /* Denton-specific output */
    if (utility === 'denton' && dentonOutput) {
      dentonOutput.hidden = false;
      if (dentonAdvanced) dentonAdvanced.hidden = false;

      const selfConsumptionPercent = dentonSelfConsumption
        ? Number(dentonSelfConsumption.value)
        : DEFAULT_SELF_CONSUMPTION;
      const selfConsumptionRatio = selfConsumptionPercent / 100;

      const kwhPerDollar = 12.5;
      const annualKwh = bill * kwhPerDollar;
      const solarGeneratedKwh = annualKwh * (offset / 100);
      const solarConsumedOnSite = solarGeneratedKwh * selfConsumptionRatio;
      const solarExported = solarGeneratedKwh - solarConsumedOnSite;

      const avoidedGridCost = solarConsumedOnSite * DENTON_AVOIDED_RATE;
      const exportCredit = solarExported * DENTON_EXPORT_RATE;
      const estimatedSolarValue = avoidedGridCost + exportCredit;

      if (dentonSelfConsumptionValue) {
        dentonSelfConsumptionValue.textContent = selfConsumptionPercent + tx('app.percent', '%');
      }
      if (dentonOnSite) dentonOnSite.textContent = formatUSD(avoidedGridCost) + ' ' + tx('app.perYear', '/ yr');
      if (dentonExportCredit) dentonExportCredit.textContent = formatUSD(exportCredit) + ' ' + tx('app.perYear', '/ yr');
      if (dentonTotal) dentonTotal.textContent = formatUSD(estimatedSolarValue) + ' ' + tx('app.perYear', '/ yr');
    } else if (dentonOutput) {
      dentonOutput.hidden = true;
      if (dentonAdvanced) dentonAdvanced.hidden = true;
    }

    /* 5-year projection */
    if (fiveYearWithout && fiveYearWith && fiveYearDiff && rateChangeSelect) {
      const rateScenario = Number(rateChangeSelect.value || 0);
      const hasBattery = batteryCheck ? batteryCheck.checked : false;
      const batteryFactor = hasBattery ? 0.88 : 1;
      let costWithout = 0;
      let costWith = 0;

      for (let y = 0; y < 5; y++) {
        const yearMultiplier = Math.pow(1 + rateScenario, y);
        const yearBill = annualSpend * yearMultiplier;
        costWithout += yearBill;
        const yearSolarReduction = yearBill * (offset / 100) * 0.84 * batteryFactor;
        costWith += (yearBill - yearSolarReduction);
      }

      fiveYearWithout.textContent = formatUSD(costWithout);
      fiveYearWith.textContent = formatUSD(costWith);
      fiveYearDiff.textContent = formatUSD(costWithout - costWith);
    }
  };

  monthlyBill?.addEventListener('input', updateCalculator);
  sunExposure?.addEventListener('input', updateCalculator);
  if (utilitySelect) utilitySelect.addEventListener('change', updateCalculator);
  if (rateChangeSelect) rateChangeSelect.addEventListener('change', updateCalculator);
  if (batteryCheck) batteryCheck.addEventListener('change', updateCalculator);
  if (dentonSelfConsumption) dentonSelfConsumption.addEventListener('input', updateCalculator);
  updateCalculator();

  /* ---- Five-year panel toggle ---- */
  if (fiveYearToggle && fiveYearPanel) {
    fiveYearToggle.addEventListener('click', () => {
      const expanded = fiveYearToggle.getAttribute('aria-expanded') === 'true';
      fiveYearToggle.setAttribute('aria-expanded', String(!expanded));
      fiveYearPanel.hidden = expanded;
      if (!expanded) updateCalculator();
    });
  }

  /* ---- Denton advanced assumptions toggle ---- */
  const dentonAdvancedToggle = $('#dentonAdvancedToggle');
  const dentonAdvancedPanel = $('#dentonAdvancedPanel');
  if (dentonAdvancedToggle && dentonAdvancedPanel) {
    dentonAdvancedToggle.addEventListener('click', () => {
      const expanded = dentonAdvancedToggle.getAttribute('aria-expanded') === 'true';
      dentonAdvancedToggle.setAttribute('aria-expanded', String(!expanded));
      dentonAdvancedPanel.hidden = expanded;
    });
  }

  /* ---- Evidence card drawers ---- */
  $$('.evidence-card__details').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const drawer = btn.nextElementSibling;
      if (drawer) drawer.hidden = expanded;
      btn.textContent = expanded
        ? Gen13i18n.t('evidence.showDetails')
        : Gen13i18n.t('evidence.hideDetails');
    });
  });

  /* ---- Reveal system: fail-open (content visible by default) ---- */
  const revealItems = $$('.reveal, .reveal-group, .reveal-left, .reveal-right, .reveal-scale, .reveal-scale-group, .founder-text-reveal, .capabilities-grid, [data-reveal]');

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
          error.textContent = empty ? Gen13i18n.t('validation.required') : invalidEmail ? Gen13i18n.t('validation.invalidEmail') : invalidPhone ? Gen13i18n.t('validation.invalidPhone') : '';
        }
        if (invalid) valid = false;
      });
      if (!valid) {
        event.preventDefault();
        const firstInvalid = $('[aria-invalid="true"]', form);
        firstInvalid?.focus();
        toast(Gen13i18n.t('validation.reviewFields'));
      } else {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = Gen13i18n.t('app.sending');
        }
      }
    });
  });

  const year = new Date().getFullYear();
  $$('[data-year]').forEach(node => { node.textContent = String(year); });

  /* ---- WhatsApp ---- */
  const WHATSAPP_NUMBER = "19402067006";

  function getWhatsAppLink() {
    const msg = Gen13i18n.t('whatsapp.message');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  $$('[data-whatsapp]').forEach(btn => {
    btn.href = getWhatsAppLink();
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.style.cursor = 'pointer';
  });

  /* ---- Floating contact: smart appearance on mobile ---- */
  const floatingContact = $('.floating-contact');
  if (floatingContact && window.matchMedia('(max-width: 620px)').matches) {
    let shown = false;
    const showFloating = () => {
      if (!shown) { floatingContact.classList.add('is-visible'); shown = true; }
    };
    const hideFloating = () => {
      floatingContact.classList.remove('is-visible');
    };

    // Show after 8 seconds + meaningful scroll (20%+)
    setTimeout(() => {
      if (window.scrollY > document.documentElement.scrollHeight * 0.2) showFloating();
    }, 8000);

    // Show when hero CTA leaves viewport
    const heroCta = $('.hero__actions');
    if (heroCta) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (!e.isIntersecting) showFloating(); });
      }, { threshold: 0 });
      observer.observe(heroCta);
    }

    // Show on calculator or FAQ interaction
    $('#calculator')?.addEventListener('input', showFloating, { once: true });
    $$('.faq-button').forEach(btn => btn.addEventListener('click', showFloating, { once: true }));

    // Hide near footer or contact form
    const hideZones = [$('.site-footer'), $('#contact-form')].filter(Boolean);
    if (hideZones.length) {
      const hideObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) hideFloating(); else if (shown) showFloating(); });
      }, { threshold: 0.1 });
      hideZones.forEach(el => hideObserver.observe(el));
    }
  }

  document.addEventListener('gen13:langChanged', () => {
    $$('[data-whatsapp]').forEach(btn => {
      btn.href = getWhatsAppLink();
    });
  });

  document.addEventListener('gen13:langChanged', updateCalculator);

  /* ---- Testimonial carousel: dots + keyboard nav ---- */
  const testimonialTrack = $('.testimonials');
  const testimonialDots = $('.testimonial-dots');
  if (testimonialTrack && testimonialDots && window.matchMedia('(max-width: 620px)').matches) {
    const cards = $$('.testimonial', testimonialTrack);
    const fragment = document.createDocumentFragment();
    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dots__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1} of ${cards.length}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      fragment.appendChild(dot);
    });
    testimonialDots.appendChild(fragment);

    const updateDots = () => {
      const scrollLeft = testimonialTrack.scrollLeft;
      const trackWidth = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
      const progress = trackWidth > 0 ? scrollLeft / trackWidth : 0;
      const activeIndex = Math.round(progress * (cards.length - 1));
      $$('.testimonial-dots__dot', testimonialDots).forEach((dot, i) => {
        dot.setAttribute('aria-selected', String(i === activeIndex));
      });
    };
    testimonialTrack.addEventListener('scroll', updateDots, { passive: true });

    testimonialTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const scrollAmount = testimonialTrack.clientWidth * 0.85;
        testimonialTrack.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
      }
    });
  }
})();
