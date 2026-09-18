---
title: Common Types of Cyberattacks
summary: A working reference to the cyberattack types every newcomer and client-facing security person should recognize by name, how each works, and how it's normally prevented.
category: Attack Landscape
related: ["application-security", "red-teaming"]
relatedVulnerabilities: ["sql-injection"]
status: published
datePublished: 2026-09-18
---

## What It Is

This page is a working reference, not a deep dive on any single attack: it's the vocabulary that makes
the rest of this site (and every security conversation you'll actually have) legible. When a breach
makes the news, or a client mentions something they read about, they'll use one of the terms below,
such as "ransomware," "phishing," or "credential stuffing," and the fastest way to lose credibility in
that conversation is to visibly not know what the word means. This page exists so that gap never
opens: a short, accurate definition of each common attack type, how it typically works, how it's
normally defended against, and what it costs a business when it succeeds.

## Why It Exists

Attackers don't invent a new technique for every attack: they reuse a relatively small, well-
understood set of tactics, adapting the specific delivery method while the underlying approach stays
recognizable. This is exactly what [MITRE ATT&CK](https://attack.mitre.org/) formalizes: it's the security
industry's standard, publicly maintained taxonomy of adversary tactics (the *why*: what an attacker is
trying to accomplish, like gaining initial access or moving laterally through a network) and
techniques (the *how*: the specific method used to accomplish it). You don't need to memorize ATT&CK
to use this page, but it's worth knowing it exists, because it's the primary source this kind of
classification work is grounded in industry-wide, not something any one page like this invents on its
own.

## How It Works

| Attack Type | Plain-Language Definition | How It Typically Works | How It's Normally Prevented | Business Impact If It Succeeds |
|---|---|---|---|---|
| **[Phishing](../../attacks/phishing/)** | A deceptive message designed to trick someone into giving up credentials, clicking a malicious link, or opening a malicious attachment. | An email, text, or chat message impersonates a trusted sender (a bank, a colleague, an internal system) and creates urgency ("your account will be locked") to short-circuit careful thinking. | Email filtering, security awareness training, and, most effectively, multi-factor authentication (MFA), so a stolen password alone isn't enough to log in. | Initial foothold for a much larger incident; stolen credentials reused across other systems. |
| **[Business email compromise (BEC)](../../attacks/business-email-compromise/)** | A phishing attack tailored to a specific person or role, often impersonating an executive or vendor. | The attacker researches the target (job title, real vendor relationships, writing style) and sends a highly convincing, individually crafted request, commonly asking finance staff to redirect a wire transfer. | Out-of-band verification for any payment or credential change request (a phone call to a known number, not the one in the email), plus the same MFA and training controls as phishing. | Direct financial loss, often large and often unrecoverable once a wire transfer clears. |
| **[Ransomware](../../attacks/ransomware/)** | Malware that encrypts an organization's files and demands payment for the decryption key. | Delivered via phishing, an exposed remote-access service, or an unpatched vulnerability; once inside, it often spreads laterally and disables backups before encrypting data, specifically to remove the option of recovering without paying. | Offline/immutable backups tested regularly for actual restoration, network segmentation to limit spread, endpoint detection tooling, and prompt patching of internet-facing systems. | Extended operational downtime, direct ransom cost (if paid), regulatory exposure if the underlying data theft also occurred, and reputational damage. |
| **[Malware](../../attacks/malware/)** (general) | Malicious software designed to damage, disrupt, or gain unauthorized access to a system. | Delivered via a malicious attachment, a compromised download, or an exploited vulnerability; behavior ranges from data theft to giving an attacker remote control of the machine. | Endpoint protection, application allow-listing, prompt patching, and least-privilege accounts so malware on one machine can't reach everything. | Ranges from a single compromised device to a full network-wide compromise, depending on what the infected system could reach. |
| **[Rootkit](../../attacks/rootkit/)** | Malware specifically designed to hide its own presence (and the presence of other malware) from the operating system and the tools meant to detect it. | Installs itself with elevated privileges and intercepts or alters the operating system's own reporting, so infected files, processes, or network connections simply don't appear in normal system views. | Boot-integrity verification (secure boot, measured boot), offline/out-of-band scanning that doesn't trust the potentially compromised OS to report on itself, and rebuilding from a known-clean image rather than trusting in-place removal. | Extended, undetected persistence: an attacker retains access long after an initial compromise would normally have been noticed. |
| **[Man-in-the-middle (MITM)](../../attacks/man-in-the-middle/)** | An attacker secretly intercepts, and possibly alters, communication between two parties who believe they're talking directly to each other. | Common on unsecured public Wi-Fi, or via techniques that trick a device into routing its traffic through the attacker first. | Enforced encryption in transit (TLS/HTTPS everywhere, no fallback to plaintext), and certificate validation that isn't silently bypassed. | Credential and data interception without either party realizing anything happened. |
| **[DDoS](../../attacks/ddos/)** (denial-of-service / distributed denial-of-service) | Flooding a system with traffic or requests until it can no longer serve legitimate users. | A single source (DoS) or, far more commonly, a large distributed network of compromised devices (DDoS) sends overwhelming traffic volume at a target. | Traffic scrubbing and rate-limiting services, redundant infrastructure, and capacity planning for realistic worst-case load. | Direct revenue loss for anything that depends on availability (e-commerce, SaaS), plus reputational cost from visible downtime. |
| **[SQL injection](../../vulnerabilities/sql-injection/)** | Untrusted input reaching a raw database query, letting an attacker rewrite the query's logic rather than just supplying a value. | Covered in full depth, including a complete worked example and remediation guidance, on its own dedicated page. | See the dedicated page's Remediation section. | See the dedicated page's Impact by Scenario table. |
| **[Cross-site scripting (XSS)](../../vulnerabilities/cross-site-scripting/)** | Injecting malicious script into a web page that then runs in another user's browser. | Untrusted input is reflected or stored on a page without proper output encoding, so a payload submitted by an attacker executes in the context of a victim who simply views that page. | Context-aware output encoding everywhere untrusted data is rendered, plus a Content Security Policy (CSP) as defense-in-depth. | Session hijacking, credential theft, or actions performed on a victim's behalf without their knowledge. |
| **[Credential stuffing](../../attacks/credential-stuffing/)** | Automated login attempts using username/password pairs leaked from an unrelated prior breach. | Attackers rely on the well-documented fact that a large share of people reuse the same password across multiple sites, so a leak at one company becomes a working key at another. | MFA, rate-limiting and anomaly detection on login endpoints, and monitoring for credentials appearing in known breach data. | Account takeover at scale, often across many accounts simultaneously, with no vulnerability in the target's own code at all. |
| **[Brute force](../../attacks/brute-force/)** | Systematically guessing a password or key through repeated attempts, rather than using known-leaked credentials. | Automated tools try common passwords, dictionary words, or the full possible combination space against a login or authentication endpoint. | Account lockout or exponential delay after failed attempts, MFA, and enforced password complexity/length minimums. | Account compromise, typically limited to weaker or default credentials rather than well-chosen ones. |
| **[Social engineering](../../attacks/social-engineering/)** (pretexting, vishing) | Manipulating a person, rather than a system, into taking an action or disclosing information. | An attacker impersonates a trusted role (IT support, a vendor, a new employee) over the phone or in person, building a plausible pretext to request access, credentials, or information directly. | Verified processes for any sensitive request (a callback to a known number, identity verification steps that can't be waved off under pressure), and training that specifically covers pretexting scenarios, not just email phishing. | Direct access or credential disclosure that bypasses every technical control, because the person was the target, not the system. |
| **[Supply chain attack](../../attacks/supply-chain-attack/)** | Compromising a trusted third-party vendor, library, or update mechanism to reach that vendor's downstream customers. | An attacker compromises a software vendor's build or update process and inserts malicious code into what looks like a legitimate, signed update, which is then trusted and installed by every customer of that vendor. | Software composition analysis (SCA) to track dependency provenance, verifying update signatures, and vendor security assessments as part of procurement. | Compromise at massive scale across every organization that trusted the affected vendor, often with no visible warning sign. |
| **[Zero-day exploit](../../attacks/zero-day-exploit/)** | An attack against a vulnerability that the software vendor doesn't yet know about and has no patch for. | An attacker discovers or purchases knowledge of a previously unknown flaw and uses it before any defense specific to that flaw exists. | Defense-in-depth (so a single unknown flaw isn't enough on its own to reach critical systems), network segmentation, and rapid patching once a fix does ship. | Can bypass defenses built around known threats entirely, precisely because no signature or patch for it exists yet. |
| **[Insider threat](../../attacks/insider-threat/)** | Harm caused by someone who already has legitimate, authorized access: an employee, contractor, or partner. | Ranges from a disgruntled employee deliberately exfiltrating data, to an honest employee whose over-provisioned access is compromised and misused by someone else. | Least-privilege access (only what a role actually needs), access reviews and offboarding processes, and monitoring for anomalous access to sensitive data. | Often more damaging than an external attack, because the person already had legitimate access and a plausible reason to be using it. |
| **[Advanced persistent threat (APT)](../../attacks/advanced-persistent-threat/)** | A sustained, multi-stage intrusion by a patient, well-resourced adversary pursuing a specific long-term objective, rather than a single opportunistic attack. | Chains many of the techniques on this page together over weeks or months (initial access, persistence, lateral movement, and long-term, low-noise data collection), deliberately avoiding the kind of loud, fast activity that trips obvious alarms. | Layered detection tuned for slow, low-volume anomalies rather than only loud events, threat hunting, and the same validation techniques covered under continuous threat exposure management. | The most severe end of the impact range: long-term, large-scale data loss or strategic compromise, often discovered only long after the fact. |
| **[DNS spoofing / poisoning](../../attacks/dns-spoofing/)** | Corrupting the translation between a domain name and its real address, redirecting legitimate traffic to an attacker-controlled destination. | An attacker inserts forged DNS responses, so a request for a legitimate domain resolves to an address the attacker controls instead. | DNSSEC (cryptographically signed DNS responses), and monitoring for unexpected DNS resolution changes. | Traffic and credentials sent to what looks like the real destination but isn't, with no obvious visual sign to the victim. |
| **[Session hijacking](../../attacks/session-hijacking/)** | Stealing or reusing a valid, already-authenticated session token to impersonate a logged-in user without needing their password. | A session token is intercepted (via MITM on an unencrypted connection, or via XSS reading it out of the browser) and replayed by the attacker, who is then treated as the legitimate, already-authenticated user. | Enforced encryption in transit, secure/HttpOnly cookie flags, and session tokens that expire and rotate rather than staying valid indefinitely. | Full account access without ever needing the victim's actual password. |
| **[Drive-by download](../../attacks/drive-by-download/)** | Malware installed on a visitor's device simply by viewing a compromised or malicious webpage, with no download or install ever knowingly initiated by the victim. | A page (often a legitimate site that's been compromised, or a malicious ad served through a legitimate ad network) runs code that silently exploits a vulnerability in the visitor's browser or a plugin. | Prompt browser and plugin patching, browser isolation/sandboxing, and ad and script-blocking controls on high-risk endpoints. | A compromised endpoint with no phishing click or attachment required, making it harder for a trained user to have prevented it. |
| **[Watering hole attack](../../attacks/watering-hole-attack/)** | Compromising a legitimate website that a specific target group is known to visit, rather than attacking that group directly. | The attacker identifies a site frequented by employees of a target organization or industry, compromises it, and plants a drive-by download or credential-harvesting page, then waits for the intended victims to visit as they normally would. | Web filtering and reputation-based blocking, endpoint detection that doesn't rely solely on a site's reputation, and the same browser-hardening controls that mitigate drive-by downloads. | Highly targeted compromise that bypasses defenses built around "don't click suspicious links," since the site itself is one the victim already trusted. |
| **[Cryptojacking](../../attacks/cryptojacking/)** | Secretly using a victim's computing resources to mine cryptocurrency for the attacker's benefit. | Delivered the same way as other malware (malicious attachment, compromised website script, exploited vulnerability), then runs quietly in the background, consuming CPU/GPU cycles rather than stealing data directly. | Endpoint monitoring for abnormal resource usage, network monitoring for connections to known mining pools, and the same patching and endpoint-protection controls used against malware generally. | Degraded performance, higher cloud/compute and electricity costs, and shortened hardware lifespan: a resource-theft impact rather than a data-theft one. |
| **[IoT-based attacks](../../attacks/iot-based-attacks/)** | Compromising internet-connected devices outside the traditional computer/server category (cameras, sensors, industrial controllers), often to recruit them into a larger attack. | Exploits the fact that many IoT devices ship with default or hardcoded credentials, receive infrequent security updates, and often sit with far less monitoring than traditional endpoints, making them an easy, high-volume target for automated compromise. | Changing default credentials before deployment, network segmentation isolating IoT devices from core systems, and vendor/procurement vetting for security update commitments. | Individually low-value devices recruited at scale into large botnets capable of significant DDoS output, plus a foothold into whatever network segment the device sits on. |

## Where This Shows Up in Practice

Which of these matter most is genuinely different by business context, and that context should drive
where defensive attention and budget actually go. A retail or e-commerce business handling large volumes
of customer logins and payment data has the most to lose from credential stuffing and payment fraud
specifically. A hospital or healthcare provider, where system availability can be a matter of patient
safety and records carry both regulatory weight and resale value, has historically been a
disproportionate ransomware target. A software vendor with many downstream customers carries outsized
supply-chain risk, because a single compromise on their end becomes everyone else's incident too. None
of this means the other attack types don't apply: it means realistic prioritization starts from "what's
most likely to hit us, and what would it cost if it did," not from trying to defend against every entry
on this page with equal intensity.

## Why a Business Should Care

The natural instinct when looking at a list like this is to try to defend against everything on it
equally, and that's exactly the wrong instinct, because it spreads a finite security budget thin across
threats with wildly different likelihood and impact for that specific business. The more useful exercise
is prioritization: which of these attack types are most likely to target *this* organization specifically,
and which would cause the most damage if they succeeded. A five-person startup with no customer payment
data and a Fortune 500 healthcare provider should not be spending their security budget the same way,
even though both face the same list of possible attack types in the abstract. This reframing is also the
right way to have the conversation with a client who's anxious about "cyberattacks" as an undifferentiated
mass: the useful question isn't "are we protected against everything," it's "what are our two or three
most realistic, most damaging scenarios, and are we specifically covered against those."

Each row above links to a full, dedicated page (the same depth of treatment SQL Injection gets),
covering exactly how that specific technique works end to end, how to detect it, and a full worked
example. This page is the map; those are the territory.

## Common Misconceptions

**"We have antivirus, so we're covered."** Antivirus software is a real, useful control against
traditional malware, but it does essentially nothing against most of the list above: it doesn't stop a
phishing email from being convincing, doesn't stop credential stuffing against a login page, doesn't stop
a social engineering phone call, and doesn't stop a DDoS flood. Treating antivirus as comprehensive
coverage leaves the majority of this list completely unaddressed.

**"We're too small to be a target."** This holds for almost none of the list above. Phishing,
ransomware, credential stuffing, and brute force are largely automated at scale: attackers aren't
manually selecting targets by company size, they're running the same tooling against enormous numbers of
targets and taking whatever succeeds. A small business is not invisible to automated, untargeted attack
traffic; it's simply less likely to make the news when it's hit.

## Related Topics

- [Application Security](../application-security/): the practices that catch many of these attack
  types (especially injection and XSS) before they ever reach production.
- [Red Teaming](../../methodology/red-teaming/): testing an organization's actual detection and response against a
  realistic, chained sequence of these attack types, not just individual controls in isolation.
- [SQL Injection](../../vulnerabilities/sql-injection/): the full, dedicated treatment of one specific
  entry on this list.
- [Browse every attack technique page](../../attacks/): the full index of dedicated deep-dive pages
  linked from the table above.
