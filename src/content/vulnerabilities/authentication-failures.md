---
title: Identification and Authentication Failures
surface: "Web Application"
summary: How weaknesses in confirming who someone is, not in what they're allowed to do once confirmed, open the door to account takeover at scale.
owasp: "A07:2021 – Identification and Authentication Failures"
cwe: ["CWE-287", "CWE-384"]
typicalSeverityCeiling: Critical
related: []
status: published
datePublished: 2026-09-18
---

## Definition

Identification and authentication failures are weaknesses in the process of proving who someone is,
as distinct from broken access control, which is about what an already-identified user is allowed to
do. This class covers the login form, the password reset flow, the session token issued after a
successful login, and every account-recovery path, since a single weak link in any of those breaks
the whole chain of trust the rest of the application depends on.

## The Trust Boundary That Breaks

The assumption most applications make is that a successful login is a strong, durable proof of
identity for the entire session that follows. That assumption only holds if every part of the
authentication process is protected equally: the credentials themselves, the session token issued
afterward, and the recovery paths that exist for when a legitimate user loses access. In practice,
teams often harden the login form carefully (password rules, lockouts) while leaving the token that
represents a successful login, or the recovery flow that bypasses it entirely, far less protected.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-authentication-failures" style="width:100%;height:auto;">
<title id="diagram-title-authentication-failures">A session identifier passed in a URL parameter ends up logged and exposed, bypassing the login step entirely for whoever obtains it</title>
<defs>
<marker id="arrow-authentication-failures" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User logs in,</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">ID placed in URL</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-authentication-failures)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">URL logged by</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">server and browser</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-authentication-failures)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Identifier reaches</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">someone else</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-authentication-failures)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Session reused,</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">login step skipped</text>
</svg>
<figcaption>The password never had to be attacked at all: the token carrying it around was the actual weak point.</figcaption>
</figure>

## Where It Actually Shows Up

- No multi-factor authentication available or enforced, leaving a password as the single point of
  failure for account access.
- Session identifiers passed as URL parameters rather than in cookies, which means they get logged
  and cached in browser history, proxy logs, and server access logs by default.
- Predictable or non-expiring session tokens, including session fixation, where an attacker can set a
  known session identifier for a victim ahead of time.
- Weak or absent account lockout on login endpoints, which is exactly the design gap that lets
  [brute force](../../attacks/brute-force/) and [credential stuffing](../../attacks/credential-stuffing/)
  attacks run unthrottled at scale.
- Password recovery flows that reveal whether a given email address has a registered account, or that
  rely on a weak secondary verification step easily answered from public information.

## Why It Keeps Happening

Teams frequently put real effort into hardening the login form itself: complexity rules, rate
limiting, sometimes MFA, while treating everything that happens after a successful login as a solved
problem. The session token that represents that login, and the recovery flow that exists for when a
user forgets their password entirely, often get far less scrutiny, precisely because they don't feel
like "the authentication step" even though they're functionally just as capable of granting access.

## How to Find It

1. Check whether session identifiers ever appear in a URL rather than exclusively in a cookie; if
   they do, they're already exposed to logging and caching by default.
2. Test whether an account lockout or rate limit actually triggers under a real, controlled attempt,
   rather than assuming it works because it's documented as a feature.
3. Attempt to set a known session identifier before a victim logs in, then check whether that same
   identifier remains valid and authenticated afterward, which would confirm session fixation.
4. Test the password recovery flow specifically for information leakage: does it respond differently
   for a registered email versus an unregistered one, and how strong is any secondary verification
   step it relies on.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| MFA enforced, session tokens only in secure cookies, lockout confirmed working | Attack surface for this class is largely closed even if a password is individually weak |
| No MFA, but strong lockout and secure session handling | Reduced but real risk, mainly from credential stuffing against reused passwords elsewhere |
| Session identifier exposed via URL, no MFA | Full account takeover possible for anyone who obtains a logged or cached URL, no password needed |
| Recovery flow leaks account existence and uses weak secondary verification | Account takeover path that bypasses the primary login and its protections entirely |

## Why a Business Should Care

This class is where "we have a strong login page" can create false confidence, because the login
form is rarely the actual weakest point once it's had real attention. The parts of authentication
that get skipped, session handling and recovery flows especially, are just as capable of granting
full account access, and a client who only asks about password strength is asking the wrong question.
The right framing for a client conversation: authentication is the whole chain, not just the door.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

Corvale Health's patient portal issues a session identifier that is included directly in the URL
after login, rather than set as a cookie. During testing, this identifier is found in the web
server's own access logs and, separately, in a colleague's browser history after a portal link was
shared over an internal chat tool, confirming the exposure happens through completely ordinary,
everyday use rather than requiring any active interception.

Using a captured identifier from the access logs, the tester confirms it remains valid and
authenticated when replayed from a different device and network, demonstrating that anyone who
obtains a logged URL, through any of the normal channels URLs travel through, can impersonate that
user without ever needing their password.

Testing stops at confirming replay works against a test account created specifically for this
assessment. No real patient session is ever captured or reused, and no actual patient data is
accessed, since proving the mechanism is sufficient without touching anything real.

## Severity Calibration

This instance rates **Critical**: unauthenticated in the sense that no password is required once a
session identifier is obtained, realistically exploitable through completely ordinary log and browser
history exposure rather than a contrived scenario, and demonstrated against a real patient portal
handling health data specifically, which raises both the practical impact and the regulatory stakes.
The same design flaw on an application with no sensitive data behind it would rate lower.

## Remediation

The real fix is enforcing MFA wherever the sensitivity of the account justifies it, issuing session
tokens exclusively through secure, HttpOnly cookies rather than URLs, implementing account lockout or
exponential backoff on every authentication endpoint, and building recovery flows that don't reveal
whether an account exists and don't rely on weak secondary verification.

The common bad fix is relying on password complexity requirements alone while leaving session
handling and recovery flows unexamined, as if a strong password policy compensates for a session
token that was never actually protected after issuance.

## Related Classes

- **Broken Access Control**, the closely related but distinct class covering what an authenticated
  user is allowed to do, as opposed to how that authentication happened in the first place.
- **Session Hijacking**, the attack technique that directly exploits many of the weaknesses described
  here. See [Session Hijacking](../../attacks/session-hijacking/).

*(A dedicated Broken Access Control page is planned; the link will go live once it's published.)*
