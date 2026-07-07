import re, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
FILES = ['about.html', 'services.html', 'projects.html', 'contact.html',
         'privacy.html', 'terms.html', '404.html', 'thank-you.html']

NAV_I18N_MAP = {
    'Home': 'nav.home',
    'About': 'nav.about',
    'Services': 'nav.services',
    'Projects': 'nav.projects',
    'Contact': 'nav.contact',
}

def add_nav_i18n(html):
    """Add data-i18n to nav links"""
    for label, key in NAV_I18N_MAP.items():
        html = html.replace(f'<a href="index.html">{label}</a>', f'<a href="index.html" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="about.html">{label}</a>', f'<a href="about.html" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="services.html">{label}</a>', f'<a href="services.html" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="projects.html">{label}</a>', f'<a href="projects.html" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="contact.html">{label}</a>', f'<a href="contact.html" data-i18n="{key}">{label}</a>')
        # Handle aria-current="page" variants
        html = html.replace(f'<a href="index.html" aria-current="page">{label}</a>', f'<a href="index.html" aria-current="page" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="about.html" aria-current="page">{label}</a>', f'<a href="about.html" aria-current="page" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="services.html" aria-current="page">{label}</a>', f'<a href="services.html" aria-current="page" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="projects.html" aria-current="page">{label}</a>', f'<a href="projects.html" aria-current="page" data-i18n="{key}">{label}</a>')
        html = html.replace(f'<a href="contact.html" aria-current="page">{label}</a>', f'<a href="contact.html" aria-current="page" data-i18n="{key}">{label}</a>')
    return html

def add_language_switcher(html):
    """Add language switcher before menu-toggle button"""
    switcher = '''    </div>
    <div class="language-switcher" aria-label="Language selector">
      <button type="button" data-lang-switch="en" aria-pressed="true">EN</button>
      <button type="button" data-lang-switch="es" aria-pressed="false">ES</button>
    </div>'''
    html = html.replace('''    </div>
    <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>''',
                        switcher + '''
    <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>''')
    return html

FOOTER_I18N_MAP = {
    '<h3>Company</h3>': '<h3 data-i18n="footer.company">Company</h3>',
    '<h3>Solutions</h3>': '<h3 data-i18n="footer.solutions">Solutions</h3>',
    '<h3>Contact</h3>': '<h3 data-i18n="footer.contactTitle">Contact</h3>',
    '<a href="about.html">About us</a>': '<a href="about.html" data-i18n="footer.aboutUs">About us</a>',
    '<a href="projects.html">Projects</a>': '<a href="projects.html" data-i18n="footer.projects">Projects</a>',
    '<a href="contact.html">Contact</a>': '<a href="contact.html" data-i18n="footer.contact">Contact</a>',
    '<a href="contact.html#financing">Financing support</a>': '<a href="contact.html#financing" data-i18n="footer.financingSupport">Financing support</a>',
    '<a href="services.html#residential">Residential solar</a>': '<a href="services.html#residential" data-i18n="footer.residentialSolar">Residential solar</a>',
    '<a href="services.html#commercial">Commercial solar</a>': '<a href="services.html#commercial" data-i18n="footer.commercialSolar">Commercial solar</a>',
    '<a href="services.html#nonprofits">Nonprofits & churches</a>': '<a href="services.html#nonprofits" data-i18n="footer.nonprofitsChurches">Nonprofits & churches</a>',
    '<a href="services.html#ev">EV charging & carports</a>': '<a href="services.html#ev" data-i18n="footer.evCharging">EV charging & carports</a>',
    '<span>Dallas–Fort Worth, U.S.</span>': '<span data-i18n="footer.location">Dallas–Fort Worth, U.S.</span>',
    '<span>Mon–Sat, 8:00 AM–6:00 PM</span>': '<span data-i18n="footer.hours">Mon–Sat, 8:00 AM–6:00 PM</span>',
    '<a href="privacy.html">Privacy</a>': '<a href="privacy.html" data-i18n="footer.privacy">Privacy</a>',
    '<a href="terms.html">Terms</a>': '<a href="terms.html" data-i18n="footer.terms">Terms</a>',
    '<a href="sitemap.xml">Sitemap</a>': '<a href="sitemap.xml" data-i18n="footer.sitemap">Sitemap</a>',
}

def add_footer_i18n(html):
    for old, new in FOOTER_I18N_MAP.items():
        html = html.replace(old, new)
    return html

CTA_I18N_MAP = {
    '<p class="eyebrow">Your next power move</p>': '<p class="eyebrow" data-i18n="cta.eyebrow">Your next power move</p>',
    '<h2>Stop renting all your electricity. Start building energy independence.</h2>': '<h2 data-i18n="cta.title">Stop renting all your electricity. Start building energy independence.</h2>',
    '<p>Request a no-pressure review of your electric bill, roof, goals and available financing paths.</p>': '<p data-i18n="cta.subtitle">Request a no-pressure review of your electric bill, roof, goals and available financing paths.</p>',
    '<a class="btn btn-primary" href="contact.html">Get a free energy analysis': '<a class="btn btn-primary" href="contact.html" data-i18n="cta.primary">Get a free energy analysis',
    '<a class="btn btn-ghost-light" href="tel:+19402067006"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#phone"></use></svg> +1 (940) 206-7006</a>': '<a class="btn btn-ghost-light" href="tel:+19402067006" data-i18n="cta.secondary"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#phone"></use></svg> +1 (940) 206-7006</a>',
}

def add_cta_i18n(html):
    for old, new in CTA_I18N_MAP.items():
        if old in html:
            html = html.replace(old, new)
    return html

TOPBAR_I18N_MAP = {
    'Dallas–Fort Worth, Texas': 'Dallas–Fort Worth, Texas',
    'Community-first solar design, installation, financing support and service.': 'Community-first solar design, installation, financing support and service.',
}

def add_topbar_i18n(html):
    # topbar location link
    html = html.replace(
        'href="https://maps.google.com/?q=Dallas+Fort+Worth+Texas" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#pin"></use></svg> Dallas–Fort Worth, Texas</a>',
        'href="https://maps.google.com/?q=Dallas+Fort+Worth+Texas" target="_blank" rel="noopener" data-i18n="topbar.location"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#pin"></use></svg> Dallas–Fort Worth, Texas</a>'
    )
    # topbar message
    html = html.replace(
        '<div class="topbar__message">Community-first solar design, installation, financing support and service.</div>',
        '<div class="topbar__message" data-i18n="topbar.message">Community-first solar design, installation, financing support and service.</div>'
    )
    # topbar call link
    html = html.replace(
        'href="tel:+19402067006"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#phone"></use></svg> Call +1 (940) 206-7006</a>',
        'href="tel:+19402067006" data-i18n="topbar.call"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#phone"></use></svg> Call +1 (940) 206-7006</a>'
    )
    return html

def add_i18n_script(html):
    """Add i18n.js script tag before app.js"""
    html = html.replace('<script src="assets/js/app.js" defer></script>',
                        '<script src="assets/js/i18n.js"></script>\n  <script src="assets/js/app.js" defer></script>')
    return html

def add_reveal_to_legal_pages(html):
    """Add .reveal class to legal page content sections"""
    # For privacy/terms: add reveal to the legal content section
    html = html.replace(
        '<section class="section"><div class="container legal">',
        '<section class="section"><div class="container legal reveal">'
    )
    # For 404: add reveal to the main content div
    html = html.replace(
        '<section class="section section-cream" style="min-height:65vh;display:grid;place-items:center"><div class="container text-center max-840">',
        '<section class="section section-cream" style="min-height:65vh;display:grid;place-items:center"><div class="container text-center max-840 reveal">'
    )
    # For thank-you: add reveal to main content
    html = html.replace(
        '<section class="section section-cream" style="min-height:65vh;display:grid;place-items:center"><div class="container text-center max-840"><div class="metric__icon"',
        '<section class="section section-cream" style="min-height:65vh;display:grid;place-items:center"><div class="container text-center max-840 reveal"><div class="metric__icon"'
    )
    return html

def process_file(filename):
    path = os.path.join(ROOT, filename)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    original = html
    html = add_nav_i18n(html)
    html = add_language_switcher(html)
    html = add_footer_i18n(html)
    html = add_cta_i18n(html)
    html = add_topbar_i18n(html)
    html = add_i18n_script(html)

    # Add reveal animations to legal/utility pages
    if filename in ['privacy.html', 'terms.html', '404.html', 'thank-you.html']:
        html = add_reveal_to_legal_pages(html)

    if html != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  MODIFIED: {filename}')
    else:
        print(f'  UNCHANGED: {filename}')

if __name__ == '__main__':
    for f in FILES:
        process_file(f)
    print('Done.')
