#!/usr/bin/env python3
"""
Fix generic body links in English blog posts to be location-specific.

For posts that are about a specific location (detectable via location_link
or title), upgrades generic service links like ](/apartment-moving) to
location-specific links like ](/surfside-apartment-moving).

Only modifies body links (after the second ---), never touches frontmatter.

Usage:
    python scripts/fix_blog_links.py --dry-run   # Preview changes
    python scripts/fix_blog_links.py              # Apply changes
"""

import argparse
import json
import os
import re
import sys


def load_locations(data_dir):
    """Load location name->slug map from locations.json, sorted by name length desc."""
    with open(os.path.join(data_dir, 'locations.json'), 'r') as f:
        data = json.load(f)

    locations = {}
    for state in data['states']:
        for county in state.get('counties', []):
            for city in county.get('cities', []):
                if city.get('is_active'):
                    locations[city['name']] = city['slug']

    # Sort by name length descending so "Miami Beach" matches before "Miami"
    sorted_locations = sorted(locations.items(), key=lambda x: len(x[0]), reverse=True)
    return sorted_locations


def load_service_slugs(data_dir):
    """Load set of active service slugs from services.json."""
    with open(os.path.join(data_dir, 'services.json'), 'r') as f:
        data = json.load(f)
    return {s['slug'] for s in data if s.get('is_active')}


def extract_location_from_link(location_link):
    """Extract location slug from location_link field.

    Examples:
        /surfside-movers -> surfside
        /miami-shores-movers -> miami-shores
        /locations/miami -> miami
    """
    if not location_link or location_link == 'null':
        return None
    slug = location_link.lstrip('/')
    if slug.startswith('locations/'):
        slug = slug[len('locations/'):]
    if slug.endswith('-movers'):
        slug = slug[:-len('-movers')]
    return slug


def extract_location_from_title(title, sorted_locations):
    """Find the longest-matching location name in the title."""
    title_lower = title.lower()
    for name, slug in sorted_locations:
        if name.lower() in title_lower:
            return slug
    return None


def fix_body_links(body, location_slug, service_slugs):
    """Replace generic service links in body with location-specific links.

    ](/local-moving) -> ](/surfside-local-moving)

    Only matches exact generic form. Already-localized links like
    ](/miami-local-moving) are NOT matched because the regex requires
    the slug to appear right after ](/.
    """
    changes = []
    for slug in service_slugs:
        pattern = r'\]\(/' + re.escape(slug) + r'\)'
        replacement = f'](/{location_slug}-{slug})'

        matches = list(re.finditer(pattern, body))
        for m in matches:
            changes.append((slug, f'{location_slug}-{slug}'))

        body = re.sub(pattern, replacement, body)

    return body, changes


def process_file(filepath, sorted_locations, service_slugs, dry_run=False):
    """Process a single blog post file. Returns (changed, changes_list)."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Split into frontmatter and body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False, []

    frontmatter = parts[1]
    body = parts[2]

    # Extract location_link from frontmatter
    location_link_match = re.search(r'location_link:\s*"([^"]*)"', frontmatter)
    location_link = location_link_match.group(1) if location_link_match else None

    # Priority 1: location_link
    location_slug = extract_location_from_link(location_link)

    # Priority 2: title
    if not location_slug:
        title_match = re.search(r'title:\s*"([^"]*)"', frontmatter)
        if title_match:
            location_slug = extract_location_from_title(title_match.group(1), sorted_locations)

    if not location_slug:
        return False, []

    # Fix body links
    new_body, changes = fix_body_links(body, location_slug, service_slugs)

    if not changes:
        return False, []

    if not dry_run:
        new_content = '---' + frontmatter + '---' + new_body
        with open(filepath, 'w') as f:
            f.write(new_content)

    return True, changes


def main():
    parser = argparse.ArgumentParser(description='Fix generic body links in blog posts')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without writing')
    args = parser.parse_args()

    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    blog_dir = os.path.join(base_dir, 'content', 'blog', 'en')

    # Load data
    sorted_locations = load_locations(data_dir)
    service_slugs = load_service_slugs(data_dir)

    print(f"Loaded {len(sorted_locations)} locations, {len(service_slugs)} services")
    print(f"Blog directory: {blog_dir}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'APPLY CHANGES'}")
    print()

    # Process files
    files = sorted([f for f in os.listdir(blog_dir) if f.endswith('.md')])
    total_files_changed = 0
    total_links_changed = 0

    for filename in files:
        filepath = os.path.join(blog_dir, filename)
        changed, changes = process_file(filepath, sorted_locations, service_slugs, args.dry_run)

        if changed:
            total_files_changed += 1
            total_links_changed += len(changes)
            if args.dry_run:
                print(f"  {filename}: {len(changes)} links")
                for old, new in changes[:3]:
                    print(f"    /{old} -> /{new}")
                if len(changes) > 3:
                    print(f"    ... and {len(changes) - 3} more")

    print()
    print(f"{'Would change' if args.dry_run else 'Changed'} {total_links_changed} links in {total_files_changed} files")


if __name__ == '__main__':
    main()
