---
title: GDPR (General Data Protection Regulation)
summary: Who the EU's data protection law actually applies to, what it requires from a security standpoint, and how it differs from a generic privacy policy.
category: Compliance & Regulation
related: ["compliance-regulations", "dpdp-act"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

The General Data Protection Regulation, GDPR, is a European Union law governing how personal data
belonging to people in the EU is collected, processed, and protected. This page explains its
security-relevant shape for general education. It is not legal advice, and any business trying to
determine its actual obligations under GDPR should consult qualified legal counsel.

## Why It Exists

Before GDPR, data protection rules varied significantly across EU member states, and individuals had
inconsistent, often limited, enforceable rights over their own data. GDPR harmonized the rules across
the EU and gave individuals a concrete, enforceable set of rights over data collected about them,
backed by real regulatory teeth.

## How It Works

The single most important thing to understand about GDPR's scope: it applies based on **whose data
is being processed**, not where the processing company happens to be located. A company with no EU
office at all is still in scope the moment it collects or processes personal data belonging to
people in the EU. This is the detail that catches the most businesses off guard.

From there, the security-relevant requirements break down into a few core pieces:

1. **A documented lawful basis for processing.** Every use of personal data needs an identifiable,
   documented reason that GDPR actually recognizes (consent, a contractual necessity, a legal
   obligation, among others), not just an assumption that collecting data is fine by default.
2. **Individual rights.** People whose data is held have the right to access it, correct it, delete
   it (the "right to be forgotten"), and receive a portable copy of it. A system that can't actually
   locate and act on a specific person's data on request is a real compliance gap, not a paperwork
   one.
3. **Breach notification.** Organizations must notify the relevant supervisory authority of a
   qualifying breach within a short window, commonly cited as 72 hours of becoming aware of it, and
   in some cases notify the affected individuals directly.
4. **A Data Protection Officer in certain circumstances.** Required for organizations engaged in
   large-scale processing of personal data, or processing certain especially sensitive categories of
   data, even if the organization itself is otherwise small.

Penalties are tiered and scaled to revenue, structured to be a genuine board-level concern rather
than a minor cost of doing business. The exact figures are stated in the regulation itself as a
maximum framework; what actually gets assessed in a real case depends heavily on the specifics, so
treat any number you see quoted as the ceiling of a range, not a guaranteed outcome.

## Where This Shows Up in Practice

Any company with EU customers, or simply EU website visitors whose data gets collected through
analytics or forms, needs to think about GDPR, even a small US-based company with no EU presence at
all. It also shows up in data processing agreements: contracts specifically governing how a company's
vendors are allowed to handle any EU personal data that passes through them.

## Why a Business Should Care

GDPR is frequently the first compliance regime a growing company runs into, often well before that
company thinks of itself as having any real connection to Europe at all. The applicability trigger
(whose data, not where the company is) is the single most important thing to get across to a client
early, since it's exactly the detail that gets missed until it's already a problem.

## Common Misconceptions

**"GDPR only applies to companies based in the EU."** False. Applicability follows whose data is
being processed, not where the company processing it operates from.

**"A cookie banner is GDPR compliance."** False. A cookie consent banner is one visible piece of a
much broader set of obligations covering lawful basis, security safeguards, and individual data
rights. Having a banner says nothing about whether the rest of those obligations are actually met.

This page describes GDPR's general security-relevant shape for educational purposes only. It is not
legal advice; consult qualified legal counsel to determine actual compliance obligations.

## Related Topics

- [Cybersecurity Compliance & Regulations](../compliance-regulations/): the full map this page is
  one entry in.
- [India's DPDP Act](../dpdp-act/): a comparable data protection law in a different jurisdiction,
  worth comparing for the pattern it shares with GDPR.
