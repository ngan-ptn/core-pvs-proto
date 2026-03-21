# gPRO V1 KV Compliance Gap Matrix

**Generated:** 2026-03-19
**Scope:** V1 — KV (statutory billing) only. HZV/FAV excluded.
**Source inventory:** `compliance-inventory.md` (604 items) → filtered to V1 KV scope
**Source gPRO analysis:** `IA260319-gpro-screen-inventory.md`, `FLOW260319-gpro-compliance-workflows.md`

---

## 1. Scope Filter Summary

### Excluded Sections (HZV/FAV Only)

| Section | Items | Reason |
|---------|-------|--------|
| 3.3 VERT — Contract Participation | 43 | HZV/FAV selective contract management only |
| 3.4 VERE — Patient Enrollment | 25 | HZV/FAV Teilnahmeerklärung management only |
| **Total excluded** | **68** | |

### HZV/FAV-Specific Items Excluded Within Shared Sections

| Section | Item ID | Obligation | Reason |
|---------|---------|-----------|--------|
| ABRD | ABRD675 | FAV referral form requirements | FAV-only |
| ABRD | ABRD834 | FAV service verification | FAV-only |
| ABRD | ABRD1544 | FAV referral rules | FAV-only |
| ABRD | ABRD1681 | FAV online verification | FAV-only |
| VSST | VSST1555 | VERAH TopVersorgt hint | HZV-only (VERAH program) |
| VSST | VSST1556 | VERAH TopVersorgt feature | HZV-only |
| VSST | VSST1574 | VERAH TopVersorgt list | HZV-only |
| ALLG | ALLG658 | MEDIVERBUND-ID (FAV only) | FAV-only |
| ALLG | ALLG1385 | FAV medi-verbund.de access | FAV-only |
| ALLG | ALLG1871 | HZV participation return data | HZV-only |
| ALLG | ALLG1685 | AWH_01 Hausärzteverband notice | HZV contract-specific |
| **Total** | **11** | | |

### Scope Summary

| Category | Items |
|----------|-------|
| Total in compliance inventory | 604 |
| Excluded — VERT (full section) | 43 |
| Excluded — VERE (full section) | 25 |
| Excluded — HZV/FAV items in shared sections | 11 |
| **V1 KV scope total** | **525** |

---

## 2. Gap Matrix by Compliance Section

### Coverage Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Covered in gPRO |
| ◐ | Partially covered (basic functionality, missing validation/rules) |
| ✗ | Not covered in gPRO — handled by web app or not yet built |
| N/A | Infrastructure/admin item — not a UI concern for gPRO |

---

### 3.1 ABRD — Billing Documentation (42 items in KV scope)

4 FAV-specific items excluded (ABRD675, ABRD834, ABRD1544, ABRD1681). 42 remain.

| # | ID | Obligation (abbreviated) | Req Type | gPRO Coverage | gPRO Screen | Gap Detail |
|---|-----|--------------------------|----------|---------------|-------------|------------|
| 1 | ABRD456 | Code 0000 (Arzt-Patienten-Kontakt) prompt | M | ✗ | — | No APK prompt in QuickEntry or Timeline |
| 2 | ABRD457 | Referral form hint text | M | ✗ | — | No referral form support in TUI |
| 3 | ABRD514 | Acute-as-permanent diagnosis warning | M | ✗ | — | No diagnosis type classification |
| 4 | ABRD601 | Billing data labeling per contract | M | ✗ | — | No billing documentation |
| 5 | ABRD602 | Contract-specific service documentation | M | ✗ | — | No contract-specific filtering |
| 6 | ABRD603 | Service lookup filter by KV region | M | ✗ | G005b | EBM search has no region filter |
| 7 | ABRD604 | Service text per contract | M | ✗ | — | No contract service text |
| 8 | ABRD606 | Service lookup filter by IK assignment | M | ✗ | G005b | No IK filtering |
| 9 | ABRD607 | Service deletion protection | M | ✗ | — | No deletion protection |
| 10 | ABRD608 | Diagnoses per §295 SGB V | M | ✗ | — | No §295 enforcement |
| 11 | ABRD609 | Permanent diagnoses carry-forward | M | ✗ | — | No Dauerdiagnose pool |
| 12 | ABRD611 | Terminal ICD code enforcement | M | ✗ | G005a | No terminal/non-terminal check |
| 13 | ABRD612 | Non-terminal code rejection warning | M | ✗ | G005a | No non-terminal warning |
| 14 | ABRD613 | "UUU" only with Auftragsleistung | M | ✗ | — | No UUU validation |
| 15 | ABRD659 | Patient-related documentation | M | ◐ | G005 | Timeline exists but lacks structured documentation |
| 16 | ABRD660 | Treatment case numbering | M | ✗ | — | No case numbering |
| 17 | ABRD679 | ICD-10 validity against catalog | M | ◐ | G005a | Search returns valid codes; no explicit validation on entry |
| 18 | ABRD830 | Service lookup filter by IK group | M | ✗ | G005b | No IK group filter |
| 19 | ABRD831 | Diagnosis documentation mandatory | M | ✗ | — | No diagnosis requirement enforcement |
| 20 | ABRD832 | Contract service text variant | M | ✗ | — | No contract text |
| 21 | ABRD833 | Service filter by GP/specialist | M | ✗ | — | No GP/specialist filter |
| 22 | ABRD920 | Preventive case marking | M | ✗ | — | No Vorsorge marker |
| 23 | ABRD921 | Case type assignment | M | ✗ | — | No case type management |
| 24 | ABRD968 | Treatment case rules | M | ✗ | — | No case rules |
| 25 | ABRD969 | Acute-as-permanent warning variant | M | ✗ | — | No diagnosis type warnings |
| 26 | ABRD970 | Home visit facility name required | M | ✗ | — | No home visit support |
| 27 | ABRD991 | OPS codes mandatory when applicable | M | ✗ | — | No OPS support |
| 28 | ABRD992 | OPS validity check | M | ✗ | — | No OPS validation |
| 29 | ABRD993 | Additional info fields | M | ✗ | — | No Zusatzinfo fields |
| 30 | ABRD1005 | Fee schedule variant | M | ✗ | — | No fee schedule |
| 31 | ABRD1006 | Service text variant 2 | M | ✗ | — | No variant text |
| 32 | ABRD1009 | Referral hint text variant | M | ✗ | — | No referral forms |
| 33 | ABRD1010 | Service assignment rules | M | ✗ | — | No assignment rules |
| 34 | ABRD1035 | Additional info fields per contract | M | ✗ | — | No Zusatzinfo |
| 35 | ABRD1062 | Home visit code 0008 hint | M | ✗ | — | No home visit hints |
| 36 | ABRD1063 | Code 0008 variant | M | ✗ | — | No home visit |
| 37 | ABRD1235 | Contract service catalog update | M | ✗ | — | No catalog management |
| 38 | ABRD1236 | Catalog version tracking | M | ✗ | — | No version tracking |
| 39 | ABRD1564 | Age precondition per KV region | M | ✗ | — | No age validation |
| 40 | ABRD1565 | Age rules variant | M | ✗ | — | No age rules |
| 41 | ABRD1846 | Contract activation data | M | ✗ | — | No contract activation |
| 42 | ABRD1847 | Additional ABRD item | M | ✗ | — | Not in gPRO scope |

**Section total: 0 ✓, 2 ◐, 40 ✗**

---

### 3.2 ABRG — Billing Process (45 items)

All 45 items are in KV scope (billing submission is a KV requirement). None are HZV/FAV-specific.

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | 0 | — |
| ✗ Not covered | 45 | Full billing process not in gPRO — handled by web app |

**Key missing capabilities:**
- Offline billing via data carrier (ABRG386)
- Billing process control per contract (ABRG454)
- Control list generation (ABRG490)
- HPM data transmission (ABRG491-498)
- Duplicate billing prevention (ABRG499)
- KV-Connect/KIM transmission (ABRG510-520)
- Billing acknowledgment processing (ABRG540-560)
- Error feedback display (ABRG570-580)
- Quarter close workflow (ABRG590-600)

**Section total: 0 ✓, 0 ◐, 45 ✗**

---

### 3.5 FORM — Form Management (45 items)

All 45 items are in scope. Most FORM items are AKA contract forms (not HZV/FAV-specific — all contract types need forms).

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | 0 | — |
| ✗ Not covered | 45 | Forms require printing/PDF — outside TUI scope |

**Key missing:** BFB (Blankoformularbedruckung), Muster forms, Volldruck printing, eAU form generation.

**Section total: 0 ✓, 0 ◐, 45 ✗**

---

### 3.6 VSST — Practice Software (62 items in KV scope)

3 HZV-specific items excluded (VSST1555, VSST1556, VSST1574 — VERAH TopVersorgt). 62 remain.

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | 0 | — |
| ✗ Not covered | 62 | Infrastructure/practice management — outside TUI scope |

**Key items:** Prescription data marking (VSST496), medication DB updates (VSST510), contract-specific software configuration (VSST520-570), data transmission scheduling (VSST580-600), eDMP (VSST1749).

**Section total: 0 ✓, 0 ◐, 62 ✗**

---

### 3.7 ALLG — General Requirements (25 items in KV scope)

3 items excluded (ALLG658 FAV, ALLG1385 FAV, ALLG1685 HZV). Note: ALLG1871 (HZV return data) also excluded. Some grouped items (ALLG1386-1684, ALLG1686-1849, ALLG1853-1870) count as single line items. 25 line-items remain.

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | 0 | — |
| ✗ Not covered | 25 | Admin/compliance infrastructure — outside gPRO TUI scope |
| N/A | — | These are admin/org-level requirements |

**Key items:** Audit module (ALLG483, ALLG620, ALLG687), advertising prohibition (ALLG508), KVDT catalog functions (ALLG653), HÄVG-ID management (ALLG657), contract management (ALLG660-662), user manual (ALLG799), change documentation (ALLG824), fee schedule management (ALLG1003), KV region contract filtering (ALLG1014).

**Section total: 0 ✓, 0 ◐, 25 ✗**

---

### 3.8 ITVE — IT Connectivity (6 items)

All Konditional/Optional. Applies to all contract types.

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✗ Not covered | 6 | TI connector integration — outside gPRO scope |

**Section total: 0 ✓, 0 ◐, 6 ✗ (all Optional/Konditional)**

---

### 3.9 DETE — Data Exchange (1 item)

Optional. Outside gPRO scope.

**Section total: 0 ✓, 0 ◐, 1 ✗ (Optional)**

---

### 3.10 PSDV — Patient Master Data (1 item)

| # | ID | Obligation | gPRO Coverage | Gap |
|---|-----|-----------|---------------|-----|
| 305 | PSDV654 | KT master data file (ehd) support | ✗ | Card read requires hardware — web app handles |

**Section total: 0 ✓, 0 ◐, 1 ✗**

---

### 3.11 KBV EBM — Statutory Billing Rules (14 items)

All 14 items are core KV scope.

| # | Obligation (abbreviated) | Req | gPRO | gPRO Screen | Gap |
|---|--------------------------|-----|------|-------------|-----|
| 306 | Gender-restricted EBM code warning | M | ✗ | G005b | No gender check on EBM entry |
| 307 | Age-restricted EBM code warning | M | ✗ | G005b | No age check |
| 308 | EBM frequency limit enforcement | M | ✗ | G005b | No frequency check |
| 309 | ICD-required services must block without diagnosis | M | ✗ | G005b | No diagnosis prerequisite check |
| 310 | OPS-required services must block without OPS | M | ✗ | — | No OPS support |
| 311 | Genetic services require OMIM codes | M | ✗ | — | No OMIM support |
| 312 | Genetic services require HGNC codes | M | ✗ | — | No HGNC support |
| 313 | Substitute doctor RVSA certificate | M | ✗ | — | No substitute doctor support |
| 314 | EBM exclusion rules (same-day/same-case) | M | ✗ | G005b | No exclusion checking |
| 315 | EBM Zusatzziffer/Zuschlag pairing | M | ✗ | G005b | No surcharge pairing |
| 316 | EBM reporting/approval/§115b flags | M | ✗ | — | No flag display |
| 317 | Doctor specialty gate | M | ✗ | G005b | No Fachgruppe check |
| 318 | Region-specific age rules | M | ✗ | G005b | No regional rules |
| 319 | Age-based EBM code conversion suggestion | M | ✗ | G005b | No conversion suggestion |

**Section total: 0 ✓, 0 ◐, 14 ✗**

---

### 3.12 GOÄ — Private Billing Rules (1 item)

| # | Obligation | gPRO | Gap |
|---|-----------|------|-----|
| 320 | GOÄ private billing validation | ✗ | No private billing in gPRO |

**Section total: 0 ✓, 0 ◐, 1 ✗**

---

### 3.13 KBV TSS — Appointment Surcharges (1 item)

| # | Obligation | gPRO | Gap |
|---|-----------|------|-----|
| 321 | TSS surcharge suggestion | ✗ | No TSS support in gPRO |

**Section total: 0 ✓, 0 ◐, 1 ✗**

---

### 3.14 KBV ICD-10-GM — Diagnosis Master Data (1 item)

| # | Obligation | gPRO | Gap |
|---|-----------|------|-----|
| 322 | ICD-10-GM catalog must be loadable/updatable | ◐ | gPRO searches catalog via API (G005a) but doesn't manage catalog updates |

**Section total: 0 ✓, 1 ◐, 0 ✗**

---

### 3.15 KVDT — Patient Data Management (73 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | ~10 | Read-only display of patient demographics (G003) |
| ✗ Not covered | ~63 | Card read, VSDM, field-level controls, data entry |

**Partially covered items (read-only in G003):**

| ID | Obligation | gPRO Screen | Status |
|----|-----------|-------------|--------|
| KP2-105 | Patient name, DOB, gender capture | G003 | ◐ Read-only display |
| KP2-120 | Cost carrier (insurance) data | G003 | ◐ Read-only display |
| P2-200 | Insurance number display | G003 | ◐ Read-only display |
| P2-400 | Record type (K/P) | G003 | ◐ Read-only display |

**Not covered (requires hardware/entry):**
- KP2-100: eGK/KVK card capture
- KP2-101: Legacy KVK rejection
- KP2-121: KVK rejection logic
- KP2-135: Card read date
- KP2-185: Field-level controls
- KP2-190: VSDM online verification
- P2-140, P2-166: Coverage validity dates
- P2-260: Cost carrier IK/VKNR
- P2-530, P2-535: Record split/insurance change
- ~53 additional patient data field requirements

**Section total: 0 ✓, ~10 ◐, ~63 ✗**

---

### 3.16 ICD-10-GM — Diagnosis Coding (57 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 1 | Basic ICD search (G005a) |
| ◐ Partial | 1 | Code validity (search returns only valid codes) |
| ✗ Not covered | 55 | All validation rules |

**Covered:**

| ID | Obligation | gPRO Screen | Status |
|----|-----------|-------------|--------|
| O10-001 | ICD-10 code search | G005a | ✓ SearchDiagnosis against SDICD catalog |
| O10-002 | Code display with text | G005a | ◐ Shows code + description but no coding metadata |

**Critical gaps (Mandatory):**

| ID Range | Obligation | Impact |
|----------|-----------|--------|
| ICD-GM.1-4 | Diagnosensicherheit (V/G/A/Z) | Billing-blocking — KV rejects without it |
| ICD-GM.7 | Laterality (R/L/B) | Required for applicable codes |
| ICD-GM.14 | Gender plausibility | Blocks invalid gender-diagnosis combos |
| ICD-GM.15 | Age plausibility | Blocks invalid age-diagnosis combos |
| ICD-GM.26 | Terminal code enforcement | Non-terminal codes rejected at billing |
| ICD-GM.40-47 | Coding rules (SDKRW) execution | Cross-code, dagger/asterisk, exclusion rules |

**Optional items not covered (O10-003 through O10-015):** Auto-complete, diagnosis-to-service mapping, multimorbidity analysis, plausibility checks, history trending, smart suggestions, severity scoring, recall scheduling.

**Section total: 1 ✓, 1 ◐, 55 ✗**

---

### 3.17 KVDT — Service Documentation (41 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✓ Covered | 0 | — |
| ◐ Partial | 3 | Basic service entry via QuickEntry (G005b) |
| ✗ Not covered | 38 | Structured service fields, audit, linkages |

**Partially covered:**

| ID | Obligation | gPRO | Gap |
|----|-----------|------|-----|
| P2-600 | Service code, date, physician capture | ◐ | QuickEntry captures code; date auto-set; physician from session — but no structured field editing |
| P2-610 | Free-text annotations | ◐ | QuickEntry `n:` note exists but minimal |
| P2-609 | Service-to-diagnosis linkage | ◐ | Timeline shows both but no explicit linkage management |

**Not covered:** Service time (P2-601), frequency count (P2-602), deletion audit (P2-603), referral documentation (P2-604), co-treatment (KP2-612), substitution rules (P2-607), qualification requirements (P2-608), laboratory documentation (P2-620-640).

**Section total: 0 ✓, 3 ◐, 38 ✗**

---

### 3.18 KVDT — Billing Infrastructure (44 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✗ Not covered | 44 | Billing transmission, pruefmodul, xDT — infrastructure scope |

**Key items:** Billing file generation (P6-800-806), backup/restore (P6-807), RBAC (P6-808), audit trail (P6-809), print management (P6-810), GDT/BDT/LDT interfaces (P6-811-813), xDT compliance (P6-814), KBV certificates (P6-815), KV-Connect (P6-816), version management (P6-817), error logging (P6-818), billing transmission (P21-001-003), pruefmodul (P21-010-012), acknowledgments (P21-015).

**Section total: 0 ✓, 0 ◐, 44 ✗**

---

### 3.19 Crucial Workflows — E-Rezept & Prescription (24 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✗ Not covered | 24 | E-Rezept, drug safety, Heilmittel, DiGA — web app scope |

**Key items:** E-Rezept creation (ERX-001-008), drug database (DDB-001-006), Heilmittel (HLM-001-004), Hilfsmittel (HFM-001-002), DiGA (EVDGA-001-002), BMP (BMP-001-002).

**Section total: 0 ✓, 0 ◐, 24 ✗**

---

### 3.20 Crucial Workflows — Forms, eAU, eArztbrief & ePA (20 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✗ Not covered | 20 | BFB printing, eAU, eArztbrief, ePA — web app scope |

**Key items:** BFB Muster forms (BFB-001-010), eAU transmission (EAU-001-005), eArztbrief (EAB-001-003), ePA (EPA-001-002).

**Section total: 0 ✓, 0 ◐, 20 ✗**

---

### 3.21 Crucial Workflows — eDMP & eDocumentation (12 items)

| gPRO Coverage | Count | Notes |
|---------------|-------|-------|
| ✗ Not covered | 12 | eDMP, eHKS, scoring, audit — web app scope |

**Key items:** eDMP programs (EDMP-001-006), eHKS (EHKS-001-002), scoring (CALC-001-002), §630f audit (AUDIT-001), interoperability (INT-001).

**Section total: 0 ✓, 0 ◐, 12 ✗**

---

## 3. Consolidated Coverage Dashboard

### By Coverage Status

| Status | Count | % of V1 KV (525) |
|--------|-------|-------------------|
| ✓ Fully covered | 1 | 0.2% |
| ◐ Partially covered | ~17 | 3.2% |
| ✗ Not covered | ~507 | 96.6% |
| **Total V1 KV scope** | **525** | **100%** |

### By Section

| Section | KV Items | ✓ | ◐ | ✗ | gPRO Relevance |
|---------|----------|---|---|---|----------------|
| 3.1 ABRD — Billing Documentation | 42 | 0 | 2 | 40 | Medium — diagnosis/service validation gaps |
| 3.2 ABRG — Billing Process | 45 | 0 | 0 | 45 | None — web app handles billing |
| 3.5 FORM — Form Management | 45 | 0 | 0 | 45 | None — requires printing/PDF |
| 3.6 VSST — Practice Software | 62 | 0 | 0 | 62 | None — infrastructure scope |
| 3.7 ALLG — General Requirements | 25 | 0 | 0 | 25 | None — admin/org level |
| 3.8 ITVE — IT Connectivity | 6 | 0 | 0 | 6 | None — TI connector scope |
| 3.9 DETE — Data Exchange | 1 | 0 | 0 | 1 | None — Optional |
| 3.10 PSDV — Patient Master Data | 1 | 0 | 0 | 1 | None — card read requires hardware |
| 3.11 KBV EBM — Billing Rules | 14 | 0 | 0 | 14 | **High** — validation at point of entry |
| 3.12 GOÄ — Private Billing | 1 | 0 | 0 | 1 | Low — private billing |
| 3.13 KBV TSS — Surcharges | 1 | 0 | 0 | 1 | Low — appointment surcharges |
| 3.14 KBV ICD-10-GM — Master Data | 1 | 0 | 1 | 0 | Low — catalog management |
| 3.15 KVDT — Patient Data | 73 | 0 | 10 | 63 | Medium — read-only display exists |
| 3.16 ICD-10-GM — Diagnosis Coding | 57 | 1 | 1 | 55 | **High** — core gPRO workflow |
| 3.17 KVDT — Service Documentation | 41 | 0 | 3 | 38 | **High** — core gPRO workflow |
| 3.18 KVDT — Billing Infrastructure | 44 | 0 | 0 | 44 | None — infrastructure scope |
| 3.19 Crucial — E-Rezept | 24 | 0 | 0 | 24 | None — web app scope |
| 3.20 Crucial — Forms/eAU/ePA | 20 | 0 | 0 | 20 | None — web app scope |
| 3.21 Crucial — eDMP | 12 | 0 | 0 | 12 | None — web app scope |
| **Total** | **525** | **1** | **17** | **507** | |

---

## 4. Priority Gap Analysis — gPRO-Actionable Items

These are gaps that gPRO can realistically close because they relate to workflows already partially implemented in the TUI.

### P1 — Billing-Blocking (must fix for KV acceptance)

| # | Gap | Compliance Ref | gPRO Screen | Effort |
|---|-----|---------------|-------------|--------|
| 1 | **Diagnosensicherheit (V/G/A/Z)** not captured on diagnosis entry | ICD-GM.1-4 | G005a | QuickEntry extension: add V/G/A/Z picker after ICD selection |
| 2 | **Terminal code enforcement** — non-terminal ICD codes accepted without warning | ICD-GM.26, ABRD611-612 | G005a | Validation layer: check IsTerm flag from SDICD catalog |
| 3 | **EBM gender check** — gender-restricted codes not validated | EBM.1 (KBV EBM #306) | G005b | Validation: cross-check patient gender with EBM restrictions |
| 4 | **EBM age check** — age-restricted codes not validated | EBM.2 (#307) | G005b | Validation: cross-check patient age with EBM restrictions |
| 5 | **EBM frequency limit** — no enforcement per reference period | EBM.3 (#308) | G005b | Requires period-aware counting service |
| 6 | **EBM exclusion rules** — no same-day/same-case checking | EBM.5-8 (#314) | G005b | Requires session-aware exclusion engine |
| 7 | **Diagnosis required per §295** — no enforcement | ABRD608 | G005 | Timeline-level check before billing |

### P2 — Compliance-Required (needed for audit, not blocking per-entry)

| # | Gap | Compliance Ref | gPRO Screen | Effort |
|---|-----|---------------|-------------|--------|
| 8 | **Laterality (R/L/B)** not captured | ICD-GM.7 | G005a | QuickEntry extension: add laterality picker for applicable codes |
| 9 | **Coding rules (SDKRW)** not executed | ICD-GM.40-47 | G005a | New service: SDKRW rule engine integration |
| 10 | **Code 0000 (APK) warning** | ABRD456 | G005b | Timeline: warn if no APK code in case |
| 11 | **EBM specialty gate** — no Fachgruppe check | EBM.4 (#317) | G005b | Validation: cross-check doctor specialty |
| 12 | **Service-to-diagnosis linkage** | P2-609, KVDT-SD | G005 | Timeline: explicit diagnosis-service association |
| 13 | **Gender plausibility for ICD** | ICD-GM.14 | G005a | Validation: cross-check patient gender |
| 14 | **Age plausibility for ICD** | ICD-GM.15 | G005a | Validation: cross-check patient age |
| 15 | **KV region service filter** | ABRD603 | G005b | EBM search filter by BSNR KV region |

### P3 — UX/Completeness (improves coverage, lower urgency)

| # | Gap | Compliance Ref | gPRO Screen | Effort |
|---|-----|---------------|-------------|--------|
| 16 | **Dauerdiagnose management** — no permanent diagnosis pool | ABRD609 | G005 | New component: chronic diagnosis carry-forward |
| 17 | **VSDM status display** | KP2-190 | G003 | Patient detail: show coverage verification status |
| 18 | **Coverage validity dates** | P2-140, P2-166 | G003 | Patient detail: show insurance validity period |
| 19 | **Card read date display** | KP2-135 | G003 | Patient detail: show last eGK read date |
| 20 | **TSS surcharge suggestion** | KBV TSS (#321) | G005b | Prompt TSS surcharge for appointment services |
| 21 | **OPS code entry** | ABRD991-992 | G005 | QuickEntry extension: `o:CODE` prefix for OPS |
| 22 | **Service time capture** | P2-601 | G005b | QuickEntry extension for time-based codes |
| 23 | **Service deletion audit** | P2-603 | G005 | Audit log for timeline entry deletions |
| 24 | **Acute-as-permanent warning** | ABRD514, ABRD969 | G005a | Warning when ICD pattern suggests chronic mis-coding |

---

## 5. Items Not Actionable in gPRO (Web App / Infrastructure)

These 486 items require capabilities fundamentally outside gPRO's TUI scope:

| Category | Count | Reason |
|----------|-------|--------|
| Billing submission & transmission (ABRG, KVDT-Billing) | 89 | Requires pruefmodul, KV-Connect, data carrier export |
| Forms & printing (FORM, BFB, eAU) | 65 | Requires PDF rendering, BFB printing, form management |
| Practice software infrastructure (VSST) | 62 | Requires medication DB, data transmission, contract config |
| E-Rezept & prescription (Crucial 3.19) | 24 | Requires gematik Fachdienst, drug DB, comfort signature |
| Patient data entry & card read (KVDT-Patient, PSDV) | 64 | Requires eGK reader, VSDM, TI connector |
| General admin/compliance (ALLG) | 25 | Org-level requirements, manual review items |
| eDMP & e-documentation (Crucial 3.21) | 12 | Requires DMP workflows, §630f compliance |
| eArztbrief & ePA (Crucial 3.20) | 20 | Requires KIM, ePA connector |
| IT connectivity (ITVE) | 6 | Optional/Konditional TI features |
| Data exchange, GOÄ, other (DETE, GOÄ, TSS) | 3 | Outside TUI scope |
| Remaining KVDT service/ABRD items | ~116 | Structured data entry, referral forms, contract-specific |

---

## 6. Recommendations

### For gPRO V1 KV Release

1. **Implement P1 gaps (#1-7)** — These are billing-blocking. Without Diagnosensicherheit and terminal code enforcement, diagnoses entered via gPRO will be rejected at KV billing. Without EBM validation, invalid services will pass through.

2. **Implement P2 gaps (#8-15)** — These are audit-relevant. Missing laterality, coding rules, and specialty gates will generate Prüfmodul warnings during billing.

3. **Defer P3 gaps (#16-24)** — These improve completeness but don't block billing acceptance.

### Architecture Implication

P1/P2 gaps can be addressed by adding a **validation layer** between QuickEntry input and CreateTimeline submission. This layer would:
- Query patient demographics (already available in AppState)
- Query EBM/ICD rule engines (new service endpoints needed)
- Present warnings/blocks before timeline entry creation
- Add metadata fields (Diagnosensicherheit, laterality) to the entry

No new pages are needed — all work happens within the existing G005/G005a/G005b flow.
