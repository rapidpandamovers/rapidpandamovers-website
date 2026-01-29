const blogData = require('../data/blog.json');

console.log('Checking for escaped characters in blog posts...\n');

let foundEscapes = 0;
let foundBackslashQuote = 0;
let foundBackslashApostrophe = 0;

blogData.forEach((post, index) => {
  const hasBackslashQuote = post.content.includes("\\'");
  const hasBackslashDoubleQuote = post.content.includes('\\"');

  if (hasBackslashQuote) {
    foundBackslashApostrophe++;
    console.log(`Post ${post.id} has escaped apostrophes: ${post.title}`);
  }

  if (hasBackslashDoubleQuote) {
    foundBackslashQuote++;
    console.log(`Post ${post.id} has escaped quotes: ${post.title}`);
  }

  if (hasBackslashQuote || hasBackslashDoubleQuote) {
    foundEscapes++;
  }
});

console.log(`\n--- Summary ---`);
console.log(`Total posts: ${content.blog.length}`);
console.log(`Posts with escaped apostrophes: ${foundBackslashApostrophe}`);
console.log(`Posts with escaped quotes: ${foundBackslashQuote}`);
console.log(`Total posts with escapes: ${foundEscapes}`);

if (foundEscapes === 0) {
  console.log('\n✓ All posts are clean - no escaped characters found!');
} else {
  console.log('\n✗ Some posts still have escaped characters');
}

// Show sample from first post
console.log('\nSample from first post:');
console.log(content.blog[0].content.substring(0, 300));
