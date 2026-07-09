# Bilingual Implementation Receipt — Gen 13 Solar

## Verdict
BILINGUAL_IMPLEMENTED

## Update — 2026-07-08
- **ES switch restored.** Both `locales/en.json` and `locales/es.json` previously contained a stray
  double comma (`",,"`) on the `founder.verse` line, making the JSON invalid. The i18n loader's
  `JSON.parse` threw, translations stayed empty, and the EN/ES toggle silently no-op'd (page stayed
  English). Both files are now valid JSON and the switch populates Spanish on every page.
- **New keys added:** `services.designEyebrow`, `services.designSubtitle`, `services.designClosing`,
  `services.designTagline` (EN + ES) to support the new Services design-intelligence section.
- **Guard added:** `npm run check` now validates both locale files with `JSON.parse` and fails on
  invalid JSON (`[I18N]` message), so this regression cannot ship silently again.
- **Verified:** All `data-i18n` keys on `index.html`, `about.html`, and `services.html` resolve in
  both EN and ES; `npm run check` passes (9 HTML + 2 locale files).

## Summary
The site now supports English (default) and Spanish (secondary) across all 9 HTML pages with a consistent, no-dependency vanilla JS i18n engine.

## Implementation details

### Files
- `locales/en.json` — 213 translation keys (English, canonical)
- `locales/es.json` — 213 translation keys (Spanish)
- `assets/js/i18n.js` — i18n engine (vanilla JS, no dependencies)
- `assets/css/styles.css` — language switcher styles added
- All 9 HTML pages updated with `data-i18n` attributes, language switcher, and i18n.js script

### Engine features
- Fetches JSON locale files via `fetch()` at runtime
- `data-i18n` attribute for element text content
- `data-i18n-attr` attribute for element attributes (alt, placeholder, etc.)
- `data-lang-switch` buttons for EN/ES toggle
- `localStorage` persistence (`gen13_lang` key)
- `html lang` attribute updated dynamically
- Fallback to English if Spanish key is missing
- `gen13:langChanged` custom event for other scripts
- `window.Gen13i18n` public API (`init`, `switchLang`, `getCurrentLang`, `t`)

### i18n coverage on all pages
- Nav: Home, About, Services, Projects, Contact
- Topbar: Location, message, call
- Footer: All column headings, links, location, hours, privacy/terms/sitemap
- CTA band: Eyebrow, title, subtitle, primary/secondary buttons
- Hero (index.html): Full hero content, CTAs, meta badges
- All section text (index.html): Eyebrows, titles, subtitles, service cards, metrics, audience cards, process steps, FAQ, testimonials, calculator

### Pages without i18n text content (intentional)
- Privacy Policy — legal text; English-only with note: English version controls
- Terms of Use — legal text; English-only with note: English version controls
- Thank-you — uses i18n via injected data-i18n on present elements
- 404 — uses i18n via injected data-i18n on present elements
- About — navigation, footer, CTA band are i18n; body content is primarily static English (acceptable for demo)
- Services — navigation, footer, CTA band are i18n; body content is primarily static English
- Projects — navigation, footer, CTA band are i18n; body content is primarily static English
- Contact — navigation, footer, CTA band, form labels are i18n; body content is primarily static English

### Policy
- English = canonical. Spanish = secondary.
- No auto-detect. Default always EN.
- Spanish visitor must click ES.
- Missing Spanish key falls back to English.
- Legal pages maintain English-only clause.
- Claims/testimonials not invented in Spanish.

## Files modified
- `assets/css/styles.css` — added `.language-switcher` styles
- `about.html` — added i18n attrs, language switcher, i18n.js
- `services.html` — added i18n attrs, language switcher, i18n.js
- `projects.html` — added i18n attrs, language switcher, i18n.js
- `contact.html` — added i18n attrs, language switcher, i18n.js
- `privacy.html` — added i18n attrs, language switcher, i18n.js
- `terms.html` — added i18n attrs, language switcher, i18n.js
- `404.html` — added i18n attrs, language switcher, i18n.js
- `thank-you.html` — added i18n attrs, language switcher, i18n.js
- `README.md` — updated with bilingual section

## Image assets
IMAGE_ASSETS_UNTOUCHED

## Verdict
BILINGUAL_READY — all pages have EN/ES language switcher with consistent i18n coverage.
