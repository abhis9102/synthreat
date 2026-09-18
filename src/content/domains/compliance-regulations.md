---
title: Cybersecurity Compliance & Regulations
summary: A working map of the major compliance regimes a business might face, who each applies to, what it requires, and the services a security practice offers to help meet them.
category: Compliance & Regulation
related: ["gdpr", "hipaa", "pci-dss", "soc-2", "iso-27001", "dpdp-act"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

This page is a map, not the territory. It exists to answer one practical question fast: given what
a business actually does, which compliance regime applies to it, and what does that regime broadly
require. Every row below links to its own full page with the real detail. Read this page first to
figure out which of those pages you actually need.

It helps to sort compliance regimes into three different kinds, since beginners (and plenty of
experienced people) conflate them:

1. **Laws and regulations.** Government-enforced, not optional if you're in scope. GDPR, HIPAA, and
   India's DPDP Act all fall here.
2. **Contractual/industry standards.** Not government law, but effectively mandatory for anyone who
   wants to participate in a specific industry. PCI-DSS is the clearest example: no government
   passed it, but you cannot process card payments without meeting it.
3. **Voluntary certifications.** Not legally required at all, but often required by customers or
   partners as a condition of doing business. SOC 2 and ISO/IEC 27001 both fall here.

None of the six regimes below should be confused with a prioritization *framework* like the NIST
Cybersecurity Framework or the OWASP Top 10, covered on [Security Frameworks & Standards](../frameworks-standards/).
A framework tells you how to think about and rank security work. A compliance regime tells you what
you're legally or contractually obligated to do, whether or not you'd have prioritized it yourself.

## Why It Exists

Without a working map, a compliance conversation with a client tends to turn into anxious hand-waving
about "regulations" in the abstract. In practice, which regime actually applies to a given business
is a very answerable question, based on concrete facts: what kind of data you handle, whose data it
is, what industry you're in, and who you sell to. This page exists to make that question answerable
in minutes instead of hours.

## How It Works

| Regime | Type | Who It Applies To | What It Broadly Requires |
|---|---|---|---|
| [GDPR](../gdpr/) | Law (EU) | Anyone processing personal data of people in the EU, regardless of where the company itself is based | Lawful basis for processing, individual data rights, breach notification, security safeguards |
| [HIPAA](../hipaa/) | Law (US) | Healthcare providers, health plans, and any vendor ("business associate") handling health data on their behalf | Administrative, physical, and technical safeguards for protected health information |
| [PCI-DSS](../pci-dss/) | Industry standard | Anyone storing, processing, or transmitting payment card data | A defined set of technical and operational controls, validated through regular assessment |
| [SOC 2](../soc-2/) | Voluntary certification | Mostly B2B SaaS companies, increasingly required by enterprise customers during vendor due diligence | An independent auditor's report on security, availability, and related controls over time |
| [ISO/IEC 27001](../iso-27001/) | Voluntary certification | Any organization wanting internationally recognized proof of a working information security program | A certified information security management system, assessed on an ongoing cycle |
| [DPDP Act](../dpdp-act/) | Law (India) | Anyone processing digital personal data of individuals in India | Consent-based processing, individual rights, and security safeguards for personal data |

**The compliance-related services a security practice actually offers**, since "compliance" isn't
just paperwork:

- **Gap assessments.** Comparing an organization's current state against a specific regime's actual
  requirements before a real audit happens, so surprises get found on your own terms.
- **Readiness and pre-audit assessments.** A dry run of the real audit, close enough to it that the
  actual audit stops being a source of genuine uncertainty.
- **The specific security testing several regimes require as evidence.** PCI-DSS explicitly requires
  regular penetration testing and vulnerability scanning as part of meeting the standard; see
  [What Is Penetration Testing?](../what-is-penetration-testing/) and
  [Penetration Testing as a Service](../penetration-testing-as-a-service/) for what that testing
  actually looks like.
- **Policy and documentation review.** Most of these regimes require written policies, not just
  technical controls, and a surprising share of audit findings come from documentation gaps rather
  than technical ones.
- **Ongoing advisory support between audits.** Treating compliance as a continuous state rather than
  a once-a-year event is exactly the mindset behind
  [Continuous Threat Exposure Management](../continuous-threat-exposure-management/), and it applies
  just as well to staying compliant as it does to staying secure.

## Where This Shows Up in Practice

A company expanding sales into the EU suddenly discovers GDPR applies to it, even though it never
needed to think about EU law before. A healthcare startup realizes HIPAA applies the moment it starts
storing real patient records, even as a small business associate rather than a hospital. A growing
SaaS company loses a large enterprise deal specifically because it can't produce a SOC 2 report on
request, not because its product was actually insecure.

## Why a Business Should Care

Compliance is very often the concrete, specific reason a security budget exists at all for a given
organization, not an abstract appeal to "best practice." Knowing precisely which regime actually
applies to a business, and just as importantly which ones don't, is directly actionable. It turns a
vague anxiety about "regulations" into a short, specific list of real obligations, which is a far
more useful thing to bring into a client conversation than a general sense of unease.

## Common Misconceptions

**"We're too small to need to worry about this."** False for several of the regimes above. GDPR and
HIPAA apply based on what data is handled and whose it is, not company size. A five-person startup
processing EU customer data or touching real patient records is in scope, full stop.

**"Being secure and being compliant are the same thing."** False, and worth stating plainly to a
client. Compliance is a documented, auditable floor, not a ceiling. An organization can pass an audit
and still carry real security gaps outside that specific regime's scope, and in the short window
before an audit catches up, an organization can also have real security gaps that simply haven't
been flagged as compliance failures yet.

This page explains the general security-relevant shape of each regime for educational purposes. It
is not legal advice, and a business should consult qualified legal counsel to determine its actual
compliance obligations.

## Related Topics

- [GDPR](../gdpr/), [HIPAA](../hipaa/), [PCI-DSS](../pci-dss/), [SOC 2](../soc-2/),
  [ISO/IEC 27001](../iso-27001/), and [India's DPDP Act](../dpdp-act/): the six dedicated pages this
  overview links out to.
- [Security Frameworks & Standards](../frameworks-standards/): the prioritization frameworks these
  compliance regimes are often confused with, but aren't.
