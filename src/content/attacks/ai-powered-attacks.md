---
title: AI-Powered Attacks
summary: How generative AI lowers the cost of convincing phishing and deepfake-enabled social engineering at scale, and what actually changes for defense as a result.
capec: []
mitreAttack: []
typicalSeverityCeiling: High
related: ["phishing", "social-engineering", "business-email-compromise"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

AI-powered attacks use generative AI (text, voice, or video generation) to make traditional attack
techniques, especially phishing and social engineering, cheaper to produce and more convincing at
scale. This is not a new attack category on its own; it is an amplifier of techniques already covered
elsewhere on this site, specifically [Phishing](../phishing/), [Social
Engineering](../social-engineering/), and [Business Email Compromise](../business-email-compromise/).
This page covers what changes when AI is layered on top of those, not the underlying mechanics
themselves.

## What Makes It Work

The trust assumption being exploited is the same one phishing and social engineering have always
relied on: that a message or voice genuinely comes from who it claims to. What AI-powered attacks
change is which defensive tells are still available to catch it. Two traditional tells disappear:
poor grammar or unnatural phrasing in written phishing content, and the practical difficulty of
convincingly imitating someone's actual voice or appearance. Neither of those tells was ever a
structural defense; they were incidental byproducts of how hard convincing impersonation used to be.
Removing that difficulty does not create a new vulnerability so much as it removes a crutch a lot of
informal detection quietly depended on.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-ai-powered-attacks" style="width:100%;height:auto;">
<title id="diagram-title-ai-powered-attacks">How generative AI removes the tells that used to help a target catch an impersonation attempt.</title>
<defs>
<marker id="arrow-ai-powered-attacks" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker generates</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">fluent text, voice, or video</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ai-powered-attacks)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Traditional tells</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">(grammar, voice) removed</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ai-powered-attacks)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Target has no</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">informal tell to rely on</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-ai-powered-attacks)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Underlying phishing or</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">BEC outcome proceeds</text>
</svg>
<figcaption>The technique underneath is unchanged; only the defender's odds of spotting it informally get worse.</figcaption>
</figure>

## Where It Actually Shows Up

- **AI-generated phishing email** with no linguistic tells that used to help a careful reader spot
  it, produced at a volume and quality that used to require real skill or effort.
- **Voice-cloning-enabled vishing**, where a phone call convincingly imitates a real executive's
  voice, directly escalating the [Business Email Compromise](../business-email-compromise/) scenario
  already covered on this site.
- **Deepfake video** used within a video-call-based pretext, adding a visual layer to an otherwise
  ordinary social engineering attempt.

## Why It Keeps Succeeding

Security awareness training has historically taught people to look for exactly the tells (poor
grammar, generic phrasing, an unnatural-sounding voice) that generative AI is specifically capable of
removing. Training built around spotting those tells becomes less effective as the underlying
technology improves, and it will keep becoming less effective, because the target being trained
against is a moving one.

## How to Detect It

The controls that already defend against business email compromise and vishing remain fully
effective here, because they never depended on spotting a tell in the first place: out-of-band
verification through a known, independently-sourced contact method works exactly as well against a
convincing AI-generated voice as it does against a human impersonator, since it does not try to judge
how convincing the message sounds at all.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| A generic AI-assisted phishing attempt caught by existing email filtering | Minimal; the underlying delivery mechanism was still stopped upstream |
| A targeted voice-cloning vishing attempt against a specific employee | Meaningful risk of a successful pretext, since the traditional "that doesn't sound right" instinct is unreliable here |
| A successful deepfake-enabled pretext leading to a fraudulent transfer | Escalates to the same outcome as a traditional business email compromise incident, with direct financial loss |

## Why a Business Should Care

This does not require an entirely new defensive strategy so much as it removes the option of relying
on "we can usually tell" as an informal backstop. The useful, direct thing to say to a client is that
awareness training needs to shift decisively from spotting tells toward mandatory independent
verification for any sensitive request, regardless of how convincing it seems, because "it sounded
completely real" will increasingly be the normal experience rather than a red flag.

## A Worked Example

*(Fully invented for illustration. No real organization, incident, or data referenced.)*

As part of an authorized security assessment for Halvorsen Trust Partners, with explicit written
consent, scope, and rules of engagement agreed in advance, a testing team runs a simulated
voice-cloning-enabled vishing test against a small group of employees. Using a short, publicly
available sample of a senior executive's voice from a company webinar, the team generates a brief
synthetic voice call requesting an urgent, unusual action from finance staff.

The test is halted the moment a target either complies or correctly escalates for verification, and
no actual funds ever move as part of the exercise. The finding that matters is not whether the voice
sounded convincing (it did); it is whether the organization's existing out-of-band verification
process actually caught the request regardless. In this case, one of three targeted employees
proceeded without verification, confirming a real gap that has nothing to do with how good the
synthetic voice was and everything to do with an unenforced verification step.

## Severity Calibration

Severity depends entirely on what the underlying amplified technique (phishing, business email
compromise, vishing) actually achieves in a given instance, not on the fact that AI was involved in
producing it. A convincing but ultimately unsuccessful attempt, caught by proper verification, rates
far lower than one that reaches a fraudulent transfer or a real credential compromise.

## Prevention & Response

The real fix is shifting training and process decisively away from "spot the tell" and toward
mandatory out-of-band verification for any sensitive request regardless of how convincing it seems,
using the same verification-callback control already described in [Business Email
Compromise](../business-email-compromise/)'s own remediation.

The common bad fix is investing in trying to train employees to get better at detecting AI-generated
content specifically. That is a losing, ever-shifting target as the underlying technology keeps
improving, and it treats a process gap as if it were a perception problem.

## Related Attacks & Vulnerabilities

- [Phishing](../phishing/): the written form this technique most commonly amplifies.
- [Social Engineering](../social-engineering/): the broader category of manipulating a person rather
  than a system, now amplified by synthetic voice and video.
- [Business Email Compromise](../business-email-compromise/): the highest-stakes real-world scenario
  this technique escalates, and the source of the verification control that actually defends against
  it.
