# Synthreat

A free, public cybersecurity education portal — grounded in real, evidence-based engagement work
rather than rehashed generic tutorials. Written for two readers on the same page, always: someone
learning the material for the first time, and someone who needs to translate it into a client or
business conversation.

Starts with penetration testing fundamentals and vulnerability classes, and grows to cover the rest
of the field — application security, cloud, network, mobile, red team, blue team, GRC — and
eventually AI security as its own domain.

**Project charter:** see [`CLAUDE.md`](./CLAUDE.md) — mission, audience, the locked content template
every vulnerability-class page follows, the role-based team workflow, and tech-stack decisions.

**Progress log:** see [`PROGRESS.md`](./PROGRESS.md).

## Stack

[Astro](https://astro.build), static output, deployed to GitHub Pages via GitHub Actions
(`.github/workflows/deploy.yml`).

## Local development

Requires Node 22.12+.

```sh
npm install
npm run dev       # localhost:4321
npm run build     # static output to ./dist
npm run preview   # preview the production build locally
```
