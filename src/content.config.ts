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

export const collections = { vulnerabilities };
