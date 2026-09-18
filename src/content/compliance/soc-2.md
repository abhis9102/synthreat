---
title: SOC 2
summary: Why SOC 2 is a voluntary attestation rather than a legal requirement, what it actually covers, and why B2B SaaS companies pursue it anyway.
related: ["compliance-regulations", "iso-27001"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

SOC 2 is an attestation report, based on the AICPA's Trust Services Criteria, produced by an
independent auditor who evaluates an organization's own controls. It is not a certification, and it
is not a legal requirement: it's a report a business commissions and then shares with customers and
partners as evidence of how it manages security.

## Why It Exists

B2B SaaS customers need a way to evaluate a vendor's security posture without personally auditing
every vendor they work with. Before a shared standard existed, a growing SaaS vendor could easily
find itself fielding a different, custom security questionnaire from every enterprise prospect's
procurement team, each one asking for similar evidence in a slightly different format, which is
expensive and slow for both sides. SOC 2 exists to let one independent audit satisfy many
customers' due diligence needs at once, so a vendor doesn't have to submit to a separate bespoke
security review for every deal, and a customer doesn't have to design and run its own audit process
for every vendor it evaluates.

## How It Works

The Trust Services Criteria cover five possible categories. Security is the mandatory baseline
category every SOC 2 report includes; availability, processing integrity, confidentiality, and
privacy are additional categories an organization can choose to include based on what's actually
relevant to the service it provides.

The distinction between a Type I and a Type II report matters, and beginners often conflate the two.
A Type I report evaluates whether an organization's controls are suitably designed at a single point
in time: a snapshot. A Type II report evaluates whether those same controls actually operated
effectively over a sustained period, commonly several months to a year. Type II is the one most
enterprise customers actually want to see, because it demonstrates sustained operation rather than a
design that only ever existed on paper.

A young company pursuing SOC 2 for the first time will often start with a Type I report, since it's
faster to obtain and gives an early signal to prospects while the organization builds the operating
history a Type II report requires. That's a reasonable sequencing decision, but it's worth setting
the expectation early with a client that a Type I report is a starting point, not the destination:
most serious enterprise buyers will eventually ask for Type II, and delaying that transition can
stall a deal at exactly the moment it matters most.

The audit itself is performed by a licensed CPA firm rather than any auditor a company chooses. The
firm reviews evidence directly, interviews staff, and tests whether the controls an organization
claims to have actually hold up in practice, rather than accepting a self-reported checklist. The
resulting report is not published publicly; it's a confidential document a vendor shares directly
with the specific customers and partners who need to see it, usually under a non-disclosure
agreement given how much detail it contains about internal security practices.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-soc-2" style="width:100%;height:auto;">
<title id="diagram-title-soc-2">How a SOC 2 report moves from control design to a Type II attestation an enterprise buyer can rely on</title>
<defs>
<marker id="arrow-soc-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Controls</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">designed</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-soc-2)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Type I report</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">(point in time)</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-soc-2)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Controls run</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">for months</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-soc-2)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Type II report</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">issued</text>
</svg>
<figcaption>Enterprise buyers usually want the Type II report specifically, since it proves the controls actually held up over time.</figcaption>
</figure>

## Where This Shows Up in Practice

Enterprise sales cycles for B2B SaaS companies are the clearest example: a prospective customer's
security or procurement team requests a current SOC 2 report as a condition of moving forward. Vendor
risk management programs at larger companies often require it as a standing condition from any
vendor that touches their data.

## Why a Business Should Care

For many SaaS companies, not having a SOC 2 report is a direct, immediate lost-revenue problem, not
an abstract security concern. It actively blocks enterprise deals at the procurement stage, no matter
how secure the underlying product actually is. That's a genuinely useful, concrete way to frame the
investment to a client's leadership: this isn't a security nice-to-have, it's a sales-enablement
requirement.

There's a second, quieter benefit worth naming too. Preparing for a first SOC 2 audit forces an
organization to actually document and formalize security practices that may have existed informally
up to that point, tribal knowledge held by one engineer rather than a written, repeatable process.
That documentation work often exposes gaps (an offboarding process that isn't consistently followed,
access reviews that happen irregularly) that were real risks regardless of whether a customer ever
asked for a report. The audit is the forcing function; the security improvement it produces along
the way is often worth as much as the report itself.

## Common Misconceptions

**"SOC 2 is a pass/fail certification."** It isn't. It's an auditor's opinion on how well an
organization's own chosen controls are designed and how effectively they're operating, evaluated
against that organization's own scope, not a universal certification against one fixed bar every
company is measured against identically.

**"Getting SOC 2 once means you're done."** A Type II report covers a specific period and needs to be
renewed on a recurring basis to stay current and useful to customers, who will expect an up-to-date
report, not one from two years ago.

## Related Topics

- [Cybersecurity Compliance & Regulations](../compliance-regulations/) for how SOC 2 fits among the
  other major compliance regimes.
- [ISO/IEC 27001](../iso-27001/), the closest international comparison point, worth understanding
  alongside SOC 2 since different customers expect different evidence.
- [What Is Penetration Testing](../../methodology/what-is-penetration-testing/), since a penetration test is
  frequently one of the pieces of evidence gathered as part of preparing for a SOC 2 audit.

*General security-education content, not legal or compliance advice. Work with a qualified auditor
for an actual SOC 2 engagement.*
