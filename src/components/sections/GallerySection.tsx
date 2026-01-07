'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function GallerySection() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    fetch('/assets/events/images.json')
      .then((res) => res.json())
      .then((data) => {
        const jpgImages = data.filter((img: string) => img.endsWith('.jpg'));
        const shuffled = jpgImages.sort(() => Math.random() - 0.5);
        setImages(shuffled);
      })
      .catch(console.error);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying || images.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, images.length, nextSlide]);

  const progress = images.length > 0 ? ((currentIndex + 1) / images.length) * 100 : 0;

  if (images.length === 0) {
    return (
      <section id="gallery" className="section gallery-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Story in Photos</span>
            <h2 className="section-title">Moments of Joy</h2>
            <div className="section-line"></div>
          </div>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading gallery...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Story in Photos</span>
          <h2 className="section-title">Moments of Joy</h2>
          <div className="section-line"></div>
        </div>

        <div className="slideshow-container">
          <div 
            className="slideshow-wrapper" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={img} className="slide">
                <Image 
                  src={`/assets/events/${img}`}
                  alt={`Ramadan Giving Event ${index + 1}`}
                  width={1000}
                  height={500}
                  loading={index < 3 ? "eager" : "lazy"}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
          
          <button className="slide-btn prev" onClick={prevSlide} aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="slide-btn next" onClick={nextSlide} aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          
          <div className="slideshow-controls">
            <div className="slide-counter">
              <span className="current">{currentIndex + 1}</span>
              <span className="separator"> / </span>
              <span className="total">{images.length}</span>
            </div>

            <div className="slide-progress-container">
              <div className="slide-progress">
                <div 
                  className="slide-progress-bar" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <button className="slide-play-pause" onClick={togglePlayPause} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
              {isPlaying ? (
                <svg className="pause-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg className="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

