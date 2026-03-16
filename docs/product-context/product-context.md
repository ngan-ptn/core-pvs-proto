# CorePVS — Product Context

**Version:** 1.2.0
**Last Updated:** 2026-03-16

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

## Competitive Landscape

From source documents: "clear differentiation from single-practice PVS" is the primary positioning.

`<!-- TBD: competitive analysis -->`

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
|-------------|--------|
| Patient Data Management (Phase 1) | In progress |
| Diagnosis, Coding & Service Documentation (Phase 2) | Planned |
| Billing & Submission (Phase 3) | Planned |
| Prescription Management / E-Rezept (Phase 4) | Planned |
| Forms, eAU & ePA (Phase 5) | Planned |
| eDMP / eDocumentation (Phase 6) | Planned |
| Foundation & Practice Infrastructure (Phase 7) | Planned |

---

## Roadmap Summary

Seven phases, derived from four requirement sources (KVDT, ICD-10-GM, SV Components, Crucial Workflows). Full details in [roadmap-phases](https://github.com/tini-works/requirement-documents/tree/main/docs/roadmap-phases).

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
|------------|-----------|
| Desktop-only (24" monitors) | Target environment is practice workstations |
| No responsive / no mobile | Not needed for MFA/doctor workflows |
| White-label ready | Product serves multiple customers with their branding |
| Certification scope | ~70–80% baseline must pass certification unchanged |
| Design system | [tini-library](https://github.com/tini-works/tini-library) — baseline visual identity; customer theming applied on top |
| German-language UI | Primary market; domain terms are German healthcare standards |

---

## Primary UX Axes

Three measurable axes that guide every design decision:

### Speed
Time to complete key tasks.

`<!-- TBD: targets per UX moment (e.g., registration <2 min, diagnosis coding <30s) -->`

### Safety / Clarity
Read-only vs. editable is unambiguous at a glance.

`<!-- TBD: how measured (e.g., user can identify editable fields within X seconds, zero misclicks on read-only data) -->`

### Density
Supports high-volume clinical workflow without "scroll hunting."

`<!-- TBD: measurable criteria (e.g., key actions visible without scrolling on 24" monitor, information density benchmarks) -->`

---

## UX Principles

Extractable design patterns from source documents. These are observed patterns, not yet formal principles.

`<!-- TBD: formal UX principle definitions -->`

### Observed patterns

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

## Success Metrics

`<!-- TBD: success metrics -->`

---

## Persona Testing Dimensions

`<!-- TBD: persona testing dimensions -->`

---

## Changelog

| Version | Date | Who | Changes |
|---------|------|-----|---------|
| 1.2.0 | 2026-03-16 | Ngan | Extract Domain Glossary to separate file |
| 1.1.0 | 2026-03-13 | Ngan | Remove DMEA-specific content; add primary UX axes (Speed, Safety/Clarity, Density); add tini-library design system reference |
| 0.1.0 | 2026-03-12 | Ngan | Initial structure — clean version without rationale annotations |
