# Design Decisions Log

Track UI/UX design decisions that involve trade-offs, multiple valid approaches, or extensions/pushback on requirements.

---

## DD-001: Prefer full-coverage reconstructed audit screenshots when source systems are blocked

**Triggered by:** User request to capture corresponding prescription-flow screens from the audited Quickable flow and then from the reference `pvs-base-1` repo
**Matched by:** `docs/artifacts/AUDIT260322-prescriptions.md`, `docs/plans/TASK260323-prescription-screenshot-capture.md`, `docs/artifacts/screenshots/AUDIT260322-prescriptions/index.html`, `docs/artifacts/screenshots/AUDIT260322-prescriptions/README.md`
**Confirmed by:** Codex, 2026-03-23

**Requirement said:** Produce corresponding screenshots for the audited prescription flow.

**Design decision:** Use a full-coverage screenshot set built from a local reconstruction harness when the live Quickable environment is behind login and the `pvs-base-1` stack cannot be started locally because required private Docker images are unavailable.

**Rationale:** The user explicitly chose `Full coverage` over `Higher fidelity`. That makes completeness of the audit set more important than strict runtime authenticity. A reconstructed harness keeps the output aligned to the audit's screen map and preserves useful review coverage, while still labeling each image as either repo-derived or reconstructed.

**What was added beyond requirements:** A supplemental `S003b` Medication Plan capture was added because the audit describes ten surfaces, but the numbered swimlane omits a dedicated screen ID for that surface.

**Trade-off:** Some screens, especially timeline readback and ERP lifecycle states, are not live renders from the original product environment. The resulting images are useful for audit comparison, but they should not be mistaken for production screenshots.

**Pushback expected:** Someone may prefer a smaller set of stricter, more authentic screenshots only. Counter: the selected mode for this task was explicitly coverage-first, and provenance is recorded per file to make fidelity limits visible.
