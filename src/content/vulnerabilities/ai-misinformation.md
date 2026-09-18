---
title: Misinformation
surface: "AI Security"
owasp: "LLM09:2025 – Misinformation"
summary: A model states false or unsupported information with the same fluent confidence as a correct answer, and a user or downstream system relies on it as fact.
cwe: []
typicalSeverityCeiling: High
related: ["excessive-agency", "ai-supply-chain-risks"]
status: published
datePublished: 2026-09-18
---

## Definition

Misinformation, in an AI system, is a model generating false, fabricated, or unsupported content and
presenting it with the same fluent confidence it uses for accurate content, so a user or a downstream
automated process has no built-in signal to distinguish the two. No attacker is required for this
class to cause real harm: it happens through the model's own ordinary generation behavior, commonly
called hallucination, and the risk comes entirely from how much a person or a system ends up relying
on the output without independently verifying it.

## The Trust Boundary That Breaks

A user interacting with a fluent, well-formatted, confident-sounding response naturally extends the
same trust they'd give a competent human expert answering the same question. That trust assumes the
system has some internal mechanism for knowing what it doesn't know, and signaling that uncertainty
when it applies. A language model, as commonly deployed, has no reliable, built-in equivalent of that
signal: it's trained to produce plausible, fluent continuations, and a fabricated fact can come out
looking exactly as confident and well-formed as a verified one. The boundary that fails is the
assumption that confidence in tone reflects confidence in accuracy.

## Where It Actually Shows Up

- A customer support assistant stating a company policy, return window, or eligibility rule that
  doesn't actually exist, delivered with the same tone as a correct policy statement.
- A coding assistant confidently recommending a library, package, or API function that doesn't
  actually exist, an issue with a real secondary consequence: attackers have registered real packages
  matching commonly hallucinated names, so a developer who installs what the assistant suggested
  without checking can pull in a genuinely malicious dependency (see [AI Model & Training Data Supply
  Chain Risks](../ai-supply-chain-risks/) for that mechanism generally).
- AI-generated summaries of legal, medical, or financial material presented without caveats,
  where a fabricated or subtly wrong detail carries outsized real-world consequence if acted on
  directly.
- An autonomous agent taking a subsequent action based on a hallucinated intermediate fact it
  generated for itself earlier in a multi-step task, compounding a single fabrication into a real,
  executed action (see [Excessive Agency](../excessive-agency/)).

## Why It Keeps Happening

Models are trained and evaluated in large part on producing fluent, helpful-sounding answers, and
abstaining ("I don't actually know this") is often underrepresented in training relative to always
attempting a confident answer. Product interfaces built on top of these models rarely surface any
uncertainty signal to the end user even when the underlying system has one available, because a
hedge-filled answer reads as less useful and less polished than a confident one, creating a real
incentive, at the product design level, to present output as more certain than it actually is.

## How to Find It

1. Test the system against a set of questions in its actual domain where the correct answer is known
   in advance, checking specifically for confident, well-formed answers that are factually wrong
   rather than only checking for obvious refusals or errors.
2. For a coding assistant, verify that any library, package, or API reference it recommends actually
   exists and behaves as described, rather than assuming a plausible-looking suggestion is accurate.
3. Test edge cases where the honest answer is "I don't know" or "this isn't covered," checking whether
   the system fabricates a specific-sounding answer instead of acknowledging the gap.
4. Review whether the product surfaces any citation, source, or confidence indicator a user could use
   to verify a claim, or whether output is presented as flatly authoritative with no way to check it.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Incorrect answer to a low-stakes, easily-verified casual query | Low; a quality issue, unlikely to cause real harm |
| Incorrect stated policy or business rule that a customer relies on | Medium to High; operational and reputational cost when the discrepancy surfaces |
| Hallucinated software dependency name later registered and installed by a developer | Critical; a direct supply-chain compromise triggered by fabricated output |
| An autonomous agent takes a real action based on a hallucinated fact with no human review | High to Critical, depending on what that action actually does |

## Why a Business Should Care

The business risk here is specifically about reliance, not about the model being imperfect in the
abstract; every AI system will occasionally be wrong, and that alone isn't a finding. The real question
worth raising with a client is what happens downstream when it's wrong: is there a human reviewing the
output before it reaches a customer or triggers an action, and does the product interface make the
system's actual confidence level visible, or does it present every answer with the same flat
authority regardless of how well-supported it actually is. A support bot that occasionally hedges
honestly is a better business outcome than one that never hedges and is occasionally confidently
wrong.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

Northfell Systems' customer support assistant is tested against a set of policy questions with known,
documented answers. Asked about a return-window edge case not explicitly covered in the company's
public policy documentation, the assistant states a specific number of days with the same confident
phrasing used for clearly-documented policies. Cross-referencing the actual policy documentation
confirms no such rule exists; the assistant fabricated a specific, plausible-sounding answer rather
than indicating the case wasn't covered.

Testing is limited to comparing the assistant's stated answer against the actual, verified policy
documentation for a small set of edge-case questions prepared for this assessment. No customer
interaction or real support case is involved.

## Severity Calibration

This rates **High** because the fabricated answer concerns a customer-facing policy that, if acted on,
would create a real, binding-looking commitment the company never actually made, with clear
operational and reputational cost once the discrepancy surfaces. The identical underlying tendency to
fabricate, demonstrated only on a low-stakes trivia-style query with no real-world reliance, would rate
substantially lower: severity tracks what a user or system would actually do in reliance on the wrong
answer, not the mere fact that a hallucination occurred.

## Remediation

The real fix is grounding responses in a verified source wherever accuracy matters (retrieval against
an actual, current policy or knowledge base rather than free generation from the model's own training
data), building in and surfacing genuine uncertainty signals in the product interface, and requiring
human review before AI-generated output reaches a high-stakes decision or customer-facing commitment
directly.

The common bad fix is a generic, one-time disclaimer ("this assistant may make mistakes") that doesn't
change how confidently individual answers are actually presented or how they're used downstream. A
disclaimer in the footer does nothing to help a user recognize which specific answer, among many
confident-sounding ones, happens to be wrong.

## Related Classes

- **Excessive Agency** ([../excessive-agency/](../excessive-agency/)): what turns a single
  hallucinated fact into a real, executed action, when an agent acts on its own generated output with
  no human checkpoint.
- **AI Model & Training Data Supply Chain Risks** ([../ai-supply-chain-risks/](../ai-supply-chain-risks/)):
  the concrete path by which a hallucinated software dependency name becomes an actual, exploitable
  supply-chain compromise.
