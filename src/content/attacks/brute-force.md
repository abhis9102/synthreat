---
title: Brute Force
summary: How systematic password guessing works against real-world rate limits and account lockouts, and why it succeeds almost exclusively against weak or default credentials.
capec: ["CAPEC-112"]
mitreAttack: ["T1110"]
typicalSeverityCeiling: Medium
related: ["credential-stuffing"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

Brute force is systematically guessing a password, PIN, or key through repeated attempts, rather
than looking it up. It's the older, simpler sibling of [credential stuffing](../credential-stuffing/):
brute force tries combinations it has never confirmed are real; credential stuffing replays
combinations it already knows worked somewhere else. Both end the same way — an authentication
system granting access it shouldn't — but they get there differently, and that difference changes
how each is detected and prevented.

## What Makes It Work

The attack exploits two things working together: an authentication system that doesn't sufficiently
limit or slow repeated failed attempts, and a credential that falls inside a realistically guessable
search space — a short PIN, a common dictionary word, or a vendor-shipped default that was never
changed. Neither condition alone is usually enough; a weak password behind strict lockout controls,
or unlimited attempts against a genuinely strong, unique password, both resist this attack in
practice. What breaks, when both conditions align, is access control on the specific account or
device being guessed against.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-brute-force" style="width:100%;height:auto;">
<title id="diagram-title-brute-force">Repeated automated guesses against a login until one combination succeeds</title>
<defs>
<marker id="arrow-brute-force" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Automated tool</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">picks guess #1</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-brute-force)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Login endpoint</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">rejects, no lockout</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-brute-force)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Thousands more</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">guesses, unthrottled</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-brute-force)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Weak/default</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">credential matches</text>
</svg>
<figcaption>Without a lockout or rate limit, the only real defense left is credential strength.</figcaption>
</figure>

## Where It Actually Shows Up

- Devices and services still running a vendor-shipped default credential that was never changed
  after deployment — routers, admin panels, IoT devices.
- Dictionary attacks trying common passwords and predictable variations against a standard login
  form.
- Targeted guessing informed by known personal details about a specific person (sometimes called
  credential guessing rather than pure brute force).
- API endpoints and secondary admin interfaces that were built without the same rate-limiting and
  lockout protections applied to the organization's primary, more visible web login.

## Why It Keeps Succeeding

Default credentials on deployed devices and services are extremely common in real environments and
are rarely audited as a routine practice. Separately, authentication endpoints outside the obvious
main login page — an internal API, a secondary admin panel added later — often don't inherit the
lockout and rate-limiting protections that were carefully built into the primary login, simply
because nobody thought to apply the same standard everywhere authentication happens.

## How to Detect It

1. A high volume of failed authentication attempts against a single account, or from a single
   source, in a short time window is the clearest signal.
2. Sequential or dictionary-pattern attempts (trying alphabetically ordered strings, or a known
   common-password list) are a distinguishable signature from normal human typos.
3. Explicitly check authentication endpoints beyond the obvious main login page — internal APIs,
   admin panels, device management interfaces — since these are exactly where lockout protections
   are most often missing.
4. Confirm whether a lockout or rate limit actually triggers under a real, controlled test, rather
   than assuming it does because it's documented as a feature.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Device or panel still using an unchanged vendor default credential | Near-certain compromise — no guessing required once the default is known |
| Weak, common password with no account lockout | High likelihood of eventual compromise given enough attempts and time |
| Well-chosen, unique password with lockout/exponential backoff enabled | Attack becomes impractically slow; not a realistic path to compromise |
| API endpoint with no rate-limiting, regardless of password strength on the primary web login | The unprotected endpoint is the real exposure — the strong password on the main login is irrelevant if this door was never locked |

## Why a Business Should Care

Brute force is one of the cheapest attack classes to prevent almost entirely — account lockout, MFA,
and simply not shipping default credentials closes most of it — yet it remains one of the most common
findings in real security assessments, precisely because the protection is assumed to already exist
everywhere it needs to, and often isn't checked on the interfaces that aren't the obvious, primary
login. The useful conversation with a client isn't "do we have strong passwords," it's "have we
actually verified lockout works, everywhere authentication happens, not just on the login page
everyone remembers to secure."

## A Worked Example

*(Generalized from common industry patterns. Company and identifiers below are invented.)*

During an authorized assessment of Halvorsen Logistics' internal network, a tester discovers a
network-attached device management interface exposed on an internal subnet. The interface presents
a standard login form. A quick check against publicly documented default credentials for that class
of device succeeds immediately — the device was deployed with its factory-default administrator
password still active.

From that interface, the tester confirms read access to device configuration data, including network
topology information that would meaningfully aid further lateral movement in a real attack. Testing
stops at confirming this access; no further action is taken to change configuration or expand access
beyond what's needed to demonstrate the finding is real.

## Severity Calibration

This finding rates **Medium**, reflecting real but bounded impact: the compromised interface exposed
configuration and network information useful for further attack planning, but not direct access to
customer data or critical business systems on its own. An identical default-credential finding on an
internet-facing system, or one granting direct access to sensitive data, would rate meaningfully
higher — the technique (guessing a known default) is trivial either way; the demonstrated reach is
what actually sets severity.

## Prevention & Response

The real fix is account lockout or exponential backoff after a small number of failed attempts,
mandatory MFA, and a hard rule that no device or service ships or stays deployed with a default
credential. Current password-length guidance (NIST SP 800-63B) also favors longer, unique passwords
over composition-rule complexity.

The common inadequate fix is enforcing complex password composition rules (special characters,
mixed case) without an actual lockout mechanism. Composition rules raise the guessing difficulty
marginally; an unthrottled login endpoint means an attacker simply has more time, not that they're
stopped.

## Related Attacks & Vulnerabilities

- [Credential Stuffing](../credential-stuffing/) — the related technique that replays already-known,
  real credentials instead of guessing new ones.
