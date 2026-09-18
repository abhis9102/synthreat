---
title: Overly Permissive Cloud IAM
category: "Cloud Security"
summary: A cloud identity granted broader permissions than it actually needs turns any compromise of that identity into a much larger breach than the original access should have allowed.
cwe: ["CWE-269"]
typicalSeverityCeiling: Critical
related: ["cloud-storage-exposure", "broken-access-control"]
status: published
datePublished: 2026-09-18
---

## Definition

Overly permissive cloud IAM (Identity and Access Management) is what happens when a human user, an
application, or a service is granted more permissions in a cloud environment than the task it
actually performs requires. The identity itself might never be misused directly. The problem surfaces
the moment that identity, or its credentials, is compromised through any other means: the attacker
inherits every permission it held, not just the ones it was actually using.

## The Trust Boundary That Breaks

The intended boundary is least privilege: an identity should be able to do exactly what its role
requires, and nothing else, so that the compromise of any single identity has a bounded, predictable
blast radius. In practice, IAM policies are frequently written broader than necessary, using wildcard
actions or wildcard resource scopes, because it's faster to grant broad access once than to work out
and maintain the exact minimum set of permissions a role needs over time as that role's requirements
change.

That convenience inverts the trust relationship. Instead of "this identity can only do what it needs
to do," the real posture becomes "this identity can do almost anything, and we're trusting that it
never will," which is not an access control at all, it's an assumption about behavior that a
compromised credential does not honor.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-cloud-iam-misconfiguration" style="width:100%;height:auto;">
<title id="diagram-title-cloud-iam-misconfiguration">A role granted wildcard permissions turns the compromise of one narrow credential into full account-wide access.</title>
<defs>
<marker id="arrow-cloud-iam-misconfiguration" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Role granted</text>
<text x="85" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">wildcard access</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cloud-iam-misconfiguration)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">One narrow</text>
<text x="275" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">credential leaks</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cloud-iam-misconfiguration)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker assumes</text>
<text x="465" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">the role's full scope</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-cloud-iam-misconfiguration)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="66" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Blast radius:</text>
<text x="655" y="84" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">entire account</text>
</svg>
<figcaption>The credential that leaked was narrow. The permissions attached to it were not.</figcaption>
</figure>

## Where It Actually Shows Up

- Wildcard permission grants (all actions, all resources) attached to a role "to save time" during
  initial setup, with a plan to narrow it later that never happens.
- Service and application identities (the credential a running workload uses to call other cloud
  services) granted account-administrator-level access when the workload only ever needs to read from
  one specific storage location or write to one specific queue.
- IAM privilege-escalation chains: a role that cannot directly perform a sensitive action, but can
  modify its own permissions, or create and assume a different role that can, a path that's easy to
  miss because no single permission in the chain looks dangerous on its own.
- Long-lived, static access keys issued to a broad role, left unrotated for months or years, instead
  of short-lived, automatically expiring credentials scoped narrowly to the task at hand.
- Cross-account trust relationships that grant a partner or vendor account far more access than the
  specific integration actually requires, because the trust policy was copied from documentation
  rather than scoped to the real use case.

## Why It Keeps Happening

Working out the exact minimum set of permissions a role needs, and keeping that scope accurate as the
role's responsibilities change over time, is genuinely more work than granting broad access once.
Cloud IAM policy languages are also expressive enough that a wildcard is often the first thing that
works during development, and there's rarely a forcing function, an error, a failed deployment, that
makes an engineer come back and tighten it afterward. The cost of over-permissioning is invisible
until the identity is actually compromised, by which point the decision was made long ago by someone
who has likely moved on to other work.

## How to Find It

1. From the identity's own perspective (white-box, with read access to the account), enumerate every
   permission actually attached to a role, directly and through any group or policy it inherits from,
   and compare that list against what the role's actual function requires.
2. Specifically test for privilege-escalation chains: permissions that let a role modify its own
   policy, create a new role, or assume a different one, since these are the paths that turn a
   narrowly-compromised identity into a fully-compromised account.
3. From outside the account (black-box, holding one compromised or intentionally-scoped-down
   credential during an assessment), attempt actions well outside that credential's expected purpose,
   to establish just how far a single leaked credential would actually reach in practice.
4. Review credential age and rotation history for any long-lived static keys attached to broad roles;
   an old, unrotated key attached to a powerful role is a standing risk even before any misuse is
   demonstrated.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Role has slightly broader read access than strictly needed, no write or admin permissions | Low; hygiene issue, limited real exposure |
| Application identity holds admin-level access it never actually uses | High; any compromise of that application becomes an account-wide incident |
| Identified privilege-escalation chain from a low-privilege role to full account control | Critical; a low-value credential compromise becomes a total breach |
| Cross-account trust grants a third party broader access than the integration requires | High to Critical, depending on what the trusted account can then reach |

## Why a Business Should Care

The direct cost of over-permissioned IAM is that it multiplies the impact of every other incident in
the environment. A phished employee credential, a leaked application secret, a single vulnerable
server, any of these becomes an account-wide breach instead of a contained one, purely because of how
broadly that one identity's permissions were scoped. This is a genuinely useful framing for a client:
least-privilege IAM doesn't prevent the initial compromise, nothing does that perfectly, but it caps
how bad any single compromise can get, which is exactly the kind of risk-reduction argument that holds
up in a board-level conversation about cloud risk, separate from whatever specific vulnerability
caused the initial access.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

During a cloud IAM review for Corvane Analytics, a service role attached to a data-processing
application is found to hold a wildcard permission across the account's entire storage service,
rather than access scoped to the single bucket the application actually reads from and writes to.
Reviewing the role's policy further reveals it also has permission to modify its own attached policy,
a combination that would let anything running as that role grant itself any additional permission in
the account.

Testing confirms the two findings, the overly broad storage access and the self-modifying policy
permission, by reviewing the role's actual attached policy documents. No permission is actually
exercised beyond what the application's own normal operation already uses; the assessment establishes
what the role *could* do, not what it does.

## Severity Calibration

This rates **Critical** because the self-modifying policy permission means any compromise of this one
application identity, however it happens, converts directly into full account control, with no
further exploitation required beyond using permissions the role was already granted. A role with
mildly excess read-only access and no escalation path would rate substantially lower: severity here
tracks the reachable ceiling of what a compromised identity could do, not the mere presence of
broader-than-ideal access.

## Remediation

The real fix is least-privilege policy design: granting each identity only the specific actions on
the specific resources it needs, reviewed against actual usage (most cloud providers offer access-
history data that shows which permissions a role has actually used, which is the most reliable signal
for trimming a policy down). Self-modifying and role-escalation permissions should be treated as a
distinct, high-priority category to eliminate specifically, separate from general permission
trimming.

The common bad fix is granting broad access temporarily "to unblock a deadline" with an intention to
scope it down afterward. In practice that follow-up rarely happens, and the broad grant becomes the
permanent state, discovered only in a later audit or, worse, only after it's already been used in an
incident.

## Related Classes

- **Public Cloud Storage Exposure** ([../cloud-storage-exposure/](../cloud-storage-exposure/)):
  a resource-level version of the same underlying problem, an access boundary set too broad, this time
  on the resource itself rather than the identity reaching it.
- **Broken Access Control** ([../broken-access-control/](../broken-access-control/)): the same
  principle, an authorization check that should have limited what a given actor can do but didn't,
  applied here to cloud identity rather than an application's own access-control logic.
