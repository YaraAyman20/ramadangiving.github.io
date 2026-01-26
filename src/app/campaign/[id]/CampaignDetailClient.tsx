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
import { ArrowLeft, Heart, Share2, Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";
import { CampaignImage } from "@/components/campaigns/CampaignImage";

interface Campaign {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  is_zakat_eligible: boolean;
  external_url?: string | null;
  campaign_type?: string | null;
  platform?: string | null;
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

  const isExternal = campaign.campaign_type === 'external' && campaign.external_url;
  const progress = campaign.goal_amount > 0 
    ? (Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100 
    : 0;
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

  // External campaign iframe URL helper
  const getEmbedUrl = (url: string, platform: string | null | undefined) => {
    if (platform === 'gofundme') {
      // GoFundMe widget embed URL - extract campaign slug
      const match = url.match(/gofundme\.com\/f\/([^/?]+)/);
      if (match) {
        const campaignSlug = match[1];
        // Use GoFundMe's widget endpoint for embedded donations
        return `https://www.gofundme.com/f/${campaignSlug}/widget`;
      }
    } else if (platform === 'launchgood') {
      // LaunchGood - use the full page URL
      return url;
    }
    return url;
  };

  // If external campaign, show embedded iframe
  if (isExternal && campaign.external_url) {
    const embedUrl = getEmbedUrl(campaign.external_url, campaign.platform);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button - Subtle */}
          <Button
            variant="ghost"
            onClick={() => router.push("/programs")}
            className="gap-2 -ml-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Button>

          {/* Hero Section - Enhanced */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="space-y-4 flex-1">
                {/* Badges - Improved styling */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs font-semibold px-3 py-1 border-2">
                    {campaign.category}
                  </Badge>
                  {campaign.platform && (
                    <Badge className="text-xs font-semibold px-3 py-1 bg-primary/15 text-primary border-primary/30">
                      {campaign.platform === 'gofundme' ? 'GoFundMe' : 'LaunchGood'}
                    </Badge>
                  )}
                </div>
                
                {/* Title - More prominent */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                  {campaign.title}
                </h1>
                
                {/* Description - Better typography */}
                {campaign.description && (
                  <p className="text-muted-foreground leading-relaxed text-lg md:text-xl max-w-4xl mt-4">
                    {campaign.description}
                  </p>
                )}
              </div>
              
              {/* Share Button - Better positioned */}
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleShare}
                className="gap-2 shrink-0 border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share Campaign
              </Button>
            </div>

            {/* Progress Section - Enhanced with gradient and better visuals */}
            {campaign.goal_amount > 0 && (
              <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Raised
                        </p>
                        <p className="text-4xl md:text-5xl font-bold text-foreground">
                          ${Number(campaign.raised_amount).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span>Live updates</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Goal
                        </p>
                        <p className="text-4xl md:text-5xl font-bold text-foreground">
                          ${Number(campaign.goal_amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(progress)}% complete
                        </p>
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">Progress</span>
                        <span className="text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-4 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-primary to-gold rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Donation Section - Seamlessly integrated */}
          <div className="space-y-6">
            {/* Section Header - Cleaner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/50">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Make a Donation
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your donation securely below. All payments are processed by {campaign.platform === 'gofundme' ? 'GoFundMe' : 'LaunchGood'}.
                </p>
              </div>
            </div>
            
            {/* Embedded Iframe Container - Enhanced */}
            <Card className="border-2 border-border/50 shadow-2xl overflow-hidden bg-background">
              <CardContent className="p-0">
                <div className="relative w-full bg-background">
                  {/* Loading State - More polished */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 z-10 backdrop-blur-sm transition-opacity duration-300" 
                    id="iframe-loading"
                  >
                    <div className="text-center space-y-4 p-8">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <Heart className="w-6 h-6 text-primary/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-base font-medium text-foreground">Loading donation form</p>
                        <p className="text-sm text-muted-foreground">Please wait while we prepare your secure checkout...</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Embedded Iframe - Seamless integration */}
                  <iframe
                    src={embedUrl}
                    className="w-full border-0 transition-opacity duration-500"
                    style={{ 
                      minHeight: '950px',
                      display: 'block',
                      width: '100%'
                    }}
                    title={`Donate to ${campaign.title}`}
                    allow="payment; fullscreen; autoplay; camera; microphone"
                    allowFullScreen
                    scrolling="yes"
                    frameBorder="0"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-modals"
                    onLoad={() => {
                      const loadingEl = document.getElementById('iframe-loading');
                      if (loadingEl) {
                        loadingEl.style.opacity = '0';
                        setTimeout(() => {
                          loadingEl.style.display = 'none';
                        }, 300);
                      }
                    }}
                    onError={() => {
                      console.error('Iframe failed to load');
                      const loadingEl = document.getElementById('iframe-loading');
                      if (loadingEl) {
                        loadingEl.innerHTML = `
                          <div class="text-center space-y-4 p-8">
                            <div class="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                              <svg class="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div class="space-y-2">
                              <p class="text-lg font-semibold text-destructive">Unable to load donation form</p>
                              <p class="text-sm text-muted-foreground">Please try refreshing the page or contact support if the issue persists.</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators - Enhanced with icons and better design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-semibold text-foreground mb-1">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-semibold text-foreground mb-1">Trusted Platform</p>
                  <p className="text-xs text-muted-foreground">Verified & secure</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-semibold text-foreground mb-1">Instant Receipt</p>
                  <p className="text-xs text-muted-foreground">Email confirmation sent</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Internal campaign (existing layout)
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
            {campaign.image_url ? (
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover"
              />
            ) : (
              <CampaignImage
                imageUrl={campaign.image_url}
                externalUrl={campaign.external_url}
                isExternal={campaign.campaign_type === 'external'}
                className="w-full h-64 md:h-80"
              />
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
          {campaign.goal_amount > 0 && (
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
          )}

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
