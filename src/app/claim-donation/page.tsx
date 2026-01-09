"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function ClaimDonation() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactionId, setTransactionId] = useState("");
  const [claimToken, setClaimToken] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [donation, setDonation] = useState<any>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push(`/login?from=${encodeURIComponent("/claim-donation")}`);
    }
  }, [user, router]);

  const handleSearch = async () => {
    if (!transactionId && !claimToken) {
      toast.error("Please enter a transaction ID or claim token");
      return;
    }

    if (!supabase) {
      toast.error("Service not configured");
      return;
    }

    setIsLoading(true);
    try {
      let query = supabase.from("donations").select("*");

      if (claimToken) {
        query = query.eq("claim_token", claimToken);
      } else if (transactionId) {
        query = query.eq("id", transactionId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        toast.error("Donation not found. Please check your transaction ID or claim token.");
        return;
      }

      if (data.is_claimed) {
        setIsClaimed(true);
        toast.info("This donation has already been claimed");
      }

      setDonation(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to search for donation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!donation || !user || !supabase) return;

    if (donation.donor_type === "guest" && donation.guest_info?.email) {
      if (!email || email.toLowerCase() !== donation.guest_info.email.toLowerCase()) {
        toast.error("Email does not match the donation record");
        return;
      }
    }

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.functions.invoke("claim-donation", {
        body: {
          transaction_id: transactionId || undefined,
          claim_token: claimToken || undefined,
          email: donation.donor_type === "guest" ? email : undefined,
        },
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to claim donation");
      }

      toast.success("Donation claimed successfully! It's now linked to your account.");
      router.push("/dashboard/donations");
    } catch (error: any) {
      toast.error(error.message || "Failed to claim donation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-foreground">Claim Your Donation</CardTitle>
          <CardDescription className="text-muted-foreground">
            Link your anonymous or guest donation to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!donation ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Transaction ID</Label>
                  <Input
                    id="transaction-id"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-token">Claim Token</Label>
                  <Input
                    id="claim-token"
                    placeholder="Enter claim token"
                    value={claimToken}
                    onChange={(e) => setClaimToken(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isLoading || (!transactionId && !claimToken)}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Searching..." : "Search Donation"}
              </Button>
            </>
          ) : (
            <>
              {isClaimed ? (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">Already Claimed</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This donation has already been claimed by another account.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <p className="font-medium text-foreground">Donation Found</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold text-foreground">${donation.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {donation.campaign_title && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Campaign:</span>
                          <span className="text-foreground">{donation.campaign_title}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground capitalize">{donation.donor_type}</span>
                      </div>
                    </div>
                  </div>

                  {donation.donor_type === "guest" && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Verify Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={donation.guest_info?.email || "Enter email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the email address used for this donation
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleClaim}
                    disabled={isLoading || (donation.donor_type === "guest" && !email)}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isLoading ? "Claiming..." : "Claim Donation"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDonation(null);
                      setTransactionId("");
                      setClaimToken("");
                      setEmail("");
                    }}
                    className="w-full text-muted-foreground"
                  >
                    Search Another Donation
                  </Button>
                </>
              )}
            </>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Need help? Contact us at{" "}
              <a href="mailto:support@ramadangiving.org" className="text-primary hover:underline">
                support@ramadangiving.org
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
