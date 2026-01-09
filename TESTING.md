# Testing Guide - Donation System

This guide will help you test the signup, login, and donation flows.

## Prerequisites

1. ✅ Supabase project set up
2. ✅ Stripe account configured
3. ✅ Environment variables set in `.env.local`
4. ✅ Database schema run in Supabase
5. ✅ Edge Functions deployed

## Test Checklist

### 1. Signup Flow

**Steps:**
1. Navigate to `/signup`
2. Enter a test email (e.g., `test@example.com`)
3. Enter a password (min 6 characters)
4. Confirm password
5. Click "Create Account"

**Expected Results:**
- ✅ Success message: "Account created! Please check your email to confirm."
- ✅ Redirect to login page
- ✅ Check Supabase Dashboard > Authentication > Users - should see new user
- ✅ Check Supabase Dashboard > Table Editor > profiles - should see new profile record

**Common Issues:**
- If email confirmation is required, check your email (or disable email confirmation in Supabase Dashboard > Authentication > Settings)
- If profile not created, check the trigger in `schema.sql` was run

### 2. Login Flow

**Steps:**
1. Navigate to `/login`
2. Enter the email you used for signup
3. Enter the password
4. Click "Sign In"

**Expected Results:**
- ✅ Success message: "Welcome back!"
- ✅ Redirect to home page or the page you came from
- ✅ User should be authenticated (check if profile icon appears in navbar)

**Common Issues:**
- If "Invalid email or password" - verify user exists in Supabase
- If email not confirmed - check Supabase Dashboard > Authentication > Users and confirm email manually if needed

### 3. Donation Flow - Registered User

**Steps:**
1. Make sure you're logged in
2. Navigate to `/donate`
3. Select "Sign In" tab (should show your email)
4. Select amount (e.g., $50)
5. Select frequency (One-Time or Monthly)
6. Select allocation (e.g., "Where Most Needed")
7. Click "Donate $50"

**Expected Results:**
- ✅ Redirects to Stripe Checkout
- ✅ Complete payment with test card: `4242 4242 4242 4242`
- ✅ Redirects to `/donation-success`
- ✅ Shows success message with transaction details
- ✅ Check Supabase Dashboard > Table Editor > donations - should see new donation record
- ✅ Check Stripe Dashboard > Payments - should see test payment

### 4. Donation Flow - Guest User

**Steps:**
1. Make sure you're logged out
2. Navigate to `/donate`
3. Select "Guest" tab
4. Enter name: "Test Guest"
5. Enter email: "guest@example.com"
6. Select amount (e.g., $25)
7. Click "Donate $25"

**Expected Results:**
- ✅ Redirects to Stripe Checkout
- ✅ Complete payment with test card
- ✅ Redirects to `/donation-success`
- ✅ Shows claim token
- ✅ Check Supabase - donation should have `donor_type = 'guest'`
- ✅ Check Supabase - `guest_donors` table should have entry

### 5. Donation Flow - Anonymous User

**Steps:**
1. Make sure you're logged out
2. Navigate to `/donate`
3. Select "Anonymous" tab
4. Select amount (e.g., $10)
5. Click "Donate $10"

**Expected Results:**
- ✅ Redirects to Stripe Checkout
- ✅ Complete payment
- ✅ Redirects to `/donation-success`
- ✅ Shows claim token (save this!)
- ✅ Check Supabase - donation should have `donor_type = 'anonymous'`
- ✅ No email sent (anonymous donations don't get receipts)

### 6. Claim Donation

**Steps:**
1. Log in with a test account
2. Navigate to `/claim-donation`
3. Enter the claim token from an anonymous/guest donation
4. If guest donation, enter the email used
5. Click "Claim Donation"

**Expected Results:**
- ✅ Success message
- ✅ Donation appears in `/dashboard/donations`
- ✅ Check Supabase - donation `user_id` should be updated
- ✅ Check Supabase - donation `is_claimed` should be `true`

### 7. Dashboard Features

**Test `/dashboard`:**
- ✅ Shows total donated amount
- ✅ Shows donation count
- ✅ Shows active recurring donations
- ✅ Recent donations list

**Test `/dashboard/donations`:**
- ✅ Lists all donations
- ✅ Filter by status
- ✅ Filter by type (one-time/recurring)
- ✅ Search functionality
- ✅ Download receipt (if available)

**Test `/dashboard/profile`:**
- ✅ View current profile info
- ✅ Update name
- ✅ Update phone
- ✅ Update address
- ✅ Save changes

## Stripe Test Cards

Use these test cards in Stripe Checkout:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

**Any future expiry date and any 3-digit CVC will work.**

## Debugging Tips

### Check Supabase Logs
1. Go to Supabase Dashboard > Logs > Edge Functions
2. Check for errors in function execution

### Check Stripe Logs
1. Go to Stripe Dashboard > Developers > Logs
2. Check webhook events and payment intents

### Check Browser Console
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Common Issues

**"Payment service is not configured"**
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding env vars

**"Failed to initiate payment"**
- Check Edge Function `create-payment-intent` is deployed
- Check Edge Function secrets are set (STRIPE_SECRET_KEY, etc.)
- Check Supabase logs for errors

**Donations not appearing**
- Check webhook is configured in Stripe
- Check webhook URL points to correct Edge Function
- Check RLS policies allow user to see their donations

**Profile not created on signup**
- Check `handle_new_user()` trigger exists in database
- Run the trigger creation SQL from `schema.sql`

## Next Steps After Testing

Once all tests pass:
1. ✅ Switch Stripe to live mode
2. ✅ Update environment variables with production keys
3. ✅ Test with real payment (small amount)
4. ✅ Verify email receipts are sending
5. ✅ Deploy to GitHub Pages
