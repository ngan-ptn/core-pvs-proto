---
Version: 1.0
Last Updated: 2026-03-19
---

# Compliance Workflow Screen Inventory

**Generated:** 2026-03-19
**Source:** FLOW260318-master-compliance-workflows.md
**Scope:** Potential screens derived from 14 compliance workflows (604 obligations)
**Total Surfaces:** 48

---

## Summary

### By Role

| Role | Count |
|------|-------|
| MFA | 22 |
| Doctor | 22 |
| Admin | 4 |

### By Workflow

| Workflow | Count |
|----------|-------|
| Patient Check-In & Registration | 4 |
| Contract Participation Management | 4 |
| Patient Enrollment | 4 |
| Billing Documentation | 5 |
| Billing Process | 6 |
| Diagnosis Entry & Coding | 5 |
| Service Documentation | 4 |
| Prescription & Drug Safety | 5 |
| Form Management | 3 |
| Hilfsmittel Prescribing | 3 |
| eDMP & Chronic Care | 3 |
| eArztbrief, eAU & ePA | 3 |
| IT Connectivity & Infrastructure | 2 |
| Compliance Summary | 1 |

### By Design Tier

| Tier | Description | Count |
|------|-------------|-------|
| 1 | Foundation — daily use, design-blocking, most complex | 6 |
| 2 | High priority — essential core workflows | 16 |
| 3 | Medium — supporting screens, moderate complexity | 17 |
| 4 | Lower priority — admin, config, edge cases | 6 |
| 5 | Deferred — rare use, reference views | 3 |

---

## 1. Patient Check-In & Registration

### Card Read / Check-In Screen

- **ID:** CS-101
- **Source:** WF-1 Patient Check-In — Compliance Gates
- **Primary Role:** MFA
- **Design Tier:** 1 — Foundation screen. All check-in flows start here. Highest state count. Design patterns propagate downstream.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~29 | Key: PSDV654, KP2-100, KP2-185, P2-135, P2-200

> Primary interface for reading patient eGK/KVK cards. Handles card type detection, field mapping per KBV spec, field-level controls, FK 4109 auto-set, re-read updates, cost carrier resolution, and care context selection.

**States:**

| State | Trigger |
|-------|---------|
| Idle | No card action in progress |
| eGK Reading | eGK inserted |
| KVK Rejected | KVK for statutory patient |
| Success — Fields Mapped | Card data read successfully |
| Re-Read Update | Re-read within quarter |
| Carrier Resolved | IK/VKNR resolved |

---

### VSDM & Insurance Verification Panel

- **ID:** CS-102
- **Source:** WF-1 Patient Check-In — Compliance Gates
- **Primary Role:** MFA
- **Design Tier:** 1 — Critical validation with many decision paths. Revenue-protecting.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~20 | Key: KP2-190, P2-140, P2-210, P2-530, VERT1483

> Insurance validation flow after card read. Handles VSDM online check, coverage validity, carrier billing capability (active/dissolved/merged), IK validity, mid-quarter changes, insurance change splits, and Stammdaten conflicts.

**States:**

| State | Trigger |
|-------|---------|
| VSDM Online Check | Card data loaded |
| Coverage Valid | Active coverage dates |
| Coverage Expired | Expired or not-yet-begun coverage |
| Carrier Dissolved | Cost carrier dissolved |
| Carrier Merged | Kassenfusion detected |
| IK Warning | Invalid/expired IK |
| Insurance Change — Split | Insurance changed mid-quarter |
| Stammdaten Conflict | eGK vs PVS conflict |

---

### KV / HZV Path Router

- **ID:** CS-103
- **Source:** WF-1 Patient Check-In — Compliance Gates
- **Primary Role:** MFA
- **Design Tier:** 2 — Essential routing screen. Determines entire downstream path.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~9 | Key: VERT484, VERT582, VERT686, VERT1848

> Routing logic after VSDM verification. Determines KV (statutory) vs HZV/FAV (selective contract) path based on IK membership in Selektivvertragsdefinitionen and HPM participation check.

**States:**

| State | Trigger |
|-------|---------|
| KV Path Selected | IK not in Selektivvertragsdefinitionen |
| HZV/FAV Path Selected | Active participation confirmed via HPM |
| Contract Feature Blocked | Feature not supported by contract |
| No eGK-Nummer Block | No valid eGK-Nummer |

---

### HPM Participation Status Display

- **ID:** CS-104
- **Source:** WF-1 Patient Check-In — Compliance Gates
- **Primary Role:** MFA
- **Design Tier:** 2 — High visibility. MFA sees this on every HZV/FAV patient.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~6 | Key: VERT495, VERT581, VERT833, VERT646

> Displays HzV and FaV participation status messages from HPM queries. Auto-displayed on HZV/FAV-eligible patients.

**States:**

| State | Trigger |
|-------|---------|
| HzV Active | HPM returns active HzV |
| HzV No Participation | HPM returns no HzV |
| FaV Active | HPM returns active FaV |
| FaV No Participation | HPM returns no FaV |

---

## 2. Contract Participation Management

### Participation Lifecycle Manager

- **ID:** CS-201
- **Source:** WF-2 Contract Participation Management — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 2 — Core HZV/FAV lifecycle screen.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~15 | Key: VERT641, VERT642, VERT644, VERT645, VERT1181

> Manages the full HZV/FAV participation lifecycle: request, activate, end, reverse termination, cancel. Integrated with HPM for online status checks.

**States:**

| State | Trigger |
|-------|---------|
| Request Participation | Staff initiates request |
| Activated | HPM confirms |
| Terminated | Staff ends participation |
| Termination Reversed | Staff reverses termination |
| Re-Enrollment Triggered | Insurance change for active participant |

---

### HPM Status Query Panel

- **ID:** CS-202
- **Source:** WF-2 Contract Participation Management — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 3 — On-demand query, less frequent.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~5 | Key: VERT494, VERT643, VERT857

> Panel for checking participation status online via HPM. On-demand query (separate from auto-display).

**States:**

| State | Trigger |
|-------|---------|
| Query In Progress | Staff initiates status check |
| Status Returned | HPM responds |
| FAV Verified | FAV-specific verification |

---

### Module Contract Activation Gate

- **ID:** CS-203
- **Source:** WF-2 Contract Participation Management — HZV/FAV Only
- **Primary Role:** MFA | **Secondary:** Admin
- **Design Tier:** 3 — Guard rail. Infrequent but prevents invalid contract states.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~3 | Key: VERT791

> Checks whether main contract is active before allowing module contract activation.

**States:**

| State | Trigger |
|-------|---------|
| Main Active — Module Allowed | Main contract active |
| Main Inactive — Module Blocked | Main contract not active |

---

### Participation Window Checker

- **ID:** CS-204
- **Source:** WF-2 Contract Participation Management — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 3 — Simple gate for HZV/FAV.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~3 | Key: VERT647, VERT648

> Validates whether documentation is allowed within the participation window.

**States:**

| State | Trigger |
|-------|---------|
| Within Window | Current date within participation window |
| Outside Window | Current date outside window |

---

## 3. Patient Enrollment

### Enrollment Declaration Form

- **ID:** CS-301
- **Source:** WF-3 Patient Enrollment — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 2 — Core HZV/FAV enrollment.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~8 | Key: VERE466, VERE555, VERE556, VERE1845

> Form for creating Teilnahmeerklaerungen (enrollment declarations). Handles the TE lifecycle from creation through printing, with missing data warnings.

**States:**

| State | Trigger |
|-------|---------|
| Erzeugt (Created) | Staff creates new TE |
| Missing Data Warning | Required data missing |
| Gedruckt (Printed) | Staff prints TE |

---

### Signature Dialog

- **ID:** CS-302
- **Source:** WF-3 Patient Enrollment — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 3 — Supports enrollment flow.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~5 | Key: VERE558, VERE560, VERE1133

> Signature capture for enrollment declarations. HZV: 2 signatures + TE-Code. FAV: 1 signature + TE-Code. Checks prerequisites before transmission.

**States:**

| State | Trigger |
|-------|---------|
| HZV Signature | HZV TE ready |
| FAV Signature | FAV TE ready |
| Prerequisites Met | All prereqs satisfied |
| Prerequisites Unmet | Missing prereqs |

---

### TE Transmission Status Panel

- **ID:** CS-303
- **Source:** WF-3 Patient Enrollment — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 3 — Status tracking.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~7 | Key: VERE561, VERE562, VERE1682, VERE1881

> Tracks TE transmission lifecycle. Shows success/error states, handles FAV auto-activation, persists TE ID, blocks re-send.

**States:**

| State | Trigger |
|-------|---------|
| Transmitting | TE sent to HPM |
| Erfolgreich (Successful) | HPM confirms receipt |
| Fehlerhaft (Error) | Transmission fails |
| FAV Auto-Activated | Successful FAV TE |

---

### Unsent Declaration Notification

- **ID:** CS-304
- **Source:** WF-3 Patient Enrollment — HZV/FAV Only
- **Primary Role:** MFA
- **Design Tier:** 4 — Background notification. System-driven.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~3 | Key: VERE563, VERE564

> Daily check for unsent enrollment declarations. Notifies staff of TEs that haven't been transmitted.

**States:**

| State | Trigger |
|-------|---------|
| Unsent TEs Found | Daily check finds unsent TEs |
| No Unsent TEs | All TEs transmitted |

---

## 4. Billing Documentation

### Service Code (GNR) Entry Screen

- **ID:** CS-401
- **Source:** WF-4 Billing Documentation — KV vs HZV/FAV Divergence
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 1 — Core daily workflow. Every patient encounter requires service documentation.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~12 | Key: ABRD456, ABRD608, ABRD679, ABRD611

> Primary service documentation screen. GNR entry, Arzt-Patienten-Kontakt check, diagnosis linking per §295, ICD-10 validation, terminal code prompting.

**States:**

| State | Trigger |
|-------|---------|
| GNR Entry | Doctor enters service code |
| Missing 0000 Prompt | Code 0000 not present |
| Diagnosis Linked | Diagnoses associated |
| Acute-as-Permanent Warning | Acute code set as Dauerdiagnose |

---

### KV Statutory Documentation View

- **ID:** CS-402
- **Source:** WF-4 Billing Documentation — KV vs HZV/FAV Divergence
- **Primary Role:** Doctor
- **Design Tier:** 2 — Essential for statutory billing.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: ABRD603, ABRD991, ABRD992

> KV-specific documentation rules: filter by KV region, OPS per EBM Annex 2.

**States:**

| State | Trigger |
|-------|---------|
| Region Filtered | GNR entered on KV path |
| OPS Required | Service requires OPS |

---

### HZV/FAV Contract Documentation View

- **ID:** CS-403
- **Source:** WF-4 Billing Documentation — KV vs HZV/FAV Divergence
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 2 — Complex with many conditional fields.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~15 | Key: ABRD605, ABRD606, ABRD1681, ABRD601, ABRD850

> HZV/FAV-specific documentation: participation check, IK filter, FAV online verify, contract labeling, referral LANR/BSNR, cover letter, material costs, billing justification.

**States:**

| State | Trigger |
|-------|---------|
| Active Participation | Patient has active HZV/FAV |
| No Participation — Blocked | No active participation |
| FAV Verified | FAV online verification succeeds |
| Referral Fields Required | Contract requires referral info |
| Cover Letter Required | FAV contract |

---

### Dauerdiagnosen Carry-Forward Panel

- **ID:** CS-404
- **Source:** WF-4 Billing Documentation — KV vs HZV/FAV Divergence
- **Primary Role:** Doctor
- **Design Tier:** 3 — Quarter-boundary process.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~5 | Key: ABRD609, ABRD514, ABRD969

> Manages carry-forward of permanent diagnoses across quarters. Warns when acute codes are used as Dauerdiagnosen.

**States:**

| State | Trigger |
|-------|---------|
| Carry Forward Applied | New quarter starts |
| Acute-as-Permanent Warning | Acute code in Dauerdiagnosen |

---

### Billing Record Audit Trail

- **ID:** CS-405
- **Source:** WF-4 Billing Documentation — KV vs HZV/FAV Divergence
- **Primary Role:** Admin
- **Design Tier:** 4 — Compliance guard rail. Low design complexity.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~2 | Key: ABRD607

> Protects submitted billing records from deletion. Maintains audit trail for compliance.

**States:**

| State | Trigger |
|-------|---------|
| Not Submitted — Editable | Record not yet submitted |
| Submitted — Locked | Record has been submitted |

---

## 5. Billing Process

### Billing Control List Screen

- **ID:** CS-501
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 2 — Gateway to billing submission.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~6 | Key: ABRG614, ABRG993, ABRG803

> Pre-submission review of billing data. Generates control list and allows case/contract selection.

**States:**

| State | Trigger |
|-------|---------|
| Control List Generated | Staff opens billing |
| Cases Selected | Staff selects cases/contracts |

---

### HPM Billing Validation Panel

- **ID:** CS-502
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 2 — Revenue-protecting: prevents billing rejections.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: ABRG615, ABRG667, ABRG616

> HPM validation of billing data before submission. Error correction loop.

**States:**

| State | Trigger |
|-------|---------|
| Validation In Progress | Validation triggered |
| No Errors | All services valid |
| Errors Found | Invalid services detected |

---

### Transmission Channel Selector

- **ID:** CS-503
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 3 — Simple selection. Offline is rare.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~3 | Key: ABRG927, ABRG386, ABRG929

> Selection between online transmission and offline data carrier export.

**States:**

| State | Trigger |
|-------|---------|
| Online Selected | Staff selects online |
| Offline Selected | Staff selects offline |

---

### KV Billing Submission Screen

- **ID:** CS-504
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 2 — Core KV billing submission path.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: ABRG829

> KV statutory billing submission. Checks for HZV patients in KV billing to prevent conflicts.

**States:**

| State | Trigger |
|-------|---------|
| HZV Conflict Check | KV billing submitted |
| No Conflicts — Submitted | No HZV conflicts |
| Conflict Found | HZV patient in KV billing |

---

### HZV/FAV Billing Submission Screen

- **ID:** CS-505
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 2 — HZV/FAV billing path.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~8 | Key: ABRG958, ABRG961, ABRG454, ABRG493, ABRD1008

> HZV/FAV selective contract billing submission. Pre-participation check, contract-specific rules, Medi contract post-edit.

**States:**

| State | Trigger |
|-------|---------|
| Pre-Participation Check | HZV/FAV billing submitted |
| Contract Rules Applied | Participation confirmed |
| Submitted | Validation passes |
| Post-Submission Edit | Medi contract |

---

### Post-Submission Confirmation Screen

- **ID:** CS-506
- **Source:** WF-5 Billing Process — KV vs HZV/FAV Submission
- **Primary Role:** MFA
- **Design Tier:** 3 — Completion screen.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~8 | Key: ABRG490, ABRG491, ABRG933, ABRG486

> Post-submission confirmation, protocol PDF display, warning log, and duplicate prevention.

**States:**

| State | Trigger |
|-------|---------|
| Marked as Transmitted | Submission complete |
| Confirmation Displayed | After marking |
| Protocol PDF Available | After confirmation |
| Warnings Logged | Warnings present |

---

## 6. Diagnosis Entry & Coding

### ICD-10 Search & Entry Screen

- **ID:** CS-601
- **Source:** WF-6 Diagnosis Entry & Coding Validation
- **Primary Role:** Doctor
- **Design Tier:** 1 — Core daily workflow. Every diagnosis entry passes through here.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~15 | Key: ICD-GM.26, ICD-GM.1-4

> Primary diagnosis entry. ICD-10 catalog search, code validation, terminal code prompting, Diagnosensicherheit (V/G/A/Z) selection.

**States:**

| State | Trigger |
|-------|---------|
| Search Active | Doctor types ICD code |
| Code Valid — Terminal | Valid terminal code selected |
| Code Valid — Non-Terminal | Non-terminal code selected |
| Code Rejected | Non-existent code entered |
| Diagnosensicherheit Selected | V/G/A/Z chosen |

---

### Diagnosis Attributes & Laterality Selector

- **ID:** CS-602
- **Source:** WF-6 Diagnosis Entry & Coding Validation
- **Primary Role:** Doctor
- **Design Tier:** 2 — Extension of ICD-10 entry. Must be quick.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: ICD-GM.7

> Additional diagnosis attributes: laterality (R/L/B), explanatory text, exception indicator.

**States:**

| State | Trigger |
|-------|---------|
| Laterality Required | Code requires laterality |
| Laterality Not Required | No laterality needed |
| Diagnosis Saved | All attributes confirmed |

---

### Plausibility Warning Panel

- **ID:** CS-603
- **Source:** WF-6 Diagnosis Entry & Coding Validation
- **Primary Role:** Doctor
- **Design Tier:** 3 — Warning patterns. Non-blocking but visible.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~8 | Key: ICD-GM.14, ICD-GM.15, ABRD786, ABRD887

> Non-blocking plausibility warnings: gender mismatch, age mismatch, acute + Z marker, repeated suspected diagnosis.

**States:**

| State | Trigger |
|-------|---------|
| Gender Mismatch Warning | Code gender conflicts with patient |
| Age Mismatch Warning | Code age conflicts with patient |
| Z Marker on Acute Warning | Z status on acute code |
| Repeated Suspected Warning | V diagnosis repeated across quarters |

---

### Coding Rules Violation Overview

- **ID:** CS-604
- **Source:** WF-6 Diagnosis Entry & Coding Validation
- **Primary Role:** Doctor
- **Design Tier:** 2 — Revenue-protecting: coding violations = billing rejections.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~10 | Key: ICD-GM.40-47

> SDKRW coding rule engine results. Violations with proposed corrections (DELETE/REPLACE/ADD).

**States:**

| State | Trigger |
|-------|---------|
| No Violations | Rule engine finds no issues |
| Violations Found | Rule engine finds violations |
| Correction Accepted | Doctor accepts correction |
| Correction Rejected | Doctor rejects correction |

---

### HZV/FAV Diagnosis Checks Panel

- **ID:** CS-605
- **Source:** WF-6 Diagnosis Entry & Coding Validation
- **Primary Role:** Doctor
- **Design Tier:** 3 — HZV/FAV-specific extension.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~8 | Key: ABRD967, ABRD1546, ABRD965, ABRD609

> HZV/FAV-specific diagnosis checks: multimorbidity, disease pattern, carry-forward review for Dauerdiagnosen.

**States:**

| State | Trigger |
|-------|---------|
| Multimorbidity Check | Diagnosis saved on HZV/FAV patient |
| Disease Pattern Matches | Pattern check returns matches |
| Carry-Forward Review | New quarter for HZV/FAV patient |

---

## 7. Service Documentation

### EBM Service Validation Screen

- **ID:** CS-701
- **Source:** WF-7 Service Documentation — KVDT Compliance
- **Primary Role:** Doctor
- **Design Tier:** 2 — Runs on every service code entry.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~8 | Key: EBM.1, EBM.2, EBM.3, EBM.4, EBM.5-8

> KV EBM validation chain: gender, age, frequency, specialty, exclusion checks.

**States:**

| State | Trigger |
|-------|---------|
| All Checks Pass | Service passes all EBM rules |
| Gender Check Fail | Service restricted by gender |
| Age Check Fail | Patient age outside range |
| Frequency Limit Hit | Service exceeds frequency limit |
| Specialty Gate Fail | Service not for this specialty |
| Exclusion Found | Service conflicts with another |

---

### HZV/FAV Contract Service Filter

- **ID:** CS-702
- **Source:** WF-7 Service Documentation — KVDT Compliance
- **Primary Role:** Doctor
- **Design Tier:** 3 — Parallel to EBM validation for contract path.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~4 | Key: ABRD605, ABRD606, ABRD603

> HZV/FAV service validation: participation check, IK filter, KV region filter, contract service catalog.

**States:**

| State | Trigger |
|-------|---------|
| Participation Active | Patient has active participation |
| Filtered by IK + Region | Filters applied |
| No Participation | No active participation |

---

### TSS Surcharge Calculator

- **ID:** CS-703
- **Source:** WF-7 Service Documentation — KVDT Compliance
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 3 — Conditional UI for TSS cases only.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~2 | Key: KBV TSS

> Calculates TSS appointment surcharge category (A/B/C/D) based on referral timing.

**States:**

| State | Trigger |
|-------|---------|
| TSS Case Detected | TSS flag set |
| Category Displayed | Surcharge calculated |

---

### OPS Code Entry & Validation

- **ID:** CS-704
- **Source:** WF-7 Service Documentation — KVDT Compliance
- **Primary Role:** Doctor
- **Design Tier:** 3 — Conditional extension.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~2 | Key: ABRD992

> OPS code entry and validation against catalog per EBM Annex 2.

**States:**

| State | Trigger |
|-------|---------|
| OPS Required | Service requires OPS code |
| OPS Validated | Code entered and validated |

---

## 8. Prescription & Drug Safety

### Drug Search & Selection Screen

- **ID:** CS-801
- **Source:** WF-8 Prescription & Drug Safety
- **Primary Role:** Doctor
- **Design Tier:** 1 — Core daily workflow. Every prescription starts here.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~8 | Key: 3.19 E-Rezept

> Primary prescribing interface. Drug search, selection, and context determination.

**States:**

| State | Trigger |
|-------|---------|
| Search Active | Doctor types drug name/substance |
| Drug Selected | Doctor selects a drug |

---

### Drug Safety Check Panel

- **ID:** CS-802
- **Source:** WF-8 Prescription & Drug Safety
- **Primary Role:** Doctor
- **Design Tier:** 1 — Patient safety critical. Must be immediately visible.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~10 | Key: 3.19.INTERACT, 3.19.DOSAGE, 3.19.RED

> Drug safety checks: interaction, dosage, Red Hand Letter alerts.

**States:**

| State | Trigger |
|-------|---------|
| No Issues | All checks pass |
| Interaction Alert — Severe | Severe interaction detected |
| Dosage Warning | Dosage outside range |
| Red Hand Letter | Drug has active safety alert |

---

### KV Prescribing Rules View

- **ID:** CS-803
- **Source:** WF-8 Prescription & Drug Safety
- **Primary Role:** Doctor
- **Design Tier:** 2 — KV prescribing compliance.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~6 | Key: VSST527, VSST1543, VSST784

> KV statutory prescribing rules: AVWG, aut-idem, PIM/PRISCUS labeling.

**States:**

| State | Trigger |
|-------|---------|
| AVWG Compliant | Drug meets AVWG rules |
| AVWG Warning | AVWG deviation detected |
| PIM/PRISCUS Labeled | Drug on PRISCUS list |

---

### HZV/FAV Contract Prescribing View

- **ID:** CS-804
- **Source:** WF-8 Prescription & Drug Safety
- **Primary Role:** Doctor
- **Design Tier:** 2 — Complex color-coding system.
- **Complexity:** High
- **KV/HZV Divergence:** Yes
- **Obligations:** ~12 | Key: VSST537, VSST541, VSST539, VSST854, FORM513

> HZV/FAV prescribing: insurance categories, HPM recommendations, color-coded pricing (gruen/blau = rabattiert, rot/orange = substitutions), PRISCUS column, contract print rules.

**States:**

| State | Trigger |
|-------|---------|
| Categories Loaded | Drug selected on HZV/FAV path |
| HPM Recommendations | HPM returns recommendations |
| Gruen/Blau — Rabattiert | Drug is discounted |
| Rot/Orange — Substitutions | Drug is expensive/flagged |
| PRISCUS Flagged | Drug on PRISCUS list |

---

### E-Rezept Signing Screen

- **ID:** CS-805
- **Source:** WF-8 Prescription & Drug Safety
- **Primary Role:** Doctor
- **Design Tier:** 2 — Final step of every prescription.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: 3.19

> E-Rezept comfort signature and submission to Fachdienst.

**States:**

| State | Trigger |
|-------|---------|
| Ready to Sign | Prescription finalized |
| Signed | Signature provided |
| Submission Confirmed | Fachdienst confirms |

---

## 9. Form Management

### KV Statutory Form Generator

- **ID:** CS-901
- **Source:** WF-9 Form Management — KV vs HZV/FAV Forms
- **Primary Role:** MFA | **Secondary:** Doctor
- **Design Tier:** 3 — Standard form generation.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: FORM588, FORM610, FORM1844

> KV statutory forms: BFB (Muster 2/6/12/13/61), Muster 52.2, eAU validation.

**States:**

| State | Trigger |
|-------|---------|
| Form Selected | Staff selects KV form type |
| Form Filled | Data populated |
| eAU Validated | eAU validation runs |

---

### HZV/FAV Contract Form Manager

- **ID:** CS-902
- **Source:** WF-9 Form Management — KV vs HZV/FAV Forms
- **Primary Role:** MFA | **Secondary:** Doctor
- **Design Tier:** 3 — Many form types but similar patterns.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** ~15 | Key: FORM632, FORM635, FORM814, FORM1286, FORM1566

> HZV/FAV contract forms: gate check, cover letters, specialty reports, Schnellinformation, Befundboegen, Praeventionsverordnung, TE print per variant.

**States:**

| State | Trigger |
|-------|---------|
| Contract Gate — Enabled | Contract supports form type |
| Contract Gate — Disabled | Contract doesn't support form |
| Schnellinfo Not Printed Warning | Schnellinfo skipped |
| Praev Auto-Open | Diagnosis from AKA list |

---

### Form Validation & Print Screen

- **ID:** CS-903
- **Source:** WF-9 Form Management — KV vs HZV/FAV Forms
- **Primary Role:** MFA
- **Design Tier:** 3 — Shared completion screen.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~3 | Key: FORM1410

> Shared form validation and print for both KV and HZV/FAV forms.

**States:**

| State | Trigger |
|-------|---------|
| Validation Passed | All form fields valid |
| Validation Failed | Errors found |
| Printed | Staff prints form |

---

## 10. Hilfsmittel Prescribing

### Hilfsmittel Catalog Search Screen

- **ID:** CS-1001
- **Source:** WF-10 Practice Software (VSST) — Hilfsmittel Path
- **Primary Role:** Doctor
- **Design Tier:** 3 — Specialized prescribing. Lower frequency.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~4 | Key: VSST623, VSST624, VSST962

> Hilfsmittel catalog search by product, keyword, manufacturer. Sort by Produktgruppe > Anwendungsort > Untergruppe.

**States:**

| State | Trigger |
|-------|---------|
| Search Active | Doctor enters search terms |
| Product Selected | Doctor selects product |

---

### Steuerbare Hilfsmittel Workflow

- **ID:** CS-1002
- **Source:** WF-10 Practice Software (VSST) — Hilfsmittel Path
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 3 — Conditional workflow.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~6 | Key: VSST626, VSST627, VSST629, VSST630, VSST628

> Steuerbare Hilfsmittel: check vs list, questionnaire, Merkblatt, fax hint.

**States:**

| State | Trigger |
|-------|---------|
| Steuerbare Check | 7-digit product selected |
| Fragebogen Required | Questionnaire needed |
| Merkblatt Printed | After questionnaire |
| Not Steuerbare | Standard product |

---

### Hilfsmittel Prescription Form

- **ID:** CS-1003
- **Source:** WF-10 Practice Software (VSST) — Hilfsmittel Path
- **Primary Role:** Doctor
- **Design Tier:** 3 — Simple form.
- **Complexity:** Low
- **KV/HZV Divergence:** Yes
- **Obligations:** ~4 | Key: VSST625, VSST633, VSST530

> Prescription form: qty, Positionsnr, period, diagnosis. Standard (7-digit) vs exception (10-digit). HZV/FAV: transmission blocked.

**States:**

| State | Trigger |
|-------|---------|
| Standard Prescription | 7-digit product |
| Exception Prescription | 10-digit product |
| HZV/FAV — Transmission Blocked | HZV/FAV patient |

---

## 11. eDMP & Chronic Care

### DMP Program Selection Screen

- **ID:** CS-1101
- **Source:** WF-11 eDMP & Chronic Care Compliance
- **Primary Role:** Doctor
- **Design Tier:** 3 — Simple selection.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~4 | Key: VSST592, VSST1547, VSST677

> DMP program selection: DM1, DM2, KHK, Asthma, COPD, Brustkrebs.

**States:**

| State | Trigger |
|-------|---------|
| Program List | Doctor opens eDMP |
| Program Selected | Doctor selects a DMP |

---

### eDMP Documentation & Validation Form

- **ID:** CS-1102
- **Source:** WF-11 eDMP & Chronic Care Compliance
- **Primary Role:** Doctor
- **Design Tier:** 2 — Clinical documentation with scoring.
- **Complexity:** High
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: 3.21.eDMP, 3.21.VALID

> eDMP clinical documentation with validation and scoring calculator.

**States:**

| State | Trigger |
|-------|---------|
| Documentation Active | DMP program selected |
| Validated | Form validation runs |
| Score Calculated | After documentation |

---

### eDMP Transmission & Audit Screen

- **ID:** CS-1103
- **Source:** WF-11 eDMP & Chronic Care Compliance
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 3 — Standard pattern.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~4 | Key: VSST1020

> eDMP/eHKS transmission to DMP-Datenstelle with audit trail.

**States:**

| State | Trigger |
|-------|---------|
| Ready to Transmit | Documentation validated |
| Transmitted | Submission complete |
| Skipped | Transmission optionally skipped |
| eHKS Documented | eHKS path selected |

---

## 12. eArztbrief, eAU & ePA

### eAU Creation & Validation Screen

- **ID:** CS-1201
- **Source:** WF-12 eArztbrief, eAU & ePA Compliance
- **Primary Role:** Doctor
- **Design Tier:** 2 — Frequent daily workflow. Employment data gate needs clear UX.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~6 | Key: VSST599, VSST621, VSST622, VSST848

> eAU creation. Employment data currency check (blocks if stale >1yr). Depression hint for F32.9/F33.9.

**States:**

| State | Trigger |
|-------|---------|
| Employment Data Current | Data is current |
| Employment Data Stale | Data >1yr old |
| Depression Hint | F32.9/F33.9 + follow-up eAU |
| Signed & Transmitted | Doctor signs eAU |

---

### eArztbrief Compose & Send Screen

- **ID:** CS-1202
- **Source:** WF-12 eArztbrief, eAU & ePA Compliance
- **Primary Role:** Doctor
- **Design Tier:** 3 — Standard compose/send. KIM directory integration needs design.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~6 | Key: 3.20

> Electronic physician letters. Compose, select recipient from KIM directory, sign CDA R2, send via KIM.

**States:**

| State | Trigger |
|-------|---------|
| Composing | Doctor starts letter |
| Recipient Selected | Doctor selects from KIM directory |
| Signed | CDA R2 signature applied |
| Sent via KIM | Send triggered |

---

### ePA Document Browser

- **ID:** CS-1203
- **Source:** WF-12 eArztbrief, eAU & ePA Compliance
- **Primary Role:** Doctor | **Secondary:** MFA
- **Design Tier:** 3 — Standard browse/upload.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~5 | Key: 3.20

> Electronic patient record: browse documents, manage entitlements, upload.

**States:**

| State | Trigger |
|-------|---------|
| Browsing | Doctor opens ePA |
| Entitlements View | Doctor manages entitlements |
| Upload Active | Doctor uploads document |

---

## 13. IT Connectivity & Infrastructure

### Infrastructure Status Dashboard

- **ID:** CS-1301
- **Source:** WF-13 IT Connectivity & Infrastructure
- **Primary Role:** Admin
- **Design Tier:** 4 — Infrequent use but critical during outages.
- **Complexity:** Medium
- **KV/HZV Divergence:** No
- **Obligations:** ~15

> Monitoring dashboard for HPM, KIM, and TI connector status.

**States:**

| State | Trigger |
|-------|---------|
| All Systems Online | All services healthy |
| Service Degraded | One or more services degraded |
| Service Offline | Service unreachable |

---

### Optional Module Configuration Screen

- **ID:** CS-1302
- **Source:** WF-13 IT Connectivity & Infrastructure
- **Primary Role:** Admin
- **Design Tier:** 5 — Initial setup only.
- **Complexity:** Low
- **KV/HZV Divergence:** No
- **Obligations:** ~20

> Configuration for optional ITVE modules: eArztbrief, Hauskomet, TeleScan-Derma, DETE.

**States:**

| State | Trigger |
|-------|---------|
| Module List | Admin opens config |
| Module Configured | Admin enables/configures module |

---

## 14. Compliance Summary

### Compliance Path Overview Dashboard

- **ID:** CS-1401
- **Source:** WF-14 Compliance Obligation Summary by Path
- **Primary Role:** Admin
- **Design Tier:** 5 — Reference/reporting. Not daily workflow.
- **Complexity:** Medium
- **KV/HZV Divergence:** Yes
- **Obligations:** 604 total

> Summary dashboard: KV-only (16 items), HZV/FAV-only (~123 items), both paths (~465 items).

**States:**

| State | Trigger |
|-------|---------|
| Overview | Admin opens dashboard |
| Filtered by Path | Admin selects KV/HZV/Both |
