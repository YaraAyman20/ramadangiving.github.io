"use client";

import { useState } from "react";
import { Heart, Users, Building2, TrendingUp, FileText, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationModal } from "@/components/DonationModal";
import { CampaignImage } from "@/components/campaigns/CampaignImage";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  is_zakat_eligible: boolean;
  external_url?: string | null;
  campaign_type?: string | null;
  platform?: string | null;
}

const programs = [
  {
    emoji: "🍲",
    title: "Supporting the Unhoused",
    who: "Individuals experiencing homelessness in the GTA",
    what: "Winter kits, hygiene kits, hot meals, lunch bags, and essential items",
    impact: "2,449+ hot meals & lunch bags served",
    color: "from-primary/10 to-transparent",
  },
  {
    emoji: "📦",
    title: "Food Packs for Families",
    who: "Families in need across the GTA",
    what: "Grocery packs with essentials for underprivileged families",
    impact: "2,104+ food packs delivered",
    color: "from-gold/10 to-transparent",
  },
  {
    emoji: "🎨",
    title: "Empowering Refugee & Vulnerable Children",
    who: "Gazan, Syrian, and Afghan refugee children in the GTA",
    what: "Free, fun camp days, gift bags, toys, clothing, and educational resources",
    impact: "335+ children supported · 350+ gift & clothing bags delivered",
    color: "from-accent/10 to-transparent",
  },
  {
    emoji: "🤝",
    title: "Community Building & Engagement",
    who: "Local communities and refugee families",
    what: "Halaqas, community potlucks, fundraising events, awareness campaigns",
    impact: "18 community events hosted · $517,000+ raised for relief initiatives",
    color: "from-primary/10 to-transparent",
  },
  {
    emoji: "🌍",
    title: "International Relief & Support",
    who: "Orphans and families in places like Cairo, Egypt",
    what: "Camp days, meals, toys, gift bags, and emergency aid for vulnerable children abroad",
    impact: "161+ orphans supported · 530+ meals served · 260+ toys & gift bags delivered",
    color: "from-gold/10 to-transparent",
  },
];

export default function Programs() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
  });

  const handleDonateClick = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    if (campaign.campaign_type === 'external') {
      router.push(`/campaign/${campaign.id}`);
      return;
    }
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleCardClick = (campaignId: string) => {
    router.push(`/campaign/${campaignId}`);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4">
      {/* Header */}
      <section className="text-center space-y-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Programs & Impact</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Making a difference locally and globally through hands-on initiatives that provide essential resources, connection, and dignity.
        </p>
      </section>

      {/* Impact at a Glance */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Impact at a Glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: "2,449+", label: "Hot Meals & Lunch Bags" },
            { value: "2,104+", label: "Food Packs Delivered" },
            { value: "335+", label: "Children Supported" },
            { value: "18", label: "Community Events" },
            { value: "$517,000+", label: "Raised for Relief" },
            { value: "161+", label: "Orphans Supported Internationally" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xl md:text-2xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Active Campaigns
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              const isExternal = campaign.campaign_type === 'external';
              const progress = campaign.goal_amount > 0
                ? (Number(campaign.raised_amount) / Number(campaign.goal_amount)) * 100
                : 0;

              return (
                <Card
                  key={campaign.id}
                  className="border-border/50 card-hover cursor-pointer overflow-hidden"
                  onClick={() => handleCardClick(campaign.id)}
                >
                  <CampaignImage
                    imageUrl={campaign.image_url}
                    externalUrl={campaign.external_url}
                    isExternal={isExternal}
                    className="h-32"
                  />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">{campaign.title}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {isExternal && campaign.platform && (
                          <Badge variant="outline" className="text-xs">
                            {campaign.platform === 'gofundme' ? 'GoFundMe' : 'LaunchGood'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {campaign.goal_amount > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            ${Number(campaign.raised_amount).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ${Number(campaign.goal_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full progress-gold rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={(e) => handleDonateClick(e, campaign)}
                      className="w-full rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      {isExternal ? 'View Campaign' : 'Donate'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No active campaigns at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Our Programs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Our Programs
        </h2>
        <div className="space-y-4">
          {programs.map((program) => (
            <Card key={program.title} className={`border-border/50 bg-gradient-to-r ${program.color}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{program.emoji}</span>
                  <h3 className="font-bold text-foreground text-lg">{program.title}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Who We Serve</p>
                    <p className="text-muted-foreground">{program.who}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">What We Do</p>
                    <p className="text-muted-foreground">{program.what}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Impact</p>
                    <p className="text-gold font-medium">{program.impact}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs h-8"
                    onClick={() => router.push("/donate")}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Donate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs h-8"
                    onClick={() => router.push("/get-involved")}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Volunteer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Annual Impact Reports */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Annual Impact Reports
        </h2>
        <Card className="border-border/50 border-dashed">
          <CardContent className="p-8 text-center space-y-3">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="font-semibold text-foreground">Our First Annual Report Is Coming</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We are preparing our first annual impact report for 2025. It will be available here once published. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Partners & Sponsors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Our Partners & Collaborators
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground text-sm">
              We are proud to work alongside community organizations, local businesses, and institutions committed to creating change. Our partners section is growing — check back soon for featured partner spotlights.
            </p>
            <p className="text-sm text-muted-foreground">
              Interested in partnering with us?{" "}
              <button
                className="text-primary underline"
                onClick={() => router.push("/get-involved")}
              >
                Learn how to collaborate
              </button>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Donation Modal */}
      <DonationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        campaign={selectedCampaign}
      />
    </div>
  );
}
