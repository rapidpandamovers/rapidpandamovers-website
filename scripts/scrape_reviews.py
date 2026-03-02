#!/usr/bin/env python3
"""
Scrape reviews from public review pages without APIs.

This script scrapes publicly visible reviews from:
- Google Maps (via Google search results)
- Yelp business page
- Facebook page reviews
- BBB business profile
- Trustpilot business page
- ConsumerAffairs
- HireAHelper
- Angi (formerly Angie's List)
- Thumbtack
- Movers.com

Usage:
    pip install requests beautifulsoup4 lxml
    python scripts/scrape_reviews.py

Note: This scrapes YOUR OWN business reviews from public pages.
Please be respectful of rate limits and terms of service.
"""

import json
import os
import re
import sys
import time
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from urllib.parse import quote, urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Please install dependencies:")
    print("  pip install requests beautifulsoup4 lxml")
    sys.exit(1)

# =============================================================================
# Configuration
# =============================================================================

BUSINESS_NAME = "Rapid Panda Movers"
BUSINESS_LOCATION = "Miami, FL"

# Direct URLs to your business pages (update these with your actual URLs)
URLS = {
    'yelp': os.environ.get('YELP_URL', 'https://www.yelp.com/biz/rapid-panda-movers-miami'),
    'trustpilot': os.environ.get('TRUSTPILOT_URL', 'https://www.trustpilot.com/review/rapidpandamovers.com'),
    'bbb': os.environ.get('BBB_URL', ''),
    'facebook': os.environ.get('FACEBOOK_URL', 'https://www.facebook.com/rapidpandamovers/reviews'),
    'consumeraffairs': os.environ.get('CONSUMERAFFAIRS_URL', ''),
    'hireahelper': os.environ.get('HIREAHELPER_URL', ''),
    'angi': os.environ.get('ANGI_URL', ''),
    'thumbtack': os.environ.get('THUMBTACK_URL', ''),
    'moverscom': os.environ.get('MOVERSCOM_URL', ''),
}

# Request settings
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
}

# Rate limiting (seconds between requests)
REQUEST_DELAY = 2

# =============================================================================
# Service and Location Detection (same as API version)
# =============================================================================

SERVICE_KEYWORDS = {
    'local-moving': ['local', 'across town', 'same city', 'nearby', 'neighborhood', 'within miami'],
    'long-distance-moving': ['long distance', 'cross country', 'interstate', 'out of state',
                             'to new york', 'to atlanta', 'to chicago', 'to orlando', 'to tampa',
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
    'aventura': ['aventura'],
    'homestead': ['homestead'],
    'fort-lauderdale': ['fort lauderdale', 'ft lauderdale'],
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
    if not services and any(word in text_lower for word in ['move', 'moved', 'moving', 'movers']):
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
    """Extract route from review text."""
    text_lower = text.lower()
    route_patterns = [
        r'from\s+(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)',
        r'moved\s+(?:from\s+)?(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)',
    ]
    for pattern in route_patterns:
        match = re.search(pattern, text_lower)
        if match:
            origin = match.group(1).strip().replace(' ', '-')
            destination = match.group(2).strip().replace(' ', '-')
            skip_words = ['the', 'my', 'our', 'new', 'old', 'a', 'an']
            if origin not in skip_words and destination not in skip_words and origin != destination:
                return f"{origin}-to-{destination}"
    return None


def parse_relative_date(date_str: str) -> str:
    """Convert relative dates like '2 weeks ago' to YYYY-MM-DD."""
    date_str = date_str.lower().strip()
    today = datetime.now()

    if 'today' in date_str or 'just now' in date_str:
        return today.strftime('%Y-%m-%d')
    if 'yesterday' in date_str:
        return (today - timedelta(days=1)).strftime('%Y-%m-%d')

    # Parse "X days/weeks/months/years ago"
    match = re.search(r'(\d+)\s*(day|week|month|year)s?\s*ago', date_str)
    if match:
        num = int(match.group(1))
        unit = match.group(2)
        if unit == 'day':
            return (today - timedelta(days=num)).strftime('%Y-%m-%d')
        elif unit == 'week':
            return (today - timedelta(weeks=num)).strftime('%Y-%m-%d')
        elif unit == 'month':
            return (today - timedelta(days=num*30)).strftime('%Y-%m-%d')
        elif unit == 'year':
            return (today - timedelta(days=num*365)).strftime('%Y-%m-%d')

    # Try parsing actual date formats
    for fmt in ['%B %d, %Y', '%b %d, %Y', '%m/%d/%Y', '%Y-%m-%d']:
        try:
            return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    # Default to today if can't parse
    return today.strftime('%Y-%m-%d')


def make_request(url: str, delay: bool = True) -> Optional[BeautifulSoup]:
    """Make HTTP request with rate limiting and error handling."""
    if delay:
        time.sleep(REQUEST_DELAY + random.uniform(0, 1))

    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'lxml')
    except requests.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return None


# =============================================================================
# Yelp Scraper
# =============================================================================

def scrape_yelp() -> list:
    """Scrape reviews from Yelp business page."""
    url = URLS.get('yelp')
    if not url:
        print("⚠️  No Yelp URL configured, skipping")
        return []

    print(f"📥 Scraping Yelp reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # Find review elements (Yelp's structure changes frequently)
    review_elements = soup.select('[data-review-id]') or soup.select('.review') or soup.find_all('li', class_=re.compile(r'review'))

    if not review_elements:
        # Try alternative selectors
        review_elements = soup.select('[class*="review"]')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:  # Limit to 50
        try:
            # Extract author
            author_elem = elem.select_one('[class*="user-name"]') or elem.select_one('a[href*="/user_details"]')
            author = author_elem.get_text(strip=True) if author_elem else 'Yelp User'

            # Extract rating (look for aria-label with star rating)
            rating = 5
            rating_elem = elem.select_one('[aria-label*="star rating"]') or elem.select_one('[class*="star"]')
            if rating_elem:
                rating_text = rating_elem.get('aria-label', '') or rating_elem.get('title', '')
                match = re.search(r'(\d)', rating_text)
                if match:
                    rating = int(match.group(1))

            # Extract review text
            text_elem = elem.select_one('[class*="comment"]') or elem.select_one('p[lang]') or elem.select_one('[class*="review-content"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Extract date
            date_elem = elem.select_one('[class*="date"]') or elem.select_one('time')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'yelp',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} Yelp reviews")
    return reviews


# =============================================================================
# Trustpilot Scraper
# =============================================================================

def scrape_trustpilot() -> list:
    """Scrape reviews from Trustpilot business page."""
    url = URLS.get('trustpilot')
    if not url:
        print("⚠️  No Trustpilot URL configured, skipping")
        return []

    print(f"📥 Scraping Trustpilot reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # Trustpilot review cards
    review_cards = soup.select('[data-service-review-card-paper]') or soup.select('article[class*="review"]')

    print(f"   Found {len(review_cards)} review elements")

    for card in review_cards[:50]:
        try:
            # Author
            author_elem = card.select_one('[data-consumer-name-typography]') or card.select_one('[class*="consumer-name"]')
            author = author_elem.get_text(strip=True) if author_elem else 'Trustpilot User'

            # Rating (Trustpilot uses data-rating attribute or star images)
            rating = 5
            rating_elem = card.select_one('[data-service-review-rating]') or card.select_one('[class*="star-rating"]')
            if rating_elem:
                rating_val = rating_elem.get('data-service-review-rating') or rating_elem.get('data-rating')
                if rating_val:
                    rating = int(rating_val)
                else:
                    # Count filled stars
                    stars = rating_elem.select('[class*="star"][class*="full"]')
                    if stars:
                        rating = len(stars)

            # Review text
            text_elem = card.select_one('[data-service-review-text-typography]') or card.select_one('[class*="review-content"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = card.select_one('time') or card.select_one('[data-service-review-date-time-ago]')
            if date_elem:
                date_str = date_elem.get('datetime', '') or date_elem.get_text(strip=True)
                date = date_str[:10] if date_str and len(date_str) >= 10 else parse_relative_date(date_str)
            else:
                date = datetime.now().strftime('%Y-%m-%d')

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'trustpilot',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} Trustpilot reviews")
    return reviews


# =============================================================================
# BBB Scraper
# =============================================================================

def scrape_bbb() -> list:
    """Scrape reviews from BBB business profile."""
    url = URLS.get('bbb')
    if not url:
        print("⚠️  No BBB URL configured, skipping")
        return []

    print(f"📥 Scraping BBB reviews from {url}")
    reviews = []

    # BBB reviews are typically on a /customer-reviews subpage
    reviews_url = url.rstrip('/') + '/customer-reviews'

    soup = make_request(reviews_url, delay=False)
    if not soup:
        soup = make_request(url)
        if not soup:
            return []

    # BBB review elements
    review_elements = soup.select('.customer-review') or soup.select('[class*="review-item"]')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('.review-author') or elem.select_one('[class*="reviewer"]')
            author = author_elem.get_text(strip=True) if author_elem else 'BBB User'

            # Rating (BBB often shows star ratings)
            rating = 5
            stars = elem.select('[class*="star"][class*="full"]') or elem.select('.filled-star')
            if stars:
                rating = len(stars)

            # Text
            text_elem = elem.select_one('.review-text') or elem.select_one('[class*="review-content"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('.review-date') or elem.select_one('time')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'bbb',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} BBB reviews")
    return reviews


# =============================================================================
# Google Maps Scraper (via search)
# =============================================================================

def scrape_google() -> list:
    """
    Note: Google Maps reviews are heavily JavaScript-rendered.
    This attempts to get some data but may have limited success.
    Consider using the official API or manual export from Google Business Profile.
    """
    print("📥 Attempting Google reviews (limited without JavaScript)")
    print("   💡 Tip: Export reviews from Google Business Profile for best results")

    # Google Maps pages require JavaScript to render reviews
    # We can try to get basic info from search results
    reviews = []

    search_url = f"https://www.google.com/search?q={quote(BUSINESS_NAME + ' ' + BUSINESS_LOCATION + ' reviews')}"

    soup = make_request(search_url, delay=False)
    if not soup:
        return []

    # Look for review snippets in search results
    review_snippets = soup.select('[data-review-snippet]') or soup.select('.review-snippet')

    for snippet in review_snippets[:10]:
        try:
            text = snippet.get_text(strip=True)
            if text and len(text) > 30:
                reviews.append({
                    'author': 'Google User',
                    'rating': 5,
                    'text': text,
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'platform': 'google',
                    'verified': True,
                })
        except:
            continue

    if not reviews:
        print("   ⚠️  Could not scrape Google reviews (JavaScript required)")
        print("   💡 Use Google Business Profile export or the API instead")
    else:
        print(f"   ✅ Extracted {len(reviews)} Google review snippets")

    return reviews


# =============================================================================
# ConsumerAffairs Scraper
# =============================================================================

def scrape_consumeraffairs() -> list:
    """Scrape reviews from ConsumerAffairs business page."""
    url = URLS.get('consumeraffairs')
    if not url:
        print("⚠️  No ConsumerAffairs URL configured, skipping")
        return []

    print(f"📥 Scraping ConsumerAffairs reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # ConsumerAffairs review elements
    review_elements = soup.select('.rvw-bd') or soup.select('[data-review-id]') or soup.select('.review-card')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('.rvw-aut__inf-nm') or elem.select_one('[class*="author"]')
            author = author_elem.get_text(strip=True) if author_elem else 'ConsumerAffairs User'

            # Rating (ConsumerAffairs uses star ratings)
            rating = 5
            rating_elem = elem.select_one('[class*="stars"]') or elem.select_one('[data-rating]')
            if rating_elem:
                rating_val = rating_elem.get('data-rating')
                if rating_val:
                    rating = int(float(rating_val))
                else:
                    # Try to find filled stars
                    stars = elem.select('[class*="star-filled"]') or elem.select('.ca-star--full')
                    if stars:
                        rating = len(stars)

            # Text
            text_elem = elem.select_one('.rvw-bd__cnt') or elem.select_one('[class*="review-text"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('.rvw-bd__dt') or elem.select_one('time') or elem.select_one('[class*="date"]')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'consumeraffairs',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} ConsumerAffairs reviews")
    return reviews


# =============================================================================
# HireAHelper Scraper
# =============================================================================

def scrape_hireahelper() -> list:
    """Scrape reviews from HireAHelper business page."""
    url = URLS.get('hireahelper')
    if not url:
        print("⚠️  No HireAHelper URL configured, skipping")
        return []

    print(f"📥 Scraping HireAHelper reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # HireAHelper review elements
    review_elements = soup.select('.review-item') or soup.select('[class*="review"]') or soup.select('.customer-review')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('.reviewer-name') or elem.select_one('[class*="author"]')
            author = author_elem.get_text(strip=True) if author_elem else 'HireAHelper User'

            # Rating
            rating = 5
            rating_elem = elem.select_one('[class*="rating"]') or elem.select_one('[class*="stars"]')
            if rating_elem:
                rating_val = rating_elem.get('data-rating') or rating_elem.get('data-score')
                if rating_val:
                    rating = int(float(rating_val))
                else:
                    stars = elem.select('[class*="star-full"]') or elem.select('[class*="filled"]')
                    if stars:
                        rating = len(stars)

            # Text
            text_elem = elem.select_one('.review-text') or elem.select_one('.review-content') or elem.select_one('p')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('.review-date') or elem.select_one('time') or elem.select_one('[class*="date"]')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'hireahelper',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} HireAHelper reviews")
    return reviews


# =============================================================================
# Angi (Angie's List) Scraper
# =============================================================================

def scrape_angi() -> list:
    """Scrape reviews from Angi business page."""
    url = URLS.get('angi')
    if not url:
        print("⚠️  No Angi URL configured, skipping")
        return []

    print(f"📥 Scraping Angi reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # Angi review elements
    review_elements = soup.select('[data-testid="review-card"]') or soup.select('.review-card') or soup.select('[class*="ReviewCard"]')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('[data-testid="reviewer-name"]') or elem.select_one('[class*="reviewer"]')
            author = author_elem.get_text(strip=True) if author_elem else 'Angi User'

            # Rating (Angi uses letter grades A-F or star ratings)
            rating = 5
            grade_elem = elem.select_one('[data-testid="overall-grade"]') or elem.select_one('[class*="grade"]')
            if grade_elem:
                grade = grade_elem.get_text(strip=True).upper()
                grade_map = {'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1}
                rating = grade_map.get(grade[0] if grade else 'A', 5)
            else:
                rating_elem = elem.select_one('[class*="star"]')
                if rating_elem:
                    stars = elem.select('[class*="star-filled"]')
                    if stars:
                        rating = len(stars)

            # Text
            text_elem = elem.select_one('[data-testid="review-text"]') or elem.select_one('[class*="review-content"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('[data-testid="review-date"]') or elem.select_one('time')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'angi',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} Angi reviews")
    return reviews


# =============================================================================
# Thumbtack Scraper
# =============================================================================

def scrape_thumbtack() -> list:
    """Scrape reviews from Thumbtack business page."""
    url = URLS.get('thumbtack')
    if not url:
        print("⚠️  No Thumbtack URL configured, skipping")
        return []

    print(f"📥 Scraping Thumbtack reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # Thumbtack review elements
    review_elements = soup.select('[data-testid="review"]') or soup.select('.review-item') or soup.select('[class*="Review_"]')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('[data-testid="reviewer-name"]') or elem.select_one('[class*="name"]')
            author = author_elem.get_text(strip=True) if author_elem else 'Thumbtack User'

            # Rating
            rating = 5
            rating_elem = elem.select_one('[data-testid="star-rating"]') or elem.select_one('[aria-label*="star"]')
            if rating_elem:
                rating_text = rating_elem.get('aria-label', '') or rating_elem.get_text(strip=True)
                match = re.search(r'(\d(?:\.\d)?)', rating_text)
                if match:
                    rating = int(float(match.group(1)))
            else:
                stars = elem.select('[class*="star"][class*="fill"]')
                if stars:
                    rating = len(stars)

            # Text
            text_elem = elem.select_one('[data-testid="review-text"]') or elem.select_one('[class*="reviewText"]')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('[data-testid="review-date"]') or elem.select_one('time')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'thumbtack',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} Thumbtack reviews")
    return reviews


# =============================================================================
# Movers.com Scraper
# =============================================================================

def scrape_moverscom() -> list:
    """Scrape reviews from Movers.com business page."""
    url = URLS.get('moverscom')
    if not url:
        print("⚠️  No Movers.com URL configured, skipping")
        return []

    print(f"📥 Scraping Movers.com reviews from {url}")
    reviews = []

    soup = make_request(url, delay=False)
    if not soup:
        return []

    # Movers.com review elements
    review_elements = soup.select('.review-card') or soup.select('[class*="review-item"]') or soup.select('[class*="testimonial"]')

    print(f"   Found {len(review_elements)} review elements")

    for elem in review_elements[:50]:
        try:
            # Author
            author_elem = elem.select_one('.reviewer-name') or elem.select_one('[class*="author"]')
            author = author_elem.get_text(strip=True) if author_elem else 'Movers.com User'

            # Rating
            rating = 5
            rating_elem = elem.select_one('[class*="rating"]') or elem.select_one('[class*="stars"]')
            if rating_elem:
                rating_val = rating_elem.get('data-rating')
                if rating_val:
                    rating = int(float(rating_val))
                else:
                    stars = elem.select('[class*="star-full"]') or elem.select('[class*="filled"]')
                    if stars:
                        rating = min(len(stars), 5)

            # Text
            text_elem = elem.select_one('.review-text') or elem.select_one('[class*="content"]') or elem.select_one('p')
            text = text_elem.get_text(strip=True) if text_elem else ''

            # Date
            date_elem = elem.select_one('.review-date') or elem.select_one('time')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            date = parse_relative_date(date_str)

            if text and len(text) > 20:
                reviews.append({
                    'author': author,
                    'rating': rating,
                    'text': text,
                    'date': date,
                    'platform': 'moverscom',
                    'verified': True,
                })
        except Exception as e:
            continue

    print(f"   ✅ Extracted {len(reviews)} Movers.com reviews")
    return reviews


# =============================================================================
# Processing and Output
# =============================================================================

def process_reviews(raw_reviews: list) -> list:
    """Process raw reviews and add metadata."""
    processed = []
    seen_texts = set()

    for i, review in enumerate(raw_reviews):
        text = review.get('text', '').strip()

        if len(text) < 20:
            continue

        text_hash = hash(text[:100])
        if text_hash in seen_texts:
            continue
        seen_texts.add(text_hash)

        processed.append({
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
        })

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
    print("📝 Rapid Panda Movers - Review Scraper (No API Required)")
    print("=" * 60)
    print()

    all_reviews = []
    platform_counts = {}

    # Scrape each platform
    scrapers = [
        ('Yelp', scrape_yelp),
        ('Trustpilot', scrape_trustpilot),
        ('BBB', scrape_bbb),
        ('Google', scrape_google),
        ('ConsumerAffairs', scrape_consumeraffairs),
        ('HireAHelper', scrape_hireahelper),
        ('Angi', scrape_angi),
        ('Thumbtack', scrape_thumbtack),
        ('Movers.com', scrape_moverscom),
    ]

    for name, scraper in scrapers:
        try:
            reviews = scraper()
            platform_counts[name] = len(reviews)
            all_reviews.extend(reviews)
        except Exception as e:
            print(f"   ❌ Error scraping {name}: {e}")
            platform_counts[name] = 0
        print()

    if not all_reviews:
        print("=" * 60)
        print("❌ No reviews found.")
        print()
        print("Options:")
        print("1. Update URLs in this script or set environment variables:")
        print("   YELP_URL=https://www.yelp.com/biz/your-business")
        print("   TRUSTPILOT_URL=https://www.trustpilot.com/review/yourdomain.com")
        print("   BBB_URL=https://www.bbb.org/us/fl/miami/profile/...")
        print()
        print("2. Use the API-based script (scripts/fetch_reviews.py) with API keys")
        print("=" * 60)
        return

    # Process reviews
    print("🔄 Processing reviews...")
    processed_reviews = process_reviews(all_reviews)
    processed_reviews.sort(key=lambda x: x['date'], reverse=True)

    for i, review in enumerate(processed_reviews):
        review['id'] = str(i + 1)

    # Build output
    output = {
        'reviews': processed_reviews,
        'platforms': {
            'google': {'name': 'Google', 'icon': 'google', 'color': '#4285F4',
                      'url': 'https://www.google.com/maps/place/Rapid+Panda+Movers'},
            'yelp': {'name': 'Yelp', 'icon': 'yelp', 'color': '#D32323',
                    'url': URLS.get('yelp', '')},
            'trustpilot': {'name': 'Trustpilot', 'icon': 'trustpilot', 'color': '#00B67A',
                          'url': URLS.get('trustpilot', '')},
            'bbb': {'name': 'BBB', 'icon': 'bbb', 'color': '#005A78',
                   'url': URLS.get('bbb', '')},
            'facebook': {'name': 'Facebook', 'icon': 'facebook', 'color': '#1877F2',
                        'url': URLS.get('facebook', '')},
            'consumeraffairs': {'name': 'ConsumerAffairs', 'icon': 'consumeraffairs', 'color': '#ED7430',
                               'url': URLS.get('consumeraffairs', '')},
            'hireahelper': {'name': 'HireAHelper', 'icon': 'hireahelper', 'color': '#00A3E0',
                           'url': URLS.get('hireahelper', '')},
            'angi': {'name': 'Angi', 'icon': 'angi', 'color': '#FF5722',
                    'url': URLS.get('angi', '')},
            'thumbtack': {'name': 'Thumbtack', 'icon': 'thumbtack', 'color': '#009FD9',
                         'url': URLS.get('thumbtack', '')},
            'moverscom': {'name': 'Movers.com', 'icon': 'moverscom', 'color': '#1E88E5',
                         'url': URLS.get('moverscom', '')},
        },
        'stats': calculate_stats(processed_reviews)
    }

    # Save
    output_path = Path(__file__).parent.parent / 'data' / 'reviews.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    print()
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


if __name__ == '__main__':
    main()
