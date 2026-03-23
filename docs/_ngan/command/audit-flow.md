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
Preferred output structure:
1. Flow summary as a Mermaid flow diagram
2. Screen map with related user actions, system actions, and states grouped per screen
3. Journey or state diagram as Mermaid when the workflow is multi-step, stateful, or branched
4. Branches and edge cases
5. Audit conclusion

Output guidance:
- Prefer grouped structure over separate flat lists when screens, actions, and states are closely related.
- If the workflow is small and linear, you may simplify:
  - omit the journey or state diagram
  - keep the screen map concise
- If the workflow is large, branched, or spans multiple technical layers, include both:
  - a high-level Mermaid flow summary
  - a Mermaid journey or state diagram
- Include an `Artifact Info` section near the top of the output file.
- In `Artifact Info`, include the workflow metadata needed to identify and compare audits across artifacts.
- `Artifact Info` must include `Total screens`, counted by unique screens in the screen map for that workflow.
- Keep the audit grounded in the reference system as-is.
- Do not redesign the future-state flow in this step.

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
