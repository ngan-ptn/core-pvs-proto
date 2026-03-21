# Prescription Flow (End-to-End Example)

## Overview Pipeline

| Step | Goal | Output | What to do |
|---|---|---|---|
| 1 | Audit app X | Raw flow map | Extract real screens, actions, states |
| 2 | Convert to SFT | YAML spec | Structure into flows, screens, transitions |
| 3 | Compliance mapping | Gap list | Compare against compliance rules |
| 4 | Finalize artifacts | Clean flows + screens | Optimize for speed, clarity, safety |
| 5 | Prototype-ready | UI structure | Define components + interactions |

---

## STEP 1 — Raw Flow (Audit)

1. Prescription List
   - View existing prescriptions
   - Actions: create new, edit, cancel

2. Create Prescription
   - Input: patient, medication, dosage
   - State: draft

3. Review Prescription
   - Validate inputs
   - System checks interactions

4. Sign Prescription
   - Doctor confirmation
   - State: signed

5. Send / Export
   - Send to pharmacy / print

Branches:
- Missing data → error
- Drug interaction → warning override

---

## STEP 2 — SFT YAML (Simplified)

```yaml
flows:
  - id: prescription_flow
    start: prescription_list

screens:
  - id: prescription_list
    actions: [create, edit]

  - id: prescription_create
    states: [draft]

  - id: prescription_review
    events: [validate, warning]

  - id: prescription_sign
    states: [signed]

transitions:
  - from: prescription_list
    to: prescription_create
    event: create

  - from: prescription_create
    to: prescription_review
    event: submit

  - from: prescription_review
    to: prescription_sign
    event: confirm
```

---

## STEP 3 — Compliance Gaps

| Gap ID | Description | Severity | Location | Fix |
|---|---|---|---|---|
| G1 | Missing audit log | High | Sign step | Add audit trail |
| G2 | No allergy check | High | Review | Add validation |
| G3 | No double confirmation | Medium | Sign | Add confirmation modal |

---

## STEP 4 — Final Flow

1. Create → Input validation
2. Review → Clinical + compliance checks
3. Confirm → Double confirmation
4. Sign → Audit log
5. Export

---

## STEP 5 — Prototype Structure

### Screen: prescription_create
- Regions:
  - patient info
  - medication form
- Components:
  - form inputs
  - dropdown search
- Interactions:
  - validation on submit
- States:
  - empty / error / valid

### Screen: prescription_review
- Components:
  - summary panel
  - warning banner
- States:
  - warning / clean

