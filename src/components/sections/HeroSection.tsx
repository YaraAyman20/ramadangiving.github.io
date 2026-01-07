'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <header className="hero">
      <div className="hero-bg-pattern"></div>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-brand">Ramadan Giving</h1>
        <h2 className="hero-title">
          Carrying the spirit of Ramadan 🌙<br/>
          <span className="highlight">✨ every day, all year ✨</span>
        </h2>
        <p className="hero-subtitle">🤝 For the community, by the community 🌎</p>
        <span className="hero-badge">Since 2021</span>
        <div className="hero-buttons">
          <Link href="#about" className="btn-primary">
            <span>Our Story</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="#impact" className="btn-secondary">See Our Impact</Link>
        </div>
        <div className="hero-stats-bar">
          <div className="hero-stat">
            <span className="hero-stat-number">$320K+</span>
            <span className="hero-stat-label">Raised</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-number">5000+</span>
            <span className="hero-stat-label">Lunch Bags</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-number">2500+</span>
            <span className="hero-stat-label">Food Packages</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-number">400+</span>
            <span className="hero-stat-label">Children Served</span>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow"></div>
      </div>
    </header>
  );
}

