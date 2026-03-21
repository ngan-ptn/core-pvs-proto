# Screen Specs

Use this template to specify each screen by purpose, layout, regions, states, and dependencies. Engineers should be able to build the screen and its state coverage from this document plus the related interaction specs.

---

## Document Scope

- Product / feature: [Product or feature name]
- Surfaces covered: [Desktop, mobile, kiosk, admin, etc.]
- Owner: [Name]
- Last updated: [YYYY-MM-DD]

---

## 1. [Feature Area]

### 1.1 [Screen Name]

**Purpose:** [Why this screen exists.]

| Trace | Link |
|-------|------|
| Traced from | [Requirement, story, bug, compliance source, or workflow need] |
| Matched by | [API, architecture, implementation, or design source] |
| Proven by | [Test suite, prototype, audit, or usability evidence] |
| Confirmed by | [Name], [YYYY-MM-DD] |

**Entry points:**
- [Flow, route, event, or trigger]
- [Alternative entry point]

**Layout:**
- Viewport / device: [Desktop, kiosk, mobile, modal, drawer, etc.]
- Structure: [Single column, split pane, dashboard, full screen, wizard, etc.]
- Persistent regions: [Header, navigation, footer, status bar, etc.]

**Regions:**

| Region | Content | Notes |
|--------|---------|-------|
| [Header] | [Title, status, navigation, actions] | [Rules] |
| [Body] | [Primary content] | [Rules] |
| [Sidebar / secondary area] | [Context, filters, details] | [Rules] |
| [Footer / action area] | [Primary and secondary actions] | [Rules] |

**Data / dependencies:**
- [Required data]
- [Permissions, feature flags, or role requirements]
- [External system, device capability, or async dependency]

**Primary actions:**
- [Main CTA]
- [Secondary CTA]

**States:**

| State | What the user sees | Exit / next state |
|-------|--------------------|-------------------|
| Default | [Base layout] | [Next step] |
| Loading | [Skeleton, spinner, placeholder copy] | [Populated or error] |
| Empty | [Empty state copy and action] | [How user leaves this state] |
| Error | [Error copy and recovery action] | [Retry, fallback, or abort] |
| Populated | [What the completed state contains] | [Next step] |

**Accessibility:**
- [Focus order and keyboard access]
- [Heading structure and labels]
- [Non-color cues for status or severity]

**Notes:**
- [Legal, copy, localization, or compliance note]
- [Link to related interaction spec section]
- [Open question or follow-up]

---

### 1.2 [Next Screen]

Duplicate the subsection above for each additional screen in this feature area.

---

## 2. [Next Feature Area]

Duplicate the full section above for each additional feature area.
