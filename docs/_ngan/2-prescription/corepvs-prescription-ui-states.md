
# Auto-Generate UI States from Compliance — CorePVS Prescription

## What this file is
A practical framework to convert compliance obligations into UI states for the CorePVS Prescription flow.

This file follows the CorePVS principle that workflow comes first and compliance acts as an overlay layer.
Do not derive product features directly from obligation IDs.
Use obligations to inject validation, warnings, blocking logic, auditability, and status visibility into an already good doctor workflow.

## Why this matters
CorePVS positions Prescription Management as Phase 4 and includes E-Rezept core, drug database & safety, Heilmittel, Hilfsmittel, eVDGA, and BMP.
The roadmap explicitly calls out a prescription builder, FHIR bundle generation, QES signing, prescription queue, drug safety checks, and transmission to the E-Rezept Fachdienst.
The product context also states that doctors must be able to generate a compliant E-Rezept with safety checks, and the UX principles require all screens to define empty, loading, error, and current states.

## How to use this file
1. Start from a real workflow or screen flow, not from compliance rows.
2. Extract workflow moments such as:
   - search drug
   - edit medication details
   - review prescription
   - sign
   - submit
   - track status
   - cancel
3. Map each compliance obligation to:
   - a trigger point in the workflow
   - a UX surface
   - a system behavior
   - one or more UI states
4. Add only the minimum state changes needed to satisfy the obligation without breaking speed, clarity, or density.
5. Use the state matrix below as a reusable pattern for other flows.

---

## Core state-generation model

### 1. Trigger categories
| Trigger category | Meaning | Example in Prescription |
|---|---|---|
| On entry | When screen loads | Prescription builder opens |
| On input | While editing fields | Dosage or medication type changes |
| On review | Before sign/submit | Drug interaction analysis |
| On sign | When doctor confirms legally relevant action | QES step |
| On submit | During external transmission | Send to Fachdienst |
| Post-submit | After successful or failed transmission | Created / sent / failed / cancelled |
| Background | Async update from external system | Dispensed status changes |

### 2. UX surface categories
| UX surface | Use when | Typical weight |
|---|---|---|
| Inline validation | Field-level fix is needed | Low to medium |
| Inline hint | Helpful but non-blocking guidance | Low |
| Warning banner | User should notice risk but may continue | Medium |
| Blocking modal | Legal/safety gate must stop action | High |
| Status chip / badge | Lifecycle needs to stay visible | Medium |
| Read-only lock | External or legally fixed data must not be edited | High |
| Toast / transient confirmation | Fast success acknowledgement | Low |
| Audit log event | Invisible but mandatory trace | High |

### 3. System behavior categories
| Behavior | Meaning |
|---|---|
| Validate | Check field/rule correctness |
| Warn | Show non-blocking signal |
| Block | Prevent next action |
| Require confirmation | User may continue but must explicitly confirm |
| Generate | Produce required artifact, e.g. FHIR bundle |
| Persist | Save draft or final state |
| Transmit | Send to external service |
| Track | Update lifecycle status |
| Lock | Prevent edit/delete |
| Log | Record audit trail |

---

## Prescription workflow used in this file

### Primary user
Doctor.
This aligns with product context, which defines prescriptions as a core doctor task and specifically mentions E-Rezept with FHIR bundle generation, QES signing, and drug safety checks.

### Baseline flow
1. Open Prescription Builder
2. Select prescription type
3. Search medication or ingredient
4. Enter dosage and instructions
5. Review safety, eligibility, and completeness
6. Sign with QES / comfort signature
7. Submit to Fachdienst
8. Generate patient copy / queue item
9. Track status / cancel if needed

This baseline is derived from the roadmap for Phase 4 Prescription Management.

---

## Selected compliance obligations used for state generation

### E-Rezept core
| Obligation ID | What it means for UX |
|---|---|
| ERX-002 | Mandatory FHIR fields must exist before generation/submission |
| ERX-003 | Workflow status must be visible and trackable |
| ERX-004 | Cancellation must be supported before dispensing |
| ERX-005 | Muster 16 fields must be handled when relevant |
| ERX-006 | Multiple prescription must support linked partial prescriptions |
| ERX-007 | Optional direct assignment to pharmacy |
| ERX-008 | Drug interactions must be validated before submission |

### Drug database & safety
| Obligation ID | What it means for UX |
|---|---|
| DDB-001 | Drug search must use current database data |
| DDB-002 | Interaction checking must cover all active medications |

### AKA / practice software prescription obligations
| Obligation ID | What it means for UX |
|---|---|
| VSST496 | Successful transmission marks prescription data as billed/transmitted |
| VSST510 | Medication database freshness must be maintained |
| VSST515 | Transmission prerequisites must be checked |
| VSST516 | In one track, transmission may be blocked while documentation still supports later retroactive transmission |
| VSST518 | Some prescriptions may be transmissible only under contract timing rules |
| VSST858 | Recommendation table must display co-payment column |
| VSST863 | Repeat prescriptions must re-check recommendations and substitutions |
| VSST870 | Recommendations should appear automatically without extra click |
| VSST923 | High-volume prescription must warn the user |
| VSST976 | Successful real-data transmission should show transmitted count under the defined conditions |
| VSST977 | Certain OTC exception rules apply only for contract participants aged 18+ |

---

## State-generation matrix

### Screen 1 — Prescription Builder
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| On entry | DDB-001, VSST510 | `loading_drug_db` | Full-page skeleton / small top status | Load current medication catalog and freshness metadata |
| On entry success | DDB-001 | `ready` | Normal builder state | Search and select meds |
| On entry failure | DDB-001 | `drug_db_unavailable` | Inline error card + retry | Block medication search until retry or fallback |
| On input | ERX-005 | `muster16_required_fields_missing` | Inline validation | Show missing insurance / recipe-specific fields |
| On input | VSST977 | `otc_exception_age_not_applicable` | Inline hint / read-only explanation | Hide or suppress adult-only OTC exception indication for under-18 contract participants |
| On input | ERX-006 | `multiple_rx_linking_incomplete` | Inline validation + side panel summary | Require linkage metadata for partial prescriptions |

### Screen 2 — Drug Recommendation / Safety Panel
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| On drug selected | VSST870 | `recommendations_auto_shown` | Right rail / inline panel | Auto-open recommendation panel |
| On recommendations loaded | VSST858 | `recommendations_with_copay` | Data table | Show co-payment column |
| On repeat prescription | VSST863 | `repeat_rx_recheck_required` | Yellow panel | Re-fetch category changes and substitutions |
| On review | ERX-008, DDB-002 | `interaction_check_running` | Inline loading row / spinner in safety panel | Evaluate against all active medications |
| On review result | ERX-008, DDB-002 | `interaction_warning` | Warning banner | Show non-blocking interaction warning |
| On review result severe | ERX-008, DDB-002 | `interaction_blocking` | Blocking modal or locked CTA | Stop submit until reviewed |
| On save | VSST923 | `high_volume_warning` | Warning banner | Show volume-threshold risk |

### Screen 3 — Review & Compliance Check
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| On review | ERX-002 | `fhir_fields_incomplete` | Checklist panel + red inline errors | Block generation/sign if mandatory fields missing |
| On review | VSST515 | `transmission_prerequisites_incomplete` | Checklist panel | Surface all missing prerequisites before submit |
| On review | VSST518 | `contract_window_exception` | Yellow note / policy tag | Explain why transmission is allowed or deferred by contract timing |
| On review | VSST516 | `retroactive_only_mode` | Read-only info banner + disabled submit | Allow documentation save, block transmission now |
| On review success | ERX-002, VSST515 | `ready_to_sign` | Green readiness chip | Enable sign CTA |

### Screen 4 — Sign
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| On sign open | CorePVS UX principle | `pre_sign_summary` | Dense review summary | Keep all critical information visible before legal action |
| On confirm | QES requirement from roadmap | `signing_in_progress` | Blocking progress modal | Start QES / comfort signature |
| On success | roadmap + ERX workflow | `signed` | Green status chip + toast | Persist legal sign state |
| On failure | roadmap + product anti-pattern guidance | `sign_failed_actionable` | Red error panel | Explain what failed and how to recover |

### Screen 5 — Submit / Transmission
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| On submit | roadmap, ERX core | `submission_in_progress` | Progress panel | Send to Fachdienst |
| On success | VSST496 | `transmitted_marked_billed` | Status chip | Flag transmitted prescription data appropriately |
| On success real transmission | VSST976 | `transmitted_count_visible` | Success panel | Show count of successfully transmitted prescriptions under allowed conditions |
| On success test mode | VSST976 | `test_transmission_no_count` | Success panel | Hide transmitted count |
| On partial/failure | product anti-pattern guidance | `submission_failed_actionable` | Error panel | Do not show generic error |
| On current track blocked | VSST516 | `transmission_blocked_documented` | Yellow info state | Keep saved documentation for future retroactive transmission |

### Screen 6 — Status / Lifecycle
| Trigger | Obligation(s) | Generated state | UX surface | Behavior |
|---|---|---|---|---|
| Post-submit | ERX-003 | `status_created` / `status_dispensed` / `status_cancelled` | Status chip / timeline | Track lifecycle clearly |
| On cancel request | ERX-004 | `cancel_confirm` | Confirmation modal | Allow cancel only before dispensing |
| On cancel success | ERX-004 | `cancelled` | Status chip + audit toast | Record cancellation |
| On cancel blocked | ERX-004 | `cancel_disallowed_dispensed` | Disabled action + reason text | Prevent cancellation after dispensing |

---

## State package by severity

### Low-severity package
Use for advisory logic that should not interrupt speed.
- inline hint
- muted badge
- optional recommendation panel
- transient toast

### Medium-severity package
Use for non-blocking but important compliance overlays.
- yellow banner
- checklist row with warning icon
- expandable “why this matters” detail
- confirmation checkbox

### High-severity package
Use only for true safety / legal gates.
- blocking modal
- locked primary CTA
- required review step
- read-only lock
- audit log entry

This aligns with CorePVS anti-pattern guidance:
- avoid undifferentiated alert fatigue
- use hard-stop only for truly critical interactions
- keep Prescription as a composable view, not a modal gauntlet

---

## UI state naming convention
Use predictable names so AI, design, and engineering can all map them consistently.

Format:
`{screen}_{condition}_{severity}`

Examples:
- `builder_drug_db_unavailable_high`
- `safety_interaction_warning_medium`
- `review_fhir_fields_incomplete_high`
- `submit_transmitted_count_visible_low`
- `status_cancel_disallowed_high`

---

## Reusable output schema

```json
{
  "screen_id": "prescription_review",
  "trigger_point": "on_review",
  "obligation_ids": ["ERX-002", "VSST515"],
  "generated_state_id": "review_fhir_fields_incomplete_high",
  "ux_surface": "checklist_panel",
  "system_behavior": "block_until_complete",
  "severity": "high",
  "copy": {
    "title": "Required prescription data is missing",
    "body": "Complete all mandatory fields before signing."
  }
}
```

---

## Prompt template to auto-generate UI states

```text
You are generating UI states for the CorePVS Prescription flow.

INPUT:
1. Workflow steps
2. Compliance obligations
3. Product UX principles

TASK:
- Map each obligation to a workflow trigger point
- Generate only the minimum UI state needed
- Output:
  - screen
  - trigger point
  - obligation IDs
  - generated state ID
  - UX surface
  - system behavior
  - severity
  - short UI copy

RULES:
- Do not invent product features from obligation IDs
- Workflow comes first, compliance is overlay
- Prefer inline validation over modals
- Use blocking states only for legal or safety gates
- Keep the screen dense and desktop-first
```

---

## Recommended minimum UI state inventory for Prescription
If you need a lean first prototype, start with these 12 states:

1. `builder_loading_drug_db`
2. `builder_drug_db_unavailable`
3. `builder_muster16_required_fields_missing`
4. `safety_recommendations_auto_shown`
5. `safety_interaction_check_running`
6. `safety_interaction_warning`
7. `safety_interaction_blocking`
8. `review_fhir_fields_incomplete`
9. `review_transmission_prerequisites_incomplete`
10. `signing_in_progress`
11. `submit_submission_failed_actionable`
12. `status_created_dispensed_cancelled`

These cover the most important UX and compliance overlap without overbuilding the prototype.

---

## Final rule
Do not ask:
“What feature should we build for ERX-008?”

Ask:
“At what moment in the doctor workflow should ERX-008 appear, and what is the lightest UI state that fulfills it?”
