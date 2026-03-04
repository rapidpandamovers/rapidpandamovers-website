#!/usr/bin/env python3
"""
Reorder blog post IDs to match chronological date order.

Posts 1270 and 1271 have dates from 2024-10-03/04 but are numbered 1270/1271,
placing them between 2029-05 posts. They should be between posts 72 (2024-10-02)
and 73 (2024-10-07). This script reassigns all IDs sequentially by date.

Usage:
    python scripts/blog/blog_reorder.py --dry-run   # Preview changes
    python scripts/blog/blog_reorder.py              # Execute changes
"""

import argparse
import os
import re
import sys
from pathlib import Path

BLOG_EN_DIR = Path("content/blog/en")
BLOG_ES_DIR = Path("content/blog/es")


def parse_frontmatter(filepath: Path) -> dict:
    """Extract id, date, and slug from a blog post's YAML frontmatter."""
    text = filepath.read_text(encoding="utf-8")
    # Match YAML frontmatter between --- markers
    match = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not match:
        raise ValueError(f"No frontmatter found in {filepath}")

    fm = match.group(1)
    post_id = None
    date = None
    slug = None

    for line in fm.split("\n"):
        line = line.strip()
        if line.startswith("id:"):
            post_id = int(line.split(":", 1)[1].strip())
        elif line.startswith("date:"):
            date = line.split(":", 1)[1].strip().strip('"').strip("'")
        elif line.startswith("slug:"):
            slug = line.split(":", 1)[1].strip().strip('"').strip("'")

    if post_id is None or date is None or slug is None:
        raise ValueError(f"Missing id/date/slug in {filepath}")

    return {"id": post_id, "date": date, "slug": slug, "path": filepath}


def update_frontmatter_id(filepath: Path, old_id: int, new_id: int):
    """Replace the id field in frontmatter."""
    text = filepath.read_text(encoding="utf-8")
    # Replace `id: OLD` with `id: NEW` in frontmatter only
    updated = re.sub(
        r"^(---\n(?:.*?\n)*?id:\s*)" + str(old_id) + r"(\n)",
        rf"\g<1>{new_id}\2",
        text,
        count=1,
        flags=re.DOTALL,
    )
    if updated == text:
        raise ValueError(f"Failed to update id {old_id} -> {new_id} in {filepath}")
    filepath.write_text(updated, encoding="utf-8")


def pad_id(n: int) -> str:
    return str(n).zfill(4)


def main():
    parser = argparse.ArgumentParser(description="Reorder blog post IDs by date")
    parser.add_argument("--dry-run", action="store_true", help="Preview without changes")
    args = parser.parse_args()

    # Ensure we're running from project root
    if not BLOG_EN_DIR.exists():
        print(f"Error: {BLOG_EN_DIR} not found. Run from project root.", file=sys.stderr)
        sys.exit(1)

    # Step 1: Read all English posts
    print("Reading English posts...")
    posts = []
    for f in sorted(BLOG_EN_DIR.glob("*.md")):
        if f.name == "index.json":
            continue
        try:
            posts.append(parse_frontmatter(f))
        except ValueError as e:
            print(f"  Warning: {e}", file=sys.stderr)

    print(f"  Found {len(posts)} posts")

    # Step 2: Sort by date ASC, then current id ASC as tiebreaker
    posts.sort(key=lambda p: (p["date"], p["id"]))

    # Step 3: Assign new sequential IDs and build mapping
    id_map = {}  # old_id -> new_id
    changes = []  # list of (old_id, new_id, slug, date) for posts that change

    for i, post in enumerate(posts):
        new_id = i + 1
        old_id = post["id"]
        id_map[old_id] = new_id
        if old_id != new_id:
            changes.append((old_id, new_id, post["slug"], post["date"]))

    print(f"\n{len(changes)} posts need ID changes out of {len(posts)} total")

    if not changes:
        print("Nothing to do!")
        return

    # Show summary of changes
    print("\nID changes:")
    for old_id, new_id, slug, date in changes[:20]:
        print(f"  {pad_id(old_id)} -> {pad_id(new_id)}  [{date}] {slug}")
    if len(changes) > 20:
        print(f"  ... and {len(changes) - 20} more")

    # Verify the specific fix we're targeting
    for old_id, new_id, slug, date in changes:
        if old_id == 1270:
            print(f"\n  Post 1270 (date {date}): will become ID {new_id}")
        if old_id == 1271:
            print(f"  Post 1271 (date {date}): will become ID {new_id}")

    # Check for duplicate new IDs (sanity check)
    new_ids = list(id_map.values())
    if len(new_ids) != len(set(new_ids)):
        print("ERROR: Duplicate new IDs detected!", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print("\n[DRY RUN] No files modified.")
        return

    # Step 4: Rename and update files
    # Use a two-phase rename to avoid collisions:
    # Phase 1: Rename all affected files to .tmp suffix
    # Phase 2: Rename from .tmp to final name

    for lang, blog_dir in [("EN", BLOG_EN_DIR), ("ES", BLOG_ES_DIR)]:
        print(f"\nProcessing {lang} posts in {blog_dir}...")
        renamed = 0
        skipped = 0

        # Build a map of old_id -> current filepath for this language
        files_by_id = {}
        for f in sorted(blog_dir.glob("*.md")):
            if f.name == "index.json":
                continue
            match = re.match(r"^(\d+)-(.+)\.md$", f.name)
            if match:
                file_id = int(match.group(1))
                files_by_id[file_id] = f

        # Phase 1: Rename to .tmp for files that need changes
        tmp_files = {}  # old_id -> tmp_path
        for old_id in id_map:
            new_id = id_map[old_id]
            if old_id == new_id:
                continue
            if old_id not in files_by_id:
                if lang == "ES":
                    skipped += 1
                continue

            src = files_by_id[old_id]
            tmp_path = src.with_suffix(".md.tmp")
            os.rename(src, tmp_path)
            tmp_files[old_id] = tmp_path

        # Phase 2: Update frontmatter and rename to final name
        for old_id, tmp_path in tmp_files.items():
            new_id = id_map[old_id]
            # Extract slug from filename
            match = re.match(r"^\d+-(.+)\.md\.tmp$", tmp_path.name)
            if not match:
                print(f"  ERROR: Can't parse tmp filename {tmp_path.name}", file=sys.stderr)
                continue
            slug_part = match.group(1)
            new_name = f"{pad_id(new_id)}-{slug_part}.md"
            new_path = blog_dir / new_name

            # Update frontmatter id
            update_frontmatter_id(tmp_path, old_id, new_id)

            # Rename to final name
            os.rename(tmp_path, new_path)
            renamed += 1

        print(f"  Renamed {renamed} files" + (f", skipped {skipped} missing" if skipped else ""))

    print("\nDone! Run these next:")
    print("  node scripts/blog/generate-blog-json.js")
    print("  npm run build  # verify everything works")


if __name__ == "__main__":
    main()
