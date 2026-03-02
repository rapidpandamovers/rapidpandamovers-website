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

CSV Output Format:
route_type,origin_name,origin_zip,destination_name,destination_zip,distance_mi,
drive_time_min,company_travel_time_min,slug,is_active,house_size,min_cost,max_cost,
avg_cost,movers,trucks,min_hours,max_hours

JSON Output Format:
{
  "route_type": "long_distance",
  "origin_name": "miami",
  "origin_zip": "33101",
  "destination_name": "...",
  "destination_zip": "...",
  "distance_mi": ...,
  "drive_time_min": ...,
  "slug": "miami-to-...",
  "is_active": true,
  "house_sizes": {...}
}
"""

import argparse
import math
import json
import os
import pandas as pd
from math import radians, sin, cos, asin, sqrt

# Miami origin with zip code
MIAMI = ("miami", "33101", 25.7617, -80.1918)

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "data")
CSV_PATH = os.path.join(DATA_DIR, "long_distance_routes.csv")
JSON_PATH = os.path.join(DATA_DIR, "long_distance_routes.json")

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
# Format: (slug, zip_code, lat, lon)
# NOTE: Miami-Dade destinations are handled by local_routes.csv, not included here.
# This list contains Broward, Palm Beach, and other Florida + US destinations.
destinations = [
    # Broward
    ("fort-lauderdale", "33301", 26.1224, -80.1373), ("hollywood-fl", "33019", 26.0112, -80.1495),
    ("pembroke-pines", "33024", 26.0078, -80.2963), ("miramar", "33023", 25.9861, -80.3036),
    ("pompano-beach", "33060", 26.2379, -80.1248), ("coral-springs", "33065", 26.2712, -80.2706),
    ("plantation", "33317", 26.1276, -80.2331), ("sunrise", "33322", 26.1660, -80.2566),
    ("weston", "33326", 26.1004, -80.3998), ("davie", "33314", 26.0765, -80.2521),
    ("tamarac", "33319", 26.2129, -80.2498), ("margate", "33063", 26.2445, -80.2064),
    ("coconut-creek", "33066", 26.2517, -80.1789), ("deerfield-beach", "33441", 26.3184, -80.0998),
    ("lauderhill", "33313", 26.1404, -80.2138), ("north-lauderdale", "33068", 26.2173, -80.2259),
    ("hallandale-beach", "33009", 25.9812, -80.1484), ("dania-beach", "33004", 26.0523, -80.1439),
    ("oakland-park", "33334", 26.1723, -80.1319), ("wilton-manors", "33305", 26.1604, -80.1373),
    ("lauderdale-lakes", "33311", 26.1665, -80.2064), ("lighthouse-point", "33064", 26.2756, -80.0873),
    ("parkland", "33067", 26.3105, -80.2373), ("lauderdale-by-the-sea", "33308", 26.1920, -80.0970),
    ("cooper-city", "33024", 26.0573, -80.2717), ("coral-hills", "33065", 26.1899, -80.1448),
    # Palm Beach
    ("west-palm-beach", "33401", 26.7153, -80.0534), ("boca-raton", "33431", 26.3683, -80.1289),
    ("delray-beach", "33444", 26.4615, -80.0728), ("boynton-beach", "33435", 26.5318, -80.0905),
    ("lake-worth-beach", "33460", 26.6170, -80.0560), ("palm-beach-gardens", "33410", 26.8234, -80.1387),
    ("jupiter", "33458", 26.9342, -80.0942), ("wellington", "33414", 26.6618, -80.2684),
    ("greenacres", "33463", 26.6276, -80.1358), ("riviera-beach", "33404", 26.7753, -80.0581),
    ("royal-palm-beach", "33411", 26.7084, -80.2306), ("lantana", "33462", 26.5867, -80.0514),
    ("north-palm-beach", "33408", 26.8176, -80.0591), ("tequesta", "33469", 26.9709, -80.1289),
    ("palm-springs-fl", "33461", 26.6359, -80.0962), ("haverhill", "33417", 26.6912, -80.1220),
    ("lake-clarke-shores", "33406", 26.6440, -80.0723), ("hypoluxo", "33462", 26.5784, -80.0539),
    # Treasure Coast / Space Coast / SWFL / Keys
    ("vero-beach", "32960", 27.6386, -80.3973), ("sebastian", "32958", 27.8164, -80.4706),
    ("fort-pierce", "34950", 27.4467, -80.3256), ("port-st-lucie", "34952", 27.2730, -80.3582),
    ("stuart", "34994", 27.1975, -80.2528), ("jensen-beach", "34957", 27.2542, -80.2298),
    ("palm-bay", "32905", 28.0345, -80.5887), ("melbourne", "32901", 28.0836, -80.6081),
    ("titusville", "32796", 28.6122, -80.8076), ("daytona-beach", "32114", 29.2108, -81.0228),
    ("naples", "34102", 26.1420, -81.7948), ("bonita-springs", "34134", 26.3398, -81.7787),
    ("marco-island", "34145", 25.9420, -81.7285), ("fort-myers", "33901", 26.6406, -81.8723),
    ("cape-coral", "33904", 26.5629, -81.9495), ("port-charlotte", "33948", 26.9762, -82.0906),
    ("punta-gorda", "33950", 26.9298, -82.0454), ("sarasota", "34236", 27.3364, -82.5307),
    ("bradenton", "34205", 27.4989, -82.5748), ("clearwater", "33755", 27.9659, -82.8001),
    ("st-petersburg", "33701", 27.7676, -82.6403), ("tampa", "33602", 27.9506, -82.4572),
    ("lakeland", "33801", 28.0395, -81.9498), ("winter-haven", "33880", 28.0222, -81.7329),
    ("kissimmee", "34741", 28.2919, -81.4076), ("orlando", "32801", 28.5384, -81.3789),
    ("sanford", "32771", 28.8029, -81.2695), ("altamonte-springs", "32701", 28.6611, -81.3656),
    ("ocala", "34470", 29.1872, -82.1401), ("gainesville", "32601", 29.6516, -82.3248),
    ("jacksonville", "32202", 30.3322, -81.6557), ("st-augustine", "32084", 29.9012, -81.3124),
    ("tallahassee", "32301", 30.4383, -84.2807), ("pensacola", "32501", 30.4213, -87.2169),
    ("destin", "32541", 30.3935, -86.4958), ("panama-city", "32401", 30.1588, -85.6602),
    ("key-west", "33040", 24.5551, -81.7800), ("key-largo", "33037", 25.0865, -80.4473),
    ("islamorada", "33036", 24.9240, -80.6270),

    # --- Expanded US Metros (best-effort large list) ---
    ("new-york-ny", "10001", 40.7128, -74.0060), ("newark-nj", "07102", 40.7357, -74.1724),
    ("jersey-city-nj", "07302", 40.7178, -74.0431), ("yonkers-ny", "10701", 40.9312, -73.8988),
    ("stamford-ct", "06901", 41.0534, -73.5387), ("bridgeport-ct", "06604", 41.1792, -73.1894),
    ("hartford-ct", "06103", 41.7658, -72.6734), ("new-haven-ct", "06510", 41.3083, -72.9279),
    ("springfield-ma", "01103", 42.1015, -72.5898), ("worcester-ma", "01608", 42.2626, -71.8023),
    ("boston-ma", "02108", 42.3601, -71.0589), ("providence-ri", "02903", 41.8240, -71.4128),
    ("manchester-nh", "03101", 42.9956, -71.4548), ("portland-me", "04101", 43.6591, -70.2568),
    ("albany-ny", "12207", 42.6526, -73.7562), ("syracuse-ny", "13202", 43.0481, -76.1474),
    ("rochester-ny", "14604", 43.1566, -77.6088), ("buffalo-ny", "14202", 42.8864, -78.8784),
    ("philadelphia-pa", "19102", 39.9526, -75.1652), ("pittsburgh-pa", "15222", 40.4406, -79.9959),
    ("allentown-pa", "18101", 40.6023, -75.4714), ("harrisburg-pa", "17101", 40.2732, -76.8867),
    ("scranton-pa", "18503", 41.4089, -75.6624), ("lancaster-pa", "17602", 40.0379, -76.3055),
    ("erie-pa", "16501", 42.1292, -80.0851), ("baltimore-md", "21202", 39.2904, -76.6122),
    ("washington-dc", "20001", 38.9072, -77.0369), ("arlington-va", "22201", 38.8816, -77.0910),
    ("alexandria-va", "22301", 38.8048, -77.0469), ("richmond-va", "23219", 37.5407, -77.4360),
    ("virginia-beach-va", "23451", 36.8529, -75.9780), ("norfolk-va", "23510", 36.8508, -76.2859),
    ("roanoke-va", "24011", 37.2709, -79.9414), ("raleigh-nc", "27601", 35.7796, -78.6382),
    ("durham-nc", "27701", 35.9940, -78.8986), ("greensboro-nc", "27401", 36.0726, -79.7920),
    ("winston-salem-nc", "27101", 36.0999, -80.2442), ("charlotte-nc", "28202", 35.2271, -80.8431),
    ("asheville-nc", "28801", 35.5951, -82.5515), ("fayetteville-nc", "28301", 35.0527, -78.8784),
    ("wilmington-nc", "28401", 34.2257, -77.9447), ("columbia-sc", "29201", 34.0007, -81.0348),
    ("greenville-sc", "29601", 34.8526, -82.3940), ("spartanburg-sc", "29302", 34.9496, -81.9320),
    ("charleston-sc", "29401", 32.7765, -79.9311), ("myrtle-beach-sc", "29577", 33.6891, -78.8867),
    ("savannah-ga", "31401", 32.0809, -81.0912), ("augusta-ga", "30901", 33.4735, -82.0105),
    ("atlanta-ga", "30303", 33.7490, -84.3880), ("athens-ga", "30601", 33.9519, -83.3576),
    ("macon-ga", "31201", 32.8407, -83.6324), ("columbus-ga", "31901", 32.4609, -84.9877),
    ("birmingham-al", "35203", 33.5186, -86.8104), ("montgomery-al", "36104", 32.3792, -86.3077),
    ("mobile-al", "36602", 30.6954, -88.0399), ("huntsville-al", "35801", 34.7304, -86.5861),
    ("jackson-ms", "39201", 32.2988, -90.1848), ("gulfport-ms", "39501", 30.3674, -89.0928),
    ("baton-rouge-la", "70801", 30.4515, -91.1871), ("new-orleans-la", "70112", 29.9511, -90.0715),
    ("lafayette-la", "70501", 30.2241, -92.0198), ("shreveport-la", "71101", 32.5252, -93.7502),
    ("memphis-tn", "38103", 35.1495, -90.0490), ("nashville-tn", "37201", 36.1627, -86.7816),
    ("knoxville-tn", "37902", 35.9606, -83.9207), ("chattanooga-tn", "37402", 35.0456, -85.3097),
    ("clarksville-tn", "37040", 36.5298, -87.3595), ("louisville-ky", "40202", 38.2527, -85.7585),
    ("lexington-ky", "40507", 38.0406, -84.5037), ("bowling-green-ky", "42101", 36.9685, -86.4808),
    ("charleston-wv", "25301", 38.3498, -81.6326), ("huntington-wv", "25701", 38.4192, -82.4452),
    ("morgantown-wv", "26505", 39.6295, -79.9559), ("cincinnati-oh", "45202", 39.1031, -84.5120),
    ("columbus-oh", "43215", 39.9612, -82.9988), ("cleveland-oh", "44114", 41.4993, -81.6944),
    ("dayton-oh", "45402", 39.7589, -84.1916), ("toledo-oh", "43604", 41.6528, -83.5379),
    ("akron-oh", "44308", 41.0814, -81.5190), ("youngstown-oh", "44503", 41.0998, -80.6495),
    ("detroit-mi", "48226", 42.3314, -83.0458), ("ann-arbor-mi", "48104", 42.2808, -83.7430),
    ("lansing-mi", "48933", 42.7325, -84.5555), ("flint-mi", "48502", 43.0125, -83.6875),
    ("grand-rapids-mi", "49503", 42.9634, -85.6681), ("kalamazoo-mi", "49007", 42.2917, -85.5872),
    ("madison-wi", "53703", 43.0731, -89.4012), ("milwaukee-wi", "53202", 43.0389, -87.9065),
    ("green-bay-wi", "54301", 44.5133, -88.0133), ("appleton-wi", "54911", 44.2619, -88.4154),
    ("chicago-il", "60601", 41.8781, -87.6298), ("rockford-il", "61101", 42.2711, -89.0937),
    ("springfield-il", "62701", 39.7817, -89.6501), ("peoria-il", "61602", 40.6936, -89.5890),
    ("champaign-il", "61820", 40.1164, -88.2434), ("indianapolis-in", "46204", 39.7684, -86.1581),
    ("fort-wayne-in", "46802", 41.0793, -85.1394), ("south-bend-in", "46601", 41.6764, -86.2510),
    ("evansville-in", "47708", 37.9716, -87.5711), ("st-louis-mo", "63101", 38.6270, -90.1994),
    ("kansas-city-mo", "64106", 39.0997, -94.5786), ("springfield-mo", "65806", 37.2089, -93.2923),
    ("columbia-mo", "65201", 38.9517, -92.3341), ("des-moines-ia", "50309", 41.5868, -93.6250),
    ("cedar-rapids-ia", "52401", 41.9779, -91.6656), ("davenport-ia", "52801", 41.5236, -90.5776),
    ("minneapolis-mn", "55401", 44.9778, -93.2650), ("saint-paul-mn", "55101", 44.9537, -93.0900),
    ("duluth-mn", "55802", 46.7867, -92.1005), ("rochester-mn", "55901", 44.0121, -92.4802),
    ("fargo-nd", "58102", 46.8772, -96.7898), ("bismarck-nd", "58501", 46.8083, -100.7837),
    ("sioux-falls-sd", "57104", 43.5446, -96.7311), ("rapid-city-sd", "57701", 44.0805, -103.2310),
    ("omaha-ne", "68102", 41.2565, -95.9345), ("lincoln-ne", "68508", 40.8136, -96.7026),
    ("wichita-ks", "67202", 37.6872, -97.3301), ("topeka-ks", "66603", 39.0558, -95.6890),
    ("overland-park-ks", "66210", 38.9822, -94.6708), ("oklahoma-city-ok", "73102", 35.4676, -97.5164),
    ("tulsa-ok", "74103", 36.1540, -95.9928), ("norman-ok", "73069", 35.2226, -97.4395),
    ("dallas-tx", "75201", 32.7767, -96.7970), ("fort-worth-tx", "76102", 32.7555, -97.3308),
    ("houston-tx", "77002", 29.7604, -95.3698), ("san-antonio-tx", "78205", 29.4241, -98.4936),
    ("austin-tx", "78701", 30.2672, -97.7431), ("el-paso-tx", "79901", 31.7619, -106.4850),
    ("lubbock-tx", "79401", 33.5779, -101.8552), ("amarillo-tx", "79101", 35.2219, -101.8313),
    ("corpus-christi-tx", "78401", 27.8006, -97.3964), ("brownsville-tx", "78520", 25.9017, -97.4975),
    ("mcallen-tx", "78501", 26.2034, -98.2300), ("laredo-tx", "78040", 27.5306, -99.4803),
    ("albuquerque-nm", "87102", 35.0844, -106.6504), ("santa-fe-nm", "87501", 35.6870, -105.9378),
    ("las-cruces-nm", "88001", 32.3199, -106.7637), ("phoenix-az", "85004", 33.4484, -112.0740),
    ("tucson-az", "85701", 32.2226, -110.9747), ("mesa-az", "85201", 33.4152, -111.8315),
    ("chandler-az", "85225", 33.3062, -111.8413), ("gilbert-az", "85234", 33.3528, -111.7890),
    ("scottsdale-az", "85251", 33.4942, -111.9261), ("glendale-az", "85301", 33.5387, -112.1860),
    ("las-vegas-nv", "89101", 36.1699, -115.1398), ("reno-nv", "89501", 39.5296, -119.8138),
    ("salt-lake-city-ut", "84101", 40.7608, -111.8910), ("provo-ut", "84601", 40.2338, -111.6585),
    ("ogden-ut", "84401", 41.2230, -111.9738), ("boise-id", "83702", 43.6150, -116.2023),
    ("idaho-falls-id", "83402", 43.4917, -112.0333), ("billings-mt", "59101", 45.7833, -108.5007),
    ("missoula-mt", "59801", 46.8721, -113.9940), ("cheyenne-wy", "82001", 41.1400, -104.8202),
    ("denver-co", "80202", 39.7392, -104.9903), ("colorado-springs-co", "80903", 38.8339, -104.8214),
    ("fort-collins-co", "80521", 40.5853, -105.0844), ("pueblo-co", "81003", 38.2544, -104.6091),
    ("alamosa-co", "81101", 37.4695, -105.8700), ("grand-junction-co", "81501", 39.0639, -108.5506),
    ("los-angeles-ca", "90012", 34.0522, -118.2437), ("long-beach-ca", "90802", 33.7701, -118.1937),
    ("anaheim-ca", "92805", 33.8366, -117.9143), ("santa-ana-ca", "92701", 33.7455, -117.8677),
    ("irvine-ca", "92614", 33.6846, -117.8265), ("riverside-ca", "92501", 33.9806, -117.3755),
    ("san-bernardino-ca", "92401", 34.1083, -117.2898), ("ontario-ca", "91764", 34.0633, -117.6509),
    ("bakersfield-ca", "93301", 35.3733, -119.0187), ("fresno-ca", "93721", 36.7378, -119.7871),
    ("stockton-ca", "95202", 37.9577, -121.2908), ("modesto-ca", "95354", 37.6391, -120.9969),
    ("sacramento-ca", "95814", 38.5816, -121.4944), ("oakland-ca", "94612", 37.8044, -122.2712),
    ("fremont-ca", "94538", 37.5483, -121.9886), ("san-francisco-ca", "94102", 37.7749, -122.4194),
    ("san-jose-ca", "95113", 37.3382, -121.8863), ("sunnyvale-ca", "94086", 37.3688, -122.0363),
    ("santa-clara-ca", "95050", 37.3541, -121.9552), ("palo-alto-ca", "94301", 37.4419, -122.1430),
    ("san-mateo-ca", "94401", 37.5629, -122.3255), ("daly-city-ca", "94015", 37.6879, -122.4702),
    ("san-diego-ca", "92101", 32.7157, -117.1611), ("chula-vista-ca", "91910", 32.6401, -117.0842),
    ("escondido-ca", "92025", 33.1192, -117.0864), ("oceanside-ca", "92054", 33.1959, -117.3795),
    ("santa-barbara-ca", "93101", 34.4208, -119.6982), ("ventura-ca", "93001", 34.2746, -119.2290),
    ("oxnard-ca", "93030", 34.1975, -119.1771), ("san-luis-obispo-ca", "93401", 35.2828, -120.6596),
    ("seattle-wa", "98101", 47.6062, -122.3321), ("tacoma-wa", "98402", 47.2529, -122.4443),
    ("bellevue-wa", "98004", 47.6101, -122.2015), ("spokane-wa", "99201", 47.6588, -117.4260),
    ("portland-or", "97201", 45.5152, -122.6784), ("salem-or", "97301", 44.9429, -123.0351),
    ("eugene-or", "97401", 44.0521, -123.0868), ("medford-or", "97501", 42.3265, -122.8756),
]

def load_existing_drive_times():
    """Load existing drive times from CSV file, keyed by slug."""
    existing = {}
    if os.path.exists(CSV_PATH):
        try:
            df = pd.read_csv(CSV_PATH)
            # Get unique routes (one per slug)
            for slug in df['slug'].unique():
                row = df[df['slug'] == slug].iloc[0]
                existing[slug] = {
                    'distance_mi': row['distance_mi'],
                    'drive_time_min': row['drive_time_min']
                }
            print(f"  Loaded {len(existing)} existing routes from {CSV_PATH}")
        except Exception as e:
            print(f"  Warning: Could not load existing CSV: {e}")
    return existing


def build_routes(preserve_drive_times=False):
    """Build route data for all destinations.

    Args:
        preserve_drive_times: If True, use existing distance_mi and drive_time_min
                            from CSV file instead of estimating.
    """
    # Load existing data if preserving
    existing_data = {}
    if preserve_drive_times:
        existing_data = load_existing_drive_times()

    rows = []
    origin_name, origin_zip, flat, flon = MIAMI
    house_sizes = ["1_bedroom", "2_bedroom", "3_bedroom", "4_bedroom", "4plus_bedroom"]
    preserved_count = 0
    estimated_count = 0

    for dest_slug, dest_zip, lat, lon in destinations:
        slug = f"miami-to-{dest_slug}"

        # Check if we should preserve existing drive times
        if preserve_drive_times and slug in existing_data:
            road_mi = existing_data[slug]['distance_mi']
            drive_time_min = existing_data[slug]['drive_time_min']
            preserved_count += 1
        else:
            # Estimate using haversine
            gc_mi = haversine_miles(flat, flon, lat, lon)
            road_mi = int(round(estimate_drive_miles(gc_mi)))
            drive_time_min = estimate_drive_time_minutes(road_mi, avg_speed_mph=55.0)
            estimated_count += 1

        # Calculate costs for each house size
        house_size_costs = {}
        for house_size in house_sizes:
            cost_data = compute_cost_for_house_size(drive_time_min, house_size)
            house_size_costs[house_size] = cost_data

        # Create base route data with new field names
        route_data = {
            "route_type": "long_distance",
            "origin_name": origin_name,
            "origin_zip": origin_zip,
            "destination_name": dest_slug,
            "destination_zip": dest_zip,
            "distance_mi": road_mi,
            "drive_time_min": drive_time_min,
            "slug": slug,
            "is_active": True,
            "house_sizes": house_size_costs
        }

        rows.append(route_data)

    if preserve_drive_times:
        print(f"  Preserved: {preserved_count} routes, Estimated: {estimated_count} routes")

    df = pd.DataFrame(rows).sort_values(by=["distance_mi", "destination_name"]).reset_index(drop=True)
    return df, rows

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate long distance route data for Rapid Panda Movers"
    )
    parser.add_argument(
        "--preserve-drive-times",
        action="store_true",
        help="Preserve existing distance_mi and drive_time_min from CSV (e.g., Google Maps data)"
    )
    args = parser.parse_args()

    print("Generating long distance routes...")
    df, rows = build_routes(preserve_drive_times=args.preserve_drive_times)

    # Create a flattened CSV version for easier analysis
    # Column order matches local_routes.csv structure
    flattened_rows = []
    for route in rows:
        base_route = {
            "route_type": route["route_type"],
            "origin_name": route["origin_name"],
            "origin_zip": route["origin_zip"],
            "destination_name": route["destination_name"],
            "destination_zip": route["destination_zip"],
            "distance_mi": route["distance_mi"],
            "drive_time_min": route["drive_time_min"],
            "company_travel_time_min": "",  # Not applicable for long distance
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

    # Save flattened CSV with correct column order
    csv_columns = [
        "route_type", "origin_name", "origin_zip", "destination_name", "destination_zip",
        "distance_mi", "drive_time_min", "company_travel_time_min", "slug", "is_active",
        "house_size", "min_cost", "max_cost", "avg_cost", "movers", "trucks", "min_hours", "max_hours"
    ]
    flattened_df = pd.DataFrame(flattened_rows, columns=csv_columns)
    flattened_df.to_csv(CSV_PATH, index=False)

    # Save full JSON with nested structure (without company_travel_time_min)
    json_rows = []
    for route in rows:
        json_route = {
            "route_type": route["route_type"],
            "origin_name": route["origin_name"],
            "origin_zip": route["origin_zip"],
            "destination_name": route["destination_name"],
            "destination_zip": route["destination_zip"],
            "distance_mi": route["distance_mi"],
            "drive_time_min": route["drive_time_min"],
            "slug": route["slug"],
            "is_active": route["is_active"],
            "house_sizes": route["house_sizes"]
        }
        json_rows.append(json_route)

    with open(JSON_PATH, "w") as f:
        json.dump(json_rows, f, indent=2)

    print(f"Generated {len(rows)} routes with {len(flattened_rows)} total entries (5 house sizes each)")
    print(f"Output saved to: {CSV_PATH}, {JSON_PATH}")
