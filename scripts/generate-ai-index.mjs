#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const collections = [
  'vulnerabilities',
  'attacks',
  'domains',
  'methodology',
  'frameworks',
  'compliance',
];

function extractSection(content, sectionNames) {
  for (const name of sectionNames) {
    const regex = new RegExp(`##\\s+${name}\\s*\\n+([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i');
    const match = content.match(regex);
    if (match) {
      return match[1]
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 450);
    }
  }
  return '';
}

const index = [];

for (const col of collections) {
  const dir = join(process.cwd(), 'src/content', col);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(dir, file), 'utf8');
    const parsed = matter(raw);

    if (parsed.data.status === 'draft') continue;

    const tech = extractSection(parsed.content, [
      'The Trust Boundary That Breaks',
      'What Makes It Work',
      'What It Is',
      'Definition',
    ]);
    const biz = extractSection(parsed.content, [
      'Why a Business Should Care',
      'Why It Exists',
    ]);
    const fix = extractSection(parsed.content, [
      'Remediation',
      'Prevention & Response',
      'How It Works',
    ]);

    index.push({
      col,
      slug,
      title: parsed.data.title || slug,
      summary: parsed.data.summary || '',
      surface: parsed.data.surface || parsed.data.category || col,
      cwe: parsed.data.cwe || [],
      owasp: parsed.data.owasp || '',
      tech,
      biz,
      fix,
    });
  }
}

const publicDir = join(process.cwd(), 'public');
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const outputPath = join(publicDir, 'synthreat-ai-index.json');
writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');

console.log(`[ai-index] Generated ${index.length} entries -> ${outputPath}`);
