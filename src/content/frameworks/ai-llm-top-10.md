---
title: The OWASP Top 10 for LLM Applications
summary: The risk categories specific to applications built on large language models, and how they differ from both traditional AppSec risks and general AI safety concerns.
related: ["frameworks-standards"]
relatedVulnerabilities: ["prompt-injection", "ai-sensitive-information-disclosure", "ai-supply-chain-risks", "training-data-poisoning", "insecure-output-handling", "excessive-agency", "system-prompt-leakage", "vector-embedding-weaknesses", "ai-misinformation", "unbounded-consumption"]
status: published
datePublished: 2026-09-18
---

## What It Is

The OWASP Top 10 for LLM Applications is a dedicated project from OWASP, separate from the
general OWASP Top 10, cataloging the most critical risks specific to applications built on large
language models. It exists because an application with a model embedded in it fails in ways that
neither the traditional web security world nor the AI research world had a ready vocabulary for.

## Why It Exists

LLM-powered applications introduce risk categories that don't map cleanly onto either traditional
web application security (the code and infrastructure surrounding the model) or general AI safety
research (the model's own learned behavior in isolation). A team building a customer support
chatbot needs a practical, practitioner-focused list of what can actually go wrong in production,
not an academic paper on model alignment and not a generic web security checklist that has nothing
to say about prompt injection. This list fills that specific gap.

## How It Works

The project describes ten representative risk categories rather than a single narrow bug type,
similar in spirit to how the general OWASP Top 10 groups related weaknesses into categories. The
numbering below reflects the project's 2025 revision; treat the exact numbering as a snapshot rather
than permanent, the same way the general OWASP Top 10's own numbering shifts release to release.

1. **[LLM01: Prompt Injection](../../vulnerabilities/prompt-injection/)**: getting a model to follow
   attacker-supplied instructions hidden inside its input. Direct prompt injection means typing the
   malicious instruction straight into a chat window; indirect prompt injection hides it inside a
   document, webpage, or email the model is later asked to process, so the model encounters and
   follows the instruction without a human ever seeing it.
2. **[LLM02: Sensitive Information Disclosure](../../vulnerabilities/ai-sensitive-information-disclosure/)**:
   a model revealing fragments of its training data, another user's session content in a shared
   deployment, or being manipulated into disclosing data it was given legitimate access to for a
   narrower purpose.
3. **[LLM03: Supply Chain](../../vulnerabilities/ai-supply-chain-risks/)**: a pre-trained model, a
   fine-tuning dataset, or a third-party plugin compromised before it ever reaches the application,
   the same underlying pattern covered on [Supply Chain Attack](../../attacks/supply-chain-attack/),
   applied to the AI pipeline specifically.
4. **[LLM04: Data and Model Poisoning](../../vulnerabilities/training-data-poisoning/)**: an attacker
   deliberately corrupting the data used to train or fine-tune a model, to make it learn a specific,
   hidden behavior that benefits them once it's deployed.
5. **[LLM05: Improper Output Handling](../../vulnerabilities/insecure-output-handling/)**: trusting a
   model's output enough to render or execute it without applying the same validation any other
   untrusted input would get. If that output is rendered directly into a web page, this becomes a
   very familiar problem wearing new clothes: see [Cross-Site
   Scripting](../../vulnerabilities/cross-site-scripting/) for what happens when untrusted content
   reaches a browser without proper encoding.
6. **[LLM06: Excessive Agency](../../vulnerabilities/excessive-agency/)**: an AI system or agent given
   more real-world tool access and permission than its actual task requires. See [AI Red
   Teaming](../../methodology/ai-red-teaming/) for how this becomes a serious problem the moment a
   model can take real actions, not just produce text.
7. **[LLM07: System Prompt Leakage](../../vulnerabilities/system-prompt-leakage/)**: a model's
   confidential developer instructions, meant to stay hidden, extracted through the same conversation
   channel a user talks to it through.
8. **[LLM08: Vector and Embedding Weaknesses](../../vulnerabilities/vector-embedding-weaknesses/)**:
   access-control and integrity gaps specific to a retrieval-augmented system's vector database, the
   index a model searches for context before answering.
9. **[LLM09: Misinformation](../../vulnerabilities/ai-misinformation/)**: a model stating false or
   unsupported information with the same fluent confidence as a correct answer, commonly called
   hallucination, and a user or downstream system relying on it as fact.
10. **[LLM10: Unbounded Consumption](../../vulnerabilities/unbounded-consumption/)**: no effective
    limit on how much computation, context length, or metered cost a single request or user can drive,
    turning metered inference into a denial-of-service and denial-of-wallet risk.

## Where This Shows Up in Practice

Organizations deploying customer-facing chatbots, internal AI coding assistants with access to a
private code repository, and AI agents wired into real business systems (email, databases,
ticketing tools) are where this list stops being theoretical. It has also become a standard
reference point in vendor risk assessments and security questionnaires: when a client evaluates an
AI-powered product or vendor, questions increasingly map directly onto these categories.

## Why a Business Should Care

This is a genuinely new risk surface that boards, regulators, and prospective clients are actively
asking about, and being able to speak to it by name, using its actual public reference rather than
an improvised in-house list, is a real credibility signal in that conversation. At the same time,
the honest position is that this space is newer and less battle-tested than the original OWASP Top
10: a couple of decades of accumulated web security practice back that older list, while this one
is still actively maturing. Saying that plainly earns more trust than overclaiming certainty.

## Common Misconceptions

**"This is just the OWASP Top 10 with AI examples."** It isn't. Several categories here, prompt
injection and training data supply chain risk in particular, have no direct equivalent in
traditional web application risk lists. This is a genuinely distinct taxonomy, not a relabeled copy.

**"If the model itself is 'safe,' the application built around it is safe."** [AI Red
Teaming](../../methodology/ai-red-teaming/) makes this exact distinction directly: the model is one layer, and the
ordinary application code, APIs, and tool access wrapped around it is a completely separate,
ordinary attack surface that needs its own testing regardless of how well-aligned the underlying
model is.

## Related Topics

- **Explore AI Security vulnerabilities:** the [Vulnerabilities section](../../vulnerabilities/#ai-security)
  has dedicated, worked-example pages for every risk category named above.
- [Security Frameworks & Standards](../frameworks-standards/): how this list fits among the other
  named frameworks covered on this site.
- [AI Red Teaming](../../methodology/ai-red-teaming/): the adversarial testing discipline built to test against
  the risk categories described here.
