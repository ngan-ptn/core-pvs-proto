# Component Inventory

Use this template to document reusable UI components, their variants, their states, and where they appear. Replace bracketed placeholders and duplicate the component section for each component in scope.

---

## Document Scope

- Product / feature: [Product or feature name]
- Surfaces covered: [Desktop, mobile, kiosk, admin, etc.]
- Design system / source: [@tini/ui, @tini/tokens, approved custom component, etc.]
- Owner: [Name]
- Last updated: [YYYY-MM-DD]

---

## 1. [Component Name]

| Trace | Link |
|-------|------|
| Traced from | [Requirement, job story, bug, or compliance source] |
| Matched by | [API, architecture, implementation, or design source] |
| Proven by | [Test, prototype, audit, or validation evidence] |
| Confirmed by | [Name], [YYYY-MM-DD] |

**Purpose:** [What this component helps the user understand or do.]

**Used in:**
- [Screen or surface]
- [Flow or scenario]

### Variants

| Variant | Label / content | Visual treatment | Usage |
|---------|-----------------|------------------|-------|
| [Primary] | [Copy] | [Color, icon, size, token set] | [When used] |
| [Secondary] | [Copy] | [Color, icon, size, token set] | [When used] |

### States

| State | What changes | Notes |
|-------|--------------|-------|
| Default | [Base appearance] | [Notes] |
| Hover / Focus / Active | [Interaction feedback] | [Keyboard / pointer notes] |
| Disabled / Read-only | [Visual difference] | [Why] |
| Loading / Error / Empty | [Behavior] | [Fallback or recovery] |

### Structure

| Region / slot | Content | Notes |
|---------------|---------|-------|
| [Header] | [Label, icon, count, action] | [Rules] |
| [Body] | [Primary content] | [Rules] |
| [Footer / action area] | [CTA, helper text] | [Rules] |

```text
[Optional ASCII sketch or slot layout]
```

### Behavior

- Trigger: [What reveals, updates, or dismisses the component]
- Response: [Animation, timing, focus movement, or state change]
- Validation / recovery: [What happens on invalid input, failure, retry]
- Dependencies: [Data, permissions, feature flag, external system]

### Accessibility

- [Keyboard interaction and focus order]
- [Screen reader labeling / live region behavior]
- [Non-color cues for status or severity]
- [Touch target / hit area requirements]

### Notes

- [Open question, constraint, or follow-up]

---

## 2. [Next Component]

Duplicate the section above for each additional reusable component in scope.
