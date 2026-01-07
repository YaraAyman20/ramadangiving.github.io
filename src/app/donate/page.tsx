'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// Types
interface DonorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface DonationState {
  amount: number;
  frequency: string;
  cause: string;
  donorType: string;
  paymentMethod: string;
  dedication: string;
  donorInfo: DonorInfo;
}

const causeNames: Record<string, string> = {
  general: 'Where Needed Most',
  food: 'Food Programs',
  gaza: 'Gaza Relief',
  orphans: 'Orphan Support',
  winter: 'Winter Relief',
  camp: "Children's Camp"
};

const impactMessages: Record<number, string> = {
  25: '$25 provides hot meals for 5 people in need',
  50: '$50 provides a complete winter kit for a family',
  100: '$100 provides food packages for 2 families for a week',
  250: '$250 sponsors a child at our summer camp program',
  500: '$500 feeds 10 families during the entire month of Ramadan',
  1000: '$1,000 provides emergency relief for displaced families'
};

const sampleDonors = [
  { name: 'Sarah M.', amount: 100, time: '2 min ago', initial: 'S' },
  { name: 'Anonymous', amount: 250, time: '5 min ago', initial: '?' },
  { name: 'Ahmed K.', amount: 50, time: '8 min ago', initial: 'A' },
  { name: 'Maria L.', amount: 500, time: '12 min ago', initial: 'M' },
  { name: 'John D.', amount: 100, time: '15 min ago', initial: 'J' },
  { name: 'Fatima R.', amount: 1000, time: '20 min ago', initial: 'F' },
  { name: 'Anonymous', amount: 75, time: '25 min ago', initial: '?' },
  { name: 'Omar S.', amount: 200, time: '30 min ago', initial: 'O' },
];

export default function DonatePage() {
  const [donationState, setDonationState] = useState<DonationState>({
    amount: 100,
    frequency: 'one-time',
    cause: 'general',
    donorType: 'details',
    paymentMethod: 'card',
    dedication: 'none',
    donorInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const heroStatsRef = useRef<HTMLDivElement>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get impact message
  const getImpactMessage = (amount: number) => {
    const amounts = Object.keys(impactMessages).map(Number).sort((a, b) => a - b);
    let message = impactMessages[100];
    for (const amt of amounts) {
      if (amount >= amt) {
        message = impactMessages[amt];
      }
    }
    if (amount >= 2000) {
      message = `$${amount.toLocaleString()} will make an extraordinary impact on countless lives`;
    }
    return message;
  };

  // Counter animation
  const animateCounter = (element: HTMLElement, start: number, end: number, duration: number) => {
    const range = end - start;
    const startTime = performance.now();
    
    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (range * easeOutQuart));
      element.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  };

  // Hero stats animation
  useEffect(() => {
    const stats = document.querySelectorAll('.hero-stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const endValue = parseInt(target.dataset.count || '0');
          animateCounter(target, 0, endValue, 2000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
    return () => observer.disconnect();
  }, []);

  // Goal progress animation
  useEffect(() => {
    const progressBars = document.querySelectorAll('.goal-progress-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target as HTMLElement;
          const progress = bar.dataset.progress;
          setTimeout(() => {
            bar.style.width = `${progress}%`;
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(bar => observer.observe(bar));
    return () => observer.disconnect();
  }, []);

  // Handle donation submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (donationState.donorType === 'details' && !donationState.donorInfo.email) {
      alert('Please enter a valid email address for your receipt');
      return;
    }

    setIsLoading(true);

    if (donationState.paymentMethod === 'bank') {
      // Show bank transfer modal
      alert('Bank transfer instructions will be shown');
      setIsLoading(false);
      return;
    }

    // Redirect to LaunchGood for payment
    window.open('https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope', '_blank');
    setIsLoading(false);
  };

  return (
    <>
      <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
      
      <main className="donate-main">
        {/* Hero Section */}
        <section className="donate-hero">
          <div className="donate-hero-bg"></div>
          <div className="container">
            <div className="donate-hero-content">
              <span className="donate-hero-badge">Make an Impact Today</span>
              <h1 className="donate-hero-title">Your Generosity<br/><span className="highlight">Changes Lives</span></h1>
              <p className="donate-hero-subtitle">Every donation helps us provide food, support, and hope to families in need across Toronto and Cairo. Join thousands of donors making a difference.</p>
              
              <div className="hero-stats" ref={heroStatsRef}>
                <div className="hero-stat">
                  <span className="hero-stat-number" data-count="15000">0</span>
                  <span className="hero-stat-label">Families Served</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number" data-count="50000">0</span>
                  <span className="hero-stat-label">Meals Provided</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number" data-count="952">0</span>
                  <span className="hero-stat-label">Donors This Year</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Donation Feed */}
        <section className="live-feed-section">
          <div className="container">
            <div className="live-feed-wrapper">
              <div className="live-feed-label">
                <span className="live-indicator"></span>
                <span>Recent Donations</span>
              </div>
              <div className="live-feed-track">
                <div className="live-feed-items">
                  {[...sampleDonors, ...sampleDonors].map((donor, index) => (
                    <div key={index} className="feed-item">
                      <div className="feed-avatar">{donor.initial}</div>
                      <span className="feed-text">
                        <strong>{donor.name}</strong> donated <strong>${donor.amount}</strong>
                      </span>
                      <span className="feed-time">{donor.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fundraising Goals */}
        <section className="fundraising-goals">
          <div className="container">
            <div className="goals-header">
              <h2>Current Campaigns</h2>
              <p>Track our progress in real-time and see the impact of every donation</p>
            </div>
            <div className="goals-grid">
              <GoalCard
                icon="🍽️"
                title="Ramadan 2025 Campaign"
                description="Providing food packages and hot meals to families during the blessed month of Ramadan."
                progress={78}
                raised={78500}
                goal={100000}
                donors={284}
                avatars={['S', 'A', 'M']}
              />
              <GoalCard
                icon="🆘"
                title="Gaza Emergency Relief"
                description="Emergency aid for displaced families including food, medical supplies, and essential shelter."
                progress={62}
                raised={155000}
                goal={250000}
                donors={512}
                avatars={['R', 'K', 'J']}
                featured
                urgent
              />
              <GoalCard
                icon="👧"
                title="Children's Summer Camp"
                description="Fun educational camp experiences for underserved children in both Toronto and Cairo communities."
                progress={45}
                raised={22500}
                goal={50000}
                donors={156}
                avatars={['N', 'L', 'T']}
              />
            </div>
          </div>
        </section>

        {/* Main Donation Form */}
        <section className="donation-form-section" id="donateForm">
          <div className="container">
            {/* Step Progress */}
            <div className="form-steps">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`step-item ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                  data-step={step}
                >
                  <span className="step-number">{step}</span>
                  <span className="step-label">
                    {step === 1 ? 'Choose Cause' : step === 2 ? 'Amount' : 'Payment'}
                  </span>
                </div>
              ))}
            </div>

            <div className="donation-wrapper">
              {/* Cause Selection */}
              <div className="donation-causes">
                <h2>Choose a Cause</h2>
                <p className="causes-subtitle">Select where you&apos;d like your donation to have the most impact</p>
                
                <div className="causes-grid">
                  {Object.entries(causeNames).map(([value, name]) => (
                    <label key={value} className="cause-card">
                      <input 
                        type="radio" 
                        name="cause" 
                        value={value}
                        checked={donationState.cause === value}
                        onChange={() => {
                          setDonationState(prev => ({ ...prev, cause: value }));
                          setCurrentStep(Math.max(currentStep, 2));
                        }}
                      />
                      <div className="cause-content">
                        <span className="cause-icon">
                          {value === 'general' ? '❤️' : 
                           value === 'food' ? '🍲' : 
                           value === 'gaza' ? '🆘' : 
                           value === 'orphans' ? '👧' : 
                           value === 'winter' ? '🧥' : '🏕️'}
                        </span>
                        <span className="cause-name">{name}</span>
                        <span className="cause-description">
                          {value === 'general' ? 'Flexible funding for urgent needs' :
                           value === 'food' ? 'Meals & food packages for families' :
                           value === 'gaza' ? 'Emergency aid for Gaza families' :
                           value === 'orphans' ? 'Care & education for orphans' :
                           value === 'winter' ? 'Warm clothing & winter kits' : 'Fun activities for children'}
                        </span>
                      </div>
                      <div className="cause-check">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Donation Form */}
              <div className="donation-form-container">
                <form className="donation-form glass-card" onSubmit={handleSubmit}>
                  <h2>Make Your Donation</h2>

                  {/* Frequency Toggle */}
                  <div className="form-section">
                    <label className="form-label">Donation Type</label>
                    <div className="frequency-toggle">
                      {['one-time', 'weekly', 'monthly'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          className={`frequency-btn ${donationState.frequency === freq ? 'active' : ''}`}
                          onClick={() => setDonationState(prev => ({ ...prev, frequency: freq }))}
                        >
                          {freq === 'one-time' ? 'One-time' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                      ))}
                    </div>
                    {donationState.frequency !== 'one-time' && (
                      <p className="recurring-note">
                        <span className="recurring-icon">🔄</span>
                        You&apos;ll be charged {donationState.frequency} until you cancel
                      </p>
                    )}
                  </div>

                  {/* Amount Selection */}
                  <div className="form-section">
                    <label className="form-label">Select Amount</label>
                    <div className="amount-grid">
                      {[25, 50, 100, 250, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          className={`amount-btn ${donationState.amount === amount ? 'active' : ''}`}
                          onClick={() => {
                            setDonationState(prev => ({ ...prev, amount }));
                            setCurrentStep(Math.max(currentStep, 3));
                          }}
                        >
                          ${amount === 1000 ? '1,000' : amount}
                        </button>
                      ))}
                    </div>
                    <div className="custom-amount">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        min="1"
                        step="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            setDonationState(prev => ({ ...prev, amount: value }));
                            setCurrentStep(Math.max(currentStep, 3));
                          }
                        }}
                      />
                    </div>
                    <div className="amount-impact">
                      <span className="impact-icon">✨</span>
                      <span className="impact-text">{getImpactMessage(donationState.amount)}</span>
                    </div>
                  </div>

                  {/* Donor Type */}
                  <div className="form-section">
                    <label className="form-label">Donor Information</label>
                    <div className="donor-type-toggle">
                      <label className="donor-type-option">
                        <input
                          type="radio"
                          name="donorType"
                          value="details"
                          checked={donationState.donorType === 'details'}
                          onChange={() => setDonationState(prev => ({ ...prev, donorType: 'details' }))}
                        />
                        <span className="donor-type-content">
                          <span className="donor-type-icon">👤</span>
                          <span className="donor-type-text">
                            <strong>With Details</strong>
                            <small>Get receipt & updates</small>
                          </span>
                        </span>
                      </label>
                      <label className="donor-type-option">
                        <input
                          type="radio"
                          name="donorType"
                          value="anonymous"
                          checked={donationState.donorType === 'anonymous'}
                          onChange={() => setDonationState(prev => ({ ...prev, donorType: 'anonymous' }))}
                        />
                        <span className="donor-type-content">
                          <span className="donor-type-icon">🕶️</span>
                          <span className="donor-type-text">
                            <strong>Anonymous</strong>
                            <small>Donate privately</small>
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Donor Details */}
                  {donationState.donorType === 'details' && (
                    <div className="form-section donor-details">
                      <div className="input-row">
                        <div className="input-group">
                          <label htmlFor="firstName">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            placeholder="John"
                            value={donationState.donorInfo.firstName}
                            onChange={(e) => setDonationState(prev => ({
                              ...prev,
                              donorInfo: { ...prev.donorInfo, firstName: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="lastName">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            placeholder="Doe"
                            value={donationState.donorInfo.lastName}
                            onChange={(e) => setDonationState(prev => ({
                              ...prev,
                              donorInfo: { ...prev.donorInfo, lastName: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="john@example.com"
                          value={donationState.donorInfo.email}
                          onChange={(e) => setDonationState(prev => ({
                            ...prev,
                            donorInfo: { ...prev.donorInfo, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="phone">Phone (Optional)</label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+1 (416) 555-0123"
                          value={donationState.donorInfo.phone}
                          onChange={(e) => setDonationState(prev => ({
                            ...prev,
                            donorInfo: { ...prev.donorInfo, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkbox-custom"></span>
                        <span>Keep me updated on Ramadan Giving&apos;s impact</span>
                      </label>
                    </div>
                  )}

                  {/* Dedication */}
                  <div className="form-section">
                    <label className="form-label">
                      Dedicate This Donation <span className="optional">(Optional)</span>
                    </label>
                    <div className="dedication-toggle">
                      {['none', 'honor', 'memory'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`dedication-btn ${donationState.dedication === type ? 'active' : ''}`}
                          onClick={() => setDonationState(prev => ({ ...prev, dedication: type }))}
                        >
                          {type === 'none' ? 'No Dedication' : type === 'honor' ? 'In Honor' : 'In Memory'}
                        </button>
                      ))}
                    </div>
                    {donationState.dedication !== 'none' && (
                      <div className="dedication-details">
                        <input type="text" placeholder="Name of person being honored" />
                        <textarea placeholder="Add a personal message (optional)" rows={2}></textarea>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="form-section payment-section">
                    <label className="form-label">Payment Method</label>
                    <div className="payment-methods">
                      <div className="payment-group">
                        <span className="payment-group-label">Card Payment</span>
                        <button
                          type="button"
                          className={`payment-btn card-pay ${donationState.paymentMethod === 'card' ? 'active' : ''}`}
                          onClick={() => setDonationState(prev => ({ ...prev, paymentMethod: 'card' }))}
                        >
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                          <span>Credit / Debit Card</span>
                          <div className="card-icons">
                            <span className="card-icon visa">VISA</span>
                            <span className="card-icon mastercard">MC</span>
                            <span className="card-icon amex">AMEX</span>
                          </div>
                        </button>
                      </div>
                      <div className="payment-group">
                        <span className="payment-group-label">Bank Transfer</span>
                        <button
                          type="button"
                          className={`payment-btn bank-transfer ${donationState.paymentMethod === 'bank' ? 'active' : ''}`}
                          onClick={() => setDonationState(prev => ({ ...prev, paymentMethod: 'bank' }))}
                        >
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18"/>
                            <path d="M3 10h18"/>
                            <path d="M5 6l7-3 7 3"/>
                            <path d="M4 10v11"/>
                            <path d="M20 10v11"/>
                            <path d="M8 10v11"/>
                            <path d="M12 10v11"/>
                            <path d="M16 10v11"/>
                          </svg>
                          <span>Bank Transfer / E-Transfer</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  {donationState.paymentMethod === 'bank' && (
                    <div className="form-section bank-details">
                      <div className="bank-info-card">
                        <h4>🏦 Bank Transfer Details</h4>
                        <div className="bank-info-grid">
                          <div className="bank-info-item">
                            <span className="bank-label">Bank Name</span>
                            <span className="bank-value">TD Canada Trust</span>
                          </div>
                          <div className="bank-info-item">
                            <span className="bank-label">Account Name</span>
                            <span className="bank-value">Ramadan Giving Organization</span>
                          </div>
                          <div className="bank-info-item">
                            <span className="bank-label">Transit Number</span>
                            <span className="bank-value">12345</span>
                          </div>
                          <div className="bank-info-item">
                            <span className="bank-label">Institution Number</span>
                            <span className="bank-value">004</span>
                          </div>
                          <div className="bank-info-item">
                            <span className="bank-label">Account Number</span>
                            <span className="bank-value">1234567890</span>
                          </div>
                        </div>
                        <div className="etransfer-info">
                          <h5>📧 E-Transfer</h5>
                          <p>Send e-transfers to: <strong>donate@ramadangiving.org</strong></p>
                          <p className="etransfer-note">Include your email in the message for receipt</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="donation-summary">
                    <div className="summary-line">
                      <span>Donation Amount</span>
                      <span className="summary-amount">{formatCurrency(donationState.amount)}</span>
                    </div>
                    {donationState.frequency !== 'one-time' && (
                      <div className="summary-line">
                        <span>Frequency</span>
                        <span className="summary-frequency">{donationState.frequency.charAt(0).toUpperCase() + donationState.frequency.slice(1)}</span>
                      </div>
                    )}
                    <div className="summary-line">
                      <span>Cause</span>
                      <span className="summary-cause">{causeNames[donationState.cause]}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-line total">
                      <span>Total</span>
                      <span className="summary-total">{formatCurrency(donationState.amount)}</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" className={`donate-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    <span className="btn-text">Complete Donation</span>
                    <span className="btn-amount">{formatCurrency(donationState.amount)}</span>
                    <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <div className="security-note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* External Fundraising */}
        <section className="external-fundraising">
          <div className="container">
            <div className="external-header">
              <h2>Other Ways to Donate</h2>
              <p>Support us through our trusted partner platforms</p>
            </div>
            <div className="external-grid">
              <a href="https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope" target="_blank" rel="noopener noreferrer" className="external-card launchgood">
                <div className="external-logo">
                  <span className="external-icon">🚀</span>
                  <span className="external-name">LaunchGood</span>
                </div>
                <p>Join our main campaign and see real-time updates on our progress and impact stories.</p>
                <span className="external-cta">
                  Donate on LaunchGood
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </span>
              </a>
              <Link href="#" className="external-card gofundme">
                <div className="external-logo">
                  <span className="external-icon">💚</span>
                  <span className="external-name">GoFundMe</span>
                </div>
                <p>Emergency campaigns and special projects that need your immediate support.</p>
                <span className="external-cta">
                  View Campaigns
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </span>
              </Link>
              <Link href="#" className="external-card paypal">
                <div className="external-logo">
                  <span className="external-icon">💳</span>
                  <span className="external-name">PayPal</span>
                </div>
                <p>Quick and secure payments via PayPal for instant processing.</p>
                <span className="external-cta">
                  Donate via PayPal
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <div className="trust-grid">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <h4>Secure Donations</h4>
                <p>256-bit SSL encryption protects all your transactions and personal data.</p>
              </div>
              <div className="trust-item">
                <span className="trust-icon">📋</span>
                <h4>Tax Receipts</h4>
                <p>Receive official tax receipts for all eligible donations via email.</p>
              </div>
              <div className="trust-item">
                <span className="trust-icon">💯</span>
                <h4>100% Transparent</h4>
                <p>Track exactly how your donation makes an impact in our communities.</p>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🤝</span>
                <h4>Community Driven</h4>
                <p>All volunteer-run, 100% of donations go directly to programs.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Goal Card Component
interface GoalCardProps {
  icon: string;
  title: string;
  description: string;
  progress: number;
  raised: number;
  goal: number;
  donors: number;
  avatars: string[];
  featured?: boolean;
  urgent?: boolean;
}

function GoalCard({ icon, title, description, progress, raised, goal, donors, avatars, featured, urgent }: GoalCardProps) {
  return (
    <div className={`goal-card ${featured ? 'featured' : ''}`}>
      {urgent && <div className="goal-badge">Urgent</div>}
      <div className="goal-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="goal-description">{description}</p>
      <div className="goal-progress-container">
        <div className="goal-progress-bar">
          <div 
            className={`goal-progress-fill ${urgent ? 'urgent' : ''}`} 
            data-progress={progress} 
            style={{ width: '0%' }}
          ></div>
        </div>
        <div className="goal-stats">
          <span className="goal-raised" data-raised={raised}>${raised.toLocaleString()}</span>
          <span className="goal-target">of ${goal.toLocaleString()} goal</span>
        </div>
      </div>
      <div className="goal-donors">
        <div className="donor-avatars">
          {avatars.map((avatar, i) => (
            <span key={i} className="donor-avatar">{avatar}</span>
          ))}
          <span className="donor-avatar">+{donors - avatars.length}</span>
        </div>
        <span className="donor-count">{donors} donors</span>
      </div>
    </div>
  );
}

