# core-pvs-proto

A monorepo prototype for the PVS (Praxisverwaltungssystem — Practice Management System) built with React, Vite, and SQLite. Serves a chain of clinics connected to a hospital management system.

## Structure

```
apps/
  event-demo/     # Event-focused variant (port 5173)
  main-app/       # Primary application (port 5174)
packages/
  db/             # Database layer — 26 tables, 3 views, migrations, seed data
  shared/         # Shared utilities — search engine (fuse.js), i18n
e2e/              # Playwright end-to-end tests
data/             # SQLite data directory (gitignored)
docs/
  product-context/  # Domain glossary, product requirements
  guidelines/       # Copy, naming, visual rules
  compliances/      # Compliance workflows, gap analysis, screen mappings
AGENTS.md         # AI agent rules for working in this codebase
```

## Tech Stack

- **Runtime**: Node.js ≥18, pnpm ≥8
- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Radix UI, Lucide icons
- **Database**: better-sqlite3 (WAL mode, FK constraints, 26 tables + 3 views)
- **Search**: fuse.js (fuzzy search with German umlaut normalization)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Build**: TypeScript 5.3, tsup (packages), Vite (apps)
- **UI**: `@tini/ui` + `@tini/tokens` design system

## Getting Started

```bash
# Install dependencies
pnpm install

# Initialize database and seed demo data
pnpm db:migrate
pnpm db:seed

# Generate search index for command palette
pnpm db:search-index

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
| `pnpm db:seed` | Seed database with 25 demo patients, 7 users, 3 practices |
| `pnpm db:search-index` | Extract search index JSON for both apps |
| `pnpm db:reset` | Delete DB and re-run migrations |

## Database

SQLite database stored at `data/pvs.db`, shared by both apps. Migrations live in `packages/db/src/migrations/` as numbered SQL files (001–010).

**Schema overview (26 tables + 3 views):**
- **Organization**: `organization` → `practice` (clinic chain hierarchy)
- **Users**: `user` ↔ `practice` (M:N via `user_practice`, role per practice)
- **Patient core**: `patient`, `address`, `patient_contact`, `patient_consent`, `patient_history`, `patient_note`
- **Insurance**: `insurance_provider`, `patient_insurance`
- **Clinical**: `treatment_case` (Schein), `encounter`, `diagnosis`, `vital_signs`
- **Orders**: `medication`, `prescription`, `lab_order`, `imaging_order`
- **Documents**: `document`, `doctor_letter` (Arztbrief)
- **Referral**: `referral` (bidirectional — incoming + outgoing)
- **Phase 2 skeletons**: `encounter_service` (GOP), `encounter_note` (SOAP)
- **Infra**: `audit_log`, views: `patient_timeline`, `v_patient_search`, `v_medication_search`

```bash
pnpm db:migrate       # Apply pending migrations
pnpm db:seed          # Seed with demo data
pnpm db:search-index  # Extract search JSON to apps/*/public/
pnpm db:reset         # Drop and recreate from scratch
```

## Testing

```bash
pnpm test         # Unit tests (vitest, single pass)
pnpm test:watch   # Unit tests (watch mode)
pnpm test:e2e     # E2E tests (playwright, requires dev servers)
```

Unit tests use jsdom for React components and Node.js for the database package. Vitest is configured with 4 max workers and 30s timeouts.
