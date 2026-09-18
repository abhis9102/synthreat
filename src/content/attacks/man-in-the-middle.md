---
title: Man-in-the-Middle (MITM)
summary: How an attacker secretly sits between two parties who believe they're talking directly to each other, and why encryption alone only closes part of this gap.
capec: []
mitreAttack: ["T1557"]
typicalSeverityCeiling: High
related: ["session-hijacking", "dns-spoofing"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

A man-in-the-middle (MITM) attack happens when an attacker secretly positions themselves between two
parties who believe they are communicating directly with each other, intercepting, and sometimes
altering, everything that passes between them. Neither side notices anything unusual, because from
each party's point of view the conversation looks completely normal. MITRE ATT&CK, the industry's
standard taxonomy of adversary techniques, has renamed this technique "Adversary-in-the-Middle"
(catalogued as T1557), but "man-in-the-middle" remains the term most people search for and use in
conversation, so this page uses both interchangeably.

## What Makes It Work

Every network conversation relies on an assumption that's easy to forget is an assumption at all:
that traffic sent to a destination actually reaches that destination directly, without passing
through anyone else's hands along the way. A man-in-the-middle attack exploits exactly that gap. The
attacker doesn't need to break into either endpoint; they only need to get their own machine (or a
device they control) into the path the traffic travels, so both sides keep talking to what they think
is the other party, while everything actually flows through the attacker first.

What breaks is confidentiality, at minimum: anything sent through the intercepted channel becomes
readable to the attacker. If the attacker also modifies traffic in transit rather than just reading
it, integrity breaks too: either party could now be acting on data that was silently changed after it
left the sender.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-mitm" style="width:100%;height:auto;">
<title id="diagram-title-mitm">A user's device believes it is talking directly to a legitimate server, but traffic is actually routed through an attacker positioned in between, who can read or alter it before forwarding it on.</title>
<defs>
<marker id="arrow-mitm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User's device</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">sends request</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-mitm)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">reads / alters</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-mitm)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Legitimate</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">server</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-mitm)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Response</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">returns via attacker</text>
</svg>
<figcaption>Both endpoints believe they're talking directly to each other; every message actually passes through the attacker first.</figcaption>
</figure>

## Where It Actually Shows Up

- **Unsecured public Wi-Fi.** A coffee shop or airport network with no encryption between the device
  and the access point makes it trivial for anyone else on that network to observe unencrypted
  traffic directly.
- **Techniques that reroute traffic on a local network.** ARP spoofing tricks devices on the same
  local network into sending their traffic through the attacker's machine instead of the real
  gateway, without the victim's device configuration changing at all.
- **A malicious access point mimicking a legitimate one.** A device set up to broadcast a Wi-Fi
  network name identical to a trusted one (a hotel's or office's real network), so devices that
  auto-connect to previously known network names connect to the attacker instead.
- **Weakened or bypassed TLS certificate validation.** This is increasingly the more realistic
  modern version of this attack. Properly enforced HTTPS makes the classic "open Wi-Fi eavesdropping"
  version of MITM largely ineffective, because the attacker can see that traffic is happening but not
  read its encrypted contents. The attack becomes viable again specifically where certificate
  validation is weak, misconfigured, or where a user is trained to click past a certificate warning.

## Why It Keeps Succeeding

The technical protection against this attack, encryption in transit validated by a certificate
chain, has existed and been well understood for decades, and yet the attack keeps working in
specific, recurring situations: applications that don't enforce HTTPS everywhere and silently allow a
fallback to plaintext, custom or internal applications where certificate validation was implemented
incorrectly or disabled during development and never re-enabled, and end users who have been trained,
often by their own experience of certificate warnings appearing on legitimate but misconfigured
sites, to click through security warnings without reading them. The technology solved the general
case; the attack survives in the gaps where that technology isn't actually enforced.

## How to Detect It

1. Certificate warnings that appear and get dismissed are a real, actionable signal, not noise to
   train users to ignore. Any process that trains users to routinely bypass certificate warnings is
   itself a detection failure waiting to happen.
2. Monitor for unexpected certificate changes on sensitive applications: a certificate that suddenly
   doesn't match the expected issuer, fingerprint, or validity period for a domain that normally has
   a stable one.
3. On local networks, monitor for ARP anomalies: multiple IP addresses claiming the same hardware
   address, or a gateway's hardware address suddenly changing without a known network change to
   explain it.
4. During a security assessment, deliberately testing whether an application enforces HTTPS
   everywhere (including redirecting any plaintext HTTP attempt) and whether certificate validation
   can be bypassed or downgraded is a standard, direct way to confirm this risk rather than assume it
   away.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Application transmits sensitive data over plain, unencrypted HTTP | Full visibility into transmitted data for anyone positioned on the network path: credentials, session tokens, and any other content are trivially readable |
| Application enforces HTTPS, but a user ignores or bypasses a certificate warning | Interception remains possible for that specific session, but only because a strong technical control was actively overridden by the user, not because the control was absent |
| Application enforces HTTPS with strict certificate validation and no bypass path | The classic version of this attack is effectively closed; residual risk shifts to more sophisticated attacks against the certificate authority ecosystem itself, which is a different and much rarer threat model |

## Why a Business Should Care

The honest framing for a client is that man-in-the-middle interception is, at the protocol level,
mostly a solved problem: enforced HTTPS with proper certificate validation closes the vast majority
of realistic scenarios. What actually creates risk is an organization quietly undermining that
existing protection: an internal tool that skips certificate validation "just for now," a mobile app
that doesn't pin certificates and silently accepts anything presented to it, or a security-awareness
program that never explains to staff why a certificate warning matters, leaving them to treat it as
an obstacle rather than a real signal. The investment worth making isn't primarily "add more
encryption"; it's "verify the encryption already claimed isn't quietly broken somewhere."

## A Worked Example

*(Generalized from real engagement patterns. Company, product, and identifiers below are invented.
No real system, client, or data is referenced.)*

Aldergate Logistics operates an internal fleet-management application used by dispatch staff on
company-issued tablets connecting over the office Wi-Fi network. During an assessment, the mobile
application is observed making its API calls over HTTPS, but a closer inspection of its network
behavior shows that the app accepts any certificate presented to it, including a certificate that was
deliberately self-signed and doesn't match the real server's identity at all. The app doesn't
actually validate what it's being handed.

Positioning a test device on the same network segment and using a controlled routing technique, with
Aldergate's written authorization for exactly this test, confirms the finding directly: the
application's traffic can be intercepted and read in full, including dispatch credentials and
customer delivery addresses, with the app displaying no error or warning to the user at any point in
the process, because the certificate check that should have caught the substitution was effectively
disabled in the app's code.

Testing stops at confirming interception and readability of representative traffic. No customer data
is retained beyond what's needed to demonstrate the finding, and the assessment moves directly to
documenting the specific missing certificate-validation logic rather than continuing to explore what
else could be read.

## Severity Calibration

This instance rates **High**, not Critical: the interception is real, reliably reproducible, and
exposes credentials and customer data, but it requires the attacker to already have a foothold on the
same local network; it isn't remotely exploitable from the open internet. The severity would move to
Critical only with a demonstrated path for a remote or unauthenticated attacker to get into that
network position in the first place; on its own, the missing certificate validation is a serious,
directly fixable application flaw with a real but bounded blast radius. As always, the vulnerability
class doesn't set the rating; the demonstrated reachability and impact do.

## Prevention & Response

The real fix is enforcing encryption in transit everywhere, with no fallback path to plaintext ever
available, combined with certificate validation that cannot be silently bypassed or disabled by a
configuration flag, and, for high-sensitivity mobile or desktop applications, certificate pinning,
so the app only accepts the specific certificate (or a certificate from a specific, known authority)
it expects, rather than trusting anything that happens to be presented.

The common inadequate fix is treating encryption as present-but-optional: HTTPS is offered, but HTTP
still works if requested, or certificate errors are caught and silently ignored in code rather than
surfaced and enforced. This gives the appearance of security without providing it, and it's often
worse than no encryption at all, because it creates false confidence that the channel is protected.

## Related Attacks & Vulnerabilities

- [Session Hijacking](../session-hijacking/): one of the most direct consequences of a successful
  interception. A session token read from intercepted traffic can be reused to impersonate the victim
  entirely.
- [DNS Spoofing and Poisoning](../dns-spoofing/): a different technique that can achieve a similar
  outcome, redirecting traffic to an attacker without needing to be positioned on the same local
  network at all.
