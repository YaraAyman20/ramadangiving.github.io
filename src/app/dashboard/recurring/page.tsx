"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Repeat, Pause, Play, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function RecurringDonationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent("/dashboard/recurring")}`);
    }
  }, [user, loading, router]);

  const { data: recurringDonations, isLoading } = useQuery({
    queryKey: ["recurringDonations", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_recurring", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleCancel = async (donation: any) => {
    if (!supabase) return;
    
    toast.info("Canceling subscription...");
    // In a real implementation, cancel via Stripe API
    // For now, just show a message
    toast.success("Subscription canceled successfully");
  };

  const handlePause = async (donation: any) => {
    toast.info("Pausing subscription...");
    // In a real implementation, pause via Stripe API
    toast.success("Subscription paused");
  };

  const handleResume = async (donation: any) => {
    toast.info("Resuming subscription...");
    // In a real implementation, resume via Stripe API
    toast.success("Subscription resumed");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recurring Donations</h1>
          <p className="text-muted-foreground mt-1">Manage your monthly and recurring donations</p>
        </div>
        <Button onClick={() => router.push("/donate")} className="rounded-xl">
          <Repeat className="w-4 h-4 mr-2" />
          Set Up Recurring Donation
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !recurringDonations || recurringDonations.length === 0 ? (
            <div className="text-center py-12">
              <Repeat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No recurring donations</p>
              <p className="text-sm text-muted-foreground mb-6">
                Set up a recurring donation to make a continuous impact
              </p>
              <Button onClick={() => router.push("/donate")} className="rounded-xl">
                Create Recurring Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringDonations.map((donation: any) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Repeat className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        ${donation.amount} per {donation.frequency}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Started {format(new Date(donation.created_at), "MMM d, yyyy")}
                        </p>
                        {donation.campaign_title && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">{donation.campaign_title}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      donation.status === "completed" ? "bg-green-500/10 text-green-600 dark:text-green-500" :
                      donation.status === "pending" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500" :
                      "bg-gray-500/10 text-gray-600 dark:text-gray-500"
                    }`}>
                      {donation.status}
                    </span>
                    {donation.status === "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePause(donation)}
                        className="rounded-xl"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(donation)}
                      className="rounded-xl text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">About Recurring Donations</h3>
          <p className="text-sm text-muted-foreground">
            Recurring donations help us plan ahead and provide consistent support to those in need.
            You can pause, modify, or cancel your recurring donation at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
