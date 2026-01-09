#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and Edge Functions
 * 
 * ⚠️ DEVELOPMENT ONLY - This script is for local development and testing.
 * Do not use in production environments.
 * 
 * Run with: node scripts/test-supabase.js
 */

// Simple .env.local parser
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

console.log('🧪 Testing Supabase Configuration...\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking environment variables...');
if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}
if (!SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  process.exit(1);
}
console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
if (STRIPE_PUBLISHABLE_KEY) {
  console.log('✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...');
} else {
  console.log('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}
console.log('');

// Test 2: Test Supabase client connection
console.log('2️⃣ Testing Supabase client connection...');
async function testSupabaseConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test basic connection
    const { data, error } = await supabase.from('donations').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      if (error.code === 'PGRST116') {
        console.error('   → This might mean the donations table does not exist. Run the schema.sql file in Supabase.');
      }
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error.message);
    return false;
  }
}

// Test 3: Test Edge Function accessibility
console.log('3️⃣ Testing Edge Function accessibility...');
async function testEdgeFunction() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test if we can invoke the edge function
    const testPayload = {
      amount: 10,
      currency: 'USD',
      isRecurring: false,
      donorType: 'anonymous',
    };
    
    console.log('   Attempting to invoke create-payment-intent...');
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: testPayload,
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    if (error) {
      console.error('❌ Edge Function invocation failed:', error.message);
      if (error.message.includes('Function not found')) {
        console.error('   → The Edge Function may not be deployed. Deploy it with:');
        console.error('     supabase functions deploy create-payment-intent');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('   → Network error. Check if the Edge Function URL is correct.');
      }
      return false;
    }
    
    if (data?.error) {
      console.error('❌ Edge Function returned error:', data.error);
      // This might be expected if Stripe keys aren't set, but at least the function is accessible
      if (data.error.includes('Stripe') || data.error.includes('STRIPE')) {
        console.log('   ⚠️  Edge Function is accessible but Stripe configuration may be missing');
        return true; // Function is accessible, just needs Stripe config
      }
      return false;
    }
    
    if (data?.url) {
      console.log('✅ Edge Function is working! Payment URL:', data.url.substring(0, 50) + '...');
      return true;
    }
    
    console.log('⚠️  Edge Function responded but no URL in response');
    return false;
  } catch (error) {
    console.error('❌ Error testing Edge Function:', error.message);
    return false;
  }
}

// Test 4: Check database tables
console.log('4️⃣ Checking database tables...');
async function testDatabaseTables() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const tables = ['donations', 'profiles', 'guest_donors'];
    const results = {};
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST116') {
          results[table] = { exists: false, error: 'Table does not exist' };
        } else {
          results[table] = { exists: true, error: error.message };
        }
      } else {
        results[table] = { exists: true, error: null };
      }
    }
    
    let allExist = true;
    for (const [table, result] of Object.entries(results)) {
      if (result.exists && !result.error) {
        console.log(`   ✅ ${table} table exists and is accessible`);
      } else if (!result.exists) {
        console.log(`   ❌ ${table} table does not exist`);
        allExist = false;
      } else {
        console.log(`   ⚠️  ${table} table exists but has access issues: ${result.error}`);
      }
    }
    
    return allExist;
  } catch (error) {
    console.error('❌ Error checking database tables:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.log('\n❌ Basic connection test failed. Please check your Supabase configuration.');
    process.exit(1);
  }
  
  const tablesTest = await testDatabaseTables();
  if (!tablesTest) {
    console.log('\n⚠️  Some tables are missing. Please run the schema.sql file in Supabase.');
  }
  
  const edgeFunctionTest = await testEdgeFunction();
  if (!edgeFunctionTest) {
    console.log('\n⚠️  Edge Function test failed. Please check:');
    console.log('   1. Edge Functions are deployed: supabase functions deploy create-payment-intent');
    console.log('   2. Edge Function secrets are set: supabase secrets list');
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`   Connection: ${connectionTest ? '✅' : '❌'}`);
  console.log(`   Database Tables: ${tablesTest ? '✅' : '⚠️'}`);
  console.log(`   Edge Function: ${edgeFunctionTest ? '✅' : '⚠️'}`);
  
  if (connectionTest && edgeFunctionTest) {
    console.log('\n🎉 Supabase is configured correctly!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

runTests().catch(console.error);
