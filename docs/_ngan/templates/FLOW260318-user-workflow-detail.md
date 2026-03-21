---
Version: 1.0
Last Updated: 2026-03-18
Scope: As-built from master-screen-inventory.md (88 surfaces, state-level detail)
---

# PVS-Core User Workflow Diagrams (Detailed)

Derived from the Master Screen Inventory (88 surfaces). Unlike the roadmap-based diagram, this version includes **state transitions, decision points, and component interactions** within each surface.

---

## 1. MFA — Patient Check-In & Registration

```mermaid
flowchart TD
    START(["Patient Arrives"])
    START ==>|"Insert eGK"| CARD["S001: Card Read / Check-In Screen"]

    subgraph CardRead["Card Read States"]
        IDLE["Idle"] ==>|"Initiate read"| READING["Reading"]
        READING -->|"Valid eGK"| SUCCESS["Success"]
        READING -->|"KVK detected"| KVK_ERR["Error: KVK Rejected"]
        READING -->|"BPol + eGK exists"| BPOL_ERR["Error: BPol KVK Blocked"]
    end

    CARD ==> IDLE

    SUCCESS -->|"Coverage OK"| CARRIER{"IK Valid?"}
    SUCCESS -.->|"Coverage expired"| COVERAGE_WARN["Coverage Warning"]
    SUCCESS -.->|"Re-read same quarter"| REREAD["Re-Read Notice"]

    CARRIER ==>|"Billable"| MATCH_CHK{"Patient Match?"}
    CARRIER -->|"Carrier merged"| FUSION["Fusion Redirect"]
    CARRIER -->|"Carrier dissolved"| DISSOLVED_ERR["Error: Dissolved"]
    CARRIER -.->|"IK expired"| IK_WARN["Warning: IK Expired"]
    CARRIER -.->|"Unknown IK"| IK_UNKNOWN["Warning: Unknown IK"]

    IK_WARN -.->|"Override"| MATCH_CHK
    IK_UNKNOWN -->|"Open search"| TEMP["S003: Temporary Cost Carrier Form"]
    DISSOLVED_ERR -->|"Manual entry"| MANUAL["S005: Manual Patient Entry Form"]

    MATCH_CHK ==>|"Exact match"| MATCH["S004: Patient Match Review Panel"]
    MATCH_CHK -->|"Near match"| MATCH
    MATCH_CHK -->|"No match"| RECORD_SEL{"Record Type?"}

    MATCH -->|"Confirm update"| RECORD_SEL
    MATCH -->|"Create new"| RECORD_SEL

    subgraph RecordType["Record Type Selection"]
        RECORD_SEL ==>|"Standard"| STD["Standard Record (0101-0104)"]
        RECORD_SEL -->|"TSS case"| TSS["TSS Case"]
        RECORD_SEL -->|"Referral"| REF{"Referral Type?"}
        RECORD_SEL -.->|"Private"| PRIV["Private Insurance Notice"]
        REF -->|"Muster 6"| M6["Referral: Muster 6"]
        REF -->|"Muster 10"| M10["Referral: Muster 10 (Lab)"]
        REF -->|"Muster 39"| M39["Referral: Muster 39 (Specialty)"]
    end

    STD -->|"Patient checked in"| WAIT["S085: Waiting Room Board"]
    TSS --> WAIT
    M6 --> WAIT
    PRIV -.-> WAIT
    WAIT -->|"Patient called"| DONE(["Enter Consultation"])
```

---

## 2. MFA — Patient Check-In (Alternate Paths)

```mermaid
flowchart TD
    START(["No eGK Available"])

    START -->|"Standard entry"| MANUAL["S005: Manual Patient Entry Form"]
    START -.->|"EU patient"| EHIC["S010: EHIC Patient Entry Form"]

    subgraph ManualEntry["Manual Entry States"]
        STD_ENTRY["Standard Entry"]
        SKT_ENTRY["SKT Entry"]
        SKT_BW["SKT Bundeswehr"]
        PLZ_ERR["PLZ Validation Error"]
        STD_ENTRY -->|"Select SKT"| SKT_ENTRY
        SKT_ENTRY -.->|"VKNR 79868/79869"| SKT_BW
        STD_ENTRY -.->|"Invalid PLZ"| PLZ_ERR
    end

    MANUAL ==> STD_ENTRY
    MANUAL -->|"Search carrier"| COST["S006: Cost Carrier Search Panel"]
    COST -->|"Carrier selected"| MANUAL

    subgraph EHICFlow["EHIC States"]
        DATA_ENTRY["Data Entry"]
        DECL_PREVIEW["Declaration Preview"]
        DATA_ENTRY -->|"Complete fields"| DECL_PREVIEW
    end

    EHIC ==> DATA_ENTRY

    subgraph KIMFlow["eEB via KIM"]
        EEB_RCV["eEB Received"]
        EEB_APP["eEB Applied"]
        EEB_RCV -->|"Apply to patient"| EEB_APP
    end

    MANUAL -.->|"eEB arrives"| EEB_RCV
    EEB_APP -->|"Coverage confirmed"| DONE(["Patient Registered"])
    DECL_PREVIEW -->|"Print declaration"| DONE
    STD_ENTRY -->|"Save patient"| DONE
```

---

## 3. MFA — Insurance & Enrollment (HZV/FAV)

```mermaid
flowchart TD
    START(["Open Enrollment"])
    START ==>|"New declaration"| TE["S011: TE Form"]

    subgraph TEStates["Declaration Lifecycle"]
        CREATED["Created (Erzeugt)"]
        PRINTED["Printed (Gedruckt)"]
        SIG_HZV["Signature & TE-Code (HZV)"]
        SIG_FAV["Signature & TE-Code (FAV)"]
        SUCCESS_TE["Successful (Erfolgreich)"]
        ERROR_TE["Error (Fehlerhaft)"]

        CREATED ==>|"Print"| PRINTED
        CREATED -.->|"Missing data"| MISSING["Missing Data Warning"]
        PRINTED -->|"HZV verify"| SIG_HZV
        PRINTED -->|"FAV verify"| SIG_FAV
        SIG_HZV -->|"Transmit"| SUCCESS_TE
        SIG_FAV -->|"Transmit"| SUCCESS_TE
        SIG_HZV -->|"Transmit fails"| ERROR_TE
        ERROR_TE -->|"Retry"| SIG_HZV
    end

    TE ==> CREATED
    TE -.->|"Offline mode"| OFFLINE["Offline Hint"]
    OFFLINE -->|"Print receipt"| OFFLINE_RCPT["DIN A6 Receipt"]

    SUCCESS_TE -->|"View all"| LIST["S012: TE Overview List"]

    subgraph ListView["List Modes"]
        HZV_LIST["HZV List"]
        FAV_LIST["FAV List"]
        UNIFIED["Unified List (Q2-26+)"]
    end

    LIST ==> UNIFIED
    LIST -->|"Configure"| SETTINGS["S013: Enrollment Settings"]

    START -->|"Check participations"| PART["S014: Participation Management View"]

    subgraph PartStates["Participation States"]
        NO_PART["No Participations"]
        ACTIVE_PART["Active Participations"]
        MODULE_BLOCK["Module Contract Blocked"]
        NO_PART -->|"Activate"| ACTIVE_PART
        ACTIVE_PART -.->|"Module without main"| MODULE_BLOCK
    end

    PART ==> ACTIVE_PART
    PART -->|"Import PTV"| IMPORT["S015: PTV Import Wizard"]

    subgraph ImportSteps["Import Steps"]
        STEP1["File Selection"]
        STEP2["Pre-Import Validation"]
        STEP3["Confirmation"]
        STEP4["Importing"]
        STEP5["Protocol"]
        STEP1 ==>|"Load file"| STEP2
        STEP2 ==>|"Validate"| STEP3
        STEP3 ==>|"Confirm"| STEP4
        STEP4 ==>|"Complete"| STEP5
    end

    IMPORT ==> STEP1

    START -.->|"AOK Check 18+"| AOK["S038: AOK Check 18+ Panel"]
    AOK -->|"Transmit UHU35"| AOK_DONE["UHU35 Transmitted"]
    STEP5 -->|"Complete"| DONE(["Enrollment Updated"])
```

---

## 4. MFA — Forms & Certificates

```mermaid
flowchart TD
    START(["Generate Form"])
    START -->|"PTV form"| PTV["S020: PTV Form Print Preview"]
    START -->|"Referral form"| REF["S021: Referral Form Print Preview"]
    START -->|"Other form"| FORM["S058: Form Print Preview"]

    PTV -->|"Preview"| FORM
    REF -->|"Preview"| FORM
    FORM -.->|"Adjust settings"| SETTINGS["S059: Form Printer Settings"]
    FORM -->|"Print"| DONE(["Form Printed"])

    START -->|"Incoming letter"| INCOMING["S063: Incoming Letter Viewer"]
    INCOMING -->|"Auto-matched"| ARCHIVE["Archive to Patient Record"]
    INCOMING -.->|"Unmatched"| SEARCH["Patient Search"]
    SEARCH -->|"Match found"| ARCHIVE
    ARCHIVE -->|"Complete"| DONE
```

---

## 5. Doctor — Clinical Documentation

```mermaid
flowchart TD
    START(["Open Patient"])
    START ==>|"Select patient"| RECORD["S002: Patient Record View"]

    subgraph DiagnosisEntry["Diagnosis Entry Flow"]
        ICD_INPUT["ICD Code Entry"]
        ICD_SEARCH["Search Results"]
        DIAG_SICHER["Diagnosensicherheit Selection"]
        DIAG_ADDED["Diagnosis Added"]

        ICD_INPUT ==>|"Type code/term"| ICD_SEARCH
        ICD_SEARCH ==>|"Select code"| DIAG_SICHER
        DIAG_SICHER ==>|"Confirm V/G/A/Z"| DIAG_ADDED
    end

    RECORD ==>|"Enter diagnosis"| ICD_INPUT

    subgraph Validation["Diagnosis Validation"]
        VALID_OK["Code Accepted"]
        VALID_REJECT{"Rejection?"}
        VALID_WARN{"Warning?"}
        VALID_REJECT -->|"Non-existent"| REJECT_MSG["Error: Code Invalid"]
        VALID_REJECT -->|"Non-billable"| REJECT_MSG
        VALID_REJECT -->|"Unpaired secondary"| REJECT_MSG
        VALID_WARN -.->|"Gender mismatch"| WARN_MSG["Warning: Plausibility"]
        VALID_WARN -.->|"Age mismatch"| WARN_MSG
        VALID_WARN -.->|"IfSG reporting"| INFO_MSG["Info: Reporting Obligation"]
    end

    DIAG_ADDED --> VALID_REJECT
    DIAG_ADDED --> VALID_WARN
    DIAG_ADDED --> VALID_OK

    subgraph Adoption["Dauerdiagnosen Adoption"]
        ADOPT_CLICK["Adopt from Sidebar"]
        DIGIT_CHECK{"Needs 4th/5th Digit?"}
        ADOPT_CONFIRM["Adoption Confirmed"]
        ADOPT_CLICK --> DIGIT_CHECK
        DIGIT_CHECK -->|"Yes"| DIGIT_PROMPT["Digit Completion Prompt"]
        DIGIT_CHECK -->|"No"| ADOPT_CONFIRM
        DIGIT_PROMPT --> ADOPT_CONFIRM
    end

    RECORD -->|"Adopt chronic diagnosis"| ADOPT_CLICK

    RECORD -->|"Write note"| NOTE["S086: Clinical Note Editor"]
    RECORD -->|"Compose letter"| LETTER["S061: Doctor Letter Composer"]
    RECORD -.->|"Review device data"| GDT["S087: GDT Device Data Review"]
    RECORD -->|"Open KIM inbox"| KIM["S007: KIM Inbox"]
    RECORD -->|"Track quantities"| QTY["S048: Quantity Tracking Panel"]
    RECORD -.->|"Lookup codes"| CODING["S018: Coding Instructions Browser"]
    RECORD -.->|"Check rule violations"| RULES["S019: Rule Violation Overview"]
```

---

## 6. Doctor — Service & Billing Documentation

```mermaid
flowchart TD
    START(["Open Billing Record"])
    START ==>|"Select Schein"| SCHEIN["S008: Schein / Billing Record View"]

    subgraph ServiceEntry["Service Documentation"]
        GNR_INPUT["GNR Input"]
        FEE_CHECK{"Fee Rule\nViolation?"}
        GNR_ADDED["GNR Entry Row"]
        GNR_INPUT ==>|"Enter GNR"| FEE_CHECK
        FEE_CHECK ==>|"No violation"| GNR_ADDED
        FEE_CHECK -->|"Exclusion/limit"| FEE_WARN["Fee Rule Indicator"]
        FEE_WARN -.->|"Override"| GNR_ADDED
    end

    SCHEIN ==> GNR_INPUT

    subgraph SpecialCases["Special Service Types"]
        VISIT["Visit Justification Fields"]
        GENE["Genetic Testing Fields"]
        OPS["OPS Code Input"]
        CHAIN["Service Chain Selector"]
    end

    GNR_ADDED -.->|"Visit GNR"| VISIT
    GNR_ADDED -.->|"Genetic GNR"| GENE
    GNR_ADDED -.->|"OPS required"| OPS
    SCHEIN -->|"Select chain"| CHAIN
    CHAIN -->|"Confirm each GNR"| GNR_ADDED

    SCHEIN -->|"Day boundary"| TAGTRENNUNG["Tagtrennung Action"]
    SCHEIN -->|"Quarter end"| QUARTER["S009: Quarter Transition Dashboard"]
    SCHEIN -->|"Terminate therapy"| TERM["S022: Termination Notice Manager"]
    SCHEIN -->|"Nursing flat-rate"| NURSING["S024: Nursing Home Flat-Rate Panel"]
    SCHEIN -.->|"Lab check"| LAB["S028: Lab Proficiency Gate"]
    SCHEIN -.->|"KV/HZV conflict"| CONFLICT["S036: KV / HZV Conflict Review Panel"]

    subgraph HZVContext["HZV/FAV Context"]
        EBM_WARN["EBM-on-HZV Warning"]
        PART_BLOCK["Participation Required Block"]
        FAV_CHECK["FAV Online Check"]
        CONTACT_WARN["Contact Warning (0000)"]
    end

    SCHEIN -.->|"EBM in HZV"| EBM_WARN
    SCHEIN -.->|"No participation"| PART_BLOCK
    SCHEIN -.->|"FAV service"| FAV_CHECK
    SCHEIN -.->|"No 0000 code"| CONTACT_WARN
```

---

## 7. Doctor — Prescriptions (E-Rezept)

```mermaid
flowchart TD
    START(["Prescribe Medication"])
    START ==>|"New Rx"| BUILDER["S039: Prescription Builder"]

    subgraph RxTypes["Medication Types"]
        PZN["PZN Mode"]
        INGR["Ingredient Mode"]
        COMP["Compounding Mode"]
        FREE["FreeText Mode"]
    end

    BUILDER ==> PZN

    BUILDER -->|"Search drug"| SEARCH["S043: Drug Search Panel"]

    subgraph DrugSafety["Drug Safety Checks"]
        INTERACT{"Interaction?"}
        INTERACT -->|"Minor"| MINOR_ALERT["Minor Interaction"]
        INTERACT ==>|"Severe"| SEVERE_ALERT["S044: Interaction Alert Dialog"]
        INTERACT -.->|"None"| SAFE["No Interactions"]
    end

    SEARCH -->|"Drug selected"| INTERACT
    SEARCH -.->|"Calculate dose"| DOSAGE["S045: Dosage Calculator Panel"]
    SEARCH -.->|"Safety warning"| RED["S046: Red Hand Letter Alert"]
    SAFE ==> BUILDER

    subgraph Signing["Signing & Submission"]
        COMFORT["Comfort Signature Active"]
        SIGNING["Signing in Progress"]
        SUBMIT_OK["Submission Success"]
        SUBMIT_ERR["Submission Error"]
        COMFORT ==>|"Batch sign"| SIGNING
        SIGNING ==>|"Success"| SUBMIT_OK
        SIGNING -->|"Failure"| SUBMIT_ERR
    end

    BUILDER ==>|"Add to queue"| QUEUE["S040: Prescription Queue"]
    QUEUE ==>|"Activate comfort sig"| COMFORT
    SUBMIT_OK -->|"View status"| STATUS["S042: Prescription Status View"]
    SUBMIT_OK -->|"Print copy"| COPY["S041: Patient Copy Preview"]

    subgraph Lifecycle["Rx Lifecycle"]
        DISPENSED["Dispensed"]
        CANCELLED["Cancelled"]
    end

    STATUS -->|"Pharmacy dispenses"| DISPENSED
    STATUS -.->|"Cancel"| CANCELLED

    BUILDER -.->|"Enable MVO"| MVO["MVO Configuration"]
```

---

## 8. Doctor — Prescriptions (Specialty)

```mermaid
flowchart TD
    subgraph Heilmittel["S047: Heilmittel Prescription"]
        HM_TYPE["Therapy Type Selection"]
        HM_STD["Standard Prescription"]
        HM_LHM["LHM (Long-Term)"]
        HM_BVB["BVB (Special Need)"]
        HM_LIMIT{"Within Limits?"}

        HM_TYPE ==>|"Select type"| HM_STD
        HM_TYPE -->|"Enable LHM"| HM_LHM
        HM_TYPE -->|"Enable BVB"| HM_BVB
        HM_STD --> HM_LIMIT
        HM_LIMIT ==>|"Yes"| HM_OK(["Prescribed"])
        HM_LIMIT -->|"Approaching"| HM_WARN["Approaching Limit"]
        HM_LIMIT -->|"Exceeded"| HM_EXCEED["Limit Exceeded"]
    end

    HM_STD -->|"Track quantities"| QTY["S048: Quantity Tracking Panel"]

    subgraph Hilfsmittel["S049: Hilfsmittel Prescription"]
        HF_FORM{"Form Type?"}
        HF_FORM -->|"Standard"| M8["Muster 8"]
        HF_FORM -->|"Specific"| M8A["Muster 8A"]
        HF_FORM -->|"Hearing aid"| M15["Muster 15"]
        HF_FORM -->|"Special approval"| M16["Muster 16"]
        M8 -->|"Select aid"| HF_SEARCH["S050: Hilfsmittelverzeichnis Search"]
    end

    subgraph DiGA["S051: DiGA Prescription"]
        DIGA_SEARCH["DiGA Search"]
        DIGA_SEL["DiGA Selected"]
        DIGA_MATCH{"Indication\nMatch?"}
        DIGA_SUBMIT["eVDGA Signed & Submitted"]

        DIGA_SEARCH ==>|"Select DiGA"| DIGA_SEL
        DIGA_SEL --> DIGA_MATCH
        DIGA_MATCH ==>|"Yes"| DIGA_SUBMIT
        DIGA_MATCH -->|"No"| DIGA_MISMATCH["Indication Mismatch"]
    end

    DIGA_SEARCH -->|"Browse catalog"| DIGA_DIR["S052: DiGA Directory Browser"]

    subgraph MedPlan["S053: Medication Plan Editor"]
        MP_EMPTY["Empty Plan"]
        MP_ACTIVE["Active Plan"]
        MP_EDIT["Edit Mode"]
        MP_IMPORT["Import Preview"]
        MP_EMPTY -->|"Add medication"| MP_ACTIVE
        MP_ACTIVE -->|"Edit entry"| MP_EDIT
        MP_ACTIVE -->|"Scan barcode"| MP_IMPORT
        MP_IMPORT -.->|"Version mismatch"| MP_MISMATCH["Version Mismatch"]
    end

    MP_ACTIVE -->|"Print"| BMP_PRINT["S054: BMP Print Preview"]
    MP_IMPORT -->|"Import from scan"| BMP_IMPORT["S055: BMP Import Dialog"]
```

---

## 9. Doctor — Forms & Certificates

```mermaid
flowchart TD
    START(["Issue Certificate"])

    subgraph eAU["S057: eAU Form"]
        EAU_CREATE["Create eAU"]
        EAU_SIGN["Sign eAU"]
        EAU_TRANSMIT["Transmit"]
    end

    START ==>|"Create eAU"| EAU_CREATE
    EAU_CREATE ==>|"Sign"| EAU_SIGN
    EAU_SIGN ==>|"Send"| EAU_TRANSMIT

    EAU_TRANSMIT -->|"View status"| EAU_STATUS["S060: eAU Transmission Status"]
    EAU_TRANSMIT -->|"Print copies"| EAU_PRINT["S059: eAU Print Preview"]

    subgraph LetterFlow["Doctor Letter"]
        COMPOSE["S061: Composing"]
        RECIPIENT["Recipient Selected"]
        ATTACH["Attachments Added"]
        READY["Ready to Sign"]
        DELIVERED["Delivered"]
        FAILED["Failed"]

        COMPOSE ==>|"Select recipient"| RECIPIENT
        RECIPIENT -->|"Add attachments"| ATTACH
        ATTACH ==>|"Complete sections"| READY
        READY ==>|"Send via KIM"| DELIVERED
        READY -->|"Send fails"| FAILED
    end

    START -->|"Compose letter"| COMPOSE
    DELIVERED -->|"View status"| LETTER_STATUS["S064: Letter Transmission Status"]
    DELIVERED -->|"Complete"| DONE(["Certificate Issued"])
```

---

## 10. Doctor — Chronic Care Programs

```mermaid
flowchart TD
    START(["Open Chronic Care"])
    START ==>|"Select patient"| OVERVIEW["S068: eDMP Patient Overview"]
    OVERVIEW ==>|"Document visit"| DOC["S067: eDMP Documentation Form"]
    DOC -.->|"Use scoring"| SCORE["S070: Scoring Calculator Panel"]
    DOC ==>|"Validate"| VALID["S069: eDMP Validation Results"]

    VALID -->|"All valid"| SUBMIT["S072: eDMP / eDoc Submission Dashboard"]
    VALID -->|"Errors found"| FIX["Fix Documentation"]
    FIX --> DOC

    START -->|"eHKS screening"| EHKS["S071: eHKS Documentation Form"]
    EHKS -->|"Submit"| SUBMIT
    SUBMIT -->|"View audit"| AUDIT["S073: Audit Trail Viewer"]
    SUBMIT -->|"Complete"| DONE(["Submission Confirmed"])
```

---

## 11. Doctor — Billing & Submission

```mermaid
flowchart TD
    START(["Open Billing"])
    START ==>|"KV billing"| KV["S025: Billing Dashboard (KV Mode)"]
    START -->|"HZV/FAV billing"| HZV["S030: Billing Dashboard (HZV/FAV Mode)"]
    START -.->|"ASV billing"| ASV["S027: Billing Dashboard (ASV Mode)"]
    START -.->|"Configure ASV team"| ASV_CFG["S026: ASV Team Configuration"]

    HZV ==>|"Run validation"| VALID["S031: Billing Validation Results Panel"]
    VALID ==>|"Submit"| SUB["S032: HZV/FAV Submission Panel"]
    SUB ==>|"View protocol"| PROTO["S033: Transmission Protocol View"]
    PROTO -.->|"Medi contract edit"| POST["S034: Post-Submission Editor"]
    KV -->|"Print receipt"| RECEIPT["S035: Patient Receipt Preview"]

    KV -.->|"Check conflicts"| CONFLICT["S036: KV/HZV Conflict Review Panel"]
    KV -.->|"Lab gate"| LAB["S028: Lab Proficiency Gate"]

    SUB ==>|"Complete"| DONE(["Billing Submitted"])
```

---

## 12. Doctor — ePA & Document Exchange

```mermaid
flowchart TD
    START(["Open ePA"])
    START ==>|"Browse documents"| BROWSER["S074: ePA Document Browser"]
    BROWSER -->|"Manage access"| ENTITLE["S075: ePA Entitlement Manager"]
    BROWSER -->|"Upload"| UPLOAD["S076: Document Upload Dialog"]
    UPLOAD -->|"Complete"| DONE(["Document Exchanged"])
```

---

## 13. Admin — Practice Administration

```mermaid
flowchart TD
    START(["Open Admin"])
    START ==> STATUS["S077: System Status Bar"]
    STATUS ==>|"Open settings"| ADMIN["S078: Practice Administration Panel"]
    ADMIN -->|"Manage users"| USERS["S079: User & Rights Management Panel"]
    ADMIN -.->|"MVZ overview"| MVZ["S088: MVZ Dashboard"]
    ADMIN -->|"Manage master data"| MASTER["S080: Master Data Management Panel"]

    subgraph MasterData["Master Data States"]
        ALL_CURRENT["All Current"]
        UPDATE_AVAIL["Update Available"]
        IMPORTING["Import in Progress"]
        ALL_CURRENT -->|"New quarter"| UPDATE_AVAIL
        UPDATE_AVAIL -->|"Import"| IMPORTING
        IMPORTING -->|"Complete"| ALL_CURRENT
    end

    MASTER ==> ALL_CURRENT
    ADMIN -->|"Browse fees"| FEE["S081: Fee Schedule Browser"]
```

---

## 14. Admin — System Infrastructure

```mermaid
flowchart TD
    subgraph TI["TI & Modules"]
        CONN["S082: TI Connector Status Panel"]
        MOD["S083: Module Management Panel"]
        COMPLY["S084: System Compliance Settings"]
        CONN -->|"Manage modules"| MOD
        MOD -->|"Configure compliance"| COMPLY
    end

    subgraph Contracts["Contract Management"]
        HZV_MGMT["S085: HZV/FAV Contract Management Panel"]
        PHYS["S086: Physician Identity Management Panel"]
        DOCS["S087: Contract Documents Viewer"]
        HZV_MGMT -->|"Manage physicians"| PHYS
        HZV_MGMT -->|"View documents"| DOCS
    end

    subgraph Coding["Coding & Rules"]
        CODING_RULES["S080: Coding Rule Settings"]
        MULTI["S081: Multimorbidity Surcharge Patient List"]
        CODING_RULES -->|"Review patients"| MULTI
    end
```

---

## 15. Admin — Data Import & Sync

```mermaid
flowchart TD
    START(["Run Import"])
    START ==>|"View protocol"| IMPORT["S037: Import Protocol View"]

    subgraph ImportStates["Import States"]
        FILE_SEL["File Selection"]
        VALIDATING["Validating"]
        COMPLETE["Import Complete"]
        CONFLICTS["Conflicts Found"]
        FILE_SEL ==>|"Load"| VALIDATING
        VALIDATING ==>|"Success"| COMPLETE
        VALIDATING -->|"Conflicts"| CONFLICTS
        CONFLICTS -->|"Resolve"| COMPLETE
    end

    IMPORT ==> FILE_SEL
    IMPORT -->|"Manage codes"| ICODE["S038: ICode Management View"]
    COMPLETE -->|"Complete"| DONE(["Import Synced"])
```
