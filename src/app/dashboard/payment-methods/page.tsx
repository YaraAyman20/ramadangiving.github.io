"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent("/dashboard/payment-methods")}`);
    }
  }, [user, loading, router]);

  // In a real implementation, fetch payment methods from Stripe
  // For now, showing placeholder
  const paymentMethods: any[] = [];

  const handleAddPaymentMethod = () => {
    // Redirect to Stripe payment method setup
    toast.info("Payment method management coming soon. You can add payment methods during checkout.");
  };

  const handleSetDefault = (id: string) => {
    toast.info("Setting default payment method...");
  };

  const handleRemove = (id: string) => {
    toast.info("Removing payment method...");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-muted-foreground mt-1">Manage your saved payment methods</p>
        </div>
        <Button onClick={handleAddPaymentMethod} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No payment methods saved</p>
              <p className="text-sm text-muted-foreground mb-6">
                Payment methods are saved automatically when you make a donation. You can also add one during checkout.
              </p>
              <Button onClick={() => router.push("/donate")} className="rounded-xl">
                Make a Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {method.brand?.toUpperCase()} •••• {method.last_four}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiry_month}/{method.expiry_year}
                      </p>
                    </div>
                    {method.is_default && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        className="rounded-xl"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(method.id)}
                      className="rounded-xl text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Security</h3>
          <p className="text-sm text-muted-foreground">
            Your payment methods are securely stored and encrypted. We never store your full card details.
            All payments are processed securely through Stripe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
