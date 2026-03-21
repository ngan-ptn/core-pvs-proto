---
Version: 2.0
Last Updated: 2026-03-19
Scope: As-built from codebase analysis of tini-works/pvs-base-1 (ext/tui/)
---

# gPRO (TUI) User Workflow Diagrams

Derived from the gPRO TUI codebase (tini-works/pvs-base-1). Each diagram shows **user goals → steps → decision points → outcomes**. Screens (IA260319-gpro-screen-inventory.md) are derived from these workflows.

**Convention:** `==>` primary/happy path. `-->` alternate path. `-.->` edge case / optional.

---

## Workflow Index

| # | Workflow | Trigger | Role | Screens Required |
|---|---|---|---|---|
| WF-1 | Authentication & Session Setup | App launch, no valid token | All | G001, G002 |
| WF-2 | Select a Patient | User navigates to Patients page | All | G003 |
| WF-3 | Select a Schein | User navigates to Scheins page | All | G004 |
| WF-4 | Browse Timeline Entries | User navigates to Timelines page | All | G005 |
| WF-5 | Create a Timeline Entry | User opens QuickEntry (`:` key) | All | G005, G006 |
| WF-6 | Logout | User triggers Logout from sidebar | All | G001 |

---

## WF-1 — Authentication & Session Setup

**Goal:** Establish a valid, authenticated session so the user can access patient data.

```mermaid
flowchart TD
    START(["Launch gPRO"])
    START ==>|"Load config"| CONN["Connect to Backend"]

    CONN --> CONN_RESULT{"Connection\nSuccessful?"}
    CONN_RESULT -->|"Failed"| CONN_ERR["Connection Error\n(retry shown)"]
    CONN_ERR -.->|"Auto-retry"| CONN

    CONN_RESULT ==>|"Connected"| AUTH_CHECK{"Valid Token\nFound?"}

    AUTH_CHECK -->|"No"| AUTH_SCREEN["G001: Auth Overlay\n(login URL displayed)"]
    AUTH_CHECK ==>|"Yes"| PROFILE["Resolve User Profile"]

    subgraph LoginFlow["G001: Login States"]
        URL_SHOWN["Login URL Displayed"]
        USER_ACTION["User Opens URL in Browser"]
        WAITING["Waiting for Login Callback"]
        LOGIN_OK["Login Successful"]
        LOGIN_FAIL["Login Failed"]

        URL_SHOWN ==>|"User opens browser"| USER_ACTION
        URL_SHOWN -->|"c: copy URL"| USER_ACTION
        USER_ACTION ==> WAITING
        WAITING ==>|"Callback received"| LOGIN_OK
        WAITING -->|"Error / timeout"| LOGIN_FAIL
        LOGIN_FAIL -.->|"User retries"| URL_SHOWN
    end

    AUTH_SCREEN ==> URL_SHOWN
    LOGIN_OK ==> PROFILE

    subgraph ProfileLoad["G002: Profile Resolution States"]
        RESOLVING["Resolving User Identity"]
        RESOLVED["Identity Confirmed"]
        LOAD_PROF["Loading User Profile"]
        PROF_READY["Profile Ready"]
        PROF_ERR["Resolution Failed"]

        RESOLVING ==>|"Identity found"| RESOLVED
        RESOLVING -->|"Not found"| PROF_ERR
        RESOLVED ==> LOAD_PROF
        LOAD_PROF ==>|"Success"| PROF_READY
        LOAD_PROF -->|"Error"| PROF_ERR
    end

    PROFILE ==> RESOLVING
    PROF_READY ==> READY(["Session Ready\n→ G002: Home Page"])
```

---

## WF-2 — Select a Patient

**Goal:** Set a patient in context so Scheins and Timeline entries can be loaded for them.

```mermaid
flowchart TD
    START(["Navigate to Patients\n(key 2 or sidebar)"])
    START ==> LOAD["Load Patient List\n(paginated, 20 per page)"]

    LOAD --> LOAD_RESULT{"Load\nSuccessful?"}
    LOAD_RESULT ==>|"Patients found"| TABLE["G003: Patients List\n(table with rows)"]
    LOAD_RESULT -->|"Empty"| EMPTY["No Patients Found"]
    LOAD_RESULT -->|"Error"| ERR["Load Error\n(re-navigate to retry)"]

    subgraph Browse["Browse & Paginate"]
        SCROLL["Scroll rows (↑/↓)"]
        NEXT_PAGE["Next page (n)"]
        PREV_PAGE["Previous page (p)"]
    end

    TABLE ==> SCROLL

    SCROLL ==>|"Enter"| SELECT_CHECK{"Already\nSelected?"}
    SELECT_CHECK ==>|"No"| SELECT["Set as Active Patient\n(✓ marker shown)"]
    SELECT_CHECK -->|"Yes"| DESELECT["Deselect Patient\n(✓ removed)"]

    SELECT ==> CONTEXT["Patient in Context:\n• Schein selection cleared\n• Scheins page queued to reload\n• Timeline page queued to reload"]

    CONTEXT ==> DONE(["Patient Selected\n→ Ready for WF-3"])

    TABLE --> NEXT_PAGE
    TABLE --> PREV_PAGE
    NEXT_PAGE --> TABLE
    PREV_PAGE --> TABLE
```

---

## WF-3 — Select a Schein

**Goal:** Set a Schein in context so Timeline entries can be scoped to the correct billing record.

```mermaid
flowchart TD
    START(["Navigate to Scheins\n(key 3 or sidebar)"])
    START ==> PREREQ{"Patient\nSelected?"}

    PREREQ -->|"No"| NO_PAT["Prompt: Select a patient first\n(no data loads)"]
    NO_PAT -.->|"User goes to Patients page"| WF2["→ WF-2: Select a Patient"]

    PREREQ ==>|"Yes"| LOAD["Load Scheins for Active Patient"]

    LOAD --> LOAD_RESULT{"Load\nSuccessful?"}
    LOAD_RESULT ==>|"Scheins found"| TABLE["G004: Scheins List\n(table with rows)"]
    LOAD_RESULT -->|"Empty"| EMPTY["No Scheins for This Patient"]
    LOAD_RESULT -->|"Error"| ERR["Load Error"]

    subgraph ScheinRow["Each Row Shows"]
        TYPE["Type: KV | BG | Private | HZV | FAV | IGEL"]
        CASE["Treatment Case: Outpatient | Referral | Emergency | etc."]
        QUARTER["Quarter: Q#/YYYY"]
        STATUS["Status: Normal | Printed | Billed | Cancelled"]
    end

    TABLE ==> SCROLL["Scroll rows (↑/↓)"]

    SCROLL ==>|"Enter"| SELECT_CHECK{"Already\nSelected?"}
    SELECT_CHECK ==>|"No"| SELECT["Set as Active Schein\n(✓ marker shown)"]
    SELECT_CHECK -->|"Yes"| DESELECT["Deselect Schein\n(✓ removed)"]

    SELECT ==> CONTEXT["Schein in Context:\n• Timeline page queued to reload\n• QuickEntry now enabled"]

    CONTEXT ==> DONE(["Schein Selected\n→ Ready for WF-4 / WF-5"])

    subgraph AutoReload["Auto-Reload Trigger"]
        PAT_CHANGED["Patient Changed → Reload Scheins\nfor New Patient Automatically"]
        PAT_CLEARED["Patient Cleared → Clear Schein Table\n+ Clear Active Schein"]
    end
```

---

## WF-4 — Browse Timeline Entries

**Goal:** Review the clinical history for the active patient and schein.

```mermaid
flowchart TD
    START(["Navigate to Timelines\n(key 4 or sidebar)"])
    START ==> PREREQ{"Patient +\nSchein Selected?"}

    PREREQ -->|"No"| NO_PREREQ["Prompt: Select a patient\nand schein first"]
    NO_PREREQ -.->|"User completes WF-2/WF-3"| START

    PREREQ ==>|"Yes"| LOAD["Load Timeline Entries\n(2 quarters per page)"]

    LOAD --> LOAD_RESULT{"Load\nSuccessful?"}
    LOAD_RESULT ==>|"Entries found"| TABLE["G005: Timeline View\n(date | type | description | quarter)"]
    LOAD_RESULT -->|"Empty"| EMPTY["No Entries for This Patient/Schein"]
    LOAD_RESULT -->|"Error"| ERR["Load Error\n(press r to reload)"]

    TABLE ==> SCROLL["Scroll rows (↑/↓)"]

    SCROLL ==>|"Enter"| DETAIL["View Entry Detail\n(detail panel opens)"]
    DETAIL -->|"Esc"| SCROLL

    subgraph InfiniteScroll["Infinite Scroll"]
        AT_BOTTOM["User Scrolls to Bottom"]
        LOAD_MORE["Load Older Entries\n(next page appended)"]
        ALL_LOADED["All Entries Loaded\n(no more pages)"]

        AT_BOTTOM ==>|"More pages"| LOAD_MORE
        AT_BOTTOM -->|"Last page"| ALL_LOADED
        LOAD_MORE ==> SCROLL
    end

    SCROLL --> AT_BOTTOM

    TABLE -->|"r"| RELOAD["Reload from Page 1\n(clears + refetches)"]
    RELOAD ==> TABLE

    TABLE ==>|":"| QE["Open QuickEntry\n→ WF-5"]
```

---

## WF-5 — Create a Timeline Entry

**Goal:** Document a clinical event (diagnosis, service, or note) against the active patient and schein.

**Prerequisite:** Patient selected (WF-2) AND Schein selected (WF-3).

```mermaid
flowchart TD
    START(["Press ':' on\nTimelines Page (G005)"])
    START ==> QE_OPEN["G006: QuickEntry Input\n(opens at bottom of screen)"]

    QE_OPEN ==> PREFIX{"Type Prefix"}

    PREFIX ==>|"d: or diag:"| DIAG["Diagnosis Search Mode\n(ICD-10)"]
    PREFIX -->|"s: or service:"| SVC["Service Search Mode\n(EBM)"]
    PREFIX -->|"n: or note:"| NOTE["Freetext Note Mode"]
    PREFIX -->|"Esc"| CANCEL(["QuickEntry Closed\n→ Return to Timeline"])

    subgraph DiagSearch["Diagnosis Search (ICD-10)"]
        D_TYPE["User types ICD code or term\n(e.g. d:J06)"]
        D_RESULTS["Suggestions appear\n(code + description, up to 10)"]
        D_NAV["Navigate with ↑/↓"]
        D_SELECT["Tab: autocomplete input\nEnter: submit selected"]

        D_TYPE ==>|"Debounced search"| D_RESULTS
        D_RESULTS ==> D_NAV
        D_NAV ==> D_SELECT
    end

    DIAG ==> D_TYPE

    subgraph SvcSearch["Service Search (EBM)"]
        S_TYPE["User types GNR code or term\n(e.g. s:01100)"]
        S_RESULTS["Suggestions appear\n(code + service name, up to 10)"]
        S_NAV["Navigate with ↑/↓"]
        S_SELECT["Tab: autocomplete input\nEnter: submit selected"]

        S_TYPE ==>|"Debounced search"| S_RESULTS
        S_RESULTS ==> S_NAV
        S_NAV ==> S_SELECT
    end

    SVC ==> S_TYPE

    NOTE ==>|"Enter"| SUBMIT

    D_SELECT ==>|"Enter"| SUBMIT["Submit Entry to Backend"]
    S_SELECT ==>|"Enter"| SUBMIT

    SUBMIT --> SUBMIT_RESULT{"Saved\nSuccessfully?"}
    SUBMIT_RESULT ==>|"Success"| RELOAD["Timeline Reloads\n(new entry visible)"]
    SUBMIT_RESULT -->|"Error"| QE_ERR["Error shown in QuickEntry bar\n(input preserved)"]
    QE_ERR -.->|"User edits and retries"| QE_OPEN

    RELOAD ==> DONE(["Entry Created\nQuickEntry clears,\nstays open for next entry"])
    DONE -.->|"Add another"| QE_OPEN
    DONE -->|"Esc"| CLOSE(["QuickEntry Closed\n→ Return to Timeline"])
```

---

## WF-6 — Logout

**Goal:** End the current session and return the app to the login state.

```mermaid
flowchart TD
    START(["Select 'Logout'\nfrom Sidebar"])

    START ==> CLEAR_TOKEN["Clear Access Token\n+ User Credentials"]
    CLEAR_TOKEN ==> CLEAR_STATE["Clear Active Context:\n• Selected Patient removed\n• Selected Schein removed\n• All page data cleared"]
    CLEAR_STATE ==> RESET["Return to Home Page"]
    RESET ==> SHOW_AUTH["G001: Auth Overlay Appears\n(new login required)"]
    SHOW_AUTH ==> WAITING(["Waiting for\nNew Authentication\n→ WF-1"])
```

---

## End-to-End — Full Clinical Documentation Session

```mermaid
flowchart TD
    START(["Launch gPRO"])

    subgraph Auth["WF-1: Authenticate"]
        A1["Check for valid token"]
        A2{"Token valid?"}
        A3["G001: Auth Overlay → Login via browser"]
        A4["G002: Home Page"]
        A1 ==> A2
        A2 -->|"No"| A3
        A2 ==>|"Yes"| A4
        A3 ==>|"Login success"| A4
    end

    subgraph SelectPat["WF-2: Select Patient"]
        B1["G003: Patients List (key 2)"]
        B2["Browse list → Enter to select"]
        B1 ==> B2
    end

    subgraph SelectSchein["WF-3: Select Schein"]
        C1["G004: Scheins List (key 3)"]
        C2["Browse list → Enter to select"]
        C1 ==> C2
    end

    subgraph Document["WF-4 + WF-5: Review & Document"]
        D1["G005: Timeline View (key 4)"]
        D2["Browse entries (↑/↓, infinite scroll)"]
        D3["Open QuickEntry (:)"]
        D4["G006: Add diagnosis (d:), service (s:), or note (n:)"]
        D5["Submit → Timeline reloads"]
        D1 ==> D2
        D2 ==>|":"| D3
        D3 ==> D4 ==> D5 ==> D2
    end

    START ==> A1
    A4 ==> B1
    B2 ==> C1
    C2 ==> D1

    D2 -->|"Done"| END{"End Session?"}
    END -->|"New patient"| B1
    END -->|"WF-6: Logout"| LOGOUT["Sidebar → Logout → G001: Auth Overlay"]
    END ==>|"Quit"| QUIT(["q / Ctrl+C → Exit"])
```
