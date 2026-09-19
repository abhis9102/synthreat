---
title: Incident Response
summary: The structured process for handling a security incident after something has already gone wrong, and why the plan has to exist before it is needed.
related: []
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

Incident response is the structured process an organization follows when it has an actual,
confirmed security incident on its hands. Every other page on this site is about preventing a
weakness from being exploited or finding one before an attacker does. This page is about what
happens once prevention has already failed and something real is underway.

## Why It Exists

Even a mature, well-funded security program will eventually face a genuine incident. No amount of
prevention drives that probability to zero. What actually separates a contained, well-handled
incident from a prolonged, expensive disaster is very often the quality of the response process,
not the sophistication of the attacker. A skilled team with no plan will waste critical early hours
figuring out who should be doing what. Incident response exists to make sure that time is spent
acting instead of organizing.

## How It Works

A real incident response process moves through a few distinct stages, and skipping straight to the
technical fix without the surrounding stages is one of the most common ways organizations make a
bad incident worse:

1. **Preparation.** A written incident response plan, defined roles, and current contact
   information, all established before anything happens, not assembled during the incident itself.
   This stage also includes practicing the plan (tabletop exercises are the standard way to do this)
   so the first real incident isn't also the first time anyone has walked through the steps.
2. **Detection and analysis.** Confirming that something is actually a real incident, not a false
   alarm, and scoping how far it actually reaches. This depends directly on the detection capability
   a [security operations](../../domains/security-operations/) function provides day to day.
3. **Containment.** Stopping the incident from spreading further right now, even before the root
   cause is fully understood. Isolating an infected machine from the network is the classic example.
4. **Eradication.** Removing the actual cause, not just the visible symptom. A machine that's been
   reimaged but still sits on a network with the same unpatched vulnerability that let the attacker
   in the first time hasn't actually been fixed.
5. **Recovery.** Safely restoring normal operation, verified rather than assumed.
6. **Lessons learned.** A structured review after the fact that feeds directly back into prevention
   and detection. This stage is often skipped once the pressure is off, which is exactly backward:
   it's where the incident's cost turns into future value instead of just being absorbed.

## Where This Shows Up in Practice

A written incident response plan and an already-established relationship with outside responders,
put in place long before they're needed, so the first call during a real incident is to a number
already on file rather than a search for who to even contact. Tabletop exercises that rehearse the
plan against a realistic scenario (a simulated ransomware outbreak, a suspected data exfiltration)
without any real system actually being touched, specifically to surface gaps in the plan while the
stakes are still zero. Breach notification obligations that several compliance regimes explicitly
require once a qualifying incident is confirmed, on a clock that starts the moment the incident is
discovered, not when the organization feels ready to talk about it.

When an incident is actually live, the tools doing the real work are a SIEM (Splunk, Elastic, or
Microsoft Sentinel are common choices) correlating the alerts that first flagged it, an EDR platform
(CrowdStrike Falcon or Microsoft Defender for Endpoint, among others) isolating the affected host, and
forensic tools like Volatility or KAPE preserving memory and disk evidence before anything gets
touched further.

Consider a fully invented example: Aldergrove Logistics discovers unusual encryption activity on a
file server at 2 a.m. A team with a rehearsed plan already knows who has authority to isolate that
server from the network without waiting for a morning meeting, already has a pre-drafted
communication plan for customers if data turns out to be affected, and already knows which outside
incident response firm to call. A team without one spends those same early hours debating who's
allowed to make the isolation call at all, and the delay is usually where a contained incident turns
into a much larger one.

## Why a Business Should Care

The cost difference between "we had a tested plan and executed it" and "we figured it out as we
went, live, during the incident" is enormous, and it shows up in almost every serious incident
retrospective. This is one of the most concrete, actionable things a business can actually prepare
for ahead of time, rather than something that only gets attention once it's already too late to
matter. It's also a genuinely good, low-friction way to open a planning conversation with a client:
not "are you going to get breached," but "if you were, would the first hour go well or badly."

## Common Misconceptions

**"Incident response starts when the incident happens."** This is the single most important point on
this page to correct, and it's false. The plan, the defined roles, and the outside relationships all
have to exist beforehand. Assembling any of that for the first time during a real incident is far
slower, far more error-prone, and happens under exactly the wrong kind of pressure to make good
decisions.

**"IT can just handle it, we don't need a formal plan."** Also false. A real incident usually
involves legal exposure, customer and regulator communication, and executive decisions alongside the
purely technical response, not a technical fix in isolation.

**"Once the systems are back online, the incident is over."** Also false. Recovery restores
operation, but the lessons-learned stage is what actually prevents the same incident from happening
again, and skipping it is a common way organizations get hit by a close variation of the same
incident a second time.

## Related Topics

- [Ransomware](../../attacks/ransomware/), a common real-world scenario this process directly
  applies to, especially the containment and eradication stages.
- [GDPR](../../compliance/gdpr/) and [HIPAA](../../compliance/hipaa/), two compliance regimes with
  their own explicit breach notification obligations that a response plan needs to account for.
- [Security Operations](../../domains/security-operations/), the detection function this process
  depends on to know an incident is happening in the first place.
