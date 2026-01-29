
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Miami → US destinations routes with house size pricing.

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
- 4+ bedroom (2000+ sq ft): 1+ trucks, 4+ movers, 5+ loading, 4+ unloading
"""

import math, json, pandas as pd
from math import radians, sin, cos, asin, sqrt

MIAMI = ("miami", 25.7617, -80.1918)

def haversine_miles(lat1, lon1, lat2, lon2):
    R = 3958.8
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def estimate_drive_miles(gc_miles):
    return gc_miles * 1.1

def estimate_drive_time_minutes(road_miles, avg_speed_mph=55.0):
    hours = road_miles / avg_speed_mph
    return int(round(hours * 60))

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

def compute_cost_for_house_size(drive_time_min, house_size):
    """Compute cost range for a specific house size."""
    drive_hours_one_way = max(drive_time_min / 60.0, 1.0)  # Minimum 1 hour transit
    
    # Get house size requirements
    req = get_house_size_requirements(house_size)
    
    # Use only house size requirements for load/unload hours
    min_load_h = req["loading_hours"][0]
    max_load_h = req["loading_hours"][1]
    min_unload_h = req["unloading_hours"][0]
    max_unload_h = req["unloading_hours"][1]
    
    # Calculate total hours for min and max scenarios
    min_total_hours = min_load_h + drive_hours_one_way + min_unload_h + drive_hours_one_way
    max_total_hours = max_load_h + drive_hours_one_way + max_unload_h + drive_hours_one_way
    
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

# ---- Destinations ----
# Expanded Florida towns/cities + an expanded set of US metros (best-effort ~180+ unique metros).
destinations = [
    # South Florida: Miami-Dade
    ("miami-beach", 25.7907, -80.1300), ("miami-gardens", 25.9420, -80.2456),
    ("hialeah", 25.8576, -80.2781), ("coral-gables", 25.7215, -80.2684),
    ("doral", 25.8195, -80.3553), ("kendall", 25.6660, -80.3550),
    ("homestead", 25.4687, -80.4776), ("cutler-bay", 25.5808, -80.3460),
    ("palmetto-bay", 25.6217, -80.3248), ("pinecrest", 25.6670, -80.3100),
    ("aventura", 25.9565, -80.1392), ("north-miami", 25.8901, -80.1867),
    ("north-miami-beach", 25.9331, -80.1625), ("sunny-isles-beach", 25.9397, -80.1248),
    ("bal-harbour", 25.8910, -80.1266), ("surfside", 25.8787, -80.1259),
    ("bay-harbor-islands", 25.8870, -80.1318), ("key-biscayne", 25.6930, -80.1620),
    ("south-miami", 25.7079, -80.2963), ("sweetwater", 25.7634, -80.3733),
    ("west-miami", 25.7634, -80.2960), ("medley", 25.8404, -80.3256),
    ("miami-lakes", 25.9097, -80.3087), ("hialeah-gardens", 25.8651, -80.3248),
    ("opa-locka", 25.9023, -80.2503), ("miami-shores", 25.8637, -80.1920),
    ("el-portal", 25.8557, -80.1943), ("biscayne-park", 25.8823, -80.1804),
    ("golden-beach", 25.9687, -80.1223), ("virginia-gardens", 25.8090, -80.3048),
    # Broward
    ("fort-lauderdale", 26.1224, -80.1373), ("hollywood-fl", 26.0112, -80.1495),
    ("pembroke-pines", 26.0078, -80.2963), ("miramar", 25.9861, -80.3036),
    ("pompano-beach", 26.2379, -80.1248), ("coral-springs", 26.2712, -80.2706),
    ("plantation", 26.1276, -80.2331), ("sunrise", 26.1660, -80.2566),
    ("weston", 26.1004, -80.3998), ("davie", 26.0765, -80.2521),
    ("tamarac", 26.2129, -80.2498), ("margate", 26.2445, -80.2064),
    ("coconut-creek", 26.2517, -80.1789), ("deerfield-beach", 26.3184, -80.0998),
    ("lauderhill", 26.1404, -80.2138), ("north-lauderdale", 26.2173, -80.2259),
    ("hallandale-beach", 25.9812, -80.1484), ("dania-beach", 26.0523, -80.1439),
    ("oakland-park", 26.1723, -80.1319), ("wilton-manors", 26.1604, -80.1373),
    ("lauderdale-lakes", 26.1665, -80.2064), ("lighthouse-point", 26.2756, -80.0873),
    ("parkland", 26.3105, -80.2373), ("lauderdale-by-the-sea", 26.1920, -80.0970),
    ("cooper-city", 26.0573, -80.2717), ("coral-hills", 26.1899, -80.1448),
    # Palm Beach
    ("west-palm-beach", 26.7153, -80.0534), ("boca-raton", 26.3683, -80.1289),
    ("delray-beach", 26.4615, -80.0728), ("boynton-beach", 26.5318, -80.0905),
    ("lake-worth-beach", 26.6170, -80.0560), ("palm-beach-gardens", 26.8234, -80.1387),
    ("jupiter", 26.9342, -80.0942), ("wellington", 26.6618, -80.2684),
    ("greenacres", 26.6276, -80.1358), ("riviera-beach", 26.7753, -80.0581),
    ("royal-palm-beach", 26.7084, -80.2306), ("lantana", 26.5867, -80.0514),
    ("north-palm-beach", 26.8176, -80.0591), ("tequesta", 26.9709, -80.1289),
    ("palm-springs-fl", 26.6359, -80.0962), ("haverhill", 26.6912, -80.1220),
    ("lake-clarke-shores", 26.6440, -80.0723), ("hypoluxo", 26.5784, -80.0539),
    # Treasure Coast / Space Coast / SWFL / Keys
    ("vero-beach", 27.6386, -80.3973), ("sebastian", 27.8164, -80.4706),
    ("fort-pierce", 27.4467, -80.3256), ("port-st-lucie", 27.2730, -80.3582),
    ("stuart", 27.1975, -80.2528), ("jensen-beach", 27.2542, -80.2298),
    ("palm-bay", 28.0345, -80.5887), ("melbourne", 28.0836, -80.6081),
    ("titusville", 28.6122, -80.8076), ("daytona-beach", 29.2108, -81.0228),
    ("naples", 26.1420, -81.7948), ("bonita-springs", 26.3398, -81.7787),
    ("marco-island", 25.9420, -81.7285), ("fort-myers", 26.6406, -81.8723),
    ("cape-coral", 26.5629, -81.9495), ("port-charlotte", 26.9762, -82.0906),
    ("punta-gorda", 26.9298, -82.0454), ("sarasota", 27.3364, -82.5307),
    ("bradenton", 27.4989, -82.5748), ("clearwater", 27.9659, -82.8001),
    ("st-petersburg", 27.7676, -82.6403), ("tampa", 27.9506, -82.4572),
    ("lakeland", 28.0395, -81.9498), ("winter-haven", 28.0222, -81.7329),
    ("kissimmee", 28.2919, -81.4076), ("orlando", 28.5384, -81.3789),
    ("sanford", 28.8029, -81.2695), ("altamonte-springs", 28.6611, -81.3656),
    ("ocala", 29.1872, -82.1401), ("gainesville", 29.6516, -82.3248),
    ("jacksonville", 30.3322, -81.6557), ("st-augustine", 29.9012, -81.3124),
    ("tallahassee", 30.4383, -84.2807), ("pensacola", 30.4213, -87.2169),
    ("destin", 30.3935, -86.4958), ("panama-city", 30.1588, -85.6602),
    ("key-west", 24.5551, -81.7800), ("key-largo", 25.0865, -80.4473),
    ("islamorada", 24.9240, -80.6270),

    # --- Expanded US Metros (best-effort large list) ---
    ("new-york-ny", 40.7128, -74.0060), ("newark-nj", 40.7357, -74.1724),
    ("jersey-city-nj", 40.7178, -74.0431), ("yonkers-ny", 40.9312, -73.8988),
    ("stamford-ct", 41.0534, -73.5387), ("bridgeport-ct", 41.1792, -73.1894),
    ("hartford-ct", 41.7658, -72.6734), ("new-haven-ct", 41.3083, -72.9279),
    ("springfield-ma", 42.1015, -72.5898), ("worcester-ma", 42.2626, -71.8023),
    ("boston-ma", 42.3601, -71.0589), ("providence-ri", 41.8240, -71.4128),
    ("manchester-nh", 42.9956, -71.4548), ("portland-me", 43.6591, -70.2568),
    ("albany-ny", 42.6526, -73.7562), ("syracuse-ny", 43.0481, -76.1474),
    ("rochester-ny", 43.1566, -77.6088), ("buffalo-ny", 42.8864, -78.8784),
    ("philadelphia-pa", 39.9526, -75.1652), ("pittsburgh-pa", 40.4406, -79.9959),
    ("allentown-pa", 40.6023, -75.4714), ("harrisburg-pa", 40.2732, -76.8867),
    ("scranton-pa", 41.4089, -75.6624), ("lancaster-pa", 40.0379, -76.3055),
    ("erie-pa", 42.1292, -80.0851), ("baltimore-md", 39.2904, -76.6122),
    ("washington-dc", 38.9072, -77.0369), ("arlington-va", 38.8816, -77.0910),
    ("alexandria-va", 38.8048, -77.0469), ("richmond-va", 37.5407, -77.4360),
    ("virginia-beach-va", 36.8529, -75.9780), ("norfolk-va", 36.8508, -76.2859),
    ("roanoke-va", 37.2709, -79.9414), ("raleigh-nc", 35.7796, -78.6382),
    ("durham-nc", 35.9940, -78.8986), ("greensboro-nc", 36.0726, -79.7920),
    ("winston-salem-nc", 36.0999, -80.2442), ("charlotte-nc", 35.2271, -80.8431),
    ("asheville-nc", 35.5951, -82.5515), ("fayetteville-nc", 35.0527, -78.8784),
    ("wilmington-nc", 34.2257, -77.9447), ("columbia-sc", 34.0007, -81.0348),
    ("greenville-sc", 34.8526, -82.3940), ("spartanburg-sc", 34.9496, -81.9320),
    ("charleston-sc", 32.7765, -79.9311), ("myrtle-beach-sc", 33.6891, -78.8867),
    ("savannah-ga", 32.0809, -81.0912), ("augusta-ga", 33.4735, -82.0105),
    ("atlanta-ga", 33.7490, -84.3880), ("athens-ga", 33.9519, -83.3576),
    ("macon-ga", 32.8407, -83.6324), ("columbus-ga", 32.4609, -84.9877),
    ("birmingham-al", 33.5186, -86.8104), ("montgomery-al", 32.3792, -86.3077),
    ("mobile-al", 30.6954, -88.0399), ("huntsville-al", 34.7304, -86.5861),
    ("jackson-ms", 32.2988, -90.1848), ("gulfport-ms", 30.3674, -89.0928),
    ("baton-rouge-la", 30.4515, -91.1871), ("new-orleans-la", 29.9511, -90.0715),
    ("lafayette-la", 30.2241, -92.0198), ("shreveport-la", 32.5252, -93.7502),
    ("memphis-tn", 35.1495, -90.0490), ("nashville-tn", 36.1627, -86.7816),
    ("knoxville-tn", 35.9606, -83.9207), ("chattanooga-tn", 35.0456, -85.3097),
    ("clarksville-tn", 36.5298, -87.3595), ("louisville-ky", 38.2527, -85.7585),
    ("lexington-ky", 38.0406, -84.5037), ("bowling-green-ky", 36.9685, -86.4808),
    ("charleston-wv", 38.3498, -81.6326), ("huntington-wv", 38.4192, -82.4452),
    ("morgantown-wv", 39.6295, -79.9559), ("cincinnati-oh", 39.1031, -84.5120),
    ("columbus-oh", 39.9612, -82.9988), ("cleveland-oh", 41.4993, -81.6944),
    ("dayton-oh", 39.7589, -84.1916), ("toledo-oh", 41.6528, -83.5379),
    ("akron-oh", 41.0814, -81.5190), ("youngstown-oh", 41.0998, -80.6495),
    ("detroit-mi", 42.3314, -83.0458), ("ann-arbor-mi", 42.2808, -83.7430),
    ("lansing-mi", 42.7325, -84.5555), ("flint-mi", 43.0125, -83.6875),
    ("grand-rapids-mi", 42.9634, -85.6681), ("kalamazoo-mi", 42.2917, -85.5872),
    ("madison-wi", 43.0731, -89.4012), ("milwaukee-wi", 43.0389, -87.9065),
    ("green-bay-wi", 44.5133, -88.0133), ("appleton-wi", 44.2619, -88.4154),
    ("chicago-il", 41.8781, -87.6298), ("rockford-il", 42.2711, -89.0937),
    ("springfield-il", 39.7817, -89.6501), ("peoria-il", 40.6936, -89.5890),
    ("champaign-il", 40.1164, -88.2434), ("indianapolis-in", 39.7684, -86.1581),
    ("fort-wayne-in", 41.0793, -85.1394), ("south-bend-in", 41.6764, -86.2510),
    ("evansville-in", 37.9716, -87.5711), ("st-louis-mo", 38.6270, -90.1994),
    ("kansas-city-mo", 39.0997, -94.5786), ("springfield-mo", 37.2089, -93.2923),
    ("columbia-mo", 38.9517, -92.3341), ("des-moines-ia", 41.5868, -93.6250),
    ("cedar-rapids-ia", 41.9779, -91.6656), ("davenport-ia", 41.5236, -90.5776),
    ("minneapolis-mn", 44.9778, -93.2650), ("saint-paul-mn", 44.9537, -93.0900),
    ("duluth-mn", 46.7867, -92.1005), ("rochester-mn", 44.0121, -92.4802),
    ("fargo-nd", 46.8772, -96.7898), ("bismarck-nd", 46.8083, -100.7837),
    ("sioux-falls-sd", 43.5446, -96.7311), ("rapid-city-sd", 44.0805, -103.2310),
    ("omaha-ne", 41.2565, -95.9345), ("lincoln-ne", 40.8136, -96.7026),
    ("wichita-ks", 37.6872, -97.3301), ("topeka-ks", 39.0558, -95.6890),
    ("overland-park-ks", 38.9822, -94.6708), ("oklahoma-city-ok", 35.4676, -97.5164),
    ("tulsa-ok", 36.1540, -95.9928), ("norman-ok", 35.2226, -97.4395),
    ("dallas-tx", 32.7767, -96.7970), ("fort-worth-tx", 32.7555, -97.3308),
    ("houston-tx", 29.7604, -95.3698), ("san-antonio-tx", 29.4241, -98.4936),
    ("austin-tx", 30.2672, -97.7431), ("el-paso-tx", 31.7619, -106.4850),
    ("lubbock-tx", 33.5779, -101.8552), ("amarillo-tx", 35.2219, -101.8313),
    ("corpus-christi-tx", 27.8006, -97.3964), ("brownsville-tx", 25.9017, -97.4975),
    ("mcallen-tx", 26.2034, -98.2300), ("laredo-tx", 27.5306, -99.4803),
    ("albuquerque-nm", 35.0844, -106.6504), ("santa-fe-nm", 35.6870, -105.9378),
    ("las-cruces-nm", 32.3199, -106.7637), ("phoenix-az", 33.4484, -112.0740),
    ("tucson-az", 32.2226, -110.9747), ("mesa-az", 33.4152, -111.8315),
    ("chandler-az", 33.3062, -111.8413), ("gilbert-az", 33.3528, -111.7890),
    ("scottsdale-az", 33.4942, -111.9261), ("glendale-az", 33.5387, -112.1860),
    ("las-vegas-nv", 36.1699, -115.1398), ("reno-nv", 39.5296, -119.8138),
    ("salt-lake-city-ut", 40.7608, -111.8910), ("provo-ut", 40.2338, -111.6585),
    ("ogden-ut", 41.2230, -111.9738), ("boise-id", 43.6150, -116.2023),
    ("idaho-falls-id", 43.4917, -112.0333), ("billings-mt", 45.7833, -108.5007),
    ("missoula-mt", 46.8721, -113.9940), ("cheyenne-wy", 41.1400, -104.8202),
    ("denver-co", 39.7392, -104.9903), ("colorado-springs-co", 38.8339, -104.8214),
    ("fort-collins-co", 40.5853, -105.0844), ("pueblo-co", 38.2544, -104.6091),
    ("alamosa-co", 37.4695, -105.8700), ("grand-junction-co", 39.0639, -108.5506),
    ("los-angeles-ca", 34.0522, -118.2437), ("long-beach-ca", 33.7701, -118.1937),
    ("anaheim-ca", 33.8366, -117.9143), ("santa-ana-ca", 33.7455, -117.8677),
    ("irvine-ca", 33.6846, -117.8265), ("riverside-ca", 33.9806, -117.3755),
    ("san-bernardino-ca", 34.1083, -117.2898), ("ontario-ca", 34.0633, -117.6509),
    ("bakersfield-ca", 35.3733, -119.0187), ("fresno-ca", 36.7378, -119.7871),
    ("stockton-ca", 37.9577, -121.2908), ("modesto-ca", 37.6391, -120.9969),
    ("sacramento-ca", 38.5816, -121.4944), ("oakland-ca", 37.8044, -122.2712),
    ("fremont-ca", 37.5483, -121.9886), ("san-francisco-ca", 37.7749, -122.4194),
    ("san-jose-ca", 37.3382, -121.8863), ("sunnyvale-ca", 37.3688, -122.0363),
    ("santa-clara-ca", 37.3541, -121.9552), ("palo-alto-ca", 37.4419, -122.1430),
    ("san-mateo-ca", 37.5629, -122.3255), ("daly-city-ca", 37.6879, -122.4702),
    ("san-diego-ca", 32.7157, -117.1611), ("chula-vista-ca", 32.6401, -117.0842),
    ("escondido-ca", 33.1192, -117.0864), ("oceanside-ca", 33.1959, -117.3795),
    ("santa-barbara-ca", 34.4208, -119.6982), ("ventura-ca", 34.2746, -119.2290),
    ("oxnard-ca", 34.1975, -119.1771), ("san-luis-obispo-ca", 35.2828, -120.6596),
    ("seattle-wa", 47.6062, -122.3321), ("tacoma-wa", 47.2529, -122.4443),
    ("bellevue-wa", 47.6101, -122.2015), ("spokane-wa", 47.6588, -117.4260),
    ("portland-or", 45.5152, -122.6784), ("salem-or", 44.9429, -123.0351),
    ("eugene-or", 44.0521, -123.0868), ("medford-or", 42.3265, -122.8756),
]

def build_routes():
    rows = []
    from_city, flat, flon = MIAMI
    house_sizes = ["1_bedroom", "2_bedroom", "3_bedroom", "4_bedroom", "4plus_bedroom"]
    
    for slug, lat, lon in destinations:
        gc_mi = haversine_miles(flat, flon, lat, lon)
        road_mi = estimate_drive_miles(gc_mi)
        drive_time_min = estimate_drive_time_minutes(road_mi, avg_speed_mph=55.0)
        
        # Calculate costs for each house size
        house_size_costs = {}
        for house_size in house_sizes:
            cost_data = compute_cost_for_house_size(drive_time_min, house_size)
            house_size_costs[house_size] = cost_data
        
        # Create base route data
        route_data = {
            "from_city": "miami",
            "to_city": slug,
            "distance_mi": int(round(road_mi)),
            "drive_time_min": drive_time_min,
            "slug": f"miami-to-{slug}",
            "is_active": True,
            "house_sizes": house_size_costs
        }
        
        rows.append(route_data)
    
    df = pd.DataFrame(rows).sort_values(by=["distance_mi", "to_city"]).reset_index(drop=True)
    return df, rows

if __name__ == "__main__":
    df, rows = build_routes()
    
    # Create a flattened CSV version for easier analysis
    flattened_rows = []
    for route in rows:
        base_route = {
            "from_city": route["from_city"],
            "to_city": route["to_city"],
            "distance_mi": route["distance_mi"],
            "drive_time_min": route["drive_time_min"],
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
    flattened_df.to_csv("data/miami_routes.csv", index=False)
    
    # Save full JSON with nested structure
    with open("data/miami_routes.json", "w") as f:
        json.dump(rows, f, indent=2)
    
    print(f"Generated {len(rows)} routes with {len(flattened_rows)} total entries (5 house sizes each)")
    print(f"Output saved to: data/miami_routes.csv, data/miami_routes.json")
