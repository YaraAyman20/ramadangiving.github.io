"use client";

import { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

interface EmbeddedCheckoutFormProps {
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
    returnUrl?: string;
}

export function EmbeddedCheckoutForm({
    amount,
    onSuccess,
    onCancel,
    returnUrl,
}: EmbeddedCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl || `${window.location.origin}/donation-success`,
                },
                redirect: "if_required",
            });

            if (error) {
                setErrorMessage(error.message || "Payment failed. Please try again.");
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setIsComplete(true);
                onSuccess();
            } else if (paymentIntent && paymentIntent.status === "requires_action") {
                // 3D Secure or other authentication required
                // Stripe will handle the redirect automatically
            }
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isComplete) {
        return (
            <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                    Thank You for Your Donation!
                </h3>
                <p className="text-muted-foreground">
                    Your generous gift of ${amount} has been received.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Summary */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Donation Amount</span>
                    <span className="text-2xl font-bold text-primary">${amount}</span>
                </div>
            </div>

            {/* Stripe Payment Element */}
            <div className="space-y-4">
                <PaymentElement
                    options={{
                        layout: "tabs",
                        wallets: {
                            applePay: 'auto',
                            googlePay: 'auto'
                        }
                    }}
                />
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Donate ${amount}
                    </>
                )}
            </Button>

            {/* Cancel Button */}
            <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="w-full text-muted-foreground"
                disabled={isProcessing}
            >
                Cancel
            </Button>
        </form>
    );
}
