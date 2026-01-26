-- Migration: Add support for external campaigns (GoFundMe, LaunchGood, etc.)
-- Run this in your Supabase SQL Editor
-- NOTE: Make sure the campaigns table exists first (run create_campaigns_table.sql if needed)

-- Add new columns to campaigns table (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'campaigns') THEN
    -- Add new columns
    ALTER TABLE public.campaigns 
    ADD COLUMN IF NOT EXISTS external_url TEXT,
    ADD COLUMN IF NOT EXISTS campaign_type TEXT DEFAULT 'internal' CHECK (campaign_type IN ('internal', 'external')),
    ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('gofundme', 'launchgood', 'internal'));

    -- Create indexes for external campaigns
    CREATE INDEX IF NOT EXISTS idx_campaigns_type ON public.campaigns(campaign_type);
    CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);

    -- Update existing campaigns to be internal
    UPDATE public.campaigns 
    SET campaign_type = 'internal', platform = 'internal' 
    WHERE campaign_type IS NULL;
  ELSE
    RAISE NOTICE 'Campaigns table does not exist. Please run create_campaigns_table.sql first.';
  END IF;
END $$;
