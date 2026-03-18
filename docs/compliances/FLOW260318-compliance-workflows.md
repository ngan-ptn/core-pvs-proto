---
Version: 1.1
Last Updated: 2026-03-18
Scope: As-built from compliance-inventory.md (604 obligations)
---

# PVS-Core Compliance Workflow Diagrams

Derived from the PM Compliance Inventory (604 items across AKA, KBV, KVDT, ICD-10-GM, gematik, and crucial workflows). Each diagram shows **where KV and non-KV (HZV/FAV) paths diverge**.

**Convention:** Nodes marked `[KV]` apply to KV/statutory billing only. Nodes marked `[HZV/FAV]` apply to selective contracts only. Unmarked nodes apply to both paths.

---

## Workflow Diagram Index

| # | Workflow | Inventory Source | Items (est.) | Status |
|---|---|---|---|---|
| 1 | Patient Check-In — Compliance Gates | PSDV, VERT, KVDT §2–§4 | ~64 | Done |
| 2 | Contract Participation Management — HZV/FAV Only | VERT (43 items) | ~43 | Diagrammed |
| 3 | Patient Enrollment — HZV/FAV Only | VERE (25 items) | ~25 | Diagrammed |
| 4 | Billing Documentation — KV vs HZV/FAV Divergence | ABRD (46 items) | ~46 | Diagrammed |
| 5 | Billing Submission Process | ABRG (45 items) | ~45 | Diagrammed |
| 6 | Diagnosis Entry & ICD-10-GM Validation | ICD-10-GM (57 items) | ~57 | Diagrammed |
| 7 | Service Documentation — EBM / KVDT Compliance | KBV EBM (14 items), KVDT-SD | ~14 | Diagrammed |
| 8 | Prescription & Drug Safety | Crucial Workflows 3.19, VSST medication | ~54 | Diagrammed |
| 9 | Form Management — KV vs HZV/FAV Forms | FORM (~25 items) | ~25 | Diagrammed |
| 10 | Hilfsmittel Prescribing | VSST623–633 | ~12 | Diagrammed |
| 11 | eDMP & Chronic Care Compliance | Crucial Workflows 3.21 (12 items) | ~12 | Diagrammed |
| 12 | eAU, eArztbrief & ePA | Crucial Workflows 3.20 (20 items) | ~20 | Diagrammed |
| 13 | IT Connectivity & Infrastructure | gematik TI/KIM, ITVE | ~40 | Diagrammed |
| 14 | Compliance Obligation Summary by Path | All sections | 604 | Diagrammed |
| — | TSS Appointment Case Management | KVDT §2–§4 (KP2-502–514) | ~14 | Planned |
| — | Patient Master Data Lifecycle | KVDT §2–§4 (P2-400–470) | ~15 | Planned |
| — | Quarter Transition & Case Carry-Forward | KVDT §2–§4 (P2-520–540) | ~5 | Planned |
| — | General Compliance (ALLG) | ALLG (28 items) | ~28 | Planned |
| — | Billing Infrastructure — KVDT File & Practice Setup | KVDT §1/§5 | ~30 | Planned |
| — | GOÄ Private Billing Validation | GOÄ (1 item) | ~1 | Planned |

> **Status key:** `Done` = diagram + gaps report complete. `Diagrammed` = workflow diagram exists, gaps report pending. `Planned` = not yet diagrammed.

---

## 1. Patient Check-In — Compliance Gates

```mermaid
flowchart TD
    START(["Patient Arrives"])
    START ==>|"Insert eGK"| READ["Card Read (PSDV654)"]
    READ -->|"KT master data loaded"| VSDM["VSDM Online Verification"]

    VSDM --> IK_CHECK{"IK in Selektiv-\nvertragsdefinition?"}

    IK_CHECK ==>|"No"| KV_PATH["KV Path"]
    IK_CHECK -->|"Yes"| CHECK_PART["Check HZV/FAV\nParticipation via HPM\n(VERT484, VERT582)"]

    CHECK_PART -->|"Active participation"| HZV_PATH["HZV/FAV Path"]
    CHECK_PART -->|"No participation"| KV_PATH
    CHECK_PART -.->|"No eGK-Nummer"| NO_EGK["Block Status Query\n(VERT1848, VERT1849)"]

    subgraph KV["[KV] Statutory Path"]
        KV_PATH --> KV_SCHEIN["Create KV Schein"]
    end

    subgraph HZV["[HZV/FAV] Selective Contract Path"]
        HZV_PATH --> PART_DISPLAY["Auto-Display\nParticipation Status\n(VERT833, VERT646)"]
        PART_DISPLAY --> CONTRACT_GATE{"Contract Feature\nGate (VERT686)"}
        CONTRACT_GATE ==>|"Permitted"| HZV_SCHEIN["Create HZV/FAV Schein"]
        CONTRACT_GATE -->|"Blocked"| BLOCK["Feature Blocked"]
    end

    KV_SCHEIN --> DONE(["Enter Documentation"])
    HZV_SCHEIN --> DONE
```

### 1a. Card Read-In Detail

Expands the `Card Read (PSDV654)` node from the main diagram.

```mermaid
flowchart TD
    INSERT(["Insert Card"])

    INSERT --> CARD_TYPE{"Card Type?"}
    CARD_TYPE ==>|"eGK"| EGK_READ["Read eGK Data\n(KP2-100)"]
    CARD_TYPE -->|"KVK"| KVK_CHECK{"Patient already\nhas eGK?\n(KP2-121)"}

    KVK_CHECK -->|"Yes"| KVK_BLOCK["Block KVK Read"]
    KVK_CHECK -->|"No"| GKV_CHECK{"GKV Patient?\n(KP2-101)"}
    GKV_CHECK -->|"Yes (post 01/2015)"| KVK_REJECT["Reject Legacy KVK"]
    GKV_CHECK -->|"No (Private)"| KVK_READ["Read KVK Data"]

    KVK_REJECT -.->|"Fallback"| MANUAL["Manual Data Transfer\n(KP2-102)"]

    EGK_READ --> FIELD_MAP["Map Fields per\nKBV Spec (P2-105)"]
    KVK_READ --> FIELD_MAP

    FIELD_MAP --> FIELD_CTRL["Set Field-Level Controls:\nOfficial = Read-Only\nUser fields = Editable\n(KP2-185)"]

    FIELD_CTRL --> FK4109["Auto-Set FK 4109\n(Card Read Date)\nRead-Only (P2-135)"]

    FK4109 --> REREAD{"Re-Read within\nQuarter?"}
    REREAD -->|"Yes"| UPDATE_RECORDS["Update FK 4109 across\nall 010x Records &\nBilling Records\n(P2-136, P2-150)"]
    REREAD ==>|"No (First Read)"| RESOLVE["Resolve Cost Carrier"]

    UPDATE_RECORDS --> RESOLVE

    RESOLVE --> IK_RESOLVE["Use VKNR/IK from Card\nas Official Source\n(P2-120, P2-200)"]

    IK_RESOLVE --> CONTEXT{"Care Context?\n(KP2-195)"}
    CONTEXT ==>|"Ambulant"| AMB["Ambulant Processing"]
    CONTEXT -->|"Stationär"| STAT["Stationär Processing"]

    AMB --> DONE(["Card Data Loaded"])
    STAT --> DONE
```

### 1b. VSDM & Insurance Validation Detail

Expands the `VSDM Online Verification` node and adds the missing insurance validity gates.

```mermaid
flowchart TD
    CARD_DATA(["Card Data Loaded"])

    CARD_DATA ==> VSDM["VSDM Online Check"]

    VSDM --> FK4136["Capture FK 4136\n(Proof Status)\n(KP2-190)"]
    FK4136 --> TS_VALID{"VSDM Timestamp\nwithin Current\nQuarter?\n(KP2-191)"}
    TS_VALID ==>|"Yes"| AGE_CHECK{"Patient\nunder 18?\n(KP2-191)"}
    TS_VALID -->|"No / Stale"| TS_WARN["Timestamp Warning"]
    TS_WARN --> AGE_CHECK

    AGE_CHECK -->|"Yes"| FEE_EXEMPT["Auto-Mark\nZuzahlungsbefreit"]
    AGE_CHECK ==>|"No"| COVERAGE
    FEE_EXEMPT --> COVERAGE

    COVERAGE["Check Insurance\nCoverage Validity\n(P2-140, P2-166)"]
    COVERAGE --> COV_STATUS{"Coverage\nValid?"}
    COV_STATUS ==>|"Valid"| CARRIER_CHECK
    COV_STATUS -->|"Expired / Not Begun"| COV_ALERT["Alert: Coverage\nExpired or Not\nYet Begun (P2-166)"]
    COV_ALERT -.->|"User acknowledges"| CARRIER_CHECK

    CARRIER_CHECK["Check Cost Carrier\nBilling Capability\n(P2-210)"]
    CARRIER_CHECK --> CARRIER_STATUS{"Carrier Status?"}

    CARRIER_STATUS ==>|"Active"| IK_VALID
    CARRIER_STATUS -->|"Dissolved"| DISSOLVED["Error: Carrier Dissolved\nBilling Blocked (P2-230)"]
    CARRIER_STATUS -->|"Merged"| FUSION["Redirect to\nAbsorbing Carrier\n(P2-220)"]
    FUSION --> IK_VALID

    IK_VALID{"IK Valid &\nCurrent?\n(P2-260)"}
    IK_VALID ==>|"Yes"| DATA_CHANGE
    IK_VALID -->|"Invalid / Expired"| IK_WARN["Warning: Invalid IK\n(Proceed after\nManual Check)\n(P2-260)"]
    IK_WARN -.->|"User proceeds"| DATA_CHANGE

    DATA_CHANGE{"VSDM Data\nChanged Mid-Quarter?\n(KP2-557)"}
    DATA_CHANGE -->|"Yes"| UPDATE_BILLING["Update Affected\nBilling Records\n(KP2-557)"]
    DATA_CHANGE ==>|"No"| INS_CHANGE

    UPDATE_BILLING --> INS_CHANGE

    INS_CHANGE{"Insurance Changed\nwithin Quarter?\n(P2-530)"}
    INS_CHANGE -->|"Yes"| SPLIT["Split Billing Records\nat Change Date\n(P2-535)"]
    INS_CHANGE ==>|"No"| CONFLICT

    SPLIT --> CONFLICT

    CONFLICT{"Stammdaten\nConflict?\n(VERT1483)"}
    CONFLICT -->|"Yes"| CONFLICT_ALERT["Flag Conflict:\neGK vs PVS\n(VERT1483)"]
    CONFLICT ==>|"No"| DONE

    CONFLICT_ALERT -.->|"Resolved"| DONE(["Proceed to\nIK / Path Check"])
```

### 1c. HZV/FAV Status Messages Detail

Expands the HPM participation check with specific response messages.

```mermaid
flowchart TD
    START(["HPM Participation\nQuery"])

    START --> HZV_Q["Query HzV Status\n(VERT495)"]
    START --> FAV_Q["Query FaV Status\n(VERT581)"]

    HZV_Q --> HZV_RESULT{"HzV Result?"}
    HZV_RESULT ==>|"Active"| HZV_MSG_ACTIVE["Display Active\nStatus Message"]
    HZV_RESULT -->|"No Participation"| HZV_MSG_NONE["Display: 'Der Patient\nist derzeit kein aktiver\nVertragsteilnehmer'\n(VERT495)"]

    FAV_Q --> FAV_RESULT{"FaV Result?"}
    FAV_RESULT ==>|"Active"| FAV_MSG_ACTIVE["Display Active\nStatus Message"]
    FAV_RESULT -->|"No Participation"| FAV_MSG_NONE["Display: 'Der Patient\nist derzeit kein aktiver\nVertragsteilnehmer'\n(VERT581)"]

    HZV_MSG_ACTIVE --> DONE(["Continue to\nPath Selection"])
    HZV_MSG_NONE --> DONE
    FAV_MSG_ACTIVE --> DONE
    FAV_MSG_NONE --> DONE
```

---

## 2. Contract Participation Management — HZV/FAV Only

```mermaid
flowchart TD
    START(["Open Participation"])

    subgraph Lifecycle["[HZV/FAV] Participation Lifecycle (VERT1181)"]
        REQUEST["Request Participation\n(VERT641, VERT1288)"]
        ACTIVATE["Activate\n(VERT642)"]
        END_PART["End Participation\n(VERT644)"]
        REVERSE["Reverse Termination\n(VERT645)"]
        CANCEL["Cancel"]

        REQUEST ==>|"HPM confirms"| ACTIVATE
        ACTIVATE -->|"Terminate"| END_PART
        END_PART -.->|"Reverse"| REVERSE
        REVERSE --> ACTIVATE
    end

    START ==> REQUEST
    START -->|"Check status"| STATUS["Check Status via HPM\n(VERT494, VERT643)"]
    START -->|"FAV verify"| FAV_CHECK["FAV Status Verify\n(VERT857)"]

    ACTIVATE -->|"Insurance change"| RE_ENROLL["Re-Enrollment Notice\n(VERT649)"]
    ACTIVATE -.->|"Module contract"| MODULE{"Main Contract\nActive? (VERT791)"}
    MODULE ==>|"Yes"| MOD_ACTIVATE["Activate Module"]
    MODULE -->|"No"| MOD_BLOCK["Module Blocked"]

    subgraph Window["Participation Window (VERT647, VERT648)"]
        WINDOW_CHECK{"Within Window?"}
        WINDOW_CHECK ==>|"Yes"| ALLOW["Allow Documentation"]
        WINDOW_CHECK -->|"No"| DENY["Block Documentation"]
    end

    ACTIVATE --> WINDOW_CHECK
```

---

## 3. Patient Enrollment — HZV/FAV Only

```mermaid
flowchart TD
    START(["Create Enrollment Declaration"])

    subgraph TELifecycle["[HZV/FAV] TE Lifecycle (VERE556)"]
        CREATED["Erzeugt (Created)\n(VERE466)"]
        PRINTED["Gedruckt (Printed)\n(VERE555)"]
        ERROR_TE["Fehlerhaft (Error)"]
        SUCCESS_TE["Erfolgreich (Successful)"]

        CREATED ==>|"Print"| PRINTED
        PRINTED ==>|"Transmit"| SUCCESS_TE
        PRINTED -->|"Transmit fails"| ERROR_TE
        ERROR_TE -->|"Retry (VERE562)"| PRINTED
    end

    START ==> CREATED
    CREATED -.->|"Missing data"| WARN["Missing Data Warning\n(VERE1857)"]

    PRINTED --> SIG{"Signature\nRequirement?"}
    SIG -->|"HZV: 2 sigs + TE-Code\n(VERE558)"| HZV_SIG["HZV Signature Dialog"]
    SIG -->|"FAV: 1 sig + TE-Code\n(VERE1133)"| FAV_SIG["FAV Signature Dialog"]

    HZV_SIG --> PREREQ["Check Prerequisites\n(VERE560)"]
    FAV_SIG --> PREREQ
    PREREQ ==>|"Met"| TRANSMIT["Transmit to HPM\n(VERE561)"]
    PREREQ -->|"Unmet"| BLOCK["Transmission Blocked"]
    TRANSMIT --> SUCCESS_TE

    SUCCESS_TE -->|"FAV auto-activate\n(VERE1682)"| AUTO["Auto-Activation"]
    SUCCESS_TE -->|"Persist TE ID\n(VERE1881)"| PERSIST["TE Identifier Stored"]
    SUCCESS_TE -->|"Block re-send\n(VERE562)"| DONE(["Enrollment Complete"])

    START -.->|"Unsent daily check\n(VERE563)"| NOTIFY["Daily Notification"]
    START -.->|"Delete rules\n(VERE564)"| DELETE["Deletion per Status"]
```

---

## 4. Billing Documentation — KV vs HZV/FAV Divergence

```mermaid
flowchart TD
    START(["Document Services"])
    START ==> GNR["Enter Service Code (GNR)"]

    GNR --> CONTACT{"Code 0000\nPresent?\n(ABRD456)"}
    CONTACT -.->|"Missing"| PROMPT_0000["Prompt: Add\nArzt-Patienten-Kontakt"]

    GNR --> DIAG["Diagnoses per §295\n(ABRD608)"]
    DIAG --> ICD_VALID["ICD-10 Validity Check\n(ABRD679)"]
    ICD_VALID --> TERMINAL{"Terminal Code?\n(ABRD611, ABRD612)"}
    TERMINAL -.->|"Non-terminal"| HINT_TERM["Specificity Hint"]

    DIAG --> PERM_CHECK{"Acute as\nPermanent?\n(ABRD514, ABRD969)"}
    PERM_CHECK -.->|"Yes"| WARN_ACUTE["Warning: Blocks\nChronikerpauschale"]

    DIAG --> CARRY["Carry Forward\nDauerdiagnosen\n(ABRD609)"]

    subgraph KV_DOC["[KV] Statutory Documentation"]
        KV_REGION["Filter by KV Region\n(ABRD603)"]
        OPS_KV["OPS per EBM Annex 2\n(ABRD991, ABRD992)"]
    end

    subgraph HZV_DOC["[HZV/FAV] Selective Contract Documentation"]
        PART_ACTIVE{"Active Participation?\n(ABRD605, ABRD834)"}
        PART_ACTIVE ==>|"Yes"| CONTRACT_FILTER["Filter by IK\n(ABRD606, ABRD830)"]
        PART_ACTIVE -->|"No"| DOC_BLOCK["Block Service Entry"]
        CONTRACT_FILTER --> FAV_VERIFY["FAV Online Verify\n(ABRD1681)"]
        FAV_VERIFY --> LABEL["Label per Contract\n(ABRD601)"]
        LABEL --> REF_FIELDS["Referral LANR/BSNR\n(ABRD459)"]
        REF_FIELDS --> COVER["FAV Cover Letter\n(ABRD850)"]
        LABEL --> MATERIAL["Material Costs\n(ABRD994)"]
        LABEL --> JUSTIFY["Billing Justification\n(ABRD995)"]
    end

    GNR --> KV_REGION
    GNR --> PART_ACTIVE

    GNR --> DELETE_PROT{"Submitted?\n(ABRD607)"}
    DELETE_PROT -->|"Yes"| NO_DELETE["Deletion Blocked\n(Audit Trail)"]
```

---

## 5. Billing Process — KV vs HZV/FAV Submission

```mermaid
flowchart TD
    START(["Prepare Billing"])

    START --> CONTROL["Control List\n(ABRG614, ABRG993)"]
    CONTROL --> SELECT["Select Cases/Contracts\n(ABRG803)"]

    SELECT --> HPM_VALID["HPM Validation\n(ABRG615, ABRG667)"]
    HPM_VALID --> ERRORS{"Errors Found?\n(ABRG616)"}
    ERRORS ==>|"No"| CHANNEL{"Transmission\nChannel?\n(ABRG927)"}
    ERRORS -->|"Yes"| FIX["Correct Invalid\nServices"]
    FIX --> HPM_VALID

    subgraph KV_BILL["[KV] Statutory Billing"]
        KV_CONFLICT["Check HZV Patient\nin KV Billing\n(ABRG829)"]
        KV_SUBMIT["Submit KV Billing"]
    end

    subgraph HZV_BILL["[HZV/FAV] Selective Billing"]
        PART_PRE["Pre-Participation Check\n(ABRG958, ABRG961)"]
        HZV_VALID["Contract-Specific Rules\n(ABRG454, ABRG493)"]
        HZV_SUBMIT["Submit HZV/FAV Billing"]
        PART_PRE ==> HZV_VALID
        HZV_VALID ==> HZV_SUBMIT
    end

    CHANNEL -->|"Online"| ONLINE["Online Transmission"]
    CHANNEL -.->|"Offline"| OFFLINE["Data Carrier Export\n(ABRG386, ABRG929)"]

    ONLINE --> KV_CONFLICT
    KV_CONFLICT --> KV_SUBMIT
    ONLINE --> PART_PRE

    subgraph PostSubmit["Post-Submission"]
        MARK["Mark as Transmitted\n(ABRG490)"]
        CONFIRM["Show Confirmation\n(ABRG491)"]
        PROTOCOL["Display Protocol PDF\n(ABRG933)"]
        LOG["Log All Warnings\n(ABRG492, ABRG619)"]
        DUPE["Block Duplicates\n(ABRG486)"]
    end

    KV_SUBMIT ==> MARK
    HZV_SUBMIT ==> MARK
    MARK --> CONFIRM
    CONFIRM --> PROTOCOL
    PROTOCOL --> LOG

    HZV_SUBMIT -.->|"Medi contract"| POST_EDIT["Post-Submission Edit\n(ABRD1008)"]
```

---

## 6. Diagnosis Entry & Coding Validation

```mermaid
flowchart TD
    START(["Enter Diagnosis"])
    START ==>|"Type ICD code"| SEARCH["ICD-10 Search\n(SDICD Catalog)"]

    SEARCH --> VALID{"Code Valid?\n(3.14 KBV ICD-10-GM)"}
    VALID -->|"Non-existent"| REJECT["Reject Code"]
    VALID ==>|"Valid"| TERMINAL{"Terminal Code?\n(ICD-GM.26)"}
    TERMINAL -.->|"Non-terminal"| PROMPT["Prompt Sub-Codes\n(ICD-GM.26)"]
    TERMINAL ==>|"Terminal"| SICHER["Select Diagnosensicherheit\nV / G / A / Z\n(ICD-GM.1-4)"]

    SICHER --> PLAUS{"Plausibility?"}
    PLAUS -.->|"Gender mismatch"| WARN_G["Warning: Gender\n(ICD-GM.14)"]
    PLAUS -.->|"Age mismatch"| WARN_A["Warning: Age\n(ICD-GM.15)"]
    PLAUS -.->|"Acute + Z marker"| WARN_Z["Warning: Z not\nfor acute (ABRD786)"]
    PLAUS -.->|"Repeated V across\nquarters (ABRD887)"| WARN_V["Warning: Review\nSuspected Diagnosis"]

    SICHER --> LATERAL{"Laterality\nRequired?\n(ICD-GM.7)"}
    LATERAL -->|"Yes"| LAT_SEL["R / L / B Selector"]
    LATERAL -->|"No"| SAVE

    LAT_SEL --> SAVE["Save Diagnosis"]
    SAVE --> RULES["Run Coding Rules\n(SDKRW)"]
    RULES --> VIOLATIONS{"Violations?\n(ICD-GM.40-47)"}
    VIOLATIONS -->|"Yes"| CORRECTION["Propose Corrections\nDELETE / REPLACE / ADD"]
    VIOLATIONS ==>|"No"| DONE(["Diagnosis Documented"])
    CORRECTION -->|"Accept/Reject"| DONE

    subgraph HZV_DIAG["[HZV/FAV] Additional Checks"]
        MULTI["Multimorbidity Check\n(ABRD967, ABRD1546)"]
        PATTERN["Disease Pattern Check\n(ABRD965)"]
        CARRY_FWD["Carry-Forward Review\n(ABRD609)"]
    end

    SAVE --> MULTI
    SAVE --> PATTERN
```

---

## 7. Service Documentation — KVDT Compliance

```mermaid
flowchart TD
    START(["Document Service"])
    START ==> GNR_INPUT["Enter GNR\n(KVDT-SD)"]

    GNR_INPUT --> EBM_CHECK{"EBM Rules\nApply?\n(3.11 KBV EBM)"}

    subgraph KV_SVC["[KV] EBM Validation"]
        GENDER["Gender Check\n(EBM.1)"]
        AGE["Age Check\n(EBM.2)"]
        FREQ["Frequency Limit\n(EBM.3)"]
        SPECIALTY["Specialty Gate\n(EBM.4)"]
        EXCLUSION["Exclusion Check\n(EBM.5-8)"]
    end

    EBM_CHECK ==>|"KV path"| GENDER
    GENDER --> AGE --> FREQ --> SPECIALTY --> EXCLUSION

    subgraph HZV_SVC["[HZV/FAV] Contract Validation"]
        PART_STATUS["Check Participation\n(ABRD605)"]
        IK_FILTER["Filter by IK\n(ABRD606)"]
        REGION_FILTER["Filter by KV Region\n(ABRD603)"]
        CONTRACT_SVC["Contract Service Catalog"]
    end

    EBM_CHECK -->|"HZV/FAV path"| PART_STATUS
    PART_STATUS ==> IK_FILTER ==> REGION_FILTER ==> CONTRACT_SVC

    GNR_INPUT --> TSS{"TSS Case?\n(3.13 KBV TSS)"}
    TSS -->|"Yes"| SURCHARGE["Calculate Surcharge\nA/B/C/D"]

    GNR_INPUT --> OPS{"OPS Required?\n(KVDT-SD.OPS)"}
    OPS -->|"Yes"| OPS_INPUT["Enter OPS Code"]
    OPS_INPUT --> OPS_VALID["Validate vs Catalog\n(ABRD992)"]

    EXCLUSION --> DOCUMENTED(["Service Documented"])
    CONTRACT_SVC --> DOCUMENTED
```

---

## 8. Prescription & Drug Safety

```mermaid
flowchart TD
    START(["Prescribe Medication"])
    START ==>|"Select drug"| SEARCH["Drug Search\n(3.19 E-Rezept)"]

    SEARCH --> INTERACT["Interaction Check\n(3.19.INTERACT)"]
    INTERACT -.->|"Severe"| ALERT["Interaction Alert"]
    SEARCH --> DOSAGE["Dosage Calculation\n(3.19.DOSAGE)"]
    SEARCH -.->|"Red Hand Letter"| RED["Safety Alert\n(3.19.RED)"]

    SEARCH --> RX_TYPE{"Prescription\nContext?"}

    subgraph KV_RX["[KV] Statutory Prescribing"]
        AVWG["KBV AVWG Rules\n(VSST527, VSST1543)"]
        AUT_IDEM["Aut-Idem Check"]
        PIM["PIM/PRISCUS Label\n(VSST784)"]
    end

    subgraph HZV_RX["[HZV/FAV] Contract Prescribing"]
        MED_CAT["Insurance-Specific\nCategories\n(VSST537)"]
        HPM_REC["HPM Medication\nRecommendations\n(VSST541, VSST545)"]
        GRUEN_BLAU["Gruen/Blau: Show\n'rabattiert' not price\n(VSST539)"]
        ROT_ORANGE["Rot/Orange: Show\nSubstitutions\n(VSST541)"]
        PRISCUS["PRISCUS Column\n(VSST854)"]
        CONTRACT_PRINT["Contract-Specific\nPrint Rules\n(FORM513)"]
    end

    RX_TYPE -->|"KV"| AVWG
    AVWG --> AUT_IDEM --> PIM
    RX_TYPE -->|"HZV/FAV"| MED_CAT
    MED_CAT --> HPM_REC
    HPM_REC --> GRUEN_BLAU
    HPM_REC --> ROT_ORANGE
    MED_CAT --> PRISCUS
    MED_CAT --> CONTRACT_PRINT

    subgraph Signing["E-Rezept Signing (3.19)"]
        SIGN["Comfort Signature"]
        SUBMIT_RX["Submit to Fachdienst"]
        SIGN ==> SUBMIT_RX
    end

    PIM --> SIGN
    CONTRACT_PRINT --> SIGN
    SUBMIT_RX --> DONE(["Prescription Issued"])
```

---

## 9. Form Management — KV vs HZV/FAV Forms

```mermaid
flowchart TD
    START(["Generate Form"])

    subgraph KV_FORMS["[KV] Statutory Forms"]
        BFB["Blankoformularbedruckung\nMuster 2/6/12/13/61\n(FORM588)"]
        M52["Muster 52.2\n(FORM610)"]
        EAU["eAU Validation\n(FORM1844)"]
    end

    subgraph HZV_FORMS["[HZV/FAV] Contract Forms"]
        CONTRACT_GATE{"Contract Form\nGate (FORM632,\nFORM813, FORM1042)"}
        CONTRACT_GATE ==>|"Enabled"| FORM_SET["Contract Form Set"]
        FORM_SET --> COVER_LETTER["FAV Cover Letter\n(FORM635)"]
        FORM_SET --> SPECIALTY_REPORTS["FAV Specialty Reports\n(FORM636-637, FORM859)"]
        FORM_SET --> SCHNELLINFO["Schnellinformation\n(FORM814, FORM815)"]
        FORM_SET --> BEFUNDBOEGEN["Befundboegen\n(FORM1174-1178)"]
        FORM_SET --> PRAEV["Praeventionsverordnung\n(FORM1286)"]
        FORM_SET --> TE_PRINT["TE Print per\nContract Variant\n(FORM1566, FORM1689)"]
    end

    START -->|"KV form"| BFB
    START -->|"Contract form"| CONTRACT_GATE

    BFB --> VALIDATE["Form Validation\n(FORM1410)"]
    FORM_SET --> VALIDATE
    VALIDATE --> PRINT["Print Form"]
    PRINT --> DONE(["Form Generated"])

    SCHNELLINFO -.->|"Not printed"| SKIP_CONFIRM["Confirm Skip Dialog\n(FORM815)"]
    PRAEV -.->|"Diagnosis from\nAKA list"| AUTO_OPEN["Auto-Open Form\n(FORM1286)"]
```

---

## 10. Practice Software (VSST) — Hilfsmittel Path

```mermaid
flowchart TD
    START(["Prescribe Hilfsmittel"])

    subgraph Catalog["Hilfsmittel Catalog (VSST623)"]
        SEARCH["Search by Product/\nKeyword/Manufacturer\n(VSST624)"]
        SORT["Sort: Produktgruppe >\nAnwendungsort >\nUntergruppe\n(VSST962)"]
        SEARCH --> SORT
    end

    START ==> SEARCH

    SORT --> TYPE{"Product Type\nor Individual?\n(VSST625)"}
    TYPE ==>|"7-digit (Standard)"| STD["Standard Prescription"]
    TYPE -->|"10-digit (Exception)"| EXTRA_STEP["Extra Confirmation\nStep Required"]
    EXTRA_STEP --> EXCEPT["Exception Prescription"]

    STD --> STEUER{"Steuerbare\nHilfsmittel?\n(VSST626)"}
    STEUER -->|"Yes"| STEUER_CHECK["Check 7-digit vs\nSteuerbare List\n(VSST627)"]
    STEUER_CHECK --> FRAGE{"Fragebogen\nRequired?\n(VSST629)"}
    FRAGE -->|"Yes"| FILL_Q["Fill Questionnaire\n(VSST630)"]
    FRAGE -->|"No"| MERKBLATT
    FILL_Q --> MERKBLATT["Print Merkblatt\n(VSST628)"]
    MERKBLATT --> FAX_HINT["Hint: Fax to\nMuster 16 Number\n(VSST631)"]

    STEUER -->|"No"| FIELDS["Required Fields:\nQty, Positionsnr,\nPeriod, Diagnosis\n(VSST633)"]

    subgraph HZV_HM["[HZV/FAV] Contract-Specific"]
        NO_TRANSMIT["Block Hilfsmittel\nTransmission\n(VSST530)"]
    end

    FIELDS --> DONE(["Hilfsmittel Prescribed"])
    FAX_HINT --> DONE
```

---

## 11. eDMP & Chronic Care Compliance

```mermaid
flowchart TD
    START(["Open eDMP"])

    subgraph DMP_Types["Required DMPs (VSST592, VSST1547)"]
        DM1["Diabetes Type 1"]
        DM2["Diabetes Type 2"]
        KHK["Koronare Herzkrankheit\n(VSST677)"]
        ASTHMA["Asthma"]
        COPD["COPD"]
        BRUSTKREBS["Brustkrebs"]
    end

    START ==> SELECT["Select DMP Program"]
    SELECT --> DM1 & DM2 & KHK & ASTHMA & COPD & BRUSTKREBS

    DM1 --> DOC["eDMP Documentation\n(3.21.eDMP)"]
    DOC --> VALIDATE["eDMP Validation\n(3.21.VALID)"]
    VALIDATE --> SUBMIT{"Transmission?\n(VSST1020)"}
    SUBMIT ==>|"Submit"| TRANSMIT["Transmit to\nDMP-Datenstelle"]
    SUBMIT -.->|"Optional"| SKIP["Skip Transmission"]

    subgraph Audit["Audit & Scoring (3.21)"]
        SCORE["Scoring Calculator"]
        AUDIT_TRAIL["Audit Trail"]
        EHKS["eHKS Documentation"]
    end

    DOC --> SCORE
    TRANSMIT --> AUDIT_TRAIL
    START -->|"eHKS"| EHKS
    EHKS --> TRANSMIT
```

---

## 12. eArztbrief, eAU & ePA Compliance

```mermaid
flowchart TD
    subgraph eAU["eAU Workflow (3.20)"]
        EAU_CREATE["Create eAU"]
        EAU_EMPLOY{"Employment Data\nCurrent?\n(VSST599, VSST621)"}
        EAU_CREATE --> EAU_EMPLOY
        EAU_EMPLOY ==>|"Yes"| EAU_SIGN["Sign & Transmit"]
        EAU_EMPLOY -->|"No/Stale >1yr"| EAU_BLOCK["Block: Update\nEmployment First\n(VSST622)"]
        EAU_SIGN -.->|"F32.9/F33.9 + Follow-up"| DEPR_HINT["Depression Hint\n(VSST848)"]
    end

    subgraph eBrief["eArztbrief (3.20)"]
        COMPOSE["Compose Letter"]
        RECIPIENT["Select Recipient\n(KIM Directory)"]
        SIGN_LETTER["Sign CDA R2"]
        SEND["Send via KIM"]
        COMPOSE --> RECIPIENT --> SIGN_LETTER --> SEND
    end

    subgraph ePA["ePA (3.20)"]
        BROWSE["Browse Documents"]
        ENTITLE["Manage Entitlements"]
        UPLOAD["Upload Document"]
        BROWSE --> ENTITLE
        BROWSE --> UPLOAD
    end
```

---

## 13. IT Connectivity & Infrastructure

```mermaid
flowchart TD
    subgraph Mandatory["Mandatory Infrastructure"]
        HPM["HPM Integration\n(Pruef- und\nAbrechnungsmodul)"]
        KIM["KIM Messaging"]
        TI["TI Connector"]
    end

    subgraph Optional["Optional Modules (ITVE)"]
        EBRIEF["eArztbrief\n(27 items)"]
        HAUSKO["Hauskomet\n(40 items)"]
        TELE["TeleScan-Derma\n(34 items)"]
        DETE["DETE Data Exchange\n(32 items)"]
    end

    HPM -->|"Used by"| PART_CHECK["Participation Check"]
    HPM -->|"Used by"| BILL_VALID["Billing Validation"]
    HPM -->|"Used by"| MED_REC["Medication Recommendations"]
    KIM -->|"Used by"| EAU["eAU Transmission"]
    KIM -->|"Used by"| EBRIEF_SEND["eArztbrief Send"]
    TI -->|"Used by"| CARD_READ["Card Read / VSDM"]
```

---

## 14. Compliance Obligation Summary by Path

```mermaid
flowchart TD
    subgraph KV_ONLY["[KV] KV-Only Obligations"]
        KBV_EBM["KBV EBM Rules\n14 items"]
        GOA["GOÄ Private Billing\n1 item"]
        KBV_TSS["KBV TSS Surcharges\n1 item"]
    end

    subgraph HZV_ONLY["[HZV/FAV] Selective-Only Obligations"]
        VERT_SEC["VERT: Participation\n43 items"]
        VERE_SEC["VERE: Enrollment\n25 items"]
        VSST_MED["VSST: Medication\nRecommendations\n~30 items"]
        FORM_CONTRACT["FORM: Contract Forms\n~25 items"]
    end

    subgraph BOTH["Both KV + HZV/FAV"]
        ABRD_SEC["ABRD: Billing Doc\n46 items"]
        ABRG_SEC["ABRG: Billing Process\n45 items"]
        ICD_SEC["ICD-10-GM: Coding\n57 items"]
        KVDT_SEC["KVDT: Patient/Service/Billing\n158 items"]
        CRUCIAL["Crucial Workflows\n56 items"]
        ALLG_SEC["ALLG: General\n28 items"]
    end

    BOTH ==>|"604 total\nobligations"| TOTAL(["Compliance\nInventory"])
    KV_ONLY --> TOTAL
    HZV_ONLY --> TOTAL
```
