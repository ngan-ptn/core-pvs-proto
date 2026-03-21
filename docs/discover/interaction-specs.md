# Interaction Specs — Clinic Check-In System

How things behave. Transitions, animations, error handling, edge cases, timing. Companion to Screen Specs.

---

## 1. Kiosk Interactions

| Trace | Link |
|-------|------|
| Traced from | [US-001](../product/user-stories.md#us-001-pre-populated-check-in-for-returning-patients), [US-003](../product/user-stories.md#us-003-secure-patient-identification-on-scan), [BUG-002](../product/user-stories.md#bug-002-data-leak--previous-patients-data-visible-on-scan), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [POST /patients/identify](../architecture/api-spec.md#post-patientsidentify), [POST /checkins](../architecture/api-spec.md#post-checkins), [POST /checkins/{id}/complete](../architecture/api-spec.md#post-checkinsidcomplete), [ADR-001](../architecture/adrs.md#adr-001-websocket-with-polling-fallback-for-real-time-dashboard-updates), [ADR-002](../architecture/adrs.md#adr-002-session-purge-protocol-for-kiosk-state-isolation) |
| Proven by | [Suite 1](../quality/test-suites.md#suite-1-core-kiosk-check-in-round-1), [Suite 3](../quality/test-suites.md#suite-3-session-isolation--bug-002-fix-round-4) |
| Confirmed by | Jamie Park (Design Lead), 2024-11-05 |

### 1.1 Card Scan → Data Display (Session Lifecycle)

**Happy path:**
1. Patient scans card on kiosk welcome screen
2. Welcome screen transitions to **Session Transition Screen** (mandatory, min 800ms)
   - During this time: previous session purged, new patient data fetched
3. Transition screen fades to **Identity Confirmation Screen**
4. Patient taps "Yes, that's me"
5. Smooth slide-left transition to **Demographics Review**
6. Each subsequent step slides left on "Continue," slides right on "Back"

**Transitions:**
- Welcome → Transition: instant cut (no animation, clean break)
- Transition → Identity Confirmation: fade in (400ms ease-in)
- Between review steps: horizontal slide (300ms ease-in-out)
- Last step → Confirmation success: scale-up + fade of the confirmation message (500ms)

**Timing constraints:**
- Session transition screen: minimum 800ms, maximum 5 seconds before timeout message
- If patient data load takes > 3 seconds (after the 800ms minimum), show "Still loading..." text on transition screen
- If > 10 seconds total: show "The system is running slowly. Please wait." on transition screen
- If > 30 seconds: abandon attempt, show error, return to welcome

### 1.2 Card Scan — Rapid Sequential Scans (Security)

**Scenario:** Two patients scan cards in quick succession (e.g., one walks away, next steps up immediately).

**Behavior:**
1. Second scan interrupts any in-progress data load from the first scan
2. API call for the first patient is cancelled
3. Session transition screen is re-triggered (full 800ms minimum restart)
4. DOM and state are fully cleared again
5. Second patient's data loads fresh

**There is no scenario where Patient A's data flashes on screen during Patient B's session.**

### 1.3 Inline Editing on Review Screens

**Trigger:** Patient taps "Edit" link on any section.

**Behavior:**
1. Section smoothly expands (200ms ease-out) to show form inputs
2. Current values pre-populate the inputs
3. Keyboard appears (kiosk touch keyboard or physical)
4. Other sections remain visible but non-interactive (slight dim, 0.6 opacity)
5. Two buttons appear within the expanded section: "Save" / "Cancel"

**Save:**
- Inline spinner on "Save" button (replaces text)
- On success: section collapses back to read-only with updated value. Brief green background flash (300ms).
- On validation error: field highlights red, error message appears below field. Section stays expanded.

**Cancel:**
- Section collapses immediately. Original value restored. No confirmation needed (they haven't saved).

**Only one section edits at a time.** If patient taps "Edit" on another section while one is open, the first collapses (cancelling unsaved changes) and the new one opens. A brief wobble animation (150ms) on the collapsing section hints that changes were discarded.

### 1.4 Allergy and Medication List Interactions

**Adding an item:**
1. Patient taps "Add allergy" or "Add medication"
2. Form slides in below the existing list (200ms ease-out)
3. Name field has search-as-you-type for common items
   - Dropdown appears after 2 characters typed
   - Patient can select from dropdown or continue typing a custom entry
4. Required fields: name. Optional: dosage, frequency (medications); reaction type, severity (allergies).
5. "Add" button saves the item. It appears at the bottom of the list with a green flash.

**Removing an item:**
1. Patient taps X on the item (or swipes left on kiosk touchscreen)
2. Confirmation dialog slides up: "Remove [item name]? [Remove] [Cancel]"
3. On confirm: item animates out (shrink + fade, 200ms). List reflows.
4. On cancel: dialog dismisses, no change.

**Editing an item:**
1. Tap on the item card
2. Card expands inline to show editable fields (same 200ms expand animation)
3. Same Save/Cancel pattern as demographic section editing

### 1.5 Check-In Confirmation Submit

**Tap "Confirm and check in":**
1. Button text changes to spinner, button becomes disabled
2. System submits all confirmed/edited data
3. System waits for receptionist dashboard sync confirmation (post-BUG-001)
4. **If sync confirmed within 5 seconds:** Success screen with green checkmark
5. **If sync not confirmed within 5 seconds but data was saved:** Yellow warning (sync failure message — see Screen Spec 1.8)
6. **If save failed entirely:** Red error with retry option

**The green checkmark only appears when end-to-end sync is confirmed.** This was the root cause of BUG-001 — previously, the green checkmark appeared when the kiosk save succeeded, regardless of whether the receptionist saw it.

### 1.6 Auto-Return to Welcome

After check-in success or any terminal state:
- 10-second countdown shown: "Returning to start in [10]..."
- Countdown ticks down visually
- At 0: full session purge, return to welcome screen
- If patient taps the screen during countdown: countdown resets to 10

This prevents the next patient from seeing any residual data (reinforces BUG-002 fix).

---

## 2. Receptionist Dashboard Interactions

| Trace | Link |
|-------|------|
| Traced from | [US-002](../product/user-stories.md#us-002-receptionist-sees-confirmed-check-in-data), [US-004](../product/user-stories.md#us-004-concurrent-edit-safety-for-patient-records), [BUG-001](../product/user-stories.md#bug-001-kiosk-confirmation-not-syncing-to-receptionist-screen), [BUG-003](../product/user-stories.md#bug-003-concurrent-edit-causes-silent-data-loss), [E1](../product/epics.md#e1-returning-patient-recognition), [E3](../product/epics.md#e3-multi-location-support) |
| Matched by | [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue), [GET /dashboard/search](../architecture/api-spec.md#get-dashboardsearch), [PATCH /patients/{id}](../architecture/api-spec.md#patch-patientsid), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [ADR-003](../architecture/adrs.md#adr-003-optimistic-concurrency-control-via-version-field), [ADR-005](../architecture/adrs.md#adr-005-centralized-database-for-multi-location-no-replication) |
| Proven by | [Suite 2](../quality/test-suites.md#suite-2-kiosk-to-receptionist-sync--bug-001-fix-round-2), [Suite 7](../quality/test-suites.md#suite-7-concurrent-edit-safety--bug-003-fix-round-7) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-10 |

### 2.1 Real-Time Queue Updates

**When a patient checks in (kiosk or mobile):**
1. The patient's row in the queue updates in real-time (WebSocket or SSE push)
2. Status badge transitions from gray "Not Checked In" to green "Checked In" with a brief pulse animation (300ms)
3. Channel column updates to show the check-in method
4. A subtle notification sound plays (configurable, can be muted)
5. Status bar at the bottom updates the count

**Sync delay behavior (post-BUG-001):**
- When kiosk sends a check-in, the row immediately shows "Syncing..." (blue pulse badge)
- Within 5 seconds, it should resolve to "Checked In" (green)
- If still syncing after 15 seconds, it changes to "Check-In Failed" (red) with a "Retry sync" link
- Receptionist can click "Retry sync" which triggers a manual re-fetch

### 2.2 Patient Detail Side Panel — Open/Close

**Open:** Click patient name in the queue → panel slides in from the right (300ms ease-out). Main queue narrows to accommodate. Panel is ~40% width.

**Close:** Click X or click anywhere in the main queue area → panel slides out (250ms ease-in). Queue expands back.

**Quick-switch:** Click a different patient name while panel is open → panel content cross-fades (200ms) to the new patient. Panel stays open, no slide animation.

### 2.3 Editing Patient Record (Staff Side)

**Trigger:** Staff clicks any field in the patient detail side panel to edit.

**Behavior:**
- Field becomes editable inline (text input replaces display text)
- "Save Changes" button appears in the panel footer (initially it's hidden when no edits are pending)
- Edits are staged locally until "Save Changes" is clicked
- "Cancel" discards all pending edits

**Optimistic concurrency (post-BUG-003):**

When the panel opens, the system records the record's version number.

**On save:**
1. System checks: has the version changed since we loaded it?
2. **No conflict:** Save succeeds. Green flash on panel header. Version number incremented.
3. **Conflict detected:** Save is blocked. Conflict banner animates in at the top of the panel (slide-down, 300ms). See conflict banner spec in Screen Specs 2.2.

**Conflict resolution flow:**
1. Staff reads the conflict banner: who changed what, when
2. "View current version" → panel refreshes with latest data. Staff's unsaved edits are discarded. They can re-edit.
3. "Re-apply my changes" → panel refreshes with latest data AND shows the staff's edits as highlighted diffs on top. Staff reviews each change and confirms or discards.

**Edge case — concurrent panel open:**
- If two staff members have the same patient's panel open, both can read freely
- The first to save succeeds
- The second to save gets the conflict banner
- There is no locking indicator ("currently being edited by X") — we use optimistic concurrency, not pessimistic locking ([DEC-003](../product/decision-log.md#dec-003-optimistic-concurrency-control-for-patient-records))

### 2.4 Location Switching (Multi-Location)

**Trigger:** Staff clicks the location selector dropdown in the top bar.

**Behavior:**
1. Dropdown shows: [Location A] [Location B] [All Locations]
2. On selection: queue table smoothly fades out (150ms), new location's data loads, table fades in (150ms)
3. Top bar shows the selected location name
4. If "All Locations" is selected, a "Location" column appears in the queue table
5. Search behavior doesn't change — search always queries all locations regardless of the current filter

**Location memory:** The dashboard remembers the staff member's last-selected location for the session. On login, it defaults to their assigned location.

---

## 3. Mobile Check-In Interactions

| Trace | Link |
|-------|------|
| Traced from | [US-007](../product/user-stories.md#us-007-pre-visit-check-in-from-personal-device), [US-011](../product/user-stories.md#us-011-photo-capture-of-insurance-card), [E2](../product/epics.md#e2-mobile-check-in), [E4](../product/epics.md#e4-insurance-card-photo-capture) |
| Matched by | [POST /patients/verify-identity](../architecture/api-spec.md#post-patientsverify-identity), [POST /mobile-checkin/send-link](../architecture/api-spec.md#post-mobile-checkinsend-link), [GET /mobile-checkin/{token}/status](../architecture/api-spec.md#get-mobile-checkintokenstatus), [PATCH /checkins/{id}/progress](../architecture/api-spec.md#patch-checkinsidprogress), [POST /patients/{id}/insurance/{type}/photo](../architecture/api-spec.md#post-patientsidinsurancetypephoto), [ADR-006](../architecture/adrs.md#adr-006-ocr-service-as-a-separate-service-behind-a-stable-api-contract) |
| Proven by | [Suite 4](../quality/test-suites.md#suite-4-mobile-check-in-round-3), [TC-804](../quality/test-suites.md#tc-804-photo-capture-on-mobile) |
| Confirmed by | Jamie Park (Design Lead), 2024-10-28 |

### 3.1 Link Open → Identity Verification

**Patient taps SMS/email link:**
1. Browser opens. Clinic-branded page loads.
2. If link is valid: identity verification form shown
3. If link is expired: expiration message shown immediately, no form
4. If already checked in: confirmation message shown, no form

**Identity verification submit:**
1. Patient enters DOB + last 4 of phone
2. Taps "Verify and continue"
3. Button shows spinner
4. **Match:** Smooth transition to first review step
5. **No match:** Red inline error. Patient can retry. After 3 failed attempts: "Please contact the clinic for help" with phone number. Form disabled.

### 3.2 Step Navigation

**Forward (tapping "Next"):**
- Current screen slides left, next screen slides in from right (300ms)
- Progress dots update

**Backward (tapping "Back" or swiping right):**
- Current screen slides right, previous screen slides in from left (300ms)
- Progress dots update
- Any unsaved edits on the current screen are preserved (not lost on back)

**Closing browser mid-flow:**
- Progress is saved server-side after each step completion
- Reopening the link resumes from the last completed step
- An interstitial shows: "Welcome back! You left off at [step name]." + "Continue" button

### 3.3 Mobile Edit Sheets

When a patient taps "Edit" on mobile (any section), a full-screen bottom sheet slides up (instead of inline expand like kiosk):

**Behavior:**
1. Bottom sheet slides up from the bottom of the screen (300ms ease-out)
2. Contains the same form fields as the kiosk inline edit
3. Background is dimmed (0.5 opacity overlay)
4. "Save" and "Cancel" buttons at the bottom of the sheet
5. Swipe down on the sheet dismisses it (same as Cancel)

This pattern is used because inline expansion doesn't work well on small screens — it pushes content off-screen and disorients the user.

### 3.4 Insurance Photo Capture on Mobile

**Trigger:** Patient taps "Take a photo of your insurance card" on the insurance step.

**Behavior:**
1. Browser requests camera permission (native OS prompt)
2. **Permission granted:** Camera viewfinder opens in full-screen with card guide overlay
3. **Permission denied:** Message: "Camera access is needed. You can enter your information manually." Card guide never shows.
4. Same guided front/back capture flow as kiosk (Screen Spec 1.5a), but in portrait orientation
5. After capture, images are uploaded and OCR runs
6. Results populate the insurance fields with blue highlights (OCR-derived)
7. Low-confidence fields get yellow highlights

**Mobile-specific considerations:**
- Image quality check: if image is too dark or blurry, prompt retake before uploading
- Upload progress bar shown during image upload (mobile networks may be slow)
- If upload fails: "Upload failed. [Retry] or [enter manually]"

### 3.5 Session Security on Mobile

**Active session timeout:** If the patient is inactive for 5 minutes during the check-in flow:
1. At 4 minutes: subtle banner at top "Your session will expire in 1 minute due to inactivity"
2. At 5 minutes: session expires. Screen shows "Your session has expired for security. [Start over]"
3. Starting over goes back to identity verification

**Post-completion cleanup:**
- After the final confirmation screen, the browser session is terminated
- No PHI is cached in browser storage (localStorage, sessionStorage, cookies) after completion
- Back button after completion shows the "already checked in" message, not cached data

---

## 4. Error Handling (Cross-Cutting)

| Trace | Link |
|-------|------|
| Traced from | [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance), [BUG-001](../product/user-stories.md#bug-001-kiosk-confirmation-not-syncing-to-receptionist-screen) |
| Matched by | [ADR-001](../architecture/adrs.md#adr-001-websocket-with-polling-fallback-for-real-time-dashboard-updates), [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions) |
| Proven by | [TC-904](../quality/test-suites.md#tc-904-degraded-mode--slow-backend), [TC-905](../quality/test-suites.md#tc-905-degraded-mode--backend-unreachable) |
| Confirmed by | Chen Wei (QA), 2024-12-18 |

### 4.1 Network Errors

| Context | Behavior |
|---------|----------|
| Kiosk — data save fails | Inline error on the save button: "Couldn't save. [Try again]". Data stays in the form. |
| Kiosk — data load fails | Retry once automatically. If second attempt fails: "We're having trouble loading your information. Please try again or ask the front desk." |
| Mobile — any API call fails | Inline error + retry button. After 3 retries: "Please try again later or check in at the clinic." |
| Receptionist — save fails | Red banner at top of side panel: "Save failed. Your changes are still here — try again." |
| Receptionist — dashboard load fails | Full-screen error with retry: "Couldn't load the dashboard. [Retry] [Contact support]" |

### 4.2 Validation Errors

All validation errors are inline, directly below the invalid field. Red text, red border on the field.

**Standard validations:**
- Required field empty: "This field is required"
- Invalid phone format: "Please enter a valid phone number"
- Invalid email format: "Please enter a valid email address"
- Invalid zip code: "Please enter a valid zip code"
- Date of birth in the future: "Please enter a valid date of birth"
- Medication dosage empty when medication name is provided: "Please enter the dosage"

Fields validate on blur (when the user moves to the next field) and on submit. No validation while the user is typing (no "invalid" messages appearing mid-keystroke).

### 4.3 Timeout Behavior

| Context | Timeout | Behavior |
|---------|---------|----------|
| Kiosk idle (no touch) | 2 minutes | "Are you still there? [Yes] [Start over]" — 30s countdown. On expiry: session purge, return to welcome. |
| Kiosk data load | 30 seconds | Error screen, return to welcome |
| Mobile session inactive | 5 minutes | Session expires, requires re-verification |
| Mobile check-in link | At appointment time | Link shows expired state |
| Receptionist session | None (staff session) | Standard auth session timeout applies |

### 4.4 Accessibility

- All kiosk screens support screen readers (ARIA labels on all interactive elements)
- Minimum touch target: 44x44px on kiosk, 48x48px on mobile
- Color is never the only indicator of state — icons and text accompany all color-coded badges
- All error messages are announced to screen readers via aria-live regions
- Focus management: when a section expands for editing, focus moves to the first input. When it collapses, focus returns to the edit link.
- Kiosk text size: minimum 18px body text, 24px headings. High contrast mode available (toggle in footer).

---

## 5. Performance-Related Interactions (Round 9)

| Trace | Link |
|-------|------|
| Traced from | [US-006](../product/user-stories.md#us-006-peak-hour-check-in-performance), [E1](../product/epics.md#e1-returning-patient-recognition) |
| Matched by | [ADR-007](../architecture/adrs.md#adr-007-scaling-strategy-for-50-concurrent-sessions), [WebSocket /ws/dashboard/{location_id}](../architecture/api-spec.md#websocket-wsdashboardlocation_id), [GET /dashboard/queue](../architecture/api-spec.md#get-dashboardqueue) |
| Proven by | [TC-901](../quality/test-suites.md#tc-901-50-concurrent-kiosk-check-ins--response-time), [TC-902](../quality/test-suites.md#tc-902-patient-search-performance-under-load), [TC-903](../quality/test-suites.md#tc-903-dashboard-stability-during-peak) |
| Confirmed by | Jamie Park (Design Lead), 2024-12-18 |

### 5.1 Search Debouncing

Both kiosk name search and receptionist patient search:
- Debounce: 300ms after the user stops typing before firing the search API call
- Minimum characters: 2 before any search fires
- If a search is in-flight and the user types more, the in-flight request is cancelled and a new one fires after the debounce
- Results appear incrementally — no waiting for the full result set

### 5.2 Optimistic UI Updates

When a receptionist makes simple edits (phone number, address):
- The UI updates immediately with the new value (optimistic)
- Save happens in the background
- If save fails: value reverts with red flash + error message
- If save succeeds: subtle green flash confirms (but the UI was already showing the new value)

This prevents the UI from feeling sluggish during peak load when API response times increase.

### 5.3 Dashboard Pagination / Virtualization

For locations with many appointments (50+):
- The queue table virtualizes rows — only visible rows are rendered in the DOM
- Scrolling is smooth (no janky re-renders)
- "Load more" or infinite scroll at the bottom if the list exceeds the initial batch
- Real-time updates still apply to off-screen rows (they update in the data model, render when scrolled into view)

### 5.4 Connection Quality Indicator

During degraded performance, a subtle indicator appears in the header area:

| Quality | Indicator |
|---------|-----------|
| Normal | Nothing shown |
| Slow (responses > 3s) | Yellow dot + "System is running slowly" in the header bar |
| Unreachable | Red dot + "Connection lost — data may be outdated" |

This appears on both kiosk and receptionist screens. On mobile, it appears as a small banner below the progress dots.
