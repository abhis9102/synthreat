---
title: Vulnerable and Outdated Components
category: "Configuration & Supply Chain"
summary: Why a vulnerability in code the team never wrote a single line of is still the team's own vulnerability the moment it ships in production.
owasp: "A06:2021 – Vulnerable and Outdated Components"
cwe: ["CWE-1104"]
typicalSeverityCeiling: Critical
related: []
status: published
datePublished: 2026-09-18
---

## Definition

Vulnerable and outdated components means running a third-party library, framework, or dependency
that has a publicly known, unpatched vulnerability. The team didn't write the flawed code and may
never even look at it directly, but the moment it ships as part of a live application, it's the
team's own exposure to defend, not someone else's problem to wait out.

## The Trust Boundary That Breaks

The assumption being made, usually implicitly, is that a dependency selected and installed once
remains safe indefinitely, simply because it worked correctly when it was added. That assumption
holds only until a new vulnerability is disclosed against a version already running in production,
which happens constantly across the open-source ecosystem. The actual trust boundary that needs
active maintenance is the one between "a dependency we chose" and "a dependency we're still actively
verifying is safe," and very few teams treat that as an ongoing responsibility rather than a one-time
decision.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-vulnerable-outdated-components" style="width:100%;height:auto;">
<title id="diagram-title-vulnerable-outdated-components">A component is added once, a vulnerability is later disclosed against it, and the application keeps running the vulnerable version until someone checks</title>
<defs>
<marker id="arrow-vulnerable-outdated-components" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Dependency added</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">to the project</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-vulnerable-outdated-components)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">New CVE disclosed</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">against that version</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-vulnerable-outdated-components)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Production keeps</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">running old version</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-vulnerable-outdated-components)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Publicly known exploit</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">becomes usable</text>
</svg>
<figcaption>Every step above is public information; no custom exploit development is required.</figcaption>
</figure>

## Where It Actually Shows Up

- A direct dependency, deliberately chosen by the team, that hasn't been upgraded since a
  vulnerability was disclosed against the version in use.
- A transitive dependency, a dependency of a dependency, several layers removed from anything the
  team explicitly chose or even knows is present.
- Version information leaking through HTTP response headers, client-side JavaScript bundles, or
  error output, letting anyone fingerprint exactly what's running without needing internal access.
- Legacy components kept in place specifically because upgrading risks breaking something else, so
  the safer-feeling short-term choice becomes the long-term exposure.

## Why It Keeps Happening

Modern applications are assembled from dozens to hundreds of open-source components, and most of
that dependency tree is invisible day to day. Nobody is deliberately choosing to run vulnerable code;
they simply installed something that was safe at the time and never revisited it, because revisiting
every dependency continuously isn't something most teams have built a routine around. Upgrades also
carry real risk of breaking existing functionality, so "upgrade later" is a rational-feeling choice in
the moment that quietly compounds every time it's made again.

## How to Find It

1. Run software composition analysis (SCA) tooling that inventories every dependency, direct and
   transitive, against known-vulnerability databases, rather than trying to track this manually.
2. Fingerprint exposed version information directly during testing: response headers, error messages,
   and client-side bundle metadata frequently reveal exact framework or library versions.
3. Cross-reference any identified version against public vulnerability disclosures for that specific
   component and version, not just its general reputation.
4. Confirm exploitability rather than assuming it from the version number alone: a vulnerable
   component that's never actually reachable in a way that triggers the flaw is a lower-priority
   finding than one that clearly is.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Outdated component identified, but the specific vulnerable code path is never actually reachable | Low practical risk despite the outdated version, though still worth fixing before that changes |
| Outdated component with a publicly disclosed, reachable remote code execution vulnerability | Full compromise achievable using only public information, no custom exploit required |
| Vulnerable transitive dependency nobody on the team knew existed | Same technical risk as a direct dependency, but slower to discover and fix since ownership is unclear |
| Version fingerprinting possible from outside, narrowing exactly what an attacker needs to check | Meaningfully lowers the effort required for an attacker to find and use a matching public exploit |

## Why a Business Should Care

The uncomfortable but necessary point to make with a client: using open-source and third-party
components isn't optional in modern software, and neither is the ongoing responsibility that comes
with it. A vulnerability disclosed against a widely used library can turn thousands of unrelated
applications into targets within days of public disclosure, and the businesses that get hit hardest
are the ones with no process for finding out they're affected until it's already being exploited
elsewhere. Patching cadence for dependencies deserves the same seriousness as patching cadence for
operating systems.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

Alderveil Insurance runs a customer portal built on a widely used web framework. During testing, an
HTTP response header discloses the exact framework version in use. Cross-referencing that version
against public vulnerability disclosures identifies a previously published, patched remote code
execution vulnerability affecting exactly that version, with technical details already documented
publicly by the framework's own security advisories.

Confirming reachability, without executing the actual exploit, involves verifying that the specific
vulnerable code path the disclosure describes is present and reachable in this deployment, not just
assuming it applies because the version number matches. That confirmation is sufficient to prove
the finding is real and current, not theoretical.

Testing stops at confirmed reachability. No attempt is made to actually achieve code execution
against the live system, since the public advisory already establishes what would be possible; the
goal here is proving the organization is actually exposed to it, not reproducing a known result.

## Severity Calibration

This instance rates **Critical**: a publicly documented remote code execution vulnerability,
confirmed reachable, requiring no custom exploit development at all. That combination, a known,
severe impact plus confirmed reachability plus a public, ready-made technique, is what earns
Critical here. The same outdated version, found on a system where the vulnerable code path was
confirmed unreachable, would rate meaningfully lower.

## Remediation

The real fix is a routine, largely automated dependency-update process, gated by SCA tooling in the
build pipeline, so a newly disclosed vulnerability against something already in production is caught
within days, not discovered by accident months later. Patching dependencies needs to be a scheduled,
recurring practice, not a project.

The common bad fix is deferring upgrades indefinitely with the intention of "getting to it later,"
which in practice usually means never, since dependency maintenance keeps losing out to feature
deadlines when it isn't formally scheduled and tracked like any other required work.

## Related Classes

- **Security Misconfiguration**, a related but distinct failure mode: this class is about what's
  installed being outdated, while misconfiguration is about how something, current or not, was set
  up. See [Security Misconfiguration](../security-misconfiguration/).
- **Supply Chain Attack**, the more deliberate, adversarial version of this same trust relationship,
  where a component is compromised on purpose rather than simply left unpatched. See
  [Supply Chain Attack](../../attacks/supply-chain-attack/).
