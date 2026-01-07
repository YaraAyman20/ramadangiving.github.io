'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryLabel: string;
  author: string;
  date: string;
  featured?: boolean;
}

export default function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/posts.json')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts?.slice(0, 12) || []))
      .catch(console.error);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase().replace(',', '');
  };

  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const getVisiblePageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (currentPage === 0) return [0, 1, 2];
    if (currentPage >= totalPages - 1) return [totalPages - 3, totalPages - 2, totalPages - 1];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const offset = currentPage * itemsPerPage * 100 / posts.length * posts.length / itemsPerPage;

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Stay Updated</span>
          <h2 className="section-title">The latest news</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="news-carousel">
          <div 
            className="news-carousel-track" 
            ref={trackRef}
            style={{ transform: `translateX(-${currentPage * (100 / (posts.length / itemsPerPage))}%)` }}
          >
            {posts.map((post) => (
              <article key={post.id} className="news-card" data-category={post.category}>
                <Link href={`/blog/${post.slug}`} className="news-card-link">
                  <div className="news-image">
                    <Image 
                      src={post.image.replace('../', '/')} 
                      alt={post.title}
                      width={400}
                      height={250}
                      loading="lazy"
                    />
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-author">{post.author}</span>
                      <span className="news-divider">-</span>
                      <time className="news-date">{formatDate(post.date)}</time>
                    </div>
                    <h3 className="news-title">{post.title}</h3>
                    <span className="news-read-more">
                      Read more
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
        
        <div className="news-carousel-pagination">
          <button 
            className="news-nav-btn news-prev" 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous news"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div className="news-page-numbers">
            {getVisiblePageNumbers().map((page) => (
              <button 
                key={page}
                className={`news-page-num ${page === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>
          <button 
            className="news-nav-btn news-next"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next news"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

