# Component Disambiguation Guides

**Purpose:** When two or more tini-library components seem equally suitable for a PVS-Core surface, these guides resolve the ambiguity with concrete rules grounded in product constraints.

**Audience:** Design team and AI agents building PVS-Core using the tini-library component library.

**How to use:** Find the component pair you are debating. Read the decision rule first. It resolves ~80% of cases. If your case is ambiguous, scan the table rows and PVS-Core Rule column for the constraint that applies.

---

## Anti-Pattern & UX Axis Reference

These tables reference the canonical constraint codes from `constraint-reference.md`. See that file for full descriptions and component rules.

| Code | Anti-Pattern |
|---|---|
| AP-1 | Auto-Execution Without Confirmation |
| AP-2 | Ambiguous Edit States |
| AP-3 | Generic Error Messages |
| AP-4 | Certification-Driven UI |
| AP-5 | Schein-Centric Navigation |
| AP-6 | TI-Error-Wall |
| AP-7 | Undifferentiated Alert Fatigue |
| AP-8 | Modal-Dialog Gauntlet |
| AP-9 | Context-Blind Quartalsabrechnung |
| AP-10 | One-Size-Fits-All MVZ Interface |
| AP-11 | eGK-Before-Everything Gate |
| AP-12 | Copy-Paste Documentation |
| AP-13 | Hidden Workflow State |
| AP-14 | Monolithic Patient Record |
| AP-15 | Disconnected Formularverwaltung |

| UX Axis | Definition |
|---|---|
| **UX-Speed** | Digital workflow <= analog equivalent. Minimize clicks/keystrokes. |
| **UX-Clarity** | Read-only vs editable unambiguous at a glance. No accidental modification. |
| **UX-Density** | Role workspace shows all key actions without scrolling on 24" 1920x1080. |

---

## 1. Dialog vs Sheet

**Decision rule:** Dialog for focused decisions that block the main task. Sheet for supplementary content viewed alongside the main task.

| Use Dialog when... | Use Sheet when... | PVS-Core Rule |
|---|---|---|
| User must make a yes/no decision | User needs reference information while working | AP-8: No modal gauntlets. If content is large, use Sheet so user can see main screen. |
| Content is small (1-2 fields, confirmation text) | Content is a form, list, or search panel | Density axis: Sheet keeps main content visible on 24" display. |
| User should NOT see underlying content | User NEEDS to see underlying content | Safety/Clarity axis: Sheet lets user compare data side-by-side. |
| Action is a one-time discrete choice | Panel will be opened/closed repeatedly during a workflow | Speed axis: Sheet is faster to re-open than Dialog. |

**PVS-Core examples:**
- **Dialog:** "Delete this enrollment declaration?" (yes/no, irreversible). BMP Import Dialog (one-time accept/reject action). pnSD Configuration Dialog (small settings form).
- **Sheet:** Cost Carrier Search Panel (search while seeing patient form). Coding Instructions Browser (reference while coding diagnoses). Drug Search Panel (browse drugs while building prescription).

---

## 2. Select vs Combobox

**Decision rule:** Select for fixed lists under 20 items. Combobox for searchable, dynamic, or large option sets.

| Use Select when... | Use Combobox when... | PVS-Core Rule |
|---|---|---|
| Options are fixed and known (<20 items) | Options are dynamic or >20 items | Speed axis: Combobox search is faster than scrolling 20+ items. |
| User can scan all options at a glance | User needs to type to find the right option | AP-15: Reduce input effort. If the system can narrow options, use Combobox. |
| Options are simple labels | Options have descriptions or grouped categories | Combobox supports CommandGroup for categorized results. |
| No server-side filtering needed | Options come from a master data file or API | Use Combobox with async loading for SDKT, SDICD, SDEBM lookups. |

**PVS-Core examples:**
- **Select:** Satzart (0101-0104, 4 options). DMP Indicator (fixed codes). Besondere Personengruppe. Record Type on Schein / Billing Record View.
- **Combobox:** ICD-10 code search on Patient Record View (14,000+ codes). Cost Carrier Search Panel (by IK/name/VKNR). Drug Search Panel (PZN/name). EBM GOP search on Schein / Billing Record View.

---

## 3. RadioGroup vs ToggleGroup vs Select

**Decision rule:** RadioGroup when all options must be visible and labeled. ToggleGroup for compact icon/short-label switches. Select when space is constrained.

| Use RadioGroup when... | Use ToggleGroup when... | Use Select when... | PVS-Core Rule |
|---|---|---|---|
| 2-5 options, each needs a visible label | 2-4 options, short labels or icons suffice | 5+ options OR limited horizontal space | Density axis: Don't waste space showing 15 radio buttons. |
| Labels are descriptive (>3 words) | Labels are 1-2 words or abbreviations | Labels are any length | Safety/Clarity axis: RadioGroup labels are easier to scan than a Select dropdown. |
| Selection is part of a form (deferred submit) | Selection has immediate effect (mode switch) | Selection is part of a form | RadioGroup for forms, ToggleGroup for mode switches. |
| Vertical layout is acceptable | Horizontal row is preferred | Inline with other fields | ToggleGroup is horizontal by default. |

**PVS-Core examples:**
- **RadioGroup:** Diagnosensicherheit (V/G/A/Z with full labels "Verdacht", "Gesichert", "Ausschluss", "Zustand nach") on Patient Record View. Record Type (0101/0102/0103/0104 with descriptions) on Card Read / Check-In Screen.
- **ToggleGroup:** Seitenlokalisation (R/L/B, single letters) on Patient Record View. Enrollment method (Online/Offline) on Enrollment Settings. Billing mode switch (KV/HZV-FAV/ASV) on Billing Dashboard.
- **Select:** DMP Indicator (12+ codes) on eDMP Documentation Form. Execution Timing (3 options in a settings panel with limited space). KV Region selector on Practice Administration Panel.

---

## 4. Badge vs Alert vs Toast

**Decision rule:** Badge for persistent ambient status. Alert for inline messages requiring attention. Toast for transient notifications.

| Use Badge when... | Use Alert when... | Use Toast when... | PVS-Core Rule |
|---|---|---|---|
| Showing entity state (active, expired, error) | Communicating an issue that needs user awareness | Confirming a completed action | AP-7: Tier severity visually. Badge < Alert < AlertDialog. |
| Information is always visible alongside its entity | Information appears conditionally (after validation, on state change) | Information is transient (auto-dismisses in 3-5s) | Don't use Alert for ephemeral success messages. Don't use Badge for actionable errors. |
| No user action needed | User may need to act (dismiss, fix, or acknowledge) | No user action needed (informational only) | AP-3: Alert errors must include entity + problem + fix step. |
| Small (1-3 words) | Medium (sentence or short paragraph) | Short (1 sentence) | Density: Badge is compact. Alert takes a full row. Toast overlays content temporarily. |

**PVS-Core examples:**
- **Badge:** "Verified" (VSDM status on Card Read / Check-In Screen). "Active" / "Ended" (participation status on Participation Management View). "3 violations" (count badge on Rule Violation Overview).
- **Alert:** "Missing ICD for GOP 01100. Add diagnosis to continue." (validation error on Schein / Billing Record View). "Code Z01.7 has special adoption rules" (info hint on Patient Record View). Contact Warning: "No Arzt-Patienten-Kontakt (0000) documented" on Schein / Billing Record View.
- **Toast:** "Record saved". "Declaration transmitted successfully" (after TE submission). "eEB applied to patient" (after card read).

---

## 5. Table vs Card List

**Decision rule:** Table for comparing multiple entities across shared attributes. Card list for entity-focused display where each item has unique structure or actions.

| Use Table / DataTable when... | Use Card list when... | PVS-Core Rule |
|---|---|---|
| Data has 3+ comparable columns | Each item is a self-contained entity with varying shape | Density axis: Table is denser for comparable data. |
| Users need to sort or filter by column | Items have varying content shapes or nested sub-items | DataTable supports sorting/filtering via @tanstack/react-table. |
| Row actions are 1-2 uniform buttons | Items have different actions or states per row | Use DropdownMenu in last Table column for uniform row actions. |
| All rows share identical structure | Some items are expanded/collapsed, some have badges, some have sub-items | Card list allows mixed content per item. |

**PVS-Core examples:**
- **Table:** Quarterly Notice Tracker (patient, type, status, date) on Termination Notice Manager. Certificate Status Matrix (analyte, GOP, status) on Lab Proficiency Gate. PTV Import changed patients list on PTV Import Wizard. TE Overview List (patient, TE-code, status, date).
- **Card list:** Diagnosis Timeline entries on Patient Record View (each has code + Klartext + severity badge + laterality + actions). Dauerdiagnosen sidebar (code + badge + adopt action). Violation rows on Rule Violation Overview (code + rule text + correction type + accept/reject).

---

## 6. Accordion vs Collapsible vs Sheet

**Decision rule:** Accordion for multiple related sections (one or many open). Collapsible for a single toggleable block. Sheet for large supplementary content.

| Use Accordion when... | Use Collapsible when... | Use Sheet when... | PVS-Core Rule |
|---|---|---|---|
| Multiple related sections that user explores | Single section that toggles open/closed | Content is large (form, search, reference browser) | Density axis: Accordion/Collapsible keeps content in-place. Sheet preserves main view. |
| Space-saving: show headings, expand on demand | One block of optional detail within a larger form | Content relates to but is independent from the main surface | AP-14: Progressive disclosure for long records. |
| Sections are peer-level (settings groups, FAQ) | Section is a sub-area of a larger form | Content needs side-by-side comparison with main view | Safety/Clarity: Sheet allows seeing both contexts simultaneously. |

**PVS-Core examples:**
- **Accordion:** Settings groups on Coding Rule Settings (execution timing, rule sets, severity thresholds). eDMP Documentation Form sections (multiple DMP modules collapsed by default). Billing Validation Results Panel (error groups by category).
- **Collapsible:** TSS Section on Schein / Billing Record View (optional fields, collapse when not a TSS case). Referral Section (optional, collapse when no Muster 6/10/39). AsylbLG restriction details on Card Read / Check-In Screen.
- **Sheet:** Coding Instructions Browser (SDVA reference text while coding diagnoses). Cost Carrier Search Panel (search while entering patient data on Manual Patient Entry Form). Hilfsmittelverzeichnis Search (browse catalog while filling Hilfsmittel Prescription Form).

---

## 7. Popover vs Tooltip vs HoverCard

**Decision rule:** Tooltip for text-only hints. HoverCard for rich previews. Popover for interactive content.

| Use Tooltip when... | Use HoverCard when... | Use Popover when... | PVS-Core Rule |
|---|---|---|---|
| Content is 1-2 lines of plain text | Content is a rich preview (image, stats, details) | Content is interactive (buttons, inputs, links) | Density: Tooltip is the lightest. Don't use Popover for a simple label. |
| Triggered by any element (button, icon, text) | Triggered by a link-like element (Button variant="link") | Triggered by a button or action element | UX-Clarity: Always show Klartext alongside codes. Tooltip can expand abbreviations on hover. |
| Disappears on mouse leave | Disappears on mouse leave (with delay) | Stays open until dismissed or clicked outside | Popover persists. Tooltip/HoverCard are ephemeral. |
| No user interaction within content | User might read but not interact | User clicks, types, or selects within content | Never put buttons inside a Tooltip. |

**PVS-Core examples:**
- **Tooltip:** Icon labels (e.g., coding guidance icon hover text on Patient Record View). Field hints on Manual Patient Entry Form. Abbreviation expansions (GOP, IK, VKNR, BSNR, LANR).
- **HoverCard:** Patient quick-view on name hover (DOB, insurance, last visit) on Waiting Room Board. ICD code preview (code + Klartext + Inklusiva) on Patient Record View. GOP preview (code + description + point value) on Schein / Billing Record View.
- **Popover:** Digit Completion Prompt (sub-code selection anchored to the code entry) on Patient Record View. Context Instruction Panel (SDVA text for a specific code, with "Open full browser" link). Scoring Calculator Panel inline trigger (quick score without opening full panel).

---

## 8. Inline Message vs Banner vs AlertDialog

**Decision rule:** Inline for field-level feedback. Banner for page-level warnings. AlertDialog for action-blocking confirmations.

| Use inline message (FormMessage) when... | Use banner (full-width Alert) when... | Use AlertDialog when... | PVS-Core Rule |
|---|---|---|---|
| Error/warning applies to a specific field or entry | Warning applies to the entire surface or page | User must confirm before a destructive or irreversible action executes | AP-7: Severity-tiered, role-tailored. Hard-stop only for critical. |
| Shown directly below/beside the relevant field | Shown at top of the content area | Blocks all other interaction until resolved | AP-8: Use AlertDialog sparingly. Never chain multiple. |
| Appears/disappears as user edits (live validation) | Persists until condition is resolved | Appears once, requires explicit confirm/cancel | AP-3: All messages must be actionable. Include fix step. |
| Uses FormMessage (inside Form) or small inline text | Uses Alert component at full-width | Uses AlertDialog with Action + Cancel buttons | Speed axis: Inline validation is faster feedback than end-of-form errors. |

**PVS-Core examples:**
- **Inline (FormMessage):** PLZ validation error under postal code field on Manual Patient Entry Form. Gene symbol validation error below input on eDMP Documentation Form. ICD format error under diagnosis code field on Patient Record View.
- **Banner (full-width Alert):** Contact Warning "No Arzt-Patienten-Kontakt (0000) documented" at top of Schein / Billing Record View. Acute-as-Permanent Diagnosis Warning on Patient Record View. Repeated Suspected Diagnosis Warning on Patient Record View. Late Submission Warning on Billing Dashboard.
- **AlertDialog:** "Delete diagnosis E11.9?" confirmation on Patient Record View. "Accept correction: Replace E11.9 with E11.65?" on Rule Violation Overview. Billing transmission confirmation on Billing Dashboard (HZV / FAV Mode). "End participation?" on Participation Management View.

---

## Quick-Reference Matrix

For fast lookup, this matrix maps common design questions to the correct section above.

| If you are choosing between... | See section |
|---|---|
| Modal overlay vs side panel | 1. Dialog vs Sheet |
| Dropdown vs searchable dropdown | 2. Select vs Combobox |
| Radio buttons vs toggle buttons vs dropdown | 3. RadioGroup vs ToggleGroup vs Select |
| Status indicator vs message vs notification | 4. Badge vs Alert vs Toast |
| Grid of rows vs list of cards | 5. Table vs Card List |
| Collapsing sections vs side panel | 6. Accordion vs Collapsible vs Sheet |
| Hover info vs hover preview vs click panel | 7. Popover vs Tooltip vs HoverCard |
| Field error vs page warning vs confirm dialog | 8. Inline Message vs Banner vs AlertDialog |
