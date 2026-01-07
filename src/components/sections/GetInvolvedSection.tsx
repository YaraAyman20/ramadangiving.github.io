'use client';

import Link from 'next/link';

export default function GetInvolvedSection() {
  const cards = [
    {
      icon: "🤝",
      title: "Volunteer",
      description: "Join our community of hundreds of volunteers. Whether it's packing boxes, distributing food, or organizing events, your time is valuable.",
      cta: "Sign Up to Volunteer"
    },
    {
      icon: "📢",
      title: "Partner With Us",
      description: "Collaborate with us to amplify our impact. We welcome partnerships with businesses, community groups, and other organizations.",
      cta: "Become a Partner"
    },
    {
      icon: "🎁",
      title: "Sponsor an Event",
      description: "Help us host our community galas and fundraising events. Your sponsorship directly supports our humanitarian relief efforts.",
      cta: "Sponsor Opportunities"
    }
  ];

  return (
    <section id="get-involved" className="section get-involved-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Take Action</span>
          <h2 className="section-title">Join the Movement</h2>
          <div className="section-line"></div>
          <p className="section-description">There are many ways to make a difference.</p>
        </div>
        <div className="involvement-grid">
          {cards.map((card, index) => (
            <div key={index} className="involvement-card glass-card">
              <div className="card-glow"></div>
              <div className="icon-wrapper">
                <span>{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href="#" className="btn-text">
                <span>{card.cta}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

