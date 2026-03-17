# core-pvs-proto

A monorepo prototype for the PVS (Product Variant System) built with React, Vite, and SQLite.

## Structure

```
apps/
  event-demo/     # Event-focused variant (port 5173)
  main-app/       # Primary application (port 5174)
packages/
  db/             # Database layer (better-sqlite3, migrations)
  shared/         # Shared utilities and components
e2e/              # Playwright end-to-end tests
data/             # SQLite data directory (gitignored)
AGENTS.md         # AI agent rules for working in this codebase
```

## Tech Stack

- **Runtime**: Node.js ≥18, pnpm ≥8
- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Radix UI, Lucide icons
- **Database**: better-sqlite3 (WAL mode, FK constraints)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Build**: TypeScript 5.3, tsup (packages), Vite (apps)
- **UI**: `@tini/ui` + `@tini/tokens` design system

## Getting Started

```bash
# Install dependencies
pnpm install

# Initialize database
pnpm db:migrate

# Start development
pnpm dev:event-demo   # http://localhost:5173
pnpm dev:main-app     # http://localhost:5174
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev:event-demo` | Start event-demo dev server |
| `pnpm dev:main-app` | Start main-app dev server |
| `pnpm build` | Build all packages and apps |
| `pnpm build:packages` | Build only db and shared packages |
| `pnpm test` | Run unit tests (all workspaces) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run Playwright e2e tests |
| `pnpm db:migrate` | Run pending database migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Delete DB and re-run migrations |

## Database

SQLite database stored at `data/pvs.db`. Migrations live in `packages/db/src/migrations/` as numbered SQL files.

```bash
pnpm db:migrate   # Apply pending migrations
pnpm db:reset     # Drop and recreate from scratch
```

## Testing

```bash
pnpm test         # Unit tests (vitest, single pass)
pnpm test:watch   # Unit tests (watch mode)
pnpm test:e2e     # E2E tests (playwright, requires dev servers)
```

Unit tests use jsdom for React components and Node.js for the database package. Vitest is configured with 4 max workers and 30s timeouts.
