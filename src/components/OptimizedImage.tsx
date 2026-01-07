'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

/**
 * Optimized Image component with:
 * - Loading skeleton
 * - Error fallback
 * - Blur placeholder effect
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/assets/images/placeholder.jpg',
  showSkeleton = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`optimized-image-wrapper ${isLoading ? 'loading' : ''}`}>
      {showSkeleton && isLoading && (
        <div className="image-skeleton" aria-hidden="true" />
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`optimized-image ${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
      <style jsx>{`
        .optimized-image-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .image-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            var(--neutral-200, #e5e7eb) 25%,
            var(--neutral-100, #f3f4f6) 50%,
            var(--neutral-200, #e5e7eb) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: inherit;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .optimized-image {
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

