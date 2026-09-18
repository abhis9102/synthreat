---
title: DNS Spoofing and Poisoning
summary: How corrupting the translation between a domain name and its real address silently redirects legitimate traffic to an attacker, and why DNSSEC exists specifically to close this gap.
capec: []
mitreAttack: []
typicalSeverityCeiling: High
related: ["man-in-the-middle", "session-hijacking"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

DNS spoofing — also called DNS cache poisoning — is an attack that corrupts the translation between
a domain name and its real IP address, redirecting legitimate traffic to a destination the attacker
controls. The victim types the correct address, sees the correct domain name, and is still sent
somewhere else entirely, because the lookup that turns that domain name into an actual network
address was tampered with along the way.

## What Makes It Work

Every time a device visits a website, it first has to ask a question most users never see: "what
address does this domain name actually point to?" That question is answered by the Domain Name
System (DNS), and the original design of DNS made a quiet assumption that turned out to matter a
great deal — that the answer coming back is authentic and hasn't been forged or altered in transit.
DNS wasn't originally built with a way to verify that the response actually came from the real,
authoritative source rather than an attacker who simply answered first or inserted a forged response
into a resolver's cache.

That gap is exactly what DNSSEC (Domain Name System Security Extensions), a real, IETF-standardized
protocol extension, exists to close: it lets DNS responses be cryptographically signed, so a resolver
can verify a response is authentic rather than simply trusting whatever arrives. What breaks without
it is the basic trust that a domain name reliably points to its real owner's infrastructure — a trust
almost every other web security control quietly assumes holds.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-dns-spoofing" style="width:100%;height:auto;">
<title id="diagram-title-dns-spoofing">A user's device asks a DNS resolver where a domain points; an attacker inserts a forged response before the real one arrives, redirecting the user to an attacker-controlled address while the browser still shows the correct domain name.</title>
<defs>
<marker id="arrow-dns-spoofing" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User requests</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">real domain</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-dns-spoofing)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">DNS resolver</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">looks up address</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-dns-spoofing)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker inserts</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">forged response</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-dns-spoofing)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User lands on</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">attacker's server</text>
</svg>
<figcaption>The address bar still shows the correct domain name — the forged answer happened at the DNS lookup step, invisibly to the user.</figcaption>
</figure>

## Where It Actually Shows Up

- **Forged responses inserted on a local network.** An attacker positioned on the same local network
  as the victim answers a DNS query before the real, authoritative server's response arrives.
- **Cache poisoning at a shared resolver.** A DNS resolver used by many users (an ISP's resolver, an
  organization's internal DNS server) has a forged record inserted into its cache, affecting every
  user who queries that resolver until the poisoned entry expires or is corrected.
- **A visually identical destination.** The redirected address commonly hosts a page built to look
  identical to the real site — a login page cloned pixel-for-pixel — specifically because the victim
  has no reason to suspect anything is wrong; the domain name in the address bar reads correctly the
  entire time.

## Why It Keeps Succeeding

DNSSEC has existed as a standard for years, but its adoption across domains and resolvers remains
inconsistent — deploying it correctly requires both the domain owner and the resolver to participate,
and a single gap on either side leaves the protection incomplete. Compounding this, the entire
mechanism is invisible to an ordinary user by design: there's no equivalent of a certificate warning
for DNS resolution, so a spoofed answer looks exactly like a legitimate one from the user's
perspective. The attack survives because the fix requires infrastructure-level adoption that isn't
yet universal, and the failure mode produces no visible symptom for the person actually affected.

## How to Detect It

1. Monitor DNSSEC validation failures where DNSSEC is deployed — a validation failure is a direct,
   actionable signal that a response didn't match its expected cryptographic signature.
2. Track unexpected changes in DNS resolution for sensitive, high-value domains (an organization's
   own login portal, for example) against a known-good baseline, rather than assuming resolution is
   always stable.
3. At the resolver level, monitor for patterns consistent with cache-poisoning attempts — an
   unusually high volume of DNS responses for a query that hasn't actually been asked yet is a
   classic signal of an attacker racing to insert a forged answer first.
4. During a security assessment, testing whether an organization's resolvers validate DNSSEC-signed
   responses correctly, and whether internal DNS infrastructure has any known cache-poisoning
   weaknesses, gives a direct answer rather than an assumption.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Domain has DNSSEC fully deployed and the resolver validates it | Forged responses are cryptographically detectable and rejected; this specific attack path is effectively closed |
| Domain has no DNSSEC, attacker compromises a single victim's local network | Traffic redirection limited to that specific victim or local network segment |
| Domain has no DNSSEC, attacker successfully poisons a widely used shared resolver's cache | Every user querying that resolver for the affected domain is redirected until the poisoned entry is identified and cleared — a single successful poisoning can affect a large population at once |

## Why a Business Should Care

The uncomfortable, useful thing to tell a client about this attack is that it defeats the exact
visual trust signal people are taught to rely on: "check that the URL is correct." Here, the URL is
correct — the DNS layer beneath it is what was compromised. That's a meaningful distinction to make
plainly, because it shifts the right investment away from "train users to look more carefully" and
toward the technical controls that actually address this — DNSSEC deployment and resolver hardening —
which a client can't verify through user vigilance no matter how well-trained their staff are.

## A Worked Example

*(Generalized from real engagement patterns. Company, product, and identifiers below are invented —
no real system, client, or data is referenced.)*

Ferrow Analytics runs an internal DNS resolver used by every employee device on its corporate
network. During an authorized assessment, the resolver is found to accept and cache DNS responses
without any validation against DNSSEC signatures, even for domains that do publish DNSSEC records —
meaning the resolver would accept a forged response indistinguishable from a real one, if one were
inserted.

Using a controlled, isolated test setup with Ferrow's written authorization, the assessment
demonstrates — without touching any real user's traffic — that a forged response for a test domain
can be accepted by the resolver's caching behavior under realistic timing conditions. This confirms
the underlying weakness directly: the resolver's lack of validation, not a hypothetical worst case.

The assessment documents the specific missing validation step and stops there — no attempt is made to
target any real employee's traffic or any production domain beyond the isolated test case, since
proving the resolver's acceptance behavior is sufficient to establish the finding.

## Severity Calibration

This instance rates **High**: the weakness is confirmed and would affect every user relying on the
resolver if actually exploited against a real domain, but exploitation still requires either a
network position capable of racing a legitimate response or an existing cache-poisoning opportunity
against that specific resolver — it isn't as simple as a single unauthenticated remote request. It
would rate Critical only with a further demonstrated, practical path to actually winning that race or
inserting a poisoned entry against a specific, high-value target domain in this environment; on its
own, the missing validation is a serious, confirmed gap with a clear but not-yet-fully-realized path
to widespread impact.

## Prevention & Response

The real fix is deploying DNSSEC for domains an organization controls and ensuring resolvers actually
validate DNSSEC signatures rather than merely tolerating their presence, combined with using
trusted, hardened DNS resolvers and monitoring for unexpected resolution changes on sensitive
domains.

The common inadequate fix is relying entirely on end-user vigilance — telling people to "check the
address bar carefully" — as if that fully compensates for an unauthenticated DNS layer underneath it.
It doesn't: the address bar is exactly the part of the picture that still looks correct when this
attack succeeds.

## Related Attacks & Vulnerabilities

- [Man-in-the-Middle (MITM)](../man-in-the-middle/) — a different technique that can achieve a
  similar redirection outcome by intercepting traffic directly rather than corrupting name resolution.
- [Session Hijacking](../session-hijacking/) — a common follow-on once a victim has been redirected
  to an attacker-controlled destination that can capture session tokens or credentials.
