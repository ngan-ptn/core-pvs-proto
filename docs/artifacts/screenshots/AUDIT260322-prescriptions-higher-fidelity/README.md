# AUDIT260322 Prescription Screenshot Set - Higher Fidelity

This folder contains a second screenshot set for the same audit flow as `AUDIT260322-prescriptions`, but with a tighter source alignment to `pvs-base-1`.

## Intent

Compared with the earlier `Full coverage` set, this version:

- keeps full `S001` to `S009` coverage
- follows `pvs-base-1` shell structure more closely
- uses more direct source labels from `Medication`, `Common`, and `EDocuments`
- mirrors `PatientPage`, `MedicationKBV`, `MedicationShoppingBag`, `MedicationPrintPreview`, and `ERezept` grouping more closely

## Provenance

| File | Fidelity note |
| --- | --- |
| `S001-patient-record.png` | higher-fidelity patient-file shell derived from `PatientPage` / `PatientFile` structure |
| `S002-medication-tab.png` | higher-fidelity Medication top-level patient tab |
| `S003-prescribed-medication.png` | higher-fidelity `MedicationKBV` prescribed-medication shell |
| `S003b-medication-plan.png` | higher-fidelity `Medication plan (BMP)` companion tab |
| `S004-shopping-bag.png` | higher-fidelity shopping-bag wording and action set |
| `S005-print-preview.png` | higher-fidelity print-preview and print-settings structure |
| `S006-timeline-medication-form-detail.png` | higher-fidelity patient timeline shell with form-entry readback cues |
| `S007-erp-bundle-creation.png` | mocked processing state inside an `ERezept`-like source shell |
| `S008-e-rezept-send-transmission.png` | mocked send/resend/sign states using real ERezept actions and statuses |
| `S009-e-rezept-list-retrieval-surface.png` | closest to direct source structure via `ERezept` table columns and actions |

## Constraint note

This set still uses mocked data/state because the live Quickable environment was inaccessible and the local `pvs-base-1` stack could not be started end-to-end on this machine.
