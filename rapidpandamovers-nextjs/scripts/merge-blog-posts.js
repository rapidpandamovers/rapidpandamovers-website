const fs = require('fs');
const path = require('path');

// Read current blog.json
const blogPath = path.join(__dirname, '../data/blog.json');
const currentBlog = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

// Read extracted blog posts
const extractedPath = path.join(__dirname, '../data/extracted-blog-posts.json');
const extractedPosts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

console.log('Current blog posts:', currentBlog.length);
console.log('Extracted posts:', extractedPosts.length);

// Get slugs of existing posts
const existingSlugs = new Set(currentBlog.map(p => p.slug));
console.log('\nExisting slugs:', Array.from(existingSlugs));

// Filter out duplicates from extracted posts
const newPosts = extractedPosts.filter(p => {
  if (existingSlugs.has(p.slug)) {
    console.log(`Skipping duplicate: ${p.slug}`);
    return false;
  }
  return true;
});

console.log(`\nFound ${newPosts.length} new posts to add`);

// Renumber IDs sequentially
const allPosts = [...currentBlog, ...newPosts];
allPosts.forEach((post, index) => {
  post.id = index + 1;
});

// Sort by date descending
allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Save to blog.json with pretty formatting
fs.writeFileSync(blogPath, JSON.stringify(allPosts, null, 2));

console.log(`\nSuccessfully merged! Total blog posts: ${allPosts.length}`);
console.log('\nSample of new posts added:');
newPosts.slice(0, 5).forEach(p => {
  console.log(`- ${p.title} (${p.slug})`);
});
