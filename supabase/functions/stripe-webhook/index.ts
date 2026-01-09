// Supabase Edge Function: Stripe Webhook Handler
// Processes Stripe events and updates donation records

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

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

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabaseClient, session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(supabaseClient, paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(supabaseClient, paymentIntent);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabaseClient, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabaseClient, subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(supabaseClient, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabaseClient, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});

async function handleCheckoutCompleted(
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const metadata = session.metadata || {};
  const donorType = metadata.donor_type || "registered";
  const userId = metadata.user_id || null;
  const claimToken = metadata.claim_token || null;

  // Find donation by checkout session ID
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("stripe_payment_intent_id", session.id)
    .limit(1);

  if (donations && donations.length > 0) {
    const donation = donations[0];
    
    // Update donation status
    const updateData: any = {
      status: "completed",
      stripe_customer_id: session.customer as string,
      updated_at: new Date().toISOString(),
    };

    // If subscription, update subscription_id
    if (session.subscription) {
      updateData.subscription_id = session.subscription as string;
    }

    await supabase
      .from("donations")
      .update(updateData)
      .eq("id", donation.id);

    // Trigger receipt generation (async)
    Deno.env.get("SUPABASE_URL") && 
      fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          donation_id: donation.id,
        }),
      }).catch(console.error);
  } else {
    // Create new donation record if not found
    const donationData = {
      user_id: userId || null,
      donor_type: donorType,
      guest_info: donorType === "guest" ? {
        name: metadata.guest_name,
        email: metadata.guest_email,
      } : null,
      stripe_payment_intent_id: session.id,
      stripe_customer_id: session.customer as string,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || "USD",
      status: "completed",
      is_recurring: session.mode === "subscription",
      subscription_id: session.subscription as string || null,
      frequency: session.mode === "subscription" ? "monthly" : "one-time",
      campaign_id: metadata.campaign_id || null,
      campaign_title: metadata.campaign_title || null,
      dedication: metadata.dedication ? JSON.parse(metadata.dedication) : null,
      claim_token: claimToken,
      metadata: {
        checkout_session_id: session.id,
      },
    };

    await supabase.from("donations").insert(donationData);
  }
}

async function handlePaymentSucceeded(
  supabase: any,
  paymentIntent: Stripe.PaymentIntent
) {
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .limit(1);

  if (donations && donations.length > 0) {
    await supabase
      .from("donations")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", donations[0].id);
  }
}

async function handlePaymentFailed(
  supabase: any,
  paymentIntent: Stripe.PaymentIntent
) {
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .limit(1);

  if (donations && donations.length > 0) {
    await supabase
      .from("donations")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", donations[0].id);
  }
}

async function handleSubscriptionUpdate(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("subscription_id", subscription.id)
    .limit(1);

  if (donations && donations.length > 0) {
    await supabase
      .from("donations")
      .update({
        status: subscription.status === "active" ? "completed" : "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", donations[0].id);
  }
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("subscription_id", subscription.id)
    .limit(1);

  if (donations && donations.length > 0) {
    await supabase
      .from("donations")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", donations[0].id);
  }
}

async function handleInvoicePaymentSucceeded(
  supabase: any,
  invoice: Stripe.Invoice
) {
  if (invoice.subscription) {
    // Create new donation record for recurring payment
    const { data: existingDonations } = await supabase
      .from("donations")
      .select("*")
      .eq("subscription_id", invoice.subscription as string)
      .order("created_at", { ascending: false })
      .limit(1);

    if (existingDonations && existingDonations.length > 0) {
      const originalDonation = existingDonations[0];
      
      const newDonation = {
        user_id: originalDonation.user_id,
        donor_type: originalDonation.donor_type,
        guest_info: originalDonation.guest_info,
        stripe_payment_intent_id: invoice.payment_intent as string,
        stripe_customer_id: invoice.customer as string,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency?.toUpperCase() || "USD",
        status: "completed",
        is_recurring: true,
        subscription_id: invoice.subscription as string,
        frequency: originalDonation.frequency,
        campaign_id: originalDonation.campaign_id,
        campaign_title: originalDonation.campaign_title,
        claim_token: originalDonation.claim_token,
      };

      const { data: donation } = await supabase
        .from("donations")
        .insert(newDonation)
        .select()
        .single();

      if (donation) {
        // Trigger receipt generation
        fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-receipt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            donation_id: donation.id,
          }),
        }).catch(console.error);
      }
    }
  }
}

async function handleInvoicePaymentFailed(
  supabase: any,
  invoice: Stripe.Invoice
) {
  // Log failed payment but don't update donation status
  // Let user handle it through Stripe dashboard
  console.log("Invoice payment failed:", invoice.id);
}
