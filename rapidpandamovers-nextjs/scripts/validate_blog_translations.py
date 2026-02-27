#!/usr/bin/env python3
"""
Validate Spanish blog translations and fix known issues.

Steps:
1. Verify all English posts have a matching Spanish translation (by ID)
2. Fix service_link and location_link fields (restore from English source)
3. Check slug uniqueness (fix duplicates by appending -2, -3, etc.)
4. Validate frontmatter integrity (required fields, matching IDs)
5. Build content/blog/es/index.json
"""

import os
import re
import json
import sys
from pathlib import Path

BLOG_EN = Path("content/blog/en")
BLOG_ES = Path("content/blog/es")

REQUIRED_FIELDS = ["id", "title", "slug", "date", "category"]

def parse_frontmatter(filepath):
    """Parse YAML frontmatter from a markdown file."""
    text = filepath.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None, text

    end = text.index("---", 3)
    fm_text = text[3:end].strip()
    body = text[end + 3:].strip()

    # Simple YAML parser for flat fields + arrays
    data = {}
    current_key = None
    current_list = None

    for line in fm_text.split("\n"):
        # Array item
        if line.startswith("  - ") and current_key:
            val = line[4:].strip().strip('"').strip("'")
            if current_list is None:
                current_list = []
            current_list.append(val)
            data[current_key] = current_list
            continue

        # Key: value
        match = re.match(r'^(\w[\w_]*)\s*:\s*(.*)', line)
        if match:
            current_key = match.group(1)
            current_list = None
            val = match.group(2).strip().strip('"').strip("'")
            if val == "null" or val == "":
                data[current_key] = None
            elif val == "true":
                data[current_key] = True
            elif val == "false":
                data[current_key] = False
            elif val == "":
                data[current_key] = None
            else:
                # Try int
                try:
                    data[current_key] = int(val)
                except ValueError:
                    data[current_key] = val

    return data, body


def rebuild_frontmatter(data, body):
    """Rebuild a markdown file from frontmatter dict and body."""
    lines = ["---"]

    # Order fields consistently
    field_order = [
        "id", "title", "slug", "excerpt", "date", "updated",
        "readTime", "category", "image_folder", "featured",
        "image_keywords", "images", "service_link", "location_link",
        "status", "needs_ai_image"
    ]

    for key in field_order:
        if key not in data:
            continue
        val = data[key]

        if isinstance(val, list):
            lines.append(f"{key}:")
            for item in val:
                lines.append(f'  - "{item}"')
        elif val is None:
            lines.append(f"{key}: null")
        elif isinstance(val, bool):
            lines.append(f"{key}: {'true' if val else 'false'}")
        elif isinstance(val, int):
            lines.append(f"{key}: {val}")
        else:
            # Quote strings that contain special chars
            val_str = str(val)
            if any(c in val_str for c in [':', '#', '"', "'", '[', ']', '{', '}', ',', '&', '*', '?', '|', '-', '<', '>', '=', '!', '%', '@', '`']):
                # Escape inner quotes
                val_str = val_str.replace('"', '\\"')
                lines.append(f'{key}: "{val_str}"')
            else:
                lines.append(f'{key}: "{val_str}"')

    # Add any extra keys not in field_order
    for key, val in data.items():
        if key not in field_order:
            if val is None:
                lines.append(f"{key}: null")
            elif isinstance(val, bool):
                lines.append(f"{key}: {'true' if val else 'false'}")
            elif isinstance(val, int):
                lines.append(f"{key}: {val}")
            else:
                lines.append(f'{key}: "{val}"')

    lines.append("---")
    lines.append("")

    return "\n".join(lines) + body + "\n"


def get_id_from_filename(filename):
    """Extract numeric ID from filename like 0001-some-slug.md."""
    match = re.match(r'^(\d{4})-', filename)
    if match:
        return int(match.group(1))
    return None


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("=== DRY RUN MODE ===\n")

    # --- Step 1: Build English lookup by ID ---
    print("Step 1: Loading English posts...")
    en_posts = {}
    for f in sorted(BLOG_EN.glob("*.md")):
        pid = get_id_from_filename(f.name)
        if pid is None:
            continue
        data, body = parse_frontmatter(f)
        if data:
            en_posts[pid] = {"file": f, "data": data, "body": body}

    print(f"  Loaded {len(en_posts)} English posts")

    # --- Step 2: Load Spanish posts ---
    print("\nStep 2: Loading Spanish posts...")
    es_posts = {}
    es_files = sorted(BLOG_ES.glob("*.md"))

    for f in es_files:
        pid = get_id_from_filename(f.name)
        if pid is None:
            continue
        data, body = parse_frontmatter(f)
        if data:
            es_posts[pid] = {"file": f, "data": data, "body": body}

    print(f"  Loaded {len(es_posts)} Spanish posts")

    # --- Step 3: Check for missing translations ---
    print("\nStep 3: Checking for missing translations...")
    missing = set(en_posts.keys()) - set(es_posts.keys())
    if missing:
        print(f"  WARNING: {len(missing)} English posts have no Spanish translation:")
        for pid in sorted(missing):
            print(f"    ID {pid}: {en_posts[pid]['file'].name}")
    else:
        print("  All English posts have Spanish translations!")

    # --- Step 4: Fix service_link and location_link ---
    print("\nStep 4: Fixing service_link and location_link...")
    fixed_service = 0
    fixed_location = 0

    for pid, es in es_posts.items():
        if pid not in en_posts:
            continue

        en_data = en_posts[pid]["data"]
        es_data = es["data"]
        changed = False

        # Fix service_link
        en_sl = en_data.get("service_link")
        es_sl = es_data.get("service_link")
        if en_sl != es_sl:
            es_data["service_link"] = en_sl
            fixed_service += 1
            changed = True

        # Fix location_link
        en_ll = en_data.get("location_link")
        es_ll = es_data.get("location_link")
        if en_ll != es_ll:
            es_data["location_link"] = en_ll
            fixed_location += 1
            changed = True

        if changed and not dry_run:
            # Re-read the file and do targeted replacement instead of full rebuild
            content = es["file"].read_text(encoding="utf-8")

            # Replace service_link line
            if en_sl is None:
                new_sl_line = "service_link: null"
            else:
                new_sl_line = f'service_link: "{en_sl}"'
            content = re.sub(r'^service_link:.*$', new_sl_line, content, flags=re.MULTILINE)

            # Replace location_link line
            if en_ll is None:
                new_ll_line = "location_link: null"
            else:
                new_ll_line = f'location_link: "{en_ll}"'
            content = re.sub(r'^location_link:.*$', new_ll_line, content, flags=re.MULTILINE)

            es["file"].write_text(content, encoding="utf-8")

    print(f"  Fixed service_link in {fixed_service} posts")
    print(f"  Fixed location_link in {fixed_location} posts")

    # --- Step 5: Check slug uniqueness ---
    print("\nStep 5: Checking slug uniqueness...")
    slug_to_ids = {}
    for pid, es in es_posts.items():
        slug = es["data"].get("slug", "")
        if slug not in slug_to_ids:
            slug_to_ids[slug] = []
        slug_to_ids[slug].append(pid)

    duplicates = {slug: ids for slug, ids in slug_to_ids.items() if len(ids) > 1}
    if duplicates:
        print(f"  Found {len(duplicates)} duplicate slugs:")
        for slug, ids in duplicates.items():
            print(f"    '{slug}' used by IDs: {ids}")
            # Fix: append -2, -3 etc to duplicates (keep first, fix rest)
            ids_sorted = sorted(ids)
            for i, pid in enumerate(ids_sorted[1:], 2):
                new_slug = f"{slug}-{i}"
                es_posts[pid]["data"]["slug"] = new_slug
                if not dry_run:
                    content = es_posts[pid]["file"].read_text(encoding="utf-8")
                    content = re.sub(
                        r'^slug:.*$',
                        f'slug: "{new_slug}"',
                        content,
                        count=1,
                        flags=re.MULTILINE
                    )
                    # Also rename file
                    old_file = es_posts[pid]["file"]
                    new_filename = re.sub(r'^\d{4}-', f'{pid:04d}-', f'{pid:04d}-{new_slug}.md')
                    new_file = old_file.parent / new_filename
                    old_file.write_text(content, encoding="utf-8")
                    if old_file != new_file:
                        old_file.rename(new_file)
                        es_posts[pid]["file"] = new_file
                print(f"      ID {pid}: slug changed to '{new_slug}'")
    else:
        print("  All slugs are unique!")

    # --- Step 6: Validate frontmatter integrity ---
    print("\nStep 6: Validating frontmatter integrity...")
    issues = []

    for pid, es in es_posts.items():
        data = es["data"]
        fname = es["file"].name

        # Check required fields
        for field in REQUIRED_FIELDS:
            if not data.get(field):
                issues.append(f"  {fname}: missing required field '{field}'")

        # Check ID matches filename
        file_id = get_id_from_filename(fname)
        if file_id and data.get("id") != file_id:
            issues.append(f"  {fname}: ID mismatch (frontmatter={data.get('id')}, filename={file_id})")

        # Check image_folder matches English (should never be translated)
        if pid in en_posts:
            en_if = en_posts[pid]["data"].get("image_folder")
            es_if = data.get("image_folder")
            if en_if != es_if:
                issues.append(f"  {fname}: image_folder mismatch (expected={en_if}, got={es_if})")

    if issues:
        print(f"  Found {len(issues)} issues:")
        for issue in issues[:20]:
            print(issue)
        if len(issues) > 20:
            print(f"  ... and {len(issues) - 20} more")
    else:
        print("  All posts have valid frontmatter!")

    # --- Step 7: Build index.json ---
    print("\nStep 7: Building index.json...")

    # Re-read Spanish posts to get the fixed data
    index = []
    for pid in sorted(es_posts.keys()):
        es = es_posts[pid]
        data = es["data"]
        index.append({
            "id": data.get("id", pid),
            "title": data.get("title", ""),
            "slug": data.get("slug", ""),
            "date": data.get("date", ""),
            "category": data.get("category", ""),
        })

    index_path = BLOG_ES / "index.json"
    if not dry_run:
        index_path.write_text(
            json.dumps(index, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8"
        )
        print(f"  Written {len(index)} entries to {index_path}")
    else:
        print(f"  Would write {len(index)} entries to {index_path}")

    # --- Summary ---
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"English posts:        {len(en_posts)}")
    print(f"Spanish posts:        {len(es_posts)}")
    print(f"Missing translations: {len(missing)}")
    print(f"Fixed service_link:   {fixed_service}")
    print(f"Fixed location_link:  {fixed_location}")
    print(f"Duplicate slugs:      {len(duplicates)}")
    print(f"Frontmatter issues:   {len(issues)}")
    print(f"Index entries:        {len(index)}")

    if dry_run:
        print("\n[DRY RUN - no files were modified]")

    return 0 if (len(missing) == 0 and len(issues) == 0) else 1


if __name__ == "__main__":
    main()
