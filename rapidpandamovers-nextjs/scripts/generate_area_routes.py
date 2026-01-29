#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate neighborhood → neighborhood routes from your JSON schema.

Updated Pricing Model:
- Base movers: 2 movers × $90/hour (was $40/hour)
- Additional movers: $30/hour each
- Truck: $200/day, days = ceil(total_work_hours / 16)
- Minimum 1 hour transit time
- Deadhead: return drive time included (no extra load/unload)
- Load/Unload hours based on house size requirements only

House Size Categories:
- 1 bedroom (100-800 sq ft): 1 truck, 2 movers, 1-2 loading, 1-2 unloading
- 2 bedroom (800-1200 sq ft): 1 truck, 2 movers, 1-2 loading, 1-2 unloading  
- 3 bedroom (1000-1500 sq ft): 1 truck, 3 movers, 3-4 loading, 2-3 unloading
- 4 bedroom (1500-2000 sq ft): 1 truck, 4 movers, 3-4 loading, 2-3 unloading
- 4+ bedroom (2000+ sq ft): 1+ truck, 4+ movers, 5+ loading, 4+ unloading

Notes:
- Neighborhood coordinates default to parent city lat/lng (as provided).
- Skips city==neighborhood duplicates (e.g., "aventura" city & "Aventura" neighborhood).
- Produces ordered pairs (A→B) with A != B.

Usage:
  python generate_area_routes.py \
    --input areas.json \
    --outcsv area_routes.csv \
    --outjson area_routes.json
"""

import json
import math
import argparse
import pandas as pd
from math import radians, sin, cos, asin, sqrt

def normalize_slug(s: str) -> str:
    return s.strip().lower().replace(" ", "-")

def haversine_miles(lat1, lon1, lat2, lon2):
    R = 3958.8  # miles
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def estimate_drive_miles(gc_miles):
    # Road miles ≈ 1.1 × great-circle miles
    return gc_miles * 1.1

def estimate_drive_time_minutes(road_miles, avg_speed_mph=55.0):
    return int(round((road_miles / avg_speed_mph) * 60))

def calculate_travel_time_with_traffic(road_miles):
    """Calculate travel time considering Miami traffic patterns."""
    # Based on Google Maps data for Miami area with heavy traffic:
    # - Very short distances (< 5 miles): ~20 mph average (lots of lights, traffic)
    # - Short distances (5-15 miles): ~25 mph average  
    # - Medium distances (15-30 miles): ~30 mph average
    # - Long distances (> 30 miles): ~35 mph average
    
    if road_miles < 5:
        # Very short distances - heavy city traffic
        effective_speed = 20.0
    elif road_miles < 15:
        # Short distances - mix of city and some highway
        effective_speed = 25.0
    elif road_miles < 30:
        # Medium distances - more highway but still traffic
        effective_speed = 30.0
    else:
        # Longer distances - mostly highway but Miami traffic
        effective_speed = 35.0
    
    # Add 10% buffer for traffic unpredictability
    traffic_buffer = 1.10
    
    travel_time_hours = (road_miles / effective_speed) * traffic_buffer
    return int(round(travel_time_hours * 60))


def get_house_size_requirements(house_size):
    """Get mover count and load/unload hours for each house size."""
    requirements = {
        "1_bedroom": {
            "movers": 2,
            "loading_hours": (1, 2),
            "unloading_hours": (1, 2),
            "trucks": 1
        },
        "2_bedroom": {
            "movers": 2,
            "loading_hours": (1, 2),
            "unloading_hours": (1, 2),
            "trucks": 1
        },
        "3_bedroom": {
            "movers": 3,
            "loading_hours": (3, 4),
            "unloading_hours": (2, 3),
            "trucks": 1
        },
        "4_bedroom": {
            "movers": 4,
            "loading_hours": (3, 4),
            "unloading_hours": (2, 3),
            "trucks": 1
        },
        "4plus_bedroom": {
            "movers": 4,
            "loading_hours": (5, 6),
            "unloading_hours": (4, 5),
            "trucks": 1
        }
    }
    return requirements.get(house_size, requirements["1_bedroom"])

def compute_cost_for_house_size(drive_time_min, house_size, company_travel_time_min=0):
    """Compute cost range for a specific house size."""
    drive_hours_one_way = max(drive_time_min / 60.0, 1.0)  # Minimum 1 hour transit
    company_travel_hours = company_travel_time_min / 60.0  # Travel time from company to starting city
    
    # Get house size requirements
    req = get_house_size_requirements(house_size)
    
    # Use only house size requirements for load/unload hours
    min_load_h = req["loading_hours"][0]
    max_load_h = req["loading_hours"][1]
    min_unload_h = req["unloading_hours"][0]
    max_unload_h = req["unloading_hours"][1]
    
    # Calculate total hours for min and max scenarios
    # Include company travel time + load + drive + unload + return drive + return to company
    min_total_hours = company_travel_hours + min_load_h + drive_hours_one_way + min_unload_h + drive_hours_one_way + company_travel_hours
    max_total_hours = company_travel_hours + max_load_h + drive_hours_one_way + max_unload_h + drive_hours_one_way + company_travel_hours
    
    # Calculate costs
    min_days = math.ceil(min_total_hours / 16.0)
    max_days = math.ceil(max_total_hours / 16.0)
    
    # Truck cost (per truck per day)
    min_truck_cost = min_days * req["trucks"] * 200.0
    max_truck_cost = max_days * req["trucks"] * 200.0
    
    # Mover costs: base 2 movers at $90/hour, additional at $30/hour
    base_mover_rate = 2 * 90.0  # 2 movers × $90/hour
    additional_movers = max(0, req["movers"] - 2)
    additional_mover_rate = additional_movers * 30.0
    total_mover_rate = base_mover_rate + additional_mover_rate
    
    min_mover_cost = min_total_hours * total_mover_rate
    max_mover_cost = max_total_hours * total_mover_rate
    
    min_total_cost = min_truck_cost + min_mover_cost
    max_total_cost = max_truck_cost + max_mover_cost
    
    return {
        "min_cost": int(round(min_total_cost)),
        "max_cost": int(round(max_total_cost)),
        "avg_cost": int(round((min_total_cost + max_total_cost) / 2)),
        "movers": req["movers"],
        "trucks": req["trucks"],
        "min_hours": min_total_hours,
        "max_hours": max_total_hours
    }

def flatten_city_nodes(geo_json):
    """Return city nodes as (slug, lat, lng)."""
    nodes = []
    seen = set()
    for st in geo_json.get("states", []):
        for co in st.get("counties", []):
            for ci in co.get("cities", []):
                city_slug = normalize_slug(ci["slug"])
                lat = ci["lat"]; lng = ci["lng"]
                if city_slug in seen:
                    continue
                seen.add(city_slug)
                nodes.append((city_slug, lat, lng))
    return nodes

def flatten_neighborhood_nodes(geo_json):
    """Return neighborhood nodes as (slug, lat, lng) without city prefix."""
    nodes = []
    seen = set()
    for st in geo_json.get("states", []):
        for co in st.get("counties", []):
            for ci in co.get("cities", []):
                lat = ci["lat"]; lng = ci["lng"]
                for nb in ci.get("neighborhoods", []):
                    nb_slug = normalize_slug(nb["slug"])
                    if nb_slug in seen:
                        continue
                    seen.add(nb_slug)
                    nodes.append((nb_slug, lat, lng))
    return nodes

def build_pairs(geo_json):
    """Build ordered pairs A→B for both city-to-city and neighborhood-to-neighborhood routes."""
    all_rows = []
    house_sizes = ["1_bedroom", "2_bedroom", "3_bedroom", "4_bedroom", "4plus_bedroom"]
    
    # Rapid Panda Movers exact address coordinates
    # 7001 North Waterway Dr #107 Miami, Fl 33155
    company_lat, company_lng = 25.7409546, -80.3109303  # Exact coordinates provided
    
    # Generate city-to-city routes
    city_nodes = flatten_city_nodes(geo_json)
    print(f"Generating city-to-city routes for {len(city_nodes)} cities...")
    
    for i, (sa, la1, lo1) in enumerate(city_nodes):
        for j, (sb, la2, lo2) in enumerate(city_nodes):
            if i == j:
                continue
            gc = haversine_miles(la1, lo1, la2, lo2)
            road = estimate_drive_miles(gc)
            tmin = estimate_drive_time_minutes(road, 55.0)
            
            # Calculate travel time from company address to starting city
            company_to_start_gc = haversine_miles(company_lat, company_lng, la1, lo1)
            company_to_start_road = estimate_drive_miles(company_to_start_gc)
            company_travel_time = calculate_travel_time_with_traffic(company_to_start_road)
            
            # Calculate costs for each house size
            house_size_costs = {}
            for house_size in house_sizes:
                cost_data = compute_cost_for_house_size(tmin, house_size, company_travel_time)
                house_size_costs[house_size] = cost_data
            
            # Create base route data
            route_data = {
                "route_type": "city_to_city",
                "from_city": sa,
                "to_city": sb,
                "distance_mi": int(round(road)),
                "drive_time_min": tmin,
                "company_travel_time_min": company_travel_time,
                "slug": f"{sa}-to-{sb}",
                "is_active": True,
                "house_sizes": house_size_costs
            }
            
            all_rows.append(route_data)
    
    # Generate neighborhood-to-neighborhood routes
    neighborhood_nodes = flatten_neighborhood_nodes(geo_json)
    print(f"Generating neighborhood-to-neighborhood routes for {len(neighborhood_nodes)} neighborhoods...")
    
    for i, (sa, la1, lo1) in enumerate(neighborhood_nodes):
        for j, (sb, la2, lo2) in enumerate(neighborhood_nodes):
            if i == j:
                continue
            gc = haversine_miles(la1, lo1, la2, lo2)
            road = estimate_drive_miles(gc)
            tmin = estimate_drive_time_minutes(road, 55.0)
            
            # Calculate travel time from company address to starting city
            company_to_start_gc = haversine_miles(company_lat, company_lng, la1, lo1)
            company_to_start_road = estimate_drive_miles(company_to_start_gc)
            company_travel_time = calculate_travel_time_with_traffic(company_to_start_road)
            
            # Calculate costs for each house size
            house_size_costs = {}
            for house_size in house_sizes:
                cost_data = compute_cost_for_house_size(tmin, house_size, company_travel_time)
                house_size_costs[house_size] = cost_data
            
            # Create base route data
            route_data = {
                "route_type": "neighborhood_to_neighborhood",
                "from_city": sa,
                "to_city": sb,
                "distance_mi": int(round(road)),
                "drive_time_min": tmin,
                "company_travel_time_min": company_travel_time,
                "slug": f"{sa}-to-{sb}",
                "is_active": True,
                "house_sizes": house_size_costs
            }
            
            all_rows.append(route_data)
    
    df = pd.DataFrame(all_rows).sort_values(by=["route_type", "from_city", "to_city"]).reset_index(drop=True)
    return df, all_rows

def main():
    parser = argparse.ArgumentParser(description="Neighborhood → Neighborhood with house size pricing")
    parser.add_argument("--input", "-i", default="data/areas.json", help="Path to areas JSON (your schema)")
    parser.add_argument("--outcsv", default="data/area_routes.csv")
    parser.add_argument("--outjson", default="data/area_routes.json")
    args = parser.parse_args()

    with open(args.input, "r") as f:
        geo = json.load(f)

    df, rows = build_pairs(geo)
    
    # Create a flattened CSV version for easier analysis
    flattened_rows = []
    for route in rows:
        base_route = {
            "route_type": route["route_type"],
            "from_city": route["from_city"],
            "to_city": route["to_city"],
            "distance_mi": route["distance_mi"],
            "drive_time_min": route["drive_time_min"],
            "company_travel_time_min": route["company_travel_time_min"],
            "slug": route["slug"],
            "is_active": route["is_active"]
        }
        
        for house_size, cost_data in route["house_sizes"].items():
            flattened_row = base_route.copy()
            flattened_row.update({
                "house_size": house_size,
                "min_cost": cost_data["min_cost"],
                "max_cost": cost_data["max_cost"],
                "avg_cost": cost_data["avg_cost"],
                "movers": cost_data["movers"],
                "trucks": cost_data["trucks"],
                "min_hours": round(cost_data["min_hours"], 1),
                "max_hours": round(cost_data["max_hours"], 1)
            })
            flattened_rows.append(flattened_row)
    
    # Save flattened CSV
    flattened_df = pd.DataFrame(flattened_rows)
    flattened_df.to_csv(args.outcsv, index=False)
    
    # Save full JSON with nested structure
    with open(args.outjson, "w") as fo:
        json.dump(rows, fo, indent=2)

    print(f"Generated {len(rows)} directed pairs with {len(flattened_rows)} total entries (5 house sizes each)")
    print(f"Output saved to: {args.outcsv}, {args.outjson}")

if __name__ == "__main__":
    main()