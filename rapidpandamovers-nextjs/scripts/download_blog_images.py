#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Download images for blog posts using Lorem Picsum.

Uses consistent seeding based on slug/keywords for reproducible images.

Folder structure:
  public/images/blog/
  ├── 2026/
  │   ├── 02/
  │   │   ├── post-slug/
  │   │   │   ├── featured.jpg
  │   │   │   └── image-1.jpg (if extra images requested)

Usage:
  python scripts/download_blog_images.py
  python scripts/download_blog_images.py --extra-images 2
  python scripts/download_blog_images.py --dry-run
"""

import json
import sys
import time
import argparse
import hashlib
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


def get_seed_from_keywords(keywords, slug, suffix=""):
    """Generate a consistent seed from keywords and slug for varied but reproducible images."""
    seed_str = f"{'-'.join(keywords)}{slug}{suffix}"
    return int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16) % 1000


def download_image(url, filepath, dry_run=False):
    """Download an image from URL to filepath."""
    if dry_run:
        print(f"    [DRY RUN] Would download: {url[:80]}...")
        return True

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        request = Request(url, headers=headers)

        with urlopen(request, timeout=30) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        return True
    except (URLError, HTTPError) as e:
        print(f"    Error: {e}")
        return False
    except Exception as e:
        print(f"    Unexpected error: {e}")
        return False


def ensure_directory(path):
    """Create directory if it doesn't exist."""
    Path(path).mkdir(parents=True, exist_ok=True)


def get_image_url(seed, width=1280, height=720):
    """
    Get image URL using Lorem Picsum.

    Lorem Picsum provides reliable placeholder images.
    Using seed ensures consistent images for the same post.
    """
    # Lorem Picsum URL with seed for reproducibility
    url = f"https://picsum.photos/seed/{seed}/{width}/{height}"
    return url


def main():
    parser = argparse.ArgumentParser(description="Download relevant blog post images")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be downloaded")
    parser.add_argument("--force", action="store_true", help="Re-download existing images")
    parser.add_argument("--limit", type=int, help="Limit number of posts to process")
    parser.add_argument("--extra-images", type=int, default=0,
                        help="Number of additional images per post (default: 0)")
    args = parser.parse_args()

    # Load posts
    posts_path = Path(__file__).parent.parent / "data" / "posts.json"
    if not posts_path.exists():
        print(f"Error: {posts_path} not found. Run generate_blog_posts.py first.")
        sys.exit(1)

    with open(posts_path, "r", encoding="utf-8") as f:
        posts = json.load(f)

    print(f"Found {len(posts)} posts")
    if args.extra_images:
        print(f"Will download {1 + args.extra_images} images per post")

    base_path = Path(__file__).parent.parent / "public"

    downloaded = 0
    skipped = 0
    failed = 0

    posts_to_process = posts[:args.limit] if args.limit else posts

    for i, post in enumerate(posts_to_process, 1):
        image_folder = post.get("image_folder")
        if not image_folder:
            image_path = post["image"]
            image_folder = str(Path(image_path).parent)

        folder_path = base_path / image_folder.lstrip("/")
        ensure_directory(folder_path)

        # Get keywords for relevant image
        keywords = post.get("image_keywords", ["moving", "home", "miami"])

        # Download featured image
        featured_path = folder_path / "featured.jpg"

        print(f"[{i}/{len(posts_to_process)}] {post['title'][:50]}...")
        print(f"    Keywords: {', '.join(keywords)}")

        if featured_path.exists() and not args.force:
            print(f"    Skipping (exists)")
            skipped += 1
        else:
            seed = get_seed_from_keywords(keywords, post["slug"])
            url = get_image_url(seed)

            if download_image(url, featured_path, args.dry_run):
                downloaded += 1
                if not args.dry_run:
                    time.sleep(0.3)  # Be nice to Lorem Picsum
            else:
                failed += 1

        # Download additional images if requested
        for img_num in range(1, args.extra_images + 1):
            extra_path = folder_path / f"image-{img_num}.jpg"

            if extra_path.exists() and not args.force:
                skipped += 1
            else:
                seed = get_seed_from_keywords(keywords, post["slug"], suffix=f"-{img_num}")
                url = get_image_url(seed)

                if download_image(url, extra_path, args.dry_run):
                    downloaded += 1
                    if not args.dry_run:
                        time.sleep(0.3)
                else:
                    failed += 1

    print("\n" + "=" * 50)
    print("Summary:")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped (existing): {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total: {downloaded + skipped + failed}")

    if args.dry_run:
        print("\n[DRY RUN] No images were actually downloaded.")


if __name__ == "__main__":
    main()
