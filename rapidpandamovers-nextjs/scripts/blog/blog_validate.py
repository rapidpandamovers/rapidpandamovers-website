#!/usr/bin/env python3
"""
Validate blog posts against the blog_update.md checklist.

Usage:
    python scripts/blog/blog_validate.py <post_id>
    python scripts/blog/blog_validate.py 0001
    python scripts/blog/blog_validate.py --all           # Validate all posts
    python scripts/blog/blog_validate.py --pending       # Validate pending posts only
    python scripts/blog/blog_validate.py --completed     # Validate completed posts only

Checks:
    - Frontmatter (title length, excerpt, readTime, etc.)
    - AI writing patterns (em dashes, overused phrases)
    - Image presence and format (WebP, responsive sizes)
    - Required sections (CTA, FAQ, Related Services)
    - Link correctness (service_link, location_link)
"""

import sys
import re
import glob
from pathlib import Path

# Project root (scripts/blog -> scripts -> project root)
PROJECT_ROOT = Path(__file__).parent.parent.parent

# AI patterns to detect (from blog_update.md)
AI_PATTERNS = [
    (r'—', 'Em dash'),
    (r'\bdive into\b', '"dive into"'),
    (r'\bdiving into\b', '"diving into"'),
    (r'\bnavigate\b', '"navigate"'),
    (r'\bnavigating\b', '"navigating"'),
    (r'\bin today\'s world\b', '"in today\'s world"'),
    (r'\bin today\'s age\b', '"in today\'s age"'),
    (r'\bit\'s important to note\b', '"it\'s important to note"'),
    (r'\bcomprehensive guide\b', '"comprehensive guide"'),
    (r'\blet\'s explore\b', '"let\'s explore"'),
    (r'\blet\'s dive\b', '"let\'s dive"'),
    (r'\bat the end of the day\b', '"at the end of the day"'),
    (r'\bfirst and foremost\b', '"first and foremost"'),
    (r'\blast but not least\b', '"last but not least"'),
    (r'\bwithout further ado\b', '"without further ado"'),
    (r'\bneedless to say\b', '"needless to say"'),
    (r'\bin this article\b', '"in this article"'),
    (r'\bin this post\b', '"in this post"'),
]

# Required sections for different post types
SERVICE_SECTIONS = ['Benefits', 'What to Expect']
LOCATION_SECTIONS = ['Neighborhoods', 'Living in']
COMMON_SECTIONS = ['/quote']

# Post type classification keywords
LOCATION_KEYWORDS = ['moving to', 'relocating to', 'guide to', 'living in', 'life in']
SERVICE_KEYWORDS = ['packing', 'moving tips', 'checklist', 'how to', 'guide']
LISTICLE_PATTERN = r'^\d+\s+(ways|tips|things|reasons|mistakes|steps)'


def find_post_file(post_id: str) -> Path:
    """Find post file by ID."""
    if Path(post_id).exists():
        return Path(post_id)

    padded = post_id.zfill(4)
    matches = glob.glob(str(PROJECT_ROOT / f"content/blog/{padded}-*.md"))
    if matches:
        return Path(matches[0])
    return None


def parse_frontmatter(content: str) -> dict:
    """Parse frontmatter into dict."""
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}

    fm = {}
    current_key = None
    current_list = None

    for line in match.group(1).split('\n'):
        # List item
        if line.strip().startswith('- '):
            if current_key and current_list is not None:
                current_list.append(line.strip()[2:].strip('"'))
            continue

        # Key-value pair
        if ':' in line and not line.startswith(' '):
            if current_key and current_list is not None:
                fm[current_key] = current_list

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"\'')

            if value == '' or value == '[]':
                current_key = key
                current_list = []
            else:
                if value == 'null':
                    value = None
                elif value == 'true':
                    value = True
                elif value == 'false':
                    value = False
                fm[key] = value
                current_key = None
                current_list = None

    if current_key and current_list is not None:
        fm[current_key] = current_list

    return fm


def classify_post(title: str, body: str) -> str:
    """Classify post type based on title and content."""
    title_lower = title.lower()

    # Check for listicle
    if re.search(LISTICLE_PATTERN, title_lower):
        return 'LISTICLE'

    # Check for location guide
    for kw in LOCATION_KEYWORDS:
        if kw in title_lower:
            return 'LOCATION_GUIDE'

    # Check for service guide
    for kw in SERVICE_KEYWORDS:
        if kw in title_lower:
            return 'SERVICE_GUIDE'

    # Default to HOW_TO
    return 'HOW_TO'


def check_ai_patterns(content: str) -> list:
    """Check content for AI writing patterns."""
    found = []
    for pattern, name in AI_PATTERNS:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            found.append((name, len(matches)))
    return found


def validate_post(file_path: Path) -> dict:
    """Validate a single post and return results."""
    content = file_path.read_text()
    fm = parse_frontmatter(content)
    body = content.split('---', 2)[2] if '---' in content else content

    title = fm.get('title', '')
    post_type = classify_post(title, body)

    results = {
        'file': file_path.name,
        'id': fm.get('id'),
        'title': title,
        'status': fm.get('status', 'unknown'),
        'post_type': post_type,
        'errors': [],
        'warnings': [],
        'ai_patterns': []
    }

    # === AI Pattern Checks ===
    ai_patterns = check_ai_patterns(body)
    if ai_patterns:
        results['ai_patterns'] = ai_patterns
        for pattern_name, count in ai_patterns:
            results['errors'].append(f"AI pattern found: {pattern_name} ({count}x)")

    # Also check excerpt for AI patterns
    excerpt = fm.get('excerpt', '')
    excerpt_patterns = check_ai_patterns(excerpt)
    if excerpt_patterns:
        for pattern_name, count in excerpt_patterns:
            results['errors'].append(f"AI pattern in excerpt: {pattern_name}")

    # === Frontmatter checks ===

    # Title length
    if len(title) > 60:
        results['warnings'].append(f"Title too long: {len(title)} chars (max 60)")

    # Title should not contain year
    if re.search(r'\b20\d{2}\b', title):
        results['errors'].append(f"Title contains year")

    # Excerpt length
    if len(excerpt) > 155:
        results['warnings'].append(f"Excerpt too long: {len(excerpt)} chars (max 155)")
    if not excerpt:
        results['errors'].append("Missing excerpt")

    # readTime format
    read_time = fm.get('readTime', '')
    if not re.match(r'\d+ min read', str(read_time)):
        results['errors'].append(f"Invalid readTime format: {read_time}")

    # === Image checks ===

    image_folder = fm.get('image_folder')
    featured = fm.get('featured')

    if image_folder:
        image_dir = PROJECT_ROOT / f"public{image_folder}"

        # Check featured image exists and is WebP
        if featured:
            featured_path = PROJECT_ROOT / f"public{featured}"
            if not featured_path.exists():
                results['errors'].append(f"Featured image missing: {featured}")
            elif not featured.endswith('.webp'):
                results['warnings'].append(f"Featured image not WebP: {featured}")
        else:
            results['errors'].append("No featured image set")

        # Check image directory exists
        if not image_dir.exists():
            results['errors'].append(f"Image directory missing")
        else:
            # Check for WebP images
            webp_files = list(image_dir.glob('*.webp'))
            source_webp = [f for f in webp_files if not re.search(r'-\d+w\.', f.name)]

            # Should have 3-5 source images
            if len(source_webp) < 3:
                results['errors'].append(f"Too few images: {len(source_webp)} (need 3-5)")
            elif len(source_webp) > 6:
                results['warnings'].append(f"Many source images: {len(source_webp)}")

    # === Link checks ===

    service_link = fm.get('service_link')
    location_link = fm.get('location_link')

    # If has location_link, service_link should be location-specific
    if location_link and service_link:
        loc_match = re.match(r'/([^-]+)-movers', str(location_link))
        if loc_match:
            location = loc_match.group(1)
            if location not in str(service_link):
                results['warnings'].append(
                    f"service_link should be location-specific: /{location}-..."
                )

    # === Body content checks ===

    # Check for CTA section
    has_cta = '/quote' in body
    if not has_cta:
        results['errors'].append("Missing CTA with /quote link")

    # Check for sections based on post type
    if post_type == 'SERVICE_GUIDE':
        if 'Benefits' not in body and 'What to Expect' not in body:
            results['warnings'].append("Missing Benefits/What to Expect section")
    elif post_type == 'LOCATION_GUIDE':
        if 'Neighborhood' not in body and 'Living in' not in body:
            results['warnings'].append("Missing Neighborhoods/Living section")

    # Check for FAQ section
    has_faq = 'Frequently Asked' in body or '## FAQ' in body
    if not has_faq and fm.get('status') == 'completed':
        results['warnings'].append("No FAQ section")

    # Check for Related Services section
    has_related = 'Related Services' in body
    if not has_related and fm.get('status') == 'completed':
        results['warnings'].append("No Related Services section")

    # Check for embedded images
    embedded_images = re.findall(r'!\[.*?\]\(.*?\)', body)
    if len(embedded_images) < 2 and fm.get('status') == 'completed':
        results['warnings'].append(f"Few embedded images: {len(embedded_images)}")

    # Check heading hierarchy
    headings = re.findall(r'^(#{1,4})\s', body, re.MULTILINE)
    if headings and headings[0] == '#':
        results['warnings'].append("Body starts with H1 (should use H2)")

    # === Listicle-specific checks ===
    if post_type == 'LISTICLE':
        # Check title count matches content
        title_match = re.search(r'^(\d+)\s+', title)
        if title_match:
            expected_count = int(title_match.group(1))
            # Count numbered items or major headings
            items = re.findall(r'^##\s+\d+\.?\s+', body, re.MULTILINE)
            if not items:
                items = re.findall(r'^\d+\.\s+\*\*', body, re.MULTILINE)
            if items and len(items) != expected_count:
                results['errors'].append(
                    f"Listicle count mismatch: title says {expected_count}, content has {len(items)}"
                )

    return results


def print_results(results: dict, verbose: bool = True):
    """Print validation results."""
    has_errors = len(results['errors']) > 0
    status_icon = '❌' if has_errors else '✅'

    if verbose or has_errors:
        print(f"\n{status_icon} {results['file']}")
        print(f"   ID: {results['id']} | Type: {results['post_type']} | Status: {results['status']}")

        if results['errors']:
            print("   Errors:")
            for err in results['errors']:
                print(f"     ❌ {err}")

        if results['warnings'] and verbose:
            print("   Warnings:")
            for warn in results['warnings']:
                print(f"     ⚠️  {warn}")

    return not has_errors


def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(__doc__)
        sys.exit(0 if args else 1)

    verbose = '-v' in args or '--verbose' in args
    args = [a for a in args if a not in ['-v', '--verbose']]

    if '--all' in args:
        post_files = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/*.md")))
        posts = [Path(f) for f in post_files]
        print(f"Validating all {len(posts)} posts...")
    elif '--pending' in args:
        post_files = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/*.md")))
        posts = []
        for pf in post_files:
            content = Path(pf).read_text()
            if 'status: "pending"' in content or "status: 'pending'" in content:
                posts.append(Path(pf))
        print(f"Found {len(posts)} pending posts")
    elif '--completed' in args:
        post_files = sorted(glob.glob(str(PROJECT_ROOT / "content/blog/*.md")))
        posts = []
        for pf in post_files:
            content = Path(pf).read_text()
            if 'status: "completed"' in content or "status: 'completed'" in content:
                posts.append(Path(pf))
        print(f"Found {len(posts)} completed posts")
    else:
        post_id = args[0]
        post_file = find_post_file(post_id)
        if not post_file:
            print(f"Error: Could not find post {post_id}")
            sys.exit(1)
        posts = [post_file]
        verbose = True

    passed = 0
    failed = 0
    ai_pattern_count = 0

    for post in posts:
        results = validate_post(post)
        if results['ai_patterns']:
            ai_pattern_count += 1
        if print_results(results, verbose=verbose or len(posts) == 1):
            passed += 1
        else:
            failed += 1

    if len(posts) > 1:
        print(f"\n{'='*40}")
        print(f"Validated {len(posts)} posts")
        print(f"  ✅ Passed: {passed}")
        print(f"  ❌ Failed: {failed}")
        if ai_pattern_count > 0:
            print(f"  🤖 AI patterns found in: {ai_pattern_count} posts")


if __name__ == '__main__':
    main()
