# Design Decisions Log

Track UI/UX design decisions that involve trade-offs, multiple valid approaches, or extensions/pushback on requirements.

**Rules:**
- Entries are append-only. Never delete or modify past entries.
- Number sequentially: DD-001, DD-002, etc. Read the file to find the next number before appending.
- A reconciliation entry may result in new design decision entries. Cross-reference them.

---

## DD-001: [Example] Default date format for form inputs

**Triggered by:** [link to bug/feature/user story]
**Matched by:** [link to ADR/API spec/implementation]
**Confirmed by:** [author of change/commit], [date]

**Requirement said:** Use ISO 8601 date format (YYYY-MM-DD) for all date inputs.

**Design decision:** Use locale-aware date format with ISO 8601 stored internally. Display adapts to user's locale setting while the API layer always sends ISO 8601.

**Rationale:** Users in different regions expect familiar date formats. Forcing ISO 8601 in the UI caused confusion in usability testing. Storing ISO internally keeps the API contract clean.

**What was added beyond requirements:** Locale detection from browser settings with a manual override in user preferences.

**Trade-off:** Added complexity in the date picker component. Two formats to maintain (display vs. storage). Edge cases around locale detection in SSR.

**Pushback expected:** PM may question the added complexity. Counter: usability testing showed 40% fewer date entry errors with locale-aware formatting.

---

<!-- Append new entries below this line -->
