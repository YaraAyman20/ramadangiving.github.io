-- Migration: Create campaigns table
-- Run this in your Supabase SQL Editor if the campaigns table doesn't exist

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  goal_amount DECIMAL(10, 2) DEFAULT 0,
  raised_amount DECIMAL(10, 2) DEFAULT 0,
  is_zakat_eligible BOOLEAN DEFAULT FALSE,
  external_url TEXT,
  campaign_type TEXT DEFAULT 'internal' CHECK (campaign_type IN ('internal', 'external')),
  platform TEXT CHECK (platform IN ('gofundme', 'launchgood', 'internal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON public.campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON public.campaigns(category);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_campaigns
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Campaigns policies (public read, service role write)
CREATE POLICY "Anyone can view campaigns"
  ON public.campaigns FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage campaigns"
  ON public.campaigns FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON public.campaigns TO anon, authenticated;
