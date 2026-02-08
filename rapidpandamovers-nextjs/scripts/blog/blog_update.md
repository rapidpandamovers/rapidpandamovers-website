# Blog Post Improvement Progress

## AUTONOMOUS PROCESSING MODE

**This process is fully hands-off. No approvals required.**

When processing blog posts:
- Do NOT ask for confirmation before making changes
- Do NOT pause for user approval between steps
- Do NOT ask questions about content decisions
- Process posts continuously until complete
- Make reasonable decisions autonomously based on the guidelines below
- If an image download fails, skip and continue (set needs_ai_image: true)
- If content is ambiguous, use best judgment and move on

## Overview

Total posts: 1044
- Original blog.json: 69 posts (IDs 1-69)
- Gap-filling posts: 207 posts (IDs 70-276)
- Original posts.json: 312 posts (IDs 277-588)
- Extension posts: 456 posts (IDs 589-1044)

## Status Summary

Last updated: 2026-02-04

### By Status
- Pending: 1044
- In Progress: 0
- Completed: 0

### Phase Progress
- [x] Phase -1: Generate gap-filling posts (70-276)
- [x] Phase -0.5: Extend posts through 2030 (589-1044)
- [x] Phase 0: Migrate JSON to individual MD files
- [x] Phase 1: Update blog renderer to read MD files
- [x] Phase 2: Install required skills (responsive-images, qmd)
- [ ] Phase 3: Process posts with parallel subagents (AUTONOMOUS)
- [ ] Phase 4: Handle AI image generation (if needed)

## Files Location

- Markdown posts: `/content/blog/*.md`
- Index file: `/content/blog/index.json`
- Image folders: `/public/images/blog/YYYY/MM/slug/`

---

## Skills and Tools to Use

| Tool/Skill | Purpose | When to Use |
|------------|---------|-------------|
| **WebSearch** | Find real places, verify information, research locations | FIRST - validate content matches title |
| **/agent-browser** | Detailed research requiring page navigation | When WebSearch isn't enough |
| **seo-audit** | Detect AI patterns, thin content, E-E-A-T issues | SECOND - before content rewrites |
| **copywriting** | Rewrite content using proven frameworks | THIRD - apply fixes from audit |
| **programmatic-seo** | Template optimization for location/service posts | For posts matching template patterns |
| **responsive-images** | Generate WebP responsive sizes | After images downloaded |
| **qmd** | Find similar posts to ensure uniqueness | Before editing to check duplicates |
| **find-skills** | Search for and install missing skills | When a skill is unavailable |

### Research Tools (Use for Content-Title Validation)

**WebSearch** - Quick factual lookups
```
WebSearch: "best parks in [city] Florida"
WebSearch: "[restaurant name] [city] FL address"
WebSearch: "[city] Florida neighborhoods"
WebSearch: "[city] FL population demographics"
```

**/agent-browser** - Detailed research with page navigation
```
/agent-browser Search Yelp for top restaurants in [city]
/agent-browser Navigate to [city] official website for neighborhood info
/agent-browser Find school ratings for [city] FL
```

**When to use which:**
- **WebSearch**: Quick facts, addresses, verification, lists of places
- **/agent-browser**: When you need to navigate multiple pages, fill forms, or extract detailed info

### Skill Invocation Commands

**IMPORTANT**: Subagents MUST invoke these skills explicitly, not just reference them.

```bash
# SEO Audit - Run FIRST on every post
/seo-audit [paste post content or describe what to audit]

# Copywriting - Run SECOND to fix issues found
/copywriting [describe what needs rewriting and the post type]

# Programmatic SEO - Run for template-based posts
/programmatic-seo [describe the template pattern]
```

### Installing Missing Skills

Use the **find-skills** skill to search for and install:

1. `/find-skills responsive images` - Find responsive image resizing skill
2. `/find-skills qmd markdown query` - Find markdown query skill
3. Install with: `npx skills add <owner/repo@skill> -g -y`

Browse available skills at: https://skills.sh/

---

## Title Guidelines

**Blog post titles MUST NOT contain the year.** Remove any year references from titles.

### Title Rules

1. **No year in title**: Use `python scripts/blog/blog_rename.py --fix` to remove years
2. **Keep titles under 60 characters** for SEO
3. **Use action words**: "Guide", "Tips", "Checklist", "How to"
4. **Be specific**: "Senior Moving Checklist" is better than "Moving Checklist"
5. **Preserve locations**: "Miami Moving Tips" keeps "Miami" when removing year
6. **No trailing special characters**: Titles must end with a letter or number

### Examples

| ❌ Bad Title | ✅ Good Title |
|-------------|--------------|
| "Miami Moving Tips for 2024" | "Miami Moving Tips" |
| "Best Miami Movers 2025" | "Best Miami Movers" |
| "Miami Dining in 2024: A Guide" | "Miami Dining: A Guide" |
| "2024 Packing Guide" | "Packing Guide" |

---

## Content Quality Workflow

### The 10-Step Process

Each step uses a dedicated script. Follow these steps in sequence:

```
┌─────────────────────────────────────────────────────────────────────┐
│ THE 10-STEP BLOG POST WORKFLOW                                      │
├─────────────────────────────────────────────────────────────────────┤
│  1. CLASSIFY      - Identify post type and framework                │
│  2. TITLE FIX     - Remove year, fix slug/filename/images           │
│  3. DUPLICATES    - Check for similar posts, handle if found        │
│  4. CONTENT       - Verify title promise, fix accuracy              │
│  5. WRITING       - Fix AI patterns, apply framework                │
│  6. SECTIONS      - Add CTA, FAQ, Related Services                  │
│  7. LINKS         - Set service_link and location_link              │
│  8. IMAGES        - Download content-matched, process, embed        │
│  9. COMPLETE      - Update readTime, fix excerpt length             │
│ 10. VERIFY        - Confirm all checks pass                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Individual Scripts

| Step | Script | Purpose |
|------|--------|---------|
| 1 | `blog_validate.py` | Classify post type, check AI patterns, check image_keywords |
| 2 | `blog_rename.py --fix` | Remove year, update slug/filename/images |
| 3 | `blog_similar.py` | Find duplicate/similar posts |
| 4-6 | Manual editing + skills | Content validation, rewriting, **update image_keywords** |
| 7 | `blog_categorize.py` | Set category from service_link |
| 8 | `blog_images.py --all` | Download, rename, resize, embed images |
| 9 | `blog_wordcount.py --fix` | Update readTime, fix excerpt length |
| 10 | `blog_validate.py` | Final validation |

**image_keywords:** During step 4, evaluate and update `image_keywords` based on the actual post content. These keywords are used for image search in step 8. Choose 3-4 descriptive terms that would find relevant stock photos (e.g., "senior couple packing", "moving truck neighborhood", "apartment boxes urban").

### Running the Workflow

**Full workflow for a single post:**
```bash
# Step 1: Classify and validate
python scripts/blog/blog_validate.py {POST_ID}

# Step 2: Fix title/slug/filename
python scripts/blog/blog_rename.py {POST_ID} --fix

# Step 3: Check for duplicates
python scripts/blog/blog_similar.py {POST_ID}

# Steps 4-6: Manual content work (edit file, use /seo-audit and /copywriting)

# Step 7: Update category
python scripts/blog/blog_categorize.py {POST_ID}

# Step 8: Process images (download, rename, resize, embed, cleanup)
python scripts/blog/blog_images.py {POST_ID} --clean --download --rename --resize --embed --update-array --cleanup
# Or use --all for all image steps:
python scripts/blog/blog_images.py {POST_ID} --all --query "senior moving"

# Step 9: Update readTime and fix excerpt length
python scripts/blog/blog_wordcount.py {POST_ID} --fix

# Step 10: Final validation
python scripts/blog/blog_validate.py {POST_ID}
```

**Quick workflow for posts needing minimal changes:**
```bash
python scripts/blog/blog_rename.py {POST_ID} --fix
python scripts/blog/blog_categorize.py {POST_ID}
python scripts/blog/blog_images.py {POST_ID} --all --query "moving boxes"
python scripts/blog/blog_wordcount.py {POST_ID} --fix
python scripts/blog/blog_validate.py {POST_ID}
```

---

### Step 1: Classify

Identify the post type to determine which copywriting framework to use:

| Post Type | Indicators | Framework |
|-----------|------------|-----------|
| LOCATION_GUIDE | City/neighborhood in title | BAB (Before/After/Bridge) |
| SERVICE_GUIDE | Service type in title | PAS (Problem/Agitate/Solution) |
| HOW_TO | "How to", steps, process | 4Cs (Clear/Concise/Compelling/Credible) |
| LISTICLE | Number in title ("5 Tips") | Value-first (best items early) |
| LIFESTYLE | Culture, dining, events | AIDA (Attention/Interest/Desire/Action) |

`blog_validate.py` does this automatically. Check the output for post type.

---

### Step 2: Title Fix

Fix the title and all related fields:

- **Title** - Remove year (2024, 2025), fix bad endings
- **Slug** - Regenerate from title
- **Filename** - Rename to `{ID}-{slug}.md`
- **Image folder** - Move to match new slug

`blog_rename.py --fix` does this automatically.

**Checklist:**
- [ ] No year in title
- [ ] Under 60 characters
- [ ] Slug matches title
- [ ] Filename matches slug

---

### Step 3: Duplicates

Check for similar posts using `blog_similar.py`.

**If duplicate warnings appear:**

```bash
qmd search "{title keywords}" --limit 10
```

#### If DUPLICATE Found

A duplicate is a post with the same topic, location, AND angle. If found:

1. **Identify what's MISSING** from existing post(s):
   - Different angle? (budget vs luxury, families vs seniors, renters vs buyers)
   - Different aspect? (neighborhoods vs schools vs dining vs recreation)
   - Different format? (comprehensive guide vs quick tips vs checklist)
   - Different audience? (first-time movers vs repeat movers, young professionals vs retirees)

2. **Research a fresh angle** using WebSearch:
   ```
   WebSearch: "[city] moving tips for [new audience]"
   WebSearch: "[city] [new aspect] guide"
   ```

3. **Create NEW title and content plan** - must be meaningfully different

4. **Update the post** with new title, slug, and content outline

5. **Re-run Step 2** (Title Fix) to process the new title:
   ```bash
   python scripts/blog/blog_validate.py {POST_ID}
   ```

**If NO duplicate:** Continue to Step 4.

---

### Step 4: Content Validation

**Verify content matches the title AND is location-accurate.**

#### Title Promise Rules

| Title Pattern | Content MUST Have |
|--------------|-------------------|
| "Best Neighborhoods in [City]" | Actual neighborhoods IN that city with descriptions |
| "X Best Parks in [City]" | X real parks in that city with names, addresses, features |
| "X Best Restaurants in [City]" | X real restaurants in that city with names, cuisine types |
| "Moving to [City]" | Information specific to that city, not generic Miami |
| "X Tips for [Topic]" | Exactly X distinct tips about that topic |
| "[City] Guide" | Content about THAT city, not neighboring cities |

#### Research Requirements

**Use these tools to verify and add accurate location-specific information:**

1. **Web Search** - Find real places, addresses, and current information
   ```
   WebSearch: "best parks in Hialeah Florida"
   WebSearch: "Coral Gables neighborhoods 2024"
   WebSearch: "[business name] address Miami"
   ```

2. **Agent Browser** - For detailed research requiring page navigation
   ```
   /agent-browser Navigate to city website, find neighborhood info
   /agent-browser Search Yelp for top-rated restaurants in [city]
   ```

3. **WebFetch** - For specific pages with known URLs
   ```
   WebFetch: city official website, chamber of commerce, etc.
   ```

#### Validation Checklist

For **LISTICLE** posts (X Best/Top/Ways):

**⚠️ CRITICAL CHECK: Does the content deliver ACTUAL NAMED PLACES, or just generic tips?**

| Title Pattern | WRONG (Generic Tips) | RIGHT (Named Places) |
|---------------|---------------------|---------------------|
| "6 Must-Try Dining Spots in Aventura" | Tips for finding restaurants | Bourbon Steak, Timo, Corsair, etc. |
| "8 Top Workout Spots in Miami Lakes" | How to choose a gym | LA Fitness, Orangetheory, CrossFit, etc. |
| "9 Secret Spots in Indian Creek" | How to explore a new area | Surf Club Restaurant, Bal Harbour Shops, etc. |

**Listicle posts that promise places MUST deliver named places with details, NOT generic advice.**

- [ ] Content delivers NAMED PLACES, not generic tips for finding places
- [ ] Title count matches content count (if "5 Best Parks", there are exactly 5 parks)
- [ ] Each item is REAL and VERIFIABLE (real names, real addresses)
- [ ] Items are in the CORRECT LOCATION (not places from neighboring cities)
- [ ] Items have specific details (addresses, hours, features, what makes them special)

For **LOCATION_GUIDE** posts:
- [ ] Neighborhoods mentioned are IN that city (not neighboring cities)
- [ ] Local landmarks are accurate and exist
- [ ] Schools, hospitals, shopping mentioned are in that city
- [ ] Drive times and distances are accurate
- [ ] Population, demographics are current

For **SERVICE_GUIDE** posts with location:
- [ ] Service tips are relevant to that location's characteristics
- [ ] Any mentioned businesses/resources are in that area
- [ ] Weather/climate references match that specific area

#### Common Mistakes to Catch

| Mistake | Problem | Fix |
|---------|---------|-----|
| **"8 Top Restaurants" has 8 tips for finding restaurants** | **Generic tips, not named places** | **Research 8 real restaurants with names, addresses, details** |
| "Best neighborhoods in Hialeah" lists Coral Gables neighborhoods | Wrong city | Research and list actual Hialeah neighborhoods |
| "5 Best Parks" only has 3 parks listed | Count mismatch | Add 2 more real parks OR change title to "3 Best Parks" |
| Location guide mentions generic "Miami beaches" | Too generic | Name specific beaches accessible from THAT city |
| Restaurant list has made-up names | Fabricated content | Web search for real restaurants |
| "Top gyms in [City]" lists gyms from another city | Wrong location | Research gyms actually in that city |
| "9 Secret Spots" lists ways to discover spots | Tips instead of spots | Research 9 actual named locations with specifics |

#### Research Workflow

```
1. EXTRACT PROMISE: What does the title promise?
   - Location: What city/neighborhood?
   - Count: How many items (if listicle)?
   - Type: What kind of places/tips?
   - Does it promise NAMED PLACES? (restaurants, gyms, parks, spots)

2. SCAN CONTENT: Does current content deliver?
   ⚠️ CRITICAL FOR LISTICLES:
   - Does content have ACTUAL NAMED PLACES or just GENERIC TIPS?
   - "6 Must-Try Dining Spots" → Must list 6 restaurant NAMES
   - "8 Top Workout Spots" → Must list 8 gym/park NAMES
   - "9 Secret Spots" → Must list 9 location NAMES

   - List all items/places mentioned
   - Verify each is in the correct location
   - Check count matches title

3. RESEARCH GAPS: What's missing or wrong?
   - If content has tips instead of places → FULL REWRITE needed
   - Use WebSearch to find real places: "[type] in [city] FL"
   - Use /agent-browser for detailed info
   - Verify addresses and current status

4. UPDATE CONTENT: Fix with accurate information
   - Replace generic tips with real named places
   - Replace fabricated items with real ones
   - Add missing items to match count
   - Include specific details (addresses, hours, features)
   - Cite sources where helpful (e.g., "rated 4.8 on Google")
```

#### Example: Fixing a Listicle (Generic Tips → Named Places)

**Title:** "8 Best Restaurants to Try in Homestead After Your Move"

**Step 1 - Extract Promise:**
- Location: Homestead, FL
- Count: 8 restaurants
- Type: Restaurants worth trying
- **Promises NAMED PLACES? YES** - "8 Best Restaurants" = 8 restaurant names

**Step 2 - Scan Content:**
⚠️ **MISMATCH DETECTED:** Current content has 8 "tips for finding restaurants" but NO actual restaurant names.

This is the most common content-title mismatch:
- ❌ "Tip 1: Ask locals for recommendations"
- ❌ "Tip 2: Check Yelp reviews"
- ✅ Should be: "1. Shivers BBQ - 28001 S Dixie Hwy - Famous for smoked meats"

**Step 3 - Research:**
```
WebSearch: "best restaurants in Homestead Florida"
WebSearch: "top rated restaurants Homestead FL Yelp"
```

**Step 4 - Update with Real Restaurants:**
1. **Shivers BBQ** - 28001 S Dixie Hwy - Famous for smoked meats, local institution
2. **Royal Palm Grill** - 315 N Krome Ave - Classic American diner, open since 1985
3. **Casita Tejas** - 27 N Krome Ave - Authentic Mexican, known for tacos al pastor
4. **The Capri Restaurant** - 935 N Krome Ave - Italian, family-owned since 1958
5. **Angie's Cafe** - 404 SE 1st Ave - Cuban coffee and sandwiches
6. **Sake Room** - 241 N Krome Ave - Sushi and Japanese
7. **El Toro Taco** - 1 S Krome Ave - Mexican, great for quick bites
8. **White Lion Cafe** - 146 NW 7th St - Breakfast spot, local favorite

---

### Step 5: Writing Quality (/seo-audit + /copywriting)

**Combined step for improving writing quality.**

#### Part A: /seo-audit

**INVOKE**: `/seo-audit` with the post content to identify:
- AI writing patterns
- Thin content sections
- Missing E-E-A-T signals

##### AI Patterns to Fix

| Pattern | Problem | Fix |
|---------|---------|-----|
| Em dashes (—) | AI signature | Replace with commas, periods, or rewrite |
| "In today's world" | Generic filler | Delete or replace with specific context |
| "It's important to note" | Weak hedge | State the point directly |
| "Dive into" | Overused AI phrase | Use "explore", "learn", "discover", or remove |
| "Navigate/Navigating" | AI favorite | Use "handle", "manage", "deal with" |
| "Crucial/Essential" | Overused emphasis | Use sparingly, vary with "key", "important" |
| "Comprehensive guide" | Generic | Be specific: "step-by-step checklist" |
| "In this article" | Meta-reference | Delete - reader knows they're reading |
| "Let's explore" | Forced engagement | Just start explaining |
| "At the end of the day" | Cliché | Delete or be specific |

##### Thin Content Fixes

| Issue | Minimum Fix |
|-------|-------------|
| Section < 50 words | Expand with specific details, examples, or tips |
| No examples | Add 1-2 concrete examples per major section |
| Generic advice | Add Miami-specific or service-specific details |
| Missing "why" | Explain benefits, not just instructions |

#### Part B: /copywriting

**INVOKE**: `/copywriting` with the post type and issues to fix

##### Framework Selection by Post Type

| Post Type | Framework | Why |
|-----------|-----------|-----|
| **LOCATION_GUIDE** | **BAB** | Before/After/Bridge - Show the transformation |
| **SERVICE_GUIDE** | **PAS** | Problem/Agitate/Solution - Agitate the problem, then solve |
| **HOW_TO** | **4Cs** | Clear/Concise/Compelling/Credible |
| **LISTICLE** | **Value-first** | Lead with strongest items |
| **LIFESTYLE** | **AIDA** | Attention/Interest/Desire/Action |

##### PAS Framework (Problem → Agitate → Solution)

```markdown
## The Challenge of [Topic]
[State the problem - 2-3 sentences]

### Why This Matters
[Agitate - consequences of not solving - 2-3 sentences]

### How to Solve It
[Your solution - the main content]
```

##### BAB Framework (Before → After → Bridge)

```markdown
## Moving to [Location]

### Before: [The Current Struggle]
[Describe reader's current situation - specific, relatable]

### After: [The Desired Outcome]
[Paint the picture of success - specific benefits]

### The Bridge: How to Get There
[Your solution that connects before to after]
```

##### Natural Transitions (Replace Robotic Flow)

| ❌ Robotic | ✅ Natural |
|-----------|-----------|
| "Firstly... Secondly..." | "Start with... Once that's done..." |
| "Furthermore..." | "Even better..." or "Here's another approach..." |
| "In conclusion..." | "The bottom line:" or just summarize |
| "It should be noted..." | Just state it directly |

---

### Step 6: Supplementary Sections

Add required sections to complete the post. These must be added manually via editing.

#### Uniqueness Requirements

| Type | Uniqueness Requirement |
|------|------------------------|
| **Template Post** | Real local data, not just variable swaps |
| **Listicle** | Unique items, no overlap with similar posts |
| **Location Guide** | Accurate local details for THAT city |

```
TEMPLATE VARIABLES (must be filled with REAL data):
- {location} - City/neighborhood name
- {location_characteristics} - Unique traits of this area
- {local_landmarks} - Nearby landmarks, streets
- {demographics} - Who lives there
- {price_range} - Local cost context
- {seasonal_factors} - Weather, events specific to area
```

**Rule**: Template structure is OK, but every variable must have REAL, UNIQUE data - not just swapped city names.

#### For Listicles

1. Query all listicles with similar topics using qmd
2. Compare list items across posts
3. Each item must be unique OR significantly different in explanation
4. Title count MUST match actual content items

**Example - Checking for Duplicate List Items:**
```bash
# Find all "packing tips" listicles
qmd search "packing tips" --limit 20

# Check if "Use small boxes for heavy items" appears in multiple posts
# If yes: rewrite to be unique OR remove from one post
```

#### Uniqueness Checklist

- [ ] No duplicate titles across all 1044 posts
- [ ] No duplicate list items between similar listicles
- [ ] Unique value per page - not just variable swapping
- [ ] Location posts have REAL local details (not generic)
- [ ] Service posts have specific examples (not just definitions)

#### Required Sections

Every post should have these supplementary sections. Add where missing:

### For Service-Focused Posts

```markdown
## Benefits of Professional [Service Name]

Working with experienced movers provides several advantages:

- **Expertise**: Professional movers handle [specific items] regularly
- **Equipment**: Proper tools and materials for safe transport
- **Insurance**: Protection for your valuable belongings
- **Efficiency**: Trained teams work faster without sacrificing quality

## What to Expect from Rapid Panda Movers

When you hire us for [**service name**](/{location}-{service}), you can expect:

1. **Free Consultation**: We assess your needs and provide a transparent quote
2. **Professional Crew**: Uniformed, trained moving professionals
3. **Quality Materials**: High-quality packing materials and equipment
4. **Careful Handling**: Every item treated with respect
5. **On-Time Service**: We arrive when promised and complete on schedule

## Related Services

Depending on your needs, you might also consider:

- [**Packing Services**](/{location}-packing-services) - Professional packing for {location} residents
- [**Full-Service Moving**](/{location}-full-service-moving) - Complete door-to-door solutions
- [**Local Moving**](/{location}-local-moving) - Efficient same-city relocations

## Ready to Get Started?

**[Request your free quote](/quote)** today. Our team is ready to make your move as smooth as possible.

Read our **[customer reviews](/reviews)** to see why Miami families trust Rapid Panda Movers.
```

### For Location-Focused Posts

```markdown
## Neighborhoods to Consider

When planning your move to {Location}, consider these popular areas:

- **{Neighborhood 1}**: Known for {characteristic}
- **{Neighborhood 2}**: Popular with {demographic}
- **{Neighborhood 3}**: Features {amenity}

## Essential Services to Locate

As a new {Location} resident, you'll want to find:

- **Healthcare**: Hospitals, clinics, and specialty care
- **Schools**: Public, private, and charter options
- **Shopping**: Grocery stores and retail centers
- **Recreation**: Parks, gyms, and entertainment venues

## Our {Location} Moving Services

Our team has extensive experience helping families relocate to [**{Location}**](/{location}-movers):

- [**Local Moving**](/{location}-local-moving) - Perfect for relocations within Miami-Dade
- [**Apartment Moving**](/{location}-apartment-moving) - High-rise and condo expertise
- [**Residential Moving**](/{location}-residential-moving) - House-to-house moves
- [**Packing Services**](/{location}-packing-services) - Full-service packing and materials

## Ready to Make {Location} Home?

**[Get your free quote](/quote)** for moving to {Location}. Our team is ready to make your transition smooth.

Questions? **[Contact us](/contact-us)** or read our **[reviews](/reviews)**.
```

### FAQ Section (Add When Relevant)

Add an FAQ section for posts that answer common questions or cover complex topics:

```markdown
## Frequently Asked Questions

### How much does [service] cost in Miami?

[Specific answer with price ranges or factors that affect cost]

### How long does [service] typically take?

[Realistic timeframes based on scope]

### Do I need to [common concern]?

[Clear, helpful answer]

### What should I prepare before [service]?

[Actionable checklist or tips]
```

**When to add FAQ:**
- Service-focused posts (pricing, process questions)
- Location guides (neighborhood questions, logistics)
- How-to posts (clarifying common confusion points)
- Posts targeting question-based search queries

### CTA Section Rules

Every post MUST end with a clear call-to-action:

1. **Primary CTA**: Link to `/quote` for free estimate
2. **Secondary CTA**: Link to `/reviews` or `/contact-us`
3. **Contextual link**: Link to relevant service or location page

**Example CTAs:**
```markdown
## Ready to Get Started?

**[Request your free quote](/quote)** today and discover why Miami families trust Rapid Panda Movers.

## Make Your Move Stress-Free

**[Get your free estimate](/quote)** or **[contact us](/contact-us)** with questions. Check out our **[reviews](/reviews)** to see what customers say.
```

---

### Step 7: Links

Set the service and location links in frontmatter:

```yaml
service_link: "/senior-moving"           # or "/{location}-{service}" or null
location_link: "/coral-gables-movers"    # or null for non-location posts
```

**Rules:**
- `service_link`: Primary service this post relates to
- `location_link`: Location page if post is location-specific
- Set to `null` if not applicable

---

### Step 8: Images

Download and process content-matched images:

```bash
python scripts/blog/blog_images.py {POST_ID} --all --query "senior packing"
```

**Query selection:**
| Post Type | Query Examples |
|-----------|---------------|
| Senior moving | "senior packing", "elderly couple moving" |
| Family moving | "family moving", "family packing home" |
| Student moving | "student moving", "college dorm" |
| Location guide | "[city] Florida", "[city] skyline" |
| Packing | "packing cardboard", "moving supplies" |

This command handles all image steps: clean, download, rename, resize, embed, update frontmatter.

---

### Step 9: Complete

Update readTime and excerpt length:

```bash
python scripts/blog/blog_wordcount.py {POST_ID} --fix
```

This script checks and fixes:
- **readTime** - Based on word count (200 WPM, minimum 2 min)
- **Excerpt length** - Truncates to 155 chars max for SEO

If excerpt is too long, it will be automatically truncated at a word boundary with a period added.

---

### Step 10: Verify

Confirm the post passes all checks:

```bash
python scripts/blog/blog_validate.py {POST_ID}
```

**Final checklist:**
- [ ] No validation errors
- [ ] Images display correctly
- [ ] All links work
- [ ] Content matches title promise

Move to the next post.

---

## Reference: Read Time Calculation

Update `readTime` in frontmatter based on actual word count after content changes.

### Formula

```
readTime = ceil(wordCount / 200) + " min read"
```

- Average reading speed: 200 words per minute
- Round up to nearest minute
- Minimum: "2 min read"

### Word Count Guidelines

| Word Count | readTime |
|------------|----------|
| 1-400 | 2 min read |
| 401-600 | 3 min read |
| 601-800 | 4 min read |
| 801-1000 | 5 min read |
| 1001-1200 | 6 min read |
| 1201-1400 | 7 min read |
| 1401-1600 | 8 min read |
| 1601-1800 | 9 min read |
| 1801-2000 | 10 min read |
| 2001+ | 11+ min read |

### Calculating Word Count

```bash
# Using the blog_wordcount.py script (recommended)
python scripts/blog/blog_wordcount.py 0001              # Check single post
python scripts/blog/blog_wordcount.py 0001 --fix        # Check and fix readTime
python scripts/blog/blog_wordcount.py --all             # Check all posts
python scripts/blog/blog_wordcount.py --all --fix       # Fix all posts
```

Or manually:
```bash
# Count words in markdown body (excluding frontmatter)
sed -n '/^---$/,/^---$/d; p' {file} | wc -w
```

**Always update readTime when:**
- Adding new sections (FAQ, CTA, Related Services)
- Expanding thin content
- Significantly rewriting content

---

## Image Processing Workflow

### Image Requirements

- **3-5 images per post** (not a fixed number)
- **WebP format** for all images (smaller file size, better quality)
- **Responsive sizes** with srcset for different viewports
- **Lazy loading** for all images below the fold
- **Eager loading** only for featured/hero image (LCP optimization)

### Step 0: Build Content-Matched Search Queries (CRITICAL)

**DO NOT just use the `image_keywords` from frontmatter!** Build specific queries that match the post's audience and content.

#### Query Building Formula

```
[audience] + [action/setting] + [context]
```

#### Search Queries by Post Type

| Post Type | BAD Generic Query | GOOD Specific Queries |
|-----------|-------------------|----------------------|
| Senior Moving | "moving boxes" | "elderly couple packing boxes", "senior citizens moving day", "retired couple new home" |
| Family Moving | "moving boxes" | "family with kids packing", "parents children moving day", "family carrying boxes" |
| Student Moving | "moving boxes" | "college student dorm room", "young adult apartment move", "university student packing" |
| Military Moving | "moving boxes" | "military family relocation", "soldier family packing", "military base housing" |
| Commercial | "moving boxes" | "office movers furniture", "business relocation", "corporate moving team" |
| Packing Tips | "moving boxes" | "professional packers wrapping", "bubble wrap fragile", "organized packing boxes" |
| [City] Guide | "moving boxes" | "[city] Florida skyline", "[city] neighborhood homes", "[specific landmark]" |

#### Diversification Strategies

To avoid the same images appearing across posts:

1. **Use synonyms**: "relocating" vs "moving", "packing" vs "boxing up"
2. **Add setting**: "living room", "kitchen", "garage", "outdoors"
3. **Add emotion**: "happy family", "organized", "stress-free"
4. **Add specifics**: "cardboard boxes", "moving truck", "hand dolly", "wardrobe box"
5. **Search different sites**: Unsplash, Pexels, Pixabay (rotate between them)

#### Image Download with blog_images.py

The `blog_images.py` script uses the Pexels API directly (PEXELS_API_KEY from .env):

```bash
# RECOMMENDED: Use simple 2-3 word queries
python scripts/blog/blog_images.py 0001 --download --query "senior packing"
python scripts/blog/blog_images.py 0001 --download --query "elderly couple moving"

# Auto-generate query from post category (less specific)
python scripts/blog/blog_images.py 0001 --download

# Specify count (default is random 3-5 for variety)
python scripts/blog/blog_images.py 0001 --download --count 4

# Full workflow: download + rename + resize
python scripts/blog/blog_images.py 0001 --download --rename --resize
```

---

### Step 1: Download Images

Use the `blog_images.py` script to download images for a post:

```bash
# RECOMMENDED: Clean existing images first, then download fresh
python scripts/blog/blog_images.py 0001 --clean --download --query "senior packing"
python scripts/blog/blog_images.py 0001 --clean --download --query "elderly couple moving"
python scripts/blog/blog_images.py 0001 --clean --download --query "family moving"

# Auto-generate query from category/keywords (less specific)
python scripts/blog/blog_images.py 0001 --clean --download

# Specify number of images (3-5 recommended)
python scripts/blog/blog_images.py 0001 --clean --download --count 4
```

Query tips:
```bash
# GOOD - simple terms that work well
--query "senior packing"
--query "elderly couple moving"
--query "family moving"
--query "office relocation"

# BAD - complex phrases that return poor results
--query "gray haired elderly couple packing moving boxes for relocation"
--query "boxes"  # Gets confused with "boxing" sport
```

### Step 2: SEO-Optimized Naming

Use the `blog_images.py` script to rename images:

```bash
python scripts/blog/blog_images.py 0001 --rename
```

Naming convention:
- Format: `{primary-keyword}-{descriptor}.webp`
- Example: `senior-moving-checklist-packing-boxes.webp`
- **Never use generic names** like `pexels-12345.jpg`

### Step 3: Convert to WebP and Generate Responsive Sizes

Use the `blog_resize.py` script:

```bash
# Convert to WebP and generate responsive sizes
python scripts/blog/blog_resize.py 0001

# Or specify a directory directly
python scripts/blog/blog_resize.py --dir public/images/blog/2024/01/post-slug/
```

This converts to WebP and generates sizes: 400w, 800w, 1200w, 1600w using macOS `sips`.

Output structure:
```
public/images/blog/2024/01/post-slug/
├── featured.webp           # Original/largest
├── featured-400w.webp      # Mobile
├── featured-800w.webp      # Mobile retina / Tablet
├── featured-1200w.webp     # Desktop
├── featured-1600w.webp     # Desktop retina
├── image-2.webp            # Second image
├── image-2-400w.webp
├── image-2-800w.webp
├── image-2-1200w.webp
└── ...                     # 3-5 images total
```

### Step 4: Update Frontmatter

```yaml
featured: "/images/blog/2024/01/slug/featured.webp"
images:
  - "/images/blog/2024/01/slug/featured.webp"
  - "/images/blog/2024/01/slug/image-planning.webp"
  - "/images/blog/2024/01/slug/image-tips.webp"
  - "/images/blog/2024/01/slug/image-checklist.webp"  # 3-5 images
```

### Step 5: Embed Responsive Images in Body Copy

Use the responsive image markdown syntax with srcset:

```markdown
## Section Heading

Paragraph of content here...

<figure>
  <img
    src="/images/blog/2024/01/slug/image-1-800w.webp"
    srcset="
      /images/blog/2024/01/slug/image-1-400w.webp 400w,
      /images/blog/2024/01/slug/image-1-800w.webp 800w,
      /images/blog/2024/01/slug/image-1-1200w.webp 1200w
    "
    sizes="(max-width: 768px) 100vw, 800px"
    alt="Descriptive alt text with keywords"
    width="800"
    height="600"
    loading="lazy"
  />
</figure>

More content continues...
```

**For simple markdown (when renderer doesn't support HTML):**
```markdown
![Descriptive alt text](/images/blog/2024/01/slug/image-1.webp)
```

### Step 6: Validate Image-Content Match

**Before finalizing, verify images match the content:**

| Check | Question | If No |
|-------|----------|-------|
| Audience | Do people in images match target audience? (seniors for senior content, families for family content) | Delete and re-search with audience-specific query |
| Activity | Does the activity shown match the post topic? (packing for packing post, moving for moving post) | Delete and re-search with activity-specific query |
| Setting | Is the setting appropriate? (residential for home moving, office for commercial) | Delete and re-search |
| Uniqueness | Are these images different from recent posts? | Search different stock site or use different query |
| Quality | Are images clear, professional, well-lit? | Delete and find better quality images |

**Common Mismatches to Catch:**

| Post Topic | Wrong Image | Right Image |
|------------|-------------|-------------|
| Senior Moving | Young couple with boxes | Elderly couple, gray hair visible |
| Family Moving | Single person | Parents with children |
| Student Moving | Professional movers | Young adult, dorm/apartment setting |
| Luxury/Celebrity | Basic apartment | High-end home, upscale setting |
| Commercial Moving | Home setting | Office, cubicles, business environment |

---

### Image Placement Guidelines

- **3-5 images per post** (varies based on content length)
- Place 1 image after every 2-3 sections (H2 headings)
- Use descriptive alt text with keywords (SEO benefit)
- Don't cluster images together
- Featured image displays at top automatically (from frontmatter)
- Additional images go in body copy to break up text

### Loading Strategy (Core Web Vitals)

| Image Position | loading | fetchpriority | Why |
|----------------|---------|---------------|-----|
| Featured/Hero (LCP) | `eager` | `high` | Optimize LCP, prioritize download |
| First body image | `eager` | omit | May be above fold |
| All other images | `lazy` | omit | Defer until near viewport |

---

## Service Link Mapping

Match post content to the appropriate service. Set `service_link` to the matching service URL.

### Location-Specific Service Links

**When a post is about a specific location AND a service, use the location-specific format:**
- Format: `/{location}-{service}`
- Examples:
  - `/miami-local-moving`
  - `/miami-packing-services`
  - `/coral-gables-residential-moving`
  - `/hialeah-apartment-moving`

### Base Service Slugs

| Service Slug | Keywords to Match |
|-------------|-------------------|
| `local-moving` | local move, same city, within Miami, short distance |
| `long-distance-moving` | long distance, interstate, cross-country, out of state |
| `packing-services` | packing, unpacking, boxing, wrap, materials |
| `residential-moving` | residential, home, house, apartment (general) |
| `apartment-moving` | apartment, condo, unit, building move |
| `commercial-moving` | commercial, business, corporate |
| `office-moving` | office, workplace, corporate relocation |
| `senior-moving` | senior, elderly, retirement, 55+, assisted living |
| `military-moving` | military, veteran, PCS, deployment |
| `student-moving` | student, college, university, dorm |
| `furniture-moving` | furniture, heavy items, couch, bed |
| `safe-moving` | safe, vault, heavy safe, gun safe |
| `antique-moving` | antique, vintage, collectible, heirloom |
| `special-needs-moving` | special needs, accessibility, medical equipment |
| `celebrity-moving` | celebrity, VIP, high-profile, luxury |
| `same-day-moving` | same day, urgent, emergency, rush |
| `last-minute-moving` | last minute, rushed, sudden, quick |
| `hourly-moving` | hourly, by the hour, flexible, labor |
| `labor-only-moving` | labor only, loading, unloading, no truck |
| `same-building-moving` | same building, different floor, within building |
| `full-service-moving` | full service, complete, all-inclusive |

### Service Link Rules

**IMPORTANT: If a post has a `location_link`, the `service_link` MUST use location-specific format.**

#### Decision Tree

```
Does the post have a location_link (e.g., /miami-movers, /pinecrest-movers)?
├── YES → service_link MUST be /{location}-{service}
│         Examples:
│         - location_link: /pinecrest-movers → service_link: /pinecrest-local-moving
│         - location_link: /homestead-movers → service_link: /homestead-packing-services
│         - location_link: /miami-movers → service_link: /miami-local-moving
│
│         Exception: Lifestyle posts (restaurants, activities, plants)
│         - If post is NOT about moving services → service_link: null
│         - Examples: "Best Restaurants in Homestead" → service_link: null
│
└── NO (location_link: null) → Use generic service link
          Examples:
          - /local-moving
          - /packing-services
          - /long-distance-moving
```

#### Examples

| Post Type | location_link | service_link |
|-----------|---------------|--------------|
| "Moving to Pinecrest Guide" | `/pinecrest-movers` | `/pinecrest-local-moving` |
| "Homestead Packing Tips" | `/homestead-movers` | `/homestead-packing-services` |
| "Miami Senior Moving" | `/miami-movers` | `/miami-senior-moving` |
| "Best Restaurants in Coral Gables" | `/coral-gables-movers` | `null` (lifestyle) |
| "10 Fun Things with Kids in Opa-locka" | `/opa-locka-movers` | `null` (lifestyle) |
| "General Packing Tips" | `null` | `/packing-services` |
| "Long Distance Moving Guide" | `null` | `/long-distance-moving` |
| "How to Choose a Mover" | `null` | `/residential-moving` |

#### Quick Rules

1. **Location guide/relocation post** → `/{location}-local-moving`
2. **Location + specific service** → `/{location}-{service}`
3. **Lifestyle post (food, activities, plants)** → `null`
4. **General tips (no location)** → `/{service}` or `/residential-moving`
5. **Multiple services mentioned** → Pick PRIMARY from title

---

## Location-Specific Content Requirements

**CRITICAL: Content must be about THAT specific location, not generic Miami.**

### What "Location-Specific" Means

| Post About | Content MUST Reference | NOT Acceptable |
|------------|----------------------|----------------|
| Hialeah | Hialeah landmarks, Hialeah schools, Hialeah parks | Generic "Miami-area" content |
| Homestead | Homestead businesses, Homestead neighborhoods | Florida City or Cutler Bay content |
| Coral Gables | Miracle Mile, Venetian Pool, Coral Gables schools | Coconut Grove or South Miami content |
| Pinecrest | Pinecrest Gardens, Palmetto Senior High | Generic "South Miami" references |

### Research Required for Each Location Type

**For LOCATION_GUIDE posts, you MUST research and include:**

1. **Specific Neighborhoods** within that city
   ```
   WebSearch: "[city] Florida neighborhoods map"
   WebSearch: "where to live in [city] FL"
   ```

2. **Local Landmarks** that are IN that city
   ```
   WebSearch: "[city] FL parks"
   WebSearch: "[city] Florida attractions"
   ```

3. **Schools** that serve that city
   ```
   WebSearch: "[city] FL public schools"
   WebSearch: "[city] Florida school ratings"
   ```

4. **Local Businesses** (hospitals, shopping, groceries)
   ```
   WebSearch: "hospitals near [city] FL"
   WebSearch: "[city] Florida shopping centers"
   ```

5. **Accurate Drive Times** from that specific location
   ```
   WebSearch: "[city] FL to downtown Miami drive time"
   WebSearch: "[city] to [destination] distance"
   ```

### Common Location Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| Using neighboring city's landmarks | "Coral Gables residents enjoy Coconut Grove's CocoWalk" | Research landmarks IN Coral Gables |
| Generic "Miami" beaches for inland cities | "Homestead is near Miami Beach" | Mention specific accessible beaches or focus on Everglades/parks |
| Wrong school district | Listing Miami-Dade schools for a Broward city | Verify which schools serve that specific city |
| Using Miami statistics for small cities | "Population: 500,000" for Hialeah | Research actual population of THAT city |

### Location Content Checklist

Before marking a location-focused post complete:

- [ ] All neighborhoods mentioned are IN that city (not neighboring cities)
- [ ] All landmarks/attractions are accessible from that city
- [ ] Schools listed actually serve that city's residents
- [ ] Shopping/groceries mentioned are in or near that city
- [ ] Drive times are FROM that specific city (not from "Miami")
- [ ] Population/demographic data is for that city (if mentioned)
- [ ] Any "nearby" references are actually nearby (within 15-20 min)

---

## Location Link Mapping

Match post content to the appropriate location. Set `location_link` to `/{location-slug}-movers`.

**Miami-Dade Cities/Areas** (use `/{slug}-movers` format):
- aventura, bal-harbour, bay-harbor-islands, biscayne-park
- coconut-grove, coral-gables, cutler-bay, doral
- el-portal, florida-city, golden-beach, hialeah
- homestead, indian-creek, kendall, key-biscayne
- medley, miami, miami-beach, miami-gardens
- miami-lakes, miami-shores, miami-springs, north-bay-village
- north-miami, north-miami-beach, opa-locka, palmetto-bay
- pinecrest, south-miami, sunny-isles-beach, surfside
- sweetwater, virginia-gardens, west-miami, westchester

**Rule**: If post is about a specific location (title includes location name, or content is a location guide), set location_link. Otherwise leave null.

---

## Agent Processing Workflow (AUTONOMOUS)

**NO APPROVALS NEEDED. Process continuously without stopping.**

**Error Handling:** Don't stop, don't ask. If something fails, log it and continue.
- Image download fails → set needs_ai_image: true, continue
- Skill unavailable → skip that step, continue
- Ambiguous content → use best judgment, continue
- Any other error → log it, mark post, continue to next

```
FOR EACH POST:
  1. READ & CLAIM POST
     a. Read post MD file
     b. Set status: "in_progress"
     c. Classify post type:
        - LOCATION_GUIDE: About a specific city/neighborhood
        - SERVICE_GUIDE: About a specific moving service
        - HOW_TO: Step-by-step instructions
        - LISTICLE: "X Ways...", "Top N...", numbered lists
        - LIFESTYLE: Restaurants, activities, plants (non-moving)

  2. TITLE FIX
     ```bash
     python scripts/blog/blog_rename.py {POST_ID} --fix
     ```
     a. Remove year from title if present
     b. Ensure title under 60 characters
     c. Update slug and filename to match

  3. QUERY SIMILAR POSTS (may loop back to Step 2)
     ```bash
     qmd search "{title keywords}" --limit 10
     ```
     a. Find posts with similar titles/topics
     b. Check for DUPLICATES or near-duplicates

     IF DUPLICATE FOUND (same topic, same location, same angle):
     ┌─────────────────────────────────────────────────────────────┐
     │ DUPLICATE HANDLING - Create new content for this post      │
     │                                                             │
     │ 1. Identify what's MISSING from the existing post(s):      │
     │    - Different angle? (budget vs luxury, families vs seniors)│
     │    - Different aspect? (neighborhoods vs schools vs dining) │
     │    - Different format? (guide vs checklist vs tips)        │
     │                                                             │
     │ 2. Generate NEW title and content plan:                    │
     │    - Use WebSearch to find a fresh angle                   │
     │    - Ensure new title is meaningfully different            │
     │    - Plan content that doesn't overlap                     │
     │                                                             │
     │ 3. Update the post with new title/slug/content             │
     │                                                             │
     │ 4. RETURN TO STEP 2 (Title Fix) to process new title       │
     └─────────────────────────────────────────────────────────────┘

     IF NO DUPLICATE (unique enough to proceed):
     c. Note similar posts' list items (to avoid using same items)
     d. Identify what makes THIS post unique
     e. Continue to Step 4

  4. CONTENT-TITLE VALIDATION + /programmatic-seo (ACCURACY & UNIQUENESS)

     This step ensures content matches the title AND is location-accurate.

     a. Extract the title promise:
        - What location is specified? (e.g., "Hialeah", "Coral Gables")
        - What count is promised? (e.g., "5 Best", "10 Tips")
        - What type of content? (e.g., parks, restaurants, neighborhoods)

     b. Scan current content against promise:
        - List all items/places currently mentioned
        - Check if each item is in the CORRECT location (not neighboring cities)
        - Verify count matches title (if listicle)

     c. Research and fix gaps using these tools:

        FOR LISTICLES (restaurants, parks, gyms, etc.):
        ```
        WebSearch: "[type] in [city] Florida"
        WebSearch: "best [type] [city] FL Yelp Google reviews"
        /agent-browser: Search Yelp/Google for top-rated [type] in [city]
        ```

        FOR LOCATION GUIDES (neighborhoods, schools, etc.):
        ```
        WebSearch: "[city] Florida neighborhoods"
        WebSearch: "[city] FL schools hospitals"
        WebSearch: "[city] Florida demographics population"
        /agent-browser: Navigate to city official website
        ```

        FOR SERVICE GUIDES with location:
        ```
        WebSearch: "[service] considerations [city] Florida"
        WebSearch: "[city] FL weather climate moving"
        ```

     d. Update content with verified information:
        - Replace any fabricated items with REAL ones (names, addresses)
        - Add specific details (hours, features, what makes it special)
        - Ensure all items are in the CORRECT city
        - Match count to title (add items or adjust title)
        - Check against similar posts (step 3) to avoid duplicate items

     e. /programmatic-seo checklist:
        - [ ] Location has REAL local details (landmarks, neighborhoods)
        - [ ] Service examples are specific (not generic definitions)
        - [ ] No duplicate content with similar location/service posts
        - [ ] Template variables filled with unique, accurate data
        - [ ] Listicle count matches title

  5. /seo-audit + /copywriting (WRITING QUALITY)

     a. Run /seo-audit on post content:
        - [ ] AI patterns (em dashes, "navigate", "seamless", etc.)
        - [ ] Thin sections (< 50 words)
        - [ ] Missing E-E-A-T signals
        - [ ] Generic content that needs localization

     b. Run /copywriting with correct framework:
        - LOCATION_GUIDE → BAB (Before/After/Bridge)
        - SERVICE_GUIDE → PAS (Problem/Agitate/Solution)
        - HOW_TO → 4Cs (Clear/Concise/Compelling/Credible)
        - LISTICLE → Value-first (strongest items first)
        - LIFESTYLE → AIDA (Attention/Interest/Desire/Action)

     c. Fix all issues:
        - Replace AI phrases with natural alternatives
        - Expand thin sections with specific details
        - Add E-E-A-T signals (experience, expertise, authority, trust)
        - Use natural transitions (not "Firstly... Secondly...")

  6. ADD SUPPLEMENTARY SECTIONS (if missing)

     FOR SERVICE_GUIDE POSTS, add:
     ```markdown
     ## Why Professional [Service] Matters
     [PAS: State problem → consequences → our solution]

     ## What Rapid Panda Movers Provides
     [Specific deliverables, not generic promises]

     ## Related Services
     [3 contextual links to related services]
     ```

     FOR LOCATION_GUIDE POSTS, add:
     ```markdown
     ## [Location] Neighborhoods
     [Specific neighborhoods with real characteristics]

     ## Living in [Location]
     [Local amenities, specific names/addresses when possible]

     ## Moving to [Location] with Rapid Panda
     [Location-specific service offerings]
     ```

     FOR ALL POSTS, ensure:
     - CTA section with /quote link
     - FAQ section (for pricing/process/concern topics)

  7. ANALYZE & SET LINKS
     a. Identify primary service type from content
     b. Identify location if applicable
     c. Set service_link:
        - If location + service: /{location}-{service}
        - If service only: /{service}
        - If LIFESTYLE post: null
     d. Set location_link if location-focused

  8. DOWNLOAD & PROCESS IMAGES (CONTENT-MATCHED)

     CRITICAL: Images must match the post content and audience.

     ┌─────────────────────────────────────────────────────────────┐
     │ KEY LEARNINGS - IMAGE WORKFLOW                             │
     ├─────────────────────────────────────────────────────────────┤
     │ USE blog_images.py FOR ALL IMAGE OPERATIONS:               │
     │                                                             │
     │ # Fresh start with custom query (recommended):             │
     │ blog_images.py {id} --all --query "term"                   │
     │                                                             │
     │ # Standard processing:                                      │
     │ blog_images.py {id} --all                                  │
     │                                                             │
     │ TIPS:                                                       │
     │ 1. Use SIMPLE 2-3 word queries (not complex phrases)       │
     │ 2. ALWAYS visually verify images show correct audience     │
     │ 3. Featured image auto-displays at top - not in body       │
     │ 4. ALL other images are auto-embedded in body              │
     │ 5. Unused images are auto-cleaned up                       │
     └─────────────────────────────────────────────────────────────┘

     DO NOT SKIP STEP 0. Existing images may not match the content audience
     (e.g., young people in a senior moving post). Always start fresh.

     a. BUILD CONTENT-SPECIFIC SEARCH QUERIES:

        Identify the key elements from the post:
        - AUDIENCE: seniors, families, students, military, professionals
        - SERVICE: packing, loading, moving truck, storage, furniture
        - LOCATION: Miami skyline, beach, palm trees, specific landmarks
        - MOOD: stress-free, organized, professional, family-friendly

        SEARCH QUERY FORMULA:
        "[audience] + [action] + [context]"

        EXAMPLES BY POST TYPE (USE SIMPLE 2-3 WORD QUERIES):
        ┌─────────────────────────────────────────────────────────────┐
        │ POST TYPE          │ SIMPLE SEARCH QUERIES                 │
        ├─────────────────────────────────────────────────────────────┤
        │ Senior Moving      │ "elderly couple boxes"                │
        │                    │ "senior packing"                      │
        │                    │ "elderly new home"                    │
        │                    │ "senior moving"                       │
        ├─────────────────────────────────────────────────────────────┤
        │ Family Moving      │ "family moving boxes"                 │
        │                    │ "family packing"                      │
        │                    │ "kids moving"                         │
        ├─────────────────────────────────────────────────────────────┤
        │ Student Moving     │ "student boxes"                       │
        │                    │ "college moving"                      │
        │                    │ "dorm packing"                        │
        ├─────────────────────────────────────────────────────────────┤
        │ Military Moving    │ "military family"                     │
        │                    │ "soldier moving"                      │
        ├─────────────────────────────────────────────────────────────┤
        │ Location Guide     │ "[city] Florida"                      │
        │ (e.g., Coral       │ "[city] skyline"                      │
        │ Gables)            │ "[city] homes"                        │
        ├─────────────────────────────────────────────────────────────┤
        │ Packing Services   │ "packing boxes"                       │
        │                    │ "bubble wrap"                         │
        │                    │ "moving supplies"                     │
        ├─────────────────────────────────────────────────────────────┤
        │ Commercial Moving  │ "office moving"                       │
        │                    │ "business boxes"                      │
        │                    │ "office furniture"                    │
        └─────────────────────────────────────────────────────────────┘

        TIP: If first search doesn't show right audience, try:
        - Scroll further in results (good variety often found in results 5-15)
        - Use synonyms: "elderly" vs "senior", "packing" vs "boxes"

     b. USE blog_images.py WITH SIMPLE SEARCH TERMS:

        IMPORTANT: Use simple, direct search terms - not complex phrases.
        Stock photo APIs work better with basic keywords.

        ```bash
        # RECOMMENDED: Clean + download + process + complete in one command
        python scripts/blog/blog_images.py {post_id} --all --query "senior packing"

        # Auto-generate query from post category/keywords
        python scripts/blog/blog_images.py {post_id} --all

        # Standard processing (uses existing images or downloads new ones)
        python scripts/blog/blog_validate.py {post_id}
        ```

        SIMPLE QUERY EXAMPLES:
        ┌─────────────────────────────────────────────────────────────┐
        │ POST TYPE          │ SIMPLE QUERIES (use these!)           │
        ├─────────────────────────────────────────────────────────────┤
        │ Senior Moving      │ "elderly couple moving"               │
        │                    │ "senior packing"                      │
        │                    │ "elderly new home"                    │
        ├─────────────────────────────────────────────────────────────┤
        │ Family Moving      │ "family moving"                       │
        │                    │ "family packing home"                 │
        ├─────────────────────────────────────────────────────────────┤
        │ Student Moving     │ "student moving"                      │
        │                    │ "college dorm"                        │
        ├─────────────────────────────────────────────────────────────┤
        │ Packing Services   │ "packing cardboard"                   │
        │                    │ "moving supplies"                     │
        ├─────────────────────────────────────────────────────────────┤
        │ Location Guide     │ "[city] Florida"                      │
        │                    │ "[city] skyline"                      │
        └─────────────────────────────────────────────────────────────┘

        WHY SIMPLE TERMS WORK BETTER:
        - Stock photo APIs match keywords, not phrases
        - Complex queries like "gray haired elderly couple packing moving boxes"
          often return fewer or wrong results
        - Simple terms like "elderly couple moving" or "senior packing" work better
        - Avoid "boxes" alone (gets confused with "boxing" sport)
        - If initial results don't match, try synonyms or different simple terms

     c. VARY SEARCHES TO AVOID REPETITION:

        For each post, use DIFFERENT search terms:
        - Don't just search "moving boxes" for every post
        - Add audience modifier (elderly, family, student)
        - If first results don't match, scroll further or use synonyms

        SIMPLE VARIATION STRATEGIES:
        - Synonyms: "elderly" vs "senior", "packing" vs "moving"
        - Context: "new home" vs "moving day"
        - Different queries: Run blog_images.py multiple times with different --query
        - Scroll further: Good results often in positions 5-15, not just 1-4

     d. VALIDATE IMAGE-CONTENT MATCH (VISUAL INSPECTION REQUIRED):

        IMPORTANT: You MUST visually inspect each downloaded image to verify
        it matches the post's audience. Filenames can be misleading - an image
        named "senior-moving.jpg" might actually show young people.

        USE THE READ TOOL to view each image file and verify:
        - [ ] Audience matches (seniors shown for senior content - gray hair, older faces)
        - [ ] Activity matches (packing shown for packing content)
        - [ ] Setting is appropriate (residential for homes, office for commercial)
        - [ ] No mismatched demographics (young people in senior moving post)
        - [ ] Images aren't already used in another recent post

        VISUAL VERIFICATION CHECKLIST:
        ```
        For SENIOR posts: Do the people in the image have gray/white hair?
                          Do they appear to be 60+ years old?
        For FAMILY posts: Are there children visible with parents?
        For STUDENT posts: Do they appear to be college-age (18-25)?
        For MILITARY posts: Any uniforms, base housing, or military context?
        ```

        IF IMAGES DON'T MATCH after visual inspection:
        - Delete mismatched images immediately
        - Search again with MORE SPECIFIC queries (e.g., "gray haired couple packing")
        - Try different stock photo sources
        - Continue until you have images that ACTUALLY show the target audience

     e. PROCESS IMAGES:
        ```bash
        python scripts/blog/blog_validate.py {post_id}
        ```
        - Rename with SEO-optimized filenames (include keywords)
        - Convert to WebP format
        - Generate responsive sizes (400w, 800w, 1200w, 1600w)
        - Update featured and images fields with .webp paths

     f. EMBED IN BODY COPY - ALL IMAGES MUST BE USED:

        CRITICAL RULES:
        - The FEATURED image displays automatically at the top of the post
        - DO NOT embed the featured image again in the body (avoid duplication)
        - ALL other images MUST be embedded in the body
        - If you download 4 images: 1 featured + 3 body embeds = all 4 used
        - If you download 3 images: 1 featured + 2 body embeds = all 3 used

        PLACEMENT:
        - Place images after relevant sections (not just anywhere)
        - Distribute evenly throughout the post
        - Use descriptive alt text matching the image AND content
        - Use loading="lazy" for all below-fold images

        VERIFICATION:
        - Count images in folder (excluding responsive sizes)
        - Count: 1 featured + N body embeds = total images
        - If any image is not used, either embed it or delete it

     g. ALL IMAGE STEPS AUTOMATED:
        blog_images.py --all handles all image steps automatically:
        - Downloads with query
        - Renames with SEO names
        - Converts to WebP
        - Generates responsive sizes
        - Embeds in body
        - Updates frontmatter
        - Cleans up unused images

  9. VALIDATE + COMPLETE

     Use the individual scripts to finalize:

     ```bash
     # Fresh start: clean old images, download new with query, complete
     python scripts/blog/blog_images.py {post_id} --all --query "senior packing"

     # Standard: use existing images or download if needed, complete
     python scripts/blog/blog_validate.py {post_id}
     ```

     This validates, processes images, and marks complete in one step.

     Validates:
     - Excerpt under 155 characters
     - Title under 60 characters (no year) - if fails, go back to Step 2
     - Proper heading hierarchy (H2 > H3 > H4)
     - Internal links use location-specific URLs
     - No remaining AI patterns
     - Required sections present (CTA, FAQ, etc.)

     Updates:
     - status: "completed"
     - readTime (calculated automatically)

     NOTE: Do NOT change the `updated` field - it should only change when
     content is significantly modified, not during routine processing.

  10. VERIFY AND CONTINUE
      ```bash
      python scripts/blog/blog_validate.py {post_id}
      ```
      Confirm validation passes, then move to next post immediately.
```

### Skill Invocation Examples

#### Example: Processing a Location Guide (Post about Miami Beach)

```
1. Classify: LOCATION_GUIDE
2. qmd search "miami beach moving guide" → Found 3 similar posts
3. /seo-audit → Found: "navigate", "comprehensive guide", thin Neighborhoods section
4. /copywriting → Apply BAB framework to intro:

   BEFORE: "Miami Beach is a great place to live. Moving there can be exciting."

   AFTER: "You're scrolling Zillow at midnight, torn between that Art Deco
   condo in South Beach and the family-friendly spot near North Beach.
   Six months from now, you'll be walking to the beach after work,
   wondering why you didn't move sooner. Here's how to make that
   Miami Beach move happen smoothly."

5. /programmatic-seo → Add real neighborhoods:
   - South Beach (Art Deco, nightlife, tourists)
   - Mid-Beach (quieter, Faena district, families)
   - North Beach (local vibe, less crowded beaches)
   - Surfside (small-town feel, kosher restaurants)

6. Set links:
   - location_link: /miami-beach-movers
   - service_link: /miami-beach-local-moving
```

#### Example: Processing a Service Guide (Packing Tips)

```
1. Classify: SERVICE_GUIDE
2. qmd search "packing tips" → Found 8 similar posts
3. /seo-audit → Found: em dashes, "It's important to note", generic advice
4. /copywriting → Apply PAS framework:

   PROBLEM: "Broken dishes. Crushed boxes. That sinking feeling when
   you open a box labeled 'fragile' and hear glass shifting inside."

   AGITATE: "Every year, Americans spend $3,000+ replacing items
   damaged during moves. Most of that damage? Preventable."

   SOLUTION: "Here's the professional packing system our Miami crews
   use for 500+ moves every month..."

5. /programmatic-seo → Ensure unique tips not in other posts:
   - Check this post's tips against 8 similar posts
   - Replace any duplicates with unique alternatives
   - Add Miami-specific context (humidity, heat, condo rules)

6. Set links:
   - location_link: null (general guide)
   - service_link: /packing-services
```

#### Example: Processing a Listicle (10 Moving Mistakes)

```
1. Classify: LISTICLE
2. qmd search "moving mistakes" → Found 2 similar listicles
3. /seo-audit → Found: only 8 items but title says "10"
4. /copywriting → Value-first ordering:
   - Move strongest/most unique tips to positions 1-3
   - Add 2 more unique mistakes not in other posts

5. /programmatic-seo → Uniqueness check:
   Similar post has: "Not labeling boxes" - THIS post should NOT have this
   Instead use: "Labeling only the top of boxes (label 2 sides minimum)"

6. Final check: 10 items in content matches "10 Mistakes" title
```

---

## Verification Checklist (Per Post)

### Step 2: Title Fix
- [ ] **Year removed** from title (no 2024, 2025, etc.)
- [ ] **Title under 60 characters**
- [ ] **Slug matches title** (updated via blog_rename.py)
- [ ] **Filename matches slug** (renamed if needed)

### Step 3: Similar Posts Queried + Duplicate Check
- [ ] **Similar posts identified** using qmd search
- [ ] **Duplicate check performed**:
  - If duplicate found → created fresh angle, returned to Step 2
  - If no duplicate → noted items to avoid, continued
- [ ] **Post has unique angle** (not same topic + location + angle as another post)

### Step 4: Content-Title Validation + Accuracy
- [ ] **Title promise extracted** (location, count, type identified)
- [ ] **Content delivers on promise** (matches title exactly)
- [ ] **Location accuracy verified** (all places are in the CORRECT city)
- [ ] **Count matches** (if "5 Best Parks", exactly 5 parks listed)
- [ ] **Items are REAL** (verified via WebSearch, not fabricated)
- [ ] **Specific details included** (addresses, hours, features)
- [ ] **No duplicate items** with similar posts (checked in step 3)

### Step 5: Writing Quality (/seo-audit + /copywriting)
- [ ] **/seo-audit invoked** - AI patterns identified
- [ ] **/copywriting invoked** with correct framework:
  - LOCATION_GUIDE → BAB
  - SERVICE_GUIDE → PAS
  - HOW_TO → 4Cs
  - LISTICLE → Value-first
  - LIFESTYLE → AIDA
- [ ] **AI patterns removed** (em dashes, "navigate", "seamless", etc.)
- [ ] **Thin sections expanded** (all sections 50+ words)
- [ ] **E-E-A-T signals added** (experience, expertise, authority, trust)

### Content Quality
- [ ] Queried similar posts with qmd to ensure uniqueness
- [ ] NO AI writing patterns remain (em dashes, "dive into", etc.)
- [ ] NO thin sections (all sections 50+ words with specifics)
- [ ] E-E-A-T signals present (experience, expertise, authority, trust)
- [ ] Miami-specific or service-specific details (not generic)
- [ ] Natural transitions (no "Firstly... Secondly...")
- [ ] Listicle count matches title (if applicable)
- [ ] No duplicate list items with similar posts
- [ ] Grammar fixed (a/an, duplicates)

### Framework Application
- [ ] Post type correctly classified (LOCATION_GUIDE, SERVICE_GUIDE, HOW_TO, LISTICLE, LIFESTYLE)
- [ ] Correct framework applied:
  - LOCATION_GUIDE → BAB (Before/After/Bridge)
  - SERVICE_GUIDE → PAS (Problem/Agitate/Solution)
  - HOW_TO → 4Cs (Clear/Concise/Compelling/Credible)
  - LISTICLE → Value-first (strongest items first)
  - LIFESTYLE → AIDA (Attention/Interest/Desire/Action)
- [ ] Intro rewritten with framework structure
- [ ] Sections flow naturally with proper transitions

### Supplementary Sections
- [ ] Benefits/What to Expect section present (SERVICE_GUIDE posts)
- [ ] Neighborhoods/Local details section present (LOCATION_GUIDE posts)
- [ ] Related Services section with 3 relevant links
- [ ] FAQ section added (for pricing/process/concern topics)
- [ ] CTA section at end with /quote link
- [ ] Secondary CTA with /reviews or /contact-us link

### Images
- [ ] 3-5 images downloaded with SEO-optimized names
- [ ] All images converted to WebP format
- [ ] Responsive image sizes generated (400w, 800w, 1200w, 1600w)
- [ ] featured field points to actual existing .webp file
- [ ] images array contains actual existing .webp files
- [ ] Images embedded in body copy with responsive srcset when possible
- [ ] Alt text is descriptive and includes keywords
- [ ] Featured image uses loading="eager" fetchpriority="high"
- [ ] Body images use loading="lazy"

### Links
- [ ] service_link set correctly (location-specific when appropriate, e.g., /miami-local-moving)
- [ ] location_link set correctly (or null if not location-specific)
- [ ] Internal links use location-specific URLs where applicable

### SEO
- [ ] Excerpt under 155 characters
- [ ] Title under 60 characters (no year, no cutoffs)
- [ ] Proper heading hierarchy (H2 > H3 > H4)

### Frontmatter
- [ ] readTime accurately reflects word count
- [ ] status: "completed"
- [ ] needs_ai_image: false

---

## Commands Reference

### Full Workflow (Individual Scripts)

**Each step has its own dedicated script:**

```bash
# Step 1: Validate and classify
python scripts/blog/blog_validate.py 0001

# Step 2: Fix title/slug/filename
python scripts/blog/blog_rename.py 0001 --fix

# Step 3: Check for duplicates
python scripts/blog/blog_similar.py 0001

# Step 4-6: Manual content work (use /seo-audit and /copywriting skills)

# Step 7: Update category from service_link
python scripts/blog/blog_categorize.py 0001

# Step 8: Process images (all steps)
python scripts/blog/blog_images.py 0001 --all --query "senior packing"

# Step 9: Update readTime and fix excerpt length
python scripts/blog/blog_wordcount.py 0001 --fix

# Step 10: Final validation
python scripts/blog/blog_validate.py 0001
```

**Quick workflow for posts needing minimal changes:**
```bash
python scripts/blog/blog_rename.py 0001 --fix
python scripts/blog/blog_categorize.py 0001
python scripts/blog/blog_images.py 0001 --all --query "moving boxes"
python scripts/blog/blog_wordcount.py 0001 --fix
python scripts/blog/blog_validate.py 0001
```

**Step-by-step workflow (if content fixes needed):**
```bash
# 1. Validate post and see what needs fixing
python scripts/blog/blog_validate.py 0001

# 2. If AI patterns found, invoke skills to fix content
#    /seo-audit [paste content]
#    /copywriting [describe fixes needed]

# 3. Once content is fixed, process images
python scripts/blog/blog_images.py 0001 --all --query "term"

# 4. Final validation
python scripts/blog/blog_validate.py 0001
```

### Individual Scripts

All scripts are in the `scripts/blog/` directory. Use these for specific operations:

#### Validate Posts
```bash
python scripts/blog/blog_validate.py 0001               # Validate single post
python scripts/blog/blog_validate.py --all              # Validate all posts
python scripts/blog/blog_validate.py --pending          # Validate pending only
python scripts/blog/blog_validate.py --completed        # Validate completed only
```

Checks for:
- AI writing patterns (em dashes, "dive into", "navigate", etc.)
- Frontmatter issues (title length, excerpt, readTime format)
- Image presence and format (WebP, responsive sizes)
- Required sections (CTA, FAQ, Related Services)
- Post type classification (LISTICLE, LOCATION_GUIDE, SERVICE_GUIDE, HOW_TO)
- image_keywords relevance (warns if keywords may not match content)

#### Word Count & Read Time
```bash
python scripts/blog/blog_wordcount.py 0001              # Check single post
python scripts/blog/blog_wordcount.py 0001 --fix        # Fix readTime
python scripts/blog/blog_wordcount.py --all             # Check all posts
python scripts/blog/blog_wordcount.py --all --fix       # Fix all posts
```

#### Remove Year from Title & Rename Files
```bash
python scripts/blog/blog_rename.py 0001             # Check single post
python scripts/blog/blog_rename.py 0001 --fix       # Fix title, slug, and filename
python scripts/blog/blog_rename.py --all            # Check all posts
python scripts/blog/blog_rename.py --all --fix      # Fix all (title + slug + filename)
```
This script removes years from titles while preserving important words (locations, etc.),
updates the slug to match, and renames the .md file accordingly.

#### Image Processing (blog_images.py)

**Use blog_images.py for all image operations:**
```bash
# Full workflow (all steps)
python scripts/blog/blog_images.py 0001 --all --query "senior packing"

# Individual operations
python scripts/blog/blog_images.py 0001 --clean              # Remove all existing images
python scripts/blog/blog_images.py 0001 --download           # Download images
python scripts/blog/blog_images.py 0001 --download --count 5 # Download 5 images
python scripts/blog/blog_images.py 0001 --rename             # Rename + convert to WebP
python scripts/blog/blog_images.py 0001 --resize             # Generate responsive sizes
python scripts/blog/blog_images.py 0001 --embed              # Embed images in body
python scripts/blog/blog_images.py 0001 --update-array       # Update images frontmatter
python scripts/blog/blog_images.py 0001 --cleanup            # Remove unused images
python scripts/blog/blog_images.py 0001 --fix-paths          # Fix image_folder/featured paths
```

#### Responsive Image Sizes Only
```bash
python scripts/blog/blog_resize.py 0001                 # Convert to WebP + resize
python scripts/blog/blog_resize.py --dir /path/to/imgs  # Process specific dir
python scripts/blog/blog_resize.py 0001 --no-cleanup    # Keep original JPEG/PNG files
```
Generates: 400w, 800w, 1200w, 1600w sizes in WebP format.
Requires: `cwebp` (install with `brew install webp`)

#### Find Similar Posts
```bash
python scripts/blog/blog_similar.py 0001                # Find similar to post
python scripts/blog/blog_similar.py 0001 --limit 20     # Show more results
python scripts/blog/blog_similar.py --title "moving tips"  # Search by title
```

### Image Processing (blog_images.py)

**blog_images.py handles all image operations:**
```bash
# RECOMMENDED: One command does everything
python scripts/blog/blog_images.py 0001 --all --query "senior packing"
```

This cleans existing images, downloads fresh ones with your query, renames, resizes,
embeds in body, updates frontmatter, and cleans up unused images.

### Query Posts (qmd - if installed)
```bash
qmd search "moving tips"           # Find posts about moving tips
qmd similar 0001                   # Find posts similar to post 0001
qmd list --status pending          # List all pending posts
```

### SEO Audit Checklist (/seo-audit)

**INVOKE**: `/seo-audit` before making any content changes.

#### AI Writing Patterns to Find & Fix

| Pattern | Find | Replace With |
|---------|------|--------------|
| Em dashes | `—` | Commas, periods, or rewrite sentence |
| "Dive into" | dive into, diving into | explore, learn, discover, or delete |
| "Navigate" | navigate, navigating | handle, manage, deal with, work through |
| "In today's world" | in today's world/age | Delete or state specific context |
| "It's important to note" | important to note | State directly without hedge |
| "Comprehensive" | comprehensive guide | specific: "step-by-step checklist" |
| "Crucial/Essential" | crucial, essential | key, important (use sparingly) |
| "In this article" | in this article/post | Delete entirely |
| "Let's explore" | let's explore/dive | Just start the explanation |
| "At the end of the day" | at the end of the day | Delete or be specific |
| "First and foremost" | first and foremost | First, or delete |
| "Last but not least" | last but not least | Finally, or delete |
| "Without further ado" | without further ado | Delete entirely |
| "Needless to say" | needless to say | Delete (if needless, don't say) |
| "As mentioned" | as mentioned earlier | Reference specific thing or delete |

#### E-E-A-T Signals to Add

| Signal | How to Add |
|--------|------------|
| **Experience** | "Our crews handle 500+ moves monthly in Miami" |
| **Expertise** | Specific techniques, insider tips, industry knowledge |
| **Authority** | Company credentials, years in business, service areas |
| **Trust** | Reviews link, BBB mention, insurance/licensing |

#### Thin Content Indicators

- Section has fewer than 50 words
- No specific examples or details
- Could apply to any city (not Miami-specific)
- Defines term without explaining application
- Lists items without elaboration

### Copywriting Frameworks (/copywriting)

**INVOKE**: `/copywriting` to rewrite content using appropriate framework.

#### Framework Quick Reference

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **PAS** | Problem → Agitate → Solution | Service pages, pain points |
| **AIDA** | Attention → Interest → Desire → Action | Landing pages, guides |
| **BAB** | Before → After → Bridge | Transformation stories, location guides |
| **4Cs** | Clear → Concise → Compelling → Credible | How-to content, tutorials |
| **Value-First** | Best item first, descending value | Listicles, tip lists |

#### PAS Deep Dive (Problem → Agitate → Solution)

```markdown
## [Section about a problem]

**PROBLEM** (2-3 sentences):
State the specific problem the reader faces. Be concrete.
"Your move is in two weeks and you still have a garage full of stuff."

**AGITATE** (2-3 sentences):
Make them feel the consequences of not solving it.
"Without a plan, you'll be making dump runs at 10pm the night before,
and still finding boxes of 'miscellaneous' six months later."

**SOLUTION** (rest of section):
Present your solution as the relief to that pain.
"Here's the decluttering system that gets Miami families move-ready in
one weekend..."
```

#### AIDA Deep Dive (Attention → Interest → Desire → Action)

```markdown
## [Guide or informational section]

**ATTENTION** (hook):
"Miami Beach rent just hit $3,200/month average."

**INTEREST** (expand):
"But there's a neighborhood 10 minutes away where you get more space
for half that price."

**DESIRE** (paint the picture):
"Imagine morning runs on the beach, a garage for your kayak, and money
left over for actual living."

**ACTION** (next step):
"Here's how to find your Miami Beach alternative..."
```

#### BAB Deep Dive (Before → After → Bridge)

```markdown
## Moving to [Location]

**BEFORE** (current state):
Paint their current situation with specific, relatable details.
"You're in a cramped apartment, commuting 45 minutes each way,
paying too much for too little."

**AFTER** (desired state):
Show what life looks like after.
"Six months from now: a backyard, a 10-minute commute, and neighbors
who actually say hello."

**BRIDGE** (how to get there):
Your content that connects before to after.
"Here's everything you need to know about making [Location] home..."
```

#### Natural Transition Phrases

**Instead of robotic transitions, use:**

| Purpose | Natural Options |
|---------|-----------------|
| Adding info | "You'll also want to..." / "Even better..." / "Here's another approach..." |
| Contrasting | "That said..." / "On the flip side..." / "But here's the thing..." |
| Sequencing | "Start with..." / "Once that's done..." / "From there..." |
| Emphasizing | "Here's what matters most..." / "The key thing..." / "Don't skip this..." |
| Concluding | "The bottom line:" / "Here's what it comes down to:" / (just summarize) |
| Examples | "Take [specific example]..." / "Here's what that looks like..." |

**Avoid entirely:**
- Firstly, Secondly, Thirdly
- Furthermore, Moreover, Additionally
- In conclusion, To summarize, In summary
- It should be noted that, It is worth mentioning
- As previously mentioned, As stated earlier

---

## Before/After Content Examples

These examples show exactly what transformation is expected:

### Example 1: AI Pattern Removal

**❌ BEFORE (AI-written):**
```markdown
## Introduction to Moving in Miami

In today's fast-paced world, moving can be a daunting task. It's important
to note that navigating the complexities of relocation requires careful
planning. Let's dive into the comprehensive guide that will help you
understand the essential aspects of moving to Miami—a vibrant city with
endless opportunities.
```

**✅ AFTER (Natural, specific):**
```markdown
## Moving to Miami: What You Need to Know

Miami's housing market moves fast. Listings disappear in days, moving
trucks book out weeks ahead, and summer humidity turns packing into a
workout. Here's what our crews have learned from 500+ Miami moves this
year—and how to use that knowledge for your own relocation.
```

**What changed:**
- Removed "In today's fast-paced world" (generic filler)
- Removed "It's important to note" (weak hedge)
- Removed "navigating" (AI favorite)
- Removed "Let's dive into" (forced engagement)
- Removed "comprehensive guide" (generic)
- Removed em dash
- Added specific details (500+ moves, summer humidity)
- Added E-E-A-T signal (crew experience)

### Example 2: PAS Framework for Service Post

**❌ BEFORE (Generic):**
```markdown
## Packing Services

Packing is an important part of moving. Professional packing services
can help you pack your belongings safely. Our team provides quality
packing services for your move.
```

**✅ AFTER (PAS Framework):**
```markdown
## Why Packing Is Where Most Moves Go Wrong

**The Problem:** You've labeled everything, wrapped the dishes twice, and
still—that sickening crunch when the movers set down the "FRAGILE" box.
Broken picture frames, chipped furniture corners, a lamp that somehow
survived 10 years until moving day.

**Why It Happens:** Packing isn't just putting things in boxes. It's knowing
that Miami humidity softens cardboard overnight, that books go spine-down,
that mirrors need corner protectors AND edge padding.

**The Fix:** Our packing crews have wrapped 10,000+ Miami homes. We bring
materials rated for Florida humidity, techniques for everything from wine
glasses to wall art, and the muscle memory that comes from doing this daily.

[**Get a packing quote →**](/packing-services)
```

### Example 3: BAB Framework for Location Guide

**❌ BEFORE (Generic):**
```markdown
## About Coral Gables

Coral Gables is a beautiful city in Miami-Dade County. It has many
amenities and is a great place to live. The city offers various
housing options for different budgets.
```

**✅ AFTER (BAB Framework):**
```markdown
## Living in Coral Gables: Before and After

**Before (Your Current Situation):**
You're commuting 45 minutes each way, hunting for street parking, eating
dinner at 8pm because that's when you finally get home. Your apartment
has "character" (translation: old pipes and no closet space).

**After (Coral Gables Life):**
You're walking to Miracle Mile for lunch, parking in your own garage,
home by 5:30 with time to actually cook. Your kids bike to school
through tree-lined streets, and your neighbors know your name.

**The Bridge (How to Get There):**
Coral Gables averages $650K for a single-family home and $2,400/month
for a 2BR rental—premium pricing, but you get the historic architecture,
top-rated schools (Coral Gables Senior High ranks in Florida's top 50),
and a 15-minute commute to Brickell.

Here's what you need to know about making the move...
```

### Example 4: Listicle with Unique Items

**❌ BEFORE (Generic tips found everywhere):**
```markdown
## 10 Moving Tips

1. Start packing early
2. Label your boxes
3. Get rid of stuff you don't need
4. Hire professional movers
5. Pack a first-night bag
...
```

**✅ AFTER (Unique, specific, value-first):**
```markdown
## 10 Miami Moving Mistakes (And How to Avoid Them)

1. **Scheduling movers during Art Basel week** — December rates spike 40%
   and trucks book months ahead. Move before Thanksgiving or after New Year.

2. **Forgetting about condo move-in rules** — Most Miami high-rises require
   48-hour notice, elevator reservations, and COI from your moving company.
   Miss this and you're rescheduling.

3. **Packing electronics without AC running** — Miami garages hit 100°F.
   Heat-sensitive items (vinyl records, candles, electronics) need climate
   control until they're on the truck.

4. **Using cardboard boxes left in the garage** — Humidity weakens cardboard
   overnight. One soft box at the bottom of a stack = crushed dishes. Use
   fresh boxes or plastic bins.

5. **Underestimating afternoon thunderstorms** — Schedule morning loads
   May through October. 3pm storms are almost daily and movers won't carry
   furniture through lightning.

...
```

**What changed:**
- Generic tips → Miami-specific situations
- "Label your boxes" (obvious) → "Condo move-in rules" (specific, actionable)
- No context → Real consequences explained
- Could be anywhere → Only applies to Miami

### Example 5: Content-Title Mismatch Fix (Listicle)

**Title:** "8 Best Restaurants to Try in Homestead After Your Move"

**❌ BEFORE (Content doesn't match title):**
```markdown
## Finding Great Restaurants in Your New Neighborhood

Moving to a new area means discovering new places to eat. Here are some tips:

1. Ask your neighbors for recommendations
2. Check Yelp and Google reviews
3. Visit local farmer's markets
4. Try different cuisines
5. Look for family-owned spots
6. Check social media for food photos
7. Visit during off-peak hours
8. Don't be afraid to try new things
```

**Problem:** Title promises "8 Best Restaurants in Homestead" but content is generic tips about finding restaurants. NO actual restaurant names!

**Research step:**
```
WebSearch: "best restaurants in Homestead Florida"
WebSearch: "top rated restaurants Homestead FL"
```

**✅ AFTER (Content matches title):**
```markdown
## 8 Restaurants Every New Homestead Resident Should Try

You just moved to Homestead and the fridge is empty. Skip the chain restaurants
and try these local favorites that residents have loved for decades.

### 1. Shivers BBQ
**Address:** 28001 S Dixie Hwy
Slow-smoked ribs and brisket that's been drawing crowds since the 1980s. The
pulled pork sandwich is legendary. Expect a line on weekends.

### 2. Royal Palm Grill
**Address:** 315 N Krome Ave
Classic American diner open since 1958. Breakfast all day, homemade pies, and
the kind of coffee that keeps refilling. Cash only.

### 3. Casita Tejas
**Address:** 27 N Krome Ave
Authentic Mexican with tacos al pastor that rival anything in Miami proper.
The salsa bar has six different heat levels.

### 4. The Capri Restaurant
**Address:** 935 N Krome Ave
Family-owned Italian since 1958. The lasagna is made fresh daily and the
portions are enormous. BYOB on Tuesdays.

### 5. El Toro Taco
**Address:** 1 S Krome Ave
Quick-service Mexican perfect for lunch. The carne asada burrito is a local
favorite. Drive-through available.

### 6. Angie's Cafe
**Address:** 404 SE 1st Ave
Cuban breakfast spot with strong cafe con leche and fresh pastelitos. The
Cuban sandwich is pressed perfectly crispy.

### 7. Sake Room
**Address:** 241 N Krome Ave
Best sushi in Homestead. The dragon roll and sashimi platter are standouts.
Happy hour 4-6pm weekdays.

### 8. White Lion Cafe
**Address:** 146 NW 7th St
Breakfast and brunch spot with creative twists. Try the guava pancakes or
the Benedicts. Packed on weekends.
```

**What changed:**
- Generic "tips" replaced with actual restaurants
- Each restaurant has: Name, Address, What's special, Insider tips
- All restaurants verified to be IN Homestead (not Miami or Florida City)
- Count (8) matches title

### Example 6: Content-Title Mismatch Fix (Location Guide)

**Title:** "Best Neighborhoods in Hialeah for Families"

**❌ BEFORE (Wrong city content):**
```markdown
## Popular Family Neighborhoods

When moving to the Miami area, consider these family-friendly neighborhoods:

- **Coral Gables** - Tree-lined streets, top schools
- **Pinecrest** - Spacious lots, excellent parks
- **Coconut Grove** - Artistic vibe, waterfront access
- **Kendall** - Affordable, suburban feel
```

**Problem:** Title says "Hialeah" but neighborhoods listed are in OTHER cities!

**Research step:**
```
WebSearch: "Hialeah Florida neighborhoods"
WebSearch: "best areas to live in Hialeah FL families"
```

**✅ AFTER (Correct city content):**
```markdown
## Best Hialeah Neighborhoods for Families

Hialeah offers several distinct neighborhoods, each with its own character.
Here's where families are settling.

### Palm Springs North
The northern section of Hialeah near Miami Lakes offers newer construction
and larger lots. Palm Springs North Elementary is rated well, and Amelia
Earhart Park (515 acres) is minutes away for weekend family outings.

### The Triangle/The Circle
Bounded by Okeechobee Road and W 4th Avenue, this established neighborhood
has affordable single-family homes and strong community ties. Walking distance
to Hialeah Park Racing & Casino for family-friendly events.

### Country Club
Near the Hialeah Park Race Track, this area features mid-century homes with
mature trees and the quieter feel of Old Hialeah. Good access to E 9th
Street shopping and restaurants.

### Hialeah Gardens (Adjacent)
Just west of Hialeah proper, Hialeah Gardens has newer developments and
highly-rated schools. Still close to Westland Mall and the Palmetto Expressway.

### Palm Springs
The central Palm Springs area offers affordable condos and townhomes. Near
Milander Park and the Hialeah pool. Good for first-time buyers and young families.
```

**What changed:**
- Neighborhoods are actually IN Hialeah (not Coral Gables, Pinecrest, etc.)
- Each has specific landmarks and schools IN that area
- Local context (Amelia Earhart Park, Hialeah Park, Westland Mall)

---

## Known Issues to Fix

### Seasonal Mismatches
Posts where content mentions a season that doesn't match the publication date.

### Missing Featured Images
Posts with `image_folder` but no actual images downloaded.

### Listicle Count Mismatches
Titles like "10 Ways..." must have exactly 10 items in content.

### Content Uniqueness
- No duplicate titles
- No duplicate list items between similar posts
- No two posts should be even close to the same

---

## Batch Processing Instructions

**Process posts in parallel batches for speed:**

```
BATCH SIZE: 10-20 posts per batch
PARALLELIZATION: Launch multiple subagents simultaneously

Example command pattern:
- Launch 10 subagents, each processing 1 post
- Each subagent follows the workflow autonomously
- No coordination needed between subagents
- When batch completes, launch next batch
```

### Subagent Prompt Template

Use this exact prompt for subagents:

```
Process blog post {POST_ID}. Follow the 10-step workflow in sequence.

═══════════════════════════════════════════════════════════════════════
STEP 1 - CLASSIFY + STEP 2 - TITLE FIX + STEP 3 - DUPLICATES
═══════════════════════════════════════════════════════════════════════

Run initial processing:
```bash
python scripts/blog/blog_validate.py {POST_ID}
```

This outputs:
- Post type (LOCATION_GUIDE, SERVICE_GUIDE, HOW_TO, LISTICLE, LIFESTYLE)
- Framework to use (BAB, PAS, 4Cs, Value-first, AIDA)
- Title fix status
- Duplicate warnings (if any)
- Validation errors (if any)

IF DUPLICATE WARNING (>70% similarity):
1. Use WebSearch to research a fresh angle:
   WebSearch: "[city] moving tips for [different audience]"
   WebSearch: "[topic] guide [different aspect]"
2. Create NEW title focusing on different angle/audience/aspect
3. Edit the post with new title and content plan
4. Re-run: python scripts/blog/blog_validate.py {POST_ID}

═══════════════════════════════════════════════════════════════════════
STEP 4 - CONTENT VALIDATION
═══════════════════════════════════════════════════════════════════════

Read the post file and verify content matches title promise:

```bash
Read content/blog/{POST_ID}-*.md
```

FOR LISTICLES ("X Best [things] in [City]"):
1. Count items in content - must EXACTLY match title number
2. For each item, verify it's REAL:
   WebSearch: "[item name] [city] Florida"
3. Verify items are in CORRECT CITY (not neighboring cities)
4. Add specific details if missing: names, addresses, hours, features

FOR LOCATION GUIDES ("[City] Moving Guide"):
1. List all neighborhoods mentioned
2. Verify each neighborhood is IN that city:
   WebSearch: "[neighborhood] [city] Florida"
3. Verify landmarks, schools, hospitals are in that city
4. Replace generic "Miami" content with city-specific details

FOR SERVICE GUIDES:
1. Verify tips are specific to the service, not generic
2. Add Miami-specific context where relevant
3. Include realistic pricing ranges if applicable

RESEARCH TOOLS:
- WebSearch: "best [type] in [city] Florida"
- WebSearch: "[business name] address [city]"
- WebSearch: "[city] FL neighborhoods"
- /agent-browser: For detailed page navigation when needed

EDIT the post to fix any content-title mismatches.

═══════════════════════════════════════════════════════════════════════
STEP 5 - WRITING QUALITY
═══════════════════════════════════════════════════════════════════════

A. Run SEO audit:
   /seo-audit [paste the post content]

   Look for and fix:
   - Em dashes (—) → Replace with commas or periods
   - "dive into" → Remove or use "explore", "learn"
   - "navigate" → Use "handle", "manage", "deal with"
   - "comprehensive guide" → Be specific: "step-by-step checklist"
   - "it's important to note" → State directly
   - "in today's world" → Delete or add specific context
   - Thin sections (<50 words) → Expand with details

B. Apply copywriting framework based on post type:
   /copywriting [describe the post and framework needed]

   FRAMEWORKS:
   - LOCATION_GUIDE → BAB (Before/After/Bridge)
     Show: life before move → life after move → how to get there

   - SERVICE_GUIDE → PAS (Problem/Agitate/Solution)
     Show: the problem → why it's painful → how service solves it

   - HOW_TO → 4Cs (Clear/Concise/Compelling/Credible)
     Be: easy to follow, no fluff, motivating, backed by expertise

   - LISTICLE → Value-first
     Put: strongest items at top, weakest in middle, strong at end

   - LIFESTYLE → AIDA (Attention/Interest/Desire/Action)
     Hook: grab attention → build interest → create desire → call to action

C. Add E-E-A-T signals:
   - Experience: "Our crews handle 500+ moves monthly in Miami"
   - Expertise: Specific tips only professionals would know
   - Authority: Reference industry standards, local regulations
   - Trust: Real examples, honest about limitations

EDIT the post to apply all fixes.

═══════════════════════════════════════════════════════════════════════
STEP 6 - SUPPLEMENTARY SECTIONS
═══════════════════════════════════════════════════════════════════════

Check if these sections exist. Add if missing:

1. CTA SECTION (required):
```markdown
## Ready to Get Started?

**[Request your free quote](/quote)** today and discover why Miami families trust Rapid Panda Movers.

Questions? **[Contact us](/contact-us)** or read our **[customer reviews](/reviews)**.
```

2. FAQ SECTION (for service/pricing topics):
```markdown
## Frequently Asked Questions

### How much does [service] cost?
[Realistic price range with factors that affect cost]

### How long does [service] take?
[Realistic timeframes based on scope]

### What should I prepare before [service]?
[Actionable checklist or tips]
```

3. RELATED SERVICES SECTION:
```markdown
## Related Services

Depending on your needs, you might also consider:

- [**Packing Services**](/packing-services) - Professional packing for a worry-free move
- [**Local Moving**](/local-moving) - Efficient same-city relocations
- [**Storage Solutions**](/storage-solutions) - Secure storage during your transition
```

EDIT the post to add missing sections.

═══════════════════════════════════════════════════════════════════════
STEP 7 - LINKS
═══════════════════════════════════════════════════════════════════════

Set frontmatter links based on post content:

service_link options:
- /local-moving, /long-distance-moving, /apartment-moving
- /packing-services, /commercial-moving, /storage-solutions
- /senior-moving, /military-moving, /student-moving
- /{location}-{service} for location-specific posts
- null if post isn't service-focused

location_link options:
- /{city}-movers (e.g., /coral-gables-movers, /miami-beach-movers)
- null if post isn't location-specific

EDIT frontmatter to set correct links.

═══════════════════════════════════════════════════════════════════════
STEP 8 - IMAGES
═══════════════════════════════════════════════════════════════════════

Choose image query based on post content and audience:

| Post Content | Query |
|--------------|-------|
| Senior moving | "senior packing" or "elderly couple moving" |
| Family moving | "family moving" or "family packing home" |
| Student moving | "student moving" or "college dorm" |
| Military moving | "military family moving" |
| Location guide | "[city] Florida" or "[city] skyline" |
| Packing tips | "packing cardboard" or "moving supplies" |
| Commercial | "office moving" or "business relocation" |

═══════════════════════════════════════════════════════════════════════
STEP 9 - COMPLETE + STEP 10 - VERIFY
═══════════════════════════════════════════════════════════════════════

Run final processing with images:
```bash
python scripts/blog/blog_images.py {POST_ID} --all --query "{chosen query}"
```

This handles:
- Clean existing images
- Download fresh images matching query
- Rename with SEO names, convert to WebP
- Generate responsive sizes (400w, 800w, 1200w, 1600w)
- Embed in body, update frontmatter
- Calculate and update readTime
- Validate all requirements
- Set status to "completed"

VERIFY after running:
- [ ] Read the image files to visually confirm they match content
- [ ] Confirm no validation errors in output
- [ ] Post type matches content (seniors in senior post, etc.)

═══════════════════════════════════════════════════════════════════════
AUTONOMOUS MODE
═══════════════════════════════════════════════════════════════════════

Make all decisions without asking. Use WebSearch and /agent-browser for research.
If uncertain, make a reasonable choice and continue.
```

### Quality Checkpoints

Before marking a post "completed", verify:

1. **Title fixed** - no year, under 60 chars
2. **No duplicates** - unique angle vs similar posts (or was repurposed)
3. **Content matches title** - correct items, correct location
4. **Items are REAL** - verified via research, not fabricated
5. **Writing quality** - no AI patterns, proper framework applied
6. **Supplementary sections** - CTA, FAQ, Related Services
7. **Images match content** - audience/activity matches post topic, not generic
8. **Images processed** - WebP, responsive sizes, embedded
9. **Links set** - service_link, location_link correct
10. **Frontmatter updated** - status: completed, readTime correct

### Post-Batch Validation

After each batch completes:

```bash
# Validate all completed posts
python scripts/blog/blog_validate.py --completed

# Validate all pending posts (to see what's left)
python scripts/blog/blog_validate.py --pending

# Validate a specific post
python scripts/blog/blog_validate.py 0001
```

The validation script checks:
- AI patterns (em dashes, "dive into", "navigate", etc.)
- Image existence and format (WebP, responsive sizes)
- Frontmatter fields (title length, excerpt, readTime)
- Required sections (CTA with /quote, FAQ, Related Services)
- Post type classification

## Success Criteria

- [ ] responsive-images and qmd skills installed
- [ ] All 1044 posts have status: "completed"
- [ ] All posts have working images with SEO names
- [ ] All images have responsive variants
- [ ] No two posts have similar/duplicate content
- [ ] All posts have appropriate service_link or null
- [ ] All posts have appropriate location_link or null
- [ ] Posts 1-69 have improved body content
- [ ] Site builds without errors: `npm run build`
- [ ] Spot check: Images display correctly on 10 random blog posts
