"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Heart, History, CreditCard, Repeat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent("/dashboard")}`);
    }
  }, [user, loading, router]);

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["userDonations", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return { total: 0, count: 0, recurring: 0 };
      const { data, error } = await supabase
        .from("donations")
        .select("amount, is_recurring")
        .eq("user_id", user.id)
        .eq("status", "completed");
      if (error) throw error;
      
      const total = data?.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0) || 0;
      const count = data?.length || 0;
      const recurring = data?.filter((d: any) => d.is_recurring).length || 0;
      
      return { total, count, recurring };
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.email?.split("@")[0]}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donated</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${stats?.total.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats?.count || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Recurring</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats?.recurring || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Repeat className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Donations
              </h2>
              <Link href="/dashboard/donations">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            {donationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : donations && donations.length > 0 ? (
              <div className="space-y-3">
                {donations.slice(0, 3).map((donation: any) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        ${donation.amount} {donation.is_recurring && <span className="text-xs text-muted-foreground">(Recurring)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        donation.status === "completed" ? "bg-green-500/10 text-green-600" :
                        donation.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No donations yet</p>
                <Link href="/donate">
                  <Button variant="outline" className="mt-4 rounded-xl">
                    Make Your First Donation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/donate">
                <Button className="w-full rounded-xl" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Make a Donation
                </Button>
              </Link>
              <Link href="/dashboard/donations">
                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  <History className="w-4 h-4 mr-2" />
                  View All Donations
                </Button>
              </Link>
              <Link href="/dashboard/payment-methods">
                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Payment Methods
                </Button>
              </Link>
              <Link href="/dashboard/recurring">
                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  <Repeat className="w-4 h-4 mr-2" />
                  Manage Recurring Donations
                </Button>
              </Link>
              <Link href="/claim-donation">
                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  Claim a Donation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
