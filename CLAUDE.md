# CLAUDE.md

This file governs how work happens in this folder. It is this project's operating charter — read it
the way a new engineering/content hire would read a company handbook on day one.

# Project: Synthreat — a cybersecurity education portal

## Mission

A free, public website that teaches cybersecurity from first principles, grounded in real,
evidence-based engagement work rather than rehashed generic tutorials. It starts with penetration
testing fundamentals and vulnerability classes, and grows organically to cover the rest of the
field — application security, cloud, network, mobile, red team, blue team, GRC/compliance — and
eventually AI security, as its own dedicated domain once the core is solid.

This is a **full-time, ongoing development project**, not a one-off content drop. It is expected to
grow for a long time. Every decision below should be made with "does this still hold at 10x the
content" in mind, not just "does this work for the first page."

## Audience — the thing that makes this different

Two readers, same page, always:

1. **A newcomer** building genuine technical understanding of a topic for the first time.
2. **Someone who has to translate security into a client or business conversation** — a security
   sales engineer, a pre-sales consultant, anyone who needs to explain *why this matters* to a
   non-technical stakeholder without sounding like they're reading a script.

Almost nothing on the internet serves both well — technical content is written for engineers, business
content is written for executives, and the two rarely meet on the same page. That gap is this
project's actual value proposition. Every piece of content must serve both readers, not pick one and
gesture at the other.

## Non-negotiable content principles

- **Evidence-grounded, not generic.** Prefer a real, worked reasoning chain over a textbook
  definition-plus-payload. If we can't explain *why* something is true from real experience or a
  credible primary source, don't assert it as fact.
- **Business framing is a first-class section, not a footnote**, on every technical topic — see the
  locked content template below.
- **Real-engagement-derived material must be fully genericized before publishing.** Not "lightly
  redacted" — invented company name, no real domains/hostnames/credentials/data points/screenshots
  that could identify a real target, restructured so the *pattern* teaches the lesson without being
  traceable back to any real system we've tested. This applies even to material the project owner is
  personally authorized to reference. No exceptions, no "just this once." If a reviewer can't tell
  whether an example is genericized, treat it as not genericized and hold the page.
- **Never write from memory when a primary source exists.** Cite and link real standards (OWASP, CWE,
  CVSS, NIST) rather than reproducing them from recollection where accuracy matters.
- **Plain language over jargon-stacking.** If a newcomer has to look up three terms to parse a
  sentence, rewrite the sentence.
- **Show the real thing.** Diagrams, screenshots, GIFs, or short video belong wherever a written
  paragraph is doing the work an image would do better — a request/response flow, an attack chain, a
  UI walkthrough. Don't add media as decoration; add it where it replaces or clarifies prose.

## The locked content template — vulnerability-class pages

This is the core repeating unit. Every vulnerability-class page follows this structure, in this order.
Do not skip a section; write "not yet documented" rather than omit it, so gaps are visible in review.

1. **Definition** — one paragraph, no jargon-stacking.
2. **The trust boundary that breaks** — what's trusted, why the developer trusted it, why that
   assumption fails, what security property breaks as a result.
3. **Where it actually shows up** — real surface patterns (specific features, code shapes), not
   abstractions.
4. **Why it keeps happening** — the recurring developer mistake or framework-specific gotcha behind
   it.
5. **How to find it** — practical detection signals, black-box and white-box, at a level a newcomer
   can follow.
6. **Impact by scenario** — a table: this context → this realistic consequence. Never a single
   flat "this is critical" claim.
7. **Why a business should care** — real cost categories if exploited (breach cost, downtime,
   regulatory exposure, reputational harm), and how to raise this with a client without either
   fear-mongering or underselling it.
8. **A worked example** — a full, generalized reasoning chain end to end, in the same evidence-based
   voice as a real finding.
9. **Severity calibration** — how a real report would rate this specific instance, and why severity
   depends on demonstrated impact, not the vulnerability class alone.
10. **Remediation** — the real fix, and the common *bad* fix people ship instead.
11. **Related classes** — cross-links, so the site reads as a connected body of knowledge, not a pile
    of isolated pages.

Other content types (case studies, methodology playbooks, cheatsheets) get their own template, defined
when the first one of that type is actually drafted — not guessed in the abstract ahead of time.

## The locked content template — domain & concept pages

The second repeating unit, defined once the first batch of this type was actually drafted (see rule
above). This is for pages that explain a *domain* (application security, cloud security), a
*methodology* (penetration testing, red teaming, continuous threat exposure management), a *service
model* (penetration testing as a service), or an *attack landscape* (a taxonomy of attack types) —
anything broader than one vulnerability class, where the 11-section vulnerability template doesn't
fit because there's no single trust boundary or single remediation to anchor on. These pages live in
the `domains` content collection, at `/domains/`, separate from `/vulnerabilities/`.

Every domain/concept page follows this structure, in this order. Do not skip a section; write "not
yet documented" rather than omit it.

1. **What It Is** — plain-language definition, no jargon-stacking. Assume zero prior knowledge.
2. **Why It Exists** — the real-world problem or failure mode that makes this domain/methodology/
   service necessary. What goes wrong without it.
3. **How It Works** — the core mechanics, steps, or building blocks, at a level a newcomer can follow
   end to end. For a taxonomy-style page (e.g. attack types), this is where the reference table lives.
4. **Where This Shows Up in Practice** — concrete, real surface patterns: specific engagement types,
   tools, roles, or scenarios — not abstractions.
5. **Why a Business Should Care** — same non-negotiable rule as the vulnerability template: real cost/
   risk categories, and how to raise this with a client without fear-mongering or underselling it.
6. **Common Misconceptions** — the specific wrong ideas newcomers and clients actually carry into this
   topic, and what's true instead. This is the section that does the most work for the dual-audience
   mission — it's where a client-facing reader gets armed against the wrong question a prospect will
   actually ask.
7. **Related Topics** — cross-links to other domain pages and to specific vulnerability-class pages
   the topic connects to, so the site reads as one connected body of knowledge.

Case studies and cheatsheets that don't fit either template above still get their own template,
defined when the first one is actually drafted.

## Team architecture — roles, not headcount

One person (plus Claude) is doing this work, but the *roles* below are real and should be kept
separate even when the same person is filling more than one — each has a different job to be good at,
and blurring them is how quality erodes. Treat this the way `hackbot`'s own skill-based architecture
separates concerns (recon vs. exploitation vs. reporting): a named role with a defined responsibility,
invoked deliberately for that specific kind of work, not one undifferentiated "do everything" mode.

| Role | Owns | Does not own |
|---|---|---|
| **Content Architect** | Site map, how topics relate and link, learning-path sequencing, the backlog of what gets written next | Drafting page prose |
| **Subject-Matter Writer** | Drafting individual pages against the locked template | Deciding what gets written next, or final sign-off on accuracy |
| **Editorial/Quality Reviewer** | Checking every page against the template, fact-checking technical claims, enforcing the genericization rule before anything publishes | Drafting content |
| **Design & Frontend Lead** | Visual system, reusable page components, responsive and accessible layout | Content accuracy |
| **Media Producer** | Diagrams, screenshots, GIFs, short video, wherever the content needs them | Page copy |
| **Project Tracker** | Maintains the roadmap and a running status log; sequences batches of work | Making content or design decisions |

In practice: a single Claude session can adopt any one role for a given task by name (e.g. "acting as
Subject-Matter Writer, draft X against the template"), and a larger batch of same-role work (e.g.
"draft the first 10 vulnerability pages") is a good candidate for a background fork or dedicated
subagent running under that one role, so its raw drafting output doesn't flood the main session's
context. The Reviewer role should be a genuinely separate pass — never the same pass that drafted the
content, even when it's the same session doing both roles sequentially.

## Workflow

1. **Content Architect** proposes or updates the site map and backlog.
2. **Project Tracker** sequences the next batch and logs it in `PROGRESS.md`.
3. **Subject-Matter Writer** drafts against the locked template.
4. **Editorial/Quality Reviewer** checks the draft — template completeness, technical accuracy,
   genericization compliance — before anything is marked ready to publish.
5. **Design & Frontend Lead** / **Media Producer** pass, if the page needs a new component or visual
   asset beyond what already exists.
6. Publish, and log the outcome in `PROGRESS.md` — what shipped, what's next, any decision made along
   the way and why. Treat `PROGRESS.md` as a living document, the same way this file is.

## Tech stack

**Astro**, static output, deployed to GitHub Pages via a GitHub Actions build.

- Content lives as Markdown/MDX with typed frontmatter (Zod content-collection schemas) — the
  locked 11-section vulnerability-class template gets enforced structurally: a page missing a
  required section fails the build instead of silently shipping incomplete.
- Ships fully static HTML by default (fast, no client-side framework tax for a page that's
  fundamentally an article).
- Interactive components (a severity calculator, a quiz, search) can be added later as isolated
  Astro islands without a stack change — deliberately chosen over Eleventy/Jekyll for this reason.
- Built-in image optimization covers the "rich media" requirement without a separate pipeline.

## Repository & deployment

- This folder is its own git repository, separate from any single client engagement's working
  directory.
- Lives in its own public GitHub repo — `synthreat` — deployed via GitHub Pages, built by a GitHub
  Actions workflow (Astro's static output isn't natively built by GitHub's own Jekyll pipeline the
  way `pentest-playbook`'s plain HTML is).

## Astro operational notes

- Local Node must be 22.12+ — the system-wide `node` in this sandbox is older (v20); a user-local
  Node 22 install lives at `~/.local/node22/bin`. Prepend that to `PATH` before running any `npm`/
  `astro` command in this project: `export PATH="$HOME/.local/node22/bin:$PATH"`.
- `npm run dev` — local dev server. Prefer starting it in the background
  (`astro dev --background`, managed via `astro dev stop` / `astro dev status` / `astro dev logs`)
  rather than a foreground process, matching Astro's own guidance for agent-driven work.
- `npm run build` — static output to `dist/`, mirrors exactly what GitHub Actions builds and deploys.
- Content, routing, and styling all go through Astro's own conventions — consult
  [docs.astro.build](https://docs.astro.build) before improvising a pattern, specifically the guides
  on [content collections](https://docs.astro.build/en/guides/content-collections/) (this is where
  the locked vulnerability-class template gets encoded as an enforced schema),
  [routing](https://docs.astro.build/en/guides/routing/), and
  [styling](https://docs.astro.build/en/guides/styling/).
- Deployment is GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`), not GitHub's native
  Jekyll pipeline — Astro's static output needs an actual build step. `astro.config.mjs` sets
  `site`/`base` for the `github.io/synthreat` path; update both together if a custom domain is ever
  added.

## Working notes for whoever (human or Claude) picks this up next

- Read `PROGRESS.md` before starting anything, to pick up where the project actually is, not where
  this charter assumed it would be.
- If a decision in this file stops matching reality (a role isn't working the way it's described, the
  template needs an twelfth section, etc.), update this file in the same commit that changes the
  behavior — this document drifting out of sync with practice is worse than not having it.
