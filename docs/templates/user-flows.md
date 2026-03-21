# User Flows

Use this template to map task journeys, branch conditions, recovery paths, and postconditions across happy paths and edge cases.

---

## Document Scope

- Product / feature: [Product or feature name]
- Actors covered: [Primary roles, supporting roles, external systems]
- Owner: [Name]
- Last updated: [YYYY-MM-DD]

---

## 1. [Flow Name]

| Trace | Link |
|-------|------|
| Traced from | [Requirement, story, bug, compliance source, or workflow need] |
| Matched by | [API, architecture, implementation, or design source] |
| Proven by | [Test suite, prototype, audit, or usability evidence] |
| Confirmed by | [Name], [YYYY-MM-DD] |

**Primary actor:** [Role]
**Supporting actors / systems:** [Role, team, service, device, or external dependency]
**Trigger:** [What starts the flow]
**Preconditions:** [What must already be true]

```text
[Flow diagram or linear sequence]
```

### Main Path

1. [Actor action]
2. [System response]
3. [Actor confirms or continues]
4. [Completion state]

### Alternate Paths

- [Branch condition]: [Different path and outcome]
- [Branch condition]: [Different path and outcome]

### Failure / Recovery

- [Failure case]: [Recovery path]
- [Timeout, expiry, conflict, or validation block]: [Recovery path]

### Postconditions

- [User-facing result]
- [System state result]
- [Audit, notification, or downstream effect]

### Success Signals

- User sees: [Confirmation, updated status, countdown, redirect, etc.]
- Staff / system sees: [Queue update, log entry, status badge, event, etc.]

### Related Artifacts

- Screens: [Screen section or doc link]
- Interactions: [Interaction section or doc link]
- Evidence: [Test, audit, or prototype link]

---

## 2. [Next Flow]

Duplicate the section above for each additional flow in scope.
