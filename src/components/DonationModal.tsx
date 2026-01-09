import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Loader2, Wallet, Landmark, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: {
    id: string;
    title: string;
  } | null;
}

const presetAmounts = [10, 50, 100];

export function DonationModal({ open, onOpenChange, campaign }: DonationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const amount = customAmount ? Number(customAmount) : selectedAmount;

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleContinue = () => {
    if (!amount || amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    if (!campaign || !amount) return;

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
      const session = await supabase.auth.getSession();
      const authToken = session.data.session?.access_token;

      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount: amount,
          currency: "USD",
          isRecurring: isMonthly,
          frequency: isMonthly ? "monthly" : "one-time",
          donorType: user ? "registered" : "guest",
          guestInfo: user ? {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Registered User",
            email: user.email || "",
          } : undefined,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
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
    setSelectedAmount(50);
    setCustomAmount("");
    setIsMonthly(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {step === 1 ? "Select Amount" : "Confirm Donation"}
          </DialogTitle>
          {campaign && (
            <p className="text-sm text-muted-foreground mt-1">{campaign.title}</p>
          )}
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={selectedAmount === preset ? "default" : "outline"}
                  className={`h-14 text-lg font-semibold rounded-xl ${selectedAmount === preset
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => handleAmountSelect(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
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
                  className="w-full h-14 pl-8 pr-4 rounded-xl border border-border bg-background text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Monthly Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <Label className="text-foreground font-medium">Make it monthly</Label>
                <p className="text-xs text-muted-foreground">
                  Recurring donation every month
                </p>
              </div>
              <Switch
                checked={isMonthly}
                onCheckedChange={setIsMonthly}
              />
            </div>

            <Button
              onClick={handleContinue}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={!amount || amount < 1}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            {/* Summary */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/50">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Donation Amount</span>
                <span className="font-semibold text-foreground">${amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Frequency</span>
                <span className="font-medium text-foreground">
                  {isMonthly ? "Monthly" : "One-time"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-accent">
                  ${amount}
                  {isMonthly && <span className="text-sm font-normal">/mo</span>}
                </span>
              </div>
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
              className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={isLoading}
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
      </DialogContent>
    </Dialog>
  );
}
