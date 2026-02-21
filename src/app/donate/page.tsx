"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";
import { Banknote, Info, Gift, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Donate() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-12">
      <div className="text-center space-y-2 pt-6">
        <h1 className="text-3xl font-bold text-foreground">How You Can Help</h1>
        <p className="text-muted-foreground">
          Donate Funds — Make an immediate impact. 100% of your donation supports essential community initiatives.
        </p>
      </div>

      {/* Donation Form */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <UnifiedDonationForm variant="page" />
        </CardContent>
      </Card>

      {/* How Funds Are Used */}
      <Card className="border-border/50 border-2 border-gold/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gold" />
            <span className="font-medium text-foreground text-sm">How Your Donation Is Used</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { amount: "$10", impact: "1 winter kit or hygiene kit for someone in need" },
              { amount: "$50", impact: "2 grocery packs for a vulnerable family" },
              { amount: "$100", impact: "10 hot meals for the unhoused" },
              { amount: "$250", impact: "Full-day camp experience & gift bag for a child" },
            ].map((item) => (
              <div key={item.amount} className="p-2 rounded-lg bg-secondary/50 space-y-1">
                <p className="font-bold text-gold">{item.amount}</p>
                <p className="text-muted-foreground leading-snug">{item.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* E-Transfer Info */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Donate via E-Transfer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You can also donate directly via Interac e-Transfer:
          </p>
          <div className="p-3 rounded-lg bg-background border border-border">
            <p className="text-sm font-medium text-foreground">givingramadan@gmail.com</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please include your name and purpose in the message.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* In-Kind Support */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Offer In-Kind Support</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Contribute goods, services, or resources—including supplies, space, or other practical support—to help us serve communities more effectively.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact us at{" "}
            <a href="mailto:givingramadan@gmail.com" className="text-primary font-medium">
              givingramadan@gmail.com
            </a>{" "}
            to discuss in-kind donations.
          </p>
        </CardContent>
      </Card>

      {/* Spread the Word */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Spread the Word</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Share our work on social media and help grow a movement rooted in compassion and collective action.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => window.open("https://www.instagram.com/ramadan.giving", "_blank")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Follow @ramadan.giving
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
