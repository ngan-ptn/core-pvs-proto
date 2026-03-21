# Patient Record View (S002) Component-to-Library Mapping

**Surface:** S002 Patient Record View
**Complexity:** 278.5 (62 states, 63 components, 8 extensions)
**Phases:** 1.1 (base), 1.5 (Record Type/TSS/Referrals), 1.8 (HZV/FAV), 2A.1-2A.6 (ICD Coding)
**Primary Role:** Doctor
**Design Tier:** 1 (Foundation Shell)

**Purpose:** Maps all 63 Patient Record View components to tini-library primitives. Each row specifies the exact component(s), variant/config, whether custom composition is needed, and how to build it.

**Categories:**
- **A** = Status & Feedback (Badge, Alert, Toast, progress indicators)
- **B** = Data Display (Card, Table, text, lists, read-only content)
- **C** = Input & Selection (Input, Select, Combobox, RadioGroup, Checkbox, etc.)
- **D** = Overlays & Disclosure (Dialog, Sheet, Popover, Collapsible, Tabs, etc.)
- **Layout** = Structural/container (not a selection decision)

---

## Phase 1.1: Base Patient Record (Components 1-5)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 1 | VSDM Status Badge | A | Badge | `variant="success"` (verified) or `variant="warning"` (stale). Icon prefix (shield-check / shield-alert). | No | Display FK 4136 value + timestamp as text beside Badge. Use `text-muted-foreground` for timestamp. |
| 2 | Coverage Status Indicator | A | Badge | `variant="success"` (active), `variant="destructive"` (expired), `variant="warning"` (not yet started). | Yes | Compose: Badge + `<span>` for date range. Flex row: Badge on left, "01.01.2026 - 31.12.2026" on right in `text-muted-foreground`. |
| 3 | WOP Field | C | Input + Label | `<Input>` with `maxLength` for WOP code. Paired with `<Label>`. | No | Wrap in Form > FormField > FormItem > FormLabel > FormControl > Input > FormMessage. Read-only by default (`bg-muted`, `readOnly`), editable on fallback trigger. |
| 4 | Care Context Label | B | Badge | `variant="outline"` | No | Static label. "Ambulant" or "Stationaer". Outline variant signals metadata, not status. |
| 5 | Read-In Date (FK 4109) | B | Label + text | Plain text with `<Label>` | No | Label in `text-muted-foreground`, value in `text-foreground`. Not a Badge (this is data, not status). Not editable. |

---

## Phase 1.5: Record Type / TSS / Referrals (Components 6-12)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 6 | Record Type Selector | C | Select | `<SelectTrigger>` + `<SelectContent>` with `<SelectItem>` per Satzart (0101-0104). Use `<SelectGroup>` + `<SelectLabel>` if grouping Scheinuntergruppen. | No | 4-8 fixed options. Select is correct (not Combobox). Pre-fill from encounter context per AP-15. |
| 7 | TSS Section | D | Collapsible | `<Collapsible>` with `<CollapsibleTrigger>` (Button `variant="ghost"` with chevron icon) + `<CollapsibleContent>`. | Yes | Content contains multiple Form fields: Input (Vermittlungscode), DatePicker (appointment date), Select (referral source), Badge (surcharge category read-only), Checkbox (case completion). Default collapsed. Expand when FK 4103 is set. |
| 8 | Referral Section | D | Collapsible | Same Collapsible pattern as TSS Section. | Yes | Content varies by Muster type. Contains: Combobox (referring physician LANR lookup), Input (diagnosis), Select (referral type), Select (urgency), Select (specialty). Collapse when no Muster 6/10/39. |
| 9 | Surcharge Calculator | B | Badge | `variant="secondary"` | No | Read-only display of calculated category (A/B/C/D). Secondary variant signals computed metadata. Place inside TSS Section's CollapsibleContent. |
| 10 | Case Completion Toggle | C | Checkbox + Label | `<Checkbox>` paired with `<Label>`. | No | Deferred effect (saved on form submit), so Checkbox not Switch. Wrap in Form > FormField > FormItem > FormControl > Checkbox > FormLabel. |
| 11 | Record Split Indicator | A | Badge + Button | `variant="warning"` Badge + Button `variant="link"` | Yes | Compose: flex row with Badge `variant="warning"` ("Gesplitteter Schein") + Button `variant="link"` `size="sm"` linking to sibling record. |
| 12 | Name/Address Deviation Fields | C | Input + Label (x2 columns) | Two-column layout: card data (read-only) vs deviation fields (editable). | Yes | Compose: CSS Grid `grid-cols-2`. Left column: Label + `<span>` (card data, `text-muted-foreground`, `bg-muted`). Right column: Form > FormField > Input (editable). Separator between the two columns. Matches disambiguation guide section 6 "two-column comparison" pattern. |

---

## Phase 1.8: HZV/FAV Participation (Components 13-18)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 13 | Eligible Contracts Display | B | Card | `<Card>` with `<CardHeader>` + `<CardContent>`. | Yes | Compose: Card shell containing a list of contract items. Each item: flex row with contract name (`text-foreground`) + Badge (eligibility status). Use `external` stripe token + `bg-muted` per P-ExternalData since contract data is external. |
| 14 | Participation Status Badge | A | Badge | `variant="info"` (Requested), `variant="success"` (Active), `variant="secondary"` (Ended), `variant="warning"` (Reversed), `variant="destructive"` (Cancelled). | No | Single Badge per participation row. Color encodes lifecycle state. |
| 15 | Lifecycle Action Buttons | C | Button (group) | Multiple `<Button>` instances. `variant="default"` for Activate. `variant="outline"` for End/Reverse. `variant="destructive"` for Cancel. `size="sm"`. | Yes | Compose: flex row of Buttons. Conditionally render based on current participation status. Only show valid transitions. Wrap destructive actions with AlertDialog confirmation per AP-1. |
| 16 | FAV Status Check | A | Badge | `variant="success"` (enrolled) or `variant="outline"` (not enrolled). Icon prefix. | No | Quick-glance indicator. Not interactive. Tooltip on hover for last-check timestamp. |
| 17 | Specialist Search Link | B | Button | `variant="link"` `size="sm"`. External link icon suffix. | No | `<a href="https://medi-arztsuche.de" target="_blank">` styled as Button `variant="link"`. Position near referral creation. |
| 18 | Therapy Facilities Link | B | Button | `variant="link"` `size="sm"`. External link icon suffix. | No | Same pattern as #17. Links to AOK therapy facility info. |

---

## Phase 2A.1: ICD Coding - Entry (Components 19-25)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 19 | Timeline Entry Textbox | C | Input | `<Input>` with `placeholder="ICD-Code oder Suchbegriff..."`. | No | Wrap in Form > FormField. On input change (debounced 300ms), trigger ICD search. Keyboard shortcut support for power users. |
| 20 | ICD Search Results | D | Combobox (Popover + Command) | `<Popover>` + `<Command>` with `<CommandInput>` (hidden, driven by #19), `<CommandList>`, `<CommandGroup>`, `<CommandItem>`. | Yes | Compose: Popover anchored to #19. CommandList renders matching codes. Each CommandItem: code in `font-mono` + Klartext. CommandEmpty for no results. Debounce + async loading from SDICD. Display code + plain-text description per AP-11. |
| 21 | Diagnosensicherheit Selector | C | RadioGroup | `<RadioGroup>` with 4x `<RadioGroupItem>`: V, G, A, Z. Horizontal layout for short codes. | No | No default value (required, physician must choose). Labels: "V (Verdacht)", "G (Gesichert)", "A (Ausschluss)", "Z (Zustand nach)". Wrap in FormField. |
| 22 | Seitenlokalisation Selector | C | ToggleGroup | `<ToggleGroup type="single">` with 3x `<Toggle>`: R, L, B. | No | Compact single-letter labels. Horizontal. Only rendered when the selected ICD code has laterality requirement. ToggleGroup over RadioGroup per UX-Density (space-constrained). |
| 23 | Erlaeuterungstext Field | C | Textarea + Label | `<Textarea rows={3}>` with `<Label>`. | No | Wrap in Form > FormField > FormItem > FormLabel > FormControl > Textarea > FormMessage. Character count display if KBV max length applies. |
| 24 | Ausnahmetatbestand Toggle | C | Checkbox + Label | `<Checkbox>` paired with `<Label>`. | No | Deferred effect (form field, saved on submit). Checkbox not Switch. Wrap in FormField. |
| 25 | Diagnosis Timeline Entry | B | Card | `<Card>` with flex layout inside `<CardContent>`. | Yes | Compose: Card shell. Content: ICD code (`font-mono font-semibold`), Klartext text, Badge for Diagnosensicherheit (V=`variant="warning"`, G=`variant="success"`, A=`variant="destructive"`, Z=`variant="info"`), Badge for laterality if present (`variant="outline"`), `text-muted-foreground` for Erlaeuterungstext. Labeled "Akutdiagnose" via small Label or Badge `variant="secondary"`. |

---

## Phase 2A.2: ICD Coding - Chronic/Historical (Components 26-31)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 26 | Dauerdiagnosen Sidebar Section | B | ScrollArea + custom list | `<ScrollArea>` wrapping a list of diagnosis items. | Yes | Compose: Section heading ("Dauerdiagnosen") + ScrollArea with `h-[value]`. Each item: flex row with ICD code (`font-mono`), Klartext (truncated with Tooltip), Diagnosensicherheit Badge, Button `variant="ghost" size="sm"` ("Ubernehmen"). Use `hover:bg-accent` on rows. Distinct background or left-border color to differentiate from Anamnestische. |
| 27 | Anamnestische Diagnosen Sidebar Section | B | ScrollArea + custom list | Same ScrollArea + list pattern as #26. | Yes | Identical structure to #26 with different section heading ("Anamnestische Diagnosen") and distinct visual styling (e.g., different left-border color or `bg-muted` background). |
| 28 | Adoption Panel | D | Popover or inline Card | `<Card>` with form fields inside, or `<Popover>` anchored to the "Ubernehmen" button. | Yes | Compose: Card or PopoverContent containing: RadioGroup (#21 pattern, pre-filled Diagnosensicherheit), ToggleGroup (#22 pattern, Seitenlokalisation), Textarea (#23 pattern, Erlaeuterungstext), Checkbox (#24 pattern, Ausnahmetatbestand). Footer: Button `variant="default"` ("Ubernahme bestaetigen") + Button `variant="ghost"` ("Abbrechen"). Use Popover if keeping sidebar visible, Card if inline. |
| 29 | Digit Completion Prompt | D | Popover + Command | `<Popover>` + `<Command>` with `<CommandList>` of sub-codes. | Yes | Compose: Popover anchored to the code entry. CommandList shows available 4th/5th digit codes. Each CommandItem: sub-code + description. Badge `variant="outline"` on mandatory completions ("Pflicht"), Badge `variant="secondary"` on optional ("Optional"). |
| 30 | Quarter Adoption Indicator | A | Badge | `variant="default"` with check icon. `size` small. | No | Placed on sidebar list items (#26, #27) that were already adopted this quarter. Prevents double-adoption confusion. Icon-only Badge or icon + "Q1/26" text. |
| 31 | Pool Filter | C | ToggleGroup | `<ToggleGroup type="multiple">` for specialty/frequency filter chips. | Yes | Compose: ToggleGroup with Toggle items for filter categories (specialty names, frequency ranges). Placed above the sidebar lists (#26, #27). If >10 filter options, use Combobox multi-select pattern instead. Show selected count. |

---

## Phase 2A.3: ICD Coding - Validation (Components 32-38)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 32 | Validation Message (Error) | A | Alert | `variant="destructive"` with `<AlertTitle>` + `<AlertDescription>`. | No | Inline, near the offending entry. Blocks save. Must include entity + problem + fix step per AP-3. Example: "ICD J06.9: Code existiert nicht in SDICD 2026-Q1. Bitte korrekten Code waehlen." |
| 33 | Validation Message (Warning) | A | Alert | `variant="warning"` with `<AlertTitle>` + `<AlertDescription>` + dismiss Button `variant="ghost" size="icon"`. | Yes | Compose: Alert with optional action area. "Dismiss" or "Proceed anyway" via Button `variant="ghost"` inside the Alert. Non-blocking. Visually distinct from #32 (amber, not red). |
| 34 | Validation Message (Info Hint) | A | Alert | `variant="info"` with `<AlertTitle>` + `<AlertDescription>` + dismiss action. | No | Low-prominence. For rare disease flags and IfSG alerts. Dismissible via ghost icon button. Less visually dominant than warning. |
| 35 | Search Results Dropdown (extended) | D | Tabs + Combobox | `<Tabs>` inside Popover. `<TabsList>` with `<TabsTrigger>` for "Suche" and "Favoriten". `<TabsContent>` wrapping Command lists. | Yes | Compose: Extends #20. Popover contains Tabs. "Suche" tab: Command with search results. "Favoriten" tab: Command with bookmarked codes. Greyed-out non-billable rows (#37) rendered with `opacity-50 pointer-events-none`. Free-text search across code titles, Inklusiva, Exklusiva. |
| 36 | Favorites Tab | D | Tabs (TabsContent) + Command | `<TabsContent value="favoriten">` wrapping `<CommandList>`. | Yes | Part of #35 composition. Each CommandItem includes a star/bookmark Toggle icon for add/remove. Toggle `variant="outline"` (not favorited) or `variant="default"` (favorited). |
| 37 | Non-Billable Code Row | B | CommandItem (disabled) | `<CommandItem disabled>` with `opacity-50`. | Yes | Compose: CommandItem with `disabled` prop. Content: code + title in `text-muted-foreground` + small explanatory Label ("Kapitelueberschrift", "Gruppenlabel", "Kein Inhalt"). `pointer-events-none` and `cursor-default`. |
| 38 | Kreuz-Stern Pairing Indicator | A | Badge | `variant="outline"` with pairing icon (* or !). | Yes | Compose: Badge `variant="outline"` placed inline within search result CommandItem or Diagnosis Timeline Entry Card. Small icon + label ("Sekundaercode, erfordert Primaercode"). Tooltip with full pairing explanation on hover. |

---

## Phase 2A.4: Coding Instructions (Components 39-45)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 39 | SDICD Version Indicator | A | Badge | `variant="secondary"` | No | Metadata label. "SDICD 2026-Q1". Secondary variant per selection matrix Table A row 2. Admin visibility only. |
| 40 | Coding Guidance Icon | D | Tooltip + Button | Button `variant="ghost" size="icon"` (info-circle icon) + `<Tooltip>` on hover. | No | On click, opens #41 Context Instruction Panel (Popover). Tooltip shows "Kodierhinweis anzeigen" on hover. Present wherever an ICD code is displayed. |
| 41 | Context Instruction Panel | D | Popover | `<Popover>` with `<PopoverTrigger>` (the #40 icon) + `<PopoverContent>` with `max-w-[320px]`. | Yes | Compose: PopoverContent with: heading (code + "Kodierhinweis"), ScrollArea for instruction text (read-only), Button `variant="link"` ("Vollstaendige Anleitung oeffnen") linking to Sheet (#42/#43). |
| 42 | Table of Contents | D | Accordion | `<Accordion type="single" collapsible>` with `<AccordionItem>` per chapter. | Yes | Compose: Accordion inside Sheet (left pane or sidebar). Each AccordionTrigger: chapter title. Chapters with changes get Badge `variant="info"` ("Geaendert") beside the trigger text. Click navigates Content Area (#43) to that section. |
| 43 | Content Area | B | ScrollArea | `<ScrollArea>` with explicit `h-[calc(100vh-...)]`. | Yes | Compose: ScrollArea containing SDVA full text as rendered HTML. Search-within-document via Command palette pattern (Input at top + highlight matches). Change sections use `bg-info/10` background highlight. Pair with #42 TOC in a Sheet `side="right"`. |
| 44 | Change Markers | A | Badge | `variant="info"` ("Geaendert") or background highlight `bg-info/10`. | Yes | Compose: Two forms. (1) Badge `variant="info"` on TOC AccordionTrigger items (#42). (2) CSS class `bg-info/10` on changed paragraphs within Content Area (#43). Both indicate current-year SDVA changes. |
| 45 | SDVA Version Indicator | A | Badge | `variant="secondary"` | No | Same pattern as #39. "SDVA 2026". Metadata label. |

---

## Phase 2A.5: Rule Violations (Components 46-54)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 46 | Violation Count Badge | A | Badge | `variant="destructive"` with count number. | No | Nav-item count badge pattern. Short text: number only ("3"). Clicking navigates to violation overview. Per selection matrix Table A row 9. |
| 47 | Violation Row | B | Card (list item) | `<Card>` per violation in a vertical list. | Yes | Compose: Card with CardContent as flex row: ICD code (`font-mono`) + rule hint text + Correction Type Badge (#48) + Button group (Accept: `variant="default" size="sm"`, Reject: `variant="ghost" size="sm"`). Collapsible for full rule text: Collapsible > CollapsibleTrigger ("Details") > CollapsibleContent (full text). |
| 48 | Correction Type Badge | A | Badge | DELETE: `variant="destructive"`. REPLACE: `variant="warning"`. ADD: `variant="info"`. | No | Color-coded label inside #47 Violation Row. Short text: "LOESCHEN", "ERSETZEN", "HINZUFUEGEN". |
| 49 | Confirmation Dialog | D | AlertDialog | `<AlertDialog>` with `<AlertDialogTitle>` (action description), `<AlertDialogDescription>` (consequence), `<AlertDialogAction>` + `<AlertDialogCancel>`. | No | Triggered by Accept button in #47. Title: "Diagnose E11.9 loeschen?" or "E11.9 durch E11.65 ersetzen?". Action button uses `variant="destructive"` for DELETE, `variant="default"` for REPLACE/ADD. One dialog per action, never chained (AP-8). |
| 50 | Abort Button | C | Button | `variant="outline" size="default"`. | No | Clear label: "Regelverarbeitung abbrechen". Outline variant (not destructive) because it preserves accepted corrections. Positioned prominently in violation overview header. |
| 51 | Inline Violation Indicator | A | Badge (icon-only) | Warning icon. `variant="warning"` or custom icon element. `size` small. | Yes | Compose: Small warning-triangle icon (16px) positioned on Diagnosis Timeline Entry Card (#25). Use `text-warning` color token. Wrap in Button `variant="ghost" size="icon"` for click-to-navigate behavior. Tooltip: "Regelverstoesse vorhanden". |
| 52 | Execution Timing Selector | C | Select | `<Select>` with 3 `<SelectItem>`: "Bei Diagnoseerfassung", "Bei Fallabschluss", "Nur auf Anforderung". | No | Settings-level control, not per-diagnosis. Place in a settings area or Collapsible section. Pre-select practice default. |
| 53 | Rule Change Summary | B | Table | Primitive `<Table>`: `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>`. | Yes | Compose: Static Table (not DataTable, few rows). Columns: Rule ID, Change Type (Badge: "Neu" `variant="info"`, "Geaendert" `variant="warning"`, "Entfernt" `variant="destructive"`), Description. Read-only, shown after SDKRW update. |
| 54 | SDKRW Version Indicator | A | Badge | `variant="secondary"` | No | Same pattern as #39, #45. "SDKRW 2026-Q1". Metadata label. |

---

## Phase 2A.6: HZV/FAV Diagnosis Rules (Components 55-63)

| # | Inventory Component | Category | tini-library Component(s) | Variant/Config | Custom? | Composition Notes |
|---|---|---|---|---|---|---|
| 55 | Carry-Forward Review Panel | B | Card + Table | `<Card>` wrapping a primitive `<Table>`. | Yes | Compose: Card with CardHeader ("Dauerdiagnosen-Uebernahme Q1/2026") + CardContent containing Table. Columns: ICD code, Klartext, Diagnosensicherheit Badge, Actions (Button `variant="default" size="sm"` "Bestaetigen" + Button `variant="ghost" size="sm"` "Entfernen"). One row per carried diagnosis. |
| 56 | Terminal Code Selector | D | Popover + Command | `<Popover>` + `<Command>` with `<CommandList>` of sub-codes. | Yes | Same composition pattern as #29 (Digit Completion Prompt). Anchored to the non-terminal code entry. CommandItems show available terminal sub-codes with descriptions. Guides selection of most specific code. |
| 57 | Acute-as-Permanent Warning Banner | A | Alert | `variant="warning"`, full-width. `<AlertTitle>` + `<AlertDescription>` + dismiss Button `variant="ghost" size="icon"`. | No | Page-level banner pattern. Placed above Dauerdiagnosen list. "Akutdiagnose als Dauerdiagnose: [code] ist typischerweise nicht chronisch." Dismissible but logged per contract rules. One banner max per page (AP-7). |
| 58 | Repeated Suspected Warning Banner | A | Alert | `variant="warning"`, full-width. Same structure as #57. | No | "Verdachtsdiagnose [code] wurde bereits im Vorquartal als Verdacht dokumentiert. Bestaetigung oder Ausschluss empfohlen." Dismissible. Suggests G or A re-classification. |
| 59 | Disease Pattern Check Button | C | Button | `variant="outline" size="default"`. | No | Label: "Pruefung auf Multimorbiditaet nach P4". Single action button. Triggers async check. Show loading state via `loading` prop during execution. |
| 60 | Disease Pattern Result Panel | B | Card | `<Card>` with `<CardHeader>` + `<CardContent>`. | Yes | Compose: Card with CardHeader (patient name + DOB). CardContent: list of matched disease pattern groups as clear-text names, semicolon-separated or as a vertical list of Badge `variant="outline"` items. Empty state: "Keine Krankheitsbilder gefunden" with `text-muted-foreground`. |
| 61 | Patient Row (Surcharge List) | B | DataTable | `<DataTable>` with ColumnDefs for: first name, last name, patient number, DOB, disease patterns. | Yes | Compose: DataTable (@tanstack/react-table). ColumnDef for disease patterns uses cell renderer with semicolon-separated text + line breaks. Two highlight styles via row `className`: `bg-info/10` (1 P4 service), `bg-warning/10` (2 P4 services). Patient name column: Button `variant="link"` linking to patient record. |
| 62 | Surcharge List Legend | B | Alert | `variant="info"` with `<AlertDescription>`. | Yes | Compose: Alert `variant="info"` positioned above or below DataTable (#61). Content: two color swatches (inline `<span>` with `bg-info/10` and `bg-warning/10`) + explanation text. Lightweight info box, not a Badge. |
| 63 | Surcharge List Disclaimer | B | Alert | `variant="info"` with `<AlertDescription>`. | No | Mandatory closing text. "Diese Liste umfasst nur nicht abgerechnete Leistungen. Keine Garantie der tatsaechlichen Verguetung." Low-prominence info alert below #61 DataTable. |

---

## Summary

### Direct Mappings vs Custom Builds

| Metric | Count |
|---|---|
| **Direct mappings** (single tini-library component, no composition needed) | 30 |
| **Custom builds** (composed from multiple primitives) | 33 |
| **Total components** | 63 |

### Category Distribution

| Category | Count | Description |
|---|---|---|
| A (Status & Feedback) | 20 | Badges, Alerts, validation messages, indicators |
| B (Data Display) | 18 | Cards, Tables, ScrollArea, read-only content, lists |
| C (Input & Selection) | 13 | Input, Textarea, Select, RadioGroup, ToggleGroup, Checkbox, Button |
| D (Overlays & Disclosure) | 12 | Popover, Collapsible, Tabs, Command, AlertDialog, Accordion |

### Most-Used tini-library Components

| Component | Usage Count | Typical Role on This Surface |
|---|---|---|
| **Badge** | 22 | Status indicators, version labels, correction types, pairing markers, adoption markers |
| **Button** | 13 | Actions (lifecycle, abort, links, dismiss, check triggers), ghost icons |
| **Alert** | 8 | Validation errors, warnings, info hints, banners, legend/disclaimer |
| **Card** | 8 | Diagnosis entries, violation rows, result panels, contracts display, review panels |
| **Popover** | 5 | Search results, digit completion, context instructions, adoption panel |
| **Command** | 5 | ICD search, sub-code selection, terminal code selection (inside Popover = Combobox) |
| **ScrollArea** | 4 | Sidebar diagnosis lists, SDVA content area, long reference text |
| **Collapsible** | 3 | TSS section, referral section, violation detail expansion |
| **Input** | 3 | WOP field, timeline entry textbox, name/address deviation |
| **Label** | 3 | Read-only data display, field labels |
| **Select** | 3 | Record type, execution timing, referral sub-fields |
| **Table** | 3 | Rule change summary, carry-forward review, static tabular data |
| **Checkbox** | 2 | Case completion, Ausnahmetatbestand |
| **RadioGroup** | 2 | Diagnosensicherheit (entry and adoption panel) |
| **ToggleGroup** | 3 | Seitenlokalisation, pool filter, favorites toggle |
| **Textarea** | 1 | Erlaeuterungstext |
| **Tabs** | 1 | Search/Favorites tab bar in extended search dropdown |
| **Accordion** | 1 | SDVA table of contents |
| **AlertDialog** | 1 | Correction confirmation |
| **DataTable** | 1 | Surcharge patient list |
| **Tooltip** | 1 | Coding guidance icon hover label |
| **Separator** | 0 | Not directly assigned but used implicitly in layouts |

### Composition Patterns Used

| Pattern | Components Using It | Description |
|---|---|---|
| Badge inside Card | #25, #47, #55, #60 | ColumnDef cell renderer or CardContent flex row with inline Badge |
| Form field stack | #3, #10, #19, #21, #23, #24 | Form > FormField > FormItem > FormLabel > FormControl > [Input/Select/etc] > FormMessage |
| Status list item | #26, #27 | div with flex, text + Badge + Button `variant="ghost"` |
| Collapsible section | #7, #8 | Collapsible > CollapsibleTrigger (Button `variant="ghost"`) > CollapsibleContent |
| Combobox (search) | #20, #29, #35, #56 | Popover > Command > CommandInput + CommandList + CommandItem |
| Two-column comparison | #12 | CSS Grid `grid-cols-2` with read-only vs editable side-by-side |
| Banner alert | #57, #58 | Full-width Alert `variant="warning"` above content area |
| Confirmation flow | #49 | AlertDialog triggered by action Button, specific verb labels |
