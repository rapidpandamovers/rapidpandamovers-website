#!/usr/bin/env python3
"""
Fetch reviews from multiple platforms for Rapid Panda Movers.

Supported Platforms:
- Google Places API
- Yelp Fusion API
- Trustpilot API
- Better Business Bureau (BBB) API
- Facebook Graph API
- Thumbtack (manual/scraper)

Setup:
1. Install dependencies:
   pip install requests python-dotenv

2. Add API keys to .env file (see .env.example)

3. Run the script:
   python scripts/fetch_reviews.py

API Key Sources:
- Google Places: https://console.cloud.google.com/ (enable "Places API")
- Yelp Fusion: https://www.yelp.com/developers/v3/manage_app
- Trustpilot: https://developers.trustpilot.com/ (requires business account)
- BBB: https://developer.bbb.org/
- Facebook: https://developers.facebook.com/ (requires page access token)
- Thumbtack: https://developers.thumbtack.com/ (partner program)
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional
from urllib.parse import quote

try:
    import requests
except ImportError:
    print("Please install requests: pip install requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional

# =============================================================================
# Configuration
# =============================================================================

# API Keys (from environment variables)
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY') or os.environ.get('GOOGLE_MAPS_API_KEY')
YELP_API_KEY = os.environ.get('YELP_API_KEY')
TRUSTPILOT_API_KEY = os.environ.get('TRUSTPILOT_API_KEY')
TRUSTPILOT_API_SECRET = os.environ.get('TRUSTPILOT_API_SECRET')
BBB_API_KEY = os.environ.get('BBB_API_KEY')
FACEBOOK_ACCESS_TOKEN = os.environ.get('FACEBOOK_ACCESS_TOKEN')
THUMBTACK_API_KEY = os.environ.get('THUMBTACK_API_KEY')

# Business identifiers
GOOGLE_PLACE_ID = os.environ.get('GOOGLE_PLACE_ID')
YELP_BUSINESS_ID = os.environ.get('YELP_BUSINESS_ID', 'rapid-panda-movers-miami')
TRUSTPILOT_BUSINESS_UNIT_ID = os.environ.get('TRUSTPILOT_BUSINESS_UNIT_ID')
BBB_BUSINESS_ID = os.environ.get('BBB_BUSINESS_ID')
FACEBOOK_PAGE_ID = os.environ.get('FACEBOOK_PAGE_ID')

# Business info for searching
BUSINESS_NAME = "Rapid Panda Movers"
BUSINESS_LOCATION = "Miami, FL"

# =============================================================================
# Service and Location Detection
# =============================================================================

SERVICE_KEYWORDS = {
    'local-moving': ['local', 'across town', 'same city', 'nearby', 'neighborhood', 'within miami'],
    'long-distance-moving': ['long distance', 'cross country', 'interstate', 'out of state',
                             'to new york', 'to atlanta', 'to chicago', 'to orlando', 'to tampa',
                             'to jacksonville', 'to charlotte', 'to houston', 'to dallas',
                             'from miami to', 'miles away', 'cross-country'],
    'packing-services': ['pack', 'packing', 'packed', 'boxes', 'wrapped', 'bubble wrap',
                         'labeling', 'unpacking', 'boxing'],
    'commercial-moving': ['office', 'commercial', 'business', 'company', 'corporate',
                          'restaurant', 'medical', 'dental', 'law firm', 'warehouse'],
    'apartment-moving': ['apartment', 'condo', 'studio', 'high-rise', 'elevator', 'building',
                         'flat', 'unit', 'floor'],
    'storage-solutions': ['storage', 'stored', 'warehouse', 'climate controlled', 'storing'],
}

LOCATION_KEYWORDS = {
    'miami': ['miami', 'dade county'],
    'miami-beach': ['miami beach', 'south beach', 'north beach'],
    'brickell': ['brickell'],
    'downtown': ['downtown miami'],
    'coral-gables': ['coral gables'],
    'doral': ['doral'],
    'hialeah': ['hialeah'],
    'kendall': ['kendall'],
    'coconut-grove': ['coconut grove', 'the grove'],
    'wynwood': ['wynwood'],
    'little-havana': ['little havana'],
    'little-haiti': ['little haiti'],
    'aventura': ['aventura'],
    'homestead': ['homestead'],
    'fort-lauderdale': ['fort lauderdale', 'ft lauderdale'],
    'pembroke-pines': ['pembroke pines'],
    'hollywood': ['hollywood fl', 'hollywood,'],
    'coral-springs': ['coral springs'],
    'pompano-beach': ['pompano beach'],
    'boca-raton': ['boca raton'],
    'west-palm-beach': ['west palm beach', 'palm beach'],
}


def extract_services(text: str) -> list:
    """Extract service types from review text."""
    text_lower = text.lower()
    services = []

    for service, keywords in SERVICE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                if service not in services:
                    services.append(service)
                break

    # Default to local-moving if no specific service detected but mentions moving
    if not services and any(word in text_lower for word in ['move', 'moved', 'moving', 'movers', 'relocation']):
        services.append('local-moving')

    return services


def extract_location(text: str) -> dict:
    """Extract location from review text."""
    text_lower = text.lower()

    for city, keywords in LOCATION_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                return {'city': city, 'neighborhood': None, 'zip': None}

    return {'city': 'miami', 'neighborhood': None, 'zip': None}


def extract_route(text: str) -> Optional[str]:
    """Extract route from review text if it mentions origin and destination."""
    text_lower = text.lower()

    route_patterns = [
        r'from\s+(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)',
        r'moved\s+(?:from\s+)?(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)',
        r'(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)\s+move',
    ]

    for pattern in route_patterns:
        match = re.search(pattern, text_lower)
        if match:
            origin = match.group(1).strip().replace(' ', '-')
            destination = match.group(2).strip().replace(' ', '-')
            # Filter out common non-location words
            skip_words = ['the', 'my', 'our', 'new', 'old', 'a', 'an']
            if origin not in skip_words and destination not in skip_words and origin != destination:
                return f"{origin}-to-{destination}"

    return None


# =============================================================================
# Google Places API
# =============================================================================

def fetch_google_reviews() -> list:
    """Fetch reviews from Google Places API."""
    if not GOOGLE_PLACES_API_KEY:
        print("⚠️  GOOGLE_PLACES_API_KEY not set, skipping Google reviews")
        return []

    reviews = []
    place_id = GOOGLE_PLACE_ID

    # Search for place ID if not provided
    if not place_id:
        print("🔍 Searching for Google Place ID...")
        search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
        params = {
            'input': f"{BUSINESS_NAME} {BUSINESS_LOCATION}",
            'inputtype': 'textquery',
            'fields': 'place_id,name',
            'key': GOOGLE_PLACES_API_KEY
        }

        try:
            response = requests.get(search_url, params=params, timeout=10)
            data = response.json()

            if data.get('candidates'):
                place_id = data['candidates'][0]['place_id']
                print(f"✅ Found Place ID: {place_id}")
            else:
                print("❌ Could not find Google Place ID")
                return []
        except Exception as e:
            print(f"❌ Error searching for place: {e}")
            return []

    # Fetch place details with reviews
    print("📥 Fetching Google reviews...")
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        'place_id': place_id,
        'fields': 'name,rating,user_ratings_total,reviews',
        'reviews_sort': 'newest',
        'key': GOOGLE_PLACES_API_KEY
    }

    try:
        response = requests.get(details_url, params=params, timeout=10)
        data = response.json()

        if data.get('status') != 'OK':
            print(f"❌ Google API error: {data.get('status')}")
            return []

        result = data.get('result', {})
        google_reviews = result.get('reviews', [])

        print(f"✅ Found {len(google_reviews)} Google reviews")
        print(f"   Overall rating: {result.get('rating')} ({result.get('user_ratings_total')} total)")

        for review in google_reviews:
            timestamp = review.get('time', 0)
            date_str = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')

            reviews.append({
                'author': review.get('author_name', 'Anonymous'),
                'rating': review.get('rating', 5),
                'text': review.get('text', ''),
                'date': date_str,
                'platform': 'google',
                'verified': True,
            })

    except Exception as e:
        print(f"❌ Error fetching Google reviews: {e}")

    return reviews


# =============================================================================
# Yelp Fusion API
# =============================================================================

def fetch_yelp_reviews() -> list:
    """Fetch reviews from Yelp Fusion API."""
    if not YELP_API_KEY:
        print("⚠️  YELP_API_KEY not set, skipping Yelp reviews")
        return []

    reviews = []
    headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
    business_id = YELP_BUSINESS_ID

    # Search for business if needed
    print("🔍 Searching for Yelp business...")
    search_url = "https://api.yelp.com/v3/businesses/search"
    params = {
        'term': BUSINESS_NAME,
        'location': BUSINESS_LOCATION,
        'limit': 1
    }

    try:
        response = requests.get(search_url, headers=headers, params=params, timeout=10)
        data = response.json()

        if data.get('businesses'):
            business = data['businesses'][0]
            business_id = business['id']
            print(f"✅ Found Yelp business: {business['name']}")
            print(f"   Rating: {business.get('rating')} ({business.get('review_count')} reviews)")
        else:
            print("❌ Could not find Yelp business")
            return []
    except Exception as e:
        print(f"❌ Error searching Yelp: {e}")
        return []

    # Fetch reviews
    print("📥 Fetching Yelp reviews...")
    reviews_url = f"https://api.yelp.com/v3/businesses/{business_id}/reviews"
    params = {'limit': 50, 'sort_by': 'newest'}

    try:
        response = requests.get(reviews_url, headers=headers, params=params, timeout=10)
        data = response.json()

        if 'error' in data:
            print(f"❌ Yelp API error: {data['error'].get('description')}")
            return []

        yelp_reviews = data.get('reviews', [])
        print(f"✅ Found {len(yelp_reviews)} Yelp reviews")

        for review in yelp_reviews:
            date_str = review.get('time_created', '')[:10]
            reviews.append({
                'author': review.get('user', {}).get('name', 'Anonymous'),
                'rating': review.get('rating', 5),
                'text': review.get('text', ''),
                'date': date_str,
                'platform': 'yelp',
                'verified': True,
            })

    except Exception as e:
        print(f"❌ Error fetching Yelp reviews: {e}")

    return reviews


# =============================================================================
# Trustpilot API
# =============================================================================

def fetch_trustpilot_reviews() -> list:
    """Fetch reviews from Trustpilot Business Units API."""
    if not TRUSTPILOT_API_KEY:
        print("⚠️  TRUSTPILOT_API_KEY not set, skipping Trustpilot reviews")
        return []

    reviews = []
    business_unit_id = TRUSTPILOT_BUSINESS_UNIT_ID

    # If no business unit ID, try to find it
    if not business_unit_id:
        print("🔍 Searching for Trustpilot business unit...")
        search_url = "https://api.trustpilot.com/v1/business-units/find"
        params = {'name': 'rapidpandamovers.com'}
        headers = {'apikey': TRUSTPILOT_API_KEY}

        try:
            response = requests.get(search_url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                business_unit_id = data.get('id')
                if business_unit_id:
                    print(f"✅ Found Trustpilot business unit: {business_unit_id}")
                else:
                    print("❌ Business not found on Trustpilot")
                    return []
            else:
                print(f"❌ Trustpilot search failed: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error searching Trustpilot: {e}")
            return []

    # Fetch reviews
    print("📥 Fetching Trustpilot reviews...")
    reviews_url = f"https://api.trustpilot.com/v1/business-units/{business_unit_id}/reviews"
    headers = {'apikey': TRUSTPILOT_API_KEY}
    params = {'perPage': 100, 'orderBy': 'createdat.desc'}

    try:
        response = requests.get(reviews_url, headers=headers, params=params, timeout=10)
        if response.status_code != 200:
            print(f"❌ Trustpilot API error: {response.status_code}")
            return []

        data = response.json()
        trustpilot_reviews = data.get('reviews', [])
        print(f"✅ Found {len(trustpilot_reviews)} Trustpilot reviews")

        for review in trustpilot_reviews:
            date_str = review.get('createdAt', '')[:10]
            reviews.append({
                'author': review.get('consumer', {}).get('displayName', 'Anonymous'),
                'rating': review.get('stars', 5),
                'text': review.get('text', ''),
                'date': date_str,
                'platform': 'trustpilot',
                'verified': review.get('isVerified', False),
            })

    except Exception as e:
        print(f"❌ Error fetching Trustpilot reviews: {e}")

    return reviews


# =============================================================================
# Better Business Bureau (BBB) API
# =============================================================================

def fetch_bbb_reviews() -> list:
    """Fetch reviews from BBB API."""
    if not BBB_API_KEY:
        print("⚠️  BBB_API_KEY not set, skipping BBB reviews")
        return []

    reviews = []
    business_id = BBB_BUSINESS_ID

    # Search for business if no ID provided
    if not business_id:
        print("🔍 Searching for BBB business...")
        search_url = "https://api.bbb.org/api/orgs/search"
        headers = {'Authorization': f'Bearer {BBB_API_KEY}'}
        params = {
            'PrimaryOrganizationName': BUSINESS_NAME,
            'City': 'Miami',
            'StateProvince': 'FL'
        }

        try:
            response = requests.get(search_url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                results = data.get('SearchResults', [])
                if results:
                    business_id = results[0].get('BusinessId')
                    print(f"✅ Found BBB business: {business_id}")
                else:
                    print("❌ Business not found on BBB")
                    return []
            else:
                print(f"❌ BBB search failed: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error searching BBB: {e}")
            return []

    # Fetch reviews
    print("📥 Fetching BBB reviews...")
    reviews_url = f"https://api.bbb.org/api/orgs/{business_id}/reviews"
    headers = {'Authorization': f'Bearer {BBB_API_KEY}'}

    try:
        response = requests.get(reviews_url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"❌ BBB API error: {response.status_code}")
            return []

        data = response.json()
        bbb_reviews = data.get('Reviews', [])
        print(f"✅ Found {len(bbb_reviews)} BBB reviews")

        for review in bbb_reviews:
            date_str = review.get('ReviewDate', '')[:10]
            # BBB uses letter grades, convert to stars
            grade = review.get('ReviewGrade', 'A')
            rating = {'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1}.get(grade[0].upper(), 5)

            reviews.append({
                'author': review.get('ReviewerName', 'Anonymous'),
                'rating': rating,
                'text': review.get('ReviewText', ''),
                'date': date_str,
                'platform': 'bbb',
                'verified': True,
            })

    except Exception as e:
        print(f"❌ Error fetching BBB reviews: {e}")

    return reviews


# =============================================================================
# Facebook Graph API
# =============================================================================

def fetch_facebook_reviews() -> list:
    """Fetch reviews from Facebook Graph API."""
    if not FACEBOOK_ACCESS_TOKEN:
        print("⚠️  FACEBOOK_ACCESS_TOKEN not set, skipping Facebook reviews")
        return []

    if not FACEBOOK_PAGE_ID:
        print("⚠️  FACEBOOK_PAGE_ID not set, skipping Facebook reviews")
        return []

    reviews = []

    print("📥 Fetching Facebook reviews...")
    # Facebook ratings endpoint
    url = f"https://graph.facebook.com/v18.0/{FACEBOOK_PAGE_ID}/ratings"
    params = {
        'access_token': FACEBOOK_ACCESS_TOKEN,
        'fields': 'reviewer,created_time,rating,review_text,recommendation_type',
        'limit': 100
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code != 200:
            error = response.json().get('error', {})
            print(f"❌ Facebook API error: {error.get('message', response.status_code)}")
            return []

        data = response.json()
        fb_reviews = data.get('data', [])
        print(f"✅ Found {len(fb_reviews)} Facebook reviews")

        for review in fb_reviews:
            date_str = review.get('created_time', '')[:10]
            # Facebook now uses recommendations (positive/negative)
            rec_type = review.get('recommendation_type', 'positive')
            rating = 5 if rec_type == 'positive' else 2

            # If there's a numeric rating, use it
            if 'rating' in review:
                rating = review['rating']

            reviews.append({
                'author': review.get('reviewer', {}).get('name', 'Facebook User'),
                'rating': rating,
                'text': review.get('review_text', ''),
                'date': date_str,
                'platform': 'facebook',
                'verified': True,
            })

    except Exception as e:
        print(f"❌ Error fetching Facebook reviews: {e}")

    return reviews


# =============================================================================
# Processing and Output
# =============================================================================

def process_reviews(raw_reviews: list) -> list:
    """Process raw reviews and add extracted metadata."""
    processed = []
    seen_texts = set()  # Deduplicate by review text

    for i, review in enumerate(raw_reviews):
        text = review.get('text', '').strip()

        # Skip empty or very short reviews
        if len(text) < 20:
            continue

        # Skip duplicates
        text_hash = hash(text[:100])
        if text_hash in seen_texts:
            continue
        seen_texts.add(text_hash)

        processed_review = {
            'id': str(i + 1),
            'author': review['author'],
            'rating': review['rating'],
            'text': text,
            'date': review['date'],
            'platform': review['platform'],
            'verified': review.get('verified', True),
            'location': extract_location(text),
            'services': extract_services(text),
            'route': extract_route(text),
        }

        processed.append(processed_review)

    return processed


def calculate_stats(reviews: list) -> dict:
    """Calculate review statistics."""
    if not reviews:
        return {'total_reviews': 0, 'average_rating': 0, 'five_star_percentage': 0}

    total = len(reviews)
    avg_rating = sum(r['rating'] for r in reviews) / total
    five_star = sum(1 for r in reviews if r['rating'] == 5)

    return {
        'total_reviews': total,
        'average_rating': round(avg_rating, 1),
        'five_star_percentage': round((five_star / total) * 100)
    }


def main():
    print("=" * 60)
    print("📝 Rapid Panda Movers - Multi-Platform Review Fetcher")
    print("=" * 60)
    print()

    all_reviews = []
    platform_counts = {}

    # Fetch from all platforms
    fetchers = [
        ('Google', fetch_google_reviews),
        ('Yelp', fetch_yelp_reviews),
        ('Trustpilot', fetch_trustpilot_reviews),
        ('BBB', fetch_bbb_reviews),
        ('Facebook', fetch_facebook_reviews),
    ]

    for name, fetcher in fetchers:
        reviews = fetcher()
        platform_counts[name] = len(reviews)
        all_reviews.extend(reviews)
        print()

    if not all_reviews:
        print("=" * 60)
        print("❌ No reviews fetched. Please check your API keys.")
        print()
        print("Required environment variables:")
        print("  GOOGLE_PLACES_API_KEY  - Google Places API key")
        print("  YELP_API_KEY           - Yelp Fusion API key")
        print("  TRUSTPILOT_API_KEY     - Trustpilot API key (business account)")
        print("  BBB_API_KEY            - Better Business Bureau API key")
        print("  FACEBOOK_ACCESS_TOKEN  - Facebook Page access token")
        print("  FACEBOOK_PAGE_ID       - Your Facebook Page ID")
        print()
        print("API Documentation:")
        print("  Google: https://console.cloud.google.com/")
        print("  Yelp: https://www.yelp.com/developers/v3/manage_app")
        print("  Trustpilot: https://developers.trustpilot.com/")
        print("  BBB: https://developer.bbb.org/")
        print("  Facebook: https://developers.facebook.com/")
        print("=" * 60)
        return

    # Process reviews
    print("🔄 Processing reviews...")
    processed_reviews = process_reviews(all_reviews)

    # Sort by date (newest first)
    processed_reviews.sort(key=lambda x: x['date'], reverse=True)

    # Re-assign IDs after sorting
    for i, review in enumerate(processed_reviews):
        review['id'] = str(i + 1)

    # Build output
    output = {
        'reviews': processed_reviews,
        'platforms': {
            'google': {
                'name': 'Google',
                'icon': 'google',
                'color': '#4285F4',
                'url': 'https://www.google.com/maps/place/Rapid+Panda+Movers'
            },
            'yelp': {
                'name': 'Yelp',
                'icon': 'yelp',
                'color': '#D32323',
                'url': 'https://www.yelp.com/biz/rapid-panda-movers-miami'
            },
            'trustpilot': {
                'name': 'Trustpilot',
                'icon': 'trustpilot',
                'color': '#00B67A',
                'url': 'https://www.trustpilot.com/review/rapidpandamovers.com'
            },
            'bbb': {
                'name': 'BBB',
                'icon': 'bbb',
                'color': '#005A78',
                'url': 'https://www.bbb.org/us/fl/miami/profile/moving-companies/rapid-panda-movers'
            },
            'facebook': {
                'name': 'Facebook',
                'icon': 'facebook',
                'color': '#1877F2',
                'url': 'https://www.facebook.com/rapidpandamovers'
            },
            'thumbtack': {
                'name': 'Thumbtack',
                'icon': 'thumbtack',
                'color': '#009FD9',
                'url': 'https://www.thumbtack.com/fl/miami/movers/'
            },
            'consumeraffairs': {
                'name': 'ConsumerAffairs',
                'icon': 'consumeraffairs',
                'color': '#ED7430',
                'url': 'https://www.consumeraffairs.com/movers/'
            },
            'hireahelper': {
                'name': 'HireAHelper',
                'icon': 'hireahelper',
                'color': '#00A3E0',
                'url': 'https://www.hireahelper.com/'
            },
            'angi': {
                'name': 'Angi',
                'icon': 'angi',
                'color': '#FF5722',
                'url': 'https://www.angi.com/'
            },
            'moverscom': {
                'name': 'Movers.com',
                'icon': 'moverscom',
                'color': '#1E88E5',
                'url': 'https://www.movers.com/'
            }
        },
        'stats': calculate_stats(processed_reviews)
    }

    # Write output
    output_path = Path(__file__).parent.parent / 'data' / 'reviews.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    # Summary
    print("=" * 60)
    print("✅ Reviews saved to data/reviews.json")
    print()
    print("📊 Summary:")
    print(f"   Total reviews: {len(processed_reviews)}")
    for name, count in platform_counts.items():
        if count > 0:
            print(f"   {name}: {count}")
    print()
    print(f"   Average rating: {output['stats']['average_rating']}")
    print(f"   5-star reviews: {output['stats']['five_star_percentage']}%")
    print("=" * 60)

    # Show sample
    if processed_reviews:
        print()
        print("📋 Sample review:")
        sample = processed_reviews[0]
        print(f"   Author: {sample['author']}")
        print(f"   Rating: {'⭐' * sample['rating']}")
        print(f"   Platform: {sample['platform']}")
        print(f"   Services: {', '.join(sample['services']) if sample['services'] else 'N/A'}")
        print(f"   Text: {sample['text'][:100]}...")


if __name__ == '__main__':
    main()
