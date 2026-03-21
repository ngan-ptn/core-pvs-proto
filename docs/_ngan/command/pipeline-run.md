---
description: Run the full CorePVS pipeline (Steps 1-5) and output the 6 required deliverables
argument-hint: [WORKFLOW="Prescription"] [REFERENCE="paste notes or link"] [COMPLIANCE_INVENTORY="paste JSON or point to file"] [SCOPE_NOTES="optional constraints"]
---

Execute the full CorePVS design pipeline for `$WORKFLOW`.

Inputs:
1. Reference audit input:
$REFERENCE

2. Compliance inventory:
$COMPLIANCE_INVENTORY

Run these steps in order:
1. Audit Flow
2. Convert to Structured Spec
3. Compliance Gap Engine
4. Finalize UX
5. Prototype Spec

Core principle:
- Do not jump from compliance obligations directly into screens.
- Start from a real reference workflow, formalize it into a behavior spec, then layer compliance on top.

Golden rule:
"Flow defines system. Compliance constrains system."

Output format (exact order):
1. Flow (bullet)
2. YAML spec
3. Coverage matrix
4. Gap table
5. Final flow
6. UI structure

If you want to turn these outputs into "official" docs, use:
- `docs/_ngan/command/reshape-artifact.md`

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
