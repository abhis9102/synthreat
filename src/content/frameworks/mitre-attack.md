---
title: MITRE ATT&CK
summary: What MITRE ATT&CK actually catalogs, how tactics and techniques differ, and why it's the shared vocabulary behind every attack-technique page on this site.
related: ["frameworks-standards", "types-of-cyberattacks"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-19
---

## What It Is

MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) is a free, publicly maintained
knowledge base cataloging real-world adversary behavior: not a prioritized "top" list like the [OWASP
Top 10](../owasp-top-10/), but a comprehensive taxonomy of the specific things attackers actually do,
organized so any two people, a red teamer, a blue team analyst, a client, can refer to the exact same
named technique instead of describing it in their own words. It's maintained by MITRE, a US
government-funded, not-for-profit research organization, and it's the specific standard every
[attack-technique page on this site](../../attacks/) cites by ID wherever an ID is confidently known.

## Why It Exists

Before ATT&CK, describing an intrusion meant using whatever language the person writing the report
happened to reach for: "the attacker moved around the network," "they got persistence somehow." That
kind of description can't be compared across incidents, can't be checked against what a security
team's own detections actually cover, and can't be handed to a different analyst with any confidence
they'll understand the same thing. ATT&CK exists to replace informal description with a shared,
specific vocabulary, built from observed real-world intrusions rather than theoretical possibilities,
so "the attacker used T1566.001, Spearphishing Attachment" means exactly one thing to everyone who
reads it.

## How It Works

ATT&CK is organized around two levels that are easy to conflate but mean different things:

- **Tactics** are the adversary's goal at a given stage: *why* they're doing something. ATT&CK's
  Enterprise matrix defines fourteen of these, including Initial Access, Persistence, Privilege
  Escalation, Defense Evasion, Credential Access, Lateral Movement, Collection, Command and Control,
  and Exfiltration.
- **Techniques** (and their more specific **sub-techniques**) are *how* a tactic actually gets
  achieved. Phishing (tactic: Initial Access) is technique **T1566**; sending that phishing email
  with a malicious attachment specifically, rather than a link, is the sub-technique **T1566.001**.
  Every ID follows this pattern: a technique like **T1110** (Brute Force) can have sub-techniques like
  **T1110.004** (Credential Stuffing) that narrow it to a specific variant.

ATT&CK actually publishes several separate matrices for different environments, the **Enterprise**
matrix (the one referenced throughout this site) covering traditional IT, plus dedicated **Mobile**
and **ICS** (industrial control systems) matrices covering techniques specific to those environments,
since a technique that makes sense against a corporate network doesn't always translate to a phone or
a factory floor. The free **ATT&CK Navigator** web tool lets a team visualize and annotate exactly
which techniques their own detections actually cover across the matrix, turning the taxonomy from a
reference document into a working coverage map.

## Where This Shows Up in Practice

[Red team](../../methodology/red-teaming/) engagements map every action taken back to a specific
ATT&CK technique ID in the final debrief, so a defender learns exactly which named technique got past
their detection, not a vague narrative. Security operations and detection engineering teams use the
Navigator to track which techniques their SIEM and EDR tooling actually have a working detection for,
turning "are we covered" into a checkable, technique-by-technique answer instead of a guess. Threat
intelligence reporting on a specific real-world adversary group commonly describes that group's known
behavior as a set of ATT&CK technique IDs, so a defender can look up exactly which of their own
detections would catch that specific group.

## Why a Business Should Care

ATT&CK gives a business a concrete way to answer "are we protected against ransomware" or "are we
protected against phishing" with something more specific than a confident-sounding no. Ransomware and
phishing aren't single techniques, they're outcomes reached through a chain of specific ATT&CK
techniques (initial access, then execution, then privilege escalation, then impact), and mapping a
security program's actual detection coverage against that chain turns a vague reassurance into a
checkable claim: which specific steps in a realistic attack chain would actually get caught, and
which wouldn't.

## Common Misconceptions

**"ATT&CK is a prioritized list, like the OWASP Top 10."** It isn't ranked by severity or frequency
at all. It's a comprehensive taxonomy: every cataloged technique is documented because it's been
observed in the real world, not because it's been ranked as more or less dangerous than another one.
Prioritizing which techniques matter most for a specific organization is a separate exercise ATT&CK
supports but doesn't do for you.

**"Mapping to ATT&CK IDs is the same as being tested against them."** Citing a technique ID describes
what an adversary does; it doesn't prove a specific organization's defenses would actually catch it.
That proof is exactly what a [red team engagement](../../methodology/red-teaming/) is built to
provide, using ATT&CK as its reporting vocabulary rather than a checklist that's automatically
satisfied by naming the right IDs.

## Related Topics

- [Cybersecurity Frameworks & Standards](../frameworks-standards/): the overview this page sits
  under.
- [Red Teaming](../../methodology/red-teaming/): the engagement type that maps its findings directly
  onto ATT&CK technique IDs in its final debrief.
- [Common Types of Cyberattacks](../../domains/types-of-cyberattacks/): the taxonomy page linking to
  every attack-technique page that cites a specific ATT&CK ID.
- [AI Red Teaming](../../methodology/ai-red-teaming/): covers MITRE ATLAS, ATT&CK's sibling project
  cataloging adversary behavior specific to AI and machine learning systems.
