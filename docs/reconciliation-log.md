# Reconciliation Log

Track when upstream changes, environment constraints, or workflow decisions force re-evaluation of existing design artifacts.

---

## Entry 1: Prescription audit screenshot set reconciled to offline reconstruction path

**Date:** 2026-03-23
**Change:** The requested screenshot capture could not proceed against the original Quickable URL because the site required login, and the fallback `pvs-base-1` stack could not be started locally because private Docker registry images were unreachable from this machine.

**Impact on Design:**
- The screenshot output had to shift from environment capture to a controlled reconstruction harness
- Audit review assets now include explicit provenance labels so readers can distinguish repo-derived screens from reconstructed ERP and timeline states
- The ten-surface audit model required an extra supplemental capture for Medication Plan because the audit summary and swimlane numbering do not fully align

**Items reevaluated:**
- `docs/artifacts/AUDIT260322-prescriptions.md` -> reviewed as the source of truth for flow stages, state names, and screen mapping
- `docs/plans/TASK260323-prescription-screenshot-capture.md` -> added as the approved design note for the offline capture strategy
- `docs/artifacts/screenshots/AUDIT260322-prescriptions/index.html` -> added local reconstruction harness for audit screens
- `docs/artifacts/screenshots/AUDIT260322-prescriptions/app.js` -> added screen-state renderer and source-aligned labels
- `docs/artifacts/screenshots/AUDIT260322-prescriptions/README.md` -> added provenance mapping for the final screenshot set

**Result:** The audit now has a corresponding screenshot set that preserves full workflow coverage under the chosen `Full coverage` mode. Related design decision recorded in DD-001.

**Assessed by:** Codex, 2026-03-23

---

## Entry 2: Higher-fidelity comparison set reconciled to source-UI structure in `pvs-base-1`

**Date:** 2026-03-23
**Change:** A second screenshot set was requested with the `Higher fidelity` direction, while still preserving the full `S001` to `S009` audit coverage. The user approved fidelity to source UI structure, copy, and action models rather than runtime-only authenticity.

**Impact on Design:**
- The audit assets now contain two parallel screenshot sets for the same flow: one coverage-first and one source-UI-fidelity-first
- The second set re-aligns patient-file layout, medication tab structure, print-preview framing, timeline readback, and ERezept list/actions to `pvs-base-1` source cues
- Provenance now needs to distinguish not just reconstructed vs repo-derived, but also which set is intended for comparison against the earlier coverage-first output

**Items reevaluated:**
- `docs/artifacts/AUDIT260322-prescriptions.md` -> re-used as the screen map and source of truth for the second comparison set
- `docs/plans/TASK260323-prescription-screenshot-higher-fidelity.md` -> added as the approved design note for the higher-fidelity comparison approach
- `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/index.html` -> added source-aligned comparison harness shell
- `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/app.js` -> added source-driven renderer with patient-file, medication, timeline, and ERezept cues
- `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/styles.css` -> added styling for the higher-fidelity comparison shell
- `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/README.md` -> added provenance and intent note for the second set

**Result:** The audit now has a second screenshot set intended for side-by-side comparison, with stronger adherence to `pvs-base-1` source UI structure while still using mocked states where backend execution remained unavailable. Related design decision recorded in DD-002.

**Assessed by:** Codex, 2026-03-23
