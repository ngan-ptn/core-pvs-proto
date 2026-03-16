# CorePVS — Product Context

**Version:** 1.3.0
**Last Updated:** 2026-03-16 by Ngan

**Note:** This document primarily describes the main application (`apps/main-app/`). The event-demo application (`apps/event-demo/`) may only implement a subset of what's described here.

**See also:**
- Design system: [tini-library](https://github.com/tini-works/tini-library)
- Copy & tone: `../../guidelines/copy-guidelines.md`
- Domain glossary: [domain-glossary.md](domain-glossary.md)

---

## Product Vision

Independent, certification-ready components that compose into a white-label practice management system.

**Target vision:** "The PVS that masters MVZ complexity — intelligent, connected, scalable."

---

## Problem

**Note:** Problem's derived from use-cases-demo

### MVZ-specific structural pain points

MVZs (Medizinische Versorgungszentren) face complexity that single-practice PVS systems were never designed for:

- **Multiple locations** — no unified view, no cross-location optimization
- **Multiple specialties** — different workflows, resource types, and billing rules under one organization
- **Changing practitioners** — staff rotates across locations; systems don't follow
- **Centralized control vs. decentralized work** — leadership needs oversight, staff needs autonomy

### Operational blind spots

- No-show rates go undetected — no pattern analysis across locations
- Practitioner performance invisible — no benchmarking within specialties
- Expensive resources underutilized (CT/MRI) — no cross-location capacity balancing
- No cross-location capacity optimization — demand/supply mismatch stays hidden

### Integration failures

- Media disruption between HIS (hospital) and MVZ — paper-based referrals, fax, phone
- Duplicate data entry — patient registered separately in each system
- No real-time data exchange — findings, appointment status, and diagnostic requests transferred manually
- No structured, audit-proof data transfer between sectors

### Management gaps

- Gut-feeling decisions — no operational data to steer the organization
- No transparency across locations — leadership can't see what's happening in real time

`<!-- TBD: quantified market data -->`

---

## Competitive Landscape

Primary positioning: clear differentiation from single-practice PVS. Full analysis in [competitive-landscape.md](../_ngan/competitive-landscape.md).

### What existing PVS systems offer

Most vendors (CGM, medatixx, tomedo, Epikur, T2med) claim MVZ support, but this typically means multi-BSNR locations, shared patient data (partial), central billing, and per-location user access. Each location still operates as an independent practice.

### What's missing — the orchestration gap

| Capability | Existing PVS |
|:--|:--|
| Cross-location scheduling | Not available |
| Shared resource optimization (CT/MRI) | Not available |
| Cross-location capacity balancing | Not available |
| Organization-wide dashboards | Not available |
| Cross-location analytics | Not available |

### Positioning matrix

| Quadrant | Vendors |
|:--|:--|
| Single practice / low intelligence | tomedo, Epikur |
| Multi-practice / low intelligence | CGM, medatixx |
| Single practice / medium intelligence | T2med |
| **Multi-location orchestration** | **CorePVS (unoccupied market space)** |

### Cross-sector threats

Future competition is more likely from platform companies than legacy PVS vendors:

| Player | Risk |
|:--|:--|
| Doctolib | Expanding from scheduling into practice management |
| Hospital HIS vendors (Dedalus, Nexus) | Moving from inpatient into outpatient networks |
| Cloud-native PVS startups | Modern architectures, no legacy constraints |

These platforms offer network orchestration but lack certified PVS billing capabilities — CorePVS needs both.

---

## Solution

A modular PVS built natively for MVZ complexity:

- **Cross-sector integration (HIS ↔ MVZ)** — structured, audit-proof data transfer via HL7/FHIR; no media disruption, no duplicate data entry
- **Intelligent appointment and resource planning** — rule-based (no AI required); considers specialty, provider availability, device capacity, location utilization
- **Real-time operational dashboard** — traffic-light KPIs (red/yellow/green) with drill-down from high-level overview to detailed breakdown
- **Decision support, not automation** — system suggests next steps, never auto-executes
- **White-label, certification-ready components** — each component is a standalone mini-app that composes into a full PVS
- **Complete patient pathway** — from hospital admission through MVZ treatment to case closure, all in one connected flow

---

## Value Proposition

### For MVZ operations

- **Reduction of idle times** through intelligent appointment control
- **Fewer incorrect bookings** due to automated resource logic
- **Improved utilization of expensive resources** (especially CT/MRI)
- **Higher quality of care** through complete, up-to-date patient data
- **Improved patient satisfaction** — fewer waiting times, fewer duplicate examinations
- **First PVS to give MVZ leadership real operational transparency**

### Differentiator vs. single-practice PVS

Orchestration across locations, specialties, and resources. Single-practice systems treat each location as an island. CorePVS treats the entire MVZ as one connected organization.

---

## Target Users

Two primary user roles in the practice setting:

### MFA (Medizinische Fachangestellte) — Front Desk

Core tasks:
- Patient registration (eGK card read-in / manual entry)
- Cost carrier resolution (8 scenarios: valid IK, Kassenfusion, dissolved carriers, etc.)
- Schein management (record types 0101–0104, quarter transitions, referrals)
- HZV/FAV enrollment (Teilnahmeerklärung lifecycle, participation management)
- Billing submission (KV billing file generation, 1-Click-Abrechnung)
- Forms processing (eAU, BFB form printing)

### Doctor (Arzt) — Patient Care

Core tasks:
- Diagnosis coding (ICD-10-GM with SDKRW rule engine, Diagnosensicherheit V/G/A/Z)
- Service documentation (GOP entry, OPS procedure codes, psychotherapy documentation)
- Prescriptions (E-Rezept with FHIR bundle generation, QES signing, drug safety checks)
- eDMP management (8 chronic disease programs: Diabetes 1&2, Asthma, COPD, KHK, Heart Failure, Breast Cancer, Depression)
- eArztbrief / ePA exchange (HL7 CDA R2, document upload/retrieval)

### Secondary users (dashboard context)

- **MVZ Management** — operational oversight across all locations
- **Site / Practice Managers** — location-level performance monitoring
- **Medical Directors** — quality and efficiency insights (optional)

`<!-- TBD: deeper persona details -->`

---

## JTBD Ladder

**Note:** MFA and Doctor jobs are derived from the Roadmap. MVZ Managemet is from use-cases-demo. 

### MFA — Core Jobs

> "When a patient arrives, help me register them quickly and accurately so billing starts correctly."

> "When insurance changes, help me resolve the cost carrier so claims aren't rejected."

> "When the quarter ends, help me submit billing files with zero errors."

> "When a patient enrolls in HZV/FAV, help me manage the Teilnahmeerklärung lifecycle so nothing falls through."

### Doctor (Arzt) — Core Jobs

> "When I see a patient, help me code the diagnosis correctly so it passes SDKRW validation."

> "When I prescribe medication, help me generate a compliant E-Rezept with safety checks."

> "When I treat a chronic patient, help me complete eDMP documentation so nothing is missing."

> "When I receive a hospital referral, help me see the patient's data without re-entering it."

### MVZ Management — Core Jobs

> "When I review operations, help me spot inefficiencies across locations so I can act before they become problems."

> "When resources are underutilized at one location, help me see where demand exists so I can rebalance."

`<!-- TBD: supporting jobs, emotional jobs, social context -->`

---

## Current Scope

Building modular, certification-ready components. Phase 1 first.

### Feature Status

| Feature Area | Status |
|:--|:--|
| Patient Data Management (Phase 1) | In progress |
| Diagnosis, Coding & Service Documentation (Phase 2) | Planned |
| Billing & Submission (Phase 3) | Planned |
| Prescription Management / E-Rezept (Phase 4) | Planned |
| Forms, eAU & ePA (Phase 5) | Planned |
| eDMP / eDocumentation (Phase 6) | Planned |
| Foundation & Practice Infrastructure (Phase 7) | Planned |

---

## Roadmap Summary

7 phases, derived from four requirement sources (KVDT, ICD-10-GM, SV Components, Crucial Workflows). Full details in [roadmap-phases](https://github.com/tini-works/requirement-documents/tree/main/docs/roadmap-phases).

**Phase 1 — Patient Data Management** (~72 reqs + SV)
Complete patient registration — eGK card reading, manual entry, cost carrier resolution, Schein lifecycle, and HZV/FAV enrollment and participation workflows.

**Phase 2 — Diagnosis, Coding & Service Documentation** (53 + ~37 reqs + SV)
ICD-10-GM coding with SDICD/SDVA/SDKRW master data, HZV/FAV diagnosis rules, GOP entry, OPS coding, psychotherapy documentation, and HZV/FAV service filtering.

**Phase 3 — Billing & Submission** (~25 reqs + SV)
KVDT billing file generation, XPM validation, XKM encryption, 1-Click submission via KIM, and the complete HZV/FAV billing pipeline.

**Phase 4 — Prescription Management / E-Rezept** (~407 reqs)
Full electronic prescription workflow — drug search, FHIR bundle generation, QES signing, E-Rezept Fachdienst — plus Heilmittel, Hilfsmittel, eVDGA, and BMP.

**Phase 5 — Forms, eAU & ePA** (~82 reqs)
Electronic sick leave certificates, BFB form printing with PDF417 barcodes, electronic doctor letters via KIM, and ePA document operations.

**Phase 6 — eDMP / eDocumentation** (~109 reqs)
Structured data capture for 8 chronic disease management programs and electronic skin cancer screening documentation.

**Phase 7 — Foundation & Practice Infrastructure** (~41 reqs + SV)
System backbone — master data, user/access control, TI reporting, and HZV/FAV contract infrastructure that every downstream module depends on.

---

## Design Constraints

| Constraint | Rationale |
|:--|:--|
| Desktop-only (24" monitors) | Target environment is practice workstations |
| No responsive / no mobile | Not needed for MFA/doctor workflows |
| White-label ready | Product serves multiple customers with their branding |
| Certification scope | ~70–80% baseline must pass certification unchanged |
| Design system | [tini-library](https://github.com/tini-works/tini-library) — baseline visual identity; customer theming applied on top |
| German-language UI | Primary market; domain terms are German healthcare standards |

---

## Primary UX Axes

Three measurable axes that guide every design decision:

| Axis | Principle | How Measured | Anchor Examples |
|:--|:--|:--|:--|
| **Speed** <br>*Time to complete key tasks.* | Digital workflow ≤ analog equivalent it replaces. | Task-completion time benchmarked against analog. <br>Interaction steps (clicks/keystrokes) ≤ analog. <br>Time targets baselined per phase via usability testing. | Registration ≤ paper check-in. <br>ICD coding ≤ printed catalog. <br>Befund ≤ handwritten notes. <br>E-Rezept ≤ Muster 16. |
| **Safety / Clarity** <br>*Read-only vs. editable is unambiguous at a glance.* | No accidental modification of unowned data. | **Design audit:** read-only has distinct treatment (color, lock icon, non-interactive); confirmation proportional to impact. <br>**Usability test:** editable fields identified within 3s; zero accidental edits on read-only data. | — |
| **Density** <br>*Supports high-volume clinical workflow without "scroll hunting".* | Role workspace shows all key actions and status without scrolling on 24" (1920×1080). | Primary controls visible without scrolling. <br>Secondary info one click away (progressive disclosure). | — |

---

## UX Principles

6 design principles derived from source documents and product positioning. These govern how every screen and interaction should behave.

**Traffic-light logic (red / yellow / green)**
Immediate status interpretation without reading text. Used in dashboard KPIs, location health indicators. Every status must be visually parseable at a glance.

**Drill-down pattern: overview → detail**
High-level aggregated view (all locations) → click for detailed breakdown (by weekday, time, specialty, practitioner). Users should never need to navigate away to understand a metric.

**Clear visual separation: external vs. own data**
External data (e.g., hospital records) is read-only and visually highlighted. Own documentation is editable and legally independent. This is both a UX pattern and a legal requirement.

**Decision support, not automation**
System suggests next steps but never auto-executes. Dashboard recommends rebalancing capacity; user decides. This applies across all features — the PVS informs, the human acts.

**All states for every screen**
Empty state, error state, loading state, current/populated state. This is a design deliverable requirement: every screen must show how it behaves in every state.

**Checkable against requirements**
Definition of done for design: every PM requirement must be verifiable against delivered screens, flows, and transitions. Design is not decorative; it's a specification.

---

## UX/UI Anti-Patterns

Patterns to actively avoid. Derived from CorePVS product principles and German healthcare market research.

**Key sources:** Zi PVS Survey (10,245 evaluations), gematik TI-Score, AHRQ/PSNet Alert Fatigue research, Nielsen Norman Group Medical Usability, KBV Anforderungskatalog.

| # | Anti-Pattern | Why It Fails | Better Pattern |
|:--|:--|:--|:--|
| | **— CorePVS Product Principles** | | |
| 1 | **Auto-Execution Without Confirmation** | Violates "decision support, not automation". Billing/prescription auto-actions carry legal risk; propagate across MVZ locations. | Suggest, never auto-execute. Confirmation proportional to impact. <br>*E.g., "Rebalance Kardio appointments to Standort B?" with confirm/dismiss — not auto-moved.* |
| 2 | **Ambiguous Edit States** | External data (HIS records) accidentally modified = legal risk. Read-only vs. editable must be instant. | Visually distinct treatments for external (read-only) vs. own (editable) data. <br>*E.g., hospital referral data in grey with lock icon; own Befund in white with editable fields.* |
| 3 | **Generic Error Messages** | "Something went wrong" blocks MFA from recovering rejected billing or failed E-Rezept signing. | Actionable, domain-specific: entity + problem + fix step. <br>*E.g., "Schein 0101: missing ICD for GOP 01100 — add diagnosis to continue."* |
| | **— German Healthcare Market** | | |
| 4 | **Certification-Driven UI** | KBV tests billing format, not usability. UIs mirror KVDT fields instead of clinical workflow. | Design for encounters first; map to KVDT in the data layer. <br>*E.g., registration screen groups by patient context, not by Feldkennung 3000–3999.* |
| 5 | **Schein-Centric Navigation** | Forces Schein selection before documenting. Wrong-Schein errors multiply in multi-specialty MVZ. | Patient-centric nav with automatic Schein resolution from context. <br>*E.g., opening a patient auto-selects the correct Schein based on physician Fachgruppe + Kassenart + quarter.* |
| 6 | **TI-Error-Wall** | Raw Konnektor error codes block check-in. 62.4% of practices report connector issues. | Graceful degradation + plain-language recovery + offline Ersatzverfahren. <br>*E.g., "eGK read failed — continue with Ersatzverfahren?" instead of "VSDM Error 4085".* |
| 7 | **Undifferentiated Alert Fatigue** | ABDA, Priscus, BtM, budget alerts all equal. 49-96% override rates. Safety alerts get ignored. | Severity-tiered, role-tailored. Hard-stop only for critical interactions. <br>*E.g., red blocking alert for severe drug interaction; yellow inline note for Wirtschaftlichkeit.* |
| 8 | **Modal-Dialog Gauntlet** | Each E-Rezept step as blocking modal. 15s paper task → 45s click-through. Blocks data comparison. | Single composable view, smart defaults, batch-sign per session. <br>*E.g., prescription panel with drug, dosage, Dosieranweisung inline; one HBA PIN for all pending Rezepte.* |
| 9 | **Context-Blind Quartalsabrechnung** | Monolithic end-of-quarter error dump. MFA fixes errors from weeks ago. | Continuous inline validation throughout the quarter. <br>*E.g., after each encounter: "Schein complete" or "Missing: ICD for GOP 01100" — not 300 errors on March 31.* |
| 10 | **One-Size-Fits-All MVZ Interface** | Same UI for Hausarzt, Kardiologe, Psychotherapeut despite different workflows. | Specialty-adaptive workspaces over shared patient data. <br>*E.g., Kardiologe sees EKG/Echo panel by default; Psychotherapeut sees session notes and therapy hours.* |
| 11 | **eGK-Before-Everything Gate** | Clinical workflow blocked when card reader/TI fails or patient forgot eGK. | Decouple clinical from insurance. Provisional encounter → async reconciliation. <br>*E.g., "Start encounter without eGK" button; insurance data reconciled when card is read later.* |
| 12 | **Copy-Paste Documentation** | Poor templating → Befund-Klonen with carried-forward errors. Legal risk (Dokumentationspflicht). | Structured templates with explicit changed/unchanged markers. <br>*E.g., Befund template shows prior values greyed out with "Confirm or update" per field.* |
| 13 | **Hidden Workflow State** | No visibility of patient flow (Anmeldung → Abrechnung). MFA uses paper lists. | Explicit patient flow board with color-coded real-time status. <br>*E.g., Wartezimmer board: green = ready, yellow = in Behandlung, red = waiting >30 min.* |
| 14 | **Monolithic Patient Record** | Entire history in one scroll. Needle-in-haystack for long-term patients. | Visit-focused summary with progressive disclosure. <br>*E.g., default view: today's diagnoses, current meds, recent labs; "Show full history" expands timeline.* |
| 15 | **Disconnected Formularverwaltung** | Each Muster form as isolated module. Redundant data entry. | Context-aware forms auto-filled from encounter data. <br>*E.g., clicking "Überweisung" pre-fills patient, ICD, LANR/BSNR from current encounter — MFA only selects target Fachrichtung.* |

---

## Persona Testing Dimensions

`<!-- TBD: persona testing dimensions -->`


