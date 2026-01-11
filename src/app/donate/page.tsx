"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";
import { Shield, Banknote, Info, Gift } from "lucide-react";

export default function Donate() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-12">
      <div className="text-center space-y-2 pt-6">
        <h1 className="text-3xl font-bold text-foreground">Make a Donation</h1>
        <p className="text-muted-foreground">Your generosity transforms lives. Every dollar counts.</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <UnifiedDonationForm variant="page" />
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
            <p className="text-sm font-medium text-foreground">donate@ramadangiving.ca</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please include your email in the message for a tax receipt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Info */}
      <Card className="border-border/50 border-2 border-gold/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gold" />
            <span className="font-medium text-foreground text-sm">How Funds Are Used</span>
          </div>
          <p className="text-xs text-muted-foreground">
            100% of Zakat goes directly to eligible recipients. General donations: 90%+ to programs, minimal overhead for essential operations.
          </p>
        </CardContent>
      </Card>

      {/* In-Kind Donations */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">In-Kind Donations</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We also accept material goods: non-perishable food, warm clothing, school supplies, and hygiene items.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact us at <span className="text-gold font-medium">donations@ramadangiving.org</span> to arrange drop-off or pickup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
