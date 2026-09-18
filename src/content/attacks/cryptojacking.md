---
title: Cryptojacking
summary: Why an attacker would rather quietly steal your computing power than your data, and how this resource-theft attack is detected differently from a typical data breach.
capec: []
mitreAttack: ["T1496"]
typicalSeverityCeiling: Medium
related: ["malware", "iot-based-attacks"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## Definition

Cryptojacking is the secret use of a victim's computing resources to mine cryptocurrency for an
attacker's benefit. Unlike most of the attacks on this site, the goal isn't to steal data: it's to
steal computing power, quietly, for as long as possible.

## What Makes It Work

Cryptojacking is delivered through the same vectors as ordinary malware (a malicious attachment, a
compromised website script, an exploited server vulnerability), but what it does once it's in is
different, and that difference is the point. Most malware wants to reach data or credentials, and
that goal creates activity an attacker eventually has to surface (moving data, contacting a
command-and-control server for instructions, encrypting files). Cryptojacking's entire goal can be
satisfied by simply running quietly and continuously in the background. What breaks is availability
of computing resources (CPU and GPU cycles, cloud compute capacity, electricity), not
confidentiality of any specific data, which is exactly why it's built to avoid the kind of visible
activity that would normally raise an alarm.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-cryptojacking" style="width:100%;height:auto;">
<title id="diagram-title-cryptojacking">Flow from malware delivery to undetected resource theft</title>
<defs>
<marker id="arrow-cryptojacking" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Payload delivered</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">like ordinary malware</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cryptojacking)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Runs quietly,</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">mines in background</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cryptojacking)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Resource usage</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">and costs climb</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cryptojacking)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attributed to growth,</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">not investigated</text>
</svg>
<figcaption>The attack succeeds by staying beneath the threshold anyone bothers to investigate.</figcaption>
</figure>

## Where It Actually Shows Up

- **Traditional endpoint infection**: delivered via a malicious attachment, compromised download, or
  exploited vulnerability, exactly like other [malware](../malware/).
- **Browser-based cryptojacking**: a script embedded in a malicious or compromised webpage that mines
  only while the page is open, requiring no installation on the device at all.
- **Cloud compute instances specifically**: an increasingly common target, because usage on a large
  cloud bill can scale for a meaningful amount of time before anyone notices the increase against the
  expected baseline.

## Why It Keeps Succeeding

Cryptojacking is deliberately designed to be quiet and low-impact per victim, unlike ransomware, which
announces itself the moment it activates. Elevated resource usage or a rising cloud bill is easy to
attribute to legitimate business growth rather than investigated as a security incident, especially in
an organization that isn't already tracking per-workload resource baselines closely.

## How to Detect It

1. **Monitoring for CPU/GPU utilization inconsistent with a system's normal workload**: a sustained,
   unexplained baseline shift is the clearest signal.
2. **Reviewing unexplained increases in cloud compute costs** against what actual business activity
   would predict, rather than assuming growth explains every increase.
3. **Network monitoring for connections to known cryptocurrency-mining pool infrastructure**, which
   mining software generally needs to communicate with to be useful to the attacker at all.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Single infected endpoint, browser-based, active only while a malicious page is open | Minor, temporary performance degradation, likely to go unnoticed |
| Cryptojacking malware installed and persistent on an endpoint | Continuous performance degradation and shortened hardware lifespan from sustained high utilization |
| Undetected across a fleet of cloud compute instances | Significant, ongoing inflated cloud costs, potentially for months before detection |
| Detected only after a substantial unexplained cost increase | The delay itself represents the real cost: the earlier this is caught, the smaller the loss |

## Why a Business Should Care

This is a useful example to walk a client through of an attack that doesn't fit the "was our data
stolen" question they usually lead with. The actual damage here is degraded performance, inflated
infrastructure costs, and shortened hardware lifespan: a resource-theft impact, not a data-theft one.
It's worth explicitly broadening a client's mental model of what counts as a security incident worth
investigating, rather than letting "nothing sensitive was taken" stand in for "nothing happened."

## A Worked Example

*(Generalized from common assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

During a cost and security review for a software company, Ferrowave Analytics, the review team
notices that a subset of cloud compute instances shows sustained CPU utilization well above what
their assigned workloads should produce, alongside a rising monthly cloud bill the engineering team
had attributed to normal customer growth. Network logs from those same instances show recurring
outbound connections to infrastructure consistent with cryptocurrency-mining pool activity.

Tracing back the initial access point, the affected instances share a common exposed service running
outdated software with a known, unpatched vulnerability. The mining payload itself is removed and the
instances rebuilt from a clean image; the real fix addressed in the report is the exposed,
unpatched service that let the payload in. The resource theft was a symptom, not the root finding.

## Severity Calibration

Severity here generally rates lower than most other entries on this page, precisely because the
attacker's intent is resource theft rather than data compromise. Calibration should still account for
two things beyond the mining activity itself: how the payload got in (the same delivery flaw could
just as easily have carried a more damaging payload instead) and how widely it spread before
detection, since a fleet-wide, months-long infection represents real, ongoing financial cost even
without any data ever being touched.

## Prevention & Response

The real fix is endpoint and cloud resource monitoring tuned to catch abnormal utilization patterns,
the same patching and endpoint-protection discipline used against malware generally, and network
egress monitoring for connections to known mining-pool infrastructure.

The common inadequate response is dismissing unexplained performance or cost anomalies as an
infrastructure quirk rather than investigating them as a possible security incident, which is
exactly the blind spot this technique is built to exploit.

## Related Attacks & Vulnerabilities

- [Malware](../malware/): the broader category cryptojacking belongs to, distinguished mainly by its
  resource-theft goal rather than data theft.
- [IoT-Based Attacks](../iot-based-attacks/): another attack type where compromised devices are
  valued for the resources or capacity they add to an attacker's infrastructure, not the data on them.
