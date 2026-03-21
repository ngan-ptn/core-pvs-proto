# Design Decisions Log

Track UI/UX design decisions that involve trade-offs, multiple valid approaches, or extensions/pushback on requirements.

**Rules:**
- Entries are append-only. Never delete or modify past entries.
- Number sequentially: DD-001, DD-002, etc. Read the file to find the next number before appending.
- A reconciliation entry may result in new design decision entries. Cross-reference them.

---

## DD-001: [Example] Default date format for form inputs

**Triggered by:** [link to bug/feature/user story]
**Matched by:** [link to ADR/API spec/implementation]
**Confirmed by:** [author of change/commit], [date]

**Requirement said:** Use ISO 8601 date format (YYYY-MM-DD) for all date inputs.

**Design decision:** Use locale-aware date format with ISO 8601 stored internally. Display adapts to user's locale setting while the API layer always sends ISO 8601.

**Rationale:** Users in different regions expect familiar date formats. Forcing ISO 8601 in the UI caused confusion in usability testing. Storing ISO internally keeps the API contract clean.

**What was added beyond requirements:** Locale detection from browser settings with a manual override in user preferences.

**Trade-off:** Added complexity in the date picker component. Two formats to maintain (display vs. storage). Edge cases around locale detection in SSR.

**Pushback expected:** PM may question the added complexity. Counter: usability testing showed 40% fewer date entry errors with locale-aware formatting.

---

<!-- Append new entries below this line -->

## DD-002: Scope the UX checklist as a derivative review aid

**Triggered by:** User request to review guideline conflicts, remove duplication, and rename the checklist file
**Matched by:** `docs/guidelines/ux-checklist.md`, `docs/product-context/product-context.md`, `docs/guidelines/ui-layout-patterns.md`, `docs/guidelines/dashboard-design-patterns.md`, `docs/guidelines/copy-guideline.md`
**Confirmed by:** Codex, 2026-03-21

**Requirement said:** The checklist should help review UX quality without conflicting with other guidance.

**Design decision:** Keep the checklist as a lightweight review tool derived from canonical UX guidance. Scope it to high-frequency workflow review, explicitly reference dashboard, layout, and copy guidelines, and remove absolute rules that clash with screen-specific patterns.

**Rationale:** The previous file duplicated product-context principles and added universal rules such as hard click/time targets, blanket no-scroll expectations, and broad anti-card language. Those rules created avoidable conflict with dashboard and layout guidance. A derivative checklist is easier to maintain and less likely to drift from the canonical docs.

**What was added beyond requirements:** Explicit scope boundaries for workflow, dashboard, and long-history screens, plus cross-links to the canonical source files.

**Trade-off:** The checklist is less self-contained than before because reviewers must consult the linked canonical documents for details and exceptions.

**Pushback expected:** Some readers may prefer one all-in-one checklist. Counter: a smaller checklist reduces drift and avoids forcing dashboard rules onto workflow screens or workflow rules onto dashboards.

---

## DD-003: Use an editorial, high-contrast shell for the doc reader

**Triggered by:** User request to change the doc-reader HTML visual style to match Braintrust
**Matched by:** `docs/doc-reader/build.mjs`, `docs/doc-reader/navigation.test.mjs`, `docs/artifacts/design-pipeline.html`
**Confirmed by:** Codex, 2026-03-21

**Requirement said:** Change the generated HTML visual style to the Braintrust direction.

**Design decision:** Reframe the doc reader as an editorial document surface with a bright paper background, strong black typography, cobalt accent color, mono utility labels, and thin framed panels rather than continuing the previous muted teal app-shell styling.

**Rationale:** The doc reader is used to browse design and product artifacts, not to mimic the eventual product UI. An editorial shell makes long-form artifacts feel intentional, improves scanability, and creates a clearer separation between the reading tool and the product design system itself.

**What was added beyond requirements:** A full tokenized visual language for the generated HTML, including type pairing, layered page background treatment, sidebar/topbar framing, and adjusted content component styling for tables, callouts, code blocks, and the table of contents.

**Trade-off:** The reader now has a stronger branded point of view and is less visually neutral. It also introduces a remote font dependency for the generated static HTML.

**Pushback expected:** Some readers may prefer a plain documentation skin. Counter: this tool is a presentation layer for internal artifacts, and the stronger editorial treatment improves perceived hierarchy and makes the artifact browser easier to navigate.

---

## DD-004: Restore the subdued app-shell theme for the doc reader

**Triggered by:** User request to revert the doc-reader HTML back to its previous style
**Matched by:** `docs/doc-reader/build.mjs`, `docs/doc-reader/navigation.test.mjs`
**Confirmed by:** Codex, 2026-03-21

**Requirement said:** Revert the Braintrust-inspired visual treatment to the earlier doc-reader style.

**Design decision:** Restore the darker application-shell presentation with muted teal accents, monospaced utility labels, and a calmer document frame instead of keeping the brighter editorial presentation.

**Rationale:** The request explicitly preferred the prior reading experience. The darker shell keeps the reader in a utilitarian tool posture and better separates navigation chrome from the embedded document content without imposing a strong editorial identity.

**What was added beyond requirements:** Regression coverage was updated to assert the restored app-shell tokens so the Braintrust palette does not silently return.

**Trade-off:** The reader becomes less visually distinctive and slightly less airy than the editorial variant, but it is closer to the earlier local workflow and user expectation.

**Pushback expected:** Someone may still prefer the stronger visual identity from DD-003. Counter: the reading tool should follow the current team preference, and the revert keeps the document browser visually quieter.

---

## DD-005: Restore the original light doc-reader skin (reference index.html)

**Triggered by:** User provided a reference doc-reader `index.html` to match
**Matched by:** `docs/doc-reader/build.mjs`, `docs/doc-reader/navigation.test.mjs`
**Confirmed by:** Codex, 2026-03-21

**Requirement said:** Revert the doc-reader HTML visual style to the previous style from `C:\Users\phamn\Downloads\doc-reader\doc-reader\index.html`.

**Design decision:** Use the original light, minimal doc-reader skin (Inter body text, JetBrains Mono UI labels, pale background, steel/teal link color) rather than the darker app-like chrome.

**Rationale:** This restores the familiar artifact browsing experience and aligns the generated output with the established local reference that the team has been using.

**Trade-off:** The chrome is less “app-like” and has fewer affordances for dense navigation, but is calmer and closer to the legacy workflow.
