# PVS-Core Design Inventory Verification Checklist

**Generated:** 2026-03-17

---

## Coverage Summary

- **Total canonical surfaces:** 88
- **Surfaces from user stories:** 84
- **Gap surfaces (need user stories):** 4
- **Unique requirement IDs captured:** 183
- **Phases represented:** 54

---

## Phase Coverage

Every sub-phase from the roadmap should map to at least one surface.

| Phase | Surfaces | Status |
|-------|----------|--------|
| 1.1 | 2: Card Read / Check-In Screen, Patient Record View | Covered |
| 1.2 | 2: Card Read / Check-In Screen, Temporary Cost Carrier Form | Covered |
| 1.3 | 2: Card Read / Check-In Screen, Patient Match Review Panel | Covered |
| 1.4 | 4: Temporary Cost Carrier Form, Manual Patient Entry Form, Cost Carrier Search Panel (+1 more) | Covered |
| 1.5 | 4: Card Read / Check-In Screen, Patient Record View, Schein / Billing Record View (+1 more) | Covered |
| 1.6 | 1: EHIC Patient Entry Form | Covered |
| 1.7 | 3: TE Form (Enrollment Declaration), TE Overview List, Enrollment Settings | Covered |
| 1.8 | 2: Patient Record View, Participation Management View | Covered |
| 1.9 | 3: PTV Import Wizard, Import Protocol View, ICode Management View | Covered |
| 2A.1 | 1: Patient Record View | Covered |
| 2A.2 | 1: Patient Record View | Covered |
| 2A.3 | 1: Patient Record View | Covered |
| 2A.4 | 2: Patient Record View, Coding Instructions Browser | Covered |
| 2A.5 | 3: Patient Record View, Rule Violation Overview, Coding Rule Settings | Covered |
| 2A.6 | 3: Patient Record View, Schein / Billing Record View, Multimorbidity Surcharge Patient List | Covered |
| 2B.1 | 1: Schein / Billing Record View | Covered |
| 2B.2 | 1: Schein / Billing Record View | Covered |
| 2B.3 | 1: Schein / Billing Record View | Covered |
| 2B.4 | 1: Schein / Billing Record View | Covered |
| 2B.5 | 3: Schein / Billing Record View, Termination Notice Manager, PTV Form Print Preview | Covered |
| 2B.6 | 1: Schein / Billing Record View | Covered |
| 2B.7 | 2: Schein / Billing Record View, Nursing Home Flat-Rate Documentation Pan | Covered |
| 2B.8 | 2: Schein / Billing Record View, Referral Form Print Preview | Covered |
| 3.1 | 1: Billing Dashboard (KV Mode) | Covered |
| 3.2 | 1: Patient Receipt Preview | Covered |
| 3.3 | 2: Lab Proficiency Gate (within Billing Das, pnSD Configuration Dialog | Covered |
| 3.4 | 2: ASV Team Configuration (within Practice , Billing Dashboard (ASV Mode) | Covered |
| 3.5 | 1: Billing Dashboard (HZV / FAV Mode) | Covered |
| 3.6 | 1: Billing Validation Results Panel (within | Covered |
| 3.7 | 2: HZV / FAV Submission Panel (within Billi, Transmission Protocol View | Covered |
| 3.8 | 3: KV / HZV Conflict Review Panel, Post-Submission Editor (Medi contracts o, AOK Check 18+ Panel (within Patient Reco | Covered |
| 4.1 | 4: Prescription Builder, Prescription Queue, Patient Copy Preview (+1 more) | Covered |
| 4.2 | 4: Drug Search Panel, Interaction Alert Dialog, Dosage Calculator Panel (+1 more) | Covered |
| 4.3 | 2: Heilmittel Prescription Form, Quantity Tracking Panel | Covered |
| 4.4 | 2: Hilfsmittel Prescription Form, Hilfsmittelverzeichnis Search | Covered |
| 4.5 | 2: DiGA Prescription Builder, DiGA Directory Browser | Covered |
| 4.6 | 3: Medication Plan Editor, BMP Print Preview, BMP Import Dialog | Covered |
| 5.1 | 2: Form Print Preview, Form Printer Settings | Covered |
| 5.2 | 3: eAU Form, eAU Transmission Status, eAU Print Preview (Patient / Employer Co | Covered |
| 5.3 | 3: Doctor Letter Composer, Letter Transmission Status, Incoming Letter Viewer | Covered |
| 5.4 | 3: ePA Document Browser, ePA Entitlement Manager, Document Upload Dialog | Covered |
| 6.1 | 3: eDMP Documentation Form, eDMP Patient Overview, eDMP Validation Results | Covered |
| 6.2 | 1: eHKS Documentation Form | Covered |
| 6.3 | 2: Scoring Calculator Panel, Audit Trail Viewer | Covered |
| 6.4 | 1: eDMP / eDoc Submission Dashboard | Covered |
| 7.1 | 1: System Status Bar | Covered |
| 7.2 | 2: Practice Administration Panel, User & Rights Management Panel | Covered |
| 7.3 | 1: TI Connector Status Panel | Covered |
| 7.4 | 2: Master Data Management Panel, Fee Schedule Browser | Covered |
| 7.5 | 2: Module Management Panel, System Compliance Settings | Covered |
| 7.6 | 3: HZV / FAV Contract Management Panel, Physician Identity Management Panel, Contract Documents Viewer | Covered |

**Missing phases:** 0

---

## Cross-Reference Integrity

Every surface that claims extension by another phase should have that phase's surface data merged.

| Surface | Extensions | Verified |
|---------|------------|----------|
| Card Read / Check-In Screen | 1.2, 1.3, 1.5 | Auto-merged |
| Patient Record View | 1.5, 1.8, 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6 | Auto-merged |
| Temporary Cost Carrier Form | 1.4 | Auto-merged |
| Schein / Billing Record View | 2A.6, 2B.1, 2B.2, 2B.3, 2B.4, 2B.5, 2B.6, 2B.7, 2B.8 | Auto-merged |

---

## Role Distribution

| Role | Count | % |
|------|-------|---|
| MFA | 21 | 23.9% |
| Doctor | 51 | 58.0% |
| Admin | 16 | 18.2% |

---

## Tier Distribution

| Tier | Count | Description |
|------|-------|-------------|
| 1 | 9 | Foundation Shells |
| 2 | 15 | Core Clinical Workflow |
| 3 | 31 | Extended Clinical & Specialty |
| 4 | 15 | HZV/FAV & Billing Specialty |
| 5 | 18 | Admin & Infrastructure |

---

## Open Items

### User Stories Needed

1. **Phase 1.NEW**: Waiting Room Board (patient flow, color-coded status)
2. **Phase 2.NEW**: Clinical Note Editor + Text Module Library (RTF, templates)
3. **Phase 2.NEW**: GDT Device Data Review (ECG, spirometry, ultrasound import)
4. **Phase 7.7**: MVZ Dashboard (multi-location KPIs, traffic-light drill-down)

### Scope Reconciliation

- ~~Phase 7.6: Roadmap says ~12 requirements, user stories reference ~21.~~ **RESOLVED.** Both sources contain exactly 21 requirements with perfect 1:1 match. The "~12" was an earlier estimate from the scope overview, not the detailed roadmap file.

### Design System Decisions Needed

- Specialty-adaptive workspace approach (configurable panel zone vs. separate screens) — **DEFERRED.** Decide when Tier 3 design begins.
- ~~Component library scope (shared across tiers vs. per-tier)~~ **RESOLVED.** Shared across all tiers. Design system lives in `tini-library` repo.
- Navigation/flow map connecting screens across modules (not yet created)
