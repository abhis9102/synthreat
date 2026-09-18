---
title: XML External Entity (XXE) Injection
summary: How an XML parser configured to resolve external entities lets an attacker read local files or reach internal systems through a single malicious XML document.
owasp: "A05:2021 – Security Misconfiguration"
cwe: ["CWE-611"]
typicalSeverityCeiling: Critical
related: ["ssrf", "security-misconfiguration"]
status: published
datePublished: 2026-09-18
---

## Definition

XML External Entity injection happens when an XML parser processes a document's own declared
external entities: references that tell the parser to fetch content from a local file path or a URL
and insert it directly into the parsed document. If an attacker controls the XML input an
application parses, they can define an entity pointing at a sensitive local file or an internal
network resource, and the parser will dutifully fetch and embed it, handing that content straight
back through whatever the application does with the parsed result.

## The Trust Boundary That Breaks

The application trusts that XML input is inert, structured data: tags and values, nothing more.
What it misses is that the parser's own entity-resolution feature can be repurposed by the attacker
into a general-purpose file-read or network-request primitive, entirely separate from anything the
application's own logic intended to allow. This is structurally the same failure as
[Server-Side Request Forgery](../ssrf/): a malicious entity pointing at an internal URL is an SSRF
delivered through XML parsing rather than through a dedicated "fetch this URL" feature. Same root
cause (the server trusts a destination it never validated), different delivery mechanism.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-xxe" style="width:100%;height:auto;">
<title id="diagram-title-xxe">A malicious XML document declares an external entity that the parser resolves, reading a local file or reaching an internal resource</title>
<defs>
<marker id="arrow-xxe" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker submits</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">crafted XML</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xxe)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Parser resolves</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">external entity</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xxe)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Local file or</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">internal URL read</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xxe)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Content returned</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">to attacker</text>
</svg>
<figcaption>The entity is resolved by the parser itself, before the application's own logic ever runs.</figcaption>
</figure>

## Where It Actually Shows Up

- Any feature accepting XML input directly from a user: a file-import feature, an API accepting XML
  request bodies, SOAP-based services.
- Document formats that are XML under the hood (several common office document and configuration
  file formats), where an uploaded "document" is actually parsed as XML behind the scenes.
- Legacy integration endpoints that still speak XML for backward compatibility, often maintained
  with less scrutiny than an application's primary, actively developed API.

## Why It Keeps Happening

Most mainstream XML parsing libraries historically shipped with external entity processing enabled
by default. An application using a parser's default settings is vulnerable unless a developer
specifically knew to disable the feature explicitly, which makes this fundamentally a configuration
gap rather than a coding bug in the traditional sense, and exactly why it sits under Security
Misconfiguration rather than a narrower, standalone injection category. Developers who never
touched the parser's advanced settings, because the defaults "just worked," are the ones most
likely to ship this.

## How to Find It

1. Submit a crafted XML document declaring an external entity pointing at a known, non-sensitive
   local file (something safe to read, not a genuinely sensitive path) and check whether the
   response reflects that file's content back.
2. Separately, declare an entity pointing at a controlled test endpoint you own, and check server
   logs on that endpoint for an inbound request, confirming the parser makes outbound network
   requests to resolve entities, not only local file reads.
3. Test every distinct XML-accepting endpoint independently. A parser configuration fix applied to
   one endpoint doesn't necessarily apply to a different service or library instance used elsewhere
   in the same application.
4. Stop at proof of resolution. Reading a known-safe file or confirming an outbound request to your
   own controlled endpoint is sufficient evidence; there's no need to attempt to reach a genuinely
   sensitive path to prove the class of flaw exists.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Parser resolves external entities but has no network access to anything beyond the local filesystem | High: local file disclosure, no path to reach further internal systems |
| Parser can resolve an entity pointing at an internal-only network address or service | Critical: a direct pivot into internal infrastructure the attacker could never reach directly |
| Parser can resolve an entity pointing at a cloud metadata endpoint | Critical: potential exposure of temporary cloud credentials, escalating well beyond the original application |
| A maliciously nested entity definition causes excessive resource consumption | Denial of service: the parser itself becomes the target rather than the data it processes |

## Why a Business Should Care

XXE is a good example of a vulnerability class that a business's own security posture can miss
entirely if attention stays focused on the application's custom code, since the actual gap lives in
a third-party library's default configuration, not in anything the development team wrote by hand.
Any feature that touches XML anywhere in an application, even one that seems minor or legacy, is
worth an explicit configuration check, because the ceiling on this class reaches full internal
network exposure, not just a single-file read.

## A Worked Example

*(Generalized from real assessment patterns. Company, product, and identifiers below are invented;
no real system, client, or data is referenced.)*

Ferngrove Logistics runs an "import contacts" feature that accepts an XML file upload. A submitted
document declaring an external entity pointing at a known, non-sensitive local file, one that exists
on virtually any server and reveals nothing genuinely private, returns that file's content directly
in the response, confirming the parser resolves external entities with default settings still
active.

A second test declares an entity pointing at a controlled endpoint on infrastructure the tester
owns. The controlled endpoint's own logs confirm an inbound request from the target application's
server, proving the parser also makes outbound network requests during entity resolution, not just
local file reads. Testing stops there: table existence for a genuinely sensitive internal resource
is never actually confirmed, since the two proofs already demonstrate the mechanism unambiguously.

## Severity Calibration

This instance rates **Critical** because the demonstrated outbound network request capability means
the parser can reach destinations beyond the local filesystem, which, combined with typical modern
infrastructure, very plausibly includes cloud metadata endpoints or internal-only services the
application itself was never authorized to expose. A variant limited strictly to reading local,
non-sensitive files with no outbound network capability confirmed would rate lower; the outbound
request capability specifically is what pushes this instance to the top of the scale.

## Remediation

The real fix is disabling external entity resolution and DTD processing in the XML parser's own
configuration entirely. Most modern XML libraries support this as an explicit setting, and doing so
removes the vulnerable capability at its source rather than trying to filter what reaches it.

The common bad fix is attempting to sanitize or blocklist XML input for entity-like patterns before
it reaches the parser. This is fragile against parser-specific quirks, alternate encodings, and XML
features the blocklist author didn't anticipate, and it treats a parser configuration problem as if
it were an input-validation problem, which it structurally isn't.

## Related Classes

- **[Server-Side Request Forgery](../ssrf/)**: the same "server fetches an attacker-chosen
  destination" pattern, delivered through XML entity resolution instead of a dedicated URL-fetching
  feature.
- **[Security Misconfiguration](../security-misconfiguration/)**: the broader category this class
  belongs to, since the root cause is a parser's default settings, not custom application code.
