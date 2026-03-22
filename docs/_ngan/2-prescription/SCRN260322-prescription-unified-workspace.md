# Screen Spec — Prescription Unified Workspace

## Purpose
A single prescribing workstation that keeps compose, review, E-Rezept preparation, signing, sending, and status in one continuous surface.

## Core Layout
```text
+------------------------------------------------------------------------------------------------------+
| Sticky Patient Header                                                                                |
|------------------------------------------------------------------------------------------------------|
| Left Rail                    | Main Workspace                            | Right Rail                |
| Search and quick picks       | Prescription rows + detail editor         | Readiness and status      |
|------------------------------------------------------------------------------------------------------|
| Sticky Action Bar                                                                                   |
+------------------------------------------------------------------------------------------------------+
```

## Region 1 — Sticky Patient Header
### Purpose
Keep clinically important patient context visible at all times.

### Content
- patient identity
- age and sex
- insurance and contract context
- allergies and intolerances
- chronic conditions
- current medication count

### States
- default
- allergy alert highlighted
- insurance context unavailable

## Region 2 — Left Rail: Search And Quick Picks
### Purpose
Fast medication search without leaving the workspace.

### Content
- search input
- recent medications
- frequently used medications
- grouped search results
- free-text add action

### States
- idle
- loading results
- results loaded
- no results
- drug-db unavailable

### Key Rules
- keyboard focus defaults here on open
- no modal required for first selection
- selecting a result creates or updates a prescription row in the main workspace

## Region 3 — Main Workspace: Prescription Rows
### Purpose
Primary authoring area for all prescription details.

### Row Model
Each medication row contains:
- medication identity
- form type
- dosage
- intake instructions
- quantity
- notes
- substitution flags
- per-row status chip

### Row States
- empty row
- editing
- incomplete
- warning
- ready
- signed and locked
- sent and locked

### Key Rules
- inline editing only
- no detached review screen for routine edits
- signed rows become read-only
- sent rows become immutable except permitted follow-up actions

## Region 4 — Right Rail: Readiness, Safety, And Lifecycle
### Purpose
Make system preparation and lifecycle visible without sending the user away.

### Sections
- readiness checklist
- safety panel
- recommendation and substitution panel
- bundle state
- signing state
- sending state
- status timeline

### States
- checklist incomplete
- warning present
- bundle preparing
- bundle failed
- ready to sign
- signing
- sign failed
- ready to send
- sending
- sent
- send failed
- dispensed
- cancelled

### Key Rules
- severe safety issues block downstream CTA
- non-blocking warnings stay visible after acknowledgement
- status timeline remains visible after successful send

## Region 5 — Sticky Action Bar
### Purpose
Expose the next best action according to workspace state.

### Primary CTA By State
| State | Primary CTA |
|---|---|
| `draft` / `incomplete` | `Save draft` |
| `ready_for_bundle` | `Prepare E-Rezept` |
| `ready_to_sign` | `Sign` |
| `ready_to_send` | `Send to Fachdienst` |
| `sent` | `Print patient copy` |

### Secondary Actions
- discard row
- remove from workspace
- retry bundle
- retry sign
- retry send
- cancel prescription
- open status details

## Screen-Level States
### Empty
- no medication rows yet
- message guides user to search or add free text

### Loading
- patient context loading
- medication results loading
- readiness loading
- bundle or send progress

### Error
- drug database unavailable
- ERP bundle creation failed
- signing failed
- send failed
- status refresh failed

### Populated
- one or more prescription rows present
- right rail reflects current readiness and lifecycle state

## Validation Rules
- required fields vary by form type
- free-text prescription requires medication name
- some non-ERP forms can save and print without ERP preparation
- E-Rezept requires bundle-ready state before sign
- send requires signed bundle

## Interaction Rules
- no mandatory screen switch between compose and sign/send
- true blocking events only for legal and safety gates
- all other guidance appears inline or in right rail
- the same workspace must remain the post-submit status surface

## Success Criteria
- doctor can finish a typical E-Rezept without leaving the workspace
- status remains visible after send
- failures provide an immediate retry path in the same place
- workspace supports both single-item and multi-item prescribing sessions
