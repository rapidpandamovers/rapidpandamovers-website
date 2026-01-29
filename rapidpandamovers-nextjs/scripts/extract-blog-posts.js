const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlPath = path.join(__dirname, '../../source/wwwrapidpandamoverscom.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Find the wp2i_posts INSERT statement
const postsMatch = sqlContent.match(/INSERT INTO `wp2i_posts` VALUES\s+([\s\S]+?);\s*\/\*!/);

if (!postsMatch) {
  console.error('Could not find wp2i_posts INSERT statement');
  process.exit(1);
}

// Parse the VALUES part
const valuesString = postsMatch[1];

// This is complex because the values contain escaped quotes and commas
// We'll use a simple parser to extract rows
function parseRows(valuesString) {
  const rows = [];
  let currentRow = [];
  let currentValue = '';
  let inQuotes = false;
  let escapeNext = false;
  let parenDepth = 0;

  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];
    const nextChar = valuesString[i + 1];

    if (escapeNext) {
      currentValue += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      currentValue += char;
      continue;
    }

    if (char === "'" && !inQuotes) {
      inQuotes = true;
      continue;
    } else if (char === "'" && inQuotes && nextChar === "'") {
      // Escaped quote
      currentValue += "'";
      i++; // Skip next quote
      continue;
    } else if (char === "'" && inQuotes) {
      inQuotes = false;
      continue;
    }

    if (inQuotes) {
      currentValue += char;
      continue;
    }

    if (char === '(') {
      parenDepth++;
      if (parenDepth === 1) {
        continue; // Start of new row
      }
    } else if (char === ')') {
      parenDepth--;
      if (parenDepth === 0) {
        // End of row
        currentRow.push(currentValue);
        rows.push(currentRow);
        currentRow = [];
        currentValue = '';
        continue;
      }
    } else if (char === ',' && parenDepth === 1) {
      // End of value
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if (parenDepth > 0) {
      currentValue += char;
    }
  }

  return rows;
}

console.log('Parsing SQL rows...');
const rows = parseRows(valuesString);
console.log(`Found ${rows.length} total rows in wp2i_posts`);

// Filter for published blog posts
const blogPosts = rows.filter(row => {
  const postType = row[20]; // post_type column
  const postStatus = row[7]; // post_status column
  return postType === 'post' && postStatus === 'publish';
});

console.log(`Found ${blogPosts.length} published blog posts`);

// Convert to our format
const posts = blogPosts.map((row, index) => {
  const title = row[5]; // post_title
  const slug = row[11]; // post_name
  const content = row[4]; // post_content
  const excerpt = row[6]; // post_excerpt
  const date = row[2]; // post_date

  // Clean HTML from content and excerpt
  const cleanText = (html) => {
    if (!html) return '';
    let text = html;

    // Remove Fusion Builder shortcodes
    text = text.replace(/\[fusion_[^\]]+\]/g, '');
    text = text.replace(/\[\/fusion_[^\]]+\]/g, '');
    text = text.replace(/\[\/\w+\]/g, '');

    // Remove other WordPress shortcodes
    text = text.replace(/\[\/?[a-z_]+[^\]]*\]/g, '');

    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#039;/g, "'");
    text = text.replace(/&rsquo;/g, "'");
    text = text.replace(/&lsquo;/g, "'");
    text = text.replace(/&rdquo;/g, '"');
    text = text.replace(/&ldquo;/g, '"');
    text = text.replace(/&mdash;/g, '—');
    text = text.replace(/&ndash;/g, '–');

    // Clean up whitespace
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/[ \t]+/g, ' ');
    text = text.trim();

    return text;
  };

  // Parse date
  const postDate = new Date(date);
  const formattedDate = postDate.toISOString().split('T')[0];

  // Estimate read time (assuming 200 words per minute)
  const wordCount = cleanText(content).split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Try to extract category from content or default to "Moving Tips"
  let category = 'Moving Tips';
  if (title.toLowerCase().includes('apartment')) category = 'Apartment Moving';
  else if (title.toLowerCase().includes('local')) category = 'Local Moving';
  else if (title.toLowerCase().includes('commercial')) category = 'Commercial Moving';
  else if (title.toLowerCase().includes('packing')) category = 'Packing Services';
  else if (title.toLowerCase().includes('long distance')) category = 'Long Distance';
  else if (title.toLowerCase().includes('storage')) category = 'Storage';

  return {
    id: index + 8, // Start from 8 since we have 7 posts already
    title: cleanText(title),
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    excerpt: cleanText(excerpt) || cleanText(content).substring(0, 200) + '...',
    date: formattedDate,
    readTime: `${readTime} min read`,
    category: category,
    content: cleanText(content)
  };
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Save to JSON file
const outputPath = path.join(__dirname, '../data/extracted-blog-posts.json');
fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

console.log(`Extracted ${posts.length} blog posts to ${outputPath}`);
console.log('\nSample post:');
console.log(JSON.stringify(posts[0], null, 2));
