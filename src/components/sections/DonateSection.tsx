'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DonateSection() {
  const [selectedAmount, setSelectedAmount] = useState(100);

  const impactMessages: Record<number, string> = {
    25: '$25 provides hot meals for 5 people',
    50: '$50 provides a winter kit for a family',
    100: '$100 provides food packages for 2 families',
    250: '$250 supports a child at our camp program'
  };

  return (
    <section id="donate" className="section donate-section">
      <div className="donate-bg-pattern"></div>
      <div className="container donate-container">
        <div className="donate-content">
          <span className="donate-badge">Make an Impact</span>
          <h2>Support Our Mission</h2>
          <p>
            Your generous donation helps us provide essential food, winter kits, and programs for vulnerable
            families in Cairo and the GTA.
          </p>
          
          <div className="donate-quick-options">
            <div className="quick-amounts">
              {[25, 50, 100, 250].map((amount) => (
                <button
                  key={amount}
                  className={`quick-amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <p className="donation-impact-preview">{impactMessages[selectedAmount]}</p>
          </div>
          
          <Link href="/donate" className="btn-primary donate-cta">
            <span>Donate Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          
          <div className="donate-alternatives">
            <span className="donate-alt-label">Or donate via:</span>
            <div className="donate-alt-links">
              <a 
                href="https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope" 
                target="_blank" 
                rel="noopener noreferrer"
                className="donate-alt-link"
              >
                <span className="alt-icon">🚀</span>
                <span>LaunchGood</span>
              </a>
              <Link href="/donate#bank-transfer" className="donate-alt-link">
                <span className="alt-icon">🏦</span>
                <span>Bank Transfer</span>
              </Link>
              <Link href="/donate#recurring" className="donate-alt-link">
                <span className="alt-icon">🔄</span>
                <span>Monthly Giving</span>
              </Link>
            </div>
          </div>
          
          <div className="donate-trust-badges">
            <div className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Secure</span>
            </div>
            <div className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Tax Receipt</span>
            </div>
            <div className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>100% Impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

