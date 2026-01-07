/**
 * Script to create a new blog post
 * Usage: npm run new-post "Your Post Title Here"
 */

const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Get title from command line
const title = process.argv[2];

if (!title) {
  console.log('Usage: npm run new-post "Your Post Title Here"');
  console.log('\nExample: npm run new-post "Our 2025 Ramadan Campaign"');
  process.exit(1);
}

// Generate slug from title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}

const slug = slugify(title);
const date = new Date().toISOString().split('T')[0];
const fileName = `${slug}.md`;
const filePath = path.join(postsDirectory, fileName);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.log(`❌ Error: A post with slug "${slug}" already exists.`);
  console.log(`   File: content/posts/${fileName}`);
  process.exit(1);
}

// Create post template
const template = `---
title: "${title}"
excerpt: "Write a brief summary of your post here (1-2 sentences)."
image: "/assets/years/2025.jpg"
category: "announcement"
categoryLabel: "Announcement"
author: "Ramadan Giving Team"
date: "${date}"
featured: false
---

## Introduction

Start writing your blog post here. This is the main content of your article.

### Key Points

- First important point
- Second important point
- Third important point

### More Details

Add more sections as needed. You can use:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- [Links](https://example.com) to other pages
- Lists (like this one)

> Blockquotes are great for highlighting important quotes or messages.

### Conclusion

Wrap up your post with a strong conclusion and call to action.

---

*For the community, by the community.* 🌙
`;

// Ensure posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

// Write file
fs.writeFileSync(filePath, template);

console.log(`\n✅ Created new blog post!`);
console.log(`\n📄 File: content/posts/${fileName}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Edit the file with your content`);
console.log(`   2. Update the frontmatter (excerpt, image, category, etc.)`);
console.log(`   3. Run "npm run posts" to regenerate posts.json`);
console.log(`   4. Run "npm run dev" to preview your changes\n`);
console.log(`📁 Available categories:`);
console.log(`   - announcement (Announcements)`);
console.log(`   - program (Programs)`);
console.log(`   - community (Community)`);
console.log(`   - relief (Relief)`);
console.log(`   - volunteer (Volunteer Stories)\n`);

