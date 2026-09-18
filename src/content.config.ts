import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The 11 section headings the locked vulnerability-class template (CLAUDE.md) requires,
// in order. A page's Markdown body must contain an H2 for every one of these, verbatim,
// or `npm run validate:content` (and CI, before build) fails it.
export const REQUIRED_VULN_SECTIONS = [
  'Definition',
  'The Trust Boundary That Breaks',
  'Where It Actually Shows Up',
  'Why It Keeps Happening',
  'How to Find It',
  'Impact by Scenario',
  'Why a Business Should Care',
  'A Worked Example',
  'Severity Calibration',
  'Remediation',
  'Related Classes',
] as const;

// Top-level grouping for the vulnerabilities index page and nav dropdown, mirroring the `domains`
// collection's own surface names exactly (Cloud Security, WebApp Security, MobileApp Security,
// Network Security, AI Security) so the two collections read as one coherent taxonomy: the domain
// page is the broad field (e.g. `domains/webapp-security` covers the protocol/browser-layer building
// blocks, distinct from `domains/application-security`'s SDLC tooling and practices), and this
// collection is the specific vulnerability classes cataloged within that field, the same relationship
// every other surface already has to its own domain page. Order here is the display order everywhere
// it's grouped.
export const VULN_SURFACES = [
  'Cloud Security',
  'WebApp Security',
  'MobileApp Security',
  'Network Security',
  'AI Security',
] as const;

const vulnerabilities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vulnerabilities' }),
  schema: z.object({
    title: z.string(),
    // One-sentence dek shown in listings and search/share previews.
    summary: z.string().max(200),
    surface: z.enum(VULN_SURFACES),
    // Primary OWASP Top 10 (2021) category this class maps to, if any. Every "WebApp Security"
    // surface entry has one; it doubles as that surface's own sub-grouping in the UI, so a second
    // category field isn't needed. Not meaningful for other surfaces.
    owasp: z.string().optional(),
    // CWE identifier(s), e.g. "CWE-89".
    cwe: z.array(z.string()).default([]),
    // Not a fixed severity — the class's typical ceiling, for sorting/filtering only.
    // Real severity is always case-by-case; see the page's own Severity Calibration section.
    typicalSeverityCeiling: z.enum(['Critical', 'High', 'Medium', 'Low']),
    // Slugs of other entries in this collection, for the Related Classes section's cross-links.
    related: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

// The 7 section headings the locked domain & concept page template (CLAUDE.md) requires, in order.
// Shared by four collections below (domains, methodology, frameworks, compliance) — same template,
// deliberately kept as separate top-level collections rather than one collection split by a
// `category` field, so each reads as its own real section of the site rather than a subcategory of
// "domains." Enforced the same way as the vuln template.
export const REQUIRED_DOMAIN_SECTIONS = [
  'What It Is',
  'Why It Exists',
  'How It Works',
  'Where This Shows Up in Practice',
  'Why a Business Should Care',
  'Common Misconceptions',
  'Related Topics',
] as const;

// Pure domain overviews: a whole field of security practice (application security, cloud security,
// mobile security), plus the attack-landscape taxonomy page that maps the `attacks` collection.
const domains = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/domains' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    category: z.enum(['Domain Overview', 'Attack Landscape']),
    // Slugs of entries in this or other collections this page connects to. Documentation metadata
    // only (not currently rendered as UI), so loosely typed rather than split per target collection.
    related: z.array(z.string()).default([]),
    relatedVulnerabilities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

// Testing and assessment methodologies: penetration testing, red teaming, AI red teaming, CTEM,
// PTaaS. "How is security actually tested and delivered," as distinct from "what field of practice
// is being tested" (domains) or "what named external standard governs it" (frameworks/compliance).
const methodology = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/methodology' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    related: z.array(z.string()).default([]),
    relatedVulnerabilities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

// Named external frameworks and standards (OWASP Top 10, SANS/CWE Top 25, NIST CSF, CIS Controls):
// prioritization lists and control catalogs, not legal or contractual requirements. See `compliance`
// for the regimes that actually are.
const frameworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/frameworks' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    related: z.array(z.string()).default([]),
    relatedVulnerabilities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

// Compliance and regulatory regimes (GDPR, HIPAA, PCI-DSS, SOC 2, ISO 27001, DPDP Act): laws,
// contractual standards, and voluntary certifications a business may actually be on the hook for.
const compliance = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/compliance' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    related: z.array(z.string()).default([]),
    relatedVulnerabilities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

// The 11 section headings the locked attack-technique page template (CLAUDE.md) requires, in
// order. Same shape as the vulnerability template, with two sections renamed to fit a technique
// (phishing, ransomware, DDoS) rather than a code-level weakness.
export const REQUIRED_ATTACK_SECTIONS = [
  'Definition',
  'What Makes It Work',
  'Where It Actually Shows Up',
  'Why It Keeps Succeeding',
  'How to Detect It',
  'Impact by Scenario',
  'Why a Business Should Care',
  'A Worked Example',
  'Severity Calibration',
  'Prevention & Response',
  'Related Attacks & Vulnerabilities',
] as const;

const attacks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/attacks' }),
  schema: z.object({
    title: z.string(),
    // One-sentence dek shown in listings and search/share previews.
    summary: z.string().max(200),
    // CAPEC (Common Attack Pattern Enumeration and Classification) ID(s), e.g. "CAPEC-98".
    // Left empty rather than guessed when no ID is confidently known — see CLAUDE.md.
    capec: z.array(z.string()).default([]),
    // MITRE ATT&CK technique ID(s), e.g. "T1566". Same rule: empty over guessed.
    mitreAttack: z.array(z.string()).default([]),
    // Not a fixed severity — the technique's typical ceiling, for sorting/filtering only.
    typicalSeverityCeiling: z.enum(['Critical', 'High', 'Medium', 'Low']),
    // Slugs of other entries in this collection, for the Related section's cross-links.
    related: z.array(z.string()).default([]),
    // Slugs of vulnerabilities-collection entries this technique connects to.
    relatedVulnerabilities: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    datePublished: z.coerce.date().optional(),
    dateUpdated: z.coerce.date().optional(),
  }),
});

export const collections = { vulnerabilities, domains, attacks, methodology, frameworks, compliance };
