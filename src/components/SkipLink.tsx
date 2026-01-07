'use client';

/**
 * Skip to main content link for accessibility
 * Allows keyboard users to skip navigation
 */
export default function SkipLink() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <style jsx>{`
        .skip-link {
          position: absolute;
          top: -100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-500, #2D6E7A);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0 0 0.5rem 0.5rem;
          text-decoration: none;
          font-weight: 600;
          z-index: 10000;
          transition: top 0.2s ease-in-out;
        }
        
        .skip-link:focus {
          top: 0;
          outline: 3px solid var(--accent-300, #D4AF37);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

