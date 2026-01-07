'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-number">404</div>
        <h1>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="not-found-actions">
          <Link href="/" className="btn-primary">
            <span>Go Home</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/blog" className="btn-secondary">
            Read Our Blog
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .not-found-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: 2rem;
          text-align: center;
        }
        
        .not-found-content {
          max-width: 500px;
        }
        
        .not-found-number {
          font-size: 8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2D6E7A, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 1rem;
        }
        
        h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        p {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}

