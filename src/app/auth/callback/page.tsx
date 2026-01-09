"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        router.push("/login?error=config_error");
        return;
      }

      // Wait a moment for Supabase to process the OAuth callback
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the session - Supabase should have processed the OAuth callback by now
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=auth_failed");
        return;
      }

      if (data.session) {
        // Get the redirect URL from the URL params or default to home
        const redirectTo = searchParams.get("redirect_to") || "/";
        router.push(redirectTo);
      } else {
        // If no session, wait a bit more and try again
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData.session) {
            const redirectTo = searchParams.get("redirect_to") || "/";
            router.push(redirectTo);
          } else {
            router.push("/login?error=no_session");
          }
        }, 1000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
