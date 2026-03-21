#!/usr/bin/env python3
"""Extract UI Surface Maps from all user story files into structured JSON."""

import os
import re
import json
from pathlib import Path

USER_STORIES_DIR = Path("/Users/gary/Desktop/requirement-documents/docs/user-stories")
OUTPUT_FILE = Path("/Users/gary/Desktop/requirement-documents/docs/design-inventory/raw-extraction.json")


def parse_markdown_table(lines, start_idx):
    """Parse a markdown table starting at start_idx. Returns list of dicts."""
    rows = []
    if start_idx >= len(lines):
        return rows

    # Find header row
    header_line = lines[start_idx].strip()
    if not header_line.startswith("|"):
        return rows

    headers = [h.strip().strip("*").strip() for h in header_line.split("|")[1:-1]]
    headers = [h for h in headers if h]

    # Skip separator row
    sep_idx = start_idx + 1
    if sep_idx >= len(lines) or not re.match(r'\|[\s\-|]+\|', lines[sep_idx]):
        return rows

    # Parse data rows
    for i in range(sep_idx + 1, len(lines)):
        line = lines[i].strip()
        if not line.startswith("|"):
            break
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if len(cells) >= len(headers):
            row = {}
            for j, h in enumerate(headers):
                row[h] = cells[j] if j < len(cells) else ""
            rows.append(row)

    return rows


def extract_req_ids(content):
    """Extract requirement IDs from file content."""
    req_ids = set()
    # Pattern: X.Y.Z or X.Y.Z.W (with optional letter suffix)
    for m in re.finditer(r'\b(\d+\.\d+\.\d+(?:\.\d+)?[a-z]?)\b', content):
        candidate = m.group(1)
        # Filter out things that look like version numbers or dates
        parts = candidate.split(".")
        if len(parts) >= 3 and int(parts[0]) <= 10:
            req_ids.add(candidate)
    # Pattern: REQ-X.Y-*
    for m in re.finditer(r'(REQ-\d+\.\d+[-\w]*)', content):
        req_ids.add(m.group(1))
    # Pattern: PVSC-*
    for m in re.finditer(r'(PVSC-\d+)', content):
        req_ids.add(m.group(1))
    return sorted(list(req_ids))


def classify_surface_type(description):
    """Determine surface type from description text."""
    desc_lower = description.lower()
    if "extends" in desc_lower or "extension" in desc_lower:
        return "extension"
    if "modal" in desc_lower or "dialog" in desc_lower:
        return "modal"
    if "panel" in desc_lower and "within" in desc_lower:
        return "panel"
    if "overlay" in desc_lower or "popup" in desc_lower:
        return "overlay"
    if "panel" in desc_lower:
        return "panel"
    return "primary"


def extract_phase_from_filename(filename):
    """Extract phase number from filename like phase-7.1-name.md or phase-2A.1-name.md"""
    m = re.match(r'phase-(\d+[A-Za-z]?\.\d+)', filename)
    if m:
        return m.group(1)
    return "unknown"


def extract_phase_name(content, filename):
    """Extract phase name from file content (usually first H1 or H2)."""
    for line in content.split("\n")[:10]:
        line = line.strip()
        if line.startswith("# "):
            name = line[2:].strip()
            # Remove phase number prefix if present
            name = re.sub(r'^Phase\s+\d+\.\d+[:\s\-]*', '', name, flags=re.IGNORECASE)
            return name
    # Fallback: derive from filename
    name = filename.replace("phase-", "").replace(".md", "")
    name = re.sub(r'^\d+\.\d+-', '', name)
    return name.replace("-", " ").title()


def parse_file(filepath):
    """Parse a single user story file and extract UI Surface Map data."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")
    filename = os.path.basename(filepath)
    phase = extract_phase_from_filename(filename)
    phase_name = extract_phase_name(content, filename)

    surfaces = []
    states = []
    components = []

    # Find sections
    i = 0
    current_section = None
    while i < len(lines):
        line = lines[i].strip()

        # Detect section headers
        if re.match(r'^#{2,4}\s+Surfaces\b', line):
            current_section = "surfaces"
        elif re.match(r'^#{2,4}\s+States\b', line):
            current_section = "states"
        elif re.match(r'^#{2,4}\s+Components?\b', line):
            current_section = "components"
        elif re.match(r'^#{1,3}\s+', line) and current_section and "surface" not in line.lower() and "state" not in line.lower() and "component" not in line.lower():
            # New major section, reset
            if not any(kw in line.lower() for kw in ["surface", "state", "component", "ui", "map"]):
                current_section = None

        # Parse tables in current section
        if line.startswith("|") and current_section:
            # Check if this is a header row (next line should be separator)
            if i + 1 < len(lines) and re.match(r'\|[\s\-|]+\|', lines[i + 1].strip()):
                table_rows = parse_markdown_table(lines, i)
                if current_section == "surfaces":
                    for row in table_rows:
                        # Handle various column name patterns
                        name = row.get("Surface", row.get("surface", row.get("Name", "")))
                        # Clean bold markers
                        name = re.sub(r'\*\*([^*]+)\*\*', r'\1', name).strip()
                        desc = row.get("Description", row.get("description", ""))
                        desc = re.sub(r'\*\*([^*]+)\*\*', r'\1', desc).strip()
                        caps = row.get("Key Capabilities", row.get("Capabilities", ""))
                        caps = re.sub(r'\*\*([^*]+)\*\*', r'\1', caps).strip()
                        if name and name != "#":
                            surfaces.append({
                                "name": name,
                                "description": desc,
                                "capabilities": caps,
                                "type": classify_surface_type(desc)
                            })
                elif current_section == "states":
                    for row in table_rows:
                        state_name = row.get("State", row.get("state", row.get("Name", "")))
                        state_name = re.sub(r'\*\*([^*]+)\*\*', r'\1', state_name).strip()
                        surface = row.get("Surface", row.get("surface", ""))
                        surface = re.sub(r'\*\*([^*]+)\*\*', r'\1', surface).strip()
                        trigger = row.get("Trigger", row.get("trigger", row.get("Condition", "")))
                        trigger = re.sub(r'\*\*([^*]+)\*\*', r'\1', trigger).strip()
                        changes = row.get("What Changes on Screen", row.get("Changes", ""))
                        changes = re.sub(r'\*\*([^*]+)\*\*', r'\1', changes).strip()
                        caps = row.get("Key Capabilities", "")
                        caps = re.sub(r'\*\*([^*]+)\*\*', r'\1', caps).strip()
                        if state_name:
                            states.append({
                                "surface": surface,
                                "name": state_name,
                                "trigger": trigger,
                                "changes": changes,
                                "capabilities": caps
                            })
                elif current_section == "components":
                    for row in table_rows:
                        comp_name = row.get("Component", row.get("component", row.get("Name", "")))
                        comp_name = re.sub(r'\*\*([^*]+)\*\*', r'\1', comp_name).strip()
                        location = row.get("Location", row.get("Surface", row.get("location", "")))
                        location = re.sub(r'\*\*([^*]+)\*\*', r'\1', location).strip()
                        desc = row.get("Description", row.get("description", row.get("Purpose", "")))
                        desc = re.sub(r'\*\*([^*]+)\*\*', r'\1', desc).strip()
                        caps = row.get("Key Capabilities", "")
                        caps = re.sub(r'\*\*([^*]+)\*\*', r'\1', caps).strip()
                        if comp_name:
                            components.append({
                                "surface": location,
                                "name": comp_name,
                                "description": desc,
                                "capabilities": caps
                            })

                # Skip past the parsed table
                skip = 2 + len(table_rows)
                i += skip
                continue

        i += 1

    req_ids = extract_req_ids(content)

    return {
        "sourceFile": filename,
        "phase": phase,
        "phaseName": phase_name,
        "surfaces": surfaces,
        "states": states,
        "components": components,
        "requirements": req_ids
    }


def main():
    files = sorted([f for f in os.listdir(USER_STORIES_DIR) if f.endswith(".md")])
    print(f"Found {len(files)} user story files")

    entries = []
    total_surfaces = 0
    total_states = 0
    total_components = 0
    total_reqs = 0

    for f in files:
        filepath = USER_STORIES_DIR / f
        entry = parse_file(filepath)
        entries.append(entry)
        ns = len(entry["surfaces"])
        nst = len(entry["states"])
        nc = len(entry["components"])
        nr = len(entry["requirements"])
        total_surfaces += ns
        total_states += nst
        total_components += nc
        total_reqs += nr
        print(f"  {f}: {ns} surfaces, {nst} states, {nc} components, {nr} reqs")

    result = {
        "extractedAt": "2026-03-17",
        "sourceFiles": len(files),
        "totalSurfaces": total_surfaces,
        "totalStates": total_states,
        "totalComponents": total_components,
        "totalRequirements": total_reqs,
        "entries": entries
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n=== EXTRACTION COMPLETE ===")
    print(f"Files parsed: {len(files)}")
    print(f"Total surfaces: {total_surfaces}")
    print(f"Total states: {total_states}")
    print(f"Total components: {total_components}")
    print(f"Total requirement IDs: {total_reqs}")
    print(f"Output written to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
