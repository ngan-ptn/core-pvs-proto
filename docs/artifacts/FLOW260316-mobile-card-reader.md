# Mobile Card Reader - Inventory

**Version:** 1.0.0
**Last Updated:** 2026-03-16 by Ngan

## V2

V2 appears to inherit the core V1 structure and extend it for the `Create schein for mixed insurance patients` scenario.

### What's New/Modified In V2

- `🆕 New` introduces an `Insurance selection dialog` as a distinct decision step
- `🆕 New` introduces a `Create insurance drawer` when an existing insurance option is not suitable
- `✏️ Modified` adds a mixed-insurance-specific branch instead of staying only in the base card-reader flow
- `✏️ Modified` adds a return step back into the main create-schein process after insurance handling
- `✏️ Modified` shifts the focus from general card-reader management to scenario-specific insurance handling for patient creation
- `⚪ Unchanged` keeps the shared `Mobile card reader overview` pattern, but uses it as the entry point for this specialized case

### User Flow

**Date:** 2026-03-16
**Scope:** Create schein for mixed insurance patients
**Status:** Aspirational, inferred from current Figma flow metadata
**Legend:** 🆕 New · ✏️ Modified · ⚪ Unchanged · 🔵 Info/Reference

```mermaid
flowchart TD
    START2([Start flow])
    END2([Continue create schein])

    subgraph MAIN2["Main flow"]
        subgraph BASE2["Inherited from V1 base flow"]
            MCR2_010["MCR2_010 Mobile card reader overview"]
        end

        subgraph DELTA2["New / Modified in V2"]
            MCR2_020["MCR2_020 Insurance selection dialog"]
            MCR2_DECISION{"Need new insurance?"}
            MCR2_030["MCR2_030 Create insurance drawer"]
            MCR2_040["MCR2_040 Return to mixed insurance patient flow"]
        end
    end

    subgraph ACTIONS2["Related user actions"]
        ACT2_010(["Inherited from V1 pattern: View records / Start flow / Open related actions"])
        ACT2_020(["New in V2: Review insurance options / Select existing insurance / Choose to create new insurance"])
        ACT2_030(["New in V2: Enter insurance details / Add address and contact information / Save insurance"])
        ACT2_040(["Modified in V2: Review updated state / Continue creating schein"])
    end

    START2 -->|"Open mixed insurance patient flow"| MCR2_010
    MCR2_010 -->|"Choose insurance handling"| MCR2_020
    MCR2_020 -->|"Check available option"| MCR2_DECISION
    MCR2_DECISION -->|"No"| END2
    MCR2_DECISION -->|"Yes"| MCR2_030
    MCR2_030 -->|"Save new insurance"| MCR2_040
    MCR2_040 -->|"Continue create schein"| END2

    MCR2_010 -.-> ACT2_010
    MCR2_020 -.-> ACT2_020
    MCR2_030 -.-> ACT2_030
    MCR2_040 -.-> ACT2_040

    classDef new fill:#d4edda,stroke:#7aa874,color:#1f3b24;
    classDef modified fill:#fff3cd,stroke:#c9a227,color:#5c4400;
    classDef unchanged fill:#ffffff,stroke:#9aa0a6,color:#1f2933;
    classDef info fill:#d1ecf1,stroke:#6ea8b3,color:#0c3c44;

    class MCR2_020,MCR2_DECISION,MCR2_030 new;
    class MCR2_040 modified;
    class MCR2_010 unchanged;
    class ACT2_010,ACT2_020,ACT2_030,ACT2_040 info;

    click MCR2_010 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v2-mcr2_010-mobile-card-reader-overview.png" "Open screenshot"
    click MCR2_020 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v2-mcr2_020-insurance-selection-dialog.png" "Open screenshot"
    click MCR2_DECISION "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v2-mcr2_decision-need-new-insurance.png" "Open screenshot"
    click MCR2_030 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v2-mcr2_030-create-insurance-drawer.png" "Open screenshot"
    click MCR2_040 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v2-mcr2_040-return-to-mixed-insurance-flow.png" "Open screenshot"
```

### Product Flow

1. A user opens the mixed-insurance-patient scenario from the mobile card reader flow.
2. The app shows the relevant patient or history context for the selected case.
3. The user chooses how to handle insurance information.
4. If an existing insurance option works, the user selects it and continues.
5. If a new insurance record is needed, the user opens the create-insurance form and enters the required information.
6. After saving or selecting insurance, the user returns to the flow and continues creating the schein.

### Main Screens Or Major UI States

1. `Mobile card reader overview`

This is the entry screen for the mixed-insurance-patient scenario. It gives the user the record context and a way to begin the next step.

The user can:

- review history rows or record states
- start the mixed-insurance-patient flow
- open related actions from the record area
- move into the create-schein process

2. `Insurance selection dialog`

This is a choice screen where the user decides which insurance should be used for the current patient.

The user can:

- review available insurance options
- select an existing insurance option
- choose to create a new insurance entry instead
- confirm or cancel the selection step

3. `Create insurance drawer`

This is a form state for creating a new insurance entry when an existing option is not suitable.

The user can:

- enter insurance details
- add address information
- add contact-related information
- save the new insurance entry or leave the form

4. `Return to mixed insurance patient flow`

This is the follow-up state after insurance handling is complete. It brings the user back to the main process so they can continue.

The user can:

- review the updated state after insurance selection or creation
- confirm that the insurance step is complete
- continue creating the schein

## V1

### User Flow

**Date:** 2026-03-16
**Scope:** Mobile Card Reader flow from overview to patient update validation
**Status:** Aspirational, inferred from current Figma flow

```mermaid
flowchart TD
    START([Start flow])
    END([Continue patient creation or update])

    subgraph MAIN["Main flow"]
        MCR_010["MCR_010 Mobile card reader overview"]
        MCR_020["MCR_020 Card information"]
        MCR_030["MCR_030 Update patient details"]
        MCR_DECISION{"Patient data matches?"}
        MCR_040["MCR_040 Errors to be resolved before create patient"]
    end

    subgraph ACTIONS["Related user actions"]
        ACT_010(["View records / Create record / Open row actions / Navigate admin"])
        ACT_020(["Inspect card details / Review hidden fields / Confirm selected record"])
        ACT_030(["Compare card data / Edit patient details / Decide how to handle mismatch"])
        ACT_040(["Review errors / Correct issues / Go back and update form"])
    end

    START -->|"Open Mobile card reader"| MCR_010
    MCR_010 -->|"Open selected record"| MCR_020
    MCR_020 -->|"Continue to patient update"| MCR_030
    MCR_030 -->|"Check patient data"| MCR_DECISION
    MCR_DECISION -->|"Yes"| END
    MCR_DECISION -->|"No"| MCR_040
    MCR_040 -->|"Fix issues and retry"| MCR_030

    MCR_010 -.-> ACT_010
    MCR_020 -.-> ACT_020
    MCR_030 -.-> ACT_030
    MCR_040 -.-> ACT_040

    click MCR_010 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v1-mcr_010-mobile-card-reader-overview.png" "Open screenshot"
    click MCR_020 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v1-mcr_020-card-information.png" "Open screenshot"
    click MCR_030 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v1-mcr_030-update-patient-details.png" "Open screenshot"
    click MCR_DECISION "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v1-mcr_decision-patient-data-matches.png" "Open screenshot"
    click MCR_040 "/Users/nganpham/core-pvs-proto/docs/screenshots/FLOW260316-mobile-card-reader/v1-mcr_040-errors-before-create-patient.png" "Open screenshot"
```

### Product Flow

1. A user sees card-reader records in a main overview.
2. They open one record to inspect card information.
3. The app compares the card data against existing patient data.
4. If everything matches, the user can continue normally.
5. If some things conflict, the app shows comparison screens and prompts the user to choose or correct data.
6. If required information is invalid or missing, the app blocks progress and shows error states until the data is fixed.

### Main Screens/Major UI States

1. `Mobile card reader overview`

This is the main management screen for card-reader records. It helps the user see what already exists and start the next action.

The user can:

- see existing card-reader records in a table
- scan key information for each record
- create a new record with the plus button
- open row actions for a specific record
- move to other admin sections from the left navigation

2. `Card information`

This is the detail screen for one selected record. It lets the user look more closely at the information related to that card or patient card entry.

The user can:

- inspect detailed information for the selected card
- review fields that are not visible in the overview table
- confirm whether the selected record looks correct
- continue into follow-up actions or related workflows

3. `Update patient details`

This is a workflow screen where the user compares card data with patient data and updates the patient profile when needed.

The user can:

- compare information from the card with existing patient information
- edit or update patient details
- decide how to handle mismatched information
- continue the patient creation or update flow

4. `Errors to be resolved before create patient`

This is a blocking validation state. The system is telling the user that some required information must be fixed before a patient can be created.

The user can:

- review which fields or sections have errors
- correct missing or conflicting information
- go back through the form and make changes
- continue only after the errors are resolved
