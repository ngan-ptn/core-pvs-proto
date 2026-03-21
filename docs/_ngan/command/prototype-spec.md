---
description: Pipeline Step 5 - generate prototype-ready specs (regions/components/interactions/states)
argument-hint: [WORKFLOW="Prescription"] [INPUT="paste Step 4 output"] [SCOPE_NOTES="optional constraints"]
---

You are executing **Step 5 (Prototype Spec)** of the CorePVS design pipeline.

Task:
Produce prototype-ready artifacts for `$WORKFLOW`. This must be build-ready and explicit.

Inputs:
- Workflow: $WORKFLOW
- Step 4 input: $INPUT
- Scope notes (optional): $SCOPE_NOTES

Instructions:
- For each screen define:
  - regions
  - components
  - interactions
  - states (including compliance states when relevant)
- Focus on artifact production:
  flow -> screen -> component -> interaction
- Keep language designer- and engineer-friendly.

Output format:
For each screen:
1. Screen name
2. Purpose
3. Regions
4. Components
5. Interactions
6. States

Workflow: $WORKFLOW
Scope notes: $SCOPE_NOTES
All arguments: $ARGUMENTS
