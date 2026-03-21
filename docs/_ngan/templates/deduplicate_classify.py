#!/usr/bin/env python3
"""
Phase 2: Deduplicate raw surfaces into canonical screens and classify by role + workflow.

Rules:
- Extensions merge into their parent surface (e.g., "Patient Record View" extended by phases 2A, 4, 5, 6)
- Surfaces with same name across files are the same canonical surface
- 4 gap surfaces added per plan decisions
- Each surface gets: primaryRole, secondaryRoles, workflow category
"""

import json
import re
from pathlib import Path

INPUT = Path("/Users/gary/Desktop/requirement-documents/docs/design-inventory/raw-extraction.json")
OUTPUT = Path("/Users/gary/Desktop/requirement-documents/docs/design-inventory/canonical-surfaces.json")

# ── Workflow Classification Rules ──
# Maps surface name patterns to workflow categories
WORKFLOW_RULES = {
    "Patient Check-In & Registration": [
        r"card read", r"check-in", r"egk", r"patient entry", r"manual.*entry",
        r"ersatzverfahren", r"european health", r"ehic", r"waiting room"
    ],
    "Insurance & Enrollment (HZV/FAV)": [
        r"te form", r"te overview", r"enrollment", r"participation.*management",
        r"ptv import", r"import.*wizard"
    ],
    "Clinical Documentation": [
        r"patient record", r"diagnosis", r"diagnos", r"dauerdiagnos",
        r"clinical note", r"patient match", r"patient timeline"
    ],
    "Service & Billing Documentation": [
        r"schein", r"billing record", r"service.*entry", r"service.*code",
        r"gnr", r"ops.*code", r"procedure", r"billing justification",
        r"genetic testing", r"psychotherapy", r"ebm", r"quarter.*transition"
    ],
    "Prescriptions": [
        r"prescription", r"e-rezept", r"erezept", r"drug.*search", r"medication",
        r"heilmittel", r"hilfsmittel", r"diga", r"digital health app",
        r"bmp", r"medication plan", r"dosage", r"interaction",
        r"red hand letter", r"hilfsmittelverzeichnis", r"diga.*directory"
    ],
    "Forms & Certificates": [
        r"bfb", r"form.*print", r"eau", r"sick leave", r"arztbrief",
        r"doctor letter", r"letter.*composer"
    ],
    "Chronic Care Programs": [
        r"edmp", r"dmp", r"ehks", r"documentation form", r"scoring calculator",
        r"audit trail"
    ],
    "Billing & Submission": [
        r"billing dashboard", r"billing.*file", r"kv.*billing", r"asv.*billing",
        r"asv.*team", r"receipt", r"proficiency", r"laboratory",
        r"hzv.*billing", r"fav.*billing", r"submission(?!.*edmp)", r"validation.*prerequisite",
        r"correction", r"special case", r"conflict.*review", r"transmission.*protocol",
        r"post-submission"
    ],
    "Data Import & Sync": [
        r"ptv import", r"icode", r"data.*sync", r"gdt.*device",
        r"import.*protocol"
    ],
    "ePA & Document Exchange": [
        r"epa", r"electronic patient record", r"document.*browser",
        r"upload.*dialog"
    ],
    "Practice Administration": [
        r"practice.*admin", r"user.*management", r"user.*rights",
        r"location", r"specialty.*config", r"mvz.*dashboard",
        r"system.*status"
    ],
    "System Infrastructure": [
        r"ti.*connector", r"master.*data", r"fee.*schedule",
        r"module.*management", r"compliance", r"validation.*crypto",
        r"contract.*management", r"coding.*instruction", r"coding.*rule",
        r"rule.*setting", r"physician.*identity", r"contract.*document"
    ]
}

# ── Role Classification Rules ──
ROLE_RULES = {
    "MFA": [
        r"card read", r"check-in", r"egk", r"manual.*entry", r"ersatzverfahren",
        r"ehic", r"european health", r"te form", r"te overview", r"enrollment",
        r"participation", r"waiting room", r"patient match", r"receipt",
        r"form.*print", r"bfb", r"quarter.*transition", r"import.*wizard",
        r"ptv import"
    ],
    "Doctor": [
        r"patient record", r"diagnosis", r"diagnos", r"service.*entry",
        r"prescription", r"e-rezept", r"erezept", r"drug", r"medication",
        r"heilmittel", r"hilfsmittel", r"diga", r"bmp", r"eau", r"sick leave",
        r"arztbrief", r"doctor letter", r"edmp", r"dmp", r"ehks",
        r"scoring", r"clinical note", r"schein", r"billing record",
        r"billing justification", r"genetic testing", r"psychotherapy",
        r"epa", r"gnr", r"ops", r"procedure", r"gdt.*device",
        r"interaction", r"dosage"
    ],
    "Admin": [
        r"practice.*admin", r"user.*management", r"user.*rights",
        r"system.*status", r"ti.*connector", r"master.*data", r"fee.*schedule",
        r"module.*management", r"compliance", r"validation.*crypto",
        r"contract.*management", r"mvz.*dashboard", r"specialty.*config",
        r"asv.*team", r"coding.*instruction", r"coding.*rule", r"rule.*setting",
        r"proficiency", r"laboratory", r"physician.*identity", r"contract.*document"
    ]
}

# ── Extension Detection ──
# Maps extension surface names to their canonical parent
EXTENSION_MAPPINGS = {
    # Patient Record View extensions
    "Diagnosis Entry Panel": "Patient Record View",
    "Diagnosis Timeline": "Patient Record View",
    "Dauerdiagnosen Management Panel": "Patient Record View",
    # Schein View extensions
    "Service Entry Panel": "Schein / Billing Record View",
    "Billing Justification Panel": "Schein / Billing Record View",
    "Genetic Testing Documentation Panel": "Schein / Billing Record View",
    "OPS Code Entry Panel": "Schein / Billing Record View",
    "Psychotherapy Documentation Panel": "Schein / Billing Record View",
}

# ── Gap Surfaces (from plan decisions) ──
GAP_SURFACES = [
    {
        "id": "gap-waiting-room",
        "name": "Waiting Room Board",
        "description": "Patient flow visibility board showing color-coded status for each patient (waiting, in treatment, ready to leave). Real-time updates. Displayed on reception screen.",
        "definedInPhase": "1.NEW",
        "extendedByPhases": [],
        "primaryRole": "MFA",
        "secondaryRoles": ["Doctor"],
        "workflow": "Patient Check-In & Registration",
        "states": [
            {"name": "Active Day View", "trigger": "Default on login", "changes": "Shows today's patient queue"},
            {"name": "Empty State", "trigger": "No patients checked in", "changes": "Placeholder encouraging check-in"},
            {"name": "High Volume", "trigger": ">15 patients waiting", "changes": "Compact view, overflow scroll"}
        ],
        "components": [
            {"name": "Patient Queue Card", "description": "Individual patient status with color indicator"},
            {"name": "Wait Time Display", "description": "Elapsed time since check-in"},
            {"name": "Status Filter Tabs", "description": "Filter by: All / Waiting / In Treatment / Done"}
        ],
        "requirements": [],
        "isGap": True,
        "gapReason": "Referenced in product context. Every practice needs patient flow visibility from day one."
    },
    {
        "id": "gap-clinical-note-editor",
        "name": "Clinical Note Editor",
        "description": "Rich text editor for clinical documentation with text module library. Supports templates, placeholder auto-population (patient name, date, diagnosis), and structured note formats. Embedded within Patient Record View.",
        "definedInPhase": "2.NEW",
        "extendedByPhases": [],
        "primaryRole": "Doctor",
        "secondaryRoles": [],
        "workflow": "Clinical Documentation",
        "states": [
            {"name": "New Note", "trigger": "User creates note", "changes": "Blank editor with template picker"},
            {"name": "Editing", "trigger": "Note opened for editing", "changes": "Rich text toolbar, auto-save indicator"},
            {"name": "Template Browser", "trigger": "User opens text module library", "changes": "Sidebar with categorized templates"},
            {"name": "Read-Only", "trigger": "Signed/finalized note", "changes": "Editing disabled, signature stamp visible"}
        ],
        "components": [
            {"name": "Rich Text Toolbar", "description": "Formatting controls (bold, italic, lists, tables)"},
            {"name": "Text Module Library", "description": "Categorized reusable text blocks with search"},
            {"name": "Placeholder Engine", "description": "Auto-populates patient demographics, date, diagnosis"},
            {"name": "Note History", "description": "Version history with diff view"}
        ],
        "requirements": [],
        "isGap": True,
        "gapReason": "In scope for rich text editing. Clinical documentation needs a dedicated editor surface."
    },
    {
        "id": "gap-gdt-device-review",
        "name": "GDT Device Data Review Surface",
        "description": "Review and accept imported device data (ECG, spirometry, ultrasound) from GDT-connected medical devices. Shows raw data visualization, allows physician annotation, and links results to patient record.",
        "definedInPhase": "2.NEW",
        "extendedByPhases": [],
        "primaryRole": "Doctor",
        "secondaryRoles": ["MFA"],
        "workflow": "Clinical Documentation",
        "states": [
            {"name": "Pending Import", "trigger": "Device sends data via GDT", "changes": "New import notification, preview available"},
            {"name": "Review Mode", "trigger": "Physician opens import", "changes": "Full data visualization (ECG trace, spirometry curve)"},
            {"name": "Annotated", "trigger": "Physician adds findings", "changes": "Annotation overlay on data, structured findings form"},
            {"name": "Accepted", "trigger": "Physician confirms", "changes": "Data linked to patient record, timestamp"}
        ],
        "components": [
            {"name": "Device Data Viewer", "description": "Renders ECG traces, spirometry curves, ultrasound thumbnails"},
            {"name": "Annotation Panel", "description": "Structured findings entry with free text"},
            {"name": "Import Queue", "description": "List of pending device imports with patient matching"}
        ],
        "requirements": [],
        "isGap": True,
        "gapReason": "GDT device integration needs a data review surface for physician sign-off."
    },
    {
        "id": "gap-mvz-dashboard",
        "name": "MVZ Dashboard",
        "description": "Multi-location KPI dashboard for MVZ (Medizinische Versorgungszentren) administrators. Traffic-light drill-down by location, specialty, and practitioner. Shows billing volume, patient throughput, compliance status.",
        "definedInPhase": "7.7",
        "extendedByPhases": [],
        "primaryRole": "Admin",
        "secondaryRoles": [],
        "workflow": "Practice Administration",
        "states": [
            {"name": "Overview", "trigger": "Default view", "changes": "All locations with traffic-light KPI indicators"},
            {"name": "Location Drill-Down", "trigger": "Click on location", "changes": "Detailed KPIs for single location, specialty breakdown"},
            {"name": "Practitioner View", "trigger": "Click on practitioner", "changes": "Individual physician performance, billing, compliance"},
            {"name": "Alert State", "trigger": "KPI threshold breach", "changes": "Red indicators, action required items highlighted"}
        ],
        "components": [
            {"name": "Traffic Light KPI Grid", "description": "Color-coded performance indicators by metric"},
            {"name": "Location Selector", "description": "Multi-location navigation with search"},
            {"name": "Trend Charts", "description": "Time-series for key metrics (billing, patients, compliance)"},
            {"name": "Alert Panel", "description": "Actionable items requiring admin attention"}
        ],
        "requirements": [],
        "isGap": True,
        "gapReason": "New Phase 7.7. MVZ management needs aggregate visibility across locations."
    }
]


def normalize_name(name):
    """Normalize surface name for deduplication matching."""
    # Remove bold markers, extra whitespace
    name = re.sub(r'\*\*([^*]+)\*\*', r'\1', name)
    name = name.strip()
    # Strip "(from Phase X.Y)" suffix for dedup matching
    name = re.sub(r'\s*\(from Phase\s+\d+[A-Za-z]?\.\d+(?:\s*/\s*[^)]+)?\)', '', name)
    # Normalize whitespace around slashes: "Schein/Billing" -> "Schein / Billing"
    name = re.sub(r'\s*/\s*', ' / ', name)
    # Collapse multiple spaces
    name = re.sub(r'\s+', ' ', name)
    name = name.strip()
    return name


def match_pattern(name, patterns):
    """Check if name matches any regex pattern in the list."""
    name_lower = name.lower()
    for p in patterns:
        if re.search(p, name_lower):
            return True
    return False


# ── Explicit Overrides (name substring -> workflow/role) ──
# These take precedence over pattern-matching to handle cases where
# descriptions contain misleading keywords from other domains.
WORKFLOW_OVERRIDES = {
    "Practice Administration Panel": "Practice Administration",
    "TI Connector Status Panel": "System Infrastructure",
    "Module Management Panel": "System Infrastructure",
    "System Compliance Settings": "System Infrastructure",
    "HZV/FAV Submission Panel": "Billing & Submission",
    "HZV / FAV Submission Panel": "Billing & Submission",
    "Post-Submission Editor": "Billing & Submission",
    "Import Protocol View": "Data Import & Sync",
    "Patient Receipt Preview": "Billing & Submission",
    "Heilmittel Prescription Form": "Prescriptions",
    "Hilfsmittel Prescription Form": "Prescriptions",
    "DiGA Prescription Builder": "Prescriptions",
    "eAU Form": "Forms & Certificates",
    "eAU Print Preview": "Forms & Certificates",
    "Nursing Home Flat-Rate Documentation Panel": "Service & Billing Documentation",
    "eDMP Patient Overview": "Chronic Care Programs",
}

ROLE_OVERRIDES = {
    "TI Connector Status Panel": ("Admin", []),
    "Module Management Panel": ("Admin", []),
    "System Compliance Settings": ("Admin", []),
    "Practice Administration Panel": ("Admin", []),
    "Patient Receipt Preview": ("MFA", ["Doctor"]),
    "eDMP Patient Overview": ("MFA", ["Doctor"]),
}


def classify_workflow(name, description=""):
    """Assign workflow category based on surface name and description."""
    # Check explicit overrides first
    for override_name, workflow in WORKFLOW_OVERRIDES.items():
        if override_name.lower() in name.lower():
            return workflow

    combined = f"{name} {description}".lower()
    for workflow, patterns in WORKFLOW_RULES.items():
        for p in patterns:
            if re.search(p, combined):
                return workflow
    return "System Infrastructure"  # Default


def classify_roles(name, description=""):
    """Assign primary and secondary roles."""
    # Check explicit overrides first
    for override_name, (primary, secondary) in ROLE_OVERRIDES.items():
        if override_name.lower() in name.lower():
            return primary, secondary

    combined = f"{name} {description}".lower()
    matched_roles = []
    for role, patterns in ROLE_RULES.items():
        for p in patterns:
            if re.search(p, combined):
                matched_roles.append(role)
                break

    if not matched_roles:
        return "Doctor", []  # Default

    primary = matched_roles[0]
    secondary = [r for r in matched_roles[1:] if r != primary]
    return primary, secondary


def find_parent_surface(surface_name, description):
    """Check if this surface is an extension of another."""
    # Check explicit mapping
    if surface_name in EXTENSION_MAPPINGS:
        return EXTENSION_MAPPINGS[surface_name]

    # Check description for "extends" pattern
    desc_lower = description.lower()
    if "extends" in desc_lower or "extension" in desc_lower:
        # Try to extract parent name
        m = re.search(r'extends?\s+(?:the\s+)?(?:existing\s+)?(?:of\s+)?(.+?)(?:\s+from|\s+with|\s+by|\s*$)', desc_lower)
        if m:
            parent = m.group(1).strip().rstrip(".")
            return parent.title()

    return None


def main():
    with open(INPUT, "r") as f:
        raw = json.load(f)

    # ── Step 1: Build canonical surface map ──
    canonical = {}  # name -> surface data
    surface_id_counter = 0

    for entry in raw["entries"]:
        phase = entry["phase"]
        source_file = entry["sourceFile"]

        for surf in entry["surfaces"]:
            name = normalize_name(surf["name"])
            desc = surf.get("description", "")
            surf_type = surf.get("type", "primary")

            # Check if this is an extension of another surface
            parent = find_parent_surface(name, desc)

            if parent and parent in canonical:
                # Merge as extension
                canonical[parent]["extendedByPhases"].append(phase)
                canonical[parent]["extensionDetails"].append({
                    "phase": phase,
                    "sourceFile": source_file,
                    "extensionName": name,
                    "description": desc
                })
                # Add states and components from this extension
                for st in entry["states"]:
                    if st.get("surface", "").lower() in [name.lower(), parent.lower()] or not st.get("surface"):
                        canonical[parent]["states"].append({**st, "fromPhase": phase})
                for comp in entry["components"]:
                    if comp.get("surface", "").lower() in [name.lower(), parent.lower()] or not comp.get("surface"):
                        canonical[parent]["components"].append({**comp, "fromPhase": phase})
                # Add requirements
                canonical[parent]["requirements"].extend(entry["requirements"])
                continue

            if name in canonical:
                # Same surface referenced again (extended by another phase)
                canonical[name]["extendedByPhases"].append(phase)
                canonical[name]["extensionDetails"].append({
                    "phase": phase,
                    "sourceFile": source_file,
                    "extensionName": name,
                    "description": desc
                })
                for st in entry["states"]:
                    canonical[name]["states"].append({**st, "fromPhase": phase})
                for comp in entry["components"]:
                    canonical[name]["components"].append({**comp, "fromPhase": phase})
                canonical[name]["requirements"].extend(entry["requirements"])
            else:
                # New canonical surface
                surface_id_counter += 1
                sid = f"S{surface_id_counter:03d}"

                # Collect states and components for this surface
                surface_states = []
                for st in entry["states"]:
                    surface_states.append({**st, "fromPhase": phase})
                surface_components = []
                for comp in entry["components"]:
                    surface_components.append({**comp, "fromPhase": phase})

                primary_role, secondary_roles = classify_roles(name, desc)
                workflow = classify_workflow(name, desc)

                canonical[name] = {
                    "id": sid,
                    "name": name,
                    "description": desc,
                    "definedInPhase": phase,
                    "extendedByPhases": [],
                    "extensionDetails": [],
                    "primaryRole": primary_role,
                    "secondaryRoles": secondary_roles,
                    "workflow": workflow,
                    "states": surface_states,
                    "components": surface_components,
                    "requirements": list(entry["requirements"]),
                    "sourceFiles": [source_file],
                    "isGap": False
                }

    # ── Step 2: Add gap surfaces ──
    for gap in GAP_SURFACES:
        surface_id_counter += 1
        gap["id"] = f"S{surface_id_counter:03d}"
        gap["extensionDetails"] = []
        gap["sourceFiles"] = []
        canonical[gap["name"]] = gap

    # ── Step 3: Deduplicate requirements ──
    for name, surf in canonical.items():
        surf["requirements"] = sorted(list(set(surf["requirements"])))

    # ── Step 4: Summary stats ──
    total = len(canonical)
    by_role = {}
    by_workflow = {}
    for surf in canonical.values():
        r = surf["primaryRole"]
        by_role[r] = by_role.get(r, 0) + 1
        w = surf["workflow"]
        by_workflow[w] = by_workflow.get(w, 0) + 1

    gaps = sum(1 for s in canonical.values() if s.get("isGap"))
    extensions = sum(1 for s in canonical.values() if s.get("extendedByPhases"))

    result = {
        "generatedAt": "2026-03-17",
        "totalCanonicalSurfaces": total,
        "gapSurfaces": gaps,
        "surfacesWithExtensions": extensions,
        "byRole": by_role,
        "byWorkflow": by_workflow,
        "surfaces": list(canonical.values())
    }

    with open(OUTPUT, "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"=== DEDUPLICATION + CLASSIFICATION COMPLETE ===")
    print(f"Raw surfaces: {raw['totalSurfaces']}")
    print(f"Canonical surfaces: {total} (including {gaps} gap surfaces)")
    print(f"Surfaces with extensions: {extensions}")
    print(f"\nBy Role:")
    for r, c in sorted(by_role.items()):
        print(f"  {r}: {c}")
    print(f"\nBy Workflow:")
    for w, c in sorted(by_workflow.items()):
        print(f"  {w}: {c}")

    # Print all surface names for review
    print(f"\n=== ALL CANONICAL SURFACES ===")
    for surf in sorted(canonical.values(), key=lambda s: s["id"]):
        ext = f" (+{len(surf['extendedByPhases'])} phases)" if surf.get("extendedByPhases") else ""
        gap = " [GAP]" if surf.get("isGap") else ""
        print(f"  {surf['id']}: {surf['name']} [{surf['definedInPhase']}] -> {surf['primaryRole']} / {surf['workflow']}{ext}{gap}")


if __name__ == "__main__":
    main()
