#!/usr/bin/env python3
"""
Remove year references from blog post titles, update slugs, and rename files.

Usage:
    python scripts/blog/blog_rename.py <post_id>           # Check single post
    python scripts/blog/blog_rename.py 0001 --fix          # Fix single post
    python scripts/blog/blog_rename.py --all               # Check all posts
    python scripts/blog/blog_rename.py --all --fix         # Fix all posts

This script ensures consistency between:
1. Title - removes year references, fixes bad endings
2. Slug - regenerated from title when needed
3. Filename - matches slug pattern (NNNN-slug.md)
4. Image folder - path updated to match slug, folder renamed if exists

Examples of titles that will be fixed:
    "Miami Moving Tips for 2024" → "Miami Moving Tips"
    "2024 Miami Beach Guide" → "Miami Beach Guide"
    "Moving in 2024: A Miami Guide" → "Moving: A Miami Guide"
"""

import sys
import os
import re
import glob
import shutil
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Maximum slug length (to prevent overly long filenames)
# 70 chars is reasonable for URLs and prevents most truncations
MAX_SLUG_LENGTH = 70


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    if Path(post_id).exists():
        return Path(post_id)

    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def title_to_slug(title: str) -> str:
    """Convert a title to a URL-friendly slug."""
    slug = title.lower()
    # Remove apostrophes entirely (contractions become single words: aren't -> arent)
    slug = re.sub(r"[''`]", '', slug)
    # Replace other special characters with spaces
    slug = re.sub(r'[^\w\s-]', ' ', slug)
    # Replace multiple spaces/hyphens with single hyphen
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Truncate to max length at word boundary
    if len(slug) > MAX_SLUG_LENGTH:
        slug = slug[:MAX_SLUG_LENGTH]
        # Don't cut off in the middle of a word - find last hyphen
        if '-' in slug:
            # Make sure we don't end on a short/cutoff word
            while '-' in slug:
                last_part = slug.rsplit('-', 1)[-1]
                # If last part is too short (<=3 chars, likely a cutoff), trim it
                # Common short words that are OK: "day", "for", "the", etc. but cutoffs like "kn", "se" are not
                if len(last_part) <= 2:
                    slug = slug.rsplit('-', 1)[0]
                elif len(last_part) == 3 and last_part not in ['day', 'for', 'the', 'and', 'but', 'not', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'you', 'his', 'has', 'its', 'let', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'how', 'get', 'top', 'big', 'job', 'key', 'diy', 'pro']:
                    slug = slug.rsplit('-', 1)[0]
                else:
                    break
    return slug.strip('-')


def clean_title(title: str) -> str:
    """Remove year references while preserving important content."""
    new_title = title

    # Patterns to remove years (order matters - more specific first)
    # These patterns are designed to remove ONLY the year and minimal connecting words
    year_patterns = [
        # "– 2024 Guide" or "- 2024 Guide" (remove dash, year, keep rest)
        (r'\s*[-–]\s*20\d{2}\s+', ' '),
        # "for 2024" at end
        (r'\s+for\s+20\d{2}\s*$', ''),
        # "in 2024" at end
        (r'\s+in\s+20\d{2}\s*$', ''),
        # "in 2024:" mid-sentence (keep the colon)
        (r'\s+in\s+20\d{2}\s*:', ':'),
        # "2024:" anywhere (e.g., "Job Market 2024: Guide" → "Job Market: Guide")
        (r'\s*20\d{2}\s*:', ':'),
        # "2024:" at start (e.g., "2024: Miami Guide")
        (r'^20\d{2}\s*:\s*', ''),
        # "2024" at very end
        (r'\s+20\d{2}\s*$', ''),
        # "2024" at very start followed by space
        (r'^20\d{2}\s+', ''),
        # "- 2024" or "– 2024" at end (no trailing text)
        (r'\s*[-–]\s*20\d{2}\s*$', ''),
        # "(2024)" anywhere
        (r'\s*\(20\d{2}\)\s*', ' '),
        # "2024" between words (rare, be careful)
        (r'\s+20\d{2}\s+', ' '),
    ]

    for pattern, replacement in year_patterns:
        new_title = re.sub(pattern, replacement, new_title)

    # Clean up the result
    new_title = clean_string_endings(new_title)

    return new_title


def clean_string_endings(text: str) -> str:
    """Clean up string to remove trailing special chars and ensure proper ending."""
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()

    # Remove trailing special characters and common trailing words that look orphaned
    # Characters to remove from end: punctuation, dashes, etc.
    trailing_chars = set('–-—:;,._!?@#$%^&*()[]{}|\\/<>\'"`~')

    # Keep removing until we hit a letter or number
    while text:
        last_char = text[-1]
        if last_char in trailing_chars or (not last_char.isalnum() and not last_char.isalpha()):
            text = text[:-1].strip()
        else:
            break

    # Remove leading special characters
    while text:
        first_char = text[0]
        if first_char in trailing_chars or (not first_char.isalnum() and not first_char.isalpha()):
            text = text[1:].strip()
        else:
            break

    return text


def has_year(text: str) -> bool:
    """Check if text contains a year (2000-2099)."""
    if not text:
        return False
    return bool(re.search(r'\b20\d{2}\b', text))


def has_bad_ending(text: str) -> bool:
    """Check if text ends with special characters or looks cut off."""
    if not text:
        return False

    # Question marks are OK for question titles
    # Check for OTHER trailing special characters (but not ?)
    bad_trailing = set('–-—:;,._!@#$%^&*()[]{}|\\/<>\'"`~')
    if text[-1] in bad_trailing:
        return True

    # Check for obvious cutoff patterns only
    # Don't flag phrasal verbs like "to Watch For" or "to Look Out For"
    cutoff_patterns = [
        r'\s+(a|an|the)\s*$',  # Only articles, not prepositions (they can be part of phrasal verbs)
        r'\s+\w\s*$',  # Single letter word at end (clear cutoff)
    ]
    for pattern in cutoff_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True

    return False


def has_bad_slug(slug: str) -> bool:
    """Check if slug has issues like double hyphens, bad endings, or cutoffs."""
    if not slug:
        return False

    # Double hyphens
    if '--' in slug:
        return True

    # Ends with hyphen
    if slug.endswith('-'):
        return True

    # Starts with hyphen
    if slug.startswith('-'):
        return True

    # Check for cutoff at end (short fragment that's not a real word)
    # Get the last segment after hyphen
    if '-' in slug:
        last_segment = slug.rsplit('-', 1)[-1]
        # If last segment is 1-2 chars, it's likely a cutoff (unless it's a number)
        if len(last_segment) <= 2 and not last_segment.isdigit():
            return True
        # If last segment is 3 chars but not a common word, it might be a cutoff
        common_3char = {'day', 'for', 'the', 'and', 'but', 'not', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'you', 'his', 'has', 'its', 'let', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'how', 'get', 'top', 'big', 'job', 'key', 'diy', 'pro', 'tip', 'tips', 'use', 'via', 'why', 'yet', 'ago', 'air', 'ask', 'bay', 'bed', 'box', 'buy', 'car', 'cut', 'dog', 'dry', 'eat', 'end', 'eye', 'far', 'few', 'fit', 'fix', 'fly', 'fun', 'gas', 'hot', 'ice', 'kit', 'law', 'led', 'lie', 'lot', 'low', 'map', 'mix', 'net', 'oil', 'own', 'pay', 'pet', 'put', 'ran', 'raw', 'red', 'rid', 'run', 'sad', 'sat', 'sea', 'set', 'sit', 'six', 'sky', 'son', 'sun', 'tax', 'ten', 'tie', 'try', 'war', 'wet', 'win', 'won', 'yes', 'zip'}
        if len(last_segment) == 3 and last_segment not in common_3char:
            # Check if it looks like a cutoff (consonant cluster, etc.)
            vowels = set('aeiou')
            if not any(c in vowels for c in last_segment):
                return True

    return False


def get_post_id(content: str) -> str:
    """Extract post ID from frontmatter."""
    match = re.search(r'^id:\s*(\d+)', content, re.MULTILINE)
    return match.group(1).zfill(4) if match else None


def get_title(content: str) -> str:
    """Extract title from frontmatter."""
    # Handle quoted titles (may contain apostrophes)
    match = re.search(r'^title:\s*"([^"]+)"\s*$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    # Handle single-quoted titles
    match = re.search(r"^title:\s*'([^']+)'\s*$", content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    # Handle unquoted titles (no special chars)
    match = re.search(r'^title:\s*([^\n]+?)\s*$', content, re.MULTILINE)
    return match.group(1).strip() if match else None


def get_slug(content: str) -> str:
    """Extract slug from frontmatter."""
    match = re.search(r'^slug:\s*["\']?([^"\'\n]+)["\']?\s*$', content, re.MULTILINE)
    return match.group(1).strip() if match else None


def get_date(content: str) -> str:
    """Extract date from frontmatter."""
    match = re.search(r'^date:\s*["\']?([^"\'\n]+)["\']?\s*$', content, re.MULTILINE)
    return match.group(1).strip() if match else None


def get_image_folder(content: str) -> str:
    """Extract image_folder from frontmatter."""
    match = re.search(r'^image_folder:\s*["\']?([^"\'\n]+)["\']?\s*$', content, re.MULTILINE)
    return match.group(1).strip() if match else None


def update_image_paths(content: str, old_folder: str, new_folder: str) -> str:
    """Update all image paths in content when folder changes."""
    if not old_folder or not new_folder or old_folder == new_folder:
        return content

    # Update image_folder
    content = re.sub(
        r'^(image_folder:\s*["\']?)' + re.escape(old_folder) + r'(["\']?\s*)$',
        rf'\g<1>{new_folder}\g<2>',
        content,
        flags=re.MULTILINE
    )

    # Update featured
    content = re.sub(
        r'^(featured:\s*["\']?)' + re.escape(old_folder) + r'/',
        rf'\g<1>{new_folder}/',
        content,
        flags=re.MULTILINE
    )

    # Update images array items
    content = re.sub(
        r'(\s*-\s*["\']?)' + re.escape(old_folder) + r'/',
        rf'\g<1>{new_folder}/',
        content
    )

    # Update body image references ![...](old_folder/...)
    content = re.sub(
        r'(\!\[[^\]]*\]\()' + re.escape(old_folder) + r'/',
        rf'\g<1>{new_folder}/',
        content
    )

    return content


def move_image_folder(old_folder: str, new_folder: str) -> bool:
    """Move the actual image folder on disk."""
    if not old_folder or not new_folder or old_folder == new_folder:
        return False

    old_path = PROJECT_ROOT / f"public{old_folder}"
    new_path = PROJECT_ROOT / f"public{new_folder}"

    if old_path.exists() and not new_path.exists():
        new_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(old_path), str(new_path))
        return True

    return False


def update_frontmatter_field(content: str, field: str, new_value: str) -> str:
    """Update a field in frontmatter."""
    # Handle double-quoted values (may contain apostrophes)
    pattern_dq = rf'^({field}:\s*)"[^"]+"\s*$'
    if re.search(pattern_dq, content, re.MULTILINE):
        return re.sub(pattern_dq, rf'\g<1>"{new_value}"', content, count=1, flags=re.MULTILINE)

    # Handle single-quoted values
    pattern_sq = rf"^({field}:\s*)'[^']+'\s*$"
    if re.search(pattern_sq, content, re.MULTILINE):
        return re.sub(pattern_sq, rf'\g<1>"{new_value}"', content, count=1, flags=re.MULTILINE)

    # Handle unquoted values
    pattern_uq = rf'^({field}:\s*)[^\n]+$'
    return re.sub(pattern_uq, rf'\g<1>"{new_value}"', content, count=1, flags=re.MULTILINE)


def check_post(file_path: Path, fix: bool = False) -> dict:
    """Check and optionally fix year in title, slug, filename, and image folder."""
    content = file_path.read_text()

    post_id = get_post_id(content)
    title = get_title(content)
    current_slug = get_slug(content)
    current_filename = file_path.name
    current_date = get_date(content)
    current_image_folder = get_image_folder(content)

    if not title or not post_id:
        return {
            'file': file_path.name,
            'has_year': False,
            'title': title or '',
            'fixed': False,
            'error': 'Could not parse frontmatter'
        }

    # Check for year in title, slug, or filename
    year_in_title = has_year(title)
    year_in_slug = has_year(current_slug)
    year_in_filename = has_year(current_filename)

    # Check for bad endings or cutoffs
    bad_title_ending = has_bad_ending(title)
    bad_slug = has_bad_slug(current_slug)
    bad_filename = has_bad_slug(current_filename.replace('.md', ''))

    # Check if image_folder matches slug
    image_folder_mismatch = False
    expected_image_folder = None
    if current_image_folder and current_date and current_slug:
        # Extract year/month from date
        year = current_date[:4] if len(current_date) >= 4 else '2024'
        month = current_date[5:7] if len(current_date) >= 7 else '01'
        expected_image_folder = f"/images/blog/{year}/{month}/{current_slug}"
        if current_image_folder != expected_image_folder:
            image_folder_mismatch = True

    # Check if title matches slug (slug should be derived from title)
    title_slug_mismatch = False
    if title and current_slug:
        expected_slug = title_to_slug(title)
        # Check if first 30 chars match (allowing for truncation)
        if not expected_slug.startswith(current_slug[:30]) and not current_slug.startswith(expected_slug[:30]):
            title_slug_mismatch = True

    needs_fix = (year_in_title or year_in_slug or year_in_filename or
                 bad_title_ending or bad_slug or bad_filename or image_folder_mismatch or
                 title_slug_mismatch)

    result = {
        'file': file_path.name,
        'post_id': post_id,
        'needs_fix': needs_fix,
        'has_year': year_in_title or year_in_slug or year_in_filename,
        'year_in_title': year_in_title,
        'year_in_slug': year_in_slug,
        'year_in_filename': year_in_filename,
        'bad_title_ending': bad_title_ending,
        'bad_slug': bad_slug,
        'bad_filename': bad_filename,
        'image_folder_mismatch': image_folder_mismatch,
        'title_slug_mismatch': title_slug_mismatch,
        'title': title,
        'slug': current_slug,
        'image_folder': current_image_folder,
        'fixed': False,
        'new_title': None,
        'new_slug': None,
        'new_filename': None,
        'new_image_folder': None,
    }

    if needs_fix:
        # Clean the title (remove year if present, fix bad endings)
        new_title = title
        if year_in_title:
            new_title = clean_title(new_title)
        if bad_title_ending or has_bad_ending(new_title):
            new_title = clean_string_endings(new_title)

        # Generate new slug from cleaned title (or clean existing slug)
        if year_in_title or bad_title_ending or bad_slug or bad_filename or title_slug_mismatch:
            # Regenerate from title for any structural issues or mismatches
            new_slug = title_to_slug(new_title)
        elif year_in_slug:
            # Just clean the year from slug
            cleaned_slug = re.sub(r'-?20\d{2}-?', '-', current_slug)
            cleaned_slug = re.sub(r'-+', '-', cleaned_slug).strip('-')
            new_slug = cleaned_slug
        else:
            new_slug = current_slug

        # Ensure slug doesn't have issues
        new_slug = re.sub(r'-+', '-', new_slug).strip('-')

        new_filename = f"{post_id}-{new_slug}.md"

        # Calculate new image folder based on new slug
        new_image_folder = None
        if current_image_folder and current_date:
            year = current_date[:4] if len(current_date) >= 4 else '2024'
            month = current_date[5:7] if len(current_date) >= 7 else '01'
            new_image_folder = f"/images/blog/{year}/{month}/{new_slug}"

        result['new_title'] = new_title
        result['new_slug'] = new_slug
        result['new_filename'] = new_filename
        result['new_image_folder'] = new_image_folder

        if fix:
            new_content = content
            changes_made = False

            # Update title if it had year
            if year_in_title and new_title != title:
                new_content = update_frontmatter_field(new_content, 'title', new_title)
                changes_made = True

            # Update slug if it changed
            if new_slug != current_slug:
                new_content = update_frontmatter_field(new_content, 'slug', new_slug)
                changes_made = True

            # Update image paths if folder changed
            if new_image_folder and current_image_folder and new_image_folder != current_image_folder:
                new_content = update_image_paths(new_content, current_image_folder, new_image_folder)
                changes_made = True

                # Move the actual image folder
                if move_image_folder(current_image_folder, new_image_folder):
                    result['image_folder_moved'] = True

            # Write updated content
            if changes_made:
                file_path.write_text(new_content)

            # Rename file if needed
            if new_filename != current_filename:
                new_path = file_path.parent / new_filename
                if not new_path.exists():
                    shutil.move(str(file_path), str(new_path))
                    result['file_renamed'] = True
                else:
                    result['file_rename_skipped'] = f"Target exists: {new_filename}"

            result['fixed'] = True

    return result


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    fix = '--fix' in args
    args = [a for a in args if a != '--fix']

    if '--all' in args:
        post_files = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/*.md")))
        posts = [Path(f) for f in post_files]
    else:
        post_id = args[0]
        post_file = find_post_file(post_id)
        if not post_file:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)
        posts = [post_file]

    found = 0
    fixed = 0

    for post in posts:
        result = check_post(post, fix=fix)

        if result.get('error'):
            print(f"⚠️  ERROR: {result['file']}: {result['error']}")
            continue

        if result.get('needs_fix'):
            found += 1
            status = "✅ FIXED" if result['fixed'] else "⚠️  NEEDS FIX"

            # Show what issues were found
            issues = []
            if result.get('year_in_title'):
                issues.append('year in title')
            if result.get('year_in_slug'):
                issues.append('year in slug')
            if result.get('year_in_filename'):
                issues.append('year in filename')
            if result.get('bad_title_ending'):
                issues.append('bad title ending')
            if result.get('bad_slug'):
                issues.append('bad slug')
            if result.get('bad_filename'):
                issues.append('bad filename')
            if result.get('image_folder_mismatch'):
                issues.append('image folder mismatch')
            if result.get('title_slug_mismatch'):
                issues.append('title/slug mismatch')

            print(f"{status}: {result['file']} ({', '.join(issues)})")

            if result['title'] != result['new_title']:
                print(f"   Title: {result['title']}")
                print(f"      →   {result['new_title']}")

            if result['slug'] != result['new_slug']:
                print(f"   Slug:  {result['slug']}")
                print(f"      →   {result['new_slug']}")

            if result.get('file_renamed'):
                print(f"   File:  → {result['new_filename']}")
            elif result['file'] != result['new_filename']:
                print(f"   File:  {result['file']}")
                print(f"      →   {result['new_filename']}")
            if result.get('file_rename_skipped'):
                print(f"   File:  ⚠️  {result['file_rename_skipped']}")

            # Show image folder changes
            if result.get('new_image_folder') and result['image_folder'] != result['new_image_folder']:
                if result.get('image_folder_moved'):
                    print(f"   Images: → {result['new_image_folder']}")
                else:
                    print(f"   Images: {result['image_folder']}")
                    print(f"      →   {result['new_image_folder']}")

            if result['fixed']:
                fixed += 1

    print(f"\n{'='*50}")
    print(f"Checked {len(posts)} posts")
    print(f"Found {found} needing fixes (years, bad endings, cutoffs, mismatches)")
    if fix:
        print(f"Fixed {fixed} posts (title, slug, filename, and image folder)")
    elif found > 0:
        print(f"Run with --fix to update slugs, filenames, and image folders to match titles")


if __name__ == '__main__':
    main()
