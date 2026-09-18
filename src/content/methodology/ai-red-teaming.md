---
title: AI Red Teaming
summary: Why AI systems need their own adversarial testing discipline, what's actually being tested (the model, the surrounding application, or both), and how it differs from traditional red teaming.
related: ["red-teaming", "application-security"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

AI red teaming is adversarial testing aimed specifically at AI and machine learning systems, using
the same simulate-a-real-adversary mindset described in [Red Teaming](../red-teaming/), but pointed
at a target that fails in genuinely different ways than a traditional server or application. If
you're new to the general concept of red teaming, start there first; this page assumes it and focuses
on what's specific to AI.

The single most important thing to understand up front is that "testing an AI system" almost always
means testing two different layers, and beginners (and plenty of experienced security people new to
this space) conflate them:

1. **The model layer itself.** This is the AI model's own behavior: can it be manipulated into
   ignoring its own safety instructions (jailbreaking), tricked into following hidden instructions
   smuggled inside content it processes (prompt injection), induced to reveal fragments of its
   training data, or fooled by carefully crafted inputs designed to exploit how it makes decisions
   (adversarial examples)?
2. **The application layer the model sits inside.** The API that serves the model, the plugins or
   tools the model is allowed to call, the database or file system it can read from or write to, the
   authentication in front of it: all of this is ordinary software, built and deployed the same way
   any other application is, and it is vulnerable to completely ordinary application-security flaws
   (see [Application Security](../../domains/application-security/)) that have nothing to do with AI at all. A
   perfectly "safe" model sitting behind a broken authentication check is still a serious problem.

## Why It Exists

AI systems fail in ways that don't map cleanly onto the vulnerability classes traditional security
testing was built around. A model can be functioning exactly as it was coded and trained to function
(no crash, no memory corruption, no broken authentication) and still produce a harmful, manipulated,
or unintended output, because the "bug" isn't in the code path, it's in the model's learned behavior
responding to a cleverly constructed input. That's a fundamentally different failure mode than a
buffer overflow or a SQL injection, and it needs a testing discipline built around it rather than an
attempt to force it into an existing checklist.

## How It Works

Two emerging, publicly maintained references anchor most serious work in this space right now, and
both are worth citing by name rather than relying on informal folklore about "AI safety":

- The [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/): a project from OWASP, the same
  organization behind the general OWASP Top 10, specifically cataloging the most common and impactful
  ways LLM-based applications go wrong. Also see this site's own [dedicated page](../../frameworks/ai-llm-top-10/) on it.
- [MITRE ATLAS](https://atlas.mitre.org/) (Adversarial Threat Landscape for Artificial-Intelligence Systems): a MITRE
  project, structured similarly to the well-known MITRE ATT&CK framework, cataloging real-world
  adversary tactics and techniques specifically against AI/ML systems.

Testing generally works through representative technique categories at the model layer:

- **Prompt injection**: getting a model to follow instructions it shouldn't. *Direct* prompt
  injection means typing the malicious instruction straight into the chat. *Indirect* prompt
  injection is more dangerous and less obvious: hiding an instruction inside a document, webpage, or
  email that the model is later asked to summarize or process, so the model encounters and follows
  the attacker's instructions without the human user ever seeing them.
- **Jailbreaking**: using framing, role-play, or encoding tricks to get a model to bypass its own
  built-in safety constraints and produce output it was explicitly designed to refuse.
- **Data and model extraction**: probing whether a model can be induced to reveal specific pieces of
  its training data, or whether its underlying behavior can be reverse-engineered through repeated,
  systematic querying.
- **Guardrail testing on the deployed system**, not just the base model, because most real products
  add filtering, moderation, and constraints on top of a general-purpose model, and it's the deployed
  combination, not the underlying model in isolation, that actually reaches a user.

## Where This Shows Up in Practice

This becomes urgent, not academic, the moment an AI system is given real tool access: a
customer-facing chatbot that can look up account information, an internal agent that can send emails,
query a database, or trigger a workflow. Once a model can take real actions rather than just produce
text, "the model said something strange" becomes "the model did something with real consequences,"
and the blast radius of a successful prompt injection or jailbreak jumps from reputational
embarrassment to actual data exposure or unauthorized action. Organizations deploying these connected
AI agents are where AI red teaming earns its keep fastest.

## Why a Business Should Care

This is a genuinely new and fast-moving risk category, and it's one that boards, regulators, and
prospective clients are actively asking about right now, which makes it tempting to oversell how
mature the testing discipline is. The more credible and more useful position is to say plainly that
AI red teaming is an emerging field without decades of hardened, standardized practice behind it yet.
Frameworks like MITRE ATLAS and the OWASP LLM Top 10 are genuinely useful and actively maturing, but
this isn't a space with the same twenty-year track record that, say, web application penetration
testing has. Being concrete and honest about what testing can meaningfully catch *today* (real
prompt-injection paths, real over-permissioned tool access, real data-exposure risks in a specific
deployed system) earns more trust with a client than a confident-sounding claim that an AI system has
been made comprehensively "safe."

## Common Misconceptions

- **"AI red teaming just means asking the chatbot to say something offensive."** That's the smallest
  and least consequential slice of the actual risk. The application-layer exposure of a connected AI
  agent (what data and systems it can actually touch) is usually the bigger real-world problem, and
  it's tested the same way any other application is tested (see
  [Application Security](../../domains/application-security/)).
- **"If the vendor says the model is 'safety-aligned,' the surrounding application is automatically
  safe."** These are two separate layers, tested two separate ways. A well-aligned model behind a
  broken API, an over-permissioned plugin, or an unauthenticated endpoint is still an insecure
  system. The model's own behavior was never the whole picture.

## Related Topics

- [Red Teaming](../red-teaming/): the general adversarial-simulation discipline this page builds on.
- [Application Security](../../domains/application-security/): the ordinary software-security layer that
  every AI-powered application still sits on top of, and still needs.
