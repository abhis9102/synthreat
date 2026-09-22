export interface PathArticle {
  col: string;
  slug: string;
  title: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  articles: PathArticle[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'owasp-top-10',
    title: 'OWASP Top 10 Essentials',
    description: 'The 10 most critical web application security risks, in order of severity.',
    icon: '🔐',
    duration: '~3 hours',
    level: 'Beginner',
    articles: [
      { col: 'frameworks', slug: 'owasp-top-10', title: 'OWASP Top 10 Overview' },
      { col: 'vulnerabilities', slug: 'broken-access-control', title: 'Broken Access Control' },
      { col: 'vulnerabilities', slug: 'cryptographic-failures', title: 'Cryptographic Failures' },
      { col: 'vulnerabilities', slug: 'sql-injection', title: 'SQL Injection' },
      { col: 'vulnerabilities', slug: 'insecure-design', title: 'Insecure Design' },
      { col: 'vulnerabilities', slug: 'security-misconfiguration', title: 'Security Misconfiguration' },
      { col: 'vulnerabilities', slug: 'vulnerable-outdated-components', title: 'Vulnerable Components' },
      { col: 'vulnerabilities', slug: 'authentication-failures', title: 'Authentication Failures' },
      { col: 'vulnerabilities', slug: 'software-data-integrity-failures', title: 'Integrity Failures' },
      { col: 'vulnerabilities', slug: 'logging-monitoring-failures', title: 'Logging & Monitoring' },
      { col: 'vulnerabilities', slug: 'ssrf', title: 'SSRF' },
    ],
  },
  {
    slug: 'pentest-fundamentals',
    title: 'Pentesting From Zero',
    description: 'Everything you need to start a career in offensive security and penetration testing.',
    icon: '🛡️',
    duration: '~5 hours',
    level: 'Beginner → Intermediate',
    articles: [
      { col: 'methodology', slug: 'what-is-penetration-testing', title: 'What is Penetration Testing?' },
      { col: 'methodology', slug: 'types-of-penetration-testing', title: 'Types of Penetration Testing' },
      { col: 'methodology', slug: 'webapp-penetration-testing', title: 'Web App Pentesting' },
      { col: 'methodology', slug: 'network-penetration-testing', title: 'Network Pentesting' },
      { col: 'methodology', slug: 'threat-modeling', title: 'Threat Modeling' },
      { col: 'methodology', slug: 'vulnerability-assessment-management', title: 'Vulnerability Management' },
      { col: 'attacks', slug: 'phishing', title: 'Phishing' },
      { col: 'attacks', slug: 'brute-force', title: 'Brute Force' },
      { col: 'attacks', slug: 'man-in-the-middle', title: 'Man-in-the-Middle' },
      { col: 'methodology', slug: 'red-teaming', title: 'Red Teaming' },
    ],
  },
  {
    slug: 'ai-security',
    title: 'AI & LLM Security',
    description: 'Security risks unique to AI systems, LLMs, and machine learning pipelines.',
    icon: '🤖',
    duration: '~2.5 hours',
    level: 'Intermediate',
    articles: [
      { col: 'domains', slug: 'ai-security', title: 'AI Security Domain' },
      { col: 'frameworks', slug: 'ai-llm-top-10', title: 'OWASP LLM Top 10' },
      { col: 'vulnerabilities', slug: 'prompt-injection', title: 'Prompt Injection' },
      { col: 'vulnerabilities', slug: 'insecure-output-handling', title: 'Insecure Output Handling' },
      { col: 'vulnerabilities', slug: 'training-data-poisoning', title: 'Training Data Poisoning' },
      { col: 'vulnerabilities', slug: 'ai-supply-chain-risks', title: 'AI Supply Chain Risks' },
      { col: 'vulnerabilities', slug: 'excessive-agency', title: 'Excessive Agency' },
      { col: 'vulnerabilities', slug: 'system-prompt-leakage', title: 'System Prompt Leakage' },
      { col: 'vulnerabilities', slug: 'ai-sensitive-information-disclosure', title: 'AI Information Disclosure' },
      { col: 'vulnerabilities', slug: 'ai-misinformation', title: 'AI Misinformation' },
      { col: 'methodology', slug: 'ai-penetration-testing', title: 'AI Penetration Testing' },
      { col: 'methodology', slug: 'ai-red-teaming', title: 'AI Red Teaming' },
    ],
  },
  {
    slug: 'compliance-essentials',
    title: 'Compliance Essentials',
    description: 'Key frameworks and regulations every security professional and executive must know.',
    icon: '⚖️',
    duration: '~2 hours',
    level: 'All Levels',
    articles: [
      { col: 'compliance', slug: 'compliance-regulations', title: 'Compliance Overview' },
      { col: 'compliance', slug: 'gdpr', title: 'GDPR' },
      { col: 'compliance', slug: 'hipaa', title: 'HIPAA' },
      { col: 'compliance', slug: 'pci-dss', title: 'PCI-DSS' },
      { col: 'compliance', slug: 'iso-27001', title: 'ISO 27001' },
      { col: 'compliance', slug: 'soc-2', title: 'SOC 2' },
      { col: 'frameworks', slug: 'nist-cybersecurity-framework', title: 'NIST CSF' },
      { col: 'frameworks', slug: 'cis-controls', title: 'CIS Controls' },
      { col: 'compliance', slug: 'dpdp-act', title: 'DPDP Act (India)' },
    ],
  },
];

export interface PathContext {
  path: LearningPath;
  stepIndex: number;
  totalSteps: number;
  prevArticle: PathArticle | null;
  nextArticle: PathArticle | null;
}

export function getPathsForArticle(col: string, slug: string): PathContext[] {
  return LEARNING_PATHS.filter(path =>
    path.articles.some(a => a.col === col && a.slug === slug)
  ).map(path => {
    const idx = path.articles.findIndex(a => a.col === col && a.slug === slug);
    return {
      path,
      stepIndex: idx + 1,
      totalSteps: path.articles.length,
      prevArticle: idx > 0 ? path.articles[idx - 1] : null,
      nextArticle: idx < path.articles.length - 1 ? path.articles[idx + 1] : null,
    };
  });
}
