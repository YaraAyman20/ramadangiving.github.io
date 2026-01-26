import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPostSlugs, getPostBySlug, getAllPosts } from '@/lib/posts';

// Generate static params for all blog posts
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs;
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - Ramadan Giving',
    };
  }

  return {
    title: `${post.title} - Ramadan Giving`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts from same category
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== slug)
    .slice(0, 3);

  // Build share URLs
  const postUrl = `https://ramadangiving.github.io/blog/${slug}`;
  const shareText = `${post.title} - ${post.excerpt}`;

  return (
    <main className="blog-post-page">
      {/* Post Hero with Image Background */}
      <section className="post-hero-image">
        <div className="post-hero-image-wrapper">
          <Image
            src={post.image.replace('../', '/')}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            className="post-hero-image-bg"
          />
          <div className="post-hero-overlay"></div>
        </div>

        {/* Content Overlay at Bottom - Transparent */}
        <div className="container">
          <div className="post-hero-content-overlay">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="post-author-info">
                <div className="post-author-avatar">{post.author.charAt(0)}</div>
                <div>
                  <span className="post-author-name">{post.author}</span>
                  <time className="post-date">{formatDate(post.date)}</time>
                </div>
              </div>
              
              {/* Category and Location Tags - Aligned with Author */}
              <div className="post-tags-bottom-right">
                {post.location && (
                  <span className="post-location-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {post.location}
                  </span>
                )}
                {post.categoryLabel && (
                  <span className="post-category-badge">{post.categoryLabel}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <article className="post-content-section">
        <div className="container">
          <div className="post-content">
            {post.excerpt && (
              <p className="post-excerpt">{post.excerpt}</p>
            )}
            {post.contentHtml ? (
              // Render markdown content
              <div
                className="post-body markdown-content"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : (
              // Fallback for posts without markdown content
              <div className="post-body">
                <p>Full content coming soon. Check back for the complete article!</p>
              </div>
            )}

            {/* Share Buttons */}
            <div className="post-share">
              <span className="share-label">Share this article:</span>
              <div className="share-buttons">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-btn twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-btn facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a 
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${postUrl}`)}`} 
                  className="share-btn email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <div className="container">
            <h2 className="related-title">Related Articles</h2>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="blog-card">
                  <Link href={`/blog/${relatedPost.slug}`} className="blog-card-link">
                    <div className="blog-card-image">
                      <Image
                        src={relatedPost.image.replace('../', '/')}
                        alt={relatedPost.title}
                        width={600}
                        height={400}
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <span className="blog-card-author">{relatedPost.author}</span>
                        <span className="blog-card-divider">—</span>
                        <time className="blog-card-date">{formatDate(relatedPost.date)}</time>
                      </div>
                      <h3 className="blog-card-title">{relatedPost.title}</h3>
                      <span className="blog-card-category">{relatedPost.categoryLabel}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="post-cta">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of donors who are changing lives across Toronto and Cairo.</p>
            <Link href="/donate" className="btn-primary">
              <span>Donate Now</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
