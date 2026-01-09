"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, MapPin, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent("/dashboard/profile")}`);
    }
  }, [user, loading, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      if (profile.address && typeof profile.address === "object") {
        setAddress({
          street: profile.address.street || "",
          city: profile.address.city || "",
          state: profile.address.state || "",
          zip: profile.address.zip || "",
          country: profile.address.country || "",
        });
      }
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ fullName, phone, address });
  };

  if (loading || isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {fullName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" className="rounded-xl">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="pl-10 h-12 rounded-xl bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <Label>Mailing Address (for tax receipts)</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="h-12 rounded-xl"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <Input
                    placeholder="State/Province"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="ZIP/Postal Code"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <Input
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateProfile.isPending}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
