# CorePVS — Prescription Screen Wireframe Structure

## Context
Derived from:
- Phase 4: Prescription Management (E-Rezept)
- UX Axes: Speed / Safety-Clarity / Density

---

## 1. Overall Layout (24" Desktop)

```
+----------------------------------------------------------------------------------+
| Patient Header (Sticky)                                                          |
|----------------------------------------------------------------------------------|
| Search Panel     | Prescription Workspace        | Safety / Insights Panel        |
| (Left)           | (Center)                      | (Right)                         |
|                  |                               |                                 |
|                  |                               |                                 |
|                  |                               |                                 |
|----------------------------------------------------------------------------------|
| Action Bar (Sticky Bottom)                                                       |
+----------------------------------------------------------------------------------+
```

---

## 2. Regions Breakdown

### 2.1 Patient Header (Sticky Top)

**Purpose:** Always-visible patient context

**Elements:**
- Patient name, age, gender
- Insurance (IK, type)
- Allergies (highlighted)
- Chronic conditions (badges)
- Current medication count

**UX Rules:**
- Read-only (visually distinct)
- High contrast alerts (e.g. allergies)

---

### 2.2 Search Panel (Left)

**Purpose:** Fast drug search & selection

**Elements:**
- Search input (keyboard focus default)
- Recent drugs
- Frequent drugs
- Search results (dense list)

**Row structure:**
- Drug name (bold)
- Strength + form
- Package size
- Warning indicator (icon)

**UX Rules:**
- Keyboard navigation (↑ ↓ Enter)
- Inline expand (no modal)

---

### 2.3 Prescription Workspace (Center)

**Purpose:** Build and edit prescription

#### Structure:

Each medication = 1 row (expandable)

**Collapsed row:**
- Drug name
- Dosage summary
- Duration
- Status indicator

**Expanded row:**
- Dosage fields
- Frequency
- Duration
- Notes
- Substitution (aut-idem)

---

### 2.4 Safety / Insights Panel (Right)

**Purpose:** Real-time decision support

**Sections:**
- Drug interactions
- Contraindications
- Economic suggestions
- Alternatives

**Severity levels:**
- 🔴 Critical
- 🟡 Warning
- 🟢 OK

**UX Rules:**
- Updates in real-time
- Always visible (no tab hiding)

---

### 2.5 Action Bar (Sticky Bottom)

**Actions:**
- Save Draft
- Sign (QES)
- Submit (E-Rezept)
- Print patient copy

**States:**
- Disabled until valid
- Show error inline

---

## 3. State System

| State | UI |
|------|----|
| Draft | Neutral |
| Incomplete | Yellow |
| Warning | Amber/Red |
| Ready | Green |
| Signed | Locked |
| Submitted | Final |

---

## 4. Key UX Principles

- One-screen workflow (no tab switching)
- High-density rows (no cards)
- Inline editing
- Real-time safety feedback
- Keyboard-first interaction
- Clear read-only vs editable separation

---

## 5. Alignment with Product Context

- Supports **E-Rezept workflow (FHIR + QES)** fileciteturn1file0
- Matches **Speed / Safety / Density UX axes** fileciteturn1file1
- Designed for **24" desktop clinical usage**

---

## 6. Summary

This screen is not a form.

It is a:

> **High-throughput prescribing workstation**
