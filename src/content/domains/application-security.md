---
title: Application Security
summary: The concepts, tooling categories, and practices that make up application security, and where it fits relative to network and infrastructure security.
category: Domain Overview
related: ["what-is-penetration-testing", "types-of-cyberattacks"]
relatedVulnerabilities: ["sql-injection"]
status: published
datePublished: 2026-09-18
---

## What It Is

Application security (usually shortened to AppSec) is the practice of making the software itself
resistant to attack: the code a team writes, the APIs it exposes, and the business logic that decides
what a user is and isn't allowed to do. That's a distinct job from securing the network the software
runs on, or the servers underneath it. A firewall can be configured perfectly, the operating system can
be fully patched, and the application can still hand an attacker access to every customer record
because of a mistake in how the code itself was written. AppSec is the discipline aimed squarely at
that layer.

## Why It Exists

For a long time, the more efficient place to attack an organization was its network perimeter: the
routers, firewalls, and exposed services sitting at the edge. Over roughly the last two decades, that
perimeter got a lot harder to attack directly: better default configurations, more consistent patching,
and a broad shift toward cloud infrastructure that's professionally managed by providers whose entire
business depends on getting the basics right (see [Cloud Security](../cloud-security/)).

Custom application code didn't get the same structural improvement. Every organization still writes its
own login flow, its own payment logic, its own file-upload handler: bespoke code, shipped fast, under
deadline pressure, by people who are experts in the product they're building and not necessarily in
security. The result is that the same handful of mistakes get reintroduced constantly, across
completely unrelated companies and codebases. This isn't speculation: the OWASP Top 10 (owasp.org), the
most widely referenced ranking of application security risks in the industry, is built from real,
aggregated vulnerability data and has kept surfacing the same handful of root-cause categories
(broken access control, injection flaws, cryptographic failures) release after release. AppSec exists
because the application layer, not the network perimeter, is now where most real damage actually gets
done.

## How It Works

AppSec isn't one tool. It's a set of complementary practices, each catching a different kind of
mistake:

- **SAST (Static Application Security Testing)** reads an application's source code without running
  it, looking for known-dangerous patterns, such as a database query built by string concatenation
  instead of parameterization (see [SQL Injection](../../vulnerabilities/sql-injection/)). It runs
  early, directly against code, and can catch a flaw before it's ever deployed.
- **DAST (Dynamic Application Security Testing)** tests the *running* application from the outside, the
  way an actual attacker would, sending it real requests and inspecting real responses. It doesn't see
  the source code, so it catches a different set of problems than SAST does, including issues that only
  exist once several pieces of code interact at runtime.
- **SCA (Software Composition Analysis)** checks the third-party and open-source libraries an
  application depends on against databases of known, publicly disclosed vulnerabilities (tracked
  through the CWE, or Common Weakness Enumeration, system maintained at cwe.mitre.org). Modern
  applications are assembled from dozens or hundreds of dependencies; SCA exists because a vulnerability
  in someone else's code is still a vulnerability in your application.
- **Secure code review** and **threat modeling** are the human-driven practices that happen earlier
  still: a person reading code with a security lens, or a team sitting down before a feature is even
  built to ask "what could go wrong here, and for whom."
- **Manual penetration testing** sits at the far end of this chain, and it plays a different role than
  any of the automated categories above. Automated tools are excellent at finding *patterns* (a
  specific unsafe function call, a known-vulnerable library version) at scale, across an entire
  codebase, cheaply and repeatedly. What they generally can't do is *chain* several small findings
  together into a single proven, real-world impact the way a skilled human attacker does, or reason
  about business logic that's only wrong in context (a discount code that's technically valid but was
  never supposed to be combinable with another one, for instance). See
  [What Is Penetration Testing](../what-is-penetration-testing/) for how that manual process actually
  runs end to end.

None of these replace each other. A mature AppSec program runs all of them, because each one is blind
to a different category of mistake.

## Where This Shows Up in Practice

In a real engineering organization, AppSec is rarely a separate, bolted-on stage. It's built into the
software delivery pipeline itself. SAST and SCA tools commonly run automatically as a gate inside CI/CD
(continuous integration/continuous deployment), so a build can be blocked automatically if it introduces
a known-bad pattern or a dependency with a disclosed vulnerability. This is the practical meaning of a
"secure SDLC" (software development lifecycle): security checks distributed across every stage of
building software, not one audit at the very end.

Beyond automated pipeline checks, many organizations also run ongoing, ad hoc testing programs that
invite outside security researchers to find and responsibly report vulnerabilities in exchange for
recognition or payment, a practice generally referred to as crowdsourced or continuous security
testing, distinct from the automated tooling above precisely because it brings in the same kind of
creative, adversarial human reasoning that a scoped penetration test does, just running continuously
rather than as a single point-in-time engagement.

## Why a Business Should Care

The most defensible argument for AppSec investment is timing, not fear. There's a well-established,
widely observed pattern in software engineering: a flaw caught while a feature is still being designed
costs a conversation and a design change. The same flaw caught during code review costs a re-write
before merge. The same flaw caught after the feature has shipped to production, especially if it's
caught because it was *exploited*, costs incident response, forensic investigation, customer
notification, and often direct remediation under time pressure, on top of whatever the breach itself
cost. The exact multiplier changes study to study and isn't worth quoting as a fixed number, but the
direction is not in dispute: earlier is cheaper, every time, and by a wide margin.

AppSec investment also isn't discretionary for many organizations: it's a compliance requirement with
a real audit and a real consequence for failing it. Any organization that handles payment card data has
a direct, named obligation under PCI-DSS (the Payment Card Industry Data Security Standard) to run
application-layer testing on a regular cadence. Most B2B SaaS companies selling into enterprise
customers will be asked for a SOC 2 report, and SOC 2 examines whether the organization has functioning
application security controls, not just whether it says it does. When a client asks "why should we
spend money on this," the honest answer is often not abstract risk: it's a specific standard they are
already contractually or legally required to meet.

## Common Misconceptions

**"We have a web application firewall, so we're covered."** A WAF filters malicious-looking traffic at
the network edge before it reaches the application; it's a genuinely useful mitigating control, but it
is not a fix for the underlying flaw. It's the difference between a smoke detector and fixing the
faulty wiring. The [Remediation section of the SQL Injection page](../../vulnerabilities/sql-injection/)
walks through exactly this distinction for one concrete vulnerability class: a WAF might block an
obvious injection payload, but the unparameterized query underneath it is still there, still reachable
by a payload the WAF doesn't recognize, and still the actual thing that needs to be fixed.

**"Security is the security team's job, not developers'."** This gets the modern practice of AppSec
backwards. A security team of a handful of people cannot manually review every line of code an
engineering org of hundreds of developers ships every day. It doesn't scale, and it was never supposed
to. The realistic goal of a mature AppSec program is to equip developers with the tools, training, and
automated feedback to catch and fix most issues themselves, with the security team focused on the
hardest, highest-context problems. Framing AppSec as a gate the security team enforces, rather than a
capability developers are given, is the fastest way to make developers see it as friction to route
around instead of a shared responsibility.

## Related Topics

- [What Is Penetration Testing](../what-is-penetration-testing/): the manual, human-driven testing
  practice that sits alongside AppSec's automated tooling.
- [Common Types of Cyberattacks](../types-of-cyberattacks/): a broader reference for how the flaws
  AppSec exists to catch actually get exploited in the wild.
- [SQL Injection](../../vulnerabilities/sql-injection/): a specific, worked example of an
  application-layer vulnerability class, including the exact "real fix vs. common bad fix" distinction
  referenced above.
