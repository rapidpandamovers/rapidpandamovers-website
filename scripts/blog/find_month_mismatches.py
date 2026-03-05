#!/usr/bin/env python3
"""Find posts where the title month doesn't match the publication date month."""

import re
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent.parent / "content" / "blog" / "en"
MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
MONTH_NUM = {m: i+1 for i, m in enumerate(MONTHS)}

mismatches = []
for f in sorted(BLOG_DIR.glob("*.md")):
    content = f.read_text()
    date_match = re.search(r'date:\s*"(\d{4})-(\d{2})-(\d{2})"', content)
    title_match = re.search(r'title:\s*"([^"]+)"', content)
    if not date_match or not title_match:
        continue
    pub_month = int(date_match.group(2))
    title = title_match.group(1).lower()

    for month_name, month_num in MONTH_NUM.items():
        if month_name in title:
            if pub_month != month_num:
                mismatches.append({
                    'file': f.name,
                    'id': f.name.split('-')[0],
                    'title': title_match.group(1),
                    'date': f"{date_match.group(1)}-{date_match.group(2)}-{date_match.group(3)}",
                    'title_month': month_name,
                    'title_month_num': month_num,
                    'pub_month': MONTHS[pub_month - 1],
                    'pub_month_num': pub_month,
                })
            break

print(f"Found {len(mismatches)} date-month mismatches:\n")
for m in mismatches:
    print(f"{m['file']}")
    print(f"  Title: {m['title']}")
    print(f"  Date: {m['date']} (published: {m['pub_month']}, title says: {m['title_month']})")
    print()
