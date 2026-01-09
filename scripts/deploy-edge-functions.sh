#!/bin/bash

# Script to deploy all Supabase Edge Functions
# Make sure you're logged in: supabase login
# Make sure project is linked: supabase link --project-ref your-project-ref

echo "🚀 Deploying Supabase Edge Functions..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in. Running: supabase login"
    supabase login
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Project not linked. Please run:"
    echo "   supabase link --project-ref your-project-ref"
    echo ""
    echo "To find your project-ref:"
    echo "   Supabase Dashboard > Settings > General > Reference ID"
    exit 1
fi

echo "📦 Deploying Edge Functions..."
echo ""

# Deploy each function
functions=("create-payment-intent" "stripe-webhook" "send-receipt" "claim-donation")

for func in "${functions[@]}"; do
    echo "Deploying $func..."
    if supabase functions deploy "$func"; then
        echo "✅ $func deployed successfully"
    else
        echo "❌ Failed to deploy $func"
        exit 1
    fi
    echo ""
done

echo "🎉 All Edge Functions deployed!"
echo ""
echo "📋 Next steps:"
echo "1. Set Edge Function secrets:"
echo "   supabase secrets set STRIPE_SECRET_KEY=sk_test_..."
echo "   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_..."
echo "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
echo ""
echo "2. Get your function URLs from Supabase Dashboard > Edge Functions"
echo "3. Configure Stripe webhook to point to your stripe-webhook function URL"
