#!/usr/bin/env python3
"""
Complete blog post processing workflow.

Usage:
    python scripts/blog/blog_process.py <post_id>
    python scripts/blog/blog_process.py 0001
    python scripts/blog/blog_process.py 0001 --validate-only   # Just validate, no changes
    python scripts/blog/blog_process.py 0001 --images-only     # Just process images
    python scripts/blog/blog_process.py 0001 --skip-images     # Skip image processing
    python scripts/blog/blog_process.py 0001 --complete        # Mark as completed after processing

Workflow Steps:
    1. Read and classify post (LOCATION_GUIDE, SERVICE_GUIDE, HOW_TO, LISTICLE, LIFESTYLE)
    2. Validate post (AI patterns, frontmatter, sections)
    3. Check/download images
    4. Rename images with SEO names
    5. Convert to WebP and generate responsive sizes
    6. Update frontmatter (images, featured, status)
    7. Calculate and update readTime

This script orchestrates the full workflow without requiring manual bash commands.
"""

import sys
import re
import os
import subprocess
import glob
import shutil
import random
from pathlib import Path
from datetime import datetime

# Project root (scripts/blog -> scripts -> project root)
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Import validation functions from same directory
from blog_validate import (
    parse_frontmatter,
    classify_post,
    check_ai_patterns,
    validate_post,
    AI_PATTERNS,
)

# Post type constants
POST_TYPES = {
    'LOCATION_GUIDE': 'BAB framework (Before/After/Bridge)',
    'SERVICE_GUIDE': 'PAS framework (Problem/Agitate/Solution)',
    'HOW_TO': '4Cs framework (Clear/Concise/Compelling/Credible)',
    'LISTICLE': 'Value-first (strongest items first)',
    'LIFESTYLE': 'AIDA framework (Attention/Interest/Desire/Action)',
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


def read_post(file_path: Path) -> tuple:
    """Read post and return content, frontmatter, and body."""
    content = file_path.read_text()
    fm = parse_frontmatter(content)

    # Extract body (content after second ---)
    parts = content.split('---', 2)
    body = parts[2].strip() if len(parts) > 2 else ""

    return content, fm, body


def update_frontmatter_field(content: str, field: str, value) -> str:
    """Update a single frontmatter field."""
    # Handle different value types
    if value is None:
        value_str = "null"
    elif isinstance(value, bool):
        value_str = "true" if value else "false"
    elif isinstance(value, list):
        if not value:
            value_str = "[]"
        else:
            value_str = "\n" + "\n".join(f'  - "{v}"' for v in value)
    elif isinstance(value, str) and '\n' not in str(value):
        value_str = f'"{value}"'
    else:
        value_str = str(value)

    # Find the frontmatter section
    fm_match = re.match(r'^(---\n)(.*?)(\n---)', content, re.DOTALL)
    if not fm_match:
        return content

    fm_content = fm_match.group(2)

    # Check if field exists
    field_pattern = rf'^{field}:.*?(?=\n[a-z_]+:|$)'
    if re.search(field_pattern, fm_content, re.MULTILINE | re.DOTALL):
        # Replace existing field
        if isinstance(value, list) and value:
            # Multi-line list replacement
            new_fm = re.sub(
                rf'^{field}:.*?(?=\n[a-z_]+:|\Z)',
                f'{field}:{value_str}',
                fm_content,
                flags=re.MULTILINE | re.DOTALL
            )
        else:
            new_fm = re.sub(
                rf'^{field}:.*$',
                f'{field}: {value_str}',
                fm_content,
                flags=re.MULTILINE
            )
    else:
        # Add new field before the closing ---
        new_fm = fm_content + f'\n{field}: {value_str}'

    return fm_match.group(1) + new_fm + fm_match.group(3) + content[fm_match.end():]


def get_image_dir(fm: dict) -> Path:
    """Get the image directory from frontmatter."""
    image_folder = fm.get('image_folder')
    if not image_folder:
        return None
    return PROJECT_ROOT / f"public{image_folder}"


def check_images_exist(image_dir: Path) -> dict:
    """Check what images exist in the directory."""
    result = {
        'exists': image_dir.exists() if image_dir else False,
        'webp_files': [],
        'source_files': [],
        'responsive_files': [],
    }

    if not image_dir or not image_dir.exists():
        return result

    for f in image_dir.iterdir():
        if f.suffix.lower() == '.webp':
            if re.search(r'-\d+w\.webp$', f.name):
                result['responsive_files'].append(f.name)
            else:
                result['webp_files'].append(f.name)
        elif f.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            result['source_files'].append(f.name)

    return result


def run_script(script_name: str, args: list, capture_output: bool = True) -> tuple:
    """Run a Python script and return (success, output)."""
    script_path = PROJECT_ROOT / "scripts" / "blog" / script_name
    cmd = [sys.executable, str(script_path)] + args

    try:
        result = subprocess.run(
            cmd,
            capture_output=capture_output,
            text=True,
            cwd=str(PROJECT_ROOT)
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)


def download_images(post_id: str, count: int = None) -> tuple:
    """Download images using blog_images.py.

    Args:
        post_id: Post ID to process
        count: Number of images (3-5). If None, randomly chosen.
    """
    args = [post_id, '--download']
    if count is not None:
        args.extend(['--count', str(count)])
    success, output = run_script('blog_images.py', args)
    return success, output


def rename_images(post_id: str, count: int = None) -> tuple:
    """Rename images with SEO names using blog_images.py.

    Args:
        post_id: Post ID to process
        count: Max images to process. If None, randomly chosen.
    """
    args = [post_id, '--rename']
    if count is not None:
        args.extend(['--count', str(count)])
    success, output = run_script('blog_images.py', args)
    return success, output


def fix_image_paths(file_path: Path, fm: dict) -> str:
    """Fix image_folder and featured paths in frontmatter.

    Ensures:
    - image_folder matches the post slug
    - featured path is full path (not just 'featured.webp')
    - featured uses .webp extension
    """
    content = file_path.read_text()
    image_folder = fm.get('image_folder')
    featured = fm.get('featured')
    slug = fm.get('slug')
    date = fm.get('date', '')

    if not image_folder or not slug:
        return content

    changes_made = False

    # Extract year/month from date for the correct path
    if date and len(date) >= 7:
        year = date[:4]
        month = date[5:7]
    else:
        year = '2024'
        month = '01'

    # Check if image_folder matches the slug
    expected_folder = f"/images/blog/{year}/{month}/{slug}"
    if image_folder != expected_folder:
        old_dir = PROJECT_ROOT / f"public{image_folder}"
        new_dir = PROJECT_ROOT / f"public{expected_folder}"

        # Move directory if it exists
        if old_dir.exists() and not new_dir.exists():
            new_dir.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(old_dir), str(new_dir))
            print(f"  Moved image folder: {image_folder} → {expected_folder}")

        # Update frontmatter
        content = re.sub(
            r'^image_folder:\s*["\']?[^"\'"\n]*["\']?$',
            f'image_folder: "{expected_folder}"',
            content,
            flags=re.MULTILINE
        )
        image_folder = expected_folder
        changes_made = True

    # Fix featured path if it's truncated or uses wrong extension
    if featured:
        # If featured doesn't start with the image_folder path, fix it
        if not featured.startswith(image_folder):
            # Try to find an existing WebP image to use
            img_dir = PROJECT_ROOT / f"public{image_folder}"
            if img_dir.exists():
                webp_files = [f for f in img_dir.glob('*.webp')
                             if not re.search(r'-\d+w\.', f.name)]
                if webp_files:
                    new_featured = f"{image_folder}/{webp_files[0].name}"
                    content = re.sub(
                        r'^featured:\s*["\']?[^"\'"\n]*["\']?$',
                        f'featured: "{new_featured}"',
                        content,
                        flags=re.MULTILINE
                    )
                    changes_made = True
                    print(f"  Fixed featured path: {featured} → {new_featured}")
        # If featured uses .jpg/.jpeg/.png, change to .webp
        elif not featured.endswith('.webp'):
            new_featured = re.sub(r'\.(jpg|jpeg|png)$', '.webp', featured)
            content = re.sub(
                r'^featured:\s*["\']?[^"\'"\n]*["\']?$',
                f'featured: "{new_featured}"',
                content,
                flags=re.MULTILINE
            )
            changes_made = True
            print(f"  Fixed featured extension: {featured} → {new_featured}")

    if changes_made:
        file_path.write_text(content)

    return content


def embed_images_in_body(file_path: Path, fm: dict) -> bool:
    """Embed images into the post body content.

    Distributes images throughout the content after major headings.
    Excludes the featured image to avoid duplication (it's shown in the hero).
    Returns True if images were embedded.
    """
    content = file_path.read_text()
    image_folder = fm.get('image_folder')
    featured = fm.get('featured', '')
    title = fm.get('title', '')

    if not image_folder:
        return False

    image_dir = PROJECT_ROOT / f"public{image_folder}"
    if not image_dir.exists():
        return False

    # Get the featured image filename to exclude it
    featured_filename = featured.split('/')[-1] if featured else ''

    # Get WebP images (excluding featured and responsive sizes)
    webp_files = sorted([
        f for f in image_dir.glob('*.webp')
        if not re.search(r'-\d+w\.', f.name) and f.name != featured_filename
    ])

    if not webp_files:
        return False

    # Check if images are already embedded
    existing_images = re.findall(r'!\[.*?\]\([^)]+\)', content)
    if len(existing_images) >= len(webp_files):
        print(f"  Images already embedded ({len(existing_images)} found)")
        return False

    # Split content into frontmatter and body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    frontmatter = parts[1]
    body = parts[2]

    # Find all ## headings to place images after
    headings = list(re.finditer(r'^## .+$', body, re.MULTILINE))

    if not headings:
        return False

    # Distribute images evenly throughout content
    images_to_embed = webp_files[:5]  # Max 5 images in body
    num_images = len(images_to_embed)
    num_headings = len(headings)

    # Calculate which headings get images (spread evenly)
    if num_headings <= num_images:
        heading_indices = list(range(num_headings))
    else:
        step = num_headings / num_images
        heading_indices = [int(i * step) for i in range(num_images)]

    # Build new body with images inserted
    new_body = body
    offset = 0

    for img_idx, heading_idx in enumerate(heading_indices):
        if heading_idx >= len(headings):
            continue

        heading = headings[heading_idx]
        img = images_to_embed[img_idx]

        # Generate alt text from image filename
        alt_text = img.stem.replace('-', ' ').title()

        # Create image markdown
        img_path = f"{image_folder}/{img.name}"
        img_markdown = f"\n\n![{alt_text}]({img_path})\n"

        # Find the end of the paragraph after this heading
        heading_end = heading.end() + offset
        next_para_end = new_body.find('\n\n', heading_end + 1)

        if next_para_end == -1:
            next_para_end = len(new_body)

        # Insert image after the first paragraph following the heading
        insert_pos = next_para_end
        new_body = new_body[:insert_pos] + img_markdown + new_body[insert_pos:]
        offset += len(img_markdown)

    # Reconstruct content
    new_content = f"---{frontmatter}---{new_body}"
    file_path.write_text(new_content)

    print(f"  Embedded {len(heading_indices)} images in body")
    return True


def update_images_frontmatter(file_path: Path, fm: dict) -> bool:
    """Update the images array in frontmatter with actual image files."""
    content = file_path.read_text()
    image_folder = fm.get('image_folder')

    if not image_folder:
        return False

    image_dir = PROJECT_ROOT / f"public{image_folder}"
    if not image_dir.exists():
        return False

    # Get all WebP images (excluding responsive sizes)
    webp_files = sorted([
        f"{image_folder}/{f.name}"
        for f in image_dir.glob('*.webp')
        if not re.search(r'-\d+w\.', f.name)
    ])

    if not webp_files:
        return False

    # Update images array in frontmatter
    content = update_frontmatter_field(content, 'images', webp_files)
    file_path.write_text(content)

    print(f"  Updated images array with {len(webp_files)} files")
    return True


def resize_images(post_id: str) -> tuple:
    """Generate responsive sizes using blog_resize.py."""
    success, output = run_script('blog_resize.py', [post_id])
    return success, output


def update_wordcount(post_id: str) -> tuple:
    """Update readTime using blog_wordcount.py."""
    success, output = run_script('blog_wordcount.py', [post_id, '--fix'])
    return success, output


def process_post(post_id: str, options: dict) -> dict:
    """Process a single post through the full workflow."""
    results = {
        'post_id': post_id,
        'success': True,
        'steps': [],
        'errors': [],
        'warnings': [],
    }

    # Step 1: Find and read post
    file_path = find_post_file(post_id)
    if not file_path:
        results['success'] = False
        results['errors'].append(f"Could not find post {post_id}")
        return results

    results['file'] = str(file_path)
    content, fm, body = read_post(file_path)

    # Step 2: Classify post
    title = fm.get('title', '')
    post_type = classify_post(title, body)
    results['post_type'] = post_type
    results['framework'] = POST_TYPES.get(post_type, 'Unknown')
    results['steps'].append(f"Classified as {post_type}")

    # Step 3: Validate post
    validation = validate_post(file_path)
    results['validation'] = validation

    if validation['errors']:
        results['steps'].append(f"Validation found {len(validation['errors'])} errors")
        for err in validation['errors']:
            results['warnings'].append(f"Validation: {err}")
    else:
        results['steps'].append("Validation passed")

    # If validate-only, stop here
    if options.get('validate_only'):
        return results

    # Step 4: Process images (unless skipped)
    if not options.get('skip_images'):
        image_dir = get_image_dir(fm)
        images_info = check_images_exist(image_dir)

        # Random image count for variety (3-5, weighted towards 4)
        image_count = random.choices([3, 4, 5], weights=[25, 50, 25])[0]
        results['steps'].append(f"Image count: {image_count}")

        # Download if needed
        if not images_info['webp_files'] and not images_info['source_files']:
            results['steps'].append("Downloading images...")
            success, output = download_images(post_id, image_count)
            if success:
                results['steps'].append("Images downloaded")
            else:
                results['warnings'].append(f"Image download issue: {output[:100]}")
                # Update needs_ai_image flag
                content = update_frontmatter_field(content, 'needs_ai_image', True)

        # Rename images (with random featured selection for variety)
        images_info = check_images_exist(image_dir)
        if images_info['source_files'] or (images_info['webp_files'] and not any('featured' in f for f in images_info['webp_files'])):
            results['steps'].append("Renaming images with SEO names...")
            success, output = rename_images(post_id, image_count)
            if success:
                results['steps'].append("Images renamed (random featured selected)")
            else:
                results['warnings'].append(f"Image rename issue: {output[:100]}")

        # Generate responsive sizes
        images_info = check_images_exist(image_dir)
        if images_info['webp_files'] and not images_info['responsive_files']:
            results['steps'].append("Generating responsive sizes...")
            success, output = resize_images(post_id)
            if success:
                results['steps'].append("Responsive sizes generated")
            else:
                results['warnings'].append(f"Resize issue: {output[:100]}")

        # Fix image paths in frontmatter (ensure full path, .webp extension, matching slug)
        content, fm, body = read_post(file_path)
        fix_image_paths(file_path, fm)
        results['steps'].append("Image paths verified/fixed")

        # Re-read after path fixes
        content, fm, body = read_post(file_path)

        # Embed images in post body
        if embed_images_in_body(file_path, fm):
            results['steps'].append("Images embedded in body")

        # Update images array in frontmatter
        content, fm, body = read_post(file_path)
        if update_images_frontmatter(file_path, fm):
            results['steps'].append("Images array updated")

    # Step 5: Update frontmatter
    # Re-read to get any changes from image scripts
    content, fm, body = read_post(file_path)

    # Update status if completing
    if options.get('complete'):
        content = update_frontmatter_field(content, 'status', 'completed')
        content = update_frontmatter_field(content, 'updated', datetime.now().strftime('%Y-%m-%d'))
        results['steps'].append("Status set to completed")

    # Write changes
    file_path.write_text(content)

    # Step 6: Update word count
    results['steps'].append("Calculating readTime...")
    success, output = update_wordcount(post_id)
    if success:
        results['steps'].append("readTime updated")
    else:
        results['warnings'].append(f"Word count issue: {output[:100]}")

    # Final validation
    final_validation = validate_post(file_path)
    if not final_validation['errors']:
        results['steps'].append("Final validation passed")
    else:
        results['success'] = False
        for err in final_validation['errors']:
            results['errors'].append(f"Final: {err}")

    return results


def print_results(results: dict):
    """Print processing results."""
    status_icon = '✅' if results['success'] else '❌'

    print(f"\n{status_icon} Post {results['post_id']}")
    print(f"   File: {results.get('file', 'Not found')}")
    print(f"   Type: {results.get('post_type', 'Unknown')}")
    print(f"   Framework: {results.get('framework', 'Unknown')}")

    print("\n   Steps:")
    for step in results['steps']:
        print(f"     ✓ {step}")

    if results['warnings']:
        print("\n   Warnings:")
        for warn in results['warnings']:
            print(f"     ⚠️  {warn}")

    if results['errors']:
        print("\n   Errors:")
        for err in results['errors']:
            print(f"     ❌ {err}")

    # Print AI patterns if found in validation
    if results.get('validation', {}).get('ai_patterns'):
        print("\n   AI Patterns Found:")
        for pattern, count in results['validation']['ai_patterns']:
            print(f"     🤖 {pattern}: {count}x")
        print("\n   To fix AI patterns, invoke: /seo-audit and /copywriting")


def print_usage():
    """Print usage information."""
    print(__doc__)
    print("\nExample workflow:")
    print("  1. python scripts/blog/blog_process.py 0001                    # Process post")
    print("  2. Review AI patterns and thin content warnings")
    print("  3. Invoke /seo-audit and /copywriting skills to fix content")
    print("  4. python scripts/blog/blog_process.py 0001 --complete         # Mark completed")


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print_usage()
        sys.exit(0 if args else 1)

    # Parse options
    options = {
        'validate_only': '--validate-only' in args,
        'images_only': '--images-only' in args,
        'skip_images': '--skip-images' in args,
        'complete': '--complete' in args,
    }

    # Get post ID (first non-flag argument)
    post_id = None
    for arg in args:
        if not arg.startswith('--'):
            post_id = arg
            break

    if not post_id:
        print("Error: No post ID provided")
        print_usage()
        sys.exit(1)

    # Process the post
    print(f"Processing post {post_id}...")
    results = process_post(post_id, options)
    print_results(results)

    # Exit with appropriate code
    sys.exit(0 if results['success'] else 1)


if __name__ == '__main__':
    main()
