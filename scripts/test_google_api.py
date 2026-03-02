#!/usr/bin/env python3
"""
Test Google Maps Distance Matrix API key with a single request.

Usage:
    source .venv/bin/activate
    python scripts/test_google_api.py
"""

import os
import sys

try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    load_dotenv(env_path)
except ImportError:
    pass

try:
    import googlemaps
except ImportError:
    print("Error: googlemaps package not installed.")
    print("Run: source .venv/bin/activate && pip install googlemaps")
    sys.exit(1)


def main():
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        print("Error: GOOGLE_MAPS_API_KEY not found in .env file")
        sys.exit(1)

    print(f"API key found: {api_key[:8]}...{api_key[-4:]}")
    print()

    gmaps = googlemaps.Client(key=api_key)

    # Test with a simple Miami route
    print("Testing: Miami (33101) -> Coral Gables (33134)")
    print("-" * 50)

    try:
        result = gmaps.distance_matrix(
            origins=["33101, FL, USA"],
            destinations=["33134, FL, USA"],
            mode="driving",
            units="imperial"
        )

        if result['status'] != 'OK':
            print(f"API Error: {result['status']}")
            sys.exit(1)

        element = result['rows'][0]['elements'][0]
        if element['status'] != 'OK':
            print(f"Route Error: {element['status']}")
            sys.exit(1)

        # Parse results
        distance_m = element['distance']['value']
        distance_mi = round(distance_m / 1609.344, 1)
        distance_text = element['distance']['text']

        duration_s = element['duration']['value']
        duration_min = round(duration_s / 60)
        duration_text = element['duration']['text']

        print(f"Distance: {distance_mi} mi ({distance_text})")
        print(f"Duration: {duration_min} min ({duration_text})")
        print()
        print("API key is working!")

    except googlemaps.exceptions.ApiError as e:
        print(f"API Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
