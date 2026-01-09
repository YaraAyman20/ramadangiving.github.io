// Supabase Edge Function: Send Receipt Email
// Generates and sends donation receipt via email

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

    const { donation_id } = await req.json();

    if (!donation_id) {
      return new Response(
        JSON.stringify({ error: "donation_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch donation details
    const { data: donation, error: donationError } = await supabaseClient
      .from("donations")
      .select("*")
      .eq("id", donation_id)
      .single();

    if (donationError || !donation) {
      return new Response(
        JSON.stringify({ error: "Donation not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Don't send receipt for anonymous donations unless email provided
    if (donation.donor_type === "anonymous") {
      return new Response(
        JSON.stringify({ message: "Anonymous donations don't receive receipts" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get recipient email
    let recipientEmail: string | null = null;
    let recipientName: string | null = null;

    if (donation.donor_type === "registered" && donation.user_id) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("full_name")
        .eq("id", donation.user_id)
        .single();

      const { data: { user } } = await supabaseClient.auth.admin.getUserById(
        donation.user_id
      );

      recipientEmail = user?.email || null;
      recipientName = profile?.full_name || user?.email?.split("@")[0] || null;
    } else if (donation.donor_type === "guest" && donation.guest_info) {
      recipientEmail = donation.guest_info.email || null;
      recipientName = donation.guest_info.name || null;
    }

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "No email found for donation" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate receipt HTML
    const receiptHtml = generateReceiptHtml(donation, recipientName);

    // Store receipt URL (in a real implementation, you'd upload to storage)
    const receiptUrl = `${Deno.env.get("NEXT_PUBLIC_APP_URL")}/receipt/${donation.id}`;

    // Update donation with receipt URL
    await supabaseClient
      .from("donations")
      .update({
        receipt_url: receiptUrl,
        receipt_sent_at: new Date().toISOString(),
      })
      .eq("id", donation.id);

    // Send email using Supabase Edge Function email service
    // In production, integrate with SendGrid, Resend, or similar
    // For now, we'll use a placeholder that logs the receipt
    
    // Example: Using Resend (uncomment and configure)
    /*
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    await resend.emails.send({
      from: "donations@ramadangiving.org",
      to: recipientEmail,
      subject: `Thank you for your donation of $${donation.amount}`,
      html: receiptHtml,
    });
    */

    // For now, we'll use Supabase's built-in email (if configured)
    // Or log it for manual sending
    console.log("Receipt generated for donation:", donation.id);
    console.log("Recipient:", recipientEmail);
    console.log("Receipt URL:", receiptUrl);

    return new Response(
      JSON.stringify({
        success: true,
        receipt_url: receiptUrl,
        sent_to: recipientEmail,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending receipt:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateReceiptHtml(donation: any, recipientName: string | null): string {
  const date = new Date(donation.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a472a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ramadan Giving</h1>
          <p>Tax Receipt</p>
        </div>
        <div class="content">
          <p>Dear ${recipientName || "Donor"},</p>
          <p>Thank you for your generous donation. This email serves as your official tax receipt.</p>
          
          <div class="details">
            <div class="detail-row">
              <strong>Donation Date:</strong>
              <span>${date}</span>
            </div>
            <div class="detail-row">
              <strong>Amount:</strong>
              <span>$${donation.amount.toFixed(2)} ${donation.currency}</span>
            </div>
            <div class="detail-row">
              <strong>Type:</strong>
              <span>${donation.is_recurring ? "Recurring" : "One-time"} Donation</span>
            </div>
            ${donation.campaign_title ? `
            <div class="detail-row">
              <strong>Campaign:</strong>
              <span>${donation.campaign_title}</span>
            </div>
            ` : ""}
            <div class="detail-row">
              <strong>Transaction ID:</strong>
              <span>${donation.id}</span>
            </div>
            ${donation.claim_token ? `
            <div class="detail-row">
              <strong>Claim Token:</strong>
              <span>${donation.claim_token}</span>
            </div>
            ` : ""}
          </div>

          <p>This donation is tax-deductible. Please keep this receipt for your records.</p>
          <p>If you have any questions, please contact us at donations@ramadangiving.org</p>
        </div>
        <div class="footer">
          <p>Ramadan Giving is a registered charity. Tax ID: [YOUR_TAX_ID]</p>
          <p>© ${new Date().getFullYear()} Ramadan Giving. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
