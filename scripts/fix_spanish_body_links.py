#!/usr/bin/env python3
"""
Fix English links in Spanish blog post bodies.
Translates all English service/page/location links to their Spanish equivalents.
Does NOT touch frontmatter (service_link, location_link stay English).
"""

import re
import sys
from pathlib import Path

BLOG_ES = Path("content/blog/es")

# Service slug translations (from i18n/slug-map.ts)
SERVICE_MAP = {
    'packing-services': 'servicios-de-empaque',
    'local-moving': 'mudanza-local',
    'long-distance-moving': 'mudanza-de-larga-distancia',
    'residential-moving': 'mudanza-residencial',
    'commercial-moving': 'mudanza-comercial',
    'furniture-moving': 'mudanza-de-muebles',
    'celebrity-moving': 'mudanza-de-celebridades',
    'apartment-moving': 'mudanza-de-apartamentos',
    'full-service-moving': 'mudanza-de-servicio-completo',
    'labor-only-moving': 'mudanza-solo-mano-de-obra',
    'military-moving': 'mudanza-militar',
    'same-day-moving': 'mudanza-del-mismo-dia',
    'senior-moving': 'mudanza-para-personas-mayores',
    'student-moving': 'mudanza-estudiantil',
    'safe-moving': 'mudanza-de-cajas-fuertes',
    'antique-moving': 'mudanza-de-antiguedades',
    'office-moving': 'mudanza-de-oficinas',
    'same-building-moving': 'mudanza-dentro-del-mismo-edificio',
    'last-minute-moving': 'mudanza-de-ultimo-momento',
    'hourly-moving': 'mudanza-por-hora',
    'special-needs-moving': 'mudanza-para-necesidades-especiales',
    'appliance-moving': 'mudanza-de-electrodomesticos',
    'piano-moving': 'mudanza-de-pianos',
    'pool-table-moving': 'mudanza-de-mesas-de-billar',
    'hot-tub-moving': 'mudanza-de-jacuzzis',
    'art-moving': 'mudanza-de-arte',
    'white-glove-moving': 'mudanza-de-guante-blanco',
    'specialty-item-moving': 'mudanza-de-articulos-especiales',
    'storage-solutions': 'soluciones-de-almacenamiento',
    'junk-removal': 'retiro-de-basura',
    # Additional service aliases that appear in links
    'long-distance': 'mudanza-de-larga-distancia',
    'furniture-assembly': 'ensamblaje-de-muebles',
    'heavy-item-moving': 'mudanza-de-articulos-pesados',
}

# Static page translations (from i18n/routing.ts)
STATIC_MAP = {
    'about-us': 'sobre-nosotros',
    'contact-us': 'contacto',
    'quote': 'cotizacion',
    'reservations': 'reservaciones',
    'services': 'servicios',
    'locations': 'ubicaciones',
    'reviews': 'resenas',
    'faq': 'preguntas-frecuentes',
    'moving-rates': 'tarifas-de-mudanza',
    'moving-routes': 'rutas-de-mudanza',
    'moving-tips': 'consejos-de-mudanza',
    'moving-checklist': 'lista-de-mudanza',
    'moving-glossary': 'glosario-de-mudanza',
    'why-choose-us': 'por-que-elegirnos',
    'compare': 'comparar',
    'alternatives': 'alternativas',
    'privacy': 'privacidad',
    'terms': 'terminos',
}


def translate_link(path: str) -> str:
    """Translate an English link path to Spanish."""
    # Remove leading slash for matching
    slug = path.lstrip('/')

    # 1. Exact static page match
    if slug in STATIC_MAP:
        return '/' + STATIC_MAP[slug]

    # 2. Exact service match
    if slug in SERVICE_MAP:
        return '/' + SERVICE_MAP[slug]

    # 3. Location-movers pattern: "{location}-movers" -> "mudanzas-{location}"
    if slug.endswith('-movers'):
        location = slug[:-7]  # strip "-movers"
        return '/mudanzas-' + location

    # 4. Location-service combo: "{location}-{service}" -> "{location}-{spanish-service}"
    #    Sort by service slug length descending to match longest first
    for en_service, es_service in sorted(SERVICE_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        if slug.endswith('-' + en_service):
            location = slug[:-(len(en_service) + 1)]
            return '/' + location + '-' + es_service

    # No match - return unchanged
    return path


def process_file(filepath: Path, dry_run: bool) -> int:
    """Process a single Spanish blog post. Returns number of links fixed."""
    text = filepath.read_text(encoding='utf-8')

    # Split into frontmatter and body
    parts = text.split('---', 2)
    if len(parts) < 3:
        return 0

    frontmatter = parts[0] + '---' + parts[1] + '---'
    body = parts[2]

    fixed = 0

    def replace_link(match):
        nonlocal fixed
        prefix = match.group(1)  # everything before the path: "](/", "href=\"/"
        path = match.group(2)    # the path: "/local-moving"
        suffix = match.group(3)  # closing: ")", "\""

        translated = translate_link(path)
        if translated != path:
            fixed += 1
            return prefix + translated + suffix
        return match.group(0)

    # Match markdown links: ](/path) and [text](/path)
    # Also match href="/path" just in case
    new_body = re.sub(
        r'(\]\()(/[a-z][a-z0-9/-]*)(\))',
        replace_link,
        body
    )

    if fixed > 0 and not dry_run:
        filepath.write_text(frontmatter + new_body, encoding='utf-8')

    return fixed


def main():
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print("=== DRY RUN MODE ===\n")

    total_files = 0
    total_links = 0

    for f in sorted(BLOG_ES.glob('*.md')):
        fixed = process_file(f, dry_run)
        if fixed > 0:
            total_files += 1
            total_links += fixed
            if dry_run:
                print(f"  {f.name}: {fixed} links to fix")

    print(f"\n{'Would fix' if dry_run else 'Fixed'} {total_links} links across {total_files} files")

    if dry_run:
        print("\n[DRY RUN - no files were modified]")


if __name__ == '__main__':
    main()
