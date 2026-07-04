# Gen 13 Solar — Modern Website Package

A production-oriented, responsive English website for **Gen 13 Solar**, designed around the visual direction supplied by the client: clean editorial spacing, navy/cream/gold palette, large conversion-focused typography, premium solar photography and Sunrun-inspired information architecture without copying Sunrun code or page text.

## Included

- Home, About, Services, Projects, Contact, Thank You, Privacy, Terms and 404 pages
- Responsive navigation and mobile menu
- 12 service offerings from the client brief
- Residential, commercial, nonprofit, church and manufacturing positioning
- Interactive solar savings estimator
- Accessible FAQ accordion
- Project filtering
- Form validation and lead form wired to FormSubmit
- SEO metadata, canonical URLs, Open Graph image, sitemap and robots file
- Netlify and Vercel deployment configuration
- Security headers
- Local asset checker
- Launch checklist and repository benchmark notes

## Preview locally

### Fastest option

Open a terminal in this folder and run:

```bash
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

### Node option

```bash
npm install
npm run dev
```

## Validate local links

```bash
npm run check
```

## Form activation

The contact form currently posts to:

```text
https://formsubmit.co/jfelizgen13@gmail.com
```

FormSubmit normally sends a one-time activation email after the first submission. Complete that activation before launch. For a stronger production setup, replace FormSubmit with the client's CRM, HubSpot, GoHighLevel, a serverless function or another controlled form endpoint.

## Deployment

### Netlify

1. Drag this folder into Netlify Drop, or connect the repository.
2. No build command is required.
3. Publish directory is `.`.
4. Attach `gen13solarco.com` and enable HTTPS.

### Vercel

1. Import the folder or repository.
2. Select **Other** as the framework.
3. Leave the build command empty.
4. Set output directory to `.`.
5. Attach the production domain.

### Traditional hosting / cPanel

Upload all files and folders to `public_html` while preserving the folder structure.

## Important launch edits

The site is technically complete enough for review and deployment, but these business facts must be verified by the client before public launch:

- `288+ completed projects`
- `10+ years combined experience`
- Customer names, quotes and locations
- Project photos and publication permissions
- Service area boundaries
- License, installer and warranty wording
- Financing and incentive claims
- Social profile URLs
- Legal policy review

Planning ranges such as savings, payback and panel lifespan are intentionally labeled as estimates or typical ranges.

## Brand and contact details used

- Brand: Gen 13 Solar
- Phone: +1 (940) 206-7006
- Email: jfelizgen13@gmail.com
- Service area: Dallas–Fort Worth, Texas
- Domain: https://gen13solarco.com
- Language: English

## Image note

The project uses crops derived from the visual references and project screenshots supplied in the conversation. Confirm that Gen 13 Solar owns or has permission to publish every source image before production launch.
