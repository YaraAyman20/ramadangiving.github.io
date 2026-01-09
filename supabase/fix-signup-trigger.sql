-- Fix for signup error: Remove email from profile insert
-- Run this in Supabase SQL Editor if you're getting "database error saving the user"

-- Drop and recreate the trigger function without email
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

-- Verify the trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
