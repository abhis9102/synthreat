// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://abhis9102.github.io',
  // Trailing slash matters: import.meta.env.BASE_URL is used as `${base}vulnerabilities/` etc.
  // throughout the site, and without it every constructed link is missing a path separator.
  base: '/synthreat/',
  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
});

