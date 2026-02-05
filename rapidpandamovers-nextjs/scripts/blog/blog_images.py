#!/usr/bin/env python3
"""
Download and rename images for blog posts with SEO-friendly names.

Usage:
    python scripts/blog/blog_images.py <post_id> [--download] [--rename] [--resize] [--count N]
    python scripts/blog/blog_images.py 0001 --download                    # Download random 3-5 images
    python scripts/blog/blog_images.py 0001 --download --count 5          # Download exactly 5 images
    python scripts/blog/blog_images.py 0001 --rename                      # Rename with SEO names
    python scripts/blog/blog_images.py 0001 --resize                      # Generate responsive sizes
    python scripts/blog/blog_images.py 0001 --download --rename --resize  # Full workflow

Options:
    --download   Download images using media-downloader
    --rename     Rename images with SEO-friendly names, randomly select featured image
    --resize     Generate responsive WebP sizes (calls blog_resize.py)
    --count N    Number of images (3-5). If omitted, randomly chosen for variety.

Features:
    - Random image count (3-5) when --count not specified for natural variation
    - Random featured image selection (not always the first image)
    - Auto-updates frontmatter with correct featured path
    - Converts all images to WebP format

Requires:
    - .claude/skills/media-downloader/media_cli.py for downloading
    - cwebp for WebP conversion (brew install webp)
"""

import sys
import os
import re
import glob
import subprocess
import shutil
import random
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent

# SEO-friendly suffixes for images (avoid 'featured' - reserved for featured.webp)
IMAGE_SUFFIXES = ['planning', 'tips', 'guide', 'checklist', 'steps', 'overview', 'essentials', 'process', 'supplies', 'preparation']


def check_cwebp() -> bool:
    """Check if cwebp is available."""
    result = subprocess.run(['which', 'cwebp'], capture_output=True)
    return result.returncode == 0


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def parse_frontmatter(content: str) -> dict:
    """Parse YAML frontmatter from markdown."""
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"\'')
            if value == 'null':
                value = None
            frontmatter[key] = value

    # Parse image_keywords as list
    if 'image_keywords' in content:
        keywords = re.findall(r'image_keywords:\s*\n((?:\s+-\s*"[^"]+"\n?)+)', content)
        if keywords:
            frontmatter['image_keywords'] = [
                k.strip().strip('"')
                for k in re.findall(r'-\s*"([^"]+)"', keywords[0])
            ]

    return frontmatter


def generate_seo_name(title: str, index: int, keywords: list = None) -> str:
    """Generate SEO-friendly image name from title/keywords.

    Returns filename WITHOUT extension (caller decides .webp, .jpeg, etc.)
    """
    # Use keywords if available, otherwise use title
    if keywords and len(keywords) >= 2:
        base = '-'.join(keywords[:3])
    else:
        # Clean title
        base = title.lower()
        # Remove year patterns (e.g., 2024, 2025)
        base = re.sub(r'\b20\d{2}\b', '', base)
        base = re.sub(r'[^a-z0-9\s-]', '', base)
        base = re.sub(r'\s+', '-', base)
        # Take first 4-5 significant words
        words = [w for w in base.split('-') if len(w) > 3][:4]
        base = '-'.join(words)

    base = base.lower().replace(' ', '-')
    base = re.sub(r'-+', '-', base).strip('-')

    # Use descriptive suffix
    suffix = IMAGE_SUFFIXES[index % len(IMAGE_SUFFIXES)]

    return f"{base}-{suffix}"


def download_images(image_folder: str, keywords: list, count: int = None) -> list:
    """Download images using media-downloader.

    Args:
        image_folder: Path relative to public/ where images go
        keywords: List of keywords to search for
        count: Number of images to download (3-5). If None, randomly chosen.
    """
    # Randomize count if not specified (weighted towards 4)
    if count is None:
        count = random.choices([3, 4, 5], weights=[25, 50, 25])[0]
    else:
        # Clamp to 3-5 range
        count = max(3, min(5, count))

    output_dir = PROJECT_ROOT / f"public{image_folder}"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Build keyword string
    keyword_str = ' '.join(keywords) if keywords else 'moving boxes packing'

    # Run media downloader
    media_cli = PROJECT_ROOT / ".claude/skills/media-downloader/media_cli.py"
    if not media_cli.exists():
        print(f"Error: media_cli.py not found at {media_cli}")
        return []

    cmd = [
        sys.executable, str(media_cli),
        'image', keyword_str,
        '-n', str(count),
        '-o', str(output_dir)
    ]

    print(f"Downloading {count} images for: {keyword_str}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)

    # Return list of downloaded files
    downloaded = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        downloaded.extend(output_dir.glob(ext))
    return downloaded


def convert_to_webp(source: Path, output_path: Path = None, quality: int = 85) -> Path:
    """Convert image to WebP format using cwebp."""
    if output_path is None:
        output_path = source.parent / f"{source.stem}.webp"

    # Skip if source is already webp
    if source.suffix.lower() == '.webp':
        if source != output_path:
            shutil.copy(str(source), str(output_path))
        return output_path

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


def rename_images(image_folder: str, title: str, keywords: list, max_images: int = None) -> dict:
    """Rename images in folder with SEO-friendly names and convert to WebP.

    Args:
        image_folder: Path relative to public/ where images are
        title: Post title for generating names
        keywords: List of keywords for generating names
        max_images: Maximum images to process (3-5). If None, uses available count.

    Returns:
        dict with 'renamed' (list of paths) and 'featured_path' (relative path for frontmatter)
    """
    result = {'renamed': [], 'featured_path': None}

    if not check_cwebp():
        print("Warning: cwebp not found. Install with: brew install webp")
        print("Images will not be converted to WebP.")

    image_dir = PROJECT_ROOT / f"public{image_folder}"
    if not image_dir.exists():
        print(f"Error: Image directory not found: {image_dir}")
        return result

    # Get existing images (exclude already-renamed responsive sizes and featured.webp)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        for f in image_dir.glob(ext):
            # Skip responsive sizes (contain -NNNw.)
            if re.search(r'-\d+w\.', f.name):
                continue
            # Skip existing featured.webp (we'll recreate it)
            if f.name == 'featured.webp':
                continue
            # Skip already-named SEO images with our suffixes
            if not any(f.stem.endswith(f'-{s}') for s in IMAGE_SUFFIXES):
                images.append(f)

    # Also include SEO-named images that haven't been converted to WebP
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        for f in image_dir.glob(ext):
            if any(f.stem.endswith(f'-{s}') for s in IMAGE_SUFFIXES):
                if f not in images:
                    images.append(f)

    if not images:
        # Check if we have existing WebP images with SEO names
        existing_webp = [f for f in image_dir.glob('*.webp')
                        if not re.search(r'-\d+w\.', f.name) and f.name != 'featured.webp']
        if existing_webp:
            # Pick a random one for featured (for variety) - keep its SEO name
            featured_source = random.choice(existing_webp)
            result['renamed'] = existing_webp
            result['featured_path'] = f"{image_folder}/{featured_source.name}"
            print(f"Selected featured image: {featured_source.name}")
            return result
        print("No images found to rename")
        return result

    # Determine how many images to process
    if max_images is None:
        max_images = min(len(images), random.choices([3, 4, 5], weights=[25, 50, 25])[0])
    else:
        max_images = max(3, min(5, max_images))

    # Shuffle images to get variety, then take max_images
    random.shuffle(images)
    images_to_process = images[:max_images]

    renamed = []
    originals_to_delete = []

    for i, img in enumerate(images_to_process):
        # Generate SEO-friendly name with variety in suffixes
        suffix_index = (i + random.randint(0, 2)) % len(IMAGE_SUFFIXES)
        new_stem = generate_seo_name(title, suffix_index, keywords)
        new_name = f"{new_stem}.webp"
        new_path = img.parent / new_name

        # Avoid name collisions
        counter = 1
        while new_path.exists() and new_path not in renamed:
            new_stem = generate_seo_name(title, suffix_index + counter, keywords)
            new_name = f"{new_stem}.webp"
            new_path = img.parent / new_name
            counter += 1

        # Convert to WebP if needed
        if img.suffix.lower() != '.webp':
            if check_cwebp():
                print(f"Converting: {img.name} → {new_name}")
                webp_path = convert_to_webp(img, new_path)
                if webp_path:
                    renamed.append(webp_path)
                    originals_to_delete.append(img)
                else:
                    print(f"  Warning: Conversion failed for {img.name}")
                    renamed.append(img)
            else:
                # Just rename without conversion
                print(f"Renaming: {img.name} → {img.stem}.{img.suffix}")
                renamed.append(img)
        elif img.name != new_name:
            # Already WebP, just rename
            print(f"Renaming: {img.name} → {new_name}")
            shutil.move(str(img), str(new_path))
            renamed.append(new_path)
        else:
            renamed.append(img)

    # Select a RANDOM image for featured (not always the first one!)
    # Keep its SEO-friendly name instead of copying to featured.webp
    if renamed:
        webp_images = [r for r in renamed if r.suffix.lower() == '.webp']
        if webp_images:
            # Randomly select which image becomes featured
            featured_source = random.choice(webp_images)
            result['featured_path'] = f"{image_folder}/{featured_source.name}"
            print(f"Selected featured image: {featured_source.name}")

    # Clean up original JPEG/PNG files
    for orig in originals_to_delete:
        if orig.exists():
            orig.unlink()
            print(f"Cleaned up: {orig.name}")

    result['renamed'] = renamed
    return result


def resize_images(post_id: str) -> bool:
    """Call blog_resize.py to generate responsive sizes."""
    resize_script = PROJECT_ROOT / "scripts/blog/blog_resize.py"
    if not resize_script.exists():
        print(f"Error: blog_resize.py not found")
        return False

    print(f"\nGenerating responsive sizes...")
    result = subprocess.run(
        [sys.executable, str(resize_script), post_id],
        capture_output=False
    )
    return result.returncode == 0


def update_frontmatter(post_file: Path, field: str, value: str) -> bool:
    """Update a frontmatter field in the post file."""
    content = post_file.read_text()

    # Check if field exists
    pattern = rf'^{field}:\s*.*$'
    if re.search(pattern, content, re.MULTILINE):
        # Replace existing field
        content = re.sub(pattern, f'{field}: "{value}"', content, flags=re.MULTILINE)
    else:
        # Add field after the first ---
        content = content.replace('---\n', f'---\n{field}: "{value}"\n', 1)

    post_file.write_text(content)
    return True


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    # Parse --count option (None means random)
    count = None
    if '--count' in args:
        idx = args.index('--count')
        if idx + 1 < len(args):
            try:
                count = int(args[idx + 1])
                count = max(3, min(5, count))  # Clamp to 3-5
            except ValueError:
                pass
            args = args[:idx] + args[idx + 2:]

    post_id = args[0]
    do_download = '--download' in args
    do_rename = '--rename' in args
    do_resize = '--resize' in args

    if not do_download and not do_rename and not do_resize:
        print("Specify --download, --rename, and/or --resize")
        sys.exit(1)

    # Find post
    post_file = find_post_file(post_id)
    if not post_file:
        print(f"Error: Could not find post {post_id}")
        sys.exit(1)

    content = post_file.read_text()
    frontmatter = parse_frontmatter(content)

    title = frontmatter.get('title', 'blog-post')
    image_folder = frontmatter.get('image_folder')
    keywords = frontmatter.get('image_keywords', [])

    if not image_folder:
        print("Error: Post has no image_folder in frontmatter")
        sys.exit(1)

    print(f"Post: {post_file.name}")
    print(f"Title: {title}")
    print(f"Image folder: {image_folder}")
    print(f"Keywords: {keywords}")
    print(f"Image count: {count if count else 'random (3-5)'}")
    print()

    featured_path = None

    if do_download:
        downloaded = download_images(image_folder, keywords, count)
        print(f"\nDownloaded {len(downloaded)} images")

    if do_rename:
        result = rename_images(image_folder, title, keywords, count)
        renamed = result.get('renamed', [])
        featured_path = result.get('featured_path')
        print(f"\nRenamed/converted {len(renamed)} images:")
        for img in renamed:
            print(f"  {img.name}")

        # Update featured path in frontmatter if we have one
        if featured_path:
            update_frontmatter(post_file, 'featured', featured_path)
            print(f"\nUpdated featured path: {featured_path}")

    if do_resize:
        resize_images(post_id)


if __name__ == '__main__':
    main()
