---
title: AI Sensitive Information Disclosure
surface: "AI Security"
owasp: "LLM02:2025 – Sensitive Information Disclosure"
summary: A model reveals fragments of its training data, another user's conversation context, or internal instructions it was never meant to disclose, through nothing more than an ordinary-looking query.
cwe: []
typicalSeverityCeiling: Critical
related: ["prompt-injection", "cryptographic-failures", "system-prompt-leakage", "vector-embedding-weaknesses"]
status: published
datePublished: 2026-09-18
---

## Definition

AI sensitive information disclosure happens when a model reveals information it should never expose:
fragments of the data it was trained or fine-tuned on, confidential system instructions it was told to
keep private, or, in a shared or multi-tenant deployment, content belonging to a different user or
session than the one asking the question. Unlike a traditional data breach, no database is directly
queried and no file is directly accessed. The information comes out through the model's own generated
response to what can look like an entirely ordinary question.

## The Trust Boundary That Breaks

A model is trusted to only draw on the specific context it was given for the current request: the
current conversation, the specific documents provided for the current task, and general knowledge from
training that isn't tied to any one individual or organization's private data. That boundary can fail
in several distinct ways. A model can memorize and later reproduce specific fragments of its training
data rather than only generalizing from it. A poorly isolated multi-tenant deployment can let one
user's session or cached context bleed into another's. And a model can be persuaded, through
persistent or creatively phrased questioning, to reveal system-level instructions it was explicitly
told were confidential, because "keep this instruction secret" is itself just another instruction
competing with whatever the user is currently asking.

## Where It Actually Shows Up

- A model fine-tuned on internal or customer data reproducing verbatim or near-verbatim fragments of
  that data in response to a query that resembles something in the training set, rather than a
  generalized answer.
- A shared deployment where session, cache, or context data isn't fully isolated per user, letting one
  user's conversation history or uploaded content surface in a different user's session.
- System-prompt extraction: a user persistently rephrasing their request until the model discloses
  its own confidential instructions, safety guardrails, or the specific business logic it was told to
  follow, none of which were meant to be user-visible.
- A retrieval-augmented assistant that pulls from a document index without per-user access
  restrictions, so a user's query can surface content from documents they were never authorized to
  see, even though the model itself has no intent to leak anything.

## Why It Keeps Happening

Models learn from data at scale, and controlling precisely what a model has memorized versus
generalized from is not yet a fully solved problem; some degree of memorization of training data is
an inherent property of how these models are built, not a bug introduced by any one deployment. On
top of that, session and access isolation for AI deployments is genuinely new engineering territory
for many teams, built under the same time pressure as any other feature, and it's easy to assume a
shared model backend handles per-user isolation correctly by default without verifying it explicitly.

## How to Find It

1. Test whether targeted queries, phrased to resemble likely training or fine-tuning data, cause the
   model to reproduce specific, verifiable fragments rather than a generalized response, using only
   test data the assessment has legitimate knowledge of.
2. In a multi-tenant or multi-session deployment, test session isolation directly: create two
   separate test sessions or accounts and attempt to surface one session's content from within the
   other, using only accounts created for the assessment.
3. Attempt system-prompt extraction through persistent, varied rephrasing of a direct request for the
   model's instructions, since a single blocked attempt does not confirm the instructions are actually
   protected against a more sustained attempt.
4. For retrieval-augmented systems, verify that document-level access control is enforced at
   retrieval time, not assumed from the fact that a user is authenticated to the application overall.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Model discloses only non-sensitive, already-public system-prompt framing | Low; not a meaningful disclosure |
| Model reproduces verbatim fragments of non-sensitive training data | Medium; a real disclosure, bounded impact |
| Model discloses another user's conversation content or private context in a shared deployment | Critical; a direct cross-user confidentiality breach |
| Model reproduces sensitive customer or proprietary data memorized from fine-tuning data | Critical; a direct data breach through the model itself as the disclosure vector |

## Why a Business Should Care

This risk category is genuinely counterintuitive to explain, because there's no database that was
breached and no file that was downloaded, only a model that answered a question it shouldn't have been
able to answer accurately. That's exactly why it deserves deliberate attention rather than being
assumed away: a client fine-tuning a model on their own customer or business data needs to understand
that the model itself becomes a new potential disclosure surface for that data, separate from and in
addition to the database the data originally lived in, and that testing for this needs to be
explicitly scoped rather than assumed to be covered by traditional data-security controls.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

Alderbrook Media's internal writing assistant is fine-tuned on a corpus of the company's own past
internal documents. During testing, a query phrased to resemble the structure of a known, low-
sensitivity internal test document (created and inserted into the fine-tuning corpus specifically for
this assessment) causes the model to reproduce several exact sentences from that test document, rather
than a generalized response reflecting the topic in the abstract.

Testing confirms verbatim reproduction of the specific test content planted for this purpose. No
attempt is made to extract real internal company documents, and no query is directed at content
outside the test artifacts prepared for the assessment.

## Severity Calibration

This rates **Critical** in cases where verified memorized content includes real, sensitive customer
or business data, since the model itself becomes a direct, ongoing disclosure path for that data to
anyone with normal access to the assistant. Memorized reproduction limited to low-sensitivity,
already-broadly-known content would rate substantially lower: severity tracks the sensitivity of what
is actually reproducible, not the mere fact that memorization can be demonstrated, since some degree
of memorization is close to unavoidable with current fine-tuning approaches.

## Remediation

The real fix is a combination of measures rather than any single control: minimizing how much
sensitive raw data ever enters a training or fine-tuning set in the first place, applying differential
privacy or similar techniques where memorization risk is a specific concern, enforcing strict
per-user and per-session isolation at the infrastructure layer rather than assuming the model backend
handles it, and applying document-level access control at retrieval time in any retrieval-augmented
system rather than relying on application-level authentication alone.

The common bad fix is relying on output filtering alone, a list of patterns the response is checked
against before being returned, to catch disclosed sensitive content after the fact. This misses
disclosures that don't match a known pattern and does nothing to address the underlying memorization
or isolation gap that made the disclosure possible in the first place.

## Related Classes

- **Prompt Injection** ([../prompt-injection/](../prompt-injection/)): a related but distinct
  mechanism, an attacker's deliberate instruction manipulating behavior, as opposed to information
  surfacing through the model's own learned or session-handling behavior.
- **Cryptographic Failures** ([../cryptographic-failures/](../cryptographic-failures/)): the
  traditional data-protection class this is the AI-specific analogue of, sensitive data ending up
  somewhere it shouldn't through a mechanism specific to how the system actually works.
- **System Prompt Leakage** ([../system-prompt-leakage/](../system-prompt-leakage/)): a narrower,
  dedicated treatment of one specific disclosure target, the system's own confidential instructions.
- **Vector and Embedding Weaknesses** ([../vector-embedding-weaknesses/](../vector-embedding-weaknesses/)):
  the retrieval-layer mechanism behind a common real-world path to this same outcome in
  retrieval-augmented systems.
