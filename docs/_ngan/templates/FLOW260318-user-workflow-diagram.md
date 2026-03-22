---
Version: 1.1
Last Updated: 2026-03-18
Scope: As-built from design-roadmap.md (88 surfaces)
---

# PVS-Core User Workflow Diagrams

Derived from the Design Roadmap (88 surfaces). Organized by **role** and **workflow**, showing how screens connect in each user journey.

---

## 1. MFA — Patient Check-In & Registration

```mermaid
flowchart TD
    START(["Patient Arrives"])
    START ==>|"Insert eGK"| CARD["Card Read / Check-In Screen"]
    CARD -->|"Match found"| MATCH["Patient Match Review Panel"]
    CARD -->|"No eGK available"| MANUAL["Manual Patient Entry Form"]
    CARD -.->|"EU patient"| EHIC["EHIC Patient Entry Form"]
    CARD -->|"Insurance invalid"| TEMP["Temporary Cost Carrier Form"]
    TEMP -->|"Search carrier"| COST["Cost Carrier Search Panel"]
    MATCH -->|"Confirm patient"| WAIT["Waiting Room Board"]
    MANUAL -->|"Save patient"| WAIT
    EHIC -.->|"Save patient"| WAIT
    COST -->|"Assign carrier"| WAIT
    WAIT -->|"Patient called"| DONE(["Enter Consultation"])
```

---

## 2. MFA — Insurance & Enrollment (HZV/FAV)

```mermaid
flowchart TD
    START(["Open Enrollment"])
    START ==>|"New enrollment"| TE["TE Form (Enrollment Declaration)"]
    TE -->|"Submit"| LIST["TE Overview List"]
    LIST -->|"Review entries"| MGMT["Participation Management View"]
    LIST -.->|"Configure"| SETTINGS["Enrollment Settings"]
    MGMT -->|"Import PTV data"| IMPORT["PTV Import Wizard"]
    TE -.->|"Check eligibility"| AOK["AOK Check 18+ Panel"]
    IMPORT -->|"Complete"| DONE(["Enrollment Updated"])
```

---

## 3. MFA — Forms & Certificates

```mermaid
flowchart TD
    START(["Generate Form"])
    PTV["PTV Form Print Preview"] -->|"Print"| PRINT["Form Print Preview"]
    REF["Referral Form Print Preview"] -->|"Print"| PRINT
    START -->|"Select PTV"| PTV
    START -->|"Select Referral"| REF
    PRINT -.->|"Adjust settings"| SETTINGS["Form Printer Settings"]
    PRINT -->|"Confirm print"| DONE(["Form Printed"])
```

---

## 4. Doctor — Clinical Documentation

```mermaid
flowchart TD
    START(["Open Patient"])
    START ==>|"Select patient"| RECORD["Patient Record View"]

    subgraph Documentation["Documentation"]
        NOTE["Clinical Note Editor"]
        LETTER["Doctor Letter Composer"]
        GDT["GDT Device Data Review"]
    end

    subgraph References["Reference Tools"]
        CODING["Coding Instructions Browser"]
        RULES["Rule Violation Overview"]
        PNSD["pnSD Configuration Dialog"]
    end

    RECORD ==>|"Write note"| NOTE
    RECORD -->|"Compose letter"| LETTER
    RECORD -.->|"Review device data"| GDT
    RECORD -->|"Open inbox"| KIM["KIM Inbox"]
    RECORD -->|"Track quantities"| QTY["Quantity Tracking Panel"]
    RECORD -.->|"Lookup codes"| CODING
    RECORD -.->|"Check rules"| RULES
    RECORD -.->|"Configure pnSD"| PNSD
    NOTE -->|"Save"| DONE(["Documentation Saved"])
```

---

## 5. Doctor — Service & Billing Documentation

```mermaid
flowchart TD
    START(["Open Schein"])
    START ==>|"Select Schein"| SCHEIN["Schein / Billing Record View"]
    SCHEIN -->|"Quarter end"| QUARTER["Quarter Transition Dashboard"]
    SCHEIN -->|"Terminate service"| TERM["Termination Notice Manager"]
    SCHEIN -->|"Nursing flat-rate"| NURSING["Nursing Home Flat-Rate Documentation Panel"]
    SCHEIN -.->|"Lab check"| LAB["Lab Proficiency Gate"]
    SCHEIN -.->|"Resolve conflict"| CONFLICT["KV / HZV Conflict Review Panel"]
    QUARTER -->|"Submit"| DONE(["Quarter Closed"])
```

---

## 6. Doctor — Prescriptions (Core)

```mermaid
flowchart TD
    START(["Prescribe Medication"])
    START ==>|"New Rx"| BUILDER["Prescription Builder"]
    BUILDER -->|"Search drug"| SEARCH["Drug Search Panel"]
    SEARCH -->|"Drug selected"| BUILDER
    SEARCH -.->|"Interaction found"| ALERT["Interaction Alert Dialog"]
    SEARCH -.->|"Calculate dose"| DOSAGE["Dosage Calculator Panel"]
    SEARCH -.->|"Safety warning"| RED["Red Hand Letter Alert"]
    BUILDER ==>|"Confirm Rx"| QUEUE["Prescription Queue"]
    QUEUE -->|"View status"| STATUS["Prescription Status View"]
    QUEUE -->|"Print copy"| COPY["Patient Copy Preview"]
    STATUS -->|"Complete"| DONE(["Prescription Issued"])
```

---

## 7. Doctor — Prescriptions (Specialty)

```mermaid
flowchart TD
    subgraph DiGA["DiGA"]
        DIGA_BUILD["DiGA Prescription Builder"]
        DIGA_DIR["DiGA Directory Browser"]
        DIGA_BUILD -->|"Browse apps"| DIGA_DIR
        DIGA_DIR -->|"Select app"| DIGA_BUILD
    end

    subgraph Heilmittel["Heilmittel / Hilfsmittel"]
        HEIL["Heilmittel Prescription Form"]
        HILF["Hilfsmittel Prescription Form"]
        HILF_SEARCH["Hilfsmittelverzeichnis Search"]
        HILF -->|"Search catalog"| HILF_SEARCH
    end

    subgraph MedPlan["Medication Plan"]
        MED["Medication Plan Editor"]
        BMP_PRINT["BMP Print Preview"]
        BMP_IMPORT["BMP Import Dialog"]
        MED -->|"Print BMP"| BMP_PRINT
        MED -->|"Import BMP"| BMP_IMPORT
    end
```

---

## 8. Doctor — Forms & Certificates

```mermaid
flowchart TD
    START(["Issue Certificate"])
    START ==>|"Create eAU"| EAU["eAU Form"]
    EAU -->|"Transmit"| EAU_STATUS["eAU Transmission Status"]
    EAU -->|"Print copies"| EAU_PRINT["eAU Print Preview (Patient / Employer)"]
    START -->|"Compose letter"| LETTER["Doctor Letter Composer"]
    LETTER -->|"Send"| LETTER_STATUS["Letter Transmission Status"]
    EAU_STATUS -->|"Complete"| DONE(["Certificate Issued"])
```

---

## 9. Doctor — Chronic Care Programs

```mermaid
flowchart TD
    START(["Open Chronic Care"])
    START ==>|"Select eDMP patient"| OVERVIEW["eDMP Patient Overview"]
    OVERVIEW ==>|"Document visit"| DOC["eDMP Documentation Form"]
    DOC -.->|"Use scoring"| SCORE["Scoring Calculator Panel"]
    DOC -->|"Validate"| VALID["eDMP Validation Results"]
    VALID -->|"Submit"| SUBMIT["eDMP / eDoc Submission Dashboard"]
    START -->|"eHKS screening"| EHKS["eHKS Documentation Form"]
    EHKS -->|"Submit"| SUBMIT
    SUBMIT -->|"Audit"| AUDIT["Audit Trail Viewer"]
    SUBMIT -->|"Complete"| DONE(["Submission Confirmed"])
```

---

## 10. Doctor — Billing & Submission

```mermaid
flowchart TD
    START(["Open Billing"])
    START ==>|"KV billing"| KV["Billing Dashboard (KV Mode)"]
    START -->|"HZV/FAV billing"| HZV["Billing Dashboard (HZV/FAV Mode)"]
    START -.->|"ASV billing"| ASV["Billing Dashboard (ASV Mode)"]
    HZV -->|"Run validation"| VALID["Billing Validation Results Panel"]
    VALID ==>|"Submit"| SUB["HZV/FAV Submission Panel"]
    SUB -->|"View protocol"| PROTO["Transmission Protocol View"]
    PROTO -.->|"Medi edit"| POST["Post-Submission Editor (Medi)"]
    KV -->|"Print receipt"| RECEIPT["Patient Receipt Preview"]
    SUB -->|"Complete"| DONE(["Billing Submitted"])
```

---

## 11. Doctor — ePA & Document Exchange

```mermaid
flowchart TD
    START(["Open ePA"])
    START ==>|"Browse documents"| BROWSER["ePA Document Browser"]
    BROWSER -->|"Manage access"| ENTITLE["ePA Entitlement Manager"]
    BROWSER -->|"Upload document"| UPLOAD["Document Upload Dialog"]
    UPLOAD -->|"Complete"| DONE(["Document Exchanged"])
```

---

## 12. Admin — Practice Administration

```mermaid
flowchart TD
    START(["Open Admin"])
    STATUS["System Status Bar"] ==>|"Open settings"| ADMIN["Practice Administration Panel"]
    ADMIN -->|"Manage users"| USERS["User & Rights Management Panel"]
    ADMIN -.->|"MVZ overview"| MVZ["MVZ Dashboard"]
    ADMIN -->|"Manage data"| MASTER["Master Data Management Panel"]
    ADMIN -->|"Fee schedules"| FEE["Fee Schedule Browser"]
    START ==> STATUS
```

---

## 13. Admin — System Infrastructure

```mermaid
flowchart TD
    subgraph TI["TI & Modules"]
        CONN["TI Connector Status Panel"]
        MOD["Module Management Panel"]
        COMPLY["System Compliance Settings"]
        CONN -->|"Manage modules"| MOD
        MOD -->|"Configure compliance"| COMPLY
    end

    subgraph Contracts["Contract Management"]
        HZV_MGMT["HZV/FAV Contract Management Panel"]
        PHYS["Physician Identity Management Panel"]
        DOCS["Contract Documents Viewer"]
        HZV_MGMT -->|"Manage physicians"| PHYS
        HZV_MGMT -->|"View documents"| DOCS
    end

    subgraph Coding["Coding & Rules"]
        CODING_RULES["Coding Rule Settings"]
        MULTI["Multimorbidity Surcharge Patient List"]
        CODING_RULES -->|"Review patients"| MULTI
    end
```

---

## 14. Admin — Data Import & Sync

```mermaid
flowchart TD
    START(["Run Import"])
    START ==>|"View protocol"| IMPORT["Import Protocol View"]
    IMPORT -->|"Manage codes"| ICODE["ICode Management View"]
    ICODE -->|"Complete"| DONE(["Import Synced"])
```

---

## 15. Cross-Tier Dependency Chain

This section captures **design dependencies** so we can sequence design work to minimize rework.

### 15A. Screen-level foundation chain (as-is)

These foundation surfaces cascade layout to all dependent screens.

```mermaid
flowchart TD
    CARD["Card Read / Check-In Screen"] ==>|"feeds into"| PATIENT["Patient Record View"]
    CARD -->|"feeds into"| TEMP["Temporary Cost Carrier Form"]
    PATIENT ==>|"feeds into"| SCHEIN["Schein / Billing Record View"]
    TEMP -.->|"extends to Phase 1.4"| TEMP_EXT(["Cost Carrier Search Panel"])
    CARD -.->|"extends to Phases 1.2, 1.3, 1.5"| CARD_EXT(["Check-In Extensions"])
    PATIENT -.->|"extends to Phases 1.5, 1.8, 2A.1-2A.6"| PAT_EXT(["Clinical Extensions"])
    SCHEIN -.->|"extends to Phases 2A.6, 2B.1-2B.8"| SCH_EXT(["Billing Extensions"])
```

### 15B. Workflow-level dependency chain (proposed)

Workflows above are not independent. They share **contexts** (patient, billing case/Schein, contracts, master data, permissions) that create design coupling.

```mermaid
flowchart LR
    WF12["WF-12 Admin: Practice Administration\n(System Status Bar, users/rights, settings shell)"] -->|"permissions + navigation shell"| WF1["WF-1 MFA: Check-In & Registration"]
    WF12 -->|"permissions + navigation shell"| WF4["WF-4 Doctor: Clinical Documentation\n(Patient Record View)"]
    WF12 -->|"permissions + navigation shell"| WF5["WF-5 Doctor: Service & Billing Documentation\n(Schein / Billing Record View)"]
    WF12 -->|"permissions + navigation shell"| WF10["WF-10 Doctor: Billing & Submission\n(Billing Dashboard KV/HZV/ASV)"]

    WF1 -->|"identified/created patient context"| WF4
    WF1 -->|"optional patient context"| WF3["WF-3 MFA: Forms & Certificates"]
    WF4 -->|"patient context"| WF6["WF-6 Doctor: Prescriptions (Core)"]
    WF6 -->|"extends prescribing variants"| WF7["WF-7 Doctor: Prescriptions (Specialty)"]
    WF4 -->|"patient context"| WF8["WF-8 Doctor: Forms & Certificates"]
    WF4 -->|"patient context"| WF9["WF-9 Doctor: Chronic Care Programs"]
    WF4 -->|"patient context"| WF11["WF-11 Doctor: ePA & Document Exchange"]

    WF4 -->|"creates/anchors billing case context"| WF5
    WF5 -->|"provides Schein + quarter context"| WF10
    WF2["WF-2 MFA: Insurance & Enrollment (HZV/FAV)"] -->|"contract enrollment context"| WF10

    WF14["WF-14 Admin: Data Import & Sync\n(ICode, catalogs, rule/master data)"] -.->|"enables lookups + validation"| WF6
    WF14 -.->|"enables billing catalogs + validations"| WF10
    WF14 -.->|"enables program forms + submissions"| WF9
```

#### Dependency summary (workflow → depends on)

| Workflow | Depends on (design context) | Why it matters for design |
|---|---|---|
| **WF-12 Practice Administration** | — | Defines the **global shell** (status bar, settings entry points) and **RBAC** surfaces everything else lives under |
| **WF-1 Check-In & Registration** | WF-12 | Needs global shell + permissions; creates the **patient context** that feeds downstream clinical work |
| **WF-4 Clinical Documentation** | WF-12, (often WF-1) | Patient Record is a **hub surface**; many later screens are panels/dialogs launched from it |
| **WF-5 Service & Billing Documentation** | WF-12, WF-4 | Schein view depends on patient hub context and becomes the anchor for billing lifecycle |
| **WF-10 Billing & Submission** | WF-12, WF-5, (partly WF-2), WF-14 | Billing dashboard UI depends on Schein/quarter context and needs validations + catalogs |
| **WF-6 Prescriptions (Core)** | WF-12, WF-4, WF-14 | Needs patient hub context + drug/coding master data for search and safety dialogs |
| **WF-7 Prescriptions (Specialty)** | WF-6 | Reuses the prescribing workspace patterns; adds specialty variants |
| **WF-3 MFA Forms & Certificates** | WF-12, (often WF-1) | Printing flows can be designed early, but feel “real” once patient identity is in place |
| **WF-8 Doctor Forms & Certificates** | WF-12, WF-4 | Certificates/letters are launched from patient context; transmission status patterns should be consistent |
| **WF-9 Chronic Care Programs** | WF-12, WF-4, WF-14 | Program-specific forms + submissions depend on patient hub and structured master data |
| **WF-11 ePA & Document Exchange** | WF-12, WF-4 | Access/entitlement UI must live in the same patient context patterns |
| **WF-2 Insurance & Enrollment (HZV/FAV)** | WF-12, WF-4 | Enrollment is often a patient-specific workflow; affects billing mode/eligibility surfaces |
| **WF-14 Data Import & Sync** | WF-12 | Admin-only shell; enables catalogs and validation UIs used across clinical/billing |
| **WF-13 System Infrastructure** | WF-12 | Mostly admin-only; can be designed in parallel unless TI/module UI is a prerequisite for ePA/KIM |

### 15C. Proposed workflow-based design roadmap (dependency-minimizing)

This is a **workflow-first** sequencing that aligns with the design-roadmap “Tier 1 → Tier 5” intent, but expressed as workflow milestones.

1. **Global shells & access (WF-12)** — establish status bar, settings entry points, and user/rights patterns early so other workflows don’t re-invent layout/affordances.
2. **Patient identity → patient hub (WF-1 → WF-4)** — design the check-in flows *and* Patient Record as a coupled pair (they share patient identity patterns, search/match patterns, and “context handoff” states).
3. **Billing case anchor (WF-5)** — design Schein / Billing Record View next so downstream billing dashboards have a stable “case + quarter” object to reference.
4. **Billing dashboard shell, then deep submission (WF-10)** — design the KV dashboard shell early, but defer HZV/FAV submission + protocol + post-submit editing until WF-5 (Schein) patterns are locked.
5. **Prescribing core, then specialty variants (WF-6 → WF-7)** — lock the base prescribing workspace patterns before adding DiGA/Heilmittel/Hilfsmittel/MedPlan branches.
6. **Certificates/printing (WF-3 + WF-8)** — reuse print-preview + transmission-status layout primitives across MFA and Doctor.
7. **Chronic programs (WF-9)** — build on validated, consistent “form → validate → submit → audit” patterns established by earlier flows.
8. **Document exchange (WF-11)** — design once patient hub and permissions are stable.
9. **Enrollment + infra/admin deep-dive (WF-2, WF-14, WF-13)** — schedule in parallel or later unless contract/TI requirements are explicitly gating the earlier MVP.
