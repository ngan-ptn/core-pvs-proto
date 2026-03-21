# UI Component Decision Trees

Reference system for consistent, unambiguous component selection in PVS-Core.

**Scope:** 88 design surfaces, ~200+ named UI components, 41 tini-library components available for implementation. Desktop-only (1920x1080). German-language UI.

---

## File Structure

| File | Purpose |
|---|---|
| `README.md` | You are here. Entry point, cheat sheet, usage workflows. |
| `selection-matrices.md` | 4 category tables: Status, Data, Input, Overlays |
| `disambiguation-guides.md` | 8 pair-resolution tables for commonly confused components |
| `patient-record-mapping.md` | 63-component mapping for Patient Record View (S002) |
| `constraint-reference.md` | Anti-patterns + UX axes mapped to component rules |

---

## 1. How to Use These Decision Trees

### Workflow 1: "I see a component name in the inventory and need to know what to use"

1. Check `patient-record-mapping.md` for a direct mapping. This currently covers the Patient Record View (S002) with 63 components.
2. If the component is not listed there, use `selection-matrices.md` to classify the need and find the right component.

### Workflow 2: "I'm designing a new surface and need to choose components"

1. For each UI need, identify which category it falls into:
   - **A: Status and Feedback** — communicating system or record state to the user
   - **B: Data Display** — presenting records, lists, structured data
   - **C: Input and Selection** — forms, filters, user choices
   - **D: Overlays and Disclosure** — panels, modals, expandable content
2. Look up the selection matrix for that category in `selection-matrices.md`.
3. If two components seem equally suitable, check `disambiguation-guides.md` for the relevant pair.

### Workflow 3: "I've chosen a component but want to verify it doesn't violate constraints"

1. Look up the component in `constraint-reference.md` Table 2 (Component to Applicable Constraints).
2. Check each listed constraint against your specific usage context.

---

## 2. Quick Decision Cheat Sheet

| If you need... | Use... | NOT... |
|---|---|---|
| Persistent status label | Badge | Alert (too large for ambient status) |
| Actionable error or warning | Alert | Badge (not actionable), Toast (too transient) |
| Transient notification | toast() | Alert (persistent), Dialog (blocking) |
| Destructive confirmation | AlertDialog | Dialog (not visually distinct for danger) |
| Supplementary panel | Sheet | Dialog (blocks main content) |
| Searchable selection (>20 items) | Combobox | Select (no search) |
| Fixed selection (<20 items) | Select | Combobox (overkill) |
| 2-4 visible choices | RadioGroup | Select (hides options) |
| Binary toggle (instant effect) | Switch | Checkbox (form submission pattern) |
| Progressive disclosure | Collapsible (single) / Accordion (multiple) | Dialog or Sheet (overlay, not inline) |
| Brief hint on hover | Tooltip | Popover (persists), HoverCard (too complex) |
| Rich preview on hover | HoverCard | Tooltip (text-only) |
| Interactive floating content | Popover | Tooltip (not interactive) |
| Row actions in a table | DropdownMenu | Multiple exposed buttons (clutter) |

---

## 3. Extending to Other Surfaces

`patient-record-mapping.md` currently covers only the Patient Record View (S002). To extend to other surfaces:

1. List all components from the target surface's inventory entry.
2. Check if each component already appears in the Patient Record mapping. Many components are shared across surfaces.
3. For any new components not yet mapped, use the selection matrices to classify and select.
4. Add the completed mapping to a new file named `[surface-name]-mapping.md` in this directory.

Priority surfaces for future mapping, ordered by component complexity:

| Surface | ID | Components |
|---|---|---|
| Schein / Billing Record View | S008 | ~60 |
| Card Read / Check-In Screen | S001 | ~18 |
| Prescription Builder | S039 | ~9 |

---

## 4. Design Tokens Quick Reference

### Semantic Color Mapping

| Semantic | Token | Badge Variant | Alert Variant | Use For |
|---|---|---|---|---|
| Success / Valid | success | success | success | Valid states, completed actions, present certificates |
| Warning / Caution | warning | warning | warning | Expiring, approaching limits, non-blocking issues |
| Error / Danger | destructive | destructive | destructive | Invalid, blocking errors, missing requirements |
| Info / Neutral | info | info | info | Hints, rare disease flags, IfSG alerts |
| Inactive / Low | secondary | secondary | — | Version labels, metadata, disabled items |
| Outline / Minimal | — | outline | — | Tags and labels without semantic meaning |

### Traffic-Light Mapping

Derived from PVS-Core UX principles:

- Green (success) = OK, no action needed
- Yellow (warning) = attention needed, approaching threshold
- Red (destructive) = action required, threshold breached

### Severity Scale

Tokens `severity-0` through `severity-10`. Use for continuous scales such as certificate status matrices or KPI dashboards. Maps green (0) to yellow (5) to red (10).

---

## 5. Version History

| Date | Change |
|---|---|
| 2026-03-17 | Initial creation. Patient Record View mapping. 4 selection matrices. 8 disambiguation guides. |
