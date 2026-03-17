# Agent Rules

Rules for AI agents working in the CorePVS codebase.

---

## App Scope

- **App isolation.** Each app (`apps/main-app/`, `apps/event-demo/`) is standalone. Only modify the app the user is currently working on. If the user does not explicitly tell you to modify both apps, implement only for the current app — or ask which app to modify.

## Design System

- **tini-library first.** Prioritize tokens and UI components from `@tini/tokens` and `@tini/ui`. If a needed UI component is not available in tini-library, report back to the user before building a custom one.
- **No direct Radix UI.** Import from `@tini/ui`, not from `@radix-ui/`* directly. Radix is an implementation detail of the design system.

## Internationalization

- **i18n required.** All user-facing strings must use `react-i18next` translation keys — never hardcode text in components. Use namespace conventions: `common:` and `medical:` from `@pvs/shared`, `app:` for app-specific strings.
- **Date/number formatting.** Always use the shared Intl-based formatters from `@pvs/shared` (`formatDate`, `formatTime`, `formatNumber`). Dates and numbers always use `de-DE` locale regardless of UI language, per copy guidelines.
- **Translation coverage.** When adding a new feature, add translation keys for both `en` and `de` locales. Never leave a locale file incomplete.

## Development Process

- **TDD.** Always apply test-driven development: write the test first, watch it fail, then write the minimal code to pass.
- **Testing layers.** Unit tests: Vitest (`jsdom` for React components, `node` for packages). E2E tests: Playwright in `e2e/`. Run `pnpm test` to verify before claiming work is complete.

## Codebase Knowledge

- **Read product context.** Before any implementation, read the product context in `docs/product-context/`. Optionally read the guidelines in `docs/guidelines/`.
- **Domain language.** Use `docs/product-context/domain-glossary.md` for consistent terminology. Follow `docs/guidelines/copy-guideline.md` for UI text (voice, tone, date formats, medical terms).

## Architecture

- **Monorepo awareness.** Workspace layout: `apps/`*, `packages/*`, `e2e/`, `docs/`. Shared logic belongs in `@pvs/shared`. Database logic belongs in `@pvs/db`. Do not duplicate code across apps.
- **Package boundaries.** Dependency direction: `apps → packages`, `apps → @tini/`*. No cross-app imports. Packages must not import from apps.
- **Database conventions.** Use `openMemoryDatabase()` for tests. Migrations are numbered SQL files in `packages/db/src/migrations/`. Never modify an existing migration file — always create a new one.

## Workflow

- **Naming conventions.** When generating new `.md` files or documents, strictly follow `docs/guidelines/naming-conventions.md`.
- **Git conventions.** Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `test:`. Create feature branches from `main` with descriptive names (`feat/...`, `fix/...`).

