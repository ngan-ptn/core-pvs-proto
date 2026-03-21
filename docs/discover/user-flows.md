# User Flows — Clinic Check-In System

Journey maps for all user types and scenarios. Covers happy paths, error paths, and edge cases.

---

## 1. Returning Patient — Kiosk Check-In (Happy Path)

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-002](../product/user-stories.md#us-002-receptionist-sees-confirmed-check-in-data), [US-005](../product/user-stories.md#us-005-medication-list-confirmation-at-check-in), [E1](../product/epics.md#e1-returning-patient-recognition), [E6](../product/epics.md#e6-compliance--medication-list-at-check-in) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [POST /checkins](../architecture/api-spec.md#post-checkins), [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-001](../architecture/adrs.md#adr-001-websocket-with-polling-fallback-for-real-time-dashboard-updates), [ADR-004](../architecture/adrs.md#adr-004-immutable-medication-confirmation-audit-records) |
| Proven by | [TC-101](../quality/test-suites.md#tc-101-returning-patient--happy-path-check-in), [TC-201](../quality/test-suites.md#tc-201-successful-sync--green-checkmark) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

The core flow. Patient has visited before. Data is on file.

```
Patient arrives at clinic
        │
        ▼
  Kiosk Welcome Screen
  "Scan your card to check in"
        │
        │ scans card
        ▼
  Session Transition Screen
  (800ms minimum — session purge + data load)
        │
        ▼
  Identity Confirmation
  "Welcome back, Sarah. DOB: 03/15/1982"
        │
        │ taps "Yes, that's me"
        ▼
  Step 1: Demographics Review
  All fields pre-populated
        │
        │ confirms (or edits, then confirms)
        ▼
  Step 2: Insurance Review
  Pre-populated. Option to update via photo.
        │
        │ confirms
        ▼
  Step 3: Allergies Review
  Pre-populated allergy list
        │
        │ confirms
        ▼
  Step 4: Medications Review [MANDATORY]
  Pre-populated medication list.
  Must review — cannot skip.
        │
        │ confirms medication list
        ▼
  Step 5: Confirmation Summary
  All sections visible in collapsed summary
        │
        │ taps "Confirm and check in"
        ▼
  System saves + confirms sync to receptionist
        │
        ▼
  ✓ Success: "You're checked in!"
  Receptionist dashboard updates in real-time.
  Kiosk returns to welcome after 10 seconds.
```

**Total estimated time:** 60-90 seconds for a returning patient with no changes.

---

## 2. New Patient — Kiosk Check-In

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid), [POST /checkins](../architecture/api-spec.md#post-checkins), [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-103](../quality/test-suites.md#tc-103-new-patient--kiosk-check-in) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

Patient has never visited. No data on file.

```
Patient arrives at clinic
        │
        ▼
  Kiosk Welcome Screen
        │
        │ scans card (or searches by name — no match)
        ▼
  Session Transition Screen
        │
        ▼
  No record found
  "Welcome! Let's get you set up."
        │
        ▼
  Step 1: Demographics — Empty Form
  Required: name, DOB, phone
  Optional: address, email
        │
        │ fills in fields
        ▼
  Step 2: Insurance — Empty Form
  "Enter your insurance details or take a photo of your card"
        │
        │ enters data (or captures card photo)
        ▼
  Step 3: Allergies
  "Add any known allergies, or confirm you have none"
        │
        │ adds allergies or confirms "none"
        ▼
  Step 4: Medications [MANDATORY]
  "Add any current medications, or confirm you take none"
        │
        │ adds medications or confirms "none"
        ▼
  Step 5: Confirmation Summary
        │
        │ confirms
        ▼
  ✓ Success
```

**Total estimated time:** 3-5 minutes for a new patient.

---

## 3. Card Scan Failures

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-003](../product/user-stories.md#us-003-secure-patient-identification-on-scan), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify) (card_scan + name_search), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-104](../quality/test-suites.md#tc-104-card-scan-failure--fallback-to-name-search), [TC-105](../quality/test-suites.md#tc-105-card-scan--no-matching-record) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-08 |

```
Patient scans card
        │
        ├──── Scan unreadable ──────────────────────────────────┐
        │     "We couldn't read your card.                      │
        │      Please try again or tap below                    │
        │      to search by name."                              │
        │            │                                          │
        │            ├── Patient retries scan ──→ (retry)       │
        │            └── Patient taps "Search by name"          │
        │                     │                                 │
        │                     ▼                                 │
        │               Name Search Screen                      │
        │               Type last name → results appear         │
        │                     │                                 │
        │                     ├── Match found → Identity Confirmation
        │                     └── No match → "Please check with front desk"
        │
        └──── Scan OK but no matching record ──────────────────┐
              "We couldn't find your record.                    │
               Please check with the front desk."              │
              Screen returns to welcome after 10 seconds.      │
```

---

## 4. Data Leak Prevention — Between Patients (BUG-002 Fix)

| Trace | Link |
|-------|------|
| Traced from | [US-003](../product/user-stories.md#us-003-secure-patient-identification-on-scan), [BUG-002](../product/user-stories.md#bug-002-data-leak--previous-patients-data-visible-on-scan), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [Check-In Service](../architecture/architecture.md#check-in-service-core) (session management), [ADR-002](../architecture/adrs.md#adr-002-session-purge-protocol-for-kiosk-state-isolation) |
| Proven by | [TC-301](../quality/test-suites.md#tc-301-sequential-patients--no-data-leakage), [TC-302](../quality/test-suites.md#tc-302-rapid-sequential-scans--no-data-leakage), [TC-303](../quality/test-suites.md#tc-303-rapid-sequential-scans--sub-second-timing), [TC-304](../quality/test-suites.md#tc-304-session-purge--dom-inspection), [TC-305](../quality/test-suites.md#tc-305-browser-back-button-does-not-reveal-previous-session) |
| Confirmed by | Jamie Park (Design Lead), 2024-11-05 |

```
Patient A completes check-in
        │
        ▼
  Success screen shown (Patient A's name visible)
        │
        │ 10-second countdown
        ▼
  FULL SESSION PURGE
  - DOM cleared
  - Component state reset
  - Cached data flushed
  - API connections closed
        │
        ▼
  Kiosk Welcome Screen (clean state)
        │
        │ Patient B scans card
        ▼
  Session Transition Screen
  (800ms minimum — guarantees clean render)
  Patient A's data NEVER appears at any point.
        │
        ▼
  Patient B's data loads fresh
```

**Edge case — Patient B scans while Patient A's success screen is still showing:**
```
Patient A's success screen (countdown at 6 seconds)
        │
        │ Patient B scans card
        ▼
  IMMEDIATE session purge (interrupts countdown)
        │
        ▼
  Session Transition Screen
  (full 800ms, clean load)
        │
        ▼
  Patient B's Identity Confirmation
```

---

## 5. Kiosk-to-Receptionist Sync (BUG-001 Fix)

| Trace | Link |
|-------|------|
| Traced from | [US-002](../product/user-stories.md#us-002-receptionist-sees-confirmed-check-in-data), [BUG-001](../product/user-stories.md#bug-001-kiosk-confirmation-not-syncing-to-receptionist-screen), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-001](../architecture/adrs.md#adr-001-websocket-with-polling-fallback-for-real-time-dashboard-updates), [Notification Service](../architecture/architecture.md#notification-service) |
| Proven by | [TC-201](../quality/test-suites.md#tc-201-successful-sync--green-checkmark), [TC-202](../quality/test-suites.md#tc-202-sync-timeout--yellow-warning-on-kiosk), [TC-203](../quality/test-suites.md#tc-203-sync-failure--dashboard-retry) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-15 |

```
Patient taps "Confirm and check in"
        │
        ▼
  Kiosk: saves patient data
        │
        ├──── Save succeeds ────────────────────────────────────┐
        │                                                       │
        │     Kiosk waits for receptionist sync confirmation    │
        │            │                                          │
        │            ├──── Sync confirmed (< 5s) ───────────────┤
        │            │     Kiosk: ✓ Green success               │
        │            │     Dashboard: row updates to green      │
        │            │                                          │
        │            └──── Sync not confirmed (> 5s) ───────────┤
        │                  Kiosk: ⚠ Yellow warning              │
        │                  "Saved, but front desk wasn't        │
        │                   notified. Please let them know."    │
        │                  Dashboard: row shows "Syncing..."    │
        │                  Dashboard: after 15s → "Failed"      │
        │                  + "Retry sync" link                  │
        │                                                       │
        └──── Save fails ──────────────────────────────────────┐
              Kiosk: ✗ Red error                               │
              "Something went wrong. Try again or ask           │
               the front desk."                                │
              Patient's data stays in the form.                │
              Dashboard: no change (nothing was saved).        │
```

---

## 6. Mobile Check-In — Happy Path

| Trace | Link |
|-------|------|
| Traced from | [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [US-008](../product/user-stories.md#us-008-receptionist-visibility-of-mobile-check-ins), [E2](../product/epics.md#e2-mobile-check-in) |
| Matched by | [POST /mobile-checkin/send-link](../architecture/api-spec.md#post-mobile-checkinsend-link), [POST /patients/verify-identity](../architecture/api-spec.md#post-patientsverify-identity), [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [Check-In Service](../architecture/architecture.md#check-in-service-core), [Notification Service](../architecture/architecture.md#notification-service) |
| Proven by | [TC-401](../quality/test-suites.md#tc-401-mobile-check-in--happy-path) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-28 |

```
  24 hours before appointment:
  System sends SMS/email with check-in link
        │
        ▼
  Patient taps link on phone
        │
        ▼
  Mobile: Link Landing
  "Check in for your appointment
   [Date] at [Time] at [Location Name]"
        │
        ▼
  Identity Verification
  Enter DOB + last 4 of phone
        │
        │ verified
        ▼
  Step 1: Demographics (mobile layout)
  Pre-populated, single-column
        │
        │ confirms
        ▼
  Step 2: Insurance (mobile layout)
  Option to photograph card
        │
        │ confirms
        ▼
  Step 3: Allergies (mobile layout)
        │
        │ confirms
        ▼
  Step 4: Medications [MANDATORY]
        │
        │ confirms
        ▼
  Step 5: Confirmation
  "Confirm and check in"
        │
        │ taps confirm
        ▼
  ✓ "You're checked in! See you on [date]."
  Session terminated. No PHI cached on device.

  MEANWHILE on the receptionist dashboard:
  Patient's row updates to "Mobile — Complete" (green + phone icon)
  Channel shows "Mobile" with completion timestamp.
```

---

## 7. Mobile Check-In — Partial Completion

| Trace | Link |
|-------|------|
| Traced from | [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [US-008](../product/user-stories.md#us-008-receptionist-visibility-of-mobile-check-ins), [E2](../product/epics.md#e2-mobile-check-in) |
| Matched by | [PATCH /checkins/{id}/progress](../architecture/api-spec.md#patch-checkinsidprogress), [GET /mobile-checkin/{token}/status](../architecture/api-spec.md#get-mobile-checkintokenstatus), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-404](../quality/test-suites.md#tc-404-mobile--partial-completion-and-resume) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-28 |

```
  Patient opens link, verifies identity
        │
        ▼
  Completes Step 1 (Demographics)
  Completes Step 2 (Insurance)
        │
        │ closes browser (phone call, distraction, etc.)
        │
        │ Progress saved server-side.
        │ Receptionist sees "Mobile — Partial" (yellow)
        │
        ▼
  Later: patient reopens the link
        │
        ▼
  "Welcome back! You left off at Allergies."
  [Continue]
        │
        │ resumes from Step 3
        ▼
  Completes remaining steps
        │
        ▼
  ✓ Checked in
```

---

## 8. Mobile Check-In then Kiosk Arrival (Duplicate Prevention)

| Trace | Link |
|-------|------|
| Traced from | [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [E2](../product/epics.md#e2-mobile-check-in) |
| Matched by | [POST /checkins](../architecture/api-spec.md#post-checkins) (409 already_checked_in), [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-405](../quality/test-suites.md#tc-405-mobile-then-kiosk--duplicate-prevention) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-28 |

```
  Patient completes mobile check-in
        │
        ▼
  Arrives at clinic, scans card at kiosk
        │
        ▼
  System recognizes: already checked in via mobile
        │
        ▼
  Kiosk shows: "You're already checked in!
  We received your information earlier.
  Please have a seat."
        │
        │ (no redundant steps)
        ▼
  Returns to welcome after 10 seconds
```

---

## 9. Insurance Card Photo Capture

| Trace | Link |
|-------|------|
| Traced from | [US-011](../product/user-stories.md#us-011-photo-capture-of-insurance-card), [E4](../product/epics.md#e4-insurance-card-photo-capture) |
| Matched by | [POST /patients/{id}/insurance/{type}/photo](../architecture/api-spec.md#post-patientsidinsurancetypephoto), [GET /patients/{id}/insurance/{type}/photo/status/{processing_id}](../architecture/api-spec.md#get-patientsidinsurancetypephotostatusprocessing_id), [ADR-006](../architecture/adrs.md#adr-006-ocr-service-as-a-separate-service-behind-a-stable-api-contract), [OCR Service](../architecture/architecture.md#ocr-service-round-8) |
| Proven by | [TC-801](../quality/test-suites.md#tc-801-photo-capture--happy-path-on-kiosk), [TC-802](../quality/test-suites.md#tc-802-photo-capture--ocr-failure), [TC-803](../quality/test-suites.md#tc-803-photo-capture--camera-permission-denied), [TC-804](../quality/test-suites.md#tc-804-photo-capture-on-mobile) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-15 |

```
  Patient is on Insurance Review step (kiosk or mobile)
        │
        │ taps "Update with a photo of your card"
        ▼
  Camera permission check
        │
        ├──── Permission granted ──────────────────────┐
        │                                              │
        │     Camera viewfinder opens                  │
        │     Card guide overlay shown                 │
        │     "Hold your card in the frame — front"    │
        │            │                                 │
        │            │ captures front                  │
        │            ▼                                 │
        │     Preview: "Use this photo" / "Retake"     │
        │            │                                 │
        │            │ accepts                         │
        │            ▼                                 │
        │     "Flip your card — back side"             │
        │            │                                 │
        │            │ captures back                   │
        │            ▼                                 │
        │     Preview: "Use this photo" / "Retake"     │
        │            │                                 │
        │            │ accepts                         │
        │            ▼                                 │
        │     "Reading your card..." (OCR processing)  │
        │            │                                 │
        │            ├── OCR success ────────────────┐ │
        │            │   Fields populated            │ │
        │            │   Blue highlight = OCR values  │ │
        │            │   Yellow = low confidence     │ │
        │            │   Patient reviews & edits     │ │
        │            │                               │ │
        │            └── OCR failure ────────────────┤ │
        │                "Couldn't read your card."  │ │
        │                Manual entry form shown.    │ │
        │                                            │ │
        └──── Permission denied ─────────────────────┤
              "Camera access needed.                  │
               Enter information manually."           │
              Manual entry form shown.                │
```

---

## 10. Concurrent Edit Conflict (BUG-003 Fix)

| Trace | Link |
|-------|------|
| Traced from | [US-004](../product/user-stories.md#us-004-concurrent-edit-safety-for-patient-records), [BUG-003](../product/user-stories.md#bug-003-concurrent-edit-causes-silent-data-loss), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid) (version conflict 409), [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [ADR-003](../architecture/adrs.md#adr-003-optimistic-concurrency-control-via-version-field), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-701](../quality/test-suites.md#tc-701-two-receptionists--conflict-detection), [TC-702](../quality/test-suites.md#tc-702-conflict-resolution--view-current-version), [TC-703](../quality/test-suites.md#tc-703-conflict-resolution--re-apply-my-changes), [TC-705](../quality/test-suites.md#tc-705-concurrent-edit--same-field-by-two-users) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-10 |

```
  Receptionist A opens patient record (version 5)
  Receptionist B opens same patient record (version 5)
        │                              │
        │                              │
  A edits insurance:                   B edits phone:
  "Aetna" → "Blue Cross"              "555-1234" → "555-5678"
        │                              │
        │                              │
  A clicks Save                        │
  Version check: 5 == 5 ✓             │
  Save succeeds. Record → version 6.   │
  A sees green confirmation.           │
        │                              │
        │                              B clicks Save
        │                              Version check: 5 ≠ 6 ✗
        │                              Save BLOCKED.
        │                              │
        │                              ▼
        │                     Conflict banner appears:
        │                     "This record was updated by
        │                      [Receptionist A] at [time].
        │                      Changed: Insurance payer
        │                      from Aetna to Blue Cross"
        │                              │
        │                     ┌────────┴────────┐
        │                     │                 │
        │              [View current]    [Re-apply mine]
        │                     │                 │
        │                     ▼                 ▼
        │              Panel refreshes    Panel refreshes with
        │              with version 6.    version 6 data + B's
        │              B's edits gone.    phone edit highlighted
        │              B can re-edit.     as a pending change.
        │                                B confirms → saves
        │                                as version 7.
```

---

## 11. Multi-Location Check-In

| Trace | Link |
|-------|------|
| Traced from | [US-009](../product/user-stories.md#us-009-cross-location-patient-record-access), [US-010](../product/user-stories.md#us-010-location-aware-check-in), [E3](../product/epics.md#e3-multi-location-support) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue), [GET /dashboard/search](../architecture/api-spec.md#get-dashboardsearch), [ADR-005](../architecture/adrs.md#adr-005-centralized-database-for-multi-location-no-replication), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-501](../quality/test-suites.md#tc-501-cross-location-patient-record--data-consistency), [TC-502](../quality/test-suites.md#tc-502-location-aware-kiosk), [TC-503](../quality/test-suites.md#tc-503-receptionist--location-filter-and-search) |
| Confirmed by | Sarah Chen (PM), 2024-11-12 |

```
  Patient has visited Location A before.
  Today, visiting Location B for the first time.
        │
        ▼
  Location B Kiosk Welcome Screen
  Header shows "Elm Street Clinic" (Location B's name)
        │
        │ scans card
        ▼
  Session Transition → Identity Confirmation
  Same patient data (centralized record)
        │
        ▼
  Check-in review steps — all data pre-populated
  (same data as Location A — single record)
        │
        ▼
  ✓ Checked in at Location B

  Location B receptionist dashboard:
  Patient appears in Location B's queue.

  Location A receptionist dashboard:
  Patient does NOT appear (filtered to Location A).
  But Location A staff CAN find the patient via search.
```

---

## 12. Mobile Check-In — Multi-Location

| Trace | Link |
|-------|------|
| Traced from | [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [US-010](../product/user-stories.md#us-010-location-aware-check-in), [E2](../product/epics.md#e2-mobile-check-in), [E3](../product/epics.md#e3-multi-location-support) |
| Matched by | [POST /mobile-checkin/send-link](../architecture/api-spec.md#post-mobile-checkinsend-link), [GET /mobile-checkin/{token}/status](../architecture/api-spec.md#get-mobile-checkintokenstatus), [ADR-005](../architecture/adrs.md#adr-005-centralized-database-for-multi-location-no-replication), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-504](../quality/test-suites.md#tc-504-mobile-check-in--location-displayed) |
| Confirmed by | Jamie Park (Design Lead), 2024-11-12 |

```
  Patient has appointments at Location A and Location B.
  Receives check-in link.
        │
        ▼
  Mobile Link Landing
  Appointment info shows: "[Date] at [Time] at [Location Name]"
  Location is specific to the appointment — no ambiguity.
        │
        ▼
  (Normal mobile check-in flow)
        │
        ▼
  Confirmation: "You're checked in at [Location Name]!"
```

If a patient has two appointments on the same day at different locations, they receive two separate check-in links.

---

## 13. Riverside Migration — First Visit After Migration

| Trace | Link |
|-------|------|
| Traced from | [US-012](../product/user-stories.md#us-012-patient-data-migration-from-riverside), [E5](../product/epics.md#e5-riverside-practice-acquisition) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [GET /patients/{id}](../architecture/api-spec.md#get-patientsid), [ADR-010](../architecture/adrs.md#adr-010-migration-pipeline-architecture--batch-import-with-rollback), [Migration Service](../architecture/architecture.md#migration-service-round-10) |
| Proven by | [TC-1008](../quality/test-suites.md#tc-1008-first-visit-after-migration--patient-confirmation) |
| Confirmed by | Sarah Chen (PM), 2024-12-22 |

```
  Riverside patient record migrated into the system
  (electronic import or paper OCR)
        │
        ▼
  Patient visits any clinic location
        │
        │ scans card or identified by name search
        ▼
  System detects: migrated record, not yet patient-confirmed
        │
        ▼
  Identity Confirmation (standard)
        │
        ▼
  Check-In Review — with migration notice:
  "We recently migrated your records from Riverside
   Family Practice. Please carefully review all your
   information to make sure it's correct."
        │
        ▼
  Demographics: pre-populated from migrated data
  Fields with low OCR confidence (paper records):
  highlighted in yellow, "Please verify this field"
        │
        ▼
  Insurance: same — highlight uncertain fields
        │
        ▼
  Allergies: same
        │
        ▼
  Medications: same (mandatory review applies)
        │
        ▼
  Confirmation
  "Thanks for reviewing your information!"
  Record marked as patient-confirmed.
  Subsequent visits follow normal flow (no migration notice).
```

---

## 14. Duplicate Detection — Staff Review (Riverside)

| Trace | Link |
|-------|------|
| Traced from | [US-013](../product/user-stories.md#us-013-duplicate-patient-detection-and-merge), [E5](../product/epics.md#e5-riverside-practice-acquisition) |
| Matched by | [POST /migration/batches/{batch_id}/import](../architecture/api-spec.md#post-migrationbatchesbatch_idimport), [GET /migration/duplicates/{id}](../architecture/api-spec.md#get-migrationduplicatesid), [POST /migration/duplicates/{id}/resolve](../architecture/api-spec.md#post-migrationduplicatesidresolve), [ADR-008](../architecture/adrs.md#adr-008-duplicate-detection-algorithm-for-riverside-migration), [Migration Service](../architecture/architecture.md#migration-service-round-10) |
| Proven by | [TC-1003](../quality/test-suites.md#tc-1003-duplicate-detection--exact-match), [TC-1005](../quality/test-suites.md#tc-1005-staff-merge-review--field-level-merge), [TC-1006](../quality/test-suites.md#tc-1006-staff-review--keep-separate), [TC-1011](../quality/test-suites.md#tc-1011-no-auto-merge-verification) |
| Confirmed by | Sarah Chen (PM), 2024-12-22 |

```
  Migration import runs for a batch of Riverside records
        │
        ▼
  System detects potential duplicate:
  Riverside "Sarah Johnson, DOB 03/15/1982"
  matches existing "Sarah M. Johnson, DOB 03/15/1982"
  Confidence: 92%
        │
        ▼
  Record appears in Admin Migration Dashboard
  Status: "Potential Duplicate"
        │
        ▼
  Staff clicks to review
        │
        ▼
  Duplicate Review Screen (side-by-side)
  Left: Our record (Sarah M. Johnson)
  Right: Riverside record (Sarah Johnson)
  Matching fields in green, differing in yellow
        │
        ├── Staff confirms: same person ──────────────────┐
        │   Field-by-field merge selection:               │
        │   - Name: keep "Sarah M. Johnson" (ours)       │
        │   - Phone: keep Riverside's (more recent)      │
        │   - Insurance: keep Riverside's (updated)      │
        │   - Medications: merge both lists              │
        │   [Confirm merge]                               │
        │        │                                        │
        │        ▼                                        │
        │   Merge confirmation dialog                     │
        │   "Both originals preserved as reference"       │
        │        │                                        │
        │        ▼                                        │
        │   Single merged record. Status: "Resolved"      │
        │                                                 │
        ├── Staff says: different people ──────────────────┤
        │   [Keep separate]                               │
        │   Both records remain independent.              │
        │   Status: "Resolved — kept separate"            │
        │                                                 │
        └── Staff unsure ─────────────────────────────────┤
            [Flag for further review]                     │
            Status: "Needs further review"                │
            Stays in the review queue.                    │
```

---

## 15. Peak Load Degraded Experience (Round 9)

| Trace | Link |
|-------|------|
| Traced from | [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions), [Check-In Service](../architecture/architecture.md#check-in-service-core) |
| Proven by | [TC-901](../quality/test-suites.md#tc-901-50-concurrent-kiosk-check-ins--response-time), [TC-903](../quality/test-suites.md#tc-903-dashboard-stability-during-peak), [TC-904](../quality/test-suites.md#tc-904-degraded-mode--slow-backend), [TC-905](../quality/test-suites.md#tc-905-degraded-mode--backend-unreachable) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-18 |

```
  Monday 8:15 AM — 35 patients checking in simultaneously
        │
        ▼
  System under load — response times increasing
        │
        ├── Patient on kiosk ──────────────────────────────┐
        │   Scans card → transition screen                 │
        │   Data load takes 4 seconds (instead of 1)       │
        │   Transition screen shows:                       │
        │   "Still loading... please wait."                │
        │   Data arrives → normal flow continues.          │
        │   User experiences slight delay but never        │
        │   a frozen screen.                               │
        │                                                  │
        ├── Receptionist ──────────────────────────────────┤
        │   Dashboard shows yellow dot:                    │
        │   "System is running slowly"                     │
        │   Queue rows update with slight delay.           │
        │   Search takes 3 seconds — spinner visible.      │
        │   Dashboard never freezes.                       │
        │                                                  │
        └── Mobile patient ────────────────────────────────┤
            Step transitions take 2-3 seconds.             │
            Skeleton screens show immediately.             │
            Content fills in when loaded.                  │
            Banner: "Check-in is a bit slow right now."    │
```

**If the system becomes unreachable:**
```
  Backend unreachable (network issue, server down)
        │
        ├── Kiosk: 30-second timeout ─────────────────────┐
        │   "Check-in is temporarily unavailable.          │
        │    Please see the front desk."                   │
        │                                                  │
        ├── Receptionist dashboard ────────────────────────┤
        │   Red banner: "Connection lost.                  │
        │   Data may not be current.                       │
        │   Last updated: 8:12 AM"                         │
        │   Dashboard shows stale data, clearly labeled.   │
        │                                                  │
        └── Mobile ────────────────────────────────────────┤
            "Check-in is temporarily unavailable.           │
             Please try again later, or check in            │
             at the clinic when you arrive."               │
```
