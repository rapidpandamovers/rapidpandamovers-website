#!/usr/bin/env python3
"""
Find similar blog posts based on title and content.

Usage:
    python scripts/blog/blog_similar.py <post_id> [--limit N]
    python scripts/blog/blog_similar.py 0001
    python scripts/blog/blog_similar.py 0001 --limit 20
    python scripts/blog/blog_similar.py --title "senior moving tips"
"""

import sys
import re
import glob
from pathlib import Path
from collections import Counter

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Common words to exclude
STOP_WORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'your', 'our', 'their', 'its', 'my', 'his', 'her', 'this', 'that',
    'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
    'there', 'then', 'once', 'new', 'get', 'make', 'like', 'time', 'year',
    'way', 'day', 'thing', 'man', 'world', 'life', 'hand', 'part', 'place',
    'case', 'week', 'work', 'fact', 'being', 'issue', 'tips', 'guide',
    'ultimate', 'complete', 'essential', 'best', 'top', 'miami', 'florida'
}


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    if Path(post_id).exists():
        return Path(post_id)

    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def get_title(content: str) -> str:
    """Extract title from frontmatter."""
    match = re.search(r'title:\s*["\']?([^"\'"\n]+)["\']?', content)
    return match.group(1).strip() if match else ""


def get_post_id(content: str) -> int:
    """Extract ID from frontmatter."""
    match = re.search(r'^id:\s*(\d+)', content, re.MULTILINE)
    return int(match.group(1)) if match else 0


def tokenize(text: str) -> set:
    """Extract significant words from text."""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    words = text.split()
    return {w for w in words if len(w) >= 4 and w not in STOP_WORDS}


def jaccard_similarity(set1: set, set2: set) -> float:
    """Calculate Jaccard similarity between two sets."""
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0.0


def find_similar_posts(target_title: str, target_id: int = None, limit: int = 10) -> list:
    """Find posts similar to the given title."""
    target_tokens = tokenize(target_title)

    if not target_tokens:
        return []

    # Load all posts
    post_files = glob.glob(str(PROJECT_ROOT / "content/blog/*.md"))

    similarities = []
    for pf in post_files:
        content = Path(pf).read_text()
        post_id = get_post_id(content)
        title = get_title(content)

        # Skip the target post itself
        if target_id and post_id == target_id:
            continue

        post_tokens = tokenize(title)
        similarity = jaccard_similarity(target_tokens, post_tokens)

        if similarity > 0:
            common_words = target_tokens & post_tokens
            similarities.append({
                'id': post_id,
                'title': title,
                'file': Path(pf).name,
                'similarity': similarity,
                'common_words': common_words
            })

    # Sort by similarity descending
    similarities.sort(key=lambda x: x['similarity'], reverse=True)

    return similarities[:limit]


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    limit = 10
    if '--limit' in args:
        idx = args.index('--limit')
        limit = int(args[idx + 1])
        args = args[:idx] + args[idx + 2:]

    # Check for --title flag
    if args[0] == '--title':
        if len(args) < 2:
            print("Error: --title requires a search string")
            sys.exit(1)
        target_title = ' '.join(args[1:])
        target_id = None
        print(f"Searching for posts similar to: '{target_title}'")
    else:
        # Find post by ID
        post_id = args[0]
        post_file = find_post_file(post_id)
        if not post_file:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)

        content = post_file.read_text()
        target_title = get_title(content)
        target_id = get_post_id(content)

        print(f"Post {target_id}: {target_title}")
        print(f"File: {post_file.name}")

    print(f"\nFinding {limit} most similar posts...\n")

    similar = find_similar_posts(target_title, target_id, limit)

    if not similar:
        print("No similar posts found.")
        return

    print(f"{'ID':<6} {'Similarity':<12} {'Title'}")
    print("-" * 70)

    for post in similar:
        sim_pct = f"{post['similarity']*100:.1f}%"
        title = post['title'][:50] + "..." if len(post['title']) > 50 else post['title']
        print(f"{post['id']:<6} {sim_pct:<12} {title}")
        if post['common_words']:
            words = ', '.join(sorted(post['common_words']))[:60]
            print(f"       Common: {words}")


if __name__ == '__main__':
    main()
