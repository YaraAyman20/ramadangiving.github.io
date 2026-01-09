"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase, SUPABASE_ANON_KEY } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, Share2, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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

const presetAmounts = [10, 25, 50, 100, 250];

export default function CampaignDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  // Donation state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const amount = customAmount ? Number(customAmount) : selectedAmount;

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonate = async () => {
    if (!campaign || !amount || amount < 1) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    if (!supabase) {
      toast.error("Payment service is not configured. Please contact support.");
      return;
    }

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      // Always include Authorization header
      const authToken = session.data.session?.access_token || SUPABASE_ANON_KEY;
      
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount: amount,
          currency: "USD",
          isRecurring: isMonthly,
          frequency: isMonthly ? "monthly" : "one-time",
          donorType: session.data.session ? "registered" : "guest",
          campaignId: campaign.id,
          campaignTitle: campaign.title,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to initiate payment");
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to initiate payment. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

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
      <CardContent className="p-5 space-y-5">
        <h3 className="font-semibold text-foreground text-lg">Make a Donation</h3>
        
        {/* Amount Grid */}
        <div className="grid grid-cols-5 gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant={selectedAmount === preset ? "default" : "outline"}
              className={`h-12 text-sm font-semibold rounded-xl ${
                selectedAmount === preset
                  ? "bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleAmountSelect(preset)}
            >
              ${preset}
            </Button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">
            Or enter custom amount
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full h-12 pl-8 pr-4 rounded-xl border border-border bg-background text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Monthly Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div>
            <Label className="text-foreground font-medium">Make this monthly</Label>
            <p className="text-xs text-muted-foreground">
              Recurring donation every month
            </p>
          </div>
          <Switch
            checked={isMonthly}
            onCheckedChange={setIsMonthly}
          />
        </div>

        {/* Donate Button */}
        <Button
          onClick={handleDonate}
          className="w-full h-14 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-hover text-primary-foreground"
          disabled={!amount || amount < 1 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Donate {amount ? `$${amount}` : "Now"}
              {isMonthly && amount ? "/mo" : ""}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          <CreditCard className="w-3 h-3 inline mr-1" />
          Secure payment powered by Stripe
        </p>
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
