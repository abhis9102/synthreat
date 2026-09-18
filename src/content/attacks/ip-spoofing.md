---
title: IP Spoofing
summary: How forging a packet's source address lets an attacker hide their origin or turn a network into an amplifier that floods someone else's server with traffic.
capec: []
mitreAttack: []
typicalSeverityCeiling: Medium
related: ["ddos", "man-in-the-middle"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

IP spoofing is forging the source IP address field in network packets so they appear to originate
from a different, often trusted, address than they actually did. The packet itself may be entirely
ordinary; the only thing altered is the claim about where it came from.

## What Makes It Work

Basic IP-level networking was never designed to authenticate that a packet's claimed source address
is genuine. The source address field is, in the plainest technical sense, just a value the sending
software fills in. Nothing about the underlying protocol stops a sender from writing whatever address
it wants there, unless something downstream specifically checks. What breaks is authenticity of
origin: a receiving system, or a third system relaying a response, has no reliable way to confirm the
packet actually came from the address it claims.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-ip-spoofing" style="width:100%;height:auto;">
<title id="diagram-title-ip-spoofing">How a spoofed source address turns a normal request into a reflected flood against a victim who never sent anything.</title>
<defs>
<marker id="arrow-ip-spoofing" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker sets source</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">address to victim's IP</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ip-spoofing)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Request sent to a</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">third-party server</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ip-spoofing)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Server replies to</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the spoofed address</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ip-spoofing)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Victim is flooded</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">with replies</text>
</svg>
<figcaption>The victim never sent a request at all; the flood is entirely made of replies to someone else's forged traffic.</figcaption>
</figure>

## Where It Actually Shows Up

- **DDoS reflection and amplification.** An attacker spoofs a victim's IP address as the source of
  requests sent to third-party servers, so the reflected responses flood the victim instead of the
  actual sender. See [DDoS](../ddos/) for how the resulting flood plays out once it reaches the
  target.
- **Bypassing IP-address-based access control.** A service that trusts a request purely because it
  claims to come from an allowed address can be fooled if nothing else verifies that claim.
- **Disguising the true origin** of other malicious traffic, making attribution and blocking harder
  after the fact.

## Why It Keeps Succeeding

Many networks still do not consistently filter outbound traffic to verify that a packet's source
address genuinely belongs to their own address space, a control commonly called source address
validation. That gap is exactly what allows spoofed traffic to leave a network in the first place;
without it, nothing downstream ever gets a chance to catch the forgery before it does damage
elsewhere.

## How to Detect It

Detection happens mostly at the network level rather than by looking at any single packet in
isolation: filtering and monitoring for outbound packets claiming a source address that does not
belong to the sending network's own address space, and watching for traffic patterns consistent with
a reflection-style attack, such as an unusual volume of unsolicited replies arriving at an address
that never issued the matching requests.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Spoofing used to bypass a minor internal access control list | Limited, contained access issue on a single system |
| Spoofing contributes to a moderate reflection-based traffic increase against a third party | Noticeable but manageable strain on the target's infrastructure |
| A network's own missing filtering enables large-scale amplification against an external target | Significant reputational and operational exposure for the network that let the traffic leave unchecked, even though it wasn't the intended victim |

## Why a Business Should Care

IP spoofing is rarely a headline attack on its own; it is usually the enabling technique behind a
much larger, visible incident such as a DDoS attack. Closing this gap on an organization's own
network is a hygiene practice that reduces harm to others as much as to itself. The honest way to
frame this with a client is shared internet responsibility, not pure self-interest: an
unfiltered network today is a potential amplifier for tomorrow's attack against someone else, and
that exposure carries real reputational and operational risk of its own.

## A Worked Example

*(Fully invented for illustration. No real organization, incident, or data referenced.)*

During a network security assessment for Aldervane Freight, the testing team confirms that outbound
traffic leaving one of the company's data center segments is not filtered for source address
validity. A controlled test packet, crafted with a source address outside the company's own
allocated range, is successfully sent out through the network's edge without being blocked or
flagged. The test stops there: the assessment demonstrates that the network could be used to relay
spoofed traffic, without actually directing any traffic at a real third party or attempting an
amplification attack against anyone.

The finding is not that an attack happened; it is that the missing control would let one happen
through this network without the network's own operators ever knowing, until a complaint or an abuse
report arrived from someone else entirely.

## Severity Calibration

This class typically rates **Medium**, and the actual rating depends heavily on what the missing
control demonstrably enabled. A minor internal access-control bypass discovered through spoofing
rates lower than a network confirmed capable of contributing meaningfully to a reflection attack
against external targets, since the latter carries real reputational and potential liability exposure
beyond the organization's own systems.

## Prevention & Response

The real fix is source address validation at the network edge: filtering outbound traffic that does
not match the network's own allocated address space, so spoofed packets never leave in the first
place. IP address alone should also never be the sole basis for any access control decision.

The common bad fix is relying on IP allowlisting as a complete access control mechanism with no
additional authentication layered on top, treating "the request came from an approved address" as
proof of legitimacy rather than a claim that still needs to be verified some other way.

## Related Attacks & Vulnerabilities

- [DDoS](../ddos/): the attack type most commonly enabled or amplified by unchecked IP spoofing.
- [Man-in-the-Middle](../man-in-the-middle/): a related technique that also depends on a victim
  trusting a claim about where traffic is actually coming from.
