---
title: Cloud Security
summary: What changes about security when infrastructure moves to the cloud, the shared responsibility model, and the misconfigurations that cause most real cloud incidents.
category: Domain Overview
related: ["application-security", "continuous-threat-exposure-management", "types-of-penetration-testing"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

Cloud security is the practice of securing systems, data, and identity in an environment where the
underlying physical infrastructure (the data centers, the servers, the network hardware) is owned and
operated by a third party, typically a large provider like AWS, Azure, or Google Cloud, rather than by
the organization using it. Renting infrastructure instead of owning it doesn't remove the need for
security. It changes *which* parts of security are the customer's job and which parts belong to the
provider, and getting that division wrong is where most real cloud incidents come from.

## Why It Exists

In a data center an organization fully owns, the attack surface and the failure modes are largely
within that organization's own control: it patches its own hypervisors, physically secures its own
racks, and configures its own network from the ground up. Move the same workload to a cloud provider
and that entire category of responsibility disappears: you cannot patch a hypervisor you don't own,
and you generally don't need to worry about someone walking into the provider's data center. But a new
category of risk appears in its place: the settings *you* control on top of that infrastructure (who
can access a storage bucket, which permissions an application's identity has, whether traffic between
services is encrypted) are now the entire security boundary, and they're controlled through
configuration, not physical presence. Cloud security exists because that boundary is easy to get wrong,
and a single misconfigured setting can expose data to the entire internet in a way that has no real
equivalent in a traditional data center.

## How It Works

The foundational concept in cloud security is the **Shared Responsibility Model**, a framework
formalized and widely referenced by the Cloud Security Alliance (cloudsecurityalliance.org). In plain
terms: the cloud provider is responsible for the security *of* the cloud: the physical data centers,
the hardware, the core virtualization layer, the global network backbone. The customer is responsible
for security *in* the cloud: how they configure everything they build on top of that foundation. Where
exactly that line falls shifts depending on the service model (a fully managed platform service hands
the provider more responsibility than a raw virtual machine the customer administers directly), but the
core split (provider secures the foundation, customer secures their own configuration) holds across
all of them.

In practice, the failure modes that repeatedly cause real cloud incidents fall into a short, well-known
list:

- **Publicly exposed storage.** A storage bucket or blob container created with default or overly
  permissive access settings, reachable directly from the internet with no authentication at all. This
  is one of the single most common root causes of large-scale cloud data exposure, precisely because
  the mistake is a checkbox, not a coding error.
- **Overly permissive identity and access management (IAM).** Cloud identities (for a human user or
  for an application itself) are granted broad, "just in case" permissions instead of only what they
  need. If that identity is ever compromised, the blast radius is defined by everything it was allowed
  to touch, which is often far more than the task it was actually created for required.
- **Exposed management interfaces or metadata endpoints.** Cloud environments expose internal
  administrative surfaces (console access, instance metadata services) that are meant to be reachable
  only from inside the environment. Misconfiguration can leave these reachable from outside it,
  sometimes exposing credentials directly.
- **Unencrypted data**, at rest or in transit, where encryption was available and simply never turned
  on or enforced.
- **Missing or unreviewed logging.** Most cloud providers offer detailed audit logging of every action
  taken in an environment. When it isn't enabled, or is enabled but nobody is actually reviewing it, an
  incident can run for a long time before anyone notices, not because the attacker was especially
  sophisticated, but because there was no visibility to catch an unsophisticated one either.

## Where This Shows Up in Practice

Cloud environments get evaluated through dedicated cloud-focused penetration testing and cloud
configuration review engagements: testing that specifically targets IAM policy structure, storage
permissions, network segmentation between cloud resources, and the presence of the failure patterns
listed above, distinct from a traditional network penetration test aimed at on-premises infrastructure
(see [Types of Penetration Testing](../../methodology/types-of-penetration-testing/)). Increasingly, cloud
infrastructure is also defined as code (configuration files that get reviewed and version-controlled
like application source code), which means cloud misconfigurations can now be caught the same way an
application vulnerability is: in review, before it's ever deployed, rather than after.

## Why a Business Should Care

Cloud misconfiguration incidents are common, and they're expensive, for a structural reason worth
saying plainly to a client: the provider secures the infrastructure underneath the environment, but the
customer is essentially 100% responsible for how they configure everything they build on top of it. The
Shared Responsibility Model isn't a marketing framing: it's a real division of accountability, and the
majority of publicly reported cloud incidents trace back to the customer's own configuration, not a
failure by the provider. That's an uncomfortable thing to tell a client who has assumed "we moved to the
cloud, so we're covered," but it's the accurate framing, and it's also the more useful one, because it
points at something the client can actually control: their own IAM policies, their own storage settings,
their own logging configuration. "The cloud provider will keep us secure" is not a security strategy;
"we know exactly what we're responsible for configuring, and we test it" is.

## Common Misconceptions

**"The cloud provider secures everything."** This is the single most consequential misconception in
this domain, and it's the direct inverse of the Shared Responsibility Model. The provider secures the
platform; the customer secures their use of it. A perfectly secure cloud platform does nothing to
protect data sitting in a bucket the customer configured as publicly readable.

**"Cloud is inherently less secure than on-premises infrastructure."** The evidence doesn't support
this either, and it's worth pushing back on directly with a client who raises it. Major cloud providers
generally invest more in physical security, hardware-level protections, and platform patching than most
individual organizations realistically can or will on their own. The cloud isn't *less* secure; it's
*differently* secured, with the customer's own configuration doing far more of the work than it did in
a traditional data center. Most real cloud incidents are customer-side misconfiguration, not provider-
side platform failure.

## Related Topics

- [Application Security](../application-security/): securing the software layer, as distinct from the
  infrastructure it runs on.
- [Continuous Threat Exposure Management](../../methodology/continuous-threat-exposure-management/): an ongoing
  process for tracking exposure across an environment, cloud included, rather than relying on a single
  point-in-time check.
- [Types of Penetration Testing](../../methodology/types-of-penetration-testing/): where cloud-specific testing fits
  among the different engagement types.
