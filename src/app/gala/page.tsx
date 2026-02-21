"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const LAUNCHGOOD_CAMPAIGN_URL =
  "https://www.launchgood.com/v4/campaign/ramadan_giving_building_bridges_of_hope";

const GALA_GOAL = 25_000;
const GALA_IMAGE =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80";

const GALA_DATE = "Sunday, March 8, 2026";
const GALA_TIME = "4:00 PM – 9:00 PM";
const GALA_LOCATION = "Verdi Convention Centre, Mississauga";

export default function GalaPage() {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RG Gala Fundraiser – Ramadan Giving",
          text: "Support our Ramadan Giving Fundraising Iftaar. Goal: $25,000.",
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch {
        // User cancelled
      }
    } else {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="gap-2 -ml-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-semibold px-3 py-1 border-2">
                  Gala
                </Badge>
                <Badge className="text-xs font-semibold px-3 py-1 bg-primary/15 text-primary border-primary/30">
                  LaunchGood
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                RG Gala Fundraiser
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl max-w-4xl">
                Support our Ramadan Giving Fundraising Iftaar. Your donation helps us carry the spirit of Ramadan to families in need—locally and globally. Join us for an evening of community, reflection, and giving.
              </p>
            </div>
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

          {/* Goal card – donations only via embedded form below */}
          <Card className="border-2 border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-xl overflow-hidden mb-8">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Fundraising goal
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-foreground">
                    ${GALA_GOAL.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Progress updates in real time on LaunchGood. Donate below.
                  </p>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all w-0"
                    style={{ width: "0%" }}
                    aria-hidden
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gala event details */}
          <Card className="border-2 border-gold/30 overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto min-h-[240px]">
                <Image
                  src={GALA_IMAGE}
                  alt="Ramadan Giving Fundraising Iftaar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Ramadan Giving Fundraising Iftaar
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gold shrink-0" />
                    <span>{GALA_DATE}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gold shrink-0" />
                    <span>{GALA_TIME}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gold shrink-0" />
                    <span>{GALA_LOCATION}</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Join us for an evening of community, iftar, and giving. All proceeds support our programs for families in need.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Donate section – LaunchGood embed */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/50">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Make a Donation
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your donation securely below. All payments are processed by LaunchGood.
              </p>
            </div>
          </div>

          <Card className="border-2 border-border/50 shadow-2xl overflow-hidden bg-background">
            <CardContent className="p-0">
              <div className="relative w-full bg-background">
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 z-10 backdrop-blur-sm transition-opacity duration-300"
                  id="gala-iframe-loading"
                >
                  <div className="text-center space-y-4 p-8">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-base font-medium text-foreground">
                      Loading donation form…
                    </p>
                  </div>
                </div>
                <iframe
                  src={LAUNCHGOOD_CAMPAIGN_URL}
                  className="w-full border-0 transition-opacity duration-500"
                  style={{ minHeight: "950px", display: "block", width: "100%" }}
                  title="Donate to RG Gala Fundraiser on LaunchGood"
                  allow="payment; fullscreen; autoplay; camera; microphone"
                  allowFullScreen
                  scrolling="yes"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-modals"
                  onLoad={() => {
                    const el = document.getElementById("gala-iframe-loading");
                    if (el) {
                      el.style.opacity = "0";
                      setTimeout(() => {
                        el.style.display = "none";
                      }, 300);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">Secure Payment</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">Trusted Platform</p>
                <p className="text-xs text-muted-foreground">Verified & secure</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
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
