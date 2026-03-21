---
Version: 2.0
Last Updated: 2026-03-19
Scope: Derived from FLOW260319-gpro-user-workflow-detail.md (6 user workflows)
---

# gPRO (TUI) Screen Inventory

**Source:** As-built from tini-works/pvs-base-1 (`ext/tui/`), derived from user workflows.
**Total Surfaces:** 12
**Placeholder Surfaces:** 2 (Documents, Settings)

> Screens are listed in the order they appear in the user journey — authentication first, then core workflow surfaces, then persistent layout and overlays.

---

## Summary

### By Role

| Role | Count |
|------|-------|
| All authenticated users | 12 |
| MFA (primary persona) | 12 |

> All 12 surfaces are accessible to any authenticated user. No role-gating is implemented in the current codebase.

### By Workflow

| Workflow | Screens |
|---|---|
| WF-1: Authentication & Session Setup | G001, G002 |
| WF-2: Select a Patient | G003 |
| WF-3: Select a Schein | G004 |
| WF-4: Browse Timeline Entries | G005 |
| WF-5: Create a Timeline Entry | G006 |
| WF-6: Logout | → G001 (re-uses auth overlay) |
| Persistent Layout (all workflows) | G007, G008, G009, G010 |
| Overlay (all workflows) | G011 |
| Not yet implemented | G012, G013 |

### By Implementation Status

| Status | Count | Surfaces |
|---|---|---|
| Active | 9 | G001–G011 (excl. G012, G013) |
| Placeholder | 2 | G012, G013 |

---

## WF-1: Authentication & Session Setup

### G001 — Auth Overlay

- **Parent Workflow:** WF-1 (Authentication & Session Setup), WF-6 (Logout)
- **Role:** All (pre-authentication)
- **Trigger:** App launch with no valid token; or after logout
- **Dismissal:** Automatically hidden when login callback is received

**Purpose:** Prompts the user to authenticate via browser-based OAuth login. Displays the local login URL and keyboard shortcuts to open or copy it.

**States:**

| State | Description |
|-------|-------------|
| Auth Required | Overlay appears, login URL displayed in a bordered box |
| Waiting for Callback | User has opened browser; app is listening on localhost:8888 |
| Login Successful | Token received; overlay dismissed automatically |
| Login Failed | Error shown; user can retry from the same URL |

**Key Actions:**

| Key | Action |
|-----|--------|
| `c` | Copy login URL to clipboard |
| `o` | Open login URL in default browser |
| `Esc` | Dismiss overlay (if already authenticated) |

---

### G002 — Home Page

- **Parent Workflow:** WF-1 (post-authentication landing)
- **Role:** All
- **Trigger:** Successful authentication; or pressing key `1` / selecting Home in sidebar

**Purpose:** Welcome screen. Confirms the session is active and provides navigation instructions. No data is loaded here.

**States:**

| State | Description |
|-------|-------------|
| Active | Displays welcome message and basic usage hints |

---

## WF-2: Select a Patient

### G003 — Patients List

- **Parent Workflow:** WF-2 (Select a Patient)
- **Role:** All
- **Trigger:** Key `2` or sidebar selection

**Purpose:** Browse and select a patient to set them as the active context for Scheins and Timeline entries.

**States:**

| State | Description |
|-------|-------------|
| Loading | Patient list is being fetched (spinner in OpStatus) |
| Populated | Table shows paginated patient rows |
| Empty | No patients returned from API |
| Error | API call failed; user re-navigates to retry |
| Patient Selected | Row shows ✓ marker; patient propagated to app context |
| Patient Deselected | ✓ removed; app context cleared |

**Columns:**

| Column | Content |
|--------|---------|
| (marker) | ✓ if selected |
| ID | 6-digit zero-padded patient number |
| Name | lastname, firstname · K/P · DOB · age · gender |
| Insurance | Insurance name |
| Insurance No. | Insurance number |
| Phone | Phone number |
| Address | Street, city |

**Key Actions:**

| Key | Action |
|-----|--------|
| `↑` / `↓` or `j` / `k` | Navigate rows |
| `Enter` | Select / deselect highlighted patient |
| `n` | Load next page |
| `p` | Load previous page |

---

## WF-3: Select a Schein

### G004 — Scheins List

- **Parent Workflow:** WF-3 (Select a Schein)
- **Role:** All
- **Trigger:** Key `3` or sidebar selection
- **Prerequisite:** Patient must be selected (G003)

**Purpose:** Browse and select a Schein (insurance billing record) for the active patient, scoping all subsequent timeline activity to that Schein.

**States:**

| State | Description |
|-------|-------------|
| No Patient | Prompt shown: "Select a patient first" — no API call |
| Loading | Scheins are being fetched for the active patient |
| Populated | Table shows Schein rows for the selected patient |
| Empty | No Scheins for this patient |
| Error | API call failed |
| Schein Selected | Row shows ✓ marker; Schein propagated to app context; QuickEntry enabled |
| Schein Deselected | ✓ removed; QuickEntry disabled |
| Auto-Reloaded | Patient changed elsewhere → list reloads automatically for new patient |

**Columns:**

| Column | Content |
|--------|---------|
| (marker) | ✓ if selected |
| Type | KV · BG · Private · HZV · FAV · IGEL |
| Treatment Case | Outpatient · Referral · Hospital · Emergency · BG · Private |
| Quarter | Q#/YYYY |
| Created | DD.MM.YYYY |
| Status | Normal · Printed · Billed · Cancelled |
| Billed | Yes / No |

**Key Actions:**

| Key | Action |
|-----|--------|
| `↑` / `↓` or `j` / `k` | Navigate rows |
| `Enter` | Select / deselect highlighted Schein |

---

## WF-4: Browse Timeline Entries

 
## WF-5: Create a Timeline Entry

### G006 — QuickEntry Component

- **Parent Workflow:** WF-5 (Create a Timeline Entry)
- **Role:** All
- **Trigger:** Press `:` while on G005 (Timeline View)
- **Prerequisite:** Patient AND Schein must be selected
- **Location:** Renders at the bottom of G005 (not a separate page)

**Purpose:** Inline input component for creating clinical timeline entries using prefixed commands. Supports ICD-10 diagnosis search, EBM service search, and freetext notes.

**States:**

| State | Description |
|-------|-------------|
| Open — Idle | Input prompt active, awaiting prefix |
| Diagnosis Mode (`d:`) | User typing ICD code or term; suggestion list appears |
| Service Mode (`s:`) | User typing EBM GNR code or term; suggestion list appears |
| Note Mode (`n:`) | Freetext entry; no search, no suggestions |
| Suggestions Shown | Up to 10 results listed above input |
| Submitting | Entry being sent to backend |
| Submit Success | Entry saved; QuickEntry clears; timeline reloads |
| Submit Error | Error shown inline in input bar; input preserved |
| Closed | Dismissed with `Esc` |

**Input Prefixes:**

| Prefix | Mode | Search Source |
|--------|------|---------------|
| `d:` or `diag:` | Diagnosis | ICD-10-GM catalog |
| `s:` or `service:` | Service | EBM catalog |
| `n:` or `note:` | Freetext Note | None |

**Key Actions:**

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate suggestion list |
| `Tab` | Autocomplete selected suggestion into input |
| `Enter` | Submit the current entry |
| `Esc` | Close QuickEntry, return to timeline |

---

## Persistent Layout Surfaces

These surfaces are always visible during an active session. They are not pages — they cannot be navigated to directly.

### G007 — Sidebar / Navigation Rail

- **Parent Workflow:** All (persistent)
- **Role:** All

**Purpose:** Primary navigation. Lists all pages and a logout action. Reflects the currently active page.

**Navigation Items:**

| Item | Key | Target |
|------|-----|--------|
| Home | `1` | G002 |
| Patients | `2` | G003 |
| Scheins | `3` | G004 |
| Timelines | `4` | G005 |
| Documents | `5` | G012 |
| Settings | — | G013 |
| Logout | — | WF-6 |

**States:** Focused (blue border) / Unfocused (dim border) / Item highlighted.

---

### G008 — Operation Status Panel

- **Parent Workflow:** All (persistent)
- **Role:** All

**Purpose:** Always-visible panel showing backend connection health, the active user session, and the currently selected patient and Schein context.

**Displayed Information:**

| Section | Content |
|---------|---------|
| NATS Connection | Status indicator (connecting / connected / error) |
| Auth Session | Current user |
| Active Patient | `▶ Patient: name (#ID)` — hidden when none selected |
| Active Schein | `▶ Schein: Type - Case (Q#/YYYY)` — hidden when none selected |
| Recent Operations | Up to 5 most recent API operations with status and latency |

**Operation Status Icons:**

| Icon | Meaning |
|------|---------|
| `◐` | Loading / in progress |
| `✓` | Success |
| `✗` | Error |

---

### G009 — Status Bar

- **Parent Workflow:** All (persistent)
- **Role:** All

**Purpose:** Bottom-of-screen bar showing connection status and short contextual messages (e.g., confirmation of selection, error summaries).

---

### G010 — Log Window

- **Parent Workflow:** All (persistent)
- **Role:** All

**Purpose:** Scrollable panel showing real-time application logs (debug, info, warning, error). Useful for diagnosing connection or API issues.

**States:** Auto-scroll active / Manual browse / Cleared.

**Key Actions:**

| Key | Action |
|-----|--------|
| `g` | Jump to top (enables manual browse) |
| `G` | Jump to bottom (resumes auto-scroll) |
| `c` | Clear all log entries |
| `j` / `k`, `PgUp` / `PgDn` | Navigate when in manual browse mode |

---

## Overlay Surfaces

### G011 — Help Modal

- **Parent Workflow:** All (overlay)
- **Role:** All
- **Trigger:** Press `?` from anywhere

**Purpose:** Full-screen overlay listing all keyboard shortcuts, organized by context. Also includes the recommended workflow sequence.

**Sections:**

| Section | Content |
|---------|---------|
| Global Navigation | Page keys 1–5, Tab, directional focus, `?`, `q` |
| Sidebar | `j`/`k`, `Enter` |
| Patients Page | `j`/`k`, `Enter`, `n`/`p` (pagination) |
| Scheins Page | `j`/`k`, `Enter` · requires patient selection |
| Timelines Page | `j`/`k`, `Enter`, `:`, `r` · requires patient + schein |
| QuickEntry | `s:`, `d:`, `n:` prefixes · `Tab`, `↑`/`↓`, `Enter`, `Esc` |
| Authentication | `c` (copy URL), `o` (open browser) |
| Basic Workflow | 1. Select Patient → 2. Select Schein → 3. Browse Timeline → 4. Add Entry |

**Dismissal:** `Esc`, `q`, or `?`.

---

## Not Yet Implemented

### G012 — Documents Page (Placeholder)

- **Parent Workflow:** — (not yet mapped to a workflow)
- **Role:** All
- **Trigger:** Key `5` or sidebar selection
- **Status:** Placeholder only — displays "Document browser will appear here"

---

### G013 — Settings Page (Placeholder)

- **Parent Workflow:** — (not yet mapped to a workflow)
- **Role:** All
- **Trigger:** Sidebar selection
- **Status:** Placeholder only — displays "Settings will appear here"
