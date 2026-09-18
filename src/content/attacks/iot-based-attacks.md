---
title: IoT-Based Attacks
summary: Why internet-connected cameras, sensors, and controllers are such a reliable target at scale, and how a device with nothing valuable on it still becomes a serious problem.
capec: []
mitreAttack: []
typicalSeverityCeiling: Medium
related: ["ddos", "cryptojacking"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

An IoT-based attack is the compromise of an internet-connected device outside the traditional
computer-or-server category — a security camera, an environmental sensor, a building-access
controller, an industrial control unit — usually not for anything stored on the device itself, but
to recruit its computing power and network access into something larger the attacker controls.

## What Makes It Work

The assumption being exploited isn't really technical, it's organizational: a purpose-built device
with no obvious "valuable data" on it doesn't seem to need the same security attention as a laptop
or a database server. That assumption feels reasonable and is almost always wrong in practice. What
actually breaks isn't confidentiality of some file sitting on the device — it's the availability and
integrity of whatever the device controls or connects to, plus the raw value of its compute and
network capacity, which is worth something to an attacker even when the device itself holds nothing
worth stealing. A camera that's never been used to store a password is still a device with a network
connection, a CPU, and — very often — a set of credentials nobody ever bothered to change.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-iot-based-attacks" style="width:100%;height:auto;">
<title id="diagram-title-iot-based-attacks">Four stages from a default-credential device to botnet recruitment</title>
<defs>
<marker id="arrow-iot-based-attacks" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Device deployed</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">default credentials</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-iot-based-attacks)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Automated scan</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">finds it, logs in</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-iot-based-attacks)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Malware installed,</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">device recruited</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-iot-based-attacks)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Joins botnet,</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">used in DDoS</text>
</svg>
<figcaption>A single low-value device becomes valuable the moment it's combined with thousands of others.</figcaption>
</figure>

## Where It Actually Shows Up

- Devices left on default or hardcoded factory credentials, sometimes because the interface to change
  them is buried or nonexistent.
- Firmware that's rarely or never updated after purchase — no automatic update mechanism, and no team
  assigned to check for one manually.
- Devices deployed on the same flat network as core business systems, with no segmentation separating
  "the smart thermostat" from "the finance database."
- Industrial control systems where an availability failure isn't just downtime — it's a physical-world
  safety or operational consequence.

## Why It Keeps Succeeding

IoT devices are routinely deployed by teams outside traditional IT or security ownership — facilities,
operations, physical security — where the buying decision is about function ("does the camera work")
and security is an afterthought nobody was assigned to own. Vendors compound this by shipping
convenience-first defaults (a default admin password, an open management port reachable from the
whole network) and by offering inconsistent long-term security update support once a device ships,
unlike a laptop or server that usually sits inside a managed patching cycle.

## How to Detect It

- Network traffic anomalies from a device that should have a narrow, predictable communication
  pattern — a camera suddenly making outbound connections to unfamiliar hosts is a strong signal.
- Credential audits across a device fleet, specifically checking for default or unchanged passwords,
  since this is the single most common root cause on this page.
- Asset inventories that actually include IoT devices, not just traditional computers and servers —
  you can't monitor what you never counted as an asset in the first place.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| A single smart device with a unique, changed credential, on a segmented network | Limited — compromise is contained to that one device and whatever narrow function it serves |
| A fleet of identical devices sharing one unchanged default credential, on a flat network | One compromised credential becomes an entire fleet's worth of recruitable devices, and a foothold into whatever else that flat network reaches |
| An industrial control device whose availability failure has physical safety consequences | Impact extends beyond data or downtime into physical-world risk, which changes both the urgency and the regulatory picture |

## Why a Business Should Care

The point worth making plainly to a client is that IoT security failures at scale don't require any
single device to be individually valuable. A botnet built from thousands of low-value devices, each
contributing a small amount of computing and network capacity, adds up to serious collective impact —
often used to power the kind of traffic volume behind a [DDoS](../ddos/) attack against someone else
entirely. The device's low individual value is exactly why it gets left unmanaged and unpatched, and
that neglect — not the device's own worth — is the actual risk being carried.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented.)*

Meridian Facilities Group manages building-access systems for several commercial office properties.
During a network security assessment, a review of the deployed camera and door-controller fleet finds
that roughly forty devices across three buildings share a single, unchanged factory-default
administrative credential. All forty sit on the same flat network segment as the property management
system used to process tenant billing.

Confirming the exposure doesn't require exploiting anything creative — the default credential, found
in the manufacturer's own public documentation, logs into a sample device directly. From there, the
device's own network configuration shows it can reach the property management system's database port
directly, with no segmentation in between. The finding is reported and remediated before any actual
unauthorized access to the billing system is attempted; the assessment's job was to prove the path
existed, not to walk down it.

## Severity Calibration

This instance rates **Medium** on its own — the individual devices hold no sensitive data — but the
finding is escalated in the report specifically because of the unsegmented path to the property
management system, which is where the real business impact would land if the credential were ever
used maliciously. The severity is set by what the compromised devices can *reach*, not by anything
they hold themselves.

## Prevention & Response

The real fix is changing default credentials before a device ever goes into production, as a mandatory
deployment step rather than an optional one, combined with network segmentation that isolates IoT
devices from core business systems by default. Vendor and procurement vetting — asking whether a
device even has a mechanism for security updates before buying it — closes the gap further upstream.

The common inadequate fix is treating IoT devices as "set and forget" once installed, with no team or
process ever assigned to own their ongoing security. A device that nobody is responsible for is a
device that nobody will ever go back and patch or re-credential.

## Related Attacks & Vulnerabilities

- [DDoS](../ddos/) — the most common destination for a fleet of compromised IoT devices, recruited for
  their combined network capacity.
- [Cryptojacking](../cryptojacking/) — the other common destination, recruiting a device's compute
  cycles instead of its network bandwidth.
