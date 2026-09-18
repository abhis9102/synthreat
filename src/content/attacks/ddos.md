---
title: Denial-of-Service (DoS) and Distributed Denial-of-Service (DDoS)
summary: How flooding attacks actually overwhelm a system's real capacity limits, why "more bandwidth" alone isn't the fix, and how severity should be measured by business impact of downtime, not attack size.
capec: []
mitreAttack: ["T1498"]
typicalSeverityCeiling: High
related: ["iot-based-attacks"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

A denial-of-service (DoS) attack floods a system with traffic or requests until it can no longer serve
legitimate users. A distributed denial-of-service (DDoS) attack is the same goal achieved from many
sources at once, almost always a botnet of compromised devices spread across the internet, rather
than a single attacking machine. DDoS is the far more common and far more dangerous form in practice,
because a single source is trivially rate-limited or blocked, while thousands of distinct, distributed
sources are not.

## What Makes It Work

A DoS/DDoS attack exploits the assumption that legitimate demand and available capacity stay roughly
matched. Every system (a web server, a database, a network link) has a finite capacity, sized around
expected normal (even expected *peak*) usage. The attack works because sending a request is cheap for
the attacker, while processing that request can be comparatively expensive for the target, and an
attacker with enough sources can multiply that cost far beyond anything the target provisioned for.

The security property that breaks is purely **availability**: nothing is stolen, altered, or read
that shouldn't be; the system simply becomes unable to do its job for anyone, attacker included.
That narrow focus is actually useful to communicate clearly to a client: a DDoS incident, on its own,
is not typically a data breach.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-ddos" style="width:100%;height:auto;">
<title id="diagram-title-ddos">How a distributed denial-of-service attack overwhelms a target's available capacity.</title>
<defs>
<marker id="arrow-ddos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Botnet assembled</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">from compromised devices</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ddos)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Traffic directed</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">at one target</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ddos)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Capacity exceeded</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">on server or link</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ddos)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Legitimate users</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">can't connect</text>
</svg>
<figcaption>Nothing is stolen or altered; availability is the only property that breaks.</figcaption>
</figure>

## Where It Actually Shows Up

- **Volumetric/network-layer floods.** Sheer traffic volume aimed at overwhelming network capacity,
  frequently powered by a botnet of compromised, poorly secured internet-of-things devices (see
  [IoT-Based Attacks](../iot-based-attacks/)).
- **Application-layer floods.** A much smaller volume of requests aimed at a specific, computationally
  expensive endpoint (a search feature, a login form triggering a heavy database query), which can be
  devastating without needing enormous traffic volume at all.
- **DDoS-for-hire ("booter") services**, which have significantly lowered the technical bar for
  launching a meaningful attack: the attacker doesn't need to build or control a botnet themselves.

## Why It Keeps Succeeding

Most organizations size their infrastructure for expected peak legitimate load (a busy shopping
season, a product launch), not for adversarial, deliberately maximized load. Application-layer floods
specifically succeed because they don't need to overwhelm raw network bandwidth at all; they only need
to find the one endpoint that's disproportionately expensive to process and send it enough targeted
requests to exhaust that specific resource.

## How to Detect It

The key detection skill is distinguishing a real attack from a real traffic spike: both look like
"suddenly a lot more requests." Useful signals include: traffic originating from an unusual geographic
or network distribution inconsistent with the target's normal user base, a disproportionate share of
requests hitting one specific expensive endpoint rather than a natural spread across the site, and
request patterns that don't match how a real user actually browses (no time spent on a page, no
follow-up requests for images/assets a real browser would also load).

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Brief outage on an internal, non-revenue-critical tool | Inconvenience, limited business impact |
| Sustained outage on a customer-facing e-commerce checkout during a peak sales period | Direct, significant revenue loss tied precisely to the timing |
| Application-layer flood exhausting one specific backend resource | Outage disproportionate to the actual traffic volume involved, because the target was chosen for cost, not size |
| Attack absorbed cleanly by scrubbing/rate-limiting infrastructure sized for adversarial load | Minimal to no visible impact: the intended outcome of proper capacity planning |

## Why a Business Should Care

The business impact of a DDoS attack scales directly with how availability-dependent the business is:
a company whose revenue depends on customers reaching a live website in the moment (e-commerce,
SaaS, online services) has far more at stake than one where a brief outage is a minor inconvenience.
The reputational cost of a visible, public outage (customers seeing "site down" in real time, on
social media, during a promotion) is often worse for a brand than the technical incident itself.
Positioning DDoS protection as a business-continuity investment, not purely a security line item,
tends to land better with a client evaluating whether it's worth the cost.

## A Worked Example

*(Fully invented for illustration. No real organization, incident, or data referenced.)*

Bramwell Outfitters, an online retailer, notices its checkout page becomes unusably slow during a
seasonal sale. Investigation shows the traffic volume itself isn't unusually high in aggregate. What's
unusual is that a large share of requests are hitting the "apply promo code" endpoint specifically,
which triggers an expensive database lookup each time, rather than the lighter-weight product pages
seeing the actual sale traffic. A modest, distributed set of sources sending promo-code requests
faster than any real shopper could type them is enough to exhaust that one endpoint's database
capacity, degrading checkout for everyone else even though total site traffic looks unremarkable.

## Severity Calibration

This scenario rates **High** rather than Critical: the outage was real and directly tied to peak
revenue timing, but it was contained to one function (checkout) rather than the entire platform, and
resolved within the same business day once the expensive endpoint was identified and rate-limited
specifically. A multi-day, platform-wide outage during the same sales window, or one that also exposed
a secondary vulnerability discovered during the chaos, would rate higher. The technique's name
("DDoS") doesn't set the ceiling; what was actually taken offline, for how long, and at what moment
does.

## Prevention & Response

The real fix is layered: traffic scrubbing and rate-limiting services that can absorb volumetric floods
upstream of the target infrastructure, redundant and geographically distributed infrastructure so no
single point of capacity is a single point of failure, capacity planning that explicitly accounts for
adversarial (not just organic peak) load on the specific endpoints most likely to be targeted, and a
tested incident response plan for a sustained attack rather than improvising one during the incident
itself.

The common inadequate fix is simply adding more servers or bandwidth as a reaction. Against a
sufficiently large or well-targeted attack, this is an expensive arms race the target is likely to
lose, not an actual architectural mitigation.

## Related Attacks & Vulnerabilities

- [IoT-Based Attacks](../iot-based-attacks/): the most common real-world source of the botnet capacity
  behind large volumetric DDoS attacks.
