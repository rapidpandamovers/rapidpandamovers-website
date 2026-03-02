#!/usr/bin/env python3
"""
Download, rename, embed, and manage images for blog posts.

Usage:
    python scripts/blog/blog_images.py <post_id> [options]

Download & Convert:
    python scripts/blog/blog_images.py 0001 --download                    # Download using image_keywords
    python scripts/blog/blog_images.py 0001 --download --query "elderly couple boxes"  # Custom query
    python scripts/blog/blog_images.py 0001 --download --count 5          # Download exactly 5 images
    python scripts/blog/blog_images.py 0001 --rename                      # Convert to WebP (keeps original names)
    python scripts/blog/blog_images.py 0001 --resize                      # Generate responsive sizes

Embed & Finalize:
    python scripts/blog/blog_images.py 0001 --embed                       # Embed images in post body
    python scripts/blog/blog_images.py 0001 --update-array                # Update images array in frontmatter
    python scripts/blog/blog_images.py 0001 --cleanup                     # Remove unused images
    python scripts/blog/blog_images.py 0001 --fix-paths                   # Fix image_folder/featured paths

Full Workflows:
    python scripts/blog/blog_images.py 0001 --download --rename --resize  # Download workflow
    python scripts/blog/blog_images.py 0001 --embed --update-array --cleanup  # Embed workflow
    python scripts/blog/blog_images.py 0001 --clean --download            # Clean first, then download
    python scripts/blog/blog_images.py 0001 --all                         # Full workflow (all steps)

Options:
    --clean          Remove ALL existing images (folder + frontmatter + body embeds)
    --download       Download images from Pexels API
    --rename         Convert to WebP format (keeps original names), select random featured
    --resize         Generate responsive WebP sizes (calls blog_resize.py)
    --embed          Embed images in post body after ## headings
    --update-array   Update images array in frontmatter
    --cleanup        Remove images not referenced in frontmatter/body
    --fix-paths      Fix image_folder and featured paths to match slug
    --all            Run full workflow: download, rename, resize, embed, update-array, cleanup
    --count N        Number of images (3-5). If omitted, randomly chosen for variety.
    --query "..."    Custom search query (USE SIMPLE 2-3 WORD TERMS!)

KEY LEARNINGS - Use SIMPLE search terms:
    GOOD: "elderly couple boxes", "senior packing", "family moving"
    BAD:  "gray haired elderly couple packing moving boxes for relocation"

    Stock photo APIs work better with basic 2-3 word keywords.
    If results don't match audience, try synonyms or scroll further in results.

Features:
    - Uses Pexels API directly (PEXELS_API_KEY from .env)
    - Random image count (3-5) when --count not specified for natural variation
    - Random featured image selection (not always the first image)
    - Auto-updates frontmatter with correct featured path
    - Converts all images to WebP format

Requires:
    - PEXELS_API_KEY in .env file (get free key at pexels.com/api)
    - cwebp for WebP conversion (brew install webp)
"""

import sys
import os
import re
import glob
import subprocess
import shutil
import random
import json
import ssl
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent.parent


# Simple query suggestions by post type (2-3 words work best!)
# NOTE: Avoid "boxes" alone as it gets confused with "boxing" sport
SIMPLE_QUERY_SUGGESTIONS = {
    'senior': ['elderly couple moving', 'senior packing', 'elderly new home', 'senior moving'],
    'family': ['family moving', 'family packing home', 'kids moving'],
    'student': ['student moving', 'college dorm', 'dorm packing'],
    'military': ['military family', 'soldier moving'],
    'packing': ['packing cardboard', 'bubble wrap', 'moving supplies'],
    'office': ['office moving', 'business relocation', 'office furniture'],
    'apartment': ['apartment moving', 'apartment relocation'],
    'local': ['moving truck', 'moving cardboard', 'loading truck'],
}

# Service-specific image queries (what the service looks like)
SERVICE_IMAGE_QUERIES = {
    'safe': ['gun safe', 'heavy safe moving', 'safe vault'],
    'gun-safe': ['gun safe', 'heavy safe moving', 'safe vault'],
    'antique': ['antique furniture', 'vintage furniture moving'],
    'piano': ['piano moving', 'grand piano'],
    'commercial': ['office furniture moving', 'commercial building'],
    'long-distance': ['moving truck highway', 'interstate moving'],
    'apartment': ['apartment building', 'high rise building'],
    'packing': ['packing boxes supplies', 'moving boxes tape'],
    'storage': ['storage unit', 'warehouse storage'],
}

# Miami area locations for location-specific posts
MIAMI_LOCATIONS = [
    'miami', 'hialeah', 'homestead', 'miami beach', 'coral gables', 'doral',
    'kendall', 'aventura', 'brickell', 'wynwood', 'coconut grove', 'key biscayne',
    'miami shores', 'north miami', 'south miami', 'miami gardens', 'miami lakes',
    'palmetto bay', 'pinecrest', 'cutler bay', 'sunny isles', 'bal harbour',
    'surfside', 'bay harbor', 'golden beach', 'indian creek', 'medley',
    'sweetwater', 'westchester', 'virginia gardens', 'el portal', 'biscayne park',
    'florida city', 'opa locka', 'hialeah gardens', 'miami springs', 'west miami',
    'north miami beach', 'south beach', 'downtown miami', 'little havana',
    'little haiti', 'overtown', 'liberty city', 'allapattah', 'edgewater',
    'midtown', 'design district', 'upper east side', 'morningside', 'belle meade',
]


def load_pexels_api_key() -> str:
    """Load Pexels API key from .env file."""
    env_file = PROJECT_ROOT / '.env'
    if not env_file.exists():
        return None

    content = env_file.read_text()
    match = re.search(r'PEXELS_API_KEY=([^\n]+)', content)
    if match:
        return match.group(1).strip()
    return None


def simplify_query(keywords: list, category: str = None) -> str:
    """Convert keywords to a simple 2-3 word query.

    Stock photo APIs work better with basic keywords, not complex phrases.
    """
    if not keywords:
        return 'moving boxes'

    # Check if category matches SERVICE_IMAGE_QUERIES (specialized services first)
    if category:
        category_lower = category.lower()
        for key, suggestions in SERVICE_IMAGE_QUERIES.items():
            if key.replace('-', ' ') in category_lower or key in category_lower:
                return random.choice(suggestions)

    # Check if category matches SIMPLE_QUERY_SUGGESTIONS
    if category:
        category_lower = category.lower()
        for key, suggestions in SIMPLE_QUERY_SUGGESTIONS.items():
            if key in category_lower:
                return random.choice(suggestions)

    # Check keywords for service hints (SERVICE_IMAGE_QUERIES)
    keywords_str = ' '.join(keywords).lower()
    for key, suggestions in SERVICE_IMAGE_QUERIES.items():
        if key.replace('-', ' ') in keywords_str or key in keywords_str:
            return random.choice(suggestions)

    # Check keywords for audience hints (SIMPLE_QUERY_SUGGESTIONS)
    for key, suggestions in SIMPLE_QUERY_SUGGESTIONS.items():
        if key in keywords_str:
            return random.choice(suggestions)

    # Fall back to first 2-3 keywords joined
    simple_keywords = [k for k in keywords if len(k) > 2][:3]
    return ' '.join(simple_keywords) if simple_keywords else 'moving boxes'


def extract_location(title: str, slug: str) -> str:
    """Extract Miami area location from title or slug if present.

    Returns the location name or None if not a location-specific post.
    Checks longer location names first to avoid partial matches
    (e.g., "miami beach" before "miami").
    """
    text = f"{title} {slug}".lower()

    # Sort by length descending so "miami beach" matches before "miami"
    sorted_locations = sorted(MIAMI_LOCATIONS, key=len, reverse=True)

    for location in sorted_locations:
        # Check for exact location match (with word boundaries)
        if re.search(rf'\b{re.escape(location)}\b', text):
            return location

    return None


def extract_service_type(category: str, service_link: str, title: str) -> str:
    """Extract the service type for image searching.

    Returns a service keyword or None.
    """
    text = f"{category} {service_link or ''} {title}".lower()

    # Check for specific service types
    for service_key in SERVICE_IMAGE_QUERIES.keys():
        if service_key.replace('-', ' ') in text or service_key in text:
            return service_key

    # Check category for general service types
    category_lower = (category or '').lower()
    for key in SIMPLE_QUERY_SUGGESTIONS.keys():
        if key in category_lower:
            return key

    return None


def get_location_query(location: str) -> str:
    """Get an image search query for a Miami area location."""
    # For major areas, search for skyline/cityscape
    major_areas = ['miami', 'miami beach', 'brickell', 'downtown miami', 'south beach']
    if location in major_areas:
        return f"{location} skyline"

    # For neighborhoods, search for the area or default to Miami
    return f"{location} florida neighborhood" if location else "miami florida"


def get_service_query(service_type: str) -> str:
    """Get an image search query for a service type."""
    if service_type in SERVICE_IMAGE_QUERIES:
        return random.choice(SERVICE_IMAGE_QUERIES[service_type])

    if service_type in SIMPLE_QUERY_SUGGESTIONS:
        return random.choice(SIMPLE_QUERY_SUGGESTIONS[service_type])

    return "professional movers"


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




def _search_and_download_pexels(api_key: str, query: str, count: int,
                                 output_dir: Path, prefix: str = "") -> list:
    """Internal helper to search Pexels and download images.

    Args:
        api_key: Pexels API key
        query: Search query
        count: Number of images to download
        output_dir: Directory to save images
        prefix: Optional prefix for filenames to avoid collisions

    Returns:
        List of downloaded file paths.
    """
    # Search Pexels API - request more than needed for variety
    search_url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page={max(count * 3, 9)}"

    try:
        req = urllib.request.Request(
            search_url,
            headers={
                'Authorization': api_key,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            }
        )
        context = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=30, context=context) as response:
            data = json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        if e.code == 401:
            print("Check that PEXELS_API_KEY in .env is valid")
        return []
    except Exception as e:
        print(f"Error searching Pexels: {e}")
        return []

    photos = data.get('photos', [])
    if not photos:
        print(f"  No images found for query: {query}")
        return []

    # Shuffle and pick 'count' images for variety
    random.shuffle(photos)
    selected = photos[:count]

    downloaded = []
    for i, photo in enumerate(selected):
        # Get large size image URL
        img_url = photo['src'].get('large2x') or photo['src'].get('large') or photo['src'].get('original')
        photo_id = photo['id']
        alt = photo.get('alt', '')[:50]

        # Generate filename from alt text or photo ID
        if alt:
            filename = re.sub(r'[^a-z0-9]+', '-', alt.lower()).strip('-')[:40]
        else:
            filename = f"pexels-{photo_id}"

        # Add prefix and index to avoid collisions
        if prefix:
            filename = f"{prefix}-{filename}"
        filepath = output_dir / f"{filename}-{i+1}.webp"

        print(f"    [{i+1}/{count}] {alt or photo_id}...")

        try:
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=60) as response:
                img_data = response.read()

            # Save with original extension, rename step will convert
            ext = '.jpeg' if 'jpeg' in img_url.lower() or 'jpg' in img_url.lower() else '.webp'
            filepath = output_dir / f"{filename}-{i+1}{ext}"
            filepath.write_bytes(img_data)
            downloaded.append(filepath)

        except Exception as e:
            print(f"       Error downloading: {e}")

    return downloaded


def download_images(image_folder: str, keywords: list, count: int = None,
                    custom_query: str = None, category: str = None,
                    title: str = None, slug: str = None, service_link: str = None) -> list:
    """Download images from Pexels API.

    Args:
        image_folder: Path relative to public/ where images go
        keywords: List of keywords to search for
        count: Number of images to download (3-5). If None, randomly chosen.
        custom_query: Custom search query (overrides keywords)
        category: Post category for smart query suggestions
        title: Post title for location/service detection
        slug: Post slug for location/service detection
        service_link: Service link for service type detection

    KEY INSIGHT: Use simple 2-3 word queries, not complex phrases!
    For location+service posts, we do SPLIT SEARCHES to get both types of images.
    """
    # Get API key
    api_key = load_pexels_api_key()
    if not api_key:
        print("Error: PEXELS_API_KEY not found in .env file")
        print("Get a free API key at https://www.pexels.com/api/")
        return []

    # Randomize count if not specified (weighted towards 4)
    if count is None:
        count = random.choices([3, 4, 5], weights=[25, 50, 25])[0]
    else:
        # Clamp to 3-5 range
        count = max(3, min(5, count))

    output_dir = PROJECT_ROOT / f"public{image_folder}"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Detect if this is a location + service post
    location = extract_location(title or '', slug or '') if not custom_query else None
    service_type = extract_service_type(category or '', service_link, title or '') if not custom_query else None

    # If we have BOTH location and service, do split searches
    if location and service_type and not custom_query:
        print(f"Detected location+service post: {location} + {service_type}")
        location_query = get_location_query(location)
        service_query = get_service_query(service_type)

        # Split the count: half location images, half service images
        location_count = count // 2
        service_count = count - location_count

        print(f"  Location search: '{location_query}' ({location_count} images)")
        print(f"  Service search: '{service_query}' ({service_count} images)")

        # Download location images
        location_images = _search_and_download_pexels(
            api_key, location_query, location_count, output_dir, prefix="loc"
        )

        # Download service images
        service_images = _search_and_download_pexels(
            api_key, service_query, service_count, output_dir, prefix="svc"
        )

        downloaded = location_images + service_images
        print(f"\nDownloaded {len(downloaded)} images ({len(location_images)} location, {len(service_images)} service)")
        return downloaded

    # Build search query - USE SIMPLE TERMS!
    if custom_query:
        query = custom_query
    else:
        query = simplify_query(keywords, category)

    print(f"Searching Pexels for: '{query}' ({count} images)")

    # Use the helper function for actual download
    downloaded = _search_and_download_pexels(api_key, query, count, output_dir)

    print(f"\nDownloaded {len(downloaded)} of {count} requested images")
    if len(downloaded) < count:
        print("TIP: If results don't match, try a different simple query like:")
        for _, suggestions in list(SIMPLE_QUERY_SUGGESTIONS.items())[:3]:
            print(f"  --query \"{suggestions[0]}\"")

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


def convert_images_to_webp(image_folder: str, max_images: int = None) -> dict:
    """Convert images in folder to WebP format (keeps original filenames).

    Args:
        image_folder: Path relative to public/ where images are
        max_images: Maximum images to process (3-5). If None, uses available count.

    Returns:
        dict with 'converted' (list of paths) and 'featured_path' (relative path for frontmatter)
    """
    result = {'converted': [], 'featured_path': None}

    if not check_cwebp():
        print("Warning: cwebp not found. Install with: brew install webp")
        print("Images will not be converted to WebP.")

    image_dir = PROJECT_ROOT / f"public{image_folder}"
    if not image_dir.exists():
        print(f"Error: Image directory not found: {image_dir}")
        return result

    # Get existing images (exclude responsive sizes)
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        for f in image_dir.glob(ext):
            # Skip responsive sizes (contain -NNNw.)
            if re.search(r'-\d+w\.', f.name):
                continue
            images.append(f)

    if not images:
        print("No images found to process")
        return result

    # Determine how many images to keep
    if max_images is None:
        max_images = min(len(images), random.choices([3, 4, 5], weights=[25, 50, 25])[0])
    else:
        max_images = max(3, min(5, max_images))

    # Shuffle images to get variety, then take max_images
    random.shuffle(images)
    images_to_process = images[:max_images]

    # Delete excess images
    for img in images[max_images:]:
        print(f"Removing excess: {img.name}")
        img.unlink()

    converted = []
    originals_to_delete = []

    for img in images_to_process:
        # Convert to WebP if needed (keep original filename, just change extension)
        if img.suffix.lower() != '.webp':
            if check_cwebp():
                webp_path = img.parent / f"{img.stem}.webp"
                print(f"Converting: {img.name} → {webp_path.name}")
                result_path = convert_to_webp(img, webp_path)
                if result_path:
                    converted.append(result_path)
                    originals_to_delete.append(img)
                else:
                    print(f"  Warning: Conversion failed for {img.name}")
                    converted.append(img)
            else:
                converted.append(img)
        else:
            converted.append(img)

    # Select a RANDOM image for featured
    if converted:
        webp_images = [c for c in converted if c.suffix.lower() == '.webp']
        if webp_images:
            featured_source = random.choice(webp_images)
            result['featured_path'] = f"{image_folder}/{featured_source.name}"
            print(f"Selected featured image: {featured_source.name}")

    # Clean up original JPEG/PNG files
    for orig in originals_to_delete:
        if orig.exists():
            orig.unlink()
            print(f"Cleaned up: {orig.name}")

    result['converted'] = converted
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


def clean_images(post_file: Path, image_folder: str) -> dict:
    """Remove all existing images from a post.

    This clears:
    1. All files in the image folder
    2. The 'featured' field in frontmatter (set to null)
    3. The 'images' array in frontmatter (set to empty)
    4. All image embeds in the body (![...](...))

    Returns dict with counts of what was removed.
    """
    results = {'folder_files': 0, 'body_embeds': 0}

    # 1. Remove files from image folder
    folder_path = PROJECT_ROOT / 'public' / image_folder.lstrip('/')
    if folder_path.exists():
        files = list(folder_path.glob('*'))
        for f in files:
            if f.is_file():
                f.unlink()
                results['folder_files'] += 1
        print(f"Removed {results['folder_files']} files from {folder_path}")

    # 2 & 3 & 4. Update post file
    content = post_file.read_text()

    # Clear featured (set to null)
    content = re.sub(
        r'^featured:\s*"[^"]*"',
        'featured: null',
        content,
        flags=re.MULTILINE
    )
    content = re.sub(
        r'^featured:\s*/[^\n]*',
        'featured: null',
        content,
        flags=re.MULTILINE
    )

    # Clear images array (set to empty)
    # Match images: followed by list items and replace with empty array
    content = re.sub(
        r'^images:\s*\n(  - [^\n]+\n)+',
        'images: []\n',
        content,
        flags=re.MULTILINE
    )

    # Remove image embeds from body (after the closing ---)
    # Split by frontmatter
    parts = content.split('---')
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = '---'.join(parts[2:])

        # Count and remove image embeds
        embed_pattern = r'!\[[^\]]*\]\([^)]+\)\n*'
        embeds = re.findall(embed_pattern, body)
        results['body_embeds'] = len(embeds)
        body = re.sub(embed_pattern, '', body)

        # Clean up extra blank lines
        body = re.sub(r'\n{3,}', '\n\n', body)

        content = f'---{frontmatter}---{body}'
        print(f"Removed {results['body_embeds']} image embeds from body")

    post_file.write_text(content)
    return results


def embed_images_in_body(post_file: Path, image_folder: str, featured: str = '') -> int:
    """Embed images into the post body content after ## headings.

    Distributes images throughout the content after major headings.
    Excludes the featured image to avoid duplication (it's shown in the hero).

    Returns:
        Number of images embedded.
    """
    content = post_file.read_text()
    image_dir = PROJECT_ROOT / f"public{image_folder}"

    if not image_dir.exists():
        return 0

    # Get the featured image filename to exclude it
    featured_filename = featured.split('/')[-1] if featured else ''

    # Get WebP images (excluding featured and responsive sizes)
    webp_files = sorted([
        f for f in image_dir.glob('*.webp')
        if not re.search(r'-\d+w\.', f.name) and f.name != featured_filename
    ])

    if not webp_files:
        return 0

    # Check if images are already embedded
    existing_images = re.findall(r'!\[.*?\]\([^)]+\)', content)
    if len(existing_images) >= len(webp_files):
        print(f"  Images already embedded ({len(existing_images)} found)")
        return 0

    # Split content into frontmatter and body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return 0

    frontmatter = parts[1]
    body = parts[2]

    # Find all ## headings to place images after
    headings = list(re.finditer(r'^## .+$', body, re.MULTILINE))

    if not headings:
        return 0

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
    post_file.write_text(new_content)

    print(f"  Embedded {len(heading_indices)} images in body")
    return len(heading_indices)


def update_images_array(post_file: Path, image_folder: str) -> int:
    """Update the images array in frontmatter with actual image files.

    Returns:
        Number of images in the array.
    """
    content = post_file.read_text()
    image_dir = PROJECT_ROOT / f"public{image_folder}"

    if not image_dir.exists():
        return 0

    # Get all WebP images (excluding responsive sizes)
    webp_files = sorted([
        f"{image_folder}/{f.name}"
        for f in image_dir.glob('*.webp')
        if not re.search(r'-\d+w\.', f.name)
    ])

    if not webp_files:
        return 0

    # Build new images array YAML
    images_yaml = 'images:\n' + '\n'.join(f'  - "{img}"' for img in webp_files)

    # Replace or add images array
    if re.search(r'^images:', content, re.MULTILINE):
        # Replace existing images array (including multi-line)
        content = re.sub(
            r'^images:.*?(?=\n[a-z_]+:|\n---|\Z)',
            images_yaml + '\n',
            content,
            flags=re.MULTILINE | re.DOTALL
        )
    else:
        # Add before closing ---
        content = re.sub(
            r'\n---\n',
            f'\n{images_yaml}\n---\n',
            content,
            count=1
        )

    post_file.write_text(content)
    print(f"  Updated images array with {len(webp_files)} files")
    return len(webp_files)


def cleanup_unused_images(post_file: Path, image_folder: str) -> int:
    """Remove unused images from the post's image folder.

    Compares images in the folder against:
    - featured field in frontmatter
    - images array in frontmatter
    - ![alt](path) references in body

    Returns:
        Number of images deleted.
    """
    content = post_file.read_text()
    frontmatter = parse_frontmatter(content)
    image_dir = PROJECT_ROOT / f"public{image_folder}"

    if not image_dir.exists():
        return 0

    # Collect all referenced images
    referenced_images = set()

    # 1. Featured image
    featured = frontmatter.get('featured', '')
    if featured:
        referenced_images.add(featured.split('/')[-1])

    # 2. Images array (parse from content since parse_frontmatter doesn't handle arrays well)
    images_match = re.search(r'images:\s*\n((?:\s+-\s*"[^"]+"\n?)+)', content)
    if images_match:
        for img_path in re.findall(r'-\s*"([^"]+)"', images_match.group(1)):
            referenced_images.add(img_path.split('/')[-1])

    # 3. Body image references ![...](path)
    body_images = re.findall(r'!\[.*?\]\(([^)]+)\)', content)
    for img_path in body_images:
        referenced_images.add(img_path.split('/')[-1])

    # Also include responsive variants of referenced images
    responsive_refs = set()
    for ref in referenced_images:
        base_name = re.sub(r'\.webp$', '', ref)
        for size in ['400w', '800w', '1200w', '1600w']:
            responsive_refs.add(f"{base_name}-{size}.webp")
    referenced_images.update(responsive_refs)

    # Get all images in the folder
    all_images = [
        f for f in image_dir.iterdir()
        if f.suffix.lower() in ['.webp', '.jpg', '.jpeg', '.png', '.gif']
    ]

    # Find unreferenced images
    deleted_count = 0
    for img_file in all_images:
        if img_file.name not in referenced_images:
            try:
                img_file.unlink()
                deleted_count += 1
                print(f"  Deleted unused: {img_file.name}")
            except Exception as e:
                print(f"  Failed to delete {img_file.name}: {e}")

    return deleted_count


def fix_image_paths(post_file: Path) -> bool:
    """Fix image_folder and featured paths in frontmatter.

    Ensures:
    - image_folder matches the post slug
    - featured path is full path (not just 'featured.webp')
    - featured uses .webp extension

    Returns:
        True if changes were made.
    """
    content = post_file.read_text()
    frontmatter = parse_frontmatter(content)

    image_folder = frontmatter.get('image_folder')
    featured = frontmatter.get('featured')
    slug = frontmatter.get('slug')
    date = frontmatter.get('date', '')

    if not image_folder or not slug:
        return False

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
        post_file.write_text(content)

    return changes_made


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

    # Parse --query option for custom search
    custom_query = None
    if '--query' in args:
        idx = args.index('--query')
        if idx + 1 < len(args):
            custom_query = args[idx + 1]
            args = args[:idx] + args[idx + 2:]

    post_id = args[0]
    do_all = '--all' in args
    do_clean = '--clean' in args or do_all
    do_download = '--download' in args or do_all
    do_rename = '--rename' in args or do_all
    do_resize = '--resize' in args or do_all
    do_embed = '--embed' in args or do_all
    do_update_array = '--update-array' in args or do_all
    do_cleanup = '--cleanup' in args or do_all
    do_fix_paths = '--fix-paths' in args or do_all

    valid_flags = ['--clean', '--download', '--rename', '--resize', '--embed',
                   '--update-array', '--cleanup', '--fix-paths', '--all']
    has_action = any(f'--{flag.lstrip("-")}' in args or flag in args for flag in valid_flags)

    if not has_action:
        print("Specify at least one action: --download, --rename, --resize, --embed, --update-array, --cleanup, --fix-paths, or --all")
        sys.exit(1)

    # Find post
    post_file = find_post_file(post_id)
    if not post_file:
        print(f"Error: Could not find post {post_id}")
        sys.exit(1)

    content = post_file.read_text()
    frontmatter = parse_frontmatter(content)

    title = frontmatter.get('title', 'blog-post')
    slug = frontmatter.get('slug', '')
    image_folder = frontmatter.get('image_folder')
    keywords = frontmatter.get('image_keywords', [])
    category = frontmatter.get('category', '')
    service_link = frontmatter.get('service_link', '')

    if not image_folder:
        print("Error: Post has no image_folder in frontmatter")
        sys.exit(1)

    print(f"Post: {post_file.name}")
    print(f"Title: {title}")
    print(f"Category: {category}")
    print(f"Image folder: {image_folder}")
    print(f"Keywords: {keywords}")

    # Check for location + service split search
    location = extract_location(title, slug) if not custom_query else None
    service_type = extract_service_type(category, service_link, title) if not custom_query else None

    if location and service_type and not custom_query:
        print(f"Location detected: {location}")
        print(f"Service detected: {service_type}")
        print("Will perform SPLIT SEARCH for both location and service images")
    elif custom_query:
        print(f"Custom query: {custom_query}")
    else:
        suggested_query = simplify_query(keywords, category)
        print(f"Auto-generated query: {suggested_query}")
    print(f"Image count: {count if count else 'random (3-5)'}")
    print()

    featured_path = None

    if do_clean:
        print("=== Cleaning existing images ===")
        clean_results = clean_images(post_file, image_folder)
        print(f"Cleaned: {clean_results['folder_files']} files, {clean_results['body_embeds']} body embeds")
        print()

    if do_download:
        downloaded = download_images(
            image_folder, keywords, count, custom_query, category,
            title=title, slug=slug, service_link=service_link
        )
        print(f"\nDownloaded {len(downloaded)} images")

    if do_rename:
        result = convert_images_to_webp(image_folder, count)
        converted = result.get('converted', [])
        featured_path = result.get('featured_path')
        print(f"\nConverted {len(converted)} images to WebP:")
        for img in converted:
            print(f"  {img.name}")

        # Update featured path in frontmatter if we have one
        if featured_path:
            update_frontmatter(post_file, 'featured', featured_path)
            print(f"\nUpdated featured path: {featured_path}")

    if do_resize:
        resize_images(post_id)

    # Re-read frontmatter for embed/update/cleanup steps
    if do_fix_paths or do_embed or do_update_array or do_cleanup:
        content = post_file.read_text()
        frontmatter = parse_frontmatter(content)
        image_folder = frontmatter.get('image_folder')
        featured = frontmatter.get('featured', '')

    if do_fix_paths:
        print("\n=== Fixing image paths ===")
        if fix_image_paths(post_file):
            print("Image paths fixed")
            # Re-read after path fixes
            content = post_file.read_text()
            frontmatter = parse_frontmatter(content)
            image_folder = frontmatter.get('image_folder')
            featured = frontmatter.get('featured', '')
        else:
            print("Image paths OK")

    if do_embed:
        print("\n=== Embedding images in body ===")
        embedded = embed_images_in_body(post_file, image_folder, featured)
        if embedded == 0:
            print("No images to embed (already embedded or none available)")

    if do_update_array:
        print("\n=== Updating images array ===")
        update_images_array(post_file, image_folder)

    if do_cleanup:
        print("\n=== Cleaning up unused images ===")
        deleted = cleanup_unused_images(post_file, image_folder)
        if deleted == 0:
            print("No unused images to clean up")
        else:
            print(f"Cleaned up {deleted} unused images")


if __name__ == '__main__':
    main()
