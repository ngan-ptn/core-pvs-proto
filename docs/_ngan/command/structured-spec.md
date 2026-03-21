---
description: Pipeline Step 2 - convert an audited flow into an SFT-style YAML spec
argument-hint: [WORKFLOW="Prescription"] [AUDIT_INPUT="paste Step 1 output"] [SCOPE_NOTES="optional constraints"]
---

You are executing **Step 2 (Convert to Structured Spec)** of the CorePVS design pipeline.

Task:
Convert the audited `$WORKFLOW` flow into an SFT-style structured YAML spec.

Inputs:
- Workflow: $WORKFLOW
- Audit input (Step 1 output): $AUDIT_INPUT
- Scope notes (optional): $SCOPE_NOTES

Instructions:
- Output YAML only.
- Use these top-level keys:
  - flows
  - screens
  - transitions
  - states
- Normalize actions/entities/states.
- Preserve the original workflow behavior.
- Do NOT redesign yet.
- Do NOT inject compliance obligations yet.

Output format:
Return only YAML with these top-level sections:
- flows
- screens
- transitions
- states

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
