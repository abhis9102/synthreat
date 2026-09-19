---
title: Static Application Security Testing (SAST)
summary: How SAST tools read an application's source code without running it to catch known-dangerous patterns before a single line ships, the real tools used, and where it structurally can't reach.
related: ["application-security", "dynamic-application-security-testing", "software-composition-analysis", "secure-code-review"]
relatedVulnerabilities: ["sql-injection", "command-injection", "cryptographic-failures"]
status: published
datePublished: 2026-09-19
---

## What It Is

SAST is automated testing that reads an application's own source code, without ever running it,
looking for known-dangerous patterns: a database query built by string concatenation instead of
parameterization, a hardcoded credential, a call to a function with a well-documented history of
misuse. It's one of the three automated testing categories that make up modern [Application
Security](../../domains/application-security/) practice, alongside [DAST](../dynamic-application-security-testing/)
and [SCA](../software-composition-analysis/), and it's the one that runs earliest, directly against
code a developer just wrote, often before it's ever merged.

## Why It Exists

Manually reading every line of code an engineering organization ships for security issues doesn't
scale past a handful of developers, and even an expert reviewer misses a familiar-looking but subtly
broken pattern buried in a large diff. SAST exists to automate the part of that review that's
genuinely pattern-matchable: a specific unsafe function call, a known-dangerous coding shape, at a
scale and consistency no human review process can match, freeing human reviewers (see [Secure Code
Review](../secure-code-review/)) to focus on the context-dependent judgment calls a tool can't make.

## How It Works

A SAST tool parses source code into an abstract representation (an abstract syntax tree, roughly the
code's own grammar tree) and matches it against a library of known-dangerous patterns: tainted data
flowing from an untrusted input into a dangerous function without passing through a sanitizer in
between, for instance (see [SQL Injection](../../vulnerabilities/sql-injection/) for exactly what an
unsanitized data flow into a database query looks like). Because it reads code rather than running
it, it can flag a vulnerable code path even if that specific path is never actually exercised by a
running application, including deep inside error-handling or admin-only branches a black-box test
might never reach.

Real tools in active use across the industry: **Semgrep** and **CodeQL** (GitHub's own semantic
code-analysis engine) are widely used open-source and freemium options that let a team write custom
rules for its own codebase's specific patterns; **SonarQube** is a long-established option that
combines SAST with general code-quality metrics; and commercial platforms like **Checkmarx** and
**Fortify** are common in larger, compliance-driven enterprises that need centralized reporting
across many codebases and languages.

## Where This Shows Up in Practice

SAST is almost always run automatically as a gate inside CI/CD, scanning every pull request or
commit and blocking a merge if it introduces a known-dangerous pattern, the same way a linter blocks
a stylistic violation. Language-specific tooling is common too: a Python codebase might run
**Bandit**, a JavaScript/TypeScript one might run **ESLint** with a security-focused plugin set,
layered on top of a broader multi-language tool like Semgrep or SonarQube for organization-wide
coverage.

## Why a Business Should Care

The realistic cost argument is timing: a flaw a SAST scan catches during a pull request costs a
developer a few minutes to fix before merge. The same flaw, if it ships, caught later during a
client's penetration test or a real incident, costs an investigation, an emergency patch, and
everything downstream of the actual breach. SAST is also often the specific, auditable evidence a
compliance framework or enterprise security questionnaire wants: proof that code is scanned
automatically before it reaches production, not just tested occasionally.

## Common Misconceptions

**"A clean SAST scan means the code is secure."** SAST only catches patterns it has a rule for, and
its most structural blind spot is business logic: a discount code that's technically valid but was
never supposed to be combinable with another one is invisible to a tool reading syntax, because
nothing about that code is syntactically wrong. That's exactly the gap [manual penetration
testing](../what-is-penetration-testing/) and [secure code review](../secure-code-review/) exist to
close.

**"SAST tools have a low false-positive rate."** In practice, most SAST tools flag a substantial
share of findings that turn out to be non-issues in context, a "vulnerable" pattern that's actually
safe given how it's called, and an unmanaged flood of false positives is one of the most common
reasons a SAST program gets ignored by developers entirely. Tuning rules to a specific codebase, not
just enabling every default rule, is what makes a SAST program actually get used rather than muted.

## Related Topics

- [Application Security](../../domains/application-security/): the broader practice SAST is one
  automated pillar of.
- [Dynamic Application Security Testing (DAST)](../dynamic-application-security-testing/): the
  complementary technique that tests the running application instead of its source.
- [Software Composition Analysis (SCA)](../software-composition-analysis/): the automated technique
  for the dependencies an application relies on, rather than the code the team wrote itself.
- [Secure Code Review](../secure-code-review/): the human-driven counterpart that catches what SAST's
  pattern-matching structurally can't.
- [SQL Injection](../../vulnerabilities/sql-injection/): a concrete example of exactly the syntactic
  pattern SAST is built to catch.
