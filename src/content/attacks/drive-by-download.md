---
title: Drive-by Download
summary: How malware ends up on a device just from viewing a webpage, with no file ever knowingly opened or downloaded by the victim.
capec: []
mitreAttack: ["T1189"]
typicalSeverityCeiling: High
related: ["watering-hole-attack", "malware"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

A drive-by download is malware that ends up installed on a device simply because someone visited a
webpage. No file was knowingly opened, no installer was run, no attachment was clicked. The victim's
only action was loading a page, the same completely ordinary action they take dozens of times a day.

## What Makes It Work

The web works by letting a page run code in a visitor's browser: that's not a bug, it's the entire
mechanism behind every interactive website. The assumption everyone quietly makes is that this code
is confined to a sandbox: it can animate a menu or validate a form, but it can't reach outside the
browser and touch the underlying device. A drive-by download happens when that sandbox has a real
flaw, in the browser itself or in a plugin the browser loads, and a page's code uses that flaw to
step outside the boundary it's supposed to be confined to. What breaks isn't the user's judgment; it's
the technical isolation between "displaying content" and "running arbitrary code on the host," which
is the actual security property the browser sandbox exists to guarantee.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-drive-by-download" style="width:100%;height:auto;">
<title id="diagram-title-drive-by-download">Flow from visiting a compromised page to a malware-infected device</title>
<defs>
<marker id="arrow-drive-by-download" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Visitor loads</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">a normal page</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-drive-by-download)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Page or ad runs</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">exploit code</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-drive-by-download)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Browser/plugin</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">flaw is triggered</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-drive-by-download)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Malware installed,</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">no click needed</text>
</svg>
<figcaption>No file is ever knowingly opened; the exploit runs the moment the page loads.</figcaption>
</figure>

## Where It Actually Shows Up

- **A legitimate site that's been compromised**, silently serving malicious code alongside its normal
  content to visitors who have no reason to suspect anything: the exact delivery mechanism behind
  [watering hole attacks](../watering-hole-attack/).
- **Malvertising**: a malicious ad served through an otherwise legitimate, reputable ad network,
  which most sites embed without individually vetting every ad that gets served through it.
- **Outdated browsers or browser plugins** carrying a known, publicly disclosed flaw that simply
  hasn't been patched yet on the visitor's device: the single most common enabling condition.

## Why It Keeps Succeeding

Patching browsers and plugins across a large population of individual devices is genuinely
inconsistent. Some people update immediately, many don't for weeks or months, and a single
unpatched machine is all this technique needs. Worse, the usual security advice people are trained
on ("don't click suspicious links," "don't open unexpected attachments") simply doesn't apply here.
A compromised legitimate site or a malicious ad on a trusted network carries the visitor's existing,
earned trust; there is no suspicious link to hesitate over, because the page itself looks completely
normal.

## How to Detect It

1. **Browser and endpoint isolation or sandboxing** that contains exploitation attempts even against
   a flaw that hasn't been patched yet, rather than relying on patching alone to be complete and
   current at all times.
2. **Monitoring for unexpected outbound network connections** immediately following ordinary web
   browsing activity: a legitimate page loading images and scripts doesn't normally trigger a
   connection to unfamiliar infrastructure.
3. **Maintaining a real inventory of browser and plugin versions** across the organization's devices,
   so actual exposure to known, disclosed flaws is a known quantity rather than a guess.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Fully patched, sandboxed browser on a low-privilege user account | Exploitation attempt likely fails or is contained; limited to no lasting compromise |
| Outdated browser or plugin with a known, unpatched flaw | Successful, silent malware installation with no user awareness that anything happened |
| Infected device runs under a high-privilege account (e.g. a shared administrative workstation) | Malware inherits that privilege level, turning a single-device compromise into a much larger foothold |
| Infected device sits on a flat, unsegmented internal network | The initial infection becomes a launching point for further lateral movement, not a contained incident |

## Why a Business Should Care

The most important thing to communicate to a client about this specific technique is that it requires
no employee mistake at all: no one clicked anything they shouldn't have, no one was fooled by a
convincing email. That reframes the conversation about controls: security-awareness training, while
genuinely useful against phishing and social engineering, does essentially nothing against this
technique, because there was never a decision point for a trained employee to get right or wrong. The
mitigation has to be technical (patching discipline and browser isolation), not behavioral, and a
client budgeting only for training while skipping patch management is leaving this specific door wide
open.

## A Worked Example

*(Generalized from common assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

During a routine security assessment for a mid-sized logistics company, Solheim Freight, the
assessment team inventories browser and plugin versions across a sample of employee workstations as
part of standard endpoint hygiene checks. Roughly a fifth of sampled machines are running a browser
version with a publicly disclosed, patched-in-a-later-release memory-corruption flaw. The fix exists
and has been available for months; it simply hasn't been deployed to these specific machines.

The team doesn't need to develop or run a live exploit against the flaw to make the finding real: the
version number itself, cross-referenced against the public disclosure for that flaw, is sufficient
proof that these specific machines are currently exposed to any page, compromised legitimate site or
malicious ad, capable of using it. The finding is reported as a patch-management gap with a
demonstrated, named exposure, not a hypothetical "keep your browser updated" recommendation.

## Severity Calibration

Severity here tracks two things, neither of which is the delivery method's cleverness: what privilege
level the exploited browser process (and by extension the malware it drops) could act with, and what
that specific device could reach on the network afterward. A patched, sandboxed browser on an isolated
low-privilege account represents a much lower real ceiling than the identical unpatched flaw reached
from an unsegmented, high-privilege workstation. The vulnerability class is the same; the demonstrated
blast radius is not.

## Prevention & Response

The real fix is disciplined, largely automated browser and plugin patching, deployed promptly and
verified, not left to individual users' judgment, combined with browser isolation or sandboxing
technology that contains an exploitation attempt even during the window before a patch is deployed.
Ad networks serving content to managed corporate browsing environments are worth vetting or
restricting specifically because malvertising is a real, recurring delivery path for this technique.

The common inadequate response is leaning entirely on security-awareness training as if this were a
user-judgment problem. It structurally isn't: there's no suspicious link to train someone to avoid,
because the page was never suspicious-looking in the first place.

## Related Attacks & Vulnerabilities

- [Watering Hole Attack](../watering-hole-attack/): the targeting strategy that most often puts this
  exact delivery mechanism in front of a specific, chosen audience rather than random visitors.
- [Malware](../malware/): the broader category of payload a drive-by download typically installs
  once the underlying browser or plugin flaw has been exploited.
