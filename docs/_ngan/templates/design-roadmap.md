# PVS-Core Design Roadmap

**Generated:** 2026-03-17  
**Total Surfaces:** 88

This document defines the **order in which screens should be designed**. Tier 1 must be designed first because all other screens depend on these layouts.

---

## Tier 1: Foundation Shells. Design FIRST. Screens that every other screen builds upon.

**9 surfaces**

| # | Surface | Phase | Role | Workflow | Complexity | Gap? |
|---|---------|-------|------|----------|-----------|------|
| 1 | Billing Dashboard (KV Mode) | 3.1 | Doctor | Billing & Submission | 20.0 |  |
| 2 | Patient Record View (+8) | 1.1 | Doctor | Clinical Documentation | 278.5 |  |
| 3 | Card Read / Check-In Screen (+3) | 1.1 | MFA | Patient Check-In & Registration | 127.5 |  |
| 4 | Manual Patient Entry Form | 1.4 | MFA | Patient Check-In & Registration | 28.0 |  |
| 5 | Waiting Room Board | 1.NEW | MFA | Patient Check-In & Registration | 10.5 | Yes |
| 6 | System Status Bar | 7.1 | Admin | Practice Administration | 11.5 |  |
| 7 | Practice Administration Panel | 7.2 | Admin | Practice Administration | 22.0 |  |
| 8 | User & Rights Management Panel | 7.2 | Admin | Practice Administration | 22.0 |  |
| 9 | Schein / Billing Record View (+9) | 1.5 | Doctor | Service & Billing Documentation | 260.0 |  |

---

## Tier 2: Core Clinical Workflow. Design SECOND. Daily physician and MFA workflow.

**15 surfaces**

| # | Surface | Phase | Role | Workflow | Complexity | Gap? |
|---|---------|-------|------|----------|-----------|------|
| 1 | KIM Inbox | 1.4 | Doctor | Clinical Documentation | 28.0 |  |
| 2 | Clinical Note Editor | 2.NEW | Doctor | Clinical Documentation | 14.0 | Yes |
| 3 | PTV Form Print Preview | 2B.5 | MFA | Forms & Certificates | 25.5 |  |
| 4 | Referral Form Print Preview | 2B.8 | MFA | Forms & Certificates | 16.0 |  |
| 5 | Form Print Preview | 5.1 | MFA | Forms & Certificates | 22.5 |  |
| 6 | eAU Form | 5.2 | Doctor | Forms & Certificates | 34.5 |  |
| 7 | Temporary Cost Carrier Form (+1) | 1.2 | MFA | Patient Check-In & Registration | 53.0 |  |
| 8 | Patient Match Review Panel | 1.3 | MFA | Patient Check-In & Registration | 19.0 |  |
| 9 | Cost Carrier Search Panel | 1.4 | MFA | Patient Check-In & Registration | 28.0 |  |
| 10 | Prescription Builder | 4.1 | Doctor | Prescriptions | 43.0 |  |
| 11 | Prescription Queue | 4.1 | Doctor | Prescriptions | 43.0 |  |
| 12 | Patient Copy Preview | 4.1 | Doctor | Prescriptions | 43.0 |  |
| 13 | Prescription Status View | 4.1 | Doctor | Prescriptions | 43.0 |  |
| 14 | DiGA Prescription Builder | 4.5 | Doctor | Prescriptions | 24.5 |  |
| 15 | Quarter Transition Dashboard | 1.5 | MFA | Service & Billing Documentation | 45.5 |  |

---

## Tier 3: Extended Clinical & Specialty. Design THIRD. Specialty workflows, drug safety, eDMP.

**31 surfaces**

| # | Surface | Phase | Role | Workflow | Complexity | Gap? |
|---|---------|-------|------|----------|-----------|------|
| 1 | eDMP Documentation Form | 6.1 | Doctor | Chronic Care Programs | 35.5 |  |
| 2 | eDMP Patient Overview | 6.1 | MFA | Chronic Care Programs | 35.5 |  |
| 3 | eDMP Validation Results | 6.1 | Doctor | Chronic Care Programs | 35.5 |  |
| 4 | eHKS Documentation Form | 6.2 | Doctor | Chronic Care Programs | 27.0 |  |
| 5 | Scoring Calculator Panel | 6.3 | Doctor | Chronic Care Programs | 24.0 |  |
| 6 | Audit Trail Viewer | 6.3 | Admin | Chronic Care Programs | 24.0 |  |
| 7 | eDMP / eDoc Submission Dashboard | 6.4 | Doctor | Chronic Care Programs | 25.0 |  |
| 8 | Quantity Tracking Panel | 4.3 | Doctor | Clinical Documentation | 24.5 |  |
| 9 | Doctor Letter Composer | 5.3 | Doctor | Clinical Documentation | 31.5 |  |
| 10 | Incoming Letter Viewer | 5.3 | MFA | Clinical Documentation | 31.5 |  |
| 11 | GDT Device Data Review Surface | 2.NEW | Doctor | Clinical Documentation | 12.5 | Yes |
| 12 | Form Printer Settings | 5.1 | MFA | Forms & Certificates | 22.5 |  |
| 13 | eAU Transmission Status | 5.2 | Doctor | Forms & Certificates | 34.5 |  |
| 14 | eAU Print Preview (Patient / Employer Copies) | 5.2 | Doctor | Forms & Certificates | 34.5 |  |
| 15 | Letter Transmission Status | 5.3 | Doctor | Forms & Certificates | 31.5 |  |
| 16 | Drug Search Panel | 4.2 | Doctor | Prescriptions | 27.5 |  |
| 17 | Interaction Alert Dialog | 4.2 | Doctor | Prescriptions | 27.5 |  |
| 18 | Dosage Calculator Panel | 4.2 | Doctor | Prescriptions | 27.5 |  |
| 19 | Red Hand Letter Alert | 4.2 | Doctor | Prescriptions | 27.5 |  |
| 20 | Heilmittel Prescription Form | 4.3 | Doctor | Prescriptions | 24.5 |  |
| 21 | Hilfsmittel Prescription Form | 4.4 | Doctor | Prescriptions | 22.5 |  |
| 22 | Hilfsmittelverzeichnis Search | 4.4 | Doctor | Prescriptions | 22.5 |  |
| 23 | DiGA Directory Browser | 4.5 | Doctor | Prescriptions | 24.5 |  |
| 24 | Medication Plan Editor | 4.6 | Doctor | Prescriptions | 30.0 |  |
| 25 | BMP Print Preview | 4.6 | Doctor | Prescriptions | 30.0 |  |
| 26 | BMP Import Dialog | 4.6 | Doctor | Prescriptions | 30.0 |  |
| 27 | Termination Notice Manager | 2B.5 | Doctor | Service & Billing Documentation | 25.5 |  |
| 28 | Nursing Home Flat-Rate Documentation Panel | 2B.7 | Doctor | Service & Billing Documentation | 34.5 |  |
| 29 | ePA Document Browser | 5.4 | Doctor | ePA & Document Exchange | 35.5 |  |
| 30 | ePA Entitlement Manager | 5.4 | Doctor | ePA & Document Exchange | 35.5 |  |
| 31 | Document Upload Dialog | 5.4 | Doctor | ePA & Document Exchange | 35.5 |  |

---

## Tier 4: HZV/FAV & Billing Specialty. Design FOURTH. Contract-specific and billing deep-dive.

**15 surfaces**

| # | Surface | Phase | Role | Workflow | Complexity | Gap? |
|---|---------|-------|------|----------|-----------|------|
| 1 | ASV Team Configuration (within Practice Settings) | 3.4 | Admin | Billing & Submission | 12.0 |  |
| 2 | Billing Dashboard (ASV Mode) | 3.4 | Admin | Billing & Submission | 12.0 |  |
| 3 | Billing Dashboard (HZV / FAV Mode) | 3.5 | Doctor | Billing & Submission | 17.5 |  |
| 4 | Billing Validation Results Panel (within Billing Dashboard, HZV / FAV mode) | 3.6 | Doctor | Billing & Submission | 18.5 |  |
| 5 | HZV / FAV Submission Panel (within Billing Dashboard, HZV / FAV mode) | 3.7 | Doctor | Billing & Submission | 32.0 |  |
| 6 | Transmission Protocol View | 3.7 | Doctor | Billing & Submission | 32.0 |  |
| 7 | Post-Submission Editor (Medi contracts only) | 3.8 | Doctor | Billing & Submission | 22.0 |  |
| 8 | Import Protocol View | 1.9 | Admin | Data Import & Sync | 29.0 |  |
| 9 | TE Form (Enrollment Declaration) | 1.7 | MFA | Insurance & Enrollment (HZV/FAV) | 43.0 |  |
| 10 | TE Overview List | 1.7 | MFA | Insurance & Enrollment (HZV/FAV) | 43.0 |  |
| 11 | Enrollment Settings | 1.7 | MFA | Insurance & Enrollment (HZV/FAV) | 43.0 |  |
| 12 | Participation Management View | 1.8 | MFA | Insurance & Enrollment (HZV/FAV) | 29.5 |  |
| 13 | PTV Import Wizard | 1.9 | MFA | Insurance & Enrollment (HZV/FAV) | 29.0 |  |
| 14 | AOK Check 18+ Panel (within Patient Record) | 3.8 | MFA | Insurance & Enrollment (HZV/FAV) | 22.0 |  |
| 15 | KV / HZV Conflict Review Panel | 3.8 | Doctor | Service & Billing Documentation | 22.0 |  |

---

## Tier 5: Admin & Infrastructure. Design LAST or in parallel. Quarterly/annual admin tasks.

**18 surfaces**

| # | Surface | Phase | Role | Workflow | Complexity | Gap? |
|---|---------|-------|------|----------|-----------|------|
| 1 | Patient Receipt Preview | 3.2 | MFA | Billing & Submission | 14.0 |  |
| 2 | Coding Instructions Browser | 2A.4 | Doctor | Clinical Documentation | 13.0 |  |
| 3 | Rule Violation Overview | 2A.5 | Doctor | Clinical Documentation | 27.5 |  |
| 4 | pnSD Configuration Dialog | 3.3 | Doctor | Clinical Documentation | 16.0 |  |
| 5 | ICode Management View | 1.9 | Doctor | Data Import & Sync | 29.0 |  |
| 6 | EHIC Patient Entry Form | 1.6 | MFA | Patient Check-In & Registration | 7.5 |  |
| 7 | MVZ Dashboard | 7.7 | Admin | Practice Administration | 14.0 | Yes |
| 8 | Lab Proficiency Gate (within Billing Dashboard) | 3.3 | Doctor | Service & Billing Documentation | 16.0 |  |
| 9 | Master Data Management Panel | 7.4 | Admin | Service & Billing Documentation | 32.0 |  |
| 10 | Fee Schedule Browser | 7.4 | Doctor | Service & Billing Documentation | 32.0 |  |
| 11 | Coding Rule Settings | 2A.5 | Admin | System Infrastructure | 27.5 |  |
| 12 | Multimorbidity Surcharge Patient List | 2A.6 | Doctor | System Infrastructure | 27.5 |  |
| 13 | TI Connector Status Panel | 7.3 | Admin | System Infrastructure | 14.5 |  |
| 14 | Module Management Panel | 7.5 | Admin | System Infrastructure | 23.5 |  |
| 15 | System Compliance Settings | 7.5 | Admin | System Infrastructure | 23.5 |  |
| 16 | HZV / FAV Contract Management Panel | 7.6 | Admin | System Infrastructure | 37.0 |  |
| 17 | Physician Identity Management Panel | 7.6 | Admin | System Infrastructure | 37.0 |  |
| 18 | Contract Documents Viewer | 7.6 | Admin | System Infrastructure | 37.0 |  |

---

## Cross-Tier Dependencies

These surfaces are extended by multiple phases and their layout cascades to all dependent screens:

| Surface | Defined | Extended By | Complexity |
|---------|---------|-------------|-----------|
| Schein / Billing Record View | 1.5 | 2A.6, 2B.1, 2B.2, 2B.3, 2B.4, 2B.5, 2B.6, 2B.7, 2B.8 | 260.0 |
| Patient Record View | 1.1 | 1.5, 1.8, 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6 | 278.5 |
| Card Read / Check-In Screen | 1.1 | 1.2, 1.3, 1.5 | 127.5 |
| Temporary Cost Carrier Form | 1.2 | 1.4 | 53.0 |

---

## Gap Surfaces (Not Yet in User Stories)

These surfaces were identified as missing from user stories but needed for the product:

### Waiting Room Board
- **Phase:** 1.NEW
- **Tier:** 1
- **Reason:** Referenced in product context. Every practice needs patient flow visibility from day one.

### Clinical Note Editor
- **Phase:** 2.NEW
- **Tier:** 2
- **Reason:** In scope for rich text editing. Clinical documentation needs a dedicated editor surface.

### GDT Device Data Review Surface
- **Phase:** 2.NEW
- **Tier:** 3
- **Reason:** GDT device integration needs a data review surface for physician sign-off.

### MVZ Dashboard
- **Phase:** 7.7
- **Tier:** 5
- **Reason:** New Phase 7.7. MVZ management needs aggregate visibility across locations.
