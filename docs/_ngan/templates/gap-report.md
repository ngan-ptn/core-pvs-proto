# PVS-Core Gap Report

**Generated:** 2026-03-17  
**Gap Surfaces Found:** 4

This report identifies screens that exist in the product context but are **not yet defined in user story files**. These need user stories written before they can be fully designed.

---

## Gap Surfaces Requiring New User Stories

### Waiting Room Board

- **Proposed Phase:** 1.NEW
- **Design Tier:** 1
- **Primary Role:** MFA
- **Workflow:** Patient Check-In & Registration
- **Reason:** Referenced in product context. Every practice needs patient flow visibility from day one.

> Patient flow visibility board showing color-coded status for each patient (waiting, in treatment, ready to leave). Real-time updates. Displayed on reception screen.

**Proposed States:**

- **Active Day View**: Default on login -> Shows today's patient queue
- **Empty State**: No patients checked in -> Placeholder encouraging check-in
- **High Volume**: >15 patients waiting -> Compact view, overflow scroll

**Proposed Components:**

- **Patient Queue Card**: Individual patient status with color indicator
- **Wait Time Display**: Elapsed time since check-in
- **Status Filter Tabs**: Filter by: All / Waiting / In Treatment / Done

---

### Clinical Note Editor

- **Proposed Phase:** 2.NEW
- **Design Tier:** 2
- **Primary Role:** Doctor
- **Workflow:** Clinical Documentation
- **Reason:** In scope for rich text editing. Clinical documentation needs a dedicated editor surface.

> Rich text editor for clinical documentation with text module library. Supports templates, placeholder auto-population (patient name, date, diagnosis), and structured note formats. Embedded within Patient Record View.

**Proposed States:**

- **New Note**: User creates note -> Blank editor with template picker
- **Editing**: Note opened for editing -> Rich text toolbar, auto-save indicator
- **Template Browser**: User opens text module library -> Sidebar with categorized templates
- **Read-Only**: Signed/finalized note -> Editing disabled, signature stamp visible

**Proposed Components:**

- **Rich Text Toolbar**: Formatting controls (bold, italic, lists, tables)
- **Text Module Library**: Categorized reusable text blocks with search
- **Placeholder Engine**: Auto-populates patient demographics, date, diagnosis
- **Note History**: Version history with diff view

---

### GDT Device Data Review Surface

- **Proposed Phase:** 2.NEW
- **Design Tier:** 3
- **Primary Role:** Doctor
- **Workflow:** Clinical Documentation
- **Reason:** GDT device integration needs a data review surface for physician sign-off.

> Review and accept imported device data (ECG, spirometry, ultrasound) from GDT-connected medical devices. Shows raw data visualization, allows physician annotation, and links results to patient record.

**Proposed States:**

- **Pending Import**: Device sends data via GDT -> New import notification, preview available
- **Review Mode**: Physician opens import -> Full data visualization (ECG trace, spirometry curve)
- **Annotated**: Physician adds findings -> Annotation overlay on data, structured findings form
- **Accepted**: Physician confirms -> Data linked to patient record, timestamp

**Proposed Components:**

- **Device Data Viewer**: Renders ECG traces, spirometry curves, ultrasound thumbnails
- **Annotation Panel**: Structured findings entry with free text
- **Import Queue**: List of pending device imports with patient matching

---

### MVZ Dashboard

- **Proposed Phase:** 7.7
- **Design Tier:** 5
- **Primary Role:** Admin
- **Workflow:** Practice Administration
- **Reason:** New Phase 7.7. MVZ management needs aggregate visibility across locations.

> Multi-location KPI dashboard for MVZ (Medizinische Versorgungszentren) administrators. Traffic-light drill-down by location, specialty, and practitioner. Shows billing volume, patient throughput, compliance status.

**Proposed States:**

- **Overview**: Default view -> All locations with traffic-light KPI indicators
- **Location Drill-Down**: Click on location -> Detailed KPIs for single location, specialty breakdown
- **Practitioner View**: Click on practitioner -> Individual physician performance, billing, compliance
- **Alert State**: KPI threshold breach -> Red indicators, action required items highlighted

**Proposed Components:**

- **Traffic Light KPI Grid**: Color-coded performance indicators by metric
- **Location Selector**: Multi-location navigation with search
- **Trend Charts**: Time-series for key metrics (billing, patients, compliance)
- **Alert Panel**: Actionable items requiring admin attention

---

## Additional Design Recommendations

### Specialty-Adaptive Workspaces

**Approach:** One Patient Record View with a configurable layout region, NOT separate screens per specialty.

- **Tier 1:** Design Patient Record View with a clearly marked "specialty content zone" placeholder
- **Tier 3:** Design 4-5 specialty widget panels (Cardiology, Psychiatry, Dermatology, General Practice, Pediatrics)
- **Tier 5:** Design the Specialty Configuration admin surface

Why: The Patient Record View is already extended by 9 phases. Creating N specialty variants would multiply design/maintenance work. The product context describes default widget ordering, not fundamentally different layouts.

### Phase 7.6 Scope: Reconciled

Phase 7.6 contains **21 requirements** (PSDV654 + 20 ALLG-prefixed). The roadmap file and user stories are in perfect 1:1 alignment. The earlier "~12" estimate came from the scope overview, not the detailed roadmap file. No discrepancy exists.
