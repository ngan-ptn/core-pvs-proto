# Reconciliation Log

Track when upstream changes (bug fixes, new features, architecture shifts) force re-evaluation of existing design artifacts.

**Rules:**
- Entries are append-only. Never delete or modify past entries.
- Number sequentially: Entry 1, Entry 2, etc. Read the file to find the next number before appending.
- A reconciliation entry may result in new design decision entries. Cross-reference using DD-NNN references.

---

## Entry 1: [Example] Navigation restructure after role-based access control added

**Date:** 2026-03-18
**Change:** RBAC introduced at the API layer, restricting endpoints by user role.

**Impact on Design:**
- Sidebar navigation must hide items the user cannot access
- Empty states needed for pages a user can see but not interact with
- Admin-only settings panel requires a new layout variant

**Items reevaluated:**
- `docs/design/navigation-flow.md` — updated to include role-conditional items
- `docs/design/settings-panel.md` — added admin-only variant
- `docs/design/empty-states.md` — added "insufficient permissions" empty state

**Result:** Navigation and settings designs updated to respect RBAC. New design decision created (see DD-NNN) for the "insufficient permissions" empty state pattern.

**Assessed by:** [author of change/commit], [date]

---

<!-- Append new entries below this line -->

## Entry 2: UX checklist narrowed, deduplicated, and renamed

**Date:** 2026-03-21
**Change:** The UX checklist was rewritten to remove duplicated canonical guidance, align with screen-specific rules, and renamed from `ux-design-principles-checklist.md` to `ux-checklist.md`.

**Impact on Design:**
- The checklist now acts as a review aid instead of a competing source of truth
- Workflow, dashboard, and long-history screens are treated as different screen types with different layout expectations
- Absolute pass/fail rules that conflicted with canonical guidance were replaced by benchmark- and context-based review checks

**Items reevaluated:**
- `docs/guidelines/ux-design-principles-checklist.md` -> renamed and rewritten as `docs/guidelines/ux-checklist.md`
- `docs/product-context/product-context.md` -> reviewed as the canonical source for UX axes and principles
- `docs/guidelines/ui-layout-patterns.md` -> reviewed for layout, density, and scrolling exceptions
- `docs/guidelines/dashboard-design-patterns.md` -> reviewed for dashboard-specific card, drill-down, and status rules
- `docs/guidelines/copy-guideline.md` -> reviewed for clarity, tone, and scanability alignment

**Result:** The checklist now stays in English, points back to the canonical principles, and no longer imposes universal no-scroll, no-card, or fixed click/time rules across all screen types. Related design decision recorded in DD-002.

**Assessed by:** Codex, 2026-03-21

---

## Entry 3: Doc reader visual shell shifted to an editorial artifact browser

**Date:** 2026-03-21
**Change:** The generated doc-reader HTML was restyled around a Braintrust-inspired editorial visual system rather than the previous subdued application-style shell.

**Impact on Design:**
- The artifact browser now presents documentation as a curated reading surface instead of a generic utility page
- Visual hierarchy changed across the top bar, sidebar, section navigation, table of contents, and content cards
- Embedded HTML and Markdown artifacts are now framed by a stronger neutral-and-cobalt shell that is intentionally separate from the CorePVS product UI

**Items reevaluated:**
- `docs/doc-reader/build.mjs` -> updated generated CSS tokens, layout framing, component surfaces, and typography
- `docs/doc-reader/navigation.test.mjs` -> added regression coverage for the new visual tokens and font imports
- `docs/artifacts/design-pipeline.html` -> reviewed in the generated reader to confirm the new shell supports artifact presentation

**Result:** The doc reader now behaves more like an editorial artifact browser, with stronger contrast, clearer hierarchy, and a more distinctive visual identity. Related design decision recorded in DD-003.

**Assessed by:** Codex, 2026-03-21

---

## Entry 4: Doc reader shell reverted from editorial styling to the previous app-like chrome

**Date:** 2026-03-21
**Change:** The generated doc-reader HTML was reverted from the Braintrust-inspired editorial styling back to the previous darker application-style shell.

**Impact on Design:**
- The artifact browser returns to a quieter, tool-like frame rather than a branded editorial surface
- Sidebar, top bar, toggle controls, and the TOC now use muted teal-on-slate styling again
- The content surface remains readable, but the surrounding chrome no longer competes with the embedded artifacts

**Items reevaluated:**
- `docs/doc-reader/build.mjs` -> restored the darker shell palette and component styling
- `docs/doc-reader/navigation.test.mjs` -> replaced the Braintrust token assertions with restored app-shell assertions

**Result:** The reader now matches the earlier local visual direction again. Related design decision recorded in DD-004.

**Assessed by:** Codex, 2026-03-21

---

## Entry 5: Doc reader styling restored to the original light reference skin

**Date:** 2026-03-21
**Change:** The generated doc-reader HTML skin was updated to match the local reference `C:\Users\phamn\Downloads\doc-reader\doc-reader\index.html`.

**Impact on Design:**
- Restores the lighter Inter + JetBrains Mono styling, with pale background and minimal chrome
- Sidebar header label returns to `Documents` and the overall layout matches the reference artifact browser

**Items reevaluated:**
- `docs/doc-reader/build.mjs` -> updated the generated CSS and sidebar header label to match the reference output
- `docs/doc-reader/navigation.test.mjs` -> updated style assertions and the sidebar label expectation

**Result:** The doc reader now visually matches the established reference file again (see DD-005).

**Assessed by:** Codex, 2026-03-21
