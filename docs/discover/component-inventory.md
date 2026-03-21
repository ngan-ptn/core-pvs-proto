# Component Inventory — Clinic Check-In System

Reusable UI components across all surfaces (kiosk, mobile, receptionist dashboard). Each component is specified with its variants, states, and usage context.

---

## 1. Status Badges

| Trace | Link |
|-------|------|
| Traced from | [US-002](../product/user-stories.md#us-002-receptionist-sees-confirmed-check-in-data), [US-008](../product/user-stories.md#us-008-receptionist-visibility-of-mobile-check-ins), [BUG-001](../product/user-stories.md#bug-001-kiosk-confirmation-not-syncing-to-receptionist-screen) |
| Matched by | [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-001](../architecture/adrs.md#adr-001-websocket-with-polling-fallback-for-real-time-dashboard-updates) |
| Proven by | [TC-201](../quality/test-suites.md#tc-201-successful-sync--green-checkmark), [TC-204](../quality/test-suites.md#tc-204-dashboard-real-time-update--websocket-push), [TC-1103](../quality/test-suites.md#tc-1103-color-independent-status-indication) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-22 |

Used on the receptionist dashboard and patient detail panels to communicate check-in state.

| Variant | Label | Background | Text/Icon Color | Icon | Usage |
|---------|-------|-----------|----------------|------|-------|
| Checked In | "Checked In" | Green (#E8F5E9) | Dark green (#2E7D32) | ✓ checkmark | Patient has completed check-in |
| In Progress | "In Progress" | Yellow (#FFF8E1) | Dark amber (#F57F17) | ◐ half-circle | Check-in started, not completed |
| Syncing | "Syncing..." | Blue (#E3F2FD) | Blue (#1565C0) | Animated spinner | Data in transit from kiosk (BUG-001) |
| Not Checked In | "Not Checked In" | Gray (#F5F5F5) | Gray (#757575) | — dash | No check-in activity |
| Failed | "Check-In Failed" | Red (#FFEBEE) | Red (#C62828) | ✗ cross | Check-in error |
| Mobile Complete | "Mobile" | Green (#E8F5E9) | Dark green (#2E7D32) | ✓ + phone icon | Completed via mobile |
| Mobile Partial | "Mobile — Partial" | Yellow (#FFF8E1) | Dark amber (#F57F17) | ◐ + phone icon | Started on mobile, not finished |

**Size:** Pill shape. Padding: 4px 12px. Font: 12px semibold. Border-radius: 12px.

**Accessibility:** Always includes both icon and text. Color alone is never the differentiator.

---

## 2. Progress Indicator

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [E1](../product/epics.md#e1-returning-patient-recognition), [E2](../product/epics.md#e2-mobile-check-in) |
| Matched by | [PATCH /checkins/{id}/progress](../architecture/api-spec.md#patch-checkinsidprogress) |
| Proven by | [TC-101](../quality/test-suites.md#tc-101-returning-patient--happy-path-check-in), [TC-401](../quality/test-suites.md#tc-401-mobile-check-in--happy-path) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Shows the patient where they are in the check-in flow.

### Kiosk Variant
Horizontal stepper at the top of each review screen.

```
[1 Demographics] ─── [2 Insurance] ─── [3 Allergies] ─── [4 Medications] ─── [5 Confirm]
     ●                    ●                 ○                  ○                  ○
   (done)              (current)         (upcoming)
```

- Completed steps: filled circle + blue label
- Current step: filled circle + bold label + subtle background highlight
- Upcoming steps: outlined circle + gray label
- Steps are connected by a horizontal line (blue for completed segments, gray for upcoming)

### Mobile Variant
Simplified dot indicator (space-constrained).

```
● ● ○ ○ ○
```

- Filled dot = completed or current
- Outlined dot = upcoming
- Current step name shown as text below the dots: "Insurance"

---

## 3. Editable Section Card

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-011](../product/user-stories.md#us-011-photo-capture-of-insurance-card), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid), [GET /patients/{id}/insurance/{type}/photo/status/{processing_id}](../architecture/api-spec.md#get-patientsidinsurancetypephotostatusprocessing_id) |
| Proven by | [TC-102](../quality/test-suites.md#tc-102-returning-patient--edit-demographics-during-check-in), [TC-801](../quality/test-suites.md#tc-801-photo-capture--happy-path-on-kiosk) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

The primary pattern for displaying and editing patient data on review screens.

### Read-Only State
```
┌──────────────────────────────────────────┐
│ Full Name                          Edit  │
│ Sarah M. Johnson                         │
├──────────────────────────────────────────┤
│ Date of Birth                      Edit  │
│ March 15, 1982                           │
└──────────────────────────────────────────┘
```

- Section label: 14px, gray (#757575), uppercase or small caps
- Value: 18px (kiosk) / 16px (mobile), black
- Edit link: 14px, blue (#1565C0), right-aligned

### Editing State
```
┌──────────────────────────────────────────┐
│ Full Name                                │
│ ┌────────────────────────────────────┐   │
│ │ Sarah M. Johnson                   │   │
│ └────────────────────────────────────┘   │
│                                          │
│             [Save]  [Cancel]             │
└──────────────────────────────────────────┘
```

- Input field: standard text input with border
- Save: primary button (small)
- Cancel: text link

### Validation Error State
```
┌──────────────────────────────────────────┐
│ Phone                                    │
│ ┌────────────────────────────────────┐   │
│ │ 555-abc-defg          (red border) │   │
│ └────────────────────────────────────┘   │
│ Please enter a valid phone number (red)  │
│                                          │
│             [Save]  [Cancel]             │
└──────────────────────────────────────────┘
```

### OCR-Derived State (Insurance, post-Round 8)
```
┌──────────────────────────────────────────┐
│ Member ID                    (blue bg)   │
│ ABC123456789                             │
│ ⓘ Read from your insurance card          │
└──────────────────────────────────────────┘
```

- Blue background (#E3F2FD) indicates OCR-extracted value
- Info text in small gray font

### OCR Low-Confidence State
```
┌──────────────────────────────────────────┐
│ Group Number               (yellow bg)   │
│ 8827?3                                   │
│ ⚠ Please verify — we weren't sure        │
└──────────────────────────────────────────┘
```

- Yellow background (#FFF8E1) indicates uncertainty
- Warning icon + help text

---

## 4. Medication Card

| Trace | Link |
|-------|------|
| Traced from | [US-005](../product/user-stories.md#us-005-medication-list-confirmation-at-check-in), [US-012](../product/user-stories.md#us-012-patient-data-migration-from-riverside), [E6](../product/epics.md#e6-compliance--medication-list-at-check-in) |
| Matched by | [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [POST /patients/{id}/medications](../architecture/api-spec.md#post-patientsidmedications), [PUT /patients/{id}/medications/{medication_id}](../architecture/api-spec.md#put-patientsidmedicationsmedication_id), [DELETE /patients/{id}/medications/{medication_id}](../architecture/api-spec.md#delete-patientsidmedicationsmedication_id), [ADR-004](../architecture/adrs.md#adr-004-immutable-medication-confirmation-audit-records) |
| Proven by | [TC-601](../quality/test-suites.md#tc-601-medication-step-is-mandatory--cannot-skip), [TC-602](../quality/test-suites.md#tc-602-medication-confirmation--confirmed-unchanged), [TC-603](../quality/test-suites.md#tc-603-medication-confirmation--modified) |
| Confirmed by | Sarah Chen (PM), 2024-11-20 |

Used in the medication list (Step 4, mandatory review).

### Default State
```
┌─────────────────────────────────────────┐
│ Lisinopril                           ✎  │
│ 10mg · Once daily                       │
└─────────────────────────────────────────┘
```

- Medication name: 16px semibold
- Details: 14px gray
- Edit icon: right side, tappable area 44x44px minimum

### Editing State
```
┌─────────────────────────────────────────┐
│ Medication name                         │
│ ┌───────────────────────────────────┐   │
│ │ Lisinopril                        │   │
│ └───────────────────────────────────┘   │
│ Dosage                                  │
│ ┌───────────────────────────────────┐   │
│ │ 10mg                              │   │
│ └───────────────────────────────────┘   │
│ Frequency                               │
│ ┌───────────────────────────────────┐   │
│ │ Once daily                    ▼   │   │
│ └───────────────────────────────────┘   │
│                                         │
│           [Save]  [Cancel]  [Remove]    │
└─────────────────────────────────────────┘
```

- Frequency is a dropdown: Once daily, Twice daily, Three times daily, As needed, Other
- Remove: destructive action, red text. Triggers confirmation dialog.

### Migrated Data State (Riverside, post-Round 10)
```
┌─────────────────────────────────────────┐
│ Metformin                            ✎  │
│ 500mg · Twice daily                     │
│ ⓘ Migrated from Riverside records       │
└─────────────────────────────────────────┘
```

- Subtle info text indicating data origin
- Staff and patient should verify during first visit

---

## 5. Allergy Pill / Tag

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [POST /patients/{id}/allergies](../architecture/api-spec.md#post-patientsidallergies), [DELETE /patients/{id}/allergies/{allergy_id}](../architecture/api-spec.md#delete-patientsidallergiesallergy_id) |
| Proven by | [TC-101](../quality/test-suites.md#tc-101-returning-patient--happy-path-check-in) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Used in the allergy list (Step 3).

### Default State
```
┌──────────────────┐  ┌──────────────────┐
│ Penicillin    ✕  │  │ Latex        ✕   │
│ Severe           │  │ Moderate         │
└──────────────────┘  └──────────────────┘
```

- Pill shape: rounded rectangle
- Name: 14px semibold
- Severity: 12px below name
- Close (✕): triggers removal confirmation
- Color coding by severity:
  - Severe: red tint (#FFEBEE border)
  - Moderate: orange tint (#FFF3E0 border)
  - Mild: no tint (default border)

### Empty State
```
┌─────────────────────────────────────────┐
│ No allergies on file.                   │
│                                         │
│ [Add allergy]  □ No known allergies     │
└─────────────────────────────────────────┘
```

---

## 6. Confirmation Dialog

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-005](../product/user-stories.md#us-005-medication-list-confirmation-at-check-in), [US-013](../product/user-stories.md#us-013-duplicate-patient-detection-and-merge) |
| Matched by | [DELETE /patients/{id}/allergies/{allergy_id}](../architecture/api-spec.md#delete-patientsidallergiesallergy_id), [DELETE /patients/{id}/medications/{medication_id}](../architecture/api-spec.md#delete-patientsidmedicationsmedication_id), [POST /migration/duplicates/{id}/resolve](../architecture/api-spec.md#post-migrationduplicatesidresolve) |
| Proven by | [TC-101](../quality/test-suites.md#tc-101-returning-patient--happy-path-check-in), [TC-603](../quality/test-suites.md#tc-603-medication-confirmation--modified), [TC-1005](../quality/test-suites.md#tc-1005-staff-merge-review--field-level-merge) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Modal overlay for destructive actions (removing allergies, medications, merging records).

```
┌─────────────────────────────────────────┐
│                                         │
│   Remove Penicillin from your           │
│   allergy list?                         │
│                                         │
│        [Remove]     [Cancel]            │
│                                         │
└─────────────────────────────────────────┘
```

- Centered on screen
- Background dimmed (0.5 opacity)
- Remove: red button (destructive action)
- Cancel: gray/outlined button
- Tap outside dialog = cancel
- Escape key = cancel

**Merge confirmation (Riverside) is a larger variant with more detail** — see Screen Spec 4.2.

---

## 7. Conflict Banner

| Trace | Link |
|-------|------|
| Traced from | [US-004](../product/user-stories.md#us-004-concurrent-edit-safety-for-patient-records), [BUG-003](../product/user-stories.md#bug-003-concurrent-edit-causes-silent-data-loss) |
| Matched by | [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid), [ADR-003](../architecture/adrs.md#adr-003-optimistic-concurrency-control-via-version-field) |
| Proven by | [TC-701](../quality/test-suites.md#tc-701-two-receptionists--conflict-detection), [TC-702](../quality/test-suites.md#tc-702-conflict-resolution--view-current-version), [TC-703](../quality/test-suites.md#tc-703-conflict-resolution--re-apply-my-changes) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-10 |

Used in the receptionist patient detail panel when a concurrent edit conflict is detected (BUG-003 fix).

```
┌─────────────────────────────────────────────────────┐
│ ⚠ This record was updated by Maria R. at 9:23 AM.  │
│                                                     │
│ Changed:                                            │
│ • Insurance payer: Aetna → Blue Cross               │
│ • Insurance member ID: ABC123 → XYZ789              │
│                                                     │
│ [View current version]  [Re-apply my changes]       │
└─────────────────────────────────────────────────────┘
```

- Yellow/amber background (#FFF8E1)
- Warning icon (⚠) left of the header text
- Change list: bullet points showing field name + old value → new value
- Two action buttons: "View current version" (outlined) and "Re-apply my changes" (primary)

---

## 8. Skeleton Screen / Shimmer Loader

| Trace | Link |
|-------|------|
| Traced from | [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions) |
| Proven by | [TC-903](../quality/test-suites.md#tc-903-dashboard-stability-during-peak), [TC-904](../quality/test-suites.md#tc-904-degraded-mode--slow-backend) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-18 |

Placeholder UI shown during data loading (Round 9 performance).

### Card Skeleton
```
┌─────────────────────────────────────────┐
│ ████████████                            │
│ ██████████████████████                  │
│ ██████████████                          │
└─────────────────────────────────────────┘
```

- Gray bars (#E0E0E0) where text will appear
- Subtle shimmer animation (left-to-right gradient sweep, 1.5s loop)
- Layout matches the target component's structure

### Dashboard Row Skeleton
```
│ ████  │ ████████████ │ ██████████ │ ████ │
```

- One shimmer row per expected data row
- Shows 5-10 skeleton rows on initial load

---

## 9. Connection Status Indicator

| Trace | Link |
|-------|------|
| Traced from | [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance) |
| Matched by | [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions) |
| Proven by | [TC-903](../quality/test-suites.md#tc-903-dashboard-stability-during-peak), [TC-904](../quality/test-suites.md#tc-904-degraded-mode--slow-backend), [TC-905](../quality/test-suites.md#tc-905-degraded-mode--backend-unreachable) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-18 |

Shown in the header/top bar during degraded performance or connectivity issues (Round 9).

| State | Visual | Label |
|-------|--------|-------|
| Normal | (hidden) | — |
| Slow | Yellow dot (8px) | "System is running slowly" |
| Disconnected | Red dot (8px) + pulse animation | "Connection lost — data may be outdated" |

- Position: right side of the header bar (kiosk, receptionist), below progress dots (mobile)
- Text: 12px, same color as the dot
- Dot: small circle with border

---

## 10. Search Input

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance), [US-009](../product/user-stories.md#us-009-cross-location-patient-record-access) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [GET /dashboard/search](../architecture/api-spec.md#get-dashboardsearch), [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions) |
| Proven by | [TC-104](../quality/test-suites.md#tc-104-card-scan-failure--fallback-to-name-search), [TC-902](../quality/test-suites.md#tc-902-patient-search-performance-under-load), [TC-503](../quality/test-suites.md#tc-503-receptionist--location-filter-and-search) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Used on kiosk name search and receptionist dashboard.

```
┌─────────────────────────────────────────┐
│ 🔍 Search by last name...               │
└─────────────────────────────────────────┘
```

- Magnifying glass icon (left)
- Placeholder text
- Clear button (✕) appears when text is entered
- Debounce: 300ms after typing stops before firing search
- Minimum 2 characters before search fires
- Results appear below in a dropdown list (kiosk) or update the table rows (receptionist)

### Loading State
```
┌─────────────────────────────────────────┐
│ 🔍 John                             ⟳  │
└─────────────────────────────────────────┘
```
- Spinner replaces the clear button during search

### No Results State
Dropdown shows: "No patients found matching 'Johnathan'"

---

## 11. Location Selector

| Trace | Link |
|-------|------|
| Traced from | [US-010](../product/user-stories.md#us-010-location-aware-check-in), [E3](../product/epics.md#e3-multi-location-support) |
| Matched by | [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue), [ADR-005](../architecture/adrs.md#adr-005-centralized-database-for-multi-location-no-replication) |
| Proven by | [TC-503](../quality/test-suites.md#tc-503-receptionist--location-filter-and-search) |
| Confirmed by | Sarah Chen (PM), 2024-11-12 |

Dropdown in the receptionist dashboard top bar (post-Round 5 multi-location).

```
┌─────────────────────────────────┐
│ 📍 Main Street Clinic       ▼  │
├─────────────────────────────────┤
│   Main Street Clinic       ✓   │
│   Elm Street Clinic            │
│   ───────────────────          │
│   All Locations                │
└─────────────────────────────────┘
```

- Current location shown with checkmark
- Divider before "All Locations" option
- Selecting a location refreshes the queue table

---

## 12. Confidence Score Badge (Riverside Migration)

| Trace | Link |
|-------|------|
| Traced from | [US-013](../product/user-stories.md#us-013-duplicate-patient-detection-and-merge), [E5](../product/epics.md#e5-riverside-practice-acquisition) |
| Matched by | [GET /migration/duplicates/{id}](../architecture/api-spec.md#get-migrationduplicatesid), [ADR-008](../architecture/adrs.md#adr-008-duplicate-detection-algorithm-for-riverside-migration) |
| Proven by | [TC-1003](../quality/test-suites.md#tc-1003-duplicate-detection--exact-match), [TC-1005](../quality/test-suites.md#tc-1005-staff-merge-review--field-level-merge) |
| Confirmed by | Sarah Chen (PM), 2024-12-22 |

Used in the duplicate review and migration dashboard (Round 10).

| Score Range | Visual | Color |
|-------------|--------|-------|
| 90-100% | "95% match" | Green badge |
| 70-89% | "78% match" | Yellow badge |
| 50-69% | "55% match" | Orange badge |
| Below 50% | "32% match" | Red badge |

- Pill shape, same styling as status badges
- Number is prominent; "match" label is smaller text

---

## 13. Photo Capture Viewfinder

| Trace | Link |
|-------|------|
| Traced from | [US-011](../product/user-stories.md#us-011-photo-capture-of-insurance-card), [E4](../product/epics.md#e4-insurance-card-photo-capture) |
| Matched by | [POST /patients/{id}/insurance/{type}/photo](../architecture/api-spec.md#post-patientsidinsurancetypephoto), [ADR-006](../architecture/adrs.md#adr-006-ocr-service-as-a-separate-service-behind-a-stable-api-contract), [ADR-009](../architecture/adrs.md#adr-009-object-storage-for-insurance-card-photos-and-scanned-records) |
| Proven by | [TC-801](../quality/test-suites.md#tc-801-photo-capture--happy-path-on-kiosk), [TC-804](../quality/test-suites.md#tc-804-photo-capture-on-mobile) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-15 |

Camera overlay for insurance card capture (Round 8).

### Kiosk Variant (Landscape)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ┌───────────────────────┐                  │
│              │                       │                  │
│              │    (card outline)      │                  │
│              │                       │                  │
│              └───────────────────────┘                  │
│                                                         │
│  "Hold your insurance card in the frame — front side"   │
│                                                         │
│                      [ ⊙ Capture ]                      │
│                                                         │
│                       [Cancel]                          │
└─────────────────────────────────────────────────────────┘
```

### Mobile Variant (Portrait)
Same layout but card outline is oriented horizontally in a portrait frame. Card guide adjusts for phone dimensions.

---

## 14. Migration Notice Banner

| Trace | Link |
|-------|------|
| Traced from | [US-012](../product/user-stories.md#us-012-patient-data-migration-from-riverside), [E5](../product/epics.md#e5-riverside-practice-acquisition) |
| Matched by | [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [ADR-010](../architecture/adrs.md#adr-010-migration-pipeline-architecture--batch-import-with-rollback) |
| Proven by | [TC-1008](../quality/test-suites.md#tc-1008-first-visit-after-migration--patient-confirmation) |
| Confirmed by | Sarah Chen (PM), 2024-12-22 |

Shown on check-in review screens when a patient has migrated data that hasn't been patient-confirmed yet (Round 10).

```
┌─────────────────────────────────────────────────────────┐
│ ⓘ We recently migrated your records from Riverside      │
│   Family Practice. Please carefully review all your     │
│   information to make sure it's correct.                │
└─────────────────────────────────────────────────────────┘
```

- Blue background (#E3F2FD)
- Info icon (ⓘ)
- Appears at the top of the first review step
- Disappears after the patient confirms their check-in (record marked as patient-confirmed)
- Not shown on subsequent visits

---

## 15. Primary Action Button

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [E1](../product/epics.md#e1-returning-patient-recognition), [E2](../product/epics.md#e2-mobile-check-in) |
| Matched by | [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid), [POST /patients/verify-identity](../architecture/api-spec.md#post-patientsverify-identity) |
| Proven by | [TC-101](../quality/test-suites.md#tc-101-returning-patient--happy-path-check-in), [TC-401](../quality/test-suites.md#tc-401-mobile-check-in--happy-path) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Used throughout for main CTAs.

| Context | Label examples | Width | Height |
|---------|---------------|-------|--------|
| Kiosk | "Confirm and check in", "Continue" | min 200px, max 400px | 56px |
| Mobile | "Verify and continue", "Next" | full-width (with 16px margins) | 48px |
| Receptionist | "Save Changes", "Check in" | auto (content-based) | 40px |

**States:**
- Default: solid blue background (#1565C0), white text
- Hover: darker blue (#0D47A1)
- Pressed: even darker (#0A3A8A)
- Disabled: gray background (#BDBDBD), gray text
- Loading: spinner replaces text, button disabled, same width (no layout shift)

**Touch target:** Always minimum 44x44px (kiosk) or 48x48px (mobile), even if the visual button is smaller.
