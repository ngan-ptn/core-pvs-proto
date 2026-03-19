---
Version: 1.0
Last Updated: 2026-03-19
Scope: As-built from DATA260319-checkin-compliance-screens.md (11 surfaces, state-level detail)
---

# Patient Check-In — User Workflow Diagrams (Detailed)

Derived from the Patient Check-In Compliance Screen Inventory (11 surfaces, 64 obligations). Unlike the compliance flow diagrams, this version shows **screen transitions, state flows, and component interactions** from the MFA's perspective.

---

## 1. MFA — Check-In Main Flow

The happy path from patient arrival through to documentation entry.

```mermaid
flowchart TD
    START(["Patient Arrives"])
    START ==>|"Insert eGK"| CARD["CI-002: Card Read Screen"]

    subgraph CardRead["Card Read States"]
        INSERT["Insert Card"] ==>|"eGK detected"| EGK["eGK Read"]
        INSERT -->|"KVK detected"| KVK_CHK{"Has eGK\non file?"}
        KVK_CHK -->|"Yes"| KVK_BLOCK["KVK Blocked (KP2-121)"]
        KVK_CHK -->|"No + GKV"| KVK_REJ["KVK Rejected (KP2-101)"]
        KVK_CHK -->|"No + Private"| KVK_READ["KVK Read (Private)"]
        KVK_REJ -.->|"Fallback"| MANUAL_LINK["→ CI-003: Manual Entry"]

        EGK ==>|"KBV spec"| FIELD_MAP["Field Mapping (P2-105)"]
        KVK_READ --> FIELD_MAP
        FIELD_MAP ==> FIELD_CTRL["Field Controls Applied\nOfficial = Read-Only\nUser = Editable (KP2-185)"]
        FIELD_CTRL ==> FK4109["FK 4109 Auto-Set\nRead-Only (P2-135)"]
    end

    CARD ==> INSERT

    FK4109 --> REREAD{"Re-Read\nwithin Quarter?"}
    REREAD -->|"Yes"| UPDATE["Update FK 4109 across\nall 010x & Billing Records\n(P2-136, P2-150)"]
    REREAD ==>|"No (First Read)"| RESOLVE["Resolve Cost Carrier\nVKNR/IK from Card\n(P2-120, P2-200)"]
    UPDATE --> RESOLVE

    RESOLVE --> CONTEXT{"Care Context?\n(KP2-195)"}
    CONTEXT ==>|"Ambulant"| VSDM["CI-005: VSDM Verification"]
    CONTEXT -->|"Stationär"| VSDM

    VSDM ==>|"All checks pass"| ROUTING["CI-001: Check-In Routing"]

    ROUTING ==>|"KV path"| KV_SCHEIN["Create KV Schein"]
    ROUTING -->|"HZV/FAV path"| HPM["CI-008: HPM Status Display"]

    HPM -->|"Active"| HZV_SCHEIN["Create HZV/FAV Schein"]
    HPM -->|"No participation"| KV_SCHEIN

    KV_SCHEIN ==> DONE(["Enter Documentation"])
    HZV_SCHEIN ==> DONE
```

---

## 2. MFA — VSDM & Insurance Verification Detail

Expands the CI-005 node from the main flow. Shows all validation decision points.

```mermaid
flowchart TD
    START(["Card Data Loaded\nfrom CI-002"])

    START ==> VSDM["VSDM Online Check"]
    VSDM ==> FK4136["FK 4136 Captured\n(KP2-190)"]

    FK4136 --> TS{"Timestamp\nCurrent Quarter?\n(KP2-191)"}
    TS ==>|"Yes"| AGE{"Patient\nunder 18?"}
    TS -->|"No / Stale"| TS_WARN["Timestamp Stale Warning"]
    TS_WARN --> AGE

    AGE -->|"Yes"| FEE_EXEMPT["Auto-Mark\nZuzahlungsbefreit"]
    AGE ==>|"No"| COVERAGE
    FEE_EXEMPT --> COVERAGE

    COVERAGE["Check Coverage\n(P2-140)"] --> COV{"Coverage\nValid?"}
    COV ==>|"Valid"| CARRIER
    COV -->|"Expired / Not Begun"| COV_ALERT["Alert: Coverage Issue\n(P2-166)"]
    COV_ALERT -.->|"User acknowledges"| CARRIER

    CARRIER["Check Carrier\nBilling Capability\n(P2-210)"] --> CARR_STATUS{"Carrier\nStatus?"}
    CARR_STATUS ==>|"Active"| IK_CHECK
    CARR_STATUS -->|"Dissolved"| DISSOLVED["Error: Carrier Dissolved\nBilling Blocked (P2-230)"]
    CARR_STATUS -->|"Merged"| FUSION["Redirect to Absorbing\nCarrier (P2-220)"]
    FUSION --> IK_CHECK

    IK_CHECK{"IK Valid?\n(P2-260)"} ==>|"Yes"| PG_CHECK
    IK_CHECK -->|"Invalid / Expired"| IK_WARN["Warning: Invalid IK\nOverride Available"]
    IK_CHECK -->|"Unknown"| IK_UNKNOWN["→ CI-004: Carrier Search\n(P2-270, P2-275)"]
    IK_WARN -.->|"User overrides"| PG_CHECK

    PG_CHECK{"Personen-\ngruppe?\n(P2-320)"} ==>|"Standard"| DATA_CHANGE
    PG_CHECK -->|"PG 09"| ASYL["→ CI-007: AsylbLG\nRestriction Notice\n(P2-325)"]
    PG_CHECK -->|"Other special"| KTAB["→ CI-007: KTAB\nSelection (P2-320)"]
    ASYL --> DATA_CHANGE
    KTAB --> DATA_CHANGE

    subgraph KTAB_Gate["CI-007: Personengruppe Gate"]
        KTAB_DISSOLVED{"KTAB\nDissolved?\n(P2-285)"}
        KTAB_DISSOLVED -->|"Yes"| KTAB_BLOCK["Error: KTAB Dissolved\nProcessing Blocked"]
        KTAB_DISSOLVED ==>|"No"| KTAB_OK["KTAB Valid"]
    end

    DATA_CHANGE{"VSDM Data\nChanged?\n(KP2-557)"} -->|"Yes"| BILLING_UPD["Update Billing\nRecords"]
    DATA_CHANGE ==>|"No"| INS_CHANGE
    BILLING_UPD --> INS_CHANGE

    INS_CHANGE{"Insurance\nChanged?\n(P2-530)"} -->|"Yes"| SPLIT["→ CI-006: Split Preview\n(P2-535)"]
    INS_CHANGE ==>|"No"| CONFLICT
    SPLIT --> CONFLICT

    CONFLICT{"Stammdaten\nConflict?\n(VERT1483)"} -->|"Yes"| CONFLICT_ALERT["Conflict Alert:\neGK vs PVS"]
    CONFLICT ==>|"No"| DONE
    CONFLICT_ALERT -.->|"Resolved"| DONE(["→ CI-001: Routing"])
```

---

## 3. MFA — Check-In Routing & Path Selection

Expands the CI-001 node. Shows the KV vs HZV/FAV decision tree.

```mermaid
flowchart TD
    START(["VSDM Verified\nfrom CI-005"])

    START ==> IK_CHECK{"IK in Selektiv-\nvertragsdefinition?"}

    IK_CHECK ==>|"No"| KV_PATH["KV Statutory Path"]
    IK_CHECK -->|"Yes"| EGK_CHECK{"eGK-Nummer\nAvailable?\n(VERT1848)"}

    EGK_CHECK ==>|"Yes"| HPM_QUERY["Query HPM\n(VERT484, VERT582)"]
    EGK_CHECK -->|"No"| NO_EGK["Block Status Query\nHint: 'Teilnahmestatus kann\nnicht ermittelt werden'\n(VERT1849)"]
    NO_EGK --> KV_PATH

    HPM_QUERY --> HPM_DISPLAY["CI-008: HPM Status Display"]

    subgraph HPMStates["HPM Participation Query"]
        HZV_Q["Query HzV\n(VERT495)"]
        FAV_Q["Query FaV\n(VERT581)"]

        HZV_Q --> HZV_R{"HzV Active?"}
        FAV_Q --> FAV_R{"FaV Active?"}

        HZV_R ==>|"Active"| HZV_ACTIVE["HzV Active Status"]
        HZV_R -->|"No"| HZV_NONE["'Kein aktiver\nVertragsteilnehmer'"]
        FAV_R ==>|"Active"| FAV_ACTIVE["FaV Active Status"]
        FAV_R -->|"No"| FAV_NONE["'Kein aktiver\nVertragsteilnehmer'"]
    end

    HPM_DISPLAY ==> HZV_Q
    HPM_DISPLAY ==> FAV_Q

    HZV_ACTIVE --> PART{"Any\nParticipation\nActive?"}
    HZV_NONE --> PART
    FAV_ACTIVE --> PART
    FAV_NONE --> PART

    PART ==>|"Yes"| CONTRACT_GATE{"Contract Feature\nGate (VERT686)"}
    PART -->|"No"| KV_PATH

    CONTRACT_GATE ==>|"Permitted"| HZV_PATH["HZV/FAV Path"]
    CONTRACT_GATE -->|"Blocked"| FEATURE_BLOCK["Feature Blocked"]
    FEATURE_BLOCK --> KV_PATH

    subgraph KassenwechselCheck["Insurance Change Check"]
        KASSEN{"Kassenwechsel +\nActive Teilnahme?\n(VERT649)"}
        KASSEN -->|"Yes"| RE_ENROLL["→ CI-011: Re-Enrollment Notice"]
        KASSEN ==>|"No"| NO_CHANGE["No Action"]
    end

    HZV_PATH --> KASSEN

    KV_PATH ==> KV_SCHEIN["Create KV Schein"]
    HZV_PATH ==> HZV_SCHEIN["Create HZV/FAV Schein"]
    RE_ENROLL -.->|"Acknowledged"| HZV_SCHEIN

    KV_SCHEIN ==> DONE(["Enter Documentation"])
    HZV_SCHEIN ==> DONE
```

---

## 4. MFA — Alternate Path: Manual Entry & Carrier Search

When card read fails or carrier is unknown.

```mermaid
flowchart TD
    subgraph Triggers["Entry Points"]
        KVK_REJ(["KVK Rejected\nfrom CI-002"])
        UNKNOWN_IK(["Unknown IK\nfrom CI-005"])
        DISSOLVED(["Carrier Dissolved\nfrom CI-005"])
    end

    KVK_REJ ==>|"Manual transfer\n(KP2-102)"| MANUAL["CI-003: Manual Data Entry Form"]
    DISSOLVED -->|"Need new carrier"| MANUAL

    subgraph ManualEntry["Manual Entry States"]
        EMPTY["Empty Form\nFK 4131 = '00'\nFK 4132 = '00'\n(P2-401, P2-402)"]
        FILLING["Filling Fields\nPLZ Validation (P2-460)\nGender per PStG (P2-470)\nDMP Labels (P2-403)"]
        CARRIER_NEEDED["Carrier Search Required"]
        DEVIATION["Name/Address Deviation\nDocumentation (P2-558)"]
        VALIDATED["Validated\nSKT Fields (P2-440)\nBundeswehr Rules (P2-452)"]

        EMPTY ==>|"Start entry"| FILLING
        FILLING -->|"Need carrier"| CARRIER_NEEDED
        FILLING -.->|"Name differs\nfrom card"| DEVIATION
        DEVIATION --> FILLING
        FILLING ==>|"All fields valid"| VALIDATED
    end

    MANUAL ==> EMPTY

    CARRIER_NEEDED ==>|"Open search"| SEARCH["CI-004: Cost Carrier Search"]
    UNKNOWN_IK ==>|"Open search"| SEARCH

    subgraph CarrierSearch["Carrier Search States"]
        BY_IK["Search by IK\n(P2-410)"]
        BY_NAME["Search by Name/\nLocation/VKNR\n(P2-420)"]
        RESULTS{"Match\nFound?"}
        TEMP["Create Temporary\nRecord (P2-275)\n+ KV Contact Advisory\n(P2-270)"]

        BY_IK --> RESULTS
        BY_NAME --> RESULTS
        RESULTS ==>|"Yes"| SELECT["Select Carrier"]
        RESULTS -->|"No"| TEMP
        TEMP --> SELECT
    end

    SEARCH ==> BY_IK
    SEARCH --> BY_NAME

    SELECT -->|"Carrier assigned"| VALIDATED

    VALIDATED ==>|"Rejoin main flow"| FIELD_MAP["→ CI-002: Field Mapping\n(P2-105)"]
    FIELD_MAP ==> VSDM["→ CI-005: VSDM Verification"]
    VSDM ==> DONE(["→ CI-001: Routing"])
```

---

## 5. MFA — Insurance Change & Billing Splits

When insurance or status changes mid-quarter.

```mermaid
flowchart TD
    subgraph Triggers["Detection Points (from CI-005)"]
        INS_CHANGE(["Insurance Changed\nwithin Quarter\n(P2-530)"])
        STATUS_CHANGE(["Personengruppe /\nStatus Changed\n(P2-540)"])
        VSDM_CHANGE(["VSDM Data Changed\nMid-Quarter\n(KP2-557)"])
    end

    VSDM_CHANGE ==> AUTO_UPDATE["Auto-Update\nAffected Billing Records"]

    INS_CHANGE ==> SPLIT["CI-006: Billing Record Split Preview"]
    STATUS_CHANGE --> SPLIT

    subgraph SplitPreview["Split Preview States"]
        INS_SPLIT["Insurance Change Split\nOld Carrier → New Carrier\nProposed Split Date\n(P2-535)"]
        STATUS_SPLIT["Status Change Split\nAffected Records\nReclassification\n(P2-540)"]
        CONFIRM["Split Confirmed"]
        TIMELINE["Split Point Indicator"]

        INS_SPLIT --> TIMELINE
        STATUS_SPLIT --> TIMELINE
        TIMELINE ==>|"Staff confirms"| CONFIRM
    end

    SPLIT ==> INS_SPLIT
    SPLIT --> STATUS_SPLIT

    CONFIRM --> KASSEN{"Kassenwechsel +\nActive HZV/FAV\nTeilnahme?\n(VERT649)"}

    KASSEN -->|"Yes"| RE_ENROLL["CI-011: Re-Enrollment Notice"]
    KASSEN ==>|"No"| DONE(["Continue Check-In"])

    subgraph ReEnroll["Re-Enrollment States"]
        DETECTED["Insurance Change Detected\nOld Insurer → New Insurer"]
        REQUIRED["Re-Enrollment Required\nNew TE Needed under\nNew Insurer"]
        ACK["Notice Acknowledged\nFlagged for Follow-Up"]

        DETECTED ==> REQUIRED
        REQUIRED ==>|"Create TE action"| TE_LINK["→ Enrollment Declaration Form"]
        REQUIRED ==>|"Acknowledge"| ACK
    end

    RE_ENROLL ==> DETECTED
    ACK --> DONE
    AUTO_UPDATE --> DONE
```

---

## 6. MFA — Personengruppe & KTAB Gate

Special patient group handling during VSDM verification.

```mermaid
flowchart TD
    START(["Personengruppe\nDetected in CI-005"])

    START ==> PG_CHECK{"Besondere\nPersonengruppe?\n(FK 4131)"}

    PG_CHECK ==>|"'00' (Standard)"| PASS["No Action\n→ Continue CI-005"]

    PG_CHECK -->|"PG 09 (AsylbLG)"| ASYL["CI-007: AsylbLG\nRestriction Notice"]

    subgraph AsylState["AsylbLG Notice (P2-325)"]
        ASYL_BANNER["Informational Banner:\nRestricted Healthcare\nEntitlement under AsylbLG"]
        ASYL_BANNER -.->|"Acknowledged"| ASYL_CONTINUE["Continue with\nRestriction Flagged"]
    end
    ASYL ==> ASYL_BANNER

    PG_CHECK -->|"Other Special Group"| KTAB["CI-007: KTAB Selection"]

    subgraph KTABState["KTAB Selection (P2-320)"]
        SUGGEST["System Suggests KTAB\nbased on Person Group"]
        OVERRIDE["Staff Confirms\nor Overrides"]
        SUGGEST ==> OVERRIDE
    end
    KTAB ==> SUGGEST

    OVERRIDE --> KTAB_CHECK{"KTAB Status?\n(P2-285)"}
    KTAB_CHECK ==>|"Active"| VALID["KTAB Valid\n→ Continue CI-005"]
    KTAB_CHECK -->|"Dissolved"| BLOCK["Error: KTAB Dissolved\nProcessing Blocked"]

    ASYL_CONTINUE --> NEXT(["→ CI-005: Data Change Check"])
    VALID --> NEXT
```

---

## 7. Admin — Quarter Transition

System-level process at Quartalswechsel.

```mermaid
flowchart TD
    START(["Quartalswechsel\nDetected"])

    START ==> TRIGGER["CI-009: Quarter Transition Screen"]

    subgraph TransitionSteps["Transition Process"]
        CLOSURE["Close Current Quarter\n(P2-520)"]
        LIST["List Open Billing Cases"]
        REVIEW["Carry-Forward Preview\n(P2-521)"]
        INIT["Initialize New Quarter\n(P2-520)"]

        CLOSURE ==>|"Cases identified"| LIST
        LIST ==>|"Review carry-forward"| REVIEW
        REVIEW ==>|"Confirm"| INIT
    end

    TRIGGER ==> CLOSURE

    subgraph Progress["Components"]
        PROGRESS["Transition Progress Indicator:\nClosure → Carry-Forward → Init"]
        CASE_LIST["Carry-Forward Cases List:\nPatient, Record Type, Reason"]
    end

    INIT ==> DONE(["New Quarter Ready"])
```

---

## 8. Admin — Vollimport Matching

Bulk patient data import from PTV.

```mermaid
flowchart TD
    START(["Initiate Vollimport"])
    START ==> IMPORT["CI-010: Vollimport Matching Screen"]

    subgraph ImportFlow["Import States (VERT1878)"]
        PROGRESS["Import In Progress\nProcessing Records"]
        MATCH{"Match by\neGK-Nummer?"}
        AUTO["Auto-Transfer\nData from PTV"]
        NO_MATCH["No Match\nUser Prompt"]
        CONFLICT["Conflict Found\nSide-by-Side Comparison"]

        PROGRESS ==>|"Per patient"| MATCH
        MATCH ==>|"Unique match"| AUTO
        MATCH -->|"No match"| NO_MATCH
        MATCH -->|"Match + conflict"| CONFLICT
    end

    IMPORT ==> PROGRESS

    subgraph Resolution["Manual Resolution"]
        MATCH_EXISTING["Match to Existing Patient"]
        CREATE_NEW["Create New Patient"]
        SKIP["Skip Record"]
        SELECT_VALUES["Select Correct Values\nfrom PTV vs PVS"]
    end

    NO_MATCH --> MATCH_EXISTING
    NO_MATCH --> CREATE_NEW
    NO_MATCH --> SKIP
    CONFLICT --> SELECT_VALUES

    MATCH_EXISTING --> AUTO
    CREATE_NEW --> AUTO
    SELECT_VALUES --> AUTO

    AUTO ==> DONE(["Import Complete"])
```

---

## 9. Overview — Surface Navigation Map

How all 11 surfaces connect in the check-in workflow.

```mermaid
flowchart TD
    PATIENT(["Patient Arrives"])

    PATIENT ==> CI002["CI-002\nCard Read Screen"]
    CI002 -.->|"KVK rejected"| CI003["CI-003\nManual Data Entry"]
    CI003 -->|"Need carrier"| CI004["CI-004\nCost Carrier Search"]
    CI004 -->|"Carrier found"| CI003
    CI003 -->|"Rejoin"| CI002

    CI002 ==> CI005["CI-005\nVSDM Verification"]
    CI005 -.->|"Unknown IK"| CI004
    CI005 -.->|"Special group"| CI007["CI-007\nPersonengruppe Gate"]
    CI007 --> CI005
    CI005 -.->|"Insurance change"| CI006["CI-006\nSplit Preview"]
    CI006 --> CI005

    CI005 ==> CI001["CI-001\nCheck-In Routing"]

    CI001 -->|"HZV/FAV eligible"| CI008["CI-008\nHPM Status Display"]
    CI008 --> CI001

    CI001 -.->|"Kassenwechsel\n+ active HZV"| CI011["CI-011\nRe-Enrollment Notice"]

    CI001 ==> DONE(["Enter Documentation"])

    subgraph AdminFlows["Admin / System"]
        CI009["CI-009\nQuarter Transition"]
        CI010["CI-010\nVollimport Matching"]
    end

    style CI002 fill:#e3f2fd,stroke:#1565c0
    style CI005 fill:#e3f2fd,stroke:#1565c0
    style CI001 fill:#e3f2fd,stroke:#1565c0
    style CI003 fill:#fff3e0,stroke:#e65100
    style CI004 fill:#fff3e0,stroke:#e65100
    style CI007 fill:#fff3e0,stroke:#e65100
    style CI006 fill:#e8f5e9,stroke:#2e7d32
    style CI008 fill:#e8f5e9,stroke:#2e7d32
    style CI011 fill:#e8f5e9,stroke:#2e7d32
    style CI009 fill:#f3e5f5,stroke:#6a1b9a
    style CI010 fill:#f3e5f5,stroke:#6a1b9a
```

**Legend:**
- 🔵 Blue — Tier 1 foundation screens (daily, design-blocking)
- 🟠 Orange — Tier 3 gap-derived screens (manual fallbacks)
- 🟢 Green — Tier 2 supporting screens (conditional triggers)
- 🟣 Purple — Tier 4 admin screens (infrequent)
