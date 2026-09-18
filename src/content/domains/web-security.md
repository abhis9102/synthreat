---
title: Web Security
summary: The protocol and browser-layer protections that sit underneath every web application, distinct from the practices that secure the application's own code.
category: Domain Overview
related: ["application-security"]
relatedVulnerabilities: ["cross-site-scripting", "ssrf"]
status: published
datePublished: 2026-09-18
---

## What It Is

Web security is the security of the web platform layer itself: how a browser and a server actually communicate, and the protocol-level protections that either hold or do not. This is a different layer than [Application Security](../application-security/)'s broader software-development-lifecycle practice of secure coding, code review, and testing. Application security asks whether the application's own logic is written safely. Web security asks whether the underlying protocols and browser mechanisms that every web application depends on are configured correctly, since a perfectly written application can still be exposed by a misconfiguration at this layer.

## Why It Exists

The web was originally built for sharing linked documents, not for running secure, interactive applications that handle sensitive data and financial transactions. Over time, browsers and servers have accumulated a set of protocol-level security mechanisms to close that gap: encryption in transit, rules about which sites can talk to which, and headers that tell a browser how to treat a page defensively. None of this is automatic. Every one of these mechanisms has to be actively and correctly turned on and configured by whoever builds the application, and it is entirely possible to ship an application with flawless business logic sitting on top of a web-layer configuration that undermines it.

## How It Works

A few core mechanisms make up most of this domain:

- **HTTPS and TLS.** Encryption in transit between browser and server, verified through certificates. This includes making sure HTTP connections are actually redirected to HTTPS rather than allowed to fall back to plaintext, and using HSTS so a browser refuses to downgrade a connection even if an attacker tries to force it.
- **The same-origin policy and CORS.** Browsers enforce a default rule that a page loaded from one origin cannot read data from a different origin. Cross-Origin Resource Sharing (CORS) is a mechanism for deliberately and narrowly relaxing that default rule for specific, legitimate cross-origin requests. It is a relaxation of a protection, not a protection itself, which is worth being precise about.
- **Cookie security attributes.** Flags like Secure (only sent over HTTPS), HttpOnly (not readable by client-side script), and SameSite (restricting when a cookie is sent with cross-site requests) directly determine whether a session token can be intercepted or stolen through the browser (see [Session Hijacking](../../attacks/session-hijacking/)).
- **Security headers.** A Content-Security-Policy header restricts what scripts and resources a page is allowed to load, acting as defense-in-depth against [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/). Other headers, like X-Frame-Options, prevent a page from being loaded inside another site's frame to defend against clickjacking.

## Where This Shows Up in Practice

Web application penetration testing routinely probes specifically at this layer: checking whether CORS is configured too permissively, whether cookies are missing the Secure or HttpOnly flags, whether security headers are present at all. Browser security research, which studies how browsers themselves enforce these protections, also lives in this domain.

## Why a Business Should Care

An overly permissive CORS policy, or a cookie missing a security flag, can undermine an application whose actual business logic and code are otherwise well written. That is a genuinely distinct risk surface from "is our code secure," and it is one that a code review alone will not necessarily catch if the reviewer is not specifically looking at this layer. Worth raising directly with a client: passing a code audit and having a secure web-layer configuration are two different checks, not one.

## Common Misconceptions

**"HTTPS means the site is secure."** HTTPS protects data while it is in transit between the browser and the server. It says nothing about whether the application's logic is sound, whether it is vulnerable to injection, or whether its headers and cookies are configured correctly. A site can serve a SQL injection vulnerability perfectly securely over HTTPS.

**"CORS is a security feature that blocks attackers."** This gets the mechanism backwards, and it is worth correcting directly. The same-origin policy is the actual protection, the default browser behavior of keeping origins isolated. CORS exists to deliberately open a hole in that protection for legitimate cases. A misconfigured, overly broad CORS policy weakens the same-origin policy's protection rather than adding any protection of its own.

## Related Topics

- **Explore Web Application vulnerabilities:** the [Vulnerabilities section](../../vulnerabilities/#web-application) has dedicated, worked-example pages for the OWASP Top 10 categories this protocol layer sits underneath.
- [Application Security](../application-security/): the broader software-security practice this protocol layer sits underneath.
- [Cloud Security](../cloud-security/): the infrastructure layer beneath the web platform itself.
- [Cross-Site Scripting](../../vulnerabilities/cross-site-scripting/): the vulnerability class Content-Security-Policy exists to add defense-in-depth against.
- [Server-Side Request Forgery](../../vulnerabilities/ssrf/): a related flaw where a server is tricked into making a request on an attacker's behalf.
