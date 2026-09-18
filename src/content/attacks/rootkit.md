---
title: Rootkit
summary: How malware specifically designed to hide itself defeats normal detection, and why removal often requires rebuilding a system rather than trusting it to clean itself.
capec: []
mitreAttack: ["T1014"]
typicalSeverityCeiling: Critical
related: ["malware", "advanced-persistent-threat"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

A rootkit is malware specifically engineered to hide its own presence — and often the presence of
other malware installed alongside it — from the operating system and the tools meant to detect it.
Ordinary [malware](../malware/) tries to accomplish something (steal data, encrypt files, mine
currency) and may or may not be noticed doing it. A rootkit's defining goal is concealment itself:
staying invisible is the primary job, not a side effect.

## What Makes It Work

The assumption being exploited is that an operating system's own reporting about itself — which
processes are running, which files exist, which network connections are open — can be trusted. A
rootkit typically gains privileged (often kernel-level) access and then intercepts or alters exactly
that reporting layer, so an infected file, process, or connection simply doesn't appear when a normal
tool asks the operating system to list it. What breaks isn't one specific piece of data — it's the
fundamental ability to trust anything the infected system says about its own state, which is precisely
why rootkits are structurally harder to detect than almost anything else on this site.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-rootkit" style="width:100%;height:auto;">
<title id="diagram-title-rootkit">Four stages from privileged installation to a system that can no longer be trusted to report on itself</title>
<defs>
<marker id="arrow-rootkit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Privileged access</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">gained</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-rootkit)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Reporting layer</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">intercepted</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-rootkit)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Files/processes</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">hidden from OS</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-rootkit)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">In-OS tools</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">report "clean"</text>
</svg>
<figcaption>Once the reporting layer itself is compromised, nothing running on the infected system can confirm its own state.</figcaption>
</figure>

## Where It Actually Shows Up

- **User-mode rootkits** — operate within normal application privilege levels, the shallowest and most
  detectable variant.
- **Kernel-level rootkits** — operate inside the operating system's own core, altering system-wide
  reporting directly and evading most tools that rely on the OS to report honestly.
- **Bootkits** — infect the boot process itself, before the operating system has even finished loading,
  which defeats OS-level detection entirely because it simply starts too late to see the compromise.
- **Firmware-level rootkits** — persist below the operating system altogether, surviving even a full OS
  reinstall since the infection never lived in the OS to begin with.

## Why It Keeps Succeeding

A well-implemented rootkit's entire purpose is to defeat the exact mechanisms that would normally
catch other malware — that's a fundamentally harder detection problem than catching malware that isn't
actively trying to hide. The deeper a rootkit sits in the stack, the less any tool running *on* the
infected system can be trusted to find it, which is why the deepest variants (firmware and boot-level)
are also the hardest to detect and the hardest to fully remove.

## How to Detect It

Detection has to specifically avoid trusting the potentially-compromised operating system to report on
itself:

1. **Offline or out-of-band scanning** — examining a drive from a separate, known-clean environment,
   rather than asking the possibly-infected system to scan itself.
2. **Boot-integrity verification** — secure boot and measured boot, which cryptographically verify each
   stage of the boot chain rather than assuming it's untampered.
3. **Behavioral and network anomalies** that don't depend on the infected OS's own process list being
   honest — unexpected outbound connections or timing anomalies observed from outside the host.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| User-mode rootkit, detected through careful offline analysis | Contained; removal is disruptive but the infection never reached privileged system layers |
| Kernel-level rootkit, evading most in-OS detection tools | Serious; the infected system's own reporting can no longer be trusted for anything, and in-place cleanup is unreliable |
| Firmware or boot-level rootkit | Most severe; the infection can survive a full operating system reinstall, since it never lived in the OS in the first place |

## Why a Business Should Care

The direct thing worth telling a client: once a rootkit at the kernel level or deeper is confirmed,
the credible remediation is usually rebuilding the affected system from a known-clean image — and in
firmware cases, potentially replacing the hardware entirely — not "cleaning" the infected system in
place. Nothing running on that system can be fully trusted afterward. This changes both the cost and
the timeline of incident response substantially compared to ordinary malware, and it's worth setting
that expectation early rather than promising a quick in-place fix that may not actually be reliable.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
malware family is referenced.)*

During an incident response engagement for Cascadia Freight Systems, offline analysis of a suspect
server's disk image — performed from a separate, known-clean environment rather than trusting the
server's own running state — reveals a discrepancy: files visible in the raw disk image don't appear
when the same directory is listed from within the live, running operating system. That mismatch is the
core rootkit indicator: the live OS's own reporting is actively hiding something the offline image
shows plainly.

Further offline analysis identifies kernel-level hooking consistent with a rootkit intercepting file
and process listing calls. Because the concealment operates at the kernel level, the recommendation is
a full rebuild from a known-clean backup rather than attempting in-place removal — any cleanup tool run
from within the still-compromised operating system cannot be trusted to see everything it needs to see.

## Severity Calibration

This class generally rates at the high end of the scale given that concealment is the entire point —
even a "minor" rootkit represents a fundamental trust failure. The specific level within that range
depends on how deep the concealment reaches: a user-mode rootkit caught early is serious but
containable; a confirmed kernel-level or firmware rootkit, as in the example above, justifies a
**Critical** rating because of what full remediation actually requires.

## Prevention & Response

The real fix is boot-integrity verification (secure boot, measured boot with a signed and verified
boot chain) to prevent the deepest variants from taking hold in the first place, offline scanning that
never trusts the live operating system to report on itself, and — once a rootkit is confirmed —
rebuilding from a known-clean image rather than trusting in-place removal.

The common inadequate fix is running an in-OS antivirus scan and trusting a "clean" result from a
system whose own reporting may be exactly what's compromised. If the tool doing the checking is
running on the same system the rootkit controls, its "all clear" result tells you very little.

## Related Attacks & Vulnerabilities

- [Malware](../malware/) — the broader category rootkits belong to, distinguished by their specific
  focus on concealment over any other objective.
- [Advanced Persistent Threat](../advanced-persistent-threat/) — rootkit-level concealment is a common
  technique for maintaining long-term, undetected access during a sustained campaign.
