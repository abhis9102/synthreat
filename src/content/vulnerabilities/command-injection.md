---
title: OS Command Injection
summary: How untrusted input reaching a system shell command lets an attacker run arbitrary operating system commands, not just influence the application's own logic.
owasp: "A03:2021 – Injection"
cwe: ["CWE-78"]
typicalSeverityCeiling: Critical
related: ["sql-injection", "ssrf"]
status: published
datePublished: 2026-09-18
---

## Definition

OS command injection happens when untrusted input is passed into a function that constructs and
executes an operating-system shell command, letting an attacker append or substitute their own
commands into what the application actually runs on the underlying server. The application isn't
just handed bad data anymore. It's handed a different command to execute, at the operating system
level, not just inside the application's own logic.

## The Trust Boundary That Breaks

This is the same underlying failure already covered in depth on the [SQL Injection](../sql-injection/)
page, data crossing into code, just at a different parser. SQL injection crosses that line at the
database's SQL parser; OS command injection crosses it at the operating system's shell parser
instead. The developer trusts that a value used to build a shell command, a hostname, a filename, an
option flag, is inert text, when the shell itself treats specific characters (a semicolon, a pipe, a
backtick) as command syntax regardless of what the application intended. Once untrusted input reaches
a shell invocation without being kept strictly as a single, literal argument, that boundary is gone.

<figure class="diagram">
<svg viewBox="0 0 740 130" role="img" aria-labelledby="diagram-title-command-injection" style="width:100%;height:auto;">
<title id="diagram-title-command-injection">A crafted input containing a shell command separator causes the server to execute an attacker-supplied command alongside the intended one.</title>
<defs>
<marker id="arrow-command-injection" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>
</marker>
</defs>
<circle cx="22" cy="20" r="11" fill="var(--accent)"/>
<text x="22" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
<rect x="10" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="85" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">User input feeds</text>
<text x="85" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">a shell command</text>
<line x1="160" y1="72" x2="200" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-command-injection)"/>
<circle cx="212" cy="20" r="11" fill="var(--accent)"/>
<text x="212" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
<rect x="200" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="275" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Input contains a</text>
<text x="275" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">command separator</text>
<line x1="350" y1="72" x2="390" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-command-injection)"/>
<circle cx="402" cy="20" r="11" fill="var(--accent)"/>
<text x="402" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
<rect x="390" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="465" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Shell parses it as</text>
<text x="465" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">two commands</text>
<line x1="540" y1="72" x2="580" y2="72" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#arrow-command-injection)"/>
<circle cx="592" cy="20" r="11" fill="var(--accent)"/>
<text x="592" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
<rect x="580" y="40" width="150" height="64" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
<text x="655" y="68" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Attacker's command</text>
<text x="655" y="86" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">executes on server</text>
</svg>
<figcaption>Once input reaches a real shell, the attacker isn't limited to the application's own logic anymore.</figcaption>
</figure>

## Where It Actually Shows Up

- Diagnostic or utility features that shell out to a system tool directly, a "ping this host" or
  "check this domain" feature being a classic example.
- Image, document, or media processing pipelines that invoke external command-line tools (a converter
  or compressor) with a filename or option derived from user input.
- Any code path that uses a generic shell-execution function, one that hands a full command-line
  string to a real shell, with request-derived data concatenated into that string.
- Legacy integration code that "just calls the existing script" for convenience, bypassing whatever
  safer, parameterized interface the rest of the application otherwise uses.

## Why It Keeps Happening

Shelling out to an existing command-line tool is often the fastest way to reuse functionality that
already exists, especially under deadline pressure, and the risk is easy to overlook because the
input in question looks like ordinary data (a hostname, a filename) rather than anything that visibly
resembles code. A safe, parameterized subprocess call and an unsafe, shell-interpreted one can look
almost identical at a glance in many languages, which makes this an easy mistake to introduce without
noticing, even in a codebase that handles most other input carefully.

## How to Find It

1. Identify any feature that appears to invoke an external command or system utility, diagnostics,
   conversion, compression, or anything that shells out to do its work.
2. Supply a value containing a shell command separator followed by a harmless, clearly identifiable
   command, such as one that prints a distinctive marker string, rather than anything destructive.
3. Confirm the marker actually appears in the application's response or observable behavior, which
   proves real execution rather than just an unusual error or a parsing anomaly.
4. Test multiple separator styles and shell metacharacters, since a fix or filter addressing one
   specific character often leaves closely related ones untouched.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Command executes in a tightly sandboxed, low-privilege container with no further reachable resources | Serious but bounded: confirmed code execution, limited practical reach |
| Command executes with the same privileges as the main application process | Critical: broad access to the filesystem, other services, and stored credentials |
| Command executes on a cloud instance that can reach the instance metadata service | Critical: a direct path to cloud credentials and further account-wide compromise |
| The process runs with least-privilege access and no network egress at all | Meaningfully reduces, though does not eliminate, the real-world impact of the flaw |

## Why a Business Should Care

Command injection is one of the most severe classes on this site precisely because it doesn't just
expose data, it hands an attacker the ability to run arbitrary commands with whatever privileges the
application itself has. For a client, the framing that lands best is that this is rarely "a data leak
risk," it's closer to handing an unauthenticated stranger a terminal on the server, scoped only by
however carefully the application's own runtime privileges were limited in advance. That's exactly
why least-privilege process design matters as a second line of defense, not just a nice-to-have.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system, client, or data is referenced.)*

Cordell Analytics runs a "network diagnostics" feature on its internal support portal that lets staff
enter a hostname to check reachability, implemented by passing that hostname directly into a shell
`ping` command. Supplying a hostname followed by a command separator and a command that prints a
distinctive marker string returns that marker string in the diagnostic output, confirming the second
command actually executed on the server rather than being treated as part of the hostname.

Testing stops at that confirmation. No further commands are run, no files are read or modified, and no
attempt is made to escalate beyond proving execution. That boundary is deliberate: demonstrating that
arbitrary command execution is possible, on a clearly harmless, easily identifiable command, is
sufficient to establish critical impact without causing or risking any real disruption.

## Severity Calibration

This instance rates **Critical**: unauthenticated exposure was not required here since it sat behind
an internal login, but the demonstrated capability, arbitrary command execution on the underlying
server, is severe regardless of the access level needed to reach the feature. What actually drives
this rating is the proof of real code execution, not merely a suspicious response; the same flaw
found in a fully sandboxed, network-isolated container with nothing else reachable would still be
serious, but calibrated lower given the sharply reduced blast radius.

## Remediation

The real fix is avoiding shell invocation entirely for anything touching user input: use
language-native APIs or subprocess calls that pass arguments directly to the target program without
ever going through a shell interpreter, so metacharacters in the input have no special meaning at
all. Where a shell call is genuinely unavoidable, strict allowlist validation of the input, permitting
only an exact, known set of safe values, is necessary defense-in-depth, not a replacement for
avoiding the shell in the first place.

The common bad fix is blacklisting specific characters like semicolons or pipes. This is reliably
bypassable through alternate metacharacters, encoding tricks, or shell features the blocklist's
author simply didn't think to include. If the fix is still "strip out these particular characters"
rather than "never let this input reach a shell interpreter," it isn't actually fixed.

## Related Classes

- [SQL Injection](../sql-injection/): the same root cause, data crossing into code, at a different
  parser (the database's, rather than the shell's).
- [Server-Side Request Forgery](../ssrf/): a related pattern where the server is tricked into using a
  powerful capability (making its own request, or in this case, running its own command) on the
  attacker's behalf rather than the application's intended one.
