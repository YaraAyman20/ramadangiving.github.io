"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, CreditCard, Loader2, Heart, Package, Sparkles, ChevronRight, ArrowLeft, Landmark, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { GuestDonationModal } from "@/components/GuestDonationModal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SmartDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Static causes list
const causeOptions = [
  { id: "general", title: "Where Most Needed" },
  { id: "winter-relief", title: "Winter Relief Kits" },
  { id: "grocery-packs", title: "Grocery Packs" },
  { id: "meals-unhoused", title: "Meals for the Unhoused" },
  { id: "camps-psychosocial", title: "Camps & Psychosocial Support" },
  { id: "vulnerable-family", title: "Vulnerable Family Support" },
];

const impactOptions = [
  {
    amount: 50,
    impact: "Feeds a family for a week",
    icon: Heart,
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    amount: 100,
    impact: "Provides Winter Relief Kits",
    icon: Package,
    color: "from-gold/20 to-gold/5",
    borderColor: "border-gold/30",
  },
  {
    amount: 250,
    impact: "Sponsors a youth program",
    icon: Sparkles,
    color: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
  },
];

export function SmartDonationModal({ open, onOpenChange }: SmartDonationModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedCause, setSelectedCause] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const amount = customAmount ? Number(customAmount) : selectedAmount;

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedAmount(null);
      setCustomAmount("");
      setSelectedCause("");
      setIsAnonymous(false);
    }
  }, [open]);

  const handleSelectAmount = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount("");
    // Clear cause when impact card selected (mutual exclusivity)
    setSelectedCause("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleCauseChange = (value: string) => {
    setSelectedCause(value);
    // Clear impact card selection when cause selected (mutual exclusivity)
    setSelectedAmount(null);
  };

  const handleNext = () => {
    if (!amount || amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please select or enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is logged in
    if (!user) {
      setShowGuestModal(true);
      return;
    }

    setStep(2);
  };

  const handleGuestContinue = () => {
    setShowGuestModal(false);
    setStep(2);
  };

  const handleSignIn = () => {
    // Close modals and navigate to login
    setShowGuestModal(false);
    onOpenChange(false);
    router.push("/login");
  };

  const getCauseName = () => {
    if (!selectedCause || selectedCause === "general") return "Where Most Needed";
    return causeOptions.find(c => c.id === selectedCause)?.title || "Where Most Needed";
  };

  const handlePayment = async () => {
    if (!amount) return;

    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Payment service is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }



      const session = await supabase.auth.getSession();
      const authToken = session.data.session?.access_token;

      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount: amount,
          currency: "USD",
          isRecurring: false,
          frequency: "one-time",
          donorType: user ? "registered" : (isAnonymous ? "anonymous" : "guest"),
          guestInfo: user ? {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Registered User",
            email: user.email || "",
          } : undefined,
          userId: user?.id,
          campaignId: selectedCause || "general",
          campaignTitle: getCauseName(),
        },
        headers: authToken ? {
          Authorization: `Bearer ${authToken}`,
        } : undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to initiate payment");
      }

      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount("");
    setSelectedCause("");
    setIsAnonymous(false);
    onOpenChange(false);
  };

  const selectedImpact = impactOptions.find(opt => opt.amount === selectedAmount);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {step === 1 ? "Choose Your Impact" : "Confirm Your Gift"}
              </DialogTitle>
              <p className="text-white/80 mt-1">
                {step === 1
                  ? "See exactly how your donation helps our community"
                  : "Review your donation details"}
              </p>
            </DialogHeader>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Impact Cards (Top) */}
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Select an impact level
                  </Label>
                  {impactOptions.map((option) => (
                    <button
                      key={option.amount}
                      onClick={() => handleSelectAmount(option.amount)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                        "bg-gradient-to-r hover:scale-[1.02]",
                        option.color,
                        selectedAmount === option.amount
                          ? `${option.borderColor} ring-2 ring-offset-2 ring-primary/20`
                          : "border-border/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedAmount === option.amount ? "bg-primary" : "bg-muted"
                        )}>
                          <option.icon className={cn(
                            "w-6 h-6",
                            selectedAmount === option.amount ? "text-white" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">${option.amount}</p>
                          <p className="text-sm text-muted-foreground">{option.impact}</p>
                        </div>
                        {selectedAmount === option.amount && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground font-medium">- OR -</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Select a Cause Dropdown (Bottom) */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Select a Cause
                  </Label>
                  <Select value={selectedCause} onValueChange={handleCauseChange}>
                    <SelectTrigger className="w-full h-12 rounded-xl border-2 border-border bg-background">
                      <SelectValue placeholder="Choose a specific cause..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-lg z-50">
                      {causeOptions.map((cause) => (
                        <SelectItem key={cause.id} value={cause.id}>
                          {cause.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Amount - only show if cause selected */}
                {selectedCause && (
                  <div className="pt-2">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Enter donation amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="w-full h-14 pl-8 pr-4 rounded-xl border-2 border-border bg-background text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  disabled={!amount || amount < 1}
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gold hover:bg-gold/90 text-gold-foreground"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="space-y-4 p-4 rounded-2xl bg-secondary/50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Your Gift</span>
                    <span className="text-2xl font-bold text-foreground">${amount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground">Cause</span>
                    <span className="text-sm font-medium text-foreground">{getCauseName()}</span>
                  </div>
                  {selectedImpact && (
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <selectedImpact.icon className="w-5 h-5 text-gold" />
                      <span className="text-muted-foreground">{selectedImpact.impact}</span>
                    </div>
                  )}
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <Label className="text-foreground font-medium">Make it anonymous</Label>
                    <p className="text-xs text-muted-foreground">
                      Your name won't be displayed publicly
                    </p>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                {/* Payment Methods Info */}
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <p className="text-sm font-medium text-foreground">Accepted Payment Methods</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Credit Card</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Google Pay</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Apple Pay</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border">
                      <Landmark className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">PayPal</span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Donation
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe • Tax-deductible receipt provided
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Modal with Sign In handler */}
      <GuestDonationModal
        open={showGuestModal}
        onOpenChange={setShowGuestModal}
        onContinueAsGuest={handleGuestContinue}
        onSignIn={handleSignIn}
      />
    </>
  );
}
