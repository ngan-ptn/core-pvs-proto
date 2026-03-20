---
Version: 1.0
Last Updated: 2026-03-19
Scope: Comparison of compliance-driven vs user-journey workflow diagrams
---

# Comparison: FLOW260318-master-compliance-workflows.md vs FLOW260318-user-workflow-diagram.md

## Sources

| Label | File | Perspective |
|-------|------|-------------|
| **Compliance Workflows** | [FLOW260318-master-compliance-workflows.md](FLOW260318-master-compliance-workflows.md) | Regulatory / compliance-first |
| **User Workflow Diagrams** | [docs/_ngan/templates/FLOW260318-user-workflow-diagram.md](../docs/_ngan/templates/FLOW260318-user-workflow-diagram.md) | UX / role-journey-first |

Compliance Workflows (FLOW260318-master-compliance-workflows.md)

Source: 604 legal obligations
Organized by regulatory domain (PSDV, VERT, ABRD, etc.)
Every node has an obligation ID
Shows KV vs HZV/FAV divergence explicitly
Answers: what must the system enforce
User Workflow Diagrams (FLOW260318-user-workflow-diagram.md)

Source: 88 design surfaces
Organized by role (MFA, Doctor, Admin)
Shows screen-to-screen navigation
No compliance tracing
Answers: what screens does each role touch
They don't overlap — they complement. Use the user diagram for screen scope; use the compliance diagram for the validation logic inside each screen.
---

## 1. High-Level Comparison

| Aspect | Compliance Workflows | User Workflow Diagrams |
|--------|---------------------|------------------------|
| **Source data** | compliance-inventory.md (604 obligations) | Design roadmap (88 surfaces) |
| **Primary lens** | Regulatory compliance gates | Screen-to-screen navigation |
| **Organized by** | Compliance domain (PSDV, VERT, VERE, ABRD, etc.) | User role (MFA, Doctor, Admin) |
| **Total diagrams** | 14 complete + 6 planned | 15 complete |
| **Node labels** | System/process actions + obligation IDs | Screen/panel names |
| **Compliance IDs on nodes** | Yes — every node traces to an obligation (e.g., KP2-100, VERT484, P2-135) | No — no traceability |
| **KV vs HZV/FAV divergence** | Explicitly shown in all relevant diagrams | Not shown — paths converge at screen level |
| **Gap visibility** | Gaps called out per workflow (Pending/Planned items) | No gap awareness |
| **Role perspective** | None — role-agnostic | MFA, Doctor, Admin clearly separated |
| **Non-compliance screens** | Excluded (e.g., Waiting Room, EHIC not in scope) | Included (all product surfaces) |

---

## 2. Workflow-by-Workflow Alignment

### Patient Check-In

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Diagrams** | 4 sub-diagrams (main, card read, VSDM, HZV status) | 1 diagram (8 nodes) | — | Divergence shown in main diagram | MFA |
| **Nodes** | ~40 decision/action nodes | 8 nodes | — | — | MFA |
| **Card read detail** | 12 states: Insert → eGK/KVK branch → Field Mapping → Field Controls → FK 4109 → Re-Read → Carrier Resolve → Care Context | 4 states: Card Read → Match / No eGK / EU patient / Insurance invalid | KP2-100, P2-105, P2-135, P2-136, KP2-185, KP2-195 | Both paths share card read | MFA |
| **VSDM verification** | Dedicated 16-step sub-diagram: FK 4136 capture, timestamp check, age gate, coverage validity, carrier status (active/dissolved/merged), IK validity, data change, insurance split, conflict detection | Collapsed into single node "Card Read / Check-In Screen" | KP2-190, KP2-191, P2-140, P2-166, P2-210, P2-260, KP2-557 | Pre-divergence — applies to both | MFA |
| **KV vs HZV/FAV routing** | Explicit IK check → HPM participation query → contract feature gate → HZV/FAV Schein vs KV Schein | Not shown — both paths arrive at same "Waiting Room Board" | VERT484, VERT582, VERT686, VERT833 | Divergence point | MFA |
| **Manual entry** | Obligation-level: Tabelle 5 fields, DMP labels, PLZ, gender deviation, KVK fallback | Screen-level: "Manual Patient Entry Form" as single node | KP2-102, P2-120 | Both paths | MFA |
| **Carrier search** | Obligation-level: VKNR/IK resolution, carrier dissolved/merged states | Screen-level: "Cost Carrier Search Panel" as single node | P2-200, P2-220, P2-230 | Both paths | MFA |
| **EHIC (EU patients)** | Not covered — out of compliance scope | Covered (S010 as dashed branch from card read) | — | KV only | MFA |
| **Patient matching** | Not covered as separate surface | Covered (Patient Match Review Panel, S004) | — | Both paths | MFA |
| **Waiting Room Board** | Not covered — out of compliance scope | Covered (final step before consultation) | — | Both paths | MFA |

### Insurance & Enrollment (HZV/FAV)

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Scope** | §2 Contract Participation + §3 Patient Enrollment (68 items combined) | Workflow 2: MFA — Insurance & Enrollment | VERT, VERE sections | HZV/FAV only | MFA |
| **Lifecycle states** | Full TE lifecycle: Created → Printed → Error/Success → Retry; participation: Request → Activate → End → Reverse | Screen-level: TE Form → TE Overview List → Participation Management View | VERT641, VERT642, VERT644, VERE466, VERE555, VERE556 | HZV/FAV only | MFA |
| **Signature requirements** | HZV: 2 sigs + TE-Code; FAV: 1 sig + TE-Code | Not shown | VERE558, VERE1133 | Diverges: HZV vs FAV | MFA |
| **HPM transmission** | Prerequisite check → Transmit to HPM; auto-activation for FAV | "Submit" as single edge | VERE560, VERE561, VERE1682 | HZV/FAV only | MFA |
| **PTV import** | Not covered | Covered (Import Wizard as screen) | — | Both paths | MFA |
| **AOK 18+ check** | Not covered | Covered (AOK Check 18+ Panel as dashed branch) | — | HZV/FAV only | MFA |
| **Daily unsent check** | Covered (VERE563 notification) | Not covered | VERE563 | HZV/FAV only | MFA |

### Billing Documentation

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Scope** | §4 Billing Documentation (46 items) + §5 Billing Process (45 items) | Workflow 5 (Schein) + Workflow 10 (Billing & Submission) | ABRD, ABRG sections | Both paths | Doctor |
| **KV / HZV divergence** | Explicit subgraphs per billing type | Shown as separate dashboard modes (KV Mode / HZV Mode) | ABRD605, ABRD606, ABRD830, ABRD834 | Diverges: KV subgraph vs HZV/FAV subgraph | Doctor |
| **Validation rules** | GNR → Code 0000 check → ICD validity → terminal codes → acute vs permanent → carry-forward | "Run validation" as single edge → Billing Validation Results Panel | ABRD456, ABRD608, ABRD611, ABRD612, ABRD679 | Both paths | Doctor |
| **Post-submission** | 5 steps: Mark → Confirm → Protocol PDF → Log warnings → Block duplicates | "View protocol" → Transmission Protocol View | ABRG486, ABRG490, ABRG491, ABRG492, ABRG933 | Both paths | Doctor |
| **KV/HZV conflict review** | Shown (check HZV patient in KV billing) | Covered as separate screen (KV / HZV Conflict Review Panel) | ABRG829 | Divergence point | Doctor |
| **ASV billing** | Not covered | Covered as dashed branch (ASV Mode) | — | KV adjacent | Doctor |

### Prescriptions

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Scope** | §8 Prescription & Drug Safety (~54 items) | Workflow 6 (Core) + Workflow 7 (Specialty) | VSST section | Both paths | Doctor |
| **Drug safety** | Interaction check, dosage, Red Hand Letter, PRISCUS label | Same: Alert Dialog, Dosage Calculator, Red Hand Letter Alert | VSST784 | Both paths | Doctor |
| **KV vs HZV/FAV** | Explicit: KBV AVWG rules, aut-idem, PIM vs insurance-specific categories, HPM recommendations, Grün/Blau/Rot/Orange labels | Not shown | VSST527, VSST537, VSST539, VSST541, VSST854, VSST1543 | Diverges: AVWG (KV) vs HPM categories (HZV/FAV) | Doctor |
| **e-Rezept signing** | Comfort Signature → Submit to Fachdienst | "Confirm Rx" → Prescription Queue → Status View | 3.19 E-Rezept | Both paths | Doctor |
| **DiGA** | Not covered | Covered (Workflow 7: DiGA Prescription Builder + Directory Browser) | — | KV only | Doctor |
| **Medication Plan (BMP)** | Not covered | Covered (Workflow 7: BMP Print/Import) | — | Both paths | Doctor |
| **Hilfsmittel** | Covered (§10: catalog, steuerbar check, fragebogen, Merkblatt, fax hint) | Covered (Workflow 7: Hilfsmittelverzeichnis Search) | VSST623–VSST633 | KV only (HZV/FAV blocks transmission) | Doctor |

### Chronic Care (eDMP)

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Scope** | §11 eDMP (12 items) | Workflow 9: Doctor — Chronic Care Programs | 3.21 eDMP | Both paths | Doctor |
| **Programs** | Lists 6 DMP types (DM1, DM2, KHK, Asthma, COPD, Brustkrebs) | "Select eDMP patient" — programs implied | VSST592, VSST677, VSST1547 | Both paths | Doctor |
| **Scoring** | Covered (3.21 Scoring Calculator) | Covered (Scoring Calculator Panel as dashed branch) | 3.21 VALID | Both paths | Doctor |
| **Audit trail** | Covered (3.21 Audit Trail) | Covered (Audit Trail Viewer screen) | 3.21 | Both paths | Doctor |
| **eHKS** | Covered (separate eHKS Documentation path) | Covered (eHKS Documentation Form as separate entry) | 3.21 | Both paths | Doctor |
| **Submission** | Transmit to DMP-Datenstelle | eDMP / eDoc Submission Dashboard | VSST1020 | Both paths | Doctor |

### IT Infrastructure

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| **Scope** | §13 IT Connectivity (~40 items) | Workflow 13: Admin — System Infrastructure | ITVE section | Both paths | Admin |
| **Mandatory components** | HPM, KIM, TI Connector | TI Connector Status Panel, KIM implied via eAU/eBrief | gematik TI/KIM | Both paths | Admin |
| **Optional modules** | eArztbrief (27), Hauskomet (40), TeleScan-Derma (34), DETE (32) | Module Management Panel (generic) | ITVE section | Both paths | Admin |
| **Contract management** | Not covered as separate workflow | Covered (HZV/FAV Contract Management Panel, Physician Identity, Contract Documents) | — | HZV/FAV only | Admin |
| **Coding rules** | Covered within §6/§7 diagnosis and service workflows | Covered (Coding Rule Settings + Multimorbidity Surcharge Patient List) | SDKRW, ICD-GM | Both paths | Admin / Doctor |

---

## 3. Coverage Gap Summary

### Only in Compliance Workflows (regulatory obligations, no UX surface)

- VSDM 16-step verification detail (FK 4136, timestamp, coverage, carrier status, IK validity, insurance splits, conflict detection)
- KV vs HZV/FAV path routing with HPM queries and eGK-Nummer gate
- TE signature requirements (2 vs 1 sig, HZV vs FAV)
- Insurance billing splits at change date (P2-535)
- Personengruppe / KTAB gate (AsylbLG, dissolved KTAB)
- Quarter transition compliance obligations
- Vollimport eGK matching and conflict resolution
- HZV/FAV medication label rules (Grün/Blau/Rot/Orange)
- Duplicate billing block (ABRG486)
- Contract feature gate enforcement (VERT686)

### Only in User Workflow Diagrams (product surfaces, not compliance-driven)

- EHIC Patient Entry Form (EU patients)
- Patient Match Review Panel
- Waiting Room Board
- Record type selection (Standard, TSS, Referral, Private)
- eEB via KIM flow
- DiGA Prescription Builder + Directory Browser
- BMP Import / Print
- ASV Billing Dashboard mode
- PTV Import Wizard
- AOK 18+ Check Panel
- MVZ Dashboard
- System Status Bar
- Cross-tier dependency diagram (Tier 1 → 2 → 3 cascade)

### Covered in Both (different granularity)

| Feature | Compliance Workflows | User Workflow Diagrams | Obligation ID | KV vs HZV/FAV | Role |
|---------|---------------------|------------------------|---------------|---------------|------|
| Card read | 12 states with obligation IDs | 4 states as screen names | KP2-100, P2-105, P2-135 | Both paths | MFA |
| Manual entry | 5 states + obligation tracing | Single screen node | KP2-102, P2-120 | Both paths | MFA |
| Carrier search | 4 states + temp record creation | Single screen node | P2-200, P2-220, P2-230 | Both paths | MFA |
| IK/coverage validation | 6 decision states | 2 states (expired, invalid) | P2-140, P2-166, P2-260 | Both paths | MFA |
| HZV/FAV enrollment | TE lifecycle + HPM transmission | 3-screen flow | VERE466, VERE555, VERE561 | HZV/FAV only | MFA |
| Drug safety | Interaction + dosage + Red Hand + PRISCUS | Interaction + dosage + Red Hand | VSST784 | Both paths | Doctor |
| eDMP | 6 programs + scoring + audit trail | 4-screen flow | VSST592, VSST1020 | Both paths | Doctor |
| Billing submission | 5 post-submission steps | Protocol view + post-submission editor | ABRG490, ABRG491, ABRG933 | Both paths | Doctor |
| eAU | Employment check gate (VSST622) | Transmission status screen | VSST599, VSST621, VSST622 | Both paths | Doctor |
| ePA | Browse → Entitle → Upload | 3-screen flow | 3.20 ePA | Both paths | Doctor |

---

## 4. Key Takeaway

The two files are **complementary, not redundant**:

- **Compliance Workflows** answers: *"What regulatory decisions must the system enforce, and when?"* It is the authoritative source for obligation tracing and KV/HZV divergence.
- **User Workflow Diagrams** answers: *"What screens does each role navigate through to complete a task?"* It is the authoritative source for UX surface coverage and role separation.

Neither file alone is sufficient for design or implementation. A complete picture requires both: the user workflow diagrams to define screen scope and navigation, and the compliance workflow diagrams to define the validation logic and legal gates within each screen.
