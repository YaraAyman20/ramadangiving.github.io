// Supabase Edge Function: Create Stripe Payment Intent
// Handles both one-time and recurring donations
// Supports Anonymous, Guest, and Registered user flows

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface DonationRequest {
  amount: number;
  currency?: string;
  isRecurring?: boolean;
  frequency?: "weekly" | "monthly" | "yearly";
  donorType: "anonymous" | "guest" | "registered";
  guestInfo?: {
    name?: string;
    email?: string;
  };
  userId?: string;
  campaignId?: string;
  campaignTitle?: string;
  dedication?: {
    in_honor_of?: string;
    message?: string;
  };
  isAnonymous?: boolean; // Legacy support
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // SUPABASE_URL is automatically provided by Supabase Edge Functions
    // If not available, construct from request URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || 
      (req.headers.get("x-supabase-url") || 
       new URL(req.url).origin.replace(/\/functions\/v1.*$/, ""));
    
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const supabaseClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get auth token if provided (optional - for registered users)
    const authHeader = req.headers.get("Authorization");
    let user = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const { data: { user: authUser } } = await supabaseClient.auth.getUser(token);
        user = authUser;
      } catch (e) {
        // Invalid token, but continue as anonymous/guest
        console.log("Invalid auth token, proceeding as anonymous");
      }
    }

    const body: DonationRequest = await req.json();
    const {
      amount,
      currency = "USD",
      isRecurring = false,
      frequency = "monthly",
      donorType,
      guestInfo,
      userId,
      campaignId,
      campaignTitle,
      dedication,
      isAnonymous, // Legacy support
    } = body;

    // Determine actual donor type
    const actualDonorType = donorType || (isAnonymous ? "anonymous" : user ? "registered" : "guest");

    // Validate amount
    if (!amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid donation amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate donor type requirements
    if (actualDonorType === "guest" && (!guestInfo?.email || !guestInfo?.name)) {
      return new Response(
        JSON.stringify({ error: "Guest donations require name and email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate claim token for anonymous/guest donations
    const claimToken = actualDonorType !== "registered"
      ? crypto.randomUUID()
      : null;

    // Create or retrieve Stripe customer
    let customerId: string | null = null;
    if (user && actualDonorType === "registered") {
      // Check if customer exists
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Try to find existing Stripe customer
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          // Create new Stripe customer
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              supabase_user_id: user.id,
            },
          });
          customerId = customer.id;
        }
      }
    } else if (actualDonorType === "guest" && guestInfo?.email) {
      // Create or retrieve guest customer
      const customers = await stripe.customers.list({
        email: guestInfo.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: guestInfo.email,
          name: guestInfo.name,
          metadata: {
            donor_type: "guest",
          },
        });
        customerId = customer.id;
      }
    }

    let paymentIntent: Stripe.PaymentIntent | Stripe.Checkout.Session;
    let subscriptionId: string | null = null;

    // Get app URL with fallback
    const appUrl = Deno.env.get("NEXT_PUBLIC_APP_URL") || "http://localhost:3000";
    
    if (isRecurring) {
      // Create recurring donation (subscription)
      const priceId = Deno.env.get(`STRIPE_PRICE_ID_${frequency.toUpperCase()}`) || "";
      
      if (!priceId) {
        // Create price on the fly (for flexibility)
        const price = await stripe.prices.create({
          unit_amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          recurring: {
            interval: frequency === "weekly" ? "week" : frequency === "yearly" ? "year" : "month",
          },
          product_data: {
            name: `Monthly Donation - ${campaignTitle || "General Fund"}`,
          },
        });

        const session = await stripe.checkout.sessions.create({
          customer: customerId || undefined,
          payment_method_types: ["card"],
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${appUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}&type=recurring`,
          cancel_url: `${appUrl}/donate?canceled=true`,
          metadata: {
            donor_type: actualDonorType,
            user_id: user?.id || "",
            campaign_id: campaignId || "",
            campaign_title: campaignTitle || "",
            claim_token: claimToken || "",
            guest_name: guestInfo?.name || "",
            guest_email: guestInfo?.email || "",
          },
          allow_promotion_codes: true,
        });

        paymentIntent = session;
      } else {
        const session = await stripe.checkout.sessions.create({
          customer: customerId || undefined,
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${appUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}&type=recurring`,
          cancel_url: `${appUrl}/donate?canceled=true`,
          metadata: {
            donor_type: actualDonorType,
            user_id: user?.id || "",
            campaign_id: campaignId || "",
            campaign_title: campaignTitle || "",
            claim_token: claimToken || "",
            guest_name: guestInfo?.name || "",
            guest_email: guestInfo?.email || "",
          },
        });

        paymentIntent = session;
      }
    } else {
      // Create one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Donation - ${campaignTitle || "General Fund"}`,
                description: dedication?.message || undefined,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}&claim_token=${claimToken || ""}`,
        cancel_url: `${appUrl}/donate?canceled=true`,
        metadata: {
          donor_type: actualDonorType,
          user_id: user?.id || "",
          campaign_id: campaignId || "",
          campaign_title: campaignTitle || "",
          claim_token: claimToken || "",
          guest_name: guestInfo?.name || "",
          guest_email: guestInfo?.email || "",
          dedication: JSON.stringify(dedication || {}),
        },
        allow_promotion_codes: true,
      });

      paymentIntent = session;
    }

    // Create donation record in database (pending status)
    const donationData: any = {
      user_id: user?.id || null,
      donor_type: actualDonorType,
      guest_info: actualDonorType === "guest" ? guestInfo : null,
      stripe_payment_intent_id: "session_id" in paymentIntent ? paymentIntent.id : null,
      stripe_customer_id: customerId,
      amount: amount,
      currency: currency,
      status: "pending",
      is_recurring: isRecurring,
      subscription_id: subscriptionId,
      frequency: isRecurring ? frequency : "one-time",
      campaign_id: campaignId,
      campaign_title: campaignTitle,
      dedication: dedication || null,
      claim_token: claimToken,
      metadata: {
        checkout_session_id: "session_id" in paymentIntent ? paymentIntent.id : null,
      },
    };

    const { data: donation, error: donationError } = await supabaseClient
      .from("donations")
      .insert(donationData)
      .select()
      .single();

    if (donationError) {
      console.error("Error creating donation record:", donationError);
      // Continue anyway - webhook will handle it
    }

    // If guest donation, track in guest_donors table
    if (actualDonorType === "guest" && guestInfo?.email && donation) {
      const { data: existingGuest } = await supabaseClient
        .from("guest_donors")
        .select("id, donation_ids")
        .eq("email", guestInfo.email)
        .single();

      if (existingGuest) {
        await supabaseClient
          .from("guest_donors")
          .update({
            donation_ids: [...(existingGuest.donation_ids || []), donation.id],
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingGuest.id);
      } else {
        await supabaseClient
          .from("guest_donors")
          .insert({
            email: guestInfo.email,
            name: guestInfo.name,
            donation_ids: [donation.id],
          });
      }
    }

    return new Response(
      JSON.stringify({
        url: "url" in paymentIntent ? paymentIntent.url : null,
        session_id: "id" in paymentIntent ? paymentIntent.id : null,
        donation_id: donation?.id || null,
        claim_token: claimToken,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
