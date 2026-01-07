/**
 * Script to generate posts.json from markdown files in content/posts/
 * Run this before build: node scripts/generate-posts.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content/posts');
const outputPath = path.join(process.cwd(), 'public/posts.json');

function generatePostsJson() {
  console.log('📝 Generating posts.json from markdown files...\n');

  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.log('⚠️  No content/posts directory found. Creating it...');
    fs.mkdirSync(postsDirectory, { recursive: true });
    console.log('✅ Created content/posts directory');
    console.log('📁 Add your markdown posts there!\n');
    return;
  }

  // Get all markdown files (ignore files starting with _)
  const fileNames = fs.readdirSync(postsDirectory)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  if (fileNames.length === 0) {
    console.log('⚠️  No markdown files found in content/posts/');
    console.log('📁 Add .md files to create blog posts\n');
    return;
  }

  const posts = fileNames.map((fileName, index) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      id: String(index + 1),
      slug,
      title: data.title || 'Untitled Post',
      excerpt: data.excerpt || '',
      content: `${slug}.html`, // Legacy field for compatibility
      image: data.image || '/assets/images/default.jpg',
      category: data.category || 'general',
      categoryLabel: data.categoryLabel || 'General',
      author: data.author || 'Ramadan Giving Team',
      date: data.date || new Date().toISOString().split('T')[0],
      featured: data.featured || false,
    };
  });

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Write to public/posts.json
  const output = { posts };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ Generated posts.json with ${posts.length} posts:\n`);
  posts.forEach((post, i) => {
    const featured = post.featured ? ' ⭐ (featured)' : '';
    console.log(`   ${i + 1}. ${post.title}${featured}`);
    console.log(`      📅 ${post.date} | 📁 ${post.categoryLabel}`);
  });
  console.log('\n🎉 Done! Posts are ready.\n');
}

generatePostsJson();

