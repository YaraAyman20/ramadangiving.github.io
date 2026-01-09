// Supabase Edge Function: Claim Donation
// Allows users to claim anonymous or guest donations by transaction ID or claim token

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { transaction_id, claim_token, email } = await req.json();

    if (!transaction_id && !claim_token) {
      return new Response(
        JSON.stringify({ error: "transaction_id or claim_token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Find donation
    let donation;
    if (claim_token) {
      const { data, error } = await supabaseClient
        .from("donations")
        .select("*")
        .eq("claim_token", claim_token)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Donation not found with this claim token" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      donation = data;
    } else if (transaction_id) {
      const { data, error } = await supabaseClient
        .from("donations")
        .select("*")
        .eq("id", transaction_id)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Donation not found with this transaction ID" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      donation = data;
    }

    // Verify donation can be claimed
    if (donation.donor_type === "registered") {
      return new Response(
        JSON.stringify({ error: "This donation is already linked to an account" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (donation.is_claimed) {
      return new Response(
        JSON.stringify({ error: "This donation has already been claimed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For guest donations, verify email matches
    if (donation.donor_type === "guest" && donation.guest_info) {
      const guestEmail = donation.guest_info.email;
      if (email && email.toLowerCase() !== guestEmail?.toLowerCase()) {
        return new Response(
          JSON.stringify({ error: "Email does not match donation record" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Claim the donation
    const { error: updateError } = await supabaseClient
      .from("donations")
      .update({
        user_id: user.id,
        donor_type: "registered",
        is_claimed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to claim donation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If guest donation, update guest_donors table
    if (donation.donor_type === "guest") {
      const { data: guestDonor } = await supabaseClient
        .from("guest_donors")
        .select("id")
        .eq("email", donation.guest_info?.email)
        .single();

      if (guestDonor) {
        await supabaseClient
          .from("guest_donors")
          .update({
            account_created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", guestDonor.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        donation: {
          id: donation.id,
          amount: donation.amount,
          date: donation.created_at,
          campaign: donation.campaign_title,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error claiming donation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
