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

## Skills to Use

| Skill | Purpose | When to Invoke |
|-------|---------|----------------|
| **seo-audit** | Detect AI patterns, thin content, E-E-A-T issues | FIRST - before any content changes |
| **copywriting** | Rewrite content using proven frameworks | SECOND - apply fixes from audit |
| **programmatic-seo** | Template optimization for location/service posts | For posts matching template patterns |
| **media-downloader** | Download images using `image_keywords` | After content is finalized |
| **responsive-images** | Generate WebP responsive sizes | After images downloaded |
| **qmd** | Find similar posts to ensure uniqueness | Before editing to check duplicates |
| **find-skills** | Search for and install missing skills | When a skill is unavailable |

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

### Step 1: Query Similar Posts (qmd skill)

Before editing, find similar posts to avoid duplication:

```bash
qmd search "title keywords" --limit 10
qmd similar {post-id}
```

### Step 2: SEO Audit (seo-audit skill) - RUN FIRST

**INVOKE**: `/seo-audit` with the post content

The audit will identify:
- AI writing patterns (em dashes, overused phrases, filler)
- Thin content sections
- Duplicate content signals
- Missing E-E-A-T signals

#### AI Patterns to Fix (from seo-audit)

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

#### Thin Content Fixes

| Issue | Minimum Fix |
|-------|-------------|
| Section < 50 words | Expand with specific details, examples, or tips |
| No examples | Add 1-2 concrete examples per major section |
| Generic advice | Add Miami-specific or service-specific details |
| Missing "why" | Explain benefits, not just instructions |

### Step 3: Copywriting Review (copywriting skill) - RUN SECOND

**INVOKE**: `/copywriting` with the post type and issues to fix

#### Framework Selection by Post Type

| Post Type | Framework | Why |
|-----------|-----------|-----|
| **Problem-focused** (stress, costs, damage) | **PAS** | Agitate the problem, then solve |
| **Benefit-focused** (guides, tips) | **AIDA** | Build interest toward action |
| **Transformation** (before/after moving) | **BAB** | Show the change |
| **How-to/Tutorial** | **4Cs** | Clear, Concise, Compelling, Credible |
| **Listicle** | **Value-first** | Lead with strongest items |

#### PAS Framework (Problem → Agitate → Solution)

```markdown
## The Challenge of [Topic]

[State the problem the reader faces - 2-3 sentences]

### Why This Matters

[Agitate - what happens if they don't solve it? Consequences, frustrations - 2-3 sentences]

### How to Solve It

[Your solution - the main content of the section]
```

**Example - Before (AI-written):**
> Moving can be stressful. It's important to plan ahead. Here are some tips.

**Example - After (PAS):**
> Your move is in two weeks and boxes are piling up faster than you can pack them. Without a system, you'll be hunting for your coffee maker on day one while everything else stays buried in unlabeled boxes. Here's the room-by-room approach that keeps Miami families organized.

#### AIDA Framework (Attention → Interest → Desire → Action)

```markdown
## [Attention-grabbing headline with benefit]

[Hook - surprising fact, question, or bold statement]

### [Interest - expand on the topic]

[Build understanding of the value]

### [Desire - show what's possible]

[Paint picture of success, include social proof if available]

### [Action - clear next step]

[CTA with specific action]
```

#### BAB Framework (Before → After → Bridge)

```markdown
## [Topic]: From [Before State] to [After State]

### Before: [The Current Struggle]

[Describe the reader's current situation - specific, relatable]

### After: [The Desired Outcome]

[Paint the picture of success - specific benefits]

### The Bridge: How to Get There

[Your solution that connects before to after]
```

#### Natural Transitions (Replace Robotic Flow)

| ❌ Robotic | ✅ Natural |
|-----------|-----------|
| "Firstly... Secondly... Thirdly..." | "Start with... Once that's done... Finally..." |
| "In addition to this..." | "You'll also want to..." |
| "Furthermore..." | "Even better..." or "Here's another approach..." |
| "In conclusion..." | "The bottom line:" or just summarize |
| "As mentioned earlier..." | Reference the specific thing or delete |
| "It should be noted that..." | Just state it directly |

### Step 4: Content Uniqueness (programmatic-seo skill)

**INVOKE**: `/programmatic-seo` for template-based posts

#### Post Classification

First, classify the post:

| Type | Characteristics | pSEO Approach |
|------|-----------------|---------------|
| **Template Post** | Location guide, service page, route page | Use templates, vary data |
| **Unique Content** | Opinion, guide, how-to | Ensure truly unique value |
| **Listicle** | "X Ways to...", "Top N..." | Unique items, no overlap |

#### For Template-Based Posts (Location/Service)

These posts SHOULD follow a template but with unique data:

```
TEMPLATE VARIABLES:
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

---

## Additional Sections to Add

Every post should have appropriate supplementary sections. Add these where missing:

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

## Read Time Calculation

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

### Step 1: Download Images

Use the `blog_images.py` script to download images for a post:

```bash
# Download 3-5 images using post's image_keywords from frontmatter
python scripts/blog/blog_images.py 0001 --download

# Download AND rename with SEO-friendly names
python scripts/blog/blog_images.py 0001 --download --rename

# Specify number of images (3-5 recommended)
python scripts/blog/blog_images.py 0001 --download --count 4
```

Or use media-downloader directly:
```bash
python .claude/skills/media-downloader/media_cli.py image "{image_keywords}" -n 4 -o public{image_folder}
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

  2. QUERY SIMILAR POSTS (qmd)
     ```bash
     qmd search "{title keywords}" --limit 10
     ```
     a. Find posts with similar titles/topics
     b. Note their list items if listicles
     c. Identify what makes THIS post unique

  3. INVOKE /seo-audit (MANDATORY)

     Run the seo-audit skill on the post body content.

     Record issues found:
     - [ ] AI patterns (list specific phrases found)
     - [ ] Thin sections (list sections < 50 words)
     - [ ] Missing E-E-A-T signals
     - [ ] Generic content that needs localization

     Example invocation:
     "/seo-audit Check this Miami moving guide for AI patterns,
      thin content, and E-E-A-T issues: [paste content]"

  4. INVOKE /copywriting (MANDATORY)

     Based on post type, apply the correct framework:

     POST TYPE → FRAMEWORK:
     - LOCATION_GUIDE → BAB (Before/After/Bridge)
     - SERVICE_GUIDE → PAS (Problem/Agitate/Solution)
     - HOW_TO → 4Cs (Clear/Concise/Compelling/Credible)
     - LISTICLE → Value-first (strongest items first)
     - LIFESTYLE → AIDA (Attention/Interest/Desire/Action)

     Example invocation:
     "/copywriting Rewrite this SERVICE_GUIDE intro using PAS framework.
      Current: '[paste weak intro]'
      Service: senior moving
      Location: Miami"

     FIX ALL ISSUES from seo-audit:
     a. Replace AI phrases with natural alternatives
     b. Expand thin sections with specific details
     c. Add Miami-specific or service-specific examples
     d. Use natural transitions (not "Firstly... Secondly...")
     e. Rewrite generic statements to be specific

  5. INVOKE /programmatic-seo (FOR TEMPLATE POSTS)

     For LOCATION_GUIDE or SERVICE_GUIDE posts:

     Example invocation:
     "/programmatic-seo Optimize this location guide template.
      Location: {location}
      Ensure unique local details, not just variable swaps."

     Checklist:
     - [ ] Location has REAL local details (landmarks, neighborhoods)
     - [ ] Service examples are specific (not generic definitions)
     - [ ] No duplicate content with similar location/service posts
     - [ ] Template variables filled with unique, accurate data

     For LISTICLE posts:
     - [ ] Verify title count matches content items
     - [ ] Check no duplicate items with similar listicles
     - [ ] Each item has unique explanation (not just different wording)

  6. ANALYZE & SET LINKS
     a. Identify primary service type from content
     b. Identify location if applicable
     c. Set service_link:
        - If location + service: /{location}-{service}
        - If service only: /{service}
        - If LIFESTYLE post: null
     d. Set location_link if location-focused

  7. ADD SUPPLEMENTARY SECTIONS (if missing)

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

     FOR ALL POSTS, ensure CTA section:
     ```markdown
     ## Get Your Free Quote

     Ready to [action relevant to post topic]?
     **[Request your free estimate](/quote)** today.

     Questions? **[Contact us](/contact-us)** or see what
     [Miami families say about us](/reviews).
     ```

     ADD FAQ SECTION when post covers:
     - Pricing ("How much does X cost?")
     - Process ("How long does X take?")
     - Concerns ("Is X safe?", "What if Y happens?")

  8. DOWNLOAD & PROCESS IMAGES (MANDATORY)
     ```bash
     # Full image workflow via blog_process.py (recommended)
     python scripts/blog/blog_process.py {post_id}

     # Or individual steps via blog_images.py
     python scripts/blog/blog_images.py {post_id} --download --rename --resize
     ```

     a. Download 3-5 images using image_keywords
     b. Rename with SEO-optimized filenames
     c. Convert to WebP format
     d. Generate responsive sizes (400w, 800w, 1200w, 1600w)
     e. Update featured and images fields with .webp paths
     f. Embed images in body copy:
        - Place after every 2-3 H2 sections
        - Descriptive alt text with keywords
        - loading="lazy" for all below-fold images

  9. FINAL SEO CHECKS
     Run validation to check all requirements:
     ```bash
     python scripts/blog/blog_validate.py {post_id}
     ```

     Validates:
     a. Excerpt under 155 characters (compelling, not truncated)
     b. Title under 60 characters (no year, no cutoffs)
     c. Proper heading hierarchy (H2 > H3 > H4)
     d. Internal links use location-specific URLs where applicable
     e. No remaining AI patterns
     f. Required sections present (CTA, FAQ, etc.)

  10. MARK COMPLETED
      ```bash
      python scripts/blog/blog_process.py {post_id} --complete
      ```

      This updates:
      - status: "completed"
      - updated: today's date
      - readTime (calculated automatically)
      - needs_ai_image: false (unless no images available)

  11. VERIFY AND CONTINUE
      Final validation should pass:
      ```bash
      python scripts/blog/blog_validate.py {post_id}
      ```

      Move to next post immediately.
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

### Skill Invocations (MANDATORY)
- [ ] **Invoked /seo-audit** on post content
- [ ] **Invoked /copywriting** with correct framework for post type
- [ ] **Invoked /programmatic-seo** (for LOCATION_GUIDE or SERVICE_GUIDE posts)
- [ ] All issues from seo-audit have been fixed
- [ ] Content rewritten using appropriate framework (PAS/AIDA/BAB/4Cs)

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

### Full Workflow Script (Recommended)

**Use `blog_process.py` to orchestrate the complete workflow:**

```bash
# Process a post (validate, download images, rename, resize, update frontmatter)
python scripts/blog/blog_process.py 0001

# Just validate without making changes
python scripts/blog/blog_process.py 0001 --validate-only

# Process images only (skip validation)
python scripts/blog/blog_process.py 0001 --images-only

# Skip image processing (validation + frontmatter only)
python scripts/blog/blog_process.py 0001 --skip-images

# Mark post as completed after processing
python scripts/blog/blog_process.py 0001 --complete
```

**Typical workflow:**
```bash
# 1. Process post and see what needs fixing
python scripts/blog/blog_process.py 0001

# 2. If AI patterns found, invoke skills to fix content
#    /seo-audit [paste content]
#    /copywriting [describe fixes needed]

# 3. Once content is fixed, mark complete
python scripts/blog/blog_process.py 0001 --complete
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

#### Image Download, Rename & Resize
```bash
# Full image workflow (download + rename + resize)
python scripts/blog/blog_images.py 0001 --download --rename --resize

# Individual steps
python scripts/blog/blog_images.py 0001 --download           # Download 4 images (default)
python scripts/blog/blog_images.py 0001 --download --count 5 # Download 5 images
python scripts/blog/blog_images.py 0001 --rename             # Rename + convert to WebP
python scripts/blog/blog_images.py 0001 --resize             # Generate responsive sizes
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

### Media Downloader (Direct)
```bash
python .claude/skills/media-downloader/media_cli.py image "keywords" -n 3 -o /path/to/output
```

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
Process blog post {POST_ID}. Follow blog_update.md workflow EXACTLY.

MANDATORY SKILL INVOCATIONS:
1. FIRST: Invoke /seo-audit on the post content to identify AI patterns and thin content
2. SECOND: Invoke /copywriting to rewrite using the correct framework:
   - LOCATION_GUIDE → BAB (Before/After/Bridge)
   - SERVICE_GUIDE → PAS (Problem/Agitate/Solution)
   - HOW_TO → 4Cs (Clear/Concise/Compelling/Credible)
   - LISTICLE → Value-first ordering
   - LIFESTYLE → AIDA
3. For LOCATION_GUIDE or SERVICE_GUIDE: Invoke /programmatic-seo for template optimization

CONTENT FIXES REQUIRED:
- Remove ALL AI patterns (em dashes, "dive into", "navigate", etc.)
- Expand ALL thin sections (<50 words) with specific details
- Add Miami-specific or service-specific examples
- Use natural transitions (not "Firstly... Secondly...")
- Add E-E-A-T signals (experience, expertise, authority, trust)

IMAGES:
- Download 3-5 images, convert to WebP, generate responsive sizes
- Embed in body copy with loading="lazy"

FINAL:
- Update all frontmatter fields
- Calculate and set readTime
- Set status: "completed"

Make all decisions autonomously. Do not ask questions.
```

### Quality Checkpoints

Before marking a post "completed", verify:

1. **seo-audit was invoked** and ALL issues fixed
2. **copywriting was invoked** with correct framework
3. **No AI patterns remain** in final content
4. **Images processed** and embedded correctly
5. **All frontmatter** updated

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
