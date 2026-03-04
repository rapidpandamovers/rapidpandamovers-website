#!/usr/bin/env python3
"""
Generate excerpts from blog post body content for posts with empty excerpts.

Usage:
    python scripts/blog/blog_excerpts.py --all          # Check all posts
    python scripts/blog/blog_excerpts.py --all --fix    # Fix empty excerpts
    python scripts/blog/blog_excerpts.py <post_id>      # Check single post
    python scripts/blog/blog_excerpts.py --fix <post_id> # Fix single post
"""

import sys
import re
import glob
import math
from pathlib import Path

MAX_EXCERPT_LENGTH = 155


def extract_body(content: str) -> str:
    """Extract body content, excluding frontmatter."""
    parts = content.split('---', 2)
    if len(parts) >= 3:
        return parts[2].strip()
    return content


def get_first_paragraph(body: str) -> str:
    """Extract first meaningful paragraph from markdown body."""
    lines = body.split('\n')
    paragraph_lines = []

    for line in lines:
        stripped = line.strip()

        # Skip empty lines before first paragraph
        if not stripped and not paragraph_lines:
            continue

        # Skip headings
        if stripped.startswith('#'):
            if paragraph_lines:
                break
            continue

        # Skip images
        if stripped.startswith('!['):
            if paragraph_lines:
                break
            continue

        # Skip italic image captions
        if stripped.startswith('*') and stripped.endswith('*') and len(stripped) < 120:
            if paragraph_lines:
                break
            continue

        # Skip horizontal rules
        if stripped == '---':
            if paragraph_lines:
                break
            continue

        # Skip list items if we haven't started a paragraph
        if stripped.startswith('- ') and not paragraph_lines:
            continue

        # Empty line after collecting paragraph = end of paragraph
        if not stripped and paragraph_lines:
            break

        paragraph_lines.append(stripped)

    paragraph = ' '.join(paragraph_lines)

    # Clean markdown formatting
    paragraph = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', paragraph)  # links
    paragraph = re.sub(r'\*\*([^*]+)\*\*', r'\1', paragraph)  # bold
    paragraph = re.sub(r'\*([^*]+)\*', r'\1', paragraph)  # italic
    paragraph = re.sub(r'`([^`]+)`', r'\1', paragraph)  # code

    return paragraph


BAD_ENDING_WORDS = {'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for',
    'with', 'from', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'that', 'this',
    'these', 'those', 'its', 'your', 'their', 'our', 'my', 'his', 'her', 'which', 'who', 'whom',
    'what', 'when', 'where', 'how', 'than', 'as', 'if', 'not', 'no', 'so', 'into', 'about',
    'between', 'through', 'during', 'before', 'after', 'above', 'below', 'over', 'under'}


def truncate_to_excerpt(text: str, max_length: int = MAX_EXCERPT_LENGTH) -> str:
    """Truncate text to max length, preferring complete sentences or trailing ellipsis."""
    if not text:
        return ""

    if len(text) <= max_length:
        text = text.rstrip('.,;:!? ')
        if text and text[-1] not in '.!?':
            text += '.'
        return text

    # Try to end at the last complete sentence within max_length
    candidate = text[:max_length]
    best_end = -1
    for punct in ['. ', '! ', '? ']:
        idx = candidate.rfind(punct)
        if idx > best_end:
            best_end = idx

    if candidate.rstrip()[-1:] in '.!?':
        best_end = max(best_end, len(candidate.rstrip()) - 1)

    # Use complete sentence if it's long enough (at least 80 chars)
    if best_end >= 80:
        return text[:best_end + 1]

    # Otherwise truncate at word boundary and add ellipsis
    truncated = text[:max_length - 3]
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


def get_excerpt(content: str) -> str:
    """Extract excerpt from frontmatter."""
    match = re.search(r'excerpt:\s*["\']([^"\']*)["\']', content)
    return match.group(1).strip() if match else None


def find_post_file(post_id: str) -> Path:
    """Find post file by ID or glob pattern."""
    if Path(post_id).exists():
        return Path(post_id)
    padded = post_id.zfill(4)
    matches = glob.glob(f"content/blog/en/{padded}-*.md")
    if not matches:
        matches = glob.glob(f"content/blog/en/{padded}-*.md")
    if matches:
        return Path(matches[0])
    matches = glob.glob(f"content/blog/en/{post_id}-*.md")
    if not matches:
        matches = glob.glob(f"content/blog/en/{post_id}-*.md")
    if matches:
        return Path(matches[0])
    return None


def process_post(file_path: Path, fix: bool = False) -> dict:
    """Process a single post."""
    content = file_path.read_text()
    excerpt = get_excerpt(content)

    result = {
        'file': file_path.name,
        'has_excerpt': bool(excerpt),
        'excerpt': excerpt,
    }

    if not excerpt:
        body = extract_body(content)
        first_para = get_first_paragraph(body)
        generated = truncate_to_excerpt(first_para)
        result['generated'] = generated
        result['needs_fix'] = True

        if fix and generated:
            # Escape special characters for the replacement
            new_content = content.replace(
                'excerpt: ""',
                f'excerpt: "{generated}"',
                1
            )
            if new_content != content:
                file_path.write_text(new_content)
                result['fixed'] = True
            else:
                # Try single quotes
                new_content = content.replace(
                    "excerpt: ''",
                    f'excerpt: "{generated}"',
                    1
                )
                if new_content != content:
                    file_path.write_text(new_content)
                    result['fixed'] = True
    else:
        result['needs_fix'] = False

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
        files = sorted(glob.glob("content/blog/en/*.md"))
        if not files:
            files = sorted(glob.glob("content/blog/en/*.md"))
        posts = [Path(f) for f in files if not f.endswith('index.json') and not f.endswith('STATUS.md')]
    else:
        post_id = args[0]
        file_path = find_post_file(post_id)
        if not file_path:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)
        posts = [file_path]

    empty_count = 0
    fixed_count = 0
    failed_count = 0

    for post in posts:
        result = process_post(post, fix=fix_mode)

        if result.get('needs_fix'):
            empty_count += 1
            if fix_mode:
                if result.get('fixed'):
                    fixed_count += 1
                    print(f"  FIXED: {result['file']}")
                    print(f"         \"{result['generated']}\"")
                else:
                    failed_count += 1
                    print(f"  FAIL:  {result['file']} - could not generate excerpt")
            else:
                generated = result.get('generated', '(none)')
                print(f"  EMPTY: {result['file']}")
                if generated:
                    print(f"         Would set: \"{generated}\"")

    print(f"\nSummary:")
    print(f"  Total posts checked: {len(posts)}")
    print(f"  Empty excerpts: {empty_count}")
    if fix_mode:
        print(f"  Fixed: {fixed_count}")
        print(f"  Failed: {failed_count}")


if __name__ == '__main__':
    main()
