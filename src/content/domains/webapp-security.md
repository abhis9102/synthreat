---
title: WebApp Security
summary: What actually makes a web application vulnerable, from broken access control and injection through to the protocol and browser mechanisms every app depends on.
category: Domain Overview
related: ["application-security"]
relatedVulnerabilities: ["broken-access-control", "sql-injection", "cross-site-scripting", "ssrf"]
status: published
datePublished: 2026-09-18
dateUpdated: 2026-09-19
---

## What It Is

WebApp security is the practice of securing a specific website or web application: its own access
control, input handling, authentication, and business logic, plus the protocol and browser-layer
mechanisms underneath it (TLS, CORS, cookies, security headers) that every web app depends on to
communicate safely. It's a different question from [Application Security](../application-security/),
which is the general software-development-lifecycle practice (SAST, DAST, secure code review) used to
find and prevent flaws in any codebase, web or not. WebApp security is the target surface itself: the
actual attack surface a live web application presents, and everything on it that can go wrong.

## Why It Exists

Web applications are where most organizations ship the largest volume of bespoke, fast-changing code,
and the same handful of root-cause vulnerability categories, broken access control, injection,
cryptographic failures, keep recurring release after release. That isn't speculation: the [OWASP Top
10](../../frameworks/owasp-top-10/), the most widely referenced ranking of web application risk in the
industry, is built from real, aggregated vulnerability data and has kept surfacing the same categories
for over a decade. On top of that application-logic layer, the web itself was originally built for
sharing linked documents, not for running interactive applications that handle sensitive data and
financial transactions, so browsers and servers have had to accumulate a separate set of protocol-level
protections (encryption in transit, rules about which sites can talk to which) to close that gap. Both
layers have to hold: a perfectly written application can still be exposed by a misconfiguration at the
protocol layer, and a flawless TLS setup does nothing to stop a broken access-control check underneath
it.

## How It Works

Two layers make up this domain, and a real assessment tests both:

**The application-logic layer** is what the [OWASP Top 10](../../frameworks/owasp-top-10/) catalogs,
and every category has at least one dedicated, worked-example page in this site's [WebApp Security
vulnerabilities](../../vulnerabilities/webapp-security/) section:

- **Broken Access Control (A01).** A user reaching data or actions they shouldn't be able to,
  including [IDOR](../../vulnerabilities/idor/), [CSRF](../../vulnerabilities/csrf/),
  [path traversal](../../vulnerabilities/path-traversal/), and [open
  redirect](../../vulnerabilities/open-redirect/). The single most commonly reported category in the
  real-world data OWASP draws from.
- **Cryptographic Failures (A02).** Sensitive data exposed because it was never encrypted, or
  encrypted with a broken or outdated method. See [Cryptographic
  Failures](../../vulnerabilities/cryptographic-failures/).
- **Injection (A03).** Untrusted input executed as code or commands instead of handled as plain data:
  [SQL injection](../../vulnerabilities/sql-injection/), [cross-site
  scripting](../../vulnerabilities/cross-site-scripting/), [command
  injection](../../vulnerabilities/command-injection/), and [file
  inclusion](../../vulnerabilities/file-inclusion/) are all this category.
- **Insecure Design (A04).** A missing security control that was never built, not a broken one, often
  showing up as a [business logic vulnerability](../../vulnerabilities/business-logic-vulnerabilities/).
  See [Insecure Design](../../vulnerabilities/insecure-design/).
- **Security Misconfiguration (A05).** A default setting, unnecessary feature, or overly verbose error
  left enabled in production, covering everything from [XXE](../../vulnerabilities/xxe/) and
  [clickjacking](../../vulnerabilities/clickjacking/) to a [subdomain
  takeover](../../vulnerabilities/subdomain-takeover/).
- **Vulnerable and Outdated Components (A06).** Shipping a third-party library or framework with a
  publicly known, unpatched flaw. See [Vulnerable and Outdated
  Components](../../vulnerabilities/vulnerable-outdated-components/).
- **Identification and Authentication Failures (A07).** Weak login, session, or credential handling.
  See [Authentication Failures](../../vulnerabilities/authentication-failures/).
- **Software and Data Integrity Failures (A08).** Trusting an update, plugin, or piece of serialized
  data without verifying it hasn't been tampered with, including [mass
  assignment](../../vulnerabilities/mass-assignment/). See [Software and Data Integrity
  Failures](../../vulnerabilities/software-data-integrity-failures/).
- **Security Logging and Monitoring Failures (A09).** An incident that runs longer than it should
  because nobody was watching. See [Logging and Monitoring
  Failures](../../vulnerabilities/logging-monitoring-failures/).
- **Server-Side Request Forgery (A10).** A server tricked into making a request on an attacker's
  behalf. See [SSRF](../../vulnerabilities/ssrf/).

**The protocol and browser layer** sits underneath all of that, and a well-written application can
still be undermined here:

- **HTTPS and TLS.** Encryption in transit between browser and server, verified through certificates,
  including making sure HTTP actually redirects to HTTPS and using HSTS so a browser refuses to
  downgrade a connection even if an attacker tries to force it.
- **The same-origin policy and CORS.** Browsers enforce a default rule that a page loaded from one
  origin cannot read data from a different one. CORS is a mechanism for deliberately and narrowly
  relaxing that default for specific, legitimate cross-origin requests, a relaxation of a protection,
  not a protection itself.
- **Cookie security attributes.** Flags like Secure, HttpOnly, and SameSite directly determine whether
  a session token can be intercepted or stolen through the browser (see [Session
  Hijacking](../../attacks/session-hijacking/)).
- **Security headers.** A Content-Security-Policy header restricts what a page can load, adding
  defense-in-depth against [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/); headers
  like X-Frame-Options defend against clickjacking.

## Where This Shows Up in Practice

[WebApp penetration testing](../../methodology/webapp-penetration-testing/) is scoped to cover both
layers in the same engagement: mapping every page, form, and API endpoint and testing each one against
the OWASP categories above, alongside checking whether CORS is too permissive, cookies are missing
security flags, or headers are absent entirely. Automated tools make an initial pass fast at both
layers: Qualys SSL Labs grades TLS and certificate configuration, and free scanners like Mozilla
Observatory or securityheaders.com flag missing security headers in seconds, but a tester still relies
on an intercepting proxy like Burp Suite or OWASP ZAP, plus targeted tools like sqlmap, to confirm a
suspected gap is actually exploitable rather than just absent.

## Why a Business Should Care

The realistic scenario worth naming to a client: a team can pass a clean code audit and still get
breached, because an overly permissive CORS policy or a cookie missing a security flag undermines
application logic that was otherwise written correctly. That's a genuinely distinct risk surface from
"is our code secure," and a code review alone won't necessarily catch it if the reviewer isn't
specifically looking at this layer. Most B2B SaaS companies get asked for evidence of testing against
exactly this landscape during a SOC 2 review or an enterprise security questionnaire, and any
organization handling payment card data has a direct, named obligation under PCI-DSS to test it on a
regular cadence.

## Common Misconceptions

**"WebApp security is just about HTTPS and browser settings, not the application's own code."** This
is the mirror image of the mistake this page itself used to make: the application-logic layer (the
OWASP Top 10 categories above) is where the majority of real, high-severity findings actually live.
The protocol and browser layer matters, but it's one piece of the domain, not the whole thing.

**"HTTPS means the site is secure."** HTTPS protects data in transit. It says nothing about whether the
application's logic is sound, whether it's vulnerable to injection, or whether its headers and cookies
are configured correctly. A site can serve a SQL injection vulnerability perfectly securely over HTTPS.

**"CORS is a security feature that blocks attackers."** This gets the mechanism backwards. The
same-origin policy is the actual protection; CORS exists to deliberately open a hole in that protection
for legitimate cases. A misconfigured, overly broad CORS policy weakens the same-origin policy's
protection rather than adding any protection of its own.

## Related Topics

- **Explore WebApp Security vulnerabilities:** the [Vulnerabilities
  section](../../vulnerabilities/webapp-security/) has dedicated, worked-example pages for every OWASP
  Top 10 category named above.
- [The OWASP Top 10](../../frameworks/owasp-top-10/): the named standard the application-logic layer
  is organized around.
- [Application Security](../application-security/): the broader software-security practice (SAST, DAST,
  secure code review) this specific target surface is tested and secured with.
- [WebApp Penetration Testing](../../methodology/webapp-penetration-testing/): the dedicated engagement
  type that tests this domain directly.
- [Broken Access Control](../../vulnerabilities/broken-access-control/) and [SQL
  Injection](../../vulnerabilities/sql-injection/): the two categories responsible for the largest
  share of real-world, high-severity web application findings.
