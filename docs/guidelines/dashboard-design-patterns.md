# Dashboard Design Patterns

Design guidelines for the Smart PVS Dashboard. Complements `ui-layout-patterns.md` (structural layout) and `@tini/tokens` (colors, typography, buttons). This document covers dashboard-specific patterns: KPI cards, chart selection, data visualization, drill-down flows, and status signaling.

---

## Dashboard Types in CorePVS

The Smart PVS Dashboard combines three dashboard archetypes:

| Type | Purpose | Update frequency | Primary user |
|------|---------|-----------------|--------------|
| **Operational** | Real-time status of locations, resources, appointments | On page load / refresh | Site managers, MFA leads |
| **Analytical** | Pattern detection, trend analysis, root-cause drill-down | On demand | Medical directors, MVZ management |
| **Strategic** | Cross-location KPI comparison, capacity planning | Period-based (quarter, month) | MVZ management |

Design every screen with a clear type in mind. Do not mix operational urgency cues with strategic long-term views on the same panel.

---

## Information Hierarchy

Follow a progressive-disclosure model with three levels:

```
Level 1: Overview     → Traffic-light KPI cards (scan in seconds)
Level 2: Analysis     → Charts, comparisons, pattern highlights (understand in minutes)
Level 3: Detail       → Data tables, individual records, export (act on specifics)
```

### Rules

1. **Lead with the signal, not the data.** The overview shows status (red/yellow/green), not raw numbers. Numbers appear on hover or drill-down.
2. **Every click deepens context.** Clicking a KPI card opens its analysis view. Clicking a chart segment opens the detail table. Never dead-end.
3. **Preserve navigation context.** Filters, date range, and selected entity persist across drill-down levels. Back navigation restores the previous state exactly.
4. **Maximum 7±2 KPI cards per overview.** Cognitive overload kills scanning speed. Group related KPIs and use tabs/filters for additional dimensions.

---

## KPI Card Design

KPI cards are the primary scanning unit on Level 1.

### Anatomy

```
┌─────────────────────────────────┐
│ [Status dot]  KPI Label         │
│                                 │
│   42.3%                         │  ← Primary value (large)
│   ▲ 3.2% vs MVZ avg            │  ← Comparison line (small)
│                                 │
│   ───── sparkline ─────         │  ← Trend (optional)
└─────────────────────────────────┘
```

### Rules

- **Status dot** uses traffic-light colors (see Status Colors below). Place top-left, 12px diameter.
- **Primary value**: largest text in the card. Use the same unit consistently across cards (%, minutes, count).
- **Comparison line**: shows delta vs benchmark (MVZ average, previous period, specialty benchmark). Prefix with ▲/▼ and sign.
- **Sparkline** (optional): 7-period mini trend. No axis labels — the shape communicates direction.
- **Click target**: entire card is clickable → opens Level 2 analysis for that KPI.
- **Minimum card width**: 200px. Cards reflow in a CSS grid (auto-fill, minmax(200px, 1fr)).

---

## Status Colors (Traffic-Light Pattern)

Traffic-light status is a core design pattern defined in the use case. Apply consistently.

| Status | Meaning | Color | Token | Usage |
|--------|---------|-------|-------|-------|
| 🔴 Critical | Exceeds critical threshold | `#D84B4B` | `--status-critical` | KPI dot, row highlight, card border-left |
| 🟡 Warning | Exceeds warning threshold, below critical | `#D17624` | `--status-warning` | KPI dot, row highlight, card border-left |
| 🟢 Normal / Opportunity | Within threshold or available capacity | `#028A4B` | `--status-normal` | KPI dot, positive delta |
| ⚪ Neutral | No threshold defined or insufficient data | `#9AA7B2` | `--status-neutral` | KPI dot, disabled state |

### Rules

1. **Always show the threshold.** Every colored status must have an accessible tooltip or info icon explaining the rule that triggered it (e.g., "No-show rate > 15% = red").
2. **Do not use traffic-light colors for decoration.** Reserve red/yellow/green exclusively for status signaling. Charts and categories use the `@tini/tokens` palette.
3. **Colorblind safety.** Pair every color with a secondary cue: icon shape (circle/triangle/diamond), text label, or pattern. Never rely on color alone.
4. **Status applies to the entity, not the metric.** A location card turns red because at least one KPI breaches its critical threshold. Show which KPI triggered it.

---

## Chart Selection Guide

Choose the simplest chart type that answers the user's question. Avoid decorative complexity.

### When to use what

| User question | Chart type | Notes |
|---------------|-----------|-------|
| "How does this KPI trend over time?" | **Line chart** | Max 4 lines. Use color + dash style to distinguish. |
| "Which location/specialty is highest?" | **Horizontal bar chart** | Sort by value descending. Include MVZ average as reference line. |
| "How is this distributed across time slots?" | **Vertical bar chart** / **Heatmap** | Heatmap for weekday × time-of-day matrices. |
| "What's the breakdown by category?" | **Stacked bar** or **Grouped bar** | Stacked for part-of-whole, grouped for comparison. Avoid pie charts. |
| "How do two metrics relate?" | **Scatter plot** | Label outliers. Use size for a third variable if needed. |
| "What's the utilization pattern?" | **Heatmap** | Rows = rooms/devices, columns = time slots. Color intensity = utilization %. |
| "How does this entity rank among peers?" | **Dot plot** / **Lollipop chart** | Show benchmark line. Anonymize practitioners by default. |

### Chart rules

1. **No pie charts.** Human eyes are poor at reading angles. Use horizontal bars for proportions.
2. **No 3D effects.** Ever.
3. **Y-axis starts at zero** for bar charts. Line charts may use a truncated axis if the range is narrow, but must label it clearly.
4. **Maximum 4 series per line chart.** Beyond that, use small multiples (one chart per entity, shared axis).
5. **Label directly** on or near the data, not in a separate legend when possible. Legends force eye movement.
6. **Show the benchmark.** Every comparison chart includes a reference line or shaded band for the MVZ average or threshold.
7. **Consistent color assignment.** The same entity always gets the same color across all charts in a session.

---

## Heatmap Pattern (Weekday × Time)

Used for no-show analysis (US-7, US-8) and room utilization (US-20).

```
         08:00  09:00  10:00  11:00  12:00  13:00  14:00  15:00  16:00
Mon      ░░░░░  ░░░░░  ▓▓▓▓▓  ▓▓▓▓▓  ░░░░░  ░░░░░  ▒▒▒▒▒  ░░░░░  ░░░░░
Tue      ░░░░░  ▓▓▓▓▓  █████  ▓▓▓▓▓  ░░░░░  ░░░░░  ░░░░░  ░░░░░  ░░░░░
Wed      ░░░░░  ░░░░░  ▒▒▒▒▒  ░░░░░  ░░░░░  ░░░░░  ░░░░░  ░░░░░  ░░░░░
...
```

### Rules

- Use a **single-hue sequential scale** (light → dark) for intensity. Do not use rainbow/diverging scales for utilization.
- **Cell labels**: show the numeric value inside each cell when the grid is not too dense. Hide labels on hover-only for dense grids.
- **Highlight outlier cells** with a border (2px, status-critical color) when they exceed the threshold.
- **Row/column totals** along the edges provide summary context.

---

## Comparison & Benchmark Patterns

Comparisons are central to the dashboard (site vs MVZ avg, practitioner vs specialty benchmark).

### Bar chart with reference line

```
Location A  ████████████████████  18.2%
Location B  ██████████████████████████████  23.1%  ← red highlight
Location C  ███████████████  14.5%
MVZ Avg     ─────────────────── 16.0%  ← dashed reference line
```

### Delta display

Show absolute value **and** delta. Format: `23.1% (+7.1pp vs avg)`. Use red text for negative deltas, green for positive (with icon backup for colorblind users).

### Small multiples

When comparing many entities (e.g., 8 locations), use small multiples: one mini-chart per entity, all sharing the same axis scale. This avoids spaghetti lines.

---

## Pattern Highlight Cards

When the system detects a statistically relevant pattern (US-11, US-42), display it as a pattern card.

### Anatomy

```
┌──────────────────────────────────────────────────┐
│ ⚠️  Detected Pattern                    [Medium] │  ← confidence badge
│                                                  │
│ "Tuesday mornings show 23% higher no-show rate   │
│  compared to MVZ average."                       │
│                                                  │
│ Based on: 12 weeks of data, Location B           │  ← evidence line
│ Threshold: >15% deviation from MVZ avg           │  ← rule transparency
│                                                  │
│ [View supporting data]  [Dismiss]                │  ← actions
└──────────────────────────────────────────────────┘
```

### Rules

1. **Always show confidence.** Use labels: High / Medium / Low. Low-confidence patterns get muted styling (lighter background, smaller size).
2. **Always show the rule.** The threshold or statistical test that produced the pattern must be visible.
3. **Always link to data.** "View supporting data" opens the chart or table that backs the claim.
4. **Patterns are not alerts.** They are passive observations, consistent with the "decision support, not automation" principle.
5. **Minimum data threshold.** Do not show patterns when sample size is below the configured minimum. Show "Insufficient data" instead.

---

## Recommendation Cards

Recommendations (US-12, US-25, US-31–US-35) follow a similar pattern but emphasize actionability.

### Anatomy

```
┌──────────────────────────────────────────────────┐
│ 💡  Recommendation                  [High impact] │
│                                                  │
│ "Available capacity at Location C could absorb   │
│  appointment demand from Location B."            │
│                                                  │
│ Factors: geographic proximity (4km),             │
│          specialty compatibility ✓,              │
│          device availability ✓,                  │
│          historical patient flow: 12% crossover  │
│                                                  │
│ [View details]  [Defer]  [Dismiss]               │
└──────────────────────────────────────────────────┘
```

### Rules

1. **Decision support only.** Every recommendation card must include the disclaimer: *"This is a suggestion — no action is taken automatically."*
2. **Show the rationale.** List the factors that produced the recommendation. Link each factor to its data source.
3. **Prioritize by impact.** Sort recommendations by impact score. Show the score or rank visibly.
4. **Three actions**: View details (drill-down), Defer (save for later), Dismiss (hide). No "Execute" button.
5. **Weak evidence = lower rank.** Recommendations with low-confidence patterns are ranked below high-confidence ones and visually muted.

---

## Practitioner Data Display

Practitioner performance data requires special care (US-17, US-18, US-38).

### Rules

1. **Default to anonymized.** Show "Practitioner A", "Practitioner B" etc. Named view requires explicit permission.
2. **Label as operational observation.** Every practitioner comparison screen includes a persistent disclaimer: *"These figures reflect operational patterns, not clinical quality assessments."*
3. **Peer comparison within specialty only.** Never compare practitioners across specialties. Filter controls must enforce this.
4. **Show case-mix context.** Display case complexity alongside duration metrics. If unavailable, show *"Case-mix data not available — interpret with caution."*
5. **Use dot plots, not leaderboards.** Show practitioners as dots on a distribution, not as a ranked list. This reduces the feeling of surveillance.

---

## Dashboard Layout

The dashboard uses the standard 3-panel layout from `ui-layout-patterns.md` with these adaptations:

### Sidebar (380px) — Dashboard context

- **Entity selector**: location, specialty, practitioner, resource tabs (US-4)
- **Date range picker**: preset periods (this week, this month, this quarter) + custom range
- **Active filters summary**: pills showing current filter state
- **Saved views** (optional): user-saved filter combinations

### Content area — Dashboard panels

The content area uses a **card grid layout**:

```
┌──────────────────────────────────────────────┐
│  KPI Cards (Level 1)                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ KPI │ │ KPI │ │ KPI │ │ KPI │ │ KPI │   │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │
├──────────────────────────────────────────────┤
│  Charts / Analysis (Level 2)                 │
│  ┌───────────────────┐ ┌───────────────────┐ │
│  │                   │ │                   │ │
│  │   Primary chart   │ │  Secondary chart  │ │
│  │                   │ │                   │ │
│  └───────────────────┘ └───────────────────┘ │
├──────────────────────────────────────────────┤
│  Patterns & Recommendations                  │
│  ┌──────────────────────────────────────────┐│
│  │  Pattern card / Recommendation card      ││
│  └──────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│  Detail Table (Level 3)                      │
│  ┌──────────────────────────────────────────┐│
│  │  Sortable data table with pagination     ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### Spacing

- KPI card grid gap: **16px**
- Section gap (between KPI row, chart row, table): **24px**
- Chart internal padding: **16px**
- Card border-radius: **8px**
- Card background: `#FFFFFF` with `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`

---

## Data Visualization Rules

### Color in charts

1. **Categorical palette**: use `@tini/tokens` brand palette. Assign colors in a fixed order. Maximum 6 categories per chart — group the rest as "Andere" (Other).
2. **Sequential palette** (heatmaps, intensity): single-hue scale from light to dark. Do not use rainbow.
3. **Diverging palette** (above/below benchmark): use a neutral midpoint with distinct hues for positive and negative directions.
4. **Reserve traffic-light colors for status only.** Charts use the categorical or sequential palette, never red/yellow/green for non-status data.

### Typography in charts

- **Chart title**: 16px, weight 600 (matches sidebar secondary header)
- **Axis labels**: 12px, weight 400, color `#4F6679`
- **Data labels**: 12px, weight 600
- **Tooltips**: 14px body in a card with 8px padding, `border-radius: 4px`, shadow

### Interaction

- **Hover**: show tooltip with exact value, comparison, and context
- **Click**: drill-down to next detail level
- **No drag-to-zoom or lasso-select.** Keep interactions simple for non-technical users (MFA, site managers).

### Accessibility

- All charts must have a text alternative (summary sentence or accessible table)
- Minimum contrast ratio 4.5:1 for text on chart backgrounds
- Do not rely on color alone — use shape, pattern, or label as secondary encoding
- Tooltips must be keyboard-accessible

---

## Empty & Insufficient Data States

### No data available

Show a centered illustration with text: *"Keine Daten verfügbar"* (No data available) + explanation of what's missing and how to resolve it.

### Insufficient data for analysis

Show the chart frame with a muted overlay: *"Nicht genügend Daten für eine Analyse. Mindestens [N] Datenpunkte erforderlich."* (Not enough data for analysis. At least [N] data points required.)

### Loading state

Use skeleton cards matching the KPI card and chart dimensions. No spinners on individual cards.

---

## Anti-Patterns

| Don't | Why | Do instead |
|-------|-----|------------|
| Pie charts | Angles are hard to compare | Horizontal bar chart |
| 3D effects | Distort data perception | Flat 2D charts |
| Rainbow color scales | Unreadable, colorblind-hostile | Single-hue sequential scale |
| Gauge/speedometer widgets | Low data density, decorative | KPI card with sparkline |
| Auto-scrolling tickers | Distracting, not scannable | Static sorted list |
| Red/green for non-status data | Confuses status signaling | Categorical palette |
| Truncated Y-axis on bar charts | Exaggerates small differences | Start Y-axis at zero |
| More than 4 line series | Spaghetti chart, unreadable | Small multiples |
| Leaderboard ranking of practitioners | Feels punitive, erodes trust | Dot plot on distribution |
| Auto-executing recommendations | Legal requirement: decision support only | Action buttons with confirmation elsewhere |

---

## Sources

Synthesized from:
- Klipfolio: Starter Guide to Dashboards — dashboard types, chart selection
- Claus Wilke: Fundamentals of Data Visualization — chart type taxonomy, color principles, layout
- data-to-viz.com — chart selection decision tree, common mistakes
- Storytelling with Data (Cole Nussbaumer Knaflic) — narrative, decluttering, strategic color
- Datawrapper Academy — labeling, accessibility, chart formatting
- Tableau: What Is Data Visualization — interactivity, storytelling, common pitfalls
- Material Design 2: Data Visualization guidelines — component patterns
