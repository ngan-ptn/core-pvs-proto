# AUDIT260322 Prescription Screenshot Set

This folder contains a full-coverage screenshot set for the prescription audit flow in `docs/artifacts/AUDIT260322-prescriptions.md`.

## Provenance

| File | Type | Notes |
| --- | --- | --- |
| `S001-patient-record.png` | reconstructed | Entry surface derived from the audit's patient-record description |
| `S002-medication-tab.png` | repo-derived | Labels and structure aligned to `pvs-base-1` medication workspace |
| `S003-prescribed-medication.png` | repo-derived | Search, grouped results, and prescription actions derived from `pvs-base-1` medication source and locales |
| `S003b-medication-plan.png` | reconstructed | Supplemental tenth surface for `Medication Plan`, present in the audit state diagram but not numbered in the swimlane |
| `S004-shopping-bag.png` | repo-derived | Shopping bag / recipe pool surface aligned to `MedicationShoppingBag` labels and actions |
| `S005-print-preview.png` | repo-derived | Print settings and save/print surface aligned to medication print-preview terminology |
| `S006-timeline-medication-form-detail.png` | reconstructed | Timeline read-back surface based on audit states and timeline terminology |
| `S007-erp-bundle-creation.png` | reconstructed | ERP bundle creation state based on audited ePrescription branch and bundle-creation source cues |
| `S008-e-rezept-send-transmission.png` | reconstructed | Sign/send/retry/abort surface based on audited ERP transmission states |
| `S009-e-rezept-list-retrieval-surface.png` | reconstructed | Retrieval/status list based on audited sent/PDF/resend/remove states |

## Capture method

- Static local HTML harness
- Served over localhost
- Captured with the repo screenshot workflow or browser automation

## Constraint note

The live Quickable environment was not accessible without login, and the local `pvs-base-1` stack could not be started on this machine because required Docker images from the private registry could not be resolved.
