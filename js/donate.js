/**
 * =============================================
 * RAMADAN GIVING - STRIPE DONATION INTEGRATION
 * Complete payment system with Apple Pay, Google Pay, and Card payments
 * =============================================
 */

// ============================================
// STRIPE CONFIGURATION
// Replace with your actual Stripe publishable key
// ============================================
const STRIPE_CONFIG = {
    // 🔑 IMPORTANT: Replace this with your Stripe publishable key
    // Get it from: https://dashboard.stripe.com/apikeys
    publishableKey: 'pk_test_51ShcRc80Q9STyDY5BuJxRa1ncMerEoj0UPtOcsEqPBauBsPZ46w7ScFqtNICQPecW123uvLPL6wsSDPn8QkEL8Ea006NgSGHHM',
    
    // Your organization details for Apple Pay / Google Pay
    organizationName: 'Ramadan Giving',
    country: 'CA', // Canada
    currency: 'cad',
    
    // Optional: Your backend API endpoint for creating payment intents
    // If you have a serverless function, put the URL here
    // Leave null to use Stripe Checkout (recommended for static sites)
    apiEndpoint: null,
    
    // Stripe Checkout success/cancel URLs
    successUrl: window.location.origin + '/donate/success.html',
    cancelUrl: window.location.origin + '/donate/',
    
    // Pre-configured price IDs from your Stripe Dashboard
    // Create these in Stripe Dashboard > Products
    // For one-time donations, use "one_time" pricing
    // For subscriptions, use "recurring" pricing
    priceIds: {
        // One-time donation price IDs (create in Stripe Dashboard)
        oneTime: {
            25: null,  // Set to your Stripe Price ID, e.g., 'price_1ABC123...'
            50: null,
            100: null,
            250: null,
            500: null,
            1000: null
        },
        // Weekly subscription price IDs
        weekly: {
            25: null,
            50: null,
            100: null,
            250: null,
            500: null,
            1000: null
        },
        // Monthly subscription price IDs
        monthly: {
            25: null,
            50: null,
            100: null,
            250: null,
            500: null,
            1000: null
        }
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

// Cause names for metadata
const causeNames = {
    general: 'Where Needed Most',
    food: 'Food Programs',
    gaza: 'Gaza Relief',
    orphans: 'Orphan Support',
    winter: 'Winter Relief',
    camp: "Children's Camp"
};

// Impact messages
const impactMessages = {
    25: '$25 can provide hot meals for 5 people',
    50: '$50 can provide a winter kit for a family',
    100: '$100 can provide food packages for 2 families for a week',
    250: '$250 can support a child at our camp program',
    500: '$500 can provide food for 10 families during Ramadan',
    1000: '$1,000 can sponsor emergency relief for displaced families'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initStripe();
    initDonationForm();
    initGoalProgressAnimations();
});

/**
 * Initialize Stripe
 */
function initStripe() {
    // Check if Stripe key is configured
    if (STRIPE_CONFIG.publishableKey === 'pk_test_YOUR_PUBLISHABLE_KEY_HERE') {
        console.warn('⚠️ Stripe not configured! Please add your publishable key to STRIPE_CONFIG.');
        showStripeConfigWarning();
        return;
    }

    try {
        // Initialize Stripe
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
        
        // Initialize Stripe Elements
        elements = stripe.elements({
            fonts: [
                {
                    cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap'
                }
            ]
        });

        // Create and mount Card Element
        createCardElement();
        
        // Create Payment Request Button (Apple Pay / Google Pay)
        createPaymentRequestButton();
        
        console.log('✅ Stripe initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        showNotification('Payment system initialization failed. Please try again later.', 'error');
    }
}

/**
 * Show warning when Stripe is not configured
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
                    <li>Replace <code>pk_test_YOUR_PUBLISHABLE_KEY_HERE</code> with your key</li>
                </ol>
                <p class="warning-note">For testing, use a key starting with <code>pk_test_</code></p>
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

    // Style the card element to match the site design
    const style = {
        base: {
            fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            color: '#1A1A18',
            '::placeholder': {
                color: '#737370'
            },
            iconColor: '#2D6E7A'
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444'
        }
    };

    // Create the card element
    cardElement = elements.create('card', {
        style,
        hidePostalCode: false
    });

    // Mount to the container
    cardElement.mount('#card-element');

    // Handle errors
    cardElement.on('change', (event) => {
        const errorElement = document.getElementById('card-errors');
        if (errorElement) {
            errorElement.textContent = event.error ? event.error.message : '';
        }
    });

    // Add focus styling
    cardElement.on('focus', () => {
        cardElementContainer.classList.add('focused');
    });

    cardElement.on('blur', () => {
        cardElementContainer.classList.remove('focused');
    });
}

/**
 * Create Payment Request Button (Apple Pay / Google Pay)
 */
function createPaymentRequestButton() {
    if (!stripe) return;

    // Create payment request
    paymentRequest = stripe.paymentRequest({
        country: STRIPE_CONFIG.country,
        currency: STRIPE_CONFIG.currency,
        total: {
            label: `Donation to ${STRIPE_CONFIG.organizationName}`,
            amount: donationState.amount * 100 // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true
    });

    // Check if Apple Pay / Google Pay is available
    paymentRequest.canMakePayment().then((result) => {
        if (result) {
            // Show the wallet payment group
            const walletGroup = document.getElementById('walletPaymentGroup');
            if (walletGroup) {
                walletGroup.style.display = 'block';
            }

            // Create and mount the payment request button
            const prButton = elements.create('paymentRequestButton', {
                paymentRequest,
                style: {
                    paymentRequestButton: {
                        type: 'donate',
                        theme: 'dark',
                        height: '48px'
                    }
                }
            });

            prButton.mount('#payment-request-button');

            console.log('✅ Apple Pay / Google Pay available:', result);
        } else {
            console.log('ℹ️ Apple Pay / Google Pay not available');
        }
    });

    // Handle payment request submission
    paymentRequest.on('paymentmethod', async (event) => {
        try {
            showNotification('Processing your payment...', 'info');
            
            // For static sites, redirect to Stripe Checkout
            // The payment method from Apple/Google Pay will be used
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
 * Update Payment Request amount when donation amount changes
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
// DONATION FORM HANDLING
// ============================================

function initDonationForm() {
    // DOM Elements
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

    // Amount Selection
    elements.amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donationState.amount = parseInt(btn.dataset.amount);
            
            if (elements.customAmountInput) {
                elements.customAmountInput.value = '';
            }
            
            updateSummary(elements);
            updatePaymentRequestAmount();
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
        });
    });

    // Donor Type Toggle
    elements.donorTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            donationState.donorType = input.value;
            
            if (elements.donorDetails) {
                elements.donorDetails.style.display = 
                    donationState.donorType === 'anonymous' ? 'none' : 'block';
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

    // Initialize
    updateSummary(elements);
}

/**
 * Update Summary Display
 */
function updateSummary(elements) {
    const formattedAmount = formatCurrency(donationState.amount);
    
    if (elements.summaryAmount) {
        elements.summaryAmount.textContent = formattedAmount;
    }
    if (elements.summaryTotal) {
        elements.summaryTotal.textContent = formattedAmount;
    }
    if (elements.submitBtnAmount) {
        elements.submitBtnAmount.textContent = formattedAmount;
    }
    
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
    
    // Update impact message
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
            message = `$${donationState.amount.toLocaleString()} can make an extraordinary impact`;
        }
        
        impactText.textContent = message;
    }
}

// ============================================
// PAYMENT PROCESSING
// ============================================

/**
 * Handle Donation Submission
 */
async function handleDonationSubmit() {
    // Validate form
    if (!validateDonationForm()) {
        return;
    }

    // Get donor info
    collectDonorInfo();

    // Show loading state
    const submitBtn = document.getElementById('donateSubmitBtn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">Processing...</span>';
    submitBtn.disabled = true;

    try {
        if (donationState.paymentMethod === 'bank') {
            showBankTransferConfirmation();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            return;
        }

        // Process with Stripe
        await redirectToStripeCheckout();
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification(error.message || 'Payment failed. Please try again.', 'error');
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }
}

/**
 * Redirect to Stripe Checkout
 */
async function redirectToStripeCheckout() {
    if (!stripe) {
        throw new Error('Stripe not initialized. Please configure your API key.');
    }

    // Determine the mode based on frequency
    const isSubscription = donationState.frequency !== 'one-time';
    
    // Build the checkout session configuration
    const checkoutConfig = {
        mode: isSubscription ? 'subscription' : 'payment',
        successUrl: STRIPE_CONFIG.successUrl + '?session_id={CHECKOUT_SESSION_ID}',
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

    // Try to use pre-configured price IDs
    const priceId = getPriceId();
    
    if (priceId) {
        // Use pre-configured price from Stripe Dashboard
        checkoutConfig.lineItems = [{
            price: priceId,
            quantity: 1
        }];
    } else {
        // Use dynamic pricing (requires backend or Checkout with price_data)
        // For static sites without backend, we'll show instructions
        showCheckoutInstructions();
        return;
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout(checkoutConfig);
    
    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Get pre-configured price ID
 */
function getPriceId() {
    const frequencyKey = donationState.frequency === 'one-time' ? 'oneTime' : donationState.frequency;
    const prices = STRIPE_CONFIG.priceIds[frequencyKey];
    
    if (prices && prices[donationState.amount]) {
        return prices[donationState.amount];
    }
    
    return null;
}

/**
 * Show checkout instructions when price IDs are not configured
 */
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
            // For demo purposes, redirect to LaunchGood
            // In production, this would redirect to your Stripe Checkout
            window.open('https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope', '_blank');
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

/**
 * Validate Donation Form
 */
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

/**
 * Collect Donor Information
 */
function collectDonorInfo() {
    donationState.donorInfo = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || ''
    };
}

/**
 * Generate Reference ID
 */
function generateReferenceId() {
    return 'RG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// BANK TRANSFER HANDLING
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
// UI UTILITIES
// ============================================

/**
 * Create Modal
 */
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
    
    // Add event listener for confirm button
    setTimeout(() => {
        const confirmBtn = document.getElementById('modalConfirmBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', onConfirm);
        }
    }, 0);
    
    // Add modal styles
    addModalStyles();
    
    return modal;
}

/**
 * Close Modal
 */
function closeModal() {
    const modal = document.querySelector('.donation-modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => modal.remove(), 300);
    }
}
window.closeModal = closeModal;

/**
 * Add Modal Styles
 */
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
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
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
            border-radius: 20px;
            padding: 2rem;
            max-width: 480px;
            width: 90%;
            position: relative;
            animation: slideUp 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .donation-modal h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            color: #1C4750;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .modal-content {
            color: #52524F;
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #737370;
            padding: 0.5rem;
        }
        
        .modal-close:hover { color: #1A1A18; }
        
        .modal-confirm-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #2D6E7A, #245A64);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-confirm-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(45, 110, 122, 0.3);
        }
        
        .bank-details-modal, .etransfer-details-modal {
            background: #F5F5F3;
            padding: 1rem;
            border-radius: 12px;
            margin: 1rem 0;
        }
        
        .bank-details-modal h4, .etransfer-details-modal h4 {
            font-size: 1rem;
            color: #2D6E7A;
            margin-bottom: 0.75rem;
        }
        
        .bank-row {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            font-size: 0.9rem;
        }
        
        .bank-row span:last-child {
            font-family: 'SF Mono', Monaco, monospace;
            font-weight: 600;
        }
        
        .transfer-note {
            background: rgba(212, 175, 55, 0.1);
            padding: 0.75rem;
            border-radius: 8px;
            font-size: 0.9rem;
            margin-top: 1rem;
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
            padding: 0.25rem 0;
        }
        
        .recurring-info {
            text-align: center;
            font-weight: 500;
        }
        
        .stripe-config-warning {
            background: #FEF3CD;
            border: 1px solid #F0E6A6;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
        }
        
        .stripe-config-warning .warning-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .stripe-config-warning h4 {
            color: #856404;
            margin-bottom: 1rem;
        }
        
        .stripe-config-warning ol {
            text-align: left;
            padding-left: 1.5rem;
            margin: 1rem 0;
        }
        
        .stripe-config-warning li {
            margin-bottom: 0.5rem;
            color: #52524F;
        }
        
        .stripe-config-warning code {
            background: rgba(0,0,0,0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
        }
        
        .stripe-config-warning a {
            color: #2D6E7A;
            text-decoration: underline;
        }
        
        .warning-note {
            font-size: 0.85rem;
            color: #666;
            font-style: italic;
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Show Notification
 */
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
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Add Notification Styles
 */
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
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9998;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .donation-notification.error { border-left: 4px solid #ef4444; }
        .donation-notification.success { border-left: 4px solid #22c55e; }
        .donation-notification.info { border-left: 4px solid #2D6E7A; }
        
        .notification-icon { font-size: 1.2rem; }
        .notification-message { color: #52524F; font-size: 0.95rem; }
    `;
    document.head.appendChild(styles);
}

// ============================================
// GOAL PROGRESS ANIMATIONS
// ============================================

function initGoalProgressAnimations() {
    const progressBars = document.querySelectorAll('.goal-progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.dataset.progress;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
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
