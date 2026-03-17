# Changelog

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
