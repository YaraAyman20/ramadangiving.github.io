# Deploy Edge Functions - Quick Guide

The 401 error means your Edge Functions aren't deployed yet. Follow these steps:

## Step 1: Login to Supabase CLI

```bash
supabase login
```

This will open your browser to authenticate.

## Step 2: Link Your Project

```bash
supabase link --project-ref wkpmshgelgpkimwyyzko
```

**To find your project-ref:**
- Go to Supabase Dashboard > Settings > General
- Look for "Reference ID" - that's your project-ref

## Step 3: Deploy Edge Functions

You can deploy all functions at once:

```bash
./scripts/deploy-edge-functions.sh
```

Or deploy individually:

```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy send-receipt
supabase functions deploy claim-donation
```

## Step 4: Set Environment Variables (Secrets)

After deploying, set the required secrets:

```bash
# Get these from your .env.local or Supabase/Stripe dashboards
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these:**
- `STRIPE_SECRET_KEY`: Stripe Dashboard > Developers > API keys > Secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe Dashboard > Developers > Webhooks > Signing secret (after creating webhook)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard > Settings > API > service_role key

## Step 5: Verify Deployment

1. Go to Supabase Dashboard > Edge Functions
2. You should see all 4 functions listed
3. Click on `create-payment-intent` to see its URL
4. The URL should be: `https://wkpmshgelgpkimwyyzko.supabase.co/functions/v1/create-payment-intent`

## Step 6: Test Again

After deployment, try the donation flow again. The 401 error should be gone.

## Troubleshooting

### Still getting 401?

1. **Check function is deployed:**
   ```bash
   supabase functions list
   ```

2. **Check secrets are set:**
   ```bash
   supabase secrets list
   ```

3. **Check function logs:**
   ```bash
   supabase functions logs create-payment-intent
   ```

4. **Verify function URL in browser:**
   - Go to: `https://wkpmshgelgpkimwyyzko.supabase.co/functions/v1/create-payment-intent`
   - Should return CORS error (not 401) - that means it's deployed

### Function not found?

Make sure you're in the project root directory and the `supabase/functions/` folder exists with the function files.

### Authentication issues?

The Edge Function should work without authentication for guest/anonymous donations. If you're logged in, it will use your session token automatically.
