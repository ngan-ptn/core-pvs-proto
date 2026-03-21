# CorePVS — Prescription UI Spec (Option C)

## 1. Layout Grid

- 3-column layout (Left 25% / Center 50% / Right 25%)
- Sticky header + sticky footer
- Max width: 1920px (24")

---

## 2. Components (tini-library mapping)

### Search Panel
- Input: `Input.Search`
- List: `List.Dense`
- Row: `List.Item + Badge + Icon`

### Prescription Row
- Container: `Table.Row`
- Fields: `Input.Number`, `Select`, `Textarea`
- Expand: `Accordion`

### Safety Panel
- Alert: `Alert (severity: error/warning/success)`
- List: `List.Stacked`

### Action Bar
- Buttons: `Button.Primary`, `Button.Secondary`
- State: disabled / loading / success

---

## 3. Visual Rules

| Element | Rule |
|--------|------|
| Read-only | Grey background |
| Editable | White background |
| Critical alert | Red border + icon |
| Warning | Yellow highlight |
| Success | Green badge |

---

## 4. Density Rules

- Row height: 32–40px
- Max visible rows (no scroll): 10–15
- No card UI

---

## 5. Interaction Rules

- Inline editing only
- No modal for core flow
- Keyboard-first navigation
- Real-time validation

---

## 6. Tokens

- Spacing: 4 / 8 / 12 / 16
- Font: 12–14px dense mode
- Border radius: minimal (2–4px)

---

## 7. Summary

UI is optimized for:

- Speed (keyboard + inline)
- Safety (state + alerts)
- Density (table-first)
