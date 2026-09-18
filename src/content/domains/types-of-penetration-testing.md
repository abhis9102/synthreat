---
title: Types of Penetration Testing
summary: How penetration tests differ by target surface (network, web, mobile, cloud, wireless, social engineering) and by how much access the tester starts with (black-box, gray-box, white-box).
category: Methodology
related: ["what-is-penetration-testing", "red-teaming", "cloud-security", "application-security"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

"Penetration testing" isn't one fixed activity. It's a family of engagement types that vary along
two independent axes. The first axis is **target surface**: what's actually being attacked (a
network, a web application, a mobile app, a cloud environment, an office building, a person). The
second axis is **knowledge level**: how much information and access the tester is given before
starting (none, some, or full). Any real engagement is a specific combination of both (a "gray-box
web application test" or a "black-box external network test"), and that combination is what
actually determines what the engagement can and can't tell you.

## Why It Exists

If every pentest meant the same fixed set of steps against the same fixed target, there would be
nothing to scope: you'd just buy "a pentest." In reality, an internal payroll system, a public
marketing website, and a mobile banking app face completely different threats and need completely
different testing approaches to produce a useful result. The surface/knowledge matrix exists because
matching the engagement type to the actual risk you're trying to understand is what makes the results
meaningful, rather than technically true but practically useless.

## How It Works

**Target surface** describes where the tester is pointed:

- **External network**: internet-facing infrastructure, meaning firewalls, VPN gateways, and exposed servers.
- **Internal network**: what an attacker (or a compromised laptop) could reach once already inside
  the corporate network.
- **Web application**: a specific website or web app's own logic, authentication, and data handling.
- **Mobile application**: an iOS/Android app's client-side code, local storage, and API calls.
- **API**: the programmatic interfaces backing web and mobile apps, tested directly rather than
  through a UI.
- **Cloud configuration**: how cloud infrastructure (identity permissions, storage access, network
  rules) is configured, distinct from testing an application that happens to run on it.
- **Wireless**: the security of Wi-Fi networks and the devices that trust them.
- **Physical / social engineering**: whether a person can walk into a building, or be convinced by
  phone or email to hand over access, bypassing technical controls entirely.

**Knowledge level** describes what the tester starts with:

- **Black-box**: no prior information or credentials, matching an anonymous external attacker.
- **Gray-box**: partial access, most commonly a standard, low-privilege user account, matching an
  attacker who has phished a regular employee or a malicious insider with normal access.
- **White-box**: full access, including source code, architecture diagrams, and often admin
  credentials, matching a scenario where the goal is maximum coverage rather than realism.

The two axes combine into a real scoping decision. A useful way to see this:

| Target surface | Black-box | Gray-box | White-box |
|---|---|---|---|
| External network | Simulates an anonymous internet scan-and-attack attempt against perimeter defenses | Rare combination: knowledge level mostly matters for applications, not perimeter infrastructure | Used to validate firewall/segmentation rules directly against their intended design |
| Web application | Tests what an anonymous visitor can do or break; slower, may miss logic bugs behind a login | Standard choice: tests what a logged-in user can do beyond their intended permissions (the most common real-world attacker position) | Fastest and most thorough; source-code access lets the tester find subtle logic flaws a black-box approach could easily miss entirely |
| Cloud configuration | Rarely meaningful, since cloud misconfigurations are usually invisible from outside without account access | Occasionally used to test what a compromised low-privilege cloud identity could reach | Standard choice: the tester reviews actual permission and configuration data directly, since the risk here is misconfiguration, not a hidden secret |

Neither axis is "better" in the abstract: each combination is suited to a different question. A
black-box external network test answers "what can a random attacker on the internet see and reach?"
A white-box web application test answers "given everything, how deep do our worst possible flaws go?"
Those are different questions, and paying for the wrong one to answer the other wastes the budget.

## Where This Shows Up in Practice

- A company about to launch a new customer-facing web app commonly chooses a **white-box or gray-box
  web application test** before launch, because at that stage the goal is maximum coverage of logic
  flaws while there's still time to fix them cheaply.
- A company needing to demonstrate perimeter resilience to a cyber-insurance underwriter or an
  auditor commonly chooses a **black-box external network test**, because the underwriter's actual
  question is "what does an opportunistic attacker see from the outside," not "what's technically
  possible with full information."
- A company migrating core infrastructure to a cloud provider commonly adds a **white-box cloud
  configuration review**, because the highest-risk mistakes in cloud environments are misconfigured
  permissions, not undiscovered code-level bugs (see [Cloud Security](../cloud-security/)).

## Why a Business Should Care

Picking the wrong combination of surface and knowledge level is one of the most common ways a
security budget gets wasted without anyone noticing, because the test still "runs" and still produces
a report. It just answers a question nobody was actually asking. A black-box test of an application
that isn't live on the public internet yet will find little to nothing, not because the app is secure,
but because there was nothing for an anonymous outsider to reach. That's a scoping failure, not a
security success, and a client who doesn't know to ask about it can walk away with false confidence.

The right conversation to have with a client before scoping anything is: what decision is this test
meant to inform? "Can we trust our perimeter?" points toward black-box network testing. "Is our new
app's logic sound before launch?" points toward white-box or gray-box web application testing.
Letting the actual business question drive the technical choice, instead of defaulting to whatever
was purchased last year, is what turns a pentest from a compliance line item into something genuinely
useful.

## Common Misconceptions

- **"Black-box is always more realistic, so it's always better."** Realism isn't the only variable
  that matters. Black-box testing is slower and more expensive per finding, because time gets spent
  rediscovering things a white-box tester would already know. For finding the deepest possible flaws
  on a fixed budget, white-box testing usually finds more, faster. The "realism" of black-box testing
  is a specific, deliberate tradeoff, not a universal upgrade.
- **"Internal and external network tests are basically the same thing."** They test opposite threat
  models. An external test asks what an anonymous internet attacker can reach; an internal test asks
  what happens after someone (or something) is already inside: a much more common real-world
  starting point than most people assume, given how often initial access comes from a phished
  employee rather than a direct perimeter breach.

## Related Topics

- [What Is Penetration Testing?](../what-is-penetration-testing/): the step-by-step methodology
  followed regardless of which type of engagement is scoped.
- [Red Teaming](../red-teaming/): a related but distinct discipline that simulates a specific
  adversary's goal rather than maximizing coverage across a scope.
- [Cloud Security](../cloud-security/): the domain behind cloud configuration testing specifically.
- [Application Security](../application-security/): the domain behind web and mobile application
  testing specifically.
