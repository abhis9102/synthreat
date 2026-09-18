---
title: AI Model & Training Data Supply Chain Risks
surface: "AI Security"
owasp: "LLM03:2025 – Supply Chain"
summary: A third-party model, dataset, or hosting component compromised before it reaches an application, the same supply-chain pattern as any other dependency, applied to the AI pipeline.
cwe: []
typicalSeverityCeiling: Critical
related: ["training-data-poisoning", "vulnerable-outdated-components"]
status: published
datePublished: 2026-09-18
---

## Definition

AI supply chain risk covers everything an AI system depends on that the organization deploying it did
not build or fully vet itself: a pre-trained base model downloaded from a public repository, a
fine-tuning dataset sourced from a third party, a model-serving library, or a plugin or extension that
adds capability to an existing model. Any of these can be compromised, tampered with, or simply
low-quality before they ever reach the organization's own pipeline, the exact same underlying pattern
covered generally on [Supply Chain Attack](../../attacks/supply-chain-attack/), applied specifically to
the components an AI system is built from.

## The Trust Boundary That Breaks

Teams building AI features frequently start from a pre-trained model or dataset built by someone
else, because training a capable model from scratch is far more expensive than almost any
organization can justify for a single application. That's a reasonable engineering decision, but it
means the organization is trusting the integrity of an artifact (model weights, a dataset, a
serving library) it did not create and often cannot fully inspect, the same way any dependency in a
traditional software supply chain is trusted without being independently re-verified line by line.

Model weights and datasets are also harder to inspect for tampering than source code: there's no
equivalent of reading through a dependency's code to understand what it does, since a model's behavior
emerges from its weights and training process rather than from human-readable logic. That opacity
means a maliciously altered or poisoned model or dataset can be substantially harder to detect through
review alone than an equivalent compromise in traditional application source code.

## Where It Actually Shows Up

- A pre-trained model downloaded from a public model repository without verifying its source,
  checksum, or the reputation of who published it, then fine-tuned and deployed directly into
  production.
- A third-party fine-tuning dataset incorporated without review for whether it was tampered with or
  contains hidden, deliberately mislabeled examples (see [Training Data
  Poisoning](../training-data-poisoning/) for the dedicated treatment of that specific mechanism).
- Plugins or extensions that add tool access or capability to an existing model, sourced from a
  third-party developer and granted the same level of trust as the core model itself, without
  independent review of what that plugin actually does.
- Model-serving and inference libraries with the same kind of exploitable vulnerabilities any other
  software dependency can have, sitting directly in the path of every request the AI system serves.
- An organization's own fine-tuned model artifacts stored without integrity verification, so a
  compromise of internal storage or the deployment pipeline could substitute a tampered model without
  immediate detection.

## Why It Keeps Happening

The AI ecosystem's culture of openly sharing pre-trained models and datasets is exactly what makes
building AI features broadly accessible, and that same openness means provenance and integrity
verification are often genuinely optional steps that a fast-moving team skips under the same pressure
that causes traditional dependency risks to go unmanaged. The relative newness of AI-specific
supply-chain tooling (compared to the decades of mature dependency-scanning practice in traditional
software) also means fewer teams currently have an established, routine process for it, the same gap
this domain's own overview page names directly.

## How to Find It

1. Inventory every externally-sourced model, dataset, plugin, and serving library an AI system
   actually depends on, the same way a software bill of materials would for traditional application
   dependencies.
2. Verify the source and integrity of each pre-trained model and dataset used: where it came from, who
   published it, and whether a checksum or signature can be verified against a trusted source.
3. Review any third-party plugin or tool-calling extension for what capability and access it actually
   requests, applying the same scrutiny as [Excessive Agency](../excessive-agency/) to any
   permission it's granted.
4. Check whether model-serving and inference libraries are kept current and scanned for known
   vulnerabilities, the same way [Vulnerable and Outdated
   Components](../vulnerable-outdated-components/) is checked for any other dependency.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Externally-sourced model or dataset used only in a low-stakes, non-production experiment | Low; limited real exposure |
| Unverified pre-trained model deployed to production with no integrity check performed | Medium to High; unquantified risk that the model behaves other than expected |
| Compromised fine-tuning dataset introduces a deliberate backdoor into a production model | Critical; a hidden, hard-to-detect manipulation of the model's actual behavior |
| Vulnerable model-serving library exploited directly for remote code execution | Critical; identical severity to any other critical dependency vulnerability, reached through the AI serving stack |

## Why a Business Should Care

AI supply chain risk deserves the same seriousness as traditional software supply chain risk, and for
the same underlying reason: a business rarely builds every component of a modern system itself, and
every externally-sourced component it does rely on is a point where trust has to be placed
deliberately rather than assumed. The AI-specific complication worth naming plainly to a client is that
this space has far less mature tooling than traditional dependency management does today; being honest
about that immaturity, while still applying the same basic supply-chain discipline (provenance
verification, inventory, patching) that already exists for traditional software, is a more credible
position than claiming this risk is already fully solved.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

During a review of Vantara Systems' AI-powered document classification pipeline, the base model in
production is found to have been downloaded from a public model repository directly into the
deployment pipeline, with no record of verifying its publisher's identity or a checksum against a
known-good source at the time it was incorporated. Reviewing the deployment pipeline's own logs
confirms no integrity or provenance check exists at any stage between download and production
deployment.

Testing is limited to confirming the absence of a verification step in the pipeline itself. No attempt
is made to determine whether the specific model artifact currently in use has actually been tampered
with, since that would require capabilities well beyond a configuration and pipeline review.

## Severity Calibration

This rates **High** at the point of discovery, since the finding demonstrates a missing control (no
provenance verification) rather than confirmed tampering of the specific model in production; had
testing gone further and identified an actual backdoor or manipulated behavior in the deployed model,
the finding would move to Critical. Severity for this class tracks whether tampering is demonstrated
or merely possible given the missing control, the same distinction that applies to any other
supply-chain finding.

## Remediation

The real fix is treating AI models, datasets, and plugins as first-class dependencies subject to the
same supply-chain discipline as any other software component: maintaining an inventory of what's
used and where it came from, verifying provenance and integrity before incorporating an external
model or dataset, scoping any third-party plugin's granted capability tightly, and keeping
model-serving infrastructure patched against known vulnerabilities the same as any other production
service.

The common bad fix is vetting a model or dataset once, at the point it's first incorporated, and never
re-verifying it again as the pipeline evolves or as the artifact itself is updated upstream. Supply
chain risk is ongoing, not a one-time gate, and a component that was legitimate when first adopted can
still be compromised or replaced later in its own upstream lifecycle.

## Related Classes

- **Training Data Poisoning** ([../training-data-poisoning/](../training-data-poisoning/)): the
  specific mechanism by which a compromised dataset actually alters a model's behavior, one of several
  ways supply-chain compromise can manifest.
- **Vulnerable and Outdated Components** ([../vulnerable-outdated-components/](../vulnerable-outdated-components/)):
  the same underlying pattern, an unmaintained or unverified external dependency, applied generally
  across any kind of software rather than AI components specifically.
