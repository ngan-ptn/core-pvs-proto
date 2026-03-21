#!/usr/bin/env python3
"""
Phase 3: Score complexity, assign design tiers, and generate all 6 deliverable files.

Output:
  master-screen-inventory.md / .json
  design-roadmap.md / .json
  gap-report.md
  verification-checklist.md
"""

import json
import re
from pathlib import Path
from datetime import date

INPUT = Path("/Users/gary/Desktop/requirement-documents/docs/design-inventory/canonical-surfaces.json")
OUTPUT_DIR = Path("/Users/gary/Desktop/requirement-documents/docs/design-inventory")

# ── Tier Assignment Rules ──
# Based on the plan's 5-tier system. Surface names (substring match) -> tier.
TIER_OVERRIDES = {
    # Tier 1: Foundation Shells
    "Patient Record View": 1,
    "Card Read / Check-In Screen": 1,
    "Schein / Billing Record View": 1,
    "Billing Dashboard (KV Mode)": 1,
    "System Status Bar": 1,
    "Practice Administration Panel": 1,
    "User & Rights Management Panel": 1,
    "Manual Patient Entry Form": 1,
    "Waiting Room Board": 1,

    # Tier 2: Core Clinical
    "Prescription Builder": 2,
    "Prescription Queue": 2,
    "eAU Form": 2,
    "Form Print Preview": 2,
    "Patient Match Review Panel": 2,
    "Quarter Transition Dashboard": 2,
    "Cost Carrier Search Panel": 2,
    "Clinical Note Editor": 2,
    "Prescription Status View": 2,
    "Patient Copy Preview": 2,
    "KIM Inbox": 2,
    "Temporary Cost Carrier Form": 2,

    # Tier 3: Extended Clinical & Specialty
    "Drug Search Panel": 3,
    "Interaction Alert Dialog": 3,
    "Dosage Calculator Panel": 3,
    "Red Hand Letter Alert": 3,
    "Heilmittel Prescription Form": 3,
    "Hilfsmittel Prescription Form": 3,
    "DiGA Prescription Builder": 3,
    "DiGA Directory Browser": 3,
    "Hilfsmittelverzeichnis Search": 3,
    "Medication Plan Editor": 3,
    "BMP Print Preview": 3,
    "BMP Import Dialog": 3,
    "eDMP Documentation Form": 3,
    "eDMP Patient Overview": 3,
    "eDMP Validation Results": 3,
    "eHKS Documentation Form": 3,
    "Scoring Calculator Panel": 3,
    "Audit Trail Viewer": 3,
    "Doctor Letter Composer": 3,
    "ePA Document Browser": 3,
    "ePA Entitlement Manager": 3,
    "Document Upload Dialog": 3,
    "GDT Device Data Review Surface": 3,
    "Quantity Tracking Panel": 3,

    # Tier 4: HZV/FAV & Billing Specialty
    "TE Form (Enrollment Declaration)": 4,
    "TE Overview List": 4,
    "Enrollment Settings": 4,
    "Participation Management View": 4,
    "PTV Import Wizard": 4,
    "Import Protocol View": 4,
    "Billing Dashboard (HZV": 4,
    "Billing Dashboard (ASV": 4,
    "Billing Validation Results Panel": 4,
    "HZV / FAV Submission Panel": 4,
    "Transmission Protocol View": 4,
    "KV / HZV Conflict Review Panel": 4,
    "Post-Submission Editor": 4,
    "AOK Check 18+ Panel": 4,
    "ASV Team Configuration": 4,

    # Tier 5: Admin & Infrastructure
    "HZV / FAV Contract Management Panel": 5,
    "Physician Identity Management Panel": 5,
    "Contract Documents Viewer": 5,
    "Master Data Management Panel": 5,
    "Fee Schedule Browser": 5,
    "TI Connector Status Panel": 5,
    "Module Management Panel": 5,
    "System Compliance Settings": 5,
    "Coding Instructions Browser": 5,
    "Coding Rule Settings": 5,
    "Rule Violation Overview": 5,
    "Lab Proficiency Gate": 5,
    "Patient Receipt Preview": 5,
    "EHIC Patient Entry Form": 5,
    "MVZ Dashboard": 5,
    "Multimorbidity Surcharge Patient List": 5,
    "ICode Management View": 5,
    "pnSD Configuration Dialog": 5,
}

TIER_DESCRIPTIONS = {
    1: "Foundation Shells. Design FIRST. Screens that every other screen builds upon.",
    2: "Core Clinical Workflow. Design SECOND. Daily physician and MFA workflow.",
    3: "Extended Clinical & Specialty. Design THIRD. Specialty workflows, drug safety, eDMP.",
    4: "HZV/FAV & Billing Specialty. Design FOURTH. Contract-specific and billing deep-dive.",
    5: "Admin & Infrastructure. Design LAST or in parallel. Quarterly/annual admin tasks.",
}

WORKFLOW_ORDER = [
    "Patient Check-In & Registration",
    "Insurance & Enrollment (HZV/FAV)",
    "Clinical Documentation",
    "Service & Billing Documentation",
    "Prescriptions",
    "Forms & Certificates",
    "Chronic Care Programs",
    "Billing & Submission",
    "Data Import & Sync",
    "ePA & Document Exchange",
    "Practice Administration",
    "System Infrastructure",
]


def compute_complexity(surface):
    """Compute complexity score for a surface."""
    state_count = len(surface.get("states", []))
    component_count = len(surface.get("components", []))
    extension_count = len(surface.get("extendedByPhases", []))
    req_count = len(surface.get("requirements", []))

    # Weighted score: extensions matter most (layout cascades), then states
    score = (extension_count * 5) + (state_count * 2) + (component_count * 1.5) + (req_count * 0.5)

    return {
        "score": round(score, 1),
        "stateCount": state_count,
        "componentCount": component_count,
        "extensionCount": extension_count,
        "requirementCount": req_count
    }


def assign_tier(surface):
    """Assign design priority tier to a surface."""
    name = surface["name"]

    # Check overrides
    for override_name, tier in TIER_OVERRIDES.items():
        if override_name.lower() in name.lower():
            return tier, f"Explicitly assigned: {TIER_DESCRIPTIONS[tier].split('.')[0]}"

    # Fallback heuristic based on phase and complexity
    phase = surface.get("definedInPhase", "")
    complexity = surface.get("complexity", {}).get("score", 0)

    if phase.startswith("1."):
        return 2, "Phase 1 surface, core workflow"
    elif phase.startswith(("2A.", "2B.")):
        return 3, "Phase 2 clinical surface"
    elif phase.startswith("3."):
        return 4, "Phase 3 billing surface"
    elif phase.startswith("4."):
        return 3, "Phase 4 prescription surface"
    elif phase.startswith("5."):
        return 3, "Phase 5 forms/certificates surface"
    elif phase.startswith("6."):
        return 3, "Phase 6 chronic care surface"
    elif phase.startswith("7."):
        return 5, "Phase 7 infrastructure surface"
    else:
        return 4, "Unclassified, defaulting to Tier 4"


def generate_inventory_json(surfaces):
    """Generate master-screen-inventory.json."""
    inventory = {
        "generatedAt": str(date.today()),
        "totalSurfaces": len(surfaces),
        "byRole": {},
        "byWorkflow": {},
        "byTier": {},
        "surfaces": []
    }

    for s in surfaces:
        r = s["primaryRole"]
        inventory["byRole"][r] = inventory["byRole"].get(r, 0) + 1
        w = s["workflow"]
        inventory["byWorkflow"][w] = inventory["byWorkflow"].get(w, 0) + 1
        t = str(s["designPriority"]["tier"])
        inventory["byTier"][t] = inventory["byTier"].get(t, 0) + 1

        inventory["surfaces"].append({
            "id": s["id"],
            "name": s["name"],
            "definedInPhase": s["definedInPhase"],
            "extendedByPhases": s.get("extendedByPhases", []),
            "description": s["description"],
            "primaryRole": s["primaryRole"],
            "secondaryRoles": s.get("secondaryRoles", []),
            "workflow": s["workflow"],
            "states": s.get("states", []),
            "components": s.get("components", []),
            "requirements": s.get("requirements", []),
            "complexity": s["complexity"],
            "designPriority": s["designPriority"],
            "isGap": s.get("isGap", False),
            "gapReason": s.get("gapReason", None),
        })

    return inventory


def generate_roadmap_json(surfaces):
    """Generate design-roadmap.json."""
    tiers = {}
    for s in surfaces:
        t = s["designPriority"]["tier"]
        if t not in tiers:
            tiers[t] = {
                "tier": t,
                "description": TIER_DESCRIPTIONS.get(t, ""),
                "surfaces": []
            }
        tiers[t]["surfaces"].append({
            "id": s["id"],
            "name": s["name"],
            "phase": s["definedInPhase"],
            "role": s["primaryRole"],
            "workflow": s["workflow"],
            "complexity": s["complexity"]["score"],
            "reason": s["designPriority"]["reason"],
            "isGap": s.get("isGap", False),
        })

    return {
        "generatedAt": str(date.today()),
        "totalSurfaces": len(surfaces),
        "tiers": [tiers[t] for t in sorted(tiers.keys())]
    }


def generate_inventory_md(surfaces):
    """Generate master-screen-inventory.md."""
    lines = [
        "# PVS-Core Master Screen Inventory",
        "",
        f"**Generated:** {date.today()}  ",
        f"**Total Surfaces:** {len(surfaces)}  ",
        f"**Gap Surfaces:** {sum(1 for s in surfaces if s.get('isGap'))}",
        "",
        "---",
        "",
        "## Summary",
        "",
        "### By Role",
        "",
        "| Role | Count |",
        "|------|-------|",
    ]

    role_counts = {}
    for s in surfaces:
        r = s["primaryRole"]
        role_counts[r] = role_counts.get(r, 0) + 1
    for role in ["MFA", "Doctor", "Admin"]:
        lines.append(f"| {role} | {role_counts.get(role, 0)} |")

    lines.extend(["", "### By Workflow", "", "| Workflow | Count |", "|----------|-------|"])
    workflow_counts = {}
    for s in surfaces:
        w = s["workflow"]
        workflow_counts[w] = workflow_counts.get(w, 0) + 1
    for wf in WORKFLOW_ORDER:
        if wf in workflow_counts:
            lines.append(f"| {wf} | {workflow_counts[wf]} |")

    lines.extend(["", "### By Design Tier", "", "| Tier | Description | Count |", "|------|-------------|-------|"])
    tier_counts = {}
    for s in surfaces:
        t = s["designPriority"]["tier"]
        tier_counts[t] = tier_counts.get(t, 0) + 1
    for t in sorted(tier_counts.keys()):
        desc = TIER_DESCRIPTIONS.get(t, "").split(".")[0]
        lines.append(f"| {t} | {desc} | {tier_counts[t]} |")

    lines.extend(["", "---", ""])

    # Group by workflow
    for wf in WORKFLOW_ORDER:
        wf_surfaces = [s for s in surfaces if s["workflow"] == wf]
        if not wf_surfaces:
            continue

        lines.extend([f"## {wf}", ""])

        for s in sorted(wf_surfaces, key=lambda x: x["designPriority"]["tier"]):
            gap_badge = " `[GAP]`" if s.get("isGap") else ""
            ext_info = ""
            if s.get("extendedByPhases"):
                ext_phases = ", ".join(sorted(set(s["extendedByPhases"])))
                ext_info = f" Extended by: {ext_phases}."

            lines.extend([
                f"### {s['name']}{gap_badge}",
                "",
                f"- **ID:** {s['id']}",
                f"- **Phase:** {s['definedInPhase']}",
                f"- **Primary Role:** {s['primaryRole']}",
                f"- **Design Tier:** {s['designPriority']['tier']} ({TIER_DESCRIPTIONS[s['designPriority']['tier']].split('.')[0]})",
                f"- **Complexity Score:** {s['complexity']['score']} ({s['complexity']['stateCount']} states, {s['complexity']['componentCount']} components, {s['complexity']['extensionCount']} extensions)",
            ])

            if ext_info:
                lines.append(f"- **Extensions:**{ext_info}")

            if s.get("secondaryRoles"):
                lines.append(f"- **Secondary Roles:** {', '.join(s['secondaryRoles'])}")

            if s.get("isGap"):
                lines.append(f"- **Gap Reason:** {s.get('gapReason', 'N/A')}")

            lines.extend([
                "",
                f"> {s['description']}" if s['description'] else "",
                "",
            ])

            # States
            if s.get("states"):
                lines.append("**States:**")
                lines.append("")
                lines.append("| State | Trigger |")
                lines.append("|-------|---------|")
                seen_states = set()
                for st in s["states"]:
                    state_name = st.get("name", "")
                    if state_name and state_name not in seen_states:
                        seen_states.add(state_name)
                        trigger = st.get("trigger", "")
                        lines.append(f"| {state_name} | {trigger} |")
                lines.append("")

            # Components
            if s.get("components"):
                lines.append("**Components:**")
                lines.append("")
                lines.append("| Component | Description |")
                lines.append("|-----------|-------------|")
                seen_comps = set()
                for comp in s["components"]:
                    comp_name = comp.get("name", "")
                    if comp_name and comp_name not in seen_comps:
                        seen_comps.add(comp_name)
                        desc = comp.get("description", "")
                        lines.append(f"| {comp_name} | {desc} |")
                lines.append("")

            lines.append("---")
            lines.append("")

    return "\n".join(lines)


def generate_roadmap_md(surfaces):
    """Generate design-roadmap.md."""
    lines = [
        "# PVS-Core Design Roadmap",
        "",
        f"**Generated:** {date.today()}  ",
        f"**Total Surfaces:** {len(surfaces)}",
        "",
        "This document defines the **order in which screens should be designed**. Tier 1 must be designed first because all other screens depend on these layouts.",
        "",
        "---",
        "",
    ]

    tier_surfaces = {}
    for s in surfaces:
        t = s["designPriority"]["tier"]
        tier_surfaces.setdefault(t, []).append(s)

    for tier in sorted(tier_surfaces.keys()):
        surfs = tier_surfaces[tier]
        desc = TIER_DESCRIPTIONS.get(tier, "")
        lines.extend([
            f"## Tier {tier}: {desc}",
            "",
            f"**{len(surfs)} surfaces**",
            "",
            "| # | Surface | Phase | Role | Workflow | Complexity | Gap? |",
            "|---|---------|-------|------|----------|-----------|------|",
        ])

        for i, s in enumerate(sorted(surfs, key=lambda x: x["workflow"]), 1):
            gap = "Yes" if s.get("isGap") else ""
            ext = f" (+{len(s['extendedByPhases'])})" if s.get("extendedByPhases") else ""
            lines.append(
                f"| {i} | {s['name']}{ext} | {s['definedInPhase']} | {s['primaryRole']} | {s['workflow']} | {s['complexity']['score']} | {gap} |"
            )

        lines.extend(["", "---", ""])

    # Dependencies section
    lines.extend([
        "## Cross-Tier Dependencies",
        "",
        "These surfaces are extended by multiple phases and their layout cascades to all dependent screens:",
        "",
        "| Surface | Defined | Extended By | Complexity |",
        "|---------|---------|-------------|-----------|",
    ])
    for s in sorted(surfaces, key=lambda x: len(x.get("extendedByPhases", [])), reverse=True):
        if s.get("extendedByPhases"):
            ext_phases = ", ".join(sorted(set(s["extendedByPhases"])))
            lines.append(f"| {s['name']} | {s['definedInPhase']} | {ext_phases} | {s['complexity']['score']} |")

    lines.extend(["", "---", ""])

    # Gap surfaces section
    lines.extend([
        "## Gap Surfaces (Not Yet in User Stories)",
        "",
        "These surfaces were identified as missing from user stories but needed for the product:",
        "",
    ])
    for s in surfaces:
        if s.get("isGap"):
            lines.extend([
                f"### {s['name']}",
                f"- **Phase:** {s['definedInPhase']}",
                f"- **Tier:** {s['designPriority']['tier']}",
                f"- **Reason:** {s.get('gapReason', 'N/A')}",
                "",
            ])

    return "\n".join(lines)


def generate_gap_report(surfaces):
    """Generate gap-report.md."""
    gap_surfaces = [s for s in surfaces if s.get("isGap")]

    lines = [
        "# PVS-Core Gap Report",
        "",
        f"**Generated:** {date.today()}  ",
        f"**Gap Surfaces Found:** {len(gap_surfaces)}",
        "",
        "This report identifies screens that exist in the product context but are **not yet defined in user story files**. These need user stories written before they can be fully designed.",
        "",
        "---",
        "",
        "## Gap Surfaces Requiring New User Stories",
        "",
    ]

    for s in gap_surfaces:
        lines.extend([
            f"### {s['name']}",
            "",
            f"- **Proposed Phase:** {s['definedInPhase']}",
            f"- **Design Tier:** {s['designPriority']['tier']}",
            f"- **Primary Role:** {s['primaryRole']}",
            f"- **Workflow:** {s['workflow']}",
            f"- **Reason:** {s.get('gapReason', 'N/A')}",
            "",
            f"> {s['description']}",
            "",
            "**Proposed States:**",
            "",
        ])
        for st in s.get("states", []):
            lines.append(f"- **{st.get('name', '')}**: {st.get('trigger', '')} -> {st.get('changes', '')}")
        lines.extend(["", "**Proposed Components:**", ""])
        for comp in s.get("components", []):
            lines.append(f"- **{comp.get('name', '')}**: {comp.get('description', '')}")
        lines.extend(["", "---", ""])

    # Additional gaps from plan
    lines.extend([
        "## Additional Design Recommendations",
        "",
        "### Specialty-Adaptive Workspaces",
        "",
        "**Approach:** One Patient Record View with a configurable layout region, NOT separate screens per specialty.",
        "",
        "- **Tier 1:** Design Patient Record View with a clearly marked \"specialty content zone\" placeholder",
        "- **Tier 3:** Design 4-5 specialty widget panels (Cardiology, Psychiatry, Dermatology, General Practice, Pediatrics)",
        "- **Tier 5:** Design the Specialty Configuration admin surface",
        "",
        "Why: The Patient Record View is already extended by 9 phases. Creating N specialty variants would multiply design/maintenance work. The product context describes default widget ordering, not fundamentally different layouts.",
        "",
        "### Phase 7.6 Scope Discrepancy",
        "",
        "The roadmap says ~12 requirements for Phase 7.6, but the user stories reference ~21. This should be reconciled before design begins to prevent scope creep in the Contract Management surfaces.",
        "",
    ])

    return "\n".join(lines)


def generate_verification_checklist(surfaces, raw_data):
    """Generate verification-checklist.md."""
    # Count unique phases
    phases = set()
    for s in surfaces:
        p = s.get("definedInPhase", "")
        if p and p != "unknown":
            phases.add(p)
        for ep in s.get("extendedByPhases", []):
            phases.add(ep)

    # Count requirements
    all_reqs = set()
    for s in surfaces:
        all_reqs.update(s.get("requirements", []))

    # Phase coverage
    expected_phases = [
        "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9",
        "2A.1", "2A.2", "2A.3", "2A.4", "2A.5", "2A.6",
        "2B.1", "2B.2", "2B.3", "2B.4", "2B.5", "2B.6", "2B.7", "2B.8",
        "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8",
        "4.1", "4.2", "4.3", "4.4", "4.5", "4.6",
        "5.1", "5.2", "5.3", "5.4",
        "6.1", "6.2", "6.3", "6.4",
        "7.1", "7.2", "7.3", "7.4", "7.5", "7.6"
    ]

    lines = [
        "# PVS-Core Design Inventory Verification Checklist",
        "",
        f"**Generated:** {date.today()}",
        "",
        "---",
        "",
        "## Coverage Summary",
        "",
        f"- **Total canonical surfaces:** {len(surfaces)}",
        f"- **Surfaces from user stories:** {len([s for s in surfaces if not s.get('isGap')])}",
        f"- **Gap surfaces (need user stories):** {len([s for s in surfaces if s.get('isGap')])}",
        f"- **Unique requirement IDs captured:** {len(all_reqs)}",
        f"- **Phases represented:** {len(phases)}",
        "",
        "---",
        "",
        "## Phase Coverage",
        "",
        "Every sub-phase from the roadmap should map to at least one surface.",
        "",
        "| Phase | Surfaces | Status |",
        "|-------|----------|--------|",
    ]

    for phase in expected_phases:
        phase_surfs = [s for s in surfaces
                       if s.get("definedInPhase") == phase
                       or phase in s.get("extendedByPhases", [])]
        count = len(phase_surfs)
        status = "Covered" if count > 0 else "MISSING"
        names = ", ".join([s["name"][:40] for s in phase_surfs[:3]])
        if count > 3:
            names += f" (+{count - 3} more)"
        lines.append(f"| {phase} | {count}: {names} | {status} |")

    # Missing phases
    missing_phases = [p for p in expected_phases if not any(
        s.get("definedInPhase") == p or p in s.get("extendedByPhases", [])
        for s in surfaces
    )]

    lines.extend([
        "",
        f"**Missing phases:** {len(missing_phases)}",
    ])
    if missing_phases:
        for mp in missing_phases:
            lines.append(f"- Phase {mp}: No surface found")

    lines.extend([
        "",
        "---",
        "",
        "## Cross-Reference Integrity",
        "",
        "Every surface that claims extension by another phase should have that phase's surface data merged.",
        "",
        "| Surface | Extensions | Verified |",
        "|---------|------------|----------|",
    ])

    for s in surfaces:
        if s.get("extendedByPhases"):
            ext = ", ".join(sorted(set(s["extendedByPhases"])))
            lines.append(f"| {s['name']} | {ext} | Auto-merged |")

    lines.extend([
        "",
        "---",
        "",
        "## Role Distribution",
        "",
        "| Role | Count | % |",
        "|------|-------|---|",
    ])
    role_counts = {}
    for s in surfaces:
        r = s["primaryRole"]
        role_counts[r] = role_counts.get(r, 0) + 1
    for role in ["MFA", "Doctor", "Admin"]:
        count = role_counts.get(role, 0)
        pct = round(count / len(surfaces) * 100, 1)
        lines.append(f"| {role} | {count} | {pct}% |")

    lines.extend([
        "",
        "---",
        "",
        "## Tier Distribution",
        "",
        "| Tier | Count | Description |",
        "|------|-------|-------------|",
    ])
    tier_counts = {}
    for s in surfaces:
        t = s["designPriority"]["tier"]
        tier_counts[t] = tier_counts.get(t, 0) + 1
    for t in sorted(tier_counts.keys()):
        lines.append(f"| {t} | {tier_counts[t]} | {TIER_DESCRIPTIONS.get(t, '').split('.')[0]} |")

    lines.extend([
        "",
        "---",
        "",
        "## Open Items",
        "",
        "### User Stories Needed",
        "",
        "1. **Phase 1.NEW**: Waiting Room Board (patient flow, color-coded status)",
        "2. **Phase 2.NEW**: Clinical Note Editor + Text Module Library (RTF, templates)",
        "3. **Phase 2.NEW**: GDT Device Data Review (ECG, spirometry, ultrasound import)",
        "4. **Phase 7.7**: MVZ Dashboard (multi-location KPIs, traffic-light drill-down)",
        "",
        "### Scope Reconciliation",
        "",
        "- Phase 7.6: Roadmap says ~12 requirements, user stories reference ~21. Needs reconciliation.",
        "",
        "### Design System Decisions Needed",
        "",
        "- Specialty-adaptive workspace approach (configurable panel zone vs. separate screens)",
        "- Component library scope (shared across tiers vs. per-tier)",
        "- Navigation/flow map connecting screens across modules (not yet created)",
        "",
    ])

    return "\n".join(lines)


def main():
    with open(INPUT, "r") as f:
        data = json.load(f)

    surfaces = data["surfaces"]

    # ── Step 1: Compute complexity scores ──
    for s in surfaces:
        s["complexity"] = compute_complexity(s)

    # ── Step 2: Assign design tiers ──
    for s in surfaces:
        tier, reason = assign_tier(s)
        s["designPriority"] = {"tier": tier, "reason": reason}

    # ── Step 3: Generate all deliverables ──
    # JSON files
    inventory_json = generate_inventory_json(surfaces)
    with open(OUTPUT_DIR / "master-screen-inventory.json", "w") as f:
        json.dump(inventory_json, f, indent=2, ensure_ascii=False)

    roadmap_json = generate_roadmap_json(surfaces)
    with open(OUTPUT_DIR / "design-roadmap.json", "w") as f:
        json.dump(roadmap_json, f, indent=2, ensure_ascii=False)

    # Markdown files
    inventory_md = generate_inventory_md(surfaces)
    with open(OUTPUT_DIR / "master-screen-inventory.md", "w") as f:
        f.write(inventory_md)

    roadmap_md = generate_roadmap_md(surfaces)
    with open(OUTPUT_DIR / "design-roadmap.md", "w") as f:
        f.write(roadmap_md)

    gap_report = generate_gap_report(surfaces)
    with open(OUTPUT_DIR / "gap-report.md", "w") as f:
        f.write(gap_report)

    verification = generate_verification_checklist(surfaces, data)
    with open(OUTPUT_DIR / "verification-checklist.md", "w") as f:
        f.write(verification)

    # ── Summary ──
    tier_counts = {}
    for s in surfaces:
        t = s["designPriority"]["tier"]
        tier_counts[t] = tier_counts.get(t, 0) + 1

    print("=== DELIVERABLES GENERATED ===")
    print(f"Total surfaces: {len(surfaces)}")
    print(f"\nTier distribution:")
    for t in sorted(tier_counts.keys()):
        print(f"  Tier {t}: {tier_counts[t]} surfaces")
    print(f"\nFiles written:")
    for f in ["master-screen-inventory.md", "master-screen-inventory.json",
              "design-roadmap.md", "design-roadmap.json",
              "gap-report.md", "verification-checklist.md"]:
        path = OUTPUT_DIR / f
        size = path.stat().st_size
        print(f"  {f}: {size:,} bytes")


if __name__ == "__main__":
    main()
