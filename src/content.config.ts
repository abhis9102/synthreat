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

const vulnerabilities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vulnerabilities' }),
  schema: z.object({
    title: z.string(),
    // One-sentence dek shown in listings and search/share previews.
    summary: z.string().max(200),
    // Primary OWASP Top 10 (2021) category this class maps to, if any.
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
// Covers domain overviews, methodology explainers, service models, and attack-landscape taxonomies —
// anything broader than a single vulnerability class. Enforced the same way as the vuln template.
export const REQUIRED_DOMAIN_SECTIONS = [
  'What It Is',
  'Why It Exists',
  'How It Works',
  'Where This Shows Up in Practice',
  'Why a Business Should Care',
  'Common Misconceptions',
  'Related Topics',
] as const;

const domains = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/domains' }),
  schema: z.object({
    title: z.string(),
    // One-sentence dek shown in listings and search/share previews.
    summary: z.string().max(200),
    // What kind of domain/concept page this is, for grouping and filtering on the index.
    category: z.enum([
      'Domain Overview',
      'Methodology',
      'Service Model',
      'Attack Landscape',
      'Framework & Standard',
      'Compliance & Regulation',
    ]),
    // Slugs of other entries in this collection, for the Related Topics section's cross-links.
    related: z.array(z.string()).default([]),
    // Slugs of vulnerabilities-collection entries this page connects to.
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

export const collections = { vulnerabilities, domains, attacks };
