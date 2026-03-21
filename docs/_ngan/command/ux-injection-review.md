---
description: Review compliance gaps and choose the right UX injection surface (inline/banner/modal/read-only/status)
argument-hint: [WORKFLOW="Prescription"] [GAPS="paste gap table"] [SCOPE_NOTES="optional constraints"]
---

Review the compliance gaps for `$WORKFLOW` and recommend the correct UX injection pattern for each gap.

Inputs:
- Workflow: $WORKFLOW
- Gap table and context: $GAPS
- Scope notes (optional): $SCOPE_NOTES

Allowed UX surfaces (choose one per gap):
- inline validation
- warning banner
- blocking modal
- read-only state
- status indicator

Rules:
- Prefer inline over modal.
- Block only for legal/safety-critical.
- Do not invent new product features.
- Keep workflow-first.

Output format (table):
| Gap | Recommended UX surface | Reason | System behavior | Placement / trigger point |
|-----|-------------------------|--------|-----------------|---------------------------|

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
