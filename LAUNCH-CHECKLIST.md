# Gen 13 Solar Launch Checklist

## Business verification

- [ ] Confirm legal business name
- [ ] Confirm phone and email
- [ ] Confirm service area
- [ ] Confirm business hours
- [ ] Verify completed-project count
- [ ] Verify combined-experience claim
- [ ] Approve testimonials in writing
- [ ] Approve every project image in writing
- [ ] Confirm license and installer language
- [ ] Confirm financing partners and permitted wording

## Form and CRM

- [ ] Submit the form once
- [ ] Activate FormSubmit from the confirmation email
- [ ] Verify successful redirect to `thank-you.html`
- [ ] Confirm leads arrive with all fields
- [ ] Add spam monitoring
- [ ] Replace FormSubmit with CRM integration when available

## Domain and SEO

- [ ] Point `gen13solarco.com` to hosting
- [ ] Enable HTTPS
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Verify page titles and descriptions
- [ ] Add Google Business Profile URL
- [ ] Add verified social profile URLs
- [ ] Configure analytics only after privacy review

## Legal and accessibility

- [ ] Have counsel review Privacy and Terms drafts
- [ ] Confirm consent wording for calls and texts
- [ ] Test keyboard navigation
- [ ] Test screen-reader landmarks and labels
- [ ] Test contrast after any brand-color changes
- [ ] Add an accessibility statement if desired

## Device testing

- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Windows Chrome
- [ ] Windows Edge
- [ ] macOS Safari
- [ ] 320 px mobile width
- [ ] 768 px tablet width
- [ ] 1440 px desktop width
- [ ] Slow 4G simulation

## Final quality gate

```bash
npm install
npm run check
```
