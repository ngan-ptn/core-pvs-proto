# Constraint-to-Component Quick Reference

Quick-reference for designers and AI agents building PVS-Core. Maps every product constraint to specific component decisions using the tini-library design system.

## Constraint Short Codes

| Code | Constraint |
|------|-----------|
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
| UX-Speed | Digital workflow <= analog equivalent. Minimize clicks/keystrokes. |
| UX-Clarity | Read-only vs editable unambiguous at a glance. No accidental modification. |
| UX-Density | Role workspace shows all key actions without scrolling on 24" 1920x1080. |
| P-TrafficLight | Traffic-light logic (red/yellow/green) |
| P-DrillDown | Drill-down: overview to detail |
| P-ExternalData | External vs own data visual separation |
| P-DecisionSupport | Decision support, not automation |
| P-AllStates | All states for every screen (empty, error, loading, populated) |
| P-Checkable | Checkable against requirements |

---

## Table 1: Constraints to Component Rules

| # | Constraint | Affects | Component Rule | tini-library Implementation |
|---|-----------|---------|---------------|----------------------------|
| AP-1 | Auto-Execution Without Confirmation | Overlays | Always require explicit confirmation for state-changing actions. System suggests, user confirms. | AlertDialog for destructive/irreversible. Dialog for non-destructive confirmations. Button triggers only. Never auto-submit forms. |
| AP-2 | Ambiguous Edit States | Status & Feedback | Read-only data gets distinct visual treatment from editable fields. Mode must be obvious at a glance. | Read-only: Card with `bg-muted`, `opacity-75`, lock icon via Badge. Editable: Card with `bg-background`, active Input/Textarea fields with visible borders. |
| AP-3 | Generic Error Messages | Status & Feedback | Every error must name the entity, describe the problem, and provide a fix step. No "Something went wrong." | Alert `destructive` or `warning` with structured content: entity name in bold, problem description, fix action as Button or link. Inline Form field errors via react-hook-form. |
| AP-4 | Certification-Driven UI | Layout | Design around clinical encounters, not KVDT field codes. Labels use medical language, not certification jargon. | Tabs and Card layouts organized by encounter workflow (Anamnese, Diagnose, Therapie). Internal KVDT mapping hidden. Form field labels are clinical terms. |
| AP-5 | Schein-Centric Navigation | Layout | Patient-centric navigation. Schein resolved automatically from encounter context, never manually selected by user. | Breadcrumb: Patient > Encounter > Section. Select/Combobox for patient search, not Schein lookup. Auto-resolve Scheinart from Fachgruppe + Kassenart. |
| AP-6 | TI-Error-Wall | Status & Feedback | TI failures degrade gracefully. Plain-language recovery steps. Never block entire workflow for connector issues. | Alert `warning` (not `destructive`) for TI unavailability. Include plain-language recovery in Alert body. Fallback workflows enabled. Badge `warning` on affected features. |
| AP-7 | Undifferentiated Alert Fatigue | Status & Feedback | Severity-tiered, role-tailored alerts. Hard-stop (AlertDialog) only for critical/irreversible. Everything else inline or dismissible. | Badge variants map to severity: `destructive` (critical), `warning` (action needed), `info` (informational), `success` (resolved). AlertDialog only for severity 8-10. Alert inline for 4-7. Badge/Tooltip for 1-3. |
| AP-8 | Modal-Dialog Gauntlet | Overlays & Disclosure | Never stack modals. Prefer single composable views with smart defaults. Batch operations over repeated confirmations. | Sheet (side panel) for large content instead of Dialog. Popover for small inline interactions. Dialog for single focused tasks only. Never open Dialog from Dialog. Batch actions via DataTable row selection + single confirmation. |
| AP-9 | Context-Blind Quartalsabrechnung | Input & Selection | Continuous inline validation during data entry. Never defer all errors to end-of-quarter. | Form with react-hook-form + zod: validate on blur/change. Alert `warning` inline below fields. Badge on Tabs showing error count per section. Progress bar for quarterly completeness. |
| AP-10 | One-Size-Fits-All MVZ Interface | Layout | Specialty-adaptive workspaces. Show relevant tools per Fachgruppe. Hide irrelevant sections. | Tabs with specialty-conditional panels. Accordion to collapse non-primary sections. Card layout adapts to role. ToggleGroup for specialty switching in MVZ context. |
| AP-11 | eGK-Before-Everything Gate | Layout | Decouple clinical workflow from insurance verification. Allow provisional encounters without eGK. | Badge `warning` "Versichertendaten ausstehend" on patient Card. Full encounter workflow available. Alert `info` prompts eGK read when convenient. Never gate Input fields on insurance status. |
| AP-12 | Copy-Paste Documentation | Input & Selection | Structured templates with changed/unchanged markers. No free-text copy-paste of previous visit notes. | Form with pre-filled Textarea from templates. Badge `secondary` for "unchanged" sections. Badge `default` for "updated" sections. Checkbox to confirm reviewed-unchanged items. Collapsible for unchanged detail. |
| AP-13 | Hidden Workflow State | Data Display | Explicit patient flow board with real-time status. Every patient's current state visible. | DataTable as flow board. Badge variants show state: `default` (waiting), `info` (in progress), `success` (complete), `warning` (needs attention). Card per patient in Kanban alternative. Real-time updates via Skeleton during refresh. |
| AP-14 | Monolithic Patient Record | Data Display | Visit-focused summary with progressive disclosure. Show current visit prominently, history on demand. | Card for current visit summary. Accordion for historical visits. Tabs: "Aktuell" / "Verlauf" / "Stammdaten". HoverCard for quick history preview without navigation. DataTable for visit list with drill-down. |
| AP-15 | Disconnected Formularverwaltung | Input & Selection | Context-aware forms auto-filled from encounter data. Forms pull patient, diagnosis, and encounter context automatically. | Form fields pre-filled via react-hook-form `defaultValues` from encounter context. Combobox with server-search for ICD/EBM/medication. Select pre-narrowed to relevant options. Read-only Input for auto-filled fields with `bg-muted`. |
| UX-Speed | Speed Axis | All | Every interaction must be completable in fewer clicks/keystrokes than the analog equivalent. Smart defaults, keyboard shortcuts, type-ahead. | Combobox for all search fields (type-ahead). Command palette for power users. Form smart defaults reduce required fields. Button placement follows Fitts's law (primary action prominent). Keyboard navigation on all interactive components. |
| UX-Clarity | Clarity Axis | All | Read-only vs editable unambiguous at a glance. No accidental modification possible. State always visible. | Read-only: `bg-muted`, `opacity-75`, lock icon, no hover effects. Editable: `bg-background`, visible Input borders, focus rings. Switch/Checkbox disabled state visually distinct. Badge for status. Alert for state explanation. |
| UX-Density | Density Axis | Layout | Role workspace shows all key actions without scrolling on 24" 1920x1080. Secondary info one click away. | Card grid for primary actions. Tabs for secondary content. Accordion/Collapsible for tertiary. DataTable with compact rows. Badge inline (not stacked). ToggleGroup over RadioGroup when space-constrained. HoverCard for preview without navigation. |
| P-TrafficLight | Traffic-Light Logic | Status & Feedback | Use red/yellow/green consistently for severity encoding. Never use color alone (pair with icon/text). | Badge: `destructive` (red), `warning` (yellow), `success` (green). Alert: same mapping. Design token severity scale 0-10 maps to green (0-3), yellow (4-6), red (7-10). Always pair color with icon. |
| P-DrillDown | Overview to Detail | Data Display | Every data display starts with summary, details available on interaction. Never show all detail upfront. | DataTable (overview) > Card or Sheet (detail). Accordion for section expansion. HoverCard for quick peek. Breadcrumb tracks drill-down path. Collapsible for inline expansion. |
| P-ExternalData | External vs Own Data | Data Display | Visually separate external data (Kasse, KBV, TI) from practice-entered data. Users must know data origin. | External: Card with `external` stripe token, `bg-muted` background, Badge `outline` "Extern". Own data: Card with `bg-background`, standard styling. Table columns grouped by source with Separator. |
| P-DecisionSupport | Decision Support Not Automation | Input & Selection | System recommends, user decides. Suggestions clearly labeled. Never pre-select critical choices. | Alert `info` for recommendations with "Vorschlag" label. RadioGroup/Select shows suggestion highlighted but not pre-selected for clinical decisions. Badge `info` "Empfehlung" on suggested options. Button for user to accept/reject. |
| P-AllStates | All States for Every Screen | All | Every surface must handle empty, loading, error, and populated states. No blank screens. | Skeleton for loading (match content shape). Alert `info` + illustration for empty state with call-to-action Button. Alert `destructive` for error state with retry Button. Populated state is default design. |
| P-Checkable | Checkable Against Requirements | All | Every UI decision must trace back to a specific requirement. Component usage must be justifiable. | Not a component rule. Design review checklist: every component on screen must reference at least one constraint code from this table. Document in design specs. |

---

## Table 2: Component to Applicable Constraints

| Component | Constraints to Check | Key Rule |
|-----------|---------------------|----------|
| Badge | AP-7, AP-9, AP-11, AP-12, AP-13, UX-Density, P-TrafficLight | Use variant to encode severity. Never for actionable errors (use Alert instead). Pair color with context text. |
| Alert | AP-3, AP-6, AP-7, AP-9, P-TrafficLight, P-AllStates, P-DecisionSupport | Must include fix step for errors. Tier by severity variant. Use for inline validation and recommendations, not transient notifications. |
| Button | AP-1, UX-Speed | Primary action prominent. Destructive actions use `destructive` variant. Never triggers auto-execution. Keyboard accessible. |
| Dialog | AP-1, AP-8, UX-Speed | Require explicit confirmation for state changes. Never stack. Never use for multi-step flows. Single focused task only. |
| AlertDialog | AP-1, AP-7 | Hard-stop only for critical/irreversible actions (severity 8-10). Destructive variant. Clear consequence description. |
| Sheet | AP-8, AP-14, UX-Density | Alternative to Dialog for large content. Preserves main view context. Side panel for detail views. Never stack. |
| Popover | AP-8, UX-Density | Anchored floating content for small interactions. Alternative to Dialog for non-blocking actions. Dismiss on outside click. |
| Tooltip | UX-Clarity, P-TrafficLight | Brief hints only (under 10 words). Never interactive content. Never critical information. Supplement, don't replace labels. |
| HoverCard | AP-14, UX-Density, P-DrillDown | Rich previews of linked entities (patient, diagnosis, medication). Reduces navigation. Not for actions. |
| Tabs | AP-10, AP-14, UX-Density | Organize related content by workflow phase or category. Specialty-adaptive panels in MVZ. Badge on tab for error/notification count. |
| Accordion | AP-14, UX-Density, P-DrillDown | Progressive disclosure for optional/historical sections. Collapse by default for secondary content. |
| Collapsible | AP-14, UX-Density, P-DrillDown | Inline expand/collapse for single sections. Lighter than Accordion for isolated use. |
| Select | AP-5, AP-15, UX-Speed | Pre-fill from context. Auto-resolve where unambiguous. Fixed option lists only (under 20 items). Use Combobox for 20+. |
| Combobox | AP-5, AP-15, UX-Speed | Server-side search for master data (ICD, EBM, medication). Type-ahead mandatory. Uses Command internally. |
| RadioGroup | AP-7, UX-Density, UX-Clarity, P-DecisionSupport | All options visible simultaneously. Use for 2-5 critical choices. Don't pre-select clinical decisions. |
| ToggleGroup | UX-Density, UX-Speed | Compact alternative to RadioGroup. Short labels only. Use for mode switching, not clinical decisions. |
| Switch | AP-1, UX-Clarity | Instant effect (no form submission needed). Clear on/off visual. Label must describe the "on" state. Not for form fields. |
| Checkbox | AP-12, AP-15 | Deferred effect (requires form submission). Group for multi-select. Use for review confirmation ("unchanged" markers). |
| Input | AP-2, AP-15, UX-Clarity | Pre-fill from encounter context. Clear read-only state (`bg-muted`, no border). Editable state has visible border and focus ring. |
| Textarea | AP-2, AP-12, AP-15, UX-Clarity | Same read-only rules as Input. Use structured templates, not free-text copy-paste. Auto-resize preferred. |
| Table / DataTable | AP-13, AP-14, UX-Density, P-DrillDown | Compact rows for overview. Row click for drill-down. Badge in cells for status. Batch selection for AP-8 compliance. DropdownMenu for row actions. |
| Card | AP-2, AP-11, AP-14, P-ExternalData | Entity display container. `bg-muted` + stripe for external data. `bg-background` for own data. Progressive disclosure via Accordion/Collapsible inside. |
| ScrollArea | UX-Density | Contained scrolling within layout sections. Never for primary workspace (violates density axis). Use for overflow in Sheet/Dialog. |
| Command | UX-Speed | Fast search/action palette. Keyboard-first. Used inside Combobox for master data search. Power user access via keyboard shortcut. |
| DropdownMenu | AP-8, UX-Density | Row actions in DataTable. Context menus. Keep items under 7. Destructive items at bottom with `destructive` styling. |
| Breadcrumb | AP-5, P-DrillDown | Patient-centric path: Patient > Encounter > Section. Last item is non-interactive BreadcrumbPage. Never Schein-centric. |
| Pagination | UX-Density, P-DrillDown | Use for long lists (visits, search results). Prefer infinite scroll with ScrollArea for short lists. Show total count. |
| DatePicker / Calendar | AP-9, UX-Speed | Pre-fill with today or encounter date. Quartals-aware highlighting. Keyboard entry as alternative to picker. |
| Form (react-hook-form) | AP-9, AP-15, P-AllStates | Inline validation on blur/change via zod schemas. Auto-fill `defaultValues` from encounter context. Never defer all validation to submit. |
| Skeleton | P-AllStates | Every surface needs a loading state. Match content shape (table rows, card layouts). Never show empty screen during load. |
| Progress | AP-9, P-AllStates | Multi-step wizard progress (PTV Import, Quartalsabrechnung). Show step count and current position. |
| Separator | P-ExternalData, UX-Density | Visual grouping boundary. Use between external and own data sections. Use in DataTable between source groups. |
| Avatar | UX-Density | User/provider identification in compact spaces. Use in multi-provider MVZ context. Pair with Tooltip for full name. |
