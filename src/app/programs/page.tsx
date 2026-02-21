"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Users, Building2, TrendingUp, Droplets, BookOpen, Sparkles, ArrowRight, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationModal } from "@/components/DonationModal";
import { EventsCalendarDashboard } from "@/components/home/EventsCalendarDashboard";
import { CampaignImage } from "@/components/campaigns/CampaignImage";

const GALA_IMAGE = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80";
const GALA_GOAL = 25_000;
const GALA_DATE = "Sunday, March 8, 2026";
const GALA_TIME = "4:00 PM – 9:00 PM";
const GALA_LOCATION = "Verdi Convention Centre, Mississauga";

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

const partners = {
  community: ["Local Mosques", "Islamic Centers", "Community Foundation"],
  corporate: ["ABC Corporation", "XYZ Holdings", "Local Credit Union"],
  inkind: ["Food Bank Network", "Clothing Depot", "Medical Supplies Co."],
};

const impactMetrics = [
  { label: "Meals Served", value: "25,000+", icon: Heart },
  { label: "Families Helped", value: "3,500+", icon: Users },
  { label: "Wells Built", value: "45", icon: Droplets },
  { label: "Students Supported", value: "1,200+", icon: BookOpen },
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
    // External campaigns don't use the donation modal - they have embedded forms
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
          Explore our active campaigns, upcoming events, and the measurable difference we're making together.
        </p>
      </section>

      {/* Impact Metrics */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Impact at a Glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-gold" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-gold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured: RG Gala Fundraiser */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          Featured Campaign
        </h2>
        <Card
          className="border-2 border-gold/40 overflow-hidden shadow-xl shadow-gold/10 bg-card cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-gold/60"
          onClick={() => router.push("/gala")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative min-h-[200px] md:min-h-[280px] w-full">
              <Image
                src={GALA_IMAGE}
                alt="RG Gala Fundraiser – Ramadan Giving Fundraising Iftaar"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-2 bg-gold/20 text-gold border-gold/40">Gala · LaunchGood</Badge>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">RG Gala Fundraiser</h3>
              <p className="text-sm text-muted-foreground mb-3">Ramadan Giving Fundraising Iftaar · {GALA_DATE}</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  {GALA_TIME}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  {GALA_LOCATION}
                </li>
              </ul>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-sm font-medium text-muted-foreground">Goal:</span>
                <span className="text-lg font-bold text-foreground">${GALA_GOAL.toLocaleString()}</span>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/gala");
                }}
                className="w-full sm:w-auto rounded-xl bg-gold hover:bg-gold/90 text-gold-foreground font-semibold"
              >
                View campaign & donate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </div>
        </Card>
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

      {/* Interactive Events Dashboard */}
      <section className="space-y-4">
        <EventsCalendarDashboard />
      </section>

      {/* Past Events Archive */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Past Events Archive</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Ramadan 2024 Food Drive", outcome: "5,000 meals distributed", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80" },
            { title: "Winter Kits 2023", outcome: "800 families served", image: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=400&q=80" },
            { title: "Back to School 2023", outcome: "500 students supported", image: "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?w=400&q=80" }
          ].map((event, idx) => (
            <Card key={idx} className="border-border/50 overflow-hidden">
              <div 
                className="h-24 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-foreground">{event.title}</p>
                <p className="text-sm text-gold font-medium">{event.outcome}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners & Sponsors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Our Partners & Sponsors
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <p className="font-semibold text-foreground text-sm">Community Partners</p>
              <div className="flex flex-wrap gap-2">
                {partners.community.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <p className="font-semibold text-foreground text-sm">Corporate Sponsors</p>
              <div className="flex flex-wrap gap-2">
                {partners.corporate.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <p className="font-semibold text-foreground text-sm">In-Kind Partners</p>
              <div className="flex flex-wrap gap-2">
                {partners.inkind.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
