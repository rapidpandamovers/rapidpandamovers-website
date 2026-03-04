#!/usr/bin/env python3
"""
Convert blog post images to WebP format.

Usage:
    python scripts/blog/blog_resize.py <post_id>
    python scripts/blog/blog_resize.py 0001
    python scripts/blog/blog_resize.py content/blog/0001-*.md
    python scripts/blog/blog_resize.py --dir /path/to/images

Uses `cwebp` for WebP conversion (brew install webp).

Responsive sizing is handled at the edge by Cloudflare Image Resizing,
so this script only converts source images to WebP format.
"""

import sys
import re
import glob
import subprocess
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent


def check_cwebp() -> bool:
    """Check if cwebp is available."""
    result = subprocess.run(['which', 'cwebp'], capture_output=True)
    return result.returncode == 0


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    if Path(post_id).exists():
        return Path(post_id)

    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/en/{padded}-*.md"))
    if not matches:
        matches = glob.glob(str(PROJECT_ROOT / f"content/blog/en/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def get_image_folder(post_file: Path) -> str:
    """Extract image_folder from frontmatter."""
    content = post_file.read_text()
    match = re.search(r'image_folder:\s*["\']?([^"\'"\n]+)["\']?', content)
    return match.group(1).strip() if match else None


def convert_to_webp(source: Path, output_path: Path = None, quality: int = 85) -> Path:
    """Convert image to WebP format using cwebp."""
    if output_path is None:
        output_path = source.parent / f"{source.stem}.webp"

    # Skip if source is already webp
    if source.suffix.lower() == '.webp':
        return source

    # Skip if output already exists
    if output_path.exists():
        return output_path

    # Convert using cwebp
    result = subprocess.run(
        ['cwebp', '-q', str(quality), str(source), '-o', str(output_path)],
        capture_output=True, text=True
    )

    if result.returncode == 0 and output_path.exists():
        return output_path
    return None


def process_image_folder(image_dir: Path, cleanup: bool = True) -> dict:
    """Convert all images in folder to WebP format.

    Responsive sizing is handled by Cloudflare Image Resizing at the edge.

    Args:
        image_dir: Directory containing images
        cleanup: If True, delete original JPEG/PNG files after conversion
    """
    results = {'converted': [], 'skipped': 0, 'cleaned': []}

    # Find source images (exclude any leftover responsive sizes)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        for f in image_dir.glob(ext):
            if not re.search(r'-\d+w\.', f.name):
                images.append(f)

    print(f"Found {len(images)} images to convert")

    for img in images:
        print(f"\nProcessing: {img.name}")

        webp_path = convert_to_webp(img)
        if webp_path and webp_path.exists():
            print(f"  Converted to WebP: {webp_path.name}")
            results['converted'].append(webp_path)
        else:
            print(f"  Skipped (already WebP or failed)")
            results['skipped'] += 1

        # Clean up original JPEG/PNG if we converted to WebP
        if cleanup and img.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            webp_path = img.parent / f"{img.stem}.webp"
            if webp_path.exists():
                print(f"  Cleaned up: {img.name}")
                img.unlink()
                results['cleaned'].append(img)

    return results


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    # Check for cwebp
    if not check_cwebp():
        print("Error: cwebp not found. Install with: brew install webp")
        sys.exit(1)

    # Check for --no-cleanup flag
    cleanup = '--no-cleanup' not in args
    args = [a for a in args if a != '--no-cleanup']

    # Check for --dir flag
    if args[0] == '--dir':
        if len(args) < 2:
            print("Error: --dir requires a path")
            sys.exit(1)
        image_dir = Path(args[1])
    else:
        # Find post and get image folder
        post_id = args[0]
        post_file = find_post_file(post_id)
        if not post_file:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)

        image_folder = get_image_folder(post_file)
        if not image_folder:
            print("Error: Post has no image_folder in frontmatter")
            sys.exit(1)

        image_dir = PROJECT_ROOT / f"public{image_folder}"
        print(f"Post: {post_file.name}")
        print(f"Image folder: {image_folder}")

    if not image_dir.exists():
        print(f"Error: Image directory not found: {image_dir}")
        sys.exit(1)

    print(f"Directory: {image_dir}")
    print(f"Cleanup originals: {cleanup}")
    print()

    results = process_image_folder(image_dir, cleanup=cleanup)

    print(f"\n{'='*40}")
    print(f"Converted {len(results['converted'])} images to WebP")
    print(f"Skipped {results['skipped']}")
    print(f"Cleaned up {len(results['cleaned'])} original files")

    # List WebP files
    webp_files = list(image_dir.glob('*.webp'))
    print(f"\nTotal WebP files: {len(webp_files)}")


if __name__ == '__main__':
    main()
