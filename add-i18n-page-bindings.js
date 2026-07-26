const fs = require('fs');
const path = require('path');

const base = __dirname;

function processFile(filename, replacements) {
  const filePath = path.join(base, filename);
  let html = fs.readFileSync(filePath, 'utf8');
  const beforeCount = (html.match(/data-i18n=/g) || []).length;
  let ok = 0, fail = 0;

  for (const [find, repl] of replacements) {
    if (!html.includes(find)) {
      console.error(`  NOT FOUND in ${filename}: ${find.substring(0, 80)}`);
      fail++;
      continue;
    }
    if ((html.split(find).length - 1) > 1) {
      console.warn(`  AMBIGUOUS in ${filename}: ${find.substring(0, 80)}`);
    }
    html = html.replace(find, repl);
    ok++;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  const afterCount = (html.match(/data-i18n=/g) || []).length;
  console.log(`[${filename}] ${ok}/${replacements.length} applied, ${fail} failed | data-i18n: ${beforeCount} -> ${afterCount} (+${afterCount - beforeCount})`);
}

// ==================== projects.html ====================
processFile('projects.html', [
  // Hero
  ['<h1>Solar projects shaped by the property, not by a template.</h1>',
   '<h1 data-i18n="projects.heroTitle">Solar projects shaped by the property, not by a template.</h1>'],
  ['<p>Explore selected installations and design approaches across residential, commercial and community applications.</p>',
   '<p data-i18n="projects.heroDesc">Explore selected installations and design approaches across residential, commercial and community applications.</p>'],

  // Section header
  ['<p class="eyebrow">Our portfolio</p>',
   '<p class="eyebrow" data-i18n="projects.eyebrow">Our portfolio</p>'],
  ['<h2>Work hard. Design carefully. Let performance do the talking.</h2>',
   '<h2 data-i18n="projects.title">Work hard. Design carefully. Let performance do the talking.</h2>'],
  ['<p class="lead">Selected installations across residential, commercial and community properties in the Dallas\u2013Fort Worth region.</p>',
   '<p class="lead" data-i18n="projects.subtitle">Selected installations across residential, commercial and community properties in the Dallas\u2013Fort Worth region.</p>'],

  // Community filter button
  ['data-filter="community" aria-pressed="false">Community</button>',
   'data-filter="community" aria-pressed="false" data-i18n="projects.filterCommunity">Community</button>'],

  // Card 1
  ['<img src="assets/images/project-pool-home.webp" alt="Residential solar installation beside a backyard pool">',
   '<img src="assets/images/project-pool-home.webp" alt="Residential solar installation beside a backyard pool" data-i18n="alt.projectPoolHome" data-i18n-attr="alt">'],
  ['<span class="project-tag">Residential</span><h3>Backyard-facing whole-home array</h3><p>North Texas \u00b7 Low-visibility roof plane</p>',
   '<span class="project-tag" data-i18n="projects.card1.tag">Residential</span><h3 data-i18n="projects.card1.title">Backyard-facing whole-home array</h3><p data-i18n="projects.card1.desc">North Texas \u00b7 Low-visibility roof plane</p>'],

  // Card 2
  ['<img src="assets/images/project-rooftop.webp" alt="Solar modules installed on a sloped roof">',
   '<img src="assets/images/project-rooftop.webp" alt="Solar modules installed on a sloped roof" data-i18n="alt.projectUpgrade" data-i18n-attr="alt">'],
  ['<span class="project-tag">Upgrade</span><h3>Roof modernization project</h3><p>DFW \u00b7 High-efficiency module layout</p>',
   '<span class="project-tag" data-i18n="projects.card2.tag">Upgrade</span><h3 data-i18n="projects.card2.title">Roof modernization project</h3><p data-i18n="projects.card2.desc">DFW \u00b7 High-efficiency module layout</p>'],

  // Card 3
  ['<img src="assets/images/project-residential.webp" alt="Rear roof solar installation on a Texas home">',
   '<img src="assets/images/project-residential.webp" alt="Rear roof solar installation on a Texas home" data-i18n="alt.projectResidential" data-i18n-attr="alt">'],
  ['<span class="project-tag">Residential</span><h3>Rear-roof production design</h3><p>Strong sun access \u00b7 Architecture-aware placement</p>',
   '<span class="project-tag" data-i18n="projects.card3.tag">Residential</span><h3 data-i18n="projects.card3.title">Rear-roof production design</h3><p data-i18n="projects.card3.desc">Strong sun access \u00b7 Architecture-aware placement</p>'],

  // Card 4
  ['<img src="assets/images/project-premium-home.webp" alt="Large modern building roof with solar panels">',
   '<img src="assets/images/project-premium-home.webp" alt="Large modern building roof with solar panels" data-i18n="alt.projectPremiumHome" data-i18n-attr="alt">'],
  ['<span class="project-tag">Commercial</span><h3>Premium property energy system</h3><p>Scalable design \u00b7 Monitoring ready</p>',
   '<span class="project-tag" data-i18n="projects.card4.tag">Commercial</span><h3 data-i18n="projects.card4.title">Premium property energy system</h3><p data-i18n="projects.card4.desc">Scalable design \u00b7 Monitoring ready</p>'],

  // Card 5
  ['<img src="assets/images/community-gathering.webp" alt="Community property in the Dallas Fort Worth area">',
   '<img src="assets/images/community-gathering.webp" alt="Community property in the Dallas Fort Worth area" data-i18n="alt.projectCommunity" data-i18n-attr="alt">'],
  ['<span class="project-tag">Community</span><h3>Mission-driven energy planning</h3><p>Budget-conscious \u00b7 Long-term support</p>',
   '<span class="project-tag" data-i18n="projects.card5.tag">Community</span><h3 data-i18n="projects.card5.title">Mission-driven energy planning</h3><p data-i18n="projects.card5.desc">Budget-conscious \u00b7 Long-term support</p>'],

  // Card 6
  ['<img src="assets/images/hero-home.webp" alt="Modern home with rooftop solar at sunset">',
   '<img src="assets/images/hero-home.webp" alt="Modern home with rooftop solar at sunset" data-i18n="alt.projectHeroHome" data-i18n-attr="alt">'],
  ['<span class="project-tag">Residential</span><h3>Modern home solar integration</h3><p>Clean roof lines \u00b7 Storage-ready planning</p>',
   '<span class="project-tag" data-i18n="projects.card6.tag">Residential</span><h3 data-i18n="projects.card6.title">Modern home solar integration</h3><p data-i18n="projects.card6.desc">Clean roof lines \u00b7 Storage-ready planning</p>'],

  // Documentation section
  ['<p class="eyebrow">Project documentation</p>',
   '<p class="eyebrow" data-i18n="projects.docEyebrow">Project documentation</p>'],
  ['<h2>Every featured project should carry a clean evidence trail.</h2>',
   '<h2 data-i18n="projects.docTitle">Every featured project should carry a clean evidence trail.</h2>'],
  ['<p>For a trustworthy portfolio, the published case study should distinguish verified facts from estimates and marketing language.</p>',
   '<p data-i18n="projects.docDesc">For a trustworthy portfolio, the published case study should distinguish verified facts from estimates and marketing language.</p>'],

  // Documentation checklist items
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Approved project photography</li>',
   '<li data-i18n="projects.docItem1"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Approved project photography</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Completion date and service area</li>',
   '<li data-i18n="projects.docItem2"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Completion date and service area</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> System size and equipment model</li>',
   '<li data-i18n="projects.docItem3"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> System size and equipment model</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Modeled or measured production, clearly labeled</li>',
   '<li data-i18n="projects.docItem4"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Modeled or measured production, clearly labeled</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Customer quote with written permission</li>',
   '<li data-i18n="projects.docItem5"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Customer quote with written permission</li>'],

  // Media frame alt
  ['<img src="assets/images/aerial-planning.webp" alt="Aerial drone view of rooftop solar planning and design analysis">',
   '<img src="assets/images/aerial-planning.webp" alt="Aerial drone view of rooftop solar planning and design analysis" data-i18n="alt.aerialPlanning" data-i18n-attr="alt">'],
]);

// ==================== contact.html ====================
processFile('contact.html', [
  // Hero
  ['<h1>Start your energy journey with a useful first conversation.</h1>',
   '<h1 data-i18n="contact.heroTitle">Start your energy journey with a useful first conversation.</h1>'],
  ['<p>Share your electric bill, property type and goals. Gen 13 Solar will help identify the right next step without a high-pressure pitch.</p>',
   '<p data-i18n="contact.heroSubtitle">Share your electric bill, property type and goals. Gen 13 Solar will help identify the right next step without a high-pressure pitch.</p>'],

  // Contact card
  ['<p class="eyebrow">Get in touch</p>',
   '<p class="eyebrow" data-i18n="contact.getInTouch">Get in touch</p>'],
  ['<h2>Talk with Gen 13 Solar.</h2>',
   '<h2 data-i18n="contact.talkWithTitle">Talk with Gen 13 Solar.</h2>'],
  ['<p>Questions about a new installation, existing system, financing path, EV charger or commercial project are welcome.</p>',
   '<p data-i18n="contact.talkWithDesc">Questions about a new installation, existing system, financing path, EV charger or commercial project are welcome.</p>'],
  ['<strong>Call us</strong>',
   '<strong data-i18n="contact.callUsLabel">Call us</strong>'],
  ['<strong>Email us</strong>',
   '<strong data-i18n="contact.emailUsLabel">Email us</strong>'],
  ['<strong>Service area</strong>',
   '<strong data-i18n="contact.serviceAreaLabel">Service area</strong>'],
  ['<strong>Business hours</strong>',
   '<strong data-i18n="contact.businessHoursLabel">Business hours</strong>'],
  ['<strong>WhatsApp</strong>',
   '<strong data-i18n="common.whatsapp">WhatsApp</strong>'],

  // Send message section
  ['<p class="eyebrow">Send a message</p>',
   '<p class="eyebrow" data-i18n="contact.sendMessage">Send a message</p>'],
  ['<h2>Request your free personalized solar review.</h2>',
   '<h2 data-i18n="contact.requestReviewTitle">Request your free personalized solar review.</h2>'],
  ['<p>Use the form below. For faster help, include a recent electric-bill range and the city where the property is located.</p>',
   '<p data-i18n="contact.requestReviewDesc">Use the form below. For faster help, include a recent electric-bill range and the city where the property is located.</p>'],

  // Form labels
  ['<label for="name">Full name</label>',
   '<label for="name" data-i18n="contact.formName">Full name</label>'],
  ['<label for="phone">Phone number</label>',
   '<label for="phone" data-i18n="contact.formPhone">Phone number</label>'],
  ['<label for="email">Email address</label>',
   '<label for="email" data-i18n="contact.formEmail">Email address</label>'],

  // Property select options
  ['<option value="">Choose one</option>',
   '<option value="" data-i18n="contact.formPropertyPlaceholder">Choose one</option>'],
  ['<option>Residential</option><option>Commercial</option><option>Church / nonprofit</option><option>Manufacturing / industrial</option><option>Existing solar system</option>',
   '<option data-i18n="contact.formProperty1">Residential</option><option data-i18n="contact.formProperty2">Commercial</option><option data-i18n="contact.formProperty3">Church / nonprofit</option><option data-i18n="contact.formProperty4">Manufacturing / industrial</option><option data-i18n="contact.formProperty5">Existing solar system</option>'],

  // Bill select label and options
  ['<label for="bill">Average monthly bill</label>',
   '<label for="bill" data-i18n="contact.formBillLabel">Average monthly bill</label>'],
  ['<option>Under $150</option><option>$150\u2013$299</option><option>$300\u2013$499</option><option>$500\u2013$999</option><option>$1,000+</option>',
   '<option data-i18n="contact.formBill1">Under $150</option><option data-i18n="contact.formBill2">$150\u2013$299</option><option data-i18n="contact.formBill3">$300\u2013$499</option><option data-i18n="contact.formBill4">$500\u2013$999</option><option data-i18n="contact.formBill5">$1,000+</option>'],

  // Service select label and options
  ['<label for="service">Service needed</label>',
   '<label for="service" data-i18n="contact.formServiceLabel">Service needed</label>'],
  ['<option>Free energy analysis</option><option>New solar installation</option><option>Commercial solar</option><option>Nonprofit / church solution</option><option>EV charging</option><option>Solar carport</option><option>System check / upgrade</option>',
   '<option data-i18n="contact.formService1">Free energy analysis</option><option data-i18n="contact.formService2">New solar installation</option><option data-i18n="contact.formService3">Commercial solar</option><option data-i18n="contact.formService4">Nonprofit / church solution</option><option data-i18n="contact.formService5">EV charging</option><option data-i18n="contact.formService6">Solar carport</option><option data-i18n="contact.formService7">System check / upgrade</option>'],
  // Fix wrong binding on "Other" option
  ['<option data-i18n="contact.formProperty5">Other</option>',
   '<option data-i18n="contact.formService8">Other</option>'],

  // Message label and placeholder
  ['<label for="message">Tell us about your goals</label>',
   '<label for="message" data-i18n="contact.formMessageLabel">Tell us about your goals</label>'],
  ['placeholder="Share your location, energy goals, timeline and any questions."',
   'placeholder="Share your location, energy goals, timeline and any questions." data-i18n="contact.formMessagePlaceholder" data-i18n-attr="placeholder"'],

  // Submit button
  ['<button class="btn btn-primary btn-block" type="submit">Send request',
   '<button class="btn btn-primary btn-block" type="submit" data-i18n="contact.formSubmitBtn">Send request'],

  // Consent text
  ['<p class="form-help">By submitting, you agree that Gen 13 Solar may contact you about this request. No purchase is required.</p>',
   '<p class="form-help" data-i18n="contact.formConsentText">By submitting, you agree that Gen 13 Solar may contact you about this request. No purchase is required.</p>'],

  // Email directly
  ['<p class="form-help" style="margin-top:8px">Or email us directly at',
   '<p class="form-help" style="margin-top:8px" data-i18n="contact.emailDirectly">Or email us directly at'],

  // Open full map
  ['target="_blank" rel="noopener">Open full map',
   'target="_blank" rel="noopener" data-i18n="contact.openMap">Open full map'],

  // Financing section
  ['<p class="eyebrow">Financing & incentives</p>',
   '<p class="eyebrow" data-i18n="contact.financingEyebrow">Financing & incentives</p>'],
  ['<h2>Compare the structure, not only the monthly payment.</h2>',
   '<h2 data-i18n="contact.financingTitle">Compare the structure, not only the monthly payment.</h2>'],
  ['<p>Solar financing can involve cash purchase, loans, leases, power purchase agreements and organization-specific funding. Gen 13 Solar can help you organize the comparison, while tax and legal eligibility should be confirmed with qualified professionals.</p>',
   '<p data-i18n="contact.financingDesc">Solar financing can involve cash purchase, loans, leases, power purchase agreements and organization-specific funding. Gen 13 Solar can help you organize the comparison, while tax and legal eligibility should be confirmed with qualified professionals.</p>'],

  // Financing checklist
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Upfront cost and payment schedule</li>',
   '<li data-i18n="contact.financingItem1"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Upfront cost and payment schedule</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Ownership and transfer terms</li>',
   '<li data-i18n="contact.financingItem2"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Ownership and transfer terms</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Interest, dealer fees and escalators</li>',
   '<li data-i18n="contact.financingItem3"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Interest, dealer fees and escalators</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Incentive ownership and eligibility</li>',
   '<li data-i18n="contact.financingItem4"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Incentive ownership and eligibility</li>'],
  ['<li><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Warranty and service responsibilities</li>',
   '<li data-i18n="contact.financingItem5"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#check"></use></svg> Warranty and service responsibilities</li>'],
]);

// ==================== privacy.html ====================
processFile('privacy.html', [
  // Hero
  ['<h1>Privacy policy</h1>',
   '<h1 data-i18n="privacy.heroTitle">Privacy policy</h1>'],
  ['<p>A plain-language draft describing how website inquiries may be handled.</p>',
   '<p data-i18n="privacy.heroDesc">A plain-language draft describing how website inquiries may be handled.</p>'],

  // Last updated
  ['<p><strong>Last updated:</strong> July 3, 2026</p>',
   '<p data-i18n="privacy.lastUpdated"><strong>Last updated:</strong> July 3, 2026</p>'],

  // Notice
  ['<p>This privacy notice explains how Gen 13 Solar may collect, use and protect information submitted through this website. Replace this draft with a review from qualified counsel before production launch.</p>',
   '<p data-i18n="privacy.notice">This privacy notice explains how Gen 13 Solar may collect, use and protect information submitted through this website. Replace this draft with a review from qualified counsel before production launch.</p>'],

  // Section 1
  ['<h2>Information we collect</h2>',
   '<h2 data-i18n="privacy.section1Title">Information we collect</h2>'],
  ['<p>We may collect contact details, property type, energy-bill ranges, project goals, messages and technical usage information such as browser type and pages visited.</p>',
   '<p data-i18n="privacy.section1Desc">We may collect contact details, property type, energy-bill ranges, project goals, messages and technical usage information such as browser type and pages visited.</p>'],

  // Section 2
  ['<h2>How information is used</h2>',
   '<h2 data-i18n="privacy.section2Title">How information is used</h2>'],
  ['<p>Information may be used to respond to requests, prepare solar consultations, improve the website, maintain records, prevent abuse and comply with applicable law.</p>',
   '<p data-i18n="privacy.section2Desc">Information may be used to respond to requests, prepare solar consultations, improve the website, maintain records, prevent abuse and comply with applicable law.</p>'],

  // Section 3
  ['<h2>Service providers</h2>',
   '<h2 data-i18n="privacy.section3Title">Service providers</h2>'],
  ["<p>The website may rely on hosting, analytics, form-delivery, CRM, mapping and communications providers. Those providers may process information on Gen 13 Solar's behalf under their own terms and privacy commitments.</p>",
   "<p data-i18n=\"privacy.section3Desc\">The website may rely on hosting, analytics, form-delivery, CRM, mapping and communications providers. Those providers may process information on Gen 13 Solar's behalf under their own terms and privacy commitments.</p>"],

  // Section 4
  ['<h2>Cookies and analytics</h2>',
   '<h2 data-i18n="privacy.section4Title">Cookies and analytics</h2>'],
  ['<p>This starter package does not include analytics by default. If analytics or advertising tools are added, update this policy and implement any consent mechanism required by applicable law.</p>',
   '<p data-i18n="privacy.section4Desc">This starter package does not include analytics by default. If analytics or advertising tools are added, update this policy and implement any consent mechanism required by applicable law.</p>'],

  // Section 5
  ['<h2>Data retention</h2>',
   '<h2 data-i18n="privacy.section5Title">Data retention</h2>'],
  ['<p>Information should be retained only as long as needed for the purposes described, business records and legal obligations.</p>',
   '<p data-i18n="privacy.section5Desc">Information should be retained only as long as needed for the purposes described, business records and legal obligations.</p>'],

  // Section 6
  ['<h2>Your choices</h2>',
   '<h2 data-i18n="privacy.section6Title">Your choices</h2>'],
  ['<p>You may request access, correction or deletion of personal information by emailing jfelizgen13@gmail.com, subject to applicable law and legitimate recordkeeping needs.</p>',
   '<p data-i18n="privacy.section6Desc">You may request access, correction or deletion of personal information by emailing jfelizgen13@gmail.com, subject to applicable law and legitimate recordkeeping needs.</p>'],

  // Section 7
  ['<h2>Security</h2>',
   '<h2 data-i18n="privacy.section7Title">Security</h2>'],
  ['<p>Reasonable safeguards should be used, but no internet transmission or storage system can be guaranteed completely secure.</p>',
   '<p data-i18n="privacy.section7Desc">Reasonable safeguards should be used, but no internet transmission or storage system can be guaranteed completely secure.</p>'],

  // Section 8
  ['<h2>Contact</h2><p>Questions about this notice may be sent to jfelizgen13@gmail.com or +1 (940) 206-7006.</p>',
   '<h2 data-i18n="privacy.section8Title">Contact</h2><p data-i18n="privacy.section8Desc">Questions about this notice may be sent to jfelizgen13@gmail.com or +1 (940) 206-7006.</p>'],
]);

// ==================== terms.html ====================
processFile('terms.html', [
  // Hero
  ['<h1>Terms of use</h1>',
   '<h1 data-i18n="terms.heroTitle">Terms of use</h1>'],
  ['<p>Important conditions for using the Gen 13 Solar website and its estimates.</p>',
   '<p data-i18n="terms.heroDesc">Important conditions for using the Gen 13 Solar website and its estimates.</p>'],

  // Last updated
  ['<p><strong>Last updated:</strong> July 3, 2026</p>',
   '<p data-i18n="terms.lastUpdated"><strong>Last updated:</strong> July 3, 2026</p>'],

  // Notice
  ['<p>These website terms are a launch-ready draft, not legal advice. Have qualified counsel review them before publication.</p>',
   '<p data-i18n="terms.notice">These website terms are a launch-ready draft, not legal advice. Have qualified counsel review them before publication.</p>'],

  // Section 1
  ['<h2>Informational purpose</h2>',
   '<h2 data-i18n="terms.section1Title">Informational purpose</h2>'],
  ['<p>Website content is general information and does not create a binding proposal, warranty, engineering certification, tax opinion or financing commitment.</p>',
   '<p data-i18n="terms.section1Desc">Website content is general information and does not create a binding proposal, warranty, engineering certification, tax opinion or financing commitment.</p>'],

  // Section 2
  ['<h2>Estimates and savings</h2>',
   '<h2 data-i18n="terms.section2Title">Estimates and savings</h2>'],
  ['<p>Calculators, ranges and example savings are educational estimates. Actual solar production, utility savings, incentives, costs, payback and property impacts vary by site, usage, equipment, weather, rates, financing and law.</p>',
   '<p data-i18n="terms.section2Desc">Calculators, ranges and example savings are educational estimates. Actual solar production, utility savings, incentives, costs, payback and property impacts vary by site, usage, equipment, weather, rates, financing and law.</p>'],

  // Section 3
  ['<h2>Project agreements</h2>',
   '<h2 data-i18n="terms.section3Title">Project agreements</h2>'],
  ['<p>Any installation or service is governed by a separate written agreement identifying scope, price, equipment, schedule, warranties, assumptions and responsibilities.</p>',
   '<p data-i18n="terms.section3Desc">Any installation or service is governed by a separate written agreement identifying scope, price, equipment, schedule, warranties, assumptions and responsibilities.</p>'],

  // Section 4
  ['<h2>Intellectual property</h2>',
   '<h2 data-i18n="terms.section4Title">Intellectual property</h2>'],
  ['<p>Brand elements, copy, layouts and original site assets may not be reused without permission, except as allowed by law. Project images must only be published with appropriate ownership or permission.</p>',
   '<p data-i18n="terms.section4Desc">Brand elements, copy, layouts and original site assets may not be reused without permission, except as allowed by law. Project images must only be published with appropriate ownership or permission.</p>'],

  // Section 5
  ['<h2>Third-party services</h2>',
   '<h2 data-i18n="terms.section5Title">Third-party services</h2>'],
  ['<p>Links, maps, form providers, financing providers and utility resources are operated by third parties. Gen 13 Solar is not responsible for third-party availability or content.</p>',
   '<p data-i18n="terms.section5Desc">Links, maps, form providers, financing providers and utility resources are operated by third parties. Gen 13 Solar is not responsible for third-party availability or content.</p>'],

  // Section 6
  ['<h2>Acceptable use</h2>',
   '<h2 data-i18n="terms.section6Title">Acceptable use</h2>'],
  ['<p>Do not misuse the website, submit unlawful content, attempt unauthorized access or interfere with normal operation.</p>',
   '<p data-i18n="terms.section6Desc">Do not misuse the website, submit unlawful content, attempt unauthorized access or interfere with normal operation.</p>'],

  // Section 7
  ['<h2>Limitation</h2>',
   '<h2 data-i18n="terms.section7Title">Limitation</h2>'],
  ['<p>To the extent permitted by law, the website is provided without guarantees of uninterrupted access or error-free content.</p>',
   '<p data-i18n="terms.section7Desc">To the extent permitted by law, the website is provided without guarantees of uninterrupted access or error-free content.</p>'],

  // Section 8
  ['<h2>Contact</h2><p>Questions may be directed to jfelizgen13@gmail.com or +1 (940) 206-7006.</p>',
   '<h2 data-i18n="terms.section8Title">Contact</h2><p data-i18n="terms.section8Desc">Questions may be directed to jfelizgen13@gmail.com or +1 (940) 206-7006.</p>'],
]);

// ==================== 404.html ====================
processFile('404.html', [
  ['<h1 style="font-size:clamp(3rem,8vw,6rem)">This page slipped behind a cloud.</h1>',
   '<h1 style="font-size:clamp(3rem,8vw,6rem)" data-i18n="404.heroTitle">This page slipped behind a cloud.</h1>'],
  ['<p class="lead">The link may be outdated or the page may have moved.</p>',
   '<p class="lead" data-i18n="404.heroDesc">The link may be outdated or the page may have moved.</p>'],
  ['href="index.html">Return to sunshine',
   'href="index.html" data-i18n="404.cta">Return to sunshine'],
]);

// ==================== thank-you.html ====================
processFile('thank-you.html', [
  ['<h1 style="font-size:clamp(3rem,7vw,5.8rem)">Thank you.</h1>',
   '<h1 style="font-size:clamp(3rem,7vw,5.8rem)" data-i18n="thankyou.heroTitle">Thank you.</h1>'],
  ['<p class="lead">Your request has been sent to Gen 13 Solar. A team member can follow up using the contact information you provided.</p>',
   '<p class="lead" data-i18n="thankyou.heroDesc">Your request has been sent to Gen 13 Solar. A team member can follow up using the contact information you provided.</p>'],
  ['href="index.html">Return home',
   'href="index.html" data-i18n="thankyou.cta1">Return home'],
  ['<a class="btn btn-outline" href="tel:+19402067006" data-i18n="topbar.call">',
   '<a class="btn btn-outline" href="tel:+19402067006" data-i18n="thankyou.cta2">'],
]);

// ==================== texas-energy-costs.html ====================
// Already fully bound - no changes needed
console.log('[texas-energy-costs.html] Already fully bound - skipped');

console.log('\nDone.');
