---
description: Validate pipeline outputs for workflow-first compliance overlay and build-ready specificity
argument-hint: [WORKFLOW="Prescription"] [ARTIFACT_SET="paste outputs"] [SCOPE_NOTES="optional constraints"]
---

Review this `$WORKFLOW` artifact set against the CorePVS design pipeline.

Inputs:
- Workflow: $WORKFLOW
- Artifact set: $ARTIFACT_SET
- Scope notes (optional): $SCOPE_NOTES

Checks:
- Is the workflow derived from a real reference flow (not invented from compliance)?
- Was compliance layered on top rather than used to create new product features?
- Does the output follow the golden rule:
  "Flow defines system. Compliance constrains system."?
- Are screens, transitions, states, and interactions explicit enough to build?
- Are blocking interactions used only for legal/safety-critical gates?

Output format:
1. Pass/fail by criterion
2. Violations (if any)
3. Concrete corrections needed

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
