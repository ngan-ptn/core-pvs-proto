---
description: Pipeline Step 4 - finalize the CorePVS UX (final flow + screen definitions + states)
argument-hint: [WORKFLOW="Prescription"] [INPUT="paste Step 1-3 outputs"] [SCOPE_NOTES="optional constraints"]
---

You are executing **Step 4 (Finalize UX)** of the CorePVS design pipeline.

Task:
Finalize the CorePVS UX for `$WORKFLOW` using:
- audited flow (Step 1)
- structured spec (Step 2)
- compliance gap overlay (Step 3)

Inputs:
- Workflow: $WORKFLOW
- Step 1-3 inputs: $INPUT
- Scope notes (optional): $SCOPE_NOTES

Instructions:
- Optimize for:
  - speed
  - clarity
  - density
- Keep workflow-first: compliance constrains, it does not invent the workflow.
- Define key UI states per screen:
  - empty
  - loading
  - error
  - populated
  - relevant compliance states (if any)
- Call out any non-obvious UX trade-offs as explicit decisions.

Output format:
1. Final flow (bullet list)
2. Screen definitions
3. State model (per screen)
4. Key UX decisions (short)

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
