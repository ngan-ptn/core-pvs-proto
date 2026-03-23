# Changelog

## 2026-03-23

- Expand social listening synthesis into a full workflow opportunity matrix (8 workflows with user roles, failure costs, compliance pressure, UX opportunities, and prototype priorities); add three appendices covering Germany/EU signal highlights, pain cluster synthesis, and messaging/product checklist; retire the earlier flat synthesis file
- Add prescription audit screenshot set for AUDIT260322 (10 surfaces), built from a static local reconstruction harness after the live environment required login and the fallback stack was blocked by private Docker images; provenance labelled per screen (repo-derived vs. reconstructed)
- Add active design decisions log (`docs/design-decisions.md`) and reconciliation log (`docs/reconciliation-log.md`) as working files separate from the template files
- Add `flow-screen-interaction` artifact template covering Home flow design with screen list, navigation diagram, wireframes, and element state tables
- Add second prescription screenshot set for AUDIT260322 (`Higher fidelity` direction) — same S001–S009 coverage but reworked to follow `pvs-base-1` shell structure, component grouping, locale copy, and ERezept table/action patterns more closely; kept separate from the original coverage-first set for side-by-side comparison

## 2026-03-20

- Reorganize patient check-in compliance docs into `docs/compliances/1-patient-checkin/` subdirectory for better structure as compliance coverage grows
- Add master compliance workflow (`FLOW260320`) — user stories & acceptance criteria extracted from 604 compliance obligations
- Add 3 new artifact codes to naming conventions: AUDIT (System Audit), SCRN (Screen Specification), WIRE (Wireframe)
- Extract compliance inventory into separate Flows and Screen inventory artifacts

## 2026-03-17

- Add complete PVS database schema (26 tables + 3 views across 10 migrations)
- Add seed script with 25 demo patients, 7 users, 3 practices, realistic German medical data
- Add search infrastructure: fuse.js-based fuzzy search with umlaut normalization
- Add search index extraction to JSON for command palette integration
- Add AGENTS.md with AI agent rules (app isolation, design system, TDD, architecture, workflow)
- Add i18n infrastructure: react-i18next with config factory pattern, EN+DE locales
- Add shared formatters (date/time/number) using Intl API with de-DE locale
- Add LanguageSwitcher and PaginationWrapped components to both apps
- Add CI workflow for i18n completeness check on PR

## 2026-03-13

- Add README with repo overview, setup instructions, and available scripts
