"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Home, Heart, Download, Copy, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function DonationSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [donation, setDonation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const claimToken = searchParams.get("claim_token") || sessionStorage.getItem("donation_claim_token");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const fetchDonation = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

        try {
        // Try to find donation by session ID or claim token
        let query = supabase.from("donations").select("*");

        if (sessionId) {
          query = query.eq("stripe_payment_intent_id", sessionId);
        } else if (claimToken) {
          query = query.eq("claim_token", claimToken);
        } else {
          setIsLoading(false);
          return;
        }

        const { data, error } = await query.single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching donation:", error);
        } else if (data) {
          setDonation(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonation();
  }, [sessionId, claimToken]);

  const handleCopyClaimToken = () => {
    if (claimToken) {
      navigator.clipboard.writeText(claimToken);
      toast.success("Claim token copied to clipboard!");
    }
  };

  const handleDownloadReceipt = async () => {
    if (!donation || !donation.receipt_url) {
      toast.error("Receipt not available yet. Please check your email.");
      return;
    }

    // In a real implementation, you'd fetch the receipt PDF
    // For now, redirect to receipt URL
    window.open(donation.receipt_url, "_blank");
  };

  const handleCreateAccount = () => {
    const params = new URLSearchParams();
    if (claimToken) params.set("claim_token", claimToken);
    router.push(`/signup?${params.toString()}`);
  };

  const displayAmount = donation?.amount || amount || "0";
  const isAnonymous = donation?.donor_type === "anonymous";
  const isGuest = donation?.donor_type === "guest";
  const showClaimOption = (isAnonymous || isGuest) && !user;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/50">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Jazakallah Khair!
            </h1>
            <p className="text-muted-foreground">
              Your generous donation of{" "}
              <span className="font-semibold text-accent">${displayAmount}</span>{" "}
              has been received.
            </p>
          </div>

          {/* Transaction Details */}
          {donation && (
            <div className="p-4 rounded-xl bg-secondary/30 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction ID:</span>
                <span className="text-sm font-mono text-foreground">{donation.id.slice(0, 8)}...</span>
              </div>
              {donation.campaign_title && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Campaign:</span>
                  <span className="text-sm text-foreground">{donation.campaign_title}</span>
                </div>
              )}
              {donation.is_recurring && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm text-foreground">Recurring Donation</span>
                </div>
              )}
            </div>
          )}

          {/* Claim Token for Anonymous/Guest */}
          {showClaimOption && claimToken && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Save Your Claim Token</p>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Use this token to claim your donation later and link it to your account:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 rounded-lg bg-background border border-border text-xs font-mono break-all">
                    {claimToken}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyClaimToken}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCreateAccount}
                  className="w-full rounded-xl"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account to Claim Donation
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Receipt Download */}
          {donation?.receipt_url && (
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="w-full rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          )}

          {/* Quote */}
          <blockquote className="text-sm italic text-muted-foreground border-l-2 border-accent pl-4 text-left">
            "Whoever relieves a believer's distress, Allah will relieve his distress on the Day of Resurrection."
            <cite className="block mt-1 text-xs font-medium text-accent not-italic">
              — Prophet Muhammad (ﷺ)
            </cite>
          </blockquote>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => router.push("/donate")}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Again
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/donations")}
                className="w-full h-12 rounded-xl border-border hover:bg-secondary"
              >
                View Donation History
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
