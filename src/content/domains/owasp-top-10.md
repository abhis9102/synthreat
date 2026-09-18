---
title: The OWASP Top 10
summary: What the OWASP Top 10 actually is, how it gets built from real data, and how to use it without treating it as a complete checklist.
category: Framework & Standard
related: ["frameworks-standards", "sans-top-25"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

The OWASP Top 10 is a periodically updated, community-driven awareness document listing the most
critical web application security risk categories, published by the OWASP Foundation, a nonprofit
focused specifically on application security. It has had several editions over the years (notably
2017 and 2021, with periodic updates since), and the specific list changes as the underlying data
changes. Nothing about the current edition should be treated as a fixed, permanent ranking.

## Why It Exists

Before a shared, evidence-based list existed, "web application security" meant something different
to every team that claimed to take it seriously. OWASP built the Top 10 from real-world vulnerability
data and a practitioner survey specifically to ground prioritization in evidence rather than
individual opinion, so that "our app is secure" could mean something checkable against a common
reference point.

## How It Works

The ten categories, described here in plain language rather than quoted verbatim from any specific
edition, cover: broken access control (a user reaching data or actions they shouldn't be able to,
see [Broken Access Control](../../vulnerabilities/broken-access-control/)); cryptographic failures
(sensitive data left exposed through weak or missing encryption, see
[Cryptographic Failures](../../vulnerabilities/cryptographic-failures/)); injection (untrusted input
crossing a boundary it should never cross, covered on this site through
[SQL Injection](../../vulnerabilities/sql-injection/) and
[Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/)); insecure design (a security gap
baked into the architecture itself rather than a single coding mistake, see
[Insecure Design](../../vulnerabilities/insecure-design/)); security misconfiguration (an unsafe
default or an unnecessary feature left enabled, see
[Security Misconfiguration](../../vulnerabilities/security-misconfiguration/)); vulnerable and
outdated components (a known flaw in a dependency the application relies on, see
[Vulnerable and Outdated Components](../../vulnerabilities/vulnerable-outdated-components/));
authentication failures (weaknesses in how identity itself is verified, see
[Authentication Failures](../../vulnerabilities/authentication-failures/)); software and data
integrity failures (trusting something, a package, an update, a piece of serialized data, that
wasn't actually verified, see
[Software and Data Integrity Failures](../../vulnerabilities/software-data-integrity-failures/));
security logging and monitoring failures (an incident nobody notices because nothing was watching,
see [Logging and Monitoring Failures](../../vulnerabilities/logging-monitoring-failures/)); and
server-side request forgery (tricking a server into making a request on the attacker's behalf, see
[SSRF](../../vulnerabilities/ssrf/)).

The methodology behind the list is worth knowing, because it's the actual source of its credibility.
Categories are built from a combination of aggregated real vulnerability testing data, contributed
by organizations across the industry, and a survey of practicing application security professionals.
It isn't one company's marketing list; it's a synthesis of evidence from many sources.

## Where This Shows Up in Practice

The OWASP Top 10 is used as a developer security training curriculum in many engineering
organizations, referenced explicitly within some compliance frameworks and security questionnaires
as a required testing baseline, and used as the starting scope for a large share of web application
penetration tests.

## Why a Business Should Care

For a client-facing security person, the OWASP Top 10 is one of the most recognizable and credible
shorthand references available, precisely because it's independently maintained and grounded in
evidence rather than produced by any single vendor. Being fluent in what each category actually
means, not just able to recite ten names, is what separates someone who can hold a real technical
conversation about it from someone who memorized a list.

## Common Misconceptions

**"Passing an OWASP Top 10 scan means the application is secure."** It means ten specific risk
categories were checked. It says nothing about business-logic flaws or anything else outside those
ten categories, which is why so many serious real-world findings fall outside the list entirely.

**"The OWASP Top 10 is a testing tool."** It's a risk-category reference, not a tool itself. Actual
scanners and manual testers use it as an input to what they check for; the list doesn't test
anything on its own.

## Related Topics

- [Cybersecurity Frameworks & Standards](../frameworks-standards/): the overview this page sits
  under.
- [The SANS/CWE Top 25](../sans-top-25/): the closest comparison point, and how the two lists differ
  in scope.
