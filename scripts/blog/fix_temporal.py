#!/usr/bin/env python3
"""Fix temporal/factual issues in blog posts.

Two modes:
1. --weather-only: Fix factual weather errors (thunderstorms in dry season, etc.)
2. --month-fix: Fix month mismatches (title says January, published in February)
   Also fixes body content, slugs, filenames, and Spanish translations.

Usage:
    python scripts/blog/fix_temporal.py --weather-only --dry-run
    python scripts/blog/fix_temporal.py --weather-only
    python scripts/blog/fix_temporal.py --month-fix --dry-run
    python scripts/blog/fix_temporal.py --month-fix
    python scripts/blog/fix_temporal.py --month-fix 444  # single post
"""

import re
import sys
import os
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
EN_DIR = PROJECT_ROOT / "content" / "blog" / "en"
ES_DIR = PROJECT_ROOT / "content" / "blog" / "es"

MONTHS_EN = ['january','february','march','april','may','june','july','august','september','october','november','december']
MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
MONTH_NUM_EN = {m: i+1 for i, m in enumerate(MONTHS_EN)}
MONTH_NUM_ES = {m: i+1 for i, m in enumerate(MONTHS_ES)}

# Season mapping
MONTH_TO_SEASON_EN = {
    'january': 'winter', 'february': 'winter', 'march': 'spring',
    'april': 'spring', 'may': 'summer', 'june': 'summer',
    'july': 'summer', 'august': 'summer', 'september': 'fall',
    'october': 'fall', 'november': 'fall', 'december': 'winter',
}
MONTH_TO_SEASON_ES = {
    'enero': 'invierno', 'febrero': 'invierno', 'marzo': 'primavera',
    'abril': 'primavera', 'mayo': 'verano', 'junio': 'verano',
    'julio': 'verano', 'agosto': 'verano', 'septiembre': 'otoño',
    'octubre': 'otoño', 'noviembre': 'otoño', 'diciembre': 'invierno',
}

# Dry season months (Nov-Apr) - no thunderstorms in Miami
DRY_SEASON = {"november", "december", "january", "february", "march", "april"}
DRY_SEASONS = {"winter", "fall"}


# =============================================================================
# WEATHER FIXES (factual corrections only)
# =============================================================================

def detect_month_or_season(filename, content):
    """Detect the primary month or season from filename and content."""
    fname = filename.lower()
    for month in MONTHS_EN:
        if month in fname:
            return month, "month"
    for season in ["winter", "spring", "summer", "fall", "autumn"]:
        if season in fname:
            return season, "season"
    title_match = re.search(r'title:\s*"([^"]+)"', content, re.IGNORECASE)
    if title_match:
        title = title_match.group(1).lower()
        for month in MONTHS_EN:
            if month in title:
                return month, "month"
    return None, None


def is_dry_season(month_or_season, kind):
    if kind == "month":
        return month_or_season in DRY_SEASON
    if kind == "season":
        return month_or_season in DRY_SEASONS or month_or_season == "autumn"
    return False


def get_dry_season_weather_phrase(month_or_season, lang="en"):
    if lang == "es":
        if month_or_season in ("december", "january", "february", "winter", "diciembre", "enero", "febrero", "invierno"):
            return "frentes fríos ocasionales o el brillante sol de Florida"
        elif month_or_season in ("november", "fall", "autumn", "noviembre", "otoño"):
            return "la transición al clima más fresco y seco o el brillante sol de Florida"
        else:
            return "temperaturas agradables o el brillante sol de Florida"
    else:
        if month_or_season in ("december", "january", "february", "winter"):
            return "occasional cold fronts or the bright Florida sunshine"
        elif month_or_season in ("november", "fall", "autumn"):
            return "the transition to cooler, drier weather or the bright Florida sunshine"
        else:
            return "warming temperatures or the bright Florida sunshine"


def fix_weather_en(content, month_or_season):
    """Fix factual weather errors in English content."""
    # Boilerplate thunderstorm fix
    replacement = get_dry_season_weather_phrase(month_or_season, "en")
    content = re.sub(
        r'dealing with afternoon thunderstorms or the intense Florida sunshine',
        f'dealing with {replacement}',
        content, flags=re.IGNORECASE
    )

    # Line-by-line thunderstorm fixes (skip correctly negated lines)
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        ll = line.lower()
        skip_phrases = [
            'nothing like the afternoon thunderstorms', 'none of the afternoon thunderstorms',
            'no afternoon thunderstorms', 'unlike summer', 'unlike the summer',
            'rare afternoon thunderstorms', 'minimal afternoon thunderstorms',
            'afternoon thunderstorms are rare', 'thunderstorms of summer',
            'from june through october', 'from may through october',
            'may through october', 'june through october',
        ]
        if any(p in ll for p in skip_phrases):
            new_lines.append(line)
            continue

        if 'afternoon thunderstorm' in ll and not any(neg in ll for neg in ['no ', 'not ', 'rare', 'minimal', 'unlike', 'nothing like', 'none of']):
            if month_or_season in ("december", "january", "february", "winter"):
                line = re.sub(r'afternoon thunderstorms?\b', 'occasional brief rain showers', line, flags=re.IGNORECASE)
            elif month_or_season in ("november", "fall", "autumn"):
                line = re.sub(r'afternoon thunderstorms?\b', 'occasional passing showers', line, flags=re.IGNORECASE)
            else:
                line = re.sub(r'afternoon thunderstorms?\b', 'brief rain showers', line, flags=re.IGNORECASE)

        if 'afternoon storm' in ll and 'afternoon thunderstorm' not in ll:
            if not any(neg in ll for neg in ['no ', 'not ', 'rare', 'minimal', 'unlike']):
                line = re.sub(r'afternoon storms?\b', 'occasional showers', line, flags=re.IGNORECASE)

        new_lines.append(line)
    content = '\n'.join(new_lines)

    # "afternoon showers are common" in winter
    if month_or_season in ("december", "january", "february", "winter"):
        content = re.sub(r'afternoon showers are common',
                         'rain is less frequent than in summer, though brief showers can still occur',
                         content, flags=re.IGNORECASE)

    # "storms rolling in from the Everglades" in dry season
    if month_or_season in DRY_SEASON or month_or_season in DRY_SEASONS:
        content = re.sub(r'(?:potential )?storms rolling in from the Everglades',
                         'the occasional cold front that can bring a quick temperature drop',
                         content, flags=re.IGNORECASE)

    # Thunderstorm window
    content = re.sub(r'(?:the )?typical 3-4 PM thunderstorm window',
                     'the warmest part of the day for comfort', content, flags=re.IGNORECASE)
    content = re.sub(r'3pm storm window that hits almost daily from (?:April|March) through October',
                     'afternoon storm window that hits almost daily from May through October',
                     content, flags=re.IGNORECASE)

    # Exaggerated humidity/temp
    if month_or_season in ("january", "february", "december", "winter"):
        content = re.sub(r"humidity (?:can reach|often hovers around|levels .* can reach) 70-80%",
                         "humidity typically sits around 60-65%", content, flags=re.IGNORECASE)
        content = re.sub(r'sudden afternoon (?:rain )?showers are common',
                         'brief rain showers are rare but can pop up', content, flags=re.IGNORECASE)

    if month_or_season in ("november", "fall"):
        content = re.sub(r'temperatures (?:often reach|still hover in) the mid-80s',
                         'temperatures typically reach around 80°F', content, flags=re.IGNORECASE)
        content = re.sub(r'afternoon rain showers remain common',
                         'rain becomes much less frequent as dry season begins', content, flags=re.IGNORECASE)

    if month_or_season in ("april", "march", "spring"):
        content = re.sub(r'(?:peak afternoon )?temperatures,? which can reach 95 degrees or higher',
                         'afternoon temperatures, which typically reach the low to mid-80s',
                         content, flags=re.IGNORECASE)

    # Peak season misapplication
    if month_or_season in DRY_SEASON or month_or_season in DRY_SEASONS:
        content = re.sub(r'(###?\s*(?:Schedule Early|Plan Ahead) for )Peak Season',
                         r'\1the Busy Season', content, flags=re.IGNORECASE)
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            ll = line.lower()
            if ('peak moving season' in ll or 'peak season' in ll):
                if not any(neg in ll for neg in ['not peak', 'outside of peak', 'off-peak', 'before peak', 'after peak', 'unlike peak']):
                    line = re.sub(r'(?:March|April|November|December|January|February) marks the start of peak moving season',
                                  lambda m: f"{m.group(0).split()[0]} is a popular time to move in South Florida",
                                  line, flags=re.IGNORECASE)
                    line = re.sub(r'during this peak season', 'during this busy period', line, flags=re.IGNORECASE)
                    line = re.sub(r'(?:March|April) through May is peak moving season',
                                  'late spring into summer is peak moving season', line, flags=re.IGNORECASE)
                    line = re.sub(r'April through May is peak season',
                                  'late spring into summer is peak moving season', line, flags=re.IGNORECASE)
            new_lines.append(line)
        content = '\n'.join(new_lines)

    return content


def fix_weather_es(content, month_or_season):
    """Fix factual weather errors in Spanish content."""
    # Boilerplate thunderstorm fix
    replacement = get_dry_season_weather_phrase(month_or_season, "es")
    content = re.sub(
        r'lidiando con tormentas eléctricas vespertinas o el intenso sol de Florida',
        f'lidiando con {replacement}',
        content, flags=re.IGNORECASE
    )
    # Also match variant phrasings
    content = re.sub(
        r'enfrentando tormentas eléctricas vespertinas o el intenso sol de Florida',
        f'enfrentando {replacement}',
        content, flags=re.IGNORECASE
    )

    # "tormentas eléctricas vespertinas" / "tormentas vespertinas" as standalone
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        ll = line.lower()
        skip_es = ['a diferencia del verano', 'raras tormentas', 'mínimas tormentas',
                    'no hay tormentas', 'sin tormentas', 'de verano']
        if any(p in ll for p in skip_es):
            new_lines.append(line)
            continue

        if 'tormentas eléctricas vespertinas' in ll or 'tormentas vespertinas' in ll:
            if not any(neg in ll for neg in ['no ', 'rara', 'mínim', 'sin ']):
                if month_or_season in ("december", "january", "february", "winter", "diciembre", "enero", "febrero", "invierno"):
                    line = re.sub(r'tormentas eléctricas vespertinas', 'lluvias breves ocasionales', line, flags=re.IGNORECASE)
                    line = re.sub(r'tormentas vespertinas', 'lluvias breves ocasionales', line, flags=re.IGNORECASE)
                elif month_or_season in ("november", "fall", "noviembre", "otoño"):
                    line = re.sub(r'tormentas eléctricas vespertinas', 'lluvias pasajeras ocasionales', line, flags=re.IGNORECASE)
                    line = re.sub(r'tormentas vespertinas', 'lluvias pasajeras ocasionales', line, flags=re.IGNORECASE)
                else:
                    line = re.sub(r'tormentas eléctricas vespertinas', 'lluvias breves', line, flags=re.IGNORECASE)
                    line = re.sub(r'tormentas vespertinas', 'lluvias breves', line, flags=re.IGNORECASE)
        new_lines.append(line)
    content = '\n'.join(new_lines)

    # "aguaceros vespertinos son comunes" in winter
    if month_or_season in ("december", "january", "february", "winter", "diciembre", "enero", "febrero", "invierno"):
        content = re.sub(r'(?:los )?aguaceros vespertinos son comunes',
                         'la lluvia es menos frecuente que en verano, aunque pueden ocurrir lluvias breves',
                         content, flags=re.IGNORECASE)

    # "tormentas que llegan desde los Everglades"
    if month_or_season in DRY_SEASON or month_or_season in DRY_SEASONS:
        content = re.sub(r'(?:las posibles )?tormentas que llegan desde los Everglades',
                         'los frentes fríos ocasionales que pueden traer un descenso rápido de temperatura',
                         content, flags=re.IGNORECASE)

    return content


def process_weather_fix(filepath, dry_run=False, lang="en"):
    """Fix weather in a single file."""
    content = filepath.read_text()
    month_or_season, kind = detect_month_or_season(filepath.name, content)
    if not month_or_season:
        return False, []
    if not is_dry_season(month_or_season, kind):
        return False, []

    original = content
    if lang == "en":
        content = fix_weather_en(content, month_or_season)
    else:
        content = fix_weather_es(content, month_or_season)

    if content == original:
        return False, []

    if not dry_run:
        filepath.write_text(content)
    return True, ["Fixed weather inaccuracies"]


# =============================================================================
# MONTH MISMATCH FIXES
# =============================================================================

def title_to_slug(title):
    """Convert title to slug."""
    slug = title.lower()
    slug = re.sub(r"[''`]", '', slug)
    slug = re.sub(r'[^\w\s-]', ' ', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    if len(slug) > 70:
        slug = slug[:70]
        while '-' in slug:
            last_part = slug.rsplit('-', 1)[-1]
            if len(last_part) <= 2:
                slug = slug.rsplit('-', 1)[0]
            else:
                break
    return slug.strip('-')


def replace_month_in_text(text, old_month, new_month, is_title=False):
    """Replace month name in text, handling capitalization."""
    # Title case
    text = text.replace(old_month.capitalize(), new_month.capitalize())
    # Lower case
    text = text.replace(old_month.lower(), new_month.lower())
    # Upper case
    text = text.replace(old_month.upper(), new_month.upper())
    return text


def get_season_for_month(month, lang="en"):
    """Get the season name for a given month."""
    if lang == "es":
        return MONTH_TO_SEASON_ES.get(month, "")
    return MONTH_TO_SEASON_EN.get(month, "")


def replace_season_in_text(text, old_season, new_season):
    """Replace season name in text."""
    if old_season == new_season:
        return text
    text = text.replace(old_season.capitalize(), new_season.capitalize())
    text = text.replace(old_season.lower(), new_season.lower())
    text = text.replace(old_season.upper(), new_season.upper())
    return text


def find_month_mismatches():
    """Find all posts where title month doesn't match publication month."""
    mismatches = []
    for f in sorted(EN_DIR.glob("*.md")):
        content = f.read_text()
        date_match = re.search(r'date:\s*"(\d{4})-(\d{2})-(\d{2})"', content)
        title_match = re.search(r'title:\s*"([^"]+)"', content)
        if not date_match or not title_match:
            continue
        pub_month_num = int(date_match.group(2))
        title = title_match.group(1)

        for month_name, month_num in MONTH_NUM_EN.items():
            if month_name in title.lower():
                if pub_month_num != month_num:
                    correct_month = MONTHS_EN[pub_month_num - 1]
                    mismatches.append({
                        'file': f,
                        'id': f.name.split('-')[0],
                        'title': title,
                        'date': f"{date_match.group(1)}-{date_match.group(2)}-{date_match.group(3)}",
                        'wrong_month': month_name,
                        'correct_month': correct_month,
                        'pub_month_num': pub_month_num,
                    })
                break
    return mismatches


def fix_month_mismatch(mismatch, dry_run=False):
    """Fix a single month mismatch in both EN and ES posts."""
    en_file = mismatch['file']
    post_id = mismatch['id']
    wrong_month = mismatch['wrong_month']
    correct_month = mismatch['correct_month']
    changes = []

    # --- English post ---
    content = en_file.read_text()

    # Get old and new seasons
    old_season_en = get_season_for_month(wrong_month, "en")
    new_season_en = get_season_for_month(correct_month, "en")

    # Replace month in frontmatter title
    title_match = re.search(r'title:\s*"([^"]+)"', content)
    old_title = title_match.group(1)
    new_title = replace_month_in_text(old_title, wrong_month, correct_month)

    # Replace month in content body
    new_content = replace_month_in_text(content, wrong_month, correct_month)

    # Replace season if it changed
    if old_season_en != new_season_en:
        new_content = replace_season_in_text(new_content, old_season_en, new_season_en)

    # Update slug
    new_slug = title_to_slug(new_title)
    old_slug_match = re.search(r'slug:\s*"([^"]+)"', new_content)
    if old_slug_match:
        old_slug = old_slug_match.group(1)
        new_content = new_content.replace(f'slug: "{old_slug}"', f'slug: "{new_slug}"')

    # Update image_folder paths (replace old month name in path)
    old_slug_for_path = title_to_slug(old_title)
    if old_slug_for_path != new_slug:
        new_content = new_content.replace(old_slug_for_path, new_slug)

    changes.append(f"EN: '{old_title}' → '{new_title}'")

    if not dry_run:
        # Write content
        new_filename = f"{post_id}-{new_slug}.md"
        new_path = EN_DIR / new_filename
        en_file.write_text(new_content)

        # Rename file if slug changed
        if en_file.name != new_filename:
            if new_path.exists() and new_path != en_file:
                changes.append(f"EN: WARNING - target file {new_filename} already exists!")
            else:
                en_file.rename(new_path)
                changes.append(f"EN: Renamed {en_file.name} → {new_filename}")

        # Rename image folder if it exists
        old_img_dir = PROJECT_ROOT / "public" / "images" / "blog"
        # Find the image folder - it could be in various year/month subdirs
        for year_dir in old_img_dir.iterdir() if old_img_dir.exists() else []:
            if not year_dir.is_dir():
                continue
            for month_dir in year_dir.iterdir():
                if not month_dir.is_dir():
                    continue
                old_folder = month_dir / old_slug_for_path
                if old_folder.exists() and old_slug_for_path != new_slug:
                    new_folder = month_dir / new_slug
                    if not new_folder.exists():
                        old_folder.rename(new_folder)
                        changes.append(f"EN: Renamed image folder → {new_slug}")

    # --- Spanish post ---
    es_files = list(ES_DIR.glob(f"{post_id}-*.md"))
    if es_files:
        es_file = es_files[0]
        es_content = es_file.read_text()

        # Map English months to Spanish
        wrong_month_es = MONTHS_ES[MONTH_NUM_EN[wrong_month] - 1]
        correct_month_es = MONTHS_ES[MONTH_NUM_EN[correct_month] - 1]
        old_season_es = MONTH_TO_SEASON_ES.get(wrong_month_es, "")
        new_season_es = MONTH_TO_SEASON_ES.get(correct_month_es, "")

        # Replace month in Spanish content
        new_es_content = replace_month_in_text(es_content, wrong_month_es, correct_month_es)

        # Replace season if changed
        if old_season_es and new_season_es and old_season_es != new_season_es:
            new_es_content = replace_season_in_text(new_es_content, old_season_es, new_season_es)

        # Update slug in Spanish frontmatter
        es_title_match = re.search(r'title:\s*"([^"]+)"', new_es_content)
        if es_title_match:
            new_es_title = es_title_match.group(1)
            new_es_slug = title_to_slug(new_es_title)
            es_slug_match = re.search(r'slug:\s*"([^"]+)"', new_es_content)
            if es_slug_match:
                old_es_slug = es_slug_match.group(1)
                new_es_content = new_es_content.replace(f'slug: "{old_es_slug}"', f'slug: "{new_es_slug}"')

        # Also update image paths in ES (they reference EN image folders)
        if old_slug_for_path != new_slug:
            new_es_content = new_es_content.replace(old_slug_for_path, new_slug)

        changes.append(f"ES: Updated month {wrong_month_es} → {correct_month_es}")

        if not dry_run:
            new_es_filename = f"{post_id}-{new_es_slug}.md"
            new_es_path = ES_DIR / new_es_filename
            es_file.write_text(new_es_content)

            if es_file.name != new_es_filename:
                if new_es_path.exists() and new_es_path != es_file:
                    changes.append(f"ES: WARNING - target file {new_es_filename} already exists!")
                else:
                    es_file.rename(new_es_path)
                    changes.append(f"ES: Renamed {es_file.name} → {new_es_filename}")

    return changes


# =============================================================================
# SPANISH WEATHER SYNC (apply same weather fixes to ES posts)
# =============================================================================

def sync_weather_to_spanish(dry_run=False):
    """Apply weather fixes to all Spanish dry-season posts."""
    fixed = 0
    for f in sorted(ES_DIR.glob("*.md")):
        content = f.read_text()
        # Detect month from English equivalent filename or content
        month_or_season, kind = None, None
        fname = f.name.lower()
        for month_es, month_num in MONTH_NUM_ES.items():
            if month_es in fname:
                month_or_season = MONTHS_EN[month_num - 1]
                kind = "month"
                break
        if not month_or_season:
            for season_es, season_en in [("invierno", "winter"), ("primavera", "spring"),
                                          ("verano", "summer"), ("otoño", "fall")]:
                if season_es in fname:
                    month_or_season = season_en
                    kind = "season"
                    break
        if not month_or_season:
            # Try English month names in the image paths
            for month in MONTHS_EN:
                if month in fname:
                    month_or_season = month
                    kind = "month"
                    break
        if not month_or_season:
            continue
        if not is_dry_season(month_or_season, kind):
            continue

        original = content
        content = fix_weather_es(content, month_or_season)
        if content != original:
            fixed += 1
            if not dry_run:
                f.write_text(content)

    return fixed


# =============================================================================
# MAIN
# =============================================================================

def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    verbose = "-v" in args or "--verbose" in args
    weather_only = "--weather-only" in args
    month_fix = "--month-fix" in args
    single_id = None

    for arg in args:
        if arg.isdigit():
            single_id = arg.zfill(4)

    if not weather_only and not month_fix:
        print("Usage: python fix_temporal.py [--weather-only|--month-fix] [--dry-run] [-v] [POST_ID]")
        sys.exit(1)

    if dry_run:
        print("=== DRY RUN MODE ===\n")

    if weather_only:
        print("--- Fixing weather inaccuracies (EN) ---")
        en_fixed = 0
        for f in sorted(EN_DIR.glob("*.md")):
            if single_id:
                if not f.name.startswith(single_id + "-"):
                    continue
            fixed, changes = process_weather_fix(f, dry_run, "en")
            if fixed:
                en_fixed += 1
                if verbose:
                    print(f"  {'[DRY]' if dry_run else 'Fixed'}: {f.name}")
        print(f"{'Would fix' if dry_run else 'Fixed'}: {en_fixed} EN files\n")

        print("--- Fixing weather inaccuracies (ES) ---")
        es_fixed = sync_weather_to_spanish(dry_run)
        print(f"{'Would fix' if dry_run else 'Fixed'}: {es_fixed} ES files\n")

    if month_fix:
        print("--- Fixing month mismatches ---")
        mismatches = find_month_mismatches()
        if single_id:
            mismatches = [m for m in mismatches if m['id'] == single_id]

        print(f"Found {len(mismatches)} mismatches\n")

        for m in mismatches:
            if verbose or single_id:
                print(f"Post {m['id']}: {m['wrong_month']} → {m['correct_month']} (published {m['date']})")
                print(f"  Title: {m['title']}")

            changes = fix_month_mismatch(m, dry_run)
            if verbose or single_id:
                for c in changes:
                    print(f"  {c}")
                print()

        print(f"{'Would fix' if dry_run else 'Fixed'}: {len(mismatches)} posts")


if __name__ == "__main__":
    main()
