# Component Selection Matrices

**Purpose:** Reference tables for choosing tini-library UI components when designing PVS-Core screens.
**Audience:** Design team + AI agents building German healthcare practice management software.
**Desktop target:** 1920x1080 (24" monitors). No mobile/tablet.
**Design system:** tini-library (shadcn/ui-based). OKLCH color tokens with light/dark themes.

---

## Table A: Status & Feedback

**Mapping Rule:** Badge = ambient/persistent status on an entity. Alert = inline message requiring user attention. Toast = transient notification that auto-dismisses. AlertDialog = blocking confirmation that halts workflow until resolved.

| # | UI Need | Severity | Persistence | Interruption Level | Component | Watch Out |
|---|---------|----------|-------------|-------------------|-----------|-----------|
| 1 | Status indicator on a record/entity (e.g., "VSDM verified", enrollment status, case completion) | Informational | Persistent, reflects current state | None. Ambient. | **Badge** (variant by meaning: `default` neutral, `success` positive, `warning` caution, `destructive` critical) | Do not use Badge for actionable messages. Badge is read-only status. If the user must do something, use Alert instead. |
| 2 | Version/metadata label (e.g., SDICD version "2025-Q1", SDVA version) | None | Persistent | None | **Badge** `variant="secondary"` | Secondary variant signals "metadata, not status." Do not use `default` or colored variants for version strings. |
| 3 | Inline validation error (blocking, prevents save) | Critical | Persistent until resolved | High. Blocks submission. | **Alert** `variant="destructive"` with `AlertTitle` + `AlertDescription`. Place inline near the offending field. | AP #3: Error messages must be actionable and domain-specific. Include entity + problem + fix step. "Diagnose J06.9 fehlt Diagnosesicherheit" not "Validation error." AP #7: Tier by severity. This is the highest inline tier. |
| 4 | Inline validation warning (non-blocking, dismissible) | Warning | Persistent, but dismissible | Medium. Informational. | **Alert** `variant="warning"` with optional dismiss Button (`variant="ghost"` `size="icon"`). | AP #7: Must be visually distinct from destructive. Warning = yellow/amber token, not red. User can proceed without resolving. |
| 5 | Info hint (non-blocking, low priority, dismissible) | Low | Dismissible | Low | **Alert** `variant="info"` with dismiss action. | Use sparingly. If the hint is always relevant, consider static helper text with `Label` + `text-muted-foreground` instead of a dismissible Alert. |
| 6 | Page-level warning banner (e.g., "Kein Arzt-Patienten-Kontakt dokumentiert") | Warning | Persistent until condition resolved | Medium-High. Top of page. | **Alert** `variant="warning"`, full-width, placed above page content. | AP #7: One banner max per page. Multiple banners = user ignores all of them. Consolidate into a single Alert with a list if multiple warnings exist. |
| 7 | Transient success notification (e.g., "Abrechnung gespeichert") | None | Auto-dismisses (~3s) | Low | **`toast()`** via Sonner. Default style. | AP #8: Never use toast for errors that require action. Toast disappears. If the user must fix something, use inline Alert. |
| 8 | Transient error notification (e.g., "Ubermittlung fehlgeschlagen, Netzwerkfehler") | Error | Auto-dismisses (~5s) or persistent with dismiss | Medium | **`toast.error()`** via Sonner. | AP #6: TI errors must degrade gracefully. If the error is recoverable, include a retry action in the toast. If it requires user intervention, use inline Alert instead. |
| 9 | Count/badge on navigation item (e.g., "3 Verstobe") | Varies | Persistent, updates live | Low. Ambient. | **Badge** `variant="destructive"` for violation counts. `variant="default"` for neutral counts. | Keep badge text short: number only or "3 neu." Never a full sentence in a nav badge. |
| 10 | Color-coded severity / traffic-light (e.g., certificate status matrix, risk score) | Mapped to scale | Persistent | None. Visual encoding. | **Custom build:** Use severity token scale (0-10, green-to-red). Apply to Badge `className` with severity-color utility, or to custom indicator elements. Tokens: `--severity-0` through `--severity-10`. | Do not use arbitrary hex colors. Always map to the severity scale tokens for consistency and dark-mode support. Document the mapping (e.g., "valid = severity-2, expiring = severity-6, expired = severity-9"). |
| 11 | Read-only data label (e.g., "Einlesedatum: 15.03.2026", Versorgungskontext) | None | Persistent | None | **Plain text** with `Label` element + value in `<span>`. NOT Badge. | Badges imply status/category. A read-in date is just data. Use `text-muted-foreground` for the label, `text-foreground` for the value. |
| 12 | Blocking confirmation before destructive action (e.g., "Abrechnung wirklich loschen?") | Critical | Blocks until user decides | Maximum. Modal. | **AlertDialog** with `AlertDialogAction` (destructive) + `AlertDialogCancel`. | AP #8: No modal gauntlets. One AlertDialog per action. Never chain AlertDialogs. The description must state the consequence clearly: "Diese Aktion kann nicht ruckgangig gemacht werden." |

---

## Table B: Data Display & Lists

**Mapping Rule:** DataTable = interactive tabular data with sorting/filtering/pagination. Table (primitive) = static read-only tabular data. Card = entity-focused grouped display. For non-tabular structured data, compose from primitives.

| # | UI Need | Data Shape | Row Count | Actions Per Row | Component | Watch Out |
|---|---------|------------|-----------|-----------------|-----------|-----------|
| 1 | Structured tabular data with sortable columns (e.g., Abrechnungspositionen, Patientenliste, Formularbestandsliste) | Columnar, homogeneous rows | 10-1000+ | 0-3 (edit, delete, open) | **DataTable** (@tanstack/react-table). Column definitions with `accessorKey`. Built-in sorting, filtering, pagination. | UX Density: All key actions visible without scrolling on 1920x1080. Pin action columns. Use `size="sm"` rows for high-density lists. AP #14: Paginate or virtualize lists >50 rows. |
| 2 | Tabular data, read-only, few rows (e.g., Regelanderungsubersicht, Zertifikatsstatus-Matrix) | Columnar, fixed data | 2-15 | 0 | **Table** (primitive: `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`). No tanstack needed. | Do not import DataTable for static content. Primitive Table is lighter. Use `text-muted-foreground` for secondary columns. |
| 3 | Entity-focused display with grouped fields (e.g., Diagnose-Eintrag showing ICD-Code + Klartext + Sicherheit + Seitenlokalisation) | Heterogeneous fields, single entity | 1 | 1-3 (edit, remove, detail) | **Card** (`CardHeader` with `CardTitle`, `CardContent` for fields, `CardFooter` for actions). Embed Badge for status, Button `variant="ghost"` for actions. | Cards are for entity summaries, not forms. If the user edits fields inline, use a form layout inside a Card shell. Keep Cards scannable: 3-5 key fields visible. |
| 4 | Chronological list of entries (e.g., Diagnosen-Zeitverlauf, Behandlungstage, Leistungshistorie) | Time-ordered items | 5-100+ | 1-2 per item | **Custom build:** Compose from Card shells as list items + date grouping headers (`<h3>` + `Separator`). Wrap in `ScrollArea` if >10 items. | AP #14: No monolithic scroll. Group by date (day/quarter). Use sticky date headers. Consider collapsing older groups with Collapsible. |
| 5 | Sidebar list with action per item (e.g., Dauerdiagnosen with "Ubernehmen" action) | Label + status + action per item | 3-30 | 1 | **Custom build:** `div` container, each item is a flex row with text + `Badge` (status) + `Button variant="ghost" size="sm"` (action). | Keep items single-line where possible. Action button text should be a verb: "Ubernehmen", "Entfernen." Use `hover:bg-accent` on rows for interactivity cue. |
| 6 | Two-column comparison (e.g., Kartendaten vs. Bestandsdaten, Vorher/Nachher) | Paired fields, side by side | N/A | 0-1 (accept/reject per field) | **Custom build:** CSS Grid `grid-cols-2` with field labels as row headers. NOT Table. Highlight differences with `bg-warning/10` or `text-destructive`. | Table implies rows of similar items. Comparison is field-by-field. Use color-coding to draw attention to mismatches. Always label which side is which: "Karte" vs. "Bestand." |
| 7 | Hierarchical/nested content (e.g., Inhaltsverzeichnis, grouped settings, FAQ) | Tree structure, parent-child | 3-20 groups | 0 | **Accordion** `type="single"` with `collapsible` prop. `AccordionItem` per group, `AccordionTrigger` + `AccordionContent`. | Default to collapsed. Open the most-used section by default via `defaultValue`. Do not nest Accordions inside Accordions. |
| 8 | Long scrollable content within a bounded area (e.g., SDVA full text, regulation text, Abrechnungshinweise) | Continuous text or list | N/A | 0 | **ScrollArea** with explicit `h-[value]` constraint. | Always set a max height. Without it, ScrollArea does nothing. Add `pr-4` for scrollbar clearance. Consider chunking very long content with headings for scannability. |
| 9 | Key-value pairs (e.g., Kostentrager-Zusammenfassung, Praxisstammdaten) | Label-value pairs, not tabular | 4-15 pairs | 0 | **Custom build:** `<dl>` with `<dt>` (label, `text-muted-foreground`) + `<dd>` (value). Or CSS Grid `grid-cols-[auto_1fr]`. NOT Table. | Table is for rows of comparable items, not label-value pairs. Use consistent label widths via grid. Group related pairs with `Separator` between groups. |
| 10 | Empty state (e.g., no search results, no patients today, no billing items) | None | 0 | 0-1 (primary action) | **Custom build:** Centered container with icon (optional, `text-muted-foreground`), heading, description, and optional `Button` for the primary action. | Never show a blank screen. Always explain why it is empty and what to do next: "Keine Diagnosen erfasst. Diagnose hinzufugen." Use `text-muted-foreground` for description. |

---

## Table C: Input & Selection

**Mapping Rule:** Option count and selection type drive the choice. Low count + visible = RadioGroup/ToggleGroup. High count or searchable = Select/Combobox. Binary = Switch (instant) or Checkbox (deferred). Free text = Input/Textarea.

**Switch vs Checkbox rule:** Switch = instant effect, toggling a mode or live setting. Checkbox = deferred effect, part of a form that is submitted. PVS examples: "Ausnahmetatbestand" = Checkbox (form field saved on submit). "Komfortsignatur aktiv" = Switch (mode toggle, takes effect immediately).

| # | UI Need | Option Count | Selection Type | Searchable | Component | Watch Out |
|---|---------|-------------|----------------|------------|-----------|-----------|
| 1 | Binary on/off (e.g., aut-idem toggle, Fallabschluss, Unfall-Kennzeichen) | 2 | Single | No | **Switch** for live mode toggles. **Checkbox** for form fields. Pair with `Label`. | AP #5: Auto-resolve where possible. If "aut-idem" defaults are derivable from Medikament data, pre-set the toggle. See Switch vs Checkbox rule above. |
| 2 | 2-4 mutually exclusive, all visible (e.g., Diagnosesicherheit V/G/A/Z, Seitenlokalisation R/L/B) | 2-4 | Single, exclusive | No | **RadioGroup** with `RadioGroupItem` per option. Vertical layout for labeled options, horizontal for short codes. | All options must be visible simultaneously. If labels are long, use vertical layout. Always have one option pre-selected where a default makes sense (e.g., Sicherheit "G" as default). |
| 3 | 2-4 mutually exclusive, compact inline (e.g., Einschreibeart Online/Offline, Abrechnungsgebiet) | 2-4 | Single, exclusive | No | **ToggleGroup** `type="single"` with `Toggle` items. | Use when horizontal space is tight and labels are short (1-2 words). ToggleGroup has no "unselected" state by default. Enforce a selection with `value` prop if a choice is required. |
| 4 | 5-20 fixed options, single select (e.g., Satzart 0101-0104, DMP-Kennzeichnung, Versorgungsbereich) | 5-20 | Single | No | **Select** (`SelectTrigger`, `SelectContent`, `SelectItem`). Use `SelectGroup` + `SelectLabel` to sub-group if >10 items. | AP #15: Pre-fill from encounter data where possible. If the patient's Versorgungsbereich is known, pre-select it. Show the selected value clearly in the trigger. |
| 5 | 20+ options or dynamic/searchable list (e.g., ICD-Code-Suche, Kostentrager-Suche, Arztnummer-Lookup) | 20-10,000+ | Single | Yes, required | **Combobox** (composed: `Popover` + `Command` with `CommandInput` + `CommandList` + `CommandItem`). | AP #5: Context should auto-resolve. Pre-fill search with current Fachgruppe or last-used values. Show recent/frequent items at top. Debounce search input (300ms). Display code + Klartext in results. |
| 6 | Multiple selections from a set (e.g., Pool-Filter fur Diagnosen, Fachgruppen-Auswahl, Zertifikats-Typen) | 3-20 | Multiple | No (if <10), Yes (if >10) | **ToggleGroup** `type="multiple"` for <10 items. **Checkbox group** (multiple `Checkbox` + `Label`) for labeled lists. For >10 searchable items, use Combobox with multi-select pattern. | Show selected count: "4 ausgewahlt." Provide "Alle auswahlen" / "Auswahl aufheben" controls for lists >5 items. |
| 7 | Free text, single line (e.g., WOP-Feld, Gen-Symbol, Pseudo-IK-Nummer) | N/A | N/A | N/A | **Input** with `Label`. Add `placeholder` for format hint. Use `type="text"` (default) or `type="number"` for numeric fields. | AP #15: Auto-fill from encounter data. For formatted inputs (e.g., IK-Nummer), add `maxLength` and input masking. Validate on blur, not on every keystroke. |
| 8 | Free text, multi-line (e.g., Begrundungstext, Erlauterungstext, Arztbrief Freitext) | N/A | N/A | N/A | **Textarea** with `Label`. Set `rows` to expected content length (3-6 typical). | Provide character count if there is a max length (common in KBV fields). Use `resize-none` if fixed height is required by form layout. |
| 9 | Date selection (e.g., Behandlungsdatum, Gultigkeitszeitraum, Einlesedatum) | N/A | Single date or range | No | **DatePicker** (composed: `Popover` + `Calendar`). For date ranges, use two DatePickers with "von"/"bis" labels. | AP #5: Default to today's date for treatment dates. Use German locale (`de`) for month/day names. Constrain selectable range where business rules apply (e.g., cannot bill for future dates). |
| 10 | Numeric range (e.g., Therapiesitzungen-Anzahl, Slider fur Priorisierung) | Continuous | Single value | No | **Slider** for visual range selection (rare in PVS). Prefer **Input** `type="number"` with `min`/`max`/`step` for precision-critical values. | Slider is imprecise. In medical/billing contexts, prefer numeric Input. Use Slider only for non-critical preferences or visual filters. Always show the current value as a number alongside the Slider. |

---

## Table D: Overlays & Disclosure

**Key Rule:** NEVER stack modals. If a Dialog needs a sub-decision, use inline content or Popover inside the Dialog. Never Dialog-inside-Dialog. Never AlertDialog-inside-Dialog. One overlay layer maximum.

**Mapping Rule:** Destructive confirmation = AlertDialog. Complex form/decision in overlay = Dialog. Side panel for supplementary content = Sheet. Anchored to trigger = Popover/Tooltip/HoverCard. Progressive disclosure inline = Collapsible/Accordion. Tabbed views = Tabs.

| # | UI Need | Content Size | Context Needed | Trigger | Component | Watch Out |
|---|---------|-------------|----------------|---------|-----------|-----------|
| 1 | Destructive/irreversible confirmation (e.g., "Abrechnung loschen?", "Korrektur annehmen?") | Small (1-3 sentences) | None. Self-contained question. | Button click (destructive action) | **AlertDialog** with `AlertDialogTitle` (question), `AlertDialogDescription` (consequence), `AlertDialogAction` + `AlertDialogCancel`. | AP #8: No modal gauntlets. One confirmation per action. Button labels must be specific verbs: "Loschen" / "Abbrechen", not "OK" / "Cancel." Use `Button variant="destructive"` for the action. |
| 2 | Non-destructive decision or form in overlay (e.g., Satzart-Auswahl, Abrechnungsfall-Erstellung) | Medium (form with 3-8 fields) | Low. Brief task. | Button click or menu item | **Dialog** with `max-w-lg` or `max-w-xl`. `DialogHeader` with `DialogTitle` + `DialogDescription`. Form content in `DialogContent`. | AP #8: Prefer inline forms over Dialog when space permits. Dialog = focused sub-task that returns to parent. Keep Dialogs under 500px height. If content is larger, use Sheet instead. |
| 3 | Supplementary panel alongside main content (e.g., Kostentrager-Suche, Kodierhinweise, Abrechnungsvorschriften) | Large (scrollable list, reference text) | High. User references panel while working on main content. | Button click, typically "Suche" or "Hilfe" | **Sheet** `side="right"` (default width 400-500px). Main content remains visible and interactive beneath. | AP #8: Sheet > Dialog when the user needs to see the main screen simultaneously. Always include a close button. Use `ScrollArea` inside Sheet for long content. Do not auto-open Sheets. |
| 4 | Anchored floating content near trigger (e.g., Kodierhinweis for a specific ICD code, field-level help, Prufhinweis) | Small-medium (1-5 paragraphs or a short list) | High. Related to the specific trigger element. | Click on info icon or help button | **Popover** with `PopoverTrigger` (Button `variant="ghost" size="icon"`) + `PopoverContent`. | Popover closes on outside click. Do not put forms with unsaved state in Popover. For editable content, use Dialog instead. Max width 320px to avoid obscuring main content. |
| 5 | Brief text hint on hover (e.g., field explanation, icon label, abbreviation expansion) | Tiny (1-2 sentences) | Low. Quick reference. | Hover or focus on element | **Tooltip** (requires `TooltipProvider` wrapping the app). `TooltipTrigger` + `TooltipContent`. | Tooltip is hover-only. Not accessible on touch (N/A for PVS desktop, but keep content non-essential). Never put interactive content in Tooltip. If content has links or actions, use Popover. |
| 6 | Rich preview on hover (e.g., Patienten-Schnellansicht, ICD-Code-Detail, Kostentrager-Info) | Medium (card-like preview with multiple fields) | Low-medium. Preview before navigation. | Hover over link or entity name | **HoverCard** with `HoverCardTrigger` + `HoverCardContent`. Include key fields, Badge for status, link to full view. | HoverCard appears on hover with delay. Do not put actions in HoverCard. For actions, use DropdownMenu or navigate to the full entity view. Keep HoverCard under 300px height. |
| 7 | Single collapsible section (e.g., TSS-Felder, Uberweisungsfelder, erweiterte Optionen) | Medium (5-15 form fields or paragraphs) | Medium. Optional detail the user may or may not need. | Click on section header | **Collapsible** with `CollapsibleTrigger` (includes chevron icon) + `CollapsibleContent`. | Use Collapsible for a single toggle section. If there are 3+ peer sections, use Accordion instead. Animate open/close for spatial orientation. Default to collapsed unless the section is frequently needed. |
| 8 | Multiple collapsible sections, only one open at a time (e.g., FAQ, grouped Praxiseinstellungen, Abrechnungshinweise by category) | Medium per section | Medium. User focuses on one section at a time. | Click on section header | **Accordion** `type="single"` with `collapsible` prop. | Set `defaultValue` to the most-used section. Single-open avoids overwhelming the user. Use for reference content where only one topic is relevant at a time. |
| 9 | Multiple collapsible sections, many open simultaneously (e.g., multi-section registration form, DMP-Dokumentation with several Feldgruppen) | Medium-large per section | High. User works across sections. | Click on section headers | **Accordion** `type="multiple"`. | Use for forms where the user fills fields across multiple groups in one session. Consider defaulting critical sections to open. Keep section count under 8 to avoid scroll fatigue. |
| 10 | Tabbed content areas (e.g., ICD-Suche: Suche / Favoriten / Zuletzt verwendet, Patientenakte: Stammdaten / Diagnosen / Leistungen) | Varies per tab | High. User switches between related views. | Click on tab | **Tabs** with `TabsList` + `TabsTrigger` per tab + `TabsContent` per panel. | Set `defaultValue` to the primary tab. Tab count: 2-6 max. If >6, consider nested navigation or DropdownMenu for overflow. Tabs must not scroll horizontally. Keep trigger labels to 1-2 words. |
| 11 | Searchable command palette / action menu (e.g., global action search, quick navigation) | Dynamic list, filtered by query | Low. Standalone search interface. | Keyboard shortcut (Cmd+K) or search icon | **Command** (standalone) for full-page search. **Combobox** (`Popover` + `Command`) for field-level search. Use `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`. | Command is not an overlay by itself. Wrap in Dialog for palette behavior. Group results by category with `CommandGroup` + heading. Show keyboard shortcuts in `CommandItem` if applicable. |
| 12 | Actions menu on a row or item (e.g., patient row actions: Offnen / Bearbeiten / Loschen, Diagnose-Kontextmenu) | Small (3-8 actions) | High. Actions relate to a specific item. | Click on "..." button or right-click | **DropdownMenu** with `DropdownMenuTrigger` (Button `variant="ghost" size="icon"`, ellipsis icon) + `DropdownMenuContent` with `DropdownMenuItem` entries. Use `DropdownMenuSeparator` before destructive actions. | Group related actions with `DropdownMenuSeparator`. Put destructive actions last, styled with `text-destructive`. Keep to one level. Avoid nested `DropdownMenuSub` unless absolutely necessary. |

---

## Composition Pattern: Progressive Disclosure Chains

Some UI needs require **chaining** two overlay levels, not picking just one:

| Level 1 (lightweight) | Level 2 (full) | When to chain |
|---|---|---|
| **Tooltip** (hover hint) | **Popover** (anchored detail) | Code abbreviation → expanded info with actions |
| **Popover** (anchored quick view) | **Sheet** (full reference panel) | Context instruction for one ICD code → full SDVA coding instructions browser |
| **HoverCard** (rich preview) | **Sheet** or navigation | Patient name hover → full patient record |

**Rule:** Level 1 always includes a link/action to open Level 2. The user controls depth. Never auto-escalate.

**PVS-Core example:** Coding Guidance Icon (Tooltip label) → Context Instruction Panel (Popover with SDVA text for one code + "Open full browser" link) → Coding Instructions Browser (Sheet with full SDVA TOC + Content Area).

---

## Quick-Reference: Anti-Pattern Index

The "Watch Out" column references these anti-patterns from the PVS-Core product context:

| Code | Short Name | Core Rule |
|------|-----------|-----------|
| AP-3 | Generic Error Messages | Error messages must be actionable and domain-specific. Include entity + problem + fix step. |
| AP-5 | Schein-Centric Navigation | Context should auto-resolve selections where possible. Pre-fill from patient/encounter data. |
| AP-6 | TI-Error-Wall | TI errors must degrade gracefully. Show inline Alert with recovery path, not blocking Dialog. |
| AP-7 | Undifferentiated Alert Fatigue | Do not make all alerts equal. Tier by severity: Badge (ambient) < Alert (inline) < AlertDialog (blocking). |
| AP-8 | Modal-Dialog Gauntlet | Prefer single composable views with inline interactions. Batch operations over step-by-step modals. |
| AP-11 | eGK-Before-Everything Gate | Do not gate clinical workflow on card read. Allow provisional entry with later reconciliation. |
| AP-14 | Monolithic Patient Record | No monolithic patient record. Visit-focused summary with progressive disclosure. |
| AP-15 | Disconnected Formularverwaltung | Forms auto-fill from encounter data. Only require input for missing/ambiguous fields. |

---

## Notes for AI Agents

1. **"Custom build" entries** mean no single tini-library component solves the need. Compose from available primitives. Always document the composition (e.g., "Card + Badge + Button ghost") in your design spec.
2. **When in doubt between two components,** pick the one with lower interruption level. PVS-Core optimizes for clinical workflow speed.
3. **Severity token scale** (0-10) is a custom design token set mapped to OKLCH colors from green (0) to red (10). Use for any graduated status display. Not a tini-library component. Defined in the theme config.
4. **All text is German.** Button labels, error messages, placeholder text. Use domain-correct terminology from KBV/GKV specifications.
5. **Three UX axes** to balance for every component choice: Speed (minimize clicks/keystrokes), Safety/Clarity (prevent errors, make state obvious), Density (maximize information per viewport on 1920x1080).
