---
title: Session Hijacking
summary: How reusing a valid, already-authenticated session token grants full account access without the victim's password, and why this is so often the real consequence of another flaw.
capec: []
mitreAttack: ["T1539"]
typicalSeverityCeiling: High
related: ["man-in-the-middle", "dns-spoofing"]
relatedVulnerabilities: ["cross-site-scripting"]
status: published
datePublished: 2026-09-18
---

## Definition

Session hijacking is the theft or reuse of a valid, already-authenticated session token to
impersonate a logged-in user, without ever needing that user's actual password. MITRE ATT&CK
catalogues this as T1539, "Steal Web Session Cookie." Once an attacker holds a legitimate session
token, the application has no way to tell them apart from the real, originally-authenticated user,
because that token is the only thing the application actually checks after login.

## What Makes It Work

A session token is what security engineers call a *bearer credential*: whoever presents it is treated
as authenticated, by design, for the lifetime of that session. That design choice is what makes
modern web applications usable at all (nobody wants to re-enter a password on every single page
load), but it carries a quiet assumption along with it: that the token stays exactly where it's
supposed to be, moving only between the legitimate browser and the legitimate server, and never
anywhere an attacker could read it.

The moment that token is exposed anywhere outside that channel, intercepted in transit, read out of
the browser by a malicious script, or simply left valid indefinitely with no expiry, the assumption
silently fails, and authentication integrity breaks for the remainder of that token's usable
lifetime. Notably, the login step itself doesn't have to fail at all for this to happen; the
password can be perfectly strong, MFA can have worked correctly, and the account can still be fully
compromised, because the attacker never needed the password in the first place.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-session-hijacking" style="width:100%;height:auto;">
<title id="diagram-title-session-hijacking">A user logs in and receives a session token; the token is exposed through an unrelated flaw, and an attacker replays it to be treated as the authenticated user without ever knowing the password.</title>
<defs>
<marker id="arrow-session-hijacking" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User logs in,</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">gets session token</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-session-hijacking)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Token exposed</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">(e.g. via XSS)</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-session-hijacking)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker replays</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">stolen token</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-session-hijacking)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">App treats attacker</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">as the real user</text>
</svg>
<figcaption>The password and MFA step never come back into play: the token alone is what the application actually checks.</figcaption>
</figure>

## Where It Actually Shows Up

- **Interception over an unencrypted connection.** A session token sent over plain HTTP, or over
  HTTPS with weak certificate validation, can be read directly off the wire. See
  [Man-in-the-Middle](../man-in-the-middle/) for how that interception itself typically happens.
- **Theft via a cross-site scripting flaw.** This is one of the most common real-world routes to
  session hijacking in practice: a [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/)
  vulnerability lets an attacker run script in a victim's browser, and that script can read a session
  token directly out of storage the browser exposes to page scripts, then send it straight to the
  attacker.
- **Tokens that never expire or rotate.** A session token issued once and left valid indefinitely
  gives an attacker who obtains it, by any method, an unbounded window in which to use it.

## Why It Keeps Succeeding

Developers frequently treat "the user successfully authenticated" as the end of the security story,
pouring attention into the login flow (password strength, MFA, rate limiting on login attempts)
while paying much less attention to protecting the token that represents that successful login
afterward. A long-lived, non-rotating token is often chosen deliberately for convenience (fewer
forced re-logins, a smoother user experience), without an equally deliberate acknowledgment that this
choice directly extends how long a stolen token stays useful to an attacker.

## How to Detect It

1. Monitor for anomalous session activity: a session suddenly active from a new geographic location,
   device, or IP address inconsistent with how that user's session began, particularly right after a
   burst of unusual application behavior.
2. Check whether session tokens ever appear somewhere they shouldn't: server logs, URLs (tokens
   should never be passed as URL parameters, since URLs get logged and cached in many places by
   default), or client-side storage that's readable by any script running on the page.
3. During a security assessment, directly test whether a captured session token remains valid after
   the legitimate user logs out, after a plausible period of inactivity, and from a different network
   location. Each of these should invalidate or at least flag the token, and often doesn't.
4. Test whether the application is affected by a cross-site scripting flaw at all, since that's
   frequently the actual root cause behind a session hijacking finding rather than a separate,
   unrelated issue.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Session token is short-lived, rotates regularly, and is protected by HttpOnly and Secure cookie flags | Even if briefly exposed, the token's usable window is small and script-based theft is blocked outright |
| Session token is long-lived with no rotation, but transport is fully encrypted and validated | Exposure requires a separate flaw (like XSS) to actually read the token, but once exposed, remains usable for a long time |
| Session token is exposed via a cross-site scripting flaw on the same application, with no HttpOnly protection | Full account impersonation with no password or MFA bypass required at all: the most direct and severe realistic outcome |

## Why a Business Should Care

A great deal of what gets reported publicly as a vague "account takeover" or "hack" is, mechanically,
this: not a broken password, but a stolen token. Explaining this distinction to a client matters
because it redirects the conversation toward the actual fix. If the root cause is a cross-site
scripting flaw exposing tokens to script, then investing more in password policy or MFA, while still
valuable for other reasons, does nothing to close this specific hole. The fix has to address where
the token can be exposed and how long it stays valid once it is, not just how hard it was to log in
in the first place.

## A Worked Example

*(Generalized from real engagement patterns. Company, product, and identifiers below are invented;
no real system, client, or data is referenced.)*

Verdant Outfitters runs a customer account portal. During an assessment, a stored cross-site
scripting flaw is confirmed on a product review field: a review submitted with an embedded script
payload executes in the browser of any other user who later views that product page, as documented in
full on the dedicated Cross-Site Scripting page.

Extending that finding, the tester confirms the application's session token is stored in a location
the page's own script can read, with no HttpOnly flag set to prevent that access. Using a
non-destructive test payload on an account created specifically for the assessment, the script is
shown to be capable of reading the session token and transmitting it to a test endpoint under the
tester's control, demonstrating, without touching any real customer session, that the same technique
would let an attacker capture and reuse another user's live session token.

Testing stops at this proof: no real customer's session is ever targeted, and the demonstration uses
only the tester's own test account throughout.

## Severity Calibration

This instance rates **High**: full account impersonation is demonstrated, but it depends entirely on
the underlying cross-site scripting flaw as its delivery mechanism rather than being independently,
directly exploitable, and fixing the XSS flaw closes this specific path as well. It would rate the
account-impersonation outcome as Critical in its own right if the impersonated accounts held elevated
privileges (an administrator session, for example) rather than an ordinary customer account, since
severity here tracks what a hijacked session actually grants, not the hijacking mechanism alone.

## Prevention & Response

The real fix is short-lived, regularly rotating session tokens; HttpOnly and Secure cookie flags, so
that neither client-side script nor an unencrypted connection can expose the token; enforced
encryption in transit everywhere; and, for higher-sensitivity applications, binding a session to
additional context (such as consistent device characteristics) so a token alone isn't sufficient if
replayed from an inconsistent context.

The common inadequate fix is issuing long-lived tokens with no rotation and treating that as an
acceptable tradeoff because "otherwise the user would have to log in too often," without ever
naming that tradeoff explicitly or measuring how much exposure window it actually creates.

## Related Attacks & Vulnerabilities

- [Man-in-the-Middle (MITM)](../man-in-the-middle/): one of the two most common ways a session
  token is actually intercepted in the first place.
- [DNS Spoofing and Poisoning](../dns-spoofing/): a technique that can redirect a victim to an
  attacker-controlled destination capable of capturing session tokens or credentials.
- [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/): the vulnerability class most
  frequently responsible for exposing a session token directly out of the browser.
