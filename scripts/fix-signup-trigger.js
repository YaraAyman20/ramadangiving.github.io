#!/usr/bin/env node

/**
 * Script to fix the signup trigger that's causing "database error saving the user"
 * This removes the email column from the profile insert since profiles table doesn't have email
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

async function fixSignupTrigger() {
  console.log('🔧 Fixing signup trigger...\n');

  try {
    // Check if supabase CLI is available
    try {
      execSync('which supabase', { stdio: 'ignore' });
    } catch {
      console.error('❌ Supabase CLI not found. Please install it first:');
      console.error('   brew install supabase/tap/supabase');
      console.error('\nOr run the SQL manually in Supabase Dashboard > SQL Editor');
      process.exit(1);
    }

    // Check if project is linked
    try {
      execSync('supabase status', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  Project not linked locally. Using remote connection...');
      console.log('   Make sure you have SUPABASE_DB_PASSWORD set or use --db-url flag\n');
    }

    // Write SQL to temp file
    const tempFile = path.join(__dirname, '../.temp-fix-trigger.sql');
    fs.writeFileSync(tempFile, fixSQL);

    console.log('📝 Running SQL fix...');
    
    // Try to run via supabase CLI
    try {
      // Check if project is linked
      let projectLinked = false;
      try {
        const status = execSync('supabase status', { encoding: 'utf8', stdio: 'pipe' });
        projectLinked = true;
      } catch {
        projectLinked = false;
      }

      if (projectLinked) {
        // Use psql if linked locally
        console.log('📡 Executing SQL on local database...');
        execSync(`psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f "${tempFile}"`, { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        console.log('\n✅ Signup trigger fixed successfully!');
      } else {
        // For remote, we need to use the Supabase Management API or manual execution
        console.log('\n⚠️  Project not linked locally. Using remote connection...');
        console.log('\n📋 To fix automatically, you have two options:\n');
        console.log('Option 1: Link your project and run again');
        console.log('  supabase link --project-ref your-project-ref');
        console.log('  npm run fix:signup\n');
        console.log('Option 2: Run SQL manually in Supabase Dashboard');
        console.log('  1. Go to Supabase Dashboard > SQL Editor');
        console.log('  2. Copy and paste the SQL below');
        console.log('  3. Click "Run"\n');
        console.log('='.repeat(60));
        console.log(fixSQL);
        console.log('='.repeat(60));
      }
    } catch (error) {
      // If that fails, provide manual instructions
      console.log('\n⚠️  Could not execute automatically. Please run this SQL manually:');
      console.log('\n' + '='.repeat(60));
      console.log(fixSQL);
      console.log('='.repeat(60));
      console.log('\n📋 Steps:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Copy and paste the SQL above');
      console.log('3. Click "Run"');
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n📋 Manual fix required. Run this SQL in Supabase Dashboard > SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log(fixSQL);
    console.log('='.repeat(60));
    process.exit(1);
  }
}

// Run the fix
fixSignupTrigger();
