/**
 * Gen 13 Solar — Vanilla JS i18n Engine
 * No dependencies. No build. No framework.
 * English = canonical/default. Spanish = secondary.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'gen13_lang';
  const ATTR = 'data-i18n';
  const ATTR_ATTR = 'data-i18n-attr';
  const FALLBACK_LANG = 'en';

  let currentLang = FALLBACK_LANG;
  let translations = { en: {}, es: {} };
  let isLoaded = false;

  /* ---- public API ---- */
  window.Gen13i18n = {
    init,
    switchLang,
    getCurrentLang: () => currentLang,
    t: (key) => getTranslation(key, currentLang),
  };

  /* ---- bind language switch buttons ---- */
  function bindLanguageButtons() {
    document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchLang(btn.getAttribute('data-lang-switch'));
      });
    });
  }

  /* ---- init ---- */
  function init() {
    bindLanguageButtons();
    const stored = localStorage.getItem(STORAGE_KEY);
    const lang = stored || FALLBACK_LANG;
    loadTranslations(() => applyLang(lang, false));
  }

  /* ---- load JSON files ---- */
  function loadTranslations(cb) {
    if (isLoaded) { cb(); return; }

    let loaded = 0;
    const langs = ['en', 'es'];

    langs.forEach((lng) => {
      const url = `locales/${lng}.json`;
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`i18n: failed to load ${url}`);
          return r.json();
        })
        .then((json) => {
          translations[lng] = json;
          loaded++;
          if (loaded === langs.length) {
            isLoaded = true;
            cb();
          }
        })
        .catch((err) => {
          console.warn(`i18n: could not load ${url}`, err);
          loaded++;
          if (loaded === langs.length) {
            isLoaded = true;
            cb();
          }
        });
    });
  }

  /* ---- switch language ---- */
  function switchLang(lng) {
    if (lng !== 'en' && lng !== 'es') {
      console.warn(`i18n: unsupported lang "${lng}", falling back to "en"`);
      lng = FALLBACK_LANG;
    }
    applyLang(lng, true);
    const body = document.body;
    if (body) {
      body.classList.remove('i18n-flash');
      void body.offsetWidth;
      body.classList.add('i18n-flash');
    }
  }

  /* ---- apply translation ---- */
  function applyLang(lng, store) {
    if (store) localStorage.setItem(STORAGE_KEY, lng);
    currentLang = lng;

    /* update html lang attribute */
    document.documentElement.lang = lng;

    /* translate all [data-i18n] elements */
    document.querySelectorAll(`[${ATTR}]`).forEach((el) => {
      const key = el.getAttribute(ATTR);
      const text = getTranslation(key, lng);
      if (text !== undefined) {
        /* preserve child elements (like <span>, <br>) */
        const childNodes = Array.from(el.childNodes);
        const textNodes = childNodes.filter((n) => n.nodeType === Node.TEXT_NODE);
        if (textNodes.length > 0) {
          /* replace only the first text node, keep structure */
          textNodes[0].textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });

    /* translate attributes via [data-i18n-attr] */
    document.querySelectorAll(`[${ATTR_ATTR}]`).forEach((el) => {
      const spec = el.getAttribute(ATTR_ATTR);
      if (!spec) return;
      spec.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (!attr || !key) return;
        const text = getTranslation(key, lng);
        if (text !== undefined) el.setAttribute(attr, text);
      });
    });

    /* update language switcher buttons */
    document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang-switch');
      btn.setAttribute('aria-pressed', btnLang === lng ? 'true' : 'false');
    });

    /* dispatch event so other scripts can react */
    document.dispatchEvent(new CustomEvent('gen13:langChanged', { detail: { lang: lng } }));
  }

  /* ---- get translation with fallback ---- */
  function getTranslation(key, lng) {
    if (translations[lng] && translations[lng][key] !== undefined) {
      return translations[lng][key];
    }
    /* fallback to English */
    if (lng !== FALLBACK_LANG && translations[FALLBACK_LANG] && translations[FALLBACK_LANG][key] !== undefined) {
      return translations[FALLBACK_LANG][key];
    }
    return undefined; /* let the original DOM text show */
  }

  /* ---- bootstrap once DOM is ready ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
