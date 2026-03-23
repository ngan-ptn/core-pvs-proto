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
- `docs/discover/design-pipeline.html` -> reviewed in the generated reader to confirm the new shell supports artifact presentation

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

---

## Entry 6: Doc reader architecture rewritten for section source types and theme switching

**Date:** 2026-03-22
**Change:** The doc-reader build system was refactored from a single monolithic script into modular components and now uses a strict section source model (`file` / `files` / `folder`) plus manifest-driven theme selection.

**Impact on Design:**
- Left navigation behavior is now deterministic: single file renders as a direct item, while `files` and `folder` render as expandable sections
- Visual style became configurable through `render-list.json` (`theme`) without code-level CSS rewrites
- Styling tokens were split into reusable base styles and theme-specific layers

**Items reevaluated:**
- `docs/doc-reader/render-list.json` -> migrated to `theme` and `file/files/folder` schema
- `docs/doc-reader/README.md` -> updated usage and schema guidance
- `docs/doc-reader/build.mjs` -> rewritten as modular entrypoint
- `docs/doc-reader/src/manifest.mjs` -> added manifest validation and source-type rules
- `docs/doc-reader/src/file-resolver.mjs` -> added deterministic source resolution for file list and folder modes
- `docs/doc-reader/src/document-loader.mjs` -> centralized document loading and screenshot embedding
- `docs/doc-reader/src/template.mjs` -> centralized HTML assembly and runtime injection
- `docs/doc-reader/src/runtime.js` -> isolated client navigation/render interactions
- `docs/doc-reader/themes/base.css` -> shared UI primitives
- `docs/doc-reader/themes/classic.css` and `docs/doc-reader/themes/shell.css` -> fast-switch theme token sets
- `docs/doc-reader/render-list.test.mjs` and `docs/doc-reader/navigation.test.mjs` -> updated tests to assert the new schema and nav behavior

**Result:** The reader now supports fast style changes and clearer section semantics while keeping the same core reading features. Related design decision recorded in DD-006.

**Assessed by:** Codex, 2026-03-22

---

## Entry 7: Doc reader left-navigation selected state inset aligned with sidebar chrome

**Date:** 2026-03-22
**Change:** The selected state for left-navigation document items was updated to keep a 16px inset on both sides instead of stretching edge-to-edge across the sidebar.

**Impact on Design:**
- Active document rows now align visually with the sidebar's existing inner spacing
- Selected-state highlight feels less heavy and more consistent with the rounded, inset control treatment used elsewhere in the reader chrome

**Items reevaluated:**
- `docs/doc-reader/themes/base.css` -> updated active nav item layout to add horizontal inset
- `docs/doc-reader/navigation.test.mjs` -> added regression coverage for the selected-state inset
- `docs/doc-reader/index.html` -> rebuilt to reflect the updated navigation spacing

**Result:** The left navigation now keeps 16px breathing room around selected items while preserving the existing text padding and active styling.

**Assessed by:** Codex, 2026-03-22

---

## Entry 9: Design pipeline artifact updated to the v3.1 workflow-stage model

**Date:** 2026-03-22
**Change:** The standalone artifact `docs/discover/design-pipeline.html` was updated to match the newer `docs/discover/design-pipeline.md` structure and no longer presents the process as a two-phase progress board.

**Impact on Design:**
- The top bar now carries the summary metrics that previously lived in the hero header
- The hero/header section was removed so the artifact opens directly on the process model
- The main pipeline now shows the five repeatable workflow stages from the markdown source
- The lower board now uses pipeline states (`Audit`, `Spec`, `Gap`, `Design`, `Proto`) instead of generic progress statuses

**Items reevaluated:**
- `docs/discover/design-pipeline.md` -> reviewed as the source of truth for the v3.1 process definition
- `docs/discover/design-pipeline.html` -> updated structure, copy, and visual grouping to match the v3.1 workflow-stage model

**Result:** The artifact now reads as a canonical process reference centered on workflow-first design and compliance layering, rather than a snapshot of project completion status. Related design decision recorded in DD-008.

**Assessed by:** Codex, 2026-03-22

---

## Entry 10: Workflow dependency chain added to workflow diagrams to drive dependency-minimizing roadmap

**Date:** 2026-03-22
**Change:** The workflow-diagrams artifact was updated to include a workflow-level dependency chain and a proposed workflow-based design sequence to reduce design coupling and rework.

**Impact on Design:**
- Makes cross-workflow coupling explicit (patient context → patient hub → Schein/billing → downstream flows)
- Enables roadmap planning at the workflow milestone level while preserving the existing screen-level foundation chain
- Highlights which workflows can be designed in parallel vs. which must follow shared hub surfaces

**Items reevaluated:**
- `docs/_ngan/templates/design-roadmap.md` -> reviewed as the source for Tier 1–5 sequencing intent
- `docs/_ngan/templates/FLOW260318-user-workflow-diagram.md` -> updated section 15 with workflow dependencies + proposed order

**Result:** The diagrams doc now includes a workflow dependency graph plus a dependency-minimizing workflow-based roadmap that can guide design sequencing beyond screen-by-screen lists.

**Assessed by:** Codex, 2026-03-22

---

## Entry 8: Prescription artifacts reconciled from audited split flow to unified workspace target

**Date:** 2026-03-22
**Change:** The audited `pvs-base-1` prescription experience was translated into new CorePVS design artifacts that intentionally unify medication authoring with E-Rezept bundle, sign/send, and status handling in one workspace.

**Impact on Design:**
- The target design no longer treats ERP lifecycle steps as a detached technical branch after save or print
- Flow, screen, and wireframe artifacts now model bundle preparation, signing, sending, and post-send status as states within the same prescribing surface
- The proposed UX introduces a persistent right rail for readiness and lifecycle state, plus a sticky action bar that changes primary CTA by state

**Items reevaluated:**
- `docs/artifacts/AUDIT260322-prescription-pvs-base.md` -> reviewed as the as-is reference baseline
- `docs/_ngan/2-prescription/corepvs-prescription-master-spec.md` -> reviewed for prior one-screen prescription workstation direction
- `docs/_ngan/2-prescription/corepvs-prescription-wireframe.md` -> reviewed for prior layout direction
- `docs/artifacts/FLOW260322-prescription-unified-workspace.md` -> added unified target flow
- `docs/artifacts/SCRN260322-prescription-unified-workspace.md` -> added unified screen and state spec
- `docs/artifacts/WIRE260322-prescription-unified-workspace.md` -> added unified wireframe artifact

**Result:** CorePVS now has a concrete target artifact set for a seamless prescription workspace that closes the gap between the audited split workflow and the intended doctor-facing experience. Related design decision recorded in DD-007.

**Assessed by:** Codex, 2026-03-22

---

## Entry 11: Design pipeline board aligned to workflow index and current audit completion

**Date:** 2026-03-23
**Change:** The workflow cards in `docs/discover/design-pipeline.html` were updated to use the real workflow list from `docs/artifacts/FLOW260322-master-user-workflow.md` instead of generic placeholder stage cards.

**Impact on Design:**
- The board now reflects the actual workflow inventory rather than abstract example cards
- `WF-1` and `WF-6` now appear in `Spec` because their audit artifacts exist
- All remaining workflows stay in `Audit`, making the board a concrete workflow tracking surface inside the stage-based pipeline model

**Items reevaluated:**
- `docs/artifacts/FLOW260322-master-user-workflow.md` -> reviewed as the source of truth for workflow names, roles, and audit completion
- `docs/discover/design-pipeline.html` -> updated Kanban card content and column counts to match current workflow status

**Result:** The design-pipeline artifact still follows the workflow-stage framing from DD-008, but now shows the real workflow backlog and which workflows have cleared audit.

**Assessed by:** Codex, 2026-03-23

---

## Entry 12: Design pipeline header stats aligned to real pipeline-state counts

**Date:** 2026-03-23
**Change:** The top header stats in `docs/discover/design-pipeline.html` were changed from generic artifact summary blocks to the five actual pipeline-state counts shown by the Kanban board.

**Impact on Design:**
- The header now summarizes the current workflow backlog by stage rather than the abstract pipeline model
- The top row and the board now communicate the same operational snapshot
- The page is easier to scan because stage counts are visible before the user reaches the Kanban section

**Items reevaluated:**
- `docs/discover/design-pipeline.html` -> updated top-bar stat blocks to `Audit`, `Spec`, `Gap`, `Design`, and `Proto`

**Result:** The header now matches the board and reports the real current counts: `12`, `2`, `0`, `0`, `0`.

**Assessed by:** Codex, 2026-03-23

---

## Entry 13: Design pipeline board made self-synchronizing for live stage counts and equal card heights

**Date:** 2026-03-23
**Change:** `docs/discover/design-pipeline.html` was enhanced so the header stats and stage counts derive from the live Kanban DOM, and all workflow cards are normalized to the same height.

**Impact on Design:**
- The top header and column counts now stay in sync even when cards are changed live in the browser via JS or DevTools
- The board no longer depends on manually maintained count values in the markup
- Workflow cards now present as a more stable visual grid because every card adopts the tallest current card height

**Items reevaluated:**
- `docs/discover/design-pipeline.html` -> added stage mapping hooks, live DOM synchronization logic, and equal-height card behavior

**Result:** The artifact now behaves like a live operational board instead of a static mockup, while preserving the existing visual structure and workflow-stage model.

**Assessed by:** Codex, 2026-03-23

---

## Entry 14: Workflow cards returned to content-driven height while keeping live count sync

**Date:** 2026-03-23
**Change:** The equal-height card behavior in `docs/discover/design-pipeline.html` was removed so workflow cards size to their own content again, while the live header and column count synchronization remains in place.

**Impact on Design:**
- Workflow cards now read more naturally because short cards no longer carry extra empty vertical space
- The board keeps its live operational behavior for stage counts without enforcing a rigid visual grid
- Content changes inside a card no longer affect the height of every other card on the board

**Items reevaluated:**
- `docs/discover/design-pipeline.html` -> removed tallest-card height normalization and restored content-driven card sizing

**Result:** The board remains self-updating for counts, but workflow cards now use `hug contents` sizing instead of shared fixed heights.

**Assessed by:** Codex, 2026-03-23

---

## Entry 15: Workflow cards no longer grow to fill stage columns

**Date:** 2026-03-23
**Change:** The workflow card flex behavior in `docs/discover/design-pipeline.html` was corrected so cards keep their intrinsic content height instead of expanding to fill the vertical space of a stage column.

**Impact on Design:**
- Cards in shorter columns such as `Spec` now visually hug their content as intended
- Stage columns can still grow independently without forcing extra blank space inside individual cards
- The live count sync behavior remains unchanged

**Items reevaluated:**
- `docs/discover/design-pipeline.html` -> changed card flex sizing from fill behavior to content-sized behavior

**Result:** Workflow cards now behave consistently as content-sized items across all pipeline columns.

**Assessed by:** Codex, 2026-03-23

---

## Entry 16: Doc reader left-navigation label changed from document category to sort control cue

**Date:** 2026-03-23
**Change:** The left-navigation header label in `docs/doc-reader/index.html` was changed from `Documents` to `Sort by`.

**Impact on Design:**
- The sidebar header now reflects the adjacent control's actual function instead of implying the area is only a document list
- The label better matches the sorting affordance presented beside it

**Items reevaluated:**
- `docs/doc-reader/index.html` -> updated sidebar label copy

**Result:** The left navigation now communicates sorting intent more directly.

**Assessed by:** Codex, 2026-03-23
