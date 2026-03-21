# Interaction Specs

Use this template to describe behavior, transitions, timing, recovery, and edge cases. Pair each interaction area with the related screen specs and user flows.

---

## Document Scope

- Product / feature: [Product or feature name]
- Surfaces covered: [Desktop, mobile, kiosk, admin, etc.]
- Owner: [Name]
- Last updated: [YYYY-MM-DD]

---

## 1. [Interaction Area or Surface]

| Trace | Link |
|-------|------|
| Traced from | [Requirement, bug, compliance source, or workflow need] |
| Matched by | [API, architecture, implementation, or design source] |
| Proven by | [Test suite, prototype, audit, or usability evidence] |
| Confirmed by | [Name], [YYYY-MM-DD] |

**Scope:** [What part of the product this section covers.]

### 1.1 [Scenario Name]

**Trigger:** [User, system, or time-based trigger]
**Preconditions:** [What must already be true]

**Happy path:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Transitions:**

| From | To | Motion / change | Timing | Notes |
|------|----|-----------------|--------|-------|
| [State A] | [State B] | [Fade, slide, inline update, none] | [300ms, immediate, etc.] | [Notes] |

**Timing constraints:**
- [Minimum display time]
- [Timeout threshold]
- [Retry or escalation window]

**System feedback:**
- Loading: [Spinner, skeleton, disabled state, placeholder copy]
- Success: [Confirmation, redirect, status update]
- Partial success: [What succeeded, what still needs attention]
- Error: [Message, recovery option, fallback path]

**Edge cases:**
- [Interrupted flow]
- [Concurrent update]
- [Expired session, stale data, or duplicate submission]
- [Offline or degraded mode]

**Accessibility:**
- [Focus management]
- [Announcements or live regions]
- [Reduced motion or non-animated fallback]

**Related artifacts:**
- Screens: [Screen section or doc link]
- Flows: [Flow section or doc link]
- Evidence: [Test, audit, or prototype link]

---

### 1.2 [Next Scenario]

Duplicate the subsection above for each additional interaction in this area.

---

## 2. [Next Interaction Area]

Duplicate the full section above for each additional interaction area or surface.
