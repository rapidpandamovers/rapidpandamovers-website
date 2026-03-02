#!/usr/bin/env python3
"""
Convert route CSV files back to JSON format.

Usage:
    python scripts/csv_to_json.py
"""

import csv
import json
import os

def csv_to_json(csv_path: str, json_path: str, is_local: bool = True):
    """Convert a routes CSV file to JSON format."""

    # Read CSV and group by slug
    routes_by_slug = {}

    with open(csv_path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row['slug']
            house_size = row['house_size']

            if slug not in routes_by_slug:
                # Build route dict with fields in desired order
                route = {
                    'route_type': row['route_type'],
                    'origin_name': row['origin_name'],
                    'origin_zip': row['origin_zip'],
                    'destination_name': row['destination_name'],
                    'destination_zip': row['destination_zip'],
                    'distance_mi': float(row['distance_mi']),
                    'drive_time_min': int(row['drive_time_min']),
                }
                if is_local:
                    route['company_travel_time_min'] = int(row['company_travel_time_min'])

                route['slug'] = slug
                route['is_active'] = row['is_active'] == 'True'
                route['house_sizes'] = {}

                routes_by_slug[slug] = route

            # Add house size data
            routes_by_slug[slug]['house_sizes'][house_size] = {
                'min_cost': int(row['min_cost']),
                'max_cost': int(row['max_cost']),
                'avg_cost': int(row['avg_cost']),
                'movers': int(row['movers']),
                'trucks': int(row['trucks']),
                'min_hours': float(row['min_hours']),
                'max_hours': float(row['max_hours'])
            }

    # Convert to list and sort by slug
    routes = sorted(routes_by_slug.values(), key=lambda x: x['slug'])

    # Write JSON
    with open(json_path, 'w') as f:
        json.dump(routes, f, indent=2)

    return len(routes)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), 'data')

    # Convert local routes
    local_csv = os.path.join(data_dir, 'local_routes.csv')
    local_json = os.path.join(data_dir, 'local_routes.json')
    if os.path.exists(local_csv):
        count = csv_to_json(local_csv, local_json, is_local=True)
        print(f"local_routes.json: {count} routes")

    # Convert long distance routes
    ld_csv = os.path.join(data_dir, 'long_distance_routes.csv')
    ld_json = os.path.join(data_dir, 'long_distance_routes.json')
    if os.path.exists(ld_csv):
        count = csv_to_json(ld_csv, ld_json, is_local=False)
        print(f"long_distance_routes.json: {count} routes")

    print("Done!")


if __name__ == "__main__":
    main()
