# Gen 13 Solar — Client Content Integration

Integration of the client's real content (founder bio, professional solar design
analysis, Precision/Transparency/Confidence positioning) without altering palette,
identity, navigation, or commercial flow. No images were opened, modified, or added.

## Integrated
- **Jorge Feliz founder content:** Full bio (mission, investment perspective, transparency,
  client-guidance focus) on the About page founder section. Short founder card on the Home team section.
- **Solar design analysis:** The client's 12-point professional design list is now published on
  the Services page as "Design intelligence behind every proposal" (grid of 12 items).
- **Precision / Transparency / Confidence:** Used as the closing tagline on both the Home design
  section and the new Services design section (EN + ES).
- **Verse:** Colossians 3:23 (NIV) included on the About founder section as a sober personal note,
  not as a hero/CTA headline.
- **Team section:** Jorge Feliz shown as Founder & Owner on Home (CSS avatar "JF", no photo).
  Second team member kept as "pending" — not invented.

## Placement
- **Home:** Compact "Professional solar design, not guesswork." section (6 bullets + tagline + CTA
  to Services). Jorge Feliz founder card in the team section. Home length intentionally NOT increased.
- **About:** Full "About Jorge Feliz — Founder & Owner" section with 4 bio paragraphs + Colossians verse.
- **Services:** New "Design intelligence behind every proposal" section with the full 12-point grid,
  subtitle, closing line, and Precision/Transparency/Confidence tagline.

## Not integrated yet (client decisions)
- **Second team member:** Name/role pending — shown as "Team member pending" / "Role pending".
  `CLIENT_SECOND_TEAM_MEMBER_REQUIRED`.
- **Team / founder photo:** No real photo asset supplied. Founder section reuses an existing
  installation image with a neutral `alt` (not presented as a person). `CLIENT_TEAM_PHOTO_PENDING_ASSET`.
- **Instagram:** No real URL — commented out in footers. `CLIENT_DECISION_REQUIRED`.
- **FormSubmit:** Wired but pending client activation.
- **Legal approvals:** Privacy/Terms are drafts; counsel review recommended.
- **Claims / testimonials:** `288+ projects`, `10+ years`, savings/payback ranges and the three
  testimonials require client verification/permission.

## Language
- **English:** Default/canonical. All new content present.
- **Spanish:** All new content translated and verified (Home design section, About founder + verse,
  Services 12-point design section, tagline). ES language switch verified functional.

## Production notes
- A previously-shipped double comma in `locales/en.json` and `locales/es.json` made both locale files
  invalid JSON, which silently broke the EN/ES switch (the i18n loader's `JSON.parse` threw and left
  translations empty). This was fixed; `npm run check` now also validates locale JSON so it cannot
  regress silently.
- No SALOMÓN / Omega / AGI / doctrine branding was added to the client site.
- Build: static HTML/CSS/JS, deployed via Vercel from GitHub (`main`).
