# Reconciliation Log

Track when upstream changes (bug fixes, new features, architecture shifts) force re-evaluation of existing design artifacts.

**Rules:**
- Entries are append-only. Never delete or modify past entries.
- Number sequentially: Entry 1, Entry 2, etc. Read the file to find the next number before appending.
- A reconciliation entry may result in new design decision entries. Cross-reference using DD-NNN references.

---

## Entry 1: [Example] Navigation restructure after role-based access control added

**Date:** 2026-03-18
**Change:** RBAC introduced at the API layer, restricting endpoints by user role.

**Impact on Design:**
- Sidebar navigation must hide items the user cannot access
- Empty states needed for pages a user can see but not interact with
- Admin-only settings panel requires a new layout variant

**Items reevaluated:**
- `docs/design/navigation-flow.md` — updated to include role-conditional items
- `docs/design/settings-panel.md` — added admin-only variant
- `docs/design/empty-states.md` — added "insufficient permissions" empty state

**Result:** Navigation and settings designs updated to respect RBAC. New design decision created (see DD-NNN) for the "insufficient permissions" empty state pattern.

**Assessed by:** [author of change/commit], [date]

---

<!-- Append new entries below this line -->
