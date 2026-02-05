#!/usr/bin/env python3
"""
Calculate word count and readTime for blog posts.

Usage:
    python scripts/blog/blog_wordcount.py <post_id_or_file>
    python scripts/blog/blog_wordcount.py 0001
    python scripts/blog/blog_wordcount.py content/blog/0001-*.md
    python scripts/blog/blog_wordcount.py --all              # Check all posts
    python scripts/blog/blog_wordcount.py --fix <post_id>    # Fix readTime in file
"""

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
    """Process a single post and return word count info."""
    content = file_path.read_text()
    body = extract_body(content)
    word_count = count_words(body)
    suggested_time = calculate_read_time(word_count)
    current_time = get_current_read_time(content)

    result = {
        'file': file_path.name,
        'word_count': word_count,
        'suggested_time': suggested_time,
        'current_time': current_time,
        'needs_update': current_time != suggested_time
    }

    if fix and result['needs_update']:
        # Update the readTime in the file
        if current_time:
            new_content = re.sub(
                r'(readTime:\s*)["\']?[^"\'"\n]+["\']?',
                f'readTime: "{suggested_time}"',
                content
            )
        else:
            # Add readTime after date if not present
            new_content = re.sub(
                r'(date:\s*[^\n]+)',
                f'\\1\nreadTime: "{suggested_time}"',
                content
            )
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
            if result['needs_update']:
                if fix_mode:
                    print("✅ Fixed!")
                else:
                    print("⚠️  Needs update (use --fix to update)")
            else:
                print("✅ readTime is correct")
        elif result['needs_update']:
            mismatches.append(result)

    if len(posts) > 1:
        print(f"Checked {len(posts)} posts")
        print(f"Found {len(mismatches)} with incorrect readTime")
        if mismatches and not fix_mode:
            print("\nMismatches:")
            for m in mismatches[:20]:
                print(f"  {m['file']}: {m['current_time']} → {m['suggested_time']} ({m['word_count']} words)")
            if len(mismatches) > 20:
                print(f"  ... and {len(mismatches) - 20} more")
            print("\nRun with --fix to update all")


if __name__ == '__main__':
    main()
