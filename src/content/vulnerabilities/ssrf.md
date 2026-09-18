---
title: Server-Side Request Forgery (SSRF)
surface: "WebApp Security"
summary: How convincing a server to make a request on an attacker's behalf turns a simple "fetch this URL" feature into a way to reach systems the attacker could never reach directly.
owasp: "A10:2021 – Server-Side Request Forgery (SSRF)"
cwe: ["CWE-918"]
typicalSeverityCeiling: Critical
related: ["sql-injection", "exposed-cloud-credentials"]
status: published
datePublished: 2026-09-18
---

## Definition

Server-side request forgery happens when an application fetches a remote resource based on a URL a
user supplies, without validating or restricting where that fetch can actually go. The attacker never
sends the malicious request themselves; they convince the server to send it on their behalf, using
the server's own network position to reach places the attacker could never reach directly.

## The Trust Boundary That Breaks

Developers building a "fetch this URL" feature, a webhook validator, an image-from-URL uploader, a
PDF generator that loads a page, trust that the feature will only ever be pointed at legitimate,
external resources. The server making the request has no inherent way to distinguish a legitimate
external URL from an internal-only address or a cloud provider's metadata endpoint. Both are just
strings that look like URLs. The server itself can reach both; the external attacker who supplied the
URL cannot reach either directly, which is exactly why getting the server to make the request for
them is valuable.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-ssrf" style="width:100%;height:auto;">
<title id="diagram-title-ssrf">How a server-side fetch feature is redirected toward an internal-only destination</title>
<defs>
<marker id="arrow-ssrf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User supplies</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">internal address</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ssrf)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Server fetches</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">it on their behalf</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ssrf)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Internal-only</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">endpoint responds</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ssrf)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Response returned</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">to the attacker</text>
</svg>
<figcaption>The attacker never touches the internal endpoint directly. The server does it for them.</figcaption>
</figure>

## Where It Actually Shows Up

- **Image or file "fetch from URL" features** that accept any user-supplied address and retrieve its
  contents server-side, with no restriction on destination.
- **Webhook and callback URL validators** that fetch a supplied endpoint to confirm it's reachable,
  which is functionally identical to an attacker-controlled fetch feature if the destination isn't
  restricted.
- **PDF generation or link preview tools** that load a supplied page server-side to render or extract
  content from it.
- **Cloud environments specifically**, where a compromised fetch feature can reach a cloud provider's
  metadata endpoint, an address the instance itself can reach but the outside internet cannot (see
  [Cloud Security](../../domains/cloud-security/)).

## Why It Keeps Happening

A "fetch a URL" feature is genuinely useful and common, and validating that a supplied string is
syntactically a URL feels, to a developer building it quickly, like the same thing as validating that
it's a *safe* destination. It isn't. A hostname can resolve to an internal address; a redirect from an
allowed domain can land somewhere entirely different; the same request-making code path is often
reused across features without anyone revisiting its destination restrictions each time.

## How to Find It

1. Identify every feature that fetches a resource based on a user-supplied URL, including indirect
   ones like webhook validators and link previews, not just obvious "upload from URL" buttons.
2. Test whether internal-only or link-local addresses are reachable through the feature, using a
   controlled test destination rather than a real internal system.
3. Test whether the restriction, if one exists, is enforced after DNS resolution rather than on the
   string as typed, since a hostname can resolve to a different address than it appears to point to.
4. In cloud environments, test specifically whether the feature can reach the instance metadata
   service, since that's frequently the highest-value destination reachable this way.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Fetch feature restricted to a strict allowlist of external domains, validated after DNS resolution | Attack surface effectively closed; there's no internal destination to redirect the request to |
| Fetch feature with a denylist of "known bad" addresses only | Bypassable through alternate IP encodings, redirects, or DNS tricks; provides limited real protection |
| Fetch feature reaching a cloud instance's metadata endpoint | Potential exposure of temporary credentials scoped to whatever that instance is permitted to do |
| Fetch feature reaching an internal admin interface with no external exposure otherwise | A path to an interface that was never designed to be reachable from outside the network at all |

## Why a Business Should Care

SSRF is one of the more counterintuitive findings to explain to a client, because the vulnerable
feature itself often looks completely benign: an image upload, a link preview, a webhook check. The
useful framing is that any feature making a server-side request on a user's behalf is, by definition,
giving that user indirect network access from the server's own position, and that access needs the
same scrutiny as a direct network connection would get, not less scrutiny because it's wrapped in a
convenience feature.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

Brindlewood Media's application includes a profile picture feature that fetches a user-supplied image
URL server-side and stores the result. During an assessment, supplying a cloud metadata service
address in place of a real image URL causes the server to fetch and return metadata service content
instead of an image, confirming the internal-only endpoint is reachable through the feature.

Testing stops at confirming that this internal-only endpoint responds through the flaw. No credentials
or further data are extracted from the metadata response; proving reachability is sufficient to
demonstrate the finding without pursuing anything beyond it.

## Severity Calibration

Severity depends heavily on what's actually reachable through the flaw, not on the existence of the
flaw alone. Reaching a cloud metadata endpoint capable of yielding live credentials typically justifies
a Critical rating; reaching only a low-value internal status page with no further access potential
rates meaningfully lower, even though the underlying coding pattern is identical in both cases.

## Remediation

The real fix is a strict allowlist of permitted destination domains or IP ranges for any server-side
fetch feature, validated after DNS resolution rather than on the string as typed, combined with
network-level restrictions on what the fetching service can reach at all. The common bad fix is a
denylist of "known bad" addresses, which is trivially bypassed with alternate IP encodings, open
redirects, or DNS tricks that resolve differently at request time than they appeared to at validation
time.

## Related Classes

- **SQL Injection** ([../sql-injection/](../sql-injection/)): a different technical mechanism, but the
  same underlying pattern of trusting where a value points rather than validating what it actually
  resolves to.
- **Exposed Cloud Credentials & Secrets Sprawl** ([../exposed-cloud-credentials/](../exposed-cloud-credentials/)):
  reaching a cloud metadata endpoint through this flaw is one runtime path to the same outcome that
  class covers from a storage-at-rest angle, live cloud credentials ending up somewhere they shouldn't.
