"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
    Heart, Package, Sparkles, CreditCard, Loader2, CheckCircle2,
    ArrowLeft, Gift, User, Mail, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { StripeProvider } from "@/components/payments/StripeProvider";
import { EmbeddedCheckoutForm } from "@/components/payments/EmbeddedCheckoutForm";

// ============================================
// TYPES
// ============================================
export type DonorType = "anonymous" | "guest" | "registered";

export interface DonationFormProps {
    /** Variant affects layout and styling */
    variant?: "modal" | "page";
    /** Pre-selected campaign/cause ID */
    initialCampaignId?: string;
    /** Pre-selected campaign title */
    initialCampaignTitle?: string;
    /** Callback when donation is complete */
    onComplete?: () => void;
    /** Callback to close (for modal variant) */
    onClose?: () => void;
    /** Show cause/campaign selector */
    showCauseSelector?: boolean;
    /** Show impact cards */
    showImpactCards?: boolean;
    /** Show dedication fields */
    showDedication?: boolean;
    /** Show frequency selector */
    showFrequencySelector?: boolean;
}

// ============================================
// STATIC DATA
// ============================================
const presetAmounts = [10, 50, 100, 250];

const impactOptions = [
    {
        amount: 10,
        impact: "1 winter kit or hygiene kit for someone in need",
        icon: Heart,
        color: "from-primary/20 to-primary/5",
        borderColor: "border-primary/30",
    },
    {
        amount: 50,
        impact: "2 grocery packs for a vulnerable family",
        icon: Package,
        color: "from-gold/20 to-gold/5",
        borderColor: "border-gold/30",
    },
    {
        amount: 100,
        impact: "10 hot meals for the unhoused",
        icon: Sparkles,
        color: "from-accent/20 to-accent/5",
        borderColor: "border-accent/30",
    },
];

const causeOptions = [
    { id: "general", title: "Where It's Most Needed" },
    { id: "winter-relief", title: "Winter Kits for the Unhoused" },
    { id: "grocery-packs", title: "Grocery Packs" },
    { id: "meals-unhoused", title: "Meals for the Unhoused" },
    { id: "camps-psychosocial", title: "Camps & Psychosocial Programs" },
    { id: "vulnerable-family", title: "Vulnerable Families We're Connected To" },
];

const frequencies = [
    { value: "one-time", label: "One-Time" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
];

// ============================================
// COMPONENT
// ============================================
export function UnifiedDonationForm({
    variant = "page",
    initialCampaignId,
    initialCampaignTitle,
    onComplete,
    onClose,
    showCauseSelector = true,
    showImpactCards = true,
    showDedication = true,
    showFrequencySelector = true,
}: DonationFormProps) {
    const { user } = useAuth();

    // Form state
    const [step, setStep] = useState(1);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedCause, setSelectedCause] = useState(initialCampaignId || "general");
    const [frequency, setFrequency] = useState("one-time");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [donorType, setDonorType] = useState<DonorType>(user ? "registered" : "guest");

    // Guest fields
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    // Dedication fields
    const [dedication, setDedication] = useState({ in_honor_of: "", message: "" });

    // Payment state
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const amount = customAmount ? Number(customAmount) : selectedAmount;
    const isRecurring = frequency !== "one-time";
    const isModal = variant === "modal";

    // Auto-set donor type based on auth
    useEffect(() => {
        if (user && donorType === "guest") {
            setDonorType("registered");
        } else if (!user && donorType === "registered") {
            setDonorType("guest");
        }
    }, [user, donorType]);

    // Reset on close for modal
    useEffect(() => {
        if (!isModal) return;
        return () => {
            resetForm();
        };
    }, [isModal]);

    const resetForm = () => {
        setStep(1);
        setSelectedAmount(50);
        setCustomAmount("");
        setSelectedCause(initialCampaignId || "general");
        setFrequency("one-time");
        setIsAnonymous(false);
        setDedication({ in_honor_of: "", message: "" });
        setClientSecret(null);
        setPaymentSuccess(false);
    };

    const getCauseName = () => {
        if (initialCampaignTitle) return initialCampaignTitle;
        return causeOptions.find(c => c.id === selectedCause)?.title || "Where Most Needed";
    };

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

    const handleSelectAmount = (value: number) => {
        setSelectedAmount(value);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const handleNext = () => {
        if (step === 1 && amount && amount >= 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 3) {
            setClientSecret(null);
            setStep(2);
        } else if (step === 2) {
            setStep(1);
        }
    };

    const initiatePayment = async () => {
        if (!validateForm()) return;

        if (!supabase) {
            toast.error("Payment service is not configured. Please contact support.");
            return;
        }

        setIsLoading(true);
        try {
            const session = await supabase.auth.getSession();
            const authToken = session.data.session?.access_token;

            const effectiveDonorType = isAnonymous ? "anonymous" : donorType;

            const { data, error } = await supabase.functions.invoke("create-payment-intent", {
                body: {
                    amount,
                    currency: "USD",
                    isRecurring,
                    frequency,
                    donorType: effectiveDonorType,
                    guestInfo: effectiveDonorType === "guest" ? {
                        name: guestName,
                        email: guestEmail,
                    } : (user ? {
                        name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Registered User",
                        email: user.email || "",
                    } : undefined),
                    userId: user?.id,
                    campaignId: selectedCause,
                    campaignTitle: getCauseName(),
                    dedication: (dedication.in_honor_of || dedication.message) ? dedication : undefined,
                    mode: "embedded", // Always use embedded mode
                },
                headers: authToken ? {
                    Authorization: `Bearer ${authToken}`,
                } : undefined,
            });

            if (error) {
                throw new Error(error.message || "Failed to initiate payment");
            }

            if (data?.client_secret) {
                if (data.claim_token) {
                    sessionStorage.setItem("donation_claim_token", data.claim_token);
                }
                setClientSecret(data.client_secret);
                setStep(3);
            } else {
                throw new Error("No payment information received");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to initiate payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        setStep(4);
        onComplete?.();
    };

    const handlePaymentCancel = () => {
        setClientSecret(null);
        setStep(2);
    };

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    // ============================================
    // RENDER: Success State
    // ============================================
    if (paymentSuccess || step === 4) {
        return (
            <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Thank You! 💚</h3>
                    <p className="text-lg text-primary font-semibold">
                        Your ${amount} donation is complete
                    </p>
                    <p className="text-muted-foreground">
                        Your generosity will make a real difference in someone's life.
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <p className="text-sm text-muted-foreground">
                        A confirmation email has been sent to your inbox.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        100% of your donation goes directly to supporting our community programs.
                    </p>
                </div>
                <Button
                    onClick={isModal ? handleClose : resetForm}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                    {isModal ? "Done" : "Make Another Donation"}
                </Button>
            </div>
        );
    }

    // ============================================
    // RENDER: Payment Form (Step 3)
    // ============================================
    if (step === 3 && clientSecret && amount) {
        return (
            <div className="space-y-4">
                {isModal && (
                    <div className="flex items-center gap-2 mb-4">
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                        <span className="text-sm text-muted-foreground">Step 3 of 3</span>
                    </div>
                )}
                <StripeProvider clientSecret={clientSecret}>
                    <EmbeddedCheckoutForm
                        amount={amount}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handlePaymentCancel}
                    />
                </StripeProvider>
            </div>
        );
    }

    // ============================================
    // RENDER: Confirmation (Step 2)
    // ============================================
    if (step === 2) {
        return (
            <div className="space-y-5">
                {/* Summary */}
                <div className="space-y-3 p-4 rounded-xl bg-secondary/50">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Your Gift</span>
                        <span className="text-2xl font-bold text-foreground">${amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cause</span>
                        <span className="font-medium text-foreground">{getCauseName()}</span>
                    </div>
                    {isRecurring && (
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Frequency</span>
                            <span className="font-medium text-foreground capitalize">{frequency}</span>
                        </div>
                    )}
                </div>

                {/* Guest Info (if not logged in and not anonymous) */}
                {!user && donorType === "guest" && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Your Information</Label>
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Your name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                        <Label className="text-foreground font-medium">Make it anonymous</Label>
                        <p className="text-xs text-muted-foreground">Your name won't be displayed publicly</p>
                    </div>
                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>

                {/* Dedication (optional) */}
                {showDedication && (
                    <div className="space-y-3">
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            Dedicate this gift (optional)
                        </Label>
                        <Input
                            placeholder="In honor of..."
                            value={dedication.in_honor_of}
                            onChange={(e) => setDedication(d => ({ ...d, in_honor_of: e.target.value }))}
                        />
                        <Input
                            placeholder="Add a message..."
                            value={dedication.message}
                            onChange={(e) => setDedication(d => ({ ...d, message: e.target.value }))}
                        />
                    </div>
                )}

                {/* Continue Button */}
                <Button
                    onClick={initiatePayment}
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
                            Continue to Payment
                        </>
                    )}
                </Button>

                {/* Back Button */}
                <Button variant="ghost" onClick={handleBack} className="w-full text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>
        );
    }

    // ============================================
    // RENDER: Amount Selection (Step 1)
    // ============================================
    return (
        <div className="space-y-6">
            {/* Impact Cards (Modal variant) */}
            {showImpactCards && isModal && (
                <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Select an impact level</Label>
                    {impactOptions.map((option) => (
                        <button
                            key={option.amount}
                            onClick={() => handleSelectAmount(option.amount)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                `bg-gradient-to-r ${option.color}`,
                                selectedAmount === option.amount
                                    ? `${option.borderColor} border-2 ring-2 ring-offset-2 ring-primary/20`
                                    : "border-transparent hover:border-border"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                                    <option.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">${option.amount}</p>
                                    <p className="text-sm text-muted-foreground">{option.impact}</p>
                                </div>
                                {selectedAmount === option.amount && (
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Preset Amounts (Page variant) */}
            {!isModal && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Select Amount</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {presetAmounts.map((preset) => (
                            <Button
                                key={preset}
                                variant={selectedAmount === preset ? "default" : "outline"}
                                className={cn(
                                    "h-12 text-sm font-semibold rounded-xl",
                                    selectedAmount === preset
                                        ? "bg-primary text-primary-foreground"
                                        : "border-border hover:border-primary/50"
                                )}
                                onClick={() => handleSelectAmount(preset)}
                            >
                                ${preset}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Amount */}
            <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                    {isModal ? "Or enter a custom amount" : "Custom Amount"}
                </Label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                    <Input
                        type="number"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="h-12 pl-8 text-lg rounded-xl"
                    />
                </div>
            </div>

            {/* Cause Selector */}
            {showCauseSelector && !initialCampaignId && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Allocate to</Label>
                    <Select value={selectedCause} onValueChange={setSelectedCause}>
                        <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select a cause" />
                        </SelectTrigger>
                        <SelectContent>
                            {causeOptions.map((cause) => (
                                <SelectItem key={cause.id} value={cause.id}>
                                    {cause.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Frequency Selector */}
            {showFrequencySelector && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Frequency</Label>
                    <RadioGroup
                        value={frequency}
                        onValueChange={setFrequency}
                        className="grid grid-cols-4 gap-2"
                    >
                        {frequencies.map((freq) => (
                            <div key={freq.value}>
                                <RadioGroupItem value={freq.value} id={`freq-${freq.value}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`freq-${freq.value}`}
                                    className={cn(
                                        "flex items-center justify-center h-10 rounded-xl border-2 cursor-pointer transition-all text-sm",
                                        frequency === freq.value
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    {freq.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )}

            {/* Continue Button */}
            <Button
                onClick={handleNext}
                disabled={!amount || amount < 1 || isLoading}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                )}
            </Button>

            {isModal && onClose && (
                <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground">
                    Cancel
                </Button>
            )}
        </div>
    );
}
