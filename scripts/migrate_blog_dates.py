#!/usr/bin/env python3
"""
Migrate blog post dates: shift 2030+ posts 5 years earlier with Tue/Fri cadence.

- Monday 2030+ posts → Tuesday of same ISO week, year-5
- Non-Monday 2030+ posts → sequential Fridays starting Jan 3 2025
- Pre-2030 posts keep their dates, only get renumbered
- Image folders moved, frontmatter & body image refs updated
- index.json rebuilt

Usage:
    python scripts/migrate_blog_dates.py --dry-run   # Preview changes
    python scripts/migrate_blog_dates.py              # Execute migration
"""

import argparse
import json
import os
import re
import shutil
import sys
from datetime import date, timedelta
from pathlib import Path

BLOG_DIR = Path("content/blog/en")
IMAGE_DIR = Path("public/images/blog")
INDEX_FILE = BLOG_DIR / "index.json"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown. Returns (frontmatter_dict, body)."""
    if not text.startswith("---"):
        raise ValueError("No frontmatter found")
    end = text.index("---", 3)
    fm_text = text[3:end].strip()
    body = text[end + 3:]

    fm = {}
    current_key = None
    current_list = None

    for line in fm_text.split("\n"):
        # List item
        if line.startswith("  - "):
            val = line[4:].strip().strip('"').strip("'")
            if current_list is not None:
                current_list.append(val)
            continue

        # Key-value pair
        match = re.match(r'^(\w[\w_]*)\s*:\s*(.*)', line)
        if match:
            key = match.group(1)
            val = match.group(2).strip()

            # Save previous list
            if current_list is not None:
                fm[current_key] = current_list
                current_list = None

            # Empty value means upcoming list or null
            if val == "" or val == "[]":
                current_key = key
                current_list = []
            elif val == "null":
                fm[key] = None
            elif val == "true":
                fm[key] = True
            elif val == "false":
                fm[key] = False
            elif val.isdigit():
                fm[key] = int(val)
            else:
                fm[key] = val.strip('"').strip("'")
            current_key = key

    # Save final list if any
    if current_list is not None:
        fm[current_key] = current_list

    return fm, body


def serialize_frontmatter(fm: dict) -> str:
    """Serialize frontmatter dict back to YAML string."""
    lines = ["---"]
    for key, val in fm.items():
        if val is None:
            lines.append(f"{key}: null")
        elif val is True:
            lines.append(f"{key}: true")
        elif val is False:
            lines.append(f"{key}: false")
        elif isinstance(val, int):
            lines.append(f"{key}: {val}")
        elif isinstance(val, list):
            if len(val) == 0:
                lines.append(f"{key}: []")
            else:
                lines.append(f"{key}:")
                for item in val:
                    lines.append(f'  - "{item}"')
        else:
            lines.append(f'{key}: "{val}"')
    lines.append("---")
    return "\n".join(lines)


def iso_tuesday(iso_year: int, iso_week: int) -> date:
    """Get the Tuesday of a given ISO year/week."""
    # Monday of ISO week 1
    jan4 = date(iso_year, 1, 4)
    start = jan4 - timedelta(days=jan4.weekday())  # Monday of week containing Jan 4
    monday = start + timedelta(weeks=iso_week - 1)
    return monday + timedelta(days=1)  # Tuesday


def compute_new_dates(posts: list[dict]) -> list[dict]:
    """Compute new dates for all posts. Returns list of post dicts with 'new_date' added."""

    # Separate pre-2030 and 2030+
    pre_2030 = []
    post_2030_monday = []
    post_2030_nonmonday = []

    for p in posts:
        d = date.fromisoformat(p["date"])
        if d.year < 2030:
            p["new_date"] = p["date"]
            p["shifted"] = False
            pre_2030.append(p)
        elif d.weekday() == 0:  # Monday
            post_2030_monday.append(p)
        else:
            post_2030_nonmonday.append(p)

    # Monday posts → Tuesday of same ISO week, year-5
    for p in post_2030_monday:
        d = date.fromisoformat(p["date"])
        iso_year, iso_week, _ = d.isocalendar()
        target_year = iso_year - 5

        # Check if target year has this ISO week
        # ISO week 53 only exists in some years
        dec28 = date(target_year, 12, 28)
        max_week = dec28.isocalendar()[1]

        if iso_week > max_week:
            # Fall back to last week of target year
            iso_week = max_week

        new_d = iso_tuesday(target_year, iso_week)
        p["new_date"] = new_d.isoformat()
        p["shifted"] = True

    # Non-Monday posts → sequential Fridays starting Jan 3 2025
    post_2030_nonmonday.sort(key=lambda p: (p["date"], p["id"]))
    friday = date(2025, 1, 3)  # First Friday of 2025
    for p in post_2030_nonmonday:
        p["new_date"] = friday.isoformat()
        p["shifted"] = True
        friday += timedelta(weeks=1)

    # Combine all posts
    all_posts = pre_2030 + post_2030_monday + post_2030_nonmonday
    return all_posts


def merge_sort_renumber(posts: list[dict]) -> list[dict]:
    """Sort by new_date then original id, assign new sequential IDs."""
    posts.sort(key=lambda p: (p["new_date"], p["id"]))
    for i, p in enumerate(posts):
        p["new_id"] = i + 1
    return posts


def compute_image_folder(slug: str, new_date: str) -> str:
    """Compute the image folder path for a post."""
    d = date.fromisoformat(new_date)
    return f"/images/blog/{d.year}/{d.month:02d}/{slug}"


def load_posts() -> list[dict]:
    """Load all blog posts from markdown files."""
    posts = []
    for f in sorted(BLOG_DIR.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        try:
            fm, body = parse_frontmatter(text)
        except ValueError:
            print(f"  SKIP (no frontmatter): {f.name}")
            continue

        if "id" not in fm or "slug" not in fm or "date" not in fm:
            print(f"  SKIP (missing fields): {f.name}")
            continue

        posts.append({
            "id": fm["id"],
            "slug": fm["slug"],
            "date": fm["date"],
            "filename": f.name,
            "filepath": f,
            "frontmatter": fm,
            "body": body,
        })

    return posts


def get_old_image_path(slug: str, old_date: str) -> Path:
    """Get the old image directory path."""
    d = date.fromisoformat(old_date)
    return IMAGE_DIR / str(d.year) / f"{d.month:02d}" / slug


def get_new_image_path(slug: str, new_date: str) -> Path:
    """Get the new image directory path."""
    d = date.fromisoformat(new_date)
    return IMAGE_DIR / str(d.year) / f"{d.month:02d}" / slug


def update_image_refs(text: str, old_folder: str, new_folder: str) -> str:
    """Replace image folder references in text."""
    if old_folder and new_folder and old_folder != new_folder:
        return text.replace(old_folder, new_folder)
    return text


def dry_run_report(posts: list[dict]) -> None:
    """Print a summary of planned changes."""
    shifted = [p for p in posts if p["shifted"]]
    renumbered = [p for p in posts if p["new_id"] != p["id"]]

    print(f"\n{'='*70}")
    print(f"DRY RUN REPORT")
    print(f"{'='*70}")
    print(f"Total posts:     {len(posts)}")
    print(f"Date-shifted:    {len(shifted)}")
    print(f"Renumbered:      {len(renumbered)}")
    print(f"Unchanged:       {len(posts) - len(renumbered)}")

    # Date range summary
    shifted_dates = sorted([p["new_date"] for p in shifted])
    if shifted_dates:
        print(f"\nShifted date range: {shifted_dates[0]} → {shifted_dates[-1]}")

    # Tuesday/Friday breakdown
    tuesdays = [p for p in shifted if date.fromisoformat(p["new_date"]).weekday() == 1]
    fridays = [p for p in shifted if date.fromisoformat(p["new_date"]).weekday() == 4]
    print(f"Tuesday posts:   {len(tuesdays)}")
    print(f"Friday posts:    {len(fridays)}")

    if tuesdays:
        tue_dates = sorted([p["new_date"] for p in tuesdays])
        print(f"  Tuesday range: {tue_dates[0]} → {tue_dates[-1]}")
    if fridays:
        fri_dates = sorted([p["new_date"] for p in fridays])
        print(f"  Friday range:  {fri_dates[0]} → {fri_dates[-1]}")

    # Sample of shifted posts
    print(f"\n--- Sample shifted posts (first 10) ---")
    for p in sorted(shifted, key=lambda x: x["new_date"])[:10]:
        old_dow = date.fromisoformat(p["date"]).strftime("%a")
        new_dow = date.fromisoformat(p["new_date"]).strftime("%a")
        print(f"  ID {p['id']:>4} → {p['new_id']:>4}  |  {p['date']} ({old_dow}) → {p['new_date']} ({new_dow})  |  {p['slug'][:50]}")

    print(f"\n--- Sample shifted posts (last 10) ---")
    for p in sorted(shifted, key=lambda x: x["new_date"])[-10:]:
        old_dow = date.fromisoformat(p["date"]).strftime("%a")
        new_dow = date.fromisoformat(p["new_date"]).strftime("%a")
        print(f"  ID {p['id']:>4} → {p['new_id']:>4}  |  {p['date']} ({old_dow}) → {p['new_date']} ({new_dow})  |  {p['slug'][:50]}")

    # Sample renumbered (non-shifted)
    renumbered_only = [p for p in renumbered if not p["shifted"]]
    if renumbered_only:
        print(f"\n--- Sample renumbered-only posts (first 10) ---")
        for p in renumbered_only[:10]:
            print(f"  ID {p['id']:>4} → {p['new_id']:>4}  |  {p['date']} (unchanged)  |  {p['slug'][:50]}")

    # Image folder moves
    image_moves = 0
    for p in shifted:
        old_path = get_old_image_path(p["slug"], p["date"])
        if old_path.exists():
            image_moves += 1
    print(f"\nImage folders to move: {image_moves}")

    # Duplicate date check
    date_counts: dict[str, int] = {}
    for p in posts:
        date_counts[p["new_date"]] = date_counts.get(p["new_date"], 0) + 1

    max_per_day = max(date_counts.values())
    print(f"Max posts per day: {max_per_day}")
    if max_per_day > 3:
        crowded = {d: c for d, c in date_counts.items() if c > 3}
        print(f"  Days with >3 posts: {crowded}")

    print(f"\n{'='*70}")


def execute_migration(posts: list[dict]) -> None:
    """Execute the migration."""
    shifted = [p for p in posts if p["shifted"]]
    renumbered = [p for p in posts if p["new_id"] != p["id"]]

    print(f"\nExecuting migration...")
    print(f"  {len(shifted)} posts to shift dates")
    print(f"  {len(renumbered)} posts to renumber")

    # Step 1: Move image folders for shifted posts (two-pass to avoid conflicts)
    print("\n[1/5] Moving image folders (pass 1: to temp)...")
    image_moves = []
    for p in shifted:
        old_path = get_old_image_path(p["slug"], p["date"])
        new_path = get_new_image_path(p["slug"], p["new_date"])
        if old_path.exists() and old_path != new_path:
            temp_path = old_path.parent / f"_temp_{p['slug']}"
            image_moves.append((old_path, temp_path, new_path))
            shutil.move(str(old_path), str(temp_path))

    print(f"  Moved {len(image_moves)} folders to temp locations")

    print("[1/5] Moving image folders (pass 2: to final)...")
    for _, temp_path, new_path in image_moves:
        new_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(temp_path), str(new_path))

    print(f"  Moved {len(image_moves)} folders to final locations")

    # Step 2: Update frontmatter and body for shifted posts, then rename files (two-pass)
    print("\n[2/5] Updating markdown files...")

    # Build a map of old filenames to post data for all posts
    file_updates = []
    for p in posts:
        old_filename = p["filename"]
        new_filename = f"{p['new_id']:04d}-{p['slug']}.md"
        fm = p["frontmatter"].copy()

        # Update ID
        fm["id"] = p["new_id"]

        if p["shifted"]:
            # Update date fields
            fm["date"] = p["new_date"]
            fm["updated"] = p["new_date"]

            # Compute old and new image folder
            old_folder = fm.get("image_folder")
            new_folder = compute_image_folder(p["slug"], p["new_date"])

            if old_folder and old_folder != new_folder:
                fm["image_folder"] = new_folder

                # Update featured image path
                if fm.get("featured") and old_folder:
                    fm["featured"] = fm["featured"].replace(old_folder, new_folder)

                # Update images array
                if fm.get("images") and isinstance(fm["images"], list):
                    fm["images"] = [img.replace(old_folder, new_folder) for img in fm["images"]]

                # Update body image references
                body = update_image_refs(p["body"], old_folder, new_folder)
            else:
                body = p["body"]
        else:
            body = p["body"]

        new_content = serialize_frontmatter(fm) + body

        file_updates.append({
            "old_path": BLOG_DIR / old_filename,
            "new_path": BLOG_DIR / new_filename,
            "content": new_content,
        })

    # Pass 1: Write all to temp names
    print("[3/5] Renaming files (pass 1: to temp)...")
    temp_mappings = []
    for fu in file_updates:
        temp_name = f"_temp_{fu['new_path'].name}"
        temp_path = BLOG_DIR / temp_name
        temp_path.write_text(fu["content"], encoding="utf-8")
        temp_mappings.append((temp_path, fu["new_path"]))

    # Delete all old files
    print("  Removing old files...")
    for fu in file_updates:
        if fu["old_path"].exists():
            fu["old_path"].unlink()

    # Pass 2: Rename temp to final
    print("[3/5] Renaming files (pass 2: to final)...")
    for temp_path, final_path in temp_mappings:
        temp_path.rename(final_path)

    print(f"  Updated {len(file_updates)} files")

    # Step 4: Rebuild index.json
    print("\n[4/5] Rebuilding index.json...")
    index_entries = []
    for p in sorted(posts, key=lambda x: x["new_id"]):
        index_entries.append({
            "id": p["new_id"],
            "title": p["frontmatter"]["title"],
            "slug": p["slug"],
            "date": p["new_date"] if p["shifted"] else p["date"],
            "category": p["frontmatter"].get("category", "Moving Tips"),
        })

    INDEX_FILE.write_text(json.dumps(index_entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"  Wrote {len(index_entries)} entries to index.json")

    # Step 5: Clean up empty year/month directories
    print("\n[5/5] Cleaning up empty directories...")
    cleaned = 0
    for year_dir in sorted(IMAGE_DIR.iterdir()):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
        for month_dir in sorted(year_dir.iterdir()):
            if not month_dir.is_dir():
                continue
            if not any(month_dir.iterdir()):
                month_dir.rmdir()
                cleaned += 1
        if not any(year_dir.iterdir()):
            year_dir.rmdir()
            cleaned += 1

    print(f"  Removed {cleaned} empty directories")
    print(f"\nMigration complete!")


def main():
    parser = argparse.ArgumentParser(description="Migrate blog post dates from 2030+ to 2025+")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without modifying files")
    args = parser.parse_args()

    # Verify we're in the right directory
    if not BLOG_DIR.exists():
        print(f"ERROR: {BLOG_DIR} not found. Run from the project root.")
        sys.exit(1)

    print("Loading blog posts...")
    posts = load_posts()
    print(f"  Loaded {len(posts)} posts")

    print("Computing new dates...")
    posts = compute_new_dates(posts)

    print("Sorting and renumbering...")
    posts = merge_sort_renumber(posts)

    if args.dry_run:
        dry_run_report(posts)
    else:
        # Safety check
        print(f"\nThis will modify {len(posts)} files and move image directories.")
        response = input("Continue? (yes/no): ")
        if response.lower() != "yes":
            print("Aborted.")
            sys.exit(0)
        execute_migration(posts)


if __name__ == "__main__":
    main()
