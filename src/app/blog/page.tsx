import { getAllPosts } from '@/lib/posts';
import BlogClient from './BlogClient';
import type { Metadata } from 'next';

const postsPerPage = 9;

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Stay connected with our community. Read about our programs, events, and the impact we\'re making together.',
  openGraph: {
    title: 'News & Updates | Ramadan Giving',
    description: 'Stay connected with our community. Read about our programs, events, and the impact we\'re making together.',
  },
};

export default async function BlogPage() {
  // Server-side: Fetch posts at build time
  const allPosts = getAllPosts();

  return <BlogClient initialPosts={allPosts} postsPerPage={postsPerPage} />;
}

