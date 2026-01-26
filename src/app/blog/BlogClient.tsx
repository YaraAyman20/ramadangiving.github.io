'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PostData } from '@/lib/posts';

interface BlogClientProps {
  initialPosts: PostData[];
  postsPerPage: number;
}

export default function BlogClient({ initialPosts, postsPerPage }: BlogClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase().replace(',', '');
  };

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // Filter by category
    if (activeCategory !== 'all') {
      posts = posts.filter(post => post.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.author.toLowerCase().includes(lowerQuery) ||
        post.categoryLabel.toLowerCase().includes(lowerQuery)
      );
    }

    return posts;
  }, [initialPosts, activeCategory, searchQuery]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setActiveCategory('all');
  };

  // Get featured post
  const featuredPost = initialPosts.find(post => post.featured) || initialPosts[0];

  // Get grid posts (non-featured)
  const gridPosts = filteredPosts.filter(post => !post.featured);

  // Pagination
  const totalPages = Math.ceil(gridPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const pagePosts = gridPosts.slice(startIndex, startIndex + postsPerPage);

  // Categories
  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'program', label: 'Programs' },
    { id: 'community', label: 'Community' },
    { id: 'relief', label: 'Relief' },
    { id: 'volunteer', label: 'Volunteer Stories' },
  ];

  return (
    <main className="blog-page">
      {/* Blog Hero */}
      <section className="blog-hero">
        <div className="blog-hero-bg"></div>
        <div className="container">
          <div className="blog-hero-content">
            <span className="blog-hero-tag">Our Stories</span>
            <h1 className="blog-hero-title">News & Updates</h1>
            <p className="blog-hero-description">
              Stay connected with our community. Read about our programs, events, and the impact we&apos;re making together.
            </p>

            {/* Search Bar */}
            <div className="blog-search-wrapper">
              <div className="blog-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  id="blogSearch"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="blog-categories">
        <div className="container">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && activeCategory === 'all' && searchQuery === '' && (
        <section className="blog-featured">
          <div className="container">
            <div className="featured-article">
              <Link href={`/blog/${featuredPost.slug}`} className="featured-link">
                <div className="featured-image">
                  <Image
                    src={featuredPost.image.replace('../', '/')}
                    alt={featuredPost.title}
                    width={1200}
                    height={600}
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="featured-content">
                  <div className="featured-meta">
                    <span className="featured-icon">🌙</span>
                    <span className="featured-author">{featuredPost.author}</span>
                    <span className="featured-divider">—</span>
                    <time className="featured-date">{formatDate(featuredPost.date)}</time>
                  </div>
                  <h2 className="featured-title">{featuredPost.title}</h2>
                  <span className="featured-category">{featuredPost.categoryLabel}</span>
                  <span className="featured-read-more">
                    Read Full Article
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="blog-grid-section">
        <div className="container">
          {pagePosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No posts found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="blog-grid" id="blogGrid">
              {pagePosts.map((post, index) => (
                <article
                  key={post.slug}
                  className="blog-card"
                  data-category={post.category}
                  style={{
                    animation: `fadeInUp 0.5s ease ${index * 0.1}s forwards`,
                    opacity: 0
                  }}
                >
                  <Link href={`/blog/${post.slug}`} className="blog-card-link">
                    <div className="blog-card-image">
                      <Image
                        src={post.image.replace('../', '/')}
                        alt={post.title}
                        width={600}
                        height={400}
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <span className="blog-card-author">{post.author}</span>
                        <span className="blog-card-divider">—</span>
                        <time className="blog-card-date">{formatDate(post.date)}</time>
                      </div>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <span className="blog-card-category">{post.categoryLabel}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="blog-pagination">
              <button
                className="pagination-arrow prev"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                className="pagination-arrow next"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

