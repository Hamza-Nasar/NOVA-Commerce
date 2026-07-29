# NOVA Commerce

Production-minded e-commerce foundation: a Next.js storefront and NestJS API in a pnpm workspace.

## Current status

Milestone 1 and Milestone 2 foundation work is implemented.

- Milestone 1: monorepo architecture, NestJS API foundation, Next.js App Router foundation, Prisma/PostgreSQL, Redis/BullMQ, Docker local services, config validation, global validation, exception handling, and response envelope.
- Milestone 2: authentication, authorization foundation, user profile management, address management, frontend auth pages, protected routes, API client layer, and Zustand auth/session/user stores.

Future business domains such as products, catalog search, cart, checkout, payments, orders, inventory, admin CMS, analytics, and notifications are intentionally not implemented yet.

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

## Milestone 2 auth scope

Backend foundation:

- Register, login, logout, refresh token, forgot password placeholder, reset password placeholder, and current-user endpoint.
- JWT access tokens with refresh-token persistence and rotation.
- Password hashing with bcrypt.
- RBAC foundation with role enum, roles decorator, roles guard, and JWT guard.
- User profile and address APIs.

Frontend foundation:

- Login, register, forgot password, reset password, profile, profile settings, and address pages.
- Protected route handling for authenticated customer areas.
- API client with access-token handling and refresh retry support.
- Zustand stores for auth, user, session, and UI state.

## Architecture principles

- Domain modules own their controllers, services, DTOs and policies.
- Prisma is the database boundary; migrations are version-controlled schema changes.
- Redis backs queues, caching, rate limits and ephemeral state—not the source of truth.
- Controllers return a uniform response envelope and global exception handling prevents leaking internals.
- Environment variables are validated at boot, so invalid deploys fail early.

## Validation

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter @nova/api prisma:deploy
```

Milestone 2 QA helpers:

```bash
powershell -ExecutionPolicy Bypass -File tools/verify-auth-smoke.ps1
node tools/browser-qa-milestone2.mjs
```
