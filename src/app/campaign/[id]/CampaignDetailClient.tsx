"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, Share2, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";

interface Campaign {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  is_zakat_eligible: boolean;
}

// Impact messages based on category
const impactMessages: Record<string, string> = {
  "Water": "Each $100 provides clean water for a family for a year",
  "Food": "Each $100 feeds a family for an entire month",
  "Education": "Each $100 sponsors a child's education for 3 months",
  "Healthcare": "Each $100 provides medical care for 5 patients",
  "Orphans": "Each $100 supports an orphan for 2 weeks",
  "Emergency": "Each $100 delivers emergency supplies to 10 families",
};

export default function CampaignDetailClient() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!id,
  });

  const handleShare = async () => {
    if (navigator.share && campaign) {
      try {
        await navigator.share({
          title: campaign.title,
          text: campaign.description || "Support this cause",
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (campaignLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Heart className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Campaign not found</p>
        <Button variant="outline" onClick={() => router.push("/programs")}>
          Browse Campaigns
        </Button>
      </div>
    );
  }

  const progress = (Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100;
  const impactMessage = impactMessages[campaign.category] || "Every donation makes a difference";

  // Donation form component (reused)
  const DonationForm = ({ isSticky = false }: { isSticky?: boolean }) => (
    <Card className={`border-border/50 ${isSticky ? 'sticky top-24' : ''}`}>
      <CardContent className="p-5">
        <UnifiedDonationForm
          variant="page"
          initialCampaignId={campaign.id}
          initialCampaignTitle={campaign.title}
          showCauseSelector={false}
          showImpactCards={false}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/programs")}
        className="gap-2 -ml-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Campaigns
      </Button>

      {/* Desktop: 2-Column Layout - Top Aligned */}
      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left Column: Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={campaign.image_url || "/placeholder.svg"}
              alt={campaign.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
            />
            {campaign.is_zakat_eligible && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                Zakat Eligible
              </Badge>
            )}
          </div>

          {/* Title and Category */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {campaign.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {campaign.title}
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full progress-gold rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${Number(campaign.raised_amount).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">raised</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  ${Number(campaign.goal_amount).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">goal</p>
              </div>
            </div>
          </div>

          {/* About this Campaign - Moved UP */}
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground text-lg">About this Campaign</h2>
            <p className="text-muted-foreground leading-relaxed">
              {campaign.description || "Help support this important cause and make a difference in people's lives."}
            </p>
          </div>

          {/* Impact Box - Gold Highlighted */}
          <Card className="border-2 border-gold/40 bg-gradient-to-r from-gold/10 to-gold/5">
            <CardContent className="p-5">
              <p className="text-gold font-semibold text-lg text-center">
                💛 {impactMessage}
              </p>
            </CardContent>
          </Card>

          {/* Mobile: Donation Form shows here */}
          <div className="md:hidden">
            <DonationForm />
          </div>
        </div>

        {/* Right Column: Sticky Donation Form (Desktop only) */}
        <div className="hidden md:block md:col-span-2">
          <DonationForm isSticky />
        </div>
      </div>
    </div>
  );
}
