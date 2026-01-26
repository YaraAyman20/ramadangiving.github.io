/**
 * Verify Database Setup
 * 
 * Checks if the database is properly set up by verifying:
 * - Connection to Supabase
 * - Required tables exist
 * - Campaigns are inserted
 * 
 * Usage: node scripts/verify-setup.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requiredTables = [
  'profiles',
  'donations',
  'payment_methods',
  'guest_donors',
  'campaigns'
];

async function verifySetup() {
  console.log('🔍 Verifying database setup...\n');
  
  let allGood = true;

  // Check connection
  console.log('📡 Checking Supabase connection...');
  try {
    const { data, error } = await supabase.from('campaigns').select('id').limit(1);
    if (error && error.code === '42P01') {
      console.log('   ❌ Connection failed: campaigns table does not exist');
      allGood = false;
    } else if (error) {
      console.log(`   ⚠️  Connection issue: ${error.message}`);
    } else {
      console.log('   ✅ Connected to Supabase');
    }
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    allGood = false;
  }

  // Check tables
  console.log('\n📋 Checking required tables...');
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`   ❌ Table '${table}' does not exist`);
          allGood = false;
        } else {
          console.log(`   ⚠️  Table '${table}' has issues: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Table '${table}' exists`);
      }
    } catch (error) {
      console.log(`   ❌ Error checking '${table}': ${error.message}`);
      allGood = false;
    }
  }

  // Check campaigns
  console.log('\n🎯 Checking campaigns...');
  try {
    const { data, error, count } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      allGood = false;
    } else {
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, title, campaign_type, platform');
      
      if (campaigns && campaigns.length > 0) {
        console.log(`   ✅ Found ${campaigns.length} campaign(s):`);
        campaigns.forEach(c => {
          const type = c.campaign_type === 'external' ? '🌐 External' : '🏠 Internal';
          const platform = c.platform ? ` (${c.platform})` : '';
          console.log(`      - ${c.title} ${type}${platform}`);
        });
      } else {
        console.log('   ⚠️  No campaigns found. Run: npm run insert:campaigns');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    allGood = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allGood) {
    console.log('✅ Database setup looks good!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Check: http://localhost:3000/programs\n');
  } else {
    console.log('❌ Database setup incomplete');
    console.log('\n📝 To fix:');
    console.log('   1. Run: npm run setup:db');
    console.log('   2. Follow the instructions to run SQL files in Supabase');
    console.log('   3. Run: npm run insert:campaigns');
    console.log('   4. Run this script again to verify\n');
  }
}

verifySetup().catch(console.error);
