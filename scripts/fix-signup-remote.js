#!/usr/bin/env node

/**
 * Alternative script to fix signup trigger using Supabase Management API
 * Requires SUPABASE_ACCESS_TOKEN environment variable
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const fixSQL = `
-- Fix for signup error: Remove email from profile insert
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
`;

async function fixSignupTriggerRemote() {
  console.log('🔧 Fixing signup trigger via Supabase API...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
    process.exit(1);
  }

  if (!accessToken) {
    console.log('⚠️  SUPABASE_ACCESS_TOKEN not found.');
    console.log('   Get it from: Supabase Dashboard > Settings > Access Tokens\n');
    console.log('📋 Manual fix required. Run this SQL in Supabase Dashboard > SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log(fixSQL);
    console.log('='.repeat(60));
    process.exit(0);
  }

  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    console.error('❌ Could not extract project ref from Supabase URL');
    process.exit(1);
  }

  const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  
  const postData = JSON.stringify({
    query: fixSQL
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(apiUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Signup trigger fixed successfully!');
          resolve();
        } else {
          console.error(`❌ API Error: ${res.statusCode}`);
          console.error(data);
          console.log('\n📋 Fallback: Run SQL manually in Supabase Dashboard > SQL Editor');
          reject(new Error(`API returned ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      console.log('\n📋 Fallback: Run SQL manually in Supabase Dashboard > SQL Editor');
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

fixSignupTriggerRemote().catch(() => {
  console.log('\n' + '='.repeat(60));
  console.log(fixSQL);
  console.log('='.repeat(60));
  process.exit(1);
});
