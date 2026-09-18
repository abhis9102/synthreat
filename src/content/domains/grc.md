---
title: GRC (Governance, Risk & Compliance)
summary: The discipline of actually running a security program, setting policy, managing risk decisions, and proving compliance, distinct from any single named regulation.
category: Domain Overview
related: []
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

GRC stands for Governance, Risk, and Compliance: the organizational discipline of setting security
policy (governance), making informed decisions about which risks to accept, mitigate, or transfer
(risk management), and demonstrating adherence to relevant requirements (compliance). It is distinct
from any single named regulation (see [Compliance & Regulations](../../compliance/compliance-regulations/)
for the specific regimes) or any single named framework (see
[Frameworks & Standards](../../frameworks/frameworks-standards/) for the specific standards). GRC is
the connective program that decides which of those frameworks and regulations actually matter to a
given organization, and tracks whether it's actually meeting them.

## Why It Exists

Without a GRC function, "are we secure" and "are we compliant" become ad hoc, undocumented,
inconsistent answers that fall apart the moment a real auditor, regulator, or board member asks a
specific question. GRC exists to turn security into a managed, documented, defensible program
instead of a loose collection of good intentions and tribal knowledge held by whichever engineer
happens to remember why a decision was made.

## How It Works

GRC covers three connected activities:

- **Governance**: writing and maintaining the actual policies that define how security decisions
  get made, such as an acceptable use policy or an access control policy, and getting real
  leadership sign-off on them rather than letting them exist only as an unenforced document.
- **Risk management**: identifying risks, assessing their likelihood and impact, and making a
  documented decision for each one: accept it, mitigate it, transfer it (commonly via cyber
  insurance), or avoid it entirely. The goal isn't eliminating all risk, which is neither realistic
  nor affordable; it's making risk decisions consciously and on the record instead of by default.
- **Compliance**: mapping an organization's actual controls against whichever specific frameworks or
  regulations apply to it (cross-link [Frameworks & Standards](../../frameworks/frameworks-standards/)
  and [Compliance & Regulations](../../compliance/compliance-regulations/)), and maintaining the
  evidence an auditor will actually ask to see, rather than assembling it under pressure the week
  before an audit.

## Where This Shows Up in Practice

Larger organizations typically have a dedicated GRC function or named role owning this work.
Dedicated GRC platforms and tooling exist to track controls, policies, and evidence in one place
(described here generically; specific product choice is an implementation detail, not the point of
this page). The policy review and evidence-gathering work that precedes any compliance audit,
covered on the [Compliance & Regulations](../../compliance/compliance-regulations/) page's own
services section, is GRC work in practice.

## Why a Business Should Care

GRC is very often the actual function that decides how a technical security budget gets spent,
because it's where "what are we actually required to do, and what's our own risk tolerance beyond
that" gets decided before a single technical control is purchased. A client asking where to start
their security investment is often really asking a GRC question first, even if they don't use that
term.

## Common Misconceptions

**"GRC is just paperwork, not real security."** This is a costly misconception. An undocumented, ad
hoc risk decision is itself a real risk, especially the moment an auditor or a breach forces the
question "why was this allowed to continue." The paperwork is the evidence that a conscious decision
was made, not a substitute for making one.

**"Compliance and security are the same thing."** They aren't, the same distinction drawn on the
[Compliance & Regulations](../../compliance/compliance-regulations/) overview, and it's worth
repeating here specifically because GRC is where that confusion actually originates inside most
organizations: a compliant organization can still have real, unaddressed security gaps outside a
given regime's specific scope.

## Related Topics

- [Frameworks & Standards](../../frameworks/frameworks-standards/): the named standards a GRC
  program chooses to align against.
- [Compliance & Regulations](../../compliance/compliance-regulations/): the specific regimes a GRC
  program tracks and produces evidence for.
- [Continuous Threat Exposure Management](../../methodology/continuous-threat-exposure-management/):
  a continuous risk-prioritization cycle that GRC's own risk management function feeds into.
