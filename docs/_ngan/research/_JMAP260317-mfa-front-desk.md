# MFA (Front Desk) Journey Map — As-Is

**Version:** 1.0.0
**Last Updated:** 2026-03-17 by Ngan

**Purpose:** Design validation and stakeholder communication. Maps the current-state experience of an MFA in an MVZ across a typical day (~40-60 patients processed, continuous multitasking). Identifies pain points, moments of truth, and gaps against the [MFA bird-eye view](FLOW260313-mfa-bird-eye-view.md).

**Persona:** Medizinische Fachangestellte (MFA) at the front desk of an MVZ location. Handles registration, intake, billing, and administrative coordination. Uses a legacy PVS (e.g., CGM or medatixx).

**References:**
- Anti-pattern numbers (e.g., #6, #11) refer to the UX/UI Anti-Patterns table in [product-context.md](../product-context/product-context.md#uxui-anti-patterns)
- 62.4% connector issue rate: KBV Praxisbarometer / gematik TI survey data
- Related journey map: [JMAP260317-doctor-hausarzt.md](JMAP260317-doctor-hausarzt.md) — shared gaps include structured handoff (MFA G7 / Doctor G4), cross-location routing (MFA G22 / Doctor G17), and continuous billing validation (MFA G18 / Doctor G15)
- Step numbers (e.g., steps 17-24) refer to the MFA bird-eye flow, not the doctor bird-eye flow

---

## Journey Diagram

```mermaid
journey
    title MFA (Front Desk) — Typical Day in MVZ (As-Is)

    section Day Start & Preparation
      Log into PVS and open workstation: 3: MFA
      Review daily schedule and patient list: 3: MFA
      Check refill forms and repeat orders: 2: MFA
      Review offline to-do from previous day: 2: MFA
      Prepare waiting room and call list: 3: MFA

    section Patient Registration & Intake
      Greet patient at front desk: 4: MFA, Patient
      Read eGK card: 2: MFA
      Handle eGK read failure or missing card: 1: MFA, Patient
      Resolve cost carrier and insurance: 2: MFA
      Check and verify documents: 2: MFA
      Create or update patient record: 3: MFA
      Create Schein for billing case: 2: MFA
      Check HZV-FAV enrollment status: 2: MFA

    section Pre-Consultation Support
      Resolve patient-related to-dos: 2: MFA
      Perform MFA examination and vitals: 4: MFA, Patient
      Scan and attach external documents: 2: MFA
      Record primary anamnesis: 3: MFA, Patient
      Assign patient to waiting room: 3: MFA
      Signal doctor that patient is ready: 2: MFA

    section During-Consultation Support
      Monitor waiting room and patient flow: 3: MFA
      Handle walk-ins and phone calls: 2: MFA
      Assist doctor with lab orders: 2: MFA, Doctor
      Process incoming lab results: 2: MFA
      Manage parallel registrations: 2: MFA

    section Prescriptions, Forms & Documents
      Process prescription from doctor: 2: MFA
      Print or transmit E-Rezept: 1: MFA
      Update medication plan BMP: 2: MFA
      Fill out and print forms: 1: MFA
      Search for specialist or referral target: 2: MFA
      Prepare referral letter: 2: MFA
      Manage doctor letters and documents: 2: MFA

    section Post-Visit & Day Close
      Process follow-up tasks: 2: MFA
      Edit Schein corrections: 1: MFA
      Run billing validation: 1: MFA
      Prepare end-of-quarter billing submission: 1: MFA
      Review daily stats: 3: MFA
      Clear offline to-do backlog: 2: MFA
```

---

## Phase Details

### Phase 1: Day Start & Preparation (~07:00–08:00)

**Bird-eye steps covered:** 1 (Refill forms), 2 (Schedule appointment — reviewed/adjusted by MFA), 3 (Day preparation), 4 (Daily list / to-do list), 5 (Offline to-do)

**Actions:**
- Arrive early, log into PVS, boot up eGK card reader and printer
- Review the daily appointment schedule — who's coming, what type of visit, any flagged patients
- Process refill form requests that came in overnight or from the prior day (repeat prescriptions, Heilmittel renewals)
- Check offline to-do queue — items deferred from yesterday (missing documents, unresolved insurance, pending callbacks)
- Prepare the waiting room context — verify room assignments, check which doctors are at this location today
- Print or prepare any paper forms needed for the day's expected patient types

**Touchpoints:**
- PVS calendar, daily list, offline to-do queue
- eGK card reader hardware, printer
- Phone (early callbacks from patients), fax machine (incoming documents overnight)
- Paper appointment list (common backup)

**Thoughts & Emotions:**
- *"Dr. Meyer is at Standort B today, so all his patients need to know. Did anyone update the schedule?"*
- *"We have 48 patients today with only two of us at the front desk. Going to be a long one."*
- *"There are 6 refill requests from yesterday. If I don't process them now, patients will call asking."*
- Pragmatic focus — MFAs are used to high volume and plan defensively
- Mild stress about staffing — if a colleague is sick, the workload doubles instantly

**Pain Points:**
- **Refill forms are scattered** — repeat prescription requests arrive via phone, fax, paper drop-off, and sometimes patient portal. No unified inbox. The MFA must check multiple channels every morning.
- **No cross-location schedule visibility** — the MFA doesn't know if patients booked at another Standort need to be rerouted to this location. Rotating doctors create confusion about which patients belong where.
- **Offline to-do lacks priority** — all deferred items sit in one flat list. No severity indicator, no aging, no connection to today's schedule. The MFA triages manually.
- **Hardware startup friction** — card reader, printer, and TI connector all need to be running before the first patient arrives. Any device failure discovered at 08:00 creates immediate chaos.

**Moments of Truth:**
- The first patient arrives at 08:00. If the MFA has already cleared the overnight backlog, processed refills, and verified the schedule, the day starts smoothly. If hardware is down or the to-do queue is overwhelming, the MFA is already behind before the first patient walks in.

---

### Phase 2: Patient Registration & Intake (recurring ~40-60 times/day)

**Bird-eye steps covered:** 6 (Patient registration: calendar / waiting room), 7 (Patient registration: card reading), 8 (Patient registration: check documents), 9 (Patient registration: create patient), 10 (Patient registration: create schein), 11 (Enrollment)

**Actions:**
- Greet patient at the front desk
- Request and read eGK card — PVS initiates VSDM online check via TI connector
- If eGK read fails: troubleshoot (card reader issue, TI connector down, expired card) or switch to Ersatzverfahren (manual entry)
- If card reads successfully: verify patient data, check for insurance changes (Kassenwechsel, Kassenfusion)
- Resolve cost carrier — match VKNR to IK, handle the 8 cost carrier scenarios (valid IK, dissolved carrier, merged carrier, etc.)
- Check required documents — Überweisung from referring doctor, prior authorization, employer certificate for occupational health
- If new patient: create patient record from eGK data or manual entry
- If returning patient: verify and update existing record
- Create Schein — select correct type (0101 GKV, 0102 Überweisung, 0103 Notfall, 0104 Belegärztlich) based on visit context
- Check HZV/FAV enrollment — is the patient enrolled in a selective contract? Does the Teilnahmeerklärung need renewal?

**Touchpoints:**
- eGK card reader, TI connector (VSDM online check)
- PVS patient search, patient creation form, cost carrier resolution
- Schein creation dialog (Schein type, quarter, Kassenart, Fachgruppe)
- HZV/FAV enrollment management
- Paper documents (Überweisung, employer letters, insurance cards from other countries)
- Patient (face-to-face interaction at front desk)

**Thoughts & Emotions:**
- *"Card reader failed again. Third time this morning. The patient is staring at me."*
- *"This patient's insurance company merged last month. The old IK doesn't resolve. Now I have to figure out the new one."*
- *"Is this a 0101 or 0102? The patient says they have an Überweisung but can't find it in their bag."*
- *"They're enrolled in HZV but the Teilnahmeerklärung expired last quarter. Do I re-enroll now or after the visit?"*
- High stress during peaks (08:00-09:30) — queue builds while each registration takes 2-5 minutes
- Embarrassment when technology fails in front of the patient
- Mental load of remembering insurance resolution rules that change quarterly

**Pain Points:**
- **eGK-before-everything gate** (anti-pattern #11) — if the card reader or TI connector fails, the entire registration flow blocks. The MFA must decide between making the patient wait or starting the Ersatzverfahren, which requires manual data entry and later reconciliation.
- **TI error wall** (anti-pattern #6) — when VSDM check fails, the PVS shows cryptic connector error codes (e.g., "VSDM Error 4085") with no plain-language explanation or recovery suggestion. The MFA either guesses or calls IT support.
- **Cost carrier resolution is complex and undocumented** — the 8 IK resolution scenarios are not guided by the PVS. The MFA must memorize rules or consult paper references. Wrong resolution → billing rejection discovered weeks later.
- **Schein type selection is error-prone** (anti-pattern #5) — the MFA must manually select the correct Schein type based on visit context, insurance type, and physician Fachgruppe. In a multi-specialty MVZ, wrong-Schein errors multiply. No automatic resolution from context.
- **Enrollment management is disconnected** — HZV/FAV enrollment status is not surfaced during registration. The MFA must separately navigate to the enrollment module to check. Missed renewals mean the practice loses selective contract revenue.
- **Queue pressure vs. thoroughness tradeoff** — with patients waiting, the MFA is incentivized to rush registration. Skipped document checks or incomplete data entry become downstream billing errors.

**Moments of Truth:**
- Registration is the highest-stakes MFA task. Every error here — wrong Schein, unresolved cost carrier, missed enrollment — propagates through the entire billing chain and surfaces as a rejection weeks later. The MFA carries the accuracy burden for the entire practice's revenue cycle.

---

### Phase 3: Pre-Consultation Support (per patient, after registration)

**Bird-eye steps covered:** 12 (Patient-related to-do's), 13 (MFA examination), 14 (Waiting room assignment), 15 (Scanning and saving external documents), 16 (Primary anamnesis)

**Actions:**
- Resolve patient-specific to-dos (missing documents from prior visit, pending lab results to file, Dauerdiagnosen review flag)
- Perform MFA examination — take vitals (blood pressure, weight, temperature), basic measurements depending on visit type
- Scan and attach external documents — hospital discharge letters, specialist reports, lab results from external labs, patient-brought paperwork
- Record primary anamnesis — structured intake form with chief complaint, symptom duration, current medications
- Pre-fill DMP vitals and medication data when applicable
- Assign patient to correct waiting room / treatment room
- Signal the doctor that the patient is ready (system status change, verbal, or paper note)

**Touchpoints:**
- Patient to-do list, vitals entry screen
- Scanner, document attachment interface
- Anamnesis form (structured or free text depending on PVS)
- Waiting room board / assignment interface
- Examination devices (blood pressure monitor, scale — usually manual entry into PVS)
- Doctor (handoff signal)

**Thoughts & Emotions:**
- *"The patient brought a hospital letter from 3 weeks ago. I need to scan it before the doctor sees them, but there are 4 people waiting to register."*
- *"Blood pressure is unusually high — should I flag this for the doctor or just enter the value?"*
- *"The doctor likes anamnesis notes in a specific format, but the PVS form doesn't match."*
- Torn between completing thorough intake and keeping the queue moving
- Satisfaction when handoff is clean and the doctor has everything they need

**Pain Points:**
- **Scanning is slow and disconnected** — scanning external documents requires physical scanner operation, then manual attachment to the correct patient in the PVS. No OCR, no auto-categorization, no summary extraction. A 4-page hospital letter becomes an opaque PDF blob.
- **Anamnesis format varies by doctor** — different doctors want intake notes structured differently. The PVS offers one generic form. MFAs learn each doctor's preferences informally.
- **Vitals entry is manual** — even when devices can output data digitally, most practices enter vitals manually because device integration (GDT) is unreliable or not configured. Double handling.
- **Waiting room state is invisible** — there's no real-time board showing which patients are where in the flow (registered → intake done → vitals taken → waiting → in treatment). MFAs use paper lists or whiteboard. Relates to anti-pattern #13 (hidden workflow state).
- **Handoff to doctor has no confirmation** — the MFA marks the patient as "ready" but has no feedback that the doctor has seen this signal or opened the patient. If the doctor is running behind, patients wait in limbo.
- **Parallel task pressure** — while doing intake for one patient, the phone rings, another patient arrives to register, and a lab result comes in by fax. The PVS doesn't help manage this concurrency.

**Moments of Truth:**
- The quality of the MFA's pre-consultation work directly determines the doctor's consultation quality. A thorough intake (complete anamnesis, vitals entered, documents scanned, enrollment checked) saves the doctor 2-3 minutes per patient. A rushed intake creates downstream friction that the doctor and MFA both pay for.

---

### Phase 4: During-Consultation Support (ongoing while doctor sees patients)

**Bird-eye steps covered:** None directly. Steps 17-24 on the MFA board are doctor-owned consultation steps (Doctor preparation through Therapy). The MFA's concurrent support activities during this phase — waiting room monitoring, walk-ins, phone calls, lab filing, parallel registrations — have no corresponding steps in the bird-eye flow. This is the structural gap identified as G10.

**Actions:**
- Monitor waiting room — track patient flow, manage wait times, handle patient questions about delays
- Handle walk-ins and phone calls — unscheduled patients, appointment requests, prescription refill calls, insurance inquiries
- Assist doctor with lab orders — prepare lab tubes, print labels, send orders to external lab
- Process incoming lab results — receive via LDT import, fax, or mail; file into correct patient record
- Run parallel registrations — while one patient is with the doctor, the MFA registers the next 2-3 patients
- Manage room turnover — clean exam rooms, prepare equipment for next patient type
- Relay urgent messages between doctor and patients/external callers

**Touchpoints:**
- Waiting room board (if it exists in PVS, otherwise paper/whiteboard)
- Phone, fax machine
- Lab order module, lab result inbox
- Patient registration (parallel processing)
- Internal messaging (usually verbal — PVS rarely has MFA-to-doctor messaging)

**Thoughts & Emotions:**
- *"Herr Wagner has been waiting 45 minutes. He's getting upset. The doctor is still with the previous patient."*
- *"Phone is ringing, there are 3 people at the counter, and a lab result just came in that might be urgent."*
- *"The doctor asked me to order the blood work 20 minutes ago. I haven't had time yet."*
- This is the most stressful phase — constant interruptions, competing priorities, no way to queue or triage systematically
- Professional pride in keeping the practice running despite chaos

**Pain Points:**
- **No patient flow board** (anti-pattern #13) — the MFA has no real-time view of where every patient is in the process. Who is registered? Who has vitals done? Who is with the doctor? Who is ready to leave? Paper lists and memory fill this gap.
- **Phone interrupts everything** — phone calls interrupt active registration, intake, and document processing. The PVS doesn't support "pause and resume" for in-progress tasks. Context is lost.
- **Lab result filing is manual and error-prone** — results arrive from multiple sources in different formats (LDT electronic, fax, mail). The MFA must identify the patient, open their record, and attach the result. Misfiles can have clinical consequences.
- **No MFA-to-doctor digital communication** — the MFA can't send the doctor a quick system message ("Lab results are in for room 3" or "Patient in room 2 is anxious"). Everything is verbal or paper-based, requiring physical interruption.
- **Walk-in management conflicts with scheduled flow** — unscheduled patients disrupt the registration queue and the doctor's schedule. No triage logic in the PVS to help decide priority.
- **Multitasking without system support** — the MFA juggles 3-4 tasks simultaneously (registration, phone, lab filing, waiting room management), but the PVS is designed for single-task serial workflows. No split-screen, no task queue, no priority dashboard.

**Moments of Truth:**
- The MFA's ability to keep the practice flowing during peak hours is invisible to everyone except when it breaks down. If one critical task is dropped (urgent lab result not flagged, patient left waiting without registration), the entire practice flow cascades into delays. The PVS should make this orchestration visible and manageable, not invisible.

---

### Phase 5: Prescriptions, Forms & Documents (during/after encounter, often delegated by doctor)

**Bird-eye steps covered:** 25 (Prescription — medication, BMP, HEIMI, HIMI), 26 (Forms), 27 (Doctor search), 28 (Doctor letter / documents), 29 (Forms / referral letter)

**Actions:**
- Receive prescription order from doctor (verbal, handwritten, or via PVS prescription module)
- Process medication prescription — verify drug, dosage, package size in PVS; print Muster 16 or transmit E-Rezept
- Update Bundeseinheitlicher Medikationsplan (BMP) if patient is on multiple medications
- Process Heilmittel (HIMI) and Hilfsmittel (HEIMI) prescriptions — different forms, different rules
- Fill out forms — eAU (electronic sick leave), BFB forms with PDF417 barcodes, Muster forms
- Prepare referral letters (Überweisung) — auto-fill from encounter data where possible, manually complete the rest
- Search for specialist doctors if the doctor requests a specific referral target
- Format, print, or send doctor letters (Arztbriefe) — via KIM, fax, or print for mail

**Touchpoints:**
- Prescription module (medication search, ABDA database)
- E-Rezept signing infrastructure (QES, HBA card, TI connector)
- BMP editor
- Forms module (eAU, BFB, Muster templates)
- KBV doctor search
- KIM (secure email for eAU, eArztbrief transmission)
- Printer, fax machine, physical mail

**Thoughts & Emotions:**
- *"The doctor's handwriting says... Ramipril 5mg? Or Amlodipin 5mg? I can't read this."*
- *"E-Rezept signing failed. Again. I'll just print the Muster 16."*
- *"This is the third BFB form for this patient today. Why can't the system remember what it already knows?"*
- *"The doctor wants a referral to a Kardiologe in our MVZ. Why do I have to search the KBV directory for our own colleague?"*
- Tedious but critical — errors in prescriptions or forms have legal and patient-safety consequences
- Frustration with redundant data entry across forms

**Pain Points:**
- **E-Rezept failure chain** (anti-pattern #6) — E-Rezept requires TI connector + HBA card + QES PIN. MFA often handles the mechanical process while the doctor provides the signature. Any link in this chain failing means fallback to paper. The MFA bears the troubleshooting burden.
- **Form redundancy** (anti-pattern #15) — each Muster form is an isolated module. Patient data, diagnoses, LANR/BSNR must be re-entered or verified per form rather than auto-filling from the encounter. Three forms for one patient = three rounds of the same data entry.
- **Prescription handoff is unstructured** — the doctor communicates prescriptions verbally, on paper, or through incomplete PVS entries. The MFA must interpret and complete them. Ambiguity creates safety risks.
- **BMP maintenance is manual** — updating the medication plan requires the MFA to reconcile the current prescription with all existing medications. No automatic merge, no duplicate detection, no interaction flagging at the MFA level.
- **KIM transmission failures are opaque** — when eAU or eArztbrief transmission fails via KIM, the error messages are technical. The MFA doesn't know if it's a recipient address issue, a TI problem, or a format error.
- **No MVZ-internal directory** — searching for a colleague in the same MVZ uses the same KBV doctor search as finding an external specialist. No organizational awareness.

**Moments of Truth:**
- Prescriptions and forms are where small MFA errors have outsized consequences — wrong drug, wrong dose, wrong form type. The PVS should make the correct action easier than the incorrect one. Currently, the system is neutral at best and actively confusing at worst.

---

### Phase 6: Post-Visit & Day Close (end of day / between patients / end of quarter)

**Bird-eye steps covered:** 30 (Follow-up processing), 31 (Edit schein), 32 (Billing correction), 33 (Stats / report)

**Actions:**
- Process follow-up tasks — items deferred during the rushed day (unfiled documents, incomplete registrations, pending callbacks)
- Edit Schein corrections — fix wrong Schein types, missing diagnoses, incorrect quarter assignments flagged by validation or doctor request
- Run billing validation — check for missing GOPs, invalid ICD/GOP combinations, incomplete Scheine across the day's patients
- At end of quarter: prepare and submit KV billing file (KVDT generation, XPM validation, XKM encryption)
- 1-Click-Abrechnung via KIM (if available) or manual submission
- Handle billing rejections from prior quarters — investigate, correct, resubmit
- Review daily/weekly statistics if time permits
- Clear offline to-do backlog — items that accumulated during the day
- Prepare for next day — flag patients who need follow-up calls, pending document requests

**Touchpoints:**
- Offline to-do / follow-up queue
- Schein management (edit mode)
- Billing validation module, KVDT generator
- KIM (for billing submission)
- Stats / reporting dashboard
- Doctor (for Schein correction approvals)

**Thoughts & Emotions:**
- *"It's 17:30 and I have 14 Schein corrections. Half of them are from Dr. Weber who never selects the right Schein type."*
- *"Quarter end is next week. I've been running billing validation daily to avoid the March 31st disaster."*
- *"The KV rejected 12 cases from last quarter. Each one takes 10-15 minutes to investigate and fix."*
- *"I never look at the stats. They don't tell me anything I can act on."*
- End of day exhaustion — administrative cleanup feels thankless
- Quarter-end anxiety — billing submission carries financial consequences for the entire practice
- Resentment toward upstream errors — the MFA fixes problems created by incomplete doctor documentation

**Pain Points:**
- **End-of-quarter error dump** (anti-pattern #9) — without continuous validation, billing errors accumulate silently throughout the quarter and surface as a massive error list at submission time. Each error requires the MFA to reconstruct context from weeks or months ago.
- **Schein corrections require doctor involvement** — many Schein edits need the doctor's input or approval (e.g., adding a missing diagnosis). But the doctor has left for the day or is at another location. Corrections stall.
- **Billing rejection investigation is archaeology** — rejected cases from prior quarters require the MFA to reopen patient records, understand what happened during an encounter they may not remember, and determine the correct fix. Time-consuming and error-prone.
- **No continuous validation** — the PVS doesn't flag billing issues in real-time during registration or encounter documentation. Instead, validation runs as a batch at submission time. By then, fixing is 10x harder than preventing.
- **Stats are data dumps, not insights** — reporting screens show raw numbers without context, trends, or actionable recommendations. No traffic-light overview, no comparison to prior periods, no flagging of anomalies.
- **Administrative debt is invisible** — there's no single view showing "here is everything that needs to be done before you can leave today." Items hide in separate queues (follow-up, Schein corrections, unsigned documents, billing errors, offline to-dos).
- **Quarter-end is a crisis, not a process** — Quartalsabrechnung should be continuous reconciliation throughout the quarter. Instead, it's compressed into the last days, creating overtime, stress, and elevated error rates.

**Moments of Truth:**
- The MFA is the last line of defense for the practice's revenue. Every billing error that slips through means rejected claims, delayed reimbursement, and potential audit flags. A PVS that supports continuous validation and surfaces errors at the point of creation — not at quarter end — transforms the MFA's most stressful task into a manageable daily routine.

---

## Gap Analysis: Journey Map vs. Bird-Eye View

### Gaps Found — Missing from the Bird-Eye Flow

| # | Gap | Journey Phase | Impact | Notes |
|---|-----|--------------|--------|-------|
| G1 | **Hardware startup and readiness check** | Phase 1 | Medium | The bird-eye flow starts at "Refill forms." It doesn't account for the daily ritual of booting card readers, printers, verifying TI connector status, and confirming hardware readiness before the first patient arrives. Hardware failure at 08:00 is a daily risk. |
| G2 | **Refill request consolidation across channels** | Phase 1 | Medium | "Refill forms" (step 1) is listed as a single step, but requests arrive via phone, fax, paper drop-off, and patient portal. The multichannel intake and triage of refill requests is a complex subflow, not a single task. |
| G3 | **eGK failure and Ersatzverfahren fallback** | Phase 2 | High | Steps 7 (card reading) doesn't represent what happens when the eGK read fails — which happens frequently (62.4% connector issue rate). The Ersatzverfahren path (manual entry, later reconciliation) is a separate workflow with its own steps and pain points. Relates to anti-pattern #11. |
| G4 | **Cost carrier resolution complexity** | Phase 2 | High | The bird-eye flow doesn't mention cost carrier resolution at all. This is one of the MFA's most complex tasks — 8 different IK resolution scenarios (valid IK, Kassenfusion, dissolved carrier, etc.) that the PVS should guide but currently doesn't. |
| G5 | **Schein type auto-resolution** | Phase 2 | High | "Create schein" (step 10) is a single step, but selecting the correct Schein type (0101-0104) based on visit context, insurance type, and physician Fachgruppe is error-prone in multi-specialty MVZ. Relates to anti-pattern #5. No auto-resolution from context. |
| G6 | **HZV/FAV enrollment surfacing during registration** | Phase 2 | Medium | "Enrollment" (step 11) exists as a separate step. In the as-is state, enrollment is checked during registration (shown in diagram) but in a disconnected module — the MFA must navigate away from the registration flow to check status. The gap is inline surfacing within the registration flow, not the timing. Missed renewals = lost selective contract revenue. |
| G7 | **Structured handoff signal to doctor** | Phase 3 | High | The bird-eye flow shows MFA examination (step 13) and waiting room assignment (step 14) but doesn't represent the handoff mechanism to the doctor. How does the doctor know the patient is ready and what the MFA found? Currently verbal in most practices. Mirror of Doctor journey map gap G4. |
| G8 | **Scanning workflow and document categorization** | Phase 3 | Medium | "Scanning and saving external documents" (step 15) is a single step, but the actual workflow involves physical scanning, manual patient matching, document categorization, and quality verification. No OCR, no auto-categorization, no summary extraction. |
| G9 | **Doctor-specific anamnesis preferences** | Phase 3 | Low | "Primary anamnesis" (step 16) doesn't account for the fact that different doctors want intake notes in different formats. The MFA informally learns each doctor's preferences. No system support for doctor-specific templates. |
| G10 | **Concurrent task management during consultations** | Phase 4 | High | The bird-eye flow shows consultation steps (17-24) linearly, but from the MFA's perspective, this phase is concurrent — monitoring waiting room, handling walk-ins, taking phone calls, processing lab results, and running parallel registrations simultaneously. The flow's linear structure completely misses the MFA's multitasking reality. |
| G11 | **Walk-in and phone call management** | Phase 4 | Medium | Not represented in the bird-eye flow at all. Walk-ins disrupt the scheduled flow, phone calls interrupt every task, and the PVS provides no triage or queuing support for either. |
| G12 | **MFA-to-doctor digital messaging** | Phase 4 | Medium | No step in the bird-eye flow represents MFA-doctor communication during consultation. Currently verbal, requiring physical interruption. A digital messaging or flagging system is absent from both the flow and current PVS. |
| G13 | **Lab result filing from multiple sources** | Phase 4 | Medium | "Laboratory" appears in the flow but only from the doctor's perspective. The MFA's job of receiving, identifying, patient-matching, and filing lab results from multiple sources (LDT, fax, mail) is invisible. |
| G14 | **Prescription handoff clarity** | Phase 5 | High | The bird-eye flow shows "Prescription" (step 25) with medication subtypes, but doesn't represent how the prescription order gets from doctor to MFA. Verbal, handwritten, or incomplete PVS entries create ambiguity and safety risk. |
| G15 | **E-Rezept failure and fallback from MFA perspective** | Phase 5 | High | The prescription step doesn't show the E-Rezept failure path. The MFA bears the troubleshooting burden — card reader issues, TI connector failures, QES signing problems — and must manage the fallback to paper Muster 16. |
| G16 | **BMP reconciliation workflow** | Phase 5 | Medium | BMP is listed as a prescription subtype but updating the medication plan is a distinct reconciliation task — merging new prescriptions with existing medications, checking for duplicates, resolving conflicts. Not a simple "print" step. |
| G17 | **KIM transmission error handling** | Phase 5 | Medium | Document transmission via KIM (eAU, eArztbrief) can fail, and the error messages are technical. The MFA's recovery workflow — retry, alternative channel, manual sending — is not represented. |
| G18 | **Continuous billing validation throughout the quarter** | Phase 6 | High | "Billing correction" (step 32) is positioned as a post-visit step. But validation should trigger continuously during registration and encounter documentation, not accumulate for batch correction. Relates to anti-pattern #9. |
| G19 | **Quarter-end billing submission workflow** | Phase 6 | High | "Stats / report" (step 33) ends the flow, but the Quartalsabrechnung — KVDT generation, XPM validation, XKM encryption, KIM submission — is a major end-of-quarter event with its own multi-step workflow. Not represented. |
| G20 | **Billing rejection investigation from prior quarters** | Phase 6 | Medium | Not in the bird-eye flow. Handling KV rejections from prior quarters is a recurring task — investigate, correct, resubmit. Requires reconstructing context from old encounters. |
| G21 | **Unified "day done" / administrative debt view** | Phase 6 | Medium | No concept in the bird-eye flow of a single view showing all outstanding work — unfiled documents, unsigned letters, Schein corrections, pending callbacks, billing errors. Items hide across separate queues. |
| G22 | **Cross-location patient routing** | Cross-phase | High | The entire bird-eye flow assumes a single location. In an MVZ, patients may need to be rerouted between Standorte (doctor at another location, equipment only at one site, appointment moved). The MFA coordinates this but the flow doesn't show it. |
| G23 | **Staffing and coverage awareness** | Cross-phase | Medium | The flow doesn't account for the MFA knowing which doctors are at which location today, who is covering for whom, and how that affects registration (which Schein, which LANR/BSNR). Critical for MVZ with rotating staff. |
| G24 | **Patient communication and expectation management** | Cross-phase | Medium | The MFA spends significant time managing patient expectations — explaining wait times, answering insurance questions, handling complaints about delays. This interpersonal workload is completely absent from the flow. |
| G25 | **Break and interruption recovery** | Cross-phase | Low | Real MFA workdays include lunch breaks, shift handoffs, and unplanned interruptions. The flow doesn't account for task continuity across breaks — how does an MFA resume a half-completed registration after lunch? |

### Structural Observations

**What the bird-eye flow does well:**
- Comprehensive coverage of MFA task types from intake through reporting
- Correct positioning of registration as a multi-step subprocess (steps 6-10)
- Includes the full patient journey arc, not just MFA-isolated tasks
- Explicitly groups prescription subtypes (medication, BMP, HEIMI, HIMI)

**What the bird-eye flow structurally misses:**
- **The concurrency dimension** — the flow is sequential, but the MFA's reality is deeply parallel. At any moment, the MFA is juggling registration, phone calls, lab results, waiting room management, and doctor support simultaneously. This is the single biggest gap.
- **The MVZ dimension** — like the doctor flow, this reads as a single-location workflow. Cross-location routing, multi-site staffing, and rotating doctors are absent.
- **The failure dimension** — happy-path only. eGK failures, TI connector issues, KIM transmission errors, and billing rejections are daily realities that each trigger alternative workflows.
- **The communication dimension** — the MFA is the communication hub of the practice. Patient-facing, doctor-facing, and external communication (phone, fax, KIM) are all absent from the flow.
- **The quarterly cycle** — the flow implies a single-day arc, but the MFA's work has a quarterly rhythm (Quartalsabrechnung) that is a major stress event. Only "billing correction" and "stats/report" hint at this.

---

## Summary: Top 5 Gaps by Design Impact

| Priority | Gap | Why It Matters for Design |
|----------|-----|--------------------------|
| 1 | **Concurrent task management (G10)** | The MFA's core challenge is managing 3-4 parallel activities with a PVS designed for serial single-task workflows. Designing for MFA concurrency (split views, task queue, quick-switch, notification prioritization) is the single most impactful UX improvement possible. |
| 2 | **eGK failure and Ersatzverfahren fallback (G3)** | This happens multiple times daily and blocks the entire registration flow. The fallback path must be as smooth as the happy path — one click to switch to Ersatzverfahren, automatic reconciliation when the card is read later. Anti-pattern #11 makes this explicit. |
| 3 | **Cost carrier resolution guidance (G4)** | 8 resolution scenarios, quarterly rule changes, and no PVS guidance. Getting this wrong means billing rejection. A guided cost carrier resolution wizard would eliminate one of the MFA's highest-anxiety tasks. |
| 4 | **Continuous billing validation (G18)** | Transforms Quartalsabrechnung from a quarter-end crisis into a daily non-event. Requires validation triggers embedded throughout registration and encounter documentation. Anti-pattern #9 makes the case clearly. |
| 5 | **Cross-location patient routing (G22)** | This is CorePVS's MVZ differentiator. If the PVS doesn't help the MFA route patients across locations, manage rotating doctors, and handle cross-site scheduling, it's just another single-practice system. Must be designed from day one. |
