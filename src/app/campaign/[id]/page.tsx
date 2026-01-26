import CampaignDetailClient from "./CampaignDetailClient";
import { createClient } from '@supabase/supabase-js';

// For static export, we need to generate params for all campaigns
export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not available at build time, return placeholder
  // This ensures the route is generated even if we can't fetch campaigns
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not available at build time. Using placeholder campaign.');
    return [{ id: 'placeholder' }];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all campaign IDs
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id');

    if (error) {
      console.error('Error fetching campaigns for static generation:', error.message);
      return [];
    }

    if (!campaigns || campaigns.length === 0) {
      console.warn('⚠️  No campaigns found. Run: npm run insert:campaigns');
      return [];
    }

    // Return array of params for each campaign
    const params = campaigns.map((campaign) => ({
      id: campaign.id,
    }));

    console.log(`✅ Generated static params for ${params.length} campaign(s)`);
    return params;
  } catch (error) {
    console.error('Error generating static params for campaigns:', error);
    return [];
  }
}

// Required for static export
export const dynamic = 'force-static';

export default function CampaignDetailPage() {
  return <CampaignDetailClient />;
}
