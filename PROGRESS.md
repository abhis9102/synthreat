# Progress Log

Running log of what's shipped, what's next, and decisions made along the way. Newest entry on top.

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
