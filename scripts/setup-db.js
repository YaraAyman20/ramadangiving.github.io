/**
 * Database Setup Script
 * 
 * This script sets up the Supabase database by executing SQL files.
 * It's a simpler alternative that provides SQL you can copy-paste.
 * 
 * Usage: node scripts/setup-db.js
 */

const fs = require('fs');
const path = require('path');

console.log('📋 Database Setup Instructions\n');
console.log('=' .repeat(60));
console.log('\nFollow these steps to set up your database:\n');

// Step 1: Schema
console.log('📋 STEP 1: Create Database Schema');
console.log('─'.repeat(60));
const schemaPath = path.join(__dirname, '../supabase/schema.sql');
if (fs.existsSync(schemaPath)) {
  console.log(`\n1. Go to Supabase Dashboard > SQL Editor`);
  console.log(`2. Copy the contents of: ${schemaPath}`);
  console.log(`3. Paste and run in SQL Editor\n`);
} else {
  console.log(`❌ schema.sql not found at ${schemaPath}\n`);
}

// Step 2: Create campaigns table
console.log('📋 STEP 2: Create Campaigns Table');
console.log('─'.repeat(60));
const createCampaignsPath = path.join(__dirname, '../supabase/migrations/create_campaigns_table.sql');
if (fs.existsSync(createCampaignsPath)) {
  console.log(`\n1. Go to Supabase Dashboard > SQL Editor`);
  console.log(`2. Copy the contents of: ${createCampaignsPath}`);
  console.log(`3. Paste and run in SQL Editor\n`);
} else {
  console.log(`⚠️  create_campaigns_table.sql not found\n`);
}

// Step 3: Add external campaigns support
console.log('📋 STEP 3: Add External Campaigns Support');
console.log('─'.repeat(60));
const migrationPath = path.join(__dirname, '../supabase/migrations/add_external_campaigns.sql');
if (fs.existsSync(migrationPath)) {
  console.log(`\n1. Go to Supabase Dashboard > SQL Editor`);
  console.log(`2. Copy the contents of: ${migrationPath}`);
  console.log(`3. Paste and run in SQL Editor\n`);
} else {
  console.log(`⚠️  add_external_campaigns.sql not found\n`);
}

// Step 4: Insert campaigns
console.log('📋 STEP 4: Insert External Campaigns');
console.log('─'.repeat(60));
console.log(`\nRun this command (make sure .env.local has your Supabase credentials):`);
console.log(`  node scripts/insert-external-campaigns.js\n`);

console.log('='.repeat(60));
console.log('\n✅ After completing all steps, run: npm run dev\n');
