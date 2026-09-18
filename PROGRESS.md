# Progress Log

Running log of what's shipped, what's next, and decisions made along the way. Newest entry on top.

---

## 2026-09-18 — WebApp/MobileApp Security renames; 5 dedicated pentest-type pages

**What happened (direct user requests, iterated live):** Started as "rename the Web Security domain
to WebApp Security." First flagged the tension (that domain's content is narrower, protocol/browser-
layer only, than "WebApp Security" implies) and proposed merging it into Application Security instead;
user initially agreed, so the merge was drafted. User then reversed that call mid-turn: keep the two
domains separate, rename `web-security` -> `webapp-security` (file, slug, title, and every reference),
matching the vulnerabilities surface name the same way Cloud/Network/AI already match theirs. The
merge was cleanly reverted via `git checkout HEAD` on the touched files before it was ever committed,
and the rename applied instead: `domains/web-security.md` -> `domains/webapp-security.md`, title and
body self-references updated, `vulnerabilities/clickjacking.md`'s cross-link repointed.

**Then extended to Mobile:** user asked directly whether Mobile Security had been "widened" the same
way; confirmed it hadn't (that was read as an analogy explaining WebApp's naming, not a second
request) and got explicit confirmation to do the matching rename. `domains/mobile-security.md` ->
`domains/mobileapp-security.md`, the `MobileApp Security` surface added to `VULN_SURFACES`, all 6
mobile vulnerability pages' `surface` field updated, and every cross-collection reference to the old
name/slug found and fixed (`grep`-verified zero remaining "Mobile Security" or "mobile-security"
matches anywhere in `src/` before considering it done, same verification pattern used for the WebApp
rename).

**Types of Penetration Testing restructured into a drill-down, mirroring the vulnerabilities
landing-page pattern:** first pass added inline `<details>` dropdowns per pentest type directly on
that page (after confirming PTaaS was the wrong home for it, since PTaaS is about delivery cadence,
not target surface, and doesn't organize by type at all). User then asked for the deeper version:
actual dedicated pages, the same "landing page -> full page per type" shape already built for
vulnerabilities. Replaced the inline dropdowns with 5 new methodology pages (`webapp-penetration-
testing`, `mobileapp-penetration-testing`, `cloud-penetration-testing`, `network-penetration-testing`,
`ai-penetration-testing`), each following the locked 7-section domain/concept template, and
`types-of-penetration-testing.md` now links out to each rather than holding the detail itself. AI
Penetration Testing was written carefully to avoid contradicting the existing `ai-red-teaming.md`
page: it explains where AI pentesting sits in the target-surface taxonomy and states plainly that
practitioners call this discipline "AI red teaming," pointing there for the actual methodology, rather
than duplicating that page's content under a different name.

**Cross-linked:** each new pentest-type page links back to its matching domain and vulnerabilities-
surface page; each of the five domain pages (`cloud-security`, `webapp-security`, `mobileapp-
security`, `network-security`, `ai-security`) and `application-security.md` got a new Related Topics
link to its dedicated pentest-type page, alongside the existing general `types-of-penetration-testing`
link.

**Editorial Reviewer pass:** `npm run validate:content` (109 files) and `npm run build` (121 pages)
both clean. Zero em-dashes across the 5 new pentest pages; a vendor-name grep flagged only the
substring "aws" inside "flaws," a false positive, confirmed by inspection. All 5 vulnerabilities
surface routes (`cloud-security`, `webapp-security`, `mobileapp-security`, `network-security`,
`ai-security`) and both renamed/new domain and methodology routes confirmed present directly in
`dist/`. The project's own relative-link checker script flagged the expected set of false positives
(links to the dynamic `[surface]` route, which it doesn't model) and nothing else. Verified rendered
dev-server HTML directly: `types-of-penetration-testing`'s five links resolve to the five new pages,
and both renamed domain pages render `<h1>WebApp Security</h1>` / `<h1>MobileApp Security</h1>`
correctly.

---

## 2026-09-18 — Renamed "Web Application" surface to "WebApp Security"

**What happened (direct user request):** Four of the five vulnerability surfaces already followed an
"X Security" naming pattern (Cloud Security, Mobile Security, Network Security, AI Security); "Web
Application" was the odd one out. Renamed it to "WebApp Security" everywhere: the `VULN_SURFACES`
enum in `content.config.ts`, all 22 Web Application vulnerability pages' `surface` frontmatter field,
the landing page and dedicated surface page's label/blurb records, the nav dropdown's conditional
logic, and every cross-collection link and link-text mention (`domains/web-security.md`,
`domains/application-security.md`, `domains/mobile-security.md`). The route changed accordingly, from
`/vulnerabilities/web-application/` to `/vulnerabilities/webapp-security/`. Kept the original
rationale intact (still deliberately distinct from the separate, narrower `domains/web-security` page)
and noted in the `content.config.ts` comment that this rename also restores the "X Security" pattern
the other four surfaces share.

**Editorial Reviewer pass:** Grepped for every literal "Web Application" and "web-application"
occurrence first to separate real surface-label references from incidental prose matches (a
`sans-top-25.md` mention of "web-application-specific" as a generic adjective, unrelated to this
surface, was correctly left untouched). `npm run validate:content` (104 files) and `npm run build`
(116 pages) both clean; confirmed `dist/vulnerabilities/webapp-security/` exists and the old
`web-application/` directory no longer generates. Verified rendered dev-server HTML directly: all 5
surface labels read as "X Security" consistently on the landing page cards, the dedicated surface
page's `<h1>`, and the nav dropdown's flyout rows.

---

## 2026-09-18 — Vulnerabilities restructured into a landing page + 5 dedicated surface pages

**What happened (Design/Frontend Lead, direct user request):** `/vulnerabilities/` previously
rendered every surface as an accordion on one long page, with in-place `<details>` "View all" reveals
for anything past a 4-item cap. Direct feedback: "View all" should be a real separate page, not an
in-place expand, and Web Application specifically should show only 4 OWASP categories before its own
"View all."

Restructured to match: `/vulnerabilities/` is now a landing page, five surface cards (Cloud Security,
Web Application, Mobile Security, Network Security, AI Security), each showing its page count and a
one-line description, linking out to a real dedicated page per surface. Added
`src/pages/vulnerabilities/[surface]/index.astro`, a dynamic route generating
`/vulnerabilities/<surface-slug>/` for each of the 5 surfaces via `getStaticPaths`. Verified no slug
collision is possible between a surface route and any actual vulnerability entry id before building
this (none of the 50 entries is named e.g. "cloud-security"). Each surface page shows its full list
directly, no cap, since the page itself already is "the full list" now; Web Application is the one
exception, still capped at 4 OWASP categories shown with a "View all 10 OWASP Top 10 categories"
`<details>` toggle for the rest, since 10 categories on one page was the specific thing called out as
too much.

**Rewired every link that used to point at an anchor on the single index page**
(`/vulnerabilities/#cloud-security` etc.) to the real page instead (`/vulnerabilities/cloud-security/`):
the nav dropdown's surface rows and Web Application's OWASP sub-links (`BaseLayout.astro`), the
detail page's breadcrumb (`[...slug].astro`), and the "Explore X vulnerabilities" line on
`application-security.md`, `web-security.md`, `cloud-security.md`, `mobile-security.md`,
`network-security.md`, `ai-security.md`, and `frameworks/ai-llm-top-10.md`. Removed the now-dead
`.category-group*` CSS family (the old single-page accordion styling) since nothing renders it
anymore; kept `.subgroup-label` and `.view-all-toggle`, both still used on the new Web Application
surface page.

**Editorial Reviewer pass:** `npm run validate:content` (104 files, unaffected since this was a
routing/UI change with no content template changes) and `npm run build` (116 pages, +5 for the new
surface routes) both clean. Confirmed via the dist output that all 5 surface directories exist
alongside all 50 individual vulnerability pages with no collision. The project's own relative-link
checker script flagged 8 links to the new surface pages as "broken" since it only knows about content
markdown files, not Astro's own generated routes; manually confirmed each one resolves correctly by
checking the actual build output. Verified rendered dev-server HTML directly: landing page shows all 5
surfaces with correct counts (6/22/6/6/10), the Cloud Security page shows all 6 cards with no cap, the
Web Application page shows all 22 cards total with exactly one real "View all 10 OWASP Top 10
categories" toggle (the other 5 `view-all-toggle` string matches were the CSS rule itself, not stray
elements).

---

## 2026-09-18 — Mobile + Network Security batches, full LLM Top 10, index/nav UI fixes

**What happened (Content Architect + Design/Frontend Lead + Subject-Matter Writer, all direct user
requests in the same session):** Four separate asks, handled in sequence.

**1. Card cap on the vulnerabilities index page.** Each surface accordion was rendering every card at
once (up to 22 for Web Application). Added a `CARD_CAP = 4` constant to
`src/pages/vulnerabilities/index.astro`: the first 4 cards show directly, anything beyond that sits
behind a native `<details class="view-all-toggle">` "View all N →" toggle, applied both at the
surface level and inside each Web Application OWASP subgroup. No JS needed, matches the homepage's own
existing 4-card-cap-plus-link pattern in spirit without literally reusing that component (this page
needs an in-place reveal, not a link elsewhere, since it *is* the destination).

**2. Web Application nav flyout redesign.** The prior nested flyout exploded into a 3-column,
10-group, 22-link breakdown that was too wide and cluttered for a hover dropdown. Replaced it with a
single compact column listing the 10 OWASP category names themselves (short label + count, e.g. "A01 ·
Broken Access Control · 5"), each linking to that category's own anchor on the index page
(`#web-application-a01`, added as a real element id this batch). The full per-page breakdown lives on
the index page, which is what an index page is for; the nav dropdown for every surface (Cloud, Web
Application, Mobile, Network, AI) is now a plain single-column list, no multi-column grids anywhere in
it. Removed the now-dead `.vuln-surface-panel-wide` CSS this created and then un-created.

**3. Two real, unrelated UI bugs fixed along the way (user-reported, screenshot on mobile Safari):**
- Horizontal scroll/margin on mobile: `.site-header` has `backdrop-filter: blur(10px)`, and the
  mobile slide-in `.site-nav` (`position: fixed`) is a descendant of it. In WebKit, `backdrop-filter`
  on an ancestor becomes the containing block for `position: fixed` descendants, so the "hidden"
  off-canvas nav was computing its offset against the header's box instead of the true viewport and
  bleeding past the right edge. Fixed with `overflow-x: hidden` on `html, body` (deliberately
  `overflow-x`, not the `overflow` shorthand, so it doesn't break the header's `position: sticky`
  vertical behavior).
- No dedicated close control inside the open mobile menu itself: the hamburger already animated into
  an X, but only via the same button back up in the header. Added a second, explicit `.nav-close`
  button at the top of the slide-in panel itself, wired to the same existing `closeNav()` function.

**4. Full OWASP Top 10 for LLM Applications, plus Mobile Security and Network Security batches.**
`frameworks/ai-llm-top-10.md` previously named only 5 of the list's categories informally, without
numbers, specifically because this project's own rule is to never cite an ID without confidence in it.
Retrofitted the 6 already-published AI Security pages with real `LLM0X:2025` IDs in their `owasp`
field (reusing that field across surfaces, not just Web Application) and drafted the missing 4:
System Prompt Leakage (LLM07), Vector and Embedding Weaknesses (LLM08), Misinformation (LLM09), and
Unbounded Consumption (LLM10). AI Security is now a complete, standards-grounded 10-page set.
Mobile Security (6 pages: Insecure Mobile Data Storage, Insecure Mobile Communication, Insecure Mobile
Authentication & Session Management, Insufficient Binary Protections, Excessive Mobile Permissions &
Insecure Platform Usage, Insecure WebView & Deep Link Handling) and Network Security (6 pages: Network
Segmentation Failures, Weak or Missing Network Access Controls, Insecure Wireless Network
Configuration, Unencrypted Network Protocols in Use, Insecure VPN & Remote Access Configuration,
Insufficient Network Monitoring & Intrusion Detection) both went from zero pages to full batches
mirroring their domain pages' own already-named failure-mode lists. The vulnerabilities collection is
now 50 pages across all 5 surfaces.

**Decided against citing OWASP's Cloud-Native Application Security Top 10 (CNAS) for Cloud Security,**
after the user asked for it directly. Checked the primary source before doing anything (this project's
own rule): CNAS's GitHub README literally lists its table of contents as "Top 10 **(TBD)**" and the
project was archived in April 2025 without ever publishing a finished, numbered list, unlike the real,
completed OWASP Top 10 (2021) and OWASP Top 10 for LLM Applications (2025). Citing "CNAS-1" through
"CNAS-10" would mean presenting an abandoned draft as a settled standard. User agreed to keep Cloud
Security as a flat list; added one honest sentence to `domains/cloud-security.md` naming CNAS as a
named-but-unfinished effort rather than building any structure around it.

**Cross-linked:** every new page both to its siblings within the same batch and back into whichever
existing page it specializes (`insecure-webview-deeplink-handling` <-> `cross-site-scripting`,
`ai-misinformation` <-> `excessive-agency` and `ai-supply-chain-risks`, etc.). `domains/mobile-
security.md` and `domains/network-security.md` had their `relatedVulnerabilities` and Related Topics
filled in for the first time (previously empty/roadmap placeholders from last batch), and their prose
now links each named failure pattern directly to its dedicated page.

**Editorial Reviewer pass:** `npm run validate:content` (104 files) and `npm run build` (111 pages)
both clean after fixing four summaries over the 200-char schema limit. Zero em-dashes across all 16 new
files this batch. Vendor-name grep flagged only generic platform-mechanism references (Android, iOS,
Keychain, Keystore) that name real OS mechanisms the same way the Cloud batch named S3/Azure Blob/GCS
generically, not a real client engagement. A corrected relative-link resolver (the previous one
false-flagged anchor links to collection index pages) confirmed zero actual broken links across all 6
collections. Verified the rendered dev-server HTML directly: all 5 surfaces render with correct counts
(Cloud 6, Web Application 22, Mobile 6, Network 6, AI 10 = 50 total), exactly 5 view-all toggles appear
in the expected places, the nav flyout lists all 5 surfaces as a single column each, and both UI bug
fixes (`overflow-x: hidden`, `#navClose`) compiled into the build output.

**Next (not yet drafted):** the lower-priority domains/methodology backlog from three batches ago
(Identity & Access Management, IoT/OT, Cryptography as domains; Purple Teaming, Secure Code Review,
Social Engineering Assessment, Bug Bounty, Tabletop Exercises as methodology pages) is still open. AI
Security backlog beyond the now-complete LLM Top 10: Model Theft / IP protection of weights and
Adversarial Robustness / Evasion, both named in `domains/ai-security.md`'s "Model security" bullet.

---

## 2026-09-18 — AI Security vulnerability batch; re-architected the taxonomy to surface-based

**What happened (Content Architect, direct user request, superseding the previous batch's taxonomy):**
The category scheme shipped one batch ago (Injection, Access Control, Authentication & Identity,
Client-Side & UI, Design & Business Logic, Configuration & Supply Chain, Cloud Security) is now
replaced, not extended. The `vulnerabilities` collection's `category` field is gone; a new `surface`
field takes its place, with exactly the same five values as the request: Cloud Security, Web
Application, Mobile Security, Network Security, AI Security. "Web Application" (not bare "Web") was
chosen deliberately so it doesn't collide with the separate, narrower `domains/web-security` page
(protocol/browser-layer topics only). All 22 pre-existing web pages moved to `surface: "Web
Application"`; all 6 Cloud Security pages moved to `surface: "Cloud Security"`.

**Sub-grouping decision:** Web Application is large enough (22 pages) to need a second level. Rather
than inventing another custom bucket scheme, it reuses the `owasp` field every one of those 22 pages
already carries (every one already maps to A01-A10), so grouping is standards-grounded with zero new
field. Cloud/AI/Mobile/Network stay flat internally for now; they can get their own sub-grouping the
same way once any of them grows large enough to need it.

**Explicitly decided against:** merging related classes (e.g. IDOR, CSRF, Path Traversal, Open
Redirect, all under OWASP A01) into fewer combined pages. CLAUDE.md locks one full 11-section page per
vulnerability class; consolidating would have been a lossy rewrite of already-published, reviewed
content for a findability problem the surface/OWASP grouping already solves without losing depth.

**Batch (6 new pages, surface "AI Security"):** Prompt Injection, Insecure Output Handling, Excessive
Agency, AI Sensitive Information Disclosure, AI Model & Training Data Supply Chain Risks, Training
Data Poisoning. Scoped to exactly the concepts already named in `frameworks/ai-llm-top-10.md` (the
first five) plus training data poisoning from `domains/ai-security.md`'s own "How It Works" section,
deliberately without inventing numbered LLM0X or CWE IDs the way that framework page itself already
declines to, since the current official numbering isn't something this project is confident citing.
`cwe: []` on all six for that reason.

**Cross-linked:** both new-page-to-new-page (prompt injection -> insecure output handling / excessive
agency; etc.) and back into existing pages (insecure output handling -> cross-site-scripting,
excessive-agency -> broken-access-control, ai-supply-chain-risks -> vulnerable-outdated-components).
`frameworks/ai-llm-top-10.md`'s five informally-named risk bullets now link to their dedicated pages
directly. `domains/ai-security.md`'s `relatedVulnerabilities` and Related Topics, previously empty,
now list all six.

**UI (Design & Frontend Lead, direct user request for "sophisticated" nested navigation):** Both the
index page and the nav dropdown now group two levels deep: surface (top), then OWASP category inside
Web Application only. The index page renders each surface as an open-by-default `<details id="{kebab-
surface}">` accordion (nothing hidden from a first-time visitor, search, or read-aloud; the id makes
each surface directly deep-linkable, e.g. `/vulnerabilities/#ai-security`). The nav dropdown is a true
nested flyout: hovering or focusing a surface row in the Vulnerabilities dropdown opens a side panel
listing that surface's entries (further split into OWASP sub-columns for Web Application, reusing
`.nav-col-title`). Built as its own `.vuln-surface-*` class family rather than reusing `.nav-panel`,
specifically because `.nav-item:hover .nav-panel`'s descendant selector would otherwise have revealed
every surface's flyout at once from a single hover on the outer "Vulnerabilities" link. Mobile gets a
dedicated fallback: flyouts render inline and always-expanded under their row instead of depending on
hover, consistent with the project's existing "no hover-only mobile behavior" rule from the read-aloud/
UI-polish batch.

**Cross-collection wiring (direct user request: "add the vulns link... in their main pages"):** every
domain page whose subject matches a vulnerabilities surface now has a prominent, bolded "Explore X
vulnerabilities" line at the top of its Related Topics section, linking to that surface's anchor:
`application-security.md` and `web-security.md` both point at `#web-application` (the 22 pages are
AppSec-flavored OWASP Top 10 classes, not the narrower web-security domain, but both readerships
benefit from the pointer); `cloud-security.md` and `ai-security.md` point at their own anchors and
additionally still enumerate each specific dedicated page by name; `mobile-security.md` and
`network-security.md` point at anchors with zero entries today, worded as a roadmap pointer so the
link isn't misleading, and will start resolving to real content automatically the moment either
surface gets its first page, no further edit needed.

**Editorial Reviewer pass:** `npm run validate:content` (88 files) and `npm run build` (95 pages) both
clean after fixing one `summary` over the 200-char schema limit. Zero em-dashes and zero vendor names
(OpenAI, ChatGPT, Anthropic, Claude, Gemini, Copilot, Llama, Meta AI) across the 6 new files, confirmed
by direct grep. Confirmed no invented LLM0X or suspicious CWE-13xx/14xx IDs anywhere in the batch. A
relative-link resolver flagged 8 links as "broken," all false positives: the script doesn't understand
`vulnerabilities/#surface-slug` anchor links to the index page and misread the fragment as a missing
slug; manually confirmed each one is a valid, correctly-formed anchor link. Verified the rendered
dev-server HTML directly on both `/vulnerabilities/` and `/` (which shares the same nav): all 3
surfaces with content (Cloud Security 6, Web Application 22, AI Security 6) render with correct counts,
correct OWASP sub-column ordering (A01-A10), and the nested flyout markup is present and scoped
correctly.

**Next (not yet drafted):** Mobile Security and Network Security vulnerability-class batches, whenever
those domains are prioritized next. AI Security backlog beyond this batch: Model Theft / IP protection
of weights and Adversarial Robustness / Evasion, both named in `domains/ai-security.md`'s "Model
security" bullet but not yet drafted as their own pages. The lower-priority domains/methodology backlog
from two batches ago (Identity & Access Management, IoT/OT, Cryptography as domains; Purple Teaming,
Secure Code Review, Social Engineering Assessment, Bug Bounty, Tabletop Exercises as methodology pages)
is still open.

---

## 2026-09-18 — Cloud Security vulnerability batch, and categorized the vulnerabilities collection

**What happened (Content Architect proposal, confirmed by user, then drafted):** Audited the
`vulnerabilities` collection against `domains/cloud-security.md`, whose own "How It Works" section
already names the standard cloud failure-mode list (public storage, overly permissive IAM, exposed
metadata endpoints, unencrypted data, missing logging), and found none of it had a dedicated
vulnerability-class page yet; `relatedVulnerabilities` on that page had been sitting empty since it
was written. Two adjacent classes (SSRF reaching a cloud metadata endpoint, subdomain takeover of a
dangling cloud DNS record) were already covered elsewhere and deliberately left alone rather than
duplicated.

**Batch (6 new pages, category "Cloud Security"):** Public Cloud Storage Exposure, Overly Permissive
Cloud IAM, Insecure Infrastructure as Code (IaC), Exposed Cloud Credentials & Secrets Sprawl,
Container & Kubernetes Misconfiguration, Cross-Tenant Isolation Failure. All 11 locked sections,
genericized worked examples (invented companies), inline SVG diagrams, real CWE IDs. Cross-linked
both directions: from the new pages back to `security-misconfiguration`, `broken-access-control`, and
`ssrf`, and forward from those three into the relevant new pages. `domains/cloud-security.md`'s
`relatedVulnerabilities` and Related Topics section now point at all six.

**Structural change (mid-batch, direct user request):** the `vulnerabilities` collection had grown to
22 pages before this batch (28 after), past the point a single flat list or single-column nav
dropdown reads well. Added a `category` field to the collection's schema (`VULN_CATEGORIES` in
`src/content.config.ts`: Injection, Access Control, Authentication & Identity, Client-Side & UI,
Design & Business Logic, Configuration & Supply Chain, Cloud Security) and back-filled it on all 22
pre-existing pages. The index page now renders each category as an open-by-default `<details>`
accordion (collapsible, but nothing hidden from a first-time visitor, search, or the read-aloud
feature) instead of one flat grid. The nav dropdown groups the same way, using `.nav-col-title`, a
CSS class that already existed in `global.css` for exactly this purpose but had never actually been
wired up anywhere. The detail page's breadcrumb now shows the category alongside the "back to index"
link, matching the pattern the `domains` collection already used for its own `category` field.

**Editorial Reviewer pass:** `npm run validate:content` and `npm run build` both clean (89 pages).
Zero em-dashes across the 6 new files. A relative-link resolver script confirmed every cross-link
across all 6 collections resolves to a real slug. The two provider-service names used generically in
`cloud-storage-exposure.md` (S3, Azure Blob, GCS) are naming real product categories the way
`cloud-security.md` itself already does, not a real client engagement, so they don't trigger the
genericization rule; no other vendor names appear anywhere in the batch. Verified the rendered
dev-server HTML directly: all 7 category groups render on the index page and in the nav dropdown,
counts per category (4/8/1/1/2/6/6 = 28) match the assigned mapping exactly.

**Next (not yet drafted):** the lower-priority backlog from the last domains/methodology gap-fill
(Identity & Access Management, IoT/OT & Industrial Control Systems, Cryptography as domains; Purple
Teaming, Secure Code Review, Social Engineering Assessment, Bug Bounty, Tabletop Exercises as
methodology pages) is still open.

---

## 2026-09-18 — Read-aloud feature, font size, footer link, minor fixes

**What happened:**
- Added a "Listen to this page" control using the browser's native `speechSynthesis` API: no
  server, no API key, no third-party cost. It's injected client-side only when the page actually
  has an `article.vuln-body` element, so it appears on every domains/methodology/frameworks/
  compliance/attacks/vulnerabilities detail page and nowhere else (index pages and the homepage
  have nothing worth reading aloud). Strips the inline SVG diagrams from what gets read (reading
  out coordinate/path data would be nonsense) and reads the page's own `<h1>` first. Play, pause/
  resume, and stop controls.
- Bumped every explicit font-size in the stylesheet and page templates up by 1px (site-wide, via a
  script rather than hand-editing each one, to keep every size consistent relative to the others).
- Removed the "Source on GitHub" footer link per request.
- Confirmed Red Teaming was never actually missing from the site, just relocated from `domains` to
  `methodology` during the earlier collection split (it's a testing methodology, not a domain,
  same reasoning as AI Red Teaming next to it) — no content change needed, just a location
  clarification.

**Why:** Direct user requests. The read-aloud feature specifically was scoped to the Web Speech
API rather than a cloud TTS service specifically because this is a static site with no backend,
and introducing a paid third-party API for this would add real cost and a credential to manage for
a free educational resource; the browser-native approach costs nothing and needs no key.

---

## 2026-09-18 — Vulnerability/attack gap-fill, reference-link audit, UI polish

**What happened (Content Architect gap analysis, re-derived without external browsing, confirmed
by user, then drafted):** Did a fresh completeness pass against general, non-vendor-specific attack
and vulnerability taxonomies (explicitly not fetching the external page the user referenced, per
this project's own no-HackerOne rule and to avoid any risk of reproducing another site's exact
structure). Found real gaps, mostly in `vulnerabilities`:

- `vulnerabilities` (11 new pages): CSRF, Path Traversal, OS Command Injection, Clickjacking, XXE,
  File Inclusion (LFI/RFI, combined into one page since they're the same class differing only in
  local vs. remote), IDOR, Business Logic Vulnerabilities, Open Redirect, Mass Assignment,
  Subdomain Takeover.
- `attacks` (3 new pages): DNS Tunneling, IP Spoofing, AI-Powered Attacks.
- Added forward links from `broken-access-control` and `insecure-design` to the new pages that
  specialize them (IDOR, CSRF, Path Traversal, Open Redirect; Business Logic Vulnerabilities), and
  fixed two mutual "a dedicated page is planned" placeholders between Path Traversal and File
  Inclusion now that both exist.
- Expanded the `types-of-cyberattacks` taxonomy table with all 14 new rows, each linked.

**Reference-link audit (user-requested):** found and fixed 7 real citations across `methodology`
and `domains` that named a standard (MITRE ATT&CK, MITRE ATLAS, OWASP Top 10, OWASP Mobile Top 10,
CWE, Cloud Security Alliance) with a bare parenthetical domain instead of an actual hyperlink.
Swept every collection afterward; confirmed clean.

**UI/UX fixes (user-reported):**
- Headline/brand font swapped from Newsreader to Fraunces for more visual character; refined
  heading weight and letter-spacing; added a visible hover/focus underline-thickening on inline
  links generally.
- Fixed a real alignment bug: the header was always 1080px wide, but article/detail pages
  independently centered their content at 720px, so an article's content didn't line up with the
  header/logo above it. Per direct user feedback (citing the CTEM page specifically) that this
  read as wasted side space rather than intentional narrow-column typography, unified every page
  to the same 1080px width rather than reintroducing a narrower reading column.
- Fixed mobile "sticky hover": several `:hover` effects (cards, nav links, footer links, buttons,
  tagline links) weren't scoped to real pointer devices, so a tap on a touchscreen could leave the
  hover style visibly stuck until the user tapped elsewhere. Wrapped all of them in
  `@media (hover: hover)` and added matching `:active` states so touch devices get instant tap
  feedback instead.
- Trimmed excess space between page content and the footer (100px page padding plus a 64px footer
  margin stacked to 164px of dead space; reduced to a combined ~72px).

**Status:** all 14 content pages reviewed (zero em-dashes, zero vendor names, zero broken links,
summaries within schema limits) and published; CSS fixes verified via a local preview build.
Shipping now.

---

## 2026-09-18 — Domains and Methodology gap-fill

**What happened (Content Architect gap analysis, confirmed by user, then drafted):** Audited the
newly-trimmed `domains` and `methodology` collections against the project's own mission statement
and standard field practice, proposed a prioritized list in chat, got it confirmed, and drafted:

- `domains` (5 new pages, 4 → 9 total): Network Security, Web Security, AI Security, Blue Team &
  Security Operations, GRC (Governance, Risk & Compliance).
- `methodology` (3 new pages, 6 → 9 total): Vulnerability Assessment & Management, Incident
  Response, Threat Modeling.

**Why:** `CLAUDE.md`'s own mission statement names network, blue team, GRC, and (eventually) AI
security as domains this site is meant to grow into; those were still missing. Vulnerability
Assessment/Management and Incident Response were referenced only in passing elsewhere (e.g. inside
the ransomware attack page) with no page of their own despite being genuinely standard, named
methodologies; Threat Modeling is the direct "how it's actually done" companion to the existing
Insecure Design vulnerability page.

**Editorial Reviewer pass:** zero em-dashes, zero vendor-name leakage, zero broken cross-links,
all summaries under the schema limit, verified across all 8 files before publish. Flipped
`draft` → `published`.

**Still open (lower-priority backlog, not drafted this batch):** Identity & Access Management,
IoT/OT & Industrial Control Systems, and Cryptography as domains; Purple Teaming, Secure Code
Review, Social Engineering Assessment (the methodology, distinct from the attack-technique page),
Bug Bounty/crowdsourced testing (generic, no platform names), and Tabletop Exercises as
methodology pages.

---

## 2026-09-18 — Split domains into four separate collections

**What happened (Content Architect):** The previous batch folded Frameworks & Standards and
Compliance & Regulations into the `domains` collection as extra `category` values. Direct user
feedback: don't merge domain, compliance, framework, and methodology together. Split into four
separate top-level collections, each still sharing the same 7-section domain/concept template:

- `domains` (trimmed to 4 pages): Application Security, Cloud Security, Mobile Security, and the
  attack-landscape taxonomy page (`types-of-cyberattacks`, which stays here for the same reason it
  always has: it maps `/attacks/`, the way the other three collections' own overview pages now map
  `/methodology/`, `/frameworks/`, `/compliance/`).
- `methodology` (new, 6 pages, moved from domains): What Is Penetration Testing, Types of
  Penetration Testing, Penetration Testing as a Service, Red Teaming, AI Red Teaming, Continuous
  Threat Exposure Management.
- `frameworks` (new, 6 pages, moved from domains): the Frameworks & Standards overview, OWASP Top
  10, SANS/CWE Top 25, the OWASP Top 10 for LLM Applications, NIST CSF, CIS Controls.
- `compliance` (new, 7 pages, moved from domains): the Compliance & Regulations overview, GDPR,
  HIPAA, PCI-DSS, SOC 2, ISO/IEC 27001, India's DPDP Act.

Mechanically: `git mv` for all 19 relocated files, `category` field dropped from all of them (no
longer needed, each collection is now homogeneous), an automated script rewrote every relative
cross-link whose target moved collections (14 files touched), and a broken-link check across all 6
collections confirmed zero dangling links afterward. Added `src/pages/methodology/`,
`src/pages/frameworks/`, `src/pages/compliance/` (index + `[...slug]` each), a nav entry per new
section, a homepage section per new section (same 8-card-cap-plus-view-all pattern as the rest, per
user request to keep that consistent everywhere), and a rebuilt footer (brand statement on its own
row, then a 6-column link grid: Domains / Methodology / Frameworks / Compliance / Attacks /
Vulnerabilities).

**Why:** These are genuinely different questions (what's being secured / how it's tested / what
named standard shapes it / what's actually mandatory), and folding them into one collection's
category field was the same mistake the site had already corrected once before (attacks were
originally going to be domains-collection entries too, before becoming their own collection).

**Next (Content Architect gap analysis, requested but not yet drafted):** audit what's missing from
the now-trimmed `domains` collection and from `methodology`, and propose a batch before drafting —
see chat for the actual list; not duplicating it here until it's confirmed and acted on.

---

## 2026-09-18 — Frameworks, compliance, Mobile Security, full OWASP Top 10 shipped

**What happened (Content Architect):** Extended the `domains` collection's `category` enum with two
new values: `Framework & Standard` and `Compliance & Regulation`. Both follow the existing 7-section
domain template exactly, no new template needed. Per explicit user direction, both get a merged
treatment: one reference/overview page each (same pattern as `types-of-cyberattacks`, a taxonomy
page with a comparison table) plus a full dedicated page per named framework or regulation,
cross-linked from the overview.

**Batch:**
- `vulnerabilities` (9 new pages): the remaining OWASP Top 10 (2021) categories not already covered
  by SQL Injection / XSS under Injection (A03) — Broken Access Control (A01), Cryptographic Failures
  (A02), Insecure Design (A04), Security Misconfiguration (A05), Vulnerable and Outdated Components
  (A06), Identification and Authentication Failures (A07), Software and Data Integrity Failures
  (A08), Security Logging and Monitoring Failures (A09), Server-Side Request Forgery (A10). This
  brings vulnerability-class coverage to the full OWASP Top 10.
- `domains` (1 new page, Domain Overview): Mobile Security.
- `domains` (6 new pages, Framework & Standard): an overview/reference page, plus OWASP Top 10,
  SANS Top 25, the OWASP Top 10 for LLM Applications, the NIST Cybersecurity Framework, and CIS
  Controls as individual dedicated pages.
- `domains` (7 new pages, Compliance & Regulation): an overview/reference page, plus GDPR, HIPAA,
  PCI-DSS, SOC 2, ISO/IEC 27001, and India's DPDP Act as individual dedicated pages.

**Decided:** ISO/IEC 27001 lives under Compliance & Regulation, not Framework & Standard, since it's
most commonly pursued as a certification/audit target (like SOC 2) rather than a prioritization
framework (like NIST CSF or CIS Controls) — a judgment call, not a hard rule, since it's genuinely
both.

**Written without em-dashes from the start this batch** (see the copyedit-pass entry above) rather
than relying on another cleanup pass. Confirmed clean across all 23 new files, no cleanup pass
needed this time.

**Editorial Reviewer pass:** One template bug caught and fixed: `logging-monitoring-failures.md`
used the attack-template heading "How to Detect It" instead of the vulnerability template's "How to
Find It" (the writing fork mixed the two templates' headings on this one file), caught by the
build-time validator exactly as designed. Several framework/compliance pages came in shorter than
the requested 1400-2000 word target (as low as ~500 words); read a sample in full (SANS Top 25, CIS
Controls, HIPAA) and judged them complete rather than thin: they correctly hedge on exact figures
(control counts, fine amounts, edition numbers) they weren't confident were current rather than
inventing them, which is the right call, just naturally shorter than a worked-example-heavy
vulnerability page. Verified zero broken internal cross-links across all 54 published files, zero
vendor-name leakage, zero em-dashes. All flipped `draft` → `published`.

**Shipped live:** 58 static pages now live at https://abhis9102.github.io/synthreat/.

---

## 2026-09-18 — Em-dash copyedit pass; concurrent-session note

**What happened:** All 31 published content files (2 vulnerabilities, 9 domains, 20 attacks)
copyedited to remove every em-dash, rewritten sentence-by-sentence with punctuation suited to each
one's actual grammatical role (period, colon, semicolon, comma, or parentheses) rather than a blind
find-and-replace. Done via 7 parallel review forks, verified with a zero-em-dash grep across the
whole `src/content/` tree afterward.

**Why:** Direct user feedback that the prose read as visibly AI-generated specifically because of
heavy em-dash use.

**Decided:** New content going forward should be written without em-dashes from the start, folded
into the drafting-fork instructions for future batches, rather than relying on a cleanup pass.

**Operational note:** While this pass was running, the same GitHub account pushed two commits
directly to `main` (`Add light default theme toggle`, `Make light mode the default`) implementing
the same light/dark toggle feature this session had also just built independently, most likely a
second concurrent Claude Code session acting on the same request. Reconciled by taking that
already-live implementation as canonical (`git reset --hard origin/main`) and reapplying only the
em-dash cleanup and a `domains` schema change on top, rather than attempting a line-level merge of
two independent implementations of the same feature, which produced duplicated markup on a first
attempt and was aborted. This session's own theme-toggle code was discarded, not merged.

---

## 2026-09-18 — Attack Techniques section shipped, site redesigned, live

**What happened (Content Architect):** Added a third content collection, `attacks` (site path
`/attacks/`), specifically for attacker *techniques* (phishing, ransomware, DDoS, credential
stuffing, social engineering, supply chain compromise, etc.) as distinct from code-level
*vulnerability classes*. Defined its own 11-section locked template in `CLAUDE.md` — deliberately
kept close to the vulnerability template's shape (same rigor: a worked example, severity
calibration, impact-by-scenario table) with two sections renamed to fit a technique rather than a
coding bug ("The Trust Boundary That Breaks" → "What Makes It Work", "Remediation" →
"Prevention & Response"), and grounded in CAPEC / MITRE ATT&CK IDs instead of CWE — only cited when
actually confident the ID is correct, left blank rather than guessed otherwise. Enforced by
`scripts/validate-content.mjs` the same way as the other two collections. Added
`src/pages/attacks/index.astro` and `[...slug].astro`, a nav link, and a homepage CTA (no full
listing on the homepage this time — 20 entries is too many for that treatment; the `/attacks/`
index page itself is the browse surface).

**Why:** The `domains/types-of-cyberattacks` reference page (previous batch) covered ~16 attack
types in table-row summaries. The user asked for every category — attack technique or vulnerability
class — to get its own full deep-dive page with a worked example, the same treatment SQL Injection
already got. Also expanded that reference table itself with several types it didn't originally
cover: drive-by downloads, watering hole attacks, cryptojacking, IoT-based attacks, advanced
persistent threats (APT), and rootkits — bringing it to 22 entries, sourced from general
industry-standard attack taxonomy, not any single external source.

**Also added:** Diagrams. Every new page (and, as a follow-up pass, the already-published pages)
gets one inline SVG process/flow diagram — theme-aware via `currentColor` and the site's existing
CSS custom properties, styled with a new shared `figure.diagram` class in `global.css`. Deliberately
*not* adding fabricated statistical charts (e.g. invented breach-cost percentages) — there's no real
dataset behind those, and inventing one would violate the evidence-grounding rule. A real mechanism
diagram is the honest version of "show the real thing" for content that has no real screenshot to
show (per the genericization rule, nothing here can be a real system's UI anyway).

**Split across collections:**
- `vulnerabilities` (new): Cross-Site Scripting (CWE-79) — a genuine code-level weakness, gets the
  standard 11-section vulnerability template like SQL Injection.
- `attacks` (new, 20 pages): Phishing, Business Email Compromise, Ransomware, Malware, Rootkit,
  Man-in-the-Middle, DDoS, Credential Stuffing, Brute Force, Social Engineering, Supply Chain Attack,
  Zero-Day Exploit, Insider Threat, DNS Spoofing, Session Hijacking, Drive-by Download, Watering Hole
  Attack, Cryptojacking, IoT-Based Attacks, Advanced Persistent Threat.

**Editorial Reviewer pass:** All 21 files checked for template compliance, vendor-name leakage,
fabricated statistics, and genericization — clean. Two schema bugs caught and fixed: 5 pages had a
`summary` field over the 200-character Zod limit (would have failed CI, not just a lint warning);
one fork wrote an unplanned `rootkit.md` on top of the one its sibling fork was separately assigned
to write (the two prompts overlapped by an example filename) — no data lost, the surviving file was
reviewed and is complete and on-template. Verified zero broken internal cross-links across all 31
published files with a script comparing every relative link against actual slugs. All flipped
`draft` → `published`.

**Design & Frontend Lead pass (same session, separate from content work):** Rebuilt the header into
a mega-menu nav — Domains grouped by category, Attacks and Vulnerabilities as flat indexes, all
pulled live from the collections via `getCollection` rather than hardcoded — open on desktop via
pure CSS `:hover`/`:focus-within` (no JS dependency), collapsing to a hamburger + slide-in panel
with per-item expand chevrons below 880px (small vanilla JS for the mobile toggle only). Rebuilt the
footer into a 4-column sitemap (brand blurb + Domains/Attacks/Vulnerabilities link columns). Added a
shared `.card`/`.card-grid` component system replacing the old stacked-list styling on the homepage
and all three index pages, a `.hero` treatment with a gradient wash and gradient hero-text accent,
and `.btn-primary`/`.btn-secondary` button styles. Homepage and index pages now render at a wider
1080px column (`wide` prop on `BaseLayout`); article/detail pages stay at the original 720px reading
width.

**Shipped live:** Pushed to `main`; GitHub Actions rebuilt and deployed automatically. 35 static
pages now live at https://abhis9102.github.io/synthreat/.

**Next:**
- A copyedit pass across all published content removing em-dash usage in favor of more
  conventional punctuation, per direct user feedback that the writing reads as AI-stylized. This
  needs real sentence-level rewriting (a blind find/replace would break grammar), planned as its own
  follow-up pass rather than bundled into this commit.
- Cross-link the new `attacks` pages into `vulnerabilities` and `domains` pages that predate them
  where relevant (e.g. `types-of-cyberattacks` domain page ↔ each attack page already links one
  direction; audit the reverse direction).
- Retrofit one diagram each onto the 10 pages published before this batch (SQL Injection + the 9
  original domain pages), per the same request that prompted diagrams on every new page this batch.

**Status:** drafted via parallel forks, editorial review and publish pending — see next entry once
that pass completes.

---

## 2026-09-18 — Domains section launched, site deployed live

**What happened (Content Architect):** Added a second content collection, `domains` (site path
`/domains/`), for pages broader than one vulnerability class — domain overviews, methodologies,
service models, and attack-landscape taxonomies. Defined its own 7-section locked template in
`CLAUDE.md` (What It Is / Why It Exists / How It Works / Where This Shows Up in Practice / Why a
Business Should Care / Common Misconceptions / Related Topics), enforced the same way as the
11-section vulnerability template — `scripts/validate-content.mjs` now checks both collections, and
CI fails a build missing a required section in either one. Added `src/pages/domains/index.astro`
and `[...slug].astro`, a `category` field (`Domain Overview` / `Methodology` / `Service Model` /
`Attack Landscape`), nav link, and a homepage section.

**Why:** The site's first content batch beyond SQL Injection is nine pages that don't fit the
vulnerability template — pentesting fundamentals, types of pentesting, application security, PTaaS,
AI red teaming, a cyberattack-types taxonomy, continuous threat exposure management, red teaming, and
cloud security. Per `CLAUDE.md`'s own rule, a new content type gets its template defined when the
first real batch of it is drafted, not guessed ahead of time — this is that moment.

**Decided:** Called the section "Domains" (not "Concepts" or "Foundations") — matches the mission
statement's own language about growing into named domains (application security, cloud, red team,
etc.), even though a few of the nine pages (PTaaS, CTEM) are service models/methodologies rather than
domains strictly. Accepted as a reasonable stretch rather than adding a third collection this early.

**Batch drafted (Subject-Matter Writer, via parallel forks; Editorial Reviewer pass by the
orchestrating session):**
- `what-is-penetration-testing` — Methodology
- `types-of-penetration-testing` — Methodology
- `penetration-testing-as-a-service` — Service Model
- `application-security` — Domain Overview
- `cloud-security` — Domain Overview
- `red-teaming` — Methodology
- `ai-red-teaming` — Methodology
- `continuous-threat-exposure-management` — Methodology
- `types-of-cyberattacks` — Attack Landscape

None of these reference any specific vendor, product, or third-party company by name — grounded
instead in named public standards (OWASP, NIST SP 800-115, MITRE ATT&CK, MITRE ATLAS, PTES, CSA, CIS
Controls, Gartner's CTEM framework) and generalized, invented-company worked examples, per the
genericization rule.

**Editorial Reviewer pass:** All nine read against the template (correct H2s, in order), fact-checked
against the named standards above, confirmed genericized, confirmed no vendor/platform names —
flipped from `draft` to `published`. `npm run validate:content` and `npm run build` both pass clean
(13 static pages generated); spot-checked via `astro preview` that the domains index, the taxonomy
table on `types-of-cyberattacks`, and internal cross-links all render correctly.

**Bug found and fixed during this pass:** `astro.config.mjs`'s `base` was set to `/synthreat`
(no trailing slash). Every internal link in the codebase is built as `` `${base}vulnerabilities/` ``
etc., so the missing slash silently produced broken paths like `/synthreatvulnerabilities/`
site-wide — pre-existing since the original scaffold commit, just never caught because there was
only ever one nav link to notice it on. Fixed to `/synthreat/`; rebuilt and confirmed every internal
link resolves correctly.

**Shipped live:** Pushed to `main` — GitHub Pages (already configured, workflow-based) rebuilds and
deploys automatically via `.github/workflows/deploy.yml` on every push to `main`. Live at
https://abhis9102.github.io/synthreat/.

**Next:** Cross-link these nine pages into the `vulnerabilities` collection's `Related Classes`
sections where relevant (e.g. `application-security` ↔ `sql-injection`) once both sides exist; keep
growing `vulnerabilities` toward the next OWASP Top 10 entries.

---

## 2026-09-16 — Project bootstrapped

**What happened:** Set up this folder as its own git repository and wrote `CLAUDE.md` — the project
charter defining mission, audience, the locked vulnerability-class content template, the role-based
team architecture, and the publish workflow.

**Why:** The project started as a single client-facing "pentest briefing" page
(`pentest-playbook` repo, still live, not part of this project). The owner decided to grow it into a
full, broad cybersecurity education portal — own repo, own charter, long-term/full-time scope,
eventually covering every security domain plus AI security.

**Decided:**
- Audience is dual, always: a newcomer learning the material for the first time, and someone who
  needs to translate it into a client/business conversation. Every page serves both.
- Vulnerability-class pages follow an 11-section locked template (see `CLAUDE.md`), with "why a
  business should care" as a first-class section, not an afterthought.
- Any content derived from real engagement work must be fully genericized before publishing — no
  exceptions.
- Team is organized by role (Content Architect, Subject-Matter Writer, Editorial/Quality Reviewer,
  Design & Frontend Lead, Media Producer, Project Tracker), one person plus Claude filling multiple
  roles deliberately rather than working in one undifferentiated mode.

**Open, not yet decided:**
- Project/site name.
- Tech stack — deliberately re-opened rather than inherited from the smaller `pentest-playbook`
  project, given the new scale (full-time, long-term, rich media, many domains).

**Next:**
- Resolve the two open decisions above.
- Pressure-test the locked content template by drafting one real vulnerability-class page in full —
  SQL Injection proposed as the first candidate (globally recognizable, clean business-impact story,
  OWASP A03 anchor, and rich real source material available to generalize from).
