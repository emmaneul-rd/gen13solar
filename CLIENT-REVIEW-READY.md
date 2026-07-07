# Gen 13 Solar Client Review Ready

## Status
CLIENT_REVIEW_READY

## What the client can review now
- **Pages:** Home, About, Services, Projects, Contact, Thank You, Privacy, Terms, 404
- **English content:** Complete on all pages — hero, services, calculator, FAQ, testimonials, CTA bands, footer
- **Spanish content:** Complete EN/ES toggle on all 9 pages with 213 translation keys
- **Language switcher:** EN/ES buttons in navbar on every page; persists choice in localStorage
- **Contact flow:** Form wired to FormSubmit (pending client activation); validation, thank-you page
- **Social links:** LinkedIn (real), Facebook (real), Instagram (commented — CLIENT_DECISION_REQUIRED)
- **Sales funnel:** Hero -> trustbar -> metrics -> audience cards -> services -> calculator -> process -> projects -> testimonials -> FAQ -> CTA band -> form -> floating buttons
- **Animations:** Scroll reveal (IntersectionObserver), hover effects on cards/buttons, navbar scroll effect, reduced-motion support
- **Mobile experience:** Responsive at 1080/860/620px breakpoints, hamburger menu, floating action buttons, no horizontal overflow
- **PDF/Review print:** Each page optimised for browser and device review

## What still needs client approval
- **Instagram:** No real URL provided — commented out in all footer sections
- **FormSubmit activation:** First form submission triggers activation email from FormSubmit.co
- **Claims:** `288+ completed projects`, `10+ years combined experience`, savings/payback ranges — client verification required
- **Testimonials:** Written permission for the three displayed testimonials required
- **Legal:** Privacy Policy and Terms of Use are drafts — counsel review recommended
- **Domain:** `gen13solarco.com` must be confirmed and pointed
- **Production deploy:** Netlify or Vercel with custom domain + HTTPS

## How to review
1. Open Home (`http://localhost:4173/`) — hero, CTAs, trustbar, metrics, services, calculator, process, projects, testimonials, FAQ, closing CTA
2. Switch EN/ES — click EN/ES in navbar; verify text changes on all pages
3. Open Services (`/services.html`) — 6 service cards, process, system info
4. Open Projects (`/projects.html`) — project grid with filters, documentation section
5. Open About (`/about.html`) — mission, vision, values, FAQ
6. Open Contact (`/contact.html`) — form fields, contact info, financing section
7. Submit only a test form after FormSubmit activation
8. Review Privacy (`/privacy.html`) and Terms (`/terms.html`)
9. Confirm claims and testimonials for production
10. Verify on mobile (390px) and tablet (768px)

## Production is gated by
1. Instagram URL (or confirm social section without it)
2. FormSubmit activation
3. Client verification of claims and testimonials
4. Legal counsel review
5. Domain DNS and SSL
6. Final client sign-off

## Files
- `locales/en.json` — English translations
- `locales/es.json` — Spanish translations
- `assets/js/i18n.js` — i18n engine
- `assets/js/app.js` — main app (animations, calculator, form validation, FAQ, mobile menu)
- `assets/css/styles.css` — full responsive stylesheet with animations
