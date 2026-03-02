#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add blog posts for 9 new services: appliance-moving, piano-moving, pool-table-moving,
hot-tub-moving, art-moving, white-glove-moving, specialty-item-moving, storage-solutions,
junk-removal.

This script:
1. Displaces existing Mon/Wed posts from 2024-2030 to 2031+ to make room
2. Creates 225 new posts (180 Mon service + 45 Wed listicle)
3. Re-links existing listicles to services
4. Renumbers all posts by date
5. Regenerates index.json

Usage:
  python scripts/add_new_service_posts.py
"""

import json
import os
import re
import shutil
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from math import floor
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

BLOG_DIR = Path("content/blog")
IMAGE_DIR = Path("public/images/blog")
INDEX_FILE = BLOG_DIR / "index.json"

NEW_SERVICES = [
    "appliance-moving", "piano-moving", "pool-table-moving",
    "hot-tub-moving", "art-moving", "white-glove-moving",
    "specialty-item-moving", "storage-solutions", "junk-removal",
]

EXISTING_SERVICES = [
    "packing-services", "local-moving", "long-distance-moving",
    "residential-moving", "commercial-moving", "furniture-moving",
    "celebrity-moving", "apartment-moving", "full-service-moving",
    "labor-only-moving", "military-moving", "same-day-moving",
    "senior-moving", "student-moving", "safe-moving",
    "antique-moving", "office-moving", "same-building-moving",
    "last-minute-moving", "hourly-moving", "special-needs-moving",
]

# Time-sensitive patterns - posts matching these should NOT be displaced
# Only block posts with explicit year references. Seasonal/monthly/holiday
# references are evergreen content and can be displaced safely.
TIME_SENSITIVE_PATTERNS = [
    r"\b2024\b", r"\b2025\b", r"\b2026\b", r"\b2027\b",
    r"\b2028\b", r"\b2029\b", r"\b2030\b",
]

# Keywords for re-linking listicles to existing services
SERVICE_KEYWORDS = {
    "packing-services": ["pack", "box", "wrap", "material", "supplies", "packing"],
    "local-moving": ["local", "neighborhood", "nearby", "short distance"],
    "long-distance-moving": ["long distance", "cross country", "interstate", "road trip"],
    "residential-moving": ["home", "house", "family", "residential", "suburb"],
    "commercial-moving": ["business", "commercial", "company", "corporate"],
    "furniture-moving": ["furniture", "sofa", "couch", "table", "bed", "dresser"],
    "celebrity-moving": ["celebrity", "star", "luxury", "mansion", "famous"],
    "apartment-moving": ["apartment", "condo", "high rise", "studio", "loft"],
    "full-service-moving": ["full service", "everything", "complete", "start to finish"],
    "labor-only-moving": ["labor", "loading", "unloading", "helping", "diy"],
    "military-moving": ["military", "veteran", "deployment", "pcs"],
    "same-day-moving": ["same day", "urgent", "emergency", "fast", "quick"],
    "senior-moving": ["senior", "elderly", "retirement", "downsizing", "aging"],
    "student-moving": ["student", "college", "university", "dorm", "campus"],
    "safe-moving": ["safe", "vault", "heavy", "secure", "fireproof"],
    "antique-moving": ["antique", "vintage", "heirloom", "old", "delicate"],
    "office-moving": ["office", "desk", "cubicle", "workspace", "it equipment"],
    "same-building-moving": ["same building", "elevator", "floor", "unit"],
    "last-minute-moving": ["last minute", "rush", "sudden", "unexpected"],
    "hourly-moving": ["hourly", "time", "flexible", "pay per hour"],
    "special-needs-moving": ["special needs", "disability", "accessibility", "medical"],
}

# ============================================================================
# NEW POST TITLES
# ============================================================================

MONDAY_TITLES = {
    "appliance-moving": [
        "How to Prepare Your Appliances for a Move",
        "Refrigerator Moving Mistakes That Cost Homeowners",
        "Washer and Dryer Moving: Disconnect, Move, Reconnect",
        "Moving Kitchen Appliances: A Step-by-Step Guide",
        "Should You Move or Replace Old Appliances",
        "How Movers Protect Your Floors When Moving Appliances",
        "Moving a Refrigerator Safely Down Stairs",
        "Appliance Moving Prep Checklist for Miami Homeowners",
        "How to Secure Appliance Doors and Drawers for Moving",
        "What to Do With Appliances When Downsizing",
        "Moving Built-In Appliances: What You Need to Know",
        "Summer Appliance Moving Tips for Miami Heat",
        "How to Move a Chest Freezer Without Damage",
        "Appliance Reconnection Guide After Your Move",
        "Stacking a Washer and Dryer After Your Move",
        "Gas vs Electric Appliances: Different Moving Requirements",
        "Appliance Moving for Condo and Apartment Residents",
        "How to Move a Wine Fridge Without Damaging the Compressor",
        "Moving Smart Appliances: Keeping Settings and Connections",
        "When Your New Home Has Different Appliance Hookups",
    ],
    "piano-moving": [
        "Piano Moving Guide: What Every Owner Should Know",
        "Upright vs Grand Piano Moving: Key Differences",
        "Protecting Your Pianos Finish During a Move",
        "Does Moving a Piano Affect Its Tuning",
        "How to Move a Baby Grand Piano Safely",
        "Piano Moving Through Tight Doorways and Staircases",
        "When to Hire Piano Movers vs General Movers",
        "Climate Considerations for Piano Moving in Miami",
        "Piano Moving Insurance: What Coverage Do You Need",
        "How to Prepare Your Piano for Moving Day",
        "Digital vs Acoustic Piano Moving Challenges Compared",
        "Moving a Piano Into a High-Rise Apartment",
        "Piano Storage Tips Between Moves",
        "The Cost of Piano Moving: What to Expect",
        "Vintage Piano Moving: Extra Care for Older Instruments",
        "Piano Moving Equipment: What Professionals Use",
        "How Far Can You Move a Piano Without Tuning Issues",
        "Moving a Piano Across State Lines",
        "Choosing the Right Spot for Your Piano in a New Home",
        "Piano Moving Fails and How to Prevent Them",
    ],
    "pool-table-moving": [
        "Pool Table Moving: Disassembly, Transport, and Setup",
        "How to Protect Pool Table Felt During a Move",
        "Choosing the Right Pool Table Movers in Miami",
        "Slate vs MDF Pool Tables: How Moving Differs",
        "Pool Table Leveling After a Move: Getting It Right",
        "DIY vs Professional Pool Table Moving: Real Costs",
        "How to Move a Pool Table to a Different Floor",
        "Re-Felting Your Pool Table After a Move",
        "Pool Table Disassembly: What Professional Movers Do",
        "Moving a Pool Table Into a Garage or Game Room",
        "How Heavy Is a Pool Table and Why It Matters",
        "Pool Table Moving Timeline: What to Expect",
        "Storing a Pool Table During a Move",
        "Common Pool Table Moving Mistakes to Avoid",
        "How to Measure Your Space for Pool Table Placement",
        "Pool Table Brands and Their Moving Requirements",
        "Moving a Snooker Table vs Standard Pool Table",
        "Pool Table Accessories: Packing Cues, Racks, and Lights",
        "Humidity and Pool Table Slate: What Miami Owners Should Know",
        "Setting Up a Game Room in Your New Home",
    ],
    "hot-tub-moving": [
        "Moving a Hot Tub: Planning, Access, and Transport",
        "Hot Tub Relocation Checklist for Miami Homeowners",
        "Electrical and Plumbing Prep for Hot Tub Moving",
        "How Many People Does It Take to Move a Hot Tub",
        "Hot Tub Draining Guide Before Your Move",
        "Moving a Hot Tub Through a Fence or Gate",
        "Hot Tub Moving Costs: What to Budget For",
        "Can You Move a Hot Tub Without a Crane",
        "Preparing Your New Hot Tub Pad After Moving",
        "Winter vs Summer Hot Tub Moving in South Florida",
        "How to Move an Inflatable vs Acrylic Hot Tub",
        "Hot Tub Electrical Requirements at Your New Home",
        "Hiring Hot Tub Movers: Questions to Ask First",
        "Protecting Hot Tub Shells During Transport",
        "Moving a Hot Tub Across Town vs Long Distance",
        "Hot Tub Weight Guide: Planning for Transport",
        "Reconnecting Your Hot Tub After a Move",
        "Hot Tub Moving and HOA Rules in Miami",
        "Moving a Swim Spa: Bigger Challenges Than Standard Hot Tubs",
        "Hot Tub Site Prep at Your New Home",
    ],
    "art-moving": [
        "How to Safely Move Fine Art and Sculptures",
        "Packing Artwork for a Move: Materials and Techniques",
        "Moving a Gallery or Art Collection: A Complete Guide",
        "Insurance Options for Moving Valuable Artwork",
        "Custom Crating for Art: When Standard Packing Fails",
        "Moving Framed Art Without Glass Breakage",
        "Climate Control During Art Transport in Miami",
        "How Art Movers Handle Oversized Paintings",
        "Photographing Your Art Collection Before a Move",
        "Moving Sculptures: Weight, Balance, and Protection",
        "Art Storage Between Moves: Best Practices",
        "Miami Gallery Moving: Coordination and Logistics",
        "DIY Art Packing vs Professional Art Movers",
        "Hanging Art in Your New Home After a Move",
        "Moving Mixed Media and Fragile Art Installations",
        "Transporting Art in Miami Humidity: Precautions to Take",
        "Moving Art Between Galleries and Private Collections",
        "How to Pack Canvas Paintings Without Stretcher Damage",
        "Art Appraisals Before a Move: Why They Matter",
        "Moving Pottery and Ceramics Without Breakage",
    ],
    "white-glove-moving": [
        "What White Glove Moving Actually Includes",
        "White Glove vs Standard Moving: Is the Upgrade Worth It",
        "Premium Moving Services for High-Value Homes",
        "Questions to Ask Before Booking White Glove Movers",
        "Why Miami Luxury Moves Need White Glove Service",
        "White Glove Moving for Electronics and Home Theater",
        "The White Glove Unpacking Experience Explained",
        "How White Glove Movers Protect Hardwood and Marble Floors",
        "White Glove Moving for Condo and High-Rise Relocations",
        "What to Expect From a Dedicated Move Manager",
        "White Glove Moving Day Timeline: Start to Finish",
        "Luxury Furniture and White Glove Handling Techniques",
        "White Glove Moving Insurance and Valuation Options",
        "How to Prepare for a White Glove Move",
        "Comparing White Glove Moving Companies in Miami",
        "White Glove Moving for Wine Cellars and Collections",
        "How White Glove Service Handles Closet and Wardrobe Packing",
        "White Glove Moving for Waterfront and Island Properties",
        "Post-Move Cleaning and Setup With White Glove Service",
        "White Glove Movers and Smart Home Reconnection",
    ],
    "specialty-item-moving": [
        "Unusual Items Our Movers Handle Every Week",
        "Moving a Gun Safe: Weight, Equipment, and Planning",
        "How to Move Wine Collections Without Damage",
        "Moving Gym Equipment: Treadmills, Weights, and More",
        "Relocating Medical Equipment Safely",
        "Moving a Grandfather Clock: A Specialist Guide",
        "How to Move a Marble Table Without Cracking It",
        "Moving Outdoor Furniture and Heavy Patio Sets",
        "When Standard Moving Service Is Not Enough",
        "Moving an Aquarium: Fish, Tank, and Equipment",
        "How Movers Handle Extremely Heavy Items",
        "Moving Workshop and Power Tools Safely",
        "Relocating a Home Gym: Complete Planning Guide",
        "Moving Fragile Antique Furniture Without Damage",
        "How to Move an Electric Vehicle Charger",
        "Moving a Large Safe Up or Down Stairs",
        "Transporting Taxidermy and Mounted Collections",
        "Moving Musical Instruments Beyond Pianos",
        "How to Move a Kegerator or Beverage Station",
        "Moving Mobility Scooters and Power Wheelchairs",
    ],
    "storage-solutions": [
        "Short-Term vs Long-Term Storage: Which Do You Need",
        "Climate-Controlled Storage: Why It Matters in Miami",
        "Packing Items for Storage: Tips to Prevent Damage",
        "Combining Moving and Storage: One Crew, One Process",
        "How to Choose the Right Storage Unit Size",
        "What Not to Put in a Storage Unit",
        "Storage Between Moves: Bridging the Gap",
        "Organizing Your Storage Unit for Easy Access",
        "Monthly Storage Costs in Miami: What to Expect",
        "Seasonal Storage: When Miami Residents Need Extra Space",
        "Moving From Storage to Your New Home",
        "Business Storage Solutions During Office Relocations",
        "Document and Record Storage: Climate and Security Needs",
        "Downsizing Into Storage: A Step-by-Step Approach",
        "Storage Security Features That Matter Most",
        "Storing Furniture Long-Term Without Damage",
        "Vehicle and Boat Storage Options in South Florida",
        "How to Create an Inventory for Stored Items",
        "Storage Unit Insurance: What You Need to Know",
        "Moving Out of Storage: Delivery Day Planning",
    ],
    "junk-removal": [
        "Declutter Before You Move: A Junk Removal Guide",
        "What Junk Removal Companies Will and Wont Take",
        "Moving Day Junk Removal: Save Time and Money",
        "Eco-Friendly Junk Disposal: Donate, Recycle, Remove",
        "How to Decide What to Keep, Donate, or Toss",
        "Junk Removal Before Selling Your Home",
        "Garage Cleanout: From Cluttered to Move-Ready",
        "Estate Cleanouts: Handling a Loved Ones Belongings",
        "Appliance Disposal: Getting Rid of Old Units Responsibly",
        "Construction Debris Removal After Home Renovations",
        "How Much Does Junk Removal Cost in Miami",
        "Yard Waste Removal Before Your Move",
        "Moving and Decluttering: The Two-Pass Method",
        "Hoarding Cleanout Services: Compassionate and Efficient",
        "What Happens to Your Junk After We Haul It Away",
        "Junk Removal vs Dumpster Rental: Which Is Better",
        "Donating Furniture Before a Move: Where and How",
        "Electronics Recycling in Miami: Responsible Disposal",
        "Attic and Basement Cleanout Before Listing Your Home",
        "Bulk Trash Pickup vs Professional Junk Removal",
    ],
}

WEDNESDAY_TITLES = {
    "appliance-moving": [
        "7 Appliance Moving Mistakes That Damage Your Home",
        "5 Kitchen Appliances That Need Special Moving Prep",
        "8 Things to Do Before Moving Your Refrigerator",
        "6 Heavy Appliances and How Pros Move Them",
        "9 Appliance Features That Complicate Moving Day",
    ],
    "piano-moving": [
        "5 Surprising Things That Can Damage a Piano During a Move",
        "7 Questions to Ask Before Hiring Piano Movers",
        "6 Types of Pianos and Their Moving Challenges",
        "8 Piano Moving Horror Stories and How to Avoid Them",
        "5 Reasons Piano Moving Costs More Than You Think",
    ],
    "pool-table-moving": [
        "7 Pool Table Moving Myths Debunked",
        "5 Signs Your Pool Table Was Not Moved Correctly",
        "8 Things Pool Table Owners Forget on Moving Day",
        "6 Game Room Items That Need Professional Moving",
        "7 Ways to Tell If Your Pool Table Is Properly Leveled",
    ],
    "hot-tub-moving": [
        "7 Steps to Drain and Prep a Hot Tub for Moving",
        "5 Access Challenges When Moving a Hot Tub",
        "8 Hot Tub Moving Questions Homeowners Always Ask",
        "6 Backyard Items That Are Harder to Move Than You Think",
        "5 Things Your Hot Tub Mover Wishes You Knew",
    ],
    "art-moving": [
        "7 Mistakes People Make When Packing Artwork",
        "5 Art Moving Supplies You Didnt Know You Needed",
        "8 Tips From Museum Handlers for Your Home Move",
        "6 Most Fragile Types of Artwork to Transport",
        "9 Ways to Protect Art During a Long-Distance Move",
    ],
    "white-glove-moving": [
        "7 Signs You Need White Glove Moving Service",
        "5 Luxury Items That Demand Premium Moving Care",
        "8 Questions That Separate Good White Glove Movers From Great",
        "6 Things Included in White Glove Service You Didnt Expect",
        "7 White Glove Moving Details That Make the Difference",
    ],
    "specialty-item-moving": [
        "7 Weirdest Items Professional Movers Have Relocated",
        "5 Oversized Items That Wont Fit Through Your Door",
        "8 Specialty Items and How Experts Move Them",
        "6 Heavy Home Items and the Equipment Needed to Move Them",
        "9 Items That Require a Custom Moving Plan",
    ],
    "storage-solutions": [
        "7 Items That Should Always Go in Climate-Controlled Storage",
        "5 Storage Mistakes That Ruin Your Belongings",
        "8 Creative Uses for Short-Term Storage During a Move",
        "6 Things You Should Never Store in a Storage Unit",
        "7 Ways to Save Money on Storage in Miami",
    ],
    "junk-removal": [
        "7 Items You Should Toss Before Moving Day",
        "5 Creative Ways to Get Rid of Stuff Before a Move",
        "8 Junk Removal Myths That Cost You Money",
        "6 Eco-Friendly Ways to Dispose of Moving Waste",
        "9 Things Cluttering Your Home That Have Resale Value",
    ],
}

# Service display names and categories
SERVICE_NAMES = {
    "appliance-moving": "Appliance Moving",
    "piano-moving": "Piano Moving",
    "pool-table-moving": "Pool Table Moving",
    "hot-tub-moving": "Hot Tub Moving",
    "art-moving": "Art Moving",
    "white-glove-moving": "White Glove Moving",
    "specialty-item-moving": "Specialty Item Moving",
    "storage-solutions": "Storage Solutions",
    "junk-removal": "Junk Removal",
}

SERVICE_IMAGE_KEYWORDS = {
    "appliance-moving": ["refrigerator", "washer dryer", "appliance dolly"],
    "piano-moving": ["grand piano", "upright piano", "piano board"],
    "pool-table-moving": ["pool table", "billiards", "slate"],
    "hot-tub-moving": ["hot tub", "spa", "jacuzzi"],
    "art-moving": ["painting", "sculpture", "gallery"],
    "white-glove-moving": ["premium", "luxury", "white glove"],
    "specialty-item-moving": ["specialty", "unusual items", "oversized"],
    "storage-solutions": ["storage unit", "warehouse", "climate controlled"],
    "junk-removal": ["junk", "debris", "declutter"],
}


# ============================================================================
# PARSING HELPERS
# ============================================================================

def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    m = re.match(r'^---\n(.*?)\n---\n?(.*)', content, re.DOTALL)
    if not m:
        return {}, content
    fm_text = m.group(1)
    body = m.group(2)

    fm = {}
    # Parse simple key-value pairs and lists
    current_key = None
    current_list = None

    for line in fm_text.split('\n'):
        # List item
        if line.startswith('  - ') and current_key:
            val = line.strip()[2:].strip().strip('"').strip("'")
            if current_list is not None:
                current_list.append(val)
            continue

        # Key-value pair
        kv = re.match(r'^(\w[\w_]*)\s*:\s*(.*)', line)
        if kv:
            # Save previous list
            if current_list is not None and current_key:
                fm[current_key] = current_list

            key = kv.group(1)
            val = kv.group(2).strip()

            # Check if this starts a list
            if val == '' or val == '[]':
                current_key = key
                current_list = []
                continue

            current_key = key
            current_list = None

            # Parse value
            if val == 'null' or val == 'None':
                fm[key] = None
            elif val == 'true':
                fm[key] = True
            elif val == 'false':
                fm[key] = False
            elif val.isdigit():
                fm[key] = int(val)
            else:
                fm[key] = val.strip('"').strip("'")

    # Save last list
    if current_list is not None and current_key:
        fm[current_key] = current_list

    return fm, body


def serialize_frontmatter(fm, body):
    """Serialize frontmatter dict back to markdown string."""
    lines = ["---"]
    for key, val in fm.items():
        if isinstance(val, list):
            if not val:
                lines.append(f"{key}: []")
            else:
                lines.append(f"{key}:")
                for item in val:
                    lines.append(f'  - "{item}"')
        elif val is None:
            lines.append(f"{key}: null")
        elif isinstance(val, bool):
            lines.append(f"{key}: {'true' if val else 'false'}")
        elif isinstance(val, int):
            lines.append(f"{key}: {val}")
        else:
            lines.append(f'{key}: "{val}"')
    lines.append("---")
    return "\n".join(lines) + "\n" + body


def generate_slug(title):
    """Generate URL-friendly slug from title."""
    slug = title.lower()
    for char in ["'", '"', ",", ".", "!", "?", ":", ";", "(", ")", "&", "+", "\u2019"]:
        slug = slug.replace(char, "")
    slug = slug.replace(" ", "-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    slug = slug.strip("-")
    return slug[:60]


def is_time_sensitive(title, body_first_500=""):
    """Check if a post is time-sensitive based on title/content patterns."""
    text = title + " " + body_first_500[:500]
    for pattern in TIME_SENSITIVE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def get_schedule_dates(start_date, num_weeks, day_of_week):
    """Generate dates for a specific day of week starting from start_date.
    day_of_week: 0=Mon, 2=Wed, 3=Thu
    """
    dates = []
    current = start_date
    # Find first occurrence of the desired day
    while current.weekday() != day_of_week:
        current += timedelta(days=1)
    for _ in range(num_weeks):
        dates.append(current)
        current += timedelta(weeks=1)
    return dates


# ============================================================================
# MAIN LOGIC
# ============================================================================

def read_all_posts():
    """Read all blog posts and return list of dicts with file info."""
    posts = []
    for f in sorted(BLOG_DIR.iterdir()):
        if not f.name.endswith('.md'):
            continue
        content = f.read_text(encoding='utf-8')
        fm, body = parse_frontmatter(content)
        if 'id' not in fm:
            continue
        posts.append({
            'file': f,
            'filename': f.name,
            'fm': fm,
            'body': body,
            'content': content,
        })
    return posts


def select_monday_displacements(posts, target_count=135):
    """Select Monday posts to displace, proportionally from each service."""
    # Filter to Monday posts (id >= 70)
    monday_posts = []
    for p in posts:
        if p['fm'].get('id', 0) < 70:
            continue
        date = datetime.strptime(p['fm']['date'], '%Y-%m-%d')
        if date.weekday() != 0:
            continue
        svc = p['fm'].get('service_link')
        if not svc:
            continue
        # Normalize service link - only use standard service slugs
        svc_clean = svc.strip('/').split('/')[-1]
        if svc_clean not in EXISTING_SERVICES:
            continue
        monday_posts.append((p, svc_clean))

    # Count per service
    by_service = defaultdict(list)
    for p, svc in monday_posts:
        by_service[svc].append(p)

    total_monday = len(monday_posts)
    print(f"  Total Monday posts (existing services): {total_monday}")

    # Calculate quota per service
    quotas = {}
    allocated = 0
    for svc in sorted(by_service.keys(), key=lambda s: len(by_service[s]), reverse=True):
        count = len(by_service[svc])
        quota = floor(count * target_count / total_monday)
        quotas[svc] = quota
        allocated += quota

    # Distribute remainder to largest services
    remainder = target_count - allocated
    for svc in sorted(by_service.keys(), key=lambda s: len(by_service[s]), reverse=True):
        if remainder <= 0:
            break
        quotas[svc] += 1
        remainder -= 1

    print(f"  Displacement quotas: {dict(quotas)}")

    # Select evenly spaced posts from each service
    displaced = []
    for svc, quota in quotas.items():
        svc_posts = sorted(by_service[svc], key=lambda p: p['fm']['date'])
        # Select with even spacing, skipping time-sensitive
        eligible = []
        for p in svc_posts:
            title = p['fm'].get('title', '')
            body_start = p['body'][:500] if p.get('body') else ''
            if not is_time_sensitive(title, body_start):
                eligible.append(p)

        if len(eligible) < quota:
            # Not enough non-time-sensitive posts, take what we can
            displaced.extend(eligible)
            print(f"  WARNING: {svc} only has {len(eligible)} eligible posts for quota {quota}")
            continue

        # Select every Nth post for even spacing
        step = len(eligible) / quota
        selected_indices = [int(i * step) for i in range(quota)]
        for idx in selected_indices:
            displaced.append(eligible[idx])

    print(f"  Total Monday posts selected for displacement: {len(displaced)}")
    return displaced


def select_wednesday_displacements(posts, target_count=36):
    """Select Wednesday listicle posts to displace."""
    # Filter to Wednesday posts without service_link or location_link
    wednesday_posts = []
    for p in posts:
        if p['fm'].get('id', 0) < 70:
            continue
        date = datetime.strptime(p['fm']['date'], '%Y-%m-%d')
        if date.weekday() != 2:
            continue
        # Only consider posts without service links that are generic listicles
        svc = p['fm'].get('service_link')
        loc = p['fm'].get('location_link')
        category = p['fm'].get('category', '')
        if svc is not None or loc is not None:
            continue
        # Prefer Fun Facts, Lifestyle, Home & Living
        if category not in ['Fun Facts', 'Lifestyle', 'Home & Living', 'Moving Tips']:
            continue
        wednesday_posts.append(p)

    print(f"  Eligible Wednesday posts for displacement: {len(wednesday_posts)}")

    # Filter out time-sensitive
    eligible = []
    for p in wednesday_posts:
        title = p['fm'].get('title', '')
        body_start = p['body'][:500] if p.get('body') else ''
        if not is_time_sensitive(title, body_start):
            eligible.append(p)

    print(f"  Non-time-sensitive eligible: {len(eligible)}")

    if len(eligible) < target_count:
        print(f"  WARNING: Only {len(eligible)} eligible, taking all")
        return eligible

    # Select with even spacing
    eligible.sort(key=lambda p: p['fm']['date'])
    step = len(eligible) / target_count
    selected_indices = [int(i * step) for i in range(target_count)]
    displaced = [eligible[idx] for idx in selected_indices]

    print(f"  Total Wednesday posts selected for displacement: {len(displaced)}")
    return displaced


def calculate_2031_dates(n_monday, n_wednesday, n_thursday=0):
    """Calculate dates in 2031+ for displaced and new posts.
    Returns (monday_dates, wednesday_dates, thursday_dates).
    """
    # Start from Jan 6, 2031 (first Monday of 2031)
    start = datetime(2031, 1, 6)
    max_weeks = max(n_monday, n_wednesday, n_thursday) + 10

    mon_dates = get_schedule_dates(start, max_weeks, 0)[:n_monday]
    wed_dates = get_schedule_dates(start, max_weeks, 2)[:n_wednesday]
    thu_dates = get_schedule_dates(start, max_weeks, 3)[:n_thursday] if n_thursday > 0 else []

    return mon_dates, wed_dates, thu_dates


def update_image_paths(fm, body, old_date_str, new_date_str):
    """Update image paths in frontmatter and body when date changes."""
    old_dt = datetime.strptime(old_date_str, '%Y-%m-%d')
    new_dt = datetime.strptime(new_date_str, '%Y-%m-%d')

    old_prefix = f"/images/blog/{old_dt.year:04d}/{old_dt.month:02d}/"
    new_prefix = f"/images/blog/{new_dt.year:04d}/{new_dt.month:02d}/"

    if old_prefix == new_prefix:
        return fm, body

    # Update frontmatter fields
    for key in ['image_folder', 'featured']:
        if key in fm and isinstance(fm[key], str) and old_prefix in fm[key]:
            fm[key] = fm[key].replace(old_prefix, new_prefix)

    # Update images list
    if 'images' in fm and isinstance(fm['images'], list):
        fm['images'] = [
            img.replace(old_prefix, new_prefix) if isinstance(img, str) else img
            for img in fm['images']
        ]

    # Update inline image references in body
    body = body.replace(old_prefix, new_prefix)

    return fm, body


def move_image_directory(slug, old_date_str, new_date_str):
    """Move image directory from old date path to new date path."""
    old_dt = datetime.strptime(old_date_str, '%Y-%m-%d')
    new_dt = datetime.strptime(new_date_str, '%Y-%m-%d')

    old_path = IMAGE_DIR / f"{old_dt.year:04d}" / f"{old_dt.month:02d}" / slug
    new_path = IMAGE_DIR / f"{new_dt.year:04d}" / f"{new_dt.month:02d}" / slug

    if old_path == new_path:
        return

    if old_path.exists():
        new_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(old_path), str(new_path))
        return True
    return False


def create_new_post_content(post_id, title, date_str, service_slug, is_listicle=False):
    """Create markdown content for a new post."""
    slug = generate_slug(title)
    dt = datetime.strptime(date_str, '%Y-%m-%d')
    image_folder = f"/images/blog/{dt.year:04d}/{dt.month:02d}/{slug}"
    category = SERVICE_NAMES.get(service_slug, service_slug.replace('-', ' ').title())
    keywords = SERVICE_IMAGE_KEYWORDS.get(service_slug, ["moving"])

    if is_listicle:
        # Determine listicle category
        category = category  # Use service name as category for listicles too

    fm = {
        'id': post_id,
        'title': title,
        'slug': slug,
        'excerpt': '',
        'date': date_str,
        'updated': date_str,
        'readTime': '3 min read',
        'category': category,
        'image_folder': image_folder,
        'featured': f"{image_folder}/featured.jpg",
        'image_keywords': keywords,
        'images': [],
        'service_link': f"/{service_slug}",
        'location_link': None,
        'status': 'pending',
        'needs_ai_image': False,
    }

    body = f"\n# {title}\n\n[Pending content generation]\n"
    return fm, body


def relink_listicles_to_services(posts):
    """Assign service_links to existing Wednesday listicles for the 21 existing services."""
    relinked_count = 0

    # Find all Wednesday posts without service_link
    wednesday_unlinked = []
    for p in posts:
        if p['fm'].get('id', 0) < 70:
            continue
        date = datetime.strptime(p['fm']['date'], '%Y-%m-%d')
        if date.weekday() != 2:
            continue
        if p['fm'].get('service_link') is not None:
            continue
        wednesday_unlinked.append(p)

    print(f"  Unlinked Wednesday posts available: {len(wednesday_unlinked)}")

    # Count existing service_links on Wednesday posts
    existing_links = defaultdict(int)
    for p in posts:
        if p['fm'].get('id', 0) < 70:
            continue
        date = datetime.strptime(p['fm']['date'], '%Y-%m-%d')
        if date.weekday() != 2:
            continue
        svc = p['fm'].get('service_link')
        if svc:
            svc_clean = svc.strip('/')
            existing_links[svc_clean] += 1

    # Extended keywords that also search body content
    EXTENDED_KEYWORDS = {
        "packing-services": ["pack", "box", "wrap", "material", "supplies", "packing", "tape", "bubble"],
        "local-moving": ["local", "neighborhood", "nearby", "short distance", "same city", "across town"],
        "long-distance-moving": ["long distance", "cross country", "interstate", "road trip", "state lines", "cross-country", "out of state"],
        "residential-moving": ["home", "house", "family", "residential", "suburb", "homeowner", "new home"],
        "commercial-moving": ["business", "commercial", "company", "corporate", "warehouse"],
        "furniture-moving": ["furniture", "sofa", "couch", "table", "bed", "dresser", "bookshelf", "mattress", "chair"],
        "celebrity-moving": ["celebrity", "star", "luxury", "mansion", "famous", "high-profile", "nda"],
        "apartment-moving": ["apartment", "condo", "high rise", "studio", "loft", "rental", "lease", "tenant"],
        "full-service-moving": ["full service", "everything", "complete", "start to finish", "door to door", "turnkey"],
        "labor-only-moving": ["labor", "loading", "unloading", "helping", "diy", "rent a truck"],
        "military-moving": ["military", "veteran", "deployment", "pcs", "base", "service member"],
        "same-day-moving": ["same day", "urgent", "emergency", "fast", "quick", "rush", "immediate"],
        "senior-moving": ["senior", "elderly", "retirement", "downsizing", "aging", "older adult", "golden years"],
        "student-moving": ["student", "college", "university", "dorm", "campus", "grad", "semester"],
        "safe-moving": ["safe", "vault", "heavy", "secure", "fireproof", "gun safe", "heavy item"],
        "antique-moving": ["antique", "vintage", "heirloom", "old", "delicate", "fragile", "valuable", "collectible"],
        "office-moving": ["office", "desk", "cubicle", "workspace", "it equipment", "server", "printer", "copier"],
        "same-building-moving": ["same building", "elevator", "floor", "unit", "hallway"],
        "last-minute-moving": ["last minute", "rush", "sudden", "unexpected", "procrastinator", "emergency", "last-minute"],
        "hourly-moving": ["hourly", "time", "flexible", "pay per hour", "by the hour"],
        "special-needs-moving": ["special needs", "disability", "accessibility", "medical", "wheelchair", "mobility"],
    }

    # For each existing service, find best keyword matches (searching title AND body)
    target_per_service = 4
    for svc_slug in EXISTING_SERVICES:
        current_count = existing_links.get(svc_slug, 0)
        needed = max(0, target_per_service - current_count)
        if needed == 0:
            continue

        keywords = EXTENDED_KEYWORDS.get(svc_slug, SERVICE_KEYWORDS.get(svc_slug, []))
        if not keywords:
            continue

        # Score each unlinked post by title (weight 3) and body (weight 1)
        scored = []
        for p in wednesday_unlinked:
            title = p['fm'].get('title', '').lower()
            body_text = p.get('body', '')[:2000].lower()
            score = 0
            for kw in keywords:
                kw_lower = kw.lower()
                if kw_lower in title:
                    score += 3
                elif kw_lower in body_text:
                    score += 1
            if score > 0:
                scored.append((score, p))

        # Sort by score descending, spread across timeline
        scored.sort(key=lambda x: (-x[0], x[1]['fm']['date']))

        # Select top matches but try to spread across timeline
        selected = []
        if len(scored) >= needed:
            # Take best scored but spread them out
            dates = [s[1]['fm']['date'] for s in scored[:needed * 3]]
            if dates:
                step = max(1, len(scored) // (needed * 2))
                for i in range(0, len(scored), step):
                    if len(selected) >= needed:
                        break
                    selected.append(scored[i][1])
            # Fill remainder from top if needed
            for score, p in scored:
                if len(selected) >= needed:
                    break
                if p not in selected:
                    selected.append(p)
        else:
            selected = [s[1] for s in scored]

        selected = selected[:needed]
        for p in selected:
            p['fm']['service_link'] = f"/{svc_slug}"
            if p in wednesday_unlinked:
                wednesday_unlinked.remove(p)
            relinked_count += 1

    # Special re-links by title match
    for p in posts:
        title = p['fm'].get('title', '')
        if 'Clever Storage Solutions' in title and not p['fm'].get('service_link'):
            p['fm']['service_link'] = '/storage-solutions'
            relinked_count += 1
        elif 'Specialty Possessions' in title and not p['fm'].get('service_link'):
            p['fm']['service_link'] = '/specialty-item-moving'
            relinked_count += 1

    print(f"  Re-linked {relinked_count} listicles to services")
    return relinked_count


def renumber_and_rename(posts):
    """Renumber all posts sequentially by date, rename files."""
    # Sort by date, then by original ID for ties
    posts.sort(key=lambda p: (p['fm']['date'], p['fm'].get('id', 0)))

    renames = []
    for new_id, p in enumerate(posts, 1):
        old_id = p['fm']['id']
        p['fm']['id'] = new_id

        slug = p['fm'].get('slug', '')
        new_filename = f"{new_id:04d}-{slug}.md"
        old_file = p['file']

        renames.append((old_file, BLOG_DIR / new_filename, p))

    return renames


def regenerate_index(posts):
    """Regenerate index.json from all posts."""
    index = []
    for p in sorted(posts, key=lambda x: x['fm']['id']):
        fm = p['fm']
        index.append({
            'id': fm['id'],
            'title': fm.get('title', ''),
            'slug': fm.get('slug', ''),
            'date': fm.get('date', ''),
            'category': fm.get('category', ''),
        })
    return index


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("=" * 70)
    print("ADD NEW SERVICE BLOG POSTS")
    print("=" * 70)

    # Step 1: Read all existing posts
    print("\n[1/8] Reading all existing posts...")
    posts = read_all_posts()
    print(f"  Found {len(posts)} posts")

    # Step 2: Select posts to displace
    print("\n[2/8] Selecting posts to displace...")
    monday_displaced = select_monday_displacements(posts)
    wednesday_displaced = select_wednesday_displacements(posts)
    all_displaced = monday_displaced + wednesday_displaced
    displaced_ids = {p['fm']['id'] for p in all_displaced}
    print(f"  Total displaced: {len(all_displaced)}")

    # Step 3: Calculate 2031+ dates
    print("\n[3/8] Calculating 2031+ schedule dates...")

    # We need dates for:
    # - Displaced Monday posts + extra new Monday posts (45)
    # - Displaced Wednesday posts + extra new Wednesday posts (9)
    n_monday_2031 = len(monday_displaced) + 45  # displaced + remaining new service posts
    n_wednesday_2031 = len(wednesday_displaced) + 9  # displaced + remaining new listicle posts

    mon_2031_dates, wed_2031_dates, _ = calculate_2031_dates(n_monday_2031, n_wednesday_2031)
    print(f"  Monday 2031+ dates: {len(mon_2031_dates)} (first: {mon_2031_dates[0].strftime('%Y-%m-%d')}, last: {mon_2031_dates[-1].strftime('%Y-%m-%d')})")
    print(f"  Wednesday 2031+ dates: {len(wed_2031_dates)} (first: {wed_2031_dates[0].strftime('%Y-%m-%d')}, last: {wed_2031_dates[-1].strftime('%Y-%m-%d')})")

    # Interleave displaced posts and new 2031+ posts into the 2031+ date slots
    # For Monday: alternate between displaced and new to spread coverage
    # For Wednesday: similarly interleave

    # Step 4: Collect freed date slots from displaced posts
    print("\n[4/8] Processing displacements and creating new posts...")

    freed_monday_dates = sorted([p['fm']['date'] for p in monday_displaced])
    freed_wednesday_dates = sorted([p['fm']['date'] for p in wednesday_displaced])

    # Assign 2031+ dates to displaced posts (interleaved with new 2031+ posts)
    # Displaced Monday posts get odd indices, new 2031+ Monday posts get even indices
    # This interleaves new and old content

    # Actually, let's just assign them in order: displaced first, then new
    # The displaced keep their existing content, new get skeleton content
    mon_displaced_sorted = sorted(monday_displaced, key=lambda p: p['fm']['date'])
    wed_displaced_sorted = sorted(wednesday_displaced, key=lambda p: p['fm']['date'])

    # Interleave: for every N displaced posts, insert 1 new post
    # Monday: 135 displaced + 45 new = 180 total, ratio is 3:1
    # Wednesday: 36 displaced + 9 new = 45 total, ratio is 4:1

    def interleave_dates(displaced_list, new_count, all_dates):
        """Assign dates interleaving displaced and new posts."""
        total = len(displaced_list) + new_count
        ratio = len(displaced_list) / total if total > 0 else 0

        displaced_dates = []
        new_dates = []
        d_idx = 0
        n_idx = 0

        for i, dt in enumerate(all_dates[:total]):
            date_str = dt.strftime('%Y-%m-%d')
            # Rough interleaving: every Nth slot is for a new post
            if n_idx < new_count and (d_idx >= len(displaced_list) or
                (i + 1) % (len(displaced_list) // new_count + 1) == 0):
                new_dates.append(date_str)
                n_idx += 1
            elif d_idx < len(displaced_list):
                displaced_dates.append(date_str)
                d_idx += 1
            elif n_idx < new_count:
                new_dates.append(date_str)
                n_idx += 1

        return displaced_dates, new_dates

    mon_disp_dates, mon_new_2031_dates = interleave_dates(
        mon_displaced_sorted, 45, mon_2031_dates
    )
    wed_disp_dates, wed_new_2031_dates = interleave_dates(
        wed_displaced_sorted, 9, wed_2031_dates
    )

    # Step 5: Update displaced posts with new dates
    print("\n[5/8] Updating displaced post dates and image paths...")
    images_moved = 0

    for i, p in enumerate(mon_displaced_sorted):
        old_date = p['fm']['date']
        new_date = mon_disp_dates[i]
        slug = p['fm'].get('slug', '')

        # Update image paths
        p['fm'], p['body'] = update_image_paths(p['fm'], p['body'], old_date, new_date)

        # Move image directory
        if move_image_directory(slug, old_date, new_date):
            images_moved += 1

        # Update dates
        p['fm']['date'] = new_date
        p['fm']['updated'] = new_date

    for i, p in enumerate(wed_displaced_sorted):
        old_date = p['fm']['date']
        new_date = wed_disp_dates[i]
        slug = p['fm'].get('slug', '')

        p['fm'], p['body'] = update_image_paths(p['fm'], p['body'], old_date, new_date)
        if move_image_directory(slug, old_date, new_date):
            images_moved += 1

        p['fm']['date'] = new_date
        p['fm']['updated'] = new_date

    print(f"  Image directories moved: {images_moved}")

    # Step 6: Create new posts
    print("\n[6/8] Creating new posts...")
    next_id = max(p['fm']['id'] for p in posts) + 1
    new_posts = []

    # Assign Monday service titles to freed slots and 2031+ slots
    # 15 per service go into freed 2024-2030 slots, 5 per service go into 2031+
    service_list = list(MONDAY_TITLES.keys())  # 9 services

    # Distribute freed Monday dates across services (round-robin)
    freed_mon_by_service = defaultdict(list)
    for i, date_str in enumerate(freed_monday_dates):
        svc = service_list[i % len(service_list)]
        freed_mon_by_service[svc].append(date_str)

    # Distribute 2031+ Monday dates across services
    new_2031_mon_by_service = defaultdict(list)
    for i, date_str in enumerate(mon_new_2031_dates):
        svc = service_list[i % len(service_list)]
        new_2031_mon_by_service[svc].append(date_str)

    # Create Monday posts
    for svc in service_list:
        titles = MONDAY_TITLES[svc]
        dates = sorted(freed_mon_by_service[svc]) + sorted(new_2031_mon_by_service[svc])
        for j, title in enumerate(titles):
            if j >= len(dates):
                print(f"  WARNING: Not enough dates for {svc} title #{j+1}: {title}")
                break
            fm, body = create_new_post_content(next_id, title, dates[j], svc)
            new_posts.append({
                'file': None,  # Will be assigned during renaming
                'filename': None,
                'fm': fm,
                'body': body,
                'content': None,
            })
            next_id += 1

    # Distribute freed Wednesday dates across services (round-robin)
    freed_wed_by_service = defaultdict(list)
    for i, date_str in enumerate(freed_wednesday_dates):
        svc = service_list[i % len(service_list)]
        freed_wed_by_service[svc].append(date_str)

    # Distribute 2031+ Wednesday dates
    new_2031_wed_by_service = defaultdict(list)
    for i, date_str in enumerate(wed_new_2031_dates):
        svc = service_list[i % len(service_list)]
        new_2031_wed_by_service[svc].append(date_str)

    # Create Wednesday posts
    for svc in service_list:
        titles = WEDNESDAY_TITLES[svc]
        dates = sorted(freed_wed_by_service[svc]) + sorted(new_2031_wed_by_service[svc])
        for j, title in enumerate(titles):
            if j >= len(dates):
                print(f"  WARNING: Not enough dates for {svc} Wed title #{j+1}: {title}")
                break
            fm, body = create_new_post_content(next_id, title, dates[j], svc, is_listicle=True)
            new_posts.append({
                'file': None,
                'filename': None,
                'fm': fm,
                'body': body,
                'content': None,
            })
            next_id += 1

    print(f"  Created {len(new_posts)} new posts")

    # Step 7: Re-link existing listicles
    print("\n[7/8] Re-linking listicles to services...")
    all_posts = posts + new_posts
    relinked = relink_listicles_to_services(all_posts)

    # Step 8: Renumber, rename, and write everything
    print("\n[8/8] Renumbering, writing files, and generating index...")

    # Assign slugs to new posts that don't have filenames yet
    for p in new_posts:
        slug = p['fm'].get('slug', '')
        p['file'] = BLOG_DIR / f"TEMP-{p['fm']['id']:04d}-{slug}.md"

    # First, write all modified existing posts back
    for p in posts:
        content = serialize_frontmatter(p['fm'], p['body'])
        p['file'].write_text(content, encoding='utf-8')

    # Write new posts to temp files
    for p in new_posts:
        content = serialize_frontmatter(p['fm'], p['body'])
        p['file'].write_text(content, encoding='utf-8')

    # Now renumber everything
    renames = renumber_and_rename(all_posts)

    # Do renames in two phases to avoid conflicts:
    # Phase 1: Rename all to temp names
    temp_dir = BLOG_DIR / "_temp_rename"
    temp_dir.mkdir(exist_ok=True)

    for old_file, new_file, p in renames:
        temp_file = temp_dir / new_file.name
        if old_file.exists():
            content = serialize_frontmatter(p['fm'], p['body'])
            temp_file.write_text(content, encoding='utf-8')
            old_file.unlink()

    # Phase 2: Move from temp to final
    for f in temp_dir.iterdir():
        if f.name.endswith('.md'):
            dest = BLOG_DIR / f.name
            shutil.move(str(f), str(dest))
            # Update the file reference
            for _, new_file, p in renames:
                if new_file.name == f.name:
                    p['file'] = dest
                    break

    temp_dir.rmdir()

    # Clean up any leftover TEMP- files
    for f in BLOG_DIR.iterdir():
        if f.name.startswith('TEMP-'):
            f.unlink()

    # Generate index.json
    index = regenerate_index(all_posts)
    INDEX_FILE.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding='utf-8')

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"  Total posts: {len(all_posts)}")
    print(f"  Displaced posts: {len(all_displaced)}")
    print(f"    Monday: {len(monday_displaced)}")
    print(f"    Wednesday: {len(wednesday_displaced)}")
    print(f"  New posts created: {len(new_posts)}")
    print(f"  Listicles re-linked: {relinked}")
    print(f"  Image directories moved: {images_moved}")
    print(f"  Index entries: {len(index)}")

    # Verification
    print("\n" + "=" * 70)
    print("VERIFICATION")
    print("=" * 70)
    md_files = list(BLOG_DIR.glob("*.md"))
    print(f"  Markdown files on disk: {len(md_files)}")
    print(f"  Index.json entries: {len(index)}")

    # Check service coverage
    service_mon_counts = defaultdict(int)
    service_wed_counts = defaultdict(int)
    for p in all_posts:
        svc = p['fm'].get('service_link')
        if not svc:
            continue
        svc_clean = svc.strip('/')
        date = datetime.strptime(p['fm']['date'], '%Y-%m-%d')
        if date.weekday() == 0:
            service_mon_counts[svc_clean] += 1
        elif date.weekday() == 2:
            service_wed_counts[svc_clean] += 1

    print("\n  Monday posts per new service:")
    for svc in NEW_SERVICES:
        count = service_mon_counts.get(svc, 0)
        print(f"    {svc}: {count}")

    print("\n  Wednesday posts per new service:")
    for svc in NEW_SERVICES:
        count = service_wed_counts.get(svc, 0)
        print(f"    {svc}: {count}")

    # Check for displaced posts with time-sensitive content
    print("\n  Checking displaced posts for time-sensitivity issues...")
    issues = 0
    for p in all_displaced:
        title = p['fm'].get('title', '')
        date = p['fm']['date']
        year = date[:4]
        # Check if title mentions a specific year that doesn't match
        for yr in ['2024', '2025', '2026', '2027', '2028', '2029', '2030']:
            if yr in title and year != yr:
                print(f"    ISSUE: Post '{title}' mentions {yr} but dated {date}")
                issues += 1
    if issues == 0:
        print("    No issues found")

    print("\nDone!")


if __name__ == "__main__":
    main()
