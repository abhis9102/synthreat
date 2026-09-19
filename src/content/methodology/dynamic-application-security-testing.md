---
title: Dynamic Application Security Testing (DAST)
summary: How DAST tools test a running application from the outside the way an attacker would, the real tools used, and why it catches a different set of flaws than reading source code ever could.
related: ["application-security", "static-application-security-testing", "what-is-penetration-testing"]
relatedVulnerabilities: ["cross-site-scripting", "ssrf", "security-misconfiguration"]
status: published
datePublished: 2026-09-19
---

## What It Is

DAST is automated testing that probes a running application from the outside, the same vantage point
an actual attacker has: sending it real HTTP requests and inspecting the real responses that come
back, with no visibility into the application's own source code. It's the "black-box" counterpart to
[SAST](../static-application-security-testing/)'s source-code analysis, and because it interacts with
a live, fully assembled system, it catches a category of flaw that only exists once multiple pieces
of code are actually running together, something no amount of reading isolated source files can
reveal.

## Why It Exists

Some vulnerabilities are invisible in source code no matter how carefully it's read, because the flaw
isn't in any single file, it's in how the deployed system actually behaves under a real request: a
missing security header, a misconfigured server response, a reflected input that isn't dangerous in
the code that renders it but becomes dangerous once combined with how a specific browser parses the
response. DAST exists to test the actual, running artifact a user or attacker interacts with, not the
source code that produced it.

## How It Works

A DAST scanner crawls an application's exposed pages and endpoints the way a real user or attacker
would, then systematically sends each input field and parameter a battery of test payloads, checking
the actual response for signs the payload succeeded: an error message that leaks a stack trace, a
script tag that gets reflected back unescaped, a response time that suggests a database query was
manipulated. Because it has no access to source code, its testing is entirely black-box: it can only
find what it can actually reach and observe through the application's own responses.

Real tools in active use: **OWASP ZAP** is the most widely used free, open-source DAST scanner and a
common starting point for teams building their first automated dynamic testing; **Burp Suite**,
primarily known as a manual testing proxy (see [WebApp Penetration
Testing](../webapp-penetration-testing/)), also ships an automated scanning mode used the same way;
and commercial platforms like **Invicti** (formerly Netsparker) and **Acunetix** are common in larger
organizations that need to schedule and track scans across many applications at once.

## Where This Shows Up in Practice

DAST is commonly scheduled to run against a staging or pre-production environment, since it sends
real, potentially disruptive traffic, unlike SAST's static, read-only analysis, and running it against
production risks the same kind of disruption an uncontrolled real attack would cause. It's frequently
paired with SAST in a mature AppSec pipeline specifically because the two techniques cover almost
entirely non-overlapping ground: SAST reads what the code says, DAST tests what the deployed system
actually does.

## Why a Business Should Care

DAST findings come with a specific credibility advantage a SAST finding often doesn't: because DAST
interacts with the actual running application the same way a real attacker would, a DAST-confirmed
finding is closer to demonstrated impact, not just a suspicious pattern in source code that might
never actually be reachable. That distinction matters directly when prioritizing a fix: a
DAST-confirmed, externally reachable flaw is a different urgency than a SAST-flagged pattern buried
behind three layers of internal-only code that may never actually execute with attacker-controlled
input.

## Common Misconceptions

**"DAST replaces the need for a human penetration tester."** A DAST scanner tests known payload
patterns against every input, systematically and at scale, but it can't reason about business logic,
can't chain a low-severity finding on one endpoint with a different low-severity finding on another to
prove a serious combined impact, and can't judge whether a given data exposure actually matters in
context. See [Automated Tooling vs. Manual
Testing](../what-is-penetration-testing/#automated-tooling-vs-manual-testing) for the fuller
distinction.

**"If SAST already passed, DAST is redundant."** The two techniques test fundamentally different
things, source code versus a live running system, and structurally can't substitute for each other; a
mature AppSec program runs both because each is blind to what the other catches.

## Related Topics

- [Application Security](../../domains/application-security/): the broader practice DAST is one
  automated pillar of.
- [Static Application Security Testing (SAST)](../static-application-security-testing/): the
  complementary source-code technique.
- [What Is Penetration Testing?](../what-is-penetration-testing/): the human-driven testing discipline
  DAST's automated scanning is often confused with.
- [WebApp Penetration Testing](../webapp-penetration-testing/): the dedicated manual engagement type
  that goes further than DAST's automated payload testing.
- [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/): a representative example of the
  runtime-only flaw class DAST is built to catch.
