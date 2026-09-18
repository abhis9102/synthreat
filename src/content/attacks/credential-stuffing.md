---
title: Credential Stuffing
summary: Why a data breach at one company routinely becomes a working login at a completely unrelated company, and why this is the rare attack that requires no vulnerability in the target's own code at all.
capec: []
mitreAttack: ["T1110.004"]
typicalSeverityCeiling: High
related: ["brute-force", "phishing"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

Credential stuffing is the automated use of username/password pairs that leaked from a breach at one
organization, tried against the login page of a completely different, unrelated organization. It's
easy to confuse with [brute force](../brute-force/), but the mechanism is different: brute force
*guesses* at credentials it has never seen before; credential stuffing *replays* credentials the
attacker already knows are real, valid, working logins — just somewhere else.

## What Makes It Work

This is the one attack on this site where it's worth saying plainly, up front: the target's own
system can be flawlessly built, fully patched, and free of every coding mistake described elsewhere
on this site, and still be successfully attacked this way. That's because credential stuffing doesn't
exploit a weakness in the target's code at all — it exploits a weakness in human behavior that exists
completely outside the target's control: a large share of people reuse the same password across
multiple, unrelated accounts. When any one of those accounts is breached, elsewhere, by someone else,
the leaked password becomes a valid key to every other account where that same person reused it.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-credential-stuffing" style="width:100%;height:auto;">
<title id="diagram-title-credential-stuffing">How a breach at one company becomes a working login at another</title>
<defs>
<marker id="arrow-credential-stuffing" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Breach at</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Site A</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-credential-stuffing)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Credentials</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">leaked publicly</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-credential-stuffing)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Automated replay</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">against Site B</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-credential-stuffing)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Reused password</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">still works</text>
</svg>
<figcaption>Site B never had a vulnerability — the reused password was the whole attack.</figcaption>
</figure>

## Where It Actually Shows Up

- Automated tooling running millions of leaked username/password pairs against a single login
  endpoint, typically distributed across a large number of source IPs specifically to evade simple
  per-IP rate-limiting.
- Login endpoints for services holding a stored payment method, loyalty points, or gift card balance
  — anywhere a successfully taken-over account has direct resale or spending value to the attacker.
- Mobile app API endpoints that authenticate the same way a web login does, but were built later and
  never received the same rate-limiting or anomaly-detection attention as the original web login.

## Why It Keeps Succeeding

Two facts make this durable rather than a one-off risk: breach data from unrelated companies is
constantly refreshed and widely circulated, so the supply of fresh, real credential pairs never runs
out; and despite years of public awareness campaigns, password reuse across accounts remains
extremely common, because remembering a unique, strong password for every account is genuinely
inconvenient without a password manager, and most people don't use one consistently.

## How to Detect It

1. Watch for anomalous login velocity and pattern — a burst of login attempts across many different
   *accounts*, often from a narrow, related set of source infrastructure, is a distinct signature
   from ordinary user traffic.
2. Look for impossible-travel and device-fingerprint anomalies: the same account authenticating from
   two geographically implausible locations within an implausible time window.
3. Proactively check your own users' credentials against known-breach data (there are legitimate,
   privacy-respecting ways to do this, such as checking hashed password prefixes) and force a reset
   before an attacker gets there first, rather than waiting to detect the attack after it starts.
4. Monitor login success *rates*, not just volume — a credential-stuffing run typically has a very
   low success rate against any well-defended target, but a non-zero one is still a real breach per
   successful attempt.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| No MFA, no rate-limiting on the login endpoint | High success rate; every reused-password account is directly takeable |
| MFA available but not required for every account (opt-in) | Attackers succeed specifically against the subset of users who never enabled it — often the majority |
| MFA enforced for all accounts, with login anomaly detection | Individual stuffing attempts largely fail at the MFA step; detection still valuable to catch the attempt and force resets |
| Stuffing attempt detected and credentials force-reset before large-scale success | Contained to a small number of accounts rather than an account-takeover incident at scale |

## Why a Business Should Care

The single most important thing to communicate to a client about this attack is the one stated
above: a business can have objectively secure, well-built software and still suffer a real,
damaging incident through this vector, because the vulnerability being exploited belongs to the
user's password habits, not the business's code. That reframes the right question from "is our
system secure" to "what happens to *our* accounts when someone else's password habits fail
elsewhere" — a question a client can act on directly by requiring MFA, regardless of how confident
they are in their own application's code quality.

## A Worked Example

*(Generalized from common industry patterns. Company and identifiers below are invented.)*

Solandra Retail, an online storefront, notices during a routine review of authentication logs a
sustained spike in failed logins spread across thousands of distinct customer accounts, originating
from a rotating pool of a few hundred IP addresses over several hours — a pattern inconsistent with
normal customer behavior, and inconsistent with a single-account brute-force attempt.

Cross-referencing a sample of the targeted usernames (email addresses) against a public
breach-notification service confirms that a meaningful share of them appeared in an unrelated
retailer's breach roughly a year earlier. The attack is confirmed as credential stuffing, not brute
force: the same email/password combinations that had leaked elsewhere were simply being replayed here.

The success rate turns out to be low — under one percent of attempts succeed in logging in — but
because the attempt volume was so large, that low rate still represents several dozen compromised
accounts, several of which had a stored payment method on file. The response is immediate: force a
password reset on every affected account, require MFA re-enrollment, and flag the specific stored
payment methods for the affected accounts for manual review with the payment processor.

## Severity Calibration

This class of finding rates **High** when successful account takeovers with stored payment access
are confirmed, but the technique itself carries no fixed severity — an identical attack pattern
against a service with no financial data and mandatory MFA on every account would rate meaningfully
lower, because the actual, demonstrated blast radius (accounts with stored payment data, actually
taken over) is what sets the rating, not the fact that stuffing traffic was observed at all.

## Prevention & Response

The real fix is mandatory multi-factor authentication on every account, rate-limiting and anomaly
detection tuned to catch distributed low-and-slow attempts (not just high-volume single-source
attempts), and proactively screening user credentials against known-breach data at signup and
periodically afterward, forcing a reset when a match is found — before an attacker gets there.

The common inadequate response is relying on password complexity requirements alone. This does
nothing here: the passwords being used are often already long, complex, and "strong" by any
composition rule — they're real, working passwords. The problem was never that the password was
weak; it's that the same real password worked in two unrelated places.

## Related Attacks & Vulnerabilities

- [Brute Force](../brute-force/) — the closely related technique that guesses unknown credentials
  rather than replaying known-real ones.
- [Phishing](../phishing/) — one of the ways an attacker gets a fresh, unbreached set of credentials
  to begin with, rather than waiting for someone else's breach.
