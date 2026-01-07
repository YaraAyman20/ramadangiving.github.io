'use client';

export default function AboutSection() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Mission</span>
          <h2 className="section-title">Who We Are</h2>
          <div className="section-line"></div>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p className="lead-text">
              Founded in 2021 during the COVID-19 pandemic, Ramadan Giving began as a grassroots initiative to
              build connection and serve during a time of isolation.
            </p>
            <p>
              What started by delivering non-perishable food packages to vulnerable families in Cairo and the GTA 
              has blossomed into a year-round community movement.
            </p>
            <ul className="about-list">
              <li>
                <div className="icon-box">
                  <span className="icon">🌍</span>
                </div>
                <div>
                  <strong>Global Reach</strong>
                  <p>Supporting individuals locally in the GTA and internationally in Cairo.</p>
                </div>
              </li>
              <li>
                <div className="icon-box">
                  <span className="icon">🤝</span>
                </div>
                <div>
                  <strong>Community Powered</strong>
                  <p>Powered by hundreds of volunteers united by compassion and service.</p>
                </div>
              </li>
              <li>
                <div className="icon-box">
                  <span className="icon">❤️</span>
                </div>
                <div>
                  <strong>Inclusive Service</strong>
                  <p>Serving all people, regardless of faith, background, or identity.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="about-stats">
            <div className="stat-card glass-card">
              <div className="stat-icon">💰</div>
              <h3 className="stat-number">$320K+</h3>
              <p className="stat-label">Raised for Relief</p>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon">🍱</div>
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Lunch Bags</p>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon">📦</div>
              <h3 className="stat-number">2,500+</h3>
              <p className="stat-label">Food Packages</p>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon">👧</div>
              <h3 className="stat-number">400+</h3>
              <p className="stat-label">Children at Camps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

