---
description: Auto-map compliance obligations to workflow triggers and UX coverage (coverage matrix + gap table)
argument-hint: [WORKFLOW="paste flow steps or link"] [COMPLIANCE_INVENTORY="paste normalized compliance JSON"] [SCOPE_NOTES="optional constraints"]
---

# Compliance Auto-Mapping Engine

## Purpose
Automatically map compliance obligations → workflow triggers → UX layer.

## Usage
1. Input:
   - Flow (Step 1–2)
   - Normalized compliance JSON
2. Run prompt below
3. Output:
   - Coverage matrix
   - Gap table

---

## Prompt

You are a compliance mapping engine.

### INPUT
- Workflow (screens, steps, transitions)
- Compliance JSON

### TASK
1. Extract trigger points from workflow
2. Match obligations to trigger points
3. Evaluate coverage:
   - Missing
   - Partial
   - Covered
4. Output:
   - Coverage matrix
   - Gap list

### RULES
- Do NOT invent new features
- Treat compliance as overlay layer
- Map to UX (not backend only)

---

## Output Format

### Coverage Matrix
| Obligation | Trigger | Coverage | Notes |

### Gap Table
| Gap ID | Obligation | Location | UX Fix | Severity |
