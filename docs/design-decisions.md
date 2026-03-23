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

---

## DD-002: Prefer a second full-coverage set that maximizes source-UI fidelity instead of inventing layouts

**Triggered by:** User request to create an additional screenshot set that follows the `Higher fidelity` direction while still keeping full `S001` to `S009` coverage
**Matched by:** `docs/artifacts/AUDIT260322-prescriptions.md`, `docs/plans/TASK260323-prescription-screenshot-higher-fidelity.md`, `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/index.html`, `docs/artifacts/screenshots/AUDIT260322-prescriptions-higher-fidelity/README.md`
**Confirmed by:** Codex, 2026-03-23

**Requirement said:** Produce a second comparison set that keeps all screen IDs but is more faithful to `pvs-base-1` source structure and wording.

**Design decision:** Build a separate higher-fidelity harness that preserves full audit coverage but reworks each screen to follow `pvs-base-1` shell structure, component grouping, locale copy, tab hierarchy, and ERezept table/action patterns more closely.

**Rationale:** The user explicitly chose source-UI fidelity over runtime-only fidelity and also required the set to remain complete. That combination rules out a strict "capture only what runs for real" approach and instead favors a second artifact set that reduces invented UI while still allowing mocked state. A separate folder keeps comparison with the original `Full coverage` set clean.

**What was added beyond requirements:** A comparison-oriented second artifact folder was created rather than overwriting the first set, and the higher-fidelity harness adopts patient-file tabs, medication subtabs, and ERezept table columns directly from `pvs-base-1` source cues.

**Trade-off:** Backend-heavy screens such as ERP processing and retrieval still rely on mocked states. The gain is stronger visual alignment to source UI structure, but the output is still not a live runtime capture from Quickable or a fully booted `pvs-base-1` environment.

**Pushback expected:** Someone may argue that mocked ERP states cannot be called higher fidelity. Counter: within the user-approved definition, fidelity here means closer adherence to source UI structure, labels, and action models, not backend authenticity.
