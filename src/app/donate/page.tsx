"use client";

import { useState, useEffect } from "react";
import { DollarSign, Heart, Repeat, Shield, Info, Gift, EyeOff, CreditCard, Wallet, Landmark, Banknote, User, Mail, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, SUPABASE_ANON_KEY } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const presetAmounts = [25, 50, 100, 250, 500];
const frequencies = [
  { value: "one-time", label: "One-Time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];
const allocations = [
  { value: "general", label: "Where Most Needed (General Fund)" },
  { value: "food", label: "Food Distribution" },
  { value: "winter", label: "Winter Relief Kits" },
  { value: "education", label: "Education Support" },
  { value: "medical", label: "Medical Aid" },
  { value: "zakat", label: "Zakat Fund" },
];

type DonorType = "anonymous" | "guest" | "registered";

export default function Donate() {
  const { user, loading: authLoading } = useAuth();
  const [donorType, setDonorType] = useState<DonorType>(user ? "registered" : "guest");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [allocation, setAllocation] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  
  // Guest donation fields
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  
  // Dedication fields
  const [dedication, setDedication] = useState({ in_honor_of: "", message: "" });

  const amount = customAmount ? Number(customAmount) : selectedAmount;
  const isRecurring = frequency !== "one-time";

  // Auto-set donor type based on auth status
  useEffect(() => {
    if (user && donorType === "guest") {
      setDonorType("registered");
    } else if (!user && donorType === "registered") {
      setDonorType("guest");
    }
  }, [user, donorType]);

  const validateForm = (): boolean => {
    if (!amount || amount < 1) {
      toast.error("Please enter a valid donation amount");
      return false;
    }

    if (donorType === "guest") {
      if (!guestName.trim()) {
        toast.error("Please enter your name");
        return false;
      }
      if (!guestEmail.trim() || !guestEmail.includes("@")) {
        toast.error("Please enter a valid email address");
        return false;
    }
    }

    return true;
  };

  const proceedToCheckout = async () => {
    if (!validateForm()) return;

    if (!supabase) {
      toast.error("Payment service is not configured. Please contact support.");
      return;
    }

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      // Always include Authorization header - use session token if available, otherwise anon key
      const authToken = session.data.session?.access_token || SUPABASE_ANON_KEY;
      
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount,
          currency: "USD",
          isRecurring: isRecurring,
          frequency: frequency,
          donorType: donorType,
          guestInfo: donorType === "guest" ? {
            name: guestName,
            email: guestEmail,
          } : undefined,
          userId: user?.id,
          campaignId: allocation,
          campaignTitle: allocations.find(a => a.value === allocation)?.label || "General Donation",
          dedication: (dedication.in_honor_of || dedication.message) ? dedication : undefined,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to initiate payment");
      }

      if (data?.url) {
        // Store claim token in sessionStorage for anonymous/guest donations
        if (data.claim_token) {
          sessionStorage.setItem("donation_claim_token", data.claim_token);
        }
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-12">
      <div className="text-center space-y-2 pt-6">
        <h1 className="text-3xl font-bold text-foreground">Make a Donation</h1>
        <p className="text-muted-foreground">Your generosity transforms lives. Every dollar counts.</p>
          </div>

      <Card className="border-border/50">
        <CardContent className="p-6 space-y-6">
          {/* Donor Type Selection */}
          {!user && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">How would you like to donate?</Label>
              <Tabs value={donorType} onValueChange={(v) => setDonorType(v as DonorType)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="anonymous" className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Anonymous
                  </TabsTrigger>
                  <TabsTrigger value="guest" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Guest
                  </TabsTrigger>
                  <TabsTrigger value="registered" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Sign In
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="anonymous" className="mt-4 p-4 rounded-xl bg-secondary/30">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Donate Anonymously</p>
                    <p className="text-xs text-muted-foreground">
                      No personal information collected. You'll receive a transaction ID to claim your donation later if needed.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="guest" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Donate as Guest</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Provide name and email for tax receipt. No account required.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="guest-name">Full Name</Label>
                      <Input
                        id="guest-name"
                        placeholder="John Doe"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guest-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="guest-email"
                          type="email"
                          placeholder="you@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="pl-10 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="registered" className="mt-4 p-4 rounded-xl bg-primary/5">
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-medium text-foreground">Sign in to track your donations</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Access your donation history, manage recurring donations, and more.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `/login?from=${encodeURIComponent("/donate")}`}
                      className="w-full rounded-xl"
                    >
                      Sign In or Create Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {user && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Donating as {user.email}</p>
                  <p className="text-xs text-muted-foreground">Your donation will be saved to your account</p>
                </div>
              </div>
            </div>
          )}

          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Giving Frequency</Label>
            <div className="grid grid-cols-4 gap-2">
              {frequencies.map((f) => (
                <Button
                  key={f.value}
                  variant={frequency === f.value ? "default" : "outline"}
                  onClick={() => setFrequency(f.value)}
                  className={`rounded-xl ${frequency === f.value ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {f.value !== "one-time" && <Repeat className="w-3 h-3 mr-1" />}
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Select Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={selectedAmount === amt && !customAmount ? "default" : "outline"}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                  className={`h-12 text-lg font-semibold rounded-xl ${
                    selectedAmount === amt && !customAmount ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  ${amt}
                </Button>
              ))}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                        type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                className="w-full h-12 pl-12 pr-4 rounded-xl"
                          />
                        </div>
                      </div>

          {/* Allocation Dropdown */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Allocate To</Label>
            <Select value={allocation} onValueChange={setAllocation}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allocations.map((a) => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Dedication */}
          <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
            <Label className="text-sm font-medium text-foreground">Optional: Make this donation in honor of someone</Label>
            <Input
              placeholder="Name (optional)"
              value={dedication.in_honor_of}
              onChange={(e) => setDedication({ ...dedication, in_honor_of: e.target.value })}
              className="h-12 rounded-xl"
            />
            <Input
              placeholder="Message (optional)"
              value={dedication.message}
              onChange={(e) => setDedication({ ...dedication, message: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Donate Button */}
          <Button
            onClick={proceedToCheckout}
            disabled={!amount || isLoading || authLoading}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Heart className="w-5 h-5 mr-2" />
            {isLoading ? "Processing..." : `Donate ${amount ? `$${amount}` : ""} ${isRecurring ? frequency : ""}`}
          </Button>

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

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Secure payment powered by Stripe. Tax-deductible.
          </p>
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
