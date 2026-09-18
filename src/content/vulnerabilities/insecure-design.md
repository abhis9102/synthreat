---
title: Insecure Design
category: "Design & Business Logic"
summary: Why a flaw that was never a coding bug, but a missing security control baked into the architecture from day one, cannot be patched the way an ordinary vulnerability can.
owasp: "A04:2021 – Insecure Design"
cwe: []
typicalSeverityCeiling: High
related: []
status: published
datePublished: 2026-09-18
---

## Definition

Insecure design is a missing security control in the architecture itself, one that was never present to begin with, rather than a flaw introduced by a coding mistake in an otherwise sound design. Even a completely correct, bug-free implementation of an insecure design is still insecure, because the design never accounted for how the feature could be abused in the first place.

A note on the `cwe` field above: it is intentionally empty. OWASP deliberately does not map this category to a narrow list of CWE identifiers the way most other Top 10 categories are mapped, precisely because it describes a design-phase gap rather than one implementable flaw type. Leaving it blank here follows the same rule this site applies everywhere: cite an identifier only when it is genuinely known, never invent one to look more authoritative.

## The Trust Boundary That Breaks

The assumption that fails is treating "this feature works correctly for a legitimate user" as a sufficient design goal, without asking the second, equally necessary question: what does a malicious user do with this exact same feature. A design review that only walks through the intended, happy-path use of a feature will never surface this class of gap, because nothing in that walkthrough is actually wrong. It only becomes visible once someone deliberately asks how the feature could be misused.

## Where It Actually Shows Up

- **Missing rate limiting by design**: a feature (password reset, account creation, a search endpoint) that has no throttling built into its architecture at all, not because a rate limiter was implemented incorrectly, but because nobody designed one in.
- **Business logic that assumes good faith**: a discount code system, a referral program, or a multi-step checkout flow designed only around the sequence a legitimate user is expected to follow, with no consideration of what happens if steps are skipped, repeated, or performed out of order.
- **Trust boundaries never drawn between roles**: a system designed with only one implicit user type in mind, later extended to support multiple privilege levels without ever revisiting whether the original design's assumptions still hold for the new, lower-trust role.
- **Security decisions deferred to "we'll add that later"**: features shipped with a placeholder or no security control at all, with the intention to revisit before the feature scales, revisited only after an incident forces the issue.

## Why It Keeps Happening

Threat modeling, when it happens at all, is often treated as an optional step that gets skipped under deadline pressure, precisely because skipping it produces no visible defect: the feature demonstrably works when tested the intended way. Unlike a coding bug, there is no failing test, no crash, and no scanner alert to catch a missing design consideration; the only way it surfaces is if someone specifically asks "how would I abuse this" before it ships, or an actual attacker asks that question after it does.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-insecure-design" style="width:100%;height:auto;">
<title id="diagram-title-insecure-design">A password reset feature works exactly as designed, and that design has no limit on guess attempts</title>
<defs>
<marker id="arrow-insecure-design" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Feature designed</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">for legitimate use</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-insecure-design)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">No abuse case</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">ever considered</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-insecure-design)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Built exactly</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">as designed</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-insecure-design)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Freely guessable,</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">no rate limit exists</text>
</svg>
<figcaption>No code here is wrong. The implementation matches the design perfectly; the design itself never included a limit.</figcaption>
</figure>

## How to Find It

Threat modeling and abuse-case testing, not a scanner, is what finds this class. A scanner checks implementation against known-bad patterns; it has nothing to compare against when the pattern is "a control that was never designed in." In practice: walk through each significant feature and ask, for every input and every state transition, what happens if a user does this the wrong number of times, in the wrong order, or with a value outside what a legitimate user would ever send. Contrast this directly with SQL Injection or Cross-Site Scripting, both of which a targeted technical test can usually surface directly; insecure design requires asking a different kind of question earlier in the process.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Missing rate limiting on a low-value, low-sensitivity feature | Nuisance-level abuse, generally recoverable without lasting harm |
| Missing rate limiting on password reset or account enumeration | Credential and account-takeover risk at scale, since the design itself permits unlimited automated attempts |
| Business logic flaw allowing a discount or promotion to be abused beyond its intended limit | Direct financial loss, scaled by how automatable the abuse is |
| A trust boundary never drawn between user roles, discovered after the platform scaled to multiple privilege levels | Systemic exposure across every feature that relied on the original, now-invalid, single-trust-level assumption |

## Why a Business Should Care

Insecure design findings tend to be more expensive to fix than an equivalent implementation bug, because the fix is often architectural rather than a small patch: adding a missing control after launch can mean reworking a flow that many other parts of the system already depend on. The useful thing to tell a client is that threat modeling during design is cheap relative to redesigning after the fact, and that a feature "working correctly" in testing is not the same claim as "this feature cannot be abused." Those are different questions, and only one of them gets asked by default.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real client, system, or data is referenced.)*

Meridian Financial's password reset flow, reviewed during an authorized assessment, sends a six-digit numeric code to the user's registered email and accepts that code on a confirmation page with no limit on the number of attempts and no expiry shorter than 24 hours. Every part of the flow works exactly as intended for a legitimate user who receives their code and enters it correctly on the first try.

Testing against a disposable test account shows the confirmation endpoint accepts an unlimited number of guesses with no lockout, no delay, and no CAPTCHA, meaning the full six-digit space (one million possible codes) is exhaustible by automated, scripted guessing well within the code's 24-hour validity window. The design never included a rate limit at all; there is no faulty rate limiter to find, because none was ever specified.

## Severity Calibration

This instance rates **High**: exploitable without any special access, targeting the account takeover path directly, but requiring sustained automated effort against a six-digit space rather than being instantaneous, and mitigated somewhat by the target needing to be a specific, chosen account rather than allowing trivial mass exploitation across the whole user base simultaneously. A shorter code space, or a longer validity window, would push this toward Critical; a design that additionally rate-limited by IP even without a full lockout would meaningfully reduce it. The design gap sets the ceiling; the specific parameters around it set where an instance actually lands.

## Remediation

The real fix is threat modeling during the design phase, before implementation begins, walking through abuse cases alongside legitimate use cases for every significant feature, and building in rate limiting, expiry, and anomaly detection as first-class design requirements rather than afterthoughts. For a design flaw already in production, the fix usually means revisiting the architecture, not just patching the specific abuse case a tester happened to find.

The common bad fix is patching only the exact scenario that was discovered and demonstrated, without addressing the underlying missing control. A team that adds a delay specifically to the password reset endpoint after this exact finding, without asking whether the same missing-rate-limit pattern exists on other endpoints designed the same way, will very likely find a near-identical gap reported again later, just somewhere else in the same codebase.

## Related Classes

- [Business Logic Vulnerabilities](../business-logic-vulnerabilities/): the closest sibling class on this site, a flaw within a specific feature's implemented workflow rather than a missing architectural control, but arising from the same class of gap in thinking through abuse cases before building.

*(Dedicated pages for other OWASP Top 10 categories are being added; links will go live once published.)*
