/**
 * =============================================
 * RAMADAN GIVING - ENHANCED DONATION SYSTEM
 * Complete payment system with beautiful UX
 * =============================================
 */

// ============================================
// STRIPE CONFIGURATION
// ============================================
const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51ShcRc80Q9STyDY5BuJxRa1ncMerEoj0UPtOcsEqPBauBsPZ46w7ScFqtNICQPecW123uvLPL6wsSDPn8QkEL8Ea006NgSGHHM',
    organizationName: 'Ramadan Giving',
    country: 'CA',
    currency: 'cad',
    apiEndpoint: null,
    successUrl: window.location.origin + '/donate/success.html',
    cancelUrl: window.location.origin + '/donate/',
    priceIds: {
        oneTime: { 25: null, 50: null, 100: null, 250: null, 500: null, 1000: null },
        weekly: { 25: null, 50: null, 100: null, 250: null, 500: null, 1000: null },
        monthly: { 25: null, 50: null, 100: null, 250: null, 500: null, 1000: null }
    }
};

// ============================================
// GLOBAL STATE
// ============================================
let stripe = null;
let elements = null;
let cardElement = null;
let paymentRequest = null;

const donationState = {
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
};

const causeNames = {
    general: 'Where Needed Most',
    food: 'Food Programs',
    gaza: 'Gaza Relief',
    orphans: 'Orphan Support',
    winter: 'Winter Relief',
    camp: "Children's Camp"
};

const impactMessages = {
    25: '$25 provides hot meals for 5 people in need',
    50: '$50 provides a complete winter kit for a family',
    100: '$100 provides food packages for 2 families for a week',
    250: '$250 sponsors a child at our summer camp program',
    500: '$500 feeds 10 families during the entire month of Ramadan',
    1000: '$1,000 provides emergency relief for displaced families'
};

// Sample donor names for the live feed
const sampleDonors = [
    { name: 'Sarah M.', amount: 100, time: '2 min ago', initial: 'S' },
    { name: 'Anonymous', amount: 250, time: '5 min ago', initial: '?' },
    { name: 'Ahmed K.', amount: 50, time: '8 min ago', initial: 'A' },
    { name: 'Maria L.', amount: 500, time: '12 min ago', initial: 'M' },
    { name: 'John D.', amount: 100, time: '15 min ago', initial: 'J' },
    { name: 'Fatima R.', amount: 1000, time: '20 min ago', initial: 'F' },
    { name: 'Anonymous', amount: 75, time: '25 min ago', initial: '?' },
    { name: 'Omar S.', amount: 200, time: '30 min ago', initial: 'O' },
    { name: 'Lisa T.', amount: 150, time: '35 min ago', initial: 'L' },
    { name: 'Hassan A.', amount: 300, time: '40 min ago', initial: 'H' }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initStripe();
    initDonationForm();
    initGoalProgressAnimations();
    initLiveDonationFeed();
    initHeroStatsAnimation();
    initFloatingSummary();
    initStepIndicator();
    initSmoothScrollToForm();
});

/**
 * Initialize Stripe
 */
function initStripe() {
    if (STRIPE_CONFIG.publishableKey === 'pk_test_YOUR_PUBLISHABLE_KEY_HERE') {
        console.warn('⚠️ Stripe not configured! Please add your publishable key.');
        showStripeConfigWarning();
        return;
    }

    try {
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
        elements = stripe.elements({
            fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' }]
        });
        createCardElement();
        createPaymentRequestButton();
        console.log('✅ Stripe initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        showNotification('Payment system initialization failed. Please try again later.', 'error');
    }
}

/**
 * Show Stripe config warning
 */
function showStripeConfigWarning() {
    const cardDetails = document.getElementById('cardDetails');
    if (cardDetails) {
        cardDetails.innerHTML = `
            <div class="stripe-config-warning">
                <div class="warning-icon">⚠️</div>
                <h4>Stripe Not Configured</h4>
                <p>To enable payments, add your Stripe publishable key to <code>js/donate.js</code></p>
                <ol>
                    <li>Create a Stripe account at <a href="https://stripe.com" target="_blank">stripe.com</a></li>
                    <li>Get your publishable key from the <a href="https://dashboard.stripe.com/apikeys" target="_blank">API keys page</a></li>
                    <li>Replace the placeholder with your key</li>
                </ol>
            </div>
        `;
    }
}

/**
 * Create Stripe Card Element
 */
function createCardElement() {
    const cardElementContainer = document.getElementById('card-element');
    if (!cardElementContainer || !elements) return;

    const style = {
        base: {
            fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            color: '#1A1A18',
            '::placeholder': { color: '#737370' },
            iconColor: '#2D6E7A'
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444'
        }
    };

    cardElement = elements.create('card', { style, hidePostalCode: false });
    cardElement.mount('#card-element');

    cardElement.on('change', (event) => {
        const errorElement = document.getElementById('card-errors');
        if (errorElement) {
            errorElement.textContent = event.error ? event.error.message : '';
        }
    });

    cardElement.on('focus', () => cardElementContainer.classList.add('focused'));
    cardElement.on('blur', () => cardElementContainer.classList.remove('focused'));
}

/**
 * Create Payment Request Button (Apple Pay / Google Pay)
 */
function createPaymentRequestButton() {
    if (!stripe) return;

    paymentRequest = stripe.paymentRequest({
        country: STRIPE_CONFIG.country,
        currency: STRIPE_CONFIG.currency,
        total: {
            label: `Donation to ${STRIPE_CONFIG.organizationName}`,
            amount: donationState.amount * 100
        },
        requestPayerName: true,
        requestPayerEmail: true
    });

    paymentRequest.canMakePayment().then((result) => {
        if (result) {
            const walletGroup = document.getElementById('walletPaymentGroup');
            if (walletGroup) walletGroup.style.display = 'block';

            const prButton = elements.create('paymentRequestButton', {
                paymentRequest,
                style: {
                    paymentRequestButton: {
                        type: 'donate',
                        theme: 'dark',
                        height: '52px'
                    }
                }
            });
            prButton.mount('#payment-request-button');
            console.log('✅ Apple Pay / Google Pay available:', result);
        }
    });

    paymentRequest.on('paymentmethod', async (event) => {
        try {
            showNotification('Processing your payment...', 'info');
            await redirectToStripeCheckout();
            event.complete('success');
        } catch (error) {
            console.error('Payment failed:', error);
            event.complete('fail');
            showNotification('Payment failed. Please try again.', 'error');
        }
    });
}

/**
 * Update Payment Request amount
 */
function updatePaymentRequestAmount() {
    if (paymentRequest) {
        paymentRequest.update({
            total: {
                label: `Donation to ${STRIPE_CONFIG.organizationName}`,
                amount: donationState.amount * 100
            }
        });
    }
}

// ============================================
// LIVE DONATION FEED
// ============================================

function initLiveDonationFeed() {
    const feedContainer = document.getElementById('liveFeedItems');
    if (!feedContainer) return;

    // Create duplicate items for seamless scrolling
    const items = [...sampleDonors, ...sampleDonors];
    
    feedContainer.innerHTML = items.map(donor => `
        <div class="feed-item">
            <div class="feed-avatar">${donor.initial}</div>
            <span class="feed-text">
                <strong>${donor.name}</strong> donated <strong>$${donor.amount}</strong>
            </span>
            <span class="feed-time">${donor.time}</span>
        </div>
    `).join('');

    // Simulate new donations periodically
    setInterval(() => {
        simulateNewDonation();
    }, 15000);
}

function simulateNewDonation() {
    const amounts = [25, 50, 75, 100, 150, 200, 250, 500];
    const names = ['Sarah', 'Ahmed', 'Maria', 'John', 'Fatima', 'Omar', 'Lisa', 'Hassan', 'Anonymous'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    
    // Show notification for new donation
    showDonationNotification(name, amount);
}

function showDonationNotification(name, amount) {
    const notification = document.createElement('div');
    notification.className = 'donation-toast';
    notification.innerHTML = `
        <div class="toast-icon">🎉</div>
        <div class="toast-content">
            <strong>${name}</strong> just donated <strong>$${amount}</strong>
        </div>
    `;
    
    addToastStyles();
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// HERO STATS ANIMATION
// ============================================

function initHeroStatsAnimation() {
    const stats = document.querySelectorAll('.hero-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.dataset.count);
                animateCounter(target, 0, endValue, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (range * easeOutQuart));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// FLOATING SUMMARY (MOBILE)
// ============================================

function initFloatingSummary() {
    const floatingSummary = document.getElementById('floatingSummary');
    const donationForm = document.querySelector('.donation-form-section');
    
    if (!floatingSummary || !donationForm) return;
    
    // Only show on mobile
    if (window.innerWidth > 1024) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingSummary.classList.add('visible');
            } else {
                floatingSummary.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(donationForm);
}

function updateFloatingSummary() {
    const floatingAmount = document.getElementById('floatingAmount');
    const floatingCause = document.getElementById('floatingCause');
    
    if (floatingAmount) {
        floatingAmount.textContent = formatCurrency(donationState.amount);
    }
    if (floatingCause) {
        floatingCause.textContent = causeNames[donationState.cause];
    }
}

// ============================================
// STEP INDICATOR
// ============================================

function initStepIndicator() {
    const steps = document.querySelectorAll('.step-item');
    const causeInputs = document.querySelectorAll('input[name="cause"]');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');
    const paymentBtns = document.querySelectorAll('.payment-btn');
    
    // Update step based on user interaction
    function updateStep(step) {
        steps.forEach((s, i) => {
            s.classList.remove('active', 'completed');
            if (i + 1 < step) {
                s.classList.add('completed');
            } else if (i + 1 === step) {
                s.classList.add('active');
            }
        });
    }
    
    causeInputs.forEach(input => {
        input.addEventListener('change', () => updateStep(2));
    });
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => updateStep(3));
    });
    
    if (customAmount) {
        customAmount.addEventListener('focus', () => updateStep(3));
    }
    
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => updateStep(3));
    });
}

// ============================================
// SMOOTH SCROLL TO FORM
// ============================================

function initSmoothScrollToForm() {
    // If URL has hash #donateForm, scroll to it smoothly
    if (window.location.hash === '#donateForm') {
        setTimeout(() => {
            const form = document.getElementById('donateForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 500);
    }
}

// ============================================
// DONATION FORM HANDLING
// ============================================

function initDonationForm() {
    const elements = {
        frequencyBtns: document.querySelectorAll('.frequency-btn'),
        recurringNote: document.getElementById('recurringNote'),
        recurringFrequency: document.getElementById('recurringFrequency'),
        amountBtns: document.querySelectorAll('.amount-btn'),
        customAmountInput: document.getElementById('customAmount'),
        amountImpact: document.getElementById('amountImpact'),
        causeInputs: document.querySelectorAll('input[name="cause"]'),
        donorTypeInputs: document.querySelectorAll('input[name="donorType"]'),
        donorDetails: document.getElementById('donorDetails'),
        dedicationBtns: document.querySelectorAll('.dedication-btn'),
        dedicationDetails: document.getElementById('dedicationDetails'),
        cardPayBtn: document.getElementById('cardPayBtn'),
        bankTransferBtn: document.getElementById('bankTransferBtn'),
        cardDetails: document.getElementById('cardDetails'),
        bankDetails: document.getElementById('bankDetails'),
        summaryAmount: document.getElementById('summaryAmount'),
        summaryFrequencyLine: document.getElementById('summaryFrequencyLine'),
        summaryFrequency: document.getElementById('summaryFrequency'),
        summaryCause: document.getElementById('summaryCause'),
        summaryTotal: document.getElementById('summaryTotal'),
        submitBtn: document.getElementById('donateSubmitBtn'),
        submitBtnAmount: document.querySelector('.donate-submit-btn .btn-amount')
    };

    // Frequency Toggle
    elements.frequencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.frequencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donationState.frequency = btn.dataset.frequency;
            
            if (elements.recurringNote) {
                if (donationState.frequency !== 'one-time') {
                    elements.recurringNote.style.display = 'flex';
                    elements.recurringFrequency.textContent = donationState.frequency;
                } else {
                    elements.recurringNote.style.display = 'none';
                }
            }
            
            updateSummary(elements);
        });
    });

    // Amount Selection with animation
    elements.amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donationState.amount = parseInt(btn.dataset.amount);
            
            if (elements.customAmountInput) {
                elements.customAmountInput.value = '';
            }
            
            // Add ripple effect
            addRippleEffect(btn);
            
            updateSummary(elements);
            updatePaymentRequestAmount();
            updateFloatingSummary();
        });
    });

    // Custom Amount Input
    if (elements.customAmountInput) {
        elements.customAmountInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value > 0) {
                elements.amountBtns.forEach(b => b.classList.remove('active'));
                donationState.amount = value;
                updateSummary(elements);
                updatePaymentRequestAmount();
                updateFloatingSummary();
            }
        });

        elements.customAmountInput.addEventListener('focus', () => {
            elements.amountBtns.forEach(b => b.classList.remove('active'));
        });
    }

    // Cause Selection
    elements.causeInputs.forEach(input => {
        input.addEventListener('change', () => {
            donationState.cause = input.value;
            updateSummary(elements);
            updateFloatingSummary();
        });
    });

    // Donor Type Toggle
    elements.donorTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            donationState.donorType = input.value;
            
            if (elements.donorDetails) {
                if (donationState.donorType === 'anonymous') {
                    elements.donorDetails.style.display = 'none';
                } else {
                    elements.donorDetails.style.display = 'block';
                }
            }
        });
    });

    // Dedication Toggle
    elements.dedicationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.dedicationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donationState.dedication = btn.dataset.dedication;
            
            if (elements.dedicationDetails) {
                elements.dedicationDetails.style.display = 
                    donationState.dedication !== 'none' ? 'block' : 'none';
            }
        });
    });

    // Payment Method Selection
    function setPaymentMethod(method) {
        donationState.paymentMethod = method;
        document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
        
        if (elements.cardDetails) elements.cardDetails.style.display = 'none';
        if (elements.bankDetails) elements.bankDetails.style.display = 'none';
        
        if (method === 'card') {
            elements.cardPayBtn?.classList.add('active');
            if (elements.cardDetails) elements.cardDetails.style.display = 'block';
        } else if (method === 'bank') {
            elements.bankTransferBtn?.classList.add('active');
            if (elements.bankDetails) elements.bankDetails.style.display = 'block';
        }
    }

    elements.cardPayBtn?.addEventListener('click', () => setPaymentMethod('card'));
    elements.bankTransferBtn?.addEventListener('click', () => setPaymentMethod('bank'));

    // Form Submission
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleDonationSubmit();
        });
    }

    updateSummary(elements);
}

/**
 * Add ripple effect to button
 */
function addRippleEffect(button) {
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Update Summary Display
 */
function updateSummary(elements) {
    const formattedAmount = formatCurrency(donationState.amount);
    
    if (elements.summaryAmount) elements.summaryAmount.textContent = formattedAmount;
    if (elements.summaryTotal) elements.summaryTotal.textContent = formattedAmount;
    if (elements.submitBtnAmount) elements.submitBtnAmount.textContent = formattedAmount;
    
    if (elements.summaryFrequencyLine) {
        if (donationState.frequency !== 'one-time') {
            elements.summaryFrequencyLine.style.display = 'flex';
            elements.summaryFrequency.textContent = capitalize(donationState.frequency);
        } else {
            elements.summaryFrequencyLine.style.display = 'none';
        }
    }
    
    if (elements.summaryCause) {
        elements.summaryCause.textContent = causeNames[donationState.cause] || 'Where Needed Most';
    }
    
    // Update impact message with animation
    const impactText = elements.amountImpact?.querySelector('.impact-text');
    if (impactText) {
        let message = impactMessages[100];
        const amounts = Object.keys(impactMessages).map(Number).sort((a, b) => a - b);
        
        for (const amt of amounts) {
            if (donationState.amount >= amt) {
                message = impactMessages[amt];
            }
        }
        
        if (donationState.amount >= 2000) {
            message = `$${donationState.amount.toLocaleString()} will make an extraordinary impact on countless lives`;
        }
        
        // Animate the text change
        impactText.style.opacity = '0';
        setTimeout(() => {
            impactText.textContent = message;
            impactText.style.opacity = '1';
        }, 150);
    }
}

// ============================================
// PAYMENT PROCESSING
// ============================================

async function handleDonationSubmit() {
    if (!validateDonationForm()) return;

    collectDonorInfo();

    const submitBtn = document.getElementById('donateSubmitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        if (donationState.paymentMethod === 'bank') {
            showBankTransferConfirmation();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        await redirectToStripeCheckout();
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification(error.message || 'Payment failed. Please try again.', 'error');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function redirectToStripeCheckout() {
    if (!stripe) {
        throw new Error('Stripe not initialized. Please configure your API key.');
    }

    const isSubscription = donationState.frequency !== 'one-time';
    
    const checkoutConfig = {
        mode: isSubscription ? 'subscription' : 'payment',
        successUrl: STRIPE_CONFIG.successUrl + '?session_id={CHECKOUT_SESSION_ID}&amount=' + donationState.amount,
        cancelUrl: STRIPE_CONFIG.cancelUrl,
        clientReferenceId: generateReferenceId(),
        customerEmail: donationState.donorInfo.email || undefined,
        metadata: {
            cause: donationState.cause,
            causeName: causeNames[donationState.cause],
            dedication: donationState.dedication,
            frequency: donationState.frequency,
            donorType: donationState.donorType
        }
    };

    const priceId = getPriceId();
    
    if (priceId) {
        checkoutConfig.lineItems = [{ price: priceId, quantity: 1 }];
    } else {
        showCheckoutInstructions();
        return;
    }

    const { error } = await stripe.redirectToCheckout(checkoutConfig);
    if (error) throw new Error(error.message);
}

function getPriceId() {
    const frequencyKey = donationState.frequency === 'one-time' ? 'oneTime' : donationState.frequency;
    const prices = STRIPE_CONFIG.priceIds[frequencyKey];
    return prices?.[donationState.amount] || null;
}

function showCheckoutInstructions() {
    const modal = createModal({
        title: '💳 Complete Your Donation',
        content: `
            <p>To complete your <strong>${formatCurrency(donationState.amount)}</strong> donation, you'll be redirected to our secure payment page.</p>
            
            ${donationState.frequency !== 'one-time' ? `
                <p class="recurring-info">
                    <span style="color: var(--accent-600);">🔄 ${capitalize(donationState.frequency)} recurring donation</span>
                </p>
            ` : ''}
            
            <div class="donation-summary-modal">
                <div class="summary-row">
                    <span>Cause:</span>
                    <span>${causeNames[donationState.cause]}</span>
                </div>
                <div class="summary-row">
                    <span>Amount:</span>
                    <span><strong>${formatCurrency(donationState.amount)}</strong></span>
                </div>
            </div>
            
            <p style="font-size: 0.9rem; color: var(--text-muted);">
                You'll be able to enter your card details on the next page.
            </p>
        `,
        confirmText: 'Continue to Payment',
        onConfirm: () => {
            window.open('https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope', '_blank');
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

function validateDonationForm() {
    if (!donationState.amount || donationState.amount < 1) {
        showNotification('Please enter a valid donation amount', 'error');
        return false;
    }

    if (donationState.donorType === 'details') {
        const email = document.getElementById('email')?.value;
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address for your receipt', 'error');
            document.getElementById('email')?.focus();
            return false;
        }
    }

    return true;
}

function collectDonorInfo() {
    donationState.donorInfo = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || ''
    };
}

function generateReferenceId() {
    return 'RG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// BANK TRANSFER
// ============================================

function showBankTransferConfirmation() {
    const modal = createModal({
        title: '🏦 Bank Transfer Instructions',
        content: `
            <p>Thank you for choosing to donate <strong>${formatCurrency(donationState.amount)}</strong>!</p>
            
            <div class="bank-details-modal">
                <h4>Bank Transfer Details</h4>
                <div class="bank-row"><span>Bank:</span><span>TD Canada Trust</span></div>
                <div class="bank-row"><span>Account Name:</span><span>Ramadan Giving Organization</span></div>
                <div class="bank-row"><span>Transit:</span><span>12345</span></div>
                <div class="bank-row"><span>Institution:</span><span>004</span></div>
                <div class="bank-row"><span>Account:</span><span>1234567890</span></div>
            </div>
            
            <div class="etransfer-details-modal">
                <h4>📧 E-Transfer</h4>
                <p>Send to: <strong>donate@ramadangiving.org</strong></p>
            </div>
            
            <p class="transfer-note">
                <strong>Important:</strong> Include your email in the transfer notes for your tax receipt.
            </p>
        `,
        confirmText: 'Got It',
        onConfirm: closeModal
    });
    
    document.body.appendChild(modal);
}

// ============================================
// CONFETTI EFFECT
// ============================================

function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#2D6E7A', '#D4AF37', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = (Math.random() * 8 + 6) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 4000);
}

// Make it available globally for success page
window.triggerConfetti = triggerConfetti;

// ============================================
// UI UTILITIES
// ============================================

function createModal({ title, content, confirmText, onConfirm }) {
    const modal = document.createElement('div');
    modal.className = 'donation-modal-overlay';
    modal.innerHTML = `
        <div class="donation-modal">
            <button class="modal-close" onclick="closeModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <h3>${title}</h3>
            <div class="modal-content">${content}</div>
            <button class="modal-confirm-btn" id="modalConfirmBtn">${confirmText}</button>
        </div>
    `;
    
    setTimeout(() => {
        const confirmBtn = document.getElementById('modalConfirmBtn');
        if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
    }, 0);
    
    addModalStyles();
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.donation-modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => modal.remove(), 300);
    }
}
window.closeModal = closeModal;

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
        .donation-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .donation-modal {
            background: #fff;
            border-radius: 24px;
            padding: 2.5rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .donation-modal h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            color: #1C4750;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .modal-content {
            color: #52524F;
            line-height: 1.8;
            margin-bottom: 1.5rem;
        }
        
        .modal-close {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            background: #f5f5f3;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            color: #737370;
            padding: 0.5rem;
            transition: all 0.2s;
        }
        
        .modal-close:hover { 
            background: #e5e5e3;
            color: #1A1A18;
            transform: rotate(90deg);
        }
        
        .modal-confirm-btn {
            width: 100%;
            padding: 1.1rem;
            background: linear-gradient(135deg, #2D6E7A, #245A64);
            color: white;
            border: none;
            border-radius: 14px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-confirm-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(45, 110, 122, 0.35);
        }
        
        .bank-details-modal, .etransfer-details-modal {
            background: #F5F5F3;
            padding: 1.25rem;
            border-radius: 14px;
            margin: 1rem 0;
        }
        
        .bank-details-modal h4, .etransfer-details-modal h4 {
            font-size: 1.05rem;
            color: #2D6E7A;
            margin-bottom: 0.75rem;
        }
        
        .bank-row {
            display: flex;
            justify-content: space-between;
            padding: 0.35rem 0;
            font-size: 0.9rem;
        }
        
        .bank-row span:last-child {
            font-family: 'SF Mono', Monaco, monospace;
            font-weight: 600;
        }
        
        .transfer-note {
            background: rgba(212, 175, 55, 0.12);
            padding: 0.85rem;
            border-radius: 10px;
            font-size: 0.9rem;
            margin-top: 1rem;
            border-left: 3px solid #D4AF37;
        }
        
        .donation-summary-modal {
            background: #F5F5F3;
            padding: 1rem;
            border-radius: 12px;
            margin: 1rem 0;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.35rem 0;
        }
        
        .recurring-info {
            text-align: center;
            font-weight: 500;
        }
        
        .stripe-config-warning {
            background: linear-gradient(135deg, #FEF3CD, #FFF8E6);
            border: 1px solid #F0E6A6;
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
        }
        
        .stripe-config-warning .warning-icon {
            font-size: 3rem;
            margin-bottom: 0.75rem;
        }
        
        .stripe-config-warning h4 {
            color: #856404;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .stripe-config-warning ol {
            text-align: left;
            padding-left: 1.5rem;
            margin: 1rem 0;
        }
        
        .stripe-config-warning li {
            margin-bottom: 0.6rem;
            color: #52524F;
        }
        
        .stripe-config-warning code {
            background: rgba(0,0,0,0.08);
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 0.85em;
        }
        
        .stripe-config-warning a {
            color: #2D6E7A;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(styles);
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.donation-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `donation-notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    addNotificationStyles();
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        .donation-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9998;
            max-width: 400px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .donation-notification.show {
            transform: translateX(0);
        }
        
        .donation-notification.error { border-left: 4px solid #ef4444; }
        .donation-notification.success { border-left: 4px solid #22c55e; }
        .donation-notification.info { border-left: 4px solid #2D6E7A; }
        
        .notification-icon { font-size: 1.3rem; }
        .notification-message { color: #52524F; font-size: 0.95rem; }
    `;
    document.head.appendChild(styles);
}

function addToastStyles() {
    if (document.getElementById('toast-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
        .donation-toast {
            position: fixed;
            bottom: 100px;
            left: 20px;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #fff, #f8f8f6);
            border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9997;
            transform: translateX(-120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 4px solid #22c55e;
        }
        
        .donation-toast.show {
            transform: translateX(0);
        }
        
        .toast-icon { font-size: 1.5rem; }
        
        .toast-content {
            color: #52524F;
            font-size: 0.95rem;
        }
        
        .toast-content strong {
            color: #1A1A18;
        }
        
        @media (max-width: 768px) {
            .donation-toast {
                left: 10px;
                right: 10px;
                bottom: 80px;
            }
        }
    `;
    document.head.appendChild(styles);
}

// ============================================
// GOAL PROGRESS ANIMATIONS
// ============================================

function initGoalProgressAnimations() {
    const progressBars = document.querySelectorAll('.goal-progress-fill');
    const raisedAmounts = document.querySelectorAll('.goal-raised');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.dataset.progress;
                
                // Animate progress bar
                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    progressBars.forEach(bar => observer.observe(bar));
    
    // Animate raised amounts
    const amountObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const raised = parseInt(el.dataset.raised);
                animateCounter(el, 0, raised, 2000);
                el.textContent = '$0';
                
                // Format as currency after animation
                setTimeout(() => {
                    el.textContent = '$' + raised.toLocaleString();
                }, 2100);
                
                amountObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    
    raisedAmounts.forEach(el => {
        if (el.dataset.raised) {
            amountObserver.observe(el);
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
