---
title: Business Email Compromise (BEC)
summary: Why targeted, researched impersonation of an executive or vendor causes some of the largest direct financial losses of any attack technique on this list, and how it's actually verified against.
capec: []
mitreAttack: ["T1566"]
typicalSeverityCeiling: Critical
related: ["phishing", "social-engineering"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

Business Email Compromise, usually shortened to BEC, is a targeted, researched impersonation of a
specific person — almost always an executive, a finance team member, or a trusted vendor — used to
induce a specific, high-value action, most commonly a fraudulent wire transfer. It's related to
[Phishing](../phishing/) but distinct enough to warrant its own page: generic phishing casts a wide
net for whatever it can catch, while BEC is narrow, patient, and built around one convincing request
to one specific person, often with no malicious link or attachment at all.

## What Makes It Work

An internal request "sounding right" — the correct names, the correct context, the correct timing
relative to something actually happening at the company — creates a strong, almost automatic
impression of legitimacy. None of that surface plausibility actually verifies who sent the message.
What breaks is the authenticity of an instruction, specifically a financial one: the recipient
reasonably assumes that a request which knows accurate, specific details about the business must have
come from someone with a legitimate reason to know them, when in reality that detail was gathered
from public sources, not from genuine internal access.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-bec" style="width:100%;height:auto;">
<title id="diagram-title-bec">The four stages of a business email compromise attack, from research to fraudulent transfer</title>
<defs>
<marker id="arrow-bec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker researches</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the target</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-bec)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Crafted request</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">impersonates exec/vendor</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-bec)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Employee acts on</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the request</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-bec)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Funds reach an</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">attacker-controlled account</text>
</svg>
<figcaption>Out-of-band verification, done before stage three, is the one control that reliably breaks this chain.</figcaption>
</figure>

## Where It Actually Shows Up

- **Wire transfer redirection** — a message, appearing to come from an executive, instructing finance
  staff to urgently process a payment to a specified account.
- **Vendor bank-detail changes** — a message impersonating a known, existing vendor claiming their
  banking details have changed, redirecting a legitimate, expected payment to the attacker instead.
- **Gift card requests** — a lower-value but very common variant, an "executive" asking an assistant
  or junior employee to urgently purchase gift cards and send the codes directly.
- **Timing tied to real events** — attackers increasingly time these requests around genuine, publicly
  knowable events (a recently announced acquisition, an executive known to be traveling and hard to
  reach for a quick verbal confirmation), making the pretext more convincing.

## Why It Keeps Succeeding

Attackers now have access to an enormous amount of accurate organizational detail from entirely
public sources — professional networking profiles, press releases, earnings calls, and prior data
breaches that leaked real internal terminology and reporting structures. That detail makes a fabricated
request read as specific and credible rather than generic. Layered on top of that is the same urgency-
plus-authority dynamic seen in ordinary phishing, but sharpened: a request that appears to come
directly from a superior, during a moment engineered to make quick verbal confirmation inconvenient,
suppresses the normal instinct to double-check.

## How to Detect It

- **Out-of-band verification** — calling a known, previously verified phone number (never one
  provided in the email itself) before acting on any payment or banking-detail change request,
  regardless of how convincing or urgent it appears.
- **Lookalike domain inspection** — checking the actual sending domain character by character; a
  single substituted or added character is the most common technical tell.
- **Flagging the request type, not the sender** — treating *any* request to change payment details or
  redirect funds as requiring verification, independent of who appears to be asking, removes the
  reliance on correctly spotting impersonation in the moment.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Suspicious request flagged and verified before any action taken | No loss; the control worked as intended |
| Funds transferred, recovery attempted within hours through the bank | Partial recovery is sometimes possible if caught immediately, but far from guaranteed |
| Funds transferred, discovered days later | Typically unrecoverable — funds have usually already moved through additional accounts by then |
| Vendor bank-detail change accepted without verification | Loss compounds with every subsequent legitimate payment made to the wrong account until the fraud is discovered |

## Why a Business Should Care

BEC is one of the few attack techniques on this site with a direct, often large, and frequently
irreversible financial loss as the primary outcome — worth naming plainly rather than folding into
generic "cybersecurity risk" language. Once a fraudulent wire transfer clears and moves through
several intermediary accounts, recovery becomes unlikely regardless of how quickly it's discovered.
That makes prevention — specifically, a verification process that doesn't depend on any one
employee's judgment in the moment — a far better investment than detection after the fact. This is
also a genuinely easy risk to explain to a non-technical client: it isn't about firewalls or code, it's
about one specific process — payment and banking-detail changes always get an independent, out-of-band
check, no matter who's asking or how urgent it sounds.

## A Worked Example

*(Generalized from real engagement patterns. Company, product, and identifiers below are invented —
no real system, client, or data is referenced.)*

As part of an authorized assessment, a testing team sends the accounts-payable team at Halewood
Fixtures a message appearing to come from the company's CFO, referencing a real, recently announced
acquisition and requesting an urgent payment to "finalize escrow" before end of day, with the CFO
noted as traveling and unreachable by phone. The sending domain is a single-character variation of the
real company domain.

An accounts-payable employee begins processing the payment before a colleague notices the sender
domain doesn't match exactly and raises it. The engagement is halted at that point — the assessment's
goal is to measure whether the request would have been caught, not to complete an actual transfer.
The report's central finding isn't the near-miss itself; it's that no policy existed requiring
out-of-band verification for time-sensitive payment requests specifically, meaning the outcome came
down to one employee's individual alertness rather than a process the organization could rely on
repeating.

## Severity Calibration

This class of finding rates **Critical** when a realistic path to an actual completed fraudulent
transfer is demonstrated, because the potential impact — direct, often large, frequently
unrecoverable financial loss — is about as severe and as concrete as impact gets. Severity drops
meaningfully if the organization already has a verification step that would have caught the request
regardless of the pretext's quality; in that case the finding shifts from "this technique fully
succeeds" to "this technique was attempted and would have been stopped," which is a different and
much less urgent risk profile.

## Prevention & Response

The real fix is a mandatory, no-exceptions, out-of-band verification process for any payment
initiation or banking-detail change — a callback to a previously verified number, not a reply to the
email itself — combined with dual approval for transfers above a set threshold, so no single
employee's judgment is ever the only control in the chain. If a fraudulent transfer does happen, speed
matters enormously: contacting the receiving bank and initiating a recall request within hours, not
days, meaningfully changes recovery odds.

The common inadequate response is relying on training alone, or trusting a "reply-to matches" check
as verification — both are easily defeated, the first because attention lapses under real pressure no
matter how well-trained someone is, the second because a reply-to address is exactly as easy to spoof
as the sender address itself.

## Related Attacks & Vulnerabilities

- [Phishing](../phishing/) — the broader, less targeted version of the same underlying technique.
- [Social Engineering](../social-engineering/) — the general discipline of manipulating a person
  rather than a system, of which this is a financially-focused, email-based form.
