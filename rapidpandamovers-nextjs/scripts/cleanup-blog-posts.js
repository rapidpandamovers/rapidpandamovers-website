const fs = require('fs');
const path = require('path');

// Read extracted posts (these are the original 69 from WordPress)
const extractedPath = path.join(__dirname, '../data/extracted-blog-posts.json');
const extractedPosts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

console.log('Original WordPress posts:', extractedPosts.length);

// Clean and format content
const cleanContent = (text) => {
  if (!text) return '';

  let cleaned = text
    // Remove escaped characters
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')

    // Remove escaped quotes and apostrophes
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')

    // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n')

    // Remove extra spaces
    .replace(/[ \t]+/g, ' ')
    .replace(/ \n/g, '\n')
    .replace(/\n /g, '\n')

    // Trim
    .trim();

  return cleaned;
};

// Format content into proper sections with markdown-style headers
const formatContent = (text) => {
  if (!text) return '';

  let formatted = cleanContent(text);

  // Split into paragraphs
  const lines = formatted.split('\n');
  const output = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if it looks like a heading (short line, possibly followed by content)
    const isShortLine = line.length < 100;
    const hasColonOrQuestion = line.endsWith(':') || line.endsWith('?');
    const isAllCaps = line === line.toUpperCase() && line.length > 3;
    const nextLineIsContent = i < lines.length - 1 && lines[i + 1].trim().length > 50;

    // Convert to H2 if it looks like a section heading
    if ((isShortLine && (hasColonOrQuestion || nextLineIsContent)) || isAllCaps) {
      // Remove trailing colon for headers
      const heading = line.replace(/:$/, '');
      output.push(`\n## ${heading}\n`);
    }
    // Check if it's a bulleted list item
    else if (line.match(/^-\s+/) || line.match(/^\*\s+/) || line.match(/^\d+\.\s+/)) {
      output.push(line);
    }
    // Regular paragraph
    else {
      output.push(line + '\n');
    }
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

// Process all posts
const processedPosts = extractedPosts.map(post => {
  return {
    ...post,
    title: cleanContent(post.title),
    excerpt: cleanContent(post.excerpt),
    content: formatContent(post.content)
  };
});

// Sort by date ascending (oldest first)
processedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));

// Renumber from 1 to 69
processedPosts.forEach((post, index) => {
  post.id = index + 1;
});

console.log('Processed posts:', processedPosts.length);
console.log('\nID Range:', processedPosts[0].id, 'to', processedPosts[processedPosts.length - 1].id);
console.log('Date Range:', processedPosts[0].date, 'to', processedPosts[processedPosts.length - 1].date);

// Save to blog.json
const blogPath = path.join(__dirname, '../data/blog.json');
fs.writeFileSync(blogPath, JSON.stringify(processedPosts, null, 2));

console.log('\n✓ Successfully cleaned and formatted all blog posts');
console.log('\nSample post (ID 1 - oldest):');
console.log('Title:', processedPosts[0].title);
console.log('Date:', processedPosts[0].date);
console.log('Content preview:', processedPosts[0].content.substring(0, 200) + '...');

console.log('\nSample post (ID 69 - newest):');
console.log('Title:', processedPosts[68].title);
console.log('Date:', processedPosts[68].date);
console.log('Content preview:', processedPosts[68].content.substring(0, 200) + '...');
