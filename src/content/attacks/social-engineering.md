---
title: Social Engineering
summary: Why manipulating a person is consistently more reliable than defeating a technical control, and how pretexting and vishing succeed even against organizations with strong technical defenses.
capec: []
mitreAttack: []
typicalSeverityCeiling: High
related: ["phishing", "business-email-compromise", "insider-threat"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

Social engineering is manipulating a person, rather than a system, into taking an action or
disclosing information they otherwise wouldn't. [Phishing](../phishing/) and
[business email compromise](../business-email-compromise/) are the email-based versions of this and
have their own dedicated pages; this page covers the rest of the channel — a phone call (vishing), an
in-person or written fabricated scenario (pretexting), or a text message — where the same underlying
manipulation happens without an email ever being involved.

## What Makes It Work

This attack doesn't exploit a technical vulnerability at all. It exploits normal, healthy human
behaviors — trust in a confident, authoritative-sounding voice; a genuine desire to be helpful;
discomfort challenging someone who seems legitimate, especially under time pressure. What breaks is
the authenticity of a claimed identity or role, and because the target is a person rather than a
system, a successful social-engineering attempt bypasses every technical control at once — firewalls,
encryption, and access policies are all irrelevant if the person on the other end of the call simply
hands over what was asked for.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-social-engineering" style="width:100%;height:auto;">
<title id="diagram-title-social-engineering">A fabricated pretext used to extract access or information directly from a person</title>
<defs>
<marker id="arrow-social-engineering" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker builds</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">a pretext</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-social-engineering)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Contacts target</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">by phone or in person</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-social-engineering)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Target complies,</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">no verification done</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-social-engineering)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Access or info</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">handed over directly</text>
</svg>
<figcaption>No technical control sits between step 3 and step 4 — the person was the entire boundary.</figcaption>
</figure>

## Where It Actually Shows Up

- **Vishing** — a phone call impersonating IT support, a vendor, or an executive, asking the target
  to reset a password, read back a one-time code, or grant remote access.
- **Pretexting** — a fabricated scenario used to justify a request that would otherwise seem
  unusual, such as posing as a new employee who's "locked out" to convince a helpdesk to bypass
  normal identity verification.
- **Physical tailgating** — following an authorized employee through a secured door using confidence
  and a plausible reason, rather than defeating the physical access control technically.

## Why It Keeps Succeeding

Attackers can iterate cheaply, contacting many people until one complies — they only need one success
out of many attempts. Separately, most people feel genuine social discomfort challenging or
"interrogating" someone who sounds confident and legitimate, especially when the request carries an
implied urgency or authority, and that discomfort is precisely the gap a well-run pretext is designed
to exploit.

## How to Detect It

There is no purely technical detection for the initial approach itself — the manipulation happens in
a conversation, not in a system log. Realistic detection means: verified callback procedures that
catch the attempt before any harm occurs (calling a known, independently-sourced number back rather
than trusting the one the caller provided), and a workplace culture where an employee who feels
something is off can report it without fear of looking paranoid or unhelpful, generating a signal
security teams can actually act on.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Low-privilege employee pretexted into disclosing minor internal information | Limited direct impact, but often used as reconnaissance for a more damaging follow-up attempt |
| Helpdesk convinced to reset an executive's password or MFA enrollment | Direct account takeover of a high-privilege identity, bypassing every technical control on that account |
| Physical access gained to a restricted area via tailgating | Exposure to whatever that area protects — server rooms, sensitive documents, unattended unlocked workstations |

## Why a Business Should Care

No amount of technical security spending closes this gap on its own — it requires investing in
people and process as a genuinely separate line item from firewalls and endpoint tools: verified
request procedures, and a no-blame reporting culture where "I think I was just tested" is treated as
a win, not an embarrassment. This is often a surprising and useful point to raise with a client whose
security budget is entirely allocated to technology purchases: the strongest technical stack in the
world doesn't help if a convincing phone call can walk straight past all of it.

## A Worked Example

*(Generalized from common industry patterns. Company and identifiers below are invented.)*

As part of an authorized security assessment scoped explicitly to include social engineering,
a tester calls Ferrow Manufacturing's IT helpdesk, posing as a traveling sales employee who is
locked out of their account ahead of an urgent client meeting. The pretext includes plausible
details — a real employee name and department found from public sources — and a tone of
time-pressured urgency.

The helpdesk agent, without completing the organization's documented identity-verification steps,
resets the account's password and reads a temporary one aloud over the phone. The tester ends the
call immediately at that point without logging into the account or using the credential — the scope
of the engagement was to test whether the verification step would be followed, not to actually
access the account, and the finding is fully proven by the agent's willingness to bypass the process.

## Severity Calibration

This finding rates **High**: the compromised process — helpdesk password resets without identity
verification — could grant an attacker access to any account in the organization, not just one, and
the account targeted in a real attack could just as easily be a highly privileged one. The severity
comes from what the *bypassed process* could reach in the worst realistic case, not from the specific
low-privilege pretext used to prove it, which is why this rates far higher than the specific role
impersonated during the test would suggest on its own.

## Prevention & Response

The real fix is a verified callback procedure for any sensitive request — calling back a known,
independently-sourced number rather than trusting caller ID or a number the requester provided —
combined with training that specifically simulates vishing and pretexting scenarios, not just email
phishing, and a reporting culture with genuinely no blame attached to a false alarm.

The common inadequate fix is generic annual security-awareness training that only ever covers email
phishing recognition. It leaves the staff who are actually targeted by this specific technique —
helpdesk, reception, executive assistants — completely untested against the channel most likely to be
used against them.

## Related Attacks & Vulnerabilities

- [Phishing](../phishing/) — the email-channel version of the same underlying manipulation.
- [Business Email Compromise](../business-email-compromise/) — a targeted, high-stakes variant
  specifically aimed at financial fraud.
- [Insider Threat](../insider-threat/) — a related but distinct risk where the person already has
  legitimate access, rather than being manipulated into granting it.
