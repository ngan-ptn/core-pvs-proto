
# Full Pipeline — Real Prescription Flow for CorePVS

## What this file is
A real end-to-end pipeline for one CorePVS flow:
Prescription / E-Rezept.

This file combines:
- workflow framing from the CorePVS roadmap
- doctor goals from product context
- compliance obligations from the compliance inventory
- a practical UX-first interpretation for prototype work

## How to use this file
1. Use Step 1 and Step 2 as your baseline flow/spec.
2. Use Step 3 as the compliance gap engine for this flow.
3. Use Step 4 to convert gaps into a final UX flow.
4. Use Step 5 to create screen regions, states, and prototype-ready structure.
5. Keep this rule throughout:
   workflow first, compliance on top.

---

## Source foundation used
- Product context defines prescriptions as a core doctor task and states that doctors need compliant E-Rezept with safety checks.
- Roadmap Phase 4 defines Prescription Management with prescription builder, FHIR bundle generation, QES signing, prescription queue, MMI drug data, safety checks, and E-Rezept Fachdienst submission.
- Compliance inventory includes E-Rezept core obligations such as mandatory FHIR fields, workflow status tracking, cancellation before dispensing, Muster 16 support, multiple prescription support, direct assignment, and drug interaction validation.
- Compliance inventory also includes practice-software prescription obligations such as transmission prerequisites, prescription transmission count behavior, automatic recommendations, co-payment display, repeat prescription re-checking, high-volume warnings, and medication database freshness.

---

# Step 1 — Real Workflow Audit

## Goal
Capture the real prescription workflow that CorePVS should support for prototype and compliance mapping.

## Primary persona
Doctor.

## Baseline end-to-end flow
1. Open patient chart and start prescription
2. Choose prescription mode
   - PZN
   - ingredient
   - compounding
   - free text
3. Search and select medication
4. Enter dosage, instructions, quantity, and timing
5. Review insurance-specific recommendations and substitutions
6. Run safety and completeness checks
7. Generate E-Rezept bundle
8. Sign using QES / comfort signature
9. Submit to Fachdienst
10. Generate patient copy / queue item
11. Track status
12. Cancel if still allowed

## Branches
- Drug database unavailable
- Missing mandatory fields
- Severe drug interaction
- Repeat prescription requires refreshed recommendation check
- Transmission temporarily blocked but documentation may still be saved
- Transmission succeeds
- Transmission fails
- Status changes after dispensing
- Cancellation requested before or after dispensing

## Workflow moments
| Workflow moment | Why it matters |
|---|---|
| Start builder | Determines type and available fields |
| Medication lookup | Connects to current drug data |
| Recommendation display | Supports economic and contract-aware prescribing |
| Safety review | Compliance and patient safety converge here |
| Sign | Legal commitment point |
| Submit | External integration point |
| Status tracking | Needed for lifecycle visibility |
| Cancel | Needed only within permitted window |

---

# Step 2 — Structured Flow Spec

## Flow object
```yaml
flow:
  id: prescription_erx_flow
  persona: doctor
  module: prescription_management
  start: prescription_builder
  end_states:
    - transmitted
    - saved_for_later
    - cancelled
    - blocked
```

## Screens
```yaml
screens:
  - id: prescription_builder
    purpose: compose prescription content
    key_regions:
      - patient_summary
      - rx_type_selector
      - medication_search
      - medication_form
      - recommendation_panel

  - id: prescription_review
    purpose: review safety and compliance readiness
    key_regions:
      - summary_panel
      - safety_panel
      - compliance_checklist
      - action_bar

  - id: prescription_sign
    purpose: execute legal signature
    key_regions:
      - sign_summary
      - sign_controls
      - signing_feedback

  - id: prescription_submit
    purpose: transmit to external service
    key_regions:
      - transmit_progress
      - success_or_error
      - follow_up_actions

  - id: prescription_status
    purpose: track lifecycle and manage cancellation
    key_regions:
      - status_timeline
      - transmission_metadata
      - actions
```

## Transitions
```yaml
transitions:
  - from: prescription_builder
    to: prescription_review
    event: continue_to_review

  - from: prescription_review
    to: prescription_sign
    event: compliance_passed

  - from: prescription_review
    to: prescription_builder
    event: edit_required

  - from: prescription_sign
    to: prescription_submit
    event: signing_success

  - from: prescription_submit
    to: prescription_status
    event: transmission_success

  - from: prescription_submit
    to: prescription_review
    event: transmission_failed_recoverable

  - from: prescription_status
    to: prescription_status
    event: status_updated
```

## Minimum state inventory
```yaml
states:
  - draft
  - recommendations_loaded
  - safety_warning
  - safety_blocked
  - ready_to_sign
  - signing_in_progress
  - signed
  - transmission_in_progress
  - transmitted
  - transmission_failed
  - dispensed
  - cancelled
```

---

# Step 3 — Compliance Gap Engine

## Goal
Map real obligations to this flow and identify missing or weak coverage.

## Selected obligations for this real run
| Obligation ID | Summary | Trigger point |
|---|---|---|
| ERX-002 | Mandatory FHIR fields | on review / generation |
| ERX-003 | Status trackable | post-submit / background |
| ERX-004 | Cancellation before dispensing | on status / cancel |
| ERX-005 | Muster 16 support | on builder input |
| ERX-006 | Multiple prescription support | on builder input |
| ERX-007 | Direct assignment optional | on submit |
| ERX-008 | Drug interactions before submission | on review |
| DDB-001 | Current drug data | on builder load / search |
| DDB-002 | Interaction check against active meds | on review |
| VSST496 | Mark transmitted prescription data as billed | on submit success |
| VSST510 | Drug database freshness cadence | background / admin / builder metadata |
| VSST515 | Transmission prerequisites | on review |
| VSST516 | May block transmission while preserving documentation | on submit eligibility |
| VSST518 | Contract timing exception | on review / submit |
| VSST858 | Co-payment column in recommendation display | on recommendations loaded |
| VSST863 | Repeat prescription recommendation refresh | on repeat prescription |
| VSST870 | Recommendations display automatically | on medication selection |
| VSST923 | High-volume warning | on save / review |
| VSST976 | Show transmitted count only for successful real transmission | post-submit |
| VSST977 | OTC exception display only for 18+ contract participants | on input / recommendations |

## Coverage matrix
| Obligation ID | Current coverage in proposed flow | Coverage status | Notes |
|---|---|---|---|
| ERX-002 | Review screen has compliance checklist but no explicit FHIR field checklist yet | Partial | Needs concrete readiness state |
| ERX-003 | Status screen exists | Covered | Needs lifecycle chip + timeline |
| ERX-004 | Status screen includes cancel action | Partial | Must explicitly block after dispensed |
| ERX-005 | Builder has prescription type selector | Partial | Needs Muster 16 field set |
| ERX-006 | Builder supports types but not linked partial prescriptions yet | Missing | Add multiple prescription linkage region |
| ERX-007 | No explicit routing UI yet | Missing | Optional, keep out of P0 unless needed |
| ERX-008 | Safety panel exists | Partial | Must block severe interactions before submit |
| DDB-001 | Medication search exists | Partial | Must expose unavailable / stale states |
| DDB-002 | Safety panel exists | Partial | Must include all active meds |
| VSST496 | Submit success exists | Missing | Add transmitted/billed marking state |
| VSST510 | No visible freshness state | Missing | Add data freshness metadata / background status |
| VSST515 | Review checklist exists | Partial | Add prerequisite checklist with gate |
| VSST516 | No deferred transmission mode | Missing | Add save-for-later documented state |
| VSST518 | No contract timing explanation | Missing | Add policy note in review |
| VSST858 | Recommendation panel exists | Missing | Add explicit co-payment column |
| VSST863 | Repeat prescription path not explicit | Missing | Add repeat mode with re-check |
| VSST870 | Recommendation panel implied but not automatic | Missing | Auto-open on drug select |
| VSST923 | No high-volume warning state | Missing | Add warning banner |
| VSST976 | No transmitted-count behavior | Missing | Add success variant logic |
| VSST977 | No age-conditioned OTC exception logic | Missing | Add conditional display rule |

## Gap table
| Gap ID | Obligation ID | Location | Problem | UX fix | Severity |
|---|---|---|---|---|---|
| G-PR-01 | ERX-002 | Review | No explicit mandatory FHIR readiness checklist | Add checklist panel with blocking readiness state | High |
| G-PR-02 | ERX-004 | Status | Cancel rule not limited by dispensed state | Disable cancel with reason once dispensed | High |
| G-PR-03 | ERX-006 | Builder | Multiple prescription not represented | Add linked partial-prescription group panel | High |
| G-PR-04 | ERX-008 / DDB-002 | Review | Interaction checks not severity-tiered | Add warning vs blocking paths | High |
| G-PR-05 | DDB-001 | Builder | No unavailable/stale drug DB state | Add unavailable and freshness states | Medium |
| G-PR-06 | VSST496 | Submit | Success state does not mark transmitted data as billed | Add transmission success bookkeeping state | Medium |
| G-PR-07 | VSST515 | Review | No visible transmission prerequisites gate | Add prerequisites checklist | High |
| G-PR-08 | VSST516 | Submit | No save-now / transmit-later mode | Add deferred transmission state | Medium |
| G-PR-09 | VSST518 | Review | Contract timing exception not visible | Add policy explainer row | Medium |
| G-PR-10 | VSST858 | Builder | Recommendation data table incomplete | Add co-payment column | Medium |
| G-PR-11 | VSST863 | Builder | Repeat prescription path does not force refreshed recommendations | Add repeat mode banner and refresh action | Medium |
| G-PR-12 | VSST870 | Builder | Recommendations require likely extra action | Auto-open recommendation panel | Medium |
| G-PR-13 | VSST923 | Review | No high-volume control warning | Add yellow risk banner | Medium |
| G-PR-14 | VSST976 | Submit | Success messaging not differentiated by real vs test transmission | Add success variants | Low |
| G-PR-15 | VSST977 | Builder | OTC exception indication not age-gated | Add conditional rule logic | Medium |

---

# Step 4 — Final UX Flow After Gap Injection

## Final flow
1. Doctor opens Prescription Builder
2. Chooses mode and medication
3. Recommendation panel opens automatically
4. Builder validates type-specific requirements
5. If repeat prescription, system refreshes recommendation and substitution data
6. Review screen shows:
   - safety results
   - mandatory FHIR readiness checklist
   - transmission prerequisites
   - policy/timing notes
   - high-volume warning if relevant
7. If severe interaction or missing mandatory data:
   - sign and submit remain blocked
8. If compliant:
   - doctor signs using QES / comfort signature
9. Submit screen handles:
   - real transmission
   - test transmission
   - deferred/retroactive-friendly documentation mode
10. Status screen tracks:
   - created
   - transmitted
   - dispensed
   - cancelled
11. Cancellation is allowed only before dispensing

## Final screen list
| Screen | Purpose | Compliance-heavy additions |
|---|---|---|
| Prescription Builder | Compose medication order | auto recommendations, co-pay column, repeat mode, age-gated indications |
| Prescription Review | Safety + readiness | FHIR checklist, prerequisites, warnings, contract notes |
| Prescription Sign | Legal commitment | sign progress + recoverable failure |
| Prescription Submit | External transmission | real/test/deferred variants, transmitted count logic |
| Prescription Status | Lifecycle management | visible status timeline, cancellation gate |

---

# Step 5 — Prototype-Ready Spec

## Screen 1 — Prescription Builder
### Regions
- patient summary
- rx mode selector
- medication search
- medication details form
- recommendation panel

### Components
- segmented control for rx type
- autocomplete search
- structured dosage fields
- recommendations table
- inline policy notes

### Interactions
- selecting medication auto-opens recommendations
- repeat mode triggers refreshed recommendations
- invalid Muster 16 or multi-prescription fields show inline errors

### States
- empty
- loading_drug_db
- drug_db_unavailable
- recommendations_auto_shown
- otc_exception_not_applicable
- multiple_rx_linking_incomplete

## Screen 2 — Prescription Review
### Regions
- clinical summary
- safety panel
- compliance checklist
- action bar

### Components
- alert banners
- checklist items
- collapsible details
- locked primary CTA when blocked

### Interactions
- clicking issue item returns focus to relevant field
- severe interaction opens blocking explanation
- non-severe warning can be acknowledged

### States
- review_ready
- fhir_fields_incomplete
- transmission_prerequisites_incomplete
- interaction_warning
- interaction_blocking
- high_volume_warning
- contract_timing_exception

## Screen 3 — Prescription Sign
### Regions
- dense summary
- signature control
- progress feedback

### Components
- summary card
- primary sign button
- loading overlay
- actionable error card

### States
- ready_to_sign
- signing_in_progress
- signed
- sign_failed_actionable

## Screen 4 — Prescription Submit
### Regions
- submission progress
- result state
- next actions

### Components
- progress stepper
- success panel
- error panel
- deferred transmission note

### States
- transmission_in_progress
- transmission_success_real
- transmission_success_test
- transmission_failed
- transmission_blocked_documented
- transmitted_marked_billed

## Screen 5 — Prescription Status
### Regions
- timeline
- metadata
- actions

### Components
- status chips
- timeline list
- cancel CTA
- disabled-state explanation

### States
- created
- transmitted
- dispensed
- cancelled
- cancel_disallowed_dispensed

---

# Prototype priorities

## P0
- builder
- review
- sign
- submit
- status
- severe interaction blocking
- FHIR readiness
- transmission prerequisites
- status tracking
- cancellation gate

## P1
- repeat prescription refresh
- co-payment column
- high-volume warning
- success variants for real/test transmission
- deferred transmission mode

## P2
- direct assignment to pharmacy
- advanced contract timing notes
- admin-visible drug database freshness panel

---

# Final recommendation
For the first CorePVS prototype, build the Prescription flow as a single dense desktop workspace with:
- inline editing
- one persistent right rail for recommendations and safety
- one review gate before sign
- one transmission result screen
- one explicit lifecycle screen

This fits CorePVS’s UX direction:
- speed for high-frequency doctor work
- clarity through explicit state signaling
- density without modal overload
- compliance as overlay, not the primary IA
