# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

A pnpm monorepo prototype for CorePVS (Product Variant System) — a modular, certification-ready practice management system for German MVZ (multi-location medical centers). Built with React 19, Vite 6, Tailwind CSS 4, and SQLite.

## Common Commands

### Development
- `pnpm dev:event-demo` - Start event-demo app (http://localhost:5173)
- `pnpm dev:main-app` - Start main-app (http://localhost:5174)
- `pnpm install` - Install dependencies

### Build
- `pnpm build` - Build all packages and apps (order: db → shared → apps)
- `pnpm build:packages` - Build only @pvs/db and @pvs/shared packages

### Testing
- `pnpm test` - Run all unit tests (Vitest, single pass)
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm --filter @pvs/db test` - Run tests for a specific package
- `pnpm --filter event-demo test` - Run tests for a specific app
- `pnpm test:e2e` - Run Playwright e2e tests (requires dev servers running)

### Database
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:seed` - Seed database
- `pnpm db:reset` - Delete DB and re-run migrations

## Architecture

### Monorepo Structure

```
apps/
  event-demo/     # Port 5173 - Event-focused demo variant
  main-app/       # Port 5174 - Primary application
packages/
  db/             # @pvs/db - Database layer (better-sqlite3, migrations)
  shared/         # @pvs/shared - Shared utilities and components
e2e/              # Playwright end-to-end tests
data/             # SQLite database files (gitignored, created at runtime)
docs/             # Requirements, guidelines, product context, artifacts
```

### Package Dependencies

- Both apps import `@pvs/db` and `@pvs/shared` via `workspace:*`
- Packages build with `tsup` to `dist/` with TypeScript declarations
- Apps use Vite with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Build order matters**: must build packages before apps since apps depend on `dist/` outputs

### Database

- **Location**: `data/pvs.db` (SQLite with WAL mode, foreign keys enforced)
- **Package**: `@pvs/db` exports `openDatabase()`, `openMemoryDatabase()`, and `runMigrations()`
- **Migrations**: SQL files in `packages/db/src/migrations/` executed in sorted order
- **Schema tracking**: `_migrations` table tracks applied migrations

### Testing

- **Unit tests**: Vitest — `packages/db` and `packages/shared` use Node environment; `apps/*` use jsdom
- **E2E tests**: Playwright with two projects (event-demo on 5173, main-app on 5174)
- **Config**: 30s test timeout, 4 max workers, fork-based pool

### External Dependencies

The UI uses `@tini/ui` and `@tini/tokens` design system packages, linked from outside the repo via pnpm links to `../../../tini-library/packages/`. The tini-library repo must be cloned as a sibling for local development.

### TypeScript

- Target ES2022, strict mode, bundler module resolution
- `noUnusedLocals` and `noUnusedParameters` enabled

## Domain Context

CorePVS targets German MVZ (Medizinische Versorgungszentren — multi-location medical centers). Key domain concepts:
- **MFA** (Medizinische Fachangestellte) — front desk staff handling registration, billing, forms
- **Schein** — insurance record types (0101–0104) per patient per quarter
- **eGK** — electronic health card for patient identification
- **KV billing** — statutory health insurance billing via KVDT format
- UI is German-language; domain terms follow German healthcare standards

See `docs/product-context/product-context.md` for full product vision and `docs/product-context/domain-glossary.md` for terminology.

## Design Constraints

- Desktop-only (24" monitors, 1920×1080) — no responsive/mobile needed
- White-label ready with customer theming
- Traffic-light status pattern (red/yellow/green) for KPIs
- Decision support only — never auto-execute actions (legal requirement)
- External/read-only data must be visually distinct from editable data (legal requirement)

## UI Layout & Component Patterns

**Always follow `docs/guidelines/ui-layout-patterns.md`** when implementing UI. It defines the standard 3-panel layout (60px nav rail | 380px sidebar | flexible content), spacing tokens, icon sizing, tag/badge variants, table structure, schein list patterns, and component specifications extracted from Figma. Colors, typography, and button styles come from `@tini/tokens` and `@tini/ui` — the layout guide covers everything else.

## Dashboard Design Patterns

**Always follow `docs/guidelines/dashboard-design-patterns.md`** when implementing dashboard views. It defines KPI card anatomy, traffic-light status rules, chart selection (no pie charts, no 3D), heatmap patterns, comparison/benchmark display, pattern and recommendation cards, practitioner data privacy rules, data visualization color/typography/interaction standards, and dashboard-specific layout within the 3-panel structure. Designed for the Smart PVS Dashboard use case (`docs/artifacts/event-prototype-uc-2.md`).

## Documentation Conventions

Artifact files follow the naming pattern: `[CODE][YYMMDD]-[slug].md` (e.g., `FLOW260316-mobile-card-reader.md`). See `docs/guidelines/naming-conventions.md` for artifact codes and rules.
