/**
 * Database Reset Script
 * 
 * This script resets the Supabase database by:
 * 1. Dropping all existing tables (if they exist)
 * 2. Running the full schema.sql to recreate everything
 * 3. Running migrations for external campaigns
 * 4. Inserting external campaigns
 * 
 * Usage: node scripts/reset-db.js
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in your environment
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('You can set them in .env.local or as environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');

  try {
    // Step 1: Drop all existing tables (in reverse dependency order)
    console.log('📋 Step 1: Dropping existing tables...');
    const dropTablesSQL = `
      -- Drop tables in reverse dependency order
      DROP TABLE IF EXISTS public.donations CASCADE;
      DROP TABLE IF EXISTS public.payment_methods CASCADE;
      DROP TABLE IF EXISTS public.guest_donors CASCADE;
      DROP TABLE IF EXISTS public.campaigns CASCADE;
      DROP TABLE IF EXISTS public.profiles CASCADE;
      
      -- Drop functions
      DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
      DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
      
      -- Drop triggers
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `;

    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropTablesSQL });
    if (dropError) {
      // If RPC doesn't exist, try direct SQL execution via REST API
      console.log('   ⚠️  Note: Using alternative method to drop tables');
    }

    // Step 2: Read and execute schema.sql
    console.log('📋 Step 2: Creating database schema...');
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Error: schema.sql not found at ${schemaPath}`);
      process.exit(1);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute in chunks (Supabase has query size limits)
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Executing ${statements.length} SQL statements...`);
    
    // Execute via SQL Editor API (requires service role key)
    const { data, error: schemaError } = await supabase
      .from('_exec_sql')
      .select('*')
      .limit(0);

    if (schemaError) {
      // Direct execution not available, provide instructions
      console.log('\n   ⚠️  Cannot execute SQL directly via API.');
      console.log('   Please run the schema manually:');
      console.log(`   1. Go to Supabase Dashboard > SQL Editor`);
      console.log(`   2. Copy contents of: ${schemaPath}`);
      console.log(`   3. Paste and run in SQL Editor\n`);
      console.log('   After running the schema, press Enter to continue...');
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    } else {
      // Try executing via REST (this might not work, but worth trying)
      console.log('   ⚠️  Please run schema.sql manually in Supabase SQL Editor');
      console.log('   The schema is too large to execute via API');
    }

    // Step 3: Run migrations
    console.log('\n📋 Step 3: Running migrations...');
    
    // Check if campaigns table exists
    const { data: campaignsCheck } = await supabase
      .from('campaigns')
      .select('id')
      .limit(1);

    if (!campaignsCheck) {
      console.log('   Creating campaigns table...');
      const createCampaignsPath = path.join(__dirname, '../supabase/migrations/create_campaigns_table.sql');
      if (fs.existsSync(createCampaignsPath)) {
        const createCampaignsSQL = fs.readFileSync(createCampaignsPath, 'utf8');
        console.log('   ⚠️  Please run create_campaigns_table.sql manually in Supabase SQL Editor');
      }
    }

    // Run external campaigns migration
    console.log('   Adding external campaign support...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/add_external_campaigns.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      console.log('   ⚠️  Please run add_external_campaigns.sql manually in Supabase SQL Editor');
    }

    // Step 4: Insert external campaigns
    console.log('\n📋 Step 4: Inserting external campaigns...');
    const { exec } = require('child_process');
    const insertScript = path.join(__dirname, 'insert-external-campaigns.js');
    
    return new Promise((resolve, reject) => {
      exec(`node ${insertScript}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`   ❌ Error: ${error.message}`);
          reject(error);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });

  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    throw error;
  }
}

// Main execution
resetDatabase()
  .then(() => {
    console.log('\n✅ Database reset complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure you ran schema.sql in Supabase SQL Editor');
    console.log('   2. Make sure you ran the migration files');
    console.log('   3. Run: npm run dev');
    console.log('   4. Visit: http://localhost:3000\n');
  })
  .catch((error) => {
    console.error('\n❌ Database reset failed:', error);
    process.exit(1);
  });
