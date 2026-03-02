#!/usr/bin/env python3
"""
Calculate word count, readTime, and excerpt length for blog posts.

Usage:
    python scripts/blog/blog_wordcount.py <post_id_or_file>
    python scripts/blog/blog_wordcount.py 0001
    python scripts/blog/blog_wordcount.py content/blog/0001-*.md
    python scripts/blog/blog_wordcount.py --all              # Check all posts
    python scripts/blog/blog_wordcount.py --fix <post_id>    # Fix readTime and excerpt

Checks:
    - Word count and readTime (based on 200 WPM)
    - Excerpt length (max 155 characters for SEO)

Fixes (with --fix):
    - readTime based on word count
    - Excerpt length (truncates to 155 chars max)
"""

# Maximum excerpt length for SEO meta descriptions
MAX_EXCERPT_LENGTH = 155

import sys
import re
import glob
import math
from pathlib import Path


def extract_body(content: str) -> str:
    """Extract body content, excluding frontmatter."""
    # Find frontmatter boundaries
    parts = content.split('---', 2)
    if len(parts) >= 3:
        return parts[2].strip()
    return content


def count_words(text: str) -> int:
    """Count words in text."""
    # Remove markdown images
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    # Remove markdown links but keep text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Split on whitespace and count
    words = text.split()
    return len(words)


def calculate_read_time(word_count: int) -> str:
    """Calculate readTime based on 200 WPM, minimum 2 min."""
    minutes = max(2, math.ceil(word_count / 200))
    return f"{minutes} min read"


def get_current_read_time(content: str) -> str:
    """Extract current readTime from frontmatter."""
    match = re.search(r'readTime:\s*["\']?([^"\'"\n]+)["\']?', content)
    return match.group(1).strip() if match else None


def get_excerpt(content: str) -> str:
    """Extract excerpt from frontmatter."""
    match = re.search(r'excerpt:\s*["\']([^"\']+)["\']', content)
    return match.group(1).strip() if match else None


BAD_ENDING_WORDS = {'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for',
    'with', 'from', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'that', 'this',
    'these', 'those', 'its', 'your', 'their', 'our', 'my', 'his', 'her', 'which', 'who', 'whom',
    'what', 'when', 'where', 'how', 'than', 'as', 'if', 'not', 'no', 'so', 'into', 'about',
    'between', 'through', 'during', 'before', 'after', 'above', 'below', 'over', 'under'}


def truncate_excerpt(excerpt: str, max_length: int = MAX_EXCERPT_LENGTH) -> str:
    """Truncate excerpt to max length, preferring complete sentences or trailing ellipsis."""
    if len(excerpt) <= max_length:
        return excerpt

    # Try to end at the last complete sentence within max_length
    candidate = excerpt[:max_length]
    best_end = -1
    for punct in ['. ', '! ', '? ']:
        idx = candidate.rfind(punct)
        if idx > best_end:
            best_end = idx

    if candidate.rstrip()[-1:] in '.!?':
        best_end = max(best_end, len(candidate.rstrip()) - 1)

    # Use complete sentence if it's long enough (at least 80 chars)
    if best_end >= 80:
        return excerpt[:best_end + 1]

    # Otherwise truncate at word boundary and add ellipsis
    truncated = excerpt[:max_length - 3]
    last_space = truncated.rfind(' ')
    if last_space > len(truncated) - 30:
        truncated = truncated[:last_space]

    truncated = truncated.rstrip('.,;:!? ')

    # Strip trailing function words that read awkwardly at the end
    words = truncated.split()
    while words and words[-1].lower() in BAD_ENDING_WORDS:
        words.pop()
    if words:
        truncated = ' '.join(words).rstrip('.,;:!? ')

    return truncated + '...'


def find_post_file(post_id: str) -> Path:
    """Find post file by ID or glob pattern."""
    if Path(post_id).exists():
        return Path(post_id)

    # Try with leading zeros
    padded = post_id.zfill(4)
    matches = glob.glob(f"content/blog/{padded}-*.md")
    if matches:
        return Path(matches[0])

    # Try without leading zeros
    matches = glob.glob(f"content/blog/{post_id}-*.md")
    if matches:
        return Path(matches[0])

    return None


def process_post(file_path: Path, fix: bool = False) -> dict:
    """Process a single post and return word count and excerpt info."""
    content = file_path.read_text()
    body = extract_body(content)
    word_count = count_words(body)
    suggested_time = calculate_read_time(word_count)
    current_time = get_current_read_time(content)

    # Check excerpt
    excerpt = get_excerpt(content)
    excerpt_length = len(excerpt) if excerpt else 0
    excerpt_too_long = excerpt_length > MAX_EXCERPT_LENGTH

    result = {
        'file': file_path.name,
        'word_count': word_count,
        'suggested_time': suggested_time,
        'current_time': current_time,
        'needs_time_update': current_time != suggested_time,
        'excerpt': excerpt,
        'excerpt_length': excerpt_length,
        'excerpt_too_long': excerpt_too_long,
        'needs_update': current_time != suggested_time or excerpt_too_long
    }

    if fix:
        new_content = content
        changes_made = False

        # Fix readTime if needed
        if result['needs_time_update']:
            if current_time:
                new_content = re.sub(
                    r'(readTime:\s*)["\']?[^"\'"\n]+["\']?',
                    f'readTime: "{suggested_time}"',
                    new_content
                )
            else:
                # Add readTime after date if not present
                new_content = re.sub(
                    r'(date:\s*[^\n]+)',
                    f'\\1\nreadTime: "{suggested_time}"',
                    new_content
                )
            changes_made = True
            result['time_fixed'] = True

        # Fix excerpt if too long
        if excerpt_too_long and excerpt:
            new_excerpt = truncate_excerpt(excerpt)
            escaped_excerpt = re.escape(excerpt)
            new_content = re.sub(
                rf'(excerpt:\s*["\']){escaped_excerpt}(["\'])',
                rf'\g<1>{new_excerpt}\g<2>',
                new_content
            )
            changes_made = True
            result['excerpt_fixed'] = True
            result['new_excerpt'] = new_excerpt
            result['new_excerpt_length'] = len(new_excerpt)

        if changes_made:
            file_path.write_text(new_content)
            result['fixed'] = True

    return result


def main():
    args = sys.argv[1:]

    if not args:
        print(__doc__)
        sys.exit(1)

    fix_mode = '--fix' in args
    if fix_mode:
        args.remove('--fix')

    if '--all' in args:
        files = sorted(glob.glob("content/blog/*.md"))
        posts = [Path(f) for f in files if not f.endswith('index.json')]
    else:
        post_id = args[0]
        file_path = find_post_file(post_id)
        if not file_path:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)
        posts = [file_path]

    mismatches = []
    for post in posts:
        result = process_post(post, fix=fix_mode)

        if len(posts) == 1:
            print(f"File: {result['file']}")
            print(f"Word count: {result['word_count']}")
            print(f"Suggested readTime: {result['suggested_time']}")
            print(f"Current readTime: {result['current_time']}")

            # Show readTime status
            if result['needs_time_update']:
                if result.get('time_fixed'):
                    print("✅ readTime fixed")
                else:
                    print("⚠️  readTime needs update (use --fix)")
            else:
                print("✅ readTime is correct")

            # Show excerpt status
            print(f"Excerpt length: {result['excerpt_length']} chars (max {MAX_EXCERPT_LENGTH})")
            if result['excerpt_too_long']:
                if result.get('excerpt_fixed'):
                    print(f"✅ Excerpt fixed: {result['new_excerpt_length']} chars")
                else:
                    print("⚠️  Excerpt too long (use --fix)")
            else:
                print("✅ Excerpt length OK")

        elif result['needs_update']:
            mismatches.append(result)

    if len(posts) > 1:
        time_issues = [m for m in mismatches if m.get('needs_time_update')]
        excerpt_issues = [m for m in mismatches if m.get('excerpt_too_long')]

        print(f"Checked {len(posts)} posts")
        print(f"Found {len(time_issues)} with incorrect readTime")
        print(f"Found {len(excerpt_issues)} with excerpt too long (>{MAX_EXCERPT_LENGTH} chars)")

        if mismatches and not fix_mode:
            if time_issues:
                print("\nreadTime issues:")
                for m in time_issues[:10]:
                    print(f"  {m['file']}: {m['current_time']} → {m['suggested_time']}")
                if len(time_issues) > 10:
                    print(f"  ... and {len(time_issues) - 10} more")

            if excerpt_issues:
                print("\nExcerpt too long:")
                for m in excerpt_issues[:10]:
                    print(f"  {m['file']}: {m['excerpt_length']} chars")
                if len(excerpt_issues) > 10:
                    print(f"  ... and {len(excerpt_issues) - 10} more")

            print("\nRun with --fix to update all")


if __name__ == '__main__':
    main()
