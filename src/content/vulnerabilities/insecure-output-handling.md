---
title: Insecure Output Handling
surface: "AI Security"
summary: Trusting a large language model's output enough to render or execute it directly, without giving it the same validation any other untrusted input would get.
cwe: []
typicalSeverityCeiling: Critical
related: ["prompt-injection", "cross-site-scripting"]
status: published
datePublished: 2026-09-18
---

## Definition

Insecure output handling happens when an application takes a model's generated output and passes it
directly into a sensitive downstream context, rendering it in a web page, executing it as code,
inserting it into a database query, without treating it as untrusted input first. A model's output
looks like ordinary, well-formed text or code, but its actual content is influenced by whatever the
model was asked to process, including anything an attacker managed to get into that input through
prompt injection or a manipulated document.

## The Trust Boundary That Breaks

A developer wiring a model's response into the rest of an application often treats that output the
way they'd treat a value their own backend code generated: safe by default, because it came from
"their" system. But the model's output isn't equivalent to backend-generated data. Its content is
shaped by the model's input, which frequently includes content the application's own users, or an
external source, ultimately controlled. Once any part of that input can be influenced by an attacker
(see [Prompt Injection](../prompt-injection/)), the model's output inherits that influence, and
treating it as inherently trustworthy is the same mistake as trusting any other unvalidated input.

## Where It Actually Shows Up

- A model's response rendered directly into a web page without HTML encoding, letting a manipulated
  response inject markup or script content into the page exactly the way [Cross-Site
  Scripting](../cross-site-scripting/) does through any other unvalidated input source.
- Generated code (a script, a shell command, a database query) executed directly based on the model's
  output, without the same review or sandboxing any other externally-influenced code would require
  before execution.
- A model's structured output (JSON, a function-call payload) parsed and acted on directly by
  downstream application logic, assuming the structure and values will always match what a
  well-behaved model would produce, rather than validating the actual content received.
- Generated summaries or responses inserted into internal documents, emails, or records without
  review, letting an injected instruction propagate its effect into systems well beyond the original
  conversation.

## Why It Keeps Happening

A model's output reads as fluent, well-structured, "finished" content, which makes it feel
qualitatively different from a raw user-submitted form field, even though functionally it's just
another string an application received from a source it doesn't fully control. Development teams
building quickly on top of a model's output often skip the validation and encoding step specifically
because the output looks clean and well-formed by default, and the gap only becomes visible once an
attacker deliberately manipulates the model's input to shape its output toward something harmful.

## How to Find It

1. Trace every place a model's output is used downstream: rendered in a UI, executed, inserted into a
   query or document, or passed to another system, not just the immediate chat response shown to the
   user.
2. For each destination, test whether the same class of payload that would be a finding in that
   destination directly (a script tag for a web page, a command-injection string for a shell call)
   still succeeds when it has to first pass through the model's own processing and output.
3. Combine this with a prompt-injection test: since the model's output can often be influenced through
   its input, test the full path from injected input through to the vulnerable downstream sink, rather
   than testing model behavior and output handling as if they were unrelated.
4. Review whether structured model output is validated against an expected schema before use, rather
   than trusted to always conform to it.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Model output is rendered as plain text with no markup or code interpretation | Attack surface effectively closed for this specific path |
| Model output is rendered into a web page without proper encoding | Critical; a direct cross-site scripting path, reachable through the model rather than a traditional input field |
| Model-generated code or commands are executed without review or sandboxing | Critical; a direct path to arbitrary code execution |
| Model-generated structured output is trusted without schema validation downstream | Medium to High, depending on what the downstream logic does with malformed or unexpected values |

## Why a Business Should Care

Insecure output handling is the mechanism that turns an AI feature's own text generation into a
familiar, well-understood vulnerability class the moment that output reaches a sensitive destination.
The business framing that lands well with a client is that an AI feature's output needs the exact same
validation discipline as any other untrusted input source, and skipping that step specifically because
the output "came from our own AI feature" is the same reasoning error as trusting a user-submitted form
field because it "came through our own website."

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

Northfell Systems' internal knowledge-base assistant generates a response summarizing a linked
document and renders that response directly into the support portal's page using unescaped HTML
insertion. A test document, created for this assessment, includes content designed to appear in the
model's summary containing an HTML tag. When the assistant summarizes the document and its response is
rendered in the portal, the tag is interpreted by the browser rather than displayed as plain text,
confirming the output path is not encoded before rendering.

Testing stops at confirming the tag is interpreted rather than displayed as text. No script payload
beyond a benign, clearly identifiable marker is used, and no other user's session or data is
targeted.

## Severity Calibration

This rates **Critical** because the unencoded rendering path is a direct, browser-executable
cross-site scripting vulnerability, reachable by manipulating content the assistant is asked to
summarize rather than through a traditional form field, with everything that implies for session and
account compromise. A model whose output is rendered exclusively as plain text, with no markup or
code interpretation anywhere downstream, would not have this specific finding at all: severity tracks
what the receiving context does with the output, not the presence of AI-generated content itself.

## Remediation

The real fix is applying the same output handling discipline used for any other untrusted input:
encode model output appropriately for the context it's rendered into (HTML-encode for a web page,
parameterize for a database query), validate structured output against an explicit schema before
acting on it, and never execute model-generated code without the same review or sandboxing any other
externally-influenced code would require.

The common bad fix is trusting model output because it "came from our own AI system," treating it as
internally generated rather than as content shaped by whatever input the model processed. The
distinction that actually matters for security purposes is not who generated the content, but whether
any part of what influenced it was ever exposed to untrusted input.

## Related Classes

- **Prompt Injection** ([../prompt-injection/](../prompt-injection/)): the most common way an
  attacker gets to influence what a model's output actually contains in the first place.
- **Cross-Site Scripting** ([../cross-site-scripting/](../cross-site-scripting/)): the exact
  underlying vulnerability this class becomes the moment unencoded model output is rendered into a
  web page.
