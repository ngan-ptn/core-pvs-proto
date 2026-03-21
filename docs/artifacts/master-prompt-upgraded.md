# MASTER PROMPT — CorePVS Pipeline (Upgraded with Compliance Gap Engine)

## Purpose
End-to-end automation of:
Audit → Flow → Compliance Gap → UX → Prototype

---

## INPUT
- App audit data OR rough description
- Compliance inventory (normalized JSON)

---

## TASK
Execute the following 5 steps:

---

### STEP 1 — Audit Flow
- Extract:
  - screens
  - actions
  - states
- Include:
  - branching
  - edge cases

---

### STEP 2 — Convert to Structured Spec
Output SFT-style YAML:
- flows
- screens
- transitions
- states

---

### STEP 3 — Compliance Gap Engine (UPGRADED)

INPUT:
- Flow (from Step 1–2)
- Compliance inventory

PROCESS:
1. Extract workflow trigger points:
   - on input
   - on review
   - on sign
   - on submit
   - background

2. Map obligations → trigger points

3. Evaluate coverage:
   - Missing
   - Partial
   - Covered

4. For each gap:
   - Define UX surface:
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

OUTPUT:
- Coverage matrix
- Gap table
- UX injection suggestions

IMPORTANT RULES:
- Do NOT create features from obligations
- Workflow first, compliance is overlay
- Prefer inline over modal
- Block only for legal/safety critical

---

### STEP 4 — Finalize UX
Optimize for:
- Speed
- Clarity
- Density

Output:
- Final flow
- Screen definitions

---

### STEP 5 — Prototype Spec
For each screen define:
- Regions
- Components
- Interactions
- States (including compliance states)

---

## OUTPUT FORMAT

1. Flow (bullet)
2. YAML spec
3. Coverage matrix
4. Gap table
5. Final flow
6. UI structure

---

## GOLDEN RULE

"Flow defines system. Compliance constrains system."
