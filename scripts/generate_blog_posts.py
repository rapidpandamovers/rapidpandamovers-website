#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate 312 blog posts (3 posts/week for 2 years) starting February 2026.

Content Strategy:
- Mondays: Service + Topical posts (links to service page)
- Wednesdays: Listicle posts (eye-grabbing, 5-10 items)
- Thursdays: Location + Moving Topic posts (links to location page)

Usage:
  python scripts/generate_blog_posts.py
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
import random

# Services list (21 services) - will rotate through these
SERVICES = [
    {"slug": "packing-services", "name": "Packing Services", "keywords": ["packing", "boxes", "wrapping", "supplies"]},
    {"slug": "local-moving", "name": "Local Moving", "keywords": ["moving truck", "local move", "neighborhood", "residential"]},
    {"slug": "long-distance-moving", "name": "Long Distance Moving", "keywords": ["highway", "cross country", "interstate", "road trip"]},
    {"slug": "residential-moving", "name": "Residential Moving", "keywords": ["house", "home", "family", "suburban"]},
    {"slug": "commercial-moving", "name": "Commercial Moving", "keywords": ["office", "business", "corporate", "workplace"]},
    {"slug": "furniture-moving", "name": "Furniture Moving", "keywords": ["furniture", "sofa", "couch", "heavy lifting"]},
    {"slug": "celebrity-moving", "name": "Celebrity Moving", "keywords": ["luxury", "mansion", "private", "exclusive"]},
    {"slug": "apartment-moving", "name": "Apartment Moving", "keywords": ["apartment", "condo", "high rise", "urban"]},
    {"slug": "full-service-moving", "name": "Full-Service Moving", "keywords": ["professional movers", "full service", "white glove"]},
    {"slug": "labor-only-moving", "name": "Labor Only Moving", "keywords": ["workers", "loading", "unloading", "helping hands"]},
    {"slug": "military-moving", "name": "Military Moving", "keywords": ["military", "veterans", "american flag", "service"]},
    {"slug": "same-day-moving", "name": "Same Day Moving", "keywords": ["fast", "urgent", "quick", "clock"]},
    {"slug": "senior-moving", "name": "Senior Moving", "keywords": ["seniors", "elderly", "retirement", "downsizing"]},
    {"slug": "student-moving", "name": "Student Moving", "keywords": ["college", "university", "dorm", "students"]},
    {"slug": "safe-moving", "name": "Safe Moving", "keywords": ["safe", "security", "heavy", "vault"]},
    {"slug": "antique-moving", "name": "Antique Moving", "keywords": ["antique", "vintage", "valuable", "art"]},
    {"slug": "office-moving", "name": "Office Moving", "keywords": ["office", "desk", "computer", "business"]},
    {"slug": "same-building-moving", "name": "Same Building Moving", "keywords": ["building", "elevator", "hallway", "apartment"]},
    {"slug": "last-minute-moving", "name": "Last Minute Moving", "keywords": ["urgent", "last minute", "rush", "quick"]},
    {"slug": "hourly-moving", "name": "Hourly Moving", "keywords": ["clock", "time", "hourly", "flexible"]},
    {"slug": "special-needs-moving", "name": "Special Needs Moving", "keywords": ["accessibility", "care", "medical", "assistance"]},
    {"slug": "appliance-moving", "name": "Appliance Moving", "keywords": ["refrigerator", "washer dryer", "appliance dolly", "heavy appliance"]},
    {"slug": "piano-moving", "name": "Piano Moving", "keywords": ["grand piano", "upright piano", "piano board", "music instrument"]},
    {"slug": "pool-table-moving", "name": "Pool Table Moving", "keywords": ["pool table", "billiards", "slate", "game room"]},
    {"slug": "hot-tub-moving", "name": "Hot Tub Moving", "keywords": ["hot tub", "spa", "jacuzzi", "backyard"]},
    {"slug": "art-moving", "name": "Art Moving", "keywords": ["painting", "sculpture", "gallery", "fine art"]},
    {"slug": "white-glove-moving", "name": "White Glove Moving", "keywords": ["premium", "luxury", "white glove", "careful handling"]},
    {"slug": "specialty-item-moving", "name": "Specialty Item Moving", "keywords": ["specialty", "unusual items", "oversized", "custom"]},
    {"slug": "storage-solutions", "name": "Storage Solutions", "keywords": ["storage unit", "warehouse", "climate controlled", "secure storage"]},
    {"slug": "junk-removal", "name": "Junk Removal", "keywords": ["junk", "debris", "declutter", "haul away"]},
]

# Miami-Dade cities (35 cities)
CITIES = [
    {"slug": "miami", "name": "Miami", "keywords": ["miami skyline", "miami beach", "south florida", "palm trees"]},
    {"slug": "miami-beach", "name": "Miami Beach", "keywords": ["miami beach", "ocean", "art deco", "south beach"]},
    {"slug": "coral-gables", "name": "Coral Gables", "keywords": ["coral gables", "mediterranean", "biltmore", "luxury homes"]},
    {"slug": "hialeah", "name": "Hialeah", "keywords": ["hialeah", "florida suburb", "residential", "community"]},
    {"slug": "homestead", "name": "Homestead", "keywords": ["homestead florida", "everglades", "farmland", "suburban"]},
    {"slug": "north-miami", "name": "North Miami", "keywords": ["north miami", "florida neighborhood", "residential"]},
    {"slug": "north-miami-beach", "name": "North Miami Beach", "keywords": ["north miami beach", "coastal", "florida"]},
    {"slug": "miami-gardens", "name": "Miami Gardens", "keywords": ["miami gardens", "florida suburb", "community"]},
    {"slug": "aventura", "name": "Aventura", "keywords": ["aventura", "mall", "luxury", "waterfront"]},
    {"slug": "doral", "name": "Doral", "keywords": ["doral", "golf course", "business park", "florida"]},
    {"slug": "sunny-isles-beach", "name": "Sunny Isles Beach", "keywords": ["sunny isles", "beach", "condos", "oceanfront"]},
    {"slug": "kendall", "name": "Kendall", "keywords": ["kendall florida", "suburban", "family", "community"]},
    {"slug": "palmetto-bay", "name": "Palmetto Bay", "keywords": ["palmetto bay", "waterfront", "florida", "family"]},
    {"slug": "pinecrest", "name": "Pinecrest", "keywords": ["pinecrest", "luxury homes", "gardens", "family"]},
    {"slug": "cutler-bay", "name": "Cutler Bay", "keywords": ["cutler bay", "florida", "suburban", "family"]},
    {"slug": "key-biscayne", "name": "Key Biscayne", "keywords": ["key biscayne", "island", "beach", "tropical"]},
    {"slug": "miami-lakes", "name": "Miami Lakes", "keywords": ["miami lakes", "planned community", "florida"]},
    {"slug": "miami-springs", "name": "Miami Springs", "keywords": ["miami springs", "historic", "florida", "residential"]},
    {"slug": "opa-locka", "name": "Opa-locka", "keywords": ["opa locka", "moorish architecture", "florida"]},
    {"slug": "sweetwater", "name": "Sweetwater", "keywords": ["sweetwater florida", "community", "residential"]},
    {"slug": "west-miami", "name": "West Miami", "keywords": ["west miami", "florida", "residential", "neighborhood"]},
    {"slug": "south-miami", "name": "South Miami", "keywords": ["south miami", "downtown", "shops", "community"]},
    {"slug": "bal-harbour", "name": "Bal Harbour", "keywords": ["bal harbour", "luxury", "shopping", "oceanfront"]},
    {"slug": "bay-harbor-islands", "name": "Bay Harbor Islands", "keywords": ["bay harbor", "islands", "waterfront", "florida"]},
    {"slug": "biscayne-park", "name": "Biscayne Park", "keywords": ["biscayne park", "historic", "florida", "village"]},
    {"slug": "el-portal", "name": "El Portal", "keywords": ["el portal", "historic", "miami", "village"]},
    {"slug": "florida-city", "name": "Florida City", "keywords": ["florida city", "everglades", "gateway", "southern florida"]},
    {"slug": "golden-beach", "name": "Golden Beach", "keywords": ["golden beach", "exclusive", "oceanfront", "luxury"]},
    {"slug": "indian-creek", "name": "Indian Creek", "keywords": ["indian creek", "billionaire", "island", "exclusive"]},
    {"slug": "medley", "name": "Medley", "keywords": ["medley florida", "industrial", "business", "warehouse"]},
    {"slug": "miami-shores", "name": "Miami Shores", "keywords": ["miami shores", "historic", "bayfront", "village"]},
    {"slug": "surfside", "name": "Surfside", "keywords": ["surfside", "beach", "oceanfront", "florida"]},
    {"slug": "virginia-gardens", "name": "Virginia Gardens", "keywords": ["virginia gardens", "miami", "residential"]},
    {"slug": "westchester", "name": "Westchester", "keywords": ["westchester florida", "suburban", "community"]},
    {"slug": "coconut-grove", "name": "Coconut Grove", "keywords": ["coconut grove", "bohemian", "waterfront", "historic"]},
]

# Monthly themes
MONTHLY_THEMES = {
    1: {"name": "January", "season": "Winter", "themes": ["the New Year", "Winter", "Tax Season"], "title_themes": ["New Year", "Winter", "January"], "keywords": ["new year", "winter", "fresh start"]},
    2: {"name": "February", "season": "Winter", "themes": ["Valentine's Day", "Tax Season", "Winter"], "title_themes": ["Valentine's Day", "Winter", "February"], "keywords": ["valentines", "love", "winter", "couple"]},
    3: {"name": "March", "season": "Spring", "themes": ["Spring Cleaning", "Spring Break", "Spring Renewal"], "title_themes": ["Spring Cleaning", "March", "Spring"], "keywords": ["spring", "cleaning", "flowers", "fresh"]},
    4: {"name": "April", "season": "Spring", "themes": ["Easter", "Earth Day", "Spring Moving Season"], "title_themes": ["Easter", "Earth Day", "Spring", "April"], "keywords": ["spring", "earth day", "nature", "green"]},
    5: {"name": "May", "season": "Spring", "themes": ["Mother's Day", "Memorial Day", "Graduation Season"], "title_themes": ["Mother's Day", "Memorial Day", "Graduation"], "keywords": ["graduation", "memorial day", "spring", "celebration"]},
    6: {"name": "June", "season": "Summer", "themes": ["Father's Day", "Peak Moving Season", "Summer"], "title_themes": ["Father's Day", "Summer", "June"], "keywords": ["summer", "sunshine", "beach", "vacation"]},
    7: {"name": "July", "season": "Summer", "themes": ["Fourth of July", "Summer Heat", "Vacation"], "title_themes": ["July 4th", "Summer Heat", "July"], "keywords": ["summer", "fourth of july", "fireworks", "hot"]},
    8: {"name": "August", "season": "Summer", "themes": ["Back to School", "College Move-In", "End of Summer"], "title_themes": ["Back to School", "College", "August"], "keywords": ["back to school", "college", "summer", "students"]},
    9: {"name": "September", "season": "Fall", "themes": ["Labor Day", "Fall Moving Season", "Football Season"], "title_themes": ["Labor Day", "Fall", "September"], "keywords": ["fall", "autumn", "leaves", "football"]},
    10: {"name": "October", "season": "Fall", "themes": ["Halloween", "Fall Cleaning", "Autumn"], "title_themes": ["Halloween", "Fall", "October"], "keywords": ["halloween", "autumn", "pumpkin", "fall leaves"]},
    11: {"name": "November", "season": "Fall", "themes": ["Thanksgiving", "Veterans Day", "Holiday Prep"], "title_themes": ["Thanksgiving", "Veterans Day", "November"], "keywords": ["thanksgiving", "autumn", "family", "gratitude"]},
    12: {"name": "December", "season": "Winter", "themes": ["Holiday Season", "New Year Planning", "Winter"], "title_themes": ["Holiday", "New Year", "Winter"], "keywords": ["holiday", "christmas", "winter", "new year"]},
}

# Listicle templates with title variants for uniqueness
# Each template has multiple title options to avoid duplicate slugs
# Use {n} as placeholder for random number 5-10
LISTICLE_TEMPLATES = [
    # Moving tips listicles - each with 8 variants
    {"titles": [
        "{n} Moving Hacks That Will Save You Hours of Stress",
        "{n} Pro Moving Tricks the Experts Use",
        "{n} Time-Saving Moving Secrets You Need to Know",
        "{n} Genius Moving Tips From Professional Movers",
        "{n} Brilliant Moving Shortcuts That Actually Work",
        "{n} Moving Strategies That Save Time and Money",
        "{n} Relocation Hacks Every Mover Should Know",
        "{n} Smart Moving Tips to Simplify Your Relocation"
    ], "keywords": ["moving tips", "organization", "packing"], "category": "Moving Tips"},

    {"titles": [
        "{n} Things Professional Movers Wish You Knew",
        "{n} Insider Tips From Experienced Moving Crews",
        "{n} Moving Secrets the Pros Want You to Know",
        "{n} Expert Moving Tips That Make a Difference",
        "{n} Pro Tips Your Moving Crew Wants to Share",
        "{n} Lessons From Seasoned Moving Professionals",
        "{n} Industry Secrets From Full-Time Movers",
        "{n} Professional Moving Insights for Better Moves"
    ], "keywords": ["professional movers", "tips", "advice"], "category": "Moving Tips"},

    {"titles": [
        "{n} Packing Mistakes That Could Ruin Your Move",
        "{n} Common Packing Errors and How to Avoid Them",
        "{n} Packing Blunders That Lead to Damaged Items",
        "{n} Costly Packing Mistakes to Watch Out For",
        "{n} Packing Pitfalls That Cause Moving Disasters",
        "{n} Critical Packing Errors to Avoid",
        "{n} Packing Fails That Damage Your Belongings",
        "{n} Box Packing Mistakes That Cost You Money"
    ], "keywords": ["packing mistakes", "boxes", "fragile"], "category": "Moving Tips"},

    {"titles": [
        "{n} Genius Ways to Declutter Before Your Move",
        "{n} Smart Decluttering Strategies for Moving",
        "{n} Effective Ways to Downsize Before Relocating",
        "{n} Decluttering Hacks That Make Moving Easier",
        "{n} Pre-Move Purging Tips for a Fresh Start",
        "{n} Methods to Lighten Your Load Before Moving",
        "{n} Decluttering Tricks for a Smoother Move",
        "{n} Ways to Minimize Your Moving Inventory"
    ], "keywords": ["declutter", "organize", "minimalism"], "category": "Moving Tips"},

    {"titles": [
        "{n} Moving Day Essentials You Can't Forget",
        "{n} Must-Have Items for a Successful Moving Day",
        "{n} Critical Supplies to Keep Handy When Moving",
        "{n} Essential Things to Pack in Your Moving Day Kit",
        "{n} Items You Need Within Reach on Moving Day",
        "{n} Moving Day Necessities for Every Relocator",
        "{n} Supplies That Make Moving Day Easier",
        "{n} Things to Keep Out of the Moving Truck"
    ], "keywords": ["moving day", "essentials", "checklist"], "category": "Moving Tips"},

    {"titles": [
        "{n} Signs You've Hired the Wrong Moving Company",
        "{n} Red Flags When Choosing a Moving Company",
        "{n} Warning Signs of an Unreliable Mover",
        "{n} Ways to Spot a Bad Moving Company",
        "{n} Indicators Your Mover Might Be a Scam",
        "{n} Clues You Picked the Wrong Moving Service",
        "{n} Moving Company Red Flags to Watch For",
        "{n} Warnings That Your Mover Is Unprofessional"
    ], "keywords": ["moving company", "red flags", "warning"], "category": "Moving Tips"},

    {"titles": [
        "{n} Ways to Keep Kids Happy During a Move",
        "{n} Tips for Moving with Children Stress-Free",
        "{n} Strategies to Help Kids Adjust to a New Home",
        "{n} Ideas to Make Moving Fun for the Whole Family",
        "{n} Tricks to Keep Children Calm During Relocation",
        "{n} Methods for Smooth Family Moves with Kids",
        "{n} Ways to Help Your Children Embrace Moving",
        "{n} Family-Friendly Moving Strategies That Work"
    ], "keywords": ["kids", "family", "children", "happy"], "category": "Moving Tips"},

    {"titles": [
        "{n} Items You Should Never Put on a Moving Truck",
        "{n} Things Movers Aren't Allowed to Transport",
        "{n} Prohibited Items for Moving Day",
        "{n} Belongings You Must Move Yourself",
        "{n} Items That Can't Go in the Moving Van",
        "{n} Things to Keep Off the Moving Truck",
        "{n} Possessions Movers Won't Transport",
        "{n} Items Banned From Professional Moving Trucks"
    ], "keywords": ["prohibited items", "moving truck", "safety"], "category": "Moving Tips"},

    {"titles": [
        "{n} Budget-Friendly Moving Tips That Actually Work",
        "{n} Money-Saving Moving Strategies",
        "{n} Ways to Cut Costs on Your Next Move",
        "{n} Affordable Moving Hacks for Any Budget",
        "{n} Thrifty Moving Tips for Cost-Conscious Families",
        "{n} Smart Ways to Save on Moving Expenses",
        "{n} Budget Moving Tricks That Really Help",
        "{n} Cost-Cutting Strategies for Your Relocation"
    ], "keywords": ["budget", "saving money", "affordable"], "category": "Moving Tips"},

    {"titles": [
        "{n} Last-Minute Moving Tips for the Procrastinator",
        "{n} Quick Tips When You're Running Out of Time",
        "{n} Emergency Moving Hacks for Rushed Relocations",
        "{n} Fast Packing Tips for Last-Minute Moves",
        "{n} Rapid Moving Strategies When Time Is Short",
        "{n} Speed Packing Hacks for Urgent Moves",
        "{n} Quick-Fire Tips for Hasty Relocations",
        "{n} Time-Crunch Moving Solutions That Work"
    ], "keywords": ["last minute", "rush", "quick tips"], "category": "Moving Tips"},

    # Location/lifestyle listicles - each with 2 variants
    {"titles": [
        "{n} Best Restaurants to Try in {city} After Your Move",
        "{n} Must-Try Dining Spots in {city} for New Residents"
    ], "keywords": ["restaurant", "food", "dining"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Hidden Gems Only {city} Locals Know About",
        "{n} Secret Spots in {city} Worth Discovering"
    ], "keywords": ["local secrets", "hidden gems", "explore"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Best Parks and Outdoor Spaces in {city}",
        "{n} Green Spaces in {city} Perfect for Relaxing"
    ], "keywords": ["parks", "nature", "outdoor", "recreation"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Family-Friendly Activities in {city}",
        "{n} Fun Things to Do with Kids in {city}"
    ], "keywords": ["family", "kids", "activities", "fun"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Best Coffee Shops to Work From in {city}",
        "{n} Top Cafes for Remote Workers in {city}"
    ], "keywords": ["coffee shop", "cafe", "remote work"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Things to Do in {city} This Weekend",
        "{n} Weekend Activities to Enjoy in {city}"
    ], "keywords": ["weekend", "activities", "entertainment"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Best Beaches Near {city} for a Day Trip",
        "{n} Stunning Beaches Within Reach of {city}"
    ], "keywords": ["beach", "ocean", "day trip", "florida"], "category": "Lifestyle", "needs_city": True},
    {"titles": [
        "{n} Best Gyms and Fitness Studios in {city}",
        "{n} Top Workout Spots in {city} for New Residents"
    ], "keywords": ["gym", "fitness", "workout", "health"], "category": "Lifestyle", "needs_city": True},

    # Home/settling listicles - each with 8 variants
    {"titles": [
        "{n} Ways to Make Your New House Feel Like Home",
        "{n} Tips for Settling Into Your New Space",
        "{n} Ideas to Transform a House Into a Home",
        "{n} Simple Ways to Personalize Your New Place",
        "{n} Touches That Turn a House Into Your Home",
        "{n} Steps to Making Your New Place Feel Cozy",
        "{n} Methods to Create a Homey Atmosphere Fast",
        "{n} Quick Ways to Settle Into Your New Space"
    ], "keywords": ["home decor", "cozy", "interior"], "category": "Home & Living"},

    {"titles": [
        "{n} First Things to Do When You Move Into a New Home",
        "{n} Essential Tasks for Your First Week in a New Home",
        "{n} Priority Items on Your New Home Checklist",
        "{n} Must-Do Tasks After Moving Into a New Place",
        "{n} Immediate Actions for New Homeowners",
        "{n} Critical Steps After Getting Your New Keys",
        "{n} Day-One Tasks for Your New Residence",
        "{n} First-Week Priorities in Your New Home"
    ], "keywords": ["new home", "checklist", "settling in"], "category": "Home & Living"},

    {"titles": [
        "{n} Easy Home Organization Ideas for New Homeowners",
        "{n} Simple Ways to Organize Your New Space",
        "{n} Organization Tips for a Fresh Start",
        "{n} Clever Storage Solutions for Your New Home",
        "{n} Quick Organization Hacks for New Residents",
        "{n} Smart Storage Ideas After Moving",
        "{n} Ways to Keep Your New Home Clutter-Free",
        "{n} Organization Systems for a Tidy New Place"
    ], "keywords": ["organization", "storage", "home"], "category": "Home & Living"},

    {"titles": [
        "{n} Security Upgrades for Your New Home",
        "{n} Ways to Secure Your Home After Moving",
        "{n} Safety Improvements Every New Homeowner Needs",
        "{n} Essential Security Features for New Homes",
        "{n} Protection Upgrades for Your New Residence",
        "{n} Home Security Steps After Moving In",
        "{n} Safety Measures for New Homeowners",
        "{n} Must-Have Security Features Post-Move"
    ], "keywords": ["security", "safety", "smart home"], "category": "Home & Living"},

    {"titles": [
        "{n} Ways to Meet Your New Neighbors",
        "{n} Tips for Connecting with Your New Community",
        "{n} Ideas to Introduce Yourself to Neighbors",
        "{n} Strategies for Building Neighborhood Friendships",
        "{n} Methods to Get to Know Your New Neighbors",
        "{n} Approaches to Making Friends in Your New Area",
        "{n} Ways to Break the Ice with Neighbors",
        "{n} Community Connection Tips for New Residents"
    ], "keywords": ["neighbors", "community", "friendship"], "category": "Home & Living"},

    {"titles": [
        "{n} Plants That Thrive in Miami Homes",
        "{n} Indoor Plants Perfect for South Florida",
        "{n} Houseplants That Love Miami's Climate",
        "{n} Low-Maintenance Plants for Florida Living",
        "{n} Tropical Plants Ideal for Miami Apartments",
        "{n} Hardy Houseplants for South Florida Homes",
        "{n} Plants That Flourish in Miami Humidity",
        "{n} Easy-Care Plants for Your Miami Home"
    ], "keywords": ["plants", "indoor plants", "tropical"], "category": "Home & Living"},

    {"titles": [
        "{n} Smart Home Gadgets Worth the Investment",
        "{n} Tech Upgrades for Your New Home",
        "{n} Home Automation Devices That Pay Off",
        "{n} Must-Have Smart Devices for Modern Living",
        "{n} Connected Home Tools Worth Buying",
        "{n} Smart Technology Upgrades for New Homes",
        "{n} Home Tech Investments That Make Sense",
        "{n} Gadgets That Improve Your New Home"
    ], "keywords": ["smart home", "technology", "gadgets"], "category": "Home & Living"},

    {"titles": [
        "{n} Unpacking Hacks to Get Settled Faster",
        "{n} Tips for Efficient Unpacking",
        "{n} Ways to Speed Up the Unpacking Process",
        "{n} Smart Unpacking Strategies for New Movers",
        "{n} Quick Unpacking Tricks After Your Move",
        "{n} Methods to Unpack Like a Pro",
        "{n} Unpacking Shortcuts That Save Time",
        "{n} Fast-Track Unpacking Tips for New Homes"
    ], "keywords": ["unpacking", "boxes", "organizing"], "category": "Home & Living"},

    # Fun/quirky listicles - each with 8 variants
    {"titles": [
        "{n} Weird Things People Have Asked Movers to Move",
        "{n} Unusual Items We've Transported",
        "{n} Strangest Moving Requests We've Received",
        "{n} Bizarre Things Professional Movers Have Seen",
        "{n} Odd Items That Have Been on Our Moving Trucks",
        "{n} Surprising Things People Pay Movers to Haul",
        "{n} Unexpected Items From Our Moving History",
        "{n} Peculiar Possessions We've Helped Relocate"
    ], "keywords": ["funny", "unusual", "stories"], "category": "Fun Facts"},

    {"titles": [
        "{n} Celebrity Homes in Miami You Won't Believe",
        "{n} Famous Miami Mansions and Their Stories",
        "{n} Star-Studded Miami Properties",
        "{n} Incredible Celebrity Estates in South Florida",
        "{n} Stunning Homes of Miami's Rich and Famous",
        "{n} Legendary Celebrity Residences in Miami",
        "{n} Jaw-Dropping Star Homes in South Florida",
        "{n} A-List Celebrity Properties in Miami-Dade"
    ], "keywords": ["celebrity", "mansion", "luxury", "miami"], "category": "Fun Facts"},

    {"titles": [
        "{n} Most Common Moving Superstitions Around the World",
        "{n} Global Traditions for Good Luck When Moving",
        "{n} Cultural Beliefs About Moving to a New Home",
        "{n} Moving Day Superstitions From Different Cultures",
        "{n} International Moving Customs and Traditions",
        "{n} Lucky Rituals for Moving Into a New Home",
        "{n} Worldwide Moving Superstitions to Know",
        "{n} Cultural Moving Traditions From Around the Globe"
    ], "keywords": ["superstition", "traditions", "culture"], "category": "Fun Facts"},

    {"titles": [
        "{n} Unusual Items That Need Special Moving Care",
        "{n} Specialty Items Requiring Professional Movers",
        "{n} Tricky Items That Need Expert Handling",
        "{n} Challenging Items Only Pros Should Move",
        "{n} Delicate Possessions Requiring Moving Expertise",
        "{n} Complex Items That Demand Special Attention",
        "{n} Difficult Belongings That Need Pro Movers",
        "{n} Specialty Possessions for Expert Relocation"
    ], "keywords": ["unusual", "special care", "unique"], "category": "Fun Facts"},

    {"titles": [
        "{n} Movies That Perfectly Capture the Chaos of Moving",
        "{n} Films About the Moving Experience",
        "{n} Movies Every Person Who's Moved Can Relate To",
        "{n} Classic Films Featuring Memorable Moving Scenes",
        "{n} Hollywood Takes on the Stress of Relocation",
        "{n} Movie Portrayals of Moving Day Madness",
        "{n} Films That Nail the Moving Experience",
        "{n} Cinematic Moving Stories Worth Watching"
    ], "keywords": ["movies", "film", "entertainment"], "category": "Fun Facts"},

    {"titles": [
        "{n} Historic Miami Buildings and Their Moving Stories",
        "{n} Landmark Miami Structures with Fascinating Histories",
        "{n} Iconic Miami Buildings Worth Knowing About",
        "{n} Architectural Gems of Miami-Dade County",
        "{n} Historic Miami Properties with Amazing Pasts",
        "{n} Legendary Buildings That Define Miami",
        "{n} Miami Landmarks Every Resident Should Know",
        "{n} Storied Structures in the Miami Area"
    ], "keywords": ["historic", "miami", "architecture"], "category": "Fun Facts"},
]

# Track used listicle titles globally for uniqueness
_used_listicle_titles = set()


def get_next_title_variant(template):
    """Get a random title variant for a template, ensuring uniqueness."""
    titles = template.get("titles", [template.get("title", "Untitled")])
    if isinstance(titles, str):
        titles = [titles]

    # Randomly select from available titles
    return random.choice(titles)


def generate_slug(title):
    """Generate URL-friendly slug from title."""
    slug = title.lower()
    for char in ["'", '"', ",", ".", "!", "?", ":", ";", "(", ")", "&", "+", "'"]:
        slug = slug.replace(char, "")
    slug = slug.replace(" ", "-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    slug = slug.strip("-")
    return slug[:60]


def generate_image_path(date, slug):
    """Generate image folder path based on date and slug."""
    year = date.strftime("%Y")
    month = date.strftime("%m")
    return f"/images/blog/{year}/{month}/{slug}"


def get_featured_image_path(image_folder):
    """Get the path to the featured image from the image folder."""
    return f"{image_folder}/featured.jpg"


def get_read_time(content):
    """Estimate read time based on content length."""
    words = len(content.split())
    minutes = max(3, min(10, words // 200))
    return f"{minutes} min read"


def get_season(month):
    """Get season name from month."""
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Fall"


# Track used service post titles globally for uniqueness
_used_service_titles = set()

def generate_service_post(post_id, date, service, month_data):
    """Generate a service + topical blog post."""
    global _used_service_titles
    season = month_data.get("season", get_season(date.month))
    themes = month_data["themes"]
    title_themes = month_data["title_themes"]

    # Title patterns - randomly select from these
    title_patterns = [
        "{title_theme} {service} Tips for Miami Residents",
        "How to Handle {service} During {theme}",
        "{service} Guide for {month}",
        "Essential {service} Tips for {month}",
        "{season} Moving: {service} Best Practices",
        "Your {month} {service} Checklist",
        "{service} Tips for {theme}",
        "Mastering {service} This {season}",
        "The Complete Guide to {service} in {month}",
        "{title_theme} Guide to {service} in Miami",
        "{service} Planning for {theme} Season",
        "Miami {service}: {month} Edition",
        "{service} Strategies for {month} Moves",
        "Smart {service} Tips for {season}",
        "{month} {service} Advice for Families",
        "Your {season} {service} Planning Guide",
        "{service} Essentials for {theme}",
        "Expert {service} Tips This {month}",
        "{title_theme} {service} Strategies in Miami",
        "Practical {service} Advice for {month}",
        "{season} {service} Insights for Miami",
        "Top {service} Recommendations for {theme}",
        "{month} Moving: {service} Fundamentals",
        "Professional {service} Tips for {season}",
    ]

    # Try random combinations until we get a unique title
    max_attempts = 50
    for attempt in range(max_attempts):
        pattern = random.choice(title_patterns)
        theme = random.choice(themes)
        title_theme = random.choice(title_themes)

        title = pattern.format(
            title_theme=title_theme,
            service=service['name'],
            theme=theme,
            month=month_data['name'],
            season=season
        )

        if title not in _used_service_titles:
            _used_service_titles.add(title)
            break
    # If all attempts fail, add month to make unique
    else:
        title = f"{title} - {month_data['name']}"
        _used_service_titles.add(title)

    content = generate_service_content(service, theme, month_data, season)
    slug = generate_slug(title)
    image_folder = generate_image_path(date, slug)

    # Combine keywords for relevant image
    image_keywords = service.get("keywords", ["moving"]) + month_data.get("keywords", [])

    return {
        "id": post_id,
        "title": title,
        "slug": slug,
        "excerpt": content.split("\n\n")[0][:200] + "...",
        "date": date.strftime("%Y-%m-%d"),
        "readTime": get_read_time(content),
        "category": "Moving Tips",
        "image_folder": image_folder,
        "image": get_featured_image_path(image_folder),
        "image_keywords": image_keywords[:4],
        "images": [],
        "service_link": f"/{service['slug']}",
        "location_link": None,
        "content": content
    }


# Track used location post titles globally for uniqueness
_used_location_titles = set()

def generate_location_post(post_id, date, city, month_data):
    """Generate a location + moving topic blog post."""
    global _used_location_titles
    season = month_data.get("season", get_season(date.month))
    theme = random.choice(month_data["themes"])

    # Title patterns - randomly select from these
    title_patterns = [
        "Moving to {city}: What You Need to Know",
        "Best Neighborhoods in {city} for Families",
        "{city} Relocation Guide: A Complete Overview",
        "Why {city} is Perfect for Your Next Move",
        "Discover {city}: Your Complete Movers Guide",
        "{city} Living: Essential Relocation Tips",
        "Your Ultimate Guide to Moving to {city}",
        "{city} Neighborhood Guide for New Residents",
        "Exploring {city}: Tips for Newcomers",
        "Settling Into {city}: What New Residents Need to Know",
        "{city} Moving Tips: Local Insights for Relocators",
        "Making {city} Your New Home: A Practical Guide",
        "Everything You Need to Know About Living in {city}",
        "{city} Area Guide for New Movers",
        "Relocating to {city}: The Essential Guide",
        "Life in {city}: What to Expect After Moving",
        "{city} for New Residents: A Complete Resource",
        "Your {city} Moving Handbook",
        "Starting Fresh in {city}: A Newcomers Guide",
        "{city} Insights: Tips for Smooth Relocation",
        "Welcome to {city}: A Moving Guide",
        "Finding Your Place in {city}: Relocation Advice",
        "{city} 101: What Every New Resident Should Know",
        "The Newcomers Guide to {city} Living",
    ]

    # Try random patterns until we get a unique title
    max_attempts = 50
    for attempt in range(max_attempts):
        title_pattern = random.choice(title_patterns)
        title = title_pattern.format(city=city['name'])

        if title not in _used_location_titles:
            _used_location_titles.add(title)
            break
    # If all attempts fail, add year to make unique
    else:
        title = f"{title} ({date.year})"
        _used_location_titles.add(title)

    content = generate_location_content(city, theme, month_data, season)
    slug = generate_slug(title)
    image_folder = generate_image_path(date, slug)

    # Combine keywords for relevant image
    image_keywords = city.get("keywords", ["miami", "florida"])

    return {
        "id": post_id,
        "title": title,
        "slug": slug,
        "excerpt": content.split("\n\n")[0][:200] + "...",
        "date": date.strftime("%Y-%m-%d"),
        "readTime": get_read_time(content),
        "category": "Location Guide",
        "image_folder": image_folder,
        "image": get_featured_image_path(image_folder),
        "image_keywords": image_keywords[:4],
        "images": [],
        "service_link": None,
        "location_link": f"/{city['slug']}-movers",
        "content": content
    }


def generate_listicle_post(post_id, date, template, city, month_data):
    """Generate an eye-grabbing listicle post."""
    global _used_listicle_titles
    season = month_data.get("season", get_season(date.month))

    # Try random combinations until we get a unique title
    max_attempts = 50
    for attempt in range(max_attempts):
        # Generate random number of items between 5-10
        num_items = random.randint(5, 10)

        # Get a random title variant for this template
        title_template = get_next_title_variant(template)

        # Fill in city name and number if needed
        if template.get("needs_city"):
            title = title_template.format(city=city["name"], n=num_items)
            keywords = template["keywords"] + city.get("keywords", [])[:2]
            location_link = f"/{city['slug']}-movers"
        else:
            title = title_template.format(n=num_items)
            keywords = template["keywords"]
            location_link = None

        if title not in _used_listicle_titles:
            _used_listicle_titles.add(title)
            break
    # If all attempts fail, add date to make unique
    else:
        title = f"{title} for {month_data['name']}"
        _used_listicle_titles.add(title)

    content = generate_listicle_content(template, city if template.get("needs_city") else None, month_data, season, title, num_items)
    slug = generate_slug(title)
    image_folder = generate_image_path(date, slug)

    return {
        "id": post_id,
        "title": title,
        "slug": slug,
        "excerpt": content.split("\n\n")[0][:200] + "...",
        "date": date.strftime("%Y-%m-%d"),
        "readTime": get_read_time(content),
        "category": template["category"],
        "image_folder": image_folder,
        "image": get_featured_image_path(image_folder),
        "image_keywords": keywords[:4],
        "images": [],
        "service_link": None,
        "location_link": location_link,
        "content": content
    }


def generate_service_content(service, theme, month_data, season):
    """Generate full article content for service posts."""
    service_name = service["name"]
    service_slug = service["slug"]
    month_name = month_data["name"]

    # Service-specific tips and benefits
    service_details = {
        "packing-services": {
            "benefit": "protecting your belongings with professional packing techniques",
            "tip": "Start packing non-essentials 4-6 weeks before moving day",
            "related": ["full-service-moving", "local-moving", "antique-moving"]
        },
        "local-moving": {
            "benefit": "same-day service and knowledge of Miami traffic patterns",
            "tip": "Schedule morning moves to avoid afternoon traffic and heat",
            "related": ["residential-moving", "apartment-moving", "packing-services"]
        },
        "long-distance-moving": {
            "benefit": "dedicated trucks and GPS tracking for peace of mind",
            "tip": "Get a binding estimate to lock in your moving costs",
            "related": ["packing-services", "full-service-moving", "residential-moving"]
        },
        "residential-moving": {
            "benefit": "furniture disassembly, floor protection, and careful handling",
            "tip": "Walk through your home with movers to identify special items",
            "related": ["packing-services", "furniture-moving", "local-moving"]
        },
        "commercial-moving": {
            "benefit": "after-hours moves and IT equipment expertise",
            "tip": "Create a moving committee to coordinate departments",
            "related": ["office-moving", "full-service-moving", "packing-services"]
        },
        "furniture-moving": {
            "benefit": "specialized equipment for oversized and heavy pieces",
            "tip": "Measure doorways and hallways at both locations before moving day",
            "related": ["residential-moving", "antique-moving", "local-moving"]
        },
        "celebrity-moving": {
            "benefit": "signed NDAs, unmarked trucks, and white-glove service",
            "tip": "Request the same trusted team for both locations",
            "related": ["full-service-moving", "antique-moving", "packing-services"]
        },
        "apartment-moving": {
            "benefit": "elevator expertise and building rule compliance",
            "tip": "Reserve the freight elevator well in advance and confirm with building management",
            "related": ["local-moving", "same-building-moving", "packing-services"]
        },
        "full-service-moving": {
            "benefit": "packing, loading, transport, and unpacking all included",
            "tip": "Create a priority list for which rooms to unpack first",
            "related": ["packing-services", "residential-moving", "local-moving"]
        },
        "labor-only-moving": {
            "benefit": "flexible hourly rates when you have your own truck",
            "tip": "Have everything packed and the truck ready when movers arrive",
            "related": ["packing-services", "local-moving", "hourly-moving"]
        },
        "military-moving": {
            "benefit": "understanding of military timelines and storage options",
            "tip": "Keep all documentation organized for reimbursement purposes",
            "related": ["long-distance-moving", "full-service-moving", "packing-services"]
        },
        "same-day-moving": {
            "benefit": "crews available within hours for emergency moves",
            "tip": "Call early in the day for best availability and faster response",
            "related": ["last-minute-moving", "local-moving", "labor-only-moving"]
        },
        "senior-moving": {
            "benefit": "patient service and downsizing assistance",
            "tip": "Set up the bedroom first so they have a comfortable, familiar space immediately",
            "related": ["full-service-moving", "packing-services", "local-moving"]
        },
        "student-moving": {
            "benefit": "budget-friendly pricing and flexible scheduling",
            "tip": "Book early during peak move-in weekends at universities",
            "related": ["apartment-moving", "local-moving", "hourly-moving"]
        },
        "safe-moving": {
            "benefit": "specialized dollies and trained heavy-item specialists",
            "tip": "Know the exact weight of your safe before moving day for proper equipment",
            "related": ["residential-moving", "furniture-moving", "local-moving"]
        },
        "antique-moving": {
            "benefit": "custom crating and climate-controlled options",
            "tip": "Get appraisals and photograph items before the move for insurance purposes",
            "related": ["packing-services", "full-service-moving", "furniture-moving"]
        },
        "office-moving": {
            "benefit": "minimal downtime and IT equipment handling",
            "tip": "Back up all digital data before the move and label cable connections",
            "related": ["commercial-moving", "full-service-moving", "packing-services"]
        },
        "same-building-moving": {
            "benefit": "quick turnaround with no truck needed",
            "tip": "Coordinate with building management for elevator access and loading areas",
            "related": ["apartment-moving", "local-moving", "hourly-moving"]
        },
        "last-minute-moving": {
            "benefit": "quick response and experienced crews for fast work",
            "tip": "Prioritize must-move items and accept help with packing to save time",
            "related": ["same-day-moving", "packing-services", "local-moving"]
        },
        "hourly-moving": {
            "benefit": "pay only for time used with transparent billing",
            "tip": "Have everything packed and ready before the crew arrives to maximize efficiency",
            "related": ["labor-only-moving", "local-moving", "same-building-moving"]
        },
        "special-needs-moving": {
            "benefit": "patient crews and accommodation for medical equipment",
            "tip": "Communicate specific needs and any medical equipment requirements in advance",
            "related": ["senior-moving", "full-service-moving", "packing-services"]
        },
        "appliance-moving": {
            "benefit": "safe disconnection, transport, and reconnection of all major appliances",
            "tip": "Defrost your refrigerator 24 hours before moving day to prevent water damage",
            "related": ["local-moving", "residential-moving", "full-service-moving"]
        },
        "piano-moving": {
            "benefit": "specialized piano boards, padding, and climate-aware transport",
            "tip": "Wait 2-3 weeks after the move before tuning to let the piano acclimate",
            "related": ["specialty-item-moving", "white-glove-moving", "full-service-moving"]
        },
        "pool-table-moving": {
            "benefit": "expert disassembly, safe slate transport, and precision reassembly with leveling",
            "tip": "Protect existing felt during the move—replacement isn't always needed",
            "related": ["specialty-item-moving", "furniture-moving", "residential-moving"]
        },
        "hot-tub-moving": {
            "benefit": "spa-specific equipment and creative access solutions for tight spaces",
            "tip": "Drain and dry your hot tub 24-48 hours before the move",
            "related": ["specialty-item-moving", "appliance-moving", "residential-moving"]
        },
        "art-moving": {
            "benefit": "custom crating, acid-free materials, and climate-monitored transport",
            "tip": "Get current appraisals and photograph every piece before the move",
            "related": ["white-glove-moving", "antique-moving", "packing-services"]
        },
        "white-glove-moving": {
            "benefit": "premium padding, dedicated move manager, and full-service packing to unpacking",
            "tip": "Create a priority list for which rooms to set up first at your new home",
            "related": ["full-service-moving", "art-moving", "packing-services"]
        },
        "specialty-item-moving": {
            "benefit": "custom assessment and handling plans for unusual, heavy, or fragile items",
            "tip": "Tell your movers about any unusual items during the estimate so they bring the right equipment",
            "related": ["piano-moving", "safe-moving", "white-glove-moving"]
        },
        "storage-solutions": {
            "benefit": "climate-controlled facilities with flexible terms and seamless move-to-storage service",
            "tip": "Choose climate-controlled storage in Miami to protect against heat and humidity damage",
            "related": ["full-service-moving", "packing-services", "local-moving"]
        },
        "junk-removal": {
            "benefit": "responsible disposal with donation, recycling, and same-day haul-away options",
            "tip": "Schedule junk removal before your move to avoid paying to transport items you don't want",
            "related": ["full-service-moving", "storage-solutions", "packing-services"]
        },
    }

    details = service_details.get(service_slug, {
        "benefit": "professional handling and care for all your belongings",
        "tip": "Plan ahead and communicate your specific needs clearly",
        "related": ["packing-services", "local-moving", "full-service-moving"]
    })

    intro = random.choice([
        f"{month_name} is here, and if you're planning a move, you're likely thinking about {service_name.lower()}. This time of year brings unique challenges and opportunities for those relocating in Miami and South Florida.",
        f"As we enter {month_name}, many Miami residents find themselves preparing for a move. Whether you're taking advantage of the {season.lower()} season or responding to life changes, {service_name.lower()} becomes a crucial consideration.",
        f"Moving during {month_name}? You're not alone. The {season.lower()} months bring a surge of relocations across Miami-Dade County, making professional {service_name.lower()} more important than ever.",
    ])

    # Build related services links
    related_links = []
    for related_slug in details["related"]:
        for svc in SERVICES:
            if svc["slug"] == related_slug:
                related_links.append(f"- [**{svc['name']}**](/{related_slug}) - Professional {svc['name'].lower()} for Miami residents")
                break

    related_section = "\n".join(related_links)

    content = f"""{intro}

## Why {service_name} Matters During {theme}

The {theme.lower()} season presents specific considerations for anyone planning a move. From weather conditions to scheduling availability, understanding these factors can make the difference between a smooth transition and a stressful experience.

Miami's {season.lower()} weather requires careful planning. [**{service_name}**](/{service_slug}) professionals understand these local conditions and can help you navigate potential challenges. Whether you're dealing with afternoon thunderstorms or the intense Florida sunshine, having experienced movers makes all the difference.

## Key Tips for {service_name} in {month_name}

### Plan Ahead for Peak Times

{month_name} can be a busy time for moving companies. With {theme.lower()} activities and seasonal transitions, scheduling your {service_name.lower()} early ensures you get your preferred date and time.

### {details["tip"]}

This single step can save hours of stress and potential problems on moving day. Our experienced crews have seen what happens when this step is skipped.

### Consider the Weather

South Florida's {season.lower()} weather is predictable in some ways and surprising in others. Professional movers know how to protect your belongings from humidity, rain, and heat exposure during transport.

### Prepare Your Belongings

Take time to inventory your items before the move. This is especially important for {service_name.lower()}, as proper documentation helps ensure everything arrives safely at your new location.

## Benefits of Professional {service_name}

Working with experienced movers provides several advantages, particularly {details["benefit"]}:

- **Expertise**: Professional movers handle items of all types regularly
- **Equipment**: Proper tools and materials for safe transport
- **Insurance**: Protection for your valuable belongings
- **Efficiency**: Trained teams work faster without sacrificing quality

## What to Expect from Rapid Panda Movers

When you hire us for [**{service_name.lower()}**](/{service_slug}), you can expect:

1. **Free Consultation**: We assess your needs and provide a transparent quote
2. **Professional Crew**: Uniformed, trained moving professionals
3. **Quality Materials**: High-quality packing materials and equipment
4. **Careful Handling**: Every item treated with respect
5. **On-Time Service**: We arrive when promised and complete on schedule

## {theme} Preparation Checklist

Before your move, make sure to:

- Sort through belongings and declutter
- Gather important documents in one accessible place
- Notify relevant parties of your address change
- Arrange utilities at your new location
- [**Get your free quote**](/quote) and schedule your move

## Related Services

Depending on your needs, you might also consider these services:

{related_section}

## Ready to Get Started?

**[Request your free quote](/quote)** today. Our team of experienced professionals is ready to help make your {month_name} move as smooth as possible. We understand the unique challenges of {season.lower()} moving in South Florida and have the expertise to handle them.

Read our **[customer reviews](/reviews)** to see why Miami families trust Rapid Panda Movers for all their moving needs."""

    return content


def generate_location_content(city, theme, month_data, season):
    """Generate full article content for location posts."""
    city_name = city["name"]
    city_slug = city["slug"]
    month_name = month_data["name"]

    # City-specific details
    city_details = {
        "miami": {"vibe": "vibrant and diverse", "known_for": "beaches, nightlife, and cultural attractions", "neighborhood": "Brickell"},
        "miami-beach": {"vibe": "glamorous and exciting", "known_for": "Art Deco architecture and South Beach", "neighborhood": "South Beach"},
        "coral-gables": {"vibe": "elegant and historic", "known_for": "Mediterranean architecture and tree-lined streets", "neighborhood": "Miracle Mile"},
        "hialeah": {"vibe": "family-oriented and cultural", "known_for": "Cuban heritage and strong community", "neighborhood": "Palm Springs"},
        "homestead": {"vibe": "peaceful and spacious", "known_for": "proximity to Everglades and agricultural heritage", "neighborhood": "Redland"},
        "aventura": {"vibe": "upscale and convenient", "known_for": "luxury shopping and waterfront living", "neighborhood": "Turnberry"},
        "doral": {"vibe": "family-friendly and growing", "known_for": "excellent schools and golf courses", "neighborhood": "Downtown Doral"},
        "kendall": {"vibe": "suburban and diverse", "known_for": "affordable housing and family amenities", "neighborhood": "The Crossings"},
        "key-biscayne": {"vibe": "exclusive island paradise", "known_for": "pristine beaches and outdoor lifestyle", "neighborhood": "The Village"},
        "coconut-grove": {"vibe": "bohemian and artsy", "known_for": "waterfront parks and eclectic dining", "neighborhood": "Center Grove"},
        "sunny-isles-beach": {"vibe": "luxurious oceanfront", "known_for": "high-rise condos and beach access", "neighborhood": "Collins Avenue"},
        "palmetto-bay": {"vibe": "quiet and family-oriented", "known_for": "excellent schools and parks", "neighborhood": "Coral Reef"},
        "pinecrest": {"vibe": "upscale and residential", "known_for": "large estate homes and gardens", "neighborhood": "Pinecrest Gardens area"},
        "north-miami": {"vibe": "diverse and growing", "known_for": "cultural attractions and affordability", "neighborhood": "MOCA District"},
        "north-miami-beach": {"vibe": "diverse and affordable", "known_for": "international community and beach access", "neighborhood": "Eastern Shores"},
        "miami-gardens": {"vibe": "community-focused", "known_for": "Hard Rock Stadium and sports culture", "neighborhood": "Carol City"},
        "cutler-bay": {"vibe": "family-friendly suburban", "known_for": "waterfront access and new development", "neighborhood": "Lakes by the Bay"},
        "miami-lakes": {"vibe": "planned community feel", "known_for": "lakes, trails, and Main Street shopping", "neighborhood": "Main Street"},
        "miami-springs": {"vibe": "historic and charming", "known_for": "tree-lined streets and small-town feel", "neighborhood": "Downtown"},
        "south-miami": {"vibe": "walkable downtown feel", "known_for": "local shops and restaurants", "neighborhood": "Sunset Drive"},
        "bal-harbour": {"vibe": "ultra-luxurious", "known_for": "high-end shopping and oceanfront homes", "neighborhood": "Oceanfront"},
        "surfside": {"vibe": "quiet beach town", "known_for": "family beaches and small-town atmosphere", "neighborhood": "Harding Avenue"},
        "opa-locka": {"vibe": "historic and cultural", "known_for": "Moorish architecture and art scene", "neighborhood": "Downtown"},
        "sweetwater": {"vibe": "family-oriented and cultural", "known_for": "FIU proximity and Hispanic heritage", "neighborhood": "Central"},
        "west-miami": {"vibe": "quiet residential", "known_for": "small-town feel within metro area", "neighborhood": "Central"},
        "bay-harbor-islands": {"vibe": "upscale island living", "known_for": "waterfront properties and boutique shopping", "neighborhood": "Bay Harbor"},
        "biscayne-park": {"vibe": "historic village charm", "known_for": "tree canopy and community spirit", "neighborhood": "Village Center"},
        "el-portal": {"vibe": "eclectic and artistic", "known_for": "historic homes and creative community", "neighborhood": "Village Center"},
        "florida-city": {"vibe": "gateway to adventure", "known_for": "Everglades access and agricultural roots", "neighborhood": "Downtown"},
        "golden-beach": {"vibe": "exclusive and private", "known_for": "oceanfront estates and privacy", "neighborhood": "Oceanfront"},
        "indian-creek": {"vibe": "ultra-exclusive enclave", "known_for": "billionaire residents and security", "neighborhood": "Island"},
        "medley": {"vibe": "industrial and commercial", "known_for": "business parks and logistics", "neighborhood": "Industrial District"},
        "miami-shores": {"vibe": "historic and bayfront", "known_for": "beautiful homes and community events", "neighborhood": "Downtown"},
        "virginia-gardens": {"vibe": "small and residential", "known_for": "quiet streets near airport", "neighborhood": "Central"},
        "westchester": {"vibe": "suburban and established", "known_for": "family neighborhoods and parks", "neighborhood": "Central"},
    }

    details = city_details.get(city_slug, {"vibe": "welcoming", "known_for": "community spirit", "neighborhood": "downtown area"})

    intro = random.choice([
        f"Thinking about moving to {city_name} this {month_name}? You're considering one of Miami-Dade County's most desirable communities. This {season.lower()} guide will help you understand what makes {city_name} special and how to plan your relocation.",
        f"{city_name} continues to attract new residents from across the country during {month_name}, and it's easy to see why. As a premier Miami-Dade location, {city_name} offers a unique blend of community, convenience, and lifestyle options.",
        f"Welcome to your {month_name} guide for moving to {city_name}! Whether you're relocating from within South Florida or making a bigger move this {season.lower()}, understanding your new community is essential for a successful transition.",
    ])

    weather_notes = {
        "Winter": "mild temperatures and lower humidity, ideal for moving",
        "Spring": "warming temperatures with occasional afternoon showers",
        "Summer": "hot and humid conditions with daily afternoon thunderstorms",
        "Fall": "gradually cooling temperatures and decreasing humidity"
    }

    content = f"""{intro}

## Why Choose {city_name}?

{city_name} stands out as one of Miami-Dade County's most appealing locations. The community offers a {details['vibe']} atmosphere and is particularly known for {details['known_for']}.

The area attracts families, professionals, and retirees alike, thanks to its quality of life, convenient access to major employment centers, and excellent amenities.

### Location and Accessibility

One of {city_name}'s biggest advantages is its strategic location within Miami-Dade County. Residents enjoy easy access to major highways, public transportation, and nearby communities. Whether you're commuting to Downtown Miami, heading to the beach, or traveling for work, {city_name} provides convenient connections.

### Community and Lifestyle

{city_name} residents enjoy a strong sense of community. Local parks, recreation facilities, and community events bring neighbors together throughout the year. The {season.lower()} season is particularly vibrant, with {theme.lower()} activities bringing residents together.

## Neighborhoods to Consider

When planning your move to {city_name}, the {details['neighborhood']} area is particularly popular with newcomers. Each neighborhood has its own character—some offer walkable dining and shopping, while others provide quiet, tree-lined streets.

### Choosing Your Perfect Spot

Consider these factors:

- **Proximity to work and schools**: Factor in your daily commute
- **Local amenities**: Parks, shopping, dining, and entertainment options
- **Property types**: Single-family homes, condos, townhouses, or apartments
- **Community vibe**: Family-oriented, young professional, or mixed demographics

## Moving to {city_name} in {month_name}

{month_name} is an excellent time to consider your move. The {season.lower()} weather in South Florida provides {weather_notes.get(season, 'comfortable conditions')} for the moving process.

### Timing Your Move

When planning your relocation, consider:

- **Best moving days**: Weekdays often offer better availability and rates
- **Weather considerations**: {season} in Miami means {weather_notes.get(season, 'variable conditions')}
- **Local events**: Check for any street closures or community events that might affect your move

## Essential Services to Locate

As a new {city_name} resident, you'll want to find:

- **Healthcare facilities**: Hospitals, clinics, and specialty care
- **Schools**: Public, private, and charter options
- **Shopping**: Grocery stores, retail centers, and local boutiques
- **Recreation**: Parks, gyms, and entertainment venues

## Our {city_name} Moving Services

Our team has extensive experience helping families relocate to [**{city_name}**](/{city_slug}-movers). We understand the local area, including:

- Building requirements and HOA rules
- Parking considerations and permits
- Best routes for efficient moving
- Local timing and traffic patterns

### What We Offer

- **[Local Moving](/local-moving)**: Perfect for relocations within Miami-Dade
- **[Apartment Moving](/apartment-moving)**: High-rise and condo expertise
- **[Residential Moving](/residential-moving)**: House-to-house moves
- **[Packing Services](/packing-services)**: Full-service packing and materials
- **[Full-Service Moving](/full-service-moving)**: Complete door-to-door solutions

## Ready to Make {city_name} Home?

**[Get your free quote](/quote)** for moving to {city_name}. Our team is ready to make your transition to this wonderful community as smooth as possible.

Questions? **[Contact us](/contact-us)** or read what other families say about our service in our **[reviews](/reviews)**."""

    return content


def generate_listicle_content(template, city, month_data, season, title, num_items):
    """Generate listicle content with numbered items."""
    # Title is now passed in (already formatted with city if needed)
    # num_items is now passed in (random 5-10)
    category = template["category"]
    title_lower = title.lower()
    month_name = month_data["name"]

    # Add seasonal/monthly context to make content unique
    seasonal_context = f" As you plan your {season.lower()} move, keep these in mind." if season else ""

    # Generate intro based on content type - include month/season for uniqueness
    if city and "restaurant" in title_lower:
        intro = f"Just moved to {city['name']} or planning your {season.lower()} relocation? Food is one of the best ways to experience your new community. We've compiled this {month_name} guide to help you discover the culinary gems that make {city['name']} such a delicious place to call home."
    elif city and "hidden gems" in title_lower:
        intro = f"Every neighborhood has secrets that only locals know. If you've recently moved to {city['name']} or are planning a {month_name} move, this insider's guide will help you discover the spots that make this community special—the places that don't show up in tourist guides."
    elif city and "parks" in title_lower:
        intro = f"Green spaces are essential for quality of life, and {city['name']} delivers beautifully in {month_name}. Whether you're looking for a quiet spot to read, a playground for the kids, or trails for your morning jog, here are the outdoor spaces that make {city['name']} a great place to live."
    elif city and "family" in title_lower:
        intro = f"Moving with kids this {season.lower()}? {city['name']} is a fantastic choice for families. From {month_name} adventures to everyday activities, here's your guide to keeping the whole family entertained and connected to your new community."
    elif city and "coffee" in title_lower:
        intro = f"Finding your perfect coffee spot is one of the first steps to feeling at home in a new neighborhood. {city['name']} has a diverse café scene perfect for {season.lower()} days—from traditional Cuban ventanitas to modern specialty roasters. Here's where to get your caffeine fix."
    elif city and "weekend" in title_lower:
        intro = f"Weekends in {city['name']} offer endless possibilities, especially in {month_name}. Whether you prefer relaxing brunches, outdoor adventures, or cultural experiences, here's how to make the most of your time off in your new neighborhood."
    elif city and "beach" in title_lower:
        intro = f"Living near {city['name']} means easy access to some of Florida's best beaches—perfect for {season.lower()} outings. Whether you're looking for family-friendly shores, water sports, or quiet relaxation, here are the coastal destinations worth your time."
    elif city and ("gym" in title_lower or "fitness" in title_lower):
        intro = f"Staying active after a {month_name} move helps with both physical and mental health. {city['name']} offers fitness options for every preference and budget. Here's where to work out in your new neighborhood."
    elif "hacks" in title_lower and "moving" in title_lower:
        intro = f"Professional movers have tricks that make relocation look easy. After thousands of {season.lower()} moves, we've learned what works and what doesn't. Here are insider techniques that will transform your {month_name} moving experience."
    elif "professional movers" in title_lower or "movers wish" in title_lower:
        intro = f"After years of helping Miami families relocate, we've learned what makes {season.lower()} moves go smoothly—and what causes problems. Here's what every professional mover wishes their {month_name} customers knew before moving day."
    elif "packing mistakes" in title_lower:
        intro = f"Packing seems straightforward until something breaks. These common {season.lower()} errors are responsible for the majority of moving damage we see. Avoid them and your {month_name} belongings will arrive safely."
    elif "declutter" in title_lower:
        intro = f"The less you move, the less it costs—and the less you have to unpack. Decluttering before your {month_name} move isn't just about saving money; it's about starting fresh without the baggage (literally) of stuff you don't need."
    elif "essentials" in title_lower and "moving day" in title_lower:
        intro = f"Your {month_name} moving day is coming up, and it's going to be hectic. The last thing you need during a {season.lower()} move in Miami is to realize something critical is buried in a box on the truck. These items should stay with you—accessible and ready when you need them."
    elif "wrong" in title_lower or "red flags" in title_lower or "signs" in title_lower:
        intro = f"Choosing the wrong moving company can turn your {month_name} relocation into a nightmare. Scammers and unprofessional operators give the industry a bad name. Here's how to spot trouble before it's too late."
    elif "kids" in title_lower or "children" in title_lower:
        intro = f"Moving is tough on kids, especially during the {season.lower()} season. Their whole world is changing, and they don't have the context adults do to understand why. With the right approach, you can help them transition smoothly—and maybe even get excited about the new adventure."
    elif "never put" in title_lower or "prohibited" in title_lower or "should never" in title_lower:
        intro = f"Some items simply can't travel on a moving truck—for safety, legal, or practical reasons. Before your {month_name} move, make sure you know what needs to be transported separately or disposed of properly."
    elif "budget" in title_lower or "save" in title_lower:
        intro = f"Moving doesn't have to break the bank, even in {month_name}. With smart planning and the right strategies, you can significantly reduce your {season.lower()} moving costs without sacrificing quality or safety."
    elif "last-minute" in title_lower or "procrastinator" in title_lower:
        intro = f"Life happens, and sometimes you end up with less time to prepare than you'd like. If your {month_name} move is approaching fast and you're behind, don't panic. These strategies will help you pull it together quickly."
    elif "house feel like home" in title_lower or "settling" in title_lower:
        intro = f"A house becomes a home through time, intention, and small touches that make a space feel yours. After your {season.lower()} boxes are unpacked, here's how to transform your new place into somewhere you truly belong."
    elif "first things" in title_lower or "first week" in title_lower:
        intro = f"The first week in a new home sets the tone for everything that follows. These {month_name} priority tasks will help you get settled safely and start your new chapter on the right foot."
    elif "organization" in title_lower or "organize" in title_lower:
        intro = f"A new home is a fresh start for organization, especially after a {season.lower()} move. Instead of recreating the chaos from your old place, use your {month_name} move as an opportunity to set up systems that will keep your space functional long-term."
    elif "security" in title_lower or "safety" in title_lower:
        intro = f"Your family's safety should be a top priority when moving into a new home this {season.lower()}. You don't know who had access before you, and it's better to be proactive about security than to react after something happens."
    elif "neighbors" in title_lower or "community" in title_lower:
        intro = f"Strong community connections make a house feel like home. But building relationships in a new neighborhood takes intentional effort, especially after a {month_name} move. Here's how to become part of your new community."
    elif "plants" in title_lower:
        intro = f"South Florida's {season.lower()} climate is perfect for houseplants—if you choose the right ones. These varieties thrive in Miami's {month_name} humidity and light conditions, bringing life to your new home without demanding expert care."
    elif "smart home" in title_lower or "gadgets" in title_lower:
        intro = f"Moving into a new home is the perfect opportunity to implement smart technology. Starting fresh this {season.lower()} means you can set things up right from the beginning, without working around existing systems."
    elif "unpacking" in title_lower:
        intro = f"The {month_name} move is done, but the work isn't over. How you approach unpacking determines whether you're living out of boxes for weeks or settling in efficiently. Here's how to get organized fast."
    elif "weird" in title_lower:
        intro = f"After years of {month_name} moves in Miami, we've seen it all. Some items present unique challenges that require specialized knowledge and equipment. Here are the strangest things professional movers have been asked to transport."
    elif "unusual" in title_lower or "strange" in title_lower:
        intro = f"Moving specialty items requires expertise most people don't have. This {month_name}, if you're planning a {season.lower()} relocation with unique belongings, here's what you need to know about items that need special care."
    elif "celebrity" in title_lower:
        intro = f"Miami attracts the rich and famous, and their homes are as impressive as you'd expect. This {month_name}, take a look at some of the most notable celebrity properties in the area—from Star Island mansions to South Beach penthouses."
    elif "superstitions" in title_lower or "traditions" in title_lower:
        intro = f"Moving traditions and superstitions have guided {month_name} relocations across cultures for centuries. Whether you're superstitious or just curious about your {season.lower()} move, these beliefs offer a fascinating glimpse into how different cultures approach new beginnings."
    elif "movies" in title_lower or "films" in title_lower:
        intro = f"Moving is such a universal experience that Hollywood has explored it countless times. Perfect for a {month_name} movie night after your {season.lower()} move, these films capture the stress, humor, and emotion of relocation in ways that feel all too familiar."
    elif "historic" in title_lower or "buildings" in title_lower:
        intro = f"Miami's {month_name} architecture tour starts here. From Art Deco gems to Mediterranean Revival mansions, these are the most fascinating properties that have shaped our city through decades of transformation."
    elif city:
        intro = f"Just moved to {city['name']} or planning your {month_name} relocation? Here's your essential guide to making the most of your new neighborhood. We've compiled this list to help you settle in and discover what makes {city['name']} such a special place to call home this {season.lower()}."
    else:
        intro = f"Whether you're a long-time Miami resident or just making your {month_name} move to South Florida, there's always something new to discover. Here's our curated list to help you make the most of life in the Sunshine State this {season.lower()}."

    # Generate list items based on template type
    items_content = generate_list_items(template, city, num_items, title)

    # Generate outro based on content type
    if "restaurant" in title_lower or "coffee" in title_lower or "weekend" in title_lower or "hidden gems" in title_lower:
        outro = """## Ready for Your Move?

Discovering your new neighborhood is one of the joys of relocation. Let Rapid Panda Movers handle the logistics so you can focus on exploring.

Our professional team handles everything from careful packing to safe transportation. **[Get your free quote](/quote)** today and discover why Miami families trust Rapid Panda Movers."""
    elif "hacks" in title_lower or "tips" in title_lower or "mistakes" in title_lower:
        outro = """## Let the Professionals Handle It

The best moving hack? Hire experienced professionals who do this every day. Rapid Panda Movers brings expertise, equipment, and efficiency to every job.

**[Get your free quote](/quote)** and see how stress-free moving can be. Check out our **[reviews](/reviews)** to see what Miami families say about our service."""
    elif "kids" in title_lower or "children" in title_lower:
        outro = """## Focus on Your Family

Moving with children is challenging enough without worrying about logistics. Let Rapid Panda Movers handle the heavy lifting so you can focus on helping your kids adjust.

Our experienced crews work efficiently and carefully, understanding that your family's belongings—and peace of mind—matter. **[Get your free quote](/quote)** today."""
    elif "home" in title_lower or "settling" in title_lower or "first" in title_lower:
        outro = """## Start Your New Chapter Right

A smooth move sets the foundation for enjoying your new home. Rapid Panda Movers helps Miami families transition seamlessly with professional, careful service.

From packing to placement, our team handles every detail. **[Get your free quote](/quote)** and start your new chapter stress-free."""
    else:
        outro = """## Making Your Move Seamless

Whether you're relocating across town or across the country, Rapid Panda Movers is here to help. Our professional team handles everything from careful packing to safe transportation.

**[Get your free quote](/quote)** today and discover why Miami-Dade families trust Rapid Panda Movers for all their moving needs. Visit our **[reviews page](/reviews)** to see what our customers say."""

    content = f"""{intro}

{items_content}

{outro}"""

    return content


def generate_list_items(template, city, num_items, title):
    """Generate the actual list items for a listicle."""
    # Title is now passed in
    category = template["category"]

    items = []

    # =====================
    # RESTAURANT LISTICLES
    # =====================
    if city and any(word in title.lower() for word in ["restaurant", "dining"]):
        items = [
            f"## 1. Start with the Ventanitas\n\nThose walk-up coffee windows outside {city['name']} restaurants serve more than cafecito. Strike up conversation with regulars—they'll tell you exactly where to eat.",
            f"## 2. Check Yelp for 'Hidden Gem' Reviews\n\nFilter {city['name']} restaurant reviews for phrases like 'locals only' or 'hidden gem.' These tend to surface the places that survive on quality, not location.",
            f"## 3. Time Your Visits to Beat the Crowds\n\nMiami eats late. Hit popular {city['name']} spots at 6pm instead of 8pm, or try lunch service when kitchens are less slammed and more attentive.",
            f"## 4. Follow Local Food Instagram Accounts\n\nSearch '#{city['name'].lower().replace(' ', '')}food' or '#{city['name'].lower().replace(' ', '')}eats' for real-time recommendations from people who actually live there.",
            f"## 5. Don't Sleep on Strip Mall Restaurants\n\nSome of {city['name']}'s best restaurants hide in strip malls. Packed parking lots and no English on the menu are usually good signs.",
            f"## 6. Ask Your Server What THEY Eat\n\nOnce you find a restaurant you like in {city['name']}, ask staff where they eat on their days off. Restaurant workers know the best spots.",
            f"## 7. Hit Happy Hour for Budget Exploration\n\nMany {city['name']} restaurants offer substantial happy hour food deals. It's a low-risk way to sample higher-end places without the full price tag.",
            f"## 8. Join a Local Supper Club or Food Group\n\nSearch Facebook for '{city['name']} foodies' or 'Miami food lovers.' Group dinners help you discover restaurants AND meet your new neighbors.",
            f"## 9. Save Special Occasion Spots for Later\n\nOnce you've settled in {city['name']}, you'll have better context for which upscale restaurants are worth the splurge for birthdays and anniversaries.",
        ]

    # =====================
    # HIDDEN GEMS LISTICLES
    # =====================
    elif city and any(phrase in title.lower() for phrase in ["hidden gems", "secret spots"]):
        items = [
            f"## 1. Walk, Don't Drive, Your First Few Weeks\n\nThe best {city['name']} secrets reveal themselves on foot. Take different routes each day and you'll notice the coffee shop with no sign, the courtyard everyone gathers in, the shortcut only residents use.",
            f"## 2. Check Nextdoor for 'Best Kept Secret' Posts\n\nYour {city['name']} neighbors love sharing their favorite spots. Search old posts for recommendations—people get passionate about their local gems.",
            f"## 3. Ask at the Hardware Store\n\nSmall hardware stores in {city['name']} are neighborhood institutions. The staff knows everyone and everything. Ask where they eat lunch.",
            f"## 4. Follow the Dog Walkers\n\nDog people know every park, shortcut, and shaded bench in {city['name']}. Follow them (not creepily) to discover the best outdoor spots.",
            f"## 5. Check Local Event Calendars\n\nSearch '{city['name']} events this weekend' weekly. The best discoveries happen at community events most newcomers miss.",
            f"## 6. Visit During Off-Hours\n\nThat packed brunch spot in {city['name']} might have no wait at 2pm Tuesday. The empty park at 6am might be the neighborhood's best sunrise spot.",
            f"## 7. Ask Your Mail Carrier\n\nSeriously. Postal workers know every business, every schedule, and usually which places have the best air conditioning for a quick break.",
            f"## 8. Look for Doors That Don't Look Like Entrances\n\n{city['name']} has speakeasy-style bars, courtyard restaurants with unmarked entrances, and shops behind shops. If you see people disappearing into what looks like nothing, follow them.",
        ]

    # =====================
    # PARKS LISTICLES
    # =====================
    elif city and any(phrase in title.lower() for phrase in ["parks", "green spaces", "outdoor spaces"]):
        items = [
            f"## 1. Use Google Maps Satellite View\n\nZoom into {city['name']} on satellite view and look for green patches you didn't know existed. Many small parks don't show up in regular searches but are visible from above.",
            f"## 2. Time Your Visits Around Miami Weather\n\nEarly morning (before 9am) or late afternoon (after 5pm) are the sweet spots for {city['name']} parks. Midday heat makes most outdoor activities miserable.",
            f"## 3. Check Miami-Dade Parks Department Online\n\nThe county maintains a detailed list of all parks with amenities listed. Search for {city['name']} specifically to find facilities you didn't know were nearby.",
            f"## 4. Look for Parks with Shade Structures\n\nNot all {city['name']} parks are created equal in summer. Prioritize those with pavilions, mature trees, or covered picnic areas. Your comfort level will thank you.",
            f"## 5. Join Morning Walking Groups\n\nSearch Facebook for '{city['name']} walking group' or 'Miami morning walkers.' These groups know every park, trail, and shaded path in the area.",
            f"## 6. Check for Free Fitness Classes\n\nMany {city['name']} parks host free yoga, boot camp, or tai chi classes. Check park bulletin boards or the Miami-Dade Parks events calendar.",
            f"## 7. Visit on Weekday Mornings for Peace\n\nWeekend parks in {city['name']} can be crowded with sports leagues and families. Weekday mornings offer the same spaces with a fraction of the people.",
            f"## 8. Look Beyond 'Park' in the Name\n\n{city['name']} has green spaces called 'plazas,' 'greenways,' 'preserves,' and 'gardens.' Search all these terms to discover outdoor spaces you might have missed.",
        ]

    # =====================
    # FAMILY ACTIVITIES LISTICLES
    # =====================
    elif city and any(phrase in title.lower() for phrase in ["family-friendly", "fun things to do with kids"]):
        items = [
            f"## 1. Get the Library Card First Week\n\nYour {city['name']} library card is free and unlocks story times, summer reading programs, movie screenings, and craft sessions. This should be one of your first stops after moving.",
            f"## 2. Search Miami-Dade Parks for 'Splash Pad'\n\nFlorida heat demands water activities. The county parks department lists all {city['name']} area splash pads and spray parks—free and perfect for young kids.",
            f"## 3. Join the Nextdoor Parents Group\n\nSearch Nextdoor for '{city['name']} parents' or 'kids.' Local parents share the real scoop on which playgrounds are best, which activities are worth it, and where to find deals.",
            f"## 4. Time Outdoor Activities Around Heat\n\nIn {city['name']}, plan outdoor family activities for before 10am or after 4pm. Midday Florida sun is brutal on kids (and parents). Indoor activities or pool time fill the hot hours.",
            f"## 5. Sign Up for Museum Memberships Early\n\nMiami Children's Museum, Zoo Miami, and science centers near {city['name']} offer annual memberships. If you'll visit more than twice, they pay for themselves and often include guest passes.",
            f"## 6. Find the Secret Playground Gems\n\nEvery {city['name']} neighborhood has parks that locals love but tourists miss. Ask other parents at the obvious playgrounds for their actual favorites.",
            f"## 7. Download the Miami-Dade Parks App\n\nThe county app shows all parks, activities, and programs near {city['name']}. Youth sports leagues, swimming lessons, and camps all register through it.",
            f"## 8. Join Sports Through Schools and Rec Centers\n\nRegistration for youth sports in {city['name']} often opens months early. Get on mailing lists now so you don't miss soccer, baseball, or swim team signups.",
        ]

    # =====================
    # COFFEE SHOPS LISTICLES
    # =====================
    elif city and any(phrase in title.lower() for phrase in ["coffee", "cafe"]):
        items = [
            f"## 1. Start with the Ventanitas\n\nMiami's walk-up Cuban coffee windows are the real deal. In {city['name']}, find one near your house and make it your morning ritual. Café con leche runs about $2 and comes with free neighborhood gossip.",
            f"## 2. Check Google Reviews for 'WiFi' and 'Outlets'\n\nIf you work remotely, filter {city['name']} coffee shop reviews for these keywords. Not all cafes welcome laptop workers—find the ones that do before camping out.",
            f"## 3. Visit at Different Times\n\nThat perfect {city['name']} coffee spot might be packed at 9am but empty at 2pm. Try potential favorites at various hours before committing to a routine.",
            f"## 4. Ask About Their Beans\n\nMiami has a growing specialty coffee scene. In {city['name']}, look for shops that can tell you where their beans come from. It's a sign they take coffee seriously.",
            f"## 5. Follow the Construction Workers\n\nThe best cheap, strong coffee in {city['name']} is often wherever the work crews go. These spots prioritize speed, strength, and value.",
            f"## 6. Look for Pastelito Pairings\n\nCuban coffee and guava pastelitos are a Miami institution. Find a {city['name']} spot that makes both fresh, and you've found your new happy place.",
            f"## 7. Check Hours Before Making It Your Spot\n\nMany {city['name']} coffee shops close by 3pm. If you need afternoon caffeine, verify hours before getting too attached.",
            f"## 8. Tip Well and Become a Regular\n\nOnce you find your {city['name']} coffee spot, tip consistently. Being recognized as a regular means better service and genuine local connections.",
        ]

    # =====================
    # WEEKEND ACTIVITIES LISTICLES
    # =====================
    elif city and "weekend" in title.lower():
        items = [
            f"## 1. Find Your Farmers Market Routine\n\nGoogle '{city['name']} farmers market' and pick one to visit regularly. Beyond fresh produce, these are where you'll meet neighbors and discover what your new community cares about.",
            f"## 2. Leave Earlier Than You Think for Beach Days\n\nMiami beach parking fills up fast. If you're going from {city['name']}, leave by 8am on weekends or prepare for a parking nightmare.",
            f"## 3. Make Brunch Reservations Thursday Night\n\nPopular {city['name']} brunch spots book up. If you're planning to explore the brunch scene, reserve ahead or prepare for long waits.",
            f"## 4. Rent Before You Buy Gear\n\nPaddleboards, kayaks, bikes—rent them first while you explore {city['name']}. You'll learn which activities you actually enjoy before investing.",
            f"## 5. Check Do305.com and TimeOut Miami\n\nThese sites aggregate weekend events across Miami, including {city['name']}. Subscribe to their newsletters to never miss local happenings.",
            f"## 6. Explore One New Neighborhood Per Weekend\n\nMake it a habit to visit a different area each weekend. Within months, you'll know greater Miami better than people who've lived here for years.",
            f"## 7. Join a Sports League Through Miami-Dade Parks\n\nThe county runs affordable adult leagues for everything from soccer to pickleball. It's the fastest way to build a weekend routine and meet people near {city['name']}.",
            f"## 8. Check Happy Hour Schedules for Weekend Planning\n\nMany {city['name']} restaurants offer Saturday and Sunday happy hours. Map out the best deals and build your weekend exploration around them.",
        ]

    # =====================
    # BEACH LISTICLES
    # =====================
    elif city and "beach" in title.lower():
        items = [
            f"## 1. Go North or South to Escape Crowds\n\nMiami Beach and Fort Lauderdale get packed. From {city['name']}, consider beaches in the Keys or quieter spots in Broward County. The extra drive means actual relaxation.",
            f"## 2. Check Parking Apps Before You Leave\n\nSearch 'parking' plus your beach destination. Many Miami-area beaches have apps showing real-time parking availability. From {city['name']}, knowing this saves major headaches.",
            f"## 3. Arrive Before 9am on Weekends\n\nSeriously. Beach parking from {city['name']} is a completely different experience at 8:30am versus 10:30am. Early arrival means prime spots and calmer water.",
            f"## 4. Pack a Beach Wagon, Not a Bag\n\nMiami sand is soft and deep. Hauling stuff from parking to water is brutal with bags. A folding wagon is the best investment you'll make as a new {city['name']} resident.",
            f"## 5. Learn the Lifeguard Flag System\n\nGreen means go, yellow means caution, red means no swimming. Purple flags indicate dangerous marine life. Understanding this keeps you safe at beaches near {city['name']}.",
            f"## 6. Scout for Beach Showers and Bathrooms\n\nNot all beach access points have facilities. From {city['name']}, research which spots have showers and restrooms before committing to a day trip.",
            f"## 7. Bring More Water Than You Think\n\nMiami heat plus salt air equals serious dehydration. Pack at least twice the water you think you need for beach days from {city['name']}.",
            f"## 8. Check County Beach Advisories\n\nMiami-Dade posts water quality advisories online. Check before heading out from {city['name']}—some beaches occasionally close for bacteria levels after heavy rain.",
        ]

    # =====================
    # GYM/FITNESS LISTICLES
    # =====================
    elif any(word in title.lower() for word in ["gym", "fitness", "workout"]):
        items = [
            f"## 1. Take Advantage of Free Trial Passes\n\nMost gyms in {city['name']} offer 3-7 day free trials. Visit during your planned workout times to gauge how crowded it gets and whether the vibe matches your style.",
            f"## 2. Check Google Maps Reviews for 'Clean' and 'Maintained'\n\nSearch gym reviews specifically for comments about cleanliness and equipment maintenance. In {city['name']}'s humidity, gyms that don't stay on top of this become unpleasant fast.",
            f"## 3. Ask About Month-to-Month Options\n\nMany {city['name']} gyms push annual contracts, but most offer month-to-month at a slightly higher rate. This flexibility is worth it while you're still settling in.",
            f"## 4. Scout the Parking Situation\n\n{city['name']} gym parking can make or break your routine. Visit during peak hours (6-8am, 5-7pm) to see if you'll actually be able to get a spot.",
            f"## 5. Look for 24-Hour Access\n\nMiami's flexible schedules mean many people work out at odd hours. A gym with 24-hour access in {city['name']} gives you maximum flexibility to build your new routine.",
            f"## 6. Join Neighborhood Fitness Groups First\n\nSearch Facebook for '{city['name']} fitness' or '{city['name']} running club.' Free group workouts help you meet people AND discover which gyms locals actually recommend.",
            f"## 7. Consider Outdoor Options Year-Round\n\n{city['name']}'s parks often have free fitness equipment and boot camp groups. With Miami weather, outdoor workouts are viable 12 months a year.",
            f"## 8. Negotiate—Especially in January and Summer\n\nGym sales reps in {city['name']} have quotas. New Year and slow summer months are prime times to negotiate waived enrollment fees or reduced rates.",
        ]

    # =====================
    # MOVING HACKS LISTICLES
    # =====================
    elif any(word in title.lower() for word in ["hacks", "tricks", "shortcuts", "strategies that save", "secrets you need"]):
        items = [
            "## 1. The Suitcase Strategy\n\nRoll clothes and pack them in suitcases with wheels. You're using luggage you'd move anyway, and wheeled bags are easier to transport than boxes.",
            "## 2. Plate Packing Like Pros\n\nStand plates vertically in boxes, like records in a crate. This distributes pressure evenly and dramatically reduces breakage.",
            "## 3. The Garbage Bag Wardrobe\n\nCut a hole in the bottom of a garbage bag, slip it over hanging clothes, and tie the hanger hooks together. Instant wardrobe box for free.",
            "## 4. Hardware Organization System\n\nWhen disassembling furniture, put screws and bolts in a labeled ziplock bag and tape it directly to the furniture piece. No more mystery hardware.",
            "## 5. Strategic Loading Order\n\nHeavy items first, then medium weight, then light. Boxes should be stacked with heaviest on bottom. This prevents crushing and maximizes space.",
            "## 6. The Stretch Wrap Technique\n\nWrap furniture in stretch wrap to protect surfaces and keep drawers closed. It's cheaper than moving blankets and just as effective.",
            "## 7. Color-Coded Efficiency\n\nUse different colored tape for each room. Movers can unload directly to the right location without reading labels.",
        ]

    # =====================
    # PROFESSIONAL MOVER TIPS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["professional movers", "movers wish", "insider tips", "moving secrets the pros", "expert moving tips", "pro tips your", "lessons from", "industry secrets", "professional moving insights", "experienced moving"]):
        items = [
            "## 1. Packing Takes Longer Than You Think\n\nA 3-bedroom house takes 3-5 days to pack properly. Not one frantic night. Start early and pace yourself.",
            "## 2. Small Boxes for Heavy Items\n\nBooks, dishes, and tools go in small boxes. Large boxes are for light items like bedding and clothes. This isn't optional—it's physics.",
            "## 3. Labeling Saves Everyone Time\n\n\"Kitchen\" isn't enough. Write \"Kitchen - Coffee Station - Fragile\" on the box AND the side so stacked boxes are identifiable.",
            "## 4. Fragile Items Need Communication\n\nIf something is exceptionally fragile or valuable, tell movers before they touch it. We're careful, but we're not psychic.",
            "## 5. Access Matters More Than You Think\n\nClear pathways, reserved elevators, and available parking make moves faster. Every obstacle adds time and stress.",
            "## 6. Disassembled Furniture Helps\n\nBeds, tables, and desks move faster when disassembled. Keep hardware in labeled bags taped to the furniture.",
            "## 7. Have the New Layout Ready\n\nKnow where furniture goes before we arrive at the new place. Uncertainty means multiple rearrangements.",
            "## 8. Stay Accessible During the Move\n\nWe'll have questions. Being available—not necessarily underfoot—helps everything run smoothly.",
            "## 9. Cold Drinks Go Far\n\nMoving is hard physical work, especially in Miami heat. Water and Gatorade are always appreciated by crews.",
            "## 10. We Want Your Move to Go Well\n\nOur goal is happy customers. Work with us and we'll work for you. Communication is key to a successful move.",
        ]

    # =====================
    # PACKING MISTAKES LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["packing mistakes", "packing errors", "packing blunders", "packing pitfalls", "packing fails", "box packing mistakes"]):
        items = [
            "## 1. Overpacking Large Boxes\n\nA huge box of books is impossible to lift safely. Use small boxes for heavy items—always. Your back and your movers will thank you.",
            "## 2. Insufficient Cushioning\n\nOne layer of newspaper isn't enough. Fragile items need individual wrapping, padding on all sides, and zero room to shift.",
            "## 3. Leaving Hollow Items Empty\n\nHollow items like vases and cups are fragile. Fill them with packing paper or soft materials for structural support.",
            "## 4. Using Old, Weak Boxes\n\nOld boxes lose structural integrity. Wet boxes are disasters waiting to happen. Use fresh, sturdy boxes from a moving supply store.",
            "## 5. Improper Dish Packing\n\nNever stack plates horizontally. Pack them on edge, like records, with padding between each one. This prevents cracking from weight.",
        ]

    # =====================
    # DECLUTTER LISTICLES
    # =====================
    elif any(word in title.lower() for word in ["declutter", "downsize", "purging", "minimize your moving"]):
        items = [
            "## 1. The Room-by-Room Approach\n\nTackle one room at a time, completely. Jumping between rooms creates chaos and makes progress feel impossible.",
            "## 2. The Destination Test\n\nFor each item, ask: \"Will this have a place in my new home?\" If the answer is uncertain, reconsider keeping it.",
            "## 3. Set a Donation Deadline\n\nSchedule donation pickup for one week before moving. This deadline prevents last-minute hoarding and second-guessing.",
            "## 4. Sentimental Item Limit\n\nAllow yourself one box for sentimental items with no practical use. Everything else must have a function in your new space.",
            "## 5. Digital Declutter Too\n\nScan important papers and photos. Digital copies take no moving space and are easier to organize.",
            "## 6. The Sell/Donate/Trash System\n\nThree bags or boxes in each room. Make immediate decisions—no \"maybe\" pile allowed.",
            "## 7. Expired Everything Goes\n\nMedications, cosmetics, pantry items, spices—anything expired leaves before the move. No exceptions.",
            "## 8. Seasonal Honesty\n\nIf you didn't use it last season, you likely won't use it next season. Let it go and lighten your load.",
        ]

    # =====================
    # MOVING DAY ESSENTIALS LISTICLES
    # =====================
    elif ("moving day" in title.lower() or "when moving" in title.lower()) and any(word in title.lower() for word in ["essential", "must-have", "supplies", "necessities", "things to pack", "within reach"]) and "prohibited" not in title.lower() and "never" not in title.lower() and "keep out" not in title.lower():
        items = [
            "## 1. Important Documents\n\nPassports, IDs, birth certificates, lease/closing papers—keep these on your person or in your personal vehicle, never in a moving box.",
            "## 2. Medications and First Aid\n\nCurrent prescriptions, over-the-counter essentials, and any medical devices you might need in the next 24 hours stay with you.",
            "## 3. Phone Chargers and Power Banks\n\nDead phones on moving day mean missed calls from movers, utility companies, and anyone trying to help coordinate.",
            "## 4. Basic Toolkit\n\nScrewdriver set, pliers, box cutter, hammer—for last-minute needs at both locations. You'll use these more than you expect.",
            "## 5. Cleaning Supplies\n\nPaper towels, all-purpose cleaner, trash bags—for quick clean-ups during the transition at both old and new locations.",
            "## 6. First-Night Box\n\nToiletries, towels, bedding, change of clothes, and anything you'll need to sleep comfortably night one without unpacking everything.",
        ]

    # =====================
    # WRONG MOVING COMPANY / RED FLAGS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["wrong moving company", "red flags", "signs you've hired", "unreliable mover", "spot a bad", "clues you picked", "warnings that your mover", "scam"]):
        items = [
            "## 1. No Physical Address\n\nLegitimate companies have real offices. A P.O. box only or no verifiable address is a major red flag that should send you elsewhere.",
            "## 2. Unusually Low Estimates\n\nIf one quote is dramatically lower than others, it's likely a bait-and-switch. Your final bill will be much higher than quoted.",
            "## 3. Large Cash Deposit Requests\n\nProfessional movers don't demand large cash payments upfront. This is a common scam tactic—walk away immediately.",
            "## 4. No Written Estimate\n\nEverything should be in writing: the estimate, terms, insurance coverage, and all fees. Verbal agreements protect no one.",
            "## 5. No Insurance Information Available\n\nLicensed movers carry insurance and can prove it. If they can't or won't provide documentation, they may not be legitimate.",
            "## 6. Unmarked Trucks\n\nProfessional companies use marked, well-maintained vehicles. Unmarked trucks suggest unregistered or fly-by-night operations.",
            "## 7. Negative or No Reviews\n\nCheck Google, Yelp, and BBB. A pattern of complaints—or a complete absence of reviews—signals trouble ahead.",
            "## 8. Pressure to Sign Immediately\n\nLegitimate companies give you time to decide. High-pressure tactics indicate desperation or dishonesty.",
            "## 9. No DOT Number\n\nInterstate movers must be registered with the Department of Transportation. No DOT number means they're operating illegally.",
        ]

    # =====================
    # KIDS / CHILDREN MOVING LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["kids", "children", "whole family", "make moving fun", "family-friendly moving"]):
        items = [
            "## 1. Involve Kids in the Process\n\nLet children pack their own special box of treasures. Giving them control reduces anxiety and makes them part of the team.",
            "## 2. Maintain Routines\n\nKeep bedtimes, mealtimes, and familiar activities as consistent as possible. Routines provide comfort during change.",
            "## 3. Create Excitement About the New Home\n\nResearch fun things near your new place: parks, ice cream shops, activities. Give them something to look forward to.",
            "## 4. Set Up Their Room First\n\nPrioritize getting children's bedrooms functional and familiar before anything else. Having their own space immediately reduces stress.",
            "## 5. Let Them Say Goodbye\n\nCreate closure by visiting favorite places, taking photos, and saying goodbye to friends. Acknowledgment helps with processing change.",
            "## 6. Pack a Moving Day Activity Bag\n\nFill a backpack with snacks, toys, tablets, and activities to keep kids occupied while adults manage logistics.",
            "## 7. Explore the New Neighborhood Together\n\nTake walks, visit local spots, and meet neighbors as a family. Building new positive associations starts immediately.",
        ]

    # =====================
    # PROHIBITED ITEMS / NEVER PUT ON TRUCK LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["never put", "prohibited", "should never", "can't go", "keep off", "banned", "aren't allowed", "won't transport", "must move yourself"]):
        items = [
            "## 1. Hazardous Materials\n\nGasoline, propane, paint thinner, aerosols, and chemicals are fire hazards and illegal to transport on moving trucks.",
            "## 2. Explosives and Ammunition\n\nFireworks, ammunition, and anything explosive must be disposed of or transported personally with proper safety measures.",
            "## 3. Perishable Foods\n\nRefrigerated and frozen items won't survive most moves. Consume, donate, or dispose of perishables before moving day.",
            "## 4. Plants (for Long-Distance Moves)\n\nAgricultural regulations often prohibit transporting plants across state lines due to pest concerns.",
            "## 5. Pets and Living Creatures\n\nFish, pets, and any living animals cannot travel on moving trucks. Arrange separate, safe transportation for them.",
            "## 6. Irreplaceable Documents\n\nPassports, birth certificates, financial records, and legal documents should stay with you personally during the move.",
            "## 7. Jewelry and Cash\n\nHigh-value, easily stolen items belong in your personal vehicle, not on a truck full of boxes.",
            "## 8. Medications\n\nKeep prescriptions accessible and in your possession—never packed in boxes that might be delayed or lost.",
            "## 9. Pressurized Containers\n\nFire extinguishers, scuba tanks, and aerosol cans can explode under pressure or temperature changes during transport.",
            "## 10. Anything Irreplaceable\n\nFamily photos, heirlooms, and items of extreme sentimental value should travel with you in your personal vehicle.",
        ]

    # =====================
    # BUDGET MOVING LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["budget", "save", "money-saving", "cut costs", "affordable", "thrifty", "cost-cutting"]):
        items = [
            "## 1. Declutter Before Getting Quotes\n\nFewer items equals lower costs. Aggressively declutter before movers assess your load—every box saved is money saved.",
            "## 2. Time Your Move Strategically\n\nMid-week, mid-month moves cost less than weekend or end-of-month moves. Avoid peak summer months when possible.",
            "## 3. Get Multiple Quotes\n\nCompare at least three estimates from reputable companies. Make sure they're all based on the same inventory for accurate comparison.",
            "## 4. Do Your Own Packing\n\nProfessional packing adds cost. If you have time, pack everything yourself with proper materials from a discount store.",
            "## 5. Source Free Boxes\n\nCheck with local stores, Facebook Marketplace, and Nextdoor for free moving boxes. Many people give them away after their moves.",
        ]

    # =====================
    # LAST-MINUTE MOVING LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["last-minute", "procrastinator", "running out of time", "emergency moving", "rushed", "rapid moving", "speed packing", "quick-fire", "time-crunch"]):
        items = [
            "## 1. Focus on Must-Haves Only\n\nSeparate absolute necessities from nice-to-haves. Move essentials first; everything else can follow or be donated.",
            "## 2. Use Trash Bags for Clothes\n\nGarbage bags over hanging clothes are fast and effective. No folding required—just tie the hangers together.",
            "## 3. Skip the Sorting\n\nWhen time is critical, box everything and sort at the new place. Speed trumps organization in emergency situations.",
            "## 4. Hire Professional Packers\n\nYes, it costs more, but professional packers can handle in hours what takes you days. It's worth it when time is short.",
            "## 5. Accept Every Offer of Help\n\nNow is not the time to be independent. Accept every offer of assistance from friends and family.",
            "## 6. Call Multiple Moving Companies\n\nMoving companies often have last-minute availability. Call several until you find one with an open slot.",
            "## 7. Consider a Storage Unit\n\nIf you can't get everything moved by deadline, a short-term storage unit buys you flexibility.",
            "## 8. Prioritize Sleep\n\nExhausted packing leads to broken items and forgotten essentials. Rest is actually productive.",
        ]

    # =====================
    # HOME SETTLING / NEW HOME LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["feel like home", "new house", "settling", "transform a house", "personalize your", "homey atmosphere", "new place feel"]):
        items = [
            "## 1. Unpack Essentials Only First Day\n\nKitchen basics, bathroom necessities, and bedroom setup. Everything else can wait until you've rested.",
            "## 2. Make One Room Complete\n\nFully finish one room—your bedroom or living room—so you have a refuge from the unpacking chaos.",
            "## 3. Add Personal Touches Early\n\nHang a few favorite photos or artwork immediately. Familiar objects help new spaces feel like yours.",
            "## 4. Establish New Routines\n\nFind your new coffee shop, walking route, or morning routine. Routines create a sense of belonging.",
            "## 5. Introduce Yourself to Neighbors\n\nA quick hello establishes community and makes the neighborhood feel welcoming from day one.",
            "## 6. Stock the Pantry and Fridge\n\nHaving food you like available immediately makes the new place feel more like home.",
            "## 7. Take Breaks Outside\n\nStep away from boxes and explore your new neighborhood. Fresh perspective helps with the transition.",
            "## 8. Give Yourself Grace\n\nFeeling settled takes time. Don't expect to feel at home in a week—it's a gradual process.",
            "## 9. Update Your Address Everywhere\n\nDMV, banks, subscriptions, mail forwarding—tackle this tedious task early so nothing gets lost.",
            "## 10. Celebrate the Move\n\nOnce you're somewhat settled, mark the milestone. New beginnings deserve acknowledgment.",
        ]

    # =====================
    # FIRST THINGS TO DO / NEW HOME CHECKLIST LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["first things", "first week", "priority items", "immediate actions", "critical steps", "day-one tasks", "first-week priorities", "new home checklist"]):
        items = [
            "## 1. Change All the Locks\n\nYou don't know who has keys from before. Change locks immediately for security and peace of mind.",
            "## 2. Test All Appliances\n\nRun the dishwasher, check the stove, test the washer/dryer. Identify problems while warranty claims are still fresh.",
            "## 3. Locate Emergency Shutoffs\n\nFind and label water main, electrical panel, and gas shutoff. You'll need to know these eventually—better to find them now.",
            "## 4. Set Up Mail Forwarding\n\nVisit USPS.com to ensure nothing gets lost during the transition period. This should happen before you move.",
            "## 5. Transfer Utilities to Your Name\n\nElectricity, gas, water, internet—confirm all accounts are active and in your name before move-in day.",
            "## 6. Schedule Critical Installations\n\nInternet, cable, security systems—book these early as installation windows fill up quickly.",
            "## 7. Deep Clean Before Unpacking\n\nIf you didn't do it before moving in, clean thoroughly now while rooms are still relatively empty.",
        ]

    # =====================
    # HOME ORGANIZATION LISTICLES
    # =====================
    elif "Organization" in title or "Organize" in title:
        items = [
            "## 1. Unpack by Room, Not by Box\n\nFinish one room completely before moving to the next. Half-unpacked rooms everywhere creates overwhelming chaos.",
            "## 2. Assign Zones Before Placing Furniture\n\nDecide where activities happen—work, relaxation, eating—before arranging furniture permanently.",
            "## 3. Measure Before Buying Organizers\n\nDon't purchase storage solutions until you know exact dimensions of closets and cabinets.",
            "## 4. Purge Again During Unpacking\n\nIf you're holding something asking \"where does this go?\" maybe it doesn't need to go anywhere. Donate it.",
            "## 5. Create a Landing Zone\n\nDesignate a spot near the entrance for keys, mail, and daily essentials. This prevents lost-item chaos.",
            "## 6. Label Storage Containers\n\nClear bins with labels keep closets and garages functional. Unlabeled storage becomes junk drawers.",
            "## 7. Set Up Paper Systems Immediately\n\nWhere will mail live? Bills? Important documents? Decide now before papers accumulate everywhere.",
            "## 8. Leave Room to Grow\n\nDon't fill every inch with stuff. Empty space allows for future needs and prevents cramped feeling.",
        ]

    # =====================
    # SECURITY / SAFETY LISTICLES
    # =====================
    elif any(word in title.lower() for word in ["security", "safety", "secure", "protection"]):
        items = [
            "## 1. Change All Locks Immediately\n\nPrevious owners, contractors, and real estate agents may have copies of keys. Start fresh with new locks.",
            "## 2. Check All Windows and Doors\n\nEnsure every entry point locks properly. Replace or repair faulty locks right away.",
            "## 3. Install or Update Security System\n\nWhether professional monitoring or DIY smart devices, get a security system active immediately.",
            "## 4. Add Exterior Lighting\n\nMotion-sensor lights deter intruders and help you navigate safely at night.",
            "## 5. Test Smoke and CO Detectors\n\nReplace batteries in all detectors. If units are old, replace them entirely.",
        ]

    # =====================
    # NEIGHBORS / COMMUNITY LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["neighbors", "community", "neighborhood friendships", "break the ice", "making friends", "approaches to making"]):
        items = [
            "## 1. Wave and Say Hello\n\nSimple acknowledgment creates familiarity. Make eye contact, smile, and greet neighbors you see.",
            "## 2. Introduce Yourself Door-to-Door\n\nWithin the first week, knock on immediate neighbors' doors and introduce yourself briefly.",
            "## 3. Join Local Social Media Groups\n\nNextdoor, Facebook community groups, and neighborhood apps connect you with local information and people.",
            "## 4. Attend Community Events\n\nFarmers markets, block parties, school events—show up where your community gathers.",
            "## 5. Support Local Businesses\n\nFrequenting neighborhood shops and restaurants makes you a familiar face and supports your community.",
            "## 6. Offer Help\n\nVolunteer to water plants during vacations, offer to collect packages—small gestures build relationships.",
        ]

    # =====================
    # PLANTS / INDOOR PLANTS LISTICLES
    # =====================
    elif "plant" in title.lower():
        items = [
            "## 1. Pothos (Epipremnum aureum)\n\nNearly indestructible. Thrives in low light, tolerates irregular watering, and purifies air. Perfect for Miami beginners.",
            "## 2. Bird of Paradise (Strelitzia)\n\nMakes a dramatic statement and loves Miami's bright light and warmth. Can grow impressively large indoors.",
            "## 3. Snake Plant (Sansevieria)\n\nTolerates neglect, low light, and inconsistent watering. Ideal for air-conditioned environments.",
            "## 4. Monstera Deliciosa\n\nThe iconic split-leaf philodendron thrives in Miami's humidity. Grows impressive leaves with proper care.",
            "## 5. Bromeliad\n\nNative to tropical climates, bromeliads love humidity and add colorful blooms to any space.",
            "## 6. Peace Lily (Spathiphyllum)\n\nLoves humidity, tolerates low light, and indicates when it needs water by drooping slightly.",
            "## 7. Fiddle Leaf Fig (Ficus lyrata)\n\nTrendy and dramatic, fiddle leafs love Florida's humidity but need consistent care.",
            "## 8. ZZ Plant (Zamioculcas zamiifolia)\n\nVirtually un-killable. Tolerates low light, drought, and neglect. Glossy leaves add elegant greenery.",
            "## 9. Orchid (Phalaenopsis)\n\nSurprisingly easy in Miami's climate. Bright indirect light and weekly watering produce beautiful blooms.",
        ]

    # =====================
    # SMART HOME / GADGETS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["smart home", "gadgets", "tech upgrades", "home automation", "smart devices", "home tech", "connected home tools"]):
        items = [
            "## 1. Smart Thermostat\n\nNest, Ecobee, or similar devices learn your schedule and optimize energy use. They pay for themselves in utility savings.",
            "## 2. Video Doorbell\n\nRing, Nest, or other video doorbells let you see visitors and delivery people from anywhere via smartphone.",
            "## 3. Smart Locks\n\nKeyless entry, remote locking, and temporary codes for visitors eliminate key management hassles.",
            "## 4. Smart Lighting\n\nAutomated lighting controlled by voice, app, or schedule adds convenience and security.",
            "## 5. Mesh WiFi System\n\nLarge homes benefit from mesh networks that eliminate dead zones and provide consistent coverage everywhere.",
            "## 6. Smart Smoke Detectors\n\nNest Protect and similar devices send phone alerts and communicate with each other during emergencies.",
            "## 7. Water Leak Sensors\n\nSmall sensors near water heaters, under sinks, and by washing machines alert you to leaks before disasters.",
        ]

    # =====================
    # UNPACKING LISTICLES
    # =====================
    elif "Unpacking" in title:
        items = [
            "## 1. Start with Your Essentials Box\n\nOpen your essentials box first: toiletries, phone chargers, coffee maker, paper towels. These get you through day one.",
            "## 2. Set Up Kitchen Basics Immediately\n\nA functional kitchen means normal life can resume. Prioritize dishes, utensils, and basic cooking equipment.",
            "## 3. Make Beds Early\n\nExhausted from unpacking? Having made beds ready means you can stop whenever you need rest.",
            "## 4. Work Room by Room\n\nFinish one room before starting another. Scattered, partial progress everywhere creates overwhelming chaos.",
            "## 5. Break Down Boxes Immediately\n\nCollapsed boxes take up less space and make rooms feel more settled. Don't let empty boxes pile up.",
            "## 6. Place Furniture First\n\nPosition large furniture before unpacking boxes. Moving furniture around boxes is frustrating and inefficient.",
            "## 7. Organize as You Unpack\n\nDon't just shove things in cabinets planning to organize later. You won't. Organize as you go.",
            "## 8. Schedule Donation Pickup\n\nSet a deadline for unpacking by scheduling a donation pickup for items you realize you don't need.",
            "## 9. Take Breaks Outside\n\nStep away from boxes and explore your new neighborhood. Fresh perspective helps with motivation.",
            "## 10. Celebrate Small Wins\n\nEach finished room is an accomplishment. Acknowledge progress rather than focusing on remaining work.",
        ]

    # =====================
    # WEIRD MOVING REQUESTS / UNUSUAL ITEMS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["weird", "unusual", "strange", "bizarre", "specialty items", "tricky items", "expert handling", "challenging items", "delicate possessions", "difficult belongings", "peculiar", "unexpected items", "specialty possessions"]):
        items = [
            "## 1. Grand Pianos\n\nThese massive instruments require specialized equipment, multiple people, and expertise to avoid damage to the piano and property.",
            "## 2. Wine Collections\n\nTemperature sensitivity, fragile bottles, and proper positioning require climate-controlled handling and custom crating.",
            "## 3. Hot Tubs and Spas\n\nDraining, disconnecting, and moving these heavy items requires professionals familiar with the process.",
            "## 4. Large Aquariums\n\nFish need separate transport; tanks must be drained, carefully padded, and moved level to prevent cracking.",
            "## 5. Pool Tables\n\nSlate tops require disassembly by specialists. Improperly moved pool tables never play the same.",
            "## 6. Fine Art and Sculptures\n\nCustom crating, climate control, and white-glove handling protect valuable artwork during transit.",
            "## 7. Full Gym Equipment\n\nTreadmills, weight machines, and home gyms are heavy and awkward. Professional movers have the equipment to handle them.",
            "## 8. Classic Cars\n\nValuable vehicles need enclosed transport and special handling. Regular moving trucks aren't appropriate.",
        ]

    # =====================
    # CELEBRITY HOMES LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["celebrity", "famous", "mansion", "star-studded", "a-list"]):
        items = [
            "## 1. Star Island Estates\n\nThis exclusive island has housed Madonna, Diddy, and Gloria Estefan—requiring discrete, high-security moving services.",
            "## 2. Versace Mansion (Casa Casuarina)\n\nGianni Versace's famous South Beach residence has seen multiple transformations and celebrity occupants.",
            "## 3. Fisher Island Properties\n\nAccessible only by boat, this ultra-exclusive community requires specialized logistics for any move.",
            "## 4. Coral Gables Mansions\n\nThe historic Mediterranean-style estates in Coral Gables have housed numerous celebrities over the decades.",
            "## 5. Miami Beach Penthouses\n\nLuxury high-rise penthouses require coordinated elevator access and building management approval for moves.",
        ]

    # =====================
    # SUPERSTITIONS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["superstition", "traditions", "cultural beliefs", "lucky rituals", "cultural moving"]):
        items = [
            "## 1. Don't Move on a Rainy Day\n\nMany cultures consider rain on moving day to be bad luck—water symbolizes washing away good fortune. Others view it as cleansing.",
            "## 2. Carry Salt Into Your New Home First\n\nSalt has protected against evil spirits in folklore worldwide. Many people sprinkle salt in corners or carry a container across the threshold.",
            "## 3. Never Move on a Friday\n\nIn Western traditions, Friday moves are considered unlucky, possibly from superstitions about Friday the 13th.",
            "## 4. Bring a New Broom\n\nOld brooms are said to sweep away good luck and bring old problems. A new broom represents a fresh start.",
            "## 5. Don't Look Back at Your Old Home\n\nSome believe looking back as you leave brings bad luck or means you'll return to your old troubles.",
            "## 6. Boil Milk and Rice First\n\nIn Indian tradition, boiling milk until it overflows symbolizes abundance. Cooking rice first brings prosperity.",
            "## 7. Enter with Bread and Salt\n\nSlavic and Jewish traditions involve entering with bread (so you never know hunger) and salt (so life always has flavor).",
        ]

    # =====================
    # MOVIES ABOUT MOVING LISTICLES
    # =====================
    elif any(word in title.lower() for word in ["movies", "films", "cinematic", "hollywood"]):
        items = [
            "## 1. \"The Money Pit\" (1986)\n\nTom Hanks and Shelley Long buy a mansion that falls apart around them—a comedy about the chaos that can follow a move.",
            "## 2. \"Moving\" (1988)\n\nRichard Pryor's comedy about a cross-country relocation gone wrong captures every moving nightmare imaginable.",
            "## 3. \"The Incredibles\" (2004)\n\nA superhero family forced into witness protection and a new city shows how moves affect families—animated style.",
            "## 4. \"Up\" (2009)\n\nThe ultimate statement about home attachment—a man floats his house to a new location rather than leave it behind.",
            "## 5. \"The Pursuit of Happyness\" (2006)\n\nWill Smith's struggle through homelessness shows the emotional weight of having no stable home.",
            "## 6. \"Fun with Dick and Jane\" (2005)\n\nFinancial crisis forces a family to extreme measures—showing how job loss and moves intertwine.",
            "## 7. \"Beetlejuice\" (1988)\n\nWhen a family moves into a haunted house, the previous owners aren't happy about the change.",
            "## 8. \"Home Alone\" (1990)\n\nThe McCallister family's chaotic departure starts one of cinema's most beloved comedies about home.",
            "## 9. \"The Pacifier\" (2005)\n\nA Navy SEAL moves in to protect a family, highlighting how strangers in new spaces adapt—with comedy.",
            "## 10. \"Mrs. Doubtfire\" (1993)\n\nRobin Williams' character deals with the pain of moving out after divorce—touching on real family transitions.",
        ]

    # =====================
    # HISTORIC BUILDINGS LISTICLES
    # =====================
    elif any(phrase in title.lower() for phrase in ["historic", "buildings", "landmark", "structures", "architectural", "storied"]):
        items = [
            "## 1. Vizcaya Museum and Gardens\n\nThis 1916 Italian Renaissance-style estate in Coconut Grove has moved countless artifacts and artworks over its century.",
            "## 2. The Freedom Tower\n\nKnown as \"Miami's Ellis Island,\" this 1925 building processed Cuban refugees and stands as a symbol of migration.",
            "## 3. The Biltmore Hotel\n\nThis 1926 Coral Gables landmark has been a hospital, a university, and a luxury hotel—each transition requiring massive moves.",
            "## 4. Art Deco Historic District\n\nSouth Beach's iconic buildings from the 1930s and 40s have housed countless residents through decades of Miami history.",
            "## 5. Coral Gables City Hall\n\nBuilt in 1928, this Mediterranean Revival building has witnessed the growth of one of Miami's most elegant communities.",
        ]

    # =====================
    # DEFAULT FALLBACK
    # =====================
    else:
        # Generic items for other listicles
        items = [
            "## 1. Do Your Research\n\nKnowledge is power. Take time to research and understand all your options before making decisions.",
            "## 2. Plan Ahead\n\nSuccess comes from good planning. Create timelines and checklists to stay organized throughout the process.",
            "## 3. Ask the Experts\n\nDon't hesitate to consult professionals who have experience. Their insights can save you time and money.",
            "## 4. Set a Budget\n\nKnow your financial limits and plan accordingly. There are options available for every budget level.",
            "## 5. Stay Flexible\n\nThings don't always go as planned. Being adaptable helps you handle unexpected situations with less stress.",
            "## 6. Take Notes and Photos\n\nDocument everything. Photos, lists, and written records help you stay organized and remember important details.",
            "## 7. Get Multiple Quotes\n\nWhether it's services or products, comparing options helps ensure you get the best value for your money.",
            "## 8. Read Reviews\n\nOther people's experiences provide valuable insights. Look for patterns in reviews rather than focusing on outliers.",
            "## 9. Trust Your Instincts\n\nIf something doesn't feel right, it probably isn't. Don't ignore your gut feelings during important decisions.",
            "## 10. Celebrate Your Progress\n\nAcknowledge your wins along the way. Every step forward is worth celebrating.",
        ]

    # Return only the number of items requested
    return "\n\n".join(items[:num_items])


def ensure_unique_slug(slug, used_slugs, date):
    """Ensure slug is unique by appending date if needed."""
    if slug not in used_slugs:
        return slug

    date_suffix = date.strftime("-%m-%d")
    unique_slug = slug[:50] + date_suffix

    counter = 2
    final_slug = unique_slug
    while final_slug in used_slugs:
        final_slug = f"{unique_slug}-{counter}"
        counter += 1

    return final_slug


def generate_all_posts():
    """Generate all 312 blog posts (3 per week for 104 weeks)."""
    posts = []
    used_slugs = set()

    # Start date: Monday, February 2, 2026
    start_date = datetime(2026, 2, 2)

    post_id = 70  # Starting after existing posts

    # Create shuffled lists for more variety
    # Services - shuffle but ensure each service gets used roughly equally
    shuffled_services = SERVICES * (104 // len(SERVICES) + 1)
    random.shuffle(shuffled_services)

    # Cities - shuffle for variety
    shuffled_cities = CITIES * (104 // len(CITIES) + 1)
    random.shuffle(shuffled_cities)

    city_index = 0

    for week in range(104):  # 104 weeks = 2 years
        # Monday post (Service + Topical)
        monday = start_date + timedelta(weeks=week)
        month_data = MONTHLY_THEMES[monday.month]
        service = shuffled_services[week]

        service_post = generate_service_post(post_id, monday, service, month_data)
        service_post["slug"] = ensure_unique_slug(service_post["slug"], used_slugs, monday)
        image_folder = generate_image_path(monday, service_post["slug"])
        service_post["image_folder"] = image_folder
        service_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(service_post["slug"])
        posts.append(service_post)
        post_id += 1

        # Wednesday post (Listicle) - randomly select template
        wednesday = monday + timedelta(days=2)
        month_data = MONTHLY_THEMES[wednesday.month]
        template = random.choice(LISTICLE_TEMPLATES)
        city_for_listicle = shuffled_cities[city_index % len(shuffled_cities)] if template.get("needs_city") else None

        listicle_post = generate_listicle_post(post_id, wednesday, template, city_for_listicle or random.choice(CITIES), month_data)
        listicle_post["slug"] = ensure_unique_slug(listicle_post["slug"], used_slugs, wednesday)
        image_folder = generate_image_path(wednesday, listicle_post["slug"])
        listicle_post["image_folder"] = image_folder
        listicle_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(listicle_post["slug"])
        posts.append(listicle_post)
        post_id += 1

        # Thursday post (Location + Moving Topic)
        thursday = monday + timedelta(days=3)
        month_data = MONTHLY_THEMES[thursday.month]
        city = shuffled_cities[city_index]

        location_post = generate_location_post(post_id, thursday, city, month_data)
        location_post["slug"] = ensure_unique_slug(location_post["slug"], used_slugs, thursday)
        image_folder = generate_image_path(thursday, location_post["slug"])
        location_post["image_folder"] = image_folder
        location_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(location_post["slug"])
        posts.append(location_post)
        post_id += 1
        city_index += 1

    return posts


def extend_posts(existing_posts, start_date, end_date):
    """Extend existing posts with new posts from start_date through end_date.

    Args:
        existing_posts: List of existing post dictionaries
        start_date: First Monday to start generating from
        end_date: Last date to generate posts through (generates up to last full week before this)

    Returns:
        List of new posts only (does not include existing posts)
    """
    global _used_service_titles, _used_location_titles, _used_listicle_titles

    # Initialize used slugs and titles from existing posts
    used_slugs = {p["slug"] for p in existing_posts}

    # Extract used titles to avoid duplicates
    _used_service_titles = {p["title"] for p in existing_posts if p.get("category") == "Moving Tips" and p.get("service_link")}
    _used_location_titles = {p["title"] for p in existing_posts if p.get("category") == "Location Guide"}
    _used_listicle_titles = {p["title"] for p in existing_posts
                            if p.get("category") in ["Fun Facts", "Lifestyle", "Home & Living", "Moving Tips"]
                            and not p.get("service_link")}

    # Find next post ID
    max_id = max(int(p["id"]) for p in existing_posts)
    post_id = max_id + 1

    new_posts = []

    # Calculate number of weeks
    weeks = (end_date - start_date).days // 7

    # Create shuffled lists for variety with enough items
    shuffled_services = SERVICES * ((weeks // len(SERVICES)) + 2)
    random.shuffle(shuffled_services)

    shuffled_cities = CITIES * ((weeks // len(CITIES)) + 2)
    random.shuffle(shuffled_cities)

    city_index = 0

    for week in range(weeks):
        # Monday post (Service + Topical)
        monday = start_date + timedelta(weeks=week)
        if monday > end_date:
            break

        month_data = MONTHLY_THEMES[monday.month]
        service = shuffled_services[week % len(shuffled_services)]

        service_post = generate_service_post(post_id, monday, service, month_data)
        service_post["slug"] = ensure_unique_slug(service_post["slug"], used_slugs, monday)
        image_folder = generate_image_path(monday, service_post["slug"])
        service_post["image_folder"] = image_folder
        service_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(service_post["slug"])
        new_posts.append(service_post)
        post_id += 1

        # Wednesday post (Listicle)
        wednesday = monday + timedelta(days=2)
        if wednesday > end_date:
            break

        month_data = MONTHLY_THEMES[wednesday.month]
        template = random.choice(LISTICLE_TEMPLATES)
        city_for_listicle = shuffled_cities[city_index % len(shuffled_cities)] if template.get("needs_city") else None

        listicle_post = generate_listicle_post(post_id, wednesday, template, city_for_listicle or random.choice(CITIES), month_data)
        listicle_post["slug"] = ensure_unique_slug(listicle_post["slug"], used_slugs, wednesday)
        image_folder = generate_image_path(wednesday, listicle_post["slug"])
        listicle_post["image_folder"] = image_folder
        listicle_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(listicle_post["slug"])
        new_posts.append(listicle_post)
        post_id += 1

        # Thursday post (Location)
        thursday = monday + timedelta(days=3)
        if thursday > end_date:
            break

        month_data = MONTHLY_THEMES[thursday.month]
        city = shuffled_cities[city_index % len(shuffled_cities)]

        location_post = generate_location_post(post_id, thursday, city, month_data)
        location_post["slug"] = ensure_unique_slug(location_post["slug"], used_slugs, thursday)
        image_folder = generate_image_path(thursday, location_post["slug"])
        location_post["image_folder"] = image_folder
        location_post["image"] = get_featured_image_path(image_folder)
        used_slugs.add(location_post["slug"])
        new_posts.append(location_post)
        post_id += 1
        city_index += 1

    return new_posts


def main():
    """Main function to generate and save blog posts.

    Modes:
    - Default (no args): Generate fresh posts from Feb 2026
    - --fill-gap: Generate posts to fill gap between blog.json (ends Sept 2024) and posts.json (starts Feb 2026)
    - --extend: Extend existing posts.json through end of 2030
    """
    import sys
    from collections import Counter

    output_path = Path(__file__).parent.parent / "data" / "posts.json"
    gap_output_path = Path(__file__).parent.parent / "data" / "gap_posts.json"

    # Check for fill-gap mode
    if len(sys.argv) > 1 and sys.argv[1] == "--fill-gap":
        print("Generating gap-filling posts (Sept 2024 to Feb 2026)...")

        # Gap parameters
        # blog.json ends at 2024-09-24 (Tuesday), so start from next Monday (2024-09-30)
        start_date = datetime(2024, 9, 30)  # First Monday after Sept 24
        end_date = datetime(2026, 2, 1)  # Day before posts.json starts
        start_id = 70  # Continue from blog.json which ends at 69

        # Calculate weeks
        weeks = (end_date - start_date).days // 7
        print(f"Generating posts from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print(f"Approximately {weeks} weeks = {weeks * 3} posts")

        # Generate posts using extend_posts with empty existing posts
        # We need to seed the title trackers with blog.json titles
        blog_path = Path(__file__).parent.parent / "data" / "blog.json"
        with open(blog_path, "r", encoding="utf-8") as f:
            blog_posts = json.load(f)

        gap_posts = extend_posts(blog_posts, start_date, end_date)

        # Renumber the gap posts to start at 70
        for i, post in enumerate(gap_posts):
            post["id"] = start_id + i
            # Update image paths with new ID
            old_folder = post.get("image_folder", "")
            if old_folder:
                # Image folder doesn't have ID in path, so no change needed
                pass

        print(f"Generated {len(gap_posts)} gap posts")

        # Save gap posts separately
        with open(gap_output_path, "w", encoding="utf-8") as f:
            json.dump(gap_posts, f, indent=2, ensure_ascii=False)

        print(f"Saved gap posts to {gap_output_path}")

        if gap_posts:
            first_date = gap_posts[0]["date"]
            last_date = gap_posts[-1]["date"]
            print(f"Gap posts date range: {first_date} to {last_date}")
            print(f"Gap posts ID range: {gap_posts[0]['id']} to {gap_posts[-1]['id']}")

            # Check day distribution
            days = Counter()
            for p in gap_posts:
                d = datetime.strptime(p["date"], "%Y-%m-%d")
                days[d.strftime("%A")] += 1
            print(f"Gap posts by day: {dict(days)}")

            # Check categories
            categories = Counter(p["category"] for p in gap_posts)
            print(f"Gap posts by category: {dict(categories)}")

    # Check for extend mode
    elif len(sys.argv) > 1 and sys.argv[1] == "--extend":
        print("Extending existing posts through 2028...")

        # Load existing posts
        with open(output_path, "r", encoding="utf-8") as f:
            existing_posts = json.load(f)

        print(f"Loaded {len(existing_posts)} existing posts")

        # Find the last post date
        last_date = max(datetime.strptime(p["date"], "%Y-%m-%d") for p in existing_posts)
        print(f"Last existing post date: {last_date.strftime('%Y-%m-%d')}")

        # Find next Monday after last post
        days_until_monday = (7 - last_date.weekday()) % 7
        if days_until_monday == 0:
            days_until_monday = 7
        start_date = last_date + timedelta(days=days_until_monday)

        # Set end date to Dec 31, 2030
        end_date = datetime(2030, 12, 31)

        print(f"Generating posts from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")

        # Generate new posts
        new_posts = extend_posts(existing_posts, start_date, end_date)

        print(f"Generated {len(new_posts)} new posts")

        # Merge and save
        all_posts = existing_posts + new_posts
        print(f"Total posts: {len(all_posts)}")

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(all_posts, f, indent=2, ensure_ascii=False)

        print(f"Saved {len(all_posts)} posts to {output_path}")

        # Print new posts date range
        if new_posts:
            first_new = new_posts[0]["date"]
            last_new = new_posts[-1]["date"]
            print(f"New posts date range: {first_new} to {last_new}")

            # Check day distribution for new posts
            days = Counter()
            for p in new_posts:
                d = datetime.strptime(p["date"], "%Y-%m-%d")
                days[d.strftime("%A")] += 1
            print(f"New posts by day: {dict(days)}")

            # Check categories for new posts
            categories = Counter(p["category"] for p in new_posts)
            print(f"New posts by category: {dict(categories)}")

    else:
        print("Generating 312 blog posts (3 per week for 2 years)...")

        posts = generate_all_posts()

        print(f"Generated {len(posts)} posts")

        # Check date distribution
        days = Counter()
        for p in posts:
            d = datetime.strptime(p["date"], "%Y-%m-%d")
            days[d.strftime("%A")] += 1

        print(f"By day: {dict(days)}")

        # Check categories
        categories = Counter(p["category"] for p in posts)
        print(f"By category: {dict(categories)}")

        # Save to file
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(posts, f, indent=2, ensure_ascii=False)

        print(f"Saved posts to {output_path}")

        # Print date range
        first_date = posts[0]["date"]
        last_date = posts[-1]["date"]
        print(f"Date range: {first_date} to {last_date}")


if __name__ == "__main__":
    main()
