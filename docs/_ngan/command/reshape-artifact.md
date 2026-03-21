---
description: Reshape pipeline outputs into official docs using repo templates (flows/screens/interactions/compliance)
argument-hint: [WORKFLOW="Prescription"] [SLUG="prescription-flow"] [PIPELINE_OUTPUT="paste output package"] [OUTPUT_DIR="docs/discover"] [OWNER="Ngan"] [SURFACES="Desktop"] [SCOPE_NOTES="optional constraints"]
---

You are converting a CorePVS pipeline output package into "official" docs using this repo's templates.

Inputs:
- Workflow name: $WORKFLOW
- Slug (kebab-case, 2-4 words, max 30 chars): $SLUG
- Pipeline output package (from Step 4-5 or pipeline-run):
$PIPELINE_OUTPUT

Recommendations (naming + output directory):
- Default output directory for shared, "official" docs: `docs/discover/`.
- Use `docs/_ngan/` only for personal drafts, scratch work, or garrioPRO-specific notes.
- Prefer creating per-workflow artifacts for new product areas instead of appending to existing system-specific docs.
  - Example: the current `docs/discover/user-flows.md`, `screen-specs.md`, `interaction-specs.md`, and `component-inventory.md` are for "Clinic Check-In System" and should not be mixed with unrelated workflows.

Rules:
- Keep updates additive by default. Do not delete existing content unless explicitly asked.
- Workflow-first. Compliance is an overlay. Do not invent features from obligations.
- If you include any compliance obligation text, copy it verbatim from the inventory.

Decide the publishing mode:
- If there is an existing official doc set for this exact product area, append new sections there.
- Otherwise, create per-workflow artifact docs using the naming convention:
  - `FLOW[YYMMDD]-$SLUG.md`
  - `SCRN[YYMMDD]-$SLUG.md`
  - `FEAT[YYMMDD]-$SLUG-interactions.md`
  - `DATA[YYMMDD]-$SLUG-compliance-gap.md`
  - (Optional) `DATA[YYMMDD]-$SLUG-component-inventory.md`

Output location:
- Write the created/updated docs into: $OUTPUT_DIR (default `docs/discover`).

Tasks:

1) User flow doc (FLOW)
- Create (or update) `FLOW[YYMMDD]-$SLUG.md` in $OUTPUT_DIR using `docs/templates/user-flows.md`.
- Populate:
  - Document Scope (include $WORKFLOW, $SURFACES, $OWNER, today's date)
  - Flow section with:
    - Trace table (Traced from: reference flow + compliance inventory refs; Proven by: pipeline artifact)
    - Trigger, preconditions, main path, alternate paths, failure/recovery, postconditions, success signals
    - A flow diagram (Mermaid `flowchart TD` preferred; text diagram acceptable if clearer)
    - Related artifacts links to the SCRN/FEAT/DATA docs you generate

2) Screen specs doc (SCRN)
- Create (or update) `SCRN[YYMMDD]-$SLUG.md` in $OUTPUT_DIR using `docs/templates/screen-specs.md`.
- For each screen from the UI structure:
  - Purpose
  - Entry points
  - Layout + persistent regions
  - Regions table
  - Data/dependencies
  - Primary actions
  - States table (include compliance states where relevant)
  - Notes with links to related interaction specs sections

3) Interaction specs doc (FEAT, interactions)
- Create (or update) `FEAT[YYMMDD]-$SLUG-interactions.md` in $OUTPUT_DIR using `docs/templates/interaction-specs.md`.
- Include only the interactions that are non-trivial:
  - compliance gates (warn/block/confirm)
  - async submissions
  - degraded mode
  - timeouts/session behavior
  - validation rules with recovery
- Cross-link back to the relevant screens and flow sections.

4) Compliance gap doc (DATA)
- Create `DATA[YYMMDD]-$SLUG-compliance-gap.md` in $OUTPUT_DIR.
- Include:
  - Coverage matrix (obligation ID, trigger point, coverage status, notes, UX surface, behavior)
  - Gap table (what is missing/partial + insertion point in the flow/screen + severity)
- Prefer referencing obligations by ID + link to the inventory; only paste full obligation text when necessary, and then verbatim.

5) Component inventory (optional)
- If the UI structure introduced reusable components not already documented:
  - Create `DATA[YYMMDD]-$SLUG-component-inventory.md` in $OUTPUT_DIR using `docs/templates/component-inventory.md`.
  - Prefer design-system components (`@tini/ui`, `@tini/tokens`) where applicable.

Final requirement:
- Add a short "Related Artifacts" section at the end of each doc listing the other generated docs, so the set is navigable.

Workflow: $WORKFLOW
Slug: $SLUG
Owner: $OWNER
Surfaces: $SURFACES
Output dir: $OUTPUT_DIR
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
