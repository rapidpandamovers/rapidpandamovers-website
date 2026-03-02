#!/usr/bin/env python3
"""
Download sight images from Unsplash (using their free API).
Images are saved to public/images/sights/ directory.

For production use, you should:
1. Get your own Unsplash API key at https://unsplash.com/developers
2. Or manually download images from Unsplash/Pexels and save them here
"""

import os
import urllib.request
import ssl
import time
import json

# Configuration
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'images', 'sights')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Use Lorem Picsum for reliable placeholder images
# Each image has a unique seed for consistency
SIGHT_IMAGES = [
    # Miami (city level)
    ('vizcaya-museum.jpg', 1001),
    ('perez-art-museum.jpg', 1002),
    ('wynwood-walls.jpg', 1003),
    ('bayfront-park.jpg', 1004),
    ('frost-science.jpg', 1005),
    ('little-havana.jpg', 1006),
    # Coral Gables
    ('biltmore-hotel.jpg', 1011),
    ('venetian-pool.jpg', 1012),
    ('fairchild-garden.jpg', 1013),
    ('miracle-mile.jpg', 1014),
    # Miami Beach
    ('art-deco-district.jpg', 1021),
    ('south-beach.jpg', 1022),
    ('lincoln-road.jpg', 1023),
    ('bass-museum.jpg', 1024),
    ('miami-beach-boardwalk.jpg', 1025),
    # Key Biscayne
    ('cape-florida.jpg', 1031),
    ('crandon-park.jpg', 1032),
    ('cape-florida-lighthouse.jpg', 1033),
    # Miami neighborhoods - Brickell
    ('brickell-city-centre.jpg', 1041),
    ('simpson-park.jpg', 1042),
    # Brickell Key
    ('mandarin-oriental.jpg', 1043),
    # Coconut Grove
    ('cocowalk.jpg', 1044),
    ('barnacle-park.jpg', 1045),
    ('peacock-park.jpg', 1046),
    # Wynwood
    ('wynwood-marketplace.jpg', 1047),
    ('margulies-collection.jpg', 1048),
    # Downtown
    ('kaseya-center.jpg', 1049),
    ('bayside-marketplace.jpg', 1050),
    ('freedom-tower.jpg', 1051),
    # Edgewater
    ('margaret-pace-park.jpg', 1052),
    # Allapattah
    ('rubell-museum.jpg', 1053),
    # Arts & Entertainment District
    ('arsht-center.jpg', 1054),
    # Design District
    ('ica-miami.jpg', 1055),
    ('design-district.jpg', 1056),
    # Little Haiti
    ('little-haiti-cultural.jpg', 1057),
    # Little Havana
    ('domino-park.jpg', 1058),
    ('tower-theater.jpg', 1059),
    # Upper Eastside / MiMo
    ('mimo-district.jpg', 1060),
    # Virginia Key
    ('miami-seaquarium.jpg', 1061),
    ('virginia-key-beach.jpg', 1062),
    # Watson Island
    ('jungle-island.jpg', 1063),
    ('childrens-museum.jpg', 1064),
    # Midtown
    ('midtown-miami.jpg', 1065),
    # Other cities
    # Doral
    ('trump-doral.jpg', 1071),
    ('cityplace-doral.jpg', 1072),
    # Aventura
    ('aventura-mall.jpg', 1073),
    # Bal Harbour
    ('bal-harbour-shops.jpg', 1074),
    # Hialeah
    ('hialeah-park.jpg', 1075),
    # Homestead
    ('homestead-speedway.jpg', 1076),
    ('coral-castle.jpg', 1077),
    # Miami Gardens
    ('hard-rock-stadium.jpg', 1078),
    # Palmetto Bay
    ('deering-estate.jpg', 1079),
    # Pinecrest
    ('pinecrest-gardens.jpg', 1080),
    # North Miami
    ('oleta-river-park.jpg', 1081),
    ('moca-north-miami.jpg', 1082),
    # Sunny Isles Beach
    ('newport-pier.jpg', 1083),
    ('sunny-isles-beach.jpg', 1084),
    # Florida City
    ('robert-is-here.jpg', 1085),
    ('everglades-entrance.jpg', 1086),
    # Kendall
    ('dadeland-mall.jpg', 1087),
    ('zoo-miami.jpg', 1088),
    # North Miami Beach
    ('spanish-monastery.jpg', 1089),
    # Cutler Bay
    ('black-point-marina.jpg', 1090),
    # Miami Lakes
    ('main-street-miami-lakes.jpg', 1091),
    # South Miami
    ('sunset-place.jpg', 1092),
    # Opa-locka
    ('opa-locka-city-hall.jpg', 1093),
    # Surfside
    ('surfside-beach.jpg', 1094),
    # Sweetwater
    ('dolphin-mall.jpg', 1095),
    ('fiu-campus.jpg', 1096),
    # Miami Shores
    ('miami-shores-cc.jpg', 1097),
    # Additional cities
    ('love-sculpture.jpg', 1101),  # Bay Harbor Islands
    ('el-portal-mound.jpg', 1102),  # El Portal
    ('loggia-beach-park.jpg', 1103),  # Golden Beach
    ('hialeah-gardens-botanical.jpg', 1104),  # Hialeah Gardens
    ('indian-creek-cc.jpg', 1105),  # Indian Creek
    ('k1-speed.jpg', 1106),  # Medley
    ('miami-springs-golf.jpg', 1107),  # Miami Springs
    ('curtiss-mansion.jpg', 1108),  # Miami Springs
    ('treasure-island-playground.jpg', 1109),  # North Bay Village
    ('virginia-gardens-park.jpg', 1110),  # Virginia Gardens
    ('west-miami-community.jpg', 1111),  # West Miami
    ('tropical-park.jpg', 1112),  # Westchester
    # Additional Miami neighborhoods
    ('legion-memorial-park.jpg', 1121),  # Bay Point
    ('vagabond-hotel.jpg', 1122),  # Belle Meade
    ('upper-buena-vista.jpg', 1123),  # Buena Vista
    ('cuban-memorial-blvd.jpg', 1124),  # Coral Way/Shenandoah
    ('grapeland-water-park.jpg', 1125),  # Flagami
    ('grapeland-heights-park.jpg', 1126),  # Grapeland Heights
    ('the-alamo-jackson.jpg', 1127),  # Health District
    ('hampton-house.jpg', 1128),  # Liberty City
    ('morningside-park.jpg', 1129),  # Morningside
    ('lyric-theater.jpg', 1130),  # Overtown
    ('ironside-district.jpg', 1131),  # Palm Grove
    ('jose-marti-park.jpg', 1132),  # Spring Garden
    ('waterway-park.jpg', 1133),  # West Flagler
]

def download_image(filename: str, seed: int) -> bool:
    """Download an image from Lorem Picsum and save it."""
    filepath = os.path.join(OUTPUT_DIR, filename)

    if os.path.exists(filepath):
        print(f"  Skipping {filename} (already exists)")
        return True

    try:
        # Use picsum.photos with a seed for consistent images
        url = f"https://picsum.photos/seed/{seed}/1280/720"

        # Create SSL context
        ctx = ssl.create_default_context()

        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())

        print(f"  Downloaded {filename}")
        return True
    except Exception as e:
        print(f"  Error downloading {filename}: {e}")
        return False

def main():
    print(f"Downloading sight images to {OUTPUT_DIR}")
    print("Using Lorem Picsum for placeholder images")
    print("=" * 60)

    success_count = 0
    fail_count = 0

    for filename, seed in SIGHT_IMAGES:
        if download_image(filename, seed):
            success_count += 1
        else:
            fail_count += 1
        # Add delay to avoid rate limiting
        time.sleep(0.5)

    print("=" * 60)
    print(f"Done! Downloaded {success_count} images, {fail_count} failed")

    if success_count > 0:
        print(f"\nImages saved to: {OUTPUT_DIR}")
        print("\nNote: These are placeholder images from Lorem Picsum.")
        print("For best results, replace with actual photos of each landmark.")

if __name__ == '__main__':
    main()

