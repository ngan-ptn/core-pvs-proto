# CorePVS — Prescription Workflow Spec (Option B)

## 1. Keyboard Shortcuts

| Action | Shortcut |
|-------|---------|
| Focus search | / |
| Navigate results | ↑ ↓ |
| Select drug | Enter |
| Add medication row | Ctrl + Enter |
| Next field | Tab |
| Save draft | Ctrl + S |
| Sign (QES) | Ctrl + Shift + S |
| Submit | Ctrl + Enter (on valid) |

---

## 2. Interaction Flow (Mermaid)

```mermaid
flowchart LR
A[Focus Search] --> B[Search Drug]
B --> C[Select Drug]
C --> D[Edit Dosage Inline]
D --> E[Real-time Safety Check]
E --> F{Valid?}
F -- No --> G[Show Warning]
F -- Yes --> H[Ready to Sign]
H --> I[Sign QES]
I --> J[Submit E-Rezept]
```

---

## 3. State Transitions (Mermaid)

```mermaid
stateDiagram-v2
[*] --> Draft
Draft --> Incomplete
Incomplete --> Draft
Draft --> Warning
Warning --> Draft
Draft --> Ready
Ready --> Signed
Signed --> Submitted
Submitted --> [*]
```

---

## 4. Rules

- No modal interruption
- Safety always visible
- Signing supports batch queue
