---
title: Training Data Poisoning
surface: "AI Security"
owasp: "LLM04:2025 – Data and Model Poisoning"
summary: An attacker deliberately corrupts the data used to train or fine-tune a model, so the model learns a behavior that benefits the attacker later, without anyone reviewing the training data noticing.
cwe: []
typicalSeverityCeiling: Critical
related: ["ai-supply-chain-risks"]
status: published
datePublished: 2026-09-18
---

## Definition

Training data poisoning happens when an attacker deliberately introduces manipulated or mislabeled
examples into the data used to train or fine-tune a model, aiming to make the model learn a specific
behavior that benefits the attacker once it's deployed. Unlike a bug in code, the manipulation isn't
sitting in a file that can be read and understood directly; it's encoded into the model's learned
weights through the training process itself, which is exactly what makes it hard to detect after the
fact.

## The Trust Boundary That Breaks

A team training or fine-tuning a model trusts that its training data reflects a fair, representative
sample of the behavior it's trying to teach the model, without any of it being deliberately engineered
to produce a specific, hidden effect. That assumption is reasonable for data an organization fully
controls and reviews, but training sets are frequently supplemented with external, crowdsourced, user-
submitted, or scraped data, and any point where an attacker can influence what makes it into that
dataset is a point where the "representative and honest" assumption can be quietly broken.

The trust boundary that fails is between "this data reflects genuine examples of the behavior we want"
and "this data can be shaped by anyone who can get content into the pipeline." A single well-crafted
poisoned example, or a small number of them, is often enough to introduce a targeted behavior without
measurably affecting the model's overall performance on standard evaluation metrics, which is exactly
why the manipulation can go unnoticed through normal quality checks.

## Where It Actually Shows Up

- Fine-tuning datasets that incorporate user-submitted content (reviews, support tickets, forum posts,
  feedback) without filtering for deliberately manipulated or coordinated submissions designed to
  shape future model behavior.
- Crowdsourced or scraped datasets sourced from the open web, where an attacker who understands a
  dataset is being collected from a particular source can seed that source with content intended to
  be picked up and included later.
- A "backdoor" style poisoning attack, where the model is trained to behave normally on almost all
  inputs, but produces a specific, attacker-chosen output whenever it encounters a particular trigger
  phrase or pattern the attacker controls.
- Continuous or online fine-tuning pipelines that incorporate live user interactions into future
  training rounds, letting an attacker's interactions with the live system directly influence what the
  next version of the model learns.
- Label manipulation in a supervised dataset, where a small number of examples are deliberately
  mislabeled to skew the model's learned association between an input and the correct output for a
  specific, narrow category.

## Why It Keeps Happening

Reviewing every individual example in a training dataset at the scale modern fine-tuning typically
operates at is rarely practical, and poisoning specifically exploits that: a small number of malicious
examples, well-disguised among a much larger legitimate dataset, can shift the model's behavior on a
narrow, targeted case without showing up as a measurable regression on standard evaluation metrics
that only assess average performance. Detecting a small number of adversarially-crafted examples
requires deliberately looking for exactly this pattern, not the kind of quality review that catches
generally low-quality or mislabeled data.

## How to Find It

1. Review the provenance of every data source feeding a training or fine-tuning pipeline, with
   particular attention to any source an external party (a user, a public dataset, a scraped source)
   can influence, directly or indirectly.
2. Test the deployed model specifically for backdoor-style triggers: systematically probing for
   inputs that produce a suspiciously specific or inconsistent output relative to how the model
   behaves on closely related inputs, using test inputs crafted for the assessment rather than
   guessing blindly across the model's entire input space.
3. Where feasible, compare model behavior across versions trained on different snapshots of a
   continuously updated dataset, since an anomaly that appears only after a specific data update is a
   strong signal worth investigating further.
4. Review whether any statistical data-sanitization or outlier-detection step is applied to a training
   set before it's used, since the absence of any such step is itself a meaningful finding, separate
   from whether poisoning can be actively demonstrated.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Training pipeline uses only fully internal, reviewed data with no external contribution path | Low; limited realistic attack surface for this class specifically |
| Training set incorporates external data with no sanitization or provenance review | Medium to High; a real, unaddressed exposure even without confirmed exploitation |
| Confirmed targeted misclassification on a specific, narrow input pattern | High; a demonstrated, if narrow, manipulation of model behavior |
| Confirmed backdoor causing a significant behavioral change on an attacker-chosen trigger | Critical; a hidden, reliably reproducible manipulation of a production model's behavior |

## Why a Business Should Care

Training data poisoning is a genuinely hard risk to communicate to a non-technical stakeholder,
because there's no obvious moment of compromise to point to: the model was simply trained on data
that included a small number of malicious examples, and it now behaves exactly as it was quietly
taught to. For a business fine-tuning a model on data with any external or crowdsourced contribution
path, the honest framing is that data provenance and review deserve the same rigor as code review, and
that a model's behavior is only as trustworthy as the data it learned from, something that's easy to
overlook specifically because that data doesn't look like "code" in the way developers are used to
scrutinizing.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

Halvestrom Logistics fine-tunes an internal support-ticket classification model on a dataset that
includes ticket content submitted through its public-facing contact form, incorporated into future
training rounds with no filtering for manipulated content. As part of an authorized assessment, a
small number of test tickets are submitted through that form, each containing a consistent, unusual
phrase paired with a deliberately incorrect category label, simulating what a real poisoning attempt
might look like. After a subsequent fine-tuning round incorporates this test data, the retrained model
is found to misclassify new test tickets containing that same phrase into the same incorrect category
used in the planted examples, while classification accuracy on unrelated tickets remains unaffected.

Testing uses only test tickets submitted for this purpose and evaluates the resulting model only on
further test inputs. No real customer ticket or production classification decision is affected.

## Severity Calibration

This rates **Critical** because a small, deliberately crafted set of inputs reliably and
predictably altered the model's behavior on a specific trigger pattern, without measurably affecting
its overall accuracy, meaning the manipulation would very plausibly have gone undetected through
normal quality monitoring alone. A pipeline where the same lack of data review exists, but no targeted
misclassification could actually be demonstrated within the scope of testing, would rate lower,
reflecting an unaddressed exposure rather than a confirmed, working manipulation.

## Remediation

The real fix is data provenance and review discipline proportional to how much external influence a
training pipeline actually allows: filtering and reviewing externally-contributed data before it
enters a training set, applying statistical outlier and anomaly detection to flag data that looks
unusually influential relative to the rest of the set, and testing retrained models specifically for
unexpected behavioral shifts before deploying a new version, not just for overall accuracy regression.

The common bad fix is relying entirely on aggregate accuracy metrics to judge whether a retrained
model is safe to deploy. A successful poisoning attack is specifically designed to leave aggregate
accuracy unaffected, so a clean accuracy report provides close to no assurance against this particular
class of manipulation.

## Related Classes

- **AI Model & Training Data Supply Chain Risks** ([../ai-supply-chain-risks/](../ai-supply-chain-risks/)):
  the broader category this falls under, an externally-influenced input to the training pipeline
  compromised before or during use, with poisoning as one specific mechanism among several.
