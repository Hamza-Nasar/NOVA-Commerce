# NOVA Commerce

Production-minded e-commerce foundation: a Next.js storefront and NestJS API in a pnpm workspace.

## Quick start

1. Copy `.env.example` to `.env` and choose non-default local secrets.
2. Run `docker compose up -d` to start PostgreSQL and Redis.
3. Copy `apps/api/.env.example` to `apps/api/.env` and update the credentials if changed.
4. Run `pnpm install`, then `pnpm db:generate`, `pnpm db:migrate`, and `pnpm dev`.

The web app is at `http://localhost:3000`; API health is at `http://localhost:4000/api/v1/health`.

## Layout

- `apps/api` — NestJS modules, Prisma, Redis, BullMQ and API conventions.
- `apps/web` — Next.js App Router storefront shell.
- `packages` — place reusable contracts, UI, and config packages here as the product grows.

## Architecture principles

- Domain modules own their controllers, services, DTOs and policies.
- Prisma is the database boundary; migrations are version-controlled schema changes.
- Redis backs queues, caching, rate limits and ephemeral state—not the source of truth.
- Controllers return a uniform response envelope and global exception handling prevents leaking internals.
- Environment variables are validated at boot, so invalid deploys fail early.
