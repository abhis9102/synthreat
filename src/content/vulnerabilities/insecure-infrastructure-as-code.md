---
title: Insecure Infrastructure as Code (IaC)
surface: "Cloud Security"
summary: A misconfiguration written into a Terraform or CloudFormation template ships to every environment that template creates, turning one bad line of code into a repeated, automated deployment mistake.
cwe: ["CWE-16"]
typicalSeverityCeiling: High
related: ["cloud-storage-exposure", "security-misconfiguration"]
status: published
datePublished: 2026-09-18
---

## Definition

Infrastructure as code (IaC) is the practice of defining cloud infrastructure, servers, storage,
networking, permissions, in a version-controlled configuration file rather than clicking through a
provider's console by hand. Insecure IaC is what happens when a security-relevant mistake, a
publicly-readable storage setting, an overly broad security group rule, an unencrypted resource, is
written directly into that template. The mistake isn't a one-off click anymore; it's baked into the
definition that gets deployed, and redeployed, every time that template runs.

## The Trust Boundary That Breaks

Teams treat infrastructure-as-code templates the way they treat application source code: reviewed,
version-controlled, and trusted to define the environment correctly once it's merged. That trust
assumes someone actually reviewed the template's security-relevant settings with the same rigor
applied to application logic. In practice, IaC templates are frequently copied from a public example,
a vendor's own quickstart documentation, or an earlier project, specifically because they're meant to
demonstrate a feature working, not to be a hardened, production-ready default.

The boundary that breaks is the assumption that "this template is in version control and got
reviewed" is equivalent to "this template is secure." Those are different claims, and a template can
satisfy the first while failing the second indefinitely, because nothing about the deployment process
itself checks for insecure settings unless a dedicated scanning step is added.

## Where It Actually Shows Up

- A storage resource block that sets a public-read ACL or omits an encryption setting, copied from an
  example template where public access was actually intentional (a demo, a static site).
- A network security group or firewall rule in the template that opens a wide port range, or opens
  administrative access, to any source address (`0.0.0.0/0`) instead of a specific, narrow range.
- Hardcoded credentials or API keys written directly into the template as plain values, rather than
  referenced from a secrets manager at deploy time (see [Exposed Cloud Credentials &
  Secrets Sprawl](../exposed-cloud-credentials/) for the dedicated treatment of this specific pattern).
- A module sourced from a public registry without pinning a specific, reviewed version, so the actual
  configuration that gets deployed can change without the team's own template changing at all.
- Default values left unset for security-relevant options (encryption, logging, versioning) that the
  provider requires an explicit opt-in for, rather than the template author actively deciding on each
  one.

## Why It Keeps Happening

Infrastructure-as-code tooling optimizes for getting a working environment stood up quickly, and the
fastest path to something that works is often a copied example, not a from-scratch, security-reviewed
definition. Unlike application code, where a broken feature usually fails visibly during testing, an
insecure setting in an IaC template (a bucket that's public, a port that's open) deploys successfully
and the environment works exactly as intended from a functionality standpoint. There's no functional
signal that anything is wrong, only a security one, and that signal only appears if someone is
specifically looking for it.

## How to Find It

1. Run the template's own definition through a dedicated IaC scanning tool before it's ever deployed,
   checking specifically for public access settings, overly broad network rules, missing encryption,
   and hardcoded secrets.
2. Treat this scan as a required step in the same pipeline that deploys the template, not an optional,
   manually-run check, so a newly introduced issue is caught before the next deployment rather than
   discovered later in the live environment.
3. Where the live environment is available for testing directly, cross-reference what's actually
   deployed against the template that's supposed to define it: a difference between the two (a manual
   change made directly in the console, outside the template) is its own separate finding, since it
   means the template is no longer an accurate record of what's actually running.
4. Review module sources for version pinning specifically; an unpinned public module is worth flagging
   even before evaluating what it currently does, since what it does can change later without notice.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Template defines a minor, non-sensitive default that differs from best practice | Low; hygiene issue |
| Template opens administrative network access to any source address | High; a direct path to the resource for any attacker who finds it |
| Template creates a publicly-readable storage resource containing real data once deployed | Critical; identical outcome to a manually misconfigured bucket, just automated |
| Template hardcodes a live credential that gets committed to version control | Critical; the credential is exposed to anyone with repository access, indefinitely, until rotated |

## Why a Business Should Care

The business risk of insecure IaC isn't a single bad setting, it's that the setting gets deployed
every time the template runs: to a new environment, a disaster-recovery region, a scaled-up
deployment. A misconfiguration caught and fixed once in a live environment can quietly reappear the
next time infrastructure is provisioned from the same flawed template, unless the template itself is
what gets fixed. This is a strong argument for catching these issues in code review rather than after
deployment: the fix costs the same either way, but fixing the template prevents the same mistake from
shipping again next quarter, next region, or next environment, which fixing a single live resource
does not.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

During a source-code and configuration review for Meridian Health Analytics, the Terraform module
used to provision the company's data-ingestion environment defines a network security group rule
permitting inbound access on the database's administrative port from any source address, rather than
scoping it to the application's own internal network range. The same module also omits an explicit
encryption setting on the storage resource it provisions, relying on whatever the provider's default
happens to be rather than an intentional choice recorded in the template.

Testing confirms both findings by reading the template directly and cross-referencing the actual,
currently-deployed resources against it, which confirms the insecure settings are live, not merely
present in an unused draft of the template. No connection is attempted to the database itself.

## Severity Calibration

This rates **High** rather than Critical specifically because the finding, at the point of discovery,
demonstrates reachability of an administrative interface rather than confirmed data access; had
testing gone further and demonstrated actual unauthorized data access through that open port, the
finding would move to Critical. Severity for this class always depends on what the insecure setting
actually exposes once deployed, not on the mere presence of a template flaw.

## Remediation

The real fix is automated IaC scanning wired directly into the deployment pipeline, so an insecure
setting fails the pipeline the same way a broken test does, before it's ever deployed, combined with
version-pinning every external module and reviewing security-relevant settings explicitly rather than
accepting provider defaults silently.

The common bad fix is finding and manually correcting the live, deployed resource without touching
the template that created it. The fix doesn't survive the next deployment: the same insecure setting
redeploys the next time that template runs, in the same environment or a new one, because the actual
source of the problem was never changed.

## Related Classes

- **Public Cloud Storage Exposure** ([../cloud-storage-exposure/](../cloud-storage-exposure/)): one of
  the most common outcomes when an IaC template defines a storage resource's access setting
  incorrectly.
- **Security Misconfiguration** ([../security-misconfiguration/](../security-misconfiguration/)): the
  broader class this falls under, an insecure setting left in place, here specifically because it was
  written into the automated definition rather than set by hand.
