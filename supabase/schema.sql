-- Database Schema for Ramadan Giving Donation System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  profile_image_url TEXT,
  communication_preferences JSONB DEFAULT '{"email": true, "sms": false}'::jsonb,
  privacy_settings JSONB DEFAULT '{"donations_public": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_type TEXT NOT NULL CHECK (donor_type IN ('anonymous', 'guest', 'registered')),
  guest_info JSONB DEFAULT NULL, -- {name, email} for guest donations
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'canceled')),
  payment_method TEXT, -- 'card', 'google_pay', 'apple_pay', 'paypal'
  is_recurring BOOLEAN DEFAULT FALSE,
  subscription_id TEXT, -- Stripe subscription ID for recurring donations
  frequency TEXT, -- 'one-time', 'weekly', 'monthly', 'yearly'
  campaign_id TEXT,
  campaign_title TEXT,
  dedication JSONB DEFAULT NULL, -- {in_honor_of, message}
  receipt_url TEXT,
  receipt_sent_at TIMESTAMP WITH TIME ZONE,
  is_claimed BOOLEAN DEFAULT FALSE,
  claim_token TEXT UNIQUE, -- For claiming anonymous/guest donations
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payment Methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'paypal')),
  last_four TEXT,
  brand TEXT, -- 'visa', 'mastercard', 'amex', etc.
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Guest donors table (for potential account conversion)
CREATE TABLE IF NOT EXISTS public.guest_donors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  donation_ids UUID[] DEFAULT '{}',
  invite_sent_at TIMESTAMP WITH TIME ZONE,
  account_created_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_payment_intent_id ON public.donations(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_donations_claim_token ON public.donations(claim_token);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_donors_email ON public.guest_donors(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_donations
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_payment_methods
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_guest_donors
  BEFORE UPDATE ON public.guest_donors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_donors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Donations policies
CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (
    auth.uid() = user_id OR
    (donor_type = 'anonymous' AND claim_token IS NOT NULL) OR
    (donor_type = 'guest' AND claim_token IS NOT NULL)
  );

-- Allow service role to insert/update donations (for webhooks)
CREATE POLICY "Service role can manage donations"
  ON public.donations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow anonymous donations to be created (no auth required)
CREATE POLICY "Anyone can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (true);

-- Payment methods policies
CREATE POLICY "Users can view their own payment methods"
  ON public.payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment methods"
  ON public.payment_methods FOR ALL
  USING (auth.uid() = user_id);

-- Guest donors policies (service role only for privacy)
CREATE POLICY "Service role can manage guest donors"
  ON public.guest_donors FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.donations TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
