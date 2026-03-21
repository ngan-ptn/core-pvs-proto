# CorePVS UX Checklist

## Purpose

This checklist helps reviewers:
- evaluate design before development
- align around the three canonical UX axes: Speed, Clarity, and Density
- confirm that a design reflects MVZ complexity rather than generic SaaS conventions

## Scope

This file is a review aid, not a second source of truth.
Use it primarily for high-frequency workflow screens.

For canonical principles and screen-specific exceptions, also review:
- `docs/product-context/product-context.md`
- `docs/guidelines/ui-layout-patterns.md`
- `docs/guidelines/dashboard-design-patterns.md`
- `docs/guidelines/copy-guideline.md`

## Context

- CorePVS is an MVZ operating system for multi-location, high-complexity care delivery
- Designs must support high-throughput workflows, legal safety, and cross-location orchestration
- The goal is not "clean SaaS"; the goal is fast, reliable operational software

# Axis 1 - Speed

## Goal

Users complete frequent tasks at least as efficiently as the current analog or legacy workflow.

## Must Do

- [ ] Keep primary actions visible in the current workspace
- [ ] Prefer single-screen workflows for repeated daily tasks when safety allows
- [ ] Support inline edit, save, and validation where appropriate
- [ ] Use smart defaults and context-aware prefill
- [ ] Reduce unnecessary steps, clicks, and context switches

## Power-User Optimization

- [ ] Support keyboard-first completion for frequent tasks
- [ ] Avoid mandatory mouse-only interactions
- [ ] Avoid modal chains for routine workflows

## Avoid

- [ ] Multi-step wizards for daily tasks unless there is a clear safety reason
- [ ] Hidden actions buried in deep menus
- [ ] Redirects that break task context for common actions

## Check Questions

- [ ] Is this task still fast if repeated 100 times per day?
- [ ] Is there a defined baseline for time and steps?
- [ ] Does each added step improve safety or only add friction?

# Axis 2 - Clarity And Safety

## Goal

Users understand ownership, state, and risk immediately enough to avoid legal or clinical errors.

## Must Do

### Editable Vs Read-Only

- [ ] Editable and read-only data are distinguishable at a glance
- [ ] External data is clearly read-only and visually separate from local documentation
- [ ] Ownership and edit permissions are never ambiguous

### State System

- [ ] Each entity has a meaningful state model where needed
- [ ] State treatment is consistent across the app
- [ ] Status never relies on color alone

### Traffic-Light Logic

- [ ] Use red, yellow, and green for status signaling only
- [ ] Pair status color with icon, label, or pattern
- [ ] Explain thresholds or rules when status colors appear

### Validation

- [ ] Show validation close to the field or action that caused it
- [ ] Use actionable, domain-specific error guidance
- [ ] Keep confirmation strength proportional to impact

## Avoid

- [ ] Neutral treatment for critical data or warnings
- [ ] Hidden validation that appears only at the end of a long workflow
- [ ] Generic error messages that do not explain recovery

## Check Questions

- [ ] Can a user detect editability in a few seconds?
- [ ] Is there a risk of billing, diagnosis, or documentation error?
- [ ] Can a user scan the errors without reading every line?

# Axis 3 - Density

## Goal

Support high-volume desktop workflows without scroll hunting for primary actions.

## Must Do

- [ ] On a 24-inch desktop, primary controls and current-task context are visible without unnecessary scrolling
- [ ] Use logical grouping and multi-column layout where it improves throughput
- [ ] Use tables or dense lists for operational data entry and review when appropriate
- [ ] Preserve context during drill-down or progressive disclosure
- [ ] Keep secondary information one click away when it does not need to stay visible

## Screen-Type Guidance

- [ ] Workflow screens prioritize throughput and immediate action
- [ ] Dashboard and analytics screens may use cards when scanning and comparison are the goal
- [ ] Long-history and sidebar regions may scroll when the scroll area is intentional and bounded

## Avoid

- [ ] Whitespace-heavy layouts that reduce information density
- [ ] Fragmented workflows that force unnecessary screen hopping
- [ ] Layout rules copied from consumer SaaS without validating against MVZ workflows

## Check Questions

- [ ] Are the primary actions above the fold?
- [ ] Is any scrolling intentional, bounded, and non-blocking?
- [ ] Does the layout match the screen type: workflow, dashboard, or history view?
- [ ] Is the missing context visible now or one click away?

# Cross-Checks Against Canonical Principles

Confirm the design still matches the canonical rules in `docs/product-context/product-context.md`.

- [ ] Decision support, not automation
- [ ] Drill-down preserves context
- [ ] Empty, loading, error, and populated states are defined
- [ ] Requirements remain traceable to the delivered design

# Final Review

## Pass If

- [ ] The primary workflow has a defined benchmark and meets it
- [ ] Editability, ownership, and state are unambiguous
- [ ] Primary controls are visible on a 24-inch desktop without unnecessary scroll
- [ ] Power-user efficiency has been considered
- [ ] The screen follows the correct pattern for its type

## Fail If

- [ ] The design feels like generic clinic SaaS instead of MVZ operational software
- [ ] Cosmetic simplicity is prioritized over task speed and safety
- [ ] State handling is unclear or inconsistent
- [ ] Status color is used decoratively instead of meaningfully

# Positioning Reminder

Generic clinic software aims to be easy to browse.
CorePVS must be fast to operate under real clinical load.

# Internal Rule

If the design feels:
- [ ] "clean and pleasant but slower" -> not enough
- [ ] "dense, fast, and still scannable" -> correct direction
