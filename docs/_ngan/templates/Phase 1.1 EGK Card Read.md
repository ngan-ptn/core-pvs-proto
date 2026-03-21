# Phase 1.1 User Stories — eGK Card Read-In

**Phase:** 1 — Patient Data Management
**Sub-Phase:** 1.1 — eGK Card Read-In
**Date:** 2026-03-16
**Source Requirements:** 15 (from KVDT KBV spec)

---

## UI Surface Map

A **UI surface** is a distinct view, page, or panel that a designer needs to lay out. Each surface may contain multiple **states** (what changes on the same surface depending on conditions) and **components** (reusable UI elements embedded within the surface). This section lists the actual design deliverables, not every possible interaction.

### Surfaces

| # | Surface | Description | Related Req IDs |
|---|---------|-------------|-----------------|
| 1 | **Card Read / Check-In Screen** | The primary interface where staff reads a patient's card. Contains the read trigger, terminal status, and result area. This single surface handles the entire card read flow through its states (below). | KP2-100, KP2-101, KP2-102, P2-105, P2-120, P2-135, P2-136, P2-140, P2-150, P2-166 |
| 2 | **Patient Record View** | The patient's stored data after a successful read. Displays insurance details, coverage status, VSDM verification, WOP code, and care context. This is where read data "lands" and where staff reviews the patient profile. | KP2-185, KP2-190, KP2-191, KP2-121, KP2-195 |

### States (conditions that change what Surface 1 displays)

| State                                | Trigger                                                       | What Changes on Screen                                                                                                | Related Req IDs        |
| ------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Idle**                             | No card action in progress                                    | Read trigger button active, terminal connection indicator visible                                                     | KP2-100                |
| **Reading**                          | Staff initiates card read                                     | Loading/progress indicator replaces the trigger button                                                                | KP2-100                |
| **Success**                          | Valid eGK read completes                                      | Result area shows patient name, insurer, read-in date (FK 4109). Date is non-editable.                                | P2-105, P2-120, P2-135 |
| **Success + Coverage Warning**       | Valid read, but coverage dates are expired or not yet active  | Success state plus a warning banner showing coverage dates and insurer name                                           | P2-140, P2-166         |
| **Success + Re-Read**                | Card re-read for patient already read this quarter            | Success state plus a confirmation notification showing previous date, new date, and count of updated billing records  | P2-136, P2-150         |
| **Error: KVK Rejected**              | KVK detected for statutory patient (VKNR digits 3-5 < 800)    | Error message replaces result area. Explains KVK no longer accepted since 2015. "Show Card Data" action is available. | KP2-101                |
| **Error: KVK Rejected + Data Shown** | Staff clicks "Show Card Data" on KVK error                    | Error state expands to show all card fields as selectable, copyable text for manual transfer                          | KP2-102                |
| **Error: BPol KVK Blocked**          | KVK read attempted for BPol patient with existing eGK on file | Error message explaining that an eGK is already on file and outdated KVK data cannot overwrite it                     | KP2-121                |

### Components (reusable elements within Surface 2)

| Component | Location | Description | Related Req IDs |
|-----------|----------|-------------|-----------------|
| **VSDM Status Badge** | Patient Record View, header or insurance section | Icon/badge showing online verification status. Visually distinct for "verified this quarter" vs. "stale/needs refresh." Shows FK 4136 value and timestamp. | KP2-185, KP2-190, KP2-191 |
| **Coverage Status Indicator** | Patient Record View, insurance section | Shows current coverage validity (active, expired, not yet started) with start/end dates | P2-140, P2-166 |
| **WOP Field** | Patient Record View, insurance details section | Displays the WOP regional code. Editable as a manual fallback. | KP2-121 |
| **Care Context Label** | Patient Record View, header or tab | Indicates whether this record is Outpatient or Inpatient. Prevents cross-context data access. | KP2-195 |
| **Read-In Date (FK 4109)** | Patient Record View, metadata section | System-generated, non-editable date showing when the card was last read | P2-135, P2-136, P2-150 |

---

## Glossary for Designers

These terms appear throughout the user stories. Understanding them will help you design the right UI.

| Term | What It Means |
|------|---------------|
| **eGK** | Elektronische Gesundheitskarte. The current electronic health insurance card used in Germany. It is a chip card that stores patient and insurance data. |
| **KVK** | Krankenversichertenkarte. The old magnetic-stripe health insurance card, phased out January 1, 2015. The system must reject these for statutory patients. |
| **VKNR** | Vertragskassennummer. A number on the card that identifies the insurance fund. Digits 3-5 distinguish statutory vs. other insurance types. |
| **IK** | Institutionskennzeichen. An institutional identifier used alongside VKNR to look up the correct cost carrier (insurer) from a master data file. |
| **VSDM** | Versichertenstammdatenmanagement. An online verification process that checks whether the patient's insurance data on the card is still current. |
| **FK 4109** | Feldkennung 4109. A specific data field that stores the date the card was read. It is system-generated (not manually entered) and has legal significance. |
| **FK 4136** | Feldkennung 4136. A data field that stores the VSDM online proof status. Indicates whether the card data was verified online. |
| **PVS** | Praxisverwaltungssystem. The practice management system (the software being built). |
| **ADT** | Abrechnungsdatentransfer. The billing data transfer format used to submit claims to insurers. |
| **WOP** | Wohnortprinzip. A regional assignment identifier on the card. Determines which regional association processes the billing. |
| **BPol** | Bundespolizei. Federal police. Their insured members have special card-handling rules. |
| **Quarter** | German healthcare billing works in calendar quarters (Q1 = Jan-Mar, Q2 = Apr-Jun, etc.). Many rules reference "within the same quarter." |
| **Cost Carrier** | The insurance entity responsible for paying the patient's medical bills. Resolved from the card's VKNR and IK numbers. |

---

## User Stories

---

### US-1.1.1 — Read Patient Data from eGK Card

#### User Story US-1.1.1:
- **Summary**: Practice staff reads an eGK card to capture patient data into the system automatically

#### What This Means (Designer Context)
This is the primary happy-path workflow. A patient arrives at the front desk, hands over their eGK card, the staff member inserts it into a card terminal, and the system pulls all the patient's insurance data in automatically. The system also looks up the patient's insurer using numbers on the card (VKNR and IK) and records the exact date/time the card was read. This date (FK 4109) is legally significant. It cannot be typed in manually. It must come from the system clock.

**What the UI should show:** A clear "Read Card" action, a loading/progress state while reading, then a confirmation view showing the patient's data fields populated from the card. The read-in date should be displayed but not editable.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** read a patient's eGK card through a connected terminal and have their data automatically captured and mapped into the system,
**so that I can** register the patient quickly and accurately without manual data entry,
**but** the card data fields use a raw format that must be transformed per the KBV mapping specification before they can be stored or billed.

#### Acceptance Criteria
**Scenario:** Successful eGK card read populates patient record

**Given** a card terminal is connected to the system via RS232, LAN, or USB
- And **Given** the patient has presented a valid eGK card
- And **Given** the KBV mapping table is available in the system

**When** the staff member initiates a card read

**Then** the system captures all patient data fields from the eGK, transforms them per the KBV mapping table, resolves the cost carrier from the VKNR/IK via the KT master data file, generates the read-in date (FK 4109) from the system clock, and displays the populated patient record with the read-in date shown as non-editable

#### Split Check
- The `Then` is compound (transform + resolve + generate date + display). However, these are all part of one atomic system response to a single card read. Splitting would create stories that cannot be independently delivered or tested. **No split recommended.**

#### Assumptions to Validate
- All three terminal connection types (RS232, LAN, USB) use the same read workflow from the user's perspective
- The KBV mapping table is pre-loaded in the system and does not require user action to update
- The cost carrier resolution from VKNR/IK is instantaneous and does not require network calls

**Covers requirements:** KP2-100, P2-105, P2-120, P2-135

---

### US-1.1.2 — Handle Rejected KVK Card with Data Recovery

#### User Story US-1.1.2:
- **Summary**: System rejects legacy KVK cards but lets staff copy the data for manual entry

#### What This Means (Designer Context)
Before 2015, patients had older magnetic-stripe cards called KVKs. These are no longer accepted for statutory-insured patients. If someone presents one of these old cards, the system must block the read and show an error. But the data on the card might still be useful. So after showing the error, the system should let the staff view and copy the card data (like a read-only text display with a "Copy" button), so they can paste it into a manual patient entry form.

The system identifies a KVK as belonging to a statutory patient by checking digits 3-5 of the VKNR number. If those digits are below 800, it is a statutory patient and the KVK is rejected.

**What the UI should show:** An error dialog with a clear explanation of why the card was rejected, plus a "Show Card Data" button. That button opens a secondary view showing all the card fields in a selectable, copyable text format.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** see the data from a rejected KVK card in a copyable format,
**so that I can** manually enter the patient's information into the system without asking them to recall it from memory,
**but** the system must first reject the KVK read for statutory patients (VKNR digits 3-5 < 800) with a clear error message.

#### Acceptance Criteria
**Scenario:** KVK card rejected with data shown in copyable format

**Given** a patient has presented a legacy KVK card
- And **Given** the VKNR serial number digits 3-5 are less than 800 (statutory insured)

**When** the staff member initiates a card read

**Then** the system rejects the read with an error message explaining that KVK cards are no longer accepted for statutory patients since January 1, 2015, and offers an option to display the card data in a copyable format for manual transfer

#### Split Check
- The rejection and the data display are two distinct user interactions (error first, then optional "show data"). However, the data display has no value without the rejection context, and the rejection is incomplete without a recovery path. **No split recommended.**

#### Assumptions to Validate
- The VKNR check (digits 3-5 < 800) is the only criterion for identifying statutory patients
- Non-statutory patients (digits >= 800) can still use a KVK without rejection
- The copyable display includes all fields that were readable from the KVK

**Covers requirements:** KP2-101, KP2-102

---

### US-1.1.3 — Alert Staff When Insurance Coverage Is Invalid

#### User Story US-1.1.3:
- **Summary**: System warns staff when a patient's insurance coverage is expired or not yet active

#### What This Means (Designer Context)
Every eGK card contains coverage start and end dates. When the card is read, the system checks whether today's date falls within that coverage period. If coverage has expired (end date is in the past) or hasn't started yet (start date is in the future), the system must show a warning. This is not a blocking error. The staff can still proceed, but they need to know there may be a problem getting the visit paid for.

**What the UI should show:** A prominent warning banner or alert dialog after the card read completes. It should clearly state whether coverage is expired or not yet active, show the relevant dates, and let the staff acknowledge and continue.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** be alerted immediately when a patient's insurance coverage is expired or not yet active,
**so that I can** verify the patient's current insurance status before providing treatment that may not be reimbursed,
**but** the coverage dates on the card may be outdated or the patient may have switched insurers without updating their card.

#### Acceptance Criteria
**Scenario:** Coverage validity alert shown after card read

**Given** a patient's eGK card has been successfully read
- And **Given** the card contains insurance coverage start and end dates

**When** the system evaluates the coverage validity period against the current system date

**Then** the system displays a warning alert indicating whether coverage has expired or has not yet begun, showing the coverage start date, end date, and insurer name

#### Split Check
- Single behavior (check dates, show warning). **No split recommended.**

#### Assumptions to Validate
- The alert is non-blocking (staff can dismiss and continue)
- Both "expired" and "not yet active" scenarios use the same alert screen with different messaging
- The system date used for comparison is the same date stored as FK 4109

**Covers requirements:** P2-140, P2-166

---

### US-1.1.4 — Update Records When Card Is Re-Read Within the Same Quarter

#### User Story US-1.1.4:
- **Summary**: Re-reading a card within the same quarter updates the read-in date across all active billing records

#### What This Means (Designer Context)
German healthcare billing works in quarterly cycles. If a patient visits multiple times in the same quarter, they might have their card read again (e.g., insurance data changed, or it is practice policy to re-read each visit). When this happens, the system must update the read-in date (FK 4109) not just on the current record, but on ALL active billing records (type 010x) for that patient in the current quarter. The system should tell the staff that a re-read was detected and how many records were updated.

**What the UI should show:** A confirmation notification after the re-read, showing the previous read-in date, the new read-in date, and the number of billing records that were updated. This reassures the staff that the update propagated correctly.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** re-read a patient's eGK card and have the read-in date automatically updated across all their active billing records for the current quarter,
**so that I can** ensure all billing submissions reference the most recent card read date,
**but** the update must propagate to all record types 010x without the staff manually identifying which records to update.

#### Acceptance Criteria
**Scenario:** Card re-read updates read-in date across all quarter records

**Given** a patient's eGK card has already been read in the current billing quarter
- And **Given** the patient has one or more active billing records (type 010x) in the current quarter

**When** the staff member re-reads the patient's eGK card

**Then** the system updates the read-in date (FK 4109) to the current system date on all active billing records (type 010x) for that patient in the current quarter and displays a confirmation showing the previous date, new date, and count of updated records

#### Split Check
- Single trigger (re-read), single behavior (update + confirm). The propagation across records is internal logic, not a separate user action. **No split recommended.**

#### Assumptions to Validate
- "Active billing records" means all 010x record types, not just the most recent
- The cost carrier name transformation rules (Technical Annex to Appendix 4a) are applied automatically during the update
- The confirmation notification does not require staff acknowledgment to proceed

**Covers requirements:** P2-136, P2-150

---

### US-1.1.5 — Capture and Display VSDM Online Verification Status

#### User Story US-1.1.5:
- **Summary**: System captures the VSDM online proof status and validates its freshness for the current quarter

#### What This Means (Designer Context)
VSDM is an online check that verifies a patient's insurance data is current. When the card is read, the system captures whether this online check succeeded (stored in field FK 4136) and records a timestamp. This proof status must be included when billing data is transmitted to insurers. The system also checks whether the VSDM timestamp is from the current quarter. If it is stale (from a previous quarter), the data may need to be refreshed.

Additionally, the system manages two automatic rules: (1) co-payment exemptions must be cleared at the turn of the year, and (2) patients under 18 are automatically fee-exempt (except for patient transport forms, called "Muster 4").

**What the UI should show:** A status indicator on the patient record (e.g., a badge or icon) showing the VSDM proof status. It should be visually distinct for "verified this quarter" vs. "stale/needs refresh." The under-18 fee exemption and co-payment reset are background system behaviors, not requiring UI interaction, but may appear as status flags on the patient record.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** see the VSDM online verification status and its quarter validity after reading a patient's card,
**so that I can** confirm the patient's insurance data is current before treatment and ensure billing includes the required proof,
**but** the VSDM timestamp may be from a previous quarter, requiring a fresh verification.

#### Acceptance Criteria
**Scenario:** VSDM proof status captured and validated after card read

**Given** a patient's eGK card has been successfully read
- And **Given** the system has performed a VSDM online verification check

**When** the system processes the VSDM proof result

**Then** the system stores the online proof status (FK 4136), validates the VSDM timestamp against the current billing quarter, and displays a status indicator showing whether the proof is current-quarter valid or stale

#### Split Check
- The co-payment reset (year-end) and under-18 fee exemption are background rules, not user-facing workflows. They could be separate stories, but they have no distinct UI trigger or user action. Kept here as system behaviors tied to the VSDM check. **No split recommended**, but co-payment/exemption logic should be noted in technical specs.

#### Assumptions to Validate
- The VSDM check happens automatically during every card read (not triggered separately by the user)
- "Stale" means the timestamp quarter does not match the current calendar quarter
- The co-payment exemption reset at year-end is a background job, not triggered by a card read
- Under-18 fee exemption is determined by date of birth on the card vs. current date

**Covers requirements:** KP2-185, KP2-190, KP2-191

---

### US-1.1.6 — Handle WOP Regional Assignment and Block Outdated KVK After eGK Read

#### User Story US-1.1.6:
- **Summary**: System captures the WOP regional code and prevents outdated KVK reads after an eGK has been used

#### What This Means (Designer Context)
The WOP (Wohnortprinzip) is a code on the card that indicates which regional physicians' association handles the billing. It determines where the claim goes geographically. The system must extract and transform this code per specific rules.

There is a special case for BPol (Federal Police) insured patients: once the system has read a modern eGK for a BPol patient, it must block any future attempt to read an old KVK for the same patient. This prevents outdated insurance data from overwriting current data. The WOP code can also be entered manually if needed.

**What the UI should show:** The WOP code should appear as a field in the patient record (possibly in an "Insurance Details" section). If a staff member tries to read a KVK for a BPol patient who already has an eGK on file, the system should show a blocking error. Manual WOP entry should be available as a fallback field.

#### Use Case
**As a** practice staff member at the front desk,
**I want to** have the WOP regional code captured automatically from the eGK and prevent outdated KVK cards from being read for BPol patients who already have an eGK on file,
**so that I can** ensure billing is routed to the correct regional association and patient data is not overwritten with stale information,
**but** the WOP transformation rules are complex and the system must also support manual WOP entry as a fallback.

#### Acceptance Criteria
**Scenario:** WOP captured from eGK and KVK blocked for known BPol eGK patient

**Given** a BPol-insured patient's eGK card has previously been read and stored in the system
- And **Given** a staff member attempts to read a KVK card for the same patient

**When** the system identifies the patient as a BPol member with an existing eGK record

**Then** the system rejects the KVK read with an error message explaining that an eGK is already on file for this patient and outdated KVK data cannot overwrite it

#### Split Check
- WOP capture (during every eGK read) and BPol KVK blocking (edge case) are two distinct behaviors with different triggers. However, KP2-121 bundles them as a single requirement. Consider splitting if the BPol blocking logic is complex:
  1. **US-1.1.6a** — WOP code capture and transformation from eGK
  2. **US-1.1.6b** — Block KVK read for BPol patients with existing eGK record

#### Assumptions to Validate
- BPol patients are identifiable from card data (specific VKNR range or insurer IK)
- The KVK block applies only to BPol patients, not all patients with an existing eGK
- Manual WOP entry is available regardless of card type
- WOP transformation rules from the Technical Annex are already implemented in the system

**Covers requirements:** KP2-121

---

### US-1.1.7 — Separate Patient Data Between Outpatient and Inpatient Contexts

#### User Story US-1.1.7:
- **Summary**: System keeps outpatient and inpatient patient data strictly separated to prevent billing errors

#### What This Means (Designer Context)
Some medical facilities handle both outpatient visits (patient comes in and goes home the same day) and inpatient stays (patient is admitted to the hospital). German billing rules require that patient master data from these two contexts is never mixed. The same patient might exist in both contexts, but their records must be stored and billed separately. This matters for the card read workflow because when a card is read, the system needs to know which context it belongs to.

**What the UI should show:** When reading a card, the system should either (a) prompt the staff to select "Outpatient" or "Inpatient" context, or (b) inherit the context from the current workspace/module. The patient record should clearly indicate which context it belongs to. Staff should not be able to accidentally merge or cross-reference records across contexts.

#### Use Case
**As a** billing administrator in a facility that handles both outpatient and inpatient care,
**I want to** ensure that patient master data captured from card reads is stored separately for outpatient and inpatient contexts,
**so that I can** submit accurate billing data without risk of commingling records across care settings,
**but** the same patient may appear in both contexts and the system must prevent accidental cross-contamination of their data.

#### Acceptance Criteria
**Scenario:** Card read data stored in correct care context without cross-contamination

**Given** the billing system is used for both outpatient and inpatient care
- And **Given** a patient's eGK card is being read

**When** the staff member initiates the card read within a specific care context (outpatient or inpatient)

**Then** the system stores the patient master data exclusively within that care context, preventing it from being visible in or merged with the other care context's records

#### Split Check
- Single behavior (context-aware storage). **No split recommended.**

#### Assumptions to Validate
- The care context (outpatient vs. inpatient) is determined before or during the card read, not after
- Facilities that only do outpatient care do not see this workflow at all
- A patient can have separate records in both contexts, each with their own read-in date and billing records
- There is no UI for merging records across contexts (by design)

**Covers requirements:** KP2-195

---

## Requirement Coverage Matrix

Every Phase 1.1 requirement is covered by at least one user story.

| Requirement ID | Story | Description |
|---------------|-------|-------------|
| KP2-100 | US-1.1.1 | Patient data capture from eGK/KVK |
| KP2-101 | US-1.1.2 | KVK rejection since 2015 |
| KP2-102 | US-1.1.2 | KVK data copyable display |
| P2-105 | US-1.1.1 | eGK field mapping per KBV spec |
| P2-120 | US-1.1.1 | Cost carrier assignment from VKNR/IK |
| KP2-121 | US-1.1.6 | WOP handling + BPol blocking |
| P2-135 | US-1.1.1 | Card read date capture (FK 4109) |
| P2-136 | US-1.1.4 | Card read date update on re-read |
| P2-140 | US-1.1.3 | Cost carrier benefit obligation check |
| P2-150 | US-1.1.4 | Update FK 4109 across all active records |
| P2-166 | US-1.1.3 | Coverage validity alert |
| KP2-185 | US-1.1.5 | Card data storage with field-level control |
| KP2-190 | US-1.1.5 | Online status indicator (FK 4136) |
| KP2-191 | US-1.1.5 | VSDM timestamp validation |
| KP2-195 | US-1.1.7 | Outpatient/inpatient data separation |
