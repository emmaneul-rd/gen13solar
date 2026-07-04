# Repository Benchmark and Design Synthesis

## Scope and honesty statement

A GitHub metadata scan was run across **500 search results** using five paginated result sets for the broad query `website template stars:>10`, supplemented by focused searches for:

- solar energy website templates
- renewable energy websites
- Next.js and Tailwind landing pages
- corporate business websites
- lead-generation home-service sites

This was a **repository discovery and pattern benchmark**, not a claim that every line of code in 500 repositories was manually audited. A smaller set of relevant results and established patterns informed the implementation.

## Patterns retained

1. **Static-first delivery**
   - Fast to deploy
   - No framework lock-in
   - Easy cPanel, Netlify and Vercel hosting
   - Small operational surface

2. **Conversion-focused information architecture**
   - Immediate value proposition
   - Primary CTA above the fold
   - Phone access in the utility bar
   - Trust rail, metrics, services, process, proof, FAQ and final CTA

3. **Reusable visual system**
   - CSS variables for brand tokens
   - Shared card, button, form and section patterns
   - Consistent spacing and responsive behavior

4. **Progressive enhancement**
   - Core content works as semantic HTML
   - JavaScript adds mobile navigation, FAQ behavior, estimator, project filters and validation

5. **SEO and deployment readiness**
   - Unique page titles and descriptions
   - Canonical URLs
   - Open Graph image
   - Sitemap and robots file
   - Error page
   - Security headers

6. **Trustworthy solar copy**
   - Estimates clearly labeled
   - No automatic claim that savings or payback are guaranteed
   - Financing and tax eligibility deferred to qualified professionals

## Design direction synthesized from the supplied references

- Sunrun-like editorial confidence and large typography
- Gen 13 Solar's navy, blue and yellow identity
- White and cream surfaces instead of a generic blue-only solar template
- Dark, high-contrast sections for premium rhythm
- Rounded but not overly playful geometry
- Strong phone and consultation conversion paths
- Clear separation between residential, commercial and nonprofit audiences

## Why the implementation is static HTML/CSS/JS

For this client, static delivery offers the cleanest launch path. It avoids an unnecessary runtime, reduces hosting complexity, makes the ZIP portable and still supports all requested interactions. It can later be migrated into Next.js, Astro, WordPress or a CMS without redesigning the visual system.
