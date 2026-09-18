---
title: India's DPDP Act (Digital Personal Data Protection Act)
summary: How India's own data protection law compares to GDPR, who it applies to, and what it requires from a security standpoint.
related: ["compliance-regulations", "gdpr"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

India's Digital Personal Data Protection Act, usually shortened to the DPDP Act, is India's
principal law governing the processing of digital personal data belonging to individuals in India.
It establishes a consent-based framework for lawful data processing. This page explains its
security-relevant shape for education; it isn't a substitute for qualified legal advice.

## Why It Exists

India, like the EU before it, recognized the need for a dedicated legal framework giving individuals
enforceable rights over their own digital personal data as digital services scaled rapidly across
the country. As one of the world's largest populations of internet and mobile users, India had a
particularly large volume of personal data flowing through digital products with no single,
comprehensive law specifically governing how that data had to be handled. the Act closes that gap.
It also creates clear obligations for the organizations that process that data, referred to under
the Act as Data Fiduciaries, mirroring the "data controller" concept a reader familiar with GDPR
will already recognize even though the two laws use different terminology.

## How It Works

The Act applies to the processing of digital personal data of individuals located in India, and, in
a similar spirit to GDPR's extraterritorial reach, can apply to processing that happens outside
India if it relates to offering goods or services to individuals in India.

A few core concepts are worth knowing at a beginner level. Consent is the primary lawful basis for
processing, with a narrower set of defined "legitimate uses" as exceptions. Data Fiduciaries have an
obligation to implement reasonable security safeguards to prevent personal data breaches, and a
breach notification obligation to both affected individuals and the Data Protection Board of India.
Individuals hold rights broadly comparable to GDPR's, including access, correction, and erasure of
their own data.

Enforcement runs through the Data Protection Board of India, the dedicated body responsible for it,
with penalties that can be substantial and scale with the severity and nature of the violation.

Children's data receives specific additional protection under the Act, requiring verifiable parental
or guardian consent before processing a child's personal data, a provision that mirrors similar
protections found in other major privacy laws internationally. Data Fiduciaries handling
particularly sensitive categories of data, or operating at significant scale, may also be classified
as "Significant Data Fiduciaries" and face additional obligations, such as appointing a dedicated
data protection officer and undergoing periodic independent data audits, reflecting the greater risk
concentrated in organizations that hold data at that scale.

## Where This Shows Up in Practice

Any company, whether based in India or not, that processes personal data of individuals in India
through a digital product or service sits inside this Act's scope. It's particularly relevant for
global SaaS companies with an Indian user base who may not have previously distinguished
India-specific obligations from their broader global privacy program, and for consent flows and
account sign-up pages specifically, since the Act's consent requirements have direct, visible
implications for how a product collects and records that consent in the first place.

It also shows up in how a company structures its vendor and processor relationships. A Data
Fiduciary that shares personal data with a third-party processor (a cloud provider, an analytics
vendor, a customer support tool) remains responsible for how that processor handles the data, which
means contracts and due diligence with those third parties become part of the compliance picture,
not a separate concern handled purely by procurement.

## Why a Business Should Care

Businesses that already built a GDPR compliance program often assume it automatically covers India
too, which is a genuinely useful assumption to correct early. The two laws share a similar spirit:
consent-based processing, individual rights, breach notification. But they are legally distinct
regimes with their own specific obligations and their own enforcement body, and treating them as
identical is a real compliance gap.

For a security-focused conversation specifically, the breach notification obligation deserves its
own attention: it requires an organization to already have the technical capability to detect a
breach quickly and to know exactly what data was affected, which depends directly on having
adequate logging and monitoring in place well before any incident happens, not something that can be
built retroactively once a breach is already underway. A client building toward DPDP Act compliance
who hasn't invested in that visibility is setting up a legal obligation their technical environment
can't actually support yet.

## Common Misconceptions

**"If we're GDPR compliant, we're automatically compliant in India too."** As above: these are
distinct legal regimes, despite sharing similar underlying principles. Compliance with one doesn't
automatically satisfy the other.

**"This only matters for companies based in India."** It doesn't work that way. Applicability turns
on whose data is being processed and where those individuals are located, the same logic GDPR itself
uses.

## Related Topics

- [Cybersecurity Compliance & Regulations](../compliance-regulations/) for how the DPDP Act fits
  among the other major compliance regimes.
- [GDPR](../gdpr/), the closest comparison point, worth contrasting directly with this Act.
- [Continuous Threat Exposure Management](../../methodology/continuous-threat-exposure-management/), relevant to
  the ongoing detection capability the Act's breach notification obligation depends on.

*General security-education content, not legal or compliance advice. Work with qualified counsel for
an actual DPDP Act compliance determination.*
