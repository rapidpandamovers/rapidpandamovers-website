#!/usr/bin/env python3
"""
Update drive times in route CSV files using Google Maps Distance Matrix API.

Usage:
    1. Add your API key to .env file:
       GOOGLE_MAPS_API_KEY=your-api-key

    2. Run the script:
       source .venv/bin/activate
       python scripts/update_drive_times.py              # Update both files
       python scripts/update_drive_times.py --local      # Update local_routes.csv only
       python scripts/update_drive_times.py --long-distance  # Update long_distance_routes.csv only

Prerequisites:
    pip install googlemaps python-dotenv
"""

import argparse
import csv
import os
import sys
import time
from typing import Dict, List, Tuple

try:
    from dotenv import load_dotenv
    # Load .env file from project root
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    load_dotenv(env_path)
except ImportError:
    pass  # dotenv is optional, can use environment variables directly

try:
    import googlemaps
except ImportError:
    print("Error: googlemaps package not installed.")
    print("Install with: pip install googlemaps")
    sys.exit(1)

# Company headquarters address
COMPANY_HQ = "7001 North Waterway Dr, Miami, FL 33155"

# Rate limiting: Google allows 1000 elements per 10 seconds
# Being conservative with 25 destinations per batch + delays
BATCH_SIZE = 25
DELAY_BETWEEN_BATCHES = 1.0  # seconds


def get_api_key() -> str:
    """Get Google Maps API key from environment or .env file."""
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        print("Error: GOOGLE_MAPS_API_KEY not found.")
        print("Add it to your .env file:")
        print("  GOOGLE_MAPS_API_KEY=your-api-key")
        sys.exit(1)
    return api_key


def zip_to_address(zip_code: str) -> str:
    """Convert a zip code to an address string for the API."""
    # Just use zip code - US zip codes are unique and Google Maps resolves them correctly
    return f"{zip_code}, USA"


def extract_unique_routes(csv_path: str) -> Dict[str, Tuple[str, str]]:
    """
    Extract unique routes from CSV by slug.
    Returns dict: {slug: (origin_zip, destination_zip)}
    """
    routes = {}
    with open(csv_path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row['slug']
            if slug not in routes:
                routes[slug] = (row['origin_zip'], row['destination_zip'])
    return routes


def fetch_distances_batch(
    gmaps: googlemaps.Client,
    origin: str,
    destinations: List[str]
) -> List[Dict]:
    """
    Fetch distance matrix for one origin to multiple destinations.
    Returns list of {distance_mi, drive_time_min} dicts (or None for failures).
    """
    results = []

    try:
        response = gmaps.distance_matrix(
            origins=[origin],
            destinations=destinations,
            mode="driving",
            units="imperial"
        )

        if response['status'] != 'OK':
            print(f"  API error: {response['status']}")
            return [None] * len(destinations)

        elements = response['rows'][0]['elements']
        for elem in elements:
            if elem['status'] == 'OK':
                # Distance in meters, convert to miles
                distance_m = elem['distance']['value']
                distance_mi = round(distance_m / 1609.344, 1)

                # Duration in seconds, convert to minutes
                duration_s = elem['duration']['value']
                drive_time_min = round(duration_s / 60)

                results.append({
                    'distance_mi': distance_mi,
                    'drive_time_min': drive_time_min
                })
            else:
                print(f"  Element error: {elem['status']}")
                results.append(None)

    except Exception as e:
        print(f"  API exception: {e}")
        return [None] * len(destinations)

    return results


def fetch_company_travel_times(
    gmaps: googlemaps.Client,
    destinations: List[str]
) -> List[int]:
    """
    Fetch travel times from company HQ to destinations.
    Returns list of travel times in minutes (or None for failures).
    """
    results = []

    # Process in batches
    for i in range(0, len(destinations), BATCH_SIZE):
        batch = destinations[i:i + BATCH_SIZE]
        print(f"  Fetching company travel times batch {i // BATCH_SIZE + 1}...")

        try:
            response = gmaps.distance_matrix(
                origins=[COMPANY_HQ],
                destinations=batch,
                mode="driving",
                units="imperial"
            )

            if response['status'] != 'OK':
                print(f"  API error: {response['status']}")
                results.extend([None] * len(batch))
                continue

            elements = response['rows'][0]['elements']
            for elem in elements:
                if elem['status'] == 'OK':
                    duration_s = elem['duration']['value']
                    results.append(round(duration_s / 60))
                else:
                    results.append(None)

        except Exception as e:
            print(f"  API exception: {e}")
            results.extend([None] * len(batch))

        if i + BATCH_SIZE < len(destinations):
            time.sleep(DELAY_BETWEEN_BATCHES)

    return results


def update_csv_with_times(
    csv_path: str,
    route_times: Dict[str, Dict],
    include_company_travel: bool = False
):
    """
    Update CSV file with new drive times.
    route_times: {slug: {distance_mi, drive_time_min, company_travel_time_min}}
    """
    # Read all rows
    rows = []
    with open(csv_path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)

    # Update rows
    updated_count = 0
    for row in rows:
        slug = row['slug']
        if slug in route_times and route_times[slug] is not None:
            times = route_times[slug]
            row['distance_mi'] = times['distance_mi']
            row['drive_time_min'] = times['drive_time_min']
            if include_company_travel and 'company_travel_time_min' in times:
                row['company_travel_time_min'] = times['company_travel_time_min']
            updated_count += 1

    # Write back
    with open(csv_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return updated_count


def process_routes_file(
    gmaps: googlemaps.Client,
    csv_path: str,
    include_company_travel: bool = False
):
    """Process a single routes CSV file."""
    print(f"\nProcessing: {csv_path}")

    # Extract unique routes
    routes = extract_unique_routes(csv_path)
    print(f"  Found {len(routes)} unique routes")

    # Prepare all unique destination addresses
    # Group routes by origin for efficient batching
    routes_by_origin: Dict[str, List[Tuple[str, str]]] = {}  # {origin_zip: [(slug, dest_zip), ...]}
    for slug, (origin_zip, dest_zip) in routes.items():
        if origin_zip not in routes_by_origin:
            routes_by_origin[origin_zip] = []
        routes_by_origin[origin_zip].append((slug, dest_zip))

    # Fetch distances for each origin
    route_times: Dict[str, Dict] = {}
    total_api_calls = 0

    for origin_zip, route_list in routes_by_origin.items():
        origin_addr = zip_to_address(origin_zip)
        print(f"  Processing origin: {origin_zip} ({len(route_list)} destinations)")

        # Process destinations in batches
        for i in range(0, len(route_list), BATCH_SIZE):
            batch = route_list[i:i + BATCH_SIZE]
            dest_addresses = [zip_to_address(dest_zip) for slug, dest_zip in batch]

            print(f"    Batch {i // BATCH_SIZE + 1}: {len(batch)} destinations")
            results = fetch_distances_batch(gmaps, origin_addr, dest_addresses)
            total_api_calls += 1

            # Store results
            for j, (slug, dest_zip) in enumerate(batch):
                if results[j] is not None:
                    route_times[slug] = results[j]
                else:
                    print(f"    Warning: No result for {slug}")

            # Rate limiting
            if i + BATCH_SIZE < len(route_list):
                time.sleep(DELAY_BETWEEN_BATCHES)

    # Fetch company travel times if needed
    if include_company_travel:
        print("  Fetching company travel times...")
        # Get all unique origin zip codes
        origin_zips = list(set(origin_zip for origin_zip, _ in routes.values()))
        origin_addresses = [zip_to_address(z) for z in origin_zips]

        travel_times = fetch_company_travel_times(gmaps, origin_addresses)
        zip_to_travel_time = dict(zip(origin_zips, travel_times))

        # Add company travel time to route_times
        for slug, (origin_zip, _) in routes.items():
            if slug in route_times and origin_zip in zip_to_travel_time:
                route_times[slug]['company_travel_time_min'] = zip_to_travel_time[origin_zip]

    # Update CSV
    print("  Updating CSV file...")
    updated = update_csv_with_times(csv_path, route_times, include_company_travel)
    print(f"  Updated {updated} rows")
    print(f"  Total API calls: {total_api_calls}")

    return len(routes), total_api_calls


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Update drive times in route CSV files using Google Maps Distance Matrix API"
    )
    parser.add_argument(
        "--local",
        action="store_true",
        help="Update only local_routes.csv"
    )
    parser.add_argument(
        "--long-distance",
        action="store_true",
        help="Update only long_distance_routes.csv"
    )
    args = parser.parse_args()

    # If neither flag specified, update both
    update_local = args.local or (not args.local and not args.long_distance)
    update_long_distance = args.long_distance or (not args.local and not args.long_distance)

    print("=" * 60)
    print("Route Drive Time Updater")
    print("Using Google Maps Distance Matrix API")
    print("=" * 60)

    # Get API key
    api_key = get_api_key()
    gmaps = googlemaps.Client(key=api_key)

    # Verify API key works
    print("\nVerifying API key...")
    try:
        test_result = gmaps.distance_matrix(
            origins=["Miami, FL"],
            destinations=["Fort Lauderdale, FL"],
            mode="driving"
        )
        if test_result['status'] != 'OK':
            print(f"API test failed: {test_result['status']}")
            sys.exit(1)
        print("  API key verified!")
    except Exception as e:
        print(f"API test failed: {e}")
        sys.exit(1)

    # Get script directory and data paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), 'data')

    local_csv = os.path.join(data_dir, 'local_routes.csv')
    long_distance_csv = os.path.join(data_dir, 'long_distance_routes.csv')

    total_routes = 0
    total_calls = 0

    # Process local routes (includes company travel time)
    if update_local:
        if os.path.exists(local_csv):
            routes, calls = process_routes_file(gmaps, local_csv, include_company_travel=True)
            total_routes += routes
            total_calls += calls
        else:
            print(f"\nWarning: {local_csv} not found")

    # Process long distance routes
    if update_long_distance:
        if os.path.exists(long_distance_csv):
            routes, calls = process_routes_file(gmaps, long_distance_csv, include_company_travel=False)
            total_routes += routes
            total_calls += calls
        else:
            print(f"\nWarning: {long_distance_csv} not found")

    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Total unique routes processed: {total_routes}")
    print(f"Total API calls made: {total_calls}")
    print(f"Estimated cost: ${total_routes * 0.005:.2f}")
    print("\nDone!")


if __name__ == "__main__":
    main()
