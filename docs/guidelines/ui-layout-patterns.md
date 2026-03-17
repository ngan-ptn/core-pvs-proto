# UI Layout & Component Patterns

Extracted from Figma design specs. Covers structural layout, spacing, and component patterns.
For colors, typography, and button styles: follow `@tini/tokens` and `@tini/ui`.

---

## Page Layout

Three-panel layout: **Nav Rail** | **Sidebar** | **Content Area**.

```
+--------+----------------+----------------------------------+
| NavRail|    Sidebar     |         Content Area             |
|  60px  |    380px       |         flexible                 |
|        |                |                                  |
+--------+----------------+----------------------------------+
```

- Total reference width: 1280px (desktop-only, 24" monitors)
- Nav rail: fixed 60px
- Sidebar: fixed 380px, vertical scroll where needed
- Content area: fills remaining space

---

## Nav Rail (60px)

- Width: **60px**, full viewport height
- Collapsed mode: icon-only (20px icons in 32px containers, centered with `padding: 13px 16px`)
- Sections:
  1. Logo/switcher area: `padding: 20px 16px 12px`, height 64px
  2. User info: 48px avatar container with `border-radius: 4px`, semi-transparent background (`rgba(255,255,255,0.1)`)
  3. Menu items: 44px height each, centered icons
  4. Section dividers: 1px line at `rgba(255,255,255,0.2)`, with `padding: 8px 16px`
  5. Bottom lock/collapse: absolute positioned at bottom, `padding: 8px 0px`
- Lock button: 32px circle with shadow, overlapping the rail edge (`left: 44px`)

---

## Sidebar (380px)

- Width: **380px**
- Section separation: `box-shadow: inset 0px -1px 0px #DCE0E4` (bottom divider)
- Section padding: **16px** all sides
- Gap between items within a section: **8px** (vertical), **4px** (compact lists)

### Sidebar Sections

| Section | Height | Notes |
|---------|--------|-------|
| Patient Info | ~328px | Header + status row + detail list + contract buttons |
| CAVE | ~104px | Header + free-text content |
| Allergy | ~54px | Single row, icon + label |
| Schein History | 96px–280px | Scrollable (`overflow-y: scroll`), quarter grouping |
| Permanent Diagnosis | ~84px | Collapsible |
| Vital Parameters | ~84px | Collapsible with edit action |

### Section Headers

- **Primary** (H4): `font-size: 18px`, `font-weight: 700`, `line-height: 24px` — used for top-level sidebar heading (e.g., patient name)
- **Secondary** (Body large emphasis): `font-size: 16px`, `font-weight: 600`, `line-height: 24px` — used for section sub-headings (e.g., "CAVE", "Scheinhistorie")
- **Tertiary** (Body default emphasis): `font-size: 14px`, `font-weight: 600`, `line-height: 22px` — used for sub-group titles (e.g., "Vitalwerte")

---

## Icon Sizing

Two standard container sizes:

| Context | Container | Icon | Padding | Usage |
|---------|-----------|------|---------|-------|
| Action icon | **24px** | **16px** | 4px | Sidebar actions, table row actions, inline controls |
| Nav icon | **32px** | **20px** | 6px | Navigation rail menu items |

- Action icon containers: `border-radius: 4px`
- All icons centered via `justify-content: center; align-items: center`

---

## Tags & Badges

Pill-shaped tags with `border-radius: 768px` (effectively full-round).

| Variant | Background | Border | Text weight |
|---------|-----------|--------|-------------|
| Neutral | `#F0F2F4` | none | 600 |
| Informative | `#E6ECFE` | `1px solid rgba(19,50,75,0.1)` | 600 |
| Positive | `#FFFFFF` | `1px solid #88E2B5` | 600 |
| Patient type | `#CFF0FE` | none | 600 |

- Tag padding: `2px 8px` (tight) or `4px 8px` (standard)
- Min width: **20px** (icon-only) or **24px** (with text)
- Font: caption size (12px/18px), `letter-spacing: -0.2px`

### Schein Type Badges

Rectangular badges with `border-radius: 4px`, `1px solid rgba(19,50,75,0.1)`:

| Type | Background | Text color |
|------|-----------|------------|
| KV (Kassenärztlich) | `#95E0F9` | `#086280` |
| HzV (Hausarztzentriert) | `#EEAAFD` | `#6C1299` |
| FaV (Facharztvertrag) | `#8EEDDC` | `#107569` |

- Padding: `0px 2px`, min-width 20px
- Font: caption emphasis (12px/18px, weight 600)

---

## Sidebar Detail Rows

Each info row follows the pattern:

```
[16px icon] [8px gap] [content, flex-grow] [optional 24px action icon]
```

- Row gap (between rows): **4px**
- Icon color for labels: `#9AA7B2`
- Dot separator between inline values: ` ` (caption style, `#9AA7B2`)
- Expandable rows use `chevron-down` (16px) as the trailing action icon

---

## Schein List Items

### Active/Selected Schein
- Background: `#E6ECFE`
- Border: `1px solid #356BF5`
- Border-radius: **8px**
- Padding: **8px**

### Inactive Schein
- Background: `#FFFFFF`
- No border
- Padding: **8px**

### Row structure
```
[Schein type badge] [4px] [Content: name + tags + EV icon] [4px] [Action group: focus + more]
```

- Action group: two 24px icon buttons (crosshair + vertical dots)
- Active insurance detail: indented with 2px blue left border (`border: 2px solid #356BF5` rotated)

### Quarter Headers
- Background: `#F0F2F4`
- Padding: `4px 8px`
- Font: table header style (12px, weight 600, uppercase)

---

## Content Area Tabs

- Tab bar: full width, bottom border via `box-shadow: inset 0px -1px 0px #DCE0E4`
- Each tab: `padding: 8px 16px`, min-width **80px**, text centered
- Active tab: `box-shadow: inset 0px -3px 0px #356BF5` (3px blue bottom indicator), `font-weight: 600`
- Inactive tab: `font-weight: 400`

---

## Data Table

### Table Header
- Background: `#F0F2F4`
- Row padding: `0px 8px`
- Cell padding: `4px 8px`
- Column dividers: `box-shadow: inset -1px 0px 0px #DCE0E4`
- Font: 12px, weight 600, uppercase, `#4F6679`
- Sort icons: 16px, positioned after header text

### Table Rows
- Alternating backgrounds: `#FFFFFF` (odd) / `#F7F9FB` (even)
- Row padding: `0px 8px`
- Cell padding: **8px**
- Column dividers: same as header (`inset -1px 0px 0px #DCE0E4`)
- Row height: dynamic based on content (no fixed height)

### Table Cell Variants

| Variant | Alignment | Content |
|---------|-----------|---------|
| Text | left | Primary text + optional caption below |
| Text link | left | Bold blue link text + caption, optional avatar |
| Numeric | right | Right-aligned number |
| Icon only | left | Single action icon (24px) |

- Text cells: `align-items: flex-start`
- Numeric cells: `justify-content: flex-end`
- Avatar in link cells: **24px** circle with border `1px solid rgba(19,50,75,0.1)`

### Table Footer / Pagination
- Height: **36px**
- Padding: `8px 16px`
- Layout: `[Pagination controls]  [Summary text, right-aligned]`
- Pagination: rows-per-page dropdown + "1-3 of 3" + nav arrows (skip-back, prev, next, skip-forward)

---

## Contract Buttons (Sidebar)

Small action buttons for HzV, FaV, DMP:

- Filled variant: `background: #DCE0E4`, `border-radius: 4px`, `padding: 4px 4px 4px 8px`
- Outline variant: `background: #FFFFFF`, `border: 1px solid #730606`, `border-radius: 4px`, `padding: 4px 8px`
- Font: 12px weight 600 (filled) or 11px weight 600 (outline)
- Include dropdown chevron (12px) where applicable

---

## Filter Tags (Content Area)

Pill-shaped filter chips in the toolbar:

- `border: 1px solid #DCE0E4`, `border-radius: 768px`
- Padding: `4px 8px`
- Min width: **24px**
- Include trailing chevron-down (12px) for dropdowns
- Separated by a vertical divider (`border: 1px solid #DCE0E4` rotated 90deg) between filter groups

---

## Search Input

- Height: **40px**
- Border: `1px solid #DCE0E4`, `border-radius: 4px`
- Padding: **8px**
- Back arrow (24px) to the left of the input
- Clear button (x-circle, 16px) inside the input, right-aligned

---

## Spacing Reference

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | 16px | Sidebar sections, content area padding |
| Section gap | 8px | Between items in a sidebar section |
| Compact gap | 4px | Between tags, between schein items, inline separators |
| Cell padding | 8px | Table cells |
| Tab padding | 8px 16px | Tab labels |
| Nav item height | 44px | Each nav rail menu item |
| Divider | 1px | All section/column dividers |

---

## Collapsible Sections

- Header row: title (left) + chevron-up/down icon (right, 24px action icon)
- Optional edit icon next to the collapse chevron
- Collapsed: shows only header
- Expanded: header + content with 8px gap

---

## Status Icons in Context

| Icon pattern | Meaning |
|-------------|---------|
| check-circle-solid (green `#028A4B`) | Permanently approved / success |
| half-circle (orange `#D17624`) | Provisionally approved / pending |
| slash-circle (red `#D84B4B`) | Rejected / not allowed |
| card-x (orange `#D17624`) | Card not read in |
| plus (blue `#356BF5`) | Add new item |

---

## Key Implementation Notes

1. **Dividers are box-shadows**, not border elements. Use `box-shadow: inset` for section and column dividers.
2. **No border-radius on table rows** -- only on schein list items (8px) and tags (768px / 4px).
3. **Sidebar scrolls independently** from the content area; schein history section has its own scroll (`overflow-y: scroll`, max-height 280px).
4. **Action icons are invisible until hover** in many contexts (`display: none` by default) -- implement show-on-hover for table row and list item actions.
5. **Alternating row colors** in tables use `#FFFFFF` and `#F7F9FB` -- not zebra-striped via CSS nth-child; controlled per-row.
