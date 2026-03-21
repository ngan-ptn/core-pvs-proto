---
description: Pipeline Step 1 - audit a reference workflow into screens/actions/states
argument-hint: [WORKFLOW="Prescription"] [REFERENCE="paste notes or link"] [SCOPE_NOTES="optional constraints"]
---

You are executing **Step 1 (Audit Flow)** of the CorePVS design pipeline.

Task:
Audit the `$WORKFLOW` flow from the provided reference input. Do not redesign yet.

Inputs:
- Workflow: $WORKFLOW
- Reference input: $REFERENCE
- Scope notes (optional): $SCOPE_NOTES

Instructions:
- Extract the real workflow as it exists in the reference.
- Identify:
  - screens
  - user actions
  - system actions
  - states
  - transitions
  - branching paths
  - edge cases
- Do NOT inject compliance obligations yet.
- Do NOT jump to UI structure or components yet.

Output format:
1. Flow summary (bullet list)
2. Screen list
3. Action list (user vs system)
4. State list
5. Branches and edge cases

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
