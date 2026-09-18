---
title: Broken Access Control
surface: "WebApp Security"
summary: How an app that correctly identifies a user can still let them reach data or actions they were never authorized for.
owasp: "A01:2021 – Broken Access Control"
cwe: ["CWE-284", "CWE-639"]
typicalSeverityCeiling: Critical
related: ["sql-injection", "cross-tenant-isolation-failure"]
status: published
datePublished: 2026-09-18
---

## Definition

Broken access control happens when an application correctly figures out who a user is (authentication works fine) but fails to correctly enforce what that specific user is allowed to do or see (authorization fails). The login worked. The problem is everything that was supposed to happen after it.

## The Trust Boundary That Breaks

Most developers build a clear check for "is this request coming from someone who's logged in." Far fewer build an equally consistent check for "is this specific logged-in user allowed to touch this specific record." Those are two different questions, and a codebase can answer the first one perfectly on every single endpoint while quietly skipping the second on just a handful of them.

The trust boundary that actually needs to hold is per-record, not per-session: a valid session proves identity, nothing more. The moment a developer treats "has a valid session" as equivalent to "is authorized for this exact resource," that boundary is gone, and the only thing standing between an attacker and someone else's data is whatever value happens to sit in a URL or request body.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-broken-access-control" style="width:100%;height:auto;">
<title id="diagram-title-broken-access-control">A logged-in user edits an ID in a request and reaches another customer's record because ownership is never rechecked</title>
<defs>
<marker id="arrow-broken-access-control" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User logs in,</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">views invoice 1041</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-broken-access-control)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User edits URL</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">to invoice 1042</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-broken-access-control)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Server checks:</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">session valid?</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-broken-access-control)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Returns another</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">customer's data</text>
</svg>
<figcaption>The session check passes at step 3. Nothing ever asks whether this user owns invoice 1042.</figcaption>
</figure>

## Where It Actually Shows Up

- **Direct object references**: endpoints like `/api/invoices/1042` or `/documents/edit?id=1042`, where the ID itself is the only thing standing between a user and someone else's record.
- **Horizontal privilege escalation**: a regular user reaching another regular user's data, without any elevation in role, just a different record.
- **Vertical privilege escalation**: a regular user reaching admin-only functionality, often because an admin endpoint checks for a valid session but never checks the session's role.
- **Client-side-only enforcement**: a "hidden" admin button or disabled form field that's absent from the rendered page but whose backend endpoint never independently verifies the caller's privilege level, so the check can simply be skipped by calling the API directly.

## Why It Keeps Happening

Authorization logic is easy to write once and easy to forget to repeat. A developer adds a proper ownership check on the first version of an endpoint, then a second, similar endpoint gets added later (often by a different person, under deadline pressure) that copies the general shape of the first but omits the ownership check, because it "obviously" needs the same protection and nobody circled back to confirm it actually has it. Authorization, unlike authentication, rarely lives in one central, reusable place; it has to be re-implemented correctly on every single endpoint that touches user-specific data, and consistency is genuinely hard to maintain at scale.

## How to Find It

1. Enumerate every endpoint that accepts an identifier (an ID, a UUID, a filename) referencing a specific record.
2. Using a valid, authorized test account, note a record it legitimately owns, then swap in the identifier for a different record owned by a separate, unrelated test account.
3. Confirm the response is properly rejected. A generic error page is not proof of rejection; check that no unauthorized data was actually returned in the response body, since some endpoints fail "gracefully" on the surface while still leaking data underneath.
4. Repeat the same test for state-changing requests (edit, delete), not just reads: an endpoint that correctly blocks viewing another user's record can still fail to block editing or deleting it.
5. Test vertical escalation separately: using a low-privilege account, call admin-only endpoints directly rather than relying on the UI to hide them.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| IDOR on a low-sensitivity, read-only resource | Limited exposure of non-sensitive data; still a real finding, but bounded |
| IDOR on financial, health, or personal records, read access only | Serious privacy and regulatory exposure, scaled by how many records are sequentially or predictably enumerable |
| IDOR allowing edits or deletes on another user's records | Data integrity failure on top of exposure; an attacker can alter or destroy what they were never authorized to touch |
| Vertical escalation reaching genuine administrative functionality | Full compromise of the application's own trust model; the attacker now operates with the application's highest privilege level |

## Why a Business Should Care

Broken access control is consistently one of the most common findings across real-world assessments, and it is often the cheapest class of finding for an attacker to exploit: no exotic payload is required, just a predictable ID and a willingness to change it. For a client, the useful framing is that this class scales with data volume. A single missed ownership check on a customer-record endpoint is not a one-off leak; it is a template an attacker can run against every sequential ID in the system, which is exactly why a single broken endpoint of this kind has produced some of the largest mass data exposures on record. It is also a class where "our authentication is strong" gives a client zero reassurance, since the entire failure happens after authentication succeeds.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real client, system, or data is referenced.)*

Harrow Ridge Billing runs a customer portal where authenticated users view their own invoices at `GET /api/invoices/{id}`. Logging in as a legitimate test account and viewing that account's own invoice returns the expected record at, for example, ID 4471.

Incrementing the ID by one, to 4472, while still authenticated as the same test account, returns a complete invoice belonging to a different, unrelated customer: full billing address, itemized charges, and the last four digits of a payment method. The endpoint checks only that a valid session exists; it never checks whether the session's owner actually owns invoice 4472.

Testing continues by sampling a handful of further sequential IDs, confirming the pattern holds consistently rather than being a one-off anomaly, and confirming the same flaw exists on the equivalent PDF-download endpoint. Testing stops there: enough evidence exists to prove the entire invoice range is enumerable, without actually harvesting real customer data beyond what was needed to demonstrate the finding.

## Severity Calibration

This instance rates **Critical**: unauthenticated in the sense that matters most (any valid low-privilege account, not just a compromised admin account, can reach it), trivially exploitable by anyone who can count, and demonstrated against real financial and personal data across a range of sequential IDs rather than a single isolated record. A version of this same bug on a resource containing nothing sensitive, or requiring a non-sequential, non-guessable identifier that isn't practically enumerable, would rate meaningfully lower; the identifier's predictability and the data's sensitivity are doing the real work in this rating, not the vulnerability class by itself.

## Remediation

The real fix is enforcing an ownership or permission check on every request that references a specific record, implemented server-side, on every endpoint, every time, ideally through a shared, centrally-tested authorization layer rather than hand-rolled per endpoint. Using non-sequential, non-guessable identifiers (a UUID rather than an incrementing integer) is a reasonable defense-in-depth layer on top of that, but it is not a substitute for it: a UUID that leaks once through logs, referrer headers, or a different flaw is just as exploitable as a sequential ID if the ownership check itself is still missing.

The common bad fix is relying on obscurity: assuming that because an ID is a long random-looking string, or because a link is not directly advertised anywhere in the UI, nobody will find it. Anything reachable by a request from an authenticated session is reachable by an attacker with a valid account of their own, and obscurity alone has never been a real access control.

## Related Classes

- **SQL Injection**: a structurally different root cause, but access control failures are frequently what a chained SQL injection exploit ultimately unlocks once an attacker is inside a system.
- [Insecure Direct Object Reference (IDOR)](../idor/): the single most common real-world realization of this exact vulnerability class, covered in its own dedicated depth.
- [Cross-Site Request Forgery (CSRF)](../csrf/): a different mechanism for reaching the same outcome, tricking a user's own browser into an unauthorized action rather than directly manipulating an object reference.
- [Path Traversal](../path-traversal/): another access-control failure, at the filesystem layer instead of the object-reference layer.
- [Open Redirect](../open-redirect/): a lower-severity, but structurally related, access-control gap around trusting an unvalidated destination.
- [Cross-Tenant Isolation Failure](../cross-tenant-isolation-failure/): the same missing-authorization-check pattern at the scale of an entire customer tenant on a shared platform, rather than a single object or user.
