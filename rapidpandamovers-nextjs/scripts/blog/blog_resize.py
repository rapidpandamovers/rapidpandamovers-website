#!/usr/bin/env python3
"""
Generate responsive image sizes for blog posts in WebP format.

Usage:
    python scripts/blog/blog_resize.py <post_id>
    python scripts/blog/blog_resize.py 0001
    python scripts/blog/blog_resize.py content/blog/0001-*.md
    python scripts/blog/blog_resize.py --dir /path/to/images

Uses `cwebp` for WebP conversion (brew install webp) and macOS `sips` for resizing.

Output sizes optimized for responsive images:
- 400w: Mobile screens
- 800w: Mobile retina / Tablet
- 1200w: Desktop
- 1600w: Desktop retina / Large displays
"""

import sys
import os
import re
import glob
import subprocess
import shutil
from pathlib import Path

# Responsive sizes to generate (optimized per responsive-images skill)
SIZES = [400, 800, 1200, 1600]

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
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def get_image_folder(post_file: Path) -> str:
    """Extract image_folder from frontmatter."""
    content = post_file.read_text()
    match = re.search(r'image_folder:\s*["\']?([^"\'"\n]+)["\']?', content)
    return match.group(1).strip() if match else None


def get_image_dimensions(image_path: Path) -> tuple:
    """Get image dimensions using sips."""
    result = subprocess.run(
        ['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(image_path)],
        capture_output=True, text=True
    )
    width = height = 0
    for line in result.stdout.split('\n'):
        if 'pixelWidth' in line:
            width = int(line.split(':')[1].strip())
        elif 'pixelHeight' in line:
            height = int(line.split(':')[1].strip())
    return width, height


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


def resize_image(source: Path, width: int, output_dir: Path = None) -> Path:
    """Resize image to specified width and convert to WebP."""
    if output_dir is None:
        output_dir = source.parent

    # Generate output filename
    stem = source.stem
    # Remove any existing -NNNw suffix for clean naming
    stem = re.sub(r'-\d+w$', '', stem)

    output_path = output_dir / f"{stem}-{width}w.webp"

    # Skip if already exists
    if output_path.exists():
        return output_path

    # Get source dimensions
    src_width, src_height = get_image_dimensions(source)

    # Skip if source is smaller than target
    if src_width <= width:
        return None

    # Create temp resized file using sips
    # Use PNG as temp format since sips can't write WebP
    temp_ext = '.png' if source.suffix.lower() == '.webp' else source.suffix
    temp_path = output_dir / f"_temp_{width}w{temp_ext}"

    # For WebP sources, first convert to PNG using cwebp's sibling dwebp
    if source.suffix.lower() == '.webp':
        # Use cwebp in reverse (dwebp) or fall back to sips reading webp -> png
        subprocess.run(
            ['sips', '-s', 'format', 'png', str(source), '--out', str(temp_path)],
            capture_output=True
        )
        # Now resize the PNG
        resized_temp = output_dir / f"_temp_resized_{width}w.png"
        subprocess.run(
            ['sips', '-Z', str(width), str(temp_path), '--out', str(resized_temp)],
            capture_output=True
        )
        temp_path.unlink() if temp_path.exists() else None
        temp_path = resized_temp
    else:
        subprocess.run(
            ['sips', '-Z', str(width), str(source), '--out', str(temp_path)],
            capture_output=True
        )

    # Convert temp to WebP
    if temp_path.exists():
        convert_to_webp(temp_path, output_path)
        temp_path.unlink()  # Clean up temp file

    return output_path if output_path.exists() else None


def process_image_folder(image_dir: Path, cleanup: bool = True) -> dict:
    """Generate responsive sizes for all images in folder, converting to WebP.

    Args:
        image_dir: Directory containing images
        cleanup: If True, delete original JPEG/PNG files after conversion
    """
    results = {'processed': 0, 'skipped': 0, 'created': [], 'converted': [], 'cleaned': []}

    # Find source images (exclude responsive sizes)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        for f in image_dir.glob(ext):
            # Skip responsive sizes (contain -NNNw.)
            if not re.search(r'-\d+w\.', f.name):
                images.append(f)

    print(f"Found {len(images)} source images")

    for img in images:
        print(f"\nProcessing: {img.name}")
        src_width, src_height = get_image_dimensions(img)
        print(f"  Source: {src_width}x{src_height}")

        # Convert source to WebP if not already
        webp_source = img
        if img.suffix.lower() != '.webp':
            webp_path = convert_to_webp(img)
            if webp_path and webp_path.exists():
                print(f"  Converted to WebP: {webp_path.name}")
                results['converted'].append(webp_path)
                webp_source = webp_path

        # Generate responsive sizes from original (better quality)
        for size in SIZES:
            if size >= src_width:
                print(f"  {size}w: skipped (source too small)")
                results['skipped'] += 1
                continue

            output = resize_image(img, size)
            if output:
                print(f"  {size}w.webp: created")
                results['created'].append(output)
                results['processed'] += 1
            else:
                print(f"  {size}w: skipped")
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
    print(f"Generating sizes: {SIZES} (as WebP)")
    print(f"Cleanup originals: {cleanup}")
    print()

    results = process_image_folder(image_dir, cleanup=cleanup)

    print(f"\n{'='*40}")
    print(f"Converted {len(results.get('converted', []))} images to WebP")
    print(f"Created {results['processed']} responsive WebP images")
    print(f"Skipped {results['skipped']} (source too small)")
    print(f"Cleaned up {len(results.get('cleaned', []))} original files")

    # List WebP files
    webp_files = list(image_dir.glob('*.webp'))
    print(f"\nTotal WebP files: {len(webp_files)}")


if __name__ == '__main__':
    main()
