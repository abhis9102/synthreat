# Progress Log

Running log of what's shipped, what's next, and decisions made along the way. Newest entry on top.

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
