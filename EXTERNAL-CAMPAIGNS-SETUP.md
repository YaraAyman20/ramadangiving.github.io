# External Campaigns Setup Guide

This guide explains how to set up external campaigns (GoFundMe, LaunchGood) on the website.

## Overview

The website now supports embedding external campaigns from GoFundMe and LaunchGood. Each external campaign gets its own page where users can view and donate directly through the embedded campaign.

## Setup Steps

### 1. Create Campaigns Table (If Not Exists)

**IMPORTANT**: If you get an error that the `campaigns` table doesn't exist, run this first:

```sql
-- Run this in your Supabase SQL Editor
-- File: supabase/migrations/create_campaigns_table.sql
```

Or copy the SQL from `supabase/schema.sql` (the campaigns table section).

### 2. Run Database Migration

Add the necessary columns to the `campaigns` table for external campaign support:

```sql
-- Run this in your Supabase SQL Editor
-- File: supabase/migrations/add_external_campaigns.sql
```

**Note**: The migration will check if the table exists first. If you see an error about the table not existing, go back to step 1.

### 3. Insert External Campaigns

Run the script to insert the external campaigns:

```bash
# Make sure you have your Supabase credentials set
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Or use .env.local file
node scripts/insert-external-campaigns.js
```

The script will:
- Insert 5 external campaigns (2 GoFundMe, 3 LaunchGood)
- Update existing campaigns if they already exist
- Set proper campaign types and platforms

### 4. Campaigns Included

1. **Spread Warmth in Waterloo this Winter** (GoFundMe)
   - ID: `spread-warmth-waterloo`
   - Category: Emergency

2. **Provide Food Packs for Shelters & Families in GTA** (GoFundMe)
   - ID: `food-packs-gta`
   - Category: Food

3. **Food packages for families in need in Egypt - Ramadan 2026** (LaunchGood)
   - ID: `food-packages-egypt-ramadan-2026`
   - Category: Food

4. **Provide Psychosocial Support for Vulnerable Children in GTA and Egypt** (LaunchGood)
   - ID: `psychosocial-support-children`
   - Category: Education

5. **Ramadan Giving: Building Bridges of Hope** (LaunchGood)
   - ID: `building-bridges-of-hope`
   - Category: Emergency

## How It Works

### External Campaign Pages

When a user clicks on an external campaign from the Programs page:

1. They're taken to `/campaign/{campaign-id}`
2. The page detects it's an external campaign
3. An iframe attempts to embed the campaign
4. A prominent "Donate" button is shown that opens the campaign in a new tab

### Programs Page

External campaigns appear on the Programs page with:
- A badge indicating the platform (GoFundMe/LaunchGood)
- A "View Campaign" button instead of "Donate"
- Progress bars (if goal/raised amounts are set)

## Adding New External Campaigns

To add a new external campaign, insert it into the database:

```sql
INSERT INTO public.campaigns (
  id,
  title,
  description,
  category,
  goal_amount,
  raised_amount,
  is_zakat_eligible,
  external_url,
  campaign_type,
  platform
) VALUES (
  'your-campaign-id',
  'Campaign Title',
  'Campaign description',
  'Food', -- or Emergency, Education, etc.
  0, -- goal amount (0 if unknown)
  0, -- raised amount (0 if unknown)
  true, -- zakat eligible
  'https://www.gofundme.com/f/your-campaign',
  'external',
  'gofundme' -- or 'launchgood'
);
```

## Notes

- **Iframe Limitations**: Some platforms may block iframe embedding due to X-Frame-Options headers. The page includes a fallback button to open the campaign in a new tab.
- **GoFundMe Widgets**: GoFundMe supports widget embedding via `/widget/large` URLs.
- **LaunchGood**: LaunchGood campaigns are embedded via full-page iframes.
- **Updates**: To update campaign amounts, edit the `goal_amount` and `raised_amount` fields in the database.

## Troubleshooting

### Iframe Not Loading

If the iframe doesn't load:
1. Check browser console for X-Frame-Options errors
2. The "Donate" button will always work as a fallback
3. Some platforms require direct navigation

### Campaign Not Appearing

1. Check that `campaign_type = 'external'`
2. Verify `external_url` is set correctly
3. Ensure `platform` is either 'gofundme' or 'launchgood'

### TypeScript Errors

If you see TypeScript errors:
1. Regenerate Supabase types: `npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts`
2. Or manually update the types file (already done in this setup)
