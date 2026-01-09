"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Calendar, Filter, Search, Heart } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DonationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent("/dashboard/donations")}`);
    }
  }, [user, loading, router]);

  const { data: donations, isLoading, refetch } = useQuery({
    queryKey: ["userDonations", user?.id, statusFilter, typeFilter],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      let query = supabase
        .from("donations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (typeFilter === "recurring") {
        query = query.eq("is_recurring", true);
      } else if (typeFilter === "one-time") {
        query = query.eq("is_recurring", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const filteredDonations = donations?.filter((d: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      d.campaign_title?.toLowerCase().includes(search) ||
      d.id.toLowerCase().includes(search) ||
      d.amount.toString().includes(search)
    );
  }) || [];

  const handleDownloadReceipt = async (donation: any) => {
    if (!donation.receipt_url) {
      toast.error("Receipt not available yet. Please check your email.");
      return;
    }
    window.open(donation.receipt_url, "_blank");
  };

  const totalDonated = donations?.reduce((sum: number, d: any) => {
    return sum + (d.status === "completed" ? Number(d.amount || 0) : 0);
  }, 0) || 0;

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Donation History</h1>
        <p className="text-muted-foreground mt-1">View and manage all your donations</p>
      </div>

      {/* Stats */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Donated</p>
              <p className="text-2xl font-bold text-foreground mt-1">${totalDonated.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <p className="text-2xl font-bold text-foreground mt-1">{donations?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="one-time">One-Time</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="h-10 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No donations found</p>
              <Button onClick={() => router.push("/donate")} className="rounded-xl">
                Make Your First Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDonations.map((donation: any) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          ${donation.amount} {donation.is_recurring && (
                            <span className="text-xs font-normal text-muted-foreground">
                              ({donation.frequency})
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(donation.created_at), "MMM d, yyyy")}
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
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      donation.status === "completed" ? "bg-green-500/10 text-green-600 dark:text-green-500" :
                      donation.status === "pending" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500" :
                      donation.status === "failed" ? "bg-red-500/10 text-red-600 dark:text-red-500" :
                      "bg-gray-500/10 text-gray-600 dark:text-gray-500"
                    }`}>
                      {donation.status}
                    </span>
                    {donation.receipt_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReceipt(donation)}
                        className="rounded-xl"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
