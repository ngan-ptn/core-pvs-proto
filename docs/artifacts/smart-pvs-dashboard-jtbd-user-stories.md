# Smart PVS Dashboard for MVZ Operational Control

## Purpose
This document translates the Smart PVS Dashboard use case into a product-ready structure of:
- Epic
- JTBD
- User stories
- Acceptance criteria

It is designed for the Germany MVZ context and focuses on operational steering, explainable insights, and decision support rather than workflow automation.

---

# Germany / MVZ context summary

## Observed evidence
- MVZs are a meaningful and growing care model in Germany.
- The German PVS market is mature and competitive, with established vendors serving ambulatory practices and MVZs.
- Competitor positioning commonly emphasizes practice software, appointment management, specialty support, and operational efficiency.
- Existing market signal suggests usability, workflow fit, and trust in operational tooling are commercially important.

## Inferred implication
The strongest product wedge is not a generic BI dashboard, but an **operational control layer for MVZs** that helps users:
- detect bottlenecks early,
- understand root causes clearly,
- compare across locations fairly,
- and make practical capacity decisions.

---

# JTBD overview

## Functional jobs
1. Spot operational problems early across locations, specialties, practitioners, and resources.
2. Understand why a KPI is off, not just that it is off.
3. Rebalance capacity across sites, rooms, devices, and schedules.
4. Support management decisions with evidence instead of gut feeling.

## Emotional jobs
1. Feel in control of a distributed MVZ network.
2. Avoid unpleasant surprises in leadership reviews.
3. Discuss efficiency issues without unfairly blaming clinicians.
4. Trust the dashboard because its signals are explainable.

## Social jobs
1. Look data-driven in front of owners and leadership.
2. Coordinate consistently across locations.
3. Show staff that the system supports operations, not punitive surveillance.

## Current alternatives / workarounds
- Excel exports
- periodic manual reports
- fragmented PVS modules
- ad hoc calls between sites
- local intuition rather than shared operational truth

---

# Epic 1 — Get immediate operational visibility

## JTBD
**When I open the system, I want to know immediately where attention is needed so I can prioritize my day.**

### US-1. Cross-location traffic-light overview
**User story:** As MVZ management, I want a cross-location dashboard with red/yellow/green indicators so I can identify operational outliers in seconds.

**Acceptance criteria:**
- Dashboard shows all active locations in one view.
- Each location displays status for at least no-show, treatment duration, and resource utilization.
- Status color is calculated from predefined thresholds.
- Data refreshes on dashboard load.
- User can identify any red status without opening detail pages.

### US-2. Site vs MVZ average
**User story:** As a site manager, I want to see my site’s status compared with the MVZ average so I know whether my location needs action.

**Acceptance criteria:**
- Dashboard shows current site KPI and MVZ-wide benchmark side by side.
- Variance is displayed as absolute and/or percentage difference.
- Comparison period is clearly labeled.
- User can switch between current period and previous period.
- Any materially negative deviation is visually highlighted.

### US-3. Specialty overview
**User story:** As a medical director, I want a high-level specialty overview so I can spot specialties with efficiency deviations.

**Acceptance criteria:**
- Dashboard groups KPIs by specialty.
- Each specialty shows at least patient volume, average treatment duration, and no-show rate.
- Specialties with threshold breaches are highlighted.
- User can sort specialties by worst deviation.
- Clicking a specialty opens a detailed breakdown.

### US-4. KPI grouping by entity
**User story:** As MVZ management, I want KPIs grouped by location, specialty, practitioner, and resource so I can switch from macro to micro view quickly.

**Acceptance criteria:**
- Dashboard provides tabs or filters for location, specialty, practitioner, and resource.
- Switching views does not require leaving the dashboard context.
- The same KPI definitions are used across all views.
- User can filter by date range in every grouping.
- Selected filters persist while switching groupings.

### US-5. Clickable flagged KPI
**User story:** As a user, I want each flagged KPI to be clickable so I can move directly from signal to analysis.

**Acceptance criteria:**
- Every KPI card with a status indicator supports click-through.
- Clicking opens a relevant detail view for that KPI.
- Detail view preserves applied filters from the overview page.
- User can navigate back to overview without losing context.
- Detail page loads the root-cause breakdown for that KPI.

---

# Epic 2 — Detect no-show problems early

## JTBD
**When no-shows rise, I want to know where and when they happen so I can intervene before capacity is wasted.**

### US-6. No-show rate by location
**User story:** As a site manager, I want to see no-show rate by location so I can identify sites with abnormal patient absence.

**Acceptance criteria:**
- Dashboard shows no-show rate for each location for the selected date range.
- Rates are calculated consistently across locations.
- User can rank locations by highest no-show rate.
- MVZ average is shown for comparison.
- Locations exceeding threshold are highlighted.

### US-7. No-show by weekday
**User story:** As a site manager, I want no-show rates broken down by weekday so I can find recurring scheduling patterns.

**Acceptance criteria:**
- Detail view shows no-show rates for Monday–Sunday.
- User can filter by location and specialty.
- Day-level values are compared against overall average.
- Highest-risk weekdays are visually emphasized.
- Data can be viewed for current and historical periods.

### US-8. No-show by time of day
**User story:** As a site manager, I want no-show rates broken down by time of day so I can detect high-risk appointment windows.

**Acceptance criteria:**
- Dashboard shows no-show distribution across time slots.
- Time slots can be grouped by hour or configured interval.
- User can filter by location, weekday, and specialty.
- High-risk time windows are highlighted.
- Time-of-day view supports comparison with network average.

### US-9. No-show by specialty
**User story:** As MVZ management, I want no-show rates segmented by specialty so I can see whether the issue is operational or specialty-specific.

**Acceptance criteria:**
- No-show rates are available per specialty.
- User can compare specialties within a location or across all locations.
- Dashboard shows volume context alongside rate.
- Specialty outliers are clearly flagged.
- Specialty segmentation works with selected date filters.

### US-10. Compare one location with others
**User story:** As a user, I want to compare one location’s no-show rate with other locations so I can determine whether the issue is local or systemic.

**Acceptance criteria:**
- User can select one location and compare it against all other locations.
- Comparison shows absolute rate and delta from MVZ average.
- Comparison is available by date range.
- User can drill into the compared locations using the same filters.
- Significant variance is clearly visualized.

### US-11. Highlight relevant no-show patterns
**User story:** As a user, I want the system to highlight statistically relevant no-show patterns so I don’t need to manually inspect every chart.

**Acceptance criteria:**
- System identifies patterns based on configured threshold or statistical rule.
- Each pattern includes the dimension involved, such as weekday or time.
- Pattern card shows the amount of deviation from baseline.
- User can click from the pattern card to supporting data.
- System does not generate a pattern when data volume is below a minimum threshold.

### US-12. Suggested next steps for high-risk no-show slots
**User story:** As a user, I want the dashboard to suggest likely next steps for high-risk no-show slots so I can act faster.

**Acceptance criteria:**
- For flagged high-risk slots, dashboard shows at least one recommendation.
- Recommendations are linked to the specific pattern detected.
- Suggestions are phrased as decision support, not auto-execution.
- User can see the rationale behind each suggestion.
- Recommendations can be dismissed or marked for follow-up.

---

# Epic 3 — Understand treatment-duration inefficiencies

## JTBD
**When treatment times run long, I want fair context so I can improve operations without unfairly blaming clinicians.**

### US-13. Treatment duration by specialty
**User story:** As a medical director, I want to see average treatment duration by specialty so I can identify specialties with efficiency drift.

**Acceptance criteria:**
- Dashboard displays average treatment duration per specialty.
- User can compare current period with previous period.
- Specialty averages include volume context.
- Outlier specialties are highlighted.
- User can drill down from specialty to practitioner level.

### US-14. Practitioner vs specialty benchmark
**User story:** As a practice manager, I want to compare practitioner duration against specialty benchmark so I can spot workflow outliers.

**Acceptance criteria:**
- Each practitioner shows average duration and specialty benchmark.
- Difference from benchmark is displayed numerically.
- User can sort practitioners by highest positive deviation.
- Comparison respects selected location and date range.
- Drill-down shows related contextual factors where available.

### US-15. Case-mix context
**User story:** As a user, I want case-mix context shown alongside practitioner duration so I can interpret performance fairly.

**Acceptance criteria:**
- Practitioner detail view includes case-mix indicator or proxy.
- Duration comparison is shown alongside case complexity context.
- Case-mix data source is labeled.
- User can distinguish raw duration from adjusted interpretation.
- Where case-mix is unavailable, system clearly indicates missing context.

### US-16. Room/device context for long durations
**User story:** As a user, I want room and device usage shown alongside treatment duration so I can identify whether bottlenecks are clinician-related or infrastructure-related.

**Acceptance criteria:**
- Practitioner view includes associated room and device utilization context.
- Long-duration cases can be viewed with room/device correlation.
- User can identify whether the same bottleneck repeats across resources.
- Data is filterable by date range.
- Resource context appears on the same screen as duration analysis.

### US-17. Peer comparison within specialty
**User story:** As a user, I want peer comparison within the same specialty so I can avoid misleading cross-specialty comparisons.

**Acceptance criteria:**
- Practitioner peers are only compared within the same specialty.
- Comparison excludes unrelated specialties.
- Dashboard shows practitioner ranking or distribution within specialty.
- User can switch between anonymized and named view based on permissions.
- Benchmarks are calculated consistently across peers.

### US-18. Label as operational observation
**User story:** As a user, I want the interface to clearly label these insights as operational observations rather than quality judgments so I can use them safely in management conversations.

**Acceptance criteria:**
- Practitioner performance screens include explanatory disclaimer text.
- Wording distinguishes operational efficiency from clinical quality.
- Disclaimer is visible in both overview and detail screens.
- User cannot remove or hide the disclaimer without admin control.
- Exported views preserve the same wording.

---

# Epic 4 — Optimize expensive resources

## JTBD
**When equipment or rooms are underused, I want to find recoverable capacity so I can improve ROI without adding headcount.**

### US-19. Device utilization by site
**User story:** As MVZ management, I want to see device utilization by site so I can identify expensive underused equipment.

**Acceptance criteria:**
- Dashboard displays utilization rate for each tracked device by site.
- User can filter by device type and location.
- Underutilized devices are visually highlighted.
- Utilization period is configurable.
- Detail view shows historical trend for each device.

### US-20. Room utilization over time
**User story:** As a site manager, I want to see room utilization over time so I can find empty capacity windows.

**Acceptance criteria:**
- Dashboard shows room occupancy/utilization over selected time range.
- User can inspect utilization by day and time slot.
- Empty or low-use windows are easy to identify.
- User can filter by location and room type.
- Historical comparison is available.

### US-21. Highlight underutilized devices
**User story:** As a user, I want underutilized devices highlighted visually so I can immediately see unused capacity.

**Acceptance criteria:**
- Devices below threshold are marked in green or another designated color.
- Highlight appears in overview and resource detail views.
- Threshold definition is visible or configurable.
- User can sort devices by lowest utilization.
- Highlighting updates with refreshed data.

### US-22. Compare resource utilization across sites
**User story:** As MVZ management, I want to compare resource utilization across sites so I can decide where demand could be shifted.

**Acceptance criteria:**
- User can compare same resource categories across locations.
- Comparison includes rate, available capacity, and trend.
- Sites are sortable by utilization.
- Filters apply consistently across sites.
- Comparison supports at least one exportable view.

### US-23. See available slots at other locations
**User story:** As a user, I want to see available appointment slots at other locations so I can evaluate redistribution options.

**Acceptance criteria:**
- Dashboard shows upcoming available slots across eligible locations.
- User can filter by specialty and date.
- Results include location and availability window.
- User can move from utilization insight to slot availability in one flow.
- Unavailable or incompatible locations are excluded.

### US-24. Filter by specialty compatibility
**User story:** As a user, I want resource utilization views filtered by specialty compatibility so I can avoid invalid reallocation ideas.

**Acceptance criteria:**
- User can apply specialty compatibility as a filter.
- Only compatible locations/resources remain visible after filtering.
- Compatibility logic is documented or visible.
- Recommendations respect selected compatibility filters.
- Incompatible resources are not used in suggested reallocations.

---

# Epic 5 — Rebalance demand across locations

## JTBD
**When one site is overloaded and another has slack, I want practical reallocation options so I can smooth operations across the MVZ.**

### US-25. Suggest locations that can absorb demand
**User story:** As MVZ management, I want the system to suggest which locations can absorb demand from overloaded sites so I can rebalance capacity.

**Acceptance criteria:**
- System identifies overloaded and underutilized locations.
- Suggestion list ranks candidate locations by fit.
- Each suggestion includes source site and target site.
- Recommendation is visible from the flagged KPI context.
- User can open supporting capacity details for each suggestion.

### US-26. Consider geographic proximity
**User story:** As a user, I want recommendations to consider geographic proximity so proposed reallocation is realistic for patients.

**Acceptance criteria:**
- Recommendation logic includes location distance or travel proxy.
- Nearby sites are prioritized over distant sites.
- User can see proximity as a factor in the recommendation.
- If proximity data is unavailable, system indicates this.
- Distance threshold can be configured or documented.

### US-27. Consider specialty compatibility
**User story:** As a user, I want recommendations to consider specialty compatibility so patients are only redirected to clinically appropriate sites.

**Acceptance criteria:**
- Recommendations are generated only for specialty-compatible locations.
- Compatibility rule is displayed in recommendation detail.
- Incompatible locations are excluded from suggested options.
- User can review which specialty drove the recommendation.
- Recommendation remains filterable by specialty.

### US-28. Consider device availability
**User story:** As a user, I want recommendations to consider device availability so redirected demand can actually be served.

**Acceptance criteria:**
- Recommendation checks whether required devices are available at target location.
- Device availability is shown in recommendation detail.
- System excludes targets with insufficient required resources.
- Availability is based on selected planning horizon.
- Recommendation detail links to resource utilization view.

### US-29. Consider historical patient flow
**User story:** As a user, I want recommendations to consider historical patient flow so suggestions reflect real behavior, not just theoretical capacity.

**Acceptance criteria:**
- Recommendation includes historical cross-site attendance or referral pattern when available.
- Patient flow factor is visible in explanation.
- If no historical flow exists, system marks recommendation as lower-confidence.
- Historical lookback period is defined.
- User can inspect supporting trend data.

### US-30. Explain each recommendation
**User story:** As a site manager, I want to see the operational reason behind each recommendation so I can trust and defend the suggestion.

**Acceptance criteria:**
- Every recommendation includes a short rationale.
- Rationale references at least one supporting metric.
- User can open a detailed explanation view.
- Explanation avoids black-box wording.
- Exported recommendation retains the rationale.

---

# Epic 6 — Turn insight into action

## JTBD
**When I discover a pattern, I want concrete actions I can take next so the dashboard changes behavior, not just reporting.**

### US-31. Suggest appointment-template adjustments
**User story:** As a site manager, I want suggested appointment-template adjustments for problematic time windows so I can reduce inefficiency.

**Acceptance criteria:**
- Dashboard suggests adjustments only when a repeated pattern is detected.
- Suggestion identifies affected time windows.
- User can review why that template change is suggested.
- No template is changed automatically.
- Suggestion can be marked accepted, dismissed, or deferred.

### US-32. Suggest reminder workflows
**User story:** As a user, I want reminder workflow suggestions for high no-show segments so I can target preventable absences.

**Acceptance criteria:**
- For high-risk segments, dashboard suggests reminder intervention.
- Recommendation identifies triggering pattern, such as weekday/time/specialty.
- Suggestion is visible alongside no-show analysis.
- User can see intended operational outcome.
- No reminder is sent automatically from this feature.

### US-33. Suggest slot redistribution
**User story:** As MVZ management, I want suggestions for slot redistribution between sites so I can improve utilization.

**Acceptance criteria:**
- System identifies candidate source and target sites.
- Suggestion includes available slots and overload indicator.
- User can compare before/after capacity view if available.
- Recommendation is limited to compatible services.
- Suggestion is exportable or shareable.

### US-34. Keep user in control
**User story:** As a user, I want the system to surface proposed actions without auto-executing them so I stay in control.

**Acceptance criteria:**
- All actions are presented as recommendations only.
- No booking, reminder, or schedule change is executed automatically.
- Interface clearly labels recommendations as non-automated.
- User must leave the dashboard or confirm elsewhere to take action.
- Audit log distinguishes insight generation from any later manual action.

### US-35. Prioritize recommendations by impact
**User story:** As a user, I want recommendations prioritized by likely operational impact so I know what to tackle first.

**Acceptance criteria:**
- Recommendations are sorted by defined impact score or rule.
- Ranking criteria are visible or explainable.
- Highest-priority recommendations appear first.
- User can re-sort by other dimensions.
- Recommendations with weak evidence are ranked lower or labeled accordingly.

### US-36. Export/share findings
**User story:** As a user, I want to export or share key findings with leadership so I can support decisions outside the dashboard.

**Acceptance criteria:**
- User can export selected findings in a standard format.
- Export preserves metrics, dates, and recommendation rationale.
- Export respects role-based data visibility.
- Shared view includes context and filters used.
- Exported file is readable without dashboard access.

---

# Epic 7 — Preserve trust, permissions, and explainability

## JTBD
**When operational data touches practitioner performance, I want safe access and transparent logic so the tool is trusted internally.**

### US-37. Role-based views
**User story:** As MVZ management, I want role-based views for management, site managers, and medical directors so each user sees appropriate detail.

**Acceptance criteria:**
- System supports at least the defined user roles.
- Each role has defined access to overview and detail levels.
- Unauthorized users cannot open restricted views.
- Role permissions are applied consistently across dashboard modules.
- Access rules are testable by role.

### US-38. Anonymized or named practitioner data
**User story:** As a user, I want practitioner data shown anonymized or named depending on permissions so the system respects governance rules.

**Acceptance criteria:**
- Practitioner identifiers are anonymized for users without permission.
- Authorized users can view named data where allowed.
- Same record appears consistently anonymized or named based on role.
- Exports follow the same permission rule.
- UI indicates whether data is anonymized.

### US-39. Show rule/threshold behind alerts
**User story:** As a user, I want each alert or insight to show the rule/threshold behind it so conclusions are explainable.

**Acceptance criteria:**
- Every alert references the rule, threshold, or comparison used.
- User can view the calculation basis from the alert.
- Threshold text is human-readable.
- Explanation is available in both overview and detail states.
- Changes to thresholds are reflected in future alerts.

### US-40. Show benchmark definitions
**User story:** As a user, I want benchmark definitions visible so I understand how comparisons are calculated.

**Acceptance criteria:**
- Benchmarks include a definition and comparison scope.
- User can access benchmark definition inline or via tooltip.
- Benchmark time period is clearly shown.
- Different benchmark types are labeled distinctly.
- Benchmark definitions are consistent across screens.

### US-41. Show historical trend behind status
**User story:** As a user, I want historical trend context behind a red/yellow/green status so I can distinguish one-off variation from persistent problems.

**Acceptance criteria:**
- Clicking a status shows historical trend for the same KPI.
- Trend includes at least one prior comparison period.
- User can distinguish current spike from sustained issue.
- Trend view uses same KPI definition as the overview.
- Status color and historical trend can be viewed together.

### US-42. Show confidence/evidence notes
**User story:** As a user, I want confidence or evidence notes attached to detected patterns so I know how strongly to trust them.

**Acceptance criteria:**
- Pattern cards include a confidence, evidence, or minimum-data note.
- Notes indicate if signal is weak due to low sample size or limited history.
- User can inspect what data supports the pattern.
- Low-confidence insights are visually differentiated.
- Recommendation strength aligns with confidence level.

---

# Suggested MVP cut

The following 10 stories are the recommended MVP cut for the dashboard prototype:

1. **US-1** — Cross-location traffic-light overview
2. **US-6** — No-show rate by location
3. **US-8** — No-show by time of day
4. **US-10** — Compare one location with others
5. **US-5** — Clickable flagged KPI
6. **US-13** — Treatment duration by specialty
7. **US-14** — Practitioner vs specialty benchmark
8. **US-19** — Device utilization by site
9. **US-23** — See available slots at other locations
10. **US-25** — Suggest locations that can absorb demand

These 10 stories give the strongest prototype narrative because they cover:
- immediate visibility,
- no-show insight,
- treatment efficiency,
- resource utilization,
- and cross-site actionability.
