---
title: AI Security
summary: The security concerns specific to building and operating AI systems, across the data, the model, the infrastructure, and the application layer around it.
category: Domain Overview
related: ["application-security"]
relatedVulnerabilities: []
status: published
datePublished: 2026-09-18
---

## What It Is

AI security is securing AI and machine learning systems across their whole lifecycle: the data used to train them, the model itself, the infrastructure that trains and serves that model, and the application built around it. Two sibling pages on this site cover closely related but distinct territory, worth naming precisely rather than conflating. [AI Red Teaming](../../methodology/ai-red-teaming/) is the adversarial testing methodology used against these systems. The [OWASP Top 10 for LLM Applications](../../frameworks/ai-llm-top-10/) is a named, publicly maintained list of the risks that testing looks for. This page is the domain itself: what actually needs securing, independent of how it gets tested or which list catalogs the risks.

## Why It Exists

AI systems introduce security concerns that do not really exist in traditional software. The training data itself can be a target, not just the finished system. A model's behavior is probabilistic rather than strictly deterministic, so the same input will not always produce the exact same output the way a traditional function call would. And AI systems are increasingly given real tool access (the ability to send an email, query a database, trigger a workflow), which is exactly the two-layer distinction laid out on the AI Red Teaming page: the model's own behavior is one layer, and the ordinary application built around it, with all the access it has been granted, is a separate and often larger source of real-world risk.

## How It Works

AI security spans several distinct layers:

- **Training data security.** Protecting the data used to train or fine-tune a model, including access control over sensitive training data and awareness of data poisoning, where an attacker deliberately corrupts training data to influence a model's future behavior in a way that benefits them.
- **Model security.** Protecting the model itself, including its weights, as valuable intellectual property against theft, and understanding adversarial robustness: the degree to which a model can be fooled by inputs specifically crafted to exploit how it makes decisions.
- **AI supply chain and MLOps security.** The pipeline that trains, versions, and deploys a model is itself a piece of infrastructure with its own security requirements, and it frequently depends on third-party models or datasets the organization did not build itself (see [Supply Chain Attack](../../attacks/supply-chain-attack/) for the general pattern this risk follows).
- **The application layer around a deployed model.** Once a model is deployed, it almost always sits behind an ordinary application: an API, a set of permissions, a database or tool it can reach. That layer needs the same rigor as any other piece of software (see [Application Security](../application-security/)), and the AI Red Teaming page covers exactly why this layer often matters more in practice than the model's own behavior.

## Where This Shows Up in Practice

This domain shows up wherever an organization builds or fine-tunes its own models, integrates third-party AI models or APIs into a product, or stands up an emerging AI governance program to oversee how AI is used and secured across the company.

## Why a Business Should Care

This is a domain the field is still actively building shared practice around, and the honest, more credible position to take with a client is to say so plainly rather than overselling how settled it is. The named standards referenced on this site (the AI/LLM Top 10 in particular) are genuinely useful and actively maturing, but this space does not yet have anywhere near the decades of hardened practice behind it that, say, web application security does. Being concrete about what can be meaningfully secured and tested today earns more trust than a confident-sounding claim that an AI system has been made comprehensively safe.

## Common Misconceptions

**"AI security is just about whether the chatbot says something bad."** This is the smallest and least consequential slice of the real risk, and it is exactly the misconception the AI Red Teaming page corrects directly. The application-layer exposure of a connected AI system, what data and actions it can actually reach, is usually the larger real-world problem.

**"Using a reputable AI provider's model or API means the AI security work is done."** The provider may secure their own model and infrastructure well, but the surrounding application, the data handling, and the specific access granted to that AI system remain the integrating organization's own responsibility. A well-behaved model behind an over-permissioned integration is still an insecure system.

## Related Topics

- [AI Red Teaming](../../methodology/ai-red-teaming/): the adversarial testing methodology for the systems this domain covers.
- [The OWASP Top 10 for LLM Applications](../../frameworks/ai-llm-top-10/): the named risk list this domain's concerns map onto.
- [Application Security](../application-security/): the ordinary software-security layer every AI-powered application still sits on top of.
