# Setup Guide - Ramadan Giving Donation System

This guide will walk you through setting up the complete donation system for your Ramadan Giving website.

## Prerequisites

- Node.js 20+ installed
- A Supabase account and project
- A Stripe account
- A GitHub account (for deployment)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to finish initializing (this may take a few minutes)
3. Get your API keys:
   - Go to **Settings** (gear icon in the left sidebar)
   - Click on **API** in the settings menu
   - You'll find:
     - **Project URL**: `https://xxxxx.supabase.co` (this is your `NEXT_PUBLIC_SUPABASE_URL`)
     - **anon/public key**: Starts with `eyJ...` (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - **service_role key**: Also starts with `eyJ...` (this is your `SUPABASE_SERVICE_ROLE_KEY`)
       - ⚠️ **Important**: The service_role key has admin privileges. Keep it secret and never expose it in client-side code!
       - Click "Reveal" to show the service_role key
       - Copy both keys and save them securely

   **Visual Guide:**
   ```
   Supabase Dashboard
   ├── Settings (⚙️ icon)
   │   └── API
   │       ├── Project URL: https://xxxxx.supabase.co
   │       ├── anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   │       └── service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Reveal]
   ```

### 1.2 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL script to create all tables, functions, and RLS policies

### 1.3 Set Up Edge Functions

1. Install Supabase CLI (choose one method):

   **Option A: Using Homebrew (macOS/Linux)**
   ```bash
   brew install supabase/tap/supabase
   ```

   **Option B: Using npm (as a local dev dependency)**
   ```bash
   npm install supabase --save-dev
   ```
   Then use with: `npx supabase` instead of `supabase`

   **Option C: Direct binary download**
   - Visit https://github.com/supabase/cli/releases
   - Download the appropriate binary for your OS
   - Add to your PATH

2. Login to Supabase:
   ```bash
   # If installed via Homebrew or binary:
   supabase login
   
   # If installed via npm:
   npx supabase login
   ```

3. Link your project:
   ```bash
   # If installed via Homebrew or binary:
   supabase link --project-ref your-project-ref
   
   # If installed via npm:
   npx supabase link --project-ref your-project-ref
   ```
   
   **To find your project-ref:**
   - Go to Supabase Dashboard > Settings > General
   - Look for "Reference ID" - this is your project-ref

4. Deploy Edge Functions:
   ```bash
   # If installed via Homebrew or binary:
   supabase functions deploy create-payment-intent
   supabase functions deploy stripe-webhook
   supabase functions deploy send-receipt
   supabase functions deploy claim-donation
   
   # If installed via npm:
   npx supabase functions deploy create-payment-intent
   npx supabase functions deploy stripe-webhook
   npx supabase functions deploy send-receipt
   npx supabase functions deploy claim-donation
   ```

5. Set environment variables for Edge Functions:
   ```bash
   # Get SUPABASE_SERVICE_ROLE_KEY from: Supabase Dashboard > Settings > API > service_role key
   
   # If installed via Homebrew or binary:
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # If installed via npm:
   npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 1.4 Configure Webhook URL

1. In Supabase Dashboard, go to Edge Functions
2. Copy the webhook URL for `stripe-webhook`
3. You'll need this for Stripe webhook configuration

## Step 2: Stripe Setup

### 2.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from Developers > API keys
3. Note down:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)

### 2.2 Configure Webhooks

1. Go to Developers > Webhooks in Stripe dashboard
2. Click "Add endpoint"
3. Enter your Supabase Edge Function webhook URL
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)

### 2.3 Enable Payment Methods

1. In Stripe Dashboard, go to Settings > Payment methods
2. Enable:
   - Credit/Debit cards
   - Google Pay
   - Apple Pay
   - PayPal (if available in your region)

## Step 3: Local Development Setup

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
# Get these from: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # service_role key (keep secret!)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REPO_NAME=ramadangiving.github.io
```

**Quick Reference - Where to Find Each Key:**

| Variable | Where to Find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role key (click "Reveal") |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard > Developers > API keys > Publishable key |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API keys > Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Developers > Webhooks > Signing secret |

### 3.3 Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

## Step 4: GitHub Pages Deployment

### 4.1 Configure GitHub Repository

1. Create a new repository on GitHub (or use existing)
2. Push your code to the repository

### 4.2 Set Up GitHub Secrets

1. Go to your repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://yourusername.github.io/repository-name`)
   - `NEXT_PUBLIC_REPO_NAME` (your repository name)

   **Note:** Do NOT add `SUPABASE_SERVICE_ROLE_KEY` or `STRIPE_SECRET_KEY` to GitHub Secrets - these are only used in Supabase Edge Functions, not in the Next.js build.

### 4.3 Enable GitHub Pages

1. Go to repository Settings > Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically deploy on push to main/master branch

### 4.4 Update Base Path (if needed)

If your repository name is not `ramadangiving.github.io`, update `next.config.ts`:

```typescript
basePath: isProduction ? `/${repositoryName}` : '',
```

## Step 5: Testing

### 5.1 Test Donation Flow

1. Use Stripe test mode cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any CVC

2. Test all three donation modes:
   - Anonymous (no info collected)
   - Guest (name + email)
   - Registered (full account)

### 5.2 Test Webhooks

1. Use Stripe CLI to forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

2. Trigger test events in Stripe Dashboard

## Step 6: Production Checklist

- [ ] Switch Stripe to live mode
- [ ] Update all environment variables with production keys
- [ ] Test donation flow end-to-end
- [ ] Verify email receipts are sending
- [ ] Test claim donation functionality
- [ ] Verify RLS policies are working
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain (if applicable)
- [ ] Update tax ID in receipt template
- [ ] Test all payment methods (Google Pay, Apple Pay, PayPal)

## Troubleshooting

### Edge Functions Not Working

- Verify environment variables are set:
  ```bash
  # Homebrew/binary:
  supabase secrets list
  # npm:
  npx supabase secrets list
  ```
- Check function logs:
  ```bash
  # Homebrew/binary:
  supabase functions logs function-name
  # npm:
  npx supabase functions logs function-name
  ```

### Webhooks Not Receiving Events

- Verify webhook URL is correct in Stripe
- Check webhook signing secret matches
- Review Edge Function logs for errors

### Donations Not Appearing

- Check RLS policies allow user access
- Verify donation records are being created
- Check webhook is processing events correctly

### Build Failures

- Ensure all environment variables are set in GitHub Secrets
- Check `next.config.ts` basePath matches repository name
- Verify static export is working: `npm run build`

## Support

For issues or questions:
- Check Supabase logs
- Review Stripe webhook events
- Check browser console for client-side errors
- Review GitHub Actions workflow logs
