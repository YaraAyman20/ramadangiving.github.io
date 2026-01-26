# Quick Start Guide

Get your Ramadan Giving website up and running quickly!

## Prerequisites

- Node.js 20+ installed
- A Supabase account and project
- A Stripe account (for donations)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase (get from: Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (get from: Stripe Dashboard > Developers > API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REPO_NAME=ramadangiving.github.io
```

## Step 3: Set Up Database

### Option A: Automated Setup (Recommended)

Run the setup script to get instructions:

```bash
node scripts/setup-db.js
```

This will show you exactly which SQL files to run in Supabase.

### Option B: Manual Setup

1. **Create Database Schema**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste contents of `supabase/schema.sql`
   - Click "Run"

2. **Create Campaigns Table** (if not in schema.sql)
   - Copy and paste contents of `supabase/migrations/create_campaigns_table.sql`
   - Click "Run"

3. **Add External Campaigns Support**
   - Copy and paste contents of `supabase/migrations/add_external_campaigns.sql`
   - Click "Run"

4. **Insert External Campaigns**
   ```bash
   node scripts/insert-external-campaigns.js
   ```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## Step 5: Verify Everything Works

1. **Check Homepage**: Visit `http://localhost:3000`
2. **Check Programs Page**: Visit `http://localhost:3000/programs`
   - You should see external campaigns listed
3. **Check Campaign Detail**: Click on any campaign
   - External campaigns should show embedded iframe
   - Internal campaigns should show donation form

## Resetting the Database

If you need to reset your database:

### Option 1: Manual Reset

1. Go to Supabase Dashboard > SQL Editor
2. Run this to drop all tables:
   ```sql
   DROP TABLE IF EXISTS public.donations CASCADE;
   DROP TABLE IF EXISTS public.payment_methods CASCADE;
   DROP TABLE IF EXISTS public.guest_donors CASCADE;
   DROP TABLE IF EXISTS public.campaigns CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```
3. Follow Step 3 above to recreate everything

### Option 2: Using Script

```bash
node scripts/reset-db.js
```

**Note**: The script will guide you through manual SQL execution since Supabase API has limitations.

## Troubleshooting

### Database Connection Issues

- Verify your `.env.local` has correct Supabase credentials
- Check Supabase Dashboard > Settings > API for correct URLs and keys

### "Table does not exist" Errors

- Make sure you ran `schema.sql` in Supabase SQL Editor
- Check that migrations were run successfully
- Verify RLS policies are set up correctly

### Build Errors

- Make sure all environment variables are set
- Try deleting `.next` folder and rebuilding: `rm -rf .next && npm run build`

### Font Loading Issues (Google Fonts)

If you see font loading errors during build, this is usually a network issue. The build will still work, but fonts may not load. This doesn't affect functionality.

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed configuration
- Read [EXTERNAL-CAMPAIGNS-SETUP.md](./EXTERNAL-CAMPAIGNS-SETUP.md) for campaign setup
- Check [TESTING.md](./TESTING.md) for testing guidelines

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
node scripts/setup-db.js              # Show setup instructions
node scripts/insert-external-campaigns.js  # Insert campaigns
node scripts/reset-db.js               # Reset database (guided)

# Content
npm run posts           # Generate blog posts
npm run new-post        # Create new blog post
```

## Need Help?

- Check the [SETUP.md](./SETUP.md) for detailed instructions
- Review Supabase logs in Dashboard > Logs
- Check browser console for client-side errors
