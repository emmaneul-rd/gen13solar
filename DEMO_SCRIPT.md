# Gen 13 Solar — Demo Script

> **Updated:** 2026-07-07  
> **Status:** Social links fixed, ready for client demo  
> **Verdict:** CLIENT_DEMO_READY + SALES_DEMO_READY

---

## How to open the demo

### Option A: Local (recommended for client meeting)
```bash
cd "C:/Users/Creativo Sanchez/Videos/gen13-solar-modern-site/gen13-solar-modern-site"
python -m http.server 4173
# Open http://localhost:4173/ in browser
```

### Option B: Deployed
- Netlify: Config present (`netlify.toml`)
- Vercel: Config present (`vercel.json`)
- Deploy to either platform for client preview

---

## What to show first (pitch flow)

### 1. Home page (0:00–0:15)
**What to say:**
> "Gen 13 Solar is a Dallas–Fort Worth solar design and installation contractor. The website is built to guide a property owner from curiosity to a real energy analysis — no pressure, no sunshine smoke."

**What to show:**
- ✅ Hero section: "Energy independence starts here."
- ✅ Trust bar: Local service, licensed installers, premium equipment
- ✅ Metrics: "Up to 20–40% potentially lower energy costs" (with disclaimer)
- ✅ Solar savings calculator (interactive, educational)

**Key point:** The hero explains the value in <10 seconds.

### 2. Services page (0:15–0:30)
**What to say:**
> "They cover residential, commercial, nonprofits, energy analysis, EV charging, and ongoing support. One contractor relationship, multiple energy paths."

**What to show:**
- ✅ 6 service cards
- ✅ Clear descriptions
- ✅ Internal links to detailed sections

### 3. Projects page (0:30–0:45)
**What to say:**
> "Real installations across North Texas. The project descriptions are ready for client-approved photos and final metrics."

**What to show:**
- ✅ Project grid with images
- ✅ Tags (Residential, Commercial, etc.)
- ✅ Location info

### 4. Contact page (0:45–1:00)
**What to say:**
> "The contact form goes directly to the client's email via FormSubmit. The phone number and email are visible. The form is simple, low-friction."

**What to show:**
- ✅ Form fields (name, email, phone, message)
- ✅ Phone number: +1 (940) 206-7006
- ✅ Email: jfelizgen13@gmail.com
- ✅ FormSubmit configured (client must activate)

### 5. Social links (1:00–1:10)
**What to say:**
> "LinkedIn and Facebook are now live. Instagram is ready for the client's URL."

**What to show:**
- ✅ LinkedIn: Links to `https://www.linkedin.com/company/gen-13-solar/`
- ✅ Facebook: Links to `https://www.facebook.com/share/19GcBaCjPY/`
- ⚠️ Instagram: Commented out (client must provide URL)

---

## Pitch de 60 segundos

> "Gen 13 Solar helps Dallas–Fort Worth property owners take control of their energy costs. They design and install residential, commercial, and nonprofit solar systems — from the first bill review to post-installation monitoring.
>
> The website is built to convert curiosity into consultation requests. It explains how solar works, what it costs, what incentives are available, and how to get a verified energy analysis. No pressure, no vague promises — just clear planning.
>
> LinkedIn and Facebook are now live. The contact form is ready. Let's get this deployed and start generating leads."

---

## Flujo recomendado (demo navigation)

1. **Home** — Hero, trust bar, metrics, calculator
2. **Services** — 6 service cards, clear offerings
3. **Projects** — Real installations, visual proof
4. **About** — Team, mission, local focus
5. **Contact** — Form, phone, email, CTA
6. **Footer** — Social links (LinkedIn, Facebook), internal links

---

## Qué NO prometer todavía

1. **Instagram** — No real URL yet. Client must provide.
2. **FormSubmit activation** — Client must submit test form and click activation link.
3. **Testimonials permission** — Verify clients approved displaying names/initials.
4. **Savings calculator accuracy** — Clearly labeled "educational estimate only."
5. **Project data** — Some project descriptions may need client verification before production.

---

## Pendientes del cliente

1. **Instagram URL** — Provide real Instagram URL to display
2. **FormSubmit activation** — Submit test form, click email confirmation
3. **Testimonials permission** — Confirm display of Jason R., Mark T., Pastor David
4. **Privacy/Terms review** — Review `privacy.html` and `terms.html` before going live
5. **Deploy decision** — Netlify (drag-and-drop) or Vercel (Git-connected)

---

## Social Links Status (FIXED 2026-07-07)

| Platform | Status | URL |
|----------|--------|-----|
| LinkedIn | ✅ LIVE | `https://www.linkedin.com/company/gen-13-solar/` |
| Facebook | ✅ LIVE | `https://www.facebook.com/share/19GcBaCjPY/` |
| Instagram | ⚠️ CLIENT_DECISION_REQUIRED | No real URL provided |

---

## Technical Notes

- **Static site** — No build step required
- **Local demo** — `python -m http.server 4173`
- **All pages** — Return 200 (verified via curl)
- **Images** — Untouched (per protocol)
- **SALOMÓN doctrine** — Used for audit methodology, NOT visible in client site

---

*Updated by CLAUDE CODE (SALOMÓN ξ doctrine)*
*Date: 2026-07-07*
