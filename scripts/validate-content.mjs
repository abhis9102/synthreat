#!/usr/bin/env node
// Enforces the locked vulnerability-class content template (see CLAUDE.md): every published
// entry in src/content/vulnerabilities/ must contain an H2 for each required section, in order.
// A page missing a section fails this check — run it locally (`npm run validate:content`) and
// in CI before every build, so an incomplete page can never silently ship.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const REQUIRED_SECTIONS = [
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
];

const CONTENT_DIR = join(process.cwd(), 'src/content/vulnerabilities');
const H2_RE = /^##\s+(.+?)\s*$/gm;

let hadFailure = false;
let filesChecked = 0;

let files;
try {
  files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
} catch {
  console.log('No src/content/vulnerabilities directory yet — nothing to validate.');
  process.exit(0);
}

for (const file of files) {
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
  const { data, content } = matter(raw);

  if (data.status === 'draft') {
    console.log(`skip (draft)  ${file}`);
    continue;
  }

  filesChecked++;
  const found = [...content.matchAll(H2_RE)].map((m) => m[1].trim());
  const missing = REQUIRED_SECTIONS.filter((s) => !found.includes(s));
  const extra = found.filter((s) => !REQUIRED_SECTIONS.includes(s));
  const orderMismatch =
    missing.length === 0 &&
    JSON.stringify(found.filter((s) => REQUIRED_SECTIONS.includes(s))) !==
      JSON.stringify(REQUIRED_SECTIONS);

  if (missing.length > 0) {
    hadFailure = true;
    console.error(`FAIL  ${file}`);
    console.error(`      missing required section(s): ${missing.join(', ')}`);
  } else if (orderMismatch) {
    hadFailure = true;
    console.error(`FAIL  ${file}`);
    console.error(`      sections present but out of order — must match the locked template order`);
  } else {
    console.log(`ok    ${file}${extra.length ? `  (extra headings ignored: ${extra.join(', ')})` : ''}`);
  }
}

console.log(`\n${filesChecked} published file(s) checked against the 11-section template.`);
if (hadFailure) {
  console.error('\nContent validation failed — see FAIL lines above.');
  process.exit(1);
}
