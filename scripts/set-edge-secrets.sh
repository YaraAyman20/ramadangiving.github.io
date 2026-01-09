#!/bin/bash

# Script to set Edge Function secrets from .env.local
# Make sure .env.local has the required keys

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

echo "🔐 Setting Edge Function secrets from .env.local..."
echo ""

# Source the .env.local file
set -a
source .env.local
set +a

# Set secrets if they exist
if [ -n "$STRIPE_SECRET_KEY" ]; then
    echo "Setting STRIPE_SECRET_KEY..."
    supabase secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
    echo "✅ STRIPE_SECRET_KEY set"
else
    echo "⚠️  STRIPE_SECRET_KEY not found in .env.local"
fi

if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "Setting STRIPE_WEBHOOK_SECRET..."
    supabase secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"
    echo "✅ STRIPE_WEBHOOK_SECRET set"
else
    echo "⚠️  STRIPE_WEBHOOK_SECRET not found in .env.local"
    echo "   Note: Set this after configuring Stripe webhook"
fi

if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
    echo "✅ SUPABASE_SERVICE_ROLE_KEY set"
else
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
    echo "   Get it from: Supabase Dashboard > Settings > API > service_role key"
fi

echo ""
echo "🎉 Done! Verify secrets with: supabase secrets list"
