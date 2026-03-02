#!/usr/bin/env python3
"""
Reset all blog posts to pending status.
Sets:
- status: "pending"
- needs_ai_image: false
- updated: [same as date field]
"""

import os
import re
import glob

BLOG_DIR = "content/blog"

def reset_post(filepath):
    """Reset a single post's frontmatter."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        print(f"  [SKIP] No frontmatter found: {filepath}")
        return False

    frontmatter = match.group(1)
    body = match.group(2)

    # Extract the date field
    date_match = re.search(r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})["\']?', frontmatter, re.MULTILINE)
    if not date_match:
        print(f"  [SKIP] No date found: {filepath}")
        return False

    post_date = date_match.group(1)

    changes = []

    # Update status to pending
    if re.search(r'^status:', frontmatter, re.MULTILINE):
        new_frontmatter = re.sub(
            r'^status:\s*["\']?[^"\'\n]+["\']?',
            'status: "pending"',
            frontmatter,
            flags=re.MULTILINE
        )
        if new_frontmatter != frontmatter:
            changes.append("status")
            frontmatter = new_frontmatter
    else:
        # Add status field
        frontmatter = frontmatter.rstrip() + '\nstatus: "pending"'
        changes.append("status (added)")

    # Update needs_ai_image to false
    if re.search(r'^needs_ai_image:', frontmatter, re.MULTILINE):
        new_frontmatter = re.sub(
            r'^needs_ai_image:\s*\S+',
            'needs_ai_image: false',
            frontmatter,
            flags=re.MULTILINE
        )
        if new_frontmatter != frontmatter:
            changes.append("needs_ai_image")
            frontmatter = new_frontmatter
    else:
        # Add needs_ai_image field
        frontmatter = frontmatter.rstrip() + '\nneeds_ai_image: false'
        changes.append("needs_ai_image (added)")

    # Update updated to match date (use count=1 to only replace first occurrence)
    if re.search(r'^updated:', frontmatter, re.MULTILINE):
        new_frontmatter = re.sub(
            r'^updated:\s*.*$',
            f'updated: "{post_date}"',
            frontmatter,
            count=1,
            flags=re.MULTILINE
        )
        if new_frontmatter != frontmatter:
            changes.append("updated")
            frontmatter = new_frontmatter
    else:
        # Add updated field only if it doesn't exist
        if not re.search(r'^updated:', frontmatter, re.MULTILINE):
            frontmatter = frontmatter.rstrip() + f'\nupdated: "{post_date}"'
            changes.append("updated (added)")

    if changes:
        # Write back
        new_content = f"---\n{frontmatter}\n---\n{body}"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return changes

    return None

def main():
    # Find all markdown files
    pattern = os.path.join(BLOG_DIR, "*.md")
    files = sorted(glob.glob(pattern))

    print(f"Found {len(files)} blog posts")
    print("=" * 60)

    updated_count = 0
    skipped_count = 0

    for filepath in files:
        filename = os.path.basename(filepath)
        result = reset_post(filepath)

        if result:
            print(f"[UPDATED] {filename}: {', '.join(result)}")
            updated_count += 1
        elif result is None:
            # No changes needed
            skipped_count += 1
        else:
            # Skipped due to error
            skipped_count += 1

    print("=" * 60)
    print(f"Updated: {updated_count}")
    print(f"Skipped/No changes: {skipped_count}")
    print(f"Total: {len(files)}")

if __name__ == "__main__":
    main()
