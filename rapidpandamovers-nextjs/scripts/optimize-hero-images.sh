#!/bin/bash
# Generate responsive WebP + optimized JPG versions of hero images
# Usage: ./scripts/optimize-hero-images.sh
# Requires: cwebp (brew install webp), sips (macOS built-in)

set -e

HERO_DIR="public/images/hero"
WIDTHS=(640 960 1280)
WEBP_QUALITY=80
JPG_QUALITY=80

cd "$(dirname "$0")/.."

for src in "$HERO_DIR"/{1,2,3}.jpg; do
  name=$(basename "$src" .jpg)
  echo "Processing $name.jpg..."

  # Get original dimensions
  orig_w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/{print $2}')
  orig_h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')

  for w in "${WIDTHS[@]}"; do
    # Skip if target width is larger than original
    if [ "$w" -gt "$orig_w" ]; then
      echo "  Skipping ${w}w (larger than original ${orig_w}w)"
      continue
    fi

    # Calculate proportional height
    h=$(( orig_h * w / orig_w ))

    # Resize to temp JPG
    tmp="/tmp/hero-${name}-${w}.jpg"
    cp "$src" "$tmp"
    sips --resampleWidth "$w" -s formatOptions "$JPG_QUALITY" "$tmp" --out "$tmp" > /dev/null 2>&1

    # Generate WebP
    cwebp -q "$WEBP_QUALITY" "$tmp" -o "$HERO_DIR/${name}-${w}w.webp" > /dev/null 2>&1
    echo "  Created ${name}-${w}w.webp"

    # Generate optimized JPG
    cp "$tmp" "$HERO_DIR/${name}-${w}w.jpg"
    echo "  Created ${name}-${w}w.jpg"

    rm -f "$tmp"
  done

  # Also create full-size WebP from original
  cwebp -q "$WEBP_QUALITY" "$src" -o "$HERO_DIR/${name}.webp" > /dev/null 2>&1
  echo "  Created ${name}.webp (full size)"
done

echo ""
echo "Done! Generated files:"
ls -lhS "$HERO_DIR"/*.webp "$HERO_DIR"/*-*w.jpg 2>/dev/null
