---
title: Cross-Site Scripting (XSS)
summary: How untrusted input reaching a page without output encoding lets an attacker run script in another user's browser, and why that differs from SQL injection despite the surface similarity.
owasp: "A03:2021 – Injection"
cwe: ["CWE-79"]
typicalSeverityCeiling: High
related: ["sql-injection"]
status: published
datePublished: 2026-09-18
---

## Definition

Cross-site scripting, almost always shortened to XSS, happens when untrusted input ends up rendered
into a page's HTML — or into JavaScript that runs on that page — without being properly encoded for
the context it lands in. When that happens, the victim's browser can no longer tell the difference
between "text the page is displaying" and "code the page wants to run," and it executes the
attacker's script exactly as if it were the site's own code, with the site's own permissions.

## The Trust Boundary That Breaks

The developer's trust assumption is almost always: *this data is just going to be displayed back to
someone, so it's inert text.* A comment, a display name, a search term echoed back on a results page
— none of it looks like code to the person writing the feature, so it doesn't occur to them that it
needs to be treated any differently from a static string in the template.

The actual trust boundary that has to hold is the line between *data* and *code* at the moment a page
renders — every place untrusted input is written into HTML has to be encoded for that specific
context (HTML body text is not the same encoding as an HTML attribute, which is not the same encoding
as a JavaScript string). This is conceptually the same failure as [SQL
Injection](../sql-injection/): a boundary between data and code gets crossed because the application
never actually drew it. The difference is where it happens — SQL injection crosses that line at the
database's SQL parser; XSS crosses it at the browser's HTML and JavaScript parser instead. Same root
cause, different parser on the other side of the mistake.

<figure class="diagram">
<svg viewBox="0 0 930 130" role="img" aria-labelledby="diagram-title-xss" style="width:100%;height:auto;">
<title id="diagram-title-xss">How a stored cross-site scripting payload travels from submission to execution in a victim's browser</title>
<defs>
<marker id="arrow-xss" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker submits</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">script as input</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xss)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Server stores it</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">without encoding</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xss)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Victim's browser</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">loads the page</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xss)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Script executes as</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the site's own code</text>
<line x1="730" y1="72" x2="770" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-xss)"/>
<circle cx="782" cy="20" r="11" fill="var(--accent)"/>
<text x="782" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">5</text>
<rect x="770" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="845" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker captures</text>
<text x="845" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">session or data</text>
</svg>
<figcaption>A stored payload (as shown here) hits every visitor who views the page — the highest-impact of the three XSS variants.</figcaption>
</figure>

## Where It Actually Shows Up

- **Reflected XSS** — a value from the request itself (commonly a URL parameter) is echoed directly
  back into the response, such as a search page displaying "No results for [your search term]." The
  payload only fires for whoever clicks a specifically crafted link.
- **Stored XSS** — a payload is saved server-side (a comment, a profile field, a support-ticket
  message) and rendered later to *every* user who views that content, not just one targeted victim.
  This is meaningfully more dangerous than reflected XSS precisely because of that broader reach.
- **DOM-based XSS** — the vulnerable code path never touches the server at all. Client-side
  JavaScript reads untrusted data (from the URL, from `document.referrer`, from a client-side storage
  value) and inserts it directly into the page's DOM. Beginners frequently forget this category exists
  because there's no server round-trip to inspect — the entire vulnerable flow lives in the browser.

## Why It Keeps Happening

Modern templating frameworks auto-escape output by default, which prevents most XSS automatically —
but nearly all of them also expose a deliberate "raw" or "unescaped" output function for the rare
legitimate case where a developer actually needs to render real HTML. Under deadline pressure, that
escape hatch gets reached for to solve a formatting problem, without anyone stopping to threat-model
what happens if the data being rendered "raw" ever contains something malicious. A related and
equally common mistake is conflating input validation with output encoding — a developer checks that
a field passed some validation rule and considers it "safe," without recognizing that validation and
output encoding are two different controls solving two different problems; a value can be perfectly
valid input and still be dangerous if rendered without encoding.

## How to Find It

1. Submit a distinctive, harmless marker string and check whether it comes back **unencoded in the
   HTML source** — not just how it looks rendered on the page, since a browser might visually hide a
   broken tag while the raw markup is still exploitable.
2. Test **every distinct output context separately**: the same field might be safely encoded when
   rendered in the HTML body but unsafely handled when the same value is also reflected into an HTML
   attribute, a JavaScript string, or a URL elsewhere on the same page. Encoding requirements differ
   per context, and a fix applied in one place doesn't guarantee the same value is safe everywhere
   else it's used.
3. For DOM-based XSS specifically, review client-side JavaScript directly for places that read from
   `location`, `document.referrer`, or similar browser-provided sources and write into the DOM via an
   unsafe sink, since this category produces no server-side log entry to notice at all.
4. Confirm real script execution (not just markup reflection) as proof before calling a finding
   confirmed — a payload appearing unencoded in the source is a strong signal, but demonstrating actual
   execution removes any doubt.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Reflected XSS on an unauthenticated public page, no session cookies affected | Limited — requires tricking a specific victim into clicking a crafted link, with no ambient reach |
| Stored XSS on a page every logged-in user views | High — fires automatically against every visitor, no crafted link or social engineering required |
| Stored XSS on an internal admin-only panel | Very high — often results in full account takeover of an administrator, escalating a low-privilege submission into a high-privilege compromise |
| Session cookies protected by the `HttpOnly` flag | Meaningfully reduces impact — client-side script can still act on the victim's behalf while the page is open, but can no longer read the cookie value directly |

## Why a Business Should Care

XSS is routinely the actual mechanism behind session hijacking and account takeover in real
incidents, not an abstract textbook risk — a script running in a victim's browser can act with that
victim's full permissions for as long as the page stays open. When a tester demonstrates XSS by
popping a harmless alert box, it's worth explaining to a non-technical stakeholder exactly why that
matters: the alert box itself is not the harm, it's proof that arbitrary script execution is possible
at all, and anything a script could do in that browser context — reading cookies, submitting forms as
the victim, redirecting to a credential-harvesting page — is the actual risk being demonstrated.

## A Worked Example

*(Generalized from real engagement patterns. Company, product, and identifiers below are invented —
no real system, client, or data is referenced.)*

Meridian Support Desk lets customers open support tickets, and its internal staff view every ticket
through an admin dashboard. During an authorized assessment, a tester submits a ticket whose message
body contains a script payload instead of ordinary text. The public-facing ticket confirmation page
renders the message back to the customer with proper encoding — no issue there — but the internal
admin dashboard, built separately and later, renders the same stored message using a different
template path that skips output encoding entirely.

When a support agent opens the ticket, the payload executes in the agent's browser, in the context of
the admin dashboard's own session. The tester's payload is deliberately limited to reading and
reporting the session cookie's presence and the page's origin — proving that a real attacker's script
could exfiltrate that same session to an external server — without ever actually exfiltrating a real
agent's live session or taking any action inside the dashboard. Testing stops at that proof, the same
ethical boundary demonstrated on the SQL Injection page: proving exploitability is the job, not
causing the harm itself.

## Severity Calibration

This instance rates **High**: it requires an authenticated customer account to submit the payload (a
mild barrier compared to fully unauthenticated attacks) but results in script execution inside an
internal administrative context, with a clear path to session compromise of staff accounts. It falls
short of **Critical** specifically because reaching the vulnerable code path required an existing,
if low-privilege, account — a fully unauthenticated stored XSS reaching the same admin surface would
rate higher. As always, the vulnerability class alone doesn't set the number; the demonstrated reach
does.

## Remediation

The real fix is context-aware output encoding everywhere untrusted data is written into a page —
HTML-body encoding is not the same as attribute encoding, which is not the same as JavaScript-string
encoding, and each output location needs the encoding appropriate to it. A Content Security Policy
(CSP) is valuable defense-in-depth on top of that, restricting what a script — even one that does get
injected — is actually allowed to do, but it is not a substitute for fixing the encoding itself.

The common bad fix is a blocklist that strips or rejects `<script>` tags specifically. This is
trivially bypassed — event-handler attributes (`onerror`, `onload`), `javascript:` URLs, and inline
SVG all provide alternate ways to execute script that a `<script>`-tag filter never considers. If the
fix is context-specific pattern-blocking rather than systematic output encoding, it isn't actually
fixed.

## Related Classes

- **[SQL Injection](../sql-injection/)** — the injection-family sibling to this class; both are the
  same underlying failure (untrusted data crossing into a code context) at different parsers.
- **Session hijacking** — the most common real-world consequence of a successful XSS finding, where
  a script reads and exfiltrates an authenticated session. A dedicated attack-technique page for this
  is planned in the `attacks` collection.
