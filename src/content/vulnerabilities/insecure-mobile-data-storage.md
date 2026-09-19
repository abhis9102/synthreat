---
title: Insecure Mobile Data Storage
surface: "MobileApp Security"
cwe: ["CWE-312", "CWE-922"]
summary: Sensitive data cached in plaintext directly on a mobile device is retrievable by anyone with physical or forensic access to it, regardless of how well the backend is secured.
typicalSeverityCeiling: Critical
related: ["insecure-mobile-communication", "insecure-mobile-authentication"]
practiceLab: "https://mas.owasp.org/crackmes/"
practiceLabName: "OWASP MASTG Crackmes"
status: published
datePublished: 2026-09-18
---

## Definition

Insecure mobile data storage happens when a mobile application writes sensitive data (credentials,
session tokens, personal information, cached API responses) to the device's local storage without
adequate protection, leaving it readable by anyone who gains physical or forensic access to that
device. Unlike a web application, where data mostly stays on a server the developer controls, a
mobile app's local storage sits on hardware the user, or an attacker with access to that hardware,
fully controls.

## The Trust Boundary That Breaks

A web developer builds with the assumption that sensitive data lives on infrastructure they own and
secure directly. A mobile developer working from the same mental model makes a dangerous mistake: a
phone is not the developer's infrastructure, it's the user's device, and once an attacker has
physical access, a lost or stolen device, a repair shop, a forensic tool, or simply another app on a
rooted or jailbroken phone, every assumption about a trusted execution environment can fail. The
trust boundary that breaks is treating local device storage as equivalent in trustworthiness to a
server the developer actually controls, when it functionally behaves more like handing a customer a
locked box and trusting them, and everyone with access to their house, never to open it.

## Where It Actually Shows Up

- Authentication tokens, session identifiers, or full credentials cached in plaintext in a local
  database, shared preferences file, or property list file, rather than in the platform's dedicated
  secure storage mechanism (Keychain on iOS, Keystore-backed encrypted storage on Android).
- Sensitive data written to application logs during development and left in place in the production
  build, retrievable by anyone with access to device logs.
- Cached API responses containing personal or financial data stored unencrypted in a local cache
  directory, intended purely as a performance optimization with no thought given to what happens if
  the device is later compromised.
- Sensitive data included in device backups (cloud or local) with no exclusion flag set, extending the
  exposure window well beyond the physical device itself to wherever that backup is later restored or
  accessed.
- Hardcoded API keys or secrets embedded directly in the compiled application package, retrievable by
  anyone who decompiles it, treated as protected simply because it "isn't source code anyone can read
  directly online."

## Why It Keeps Happening

Storing data locally is often the fastest way to make an app feel fast and to keep it functional
offline, and using the platform's dedicated secure storage mechanism correctly is genuinely more
friction than writing to a plain file or a simple key-value store. Developers coming from a
web-development background also frequently underestimate how accessible device storage actually is:
without seeing the device rooted or jailbroken and inspected directly, the risk of insecure local
storage stays invisible during ordinary development and testing.

## How to Find It

1. With a rooted or jailbroken test device, or an emulator with equivalent access, inspect the
   application's local storage directories, databases, shared preferences, and cache files directly
   for sensitive data stored in plaintext.
2. Review whether the platform's dedicated secure storage APIs (Keychain, Keystore-backed encrypted
   storage) are actually used for credentials and tokens, rather than a general-purpose file or
   database.
3. Capture and review device logs generated during normal app use, checking whether sensitive data is
   ever written to them.
4. Check whether sensitive local files are excluded from device backups, and if a backup is available
   for inspection, review its contents directly for anything that shouldn't have been included.
5. Decompile the application package and search for hardcoded secrets or API keys embedded directly in
   the compiled code or its resources.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Only non-sensitive, already-public app configuration is stored locally | Low; not a meaningful finding |
| Cached, non-authentication personal data is stored in plaintext | Medium; a real disclosure risk on device compromise |
| Authentication tokens or credentials are stored in plaintext, outside secure storage | Critical; direct account takeover on device compromise |
| Sensitive data is included, unencrypted, in a device backup reachable without the device itself | Critical; the exposure window extends well beyond physical device access |

## Why a Business Should Care

Insecure mobile data storage is a genuinely easy risk to underestimate, because a mobile app looking
and working fine on a developer's own test device tells a business nothing about what a lost, stolen,
resold, or forensically examined device reveals. The realistic business scenario worth naming directly
to a client: an employee's or customer's phone is lost or stolen constantly, at a scale most
organizations never think to model, and a mobile app that stores sensitive data insecurely turns every
one of those ordinary, unavoidable events into a potential data breach.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

During a mobile assessment of Halvestrom Logistics' driver companion app, inspecting the local storage
on a rooted test device reveals the app's authentication token stored in plaintext in a shared
preferences file, rather than in the platform's secure, encrypted storage mechanism. The token remains
valid and usable to authenticate to the backend API directly.

Testing confirms the token's presence and validity using only a test account created for this
assessment. The token is not used to access any real account, driver, or shipment data beyond
confirming it authenticates successfully.

## Severity Calibration

This rates **Critical** because a plaintext, still-valid authentication token stored outside secure
platform storage gives anyone with brief physical access to the device (or access to an unencrypted
backup of it) a direct path to full account takeover, with no further technique required. The
identical storage pattern applied only to non-sensitive cached configuration data would rate
substantially lower: severity tracks the sensitivity of what's actually exposed in local storage, not
the mere absence of encryption in the abstract.

## Remediation

The real fix is using the platform's dedicated secure storage mechanism for anything sensitive
(Keychain on iOS, Keystore-backed encrypted storage on Android), excluding sensitive local files from
device backups explicitly, stripping sensitive data from logs before a production build ships, and
never embedding long-lived secrets directly in the compiled application package.

The common bad fix is adding a generic encryption layer over local storage with the encryption key
itself stored alongside the encrypted data, or hardcoded in the app. That satisfies a checkbox
("the data is encrypted") without providing real protection, since anyone who can reach the encrypted
data on a compromised device can typically reach the key sitting right next to it just as easily.

## Related Classes

- **Insecure Mobile Communication** ([../insecure-mobile-communication/](../insecure-mobile-communication/)):
  the network-layer sibling of this class, protecting data in transit rather than at rest on the
  device.
- **Insecure Mobile Authentication & Session Management** ([../insecure-mobile-authentication/](../insecure-mobile-authentication/)):
  a frequent direct consequence, when the credential or token exposed by insecure storage is itself
  the weak point in the app's authentication design.
