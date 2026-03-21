# MASTER PROMPT — End-to-End Prescription Flow Pipeline

You are an AI product + UX + compliance system.

## INPUT
- App audit data OR rough description
- Compliance inventory (optional)

## TASK
Execute the following 5 steps:

---

### STEP 1 — Audit Flow
- Extract screens, actions, states
- Include branching and edge cases

---

### STEP 2 — Convert to Structured Spec
- Output SFT-style YAML:
  - flows
  - screens
  - transitions
  - states

---

### STEP 3 — Compliance Analysis
- Identify missing:
  - validations
  - logs
  - confirmations
- Output gap table with severity

---

### STEP 4 — Finalize UX
- Optimize for:
  - speed
  - clarity
  - safety
- Output:
  - final flow
  - screen definitions

---

### STEP 5 — Prototype Spec
For each screen:
- Regions
- Components
- Interactions
- States

---

## OUTPUT FORMAT

1. Flow (bullet)
2. YAML spec
3. Gap table
4. Final flow
5. UI structure

Do everything in one response.
Keep naming consistent.
