import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryLabel: string;
  author: string;
  date: string;
  featured?: boolean;
  contentHtml?: string;
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs() {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

/**
 * Get post data by slug (with HTML content)
 */
export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  // Check if markdown file exists
  if (!fs.existsSync(fullPath)) {
    // Fall back to posts.json
    return getPostFromJson(slug);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    image: data.image || '/assets/images/default.jpg',
    category: data.category || 'general',
    categoryLabel: data.categoryLabel || 'General',
    author: data.author || 'Ramadan Giving Team',
    date: data.date || new Date().toISOString().split('T')[0],
    featured: data.featured || false,
    contentHtml,
  };
}

/**
 * Get post from posts.json (fallback)
 */
function getPostFromJson(slug: string): PostData | null {
  const postsJsonPath = path.join(process.cwd(), 'public', 'posts.json');
  
  if (!fs.existsSync(postsJsonPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(postsJsonPath, 'utf8');
  const data = JSON.parse(fileContents);
  const post = data.posts?.find((p: PostData) => p.slug === slug);
  
  if (!post) {
    return null;
  }
  
  return {
    ...post,
    image: post.image.replace('../', '/'),
    contentHtml: null, // No HTML content from JSON
  };
}

/**
 * Get all posts for listing
 */
export function getAllPosts(): PostData[] {
  const postsFromJson = getPostsFromJson();
  const postsFromMd = getPostsFromMarkdown();
  
  // Merge, with MD files taking precedence
  const slugsFromMd = new Set(postsFromMd.map(p => p.slug));
  const mergedPosts = [
    ...postsFromMd,
    ...postsFromJson.filter(p => !slugsFromMd.has(p.slug)),
  ];
  
  // Sort by date (newest first)
  return mergedPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get posts from markdown files
 */
function getPostsFromMarkdown(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        image: data.image || '/assets/images/default.jpg',
        category: data.category || 'general',
        categoryLabel: data.categoryLabel || 'General',
        author: data.author || 'Ramadan Giving Team',
        date: data.date || new Date().toISOString().split('T')[0],
        featured: data.featured || false,
      };
    });
}

/**
 * Get posts from posts.json
 */
function getPostsFromJson(): PostData[] {
  const postsJsonPath = path.join(process.cwd(), 'public', 'posts.json');
  
  if (!fs.existsSync(postsJsonPath)) {
    return [];
  }
  
  const fileContents = fs.readFileSync(postsJsonPath, 'utf8');
  const data = JSON.parse(fileContents);
  
  return (data.posts || []).map((post: PostData) => ({
    ...post,
    image: post.image.replace('../', '/'),
  }));
}

