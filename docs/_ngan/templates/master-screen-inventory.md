# PVS-Core Master Screen Inventory

**Generated:** 2026-03-17  
**Total Surfaces:** 88  
**Gap Surfaces:** 4

---

## Summary

### By Role

| Role | Count |
|------|-------|
| MFA | 21 |
| Doctor | 51 |
| Admin | 16 |

### By Workflow

| Workflow | Count |
|----------|-------|
| Patient Check-In & Registration | 7 |
| Insurance & Enrollment (HZV/FAV) | 6 |
| Clinical Documentation | 10 |
| Service & Billing Documentation | 8 |
| Prescriptions | 16 |
| Forms & Certificates | 8 |
| Chronic Care Programs | 7 |
| Billing & Submission | 9 |
| Data Import & Sync | 2 |
| ePA & Document Exchange | 3 |
| Practice Administration | 4 |
| System Infrastructure | 8 |

### By Design Tier

| Tier | Description | Count |
|------|-------------|-------|
| 1 | Foundation Shells | 9 |
| 2 | Core Clinical Workflow | 15 |
| 3 | Extended Clinical & Specialty | 31 |
| 4 | HZV/FAV & Billing Specialty | 15 |
| 5 | Admin & Infrastructure | 18 |

---

## Patient Check-In & Registration

### Card Read / Check-In Screen

- **ID:** S001
- **Phase:** 1.1
- **Primary Role:** MFA
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 127.5 (33 states, 18 components, 3 extensions)
- **Extensions:** Extended by: 1.2, 1.3, 1.5.

> The primary interface where staff reads a patient's card. Contains the read trigger, terminal status, and result area. This single surface handles the entire card read flow through its states (below).

**States:**

| State | Trigger |
|-------|---------|
| Idle | No card action in progress |
| Reading | Staff initiates card read |
| Success | Valid eGK read completes |
| Success + Coverage Warning | Valid read, but coverage dates are expired or not yet active |
| Success + Re-Read | Card re-read for patient already read this quarter |
| Error: KVK Rejected | KVK detected for statutory patient (VKNR digits 3-5 < 800) |
| Error: KVK Rejected + Data Shown | Staff clicks "Show Card Data" on KVK error |
| Error: BPol KVK Blocked | KVK read attempted for BPol patient with existing eGK on file |
| Success + Billable | IK is valid, within validity period, cost carrier has active billing capability |
| Success + Fusion Redirect | IK maps to a cost carrier that has merged into another |
| Error: Carrier Dissolved | Cost carrier associated with the IK has been dissolved |
| Warning: IK Expired + Override | IK is invalid or outside validity period |
| Error: Carrier Not Permitted in Region | Cost carrier is not authorized in the practice's KV region |
| Warning: Unknown IK | IK is not found in the KT master data file |
| Error: Billing Area Dissolved | The KTAB (billing area) of the cost carrier has been dissolved |
| Success + Insurance Change Detected | Card read for existing patient, but insurer/IK differs from stored record |
| Success + KTAB Selection Required | Besondere Personengruppe (FK 4131) on card requires routing to a specific billing area |
| Success + AsylbLG Restriction Notice | Besondere Personengruppe 09 detected on card |
| Exact Match Found | Card data matches a stored patient record on key identifiers |
| Near Match Found | Card data partially matches one or more stored records (e.g., name matches but insurance number differs) |
| Record Type Selection | First card read for this patient in the current quarter |
| Private Insurance Notice | Card for a privately insured patient is read |
| Standard Record | Staff creates/views a regular 010x billing record |
| TSS Case | Record marked as TSS (FK 4103 set) |
| TSS Akutfall / HA-Vermittlungsfall | TSS case classified as acute or GP-mediated |
| Referral: Muster 6 | Record created from a Muster 6 referral |
| Referral: Muster 10 (Lab) | Record created from a Muster 10 lab referral |
| Referral: Muster 39 (Specialty) | Record created from a Muster 39 specialty referral |
| Pseudo-Behandlungsfall (NaePa) | GOP 88194 pseudo-case created |
| Quarter Closing | Current quarter ends |
| Insurance Change Split Required | Insurance change detected within quarter |
| Status Change Split Required | Person group or insured status change within quarter |
| Official Data Update | VSDM update changes authoritative data mid-quarter |

**Components:**

| Component | Description |
|-----------|-------------|
| VSDM Status Badge | Icon/badge showing online verification status. Visually distinct for "verified this quarter" vs. "stale/needs refresh." Shows FK 4136 value and timestamp. |
| Coverage Status Indicator | Shows current coverage validity (active, expired, not yet started) with start/end dates |
| WOP Field | Displays the WOP regional code. Editable as a manual fallback. |
| Care Context Label | Indicates whether this record is Outpatient or Inpatient. Prevents cross-context data access. |
| Read-In Date (FK 4109) | System-generated, non-editable date showing when the card was last read |
| Cost Carrier Summary | Displays resolved carrier name, billing VKNR, KTAB, and IK. Shown in all success states. |
| Override Action | Button or link allowing the user to proceed despite a warning (e.g., expired IK). Only shown on non-blocking warnings. |
| Insurance Change Alert | Highlights old vs. new insurer name, IK, and VKNR. Visually distinct from other warnings (e.g., amber with a "change" icon). |
| KTAB Selector | Dropdown or selection control for choosing the correct billing area based on person group. May pre-select a recommended KTAB. |
| AsylbLG Notice | Informational banner explaining restricted entitlement. Distinct from errors/warnings. Uses a neutral info style. |
| Record Comparison View | Two-column layout. Left: data from card. Right: data from stored record. Differences highlighted. Field-by-field comparison. |
| Record Type Selector | Dropdown or button group for selecting Satzart 0101-0104 or Scheinuntergruppe. Appears on first-in-quarter card read. |
| TSS Section | Collapsible section with TSS-specific fields: Vermittlungscode, appointment date, referral source, surcharge category, case completion. |
| Referral Section | Collapsible section with referral-specific fields: referring physician, diagnosis, referral type, urgency, specialty. Fields vary by Muster type. |
| Surcharge Calculator | Displays calculated surcharge category (A/B/C/D) based on days between referral and appointment. Read-only. |
| Case Completion Toggle | Toggle or checkbox to mark a TSS case as completed (Fallabschluss). |
| Record Split Indicator | Visual marker showing that a record was split due to insurance or status change. Links to the sibling record. |
| Name/Address Deviation Fields | Editable fields for recording name/address that differs from card data. Official card data shown alongside for reference. |

---

### Manual Patient Entry Form

- **ID:** S005
- **Phase:** 1.4
- **Primary Role:** MFA
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 28.0 (6 states, 7 components, 0 extensions)

> A full data entry form for registering a patient without a card read (Ersatzverfahren). Contains all fields from Tabelle 5. Used when the patient's card is unavailable, damaged, or for non-standard cost carriers.

**States:**

| State | Trigger |
|-------|---------|
| Standard Entry | User opens manual entry for a regular statutory patient |
| SKT Entry | User selects a Sonstige Kostentrager (non-standard carrier) |
| SKT Bundeswehr Entry | VKNR 79868 or 79869 entered/selected |
| PLZ Validation Error | User enters an invalid postal code |
| eEB Received | An eEB message arrives via KIM |
| eEB Applied | Staff applies an eEB to a patient |

**Components:**

| Component | Description |
|-----------|-------------|
| Besondere Personengruppe Field (FK 4131) | Dropdown defaulting to '00' (no special group). Overridable. |
| DMP Indicator Field (FK 4132) | Dropdown defaulting to '00' (no DMP). Overridable. Displays human-readable DMP program name next to the code. |
| Gender Selector | Four options: male, female, diverse, indeterminate. Per PStG requirements. |
| Birth Date Field | Supports standard dates and special value ranges for unknown/estimated birth dates. |
| PLZ Field with Validation | Text input with live validation against PLZ master data. Shows error for invalid codes. |
| Cost Carrier Search Trigger | Button or link that opens the Cost Carrier Search Panel. Positioned near the carrier/IK fields. |
| eEB Billing Marker | Badge or indicator showing FK 4112 = 1, meaning coverage was confirmed via eEB rather than card read. |

---

### Waiting Room Board `[GAP]`

- **ID:** S085
- **Phase:** 1.NEW
- **Primary Role:** MFA
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 10.5 (3 states, 3 components, 0 extensions)
- **Secondary Roles:** Doctor
- **Gap Reason:** Referenced in product context. Every practice needs patient flow visibility from day one.

> Patient flow visibility board showing color-coded status for each patient (waiting, in treatment, ready to leave). Real-time updates. Displayed on reception screen.

**States:**

| State | Trigger |
|-------|---------|
| Active Day View | Default on login |
| Empty State | No patients checked in |
| High Volume | >15 patients waiting |

**Components:**

| Component | Description |
|-----------|-------------|
| Patient Queue Card | Individual patient status with color indicator |
| Wait Time Display | Elapsed time since check-in |
| Status Filter Tabs | Filter by: All / Waiting / In Treatment / Done |

---

### Temporary Cost Carrier Form

- **ID:** S003
- **Phase:** 1.2
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 53.0 (13 states, 9 components, 1 extensions)
- **Extensions:** Extended by: 1.4.
- **Secondary Roles:** Admin

> A data entry form for manually creating a temporary cost carrier master record when the IK is unknown. This is a new surface because the user is creating a new data entity, not just viewing a card read result.

**States:**

| State | Trigger |
|-------|---------|
| Success + Billable | IK is valid, within validity period, cost carrier has active billing capability |
| Success + Fusion Redirect | IK maps to a cost carrier that has merged into another |
| Error: Carrier Dissolved | Cost carrier associated with the IK has been dissolved |
| Warning: IK Expired + Override | IK is invalid or outside validity period |
| Error: Carrier Not Permitted in Region | Cost carrier is not authorized in the practice's KV region |
| Warning: Unknown IK | IK is not found in the KT master data file |
| Error: Billing Area Dissolved | The KTAB (billing area) of the cost carrier has been dissolved |
| Standard Entry | User opens manual entry for a regular statutory patient |
| SKT Entry | User selects a Sonstige Kostentrager (non-standard carrier) |
| SKT Bundeswehr Entry | VKNR 79868 or 79869 entered/selected |
| PLZ Validation Error | User enters an invalid postal code |
| eEB Received | An eEB message arrives via KIM |
| eEB Applied | Staff applies an eEB to a patient |

**Components:**

| Component | Description |
|-----------|-------------|
| Cost Carrier Summary | Displays resolved carrier name, billing VKNR, KTAB, and IK. Shown in all success states. |
| Override Action | Button or link allowing the user to proceed despite a warning (e.g., expired IK). Only shown on non-blocking warnings. |
| Besondere Personengruppe Field (FK 4131) | Dropdown defaulting to '00' (no special group). Overridable. |
| DMP Indicator Field (FK 4132) | Dropdown defaulting to '00' (no DMP). Overridable. Displays human-readable DMP program name next to the code. |
| Gender Selector | Four options: male, female, diverse, indeterminate. Per PStG requirements. |
| Birth Date Field | Supports standard dates and special value ranges for unknown/estimated birth dates. |
| PLZ Field with Validation | Text input with live validation against PLZ master data. Shows error for invalid codes. |
| Cost Carrier Search Trigger | Button or link that opens the Cost Carrier Search Panel. Positioned near the carrier/IK fields. |
| eEB Billing Marker | Badge or indicator showing FK 4112 = 1, meaning coverage was confirmed via eEB rather than card read. |

---

### Patient Match Review Panel

- **ID:** S004
- **Phase:** 1.3
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 19.0 (5 states, 4 components, 0 extensions)
- **Secondary Roles:** Doctor

> A side-by-side comparison view shown when the system finds an existing patient record that matches or nearly matches the card data. The user must confirm whether to update the existing record, create a new one, or cancel. This is a new surface because the layout (two-column comparison + actions) is distinct from the card read result area.

**States:**

| State | Trigger |
|-------|---------|
| Success + Insurance Change Detected | Card read for existing patient, but insurer/IK differs from stored record |
| Success + KTAB Selection Required | Besondere Personengruppe (FK 4131) on card requires routing to a specific billing area |
| Success + AsylbLG Restriction Notice | Besondere Personengruppe 09 detected on card |
| Exact Match Found | Card data matches a stored patient record on key identifiers |
| Near Match Found | Card data partially matches one or more stored records (e.g., name matches but insurance number differs) |

**Components:**

| Component | Description |
|-----------|-------------|
| Insurance Change Alert | Highlights old vs. new insurer name, IK, and VKNR. Visually distinct from other warnings (e.g., amber with a "change" icon). |
| KTAB Selector | Dropdown or selection control for choosing the correct billing area based on person group. May pre-select a recommended KTAB. |
| AsylbLG Notice | Informational banner explaining restricted entitlement. Distinct from errors/warnings. Uses a neutral info style. |
| Record Comparison View | Two-column layout. Left: data from card. Right: data from stored record. Differences highlighted. Field-by-field comparison. |

---

### Cost Carrier Search Panel

- **ID:** S006
- **Phase:** 1.4
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 28.0 (6 states, 7 components, 0 extensions)

> A search interface for finding cost carriers by IK, name, location, or VKNR. Opens from within the Manual Patient Entry Form when the user needs to look up a carrier. Could be a slide-out panel or modal.

**States:**

| State | Trigger |
|-------|---------|
| Standard Entry | User opens manual entry for a regular statutory patient |
| SKT Entry | User selects a Sonstige Kostentrager (non-standard carrier) |
| SKT Bundeswehr Entry | VKNR 79868 or 79869 entered/selected |
| PLZ Validation Error | User enters an invalid postal code |
| eEB Received | An eEB message arrives via KIM |
| eEB Applied | Staff applies an eEB to a patient |

**Components:**

| Component | Description |
|-----------|-------------|
| Besondere Personengruppe Field (FK 4131) | Dropdown defaulting to '00' (no special group). Overridable. |
| DMP Indicator Field (FK 4132) | Dropdown defaulting to '00' (no DMP). Overridable. Displays human-readable DMP program name next to the code. |
| Gender Selector | Four options: male, female, diverse, indeterminate. Per PStG requirements. |
| Birth Date Field | Supports standard dates and special value ranges for unknown/estimated birth dates. |
| PLZ Field with Validation | Text input with live validation against PLZ master data. Shows error for invalid codes. |
| Cost Carrier Search Trigger | Button or link that opens the Cost Carrier Search Panel. Positioned near the carrier/IK fields. |
| eEB Billing Marker | Badge or indicator showing FK 4112 = 1, meaning coverage was confirmed via eEB rather than card read. |

---

### EHIC Patient Entry Form

- **ID:** S010
- **Phase:** 1.6
- **Primary Role:** MFA
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 7.5 (2 states, 2 components, 0 extensions)

> A data entry form specifically for patients presenting a European Health Insurance Card instead of a German eGK. Captures EHIC-specific fields (country of origin, EHIC card number, institution details) and generates the required patient declaration form. Distinct from the standard Manual Entry Form (Phase 1.4) because the field set, validation rules, and output (declaration form) are different.

**States:**

| State | Trigger |
|-------|---------|
| Data Entry | Staff selects "European Health Insurance Card" as the entry type |
| Declaration Preview | Staff completes data entry and requests declaration |

**Components:**

| Component | Description |
|-----------|-------------|
| EHIC Country Selector | Dropdown of EU/EEA countries for selecting the patient's country of origin. |
| Declaration Form Generator | Action that generates the patient declaration document from the entered EHIC data. Output is a printable form. |

---

## Insurance & Enrollment (HZV/FAV)

### TE Form (Enrollment Declaration)

- **ID:** S011
- **Phase:** 1.7
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 43.0 (12 states, 9 components, 0 extensions)

> Form for creating, viewing, and printing HZV and FAV enrollment declarations. Pre-fills patient data from the system. Handles both online and offline enrollment flows. Contains the signature/TE-Code verification dialog as a state.

**States:**

| State | Trigger |
|-------|---------|
| Created (Erzeugt) | Staff creates a new enrollment declaration |
| Created + Missing Data Warning | Required therapy/diagnosis data missing when print is attempted |
| Created + Offline Hint | Offline enrollment procedure applies |
| Printed (Gedruckt) | Staff prints the declaration |
| Signature & TE-Code Dialog (HZV) | Staff opens verification on a Printed or Error HZV declaration |
| Signature & TE-Code Dialog (FAV) | Staff opens verification on a Printed or Error FAV declaration |
| Error (Fehlerhaft) | Transmission failed |
| Successful (Erfolgreich) | Transmission succeeded |
| HZV List | User views HZV declarations |
| FAV List | User views FAV declarations |
| Unified List | User views all declarations (Q2-26+) |
| Unsent Notification | Daily check finds untransmitted declarations |

**Components:**

| Component | Description |
|-----------|-------------|
| Status Badge | Shows current status: Created, Printed, Error, Successful. Color-coded (e.g., gray/blue/red/green). |
| Print Action | Triggers printing of the enrollment declaration. HZV prints DIN A4. FAV prints full template from AKA base data (patient copy + physician form). Accessible from patient context. |
| Save Action | Saves declaration as PDF/data record. Stores TE-Code validation status and signature confirmation alongside. Manual trigger only. |
| Offline Receipt Print | Prints DIN A6 enrollment receipt for offline enrollment. |
| Offline Declaration Print | Prints two-sided DIN A4 offline enrollment form per AKA base data template. |
| Transmit Action | Sends declaration to HPM. Checks prerequisites (signatures, mandatory fields, transmittable status). Blocked for already-successful declarations. |
| Delete Action | Deletes declaration. Only available for Created, Printed, or Error status. Blocked for Successful. |
| TE Identifier Display | Shows the unique identifier returned by HPM after successful transmission. Persisted for reference. |
| Enrollment Method Selector | Toggle or radio group: Online vs. Offline enrollment, per BSNR and per contract. Selection persists across updates. |

---

### TE Overview List

- **ID:** S012
- **Phase:** 1.7
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 43.0 (12 states, 9 components, 0 extensions)

> A list view showing all enrollment declarations with their statuses. Supports filtering and sorting. From Q2-26, HZV and FAV lists are unified at a single location. Provides quick access to individual declarations and transmission actions.

**States:**

| State | Trigger |
|-------|---------|
| Created (Erzeugt) | Staff creates a new enrollment declaration |
| Created + Missing Data Warning | Required therapy/diagnosis data missing when print is attempted |
| Created + Offline Hint | Offline enrollment procedure applies |
| Printed (Gedruckt) | Staff prints the declaration |
| Signature & TE-Code Dialog (HZV) | Staff opens verification on a Printed or Error HZV declaration |
| Signature & TE-Code Dialog (FAV) | Staff opens verification on a Printed or Error FAV declaration |
| Error (Fehlerhaft) | Transmission failed |
| Successful (Erfolgreich) | Transmission succeeded |
| HZV List | User views HZV declarations |
| FAV List | User views FAV declarations |
| Unified List | User views all declarations (Q2-26+) |
| Unsent Notification | Daily check finds untransmitted declarations |

**Components:**

| Component | Description |
|-----------|-------------|
| Status Badge | Shows current status: Created, Printed, Error, Successful. Color-coded (e.g., gray/blue/red/green). |
| Print Action | Triggers printing of the enrollment declaration. HZV prints DIN A4. FAV prints full template from AKA base data (patient copy + physician form). Accessible from patient context. |
| Save Action | Saves declaration as PDF/data record. Stores TE-Code validation status and signature confirmation alongside. Manual trigger only. |
| Offline Receipt Print | Prints DIN A6 enrollment receipt for offline enrollment. |
| Offline Declaration Print | Prints two-sided DIN A4 offline enrollment form per AKA base data template. |
| Transmit Action | Sends declaration to HPM. Checks prerequisites (signatures, mandatory fields, transmittable status). Blocked for already-successful declarations. |
| Delete Action | Deletes declaration. Only available for Created, Printed, or Error status. Blocked for Successful. |
| TE Identifier Display | Shows the unique identifier returned by HPM after successful transmission. Persisted for reference. |
| Enrollment Method Selector | Toggle or radio group: Online vs. Offline enrollment, per BSNR and per contract. Selection persists across updates. |

---

### Enrollment Settings

- **ID:** S013
- **Phase:** 1.7
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 43.0 (12 states, 9 components, 0 extensions)

> Configuration view for setting the enrollment method (online vs. offline) per BSNR and per contract. Accessible from practice settings.

**States:**

| State | Trigger |
|-------|---------|
| Created (Erzeugt) | Staff creates a new enrollment declaration |
| Created + Missing Data Warning | Required therapy/diagnosis data missing when print is attempted |
| Created + Offline Hint | Offline enrollment procedure applies |
| Printed (Gedruckt) | Staff prints the declaration |
| Signature & TE-Code Dialog (HZV) | Staff opens verification on a Printed or Error HZV declaration |
| Signature & TE-Code Dialog (FAV) | Staff opens verification on a Printed or Error FAV declaration |
| Error (Fehlerhaft) | Transmission failed |
| Successful (Erfolgreich) | Transmission succeeded |
| HZV List | User views HZV declarations |
| FAV List | User views FAV declarations |
| Unified List | User views all declarations (Q2-26+) |
| Unsent Notification | Daily check finds untransmitted declarations |

**Components:**

| Component | Description |
|-----------|-------------|
| Status Badge | Shows current status: Created, Printed, Error, Successful. Color-coded (e.g., gray/blue/red/green). |
| Print Action | Triggers printing of the enrollment declaration. HZV prints DIN A4. FAV prints full template from AKA base data (patient copy + physician form). Accessible from patient context. |
| Save Action | Saves declaration as PDF/data record. Stores TE-Code validation status and signature confirmation alongside. Manual trigger only. |
| Offline Receipt Print | Prints DIN A6 enrollment receipt for offline enrollment. |
| Offline Declaration Print | Prints two-sided DIN A4 offline enrollment form per AKA base data template. |
| Transmit Action | Sends declaration to HPM. Checks prerequisites (signatures, mandatory fields, transmittable status). Blocked for already-successful declarations. |
| Delete Action | Deletes declaration. Only available for Created, Printed, or Error status. Blocked for Successful. |
| TE Identifier Display | Shows the unique identifier returned by HPM after successful transmission. Persisted for reference. |
| Enrollment Method Selector | Toggle or radio group: Online vs. Offline enrollment, per BSNR and per contract. Selection persists across updates. |

---

### Participation Management View

- **ID:** S014
- **Phase:** 1.8
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 29.5 (7 states, 6 components, 0 extensions)

> A dedicated view showing all contract participations for a patient. Displays statuses, supports lifecycle actions (request, activate, end, reverse, cancel), and enforces prerequisites. Accessible from the patient context.

**States:**

| State | Trigger |
|-------|---------|
| Insurance Change Alert | Patient record opened and insurance has changed since last visit |
| Re-Enrollment Notice | Insurance change detected for a patient with active HZV/FAV participation |
| No Participations | Patient has no contract participations |
| Active Participations | Patient has one or more active participations |
| Module Contract Blocked | Staff tries to activate module contract without active main contract |
| Activation Date Change Warning | Staff changes the activation date of a participation |
| Direct Activation Warning | Staff activates without prior request |

**Components:**

| Component | Description |
|-----------|-------------|
| Eligible Contracts Display | Persistent, automatic display of all contracts the patient qualifies for based on their Kassen-IK, practice enrollment, and contract region. Shown without user action. |
| Participation Status Badge | Color-coded badge showing current status: Requested, Active, Ended, Reversed, Cancelled. |
| Lifecycle Action Buttons | Context-sensitive actions per participation: Activate, End, Reverse Termination, Cancel. Available actions depend on current status. |
| FAV Status Check | Quick-check indicator showing whether a patient is actively enrolled in FAV. Verifiable before documenting FAV services. |
| Specialist Search Link | External link to medi-arztsuche.de for specialist search. Positioned near referral creation. |
| Therapy Facilities Link | External link to AOK therapy facility information. Positioned near relevant document retrieval. |

---

### PTV Import Wizard

- **ID:** S015
- **Phase:** 1.9
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 29.0 (9 states, 6 components, 0 extensions)

> A multi-step workflow for importing a patient participant directory (PTV). Steps: file selection, pre-import validation summary, user confirmation, import execution, and protocol display.

**States:**

| State | Trigger |
|-------|---------|
| Step 1: File Selection | Staff initiates PTV import |
| Step 2: Pre-Import Validation | File loaded and validated |
| Step 3: Confirmation | Validation complete |
| Step 4: Importing | Staff confirms import |
| Step 5: Protocol | Import complete |
| Changed Patients Section | Import completed with changes |
| Special Notifications Section | Import found special participation notifications |
| Not-Found Patients Section | Import found patients not in the system |
| Master Data Conflicts Section | Import found data discrepancies |

**Components:**

| Component | Description |
|-----------|-------------|
| Import Metadata Header | Shows: contract name, contract partner (name + VP-ID), quarter/year, importing user, import type (Standardimport), date and time. |
| Patient Count Summary | Total number of enrolled patients after import. |
| Changed Value Highlight | Visual highlighting of values that changed during import. Must work in both screen view and print. |
| Manual Transfer Action | Action to manually transfer data for special notifications or not-found patients that were not auto-imported. |
| Conflict Display | Side-by-side display of conflicting values from PTV and system. No auto-resolve action. |
| ICode Table | Table of ICodes per quarter. Columns: patient, ICode, quarter, status. Supports add/edit/delete. |

---

### AOK Check 18+ Panel (within Patient Record)

- **ID:** S038
- **Phase:** 3.8
- **Primary Role:** MFA
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 22.0 (6 states, 5 components, 0 extensions)
- **Secondary Roles:** Doctor

> A dedicated action panel for documenting and transmitting the pre-enrollment service UHU35. Appears in the patient record for eligible non-enrolled patients.

**States:**

| State | Trigger |
|-------|---------|
| Conflicts Detected | KV billing prep finds HZV patients in KV billing |
| Misdocumented Services Found | KV billing validation detects EBM services from HZV Ziffernkranz on KV-Schein |
| No Conflicts | KV billing prep finds no HZV patients in KV billing |
| Post-Submission Edit Mode | Staff opens Post-Submission Editor for a Medi contract billing |
| AOK Check 18+ Available | Patient meets UHU35 eligibility criteria |
| AOK Check 18+ Transmitted | UHU35 successfully transmitted |

**Components:**

| Component | Description |
|-----------|-------------|
| HZV Patient Conflict List | Table of HZV-enrolled patients appearing in KV billing. Columns: patient name, case details, enrollment status. Allows staff to review and correct routing. |
| Misdocumented EBM List | Auto-generated error list showing: patient name, first name, DOB, eGK number, service quarter, misdocumented EBM service code. Excludes emergency service (Notfalldienst) cases. |
| Diagnosis Correction Placeholder (999999) | Special service code 999999 available when a billing case needs to be submitted but lacks a proper diagnosis. Flagged visually as "pending correction." |
| AOK Check 18+ Button | Button labeled "AOK Check 18+" (NOT "UHU35" or "Vor-Einschreibe-Leistung"). Only visible for eligible patients. |
| Confirmation Dialog | Specific German-language confirmation prompt before UHU35 transmission. Shows JA/NEIN options. |

---

## Clinical Documentation

### Patient Record View

- **ID:** S002
- **Phase:** 1.1
- **Primary Role:** Doctor
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 278.5 (62 states, 63 components, 8 extensions)
- **Extensions:** Extended by: 1.5, 1.8, 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6.

> The patient's stored data after a successful read. Displays insurance details, coverage status, VSDM verification, WOP code, and care context. This is where read data "lands" and where staff reviews the patient profile.

**States:**

| State | Trigger |
|-------|---------|
| Idle | No card action in progress |
| Reading | Staff initiates card read |
| Success | Valid eGK read completes |
| Success + Coverage Warning | Valid read, but coverage dates are expired or not yet active |
| Success + Re-Read | Card re-read for patient already read this quarter |
| Error: KVK Rejected | KVK detected for statutory patient (VKNR digits 3-5 < 800) |
| Error: KVK Rejected + Data Shown | Staff clicks "Show Card Data" on KVK error |
| Error: BPol KVK Blocked | KVK read attempted for BPol patient with existing eGK on file |
| Record Type Selection | First card read for this patient in the current quarter |
| Private Insurance Notice | Card for a privately insured patient is read |
| Standard Record | Staff creates/views a regular 010x billing record |
| TSS Case | Record marked as TSS (FK 4103 set) |
| TSS Akutfall / HA-Vermittlungsfall | TSS case classified as acute or GP-mediated |
| Referral: Muster 6 | Record created from a Muster 6 referral |
| Referral: Muster 10 (Lab) | Record created from a Muster 10 lab referral |
| Referral: Muster 39 (Specialty) | Record created from a Muster 39 specialty referral |
| Pseudo-Behandlungsfall (NaePa) | GOP 88194 pseudo-case created |
| Quarter Closing | Current quarter ends |
| Insurance Change Split Required | Insurance change detected within quarter |
| Status Change Split Required | Person group or insured status change within quarter |
| Official Data Update | VSDM update changes authoritative data mid-quarter |
| Insurance Change Alert | Patient record opened and insurance has changed since last visit |
| Re-Enrollment Notice | Insurance change detected for a patient with active HZV/FAV participation |
| No Participations | Patient has no contract participations |
| Active Participations | Patient has one or more active participations |
| Module Contract Blocked | Staff tries to activate module contract without active main contract |
| Activation Date Change Warning | Staff changes the activation date of a participation |
| Direct Activation Warning | Staff activates without prior request |
| ICD Code Entry | Physician types an ICD code or search term into the textbox |
| Diagnosensicherheit Selection | Physician selects an ICD code from search results |
| Additional Attributes | Diagnosensicherheit selected for a code that requires laterality or supports explanatory text |
| Diagnosis Added | Physician confirms the diagnosis entry |
| Adoption Confirmation | Physician clicks "Adopt" on a Dauerdiagnose or Anamnestische Diagnose in the sidebar |
| Digit Completion Prompt | Adopted code can be specified to 4th or 5th digit |
| Z01.7 Exemption Hint | Code Z01.7 is being adopted |
| Adopted | Physician confirms adoption |
| Code Rejected: Non-Existent | Physician enters/selects a code not in SDICD |
| Code Rejected: Non-Billable | Physician selects a chapter heading or group label |
| Code Rejected: Placeholder | Physician selects a placeholder code with no content |
| Code Rejected: Unpaired Secondary | Physician enters a Stern (*) or Ausrufezeichen (!) code without a primary Kreuz code |
| Warning: Gender Mismatch | Code has a gender reference that conflicts with patient's recorded gender |
| Warning: Age Mismatch | Code has an age reference that conflicts with patient's age |
| Hint: Rare in Central Europe | Code is flagged as rare in Central Europe in SDICD |
| Alert: IfSG Reporting Obligation | Code is associated with IfSG reporting requirement |
| Warning: Unsuitable as Dauerdiagnose | Code flagged as unsuitable for Dauerdiagnose is being assigned as one |
| Search: Favorites Tab Active | Physician switches to Favorites tab in search dropdown |
| Coding Instruction Popover | Physician clicks a "Coding guidance" icon/link on a diagnosis entry or search result |
| Change Highlights Active | Physician toggles "Show changes" in the Coding Instructions Browser |
| Violations Detected | Rule engine completes execution and finds violations |
| No Violations | Rule engine completes execution with no issues |
| Correction Pending | Physician is reviewing a specific violation in the overview |
| Correction Accepted | Physician clicks "Accept" on a correction |
| Correction Rejected | Physician clicks "Reject" on a correction |
| Execution Aborted | Physician clicks "Abort" during rule processing |
| Rule Update Notification | SDKRW version is updated at quarter start |
| Carry-Forward Review | New quarter starts for an HZV/FAV patient |
| Terminal Code Prompt | Physician enters a non-terminal ICD code |
| Acute-as-Permanent Warning | Code flagged as acute is stored/carried as Dauerdiagnose |
| Repeated Suspected Diagnosis Warning | Same code documented as suspected (V) in both current and previous quarter |
| Disease Pattern Result — Matches Found | Single-patient disease pattern check returns 1-18 groups |
| Disease Pattern Result — No Matches | Single-patient check returns 0 groups |
| Surcharge List — Highlighted Rows | Multimorbidity report generated |

**Components:**

| Component | Description |
|-----------|-------------|
| VSDM Status Badge | Icon/badge showing online verification status. Visually distinct for "verified this quarter" vs. "stale/needs refresh." Shows FK 4136 value and timestamp. |
| Coverage Status Indicator | Shows current coverage validity (active, expired, not yet started) with start/end dates |
| WOP Field | Displays the WOP regional code. Editable as a manual fallback. |
| Care Context Label | Indicates whether this record is Outpatient or Inpatient. Prevents cross-context data access. |
| Read-In Date (FK 4109) | System-generated, non-editable date showing when the card was last read |
| Record Type Selector | Dropdown or button group for selecting Satzart 0101-0104 or Scheinuntergruppe. Appears on first-in-quarter card read. |
| TSS Section | Collapsible section with TSS-specific fields: Vermittlungscode, appointment date, referral source, surcharge category, case completion. |
| Referral Section | Collapsible section with referral-specific fields: referring physician, diagnosis, referral type, urgency, specialty. Fields vary by Muster type. |
| Surcharge Calculator | Displays calculated surcharge category (A/B/C/D) based on days between referral and appointment. Read-only. |
| Case Completion Toggle | Toggle or checkbox to mark a TSS case as completed (Fallabschluss). |
| Record Split Indicator | Visual marker showing that a record was split due to insurance or status change. Links to the sibling record. |
| Name/Address Deviation Fields | Editable fields for recording name/address that differs from card data. Official card data shown alongside for reference. |
| Eligible Contracts Display | Persistent, automatic display of all contracts the patient qualifies for based on their Kassen-IK, practice enrollment, and contract region. Shown without user action. |
| Participation Status Badge | Color-coded badge showing current status: Requested, Active, Ended, Reversed, Cancelled. |
| Lifecycle Action Buttons | Context-sensitive actions per participation: Activate, End, Reverse Termination, Cancel. Available actions depend on current status. |
| FAV Status Check | Quick-check indicator showing whether a patient is actively enrolled in FAV. Verifiable before documenting FAV services. |
| Specialist Search Link | External link to medi-arztsuche.de for specialist search. Positioned near referral creation. |
| Therapy Facilities Link | External link to AOK therapy facility information. Positioned near relevant document retrieval. |
| Timeline Entry Textbox | The primary input for clinical entries. When typing ICD codes or search terms, triggers ICD search against SDICD. |
| ICD Search Results | Shows matching ICD codes with SDICD Klartext. Supports code entry, free-text search, and user-defined shortcuts. Results include the full code and its plain-text description. |
| Diagnosensicherheit Selector | Four-option selector: V (Verdacht/suspected), G (Gesichert/confirmed), A (Ausschluss/excluded), Z (Zustand nach/status post). No default. Required. |
| Seitenlokalisation Selector | Three-option selector: R (right), L (left), B (bilateral). Only shown when the ICD code requires laterality. |
| Erlaeuterungstext Field | Free-text input for explanatory text accompanying the diagnosis. |
| Ausnahmetatbestand Toggle | Toggle or checkbox for marking an exception condition. |
| Diagnosis Timeline Entry | A completed diagnosis entry showing: ICD code, Klartext, Diagnosensicherheit badge (color-coded: V=yellow, G=green, A=red, Z=blue), laterality if applicable, and explanatory text if provided. Labeled as "Akutdiagnose." |
| Dauerdiagnosen Sidebar Section | Persistent list of all chronic diagnoses. Each entry shows: ICD code, Klartext, Diagnosensicherheit badge. Visually distinct from acute diagnoses (e.g., different background, icon, or border). Labeled "Dauerdiagnosen." Each entry has an "Adopt" action. |
| Anamnestische Diagnosen Sidebar Section | Persistent list of all historical diagnoses. Same display format as Dauerdiagnosen but with distinct label "Anamnestische Diagnosen" and different visual styling. Each entry has an "Adopt" action. |
| Adoption Panel | Shows the diagnosis being adopted with: Diagnosensicherheit selector (pre-filled from stored value but editable), Seitenlokalisation (if applicable), Erlaeuterungstext, Ausnahmetatbestand. "Confirm Adoption" and "Cancel" actions. |
| Digit Completion Prompt | Shows available 4th/5th digit sub-codes when the current code can be further specified. Indicates whether completion is optional or mandatory. |
| Quarter Adoption Indicator | Badge or icon on sidebar entries that have already been adopted in the current quarter. Prevents confusion about which diagnoses are active for billing. |
| Pool Filter | Filter controls to limit which Dauerdiagnosen or Anamnestische Diagnosen are shown (e.g., by specialty, frequency). Reduces cognitive load for patients with many chronic/historical diagnoses. |
| Validation Message (Error) | Red-styled message for blocking rejections (non-existent, non-billable, placeholder, unpaired secondary). Prevents the code from being saved. Includes a brief explanation of why. |
| Validation Message (Warning) | Amber-styled non-blocking message for plausibility checks (gender, age, Dauerdiagnose suitability). Includes a "Dismiss" or "Proceed anyway" action. |
| Validation Message (Info Hint) | Neutral/blue-styled non-blocking hint for rare disease and IfSG alerts. Dismissible. Less prominent than warnings. |
| Search Results Dropdown (extended) | Extended from Phase 2A.1. Now includes: tab bar ("Search" / "Favorites"), greyed-out non-billable/placeholder codes with explanatory labels, free-text search across code titles, Inklusiva, and Exklusiva. |
| Favorites Tab | A tab showing the physician's personal or specialty-specific favorite ICD codes. Same row format as search results. Codes can be added/removed from favorites via a star/bookmark icon on each search result row. |
| Non-Billable Code Row | Greyed-out row for chapter headings, group labels, and placeholder codes. Shows the code and title but is not selectable. Includes a small label ("Chapter heading", "Group label", or "No content") explaining why. |
| Kreuz-Stern Pairing Indicator | Visual indicator on secondary codes (* / !) showing they require a primary code. In search results, these rows show a pairing icon or label. When selected, the system prompts for the primary code. |
| SDICD Version Indicator | Displays the currently active SDICD version and quarter. Visible to practice administrators. Not part of daily physician workflow. |
| Coding Guidance Icon | A small icon (e.g., book, info-circle) that opens the context-sensitive coding instruction for that code. Present wherever an ICD code is displayed. |
| Context Instruction Panel | Displays the SDVA instruction text for a specific code. Read-only. Shows the instruction exactly as provided by KBV. Includes a "Open full browser" link. |
| Table of Contents | Navigable TOC of the SDVA document. Allows jumping to specific chapters or sections. Sections with annual changes are marked. |
| Content Area | The full text of the SDVA. Supports scrolling, search-within-document, and change highlighting. |
| Change Markers | Visual indicators on sections that changed in the current year's SDVA version. Could be margin icons, background highlighting, or a "Changed" badge. |
| SDVA Version Indicator | Shows the currently active SDVA version and year. |
| Violation Count Badge | Shows the number of unresolved coding violations for the current case. Clicking navigates to the Rule Violation Overview. |
| Violation Row | One row per violation. Shows: affected ICD code + description, rule ID, rule hint text, correction type label (DELETE/REPLACE/ADD), proposed correction detail, and Accept/Reject actions. Expandable to show full rule text. |
| Correction Type Badge | A colored label indicating the correction type. DELETE (red), REPLACE (amber), ADD (blue/green). Helps the physician quickly scan the severity and nature of each violation. |
| Confirmation Dialog | When the physician clicks "Accept," a brief confirmation shows exactly what will change (e.g., "Delete diagnosis E11.9?" or "Replace E11.9 with E11.65?"). Requires a second click to execute. |
| Abort Button | Stops rule engine processing. Preserves already-accepted corrections. Clearly labeled to avoid confusion with "Reject all." |
| Inline Violation Indicator | A small warning icon on diagnosis entries that have associated rule violations. Clicking navigates to the relevant violation in the overview. |
| Execution Timing Selector | Controls for when per-case rules run: "On diagnosis entry," "On case closure," "On demand only." Similar controls for cross-quarter scope. |
| Rule Change Summary | Lists new, modified, and removed rules after an SDKRW update. Each entry shows the rule ID and a brief description of the change. |
| SDKRW Version Indicator | Displays the currently active SDKRW version and quarter. |
| Carry-Forward Review Panel | List of all Dauerdiagnosen carried into the new quarter. Each row shows: ICD code, Klartext, Diagnosensicherheit. Actions: Confirm (keep) or Remove (exclude from this quarter). |
| Terminal Code Selector | When a non-terminal code is entered, expands to show available sub-codes in a dropdown or inline list. Guides selection of the most specific code. |
| Acute-as-Permanent Warning Banner | Amber inline warning on Dauerdiagnosen with acute-only codes. Configurable per HZV/FAV contract rules. Dismissible but logged. |
| Repeated Suspected Warning Banner | Amber warning when a code with Diagnosensicherheit V matches a suspected diagnosis from the previous quarter. Suggests confirmation or exclusion. |
| Disease Pattern Check Button | A button labeled "Pruefung auf Multimorbiditaet nach P4" that triggers the single-patient disease pattern check. Available for all actively participating HZV/FAV patients. |
| Disease Pattern Result Panel | Displays matched disease pattern groups as clear-text names. Format: patient name, DOB, semicolon-separated disease patterns with line breaks. Or a table with first name, last name, patient number, DOB, disease patterns. |
| Patient Row (Surcharge List) | One row per patient with 3+ disease patterns. Columns: first name, last name, patient number, DOB, disease patterns (clear-text, semicolon-separated). Two highlight styles for 1-P4-service and 2-P4-service patients. Patient name links to patient record for diagnosis adjustment. |
| Surcharge List Legend | Explains the two highlight styles (1 P4 service vs. 2 P4 services). |
| Surcharge List Disclaimer | Mandatory closing text about the report scope (unbilled services only, no guarantee of actual reimbursement). |

---

### KIM Inbox

- **ID:** S007
- **Phase:** 1.4
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 28.0 (6 states, 7 components, 0 extensions)

> A message inbox for receiving electronic replacement confirmations (eEB) via KIM. When an eEB arrives, the staff can view the coverage confirmation and apply it to a patient record.

**States:**

| State | Trigger |
|-------|---------|
| Standard Entry | User opens manual entry for a regular statutory patient |
| SKT Entry | User selects a Sonstige Kostentrager (non-standard carrier) |
| SKT Bundeswehr Entry | VKNR 79868 or 79869 entered/selected |
| PLZ Validation Error | User enters an invalid postal code |
| eEB Received | An eEB message arrives via KIM |
| eEB Applied | Staff applies an eEB to a patient |

**Components:**

| Component | Description |
|-----------|-------------|
| Besondere Personengruppe Field (FK 4131) | Dropdown defaulting to '00' (no special group). Overridable. |
| DMP Indicator Field (FK 4132) | Dropdown defaulting to '00' (no DMP). Overridable. Displays human-readable DMP program name next to the code. |
| Gender Selector | Four options: male, female, diverse, indeterminate. Per PStG requirements. |
| Birth Date Field | Supports standard dates and special value ranges for unknown/estimated birth dates. |
| PLZ Field with Validation | Text input with live validation against PLZ master data. Shows error for invalid codes. |
| Cost Carrier Search Trigger | Button or link that opens the Cost Carrier Search Panel. Positioned near the carrier/IK fields. |
| eEB Billing Marker | Badge or indicator showing FK 4112 = 1, meaning coverage was confirmed via eEB rather than card read. |

---

### Clinical Note Editor `[GAP]`

- **ID:** S086
- **Phase:** 2.NEW
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 14.0 (4 states, 4 components, 0 extensions)
- **Gap Reason:** In scope for rich text editing. Clinical documentation needs a dedicated editor surface.

> Rich text editor for clinical documentation with text module library. Supports templates, placeholder auto-population (patient name, date, diagnosis), and structured note formats. Embedded within Patient Record View.

**States:**

| State | Trigger |
|-------|---------|
| New Note | User creates note |
| Editing | Note opened for editing |
| Template Browser | User opens text module library |
| Read-Only | Signed/finalized note |

**Components:**

| Component | Description |
|-----------|-------------|
| Rich Text Toolbar | Formatting controls (bold, italic, lists, tables) |
| Text Module Library | Categorized reusable text blocks with search |
| Placeholder Engine | Auto-populates patient demographics, date, diagnosis |
| Note History | Version history with diff view |

---

### Quantity Tracking Panel

- **ID:** S048
- **Phase:** 4.3
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 24.5 (7 states, 6 components, 0 extensions)

> A panel (embedded or sidebar) showing the patient's running totals of prescribed Heilmittel quantities against catalog limits. Displays remaining allowance per diagnosis group across quarters.

**States:**

| State | Trigger |
|-------|---------|
| Therapy Type Selection | User opens the form |
| Standard Prescription | User selects therapy type and enters diagnosis |
| LHM (Long-Term) Prescription | User enables "Langfristverordnung" toggle |
| BVB (Special Need) Prescription | User enables "Besonderer Verordnungsbedarf" toggle |
| Within Limits | Running total is within catalog limits |
| Approaching Limit | Running total is near the catalog limit |
| Limit Exceeded | Prescribed quantity would exceed catalog limit |

**Components:**

| Component | Description |
|-----------|-------------|
| Therapy Type Selector | Radio buttons or segmented control for the five therapy types. Selecting a type filters the available remedies below. |
| Diagnosis-Remedy Picker | Linked selection: first enter the ICD-10 diagnosis, then the system shows valid remedies from the Heilmittelkatalog for that diagnosis group. Invalid combinations are not selectable. |
| Quantity & Frequency Fields | Number of sessions, frequency per week, and therapy duration. Validates against catalog limits for the selected diagnosis group. |
| Therapy Goal Field | Free-text field for specifying the therapeutic goal (e.g., "improve mobility," "restore speech fluency"). |
| Running Total Indicator | Bar or counter showing: "X of Y units prescribed (Z remaining)" for the current diagnosis group. Spans across quarters. |
| LHM/BVB Toggle | Toggles for Langfristverordnung and Besonderer Verordnungsbedarf. Mutually exclusive with standard prescribing for the same diagnosis group. |

---

### Doctor Letter Composer

- **ID:** S061
- **Phase:** 5.3
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 31.5 (9 states, 8 components, 0 extensions)

> The authoring surface for creating an electronic doctor letter. Contains structured sections (diagnoses, findings, medications, therapy recommendations), recipient selection, and attachment management. Generates HL7 CDA R2 with embedded PDF/A.

**States:**

| State | Trigger |
|-------|---------|
| Composing | User opens a new letter |
| Recipient Selected | User selects a recipient physician |
| Attachments Added | User attaches supplementary documents |
| Ready to Sign | All required sections completed |
| Outgoing — Delivered | DSN confirms delivery |
| Outgoing — Failed | DSN reports failure |
| Incoming — Auto-Matched | Incoming letter matched to patient |
| Incoming — Unmatched | Incoming letter could not be matched |
| Letter Content | User opens a received letter |

**Components:**

| Component | Description |
|-----------|-------------|
| Section Editor | Structured content sections: Diagnoses, Findings, Medications, Therapy Recommendations, Free Text. Each section supports both coded (ICD-10, medications from BMP) and narrative entry. |
| Recipient Search | Search for recipient by name, LANR, BSNR, or specialty. Resolves KIM address from directory. Supports multiple recipients. |
| Attachment Manager | List of attached documents with add/remove actions. Supports PDF, TIFF, JPEG, and structured clinical documents. |
| PDF/A Preview | Preview of the generated PDF/A that will be embedded in the CDA document. Shows how the letter will appear to the recipient. |
| Letterhead | Practice name, address, phone, fax, email, physician name. Auto-populated from practice settings. |
| Letter Status Row | A row per letter showing: direction (sent/received icon), patient name, recipient/sender, date, subject, status badge, and actions. |
| Patient Match Indicator | Shows the matched patient name and confidence level. For auto-matches, shows which identifiers matched (name, DOB, insurance number). For unmatched, shows a patient search field. |
| Structured Data Sidebar | Parsed data from the CDA document: diagnoses (ICD-10), medications, findings. Read-only. Can be imported into patient's record. |

---

### Incoming Letter Viewer

- **ID:** S063
- **Phase:** 5.3
- **Primary Role:** MFA
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 31.5 (9 states, 8 components, 0 extensions)
- **Secondary Roles:** Doctor

> Read-only viewer for received eArztbriefe. Displays the PDF/A rendering of the letter, parsed structured data, and patient matching results. Allows archiving to patient record.

**States:**

| State | Trigger |
|-------|---------|
| Composing | User opens a new letter |
| Recipient Selected | User selects a recipient physician |
| Attachments Added | User attaches supplementary documents |
| Ready to Sign | All required sections completed |
| Outgoing — Delivered | DSN confirms delivery |
| Outgoing — Failed | DSN reports failure |
| Incoming — Auto-Matched | Incoming letter matched to patient |
| Incoming — Unmatched | Incoming letter could not be matched |
| Letter Content | User opens a received letter |

**Components:**

| Component | Description |
|-----------|-------------|
| Section Editor | Structured content sections: Diagnoses, Findings, Medications, Therapy Recommendations, Free Text. Each section supports both coded (ICD-10, medications from BMP) and narrative entry. |
| Recipient Search | Search for recipient by name, LANR, BSNR, or specialty. Resolves KIM address from directory. Supports multiple recipients. |
| Attachment Manager | List of attached documents with add/remove actions. Supports PDF, TIFF, JPEG, and structured clinical documents. |
| PDF/A Preview | Preview of the generated PDF/A that will be embedded in the CDA document. Shows how the letter will appear to the recipient. |
| Letterhead | Practice name, address, phone, fax, email, physician name. Auto-populated from practice settings. |
| Letter Status Row | A row per letter showing: direction (sent/received icon), patient name, recipient/sender, date, subject, status badge, and actions. |
| Patient Match Indicator | Shows the matched patient name and confidence level. For auto-matches, shows which identifiers matched (name, DOB, insurance number). For unmatched, shows a patient search field. |
| Structured Data Sidebar | Parsed data from the CDA document: diagnoses (ICD-10), medications, findings. Read-only. Can be imported into patient's record. |

---

### GDT Device Data Review Surface `[GAP]`

- **ID:** S087
- **Phase:** 2.NEW
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 12.5 (4 states, 3 components, 0 extensions)
- **Secondary Roles:** MFA
- **Gap Reason:** GDT device integration needs a data review surface for physician sign-off.

> Review and accept imported device data (ECG, spirometry, ultrasound) from GDT-connected medical devices. Shows raw data visualization, allows physician annotation, and links results to patient record.

**States:**

| State | Trigger |
|-------|---------|
| Pending Import | Device sends data via GDT |
| Review Mode | Physician opens import |
| Annotated | Physician adds findings |
| Accepted | Physician confirms |

**Components:**

| Component | Description |
|-----------|-------------|
| Device Data Viewer | Renders ECG traces, spirometry curves, ultrasound thumbnails |
| Annotation Panel | Structured findings entry with free text |
| Import Queue | List of pending device imports with patient matching |

---

### Coding Instructions Browser

- **ID:** S018
- **Phase:** 2A.4
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 13.0 (2 states, 6 components, 0 extensions)
- **Secondary Roles:** Admin

> A standalone reference view for browsing the full SDVA document. Physicians open this independently of any specific diagnosis entry context. Contains a navigable table of contents, searchable content area, and change highlighting for annual updates.

**States:**

| State | Trigger |
|-------|---------|
| Coding Instruction Popover | Physician clicks a "Coding guidance" icon/link on a diagnosis entry or search result |
| Change Highlights Active | Physician toggles "Show changes" in the Coding Instructions Browser |

**Components:**

| Component | Description |
|-----------|-------------|
| Coding Guidance Icon | A small icon (e.g., book, info-circle) that opens the context-sensitive coding instruction for that code. Present wherever an ICD code is displayed. |
| Context Instruction Panel | Displays the SDVA instruction text for a specific code. Read-only. Shows the instruction exactly as provided by KBV. Includes a "Open full browser" link. |
| Table of Contents | Navigable TOC of the SDVA document. Allows jumping to specific chapters or sections. Sections with annual changes are marked. |
| Content Area | The full text of the SDVA. Supports scrolling, search-within-document, and change highlighting. |
| Change Markers | Visual indicators on sections that changed in the current year's SDVA version. Could be margin icons, background highlighting, or a "Changed" badge. |
| SDVA Version Indicator | Shows the currently active SDVA version and year. |

---

### Rule Violation Overview

- **ID:** S019
- **Phase:** 2A.5
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 27.5 (7 states, 9 components, 0 extensions)
- **Secondary Roles:** Admin

> A dedicated view listing all detected coding rule violations for a patient's treatment case(s). Each violation shows the affected diagnosis, rule text, hint, and proposed correction (DELETE/REPLACE/ADD). The physician works through violations one by one, accepting or rejecting each correction.

**States:**

| State | Trigger |
|-------|---------|
| Violations Detected | Rule engine completes execution and finds violations |
| No Violations | Rule engine completes execution with no issues |
| Correction Pending | Physician is reviewing a specific violation in the overview |
| Correction Accepted | Physician clicks "Accept" on a correction |
| Correction Rejected | Physician clicks "Reject" on a correction |
| Execution Aborted | Physician clicks "Abort" during rule processing |
| Rule Update Notification | SDKRW version is updated at quarter start |

**Components:**

| Component | Description |
|-----------|-------------|
| Violation Count Badge | Shows the number of unresolved coding violations for the current case. Clicking navigates to the Rule Violation Overview. |
| Violation Row | One row per violation. Shows: affected ICD code + description, rule ID, rule hint text, correction type label (DELETE/REPLACE/ADD), proposed correction detail, and Accept/Reject actions. Expandable to show full rule text. |
| Correction Type Badge | A colored label indicating the correction type. DELETE (red), REPLACE (amber), ADD (blue/green). Helps the physician quickly scan the severity and nature of each violation. |
| Confirmation Dialog | When the physician clicks "Accept," a brief confirmation shows exactly what will change (e.g., "Delete diagnosis E11.9?" or "Replace E11.9 with E11.65?"). Requires a second click to execute. |
| Abort Button | Stops rule engine processing. Preserves already-accepted corrections. Clearly labeled to avoid confusion with "Reject all." |
| Inline Violation Indicator | A small warning icon on diagnosis entries that have associated rule violations. Clicking navigates to the relevant violation in the overview. |
| Execution Timing Selector | Controls for when per-case rules run: "On diagnosis entry," "On case closure," "On demand only." Similar controls for cross-quarter scope. |
| Rule Change Summary | Lists new, modified, and removed rules after an SDKRW update. Each entry shows the rule ID and a brief description of the change. |
| SDKRW Version Indicator | Displays the currently active SDKRW version and quarter. |

---

### pnSD Configuration Dialog

- **ID:** S029
- **Phase:** 3.3
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 16.0 (4 states, 4 components, 0 extensions)

> A configuration dialog for practices using patient-near diagnostics (point-of-care testing). Captures device types and manufacturers for unit-use reagents. Only shown for applicable specialty groups.

**States:**

| State | Trigger |
|-------|---------|
| All Valid (Green) | All required certificates are present for billed analytes |
| Missing Certificates (Red/Yellow) | One or more required certificates are missing |
| Participation Obligation Detected | System finds lab services that require proficiency testing |
| pnSD Configuration Needed | Practice specialty supports pnSD/uu but no devices configured |

**Components:**

| Component | Description |
|-----------|-------------|
| Certificate Status Matrix | Table of material-analyte-GOP combinations with color-coded certificate status: present (green), not present (red), pnSD/uu (blue/special). |
| Analyte Selector | Interface for selecting practice-site-specific RV analytes based on materials used. Selections are stored permanently. |
| Certificate Statistics Summary | Aggregate counts: total analyte combinations, certificates present, certificates missing. Quarterly validation status. |
| pnSD Device Entry | Form fields for device type and manufacturer. At least one required when pnSD/uu is confirmed. |

---

## Service & Billing Documentation

### Schein / Billing Record View

- **ID:** S008
- **Phase:** 1.5
- **Primary Role:** Doctor
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 260.0 (58 states, 60 components, 9 extensions)
- **Extensions:** Extended by: 2A.6, 2B.1, 2B.2, 2B.3, 2B.4, 2B.5, 2B.6, 2B.7, 2B.8.

> The main new surface. Shows a patient's billing records for the current quarter. Supports creating, viewing, and managing multiple 010x records. Different modes for TSS cases and referral cases. Holds TSS fields, referral fields, surcharge data, and case completion status.

**States:**

| State | Trigger |
|-------|---------|
| Record Type Selection | First card read for this patient in the current quarter |
| Private Insurance Notice | Card for a privately insured patient is read |
| Standard Record | Staff creates/views a regular 010x billing record |
| TSS Case | Record marked as TSS (FK 4103 set) |
| TSS Akutfall / HA-Vermittlungsfall | TSS case classified as acute or GP-mediated |
| Referral: Muster 6 | Record created from a Muster 6 referral |
| Referral: Muster 10 (Lab) | Record created from a Muster 10 lab referral |
| Referral: Muster 39 (Specialty) | Record created from a Muster 39 specialty referral |
| Pseudo-Behandlungsfall (NaePa) | GOP 88194 pseudo-case created |
| Quarter Closing | Current quarter ends |
| Insurance Change Split Required | Insurance change detected within quarter |
| Status Change Split Required | Person group or insured status change within quarter |
| Official Data Update | VSDM update changes authoritative data mid-quarter |
| Carry-Forward Review | New quarter starts for an HZV/FAV patient |
| Terminal Code Prompt | Physician enters a non-terminal ICD code |
| Acute-as-Permanent Warning | Code flagged as acute is stored/carried as Dauerdiagnose |
| Repeated Suspected Diagnosis Warning | Same code documented as suspected (V) in both current and previous quarter |
| Disease Pattern Result — Matches Found | Single-patient disease pattern check returns 1-18 groups |
| Disease Pattern Result — No Matches | Single-patient check returns 0 groups |
| Surcharge List — Highlighted Rows | Multimorbidity report generated |
| Day Separation Prompt | Physician triggers Tagtrennung for services spanning midnight |
| Fee Rule Violation | Automatic fee rule check detects an exclusion, frequency limit, or bundling conflict |
| Service Chain Expansion | Physician selects a service chain |
| Justification Text Entry | Physician adds or edits a justification text for a GNR |
| Visit Justification Fields Shown | Physician enters a visit-type GNR (Besuch) |
| Gene Symbol Input Active | Physician enters a genetic testing GNR |
| Gene Symbol Validation Error | Invalid or unrecognized gene symbol entered |
| Free-Text Fallback Active | Physician opens the disease type free-text field on any GNR |
| Disease Type Only Fields | GOP 11233 entered |
| Gene Symbol + Disease Type Fields | GOPs 11511-11521 entered |
| Gene Symbol or Disease Type Fields | GOPs 11513/11522 entered |
| Full Genetic Documentation Fields | GOPs 19424/19453/19456 or 19421/19451/19452 entered |
| Disease Type per ICD Fields | GOPs 11302/11303/19402/32901-32918 entered |
| OPS Code Rejected | Physician enters an OPS code not in SDOPS |
| Laterality Required | OPS code requires side designation |
| Simultaneous Operations Panel | Physician documents multiple procedures in same session (optional) |
| Combination Treatment Mode | Two therapists documented for a patient's treatment |
| Group Therapy Entry | Group therapy GOP entered |
| Tagesprofil Warning | Daily therapy time exceeds limit |
| Termination Notice Draft | Physician creates a new termination notice |
| Termination Notice Sent | Notice transmitted via KIM |
| Notice Overdue | Quarter end approaching with unsent notices |
| Age-Based GOP Converted | Physician enters an age-unspecific Versichertenpauschale |
| Real-Time GNR Adjustment (optional) | EBM check condition triggers a code modification at entry time |
| EBM-on-HZV Warning | Physician enters an EBM/KV service code in HZV/FAV context |
| Participation Required Block | No active contract participation for the patient |
| FAV Online Check | Physician attempts to document a FAV service |
| Service Restriction Violation | Single/combination service rule violated |
| Contact Warning | No code 0000 documented in the billing case |
| Deletion Blocked | Physician attempts to delete a submitted service |
| Substitute Doctor Mode | Services documented by a substitute physician |
| Preventive Case Marked | Treatment case marked as preventive (Vorsorge) |
| Nursing Home Hint | Pflegeheimpauschale (0008) entered |
| HZV Referral Auto-Text | Referral form generated for an HZV patient (not FAV) |
| FAV Referral Auto-Text | Referral form generated for a FAV patient |
| FAV Cover Letter | FAV referral being prepared |
| FAV OPS Mandatory | FAV service requires OPS documentation |
| FAV OPS Rejected | Invalid OPS code entered for FAV |

**Components:**

| Component | Description |
|-----------|-------------|
| Record Type Selector | Dropdown or button group for selecting Satzart 0101-0104 or Scheinuntergruppe. Appears on first-in-quarter card read. |
| TSS Section | Collapsible section with TSS-specific fields: Vermittlungscode, appointment date, referral source, surcharge category, case completion. |
| Referral Section | Collapsible section with referral-specific fields: referring physician, diagnosis, referral type, urgency, specialty. Fields vary by Muster type. |
| Surcharge Calculator | Displays calculated surcharge category (A/B/C/D) based on days between referral and appointment. Read-only. |
| Case Completion Toggle | Toggle or checkbox to mark a TSS case as completed (Fallabschluss). |
| Record Split Indicator | Visual marker showing that a record was split due to insurance or status change. Links to the sibling record. |
| Name/Address Deviation Fields | Editable fields for recording name/address that differs from card data. Official card data shown alongside for reference. |
| Carry-Forward Review Panel | List of all Dauerdiagnosen carried into the new quarter. Each row shows: ICD code, Klartext, Diagnosensicherheit. Actions: Confirm (keep) or Remove (exclude from this quarter). |
| Terminal Code Selector | When a non-terminal code is entered, expands to show available sub-codes in a dropdown or inline list. Guides selection of the most specific code. |
| Acute-as-Permanent Warning Banner | Amber inline warning on Dauerdiagnosen with acute-only codes. Configurable per HZV/FAV contract rules. Dismissible but logged. |
| Repeated Suspected Warning Banner | Amber warning when a code with Diagnosensicherheit V matches a suspected diagnosis from the previous quarter. Suggests confirmation or exclusion. |
| Disease Pattern Check Button | A button labeled "Pruefung auf Multimorbiditaet nach P4" that triggers the single-patient disease pattern check. Available for all actively participating HZV/FAV patients. |
| Disease Pattern Result Panel | Displays matched disease pattern groups as clear-text names. Format: patient name, DOB, semicolon-separated disease patterns with line breaks. Or a table with first name, last name, patient number, DOB, disease patterns. |
| Patient Row (Surcharge List) | One row per patient with 3+ disease patterns. Columns: first name, last name, patient number, DOB, disease patterns (clear-text, semicolon-separated). Two highlight styles for 1-P4-service and 2-P4-service patients. Patient name links to patient record for diagnosis adjustment. |
| Surcharge List Legend | Explains the two highlight styles (1 P4 service vs. 2 P4 services). |
| Surcharge List Disclaimer | Mandatory closing text about the report scope (unbilled services only, no guarantee of actual reimbursement). |
| Treatment Day Group | A collapsible group header showing the treatment date. Below it: all GNRs documented on that day, sorted chronologically. Days are listed in ascending order. |
| GNR Entry Row | One row per service code. Shows: GNR number, description (Leistungsbezeichnung), billing pathway marker if applicable, justification text indicator if present. Actions: edit, delete, add justification. |
| GNR Input | A textbox or search field for entering a new GNR by code or keyword. Triggers fee rule validation on entry. |
| Justification Text Field | Free-text input for the Begruendungstext. Shown when the physician adds a justification or when the GNR requires one. Saved per GNR. |
| Tagtrennung Action | An explicit button or action to insert a day boundary with time capture. Not automatic. Labeled "Tagtrennung" with a time input field. |
| Billing Pathway Marker | A small badge or label indicating the billing pathway: regular KV, selective contract, TSS, etc. Physician can set or change the marking. |
| Fee Rule Indicator | An icon or inline message when a fee rule applies to the GNR (exclusion, frequency limit, bundling). Color-coded: error for hard blocks, warning for soft limits. |
| Service Chain Selector | A dropdown or autocomplete that offers predefined service chains. Selecting a chain proposes multiple GNRs. Each must be individually confirmed (Einzelquittierung) before being added. |
| Visit Justification Panel | Contains: DKM (urgency marker) dropdown, visit location text field, zone classification selector. Appears only for visit-type service codes. |
| DKM Selector | Dropdown for selecting the urgency classification of the visit. Options defined by KVDT key tables. |
| HGNC Gene Symbol Input | An input field with autocomplete for entering HGNC gene symbols. Supports chaining multiple symbols (comma or semicolon-separated). Validates each symbol against the HGNC key table. |
| Disease Type Free-Text Field | Free-text input for Art der Erkrankung (FK 5079). Used when structured justification options don't adequately describe the clinical indication. Available on all GNRs as a fallback. |
| Genetic Testing Field Set | A conditional field group that appears based on GOP type. Contains up to three fields: HGNC gene symbol (with autocomplete from Phase 2B.2), disease type free-text, and ICD-10-GM code input. Which fields appear and which are mandatory depends on the specific GOP. |
| GOP-Specific Field Indicator | A visual indicator showing which additional fields are required for this GOP. Helps the physician understand what documentation is needed before expanding. |
| OPS Code Input | A textbox for entering OPS procedure codes. Validates against SDOPS master data. Supports code search by number or keyword. |
| OPS Entry Row | One row per OPS code. Shows: OPS code, description, laterality badge (if applicable), dual-function indicator (billing + §295). |
| Laterality Selector | A three-option selector: R (rechts/right), L (links/left), B (beidseitig/bilateral). Appears only for OPS codes that require laterality. Mandatory before save. |
| Dual-Function Indicator | A small label or icon indicating the OPS code serves both as billing justification and Paragraph 295 documentation. Informational only. |
| BSNR/LANR Assignment Fields | Fields for assigning practice site (BSNR, FK 5098) and physician (LANR, FK 5099) per service. For combination treatment, shows the second therapist's LANR. |
| Therapist Attribution Indicator | Visual indicator showing which therapist a service belongs to (e.g., colored badge per therapist or a therapist name label). |
| Group Therapy Fields | Number of participants input, session duration, per-participant billing calculation display. |
| Tagesprofil Display | Shows total therapy minutes for the current day across all sessions. Color-coded: green (within limits), amber (approaching limit), red (exceeded). |
| Termination Notice Form | A form with fields: patient identification, treatment period (start/end dates), treatment type, reason for termination. Pre-populated where possible from treatment data. |
| Pseudo-GOP Reminder | An info banner: "Remember to document pseudo-GOP 88130 or 88131 for this termination." With a link or action to add the pseudo-GOP to the billing record. |
| KIM Send Action | A "Send via KIM" button on each completed notice. Shows status after sending (sent/failed). |
| Quarterly Notice Tracker | A list of all termination notices for the current quarter. Columns: patient, treatment type, status (draft/sent/overdue), date sent. Filterable. |
| PTV Form Preview | Pre-populated print view of PTV 3 or PTV 10 forms. Editable fields before printing. Print action. |
| Patient Receipt Text | EBM-sourced Patiententext/Kurztext for each GOP. Displayed on the patient receipt. Not visible in the service entry UI itself, but sourced from EBM master data during receipt generation. |
| Age Conversion Indicator | A subtle note showing the original code was converted to an age-specific variant. Shows the conversion logic (patient age -> age class -> specific code). |
| VP-ID / BSNR / LANR Fields | Contract participant ID, practice site number, and physician ID per service. Pre-filled from physician profile. Editable. LANR/BSNR support 9-digit entry. |
| Referring Doctor Fields | Mandatory LANR and BSNR of the referring physician for FAV services. Autocomplete from physician directory. |
| Service Filter | Filters available service codes by: KV region (from BSNR) and patient's insurance IK. Only shows codes valid for the current context. |
| Substitute Doctor Indicator | Badge showing the service was documented by a substitute. Substitute identity captured once per session, applied to all services. |
| Additional Info Fields | Per-service additional information fields as defined by the selective contract. Appear conditionally based on the service code. |
| Material Cost Panel | Captures material costs: manufacturer/supplier name, article/model number, cost amount. For services involving materials. |
| Billing Justification Field | Free-text billing justification for HZV/FAV services requiring medical necessity explanation. Transmitted with billing data. |
| Preventive Case Toggle | Toggle or selector to mark a treatment case as preventive (Vorsorge). Affects available service catalog and billing rules. |
| Blank Code Status Indicator | Shows whether a blank billing code is active or inactive. Inactive codes cannot be used for documentation. |
| Nursing Home Facility Fields | Input fields for: care facility name, care facility location (Ort). Stored with quarterly historization. Optional but prompted. Macro support for repeated facilities. |
| Contact Warning Banner | Amber warning: "No Arzt-Patienten-Kontakt (0000) documented." Appears when the billing case has services but no 0000 code. |
| HZV Auto-Text Block | Automatically inserted text block on the referral form indicating HZV enrollment. Not editable by the physician. Generated from patient contract data. |
| FAV Auto-Text Block | Automatically inserted text block with FAV participation details and contract-specific referral instructions. Includes additional fields per FAV specifications. |
| FAV Cover Letter | A printable cover letter accompanying the Muster 6 referral form. Contains clinical context and contract-specific information for the receiving specialist. |
| FAV OPS Input | An OPS code input field validated against contract-specific OPS master data (Appendix 2). Mandatory for services requiring OPS documentation. |

---

### Quarter Transition Dashboard

- **ID:** S009
- **Phase:** 1.5
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 45.5 (13 states, 7 components, 0 extensions)

> A view or notification area that manages the transition between billing quarters. Shows which cases are being closed, which carry forward, and any insurance/status changes that require record splitting.

**States:**

| State | Trigger |
|-------|---------|
| Record Type Selection | First card read for this patient in the current quarter |
| Private Insurance Notice | Card for a privately insured patient is read |
| Standard Record | Staff creates/views a regular 010x billing record |
| TSS Case | Record marked as TSS (FK 4103 set) |
| TSS Akutfall / HA-Vermittlungsfall | TSS case classified as acute or GP-mediated |
| Referral: Muster 6 | Record created from a Muster 6 referral |
| Referral: Muster 10 (Lab) | Record created from a Muster 10 lab referral |
| Referral: Muster 39 (Specialty) | Record created from a Muster 39 specialty referral |
| Pseudo-Behandlungsfall (NaePa) | GOP 88194 pseudo-case created |
| Quarter Closing | Current quarter ends |
| Insurance Change Split Required | Insurance change detected within quarter |
| Status Change Split Required | Person group or insured status change within quarter |
| Official Data Update | VSDM update changes authoritative data mid-quarter |

**Components:**

| Component | Description |
|-----------|-------------|
| Record Type Selector | Dropdown or button group for selecting Satzart 0101-0104 or Scheinuntergruppe. Appears on first-in-quarter card read. |
| TSS Section | Collapsible section with TSS-specific fields: Vermittlungscode, appointment date, referral source, surcharge category, case completion. |
| Referral Section | Collapsible section with referral-specific fields: referring physician, diagnosis, referral type, urgency, specialty. Fields vary by Muster type. |
| Surcharge Calculator | Displays calculated surcharge category (A/B/C/D) based on days between referral and appointment. Read-only. |
| Case Completion Toggle | Toggle or checkbox to mark a TSS case as completed (Fallabschluss). |
| Record Split Indicator | Visual marker showing that a record was split due to insurance or status change. Links to the sibling record. |
| Name/Address Deviation Fields | Editable fields for recording name/address that differs from card data. Official card data shown alongside for reference. |

---

### Termination Notice Manager

- **ID:** S022
- **Phase:** 2B.5
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 25.5 (6 states, 9 components, 0 extensions)

> A new view for creating, tracking, and sending psychotherapy termination notices (Beendigungsmitteilungen). Lists all pending/sent notices per quarter. Supports KIM transmission.

**States:**

| State | Trigger |
|-------|---------|
| Combination Treatment Mode | Two therapists documented for a patient's treatment |
| Group Therapy Entry | Group therapy GOP entered |
| Tagesprofil Warning | Daily therapy time exceeds limit |
| Termination Notice Draft | Physician creates a new termination notice |
| Termination Notice Sent | Notice transmitted via KIM |
| Notice Overdue | Quarter end approaching with unsent notices |

**Components:**

| Component | Description |
|-----------|-------------|
| BSNR/LANR Assignment Fields | Fields for assigning practice site (BSNR, FK 5098) and physician (LANR, FK 5099) per service. For combination treatment, shows the second therapist's LANR. |
| Therapist Attribution Indicator | Visual indicator showing which therapist a service belongs to (e.g., colored badge per therapist or a therapist name label). |
| Group Therapy Fields | Number of participants input, session duration, per-participant billing calculation display. |
| Tagesprofil Display | Shows total therapy minutes for the current day across all sessions. Color-coded: green (within limits), amber (approaching limit), red (exceeded). |
| Termination Notice Form | A form with fields: patient identification, treatment period (start/end dates), treatment type, reason for termination. Pre-populated where possible from treatment data. |
| Pseudo-GOP Reminder | An info banner: "Remember to document pseudo-GOP 88130 or 88131 for this termination." With a link or action to add the pseudo-GOP to the billing record. |
| KIM Send Action | A "Send via KIM" button on each completed notice. Shows status after sending (sent/failed). |
| Quarterly Notice Tracker | A list of all termination notices for the current quarter. Columns: patient, treatment type, status (draft/sent/overdue), date sent. Filterable. |
| PTV Form Preview | Pre-populated print view of PTV 3 or PTV 10 forms. Editable fields before printing. Print action. |

---

### Nursing Home Flat-Rate Documentation Panel

- **ID:** S024
- **Phase:** 2B.7
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 34.5 (9 states, 11 components, 0 extensions)

> An inline panel or dialog for documenting care facility data when billing the Pflegeheimpauschale (0008). Captures facility name and location with quarterly historization.

**States:**

| State | Trigger |
|-------|---------|
| EBM-on-HZV Warning | Physician enters an EBM/KV service code in HZV/FAV context |
| Participation Required Block | No active contract participation for the patient |
| FAV Online Check | Physician attempts to document a FAV service |
| Service Restriction Violation | Single/combination service rule violated |
| Contact Warning | No code 0000 documented in the billing case |
| Deletion Blocked | Physician attempts to delete a submitted service |
| Substitute Doctor Mode | Services documented by a substitute physician |
| Preventive Case Marked | Treatment case marked as preventive (Vorsorge) |
| Nursing Home Hint | Pflegeheimpauschale (0008) entered |

**Components:**

| Component | Description |
|-----------|-------------|
| VP-ID / BSNR / LANR Fields | Contract participant ID, practice site number, and physician ID per service. Pre-filled from physician profile. Editable. LANR/BSNR support 9-digit entry. |
| Referring Doctor Fields | Mandatory LANR and BSNR of the referring physician for FAV services. Autocomplete from physician directory. |
| Service Filter | Filters available service codes by: KV region (from BSNR) and patient's insurance IK. Only shows codes valid for the current context. |
| Substitute Doctor Indicator | Badge showing the service was documented by a substitute. Substitute identity captured once per session, applied to all services. |
| Additional Info Fields | Per-service additional information fields as defined by the selective contract. Appear conditionally based on the service code. |
| Material Cost Panel | Captures material costs: manufacturer/supplier name, article/model number, cost amount. For services involving materials. |
| Billing Justification Field | Free-text billing justification for HZV/FAV services requiring medical necessity explanation. Transmitted with billing data. |
| Preventive Case Toggle | Toggle or selector to mark a treatment case as preventive (Vorsorge). Affects available service catalog and billing rules. |
| Blank Code Status Indicator | Shows whether a blank billing code is active or inactive. Inactive codes cannot be used for documentation. |
| Nursing Home Facility Fields | Input fields for: care facility name, care facility location (Ort). Stored with quarterly historization. Optional but prompted. Macro support for repeated facilities. |
| Contact Warning Banner | Amber warning: "No Arzt-Patienten-Kontakt (0000) documented." Appears when the billing case has services but no 0000 code. |

---

### KV / HZV Conflict Review Panel

- **ID:** S036
- **Phase:** 3.8
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 22.0 (6 states, 5 components, 0 extensions)

> Shown during KV billing preparation. Lists HZV-enrolled patients found in KV billing data and misdocumented EBM services. Acts as a pre-KV-submission review to prevent cross-billing errors.

**States:**

| State | Trigger |
|-------|---------|
| Conflicts Detected | KV billing prep finds HZV patients in KV billing |
| Misdocumented Services Found | KV billing validation detects EBM services from HZV Ziffernkranz on KV-Schein |
| No Conflicts | KV billing prep finds no HZV patients in KV billing |
| Post-Submission Edit Mode | Staff opens Post-Submission Editor for a Medi contract billing |
| AOK Check 18+ Available | Patient meets UHU35 eligibility criteria |
| AOK Check 18+ Transmitted | UHU35 successfully transmitted |

**Components:**

| Component | Description |
|-----------|-------------|
| HZV Patient Conflict List | Table of HZV-enrolled patients appearing in KV billing. Columns: patient name, case details, enrollment status. Allows staff to review and correct routing. |
| Misdocumented EBM List | Auto-generated error list showing: patient name, first name, DOB, eGK number, service quarter, misdocumented EBM service code. Excludes emergency service (Notfalldienst) cases. |
| Diagnosis Correction Placeholder (999999) | Special service code 999999 available when a billing case needs to be submitted but lacks a proper diagnosis. Flagged visually as "pending correction." |
| AOK Check 18+ Button | Button labeled "AOK Check 18+" (NOT "UHU35" or "Vor-Einschreibe-Leistung"). Only visible for eligible patients. |
| Confirmation Dialog | Specific German-language confirmation prompt before UHU35 transmission. Shows JA/NEIN options. |

---

### Lab Proficiency Gate (within Billing Dashboard)

- **ID:** S028
- **Phase:** 3.3
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 16.0 (4 states, 4 components, 0 extensions)
- **Secondary Roles:** Admin

> A validation panel shown during billing preparation for practices that bill laboratory services. Displays a color-coded certificate status matrix. Acts as a gate: if certificates are missing, lab services cannot be billed.

**States:**

| State | Trigger |
|-------|---------|
| All Valid (Green) | All required certificates are present for billed analytes |
| Missing Certificates (Red/Yellow) | One or more required certificates are missing |
| Participation Obligation Detected | System finds lab services that require proficiency testing |
| pnSD Configuration Needed | Practice specialty supports pnSD/uu but no devices configured |

**Components:**

| Component | Description |
|-----------|-------------|
| Certificate Status Matrix | Table of material-analyte-GOP combinations with color-coded certificate status: present (green), not present (red), pnSD/uu (blue/special). |
| Analyte Selector | Interface for selecting practice-site-specific RV analytes based on materials used. Selections are stored permanently. |
| Certificate Statistics Summary | Aggregate counts: total analyte combinations, certificates present, certificates missing. Quarterly validation status. |
| pnSD Device Entry | Form fields for device type and manufacturer. At least one required when pnSD/uu is confirmed. |

---

### Master Data Management Panel

- **ID:** S078
- **Phase:** 7.4
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 32.0 (8 states, 9 components, 0 extensions)

> A central admin surface for viewing and managing all KBV master data files (SDKT, SDKV, SDAV, PLZ, SDEBM). Shows each dataset's current version, deployment status, last update date, and validity period. Entry point for importing new quarterly updates and browsing dataset contents.

**States:**

| State | Trigger |
|-------|---------|
| All Current | All datasets are deployed with current quarterly versions |
| Update Available | A new quarterly version of one or more datasets is available but not yet deployed |
| Update Overdue | Quarter has started but one or more datasets are still on the previous quarter's version |
| Import in Progress | Admin has triggered a dataset import |
| SDKT with Temporary Entries | User or vendor has added temporary cost carrier entries |
| Regional EBM Active | Practice's KV region has a regional SDEBM version |
| User Extensions Present | User has added or modified GOPs |
| EBM Update Changelog | Quarterly SDEBM update has been applied |

**Components:**

| Component | Description |
|-----------|-------------|
| Dataset Card | One card per master data file (SDKT, SDKV, SDAV, PLZ, SDEBM). Shows: dataset name, current version, deployment date, validity period, record count, and status badge. Actions: "Import Update," "Browse Contents." |
| Import Action | Button to import a new quarterly version of the dataset. Shows import progress and validation results. For SDKT: reconciles temporary entries against the new official data. |
| Temporary Entry Indicator | Badge showing count of temporary cost carrier entries. Links to a filtered view of temporary records. Entries are marked for reconciliation on next official import. |
| Cost Carrier Record Row | A row per cost carrier showing: VKNR, IK, name, and edit status. Official fields are read-only (locked icon). Temporary entries have a distinct visual treatment. gematik test payer (VKNR 74799) shown with "Excluded from billing" tag. |
| GOP Row | A row per GOP showing: code, description, point value, validity period, regional indicator, and source (official / custom). Official entries are read-only except where user extension is permitted. |
| Add Custom GOP Action | Button to add a user-defined GOP. Opens a form with code, description, point value, and validity fields. The custom entry is tagged distinctly from official EBM entries. |
| Regional Priority Indicator | A small badge or icon showing whether a GOP comes from the regional KV-specific SDEBM (primary) or the federal fallback. |
| Update Changelog | Shows a diff of GOPs between the previous and current SDEBM version: new codes (green), removed codes (red), modified rules (yellow). Links to affected documentation. |
| Undo/Rollback Action | For service documentation entries that were changed by EBM validation rules or manual edits: an "Undo" action that reverts to the previous state. |

---

### Fee Schedule Browser

- **ID:** S079
- **Phase:** 7.4
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 32.0 (8 states, 9 components, 0 extensions)
- **Secondary Roles:** Admin

> A searchable, browsable view of the EBM fee schedule (SDEBM). Shows all GOPs with point values, validation rules, and regional overrides. Supports user extensions (custom GOPs) and clearly distinguishes official EBM entries from user-added ones. Regional KV-specific entries take priority over federal fallback.

**States:**

| State | Trigger |
|-------|---------|
| All Current | All datasets are deployed with current quarterly versions |
| Update Available | A new quarterly version of one or more datasets is available but not yet deployed |
| Update Overdue | Quarter has started but one or more datasets are still on the previous quarter's version |
| Import in Progress | Admin has triggered a dataset import |
| SDKT with Temporary Entries | User or vendor has added temporary cost carrier entries |
| Regional EBM Active | Practice's KV region has a regional SDEBM version |
| User Extensions Present | User has added or modified GOPs |
| EBM Update Changelog | Quarterly SDEBM update has been applied |

**Components:**

| Component | Description |
|-----------|-------------|
| Dataset Card | One card per master data file (SDKT, SDKV, SDAV, PLZ, SDEBM). Shows: dataset name, current version, deployment date, validity period, record count, and status badge. Actions: "Import Update," "Browse Contents." |
| Import Action | Button to import a new quarterly version of the dataset. Shows import progress and validation results. For SDKT: reconciles temporary entries against the new official data. |
| Temporary Entry Indicator | Badge showing count of temporary cost carrier entries. Links to a filtered view of temporary records. Entries are marked for reconciliation on next official import. |
| Cost Carrier Record Row | A row per cost carrier showing: VKNR, IK, name, and edit status. Official fields are read-only (locked icon). Temporary entries have a distinct visual treatment. gematik test payer (VKNR 74799) shown with "Excluded from billing" tag. |
| GOP Row | A row per GOP showing: code, description, point value, validity period, regional indicator, and source (official / custom). Official entries are read-only except where user extension is permitted. |
| Add Custom GOP Action | Button to add a user-defined GOP. Opens a form with code, description, point value, and validity fields. The custom entry is tagged distinctly from official EBM entries. |
| Regional Priority Indicator | A small badge or icon showing whether a GOP comes from the regional KV-specific SDEBM (primary) or the federal fallback. |
| Update Changelog | Shows a diff of GOPs between the previous and current SDEBM version: new codes (green), removed codes (red), modified rules (yellow). Links to affected documentation. |
| Undo/Rollback Action | For service documentation entries that were changed by EBM validation rules or manual edits: an "Undo" action that reverts to the previous state. |

---

## Prescriptions

### Prescription Builder

- **ID:** S039
- **Phase:** 4.1
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 43.0 (13 states, 9 components, 0 extensions)

> The primary workspace for creating an electronic prescription. Supports four medication types (PZN, Ingredient, Compounding, FreeText). Contains medication search, dosage entry, patient/insurance context, and aut-idem toggle.

**States:**

| State | Trigger |
|-------|---------|
| PZN Mode | User selects "PZN-based" medication type |
| Ingredient Mode | User selects "Ingredient-based" medication type |
| Compounding Mode | User selects "Compounding" medication type |
| FreeText Mode | User selects "Free-text" medication type |
| MVO Configuration | User enables "Mehrfachverordnung" toggle |
| Pseudo-IK Active | Patient is enrolled in AOK BW HzV/FaV |
| Comfort Signature Active | Physician activates comfort signature session |
| Comfort Signature Exhausted | 250 signatures reached in current session |
| Signing in Progress | User initiates batch signing |
| Submission Success | E-Rezept successfully submitted to Fachdienst |
| Submission Error | E-Rezept submission fails |
| Dispensed | Pharmacy has dispensed the medication |
| Cancelled | Prescription cancelled before dispensing |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Search | Type-ahead search field querying the drug database by PZN, drug name, or ingredient. Results show trade name, manufacturer, pack size, PZN, availability. |
| Dosage Entry | Structured dosage input: morning/noon/evening/night fields, unit selector, free-text dosage instructions. |
| Aut-Idem Toggle | Checkbox to exclude aut-idem substitution. When checked, "no substitution" is flagged on the prescription. |
| MVO Fields | Repeat count, validity start/end, dispensing interval fields. Validates against gematik MVO rules. |
| Insurance Context Bar | Shows patient name, insurance, Kassen-IK (or Pseudo-IK if applicable), and enrollment status. Read-only context from patient master data. |
| Prescription Card | A compact card per prescription showing: patient name, medication, type, creation date, signing status. Selectable for batch operations. |
| Comfort Signature Counter | Shows current session signature count (e.g., "47/250"). Updates in real-time as prescriptions are signed. |
| DataMatrix Barcode | Encoded barcode containing E-Rezept token (Task ID + AccessCode). Scannable by pharmacies. |
| Status Badge | Color-coded badge showing current lifecycle state: Created (blue), In Progress (yellow), Dispensed (green), Cancelled (red). |

---

### Prescription Queue

- **ID:** S040
- **Phase:** 4.1
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 43.0 (13 states, 9 components, 0 extensions)

> A queue/list of unsigned prescriptions awaiting batch signing. Shows prescription details, patient name, medication, and signing status. Supports select-all and batch operations.

**States:**

| State | Trigger |
|-------|---------|
| PZN Mode | User selects "PZN-based" medication type |
| Ingredient Mode | User selects "Ingredient-based" medication type |
| Compounding Mode | User selects "Compounding" medication type |
| FreeText Mode | User selects "Free-text" medication type |
| MVO Configuration | User enables "Mehrfachverordnung" toggle |
| Pseudo-IK Active | Patient is enrolled in AOK BW HzV/FaV |
| Comfort Signature Active | Physician activates comfort signature session |
| Comfort Signature Exhausted | 250 signatures reached in current session |
| Signing in Progress | User initiates batch signing |
| Submission Success | E-Rezept successfully submitted to Fachdienst |
| Submission Error | E-Rezept submission fails |
| Dispensed | Pharmacy has dispensed the medication |
| Cancelled | Prescription cancelled before dispensing |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Search | Type-ahead search field querying the drug database by PZN, drug name, or ingredient. Results show trade name, manufacturer, pack size, PZN, availability. |
| Dosage Entry | Structured dosage input: morning/noon/evening/night fields, unit selector, free-text dosage instructions. |
| Aut-Idem Toggle | Checkbox to exclude aut-idem substitution. When checked, "no substitution" is flagged on the prescription. |
| MVO Fields | Repeat count, validity start/end, dispensing interval fields. Validates against gematik MVO rules. |
| Insurance Context Bar | Shows patient name, insurance, Kassen-IK (or Pseudo-IK if applicable), and enrollment status. Read-only context from patient master data. |
| Prescription Card | A compact card per prescription showing: patient name, medication, type, creation date, signing status. Selectable for batch operations. |
| Comfort Signature Counter | Shows current session signature count (e.g., "47/250"). Updates in real-time as prescriptions are signed. |
| DataMatrix Barcode | Encoded barcode containing E-Rezept token (Task ID + AccessCode). Scannable by pharmacies. |
| Status Badge | Color-coded badge showing current lifecycle state: Created (blue), In Progress (yellow), Dispensed (green), Cancelled (red). |

---

### Patient Copy Preview

- **ID:** S041
- **Phase:** 4.1
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 43.0 (13 states, 9 components, 0 extensions)
- **Secondary Roles:** Admin

> Print preview of the patient-readable prescription copy. Shows DataMatrix barcode encoding the E-Rezept token, medication details, dosage instructions, and patient information.

**States:**

| State | Trigger |
|-------|---------|
| PZN Mode | User selects "PZN-based" medication type |
| Ingredient Mode | User selects "Ingredient-based" medication type |
| Compounding Mode | User selects "Compounding" medication type |
| FreeText Mode | User selects "Free-text" medication type |
| MVO Configuration | User enables "Mehrfachverordnung" toggle |
| Pseudo-IK Active | Patient is enrolled in AOK BW HzV/FaV |
| Comfort Signature Active | Physician activates comfort signature session |
| Comfort Signature Exhausted | 250 signatures reached in current session |
| Signing in Progress | User initiates batch signing |
| Submission Success | E-Rezept successfully submitted to Fachdienst |
| Submission Error | E-Rezept submission fails |
| Dispensed | Pharmacy has dispensed the medication |
| Cancelled | Prescription cancelled before dispensing |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Search | Type-ahead search field querying the drug database by PZN, drug name, or ingredient. Results show trade name, manufacturer, pack size, PZN, availability. |
| Dosage Entry | Structured dosage input: morning/noon/evening/night fields, unit selector, free-text dosage instructions. |
| Aut-Idem Toggle | Checkbox to exclude aut-idem substitution. When checked, "no substitution" is flagged on the prescription. |
| MVO Fields | Repeat count, validity start/end, dispensing interval fields. Validates against gematik MVO rules. |
| Insurance Context Bar | Shows patient name, insurance, Kassen-IK (or Pseudo-IK if applicable), and enrollment status. Read-only context from patient master data. |
| Prescription Card | A compact card per prescription showing: patient name, medication, type, creation date, signing status. Selectable for batch operations. |
| Comfort Signature Counter | Shows current session signature count (e.g., "47/250"). Updates in real-time as prescriptions are signed. |
| DataMatrix Barcode | Encoded barcode containing E-Rezept token (Task ID + AccessCode). Scannable by pharmacies. |
| Status Badge | Color-coded badge showing current lifecycle state: Created (blue), In Progress (yellow), Dispensed (green), Cancelled (red). |

---

### Prescription Status View

- **ID:** S042
- **Phase:** 4.1
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 43.0 (13 states, 9 components, 0 extensions)

> Shows the lifecycle status of submitted prescriptions. Tracks E-Rezept Fachdienst status (created, in progress, dispensed, cancelled). Accessible from patient context.

**States:**

| State | Trigger |
|-------|---------|
| PZN Mode | User selects "PZN-based" medication type |
| Ingredient Mode | User selects "Ingredient-based" medication type |
| Compounding Mode | User selects "Compounding" medication type |
| FreeText Mode | User selects "Free-text" medication type |
| MVO Configuration | User enables "Mehrfachverordnung" toggle |
| Pseudo-IK Active | Patient is enrolled in AOK BW HzV/FaV |
| Comfort Signature Active | Physician activates comfort signature session |
| Comfort Signature Exhausted | 250 signatures reached in current session |
| Signing in Progress | User initiates batch signing |
| Submission Success | E-Rezept successfully submitted to Fachdienst |
| Submission Error | E-Rezept submission fails |
| Dispensed | Pharmacy has dispensed the medication |
| Cancelled | Prescription cancelled before dispensing |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Search | Type-ahead search field querying the drug database by PZN, drug name, or ingredient. Results show trade name, manufacturer, pack size, PZN, availability. |
| Dosage Entry | Structured dosage input: morning/noon/evening/night fields, unit selector, free-text dosage instructions. |
| Aut-Idem Toggle | Checkbox to exclude aut-idem substitution. When checked, "no substitution" is flagged on the prescription. |
| MVO Fields | Repeat count, validity start/end, dispensing interval fields. Validates against gematik MVO rules. |
| Insurance Context Bar | Shows patient name, insurance, Kassen-IK (or Pseudo-IK if applicable), and enrollment status. Read-only context from patient master data. |
| Prescription Card | A compact card per prescription showing: patient name, medication, type, creation date, signing status. Selectable for batch operations. |
| Comfort Signature Counter | Shows current session signature count (e.g., "47/250"). Updates in real-time as prescriptions are signed. |
| DataMatrix Barcode | Encoded barcode containing E-Rezept token (Task ID + AccessCode). Scannable by pharmacies. |
| Status Badge | Color-coded badge showing current lifecycle state: Created (blue), In Progress (yellow), Dispensed (green), Cancelled (red). |

---

### DiGA Prescription Builder

- **ID:** S051
- **Phase:** 4.5
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 24.5 (7 states, 6 components, 0 extensions)

> A specialized prescription surface for prescribing digital health applications (DiGA). Contains DiGA search from BfArM directory, indication validation against patient diagnoses, and eVDGA FHIR bundle generation. Separate from the medication Prescription Builder because DiGA have unique fields (DiGA-VE-ID, app name, indication alignment).

**States:**

| State | Trigger |
|-------|---------|
| DiGA Search | User opens the builder |
| DiGA Selected | User selects a DiGA from search results |
| Indication Match | Selected DiGA's indication matches patient's diagnoses |
| Indication Mismatch | No matching diagnosis found in patient record |
| DiGA Not Currently Listed | Selected DiGA is delisted or pending re-evaluation |
| eVDGA Signed & Submitted | Prescription signed and submitted to Fachdienst |
| Directory Results | User enters search query |

**Components:**

| Component | Description |
|-----------|-------------|
| DiGA Search Field | Type-ahead search querying the BfArM DiGA directory by app name, indication, or DiGA-VE-ID. |
| DiGA Detail Card | Shows selected DiGA: app name, manufacturer, DiGA-VE-ID, PZN, approved indications, listing status (permanently listed / preliminary / delisted), and a brief description. |
| Indication Validator | Compares the DiGA's approved indications against the patient's documented ICD-10 diagnoses. Shows match status (green/yellow). |
| Patient Redemption Copy | Printable copy with instructions for the patient on how to redeem the DiGA prescription (e.g., via Gematik app or insurance website). |
| DiGA Directory Card | Card per search result showing: app icon/name, manufacturer, indication keywords, listing status badge, DiGA-VE-ID. |
| Listing Status Badge | Color-coded badge: green (permanently listed), yellow (preliminary listing), red (delisted/not listed). |

---

### Drug Search Panel

- **ID:** S043
- **Phase:** 4.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 27.5 (8 states, 6 components, 0 extensions)

> Embedded within the Prescription Builder (Phase 4.1). Provides multi-entry-point drug search (PZN, ingredient, indication) with rich result cards showing pricing, availability, alternatives, and rebate contract status.

**States:**

| State | Trigger |
|-------|---------|
| Search Results | User enters search query |
| Economic Comparison | Results displayed for a medication with alternatives |
| Aut-Idem Guidance | User selects a medication with substitution options |
| No Interactions | No interactions detected |
| Minor Interaction | Minor or moderate interaction detected |
| Severe Interaction | Severe or contraindicated interaction detected |
| Dosage Recommendation | Medication selected and patient weight/age available |
| Active Red Hand Letter | Prescribing a drug with an active Rote-Hand-Brief |

**Components:**

| Component | Description |
|-----------|-------------|
| Drug Result Card | A card per search result showing: trade name, manufacturer, PZN, pack size, Normgröße, dosage form, price, availability indicator, Rx/OTC badge, rebate contract badge. |
| Price Comparison Row | Shows selected drug price vs. cheapest generic and rebate contract option side-by-side. |
| Rebate Contract Badge | Visual indicator showing whether the drug is covered by a rebate contract with the patient's insurance fund. Green = covered, grey = not. |
| Interaction Severity Badge | Color-coded severity indicator: red (contraindicated), orange (severe), yellow (moderate), blue (minor). |
| Conflicting Medication List | Shows the interacting medications: the one being prescribed and the one(s) already on the patient's medication list or BMP. |
| Dosage Result Display | Shows calculated dose with formula breakdown (e.g., "0.5mg/kg x 70kg = 35mg"). Includes "Apply to prescription" action. |

---

### Interaction Alert Dialog

- **ID:** S044
- **Phase:** 4.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 27.5 (8 states, 6 components, 0 extensions)

> Modal or inline alert shown during prescription creation when drug-drug interactions are detected. Displays severity, clinical guidance, and the conflicting medications.

**States:**

| State | Trigger |
|-------|---------|
| Search Results | User enters search query |
| Economic Comparison | Results displayed for a medication with alternatives |
| Aut-Idem Guidance | User selects a medication with substitution options |
| No Interactions | No interactions detected |
| Minor Interaction | Minor or moderate interaction detected |
| Severe Interaction | Severe or contraindicated interaction detected |
| Dosage Recommendation | Medication selected and patient weight/age available |
| Active Red Hand Letter | Prescribing a drug with an active Rote-Hand-Brief |

**Components:**

| Component | Description |
|-----------|-------------|
| Drug Result Card | A card per search result showing: trade name, manufacturer, PZN, pack size, Normgröße, dosage form, price, availability indicator, Rx/OTC badge, rebate contract badge. |
| Price Comparison Row | Shows selected drug price vs. cheapest generic and rebate contract option side-by-side. |
| Rebate Contract Badge | Visual indicator showing whether the drug is covered by a rebate contract with the patient's insurance fund. Green = covered, grey = not. |
| Interaction Severity Badge | Color-coded severity indicator: red (contraindicated), orange (severe), yellow (moderate), blue (minor). |
| Conflicting Medication List | Shows the interacting medications: the one being prescribed and the one(s) already on the patient's medication list or BMP. |
| Dosage Result Display | Shows calculated dose with formula breakdown (e.g., "0.5mg/kg x 70kg = 35mg"). Includes "Apply to prescription" action. |

---

### Dosage Calculator Panel

- **ID:** S045
- **Phase:** 4.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 27.5 (8 states, 6 components, 0 extensions)

> Embedded panel within the Prescription Builder that calculates weight-based or age-based dosage recommendations for the selected medication.

**States:**

| State | Trigger |
|-------|---------|
| Search Results | User enters search query |
| Economic Comparison | Results displayed for a medication with alternatives |
| Aut-Idem Guidance | User selects a medication with substitution options |
| No Interactions | No interactions detected |
| Minor Interaction | Minor or moderate interaction detected |
| Severe Interaction | Severe or contraindicated interaction detected |
| Dosage Recommendation | Medication selected and patient weight/age available |
| Active Red Hand Letter | Prescribing a drug with an active Rote-Hand-Brief |

**Components:**

| Component | Description |
|-----------|-------------|
| Drug Result Card | A card per search result showing: trade name, manufacturer, PZN, pack size, Normgröße, dosage form, price, availability indicator, Rx/OTC badge, rebate contract badge. |
| Price Comparison Row | Shows selected drug price vs. cheapest generic and rebate contract option side-by-side. |
| Rebate Contract Badge | Visual indicator showing whether the drug is covered by a rebate contract with the patient's insurance fund. Green = covered, grey = not. |
| Interaction Severity Badge | Color-coded severity indicator: red (contraindicated), orange (severe), yellow (moderate), blue (minor). |
| Conflicting Medication List | Shows the interacting medications: the one being prescribed and the one(s) already on the patient's medication list or BMP. |
| Dosage Result Display | Shows calculated dose with formula breakdown (e.g., "0.5mg/kg x 70kg = 35mg"). Includes "Apply to prescription" action. |

---

### Red Hand Letter Alert

- **ID:** S046
- **Phase:** 4.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 27.5 (8 states, 6 components, 0 extensions)

> Modal alert shown when prescribing a medication that has an active Rote-Hand-Brief (urgent safety notification). Shows the alert text and requires acknowledgment.

**States:**

| State | Trigger |
|-------|---------|
| Search Results | User enters search query |
| Economic Comparison | Results displayed for a medication with alternatives |
| Aut-Idem Guidance | User selects a medication with substitution options |
| No Interactions | No interactions detected |
| Minor Interaction | Minor or moderate interaction detected |
| Severe Interaction | Severe or contraindicated interaction detected |
| Dosage Recommendation | Medication selected and patient weight/age available |
| Active Red Hand Letter | Prescribing a drug with an active Rote-Hand-Brief |

**Components:**

| Component | Description |
|-----------|-------------|
| Drug Result Card | A card per search result showing: trade name, manufacturer, PZN, pack size, Normgröße, dosage form, price, availability indicator, Rx/OTC badge, rebate contract badge. |
| Price Comparison Row | Shows selected drug price vs. cheapest generic and rebate contract option side-by-side. |
| Rebate Contract Badge | Visual indicator showing whether the drug is covered by a rebate contract with the patient's insurance fund. Green = covered, grey = not. |
| Interaction Severity Badge | Color-coded severity indicator: red (contraindicated), orange (severe), yellow (moderate), blue (minor). |
| Conflicting Medication List | Shows the interacting medications: the one being prescribed and the one(s) already on the patient's medication list or BMP. |
| Dosage Result Display | Shows calculated dose with formula breakdown (e.g., "0.5mg/kg x 70kg = 35mg"). Includes "Apply to prescription" action. |

---

### Heilmittel Prescription Form

- **ID:** S047
- **Phase:** 4.3
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 24.5 (7 states, 6 components, 0 extensions)

> A specialized prescription form for therapeutic remedies. Separate from the medication Prescription Builder (Phase 4.1) because Heilmittel have different data requirements: therapy type, diagnosis group, remedy selection from Heilmittelkatalog, quantity, frequency, and therapy goals.

**States:**

| State | Trigger |
|-------|---------|
| Therapy Type Selection | User opens the form |
| Standard Prescription | User selects therapy type and enters diagnosis |
| LHM (Long-Term) Prescription | User enables "Langfristverordnung" toggle |
| BVB (Special Need) Prescription | User enables "Besonderer Verordnungsbedarf" toggle |
| Within Limits | Running total is within catalog limits |
| Approaching Limit | Running total is near the catalog limit |
| Limit Exceeded | Prescribed quantity would exceed catalog limit |

**Components:**

| Component | Description |
|-----------|-------------|
| Therapy Type Selector | Radio buttons or segmented control for the five therapy types. Selecting a type filters the available remedies below. |
| Diagnosis-Remedy Picker | Linked selection: first enter the ICD-10 diagnosis, then the system shows valid remedies from the Heilmittelkatalog for that diagnosis group. Invalid combinations are not selectable. |
| Quantity & Frequency Fields | Number of sessions, frequency per week, and therapy duration. Validates against catalog limits for the selected diagnosis group. |
| Therapy Goal Field | Free-text field for specifying the therapeutic goal (e.g., "improve mobility," "restore speech fluency"). |
| Running Total Indicator | Bar or counter showing: "X of Y units prescribed (Z remaining)" for the current diagnosis group. Spans across quarters. |
| LHM/BVB Toggle | Toggles for Langfristverordnung and Besonderer Verordnungsbedarf. Mutually exclusive with standard prescribing for the same diagnosis group. |

---

### Hilfsmittel Prescription Form

- **ID:** S049
- **Phase:** 4.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 22.5 (6 states, 6 components, 0 extensions)

> A specialized prescription form for medical aids. Uses statutory forms (Muster 8, 8A, 15, 16) depending on the aid type. Contains diagnosis, medical justification, aid selection from Hilfsmittelverzeichnis, and supplier selection.

**States:**

| State | Trigger |
|-------|---------|
| Muster 8 (Standard) | User selects standard medical aid |
| Muster 8A (Specific Categories) | User selects aid in specific category requiring Muster 8A |
| Muster 15 (Hearing Aid) | User prescribes a hearing aid |
| Muster 16 (Special Approval) | User selects aid requiring special approval |
| Search Results | User enters search query |
| Supplier Selection | Aid selected, supplier needed |

**Components:**

| Component | Description |
|-----------|-------------|
| Form Type Selector | Selector for the appropriate Muster form (8, 8A, 15, 16). May auto-select based on the chosen aid category. |
| Diagnosis & Justification | ICD-10 diagnosis field plus free-text medical justification explaining why the aid is needed. |
| Aid Selector | Field linked to Hilfsmittelverzeichnis search. Shows selected product group, position number, and product description. |
| Supplier Picker | Dropdown or list of contracted suppliers filtered by patient's insurance fund. Includes contact information. |
| Product Group Browser | Hierarchical browser for product groups (Produktgruppen). Navigate by group → subgroup → product type → specific product. |
| Coverage Indicator | Badge showing whether the product is covered by the patient's insurance fund. Green = covered, yellow = requires prior approval, red = not covered. |

---

### Hilfsmittelverzeichnis Search

- **ID:** S050
- **Phase:** 4.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 22.5 (6 states, 6 components, 0 extensions)

> A searchable catalog browser for the GKV Hilfsmittelverzeichnis. Allows searching by product group, product type, or product name. Shows product details, position numbers, and insurance coverage status.

**States:**

| State | Trigger |
|-------|---------|
| Muster 8 (Standard) | User selects standard medical aid |
| Muster 8A (Specific Categories) | User selects aid in specific category requiring Muster 8A |
| Muster 15 (Hearing Aid) | User prescribes a hearing aid |
| Muster 16 (Special Approval) | User selects aid requiring special approval |
| Search Results | User enters search query |
| Supplier Selection | Aid selected, supplier needed |

**Components:**

| Component | Description |
|-----------|-------------|
| Form Type Selector | Selector for the appropriate Muster form (8, 8A, 15, 16). May auto-select based on the chosen aid category. |
| Diagnosis & Justification | ICD-10 diagnosis field plus free-text medical justification explaining why the aid is needed. |
| Aid Selector | Field linked to Hilfsmittelverzeichnis search. Shows selected product group, position number, and product description. |
| Supplier Picker | Dropdown or list of contracted suppliers filtered by patient's insurance fund. Includes contact information. |
| Product Group Browser | Hierarchical browser for product groups (Produktgruppen). Navigate by group → subgroup → product type → specific product. |
| Coverage Indicator | Badge showing whether the product is covered by the patient's insurance fund. Green = covered, yellow = requires prior approval, red = not covered. |

---

### DiGA Directory Browser

- **ID:** S052
- **Phase:** 4.5
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 24.5 (7 states, 6 components, 0 extensions)

> A searchable catalog of approved digital health applications from the BfArM DiGA directory. Shows app details, approved indications, listing status, and PZN (if applicable).

**States:**

| State | Trigger |
|-------|---------|
| DiGA Search | User opens the builder |
| DiGA Selected | User selects a DiGA from search results |
| Indication Match | Selected DiGA's indication matches patient's diagnoses |
| Indication Mismatch | No matching diagnosis found in patient record |
| DiGA Not Currently Listed | Selected DiGA is delisted or pending re-evaluation |
| eVDGA Signed & Submitted | Prescription signed and submitted to Fachdienst |
| Directory Results | User enters search query |

**Components:**

| Component | Description |
|-----------|-------------|
| DiGA Search Field | Type-ahead search querying the BfArM DiGA directory by app name, indication, or DiGA-VE-ID. |
| DiGA Detail Card | Shows selected DiGA: app name, manufacturer, DiGA-VE-ID, PZN, approved indications, listing status (permanently listed / preliminary / delisted), and a brief description. |
| Indication Validator | Compares the DiGA's approved indications against the patient's documented ICD-10 diagnoses. Shows match status (green/yellow). |
| Patient Redemption Copy | Printable copy with instructions for the patient on how to redeem the DiGA prescription (e.g., via Gematik app or insurance website). |
| DiGA Directory Card | Card per search result showing: app icon/name, manufacturer, indication keywords, listing status badge, DiGA-VE-ID. |
| Listing Status Badge | Color-coded badge: green (permanently listed), yellow (preliminary listing), red (delisted/not listed). |

---

### Medication Plan Editor

- **ID:** S053
- **Phase:** 4.6
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 30.0 (8 states, 8 components, 0 extensions)

> The primary workspace for viewing, creating, and editing the patient's Bundeseinheitlicher Medikationsplan (BMP). Shows all medications in a structured list with dosage schedules (morning/noon/evening/night), organized by sections. Supports drag-and-drop reordering and section management.

**States:**

| State | Trigger |
|-------|---------|
| Empty Plan | Patient has no BMP yet |
| Active Plan | Patient has an existing BMP |
| Edit Mode | User clicks "Edit" on a medication entry |
| Reorder Mode | User activates reorder/drag-drop |
| Section Management | User adds/edits section headers |
| Import Preview | Barcode scanned or electronic BMP received |
| Version Mismatch | Imported BMP uses a different specification version |
| Print Ready | User opens print preview |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Row | A row per medication showing: trade name (or ingredient), strength, dosage form, dosage schedule (M/N/E/Ni grid), unit, and notes. Editable inline. |
| Dosage Grid | Four-column grid for morning (M), noon (N), evening (E), night (Ni) dosages. Each cell shows the dose amount or "—" if not applicable. |
| Section Header | A grouping header (e.g., "Herz-Kreislauf," "Diabetes") that organizes medications by therapeutic category. Collapsible. |
| Add Medication Button | Opens a drug search to add a new medication to the plan. Supports adding prescription drugs, OTC, and supplements. |
| Allergy/Intolerance Note | Prominent display of patient's documented allergies and intolerances. Critical for medication safety context. |
| DataMatrix Barcode | 2D barcode encoding the full BMP data per BMP specification. Scannable by pharmacies and other PVS systems to import the plan. |
| Conflict Row | A row in the import preview highlighting a medication that conflicts with an existing entry (e.g., same drug with different dosage). Shows both versions side-by-side. |
| Prescriber Info | Shows the doctor's name, practice address, and phone number as the responsible prescriber for the plan. |

---

### BMP Print Preview

- **ID:** S054
- **Phase:** 4.6
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 30.0 (8 states, 8 components, 0 extensions)

> Print preview of the BMP including the 2D DataMatrix barcode. The printed plan follows the standardized BMP layout that patients and pharmacies expect.

**States:**

| State | Trigger |
|-------|---------|
| Empty Plan | Patient has no BMP yet |
| Active Plan | Patient has an existing BMP |
| Edit Mode | User clicks "Edit" on a medication entry |
| Reorder Mode | User activates reorder/drag-drop |
| Section Management | User adds/edits section headers |
| Import Preview | Barcode scanned or electronic BMP received |
| Version Mismatch | Imported BMP uses a different specification version |
| Print Ready | User opens print preview |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Row | A row per medication showing: trade name (or ingredient), strength, dosage form, dosage schedule (M/N/E/Ni grid), unit, and notes. Editable inline. |
| Dosage Grid | Four-column grid for morning (M), noon (N), evening (E), night (Ni) dosages. Each cell shows the dose amount or "—" if not applicable. |
| Section Header | A grouping header (e.g., "Herz-Kreislauf," "Diabetes") that organizes medications by therapeutic category. Collapsible. |
| Add Medication Button | Opens a drug search to add a new medication to the plan. Supports adding prescription drugs, OTC, and supplements. |
| Allergy/Intolerance Note | Prominent display of patient's documented allergies and intolerances. Critical for medication safety context. |
| DataMatrix Barcode | 2D barcode encoding the full BMP data per BMP specification. Scannable by pharmacies and other PVS systems to import the plan. |
| Conflict Row | A row in the import preview highlighting a medication that conflicts with an existing entry (e.g., same drug with different dosage). Shows both versions side-by-side. |
| Prescriber Info | Shows the doctor's name, practice address, and phone number as the responsible prescriber for the plan. |

---

### BMP Import Dialog

- **ID:** S055
- **Phase:** 4.6
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 30.0 (8 states, 8 components, 0 extensions)

> Dialog shown when importing a BMP from an external source (scanned barcode or electronic transfer). Shows the imported medications alongside existing records for reconciliation.

**States:**

| State | Trigger |
|-------|---------|
| Empty Plan | Patient has no BMP yet |
| Active Plan | Patient has an existing BMP |
| Edit Mode | User clicks "Edit" on a medication entry |
| Reorder Mode | User activates reorder/drag-drop |
| Section Management | User adds/edits section headers |
| Import Preview | Barcode scanned or electronic BMP received |
| Version Mismatch | Imported BMP uses a different specification version |
| Print Ready | User opens print preview |

**Components:**

| Component | Description |
|-----------|-------------|
| Medication Row | A row per medication showing: trade name (or ingredient), strength, dosage form, dosage schedule (M/N/E/Ni grid), unit, and notes. Editable inline. |
| Dosage Grid | Four-column grid for morning (M), noon (N), evening (E), night (Ni) dosages. Each cell shows the dose amount or "—" if not applicable. |
| Section Header | A grouping header (e.g., "Herz-Kreislauf," "Diabetes") that organizes medications by therapeutic category. Collapsible. |
| Add Medication Button | Opens a drug search to add a new medication to the plan. Supports adding prescription drugs, OTC, and supplements. |
| Allergy/Intolerance Note | Prominent display of patient's documented allergies and intolerances. Critical for medication safety context. |
| DataMatrix Barcode | 2D barcode encoding the full BMP data per BMP specification. Scannable by pharmacies and other PVS systems to import the plan. |
| Conflict Row | A row in the import preview highlighting a medication that conflicts with an existing entry (e.g., same drug with different dosage). Shows both versions side-by-side. |
| Prescriber Info | Shows the doctor's name, practice address, and phone number as the responsible prescriber for the plan. |

---

## Forms & Certificates

### PTV Form Print Preview

- **ID:** S023
- **Phase:** 2B.5
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 25.5 (6 states, 9 components, 0 extensions)

> A print preview surface for PTV 3 (application) and PTV 10 (assessor report) forms. Pre-populated from patient and treatment data.

**States:**

| State | Trigger |
|-------|---------|
| Combination Treatment Mode | Two therapists documented for a patient's treatment |
| Group Therapy Entry | Group therapy GOP entered |
| Tagesprofil Warning | Daily therapy time exceeds limit |
| Termination Notice Draft | Physician creates a new termination notice |
| Termination Notice Sent | Notice transmitted via KIM |
| Notice Overdue | Quarter end approaching with unsent notices |

**Components:**

| Component | Description |
|-----------|-------------|
| BSNR/LANR Assignment Fields | Fields for assigning practice site (BSNR, FK 5098) and physician (LANR, FK 5099) per service. For combination treatment, shows the second therapist's LANR. |
| Therapist Attribution Indicator | Visual indicator showing which therapist a service belongs to (e.g., colored badge per therapist or a therapist name label). |
| Group Therapy Fields | Number of participants input, session duration, per-participant billing calculation display. |
| Tagesprofil Display | Shows total therapy minutes for the current day across all sessions. Color-coded: green (within limits), amber (approaching limit), red (exceeded). |
| Termination Notice Form | A form with fields: patient identification, treatment period (start/end dates), treatment type, reason for termination. Pre-populated where possible from treatment data. |
| Pseudo-GOP Reminder | An info banner: "Remember to document pseudo-GOP 88130 or 88131 for this termination." With a link or action to add the pseudo-GOP to the billing record. |
| KIM Send Action | A "Send via KIM" button on each completed notice. Shows status after sending (sent/failed). |
| Quarterly Notice Tracker | A list of all termination notices for the current quarter. Columns: patient, treatment type, status (draft/sent/overdue), date sent. Filterable. |
| PTV Form Preview | Pre-populated print view of PTV 3 or PTV 10 forms. Editable fields before printing. Print action. |

---

### Referral Form Print Preview

- **ID:** S025
- **Phase:** 2B.8
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 16.0 (5 states, 4 components, 0 extensions)

> Extended with auto-generated contract-specific text for HZV and FAV patients. FAV referrals additionally include a cover letter (Begleitschreiben).

**States:**

| State | Trigger |
|-------|---------|
| HZV Referral Auto-Text | Referral form generated for an HZV patient (not FAV) |
| FAV Referral Auto-Text | Referral form generated for a FAV patient |
| FAV Cover Letter | FAV referral being prepared |
| FAV OPS Mandatory | FAV service requires OPS documentation |
| FAV OPS Rejected | Invalid OPS code entered for FAV |

**Components:**

| Component | Description |
|-----------|-------------|
| HZV Auto-Text Block | Automatically inserted text block on the referral form indicating HZV enrollment. Not editable by the physician. Generated from patient contract data. |
| FAV Auto-Text Block | Automatically inserted text block with FAV participation details and contract-specific referral instructions. Includes additional fields per FAV specifications. |
| FAV Cover Letter | A printable cover letter accompanying the Muster 6 referral form. Contains clinical context and contract-specific information for the receiving specialist. |
| FAV OPS Input | An OPS code input field validated against contract-specific OPS master data (Appendix 2). Mandatory for services requiring OPS documentation. |

---

### Form Print Preview

- **ID:** S056
- **Phase:** 5.1
- **Primary Role:** MFA
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 22.5 (6 states, 6 components, 0 extensions)

> Preview of a statutory form (Muster) before printing. Shows the form layout with all populated fields, barcodes, and patient data exactly as it will appear on paper. Used across all form types (Muster 1, 2, 4, 6, 8, 10, 12, 16, 39, etc.).

**States:**

| State | Trigger |
|-------|---------|
| Form Populated | User initiates form print from a clinical workflow (prescription, referral, sick leave, etc.) |
| Barcode Present | Form type requires PDF417 barcode |
| Field Overflow | A data field exceeds the allocated space on the form |
| Laser Printer Mode | Laser printer selected |
| Dot-Matrix Mode | Dot-matrix printer selected |
| Alignment Calibration | User runs alignment test |

**Components:**

| Component | Description |
|-----------|-------------|
| Form Canvas | The rendered form showing field positions, text content, checkboxes, and barcodes on the form grid. Displays at actual print scale. |
| PDF417 Barcode | Machine-readable barcode encoding the form's structured data per KBV specification. Positioned precisely within the barcode zone. |
| Field Grid Overlay | An optional overlay showing the KBV field grid boundaries. Useful during alignment calibration to verify field positioning. |
| Printer Selector | Dropdown listing available printers with type indicators (laser/dot-matrix). |
| Offset Controls | X/Y offset sliders or number fields for fine-tuning print alignment (in mm). Per-printer, per-form-type settings. |
| Test Print Button | Generates a test print with alignment markers for calibration verification. |

---

### eAU Form

- **ID:** S058
- **Phase:** 5.2
- **Primary Role:** Doctor
- **Design Tier:** 2 (Core Clinical Workflow)
- **Complexity Score:** 34.5 (10 states, 8 components, 0 extensions)

> The data entry form for creating an electronic sick leave certificate. Captures patient ID, diagnosis (ICD-10), incapacity period, certificate type (initial/follow-up/final), and accident indicators. Pre-populates from patient record.

**States:**

| State | Trigger |
|-------|---------|
| Initial Certificate | User selects "Erstbescheinigung" |
| Follow-Up Certificate | User selects "Folgebescheinigung" |
| Final Certificate | User selects "Endbescheinigung" |
| Accident/Occupational | User checks accident or occupational disease indicator |
| Sent & Delivered | KIM DSN confirms delivery |
| Sent & Failed | KIM DSN reports failure |
| Insurer Feedback Received | Insurance fund sends response via KIM |
| Cancelled | eAU cancelled within 120-day window |
| Patient Copy | User selects patient copy |
| Employer Copy | User selects employer copy |

**Components:**

| Component | Description |
|-----------|-------------|
| Certificate Type Selector | Radio buttons or segmented control: Erstbescheinigung / Folgebescheinigung / Endbescheinigung. |
| Diagnosis Entry | ICD-10 code entry with search and auto-complete. Diagnosensicherheit (certainty) selector (G/V/Z/A). Can pull from patient's documented diagnoses. |
| Incapacity Period | Start date and expected end date pickers. Start date defaults to today for initial certificates. |
| Accident Indicator | Checkboxes for work accident (Arbeitsunfall), occupational disease (Berufskrankheit), or third-party injury (Versorgungsleiden). Reveals additional fields when checked. |
| Employer Data Section | Employer name and address fields. Populated from patient record if available. Used for employer copy generation. |
| eAU Status Row | A row per eAU showing: patient name, diagnosis (masked), incapacity period, transmission date, delivery status badge, and actions (view, cancel, retry). |
| Insurer Feedback Card | Card showing insurer response: acceptance, rejection with reason, or query with requested information. Action buttons for response. |
| Barcode | Barcode encoding the eAU reference for verification by insurers or employers. |

---

### Form Printer Settings

- **ID:** S057
- **Phase:** 5.1
- **Primary Role:** MFA
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 22.5 (6 states, 6 components, 0 extensions)

> Configuration surface for form printing parameters: printer selection (laser/dot-matrix), paper tray, alignment offset calibration, and test print. Accessed from system settings or first-time form print.

**States:**

| State | Trigger |
|-------|---------|
| Form Populated | User initiates form print from a clinical workflow (prescription, referral, sick leave, etc.) |
| Barcode Present | Form type requires PDF417 barcode |
| Field Overflow | A data field exceeds the allocated space on the form |
| Laser Printer Mode | Laser printer selected |
| Dot-Matrix Mode | Dot-matrix printer selected |
| Alignment Calibration | User runs alignment test |

**Components:**

| Component | Description |
|-----------|-------------|
| Form Canvas | The rendered form showing field positions, text content, checkboxes, and barcodes on the form grid. Displays at actual print scale. |
| PDF417 Barcode | Machine-readable barcode encoding the form's structured data per KBV specification. Positioned precisely within the barcode zone. |
| Field Grid Overlay | An optional overlay showing the KBV field grid boundaries. Useful during alignment calibration to verify field positioning. |
| Printer Selector | Dropdown listing available printers with type indicators (laser/dot-matrix). |
| Offset Controls | X/Y offset sliders or number fields for fine-tuning print alignment (in mm). Per-printer, per-form-type settings. |
| Test Print Button | Generates a test print with alignment markers for calibration verification. |

---

### eAU Transmission Status

- **ID:** S059
- **Phase:** 5.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 34.5 (10 states, 8 components, 0 extensions)

> A status view showing all sent eAUs with their delivery status (sent, delivered, failed, cancelled). Includes insurer feedback messages. Accessible from patient context or as a practice-wide list.

**States:**

| State | Trigger |
|-------|---------|
| Initial Certificate | User selects "Erstbescheinigung" |
| Follow-Up Certificate | User selects "Folgebescheinigung" |
| Final Certificate | User selects "Endbescheinigung" |
| Accident/Occupational | User checks accident or occupational disease indicator |
| Sent & Delivered | KIM DSN confirms delivery |
| Sent & Failed | KIM DSN reports failure |
| Insurer Feedback Received | Insurance fund sends response via KIM |
| Cancelled | eAU cancelled within 120-day window |
| Patient Copy | User selects patient copy |
| Employer Copy | User selects employer copy |

**Components:**

| Component | Description |
|-----------|-------------|
| Certificate Type Selector | Radio buttons or segmented control: Erstbescheinigung / Folgebescheinigung / Endbescheinigung. |
| Diagnosis Entry | ICD-10 code entry with search and auto-complete. Diagnosensicherheit (certainty) selector (G/V/Z/A). Can pull from patient's documented diagnoses. |
| Incapacity Period | Start date and expected end date pickers. Start date defaults to today for initial certificates. |
| Accident Indicator | Checkboxes for work accident (Arbeitsunfall), occupational disease (Berufskrankheit), or third-party injury (Versorgungsleiden). Reveals additional fields when checked. |
| Employer Data Section | Employer name and address fields. Populated from patient record if available. Used for employer copy generation. |
| eAU Status Row | A row per eAU showing: patient name, diagnosis (masked), incapacity period, transmission date, delivery status badge, and actions (view, cancel, retry). |
| Insurer Feedback Card | Card showing insurer response: acceptance, rejection with reason, or query with requested information. Action buttons for response. |
| Barcode | Barcode encoding the eAU reference for verification by insurers or employers. |

---

### eAU Print Preview (Patient / Employer Copies)

- **ID:** S060
- **Phase:** 5.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 34.5 (10 states, 8 components, 0 extensions)

> Print preview for the patient copy (with diagnosis) and employer copy (without diagnosis). Includes barcode for verification.

**States:**

| State | Trigger |
|-------|---------|
| Initial Certificate | User selects "Erstbescheinigung" |
| Follow-Up Certificate | User selects "Folgebescheinigung" |
| Final Certificate | User selects "Endbescheinigung" |
| Accident/Occupational | User checks accident or occupational disease indicator |
| Sent & Delivered | KIM DSN confirms delivery |
| Sent & Failed | KIM DSN reports failure |
| Insurer Feedback Received | Insurance fund sends response via KIM |
| Cancelled | eAU cancelled within 120-day window |
| Patient Copy | User selects patient copy |
| Employer Copy | User selects employer copy |

**Components:**

| Component | Description |
|-----------|-------------|
| Certificate Type Selector | Radio buttons or segmented control: Erstbescheinigung / Folgebescheinigung / Endbescheinigung. |
| Diagnosis Entry | ICD-10 code entry with search and auto-complete. Diagnosensicherheit (certainty) selector (G/V/Z/A). Can pull from patient's documented diagnoses. |
| Incapacity Period | Start date and expected end date pickers. Start date defaults to today for initial certificates. |
| Accident Indicator | Checkboxes for work accident (Arbeitsunfall), occupational disease (Berufskrankheit), or third-party injury (Versorgungsleiden). Reveals additional fields when checked. |
| Employer Data Section | Employer name and address fields. Populated from patient record if available. Used for employer copy generation. |
| eAU Status Row | A row per eAU showing: patient name, diagnosis (masked), incapacity period, transmission date, delivery status badge, and actions (view, cancel, retry). |
| Insurer Feedback Card | Card showing insurer response: acceptance, rejection with reason, or query with requested information. Action buttons for response. |
| Barcode | Barcode encoding the eAU reference for verification by insurers or employers. |

---

### Letter Transmission Status

- **ID:** S062
- **Phase:** 5.3
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 31.5 (9 states, 8 components, 0 extensions)

> Status view for sent and received eArztbriefe. Shows delivery status (DSN tracking), sent/received timestamps, and matched patient. Dual-purpose: outgoing tracking and incoming letter management.

**States:**

| State | Trigger |
|-------|---------|
| Composing | User opens a new letter |
| Recipient Selected | User selects a recipient physician |
| Attachments Added | User attaches supplementary documents |
| Ready to Sign | All required sections completed |
| Outgoing — Delivered | DSN confirms delivery |
| Outgoing — Failed | DSN reports failure |
| Incoming — Auto-Matched | Incoming letter matched to patient |
| Incoming — Unmatched | Incoming letter could not be matched |
| Letter Content | User opens a received letter |

**Components:**

| Component | Description |
|-----------|-------------|
| Section Editor | Structured content sections: Diagnoses, Findings, Medications, Therapy Recommendations, Free Text. Each section supports both coded (ICD-10, medications from BMP) and narrative entry. |
| Recipient Search | Search for recipient by name, LANR, BSNR, or specialty. Resolves KIM address from directory. Supports multiple recipients. |
| Attachment Manager | List of attached documents with add/remove actions. Supports PDF, TIFF, JPEG, and structured clinical documents. |
| PDF/A Preview | Preview of the generated PDF/A that will be embedded in the CDA document. Shows how the letter will appear to the recipient. |
| Letterhead | Practice name, address, phone, fax, email, physician name. Auto-populated from practice settings. |
| Letter Status Row | A row per letter showing: direction (sent/received icon), patient name, recipient/sender, date, subject, status badge, and actions. |
| Patient Match Indicator | Shows the matched patient name and confidence level. For auto-matches, shows which identifiers matched (name, DOB, insurance number). For unmatched, shows a patient search field. |
| Structured Data Sidebar | Parsed data from the CDA document: diagnoses (ICD-10), medications, findings. Read-only. Can be imported into patient's record. |

---

## Chronic Care Programs

### eDMP Documentation Form

- **ID:** S067
- **Phase:** 6.1
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)

> The primary data entry surface for chronic disease management documentation. A dynamic form that adapts its field set based on the selected DMP program (8 programs). Contains disease-specific clinical fields, conditional logic, completeness indicators, and previous documentation values for reference.

**States:**

| State | Trigger |
|-------|---------|
| Program Selected | User selects a DMP program (e.g., Diabetes Typ 2) |
| Initial Documentation | First documentation for this patient in this program |
| Follow-Up Documentation | Subsequent documentation entry |
| Conditional Fields Visible | User enters a value that triggers dependent fields |
| Completeness OK | All mandatory fields filled with valid values |
| Incomplete | Mandatory fields missing or invalid |
| Validation Passed | XPM validation returns no blocking errors |
| Validation Failed | XPM validation returns blocking errors |
| Warnings Only | XPM returns warnings but no blocking errors |
| Multi-Program Enrolled | Patient enrolled in multiple DMP programs |

**Components:**

| Component | Description |
|-----------|-------------|
| Program Selector | Selector for the DMP program. May be pre-selected from the patient's enrollment. Shows all programs the patient is enrolled in. |
| Clinical Field Group | A group of related clinical fields (e.g., "Blutdruck" group containing systolic + diastolic). Shows field label, input, unit, valid range, and required indicator. |
| Previous Value Column | Shows the last documented value for each field. Displayed as read-only reference. Helps the doctor see trends and changes. |
| Completeness Indicator | Shows progress: "X of Y required fields completed." Color-coded (red → yellow → green). |
| Conditional Field Trigger | When a field value triggers conditional fields, a visual connector (indent, bracket, or animation) shows the relationship. |
| DMP Program Card | Card per enrolled program showing: program name, enrollment date, last documentation date, next due date, documentation count, status badge. |
| Documentation Timeline | Chronological list of all past documentation entries for a program. Each entry shows date, key values, and a "View" action. |
| Validation Error Row | A row per error/warning showing: severity icon, field name, error description, and a "Go to field" link. |
| Override Justification | Text field for documenting why the doctor is overriding a non-blocking warning. Required before submission can proceed. |

---

### eDMP Patient Overview

- **ID:** S068
- **Phase:** 6.1
- **Primary Role:** MFA
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)
- **Secondary Roles:** Doctor

> A dashboard showing a patient's DMP enrollment(s), documentation history, and upcoming documentation due dates. Entry point for creating new documentation or reviewing past entries.

**States:**

| State | Trigger |
|-------|---------|
| Program Selected | User selects a DMP program (e.g., Diabetes Typ 2) |
| Initial Documentation | First documentation for this patient in this program |
| Follow-Up Documentation | Subsequent documentation entry |
| Conditional Fields Visible | User enters a value that triggers dependent fields |
| Completeness OK | All mandatory fields filled with valid values |
| Incomplete | Mandatory fields missing or invalid |
| Validation Passed | XPM validation returns no blocking errors |
| Validation Failed | XPM validation returns blocking errors |
| Warnings Only | XPM returns warnings but no blocking errors |
| Multi-Program Enrolled | Patient enrolled in multiple DMP programs |

**Components:**

| Component | Description |
|-----------|-------------|
| Program Selector | Selector for the DMP program. May be pre-selected from the patient's enrollment. Shows all programs the patient is enrolled in. |
| Clinical Field Group | A group of related clinical fields (e.g., "Blutdruck" group containing systolic + diastolic). Shows field label, input, unit, valid range, and required indicator. |
| Previous Value Column | Shows the last documented value for each field. Displayed as read-only reference. Helps the doctor see trends and changes. |
| Completeness Indicator | Shows progress: "X of Y required fields completed." Color-coded (red → yellow → green). |
| Conditional Field Trigger | When a field value triggers conditional fields, a visual connector (indent, bracket, or animation) shows the relationship. |
| DMP Program Card | Card per enrolled program showing: program name, enrollment date, last documentation date, next due date, documentation count, status badge. |
| Documentation Timeline | Chronological list of all past documentation entries for a program. Each entry shows date, key values, and a "View" action. |
| Validation Error Row | A row per error/warning showing: severity icon, field name, error description, and a "Go to field" link. |
| Override Justification | Text field for documenting why the doctor is overriding a non-blocking warning. Required before submission can proceed. |

---

### eDMP Validation Results

- **ID:** S069
- **Phase:** 6.1
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)

> A results panel shown after XPM validation. Displays errors (blocking) and warnings (non-blocking) with field-level references. Prevents submission until blocking errors are resolved.

**States:**

| State | Trigger |
|-------|---------|
| Program Selected | User selects a DMP program (e.g., Diabetes Typ 2) |
| Initial Documentation | First documentation for this patient in this program |
| Follow-Up Documentation | Subsequent documentation entry |
| Conditional Fields Visible | User enters a value that triggers dependent fields |
| Completeness OK | All mandatory fields filled with valid values |
| Incomplete | Mandatory fields missing or invalid |
| Validation Passed | XPM validation returns no blocking errors |
| Validation Failed | XPM validation returns blocking errors |
| Warnings Only | XPM returns warnings but no blocking errors |
| Multi-Program Enrolled | Patient enrolled in multiple DMP programs |

**Components:**

| Component | Description |
|-----------|-------------|
| Program Selector | Selector for the DMP program. May be pre-selected from the patient's enrollment. Shows all programs the patient is enrolled in. |
| Clinical Field Group | A group of related clinical fields (e.g., "Blutdruck" group containing systolic + diastolic). Shows field label, input, unit, valid range, and required indicator. |
| Previous Value Column | Shows the last documented value for each field. Displayed as read-only reference. Helps the doctor see trends and changes. |
| Completeness Indicator | Shows progress: "X of Y required fields completed." Color-coded (red → yellow → green). |
| Conditional Field Trigger | When a field value triggers conditional fields, a visual connector (indent, bracket, or animation) shows the relationship. |
| DMP Program Card | Card per enrolled program showing: program name, enrollment date, last documentation date, next due date, documentation count, status badge. |
| Documentation Timeline | Chronological list of all past documentation entries for a program. Each entry shows date, key values, and a "View" action. |
| Validation Error Row | A row per error/warning showing: severity icon, field name, error description, and a "Go to field" link. |
| Override Justification | Text field for documenting why the doctor is overriding a non-blocking warning. Required before submission can proceed. |

---

### eHKS Documentation Form

- **ID:** S070
- **Phase:** 6.2
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 27.0 (7 states, 8 components, 0 extensions)

> A structured form for documenting skin cancer screening findings. Contains eligibility check, examination findings per body region, suspicious lesion details, dermoscopy, referral, and biopsy tracking.

**States:**

| State | Trigger |
|-------|---------|
| Eligibility Check | Form opened for a patient |
| Initial Screening | User selects "Initial screening" type |
| Follow-Up Screening | User selects "Follow-up screening" |
| No Suspicious Findings | All body regions documented with normal findings |
| Suspicious Findings | User documents a suspicious lesion |
| GP-Initiated | Screening performed by GP |
| Dermatologist-Initiated | Screening performed by dermatologist |

**Components:**

| Component | Description |
|-----------|-------------|
| Eligibility Badge | Shows patient age and eligibility status. Green badge for eligible, red for ineligible with reason. |
| Screening Type Selector | Radio buttons: Initial / Follow-up. Determines which fields and references are shown. |
| Body Region Checklist | Structured checklist of body regions (head/neck, trunk, upper extremities, lower extremities, etc.). Each region has a findings field: normal / suspicious / not examined. |
| Lesion Detail Card | Expandable card per suspicious lesion: location (body map or text), size (mm), color/shape characteristics, dermoscopy findings (if performed). |
| Dermoscopy Section | Fields for dermoscopy findings: pattern, structures observed, clinical impression. Only shown when dermoscopy was performed. |
| Referral Indicator | For GP screenings with suspicious findings: referral-to-dermatologist field with specialist name and urgency. |
| Biopsy Tracker | Fields for biopsy recommendation, biopsy date, and result tracking. Tracks whether recommended biopsy was performed and its outcome. |
| GOP Code Display | Shows the applicable screening GOP (01745 for GP, 01746 for dermatologist). Auto-assigned to the billing case. |

---

### Scoring Calculator Panel

- **ID:** S071
- **Phase:** 6.3
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 24.0 (6 states, 7 components, 0 extensions)

> An embedded panel within eDMP documentation forms for clinical scoring tools (PHQ-9, DAS-28). Shows the questionnaire items, auto-calculates the total score, and displays severity classification. Tracks score history for trend visualization.

**States:**

| State | Trigger |
|-------|---------|
| PHQ-9 Active | Doctor opens PHQ-9 calculator (from Depression DMP) |
| DAS-28 Active | Doctor opens DAS-28 calculator |
| Score History | Previous scores exist for this patient |
| No History | First time using this score for the patient |
| Document Selected | User selects a documentation entry to audit |
| Export Mode | User requests audit trail export |

**Components:**

| Component | Description |
|-----------|-------------|
| Questionnaire Item Row | A row per PHQ-9 item showing the question text and a 4-option selector (Not at all / Several days / More than half / Nearly every day). Score value shown per selection. |
| Joint Assessment Grid | A visual or tabular 28-joint grid where the doctor marks tenderness and swelling per joint. |
| Score Display | Shows the calculated total score in large text, severity classification with color coding, and a "Save to Documentation" action. |
| Trend Chart | A small line chart showing prior score values over time. X-axis: dates. Y-axis: score. Color bands for severity zones. |
| Audit Entry Row | A row per modification showing: timestamp, user name, field changed, original value, new value, and action type (create/modify/delete). |
| Deletion Marker | For deleted entries: shows the original content with strikethrough, deletion timestamp, deleting user, and deletion reason. Content preserved, not removed. |
| Export Button | Triggers export of the audit trail with filters for date range and document type. |

---

### Audit Trail Viewer

- **ID:** S072
- **Phase:** 6.3
- **Primary Role:** Admin
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 24.0 (6 states, 7 components, 0 extensions)

> A read-only viewer showing the complete modification history of a patient's clinical documentation. Displays who changed what, when, with original and new values. Used for compliance review and legal audits.

**States:**

| State | Trigger |
|-------|---------|
| PHQ-9 Active | Doctor opens PHQ-9 calculator (from Depression DMP) |
| DAS-28 Active | Doctor opens DAS-28 calculator |
| Score History | Previous scores exist for this patient |
| No History | First time using this score for the patient |
| Document Selected | User selects a documentation entry to audit |
| Export Mode | User requests audit trail export |

**Components:**

| Component | Description |
|-----------|-------------|
| Questionnaire Item Row | A row per PHQ-9 item showing the question text and a 4-option selector (Not at all / Several days / More than half / Nearly every day). Score value shown per selection. |
| Joint Assessment Grid | A visual or tabular 28-joint grid where the doctor marks tenderness and swelling per joint. |
| Score Display | Shows the calculated total score in large text, severity classification with color coding, and a "Save to Documentation" action. |
| Trend Chart | A small line chart showing prior score values over time. X-axis: dates. Y-axis: score. Color bands for severity zones. |
| Audit Entry Row | A row per modification showing: timestamp, user name, field changed, original value, new value, and action type (create/modify/delete). |
| Deletion Marker | For deleted entries: shows the original content with strikethrough, deletion timestamp, deleting user, and deletion reason. Content preserved, not removed. |
| Export Button | Triggers export of the audit trail with filters for date range and document type. |

---

### eDMP / eDoc Submission Dashboard

- **ID:** S073
- **Phase:** 6.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 25.0 (7 states, 6 components, 0 extensions)

> A practice-wide dashboard for managing quarterly submission of all eDMP and eDocumentation data to the KV. Shows all pending documentation, batch validation status, and transmission progress. Consolidates individual patient submissions into a quarterly workflow.

**States:**

| State | Trigger |
|-------|---------|
| Quarter Overview | User opens the dashboard |
| Batch Validation Running | User triggers batch XPM validation |
| Batch Validation Complete | All documents validated |
| Batch Submission in Progress | User triggers batch KIM submission |
| All Delivered | All transmissions confirmed via DSN |
| Partial Failures | Some transmissions failed |
| Correction Mode | Previously submitted documentation needs correction |

**Components:**

| Component | Description |
|-----------|-------------|
| Program Summary Card | One card per DMP program showing: total documentation count for the quarter, validated count, submitted count, and delivered count. Color-coded status. |
| eHKS Summary Card | Shows eHKS documentation count with validation and submission status. Same layout as program cards. |
| Pending Items List | A filterable list of all documentation awaiting validation or submission. Each row: patient name, program type, documentation date, validation status, submission status, and actions (validate, submit, view, correct). |
| Batch Action Toolbar | Buttons for: "Validate All," "Submit All Validated," "Retry Failed." Applies to all items matching the current filter. |
| Transmission Log | Chronological log of all KIM transmissions: timestamp, document reference, recipient KV, status (sent/delivered/failed), and DSN details. |
| Validation Error Summary | Aggregated view of validation errors across all documents. Grouped by error type. Shows count per error and affected patients. |

---

## Billing & Submission

### Billing Dashboard (KV Mode)

- **ID:** S026
- **Phase:** 3.1
- **Primary Role:** Doctor
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 20.0 (6 states, 4 components, 0 extensions)

> The unified billing surface in KV mode. Shows billing statistics, submission actions, transmission history, and file management. This is the primary workspace for quarterly KV billing. HZV/FAV billing appears as a separate tab/mode on this same surface.

**States:**

| State | Trigger |
|-------|---------|
| Pre-Submission Review | User opens billing dashboard for the current quarter |
| Submitting (KV-Connect) | User clicks 1-Click-Abrechnung via KV-Connect |
| Submitting (KIM) | User clicks 1-Click-Abrechnung via KIM |
| Success + Confirmation | Transmission completes successfully |
| Error + Recovery | Transmission fails |
| File Location Display | User requests billing file location |

**Components:**

| Component | Description |
|-----------|-------------|
| Billing Statistics Panel | Displays case counts, service totals, and revenue estimates for the current billing quarter. Allows pre-submission review. |
| Transmission Channel Selector | Toggle or dropdown to select between KV-Connect and KIM transmission channels. |
| File Path Indicator | Shows the storage path of the encrypted billing file. Includes a copy-to-clipboard action. |
| Transmission History List | Chronological list of past transmissions with timestamps, confirmation numbers, and status indicators. |

---

### ASV Team Configuration (within Practice Settings)

- **ID:** S030
- **Phase:** 3.4
- **Primary Role:** Admin
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 12.0 (3 states, 3 components, 0 extensions)

> A settings panel where the practice manages its ASV team number(s). Each team number is associated with the practice's BSNR.

**States:**

| State | Trigger |
|-------|---------|
| No ASV Teams Configured | Practice has not set up any ASV team numbers |
| ASV Services Listed | Practice has documented ASV services for the quarter |
| Team Number Missing | A GOP was documented under ASV but no team number assigned |

**Components:**

| Component | Description |
|-----------|-------------|
| Team Number Selector | Dropdown or assignment control for linking a GOP to a specific ASV team number (FK 5100). |
| Material Cost Entry | Fields for manufacturer/supplier name (FK 5074) and article/model number (FK 5075) when material costs (FK 5012) apply to a service. |
| ASV Team List | Editable list of ASV team numbers with their associated BSNR. Add/edit/delete actions. |

---

### Billing Dashboard (ASV Mode)

- **ID:** S031
- **Phase:** 3.4
- **Primary Role:** Admin
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 12.0 (3 states, 3 components, 0 extensions)

> An ASV-specific mode/tab within the unified Billing Dashboard. Shows ASV-billed services with team number assignments, material cost documentation, and ASV-specific submission actions.

**States:**

| State | Trigger |
|-------|---------|
| No ASV Teams Configured | Practice has not set up any ASV team numbers |
| ASV Services Listed | Practice has documented ASV services for the quarter |
| Team Number Missing | A GOP was documented under ASV but no team number assigned |

**Components:**

| Component | Description |
|-----------|-------------|
| Team Number Selector | Dropdown or assignment control for linking a GOP to a specific ASV team number (FK 5100). |
| Material Cost Entry | Fields for manufacturer/supplier name (FK 5074) and article/model number (FK 5075) when material costs (FK 5012) apply to a service. |
| ASV Team List | Editable list of ASV team numbers with their associated BSNR. Add/edit/delete actions. |

---

### Billing Dashboard (HZV / FAV Mode)

- **ID:** S032
- **Phase:** 3.5
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 17.5 (4 states, 5 components, 0 extensions)
- **Secondary Roles:** Admin

> The HZV/FAV tab/mode within the unified Billing Dashboard. Shows billing preparation tools: control list, summary statistics, case selection, fee schedule indicator, and substitute doctor attribution.

**States:**

| State | Trigger |
|-------|---------|
| Preparation Overview | User opens HZV/FAV mode for billing preparation |
| Case Selection / Filtering | User selects/deselects cases, contracts, or time periods |
| Preventive Case Auto-Add | Billing preparation run detects a preventive treatment case |
| Substitute Doctor Review | Cases exist where a substitute doctor provided services |

**Components:**

| Component | Description |
|-----------|-------------|
| Control List | Detailed list of all billable cases with services and amounts. Scrollable, filterable. Each row shows patient, services, and billing amounts. |
| Billing Summary Panel | Aggregated statistics: total cases, service counts, financial totals. Updates as cases are selected/deselected. |
| Case Selector | Controls for selecting/deselecting cases by contract, time period, or individual case. Includes "select all" and "deselect all" actions. |
| Fee Schedule Indicator | Shows which Honorarverzeichnis is active for the current contract and billing period. Read-only display. |
| Substitute Doctor Badge | Indicator showing that services in this case were attributed to a substitute doctor, with the substitute's LANR. |

---

### Billing Validation Results Panel (within Billing Dashboard, HZV / FAV mode)

- **ID:** S033
- **Phase:** 3.6
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 18.5 (4 states, 5 components, 0 extensions)

> Displays the results of the billing validation run (Abrechnungspruflauf). Shows errors and warnings organized by category, with drill-down to individual cases. Acts as a gate: errors must be resolved before submission.

**States:**

| State | Trigger |
|-------|---------|
| Validation Running | User initiates billing validation or it starts automatically during billing preparation |
| All Passed (Green) | Validation completes with no errors and no warnings |
| Errors Found (Red) | Validation finds blocking errors |
| Warnings Only (Yellow) | Validation completes with warnings but no blocking errors |

**Components:**

| Component | Description |
|-----------|-------------|
| Error List | Filterable list of validation errors grouped by type: diagnosis, OPS, referral, material cost, justification. Each error shows affected case, service, and rule reference. |
| Warning List | List of non-blocking warnings for QA and audit. Similar structure to error list but with yellow indicators. |
| Category Filter | Filter controls to view errors by category: Diagnoses, OPS, Referrals, Material Costs, Justifications, Additional Info, Birth Date. |
| Case Drill-Down | Clicking an error expands to show the full billing case context: patient, all services, all diagnoses, and which specific item triggered the error. |
| Validation Summary Badge | Compact status indicator showing validation state: not run, passed, errors, warnings. Always visible in the billing dashboard header. |

---

### HZV / FAV Submission Panel (within Billing Dashboard, HZV / FAV mode)

- **ID:** S034
- **Phase:** 3.7
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 32.0 (10 states, 6 components, 0 extensions)

> The submission interface for HZV/FAV billing. Contains channel selection, connectivity test, submit action, and confirmation display. Handles both billing and prescription data transmission.

**States:**

| State | Trigger |
|-------|---------|
| Channel Selection | User opens submission panel |
| Connectivity Test: Testing | User clicks connectivity test |
| Connectivity Test: Pass | Test returns positive |
| Connectivity Test: Fail | Online test fails (no certificate or connection) |
| Submitting | User clicks submit |
| Success + Confirmation | Billing transmission succeeds (UebermittlungsStatus = 'OK') |
| Success + Protocol PDF | User opens transmission protocol |
| Error + Recovery | Transmission fails |
| Late Submission Warning | Submission date is near or past the Nachreichfrist |
| Offline Mode | User selects offline billing |

**Components:**

| Component | Description |
|-----------|-------------|
| Channel Selector | Toggle between Online-Abrechnung and Offline-Abrechnung. Selection persists across updates. |
| Connectivity Test Button | Tests connection to HAEVG Rechenzentrum. Available anytime. |
| Dual Status Indicator | Two separate status lines: billing data transmission status and prescription data transmission status. Each shows independently. |
| Prescription Count Badge | Shows count of successfully transmitted prescriptions. Only displayed for real submissions, not test submissions. Excludes deleted prescriptions. |
| Late Submission Banner | Warning with deadline date, days remaining/overdue. Color-coded: yellow (approaching), red (past). |
| Protocol Link | Link to open the transmission protocol PDF. If user already clicked this, auto-display of protocol is suppressed. |

---

### Transmission Protocol View

- **ID:** S035
- **Phase:** 3.7
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 32.0 (10 states, 6 components, 0 extensions)

> A PDF viewer or detail panel showing the HAEVG transmission protocol after successful submission. Accessible from the submission panel and from the transmission history.

**States:**

| State | Trigger |
|-------|---------|
| Channel Selection | User opens submission panel |
| Connectivity Test: Testing | User clicks connectivity test |
| Connectivity Test: Pass | Test returns positive |
| Connectivity Test: Fail | Online test fails (no certificate or connection) |
| Submitting | User clicks submit |
| Success + Confirmation | Billing transmission succeeds (UebermittlungsStatus = 'OK') |
| Success + Protocol PDF | User opens transmission protocol |
| Error + Recovery | Transmission fails |
| Late Submission Warning | Submission date is near or past the Nachreichfrist |
| Offline Mode | User selects offline billing |

**Components:**

| Component | Description |
|-----------|-------------|
| Channel Selector | Toggle between Online-Abrechnung and Offline-Abrechnung. Selection persists across updates. |
| Connectivity Test Button | Tests connection to HAEVG Rechenzentrum. Available anytime. |
| Dual Status Indicator | Two separate status lines: billing data transmission status and prescription data transmission status. Each shows independently. |
| Prescription Count Badge | Shows count of successfully transmitted prescriptions. Only displayed for real submissions, not test submissions. Excludes deleted prescriptions. |
| Late Submission Banner | Warning with deadline date, days remaining/overdue. Color-coded: yellow (approaching), red (past). |
| Protocol Link | Link to open the transmission protocol PDF. If user already clicked this, auto-display of protocol is suppressed. |

---

### Post-Submission Editor (Medi contracts only)

- **ID:** S037
- **Phase:** 3.8
- **Primary Role:** Doctor
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 22.0 (6 states, 5 components, 0 extensions)

> An editing interface available after billing submission for Medi-type contracts. Allows modifying, adding, and deleting services and diagnoses retroactively.

**States:**

| State | Trigger |
|-------|---------|
| Conflicts Detected | KV billing prep finds HZV patients in KV billing |
| Misdocumented Services Found | KV billing validation detects EBM services from HZV Ziffernkranz on KV-Schein |
| No Conflicts | KV billing prep finds no HZV patients in KV billing |
| Post-Submission Edit Mode | Staff opens Post-Submission Editor for a Medi contract billing |
| AOK Check 18+ Available | Patient meets UHU35 eligibility criteria |
| AOK Check 18+ Transmitted | UHU35 successfully transmitted |

**Components:**

| Component | Description |
|-----------|-------------|
| HZV Patient Conflict List | Table of HZV-enrolled patients appearing in KV billing. Columns: patient name, case details, enrollment status. Allows staff to review and correct routing. |
| Misdocumented EBM List | Auto-generated error list showing: patient name, first name, DOB, eGK number, service quarter, misdocumented EBM service code. Excludes emergency service (Notfalldienst) cases. |
| Diagnosis Correction Placeholder (999999) | Special service code 999999 available when a billing case needs to be submitted but lacks a proper diagnosis. Flagged visually as "pending correction." |
| AOK Check 18+ Button | Button labeled "AOK Check 18+" (NOT "UHU35" or "Vor-Einschreibe-Leistung"). Only visible for eligible patients. |
| Confirmation Dialog | Specific German-language confirmation prompt before UHU35 transmission. Shows JA/NEIN options. |

---

### Patient Receipt Preview

- **ID:** S027
- **Phase:** 3.2
- **Primary Role:** MFA
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 14.0 (4 states, 3 components, 0 extensions)
- **Secondary Roles:** Doctor

> A printable receipt view accessible from the patient record. Shows services rendered with orientation values per Tabelle 11 layout. Supports optional extensions (diagnosis texts, Euro amounts).

**States:**

| State | Trigger |
|-------|---------|
| Default (Orientation Values) | User generates receipt for a patient |
| Extended: With Diagnosis Texts | User enables "Show Diagnoses" option |
| Extended: With Euro Amounts | User enables "Show Euro Amounts" option |
| Empty | Patient has no documented services for the quarter |

**Components:**

| Component | Description |
|-----------|-------------|
| Service Line Item | One row per documented service: service code, description, date, orientation value. Optionally includes diagnosis text and/or Euro amount. |
| Receipt Options Toggle | Checkboxes or toggles for optional extensions: "Include Diagnosis Texts" and "Include Euro Amounts". |
| Print Action | Button to print or export the receipt as PDF. |

---

## Data Import & Sync

### Import Protocol View

- **ID:** S016
- **Phase:** 1.9
- **Primary Role:** Admin
- **Design Tier:** 4 (HZV/FAV & Billing Specialty)
- **Complexity Score:** 29.0 (9 states, 6 components, 0 extensions)

> A detailed report displayed after import. Shows import metadata, changed patients (sorted by status then name), special notifications, not-found patients, and master data conflicts. Must be printable. Reviewable after the import (not just a one-time display).

**States:**

| State | Trigger |
|-------|---------|
| Step 1: File Selection | Staff initiates PTV import |
| Step 2: Pre-Import Validation | File loaded and validated |
| Step 3: Confirmation | Validation complete |
| Step 4: Importing | Staff confirms import |
| Step 5: Protocol | Import complete |
| Changed Patients Section | Import completed with changes |
| Special Notifications Section | Import found special participation notifications |
| Not-Found Patients Section | Import found patients not in the system |
| Master Data Conflicts Section | Import found data discrepancies |

**Components:**

| Component | Description |
|-----------|-------------|
| Import Metadata Header | Shows: contract name, contract partner (name + VP-ID), quarter/year, importing user, import type (Standardimport), date and time. |
| Patient Count Summary | Total number of enrolled patients after import. |
| Changed Value Highlight | Visual highlighting of values that changed during import. Must work in both screen view and print. |
| Manual Transfer Action | Action to manually transfer data for special notifications or not-found patients that were not auto-imported. |
| Conflict Display | Side-by-side display of conflicting values from PTV and system. No auto-resolve action. |
| ICode Table | Table of ICodes per quarter. Columns: patient, ICode, quarter, status. Supports add/edit/delete. |

---

### ICode Management View

- **ID:** S017
- **Phase:** 1.9
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 29.0 (9 states, 6 components, 0 extensions)

> An administrative screen for managing patient identification codes (ICodes) per quarter. Allows viewing, assigning, and maintaining ICodes for data synchronization.

**States:**

| State | Trigger |
|-------|---------|
| Step 1: File Selection | Staff initiates PTV import |
| Step 2: Pre-Import Validation | File loaded and validated |
| Step 3: Confirmation | Validation complete |
| Step 4: Importing | Staff confirms import |
| Step 5: Protocol | Import complete |
| Changed Patients Section | Import completed with changes |
| Special Notifications Section | Import found special participation notifications |
| Not-Found Patients Section | Import found patients not in the system |
| Master Data Conflicts Section | Import found data discrepancies |

**Components:**

| Component | Description |
|-----------|-------------|
| Import Metadata Header | Shows: contract name, contract partner (name + VP-ID), quarter/year, importing user, import type (Standardimport), date and time. |
| Patient Count Summary | Total number of enrolled patients after import. |
| Changed Value Highlight | Visual highlighting of values that changed during import. Must work in both screen view and print. |
| Manual Transfer Action | Action to manually transfer data for special notifications or not-found patients that were not auto-imported. |
| Conflict Display | Side-by-side display of conflicting values from PTV and system. No auto-resolve action. |
| ICode Table | Table of ICodes per quarter. Columns: patient, ICode, quarter, status. Supports add/edit/delete. |

---

## ePA & Document Exchange

### ePA Document Browser

- **ID:** S064
- **Phase:** 5.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)

> A document management surface for browsing, uploading, and downloading documents from the patient's ePA. Shows a categorized list of documents with upload actions and retrieval capabilities.

**States:**

| State | Trigger |
|-------|---------|
| ePA Active | Patient has an active ePA and practice has entitlement |
| No ePA | Patient has not activated an ePA |
| No Entitlement | Practice lacks access authorization |
| Entitlement Expired | Access authorization has expired |
| Entitlement Active | Valid access authorization exists |
| Entitlement Requested | Request sent, awaiting patient confirmation |
| Upload Ready | User selects documents for upload |
| Conversion in Progress | PDF/A conversion running |
| Upload Complete | All documents uploaded successfully |
| Restricted Category | Patient has restricted a document category |

**Components:**

| Component | Description |
|-----------|-------------|
| Document Category List | Hierarchical list of document categories: eArztbrief, eAU, eMP, NFD, DPE, Lab Results, Imaging, etc. Shows document count per category. |
| Document Row | A row per document showing: title/type, date, author (physician/practice), MIO profile badge, and actions (download, view). |
| Upload Button | Opens the Document Upload Dialog. Enabled only when entitlement is active. |
| Download/View Action | Downloads the document to the local PVS or opens it in a viewer (PDF/A rendering for CDA documents, direct view for PDFs). |
| Entitlement Status Card | Shows current status: active (green), expired (yellow), none (red), pending (blue). Validity dates. Practice name and authorized physicians. |
| Request Entitlement Button | Initiates an access authorization request via the patient's eGK or Aktensystem. |
| Document Type Selector | Dropdown per document: eArztbrief, eAU, eMP, NFD, DPE, General Document. Determines the MIO profile used for validation. |
| PDF/A Conversion Indicator | Shows conversion status: green check (already PDF/A compliant), blue spinner (converting), green check (converted), red X (conversion failed). |
| MIO Validation Badge | Badge showing whether the document conforms to the required MIO profile: green (valid), red (invalid with details). |

---

### ePA Entitlement Manager

- **ID:** S065
- **Phase:** 5.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)

> A panel for managing the practice's access authorization to a patient's ePA. Shows current entitlement status, validity period, and request/renewal actions.

**States:**

| State | Trigger |
|-------|---------|
| ePA Active | Patient has an active ePA and practice has entitlement |
| No ePA | Patient has not activated an ePA |
| No Entitlement | Practice lacks access authorization |
| Entitlement Expired | Access authorization has expired |
| Entitlement Active | Valid access authorization exists |
| Entitlement Requested | Request sent, awaiting patient confirmation |
| Upload Ready | User selects documents for upload |
| Conversion in Progress | PDF/A conversion running |
| Upload Complete | All documents uploaded successfully |
| Restricted Category | Patient has restricted a document category |

**Components:**

| Component | Description |
|-----------|-------------|
| Document Category List | Hierarchical list of document categories: eArztbrief, eAU, eMP, NFD, DPE, Lab Results, Imaging, etc. Shows document count per category. |
| Document Row | A row per document showing: title/type, date, author (physician/practice), MIO profile badge, and actions (download, view). |
| Upload Button | Opens the Document Upload Dialog. Enabled only when entitlement is active. |
| Download/View Action | Downloads the document to the local PVS or opens it in a viewer (PDF/A rendering for CDA documents, direct view for PDFs). |
| Entitlement Status Card | Shows current status: active (green), expired (yellow), none (red), pending (blue). Validity dates. Practice name and authorized physicians. |
| Request Entitlement Button | Initiates an access authorization request via the patient's eGK or Aktensystem. |
| Document Type Selector | Dropdown per document: eArztbrief, eAU, eMP, NFD, DPE, General Document. Determines the MIO profile used for validation. |
| PDF/A Conversion Indicator | Shows conversion status: green check (already PDF/A compliant), blue spinner (converting), green check (converted), red X (conversion failed). |
| MIO Validation Badge | Badge showing whether the document conforms to the required MIO profile: green (valid), red (invalid with details). |

---

### Document Upload Dialog

- **ID:** S066
- **Phase:** 5.4
- **Primary Role:** Doctor
- **Design Tier:** 3 (Extended Clinical & Specialty)
- **Complexity Score:** 35.5 (10 states, 9 components, 0 extensions)

> A dialog for selecting documents to upload to the ePA. Shows document type selection, PDF/A conversion status, and MIO profile validation.

**States:**

| State | Trigger |
|-------|---------|
| ePA Active | Patient has an active ePA and practice has entitlement |
| No ePA | Patient has not activated an ePA |
| No Entitlement | Practice lacks access authorization |
| Entitlement Expired | Access authorization has expired |
| Entitlement Active | Valid access authorization exists |
| Entitlement Requested | Request sent, awaiting patient confirmation |
| Upload Ready | User selects documents for upload |
| Conversion in Progress | PDF/A conversion running |
| Upload Complete | All documents uploaded successfully |
| Restricted Category | Patient has restricted a document category |

**Components:**

| Component | Description |
|-----------|-------------|
| Document Category List | Hierarchical list of document categories: eArztbrief, eAU, eMP, NFD, DPE, Lab Results, Imaging, etc. Shows document count per category. |
| Document Row | A row per document showing: title/type, date, author (physician/practice), MIO profile badge, and actions (download, view). |
| Upload Button | Opens the Document Upload Dialog. Enabled only when entitlement is active. |
| Download/View Action | Downloads the document to the local PVS or opens it in a viewer (PDF/A rendering for CDA documents, direct view for PDFs). |
| Entitlement Status Card | Shows current status: active (green), expired (yellow), none (red), pending (blue). Validity dates. Practice name and authorized physicians. |
| Request Entitlement Button | Initiates an access authorization request via the patient's eGK or Aktensystem. |
| Document Type Selector | Dropdown per document: eArztbrief, eAU, eMP, NFD, DPE, General Document. Determines the MIO profile used for validation. |
| PDF/A Conversion Indicator | Shows conversion status: green check (already PDF/A compliant), blue spinner (converting), green check (converted), red X (conversion failed). |
| MIO Validation Badge | Badge showing whether the document conforms to the required MIO profile: green (valid), red (invalid with details). |

---

## Practice Administration

### System Status Bar

- **ID:** S074
- **Phase:** 7.1
- **Primary Role:** Admin
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 11.5 (2 states, 4 components, 0 extensions)

> A persistent status bar (header or footer region) visible across the application showing the current system date/time, logged-in user, and active practice location. Serves as the authoritative date reference for all data entry and validation.

**States:**

| State | Trigger |
|-------|---------|
| Normal | System clock is valid and synchronized |
| Clock Discrepancy Warning | System detects potential clock issues (e.g., OS date far in the past) |

**Components:**

| Component | Description |
|-----------|-------------|
| Date Input Validator | A shared date input component that validates calendar correctness (no Feb 30, no month 13) and rejects invalid dates immediately with an inline error message. |
| Forward-Date Guard | An inline validation that prevents saving any GNR or ICD-10-GM code with a date beyond the current system date. Shows error: "Date cannot be in the future." |
| Mandatory Field Default Confirmation | When a replacement/default value exists for a mandatory field, the field is shown empty with a subtle indicator (e.g., ghost text showing the default). The user must explicitly confirm to apply the default; it is never auto-populated. |
| System Date Display | Shows the OS-provided system date and time. No override mechanism exists in the application. Read-only, derived from OS clock. |

---

### Practice Administration Panel

- **ID:** S075
- **Phase:** 7.2
- **Primary Role:** Admin
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 22.0 (5 states, 7 components, 0 extensions)

> The central admin surface for managing practice locations (BSNR) and their assigned physicians (LANR). Shows all locations with their physicians, supports adding/editing locations and physician assignments, and controls billing file generation mode (per-location or consolidated).

**States:**

| State | Trigger |
|-------|---------|
| Single Location | Practice has only one BSNR |
| Multi-Location | Practice has multiple BSNRs |
| Consolidated Billing Enabled | Admin selects consolidated billing mode |
| Pseudo-LANR in Use | A user is assigned the pseudo-LANR 999999900 |
| Duplicate LANR Warning | Admin attempts to assign the same LANR to the same BSNR twice |

**Components:**

| Component | Description |
|-----------|-------------|
| Location Card | A card per practice location showing: BSNR, location name/address, list of assigned physicians (LANR + name), and an "Edit" action. Color-coded status indicator for billing readiness. |
| Physician Assignment Row | A row per physician showing: name, LANR, specialty, active/inactive status. Actions: remove from location, edit. The pseudo-LANR 999999900 row is visually distinguished. |
| Add Physician Action | Button to assign an existing user (by LANR) to this location, or to create a new user and assign simultaneously. Validates LANR uniqueness per BSNR before saving. |
| Billing Mode Selector | Toggle or radio: "Per-location billing" (default, one file per BSNR) or "Consolidated billing" (single file, all BSNRs). Only shown for multi-location practices. |
| User Account Row | A row per user showing: name, LANR, assigned locations (BSNR list), role, and permissions summary. Actions: edit, deactivate. |
| Role & Permissions Editor | Form for assigning roles (physician, MFA, admin, etc.) and granular permissions. Links the user to their LANR and one or more practice locations. |
| BSNR Billing File Preview | Shows which billing files will be generated based on current configuration. Lists each file with its BSNR-derived filename. In consolidated mode, shows a single file with all BSNRs listed. |

---

### User & Rights Management Panel

- **ID:** S076
- **Phase:** 7.2
- **Primary Role:** Admin
- **Design Tier:** 1 (Foundation Shells)
- **Complexity Score:** 22.0 (5 states, 7 components, 0 extensions)

> Admin surface for managing user accounts, roles, and permissions. Each user is linked to a LANR and one or more practice locations. Supports role-based access control so that billed services are traceable to the performing physician and location.

**States:**

| State | Trigger |
|-------|---------|
| Single Location | Practice has only one BSNR |
| Multi-Location | Practice has multiple BSNRs |
| Consolidated Billing Enabled | Admin selects consolidated billing mode |
| Pseudo-LANR in Use | A user is assigned the pseudo-LANR 999999900 |
| Duplicate LANR Warning | Admin attempts to assign the same LANR to the same BSNR twice |

**Components:**

| Component | Description |
|-----------|-------------|
| Location Card | A card per practice location showing: BSNR, location name/address, list of assigned physicians (LANR + name), and an "Edit" action. Color-coded status indicator for billing readiness. |
| Physician Assignment Row | A row per physician showing: name, LANR, specialty, active/inactive status. Actions: remove from location, edit. The pseudo-LANR 999999900 row is visually distinguished. |
| Add Physician Action | Button to assign an existing user (by LANR) to this location, or to create a new user and assign simultaneously. Validates LANR uniqueness per BSNR before saving. |
| Billing Mode Selector | Toggle or radio: "Per-location billing" (default, one file per BSNR) or "Consolidated billing" (single file, all BSNRs). Only shown for multi-location practices. |
| User Account Row | A row per user showing: name, LANR, assigned locations (BSNR list), role, and permissions summary. Actions: edit, deactivate. |
| Role & Permissions Editor | Form for assigning roles (physician, MFA, admin, etc.) and granular permissions. Links the user to their LANR and one or more practice locations. |
| BSNR Billing File Preview | Shows which billing files will be generated based on current configuration. Lists each file with its BSNR-derived filename. In consolidated mode, shows a single file with all BSNRs listed. |

---

### MVZ Dashboard `[GAP]`

- **ID:** S088
- **Phase:** 7.7
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 14.0 (4 states, 4 components, 0 extensions)
- **Gap Reason:** New Phase 7.7. MVZ management needs aggregate visibility across locations.

> Multi-location KPI dashboard for MVZ (Medizinische Versorgungszentren) administrators. Traffic-light drill-down by location, specialty, and practitioner. Shows billing volume, patient throughput, compliance status.

**States:**

| State | Trigger |
|-------|---------|
| Overview | Default view |
| Location Drill-Down | Click on location |
| Practitioner View | Click on practitioner |
| Alert State | KPI threshold breach |

**Components:**

| Component | Description |
|-----------|-------------|
| Traffic Light KPI Grid | Color-coded performance indicators by metric |
| Location Selector | Multi-location navigation with search |
| Trend Charts | Time-series for key metrics (billing, patients, compliance) |
| Alert Panel | Actionable items requiring admin attention |

---

## System Infrastructure

### Coding Rule Settings

- **ID:** S020
- **Phase:** 2A.5
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 27.5 (7 states, 9 components, 0 extensions)

> A settings panel where the physician or admin configures rule execution behavior: enable/disable per-case validation, enable/disable cross-quarter validation, set execution timing (on entry, on case closure, on demand).

**States:**

| State | Trigger |
|-------|---------|
| Violations Detected | Rule engine completes execution and finds violations |
| No Violations | Rule engine completes execution with no issues |
| Correction Pending | Physician is reviewing a specific violation in the overview |
| Correction Accepted | Physician clicks "Accept" on a correction |
| Correction Rejected | Physician clicks "Reject" on a correction |
| Execution Aborted | Physician clicks "Abort" during rule processing |
| Rule Update Notification | SDKRW version is updated at quarter start |

**Components:**

| Component | Description |
|-----------|-------------|
| Violation Count Badge | Shows the number of unresolved coding violations for the current case. Clicking navigates to the Rule Violation Overview. |
| Violation Row | One row per violation. Shows: affected ICD code + description, rule ID, rule hint text, correction type label (DELETE/REPLACE/ADD), proposed correction detail, and Accept/Reject actions. Expandable to show full rule text. |
| Correction Type Badge | A colored label indicating the correction type. DELETE (red), REPLACE (amber), ADD (blue/green). Helps the physician quickly scan the severity and nature of each violation. |
| Confirmation Dialog | When the physician clicks "Accept," a brief confirmation shows exactly what will change (e.g., "Delete diagnosis E11.9?" or "Replace E11.9 with E11.65?"). Requires a second click to execute. |
| Abort Button | Stops rule engine processing. Preserves already-accepted corrections. Clearly labeled to avoid confusion with "Reject all." |
| Inline Violation Indicator | A small warning icon on diagnosis entries that have associated rule violations. Clicking navigates to the relevant violation in the overview. |
| Execution Timing Selector | Controls for when per-case rules run: "On diagnosis entry," "On case closure," "On demand only." Similar controls for cross-quarter scope. |
| Rule Change Summary | Lists new, modified, and removed rules after an SDKRW update. Each entry shows the rule ID and a brief description of the change. |
| SDKRW Version Indicator | Displays the currently active SDKRW version and quarter. |

---

### Multimorbidity Surcharge Patient List

- **ID:** S021
- **Phase:** 2A.6
- **Primary Role:** Doctor
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 27.5 (7 states, 9 components, 0 extensions)

> A batch report view showing patients with 3+ disease patterns for the multimorbidity surcharge (P4). Displays patient details, matched disease patterns, and highlighting for patients with 1 or 2 P4 services. Printable. Accessible from billing validation run.

**States:**

| State | Trigger |
|-------|---------|
| Carry-Forward Review | New quarter starts for an HZV/FAV patient |
| Terminal Code Prompt | Physician enters a non-terminal ICD code |
| Acute-as-Permanent Warning | Code flagged as acute is stored/carried as Dauerdiagnose |
| Repeated Suspected Diagnosis Warning | Same code documented as suspected (V) in both current and previous quarter |
| Disease Pattern Result — Matches Found | Single-patient disease pattern check returns 1-18 groups |
| Disease Pattern Result — No Matches | Single-patient check returns 0 groups |
| Surcharge List — Highlighted Rows | Multimorbidity report generated |

**Components:**

| Component | Description |
|-----------|-------------|
| Carry-Forward Review Panel | List of all Dauerdiagnosen carried into the new quarter. Each row shows: ICD code, Klartext, Diagnosensicherheit. Actions: Confirm (keep) or Remove (exclude from this quarter). |
| Terminal Code Selector | When a non-terminal code is entered, expands to show available sub-codes in a dropdown or inline list. Guides selection of the most specific code. |
| Acute-as-Permanent Warning Banner | Amber inline warning on Dauerdiagnosen with acute-only codes. Configurable per HZV/FAV contract rules. Dismissible but logged. |
| Repeated Suspected Warning Banner | Amber warning when a code with Diagnosensicherheit V matches a suspected diagnosis from the previous quarter. Suggests confirmation or exclusion. |
| Disease Pattern Check Button | A button labeled "Pruefung auf Multimorbiditaet nach P4" that triggers the single-patient disease pattern check. Available for all actively participating HZV/FAV patients. |
| Disease Pattern Result Panel | Displays matched disease pattern groups as clear-text names. Format: patient name, DOB, semicolon-separated disease patterns with line breaks. Or a table with first name, last name, patient number, DOB, disease patterns. |
| Patient Row (Surcharge List) | One row per patient with 3+ disease patterns. Columns: first name, last name, patient number, DOB, disease patterns (clear-text, semicolon-separated). Two highlight styles for 1-P4-service and 2-P4-service patients. Patient name links to patient record for diagnosis adjustment. |
| Surcharge List Legend | Explains the two highlight styles (1 P4 service vs. 2 P4 services). |
| Surcharge List Disclaimer | Mandatory closing text about the report scope (unbilled services only, no guarantee of actual reimbursement). |

---

### TI Connector Status Panel

- **ID:** S077
- **Phase:** 7.3
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 14.5 (4 states, 4 components, 0 extensions)

> An admin panel showing the practice's TI connector information: product name, firmware/product type version, certificate expiry date, and supported TI applications (ePA, eRezept, KIM, etc.). All data is read from the connector and displayed for the admin. This information is also automatically embedded in ADT billing files.

**States:**

| State | Trigger |
|-------|---------|
| Connected | Connector is reachable and responding |
| Certificate Expiring Soon | Certificate expiry date is within 90 days (configurable threshold) |
| Certificate Expired | Certificate expiry date has passed |
| Connector Unreachable | Connector cannot be contacted |

**Components:**

| Component | Description |
|-----------|-------------|
| Connector Identity Card | Shows connector product name (FK 0228) and ProductTypeVersion (FK 0224) in a card layout. Read-only, auto-populated from connector. |
| Certificate Expiry Display | Shows the connector certificate expiry date (FK 0227) with color-coded urgency: green (>90 days), yellow (30-90 days), red (<30 days or expired). |
| TI Application Checklist | A checklist of TI specialist applications with their support status. Each row: application name (ePA, eRezept, KIM, etc.), supported (green check) or not supported (gray dash). This attestation data is transmitted in the ADT billing. |
| Billing Inclusion Indicator | A subtle note confirming: "This information is automatically included in ADT billing files (FK 0224, FK 0227, FK 0228)." Reassures the admin that no manual action is needed for billing transmission. |

---

### Module Management Panel

- **ID:** S080
- **Phase:** 7.5
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 23.5 (6 states, 7 components, 0 extensions)

> An admin panel for managing the XPM (validation module) and XKM (crypto module). Shows current module versions, deployment status, and update availability. Provides import/update actions and a processing pipeline view showing the billing file workflow: validate → attach communication record → encrypt.

**States:**

| State | Trigger |
|-------|---------|
| Modules Current | XPM and XKM are on the current quarterly version |
| Module Update Available | A newer version of XPM or XKM is available |
| Standalone XPM Mode | Practice uses standalone XPM instead of integrated |
| Integrated Mode | XPM is integrated into the PVS (default) |
| AMV Certified | AMV certification number is entered |
| AMV Not Configured | No AMV certification number entered |

**Components:**

| Component | Description |
|-----------|-------------|
| Module Card | One card per module (XPM, XKM). Shows: module name, current version, last update date, and status badge. Actions: "Update," "View Details." |
| Processing Pipeline Diagram | A visual flow diagram showing the billing file processing sequence: (1) Generate KVDT file → (2) XPM validation → (3) Append communication record → (4) XKM encryption → (5) Ready for transmission. Each step shows its current status. |
| Export Unencrypted File Action | A button to export the raw, unvalidated, unencrypted KVDT billing file for processing by a standalone XPM. Only visible when standalone mode is active. |
| AMV Certification Field | Input field for the KBV AMV certification number. Stored persistently and transmitted in FK 9250 of every billing file. |
| ICD-10-GM Version Display | Shows the currently active ICD-10-GM version (annual release). Read-only, derived from the deployed ICD catalog. Status indicator: green if current year's version is active. |
| Form Printing Catalog Status | Shows compliance with the KBV form printing requirements catalog. Read-only status indicator confirming that form printing follows the mandatory specification. |
| Fee Schedule Auto-Population Indicator | Confirms that fee schedule (FK 4121) is automatically pre-populated from the cost carrier master data (SDKT). Shows the lookup logic: patient insurance → SDKT → fee schedule code. |

---

### System Compliance Settings

- **ID:** S081
- **Phase:** 7.5
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 23.5 (6 states, 7 components, 0 extensions)

> A settings panel for system-wide compliance parameters: AMV certification number (FK 9250), ICD-10-GM version status, and form printing catalog version. These are rarely changed but must be accessible and correctly transmitted in billing data.

**States:**

| State | Trigger |
|-------|---------|
| Modules Current | XPM and XKM are on the current quarterly version |
| Module Update Available | A newer version of XPM or XKM is available |
| Standalone XPM Mode | Practice uses standalone XPM instead of integrated |
| Integrated Mode | XPM is integrated into the PVS (default) |
| AMV Certified | AMV certification number is entered |
| AMV Not Configured | No AMV certification number entered |

**Components:**

| Component | Description |
|-----------|-------------|
| Module Card | One card per module (XPM, XKM). Shows: module name, current version, last update date, and status badge. Actions: "Update," "View Details." |
| Processing Pipeline Diagram | A visual flow diagram showing the billing file processing sequence: (1) Generate KVDT file → (2) XPM validation → (3) Append communication record → (4) XKM encryption → (5) Ready for transmission. Each step shows its current status. |
| Export Unencrypted File Action | A button to export the raw, unvalidated, unencrypted KVDT billing file for processing by a standalone XPM. Only visible when standalone mode is active. |
| AMV Certification Field | Input field for the KBV AMV certification number. Stored persistently and transmitted in FK 9250 of every billing file. |
| ICD-10-GM Version Display | Shows the currently active ICD-10-GM version (annual release). Read-only, derived from the deployed ICD catalog. Status indicator: green if current year's version is active. |
| Form Printing Catalog Status | Shows compliance with the KBV form printing requirements catalog. Read-only status indicator confirming that form printing follows the mandatory specification. |
| Fee Schedule Auto-Population Indicator | Confirms that fee schedule (FK 4121) is automatically pre-populated from the cost carrier master data (SDKT). Shows the lookup logic: patient insurance → SDKT → fee schedule code. |

---

### HZV / FAV Contract Management Panel

- **ID:** S082
- **Phase:** 7.6
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 37.0 (10 states, 10 components, 0 extensions)

> The central admin surface for configuring and managing selective contracts (HZV and FaV). Shows all available contracts, active contracts, contract IDs, fee schedule appendices, and cost carrier mappings. Entry point for contract activation, configuration, and document access.

**States:**

| State | Trigger |
|-------|---------|
| Contract Activation — Step 1 | Admin initiates contract activation for a physician |
| Contract Activation — Step 2 | Admin explicitly requests to see all contracts |
| Contract Active | A contract is activated and configured |
| VP-ID Available | Physician has a VP-ID stored |
| VP-ID Missing | Physician has legacy ID but no VP-ID |
| VP-ID Retrieval in Progress | Admin triggers VP-ID retrieval |
| Participation Return Data | System fetches participation data from HPM API |
| HZV Documents | User views HZV contract documents |
| FaV Documents | User views FaV contract documents |
| AWH_01 Documents | User views AWH_01 contract documents |

**Components:**

| Component | Description |
|-----------|-------------|
| Contract Card | One card per active contract showing: contract ID (ALLG661), contract type (HZV/FaV), KV region, validity period, fee schedule appendices, and cost carrier summary. Actions: configure, view documents, deactivate. |
| Contract Activation Wizard | Two-step flow: Step 1 shows region-filtered contracts (automatic). Step 2 (explicit action) shows all contracts. Guides admin through activating a contract for a physician. |
| Fee Schedule Appendix List | Lists the fee schedule appendices (Honoraranlagen) for the contract. Each appendix shows its name and the service codes it covers. |
| Cost Carrier Tree | Hierarchical view of cost carriers covered by the contract: main funds (Hauptkassen) → individual funds (Kassen), each with IK numbers. Parsed from the contract XML. |
| Participation Status Display | Shows participation return data from the HPM API. Read-only, informational only. Includes the mandatory notice about requiring written HÄVG confirmation before making changes. |
| Physician Identity Row | One row per physician showing: name, LANR, HÄVG-ID (HZV), MEDIVERBUND-ID (FaV), VP-ID (H-type, F-type, B-type), and migration status. Actions: "Retrieve VP-ID." |
| VP-ID Retrieval Action | Button that calls the HPM API to retrieve the VP-ID from the legacy ID. Shows progress and result. One-time action per physician per ID type. |
| Document List | List of public contract documents with: document name, type (Vertragstexte/Dokumente), and actions (view, print). Non-public documents are not shown. |
| External Portal Link | Links to external portals for online document access: HÄVG (HZV), MEDIVERBUND (FaV), Hausärzteverband (AWH_01). |
| Change Documentation Panel | Displays the changelog for the current software version: new features, changed features, removed features since the previous quarterly update. |

---

### Physician Identity Management Panel

- **ID:** S083
- **Phase:** 7.6
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 37.0 (10 states, 10 components, 0 extensions)

> Admin surface for managing physician identifiers used in HZV/FAV contracts: HÄVG-ID, MEDIVERBUND-ID, and VP-ID. Shows each physician's identifiers with migration status (legacy ID → VP-ID). Supports automatic VP-ID retrieval from the HPM API.

**States:**

| State | Trigger |
|-------|---------|
| Contract Activation — Step 1 | Admin initiates contract activation for a physician |
| Contract Activation — Step 2 | Admin explicitly requests to see all contracts |
| Contract Active | A contract is activated and configured |
| VP-ID Available | Physician has a VP-ID stored |
| VP-ID Missing | Physician has legacy ID but no VP-ID |
| VP-ID Retrieval in Progress | Admin triggers VP-ID retrieval |
| Participation Return Data | System fetches participation data from HPM API |
| HZV Documents | User views HZV contract documents |
| FaV Documents | User views FaV contract documents |
| AWH_01 Documents | User views AWH_01 contract documents |

**Components:**

| Component | Description |
|-----------|-------------|
| Contract Card | One card per active contract showing: contract ID (ALLG661), contract type (HZV/FaV), KV region, validity period, fee schedule appendices, and cost carrier summary. Actions: configure, view documents, deactivate. |
| Contract Activation Wizard | Two-step flow: Step 1 shows region-filtered contracts (automatic). Step 2 (explicit action) shows all contracts. Guides admin through activating a contract for a physician. |
| Fee Schedule Appendix List | Lists the fee schedule appendices (Honoraranlagen) for the contract. Each appendix shows its name and the service codes it covers. |
| Cost Carrier Tree | Hierarchical view of cost carriers covered by the contract: main funds (Hauptkassen) → individual funds (Kassen), each with IK numbers. Parsed from the contract XML. |
| Participation Status Display | Shows participation return data from the HPM API. Read-only, informational only. Includes the mandatory notice about requiring written HÄVG confirmation before making changes. |
| Physician Identity Row | One row per physician showing: name, LANR, HÄVG-ID (HZV), MEDIVERBUND-ID (FaV), VP-ID (H-type, F-type, B-type), and migration status. Actions: "Retrieve VP-ID." |
| VP-ID Retrieval Action | Button that calls the HPM API to retrieve the VP-ID from the legacy ID. Shows progress and result. One-time action per physician per ID type. |
| Document List | List of public contract documents with: document name, type (Vertragstexte/Dokumente), and actions (view, print). Non-public documents are not shown. |
| External Portal Link | Links to external portals for online document access: HÄVG (HZV), MEDIVERBUND (FaV), Hausärzteverband (AWH_01). |
| Change Documentation Panel | Displays the changelog for the current software version: new features, changed features, removed features since the previous quarterly update. |

---

### Contract Documents Viewer

- **ID:** S084
- **Phase:** 7.6
- **Primary Role:** Admin
- **Design Tier:** 5 (Admin & Infrastructure)
- **Complexity Score:** 37.0 (10 states, 10 components, 0 extensions)

> A read-only viewer for accessing public contract documents (Vertragstexte, Dokumente). Provides view and print actions for locally available documents and links to external portals (HÄVG, MEDIVERBUND, Hausärzteverband) for online access.

**States:**

| State | Trigger |
|-------|---------|
| Contract Activation — Step 1 | Admin initiates contract activation for a physician |
| Contract Activation — Step 2 | Admin explicitly requests to see all contracts |
| Contract Active | A contract is activated and configured |
| VP-ID Available | Physician has a VP-ID stored |
| VP-ID Missing | Physician has legacy ID but no VP-ID |
| VP-ID Retrieval in Progress | Admin triggers VP-ID retrieval |
| Participation Return Data | System fetches participation data from HPM API |
| HZV Documents | User views HZV contract documents |
| FaV Documents | User views FaV contract documents |
| AWH_01 Documents | User views AWH_01 contract documents |

**Components:**

| Component | Description |
|-----------|-------------|
| Contract Card | One card per active contract showing: contract ID (ALLG661), contract type (HZV/FaV), KV region, validity period, fee schedule appendices, and cost carrier summary. Actions: configure, view documents, deactivate. |
| Contract Activation Wizard | Two-step flow: Step 1 shows region-filtered contracts (automatic). Step 2 (explicit action) shows all contracts. Guides admin through activating a contract for a physician. |
| Fee Schedule Appendix List | Lists the fee schedule appendices (Honoraranlagen) for the contract. Each appendix shows its name and the service codes it covers. |
| Cost Carrier Tree | Hierarchical view of cost carriers covered by the contract: main funds (Hauptkassen) → individual funds (Kassen), each with IK numbers. Parsed from the contract XML. |
| Participation Status Display | Shows participation return data from the HPM API. Read-only, informational only. Includes the mandatory notice about requiring written HÄVG confirmation before making changes. |
| Physician Identity Row | One row per physician showing: name, LANR, HÄVG-ID (HZV), MEDIVERBUND-ID (FaV), VP-ID (H-type, F-type, B-type), and migration status. Actions: "Retrieve VP-ID." |
| VP-ID Retrieval Action | Button that calls the HPM API to retrieve the VP-ID from the legacy ID. Shows progress and result. One-time action per physician per ID type. |
| Document List | List of public contract documents with: document name, type (Vertragstexte/Dokumente), and actions (view, print). Non-public documents are not shown. |
| External Portal Link | Links to external portals for online document access: HÄVG (HZV), MEDIVERBUND (FaV), Hausärzteverband (AWH_01). |
| Change Documentation Panel | Displays the changelog for the current software version: new features, changed features, removed features since the previous quarterly update. |

---
