---
Version: 1.0
Last Updated: 2026-03-19
---

# Patient Check-In — Compliance Screen Inventory

**Generated:** 2026-03-19
**Source:** FLOW260318-patient-checkin-flow-diagram.md
**Scope:** Workflow 1 — Patient Check-In Compliance Gates (64 obligations: 35 covered + 29 gaps)
**Total Surfaces:** 11

---

## Summary

### By Role

| Role | Count |
|------|-------|
| MFA | 9 |
| Doctor | 0 |
| Admin | 2 |

### By Sub-Diagram

| Sub-Diagram | Count |
|-------------|-------|
| Main Diagram | 1 |
| 1a. Card Read-In | 3 |
| 1b. VSDM & Insurance | 3 |
| 1c. HZV/FAV Messages | 1 |
| Gaps / New Flows | 3 |

### By Design Tier

| Tier | Description | Count |
|------|-------------|-------|
| 1 | Foundation — daily use, design-blocking, most complex | 3 |
| 2 | High priority — essential, high visibility | 3 |
| 3 | Medium — supporting, gap-derived | 3 |
| 4 | Lower priority — admin, infrequent | 2 |

### Obligation Coverage

| Category | Count |
|----------|-------|
| Covered obligations (in flow diagrams) | 35 |
| Gap obligations (missing from diagrams) | 29 |
| **Total** | **64** |

---

## Main Diagram — Routing Logic

### CI-001: Check-In Routing Screen

- **Source:** 1. Main Diagram — Routing Logic
- **Primary Role:** MFA
- **Design Tier:** 1 — Foundation screen. All check-in flows start here. Determines KV vs HZV/FAV path.
- **Complexity:** High
- **KV/HZV Divergence:** Yes

> The primary routing screen after card read. Determines whether patient follows the KV (statutory) or HZV/FAV (selective contract) path based on IK membership in Selektivvertragsdefinitionen and active participation status via HPM.

**Covered Obligations:** PSDV654, VERT484, VERT582, VERT646, VERT833, VERT686, VERT1848, VERT1849

**Gap Obligations:** ALLG1032, VERT1878, VERT649

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Card Read Initiated | Patient arrives, eGK inserted | PSDV654 |
| VSDM Online Verification | KT master data loaded from card | — |
| IK Check — KV Path | IK is NOT in Selektivvertragsdefinitionen | — |
| IK Check — HZV/FAV Path | IK IS in Selektivvertragsdefinitionen + active participation via HPM | VERT484, VERT582, VERT833, VERT646 |
| IK Check — No Participation | IK in Selektivvertragsdefinitionen but no active participation | VERT484, VERT582 |
| No eGK-Nummer Block | Patient has no valid eGK-Nummer | VERT1848, VERT1849 |
| Contract Feature Gate — Permitted | Contract supports the requested feature | VERT686 |
| Contract Feature Gate — Blocked | Contract does not support the requested feature | VERT686 |
| Enter Documentation | KV or HZV/FAV Schein created successfully | — |

**Components:**

| Component | Description |
|-----------|-------------|
| Path Indicator | Visual indicator showing whether patient is on KV or HZV/FAV path. Uses distinct styling per path. |
| Participation Status Banner | Auto-displayed banner showing HZV/FAV participation status (VERT833). Appears without manual query. |
| eGK-Nummer Block Hint | Warning hint: participation status cannot be determined without valid eGK-Nummer. Only during active determination. |

---

## 1a. Card Read-In Detail

### CI-002: Card Read Screen

- **Source:** 1a. Card Read-In Detail
- **Primary Role:** MFA
- **Design Tier:** 1 — Most complex screen. 12 states, 17 gap obligations. Design-blocking: patterns propagate downstream.
- **Complexity:** High
- **KV/HZV Divergence:** No

> The card reading interface. Handles eGK/KVK card type detection, field mapping per KBV spec, field-level controls (official = read-only, user = editable), FK 4109 auto-set, re-read updates across billing records, cost carrier resolution via IK, and care context selection (ambulant/stationär).

**Covered Obligations:** KP2-100, KP2-101, KP2-102, P2-105, P2-120, KP2-121, P2-135, P2-136, P2-150, KP2-185, P2-200, KP2-195

**Gap Obligations:** KP2-300, KP2-310, P2-400, P2-401, P2-402, P2-403, KP2-404, KP2-405, P2-410, P2-420, P2-440, P2-452, P2-460, P2-470, KP2-500, P2-501, P2-558

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Insert Card | Staff initiates card read | KP2-100 |
| eGK Read | eGK card detected | KP2-100 |
| KVK Check — Has eGK | KVK for patient already read on eGK | KP2-121 |
| KVK Rejected — GKV Patient | KVK for statutory patient (post 01/2015) | KP2-101, KP2-102 |
| KVK Read — Private | KVK for private (non-GKV) patient | — |
| Field Mapping Complete | eGK or KVK data successfully read | P2-105 |
| Field Controls Applied | Field mapping complete | KP2-185 |
| FK 4109 Auto-Set | Card read completes | P2-135 |
| Re-Read — Records Updated | Card re-read within same quarter | P2-136, P2-150 |
| First Read — Resolve Carrier | First card read in quarter | P2-120, P2-200 |
| Care Context — Ambulant | Ambulant care context selected/detected | KP2-195 |
| Care Context — Stationär | Stationär care context selected/detected | KP2-195 |

**Components:**

| Component | Description |
|-----------|-------------|
| Card Type Detector | Automatically detects eGK vs KVK card type. Shows card type indicator. |
| Field Control Manager | Visual distinction between official (read-only) and user-editable fields. Lock icon or greyed background for official. |
| FK 4109 Display | Non-editable date field showing card read date. Auto-populated. |
| Re-Read Notification | Confirmation: previous date → new date + count of updated billing records. |
| Care Context Selector | Selector for ambulant vs stationär processing. |
| Manual Transfer Fallback | Action to initiate manual data transfer when KVK rejected. Links to CI-003. |

---

### CI-003: Manual Data Entry Form

- **Source:** 1a. Card Read-In Detail (Gap: P2-400, Recommendations Phase 3)
- **Primary Role:** MFA
- **Design Tier:** 3 — Gap-derived. Lower frequency (KVK rejection fallback). Discovery required.
- **Complexity:** Medium
- **KV/HZV Divergence:** No

> Full manual entry form for all insured person data fields per Tabelle 5. Used when KVK is rejected. Links to Cost Carrier Search (CI-004).

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** P2-400, P2-401, P2-402, P2-403, P2-410, P2-420, P2-440, P2-452, P2-460, P2-470, P2-558

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Empty Form | Manual transfer initiated from KVK rejection | P2-400, P2-401, P2-402 |
| Partially Filled | Staff enters patient data | P2-403, P2-460, P2-470 |
| Carrier Search Required | Staff needs to assign cost carrier | P2-410, P2-420 |
| Name/Address Deviation | Name/address differs from card data | P2-558 |
| Validated & Submitted | All required fields valid | P2-440, P2-452 |

**Components:**

| Component | Description |
|-----------|-------------|
| Tabelle 5 Field Set | Complete insured person data fields per KVDT Tabelle 5. Includes FK 4131, FK 4132 with defaults. |
| DMP Label Display | Shows FK 4132 codes in human-readable DMP program names. |
| PLZ Validator | Validates postal codes against PLZ master data. |
| Gender Selector | All options per PStG: male, female, diverse, unbestimmt. |

---

### CI-004: Cost Carrier Search

- **Source:** 1a + 1b (Gaps: P2-410, P2-420, P2-270, P2-275, Recommendations Phase 3)
- **Primary Role:** MFA
- **Design Tier:** 3 — Shared reusable component. Gap-derived. Important for carrier resolution fallback.
- **Complexity:** Medium
- **KV/HZV Divergence:** No

> Shared lookup component for finding cost carriers. Used by CI-003 (Manual Entry) and CI-005 (Unknown IK). Search by IK, name, location, VKNR. Temporary carrier record creation.

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** P2-270, P2-275, P2-410, P2-420

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Search — By IK | Staff enters IK number | P2-410 |
| Search — By Name/Location/VKNR | Staff enters name, location, or VKNR | P2-420 |
| Results — Match Found | Search returns matching carriers | P2-410, P2-420 |
| Results — No Match + Temp Record | No carrier found | P2-270, P2-275 |

**Components:**

| Component | Description |
|-----------|-------------|
| Search Input | Multi-mode search: IK vs name/location/VKNR. |
| Results List | Carrier results: name, IK, VKNR, KTAB, billing status. Selectable rows. |
| Temp Record Creator | Create temporary carrier record when no match. KV contact advisory. |

---

## 1b. VSDM & Insurance Validation

### CI-005: VSDM & Insurance Verification Screen

- **Source:** 1b. VSDM & Insurance Validation Detail
- **Primary Role:** MFA
- **Design Tier:** 1 — Critical validation. 16 states, many decision paths. Revenue-protecting.
- **Complexity:** High
- **KV/HZV Divergence:** Yes

> Insurance validation flow after card data is loaded. VSDM online check, FK 4136 proof status, timestamp validation, under-18 fee exemption, coverage validity, carrier billing capability (active/dissolved/merged), IK validity, mid-quarter changes, insurance change splits, Stammdaten conflict.

**Covered Obligations:** KP2-190, KP2-191, P2-140, P2-166, P2-210, P2-220, P2-230, P2-260, P2-530, P2-535, KP2-557

**Gap Obligations:** P2-265, P2-270, P2-275, P2-285, P2-320, P2-325, P2-540, P2-520, P2-521

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| VSDM Online Check | Card data loaded from CI-002 | KP2-190 |
| FK 4136 Captured | VSDM check completes | KP2-190 |
| Timestamp Valid | VSDM timestamp within current quarter | KP2-191 |
| Timestamp Stale Warning | VSDM timestamp outside current quarter | KP2-191 |
| Under-18 Fee Exempt | Patient is under 18 | KP2-191 |
| Coverage Valid | Active coverage dates | P2-140 |
| Coverage Expired / Not Begun | Expired or not-yet-active coverage | P2-166 |
| Carrier Active — Billable | Active billing capability | P2-210 |
| Carrier Dissolved — Billing Blocked | Cost carrier dissolved | P2-230 |
| Carrier Merged — Redirect | Kassenfusion detected | P2-220 |
| IK Valid | IK is valid and current | P2-260 |
| IK Invalid / Expired — Override | IK invalid or outside validity | P2-260 |
| VSDM Data Changed Mid-Quarter | Official data changed via VSDM | KP2-557 |
| Insurance Changed — Split Required | Insurance changed within quarter | P2-530, P2-535 |
| Stammdaten Conflict Detected | eGK vs PVS data conflict | VERT1483 |
| No Conflicts — Proceed | No data conflicts | — |

**Components:**

| Component | Description |
|-----------|-------------|
| VSDM Status Badge | Verification status icon. Distinct for "verified this quarter" vs "stale." Shows FK 4136 + timestamp. |
| Coverage Status Indicator | Coverage validity (active/expired/not started) with dates. |
| Carrier Status Display | Carrier name, IK, VKNR, KTAB, billing status. |
| IK Warning Panel | Warning for invalid/expired IK with override action. |
| Billing Record Split Preview | Affected records, old vs new carrier, proposed split point. |
| Conflict Alert | Side-by-side eGK vs PVS data with resolution actions. |
| Fee Exemption Badge | Auto-displayed for under-18 Zuzahlungsbefreit patients. |

---

### CI-006: Billing Record Split Preview

- **Source:** 1b. VSDM & Insurance Validation (P2-530, P2-535, P2-540)
- **Primary Role:** MFA
- **Design Tier:** 2 — Important for billing accuracy. Financial impact.
- **Complexity:** Medium
- **KV/HZV Divergence:** No

> Dedicated view for previewing and confirming billing record splits triggered by insurance or status changes within a quarter.

**Covered Obligations:** P2-530, P2-535

**Gap Obligations:** P2-540

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Insurance Change Split Required | Insurance change detected within quarter | P2-530, P2-535 |
| Status Change Split Required | Personengruppe or status change within quarter | P2-540 |
| Split Confirmed | Staff confirms the split | P2-535 |

**Components:**

| Component | Description |
|-----------|-------------|
| Affected Records List | Billing records to be split with record type, dates, carrier. |
| Split Point Indicator | Visual timeline showing split date between old and new carrier/status. |

---

### CI-007: Personengruppe & KTAB Gate

- **Source:** 1b. VSDM & Insurance Validation (Gaps: P2-320, P2-325, P2-285)
- **Primary Role:** MFA
- **Design Tier:** 3 — Gap-derived guard rails. Important for special patient groups.
- **Complexity:** Low
- **KV/HZV Divergence:** No

> Decision gate for special patient groups. KTAB selection based on Besondere Personengruppe, AsylbLG restriction notice (PG 09), dissolved KTAB blocking.

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** P2-285, P2-320, P2-325

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Standard — No Action | Standard Personengruppe (default '00') | — |
| KTAB Selection Required | Besondere Personengruppe detected | P2-320 |
| AsylbLG Restriction Notice | Personengruppe 09 detected | P2-325 |
| KTAB Dissolved — Blocked | Billing area dissolved | P2-285 |

**Components:**

| Component | Description |
|-----------|-------------|
| KTAB Selector | Dropdown for billing area selection. Pre-selects recommended KTAB based on person group. |
| AsylbLG Notice | Informational banner for restricted entitlement. Neutral info style. |

---

## 1c. HZV/FAV Status Messages

### CI-008: HPM Participation Query Display

- **Source:** 1c. HZV/FAV Status Messages Detail
- **Primary Role:** MFA
- **Design Tier:** 2 — Critical for HZV/FAV path. High visibility on every eligible patient.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes

> Displays HzV and FaV participation status messages returned from HPM queries. Distinct messages for active vs no participation per contract type.

**Covered Obligations:** VERT495, VERT581, VERT1483

**Gap Obligations:** _(none)_

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| HzV Active | HPM returns active HzV | VERT495 |
| HzV No Participation | HPM returns no HzV | VERT495 |
| FaV Active | HPM returns active FaV | VERT581 |
| FaV No Participation | HPM returns no FaV | VERT581 |
| Stammdaten Conflict | eGK vs PVS data conflict during query | VERT1483 |

**Components:**

| Component | Description |
|-----------|-------------|
| HzV Status Card | HzV participation status with contract name, badge, and message. |
| FaV Status Card | FaV participation status with contract name, badge, and message. |

---

## Gaps / New Flows

### CI-009: Quarter Transition Screen

- **Source:** Gaps (P2-520, P2-521, Recommendations Phase 3)
- **Primary Role:** Admin | **Secondary:** MFA
- **Design Tier:** 4 — System-level. Once per quarter. Low design complexity but functionally critical.
- **Complexity:** Medium
- **KV/HZV Divergence:** No

> System-level process for quarter transitions. Closure, carry-forward of open billing cases, and new quarter initialization.

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** P2-520, P2-521

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Quarter End Triggered | Quartalswechsel detected | P2-520 |
| Cases Listed for Closure | Open billing cases identified | P2-520 |
| Carry-Forward Preview | Open cases for carry-forward | P2-521 |
| New Quarter Initialized | Transition complete | P2-520, P2-521 |

**Components:**

| Component | Description |
|-----------|-------------|
| Transition Progress Indicator | Step-by-step: closure → carry-forward → initialization. |
| Carry-Forward Cases List | Cases being carried forward with patient name, record type, reason. |

---

### CI-010: Vollimport Matching Screen

- **Source:** Gaps (VERT1878, Recommendations Phase 2c)
- **Primary Role:** Admin | **Secondary:** MFA
- **Design Tier:** 4 — Admin-level, infrequent. Used during migration or initial setup.
- **Complexity:** Medium
- **KV/HZV Divergence:** No

> Bulk patient data import (Vollimport) from PTV. Auto-transfers when matched by eGK-Nummer. Prompts for exceptions.

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** VERT1878

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Import In Progress | Vollimport initiated | VERT1878 |
| eGK Match — Auto-Transfer | Patient matched by eGK-Nummer | VERT1878 |
| No Match — User Prompt | Patient cannot be matched | VERT1878 |
| Conflict — Resolution Required | Match found but data conflicts | VERT1878 |

**Components:**

| Component | Description |
|-----------|-------------|
| Import Progress Bar | Processed/total/error counts. |
| Exception Resolution List | Unmatched or conflicting patients with manual resolution actions. |

---

### CI-011: Re-Enrollment Notice

- **Source:** Gaps (VERT649, Recommendations Phase 2c)
- **Primary Role:** MFA
- **Design Tier:** 2 — Important for HZV/FAV continuity. If missed, patient loses contract benefits.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes

> Triggered when Kassenwechsel detected for patient with active HZV/FAV participation. Notice that patient needs new enrollment under new insurer.

**Covered Obligations:** _(none — entirely gap-derived)_

**Gap Obligations:** VERT649

**States:**

| State | Trigger | Obligation IDs |
|-------|---------|---------------|
| Insurance Change Detected | Kassenwechsel + active Teilnahme | VERT649 |
| Re-Enrollment Required | System confirms renewal needed | VERT649 |
| Notice Acknowledged | Staff acknowledges | VERT649 |

**Components:**

| Component | Description |
|-----------|-------------|
| Insurance Change Alert | Old insurer → new insurer with visual diff styling. |
| Create TE Action | Button to create new enrollment declaration under new insurer. |
