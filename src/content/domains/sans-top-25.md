---
title: The SANS/CWE Top 25
summary: How the SANS Top 25 differs from the OWASP Top 10, why it's built directly from real vulnerability and exploit data, and when to reach for one list over the other.
category: Framework & Standard
related: ["frameworks-standards", "owasp-top-10"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

The SANS/CWE Top 25 is a periodically published list of the 25 most dangerous software weaknesses,
built directly on top of the CWE (Common Weakness Enumeration) catalog and promoted under the SANS
Institute's name. It ranks specific, code-level weakness types rather than broader risk categories.

## Why It Exists

The OWASP Top 10 is scoped specifically to web applications. Software weaknesses exist everywhere:
embedded systems, desktop software, operating systems, firmware. A broader list, grounded directly
in the CWE system and not limited to any one type of application, fills that gap.

## How It Works

Candidate weaknesses are scored using real-world data: specifically, how frequently and how
severely each individual CWE-catalogued weakness has actually been associated with disclosed
vulnerabilities and known exploitation. That produces a data-driven ranking, not a subjective one
based on which flaws sound the scariest.

The distinction from the OWASP Top 10 is worth being precise about. The SANS/CWE Top 25 operates at
the level of specific coding weaknesses, individual CWE entries, code-level and exact, across all
software. The OWASP Top 10 operates one level up, at the level of risk *categories* scoped to web
applications specifically, several of which each contain multiple individual CWEs underneath them.
A handful of weakness types tend to recur across editions of this kind of list: out-of-bounds writes,
cross-site scripting-type flaws, and SQL injection-type flaws are common recurring examples, though
the exact current ranking changes as new data comes in and shouldn't be treated as fixed.

## Where This Shows Up in Practice

Software vendors and code-review tooling commonly use this list as a prioritization reference for
what to fix first across a large, established codebase. It's also referenced in secure-coding
training programs covering languages and domains that fall outside web development entirely.

## Why a Business Should Care

This list matters most for organizations building anything beyond a pure web application: embedded
devices, desktop software, firmware. In those contexts, OWASP's web-specific framing doesn't fully
apply, and knowing to reach for the SANS/CWE Top 25 instead is a real credibility signal in a
technical conversation with that kind of client.

## Common Misconceptions

**"SANS Top 25 and OWASP Top 10 are competing standards, so pick one."** They're scoped differently,
not competing. A mature security program references both where each one actually applies rather
than treating them as mutually exclusive.

**"The ranking is a strict severity order that never changes."** It changes as new vulnerability and
exploitation data comes in, and gets republished periodically. Treat any specific position on the
list as a snapshot, not a permanent fact.

## Related Topics

- [Cybersecurity Frameworks & Standards](../frameworks-standards/): the overview this page sits
  under.
- [The OWASP Top 10](../owasp-top-10/): the web-application-specific counterpart to this broader,
  code-level list.
