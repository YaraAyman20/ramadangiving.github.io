'use client';

export default function Loading() {
  return (
    <div className="loading-container" aria-busy="true" aria-live="polite">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading...</p>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1.5rem;
        }
        
        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-radius: 50%;
        }
        
        .spinner-ring:nth-child(1) {
          border-top-color: #2D6E7A;
          animation: spin 1s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
          border-right-color: #D4AF37;
          animation: spin 1.5s linear infinite reverse;
        }
        
        .spinner-ring:nth-child(3) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-bottom-color: #3D8A99;
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: #666;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

