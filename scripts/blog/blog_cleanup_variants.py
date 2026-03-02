#!/usr/bin/env python3
"""
Remove unused responsive image variants from public/images/blog/.

Next.js <Image> and Cloudflare Image Resizing handle responsive sizing,
so the pre-generated -400w, -800w, -1200w, -1600w WebP variants are dead files.

Usage:
    python scripts/blog/blog_cleanup_variants.py            # dry run
    python scripts/blog/blog_cleanup_variants.py --execute   # delete files
"""

import sys
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
BLOG_IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "blog"

VARIANT_PATTERN = re.compile(r'-\d+w\.webp$')


def find_variants(image_dir: Path) -> list[Path]:
    """Find all responsive variant files (*-NNNw.webp)."""
    variants = []
    for f in image_dir.rglob('*.webp'):
        if VARIANT_PATTERN.search(f.name):
            variants.append(f)
    return sorted(variants)


def main():
    execute = '--execute' in sys.argv

    if not BLOG_IMAGES_DIR.exists():
        print(f"Error: {BLOG_IMAGES_DIR} not found")
        sys.exit(1)

    variants = find_variants(BLOG_IMAGES_DIR)

    if not variants:
        print("No responsive variants found.")
        return

    total_bytes = sum(f.stat().st_size for f in variants)
    total_mb = total_bytes / (1024 * 1024)

    print(f"Found {len(variants)} responsive variant files")
    print(f"Total size: {total_mb:.1f} MB")
    print()

    # Breakdown by size
    from collections import Counter
    size_counts = Counter()
    for f in variants:
        match = re.search(r'-(\d+)w\.webp$', f.name)
        if match:
            size_counts[f"{match.group(1)}w"] += 1

    for size, count in sorted(size_counts.items(), key=lambda x: int(x[0].rstrip('w'))):
        print(f"  -{size}.webp: {count} files")

    print()

    if execute:
        deleted = 0
        for f in variants:
            f.unlink()
            deleted += 1
        print(f"Deleted {deleted} files, freed {total_mb:.1f} MB")
    else:
        print("Dry run — no files deleted. Use --execute to delete.")


if __name__ == '__main__':
    main()
