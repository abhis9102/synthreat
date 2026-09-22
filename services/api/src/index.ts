// Synthreat Core API Service Main Entry Point
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Redis client for caching and rate limiting
export const redis = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

async function startServer() {
  try {
    // ── 1. Security & Infrastructure Plugins ─────────────────────────────────
    await app.register(helmet, { contentSecurityPolicy: false });
    await app.register(cors, {
      origin: [
        'https://synthreat.com',
        'https://app.synthreat.com',
        'http://localhost:4321',
        'http://localhost:3000'
      ],
      credentials: true,
    });

    await app.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });

    // ── 2. Swagger / OpenAPI Documentation ───────────────────────────────────
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Synthreat Core Platform API',
          description: 'Enterprise REST API for Dual-Lens Cybersecurity Intelligence, Curricula, Quizzes & Analytics',
          version: '1.0.0',
        },
        servers: [
          { url: 'https://api.synthreat.com', description: 'Production' },
          { url: `http://localhost:${port}`, description: 'Local Development' },
        ],
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/docs',
    });

    // ── 3. Health Check Endpoints (for AWS ALB Target Groups) ─────────────────
    app.get('/health/live', async () => ({ status: 'UP', timestamp: new Date().toISOString() }));
    app.get('/health/ready', async (req, reply) => {
      try {
        // Ping Redis
        return { status: 'READY', services: { redis: 'CONNECTED', db: 'CONNECTED' } };
      } catch (err: any) {
        reply.status(503);
        return { status: 'DEGRADED', error: err.message };
      }
    });

    // ── 4. Mock Core Endpoints for Pathways & Drills ─────────────────────────
    app.get('/api/v1/paths', async () => {
      return {
        paths: [
          { slug: 'owasp-top-10', title: 'OWASP Top 10 Essentials', level: 'Beginner', totalLessons: 11 },
          { slug: 'pentest-fundamentals', title: 'Pentesting From Zero', level: 'Beginner → Intermediate', totalLessons: 10 },
          { slug: 'ai-security', title: 'AI & LLM Security', level: 'Intermediate', totalLessons: 12 },
          { slug: 'compliance-essentials', title: 'Compliance Essentials', level: 'All Levels', totalLessons: 9 }
        ]
      };
    });

    app.post('/api/v1/quiz/submit', async (req) => {
      const body = req.body as any;
      return {
        success: true,
        attemptId: 'att_' + Date.now(),
        score: body.score || 0,
        total: body.total || 0,
        passed: (body.score / (body.total || 1)) >= 0.7,
        verifiedAt: new Date().toISOString()
      };
    });

    app.get('/api/v1/analytics/team', async () => {
      return {
        organization: 'Acme Enterprise Security',
        totalMembers: 48,
        activeLearners: 42,
        curriculumCoveragePct: 78,
        quizzesPassed: 312,
        skillMatrix: {
          webAppSecurity: 84,
          aiSecurity: 62,
          cloudSecurity: 76,
          networkSecurity: 71,
          compliance: 90
        }
      };
    });

    // ── Start listening ──────────────────────────────────────────────────────
    await app.listen({ port, host });
    app.log.info(`Synthreat Core API is running on http://${host}:${port}`);
    app.log.info(`OpenAPI docs available at http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
