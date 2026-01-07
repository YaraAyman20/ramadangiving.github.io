'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h1>Something went wrong</h1>
        <p>We apologize for the inconvenience. Please try again.</p>
        <div className="error-actions">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>
      </div>
      
      <style jsx>{`
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 2rem;
        }
        
        .error-content {
          text-align: center;
          max-width: 500px;
        }
        
        .error-icon {
          font-size: 4rem;
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
        }
        
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #2D6E7A, #3D8A99);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 110, 122, 0.3);
        }
        
        .btn-secondary {
          background: transparent;
          color: #2D6E7A;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: 2px solid #2D6E7A;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .btn-secondary:hover {
          background: rgba(45, 110, 122, 0.1);
        }
      `}</style>
    </div>
  );
}

