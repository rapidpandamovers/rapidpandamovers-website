#!/usr/bin/env python3
"""
Update blog post categories based on service_link.

Usage:
    python scripts/blog/blog_update_categories.py <post_id>
    python scripts/blog/blog_update_categories.py 0001
    python scripts/blog/blog_update_categories.py --all              # Update all posts
    python scripts/blog/blog_update_categories.py --dry-run --all    # Preview changes

This derives category from service_link:
    /local-moving → "Local Moving"
    /senior-moving → "Senior Moving"
    /apartment-moving → "Apartment Moving"
    etc.

The mapping ensures consistent categorization across all blog posts.
"""

import sys
import re
import glob
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Map service links to categories
SERVICE_TO_CATEGORY = {
    'local-moving': 'Local Moving',
    'apartment-moving': 'Apartment Moving',
    'residential-moving': 'Residential Moving',
    'packing-services': 'Packing Services',
    'long-distance-moving': 'Long Distance Moving',
    'long-distance': 'Long Distance Moving',
    'commercial-moving': 'Commercial Moving',
    'office-moving': 'Office Moving',
    'furniture-moving': 'Furniture Moving',
    'senior-moving': 'Senior Moving',
    'military-moving': 'Military Moving',
    'student-moving': 'Student Moving',
    'celebrity-moving': 'Celebrity Moving',
    'antique-moving': 'Antique Moving',
    'safe-moving': 'Safe Moving',
    'special-needs-moving': 'Special Needs Moving',
    'full-service-moving': 'Full Service Moving',
    'labor-only-moving': 'Labor Only Moving',
    'hourly-moving': 'Hourly Moving',
    'same-day-moving': 'Same Day Moving',
    'last-minute-moving': 'Last-Minute Moving',
    'same-building-moving': 'Same Building Moving',
}


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    if Path(post_id).exists():
        return Path(post_id)

    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/en/{padded}-*.md"))
    if not matches:
        matches = glob.glob(str(PROJECT_ROOT / f"content/blog/en/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def find_all_posts() -> list:
    """Find all blog post files."""
    posts = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/en/*.md")))
    if not posts:
        posts = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/en/*.md")))
    return posts


def parse_frontmatter(content: str) -> dict:
    """Parse YAML frontmatter from markdown."""
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"\'')
            if value == 'null':
                value = None
            frontmatter[key] = value

    return frontmatter


def derive_category(service_link: str) -> str:
    """Derive category from service_link."""
    if not service_link or service_link == 'null':
        return None

    # Extract service type from link
    link = service_link.strip().strip('"\'').lstrip('/')

    # Try exact match first
    if link in SERVICE_TO_CATEGORY:
        return SERVICE_TO_CATEGORY[link]

    # Try partial match
    for service_key, category in SERVICE_TO_CATEGORY.items():
        if link.endswith(service_key) or service_key in link:
            return category

    return None


def update_category(file_path: Path, dry_run: bool = False) -> tuple:
    """Update category based on service_link.

    Args:
        file_path: Path to the markdown file
        dry_run: If True, don't write changes

    Returns:
        tuple: (changed: bool, message: str)
    """
    content = file_path.read_text()
    fm = parse_frontmatter(content)

    service_link = fm.get('service_link')
    current_category = fm.get('category', '')

    new_category = derive_category(service_link)

    if not new_category:
        return False, f"No category mapping for service_link: {service_link}"

    if new_category == current_category:
        return False, f"Category unchanged: {current_category}"

    if dry_run:
        return True, f"Would change: {current_category} → {new_category}"

    # Update the category in frontmatter
    if current_category:
        content = re.sub(
            r'^category:\s*"[^"]*"',
            f'category: "{new_category}"',
            content,
            flags=re.MULTILINE
        )
    else:
        # Add category after service_link
        content = re.sub(
            r'^(service_link:\s*[^\n]+)',
            f'\\1\ncategory: "{new_category}"',
            content,
            flags=re.MULTILINE
        )

    file_path.write_text(content)
    return True, f"Category: {current_category} → {new_category}"


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    dry_run = '--dry-run' in args
    args = [a for a in args if a != '--dry-run']

    update_all = '--all' in args
    args = [a for a in args if a != '--all']

    if update_all:
        posts = find_all_posts()
        print(f"Processing {len(posts)} posts...")
        if dry_run:
            print("(dry run - no changes will be made)\n")

        changed = 0
        unchanged = 0

        for post_path in posts:
            file_path = Path(post_path)
            was_changed, message = update_category(file_path, dry_run)
            if was_changed:
                print(f"✓ {file_path.name}: {message}")
                changed += 1
            else:
                unchanged += 1

        print(f"\nSummary: {changed} changed, {unchanged} unchanged")

    else:
        if not args:
            print("Error: Specify a post ID or use --all")
            sys.exit(1)

        post_id = args[0]
        file_path = find_post_file(post_id)

        if not file_path:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)

        if dry_run:
            print("(dry run - no changes will be made)")

        was_changed, message = update_category(file_path, dry_run)
        print(f"{file_path.name}: {message}")


if __name__ == '__main__':
    main()
