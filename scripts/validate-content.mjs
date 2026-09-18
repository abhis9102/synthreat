#!/usr/bin/env node
// Enforces the locked content templates (see CLAUDE.md): every published entry in a collection
// must contain an H2 for each of that collection's required sections, in order. A page missing a
// section fails this check — run it locally (`npm run validate:content`) and in CI before every
// build, so an incomplete page can never silently ship.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const COLLECTIONS = [
  {
    name: 'vulnerabilities',
    dir: join(process.cwd(), 'src/content/vulnerabilities'),
    sections: [
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
    ],
  },
  {
    name: 'domains',
    dir: join(process.cwd(), 'src/content/domains'),
    sections: [
      'What It Is',
      'Why It Exists',
      'How It Works',
      'Where This Shows Up in Practice',
      'Why a Business Should Care',
      'Common Misconceptions',
      'Related Topics',
    ],
  },
  {
    name: 'attacks',
    dir: join(process.cwd(), 'src/content/attacks'),
    sections: [
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
    ],
  },
  // methodology, frameworks, and compliance all share the domain/concept template — same
  // structure, deliberately separate top-level collections rather than one collection split by a
  // category field. See CLAUDE.md and src/content.config.ts.
  {
    name: 'methodology',
    dir: join(process.cwd(), 'src/content/methodology'),
    sections: [
      'What It Is',
      'Why It Exists',
      'How It Works',
      'Where This Shows Up in Practice',
      'Why a Business Should Care',
      'Common Misconceptions',
      'Related Topics',
    ],
  },
  {
    name: 'frameworks',
    dir: join(process.cwd(), 'src/content/frameworks'),
    sections: [
      'What It Is',
      'Why It Exists',
      'How It Works',
      'Where This Shows Up in Practice',
      'Why a Business Should Care',
      'Common Misconceptions',
      'Related Topics',
    ],
  },
  {
    name: 'compliance',
    dir: join(process.cwd(), 'src/content/compliance'),
    sections: [
      'What It Is',
      'Why It Exists',
      'How It Works',
      'Where This Shows Up in Practice',
      'Why a Business Should Care',
      'Common Misconceptions',
      'Related Topics',
    ],
  },
];

const H2_RE = /^##\s+(.+?)\s*$/gm;

let hadFailure = false;
let totalChecked = 0;

for (const { name, dir, sections } of COLLECTIONS) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    console.log(`No src/content/${name} directory yet — nothing to validate.`);
    continue;
  }

  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    const label = `${name}/${file}`;

    if (data.status === 'draft') {
      console.log(`skip (draft)  ${label}`);
      continue;
    }

    totalChecked++;
    const found = [...content.matchAll(H2_RE)].map((m) => m[1].trim());
    const missing = sections.filter((s) => !found.includes(s));
    const extra = found.filter((s) => !sections.includes(s));
    const orderMismatch =
      missing.length === 0 &&
      JSON.stringify(found.filter((s) => sections.includes(s))) !== JSON.stringify(sections);

    if (missing.length > 0) {
      hadFailure = true;
      console.error(`FAIL  ${label}`);
      console.error(`      missing required section(s): ${missing.join(', ')}`);
    } else if (orderMismatch) {
      hadFailure = true;
      console.error(`FAIL  ${label}`);
      console.error(`      sections present but out of order — must match the locked template order`);
    } else {
      console.log(`ok    ${label}${extra.length ? `  (extra headings ignored: ${extra.join(', ')})` : ''}`);
    }
  }
}

console.log(`\n${totalChecked} published file(s) checked against their collection's locked template.`);
if (hadFailure) {
  console.error('\nContent validation failed — see FAIL lines above.');
  process.exit(1);
}
