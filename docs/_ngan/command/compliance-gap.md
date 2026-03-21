---
description: Pipeline Step 3 - compliance gap analysis overlay (coverage matrix + gap table + UX injections)
argument-hint: [WORKFLOW="Prescription"] [STRUCTURED_SPEC="paste YAML from Step 2"] [COMPLIANCE_INVENTORY="paste JSON or point to file"] [SCOPE_NOTES="optional constraints"]
---

You are executing **Step 3 (Compliance Gap Engine)** of the CorePVS design pipeline.

Golden rule:
"Flow defines system. Compliance constrains system."

Inputs:
1. Structured spec for `$WORKFLOW` (from Step 2):
$STRUCTURED_SPEC

2. Compliance inventory:
$COMPLIANCE_INVENTORY

Process:
1. Extract workflow trigger points:
   - on input
   - on review
   - on sign
   - on submit
   - background
2. Map obligations -> trigger points.
3. Evaluate coverage:
   - Missing
   - Partial
   - Covered
4. For each gap:
   - Define UX surface (choose one):
     - inline validation
     - warning banner
     - blocking modal
     - read-only state
     - status indicator
   - Define system behavior:
     - validate
     - warn
     - block
     - log
     - require confirmation

Rules:
- Do NOT create features from obligations.
- Workflow first, compliance is overlay.
- Prefer inline over modal.
- Block only for legal/safety-critical.

Output format:
1. Coverage matrix
2. Gap table
3. UX injection suggestions

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
