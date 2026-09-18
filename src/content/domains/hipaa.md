---
title: HIPAA (Health Insurance Portability and Accountability Act)
summary: Who counts as a covered entity or business associate under US health data law, and what the Security Rule actually requires in practice.
category: Compliance & Regulation
related: ["compliance-regulations"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

HIPAA is a US federal law governing the privacy and security of protected health information (PHI).
This page explains its security-relevant shape for general education. It is not legal advice, and a
business should consult qualified legal counsel to determine its actual obligations under it.

## Why It Exists

Health information is uniquely sensitive, and before HIPAA, the organizations handling it (from
hospitals to insurers to their many vendors) protected it with wildly inconsistent standards. HIPAA
set a legal floor that applies across all of them.

## How It Works

The part beginners most often get wrong is who's actually in scope. HIPAA covers two categories:

1. **Covered entities**, meaning healthcare providers, health plans, and healthcare clearinghouses:
   the organizations most people picture when they hear "HIPAA."
2. **Business associates**, meaning any vendor or partner who handles PHI on a covered entity's
   behalf. A software company building a patient portal, a cloud provider storing patient records,
   or a billing company processing claims are all business associates the moment real PHI passes
   through their systems, even though none of them are a hospital or a doctor's office themselves.

HIPAA is organized into a few main rules, and the security-relevant one deserves the most attention:

- **The Privacy Rule** governs how PHI can be used and disclosed in general.
- **The Security Rule** is the specific security-relevant piece: administrative, physical, and
  technical safeguards required to protect electronic PHI. In practice this covers things like
  access controls (who can actually reach patient data, and why), encryption of PHI at rest and in
  transit, audit logging of who accessed what and when, and workforce security training.
- **The Breach Notification Rule** sets obligations to notify affected individuals, and in many
  cases regulators, after a qualifying breach of unsecured PHI.

Enforcement is tiered by the degree of culpability, ranging from violations the organization
genuinely didn't know about, up through willful neglect that was never corrected, and penalties
scale accordingly. Exact dollar figures shift over time with regulatory updates, so treat any
specific number you encounter as illustrative of the scale involved, not a fixed, current ceiling.

## Where This Shows Up in Practice

Hospitals and clinics are the obvious case, but the business associate category is where most
software companies actually encounter HIPAA: a startup building a patient scheduling tool, a cloud
storage provider hosting medical records, or a billing platform processing insurance claims, all
become business associates the moment they touch real PHI, whether or not that was the plan going
in.

## Why a Business Should Care

Many software companies discover they're in scope for HIPAA only after they've already built a
product for the healthcare market, at which point retrofitting the Security Rule's required
safeguards (encryption, access controls, audit logging) is far more expensive than designing for
them from the outset. This is a genuinely useful thing to raise early with any client building
something that will touch health data, well before the product is finished.

## Common Misconceptions

**"HIPAA only applies to hospitals and doctors."** False. Business associates, meaning any vendor
touching real PHI on a covered entity's behalf, are squarely in scope, and this is where most
software companies actually get caught out.

**"Our cloud provider is HIPAA compliant, so we're covered."** False. A cloud provider offering a
HIPAA-eligible service is necessary but not sufficient. The customer is still responsible for
configuring and using that service in a compliant way, a division of responsibility similar in
spirit to the shared responsibility model discussed on [Cloud Security](../cloud-security/).

This page describes HIPAA's general security-relevant shape for educational purposes only. It is
not legal advice; consult qualified legal counsel to determine actual compliance obligations.

## Related Topics

- [Cybersecurity Compliance & Regulations](../compliance-regulations/): the full map this page is
  one entry in.
- [Cloud Security](../cloud-security/): the shared responsibility model that applies just as much to
  a HIPAA-eligible cloud service as it does to cloud security generally.
