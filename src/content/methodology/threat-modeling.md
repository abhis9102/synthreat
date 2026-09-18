---
title: Threat Modeling
summary: The structured practice of thinking through what could go wrong before a system is built, and why it catches a different category of flaw than testing ever will.
related: []
relatedVulnerabilities: ["insecure-design"]
status: published
datePublished: 2026-09-18
---

## What It Is

Threat modeling is a structured process, done during design, ideally before a single line of code
is written, for identifying what could actually go wrong with a system: what an attacker might want
from it, how they might realistically get it, and what should stop them. It's a thinking exercise,
not a tool and not a scan.

## Why It Exists

Penetration testing and vulnerability scanning both find flaws in something that already exists.
Threat modeling exists to catch a different category of problem entirely: a gap in the design
itself, before anything has been built to test in the first place. This page is the practical
companion to [Insecure Design](../../vulnerabilities/insecure-design/), which describes exactly what
happens when this step gets skipped: a feature that works perfectly for a legitimate user and is
simultaneously wide open for an attacker, because nobody asked the second question during design.

## How It Works

A structured threat model generally walks through three questions, in order:

1. **What are we actually building, and what matters about it?** Identifying the real assets: what
   data does this system hold, what actions can it take, and what would actually be bad if either
   were misused. This has to happen before threats can be identified, since "what could go wrong"
   is meaningless without first knowing what's actually at stake.
2. **What are the realistic threats against it?** STRIDE is a widely used mnemonic for walking
   through threat categories systematically rather than relying on whatever happens to come to mind:
   **S**poofing (pretending to be someone or something you're not), **T**ampering (altering data or
   code that shouldn't be alterable), **R**epudiation (denying an action was taken, with no way to
   prove otherwise), **I**nformation disclosure (exposing data to someone who shouldn't see it),
   **D**enial of service (making the system unavailable to legitimate users), and **E**levation of
   privilege (gaining more access than intended). Walking through each category against the specific
   system being built surfaces threats a purely open-ended "what could go wrong" discussion tends to
   miss.
3. **What actually mitigates each realistic threat, and is that mitigation actually planned?** Each
   identified threat gets a concrete answer: a specific control, an accepted and documented risk, or
   a design change, decided before building rather than discovered afterward.

This is usually run as a facilitated session with both security and engineering in the room, walking
through an actual design (a diagram, a data flow, a new feature) together, not a document one person
fills out alone after the fact.

## Where This Shows Up in Practice

A design review step inserted before a new feature or system is built, especially anything handling
sensitive data, money, or authentication, or anything introducing a genuinely new attack surface
(a new integration, a new public-facing endpoint, a new trust relationship with another system). It
shows up as a recurring habit on mature engineering teams, not a one-time audit: each significant new
feature gets a light version of the same three questions before design is finalized.

## Why a Business Should Care

Threat modeling sits at the single cheapest point on the entire cost-of-fixing-late curve discussed
on [Application Security](../../domains/application-security/): a design conversation costs a
meeting; the same gap found in production after a real incident costs an investigation, a fix under
pressure, and whatever the incident itself cost. For a client asking where security investment
actually pays off fastest, this is a genuinely strong, concrete answer, and it's also one of the
least expensive practices on this entire site to actually start doing.

## Common Misconceptions

**"Threat modeling is basically the same as a security code review."** False, and the distinction
matters. Code review examines what was actually built, after it exists, and can only ever find flaws
in code that's already written. Threat modeling examines what's about to be built, and catches a
category of flaw code review structurally cannot reach, because the flaw was never a coding mistake
in the first place: it was a missing decision. See
[Insecure Design](../../vulnerabilities/insecure-design/) for exactly what that looks like once it
ships.

**"This only matters for large, complex systems."** False. Even a small feature that touches
sensitive data or money benefits from a few minutes of structured "what could go wrong here" before
it's built. The size of the system doesn't change whether the three questions above are worth asking;
it only changes how long the session takes.

## Related Topics

- [Insecure Design](../../vulnerabilities/insecure-design/), the vulnerability class this practice
  exists specifically to prevent.
- [Application Security](../../domains/application-security/), the broader discipline threat
  modeling is one practice within.
