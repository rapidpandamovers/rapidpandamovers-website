#!/usr/bin/env python3
"""
Batch download images for all blog posts that are missing images.

Usage:
    python scripts/blog/blog_images_batch.py              # Dry run - show which posts need images
    python scripts/blog/blog_images_batch.py --run         # Process all posts missing images
    python scripts/blog/blog_images_batch.py --run --limit 10  # Process first 10 posts
"""

import sys
import os
import glob
import re
import subprocess
import time
from pathlib import Path


def parse_frontmatter(content: str) -> dict:
    """Quick frontmatter parser."""
    fm = {}
    parts = content.split('---', 2)
    if len(parts) < 3:
        return fm

    for line in parts[1].strip().split('\n'):
        match = re.match(r'^(\w[\w_]*)\s*:\s*(.+)$', line)
        if match:
            key = match.group(1)
            val = match.group(2).strip().strip('"').strip("'")
            fm[key] = val
    return fm


def get_posts_needing_images() -> list:
    """Find all posts with missing image directories."""
    posts = []
    for filepath in sorted(glob.glob("content/blog/*.md")):
        if filepath.endswith('STATUS.md') or filepath.endswith('index.json'):
            continue

        path = Path(filepath)
        content = path.read_text()
        fm = parse_frontmatter(content)

        image_folder = fm.get('image_folder', '')
        status = fm.get('status', '')

        if not image_folder:
            continue

        # Check if image directory exists
        img_dir = Path('public') / image_folder.lstrip('/')
        if not img_dir.exists() or not any(img_dir.iterdir()):
            # Extract post ID from filename
            match = re.match(r'(\d+)-', path.name)
            post_id = match.group(1) if match else path.stem
            posts.append({
                'id': post_id,
                'file': path.name,
                'image_folder': image_folder,
                'status': status
            })

    return posts


def main():
    args = sys.argv[1:]
    run_mode = '--run' in args

    limit = None
    if '--limit' in args:
        idx = args.index('--limit')
        if idx + 1 < len(args):
            limit = int(args[idx + 1])

    posts = get_posts_needing_images()

    if not posts:
        print("All posts have images!")
        return

    print(f"Found {len(posts)} posts needing images")

    if limit:
        posts = posts[:limit]
        print(f"Processing first {limit} posts")

    if not run_mode:
        print("\nDry run - posts that need images:")
        for p in posts[:20]:
            print(f"  {p['id']} - {p['file']}")
        if len(posts) > 20:
            print(f"  ... and {len(posts) - 20} more")
        print(f"\nRun with --run to process all {len(posts)} posts")
        return

    success = 0
    failed = 0

    for i, post in enumerate(posts):
        print(f"\n{'='*60}")
        print(f"[{i+1}/{len(posts)}] Processing {post['file']}")
        print(f"{'='*60}")

        try:
            result = subprocess.run(
                ['python', 'scripts/blog/blog_images.py', post['id'], '--all'],
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                success += 1
                print(f"  SUCCESS")
            else:
                failed += 1
                print(f"  FAILED: {result.stderr[-200:] if result.stderr else 'Unknown error'}")

        except subprocess.TimeoutExpired:
            failed += 1
            print(f"  TIMEOUT after 120s")
        except Exception as e:
            failed += 1
            print(f"  ERROR: {e}")

        # Rate limiting - Pexels allows 200 requests/hour
        # Each post makes 1-2 API calls, so ~1.5s delay is safe
        if i < len(posts) - 1:
            time.sleep(1.5)

    print(f"\n{'='*60}")
    print(f"BATCH COMPLETE")
    print(f"  Processed: {len(posts)}")
    print(f"  Success: {success}")
    print(f"  Failed: {failed}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
