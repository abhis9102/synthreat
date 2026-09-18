---
title: Security Logging and Monitoring Failures
summary: Why a breach that runs undetected for months is usually a failure to notice a defense had already failed, not a failure of the defense itself.
owasp: "A09:2021 – Security Logging and Monitoring Failures"
cwe: ["CWE-778"]
typicalSeverityCeiling: Medium
related: []
status: published
datePublished: 2026-09-18
---

## Definition

Security logging and monitoring failures happen when security-relevant events aren't logged at all,
or are logged somewhere nobody actually reviews or alerts on. The result is the same either way: an
attacker's activity leaves no usable trail, or leaves one that exists on disk but never reaches a
human or system capable of acting on it.

## The Trust Boundary That Breaks

Teams routinely treat logging as a debugging tool built for developers chasing down application
errors, not as a security control in its own right. Events that matter most for detecting an attack,
failed login attempts, access to sensitive records, privilege changes, often aren't logged with
enough detail to spot a pattern, or aren't logged at all. Even where logs exist, the assumption that
"we log things" is often mistaken for "we would notice if something happened," when nobody has
actually connected those logs to an alert that fires on a realistic attack pattern.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-logging" style="width:100%;height:auto;">
<title id="diagram-title-logging">How a real attack pattern goes unnoticed despite logs technically existing</title>
<defs>
<marker id="arrow-logging" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker probes</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">a login endpoint</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-logging)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Failed attempts</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">are logged</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-logging)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">No alert tied</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">to the pattern</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-logging)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Compromise goes</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">unnoticed for weeks</text>
</svg>
<figcaption>The log entries existed the whole time. Nothing was watching them.</figcaption>
</figure>

## Where It Actually Shows Up

- **Authentication failures not logged**, or logged without enough detail (source, timing, target
  account) to distinguish a normal typo from a sustained attack pattern.
- **Sensitive data access not logged**: who read a specific customer record, and when, often isn't
  tracked at all outside of general application logs never designed for that purpose.
- **Logs that exist but have no alerting tied to them**, so a genuine anomaly sits unreviewed among
  routine noise until, if ever, someone happens to look.
- **Logs that can be tampered with or deleted** by the same access level that would be compromised in
  an attack, meaning the exact moment the logs matter most is the moment they can least be trusted.

## Why It Keeps Happening

Logging infrastructure is usually built by engineers solving a debugging problem, not a security
problem, and the two have different priorities: a debug log needs enough detail to reproduce a bug,
a security log needs enough detail to reconstruct what an attacker did and when. Building real
alerting on top of logs takes ongoing tuning against actual attack patterns, which is easy to
deprioritize when nothing has gone wrong yet, and easy to underfund once it has, since the incident
itself absorbs the attention that should have gone into prevention.

## How to Find It

1. Attempt a realistic attack pattern (repeated failed logins against a test account, access to a
   test record outside normal patterns) during an assessment, and check whether it produces a log
   entry with enough detail to reconstruct what happened.
2. Separately, check whether that log entry triggers any actual alert, or whether it simply sits in a
   log file nobody is watching in real time.
3. Test whether logs themselves can be altered or deleted by an account at the same privilege level
   that a realistic attacker would compromise first.
4. Review whether sensitive data access specifically, not just authentication events, is logged at
   all.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Logging exists and is actively monitored with alerting tied to realistic patterns | Incidents are detected quickly, limiting how far an attacker can get before response begins |
| Logging exists but nobody actively monitors it | An attacker's activity is technically reconstructable after the fact, but only after damage is already done and someone thinks to look |
| No meaningful security logging at all | An incident may never be fully understood, even after discovery, because there's no record of what actually happened |

## Why a Business Should Care

This category rarely causes a breach on its own, but it's what turns a contained incident into a
prolonged one. An intrusion detected in hours costs far less than the same intrusion discovered
months later, both in direct damage and in the scope of what has to be investigated and disclosed.
[Advanced Persistent Threat](../../attacks/advanced-persistent-threat/) campaigns specifically rely
on this gap: operating undetected for an extended period is the entire premise, and it only works
because logging and monitoring failures let it.

## Common Misconceptions

Not applicable to this vulnerability class page as a separate section; see Why It Keeps Happening
above for the recurring gap behind this failure.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

During a security assessment for Aldercreek Financial Services, a sustained, deliberately obvious
pattern of failed login attempts is generated against a single test account over a short window, well
beyond what any normal user's mistyped password would produce. The attempts are confirmed present in
raw log files, but produce no alert, no dashboard indicator, and no notification to the security team
during the test window.

The finding isn't that logging is entirely absent; it's that the gap between "technically logged" and
"actually monitored" is wide enough that a real attack of this shape would run to completion
unnoticed. Testing stops at confirming this detection gap, without pursuing account compromise itself.

## Severity Calibration

This class typically rates lower on its own than most vulnerability classes on this site, since a
logging gap doesn't directly grant access to anything. Its real severity comes from how much it
extends the impact of whatever else goes wrong: paired with a class capable of prolonged, undetected
access, the effective severity of that combination is far higher than either issue rated
independently.

## Remediation

The real fix is logging security-relevant events specifically, not just debug output, with alerting
tuned to realistic attack patterns rather than generic thresholds, and protecting logs from tampering
by the same access level that would be compromised in an attack. The common bad fix is enabling
verbose logging with no one and nothing actually watching it, which produces a false sense of "we'd
know if something happened" without the monitoring that claim actually depends on.

## Related Classes

- **Advanced Persistent Threat**
  ([../../attacks/advanced-persistent-threat/](../../attacks/advanced-persistent-threat/)): the attack
  pattern this specific gap enables most directly, since prolonged, undetected access is its entire
  premise.
