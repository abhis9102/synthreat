---
title: Cybersecurity Frameworks & Standards
summary: A map of the major frameworks referenced across this site, what problem each one actually solves, and how they relate to each other.
category: Framework & Standard
related: ["owasp-top-10", "sans-top-25", "ai-llm-top-10", "nist-cybersecurity-framework", "cis-controls"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

This page is a map, not the territory. Every row in the table below is a named framework or
standard referenced elsewhere on this site, and every one of them has its own full page covering
what it actually says, how it's used, and what it's for. This page exists so a newcomer or a
client-facing reader can see, at a glance, how these frequently name-dropped terms relate to each
other, before diving into any single one.

## Why It Exists

Without a shared vocabulary of named frameworks, every organization ends up building its own ad hoc
list of "things we should probably do." That makes real progress hard to compare across companies,
hard to audit against a consistent standard, and hard to explain to a client or a board in terms
they can actually verify. Named, publicly maintained frameworks solve that: they give everyone
involved, the security team, the client, the auditor, the same reference point.

## How It Works

| Framework | What Kind of Thing It Is | What Problem It Solves | Who Maintains It |
|---|---|---|---|
| [OWASP Top 10](../owasp-top-10/) | A prioritized list of web application risk categories | Tells a development team what to worry about first in their own code | The OWASP Foundation |
| [SANS/CWE Top 25](../sans-top-25/) | A prioritized list of the most dangerous software weaknesses, across all software, not just web apps | Fills the gap OWASP leaves for embedded, desktop, and non-web software | A community-driven CWE process, promoted by the SANS Institute |
| [OWASP Top 10 for LLM Applications](../ai-llm-top-10/) | An AI-specific risk list | Names the failure modes unique to systems built around a language model | The OWASP Foundation |
| [NIST Cybersecurity Framework](../nist-cybersecurity-framework/) | A voluntary, high-level organizational risk-management framework, not a checklist | Gives a whole security program a common structure to organize around | The U.S. National Institute of Standards and Technology |
| [CIS Controls](../cis-controls/) | A prioritized, actionable catalog of specific technical safeguards | Turns "we should be more secure" into a concrete, ordered implementation list | The Center for Internet Security |

Two other names show up constantly elsewhere on this site and are worth placing on this map even
though they don't get their own row here: MITRE ATT&CK, a taxonomy of real adversary tactics and
techniques covered in depth on the [Red Teaming](../red-teaming/) page, and PTES, the Penetration
Testing Execution Standard, covered on the [What Is Penetration Testing?](../what-is-penetration-testing/)
page.

The distinction that actually matters, and the one beginners and clients most often blur together,
is what *kind* of thing each entry is. A **prioritization list** (OWASP Top 10, SANS/CWE Top 25, the
AI Top 10) names the most common or dangerous specific risk categories in a given domain. A
**management framework** (NIST CSF) gives structure to an entire program rather than naming specific
risks. A **control catalog** (CIS Controls) is a concrete, actionable list of things to actually
implement. None of these four is a **compliance regime**, a legal or contractual requirement with
real penalties for failing it. That's a genuinely different category, covered on its own
[Cybersecurity Compliance & Regulations](../compliance-regulations/) overview page.

## Where This Shows Up in Practice

Developer security training curricula are commonly built directly around the OWASP Top 10. Security
questionnaires and RFPs frequently ask, almost verbatim, "do you follow the NIST Cybersecurity
Framework." Smaller organizations without the resources to build a fully custom security program
often adopt CIS Controls as a practical starting baseline, since it's written to be implemented
directly rather than interpreted.

## Why a Business Should Care

Clients and prospects use these names loosely and often interchangeably, which means the first job
in a conversation is frequently untangling what they actually mean. Knowing precisely which
framework someone is asking about changes what evidence you need to produce: a control catalog
question wants a list of implemented safeguards, a management framework question wants a program
description, and a prioritization list question wants specific findings mapped to specific
categories. Being able to say, clearly, "that's a control catalog, not a compliance requirement" is
a small but genuinely useful clarifying move in a client conversation, and it signals real fluency
rather than name recognition alone.

## Common Misconceptions

**"These are all basically the same list."** They solve different problems, as the table above
shows: a prioritization list, a management framework, and a control catalog answer three different
questions, and treating them as interchangeable usually means picking the wrong one for the actual
need.

**"Following one of these guarantees compliance with a legal regulation."** A framework is not
automatically a compliance requirement. An organization can follow CIS Controls closely and still
be out of compliance with a specific regulation that has its own distinct legal requirements. See
the [Compliance & Regulations](../compliance-regulations/) overview for that separate category.

## Related Topics

- [The OWASP Top 10](../owasp-top-10/)
- [The SANS/CWE Top 25](../sans-top-25/)
- [The OWASP Top 10 for LLM Applications](../ai-llm-top-10/)
- [The NIST Cybersecurity Framework](../nist-cybersecurity-framework/)
- [CIS Controls](../cis-controls/)
- [Cybersecurity Compliance & Regulations](../compliance-regulations/): the related but distinct
  category of legal and contractual requirements, as opposed to voluntary frameworks.
