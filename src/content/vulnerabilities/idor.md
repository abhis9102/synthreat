---
title: Insecure Direct Object Reference (IDOR)
category: "Access Control"
summary: How changing an ID in a request lets an attacker reach another user's data, and why this is the single most common real-world access control pattern.
owasp: "A01:2021 – Broken Access Control"
cwe: ["CWE-639"]
typicalSeverityCeiling: Critical
related: ["broken-access-control"]
status: published
datePublished: 2026-09-18
---

## Definition

Insecure Direct Object Reference (IDOR) is the specific, most common real-world pattern behind
[Broken Access Control](../broken-access-control/): a request references an internal object, a
record ID, a file, a database key, directly and visibly, and changing that reference gives an
attacker access to a different object they were never authorized to reach. That page already
introduced the general category with an invoice-ID example; this page goes deeper on IDOR
specifically, since it is the pattern testers encounter constantly across nearly every kind of
application.

## The Trust Boundary That Breaks

The application trusts that if a request presents a valid ID alongside a valid session, the
requester must be asking about their own data. There is no second check confirming that the
specific object referenced actually belongs to that specific authenticated user. A valid session
proves identity; it says nothing about which of the millions of records in the system that identity
is entitled to touch, and IDOR is what happens when a codebase quietly treats those two facts as one.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-idor" style="width:100%;height:auto;">
<title id="diagram-title-idor">A tester swaps an ID across three different request locations to confirm the same missing ownership check everywhere</title>
<defs>
<marker id="arrow-idor" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">ID swapped in</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the URL path</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-idor)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">ID swapped in</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the request body</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-idor)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">No ownership</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">check in either</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-idor)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Both return</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">another user's data</text>
</svg>
<figcaption>Testers often check only the visible URL. The same missing check usually sits in the request body too.</figcaption>
</figure>

## Where It Actually Shows Up

- **Sequential numeric IDs** in URLs or API paths, the easiest variant to spot and the easiest for a
  developer to underestimate, since incrementing a number feels too simple to be a real
  vulnerability.
- **IDs embedded in hidden form fields**, invisible in the rendered page but fully editable once a
  request is intercepted or resubmitted directly.
- **IDs referenced inside API request bodies rather than URLs**, frequently missed during testing
  because attention naturally goes to the visible URL first and the body gets assumed safe by
  association.
- **GraphQL or REST endpoints that return an object by ID with no ownership check performed**,
  especially on newer API surfaces added after the original ownership-check pattern was already
  established elsewhere and never carried forward.

## Why It Keeps Happening

An ownership check is easy to add when an endpoint is first written and easy to forget when a
similar endpoint is added later, especially by a different developer working from a copied template
that only resembles the original. Refactors are a second common failure point: an endpoint gets
restructured for performance or code reuse, and the ownership check that used to live inline
quietly does not make it into the new version. Developers also sometimes reason that a hard-to-guess
identifier is protection enough. It is not. A shape that is hard to guess is not the same thing as a
server-side check that verifies who is allowed to see it.

## How to Find It

1. For every endpoint that accepts an object identifier, note a record legitimately owned by one
   test account, then attempt the identical request using a second, authorized test account's ID in
   its place.
2. Confirm the response is properly rejected, not just that it looks different. A generic-seeming
   error can still leak the other account's data lower in the response body.
3. Repeat the test against every location an ID could appear on that same request: the URL path,
   query parameters, the request body, and any custom headers. Filtering is very often applied to
   only one of these, not all of them.
4. Test state-changing requests (edit, delete) with the same swapped ID, not only reads. An endpoint
   that correctly blocks viewing another user's record can still fail to block editing or deleting
   it.
5. Once one endpoint on an application is confirmed vulnerable, check sibling endpoints built from
   the same template or helper function; the same missing check is frequently repeated across all of
   them.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| IDOR on a low-sensitivity, publicly-adjacent object (a display name, a public comment) | Limited exposure; a real finding, but bounded in what it actually reveals |
| IDOR on a financial record, an invoice, or a document containing personal data | Serious privacy and regulatory exposure, scaled by how many records are sequentially reachable |
| IDOR reachable through the request body on an endpoint whose URL-based variant was already fixed | Proof that a partial fix left the same underlying gap open through a different door |
| IDOR allowing edits or deletes, not just reads, on another user's records | Data integrity failure layered on top of exposure; an attacker can alter what they were never authorized to touch |

## Why a Business Should Care

IDOR is consistently among the most common findings in real assessments precisely because it
requires no special tooling, no exotic payload, and no deep technical skill: just a predictable
identifier and the willingness to change it. For a client, the important framing is that this class
scales with data volume automatically. One missed ownership check on a customer-record endpoint is
not a single leaked record; it is a repeatable template an attacker can run against every other ID
in the same range, which is exactly why findings in this class have produced some of the largest
mass data exposures on record, not because the technique is sophisticated, but because it is
trivially repeatable once found.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
client, system, or data is referenced.)*

Ferngate Retail's customer portal lets authenticated shoppers view their own order history through
an internal API call that submits an `order_id` value in the request body rather than the URL,
`POST /api/orders/details`. The visible page URL never changes and gives no hint that an ID is being
passed at all.

Intercepting and replaying that request with the `order_id` value changed to a number one higher
than the logged-in test account's own most recent order returns a complete order belonging to a
different, unrelated test account: shipping address, item list, and a masked but present payment
reference. The endpoint checks only that a valid session exists; it never checks whether the
session's owner actually placed that specific order.

Testing continues by sampling a small, deliberately limited range of adjacent IDs to confirm the
pattern holds consistently, and by confirming the same missing check exists on the corresponding
order-cancellation endpoint, which would allow not just viewing but cancelling another customer's
order. Testing stops there: enough evidence exists to prove the entire order range is reachable and
that write access is also exposed, without harvesting further real customer data beyond what was
needed to demonstrate both findings.

## Severity Calibration

This instance rates **Critical**: reachable by any authenticated low-privilege account, demonstrated
against real financial and personal data across more than one record, and additionally shown to
expose a state-changing action (order cancellation), not just a read. A version of the same pattern
reaching only a single, low-sensitivity, non-enumerable field would rate meaningfully lower; the
sensitivity of what is reached and whether the flaw is demonstrably repeatable across a range, not
the mechanics of swapping an ID, are what set the actual rating.

## Remediation

The real fix is a server-side ownership check on every object access, verifying that the referenced
ID actually belongs to the authenticated requester, applied consistently regardless of whether the
ID arrived in the URL, the body, or a header. This is best implemented once, in a shared
authorization layer every endpoint calls through, rather than re-implemented by hand on each new
endpoint.

The common bad fix is switching from sequential integers to random UUIDs as the only defense. That
is obscurity, not access control. A UUID leaked once through a log file, a referrer header, or a
shared link is exactly as exploitable as a sequential ID the moment someone else has it, because the
actual missing ownership check was never addressed.

## Related Classes

- **Broken Access Control**: this page is the specific, most common realization of that broader
  category; see it for horizontal and vertical privilege escalation patterns beyond direct object
  references.
