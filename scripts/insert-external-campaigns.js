/**
 * Script to insert external campaigns (GoFundMe, LaunchGood) into the database
 * Run with: node scripts/insert-external-campaigns.js
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in your environment
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const externalCampaigns = [
  {
    id: 'spread-warmth-waterloo',
    title: 'Spread Warmth in Waterloo this Winter',
    description: 'Over the past few years, we at Ramadan Giving have made and distributed hundreds of winterkits and meals to the unhoused, shelters, and those in need to support them through the cold winter months. This year we are hoping to do this again in Waterloo! It only takes $10 to provide 1 winterkit or $5 to provide 1 hot meal.',
    category: 'Emergency',
    image_url: null,
    goal_amount: 3500,
    raised_amount: 3637,
    is_zakat_eligible: true,
    external_url: 'https://www.gofundme.com/f/spread-warmth-in-waterloo-this-winter',
    campaign_type: 'external',
    platform: 'gofundme',
  },
  {
    id: 'food-packs-gta',
    title: 'Provide Food Packs for Shelters & Families in GTA',
    description: 'Help provide lunch bags and food packs to those in need in the GTA (Greater Toronto Area)! We also will provide toys to children in need. We will be distributing lunch bags to individuals experiencing homelessness and shelters. It only costs $2 CAD to provide one lunch bag. We will also be packing and delivering non-perishable food packages to vulnerable families. One grocery bag is $25 CAD.',
    category: 'Food',
    image_url: null,
    goal_amount: 2800,
    raised_amount: 500,
    is_zakat_eligible: true,
    external_url: 'https://www.gofundme.com/f/gbwcyu-provide-food-packs-for-shelters-families-in-gta',
    campaign_type: 'external',
    platform: 'gofundme',
  },
  {
    id: 'food-packages-egypt-ramadan-2026',
    title: 'Food packages for families in need in Egypt - Ramadan 2026',
    description: 'Help provide food packages for families in need in Egypt during Ramadan 2026.',
    category: 'Food',
    image_url: null,
    goal_amount: 0,
    raised_amount: 0,
    is_zakat_eligible: true,
    external_url: 'https://www.launchgood.com/v4/campaign/food_packages_for_families_in_need_in_egypt__ramadan_2026',
    campaign_type: 'external',
    platform: 'launchgood',
  },
  {
    id: 'psychosocial-support-children',
    title: 'Provide Psychosocial Support for Vulnerable Children in GTA and Egypt',
    description: 'Support vulnerable children in the GTA and Egypt with psychosocial support services.',
    category: 'Education',
    image_url: null,
    goal_amount: 0,
    raised_amount: 0,
    is_zakat_eligible: true,
    external_url: 'https://www.launchgood.com/v4/campaign/provide_psychosocial_support_for_vulnerable_children_in_gta_and_egypt_3',
    campaign_type: 'external',
    platform: 'launchgood',
  },
  {
    id: 'building-bridges-of-hope',
    title: 'Ramadan Giving: Building Bridges of Hope',
    description: 'Building bridges of hope through our comprehensive programs and initiatives.',
    category: 'Emergency',
    image_url: null,
    goal_amount: 0,
    raised_amount: 0,
    is_zakat_eligible: true,
    external_url: 'https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope',
    campaign_type: 'external',
    platform: 'launchgood',
  },
];

async function insertCampaigns() {
  console.log('Inserting external campaigns...\n');

  for (const campaign of externalCampaigns) {
    try {
      // Check if campaign already exists
      const { data: existing } = await supabase
        .from('campaigns')
        .select('id')
        .eq('id', campaign.id)
        .single();

      if (existing) {
        // Update existing campaign
        const { data, error } = await supabase
          .from('campaigns')
          .update(campaign)
          .eq('id', campaign.id)
          .select();

        if (error) {
          console.error(`Error updating campaign ${campaign.id}:`, error.message);
        } else {
          console.log(`✓ Updated: ${campaign.title}`);
        }
      } else {
        // Insert new campaign
        const { data, error } = await supabase
          .from('campaigns')
          .insert(campaign)
          .select();

        if (error) {
          console.error(`Error inserting campaign ${campaign.id}:`, error.message);
        } else {
          console.log(`✓ Inserted: ${campaign.title}`);
        }
      }
    } catch (error) {
      console.error(`Error processing campaign ${campaign.id}:`, error.message);
    }
  }

  console.log('\nDone!');
}

insertCampaigns().catch(console.error);
